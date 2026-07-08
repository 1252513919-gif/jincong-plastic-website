import { site } from "@/lib/site";
import type { Locale } from "./routing";

const processZh = [
  "需求沟通",
  "图纸 / 样品确认",
  "材料与工艺确认",
  "报价",
  "打样 / 小批量试产",
  "批量生产",
  "包装发货"
];

const processEn = [
  "Requirement Discussion",
  "Drawing / Sample Confirmation",
  "Material & Process Confirmation",
  "Quotation",
  "Sampling / Trial Production",
  "Batch Production",
  "Packaging & Delivery"
];

export const content = {
  zh: {
    lang: "中文",
    altLang: "EN",
    nav: [
      { href: "/", label: "首页" },
      { href: "/products", label: "产品中心" },
      { href: "/custom-injection-molding", label: "注塑定制" },
      { href: "/industries", label: "应用行业" },
      { href: "/about", label: "关于锦聪" },
      { href: "/faq", label: "FAQ" }
    ],
    actions: {
      quote: "获取报价",
      quoteLong: "发送需求获取报价",
      products: "查看产品系列",
      contact: "联系我们",
      details: "查看详情",
      reset: "清空筛选",
      submit: "提交询盘"
    },
    hero: {
      eyebrow: "Plastic Injection Molding / OEM / ODM",
      title: site.name,
      subtitle: "注塑加工与塑料件定制，从样品确认到批量生产",
      descriptionLines: [
        "来图来样加工｜小批量试产｜OEM/ODM定制｜工厂直连沟通",
        "适合有图纸、样品、产品图片或长期供货需求的客户"
      ],
      keywords: ["工厂直供", "来图来样加工", "小批量试产", "多行业塑料件定制"],
      visualLabels: ["样品确认", "材料选择", "试产交付"]
    },
    stats: [
      { value: "100+", label: "产品类型", note: "网站图片展示部分塑料件加工示例" },
      { value: "来图来样", label: "支持加工", note: "图纸、样品、图片、尺寸均可先沟通" },
      { value: "小批量", label: "支持试产", note: "适合新品验证和前期采购测试" },
      { value: "OEM/ODM", label: "定制配合", note: "材料、尺寸、结构、颜色可沟通确认" }
    ],
    intro: {
      eyebrow: "Factory Positioning",
      title: "我们是一家专注塑料件加工与注塑定制的工厂",
      body:
        "邢台锦聪橡塑有限公司面向有图纸、样品、产品图片或定制需求的客户，提供来图来样加工、小批量试产和批量供货服务。我们重点覆盖宠物用品塑料件、电子电气塑料件、家具塑料配件、平垫系列和汽车塑料件等产品方向，适合需要灵活沟通和中小批量配合的项目。",
      customerTitle: "适合这些客户",
      customerText: "有样品、图纸、产品图片、定制需求、小批量试产需求或长期批量采购需求的客户。",
      points: ["工厂直连沟通", "支持来图来样加工", "支持小批量试产", "按材料、尺寸和用途定制"]
    },
    series: [
      {
        title: "宠物用品系列",
        text: "可定制宠物推车塑料配件、宠物箱配件、牵引用品塑料件、宠物用品结构件，支持按样品、图纸或产品图片加工。",
        slug: "pet-plastic-products",
        tags: ["宠物箱配件", "牵引用品", "喂养配件"]
      },
      {
        title: "电子电气塑料件系列",
        text: "可加工接线盒、电池盒、保护盖、线夹、端盖、塑料固定座等电子电气类塑料零部件。",
        slug: "electronic-electrical-plastic-parts",
        tags: ["接线盒", "保护盖", "仪器壳体"]
      },
      {
        title: "家具塑料配件系列",
        text: "可定制家具脚垫、堵头、调节脚、连接件、保护套、塑料垫片等家具配套零件。",
        slug: "furniture-plastic-fittings",
        tags: ["脚垫", "堵头", "装饰盖"]
      },
      {
        title: "平垫系列",
        text: "提供尼龙、PP、PE、POM、PVC、PC 等材质平垫、绝缘垫片、透明垫片及非标垫片定制。",
        slug: "plastic-washers",
        tags: ["尼龙平垫", "绝缘垫片", "非标垫圈"]
      },
      {
        title: "汽车塑料件系列",
        text: "可加工汽车卡扣、堵盖、支架、内饰塑料件、外饰塑料件、电气保护件等汽车相关塑料零部件。",
        slug: "automotive-plastic-parts",
        tags: ["汽车卡扣", "堵盖", "支架"]
      }
    ],
    capabilities: [
      "ABS / PP / PE / PC / POM / PVC / 尼龙等材料可沟通",
      "支持产品图片、实物样品、2D 图纸、3D 文件沟通",
      "支持小批量试产和批量供货",
      "支持 OEM/ODM 定制和长期配合",
      "尺寸、颜色、结构和包装要求可沟通",
      "工厂直连，适合中小批量定制项目"
    ],
    process: processZh,
    processDetails: [
      "客户提供产品图片、样品、图纸、尺寸、材料、数量和使用场景。",
      "根据结构、尺寸、材料、精度和使用环境判断加工方式。",
      "确认可加工性、材料选择、颜色、数量区间、交期和质量要求。",
      "根据产品结构、材料、数量、加工难度和包装要求进行报价。",
      "根据需求进行小批量试样或样品确认。",
      "样品确认后进入批量加工和质量检查。",
      "根据客户要求进行包装、发货和后续沟通。"
    ],
    contact: {
      title: "把图纸、样品或产品图片发给我们",
      body: "请尽量提供产品用途、尺寸、材料、数量、颜色和是否已有图纸或样品，便于更快判断加工方案和报价。",
      phone: "电话",
      wechat: "微信",
      email: "邮箱",
      submit: "提交定制需求"
    },
    pages: {
      products: {
        eyebrow: "Products",
        title: "产品中心",
        description:
          "按五大产品系列和二级分类查看塑料件加工示例。网站图片为部分产品展示，实际可根据图纸、样品、尺寸、材料和使用场景定制加工。"
      },
      custom: {
        eyebrow: "Custom Injection Molding",
        title: "注塑定制",
        description:
          "我们支持来图来样加工和塑料件定制服务。客户可提供产品图片、实物样品、尺寸要求、材料要求或图纸文件，我们会根据产品结构、使用场景、数量和材料需求进行沟通确认，并提供相应的加工方案和报价建议。"
      },
      industries: {
        eyebrow: "Industries",
        title: "应用行业",
        description:
          "我们的塑料件加工服务可应用于多个行业，包括宠物用品、电子电气、家具配件、汽车零部件、仪器仪表及其他定制塑料结构件。不同应用场景对材料性能、尺寸稳定性、耐磨性、耐候性和装配结构有不同要求，我们可根据客户提供的样品、图纸和使用环境进行沟通加工。"
      },
      about: {
        eyebrow: "About Jincong",
        title: "关于锦聪",
        description:
          "邢台锦聪橡塑有限公司专注于塑料件加工与注塑定制服务，面向有图纸、样品或定制需求的客户，提供来图来样加工、小批量试产和批量供货服务。"
      },
      contact: {
        eyebrow: "Contact",
        title: "联系询盘",
        description: "发送图纸、样品照片、尺寸、用途或采购数量，我们会根据实际需求沟通注塑加工方案。"
      },
      faq: {
        eyebrow: "FAQ",
        title: "常见问题",
        description: "整理客户在来图加工、样品确认、小批量试产、材料选择、报价和交付前经常会问到的问题。"
      }
    },
    productExplorer: {
      search: "搜索产品名称、系列或二级分类",
      allSeries: "全部系列",
      allSubcategories: "全部二级分类",
      showing: "当前展示",
      totalSuffix: "个产品",
      customTag: "支持来图来样",
      empty: "没有匹配的产品，可调整筛选条件，或直接提交图纸、样品和产品图片沟通报价。",
      note:
        "以上产品为部分塑料件加工示例。我们可根据客户提供的图纸、样品、尺寸、材料要求和使用场景进行定制加工，支持小批量试产和批量供货。不同产品可根据使用环境选择 ABS、PP、PE、POM、PVC、PC、尼龙等材料，具体方案可沟通确认。"
    },
    inquiry: {
      name: "姓名",
      company: "公司名称",
      phone: "电话",
      wechat: "微信",
      email: "邮箱",
      product: "产品需求",
      category: "产品类型",
      quantity: "预计数量",
      material: "材料要求",
      drawing: "是否有图纸/样品",
      message: "需求描述",
      placeholders: {
        name: "请输入姓名",
        company: "选填",
        phone: "电话或手机号",
        wechat: "微信号，至少与电话填写一项",
        email: "example@company.com",
        product: "如：塑料垫片、汽车卡扣、电子外壳",
        quantity: "如：100件试产 / 3000件/月",
        material: "如：ABS、PP、POM，或待沟通",
        message: "请描述尺寸、用途、颜色、包装、交期等要求"
      },
      drawingOptions: ["有图纸", "有样品", "有产品图片", "暂时没有"],
      submit: "提交询盘",
      submitting: "正在提交...",
      success: "提交成功，我们已收到您的定制需求。",
      successDetail: "我们会根据您提供的产品用途、材料、数量和图纸/样品情况，尽快与您联系确认加工方案。",
      error: "提交暂时未成功，您可以直接通过以下方式联系我们：",
      validation: "请至少填写电话或微信，并填写需求描述。"
    },
    footer: {
      summary: "注塑加工、塑料件定制、来图来样加工、小批量试产、OEM/ODM 和工厂直连沟通。"
    }
  },
  en: {
    lang: "English",
    altLang: "中文",
    nav: [
      { href: "/", label: "Home" },
      { href: "/products", label: "Products" },
      { href: "/custom-injection-molding", label: "Custom Molding" },
      { href: "/industries", label: "Industries" },
      { href: "/about", label: "About Jincong" },
      { href: "/faq", label: "FAQ" }
    ],
    actions: {
      quote: "Get a Quote",
      quoteLong: "Send Requirement for Quote",
      products: "View Product Series",
      contact: "Contact Us",
      details: "View Details",
      reset: "Clear Filters",
      submit: "Submit Inquiry"
    },
    hero: {
      eyebrow: "Plastic Injection Molding / OEM / ODM",
      title: site.englishName,
      subtitle: "Injection molding and custom plastic parts, from sample confirmation to batch production.",
      descriptionLines: [
        "Drawing-based production | Sample-based customization | Small-batch trial production | OEM/ODM",
        "Suitable for customers with drawings, samples, product photos, or long-term supply needs."
      ],
      keywords: ["Factory Direct", "Drawing & Sample Customization", "Small-Batch Trial Production", "Multi-Industry Plastic Parts"],
      visualLabels: ["Sample Review", "Material Check", "Trial Delivery"]
    },
    stats: [
      { value: "100+", label: "Product Types", note: "Product photos show part of our manufacturing scope" },
      { value: "Drawings", label: "Sample Support", note: "Drawings, samples, photos and dimensions can be reviewed" },
      { value: "Small Batch", label: "Trial Runs", note: "Suitable for validation and early purchase testing" },
      { value: "OEM/ODM", label: "Custom Support", note: "Material, dimension, structure and color can be discussed" }
    ],
    intro: {
      eyebrow: "Factory Positioning",
      title: "A factory focused on plastic parts manufacturing and injection molding",
      body:
        "Xingtai Jincong Rubber & Plastic Co., Ltd. works with customers who have drawings, samples, product photos or custom plastic part requirements. We support drawing/sample based manufacturing, small-batch trial production and batch supply, with product coverage across pet product parts, electrical and electronic parts, furniture fittings, flat washers and automotive plastic parts.",
      customerTitle: "Who We Fit",
      customerText: "Customers with samples, drawings, product photos, custom needs, small-batch trial requirements or long-term batch purchasing plans.",
      points: ["Direct factory communication", "Drawing/sample based manufacturing", "Small-batch trial production", "Customized by material, size and application"]
    },
    series: [
      {
        title: "Pet Product Parts",
        text: "Custom pet stroller parts, carrier parts, leash housings and structural pet product parts based on samples, drawings or product photos.",
        slug: "pet-plastic-products",
        tags: ["Carrier Parts", "Leash Parts", "Feeding Parts"]
      },
      {
        title: "Electrical & Electronic Plastic Parts",
        text: "Junction boxes, battery boxes, protective covers, wire clips, end caps and plastic fixing bases for electrical applications.",
        slug: "electronic-electrical-plastic-parts",
        tags: ["Junction Boxes", "Covers", "Instrument Housings"]
      },
      {
        title: "Furniture Plastic Accessories",
        text: "Furniture glides, tube plugs, adjustable feet, connectors, protective caps, washers and matching plastic fittings.",
        slug: "furniture-plastic-fittings",
        tags: ["Glides", "Tube Plugs", "Caps"]
      },
      {
        title: "Flat Washers",
        text: "Nylon, PP, PE, POM, PVC and PC washers, insulation washers, transparent washers and custom non-standard gaskets.",
        slug: "plastic-washers",
        tags: ["Nylon Washers", "Insulation Washers", "Custom Gaskets"]
      },
      {
        title: "Automotive Plastic Parts",
        text: "Automotive clips, plugs, brackets, interior plastic parts, exterior plastic parts and electrical protective components.",
        slug: "automotive-plastic-parts",
        tags: ["Auto Clips", "Caps", "Brackets"]
      }
    ],
    capabilities: [
      "ABS / PP / PE / PC / POM / PVC / Nylon and other materials can be discussed",
      "Product photos, physical samples, 2D drawings and 3D files can be reviewed",
      "Small-batch trials and batch supply are supported",
      "OEM/ODM customization and long-term supply cooperation",
      "Dimensions, colors, structure and packaging can be discussed",
      "Direct factory communication for small and medium batch projects"
    ],
    process: processEn,
    processDetails: [
      "Customers provide product photos, samples, drawings, dimensions, materials, quantity and application scenario.",
      "We review structure, size, material, accuracy requirements and use environment to judge the processing method.",
      "Manufacturability, material choice, color, quantity range, lead time and quality requirements are confirmed.",
      "Quotation is based on part structure, material, quantity, processing difficulty and packaging requirements.",
      "Small-batch samples or trial production are arranged when needed.",
      "Batch processing and quality checks start after sample confirmation.",
      "Packaging, delivery and follow-up communication are arranged according to customer requirements."
    ],
    contact: {
      title: "Send us drawings, samples or product photos",
      body: "Please include application, dimensions, material, quantity, color and whether drawings or samples are available, so we can review the manufacturing approach and quotation faster.",
      phone: "Phone",
      wechat: "WeChat",
      email: "Email",
      submit: "Submit Custom Request"
    },
    pages: {
      products: {
        eyebrow: "Products",
        title: "Product Center",
        description:
          "Browse manufacturing examples by five main product series and subcategories. Product photos show part of our capability; actual parts can be customized by drawings, samples, dimensions, materials and application scenarios."
      },
      custom: {
        eyebrow: "Custom Injection Molding",
        title: "Custom Injection Molding",
        description:
          "We support drawing/sample based manufacturing and custom plastic parts. Customers can provide product photos, physical samples, dimensions, material requirements or drawing files. We review structure, application, quantity and material needs before suggesting a manufacturing plan and quotation."
      },
      industries: {
        eyebrow: "Industries",
        title: "Industries",
        description:
          "Our plastic parts manufacturing service can be used in pet products, electrical and electronic parts, furniture fittings, automotive components, instruments and other custom plastic structures. Material performance, dimensional stability, wear resistance, weather resistance and assembly details vary by application."
      },
      about: {
        eyebrow: "About Jincong",
        title: "About Jincong",
        description:
          "Xingtai Jincong Rubber & Plastic Co., Ltd. focuses on plastic parts manufacturing and custom injection molding for customers with drawings, samples or custom requirements."
      },
      contact: {
        eyebrow: "Contact",
        title: "Contact & Inquiry",
        description: "Send drawings, sample photos, dimensions, applications or purchase quantity. We will review the injection molding approach based on your actual needs."
      },
      faq: {
        eyebrow: "FAQ",
        title: "Frequently Asked Questions",
        description: "Common questions about drawing-based manufacturing, sample review, small-batch trials, material selection, quotation and delivery."
      }
    },
    productExplorer: {
      search: "Search product name, series or subcategory",
      allSeries: "All Series",
      allSubcategories: "All Subcategories",
      showing: "Showing",
      totalSuffix: "products",
      customTag: "Custom by drawing/sample",
      empty: "No matching products. Adjust filters or send drawings, samples or product photos for a quotation.",
      note:
        "The products above are examples of plastic part manufacturing. We can manufacture custom parts according to drawings, samples, dimensions, material requirements and application scenarios, supporting small-batch trials and batch supply. Materials such as ABS, PP, PE, POM, PVC, PC and Nylon can be discussed based on the application."
    },
    inquiry: {
      name: "Name",
      company: "Company",
      phone: "Phone",
      wechat: "WeChat",
      email: "Email",
      product: "Product Requirement",
      category: "Product Type",
      quantity: "Estimated Quantity",
      material: "Material Requirement",
      drawing: "Drawing or Sample Available",
      message: "Requirement Details",
      placeholders: {
        name: "Your name",
        company: "Optional",
        phone: "Phone or mobile number",
        wechat: "WeChat ID, required if phone is empty",
        email: "example@company.com",
        product: "e.g. plastic washer, automotive clip, electronic housing",
        quantity: "e.g. 100 pcs trial / 3000 pcs per month",
        material: "e.g. ABS, PP, POM, or to be discussed",
        message: "Dimensions, application, color, packaging and delivery requirements"
      },
      drawingOptions: ["Drawing available", "Sample available", "Product photos available", "Not yet"],
      submit: "Submit Inquiry",
      submitting: "Submitting...",
      success: "Submitted successfully. We have received your requirement.",
      successDetail: "We will review your product use, material, quantity, drawing or sample information, and contact you as soon as possible to confirm the processing solution.",
      error: "Submission was not completed. You can contact us directly:",
      validation: "Please fill in at least phone or WeChat, and describe your requirement."
    },
    footer: {
      summary: "Injection molding, custom plastic parts, drawing/sample manufacturing, small-batch trial production, OEM/ODM and direct factory communication."
    }
  }
} satisfies Record<Locale, Record<string, unknown>>;

export function t(locale: Locale) {
  return content[locale];
}
