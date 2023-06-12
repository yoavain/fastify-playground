export default async (fastify, opts) => {
    console.log("root route");
    fastify.get("/", async (request, reply) => {
        return { root: true };
    });
};
