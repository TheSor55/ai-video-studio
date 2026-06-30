import { Film } from 'lucide-react'
import { Slider, Select } from '../ui'
import { ANIMATION_TYPES } from '../../lib/constants'
import type { Project } from '../../lib/types'

interface Props {
  project: Project
  setProject: React.Dispatch<React.SetStateAction<Project>>
  activeScene: number
}

export default function AnimationPanel({ project, setProject, activeScene }: Props) {
  const scene = project.scenes[activeScene]

  const updateScene = (updates: Record<string, any>) => {
    setProject(p => ({
      ...p,
      scenes: p.scenes.map((s, i) => (i === activeScene ? { ...s, ...updates } : s)),
    }))
  }

  return (
    <div className="space-y-5 overflow-y-auto max-h-[calc(100vh-220px)] pr-1 custom-scroll">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <Film className="w-4 h-4 text-violet-400" /> Animation Settings
      </h3>

      {!scene ? (
        <p className="text-xs text-slate-500">สร้าง Storyboard ก่อนเพื่อตั้งค่า Animation</p>
      ) : (
        <>
          <div>
            <label className="text-xs text-slate-400 mb-2 block">
              Scene {activeScene + 1}: {scene.title}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ANIMATION_TYPES.map(a => (
                <button
                  key={a.id}
                  onClick={() => updateScene({ animation: a.id })}
                  className={`p-2.5 rounded-lg border text-xs text-left transition-all ${
                    scene.animation === a.id
                      ? 'border-violet-500 bg-violet-500/10 text-white'
                      : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <span className="text-base">{a.icon}</span>
                  <span className="ml-1.5 font-medium">{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          <Slider label="Duration" value={scene.duration || 5} onChange={v => updateScene({ duration: v })} min={3} max={30} unit="s" />
          <Slider label="Speed" value={scene.animSpeed || 1} onChange={v => updateScene({ animSpeed: v })} min={0.1} max={3} step={0.1} unit="x" />
          <Slider label="Intensity" value={scene.animIntensity || 50} onChange={v => updateScene({ animIntensity: v })} min={0} max={100} unit="%" />

          <div className="border-t border-slate-700/50 pt-4">
            <h4 className="text-xs font-semibold text-slate-400 mb-2">Global Default</h4>
            <Select
              label="Apply to all scenes"
              value={project.globalAnimation}
              onChange={v => {
                setProject(p => ({
                  ...p,
                  globalAnimation: v,
                  scenes: p.scenes.map(s => ({ ...s, animation: v })),
                }))
              }}
              options={ANIMATION_TYPES.map(a => ({ value: a.id, label: `${a.icon} ${a.label}` }))}
            />
          </div>
        </>
      )}
    </div>
  )
}
