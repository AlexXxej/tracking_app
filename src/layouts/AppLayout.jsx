import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu } from '../components/navigation/Menu'
import { MenuIcon } from '../components/navigation/MenuIcon'
import { BackButton } from '../components/navigation/BackButton'
import { useSubNavigation } from '../hooks/useSubNavigation'
import { ROUTES, MENU_ITEMS } from '../utils/constants'

function getPageTitle(pathname) {
  if (pathname === ROUTES.MAIN) {
    return 'Zeiterfassung'
  }

  // Finde Menüpunkt der zum Pfad passt
  const menuItem = MENU_ITEMS.find(item => pathname.startsWith(item.path))
  if (menuItem) {
    return menuItem.label
  }

  return 'Zeiterfassung'
}

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { canGoBack } = useSubNavigation()

  const isMainPage = location.pathname === ROUTES.MAIN
  const showBackButton = !isMainPage || canGoBack
  const pageTitle = getPageTitle(location.pathname)

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]" style={{ paddingLeft: 'var(--spacing-horizontal)', paddingRight: 'var(--spacing-horizontal)' }}>
        <div className="w-24">
          {showBackButton && <BackButton />}
        </div>

        <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">
          {pageTitle}
        </h1>

        <div className="flex w-24 items-center justify-end">
          <MenuIcon onClick={() => setMenuOpen(true)} />
        </div>
      </header>

      <main className="flex-1 overflow-auto py-4" style={{ paddingLeft: 'var(--spacing-horizontal)', paddingRight: 'var(--spacing-horizontal)' }}>
        <Outlet />
      </main>

      <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  )
}