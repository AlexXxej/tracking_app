import { useState, useEffect, useCallback } from 'react'
import { baustellenService } from '../../services/baustellen'

export function BaustellenSearch({ onSelect }) {
  const [query, setQuery] = useState('')
  const [filterColumn, setFilterColumn] = useState('adresse')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const search = useCallback(async () => {
    if (query.trim().length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await baustellenService.search(query, filterColumn)
      setResults(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [query, filterColumn])

  useEffect(() => {
    const timeout = setTimeout(search, 300)
    return () => clearTimeout(timeout)
  }, [search])

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
                {baustelle.bezeichnung}
              </div>
              <div className="text-sm text-[var(--color-text-secondary)]">
                {baustellenService.formatAddress(baustelle)}
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

      {query.length < 2 && (
        <p className="text-center text-sm text-[var(--color-text-tertiary)]">
          Mindestens 2 Zeichen eingeben
        </p>
      )}
    </div>
  )
}
