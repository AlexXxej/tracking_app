export function Toggle({
  label,
  checked,
  onChange,
  disabled = false,
  className = ''
}) {
  return (
    <label className={`flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div className={`w-12 h-6 rounded-full transition-colors ${
          checked
            ? 'bg-[var(--color-accent)]'
            : 'bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]'
        }`}>
          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-0.5'
          }`} />
        </div>
      </div>
      {label && (
        <span className="text-[var(--color-text-primary)]">{label}</span>
      )}
    </label>
  )
}
