import { supabase } from './supabase'

export const subTaetigkeitenService = {
  async getByTaetigkeitstyp(taetigkeitstypId, userId) {
    const { data, error } = await supabase
      .from('sub_taetigkeiten')
      .select('*')
      .eq('taetigkeitstyp_id', taetigkeitstypId)
      .eq('user_id', userId)
      .eq('is_archived', false)
      .order('sortierung', { ascending: true })

    if (error) throw error
    return data || []
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('sub_taetigkeiten')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },
}
