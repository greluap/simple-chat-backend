import { t } from "elysia";

export namespace MessageModel {
  export const MessageSendBody = t.Object({
    sender: t.String(),
    content: t.String(),
  });
}
