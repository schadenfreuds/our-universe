import React from 'react'
import LiveTimer from './LiveTimer'
import { Sparkles, ChevronDown, Lock } from 'lucide-react'

export default function Hero({ story, onScrollToTimeline, t }) {
  return (
    <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 pt-8 pb-12 relative">
      {/* Top Floating Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold tracking-wider uppercase mb-5 animate-pulse">
        <Sparkles size={14} className="text-rose-400" />
        <span>{story?.general?.creatorName || "You"} & {story?.general?.partnerName || "Me"}</span>
      </div>

      {/* Main Cosmic Headline */}
      <h1 className="font-serif-romantic text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-4 drop-shadow-[0_4px_25px_rgba(244,63,94,0.3)]">
        {story?.general?.title || "Bizim Evrenimiz"}
      </h1>

      {/* Romantic Subtitle */}
      <p className="text-slate-400 text-base sm:text-lg max-w-lg mx-auto leading-relaxed mb-8 font-light">
        {story?.general?.subtitle || "Yıldızların altında, seninle geçen her saniye hayatımın en güzel hikayesi..."}
      </p>

      {/* Centered Live Ticking Timer! */}
      <LiveTimer startDate={story?.general?.startDate} t={t} />

      {/* Primary Action: Scroll Down to Locked Memories */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <button
          onClick={onScrollToTimeline}
          className="px-7 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-rose-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Lock size={15} className="text-rose-200" />
          <span>{t?.exploreTimeline || "Zaman Tüneline İn (Özel Anılar)"}</span>
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Floating Scroll Indicator */}
      <div 
        onClick={onScrollToTimeline}
        className="mt-12 inline-flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300 cursor-pointer transition-colors group"
      >
        <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-500 group-hover:text-rose-400">
          {t?.scrollDown || "Aşağı Kaydır"}
        </span>
        <ChevronDown size={18} className="animate-bounce text-rose-500/70" />
      </div>
    </section>
  )
}
