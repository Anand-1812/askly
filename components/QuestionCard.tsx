"use client";

import React from "react";
import Link from "next/link";
import slugify from "@/utils/slugify";
import { avatars } from "@/models/client/config";
import convertDateToRelativeTime from "@/utils/relativeTime";
import { IconArrowUp, IconMessageCircle } from "@tabler/icons-react";

const QuestionCard = ({ ques }: { ques: any }) => {
  return (
    <div className="group flex flex-col gap-4 rounded-lg border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-md hover:bg-muted">
      {/* Header with title */}
      <div>
        <Link
          href={`/questions/${ques.$id}/${slugify(ques.title)}`}
          className="group/title"
        >
          <h2 className="text-lg font-semibold leading-snug text-foreground transition-colors duration-150 group-hover/title:text-primary">
            {ques.title}
          </h2>
        </Link>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {ques.tags.map((tag: string) => (
            <Link
              key={tag}
              href={`/questions?tag=${tag}`}
              className="inline-block rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-foreground/70 transition-all duration-150 hover:bg-primary/20 hover:text-primary"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-foreground/70">
          <IconArrowUp className="h-4 w-4" />
          <span className="font-medium">{ques.totalVotes}</span>
          <span>votes</span>
        </div>
        <div className="flex items-center gap-1.5 text-foreground/70">
          <IconMessageCircle className="h-4 w-4" />
          <span className="font-medium">{ques.totalAnswers}</span>
          <span>answers</span>
        </div>
      </div>

      {/* Footer - Author and time */}
      <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-foreground/60">
        <span>{convertDateToRelativeTime(new Date(ques.$createdAt))}</span>
        <div className="flex items-center gap-2">
          <picture>
            <img
              src={avatars.getInitials(ques.author.name, 24, 24)}
              alt={ques.author.name}
              className="rounded"
            />
          </picture>
          <div>
            <Link
              href={`/users/${ques.author.$id}/${slugify(ques.author.name)}`}
              className="font-medium text-primary/90 transition-colors hover:text-primary"
            >
              {ques.author.name}
            </Link>
            <div className="text-foreground/50">{ques.author.reputation} rep</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
