export enum Action {
  BORROW = "orange",
  CLAIM = "red",
  TRADE = "green",
}

export interface PointerI {
  lat: number;
  lng: number;
  label: string;
  category: Action;
}
