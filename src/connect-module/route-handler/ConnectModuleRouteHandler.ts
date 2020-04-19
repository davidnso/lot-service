import { ConnectComponent } from "../bloc/handler";
import { Router, NextFunction, Request, Response } from "express";
import { IBuyOrder, Action } from "../../shared/interfaces";
import { searchQueryParams } from "../../shared/types";

export class ConnectModuleRouteHandler {
  public static buildRouter() {
    const router = Router();

    new ConnectComponent();

    router.post("/connect/:username/ask", createAsk);
    router.get("/connect/:username/search", fetchUserAsks);
    router.get("/connect/:username/ask/:orderId", fetchAskbyId);
    router.get("/connect/asks", searchAsks);
    router.get("/connect/:askId/session/actorId", fetchSession)
    router.get("/connect/:askId/session", fetchAllSessions)

    router.put("/connect/:actorId/ask/:askId", updateUserAsk);
    router.post("/connect/index/search", searchIndex);

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
      text: req.query.text || "",
      filters: {
        gender: req.query.gender ? req.query.gender : null,
        kids: req.query.kids ? req.query.kids : null,
        priceRange: {
          from: req.query.from ? req.query.from : null,
          to: req.query.to ? req.query.to : null,
        },
        color: req.query.color ? req.query.color : null,
        size: req.query.size ? req.query.size : null,
      },
      limit: req.query.limit ? req.query.limit : null,
      sortby: {
        date: req.query.date ? req.query.date : null,
        price: req.query.price ? req.query.price : null,
        name: req.query.name ? req.query.name : null,
      },
    };

    let outlet = req.query.outlet ? req.query.outlet : null;

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

