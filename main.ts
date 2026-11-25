// Unsent: The Micro-Confession Sprint
// Writes the two-part micro-confession in entry.txt to
// $MAKEFUN_OUTPUT_DIR/entry.txt (or /output/entry.txt when unset).
// The grader runs `node main.ts` from the repository root in a sandbox
// with no network, so every path is resolved through import.meta.url
// and the entry text ships in this repository as entry.txt.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const entryPath = join(here, "entry.txt");

const text = await readFile(entryPath, "utf8");
if (!text.trim()) {
  throw new Error("entry.txt is empty");
}
// The gate the bounty seals: UTF-8 text of 1 to 260 characters, not
// only white space. Fail loudly here instead of writing an invalid entry.
if (text.length < 1 || text.length > 260) {
  throw new Error(`entry.txt is ${text.length} characters; gate needs 1-260`);
}
// The bounty format is exactly two parts: a `To:` line and one message
// line, with no explanation. A length-passing entry that lost its `To:`
// line (or collapsed to one line) would still be rejected by the judge,
// so check the shape here too before writing anything.
const parts = text.replace(/\r\n/g, "\n").split("\n").filter((line) => line.trim().length > 0);
if (parts.length !== 2 || !parts[0].startsWith("To: ")) {
  throw new Error("entry.txt must be a `To:` line followed by exactly one message line");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
await mkdir(outDir, { recursive: true });
await writeFile(join(outDir, "entry.txt"), text, "utf8");
console.log(`wrote ${join(outDir, "entry.txt")} (${Buffer.byteLength(text, "utf8")} bytes)`);
