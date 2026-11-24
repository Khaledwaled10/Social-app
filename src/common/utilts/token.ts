import jwt from "jsonwebtoken";
import { env } from "../config/env";

interface TokenPayload {
  id: string;
  email: string;
}

export function genrateToken(payload: TokenPayload) {
  const accessToken = jwt.sign(
    payload,
    env.jwt.secretKey,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    payload,
    env.jwt.secretKey,
    { expiresIn: "7d" }
  );

  return {
    accessToken,
    refreshToken,
  };
}