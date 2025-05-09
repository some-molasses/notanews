"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";

/**
 * COPIED FROM SUPABASE DOCUMENTATION
 * https://supabase.com/docs/guides/auth/server-side/nextjs
 */

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error(error);
    redirect("/error");
  }

  // @ts-expect-error layout not recognized
  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard/papers");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.error(error);
    redirect("/error");
  }

  // @ts-expect-error layout not recognized
  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard/papers");
  redirect("/dashboard");
}

// custom from https://supabase.com/docs/guides/auth/signout?queryGroups=language&language=js
export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
    redirect("/error");
  }

  // @ts-expect-error layout not recognized
  revalidatePath("/login", "layout");
  redirect("/login");
}
