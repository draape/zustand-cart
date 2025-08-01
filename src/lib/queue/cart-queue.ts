import { createMessageQueue } from "./create-message-queue";
import { CartItem } from "../stores/types";

export const ADD_ITEM = "ADD_ITEM";

const fakeServerAddItem = async (item: CartItem): Promise<void> => {
  await new Promise((res) => setTimeout(res, 500));
  if (Math.random() < 0.3) throw new Error("Simulated failure");
  console.log("[SYNCED TO SERVER]", item);
};

const cartSyncQueue = createMessageQueue<CartItem>(async (action) => {
  switch (action.type) {
    case ADD_ITEM:
      await fakeServerAddItem(action.payload);
      break;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
});

export const enqueueCartMessage = cartSyncQueue.enqueue;
export const getCartSyncQueue = cartSyncQueue.getQueue;
