import { NextRequest } from "next/server";
import { response, withAuthentication } from "../../_lib/server";

export async function POST(request: NextRequest) {
  return withAuthentication(request, async ({ supabase }) => {
    const { data, error } = await supabase.rpc("close_overdue_issues");
    if (error) throw error;
    return response(data);
  });
}
