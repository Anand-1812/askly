"use client";

import IconCloud from "@/components/magicui/icon-cloud";
import Particles from "@/components/magicui/particles";
import ShimmerButton from "@/components/magicui/shimmer-button";
import { useAuthStore } from "@/store/Auth";
import Link from "next/link";
import React from "react";
import {
  IconSparkles,
  IconBolt,
  IconUsersGroup,
  IconArrowRight,
  IconCode2,
  IconUsers,
  IconMessageCircle2,
} from "@tabler/icons-react";

const slugs = [
  "typescript",
  "javascript",
  "dart",
  "java",
  "react",
  "flutter",
  "android",
  "html5",
  "css3",
  "nodedotjs",
  "express",
  "nextdotjs",
  "prisma",
  "amazonaws",
  "postgresql",
  "firebase",
  "nginx",
  "vercel",
  "testinglibrary",
  "jest",
  "cypress",
  "docker",
  "git",
  "jira",
  "github",
  "gitlab",
  "visualstudiocode",
  "androidstudio",
  "sonarqube",
  "figma",
];

const stats = [
  { icon: IconCode2, label: "Questions", value: "10K+" },
  { icon: IconUsers, label: "Developers", value: "5K+" },
  { icon: IconMessageCircle2, label: "Answered", value: "98%" },
];

const avatarColors = [
  { bg: "bg-orange-400", letter: "A" },
  { bg: "bg-violet-500", letter: "B" },
  { bg: "bg-rose-400", letter: "C" },
  { bg: "bg-sky-400", letter: "D" },
  { bg: "bg-emerald-400", letter: "E" },
];

const HeroSectionHeader = () => {
  const { session } = useAuthStore();

  return (
    <div className="relative overflow-hidden">
      {/* ── Ambient gradient orbs ── */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Orange — top-left */}
        <div className="absolute -left-56 -top-56 h-[700px] w-[700px] rounded-full bg-orange-500/[0.12] blur-[130px]" />
        {/* Violet — top-right */}
        <div className="absolute -right-48 -top-32 h-[560px] w-[560px] rounded-full bg-violet-600/[0.11] blur-[120px]" />
        {/* Rose — bottom-center */}
        <div className="absolute bottom-0 left-1/2 h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-rose-500/[0.09] blur-[110px]" />
        {/* Extra deep-orange accent — mid-left */}
        <div className="absolute left-1/4 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-orange-600/[0.07] blur-[90px]" />
      </div>

      {/* ── Dot-grid texture ── */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.065) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── Particles ── */}
      <Particles
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
        quantity={180}
        ease={120}
        color="#f97316"
        refresh
      />

      {/* ── Main content ── */}
      <div className="container relative mx-auto px-4 pb-20 pt-36">
        <div className="grid items-center gap-14 md:grid-cols-[1.15fr_1fr] lg:gap-20">
          {/* ════════════ LEFT COLUMN ════════════ */}
          <div className="flex flex-col items-center gap-8 md:items-start">
            {/* 1. Animated badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 backdrop-blur-sm">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.13em] text-orange-400">
                Community Q&amp;A for developers
              </span>
            </div>

            {/* 2. Big headline */}
            <div className="text-center md:text-left">
              <h1 className="text-5xl font-extrabold leading-[1.07] tracking-tight text-white sm:text-6xl lg:text-[4.25rem]">
                <span className="block">The place where</span>
                <span className="block">developers get</span>
                <span className="relative mt-1 inline-block">
                  <span className="bg-gradient-to-br from-orange-400 via-rose-400 to-violet-500 bg-clip-text text-transparent">
                    unstuck.
                  </span>
                  {/* Wavy underline */}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 380 14"
                    className="absolute -bottom-3 left-0 w-full overflow-visible"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id="waveGrad"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#fb923c" />
                        <stop offset="50%" stopColor="#fb7185" />
                        <stop offset="100%" stopColor="#a78bfa" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0 7 C28 1,56 13,84 7 S140 1,168 7 S224 13,252 7 S308 1,336 7 S362 13,380 7"
                      fill="none"
                      stroke="url(#waveGrad)"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
            </div>

            {/* 3. Subtext */}
            <p className="max-w-[30rem] text-center text-base leading-relaxed text-white/50 md:text-left md:text-lg">
              Ask questions, get answers, and grow with{" "}
              <span className="font-semibold text-white/80">
                thousands of developers
              </span>{" "}
              who love to help. Free, forever.
            </p>

            {/* 4. Stats row */}
            <div className="flex items-center divide-x divide-white/10 rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm">
              {stats.map(({ icon: Icon, label, value }, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 px-5 py-3.5 first:pl-5 last:pr-5"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/15 ring-1 ring-inset ring-orange-500/25">
                    <Icon className="h-4 w-4 text-orange-400" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-none text-white">
                      {value}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-none text-white/40">
                      {label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 5. CTA buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
              {session ? (
                <Link href="/questions/ask">
                  <ShimmerButton
                    shimmerColor="#f97316"
                    background="rgba(249,115,22,0.18)"
                    className="border-orange-500/40 shadow-lg shadow-orange-500/20"
                  >
                    <span className="flex items-center gap-2 px-1 text-sm font-semibold text-white lg:text-base">
                      <IconSparkles className="h-4 w-4 text-orange-300" />
                      Ask a question
                    </span>
                  </ShimmerButton>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <ShimmerButton
                      shimmerColor="#f97316"
                      background="rgba(249,115,22,0.18)"
                      className="border-orange-500/40 shadow-lg shadow-orange-500/20"
                    >
                      <span className="flex items-center gap-2 px-1 text-sm font-semibold text-white lg:text-base">
                        <IconSparkles className="h-4 w-4 text-orange-300" />
                        Get started free
                        <IconArrowRight className="h-4 w-4 text-orange-300" />
                      </span>
                    </ShimmerButton>
                  </Link>
                  <Link
                    href="/questions"
                    className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-5 text-sm font-semibold text-white/60 backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-white/[0.09] hover:text-white"
                  >
                    Browse questions
                    <IconArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                </>
              )}
            </div>

            {/* 6. Social proof */}
            <div className="flex items-center gap-3">
              {/* Avatar stack */}
              <div className="flex -space-x-1.5">
                {avatarColors.map(({ bg, letter }, i) => (
                  <div
                    key={i}
                    className={`flex h-7 w-7 items-center justify-center rounded-full ${bg} ring-2 ring-black text-[10px] font-bold text-black`}
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/50">
                <span className="font-semibold text-white/80">5,000+</span>{" "}
                developers already joined
              </p>
            </div>
          </div>

          {/* ════════════ RIGHT COLUMN ════════════ */}
          <div className="relative mx-auto w-full max-w-[30rem]">
            {/* Glow orb behind cloud */}
            <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
              <div className="h-80 w-80 rounded-full bg-gradient-to-br from-orange-500/25 via-rose-500/20 to-violet-600/25 blur-3xl" />
            </div>

            {/* Decorative concentric rings */}
            <div className="pointer-events-none absolute inset-4 rounded-full border border-white/[0.05]" />
            <div className="pointer-events-none absolute inset-14 rounded-full border border-white/[0.035]" />
            <div className="pointer-events-none absolute inset-24 rounded-full border border-white/[0.02]" />

            {/* Subtle glass card behind the cloud */}
            <div className="absolute inset-8 rounded-full bg-white/[0.02] backdrop-blur-[2px]" />

            <IconCloud iconSlugs={slugs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionHeader;
