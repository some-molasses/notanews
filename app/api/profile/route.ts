import { NextRequest } from "next/server";
import { response, withAuthentication } from "../_lib/server";

export async function GET(request: NextRequest) {
  return withAuthentication(request, async ({ user }) => {
    return response({ id: user.id, email: user.email });
  });
}
