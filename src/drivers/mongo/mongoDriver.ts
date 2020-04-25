import { MongoDataStoreBuilder } from "./mongoDataStoreBuilder";
import { Db, ObjectId } from "mongodb";
import { IMongoDriver } from "../interfaces/IMongoDriver";
import {
  IUser,
  IUserDocument,
  ICart,
  CartItem,
  ICartDocument,
  IBuyOrderDocument,
  IListingDocumnet,
  IReciept,
  IOutletDocument,
  IEventLog,
  IListing,
  IIndexItem,
  BuyOrderEvents,
  Action,
  Session,
  IFullListing,
} from "../../shared/interfaces";
import { searchQueryParams } from "../../shared/types";
import { MongoItemIndex } from "./mongoIndexBuilder";
import { Outlet } from "../../shared/entity/outlet";

require("dotenv").config();

// const DB_URI = process.env.DB_URI?.replace(
//     /<password>/g,
//     process.env.DB_PASSWORD as string );

const COLLECTIONS = {
  USERS: "users",
  OUTLET: "outlets",
  CARTS: "carts",
  LISTINGS: "listings",
  BUY_ORDERS: "posts",
  EVENT_LOGS: "logs",
  SESSIONS: "sessions",
  RECEIPTS: "reciepts",
  APPAREL_INDEX: "apparel-index",
  ACCESSORIES_INDEX: "accessories-index",
  FOOTWEAR_INDEX: "footwear-index",
};

export class MongoDriver implements IMongoDriver {
  db: Db | undefined;
  private static instance: MongoDriver;
  constructor() {
    MongoDataStoreBuilder.buildDriver(process.env.DB_URI as string).then(
      (dataStore) => {
        this.testConnection(dataStore);
        this.db = dataStore;
      }
    );
  }

  private testConnection(db: Db) {
    try {
      db.collection(COLLECTIONS.BUY_ORDERS).find({});
    } catch (error) {
      throw error;
    }
  }

  async createUser(args: { user: IUser }): Promise<void> {
    try {
      await this.db.collection(COLLECTIONS.USERS).insertOne(args.user);
      await this.createUserCart({ username: args.user.username });
      // console.log(this.db)
    } catch (err) {
      throw new Error(err);
    }
  }

  async findUser(args: {
    id: string;
    identifier: string;
  }): Promise<IUserDocument> {
    try {
      return await this.db
        .collection(COLLECTIONS.USERS)
        .findOne({ username: args.identifier });
    } catch (error) {
      throw error;
    }
  }

  async updateUserInformation(args: {
    username: string;
    updates: { [x: string]: string };
  }): Promise<IUserDocument> {
    try {
      const updateFields = Object.keys(args.updates);
      if (args.updates !== null && updateFields.length < 2) {
        const user = await this.db
          .collection(COLLECTIONS.USERS)
          .findOneAndUpdate(
            { username: args.username },
            { $set: { [updateFields[0]]: args.updates[updateFields[0]] } }
          );
        console.log(user);
        return user.value;
      }
    } catch (err) {
      throw err;
    }
  }

  async updateUserInformationById(args: {
    id: string;
    updates: string;
  }): Promise<IUserDocument> {
    try {
      const objId = new ObjectId(args.id);
      const updateFields = Object.keys(args.updates);
      if (args.updates !== null && updateFields.length < 2) {
        const user = await this.db
          .collection(COLLECTIONS.USERS)
          .findOneAndUpdate(
            { _id: objId },
            { $set: { [updateFields[0]]: args.updates[updateFields[0]] } }
          );
        console.log(user);
        return user.value;
      }
    } catch (err) {
      throw err;
    }
  }

  deleteUserAccount(args: { username: any }): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async createOutlet(args: {
    outletInformation: import("../../shared/interfaces").IOutlet;
  }): Promise<string> {
    try {
      const result = await this.db
        .collection(COLLECTIONS.OUTLET)
        .insertOne(args.outletInformation);
      console.log(result);

      return result.insertedId;
      // console.log(this.db)
    } catch (err) {
      throw err;
    }
  }

  async fetchOutlet(args: { outletId: string }): Promise<IOutletDocument> {
    try {
      const objId = new ObjectId(args.outletId);

      const outlet = await this.db
        .collection(COLLECTIONS.OUTLET)
        .findOne<IOutletDocument>({ _id: args.outletId });
      console.log(outlet);
      return outlet;
    } catch (error) {
      throw error;
    }
  }

