-- Migration: create post_survey_responses (post-study exit survey)
-- Run: psql "$DATABASE_URL" -f migrations/002_create_post_survey_responses.sql

CREATE TABLE IF NOT EXISTS post_survey_responses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  dds_answers JSONB,
  dds_scores JSONB,
  phq_answers JSONB,
  phq_total INTEGER,
  phq_severity TEXT,
  sus_answers JSONB,
  sus_score NUMERIC,
  stampley_feedback JSONB,
  open_reflection TEXT,
  future_research_contact BOOLEAN,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_post_survey_responses_user_id
  ON post_survey_responses (user_id);
