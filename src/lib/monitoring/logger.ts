type LogLevel = "debug" | "info" | "warn" | "error";

interface LogPayload {
  message: string;
  context?: Record<string, unknown>;
  error?: unknown;
}

const isProd = process.env.NODE_ENV === "production";

export function appLog(level: LogLevel, payload: LogPayload): void {
  // Replace this hook with Datadog, App Insights, or Sentry transport in production.
  if (isProd && level === "debug") {
    return;
  }

  const output = {
    ts: new Date().toISOString(),
    level,
    ...payload,
  };

  if (level === "error") {
    console.error(output);
    return;
  }

  if (level === "warn") {
    console.warn(output);
    return;
  }

  console.log(output);
}
