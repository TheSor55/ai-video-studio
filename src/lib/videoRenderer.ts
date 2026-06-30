/**
 * Video Renderer Engine
 *
 * Renders scenes with animations on a Canvas element,
 * then captures the stream using MediaRecorder to produce
 * a downloadable video file (WebM/MP4).
 */
import type { Scene, Project, ExportState } from './types'
import { SCENE_GRADIENTS } from './constants'

// ─── Resolution map ───
const RESOLUTIONS: Record<string, [number, number]> = {
  '720p': [1280, 720],
  '1080p': [1920, 1080],
  '2k': [2560, 1440],
  '4k': [3840, 2160],
}

const ASPECT_RATIOS: Record<string, [number, number]> = {
  youtube: [16, 9],
  tiktok: [9, 16],
  facebook: [4, 5],
  instagram: [1, 1],
  presentation: [16, 9],
}

// ─── Get canvas dimensions from project settings ───
function getCanvasSize(project: Project): [number, number] {
  const ratio = ASPECT_RATIOS[project.exportPreset] || [16, 9]
  const baseRes = RESOLUTIONS[project.resolution] || [1920, 1080]

  // Calculate based on aspect ratio and resolution
  const baseWidth = baseRes[0]
  const height = Math.round(baseWidth * ratio[1] / ratio[0])
  return [baseWidth, height]
}

// ─── Load image from data URL ───
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// ─── Parse gradient string to draw on canvas ───
function drawGradientBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  gradientStr: string
) {
  // Simple gradient fallback
  const grad = ctx.createLinearGradient(0, 0, w, h)
  grad.addColorStop(0, '#0F172A')
  grad.addColorStop(0.5, '#1E293B')
  grad.addColorStop(1, '#7C3AED')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)
}

// ─── Animation functions ───
// Each returns transform params for a given progress (0-1)
interface TransformParams {
  scale: number
  offsetX: number
  offsetY: number
  opacity: number
}

function getAnimationTransform(
  animation: string,
  progress: number,
  intensity: number = 50
): TransformParams {
  const i = intensity / 100 // 0-1
  const maxZoom = 0.15 * i + 0.05 // 5%-20% zoom range

  switch (animation) {
    case 'zoomIn':
      return {
        scale: 1 + progress * maxZoom * 2,
        offsetX: 0,
        offsetY: 0,
        opacity: 1,
      }
    case 'zoomOut':
      return {
        scale: 1 + maxZoom * 2 - progress * maxZoom * 2,
        offsetX: 0,
        offsetY: 0,
        opacity: 1,
      }
    case 'panLeft':
      return {
        scale: 1.1,
        offsetX: -progress * maxZoom * 4,
        offsetY: 0,
        opacity: 1,
      }
    case 'panRight':
      return {
        scale: 1.1,
        offsetX: progress * maxZoom * 4,
        offsetY: 0,
        opacity: 1,
      }
    case 'kenBurns': {
      // Slow zoom + slight drift
      const angle = progress * Math.PI * 0.5
      return {
        scale: 1 + progress * maxZoom * 1.5,
        offsetX: Math.sin(angle) * maxZoom * 0.5,
        offsetY: Math.cos(angle) * maxZoom * 0.3,
        opacity: 1,
      }
    }
    case 'parallax':
      return {
        scale: 1.15,
        offsetX: Math.sin(progress * Math.PI) * maxZoom * 2,
        offsetY: Math.cos(progress * Math.PI * 0.5) * maxZoom,
        opacity: 1,
      }
    case 'fadeIn':
      return {
        scale: 1.05,
        offsetX: 0,
        offsetY: 0,
        opacity: Math.min(1, progress * 3), // fade in over first third
      }
    case 'float':
      return {
        scale: 1.05,
        offsetX: 0,
        offsetY: Math.sin(progress * Math.PI * 2) * maxZoom * 0.5,
        opacity: 1,
      }
    default:
      return { scale: 1.05, offsetX: 0, offsetY: 0, opacity: 1 }
  }
}

