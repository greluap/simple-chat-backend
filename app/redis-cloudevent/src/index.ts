import { redis } from "bun";
import { CloudEvent } from "cloudevents";
import { v4 as uuidv4 } from "uuid";

export abstract class RedisFunction {
  static async enqueueMessage(payload: {}, source: string, type: string) {
    const event = new CloudEvent({
      specversion: "1.01",
      type: type,
      source: source,
      id: uuidv4(),
      time: new Date().toISOString(),
      datacontenttype: "application/json",
      data: payload,
    });

    await redis.lpush("message-inbox", JSON.stringify(event));

    return event;
  }
}
