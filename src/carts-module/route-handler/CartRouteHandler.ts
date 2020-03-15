import { Router } from "express";

export class CartRouteHandler {
    public static buildRouter() {
      const router = Router();
  
      router.get("/cart/:requester", );

      router.delete("/cart/:requester/:listingId", );
      router.delete("/cart/:requester", );
      
      router.post("/cart/:requester", );

      router.get("/cart/:requester/:listingId", );
      

  
      return router;
    }
  }