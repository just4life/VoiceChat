export const adminGuids = (process.env.ADMIN_GUIDS ?? "")
  .split(",")
  .map((v) => v.trim())
  .filter(Boolean);
