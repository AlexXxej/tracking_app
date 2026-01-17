const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_AKTION_URL

export const webhookService = {
  async triggerAktion(startDate, endDate) {
    if (!WEBHOOK_URL) {
      throw new Error('Webhook URL nicht konfiguriert')
    }

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        start_date: startDate,
        end_date: endDate,
        triggered_at: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Webhook Fehler: ${response.status} - ${errorText}`)
    }

    return await response.json()
  },
}
