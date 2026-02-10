import { prisma } from "../utils";
import type { MessageModel } from "./model";

export abstract class Service {
    static async sendMessage({body}: {body: (typeof MessageModel.MessageSendBody)['static']}) {

        const message = {
          sender: body.sender,
          content: body.content,}        

        const sentMessage = await prisma.message.create({
          data: {
            ...message
          }
        })

        return sentMessage;
    }
    static async getMessages() {
        const messages = await prisma.message.findMany();
        return messages;
    }
}
