"use client";

import { useRouter } from "next/navigation";
import { createClient } from "./supabase/client";
import { useEffect, useState } from "react";
import { UserProfile } from "./data-types";
import { fetchApi } from "./queries";
import { useJWT } from "../auth/components/jwt-context";

export const useUser: () => UserProfile | null = () => {
  const supabase = createClient();
  const router = useRouter();
  const jwt = useJWT();

  const [user, setUser] = useState<UserProfile | null>(null);
  useEffect(() => {
    if (!jwt) {
      return;
    }

    if (user) {
      return;
    }

    (fetchApi("/profile", jwt) as Promise<UserProfile>).then(
      (profile: UserProfile) => {
        if (!profile) {
          router.push("/login");
        }

        setUser(profile);
      },
    );
  }, [router, supabase.auth, user, jwt]);

  return user;
};
