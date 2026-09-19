import { NextRequest } from "next/server";
import { requestBody, response, withAuthentication } from "../../_lib/server";
import { z } from "zod";

const IssueCreateSchema = z.object({
  issue_name: z.string().min(1),
  paper_id: z.uuid().min(1),
  deadline: z.iso.datetime({ offset: true }),
});

export async function POST(request: NextRequest) {
  return withAuthentication(request, async ({ supabase }) => {
    const issue = await requestBody(request, IssueCreateSchema);
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