  async fetchOutletByOwner(args: {
    owner: string;
  }): Promise<IOutletDocument[]> {
    try {
      return this.db
        .collection(COLLECTIONS.OUTLET)
        .find<IOutletDocument>({ owner: args.owner })
        .toArray();
    } catch (error) {
      throw error;
    }
  }

  async fetchOutletById(id: string) {
    try {
      const objId = new ObjectId(id);

      return await this.db
        .collection(COLLECTIONS.OUTLET)
        .findOne({ _id: objId });
    } catch (error) {
      throw error;
    }
  }

  async createListing(args: {
    orderInfo: import("../../shared/interfaces").IListing;
  }): Promise<void> {
    try {
      const result = await this.db
        .collection(COLLECTIONS.LISTINGS)
        .insertOne(args.orderInfo);
      console.log(result);
      // console.log(this.db)
    } catch (err) {
      throw new Error(err);
    }
  }

  async createAsk(args: {
    orderInfo: import("../../shared/interfaces").IBuyOrder;
  }): Promise<string> {
    try {
      const opResponse = await this.db
        .collection(COLLECTIONS.BUY_ORDERS)
        .insertOne(args.orderInfo);

      return opResponse.insertedId;
      // console.log(this.db)
    } catch (err) {
      throw new Error(err);
    }
  }

  async createSessionDocument(args: { outletId: string; askId: string }) {
    try {
      const opResponse = await this.db
        .collection(COLLECTIONS.SESSIONS)
        .insertOne({
          outletId: args.outletId,
          askId: args.askId,
          logs: [],
        });
      console.log(opResponse);

      return opResponse.insertedId as string;
    } catch (error) {
      throw error;
    }
  }

