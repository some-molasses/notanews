"use client";

import { fetchApi } from "@/app/utils/queries";
import { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { useJWT } from "./jwt-context";

export const UserContext = createContext<User | null>(null);

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const jwt = useJWT();

  useEffect(() => {
    async function fetchUser() {
      if (!jwt) {
        return;
      }

      if (user) {
        return;
      }

      setUser((await fetchApi("/profile", jwt)) as User);
    }

    fetchUser();
  }, [jwt, user]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
