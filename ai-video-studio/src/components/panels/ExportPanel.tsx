import { useState } from 'react'
import { MonitorPlay, Download, Save, Loader2 } from 'lucide-react'
import { Select, Btn } from '../ui'
import { EXPORT_PRESETS } from '../../lib/constants'
import type { Project } from '../../lib/types'

interface Props {
  project: Project
  setProject: React.Dispatch<React.SetStateAction<Project>>
}

export default function ExportPanel({ project, setProject }: Props) {
  const [exporting, setExporting] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleExport = () => {
    setExporting(true)
    setProgress(0)
    const iv = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(iv)
          setExporting(false)
          return 100
        }
        return p + 2
      })
    }, 60)
  }

  const totalDuration = project.scenes.reduce((s, sc) => s + (sc.duration || 5), 0)

  return (
    <div className="space-y-5 overflow-y-auto max-h-[calc(100vh-220px)] pr-1 custom-scroll">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <MonitorPlay className="w-4 h-4 text-violet-400" /> Export Video
      </h3>

      {/* Platform Presets */}
      <div>
        <label className="text-xs text-slate-400 mb-2 block">Platform Preset</label>
        <div className="grid grid-cols-2 gap-2">
          {EXPORT_PRESETS.map(p => (
            <button
              key={p.id}
              onClick={() => setProject(pr => ({ ...pr, exportPreset: p.id }))}
              className={`p-3 rounded-lg border text-left transition-all ${
                project.exportPreset === p.id
                  ? 'border-violet-500 bg-violet-500/10'
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'
              }`}
            >
              <div className="text-xs font-semibold text-white">{p.label}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {p.ratio} • {p.res}
              </div>
            </button>
          ))}
        </div>
      </div>

      <Select
        label="Resolution"
        value={project.resolution}
        onChange={v => setProject(p => ({ ...p, resolution: v }))}
        options={[
          { value: '720p', label: '720p (HD)' },
          { value: '1080p', label: '1080p (Full HD)' },
          { value: '2k', label: '2K (QHD)' },
          { value: '4k', label: '4K (UHD)' },
        ]}
      />

      <Select
        label="Frame Rate"
        value={String(project.fps)}
        onChange={v => setProject(p => ({ ...p, fps: Number(v) }))}
        options={[
          { value: '24', label: '24 FPS (Cinematic)' },
          { value: '30', label: '30 FPS (Standard)' },
          { value: '60', label: '60 FPS (Smooth)' },
        ]}
      />

      <Select
        label="Format"
        value={project.format}
        onChange={v => setProject(p => ({ ...p, format: v }))}
        options={[
          { value: 'mp4', label: 'MP4 (H.264)' },
          { value: 'mov', label: 'MOV (ProRes)' },
          { value: 'webm', label: 'WebM (VP9)' },
          { value: 'gif', label: 'GIF (Animated)' },
        ]}
      />

      {/* Checkboxes */}
      <div className="space-y-2">
        {['Embed Subtitle', 'Add Watermark', 'Background Rendering'].map(label => (
          <label key={label} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked={label !== 'Background Rendering'} />
            <span className="text-xs text-slate-300">{label}</span>
          </label>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-slate-800/80 rounded-lg p-3 space-y-1 border border-slate-700/50">
        <p className="text-xs font-semibold text-white">Export Summary</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
          <span className="text-slate-400">Scenes</span>
          <span className="text-white">{project.scenes.length}</span>
          <span className="text-slate-400">Duration</span>
          <span className="text-white">{totalDuration}s</span>
          <span className="text-slate-400">Resolution</span>
          <span className="text-white">{project.resolution}</span>
          <span className="text-slate-400">Format</span>
          <span className="text-white uppercase">{project.format}</span>
          <span className="text-slate-400">FPS</span>
          <span className="text-white">{project.fps}</span>
          <span className="text-slate-400">Platform</span>
          <span className="text-white capitalize">{project.exportPreset}</span>
        </div>
      </div>

      {/* Progress Bar */}
      {exporting && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-violet-300">Rendering...</span>
            <span className="text-white font-mono">{progress}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Export Button */}
      <Btn
        variant="success"
        className="w-full"
        size="lg"
        disabled={project.scenes.length === 0 || exporting}
        onClick={handleExport}
      >
        {exporting ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Rendering {progress}%...</>
        ) : (
          <><Download className="w-5 h-5" /> Export Video</>
        )}
      </Btn>

      <Btn className="w-full">
        <Save className="w-4 h-4" /> Save Project
      </Btn>
    </div>
  )
}
