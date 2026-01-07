import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import { MENU_ITEMS, ROUTES } from '../../utils/constants'
import { ConfirmDialog } from '../feedback/ConfirmDialog'

export function Menu({ isOpen, onClose }) {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const handleNavigate = (path) => {
    onClose()
    navigate(path)
  }

  const handleLogoutClick = () => {
    setIsClosing(true)
    setShowLogoutConfirm(true)
  }

  const handleLogout = async () => {
    await signOut()
    setShowLogoutConfirm(false)
    setIsClosing(false)
    navigate(ROUTES.START)
  }

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false)
    setIsClosing(false)
  }

  if (!isOpen && !showLogoutConfirm) return null

  return (
    <>
      {/* Overlay - schließt Menü bei Klick, aber nicht über Header-Bereich */}
      <div 
        className={`fixed inset-0 top-14 z-40 bg-black/60 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
        onClick={showLogoutConfirm ? handleCancelLogout : onClose} 
      />
      
      {/* Zentriertes Menü */}
      <nav 
        className={`fixed left-[7.5%] right-[7.5%] top-1/2 z-50 -translate-y-1/2 rounded-2xl bg-[var(--color-bg-secondary)] shadow-xl border border-[var(--color-border)] transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
        style={{ padding: '6%' }}
      >
        <ul className="flex flex-col gap-4">
          {MENU_ITEMS.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => handleNavigate(item.path)}
                className="w-full rounded-full bg-[var(--color-bg-tertiary)] py-5 text-left text-[var(--color-text-primary)] text-lg transition-colors hover:bg-[var(--color-border)]"
                style={{ paddingLeft: '8%', paddingRight: '8%' }}
              >
                {item.label}
              </button>
            </li>
          ))}
          <li className="mt-3">
            <button
              onClick={handleLogoutClick}
              className="w-full rounded-full bg-[var(--color-bg-tertiary)] py-5 text-left text-[var(--color-text-primary)] text-lg transition-colors hover:bg-[var(--color-border)]"
              style={{ paddingLeft: '8%', paddingRight: '8%' }}
            >
              Abmelden
            </button>
          </li>
        </ul>
      </nav>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={handleCancelLogout}
        onConfirm={handleLogout}
        title="Abmelden"
        confirmText="Bestätigen"
        cancelText="Abbrechen"
      />
    </>
  )
}