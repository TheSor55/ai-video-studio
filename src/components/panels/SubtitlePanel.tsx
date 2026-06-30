import { Type, Wand2 } from 'lucide-react'
import { Select, Slider, Btn } from '../ui'
import type { Project } from '../../lib/types'

interface Props {
  project: Project
  setProject: React.Dispatch<React.SetStateAction<Project>>
}

export default function SubtitlePanel({ project, setProject }: Props) {
  return (
    <div className="space-y-5 overflow-y-auto max-h-[calc(100vh-220px)] pr-1 custom-scroll">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <Type className="w-4 h-4 text-violet-400" /> Subtitle
      </h3>

      <Btn variant="primary" className="w-full">
        <Wand2 className="w-4 h-4" /> Auto Generate Subtitles
      </Btn>

      <Select
        label="Font"
        value={project.subtitleFont}
        onChange={v => setProject(p => ({ ...p, subtitleFont: v }))}
        options={[
          { value: 'TH Sarabun New', label: 'TH Sarabun New' },
          { value: 'Noto Sans Thai', label: 'Noto Sans Thai' },
          { value: 'IBM Plex Sans Thai', label: 'IBM Plex Sans Thai' },
          { value: 'Kanit', label: 'Kanit' },
          { value: 'Prompt', label: 'Prompt' },
          { value: 'Arial', label: 'Arial' },
        ]}
      />

      <Slider label="Font Size" value={project.subtitleSize} onChange={v => setProject(p => ({ ...p, subtitleSize: v }))} min={12} max={48} unit="px" />

      <div className="space-y-1">
        <label className="text-xs text-slate-400">Font Color</label>
        <div className="flex gap-2">
          {['#FFFFFF', '#FFEB3B', '#4FC3F7', '#81C784', '#FF8A65'].map(c => (
            <button
              key={c}
              onClick={() => setProject(p => ({ ...p, subtitleColor: c }))}
              className={`w-7 h-7 rounded-full border-2 transition-all ${
                project.subtitleColor === c ? 'border-violet-400 scale-110' : 'border-slate-600'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <Select
        label="Position"
        value={project.subtitlePosition}
        onChange={v => setProject(p => ({ ...p, subtitlePosition: v }))}
        options={[
          { value: 'bottom', label: 'Bottom' },
          { value: 'top', label: 'Top' },
          { value: 'center', label: 'Center' },
        ]}
      />

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={!!project.subtitleBg}
          onChange={e =>
            setProject(p => ({
              ...p,
              subtitleBg: e.target.checked ? 'rgba(0,0,0,0.6)' : '',
            }))
          }
        />
        <span className="text-xs text-slate-300">Background Box</span>
      </label>

      <Select
        label="Export Format"
        value="embedded"
        onChange={() => {}}
        options={[
          { value: 'embedded', label: 'Embedded in Video' },
          { value: 'srt', label: 'SRT File' },
          { value: 'both', label: 'Both' },
        ]}
      />
    </div>
  )
}
