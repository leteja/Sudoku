import { Eraser, Pencil, Hash } from 'lucide-react'
import type { Digit } from '../lib/sudoku'

type ControlsProps = {
  notesMode: boolean
  onNotesModeChange: (enabled: boolean) => void
  onDigit: (digit: Digit) => void
  onErase: () => void
  activeDigit?: Digit | null
  disabled?: boolean
}

const DIGITS: Digit[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export function Controls({
  notesMode,
  onNotesModeChange,
  onDigit,
  onErase,
  activeDigit = null,
  disabled = false,
}: ControlsProps) {
  return (
    <div className="controls-panel flex w-full flex-col gap-2.5 animate-rise-delay sm:gap-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onNotesModeChange(true)}
          className={[
            'mode-btn touch-target flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl px-3 py-3 font-ui text-sm font-semibold transition-all duration-200',
            notesMode
              ? 'bg-[var(--accent)] text-white shadow-[0_10px_24px_-12px_rgba(24,122,117,0.8)]'
              : 'bg-[var(--surface)] text-[var(--ink)] ring-1 ring-[var(--ring)]',
          ].join(' ')}
          aria-pressed={notesMode}
        >
          <Pencil size={16} strokeWidth={2.25} />
          Užrašai
        </button>
        <button
          type="button"
          onClick={() => onNotesModeChange(false)}
          className={[
            'mode-btn touch-target flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl px-3 py-3 font-ui text-sm font-semibold transition-all duration-200',
            !notesMode
              ? 'bg-[var(--ink)] text-[var(--paper)] shadow-[0_10px_24px_-12px_rgba(15,61,62,0.75)]'
              : 'bg-[var(--surface)] text-[var(--ink)] ring-1 ring-[var(--ring)]',
          ].join(' ')}
          aria-pressed={!notesMode}
        >
          <Hash size={16} strokeWidth={2.25} />
          Atsakymas
        </button>
      </div>

      <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-10 sm:gap-2">
        {DIGITS.map((digit) => {
          const active = activeDigit === digit
          return (
            <button
              key={digit}
              type="button"
              disabled={disabled}
              onClick={() => onDigit(digit)}
              aria-pressed={active}
              className={[
                'digit-btn touch-target aspect-square min-h-11 rounded-2xl font-display text-xl font-semibold ring-1 transition hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40',
                active
                  ? 'bg-[var(--ink)] text-[var(--paper)] ring-[var(--ink)]'
                  : 'bg-[var(--surface)] text-[var(--ink)] ring-[var(--ring)] hover:bg-white',
              ].join(' ')}
            >
              {digit}
            </button>
          )
        })}
        <button
          type="button"
          disabled={disabled}
          onClick={onErase}
          className="digit-btn touch-target col-span-1 flex aspect-square min-h-11 items-center justify-center rounded-2xl bg-[var(--surface)] text-[var(--ink)] ring-1 ring-[var(--ring)] transition hover:-translate-y-0.5 hover:bg-white disabled:opacity-40 sm:col-span-1"
          aria-label="Ištrinti"
          title="Ištrinti"
        >
          <Eraser size={18} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  )
}
