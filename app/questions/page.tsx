import { databases, users } from "@/models/server/config";
import {
  answerCollection,
  db,
  voteCollection,
  questionCollection,
} from "@/models/name";
import { Query } from "node-appwrite";
import React from "react";
import Link from "next/link";
import ShimmerButton from "@/components/magicui/shimmer-button";
import QuestionCard from "@/components/QuestionCard";
import { UserPrefs } from "@/store/Auth";
import Pagination from "@/components/Pagination";
import Search from "./Search";
import {
  IconMessageCircle,
  IconArrowUp,
  IconListDetails,
} from "@tabler/icons-react";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tag?: string; search?: string }>;
}) => {
  const resolvedSearchParams = await searchParams;
  resolvedSearchParams.page ||= "1";

  const queries = [
    Query.orderDesc("$createdAt"),
    Query.offset((+resolvedSearchParams.page - 1) * 25),
    Query.limit(25),
  ];

  if (resolvedSearchParams.tag)
    queries.push(Query.equal("tags", resolvedSearchParams.tag));
  if (resolvedSearchParams.search)
    queries.push(
      Query.or([
        Query.search("title", resolvedSearchParams.search),
        Query.search("content", resolvedSearchParams.search),
      ]),
    );

  const questions = await databases.listDocuments(
    db,
    questionCollection,
    queries,
  );

  questions.documents = await Promise.all(
    questions.documents.map(async (ques) => {
      const [author, answers, votes] = await Promise.all([
        users.get<UserPrefs>(ques.authorId),
        databases.listDocuments(db, answerCollection, [
          Query.equal("questionId", ques.$id),
          Query.limit(1),
        ]),
        databases.listDocuments(db, voteCollection, [
          Query.equal("type", "question"),
          Query.equal("typeId", ques.$id),
          Query.limit(1),
        ]),
      ]);

      return {
        ...ques,
        totalAnswers: answers.total,
        totalVotes: votes.total,
        author: {
          $id: author.$id,
          reputation: author.prefs.reputation,
          name: author.name,
        },
      };
    }),
  );

  const isFiltered = resolvedSearchParams.tag || resolvedSearchParams.search;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 pb-20 pt-32">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {resolvedSearchParams.tag ? (
                <>
                  Questions tagged{" "}
                  <span className="rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-orange-400">
                    {resolvedSearchParams.tag}
                  </span>
                </>
              ) : resolvedSearchParams.search ? (
                <>
                  Results for{" "}
                  <span className="text-orange-400">
                    &ldquo;{resolvedSearchParams.search}&rdquo;
                  </span>
                </>
              ) : (
                "All Questions"
              )}
            </h1>
            <p className="mt-1.5 text-sm text-white/40">
              {questions.total.toLocaleString()}{" "}
              {questions.total === 1 ? "question" : "questions"} found
            </p>
          </div>

          <Link href="/questions/ask" className="shrink-0">
            <ShimmerButton className="shadow-[0_0_24px_rgba(249,115,22,0.3)]">
              <span className="text-sm font-semibold text-white lg:text-base">
                Ask a question
              </span>
            </ShimmerButton>
          </Link>
        </div>

        {/* Stats strip */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/[3%] px-4 py-2 text-sm text-white/50">
            <IconListDetails className="h-4 w-4 text-orange-400/70" />
            <span>
              <span className="font-semibold text-white/80">
                {questions.total}
              </span>{" "}
              questions
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/[3%] px-4 py-2 text-sm text-white/50">
            <IconMessageCircle className="h-4 w-4 text-emerald-400/70" />
            <span>
              Page{" "}
              <span className="font-semibold text-white/80">
                {resolvedSearchParams.page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-white/80">
                {Math.ceil(questions.total / 25) || 1}
              </span>
            </span>
          </div>
          {isFiltered && (
            <Link
              href="/questions"
              className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/[3%] px-4 py-2 text-sm text-white/50 transition-all hover:border-white/15 hover:text-white/80"
            >
              Clear filters ×
            </Link>
          )}
        </div>

        {/* Search */}
        <div className="mb-6">
          <Search />
        </div>

        {/* Divider */}
        <div className="mb-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Questions list */}
        {questions.documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-white/8 bg-white/[2%] py-20 text-center">
            <IconArrowUp className="mb-4 h-12 w-12 text-white/10" />
            <h3 className="mb-2 text-lg font-semibold text-white/50">
              No questions found
            </h3>
            <p className="mb-6 max-w-sm text-sm text-white/30">
              {isFiltered
                ? "Try adjusting your search or clearing the filters."
                : "Be the first to ask a question!"}
            </p>
            <Link href="/questions/ask">
              <ShimmerButton>
                <span className="text-sm font-semibold text-white">
                  Ask a question
                </span>
              </ShimmerButton>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.documents.map((ques) => (
              <QuestionCard key={ques.$id} ques={ques} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {questions.total > 25 && (
          <div className="mt-10">
            <Pagination total={questions.total} limit={25} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
