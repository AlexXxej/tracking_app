import { useToast } from '../../hooks/useToast'

export function ToastContainer() {
  const { toasts } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[70] flex flex-col gap-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
            toast.type === 'success'
              ? 'bg-[var(--color-success)] text-black'
              : toast.type === 'error'
              ? 'bg-[var(--color-error)] text-white'
              : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}
