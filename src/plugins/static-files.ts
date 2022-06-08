import type { PluginMetadata } from "fastify-plugin";
import fastifyPlugin from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import path from "path";

/**
 * This plugin handles static content serving
 */
module.exports = fastifyPlugin(async (fastify: FastifyInstance, opts: PluginMetadata) => {
    await fastify.register(import("@fastify/static"), {
        root: path.join(__dirname, "..", "public"),
        prefix: "/public/"
    });
});
