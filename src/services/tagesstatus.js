import { supabase } from './supabase'

export const tagesstatusService = {
  // Alle aktiven und zukünftigen Status für einen User
  async getActiveAndFuture(userId) {
    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from('tagesstatus')
      .select('*')
      .eq('user_id', userId)
      .or(`valid_to.is.null,valid_to.gte.${now}`)
      .order('valid_from', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Aktueller Status für Tracking-Start
  async getCurrentStatus(userId) {
    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from('tagesstatus')
      .select('status')
      .eq('user_id', userId)
      .lte('valid_from', now)
      .or(`valid_to.is.null,valid_to.gte.${now}`)
      .order('valid_to', { ascending: true, nullsFirst: false })
      .limit(1)
      .maybeSingle()

    if (error) throw error
    return data?.status || null
  },

  // Neuen Status anlegen
  async create({ userId, status, validFrom, validTo }) {
    const insertData = {
      user_id: userId,
      status,
      valid_from: validFrom,
      valid_to: validTo,
    }

    const { data, error } = await supabase
      .from('tagesstatus')
      .insert(insertData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Status löschen
  async delete(entryId) {
    const { error } = await supabase
      .from('tagesstatus')
      .delete()
      .eq('id', entryId)

    if (error) throw error
  },
}
