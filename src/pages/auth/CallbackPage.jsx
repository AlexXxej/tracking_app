import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../services/supabase'
import { ROUTES } from '../../utils/constants'

export function CallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { error } = await supabase.auth.exchangeCodeForSession(
          window.location.href
        )
        
        if (error) {
          setError(error.message)
          return
        }

        navigate(ROUTES.MAIN, { replace: true })
      } catch (err) {
        setError('Authentifizierung fehlgeschlagen')
      }
    }

    handleCallback()
  }, [navigate])

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-xl font-bold text-[var(--color-error)]">
          Fehler
        </h1>
        <p className="text-[var(--color-text-secondary)]">{error}</p>
        <button
          onClick={() => navigate(ROUTES.START)}
          className="text-[var(--color-accent)] hover:underline"
        >
          Zurück zum Start
        </button>
      </div>
    )
  }

  return (
    <div className="text-[var(--color-text-secondary)]">
      Authentifizierung läuft...
    </div>
  )
}
