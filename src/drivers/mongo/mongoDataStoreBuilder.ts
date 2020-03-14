import { Db, MongoClient } from "mongodb";
require("dotenv").config();

export class MongoDataStoreBuilder {
  static db: any;

  public static async buildDriver(uri: string) {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    try {
      await client.connect();
      console.log("connected");
      return client.db("safe");
    } catch (err) {
      console.log("Error on connect: " + err);
    }
  }
}