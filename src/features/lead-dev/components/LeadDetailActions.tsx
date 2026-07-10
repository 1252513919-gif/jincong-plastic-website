"use client";

import { useState } from "react";

type LeadPayload = {
  id: string;
  publicEmail?: string | null;
  website?: string | null;
  sourceUrl?: string | null;
  productSummary?: string | null;
  potentialPlasticParts?: string | null;
  drafts: Array<{ id: string; status: string; subject: string; body: string }>;
};

export function LeadDetailActions({ lead }: { lead: LeadPayload }) {
  const [message, setMessage] = useState("");
  const [sourceUrl, setSourceUrl] = useState(lead.sourceUrl || lead.website || "");
  const [contactSourceUrl, setContactSourceUrl] = useState(lead.sourceUrl || lead.website || "");
  const latestPending = lead.drafts.find((draft) => ["DRAFT", "PENDING_REVIEW", "FAILED"].includes(draft.status));
  const [subject, setSubject] = useState(latestPending?.subject || "");
  const [body, setBody] = useState(latestPending?.body || "");

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

  async function patchDraft(id: string, body: Record<string, unknown>) {
    setMessage("");
    const response = await fetch(`/api/lead-dev/drafts/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    });
    const payload = await response.json().catch(() => ({}));
    setMessage(response.ok ? payload.message || "操作完成" : payload.error || "操作失败");
    if (response.ok) window.location.reload();
  }

  return (
    <aside className="space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-950">联系方式验证</h2>
        <input value={contactSourceUrl} onChange={(event) => setContactSourceUrl(event.target.value)} className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" placeholder="公开联系方式来源 URL" />
        <button onClick={() => post(`/api/lead-dev/leads/${lead.id}`, { action: "verifyContact", contactSourceUrl })} className="mt-3 rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white">
          标记邮箱 VERIFIED
        </button>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-950">官网研究</h2>
        <input value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" placeholder="官网或来源 URL" />
        <button onClick={() => post(`/api/lead-dev/leads/${lead.id}/research`, { sourceUrl })} className="mt-3 rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold">
          读取公开页面并记录摘要
        </button>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-950">草稿生成与审核</h2>
        <button onClick={() => post(`/api/lead-dev/leads/${lead.id}/drafts`, { type: "FIRST_TOUCH" })} className="mt-3 rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold">
          生成首封开发邮件草稿
        </button>
        {latestPending && (
          <div className="mt-4 space-y-3">
            <input value={subject} onChange={(event) => setSubject(event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
            <textarea value={body} onChange={(event) => setBody(event.target.value)} className="h-64 w-full rounded-2xl border border-slate-200 p-4 text-sm leading-6" />
            <button onClick={() => patchDraft(latestPending.id, { action: "submitReview", subject, body })} className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold">提交待审核</button>
            <button onClick={() => patchDraft(latestPending.id, { action: "approve" })} className="ml-2 rounded-full bg-sky-700 px-5 py-2 text-sm font-semibold text-white">批准</button>
            <button onClick={() => patchDraft(latestPending.id, { action: "reject" })} className="ml-2 rounded-full border border-red-200 px-5 py-2 text-sm font-semibold text-red-700">拒绝</button>
          </div>
        )}
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-950">停止联系</h2>
        <button onClick={() => post(`/api/lead-dev/leads/${lead.id}`, { action: "doNotContact" })} className="mt-3 rounded-full border border-red-200 px-5 py-2 text-sm font-semibold text-red-700">
          设为不再联系
        </button>
      </div>
      {message && <p className="rounded-2xl bg-slate-950 p-4 text-sm text-white">{message}</p>}
    </aside>
  );
}
