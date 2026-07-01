"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, BadgeCheck, Factory, FileText, PackageCheck, Sparkles } from "lucide-react";

const trustTags = ["来图来样定制", "小批量试产", "OEM 代工", "工厂直供"];

const productVisuals = [
  {
    name: "汽车塑料件",
    image: "/images/products/automotive-plastic-parts/汽车卡扣固定件/汽车门板卡扣.png",
    className: "left-0 top-12 rotate-[-7deg]"
  },
  {
    name: "电子电气配件",
    image: "/images/products/electronic-electrical-plastic-parts/通讯数码塑料件/路由器外壳.png",
    className: "right-0 top-0 rotate-[6deg]"
  },
  {
    name: "塑料平垫",
    image: "/images/products/plastic-washers/塑料平垫系列/ABS平垫.png",
    className: "bottom-8 left-[22%] rotate-[3deg]"
  }
];

const stats = [
  { value: "5+", label: "核心产品系列" },
  { value: "180+", label: "产品展示" },
  { value: "OEM", label: "代工配合" },
  { value: "ABS / PP / POM", label: "常用材料" }
];

export function Hero() {
  const scrollToIntro = () => {
    document.getElementById("home-intro")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f7f8fb] pt-20 text-slate-950">
      <motion.div
        className="absolute -left-32 top-0 h-[28rem] w-[28rem] rounded-full bg-sky-200/55 blur-3xl"
        animate={{ x: [0, 32, 0], y: [0, 22, 0], opacity: [0.65, 0.95, 0.65] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-10rem] top-20 h-[34rem] w-[34rem] rounded-full bg-orange-100/80 blur-3xl"
        animate={{ x: [0, -30, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-18rem] left-[30%] h-[34rem] w-[34rem] rounded-full bg-cyan-100/80 blur-3xl"
        animate={{ y: [0, -34, 0], opacity: [0.45, 0.8, 0.45] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="industrial-grid absolute inset-0 opacity-70"
        animate={{ backgroundPosition: ["0px 0px", "72px 72px"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      <div className="section-shell relative z-10 grid min-h-[calc(100vh-5rem)] items-center gap-8 pb-16 pt-8 sm:gap-12 sm:pb-20 sm:pt-10 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/78 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 shadow-sm backdrop-blur-xl">
            <Factory className="h-4 w-4 text-sky-600" />
            Xingtai Jincong Rubber & Plastic
          </div>

          <h1 className="mt-5 max-w-5xl text-3xl font-semibold leading-[1.05] tracking-normal text-slate-950 sm:mt-6 sm:text-6xl lg:text-7xl">
            注塑加工与塑料件定制
            <span className="block bg-gradient-to-r from-sky-600 via-slate-900 to-orange-500 bg-clip-text text-transparent">
              一站式工厂配合
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:mt-7 sm:text-lg sm:leading-8">
            面向中小批量订单、试产验证和 OEM 代工需求，支持按图纸、样品、材料、颜色和尺寸要求进行塑料件加工。
          </p>

          <div className="mt-5 flex flex-wrap gap-2 sm:mt-7 sm:gap-2.5">
            {trustTags.map((tag, index) => (
              <motion.span
                key={tag}
                className="rounded-full border border-slate-200 bg-white/82 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-xl sm:px-4 sm:py-2 sm:text-sm"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 + index * 0.07 }}
              >
                {tag}
              </motion.span>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:mt-9 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-7 py-4 text-sm font-semibold text-white shadow-[0_18px_44px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-sky-700"
            >
              查看产品系列
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/85 px-7 py-4 text-sm font-semibold text-slate-950 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50"
            >
              联系我们
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 hidden gap-3 sm:grid sm:grid-cols-4">
            {stats.map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-white/72 p-4 shadow-sm backdrop-blur-xl">
                <div className="text-xl font-semibold text-slate-950">{item.value}</div>
                <div className="mt-1 text-xs text-slate-500">{item.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="relative mx-auto h-[18rem] w-full max-w-[42rem] [perspective:1200px] sm:h-[34rem] lg:h-[40rem]"
          initial={{ opacity: 0, x: 38, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="absolute inset-x-7 top-8 h-[13rem] rounded-[1.5rem] border border-white/70 bg-white/62 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-2xl [transform-style:preserve-3d] sm:inset-x-14 sm:top-12 sm:h-[27rem] sm:rounded-[2rem]"
            animate={{ rotateY: [-8, 7, -8], rotateX: [5, -4, 5], y: [0, -10, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute inset-5 rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-sky-50" />
            <div className="absolute left-8 top-8 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                <BadgeCheck className="h-4 w-4 text-sky-600" />
                工厂直供
              </div>
              <p className="mt-1 text-xs text-slate-500">报价沟通更直接</p>
            </div>
            <div className="absolute bottom-8 right-8 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                <PackageCheck className="h-4 w-4 text-orange-500" />
                小批量试产
              </div>
              <p className="mt-1 text-xs text-slate-500">适合新品验证</p>
            </div>
          </motion.div>

          {productVisuals.map((item, index) => (
            <motion.div
              key={item.name}
            className={`absolute ${item.className} w-[9rem] rounded-[1.25rem] border border-slate-200 bg-white p-3 shadow-[0_24px_70px_rgba(15,23,42,0.14)] sm:w-[16rem] sm:rounded-[1.5rem] sm:p-4`}
              animate={{ y: [0, -14, 0], rotateZ: index === 0 ? [-7, -4, -7] : index === 1 ? [6, 3, 6] : [3, 6, 3] }}
              transition={{ duration: 5.5 + index, delay: index * 0.4, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ y: -18, scale: 1.02 }}
            >
              <div className="aspect-square rounded-2xl bg-slate-50 p-2 sm:p-3">
                <div className="relative h-full w-full">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="260px"
                    className="object-contain object-center"
                    priority={index === 0}
                  />
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs font-semibold text-slate-900 sm:mt-3 sm:text-sm">
                {item.name}
                <Sparkles className="h-4 w-4 text-sky-500" />
              </div>
            </motion.div>
          ))}

          <motion.div
            className="absolute bottom-0 left-4 right-4 rounded-[1.5rem] border border-slate-200 bg-white/86 p-4 shadow-[0_28px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:left-20 sm:right-20 sm:rounded-[1.75rem] sm:p-5"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sky-100 text-sky-700">
                <FileText className="h-5 w-5" />
              </span>
              <div>
                <div className="text-sm font-semibold text-slate-950 sm:text-base">按图纸 / 样品 / 用途沟通加工</div>
                <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">
                  覆盖平垫、汽车件、电子电气件、宠物用品和家具塑料配件。
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.button
        type="button"
        aria-label="继续向下浏览"
        onClick={scrollToIntro}
        className="absolute bottom-7 left-1/2 z-20 grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full border border-slate-200 bg-white/85 text-slate-950 shadow-lg backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-700"
        animate={{ y: [0, 9, 0] }}
        transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown className="h-5 w-5" />
      </motion.button>
    </section>
  );
}
