export default async function Home() {
  const res = await fetch("http://localhost:3000/api/csv", {
    cache: "no-store",
  });
  const data = await res.json();

  return <h1>Home</h1>;
}
