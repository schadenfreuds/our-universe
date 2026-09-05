import React, { useState, useEffect } from 'react'
import CosmicBackground from './components/CosmicBackground'
import Header from './components/Header'
import Hero from './components/Hero'
import PolaroidGallery from './components/PolaroidGallery'
import AdminDashboard from './components/AdminDashboard'
import initialStory from './data/story.json'
import { translations } from './locales/translations'
import { Heart } from 'lucide-react'

export default function App() {
  const [story, setStory] = useState(initialStory)
  const [isAdminOpen, setIsAdminOpen] = useState(false)

  // Language is persisted in story.general.language via Admin Dashboard
  const lang = story.general?.language || 'tr'
  const t = translations[lang] || translations.tr

  // Keep document lang attribute in sync to prevent Turkish uppercase rules in English mode
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  // Dynamically update page title based on configured couple names & universe title
  useEffect(() => {
    const creator = story?.general?.creatorName || 'You'
    const partner = story?.general?.partnerName || 'Me'
    const title = story?.general?.title || (lang === 'en' ? 'Our Universe' : 'Bizim Evrenimiz')
    document.title = `${creator} & ${partner} • ${title} ✨`
  }, [story, lang])

  // Ensure every load starts cleanly at the top of the universe
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleScrollToTimeline = () => {
    const el = document.getElementById('timeline')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen relative text-slate-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      {/* Galactic / Cosmic Living Background with Scroll Parallax */}
      <CosmicBackground />

      <div className="w-full">
        {/* Top Header */}
        <Header 
          story={story}
          onOpenAdmin={() => setIsAdminOpen(true)}
          t={t}
        />

        {/* Main Section */}
        <main className="w-full">
          {/* Public Hero with Centered Live Ticking Timer */}
          <Hero 
            story={story}
            onScrollToTimeline={handleScrollToTimeline}
            t={t}
          />

          {/* Locked/Protected Zaman Tüneli (Requires Anniversary Date) */}
          <PolaroidGallery 
            id="timeline"
            memories={story.memories} 
            anniversaryPassword={story.general?.anniversaryPassword || "0709"}
            t={t}
          />
        </main>
      </div>

      {/* Cosmic Footer */}
      <footer className="w-full text-center py-10 border-t border-white/5 text-xs text-slate-500 relative z-10">
        <div className="flex items-center justify-center gap-1.5 font-medium text-slate-400 mb-1.5">
          <span>{story?.general?.creatorName || "You"}</span>
          <Heart size={12} className="text-rose-500 fill-rose-500 animate-pulse" />
          <span>{story?.general?.partnerName || "Me"}</span>
        </div>
        <p className="text-[11px] text-slate-600 font-light">
          {t.footerQuote}
        </p>
      </footer>

      {/* Admin Dashboard */}
      <AdminDashboard 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        story={story}
        onSaveStory={(updated) => setStory(updated)}
      />
    </div>
  )
}
