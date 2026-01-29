import { supabase } from './supabase'

export const webhookService = {
  async triggerAktion(startDate, endDate) {
    const { data, error } = await supabase.functions.invoke('trigger-export', {
      body: {
        start_date: startDate,
        end_date: endDate,
        triggered_at: new Date().toISOString(),
      },
    })

    if (error) {
      // HTTP-Fehler: Status + Body beibehalten (wie bisher)
      if (error.context instanceof Response) {
        let errorText
        try {
          errorText = await error.context.text()
        } catch {
          errorText = error.message
        }
        throw new Error(`Webhook Fehler: ${error.context.status} - ${errorText}`)
      }
      // Netzwerk-/Relay-Fehler
      throw new Error(`Webhook Fehler: ${error.message}`)
    }

    return data
  },
}
