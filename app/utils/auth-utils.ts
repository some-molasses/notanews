import { redirect } from "next/navigation";
import { SupabaseClient } from "@supabase/supabase-js";

export const getJWT = async (supabase: SupabaseClient): Promise<string> => {
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

// @example url "/papers"
export const fetchApi = async <T>(
  url: string,
  jwt: string,
  options: { method: string },
): Promise<T> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_LOCAL_DOMAIN}/api/${url}`,
    {
      headers: { Authorization: `Bearer ${jwt}` },
      method: options.method,
    },
  );

  if (!res.ok) {
    throw new Error(`Request to ${url} failed`);
  }

  return res.json();
};
