import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../services/auth'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { ROUTES } from '../../utils/constants'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await auth.sendMagicLink(email)
      setSent(true)
    } catch (err) {
      setError(err.message || 'Ein Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div>
          <h1 className="mb-2 text-2xl font-bold text-[var(--color-text-primary)]">
            E-Mail gesendet
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Prüfe dein Postfach und klicke auf den Link.
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate(ROUTES.START)}>
          Zurück
        </Button>
      </div>
    )
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="text-center">
        <h1 className="mb-2 text-2xl font-bold text-[var(--color-text-primary)]">
          Anmelden
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Gib deine E-Mail-Adresse ein
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="email"
          placeholder="name@firma.de"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        
        {error && (
          <p className="text-sm text-[var(--color-error)]">{error}</p>
        )}

        <Button type="submit" disabled={loading || !email}>
          {loading ? 'Senden...' : 'Magic Link senden'}
        </Button>
      </form>

      <Button variant="secondary" onClick={() => navigate(ROUTES.START)}>
        Abbrechen
      </Button>
    </div>
  )
}
