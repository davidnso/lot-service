import { User } from "../../shared/entity/user";
import { IUser, IUserDocument, IOutlet, IOutletDocument, IBuyOrder, IBuyOrderDocument, IListingDocumnet, ICart, ICartDocument, CartItem, IReciept } from "../../shared/interfaces";

export interface IMongoDriver {

    // User related 

    createUser(args: {
        user: IUser
    }): Promise<void>;

    findUser(args:{
        identifier: string
    }): Promise<IUserDocument>

    updateUserInformation(args: {
        id: string
        updates: string
    }): Promise<IUserDocument>

    deleteUserAccount(args: {
        username: string
    }): Promise<void>

    // Outlet related
    createOutlet(args: {
        outletInformation: IOutlet
    }): Promise<void>

    createBuyOrder(args: {
        orderInfo: IBuyOrder
    }): Promise<void>

    searchBuyOrder( args: { 
        text: string;
        username: string
        filters?: {
          gender?: string[];
          kids?: string[];
          priceRange?: { from: string; to: string };
          color: string[];
          size: string[];
        };
        limit: string;
        sortby?: { date?: number; price?: number; name?: number };
        }): Promise<IBuyOrderDocument[]>

    searchListings( args: { 
        text: string;
        outlet?:string
        filters?: {
          gender?: string[];
          kids?: string[];
          priceRange?: { from: string; to: string };
          color: string[];
          size: string[];
        };
        limit: string;
        sortby?: { date?: number; price?: number; name?: number }; 
    }): Promise<IListingDocumnet[]>

    fetchBuyOrder(args: {
        orderId: string;
    }): Promise<IBuyOrderDocument>

    updateBuyOrder(args: {
        orderId: string;
    }): Promise<IListingDocumnet>

    fetchListing(args: {
        listingId: string;
    }): Promise<IListingDocumnet>

    updateListing(args: {
        listingId: string;
    }): Promise<IListingDocumnet>

    fetchOrderReceipts(args:{
        outletId: string
    }):Promise<IReciept[]>;

    deleteListing(args:{
        outletId:string,
        listingId: string
    }):Promise<void>

    //cart related

    findCart(args: { 
        requester: string
    }): Promise<ICartDocument>; 

    addToCart(args: {
        requester: string,
        item: CartItem
    }): Promise<void>;

    updateCartItem(
        args: { 
            requester: string
            updates:{ [x:string]: string}
        }
    ): Promise<ICart>

    deleteCartItem(
        args: {
            requester:string
            listingId: string
        }
    ): Promise< ICart> 

    clearCart(
        args: {
            requester: string
        }
    ): Promise<void>
}