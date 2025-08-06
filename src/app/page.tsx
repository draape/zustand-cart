import { CartControl } from "@/components/cart-control";

export default function Home() {
  return (
    <div>
      <main>
        <h1>PDP</h1>
        <div>
          <CartControl />
        </div>
      </main>
      <aside>
        <h2>Cart</h2>
      </aside>
    </div>
  );
}
