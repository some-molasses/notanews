import { NextRequest } from "next/server";
import { requestBody, response, withAuthentication } from "../_lib/server";
import { z } from "zod";
import { URL } from "next/dist/compiled/@edge-runtime/primitives/url";

const IssueTemplateCreateRequest = z.object({
  issue_id: z.uuid(),
});

export async function GET(request: NextRequest) {
  return withAuthentication(request, async ({ supabase, user }) => {
    let query = supabase.from("issue_templates").select("*");

    const params = new URL(request.url).searchParams;
    const id = params.get("id");
    if (id) {
      query = query.eq("id", id);
    }

    const issue_id = params.get("issue_id");
    if (issue_id) {
      query = query.eq("issue_id", issue_id);
    }

    const { data, error } = await query;
    if (error) throw error;
    return response(data);
  });
}

export async function POST(request: NextRequest) {
  return withAuthentication(request, async ({ supabase, user }) => {
    const now = new Date().toISOString();
    const { issue_id } = await requestBody(request, IssueTemplateCreateRequest);
    const { data, error } = await supabase
      .from("issue_templates")
      .insert({ issue_id })
      .select()
      .single();
    if (error) throw error;
    return response(data);
  });
}
