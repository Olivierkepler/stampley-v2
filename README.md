This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

-----------------------authentification steps---------------------------


Create the Next.js Project
    In your terminal run:
        bashnpx create-next-app@latest stampley-v2
        When prompted select:
        TypeScript:          Yes
        ESLint:              Yes
        Tailwind CSS:        Yes
        src/ directory:      No
        App Router:          Yes
        Turbopack:           No  ← important, select No
        Import alias:        Yes (default @/*)

    Next.js project created! ✅ Now install the dependencies we need:
        npm install next-auth@beta pg bcryptjs
        npm install --save-dev @types/pg @types/bcryptjs


Now let's set up the project structure. Run these commands:
        bashmkdir -p lib actions app/api/auth/\[...nextauth\]
        touch lib/db.ts lib/auth.config.ts lib/auth.ts
        touch app/api/auth/\[...nextauth\]/route.ts
        touch .env.local
        touch middleware.ts


Now generate your AUTH_SECRET:
        bashopenssl rand -base64 32

Fill in your .env.local with this — replace the placeholders with your actual values:
        bash# Database - we'll set up new RDS in next step
        DATABASE_URL="postgresql://postgres:YOURPASSWORD@your-rds-endpoint:5432/stampley_db"

        # Auth
        AUTH_SECRET="YOUR_GENERATED_SECRET_HERE"
        NEXTAUTH_URL="http://localhost:3000"

        # Node
        NODE_ENV="development"




create the database schema. Create a new file lib/schema.sql:
sqlCREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE user_role AS ENUM ('ADMIN', 'PARTICIPANT');

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'PARTICIPANT',
  study_id TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS study_keys (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  key TEXT UNIQUE NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  created_by TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS check_in_submissions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  subscale TEXT NOT NULL,
  distress INTEGER NOT NULL,
  mood INTEGER,
  energy INTEGER,
  reflection TEXT,
  coping_action TEXT,
  context_tags JSONB DEFAULT '[]',
  needs_safety_escalation BOOLEAN DEFAULT FALSE,
  consecutive_high_distress_days INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reflections (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);




AWS RDS Setup Guide — Stampley V3

Step 1: Go to AWS RDS
👉 https://us-east-2.console.aws.amazon.com/rds/home?region=us-east-2#launch-dbinstance:

Step 2: Create Database Settings
Engine options
    Creation method:    Standard create
    Engine:             PostgreSQL
    Version:            PostgreSQL 16.x
    Creation method:    Full configuration
Templates
    Template:           Free tier
    Availability:       Single-AZ DB instance deployment (1 instance)
Settings
    Engine version:     PostgreSQL 16.13-R1
    DB instance ID:     stampley-v3-db
    Master username:    postgres
    Credentials:        Self managed
    Authentication:     Password authentication
    Master password:    [create a strong one, write it down]
Instance Configuration
    DB instance class:  Burstable classes (includes t classes)
    Instance type:      db.t4g.micro
Storage
    Storage type:       General Purpose SSD (gp2)
    Allocated storage:  20 GiB
Additional storage configuration
    Storage autoscaling: ☐ unchecked
Connectivity
    Compute resource:   Don't connect to an EC2 compute resource
    Network type:       IPv4
    VPC:                Default VPC (vpc-0833007bf0d76f553)
    DB subnet group:    default-vpc-0833007bf0d76f553
    Public access:      YES
    Security group:     Create new
    New VPC Security group name: stampley-v3-sg
    Availability Zone:  No preference
    RDS Proxy:          ☐ unchecked
    Certificate:        rds-ca-rsa2048-g1 (default)
    Database port:      5432
Monitoring
    Database Insights:  Standard
    Performance Insights: ☑ enabled
    Retention period:   7 days
    AWS KMS key:        (default) aws/rds

Additional Configuration
    Initial database name: stampley_db3
    DB parameter group:    default.postgres16
    Automated backup:      ☑ enabled
    Backup retention:      1 day
    Backup window:         No preference
    Copy tags to snapshots: ☑ enabled
    Backup replication:    ☐ disabled
    Encryption:            ☑ enabled
    AWS KMS key:           (default) aws/rds
    Auto minor upgrade:    ☑ enabled
    Maintenance window:    No preference
    Deletion protection:   ☐ unchecked






Get Your Database Connection String
        Step 1: Find your endpoint

            Go to RDS → Databases → stampley-v3-db
            Click the "Connectivity & security" tab
            Under "Connection steps" find this line:

            export RDSHOST="stampley-v3-db.cvugs2cu0xyt.us-east-2.rds.amazonaws.com"
            Copy the value inside the quotes — that's your endpoint.

        Step 2: Build your DATABASE_URL
            Replace the placeholders with your actual values:
            postgresql://postgres:YOURPASSWORD@YOUR_ENDPOINT:5432/stampley_db3
            Example:
            postgresql://postgres:MyStr0ngP@ss!@stampley-v3-db.cvugs2cu0xyt.us-east-2.rds.amazonaws.com:5432/stampley_db3

        Step 3: Add it to .env.local
            bashDATABASE_URL="postgresql://postgres:YOURPASSWORD@stampley-v3-db.cvugs2cu0xyt.us-east-2.rds.amazonaws.com:5432/stampley_db3"
            AUTH_SECRET="your-generated-secret"
            NEXTAUTH_URL="http://localhost:3000"


Step 2: Add security group rules
    Go to EC2 → Security Groups → stampley-v3-sg → Edit inbound rules
    Get your current IP first:
    bashcurl ifconfig.me
Then add:
    Rule 1: PostgreSQL  5432  YOUR_IP/32   ← your local IP
    Rule 2: PostgreSQL  5432  0.0.0.0/0   ← for Amplify

Step 3: Test connection
    bashpsql -h stampley-v3-db.cvugs2cu0xyt.us-east-2.rds.amazonaws.com -U postgres -d stampley_db3

Step 4: Run the schema
    Once connected, paste the contents of lib/schema.sql to create all tables.




Now run the schema to create all tables. Copy and paste this entire block into your psql prompt:

-- ================================================
-- AIDES-T2D / Stampley V2 — Complete Database Schema
-- Database: stampley_db3
-- Last updated: April 11, 2026
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
  day_number INTEGER DEFAULT 1,                -- Day within week (1-7)
  check_in_date DATE DEFAULT CURRENT_DATE,     -- Exact date of check-in
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
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
After pasting, verify tables were created:
sql\dt

Type \q to exit psql


Now update your .env.local
Open .env.local and make sure it has:
bashDATABASE_URL="postgresql://postgres:YOURPASSWORD@stampley-v3-db.cvugs2cu0xyt.us-east-2.rds.amazonaws.com:5432/stampley_db3"
AUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"
Replace YOURPASSWORD with your actual RDS password.

Test the connection locally
bashnpm run dev
Then visit:
http://localhost:3000/api/auth/providers
It should return:
json{"credentials":{"id":"credentials","name":"Credentials","type":"credentials"}}
Does your dev server start without errors?




amplify.yml:

version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci --cache .npm --prefer-offline
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - .next/cache/**/*
      - .npm/**/*