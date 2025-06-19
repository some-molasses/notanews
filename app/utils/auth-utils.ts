import { redirect } from "next/navigation";
import { SupabaseClient } from "@supabase/supabase-js";

export const getJWT = async (supabase: SupabaseClient): Promise<string> => {
  const { data: sessionData } = await supabase.auth.getSession();
  const jwt = sessionData?.session?.access_token;

  if (!jwt) {
    redirect("/login");
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

export const authenticatePage = async (
  supabase: SupabaseClient,
): Promise<{ jwt: string }> => {
  await redirectIfNotLoggedIn(supabase);

  const { data: sessionData } = await supabase.auth.getSession();
  const jwt = sessionData?.session?.access_token;

  if (!jwt) {
    console.error("No JWT");
    redirect("/login");
  }

  return { jwt };
};
