import NextAuth, { type NextAuthOptions } from "next-auth";
import { env } from "@/lib/config/env";

function extractRoles(profile: Record<string, unknown> | undefined): string[] {
  if (!profile) {
    return [];
  }

  // Azure AD / Entra commonly emits app roles as "roles".
  const directRoles = Array.isArray(profile.roles) ? profile.roles : [];
  const roleStrings = directRoles.filter((value): value is string => typeof value === "string");

  // Optional mapping: map Entra Group IDs to app roles.
  // UPDATE these env vars to match your Entra group object IDs.
  const managerGroupId = process.env.AZURE_AD_MANAGER_GROUP_ID;
  const underwriterGroupId = process.env.AZURE_AD_UNDERWRITER_GROUP_ID;
  const groupClaims = Array.isArray(profile.groups)
    ? profile.groups.filter((value): value is string => typeof value === "string")
    : [];

  if (managerGroupId && groupClaims.includes(managerGroupId)) {
    roleStrings.push("manager");
  }

  if (underwriterGroupId && groupClaims.includes(underwriterGroupId)) {
    roleStrings.push("underwriter");
  }

  return Array.from(new Set(roleStrings));
}

async function refreshAccessToken(token: any) {
  // Backend integration point:
  // Replace this with your Azure AD token refresh endpoint implementation if long-lived sessions are required.
  return token;
}

export const authOptions: NextAuthOptions = {
  secret: env.authSecret || "development-secret",
  session: {
    strategy: "jwt",
  },
  providers: [],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.idToken = account.id_token;
        token.accessTokenExpiresAt = account.expires_at ? account.expires_at * 1000 : undefined;
        token.userRoles = extractRoles(profile as Record<string, unknown>);
      }

      if (token.accessTokenExpiresAt && Date.now() > Number(token.accessTokenExpiresAt)) {
        return refreshAccessToken(token);
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      session.idToken = token.idToken as string | undefined;
      session.error = token.error as string | undefined;
      if (session.user) {
        session.user.roles = (token.userRoles as string[] | undefined) ?? [];
      }
      return session;
    },
  },
};

export const { handlers, auth } = NextAuth(authOptions);
