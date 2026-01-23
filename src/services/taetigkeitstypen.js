import { supabase } from './supabase'

export const taetigkeitstypenService = {
  async getByUser(userId) {
    const { data, error } = await supabase
      .from('taetigkeitstypen')
      .select('*')
      .eq('user_id', userId)
      .eq('is_archived', false)
      .order('sortierung', { ascending: true })

    if (error) throw error
    return data || []
  },
}
