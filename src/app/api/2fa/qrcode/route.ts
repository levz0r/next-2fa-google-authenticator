import QRCode from "qrcode";
import speakeasy from "speakeasy";

export async function GET(): Promise<Response> {
  const secret = speakeasy.generateSecret({
    name: "Next.js + Google authenticator",
  });
  const data = await QRCode.toDataURL(secret.otpauth_url as string);
  return Response.json({
    data,
    secret: secret.base32,
  });
}
