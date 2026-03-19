import Answers from "@/components/Answers";
import Comments from "@/components/Comments";
import { MarkdownPreview } from "@/components/RTE";
import VoteButtons from "@/components/VoteButtons";
import Particles from "@/components/magicui/particles";
import ShimmerButton from "@/components/magicui/shimmer-button";
import {
  answerCollection,
  db,
  voteCollection,
  questionCollection,
  commentCollection,
  questionAttachmentBucket,
} from "@/models/name";
import { avatars, databases, storage, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import convertDateToRelativeTime from "@/utils/relativeTime";
import slugify from "@/utils/slugify";
import Link from "next/link";
import { Query } from "node-appwrite";
import React from "react";
import DeleteQuestion from "./DeleteQuestion";
import EditQuestion from "./EditQuestion";
import {
  IconCalendar,
  IconMessageCircle,
  IconArrowUp,
} from "@tabler/icons-react";

const Page = async ({
  params,
}: {
  params: Promise<{ quesId: string; quesName: string }>;
}) => {
  const { quesId } = await params;
  const [question, answers, upvotes, downvotes, comments] = await Promise.all([
    databases.getDocument(db, questionCollection, quesId),
    databases.listDocuments(db, answerCollection, [
      Query.orderDesc("$createdAt"),
      Query.equal("questionId", quesId),
    ]),
    databases.listDocuments(db, voteCollection, [
      Query.equal("typeId", quesId),
      Query.equal("type", "question"),
      Query.equal("voteStatus", "upvoted"),
      Query.limit(1),
    ]),
    databases.listDocuments(db, voteCollection, [
      Query.equal("typeId", quesId),
      Query.equal("type", "question"),
      Query.equal("voteStatus", "downvoted"),
      Query.limit(1),
    ]),
    databases.listDocuments(db, commentCollection, [
      Query.equal("type", "question"),
      Query.equal("typeId", quesId),
      Query.orderDesc("$createdAt"),
    ]),
  ]);

  const author = await users.get<UserPrefs>(question.authorId);

  [comments.documents, answers.documents] = await Promise.all([
    Promise.all(
      comments.documents.map(async (comment) => {
        const author = await users.get<UserPrefs>(comment.authorId);
        return {
          ...comment,
          author: {
            $id: author.$id,
            name: author.name,
            reputation: author.prefs.reputation,
          },
        };
      }),
    ),
    Promise.all(
      answers.documents.map(async (answer) => {
        const [author, comments, upvotes, downvotes] = await Promise.all([
          users.get<UserPrefs>(answer.authorId),
          databases.listDocuments(db, commentCollection, [
            Query.equal("typeId", answer.$id),
            Query.equal("type", "answer"),
            Query.orderDesc("$createdAt"),
          ]),
          databases.listDocuments(db, voteCollection, [
            Query.equal("typeId", answer.$id),
            Query.equal("type", "answer"),
            Query.equal("voteStatus", "upvoted"),
            Query.limit(1),
          ]),
          databases.listDocuments(db, voteCollection, [
            Query.equal("typeId", answer.$id),
            Query.equal("type", "answer"),
            Query.equal("voteStatus", "downvoted"),
            Query.limit(1),
          ]),
        ]);

        comments.documents = await Promise.all(
          comments.documents.map(async (comment) => {
            const author = await users.get<UserPrefs>(comment.authorId);
            return {
              ...comment,
              author: {
                $id: author.$id,
                name: author.name,
                reputation: author.prefs.reputation,
              },
            };
          }),
        );

        return {
          ...answer,
          comments,
          upvotesDocuments: upvotes,
          downvotesDocuments: downvotes,
          author: {
            $id: author.$id,
            name: author.name,
            reputation: author.prefs.reputation,
          },
        };
      }),
    ),
  ]);

  return (
    <div className="min-h-screen">
      <Particles
        className="fixed inset-0 -z-10 h-full w-full"
        quantity={300}
        ease={100}
        color="#ffffff"
        refresh
      />

      <div className="container mx-auto px-4 pb-24 pt-32">
        {/* ── Page header ──────────────────────────────────────── */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex-1">
            <h1 className="text-2xl font-bold leading-snug tracking-tight text-white sm:text-3xl">
              {question.title}
            </h1>

            {/* Meta */}
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-white/40">
              <span className="flex items-center gap-1.5">
                <IconCalendar className="h-3.5 w-3.5" />
                Asked{" "}
                <span className="text-white/60">
                  {convertDateToRelativeTime(new Date(question.$createdAt))}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <IconMessageCircle className="h-3.5 w-3.5" />
                <span className="text-white/60">{answers.total}</span> answers
              </span>
              <span className="flex items-center gap-1.5">
                <IconArrowUp className="h-3.5 w-3.5" />
                <span className="text-white/60">
                  {upvotes.total + downvotes.total}
                </span>{" "}
                votes
              </span>
            </div>
          </div>

          <Link href="/questions/ask" className="shrink-0">
            <ShimmerButton className="shadow-[0_0_24px_rgba(249,115,22,0.25)]">
              <span className="text-sm font-semibold text-white lg:text-base">
                Ask a question
              </span>
            </ShimmerButton>
          </Link>
        </div>

        {/* Divider */}
        <div className="mb-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* ── Main content ─────────────────────────────────────── */}
        <div className="flex gap-5">
          {/* Vote + action column */}
          <div className="flex shrink-0 flex-col items-center gap-3 pt-2">
            <VoteButtons
              type="question"
              id={question.$id}
              upvotes={upvotes}
              downvotes={downvotes}
            />
            <div className="flex flex-col items-center gap-2">
              <EditQuestion
                questionId={question.$id}
                questionTitle={question.title}
                authorId={question.authorId}
              />
              <DeleteQuestion
                questionId={question.$id}
                authorId={question.authorId}
              />
            </div>
          </div>

          {/* Question body */}
          <div className="min-w-0 flex-1">
            {/* Content */}
            <div className="overflow-hidden rounded-xl border border-white/8 bg-white/[2%]">
              <MarkdownPreview
                className="p-5 text-sm leading-relaxed"
                source={question.content}
              />
            </div>

            {/* Attachment image — only render when an attachmentId exists */}
            {question.attachmentId && (
              <div className="mt-4 overflow-hidden rounded-xl border border-white/8">
                <picture>
                  <img
                    src={
                      storage.getFilePreview(
                        questionAttachmentBucket,
                        question.attachmentId,
                      ) as unknown as string
                    }
                    alt={question.title}
                    className="w-full object-contain"
                  />
                </picture>
              </div>
            )}

            {/* Tags */}
            {question.tags?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {question.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/questions?tag=${tag}`}
                    className="inline-block rounded-md border border-white/8 bg-white/[4%] px-2.5 py-1 text-xs text-white/50 transition-all duration-150 hover:border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-400"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Author card */}
            <div className="mt-5 flex justify-end">
              <div className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/[3%] px-4 py-3">
                <picture>
                  <img
                    src={
                      avatars.getInitials(
                        author.name,
                        36,
                        36,
                      ) as unknown as string
                    }
                    alt={author.name}
                    className="rounded-lg"
                  />
                </picture>
                <div className="leading-snug">
                  <Link
                    href={`/users/${author.$id}/${slugify(author.name)}`}
                    className="block text-sm font-medium text-orange-400 transition-colors hover:text-orange-300"
                  >
                    {author.name}
                  </Link>
                  <span className="text-xs text-white/35">
                    {author.prefs.reputation} reputation
                  </span>
                </div>
              </div>
            </div>

            {/* Comments on question */}
            <Comments
              comments={comments as any}
              className="mt-5"
              type="question"
              typeId={question.$id}
            />

            {/* Divider */}
            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Answers */}
            <Answers answers={answers as any} questionId={question.$id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
