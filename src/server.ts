import type { FastifyInstance, FastifyServerOptions, RouteShorthandOptions } from "fastify";
import Fastify from "fastify";
import helmet from "fastify-helmet";
import { startApolloServer } from "~src/graphql/apollo";
import type { ApolloServer } from "apollo-server-fastify";

const fastifyServerOptions: FastifyServerOptions = {
    logger: {
        level: "info",
        file: "logs/fastify.log"
    }
};

const fastifyServer: FastifyInstance = Fastify(fastifyServerOptions);

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

fastifyServer.get("/ping", opts, async (request, reply) => {
    return { pong: "it worked!" };
});

const start = async () => {
    try {
        // Helmet
        fastifyServer.register(helmet, { global: true });

        //region Apollo
        const apolloServer: ApolloServer = await startApolloServer(fastifyServer);
        fastifyServer.register(apolloServer.createHandler());
        //endregion Apollo

        await fastifyServer.listen(3000);

        const address = fastifyServer.server.address();
        const port = typeof address === "string" ? address : address?.port;

    }
    catch (err) {
        fastifyServer.log.error(err);
        // eslint-disable-next-line no-process-exit
        process.exit(1);
    }
};

start().catch(console.error);
