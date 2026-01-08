import { useState } from 'react'
import { baustellenService } from '../../services/baustellen'

export function BaustellenDetail({ baustelle, canEdit, onUpdate, onClose }) {
  const [editingField, setEditingField] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [saving, setSaving] = useState(false)

  const handleFieldClick = (field) => {
    if (!canEdit) return
    setEditingField(field.key)
    setEditValue(baustelle[field.key] || '')
  }

  const handleSave = async () => {
    if (!editingField) return

    setSaving(true)
    try {
      await onUpdate(baustelle.id, { [editingField]: editValue })
      setEditingField(null)
    } catch (err) {
      console.error('Fehler beim Speichern:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditingField(null)
    setEditValue('')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
          Baustelle Details
        </h2>
      </div>

      <div className="flex flex-col gap-2 max-h-[60vh] overflow-auto">
        {baustellenService.displayFields.map((field) => (
          <div
            key={field.key}
            onClick={() => handleFieldClick(field)}
            className={`rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-3 ${
              canEdit ? 'cursor-pointer hover:border-[var(--color-accent)]' : ''
            }`}
          >
            <div className="text-xs text-[var(--color-text-tertiary)] mb-1">
              {field.label}
            </div>
            {editingField === field.key ? (
              <div className="flex flex-col gap-2">
                <input
                  type={field.key === 'datum' ? 'date' : 'text'}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-2 py-1 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 rounded bg-[var(--color-confirm)] py-1 text-black text-sm font-medium disabled:opacity-50"
                  >
                    {saving ? 'Speichern...' : 'Speichern'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 rounded bg-[var(--color-cancel)] py-1 text-[var(--color-text-primary)] text-sm font-medium"
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-[var(--color-text-primary)]">
                {baustelle[field.key] || '-'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
