import { supabase } from './supabase'

export const tagesberichtService = {
  async getTodayReport(userId) {
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('zeiterfassung_export')
      .select('*')
      .eq('user_id', userId)
      .eq('datum', today)
      .order('beginn', { ascending: true })

    if (error) throw error
    return data || []
  },

  // "HH:MM:SS" -> "2h 15min" oder "45min"
  formatDauer(dauer) {
    if (!dauer) return '-'
    const parts = dauer.split(':')
    const hours = parseInt(parts[0], 10)
    const minutes = parseInt(parts[1], 10)
    if (hours > 0) return `${hours}h ${minutes}min`
    return `${minutes}min`
  },

  // "HH:MM:SS" -> Anzahl Minuten
  parseDauerToMinutes(dauer) {
    if (!dauer) return 0
    const parts = dauer.split(':')
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)
  },

  // Minuten -> "2h 15min" oder "45min"
  formatMinutes(minutes) {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    if (h > 0) return `${h}h ${m}min`
    return `${m}min`
  },

  // -> "Freitag, 17. Januar 2026"
  formatDatumLang(date) {
    return new Date(date).toLocaleDateString('de-DE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  },

  // "HH:MM:SS" -> "07:30"
  formatUhrzeit(time) {
    if (!time) return '-'
    return time.substring(0, 5)
  },
}
