import { afterEach, expect, it, vi } from "vitest";

import {
  cartQueuer,
  enqueueCartMessage,
  getCartQueueState,
} from "../src/lib/queue/cart-queue-pacer";
import {
  CartEvent,
  ITEM_ADDED,
  ItemAdded,
} from "../src/lib/events/cart/cart-events";
import { cartEventHandlers } from "../src/lib/events/cart/handlers";

afterEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  cartQueuer.reset();
});

it("Dispatches the correct handler (happy path)", async () => {
  const spy = vi.spyOn(cartEventHandlers, ITEM_ADDED).mockResolvedValue();

  enqueueCartMessage({
    type: ITEM_ADDED,
    payload: { productId: "p1", quantity: 1 },
  });

  await vi.runAllTimersAsync();
  expect(spy).toHaveBeenCalledTimes(1);
});

it("Processes items FIFO", async () => {
  const seen: string[] = [];

  vi.spyOn(cartEventHandlers, ITEM_ADDED).mockImplementation(
    async (e: ItemAdded) => {
      seen.push(e.payload.productId);
    }
  );

  enqueueCartMessage({
    type: ITEM_ADDED,
    payload: { productId: "1", quantity: 1 },
  });
  enqueueCartMessage({
    type: ITEM_ADDED,
    payload: { productId: "2", quantity: 1 },
  });

  await vi.runAllTimersAsync();
  expect(seen).toEqual(["1", "2"]);
});

it("Retries on transient error, then succeeds", async () => {
  const stub = vi
    .spyOn(cartEventHandlers, ITEM_ADDED)
    .mockRejectedValueOnce(new Error("boom"))
    .mockResolvedValueOnce();

  enqueueCartMessage({
    type: ITEM_ADDED,
    payload: { productId: "x", quantity: 1 },
  });

  // advance by total polly back‑off plus micro‑task ticks
  await vi.advanceTimersByTimeAsync(4_000);

  expect(stub).toHaveBeenCalledTimes(2);
  expect(getCartQueueState().items.length).toBe(0);
});

it("Marks item as failed after all retries", async () => {
  // The simulated error happens async on the queue, so we need to ignore the error
  process.on("unhandledRejection", (err) => {
    if (err instanceof Error && err.message.includes("Simulated failure")) {
      return;
    }
    throw err;
  });

  vi.spyOn(cartEventHandlers, ITEM_ADDED).mockRejectedValue(
    new Error("Simulated failure")
  );

  enqueueCartMessage({
    type: ITEM_ADDED,
    payload: { productId: "z", quantity: 1 },
  });

  // advance by total polly back‑off plus micro‑task ticks
  await vi.advanceTimersByTimeAsync(4_000);

  expect(getCartQueueState().errorCount).toBe(1);
});

it("Persists to local storage on every state change", async () => {
  const spy = vi.spyOn(localStorage, "setItem");
  enqueueCartMessage({
    type: ITEM_ADDED,
    payload: { productId: "p", quantity: 1 },
  });
  await vi.advanceTimersByTimeAsync(4_000);

  expect(spy).toHaveBeenCalled();
});

it("Throws if no handler is registered", async () => {
  // The expected error happens async on the queue, so we need to ignore the error
  // and assert that we catch the error in other ways
  process.on("uncaughtException", (err) => {
    if (err instanceof Error && err.message.includes("No handler registered")) {
      // ignore expected error
      return;
    }

    // rethrow unexpected errors
    throw err;
  });

  // cast to bypass compile‑time check
  const bad = {
    type: "BAD_EVENT",
    payload: undefined,
  } as unknown as CartEvent;

  enqueueCartMessage(bad);
  await vi.runAllTimersAsync();

  const cartState = getCartQueueState();
  expect(cartState.errorCount).toBe(1);
  expect(cartState.successCount).toBe(0);
});
