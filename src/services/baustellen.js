import { supabase } from './supabase'

const SEARCHABLE_COLUMNS = [
  { value: 'adresse', label: 'Adresse', columns: ['plz', 'ort'] },
  { value: 'bezeichnung', label: 'Bezeichnung', columns: ['bezeichnung'] },
  { value: 'auftraggeber', label: 'Auftraggeber', columns: ['auftraggeber'] },
  { value: 'ansprechpartner', label: 'Ansprechpartner', columns: ['ansprechpartner'] },
  { value: 'zustaendig', label: 'Zuständig', columns: ['zustaendig'] },
  { value: 'oberbegriff', label: 'Oberbegriff', columns: ['oberbegriff'] },
]

export const baustellenService = {
  searchableColumns: SEARCHABLE_COLUMNS,

  async search(query, filterColumn = 'adresse', limit = 20) {
    if (!query || query.trim().length < 2) {
      return []
    }

    const searchTerm = `%${query.trim()}%`
    const filter = SEARCHABLE_COLUMNS.find(c => c.value === filterColumn) || SEARCHABLE_COLUMNS[0]

    let queryBuilder = supabase
      .from('baustellen')
      .select('id, bezeichnung, auftraggeber, ansprechpartner, zustaendig, oberbegriff, plz, ort, status')
      .limit(limit)

    if (filter.columns.length === 1) {
      queryBuilder = queryBuilder.ilike(filter.columns[0], searchTerm)
    } else {
      const orConditions = filter.columns.map(col => `${col}.ilike.${searchTerm}`).join(',')
      queryBuilder = queryBuilder.or(orConditions)
    }

    const { data, error } = await queryBuilder.order('bezeichnung', { ascending: true })

    if (error) throw error
    return data || []
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

  formatAddress(baustelle) {
    if (!baustelle) return ''
    const parts = [baustelle.plz, baustelle.ort].filter(Boolean)
    return parts.join(' ')
  },
}
