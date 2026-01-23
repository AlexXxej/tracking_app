import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { zeiterfassungService } from '../../services/zeiterfassung'
import { historieService } from '../../services/historie'
import { taetigkeitstypenService } from '../../services/taetigkeitstypen'
import { baustellenService } from '../../services/baustellen'

function formatTimeForInput(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

function combineDateAndTime(dateIso, timeString) {
  if (!timeString) return null
  const date = new Date(dateIso)
  const [hours, minutes] = timeString.split(':').map(Number)
  date.setHours(hours, minutes, 0, 0)
  return date.toISOString()
}

export function EntryEditModal({ entry, onClose, onSave, onDelete }) {
  const { user } = useAuth()

  const [startTime, setStartTime] = useState(formatTimeForInput(entry.start_time))
  const [endTime, setEndTime] = useState(formatTimeForInput(entry.end_time))
  const [notiz, setNotiz] = useState(entry.notiz || '')
  const [saving, setSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [error, setError] = useState(null)

  // Neue Felder
  const [taetigkeiten, setTaetigkeiten] = useState([])
  const [baustellen, setBaustellen] = useState([])
  const [selectedTaetigkeit, setSelectedTaetigkeit] = useState(entry.taetigkeit?.id || '')
  const [selectedBaustelle, setSelectedBaustelle] = useState(entry.baustelle?.id || '')
  const [personalStatus, setPersonalStatus] = useState(entry.personal_status || 'arbeit')
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    async function loadData() {
      if (!user?.id) return

      try {
        const [taetigkeitenData, baustellenData] = await Promise.all([
          taetigkeitstypenService.getByUser(user.id),
          baustellenService.getLatest(1)
        ])
        setTaetigkeiten(taetigkeitenData)
        setBaustellen(baustellenData.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoadingData(false)
      }
    }

    loadData()
  }, [user?.id])

  const isBreak = entry.is_break
  const taetigkeitName = isBreak ? 'Pause' : entry.taetigkeit?.name || 'Tätigkeit'

  const handleSave = async () => {
    setSaving(true)
    setError(null)

    try {
      const updates = {
        start_time: combineDateAndTime(entry.start_time, startTime),
        notiz: notiz || null,
        taetigkeit_id: selectedTaetigkeit || null,
        baustelle_id: selectedBaustelle || null,
        personal_status: personalStatus,
      }

      if (endTime) {
        updates.end_time = combineDateAndTime(entry.start_time, endTime)
      }

      await zeiterfassungService.updateEntry(entry.id, updates)
      onSave()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setSaving(true)
    setError(null)

    try {
      await zeiterfassungService.softDeleteEntry(entry.id)
      onDelete()
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-lg bg-[var(--color-bg-secondary)] p-6 max-h-[90vh] overflow-auto">
        <h2 className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">
          {taetigkeitName} bearbeiten
        </h2>

        {entry.baustelle && (
          <div className="mb-4 text-sm text-[var(--color-text-secondary)]">
            {entry.baustelle.oberbegriff} - {entry.baustelle.bezeichnung}
          </div>
        )}

        <div className="mb-4 text-sm text-[var(--color-text-tertiary)]">
          {historieService.getWeekday(entry.start_time)} {historieService.formatDate(entry.start_time)}
        </div>

        {error && (
          <p className="mb-4 text-sm text-[var(--color-error)]">{error}</p>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="mb-1 block text-xs text-[var(--color-text-tertiary)]">
                Start
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
                Ende
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] px-3 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
              />
            </div>
          </div>

          {!isBreak && !loadingData && (
            <>
              <div>
                <label className="mb-1 block text-xs text-[var(--color-text-tertiary)]">
                  Tätigkeit
                </label>
                <select
                  value={selectedTaetigkeit}
                  onChange={(e) => setSelectedTaetigkeit(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] px-3 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
                >
                  <option value="">Keine</option>
                  {taetigkeiten.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs text-[var(--color-text-tertiary)]">
                  Baustelle
                </label>
                <select
                  value={selectedBaustelle}
                  onChange={(e) => setSelectedBaustelle(e.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] px-3 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
                >
                  <option value="">Keine</option>
                  {baustellen.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.oberbegriff} - {b.bezeichnung}
                    </option>
                  ))}
                </select>
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
            </>
          )}

          {!isBreak && (
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
          )}
        </div>

        {showDeleteConfirm ? (
          <div className="mt-6">
            <p className="mb-4 text-center text-sm text-[var(--color-text-secondary)]">
              Eintrag wirklich löschen?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={saving}
                className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] py-3 font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-cancel-hover)]"
              >
                Abbrechen
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className="flex-1 rounded-lg bg-[var(--color-error)] py-3 font-medium text-white transition-colors hover:opacity-90"
              >
                {saving ? 'Löschen...' : 'Löschen'}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
            <div className="flex gap-3">
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
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={saving}
              className="w-full rounded-lg border border-[var(--color-error)] py-3 font-medium text-[var(--color-error)] transition-colors hover:bg-[var(--color-error)] hover:text-white"
            >
              Eintrag löschen
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
