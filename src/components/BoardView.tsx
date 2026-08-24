import { Cell } from './Cell'
import type { Board, Digit, NotesGrid } from '../lib/sudoku'

type BoardViewProps = {
  board: Board
  given: boolean[][]
  notes: NotesGrid
  selected: { row: number; col: number } | null
  conflicts: Set<string>
  onSelect: (row: number, col: number) => void
}

export function BoardView({
  board,
  given,
  notes,
  selected,
  conflicts,
  onSelect,
}: BoardViewProps) {
  const selectedValue =
    selected && board[selected.row][selected.col] !== null
      ? board[selected.row][selected.col]
      : null

  return (
    <div
      className="board-shell mx-auto w-full max-w-[min(92vw,34rem)] animate-rise"
      role="grid"
      aria-label="Sudoku lenta"
    >
      <div className="board grid grid-cols-9 overflow-hidden rounded-[1.1rem] border-[3px] border-[var(--ink)] bg-white shadow-[0_24px_60px_-28px_rgba(15,61,62,0.55)]">
        {board.map((row, r) =>
          row.map((value, c) => {
            const key = `${r}-${c}`
            const isSelected = selected?.row === r && selected?.col === c
            const related =
              !!selected &&
              (selected.row === r ||
                selected.col === c ||
                (Math.floor(selected.row / 3) === Math.floor(r / 3) &&
                  Math.floor(selected.col / 3) === Math.floor(c / 3)))
            const sameDigit =
              selectedValue !== null && value === selectedValue && !isSelected

            const thickRight = c === 2 || c === 5
            const thickBottom = r === 2 || r === 5

            return (
              <div
                key={key}
                className={[
                  'border-r-[2px] border-b-[2px] border-white',
                  thickRight ? 'border-r-[4px] border-r-white' : '',
                  thickBottom ? 'border-b-[4px] border-b-white' : '',
                  c === 8 ? 'border-r-0' : '',
                  r === 8 ? 'border-b-0' : '',
                ].join(' ')}
              >
                <Cell
                  value={value}
                  notes={notes[r][c]}
                  given={given[r][c]}
                  selected={isSelected}
                  related={related && !isSelected && !sameDigit}
                  sameDigit={sameDigit}
                  conflict={conflicts.has(key)}
                  onSelect={() => onSelect(r, c)}
                />
              </div>
            )
          }),
        )}
      </div>
    </div>
  )
}

export type { Digit }
