import { useState } from 'react'
import { ConfirmDialog } from '../feedback/ConfirmDialog'
import { useToast } from '../../hooks/useToast'

// Feld-Definitionen mit Gruppen
const FIELD_SECTIONS = [
  {
    title: 'Identifikation',
    fields: [
      { key: 'external_nummer', label: 'Externe Nr.', required: true },
      { key: 'oberbegriff', label: 'Oberbegriff', required: true },
      { key: 'bezeichnung', label: 'Bezeichnung' },
    ]
  },
  {
    title: 'Kontakt',
    fields: [
      { key: 'auftraggeber', label: 'Auftraggeber' },
      { key: 'ansprechpartner', label: 'Ansprechpartner' },
      { key: 'zustaendig', label: 'Zuständig' },
    ]
  },
  {
    title: 'Details',
    fields: [
      { key: 'status', label: 'Status' },
      { key: 'datum', label: 'Datum', type: 'date' },
      { key: 'projektbemerkung', label: 'Bemerkung', type: 'textarea' },
    ]
  },
  {
    title: 'Adresse',
    fields: [
      { key: 'plz', label: 'PLZ' },
      { key: 'ort', label: 'Ort' },
    ]
  },
]

export function BaustellenDetail({ baustelle, canEdit, onUpdate, onArchive, onClose }) {
  const [editedFields, setEditedFields] = useState({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false)
  const { showToast } = useToast()

  const hasChanges = Object.keys(editedFields).length > 0

  const isValid = () => {
    const requiredFields = ['external_nummer', 'oberbegriff']
    return requiredFields.every(key => {
      const value = getFieldValue(key)
      return value && value.trim() !== ''
    })
  }

  const getFieldValue = (key) => {
    if (key in editedFields) {
      return editedFields[key]
    }
    return baustelle[key] || ''
  }

  const handleFieldChange = (key, value) => {
    if (!canEdit) return
    setError(null)

    // Wenn der Wert wieder dem Original entspricht, entferne aus editedFields
    if (value === (baustelle[key] || '')) {
      setEditedFields(prev => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    } else {
      setEditedFields(prev => ({ ...prev, [key]: value }))
    }
  }

  const handleSaveAll = async () => {
    if (!hasChanges) return

    setSaving(true)
    setError(null)
    try {
      await onUpdate(baustelle.id, editedFields)
      setEditedFields({})
      showToast('Änderungen gespeichert')
    } catch (err) {
      setError(err.message || 'Fehler beim Speichern')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedFields({})
    setError(null)
  }

  const handleArchive = async () => {
    try {
      await onArchive(baustelle.id)
      setShowArchiveConfirm(false)
      showToast('Baustelle archiviert')
    } catch (err) {
      setError(err.message || 'Fehler beim Archivieren')
      setShowArchiveConfirm(false)
    }
  }

  const renderField = (field) => {
    const value = getFieldValue(field.key)
    const isEdited = field.key in editedFields

    if (field.type === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={(e) => handleFieldChange(field.key, e.target.value)}
          disabled={!canEdit}
          rows={3}
          className={`w-full rounded-lg border bg-[var(--color-bg-primary)] px-4 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none resize-none ${
            isEdited ? 'border-[var(--color-accent)]' : 'border-[var(--color-border)]'
          } ${!canEdit ? 'opacity-70' : ''}`}
        />
      )
    }

    return (
      <input
        type={field.type === 'date' ? 'date' : 'text'}
        value={value}
        onChange={(e) => handleFieldChange(field.key, e.target.value)}
        disabled={!canEdit}
        className={`w-full rounded-lg border bg-[var(--color-bg-primary)] px-4 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none ${
          isEdited ? 'border-[var(--color-accent)]' : 'border-[var(--color-border)]'
        } ${!canEdit ? 'opacity-70' : ''}`}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Card Container */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
          Baustelle Details
        </h2>

        {error && (
          <div className="rounded-lg border border-[var(--color-error)] bg-[var(--color-bg-primary)] p-3 mb-4">
            <p className="text-sm text-[var(--color-error)]">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-6">
          {FIELD_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wide mb-3">
                {section.title}
              </h3>
              <div className="flex flex-col gap-3">
                {section.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm text-[var(--color-text-secondary)] mb-1">
                      {field.label}
                      {field.required && <span className="text-[var(--color-error)] ml-1">*</span>}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Button-Reihe */}
        {canEdit && (
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-[var(--color-border)]">
            <button
              onClick={() => setShowArchiveConfirm(true)}
              className="rounded-lg border border-[var(--color-warning)] px-4 py-2 text-sm font-medium text-[var(--color-warning)] transition-colors hover:bg-[var(--color-warning)] hover:text-black"
            >
              Archivieren
            </button>

            <div className="flex-1" />

            {hasChanges && (
              <>
                <button
                  onClick={handleCancel}
                  className="rounded-lg bg-[var(--color-cancel)] px-6 py-3 text-[var(--color-text-primary)] font-medium hover:bg-[var(--color-cancel-hover)] transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleSaveAll}
                  disabled={saving || !isValid()}
                  className="rounded-lg bg-[var(--color-confirm)] px-8 py-3 text-black font-medium hover:bg-[var(--color-confirm-hover)] disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Speichern...' : 'Speichern'}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Archivieren Bestätigung */}
      <ConfirmDialog
        isOpen={showArchiveConfirm}
        onClose={() => setShowArchiveConfirm(false)}
        onConfirm={handleArchive}
        title="Baustelle archivieren?"
        confirmText="Archivieren"
        cancelText="Abbrechen"
      />
    </div>
  )
}
