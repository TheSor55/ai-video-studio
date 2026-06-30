import React from 'react'

// ─── Badge ───
interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'active' | 'success'
}
export function Badge({ children, variant = 'default' }: BadgeProps) {
  const cls: Record<string, string> = {
    default: 'bg-white/10 text-white/70',
    active: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
    success: 'bg-emerald-500/20 text-emerald-300',
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls[variant]}`}>
      {children}
    </span>
  )
}

// ─── Slider ───
interface SliderProps {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
}
export function Slider({ label, value, onChange, min = 0, max = 100, step = 1, unit = '' }: SliderProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="text-white font-mono">{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  )
}

// ─── Select ───
interface SelectOption { value: string; label: string }
interface SelectProps {
  label?: string
  value: string
  onChange: (v: string) => void
  options: SelectOption[]
  className?: string
}
export function Select({ label, value, onChange, options, className = '' }: SelectProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && <label className="text-xs text-slate-400">{label}</label>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

// ─── Input ───
interface InputProps {
  label?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  multiline?: boolean
  rows?: number
}
export function Input({ label, value, onChange, placeholder, multiline, rows = 3 }: InputProps) {
  const cls = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none'
  return (
    <div className="space-y-1">
      {label && <label className="text-xs text-slate-400">{label}</label>}
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} className={`${cls} resize-none`} />
      ) : (
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      )}
    </div>
  )
}

// ─── Button ───
interface BtnProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'default' | 'primary' | 'success' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
}
export function Btn({ children, onClick, variant = 'default', size = 'md', disabled, className = '' }: BtnProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed'
  const variants: Record<string, string> = {
    default: 'bg-slate-700 hover:bg-slate-600 text-white',
    primary: 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    ghost: 'bg-transparent hover:bg-white/5 text-slate-300',
    danger: 'bg-red-600/80 hover:bg-red-500 text-white',
  }
  const sizes: Record<string, string> = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  )
}

// ─── Tab Bar ───
interface Tab { value: string; label: string }
interface TabBarProps {
  tabs: Tab[]
  active: string
  onChange: (v: string) => void
}
export function TabBar({ tabs, active, onChange }: TabBarProps) {
  return (
    <div className="flex gap-1 bg-slate-800/50 p-1 rounded-lg">
      {tabs.map(t => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            active === t.value
              ? 'bg-violet-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
