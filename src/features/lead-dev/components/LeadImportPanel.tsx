"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LeadImportPanel() {
  const router = useRouter();
  const [csv, setCsv] = useState("");
  const [preview, setPreview] = useState<Record<string, unknown> | null>(null);
  const [message, setMessage] = useState("");

  async function previewCsv() {
    setMessage("");
    const response = await fetch("/api/lead-dev/import/preview", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ csv })
    });
    setPreview(await response.json());
  }

  async function commitCsv() {
    setMessage("");
    const response = await fetch("/api/lead-dev/import/commit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ csv })
    });
    const payload = await response.json();
    if (!response.ok) {
      setMessage(payload.error || "导入失败");
      return;
    }

    const created = Number(payload.created ?? 0);
    const skipped = Number(payload.skipped ?? 0);
    setMessage(
      created > 0
        ? `已导入 ${created} 条，跳过 ${skipped} 条。客户列表已刷新。`
        : `没有新增记录，已跳过 ${skipped} 条。通常是公司名称、邮箱或官网与现有客户重复。`
    );
    router.refresh();
  }

  return (
    <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">CSV 导入预览</h2>
      <p className="mt-1 text-sm text-slate-600">先预览校验，不会生成草稿或发送邮件。</p>
      <textarea value={csv} onChange={(event) => setCsv(event.target.value)} className="mt-4 h-36 w-full rounded-2xl border border-slate-200 p-4 text-sm" placeholder="粘贴 CSV 内容..." />
      <div className="mt-4 flex gap-3">
        <button onClick={previewCsv} className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold">预览</button>
        <button onClick={commitCsv} className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white">确认导入有效行</button>
        <a href="/templates/lead-import-template.csv" className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold">下载模板</a>
      </div>
      {message && <p className="mt-3 text-sm font-semibold text-slate-700">{message}</p>}
      {preview && <pre className="mt-4 max-h-72 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{JSON.stringify(preview, null, 2)}</pre>}
    </div>
  );
}