// ─── Draw a single frame ───
async function drawFrame(
  ctx: CanvasRenderingContext2D,
  scene: Scene,
  sceneIndex: number,
  progress: number, // 0-1 within this scene
  project: Project,
  width: number,
  height: number,
  imageCache: Map<number, HTMLImageElement>
) {
  const { scale, offsetX, offsetY, opacity } = getAnimationTransform(
    scene.animation || 'kenBurns',
    progress,
    scene.animIntensity || 50
  )

  // Clear
  ctx.clearRect(0, 0, width, height)

  // Background
  drawGradientBackground(ctx, width, height, SCENE_GRADIENTS[sceneIndex % SCENE_GRADIENTS.length])

  // Image with animation
  ctx.save()
  ctx.globalAlpha = opacity

  const img = imageCache.get(sceneIndex)
  if (img) {
    // Calculate cover fit
    const imgRatio = img.width / img.height
    const canvasRatio = width / height

    let drawW: number, drawH: number
    if (imgRatio > canvasRatio) {
      drawH = height * scale
      drawW = drawH * imgRatio
    } else {
      drawW = width * scale
      drawH = drawW / imgRatio
    }

    const x = (width - drawW) / 2 + offsetX * width
    const y = (height - drawH) / 2 + offsetY * height

    ctx.drawImage(img, x, y, drawW, drawH)
  }
  ctx.restore()

  // Scene title (center)
  ctx.save()
  ctx.textAlign = 'center'
  ctx.fillStyle = '#FFFFFF'
  ctx.shadowColor = 'rgba(0,0,0,0.8)'
  ctx.shadowBlur = 10
  const titleSize = Math.round(height * 0.05)
  ctx.font = `bold ${titleSize}px "Noto Sans Thai", "Inter", sans-serif`
  ctx.fillText(scene.title || '', width / 2, height * 0.45)
  ctx.restore()

  // Subtitle (bottom)
  if (scene.narration) {
    const subText = scene.narration.length > 80
      ? scene.narration.slice(0, 80) + '...'
      : scene.narration

    const subFontSize = Math.round(height * 0.028)
    ctx.font = `${subFontSize}px "Noto Sans Thai", "Inter", sans-serif`

    const textMetrics = ctx.measureText(subText)
    const padding = 16
    const boxW = textMetrics.width + padding * 2
    const boxH = subFontSize + padding * 2
    const boxX = (width - boxW) / 2
    const boxY = height * (project.subtitlePosition === 'top' ? 0.08 : 0.82)

    if (project.subtitleBg) {
      ctx.fillStyle = project.subtitleBg
      ctx.beginPath()
      ctx.roundRect(boxX, boxY, boxW, boxH, 6)
      ctx.fill()
    }

    ctx.fillStyle = project.subtitleColor || '#FFFFFF'
    ctx.textAlign = 'center'
    ctx.fillText(subText, width / 2, boxY + boxH / 2 + subFontSize * 0.35)
  }

  // Watermark
  if (project.brand.watermark && project.brand.footer) {
    const wmSize = Math.round(height * 0.018)
    ctx.font = `${wmSize}px "Noto Sans Thai", "Inter", sans-serif`
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.textAlign = 'right'
    ctx.fillText(project.brand.footer, width - 20, 30)
  }
}

// ─── Draw transition frame between two scenes ───
function drawTransition(
  ctx: CanvasRenderingContext2D,
  transition: string,
  progress: number, // 0-1
  width: number,
  height: number,
  fromFrame: ImageData | null,
  toFrame: ImageData | null
) {
  if (fromFrame) {
    ctx.putImageData(fromFrame, 0, 0)
  }

  if (!toFrame) return

  switch (transition) {
    case 'fade':
    case 'dissolve':
      ctx.globalAlpha = progress
      ctx.putImageData(toFrame, 0, 0)
      ctx.globalAlpha = 1
      break

    case 'slideLeft': {
      const offset = Math.round((1 - progress) * width)
      ctx.putImageData(toFrame, offset, 0)
      break
    }

    case 'slideRight': {
      const offset = Math.round(-(1 - progress) * width)
      ctx.putImageData(toFrame, offset, 0)
      break
    }

    case 'zoomIn': {
      ctx.save()
      const s = progress
      ctx.globalAlpha = progress
      ctx.translate(width / 2, height / 2)
      ctx.scale(s, s)
      ctx.translate(-width / 2, -height / 2)
      ctx.putImageData(toFrame, 0, 0)
      ctx.restore()
      break
    }

    case 'wipe': {
      const wipeX = Math.round(progress * width)
      ctx.putImageData(toFrame, 0, 0, 0, 0, wipeX, height)
      break
    }

    case 'blur':
    case 'cinematic':
    default:
      // Simple crossfade for complex transitions
      ctx.globalAlpha = progress
      ctx.putImageData(toFrame, 0, 0)
      ctx.globalAlpha = 1
      break
  }
}

