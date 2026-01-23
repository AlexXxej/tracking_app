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
