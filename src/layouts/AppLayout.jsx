import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu } from '../components/navigation/Menu'
import { MenuIcon } from '../components/navigation/MenuIcon'
import { NewsIcon } from '../components/navigation/NewsIcon'
import { BackButton } from '../components/navigation/BackButton'
import { NotificationsPanel } from '../components/navigation/NotificationsPanel'
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
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const location = useLocation()
  const { canGoBack } = useSubNavigation()

  const isMainPage = location.pathname === ROUTES.MAIN
  const showBackButton = !isMainPage || canGoBack
  const pageTitle = getPageTitle(location.pathname)

  const handleNotificationsClick = () => {
    if (notificationsOpen) {
      // Toggle: schließen wenn bereits offen
      setNotificationsOpen(false)
    } else {
      // Öffnen und Menü schließen
      setMenuOpen(false)
      setNotificationsOpen(true)
    }
  }

  const handleMenuClick = () => {
    // Notifications schließen und Menü öffnen
    setNotificationsOpen(false)
    setMenuOpen(true)
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-[5%]">
        <div className="w-24">
          {showBackButton && <BackButton />}
        </div>

        <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">
          {pageTitle}
        </h1>

        <div className="flex w-24 items-center justify-end gap-1">
          <NewsIcon hasNews={false} onClick={handleNotificationsClick} />
          <MenuIcon onClick={handleMenuClick} />
        </div>
      </header>

      <main className="flex-1 overflow-auto px-[5%] py-4">
        <Outlet />
      </main>

      <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <NotificationsPanel isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </div>
  )
}