export default async function Home() {
  console.log(`${process.env.LOCAL_DOMAIN}/api/python`);
  const data = await fetch(`${process.env.LOCAL_DOMAIN}/api/python`).then((r) =>
    r.json(),
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>notanews</h1>
      <div>{JSON.stringify(data)}</div>
    </main>
  );
}
