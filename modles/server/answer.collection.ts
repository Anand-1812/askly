import { databases } from "./config";
import { answerCollection, db } from "../name";
import { IndexType, Permission } from "node-appwrite";
import { permission } from "process";

const createAnswerCollection = async () => {
  await databases.createCollection(db, answerCollection, answerCollection, [
    Permission.read('any'),
    Permission.create('users'),
    Permission.read('users'),
    Permission.update('users'),
    Permission.delete('users')
  ])

  await Promise.all([
    databases.createStringAttribute(db, answerCollection, "content", 10000, true),
    databases.createStringAttribute(db, answerCollection, "questionId", 50, true),
    databases.createStringAttribute(db, answerCollection, "authorId", 50, true),
  ])
}

export default createAnswerCollection
