import { IUser } from "../../../shared/interfaces";

export interface IUserComponent { 
     login(): Promise<{user: IUser, bearer}>
     createUserAccount(): Promise<{user: IUser, bearer}>
     updateUser(): Promise<{user:IUser}>
     deleteUser(): Promise<void>
}