import { NextRequest } from "next/server";
import { requestBody, response, withAuthentication } from "../../_lib/server";
import { z } from "zod";
import { URL } from "next/dist/compiled/@edge-runtime/primitives/url";

const IssueTemplateComponentCreateRequest = z.object({
  components: z.array(
    z.object({
      issue_id: z.uuid(),
      title: z.string(),
      description: z.string().nullable(),
    }),
  ),
});

export async function GET(request: NextRequest) {
  return withAuthentication(request, async ({ supabase }) => {
    const params = new URL(request.url).searchParams;
    const issue_id = params.get("issue_id");

    if (!issue_id) {
      throw new Error("Missing issue_id");
    }

    let query = supabase
      .from("issue_template_components")
      .select(
        `
        id,
        issue_template_id,
        title,
        body
        issue_templates!inner!null ()
  `,
      )
      .eq("issue_templates.issue_id", issue_id);

    const { data, error } = await query;
    if (error) throw error;
    return response(data);
  });
}

export async function POST(request: NextRequest) {
  return withAuthentication(request, async ({ supabase }) => {
    const components = await requestBody(
      request,
      IssueTemplateComponentCreateRequest,
    ).then((res) => res.components);

    const { data, error } = await supabase
      .from("issue_template_components")
      .insert(components)
      .select()
      .single();
    if (error) throw error;

    return response(data);
  });
}
