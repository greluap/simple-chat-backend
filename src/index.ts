import { Elysia } from "elysia";
import { MessageModel } from "./model";

type Message = {
  sender: string;
  content: string;
};

let messages: Message[] = [];

new Elysia({prefix: '/messages'})
  .post(
    "/",
    ({ body, set }) => {
      body: body;

      if (body.content && body.sender != undefined && null) {
        const message = {
          sender: body.sender,
          content: body.content,
        };

        messages.push(message);

        set.status = 201;
        return message;
      } else {
        set.status = 400;
        return null;
      }
    },
    { body: MessageModel.MessageSendBody },
  )
  .get("/", ({ set }) => {
    set.status = 200;
    return messages;
  })
  .listen(3000);