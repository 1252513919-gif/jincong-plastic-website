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
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => post("/api/lead-dev/queue/send-next")} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50">
          发送下一封已批准邮件
        </button>
        <button onClick={() => post("/api/lead-dev/settings", { action: "pause" })} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50">暂停</button>
        <button onClick={() => post("/api/lead-dev/settings", { action: "resume" })} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50">恢复</button>
        <button onClick={() => post("/api/lead-dev/settings", { action: "stopAll" })} className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">立即停止全部发送</button>
      </div>
      {message && <p className="mt-3 rounded-xl bg-slate-100 p-3 text-sm text-slate-700">{message}</p>}
    </div>
  );
}

export function QueueDraftActions({ draftId, status }: { draftId: string; status: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pendingAction, setPendingAction] = useState<"approve" | "reject" | null>(null);
  const reviewButtonClass =
    "inline-flex h-10 min-w-[112px] items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-500";

  async function patch(action: "approve" | "reject") {
    setMessage("");
    setPendingAction(action);
    try {
      const response = await fetch(`/api/lead-dev/drafts/${draftId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action })
      });
      const payload = await response.json().catch(() => ({}));
      setMessage(response.ok ? payload.message || "操作完成" : payload.error || "操作失败");
      if (response.ok) router.refresh();
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      {status === "PENDING_REVIEW" && (
        <>
          <button
            type="button"
            disabled={pendingAction !== null}
            onClick={() => patch("approve")}
            className={reviewButtonClass}
          >
            {pendingAction === "approve" ? "审核中…" : "审核通过"}
          </button>
          <button
            type="button"
            disabled={pendingAction !== null}
            onClick={() => patch("reject")}
            className={reviewButtonClass}
          >
            {pendingAction === "reject" ? "审核中…" : "拒绝草稿"}
          </button>
        </>
      )}
      {status === "APPROVED" && <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">已批准，等待单封发送</span>}
      {message && <span className="text-sm text-slate-600">{message}</span>}
    </div>
  );
}
