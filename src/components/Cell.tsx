import type { Digit, Notes } from '../lib/sudoku'

type Corner = 'tl' | 'tr' | 'bl' | 'br' | null

type CellProps = {
  value: Digit | null
  notes: Notes
  given: boolean
  selected: boolean
  related: boolean
  sameDigit: boolean
  conflict: boolean
  corner?: Corner
  onSelect: () => void
}

const NOTE_ORDER: Digit[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const CORNER_CLASS: Record<Exclude<Corner, null>, string> = {
  tl: 'cell-corner-tl',
  tr: 'cell-corner-tr',
  bl: 'cell-corner-bl',
  br: 'cell-corner-br',
}

export function Cell({
  value,
  notes,
  given,
  selected,
  related,
  sameDigit,
  conflict,
  corner = null,
  onSelect,
}: CellProps) {
  const stateClass = [
    'cell',
    selected && 'is-selected',
    !selected && sameDigit && 'is-same',
    !selected && !sameDigit && related && 'is-related',
    conflict && 'is-conflict',
    !conflict && !selected && given && 'is-given',
    !conflict && !selected && !given && value !== null && 'is-answer',
    corner && CORNER_CLASS[corner],
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`${stateClass} relative flex aspect-square w-full touch-manipulation items-center justify-center overflow-hidden transition-[background-color,color] duration-150`}
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
                notes.has(digit) ? 'note-digit opacity-100' : 'opacity-0',
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
