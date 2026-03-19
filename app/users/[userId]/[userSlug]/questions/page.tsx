import Pagination from "@/components/Pagination";
import QuestionCard from "@/components/QuestionCard";
import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { Query } from "node-appwrite";
import React from "react";

const Page = async ({
    params,
    searchParams,
}: {
    params: Promise<{ userId: string; userSlug: string }>;
    searchParams: Promise<{ page?: string }>;
}) => {
    const { userId } = await params;
    const resolvedSearchParams = await searchParams;
    resolvedSearchParams.page ||= "1";

    const queries = [
        Query.equal("authorId", userId),
        Query.orderDesc("$createdAt"),
        Query.offset((+resolvedSearchParams.page - 1) * 25),
        Query.limit(25),
    ];

    const questions = await databases.listDocuments(db, questionCollection, queries);

    questions.documents = await Promise.all(
        questions.documents.map(async ques => {
            const [author, answers, votes] = await Promise.all([
                users.get<UserPrefs>(ques.authorId),
                databases.listDocuments(db, answerCollection, [
                    Query.equal("questionId", ques.$id),
                    Query.limit(1), // for optimization
                ]),
                databases.listDocuments(db, voteCollection, [
                    Query.equal("type", "question"),
                    Query.equal("typeId", ques.$id),
                    Query.limit(1), // for optimization
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
        })
    );

    return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-card/75 px-4 py-3">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">
            {questions.total.toLocaleString()}
          </span>{" "}
          {questions.total === 1 ? "question" : "questions"} asked
        </p>
      </div>

      {questions.documents.length === 0 ? (
        <div className="rounded-xl border border-border bg-card/70 p-10 text-center text-sm text-muted-foreground">
          No questions yet.
        </div>
      ) : (
        <div className="max-w-4xl space-y-4">
          {questions.documents.map((ques) => (
            <QuestionCard key={ques.$id} ques={ques} />
          ))}
        </div>
      )}

      {questions.total > 25 && <Pagination total={questions.total} limit={25} />}
    </div>
    );
};

export default Page;
