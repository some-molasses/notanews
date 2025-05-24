import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * COPIED FROM SUPABASE DOCUMENTATION
 * https://supabase.com/docs/guides/auth/server-side/nextjs
 */

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // if (options) {
              //   cookieStore.set(options);
              // } else {
              cookieStore.set(name, value);
              // }
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}
