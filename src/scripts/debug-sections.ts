import fs from "node:fs";
import { parseSections } from "@/lib/ingest";

const text = fs.readFileSync(".cache/books/fundamentals.txt", "utf8");
const sections = parseSections({ kind: "epub", text });

console.log("sections:", sections.length);
console.log("raw has ch9 heading:", text.includes("# Chapter 9. Foundations"));
console.log("raw has ch1 heading:", text.includes("# Chapter 1. Introduction"));

for (const [i, s] of sections.entries()) {
  if (s.text.includes("# Chapter 9") || s.title.includes("Chapter 9")) {
    console.log("MATCH idx", i, "| title:", s.title.slice(0, 90));
    console.log("  head:", JSON.stringify(s.text.slice(0, 140)));
  }
}

const ch8 = sections.findIndex((s) => s.text.includes("# Chapter 8."));
console.log("ch8 idx:", ch8, "|", sections[ch8]?.text.slice(0, 110));

const ch9line = text.indexOf("# Chapter 9. Foundations");
console.log("ch9 line context:", JSON.stringify(text.slice(ch9line - 60, ch9line + 60)));
