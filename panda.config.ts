import { defineConfig } from "@pandacss/dev";
import { createPreset } from "@park-ui/panda-preset";
import grayColor from "@park-ui/panda-preset/colors/neutral";
import accent from "@park-ui/panda-preset/colors/neutral";

export default defineConfig({
  preflight: true,
  presets: [
    createPreset({ accentColor: accent, grayColor: grayColor, radius: "sm" }),
  ],
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],
  jsxFramework: "react",
  outdir: "styled-system",
});
