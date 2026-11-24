import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { ingestPdf, ingestEpub } from "../lib/ingest";

async function main() {
  const cacheDir = path.resolve(__dirname, "../../.cache/books");
  fs.mkdirSync(cacheDir, { recursive: true });
  
  // Computer Organization - PDF
  const coPath = path.resolve(__dirname, "../../../Prentice_Hall_Structured_Computer_Organization_6th_Edition_0132916525 (2).pdf");
  console.log("Extracting CO from", coPath);
  const co = await ingestPdf(fs.readFileSync(coPath));
  fs.writeFileSync(path.join(cacheDir, "computer-organization.txt"), co.text);
  console.log("CO extracted:", co.text.length, "chars");
  
  // Code: Hidden Language - EPUB
  const codePath = path.resolve(__dirname, "../../../Code_The_Hidden_Language_of_Computer_Hardware_and_Software,_2nd.epub");
  console.log("Extracting Code from", codePath);
  const code = await ingestEpub(fs.readFileSync(codePath));
  fs.writeFileSync(path.join(cacheDir, "code-hidden-language.txt"), code.text);
  console.log("Code extracted:", code.text.length, "chars");
  
  // Hacker Disassembling - EPUB
  const hackerPath = path.resolve(__dirname, "../../../Hacker_Disassembling_Uncovered_Kris_Kaspersky_z_library_sk,_1lib (2).epub");
  console.log("Extracting Hacker from", hackerPath);
  const hacker = await ingestEpub(fs.readFileSync(hackerPath));
  fs.writeFileSync(path.join(cacheDir, "hacker-disassembling.txt"), hacker.text);
  console.log("Hacker extracted:", hacker.text.length, "chars");
}

main().catch(e => { console.error(e); process.exit(1); });
