"use client";

import { Button } from "./ui/button";
import { NumberInput } from "./ui/number-input";
import { ValueChangeDetails } from "@zag-js/number-input";
import { useCart } from "@/lib/stores/cart";
import { css } from "styled-system/css";
import { useEffect, useState } from "react";

export type Product = {
  partNo: string;
  name?: string;
  price?: number;
};

type CartControlProps = {
  product: Product;
};

export const CartControl = ({ product }: CartControlProps) => {
  const { items, addItem, removeItem } = useCart();
  const existingItem = items.find((item) => item.productId === product.partNo);

  const [quantity, setQuantity] = useState<number>(existingItem?.quantity ?? 0);

  useEffect(() => {
    setQuantity(existingItem?.quantity ?? 0);
  }, [existingItem]);

  const handleAddToCartClick = () => {
    addItem({
      productId: product.partNo,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  };

  const handleQuantityChange = (details: ValueChangeDetails) => {
    const value = parseInt(details.value || "0", 10);
    if (value === 0) {
      removeItem(product.partNo);

      return;
    }

    addItem({
      productId: product.partNo,
      name: product.name,
      price: product.price,
      quantity: value,
    });
  };
  return (
    <div className={css({ maxW: "8rem" })}>
      {(existingItem?.quantity ?? 0) > 0 ? (
        <NumberInput
          min={0}
          max={1000}
          step={1}
          value={quantity.toString()}
          onValueChange={handleQuantityChange}
        />
      ) : (
        <Button onClick={handleAddToCartClick}>Legg i handlekurv</Button>
      )}
    </div>
  );
};

/*
 TODOs:
 x Add a summary of the cart items
 x Implement a clear cart button
 x Add a remove item button for each item in the cart
 x Add a total price calculation
 x Style the cart control component
 x Use drawer component for cart summary
 - Implement a confirmation dialog when clearing the cart
 x Overall page layout
 - CLEAN UP!!!

*/
