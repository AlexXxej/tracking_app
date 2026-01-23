export function SelectList({
  items,
  onSelect,
  loading,
  title,
  emptyMessage = 'Keine Einträge vorhanden',
  loadingMessage = 'Laden...',
  renderItem = (item) => item.name,
}) {
  if (loading) {
    return (
      <div className="text-center text-[var(--color-text-secondary)]">
        {loadingMessage}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center text-[var(--color-text-secondary)]">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {title && (
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
          {title}
        </h2>
      )}
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4 text-left text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-bg-tertiary)]"
          >
            {renderItem(item)}
          </button>
        ))}
      </div>
    </div>
  )
}
