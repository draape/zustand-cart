import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "./types";
import { enqueueCartMessage } from "../queue/cart-queue-pacer";

export const CART_STORAGE_KEY = "cart-storage";

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  // TODO: Summary
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find(
          (i) => i.productId === item.productId
        );

        const updatedItem = existing
          ? { ...existing, quantity: item.quantity }
          : item;

        const items = existing
          ? get().items.map((i) =>
              i.productId === item.productId ? updatedItem : i
            )
          : [...get().items, updatedItem];

        set({ items: items });

        enqueueCartMessage({
          type: "ITEM_ADDED",
          payload: updatedItem,
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));

        enqueueCartMessage({
          type: "ITEM_REMOVED",
          payload: { productId } as CartItem,
        });
      },
      clearCart: () => {
        set({ items: [] });

        enqueueCartMessage({
          type: "CART_CLEARED",
        });
      },
    }),
    {
      name: CART_STORAGE_KEY,
    }
  )
);
