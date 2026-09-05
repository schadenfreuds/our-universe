import React, { useState, useRef } from 'react'
import { Volume2, VolumeX, Lock } from 'lucide-react'

export default function Header({ story, onOpenAdmin, t }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  const toggleMusic = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true)
      }).catch(err => {
        console.log("Autoplay prevented:", err)
      })
    }
  }

  return (
    <header className="w-full max-w-5xl mx-auto px-4 pt-6 pb-2">
      {/* Background Audio */}
      {story?.general?.musicUrl && (
        <audio 
          ref={audioRef} 
          src={story.general.musicUrl} 
          loop 
          preload="auto" 
        />
      )}

      <div className="cosmic-card px-5 py-3 rounded-full flex items-center justify-between gap-4">
        {/* Left: Couple Branding */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-sm font-semibold tracking-wide text-white">
            {story?.general?.creatorName || "You"} & {story?.general?.partnerName || "Me"}
          </span>
          <span className="text-xs text-rose-400 font-light hidden sm:inline">{t.brandSubtitle}</span>
        </div>

        {/* Right: Actions (Music & Admin) */}
        <div className="flex items-center gap-2">
          {/* Music Toggle */}
          <button
            onClick={toggleMusic}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Volume2 size={15} className="text-rose-400 animate-bounce" />
                <span className="text-rose-300 hidden xs:inline">{t.musicOn}</span>
              </>
            ) : (
              <>
                <VolumeX size={15} />
                <span className="hidden xs:inline">{t.musicOff}</span>
              </>
            )}
          </button>

          {/* Admin Button */}
          <button
            onClick={onOpenAdmin}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 flex items-center justify-center transition-all cursor-pointer"
            title={t.adminTitle}
          >
            <Lock size={13} />
          </button>
        </div>
      </div>
    </header>
  )
}
