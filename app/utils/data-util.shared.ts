import { MembershipTypes } from "./data-types";
import { fetchApi } from "./queries";

export const isUserAnEditor = async (paper_id: string, jwt: string) => {
  return (
    (
      (await fetchApi(`/members/membership_to/${paper_id}`, jwt, {
        method: "GET",
      })) as { type: MembershipTypes }
    ).type == "editor"
  );
};
