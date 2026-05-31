-- ================================================
-- AIDES-T2D / Stampley V2 — Complete Database Schema
-- Database: stampley_db3
-- Last updated: May 22, 2026
-- ================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
CREATE TYPE user_role AS ENUM ('ADMIN', 'PARTICIPANT');

-- ================================================
-- TABLE: users
-- Stores all participants and admin accounts
-- Access restricted by study_id (registration key)
-- ================================================
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'PARTICIPANT',
  study_id TEXT UNIQUE,         -- The study key used to register
  created_at TIMESTAMP DEFAULT NOW()
);

-- ================================================
-- TABLE: study_keys
-- Admin-generated keys required for registration
-- Each key can only be used once (is_used = true after registration)
-- ================================================
CREATE TABLE IF NOT EXISTS study_keys (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  key TEXT UNIQUE NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  created_by TEXT,              -- Admin email who generated the key
  created_at TIMESTAMP DEFAULT NOW()
);

-- ================================================
-- TABLE: check_in_submissions
-- Daily check-in data per participant
-- Tracks: distress, mood, energy, reflection, coping
-- Added: week_number, day_number, check_in_date for progress tracking
-- ================================================
CREATE TABLE IF NOT EXISTS check_in_submissions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,                        -- Emotional | Regimen | Physician | Interpersonal
  subscale TEXT NOT NULL,                      -- Specific subscale within domain
  distress INTEGER NOT NULL,                   -- 0-10 distress slider
  mood INTEGER,                                -- 0-10 mood slider
  energy INTEGER,                              -- 0-10 energy slider
  reflection TEXT,                             -- Open reflection response
  coping_action TEXT,                          -- Coping action response
  context_tags JSONB DEFAULT '[]',             -- Array of context tags selected
  needs_safety_escalation BOOLEAN DEFAULT FALSE, -- True if distress >= 9 for 2 consecutive days
  consecutive_high_distress_days INTEGER DEFAULT 0,
  week_number INTEGER DEFAULT 1,               -- Study week (1-4)
  day_number INTEGER DEFAULT 1,                -- Day within week (1-5)
  check_in_date DATE DEFAULT CURRENT_DATE,     -- Exact date of check-in
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT check_in_submissions_user_id_check_in_date_key UNIQUE (user_id, check_in_date)
);

-- ================================================
-- TABLE: stampley_chat_sessions
-- Stampley chat transcript linked to a daily check-in (saved on Complete Check-in)
-- ================================================
CREATE TABLE IF NOT EXISTS stampley_chat_sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  check_in_submission_id TEXT REFERENCES check_in_submissions(id) ON DELETE CASCADE,
  domain TEXT,
  stress_level INTEGER,
  mood INTEGER,
  energy INTEGER,
  user_message_count INTEGER DEFAULT 0,
  assistant_message_count INTEGER DEFAULT 0,
  summary TEXT,
  messages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ================================================
-- TABLE: reflections
-- Stores additional reflections outside check-ins
-- ================================================
CREATE TABLE IF NOT EXISTS reflections (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ================================================
-- TABLE: password_reset_tokens
-- Handles forgot password flow
-- Tokens expire and are single-use
-- ================================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ================================================
-- TABLE: dds_responses
-- Baseline Diabetes Distress Scale (DDS17) per participant
-- One row per user (UNIQUE user_id); upserted by submitDDS
-- ================================================
CREATE TABLE IF NOT EXISTS dds_responses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  q1 INTEGER,
  q2 INTEGER,
  q3 INTEGER,
  q4 INTEGER,
  q5 INTEGER,
  q6 INTEGER,
  q7 INTEGER,
  q8 INTEGER,
  q9 INTEGER,
  q10 INTEGER,
  q11 INTEGER,
  q12 INTEGER,
  q13 INTEGER,
  q14 INTEGER,
  q15 INTEGER,
  q16 INTEGER,
  q17 INTEGER,
  emotional_score NUMERIC,
  physician_score NUMERIC,
  regimen_score NUMERIC,
  interpersonal_score NUMERIC,
  total_score NUMERIC,
  recommended_domain TEXT,
  confirmed_domain TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ================================================
-- TABLE: user_weekly_domains
-- Tracks which domain each user selected per week
-- One domain per user per week (UNIQUE constraint)
-- ================================================
CREATE TABLE IF NOT EXISTS user_weekly_domains (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  domain TEXT NOT NULL,
  started_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, week_number)
);

-- ================================================
-- TABLE: user_study_progress
-- Tracks overall study progress per participant
-- Used for: current week, streak, safety escalation
-- ================================================
CREATE TABLE IF NOT EXISTS user_study_progress (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  study_start_date DATE DEFAULT CURRENT_DATE,
  current_week INTEGER DEFAULT 1,              -- Current week (1-4)
  total_checkins INTEGER DEFAULT 0,            -- Total check-ins completed
  last_checkin_date DATE,                      -- Date of last check-in
  consecutive_high_distress_days INTEGER DEFAULT 0, -- For safety escalation
  updated_at TIMESTAMP DEFAULT NOW()
);