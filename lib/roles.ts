export type AppRole = "USER" | "MODERATOR" | "ADMIN";

export function roleBadge(role: AppRole) {
  if (role === "ADMIN") return "👑";
  if (role === "MODERATOR") return "🛡️";
  return "•";
}
