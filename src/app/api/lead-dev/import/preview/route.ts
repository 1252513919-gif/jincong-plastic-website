import { parseLeadCsvPreview } from "@/features/lead-dev/lib/csv";
import { withLeadDevApi } from "@/features/lead-dev/lib/api";

export async function POST(request: Request) {
  return withLeadDevApi(async () => {
    const payload = (await request.json().catch(() => null)) as { csv?: string } | null;
    return Response.json(parseLeadCsvPreview(String(payload?.csv ?? "")));
  });
}
