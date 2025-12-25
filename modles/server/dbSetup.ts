import { db } from "../name";
import { databases } from "./config";

import createQuestionCollection from "./questions.collection";
import createAnswerCollection from "./answer.collection";

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
        // todo add all colection
      ])
    } catch (error) {
      console.log(`Error at db or collection: ${error}`)
    }
  }
}

export default getOrCreateDb
