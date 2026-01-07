import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu } from '../components/navigation/Menu'
import { MenuIcon } from '../components/navigation/MenuIcon'
import { NewsIcon } from '../components/navigation/NewsIcon'
import { BackButton } from '../components/navigation/BackButton'
import { ROUTES } from '../utils/constants'

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  
  const isMainPage = location.pathname === ROUTES.MAIN
  const showBackButton = !isMainPage

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4">
        <div className="w-24">
          {showBackButton && <BackButton />}
        </div>
        
        <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">
          Zeiterfassung
        </h1>
        
        <div className="flex w-24 items-center justify-end gap-1">
          <NewsIcon hasNews={false} onClick={() => {}} />
          <MenuIcon onClick={() => setMenuOpen(true)} />
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4">
        <Outlet />
      </main>

      <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  )
}
