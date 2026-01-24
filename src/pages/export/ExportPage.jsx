import { useState } from 'react'
import { DatePicker } from '../../components/ui/DatePicker'
import { Button } from '../../components/ui/Button'
import { AlertMessage } from '../../components/ui/AlertMessage'
import { webhookService } from '../../services/webhook'

export function ExportPage() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [exportLoading, setExportLoading] = useState(false)
  const [exportMessage, setExportMessage] = useState(null)
  const [exportError, setExportError] = useState(null)

  const canTrigger = startDate && endDate && startDate <= endDate

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

  return (
    <div className="flex flex-col gap-4">
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
  )
}
