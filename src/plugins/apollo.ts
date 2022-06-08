import type { PluginMetadata } from "fastify-plugin";
import fastifyPlugin from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import type { ApolloServer } from "apollo-server-fastify";
import { startApolloServer } from "../graphql/apolloServer";

/**
 * This plugin handles GraphQL requests via Apollo Server
 */
module.exports = fastifyPlugin(async (fastify: FastifyInstance, opts: PluginMetadata) => {
    const apolloServer: ApolloServer = await startApolloServer(fastify);
    // todo - wait for v4
    // fastify.register(apolloServer.createHandler());
});
