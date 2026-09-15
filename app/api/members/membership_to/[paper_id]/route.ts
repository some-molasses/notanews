import { NextRequest } from "next/server";
import { authenticated, handleError, response } from "../../../_lib/server";

type Context = { params: Promise<{ paper_id: string }> };

export async function GET(request: NextRequest, { params }: Context) {
  try {
    const { supabase, user } = await authenticated(request);
    const { data, error } = await supabase
      .from("paper_members")
      .select("type")
      .eq("user_id", user.id)
      .eq("paper_id", (await params).paper_id)
      .maybeSingle();
    if (error) throw error;
    return response(data);
  } catch (error) {
    return handleError(error);
  }
}
