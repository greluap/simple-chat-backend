import {
  client,
  CLOUD_EVENT_PATHS,
  CLOUD_EVENT_TYPES,
  prisma,
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
    const value: string | null = await client.get("chat_history");
    let messages: Message[];

    if (value === null) {
      const messages = await prisma.message.findMany();

      await client.set("chat_history", JSON.stringify(messages), {
        EX: 60,
      });
      return messages;
    }

    messages = JSON.parse(value);
    return messages;
  }

  static async deleteMessage() {
    const message = await prisma.message.deleteMany();
    return message;
  }
}
