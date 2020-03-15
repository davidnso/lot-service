import { Address, RegistrationInformation } from "../types";

/**
 * User Interface and types
 */
export interface IUser{
  name: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  addresses: Address[];
}

export interface IUserDocument extends IUser{
    _id: string
}


export interface IOutlet{ 
    name: string,
    bannerImg: string,
    addresses: Address[],
    owner: string,
    dateCreated: string
    tier: string
}

export interface IOutletDocument extends IOutlet{
    _id:string
}


/**
 * Listing document interface..
 */
export interface IListing{ 
    name:string,
    description: string | undefined,
    price: string,
    brand: string,
    details: {
        category: string,
        gender: string,
        subCategory: string,
        class: string,
        stock: [
            {
                size: string,
                quantity: string,
                color: string,
                condition: string
            }
        ]
    },
    images: string[],
    storeId: string,
    status: string,
    tags: string,
    date: string
}

export interface IListingDocumnet extends IListing{
    _id: string
}

export interface IBuyOrder{ 
    details: { 
        size: string,
        color: string,
        condition: string,
        originalPackaging: false,
    };
    indexId: string;
    username: string;
    phoneNumber:string;
    email: string;
    price: string;
    date: string;
    status: string
}

export interface IBuyOrderDocument extends IListing{
    _id: string
}

export interface IMetrics { 
    storeId: string,
    annualSales:string,
    month: {
        jan:string,
        feb:string,
        mar:string,
        apr:string,
        may:string,
        june:string,
        july:string,
        aug:string,
        sept:string,
        oct:string,
        nov:string,
        dec:string,
    }
}

export interface IMetricsDocument extends IMetrics{
    _id: string;
}

export interface ICart {
    userId: string,
    items: CartItem[]
}

export interface ICartDocument extends IMetrics{
    _id: string;
}

export type CartItem = { 
    itemId: string,
    link: string,
    quantity: string,
    color: string
}

//Create requests 

//Create feedback 

export interface IReciept {
    purchaseDate: string,
    manifest: {
        itemId: string,
        quantity: string, 
        price: string,
        color: string
    },
    buyerInfo: {
        username: string
    }
    //There'll definitely need to be paypal info in here. 
}