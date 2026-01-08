import { baustellenService } from '../../services/baustellen'

export function BaustellenList({ baustellen, onSelect, loading }) {
  if (loading) {
    return (
      <div className="text-center py-4 text-[var(--color-text-secondary)]">
        Laden...
      </div>
    )
  }

  if (baustellen.length === 0) {
    return (
      <div className="text-center py-4 text-[var(--color-text-secondary)]">
        Keine Baustellen gefunden
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {baustellen.map((baustelle) => (
        <button
          key={baustelle.id}
          onClick={() => onSelect(baustelle)}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4 text-left transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-bg-tertiary)]"
        >
          <div className="font-medium text-[var(--color-text-primary)]">
            {baustelle.oberbegriff}
            {baustelle.status && (
              <span className="ml-2 text-[var(--color-text-secondary)]">
                ({baustelle.status})
              </span>
            )}
          </div>
          <div className="text-sm text-[var(--color-text-secondary)]">
            {baustelle.bezeichnung}
          </div>
          {baustelle.auftraggeber && (
            <div className="text-sm text-[var(--color-text-tertiary)]">
              {baustelle.auftraggeber}
            </div>
          )}
        </button>
      ))}
    </div>
  )
}

export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded border border-[var(--color-border)] text-[var(--color-text-secondary)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--color-bg-tertiary)]"
      >
        &lt;
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded border ${
            page === currentPage
              ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-black'
              : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]'
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded border border-[var(--color-border)] text-[var(--color-text-secondary)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--color-bg-tertiary)]"
      >
        &gt;
      </button>
    </div>
  )
}
