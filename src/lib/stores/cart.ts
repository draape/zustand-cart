import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "./types";
import { ADD_ITEM, enqueueCartMessage } from "@/lib/queue/cart-queue";

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find(
          (i) => i.productId === item.productId
        );
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }

        enqueueCartMessage(ADD_ITEM, item);
      },
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage", // name of item in localStorage
    }
  )
);
