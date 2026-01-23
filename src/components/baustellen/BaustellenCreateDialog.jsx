import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { baustellenService } from '../../services/baustellen'
import { useToast } from '../../hooks/useToast'

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

const INITIAL_FORM_DATA = {
  external_nummer: '',
  oberbegriff: '',
  bezeichnung: '',
  auftraggeber: '',
  ansprechpartner: '',
  zustaendig: '',
  status: '',
  projektbemerkung: '',
  datum: '',
  plz: '',
  ort: '',
}

export function BaustellenCreateDialog({ isOpen, onClose, onCreated }) {
  const [step, setStep] = useState('form') // 'form' | 'confirm'
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const { showToast } = useToast()

  const isValid = () => {
    return formData.external_nummer.trim() !== '' && formData.oberbegriff.trim() !== ''
  }

  const handleFieldChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleNext = () => {
    setStep('confirm')
  }

  const handleBack = () => {
    setStep('form')
    setError(null)
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      // Entferne leere Strings
      const dataToSave = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v !== '')
      )
      const created = await baustellenService.create(dataToSave)
      showToast('Baustelle erstellt')
      onCreated(created)
      handleClose()
    } catch (err) {
      setError(err.message || 'Fehler beim Erstellen')
      setStep('form')
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    setFormData(INITIAL_FORM_DATA)
    setStep('form')
    setError(null)
    onClose()
  }

  const renderField = (field) => {
    const value = formData[field.key]

    if (field.type === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={(e) => handleFieldChange(field.key, e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none resize-none"
        />
      )
    }

    return (
      <input
        type={field.type === 'date' ? 'date' : 'text'}
        value={value}
        onChange={(e) => handleFieldChange(field.key, e.target.value)}
        className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
      />
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="w-[90vw] max-w-[500px] max-h-[85vh] rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[var(--color-border)]">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            {step === 'form' ? 'Neue Baustelle' : 'Eingaben prüfen'}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto flex-1">
          {error && (
            <div className="rounded-lg border border-[var(--color-error)] bg-[var(--color-bg-primary)] p-3 mb-4">
              <p className="text-sm text-[var(--color-error)]">{error}</p>
            </div>
          )}

          {step === 'form' ? (
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
          ) : (
            <div className="flex flex-col gap-4">
              {FIELD_SECTIONS.map((section) => (
                <div key={section.title}>
                  <h3 className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wide mb-2">
                    {section.title}
                  </h3>
                  <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-3">
                    {section.fields.map((field) => (
                      <div key={field.key} className="flex justify-between py-1">
                        <span className="text-sm text-[var(--color-text-secondary)]">{field.label}</span>
                        <span className="text-sm text-[var(--color-text-primary)] font-medium">
                          {formData[field.key] || '-'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--color-border)] flex gap-3">
          {step === 'form' ? (
            <>
              <button
                onClick={handleClose}
                className="flex-1 rounded-full bg-[var(--color-cancel)] py-3 text-[var(--color-text-primary)] font-medium hover:bg-[var(--color-cancel-hover)] transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleNext}
                disabled={!isValid()}
                className="flex-1 rounded-full bg-[var(--color-accent)] py-3 text-white font-medium hover:bg-[var(--color-accent-hover)] disabled:opacity-50 transition-colors"
              >
                Weiter
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleBack}
                className="flex-1 rounded-full bg-[var(--color-cancel)] py-3 text-[var(--color-text-primary)] font-medium hover:bg-[var(--color-cancel-hover)] transition-colors"
              >
                Zurück
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-full bg-[var(--color-confirm)] py-3 text-black font-medium hover:bg-[var(--color-confirm-hover)] disabled:opacity-50 transition-colors"
              >
                {saving ? 'Erstellen...' : 'Baustelle erstellen'}
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}
