import type { FastifyInstance, FastifyServerOptions, RouteShorthandOptions } from "fastify";
import Fastify from "fastify";
import { fastifyHelmet } from "fastify-helmet";
//import type { FastifyCorsOptions } from "fastify-cors";
//import fastifyCors from "fastify-cors";
import fastifyCompress from "fastify-compress";
import fastifyStatic from "fastify-static";
import { startApolloServer } from "./graphql/apollo";
import type { ApolloServer } from "apollo-server-fastify";
import path from "path";

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

const start = async () => {
    try {
        // Helmet
        fastifyServer.register(fastifyHelmet, { global: true });

        /*
        // Cors
        fastifyServer.register(fastifyCors, (instance: FastifyInstance) => {
            return (req, callback) => {
                const origin = req.headers.origin;
                // do not include CORS headers for requests from localhost
                const hostname = new URL(origin).hostname;
                const corsOptions: FastifyCorsOptions = { origin: hostname !== "localhost" };
                callback(null, corsOptions);
            };
        });
        */

        // Compress
        fastifyServer.register(fastifyCompress, { threshold: 1024 });

        // Static
        fastifyServer.register(fastifyStatic, {
            root: path.join(__dirname, "public"),
            prefix: "/public/"
        });

        // REST
        fastifyServer.get("/ping", opts, async (request, reply) => {
            return { pong: "it worked!" };
        });

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
