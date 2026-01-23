import { Modal } from '../ui/Modal'

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  confirmText = 'Bestätigen',
  cancelText = 'Abbrechen'
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[90vw] max-w-[500px] rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[var(--color-border)]">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] text-center">
            {title}
          </h2>
        </div>

        {/* Footer mit Buttons */}
        <div className="p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-full bg-[var(--color-cancel)] py-3 text-[var(--color-text-primary)] font-medium hover:bg-[var(--color-cancel-hover)] transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-full bg-[var(--color-confirm)] py-3 text-black font-medium hover:bg-[var(--color-confirm-hover)] transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}