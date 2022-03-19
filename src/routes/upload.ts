import type { FastifyInstance } from "fastify";
import * as os from "os";
import path from "path";
import * as fs from "fs";
import { pipeline } from "stream";
import util from "util";
import type { FileTypeResult } from "file-type";
import { fromStream } from "file-type";

const pump = util.promisify(pipeline);

const SUPPORTED_FILE_TYPES = ["image/jpeg", "image/png"];

export default async (fastify: FastifyInstance, opts) => {
    console.log("upload route");
    fastify.post<{ Body: { file: any }; Response: any }>("/rest/upload", async (request, reply) => {
        let count = 0;
        for await (const part of request.parts()) {
            if (part.file) {
                // const buff = await part.toBuffer();
                const filePath = path.join(os.tmpdir(), part.filename);
                await pump(part.file, fs.createWriteStream(filePath));
                const stream = fs.createReadStream(filePath);
                const fileType: FileTypeResult = await fromStream(stream);
                if (fileType.mime !== part.mimetype || !SUPPORTED_FILE_TYPES.includes(fileType.mime)) {
                    throw new Error("Unsupported file type");
                }
                count++;
            }
        }
        return { uploaded: count };
    });
};
