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
        "relative mx-auto min-h-fit w-full max-w-[420px] overflow-hidden rounded-xl border border-border bg-card/70 p-4",
        "transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:border-primary/40",
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
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium text-foreground">
            <span className="text-sm sm:text-lg">{user.name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-muted-foreground">
              {convertDateToRelativeTime(new Date(user.$updatedAt))}
            </span>
          </figcaption>
          <p className="text-sm font-normal text-muted-foreground">
            <span>Reputation</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-primary">
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
      <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive-foreground/85">
        Could not load top contributors right now.
      </div>
    );
  }

  return (
    <div className="relative flex max-h-[420px] min-h-[420px] w-full max-w-[32rem] flex-col overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-card/90 to-card/70 p-6 shadow-lg">
      <AnimatedList>
        {topUsers.users.map((user) => (
          <Notification user={user as any} key={user.$id} />
        ))}
      </AnimatedList>
    </div>
  );
}
