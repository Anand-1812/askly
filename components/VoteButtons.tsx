"use client";

import { databases } from "@/models/client/config";
import { db, voteCollection } from "@/models/name";
import { useAuthStore } from "@/store/Auth";
import { cn } from "@/lib/utils";
import { IconCaretUpFilled, IconCaretDownFilled } from "@tabler/icons-react";
import { Models, Query } from "appwrite";
import { useRouter } from "next/navigation";
import React from "react";

const VoteButtons = ({
  type,
  id,
  upvotes,
  downvotes,
  className,
}: {
  type: "question" | "answer";
  id: string;
  upvotes: Models.DocumentList<Models.Document>;
  downvotes: Models.DocumentList<Models.Document>;
  className?: string;
}) => {
  const [votedDocument, setVotedDocument] =
    React.useState<Models.DefaultDocument | null>();
  const [voteResult, setVoteResult] = React.useState<number>(
    upvotes.total - downvotes.total,
  );

  const { user } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    (async () => {
      if (user) {
        const response = await databases.listDocuments(db, voteCollection, [
          Query.equal("type", type),
          Query.equal("typeId", id),
          Query.equal("votedById", user.$id),
        ]);
        setVotedDocument(
          (response.documents[0] as Models.DefaultDocument) || null,
        );
      }
    })();
  }, [user, id, type]);

  const toggleUpvote = async () => {
    if (!user) return router.push("/login");
    if (votedDocument === undefined) return;

    try {
      const response = await fetch(`/api/vote`, {
        method: "POST",
        body: JSON.stringify({
          votedById: user.$id,
          voteStatus: "upvoted",
          type,
          typeId: id,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw data;

      setVoteResult(data.data.voteResult);
      setVotedDocument(data.data.document as Models.DefaultDocument);
    } catch (error: any) {
      window.alert(error?.message || "Something went wrong");
    }
  };

  const toggleDownvote = async () => {
    if (!user) return router.push("/login");
    if (votedDocument === undefined) return;

    try {
      const response = await fetch(`/api/vote`, {
        method: "POST",
        body: JSON.stringify({
          votedById: user.$id,
          voteStatus: "downvoted",
          type,
          typeId: id,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw data;

      setVoteResult(data.data.voteResult);
      setVotedDocument(data.data.document as Models.DefaultDocument);
    } catch (error: any) {
      window.alert(error?.message || "Something went wrong");
    }
  };

  const isUpvoted = votedDocument && votedDocument.voteStatus === "upvoted";
  const isDownvoted = votedDocument && votedDocument.voteStatus === "downvoted";

  return (
    <div className={cn("flex shrink-0 flex-col items-center gap-1", className)}>
      {/* Upvote */}
      <button
        onClick={toggleUpvote}
        title="Upvote"
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-150",
          isUpvoted
            ? "border-primary/60 bg-primary/15 text-primary shadow-sm"
            : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-primary",
        )}
      >
        <IconCaretUpFilled className="h-4 w-4" />
      </button>

      {/* Score */}
      <span
        className={cn(
          "min-w-[2rem] text-center text-sm font-semibold tabular-nums",
          voteResult > 0
            ? "text-primary"
            : voteResult < 0
              ? "text-destructive"
              : "text-muted-foreground",
        )}
      >
        {voteResult > 0 ? `+${voteResult}` : voteResult}
      </span>

      {/* Downvote */}
      <button
        onClick={toggleDownvote}
        title="Downvote"
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-150",
          isDownvoted
            ? "border-destructive/60 bg-destructive/15 text-destructive shadow-sm"
            : "border-border bg-card text-muted-foreground hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive",
        )}
      >
        <IconCaretDownFilled className="h-4 w-4" />
      </button>
    </div>
  );
};

export default VoteButtons;
