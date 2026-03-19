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
  IconFilter,
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

  if (resolvedSearchParams.tag) {
    queries.push(Query.equal("tags", resolvedSearchParams.tag));
  }

  if (resolvedSearchParams.search) {
    queries.push(
      Query.or([
        Query.search("title", resolvedSearchParams.search),
        Query.search("content", resolvedSearchParams.search),
      ]),
    );
  }

  const questions = await databases.listDocuments(db, questionCollection, queries);

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

  const isFiltered = Boolean(resolvedSearchParams.tag || resolvedSearchParams.search);

  return (
    <div className="page-shell min-h-screen">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/80 bg-card/70 p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {resolvedSearchParams.tag ? (
                  <>
                    Questions tagged{" "}
                    <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-primary">
                      {resolvedSearchParams.tag}
                    </span>
                  </>
                ) : resolvedSearchParams.search ? (
                  <>
                    Results for{" "}
                    <span className="text-primary">&ldquo;{resolvedSearchParams.search}&rdquo;</span>
                  </>
                ) : (
                  "All Questions"
                )}
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                {questions.total.toLocaleString()} {questions.total === 1 ? "question" : "questions"} found
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

          <div className="mb-6 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 text-xs font-medium text-muted-foreground">
              <IconListDetails className="h-3.5 w-3.5 text-primary" />
              <span>
                <span className="font-semibold text-foreground">{questions.total}</span> total
              </span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 text-xs font-medium text-muted-foreground">
              <IconMessageCircle className="h-3.5 w-3.5 text-accent" />
              <span>
                Page <span className="font-semibold text-foreground">{resolvedSearchParams.page}</span>
              </span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 text-xs font-medium text-muted-foreground">
              <IconFilter className="h-3.5 w-3.5 text-chart-4" />
              <span>{isFiltered ? "Filters active" : "No filters"}</span>
            </div>

            {isFiltered && (
              <Link
                href="/questions"
                className="inline-flex items-center rounded-full border border-border bg-background/70 px-4 py-2 text-xs font-semibold text-muted-foreground transition-all hover:border-primary/35 hover:text-primary"
              >
                Clear filters
              </Link>
            )}
          </div>

          <div className="mb-6">
            <Search />
          </div>

          {questions.documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background/60 py-16 text-center">
              <IconArrowUp className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-semibold text-foreground/90">No questions found</h3>
              <p className="mb-5 max-w-sm text-sm text-muted-foreground">
                {isFiltered
                  ? "Try another search keyword or clear the active filters."
                  : "Be the first person to ask a great question in this space."}
              </p>
              <Link href="/questions/ask">
                <ShimmerButton>
                  <span className="text-sm font-semibold text-primary-foreground">Ask a question</span>
                </ShimmerButton>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.documents.map((ques) => (
                <QuestionCard key={ques.$id} ques={ques} />
              ))}
            </div>
          )}

          {questions.total > 25 && (
            <div className="mt-9">
              <Pagination total={questions.total} limit={25} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
