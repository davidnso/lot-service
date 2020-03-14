import { IStore, IReciept } from "../interfaces";
import { StoreRegistrationInfo } from "../types";
import { validateEntity } from "../functions";


export class Reciept implements IReciept{
    purchaseDate: string;
    manifest: { itemId: string; quantity: string; price: string; color: string; };
    buyerInfo: { username: string; };

 
    constructor(info: IReciept){
        const isValid = validateEntity(info);
        if(isValid){
            // TODO: VALIDATE FIELDS

        }
    }
}