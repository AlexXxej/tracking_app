import { useState } from 'react'
import { DatePicker } from '../ui/DatePicker'
import { Button } from '../ui/Button'

export function StatusForm({ userId, onSave }) {
  const [status, setStatus] = useState('krank')
  const [modus, setModus] = useState('ganztag')
  const [startDatum, setStartDatum] = useState('')
  const [endDatum, setEndDatum] = useState('')
  const [startUhrzeit, setStartUhrzeit] = useState('08:00')
  const [dauerStunden, setDauerStunden] = useState(8)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    if (!userId || !startDatum) return

    setLoading(true)
    setError(null)

    try {
      let validFrom, validTo

      if (modus === 'ganztag') {
        // Ganzer Tag: Start um 00:00, Ende um 23:59:59 (oder null)
        validFrom = new Date(`${startDatum}T00:00:00`).toISOString()
        validTo = endDatum
          ? new Date(`${endDatum}T23:59:59`).toISOString()
          : null
      } else {
        // Stundenweise: Start = Datum + Uhrzeit, Ende = Start + Dauer
        const startDateTime = new Date(`${startDatum}T${startUhrzeit}:00`)
        validFrom = startDateTime.toISOString()
        const endDateTime = new Date(startDateTime.getTime() + dauerStunden * 60 * 60 * 1000)
        validTo = endDateTime.toISOString()
      }

      await onSave({
        userId,
        status,
        validFrom,
        validTo,
      })

      // Reset form
      setStartDatum('')
      setEndDatum('')
      setStartUhrzeit('08:00')
      setDauerStunden(8)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const canSave = startDatum && (modus === 'ganztag' || (startUhrzeit && dauerStunden > 0))

  return (
    <div className="flex flex-col gap-4">
      {/* Status-Auswahl */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-[var(--color-text-secondary)]">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] px-4 py-3 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
        >
          <option value="krank">Krank</option>
          <option value="privat">Privat</option>
        </select>
      </div>

      {/* Modus-Auswahl */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-[var(--color-text-secondary)]">
          Modus
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setModus('ganztag')}
            className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              modus === 'ganztag'
                ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
                : 'border-[var(--color-border)] bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)]'
            }`}
          >
            Ganzer Tag
          </button>
          <button
            type="button"
            onClick={() => setModus('stunden')}
            className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              modus === 'stunden'
                ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
                : 'border-[var(--color-border)] bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)]'
            }`}
          >
            Stundenweise
          </button>
        </div>
      </div>

      {/* Felder je nach Modus */}
      {modus === 'ganztag' ? (
        <>
          <DatePicker
            label="Start-Datum"
            value={startDatum}
            onChange={setStartDatum}
          />
          <DatePicker
            label="End-Datum (optional, leer = unbegrenzt)"
            value={endDatum}
            onChange={setEndDatum}
            min={startDatum || undefined}
          />
        </>
      ) : (
        <>
          <DatePicker
            label="Datum"
            value={startDatum}
            onChange={setStartDatum}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[var(--color-text-secondary)]">
              Start-Uhrzeit
            </label>
            <input
              type="time"
              value={startUhrzeit}
              onChange={(e) => setStartUhrzeit(e.target.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] px-4 py-3 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none [color-scheme:dark]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[var(--color-text-secondary)]">
              Dauer (Stunden)
            </label>
            <input
              type="number"
              min="0.5"
              max="24"
              step="0.5"
              value={dauerStunden}
              onChange={(e) => setDauerStunden(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] px-4 py-3 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none [color-scheme:dark]"
            />
          </div>
        </>
      )}

      {error && (
        <div className="rounded-lg border border-[var(--color-error)] bg-[var(--color-bg-secondary)] p-3">
          <p className="text-sm text-[var(--color-error)]">{error}</p>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!canSave || loading}
        className="w-full py-3"
      >
        {loading ? 'Speichern...' : 'Status speichern'}
      </Button>
    </div>
  )
}
