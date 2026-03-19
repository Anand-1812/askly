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
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {resolvedSearchParams.tag ? (
                <>
                  Questions tagged{" "}
                  <span className="rounded-lg border border-primary/30 bg-primary/12 px-3 py-1 text-primary">
                    {resolvedSearchParams.tag}
                  </span>
                </>
              ) : resolvedSearchParams.search ? (
                <>
                  Results for{" "}
                  <span className="text-primary">
                    &ldquo;{resolvedSearchParams.search}&rdquo;
                  </span>
                </>
              ) : (
                "All Questions"
              )}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {questions.total.toLocaleString()}{" "}
              {questions.total === 1 ? "question" : "questions"} found
            </p>
          </div>

          <Link href="/questions/ask" className="shrink-0">
            <ShimmerButton className="shadow-md">
              <span className="text-sm font-semibold text-primary-foreground lg:text-base">
                Ask a question
              </span>
            </ShimmerButton>
          </Link>
        </div>

        {/* Stats strip */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
            <IconListDetails className="h-4 w-4 text-primary/80" />
            <span>
              <span className="font-semibold text-foreground">
                {questions.total}
              </span>{" "}
              questions
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
            <IconMessageCircle className="h-4 w-4 text-chart-2/80" />
            <span>
              Page{" "}
              <span className="font-semibold text-foreground">
                {resolvedSearchParams.page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">
                {Math.ceil(questions.total / 25) || 1}
              </span>
            </span>
          </div>
          {isFiltered && (
            <Link
              href="/questions"
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-all hover:border-primary/35 hover:text-primary"
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
        <div className="mb-6 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Questions list */}
        {questions.documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card/80 py-20 text-center">
            <IconArrowUp className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <h3 className="mb-2 text-lg font-semibold text-foreground/80">
              No questions found
            </h3>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
              {isFiltered
                ? "Try adjusting your search or clearing the filters."
                : "Be the first to ask a question!"}
            </p>
            <Link href="/questions/ask">
              <ShimmerButton>
                <span className="text-sm font-semibold text-primary-foreground">
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
