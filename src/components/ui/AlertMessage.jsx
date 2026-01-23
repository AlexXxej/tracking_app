export function AlertMessage({ type = 'error', message }) {
  if (!message) return null

  const styles = {
    error: {
      border: 'border-[var(--color-error)]',
      text: 'text-[var(--color-error)]',
    },
    success: {
      border: 'border-green-500',
      text: 'text-green-500',
    },
  }

  const style = styles[type] || styles.error

  return (
    <div className={`rounded-lg border ${style.border} bg-[var(--color-bg-secondary)] p-4`}>
      <p className={`text-sm ${style.text}`}>{message}</p>
    </div>
  )
}
