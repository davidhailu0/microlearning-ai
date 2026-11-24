import fs from "node:fs";
import path from "node:path";
import { parseSections } from "../lib/ingest";

const cacheDir = path.resolve(__dirname, "../../.cache/books");
const co = fs.readFileSync(path.join(cacheDir, "computer-organization.txt"), "utf8");
const code = fs.readFileSync(path.join(cacheDir, "code-hidden-language.txt"), "utf8");
const hacker = fs.readFileSync(path.join(cacheDir, "hacker-disassembling.txt"), "utf8");

const coSecs = parseSections({ kind: "pdf", text: co });
const codeSecs = parseSections({ kind: "epub", text: code });
const hackSecs = parseSections({ kind: "epub", text: hacker });

console.log("CO sections:", coSecs.length);
coSecs.slice(0, 20).forEach((s,i) => console.log(`  [${i}] ${(s.title||s.text.slice(0,60)).replace(/\n/g,' ')}`));

console.log("\n\nCODE sections:", codeSecs.length);
codeSecs.slice(0, 25).forEach((s,i) => console.log(`  [${i}] ${(s.title||s.text.slice(0,60)).replace(/\n/g,' ')}`));

console.log("\n\nHACKER sections:", hackSecs.length);
hackSecs.slice(0, 25).forEach((s,i) => console.log(`  [${i}] ${(s.title||s.text.slice(0,60)).replace(/\n/g,' ')}`));
