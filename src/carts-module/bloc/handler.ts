import { ICartComponent } from "./interfaces/ICartInterface";
import { MongoDriver } from "../../drivers/mongo/mongoDriver";

export class CartComponent implements ICartComponent {

    static instance: CartComponent;

    static getInstance() {
      if (!this.instance) {
        CartComponent.instance = new CartComponent();
      }
      return CartComponent.instance;
    }

  async fetchUserCart(args: {
    requester: string;
  }): Promise<import("../../shared/interfaces").ICart> {
    try {
      return await MongoDriver.getInstance().findCart({
        username: args.requester
      });
    } catch (error) {
      throw error;
    }
  }
  async addToCart(args: {
    requester: string;
    item: import("../../shared/interfaces").CartItem;
  }): Promise<void> {
    try {
      await MongoDriver.getInstance().addToCart({
        requester: args.requester,
        item: args.item
      });

      //TODO: Verify that the item has been added to the users cart...
    } catch (error) {
      throw error;
    }
  }
  async updateCartItem(args: {
    updates: { quantity?: string; color?: string; size?: string };
  }): Promise<import("../../shared/interfaces").ICart> {
    throw new Error("Method not implemented.");
  }

  async deleteCartItem(args: {
    listingId: string;
    requester: string;
  }): Promise<import("../../shared/interfaces").ICart> {
    try {
      return await MongoDriver.getInstance().deleteCartItem({
        requester: args.requester,
        listingId: args.listingId
      });
    } catch (error) {
      throw error;
    }
  }
  async clearCart(args: { requester: string }): Promise<void> {
    try {
      return await MongoDriver.getInstance().clearCart({
        requester: args.requester
      });
    } catch (error) {
      throw error;
    }
  }
}
