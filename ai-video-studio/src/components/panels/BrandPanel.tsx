import { Palette, Upload, Save, Copy } from 'lucide-react'
import { Input, Select, Btn } from '../ui'
import type { Project, BrandSettings } from '../../lib/types'

interface Props {
  project: Project
  setProject: React.Dispatch<React.SetStateAction<Project>>
}

export default function BrandPanel({ project, setProject }: Props) {
  const b = project.brand

  const setBrand = (updates: Partial<BrandSettings>) => {
    setProject(p => ({ ...p, brand: { ...p.brand, ...updates } }))
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
      <div className="border-2 border-dashed border-slate-700 rounded-lg p-4 text-center">
        <Upload className="w-5 h-5 text-slate-500 mx-auto mb-1" />
        <p className="text-xs text-slate-400">Upload Logo (PNG/SVG)</p>
      </div>

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
