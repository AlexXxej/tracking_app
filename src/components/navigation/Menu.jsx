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
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <nav className="fixed right-4 top-16 z-50 w-56 rounded-lg bg-[var(--color-bg-secondary)] shadow-xl border border-[var(--color-border)]">
        <ul className="py-2">
          {MENU_ITEMS.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => handleNavigate(item.path)}
                className="w-full px-4 py-3 text-left text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-bg-tertiary)]"
              >
                {item.label}
              </button>
            </li>
          ))}
          <li className="border-t border-[var(--color-border)] mt-2 pt-2">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full px-4 py-3 text-left text-[var(--color-error)] transition-colors hover:bg-[var(--color-bg-tertiary)]"
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
        confirmText="Abmelden"
        variant="danger"
      />
    </>
  )
}
