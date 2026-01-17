import { useState } from 'react'
import { DatePicker } from '../../components/ui/DatePicker'
import { Toggle } from '../../components/ui/Toggle'
import { Button } from '../../components/ui/Button'
import { webhookService } from '../../services/webhook'

export function EinstellungenPage() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [webhookEnabled, setWebhookEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [responseMessage, setResponseMessage] = useState(null)
  const [error, setError] = useState(null)

  const canTrigger = startDate && endDate && startDate <= endDate

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

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
        Einstellungen
      </h2>

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
          label="Webhook auslösen"
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
    </div>
  )
}