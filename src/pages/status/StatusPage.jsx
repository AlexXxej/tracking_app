import { useState, useEffect, useCallback } from 'react'
import { tagesstatusService } from '../../services/tagesstatus'
import { useAuth } from '../../hooks/useAuth'
import { StatusForm } from '../../components/einstellungen/StatusForm'
import { StatusList } from '../../components/einstellungen/StatusList'

export function StatusPage() {
  const { user } = useAuth()

  const [statusEntries, setStatusEntries] = useState([])
  const [statusLoading, setStatusLoading] = useState(false)

  const loadStatusEntries = useCallback(async () => {
    if (!user?.id) return
    setStatusLoading(true)
    try {
      const entries = await tagesstatusService.getActiveAndFuture(user.id)
      setStatusEntries(entries)
    } catch (err) {
      console.error('Fehler beim Laden der Status-Einträge:', err)
    } finally {
      setStatusLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    loadStatusEntries()
  }, [loadStatusEntries])

  const handleStatusSave = async (data) => {
    await tagesstatusService.create(data)
    await loadStatusEntries()
  }

  const handleStatusDelete = async (entryId) => {
    await tagesstatusService.delete(entryId)
    await loadStatusEntries()
  }

  return (
    <div className="flex flex-col gap-4">
      <StatusList
        entries={statusEntries}
        onDelete={handleStatusDelete}
        loading={statusLoading}
      />

      <StatusForm userId={user?.id} onSave={handleStatusSave} />
    </div>
  )
}
