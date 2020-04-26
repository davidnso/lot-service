import { ConnectComponent } from "../bloc/handler";
import { Router, NextFunction, Request, Response } from "express";
import { IBuyOrder, Action } from "../../shared/interfaces";
import { searchQueryParams } from "../../shared/types";
import { authenticatedAccess } from "../../shared/decorators/auth"

export class ConnectModuleRouteHandler {
  public static buildRouter() {
    const router = Router();

    new ConnectComponent();

    router.post("/connect/:username/ask",authenticatedAccess, createAsk);
    router.get("/connect/:username/search",authenticatedAccess, fetchUserAsks);
    router.get("/connect/:username/ask/:orderId",authenticatedAccess, fetchAskbyId);
    router.get("/connect/asks",authenticatedAccess,searchAsks);
    router.get("/connect/:askId/session/actorId",authenticatedAccess, fetchSession)
    router.get("/connect/:askId/session",authenticatedAccess, fetchAllSessions)

    router.put("/connect/:actorId/ask/:askId",authenticatedAccess, updateUserAsk);
    router.post("/connect/index/search",authenticatedAccess, searchIndex);

    return router;
  }
}

async function createAsk(req: Request, res: Response, next: NextFunction) {
  try {
    const headers = req.headers;
    const info: IBuyOrder = req.body.info;

    await ConnectComponent.getInstance().createAsk({ orderInfo: info });

    res.sendStatus(200);
  } catch (error) {
    res.json({ error: error.message }).status(400);
  }
}

async function searchAsks(req: Request, res: Response, next: NextFunction) {
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

    let outlet = req.query.outlet ? req.query.outlet as string : null;

    const searchResult = await ConnectComponent.getInstance().searchAsks({
      query,
      outlet,
    });

    res.json(searchResult);
  } catch (error) {
    res.json({ error: error.message }).status(400);
  }
}

async function fetchUserAsks(req: Request, res: Response, next: NextFunction) {
  try {
    const username = req.params.username;

    const searchResult = await ConnectComponent.getInstance().fetchAskByUsername(
      {
        username,
      }
    );

    res.json(searchResult);
  } catch (error) {
    throw error;
  }
}

async function searchIndex(req: Request, res: Response, next: NextFunction) {
  try {
    const headers = req.headers;
    const info: {
      index: string;
      query: {
        text: string;
        brand: string[];
      }
    } = req.body.info;

    const results = await ConnectComponent.getInstance().searchItemIndex(info);

    res.json(results);
  } catch (error) {
    res.json({ error: error.message }).status(400);
  }
}

async function fetchAskbyId(req: Request, res: Response, next: NextFunction) {
  try {
    const headers = req.headers;
    const orderId = req.params.orderId;
    const requester = req.params.username;

    const results = await ConnectComponent.getInstance().fetchAskById({orderId, requester})
    res.json(results);
  } catch (error) {
    res.json({ error: error.message }).status(400);
  }
}

async function  fetchOrderUpdates(req: Request, res: Response, next: NextFunction) { 
    try {
        const orderId = req.params.orderId
    } catch (error) {
        res.json({ error: error.message }).status(400);
    }
}

async function updateUserAsk(req: Request, res: Response, next: NextFunction) {
  try {
      const headers = req.headers;
      let info: Action = req.body.info;   
      const actorId = req.params.actorId
      const askId = req.params.askId;
      const session =  await ConnectComponent.getInstance().submitResponse({
            response: {
              action: info.action,
              actorId,
              role: info.role,
              price: info.price,
              date: Date.now().toString()
            },
            askId
        })

        res.json(session).status(200)
  } catch (error) {
    res.json({ error: error.message }).status(400);
  }
}

async function fetchSession(req: Request, res: Response, next: NextFunction){
    try {
        const headers = req.headers;
        const info: Action = req.body.info;
        const askId = req.params.askId; 
        const outletId = req.params.outletId; 


        let session = await ConnectComponent.getInstance().fetchSessionResponses({outletId,askId})

        res.json({session});
    } catch (error) {
        res.json({ error: error.message }).status(400);
    }
}

async function fetchAllSessions(req: Request, res: Response, next: NextFunction){
  try {
      const headers = req.headers;
      const info: Action = req.body.info;
      const askId = req.params.askId; 
      const outletId = req.params.outletId; 


      let sessions = await ConnectComponent.getInstance().fetchAllSessions({askId})

      res.json({sessions});
  } catch (error) {
      res.json({ error: error.message }).status(400);
  }
}

