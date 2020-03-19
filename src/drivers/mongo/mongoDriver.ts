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
  IReciept
} from "../../shared/interfaces";

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
  RECEIPTS: 'reciepts'
};

export class MongoDriver implements IMongoDriver {
  db: Db | undefined;
  private static instance: MongoDriver;
  constructor() {
    MongoDataStoreBuilder.buildDriver(process.env.DB_URI as string).then(
      dataStore => {
        this.db = dataStore;
      }
    );
  }

  async createUser(args: { user: IUser }): Promise<void> {
    try {
      await this.db.collection(COLLECTIONS.USERS).insertOne(args.user);
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
  }): Promise<void> {
    try {
      await this.db
        ?.collection(COLLECTIONS.OUTLET)
        .insertOne(args.outletInformation);

      // console.log(this.db)
    } catch (err) {
      throw new Error(err);
    }
  }

  async createBuyOrder(args: {
    orderInfo: import("../../shared/interfaces").IBuyOrder;
  }): Promise<void> {
    try {
      await this.db?.collection(COLLECTIONS.OUTLET).insertOne(args.orderInfo);

      // console.log(this.db)
    } catch (err) {
      throw new Error(err);
    }
  }

  searchBuyOrder(args: {
    text: string;
    username: string;
    filters?: {
      gender?: string[];
      kids?: string[];
      priceRange?: { from: string; to: string };
      color: string[];
      size: string[];
    };
    limit: string;
    sortby?: { date?: number; price?: number; name?: number };
  }): Promise<import("../../shared/interfaces").IBuyOrderDocument[]> {
    throw new Error("Method not implemented.");
  }

  searchListings(args: {
    text: string;
    outlet?: string;
    filters?: {
      gender?: string[];
      kids?: string[];
      priceRange?: { from: string; to: string };
      color: string[];
      size: string[];
    };
    limit: string;
    sortby?: { date?: number; price?: number; name?: number };
  }): Promise<import("../../shared/interfaces").IListingDocumnet[]> {
    throw new Error("Method not implemented.");
  }

  fetchBuyOrder(args: { orderId: string }): Promise<IBuyOrderDocument> {
    try {
      return this.db
        .collection(COLLECTIONS.BUY_ORDERS)
        .findOne<IBuyOrderDocument>({ _id: args.orderId });
    } catch (error) {
      throw error;
    }
  }

  updateBuyOrder(args: { orderId: string }): Promise<IListingDocumnet> {
    throw new Error("Method not implemented.");
  }

  async fetchListing(args: { listingId: string }): Promise<IListingDocumnet> {
    try {
      return this.db
        .collection(COLLECTIONS.LISTINGS)
        .findOne<IListingDocumnet>({ _id: args.listingId });
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
        .find<IReciept>({ store: args.outletId }).toArray();
    } catch (error) {
      throw error;
    }
  }

  async deleteListing(args: { outletId: string; listingId: string }): Promise<void> {
    try {
       this.db
        .collection(COLLECTIONS.LISTINGS)
        .findOneAndDelete({ storeId: args.outletId, _id: args.listingId });
    } catch (error) {
      throw error;
    }
  }

  async findCart(args: { requester: string }): Promise<ICartDocument> {
    try {
      const cart = await this.db
        .collection("carts")
        .findOne<ICartDocument>({ username: args.requester });
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
            items: args.item
          }
        }
      );
    } catch (error) {
      throw error;
    }
  }

  updateCartItem(args: {
    requester: string;
    updates: { [x: string]: string };
  }): Promise<import("../../shared/interfaces").ICart> {
    throw new Error("Method not implemented.");
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

  static getInstance() {
    if (!this.instance) {
      MongoDriver.instance = new MongoDriver();
    }
    return MongoDriver.instance;
  }
}
