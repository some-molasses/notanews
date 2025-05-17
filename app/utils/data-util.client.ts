"use client";

import { useRouter } from "next/navigation";
import { createClient } from "./supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { fetchApi } from "./queries";

export const useUser = () => {
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then((res) => {
      if (!res.data.user) {
        router.push("/login");
      }

      setUser(res.data.user);
    });
  }, []);

  return user;
};
