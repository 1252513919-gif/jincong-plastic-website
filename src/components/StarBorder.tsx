"use client";

import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  ElementType,
  ReactNode
} from "react";
import "@/styles/star-border.css";

type StarBorderProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  color?: string;
  speed?: string;
  style?: CSSProperties;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className" | "style">;

export default function StarBorder<T extends ElementType = "div">({
  as,
  children,
  className = "",
  color = "rgba(56, 189, 248, 0.72)",
  speed = "6s",
  style,
  ...props
}: StarBorderProps<T>) {
  const Component = (as || "div") as ElementType;

  return (
    <Component
      className={`star-border ${className}`.trim()}
      style={
        {
          "--star-border-color": color,
          "--star-border-speed": speed,
          ...style
        } as CSSProperties
      }
      {...props}
    >
      <span className="star-border__content">{children}</span>
    </Component>
  );
}
