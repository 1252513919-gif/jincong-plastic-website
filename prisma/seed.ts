import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedLeads = [
  {
    id: "lead-hebei-hengchi-bicycle-parts",
    companyName: "河北恒驰自行车零件集团有限公司",
    region: "河北邢台",
    industry: "童车/自行车零件",
    productSummary: "童车、儿童自行车及相关零部件"
  },
  {
    id: "lead-hebei-beierjia-child-products",
    companyName: "河北贝儿佳儿童用品有限公司",
    region: "河北邢台",
    industry: "儿童用品",
    productSummary: "儿童车、婴童用品及塑料配件"
  },
  {
    id: "lead-hebei-hongsida-vehicles",
    companyName: "河北红思达车业有限公司",
    region: "河北邢台",
    industry: "车业",
    productSummary: "童车、自行车及车用配件"
  },
  {
    id: "lead-hebei-kubi-vehicles",
    companyName: "河北库比车业有限公司",
    region: "河北邢台",
    industry: "车业",
    productSummary: "儿童车、滑步车及车架配件"
  },
  {
    id: "lead-hebei-shengma-electronics",
    companyName: "河北盛马电子科技有限公司",
    region: "河北",
    industry: "电子电气",
    productSummary: "电子电气产品、外壳及固定配件"
  },
  {
    id: "lead-hebei-lanniao-furniture",
    companyName: "河北蓝鸟家具股份有限公司",
    region: "河北邢台",
    industry: "家具",
    productSummary: "办公家具、家具结构件及配套五金塑料件"
  },
  {
    id: "lead-rongxi-pet-food",
    companyName: "荣喜宠物食品有限公司",
    region: "河北",
    industry: "宠物用品",
    productSummary: "宠物食品及宠物用品配套件"
  },
  {
    id: "lead-xingtai-nuode-pet-products",
    companyName: "邢台诺德宠物用品有限公司",
    region: "河北邢台",
    industry: "宠物用品",
    productSummary: "宠物用品、宠物出行及喂养相关产品"
  },
  {
    id: "lead-hebei-kubei-pet-products",
    companyName: "河北酷贝宠物用品有限公司",
    region: "河北",
    industry: "宠物用品",
    productSummary: "宠物用品及相关塑料结构件"
  },
  {
    id: "lead-qinghe-liguo-auto-parts",
    companyName: "清河县利国汽车配件有限公司",
    region: "河北邢台",
    industry: "汽车配件",
    productSummary: "汽车配件、卡扣、堵盖及橡塑配件"
  }
] as const;

async function main() {
  await prisma.systemSetting.upsert({
    where: { id: "lead-dev" },
    update: {},
    create: { id: "lead-dev", testMode: true }
  });

  for (const lead of seedLeads) {
    await prisma.lead.upsert({
      where: { id: lead.id },
      update: {
        companyName: lead.companyName,
        region: lead.region,
        industry: lead.industry,
        productSummary: lead.productSummary
      },
      create: {
        ...lead,
        priority: "MEDIUM",
        contactVerificationStatus: "UNVERIFIED",
        notes: "首批内置客户。发送前必须重新访问官网或公开来源验证联系方式。"
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
