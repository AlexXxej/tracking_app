import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { zeiterfassungService } from '../../services/zeiterfassung'
import { taetigkeitstypenService } from '../../services/taetigkeitstypen'
import { combineDateAndTime } from '../../utils/formatters'
import { BaustellenPicker } from '../common/BaustellenPicker'

export function ManualEntryModal({ date, onClose, onSave }) {
  const { user } = useAuth()

  const [taetigkeiten, setTaetigkeiten] = useState([])
  const [loadingData, setLoadingData] = useState(true)

  const [selectedTaetigkeit, setSelectedTaetigkeit] = useState('')
  const [selectedBaustelle, setSelectedBaustelle] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [notiz, setNotiz] = useState('')
  const [personalStatus, setPersonalStatus] = useState('arbeit')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadData() {
      if (!user?.id) return

      try {
        const taetigkeitenData = await taetigkeitstypenService.getByUser(user.id)
        setTaetigkeiten(taetigkeitenData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoadingData(false)
      }
    }

    loadData()
  }, [user?.id])

  const handleSave = async () => {
    if (!selectedTaetigkeit || !startTime || !endTime) {
      setError('Tätigkeit, Start und Ende sind Pflichtfelder')
      return
    }

    setSaving(true)
    setError(null)

    try {
      await zeiterfassungService.createManualEntry({
        userId: user.id,
        taetigkeitId: selectedTaetigkeit,
        baustelleId: selectedBaustelle || null,
        startTime: combineDateAndTime(date, startTime),
        endTime: combineDateAndTime(date, endTime),
        notiz: notiz || null,
        personalStatus,
      })
      onSave()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const dateObj = date instanceof Date ? date : new Date(date)
  const formattedDate = dateObj.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Europe/Berlin'
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-lg bg-[var(--color-bg-secondary)] p-6 max-h-[90vh] overflow-auto">
        <h2 className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">
          Neuer Eintrag
        </h2>

        <div className="mb-4 text-sm text-[var(--color-text-tertiary)]">
          {formattedDate}
        </div>

        {error && (
          <p className="mb-4 text-sm text-[var(--color-error)]">{error}</p>
        )}

        {loadingData ? (
          <div className="text-center py-4 text-[var(--color-text-secondary)]">
            Laden...
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-xs text-[var(--color-text-tertiary)]">
                Tätigkeit *
              </label>
              <select
                value={selectedTaetigkeit}
                onChange={(e) => setSelectedTaetigkeit(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] px-3 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
              >
                <option value="">Bitte wählen...</option>
                {taetigkeiten.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs text-[var(--color-text-tertiary)]">
                Baustelle
              </label>
              <BaustellenPicker
                value={selectedBaustelle}
                onChange={setSelectedBaustelle}
                placeholder="Keine"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-1 block text-xs text-[var(--color-text-tertiary)]">
                  Start *
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] px-3 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-xs text-[var(--color-text-tertiary)]">
                  Ende *
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] px-3 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs text-[var(--color-text-tertiary)]">
                Status
              </label>
              <select
                value={personalStatus}
                onChange={(e) => setPersonalStatus(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] px-3 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
              >
                <option value="arbeit">Arbeit</option>
                <option value="krank">Krank</option>
                <option value="urlaub">Urlaub</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs text-[var(--color-text-tertiary)]">
                Notiz
              </label>
              <textarea
                value={notiz}
                onChange={(e) => setNotiz(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] px-3 py-2 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none"
                placeholder="Optionale Notiz..."
              />
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] py-3 font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-cancel-hover)]"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loadingData}
            className="flex-1 rounded-lg bg-[var(--color-confirm)] py-3 font-medium text-black transition-colors hover:bg-[var(--color-confirm-hover)]"
          >
            {saving ? 'Speichern...' : 'Speichern'}
          </button>
        </div>
      </div>
    </div>
  )
}
