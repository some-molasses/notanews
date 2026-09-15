import { NextResponse } from "next/server";
import { withoutAuthentication } from "../../_lib/server";

export function GET() {
  return withoutAuthentication(() =>
    NextResponse.json({ error: "Not implemented" }, { status: 501 }),
  );
}
