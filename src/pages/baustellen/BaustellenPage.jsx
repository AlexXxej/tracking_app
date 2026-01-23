import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useSubNavigation } from '../../hooks/useSubNavigation'
import { supabase } from '../../services/supabase'
import { baustellenService } from '../../services/baustellen'
import { BaustellenList, Pagination } from '../../components/baustellen/BaustellenList'
import { BaustellenDetail } from '../../components/baustellen/BaustellenDetail'
import { BaustellenCreateDialog } from '../../components/baustellen/BaustellenCreateDialog'

export function BaustellenPage() {
  const { user } = useAuth()
  const { enableBack, disableBack } = useSubNavigation()

  const [baustellen, setBaustellen] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  // Suche
  const [query, setQuery] = useState('')
  const [filterColumn, setFilterColumn] = useState('oberbegriff')

  // Detail-Ansicht
  const [selectedBaustelle, setSelectedBaustelle] = useState(null)
  const [detailData, setDetailData] = useState(null)
  const [canEdit, setCanEdit] = useState(false)

  // Create-Dialog
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  // Lade User-Berechtigung
  useEffect(() => {
    const loadUserPermission = async () => {
      if (!user?.id) return
      const { data } = await supabase
        .from('users')
        .select('can_edit_all_baustellen')
        .eq('id', user.id)
        .single()
      setCanEdit(data?.can_edit_all_baustellen || false)
    }
    loadUserPermission()
  }, [user?.id])

  const loadBaustellen = useCallback(async (page = 1) => {
    setLoading(true)
    setError(null)

    try {
      let result
      if (query.trim().length >= 2) {
        result = await baustellenService.search(query, filterColumn, page)
      } else {
        result = await baustellenService.getLatest(page)
      }
      setBaustellen(result.data)
      setTotalPages(result.totalPages)
      setCurrentPage(page)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [query, filterColumn])

  useEffect(() => {
    const timeout = setTimeout(() => loadBaustellen(1), 300)
    return () => clearTimeout(timeout)
  }, [query, filterColumn])

  // Back-Button für Detail-Ansicht
  useEffect(() => {
    if (selectedBaustelle) {
      enableBack(() => {
        setSelectedBaustelle(null)
        setDetailData(null)
      })
    } else {
      disableBack()
    }
  }, [selectedBaustelle, enableBack, disableBack])

  const handleSelect = async (baustelle) => {
    setLoading(true)
    try {
      const detail = await baustellenService.getById(baustelle.id)
      setDetailData(detail)
      setSelectedBaustelle(baustelle)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id, updates) => {
    try {
      const updated = await baustellenService.update(id, updates)
      setDetailData(updated)
      setBaustellen(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b))
    } catch (err) {
      throw err
    }
  }

  const handleCreated = (newBaustelle) => {
    setBaustellen(prev => [newBaustelle, ...prev])
    setShowCreateDialog(false)
  }

  const handleArchive = async (id) => {
    await baustellenService.archive(id)
    // Entferne aus Liste und schließe Detail
    setBaustellen(prev => prev.filter(b => b.id !== id))
    setSelectedBaustelle(null)
    setDetailData(null)
  }

  // Detail-Ansicht
  if (selectedBaustelle && detailData) {
    return (
      <div className="flex flex-col gap-4">
        <BaustellenDetail
          baustelle={detailData}
          canEdit={canEdit}
          onUpdate={handleUpdate}
          onArchive={handleArchive}
          onClose={() => {
            setSelectedBaustelle(null)
            setDetailData(null)
          }}
        />
      </div>
    )
  }

  // Listen-Ansicht
  return (
    <div className="flex flex-col gap-4">
      {canEdit && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowCreateDialog(true)}
            className="w-[140px] rounded-lg bg-[var(--color-accent)] py-3 text-white font-medium hover:bg-[var(--color-accent-hover)] transition-colors text-sm"
          >
            + Neue Baustelle
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Suchen..."
          className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-accent)] focus:outline-none"
        />
        <select
          value={filterColumn}
          onChange={(e) => setFilterColumn(e.target.value)}
          className="w-[140px] rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-3 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
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

      <div className="max-h-[60vh] overflow-auto">
        <BaustellenList
          baustellen={baustellen}
          onSelect={handleSelect}
          loading={loading}
        />
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={loadBaustellen}
      />

      <BaustellenCreateDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreated={handleCreated}
      />
    </div>
  )
}
