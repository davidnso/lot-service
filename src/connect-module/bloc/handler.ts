import { IConnectComponent } from "./interfaces/IConnectComponent";
import {
  IBuyOrder,
  IBuyOrderDocument,
  Session,
  Action,
} from "../../shared/interfaces";
import { MongoDriver } from "../../drivers/mongo/mongoDriver";
import { BuyOrder } from "../../shared/entity/buyOrder";

export class ConnectComponent implements IConnectComponent {
  static instance: ConnectComponent;

  static getInstance() {
    if (!this.instance) {
      ConnectComponent.instance = new ConnectComponent();
    }
    return ConnectComponent.instance;
  }

  async fetchAskById(args: {
    orderId: string;
    requester: string;
  }): Promise<IBuyOrder> {
    try {
      return await MongoDriver.getInstance().findAsk({
        orderId: args.orderId,
      });
    } catch (error) {
      throw error;
    }
  }

  async fetchAskByUsername(args: { username: string }) {
    try {
      if (args.username) {
        const indices = [
          "footwear-index",
          "apparel-index",
          "accessories-index",
        ];
        let formattedSearchResult = [];
        for (let index = 0; index < indices.length; index++) {
          const element = indices[index];
          const searchResult = await MongoDriver.getInstance().findAllUserBuyOrders(
            {
              username: args.username,
              index: indices[index],
            }
          );
          formattedSearchResult.push(...searchResult);
        }

        // formattedSearchResult.map((ask: IBuyOrderDocument)=>{ 
        //     await MongoDriver.getInstance().
        // })
        return formattedSearchResult;
      }
      return [];
    } catch (error) {
      throw error;
    }
  }

  async createAsk(args: { orderInfo: IBuyOrder }): Promise<void> {
    try {
      const order = new BuyOrder(args.orderInfo);

      const orderId = await MongoDriver.getInstance().createAsk({
        orderInfo: order,
      });

      // await MongoDriver.getInstance().createSessionDocument();

      // await MongoDriver.getInstance().insertEventLog({ orderId });
    } catch (error) {
      throw error;
    }
  }

  async submitResponse(args: {
    response: Action;
    askId: string
  }): Promise<any> {
    try {
      //Check if session exists with the specified user as a member
      if(args.response.role === 'seller'){
        console.log('in the handler')
        const sessionExsists:Session = await MongoDriver.getInstance().checkIfUserSessionExists(
          { outletId: args.response.actorId, askId : args.askId}
        );
        if(sessionExsists !== null){ 
          await MongoDriver.getInstance().addLogToSession({ 
              action: args.response,
              sessionId: sessionExsists._id
          })

          return await MongoDriver.getInstance().checkIfUserSessionExists({ 
            outletId: args.response.actorId,
            askId: args.askId
        }) 
           }else{ 
          //create the session
          const sessionId = await MongoDriver.getInstance().createSessionDocument(
            {outletId: args.response.actorId,
            askId: args.askId}
          )
          //add a new log

          await MongoDriver.getInstance().addLogToSession({
              action: args.response ,
              sessionId
          })

          return await MongoDriver.getInstance().checkIfUserSessionExists({ 
            outletId: args.response.actorId,
            askId: args.askId
        }) 
      }
      }

      if(args.response.role === 'buyer'){ 
        const sessionExsists:Session = await MongoDriver.getInstance().checkIfUserSessionExists(
          { outletId: args.response.actorId, askId : args.askId}
        );

        if(sessionExsists ===null){
          throw new Error('No active session found with seller.')
        }else{ 
          await MongoDriver.getInstance().addLogToSession({
            action: args.response ,
            sessionId: sessionExsists._id
        })

        return await MongoDriver.getInstance().checkIfUserSessionExists({ 
          outletId: args.response.actorId,
          askId: args.askId
      }) 
        }
      }
      

      

      //if session does not exist create
    } catch (error) {
      throw error;
    }
  }

  async fetchSessionResponses(args: { 
      outletId: string
      askId: string
  }){ 
    try {
      const sessionExsists:Session = await MongoDriver.getInstance().checkIfUserSessionExists(
        { outletId: args.outletId, askId : args.askId}
      );

      if(sessionExsists ===null){
        throw new Error('No active session found with seller.')
      }else{ 


      return await MongoDriver.getInstance().checkIfUserSessionExists({ 
        outletId: args.outletId,
        askId: args.askId
    }) 
      }
    } catch (error) {
        throw error; 
    }
  }

  async fetchAllSessions(args: { 
    askId: string
  }){ 
    try {
      return await MongoDriver.getInstance().findAllSessions({askId: args.askId})
    } catch (error) {
      throw error;
    }
  }

  async deleteAsk(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async searchAsks(args: {
    query: {
      text: string;
      filters?: {
        gender?: string[];
        kids?: string[];
        priceRange?: { from: string; to: string };
        color?: string[];
        size?: string[];
      };
      limit: string;
      sortby?: { date?: number; price?: number; name?: number };
    };
    outlet: string;
    index?: string;
  }): Promise<import("../../shared/interfaces").IBuyOrderDocument[]> {
    try {
      if (args.index === null || args.index === undefined) {
        const indices = [
          "footwear-index",
          "apparel-index",
          "accessories-index",
        ];
        let formattedSearchResult = [];
        console.log('here we are')
        for (let index = 0; index < indices.length; index++) {
          const element = indices[index];
          const searchResult = await MongoDriver.getInstance().searchBuyOrder({
            query: args.query,
            outlet: args.outlet,
            index: indices[index],
          });
          formattedSearchResult.push(...searchResult);
        }
        // indices.forEach(async index=>{
        //     console.log('here searching buy orders')
        //      const searchResult  = await MongoDriver.getInstance().searchBuyOrder({
        //       query: args.query,
        //       outlet: args.outlet,
        //       index
        //     });
        //     // console.log(searchResult)
        //   })
        console.log(formattedSearchResult);
        return formattedSearchResult;
      } else {
        console.log('here we are in else')

        return await MongoDriver.getInstance().searchBuyOrder({
          query: args.query,
          outlet: args.outlet,
          index: args.index,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async searchItemIndex(args: {
    index: string;
    query: {
      text: string;
      brand: string[];
    };
  }) {
    try {
      const items = await MongoDriver.getInstance().searchItemIndex(args);

      return items;
    } catch (error) {
      throw error;
    }
  }
}
