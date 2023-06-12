import type { FastifyInstance } from "fastify";
import * as os from "os";
import path from "path";
import * as fs from "fs";
import { pipeline } from "stream";
import util from "util";
import type { FileTypeResult } from "file-type";
import { fromStream } from "file-type";
import type { MultipartFile } from "@fastify/multipart";

const pump = util.promisify(pipeline);

const SUPPORTED_FILE_TYPES = ["image/jpeg", "image/png"];

type FileUploadResponse = {
    filesReceived: number
    filesAccepted: number
    errors: string[]
}

export default async (fastify: FastifyInstance, opts) => {
    console.log("upload route");
    fastify.post<{ Body: any; Response: FileUploadResponse }>("/rest/upload", async (request, reply) => {
        let filesReceived = 0;
        let filesAccepted = 0;
        const errors = [];
        for await (const part of request.parts()) {
            const { file, filename } = part as MultipartFile;
            if (file) {
                filesReceived++;
                // Save to temp file
                const filePath = path.join(os.tmpdir(), filename);
                await pump(file, fs.createWriteStream(filePath));
                // Parse actual file type
                const stream = fs.createReadStream(filePath);
                const fileType: FileTypeResult = await fromStream(stream);

                // Input validation
                if (!SUPPORTED_FILE_TYPES.includes(fileType.mime)) {
                    const message = `Unsupported file type ${fileType.mime}`;
                    fastify.log.error(message);
                    errors.push(message);
                }
                else if (fileType.mime !== part.mimetype) {
                    const message = `Mismatching file type. Sent: ${part.mimetype} Actual: ${fileType.mime}`;
                    fastify.log.error(message);
                    errors.push(message);
                }
                else {
                    filesAccepted++;
                }
            }
        }
        if (filesReceived === 0) {
            throw new Error("No files were received");
        }
        if (filesAccepted === 0) {
            throw new Error(`No files uploaded. Errors: ${errors.join("; ")}`);
        }
        return { filesReceived, filesAccepted, errors };
    });
};
