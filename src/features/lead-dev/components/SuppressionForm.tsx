"use client";

import { useState } from "react";

export function SuppressionForm() {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  async function add() {
    const response = await fetch("/api/lead-dev/suppression", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ value, reason: "MANUAL" })
    });
    const payload = await response.json().catch(() => ({}));
    setMessage(response.ok ? "已加入名单" : payload.error || "添加失败");
    if (response.ok) window.location.reload();
  }
  return (
    <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <input value={value} onChange={(event) => setValue(event.target.value)} placeholder="邮箱或域名" className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
      <button onClick={add} className="mt-3 rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white">加入拒绝联系名单</button>
      {message && <p className="mt-3 text-sm text-slate-600">{message}</p>}
    </div>
  );
}
