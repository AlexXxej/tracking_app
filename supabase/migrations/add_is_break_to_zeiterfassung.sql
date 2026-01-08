-- Migration: Add is_break column to zeiterfassung table
-- Tracks break/pause entries separately from work entries

ALTER TABLE zeiterfassung ADD COLUMN IF NOT EXISTS is_break boolean DEFAULT false;

-- Index for efficient queries on break status
CREATE INDEX IF NOT EXISTS idx_zeiterfassung_is_break ON zeiterfassung(is_break) WHERE is_break = true;
