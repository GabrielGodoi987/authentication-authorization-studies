import { config } from "dotenv";
config({
  debug: true,
});

export const processEnv = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWTACCESSTOKENEXPIRESIN: process.env.JWT_ACCESS_TOKEN_EXPIRESIN,
  JWTREFRESHTOKENEXPIRESIN: process.env.JWT_REFRESH_TOKEN_EXPIRESIN,
};
