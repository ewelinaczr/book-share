import { IconType } from "react-icons";

export interface PickUpSpot {
  icon: IconType;
  name: string;
  adress: string;
  location: [number, number];
  openingHours: string;
  description: string;
  features: Feature[];
  color: string;
}

interface Feature {
  name: string;
  description: string;
}
