import AddBookOffer from "@/app/home/addOfferPanel/AddBookOffer";
import { Market } from "@/app/home/marketPanel/market/Market";
import UserOffers from "./userOffersPanel/UserOffers";
import PickUpPoints from "./marketPanel/pickUpPoints/PickUpPoints";

export default async function Home() {
  return (
    <>
      <Market />
      <AddBookOffer />
      <PickUpPoints />
      <UserOffers />
    </>
  );
}
