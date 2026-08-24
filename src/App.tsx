import { useCallback, useEffect, useMemo, useState } from 'react'
import { BoardView } from './components/BoardView'
import { Controls } from './components/Controls'
import { Hearts } from './components/Hearts'
import { WinCelebration } from './components/WinCelebration'
import {
  boardsEqual,
  cloneBoard,
  cloneNotes,
  emptyNotes,
  generatePuzzle,
  getConflicts,
  isComplete,
  type Board,
  type Difficulty,
  type Digit,
  type NotesGrid,
} from './lib/sudoku'
import { RefreshCw, CheckCircle2, Lightbulb } from 'lucide-react'

const MAX_LIVES = 3

type GameState = {
  puzzle: Board
  solution: Board
  board: Board
  given: boolean[][]
  notes: NotesGrid
}

function makeGiven(puzzle: Board): boolean[][] {
  return puzzle.map((row) => row.map((cell) => cell !== null))
}

function newGame(difficulty: Difficulty): GameState {
  const { puzzle, solution } = generatePuzzle(difficulty)
  return {
    puzzle,
    solution,
    board: cloneBoard(puzzle),
    given: makeGiven(puzzle),
    notes: emptyNotes(),
  }
}

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: 'Lengvas',
  medium: 'Vidutinis',
  hard: 'Sunkus',
}

