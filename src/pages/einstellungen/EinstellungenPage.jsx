import { useState, useEffect, useCallback } from 'react'
import { DatePicker } from '../../components/ui/DatePicker'
import { Button } from '../../components/ui/Button'
import { AlertMessage } from '../../components/ui/AlertMessage'
import { webhookService } from '../../services/webhook'
import { tagesstatusService } from '../../services/tagesstatus'
import { useAuth } from '../../hooks/useAuth'
import { StatusForm } from '../../components/einstellungen/StatusForm'
import { StatusList } from '../../components/einstellungen/StatusList'

export function EinstellungenPage() {
  const { user } = useAuth()

  // Tracking-Export State
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [exportLoading, setExportLoading] = useState(false)
  const [exportMessage, setExportMessage] = useState(null)
  const [exportError, setExportError] = useState(null)

  // Baustellen-Sync State
  const [syncLoading, setSyncLoading] = useState(false)
  const [syncMessage, setSyncMessage] = useState(null)
  const [syncError, setSyncError] = useState(null)

  // Status festlegen State
  const [statusEntries, setStatusEntries] = useState([])
  const [statusLoading, setStatusLoading] = useState(false)

  const canTrigger = startDate && endDate && startDate <= endDate

  // Status-Einträge laden
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

  const handleExport = async () => {
    if (!canTrigger) return

    setExportLoading(true)
    setExportMessage(null)
    setExportError(null)

    try {
      const result = await webhookService.triggerAktion(startDate, endDate)
      setExportMessage(result.message || 'Export erfolgreich')
    } catch (err) {
      setExportError(err.message)
    } finally {
      setExportLoading(false)
    }
  }

  const handleBaustellenSync = async () => {
    setSyncLoading(true)
    setSyncMessage(null)
    setSyncError(null)

    try {
      const result = await webhookService.syncBaustellen()
      setSyncMessage(result.message || 'Synchronisierung erfolgreich')
    } catch (err) {
      setSyncError(err.message)
    } finally {
      setSyncLoading(false)
    }
  }

  const handleStatusSave = async (data) => {
    await tagesstatusService.create(data)
    await loadStatusEntries()
  }

  const handleStatusDelete = async (entryId) => {
    await tagesstatusService.delete(entryId)
    await loadStatusEntries()
  }

  return (
    <div className="flex flex-col">
      {/* Sektion 1: Tracking-Daten exportieren */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
          Tracking-Daten exportieren
        </h3>

        <DatePicker
          label="Startdatum"
          value={startDate}
          onChange={setStartDate}
          max={endDate || undefined}
        />

        <DatePicker
          label="Enddatum"
          value={endDate}
          onChange={setEndDate}
          min={startDate || undefined}
        />

        {startDate && endDate && startDate > endDate && (
          <p className="text-sm text-[var(--color-error)]">
            Startdatum muss vor oder gleich Enddatum sein
          </p>
        )}

        <Button
          onClick={handleExport}
          disabled={!canTrigger || exportLoading}
          className="w-full py-3"
        >
          {exportLoading ? 'Wird exportiert...' : 'Tracking-Daten exportieren'}
        </Button>

        <AlertMessage type="error" message={exportError} />
        <AlertMessage type="success" message={exportMessage} />
      </div>

      {/* Sektion 2: Baustellendaten synchronisieren */}
      <div className="mt-8 flex flex-col gap-4 pt-6 border-t border-[var(--color-border)]">
        <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
          Baustellendaten synchronisieren
        </h3>

        <Button
          onClick={handleBaustellenSync}
          disabled={syncLoading}
          className="w-full py-3"
        >
          {syncLoading ? 'Wird synchronisiert...' : 'Baustellendaten synchronisieren'}
        </Button>

        <AlertMessage type="error" message={syncError} />
        <AlertMessage type="success" message={syncMessage} />
      </div>

      {/* Sektion 3: Status festlegen */}
      <div className="mt-8 flex flex-col gap-4 pt-6 border-t border-[var(--color-border)]">
        <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
          Status festlegen
        </h3>

        <StatusForm userId={user?.id} onSave={handleStatusSave} />

        <StatusList
          entries={statusEntries}
          onDelete={handleStatusDelete}
          loading={statusLoading}
        />
      </div>
    </div>
  )
}
