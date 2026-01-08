import { Modal } from '../ui/Modal'

const STATUS_OPTIONS = [
  { value: 'abgeschlossen', label: 'Auftrag abgeschlossen' },
  { value: 'kundendienst_offen', label: 'Kundendienst offen' },
  { value: 'in_bearbeitung', label: 'In Bearbeitung' },
]

export function StatusDialog({ isOpen, onClose, onSelect }) {
  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
          Status wählen
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Wie ist der aktuelle Stand der Baustelle?
        </p>
        <div className="flex flex-col gap-2">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onSelect(option.value)}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4 text-left text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-bg-tertiary)]"
            >
              {option.label}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-2 rounded-full bg-[var(--color-cancel)] py-3 text-center font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-cancel-hover)]"
        >
          Abbrechen
        </button>
      </div>
    </Modal>
  )
}
