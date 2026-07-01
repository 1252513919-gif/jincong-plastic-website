import { site } from "@/lib/site";
import type { Locale } from "./routing";

export const content = {
  zh: {
    lang: "中文",
    altLang: "English",
    nav: [
      { href: "/", label: "首页" },
      { href: "/products", label: "产品中心" },
      { href: "/custom-injection-molding", label: "注塑定制" },
      { href: "/industries", label: "应用行业" },
      { href: "/factory-capability", label: "工厂实力" },
      { href: "/about", label: "关于我们" },
      { href: "/faq", label: "FAQ" }
    ],
    actions: {
      quote: "发送图纸获取报价",
      products: "查看产品系列",
      contact: "联系我们",
      details: "查看详情",
      reset: "清空筛选"
    },
    hero: {
      eyebrow: "Injection Molding / OEM / Small Batch",
      title: "注塑加工与塑料件定制工厂",
      description:
        "面向中小批量塑料件需求，支持来图来样定制、小批量试产、OEM 代工与工厂直供，从材料建议到生产交付直接沟通。",
      badges: ["来图来样定制", "小批量试产", "OEM 代工", "ABS / PP / PE / PC / PVC"],
      visualLabels: ["材料确认", "打样试产", "批量交付"]
    },
    stats: [
      { value: "5+", label: "核心产品系列", note: "平垫、汽车、电子电器、宠物用品、家具配件" },
      { value: "180+", label: "产品展示", note: "基于现有产品图片与分类持续更新" },
      { value: "OEM", label: "代工支持", note: "支持图纸、样品、颜色和包装要求" },
      { value: "Flexible", label: "灵活沟通", note: "适合中小批量订单与试产需求" }
    ],
    intro: {
      eyebrow: "Factory Positioning",
      title: "真实工厂直接沟通，适合中小批量注塑加工",
      body:
        "锦聪橡塑专注于注塑加工与塑料件定制服务，可根据客户图纸、样品、尺寸、材料和颜色要求进行加工。我们重点覆盖宠物用品系列、电子电气塑料件系列、家具塑料配件系列、平垫系列和汽车塑料件系列，适合中小批量订单、小批量试产和常用塑料配件定制需求。",
      points: ["来图来样加工", "材料与结构建议", "小批量试产", "常用塑料件稳定供货"]
    },
    series: [
      { title: "平垫 / 垫片系列", text: "尼龙平垫、塑料平垫、绝缘垫片、定制垫圈等。", accent: "blue" },
      { title: "汽车塑料件", text: "汽车卡扣、塑料堵盖、支架、垫片、内外饰小件等。", accent: "silver" },
      { title: "电子电器塑料件", text: "塑料外壳、线夹、线扣、保护盖、固定座等。", accent: "cyan" },
      { title: "宠物用品塑料件", text: "宠物饮水器配件、喂食器配件、塑料连接件等。", accent: "gold" },
      { title: "家具塑料配件", text: "家具脚垫、堵盖、调节脚、连接件和装饰盖。", accent: "blue" },
      { title: "通用塑料件定制", text: "按图纸、样品、尺寸、材质和颜色定制生产。", accent: "silver" }
    ],
    industries: ["汽车行业", "电子电器", "仪器仪表", "家具配件", "宠物用品", "工业设备"],
    capabilities: [
      "ABS / PP / PE / POM / PVC / PC 等材料",
      "来图加工与来样加工",
      "小批量试产与常规批量生产",
      "OEM 代工与包装配合",
      "工厂直供，沟通灵活",
      "尺寸、颜色、材料可按需求调整"
    ],
    process: ["需求沟通", "图纸 / 样品确认", "材料与工艺确认", "报价", "打样 / 试产", "批量生产", "包装交付"],
    about: {
      title: "从常用塑料配件到定制注塑件，重视可落地的加工配合",
      body:
        "相比复杂的大型供应链流程，我们更重视直接沟通、快速响应和灵活配合。客户可以先提供图纸、样品照片、尺寸或应用场景，我们会结合材料、结构、数量和交期评估适合的加工方式。"
    },
    contact: {
      title: "把图纸、样品或需求发给我们",
      body: "请尽量提供产品用途、尺寸、材质、数量、颜色和是否已有图纸或样品，便于快速评估报价。",
      phone: "手机号",
      wechat: "微信号",
      email: "邮箱",
      submit: "提交定制需求"
    },
    footer: {
      summary: "专注注塑加工、塑料件定制、来图来样加工、OEM 代工和小批量试产。"
    },
    pages: {
      products: {
        eyebrow: "Products",
        title: "产品中心",
        description: "按分类、材质和名称快速筛选现有产品，所有产品均可围绕图纸、样品、材料、颜色、尺寸和包装要求进行定制。"
      },
      custom: {
        eyebrow: "Custom Injection Molding",
        title: "注塑定制服务",
        description: "围绕图纸、样品、材料、颜色、数量和交期提供塑料件注塑加工配合。"
      },
      industries: {
        eyebrow: "Industries",
        title: "应用行业",
        description: "覆盖汽车、电子电器、仪器仪表、家具、宠物用品与工业设备等常用塑料件场景。"
      },
      factory: {
        eyebrow: "Factory Capability",
        title: "工厂实力",
        description: "以材料选择、试产配合、批量生产和直接沟通为核心，为中小批量塑料件订单提供稳定支持。"
      },
      about: {
        eyebrow: "About",
        title: site.name,
        description: "专注注塑加工与塑料件定制服务，服务来图来样定制、小批量试产、OEM 代工和工厂直供需求。"
      },
      contact: {
        eyebrow: "Contact",
        title: "联系我们",
        description: "发送图纸、样品照片、尺寸、用途或采购数量，我们会根据实际需求评估注塑加工方案。"
      },
      faq: {
        eyebrow: "FAQ",
        title: "常见问题",
        description: "整理客户在注塑加工、材料选择、试产、报价和交付前经常会问到的问题。"
      }
    },
    productExplorer: {
      search: "搜索产品名称、英文名或分类",
      allCategories: "全部分类",
      allMaterials: "全部材质",
      showing: "当前展示",
      totalSuffix: "个产品",
      customTag: "支持来图来样定制",
      empty: "没有匹配的产品，可调整筛选条件或直接提交图纸需求。"
    },
    inquiry: {
      name: "姓名",
      namePlaceholder: "请输入姓名",
      phone: "电话 / 微信",
      phonePlaceholder: "便于我们快速联系",
      email: "邮箱",
      product: "产品需求",
      productPlaceholder: "如：塑料垫片、汽车塑料件",
      material: "材质",
      materialPlaceholder: "请选择或后续沟通",
      other: "其他",
      quantity: "数量",
      quantityPlaceholder: "如：500件、3000件/月",
      drawing: "是否有图纸 / 样品",
      drawingOptions: ["有图纸", "有样品", "暂时没有"],
      message: "留言",
      messagePlaceholder: "请描述尺寸、用途、颜色、包装、交期等要求",
      submitted: "表单结构已就绪。上线前接入邮件、企业微信或 CRM 后即可真实提交。"
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
      { href: "/factory-capability", label: "Capability" },
      { href: "/about", label: "About" },
      { href: "/faq", label: "FAQ" }
    ],
    actions: {
      quote: "Send Drawing for Quote",
      products: "View Product Series",
      contact: "Contact Us",
      details: "View Details",
      reset: "Clear Filters"
    },
    hero: {
      eyebrow: "Injection Molding / OEM / Small Batch",
      title: "Injection Molding & Custom Plastic Parts Factory",
      description:
        "Custom plastic parts based on drawings or samples, small-batch trial production, OEM processing, and direct factory supply with flexible communication.",
      badges: ["Drawing / sample customization", "Small-batch trial runs", "OEM processing", "ABS / PP / PE / PC / PVC"],
      visualLabels: ["Material review", "Trial production", "Batch delivery"]
    },
    stats: [
      { value: "5+", label: "Core Product Series", note: "Washers, auto, electronic, pet and furniture parts" },
      { value: "180+", label: "Products", note: "Product library generated from real product images" },
      { value: "OEM", label: "OEM Support", note: "Drawing, sample, color and packaging requirements" },
      { value: "Flexible", label: "Direct Response", note: "Suitable for small and medium batch orders" }
    ],
    intro: {
      eyebrow: "Factory Positioning",
      title: "Direct factory communication for practical injection molding needs",
      body:
        "Jincong Rubber & Plastic focuses on injection molding and custom plastic parts. We manufacture according to drawings, samples, dimensions, materials and colors, with product coverage across pet supplies, electronic and electrical plastic parts, furniture fittings, plastic washers and automotive plastic components.",
      points: ["Custom by drawing or sample", "Material and structure suggestions", "Small-batch trial production", "Stable supply for common plastic parts"]
    },
    series: [
      { title: "Plastic Washers / Gaskets", text: "Nylon washers, plastic washers, insulation gaskets and custom rings.", accent: "blue" },
      { title: "Automotive Plastic Parts", text: "Clips, caps, brackets, washers and small interior/exterior plastic parts.", accent: "silver" },
      { title: "Electronic Plastic Parts", text: "Plastic housings, wire clips, cable buckles, covers and fixing bases.", accent: "cyan" },
      { title: "Pet Plastic Products", text: "Water dispenser parts, feeder parts, connectors and custom plastic accessories.", accent: "gold" },
      { title: "Furniture Plastic Fittings", text: "Glides, plugs, adjustable feet, connectors and decorative caps.", accent: "blue" },
      { title: "General Custom Plastic Parts", text: "Custom production by drawing, sample, dimension, material and color.", accent: "silver" }
    ],
    industries: ["Automotive", "Electronics", "Instrumentation", "Furniture", "Pet Products", "Industrial Equipment"],
    capabilities: [
      "ABS / PP / PE / POM / PVC / PC materials",
      "Manufacturing from drawings and samples",
      "Small-batch trial and regular production",
      "OEM processing and packaging support",
      "Direct factory supply and flexible communication",
      "Dimensions, color and material can be customized"
    ],
    process: ["Requirement Review", "Drawing / Sample Check", "Material & Process", "Quotation", "Trial Run", "Production", "Packing & Delivery"],
    about: {
      title: "Practical custom support from common fittings to molded plastic parts",
      body:
        "We value direct communication, quick response and flexible coordination. Customers can provide drawings, sample photos, dimensions or application context, and we will evaluate materials, structure, quantity and delivery requirements."
    },
    contact: {
      title: "Send us drawings, samples or requirements",
      body: "Please include application, dimensions, material, quantity, color and whether drawings or samples are available.",
      phone: "Phone",
      wechat: "WeChat",
      email: "Email",
      submit: "Submit Custom Request"
    },
    footer: {
      summary: "Injection molding, custom plastic parts, drawing/sample manufacturing, OEM processing and small-batch trial production."
    },
    pages: {
      products: {
        eyebrow: "Products",
        title: "Product Center",
        description: "Filter by category, material and name. Products can be customized around drawings, samples, material, color, dimensions and packaging."
      },
      custom: {
        eyebrow: "Custom Injection Molding",
        title: "Custom Injection Molding",
        description: "Plastic parts manufacturing support based on drawings, samples, materials, colors, quantities and delivery needs."
      },
      industries: {
        eyebrow: "Industries",
        title: "Industries",
        description: "Plastic parts for automotive, electronics, instrumentation, furniture, pet products and industrial equipment."
      },
      factory: {
        eyebrow: "Factory Capability",
        title: "Factory Capability",
        description: "Material selection, trial production, batch production and direct communication for small and medium batch orders."
      },
      about: {
        eyebrow: "About",
        title: site.englishName,
        description: "A plastic injection molding and custom parts factory for drawing/sample customization, trial production, OEM and direct supply."
      },
      contact: {
        eyebrow: "Contact",
        title: "Contact Us",
        description: "Send drawings, sample photos, dimensions, applications or purchase quantity for a practical injection molding quotation."
      },
      faq: {
        eyebrow: "FAQ",
        title: "Frequently Asked Questions",
        description: "Answers to common questions about injection molding, material selection, trial production, quotation and delivery."
      }
    },
    productExplorer: {
      search: "Search product name, English name or category",
      allCategories: "All Categories",
      allMaterials: "All Materials",
      showing: "Showing",
      totalSuffix: "products",
      customTag: "Custom by drawing/sample",
      empty: "No matching products. Adjust filters or send your drawing request directly."
    },
    inquiry: {
      name: "Name",
      namePlaceholder: "Your name",
      phone: "Phone / WeChat",
      phonePlaceholder: "How we can reach you",
      email: "Email",
      product: "Product Requirement",
      productPlaceholder: "e.g. plastic washer, automotive plastic part",
      material: "Material",
      materialPlaceholder: "Select or discuss later",
      other: "Other",
      quantity: "Quantity",
      quantityPlaceholder: "e.g. 500 pcs, 3000 pcs/month",
      drawing: "Drawing / Sample Available",
      drawingOptions: ["Drawing available", "Sample available", "Not yet"],
      message: "Message",
      messagePlaceholder: "Dimensions, application, color, packaging and delivery requirements",
      submitted: "The front-end inquiry form is ready. It can be connected to email, WeCom or CRM before launch."
    }
  }
} satisfies Record<Locale, Record<string, unknown>>;

export function t(locale: Locale) {
  return content[locale];
}
