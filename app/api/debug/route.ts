export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  return Response.json({
    hasAuthSecret: !!process.env.AUTH_SECRET,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV,
    authSecretLength: process.env.AUTH_SECRET?.length ?? 0,
  })
}
