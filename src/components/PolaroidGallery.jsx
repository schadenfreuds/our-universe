import React, { useState } from 'react'
import { Calendar, MapPin, X, Heart, Eye, Sparkles, Lock, Key, Unlock } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function PolaroidGallery({ 
  memories = [], 
  id = "timeline", 
  anniversaryPassword = "Caffe Greco", 
  vaultDescription,
  vaultPlaceholder,
  t 
}) {
  const [activeItem, setActiveItem] = useState(null)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [inputDate, setInputDate] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Flexible validator: handles text phrases, cafe names, or dates seamlessly
  const handleUnlock = (e) => {
    e.preventDefault()
    setErrorMsg('')

    const targetAnswer = (anniversaryPassword || 'Caffe Greco').trim().toLowerCase()
    const userInput = inputDate.trim().toLowerCase()

    const triggerSuccess = () => {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      })
      setIsUnlocked(true)
    }

    // 1. Direct match (case-insensitive)
    if (userInput === targetAnswer) {
      triggerSuccess()
      return
    }

    // 2. Normalize alphanumeric (e.g. "caffegreco" === "caffe greco")
    const cleanUser = userInput.replace(/[^a-z0-9ğüşıöç]/gi, '')
    const cleanTarget = targetAnswer.replace(/[^a-z0-9ğüşıöç]/gi, '')
    if (cleanUser && cleanTarget && cleanUser === cleanTarget) {
      triggerSuccess()
      return
    }

    // 3. Fallback for date formats if target or input is numeric (e.g. 0709, 07.09)
    const cleanNumUser = userInput.replace(/[^0-9]/g, '')
    const cleanNumTarget = targetAnswer.replace(/[^0-9]/g, '')
    if (cleanNumTarget && cleanNumUser && (
      cleanNumUser === cleanNumTarget ||
      cleanNumUser.startsWith(cleanNumTarget)
    )) {
      triggerSuccess()
      return
    }

    setErrorMsg(t?.wrongAnswerMsg || t?.wrongDateMsg || 'Hmm, bu cevap doğru değil sevgilim. Tekrar dene ❤️')
  }

  const handleLock = () => {
    setIsUnlocked(false)
    setInputDate('')
  }

  return (
    <section id={id} className="w-full max-w-5xl mx-auto px-4 pt-16 pb-24">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles size={14} className="text-rose-400" />
          <span>{t?.timelineBadge || "Zaman Tüneli"}</span>
        </div>
        <h2 className="font-serif-romantic text-3xl sm:text-5xl text-white font-bold mb-3 tracking-tight">
          {t?.timelineTitle || "Özel Anılar Sandığı"}
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto font-light leading-relaxed">
          {t?.timelineSubtitle || "Birlikte biriktirdiğimiz her bir an, evrenin en parlak yıldızı gibi..."}
        </p>
      </div>

      {/* LOCKED STATE GATE */}
      {!isUnlocked ? (
        <div className="max-w-md mx-auto cosmic-card p-6 sm:p-8 rounded-3xl border border-white/10 text-center relative overflow-hidden shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-4 animate-pulse">
            <Lock size={28} />
          </div>

          <h3 className="font-serif-romantic text-2xl text-white font-medium mb-2">
            {t?.lockedTitle || "Anılar Kilitli 🔒"}
          </h3>

          <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed mb-6">
            {vaultDescription || t?.lockedDesc}
          </p>

          <form onSubmit={handleUnlock} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                placeholder={vaultPlaceholder || t?.inputPlaceholder}
                className="w-full bg-black/50 border border-white/20 px-4 py-3 text-center text-base sm:text-lg font-mono text-white rounded-2xl focus:outline-rose-500 placeholder:text-slate-500 transition-all"
              />
              <Key size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>

            {errorMsg && (
              <p className="text-rose-400 text-xs font-medium animate-shake">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-sm rounded-2xl shadow-lg shadow-rose-500/25 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Unlock size={16} />
              <span>{t?.unlockButton || "Anıların Kilidini Aç"}</span>
            </button>
          </form>
        </div>
      ) : (
        /* UNLOCKED STATE: MEMORY CARDS */
        <div>
          {/* Top Unlocked Bar */}
          <div className="flex items-center justify-between mb-8 px-2">
            <span className="text-xs text-rose-300 font-medium flex items-center gap-1.5">
              <Sparkles size={14} className="text-rose-400" />
              <span>{t?.unlockedBadge || "Kilidi Açıldı • Tüm Anılar Görünür"}</span>
            </span>
            <button
              onClick={handleLock}
              className="text-xs text-slate-400 hover:text-rose-300 transition-colors flex items-center gap-1 cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10"
            >
              <Lock size={12} />
              <span>{t?.lockAgain || "Yeniden Kilitle"}</span>
            </button>
          </div>

          {/* Grid of Celestial Memory Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {memories.map((m, idx) => (
              <div
                key={m.id || idx}
                onClick={() => setActiveItem(m)}
                className="cosmic-card p-4 rounded-3xl cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:border-rose-500/40 hover:shadow-[0_15px_35px_rgba(244,63,94,0.15)] relative group flex flex-col"
              >
                {/* Top Constellation Pin */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-300/90 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
                    <Sparkles size={11} className="text-rose-400" />
                    <span>{t?.memoryLabel || "Hatıra #"}{idx + 1}</span>
                  </span>

                  {m.location && (
                    <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      <MapPin size={12} className="text-rose-400" />
                      <span>{m.location}</span>
                    </span>
                  )}
                </div>

                {/* Photo Container */}
                <div className="w-full aspect-4/3 bg-black/40 rounded-2xl overflow-hidden relative border border-white/10 mb-4 group-hover:border-rose-500/30 transition-colors">
                  {m.photo ? (
                    <img
                      src={m.photo}
                      alt={m.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-white/2 border border-dashed border-white/10">
                      <Heart size={32} className="text-rose-500/60 mb-1.5 animate-pulse" />
                      <span className="text-xs font-medium text-slate-400">{t?.emptyPhoto || "Özel Anı Fotoğrafı"}</span>
                      <span className="text-[10px] text-slate-500 mt-0.5 font-light">{t?.emptyPhotoSub || "Panelden görsel ekleyin"}</span>
                    </div>
                  )}

                  {/* Hover Badge */}
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                    <span className="bg-white/15 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full border border-white/30 shadow-lg flex items-center gap-1.5">
                      <Eye size={13} /> {t?.zoom || "Büyüt"}
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="text-left px-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-rose-400/80 mb-1 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {m.date}
                      </span>
                    </div>

                    <h3 className="font-serif-romantic text-lg sm:text-xl text-white font-medium leading-snug mb-1.5 group-hover:text-rose-200 transition-colors">
                      {m.title}
                    </h3>
                  </div>

                  <p className="font-handwriting text-2xl text-rose-200/90 leading-snug mt-2 line-clamp-3">
                    "{m.caption}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Zoom Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="bg-slate-900/95 border border-white/15 p-5 sm:p-7 max-w-xl w-full rounded-3xl shadow-2xl relative text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Photo */}
            <div className="w-full aspect-4/3 bg-black/40 rounded-2xl overflow-hidden mb-4 border border-white/10">
              {activeItem.photo ? (
                <img
                  src={activeItem.photo}
                  alt={activeItem.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                  <Heart size={48} className="text-rose-500/50 mb-2" />
                  <span className="text-sm font-medium">Fotoğraf</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="text-left">
              <div className="flex items-center justify-between text-xs text-rose-400 mb-2 font-medium">
                <span>📅 {activeItem.date}</span>
                {activeItem.location && <span>📍 {activeItem.location}</span>}
              </div>

              <h3 className="font-serif-romantic text-2xl text-white mb-2">
                {activeItem.title}
              </h3>

              <p className="font-handwriting text-2xl text-rose-200 leading-relaxed">
                "{activeItem.caption}"
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
