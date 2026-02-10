import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './packages/prisma/generated/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });
export * from './packages/prisma/generated/client';

export type Message = {
  sender: string;
  content: string;
};