export default function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [game, setGame] = useState<GameState>(() => newGame('easy'))
  const [selected, setSelected] = useState<{ row: number; col: number } | null>({
    row: 0,
    col: 0,
  })
  const [notesMode, setNotesMode] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const [won, setWon] = useState(false)
  const [lives, setLives] = useState(MAX_LIVES)
  const [lost, setLost] = useState(false)

  const conflicts = useMemo(() => {
    const set = getConflicts(game.board)
    for (let r = 0; r < 9; r += 1) {
      for (let c = 0; c < 9; c += 1) {
        const value = game.board[r][c]
        if (value === null || game.given[r][c]) continue
        if (value !== game.solution[r][c]) set.add(`${r}-${c}`)
      }
    }
    return set
  }, [game.board, game.given, game.solution])
  const gameOver = won || lost

  const startFresh = useCallback((level: Difficulty) => {
    setDifficulty(level)
    setGame(newGame(level))
    setSelected({ row: 0, col: 0 })
    setWon(false)
    setLost(false)
    setLives(MAX_LIVES)
    setMessage('Nauja lenta paruošta. Pradėk nuo užrašų kampe.')
  }, [])

  const applyDigit = useCallback(
    (digit: Digit) => {
      if (!selected || gameOver) return
      const { row, col } = selected
      if (game.given[row][col]) {
        setMessage('Šis skaičius duotas — jo keisti negalima.')
        return
      }

      if (notesMode) {
        setGame((prev) => {
          const board = cloneBoard(prev.board)
          const notes = cloneNotes(prev.notes)
          board[row][col] = null
          if (notes[row][col].has(digit)) notes[row][col].delete(digit)
          else notes[row][col].add(digit)
          return { ...prev, board, notes }
        })
        setMessage(`Užrašas ${digit} kampe.`)
        return
      }

      const correct = game.solution[row][col] === digit
      const alreadyCorrect = game.board[row][col] === game.solution[row][col]

      if (!correct) {
        setGame((prev) => {
          const board = cloneBoard(prev.board)
          const notes = cloneNotes(prev.notes)
          board[row][col] = digit
          notes[row][col] = new Set()
          return { ...prev, board, notes }
        })

        setLives((prevLives) => {
          const next = Math.max(0, prevLives - 1)
          if (next === 0) {
            setLost(true)
            setMessage('Nebėra širdučių — žaidimas baigtas. Spausk „Naujas“.')
          } else {
            setMessage(
              `Neteisingas atsakymas. Liko ${next} ${next === 1 ? 'širdutė' : 'širdutės'}.`,
            )
          }
          return next
        })
        return
      }

      if (alreadyCorrect && game.board[row][col] === digit) {
        setMessage('Šis langelis jau teisingas.')
        return
      }

      setGame((prev) => {
        const board = cloneBoard(prev.board)
        const notes = cloneNotes(prev.notes)
        board[row][col] = digit
        notes[row][col] = new Set()

        for (let i = 0; i < 9; i += 1) {
          notes[row][i].delete(digit)
          notes[i][col].delete(digit)
        }
        const r0 = Math.floor(row / 3) * 3
        const c0 = Math.floor(col / 3) * 3
        for (let r = r0; r < r0 + 3; r += 1) {
          for (let c = c0; c < c0 + 3; c += 1) {
            notes[r][c].delete(digit)
          }
        }

        return { ...prev, board, notes }
      })
      setMessage(`Atsakymas ${digit} įrašytas.`)
    },
    [game.board, game.given, game.solution, gameOver, notesMode, selected],
  )

  const erase = useCallback(() => {
    if (!selected || gameOver) return
    const { row, col } = selected
    if (game.given[row][col]) {
      setMessage('Šis skaičius duotas — jo trinti negalima.')
      return
    }

    setGame((prev) => {
      const board = cloneBoard(prev.board)
      const notes = cloneNotes(prev.notes)
      board[row][col] = null
      notes[row][col] = new Set()
      return { ...prev, board, notes }
    })
    setMessage('Langelis išvalytas.')
  }, [game.given, gameOver, selected])

  useEffect(() => {
    if (lost || lives === 0) return
    if (isComplete(game.board) && boardsEqual(game.board, game.solution)) {
      setWon(true)
      setMessage('Puiku — Sudoku išspręstas!')
    }
  }, [game.board, game.solution, lives, lost])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!selected) return
      if (event.key >= '1' && event.key <= '9') {
        applyDigit(Number(event.key) as Digit)
        return
      }
      if (event.key === 'Backspace' || event.key === 'Delete' || event.key === '0') {
        erase()
        return
      }
      if (event.key === 'n' || event.key === 'N') {
        setNotesMode((v) => !v)
        return
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setSelected((s) => (s ? { row: Math.max(0, s.row - 1), col: s.col } : s))
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setSelected((s) => (s ? { row: Math.min(8, s.row + 1), col: s.col } : s))
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setSelected((s) => (s ? { row: s.row, col: Math.max(0, s.col - 1) } : s))
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        setSelected((s) => (s ? { row: s.row, col: Math.min(8, s.col + 1) } : s))
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [applyDigit, erase, selected])

  const checkProgress = () => {
    if (lost) {
      setMessage('Žaidimas baigtas — pradėk naują.')
      return
    }
    let wrong = 0
    let filled = 0
    for (let r = 0; r < 9; r += 1) {
      for (let c = 0; c < 9; c += 1) {
        const value = game.board[r][c]
        if (value === null || game.given[r][c]) continue
        filled += 1
        if (value !== game.solution[r][c]) wrong += 1
      }
    }
    if (filled === 0) {
      setMessage('Dar nėra atsakymų — pirmiausia užsirašyk arba įrašyk skaičių.')
      return
    }
    if (wrong === 0) {
      setMessage(`Visi ${filled} tavo atsakymai teisingi. Tęsk!`)
    } else {
      setMessage(`Rasta ${wrong} klaidingų atsakymų iš ${filled}.`)
    }
  }

  const revealHint = () => {
    if (!selected || gameOver) return
    const { row, col } = selected
    if (game.given[row][col] || game.board[row][col] === game.solution[row][col]) {
      setMessage('Pasirink tuščią ar klaidingą langelį užuominai.')
      return
    }
    const digit = game.solution[row][col]
    setNotesMode(false)
    setGame((prev) => {
      const board = cloneBoard(prev.board)
      const notes = cloneNotes(prev.notes)
      board[row][col] = digit
      notes[row][col] = new Set()
      return { ...prev, board, notes }
    })
    setMessage(`Užuomina: čia turi būti ${digit}.`)
  }

  return (
    <div className="app-root min-h-dvh">
      <WinCelebration active={won} />
      <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 py-6 sm:px-6 sm:py-10">
        <header className="mb-6 sm:mb-8 animate-fade">
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            Mokymuisi
          </p>
          <h1 className="font-display mt-2 text-[clamp(2.4rem,8vw,3.6rem)] font-bold leading-[0.95] tracking-tight text-[var(--ink)]">
            Sudoku
          </h1>
          <p className="mt-3 max-w-xl font-ui text-base text-[var(--muted)] sm:text-lg">
            Pirmiausia užsirašyk galimus skaičius kampe, o kai būsi tikras — įrašyk
            atsakymą. Klaida suskaldo širdutę.
          </p>
          <div className="mt-5">
            <Hearts lives={lives} maxLives={MAX_LIVES} />
          </div>
        </header>

        <div className="mb-5 flex flex-wrap items-center gap-2 animate-fade">
          {(Object.keys(DIFFICULTY_LABEL) as Difficulty[]).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => startFresh(level)}
              className={[
                'rounded-full px-3.5 py-1.5 font-ui text-sm font-medium transition',
                difficulty === level
                  ? 'bg-[var(--ink)] text-[var(--paper)]'
                  : 'bg-[var(--surface)] text-[var(--ink)] ring-1 ring-[var(--ring)] hover:bg-white',
              ].join(' ')}
            >
              {DIFFICULTY_LABEL[level]}
            </button>
          ))}
          <button
            type="button"
            onClick={() => startFresh(difficulty)}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[var(--surface)] px-3.5 py-1.5 font-ui text-sm font-medium text-[var(--ink)] ring-1 ring-[var(--ring)] transition hover:bg-white"
          >
            <RefreshCw size={14} />
            Naujas
          </button>
        </div>

        <main className="flex flex-1 flex-col items-center gap-5">
          <BoardView
            board={game.board}
            given={game.given}
            notes={game.notes}
            selected={selected}
            conflicts={conflicts}
            onSelect={(row, col) => setSelected({ row, col })}
          />

          <Controls
            notesMode={notesMode}
            onNotesModeChange={(enabled) => {
              setNotesMode(enabled)
              setMessage(
                enabled
                  ? 'Persijungei į užrašų režimą.'
                  : 'Persijungei į atsakymo režimą.',
              )
            }}
            onDigit={applyDigit}
            onErase={erase}
            disabled={gameOver}
          />

          <div className="flex w-full max-w-[min(92vw,34rem)] flex-wrap gap-2 animate-rise-delay-2">
            <button
              type="button"
              onClick={checkProgress}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--surface)] px-4 py-3 font-ui text-sm font-semibold text-[var(--ink)] ring-1 ring-[var(--ring)] transition hover:bg-white"
            >
              <CheckCircle2 size={16} />
              Tikrinti atsakymus
            </button>
            <button
              type="button"
              onClick={revealHint}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--surface)] px-4 py-3 font-ui text-sm font-semibold text-[var(--ink)] ring-1 ring-[var(--ring)] transition hover:bg-white"
            >
              <Lightbulb size={16} />
              Užuomina
            </button>
          </div>

          <div
            className={[
              'min-h-12 w-full max-w-[min(92vw,34rem)] rounded-2xl px-4 py-3 font-ui text-sm transition',
              won
                ? 'bg-[var(--success-bg)] text-[var(--success)]'
                : lost
                  ? 'bg-[#fde8e8] text-[var(--danger)]'
                  : 'bg-[var(--surface)] text-[var(--muted)] ring-1 ring-[var(--ring)]',
            ].join(' ')}
            role="status"
          >
            {message ??
              'Pasirink langelį. Įjunk „Užrašai“, kad skaičius atsirastų kampe.'}
          </div>
        </main>
      </div>
    </div>
  )
}
