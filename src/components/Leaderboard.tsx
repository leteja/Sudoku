import { useEffect, useState } from 'react'
import type { Difficulty } from '../lib/sudoku'
import {
  fetchTopScores,
  isSupabaseConfigured,
  type ScoreRow,
} from '../lib/supabase'
import { formatTime } from './Timer'

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: 'Lengvas',
  medium: 'Vidutinis',
  hard: 'Sunkus',
}

type Filter = Difficulty | 'all'

type LeaderboardProps = {
  refreshKey?: number
  difficulty: Difficulty
}

export function Leaderboard({ refreshKey = 0, difficulty }: LeaderboardProps) {
  const [filter, setFilter] = useState<Filter>(difficulty)
  const [scores, setScores] = useState<ScoreRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let cancelled = false

    void (async () => {
      setLoading(true)
      setError(null)
      try {
        const rows = await fetchTopScores(filter, 10)
        if (!cancelled) setScores(rows)
      } catch {
        if (!cancelled) {
          setScores([])
          setError('Nepavyko įkelti rekordų')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [filter, refreshKey])

  return (
    <section
      className="leaderboard w-full animate-fade"
      aria-labelledby="leaderboard-heading"
      onClick={(event) => event.stopPropagation()}
    >
      <div>
        <h2
          id="leaderboard-heading"
          className="font-display text-xl font-semibold tracking-tight text-[var(--ink)] sm:text-2xl"
        >
          Rekordai
        </h2>
        <p className="mt-0.5 font-ui text-sm text-[var(--muted)]">
          Geriausi vieši laikai
        </p>
      </div>

      {!isSupabaseConfigured ? (
        <p
          className="mt-3 rounded-2xl bg-[var(--surface)] px-3.5 py-3 font-ui text-sm text-[var(--muted)] ring-1 ring-[var(--ring)]"
          role="status"
        >
          Rekordų lentelė nepasiekiama — žaidimas veikia be jos. Nustatykite{' '}
          <code className="text-[var(--ink)]">VITE_SUPABASE_URL</code> ir{' '}
          <code className="text-[var(--ink)]">VITE_SUPABASE_ANON_KEY</code>.
        </p>
      ) : (
        <>
          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                ['all', 'Visi'],
                ['easy', 'Lengvas'],
                ['medium', 'Vidutinis'],
                ['hard', 'Sunkus'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={[
                  'touch-target rounded-full px-3 py-1.5 font-ui text-xs font-medium transition sm:text-sm',
                  filter === value
                    ? 'bg-[var(--ink)] text-[var(--paper)]'
                    : 'bg-[var(--surface)] text-[var(--ink)] ring-1 ring-[var(--ring)] hover:bg-white',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-3 overflow-hidden rounded-2xl bg-[var(--surface)] ring-1 ring-[var(--ring)]">
            {loading ? (
              <p className="px-3.5 py-4 font-ui text-sm text-[var(--muted)]">
                Kraunama…
              </p>
            ) : error ? (
              <p className="px-3.5 py-4 font-ui text-sm text-[var(--danger)]" role="alert">
                {error}
              </p>
            ) : scores.length === 0 ? (
              <p className="px-3.5 py-4 font-ui text-sm text-[var(--muted)]">
                Dar nėra įrašų. Būk pirmas!
              </p>
            ) : (
              <ol className="divide-y divide-[var(--ring)]">
                {scores.map((score, index) => (
                  <li
                    key={score.id}
                    className="flex items-center gap-3 px-3.5 py-2.5 font-ui text-sm"
                  >
                    <span className="w-6 shrink-0 tabular-nums text-[var(--muted)]">
                      {index + 1}.
                    </span>
                    <span className="min-w-0 flex-1 truncate font-medium text-[var(--ink)]">
                      {score.player_name?.trim() || 'Anonimas'}
                    </span>
                    <span className="shrink-0 text-xs text-[var(--muted)] sm:text-sm">
                      {DIFFICULTY_LABEL[score.difficulty]}
                    </span>
                    <span className="shrink-0 tabular-nums font-semibold text-[var(--ink)]">
                      {formatTime(score.time_seconds)}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </>
      )}
    </section>
  )
}
