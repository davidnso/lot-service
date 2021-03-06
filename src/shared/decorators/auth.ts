import * as jwt from "jsonwebtoken";
import { Request, NextFunction, Response } from "express";
import { User } from "../entity/user";
import { IUser } from "../interfaces";
require("dotenv").config();

export function authorizeUser({
  req,
  res,
  next
}: {
  req: Request;
  res: Response;
  next: NextFunction;
}) {
  try {
    let token: string = req.headers["authorization"]; // Express headers are auto converted to lowercase
    if (token.startsWith("bearer ")) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }

    if(token){
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded: IUser) => {
            if (err) {
              return res.json({
                success: false,
                message: "Token is not valid"
              });
            } else {
              console.log(decoded);
              next();
            }
          });
    }else{
        return res.json({
            success: false,
            message: 'Auth token is not supplied'
          });
    }
    
  } catch (error) {
      throw error;
  }
}
