import { useState, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Clapperboard, Camera } from 'lucide-react'
import type { Project } from '../lib/types'
import { SCENE_GRADIENTS } from '../lib/constants'

interface Props {
  project: Project
  activeScene: number
  isPlaying: boolean
  onTogglePlay: () => void
}

export default function PreviewPanel({ project, activeScene, isPlaying, onTogglePlay }: Props) {
  const scene = project.scenes[activeScene]
  const [previewTime, setPreviewTime] = useState(0)

  useEffect(() => {
    if (!isPlaying) return
    const iv = setInterval(() => setPreviewTime(t => (t >= 100 ? 0 : t + 1)), 50)
    return () => clearInterval(iv)
  }, [isPlaying])

  const totalDuration = project.scenes.reduce((s, sc) => s + (sc.duration || 5), 0)

  return (
    <div className="flex flex-col h-full">
      {/* Video Preview Area */}
      <div className="flex-1 relative bg-black rounded-xl overflow-hidden flex items-center justify-center min-h-0">
        {scene ? (
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{
              background: scene.thumbnail || SCENE_GRADIENTS[activeScene % SCENE_GRADIENTS.length],
            }}
          >
            {scene.image && (
              <img src={scene.image} alt="" className="absolute inset-0 w-full h-full object-contain" />
            )}

            <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
              {/* Watermark */}
              {project.brand.watermark && (
                <div
                  className="self-end text-xs font-semibold px-2 py-1 rounded bg-black/20"
                  style={{ color: project.brand.primaryColor }}
                >
                  {project.brand.footer}
                </div>
              )}

              {/* Scene content */}
              <div className="space-y-2">
                <div className="text-center">
                  <span className="text-xl font-bold text-white drop-shadow-lg">
                    {scene.title}
                  </span>
                </div>
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

            {/* Scene number indicator */}
            <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full font-mono">
              Scene {activeScene + 1} / {project.scenes.length}
            </div>

            {/* Animation indicator */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-violet-500/30 text-violet-200 text-xs px-2.5 py-1 rounded-full">
              🎬 {scene.animation || 'kenBurns'}
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
        {/* Progress Bar */}
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden cursor-pointer">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 rounded-full transition-all"
            style={{ width: `${previewTime}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono w-20">
            {Math.floor((previewTime / 100) * totalDuration)}s / {totalDuration}s
          </span>

          <div className="flex items-center gap-1">
            <button className="p-1.5 hover:bg-white/5 rounded-md text-slate-400 hover:text-white transition-colors">
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={onTogglePlay}
              className="p-2.5 bg-violet-600 hover:bg-violet-500 rounded-full text-white transition-colors shadow-lg shadow-violet-500/20"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <button className="p-1.5 hover:bg-white/5 rounded-md text-slate-400 hover:text-white transition-colors">
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <span className="text-xs text-slate-500 w-20 text-right">
            {project.scenes.length > 0 ? `Scene ${activeScene + 1}/${project.scenes.length}` : 'No scenes'}
          </span>
        </div>
      </div>
    </div>
  )
}
