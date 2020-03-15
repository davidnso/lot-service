import { IOutlet, IListing, IBuyOrder, IReciept } from "../../../shared/interfaces";
import { Address } from "../../../shared/types";
import { Reciept } from "../../../shared/entity/receipt";

export interface IOutletComponent {
  /**
   * Create a new store
   * @param args
   */
  createOutlet(args: {
    name: string;
    bannerImgUrl: string;
    address: Address[];
    tier: string;
    requester: string;
  }): Promise<IOutlet>;

  /**
   * Create a new listing
   * @param args
   */
  createListing(args: Partial<IListing>): Promise<IListing>;

  /**
   * Create a new Buy order
   * @param args
   */
  createBuyOrder(args: {
    details: {
      size: string;
      color: string;
      condition: string;
      originalPackaging: false;
    };
    username: string;
    price: string;
  }): Promise<void>;

  /**
   * Search through buy orders on the platform.
   * @param args
   */
  searchBuyOrders(args: {
    text: string;
    filters?: {
      gender?: string[];
      kids?: string[];
      priceRange?: {
        from: string;
        to: string;
      };
      color: string[];
      size: string[];
    };
    limit: string;
    sortby?: {
      date?: number;
      price?: number;
      name?: number;
    };
  }): Promise<IListing[]>;

  /**
   *  Search through listings on the platform.
   * @param args
   */
  searchListings(args: {
    text: string;
    filters?: {
      gender?: string[];
      kids?: string[];
      priceRange?: {
        from: string;
        to: string;
      };
      color: string[];
      size: string[];
    };
    limit: string;
    sortby?: {
      date?: number;
      price?: number;
      name?: number;
    };
  }): Promise<IListing[]>;

  /**
   * fetch a specific buy order
   * @param args
   */
  fetchBuyOrder(args: {
    orderId: string;
    requester: string;
  }): Promise<IBuyOrder>;

  /**
   * fetch a specific listing
   * @param args
   */
  fetchListing(args: { listingId: string }): Promise<IBuyOrder>;

  /**
   * update a specific listing
   * @param args
   */
  updateListing(args: {
    updates: Partial<IListing>;
    requester: string;
  }): Promise<IListing>;


/**
 *  fetch orders
 * @param args 
 */
  fetchOrders(args: { 
      requester:string
  }): Promise<IReciept>

  /**
   * Delete a specific listing
   * @param args
   */
  deleteListing(args: { listingId: string }): Promise<void>;
}
