import { Elysia } from "elysia";

new Elysia()
    .get('/ping', 'peng')
    .listen(3000)