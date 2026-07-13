# Lead Development Production Preparation

This document describes the production preparation state for the local lead development system. Do not place real passwords, SMTP authorization codes, database URLs, session secrets, or admin passwords in this file.

## Current Safety Posture

- Keep `TEST_MODE=true` during first production deployment and online acceptance.
- Do not approve or send any real-company draft during deployment preparation.
- Do not delete the local SQLite database; it remains the verified local backup source.
- Do not commit `.env.local`, database files, local backups, or export files.

## Local Backup

Local SQLite and JSON exports are stored under `.local-backups/lead-dev-<timestamp>/`.

The backup contains:

- `dev.db`
- `Lead.json`
- `EmailDraft.json`
- `EmailLog.json`
- `SuppressionList.json`
- `SystemSetting.json`
- `backup-summary.json`

The `.local-backups/` folder is ignored by Git.

## PostgreSQL Preparation

The active local schema remains `prisma/schema.prisma` with SQLite so local verification can keep running before a production database exists.

The production-ready schema is:

```text
prisma/schema.postgres.prisma
```

Production setup sequence after you create the PostgreSQL database:

```bash
npm run db:push:postgres
npm run lead-dev:migrate:postgres:dry-run
npm run lead-dev:migrate:postgres
```

Required environment variable for migration:

```text
POSTGRES_DATABASE_URL
```

The migration script is:

```text
scripts/migrate-lead-dev-sqlite-to-postgres.ts
```

It preserves:

- Lead IDs
- Lead lifecycle status
- Contact verification status
- DO_NOT_CONTACT state
- Draft status
- Email logs
- Follow-up task fields
- Timestamp fields
- Unique constraints and idempotency keys

It is idempotent through PostgreSQL `ON CONFLICT` clauses.

## Production Environment Variables

Configure these in the deployment platform only:

```text
DATABASE_URL
POSTGRES_DATABASE_URL
TEST_MODE
TEST_RECIPIENT
SMTP_HOST
SMTP_PORT
SMTP_SECURE
SMTP_USER
SMTP_PASS
FROM_NAME
FROM_EMAIL
MAIL_TO
COMPANY_WEBSITE
LEAD_DEV_ADMIN_USERNAME
LEAD_DEV_ADMIN_PASSWORD_HASH
LEAD_DEV_SESSION_SECRET
```

Production requirements:

- `TEST_MODE` must remain `true` for first online acceptance.
- Generate a new strong production admin password and hash it with `npm run lead-dev:hash-password`.
- Do not use the local admin password in production.
- Generate a new high-entropy `LEAD_DEV_SESSION_SECRET`.
- Do not reuse any local or screenshot-exposed secret.
- Configure SMTP authorization only through encrypted environment variables.

## Online Acceptance Plan

With `TEST_MODE=true`:

1. Open the public website homepage.
2. Open `/lead-dev/login`.
3. Log in with the new production admin account.
4. Confirm the 10 real leads are present.
5. Confirm lead detail, queue, and follow-up pages load.
6. Create one online acceptance test lead.
7. Generate one draft.
8. Approve and send only that one draft to `TEST_RECIPIENT`.
9. Confirm one unique send log.
10. Archive the online acceptance test lead.
11. Keep `TEST_MODE=true`.

## Deployment Blockers Before Real Sending

Before any real customer email:

- Confirm PostgreSQL backups are configured.
- Confirm the suppression list is migrated.
- Confirm `DO_NOT_CONTACT` and `UNVERIFIED` blocks work on production.
- Confirm TEST_MODE recipient replacement works on production.
- Review rate limits and daily send limits.
- Confirm logs do not expose secrets.
- Get explicit approval before setting `TEST_MODE=false`.
