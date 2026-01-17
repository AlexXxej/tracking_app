import { useState, useEffect, useCallback } from 'react'
import { DatePicker } from '../../components/ui/DatePicker'
import { Toggle } from '../../components/ui/Toggle'
import { Button } from '../../components/ui/Button'
import { webhookService } from '../../services/webhook'
import { tagesstatusService } from '../../services/tagesstatus'
import { useAuth } from '../../hooks/useAuth'
import { StatusForm } from '../../components/einstellungen/StatusForm'
import { StatusList } from '../../components/einstellungen/StatusList'

export function EinstellungenPage() {
  const { user } = useAuth()

  // Datenübertragung State
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [webhookEnabled, setWebhookEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [responseMessage, setResponseMessage] = useState(null)
  const [error, setError] = useState(null)

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

  const handleTrigger = async () => {
    if (!canTrigger || !webhookEnabled) return

    setLoading(true)
    setResponseMessage(null)
    setError(null)

    try {
      const result = await webhookService.triggerAktion(startDate, endDate)
      setResponseMessage(result.message || 'Erfolgreich')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
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
    <div className="flex flex-col gap-6">
      {/* Datenübertragung Sektion */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-medium text-[var(--color-text-primary)]">
          Datenübertragung
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
      </div>

      {startDate && endDate && startDate > endDate && (
        <p className="text-sm text-[var(--color-error)]">
          Startdatum muss vor oder gleich Enddatum sein
        </p>
      )}

      <div className="flex flex-col gap-4 pt-4 border-t border-[var(--color-border)]">
        <Toggle
          label="Datenübertragung aktivieren"
          checked={webhookEnabled}
          onChange={setWebhookEnabled}
          disabled={!canTrigger}
        />

        <Button
          onClick={handleTrigger}
          disabled={!canTrigger || !webhookEnabled || loading}
          className="w-full py-3"
        >
          {loading ? 'Wird ausgeführt...' : 'Datenübertragung starten'}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-[var(--color-error)] bg-[var(--color-bg-secondary)] p-4">
          <p className="text-sm text-[var(--color-error)]">{error}</p>
        </div>
      )}

      {responseMessage && (
        <div className="rounded-lg border border-green-500 bg-[var(--color-bg-secondary)] p-4">
          <p className="text-sm text-green-500">{responseMessage}</p>
        </div>
      )}

      {/* Status festlegen Sektion */}
      <div className="flex flex-col gap-4 pt-6 border-t border-[var(--color-border)]">
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
