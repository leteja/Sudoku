import type { Digit, Notes } from '../lib/sudoku'

type CellProps = {
  value: Digit | null
  notes: Notes
  given: boolean
  selected: boolean
  related: boolean
  sameDigit: boolean
  conflict: boolean
  onSelect: () => void
}

const NOTE_ORDER: Digit[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export function Cell({
  value,
  notes,
  given,
  selected,
  related,
  sameDigit,
  conflict,
  onSelect,
}: CellProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={[
        'cell relative flex aspect-square w-full items-center justify-center overflow-hidden transition-[background-color,color] duration-150',
        selected
          ? 'bg-[var(--cell-selected)] z-[1]'
          : sameDigit
            ? 'bg-[var(--cell-same)]'
            : related
              ? 'bg-[var(--cell-related)]'
              : 'bg-[var(--cell-bg)]',
        conflict
          ? 'text-[var(--danger)]'
          : selected
            ? 'text-white'
            : given
              ? 'text-[var(--ink)]'
              : 'text-[var(--accent)]',
      ].join(' ')}
    >
      {value !== null ? (
        <span
          className={[
            'font-display text-[clamp(1.15rem,4.2vw,1.75rem)] leading-none tracking-tight',
            given ? 'font-bold' : 'font-semibold',
          ].join(' ')}
        >
          {value}
        </span>
      ) : notes.size > 0 ? (
        <div className="note-grid absolute inset-[8%] grid grid-cols-3 grid-rows-3 place-items-center">
          {NOTE_ORDER.map((digit) => (
            <span
              key={digit}
              className={[
                'font-ui text-[clamp(0.45rem,1.6vw,0.68rem)] leading-none tabular-nums',
                notes.has(digit)
                  ? 'text-[var(--note)] opacity-100'
                  : 'opacity-0',
              ].join(' ')}
            >
              {digit}
            </span>
          ))}
        </div>
      ) : null}
    </button>
  )
}
