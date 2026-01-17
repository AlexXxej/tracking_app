export function SubTaetigkeitSelect({ subTaetigkeiten, onSelect, loading }) {
  if (loading) {
    return (
      <div className="text-center text-[var(--color-text-secondary)]">
        Laden...
      </div>
    )
  }

  if (subTaetigkeiten.length === 0) {
    return (
      <div className="text-center text-[var(--color-text-secondary)]">
        Keine Subtätigkeiten vorhanden
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
        Subtätigkeit wählen
      </h2>
      <div className="flex flex-col gap-2">
        {subTaetigkeiten.map((sub) => (
          <button
            key={sub.id}
            onClick={() => onSelect(sub)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4 text-left text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-bg-tertiary)]"
          >
            {sub.name}
          </button>
        ))}
      </div>
    </div>
  )
}
