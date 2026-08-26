export type Digit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type CellValue = Digit | null
export type Notes = Set<Digit>
export type Difficulty = 'beginner' | 'easy' | 'medium' | 'hard'

export type Board = CellValue[][]
export type NotesGrid = Notes[][]

const DIGITS: Digit[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export function emptyBoard(): Board {
  return Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => null))
}

export function emptyNotes(): NotesGrid {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => new Set<Digit>()),
  )
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row])
}

export function cloneNotes(notes: NotesGrid): NotesGrid {
  return notes.map((row) => row.map((cell) => new Set(cell)))
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function boxStart(index: number): number {
  return Math.floor(index / 3) * 3
}

export function isValidPlacement(
  board: Board,
  row: number,
  col: number,
  value: Digit,
): boolean {
  for (let i = 0; i < 9; i += 1) {
    if (board[row][i] === value || board[i][col] === value) return false
  }

  const r0 = boxStart(row)
  const c0 = boxStart(col)
  for (let r = r0; r < r0 + 3; r += 1) {
    for (let c = c0; c < c0 + 3; c += 1) {
      if (board[r][c] === value) return false
    }
  }

  return true
}

function findEmpty(board: Board): [number, number] | null {
  for (let r = 0; r < 9; r += 1) {
    for (let c = 0; c < 9; c += 1) {
      if (board[r][c] === null) return [r, c]
    }
  }
  return null
}

export function solveBoard(board: Board): boolean {
  const empty = findEmpty(board)
  if (!empty) return true

  const [row, col] = empty
  for (const digit of shuffle(DIGITS)) {
    if (!isValidPlacement(board, row, col, digit)) continue
    board[row][col] = digit
    if (solveBoard(board)) return true
    board[row][col] = null
  }
  return false
}

function countSolutions(board: Board, limit = 2): number {
  const empty = findEmpty(board)
  if (!empty) return 1

  const [row, col] = empty
  let count = 0
  for (const digit of DIGITS) {
    if (!isValidPlacement(board, row, col, digit)) continue
    board[row][col] = digit
    count += countSolutions(board, limit)
    board[row][col] = null
    if (count >= limit) return count
  }
  return count
}

function cluesForDifficulty(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'beginner':
      return 56
    case 'easy':
      return 40
    case 'medium':
      return 32
    case 'hard':
      return 26
  }
}

export function generatePuzzle(difficulty: Difficulty): {
  puzzle: Board
  solution: Board
} {
  const solution = emptyBoard()
  solveBoard(solution)

  const puzzle = cloneBoard(solution)
  const positions = shuffle(
    Array.from({ length: 81 }, (_, i) => [Math.floor(i / 9), i % 9] as const),
  )

  let remaining = 81
  const target = cluesForDifficulty(difficulty)

  for (const [row, col] of positions) {
    if (remaining <= target) break
    const backup = puzzle[row][col]
    puzzle[row][col] = null
    const test = cloneBoard(puzzle)
    if (countSolutions(test) !== 1) {
      puzzle[row][col] = backup
    } else {
      remaining -= 1
    }
  }

  return { puzzle, solution }
}

export function getConflicts(board: Board): Set<string> {
  const conflicts = new Set<string>()

  const markDupes = (cells: Array<{ r: number; c: number; v: Digit }>) => {
    const seen = new Map<Digit, Array<{ r: number; c: number }>>()
    for (const cell of cells) {
      const list = seen.get(cell.v) ?? []
      list.push({ r: cell.r, c: cell.c })
      seen.set(cell.v, list)
    }
    for (const list of seen.values()) {
      if (list.length < 2) continue
      for (const { r, c } of list) conflicts.add(`${r}-${c}`)
    }
  }

  for (let r = 0; r < 9; r += 1) {
    const rowCells: Array<{ r: number; c: number; v: Digit }> = []
    for (let c = 0; c < 9; c += 1) {
      const v = board[r][c]
      if (v !== null) rowCells.push({ r, c, v })
    }
    markDupes(rowCells)
  }

  for (let c = 0; c < 9; c += 1) {
    const colCells: Array<{ r: number; c: number; v: Digit }> = []
    for (let r = 0; r < 9; r += 1) {
      const v = board[r][c]
      if (v !== null) colCells.push({ r, c, v })
    }
    markDupes(colCells)
  }

  for (let br = 0; br < 3; br += 1) {
    for (let bc = 0; bc < 3; bc += 1) {
      const boxCells: Array<{ r: number; c: number; v: Digit }> = []
      for (let r = br * 3; r < br * 3 + 3; r += 1) {
        for (let c = bc * 3; c < bc * 3 + 3; c += 1) {
          const v = board[r][c]
          if (v !== null) boxCells.push({ r, c, v })
        }
      }
      markDupes(boxCells)
    }
  }

  return conflicts
}

