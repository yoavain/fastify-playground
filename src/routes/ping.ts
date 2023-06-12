import type { FastifyInstance } from "fastify";

export default async (fastify: FastifyInstance, opts) => {
    console.log("ping route");
    fastify.get("/rest/ping", opts, async (request, reply) => {
        return { pong: "it worked!" };
    });
};
