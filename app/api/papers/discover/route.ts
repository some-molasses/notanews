import { NextRequest } from "next/server";
import { response, withAuthentication } from "../../_lib/server";

export async function GET(request: NextRequest) {
  return withAuthentication(request, async ({ supabase }) => {
    const { data, error } = await supabase.from("papers").select("*");
    if (error) throw error;
    return response(data);
  });
}
