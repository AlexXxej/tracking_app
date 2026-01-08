import { useState } from 'react'
import { useZeiterfassung } from '../../hooks/useZeiterfassung'
import { TaetigkeitSelect } from '../../components/tracking/TaetigkeitSelect'
import { BaustellenSearch } from '../../components/tracking/BaustellenSearch'
import { ActiveTracking } from '../../components/tracking/ActiveTracking'
import { StatusDialog } from '../../components/tracking/StatusDialog'

const BAUSTELLE_NAME = 'baustelle'

export function MainPage() {
  const {
    activeEntry,
    taetigkeitstypen,
    loading,
    error,
    startTaetigkeit,
    endTaetigkeit,
    startPause,
    endPause,
    isBreakActive,
    isBaustelleTaetigkeit,
  } = useZeiterfassung()

  const [selectedTaetigkeit, setSelectedTaetigkeit] = useState(null)
  const [showBaustellenSearch, setShowBaustellenSearch] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)

  const handleTaetigkeitSelect = async (taetigkeit) => {
    if (taetigkeit.name.toLowerCase() === BAUSTELLE_NAME) {
      setSelectedTaetigkeit(taetigkeit)
      setShowBaustellenSearch(true)
    } else {
      await startTaetigkeit(taetigkeit.id)
    }
  }

  const handleBaustelleSelect = async (baustelle) => {
    if (selectedTaetigkeit) {
      await startTaetigkeit(selectedTaetigkeit.id, baustelle.id)
      setSelectedTaetigkeit(null)
      setShowBaustellenSearch(false)
    }
  }

  const handleBaustellenCancel = () => {
    setSelectedTaetigkeit(null)
    setShowBaustellenSearch(false)
  }

  const handlePause = async () => {
    await startPause()
  }

  const handleEnd = () => {
    if (isBaustelleTaetigkeit) {
      setShowStatusDialog(true)
    } else {
      endTaetigkeit()
    }
  }

  const handleStatusSelect = async (status) => {
    await endTaetigkeit(status)
    setShowStatusDialog(false)
  }

  const handleEndBreak = async () => {
    await endPause()
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-[var(--color-text-secondary)]">Laden...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-[var(--color-error)]">{error}</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {activeEntry ? (
        <ActiveTracking
          entry={activeEntry}
          onPause={handlePause}
          onEnd={isBreakActive ? handleEndBreak : handleEnd}
          isBreak={isBreakActive}
        />
      ) : showBaustellenSearch ? (
        <BaustellenSearch
          onSelect={handleBaustelleSelect}
          onCancel={handleBaustellenCancel}
        />
      ) : (
        <TaetigkeitSelect
          taetigkeitstypen={taetigkeitstypen}
          onSelect={handleTaetigkeitSelect}
          loading={loading}
        />
      )}

      <StatusDialog
        isOpen={showStatusDialog}
        onClose={() => setShowStatusDialog(false)}
        onSelect={handleStatusSelect}
      />
    </div>
  )
}
