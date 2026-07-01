"use client"

import React, { useEffect, useRef } from "react"

interface ParticlesProps {
  className?: string
  quantity?: number
  color?: string
}

export function Particles({
  className,
  quantity = 40,
  color = "oklch(var(--primary))",
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const particlesRef = useRef<any[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const canvasSizeRef = useRef({ w: 0, h: 0 })
  const dprRef = useRef(1)

  useEffect(() => {
    if (canvasRef.current) {
      contextRef.current = canvasRef.current.getContext("2d")
    }

    const getHexColor = (oklchColor: string) => {
      // Return hex or fallback since we draw on canvas. 
      // We can also extract oklch or just use a default primary color hex if needed.
      // But since we want to be safe, we can use rgb/hex. Let's convert oklch(var(--primary)) if needed,
      // or we can draw with CSS variable color by using a temp div or parsing.
      // Alternatively, we can use canvas context fillStyle with the CSS variable directly in modern browsers!
      // 'oklch(var(--primary))' works fine in CSS, and modern Canvas API supports it in some browsers.
      // For maximum compatibility, we can use 'rgba(139, 92, 246, alpha)' or fetch the primary color.
      // Let's pass the raw color string and see if we can use it.
      return oklchColor
    }

    const handleResize = () => {
      if (canvasRef.current && contextRef.current) {
        const rect = canvasRef.current.parentElement?.getBoundingClientRect() || {
          width: window.innerWidth,
          height: window.innerHeight,
        }
        const width = rect.width
        const height = rect.height

        canvasSizeRef.current = { w: width, h: height }
        dprRef.current = window.devicePixelRatio || 1

        canvasRef.current.width = width * dprRef.current
        canvasRef.current.height = height * dprRef.current
        canvasRef.current.style.width = `${width}px`
        canvasRef.current.style.height = `${height}px`

        contextRef.current.scale(dprRef.current, dprRef.current)

        initParticles()
      }
    }

    const initParticles = () => {
      const particles = []
      const { w, h } = canvasSizeRef.current
      for (let i = 0; i < quantity; i++) {
        particles.push(createParticle(w, h))
      }
      particlesRef.current = particles
    }

    const createParticle = (w: number, h: number) => {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        size: Math.random() * 2 + 1,
        alpha: 0,
        targetAlpha: Math.random() * 0.5 + 0.15,
        dx: 0,
        dy: 0,
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        mouseRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        }
      }
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)
    handleResize()

    let animationFrameId: number

    const drawParticles = () => {
      const ctx = contextRef.current
      if (!ctx) return

      ctx.clearRect(0, 0, canvasSizeRef.current.w, canvasSizeRef.current.h)

      particlesRef.current.forEach((p) => {
        // Handle alpha fade in
        if (p.alpha < p.targetAlpha) {
          p.alpha += 0.01
        }

        // Magnetism / Mouse reaction (subtle attraction)
        const dx = mouseRef.current.x - p.x
        const dy = mouseRef.current.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const force = (120 - dist) / 120 // force within 120px

        if (force > 0 && dist > 10) {
          p.dx += (dx / dist) * force * 0.03
          p.dy += (dy / dist) * force * 0.03
        } else {
          p.dx *= 0.95
          p.dy *= 0.95
        }

        p.x += p.vx + p.dx
        p.y += p.vy + p.dy

        // Wrap around boundaries
        if (p.x < 0) p.x = canvasSizeRef.current.w
        if (p.x > canvasSizeRef.current.w) p.x = 0
        if (p.y < 0) p.y = canvasSizeRef.current.h
        if (p.y > canvasSizeRef.current.h) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        // Set fill color to a purple/primary fallback if OKLCH is not resolved
        ctx.fillStyle = color.startsWith("oklch") ? "rgba(168, 85, 247, 0.5)" : color
        ctx.globalAlpha = p.alpha
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(drawParticles)
    }

    drawParticles()

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [quantity, color])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        pointerEvents: "none",
      }}
    />
  )
}
