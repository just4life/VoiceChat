import bcrypt from "bcryptjs";

export async function hashRoomPassword(password?: string) {
  if (!password) return null;
  return bcrypt.hash(password, 10);
}

export async function verifyRoomPassword(hash: string | null, password?: string) {
  if (!hash) return true;
  if (!password) return false;
  return bcrypt.compare(password, hash);
}
