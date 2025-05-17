"use client";

import { createClient } from "@/app/utils/supabase/client";
import { useEffect, useState } from "react";
import { Row } from "../../layout/layout-components";

// source: chatgpt
function stringToColour(str: string) {
  // Generate a hash from the string
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert hash to hex color
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + value.toString(16)).slice(-2);
  }

  return colour;
}

export const UserProfile: React.FC = () => {
  const [email, setEmail] = useState("");
  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data, error }) => setEmail(data.user?.email ?? "no email"));
  });

  if (!email) {
    return null;
  }

  return (
    <Row className="user-profile">
      <div
        className="user-profile-pic"
        style={{ background: stringToColour(email) }}
      ></div>
      <span className="user-email">{email}</span>
    </Row>
  );
};
