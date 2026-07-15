import { isValidEmail, normalizeEmail } from "./email-validation";

export const leadCsvColumns = [
  "companyName",
  "region",
  "industry",
  "sourceType",
  "website",
  "sourceUrl",
  "publicPhone",
  "contactPerson",
  "wechat",
  "publicEmail",
  "contactVerifiedAt",
  "contactStatus",
  "matchLevel",
  "productCategory",
  "notes"
] as const;

const legacyLeadCsvColumns = [
  "companyName",
  "region",
  "industry",
  "website",
  "publicEmail",
  "publicPhone",
  "contactPerson",
  "sourceUrl",
  "priority",
  "productCategory",
  "notes"
] as const;

export type LeadCsvColumn = (typeof leadCsvColumns)[number];
export type LeadCsvRow = Record<LeadCsvColumn, string>;

export type CsvPreviewResult = {
  validRows: LeadCsvRow[];
  errors: Array<{ row: number; message: string }>;
  duplicates: Array<{ row: number; companyName: string }>;
  invalidEmails: Array<{ row: number; email: string }>;
};

const maxCsvBytes = 1024 * 1024;
const maxRows = 1000;

export function sanitizeCsvCell(value: string) {
  const clean = value.replace(/^\uFEFF/, "").trim();
  return /^[=+\-@\t\r]/.test(clean) ? `'${clean}` : clean;
}

export function parseLeadCsvPreview(input: string): CsvPreviewResult {
  if (Buffer.byteLength(input, "utf8") > maxCsvBytes) {
    return emptyWithError("CSV 文件不能超过 1MB");
  }

  const lines = input.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) {
    return emptyWithError("CSV 内容为空");
  }

  if (lines.length - 1 > maxRows) {
    return emptyWithError("CSV 一次最多导入 1000 行");
  }

  const headers = splitCsvLine(lines[0]);
  const headerText = headers.join(",");
  const expected = leadCsvColumns.join(",");
  const legacyExpected = legacyLeadCsvColumns.join(",");
  if (headerText !== expected && headerText !== legacyExpected) {
    return emptyWithError(`CSV 列名不匹配，必须为：${expected}`);
  }

  const acceptedColumns = headerText === legacyExpected ? legacyLeadCsvColumns : leadCsvColumns;
  const result: CsvPreviewResult = { validRows: [], errors: [], duplicates: [], invalidEmails: [] };
  const seen = new Set<string>();

  lines.slice(1).forEach((line, index) => {
    const rowNumber = index + 2;
    const cells = splitCsvLine(line);
    if (cells.length !== acceptedColumns.length) {
      result.errors.push({ row: rowNumber, message: "列数不匹配" });
      return;
    }

    const row = Object.fromEntries(leadCsvColumns.map((column) => [column, ""])) as LeadCsvRow;
    acceptedColumns.forEach((column, cellIndex) => {
      const nextColumn = column === "priority" ? "matchLevel" : column;
      row[nextColumn as LeadCsvColumn] = sanitizeCsvCell(cells[cellIndex] ?? "");
    });

    if (!row.companyName) {
      result.errors.push({ row: rowNumber, message: "companyName 不能为空" });
      return;
    }

    const duplicateKey = [row.companyName, row.website, normalizeEmail(row.publicEmail)].join("|").toLowerCase();
    if (seen.has(duplicateKey)) {
      result.duplicates.push({ row: rowNumber, companyName: row.companyName });
      return;
    }
    seen.add(duplicateKey);

    if (row.publicEmail && !isValidEmail(row.publicEmail)) {
      result.invalidEmails.push({ row: rowNumber, email: row.publicEmail });
    }

    result.validRows.push(row);
  });

  return result;
}

export function toCsv(rows: Array<Record<string, unknown>>, columns: string[]) {
  const lines = [columns.join(",")];
  for (const row of rows) {
    lines.push(columns.map((column) => quoteCsv(sanitizeCsvCell(String(row[column] ?? "")))).join(","));
  }
  return lines.join("\n");
}

function emptyWithError(message: string): CsvPreviewResult {
  return { validRows: [], errors: [{ row: 0, message }], duplicates: [], invalidEmails: [] };
}

function quoteCsv(value: string) {
  return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function splitCsvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];
    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  cells.push(current);
  return cells;
}
