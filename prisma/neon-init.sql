-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'RESEARCHED', 'CONTACTED', 'REPLIED', 'BOUNCED', 'REJECTED', 'DO_NOT_CONTACT');

-- CreateEnum
CREATE TYPE "EmailDraftType" AS ENUM ('FIRST_TOUCH', 'FOLLOW_UP');

-- CreateEnum
CREATE TYPE "EmailDraftStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'SENDING', 'SENT', 'FAILED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EmailLogStatus" AS ENUM ('SENT', 'FAILED', 'SKIPPED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ContactVerificationStatus" AS ENUM ('UNVERIFIED', 'VERIFIED', 'INVALID', 'STALE');

-- CreateEnum
CREATE TYPE "SuppressionType" AS ENUM ('EMAIL', 'DOMAIN');

-- CreateEnum
CREATE TYPE "SuppressionReason" AS ENUM ('UNSUBSCRIBE', 'REJECTED', 'BOUNCED', 'MANUAL');

-- CreateEnum
CREATE TYPE "FollowUpMethod" AS ENUM ('EMAIL', 'PHONE', 'WECHAT', 'VISIT', 'OTHER');

-- CreateEnum
CREATE TYPE "FollowUpRecordStatus" AS ENUM ('PLANNED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "region" TEXT,
    "industry" TEXT,
    "website" TEXT,
    "publicEmail" TEXT,
    "publicPhone" TEXT,
    "contactPerson" TEXT,
    "sourceUrl" TEXT,
    "priority" TEXT DEFAULT 'MEDIUM',
    "productCategory" TEXT,
    "productSummary" TEXT,
    "potentialPlasticParts" TEXT,
    "personalizationReason" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "contactVerifiedAt" TIMESTAMP(3),
    "contactVerificationStatus" "ContactVerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "contactSourceUrl" TEXT,
    "lastResearchAt" TIMESTAMP(3),
    "websiteSnapshot" TEXT,
    "lastContactedAt" TIMESTAMP(3),
    "followUpAt" TIMESTAMP(3),
    "followUpMethod" TEXT,
    "followUpStatus" TEXT,
    "followUpNote" TEXT,
    "repliedAt" TIMESTAMP(3),
    "hasFollowedUp" BOOLEAN NOT NULL DEFAULT false,
    "doNotContactReason" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailDraft" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "type" "EmailDraftType" NOT NULL,
    "recipient" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" "EmailDraftStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "idempotencyKey" TEXT NOT NULL,
    "approvedAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailDraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailLog" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "draftId" TEXT,
    "type" "EmailDraftType" NOT NULL,
    "intendedRecipient" TEXT NOT NULL,
    "actualRecipient" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" "EmailLogStatus" NOT NULL,
    "testMode" BOOLEAN NOT NULL,
    "smtpUser" TEXT,
    "errorMessage" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuppressionList" (
    "id" TEXT NOT NULL,
    "type" "SuppressionType" NOT NULL,
    "value" TEXT NOT NULL,
    "reason" "SuppressionReason" NOT NULL,
    "sourceLeadId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SuppressionList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowUpRecord" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "method" "FollowUpMethod" NOT NULL,
    "status" "FollowUpRecordStatus" NOT NULL DEFAULT 'PLANNED',
    "scheduledAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "note" TEXT,
    "nextAction" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FollowUpRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemSetting" (
    "id" TEXT NOT NULL DEFAULT 'lead-dev',
    "testMode" BOOLEAN NOT NULL DEFAULT true,
    "paused" BOOLEAN NOT NULL DEFAULT false,
    "stopAllSending" BOOLEAN NOT NULL DEFAULT false,
    "dailySendLimit" INTEGER NOT NULL DEFAULT 8,
    "minSendIntervalMinutes" INTEGER NOT NULL DEFAULT 3,
    "maxSendIntervalMinutes" INTEGER NOT NULL DEFAULT 8,
    "sendWindowStart" TEXT NOT NULL DEFAULT '09:00',
    "sendWindowEnd" TEXT NOT NULL DEFAULT '17:30',
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Shanghai',
    "lastSentAt" TIMESTAMP(3),
    "nextAllowedSendAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lead_companyName_idx" ON "Lead"("companyName");

-- CreateIndex
CREATE INDEX "Lead_publicEmail_idx" ON "Lead"("publicEmail");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_contactVerificationStatus_idx" ON "Lead"("contactVerificationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "EmailDraft_idempotencyKey_key" ON "EmailDraft"("idempotencyKey");

-- CreateIndex
CREATE INDEX "EmailDraft_leadId_idx" ON "EmailDraft"("leadId");

-- CreateIndex
CREATE INDEX "EmailDraft_status_idx" ON "EmailDraft"("status");

-- CreateIndex
CREATE UNIQUE INDEX "EmailDraft_leadId_type_version_key" ON "EmailDraft"("leadId", "type", "version");

-- CreateIndex
CREATE UNIQUE INDEX "EmailLog_idempotencyKey_key" ON "EmailLog"("idempotencyKey");

-- CreateIndex
CREATE INDEX "EmailLog_leadId_idx" ON "EmailLog"("leadId");

-- CreateIndex
CREATE INDEX "EmailLog_draftId_idx" ON "EmailLog"("draftId");

-- CreateIndex
CREATE INDEX "EmailLog_createdAt_idx" ON "EmailLog"("createdAt");

-- CreateIndex
CREATE INDEX "SuppressionList_value_idx" ON "SuppressionList"("value");

-- CreateIndex
CREATE UNIQUE INDEX "SuppressionList_type_value_key" ON "SuppressionList"("type", "value");

-- CreateIndex
CREATE INDEX "FollowUpRecord_leadId_idx" ON "FollowUpRecord"("leadId");

-- CreateIndex
CREATE INDEX "FollowUpRecord_status_idx" ON "FollowUpRecord"("status");

-- CreateIndex
CREATE INDEX "FollowUpRecord_scheduledAt_idx" ON "FollowUpRecord"("scheduledAt");

-- CreateIndex
CREATE INDEX "FollowUpRecord_createdAt_idx" ON "FollowUpRecord"("createdAt");

-- AddForeignKey
ALTER TABLE "EmailDraft" ADD CONSTRAINT "EmailDraft_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailLog" ADD CONSTRAINT "EmailLog_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailLog" ADD CONSTRAINT "EmailLog_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES "EmailDraft"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUpRecord" ADD CONSTRAINT "FollowUpRecord_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
