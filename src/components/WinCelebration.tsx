import { useMemo, type CSSProperties } from 'react'

type WinCelebrationProps = {
  active: boolean
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

export function WinCelebration({ active }: WinCelebrationProps) {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 72 }, (_, id) => ({
        id,
        left: Math.random() * 100,
        delay: Math.random() * 2.4,
        duration: 2.6 + Math.random() * 2.8,
        size: 6 + Math.random() * 10,
        color: COLORS[id % COLORS.length],
        drift: -50 + Math.random() * 100,
        rotate: Math.random() * 720,
      })),
    [],
  )

  if (!active) return null

  return (
    <div className="win-celebration" aria-live="assertive">
      <div className="win-celebration__glitter" aria-hidden>
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
      <p className="win-celebration__text font-display">Sveikinu</p>
    </div>
  )
}
