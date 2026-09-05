import React, { useState, useEffect } from 'react'

export default function LiveTimer({ startDate = "2024-09-07T00:00:00", t }) {
  const [timePassed, setTimePassed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const updateTimer = () => {
      const start = new Date(startDate).getTime()
      const now = new Date().getTime()
      const difference = Math.max(0, now - start)

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((difference / 1000 / 60) % 60)
      const seconds = Math.floor((difference / 1000) % 60)

      setTimePassed({ days, hours, minutes, seconds })
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [startDate])

  const timeUnits = [
    { label: t?.days || 'GÜN', value: timePassed.days },
    { label: t?.hours || 'SAAT', value: String(timePassed.hours).padStart(2, '0') },
    { label: t?.minutes || 'DAKİKA', value: String(timePassed.minutes).padStart(2, '0') },
    { label: t?.seconds || 'SANİYE', value: String(timePassed.seconds).padStart(2, '0') }
  ]

  return (
    <div className="w-full max-w-2xl mx-auto my-6 px-4">
      {/* Label above timer */}
      <div className="text-center mb-3">
        <span className="text-[11px] font-semibold tracking-widest text-rose-400/90 uppercase inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
          {t?.timerBadge || "Birlikte Geçen Zaman"}
        </span>
      </div>

      {/* Grid of Ticking Tiles */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {timeUnits.map((unit, idx) => (
          <div
            key={idx}
            className="timer-tile p-3 sm:p-5 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center transition-all duration-300 hover:border-rose-500/30"
          >
            <span className="font-serif-romantic text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400 drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)]">
              {unit.value}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-rose-300/70 mt-1 uppercase">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
