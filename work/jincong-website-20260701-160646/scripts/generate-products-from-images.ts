import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync, type Dirent } from "node:fs";
import path from "node:path";

type CategoryMeta = {
  categoryZh: string;
  categoryEn: string;
  defaultMaterial: string[];
  usageZh: string;
  usageEn: string;
  industries: string[];
};

type ProductRecord = {
  id: string;
  nameZh: string;
  nameEn: string;
  category: string;
  categoryZh: string;
  categoryEn: string;
  image: string;
  material: string[];
  usageZh: string;
  usageEn: string;
  industries: string[];
  customizable: boolean;
  needsReview: boolean;
};

const rootDir = process.cwd();
const productsImageDir = path.join(rootDir, "public", "images", "products");
const dataDir = path.join(rootDir, "data");
const categoryMapPath = path.join(dataDir, "category-map.json");
const productsPath = path.join(dataDir, "products.json");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const unclearNamePattern = /^(img|image|dsc|photo|pic|微信图片|截图|未命名|新建|untitled|default|test|\d+)[-_ .\d]*$/i;
const materialTokens: Array<[RegExp, string]> = [
  [/\bPA66\b|PA66|尼龙|Nylon/i, "PA/Nylon"],
  [/\bPTFE\b|四氟/i, "PTFE"],
  [/\bPOM\b|赛钢/i, "POM"],
  [/\bABS\b/i, "ABS"],
  [/\bPVC\b/i, "PVC"],
  [/\bPBT\b/i, "PBT"],
  [/\bPET\b/i, "PET"],
  [/\bPC\b|透明/i, "PC"],
  [/\bEVA\b/i, "EVA"],
  [/\bPU\b|聚氨酯/i, "PU"],
  [/\bPP\b/i, "PP"],
  [/\bPE\b/i, "PE"],
  [/硅胶|Silicone/i, "Silicone"],
  [/橡胶|Rubber/i, "Rubber"],
  [/毛毡/i, "Felt"],
  [/FR4|环氧板/i, "FR4"]
];

const phraseTranslations: Array<[RegExp, string]> = [
  [/塑料平垫|平垫|垫片|垫圈/g, "Plastic Washer"],
  [/密封/g, "Sealing"],
  [/绝缘/g, "Insulating"],
  [/卡扣/g, "Clip"],
  [/支架/g, "Bracket"],
  [/外壳|壳体/g, "Housing"],
  [/保护盖|盖板|盖帽|端盖|盖/g, "Cover"],
  [/连接件|连接器/g, "Connector"],
  [/固定/g, "Mounting"],
  [/汽车/g, "Automotive"],
  [/宠物/g, "Pet"],
  [/家具/g, "Furniture"],
  [/电器|电子|电气/g, "Electrical"],
  [/开关/g, "Switch"],
  [/面板/g, "Panel"],
  [/底座/g, "Base"],
  [/手柄/g, "Handle"],
  [/脚塞|管塞|堵头/g, "Tube Plug"],
  [/孔盖/g, "Hole Cap"],
  [/装饰/g, "Decorative"],
  [/喂食器/g, "Feeder"],
  [/饮水/g, "Waterer"],
  [/食盆|碗/g, "Bowl"],
  [/猫砂/g, "Litter"],
  [/玩具/g, "Toy"],
  [/航空箱|外出箱/g, "Carrier"],
  [/轮罩/g, "Wheel Cover"],
  [/扎带/g, "Cable Tie"],
  [/线束/g, "Wire Harness"],
  [/仪表/g, "Instrument"],
  [/音响/g, "Audio"],
  [/通讯|数码/g, "Digital"]
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

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/\.[^.]+$/, "")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function getCategoryFromPath(filePath: string) {
  const relative = path.relative(productsImageDir, filePath);
  return relative.split(path.sep)[0] || "uncategorized";
}

