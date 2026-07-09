export type HeroLocale = "zh" | "en";

export type HomeHeroContent = {
  headline: [string, string, string];
  description: string;
  primaryCta: string;
  secondaryCta: string;
  ticker: string[];
  orbit: string[];
  center: [string, string];
  capabilityLabel: string;
  capabilities: string[];
};

const enHeroContent: HomeHeroContent = {
  headline: [
    "Custom plastic parts,",
    "crafted with precision",
    "factory-direct."
  ],
  description:
    "We manufacture custom plastic components for automotive, electronics, furniture, pet products, hardware, and industrial applications. Send us your drawing or sample to start your project.",
  primaryCta: "Request a Quote",
  secondaryCta: "View Products",
  ticker: [
    "Custom Injection Molding",
    "Mold Development",
    "OEM / ODM",
    "Small Batch Trial",
    "Mass Production",
    "Plastic Parts",
    "Drawing Review",
    "Sample Accepted"
  ],
  orbit: [
    "Pet Product Parts",
    "Electronics Parts",
    "Furniture Fittings",
    "Flat Washers",
    "Automotive Parts",
    "OEM / ODM",
    "Mold Development",
    "Small Batch Trial",
    "Mass Production"
  ],
  center: ["Custom", "Plastic Parts"],
  capabilityLabel: "Factory-direct capabilities for custom plastic parts",
  capabilities: [
    "Injection Molding",
    "Mold Development",
    "Drawing Review",
    "Sample Accepted",
    "Small Batch Trial",
    "Mass Production"
  ]
};

const zhHeroContent: HomeHeroContent = {
  headline: ["定制塑料件，", "精密加工，", "工厂直供。"],
  description:
    "面向汽车、电子电气、家具、宠物用品、五金及工业应用提供塑料零部件加工。可发送图纸、样品或产品图片，沟通试产与批量供货方案。",
  primaryCta: "提交需求获取报价",
  secondaryCta: "查看产品系列",
  ticker: [
    "注塑加工",
    "模具开发",
    "OEM / ODM",
    "小批量试产",
    "批量生产",
    "塑料件定制",
    "图纸评估",
    "来样加工"
  ],
  orbit: [
    "宠物用品塑料件",
    "电子电气塑料件",
    "家具塑料配件",
    "平垫与垫片",
    "汽车塑料件",
    "OEM / ODM",
    "模具开发",
    "小批量试产",
    "批量生产"
  ],
  center: ["定制", "塑料件"],
  capabilityLabel: "面向定制塑料件项目的工厂直连加工能力",
  capabilities: [
    "注塑加工",
    "模具开发",
    "图纸评估",
    "来样加工",
    "小批量试产",
    "批量生产"
  ]
};

export function getHeroContent(language: HeroLocale): HomeHeroContent {
  return language === "zh" ? zhHeroContent : enHeroContent;
}
