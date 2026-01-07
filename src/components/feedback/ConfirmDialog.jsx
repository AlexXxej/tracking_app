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
      <div className="w-[420px] px-12 py-10">
        <div className="rounded-full bg-[var(--color-bg-tertiary)] px-8 py-5 mb-6 flex items-center justify-between">
          <span className="text-[var(--color-text-primary)] text-lg">{title}</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-[var(--color-text-secondary)]"
          >
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>
        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 rounded-full bg-[var(--color-confirm)] px-8 py-4 text-center text-black font-medium text-lg transition-colors hover:bg-[var(--color-confirm-hover)]"
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-full bg-[var(--color-cancel)] px-8 py-4 text-center text-[var(--color-text-primary)] font-medium text-lg transition-colors hover:bg-[var(--color-cancel-hover)]"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </Modal>
  )
}