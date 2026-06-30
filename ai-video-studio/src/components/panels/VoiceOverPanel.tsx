import { useState } from 'react'
import { Mic, Wand2, Upload } from 'lucide-react'
import { Select, Slider, Btn, TabBar } from '../ui'
import { VOICES } from '../../lib/constants'
import type { Project } from '../../lib/types'

interface Props {
  project: Project
  setProject: React.Dispatch<React.SetStateAction<Project>>
}

export default function VoiceOverPanel({ project, setProject }: Props) {
  const [voiceTab, setVoiceTab] = useState('ai')

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
          <Btn variant="primary" className="w-full">
            <Wand2 className="w-4 h-4" /> Generate Voice Over
          </Btn>
        </div>
      )}

      {voiceTab === 'upload' && (
        <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center space-y-2">
          <Upload className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-xs text-slate-400">Drop MP3 or WAV file here</p>
          <Btn size="sm">Choose File</Btn>
        </div>
      )}

      {voiceTab === 'record' && (
        <div className="text-center space-y-4 py-4">
          <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center border-2 border-red-500/40">
            <Mic className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-xs text-slate-400">กดเพื่อเริ่มบันทึกเสียง</p>
          <Btn variant="danger">🔴 Start Recording</Btn>
        </div>
      )}
    </div>
  )
}
