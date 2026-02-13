import {
  CLOUD_EVENT_PATHS,
  CLOUD_EVENT_TYPES,
  prisma,
  redisClient,
  type Message,
} from "../../../utils";
import { RedisFunction } from "../../redis-cloudevent/src";
import type { MessageModel } from "./model";

export abstract class Service {
  static async sendMessage({
    body,
  }: {
    body: (typeof MessageModel.MessageSendBody)["static"];
  }) {
    const message: Message = {
      ...body,
    };

    const sentMessageEvent = await RedisFunction.enqueueMessage(
      message,
      CLOUD_EVENT_PATHS.MESSAGE_SENT,
      CLOUD_EVENT_TYPES.MESSAGE_SENT,
    );

    return sentMessageEvent;
  }

  static async getMessages() {
    const value = await redisClient.get("chat_history");
    let messages: Message[];

    if (!value) {
      const messages = await prisma.message.findMany();

      await redisClient.set("chat_history", JSON.stringify(messages), "EX", 60);
      return messages;
    }

    messages = JSON.parse(value);
    return messages;
  }

  static async deleteAllMessages() {
    const message = await prisma.message.deleteMany();
    await redisClient.del("chat_history");
    return message;
  }
}
