import { useState } from 'react'
import {
  Check, ChevronRight, ChevronLeft, Save, Settings, Clapperboard,
} from 'lucide-react'
import { Btn } from './components/ui'
import PreviewPanel from './components/PreviewPanel'
import TimelinePanel from './components/TimelinePanel'
import {
  StoryboardPanel, AnimationPanel, VoiceOverPanel, SubtitlePanel,
  TransitionPanel, MusicPanel, BrandPanel, ExportPanel,
} from './components/panels'
import { STEPS, defaultProject } from './lib/constants'
import type { Project } from './lib/types'

export default function App() {
  const [project, setProject] = useState<Project>(defaultProject)
  const [activeStep, setActiveStep] = useState('storyboard')
  const [activeScene, setActiveScene] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const currentStepIndex = STEPS.findIndex(s => s.id === activeStep)

  const renderPanel = () => {
    const props = { project, setProject }
    switch (activeStep) {
      case 'storyboard':
        return <StoryboardPanel {...props} setActiveScene={setActiveScene} />
      case 'animation':
        return <AnimationPanel {...props} activeScene={activeScene} />
      case 'voiceover':
        return <VoiceOverPanel {...props} />
      case 'subtitle':
        return <SubtitlePanel {...props} />
      case 'transition':
        return <TransitionPanel {...props} activeScene={activeScene} />
      case 'music':
        return <MusicPanel {...props} />
      case 'brand':
        return <BrandPanel {...props} />
      case 'export':
        return <ExportPanel {...props} />
      default:
        return null
    }
  }

  return (
    <div className="h-screen w-full bg-slate-950 text-white flex flex-col overflow-hidden">
      {/* ═══ Top Bar ═══ */}
      <header className="flex-shrink-0 h-12 bg-slate-900/80 border-b border-slate-800 flex items-center px-4 gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Clapperboard className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold bg-gradient-to-r from-violet-300 to-emerald-300 bg-clip-text text-transparent hidden sm:inline">
            AI Video Studio
          </span>
        </div>

        {/* Step Navigation */}
        <nav className="flex-1 flex items-center justify-center overflow-x-auto">
          <div className="flex items-center gap-0.5">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              const isActive = step.id === activeStep
              const isPast = i < currentStepIndex
              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => setActiveStep(step.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                        : isPast
                          ? 'text-emerald-400/70 hover:bg-white/5'
                          : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    {isPast ? <Check className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
                    <span className="hidden lg:inline">{step.labelTh}</span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-slate-700 mx-0.5 flex-shrink-0" />
                  )}
                </div>
              )
            })}
          </div>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Btn size="sm" variant="ghost"><Save className="w-3.5 h-3.5" /></Btn>
          <Btn size="sm" variant="ghost"><Settings className="w-3.5 h-3.5" /></Btn>
        </div>
      </header>

      {/* ═══ Main Content ═══ */}
      <div className="flex-1 flex min-h-0">
        {/* Left Sidebar - Settings Panel */}
        <aside
          className={`flex-shrink-0 border-r border-slate-800 bg-slate-900/50 flex flex-col transition-all duration-300 ${
            sidebarCollapsed ? 'w-0 overflow-hidden' : 'w-80'
          }`}
        >
          <div className="flex-1 p-4 overflow-hidden">{renderPanel()}</div>

          {/* Step Navigation Footer */}
          <div className="flex-shrink-0 p-3 border-t border-slate-800 flex gap-2">
            <Btn
              size="sm"
              variant="ghost"
              disabled={currentStepIndex === 0}
              onClick={() => setActiveStep(STEPS[currentStepIndex - 1]?.id)}
            >
              <ChevronLeft className="w-3 h-3" /> ย้อนกลับ
            </Btn>
            <div className="flex-1" />
            <Btn
              size="sm"
              variant="primary"
              disabled={currentStepIndex === STEPS.length - 1}
              onClick={() => setActiveStep(STEPS[currentStepIndex + 1]?.id)}
            >
              ถัดไป <ChevronRight className="w-3 h-3" />
            </Btn>
          </div>
        </aside>

        {/* Sidebar Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="flex-shrink-0 w-5 bg-slate-900/30 hover:bg-slate-800/50 flex items-center justify-center text-slate-600 hover:text-white transition-all border-r border-slate-800"
          aria-label="Toggle sidebar"
        >
          {sidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        {/* Center - Preview + Timeline */}
        <main className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 p-4 min-h-0">
            <PreviewPanel
              project={project}
              activeScene={activeScene}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              onPrevScene={() => setActiveScene(Math.max(0, activeScene - 1))}
              onNextScene={() => setActiveScene(Math.min(project.scenes.length - 1, activeScene + 1))}
            />
          </div>
          <TimelinePanel
            project={project}
            activeScene={activeScene}
            onSelectScene={setActiveScene}
          />
        </main>
      </div>
    </div>
  )
}
