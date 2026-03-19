export const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "askly-db";
export const questionCollection =
    process.env.NEXT_PUBLIC_APPWRITE_QUESTIONS_COLLECTION_ID || "questions";
export const answerCollection =
    process.env.NEXT_PUBLIC_APPWRITE_ANSWERS_COLLECTION_ID || "answers";
export const commentCollection =
    process.env.NEXT_PUBLIC_APPWRITE_COMMENTS_COLLECTION_ID || "comments";
export const voteCollection =
    process.env.NEXT_PUBLIC_APPWRITE_VOTES_COLLECTION_ID || "votes";
export const questionAttachmentBucket =
    process.env.NEXT_PUBLIC_APPWRITE_QUESTION_BUCKET_ID || "question-attachment";
