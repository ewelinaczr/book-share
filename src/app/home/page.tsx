import AddBookOffer from "@/app/home/addOffer/AddBookOffer";
import { Market } from "@/app/home/market/Market";
import UserOffers from "./userOffers/UserOffers";

export default async function Home() {
  return (
    <>
      <Market />
      <AddBookOffer />
      <UserOffers />
    </>
  );
}
