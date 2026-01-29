import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from './useAuth'
import { zeiterfassungService } from '../services/zeiterfassung'
import { taetigkeitstypenService } from '../services/taetigkeitstypen'

export function useZeiterfassung() {
  const { user } = useAuth()
  const [activeEntry, setActiveEntry] = useState(null)
  const [taetigkeitstypen, setTaetigkeitstypen] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const previousActivityRef = useRef(null)

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

    // Vorherigen Tätigkeitskontext speichern für Resume nach Pause
    previousActivityRef.current = {
      taetigkeitId: activeEntry.taetigkeit_id,
      baustelleId: activeEntry.baustelle_id || null,
      subTaetigkeitId: activeEntry.sub_taetigkeit_id || null,
    }

    setError(null)
    try {
      const breakEntry = await zeiterfassungService.startBreak(user.id, activeEntry.id, pauseTyp.id)
      setActiveEntry(breakEntry)
      return breakEntry
    } catch (err) {
      previousActivityRef.current = null
      setError(err.message)
      throw err
    }
  }, [user?.id, activeEntry?.id, activeEntry?.taetigkeit_id, activeEntry?.baustelle_id, activeEntry?.sub_taetigkeit_id, taetigkeitstypen])

  const startStandalonePause = useCallback(async () => {
    if (!user?.id) return

    const pauseTyp = taetigkeitstypen.find(t => t.name.toLowerCase() === 'pause')
    if (!pauseTyp) {
      setError('Kein Pause-Tätigkeitstyp gefunden')
      return
    }

    setError(null)
    try {
      const entry = await zeiterfassungService.startEntry({
        userId: user.id,
        taetigkeitId: pauseTyp.id,
        isBreak: true,
      })
      setActiveEntry(entry)
      return entry
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [user?.id, taetigkeitstypen])

  const endPause = useCallback(async () => {
    if (!activeEntry?.id) return

    setError(null)
    try {
      await zeiterfassungService.endBreak(activeEntry.id)

      const prevContext = previousActivityRef.current
      previousActivityRef.current = null

      if (prevContext) {
        // Vorherige Tätigkeit automatisch fortsetzen
        try {
          const entry = await zeiterfassungService.startEntry({
            userId: user.id,
            taetigkeitId: prevContext.taetigkeitId,
            baustelleId: prevContext.baustelleId,
            subTaetigkeitId: prevContext.subTaetigkeitId,
          })
          setActiveEntry(entry)
        } catch (restartErr) {
          console.error('Fehler beim Fortsetzen der Tätigkeit:', restartErr)
          setActiveEntry(null)
        }
      } else {
        setActiveEntry(null)
      }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [activeEntry?.id, user?.id])

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
    startStandalonePause,
    endPause,
    isBreakActive,
    isBaustelleTaetigkeit,
    refresh: loadData,
  }
}
