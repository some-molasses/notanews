import { NextRequest } from "next/server";
import { requestBody, response, withAuthentication } from "../../_lib/server";

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
