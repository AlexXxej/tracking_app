-- Soft-Delete Spalte für zeiterfassung
-- NULL = aktiver Eintrag, Timestamp = gelöscht

ALTER TABLE zeiterfassung ADD COLUMN deleted_at timestamp with time zone DEFAULT NULL;

-- Index für Performance bei Filterung
CREATE INDEX idx_zeiterfassung_deleted_at ON zeiterfassung(deleted_at) WHERE deleted_at IS NULL;
