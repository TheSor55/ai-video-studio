import {
  BookOpen, Film, Mic, Type, Layers, Music, Palette, MonitorPlay,
} from 'lucide-react'
import type { WorkflowStep, Project } from './types'

export const STEPS: WorkflowStep[] = [
  { id: 'storyboard', label: 'Storyboard', labelTh: 'สตอรี่บอร์ด', icon: BookOpen },
  { id: 'animation', label: 'Animation', labelTh: 'แอนิเมชัน', icon: Film },
  { id: 'voiceover', label: 'Voice Over', labelTh: 'เสียงบรรยาย', icon: Mic },
  { id: 'subtitle', label: 'Subtitle', labelTh: 'ซับไตเติ้ล', icon: Type },
  { id: 'transition', label: 'Transition', labelTh: 'ทรานสิชัน', icon: Layers },
  { id: 'music', label: 'Music', labelTh: 'เพลงประกอบ', icon: Music },
  { id: 'brand', label: 'Brand', labelTh: 'แบรนด์', icon: Palette },
  { id: 'export', label: 'Export', labelTh: 'ส่งออก', icon: MonitorPlay },
]

export const ANIMATION_TYPES = [
  { id: 'zoomIn', label: 'Zoom In', icon: '🔍' },
  { id: 'zoomOut', label: 'Zoom Out', icon: '🔭' },
  { id: 'panLeft', label: 'Pan Left', icon: '⬅️' },
  { id: 'panRight', label: 'Pan Right', icon: '➡️' },
  { id: 'kenBurns', label: 'Ken Burns', icon: '🎬' },
  { id: 'parallax', label: 'Parallax', icon: '🌊' },
  { id: 'fadeIn', label: 'Fade In', icon: '✨' },
  { id: 'float', label: 'Float', icon: '🎈' },
]

export const TRANSITION_TYPES = [
  { id: 'fade', label: 'Fade' },
  { id: 'dissolve', label: 'Dissolve' },
  { id: 'slideLeft', label: 'Slide Left' },
  { id: 'slideRight', label: 'Slide Right' },
  { id: 'zoomIn', label: 'Zoom In' },
  { id: 'wipe', label: 'Wipe' },
  { id: 'blur', label: 'Blur' },
  { id: 'cinematic', label: 'Cinematic' },
]

export const VOICES = [
  { id: 'th-female-pro', label: 'ผู้หญิง (Professional)', lang: 'TH' },
  { id: 'th-male-pro', label: 'ผู้ชาย (Professional)', lang: 'TH' },
  { id: 'th-female-teacher', label: 'ผู้หญิง (ครู)', lang: 'TH' },
  { id: 'th-male-doc', label: 'ผู้ชาย (สารคดี)', lang: 'TH' },
  { id: 'en-female-pro', label: 'Female (Professional)', lang: 'EN' },
  { id: 'en-male-pro', label: 'Male (Professional)', lang: 'EN' },
  { id: 'en-female-narrator', label: 'Female (Narrator)', lang: 'EN' },
  { id: 'en-male-doc', label: 'Male (Documentary)', lang: 'EN' },
]

export const MUSIC_CATEGORIES = [
  { id: 'corporate', label: 'Corporate', emoji: '🏢' },
  { id: 'technology', label: 'Technology', emoji: '💻' },
  { id: 'documentary', label: 'Documentary', emoji: '🎥' },
  { id: 'education', label: 'Education', emoji: '📚' },
  { id: 'inspirational', label: 'Inspirational', emoji: '🌟' },
  { id: 'cinematic', label: 'Cinematic', emoji: '🎬' },
  { id: 'emotional', label: 'Emotional', emoji: '💫' },
]

export const EXPORT_PRESETS = [
  { id: 'youtube', label: 'YouTube', ratio: '16:9', res: '1920×1080' },
  { id: 'tiktok', label: 'TikTok', ratio: '9:16', res: '1080×1920' },
  { id: 'facebook', label: 'Facebook', ratio: '4:5', res: '1080×1350' },
  { id: 'instagram', label: 'Instagram', ratio: '1:1', res: '1080×1080' },
  { id: 'presentation', label: 'Presentation', ratio: '16:9', res: '1920×1080' },
]

export const SCENE_GRADIENTS = [
  'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #7C3AED 100%)',
  'linear-gradient(135deg, #134E4A 0%, #0F766E 50%, #2DD4BF 100%)',
  'linear-gradient(135deg, #1E1B4B 0%, #4338CA 50%, #818CF8 100%)',
  'linear-gradient(135deg, #431407 0%, #EA580C 50%, #FDBA74 100%)',
  'linear-gradient(135deg, #052E16 0%, #15803D 50%, #86EFAC 100%)',
]

export const defaultProject = (): Project => ({
  title: '',
  topic: '',
  description: '',
  audience: 'ผู้บริหาร / นักลงทุน',
  language: 'Thai',
  tone: 'Professional',
  duration: '3-5 นาที',
  scenes: [],
  globalAnimation: 'kenBurns',
  globalTransition: 'fade',
  transitionDuration: 1,
  voice: 'th-female-pro',
  voiceSpeed: 1.0,
  voicePitch: 1.0,
  voiceEmotion: 'neutral',
  subtitleFont: 'TH Sarabun New',
  subtitleSize: 24,
  subtitleColor: '#FFFFFF',
  subtitleBg: 'rgba(0,0,0,0.6)',
  subtitlePosition: 'bottom',
  musicCategory: 'corporate',
  musicVolume: 30,
  musicFadeIn: true,
  musicFadeOut: true,
  autoDucking: true,
  brand: {
    logo: null,
    primaryColor: '#1B5E20',
    secondaryColor: '#2E7D32',
    font: 'TH Sarabun New',
    footer: 'FutureGreen by Sorawit',
    endCredit: 'Environmental and Sustainability Consultant',
    watermark: true,
    introAnimation: true,
    outroAnimation: true,
  },
  exportPreset: 'youtube',
  resolution: '1080p',
  fps: 30,
  format: 'mp4',
})
