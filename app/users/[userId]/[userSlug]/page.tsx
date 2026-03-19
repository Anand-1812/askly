import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import React from "react";
import NumberTicker from "@/components/magicui/number-ticker";
import { answerCollection, db, questionCollection } from "@/models/name";
import { Query } from "node-appwrite";
import { IconSparkles, IconQuestionMark, IconMessageCircle } from "@tabler/icons-react";

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
      Query.limit(1),
    ]),
    databases.listDocuments(db, answerCollection, [
      Query.equal("authorId", userId),
      Query.limit(1),
    ]),
  ]);

  const stats = [
    {
      label: "Reputation",
      value: user.prefs.reputation,
      icon: <IconSparkles className="h-4 w-4 text-primary" />,
      tone: "border-primary/25 bg-primary/8",
    },
    {
      label: "Questions asked",
      value: questions.total,
      icon: <IconQuestionMark className="h-4 w-4 text-accent" />,
      tone: "border-accent/25 bg-accent/8",
    },
    {
      label: "Answers given",
      value: answers.total,
      icon: <IconMessageCircle className="h-4 w-4 text-chart-4" />,
      tone: "border-chart-4/30 bg-chart-4/10",
    },
  ];

  return (
    <div>
      <h2 className="mb-5 font-serif text-2xl font-semibold text-foreground">Profile Summary</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((item) => (
          <div key={item.label} className={`rounded-2xl border p-6 shadow-sm ${item.tone}`}>
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-semibold text-foreground/75">
              {item.icon}
              {item.label}
            </div>
            <p className="text-4xl font-semibold tracking-tight text-foreground">
              <NumberTicker value={item.value} />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