// ─── Main Export Function ───
export async function exportVideo(
  project: Project,
  onProgress: (state: ExportState) => void
): Promise<string> {
  const [width, height] = getCanvasSize(project)
  const fps = project.fps || 30

  onProgress({
    status: 'preparing',
    progress: 0,
    currentScene: 0,
    totalScenes: project.scenes.length,
    message: 'กำลังเตรียมข้อมูล...',
  })

  // Create offscreen canvas
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!

  // Preload all images
  const imageCache = new Map<number, HTMLImageElement>()
  for (let i = 0; i < project.scenes.length; i++) {
    const scene = project.scenes[i]
    if (scene.imageData) {
      try {
        const img = await loadImage(scene.imageData)
        imageCache.set(i, img)
      } catch (e) {
        console.warn(`Failed to load image for scene ${i}`, e)
      }
    }
    onProgress({
      status: 'preparing',
      progress: ((i + 1) / project.scenes.length) * 10,
      currentScene: i,
      totalScenes: project.scenes.length,
      message: `โหลดรูปภาพ ${i + 1}/${project.scenes.length}...`,
    })
  }

  // Setup MediaRecorder
  const stream = canvas.captureStream(fps)
  const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
    ? 'video/webm;codecs=vp9'
    : 'video/webm'

  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: width >= 1920 ? 8_000_000 : 4_000_000,
  })

  const chunks: Blob[] = []
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data)
  }

  const recordingDone = new Promise<Blob>((resolve) => {
    recorder.onstop = () => {
      resolve(new Blob(chunks, { type: mimeType }))
    }
  })

  recorder.start(100) // collect data every 100ms

  // Render all scenes frame by frame
  const totalDuration = project.scenes.reduce((s, sc) => s + (sc.duration || 5), 0)
  const transitionDuration = project.transitionDuration || 1
  let totalFramesRendered = 0
  const totalFrames = totalDuration * fps

  for (let sceneIdx = 0; sceneIdx < project.scenes.length; sceneIdx++) {
    const scene = project.scenes[sceneIdx]
    const sceneDuration = scene.duration || 5
    const sceneFrames = sceneDuration * fps

    onProgress({
      status: 'rendering',
      progress: 10 + (sceneIdx / project.scenes.length) * 80,
      currentScene: sceneIdx + 1,
      totalScenes: project.scenes.length,
      message: `เรนเดอร์ Scene ${sceneIdx + 1}: ${scene.title}...`,
    })

    for (let frame = 0; frame < sceneFrames; frame++) {
      const sceneProgress = frame / sceneFrames

      // Check if we're in transition zone (last N frames of scene)
      const transFrames = Math.round(transitionDuration * fps)
      const isInTransition = frame >= sceneFrames - transFrames && sceneIdx < project.scenes.length - 1

      // Draw main scene
      await drawFrame(ctx, scene, sceneIdx, sceneProgress, project, width, height, imageCache)

      // If in transition zone, blend with next scene
      if (isInTransition) {
        const transProgress = (frame - (sceneFrames - transFrames)) / transFrames
        const fromData = ctx.getImageData(0, 0, width, height)

        // Draw next scene at its start
        const nextScene = project.scenes[sceneIdx + 1]
        await drawFrame(ctx, nextScene, sceneIdx + 1, 0, project, width, height, imageCache)
        const toData = ctx.getImageData(0, 0, width, height)

        // Apply transition
        drawTransition(ctx, scene.transition || 'fade', transProgress, width, height, fromData, toData)
      }

      totalFramesRendered++

      // Yield to UI thread periodically
      if (totalFramesRendered % (fps * 2) === 0) {
        await new Promise((r) => setTimeout(r, 0))
        onProgress({
          status: 'rendering',
          progress: 10 + (totalFramesRendered / totalFrames) * 80,
          currentScene: sceneIdx + 1,
          totalScenes: project.scenes.length,
          message: `เรนเดอร์ Scene ${sceneIdx + 1}: ${scene.title} (${Math.round((frame / sceneFrames) * 100)}%)`,
        })
      }

      // Wait for next frame timing
      await new Promise((r) => setTimeout(r, 1000 / fps / 4)) // render faster than real-time
    }
  }

  // Stop recording
  onProgress({
    status: 'encoding',
    progress: 92,
    currentScene: project.scenes.length,
    totalScenes: project.scenes.length,
    message: 'กำลังเข้ารหัสวิดีโอ...',
  })

  recorder.stop()
  const blob = await recordingDone

  // Create download URL
  const url = URL.createObjectURL(blob)

  onProgress({
    status: 'done',
    progress: 100,
    currentScene: project.scenes.length,
    totalScenes: project.scenes.length,
    message: `เสร็จสิ้น! ขนาดไฟล์: ${(blob.size / 1024 / 1024).toFixed(1)} MB`,
    downloadUrl: url,
  })

  return url
}

// ─── Preview animation on canvas (for real-time preview) ───
export function animatePreview(
  canvas: HTMLCanvasElement,
  scene: Scene,
  sceneIndex: number,
  project: Project,
  imageCache: Map<number, HTMLImageElement>
): () => void {
  const ctx = canvas.getContext('2d')!
  let animFrame: number
  let startTime = Date.now()

  function render() {
    const elapsed = (Date.now() - startTime) / 1000
    const duration = scene.duration || 5
    const progress = (elapsed % duration) / duration

    drawFrame(ctx, scene, sceneIndex, progress, project, canvas.width, canvas.height, imageCache)
    animFrame = requestAnimationFrame(render)
  }

  render()

  return () => cancelAnimationFrame(animFrame)
}
