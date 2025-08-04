import { AsyncQueuer, AsyncQueuerState } from "@tanstack/pacer";
import polly from "polly-js";
import { CartEvent, cartEventHandlers } from "../events/cart";

const PERSIST_KEY = "cart-queue";

const rawQueue = localStorage.getItem(PERSIST_KEY);
const initialState: AsyncQueuerState<CartEvent> | undefined = rawQueue
  ? JSON.parse(rawQueue)
  : undefined;

const saveQueueState = (state: AsyncQueuerState<CartEvent>) => {
  localStorage.setItem(PERSIST_KEY, JSON.stringify(state));
};

const processEvent = async <E extends CartEvent>(evt: E) => {
  const handler = cartEventHandlers[evt.type] as (e: E) => Promise<void>;

  if (!handler) {
    throw new Error(`No handler registered for type: ${evt.type}`);
  }
  await polly()
    .handle(() => true)
    .waitAndRetry([500, 1_000, 2_000])
    .executeForPromise(() => handler(evt));
};

export const cartQueuer = new AsyncQueuer<CartEvent>(processEvent, {
  initialState,
  concurrency: 1,
});

// Subscribe to state changes to persist the queue
cartQueuer.store.subscribe(() => saveQueueState(cartQueuer.store.state));

// Export the queuer instance for use in other parts of the application
export const enqueueCartMessage = (action: CartEvent) => {
  cartQueuer.addItem(action);
};

export const getCartQueueState = () => cartQueuer.store.state;
