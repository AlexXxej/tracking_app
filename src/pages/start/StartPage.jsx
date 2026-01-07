import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'
import { Button } from '../../components/ui/Button'
import { ROUTES } from '../../utils/constants'

export function StartPage() {
  const navigate = useNavigate()
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(ROUTES.MAIN, { replace: true })
    }
  }, [isAuthenticated, loading, navigate])

  if (loading) {
    return (
      <div className="text-[var(--color-text-secondary)]">Laden...</div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-[var(--color-text-primary)]">
          Zeiterfassung
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Arbeitszeiten einfach erfassen
        </p>
      </div>
      
      <Button onClick={() => navigate(ROUTES.LOGIN)}>
        Anmelden
      </Button>
    </div>
  )
}
