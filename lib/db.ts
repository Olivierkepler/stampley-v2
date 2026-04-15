import { Pool } from "pg";

const globalForPg = globalThis as unknown as { pool?: Pool };

/** TLS for managed Postgres (RDS, Neon, Supabase, etc.); off for typical local installs. */
function sslForConnectionString(connectionString: string) {
  const lower = connectionString.toLowerCase();
  if (lower.includes("localhost") || lower.includes("127.0.0.1")) {
    return false as const;
  }
  if (
    lower.includes("rds.amazonaws.com") ||
    lower.includes("sslmode=require") ||
    lower.includes("sslmode=no-verify")
  ) {
    return { rejectUnauthorized: false as const };
  }
  return false as const;
}

/**
 * Pool is created on first use so missing DATABASE_URL does not crash every
 * module that imports this file (e.g. NextAuth routes like /api/auth/error).
 */
export function getPool(): Pool {
  if (globalForPg.pool) return globalForPg.pool;

  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. In Amplify: Hosting → Environment variables."
    );
  }

  globalForPg.pool = new Pool({
    connectionString,
    ssl: sslForConnectionString(connectionString),
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 8000,
  });

  return globalForPg.pool;
}

export async function query(text: string, params?: unknown[]) {
  const client = await getPool().connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}