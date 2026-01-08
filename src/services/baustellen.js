import { supabase } from './supabase'

const SEARCHABLE_COLUMNS = [
  { value: 'oberbegriff', label: 'Oberbegriff', columns: ['oberbegriff'] },
  { value: 'bezeichnung', label: 'Bezeichnung', columns: ['bezeichnung'] },
  { value: 'external_nummer', label: 'Externe Nr.', columns: ['external_nummer'] },
  { value: 'auftraggeber', label: 'Auftraggeber', columns: ['auftraggeber'] },
  { value: 'ansprechpartner', label: 'Ansprechpartner', columns: ['ansprechpartner'] },
  { value: 'zustaendig', label: 'Zuständig', columns: ['zustaendig'] },
]

const PAGE_SIZE = 10

export const baustellenService = {
  searchableColumns: SEARCHABLE_COLUMNS,
  pageSize: PAGE_SIZE,

  async search(query, filterColumn = 'oberbegriff', page = 1) {
    if (!query || query.trim().length < 2) {
      return { data: [], totalCount: 0, totalPages: 0 }
    }

    const searchTerm = `%${query.trim()}%`
    const filter = SEARCHABLE_COLUMNS.find(c => c.value === filterColumn) || SEARCHABLE_COLUMNS[0]
    const offset = (page - 1) * PAGE_SIZE

    let queryBuilder = supabase
      .from('baustellen')
      .select('id, external_nummer, bezeichnung, auftraggeber, ansprechpartner, zustaendig, oberbegriff, plz, ort, status, datum', { count: 'exact' })

    if (filter.columns.length === 1) {
      queryBuilder = queryBuilder.ilike(filter.columns[0], searchTerm)
    } else {
      const orConditions = filter.columns.map(col => `${col}.ilike.${searchTerm}`).join(',')
      queryBuilder = queryBuilder.or(orConditions)
    }

    const { data, error, count } = await queryBuilder
      .order('datum', { ascending: false, nullsFirst: false })
      .range(offset, offset + PAGE_SIZE - 1)

    if (error) throw error

    const totalPages = Math.ceil((count || 0) / PAGE_SIZE)
    return { data: data || [], totalCount: count || 0, totalPages }
  },

  async getLatest(page = 1) {
    const offset = (page - 1) * PAGE_SIZE

    const { data, error, count } = await supabase
      .from('baustellen')
      .select('id, external_nummer, bezeichnung, auftraggeber, ansprechpartner, zustaendig, oberbegriff, plz, ort, status, datum', { count: 'exact' })
      .order('datum', { ascending: false, nullsFirst: false })
      .range(offset, offset + PAGE_SIZE - 1)

    if (error) throw error

    const totalPages = Math.ceil((count || 0) / PAGE_SIZE)
    return { data: data || [], totalCount: count || 0, totalPages }
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('baustellen')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('baustellen')
      .update({
        ...updates,
        local_modified_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  formatAddress(baustelle) {
    if (!baustelle) return ''
    const parts = [baustelle.plz, baustelle.ort].filter(Boolean)
    return parts.join(' ')
  },

  // Felder die im Detail angezeigt werden (ohne technische Felder)
  displayFields: [
    { key: 'external_nummer', label: 'Externe Nr.' },
    { key: 'oberbegriff', label: 'Oberbegriff' },
    { key: 'bezeichnung', label: 'Bezeichnung' },
    { key: 'auftraggeber', label: 'Auftraggeber' },
    { key: 'ansprechpartner', label: 'Ansprechpartner' },
    { key: 'zustaendig', label: 'Zuständig' },
    { key: 'status', label: 'Status' },
    { key: 'projektbemerkung', label: 'Bemerkung' },
    { key: 'datum', label: 'Datum' },
    { key: 'plz', label: 'PLZ' },
    { key: 'ort', label: 'Ort' },
  ],
}
