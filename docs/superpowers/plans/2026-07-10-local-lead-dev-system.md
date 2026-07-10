# Local Lead Development System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an isolated `/lead-dev` local customer development backend with Prisma SQLite, server auth, safe CSV, protected lead/draft review, and test-mode-only one-at-a-time email sending.

**Architecture:** The public company website remains unchanged. The new system lives under `/lead-dev` and `/api/lead-dev/*`, guarded by middleware and server-side auth helpers. Prisma stores leads, email drafts, logs, settings, and suppression entries; helper modules enforce CSV, SSRF, verification, approval, queue, and send safety rules.

**Tech Stack:** Next.js App Router, TypeScript, Prisma, SQLite, Nodemailer, Node built-in crypto, Node test runner.

## Global Constraints

- `TEST_MODE=true` by default.
- No real customer email may be sent in the current stage.
- All `/lead-dev` pages and `/api/lead-dev/*` APIs require server-side login.
- Existing public website pages, product pages, bilingual content, and `/api/contact` must not be broken.
- SMTP passwords, authorization codes, and admin passwords must never be committed or logged.
- Public website research must block localhost, private IPs, cloud metadata addresses, non-http protocols, oversized bodies, excessive redirects, and non-text responses.
- Local MVP sends at most one approved draft per click; no long-running full-queue HTTP request.

---

### Task 1: Prisma Persistence

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Modify: `package.json`
- Modify: `.env.example`
- Create: `src/features/lead-dev/lib/prisma.ts`

**Interfaces:**
- Produces Prisma models `Lead`, `EmailDraft`, `EmailLog`, `SystemSetting`, `SuppressionList`.
- Produces generated Prisma client consumed by all API routes.

- [ ] Add Prisma dependencies and scripts.
- [ ] Create schema matching the latest design.
- [ ] Seed ten initial leads with unverified contacts and default settings.
- [ ] Generate Prisma client.

### Task 2: Safety Utility Tests and Helpers

**Files:**
- Create: `scripts/lead-dev.test.mjs`
- Create: `src/features/lead-dev/lib/email-validation.ts`
- Create: `src/features/lead-dev/lib/csv.ts`
- Create: `src/features/lead-dev/lib/ssrf.ts`
- Create: `src/features/lead-dev/lib/draft-generator.ts`
- Create: `src/features/lead-dev/lib/sending-rules.ts`
- Modify: `package.json`

**Interfaces:**
- `isValidEmail(email: string): boolean`
- `parseLeadCsvPreview(input: string): CsvPreviewResult`
- `sanitizeCsvCell(value: string): string`
- `validatePublicResearchUrl(input: string): Promise<URL>`
- `generateFirstTouchDraft(input: DraftInput): DraftOutput`
- `canApproveDraft(input: ApprovalInput): ApprovalResult`
- `isWithinSendingWindow(date: Date): boolean`

- [ ] Write tests for validation, CSV formula protection, draft generation, contact verification, working hours, and SSRF host blocking.
- [ ] Implement minimal helpers to pass tests.

### Task 3: Authentication and Route Isolation

**Files:**
- Create: `src/features/lead-dev/lib/auth.ts`
- Create: `src/middleware.ts`
- Create: `src/app/lead-dev/login/page.tsx`
- Create: `src/app/api/lead-dev/auth/login/route.ts`
- Create: `src/app/api/lead-dev/auth/logout/route.ts`
- Create: `src/app/lead-dev/layout.tsx`
- Create or Modify: `src/app/robots.ts`

**Interfaces:**
- `requireLeadDevSession(): Promise<LeadDevSession>`
- `createSessionCookie(username: string): Promise<string>`
- `verifyPassword(password: string, hash: string): Promise<boolean>`

- [ ] Implement signed HttpOnly session cookie.
- [ ] Middleware redirects unauthenticated pages and returns `401` for unauthenticated APIs.
- [ ] Admin layout sets `noindex,nofollow` and provides navigation.
- [ ] Robots disallow `/lead-dev/` and `/api/lead-dev/`.

### Task 4: Lead Admin APIs and Pages

**Files:**
- Create: `src/app/lead-dev/page.tsx`
- Create: `src/app/lead-dev/leads/page.tsx`
- Create: `src/app/lead-dev/leads/[id]/page.tsx`
- Create: `src/app/api/lead-dev/leads/route.ts`
- Create: `src/app/api/lead-dev/leads/[id]/route.ts`
- Create: `src/app/api/lead-dev/leads/[id]/research/route.ts`
- Create: `src/app/api/lead-dev/leads/[id]/drafts/route.ts`
- Create: `src/app/api/lead-dev/drafts/[id]/route.ts`
- Create: `src/app/api/lead-dev/import/preview/route.ts`
- Create: `src/app/api/lead-dev/import/commit/route.ts`
- Create: `src/app/api/lead-dev/export/route.ts`

**Interfaces:**
- Pages render from Prisma server-side.
- APIs use `requireLeadDevSession`.

- [ ] Dashboard shows counts.
- [ ] Lead list supports search, filters, import preview form, and export link.
- [ ] Lead detail supports research result recording, contact verification, draft generation/editing, approve/reject/cancel, and do-not-contact.
- [ ] CSV import preview validates before commit and never creates drafts or sends email.

### Task 5: Queue, Suppression, and Test-Mode Send

**Files:**
- Create: `src/app/lead-dev/queue/page.tsx`
- Create: `src/app/lead-dev/follow-ups/page.tsx`
- Create: `src/app/lead-dev/suppression/page.tsx`
- Create: `src/app/api/lead-dev/queue/send-next/route.ts`
- Create: `src/app/api/lead-dev/settings/route.ts`
- Create: `src/app/api/lead-dev/suppression/route.ts`
- Create: `src/features/lead-dev/lib/send-mail.ts`

**Interfaces:**
- `sendNextApprovedDraft(): Promise<SendResult>` sends one approved draft only.

- [ ] Implement suppression list pages and APIs.
- [ ] Queue page shows approved drafts, test mode, quota, sending window, pause, stop-all, last send time.
- [ ] Send-next API enforces `APPROVED -> SENDING -> SENT/FAILED`, test recipient override, daily cap, working hours, 3-minute minimum interval, suppression, duplicate prevention, and verification checks.
- [ ] Follow-up center computes eligible leads and generates one follow-up draft.

### Task 6: Documentation and Verification

**Files:**
- Create: `docs/lead-dev/README.md`
- Create: `public/templates/lead-import-template.csv`
- Modify: `.env.example`

**Interfaces:**
- Operator can initialize DB, configure admin/test recipient, run locally, and test safely.

- [ ] Document database initialization.
- [ ] Document admin hash generation.
- [ ] Document `TEST_RECIPIENT` and `TEST_MODE=true`.
- [ ] Run `npm run test:lead-dev`, `npm run typecheck`, `npm run lint`, and `npm run build`.
