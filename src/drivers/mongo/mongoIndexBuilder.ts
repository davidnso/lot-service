import { Db, MongoClient } from "mongodb";
import { IIndexItem } from "../../shared/interfaces";
require("dotenv").config();



export class MongoItemIndex {
   db: Db;

  private async initConnection() {
    const client = new MongoClient(process.env.DB_URI, { useNewUrlParser: true });
    try {
      await client.connect();
      console.log("connected item index");
      this.db = client.db("item-index");
    } catch (err) {
      console.log("Error on connect: " + err);
    }
  }

  private async closeConnection(){
    (this.db as any).close();
  }

  public async searchIndex(args: { 
      index: string,
      query: {
          text: string,
          brand: string[],
      }
  }):Promise<IIndexItem[]> { 
    try {
        await this.initConnection(); 
        console.log('here in search index', args)

        let query: any = { 
            $text: { 
                $search: args.query.text || " ", $caseSensitive: false
            }
        }

        if(args.query.brand){ 
            query.$and = []
            query.$and.push({ 
                brand: { $in: args.query.brand}
            })
        }
        console.log(query)
        const items = await this.db.collection(args.index).find<IIndexItem>(query).toArray();
        this.closeConnection()

        return items;

    } catch (error) {
      console.log(error)
        throw error;
    }
  }
}