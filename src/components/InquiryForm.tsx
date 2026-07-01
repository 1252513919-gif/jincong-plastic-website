"use client";

import { Send } from "lucide-react";
import { FormEvent, useState } from "react";

const materials = ["PP", "PE", "ABS", "PA", "POM", "PC", "PVC", "其他"];

export function InquiryForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-[1.5rem] p-5 sm:p-7">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-600">
          姓名
          <input className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400" name="name" placeholder="请输入姓名" required />
        </label>
        <label className="grid gap-2 text-sm text-slate-600">
          电话 / 微信
          <input className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400" name="phone" placeholder="便于我们快速联系" required />
        </label>
        <label className="grid gap-2 text-sm text-slate-600">
          邮箱
          <input className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400" name="email" type="email" placeholder="example@company.com" />
        </label>
        <label className="grid gap-2 text-sm text-slate-600">
          产品需求
          <input className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400" name="product" placeholder="如：塑料垫片、汽车塑料件" required />
        </label>
        <label className="grid gap-2 text-sm text-slate-600">
          材质
          <select className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-sky-400" name="material" defaultValue="">
            <option value="" disabled>请选择或后续沟通</option>
            {materials.map((material) => (
              <option key={material} value={material}>{material}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-600">
          数量
          <input className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400" name="quantity" placeholder="如：500件、5000件/月" />
        </label>
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm text-slate-600">是否有图纸 / 样品</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {["有图纸", "有样品", "暂时没有"].map((item) => (
            <label key={item} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
              <input type="radio" name="drawing" value={item} className="accent-electric-400" />
              {item}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="mt-5 grid gap-2 text-sm text-slate-600">
        留言
        <textarea className="min-h-36 rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400" name="message" placeholder="请描述尺寸、用途、颜色、包装、交期等要求" />
      </label>

      <button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-sky-700 sm:w-auto">
        <Send className="h-4 w-4" />
        提交询盘
      </button>

      {submitted && (
        <p className="mt-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">
          表单结构已就绪。上线前接入邮件、企业微信或 CRM 后即可真实提交。
        </p>
      )}
    </form>
  );
}
