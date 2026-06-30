import { useState } from 'react'
import {
  Sparkles, Wand2, Plus, Trash2, ArrowUp, ArrowDown, Clock, Loader2,
} from 'lucide-react'
import { Input, Select, Btn } from '../ui'
import { ANIMATION_TYPES } from '../../lib/constants'
import type { Project } from '../../lib/types'

interface Props {
  project: Project
  setProject: React.Dispatch<React.SetStateAction<Project>>
  setActiveScene: (i: number) => void
}

export default function StoryboardPanel({ project, setProject, setActiveScene }: Props) {
  const [generating, setGenerating] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)

  const generateStoryboard = async () => {
    if (!project.topic) return
    setGenerating(true)
    setAiError(null)

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `You are a video storyboard generator. Create a storyboard for a professional video.

Topic: ${project.topic}
Title: ${project.title || project.topic}
Description: ${project.description || 'N/A'}
Target Audience: ${project.audience}
Language: ${project.language}
Tone: ${project.tone}
Duration: ${project.duration}

Generate 5 scenes. Respond ONLY with a JSON array, no markdown, no backticks, no preamble. Each element must have:
- "title": short scene title (in ${project.language})
- "narration": narration script for 15-20 seconds (in ${project.language})
- "duration": number in seconds (5-15)
- "imagePrompt": description for image generation (in English)
- "animation": one of "zoomIn","zoomOut","panLeft","panRight","kenBurns","parallax","fadeIn","float"
- "transition": one of "fade","dissolve","slideLeft","slideRight","zoomIn","wipe","blur","cinematic"`,
            },
          ],
        }),
      })

      const data = await response.json()
      const text = data.content?.map((c: any) => c.text || '').join('') || ''
      const clean = text.replace(/```json|```/g, '').trim()
      const scenes = JSON.parse(clean)
      setProject(p => ({ ...p, scenes }))
      setActiveScene(0)
    } catch (err) {
      console.error(err)
      setAiError('AI generation failed — ใช้ demo scenes แทน')
      // Fallback demo scenes
      const fallback = [
        { title: 'บทนำ', narration: 'สวัสดีครับ วันนี้เราจะมาพูดถึงเรื่องที่สำคัญมาก...', duration: 8, animation: 'kenBurns', transition: 'fade', imagePrompt: 'intro' },
        { title: 'สถานการณ์ปัจจุบัน', narration: 'ในปัจจุบันเราพบว่าสถานการณ์กำลังเปลี่ยนแปลงอย่างรวดเร็ว...', duration: 10, animation: 'zoomIn', transition: 'dissolve', imagePrompt: 'current' },
        { title: 'การวิเคราะห์', narration: 'จากข้อมูลที่เราได้ศึกษาและวิเคราะห์มา...', duration: 10, animation: 'panRight', transition: 'slideLeft', imagePrompt: 'analysis' },
        { title: 'แนวทางแก้ไข', narration: 'เราเสนอแนวทางแก้ไขที่เป็นรูปธรรม ดังนี้...', duration: 10, animation: 'parallax', transition: 'zoomIn', imagePrompt: 'solution' },
        { title: 'สรุปและ Call to Action', narration: 'สรุปสิ่งที่เราได้นำเสนอวันนี้ และขอเชิญชวนทุกท่าน...', duration: 8, animation: 'fadeIn', transition: 'fade', imagePrompt: 'conclusion' },
      ]
      setProject(p => ({ ...p, scenes: fallback }))
      setActiveScene(0)
    } finally {
      setGenerating(false)
    }
  }

  const addScene = () => {
    setProject(p => ({
      ...p,
      scenes: [
        ...p.scenes,
        {
          title: `Scene ${p.scenes.length + 1}`,
          narration: '',
          duration: 8,
          animation: 'kenBurns',
          transition: 'fade',
          imagePrompt: '',
        },
      ],
    }))
  }

  const deleteScene = (i: number) => {
    setProject(p => ({ ...p, scenes: p.scenes.filter((_, idx) => idx !== i) }))
  }

  const updateScene = (i: number, updates: Record<string, any>) => {
    setProject(p => ({
      ...p,
      scenes: p.scenes.map((s, idx) => (idx === i ? { ...s, ...updates } : s)),
    }))
  }

  const moveScene = (from: number, to: number) => {
    if (to < 0 || to >= project.scenes.length) return
    setProject(p => {
      const s = [...p.scenes]
      ;[s[from], s[to]] = [s[to], s[from]]
      return { ...p, scenes: s }
    })
  }

  return (
    <div className="space-y-5 overflow-y-auto max-h-[calc(100vh-220px)] pr-1 custom-scroll">
      {/* Project Setup */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          AI Storyboard Generator
        </h3>

        <Input
          label="Video Title"
          value={project.title}
          onChange={v => setProject(p => ({ ...p, title: v }))}
          placeholder="ชื่อวิดีโอ"
        />
        <Input
          label="Topic"
          value={project.topic}
          onChange={v => setProject(p => ({ ...p, topic: v }))}
          placeholder="หัวข้อ เช่น Carbon Footprint ของโรงงานพลาสติก"
        />
        <Input
          label="Description"
          value={project.description}
          onChange={v => setProject(p => ({ ...p, description: v }))}
          placeholder="รายละเอียดเพิ่มเติม"
          multiline
          rows={2}
        />

        <div className="grid grid-cols-2 gap-2">
          <Select
            label="Target Audience"
            value={project.audience}
            onChange={v => setProject(p => ({ ...p, audience: v }))}
            options={[
              { value: 'ผู้บริหาร / นักลงทุน', label: 'ผู้บริหาร / นักลงทุน' },
              { value: 'พนักงาน / ทีมงาน', label: 'พนักงาน / ทีมงาน' },
              { value: 'ลูกค้า / คู่ค้า', label: 'ลูกค้า / คู่ค้า' },
              { value: 'นักศึกษา / ครู', label: 'นักศึกษา / ครู' },
              { value: 'ทั่วไป', label: 'ทั่วไป' },
            ]}
          />
          <Select
            label="Language"
            value={project.language}
            onChange={v => setProject(p => ({ ...p, language: v }))}
            options={[
              { value: 'Thai', label: 'ไทย' },
              { value: 'English', label: 'English' },
              { value: 'Thai+English', label: 'ไทย+English' },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Select
            label="Tone"
            value={project.tone}
            onChange={v => setProject(p => ({ ...p, tone: v }))}
            options={[
              { value: 'Professional', label: 'Professional' },
              { value: 'Educational', label: 'Educational' },
              { value: 'Inspirational', label: 'Inspirational' },
              { value: 'Documentary', label: 'Documentary' },
              { value: 'Casual', label: 'Casual' },
            ]}
          />
          <Select
            label="Duration"
            value={project.duration}
            onChange={v => setProject(p => ({ ...p, duration: v }))}
            options={[
              { value: '1-2 นาที', label: '1-2 นาที' },
              { value: '3-5 นาที', label: '3-5 นาที' },
              { value: '5-10 นาที', label: '5-10 นาที' },
              { value: '10+ นาที', label: '10+ นาที' },
            ]}
          />
        </div>

        <Btn
          onClick={generateStoryboard}
          variant="primary"
          className="w-full"
          disabled={generating || !project.topic}
        >
          {generating ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> กำลังสร้าง Storyboard...</>
          ) : (
            <><Wand2 className="w-4 h-4" /> สร้าง Storyboard ด้วย AI</>
          )}
        </Btn>
        {aiError && <p className="text-xs text-amber-400">{aiError}</p>}
      </div>

      {/* Scenes List */}
      {project.scenes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">
              Scenes ({project.scenes.length})
            </h3>
            <Btn onClick={addScene} size="sm">
              <Plus className="w-3 h-3" /> เพิ่ม Scene
            </Btn>
          </div>

          {project.scenes.map((scene, i) => (
            <div
              key={i}
              className="bg-slate-800/60 rounded-lg p-3 space-y-2 border border-slate-700/50 animate-fade-in"
            >
              <div className="flex items-start gap-2">
                <span className="bg-violet-500/20 text-violet-300 text-xs font-bold px-2 py-0.5 rounded-full mt-0.5 flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <input
                    value={scene.title}
                    onChange={e => updateScene(i, { title: e.target.value })}
                    className="w-full bg-transparent text-sm font-semibold text-white outline-none"
                  />
                </div>
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  <button
                    onClick={() => moveScene(i, i - 1)}
                    disabled={i === 0}
                    className="p-1 text-slate-500 hover:text-white disabled:opacity-30 transition-colors"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => moveScene(i, i + 1)}
                    disabled={i === project.scenes.length - 1}
                    className="p-1 text-slate-500 hover:text-white disabled:opacity-30 transition-colors"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => deleteScene(i)}
                    className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <textarea
                value={scene.narration}
                onChange={e => updateScene(i, { narration: e.target.value })}
                rows={2}
                placeholder="Narration script..."
                className="w-full bg-slate-900/50 rounded-md px-2 py-1.5 text-xs text-slate-300 placeholder-slate-600 outline-none resize-none"
              />

              <div className="flex gap-2 items-center flex-wrap">
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="w-3 h-3" />
                  <input
                    type="number"
                    value={scene.duration || 5}
                    min={3}
                    max={30}
                    onChange={e => updateScene(i, { duration: Number(e.target.value) })}
                    className="w-10 bg-slate-900/50 rounded px-1 py-0.5 text-center text-white outline-none"
                  />
                  <span>sec</span>
                </div>

                <select
                  value={scene.animation || 'kenBurns'}
                  onChange={e => updateScene(i, { animation: e.target.value })}
                  className="bg-slate-900/50 text-xs text-slate-300 rounded px-1.5 py-0.5 outline-none"
                >
                  {ANIMATION_TYPES.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.icon} {a.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
