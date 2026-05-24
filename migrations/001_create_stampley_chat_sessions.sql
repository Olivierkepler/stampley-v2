-- Migration: create stampley_chat_sessions
-- Run: psql "$DATABASE_URL" -f migrations/001_create_stampley_chat_sessions.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS stampley_chat_sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  check_in_submission_id TEXT REFERENCES check_in_submissions(id) ON DELETE SET NULL,
  domain TEXT,
  stress_level INTEGER,
  mood INTEGER,
  energy INTEGER,
  user_message_count INTEGER DEFAULT 0,
  assistant_message_count INTEGER DEFAULT 0,
  summary TEXT,
  messages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stampley_chat_sessions_user_id
  ON stampley_chat_sessions (user_id);

CREATE INDEX IF NOT EXISTS idx_stampley_chat_sessions_created_at
  ON stampley_chat_sessions (created_at);

CREATE INDEX IF NOT EXISTS idx_stampley_chat_sessions_check_in_submission_id
  ON stampley_chat_sessions (check_in_submission_id);
