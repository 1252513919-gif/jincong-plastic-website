import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync, type Dirent } from "node:fs";
import path from "node:path";

type CategoryMeta = {
  categoryZh: string;
  categoryEn: string;
  defaultMaterial: string[];
  usageZh: string;
  usageEn: string;
  industries: string[];
  industriesZh?: string[];
  industriesEn?: string[];
};

type ProductRecord = {
  id: string;
  nameZh: string;
  nameEn: string;
  category: string;
  categoryZh: string;
  categoryEn: string;
  subCategoryZh?: string;
  subCategoryEn?: string;
  image: string;
  material: string[];
  usageZh: string;
  usageEn: string;
  industries: string[];
  industriesZh?: string[];
  industriesEn?: string[];
  customizable: boolean;
  needsReview: boolean;
};

const rootDir = process.cwd();
const productsImageDir = path.join(rootDir, "public", "images", "products-v2");
const dataDir = path.join(rootDir, "data");
const categoryMapPath = path.join(dataDir, "category-map.json");
const productsPath = path.join(dataDir, "products.json");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const rootToCategory: Record<string, string> = {
  pet: "pet-plastic-products",
  electrical: "electronic-electrical-plastic-parts",
  furniture: "furniture-plastic-fittings",
  washers: "plastic-washers",
  automotive: "automotive-plastic-parts"
};

const subCategoryEn: Record<string, string> = {
  宠物出行用品: "Pet Travel Parts",
  宠物笼具及家居配件: "Pet Cage & Home Fittings",
  宠物清洁用品: "Pet Cleaning Parts",
  宠物玩具及护理用品: "Pet Toy & Care Parts",
  宠物喂养用品: "Pet Feeding Parts",
  宠物饮水喂食器配件: "Pet Watering & Feeding Parts",
  电源开关塑料配件: "Power Switch Plastic Parts",
  电子配件塑料件: "Electronic Plastic Parts",
  通讯数码塑料件: "Digital Communication Plastic Parts",
  仪器仪表塑料壳体: "Instrument Plastic Housings",
  音响设备塑料外壳: "Audio Device Plastic Housings",
  家具堵头脚塞系列: "Furniture Tube Plugs & Feet",
  家具孔盖和装饰盖帽系列: "Furniture Hole Caps & Decorative Caps",
  家具装饰件系列: "Furniture Decorative Parts",
  标准圆形平垫: "Standard Round Flat Washers",
  电气绝缘垫片: "Electrical Insulation Washers",
  非标件垫片: "Non-standard Washers",
  工程塑料和特殊材质平垫系列: "Engineering Plastic Washers",
  功能性垫片: "Functional Washers",
  尼龙平垫系列: "Nylon Flat Washers",
  塑料平垫系列: "Plastic Flat Washers",
  特殊尺寸平垫: "Special Size Flat Washers",
  特殊结构垫片: "Special Structure Washers",
  橡胶和硅胶密封垫片: "Rubber & Silicone Sealing Washers",
  宠物用品专用垫片: "Pet Product Washers",
  汽车卡扣固定件: "Automotive Clips & Fasteners",
  汽车内饰塑料件: "Automotive Interior Plastic Parts",
  汽车外饰塑料件: "Automotive Exterior Plastic Parts",
  汽车电气塑料件: "Automotive Electrical Plastic Parts",
  汽车塑料支架: "Automotive Plastic Brackets"
};

const materialTokens: Array<[RegExp, string]> = [
  [/PA66|尼龙|Nylon/i, "PA/Nylon"],
  [/PTFE|四氟/i, "PTFE"],
  [/POM/i, "POM"],
  [/ABS/i, "ABS"],
  [/PVC/i, "PVC"],
  [/PBT/i, "PBT"],
  [/PET/i, "PET"],
  [/PC|透明/i, "PC"],
  [/EVA/i, "EVA"],
  [/PU|聚氨酯/i, "PU"],
  [/PP/i, "PP"],
  [/PE/i, "PE"],
  [/硅胶|Silicone/i, "Silicone"],
  [/橡胶|Rubber/i, "Rubber"],
  [/FR4|环氧板/i, "FR4"]
];

const nameTokens: Array<[string, string]> = [
  ["宠物", "Pet"],
  ["汽车", "Automotive"],
  ["家具", "Furniture"],
  ["塑料", "Plastic"],
  ["平垫", "Flat Washer"],
  ["垫片", "Washer"],
  ["垫圈", "Washer"],
  ["外壳", "Housing"],
  ["壳体", "Housing"],
  ["卡扣", "Clip"],
  ["固定扣", "Fastener"],
  ["支架", "Bracket"],
  ["堵头", "Plug"],
  ["脚塞", "Foot Plug"],
  ["孔盖", "Hole Cap"],
  ["盖帽", "Cap"],
  ["保护盖", "Protective Cover"],
  ["端盖", "End Cap"],
  ["线夹", "Wire Clip"],
  ["线扣", "Wire Buckle"],
  ["连接件", "Connector"],
  ["底座", "Base"],
  ["面板", "Panel"],
  ["手柄", "Handle"],
  ["脚垫", "Glide"],
  ["密封", "Sealing"],
  ["绝缘", "Insulation"],
  ["透明", "Transparent"],
  ["喂食器", "Feeder"],
  ["饮水机", "Waterer"],
  ["食盆", "Bowl"],
  ["玩具", "Toy"],
  ["清洁", "Cleaning"],
  ["仪表", "Instrument"],
  ["音箱", "Speaker"],
  ["麦克风", "Microphone"]
];

