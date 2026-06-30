import { Badge } from './ui'
import type { Project } from '../lib/types'
import { SCENE_GRADIENTS } from '../lib/constants'

interface Props {
  project: Project
  activeScene: number
  onSelectScene: (i: number) => void
}

export default function TimelinePanel({ project, activeScene, onSelectScene }: Props) {
  const totalDuration = project.scenes.reduce((s, sc) => s + (sc.duration || 5), 0) || 1

  const tracks = [
    { label: '🎬 Video', color: 'bg-violet-500/40', inactive: 'bg-violet-500/10' },
    { label: '🎤 Voice', color: 'bg-sky-500/40', inactive: 'bg-sky-500/10' },
    { label: '📝 Subtitle', color: 'bg-amber-500/40', inactive: 'bg-amber-500/10' },
    { label: '🎵 Music', color: 'bg-emerald-500/40', inactive: 'bg-emerald-500/10' },
  ]

  return (
    <div className="bg-slate-900/80 border-t border-slate-700/50 p-3">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Timeline
        </span>
        <Badge>{project.scenes.length} scenes</Badge>
        <Badge>{totalDuration}s total</Badge>
      </div>

      {/* Scene blocks */}
      <div className="flex gap-1 overflow-x-auto pb-1 custom-scroll">
        {project.scenes.map((scene, i) => {
          const widthPct = Math.max(8, ((scene.duration || 5) / totalDuration) * 100)
          return (
            <div
              key={i}
              onClick={() => onSelectScene(i)}
              className={`flex-shrink-0 h-14 rounded-md cursor-pointer transition-all flex items-center justify-center overflow-hidden border-2 ${
                i === activeScene
                  ? 'border-violet-500 shadow-md shadow-violet-500/20'
                  : 'border-transparent hover:border-slate-600'
              }`}
              style={{
                width: `${widthPct}%`,
                minWidth: 70,
                background: scene.thumbnail || SCENE_GRADIENTS[i % SCENE_GRADIENTS.length],
              }}
            >
              <div className="text-center px-1">
                <span className="text-xs text-white font-semibold drop-shadow truncate block">
                  {scene.title || `S${i + 1}`}
                </span>
                <span className="text-[10px] text-white/60 font-mono">{scene.duration || 5}s</span>
              </div>
            </div>
          )
        })}

        {project.scenes.length === 0 && (
          <div className="flex-1 h-14 rounded-md border border-dashed border-slate-700 flex items-center justify-center text-xs text-slate-500">
            ยังไม่มี Scene — สร้าง Storyboard เพื่อเริ่มต้น
          </div>
        )}
      </div>

      {/* Multi-track view */}
      <div className="mt-2 space-y-1">
        {tracks.map(track => (
          <div key={track.label} className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 w-16 flex-shrink-0 truncate">
              {track.label}
            </span>
            <div className="flex-1 h-4 bg-slate-800 rounded-sm overflow-hidden flex gap-px">
              {project.scenes.map((scene, i) => (
                <div
                  key={i}
                  className={`h-full rounded-sm transition-colors ${
                    i === activeScene ? track.color : track.inactive
                  }`}
                  style={{
                    width: `${Math.max(4, ((scene.duration || 5) / totalDuration) * 100)}%`,
                    minWidth: 3,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
