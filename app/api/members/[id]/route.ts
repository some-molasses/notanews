import { NextRequest } from "next/server";
import { requestBody, response, withAuthentication } from "../../_lib/server";
import { z } from "zod";

export const Role = ["contributor", "editor"] as const;

const MembershipUpdateSchema = z.object({
  role: z.enum(Role),
});

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Context) {
  return withAuthentication(request, async ({ supabase }) => {
    const id = (await params).id;
    const membership = await requestBody(request, MembershipUpdateSchema);
    if (membership.role === "contributor") {
      const { data: current, error: membershipError } = await supabase
        .from("paper_members")
        .select("paper_id")
        .eq("id", id)
        .single();
      if (membershipError) throw membershipError;
      const { count, error: editorsError } = await supabase
        .from("paper_members")
        .select("paper_id", { count: "exact", head: true })
        .eq("paper_id", current.paper_id)
        .eq("type", "editor");
      if (editorsError) throw editorsError;
      if ((count ?? 0) <= 1)
        return response({ error: "not enough remaining editors" }, 400);
    }
    const { data, error } = await supabase
      .from("paper_members")
      .update({ type: membership.role })
      .eq("id", id)
      .select();
    if (error) throw error;
    return response(data);
  });
}
