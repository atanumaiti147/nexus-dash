import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Visit /api/auth-check on your live site to see if login is configured correctly.
// It only returns true/false flags - never secret values. Delete this file when login works.
export async function GET() {
  const url = process.env.NEXTAUTH_URL || "";
  let origin = "";
  try {
    origin = new URL(url).origin;
  } catch {}

  return NextResponse.json({
    NEXTAUTH_URL_set: Boolean(url),
    NEXTAUTH_URL_is_https: url.startsWith("https://"),
    NEXTAUTH_URL_has_trailing_slash: url.endsWith("/"),
    NEXTAUTH_SECRET_set: Boolean(process.env.NEXTAUTH_SECRET),
    DISCORD_CLIENT_ID_set: Boolean(process.env.DISCORD_CLIENT_ID),
    DISCORD_CLIENT_SECRET_set: Boolean(process.env.DISCORD_CLIENT_SECRET),
    redirect_uri_to_add_in_discord: origin ? `${origin}/api/auth/callback/discord` : null,
  });
}
