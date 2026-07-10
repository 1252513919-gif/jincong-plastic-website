# Local Lead Development System Design

## Context

The existing project is a Next.js App Router website for Xingtai Jincong Rubber & Plastic Co., Ltd. It already has public marketing pages, product pages, bilingual content, and contact inquiry API routes. The customer development system must be isolated from the public website so that the company website remains stable and the outreach workflow can be reviewed before any real sending.

This design chooses a local-first implementation using SQLite and Prisma. It is intended for safe local use first, with a future migration path to PostgreSQL for Vercel or a server deployment.

## Goals

- Import potential manufacturing customer leads from CSV.
- Store company, region, industry, website, public contact information, product category, priority, research findings, draft emails, send history, and follow-up status.
- Fetch public website pages only when the user requests research, then extract visible product clues and possible plastic parts needs.
- Generate a unique Chinese cooperation email for each lead based on public information and stored lead context.
- Require every email to pass through `PENDING_REVIEW` and manual approval before sending.
- Enforce conservative sending rules: test mode by default, one recipient per email, no BCC campaigns, daily cap of 8, randomized interval between queued emails, no duplicate email sends, no invalid email sends, and one follow-up only after 5 working days without reply.
- Stop outreach after reply, bounce, rejection, unsubscribe, or do-not-contact marking.
- Provide a local admin interface with dashboard, lead list, lead detail, send queue, and follow-up center.

## Non-Goals

- No unsupervised bulk email sending.
- No CAPTCHA bypassing.
- No automated third-party form submission.
- No scraping private pages or pages blocked by normal public access.
- No claim that a prospect has an active purchasing requirement unless it is explicitly present in public material.
- No automatic reply detection from the mailbox in the first version. Replies, bounces, rejections, and unsubscribe requests will be manually recorded in the admin UI.
- No production SMTP sending until the user reviews the UI, test mode, and sending rules.

## Recommended Architecture

### Route Isolation

The system will live under `/lead-dev`.

- `/lead-dev`: dashboard
- `/lead-dev/leads`: lead list, filters, CSV import, CSV export
- `/lead-dev/leads/[id]`: lead detail, website research summary, matched plastic parts, email draft, approval controls
- `/lead-dev/queue`: approved email queue, daily quota, pause and stop controls
- `/lead-dev/follow-ups`: leads eligible for one follow-up

All backend endpoints will live under `/api/lead-dev/*` and will not reuse the public inquiry API.

### Directory Structure

- `prisma/schema.prisma`: Prisma schema for SQLite.
- `prisma/seed.ts`: initial ten companies and sample test data.
- `src/app/lead-dev/*`: admin pages.
- `src/app/api/lead-dev/*`: local admin API routes.
- `src/features/lead-dev/components/*`: admin UI components.
- `src/features/lead-dev/lib/*`: validation, status transitions, CSV parsing, research extraction, draft generation, sending rules, email transport, and date helpers.
- `src/features/lead-dev/data/*`: seed constants, email template rules, product-part mapping rules.
- `docs/lead-dev/README.md`: operator instructions.
- `.env.example`: extended with SMTP, test mode, and database variables.
- `public/templates/lead-import-template.csv`: CSV template for imports.

## Data Model

### Lead

Required fields:

- `id`
- `companyName`
- `region`
- `industry`
- `website`
- `publicEmail`
- `publicPhone`
- `contactPerson`
- `sourceUrl`
- `priority`
- `productSummary`
- `potentialPlasticParts`
- `personalizationReason`
- `emailSubject`
- `emailBody`
- `status`
- `lastContactedAt`
- `followUpAt`
- `repliedAt`
- `notes`
- `createdAt`
- `updatedAt`

Additional fields for safe operation:

- `hasFollowedUp`: prevents more than one follow-up.
- `doNotContactReason`: records unsubscribe, rejection, bounce, or manual block reason.
- `lastResearchAt`: records when the public website was last researched.
- `websiteSnapshot`: stores a concise text snapshot of the public page used for personalization.
- `emailHash`: helps detect duplicate body sends.

### LeadStatus

The status enum will include:

- `NEW`
- `RESEARCHED`
- `DRAFTED`
- `PENDING_REVIEW`
- `APPROVED`
- `SENT`
- `REPLIED`
- `FOLLOW_UP_DUE`
- `FOLLOWED_UP`
- `BOUNCED`
- `REJECTED`
- `DO_NOT_CONTACT`

### EmailLog

Email logs will store:

