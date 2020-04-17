import { User } from "../../shared/entity/user";
import { IUser, IUserDocument, IOutlet, IOutletDocument, IBuyOrder, IBuyOrderDocument, IListingDocumnet, ICart, ICartDocument, CartItem, IReciept, IListing } from "../../shared/interfaces";
import { searchQueryParams } from "../../shared/types";

export interface IMongoDriver {

    // User related 

    createUser(args: {
        user: IUser
    }): Promise<void>;

    findUser(args:{
        identifier: string
    }): Promise<IUserDocument>

    updateUserInformation(args: {
        username: string
        updates: {[x:string]: string}
    }): Promise<IUserDocument>

    deleteUserAccount(args: {
        username: string
    }): Promise<void>

    // Outlet related
    createOutlet(args: {
        outletInformation: IOutlet
    }): Promise<string>

    createListing(args: {
        orderInfo: IListing
    }): Promise<void>

    createAsk(args: {
        orderInfo: IBuyOrder
    }): Promise<string>

    searchBuyOrder( args: { 
        query: searchQueryParams,
        outlet: string,
        index: string
        }): Promise<IBuyOrderDocument[]>

    findAllUserBuyOrders(args: { 
        username: string
    })
    searchListings( args: { 
        query: searchQueryParams,
        outlet: string,
    }): Promise<IListingDocumnet[]>

    findAsk(args: {
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
        username: string
    }): Promise<ICartDocument>; 

    addToCart(args: {
        requester: string,
        item: CartItem
    }): Promise<void>;

    updateCartItem(
        args: { 
            requester: string
            listingId: string
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

    fetchOutlet(args: {
        outletId: string,
    }): Promise<IOutletDocument>
}