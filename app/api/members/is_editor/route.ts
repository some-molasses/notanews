import { NextRequest } from "next/server";
import { authenticated, handleError, response } from "../../_lib/server";

export async function GET(request: NextRequest) {
  try {
    const { supabase, user } = await authenticated(request);
    const { count, error } = await supabase
      .from("paper_members")
      .select("paper_id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("type", "editor");
    if (error) throw error;
    return response({ is_editor: (count ?? 0) > 0 });
  } catch (error) {
    return handleError(error);
  }
}
