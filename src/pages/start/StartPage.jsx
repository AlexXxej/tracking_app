import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'
import { ROUTES } from '../../utils/constants'

export function StartPage() {
  const navigate = useNavigate()
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(ROUTES.MAIN, { replace: true })
    }
  }, [isAuthenticated, loading, navigate])

  const handleClick = () => {
    if (!loading && !isAuthenticated) {
      navigate(ROUTES.LOGIN)
    }
  }

  if (loading) {
    return (
      <div className="text-[var(--color-text-secondary)]">Laden...</div>
    )
  }

  return (
    <div 
      className="flex h-full w-full items-center justify-center cursor-pointer"
      onClick={handleClick}
    >
      <h1 className="text-4xl font-bold text-[var(--color-text-primary)]">
        Tracking App
      </h1>
    </div>
  )
}