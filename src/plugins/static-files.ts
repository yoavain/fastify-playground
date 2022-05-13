import type { PluginMetadata } from "fastify-plugin";
import fastifyPlugin from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";

/**
 * This plugin handles static content serving
 */
module.exports = fastifyPlugin(async (fastify: FastifyInstance, opts: PluginMetadata) => {
    fastify.register(fastifyStatic, {
        root: path.join(__dirname, "..", "public"),
        prefix: "/public/"
    });
});
