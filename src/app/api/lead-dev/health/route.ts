export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    ok: true,
    service: "lead-dev",
    TEST_MODE: process.env["TEST_MODE"] !== "false",
    checkedAt: new Date().toISOString()
  });
}
