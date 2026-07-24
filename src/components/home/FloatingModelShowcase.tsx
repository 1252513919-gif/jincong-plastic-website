"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { ModelViewerCard } from "./ModelViewerCard";

const showcaseModels = [
  {
    src: "/models/electronic_enclosure.glb",
    titleEn: "Electronic Device Housing",
    titleZh: "电子设备外壳",
    noteEn: "Housing and enclosure references",
    noteZh: "外壳与结构件参考",
    className: "home-model-card--top",
    rotationSpeed: "11deg"
  },
  {
    src: "/models/automotive_fastener.glb",
    titleEn: "Automotive Plastic Fastener",
    titleZh: "汽车塑料卡扣",
    noteEn: "Clips, caps and small fittings",
    noteZh: "卡扣、堵盖与小型配件",
    className: "home-model-card--left",
    rotationSpeed: "15deg"
  },
  {
    src: "/models/instrument_housing.glb",
    titleEn: "Industrial Instrument Housing",
    titleZh: "工业仪表壳体",
    noteEn: "Instrument and controller parts",
    noteZh: "仪表与控制器部件",
    className: "home-model-card--right",
    rotationSpeed: "9deg"
  },
  {
    src: "/models/pet_bowl_component.glb",
    titleEn: "Pet Product Component",
    titleZh: "宠物用品塑料件",
    noteEn: "Pet product component references",
    noteZh: "宠物用品结构件参考",
    className: "home-model-card--bottom-left",
    rotationSpeed: "13deg"
  },
  {
    src: "/models/handheld_device_case.glb",
    titleEn: "Handheld Device Case",
    titleZh: "手持设备壳体",
    noteEn: "Device case and cover references",
    noteZh: "设备壳体与保护盖参考",
    className: "home-model-card--bottom-right",
    rotationSpeed: "17deg"
  }
];

export function FloatingModelShowcase() {
  const { language } = useLanguage();
  const isZh = language === "zh";
  const sectionRef = useRef<HTMLElement | null>(null);
  const [loadCount, setLoadCount] = useState(0);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || loadCount > 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setLoadCount(1);
          observer.disconnect();
        }
      },
      { rootMargin: "80px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadCount]);

  useEffect(() => {
    if (loadCount === 0 || loadCount >= showcaseModels.length) return;

    const timer = window.setTimeout(() => {
      setLoadCount((current) => Math.min(current + 1, showcaseModels.length));
    }, 520);

    return () => window.clearTimeout(timer);
  }, [loadCount]);

  return (
    <section ref={sectionRef} className="home-model-showcase" aria-labelledby="home-model-showcase-title">
      <div className="section-shell">
        <div className="home-model-showcase__heading">
          <div className="eyebrow">3D Product Showcase</div>
          <h2 id="home-model-showcase-title">
            {isZh ? "代表性塑料件结构展示" : "Representative Plastic Part Structures"}
          </h2>
          <p>
            {isZh
              ? "以下模型用于展示锦聪可沟通评估的典型塑料零部件方向，实际产品仍以客户图纸、样品和使用要求为准。"
              : "These models present representative plastic part directions for project discussion. Actual manufacturing is evaluated by drawings, samples and application requirements."}
          </p>
        </div>

        <div className="home-model-showcase__stage">
          <div className="home-model-showcase__logo">
            <Image
              src="/images/logo/jincong-logo.jpg"
              alt="Jincong Plastic"
              width={132}
              height={132}
              className="home-model-showcase__logo-image"
            />
            <strong>JINCONG</strong>
            <span>PLASTIC</span>
          </div>

          {showcaseModels.map((model, index) => (
            <ModelViewerCard
              key={model.src}
              src={model.src}
              title={isZh ? model.titleZh : model.titleEn}
              note={isZh ? model.noteZh : model.noteEn}
              className={model.className}
              delay={index * 120}
              enabled={index < loadCount}
              rotationSpeed={model.rotationSpeed}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
