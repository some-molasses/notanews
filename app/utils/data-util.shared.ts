import { MembershipTypes } from "./data-types";
import { fetchApi } from "./queries";

export const isUserAnEditor = async (
  paper_id: string | undefined,
  jwt: string,
) => {
  if (!paper_id) {
    return false;
  }

  return (
    (
      (await fetchApi(`/members/membership_to/${paper_id}`, jwt, {
        method: "GET",
      })) as { type: MembershipTypes }
    )?.type == "editor"
  );
};
