// ─── Scene ───
export interface Scene {
  title: string
  narration: string
  duration: number
  animation: string
  transition: string
  imagePrompt: string
  image?: string
  imageData?: string  // base64 data URL from uploaded image
  imageName?: string  // original filename
  thumbnail?: string
  animSpeed?: number
  animIntensity?: number
}

// ─── Export State ───
export interface ExportState {
  status: 'idle' | 'preparing' | 'rendering' | 'encoding' | 'done' | 'error'
  progress: number
  currentScene: number
  totalScenes: number
  message: string
  downloadUrl?: string
  error?: string
}

// ─── Brand Settings ───
export interface BrandSettings {
  logo: string | null
  primaryColor: string
  secondaryColor: string
  font: string
  footer: string
  endCredit: string
  watermark: boolean
  introAnimation: boolean
  outroAnimation: boolean
}

// ─── Project ───
export interface Project {
  title: string
  topic: string
  description: string
  audience: string
  language: string
  tone: string
  duration: string
  scenes: Scene[]
  globalAnimation: string
  globalTransition: string
  transitionDuration: number
  voice: string
  voiceSpeed: number
  voicePitch: number
  voiceEmotion: string
  subtitleFont: string
  subtitleSize: number
  subtitleColor: string
  subtitleBg: string
  subtitlePosition: string
  musicCategory: string
  musicVolume: number
  musicFadeIn: boolean
  musicFadeOut: boolean
  autoDucking: boolean
  brand: BrandSettings
  exportPreset: string
  resolution: string
  fps: number
  format: string
}

// ─── Step ───
export interface WorkflowStep {
  id: string
  label: string
  labelTh: string
  icon: React.ComponentType<{ className?: string }>
}
