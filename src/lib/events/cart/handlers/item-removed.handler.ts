import { ItemRemoved } from "../cart-events";

export const handleItemRemoved = async (evt: ItemRemoved) => {
  console.log("handleItemRemoved", evt);
};
