import { JWTProvider } from "../auth/components/jwt-context";
import { UserProvider } from "../auth/components/user-context";
import { SideNav } from "../components/side-nav/side-nav";
import { getJWT } from "../utils/auth-utils";
import { createClient } from "../utils/supabase/server";
import { ClientLayout } from "./layout-client";
import "./layout.scss";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const jwt = await getJWT(supabase);

  return (
    <>
      <SideNav />
      <main className="right-content">
        <UserProvider>
          <JWTProvider jwt={jwt}>{children}</JWTProvider>
        </UserProvider>
        <ClientLayout />
      </main>
    </>
  );
}
