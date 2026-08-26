type HeartsProps = {
  lives: number
  maxLives?: number
  lost?: boolean
}

function AliveHeart() {
  return (
    <svg
      width="52"
      height="52"
      viewBox="0 0 24 24"
      aria-hidden
      className="drop-shadow-[0_4px_12px_rgba(190,24,93,0.45)]"
    >
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill="#e11d48"
        stroke="#be185d"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BrokenHeart({ emphasize }: { emphasize?: boolean }) {
  const fill = emphasize ? '#9d174d' : '#9d174d'
  const stroke = emphasize ? '#6b0f35' : '#6b0f35'
  return (
    <svg
      width="52"
      height="52"
      viewBox="0 0 24 24"
      aria-hidden
      className={[
        'broken-heart',
        emphasize ? 'drop-shadow-[0_4px_14px_rgba(157,23,77,0.65)]' : '',
      ].join(' ')}
    >
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path
        d="M12.15 5.2 10.2 10.4h2.55L10.05 18.3 14.1 11.05h-2.7L13.9 5.2Z"
        fill="#ffe4ef"
        stroke="#ffe4ef"
        strokeWidth="0.35"
        strokeLinejoin="round"
        className="heart-lightning"
      />
    </svg>
  )
}

export function Hearts({ lives, maxLives = 3, lost = false }: HeartsProps) {
  return (
    <div
      className="hearts flex shrink-0 items-center justify-end gap-2 sm:gap-5"
      aria-label={`Gyvybės: ${lives} iš ${maxLives}`}
      role="status"
    >
      {Array.from({ length: maxLives }, (_, index) => (
        <div key={index} className="transition-transform duration-300">
          {index < lives ? <AliveHeart /> : <BrokenHeart emphasize={lost} />}
        </div>
      ))}
    </div>
  )
}
