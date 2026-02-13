import { MessageModel } from "./model";
import { type Message } from "../../../utils";
import { Elysia } from "elysia";
import { Service } from "./service";
let messages: Message[] = [];

const app = new Elysia({ prefix: "/messages" })
  .post(
    "/",
    async ({ body, set }) => {
      if (body.content && body.sender != undefined) {
        set.status = 202;
        return await Service.sendMessage({ body });
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
  .delete("/", ({ set }) => {
    Service.deleteAllMessages();
    set.status = 200;
  })
  .listen(3000);

console.log(`Server running at ${app.server?.hostname}:${app.server?.port}`);
