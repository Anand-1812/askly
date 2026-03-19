import { cn } from "@/lib/utils";

import { AnimatedList } from "@/components/magicui/animated-list";
import { avatars, users } from "@/models/server/config";
import { Models, Query } from "node-appwrite";
import { UserPrefs } from "@/store/Auth";
import convertDateToRelativeTime from "@/utils/relativeTime";

const Notification = ({ user }: { user: Models.User<UserPrefs> }) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] transform cursor-pointer overflow-hidden rounded-2xl p-4",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <picture>
          <img
            src={avatars.getInitials(user.name, 40, 40) as unknown as string}
            alt={user.name}
            className="rounded-2xl"
          />
        </picture>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white">
            <span className="text-sm sm:text-lg">{user.name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">
              {convertDateToRelativeTime(new Date(user.$updatedAt))}
            </span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60">
            <span>Reputation</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">
              {user.prefs.reputation}
            </span>
          </p>
        </div>
      </div>
    </figure>
  );
};

export default async function TopContributers() {
  let topUsers: Models.UserList<Models.User<UserPrefs>> | null = null;

  try {
    topUsers = (await users.list([Query.limit(10)])) as any;
  } catch (error) {
    console.error("TopContributers error:", error);
  }

  if (!topUsers) {
    return (
      <div className="rounded-xl border border-white/20 bg-white/5 p-4 text-sm text-white/70">
        Could not load top contributors right now.
      </div>
    );
  }

  return (
    <div className="bg-background relative flex max-h-[400px] min-h-[400px] w-full max-w-[32rem] flex-col overflow-hidden rounded-lg bg-white/10 p-6 shadow-lg">
      <AnimatedList>
        {topUsers.users.map((user) => (
          <Notification user={user as any} key={user.$id} />
        ))}
      </AnimatedList>
    </div>
  );
}
