import { NextRequest } from "next/server";
import { authenticated, handleError, response } from "../../../_lib/server";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Context) {
  try {
    const { supabase } = await authenticated(request);
    const { data, error } = await supabase
      .from("articles")
      .select("*, issues(name, papers(name, id))")
      .eq("state", "approved")
      .eq("issue_id", (await params).id);
    if (error) throw error;
    return response(data);
  } catch (error) {
    return handleError(error);
  }
}
