import type { FastifyInstance, FastifyServerOptions, RouteShorthandOptions } from "fastify";
import Fastify from "fastify";
import path from "path";

const fastifyServerOptions: FastifyServerOptions = {
    logger: {
        level: "info",
        file: "logs/fastify.log"
    }
};

const fastify: FastifyInstance = Fastify(fastifyServerOptions);

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
        await fastify.register(import("@fastify/helmet"), { global: true });

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
        await fastify.register(import("@fastify/compress"), { threshold: 1024 });

        // Multipart support
        await fastify.register(import("@fastify/multipart"), {
            limits: {
                fieldNameSize: 100, // Max field name size in bytes
                fieldSize: 100,     // Max field value size in bytes
                fields: 10,         // Max number of non-file fields
                fileSize: 10000000,  // For multipart forms, the max file size in bytes
                files: 5,           // Max number of file fields
                headerPairs: 2000   // Max number of header key=>value pairs
            }
        });

        // This loads all plugins defined in plugins
        // those should be support plugins that are reused
        // through your application
        await fastify.register(import("@fastify/autoload"), {
            dir: path.join(__dirname, "plugins"),
            options: {  ...opts }
        });

        // This loads all plugins defined in routes
        // define your routes in one of these
        await fastify.register(import("@fastify/autoload"), {
            dir: path.join(__dirname, "routes"),
            options: {  ...opts }
        });

        await fastify.listen({ port: 3000 });

        const address = fastify.server.address();
        const port = typeof address === "string" ? address : address?.port;
    }
    catch (err) {
        fastify.log.error(err);
        // eslint-disable-next-line no-process-exit
        process.exit(1);
    }
};

start().catch(console.error);
