type LogLevel = "debug" | "info" | "warn" | "error";

type LogMeta = Record<string, unknown>;

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const ENV = (process.env.NODE_ENV || "development") as
  | "development"
  | "production"
  | "test";
const CURRENT_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL as LogLevel] ?? LOG_LEVELS.info;

function getCaller(): string {
  const stack = new Error().stack;
  if (!stack) return "";
  const line = stack.split("\n")[4];
  if (!line) return "";
  const match = line.match(/at\s+(?:(.+?)\s+\()?(.+?):(\d+):(\d+)\)?$/);
  if (!match) return "";
  const fn = match[1];
  const file = match[2];
  const lineNum = match[3];
  const shortFile = file.replace(process.cwd() + "/", "");
  const shortFn = fn && fn !== "Object.<anonymous>" ? ` ${fn}` : "";
  return `${shortFile}:${lineNum}${shortFn}`;
}

function formatMessage(
  level: LogLevel,
  message: string,
  error?: Error,
  meta?: LogMeta,
): string {
  const timestamp = new Date().toISOString();
  const caller = getCaller();
  const prefix = `${timestamp} [${level.toUpperCase()}]`;
  const callerStr = caller ? ` (${caller})` : "";

  if (ENV === "production") {
    return JSON.stringify({ timestamp, level, message, caller, error: error?.message, ...meta });
  }

  let output = `${prefix}${callerStr} ${message}`;
  if (meta && Object.keys(meta).length) {
    output += ` ${JSON.stringify(meta)}`;
  }
  if (error) {
    output += `\n${error.stack}`;
  }
  return output;
}

export class LogTracker {
  static debug(message: string, meta?: LogMeta): void {
    if (CURRENT_LEVEL > LOG_LEVELS.debug) return;
    console.debug(formatMessage("debug", message, undefined, meta));
  }

  static info(message: string, meta?: LogMeta): void {
    if (CURRENT_LEVEL > LOG_LEVELS.info) return;
    console.info(formatMessage("info", message, undefined, meta));
  }

  static warn(message: string, error?: Error, meta?: LogMeta): void {
    if (CURRENT_LEVEL > LOG_LEVELS.warn) return;
    console.warn(formatMessage("warn", message, error, meta));
  }

  static error(message: string, error?: Error, meta?: LogMeta): void {
    if (CURRENT_LEVEL > LOG_LEVELS.error) return;
    console.error(formatMessage("error", message, error, meta));
  }
}
