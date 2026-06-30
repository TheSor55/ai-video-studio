# 🎬 AI Video Studio

> สร้างวิดีโอระดับมืออาชีพด้วย AI — จาก Storyboard ถึง Export ในที่เดียว

**AI Story Video Studio** เป็น Web Application สำหรับสร้างวิดีโอโดยอัตโนมัติ รองรับทั้ง Corporate Presentation, ESG Reporting, ISO Training, และ Social Media Content

---

## ✨ Features (Phase 1)

| Module | Description |
|--------|-------------|
| 🎯 AI Storyboard | สร้าง Storyboard อัตโนมัติด้วย Claude AI |
| 🎬 Animation | 8 แบบ — Zoom, Pan, Ken Burns, Parallax ฯลฯ |
| 🎤 Voice Over | AI TTS / Upload / Record — ไทย+อังกฤษ |
| 📝 Subtitle | Auto-generate, ปรับ Font/Size/Color/Position |
| 🔄 Transition | 8 แบบ — Fade, Dissolve, Slide, Cinematic ฯลฯ |
| 🎵 Music | Upload + Music Library 7 หมวด + Auto Ducking |
| 🎨 Brand Template | Logo, สี, Font, Watermark, Intro/Outro |
| 📤 Export | YouTube/TikTok/FB/IG, 720p–4K, MP4/MOV/WebM/GIF |
| ⏱️ Timeline | Multi-track — Video, Voice, Subtitle, Music |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/thesor55/ai-video-studio.git
cd ai-video-studio
npm install
```

### 2. ตั้งค่า Environment

```bash
cp .env.example .env.local
```

แก้ไข `.env.local`:
```
VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here
```

> 💡 ถ้าไม่มี API Key ระบบจะใช้ Demo Scenes แทน

### 3. Run Development

```bash
npm run dev
```

เปิด http://localhost:3000

### 4. Build Production

```bash
npm run build
npm run preview    # ทดสอบ build
```

---

## 📦 Deploy

### Option A: Vercel (แนะนำ — ง่ายสุด)

1. Push โค้ดขึ้น GitHub
2. ไปที่ [vercel.com](https://vercel.com) → New Project → Import จาก GitHub
3. ตั้ง Environment Variable:
   - `VITE_ANTHROPIC_API_KEY` = your API key
4. กด Deploy

**หรือใช้ CLI:**
```bash
npm i -g vercel
vercel
```

### Option B: GitHub Pages

1. แก้ `vite.config.ts` — uncomment บรรทัด `base`:
```ts
base: '/ai-video-studio/',
```

2. Push ขึ้น GitHub repo ชื่อ `ai-video-studio`

3. ไปที่ **Settings → Pages → Source** เลือก **GitHub Actions**

4. ตั้ง Secret ที่ **Settings → Secrets → Actions**:
   - `VITE_ANTHROPIC_API_KEY` = your API key

5. Push to `main` → Auto deploy ที่ `https://thesor55.github.io/ai-video-studio/`

### Option C: Cloudflare Pages

1. ไปที่ [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages → Create
2. Connect GitHub repo
3. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Environment Variables → เพิ่ม `VITE_ANTHROPIC_API_KEY`
5. Deploy

### Option D: Self-hosted / Docker

```bash
# Build
npm run build

# Serve ด้วย nginx / caddy / node
npx serve dist -l 3000
```

---

## 🏗️ Project Structure

```
ai-video-studio/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── panels/           # Workflow step panels
│   │   │   ├── StoryboardPanel.tsx
│   │   │   ├── AnimationPanel.tsx
│   │   │   ├── VoiceOverPanel.tsx
│   │   │   ├── SubtitlePanel.tsx
│   │   │   ├── TransitionPanel.tsx
│   │   │   ├── MusicPanel.tsx
│   │   │   ├── BrandPanel.tsx
│   │   │   ├── ExportPanel.tsx
│   │   │   └── index.ts
│   │   ├── PreviewPanel.tsx   # Video preview
│   │   ├── TimelinePanel.tsx  # Multi-track timeline
│   │   └── ui.tsx             # Shared UI components
│   ├── lib/
│   │   ├── constants.ts       # App constants & defaults
│   │   └── types.ts           # TypeScript types
│   ├── App.tsx                # Main app layout
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles
├── .github/workflows/
│   └── deploy.yml             # GitHub Pages CI/CD
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🛠️ Tech Stack

- **Framework:** React 18 + TypeScript
- **Build:** Vite 6
- **Styling:** TailwindCSS 3
- **Icons:** Lucide React
- **AI:** Anthropic Claude API (Storyboard Generation)
- **Fonts:** Inter + Noto Sans Thai (Google Fonts)

---

## 📋 Roadmap

### Phase 1 ✅ (Current)
- [x] AI Storyboard Generator
- [x] Animation Engine (8 types)
- [x] Voice Over Engine (AI TTS / Upload / Record)
- [x] Subtitle Engine
- [x] Transition Engine (8 types)
- [x] Music Engine
- [x] Brand Template
- [x] Export Engine (5 presets)
- [x] Multi-track Timeline

### Phase 2 🔜
- [ ] Full Timeline Editor (Drag & Drop, Split, Merge)
- [ ] Real FFmpeg/Remotion rendering
- [ ] File upload (PPTX, PDF, Images)
- [ ] Multi-format batch export
- [ ] Project save/load (LocalStorage + Cloud)

### Phase 3 🔮
- [ ] Talking Avatar / AI Presenter
- [ ] Real TTS integration (ElevenLabs / OpenAI)
- [ ] Team Collaboration
- [ ] API backend (NestJS + PostgreSQL)
- [ ] Cloudflare R2 storage

---

## 📄 License

MIT — FutureGreen by Sorawit

---

**Built with ❤️ by FutureGreen Consulting**
