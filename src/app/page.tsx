import { MiniCart } from "@/components/mini-cart";
import { CartControl } from "@/components/cart-control";
import { css } from "styled-system/css";

const dummyProducts = [
  { partNo: "1", name: "Produkt 1", price: 30 },
  { partNo: "2", name: "Produkt 2", price: 40 },
  { partNo: "3", name: "Produkt 3", price: 30 },
  { partNo: "4", name: "Produkt 4", price: 50 },
  { partNo: "5", name: "Produkt 5", price: 20 },
  { partNo: "6", name: "Produkt 6", price: 60 },
  { partNo: "7", name: "Produkt 7", price: 70 },
  { partNo: "8", name: "Produkt 8", price: 80 },
  { partNo: "9", name: "Produkt 9", price: 90 },
  { partNo: "10", name: "Produkt 10", price: 100 },
  { partNo: "11", name: "Produkt 11", price: 110 },
  { partNo: "12", name: "Produkt 12", price: 120 },
];

export default function Home() {
  return (
    <main
      className={css({
        maxW: "1200px",
        mx: "auto",
        display: "flex",
        flexDir: "column",
        gap: "1rem",
        alignItems: "start",
      })}
    >
      <h1 className={css({ fontSize: "4xl", fontWeight: "bold", py: "1rem" })}>
        PLP
      </h1>

      <MiniCart />

      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "1rem",
          width: "100%",
        })}
      >
        {dummyProducts.map((product) => (
          <div
            key={product.partNo}
            className={css({
              display: "flex",
              flexDir: "column",
              gap: "0.5rem",
              border: "1px solid",
              borderColor: "gray.200",
              p: "1rem",
              mb: "1rem",
              borderRadius: "md",
            })}
          >
            <h2 className={css({ fontSize: "xl", fontWeight: "bold" })}>
              {product.name}
            </h2>
            <p className={css({ fontSize: "lg" })}>kr {product.price}</p>
            <CartControl product={product} />
          </div>
        ))}
      </div>
    </main>
  );
}
