import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/database.types";

export const response = (data: unknown, status = 200) =>
  NextResponse.json(data, { status });

export function getSupabase(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    throw new Error("Missing bearer token");
  }

  const token = authorization.slice("Bearer ".length).trim();
  if (!token) throw new Error("Missing bearer token");

  return createClient<Database>(
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

export async function withAuthentication(
  request: NextRequest,
  routeFn: ({
    supabase,
  }: {
    supabase: SupabaseClient<Database>;
    user: User;
  }) => Promise<NextResponse>,
): Promise<NextResponse> {
  try {
    const { supabase, user } = await authenticated(request);
    return await routeFn({ supabase, user });
  } catch (error) {
    return handleError(error);
  }
}

export async function withoutAuthentication(
  routeFn: () => Promise<NextResponse> | NextResponse,
): Promise<NextResponse> {
  try {
    return await routeFn();
  } catch (error) {
    return handleError(error);
  }
}
