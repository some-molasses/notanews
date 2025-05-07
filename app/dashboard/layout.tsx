import { SideNav } from "../components/side-nav/side-nav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SideNav />
      {children}
    </>
  );
}
