import { Router, Request, NextFunction, Response } from "express";
import { Address, searchQueryParams } from "../../shared/types";
import { OutletComponent } from "../bloc/handler";
import { IListing, IBuyOrder } from "../../shared/interfaces";

export class OutletModuleRouteHandler {
  public static buildRouter() {
    const router = Router();
    new OutletComponent();
    router.post("/outlet/:requester", createOutlet);
    router.get('/outlet/:owner', fetchAllUserOutlets)
    router.get('/outlet/:owner/outlet/:outletId', fetchUserOutlet)
    router.get('/outlet/:listingId/listing', fetchListing)
    router.post("/outlet/:username/listing", createListing);
    
    router.put("/outlet/:requester/:listingId");
    router.delete("/outlet/:requester/listingId");
     router.get("/outlet/search/listings", searchListings);

    return router;
  }
}

async function createOutlet(req: Request, res: Response, next: NextFunction) {
  try {
    const headers = req.headers;
    const info: {
      name: string;
      bannerImgUrl: string;
      addresses: Address[];
      tier: string;
    } = req.body.info;
    console.log("trying");

    const requester = req.params.requester;
    // authorizeUser({req,res,next});
    const outlet = await OutletComponent.getInstance().createOutlet({ ...info, requester });

    res.json({ message: "Outlet successfully created", outlet});
  } catch (error) {
    console.log(error);
    res.json({ error: error.message }).status(400);
  }
}

async function fetchAllUserOutlets(req: Request, res: Response, next: NextFunction) {
  try {
    const headers= req.headers
    //TODO: Pull requester from auth header. 
    const owner = req.params.owner;

    const outlets = await OutletComponent.getInstance().fetchAllUserOutlets({
      requester: '',
      id: owner
    })

    res.json({outlets});
  } catch (error) {
    res.json({error: error.medssage}).status(400);
  }
}

async function fetchUserOutlet(req: Request, res: Response, next: NextFunction) {
  try {
    const headers= req.headers
    const owner = req.params.owner;
    const outletId = req.params.outletId;

    const outletInfo = await OutletComponent.getInstance().fetchOutlet({
      outletId,
      requester: ''
    })

    res.json({outlet: outletInfo.outlet, listings: outletInfo.listings})

  } catch (error) {
    res.json({error: error.medssage}).status(400);
  }
}


async function createListing(req: Request, res: Response, next: NextFunction) {
  try {
    const headers = req.headers;
    let info: IListing = req.body.info;
    const requester = req.params.username;
    // const outletId = req.params.outletId; 

    // info.storeId = outletId;

    const createdListing = await OutletComponent.getInstance().createListing({
      listingInfo: info,
      requester
    });

    res.json({ Message: 'Listing created' });
  } catch (error) {
    console.log(error);
    res.json({ error: error.message });
  }
}

async function searchListings(req: Request, res: Response, next: NextFunction) {
  try {
    const headers = req.headers;
    const info = req.body.info;
    let query: searchQueryParams = {
      text: req.query.text as any || "",
      filters: {
        gender: req.query.gender ? req.query.gender as any: null,
        kids: req.query.kids ? req.query.kids as any : null,
        priceRange: {
          from: req.query.from ? req.query.from as any : null,
          to: req.query.to ? req.query.to as any : null,
        },
        color: req.query.color ? req.query.color as any : null,
        size: req.query.size ? req.query.size as any : null,
      },
      limit: req.query.limit ? req.query.limit as any : null,
      sortby: {
        date: req.query.date ? req.query.date as any : null,
        price: req.query.price ? req.query.price as any : null,
        name: req.query.name ? req.query.name as any : null,
      },
    };
    const searchResult = await OutletComponent.getInstance().searchListings({
      query,
      outlet: ""
    });

    res.json(searchResult).status(200);
  } catch (error) {
    res.json({ error: error.message }).status(400);
  }
}

async function fetchListing(req: Request, res: Response, next: NextFunction) {
  try {
    const headers = req.headers;
    const info = req.body.info;
    const listingId = req.params.listingId
    
    const listing = await OutletComponent.getInstance().fetchListing({listingId})
    res.json(listing);
  } catch (error) {
    res.json({ error: error.message }).status(400);
  }
}


async function fetchOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const headers = req.headers;
    const info = req.body.info;
  } catch (error) {
    res.json({ error: error.message }).status(400);
  }
}
