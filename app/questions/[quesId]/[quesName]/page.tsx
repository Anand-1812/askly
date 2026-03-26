import Answers from "@/components/Answers";
import Comments from "@/components/Comments";
import { MarkdownPreview } from "@/components/RTE";
import VoteButtons from "@/components/VoteButtons";
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
import { normalizeTags } from "@/utils/tags";
import Link from "next/link";
import { Query } from "node-appwrite";
import React from "react";
import DeleteQuestion from "./DeleteQuestion";
import EditQuestion from "./EditQuestion";
import { IconCalendar, IconMessageCircle, IconArrowUp } from "@tabler/icons-react";

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
  const questionTags = normalizeTags(question.tags);

  [comments.documents, answers.documents] = await Promise.all([
    Promise.all(
      comments.documents.map(async (comment) => {
        const commentAuthor = await users.get<UserPrefs>(comment.authorId);
        return {
          ...comment,
          author: {
            $id: commentAuthor.$id,
            name: commentAuthor.name,
            reputation: commentAuthor.prefs.reputation,
          },
        };
      }),
    ),
    Promise.all(
      answers.documents.map(async (answer) => {
        const [answerAuthor, answerComments, answerUpvotes, answerDownvotes] = await Promise.all([
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

        answerComments.documents = await Promise.all(
          answerComments.documents.map(async (comment) => {
            const commentAuthor = await users.get<UserPrefs>(comment.authorId);
            return {
              ...comment,
              author: {
                $id: commentAuthor.$id,
                name: commentAuthor.name,
                reputation: commentAuthor.prefs.reputation,
              },
            };
          }),
        );

        return {
          ...answer,
          comments: answerComments,
          upvotesDocuments: answerUpvotes,
          downvotesDocuments: answerDownvotes,
          author: {
            $id: answerAuthor.$id,
            name: answerAuthor.name,
            reputation: answerAuthor.prefs.reputation,
          },
        };
      }),
    ),
  ]);

  return (
    <div className="page-shell min-h-screen">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-3xl border border-border/80 bg-card/75 p-6 shadow-sm sm:p-8">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <h1 className="font-serif text-2xl font-semibold leading-snug tracking-tight text-foreground sm:text-4xl">
                {question.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/70 px-3 py-1">
                  <IconCalendar className="h-3.5 w-3.5" />
                  Asked {convertDateToRelativeTime(new Date(question.$createdAt))}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/70 px-3 py-1">
                  <IconMessageCircle className="h-3.5 w-3.5" />
                  {answers.total} answers
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/70 px-3 py-1">
                  <IconArrowUp className="h-3.5 w-3.5" />
                  {upvotes.total + downvotes.total} votes
                </span>
              </div>
            </div>

            <Link href="/questions/ask" className="shrink-0">
              <ShimmerButton className="shadow-md">
                <span className="text-sm font-semibold text-primary-foreground lg:text-base">
                  Ask a question
                </span>
              </ShimmerButton>
            </Link>
          </div>

          <div className="flex flex-col gap-5 md:flex-row">
            <div className="flex shrink-0 items-start justify-start gap-3 md:sticky md:top-32 md:flex-col">
              <VoteButtons
                type="question"
                id={question.$id}
                upvotes={upvotes}
                downvotes={downvotes}
              />

              <div className="flex items-center gap-2 md:flex-col">
                <EditQuestion
                  questionId={question.$id}
                  questionTitle={question.title}
                  authorId={question.authorId}
                />
                <DeleteQuestion questionId={question.$id} authorId={question.authorId} />
              </div>
            </div>

            <div className="min-w-0 flex-1 space-y-5">
              <div className="overflow-hidden rounded-2xl border border-border bg-background/65">
                <MarkdownPreview className="p-5 text-sm leading-relaxed" source={question.content} />
              </div>

              {question.attachmentId && (
                <div className="overflow-hidden rounded-2xl border border-border bg-background/65">
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

              {questionTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {questionTags.map((tag: string) => (
                    <Link
                      key={tag}
                      href={`/questions?tag=${tag}`}
                      className="inline-flex rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground transition-all hover:border-primary/35 hover:text-primary"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}

              <div className="flex justify-end">
                <div className="flex items-center gap-2.5 rounded-xl border border-border bg-background/70 px-4 py-3">
                  <picture>
                    <img
                      src={avatars.getInitials(author.name, 38, 38) as unknown as string}
                      alt={author.name}
                      className="rounded-lg"
                    />
                  </picture>
                  <div className="leading-snug">
                    <Link
                      href={`/users/${author.$id}/${slugify(author.name)}`}
                      className="block text-sm font-semibold text-primary transition-colors hover:brightness-110"
                    >
                      {author.name}
                    </Link>
                    <span className="text-xs text-muted-foreground">{author.prefs.reputation} reputation</span>
                  </div>
                </div>
              </div>

              <Comments comments={comments as any} className="mt-2" type="question" typeId={question.$id} />

              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

              <Answers answers={answers as any} questionId={question.$id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
