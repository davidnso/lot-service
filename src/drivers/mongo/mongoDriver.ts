import { MongoDataStoreBuilder } from "./mongoDataStoreBuilder";
import { Db, ObjectId } from "mongodb";

require("dotenv").config();


// const DB_URI = process.env.DB_URI?.replace(
//     /<password>/g,
//     process.env.DB_PASSWORD as string );

export class MongoDriver {
    static db: Db | undefined;
    private static instance: MongoDriver;
    constructor() {
      MongoDataStoreBuilder.buildDriver({} as string).then(dataStore => {
        MongoDriver.db = dataStore;
      });
    }
  
    static getInstance() {
      if (!this.instance) {
        MongoDriver.instance = new MongoDriver();
      }
      return MongoDriver.instance;
    }
}