- `id`
- `leadId`
- `type`: `FIRST_TOUCH` or `FOLLOW_UP`
- `recipient`
- `actualRecipient`
- `subject`
- `body`
- `status`: `QUEUED`, `SENT`, `FAILED`, `SKIPPED`, `CANCELLED`
- `testMode`
- `smtpUser`
- `errorMessage`
- `sentAt`
- `createdAt`

The SMTP password or authorization code is never stored.

### SystemSetting

Settings will store:

- `testMode`: default `true`.
- `paused`: default `false`.
- `stopAllSending`: default `false`.
- `dailySendLimit`: default `8`.
- `minSendIntervalMinutes`: default `3`.
- `maxSendIntervalMinutes`: default `8`.
- `lastQueueRunAt`.

## CSV Import and Export

The CSV importer will accept these columns:

- `companyName`
- `region`
- `industry`
- `website`
- `publicEmail`
- `publicPhone`
- `contactPerson`
- `sourceUrl`
- `priority`
- `productCategory`
- `notes`

Import rules:

- `companyName` is required.
- Duplicate detection uses normalized `companyName`, `website`, and `publicEmail`.
- Invalid email formats are stored but flagged and cannot be sent.
- Missing public email is allowed because the lead may still be researched, but sending is blocked until a valid email is provided.
- Import results show created, skipped duplicate, and invalid row counts.

Export rules:

- Export includes lead fields, status, notes, research summary, email subject, last contact time, and follow-up time.
- Email logs are exported separately to keep audit history clear.

## Public Website Research

Research is user-triggered per lead. The API will fetch the public website homepage or `sourceUrl`, extract readable text, and limit stored text to a concise snapshot.

Extraction rules:

- Do not log in.
- Do not bypass CAPTCHA.
- Do not submit forms.
- Do not crawl aggressively.
- Use a normal request timeout.
- Store failures as notes without blocking manual editing.

The first version will use deterministic extraction and rule-based summarization rather than an external AI API. It will search public text for industry/product clues such as children vehicles, electronics, furniture, pet products, automotive parts, hardware, housings, plugs, caps, clips, washers, and accessories. This keeps the system deployable without secret AI keys.

## Email Draft Generation

Draft generation is deterministic and template-based with lead-specific insertion. It uses:

- Company name.
- Public product summary.
- Industry and region.
- Potential plastic parts matched from rules.
- Jincong capability statements.
- Company website.

The draft body must include:

1. Target company name.
2. Specific products from public website or imported lead context.
3. One to three possible plastic parts.
4. Jincong capabilities: drawing-based customization, sample-based customization, injection molding, sample trial, small batch, and batch production.
5. Website: `https://www.jincongplastic.com`.
6. Request to forward to purchasing, production, or product development if the reader is not responsible.
7. Simple opt-out sentence.

Draft limits:

- First email body: 250 to 400 Chinese characters where practical.
- Natural and professional tone.
- No unsupported claims about equipment, certifications, customer cases, factory scale, price guarantees, or guaranteed lead time.
- Drafts are never sent directly after generation; they enter `PENDING_REVIEW`.

## Sending Workflow

### First Email

Allowed transition:

`NEW` or `RESEARCHED` -> `DRAFTED` -> `PENDING_REVIEW` -> `APPROVED` -> `SENT`

Before approval, the detail page displays:

- Recipient.
- Subject.
- Body.
- Public matching basis.
- Test mode destination.
- Current daily quota.

Before sending, the server revalidates:

- Lead status is `APPROVED`.
- Sending is not paused.
- Stop-all-sending is not enabled.
- Email format is valid.
- Same email was not previously sent.
- Lead is not replied, bounced, rejected, or do-not-contact.
- Daily limit is not exceeded.
- In test mode, actual recipient is `TEST_RECIPIENT`.

### Follow-Up

Follow-up eligibility:

- Lead status is `SENT`.
- No `repliedAt`.
- Not bounced, rejected, or do-not-contact.
- `hasFollowedUp` is false.
- At least 5 working days have passed since `lastContactedAt`.

Follow-up generation creates one reviewable draft and sends only after approval. After sending, the lead becomes `FOLLOWED_UP`.

### Stop Conditions

The UI can mark a lead as:

- `REPLIED`
- `BOUNCED`
- `REJECTED`
- `DO_NOT_CONTACT`

Any of those statuses blocks future queue sending.

## Email Transport

Nodemailer will send email through environment variables:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `FROM_NAME`
- `FROM_EMAIL`
- `COMPANY_WEBSITE`
- `TEST_RECIPIENT`
- `TEST_MODE`
- `DATABASE_URL`

