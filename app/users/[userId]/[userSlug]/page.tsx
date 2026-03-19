import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import React from "react";
import NumberTicker from "@/components/magicui/number-ticker";
import { answerCollection, db, questionCollection } from "@/models/name";
import { Query } from "node-appwrite";
import {
  IconSparkles,
  IconQuestionMark,
  IconMessageCircle,
} from "@tabler/icons-react";

const Page = async ({
    params,
}: {
    params: Promise<{ userId: string; userSlug: string }>;
}) => {
    const { userId } = await params;
    const [user, questions, answers] = await Promise.all([
        users.get<UserPrefs>(userId),
        databases.listDocuments(db, questionCollection, [
            Query.equal("authorId", userId),
            Query.limit(1), // for optimization
        ]),
        databases.listDocuments(db, answerCollection, [
            Query.equal("authorId", userId),
            Query.limit(1), // for optimization
        ]),
    ]);

  const stats = [
    {
      label: "Reputation",
      value: user.prefs.reputation,
      icon: <IconSparkles className="h-4 w-4 text-primary" />,
      tone: "border-primary/30 bg-primary/10 text-primary",
    },
    {
      label: "Questions asked",
      value: questions.total,
      icon: <IconQuestionMark className="h-4 w-4 text-chart-2" />,
      tone: "border-chart-2/30 bg-chart-2/12 text-chart-2",
    },
    {
      label: "Answers given",
      value: answers.total,
      icon: <IconMessageCircle className="h-4 w-4 text-chart-3" />,
      tone: "border-chart-3/30 bg-chart-3/12 text-chart-3",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {stats.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md"
        >
          <div
            className={`mb-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${item.tone}`}
          >
            {item.icon}
            {item.label}
          </div>
          <p className="text-4xl font-semibold tracking-tight text-foreground">
            <NumberTicker value={item.value} />
          </p>
        </div>
      ))}
    </div>
  );
};

export default Page;
