import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { guid: "admin-local-guid" },
    create: { guid: "admin-local-guid", nickname: "Admin", role: Role.ADMIN },
    update: { role: Role.ADMIN }
  });
}

main().finally(async () => prisma.$disconnect());
