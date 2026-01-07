export function NotificationsPanel({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <>
      {/* Overlay - Klick außerhalb schließt */}
      <div 
        className="fixed inset-0 top-14 z-40 bg-black/60 transition-opacity duration-300"
        onClick={onClose} 
      />
      
      {/* Zentriertes Panel - gleiche Größe wie Menü */}
      <div 
        className="fixed left-[7.5%] right-[7.5%] top-1/2 z-50 -translate-y-1/2 rounded-2xl bg-[var(--color-bg-tertiary)] shadow-xl border border-[var(--color-border)] transition-opacity duration-300"
        style={{ padding: '6%', minHeight: '200px' }}
      >
        {/* Inhalt leer - wird später befüllt */}
        <p className="text-[var(--color-text-secondary)] text-center">
          Keine neuen Benachrichtigungen
        </p>
      </div>
    </>
  )
}