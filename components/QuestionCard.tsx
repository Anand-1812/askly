"use client";

import React from "react";
import Link from "next/link";
import slugify from "@/utils/slugify";
import { avatars } from "@/models/client/config";
import convertDateToRelativeTime from "@/utils/relativeTime";
import { IconArrowUp, IconMessageCircle } from "@tabler/icons-react";

const QuestionCard = ({ ques }: { ques: any }) => {
  return (
    <article className="group rounded-2xl border border-border/80 bg-background/75 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35">
      <div className="flex flex-col gap-4">
        <div>
          <Link href={`/questions/${ques.$id}/${slugify(ques.title)}`} className="group/title">
            <h2 className="text-lg font-semibold leading-snug text-foreground transition-colors duration-150 group-hover/title:text-primary sm:text-xl">
              {ques.title}
            </h2>
          </Link>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {ques.tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/questions?tag=${tag}`}
                className="inline-flex rounded-full border border-border bg-card/80 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-all hover:border-primary/35 hover:text-primary"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/80 px-3 py-1 text-muted-foreground">
omport React from "react";
            <IconArrowUp className="h-3.5 w-3.5 text-primary" />
            <span className="font-semibold text-foreground">{ques.totalVotes}</span>
            votes
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/80 px-3 py-1 text-muted-foreground">
            <IconMessageCircle className="h-3.5 w-3.5 text-accent" />
            <span className="font-semibold text-foreground">{ques.totalAnswers}</span>
            answers
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border/70 pt-4 text-xs text-muted-foreground">
          <span>{convertDateToRelativeTime(new Date(ques.$createdAt))}</span>

          <div className="flex items-center gap-2 rounded-full border border-border bg-card/75 px-2.5 py-1.5">
            <picture>
              <img src={avatars.getInitials(ques.author.name, 24, 24)} alt={ques.author.name} className="rounded-full" />
            </picture>
            <div>
              <Link
                href={`/users/${ques.author.$id}/${slugify(ques.author.name)}`}
                className="font-semibold text-primary transition-colors hover:brightness-110"
              >
                {ques.author.name}
              </Link>
              <div className="text-[10px] text-muted-foreground">{ques.author.reputation} rep</div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default QuestionCard;
