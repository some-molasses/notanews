import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const response = (data: unknown, status = 200) =>
  NextResponse.json(data, { status });

export function getSupabase(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    throw new Error("Missing bearer token");
  }

  const token = authorization.slice("Bearer ".length).trim();
  if (!token) throw new Error("Missing bearer token");

  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${token}` } },
    },
  );
}

export async function authenticated(request: NextRequest) {
  const supabase = getSupabase(request);
  const token = request.headers
    .get("authorization")!
    .slice("Bearer ".length)
    .trim();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) throw new Error("Invalid bearer token");
  return { supabase, user: data.user };
}

export async function requestBody(request: NextRequest) {
  return (await request.json()) as Record<string, unknown>;
}

export function handleError(error: unknown) {
  console.error(error);
  return response(
    { error: error instanceof Error ? error.message : "Request failed" },
    401,
  );
}