function walkImages(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const entries = readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry: Dirent) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkImages(fullPath);
    if (entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase())) return [fullPath];
    return [];
  });
}

function readJson<T>(filePath: string, fallback: T): T {
  if (!existsSync(filePath)) return fallback;
  try {
    return JSON.parse(readFileSync(filePath, "utf8")) as T;
  } catch {
    return fallback;
  }
}

function toPublicImagePath(filePath: string) {
  return `/${path.relative(path.join(rootDir, "public"), filePath).replaceAll(path.sep, "/")}`;
}

function cleanBaseName(filePath: string) {
  return path
    .basename(filePath, path.extname(filePath))
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function inferMaterials(nameZh: string, meta: CategoryMeta) {
  const found = materialTokens.filter(([pattern]) => pattern.test(nameZh)).map(([, material]) => material);
  return [...new Set(found.length > 0 ? found : meta.defaultMaterial)];
}

function toEnglishName(nameZh: string, fallback: string, index: number) {
  let result = nameZh;
  for (const [zh, en] of nameTokens) {
    result = result.replaceAll(zh, ` ${en} `);
  }
  result = result.replace(/[\u4e00-\u9fff（）()，、]/g, " ").replace(/\s+/g, " ").trim();
  if (!/[A-Za-z]/.test(result)) return `${fallback} Part ${String(index).padStart(2, "0")}`;
  return result
    .split(" ")
    .filter(Boolean)
    .map((word) => (/[A-Z0-9]{2,}/.test(word) ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(" ");
}

function getPathParts(filePath: string) {
  const relative = path.relative(productsImageDir, filePath).split(path.sep);
  return {
    rootFolder: relative[0] || "",
    subCategoryZh: relative[1] || ""
  };
}

function main() {
  mkdirSync(dataDir, { recursive: true });
  const categoryMap = readJson<Record<string, CategoryMeta>>(categoryMapPath, {});
  const existingProducts = readJson<ProductRecord[]>(productsPath, []);
  const existingByImage = new Map(existingProducts.map((product) => [product.image, product]));
  const counters: Record<string, number> = {};

  const imagePaths = walkImages(productsImageDir).sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
  const nextProducts = imagePaths.map((imagePath) => {
    const publicPath = toPublicImagePath(imagePath);
    const { rootFolder, subCategoryZh } = getPathParts(imagePath);
    const category = rootToCategory[rootFolder] || rootFolder || "uncategorized";
    const meta = categoryMap[category] ?? {
      categoryZh: category,
      categoryEn: category,
      defaultMaterial: ["PP", "ABS"],
      usageZh: "用于塑料件注塑加工与定制配套场景。",
      usageEn: "Used for custom plastic injection molding applications.",
      industries: ["注塑加工"]
    };
    const count = (counters[category] = (counters[category] || 0) + 1);
    const existing = existingByImage.get(publicPath);
    if (existing) {
      const nextSubCategoryZh = existing.subCategoryZh || subCategoryZh;
      const refreshedNameEn = toEnglishName(existing.nameZh, subCategoryEn[nextSubCategoryZh] || meta.categoryEn, count);
      return {
        ...existing,
        nameEn: refreshedNameEn,
        category,
        categoryZh: meta.categoryZh,
        categoryEn: meta.categoryEn,
        subCategoryZh: nextSubCategoryZh,
        subCategoryEn: subCategoryEn[nextSubCategoryZh] || meta.categoryEn,
        usageZh: meta.usageZh,
        usageEn: meta.usageEn,
        industries: meta.industriesZh || meta.industries,
        industriesZh: meta.industriesZh || meta.industries,
        industriesEn: meta.industriesEn || meta.industries
      };
    }
    const nameZh = cleanBaseName(imagePath);

    return {
      id: `${category}-${String(count).padStart(3, "0")}`,
      nameZh,
      nameEn: toEnglishName(nameZh, subCategoryEn[subCategoryZh] || meta.categoryEn, count),
      category,
      categoryZh: meta.categoryZh,
      categoryEn: meta.categoryEn,
      subCategoryZh,
      subCategoryEn: subCategoryEn[subCategoryZh] || meta.categoryEn,
      image: publicPath,
      material: inferMaterials(nameZh, meta),
      usageZh: meta.usageZh,
      usageEn: meta.usageEn,
      industries: meta.industriesZh || meta.industries,
      industriesZh: meta.industriesZh || meta.industries,
      industriesEn: meta.industriesEn || meta.industries,
      customizable: true,
      needsReview: false
    };
  });

  writeFileSync(productsPath, `${JSON.stringify(nextProducts, null, 2)}\n`, "utf8");
  console.log(`Scanned ${imagePaths.length} images. Total products: ${nextProducts.length}.`);
}

main();
