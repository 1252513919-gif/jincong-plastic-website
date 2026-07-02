import { site } from "@/lib/site";
import type { Locale } from "./routing";

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
      subtitle: "注塑加工与塑料件定制，从样品到批量生产",
      description:
        "支持来图来样加工、小批量试产、OEM/ODM 定制和工厂直连沟通，适合有图纸、样品、产品图片或长期供货需求的客户。",
      keywords: ["注塑加工", "塑料件定制", "来图来样加工", "小批量试产", "OEM/ODM", "工厂直供", "多行业塑料件定制"],
      visualLabels: ["样品沟通", "材料确认", "试产交付"]
    },
    stats: [
      { value: "100+", label: "产品类型", note: "产品图片仅为部分加工示例" },
      { value: "来图来样", label: "支持加工", note: "图纸、样品、图片、尺寸均可先沟通" },
      { value: "小批量", label: "支持试产", note: "适合新品验证和前期采购测试" },
      { value: "OEM/ODM", label: "定制配合", note: "材料、尺寸、结构、颜色可沟通" }
    ],
    intro: {
      eyebrow: "Factory Positioning",
      title: "我们是一家专注塑料件加工与注塑定制的工厂",
      body:
        "邢台锦聪橡塑有限公司面向有图纸、样品、产品图片或定制需求的客户，提供来图来样加工、小批量试产和批量供货服务。我们目前重点覆盖宠物用品塑料件、电子电气塑料件、家具塑料配件、平垫系列、汽车塑料件等产品方向，适合需要灵活沟通和中小批量配合的项目。",
      customerTitle: "适合这些客户",
      customerText: "有样品、图纸、产品图片、定制需求、小批量试产需求或长期批量采购需求的客户。",
      points: ["工厂直连沟通", "支持来图来样加工", "支持小批量试产", "按材料、尺寸和用途定制"]
    },
    series: [
      { title: "宠物用品系列", text: "宠物推车配件、宠物箱配件、牵引用品塑料件、饮水喂食器配件等。", slug: "pet-plastic-products" },
      { title: "电子电气塑料件系列", text: "电源开关配件、接线盒、电池盒、线夹、端盖、保护盖、塑料固定座等。", slug: "electronic-electrical-plastic-parts" },
      { title: "家具塑料配件系列", text: "脚垫、堵头、连接件、调节脚、保护套、塑料垫片和装饰盖。", slug: "furniture-plastic-fittings" },
      { title: "平垫 / 垫片系列", text: "标准圆形平垫、尼龙平垫、绝缘垫片、密封垫片、非标垫圈等。", slug: "plastic-washers" },
      { title: "汽车塑料件系列", text: "汽车卡扣、堵盖、垫片、支架、内饰塑料件、外饰塑料件、电气塑料件。", slug: "automotive-plastic-parts" },
      { title: "通用塑料件定制", text: "按图纸、样品、产品图片、装配要求或使用场景定制加工。", slug: "custom" }
    ],
    capabilities: [
      "ABS / PP / PE / PC / POM / PVC / 尼龙等材料可沟通",
      "支持产品图片、实物样品、2D 图纸、3D 文件沟通",
      "支持小批量试产和批量供货",
      "支持 OEM/ODM 定制和长期配套",
      "尺寸、颜色、结构和包装要求可沟通",
      "工厂直连，适合中小批量定制项目"
    ],
    process: ["需求沟通", "图纸 / 样品确认", "材料与工艺确认", "报价", "打样 / 小批量试产", "批量生产", "包装交付"],
    contact: {
      title: "把图纸、样品或产品图片发给我们",
      body: "请尽量提供产品用途、尺寸、材料、数量、颜色和是否已有图纸或样品，便于更快判断加工方案和报价。",
      phone: "手机",
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
          "我们的塑料件加工服务可应用于宠物用品、电子电气、家具配件、汽车零部件、仪器仪表及其他定制塑料结构件。不同场景对材料性能、尺寸稳定性、耐磨性、耐候性和装配结构有不同要求，可根据样品、图纸和使用环境沟通加工。"
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
      contact: "手机 / WhatsApp / 微信",
      email: "邮箱",
      product: "产品需求",
      category: "产品类别",
      quantity: "预计数量",
      material: "材料要求",
      drawing: "是否有图纸或样品",
      message: "留言内容",
      placeholders: {
        name: "请输入姓名",
        company: "可选",
        contact: "便于我们快速联系",
        email: "example@company.com",
        product: "如：塑料垫片、汽车卡扣、电子外壳",
        quantity: "如：100件试产 / 3000件/月",
        material: "如：ABS、PP、POM，或待沟通",
        message: "请描述尺寸、用途、颜色、包装、交期等要求"
      },
      drawingOptions: ["有图纸", "有样品", "有产品图片", "暂时没有"],
      submit: "提交询盘",
      submitting: "提交中...",
      success: "询盘已提交，我们会尽快联系您。",
      error: "提交失败，请稍后重试，或直接通过手机/微信联系我们。"
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
      subtitle: "Injection Molding & Custom Plastic Parts, from Samples to Batch Production",
      description:
        "We support drawing/sample based manufacturing, small-batch trial runs, OEM/ODM customization and direct factory communication for customers with drawings, samples, product photos or long-term supply needs.",
      keywords: ["Injection Molding", "Custom Plastic Parts", "By Drawing / Sample", "Small Batch Trial", "OEM/ODM", "Factory Direct", "Multi-industry Parts"],
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
      title: "A practical factory for plastic parts manufacturing and injection molding",
      body:
        "Xingtai Jincong Rubber & Plastic Co., Ltd. works with customers who have drawings, samples, product photos or custom plastic part requirements. We support drawing/sample based manufacturing, small-batch trial production and batch supply, with product coverage across pet products, electronic and electrical parts, furniture fittings, washers and automotive plastic parts.",
      customerTitle: "Who We Fit",
      customerText: "Customers with samples, drawings, product photos, custom needs, small-batch trial requirements or long-term batch purchasing plans.",
      points: ["Direct factory communication", "Drawing/sample based manufacturing", "Small-batch trial production", "Customized by material, size and application"]
    },
    series: [
      { title: "Pet Plastic Products", text: "Pet stroller parts, carrier parts, leash housings, feeding and watering accessories.", slug: "pet-plastic-products" },
      { title: "Electronic & Electrical Plastic Parts", text: "Power switch fittings, junction boxes, battery boxes, clips, end caps, covers and fixing bases.", slug: "electronic-electrical-plastic-parts" },
      { title: "Furniture Plastic Fittings", text: "Glides, plugs, connectors, adjustable feet, protective caps, washers and decorative covers.", slug: "furniture-plastic-fittings" },
      { title: "Plastic Washers / Gaskets", text: "Round washers, nylon washers, insulation gaskets, sealing washers and custom rings.", slug: "plastic-washers" },
      { title: "Automotive Plastic Parts", text: "Automotive clips, plugs, washers, brackets, interior parts, exterior parts and electrical plastic parts.", slug: "automotive-plastic-parts" },
      { title: "General Custom Plastic Parts", text: "Custom manufacturing by drawings, samples, product photos, assembly needs or application scenarios.", slug: "custom" }
    ],
    capabilities: [
      "ABS / PP / PE / PC / POM / PVC / Nylon and other materials can be discussed",
      "Product photos, physical samples, 2D drawings and 3D files can be reviewed",
      "Small-batch trials and batch supply are supported",
      "OEM/ODM customization and long-term supply cooperation",
      "Dimensions, colors, structure and packaging can be discussed",
      "Direct factory communication for small and medium batch projects"
    ],
    process: ["Requirement Review", "Drawing / Sample Check", "Material & Process", "Quotation", "Trial Run", "Batch Production", "Packing & Delivery"],
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
          "Our plastic parts manufacturing service can be used in pet products, electronics, furniture fittings, automotive components, instruments and other custom plastic structures. Material performance, dimensional stability, wear resistance, weather resistance and assembly details vary by application."
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
      contact: "Phone / WhatsApp / WeChat",
      email: "Email",
      product: "Product Requirement",
      category: "Product Category",
      quantity: "Estimated Quantity",
      material: "Material Requirement",
      drawing: "Drawing or Sample Available",
      message: "Message",
      placeholders: {
        name: "Your name",
        company: "Optional",
        contact: "How we can reach you quickly",
        email: "example@company.com",
        product: "e.g. plastic washer, automotive clip, electronic housing",
        quantity: "e.g. 100 pcs trial / 3000 pcs per month",
        material: "e.g. ABS, PP, POM, or to be discussed",
        message: "Dimensions, application, color, packaging and delivery requirements"
      },
      drawingOptions: ["Drawing available", "Sample available", "Product photos available", "Not yet"],
      submit: "Submit Inquiry",
      submitting: "Submitting...",
      success: "Inquiry submitted. We will contact you soon.",
      error: "Submission failed. Please try again later or contact us by phone/WeChat."
    },
    footer: {
      summary: "Injection molding, custom plastic parts, drawing/sample manufacturing, small-batch trial production, OEM/ODM and direct factory communication."
    }
  }
} satisfies Record<Locale, Record<string, unknown>>;

export function t(locale: Locale) {
  return content[locale];
}
