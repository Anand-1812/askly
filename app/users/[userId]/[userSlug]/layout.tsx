import { avatars, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import convertDateToRelativeTime from "@/utils/relativeTime";
import React from "react";
import EditButton from "./EditButton";
import Navbar from "./Navbar";
import { IconClockFilled, IconUserFilled, IconStarFilled } from "@tabler/icons-react";

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
    <div className="page-shell min-h-screen">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="mb-8 overflow-hidden rounded-3xl border border-border/80 bg-card/75 shadow-sm">
          <div className="h-28 bg-gradient-to-r from-primary/25 via-chart-4/20 to-accent/24" />

          <div className="relative px-6 pb-6">
            <div className="-mt-12 mb-4 flex items-end justify-between gap-3">
              <div className="relative">
                <div className="h-24 w-24 overflow-hidden rounded-2xl border-2 border-background shadow-sm">
                  <picture className="block h-full w-full">
                    <img
                      src={avatars.getInitials(user.name, 200, 200) as unknown as string}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  </picture>
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-background bg-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-100" />
                </span>
              </div>

              <EditButton />
            </div>

            <div className="mb-4">
              <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">{user.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                <IconStarFilled className="h-3 w-3" />
                <span>{user.prefs.reputation} reputation</span>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs text-muted-foreground">
                <IconUserFilled className="h-3 w-3" />
                <span>Joined {convertDateToRelativeTime(new Date(user.$createdAt))}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs text-muted-foreground">
                <IconClockFilled className="h-3 w-3" />
                <span>Active {convertDateToRelativeTime(new Date(user.$updatedAt))}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <Navbar />
          <div className="min-w-0 flex-1 rounded-2xl border border-border/80 bg-card/70 p-4 shadow-sm sm:p-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
