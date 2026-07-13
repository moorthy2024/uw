"use client";

import { useEffect } from "react";
import { appLog } from "@/lib/monitoring/logger";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    appLog("error", {
      message: "Unhandled application error boundary",
      error,
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F8] px-6">
      <div className="max-w-lg w-full rounded-xl border border-[#E0DDD8] bg-white p-6">
        <h2 className="text-xl text-[#2D2D2D]" style={{ fontWeight: 600 }}>
          Something went wrong
        </h2>
        <p className="mt-2 text-sm text-[#6D6D69]">
          The application encountered an unexpected error. Please retry the action.
        </p>
        <button
          onClick={() => reset()}
          className="mt-4 px-4 py-2 rounded-lg bg-[#2D2D2D] text-white text-sm hover:bg-[#1E1E1E]"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
