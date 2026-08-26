import { useCallback, useEffect, useMemo, useState } from 'react'
import { BoardView } from './components/BoardView'
import { Controls } from './components/Controls'
import { Hearts } from './components/Hearts'
import { WinCelebration } from './components/WinCelebration'
import { LoseOverlay } from './components/LoseOverlay'
import { Rules } from './components/Rules'
import { TeachingTipCard } from './components/TeachingTipCard'
import { FirstMoveGlitter } from './components/FirstMoveGlitter'
import {
  boardsEqual,
  cloneBoard,
  cloneNotes,
  emptyNotes,
  findTeachingTip,
  generatePuzzle,
  getConflicts,
  isComplete,
  type Board,
  type Difficulty,
  type Digit,
  type NotesGrid,
} from './lib/sudoku'
import { RefreshCw, CheckCircle2, Lightbulb, Pause, Play, Share2 } from 'lucide-react'
import { Timer } from './components/Timer'

const SHARE_TITLE = 'Sudoku — užrašai ir atsakymai'
const SHARE_TEXT = 'Žaisk Sudoku su užrašais ir atsakymais!'

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
  beginner: 'Pradinukai',
  easy: 'Lengvas',
  medium: 'Vidutinis',
  hard: 'Sunkus',
}

const DIFFICULTY_ORDER: Difficulty[] = ['beginner', 'easy', 'medium', 'hard']

