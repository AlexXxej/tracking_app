import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import { zeiterfassungService } from '../services/zeiterfassung'
import { taetigkeitstypenService } from '../services/taetigkeitstypen'

export function useZeiterfassung() {
  const { user } = useAuth()
  const [activeEntry, setActiveEntry] = useState(null)
  const [taetigkeitstypen, setTaetigkeitstypen] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = useCallback(async () => {
    if (!user?.id) return

    setLoading(true)
    setError(null)

    try {
      const [entry, typen] = await Promise.all([
        zeiterfassungService.getActiveEntry(user.id),
        taetigkeitstypenService.getByUser(user.id),
      ])

      setActiveEntry(entry)
      setTaetigkeitstypen(typen)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    loadData()
  }, [loadData])

  const startTaetigkeit = useCallback(async (taetigkeitId, baustelleId = null, subTaetigkeitId = null) => {
    if (!user?.id) return

    setError(null)
    try {
      const entry = await zeiterfassungService.startEntry({
        userId: user.id,
        taetigkeitId,
        baustelleId,
        subTaetigkeitId,
      })
      setActiveEntry(entry)
      return entry
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [user?.id])

  const endTaetigkeit = useCallback(async (status = null) => {
    if (!activeEntry?.id) return

    setError(null)
    try {
      await zeiterfassungService.endEntry(activeEntry.id, status)
      setActiveEntry(null)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [activeEntry?.id])

  const startPause = useCallback(async () => {
    if (!user?.id || !activeEntry?.id) return

    // Finde den Pause-Tätigkeitstyp
    const pauseTyp = taetigkeitstypen.find(t => t.name.toLowerCase() === 'pause')
    if (!pauseTyp) {
      setError('Kein Pause-Tätigkeitstyp gefunden')
      return
    }

    setError(null)
    try {
      const breakEntry = await zeiterfassungService.startBreak(user.id, activeEntry.id, pauseTyp.id)
      setActiveEntry(breakEntry)
      return breakEntry
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [user?.id, activeEntry?.id, taetigkeitstypen])

  const endPause = useCallback(async () => {
    if (!activeEntry?.id) return

    setError(null)
    try {
      await zeiterfassungService.endBreak(activeEntry.id)
      setActiveEntry(null)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [activeEntry?.id])

  const isBreakActive = activeEntry?.is_break === true
  const isBaustelleTaetigkeit = activeEntry?.taetigkeit?.name?.toLowerCase() === 'baustelle'

  return {
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
    refresh: loadData,
  }
}
