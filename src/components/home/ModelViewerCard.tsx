"use client";

import { createElement, useEffect, useRef, useState, type CSSProperties } from "react";

type ModelViewerCardProps = {
  src: string;
  title: string;
  note: string;
  className?: string;
  delay?: number;
  enabled?: boolean;
  rotationSpeed?: string;
};

export function ModelViewerCard({
  src,
  title,
  note,
  className = "",
  delay = 0,
  enabled = true,
  rotationSpeed = "14deg"
}: ModelViewerCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const shouldLoad = enabled && isNearViewport;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "80px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;
    void import("@google/model-viewer");
  }, [shouldLoad]);

  useEffect(() => {
    const viewer = ref.current?.querySelector("model-viewer");
    if (!shouldLoad || !viewer) return;

    const attributes: Record<string, string> = {
      src,
      alt: title,
      "auto-rotate": "",
      "rotation-per-second": rotationSpeed,
      "camera-orbit": "35deg 64deg 115%",
      "camera-controls": "",
      "disable-zoom": "",
      "interaction-prompt": "none",
      "shadow-intensity": "0.85",
      "environment-image": "neutral",
      exposure: "0.95",
      loading: "lazy",
      reveal: "auto"
    };

    Object.entries(attributes).forEach(([name, value]) => {
      viewer.setAttribute(name, value);
    });
  }, [rotationSpeed, shouldLoad, src, title]);

  return (
    <div
      ref={ref}
      className={`home-model-card ${className}`}
      style={{ "--model-delay": `${delay}ms` } as CSSProperties}
    >
      <div className="home-model-card__stage">
        {shouldLoad ? (
          createElement("model-viewer", {
            "data-model-viewer-target": "true",
            className: "home-model-card__viewer"
          })
        ) : (
          <div className="home-model-card__placeholder" aria-hidden="true">
            <span />
          </div>
        )}
      </div>
      <div className="home-model-card__copy">
        <strong>{title}</strong>
        <span>{note}</span>
      </div>
    </div>
  );
}
