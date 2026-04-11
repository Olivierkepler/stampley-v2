export async function GET() {
  return Response.json({
    hasNextauthSecret: !!process.env.NEXTAUTH_SECRET,
    hasAuthSecret: !!process.env.AUTH_SECRET,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    nextauthUrl: process.env.NEXTAUTH_URL || null,
  })
}