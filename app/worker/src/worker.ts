import { Redis } from "ioredis";
import type { CloudEvent } from "cloudevents";
import { prisma, type Message } from "../../../utils";

const redis = new Redis(6379, "localhost");

console.log(`Starting worker`);

while (true) {
  const result = await redis.blpop("message-inbox", 0);
  if (result != undefined) {
    const event: CloudEvent = JSON.parse(result[1]);
    if (event.data != undefined) {
      const message: Message = event.data;

      try {
        console.log("Verarbeite Event ID: " + event.id);
        const sentMessage = await prisma.message.create({
          data: {
            ...message,
          },
        });
        console.log("Done");
      } catch (e) {
        console.log("Fehlgeschlagen (fehlerhafter Datensatz) " + e);
      }
    }
  }
}
