import { Mail, MapPin, Phone, Smartphone } from "lucide-react";
import { InquiryForm } from "@/components/InquiryForm";
import { PageHero } from "@/components/PageHero";
import { content } from "@/i18n/site-content";
import type { Locale } from "@/i18n/routing";
import { site } from "@/lib/site";

type ContactPageViewProps = {
  locale: Locale;
};

export function ContactPageView({ locale }: ContactPageViewProps) {
  const copy = content[locale];
  const page = copy.pages.contact;
  const cards = [
    { icon: Phone, label: copy.contact.phone, value: site.phone },
    { icon: Smartphone, label: copy.contact.wechat, value: site.wechat },
    { icon: Mail, label: copy.contact.email, value: site.email },
    { icon: MapPin, label: locale === "zh" ? "所在地" : "Location", value: site.location }
  ];

  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} description={page.description} />
      <section className="py-20 lg:py-28">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <aside className="space-y-5">
            <div className="premium-card rounded-[2rem] p-6">
              <h2 className="text-2xl font-semibold text-slate-950">{copy.contact.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">{copy.contact.body}</p>
            </div>
            {cards.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
                <Icon className="h-5 w-5 text-sky-600" />
                <div className="mt-4 text-sm text-slate-500">{label}</div>
                <div className="mt-1 font-semibold text-slate-950">{value}</div>
              </div>
            ))}
          </aside>
          <InquiryForm locale={locale} />
        </div>
      </section>
    </>
  );
}
