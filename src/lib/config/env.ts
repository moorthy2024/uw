export const env = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "QBE Commercial Property AI UW Agent",

  // Backend base URL for all API traffic.
  // UPDATE THIS for each environment (dev/test/prod).
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",

  // Optional timeout and retry controls.
  apiTimeoutMs: Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS ?? "15000"),
  apiRetryCount: Number(process.env.NEXT_PUBLIC_API_RETRY_COUNT ?? "2"),
  chatPersistenceMode: process.env.NEXT_PUBLIC_CHAT_PERSISTENCE_MODE ?? "local",

  // Toggle to connect chat UI to a backend streaming endpoint.
  enableChatStreaming: process.env.NEXT_PUBLIC_ENABLE_CHAT_STREAMING === "true",

  // NextAuth / Azure AD (Entra ID) configuration.
  // These MUST be set in deployment secrets.
  authSecret: process.env.NEXTAUTH_SECRET ?? "",
  entraClientId: process.env.AZURE_AD_CLIENT_ID ?? "",
  entraClientSecret: process.env.AZURE_AD_CLIENT_SECRET ?? "",
  entraTenantId: process.env.AZURE_AD_TENANT_ID ?? "",
};
