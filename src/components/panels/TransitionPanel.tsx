import { Layers } from 'lucide-react'
import { Slider, Btn } from '../ui'
import { TRANSITION_TYPES } from '../../lib/constants'
import type { Project } from '../../lib/types'

interface Props {
  project: Project
  setProject: React.Dispatch<React.SetStateAction<Project>>
  activeScene: number
}

export default function TransitionPanel({ project, setProject, activeScene }: Props) {
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
        <Layers className="w-4 h-4 text-violet-400" /> Transitions
      </h3>

      {!scene ? (
        <p className="text-xs text-slate-500">สร้าง Storyboard ก่อน</p>
      ) : (
        <>
          <label className="text-xs text-slate-400">
            Scene {activeScene + 1}: {scene.title}
          </label>

          <div className="grid grid-cols-2 gap-2">
            {TRANSITION_TYPES.map(t => (
              <button
                key={t.id}
                onClick={() => updateScene({ transition: t.id })}
                className={`p-3 rounded-lg border text-xs font-medium transition-all text-center ${
                  scene.transition === t.id
                    ? 'border-violet-500 bg-violet-500/10 text-white'
                    : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-500'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <Slider
            label="Transition Duration"
            value={project.transitionDuration}
            onChange={v => setProject(p => ({ ...p, transitionDuration: v }))}
            min={0.3}
            max={3}
            step={0.1}
            unit="s"
          />

          <div className="border-t border-slate-700/50 pt-3">
            <Btn
              size="sm"
              className="w-full"
              onClick={() => {
                setProject(p => ({
                  ...p,
                  scenes: p.scenes.map(s => ({ ...s, transition: scene.transition })),
                }))
              }}
            >
              Apply to All Scenes
            </Btn>
          </div>
        </>
      )}
    </div>
  )
}
