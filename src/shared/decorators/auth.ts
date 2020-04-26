import * as jwt from "jsonwebtoken";
import { Request, NextFunction, Response } from "express";
import { User } from "../entity/user";
import { IUser } from "../interfaces";
require("dotenv").config();

// Returns Bearer token from authorization header.
export function getBearerToken(authHeader: string): string {
  const [type, tokenVal] = authHeader ? authHeader.split(' ') : [null, null];
  if ( type === 'Bearer' && tokenVal && tokenVal !== 'null' && tokenVal !== 'undefined') {
    return tokenVal;
  }
  return null;
}

// Returns string token from cookie or header
  export function getToken(req: Request): string {
    if (req.cookies && req.cookies.presence) {
      return req.cookies.presence;
    }
    return getBearerToken(req.headers.authorization);
  }

  /**
 * Checks if decoded token is set in request.
 * If user is not set, the token is verified from cookie presence or Bearer token
 * If no user and no valid token, responds with 401
 *
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export function authenticatedAccess(
  req: Request,
  res: Response,
  next: Function,
) {
  // step 1) get the token and check if its there
  // step 2) verify token
  // step 3) check if user still exists
  try{
    const token = getToken(req);
    if(token !== null){
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded: IUser) => {
          if (err) {
            res.status(401).send('Invalid access. You must have a valid token to access this resource.');
          } else {
            console.log(decoded);
            next();
          }
        });
    } 
  } catch(e) {
    res.status(401).send('Invalid access. You must have a valid token to access this resource.');
  }
}