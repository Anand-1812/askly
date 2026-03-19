"use client";

import { BackgroundBeams } from "@/components/ui/background-beams";
import { useAuthStore } from "@/store/Auth";
import { useRouter } from "next/navigation";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  if (session) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16">
      {/* Gradient glow behind the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/[4%] blur-3xl"
      />

      <BackgroundBeams />

      {/* Card wrapper */}
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
};

export default Layout;
