"use client";

import { useAuthStore } from "@/store/Auth"
import { useRouter } from "next/navigation";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { session, hydrated } = useAuthStore();
  const router = useRouter()

  React.useEffect(() => {
    if (hydrated && session) {
      router.push("/")
    }
  }, [session, hydrated, router])

  if (!hydrated) {
    return null; // or a loading spinner
  }

  if (session) {
    return null
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center py-12">
      <div className="relative">{children}</div>
    </div>
  )
}

export default Layout;
