import { NextRequest } from "next/server";
import { response, withAuthentication } from "../../../_lib/server";

type Context = { params: Promise<{ paper_id: string }> };

export async function GET(request: NextRequest, { params }: Context) {
  return withAuthentication(request, async ({ supabase, user }) => {
    const { data, error } = await supabase
      .from("paper_members")
      .select("type")
      .eq("user_id", user.id)
      .eq("paper_id", (await params).paper_id)
      .maybeSingle();
    if (error) throw error;
    return response(data);
  });
}
