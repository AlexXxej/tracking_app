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
      
      {/* Zentriertes Menü */}
      <nav className="fixed left-1/2 top-1/2 z-50 w-80 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[var(--color-bg-secondary)] shadow-xl border border-[var(--color-border)] p-6">
        <ul className="flex flex-col gap-3">
          {MENU_ITEMS.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => handleNavigate(item.path)}
                className="w-full rounded-full bg-[var(--color-bg-tertiary)] px-6 py-4 text-left text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-border)]"
              >
                {item.label}
              </button>
            </li>
          ))}
          <li className="mt-2">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full rounded-full bg-[var(--color-bg-tertiary)] px-6 py-4 text-left text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-border)]"
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
        message="Möchtest du dich wirklich abmelden?"
        confirmText="Bestätigen"
        cancelText="Abbrechen"
      />
    </>
  )
}