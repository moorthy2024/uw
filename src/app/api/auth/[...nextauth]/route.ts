function isLocalhost(request: Request) {
  const host = request.headers.get("host") ?? "";
  return host.startsWith("localhost") || host.startsWith("127.0.0.1") || host.startsWith("[::1]");
}

async function ensureAuthEnv() {
  if (!process.env.NEXTAUTH_SECRET && !process.env.AUTH_SECRET) {
    process.env.NEXTAUTH_SECRET = "development-secret";
  }
  if (!process.env.NEXTAUTH_URL) {
    process.env.NEXTAUTH_URL = "http://localhost:3000";
  }
}

export async function GET(request: Request, context: any) {
  if (isLocalhost(request)) {
    return new Response(JSON.stringify({ ok: true, devAuth: true, message: "Auth bypassed on localhost." }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  await ensureAuthEnv();
  const { authHandler } = await import("@/features/auth/auth-api");
  return authHandler(request, context);
}

export async function POST(request: Request, context: any) {
  if (isLocalhost(request)) {
    return new Response(JSON.stringify({ ok: true, devAuth: true, message: "Auth bypassed on localhost." }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  await ensureAuthEnv();
  const { authHandler } = await import("@/features/auth/auth-api");
  return authHandler(request, context);
}
