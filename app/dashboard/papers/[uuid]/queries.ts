"use client";

import { fetchApi } from "@/app/utils/queries";
import { clearDashboardCacheAction } from "../../article/[uuid]/components/actions";

export const nothing = async () => {};

export const updateRole = async (
  newRole: string,
  membership_id: string,
  jwt: string,
) => {
  await fetchApi(`members/${membership_id}`, jwt, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify({ role: newRole }),
  });

  clearDashboardCacheAction();
};
