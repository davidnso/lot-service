import { IOutletComponent } from "./interfaces/IOutletComponent";

export class OutletComponent implements IOutletComponent {
  async createOutlet(args: {
    name: string;
    bannerImgUrl: string;
    address: import("../../shared/types").Address[];
    tier: string;
    requester: string;
  }): Promise<import("../../shared/interfaces").IOutlet> {
    throw new Error("Method not implemented.");
  }
  async createListing(
    args: Partial<import("../../shared/interfaces").IListing>
  ): Promise<import("../../shared/interfaces").IListing> {
    throw new Error("Method not implemented.");
  }
  async createBuyOrder(args: {
    details: {
      size: string;
      color: string;
      condition: string;
      originalPackaging: false;
    };
    username: string;
    price: string;
  }): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async searchBuyOrders(args: {
    text: string;
    filters?: {
      gender?: string[];
      kids?: string[];
      priceRange?: { from: string; to: string };
      color: string[];
      size: string[];
    };
    limit: string;
    sortby?: { date?: number; price?: number; name?: number };
  }): Promise<import("../../shared/interfaces").IListing[]> {
    throw new Error("Method not implemented.");
  }
  async searchListings(args: {
    text: string;
    filters?: {
      gender?: string[];
      kids?: string[];
      priceRange?: { from: string; to: string };
      color: string[];
      size: string[];
    };
    limit: string;
    sortby?: { date?: number; price?: number; name?: number };
  }): Promise<import("../../shared/interfaces").IListing[]> {
    throw new Error("Method not implemented.");
  }
  async fetchBuyOrder(args: {
    orderId: string;
    requester: string;
  }): Promise<import("../../shared/interfaces").IBuyOrder> {
    throw new Error("Method not implemented.");
  }
  async fetchListing(args: {
    listingId: string;
  }): Promise<import("../../shared/interfaces").IBuyOrder> {
    throw new Error("Method not implemented.");
  }
  async updateListing(args: {
    updates: Partial<import("../../shared/interfaces").IListing>;
    requester: string;
  }): Promise<import("../../shared/interfaces").IListing> {
    throw new Error("Method not implemented.");
  }
  async fetchOrders(args: {
    requester: string;
  }): Promise<import("../../shared/interfaces").IReciept> {
    throw new Error("Method not implemented.");
  }
  async deleteListing(args: { listingId: string }): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
