"use client";

import { fetchApi } from "@/app/utils/queries";
import { clearDashboardCacheAction } from "../../article/[uuid]/components/actions";
import { PaperMember, PaperMemberDetailed } from "@/app/utils/data-types";

export const nothing = async () => {};

export const updateRole = async (
  newRole: string,
  membership_id: string,
  jwt: string,
) => {
  const updatedMembership: PaperMember[] = await fetchApi(
    `members/${membership_id}`,
    jwt,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify({ role: newRole }),
    },
  );

  if (updatedMembership.length === 0) {
    throw new Error(`Failed to update`);
  }

  clearDashboardCacheAction();
};
