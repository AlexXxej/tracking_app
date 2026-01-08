import { supabase } from './supabase'

export const zeiterfassungService = {
  async getActiveEntry(userId) {
    const { data, error } = await supabase
      .from('zeiterfassung')
      .select(`
        *,
        taetigkeit:taetigkeitstypen(id, name),
        baustelle:baustellen(id, bezeichnung, plz, ort)
      `)
      .eq('user_id', userId)
      .is('end_time', null)
      .order('start_time', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async startEntry({ userId, taetigkeitId, baustelleId = null, isBreak = false }) {
    const { data, error } = await supabase
      .from('zeiterfassung')
      .insert({
        user_id: userId,
        taetigkeit_id: taetigkeitId,
        baustelle_id: baustelleId,
        start_time: new Date().toISOString(),
        is_break: isBreak,
        status: 'running',
      })
      .select(`
        *,
        taetigkeit:taetigkeitstypen(id, name),
        baustelle:baustellen(id, bezeichnung, plz, ort)
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

    if (status) {
      updateData.status = status
    } else {
      updateData.status = 'completed'
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

  async startBreak(userId, currentEntryId) {
    await this.endEntry(currentEntryId)

    const { data, error } = await supabase
      .from('zeiterfassung')
      .insert({
        user_id: userId,
        taetigkeit_id: null,
        baustelle_id: null,
        start_time: new Date().toISOString(),
        is_break: true,
        status: 'running',
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async endBreak(breakEntryId) {
    return this.endEntry(breakEntryId, 'completed')
  },

  async getTodayEntries(userId) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data, error } = await supabase
      .from('zeiterfassung')
      .select(`
        *,
        taetigkeit:taetigkeitstypen(id, name),
        baustelle:baustellen(id, bezeichnung, plz, ort)
      `)
      .eq('user_id', userId)
      .gte('start_time', today.toISOString())
      .order('start_time', { ascending: false })

    if (error) throw error
    return data || []
  },
}