Default local `.env` values:

- `TEST_MODE=true`
- `DATABASE_URL=file:./dev.db`
- `FROM_NAME=邢台锦聪橡塑有限公司`
- `COMPANY_WEBSITE=https://www.jincongplastic.com`

In test mode, all email is sent only to `TEST_RECIPIENT`, while the original public email is shown in the log as the intended recipient.

## Safety and Compliance Rules

- No BCC sending.
- One email per recipient per send action.
- Daily cap is 8.
- Random interval between queue sends is 3 to 8 minutes.
- The first version will not run a background always-on scheduler. The queue page will provide a guarded “send next approved email” action and a “run safe queue” action that respects interval and quota.
- “Stop all sending” immediately blocks future sends at the API level.
- Logs never include SMTP password, tokens, or authorization codes.
- Failed sends keep the draft and form data intact.
- Invalid recipient emails are blocked before SMTP.
- Duplicate public emails are blocked before approval and before send.

## Admin Pages

### Dashboard

Cards:

- Total leads.
- Pending research.
- Pending review.
- Sent today.
- Replied.
- Follow-up due.
- Bounced.

### Lead List

Features:

- Search by company name.
- Filter by region, industry, priority, and status.
- Duplicate warning.
- CSV import.
- CSV export.
- Quick status badge.

### Lead Detail

Sections:

- Company and source information.
- Website research summary.
- Potential plastic parts.
- Personalization reason.
- Email draft editor.
- Approval, rejection, and do-not-contact actions.
- Email log timeline.

### Send Queue

Sections:

- Approved emails.
- Test mode banner.
- Daily quota.
- Pause/resume.
- Stop all sending.
- Send next approved email.
- Queue log.

### Follow-Up Center

Sections:

- Leads eligible after 5 working days.
- Generate follow-up draft.
- Review before approval.
- One follow-up maximum warning.

## Initial Seed Leads

The seed file will include these companies with `status=NEW` and `notes` indicating that contact details must be revalidated before sending:

1. 河北恒驰自行车零件集团有限公司
2. 河北贝儿佳儿童用品有限公司
3. 河北红思达车业有限公司
4. 河北库比车业有限公司
5. 河北盛马电子科技有限公司
6. 河北蓝鸟家具股份有限公司
7. 荣喜宠物食品有限公司
8. 邢台诺德宠物用品有限公司
9. 河北酷贝宠物用品有限公司
10. 清河县利国汽车配件有限公司

## Testing Strategy

Automated checks:

- Unit tests for email validation, duplicate detection, status transitions, working-day calculation, and test-mode recipient override.
- Unit tests for draft generation to ensure company name, product summary, plastic parts, website, forwarding request, and opt-out text are included.
- Unit tests for send guard rules: no invalid email, no duplicate email, no unapproved send, no do-not-contact send, no quota bypass, no non-test recipient in test mode.
- Typecheck with `npm run typecheck`.
- Lint with `npm run lint`.
- Build with `npm run build`.

Manual local checks:

- Import CSV template.
- Open each admin page.
- Generate draft for a seeded lead.
- Edit and approve a draft.
- Confirm queue shows test mode and intended recipient.
- Send only to `TEST_RECIPIENT`.
- Mark reply, bounce, rejection, and do-not-contact and confirm future sends are blocked.

## Deployment Path

Local first:

- SQLite database through `DATABASE_URL=file:./dev.db`.
- Run Prisma migration locally.
- Use `TEST_MODE=true`.

Future Vercel or server:

- Replace SQLite with PostgreSQL.
- Set `DATABASE_URL` to PostgreSQL.
- Keep `TEST_MODE=true` until reviewed.
- Add SMTP environment variables in hosting provider.
- Use the same `/lead-dev` routes.

## Acceptance Criteria

- The public website pages continue to work.
- The lead development system is reachable only under `/lead-dev`.
- CSV import creates leads and avoids duplicates.
- Seed leads are present.
- Research stores a public summary without private scraping.
- Draft generation creates per-lead Chinese emails and never sends automatically.
- Every outbound email requires approval.
- Test mode is on by default and forces sends to `TEST_RECIPIENT`.
- The queue respects daily cap, duplicate prevention, stop-all, pause, and status blocks.
- Follow-up appears only after 5 working days and only once per company.
- Logs record send attempts without exposing SMTP secrets.
- README, `.env.example`, CSV template, and tests are included.
