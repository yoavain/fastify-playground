# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal learning playground for Fastify (per `README.md`). Not a production app — exploring plugins (Helmet, Compress, Static, AutoLoad, Multipart) and an Apollo Server v5 GraphQL integration.

## Common commands

- `npm run type-check` — `tsc --noEmit` over the validation config (`tsconfig.json`). No lint or test scripts exist.
- `npm run build` — compiles `src/` to `dist/` via `tsconfig.build.json`.
- `npm start` — runs `src/server.ts` directly with `ts-node/register/transpile-only`. The server self-starts and listens on port 3000.
- `npm run start:debug` — same as `start` with `--inspect-brk`.
- `npm run print-routes` — `fastify print-routes dist/server.js` (requires a prior `build`).

`start:fastify` (`fastify start dist/server.js`) is currently broken because `src/server.ts` self-starts instead of exporting a plugin — fastify-cli expects a default-exported async plugin function.

## Architecture

Entry point: `src/server.ts` creates the Fastify instance, registers Helmet + Compress + Multipart inline, then uses `@fastify/autoload` twice — once over `src/plugins/` and once over `src/routes/`. Anything dropped into those two dirs is wired up automatically; you do not register them by hand.

Routes auto-loaded from `src/routes/`:
- `root.ts` → `GET /`
- `ping.ts` → `GET /rest/ping`
- `upload.ts` → `POST /rest/upload` (uses `request.parts()` iterator + `file-type` for MIME sniffing; only `image/jpeg` / `image/png` accepted)
- `graphql.ts` → `POST /graphql` (starts Apollo Server, then mounts `fastifyApolloHandler`)

Plugins auto-loaded from `src/plugins/`:
- `static-files.ts` → serves `src/public/` at `/public/` prefix, wrapped with `fastify-plugin`

GraphQL: `src/graphql/apolloServer.ts` builds an `ApolloServer` with `fastifyApolloDrainPlugin` for graceful shutdown. Schema/resolvers in `src/graphql/{schema,resolvers}.ts`.

## TypeScript config — dual setup

Two configs with intentionally different roles:

- **`tsconfig.json`** — broad `include` covering `src`, `test`, `e2e`, and root-level scripts. `noEmit: true`. Used only by `type-check`. Don't narrow this include even if some paths don't currently exist; they are placeholders for future validation scope.
- **`tsconfig.build.json`** — `include: src/**` only, has `outDir`/`rootDir`, emits. Used by `build`.

TypeScript 6 requires explicit `rootDir`. To satisfy ts-node at runtime without forcing a `rootDir` into the broad validation config, `tsconfig.json` carries a `ts-node.compilerOptions.rootDir = ./src` override — this only affects ts-node, not `tsc`.

## Dependency policy (`.npmrc`)

- `save-exact=true` — versions are pinned, not caret-ranged. Match this style when adding deps.
- `min-release-age=14` — npm will refuse to install packages published in the last 14 days.
- `legacy-peer-deps=true` — peer-dep resolution uses npm 6 semantics.

`file-type` is intentionally pinned to v16.x (the last CJS release). Upgrading to v17+ requires switching `upload.ts` to ESM-style imports (`fileTypeFromStream`) and wrapping Node streams with `Readable.toWeb()`. This pin carries a known moderate-severity vuln ([GHSA-5v7r-6r5c-r473](https://github.com/advisories/GHSA-5v7r-6r5c-r473) — ASF parser infinite loop on malformed input); patched only in v22+. Accepted because this is a learning playground, not production.

`overrides.minimatch` in `package.json` pins the transitive minimatch dep (pulled in by `@typescript-eslint/*` v6) to a patched version, sidestepping multiple ReDoS advisories without upgrading typescript-eslint to v8.
