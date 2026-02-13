import { Redis } from "ioredis";
import type { CloudEvent } from "cloudevents";
import { redisClient, prisma, type Message } from "../../../utils";

console.log(`Starting worker...`);

const blockingRedis = new Redis("redis://localhost:6379");

async function runWorker() {
  console.log("worker....");
  while (true) {
    try {
      const result = await blockingRedis.blpop("message-inbox", 0);

      if (result) {
        const eventRaw = result[1];
        const event: CloudEvent = JSON.parse(eventRaw);

        if (event.data) {
          const messageData = event.data as Message;

          console.log("Verarbeite Event ID: " + event.id);

          await prisma.message.create({
            data: { ...messageData },
          });

          await redisClient.del("chat_history");

          console.log("Nachricht gespeichert und Cache invalidiert.");
        }
      }
    } catch (e) {
      console.error("Worker Fehler:", e);
    }
  }
}

runWorker();
