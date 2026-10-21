/**
 * @vercel/og (bundled in Next.js) uses path.join(import.meta.url, …) for WASM/fonts.
 * On Windows that produces an invalid file URL and breaks opengraph-image prerender.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const target = join(process.cwd(), "node_modules/next/dist/compiled/@vercel/og/index.node.js");
if (!existsSync(target)) process.exit(0);

const marker = "var __ogDir = fileURLToPath(new URL(\"./\", import.meta.url));";
let src = readFileSync(target, "utf8");
if (src.includes(marker)) process.exit(0);

const broken = `var fontData = fs.readFileSync(fileURLToPath(join(import.meta.url, "../noto-sans-v27-latin-regular.ttf")));
var yoga_wasm = fs.readFileSync(fileURLToPath(join(import.meta.url, "../yoga.wasm")));
var resvg_wasm = fs.readFileSync(fileURLToPath(join(import.meta.url, "../resvg.wasm")));`;

const fixed = `${marker}
var fontData = fs.readFileSync(join(__ogDir, "noto-sans-v27-latin-regular.ttf"));
var yoga_wasm = fs.readFileSync(join(__ogDir, "yoga.wasm"));
var resvg_wasm = fs.readFileSync(join(__ogDir, "resvg.wasm"));`;

if (!src.includes(broken)) {
    console.warn("patch-vercel-og-win: unexpected @vercel/og bundle; skipping");
    process.exit(0);
}

writeFileSync(target, src.replace(broken, fixed), "utf8");
