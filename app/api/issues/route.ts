import { NextRequest } from "next/server";
import { requestBody, response, withAuthentication } from "../_lib/server";

export async function GET(request: NextRequest) {
  return withAuthentication(request, async ({ supabase }) => {
    let query = supabase.from("issues").select("*, papers(name, id)");
    const states = new URL(request.url).searchParams.get("state");
    if (states) query = query.in("state", states.split(","));
    const { data, error } = await query;
    if (error) throw error;
    return response(data);
  });
}

export async function POST(request: NextRequest) {
  return withAuthentication(request, async ({ supabase }) => {
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
  });
}
