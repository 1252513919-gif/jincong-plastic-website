import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedLeads = [
  ["河北恒驰自行车零件集团有限公司", "河北邢台", "童车/自行车零件", "童车、儿童自行车及相关零部件"],
  ["河北贝儿佳儿童用品有限公司", "河北邢台", "儿童用品", "儿童车、婴童用品及塑料配件"],
  ["河北红思达车业有限公司", "河北邢台", "车业", "童车、自行车及车用配件"],
  ["河北库比车业有限公司", "河北邢台", "车业", "儿童车、滑步车及车架配件"],
  ["河北盛马电子科技有限公司", "河北", "电子电气", "电子电气产品、外壳及固定配件"],
  ["河北蓝鸟家具股份有限公司", "河北邢台", "家具", "办公家具、家具结构件及配套五金塑料件"],
  ["荣喜宠物食品有限公司", "河北", "宠物用品", "宠物食品及宠物用品配套件"],
  ["邢台诺德宠物用品有限公司", "河北邢台", "宠物用品", "宠物用品、宠物出行及喂养相关产品"],
  ["河北酷贝宠物用品有限公司", "河北", "宠物用品", "宠物用品及相关塑料结构件"],
  ["清河县利国汽车配件有限公司", "河北邢台", "汽车配件", "汽车配件、卡扣、堵盖及橡塑配件"]
] as const;

async function main() {
  await prisma.systemSetting.upsert({
    where: { id: "lead-dev" },
    update: {},
    create: { id: "lead-dev", testMode: true }
  });

  for (const [companyName, region, industry, productSummary] of seedLeads) {
    await prisma.lead.upsert({
      where: { id: companyName },
      update: {},
      create: {
        id: companyName,
        companyName,
        region,
        industry,
        productSummary,
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
