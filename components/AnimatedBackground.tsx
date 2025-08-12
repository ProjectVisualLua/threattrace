"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  type: "node" | "data" | "scan"
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticles = () => {
      const particles: Particle[] = []
      const particleCount = Math.min(150, Math.floor((canvas.width * canvas.height) / 8000))

      for (let i = 0; i < particleCount; i++) {
        const types: Array<"node" | "data" | "scan"> = ["node", "data", "scan"]
        const type = types[Math.floor(Math.random() * types.length)]

        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: type === "node" ? Math.random() * 3 + 2 : Math.random() * 2 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          color: type === "node" ? "#3b82f6" : type === "data" ? "#8b5cf6" : "#10b981",
          type,
        })
      }

      particlesRef.current = particles
    }

    const drawConnections = () => {
      const particles = particlesRef.current
      ctx.strokeStyle = "rgba(59, 130, 246, 0.1)"
      ctx.lineWidth = 1

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            const opacity = ((120 - distance) / 120) * 0.3
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    const drawParticles = () => {
      const particles = particlesRef.current

      particles.forEach((particle) => {
        ctx.save()

        if (particle.type === "node") {
          // Security nodes with pulsing glow
          const pulse = Math.sin(Date.now() * 0.003 + particle.x * 0.01) * 0.3 + 0.7
          ctx.shadowColor = particle.color
          ctx.shadowBlur = 15 * pulse
          ctx.fillStyle = particle.color
          ctx.globalAlpha = particle.opacity * pulse

          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()

          // Inner core
          ctx.shadowBlur = 5
          ctx.fillStyle = "#ffffff"
          ctx.globalAlpha = 0.8
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size * 0.3, 0, Math.PI * 2)
          ctx.fill()
        } else if (particle.type === "data") {
          // Data streams
          ctx.fillStyle = particle.color
          ctx.globalAlpha = particle.opacity
          ctx.fillRect(particle.x, particle.y, particle.size * 2, particle.size * 0.5)

          // Trailing effect
          ctx.fillStyle = `rgba(139, 92, 246, ${particle.opacity * 0.3})`
          ctx.fillRect(particle.x - 10, particle.y, 8, particle.size * 0.5)
        } else {
          // Scan lines
          const scanPulse = Math.sin(Date.now() * 0.005 + particle.y * 0.02) * 0.5 + 0.5
          ctx.strokeStyle = particle.color
          ctx.globalAlpha = particle.opacity * scanPulse
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(particle.x - 20, particle.y)
          ctx.lineTo(particle.x + 20, particle.y)
          ctx.stroke()
        }

        ctx.restore()
      })
    }

    const updateParticles = () => {
      const particles = particlesRef.current

      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Subtle opacity pulsing
        if (particle.type === "node") {
          particle.opacity = 0.4 + Math.sin(Date.now() * 0.002 + particle.x * 0.01) * 0.3
        }
      })
    }

    const drawGrid = () => {
      const gridSize = 50
      const time = Date.now() * 0.001

      ctx.strokeStyle = "rgba(59, 130, 246, 0.05)"
      ctx.lineWidth = 1

      // Vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        const opacity = 0.05 + Math.sin(time + x * 0.01) * 0.02
        ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Horizontal lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        const opacity = 0.05 + Math.sin(time + y * 0.01) * 0.02
        ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      drawGrid()
      drawConnections()
      updateParticles()
      drawParticles()

      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    createParticles()
    animate()

    const handleResize = () => {
      resizeCanvas()
      createParticles()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}
    />
  )
}
