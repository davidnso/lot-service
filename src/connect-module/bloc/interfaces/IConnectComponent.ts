import { IBuyOrderDocument, IBuyOrder, Action } from "../../../shared/interfaces";

export interface IConnectComponent{ 


  /**
   * Create a new ask
   * @param args
   */
    createAsk(args: { orderInfo: IBuyOrder }): Promise<void>;


    submitResponse(args: { response: Partial<Action>}): Promise<void>;

    deleteAsk(): Promise<void>;

    searchAsks(args: {
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
        index?:string
      }): Promise<IBuyOrderDocument[]>;
    

    searchItemIndex(args: {
        index: string;
        query: {
          text: string;
          brand: string[];
        };
      }):Promise<any>;

    /**
   * fetch a specific ask by id
   * @param args
   */
    fetchAskById(args: {
        orderId: string;
        requester: string;
      }): Promise<IBuyOrder>;
    

    fetchAskByUsername(args: { 
        username: string
      })
    
}