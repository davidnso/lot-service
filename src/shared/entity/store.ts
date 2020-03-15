import { IOutlet } from "../interfaces";
import { StoreRegistrationInfo } from "../types";
import { validateEntity } from "../functions";


export class Store implements IOutlet{
    name: string;
    bannerImg: string;
    addresses: import("../types").Address[];
    owner: string;
    dateCreated: string;
    tier: string;
 
    constructor(info: StoreRegistrationInfo){
        const isValid = validateEntity(info);
        if(isValid){
            this.name= info.name;
            this.bannerImg = info.bannerImgUrl;
            this.addresses = info.addresses;
            this.owner = info.owner;
            this.tier = info.tier;
            this.dateCreated = info.dateCreated

        }
    }
}