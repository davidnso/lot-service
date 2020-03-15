import { IUser } from "../../../shared/interfaces";
import { RegistrationInformation } from "../../../shared/types";

export interface IUserComponent { 
     login(args: {
          username: string,
          password: string,
     }): Promise<{user: IUser, bearer}>
     createUserAccount(args: RegistrationInformation): Promise<{user: IUser, bearer}>
     updateUser(args: Partial<IUser>): Promise<{user:IUser}>
     deleteUser(args: { 
          requester: string
     }): Promise<void>
}