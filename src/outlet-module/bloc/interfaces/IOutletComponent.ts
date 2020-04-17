import {
  IOutlet,
  IListing,
  IBuyOrder,
  IReciept,
  IBuyOrderDocument
} from "../../../shared/interfaces";
import { Address, searchQueryParams } from "../../../shared/types";
import { Reciept } from "../../../shared/entity/receipt";

export interface IOutletComponent {
  
  /**
   * Create a new store
   * @param args
   */
  createOutlet(args: {
    name: string;
    bannerImgUrl: string;
    addresses: Address[];
    tier: string;
    requester: string;
  }): Promise<IOutlet>;

  /**
   * Create a new listing
   * @param args
   */
  createListing(args: {
    listingInfo: Partial<IListing>;
    requester: string;
  }): Promise<void>;

  /**
   *  Search through listings on the platform.
   * @param args
   */
  searchListings(args: {
    query: searchQueryParams;
    outlet?: string;
  }): Promise<IListing[]>;


  /**
   * fetch a specific listing
   * @param args
   */
  fetchListing(args: { listingId: string }): Promise<IListing>;

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
  fetchOrders(args: { requester: string }): Promise<IReciept[]>;

  /**
   * Delete a specific listing
   * @param args
   */
  deleteListing(args: { listingId: string }): Promise<void>;
}
