import booksMock from "@/data/booksMock";

import List from "@/components/list/List";
import AddToBookshelf from "@/components/bookshelf/AddToBookshelf";

export default async function Bookshelf() {
  return (
    <>
      <h1>My Virtual Bookshelf</h1>
      <AddToBookshelf />
      <List title="Currently Reading" items={booksMock} />
      <List title="Want to Read" items={booksMock} />
      <List title="Recommendations" items={booksMock} />
      <List title="Read" items={booksMock} />
    </>
  );
}
