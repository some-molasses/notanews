import { redirect } from "next/navigation";
import { createClient } from "./supabase/client";

export const getJWT = async (): Promise<string> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const jwt = sessionData?.session?.access_token;

  if (!jwt) {
    throw new Error(`No jwt found despite user existing?`);
  }

  return jwt;
};
