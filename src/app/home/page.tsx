import booksMock from "@/data/booksMock";

import List from "@/components/list/List";
import AddBookOffer from "@/components/offers/AddBookOffer";
import { MapPanel } from "@/components/mapPanel/MapPanel";

export default async function Home() {
  return (
    <>
      <h1>Home</h1>
      <MapPanel />
      <AddBookOffer />
      <List title="Borrowed" items={booksMock} />
      <List title="Borrowed from Me" items={booksMock} />
      <List title="To Borrow" items={booksMock} />
    </>
  );
}
