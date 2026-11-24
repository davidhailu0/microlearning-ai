import fs from "node:fs";
import path from "node:path";
import { parseSections } from "../lib/ingest";

const CACHE = path.resolve(__dirname, "../../.cache/books");
const which = process.argv[2];
const map: Record<string, { file: string; kind: "pdf" | "epub" }> = {
  co: { file: "computer-organization.txt", kind: "pdf" },
  code: { file: "code-hidden-language.txt", kind: "epub" },
  hacker: { file: "hacker-disassembling.txt", kind: "epub" },
  ddia: { file: "ddia.txt", kind: "epub" },
};
const cfg = map[which];
const text = fs.readFileSync(path.join(CACHE, cfg.file), "utf8");
const sections = parseSections({ kind: cfg.kind, text });
console.log(`sections: ${sections.length}`);
sections.forEach((s, i) => {
  console.log(`${i}\t${s.wordCount}\t${s.title}`);
});
