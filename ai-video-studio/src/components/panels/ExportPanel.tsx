import { useState, useCallback } from 'react'
import { MonitorPlay, Download, Save, Loader2, CheckCircle2, AlertCircle, Film } from 'lucide-react'
import { Select, Btn } from '../ui'
import { EXPORT_PRESETS } from '../../lib/constants'
import { exportVideo } from '../../lib/videoRenderer'
import type { Project, ExportState } from '../../lib/types'

interface Props {
  project: Project
  setProject: React.Dispatch<React.SetStateAction<Project>>
}

export default function ExportPanel({ project, setProject }: Props) {
  const [exportState, setExportState] = useState<ExportState>({
    status: 'idle',
    progress: 0,
    currentScene: 0,
    totalScenes: 0,
    message: '',
  })

  const totalDuration = project.scenes.reduce((s, sc) => s + (sc.duration || 5), 0)
  const hasImages = project.scenes.some(s => s.imageData)

  const handleExport = useCallback(async () => {
    if (project.scenes.length === 0) return

    try {
      const url = await exportVideo(project, setExportState)
      // Auto-download
      const a = document.createElement('a')
      a.href = url
      a.download = `${project.title || 'video'}-${Date.now()}.webm`
      a.click()
    } catch (err: any) {
      setExportState(s => ({
        ...s,
        status: 'error',
        message: `Export failed: ${err.message}`,
        error: err.message,
      }))
    }
  }, [project])

  const handleSaveProject = () => {
    try {
      const data = JSON.stringify(project, null, 2)
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${project.title || 'project'}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Save failed', e)
    }
  }

  const handleLoadProject = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      try {
        const text = await file.text()
        const loaded = JSON.parse(text)
        setProject(loaded)
      } catch (err) {
        alert('ไม่สามารถโหลดไฟล์โปรเจกต์ได้')
      }
    }
    input.click()
  }

  const isExporting = ['preparing', 'rendering', 'encoding'].includes(exportState.status)

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
              <div className="text-[10px] text-slate-400 mt-0.5">{p.ratio} • {p.res}</div>
            </button>
          ))}
        </div>
      </div>

      <Select
        label="Resolution"
        value={project.resolution}
        onChange={v => setProject(p => ({ ...p, resolution: v }))}
        options={[
          { value: '720p', label: '720p (HD) — เร็ว' },
          { value: '1080p', label: '1080p (Full HD)' },
        ]}
      />

      <Select
        label="Frame Rate"
        value={String(project.fps)}
        onChange={v => setProject(p => ({ ...p, fps: Number(v) }))}
        options={[
          { value: '24', label: '24 FPS (Cinematic)' },
          { value: '30', label: '30 FPS (Standard)' },
        ]}
      />

      {/* Summary */}
      <div className="bg-slate-800/80 rounded-lg p-3 space-y-1 border border-slate-700/50">
        <p className="text-xs font-semibold text-white">Export Summary</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
          <span className="text-slate-400">Scenes</span>
          <span className="text-white">{project.scenes.length}</span>
          <span className="text-slate-400">Duration</span>
          <span className="text-white">{totalDuration}s</span>
          <span className="text-slate-400">มีรูปภาพ</span>
          <span className={hasImages ? 'text-emerald-400' : 'text-amber-400'}>
            {project.scenes.filter(s => s.imageData).length}/{project.scenes.length} scenes
          </span>
          <span className="text-slate-400">Resolution</span>
          <span className="text-white">{project.resolution}</span>
          <span className="text-slate-400">FPS</span>
          <span className="text-white">{project.fps}</span>
          <span className="text-slate-400">Format</span>
          <span className="text-white">WebM (VP9)</span>
        </div>
      </div>

      {/* Export Progress */}
      {isExporting && (
        <div className="space-y-2 animate-fade-in">
          <div className="flex justify-between text-xs">
            <span className="text-violet-300 flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              {exportState.message}
            </span>
            <span className="text-white font-mono">{Math.round(exportState.progress)}%</span>
          </div>
          <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${exportState.progress}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500 text-center">
            Scene {exportState.currentScene}/{exportState.totalScenes}
          </div>
        </div>
      )}

      {exportState.status === 'done' && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 space-y-2 animate-fade-in">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-semibold">Export สำเร็จ!</span>
          </div>
          <p className="text-xs text-emerald-300/70">{exportState.message}</p>
          {exportState.downloadUrl && (
            <a
              href={exportState.downloadUrl}
              download={`${project.title || 'video'}.webm`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg transition-colors"
            >
              <Download className="w-3 h-3" /> ดาวน์โหลดอีกครั้ง
            </a>
          )}
        </div>
      )}

      {exportState.status === 'error' && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 animate-fade-in">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs font-semibold">Export ล้มเหลว</span>
          </div>
          <p className="text-xs text-red-300/70 mt-1">{exportState.error}</p>
        </div>
      )}

      {/* Export Button */}
      <Btn
        variant="success"
        className="w-full"
        size="lg"
        disabled={project.scenes.length === 0 || isExporting}
        onClick={handleExport}
      >
        {isExporting ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> กำลัง Render...</>
        ) : (
          <><Film className="w-5 h-5" /> Export Video (WebM)</>
        )}
      </Btn>

      {!hasImages && project.scenes.length > 0 && (
        <p className="text-[10px] text-amber-400/70 text-center">
          💡 ลอง Upload รูปภาพใน Storyboard เพื่อให้วิดีโอสวยขึ้น
        </p>
      )}

      {/* Save/Load Project */}
      <div className="border-t border-slate-700/50 pt-3 space-y-2">
        <p className="text-xs font-semibold text-slate-400">Project</p>
        <div className="flex gap-2">
          <Btn size="sm" className="flex-1" onClick={handleSaveProject}>
            <Save className="w-3 h-3" /> Save Project
          </Btn>
          <Btn size="sm" className="flex-1" onClick={handleLoadProject}>
            📂 Load Project
          </Btn>
        </div>
      </div>
    </div>
  )
}
