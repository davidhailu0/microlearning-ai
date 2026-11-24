import { parseSections } from "../lib/ingest";
import fs from "node:fs";
import path from "node:path";

const CACHE = path.resolve(__dirname, "../../.cache/books");
const zd = parseSections({ kind: "pdf", text: fs.readFileSync(path.join(CACHE, "zero-day.txt"), "utf8") });
const fsa = parseSections({ kind: "epub", text: fs.readFileSync(path.join(CACHE, "fundamentals.txt"), "utf8") });

const out: string[] = [];
out.push("=== ZERO-DAY sections (16) — index 0 is the only uncovered ===");
zd.forEach((s, i) => out.push(`  [${i}] "${(s.title ?? s.text.slice(0, 60)).replace(/\n/g, " ")}"`));

out.push("");
out.push("=== FSA uncovered sections (29 of 55) ===");
const uncovered = [2,4,8,11,12,13,14,17,19,22,24,25,26,27,29,31,33,34,38,39,41,44,45,47,48,50,52,53,54];
for (const i of uncovered) {
  const s = fsa[i];
  out.push(`  [${i}] "${(s?.title ?? s?.text.slice(0, 70) ?? "MISSING").replace(/\n/g, " ")}"`);
}
out.push("");
out.push("=== FSA cited sections (26) ===");
const cited = [0,1,3,5,6,7,9,10,15,16,18,20,21,23,28,30,32,35,36,37,40,42,43,46,49,51];
for (const i of cited) {
  const s = fsa[i];
  out.push(`  [${i}] "${(s?.title ?? s?.text.slice(0, 70) ?? "MISSING").replace(/\n/g, " ")}"`);
}

fs.writeFileSync(path.resolve(__dirname, "../../uncovered.txt"), out.join("\n"));
console.log("done");
