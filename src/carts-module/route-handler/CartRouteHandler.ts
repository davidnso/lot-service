import { Router, NextFunction, Request, Response } from "express";
import { CartComponent } from "../bloc/handler";
import { CartItem } from "../../shared/interfaces";

export class CartRouteHandler {
    public static buildRouter() {
      const router = Router();
  
      router.get("/cart/:requester", fetchCart );

      router.delete("/cart/:requester/:listingId", deleteCartItem );
      router.delete("/cart/:requester",);
      
      router.post("/cart/:requester/:listingId", addCartItem );

      router.get("/cart/:requester/:listingId", );
      

  
      return router;
    }
  }

  async function fetchCart(req: Request, res: Response, next: NextFunction){
    try {
      const headers = req.headers;
      const requester = req.params.requester;

     // authorizeUser({req,res,next});
     const cart = await CartComponent.getInstance().fetchUserCart({ requester });

      res.json(cart);
    } catch (error) {
            res.json({error: error.message }).status(400)

    }
  }

  async function deleteCartItem(req: Request, res: Response, next: NextFunction){
    try {
      const itemId = req.params.listingId;
      const requester = req.params.requester;

      await CartComponent.getInstance().deleteCartItem({
        listingId: itemId,
        requester
      })
      res.json({message: 'Operation successful'});
    } catch (error) {
      res.sendStatus(400);
    }
  }

  async function addCartItem(req: Request, res: Response, next: NextFunction){
    try {
      const itemId = req.params.listingId;
      const requester = req.params.requester;
      const orderDetails :CartItem = { 
        itemId,
        quantity: req.body.quantity,
        link: req.body.link,
        color: req.body.color      
      }

      await CartComponent.getInstance().addToCart({requester, item: orderDetails})
    } catch (error) {
      res.sendStatus(400);
    }
  }