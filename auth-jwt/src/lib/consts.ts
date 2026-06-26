import { config } from "dotenv";

config({
  debug: process.env.DOTENV_DEBUG === "true",
  quiet: process.env.NODE_ENV === "test",
});

export const processEnv = {
  JWT_SECRET: process.env.JWT_SECRET!,
  PORT: process.env.PORT,
  JWT_ACCESS_TOKEN_EXPIRESIN: process.env.JWT_ACCESS_TOKEN_EXPIRESIN!,
  JWT_REFRESH_TOKEN_EXPIRESIN: process.env.JWT_REFRESH_TOKEN_EXPIRESIN!,
  JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY!.replace(/\\n/g, "\n"),
  JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY!.replace(/\\n/g, "\n"),
  NODE_ENV: process.env.NODE_ENV!,
};
