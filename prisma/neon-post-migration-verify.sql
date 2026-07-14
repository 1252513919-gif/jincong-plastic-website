-- Read-only post-migration verification for Neon SQL Editor.
-- This script does not modify data.

SELECT 'Lead' AS table_name, COUNT(*) AS row_count FROM "Lead"
UNION ALL SELECT 'SystemSetting', COUNT(*) FROM "SystemSetting"
UNION ALL SELECT 'EmailDraft', COUNT(*) FROM "EmailDraft"
UNION ALL SELECT 'EmailLog', COUNT(*) FROM "EmailLog"
UNION ALL SELECT 'FollowUpRecord', COUNT(*) FROM "FollowUpRecord"
UNION ALL SELECT 'SuppressionList', COUNT(*) FROM "SuppressionList";

SELECT 'duplicate Lead ids' AS check_name, COUNT(*) AS issue_count
FROM (
  SELECT "id"
  FROM "Lead"
  GROUP BY "id"
  HAVING COUNT(*) > 1
) duplicates
UNION ALL
SELECT 'duplicate EmailDraft ids', COUNT(*)
FROM (
  SELECT "id"
  FROM "EmailDraft"
  GROUP BY "id"
  HAVING COUNT(*) > 1
) duplicates
UNION ALL
SELECT 'duplicate EmailLog ids', COUNT(*)
FROM (
  SELECT "id"
  FROM "EmailLog"
  GROUP BY "id"
  HAVING COUNT(*) > 1
) duplicates
UNION ALL
SELECT 'duplicate FollowUpRecord ids', COUNT(*)
FROM (
  SELECT "id"
  FROM "FollowUpRecord"
  GROUP BY "id"
  HAVING COUNT(*) > 1
) duplicates;

SELECT 'orphan EmailDraft.leadId' AS check_name, COUNT(*) AS issue_count
FROM "EmailDraft" d
LEFT JOIN "Lead" l ON l."id" = d."leadId"
WHERE l."id" IS NULL
UNION ALL
SELECT 'orphan EmailLog.leadId', COUNT(*)
FROM "EmailLog" e
LEFT JOIN "Lead" l ON l."id" = e."leadId"
WHERE l."id" IS NULL
UNION ALL
SELECT 'orphan EmailLog.draftId', COUNT(*)
FROM "EmailLog" e
LEFT JOIN "EmailDraft" d ON d."id" = e."draftId"
WHERE e."draftId" IS NOT NULL AND d."id" IS NULL
UNION ALL
SELECT 'orphan FollowUpRecord.leadId', COUNT(*)
FROM "FollowUpRecord" f
LEFT JOIN "Lead" l ON l."id" = f."leadId"
WHERE l."id" IS NULL;

SELECT "id", "testMode", "paused", "stopAllSending"
FROM "SystemSetting"
WHERE "id" = 'lead-dev';

SELECT "id"
FROM "Lead"
ORDER BY "id";
