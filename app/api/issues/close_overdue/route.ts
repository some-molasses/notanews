import { NextRequest } from "next/server";
import { authenticated, handleError, response } from "../../_lib/server";

export async function POST(request: NextRequest) {
  try {
    const { supabase } = await authenticated(request);
    const { data, error } = await supabase.rpc("close_overdue_issues");
    if (error) throw error;
    return response(data);
  } catch (error) {
    return handleError(error);
  }
}
