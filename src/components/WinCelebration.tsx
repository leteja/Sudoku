import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from 'react'
import { formatTime } from './Timer'
import { isSupabaseConfigured, saveScore } from '../lib/supabase'
import type { Difficulty } from '../lib/sudoku'

type WinCelebrationProps = {
  active: boolean
  elapsedSeconds: number
  difficulty: Difficulty
  onSaved?: () => void
  onPlayAgain?: () => void
}

type Particle = {
  id: number
  left: number
  delay: number
  duration: number
  size: number
  color: string
  drift: number
  rotate: number
}

const COLORS = [
  '#ff4d8d',
  '#ff85b3',
  '#ffd6e7',
  '#ffffff',
  '#f9a8d4',
  '#fb7185',
  '#f472b6',
  '#ffe4f1',
]

export function WinCelebration({
  active,
  elapsedSeconds,
  difficulty,
  onSaved,
  onPlayAgain,
}: WinCelebrationProps) {
  const [playerName, setPlayerName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [skipped, setSkipped] = useState(false)

  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 72 }, (_, id) => ({
        id,
        left: Math.random() * 100,
        delay: Math.random() * 2.4,
        duration: 2.6 + Math.random() * 2.8,
        size: 6 + Math.random() * 10,
        color: COLORS[id % COLORS.length],
        drift: -50 + Math.random() * 100,
        rotate: Math.random() * 720,
      })),
    [],
  )

  useEffect(() => {
    if (!active) {
      setPlayerName('')
      setSaving(false)
      setSaved(false)
      setSaveError(null)
      setSkipped(false)
    }
  }, [active])

  if (!active) return null

  const showSaveForm = isSupabaseConfigured && !saved && !skipped

  const handleSave = async (event: FormEvent) => {
    event.preventDefault()
    if (saving || saved) return
    setSaving(true)
    setSaveError(null)
    try {
      await saveScore({
        playerName,
        difficulty,
        timeSeconds: Math.max(1, elapsedSeconds),
      })
      setSaved(true)
      onSaved?.()
    } catch {
      setSaveError('Nepavyko išsaugoti. Bandykite dar kartą.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="win-celebration" aria-live="assertive">
      <div className="win-celebration__glitter" aria-hidden>
        {particles.map((p) => (
          <span
            key={p.id}
            className="glitter-piece"
            style={
              {
                left: `${p.left}%`,
                width: `${p.size}px`,
                height: `${p.size * 0.55}px`,
                background: p.color,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                '--drift': `${p.drift}px`,
                '--spin': `${p.rotate}deg`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="win-celebration__copy" onClick={(event) => event.stopPropagation()}>
        <p className="win-celebration__text font-display">Sveikinu</p>
        <p className="win-celebration__time font-ui">
          Visas laikas: {formatTime(elapsedSeconds)}
        </p>

        {showSaveForm ? (
          <form className="win-save mt-4 w-full max-w-xs" onSubmit={(e) => void handleSave(e)}>
            <label className="block font-ui text-sm text-white/90" htmlFor="player-name">
              Įrašyti į rekordus (nebūtina)
            </label>
            <input
              id="player-name"
              type="text"
              maxLength={32}
              autoComplete="nickname"
              placeholder="Vardas (nebūtina)"
              value={playerName}
              onChange={(event) => setPlayerName(event.target.value)}
              className="mt-2 w-full rounded-xl border-0 bg-white/95 px-3 py-2.5 font-ui text-base text-[var(--ink)] outline-none ring-2 ring-white/40 placeholder:text-[var(--muted)]"
            />
            {saveError ? (
              <p className="mt-2 font-ui text-sm text-pink-100" role="alert">
                {saveError}
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <button
                type="submit"
                disabled={saving}
                className="touch-target rounded-full bg-white px-4 py-2.5 font-ui text-sm font-semibold text-[var(--ink)] transition hover:brightness-95 disabled:opacity-60"
              >
                {saving ? 'Saugoma…' : 'Išsaugoti laiką'}
              </button>
              <button
                type="button"
                onClick={() => setSkipped(true)}
                className="touch-target rounded-full bg-white/15 px-4 py-2.5 font-ui text-sm font-medium text-white ring-1 ring-white/35 transition hover:bg-[#fff1f6]/25"
              >
                Praleisti
              </button>
            </div>
          </form>
        ) : null}

        {saved ? (
          <p className="mt-3 font-ui text-sm text-white/95" role="status">
            Laikas įrašytas į rekordus!
          </p>
        ) : null}

        {!isSupabaseConfigured ? (
          <p className="mt-3 max-w-xs font-ui text-sm text-white/80" role="status">
            Rekordai nepasiekiami — žaidimas veikia be jų.
          </p>
        ) : null}

        {onPlayAgain ? (
          <button
            type="button"
            onClick={onPlayAgain}
            className="touch-target mt-4 rounded-full bg-[var(--ink)] px-5 py-2.5 font-ui text-sm font-semibold text-[var(--paper)] transition hover:brightness-110"
          >
            Žaisti dar kartą
          </button>
        ) : null}
      </div>
    </div>
  )
}
