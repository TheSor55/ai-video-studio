import { useRef, useState } from 'react'
import { Music as MusicIcon, Upload, Wand2, Play, Pause, Trash2, Volume2 } from 'lucide-react'
import { Slider, Btn } from '../ui'
import { MUSIC_CATEGORIES } from '../../lib/constants'
import type { Project } from '../../lib/types'

interface Props {
  project: Project
  setProject: React.Dispatch<React.SetStateAction<Project>>
}

export default function MusicPanel({ project, setProject }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioDuration, setAudioDuration] = useState(0)

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('audio/')) {
      alert('กรุณาเลือกไฟล์เสียง (MP3 หรือ WAV)')
      return
    }
    if (file.size > 50 * 1024 * 1024) {
      alert('ไฟล์ใหญ่เกินไป (สูงสุด 50MB)')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setProject(p => ({
        ...p,
        musicData: dataUrl,
        musicName: file.name,
      }))

      // Get duration
      const audio = new Audio(dataUrl)
      audio.onloadedmetadata = () => {
        setAudioDuration(Math.round(audio.duration))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }

  const togglePlayback = () => {
    if (!project.musicData) return

    if (!audioRef.current) {
      audioRef.current = new Audio(project.musicData)
      audioRef.current.volume = project.musicVolume / 100
      audioRef.current.onended = () => setIsPlaying(false)
    }

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.volume = project.musicVolume / 100
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const removeMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setIsPlaying(false)
    setProject(p => ({ ...p, musicData: undefined, musicName: undefined }))
  }

  // Update volume in real-time
  const handleVolumeChange = (v: number) => {
    setProject(p => ({ ...p, musicVolume: v }))
    if (audioRef.current) {
      audioRef.current.volume = v / 100
    }
  }

  return (
    <div className="space-y-5 overflow-y-auto max-h-[calc(100vh-220px)] pr-1 custom-scroll">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <MusicIcon className="w-4 h-4 text-violet-400" /> Background Music
      </h3>

      {/* Upload area / Player */}
      {project.musicData ? (
        <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50 space-y-3">
          <div className="flex items-center gap-2">
            <MusicIcon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{project.musicName}</p>
              <p className="text-[10px] text-slate-400">
                {audioDuration > 0 ? `${Math.floor(audioDuration / 60)}:${(audioDuration % 60).toString().padStart(2, '0')}` : 'Loading...'}
              </p>
            </div>
            <button
              onClick={removeMusic}
              className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={togglePlayback}
              className="p-2 bg-violet-600 hover:bg-violet-500 rounded-full text-white transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </button>
            <div className="flex-1 flex items-center gap-2">
              <Volume2 className="w-3 h-3 text-slate-500" />
              <input
                type="range"
                min={0}
                max={100}
                value={project.musicVolume}
                onChange={e => handleVolumeChange(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-[10px] text-slate-400 font-mono w-8">{project.musicVolume}%</span>
            </div>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
          >
            เปลี่ยนไฟล์เพลง
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); e.stopPropagation() }}
          className="border-2 border-dashed border-slate-700 hover:border-violet-500/50 rounded-xl p-6 text-center space-y-2 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-6 h-6 text-slate-500 mx-auto" />
          <p className="text-xs text-slate-400">Upload MP3 / WAV</p>
          <p className="text-[10px] text-slate-500">คลิกหรือลากวางไฟล์เพลง (สูงสุด 50MB)</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/mpeg,audio/wav,audio/mp3,audio/x-wav"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) handleFileUpload(file)
          e.target.value = ''
        }}
      />

      {/* Music Library */}
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

      <Slider label="Volume" value={project.musicVolume} onChange={handleVolumeChange} min={0} max={100} unit="%" />

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
    </div>
  )
}
