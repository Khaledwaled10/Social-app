
import { cacheProvider } from "../../../common/cache/init";

const OTP_TTL = 300;

export async function createOtp(email: string, code: string) {
  const key = `otp:${email}`;

  await cacheProvider.set(key, code, OTP_TTL);
}

export async function getOtp(email: string): Promise<string | null> {
  const key = `otp:${email}`;

  return await cacheProvider.get(key);
}

export async function deleteOtp(email: string) {
  const key = `otp:${email}`;

  await cacheProvider.del(key);
}
