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
    <div className="relative flex min-h-screen items-center justify-center px-4 pb-16 pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[44%] -z-10 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/18 blur-3xl"
      />

      <BackgroundBeams />

      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
};

export default Layout;
