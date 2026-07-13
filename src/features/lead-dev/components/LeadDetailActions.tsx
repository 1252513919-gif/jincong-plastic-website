"use client";

import { useState } from "react";

type LeadPayload = {
  id: string;
  companyName: string;
  region?: string | null;
  industry?: string | null;
  website?: string | null;
  publicEmail?: string | null;
  publicPhone?: string | null;
  contactPerson?: string | null;
  sourceUrl?: string | null;
  status: string;
  contactVerificationStatus: string;
  productSummary?: string | null;
  potentialPlasticParts?: string | null;
  personalizationReason?: string | null;
  notes?: string | null;
  drafts: Array<{ id: string; status: string; subject: string; body: string }>;
};

export function LeadDetailActions({ lead }: { lead: LeadPayload }) {
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState({
    companyName: lead.companyName || "",
    region: lead.region || "",
    industry: lead.industry || "",
    website: lead.website || "",
    contactPerson: lead.contactPerson || "",
    publicEmail: lead.publicEmail || "",
    publicPhone: lead.publicPhone || "",
    sourceUrl: lead.sourceUrl || ""
  });
  const [research, setResearch] = useState({
    productSummary: lead.productSummary || "",
    potentialPlasticParts: lead.potentialPlasticParts || "",
    personalizationReason: lead.personalizationReason || "",
    notes: lead.notes || ""
  });
  const [contactSourceUrl, setContactSourceUrl] = useState(lead.sourceUrl || lead.website || "");
  const [leadStatus, setLeadStatus] = useState(lead.status);
  const [verificationStatus, setVerificationStatus] = useState(lead.contactVerificationStatus);
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

  function updateProfile(key: keyof typeof profile, value: string) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function updateResearch(key: keyof typeof research, value: string) {
    setResearch((current) => ({ ...current, [key]: value }));
  }

  return (
    <aside className="space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-950">编辑客户资料</h2>
        <div className="mt-3 space-y-3">
          <Input label="企业名称" value={profile.companyName} onChange={(value) => updateProfile("companyName", value)} />
          <Input label="行业" value={profile.industry} onChange={(value) => updateProfile("industry", value)} />
          <Input label="地区" value={profile.region} onChange={(value) => updateProfile("region", value)} />
          <Input label="官网" value={profile.website} onChange={(value) => updateProfile("website", value)} />
          <Input label="联系人" value={profile.contactPerson} onChange={(value) => updateProfile("contactPerson", value)} />
          <Input label="邮箱" value={profile.publicEmail} onChange={(value) => updateProfile("publicEmail", value)} />
          <Input label="电话" value={profile.publicPhone} onChange={(value) => updateProfile("publicPhone", value)} />
          <Input label="客户来源" value={profile.sourceUrl} onChange={(value) => updateProfile("sourceUrl", value)} />
        </div>
        <button onClick={() => post(`/api/lead-dev/leads/${lead.id}`, { action: "updateProfile", ...profile })} className="mt-4 rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white">
          保存客户资料
        </button>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-950">填写或更新研究信息</h2>
        <Textarea label="主营产品摘要" value={research.productSummary} onChange={(value) => updateResearch("productSummary", value)} />
        <Textarea label="可能需要的塑料件" value={research.potentialPlasticParts} onChange={(value) => updateResearch("potentialPlasticParts", value)} />
        <Textarea label="个性化依据" value={research.personalizationReason} onChange={(value) => updateResearch("personalizationReason", value)} />
        <Textarea label="备注" value={research.notes} onChange={(value) => updateResearch("notes", value)} />
        <button onClick={() => post(`/api/lead-dev/leads/${lead.id}`, { action: "updateResearch", ...research })} className="mt-4 rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold">
          保存研究信息
        </button>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-950">设置联系方式验证状态</h2>
        <label className="mt-3 block text-xs font-semibold text-slate-500">
          生命周期状态
          <select value={leadStatus} onChange={(event) => setLeadStatus(event.target.value)} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900">
            {["NEW", "RESEARCHED", "CONTACTED", "REPLIED", "BOUNCED", "REJECTED", "DO_NOT_CONTACT"].map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </label>
        <button onClick={() => post(`/api/lead-dev/leads/${lead.id}`, { action: "updateStatus", status: leadStatus })} className="mt-3 rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold">
          保存生命周期状态
        </button>
        <label className="mt-4 block text-xs font-semibold text-slate-500">
          联系方式验证状态
          <select value={verificationStatus} onChange={(event) => setVerificationStatus(event.target.value)} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900">
            {["UNVERIFIED", "VERIFIED", "INVALID", "STALE"].map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </label>
        <Input label="公开联系方式来源 URL" value={contactSourceUrl} onChange={setContactSourceUrl} />
        <button onClick={() => post(`/api/lead-dev/leads/${lead.id}`, { action: "updateContactVerification", contactVerificationStatus: verificationStatus, contactSourceUrl })} className="mt-4 rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white">
          保存联系方式验证状态
        </button>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-950">生成开发信草稿</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={() => post(`/api/lead-dev/leads/${lead.id}/drafts`, { type: "FIRST_TOUCH" })} className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold">
            生成首封开发信
          </button>
          <button onClick={() => post(`/api/lead-dev/leads/${lead.id}/drafts`, { type: "FOLLOW_UP" })} className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold">
            创建下一次跟进记录
          </button>
        </div>
        {latestPending && (
          <div className="mt-4 space-y-3">
            <p className="text-sm font-semibold text-slate-700">查看已有草稿并审核</p>
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

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-xs font-semibold text-slate-500">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900" />
    </label>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="mt-3 block text-xs font-semibold text-slate-500">
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 h-24 w-full rounded-2xl border border-slate-200 p-3 text-sm leading-6 text-slate-900" />
    </label>
  );
}
