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
      <div 
        className="w-[90vw] max-w-[600px] rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]"
        style={{ padding: '20%' }}
      >
        {/* Titel oben */}
        <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] text-center mb-8">
          {title}
        </h2>
        
        {/* Buttons nebeneinander */}
        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 rounded-full bg-[var(--color-confirm)] py-4 text-center text-black font-medium text-lg transition-colors hover:bg-[var(--color-confirm-hover)]"
            style={{ paddingLeft: '8%', paddingRight: '8%' }}
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-full bg-[var(--color-cancel)] py-4 text-center text-[var(--color-text-primary)] font-medium text-lg transition-colors hover:bg-[var(--color-cancel-hover)]"
            style={{ paddingLeft: '8%', paddingRight: '8%' }}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </Modal>
  )
}