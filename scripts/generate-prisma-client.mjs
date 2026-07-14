import { spawnSync } from "node:child_process";

const command = process.platform === "win32" ? "npx.cmd" : "npx";
const schemaArgs = process.env.DATABASE_URL_UNPOOLED
  ? ["prisma", "generate", "--schema", "prisma/schema.postgres.prisma"]
  : ["prisma", "generate"];

const result = spawnSync(command, schemaArgs, {
  stdio: "inherit",
  shell: false
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
