"use client";

import { createClient } from "@/app/utils/supabase/client";
import { useEffect, useState } from "react";

export const UserEmail: React.FC = () => {
  const [email, setEmail] = useState("");
  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data, error }) => setEmail(data.user?.email ?? "no email"));
  });

  return <span>{email}</span>;
};
