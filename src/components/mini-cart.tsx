"use client";

import { Drawer } from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { IconButton } from "./ui/icon-button";
import { XIcon } from "lucide-react";
import { Portal } from "@ark-ui/react";
import { useCart } from "@/lib/stores/cart";
import { css } from "styled-system/css";
import { CartControl } from "./cart-control";

export const MiniCart = () => {
  const { items, removeItem, clearCart } = useCart();
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild pos="relative" right={0}>
        <Button variant="outline">Handlekurv</Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Content maxW="25rem" pos="fixed" right="0" top="0" bottom="0">
          <Drawer.Header>
            <h2>Du har {items.length} varer i handlekurven</h2>
            <Drawer.CloseTrigger asChild position="absolute" top="3" right="4">
              <IconButton variant="ghost">
                <XIcon />
              </IconButton>
            </Drawer.CloseTrigger>
          </Drawer.Header>
          <Drawer.Body>
            <div
              className={css({
                display: "flex",
                flexDir: "column",
                gap: "1rem",
              })}
            >
              {items.map((item) => (
                <div key={item.productId}>
                  <div
                    className={css({
                      display: "flex",
                      flexDir: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: "0.5rem",
                    })}
                  >
                    <h3
                      className={css({
                        fontSize: "md",
                        fontWeight: "bold",
                      })}
                    >
                      {item.name}
                    </h3>
                    <IconButton
                      variant="ghost"
                      size="xs"
                      onClick={() => removeItem(item.productId)}
                    >
                      <XIcon />
                    </IconButton>
                  </div>
                  <div
                    className={css({
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "1rem",
                    })}
                  >
                    <CartControl
                      product={{ ...item, partNo: item.productId }}
                    />
                    <span>
                      kr {((item.price ?? 0) * (item.quantity ?? 0)).toFixed(2)}
                    </span>
                  </div>
                  <hr className={css({ mt: "1rem" })} />
                </div>
              ))}

              <div>{items.length} varer</div>
              <div
                className={css({
                  display: "flex",
                  justifyContent: "space-between",
                })}
              >
                <span>
                  <strong>Totalt</strong>
                </span>
                <span>
                  <strong>
                    kr{" "}
                    {items
                      .reduce(
                        (acc, item) => acc + (item.price ?? 0) * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </strong>
                </span>
              </div>
            </div>
          </Drawer.Body>
          <Drawer.Footer gap="3" display="flex" flexDir="column">
            <Button variant="outline" onClick={clearCart}>
              Tøm handlekurv
            </Button>
            <Button>Gå til handlekurv</Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Portal>
    </Drawer.Root>
  );
};
