import { ApolloServer } from "apollo-server-fastify";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import type { ApolloServerPlugin } from "apollo-server-plugin-base";
import type { FastifyInstance } from "fastify";
import { typeDefs } from "~src/graphql/schema";
import { resolvers } from "~src/graphql/resolvers";

const fastifyAppClosePlugin = (app: FastifyInstance): ApolloServerPlugin => {
    return {
        async serverWillStart() {
            return {
                async drainServer() {
                    await app.close();
                }
            };
        }
    };
};

export const startApolloServer = async (server: FastifyInstance): Promise<ApolloServer> => {
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [
            fastifyAppClosePlugin(server),
            ApolloServerPluginDrainHttpServer({ httpServer: server.server })
        ],
        introspection: true
    });

    await apolloServer.start();
    server.log.info("Apollo serer is in " + apolloServer.graphqlPath);
    return apolloServer;
};
