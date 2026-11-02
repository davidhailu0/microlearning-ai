import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { ingestEpub, ingestPdf, parseSections } from "@/lib/ingest";

/**
 * One-off helper: reads the two book files at the repo root with the app's own
 * ingest code, writes their plain text to app/.cache/books/ so they can be
 * read, and prints the detected section structure (the roadmap backbone).
 */

const ROOT = path.resolve(__dirname, "../../..");
const OUT = path.resolve(__dirname, "../../.cache/books");

const BOOKS = [
  {
    id: "zero-day",
    file: path.join(ROOT, "_OceanofPDF.com_From_Day_Zero_to_Zero_Day_-_Eugene_Lim.pdf"),
    kind: "pdf" as const,
  },
  {
    id: "fundamentals",
    file: path.join(ROOT, "_OceanofPDF.com_Fundamentals_of_Software_Architecture_2E_-_Mark_Richards.epub"),
    kind: "epub" as const,
  },
];

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  for (const book of BOOKS) {
    const buffer = fs.readFileSync(book.file);
    const source =
      book.kind === "pdf"
        ? await ingestPdf(buffer, path.basename(book.file))
        : await ingestEpub(buffer, path.basename(book.file));

    const outPath = path.join(OUT, `${book.id}.txt`);
    fs.writeFileSync(outPath, source.text, "utf8");

    const sections = parseSections({
      kind: source.kind,
      text: source.text,
      pageCount: source.pageCount,
    });

    console.log(`\n=== ${source.title}${source.author ? ` — ${source.author}` : ""} ===`);
    console.log(
      `kind=${source.kind} words=${source.wordCount} pages=${source.pageCount ?? "-"} chars=${source.text.length} sections=${sections.length}`,
    );
    console.log(`wrote ${outPath}`);
    for (const section of sections) {
      console.log(
        `  [${section.index}] ${section.title} — ${section.wordCount}w` +
          (section.pageStart ? ` (p.${section.pageStart}–${section.pageEnd})` : ""),
      );
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
