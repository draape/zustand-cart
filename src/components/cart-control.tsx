"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { NumberInput } from "./ui/number-input";

export const CartControl = () => {
  const [showStepper, setShowStepper] = useState(false);
  return (
    <div>
      {showStepper ? (
        <div>
          <h2>Stepper Component</h2>
          <NumberInput
            defaultValue="1"
            min={1}
            max={10}
            step={1}
            onChange={(value) => console.log("Quantity changed:", value)}
          />
        </div>
      ) : (
        <Button onClick={() => setShowStepper(true)}>Add to cart</Button>
      )}
    </div>
  );
};
