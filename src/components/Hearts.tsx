import { Heart } from 'lucide-react'

type HeartsProps = {
  lives: number
  maxLives?: number
}

export function Hearts({ lives, maxLives = 3 }: HeartsProps) {
  return (
    <div
      className="hearts flex items-center gap-1.5"
      aria-label={`Gyvybės: ${lives} iš ${maxLives}`}
      role="status"
    >
      {Array.from({ length: maxLives }, (_, index) => {
        const alive = index < lives
        return (
          <Heart
            key={index}
            size={22}
            strokeWidth={2.2}
            className={[
              'transition-all duration-200',
              alive
                ? 'fill-[#e11d48] text-[#e11d48] scale-100'
                : 'fill-transparent text-[#b8bec6] scale-90 opacity-45',
            ].join(' ')}
            aria-hidden
          />
        )
      })}
    </div>
  )
}
