import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

let dbInstance: any;

if (process.env.DATABASE_URL) {
  dbInstance = globalThis.prisma || new PrismaClient();
  if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = dbInstance;
  }
} else {
  // Mock database client to lay the foundation for PostgreSQL/Prisma
  dbInstance = {
    lead: {
      create: async ({ data }: { data: { name: string; phone: string; city: string; service: string; area: number; totalPrice: number } }) => {
        console.log("[Prisma DB Mock] Lead saved successfully:", data);
        return {
          id: `mock-uuid-${Math.random().toString(36).substring(2, 11)}`,
          ...data,
          createdAt: new Date(),
        };
      },
    },
  };
}

export const db = dbInstance;

