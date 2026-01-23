import { useState, useEffect, useCallback } from 'react'
import { baustellenService } from '../../services/baustellen'
import { Pagination } from '../baustellen/BaustellenList'

export function BaustellenSearch({ onSelect }) {
  const [query, setQuery] = useState('')
  const [filterColumn, setFilterColumn] = useState('oberbegriff')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const search = useCallback(async (page = 1) => {
    if (query.trim().length < 2) {
      setResults([])
      setTotalPages(0)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, totalPages: pages } = await baustellenService.search(query, filterColumn, page)
      setResults(data)
      setTotalPages(pages)
      setCurrentPage(page)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [query, filterColumn])

  useEffect(() => {
    const timeout = setTimeout(() => search(1), 300)
    return () => clearTimeout(timeout)
  }, [query, filterColumn])

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      search(page)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
        Baustelle wählen
      </h2>

      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Suchen..."
          className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-accent)] focus:outline-none"
          autoFocus
        />
        <select
          value={filterColumn}
          onChange={(e) => setFilterColumn(e.target.value)}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-3 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
        >
          {baustellenService.searchableColumns.map((col) => (
            <option key={col.value} value={col.value}>
              {col.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-sm text-[var(--color-error)]">{error}</p>
      )}

      <div className="flex flex-col gap-2 max-h-[50vh] overflow-auto">
        {loading ? (
          <div className="text-center py-4 text-[var(--color-text-secondary)]">
            Suchen...
          </div>
        ) : results.length === 0 && query.length >= 2 ? (
          <div className="text-center py-4 text-[var(--color-text-secondary)]">
            Keine Ergebnisse
          </div>
        ) : (
          results.map((baustelle) => (
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
          ))
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
      />

      {query.length < 2 && (
        <p className="text-center text-sm text-[var(--color-text-tertiary)]">
          Mindestens 2 Zeichen eingeben
        </p>
      )}
    </div>
  )
}
