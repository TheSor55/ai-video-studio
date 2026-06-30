import { useRef } from 'react'
import { Palette, Upload, Save, Copy, X } from 'lucide-react'
import { Input, Select, Btn } from '../ui'
import type { Project, BrandSettings } from '../../lib/types'

interface Props {
  project: Project
  setProject: React.Dispatch<React.SetStateAction<Project>>
}

export default function BrandPanel({ project, setProject }: Props) {
  const b = project.brand
  const logoInputRef = useRef<HTMLInputElement | null>(null)

  const setBrand = (updates: Partial<BrandSettings>) => {
    setProject(p => ({ ...p, brand: { ...p.brand, ...updates } }))
  }

  const handleLogoUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      setBrand({ logo: e.target?.result as string })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-5 overflow-y-auto max-h-[calc(100vh-220px)] pr-1 custom-scroll">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <Palette className="w-4 h-4 text-violet-400" /> Brand Template
      </h3>

      {/* Preview Card */}
      <div className="rounded-lg overflow-hidden border border-slate-700">
        <div
          className="aspect-video relative"
          style={{
            background: `linear-gradient(135deg, ${b.primaryColor}88, ${b.secondaryColor}88)`,
          }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
            <span className="text-lg font-bold drop-shadow-lg">
              {project.title || 'Video Title'}
            </span>
            <span className="text-xs mt-1 opacity-80">{b.footer}</span>
          </div>
          {b.watermark && (
            <span className="absolute bottom-2 right-2 text-[10px] text-white/40">
              {b.footer}
            </span>
          )}
        </div>
      </div>

      {/* Logo Upload */}
      {b.logo ? (
        <div className="relative group rounded-lg overflow-hidden border border-slate-700 bg-slate-800/50 p-3 flex items-center gap-3">
          <img src={b.logo} alt="Logo" className="w-12 h-12 object-contain rounded" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white font-medium">Logo uploaded</p>
            <button
              onClick={() => logoInputRef.current?.click()}
              className="text-[10px] text-violet-400 hover:text-violet-300"
            >
              เปลี่ยน
            </button>
          </div>
          <button
            onClick={() => setBrand({ logo: null })}
            className="p-1 text-slate-500 hover:text-red-400 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-slate-700 hover:border-violet-500/50 rounded-lg p-4 text-center cursor-pointer transition-colors"
          onClick={() => logoInputRef.current?.click()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleLogoUpload(f) }}
          onDragOver={e => { e.preventDefault() }}
        >
          <Upload className="w-5 h-5 text-slate-500 mx-auto mb-1" />
          <p className="text-xs text-slate-400">Upload Logo (PNG/SVG)</p>
        </div>
      )}
      <input
        ref={logoInputRef}
        type="file"
        accept="image/png,image/svg+xml,image/jpeg,image/webp"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) handleLogoUpload(file)
          e.target.value = ''
        }}
      />

      {/* Colors */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-slate-400">Primary Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={b.primaryColor}
              onChange={e => setBrand({ primaryColor: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer bg-transparent"
            />
            <span className="text-xs text-slate-300 font-mono">{b.primaryColor}</span>
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-400">Secondary Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={b.secondaryColor}
              onChange={e => setBrand({ secondaryColor: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer bg-transparent"
            />
            <span className="text-xs text-slate-300 font-mono">{b.secondaryColor}</span>
          </div>
        </div>
      </div>

      <Select
        label="Font"
        value={b.font}
        onChange={v => setBrand({ font: v })}
        options={[
          { value: 'TH Sarabun New', label: 'TH Sarabun New' },
          { value: 'Kanit', label: 'Kanit' },
          { value: 'Prompt', label: 'Prompt' },
          { value: 'IBM Plex Sans Thai', label: 'IBM Plex Sans Thai' },
          { value: 'Noto Sans Thai', label: 'Noto Sans Thai' },
        ]}
      />

      <Input label="Footer Text" value={b.footer} onChange={v => setBrand({ footer: v })} />
      <Input label="End Credit" value={b.endCredit} onChange={v => setBrand({ endCredit: v })} />

      {/* Toggle Options */}
      <div className="space-y-2">
        {(
          [
            ['watermark', 'Show Watermark'],
            ['introAnimation', 'Intro Animation'],
            ['outroAnimation', 'Outro Animation'],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={b[key] as boolean}
              onChange={e => setBrand({ [key]: e.target.checked })}
            />
            <span className="text-xs text-slate-300">{label}</span>
          </label>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Btn size="sm" className="flex-1"><Save className="w-3 h-3" /> Save Template</Btn>
        <Btn size="sm" className="flex-1"><Copy className="w-3 h-3" /> Duplicate</Btn>
      </div>
    </div>
  )
}
