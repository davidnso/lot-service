import { ICart, CartItem } from "../../../shared/interfaces";

export interface ICartComponent{ 
    /**
     * fetches a user's cart
     * @param args 
     */
    fetchUserCart(
        args: {
            requester: string
        }
    ): Promise<ICart>;

    /**
     * Add the item to the users cart and return said item for confirmation
     * @param args 
     */
    addToCart(
        args: {
            requester: string,
            item: CartItem
        }
    ): Promise<void>;

    /**
     * update the user's cart and return the updated cart. 
     * @param args 
     */
    updateCartItem(
        args: { 
            updates: { 
                quantity?: string,
                color?: string,
                size?: string,
            }
        }
    ): Promise<ICart>; 

    /**
     * delete the specific item from the users cart. 
     * @param args 
     */
    deleteCartItem(
        args: {
            listingId: string;
            requester: string
        }
    ): Promise<ICart>

    /**
     * delete everything from a users cart. 
     * @param args 
     */
    clearCart(
        args: { 
            requester: string;
        }
    ): Promise<void>
}