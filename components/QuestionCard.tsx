"use client";

import React from "react";
import { BorderBeam } from "./magicui/border-beam";
import Link from "next/link";
import { Models } from "appwrite";
import slugify from "@/utils/slugify";
import { avatars } from "@/models/client/config";
import convertDateToRelativeTime from "@/utils/relativeTime";
import { IconArrowUp, IconMessageCircle } from "@tabler/icons-react";

const QuestionCard = ({ ques }: { ques: any }) => {
  const [height, setHeight] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight);
    }
  }, []);

  return (
    <div
      ref={ref}
      className="group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-white/8 bg-white/[3%] p-5 transition-all duration-200 hover:border-white/15 hover:bg-white/[5%] sm:flex-row"
    >
      <BorderBeam size={height} duration={12} delay={9} />

      {/* Stats column */}
      <div className="flex shrink-0 flex-row gap-4 text-sm sm:flex-col sm:gap-2 sm:text-right">
        <div className="flex items-center gap-1.5 text-white/50 sm:flex-col sm:items-end sm:gap-0.5">
          <IconArrowUp className="h-3.5 w-3.5 text-white/30 sm:hidden" />
          <span className="font-semibold text-white/80">{ques.totalVotes}</span>
          <span className="text-xs text-white/40">votes</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/50 sm:flex-col sm:items-end sm:gap-0.5">
          <IconMessageCircle className="h-3.5 w-3.5 text-white/30 sm:hidden" />
          <span
            className={`font-semibold ${ques.totalAnswers > 0 ? "text-emerald-400" : "text-white/80"}`}
          >
            {ques.totalAnswers}
          </span>
          <span className="text-xs text-white/40">answers</span>
        </div>
      </div>

      {/* Divider on sm+ */}
      <div className="hidden w-px shrink-0 bg-white/8 sm:block" />

      {/* Content */}
      <div className="relative min-w-0 flex-1">
        <Link
          href={`/questions/${ques.$id}/${slugify(ques.title)}`}
          className="group/title"
        >
          <h2 className="text-base font-semibold leading-snug text-white/90 transition-colors duration-150 group-hover/title:text-orange-400">
            {ques.title}
          </h2>
        </Link>

        {/* Tags */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {ques.tags.map((tag: string) => (
            <Link
              key={tag}
              href={`/questions?tag=${tag}`}
              className="inline-block rounded-md border border-white/8 bg-white/[4%] px-2 py-0.5 text-xs text-white/50 transition-all duration-150 hover:border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-400"
            >
              {tag}
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-3 flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-xs text-white/40">
          <span>
            asked {convertDateToRelativeTime(new Date(ques.$createdAt))}
          </span>
          <div className="flex items-center gap-1.5">
            <picture>
              <img
                src={avatars.getInitials(ques.author.name, 20, 20)}
                alt={ques.author.name}
                className="rounded-md opacity-80"
              />
            </picture>
            <Link
              href={`/users/${ques.author.$id}/${slugify(ques.author.name)}`}
              className="font-medium text-orange-400/80 transition-colors hover:text-orange-400"
            >
              {ques.author.name}
            </Link>
            <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/30">
              {ques.author.reputation} rep
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
