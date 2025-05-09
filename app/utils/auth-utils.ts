import { redirect } from "next/navigation";
import { createClient } from "./supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";

export const getJWT = async (supabase?: SupabaseClient): Promise<string> => {
  if (!supabase) {
    supabase = await createClient();
  }

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

export const redirectIfNotLoggedIn = async (supabase: SupabaseClient) => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    console.error(error, data?.user);
    redirect("/login");
  }
};
