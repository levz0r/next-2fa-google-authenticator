import { type NextRequest } from "next/server";
import speakeasy from "speakeasy";

export async function GET(request: NextRequest): Promise<Response> {
  const searchParams = request.nextUrl.searchParams;

  const verified = speakeasy.totp.verify({
    secret: searchParams.get("secret") as string,
    encoding: "base32",
    token: searchParams.get("token") as string,
  });

  return Response.json({
    verified,
  });
}
