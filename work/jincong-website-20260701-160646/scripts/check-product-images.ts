import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

type ProductRecord = {
  id: string;
  nameZh: string;
  image: string;
};

const rootDir = process.cwd();
const productsPath = path.join(rootDir, "data", "products.json");

function main() {
  const products = JSON.parse(readFileSync(productsPath, "utf8")) as ProductRecord[];
  const missing = products.filter((product) => {
    const imagePath = path.join(rootDir, "public", product.image.replace(/^\//, ""));
    return !existsSync(imagePath);
  });

  if (missing.length > 0) {
    console.error(`Missing ${missing.length} product images:`);
    for (const product of missing) {
      console.error(`- ${product.id} | ${product.nameZh} | ${product.image}`);
    }
    process.exit(1);
  }

  console.log(`Checked ${products.length} products. All image paths exist.`);
}

main();
