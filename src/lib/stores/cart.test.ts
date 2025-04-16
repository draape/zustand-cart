import { describe, it, expect, beforeEach } from "vitest";
import { useCart } from "./cart";

describe("Cart Store", () => {
  beforeEach(() => {
    useCart.getState().clearCart();
  });

  it("adds items to the cart", () => {
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

  it("updates quantity if item already exists", () => {
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

  it("removes items from the cart", () => {
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

  it("clears the cart", () => {
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

  it("persists cart items to localStorage", () => {
    const key = "cart-storage";
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
});
