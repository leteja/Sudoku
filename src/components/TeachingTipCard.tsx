import type { TeachingTip } from '../lib/sudoku'
import { Lightbulb } from 'lucide-react'

type TeachingTipCardProps = {
  tip: TeachingTip | null
  onFocus: () => void
}

export function TeachingTipCard({ tip, onFocus }: TeachingTipCardProps) {
  return (
    <section
      className="w-full max-w-[min(92vw,34rem)] rounded-2xl bg-[var(--surface)] px-4 py-3.5 ring-1 ring-[var(--ring)]"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="flex items-start gap-2.5">
        <Lightbulb
          size={18}
          className="mt-0.5 shrink-0 text-[var(--accent)]"
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <h2 className="font-ui text-sm font-semibold text-[var(--ink)]">
            Mokomės žaisti
          </h2>
          <p className="mt-1.5 font-ui text-sm leading-relaxed text-[var(--muted)]">
            {tip
              ? tip.message
              : 'Pasirink tuščią langelį ir bandyk dėti skaičių taip, kad eilutėje, stulpelyje ir 3×3 kvadrate jis nesikartotų.'}
          </p>
          {tip ? (
            <button
              type="button"
              onClick={onFocus}
              className="touch-target mt-2.5 inline-flex items-center rounded-full bg-[var(--accent)] px-3.5 py-1.5 font-ui text-xs font-semibold text-white transition hover:brightness-110"
            >
              Parodyti langelį
            </button>
          ) : null}
        </div>
      </div>
    </section>
  )
}
