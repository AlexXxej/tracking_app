import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import { ROUTES } from '../utils/constants'

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-[var(--color-text-secondary)]">Laden...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.START} replace />
  }

  return children
}
