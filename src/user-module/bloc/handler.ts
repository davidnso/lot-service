import { IUserComponent } from "./interfaces/IUserComponent";
import { IUser } from "../../shared/interfaces";

export class UserComponent implements IUserComponent{
    deleteUser(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    login(): Promise<{ user: IUser; bearer: any; }> {
        throw new Error("Method not implemented.");
    }    
    createUserAccount(): Promise<{ user: IUser; bearer: any; }> {
        throw new Error("Method not implemented.");
    }
    updateUser(): Promise<{ user: IUser; }> {
        throw new Error("Method not implemented.");
    }


}