export function boardsEqual(a: Board, b: Board): boolean {
  for (let r = 0; r < 9; r += 1) {
    for (let c = 0; c < 9; c += 1) {
      if (a[r][c] !== b[r][c]) return false
    }
  }
  return true
}

export function isComplete(board: Board): boolean {
  for (let r = 0; r < 9; r += 1) {
    for (let c = 0; c < 9; c += 1) {
      if (board[r][c] === null) return false
    }
  }
  return getConflicts(board).size === 0
}

export function getCandidates(board: Board, row: number, col: number): Digit[] {
  if (board[row][col] !== null) return []
  return DIGITS.filter((digit) => isValidPlacement(board, row, col, digit))
}

export type TeachingTip = {
  row: number
  col: number
  digit: Digit
  lines: string[]
}

function digitsInRow(board: Board, row: number): Digit[] {
  const values: Digit[] = []
  for (let c = 0; c < 9; c += 1) {
    const v = board[row][c]
    if (v !== null) values.push(v)
  }
  return values.sort((a, b) => a - b)
}

function digitsInCol(board: Board, col: number): Digit[] {
  const values: Digit[] = []
  for (let r = 0; r < 9; r += 1) {
    const v = board[r][col]
    if (v !== null) values.push(v)
  }
  return values.sort((a, b) => a - b)
}

function digitsInBox(board: Board, row: number, col: number): Digit[] {
  const values: Digit[] = []
  const r0 = boxStart(row)
  const c0 = boxStart(col)
  for (let r = r0; r < r0 + 3; r += 1) {
    for (let c = c0; c < c0 + 3; c += 1) {
      const v = board[r][c]
      if (v !== null) values.push(v)
    }
  }
  return values.sort((a, b) => a - b)
}

function missingDigits(present: Digit[]): Digit[] {
  return DIGITS.filter((d) => !present.includes(d))
}

function explainNakedSingle(
  board: Board,
  row: number,
  col: number,
  digit: Digit,
): string[] {
  const rowDigits = digitsInRow(board, row)
  const colDigits = digitsInCol(board, col)
  const boxDigits = digitsInBox(board, row, col)
  const rowMissing = missingDigits(rowDigits)
  const colMissing = missingDigits(colDigits)
  const boxMissing = missingDigits(boxDigits)

  const describe = (
    place: string,
    present: Digit[],
    missing: Digit[],
  ): string => {
    if (missing.length === 1) {
      return `${place} trūksta tik ${missing[0]}.`
    }
    return `${place} jau yra ${present.join(', ') || '—'}, trūksta: ${missing.join(', ')}.`
  }

  return [
    `Langelis: ${row + 1} eilutė, ${col + 1} stulpelis.`,
    describe('Eilutėje', rowDigits, rowMissing),
    describe('Stulpelyje', colDigits, colMissing),
    describe('3×3 kvadrate', boxDigits, boxMissing),
    `Todėl čia tinka tik ${digit}.`,
  ]
}

function clarityScore(board: Board, row: number, col: number): number {
  const rowMissing = missingDigits(digitsInRow(board, row)).length
  const colMissing = missingDigits(digitsInCol(board, col)).length
  const boxMissing = missingDigits(digitsInBox(board, row, col)).length
  // Prefer units that are one digit short — easiest to understand
  let score = 0
  if (rowMissing === 1) score += 10
  if (colMissing === 1) score += 10
  if (boxMissing === 1) score += 10
  score += 27 - (rowMissing + colMissing + boxMissing)
  return score
}

/** Only tips where exactly one digit is possible (naked single). */
export function findTeachingTip(board: Board): TeachingTip | null {
  const tips: TeachingTip[] = []

  for (let r = 0; r < 9; r += 1) {
    for (let c = 0; c < 9; c += 1) {
      if (board[r][c] !== null) continue
      const candidates = getCandidates(board, r, c)
      if (candidates.length !== 1) continue
      const digit = candidates[0]
      tips.push({
        row: r,
        col: c,
        digit,
        lines: explainNakedSingle(board, r, c, digit),
      })
    }
  }

  if (tips.length === 0) return null

  tips.sort((a, b) => clarityScore(board, b.row, b.col) - clarityScore(board, a.row, a.col))
  return tips[0]
}
