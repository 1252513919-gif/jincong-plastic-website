import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden pt-32">
      <div className="absolute inset-0 soft-grid opacity-60" />
      <div className="absolute left-[-12rem] top-10 h-[28rem] w-[28rem] rounded-full bg-sky-200/45 blur-3xl" />
      <div className="absolute right-[-10rem] top-20 h-[26rem] w-[26rem] rounded-full bg-orange-100/70 blur-3xl" />
      <div className="section-shell relative py-16 lg:py-20">
        <div className="max-w-4xl">
          <div className="eyebrow">{eyebrow}</div>
          <h1 className="mt-5 text-4xl font-semibold tracking-normal text-slate-950 sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{description}</p>
          {children}
        </div>
      </div>
    </section>
  );
}
