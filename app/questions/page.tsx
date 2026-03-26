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
import { normalizeTags } from "@/utils/tags";
import {
  IconMessageCircle,
  IconArrowUp,
  IconListDetails,
  IconFilter,
  IconPlus,
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
        users.get<UserPrefs>(ques.authorId).catch(() => ({
            $id: ques.authorId,
            name: "User",
            prefs: { reputation: 0 }
        })),
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
        tags: normalizeTags(ques.tags),
        totalAnswers: answers.total,
        totalVotes: votes.total,
        author: {
          $id: (author as any).$id,
          reputation: (author as any).prefs.reputation,
          name: (author as any).name,
        },
      };
    }),
  );

  const isFiltered = Boolean(resolvedSearchParams.tag || resolvedSearchParams.search);

  return (
    <div className="page-shell min-h-screen">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {resolvedSearchParams.tag ? (
                <>
                  Tagged with <span className="text-primary">#{resolvedSearchParams.tag}</span>
                </>
              ) : resolvedSearchParams.search ? (
                <>
                  Search: <span className="text-primary">&ldquo;{resolvedSearchParams.search}&rdquo;</span>
                </>
              ) : (
                "Explore Questions"
              )}
            </h1>
            <p className="text-base text-muted-foreground">
              Browse {questions.total.toLocaleString()} expert discussions from the community.
            </p>
          </div>

          <Link href="/questions/ask" className="shrink-0">
            <ShimmerButton className="shadow-lg shadow-primary/20">
              <span className="flex items-center gap-2 text-sm font-bold lg:text-base">
                <IconPlus className="h-5 w-5" />
                Ask a Question
              </span>
            </ShimmerButton>
          </Link>
        </div>

        {/* Filters and Stats Bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/50 bg-card/40 p-4 backdrop-blur-sm">
          <div className="flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <IconListDetails className="h-3.5 w-3.5 text-primary" />
              <span>{questions.total} total</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <IconMessageCircle className="h-3.5 w-3.5 text-accent" />
              <span>Page {resolvedSearchParams.page}</span>
            </div>
            {isFiltered && (
              <Link
                href="/questions"
                className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition-all hover:bg-primary/20"
              >
                <IconFilter className="h-3.5 w-3.5" />
                Clear Filters
              </Link>
            )}
          </div>
          
          <div className="w-full md:w-72">
            <Search />
          </div>
        </div>

        {/* Content Area */}
        {questions.documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/20 py-24 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/20 text-muted-foreground/50">
                <IconArrowUp className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">No matches found</h3>
            <p className="mb-8 max-w-sm text-sm text-muted-foreground">
              {isFiltered
                ? "We couldn't find anything for that search. Try broadening your keywords."
                : "The community is quiet... be the first to start a conversation!"}
            </p>
            <Link href="/questions/ask">
              <ShimmerButton>
                <span className="text-sm font-bold">Start a Question</span>
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

        {/* Pagination */}
        {questions.total > 25 && (
          <div className="mt-12 flex justify-center">
            <Pagination total={questions.total} limit={25} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
