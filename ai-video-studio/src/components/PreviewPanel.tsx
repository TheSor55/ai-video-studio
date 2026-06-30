import { useState, useEffect, useRef } from 'react'
import { Play, Pause, SkipBack, SkipForward, Clapperboard, Camera } from 'lucide-react'
import type { Project } from '../lib/types'
import { SCENE_GRADIENTS } from '../lib/constants'

// CSS animation keyframes for each animation type
const ANIM_CSS: Record<string, string> = {
  zoomIn: 'transform: scale(1); animation: anim-zoom-in var(--dur) ease-in-out infinite alternate',
  zoomOut: 'transform: scale(1.2); animation: anim-zoom-out var(--dur) ease-in-out infinite alternate',
  panLeft: 'transform: translateX(5%); animation: anim-pan-left var(--dur) ease-in-out infinite alternate',
  panRight: 'transform: translateX(-5%); animation: anim-pan-right var(--dur) ease-in-out infinite alternate',
  kenBurns: 'transform: scale(1); animation: anim-ken-burns var(--dur) ease-in-out infinite alternate',
  parallax: 'animation: anim-parallax var(--dur) ease-in-out infinite alternate',
  fadeIn: 'animation: anim-fade-in var(--dur) ease-in-out infinite',
  float: 'animation: anim-float var(--dur) ease-in-out infinite',
}

const KEYFRAMES = `
@keyframes anim-zoom-in { 0%{transform:scale(1)} 100%{transform:scale(1.15)} }
@keyframes anim-zoom-out { 0%{transform:scale(1.2)} 100%{transform:scale(1)} }
@keyframes anim-pan-left { 0%{transform:translateX(5%) scale(1.05)} 100%{transform:translateX(-5%) scale(1.05)} }
@keyframes anim-pan-right { 0%{transform:translateX(-5%) scale(1.05)} 100%{transform:translateX(5%) scale(1.05)} }
@keyframes anim-ken-burns { 0%{transform:scale(1) translate(0,0)} 100%{transform:scale(1.15) translate(-2%,-1%)} }
@keyframes anim-parallax { 0%{transform:scale(1.1) translateX(-2%)} 100%{transform:scale(1.1) translateX(2%)} }
@keyframes anim-fade-in { 0%{opacity:0.3;transform:scale(1.05)} 30%{opacity:1;transform:scale(1.05)} 100%{opacity:1;transform:scale(1.05)} }
@keyframes anim-float { 0%{transform:translateY(0) scale(1.05)} 50%{transform:translateY(-1.5%) scale(1.05)} 100%{transform:translateY(0) scale(1.05)} }
`

interface Props {
  project: Project
  activeScene: number
  isPlaying: boolean
  onTogglePlay: () => void
  onPrevScene?: () => void
  onNextScene?: () => void
}

export default function PreviewPanel({ project, activeScene, isPlaying, onTogglePlay, onPrevScene, onNextScene }: Props) {
  const scene = project.scenes[activeScene]
  const [previewTime, setPreviewTime] = useState(0)

  useEffect(() => {
    if (!isPlaying) return
    const iv = setInterval(() => setPreviewTime(t => (t >= 100 ? 0 : t + 1)), 50)
    return () => clearInterval(iv)
  }, [isPlaying])

  const totalDuration = project.scenes.reduce((s, sc) => s + (sc.duration || 5), 0)
  const animDur = `${(scene?.duration || 5)}s`

  return (
    <div className="flex flex-col h-full">
      <style>{KEYFRAMES}</style>

      {/* Video Preview Area */}
      <div className="flex-1 relative bg-black rounded-xl overflow-hidden flex items-center justify-center min-h-0">
        {scene ? (
          <div
            className="relative w-full h-full overflow-hidden"
            style={{
              background: SCENE_GRADIENTS[activeScene % SCENE_GRADIENTS.length],
            }}
          >
            {/* Image with animation */}
            {scene.imageData ? (
              <img
                key={`${activeScene}-${scene.animation}`}
                src={scene.imageData}
                alt={scene.title}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  ['--dur' as string]: animDur,
                  ...(isPlaying && scene.animation ? {
                    animation: `anim-${scene.animation === 'kenBurns' ? 'ken-burns' : scene.animation === 'zoomIn' ? 'zoom-in' : scene.animation === 'zoomOut' ? 'zoom-out' : scene.animation === 'panLeft' ? 'pan-left' : scene.animation === 'panRight' ? 'pan-right' : scene.animation === 'fadeIn' ? 'fade-in' : scene.animation} ${animDur} ease-in-out infinite alternate`,
                  } : {
                    transform: 'scale(1.02)',
                  }),
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="w-12 h-12 text-white/10" />
              </div>
            )}

            {/* Overlay content */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
              {/* Top bar */}
              <div className="flex justify-between items-start">
                <div className="bg-black/60 text-white text-xs px-2.5 py-1 rounded-full font-mono">
                  Scene {activeScene + 1} / {project.scenes.length}
                </div>
                <div className="flex gap-2">
                  <div className="bg-violet-500/30 text-violet-200 text-xs px-2.5 py-1 rounded-full">
                    🎬 {scene.animation || 'kenBurns'}
                  </div>
                  {project.brand.watermark && (
                    <div
                      className="text-xs font-semibold px-2 py-1 rounded bg-black/20"
                      style={{ color: project.brand.primaryColor }}
                    >
                      {project.brand.footer}
                    </div>
                  )}
                </div>
              </div>

              {/* Scene content */}
              <div className="space-y-2">
                {!scene.imageData && (
                  <div className="text-center">
                    <span className="text-xl font-bold text-white drop-shadow-lg">
                      {scene.title}
                    </span>
                  </div>
                )}
                {scene.narration && (
                  <div
                    className="mx-auto max-w-lg text-center px-4 py-2 rounded-md"
                    style={{
                      backgroundColor: project.subtitleBg,
                      color: project.subtitleColor,
                      fontSize: `${Math.max(12, project.subtitleSize * 0.6)}px`,
                    }}
                  >
                    {scene.narration.length > 100
                      ? scene.narration.slice(0, 100) + '...'
                      : scene.narration}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-500 space-y-3 p-8">
            <Clapperboard className="w-20 h-20 mx-auto opacity-20" />
            <p className="text-base font-medium">AI Video Studio</p>
            <p className="text-sm">สร้าง Storyboard เพื่อเริ่มต้นสร้างวิดีโอ</p>
          </div>
        )}
      </div>

      {/* Transport Controls */}
      <div className="mt-3 space-y-2">
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden cursor-pointer">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 rounded-full transition-all"
            style={{ width: `${previewTime}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono w-20">
            {Math.floor((previewTime / 100) * totalDuration)}s / {totalDuration}s
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={onPrevScene}
              className="p-1.5 hover:bg-white/5 rounded-md text-slate-400 hover:text-white transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={onTogglePlay}
              className="p-2.5 bg-violet-600 hover:bg-violet-500 rounded-full text-white transition-colors shadow-lg shadow-violet-500/20"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <button
              onClick={onNextScene}
              className="p-1.5 hover:bg-white/5 rounded-md text-slate-400 hover:text-white transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
          <span className="text-xs text-slate-500 w-20 text-right">
            {scene?.imageData ? '📷' : '🎨'} {project.scenes.length > 0 ? `Scene ${activeScene + 1}/${project.scenes.length}` : 'No scenes'}
          </span>
        </div>
      </div>
    </div>
  )
}
