import { useState, useRef } from 'react'
import { Mic, Wand2, Upload, Play, Pause, Trash2, Volume2 } from 'lucide-react'
import { Select, Slider, Btn, TabBar } from '../ui'
import { VOICES } from '../../lib/constants'
import type { Project } from '../../lib/types'

interface Props {
  project: Project
  setProject: React.Dispatch<React.SetStateAction<Project>>
}

export default function VoiceOverPanel({ project, setProject }: Props) {
  const [voiceTab, setVoiceTab] = useState('ai')
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [uploadedAudio, setUploadedAudio] = useState<{ name: string; url: string; duration: number } | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const handleUpload = (file: File) => {
    if (!file.type.startsWith('audio/')) {
      alert('กรุณาเลือกไฟล์เสียง (MP3 หรือ WAV)')
      return
    }
    const url = URL.createObjectURL(file)
    const audio = new Audio(url)
    audio.onloadedmetadata = () => {
      setUploadedAudio({ name: file.name, url, duration: Math.round(audio.duration) })
    }
  }

  const togglePlay = () => {
    if (!uploadedAudio) return
    if (!audioRef.current) {
      audioRef.current = new Audio(uploadedAudio.url)
      audioRef.current.onended = () => setIsPlaying(false)
    }
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const removeAudio = () => {
    audioRef.current?.pause()
    audioRef.current = null
    setUploadedAudio(null)
    setIsPlaying(false)
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []
      recorder.ondataavailable = e => chunks.push(e.data)
      recorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop())
        const blob = new Blob(chunks, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        audio.onloadedmetadata = () => {
          setUploadedAudio({ name: 'Recording.webm', url, duration: Math.round(audio.duration) })
        }
        setVoiceTab('upload')
      }
      mediaRecorderRef.current = recorder
      recorder.start()
      setIsRecording(true)
    } catch {
      alert('ไม่สามารถเข้าถึงไมโครโฟนได้ กรุณาอนุญาตการใช้งาน')
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }

  return (
    <div className="space-y-5 overflow-y-auto max-h-[calc(100vh-220px)] pr-1 custom-scroll">
      <h3 className="text-sm font-bold text-white flex items-center gap-2">
        <Mic className="w-4 h-4 text-violet-400" /> Voice Over
      </h3>

      <TabBar
        tabs={[
          { value: 'ai', label: '🤖 AI TTS' },
          { value: 'upload', label: '📁 Upload' },
          { value: 'record', label: '🎙️ Record' },
        ]}
        active={voiceTab}
        onChange={setVoiceTab}
      />

      {voiceTab === 'ai' && (
        <div className="space-y-3">
          <Select
            label="Voice"
            value={project.voice}
            onChange={v => setProject(p => ({ ...p, voice: v }))}
            options={VOICES.map(v => ({ value: v.id, label: `[${v.lang}] ${v.label}` }))}
          />
          <Slider label="Speed" value={project.voiceSpeed} onChange={v => setProject(p => ({ ...p, voiceSpeed: v }))} min={0.5} max={2} step={0.1} unit="x" />
          <Slider label="Pitch" value={project.voicePitch} onChange={v => setProject(p => ({ ...p, voicePitch: v }))} min={0.5} max={2} step={0.1} unit="x" />
          <Select
            label="Emotion"
            value={project.voiceEmotion || 'neutral'}
            onChange={v => setProject(p => ({ ...p, voiceEmotion: v }))}
            options={[
              { value: 'neutral', label: 'Neutral' },
              { value: 'confident', label: 'Confident' },
              { value: 'warm', label: 'Warm' },
              { value: 'enthusiastic', label: 'Enthusiastic' },
            ]}
          />
          <p className="text-[10px] text-slate-500 text-center">* AI TTS จะเปิดใช้งานใน Phase 3 (ต่อ ElevenLabs / OpenAI TTS API)</p>
        </div>
      )}

      {voiceTab === 'upload' && (
        <div className="space-y-3">
          {uploadedAudio ? (
            <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50 space-y-3">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{uploadedAudio.name}</p>
                  <p className="text-[10px] text-slate-400">
                    {Math.floor(uploadedAudio.duration / 60)}:{(uploadedAudio.duration % 60).toString().padStart(2, '0')}
                  </p>
                </div>
                <button onClick={removeAudio} className="p-1.5 text-slate-500 hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={togglePlay} className="p-2 bg-violet-600 hover:bg-violet-500 rounded-full text-white transition-colors">
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                </button>
                <span className="text-xs text-slate-400">กดเพื่อฟัง</span>
              </div>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-slate-700 hover:border-violet-500/50 rounded-xl p-8 text-center space-y-2 cursor-pointer transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleUpload(f) }}
              onDragOver={e => { e.preventDefault() }}
            >
              <Upload className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-400">คลิกหรือลากวางไฟล์เสียง</p>
              <p className="text-[10px] text-slate-500">MP3, WAV</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/mpeg,audio/wav,audio/mp3"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) handleUpload(file)
              e.target.value = ''
            }}
          />
        </div>
      )}

      {voiceTab === 'record' && (
        <div className="text-center space-y-4 py-4">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center border-2 transition-all ${
            isRecording ? 'bg-red-500/30 border-red-500 animate-pulse' : 'bg-red-500/20 border-red-500/40'
          }`}>
            <Mic className={`w-8 h-8 ${isRecording ? 'text-red-300' : 'text-red-400'}`} />
          </div>
          <p className="text-xs text-slate-400">
            {isRecording ? '🔴 กำลังบันทึก... กดเพื่อหยุด' : 'กดเพื่อเริ่มบันทึกเสียง'}
          </p>
          {isRecording ? (
            <Btn variant="danger" onClick={stopRecording}>⏹️ หยุดบันทึก</Btn>
          ) : (
            <Btn variant="danger" onClick={startRecording}>🔴 เริ่มบันทึก</Btn>
          )}
        </div>
      )}
    </div>
  )
}
