import { NextRequest } from "next/server";
import { response, withAuthentication } from "../_lib/server";

export async function GET(request: NextRequest) {
  return withAuthentication(request, async ({ supabase, user }) => {
    let query = supabase
      .from("papers")
      .select("*, paper_members!inner()")
      .eq("paper_members.user_id", user.id);
    if (new URL(request.url).searchParams.get("subset") === "editable")
      query = query.eq("paper_members.type", "editor");
    const { data, error } = await query;
    if (error) throw error;
    return response(data);
  });
}
