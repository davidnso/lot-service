import { Router, NextFunction, Response, Request } from "express";
import { UserComponent } from "../bloc/handler";
import { User } from "../../shared/entity/user";
import { RegistrationInformation } from "../../shared/types";


export class UserModuleRouteHandler {
    public static buildRouter() {
      const router = Router();
      new UserComponent();

      router.post("/users/create_account", createNewUser);
      router.post("/users/auth/lot", login);
      router.post("/users/add_info", addInformation);
      router.post("/users/auth/google", loginWithGoogle);
      router.delete('/users/:requester', deleteUser);
      router.put('/users/:requester', updateUserAccount);
  
      return router;
    }
  }
  
  async function login(req: Request, res: Response, next: NextFunction) {
    /**
     * authentication logic for login here.
     */
    const login: {
      username: string;
      password: string;
    } = req.body.loginInfo;
  
    try {
        // Call function to login the user and verify credentials
        const loginResponse = await UserComponent.getInstance().login({
          username: login.username,
          password: login.password
        })

        res.send(loginResponse);
    } catch (err) {
      res.sendStatus(400);
    }
  }

  async function createNewUser(req: Request, res: Response, next: NextFunction) {
    try {
     const userAccountInfo: RegistrationInformation = req.body.registrationInfo;
    const userInfo = await UserComponent.getInstance().createUserAccount(
      userAccountInfo
    );
    res.json(userInfo);
    } catch (err) {
      res.json({ Error: err.message });
    }
  }

  async function addInformation(req: Request, res: Response, next: NextFunction){
    try {
        // Call function to create new user
        // res.json(userInfo);
       } catch (err) {
         res.json({ Error: err.message });
       }
  }

  async function loginWithGoogle(req: Request, res: Response, next: NextFunction){
    try {
        // Call function to create new user
        // res.json(userInfo);
       } catch (err) {
         res.json({ Error: err.message });
       }
  }
  async function deleteUser(req: Request, res: Response, next: NextFunction){
    try {
        // Call function to create new user
        // res.json(userInfo);
       } catch (err) {
         res.json({ Error: err.message });
       }
  }
  async function updateUserAccount(req: Request, res: Response, next: NextFunction){
    try {
        // Call function to create new user
        // res.json(userInfo);
       } catch (err) {
         res.json({ Error: err.message });
       }
  }
  