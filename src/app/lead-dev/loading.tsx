export default function LeadDevLoading() {
  return (
    <section className="space-y-4">
      <div className="h-6 w-40 animate-pulse rounded-full bg-slate-200" />
      <div className="h-10 w-72 animate-pulse rounded-2xl bg-slate-200" />
      <div className="grid gap-3 md:grid-cols-3">
        <div className="h-28 animate-pulse rounded-2xl bg-white shadow-sm" />
        <div className="h-28 animate-pulse rounded-2xl bg-white shadow-sm" />
        <div className="h-28 animate-pulse rounded-2xl bg-white shadow-sm" />
      </div>
      <div className="h-80 animate-pulse rounded-2xl bg-white shadow-sm" />
    </section>
  );
}
