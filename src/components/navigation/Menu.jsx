import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import { MENU_ITEMS, ROUTES } from '../../utils/constants'
import { ConfirmDialog } from '../feedback/ConfirmDialog'

export function Menu({ isOpen, onClose }) {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleNavigate = (path) => {
    onClose()
    navigate(path)
  }

  const handleLogout = async () => {
    await signOut()
    setShowLogoutConfirm(false)
    navigate(ROUTES.START)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay - schließt Menü bei Klick, aber nicht über Header-Bereich */}
      <div 
        className="fixed inset-0 top-14 z-40 bg-black/60" 
        onClick={onClose} 
      />
      
      {/* Zentriertes Menü - 85% Bildschirmbreite, 15% Innenabstand zu Rändern */}
      <nav className="fixed left-[7.5%] right-[7.5%] top-1/2 z-50 -translate-y-1/2 rounded-2xl bg-[var(--color-bg-secondary)] shadow-xl border border-[var(--color-border)] p-[6%]">
        <ul className="flex flex-col gap-4">
          {MENU_ITEMS.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => handleNavigate(item.path)}
                className="w-full rounded-full bg-[var(--color-bg-tertiary)] px-8 py-5 text-left text-[var(--color-text-primary)] text-lg transition-colors hover:bg-[var(--color-border)]"
              >
                {item.label}
              </button>
            </li>
          ))}
          <li className="mt-3">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full rounded-full bg-[var(--color-bg-tertiary)] px-8 py-5 text-left text-[var(--color-text-primary)] text-lg transition-colors hover:bg-[var(--color-border)]"
            >
              Abmelden
            </button>
          </li>
        </ul>
      </nav>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Abmelden"
        confirmText="Bestätigen"
        cancelText="Abbrechen"
      />
    </>
  )
}