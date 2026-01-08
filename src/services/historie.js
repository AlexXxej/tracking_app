import { supabase } from './supabase'

const PAGE_SIZE = 5

const WEEKDAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']

export const historieService = {
  pageSize: PAGE_SIZE,

  formatDate(date) {
    const d = new Date(date)
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
  },

  getWeekday(date) {
    const d = new Date(date)
    return WEEKDAYS[d.getDay()]
  },

  // Generiere alle Tage zwischen zwei Daten
  getDateRange(from, to) {
    const dates = []
    const current = new Date(from)
    const end = new Date(to)

    current.setHours(0, 0, 0, 0)
    end.setHours(0, 0, 0, 0)

    while (current <= end) {
      dates.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }

    return dates.reverse() // Neueste zuerst
  },

  // Lade Einträge für einen Zeitraum
  async getEntriesForRange(userId, fromDate, toDate) {
    const from = new Date(fromDate)
    from.setHours(0, 0, 0, 0)

    const to = new Date(toDate)
    to.setHours(23, 59, 59, 999)

    const { data, error } = await supabase
      .from('zeiterfassung')
      .select(`
        *,
        taetigkeit:taetigkeitstypen(id, name),
        baustelle:baustellen(id, bezeichnung, oberbegriff, plz, ort)
      `)
      .eq('user_id', userId)
      .gte('start_time', from.toISOString())
      .lte('start_time', to.toISOString())
      .order('start_time', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Berechne Zusammenfassung pro Tag
  calculateDaySummary(entries, date) {
    const dateStr = date.toISOString().split('T')[0]
    const dayEntries = entries.filter(e => {
      const entryDate = new Date(e.start_time).toISOString().split('T')[0]
      return entryDate === dateStr
    })

    let workMinutes = 0
    let breakMinutes = 0

    dayEntries.forEach(entry => {
      if (!entry.end_time) return // Laufende Einträge ignorieren

      const start = new Date(entry.start_time)
      const end = new Date(entry.end_time)
      const duration = (end - start) / 1000 / 60 // Minuten

      if (entry.is_break) {
        breakMinutes += duration
      } else {
        workMinutes += duration
      }
    })

    return {
      date,
      dateStr,
      weekday: this.getWeekday(date),
      formattedDate: this.formatDate(date),
      workMinutes: Math.round(workMinutes),
      breakMinutes: Math.round(breakMinutes),
      entries: dayEntries,
    }
  },

  formatMinutes(minutes) {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return `${h}:${m.toString().padStart(2, '0')}`
  },

  // Hole paginierte Tages-Übersicht
  async getDaySummaries(userId, fromDate, toDate, page = 1) {
    const allDates = this.getDateRange(fromDate, toDate)
    const totalPages = Math.ceil(allDates.length / PAGE_SIZE)

    const offset = (page - 1) * PAGE_SIZE
    const pageDates = allDates.slice(offset, offset + PAGE_SIZE)

    if (pageDates.length === 0) {
      return { data: [], totalPages: 0, totalCount: 0 }
    }

    // Lade nur Einträge für die sichtbaren Tage
    const firstDate = pageDates[pageDates.length - 1] // Ältestes Datum
    const lastDate = pageDates[0] // Neuestes Datum

    const entries = await this.getEntriesForRange(userId, firstDate, lastDate)

    const summaries = pageDates.map(date => this.calculateDaySummary(entries, date))

    return {
      data: summaries,
      totalPages,
      totalCount: allDates.length,
    }
  },

  // Lade Detail für einen Tag
  async getDayDetail(userId, date) {
    const from = new Date(date)
    from.setHours(0, 0, 0, 0)

    const to = new Date(date)
    to.setHours(23, 59, 59, 999)

    const { data, error } = await supabase
      .from('zeiterfassung')
      .select(`
        *,
        taetigkeit:taetigkeitstypen(id, name),
        baustelle:baustellen(id, bezeichnung, oberbegriff, plz, ort)
      `)
      .eq('user_id', userId)
      .gte('start_time', from.toISOString())
      .lte('start_time', to.toISOString())
      .order('start_time', { ascending: true })

    if (error) throw error
    return data || []
  },
}
