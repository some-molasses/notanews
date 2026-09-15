import { NextRequest } from "next/server";
import { authenticated, handleError, response } from "../../_lib/server";

export async function GET(request: NextRequest) {
  try {
    const { supabase } = await authenticated(request);
    const { data, error } = await supabase.from("papers").select("*");
    if (error) throw error;
    return response(data);
  } catch (error) {
    return handleError(error);
  }
}
