/**
 * Standard Application Error Reporting
 * Captures and logs client and SSR runtime exceptions.
 */

export function reportApplicationError(error: unknown, context: Record<string, unknown> = {}) {
  if (process.env["NODE_ENV"] !== "production") {
    console.error("[Application Error]", error, context);
  }

  // Forward to global error listeners or telemetry if attached
  if (typeof window !== "undefined") {
    const customEvent = new CustomEvent("app:error", {
      detail: { error, context, timestamp: Date.now() },
    });
    window.dispatchEvent(customEvent);
  }
}

// Backward-compatible alias
export const reportLovableError = reportApplicationError;
