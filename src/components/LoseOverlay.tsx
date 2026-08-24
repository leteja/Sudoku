import { useMemo, type CSSProperties } from 'react'

type LoseOverlayProps = {
  active: boolean
}

type Drop = {
  id: number
  left: number
  delay: number
  duration: number
  width: number
  height: number
  opacity: number
}

export function LoseOverlay({ active }: LoseOverlayProps) {
  const drops = useMemo<Drop[]>(
    () =>
      Array.from({ length: 28 }, (_, id) => ({
        id,
        left: Math.random() * 100,
        delay: Math.random() * 1.8,
        duration: 1.8 + Math.random() * 2.4,
        width: 8 + Math.random() * 18,
        height: 90 + Math.random() * 180,
        opacity: 0.45 + Math.random() * 0.45,
      })),
    [],
  )

  if (!active) return null

  return (
    <div className="lose-overlay" aria-live="assertive">
      <div className="lose-overlay__blood" aria-hidden>
        {drops.map((d) => (
          <span
            key={d.id}
            className="blood-stream"
            style={
              {
                left: `${d.left}%`,
                width: `${d.width}px`,
                height: `${d.height}px`,
                opacity: d.opacity,
                animationDelay: `${d.delay}s`,
                animationDuration: `${d.duration}s`,
              } as CSSProperties
            }
          />
        ))}
        <div className="blood-veil" />
      </div>
      <p className="lose-overlay__text font-display">Pralaimejai</p>
    </div>
  )
}
