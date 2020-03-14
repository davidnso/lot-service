import { IUser } from "../interfaces";
import { Address, RegistrationInformation } from "../types";
import {validateEntity} from '../functions/index'
export class User implements IUser{
    name: string;    
    username: string;
    email: string;
    password: string;
    phoneNumber: string;
    addresses: Address[];

    constructor(info: RegistrationInformation) {
        const isValid = validateEntity(info);
        if (isValid) {
          this.name = info.name;
          this.username = info.username;
          this.email = info.email;
          this.password = info.password;
          this.addresses = info.addresses;
          this.phoneNumber = info.phoneNumber;
        }
      }
    
     
    }