import { Pool } from "pg";

const globalForPg = globalThis as unknown as { pool?: Pool };

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
    ssl: connectionString.includes("rds.amazonaws.com")
      ? { rejectUnauthorized: false }
      : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
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