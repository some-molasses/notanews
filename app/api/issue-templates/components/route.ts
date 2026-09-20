import { NextRequest } from "next/server";
import { z } from "zod";
import { requestBody, response, withAuthentication } from "../../_lib/server";

const IssueTemplateComponentCreateRequest = z.object({
  components: z.array(
    z.object({
      issue_id: z.uuid(),
      title: z.string(),
      description: z.string().nullable(),
    }),
  ),
});

const IssueTemplateComponentUpdateRequest = z.object({
  components: z.array(
    z.object({
      component_id: z.uuid(),
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
        description,
        issue_templates!inner(issue_id)
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

export async function PATCH(request: NextRequest) {
  return withAuthentication(request, async ({ supabase }) => {
    const components = await requestBody(
      request,
      IssueTemplateComponentUpdateRequest,
    ).then((res) => res.components);

    const updatedComponents = await Promise.all(
      components.map(async (component) => {
        const { data, error } = await supabase
          .from("issue_template_components")
          .update({
            title: component.title,
            description: component.description,
          })
          .eq("id", component.component_id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }),
    );

    return response(updatedComponents);
  });
}
