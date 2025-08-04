import { describe, it, expect, beforeEach, vi, MockInstance } from "vitest";
import { CART_STORAGE_KEY, useCart } from "../src/lib/stores/cart";
import {
  cartEventHandlers,
  ItemAdded,
  ItemRemoved,
} from "../src/lib/events/cart";

let addItemSpy: MockInstance<(evt: ItemAdded) => Promise<void>>;
let removeItemSpy: MockInstance<(evt: ItemRemoved) => Promise<void>>;
let clearCartSpy: MockInstance<() => Promise<void>>;

describe("Cart store", () => {
  beforeEach(() => {
    addItemSpy = vi.spyOn(cartEventHandlers, "ITEM_ADDED").mockResolvedValue();
    removeItemSpy = vi
      .spyOn(cartEventHandlers, "ITEM_REMOVED")
      .mockResolvedValue();
    clearCartSpy = vi
      .spyOn(cartEventHandlers, "CART_CLEARED")
      .mockResolvedValue();

    useCart.getState().clearCart();
    // Reset spy to ensure no previous calls affect any tests
    clearCartSpy.mockClear();
  });

  it("Adds items to the cart", () => {
    useCart.getState().addItem({
      productId: "p1",
      name: "Test Product",
      price: 10,
      quantity: 1,
    });

    const items = useCart.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].name).toBe("Test Product");
  });

  it("Updates quantity if item already exists", () => {
    const cart = useCart.getState();
    cart.addItem({
      productId: "p1",
      name: "Test Product",
      price: 10,
      quantity: 1,
    });
    cart.addItem({
      productId: "p1",
      name: "Test Product",
      price: 10,
      quantity: 3,
    });

    const item = useCart.getState().items[0];
    expect(item.quantity).toBe(3);
  });

  it("Removes items from the cart", () => {
    const cart = useCart.getState();
    cart.addItem({
      productId: "p1",
      name: "Test Product",
      price: 10,
      quantity: 1,
    });
    cart.removeItem("p1");

    expect(cart.items).toHaveLength(0);
  });

  it("Clears the cart", () => {
    const cart = useCart.getState();
    cart.addItem({
      productId: "p1",
      name: "Test Product",
      price: 10,
      quantity: 1,
    });
    cart.addItem({
      productId: "p2",
      name: "Another Product",
      price: 20,
      quantity: 2,
    });

    // Make sure we are not using a stale state snapshot
    expect(useCart.getState().items).toHaveLength(2);

    cart.clearCart();

    expect(useCart.getState().items).toHaveLength(0);
  });

  it("Persists cart items to localStorage", () => {
    const key = CART_STORAGE_KEY;
    // Clear any old state first
    localStorage.removeItem(key);

    useCart.getState().addItem({
      productId: "p99",
      name: "Persistent Product",
      price: 99,
      quantity: 1,
    });

    const raw = localStorage.getItem(key);
    expect(raw).toBeTruthy();

    const data = JSON.parse(raw!);
    expect(data.state.items[0].productId).toBe("p99");
  });

  it("Message is queued for each cart action", async () => {
    const cart = useCart.getState();

    cart.addItem({
      productId: "p1",
      name: "Test Product",
      price: 10,
      quantity: 1,
    });

    cart.addItem({
      productId: "p1",
      name: "Test Product",
      price: 10,
      quantity: 3,
    });

    cart.removeItem("p1");
    cart.clearCart();

    await vi.runAllTimersAsync();

    expect(addItemSpy).toHaveBeenCalledTimes(2);
    expect(removeItemSpy).toHaveBeenCalledTimes(1);
    expect(clearCartSpy).toHaveBeenCalledTimes(1);
  });
});
