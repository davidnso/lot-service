import { ICartComponent } from "./interfaces/ICartInterface";

export class CartComponent implements ICartComponent{
    async fetchUserCart(args: { requester: string; }): Promise<import("../../shared/interfaces").ICart> {
        throw new Error("Method not implemented.");
    }    
    async addToCart(args: { requester: string; item: import("../../shared/interfaces").CartItem; }): Promise<import("../../shared/interfaces").CartItem> {
        throw new Error("Method not implemented.");
    }
    async updateCartItem(args: { updates: { quantity?: string; color?: string; size?: string; }; }): Promise<import("../../shared/interfaces").ICart> {
        throw new Error("Method not implemented.");
    }
    async deleteCartItem(args: { listingId: string; requester: string; }): Promise<import("../../shared/interfaces").ICart> {
        throw new Error("Method not implemented.");
    }
    async clearCart(args: { requester: string; }): Promise<void> {
        throw new Error("Method not implemented.");
    }
 
    
}