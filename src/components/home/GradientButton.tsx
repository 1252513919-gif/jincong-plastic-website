import type { ReactNode } from "react";
import Link from "next/link";

type GradientButtonProps = {
  href: string;
  children: ReactNode;
};

export function GradientButton({ href, children }: GradientButtonProps) {
  return (
    <span className="home-hero__primary-border">
      <Link className="home-hero__primary-button" href={href}>
        <span>{children}</span>
      </Link>
    </span>
  );
}
