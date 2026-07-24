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
    "Custom Plastic",
    "Injection Molding",
    "Factory Direct"
  ],
  description:
    "Custom plastic parts from drawings, samples and product photos. We support small-batch trial production, OEM/ODM and batch supply for multi-industry applications.",
  primaryCta: "Send Requirement",
  secondaryCta: "View Products",
  ticker: [
    "Custom Injection Molding",
    "Mold Support",
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
    "Mold Support",
    "Small Batch Trial",
    "Mass Production"
  ],
  center: ["Custom", "Plastic Parts"],
  capabilityLabel: "Factory-direct capabilities for custom plastic parts",
  capabilities: [
    "Injection Molding",
    "Mold Support",
    "Drawing Review",
    "Sample Accepted",
    "Small Batch Trial",
    "Mass Production"
  ]
};

const zhHeroContent: HomeHeroContent = {
  headline: ["塑料件定制", "注塑加工", "工厂直连"],
  description:
    "支持按图纸、样品和产品图片沟通塑料件加工需求，适合小批量试产、OEM/ODM 定制和多行业塑料零部件批量供货。",
  primaryCta: "发送需求",
  secondaryCta: "查看产品",
  ticker: [
    "注塑加工",
    "模具配套",
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
    "模具配套",
    "小批量试产",
    "批量生产"
  ],
  center: ["定制", "塑料件"],
  capabilityLabel: "面向定制塑料件项目的工厂直连加工能力",
  capabilities: [
    "注塑加工",
    "模具配套",
    "图纸评估",
    "来样加工",
    "小批量试产",
    "批量生产"
  ]
};

export function getHeroContent(language: HeroLocale): HomeHeroContent {
  return language === "zh" ? zhHeroContent : enHeroContent;
}
