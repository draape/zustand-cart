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
});
