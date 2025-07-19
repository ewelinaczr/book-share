import AddBookOffer from "@/app/home/addOfferPanel/AddBookOffer";
import { Market } from "@/app/home/marketPanel/Market";
import UserOffers from "./userOffersPanel/UserOffers";

export default async function Home() {
  return (
    <>
      <h1>Home</h1>
      <Market />
      <AddBookOffer />
      <UserOffers />
    </>
  );
}
