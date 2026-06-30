import { Music as MusicIcon, Upload, Wand2 } from 'lucide-react'
import { Slider, Btn } from '../ui'
import { MUSIC_CATEGORIES } from '../../lib/constants'
import type { Project } from '../../lib/types'

interface Props {
  project: Project
  setProject: React.Dispatch<React.SetStateAction<Project>>
}

export default function MusicPanel({ project, setProject }: Props) {
  return (
    <div className="space-y-5 overflow-y-auto max-h-[calc(100vh-220px)] pr-1 custom-scroll">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <MusicIcon className="w-4 h-4 text-violet-400" /> Background Music
      </h3>

      <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center space-y-2">
        <Upload className="w-6 h-6 text-slate-500 mx-auto" />
        <p className="text-xs text-slate-400">Upload MP3 / WAV</p>
        <Btn size="sm">Choose File</Btn>
      </div>

      <div>
        <label className="text-xs text-slate-400 mb-2 block">Music Library</label>
        <div className="grid grid-cols-2 gap-2">
          {MUSIC_CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => setProject(p => ({ ...p, musicCategory: c.id }))}
              className={`p-2.5 rounded-lg border text-xs transition-all ${
                project.musicCategory === c.id
                  ? 'border-violet-500 bg-violet-500/10 text-white'
                  : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-500'
              }`}
            >
              <span className="text-base">{c.emoji}</span>
              <span className="ml-1 font-medium">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      <Slider label="Volume" value={project.musicVolume} onChange={v => setProject(p => ({ ...p, musicVolume: v }))} min={0} max={100} unit="%" />

      <div className="space-y-2">
        {(
          [
            ['musicFadeIn', 'Fade In'],
            ['musicFadeOut', 'Fade Out'],
            ['autoDucking', 'Auto Ducking (ลดเสียงเพลงตอนมีเสียงบรรยาย)'],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={project[key] as boolean}
              onChange={e => setProject(p => ({ ...p, [key]: e.target.checked }))}
            />
            <span className="text-xs text-slate-300">{label}</span>
          </label>
        ))}
      </div>

      <Btn variant="primary" className="w-full">
        <Wand2 className="w-4 h-4" /> AI Recommend Music
      </Btn>
    </div>
  )
}
