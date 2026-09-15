import { NextRequest } from "next/server";
import { requestBody, response, withAuthentication } from "../_lib/server";

export async function GET(request: NextRequest) {
  return withAuthentication(request, async ({ supabase, user }) => {
    let query = supabase
      .from("articles")
      .select("*, issues(name, papers(name, id))");
    const id = new URL(request.url).searchParams.get("id");
    query = id ? query.eq("id", id) : query.eq("user_id", user.id);
    const { data, error } = await query;
    if (error) throw error;
    return response(data);
  });
}

export async function POST(request: NextRequest) {
  return withAuthentication(request, async ({ supabase, user }) => {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("articles")
      .insert({ user_id: user.id, created_at: now, updated_at: now })
      .select()
      .single();
    if (error) throw error;
    return response(data);
  });
}

export async function PATCH(request: NextRequest) {
  return withAuthentication(request, async ({ supabase }) => {
    const article = await requestBody(request);
    const { data, error } = await supabase
      .from("articles")
      .update({
        title: article.title,
        body: article.body,
        pseudonym: article.pseudonym,
        issue_id: article.issue_id,
        postscript: article.postscript,
        updated_at: new Date().toISOString(),
      })
      .eq("id", article.id)
      .select();
    if (error) throw error;
    return response(data);
  });
}
