import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/magicui/animated-list";
import { avatars, users } from "@/models/server/config";
import { Models, Query } from "node-appwrite";
import { UserPrefs } from "@/store/Auth";
import convertDateToRelativeTime from "@/utils/relativeTime";
import Link from "next/link";
import slugify from "@/utils/slugify";

const ContributorRow = ({ user }: { user: Models.User<UserPrefs> }) => {
  return (
    <figure
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/80 bg-background/75 p-4",
        "transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40",
      )}
    >
      <div className="flex items-center gap-3">
        <picture>
          <img
            src={avatars.getInitials(user.name, 44, 44) as unknown as string}
            alt={user.name}
            className="rounded-xl"
          />
        </picture>

        <div className="min-w-0 flex-1">
          <Link
            href={`/users/${user.$id}/${slugify(user.name)}`}
            className="truncate text-sm font-semibold text-foreground transition-colors hover:text-primary"
          >
            {user.name}
          </Link>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Active {convertDateToRelativeTime(new Date(user.$updatedAt))}
          </p>
        </div>

        <div className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {user.prefs.reputation} rep
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
      <div className="rounded-xl border border-destructive/25 bg-destructive/10 p-4 text-sm text-destructive-foreground/90">
        Could not load top contributors right now.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-card/80 p-5 shadow-sm">
      <AnimatedList>
        {topUsers.users.map((user) => (
          <ContributorRow user={user as any} key={user.$id} />
        ))}
      </AnimatedList>
    </div>
  );
}
