import Pagination from "@/components/Pagination";
import {
  answerCollection,
  db,
  questionCollection,
  voteCollection,
} from "@/models/name";
import { databases } from "@/models/server/config";
import convertDateToRelativeTime from "@/utils/relativeTime";
import slugify from "@/utils/slugify";
import Link from "next/link";
import { Query } from "node-appwrite";
import React from "react";
import {
  IconArrowUp,
  IconArrowDown,
  IconMoodEmpty,
  IconExternalLink,
} from "@tabler/icons-react";

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string; userSlug: string }>;
  searchParams: Promise<{
    page?: string;
    voteStatus?: "upvoted" | "downvoted";
  }>;
}) => {
  const { userId, userSlug } = await params;
  const resolvedSearchParams = await searchParams;
  resolvedSearchParams.page ||= "1";

  const query = [
    Query.equal("votedById", userId),
    Query.orderDesc("$createdAt"),
    Query.offset((+resolvedSearchParams.page - 1) * 25),
    Query.limit(25),
  ];

  if (resolvedSearchParams.voteStatus) {
    query.push(Query.equal("voteStatus", resolvedSearchParams.voteStatus));
  }

  const votes = await databases.listDocuments(db, voteCollection, query);

  votes.documents = await Promise.all(
    votes.documents.map(async (vote) => {
      const questionOfTypeQuestion =
        vote.type === "question"
          ? await databases.getDocument(db, questionCollection, vote.typeId, [
              Query.select(["title"]),
            ])
          : null;

      if (questionOfTypeQuestion) {
        return { ...vote, question: questionOfTypeQuestion };
      }

      const answer = await databases.getDocument(
        db,
        answerCollection,
        vote.typeId,
      );
      const questionOfTypeAnswer = await databases.getDocument(
        db,
        questionCollection,
        answer.questionId,
        [Query.select(["title"])],
      );

      return { ...vote, question: questionOfTypeAnswer };
    }),
  );

  const activeFilter = resolvedSearchParams.voteStatus;

  const filters: {
    label: string;
    value: undefined | "upvoted" | "downvoted";
    href: string;
    icon?: React.ReactNode;
    activeClass: string;
    inactiveClass: string;
  }[] = [
    {
      label: "All",
      value: undefined,
      href: `/users/${userId}/${userSlug}/votes`,
      activeClass: "border-border bg-card text-foreground",
      inactiveClass:
        "border-border bg-card/80 text-muted-foreground hover:border-primary/25 hover:text-foreground",
    },
    {
      label: "Upvoted",
      value: "upvoted",
      href: `/users/${userId}/${userSlug}/votes?voteStatus=upvoted`,
      icon: <IconArrowUp className="h-3.5 w-3.5" />,
      activeClass:
        "border-primary/40 bg-primary/15 text-primary shadow-[inset_0_0_0_1px_rgba(249,184,79,0.2)]",
      inactiveClass:
        "border-border bg-card/80 text-muted-foreground hover:border-primary/30 hover:bg-primary/8 hover:text-primary",
    },
    {
      label: "Downvoted",
      value: "downvoted",
      href: `/users/${userId}/${userSlug}/votes?voteStatus=downvoted`,
      icon: <IconArrowDown className="h-3.5 w-3.5" />,
      activeClass:
        "border-destructive/40 bg-destructive/15 text-destructive shadow-[inset_0_0_0_1px_rgba(239,68,68,0.2)]",
      inactiveClass:
        "border-border bg-card/80 text-muted-foreground hover:border-destructive/30 hover:bg-destructive/8 hover:text-destructive",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-background/70 px-4 py-3">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">
            {votes.total.toLocaleString()}
          </span>{" "}
          {votes.total === 1 ? "vote" : "votes"}
        </p>

        {/* Filter chips */}
        <div className="flex items-center gap-1.5">
          {filters.map((f) => {
            const isActive = f.value === activeFilter;
            return (
              <Link
                key={f.label}
                href={f.href}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
                  isActive ? f.activeClass : f.inactiveClass
                }`}
              >
                {f.icon}
                {f.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Vote list */}
      {votes.documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card/70 py-16 text-center">
          <IconMoodEmpty className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <h3 className="mb-1 text-sm font-semibold text-foreground/80">
            No votes yet
          </h3>
          <p className="text-xs text-muted-foreground">
            {activeFilter
              ? `No ${activeFilter} votes to show.`
              : "Start voting on questions and answers to track them here."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {votes.documents.map((vote) => {
            const isUpvote = vote.voteStatus === "upvoted";
            return (
              <div
                key={vote.$id}
                className="group flex items-start gap-4 rounded-xl border border-border bg-card/75 p-4 transition-all duration-150 hover:border-primary/30"
              >
                {/* Vote badge */}
                <div
                  className={`mt-0.5 flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${
                    isUpvote
                      ? "border-primary/30 bg-primary/12 text-primary"
                      : "border-destructive/30 bg-destructive/12 text-destructive"
                  }`}
                >
                  {isUpvote ? (
                    <IconArrowUp className="h-3.5 w-3.5" />
                  ) : (
                    <IconArrowDown className="h-3.5 w-3.5" />
                  )}
                  <span className="hidden sm:inline">
                    {isUpvote ? "Upvote" : "Downvote"}
                  </span>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/questions/${vote.question.$id}/${slugify(
                        vote.question.title,
                      )}`}
                      className="group/link flex min-w-0 items-center gap-1.5"
                    >
                      <span className="truncate text-sm font-medium text-foreground/90 transition-colors duration-150 group-hover/link:text-primary">
                        {vote.question.title}
                      </span>
                      <IconExternalLink className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 transition-all duration-150 group-hover/link:text-primary/70 group-hover/link:opacity-100" />
                    </Link>
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span
                      className={`rounded-md border px-1.5 py-0.5 text-xs font-medium ${
                        vote.type === "question"
                          ? "border-chart-4/25 bg-chart-4/10 text-chart-4"
                          : "border-chart-5/25 bg-chart-5/10 text-chart-5"
                      }`}
                    >
                      {vote.type === "question" ? "Question" : "Answer"}
                    </span>
                    <span>
                      {convertDateToRelativeTime(new Date(vote.$createdAt))}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {votes.total > 25 && (
        <div className="mt-8">
          <Pagination total={votes.total} limit={25} />
        </div>
      )}
    </div>
  );
};

export default Page;
