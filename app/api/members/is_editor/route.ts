import { NextRequest } from "next/server";
import { response, withAuthentication } from "../../_lib/server";

export async function GET(request: NextRequest) {
  return withAuthentication(request, async ({ supabase, user }) => {
    const { count, error } = await supabase
      .from("paper_members")
      .select("paper_id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("type", "editor");
    if (error) throw error;
    return response({ is_editor: (count ?? 0) > 0 });
  });
}