export default function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner')
  const [game, setGame] = useState<GameState>(() => newGame('beginner'))
  const [selected, setSelected] = useState<{ row: number; col: number } | null>({
    row: 0,
    col: 0,
  })
  const [notesMode, setNotesMode] = useState(true)
  const [won, setWon] = useState(false)
  const [lives, setLives] = useState(MAX_LIVES)
  const [lost, setLost] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [paused, setPaused] = useState(false)
  const [highlightDigit, setHighlightDigit] = useState<Digit | null>(null)
  const [shareMessage, setShareMessage] = useState<string | null>(null)
  const [firstMoveGlitter, setFirstMoveGlitter] = useState(false)
  const [celebratedFirstMove, setCelebratedFirstMove] = useState(false)

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
  const inputLocked = gameOver || paused
  const teachingTip = useMemo(
    () => (difficulty === 'beginner' && !gameOver ? findTeachingTip(game.board) : null),
    [difficulty, game.board, gameOver],
  )

  useEffect(() => {
    if (gameOver || paused) return
    const id = window.setInterval(() => {
      setElapsedSeconds((s) => s + 1)
    }, 1000)
    return () => window.clearInterval(id)
  }, [gameOver, paused])

  const startFresh = useCallback((level: Difficulty) => {
    setDifficulty(level)
    setGame(newGame(level))
    setSelected({ row: 0, col: 0 })
    setWon(false)
    setLost(false)
    setLives(MAX_LIVES)
    setElapsedSeconds(0)
    setPaused(false)
    setHighlightDigit(null)
    setFirstMoveGlitter(false)
    setCelebratedFirstMove(false)
  }, [])

  useEffect(() => {
    if (!won && !lost) return
    const id = window.setTimeout(() => {
      startFresh(difficulty)
    }, 5000)
    return () => window.clearTimeout(id)
  }, [won, lost, difficulty, startFresh])

  const applyDigit = useCallback(
    (digit: Digit) => {
      setHighlightDigit(digit)
      if (!selected || gameOver || paused) return
      const { row, col } = selected
      if (game.given[row][col]) {
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
          }
          return next
        })
        return
      }

      if (alreadyCorrect && game.board[row][col] === digit) {
        return
      }

      const isFirstBeginnerAnswer =
        difficulty === 'beginner' &&
        !celebratedFirstMove &&
        !game.given[row][col] &&
        (game.puzzle[row][col] === null)

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

      if (isFirstBeginnerAnswer) {
        setCelebratedFirstMove(true)
        setFirstMoveGlitter(true)
      }
    },
    [
      celebratedFirstMove,
      difficulty,
      game.board,
      game.given,
      game.puzzle,
      game.solution,
      gameOver,
      notesMode,
      paused,
      selected,
    ],
  )

  const erase = useCallback(() => {
    if (!selected || gameOver || paused) return
    const { row, col } = selected
    if (game.given[row][col]) {
      return
    }

    setGame((prev) => {
      const board = cloneBoard(prev.board)
      const notes = cloneNotes(prev.notes)
      board[row][col] = null
      notes[row][col] = new Set()
      return { ...prev, board, notes }
    })
  }, [game.given, gameOver, paused, selected])

  useEffect(() => {
    if (lost || lives === 0) return
    if (isComplete(game.board) && boardsEqual(game.board, game.solution)) {
      setWon(true)
    }
  }, [game.board, game.solution, lives, lost])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (paused || gameOver) return
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
  }, [applyDigit, erase, gameOver, paused, selected])

  const checkProgress = () => {
    if (lost || paused) return
  }

  const revealHint = () => {
    if (!selected || gameOver || paused) return
    const { row, col } = selected
    if (game.given[row][col] || game.board[row][col] === game.solution[row][col]) {
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
  }

  const clearSelection = () => {
    if (paused) return
    setSelected(null)
    setHighlightDigit(null)
  }

  const togglePause = () => {
    if (gameOver) return
    setPaused((value) => !value)
  }

  const showShareMessage = useCallback((message: string) => {
    setShareMessage(message)
    window.setTimeout(() => {
      setShareMessage((current) => (current === message ? null : current))
    }, 2200)
  }, [])

  const shareApp = useCallback(async () => {
    const url = window.location.href
    const shareData: ShareData = {
      title: SHARE_TITLE,
      text: SHARE_TEXT,
      url,
    }

    try {
      if (typeof navigator.share === 'function') {
        const canShare =
          typeof navigator.canShare !== 'function' || navigator.canShare(shareData)
        if (canShare) {
          await navigator.share(shareData)
          showShareMessage('Pasidalinta!')
          return
        }
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      showShareMessage('Nuoroda nukopijuota!')
    } catch {
      showShareMessage('Nepavyko nukopijuoti nuorodos')
    }
  }, [showShareMessage])

  return (
    <div className="app-root min-h-dvh" onClick={clearSelection}>
      <WinCelebration
        active={won}
        elapsedSeconds={elapsedSeconds}
        difficulty={difficulty}
        onPlayAgain={() => startFresh(difficulty)}
      />
      <LoseOverlay active={lost} />
      <FirstMoveGlitter
        active={firstMoveGlitter}
        durationMs={3000}
        onDone={() => setFirstMoveGlitter(false)}
      />
      {shareMessage ? (
        <div className="share-toast" role="status" aria-live="polite">
          {shareMessage}
        </div>
      ) : null}
      <div className="app-shell">
        <header className="mb-3 sm:mb-8 animate-fade">
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-display text-[clamp(2rem,7.5vw,3.6rem)] font-bold leading-[0.95] tracking-tight text-[var(--ink)]">
              Sudoku
            </h1>
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  void shareApp()
                }}
                className="touch-target inline-flex size-11 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--ink)] ring-1 ring-[var(--ring)] transition hover:bg-[#fff1f6]"
                aria-label="Dalintis"
                title="Dalintis"
              >
                <Share2 size={16} />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  togglePause()
                }}
                disabled={gameOver}
                aria-pressed={paused}
                aria-label={paused ? 'Tęsti' : 'Pauzė'}
                title={paused ? 'Tęsti' : 'Pauzė'}
                className={[
                  'touch-target inline-flex size-11 items-center justify-center rounded-full ring-1 transition',
                  paused
                    ? 'bg-[var(--accent)] text-white ring-[var(--accent)] hover:brightness-110'
                    : 'bg-[var(--surface)] text-[var(--ink)] ring-[var(--ring)] hover:bg-[#fff1f6]',
                  'disabled:cursor-not-allowed disabled:opacity-40',
                ].join(' ')}
              >
                {paused ? <Play size={16} /> : <Pause size={16} />}
              </button>
              <button
                type="button"
                onClick={() => startFresh(difficulty)}
                className="touch-target inline-flex size-11 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--ink)] ring-1 ring-[var(--ring)] transition hover:bg-[#fff1f6]"
                aria-label="Naujas"
                title="Naujas"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
          <div className="mt-3 flex w-full items-center justify-between gap-3 sm:mt-5 sm:gap-4">
            <Timer seconds={elapsedSeconds} />
            <Hearts lives={lives} maxLives={MAX_LIVES} lost={lost} />
          </div>
        </header>

        <div className="mb-3 flex flex-wrap items-center gap-2 animate-fade sm:mb-5">
          {DIFFICULTY_ORDER.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => startFresh(level)}
              className={[
                'touch-target rounded-full px-3.5 py-2 font-ui text-sm font-medium transition',
                difficulty === level
                  ? 'bg-[var(--ink)] text-[var(--paper)]'
                  : 'bg-[var(--surface)] text-[var(--ink)] ring-1 ring-[var(--ring)] hover:bg-[#fff1f6]',
              ].join(' ')}
            >
              {DIFFICULTY_LABEL[level]}
            </button>
          ))}
        </div>

        <main className="relative flex flex-1 flex-col items-center gap-3 sm:gap-5">
          <div
            className={[
              'flex w-full flex-col items-center gap-3 transition-[filter,opacity] duration-300 sm:gap-5',
              paused ? 'pointer-events-none select-none opacity-55 blur-[18px] sm:blur-[24px]' : '',
            ].join(' ')}
            aria-hidden={paused}
          >
            {difficulty === 'beginner' ? (
              <TeachingTipCard
                tip={teachingTip}
                onFocus={() => {
                  if (!teachingTip) return
                  setSelected({ row: teachingTip.row, col: teachingTip.col })
                  setHighlightDigit(teachingTip.digit)
                  setNotesMode(false)
                }}
              />
            ) : null}

            <BoardView
              board={game.board}
              given={game.given}
              notes={game.notes}
              selected={selected}
              highlightDigit={highlightDigit}
              conflicts={conflicts}
              onSelect={(row, col) => {
                if (paused) return
                setSelected({ row, col })
                const value = game.board[row][col]
                setHighlightDigit(value)
              }}
            />

            <div
              className="controls-panel flex w-full flex-col gap-2.5 sm:gap-3"
              onClick={(event) => event.stopPropagation()}
            >
              <Controls
                notesMode={notesMode}
                onNotesModeChange={setNotesMode}
                onDigit={applyDigit}
                onErase={erase}
                activeDigit={highlightDigit}
                disabled={inputLocked}
              />

              <div className="flex w-full flex-wrap gap-2 animate-rise-delay-2">
                <button
                  type="button"
                  onClick={checkProgress}
                  disabled={inputLocked}
                  className="touch-target inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--surface)] px-4 py-3 font-ui text-sm font-semibold text-[var(--ink)] ring-1 ring-[var(--ring)] transition hover:bg-[#fff1f6] disabled:opacity-40"
                >
                  <CheckCircle2 size={16} />
                  Tikrinti atsakymus
                </button>
                <button
                  type="button"
                  onClick={revealHint}
                  disabled={inputLocked}
                  className="touch-target inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--surface)] px-4 py-3 font-ui text-sm font-semibold text-[var(--ink)] ring-1 ring-[var(--ring)] transition hover:bg-[#fff1f6] disabled:opacity-40"
                >
                  <Lightbulb size={16} />
                  Užuomina
                </button>
              </div>
            </div>
          </div>

          {paused ? (
            <div
              className="pause-overlay"
              role="dialog"
              aria-modal="true"
              aria-label="Pauzė"
              onClick={(event) => event.stopPropagation()}
            >
              <p className="pause-overlay__title font-display">Pauzė</p>
              <button
                type="button"
                onClick={togglePause}
                className="touch-target inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3 font-ui text-sm font-semibold text-[var(--paper)] transition hover:brightness-110"
              >
                <Play size={16} />
                Tęsti
              </button>
            </div>
          ) : null}

          <div className="mt-4 w-full max-w-md sm:mt-6">
            <Rules />
          </div>
        </main>
      </div>
    </div>
  )
}
