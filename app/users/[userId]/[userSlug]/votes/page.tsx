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
      activeClass: "border-white/20 bg-white/10 text-white",
      inactiveClass:
        "border-white/8 bg-white/[3%] text-white/50 hover:border-white/15 hover:bg-white/[6%] hover:text-white/80",
    },
    {
      label: "Upvoted",
      value: "upvoted",
      href: `/users/${userId}/${userSlug}/votes?voteStatus=upvoted`,
      icon: <IconArrowUp className="h-3.5 w-3.5" />,
      activeClass:
        "border-orange-500/40 bg-orange-500/15 text-orange-400 shadow-[inset_0_0_0_1px_rgba(249,115,22,0.2)]",
      inactiveClass:
        "border-white/8 bg-white/[3%] text-white/50 hover:border-orange-500/20 hover:bg-orange-500/8 hover:text-orange-400/80",
    },
    {
      label: "Downvoted",
      value: "downvoted",
      href: `/users/${userId}/${userSlug}/votes?voteStatus=downvoted`,
      icon: <IconArrowDown className="h-3.5 w-3.5" />,
      activeClass:
        "border-red-500/40 bg-red-500/15 text-red-400 shadow-[inset_0_0_0_1px_rgba(239,68,68,0.2)]",
      inactiveClass:
        "border-white/8 bg-white/[3%] text-white/50 hover:border-red-500/20 hover:bg-red-500/8 hover:text-red-400/80",
    },
  ];

  return (
    <div>
      {/* Header row */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-white/40">
          <span className="font-semibold text-white/80">
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
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
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
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/8 bg-white/[2%] py-16 text-center">
          <IconMoodEmpty className="mb-3 h-10 w-10 text-white/10" />
          <h3 className="mb-1 text-sm font-semibold text-white/40">
            No votes yet
          </h3>
          <p className="text-xs text-white/25">
            {activeFilter
              ? `No ${activeFilter} votes to show.`
              : "Start voting on questions and answers to track them here."}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {votes.documents.map((vote) => {
            const isUpvote = vote.voteStatus === "upvoted";
            return (
              <div
                key={vote.$id}
                className="group flex items-start gap-4 rounded-xl border border-white/8 bg-white/[2%] p-4 transition-all duration-150 hover:border-white/12 hover:bg-white/[3%]"
              >
                {/* Vote badge */}
                <div
                  className={`mt-0.5 flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${
                    isUpvote
                      ? "border-orange-500/30 bg-orange-500/10 text-orange-400"
                      : "border-red-500/30 bg-red-500/10 text-red-400"
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
                      <span className="truncate text-sm font-medium text-white/80 transition-colors duration-150 group-hover/link:text-orange-400">
                        {vote.question.title}
                      </span>
                      <IconExternalLink className="h-3 w-3 shrink-0 text-white/20 opacity-0 transition-all duration-150 group-hover/link:text-orange-400/60 group-hover/link:opacity-100" />
                    </Link>
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/30">
                    <span
                      className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${
                        vote.type === "question"
                          ? "border-blue-500/20 bg-blue-500/8 text-blue-400/70"
                          : "border-purple-500/20 bg-purple-500/8 text-purple-400/70"
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
