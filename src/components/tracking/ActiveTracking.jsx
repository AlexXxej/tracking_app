import { useState, useEffect } from 'react'

function formatDuration(startTime) {
  const start = new Date(startTime)
  const now = new Date()
  const diff = Math.floor((now - start) / 1000)

  const hours = Math.floor(diff / 3600)
  const minutes = Math.floor((diff % 3600) / 60)

  const pad = (n) => n.toString().padStart(2, '0')
  return `${pad(hours)}:${pad(minutes)}`
}

export function ActiveTracking({ entry, onPause, onEnd, isBreak }) {
  const [duration, setDuration] = useState('00:00')

  useEffect(() => {
    if (!entry?.start_time) return

    const update = () => setDuration(formatDuration(entry.start_time))
    update()

    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [entry?.start_time])

  if (!entry) return null

  const taetigkeitName = isBreak ? 'Pause' : entry.taetigkeit?.name || 'Tätigkeit'

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
          {taetigkeitName}
        </h2>
        {entry.baustelle?.oberbegriff && (
          <p className="mt-1 text-[var(--color-text-secondary)]">
            {entry.baustelle.oberbegriff}
          </p>
        )}
        {entry.baustelle?.bezeichnung && (
          <p className="text-sm text-[var(--color-text-tertiary)]">
            {entry.baustelle.bezeichnung}
          </p>
        )}
        {entry.baustelle?.external_nummer && (
          <p className="text-sm text-[var(--color-text-tertiary)]">
            {entry.baustelle.external_nummer}
          </p>
        )}
      </div>

      <div className="text-center">
        <span className="font-mono text-2xl font-bold text-[var(--color-text-primary)]">
          {duration}
        </span>
      </div>

      <div className="flex gap-4">
        {isBreak ? (
          <button
            onClick={onEnd}
            className="flex-1 rounded-full bg-[var(--color-confirm)] py-4 text-center font-medium text-lg text-black transition-colors hover:bg-[var(--color-confirm-hover)]"
          >
            Pause beenden
          </button>
        ) : (
          <>
            <button
              onClick={onPause}
              className="flex-1 rounded-full bg-[var(--color-cancel)] py-4 text-center font-medium text-lg text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-cancel-hover)]"
            >
              Pause
            </button>
            <button
              onClick={onEnd}
              className="flex-1 rounded-full bg-[var(--color-confirm)] py-4 text-center font-medium text-lg text-black transition-colors hover:bg-[var(--color-confirm-hover)]"
            >
              Beenden
            </button>
          </>
        )}
      </div>
    </div>
  )
}
