# Zeiterfassung

Arbeitszeit-Tracking App mit Supabase Backend.

## Setup

1. `.env` mit Supabase Credentials füllen
2. `npm install`
3. Supabase: `supabase/schema.sql` ausführen
4. Supabase: Redirect URL konfigurieren

## Deployment (Railway)

```bash
npm run build
```

Railway erkennt `railway.json` automatisch.

## Supabase Konfiguration

**Authentication > URL Configuration > Redirect URLs:**
```
https://YOUR_APP.up.railway.app/auth/callback
```

**Edge Function deployen:**
```bash
supabase functions deploy check-email
```
