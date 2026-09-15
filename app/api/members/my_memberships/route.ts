import { NextRequest } from "next/server";
import { response, withAuthentication } from "../../_lib/server";

export async function GET(request: NextRequest) {
  return withAuthentication(request, async ({ supabase, user }) => {
    const { data, error } = await supabase
      .from("paper_members")
      .select("paper_id")
      .eq("user_id", user.id);
    if (error) throw error;
    return response(data);
  });
}
