import { useEffect, useRef, useState, type CSSProperties } from 'react'

type FirstMoveGlitterProps = {
  active: boolean
  durationMs?: number
  onDone?: () => void
}

type Particle = {
  id: number
  left: number
  delay: number
  duration: number
  size: number
  color: string
  drift: number
  rotate: number
}

const COLORS = [
  '#ff4d8d',
  '#ff85b3',
  '#ffd6e7',
  '#ffffff',
  '#f9a8d4',
  '#fb7185',
  '#f472b6',
  '#ffe4f1',
]

function createParticles(): Particle[] {
  return Array.from({ length: 56 }, (_, id) => ({
    id,
    left: Math.random() * 100,
    delay: Math.random() * 0.8,
    duration: 2.2 + Math.random() * 1.6,
    size: 6 + Math.random() * 10,
    color: COLORS[id % COLORS.length],
    drift: -50 + Math.random() * 100,
    rotate: Math.random() * 720,
  }))
}

export function FirstMoveGlitter({
  active,
  durationMs = 5000,
  onDone,
}: FirstMoveGlitterProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    if (!active) {
      setParticles([])
      return
    }

    setParticles(createParticles())
    const id = window.setTimeout(() => {
      setParticles([])
      onDoneRef.current?.()
    }, durationMs)

    return () => window.clearTimeout(id)
  }, [active, durationMs])

  if (!active || particles.length === 0) return null

  return (
    <div className="first-move-glitter" aria-hidden>
      {particles.map((p) => (
        <span
          key={p.id}
          className="glitter-piece"
          style={
            {
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size * 0.55}px`,
              background: p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              '--drift': `${p.drift}px`,
              '--spin': `${p.rotate}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
