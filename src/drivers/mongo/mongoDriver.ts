import { MongoDataStoreBuilder } from "./mongoDataStoreBuilder";
import { Db, ObjectId } from "mongodb";
import { IMongoDriver } from "../interfaces/IMongoDriver";
import { IUser, IUserDocument } from "../../shared/interfaces";

require("dotenv").config();

// const DB_URI = process.env.DB_URI?.replace(
//     /<password>/g,
//     process.env.DB_PASSWORD as string );

const COLLECTIONS = {
  USERS: "users",
  OUTLET: "outlets",
  CARTS: "carts",
  LISTINGS: "listings",
  BUY_ORDERS: "posts"
};

export class MongoDriver implements IMongoDriver {
  db: Db | undefined;
  private static instance: MongoDriver;
  constructor() {
    MongoDataStoreBuilder.buildDriver({} as string).then(dataStore => {
      this.db = dataStore;
    });
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
      
      await this.db
        ?.collection(COLLECTIONS.OUTLET)
        .insertOne(args.orderInfo);

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
  fetchBuyOrder(args: {
    orderId: string;
  }): Promise<import("../../shared/interfaces").IBuyOrderDocument> {
    throw new Error("Method not implemented.");
  }
  updateBuyOrder(args: {
    orderId: string;
  }): Promise<import("../../shared/interfaces").IListingDocumnet> {
    throw new Error("Method not implemented.");
  }
  fetchListing(args: {
    listingId: string;
  }): Promise<import("../../shared/interfaces").IListingDocumnet> {
    throw new Error("Method not implemented.");
  }
  updateListing(args: {
    listingId: string;
  }): Promise<import("../../shared/interfaces").IListingDocumnet> {
    throw new Error("Method not implemented.");
  }
  fetchOrderReceipts(args: { outletId: string }): Promise<void> {
    throw new Error("Method not implemented.");
  }
  deleteListing(args: { outletId: string }): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findCart(args: {
    username: string;
  }): Promise<import("../../shared/interfaces").ICartDocument> {
    throw new Error("Method not implemented.");
  }
  addToCart(args: {
    requester: string;
    item: import("../../shared/interfaces").CartItem;
  }): Promise<import("../../shared/interfaces").CartItem> {
    throw new Error("Method not implemented.");
  }
  updateCartItem(args: {
    updates: { [x: string]: string };
  }): Promise<import("../../shared/interfaces").ICart> {
    throw new Error("Method not implemented.");
  }
  deleteCartItem(args: {
    listingId: string;
  }): Promise<import("../../shared/interfaces").ICart> {
    throw new Error("Method not implemented.");
  }
  clearCart({
    args: { username: string }
  }: {
    args: { username: any };
  }): Promise<void> {
    throw new Error("Method not implemented.");
  }

  static getInstance() {
    if (!this.instance) {
      MongoDriver.instance = new MongoDriver();
    }
    return MongoDriver.instance;
  }
}
