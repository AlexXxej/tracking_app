export function TaetigkeitSelect({ taetigkeitstypen, onSelect, loading }) {
  if (loading) {
    return (
      <div className="text-center text-[var(--color-text-secondary)]">
        Laden...
      </div>
    )
  }

  if (taetigkeitstypen.length === 0) {
    return (
      <div className="text-center text-[var(--color-text-secondary)]">
        Keine Tätigkeitstypen vorhanden
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
        Tätigkeit wählen
      </h2>
      <div className="flex flex-col gap-2">
        {taetigkeitstypen.map((typ) => (
          <button
            key={typ.id}
            onClick={() => onSelect(typ)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4 text-left text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-bg-tertiary)]"
          >
            {typ.name}
          </button>
        ))}
      </div>
    </div>
  )
}
