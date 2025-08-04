import { ItemAdded } from "../cart-events";

export const handleItemAdded = async (evt: ItemAdded) => {
  console.log("handleItemAdded", evt);
};
