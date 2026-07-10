"use client";

export function LeadDevLogoutButton() {
  async function logout() {
    await fetch("/api/lead-dev/auth/logout", { method: "POST" });
    window.location.href = "/lead-dev/login";
  }

  return (
    <button onClick={logout} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
      退出
    </button>
  );
}
