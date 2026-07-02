"use client";

import { Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function InquiryForm() {
  const { copy } = useLanguage();
  const [state, setState] = useState<SubmitState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      company: String(data.get("company") || ""),
      contact: String(data.get("contact") || ""),
      email: String(data.get("email") || ""),
      product: String(data.get("product") || ""),
      category: String(data.get("category") || ""),
      quantity: String(data.get("quantity") || ""),
      material: String(data.get("material") || ""),
      drawing: String(data.get("drawing") || ""),
      message: String(data.get("message") || ""),
      sourcePage: window.location.href
    };

    if (!payload.contact.trim() || !payload.product.trim()) {
      setState("error");
      return;
    }

    setState("submitting");
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("request failed");
      setState("success");
      form.reset();
    } catch {
      setState("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="premium-card rounded-[2rem] p-5 sm:p-7">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label={copy.inquiry.name} name="name" placeholder={copy.inquiry.placeholders.name} required />
        <Field label={copy.inquiry.company} name="company" placeholder={copy.inquiry.placeholders.company} />
        <Field label={copy.inquiry.contact} name="contact" placeholder={copy.inquiry.placeholders.contact} required />
        <Field label={copy.inquiry.email} name="email" type="email" placeholder={copy.inquiry.placeholders.email} />
        <Field label={copy.inquiry.product} name="product" placeholder={copy.inquiry.placeholders.product} required />
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
          {copy.inquiry.drawingOptions.map((item) => (
            <label key={item} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
              <input type="radio" name="drawing" value={item} className="accent-sky-600" />
              {item}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="mt-5 grid gap-2 text-sm font-medium text-slate-600">
        {copy.inquiry.message}
        <textarea className="min-h-36 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400" name="message" placeholder={copy.inquiry.placeholders.message} />
      </label>

      <button
        disabled={state === "submitting"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        <Send className="h-4 w-4" />
        {state === "submitting" ? copy.inquiry.submitting : copy.inquiry.submit}
      </button>

      {state === "success" && (
        <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {copy.inquiry.success}
        </p>
      )}
      {state === "error" && (
        <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {copy.inquiry.error}
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
  required = false
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-600">
      {label}
      <input
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400"
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}
