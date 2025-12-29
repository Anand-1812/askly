import { db } from "../name";
import { databases } from "./config";

import createQuestionCollection from "./questions.collection";
import createAnswerCollection from "./answer.collection";
import createVoteCollection from "./vote.collection";
import createCommentCollection from "./comments.collection";

const getOrCreateDb = async () => {
  try {
    await databases.get(db)
  } catch (error: any) {
    try {
      await databases.create(db, db)
      console.log("Database created")

      await Promise.all([
        createAnswerCollection(),
        createQuestionCollection(),
        createVoteCollection(),
        createCommentCollection(),
      ])
    } catch (error) {
      console.log(`Error at db or collection: ${error}`)
    }
  }
}

export default getOrCreateDb
