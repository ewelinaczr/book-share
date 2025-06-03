import booksMock from "@/data/booksMock";

import List from "@/components/list/List";
import AddBookOffer from "@/components/offers/AddBookOffer";

export default async function Home() {
  const res = await fetch("http://localhost:3000/api/csv", {
    cache: "no-store",
  });
  const data = await res.json();

  return (
    <>
      <h1>Home</h1>
      <AddBookOffer />
      <List title="Borrowed" items={booksMock} />
      <List title="Borrowed from Me" items={booksMock} />
      <List title="To Borrow" items={booksMock} />
    </>
  );
}
