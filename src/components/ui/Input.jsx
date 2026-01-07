export function Input({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  disabled = false,
  className = '' 
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-tertiary)] px-4 py-2 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none disabled:opacity-50 ${className}`}
    />
  )
}
