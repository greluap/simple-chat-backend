import { MessageModel } from "./model";
import { prisma, type Message } from "../utils";
import { Elysia } from "elysia";
import { Service } from "./service";


let messages: Message[] = [];


new Elysia({prefix: '/messages'})
  .post(
    "/",
    async ({ body, set }) => {

      if (body.content && body.sender != undefined) {
        
        set.status = 201;
        return  await Service.sendMessage({body});

      } else {
        set.status = 400;
        return null;
      }
    },
    { body: MessageModel.MessageSendBody },
  )
  .get("/", async ({ set }) => {
    set.status = 200;
    return Service.getMessages();
  })
  .listen(3000);