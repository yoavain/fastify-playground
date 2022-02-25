import type { FastifyInstance, RouteShorthandOptions } from "fastify";
import Fastify from "fastify";

const server: FastifyInstance = Fastify({});

const opts: RouteShorthandOptions = {
    schema: {
        response: {
            200: {
                type: "object",
                properties: {
                    pong: {
                        type: "string"
                    }
                }
            }
        }
    }
};

server.get("/ping", opts, async (request, reply) => {
    return { pong: "it worked!" };
});

const start = async () => {
    try {
        await server.listen(3000);

        const address = server.server.address();
        const port = typeof address === "string" ? address : address?.port;

    }
    catch (err) {
        server.log.error(err);
        // eslint-disable-next-line no-process-exit
        process.exit(1);
    }
};

start().catch(console.error);
