import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-[#f7f8fb] pt-32">
      <div className="absolute inset-0 industrial-grid opacity-60" />
      <div className="absolute left-1/2 top-0 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-sky-100 blur-3xl" />
      <div className="absolute right-[-12rem] top-20 h-72 w-72 rounded-full bg-orange-100/70 blur-3xl" />
      <div className="section-shell relative z-10 py-16 md:py-24">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-normal text-slate-950 sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">{description}</p>
        {children}
      </div>
    </section>
  );
}
