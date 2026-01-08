# Zeiterfassung App

## Tech Stack
- React 19 + Vite + Tailwind CSS 4
- Supabase (Auth via Magic Link, RLS für Datenzugriff)
- Deployment: Railway

## Architektur
- `/src/services/` - Supabase Client & Auth Logic
- `/src/hooks/` - React Hooks (useAuth)
- `/src/pages/` - Seitenkomponenten
- `/src/components/` - UI Komponenten
- `/src/layouts/` - Layout Wrapper

## Sicherheit
- Auth: Magic Link + E-Mail-Whitelist via Edge Function
- Datenzugriff: Row Level Security (RLS) in Supabase
- Keine Secrets im Frontend-Code

## Konventionen
- Deutsche UI-Texte
- CSS Variables für Theming (--color-*)
- Funktionale Komponenten mit Hooks

## Commands
- `npm run dev` - Entwicklungsserver
- `npm run build` - Production Build

## Database Tables (Supabase)

### users
Public profile table linked to `auth.users` via `id`.
- `id` (uuid, PK): references auth.users.id
- `email` (varchar): user email
- `role` (varchar): user role (e.g. admin, worker)
- `is_allowed` (boolean): whitelist for login permission
- `can_edit_all_baustellen` (boolean): permission to edit all construction sites
- `created_at` (timestamptz): creation timestamp

### baustellen
Construction sites synced from external system.
- `id` (uuid, PK)
- `external_nummer` (varchar): ID from external system
- `oberbegriff` (varchar): category/grouping
- `bezeichnung` (varchar): name/title
- `auftraggeber` (varchar): client
- `ansprechpartner` (varchar): contact person
- `zustaendig` (varchar): responsible person
- `status` (varchar): project status
- `projektbemerkung` (text): notes
- `datum` (date): project date
- `plz` (varchar): postal code
- `ort` (varchar): city
- `sync_status` (varchar): sync state (pending/synced/conflict)
- `remote_modified_at` (timestamptz): last external modification
- `local_modified_at` (timestamptz): last local modification
- `updated_by` (uuid): user who last modified
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### zeiterfassung
Time entries per user.
- `id` (uuid, PK)
- `user_id` (uuid, FK): references users.id
- `baustelle_id` (uuid, FK, nullable): references baustellen.id
- `taetigkeit_id` (uuid, FK): references taetigkeitstypen.id
- `start_time` (timestamptz): entry start
- `end_time` (timestamptz, nullable): entry end, null = running
- `status` (varchar): entry state
- `notiz` (text): optional note
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### taetigkeitstypen
Activity types per user.
- `id` (uuid, PK)
- `user_id` (uuid, FK): references users.id
- `name` (varchar): display name
- `sortierung` (integer): display order
- `is_archived` (boolean): soft delete flag
- `created_at` (timestamptz)

### notifications
User notifications.
- `id` (uuid, PK)
- `user_id` (uuid, FK): references users.id
- `typ` (varchar): notification category
- `message` (text): notification text
- `reference_id` (uuid, nullable): related entity
- `is_read` (boolean): read state
- `created_at` (timestamptz)

### auth_logs
Audit trail for auth events.
- `id` (uuid, PK)
- `email` (varchar): attempted email
- `action` (varchar): event type (login_attempt, login_success, etc.)
- `ip` (varchar, nullable): client IP
- `details` (text, nullable): additional info
- `created_at` (timestamptz)

### auth_rate_limits
Rate limiting per email.
- `email` (varchar, PK): rate-limited email
- `attempts` (integer): attempt count
- `last_attempt` (timestamptz): last attempt timestamp

### sync_triggers
Tracks sync operations.
- `id` (uuid, PK)
- `type` (varchar): trigger type (manual/scheduled)
- `triggered_by` (uuid, FK): user who triggered
- `triggered_at` (timestamptz)
- `status` (varchar): sync status (pending/completed/failed)