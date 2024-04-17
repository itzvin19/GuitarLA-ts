import { db } from "../data/db";
import { CartItem, Guitar } from "../types";

export type CartActions =
    { type: "add-to-cart", payload: { guitar: Guitar } } |
    { type: "remove-cart", payload: { id: Guitar['id'] } } |
    { type: "decrease-quantity", payload: { id: Guitar['id'] } } |
    { type: "increase-quantity", payload: { id: Guitar['id'] } } |
    { type: "clear-cart" }


export type cartState = {
    data: Guitar[],
    cart: CartItem[]
}

const cartStored=localStorage.getItem('cart');


export const initialState: cartState = {
    data: db,
    cart: cartStored?JSON.parse(cartStored):[]
}

const MAX_ITEMS = 10;
const MIN_ITEMS = 1;


export const cartReducer = (state: cartState, actions: CartActions) => {
    if (actions.type === 'add-to-cart') {
        const itemExists = state.cart.findIndex((guitar) => guitar.id === actions.payload.guitar.id);

        if (itemExists < 0) {
            const newItem: CartItem = { ...actions.payload.guitar, quantity: 1 }
            return {
                ...state,
                cart: [...state.cart, newItem]
            }
        } else {
            const updatedCart = [...state.cart];
            updatedCart[itemExists].quantity++;
            return {
                ...state,
                cart: updatedCart
            }
        }
    }
    if (actions.type === 'increase-quantity') {
        const updatedCart = state.cart.map((item) => {
            if (item.id === actions.payload.id && item.quantity < MAX_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity + 1,
                };
            }
            return item;
        });
        return {
            ...state,
            cart: updatedCart
        }
    }

    if (actions.type === 'decrease-quantity') {
        const updatedCart = state.cart.map((item) => {
            if (item.id === actions.payload.id && item.quantity > MIN_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity - 1,
                };
            }
            return item;
        });
        return {
            ...state,
            cart: updatedCart
        }
    }

    if (actions.type === 'remove-cart') {
        return {
            ...state,
            cart: state.cart.filter(item => item.id !== actions.payload.id)
        }
    }

    if (actions.type === 'clear-cart') {
        return {
            ...state,
            cart: []
        }
    }

    return state
}