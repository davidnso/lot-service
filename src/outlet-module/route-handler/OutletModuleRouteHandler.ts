import { Router } from "express";

export class OutletModuleRouteHandler {
    public static buildRouter() {
      const router = Router();
  
      router.post("/outlet/:requester", );
      router.post("/outlet/:username/listing/:storeId", );
      router.post("/outlet/:username/buyOrder", );
      router.get("/outlet/:username/buyOrder/search", );
      router.post('/outlet/:username/buyOrder/:orderId', );
      router.put('/outlet/:requester/:listingId', );
      router.delete('/outlet/:requester/listingId', );
      router.get('outlet/search/listings', );

  
      return router;
    }
  }