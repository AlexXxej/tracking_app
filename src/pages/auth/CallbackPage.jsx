import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../services/supabase'
import { ROUTES } from '../../utils/constants'

export function CallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          navigate(ROUTES.MAIN, { replace: true })
        }
        if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          setError('Authentifizierung fehlgeschlagen')
        }
      }
    )

    // Check if already authenticated
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setError(error.message)
        return
      }
      if (session) {
        navigate(ROUTES.MAIN, { replace: true })
      }
    })

    return () => subscription.unsubscribe()
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