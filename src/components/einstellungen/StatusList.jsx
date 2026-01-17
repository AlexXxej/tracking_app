import { useState } from 'react'

export function StatusList({ entries, onDelete, loading }) {
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const formatDateTime = (isoString) => {
    if (!isoString) return 'unbegrenzt'
    const date = new Date(isoString)
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDateRange = (entry) => {
    const from = new Date(entry.valid_from)
    const to = entry.valid_to ? new Date(entry.valid_to) : null

    // Prüfen ob es ein ganzer Tag ist (00:00 Start)
    const isGanzTag = from.getHours() === 0 && from.getMinutes() === 0

    if (isGanzTag) {
      const fromStr = from.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      const toStr = to
        ? to.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : 'unbegrenzt'
      return `${fromStr} - ${toStr}`
    } else {
      // Stundenweise
      const fromStr = from.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
      })
      const timeFrom = from.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
      })
      const timeTo = to
        ? to.toLocaleTimeString('de-DE', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : ''
      return `${fromStr} ${timeFrom} - ${timeTo}`
    }
  }

  const handleDelete = async (entryId) => {
    setDeleting(true)
    try {
      await onDelete(entryId)
      setDeleteConfirmId(null)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center text-[var(--color-text-secondary)] py-4">
        Laden...
      </div>
    )
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="text-center text-[var(--color-text-secondary)] py-4">
        Keine aktiven Status vorhanden
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-sm font-medium text-[var(--color-text-secondary)]">
        Aktive & geplante Status
      </h4>
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                    entry.status === 'krank'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {entry.status === 'krank' ? 'Krank' : 'Privat'}
                </span>
              </div>
              <div className="mt-1 text-sm text-[var(--color-text-secondary)]">
                {formatDateRange(entry)}
              </div>
            </div>

            {deleteConfirmId === entry.id ? (
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  disabled={deleting}
                  className="px-3 py-1 rounded text-sm border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] hover:bg-[var(--color-cancel-hover)] transition-colors disabled:opacity-50"
                >
                  Abbrechen
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  disabled={deleting}
                  className="px-3 py-1 rounded text-sm bg-[var(--color-error)] text-white hover:opacity-90 transition-colors disabled:opacity-50"
                >
                  {deleting ? '...' : 'Löschen'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setDeleteConfirmId(entry.id)}
                className="p-2 rounded text-[var(--color-error)] hover:bg-[var(--color-error)]/10 transition-colors"
                title="Löschen"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
