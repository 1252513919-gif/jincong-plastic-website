"use client";

import { useState } from "react";

export function QueueActions() {
  const [message, setMessage] = useState("");

  async function post(path: string, body: Record<string, unknown> = {}) {
    setMessage("");
    const response = await fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    });
    const payload = await response.json().catch(() => ({}));
    setMessage(response.ok ? payload.message || "操作完成" : payload.error || "操作失败");
    if (response.ok) window.location.reload();
  }

  return (
    <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap gap-3">
        <button onClick={() => post("/api/lead-dev/queue/send-next")} className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">发送下一封已批准邮件</button>
        <button onClick={() => post("/api/lead-dev/settings", { action: "pause" })} className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold">暂停</button>
        <button onClick={() => post("/api/lead-dev/settings", { action: "resume" })} className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold">恢复</button>
        <button onClick={() => post("/api/lead-dev/settings", { action: "stopAll" })} className="rounded-full border border-red-200 px-5 py-3 text-sm font-semibold text-red-700">立即停止全部发送</button>
      </div>
      {message && <p className="mt-4 rounded-2xl bg-slate-950 p-4 text-sm text-white">{message}</p>}
    </div>
  );
}
