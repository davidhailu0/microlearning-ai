import fs from "node:fs";
import path from "node:path";
import { ingestEpub } from "@/lib/ingest";

/** One-off helper: extracts the DDIA EPUB to .cache/books/ddia.txt. */

const ROOT = path.resolve(__dirname, "../../..");
const OUT = path.resolve(__dirname, "../../.cache/books");

async function main() {
  const file = path.join(
    ROOT,
    "_OceanofPDF.com_Designing_Data-Intensive_Applications_-_Martin_Kleppmann.epub",
  );
  const source = await ingestEpub(fs.readFileSync(file), path.basename(file));
  fs.mkdirSync(OUT, { recursive: true });
  const outPath = path.join(OUT, "ddia.txt");
  fs.writeFileSync(outPath, source.text, "utf8");
  console.log(`title=${source.title} author=${source.author ?? "-"}`);
  console.log(`words=${source.wordCount} chars=${source.text.length}`);
  console.log(`wrote ${outPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
