import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { tagesberichtService } from '../../services/tagesbericht'

const STATUS_ICONS = {
  arbeit: '🟢',
  krank: '🔴',
  privat: '🟡',
}

const STATUS_LABELS = {
  arbeit: 'Arbeit',
  krank: 'Krank',
  privat: 'Privat',
}

function DayHeader({ datum, arbeitMinuten, pauseMinuten, baustellenAnzahl, personalStatus }) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4">
      <div className="text-lg font-medium text-[var(--color-text-primary)] mb-3">
        {tagesberichtService.formatDatumLang(datum)}
      </div>

      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-[var(--color-text-secondary)]">Arbeitszeit:</span>
          <span className="text-[var(--color-text-primary)] font-medium">
            {tagesberichtService.formatMinutes(arbeitMinuten)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--color-text-secondary)]">Pausenzeit:</span>
          <span className="text-[var(--color-text-primary)]">
            {tagesberichtService.formatMinutes(pauseMinuten)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--color-text-secondary)]">Baustellen:</span>
          <span className="text-[var(--color-text-primary)]">{baustellenAnzahl}</span>
        </div>
        {personalStatus && (
          <div className="flex justify-between">
            <span className="text-[var(--color-text-secondary)]">Status:</span>
            <span className="text-[var(--color-text-primary)]">
              {STATUS_ICONS[personalStatus] || ''} {STATUS_LABELS[personalStatus] || personalStatus}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function TimelineEntry({ entry }) {
  const isBreak = entry.arbeit_pause === 'Pause'

  return (
    <div
      className={`rounded-lg border p-3 ${
        isBreak
          ? 'border-[var(--color-border)] bg-[var(--color-bg-tertiary)]'
          : 'border-[var(--color-border)] bg-[var(--color-bg-secondary)]'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="text-sm font-medium text-[var(--color-text-secondary)] min-w-[50px]">
          {tagesberichtService.formatUhrzeit(entry.beginn)}
        </div>
        <div className="flex-1">
          <div className="font-medium text-[var(--color-text-primary)]">
            {isBreak ? 'Pause' : entry.taetigkeitstyp || 'Tätigkeit'}
          </div>
          {entry.sub_taetigkeit && (
            <div className="text-sm text-[var(--color-text-secondary)]">{entry.sub_taetigkeit}</div>
          )}
          {entry.external_nummer && (
            <div className="text-sm text-[var(--color-text-secondary)]">
              Baustelle: {entry.external_nummer}
            </div>
          )}
        </div>
        <div className="text-sm text-[var(--color-text-secondary)]">
          {tagesberichtService.formatDauer(entry.dauer)}
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-4xl mb-4">📋</div>
      <div className="text-[var(--color-text-primary)] font-medium mb-2">
        Noch keine Einträge heute
      </div>
      <div className="text-sm text-[var(--color-text-secondary)]">Starte dein erstes Tracking</div>
    </div>
  )
}

export function TagesberichtPage() {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = useCallback(async () => {
    if (!user?.id) return

    setLoading(true)
    setError(null)

    try {
      const data = await tagesberichtService.getTodayReport(user.id)
      setEntries(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Berechnungen
  const arbeitMinuten = entries
    .filter((e) => e.arbeit_pause === 'Arbeit')
    .reduce((sum, e) => sum + tagesberichtService.parseDauerToMinutes(e.dauer), 0)

  const pauseMinuten = entries
    .filter((e) => e.arbeit_pause === 'Pause')
    .reduce((sum, e) => sum + tagesberichtService.parseDauerToMinutes(e.dauer), 0)

  const baustellenAnzahl = new Set(
    entries.filter((e) => e.external_nummer).map((e) => e.external_nummer)
  ).size

  // Häufigster personal_status
  const statusCounts = entries.reduce((acc, e) => {
    if (e.personal_status) {
      acc[e.personal_status] = (acc[e.personal_status] || 0) + 1
    }
    return acc
  }, {})
  const personalStatus = Object.entries(statusCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[var(--color-text-secondary)]">Laden...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-[var(--color-error)] mb-4">{error}</div>
        <button
          onClick={loadData}
          className="px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white"
        >
          Erneut versuchen
        </button>
      </div>
    )
  }

  if (entries.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="flex flex-col gap-4">
      <DayHeader
        datum={new Date()}
        arbeitMinuten={arbeitMinuten}
        pauseMinuten={pauseMinuten}
        baustellenAnzahl={baustellenAnzahl}
        personalStatus={personalStatus}
      />

      <div>
        <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-2 uppercase tracking-wide">
          Tagesverlauf
        </h3>
        <div className="flex flex-col gap-2">
          {entries.map((entry, index) => (
            <TimelineEntry key={entry.created_at || index} entry={entry} />
          ))}
        </div>
      </div>
    </div>
  )
}
