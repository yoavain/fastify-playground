import type { FastifyInstance } from "fastify";
import type { BaseContext } from "@apollo/server";
import { ApolloServer } from "@apollo/server";
import { fastifyApolloDrainPlugin } from "@as-integrations/fastify";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";


export const startApolloServer = async (fastify: FastifyInstance): Promise<ApolloServer> => {
    const apolloServer: ApolloServer = new ApolloServer<BaseContext>({
        typeDefs,
        resolvers,
        plugins: [fastifyApolloDrainPlugin(fastify)],
        introspection: true
    });
    await apolloServer.start();
    fastify.log.info("Apollo serer started");
    return apolloServer;
};
