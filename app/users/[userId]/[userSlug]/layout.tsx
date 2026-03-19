import { avatars, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import convertDateToRelativeTime from "@/utils/relativeTime";
import React from "react";
import EditButton from "./EditButton";
import Navbar from "./Navbar";
import {
  IconClockFilled,
  IconUserFilled,
  IconStarFilled,
} from "@tabler/icons-react";

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ userId: string; userSlug: string }>;
}) => {
  const { userId } = await params;
  const user = await users.get<UserPrefs>(userId);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 pb-24 pt-32">
        {/* ── Profile header ───────────────────────────────────── */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-white/8 bg-white/[2%]">
          {/* Banner */}
          <div className="h-24 bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-cyan-500/10" />

          <div className="relative px-6 pb-6">
            {/* Avatar — overlaps the banner */}
            <div className="-mt-10 mb-4 flex items-end justify-between">
              <div className="relative">
                <div className="h-20 w-20 overflow-hidden rounded-2xl border-2 border-black shadow-[0_0_0_1px_rgba(255,255,255,0.1)]">
                  <picture className="block h-full w-full">
                    <img
                      src={
                        avatars.getInitials(
                          user.name,
                          200,
                          200,
                        ) as unknown as string
                      }
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  </picture>
                </div>
                {/* Online indicator */}
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-black bg-emerald-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-200" />
                </span>
              </div>

              <EditButton />
            </div>

            {/* Name + email */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold tracking-tight text-white">
                {user.name}
              </h1>
              <p className="mt-0.5 text-sm text-white/40">{user.email}</p>
            </div>

            {/* Meta chips */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 rounded-lg border border-orange-500/20 bg-orange-500/8 px-3 py-1.5 text-xs font-medium text-orange-400">
                <IconStarFilled className="h-3 w-3" />
                <span>{user.prefs.reputation} reputation</span>
              </div>

              <div className="flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/[3%] px-3 py-1.5 text-xs text-white/50">
                <IconUserFilled className="h-3 w-3 text-white/30" />
                <span>
                  Joined{" "}
                  <span className="text-white/70">
                    {convertDateToRelativeTime(new Date(user.$createdAt))}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/[3%] px-3 py-1.5 text-xs text-white/50">
                <IconClockFilled className="h-3 w-3 text-white/30" />
                <span>
                  Active{" "}
                  <span className="text-white/70">
                    {convertDateToRelativeTime(new Date(user.$updatedAt))}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs + content ───────────────────────────────────── */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <Navbar />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
