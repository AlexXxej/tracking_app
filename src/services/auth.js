import { supabase } from './supabase'

const appUrl = import.meta.env.VITE_APP_URL

export const auth = {
  async checkEmail(email) {
    const { data, error } = await supabase.functions.invoke('check-email', {
      body: { email },
    })
    
    if (error) throw error
    return data.authorized
  },

  async sendMagicLink(email) {
    // Check if email is authorized first
    const isAuthorized = await this.checkEmail(email)
    
    if (!isAuthorized) {
      throw new Error('Diese E-Mail-Adresse ist nicht autorisiert')
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${appUrl}/auth/callback`,
      },
    })
    
    if (error) throw error
    return { success: true }
  },

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  },

  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  },

  async getUserPermissions(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('can_edit_all_baustellen')
      .eq('id', userId)
      .single()

    if (error) throw error
    return {
      canEditAllBaustellen: data?.can_edit_all_baustellen || false,
    }
  },
}
