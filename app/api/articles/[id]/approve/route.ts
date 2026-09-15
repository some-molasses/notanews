import { NextRequest } from "next/server";
import { response, withAuthentication } from "../../../_lib/server";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Context) {
  return withAuthentication(request, async ({ supabase }) => {
    const { data, error } = await supabase
      .from("articles")
      .update({ state: "approved" })
      .eq("id", (await params).id)
      .select();
    if (error) throw error;
    return response(data);
  });
}
