"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Box,
  Boxes,
  Factory,
  Gauge,
  Layers3,
  PackageCheck,
  Sparkles
} from "lucide-react";

const heroTags = ["来图来样定制", "小批量试产", "OEM 加工", "工厂直供"];

const floatingParts = [
  { label: "ABS", className: "left-[8%] top-[18%]", delay: 0 },
  { label: "PP", className: "right-[9%] top-[22%]", delay: 0.6 },
  { label: "POM", className: "left-[14%] bottom-[22%]", delay: 1.1 },
  { label: "PC", className: "right-[16%] bottom-[16%]", delay: 0.3 }
];

const capabilityRings = [
  { icon: Boxes, label: "塑料平垫" },
  { icon: PackageCheck, label: "宠物用品" },
  { icon: Layers3, label: "电子电气" },
  { icon: Gauge, label: "汽车塑料件" }
];

export function Hero() {
  const scrollToIntro = () => {
    document.getElementById("home-intro")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f4f8fb] pt-20 text-graphite-950">
      <motion.div
        className="absolute -left-28 top-20 h-[28rem] w-[28rem] rounded-full bg-cyan-300/35 blur-3xl"
        animate={{ x: [0, 42, 0], y: [0, 28, 0], opacity: [0.45, 0.82, 0.45] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-12rem] top-16 h-[36rem] w-[36rem] rounded-full bg-blue-400/22 blur-3xl"
        animate={{ x: [0, -36, 0], scale: [1, 1.08, 1], opacity: [0.35, 0.62, 0.35] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-14rem] left-1/3 h-[28rem] w-[28rem] rounded-full bg-slate-300/45 blur-3xl"
        animate={{ y: [0, -32, 0], opacity: [0.28, 0.52, 0.28] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute inset-0 opacity-[0.42]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,24,37,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(15,24,37,0.08) 1px, transparent 1px)",
          backgroundSize: "72px 72px"
        }}
        animate={{ backgroundPosition: ["0px 0px", "72px 72px"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-x-0 top-20 h-px bg-gradient-to-r from-transparent via-electric-500/60 to-transparent" />
      <motion.div
        className="absolute left-0 right-0 top-[25%] h-px bg-gradient-to-r from-transparent via-cyan-400/55 to-transparent"
        animate={{ y: [0, 240, 0], opacity: [0, 0.75, 0] }}
        transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="section-shell relative z-10 grid min-h-[calc(100vh-5rem)] items-center gap-10 pb-28 pt-10 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-electric-600 shadow-sm backdrop-blur-xl">
            <Factory className="h-4 w-4" />
            Xingtai Jincong Rubber & Plastic
          </div>

          <h1 className="mt-7 max-w-5xl text-5xl font-semibold leading-[0.98] tracking-normal text-graphite-950 sm:text-6xl lg:text-7xl xl:text-8xl">
            注塑加工与
            <span className="block bg-gradient-to-r from-graphite-950 via-electric-600 to-cyan-500 bg-clip-text text-transparent">
              塑料件定制工厂
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            支持来图来样定制、小批量试产、OEM 加工，覆盖宠物用品、电子电气、家具配件、塑料平垫、汽车塑料件等多类塑料产品。
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {heroTags.map((tag, index) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 + index * 0.07 }}
                className="rounded-full border border-slate-200 bg-white/75 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-xl"
              >
                {tag}
              </motion.span>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-graphite-950 px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(10,103,200,0.24)] transition hover:bg-electric-600"
            >
              提交定制需求
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white/70 px-6 py-4 text-sm font-semibold text-graphite-950 backdrop-blur-xl transition hover:border-electric-500 hover:text-electric-600"
            >
              查看产品中心
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="relative mx-auto h-[32rem] w-full max-w-[40rem] lg:h-[38rem]"
          initial={{ opacity: 0, x: 30, rotateX: 8 }}
          animate={{ opacity: 1, x: 0, rotateX: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-300/70 bg-white/65 shadow-[0_30px_120px_rgba(27,157,255,0.18)] backdrop-blur-2xl sm:h-[30rem] sm:w-[30rem]"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 h-[17rem] w-[17rem] -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-slate-100 to-cyan-100 shadow-[0_32px_90px_rgba(15,24,37,0.18)] sm:h-[22rem] sm:w-[22rem]"
            animate={{ y: [0, -14, 0], rotateY: [-9, 9, -9], rotateX: [7, -4, 7] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="absolute inset-8 rounded-2xl border border-slate-300/70 bg-white/55" />
            <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-[18px] border-graphite-950/80 bg-white shadow-inner sm:h-32 sm:w-32" />
            <div className="absolute left-10 top-10 h-10 w-20 rounded-full bg-graphite-950/80" />
            <div className="absolute bottom-10 right-10 h-12 w-28 rounded-xl bg-electric-500/70" />
          </motion.div>

          {floatingParts.map((part) => (
            <motion.div
              key={part.label}
              className={`absolute ${part.className} rounded-xl border border-slate-200 bg-white/75 px-4 py-3 text-sm font-semibold text-graphite-950 shadow-lg backdrop-blur-xl`}
              animate={{ y: [0, -12, 0], opacity: [0.78, 1, 0.78] }}
              transition={{ duration: 5.4, delay: part.delay, repeat: Infinity, ease: "easeInOut" }}
            >
              {part.label}
            </motion.div>
          ))}

          <div className="absolute bottom-4 left-1/2 grid w-full max-w-xl -translate-x-1/2 grid-cols-2 gap-3 px-2 sm:grid-cols-4">
            {capabilityRings.map(({ icon: Icon, label }, index) => (
              <motion.div
                key={label}
                className="rounded-xl border border-slate-200 bg-white/75 p-3 text-center text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-xl"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + index * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <Icon className="mx-auto mb-2 h-5 w-5 text-electric-600" />
                {label}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.button
        type="button"
        aria-label="继续向下浏览"
        onClick={scrollToIntro}
        className="absolute bottom-7 left-1/2 z-20 grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full border border-slate-300 bg-white/80 text-graphite-950 shadow-lg backdrop-blur-xl transition hover:border-electric-500 hover:text-electric-600"
        animate={{ y: [0, 9, 0] }}
        transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown className="h-5 w-5" />
      </motion.button>
    </section>
  );
}
