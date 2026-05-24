#!/usr/bin/env node
/**
 * Run a SQL migration file using DATABASE_URL.
 * Usage: node scripts/run-migration.mjs migrations/001_create_stampley_chat_sessions.sql
 */

import { readFileSync, existsSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"
import pg from "pg"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, "..")

function loadEnvFile(filename) {
  const path = resolve(root, filename)
  if (!existsSync(path)) return
  const content = readFileSync(path, "utf8")
  for (const line of content.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnvFile(".env.local")
loadEnvFile(".env")

const migrationPath = process.argv[2]
if (!migrationPath) {
  console.error("Usage: node scripts/run-migration.mjs <path-to.sql>")
  process.exit(1)
}

const connectionString = process.env.DATABASE_URL?.trim()
if (!connectionString) {
  console.error("DATABASE_URL is not set.")
  process.exit(1)
}

const sql = readFileSync(resolve(root, migrationPath), "utf8")

function sslForConnectionString(url) {
  const lower = url.toLowerCase()
  if (lower.includes("localhost") || lower.includes("127.0.0.1")) {
    return false
  }
  if (
    lower.includes("rds.amazonaws.com") ||
    lower.includes("sslmode=require") ||
    lower.includes("sslmode=no-verify")
  ) {
    return { rejectUnauthorized: false }
  }
  return false
}

const client = new pg.Client({
  connectionString,
  ssl: sslForConnectionString(connectionString),
})

try {
  await client.connect()
  await client.query(sql)
  console.log(`Applied migration: ${migrationPath}`)

  const desc = await client.query(`
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'stampley_chat_sessions'
    ORDER BY ordinal_position
  `)
  if (desc.rows.length === 0) {
    console.error("Verification failed: stampley_chat_sessions not found.")
    process.exit(1)
  }
  console.log("\nColumns in stampley_chat_sessions:")
  for (const row of desc.rows) {
    console.log(
      `  ${row.column_name} ${row.data_type} nullable=${row.is_nullable} default=${row.column_default ?? "—"}`
    )
  }
} catch (err) {
  console.error("Migration failed:", err)
  process.exit(1)
} finally {
  await client.end()
}
