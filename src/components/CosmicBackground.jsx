import React, { useEffect, useRef } from 'react'

export default function CosmicBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    let scrollY = window.scrollY
    let targetScrollY = window.scrollY

    const handleScroll = () => {
      targetScrollY = window.scrollY
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    // Generate fixed celestial stars anchored in space (No random self-flight!)
    // They only shift when the user scrolls, creating a true space journey navigation effect.
    const numStars = 160
    const virtualHeight = height * 2.5 // tall virtual cosmos
    const stars = []

    for (let i = 0; i < numStars; i++) {
      // 3 Layers of depth:
      // Layer 1 (Distant): depth 0.15 - tiny, barely moves
      // Layer 2 (Mid-ground): depth 0.45 - medium speed
      // Layer 3 (Foreground): depth 0.95 - moves past quickly
      const layerType = i % 10 < 5 ? 1 : i % 10 < 8 ? 2 : 3
      const depth = layerType === 1 ? 0.15 : layerType === 2 ? 0.45 : 0.95
      const size = layerType === 1 ? 0.9 : layerType === 2 ? 1.6 : 2.6

      stars.push({
        x: Math.random() * width,
        baseY: Math.random() * virtualHeight,
        size: size,
        depth: depth,
        opacity: layerType === 1 ? 0.4 : layerType === 2 ? 0.7 : 0.95,
        color: i % 5 === 0 ? '#fda4af' : (i % 3 === 0 ? '#93c5fd' : '#ffffff'),
        pulseSpeed: 0.015 + Math.random() * 0.02,
        pulseVal: Math.random() * Math.PI * 2
      })
    }

    const render = () => {
      // Smooth lerp on scroll position
      scrollY += (targetScrollY - scrollY) * 0.08

      // Deep space canvas
      ctx.fillStyle = '#080915'
      ctx.fillRect(0, 0, width, height)

      // Dynamic Nebulae that reveal as you navigate down
      // Nebula 1: Top Hero Rose/Purple Nebula (shifts upward as you scroll down)
      const n1Y = height * 0.25 - scrollY * 0.25
      const g1 = ctx.createRadialGradient(width * 0.5, n1Y, 0, width * 0.5, n1Y, width * 0.5)
      g1.addColorStop(0, 'rgba(244, 63, 94, 0.11)')
      g1.addColorStop(0.5, 'rgba(168, 85, 247, 0.04)')
      g1.addColorStop(1, 'transparent')
      ctx.fillStyle = g1
      ctx.fillRect(0, 0, width, height)

      // Nebula 2: Deep Indigo / Cyan Nebula that comes into view as you scroll down to Timeline!
      const n2Y = height * 0.9 - scrollY * 0.4
      const g2 = ctx.createRadialGradient(width * 0.7, n2Y, 0, width * 0.7, n2Y, width * 0.45)
      g2.addColorStop(0, 'rgba(99, 102, 241, 0.09)')
      g2.addColorStop(0.6, 'rgba(6, 182, 212, 0.03)')
      g2.addColorStop(1, 'transparent')
      ctx.fillStyle = g2
      ctx.fillRect(0, 0, width, height)

      // Render stars anchored in space, gliding with scroll parallax
      for (let star of stars) {
        star.pulseVal += star.pulseSpeed

        // Calculate Y position based on camera scroll and star's depth layer
        const effectiveY = star.baseY - scrollY * star.depth
        // Seamless wrap around virtual height
        const wrappedY = ((effectiveY % virtualHeight) + virtualHeight) % virtualHeight

        // Only draw if within current viewport
        if (wrappedY >= -10 && wrappedY <= height + 10) {
          const alpha = Math.max(0.2, Math.min(1, star.opacity + Math.sin(star.pulseVal) * 0.25))
          ctx.fillStyle = star.color
          ctx.globalAlpha = alpha

          ctx.beginPath()
          ctx.arc(star.x, wrappedY, star.size, 0, Math.PI * 2)
          ctx.fill()

          // Glow for close prominent stars
          if (star.size > 2) {
            ctx.shadowBlur = 6
            ctx.shadowColor = star.color
          } else {
            ctx.shadowBlur = 0
          }
        }
      }

      ctx.shadowBlur = 0
      ctx.globalAlpha = 1

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10 w-full h-full"
    />
  )
}
