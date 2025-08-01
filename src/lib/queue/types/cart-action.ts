import { CartItem } from "../../stores/types";

export const ADD_ITEM = "ADD_ITEM";

export type CartAction = { type: typeof ADD_ITEM; payload: CartItem };
