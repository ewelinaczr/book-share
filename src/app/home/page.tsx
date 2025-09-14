import AddBookOffer from "@/app/home/addOfferPanel/AddBookOffer";
import { Market } from "@/app/home/marketPanel/market/Market";
import UserOffers from "./userOffersPanel/UserOffers";
import PickUpPoints from "./marketPanel/pickUpPoints/PickUpPoints";
import MarketStats from "./stats/MarketStats";

export default async function Home() {
  return (
    <>
      <MarketStats />
      <Market />
      {/* <AddBookOffer />
      <PickUpPoints /> */}
      <UserOffers />
    </>
  );
}
