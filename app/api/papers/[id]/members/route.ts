import { NextRequest } from "next/server";
import { response, withAuthentication } from "../../../_lib/server";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Context) {
  return withAuthentication(request, async ({ supabase }) => {
    const { data, error } = await supabase
      .from("paper_members_detailed")
      .select("*")
      .eq("paper_id", (await params).id);
    if (error) throw error;
    return response(data);
  });
}
