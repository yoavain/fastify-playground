// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
    clearMocks: true,
    transform: {
        "^.+\\.ts$": "ts-jest"
    },
    testRegex: "(test|e2e)/.*.test.ts$",
    moduleFileExtensions: ["ts", "js", "json", "node"],
    collectCoverage: true,
    coverageReporters: [
        "text",
        "text-summary",
        "json",
        "lcov",
        "clover"
    ],
    collectCoverageFrom: [
        "src/**/*.ts"
    ],
    verbose: true
};

export default config;
