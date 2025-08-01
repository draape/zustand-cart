import {
  CART_CLEARED,
  CartEvent,
  ITEM_ADDED,
  ITEM_REMOVED,
} from "../cart-events";
import { handleCartCleared } from "./cart-cleared.handler";
import { handleItemAdded } from "./item-added.handler";
import { handleItemRemoved } from "./item-removed.handler";

type Handler<E extends CartEvent = CartEvent> = (evt: E) => Promise<void>;

export const cartEventHandlers: {
  [K in CartEvent["type"]]: Handler<Extract<CartEvent, { type: K }>>;
} = {
  [ITEM_ADDED]: handleItemAdded,
  [ITEM_REMOVED]: handleItemRemoved,
  [CART_CLEARED]: handleCartCleared,
};
