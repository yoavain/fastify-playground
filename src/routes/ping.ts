import type { FastifyInstance } from "fastify";

export default async (fastify: FastifyInstance, opts) => {
    fastify.get("/rest/ping", opts, async (request, reply) => {
        return { pong: "it worked!" };
    });
};
