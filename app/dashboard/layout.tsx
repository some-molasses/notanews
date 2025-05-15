import { SideNav } from "../components/side-nav/side-nav";
import { ClientLayout } from "./layout-client";
import "./layout.scss";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SideNav />
      <main className="right-content">
        {children}
        <ClientLayout />
      </main>
    </>
  );
}
