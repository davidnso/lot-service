import { IOutlet, IListing } from "../interfaces";
import { StoreRegistrationInfo } from "../types";
import { validateEntity } from "../functions";


export class Listing implements IListing{
    description: string;
    price: string;
    brand: string;
    details: { category: string; gender: string; subCategory: string; class: string; stock: [{ size: string; quantity: string; color: string; condition: string; }]; };
    images: string[];
    indexId;
    storeId: string;
    status: string;
    tags: string;
    date: string;
    name: string
    constructor(info: Partial<IListing>){
        // const isValid = validateEntity(info);
            this.name= info.name;
            this.description = info.description;
            this.price = info.price;
            this.brand = info.brand;
            this.details = info.details;
            this.images = info.images;
            this.indexId = info.indexId;
            this.storeId = info.storeId;
            this.status = 'Active';
            this.tags = info.tags;

        
    }
}