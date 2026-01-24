import { useState, useEffect } from 'react'
import { useZeiterfassung } from '../../hooks/useZeiterfassung'
import { useSubNavigation } from '../../hooks/useSubNavigation'
import { useAuth } from '../../hooks/useAuth'
import { TaetigkeitSelect } from '../../components/tracking/TaetigkeitSelect'
import { BaustellenSearch } from '../../components/tracking/BaustellenSearch'
import { SubTaetigkeitSelect } from '../../components/tracking/SubTaetigkeitSelect'
import { ActiveTracking } from '../../components/tracking/ActiveTracking'
import { StatusDialog } from '../../components/tracking/StatusDialog'
import { subTaetigkeitenService } from '../../services/subTaetigkeiten'

const BAUSTELLE_NAME = 'baustelle'

export function MainPage() {
  const { user } = useAuth()
  const {
    activeEntry,
    taetigkeitstypen,
    loading,
    error,
    startTaetigkeit,
    endTaetigkeit,
    startPause,
    startStandalonePause,
    endPause,
    isBreakActive,
    isBaustelleTaetigkeit,
  } = useZeiterfassung()

  const { enableBack, disableBack } = useSubNavigation()

  const [selectedTaetigkeit, setSelectedTaetigkeit] = useState(null)
  const [selectedBaustelle, setSelectedBaustelle] = useState(null)
  const [showBaustellenSearch, setShowBaustellenSearch] = useState(false)
  const [showSubTaetigkeitSelect, setShowSubTaetigkeitSelect] = useState(false)
  const [subTaetigkeiten, setSubTaetigkeiten] = useState([])
  const [subTaetigkeitLoading, setSubTaetigkeitLoading] = useState(false)
  const [showStatusDialog, setShowStatusDialog] = useState(false)

  const handleBaustellenCancel = () => {
    setSelectedTaetigkeit(null)
    setShowBaustellenSearch(false)
  }

  const handleSubTaetigkeitCancel = () => {
    setSelectedTaetigkeit(null)
    setSelectedBaustelle(null)
    setShowSubTaetigkeitSelect(false)
    setSubTaetigkeiten([])
  }

  // Back-Button aktivieren wenn Baustellen-Suche oder Subtätigkeiten-Auswahl offen
  useEffect(() => {
    if (showSubTaetigkeitSelect) {
      enableBack(handleSubTaetigkeitCancel)
    } else if (showBaustellenSearch) {
      enableBack(handleBaustellenCancel)
    } else {
      disableBack()
    }
  }, [showBaustellenSearch, showSubTaetigkeitSelect, enableBack, disableBack])

  const loadSubTaetigkeiten = async (taetigkeitId) => {
    if (!user?.id) return
    setSubTaetigkeitLoading(true)
    try {
      const subs = await subTaetigkeitenService.getByTaetigkeitstyp(taetigkeitId, user.id)
      setSubTaetigkeiten(subs)
      setShowSubTaetigkeitSelect(true)
    } catch (err) {
      console.error('Fehler beim Laden der Subtätigkeiten:', err)
    } finally {
      setSubTaetigkeitLoading(false)
    }
  }

  const handleTaetigkeitSelect = async (taetigkeit) => {
    if (taetigkeit.isPauseOption) {
      await startStandalonePause()
      return
    }

    setSelectedTaetigkeit(taetigkeit)

    // Schritt 1: Prüfe ob Baustelle benötigt
    if (taetigkeit.name.toLowerCase() === BAUSTELLE_NAME) {
      setShowBaustellenSearch(true)
      return
    }

    // Schritt 2: Prüfe ob Subtätigkeiten benötigt
    if (taetigkeit.has_subtaetigkeiten) {
      await loadSubTaetigkeiten(taetigkeit.id)
      return
    }

    // Direkt starten
    await startTaetigkeit(taetigkeit.id)
    setSelectedTaetigkeit(null)
  }

  const handleBaustelleSelect = async (baustelle) => {
    if (!selectedTaetigkeit) return

    setShowBaustellenSearch(false)

    // Prüfe ob Subtätigkeiten benötigt
    if (selectedTaetigkeit.has_subtaetigkeiten) {
      setSelectedBaustelle(baustelle)
      await loadSubTaetigkeiten(selectedTaetigkeit.id)
      return
    }

    // Direkt starten
    await startTaetigkeit(selectedTaetigkeit.id, baustelle.id)
    setSelectedTaetigkeit(null)
  }

  const handleSubTaetigkeitSelect = async (subTaetigkeit) => {
    if (!selectedTaetigkeit) return

    await startTaetigkeit(
      selectedTaetigkeit.id,
      selectedBaustelle?.id || null,
      subTaetigkeit.id
    )

    // Reset
    setSelectedTaetigkeit(null)
    setSelectedBaustelle(null)
    setShowSubTaetigkeitSelect(false)
    setSubTaetigkeiten([])
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
      ) : showSubTaetigkeitSelect ? (
        <SubTaetigkeitSelect
          subTaetigkeiten={subTaetigkeiten}
          onSelect={handleSubTaetigkeitSelect}
          loading={subTaetigkeitLoading}
        />
      ) : showBaustellenSearch ? (
        <BaustellenSearch
          onSelect={handleBaustelleSelect}
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
