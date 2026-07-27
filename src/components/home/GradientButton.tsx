import type { ReactNode } from "react";
import Link from "next/link";
import StarBorder from "@/components/StarBorder";

type GradientButtonProps = {
  href: string;
  children: ReactNode;
};

export function GradientButton({ href, children }: GradientButtonProps) {
  return (
    <StarBorder
      as={Link}
      href={href}
      className="home-hero__primary-button home-hero__primary-button--star"
      color="rgba(56, 189, 248, 0.72)"
      speed="6s"
    >
      <span>{children}</span>
    </StarBorder>
  );
}
