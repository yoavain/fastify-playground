# fastify-playground

Learning Fastify — a small TypeScript playground that exercises a handful of Fastify v5 plugins and an Apollo Server v5 GraphQL integration.

## What's wired up

1. Logger (Fastify built-in, writing to `logs/fastify.log`)
2. Apollo Server GraphQL (`@apollo/server` + `@as-integrations/fastify`)
3. Helmet (`@fastify/helmet`)
4. Compress (`@fastify/compress`)
5. Static (`@fastify/static`, serving `src/public/` at `/public/`)
6. AutoLoad (`@fastify/autoload`, auto-registering everything in `src/plugins/` and `src/routes/`)
7. Multipart upload with MIME sniffing (`@fastify/multipart` + `file-type`)

## Running

```bash
npm install
npm start        # ts-node, listens on :3000
npm run build    # emit to dist/
npm run type-check
```

## Endpoints

| Method | Path                  | Source                  |
| ------ | --------------------- | ----------------------- |
| GET    | `/`                   | `src/routes/root.ts`    |
| GET    | `/rest/ping`          | `src/routes/ping.ts`    |
| POST   | `/rest/upload`        | `src/routes/upload.ts`  |
| POST   | `/graphql`            | `src/routes/graphql.ts` |
| GET    | `/public/*`           | `src/plugins/static-files.ts` |

## Requirements

- Node >= 22
- npm >= 10
