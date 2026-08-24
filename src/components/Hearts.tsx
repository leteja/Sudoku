import { Heart, HeartCrack } from 'lucide-react'

type HeartsProps = {
  lives: number
  maxLives?: number
}

export function Hearts({ lives, maxLives = 3 }: HeartsProps) {
  return (
    <div
      className="hearts flex w-full items-center justify-center gap-4"
      aria-label={`Gyvybės: ${lives} iš ${maxLives}`}
      role="status"
    >
      {Array.from({ length: maxLives }, (_, index) => {
        const alive = index < lives
        if (alive) {
          return (
            <Heart
              key={index}
              size={44}
              strokeWidth={2}
              className="fill-[#e11d48] text-[#e11d48] drop-shadow-[0_4px_10px_rgba(225,29,72,0.35)] transition-all duration-300"
              aria-hidden
            />
          )
        }

        return (
          <HeartCrack
            key={index}
            size={44}
            strokeWidth={2.1}
            className="fill-[#1a1a1a] text-[#1a1a1a] opacity-90 transition-all duration-300"
            aria-hidden
          />
        )
      })}
    </div>
  )
}
