import { IUserComponent } from "./interfaces/IUserComponent";
import { IUser } from "../../shared/interfaces";
import {MongoDriver } from '../../drivers/mongo/mongoDriver';

export class UserComponent implements IUserComponent{
    deleteUser(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    login(args: {
        username: string,
        password: string,
   }): Promise<{ user: IUser; bearer: any; }> {
    throw new Error("Method not implemented.");

    }    
    createUserAccount(): Promise<{ user: IUser; bearer: any; }> {
        throw new Error("Method not implemented.");
    }
    updateUser(): Promise<{ user: IUser; }> {
        throw new Error("Method not implemented.");
    }


}