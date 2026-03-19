"use client";

import IconCloud from "@/components/magicui/icon-cloud";
import Particles from "@/components/magicui/particles";
import ShimmerButton from "@/components/magicui/shimmer-button";
import { useAuthStore } from "@/store/Auth";
import Link from "next/link";
import React from "react";
import { IconSparkles, IconBolt, IconUsersGroup } from "@tabler/icons-react";

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

const HeroSectionHeader = () => {
  const { session } = useAuthStore();

  return (
    <div className="container relative mx-auto px-4">
      <Particles
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
        quantity={220}
        ease={120}
        color="#f6f6f6"
        refresh
      />

      <div className="grid items-center gap-10 md:grid-cols-[1.1fr_1fr]">
        <div className="space-y-6 text-center md:text-left">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-primary md:mx-0">
            <IconSparkles className="h-3.5 w-3.5" />
            Ask. Learn. Ship.
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Build Better Answers
            <span className="block bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
              With the Askly Community
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground md:mx-0 md:text-lg">
            Ask precise technical questions, get practical help from other
            developers, and grow your reputation by sharing what you know.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
            {session ? (
              <Link href="/questions/ask">
                <ShimmerButton className="shadow-md">
                  <span className="px-2 text-sm font-semibold text-primary-foreground lg:text-base">
                    Ask a question
                  </span>
                </ShimmerButton>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <ShimmerButton className="shadow-md">
                    <span className="px-2 text-sm font-semibold text-primary-foreground lg:text-base">
                      Create account
                    </span>
                  </ShimmerButton>
                </Link>
                <Link
                  href="/login"
                  className="inline-flex h-11 items-center rounded-lg border border-border bg-card px-5 text-sm font-semibold text-foreground transition-all hover:border-primary/50 hover:text-primary"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 md:justify-start">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-muted-foreground">
              <IconBolt className="h-3.5 w-3.5 text-primary" />
              Fast answers
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-muted-foreground">
              <IconUsersGroup className="h-3.5 w-3.5 text-primary" />
              Active community
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[32rem] overflow-hidden rounded-2xl border border-border/80 bg-card/70 p-4 shadow-xl backdrop-blur-sm">
          <IconCloud iconSlugs={slugs} />
        </div>
      </div>
    </div>
  );
};

export default HeroSectionHeader;
