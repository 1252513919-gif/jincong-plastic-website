"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function QueueActions() {
  const router = useRouter();
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
    if (response.ok) router.refresh();
  }

  return (
    <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm leading-6 text-slate-600">
        TEST_MODE=true 时，实际测试收件人会被替换为 TEST_RECIPIENT；如果 TEST_RECIPIENT 或 SMTP_PASS 仍是占位值，发送接口会拒绝发送。
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button onClick={() => post("/api/lead-dev/queue/send-next")} className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
          发送下一封已批准邮件
        </button>
        <button onClick={() => post("/api/lead-dev/settings", { action: "pause" })} className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold">暂停</button>
        <button onClick={() => post("/api/lead-dev/settings", { action: "resume" })} className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold">恢复</button>
        <button onClick={() => post("/api/lead-dev/settings", { action: "stopAll" })} className="rounded-full border border-red-200 px-5 py-3 text-sm font-semibold text-red-700">立即停止全部发送</button>
      </div>
      {message && <p className="mt-4 rounded-2xl bg-slate-950 p-4 text-sm text-white">{message}</p>}
    </div>
  );
}

export function QueueDraftActions({ draftId, status }: { draftId: string; status: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function patch(action: "approve" | "reject") {
    setMessage("");
    const response = await fetch(`/api/lead-dev/drafts/${draftId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action })
    });
    const payload = await response.json().catch(() => ({}));
    setMessage(response.ok ? payload.message || "操作完成" : payload.error || "操作失败");
    if (response.ok) router.refresh();
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      {status === "PENDING_REVIEW" && (
        <>
          <button onClick={() => patch("approve")} className="rounded-full bg-sky-700 px-5 py-2 text-sm font-semibold text-white">审核通过</button>
          <button onClick={() => patch("reject")} className="rounded-full border border-red-200 px-5 py-2 text-sm font-semibold text-red-700">拒绝草稿</button>
        </>
      )}
      {status === "APPROVED" && <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">已批准，等待单封发送</span>}
      {message && <span className="text-sm text-slate-600">{message}</span>}
    </div>
  );
}
