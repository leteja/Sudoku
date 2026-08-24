import { Cell } from './Cell'
import type { Board, Digit, NotesGrid } from '../lib/sudoku'

type BoardViewProps = {
  board: Board
  given: boolean[][]
  notes: NotesGrid
  selected: { row: number; col: number } | null
  highlightDigit: Digit | null
  conflicts: Set<string>
  onSelect: (row: number, col: number) => void
}

export function BoardView({
  board,
  given,
  notes,
  selected,
  highlightDigit,
  conflicts,
  onSelect,
}: BoardViewProps) {
  const selectedValue =
    selected && board[selected.row][selected.col] !== null
      ? board[selected.row][selected.col]
      : null

  const focusDigit = highlightDigit ?? selectedValue

  return (
    <div
      className="board-shell mx-auto w-full max-w-[min(92vw,34rem)] animate-rise"
      role="grid"
      aria-label="Sudoku lenta"
    >
      <div className="board grid grid-cols-3 gap-[5px] overflow-hidden rounded-[1.1rem] border-[3px] border-[#9aa3ad] bg-white p-[5px] shadow-[0_24px_60px_-28px_rgba(42,46,51,0.45)]">
        {Array.from({ length: 3 }, (_, boxRow) =>
          Array.from({ length: 3 }, (_, boxCol) => (
            <div
              key={`${boxRow}-${boxCol}`}
              className="grid grid-cols-3 gap-[2px] bg-white"
            >
              {Array.from({ length: 3 }, (_, ir) =>
                Array.from({ length: 3 }, (_, ic) => {
                  const r = boxRow * 3 + ir
                  const c = boxCol * 3 + ic
                  const value = board[r][c]
                  const key = `${r}-${c}`
                  const isSelected = selected?.row === r && selected?.col === c
                  const related =
                    !!selected &&
                    (selected.row === r ||
                      selected.col === c ||
                      (Math.floor(selected.row / 3) === Math.floor(r / 3) &&
                        Math.floor(selected.col / 3) === Math.floor(c / 3)))
                  const sameDigit =
                    focusDigit !== null && value === focusDigit && !isSelected

                  const corner =
                    r === 0 && c === 0
                      ? 'tl'
                      : r === 0 && c === 8
                        ? 'tr'
                        : r === 8 && c === 0
                          ? 'bl'
                          : r === 8 && c === 8
                            ? 'br'
                            : null

                  return (
                    <Cell
                      key={key}
                      value={value}
                      notes={notes[r][c]}
                      given={given[r][c]}
                      selected={isSelected}
                      related={related && !isSelected && !sameDigit}
                      sameDigit={sameDigit}
                      conflict={conflicts.has(key)}
                      corner={corner}
                      onSelect={() => onSelect(r, c)}
                    />
                  )
                }),
              )}
            </div>
          )),
        )}
      </div>
    </div>
  )
}

export type { Digit }
