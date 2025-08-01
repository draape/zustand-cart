import {
  CartEvent,
  ITEM_ADDED,
  ITEM_REMOVED,
  CART_CLEARED,
} from "../cart-events";
import { handleItemAdded } from "./item-added.handler";
import { handleItemRemoved } from "./item-removed.handler";
import { handleCartCleared } from "./cart-cleared.handler";

type Handler<E extends CartEvent = CartEvent> = (evt: E) => Promise<void>;

export const cartEventHandlers: {
  [K in CartEvent["type"]]: Handler<Extract<CartEvent, { type: K }>>;
} = {
  [ITEM_ADDED]: handleItemAdded,
  [ITEM_REMOVED]: handleItemRemoved,
  [CART_CLEARED]: handleCartCleared,
};
