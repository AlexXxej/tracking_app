import { supabase } from './supabase'

export const zeiterfassungService = {
  async getActiveEntry(userId) {
    const { data, error } = await supabase
      .from('zeiterfassung')
      .select(`
        *,
        taetigkeit:taetigkeitstypen(id, name, has_subtaetigkeiten),
        baustelle:baustellen(id, bezeichnung, plz, ort),
        sub_taetigkeit:sub_taetigkeiten(id, name)
      `)
      .eq('user_id', userId)
      .is('end_time', null)
      .is('deleted_at', null)
      .order('start_time', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async startEntry({ userId, taetigkeitId, baustelleId = null, subTaetigkeitId = null, isBreak = false }) {
    // Aktuellen Tagesstatus abfragen
    const now = new Date().toISOString()
    const { data: statusData } = await supabase
      .from('tagesstatus')
      .select('status')
      .eq('user_id', userId)
      .lte('valid_from', now)
      .or(`valid_to.is.null,valid_to.gte.${now}`)
      .order('valid_to', { ascending: true, nullsFirst: false })
      .limit(1)
      .maybeSingle()

    const insertData = {
      user_id: userId,
      taetigkeit_id: taetigkeitId,
      baustelle_id: baustelleId,
      sub_taetigkeit_id: subTaetigkeitId,
      start_time: now,
      is_break: isBreak,
      personal_status: statusData?.status || 'arbeit',
    }

    const { data, error } = await supabase
      .from('zeiterfassung')
      .insert(insertData)
      .select(`
        *,
        taetigkeit:taetigkeitstypen(id, name, has_subtaetigkeiten),
        baustelle:baustellen(id, bezeichnung, plz, ort),
        sub_taetigkeit:sub_taetigkeiten(id, name)
      `)
      .single()

    if (error) throw error
    return data
  },

  async endEntry(entryId, status = null) {
    const updateData = {
      end_time: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Nur status setzen wenn explizit übergeben (für Baustellen)
    // Erlaubte Werte: 'fertig', 'teilweise', 'abgebrochen'
    if (status) {
      updateData.status = status
    }

    const { data, error } = await supabase
      .from('zeiterfassung')
      .update(updateData)
      .eq('id', entryId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async startBreak(userId, currentEntryId, pauseTaetigkeitId) {
    await this.endEntry(currentEntryId)

    const { data, error } = await supabase
      .from('zeiterfassung')
      .insert({
        user_id: userId,
        taetigkeit_id: pauseTaetigkeitId,
        baustelle_id: null,
        start_time: new Date().toISOString(),
        is_break: true,
      })
      .select(`
        *,
        taetigkeit:taetigkeitstypen(id, name, has_subtaetigkeiten),
        baustelle:baustellen(id, bezeichnung, plz, ort),
        sub_taetigkeit:sub_taetigkeiten(id, name)
      `)
      .single()

    if (error) throw error
    return data
  },

  async endBreak(breakEntryId) {
    return this.endEntry(breakEntryId)
  },

  async getTodayEntries(userId) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data, error } = await supabase
      .from('zeiterfassung')
      .select(`
        *,
        taetigkeit:taetigkeitstypen(id, name, has_subtaetigkeiten),
        baustelle:baustellen(id, bezeichnung, plz, ort),
        sub_taetigkeit:sub_taetigkeiten(id, name)
      `)
      .eq('user_id', userId)
      .is('deleted_at', null)
      .gte('start_time', today.toISOString())
      .order('start_time', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Eintrag aktualisieren (für Historie-Bearbeitung)
  async updateEntry(entryId, updates) {
    const { data, error } = await supabase
      .from('zeiterfassung')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', entryId)
      .select(`
        *,
        taetigkeit:taetigkeitstypen(id, name, has_subtaetigkeiten),
        baustelle:baustellen(id, bezeichnung, plz, ort),
        sub_taetigkeit:sub_taetigkeiten(id, name)
      `)
      .single()

    if (error) throw error
    return data
  },

  // Soft-Delete: Eintrag als gelöscht markieren
  async softDeleteEntry(entryId) {
    const { data, error } = await supabase
      .from('zeiterfassung')
      .update({
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', entryId)
      .select()
      .single()

    if (error) throw error
    return data
  },
}
