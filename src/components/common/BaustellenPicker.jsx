import { useState, useEffect, useCallback, useRef } from 'react'
import { baustellenService } from '../../services/baustellen'

export function BaustellenPicker({ value, onChange, placeholder = 'Keine' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [filterColumn, setFilterColumn] = useState('oberbegriff')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedBaustelle, setSelectedBaustelle] = useState(null)
  const containerRef = useRef(null)

  // Lade Baustelle wenn value (ID) gesetzt ist
  useEffect(() => {
    if (value && !selectedBaustelle) {
      baustellenService.getById(value)
        .then(setSelectedBaustelle)
        .catch(() => {})
    }
    if (!value) setSelectedBaustelle(null)
  }, [value])

  // Debounced Search
  const search = useCallback(async () => {
    setLoading(true)
    try {
      if (query.trim().length >= 2) {
        const { data } = await baustellenService.search(query, filterColumn, 1)
        setResults(data)
      } else {
        const { data } = await baustellenService.getLatest(1)
        setResults(data)
      }
    } finally {
      setLoading(false)
    }
  }, [query, filterColumn])

  useEffect(() => {
    if (!isOpen) return
    const timeout = setTimeout(search, 300)
    return () => clearTimeout(timeout)
  }, [query, filterColumn, isOpen, search])

  // Initial load when opening
  const handleOpen = () => {
    setIsOpen(true)
    setQuery('')
    search()
  }

  const handleSelect = (baustelle) => {
    setSelectedBaustelle(baustelle)
    onChange(baustelle.id)
    setIsOpen(false)
  }

  const handleClear = (e) => {
    e.stopPropagation()
    setSelectedBaustelle(null)
    onChange('')
  }

  // Click-outside
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={handleOpen}
        className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] px-3 py-2 text-left text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
      >
        {selectedBaustelle ? (
          <div className="flex justify-between items-center">
            <span className="truncate pr-2">
              {selectedBaustelle.oberbegriff} - {selectedBaustelle.bezeichnung}
            </span>
            <span
              onClick={handleClear}
              className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] flex-shrink-0 cursor-pointer"
            >
              ×
            </span>
          </div>
        ) : (
          <span className="text-[var(--color-text-tertiary)]">{placeholder}</span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] shadow-lg">
          {/* Suchfeld + Filter */}
          <div className="sticky top-0 bg-[var(--color-bg-secondary)] p-2 border-b border-[var(--color-border)]">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Suchen..."
                className="flex-1 rounded border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] px-2 py-1 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
                autoFocus
              />
              <select
                value={filterColumn}
                onChange={(e) => setFilterColumn(e.target.value)}
                className="rounded border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] px-2 py-1 text-xs text-[var(--color-text-primary)]"
              >
                <option value="oberbegriff">Oberbegriff</option>
                <option value="bezeichnung">Bezeichnung</option>
              </select>
            </div>
          </div>

          {/* Ergebnisse */}
          <div className="py-1">
            {loading ? (
              <div className="px-3 py-2 text-sm text-[var(--color-text-secondary)]">Laden...</div>
            ) : results.length === 0 ? (
              <div className="px-3 py-2 text-sm text-[var(--color-text-secondary)]">
                {query.length >= 2 ? 'Keine Treffer' : 'Min. 2 Zeichen'}
              </div>
            ) : (
              results.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => handleSelect(b)}
                  className="w-full px-3 py-2 text-left hover:bg-[var(--color-bg-tertiary)]"
                >
                  <div className="text-sm font-medium text-[var(--color-text-primary)]">{b.oberbegriff}</div>
                  <div className="text-xs text-[var(--color-text-secondary)] truncate">{b.bezeichnung}</div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
