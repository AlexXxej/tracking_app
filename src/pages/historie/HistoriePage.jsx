import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useSubNavigation } from '../../hooks/useSubNavigation'
import { historieService } from '../../services/historie'
import { Pagination } from '../../components/baustellen/BaustellenList'
import { EntryEditModal } from '../../components/historie/EntryEditModal'
import { ManualEntryModal } from '../../components/historie/ManualEntryModal'

function getDefaultDates() {
  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - 4)
  return {
    from: from.toISOString().split('T')[0],
    to: to.toISOString().split('T')[0],
  }
}

function DaySummaryCard({ summary, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4 text-left transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-bg-tertiary)]"
    >
      <div className="font-medium text-[var(--color-text-primary)]">
        {summary.weekday} {summary.formattedDate}
      </div>
      <div className="text-sm text-[var(--color-text-secondary)]">
        Arbeitszeit: {historieService.formatMinutes(summary.workMinutes)}
      </div>
      <div className="text-sm text-[var(--color-text-tertiary)]">
        Pause: {historieService.formatMinutes(summary.breakMinutes)}
      </div>
    </button>
  )
}

function DayDetail({ date, entries, onEntryClick }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
        {historieService.getWeekday(date)} {historieService.formatDate(date)}
      </h2>

      {entries.length === 0 ? (
        <div className="text-center py-4 text-[var(--color-text-secondary)]">
          Keine Einträge
        </div>
      ) : (
        <div className="flex flex-col gap-2 max-h-[60vh] overflow-auto">
          {entries.map((entry) => {
            const start = new Date(entry.start_time)
            const end = entry.end_time ? new Date(entry.end_time) : null
            const duration = end ? Math.round((end - start) / 1000 / 60) : null

            return (
              <button
                key={entry.id}
                onClick={() => onEntryClick(entry)}
                className={`rounded-lg border p-3 text-left transition-colors hover:border-[var(--color-accent)] ${
                  entry.is_break
                    ? 'border-[var(--color-border)] bg-[var(--color-bg-tertiary)]'
                    : 'border-[var(--color-border)] bg-[var(--color-bg-secondary)]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-[var(--color-text-primary)]">
                      {entry.is_break ? 'Pause' : entry.taetigkeit?.name || 'Tätigkeit'}
                    </div>
                    {entry.baustelle && (
                      <div className="text-sm text-[var(--color-text-secondary)]">
                        {entry.baustelle.oberbegriff} - {entry.baustelle.bezeichnung}
                      </div>
                    )}
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-[var(--color-text-secondary)]">
                      {start.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                      {end && ` - ${end.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}`}
                    </div>
                    {duration !== null && (
                      <div className="text-[var(--color-text-tertiary)]">
                        {historieService.formatMinutes(duration)}
                      </div>
                    )}
                  </div>
                </div>
                {entry.notiz && (
                  <div className="mt-2 text-sm text-[var(--color-text-tertiary)]">
                    {entry.notiz}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function HistoriePage() {
  const { user } = useAuth()
  const { enableBack, disableBack } = useSubNavigation()

  const defaultDates = getDefaultDates()
  const [fromDate, setFromDate] = useState(defaultDates.from)
  const [toDate, setToDate] = useState(defaultDates.to)

  const [summaries, setSummaries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  // Detail-Ansicht
  const [selectedDay, setSelectedDay] = useState(null)
  const [dayEntries, setDayEntries] = useState([])

  // Edit-Modal
  const [editingEntry, setEditingEntry] = useState(null)

  // Manual-Entry-Modal
  const [showManualEntry, setShowManualEntry] = useState(false)

  const loadSummaries = useCallback(async (page = 1) => {
    if (!user?.id) return

    setLoading(true)
    setError(null)

    try {
      const result = await historieService.getDaySummaries(user.id, fromDate, toDate, page)
      setSummaries(result.data)
      setTotalPages(result.totalPages)
      setCurrentPage(page)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user?.id, fromDate, toDate])

  useEffect(() => {
    loadSummaries(1)
  }, [fromDate, toDate, user?.id])

  // Back-Button für Detail-Ansicht
  useEffect(() => {
    if (selectedDay) {
      enableBack(() => {
        setSelectedDay(null)
        setDayEntries([])
      })
    } else {
      disableBack()
    }
  }, [selectedDay, enableBack, disableBack])

  const handleDayClick = async (summary) => {
    setLoading(true)
    try {
      const entries = await historieService.getDayDetail(user.id, summary.date)
      setDayEntries(entries)
      setSelectedDay(summary)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEntryClick = (entry) => {
    setEditingEntry(entry)
  }

  const handleEntrySave = async () => {
    setEditingEntry(null)
    // Reload day entries
    if (selectedDay) {
      const entries = await historieService.getDayDetail(user.id, selectedDay.date)
      setDayEntries(entries)
    }
    // Reload summaries to update totals
    loadSummaries(currentPage)
  }

  const handleEntryDelete = async () => {
    setEditingEntry(null)
    // Reload day entries
    if (selectedDay) {
      const entries = await historieService.getDayDetail(user.id, selectedDay.date)
      setDayEntries(entries)
    }
    // Reload summaries to update totals
    loadSummaries(currentPage)
  }

  const handleManualEntrySave = async () => {
    setShowManualEntry(false)
    // Reload day entries
    if (selectedDay) {
      const entries = await historieService.getDayDetail(user.id, selectedDay.date)
      setDayEntries(entries)
    }
    // Reload summaries to update totals
    loadSummaries(currentPage)
  }

  // Detail-Ansicht
  if (selectedDay) {
    return (
      <>
        <DayDetail
          date={selectedDay.date}
          entries={dayEntries}
          onEntryClick={handleEntryClick}
        />
        {editingEntry && (
          <EntryEditModal
            entry={editingEntry}
            onClose={() => setEditingEntry(null)}
            onSave={handleEntrySave}
            onDelete={handleEntryDelete}
          />
        )}
        {showManualEntry && (
          <ManualEntryModal
            date={selectedDay.date}
            onClose={() => setShowManualEntry(false)}
            onSave={handleManualEntrySave}
          />
        )}
        <button
          onClick={() => setShowManualEntry(true)}
          className="fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-accent)] text-white shadow-lg transition-transform hover:scale-105"
          title="Neuer Eintrag"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </>
    )
  }

  // Übersicht
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-xs text-[var(--color-text-tertiary)] mb-1">Von</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-[var(--color-text-tertiary)] mb-1">Bis</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2 text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-[var(--color-error)]">{error}</p>
      )}

      <div className="flex flex-col gap-2 max-h-[55vh] overflow-auto">
        {loading ? (
          <div className="text-center py-4 text-[var(--color-text-secondary)]">
            Laden...
          </div>
        ) : summaries.length === 0 ? (
          <div className="text-center py-4 text-[var(--color-text-secondary)]">
            Keine Daten im ausgewählten Zeitraum
          </div>
        ) : (
          summaries.map((summary) => (
            <DaySummaryCard
              key={summary.dateStr}
              summary={summary}
              onClick={() => handleDayClick(summary)}
            />
          ))
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={loadSummaries}
      />
    </div>
  )
}
