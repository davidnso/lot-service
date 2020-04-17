import { IUserComponent } from "./interfaces/IUserComponent";
import { IUser, Action } from "../../shared/interfaces";
import { MongoDriver } from "../../drivers/mongo/mongoDriver";
import { User } from "../../shared/entity/user";
import { RegistrationInformation } from "../../shared/types";
import * as jwt from "jsonwebtoken";
// import { authorizeUser } from "../../shared/decorators/auth";
const bcrypt = require("bcrypt");

function authorizeUser(
  target: any,
  key: string,
  descriptor: PropertyDescriptor
): any {
  try {
    const userInfo = jwt.verify("", process.env.SECRET_KEY);
    console.log(userInfo);
    if (userInfo) {
      return true;
    }
  } catch (error) {}
}
export class UserComponent implements IUserComponent {
  static instance: UserComponent;

  static getInstance() {
    if (!this.instance) {
      UserComponent.instance = new UserComponent();
    }
    return UserComponent.instance;
  }

  deleteUser(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async login(args: {
    username: string;
    password: string;
  }): Promise<{ user: IUser; bearer: any }> {
    if (args.username && args.password) {
      const user = await MongoDriver.getInstance().findUser({
        id: "",
        identifier: args.username,
      });
      console.log("Login user: ", user);
      const match = await bcrypt.compare(args.password, user.password);
      console.log(match);
      if (match) {
        const bearer = jwt.sign(user, process.env.SECRET_KEY, {
          expiresIn: 86400,
        });
        console.log(bearer);
        delete user.password;
        return { user: user, bearer };
      } else {
        throw new Error("Login Failed");
      }
    }

    throw new Error("Method not implemented.");
  }

  async createUserAccount(
    args: RegistrationInformation
  ): Promise<{ user: IUser; bearer: any }> {
    let user: User;
    const saltRounds = 10;
    const hashedPass = await bcrypt.hash(args.password, saltRounds);
    try {
      args.password = hashedPass;
      if (args) {
        const foundUser: User = await MongoDriver.getInstance().findUser({
          identifier: args.username,
          id: "",
        });
        console.log();
        if (!foundUser) {
          try {
            user = new User(args);
            await MongoDriver.getInstance().createUser({ user });
            const registeredUser = await MongoDriver.getInstance().findUser({
              identifier: args.username,
              id: "",
            });
            delete registeredUser.password;
            console.log("Registered user: ", registeredUser);
            const bearer = jwt.sign(registeredUser, "secretKey", {
              expiresIn: 86400,
            });
            return { user: registeredUser, bearer };
          } catch (err) {
            throw err;
          }
        } else {
          throw new Error(`User with username ${args.username} was found`);
        }
      }
    } catch (err) {
      throw err;
    }
  }

  updateUser(): Promise<{ user: IUser }> {
    throw new Error("Method not implemented.");
  }

  async updateEventLog(args: { orderId: string; action: Action }) {
    try {
      await MongoDriver.getInstance().addUserAction(args);
    } catch (error) {
      throw error;
    }
  }

  async fetchActionsByUser(args: { userId: string; orderId: string }) {
    try {
      await MongoDriver.getInstance().findEventsbyUser({
        userId: args.userId,
        orderId: args.orderId,
      });
    } catch (error) {
      throw error;
    }
  }

  async fetchAllActors(){
    try {
      
    } catch (error) {
      throw error;
    }
  }
}
