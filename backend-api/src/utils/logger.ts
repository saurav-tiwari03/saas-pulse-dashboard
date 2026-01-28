/**
 * Simple logger utility
 * Can be extended to use winston, pino, etc.
 */

const isDev = process.env.NODE_ENV === "development";

export const logInfo = (message: string, meta?: unknown): void => {
  console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta ?? "");
};

export const logError = (error: unknown, meta?: unknown): void => {
  const errorMessage =
    error instanceof Error ? error.stack || error.message : String(error);
  console.error(
    `[ERROR] ${new Date().toISOString()} - ${errorMessage}`,
    meta ?? ""
  );
};

export const logWarn = (message: string, meta?: unknown): void => {
  console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta ?? "");
};

export const logDebug = (message: string, meta?: unknown): void => {
  if (isDev) {
    console.debug(
      `[DEBUG] ${new Date().toISOString()} - ${message}`,
      meta ?? ""
    );
  }
};

export default {
  info: logInfo,
  error: logError,
  warn: logWarn,
  debug: logDebug,
};
