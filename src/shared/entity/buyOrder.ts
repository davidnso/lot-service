import { IOutlet, IBuyOrder } from "../interfaces";
import { StoreRegistrationInfo } from "../types";
import { validateEntity } from "../functions";


export class BuyOrder implements IBuyOrder{
    details: { name?: string,
        imageUrl?: string,
        description?: string , size: string; color: string; condition: string; originalPackaging: boolean; };
    indexId: string;
    username: string;
    phoneNumber: string;
    email: string;
    price: string;
    date: string;
    status: string;
    
 
    constructor(info: IBuyOrder){
            this.details= info.details;
            this.indexId = info.indexId;
            this.username = info.username;
            this.phoneNumber = info.email;
            this.email = info.email;
            this.price = info.price;
            this.date = Date.now().toString();
            this.status = 'active';

        
    }
}