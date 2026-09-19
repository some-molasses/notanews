import { NextRequest } from "next/server";
import { response, withAuthentication } from "../_lib/server";
import { IssueStateSchema } from "@/app/utils/data-types";
import z from "zod";

export async function GET(request: NextRequest) {
  return withAuthentication(request, async ({ supabase }) => {
    let query = supabase.from("issues").select("*, papers(name, id)");

    const states = new URL(request.url).searchParams.get("state");
    if (states) {
      const parsedStates = z.array(IssueStateSchema).parse(states.split(","));
      query = query.in("state", parsedStates);
    }

    const { data, error } = await query;
    if (error) throw error;
    return response(data);
  });
}
