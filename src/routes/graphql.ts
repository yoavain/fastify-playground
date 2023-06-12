import type { FastifyInstance } from "fastify";
import { fastifyApolloHandler } from "@as-integrations/fastify";
import { startApolloServer } from "../graphql/apolloServer";

export default async (fastify: FastifyInstance, opts) => {
    console.log("graphql route");
    const apolloServer = await startApolloServer(fastify);
    fastify.post("/graphql", opts, fastifyApolloHandler(apolloServer));
};
