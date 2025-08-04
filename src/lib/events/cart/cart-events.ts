import { CartItem } from "@/lib/stores/cart-item";

export const ITEM_ADDED = "ITEM_ADDED";
export const ITEM_REMOVED = "ITEM_REMOVED";
export const CART_CLEARED = "CART_CLEARED";

export type ItemAdded = {
  type: typeof ITEM_ADDED;
  payload: CartItem;
};

export type ItemRemoved = {
  type: typeof ITEM_REMOVED;
  payload: CartItem;
};

export type CartCleared = {
  type: typeof CART_CLEARED;
};

export type CartEvent = ItemAdded | ItemRemoved | CartCleared;
