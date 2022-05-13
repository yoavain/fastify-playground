import type { FastifyInstance, FastifyServerOptions, RouteShorthandOptions } from "fastify";
import Fastify from "fastify";
import { fastifyHelmet } from "@fastify/helmet";
//import type { FastifyCorsOptions } from "fastify-cors";
//import fastifyCors from "fastify-cors";
import fastifyCompress from "@fastify/compress";
import fastifyMultipart from "@fastify/multipart";
import { fastifyAutoload } from "@fastify/autoload";
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
        fastify.register(fastifyHelmet, { global: true });

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
        fastify.register(fastifyCompress, { threshold: 1024 });

        // Multipart support
        fastify.register(fastifyMultipart, {
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
        fastify.register(fastifyAutoload, {
            dir: path.join(__dirname, "plugins"),
            options: {  ...opts }
        });

        // This loads all plugins defined in routes
        // define your routes in one of these
        fastify.register(fastifyAutoload, {
            dir: path.join(__dirname, "routes"),
            options: {  ...opts }
        });

        await fastify.listen(3000);

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
