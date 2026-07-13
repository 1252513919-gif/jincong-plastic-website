"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LeadDevLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/lead-dev/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: form.get("username"),
          password: form.get("password")
        }),
        headers: { "content-type": "application/json" }
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(payload.error || "账号或密码错误");
        return;
      }
      router.replace("/lead-dev");
      router.refresh();
    } catch {
      setError("登录请求失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action="/api/lead-dev/auth/login" className="mt-8 space-y-4" method="post" onSubmit={submit}>
      <label className="block text-sm font-medium text-slate-700">
        管理员账号
        <input name="username" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400" autoComplete="username" required />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        密码
        <input name="password" type="password" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-sky-400" autoComplete="current-password" required />
      </label>
      {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={loading} className="w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? "登录中..." : "登录"}
      </button>
    </form>
  );
}
