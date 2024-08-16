import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { kindeAuth: string } },
) {
  const endpoint = params.kindeAuth;
  return handleAuth(req, endpoint);
}
