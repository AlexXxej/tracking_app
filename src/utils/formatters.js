const TIMEZONE = 'Europe/Berlin'

/**
 * Formatiert Minuten kompakt: "2:15"
 * Verwendet in: Historie
 */
export function formatMinutesCompact(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}:${m.toString().padStart(2, '0')}`
}

/**
 * Formatiert Minuten lesbar: "2h 15min" oder "45min"
 * Verwendet in: Tagesbericht
 */
export function formatMinutesReadable(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h > 0) return `${h}h ${m}min`
  return `${m}min`
}

/**
 * Formatiert ISO-String als lokale Zeit (HH:MM) in Europe/Berlin
 * Verwendet in: Historie Zeitanzeige
 */
export function formatTimeLocal(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  return d.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TIMEZONE
  })
}

/**
 * Konvertiert Date-Objekt oder ISO-String zu YYYY-MM-DD in Europe/Berlin
 * Verwendet in: Datum-Handling für Modals
 */
export function toLocalDateString(date) {
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleDateString('en-CA', { timeZone: TIMEZONE })
}

/**
 * Extrahiert lokale Uhrzeit (HH:MM) aus ISO-String für Input-Felder
 * Verwendet in: EntryEditModal, ManualEntryModal
 */
export function formatTimeForInput(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  const formatter = new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TIMEZONE,
    hour12: false
  })
  return formatter.format(d)
}

/**
 * Kombiniert Datum (Date oder String) mit Uhrzeit (HH:MM) zu ISO-String
 * Input: lokale Zeit, Output: UTC ISO-String
 * Verwendet in: Speichern von Zeiteinträgen
 */
export function combineDateAndTime(date, timeString) {
  if (!timeString) return null
  const dateStr = date instanceof Date ? toLocalDateString(date) : date
  const localDate = new Date(`${dateStr}T${timeString}:00`)
  return localDate.toISOString()
}
