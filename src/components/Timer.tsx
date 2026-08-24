type TimerProps = {
  seconds: number
}

export function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const seconds = safe % 60
  const mm = String(minutes).padStart(2, '0')
  const ss = String(seconds).padStart(2, '0')
  if (hours > 0) {
    return `${hours}:${mm}:${ss}`
  }
  return `${mm}:${ss}`
}

export function Timer({ seconds }: TimerProps) {
  return (
    <div
      className="timer inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--surface)] px-3.5 py-2 font-ui text-sm font-semibold tabular-nums text-[var(--ink)] ring-1 ring-[var(--ring)] sm:px-4"
      aria-label={`Laikas ${formatTime(seconds)}`}
    >
      Laikas: {formatTime(seconds)}
    </div>
  )
}
