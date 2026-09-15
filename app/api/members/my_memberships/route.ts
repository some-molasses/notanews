import { NextRequest } from "next/server";
import { authenticated, handleError, response } from "../../_lib/server";

export async function GET(request: NextRequest) {
  try {
    const { supabase, user } = await authenticated(request);
    const { data, error } = await supabase
      .from("paper_members")
      .select("paper_id")
      .eq("user_id", user.id);
    if (error) throw error;
    return response(data);
  } catch (error) {
    return handleError(error);
  }
}
