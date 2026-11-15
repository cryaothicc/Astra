import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const serverPath = join(root, "dist", "server", "index.js");

if (!existsSync(serverPath)) {
  console.error("dist/server/index.js not found. Run `npm run build` first.");
  process.exit(1);
}

async function prerender() {
  // Import the Vinext server (Cloudflare Worker fetch handler)
  const serverUrl = pathToFileURL(serverPath).href;
  const serverModule = await import(serverUrl);
  const handler = serverModule.default;

  if (!handler || typeof handler.fetch !== "function") {
    throw new Error("Server module does not export a default fetch handler.");
  }

  // Create a request for the root page
  const request = new Request("http://localhost:3000/", {
    method: "GET",
    headers: { "Accept": "text/html" },
  });

  // Mock Cloudflare env and execution context
  const env = {};
  const ctx = {
    props: {},
    waitUntil: (promise) => {
      if (promise && typeof promise.catch === "function") promise.catch(() => {});
    },
    passThroughOnException: () => {},
  };

  const response = await handler.fetch(request, env, ctx);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Prerender failed: ${response.status} ${response.statusText}\n${text.slice(0, 2000)}`
    );
  }

  const html = await response.text();

  if (!html || html.length < 100) {
    throw new Error(`Prerender produced empty or very short HTML (${html.length} chars).`);
  }

  // Write the prerendered HTML to the client output directory
  const outputDir = join(root, "dist", "client");
  mkdirSync(outputDir, { recursive: true });
  writeFileSync(join(outputDir, "index.html"), html, "utf8");

  console.log(`Prerendered index.html written to dist/client/ (${html.length} chars)`);
}

prerender().catch((err) => {
  console.error("Prerender failed:", err);
  process.exit(1);
});
