import AddBookOffer from "@/app/home/addOfferPanel/AddBookOffer";
import { Market } from "@/app/home/marketPanel/market/Market";
import UserOffers from "./userOffersPanel/UserOffers";
import PickUpPointsMap from "./marketPanel/pickUpPoints/PickUpPointsMap";
import MarketStats from "./stats/MarketStats";

export default async function Home() {
  return (
    <main>
      <AddBookOffer />
      <MarketStats />
      <Market />
      {/*   <PickUpPoints /> */}
      <UserOffers />
    </main>
  );
}
