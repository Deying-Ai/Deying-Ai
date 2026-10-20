import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT || 4173);
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
    const requested = pathname === "/" ? "/index.html" : pathname;
    const filePath = normalize(join(root, requested));

    if (!filePath.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) throw new Error("Not a file");
    const content = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": types[extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    response.end(content);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`AI profile running at http://127.0.0.1:${port}`);
});
