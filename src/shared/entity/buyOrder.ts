import { IOutlet, IBuyOrder } from "../interfaces";
import { StoreRegistrationInfo } from "../types";
import { validateEntity } from "../functions";


export class BuyOrder implements IBuyOrder{
    details: { size: string; color: string; condition: string; originalPackaging: false; };
    indexId: string;
    username: string;
    phoneNumber: string;
    email: string;
    price: string;
    date: string;
    status: string;
    
 
    constructor(info: IBuyOrder){
        const isValid = validateEntity(info);
        if(isValid){
            this.details= info.details;
            this.indexId = info.indexId;
            this.username = info.username;
            this.phoneNumber = info.email;
            this.email = info.email;
            this.price = info.date;
            this.status = info.status;

        }
    }
}