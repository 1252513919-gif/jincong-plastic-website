"use client";

import { Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { site } from "@/lib/site";

type SubmitState = "idle" | "submitting" | "success" | "error" | "validation";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function InquiryForm() {
  const { language, copy } = useLanguage();
  const [state, setState] = useState<SubmitState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      language,
      name: String(data.get("name") || ""),
      company: String(data.get("company") || ""),
      country: String(data.get("country") || ""),
      phone: String(data.get("phone") || ""),
      wechat: String(data.get("wechat") || ""),
      email: String(data.get("email") || ""),
      product: String(data.get("product") || ""),
      category: String(data.get("category") || ""),
      quantity: String(data.get("quantity") || ""),
      material: String(data.get("material") || ""),
      drawing: String(data.get("drawing") || ""),
      message: String(data.get("message") || ""),
      sourcePage: window.location.href
    };

    if (!payload.name.trim() || (!payload.phone.trim() && !payload.wechat.trim()) || !payload.message.trim()) {
      setState("validation");
      return;
    }

    if (payload.email.trim() && !emailPattern.test(payload.email.trim())) {
      setState("validation");
      return;
    }

    setState("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = (await response.json().catch(() => null)) as { success?: boolean; error?: string } | null;
      if (!response.ok || !result?.success) throw new Error(result?.error || "request failed");
      setState("success");
      form.reset();
    } catch {
      setState("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="premium-card rounded-[2rem] p-5 sm:p-7">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label={copy.inquiry.name} name="name" placeholder={copy.inquiry.placeholders.name} />
        <Field label={copy.inquiry.company} name="company" placeholder={copy.inquiry.placeholders.company} />
        <Field label={copy.inquiry.country} name="country" placeholder={copy.inquiry.placeholders.country} />
        <Field label={copy.inquiry.phone} name="phone" placeholder={copy.inquiry.placeholders.phone} />
        <Field label={copy.inquiry.wechat} name="wechat" placeholder={copy.inquiry.placeholders.wechat} />
        <Field label={copy.inquiry.email} name="email" type="email" placeholder={copy.inquiry.placeholders.email} />
        <Field label={copy.inquiry.product} name="product" placeholder={copy.inquiry.placeholders.product} />
        <label className="grid gap-2 text-sm font-medium text-slate-600">
          {copy.inquiry.category}
          <select className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-sky-400" name="category" defaultValue="">
            <option value="">{copy.productExplorer.allSeries}</option>
            {copy.series.map((item) => (
              <option key={item.title} value={item.title}>{item.title}</option>
            ))}
          </select>
        </label>
        <Field label={copy.inquiry.quantity} name="quantity" placeholder={copy.inquiry.placeholders.quantity} />
        <Field label={copy.inquiry.material} name="material" placeholder={copy.inquiry.placeholders.material} />
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm font-medium text-slate-600">{copy.inquiry.drawing}</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {copy.inquiry.drawingOptions.map((item: string) => (
            <label key={item} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
              <input type="radio" name="drawing" value={item} className="accent-sky-600" />
              {item}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="mt-5 grid gap-2 text-sm font-medium text-slate-600">
        {copy.inquiry.message}
        <textarea
          className="min-h-36 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400"
          name="message"
          placeholder={copy.inquiry.placeholders.message}
          required
        />
      </label>

      <button
        disabled={state === "submitting"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        <Send className="h-4 w-4" />
        {state === "submitting" ? copy.inquiry.submitting : copy.inquiry.submit}
      </button>

      {state === "success" && (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <p className="font-semibold">{copy.inquiry.success}</p>
          <p className="mt-1 leading-6">{copy.inquiry.successDetail}</p>
        </div>
      )}
      {state === "validation" && (
        <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {copy.inquiry.validation}
        </p>
      )}
      {state === "error" && (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <p className="font-semibold">{copy.inquiry.error}</p>
          <p className="mt-1 leading-6">
            {copy.contact.phone}: {site.phone}<br />
            {copy.contact.wechat}: {site.wechat}<br />
            {copy.contact.email}: {site.email}
          </p>
        </div>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text"
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-600">
      {label}
      <input
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400"
        name={name}
        type={type}
        placeholder={placeholder}
      />
    </label>
  );
}