  async checkIfUserSessionExists(args: { outletId: string; askId: string }) {
    try {
      // let outletObjId  = new ObjectId(args.outletId)
      let askObjId = new ObjectId(args.askId);
      const opResponse = await this.db
        .collection(COLLECTIONS.SESSIONS)
        .findOne({ outletId: args.outletId, askId: args.askId });

      if (opResponse) {
        return opResponse;
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  async addLogToSession(args: { action: Action; sessionId: string }) {
    try {
      await this.db.collection(COLLECTIONS.SESSIONS).updateOne(
        {
          _id: args.sessionId,
        },
        {
          $push: {
            logs: args.action,
          },
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async findAllSessions(args: { askId: string }) {
    try {
      const sessions = await this.db
        .collection(COLLECTIONS.SESSIONS)
        .find<Session>({
          askId: args.askId,
        })
        .toArray();

      let fullSummary = [];

      for (const session of sessions) {
        const outlet = await this.db
          .collection(COLLECTIONS.OUTLET)
          .findOne<IOutletDocument>({ _id: new ObjectId(session.outletId) });
        fullSummary.push({
          _id: outlet._id,
          outletName: outlet.name,
          outletImg: outlet.bannerImg,
          session,
        });
      }

      return fullSummary;
    } catch (error) {
      throw error;
    }
  }

  async searchBuyOrder(args: {
    query: searchQueryParams;
    outlet?: string;
    index: string;
  }): Promise<IBuyOrderDocument[]> {
    try {
      const query: any = {
        $text: { $search: args.query.text || "", $caseSensitive: false },
      };

      if (args.query.filters) {
        query.$and = [];
        const keys = Object.keys(args.query.filters);
        keys.map((key: string) => {
          if (key !== "priceRange") {
            query.$and.push({
              key: { $in: args.query.filters[key] },
            });
          } else {
            //TODO: dynamically build query based on filters.
            query.$and.push({});
          }
        });
      }

      return await this.db
        .collection(COLLECTIONS.BUY_ORDERS)
        .aggregate<any>([
          {
            $project: {
              postObjId: {
                $toObjectId: "$indexId",
              },
              price: 1,
              details: 1,
              username: 1,
            },
          },
          {
            $lookup: {
              from: args.index,
              localField: "postObjId",
              foreignField: "_id",
              as: "indexItem",
            },
          },
          {
            $unwind: {
              path: "$indexItem",
              preserveNullAndEmptyArrays: false,
            },
          },
        ])
        .toArray();
    } catch (error) {
      throw error;
    }
  }

  async findAllUserBuyOrders(args: { username: string; index: string }) {
    try {
      return await this.db
        .collection(COLLECTIONS.BUY_ORDERS)
        .aggregate<any>([
          {
            $match: {
              username: args.username,
            },
          },
          {
            $project: {
              postObjId: {
                $toObjectId: "$indexId",
              },
              price: 1,
              details: 1,
              username: 1,
            },
          },
          {
            $lookup: {
              from: args.index,
              localField: "postObjId",
              foreignField: "_id",
              as: "indexItem",
            },
          },
          {
            $unwind: {
              path: "$indexItem",
              preserveNullAndEmptyArrays: false,
            },
          },
        ])
        .toArray();
    } catch (error) {
      throw error;
    }
  }

  async findAllActiveReponsders(args: { orderId }) {
    try {
      const activeOrder: IEventLog = await this.db
        .collection(COLLECTIONS.EVENT_LOGS)
        .findOne({ orderId: args.orderId });
      let sellers = activeOrder.sessions.map(async (sessionId) => {
        const session: Session = await this.db
          .collection(COLLECTIONS.SESSIONS)
          .findOne({ _id: sessionId });
        return session.outletId;
      });

      const allSellers = await this.db
        .collection(COLLECTIONS.OUTLET)
        .find({ _id: { $in: sellers } })
        .toArray();

      return { activeOrder, sellers: allSellers };
    } catch (error) {
      throw error;
    }
  }

  async findSessionResponses(args: { outletId: string; askId: string }) {
    try {
      const session = await this.db
        .collection(COLLECTIONS.SESSIONS)
        .findOne({ outletId: args.outletId, askId: args.outletId });
      return session;
    } catch (error) {
      throw error;
    }
  }

  async findSessionById(id: string) {
    try {
      const session = await this.db
        .collection(COLLECTIONS.SESSIONS)
        .findOne({ _id: new ObjectId(id) });
      return session;
    } catch (error) {
      throw error;
    }
  }

  async fetchAllListingsByOutletId(args: {
    outletId: string;
  }): Promise<IListingDocumnet[]> {
    try {
      //TODO: change storeId to outletId...
      const listings = await this.db
        .collection(COLLECTIONS.LISTINGS)
        .find<IListingDocumnet>({ storeId: args.outletId })
        .toArray();
      console.log(listings);
      return await this.mapToFullListing(listings);
    } catch (error) {
      throw error;
    }
  }

  async searchListings(args: {
    query: searchQueryParams;
    outlet: string;
  }): Promise<IFullListing[]> {
    try {

      const query: any = {};

      if(args.query.text){
        query.$text =  { $search: args.query.text || "", $caseSensitive: false };
      }

      // if (args.query.filters) {
      //   query.$and = [];
      //   const keys = Object.keys(args.query.filters);
      //   keys.map((key: string) => {
      //     if (key !== "priceRange") {
      //       query.$and.push({
      //         key: { $in: args.query.filters[key] },
      //       });
      //     } else {
      //       //TODO: dynamically build query based on filters.
      //       query.$and.push({});
      //     }
      //   });
      // }

      const listings = await this.db
        .collection(COLLECTIONS.LISTINGS)
        .find<any>(query) // Give this a proper type
        .toArray();

      return await this.mapToFullListing(listings);

    } catch (error) {
      throw error;
    }
  }

  private async mapToFullListing(listings: any[]) {
    for (let listing of listings) {
      if (listing.indexId) {
        let collection: string;
        switch (listing.details.category) {
          case "footwear":
            collection = "footwear-index";
            break;
          case "apparel":
            collection = "apparel-index";
            break;
          case "accessories":
            collection = "accessories-index";
            break;
        }
        const indexItem = await this.db
          .collection(collection)
          .findOne({ _id: new ObjectId(listing.indexId) });
        listing.indexItem = indexItem;
      }
    }
    return listings;
  }

  async searchItemIndex(args: {
    index: string;
    query: {
      text: string;
      brand: string[];
    };
  }) {
    try {
      //const itemIndex = new MongoItemIndex();

      console.log("here");
      const indexedItems = await this.searchIndex(args);
      console.log(indexedItems);
      return indexedItems;
    } catch (error) {
      throw error;
    }
  }

  private async searchIndex(args: {
    index: string;
    query: {
      text: string;
      brand: string[];
    };
  }) {
    try {
      let query: any = {
        $text: {
          $search: args.query.text || " ",
          $caseSensitive: false,
        },
      };

      if (args.query.brand) {
        query.$and = [];
        query.$and.push({
          brand: { $in: args.query.brand },
        });
      }
      console.log(this.db);
      const items = await this.db.collection(args.index).find(query).toArray();

      return items;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  findAsk(args: { orderId: string }): Promise<IBuyOrderDocument> {
    try {
      const objId = new ObjectId(args.orderId);

      return this.db
        .collection(COLLECTIONS.BUY_ORDERS)
        .findOne<IBuyOrderDocument>({ _id: objId });
    } catch (error) {
      throw error;
    }
  }

  updateBuyOrder(args: { orderId: string }): Promise<IListingDocumnet> {
    throw new Error("Method not implemented.");
  }

  async fetchListing(args: { listingId: string }): Promise<IListingDocumnet> {
    try {
      const listing = await this.db
        .collection(COLLECTIONS.LISTINGS)
        .find<IListingDocumnet>({ _id: new ObjectId(args.listingId)}).toArray();

        return await this.mapToFullListing(listing) as any;

    } catch (error) {
      throw error;
    }
  }

  updateListing(args: { listingId: string }): Promise<IListingDocumnet> {
    throw new Error("Method not implemented.");
  }

  async fetchOrderReceipts(args: { outletId: string }): Promise<IReciept[]> {
    try {
      return this.db
        .collection(COLLECTIONS.RECEIPTS)
        .find<IReciept>({ store: args.outletId })
        .toArray();
    } catch (error) {
      throw error;
    }
  }

  async deleteListing(args: {
    outletId: string;
    listingId: string;
  }): Promise<void> {
    try {
      this.db
        .collection(COLLECTIONS.LISTINGS)
        .findOneAndDelete({ storeId: args.outletId, _id: args.listingId });
    } catch (error) {
      throw error;
    }
  }

  async createUserCart(args: { username: string }) {
    try {
      await this.db
        .collection(COLLECTIONS.CARTS)
        .insertOne({ username: args.username, items: [] });
    } catch (error) {
      throw error;
    }
  }

  async findCart(args: { username: string }): Promise<ICartDocument> {
    try {
      const cart = await this.db
        .collection("carts")
        .findOne<ICartDocument>({ username: args.username });
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async addToCart(args: { requester: string; item: CartItem }): Promise<void> {
    try {
      await this.db.collection("carts").updateOne(
        { username: args.requester },
        {
          $push: {
            items: args.item,
          },
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async updateCartItem(args: {
    requester: string;
    listingId: string;
    updates: { [x: string]: string };
  }): Promise<import("../../shared/interfaces").ICart> {
    try {
      const keys = Object.keys(args.updates);

      keys.map(async (key) => {
        await this.db
          .collection(COLLECTIONS.CARTS)
          .updateOne(
            { items: { itemId: args.listingId }, username: args.requester },
            { $set: { key: args.updates[key] } }
          );
      });

      const updatedCart = await this.findCart({ username: args.requester });

      return updatedCart;
    } catch (error) {
      throw error;
    }
  }

  async deleteCartItem(args: {
    requester: string;
    listingId: string;
  }): Promise<ICart> {
    try {
      await this.db
        .collection("carts")
        .updateOne(
          { username: args.requester },
          { $pull: { items: { id: args.listingId } } }
        );
      const carts = await this.db
        .collection("carts")
        .findOne<ICart>({ username: args.requester });
      //TODO: add step to check if the item was actually deleted from the items Array/
      return carts;
    } catch (error) {
      throw error;
    }
  }

  async clearCart(args: { requester: string }): Promise<void> {
    try {
      await this.db
        .collection("carts")
        .updateOne({ username: args.requester }, { $set: { items: [] } });
    } catch (error) {
      throw error;
    }
  }

  //LOG EVENTS START HERE
  async insertEventLog(args: { orderId: string }) {
    try {
      await this.db
        .collection(COLLECTIONS.EVENT_LOGS)
        .insertOne({ orderId: args.orderId, sessions: [] });
    } catch (error) {
      throw error;
    }
  }

  async addUserAction(args: { action: Action; orderId: string }) {
    try {
      await this.db
        .collection(COLLECTIONS.SESSIONS)
        .updateOne({ orderId: args.orderId }, { $push: { logs: args.action } });
    } catch (error) {
      throw error;
    }
  }

  async findEventsbyUser(args: { orderId: string; userId: string }) {
    try {
    } catch (error) {
      throw error;
    }
  }

  async findAllOrderActors() {
    try {
    } catch (error) {
      throw error;
    }
  }

  private mapUserToSummary(user: IUser) {
    return {
      username: user.username,
      name: user.name,
      email: user.email,
    };
  }

  static getInstance() {
    if (!MongoDriver.instance) {
      MongoDriver.instance = new MongoDriver();
    }
    return MongoDriver.instance;
  }
}
