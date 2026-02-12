import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./prisma/generated/client";
import { createClient, type RedisClientType } from "redis";

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

export const client: RedisClientType = createClient({
  url: "redis://localhost:6379",
});

async function connectRedis(): Promise<void> {
  await client.connect();
  console.log("Successfully connected to Redis");
}
client.on("error", (err: Error) => {
  console.error("Redis connection error:", err);
});
connectRedis().catch(console.error);
