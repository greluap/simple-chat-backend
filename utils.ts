import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./prisma/generated/client";
import { Redis } from "ioredis";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });
export * from "./prisma/generated/client";

export type Message = {
  sender: string;
  content: string;
};

export const CLOUD_EVENT_TYPES = {
  MESSAGE_SENT: "de.simplechat.message.sent",
};

export const CLOUD_EVENT_PATHS = {
  MESSAGE_SENT: "/api/messages",
};

export const redisClient = new Redis("redis://localhost:6379");
