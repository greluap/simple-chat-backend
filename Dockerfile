
FROM oven/bun:1
COPY package.json bun.lock ./
RUN bun install
COPY prisma ./prisma/
RUN bunx prisma generate --schema=./prisma/schema.prisma
COPY . .
CMD ["bun", "app/rest/src/index.ts"]