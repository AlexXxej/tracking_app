import { useAuth } from '../../hooks/useAuth.jsx'

export function MainPage() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
          Willkommen
        </h2>
        <p className="text-[var(--color-text-secondary)]">
          {user?.email}
        </p>
      </div>
    </div>
  )
}
