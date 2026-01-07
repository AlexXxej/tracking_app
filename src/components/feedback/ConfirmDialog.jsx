import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'

export function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmText = 'Bestätigen',
  cancelText = 'Abbrechen',
  variant = 'primary'
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="mb-2 text-lg font-semibold text-[var(--color-text-primary)]">
        {title}
      </h2>
      <p className="mb-6 text-[var(--color-text-secondary)]">
        {message}
      </p>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          {cancelText}
        </Button>
        <Button variant={variant} onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  )
}
