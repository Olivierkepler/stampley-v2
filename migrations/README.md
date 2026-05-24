# Database migrations

Apply a migration with `psql` (recommended):

```bash
psql "$DATABASE_URL" -f migrations/001_create_stampley_chat_sessions.sql
```

Verify:

```bash
psql "$DATABASE_URL" -c '\d stampley_chat_sessions'
```

Or use the project script (loads `.env.local` / `.env` if present):

```bash
node scripts/run-migration.mjs migrations/001_create_stampley_chat_sessions.sql
```