function cleanBaseName(filePath: string) {
  return path
    .basename(filePath, path.extname(filePath))
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isUnclearName(name: string) {
  const compact = name.replace(/\s+/g, "");
  return compact.length < 2 || unclearNamePattern.test(compact);
}

function inferMaterials(nameZh: string, meta: CategoryMeta) {
  const found = materialTokens.filter(([pattern]) => pattern.test(nameZh)).map(([, material]) => material);
  return [...new Set(found.length > 0 ? found : meta.defaultMaterial)];
}

function toEnglishName(nameZh: string, fallbackCategory: string) {
  let result = nameZh;
  for (const [pattern, replacement] of phraseTranslations) {
    result = result.replace(pattern, ` ${replacement} `);
  }
  result = result
    .replace(/[（）()]/g, " ")
    .replace(/[^\p{Letter}\p{Number}/+ ]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!/[A-Za-z]/.test(result)) {
    return `${fallbackCategory} Custom Plastic Part`;
  }

  return result
    .split(" ")
    .filter(Boolean)
    .map((word) => (/[A-Z]{2,}|[0-9]/.test(word) ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(" ");
}

function createProduct(filePath: string, index: number, categoryMap: Record<string, CategoryMeta>, usedIds: Set<string>): ProductRecord {
  const category = getCategoryFromPath(filePath);
  const meta = categoryMap[category] ?? {
    categoryZh: category,
    categoryEn: category,
    defaultMaterial: ["PP", "ABS"],
    usageZh: "用于塑料件注塑加工与定制配套场景。",
    usageEn: "Used for custom plastic injection molding applications.",
    industries: ["注塑加工"]
  };
  const baseName = cleanBaseName(filePath);
  const unclear = isUnclearName(baseName);
  const nameZh = unclear ? `${meta.categoryZh}临时产品 ${String(index + 1).padStart(3, "0")}` : baseName;
  const rawId = `${category}-${slugify(baseName) || `product-${index + 1}`}`;
  let id = rawId;
  let duplicate = 2;
  while (usedIds.has(id)) {
    id = `${rawId}-${duplicate}`;
    duplicate += 1;
  }
  usedIds.add(id);

  return {
    id,
    nameZh,
    nameEn: unclear ? `${meta.categoryEn} Temporary Product ${String(index + 1).padStart(3, "0")}` : toEnglishName(nameZh, meta.categoryEn),
    category,
    categoryZh: meta.categoryZh,
    categoryEn: meta.categoryEn,
    image: toPublicImagePath(filePath),
    material: inferMaterials(nameZh, meta),
    usageZh: meta.usageZh,
    usageEn: meta.usageEn,
    industries: meta.industries,
    customizable: true,
    needsReview: unclear
  };
}

function main() {
  mkdirSync(dataDir, { recursive: true });
  const categoryMap = readJson<Record<string, CategoryMeta>>(categoryMapPath, {});
  const existingProducts = readJson<ProductRecord[]>(productsPath, []);
  const imagePaths = walkImages(productsImageDir).sort((a, b) => a.localeCompare(b, "zh-CN"));
  const existingByImage = new Map(existingProducts.map((product) => [product.image, product]));
  const usedIds = new Set(existingProducts.map((product) => product.id));
  const nextProducts = [...existingProducts];

  imagePaths.forEach((imagePath, index) => {
    const publicPath = toPublicImagePath(imagePath);
    if (!existingByImage.has(publicPath)) {
      nextProducts.push(createProduct(imagePath, index, categoryMap, usedIds));
    }
  });

  writeFileSync(productsPath, `${JSON.stringify(nextProducts, null, 2)}\n`, "utf8");

  const addedCount = nextProducts.length - existingProducts.length;
  const reviewCount = nextProducts.filter((product) => product.needsReview).length;
  console.log(`Scanned ${imagePaths.length} images.`);
  console.log(`Added ${addedCount} new products. Total products: ${nextProducts.length}.`);
  console.log(`Products needing review: ${reviewCount}.`);
}

main();
