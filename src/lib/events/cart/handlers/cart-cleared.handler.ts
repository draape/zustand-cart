import { CartCleared } from "../cart-events";

export const handleCartCleared = async (evt: CartCleared) => {
  console.log("handleCartCleared", evt);
};
