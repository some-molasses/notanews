import { NextRequest } from "next/server";
import { authenticated, handleError, response } from "../_lib/server";

export async function GET(request: NextRequest) {
  try {
    const { user } = await authenticated(request);
    return response({ id: user.id, email: user.email });
  } catch (error) {
    return handleError(error);
  }
}
