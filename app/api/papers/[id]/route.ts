import { NextRequest } from "next/server";
import { response, withAuthentication } from "../../_lib/server";

type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Context) {
  return withAuthentication(request, async ({ supabase }) => {
    const { data, error } = await supabase
      .from("papers")
      .select("*")
      .eq("id", (await params).id)
      .single();
    if (error) throw error;
    return response(data);
  });
}
