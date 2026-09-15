import { NextRequest } from "next/server";
import {
  authenticated,
  handleError,
  requestBody,
  response,
} from "../../_lib/server";

export async function POST(request: NextRequest) {
  try {
    const { supabase } = await authenticated(request);
    const issue = await requestBody(request);
    const { data, error } = await supabase
      .from("issues")
      .insert({
        name: issue.issue_name,
        paper_id: issue.paper_id,
        submission_deadline: issue.deadline,
        state: "writing",
        created_at: new Date().toISOString(),
      })
      .select();
    if (error) throw error;
    return response(data);
  } catch (error) {
    return handleError(error);
  }
}
