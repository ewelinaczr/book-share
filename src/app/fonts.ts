import { Pacifico } from "next/font/google";
import { Abril_Fatface } from "next/font/google";

export const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
});

export const abrilFatface = Abril_Fatface({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
