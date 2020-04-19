import { IOutletComponent } from "./interfaces/IOutletComponent";
import {
  IListing,
  IBuyOrder,
  IReciept,
  IOutlet
} from "../../shared/interfaces";
import { MongoDriver } from "../../drivers/mongo/mongoDriver";
import { searchQueryParams } from "../../shared/types";
import { BuyOrder } from "../../shared/entity/buyOrder";
import { Listing } from "../../shared/entity/listing";
import { Outlet } from "../../shared/entity/outlet";

export class OutletComponent implements IOutletComponent {
  static instance: OutletComponent;

  static getInstance() {
    if (!this.instance) {
      OutletComponent.instance = new OutletComponent();
    }
    return OutletComponent.instance;
  }

  async createOutlet(args: {
    name: string;
    bannerImgUrl: string;
    addresses: import("../../shared/types").Address[];
    tier: string;
    requester: string;
  }): Promise<IOutlet> {
    try {
      const info = {
        name: args.name || " ",
        bannerImgUrl: args.bannerImgUrl,
        addresses: args.addresses,
        tier: args.tier,
        owner: args.requester,
        dateCreated: Date.now().toString()
      };

      //TODO: perform validation at this level...
      const outlet = new Outlet(info);

      const outletId = await MongoDriver.getInstance().createOutlet({
        outletInformation: outlet
      });

      const existingOutlet = await MongoDriver.getInstance().fetchOutlet({
        outletId
      });

      if (existingOutlet !== null) {
        MongoDriver.getInstance().updateUserInformation({
          username: args.requester,
          updates: { role: "owner" }
        });
      }

      console.log("created");
      //TODO: Add validation step after creation to verify that the store has been created for the user...
      return existingOutlet;
      //await MongoDriver.getInstance().fetchOutletById(storeId);
    } catch (error) {
      throw error;
    }
  }

  async fetchOutlet(args: {
    outletId: string;
    requester: string;
  }): Promise<{ outlet: IOutlet; listings: IListing[] }> {
    try {
      const outlet = await MongoDriver.getInstance().fetchOutletById(
        args.outletId
      );
      const listings = await MongoDriver.getInstance().fetchAllListingsByOutletId(
        { outletId: args.outletId }
      );

      return { outlet, listings };
    } catch (error) {
      throw error;
    }
  }

  async fetchAllUserOutlets(args: {
    requester: string;
    id: string;
  }): Promise<IOutlet[]> {
    try {
      return await MongoDriver.getInstance().fetchOutletByOwner({
        owner: args.id
      });
    } catch (error) {
      throw error;
    }
  }

  async createListing(args: {
    listingInfo: Partial<IListing>;
    requester: string;
  }): Promise<void> {
    try {
      const listing = new Listing(args.listingInfo);

      await MongoDriver.getInstance().createListing({ orderInfo: listing });
    } catch (error) {
      throw error;
    }
  }
  
  async searchListings(args: {
    query: searchQueryParams;
    outlet?: string;
  }): Promise<IListing[]> {
    try {
      if (args.query) {
        console.log(args.query)
        const searchResult = await MongoDriver.getInstance().searchListings({
          query: args.query,
          outlet: args.outlet
        });
        return searchResult;
      }
    } catch (error) {
      throw error;
    }
  }

  async fetchListing(args: { listingId: string }): Promise<IListing> {
    try {
      return await MongoDriver.getInstance().fetchListing({
        listingId: args.listingId
      });
    } catch (error) {
      throw error;
    }
  }
  async updateListing(args: {
    updates: Partial<IListing>;
    requester: string;
  }): Promise<IListing> {
    throw new Error("Method not implemented.");
  }
  async fetchOrders(args: {
    requester: string;
    outletId: string;
  }): Promise<IReciept[]> {
    try {
      return await MongoDriver.getInstance().fetchOrderReceipts({
        outletId: args.outletId
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteListing(args: {
    listingId: string;
    outletId: string;
  }): Promise<void> {
    try {
      await MongoDriver.getInstance().deleteListing({
        listingId: args.listingId,
        outletId: args.outletId
      });
    } catch (error) {
      throw error;
    }
  }
}
