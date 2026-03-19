import QuestionCard from "@/components/QuestionCard";
import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { Query } from "node-appwrite";
import React from "react";

const LatestQuestions = async () => {
    let hydratedQuestions: Array<Record<string, unknown>> | null = null;

    try {
        const questions = await databases.listDocuments(db, questionCollection, [
            Query.limit(5),
            Query.orderDesc("$createdAt"),
        ]);

        hydratedQuestions = await Promise.all(
            questions.documents.map(async ques => {
                const [answers, votes] = await Promise.all([
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

                const author = await users.get<UserPrefs>(ques.authorId).catch(() => ({
                    $id: ques.authorId,
                    name: "User",
                    prefs: { reputation: 0 },
                }));

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
    } catch (error) {
        console.error("LatestQuestions error:", error);
    }

    if (!hydratedQuestions) {
        return (
            <div className="rounded-xl border border-white/20 bg-white/5 p-4 text-sm text-white/70">
                Could not load latest questions yet. Check Appwrite database IDs and API key.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {hydratedQuestions.map(question => (
                <QuestionCard key={String(question.$id)} ques={question as any} />
            ))}
        </div>
    );
};

export default LatestQuestions;
