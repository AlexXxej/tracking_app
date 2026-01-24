export const ROUTES = {
  START: '/',
  LOGIN: '/login',
  AUTH_CALLBACK: '/auth/callback',
  MAIN: '/main',
  TAGESBERICHT: '/tagesbericht',
  BAUSTELLEN: '/baustellen',
  HISTORIE: '/historie',
  EXPORT: '/export',
  STATUS: '/status',
}

export const MENU_ITEMS = [
  { label: 'Mein Tag', path: ROUTES.TAGESBERICHT },
  { label: 'Stundenzettel', path: ROUTES.HISTORIE },
  { label: 'Baustellen', path: ROUTES.BAUSTELLEN },
  { label: 'Stunden exportieren', path: ROUTES.EXPORT },
  { label: 'Krank-/Urlaubszeiten', path: ROUTES.STATUS },
]

// Ebenen-basierte Navigation: Gibt den Parent-Pfad zurück
export function getParentRoute(pathname) {
  // Main hat keinen Parent
  if (pathname === ROUTES.MAIN) {
    return null
  }
  
  // Erste Ebene der Menüpunkte → zurück zu Main
  const menuPaths = MENU_ITEMS.map(item => item.path)
  if (menuPaths.includes(pathname)) {
    return ROUTES.MAIN
  }
  
  // Tiefere Ebenen → eine Ebene hoch
  // z.B. /tagesbericht/detail/123 → /tagesbericht/detail → /tagesbericht → /main
  const segments = pathname.split('/').filter(Boolean)
  
  if (segments.length <= 1) {
    return ROUTES.MAIN
  }
  
  // Entferne letztes Segment
  segments.pop()
  const parentPath = '/' + segments.join('/')
  
  // Wenn Parent ein Menüpunkt ist, gib diesen zurück
  if (menuPaths.includes(parentPath)) {
    return parentPath
  }
  
  // Sonst rekursiv weiter nach oben
  return parentPath || ROUTES.MAIN
}