import {IndexType, Permission} from "node-appwrite"
import { db, questionCollection } from "../name"
import { databases } from "./config"

const createQuestionCollection = async () => {
  // how to create collection ?
  await databases.createCollection(db, questionCollection, questionCollection, [
    Permission.read("any"),
    Permission.read("users"),
    Permission.write("users"),
    Permission.update("users"),
    Permission.delete("users"),
  ])

  // create attribute
  await Promise.all([
    databases.createStringAttribute(db, questionCollection, "title", 100, true),
    databases.createStringAttribute(db, questionCollection, "content", 10000, true),
    databases.createStringAttribute(db, questionCollection, "authorId", 50, true),
    databases.createStringAttribute(db, questionCollection, "tags", 50, false),
    databases.createStringAttribute(db, questionCollection, "attachmentId", 50, false),
  ]);
  console.log("Question attribute")

  // create index
  await Promise.all([
  databases.createIndex(db, questionCollection, "title", IndexType.Fulltext, ["title"], ["asc"]),
  databases.createIndex(db, questionCollection, "conten", IndexType.Fulltext, ["content"], ["asc"])
  ])
}

export default createQuestionCollection
