"use client";

import { getJWT } from "@/app/utils/auth-utils";
import { createClient } from "@/app/utils/supabase/client";
import { createContext, useContext, useEffect, useState } from "react";

export const JWTContext = createContext<string | null>(null);

export function useJWT() {
  return useContext(JWTContext);
}

export function JWTProvider({ children }: { children: React.ReactNode }) {
  const [jwt, setJwt] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJwt() {
      const supabase = await createClient();
      const token = await getJWT(supabase);
      setJwt(token);
    }
    fetchJwt();
  }, []);

  return <JWTContext.Provider value={jwt}>{children}</JWTContext.Provider>;
}
