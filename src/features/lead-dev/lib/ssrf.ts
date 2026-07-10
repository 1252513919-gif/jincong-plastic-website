import dns from "node:dns/promises";
import net from "node:net";

const allowedProtocols = new Set(["http:", "https:"]);
const blockedHostnames = new Set(["localhost", "localhost.localdomain"]);

export async function validatePublicResearchUrl(input: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new Error("URL 格式不正确");
  }

  if (!allowedProtocols.has(url.protocol)) {
    throw new Error("只允许 http 或 https 协议");
  }

  const hostname = url.hostname.toLowerCase();
  if (blockedHostnames.has(hostname) || hostname.endsWith(".localhost")) {
    throw new Error("不允许访问 localhost");
  }

  if (isBlockedIp(hostname)) {
    throw new Error("不允许访问内网或本机地址");
  }

  const addresses = await resolveHost(hostname);
  if (addresses.some((address) => isBlockedIp(address))) {
    throw new Error("不允许访问解析到内网的地址");
  }

  return url;
}

export async function fetchPublicText(urlInput: string, redirectCount = 0): Promise<{ finalUrl: string; text: string; contentType: string }> {
  if (redirectCount > 3) throw new Error("重定向次数过多");
  const url = await validatePublicResearchUrl(urlInput);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "manual",
      headers: {
        "user-agent": "JincongLeadDev/1.0"
      }
    });

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) throw new Error("重定向缺少 Location");
      return fetchPublicText(new URL(location, url).toString(), redirectCount + 1);
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType && !/^text\/(html|plain)\b/i.test(contentType)) {
      throw new Error("只允许 HTML 或纯文本响应");
    }

    const reader = response.body?.getReader();
    if (!reader) return { finalUrl: url.toString(), text: "", contentType };

    const chunks: Uint8Array[] = [];
    let total = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.length;
      if (total > 1024 * 1024) throw new Error("响应体超过 1MB");
      chunks.push(value);
    }

    const buffer = Buffer.concat(chunks);
    return { finalUrl: url.toString(), text: buffer.toString("utf8"), contentType };
  } finally {
    clearTimeout(timer);
  }
}

export function extractReadableText(input: string) {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 4000);
}

function isBlockedIp(value: string) {
  if (value === "169.254.169.254") return true;
  const ipVersion = net.isIP(value);
  if (ipVersion === 4) {
    const parts = value.split(".").map(Number);
    const [a, b] = parts;
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 169 && b === 254) ||
      a >= 224
    );
  }
  if (ipVersion === 6) {
    const normalized = value.toLowerCase();
    return normalized === "::1" || normalized.startsWith("fc") || normalized.startsWith("fd") || normalized.startsWith("fe80:");
  }
  return false;
}

async function resolveHost(hostname: string) {
  try {
    const records = await dns.lookup(hostname, { all: true, verbatim: true });
    return records.map((record) => record.address);
  } catch {
    return [];
  }
}
