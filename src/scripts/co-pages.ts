import fs from "node:fs";
import path from "node:path";
const text = fs.readFileSync(path.resolve(__dirname, "../../.cache/books/computer-organization.txt"), "utf8");
const pages = text.split(/\[page (\d+)\]/).slice(1);
const out: { page: number; chap: number | null; head: string }[] = [];
for (let i = 0; i < pages.length; i += 2) {
  const num = Number(pages[i]);
  const body = pages[i + 1] ?? "";
  const m = /CHAP\.\s*(\d+)/.exec(body.slice(0, 300));
  const head = body.split("\n").slice(0, 3).join(" | ").slice(0, 90);
  out.push({ page: num, chap: m ? Number(m[1]) : null, head });
}
// summarize chapter -> page range
const ranges = new Map<number, { first: number; last: number }>();
for (const p of out) {
  if (p.chap === null) continue;
  const r = ranges.get(p.chap);
  if (!r) ranges.set(p.chap, { first: p.page, last: p.page });
  else { r.last = p.page; }
}
console.log("total pages:", out.length);
for (const [c, r] of [...ranges.entries()].sort((a, b) => a[0] - b[0])) {
  console.log(`CHAP ${c}: pages ${r.first}-${r.last}`);
}
