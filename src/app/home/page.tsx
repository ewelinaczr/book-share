import AddBookOffer from "@/app/home/addOfferPanel/AddBookOffer";
import Market from "@/app/home/marketPanel/market/Market";
import UserOffers from "./userOffersPanel/UserOffers";
import MarketStats from "./stats/MarketStats";
import { getSession } from "next-auth/react";

export default async function Home() {
  const session = await getSession();
  const user = session?.user;

  return (
    <main>
      {user ? <AddBookOffer /> : null}
      <MarketStats />
      <Market />
      <UserOffers />
    </main>
  );
}
