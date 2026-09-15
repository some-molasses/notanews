import { NextRequest } from "next/server";
import { authenticated, handleError, response } from "../../../_lib/server";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Context) {
  try {
    const { supabase } = await authenticated(request);
    const { data, error } = await supabase
      .from("articles")
      .update({ state: "approved" })
      .eq("id", (await params).id)
      .select();
    if (error) throw error;
    return response(data);
  } catch (error) {
    return handleError(error);
  }
}
