"use client";

import { createContext, useContext } from "react";

export const JWTContext = createContext<string | null>(null);

export function useJWT() {
  return useContext(JWTContext);
}

export function JWTProvider({
  jwt,
  children,
}: {
  jwt: string;
  children: React.ReactNode;
}) {
  return <JWTContext.Provider value={jwt}>{children}</JWTContext.Provider>;
}
