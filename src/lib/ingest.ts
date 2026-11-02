import dns from "node:dns/promises";
import net from "node:net";
import path from "node:path";
import AdmZip from "adm-zip";
import { XMLParser } from "fast-xml-parser";
import { load } from "cheerio";
import { Readability } from "@mozilla/readability";
import { parseHTML } from "linkedom";
import { env } from "./env";

export type IngestedSource = {
  kind: "prompt" | "text" | "url" | "pdf" | "epub";
  title: string;
  author?: string;
  url?: string;
  text: string;
  wordCount: number;
  pageCount?: number;
};

export class IngestError extends Error {
  constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
    this.name = "IngestError";
  }
}

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/* --------------------------------------------------------------- URL / SSRF */

function isPrivateIp(ip: string) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127)
    );
  }

  if (net.isIPv6(ip)) {
    const value = ip.toLowerCase();
    return (
      value === "::1" ||
      value === "::" ||
      value.startsWith("fc") ||
      value.startsWith("fd") ||
      value.startsWith("fe80")
    );
  }

  return true;
}

async function assertPublicUrl(raw: string) {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new IngestError("That doesn't look like a valid URL.", "url_invalid");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new IngestError("Only http and https links are supported.", "url_scheme");
  }

  if (env.allowPrivateUrls) return url;

  const host = url.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    host === "metadata.google.internal"
  ) {
    throw new IngestError("Private network addresses are blocked.", "url_private");
  }

  if (net.isIP(host)) {
    if (isPrivateIp(host)) {
      throw new IngestError("Private network addresses are blocked.", "url_private");
    }
    return url;
  }

  const addresses = await dns.lookup(host, { all: true, verbatim: true });
  if (!addresses.length || addresses.some((a) => isPrivateIp(a.address))) {
    throw new IngestError("Private network addresses are blocked.", "url_private");
  }

  return url;
}

async function safeFetch(rawUrl: string) {
  let current = await assertPublicUrl(rawUrl);

  for (let hop = 0; hop <= 5; hop++) {
    const response = await fetch(current, {
      redirect: "manual",
      signal: AbortSignal.timeout(30_000),
      headers: {
        "user-agent": "Lumen/1.0 (+micro-learning reader)",
        accept: "text/html,application/xhtml+xml",
      },
    });

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) throw new IngestError("The link redirected nowhere.", "url_redirect");
      current = await assertPublicUrl(new URL(location, current).toString());
      continue;
    }

    if (!response.ok) {
      throw new IngestError(
        response.status === 401 || response.status === 403
          ? "That page is behind a login or paywall. Open access only."
          : `The site returned ${response.status}.`,
        "url_fetch_failed",
      );
    }

    const type = response.headers.get("content-type") ?? "";
    if (!type.includes("html") && !type.includes("text")) {
      throw new IngestError("That link is not an HTML article.", "url_content_type");
    }

    const length = Number(response.headers.get("content-length") ?? 0);
    if (length > 5_000_000) {
      throw new IngestError("That page is too large (5 MB limit).", "url_too_large");
    }

    const html = (await response.text()).slice(0, 5_000_000);
    return { html, url: current.toString() };
  }

  throw new IngestError("Too many redirects.", "url_redirect_loop");
}

export async function ingestUrl(rawUrl: string): Promise<IngestedSource> {
  const { html, url } = await safeFetch(rawUrl);
  const { document } = parseHTML(html);

  // Readability mutates the document; give it a base URI for relative links.
  try {
    Object.defineProperty(document, "documentURI", { value: url });
  } catch {
    /* linkedom may already define it */
  }

  const reader = new Readability(document as unknown as Document);
  const article = reader.parse();

  const text = article?.textContent?.replace(/\n{3,}/g, "\n\n").trim() ?? "";
  if (countWords(text) < 120) {
    throw new IngestError(
      "We couldn't find a readable article at that link. It may be JavaScript-rendered or paywalled.",
      "url_not_readable",
    );
  }

  return {
    kind: "url",
    title: article?.title?.trim() || new URL(url).hostname,
    author: article?.byline?.trim() || undefined,
    url,
    text,
    wordCount: countWords(text),
  };
}

/* --------------------------------------------------------------------- PDF */

export async function ingestPdf(
  buffer: Buffer,
  filename = "document.pdf",
): Promise<IngestedSource> {
  const { extractText, getDocumentProxy } = await import("unpdf");
  const bytes = new Uint8Array(buffer);

  let doc: Awaited<ReturnType<typeof getDocumentProxy>>;
  try {
    doc = await getDocumentProxy(bytes);
  } catch {
    throw new IngestError("This PDF is damaged or encrypted.", "pdf_invalid");
  }

  const pagesTotal = doc.numPages;
  if (pagesTotal > 1000) {
    throw new IngestError("This PDF has more than 1,000 pages.", "pdf_too_many_pages");
  }

  let title = filename.replace(/\.pdf$/i, "");
  try {
    const meta = await doc.getMetadata();
    const info = meta.info as Record<string, unknown> | undefined;
    if (typeof info?.Title === "string" && info.Title.trim()) title = info.Title.trim();
  } catch {
    /* metadata is optional */
  }

  const result = await extractText(doc, { mergePages: false });
  const pages = Array.isArray(result.text) ? result.text : [result.text];
  const text = pages
    .map((page, index) => `[page ${index + 1}]\n${page.trim()}`)
    .join("\n\n")
    .trim();

  if (countWords(text) < 60) {
    throw new IngestError(
      "No readable text found. This looks like a scan — OCR isn't enabled in this build.",
      "pdf_empty",
    );
  }

  return {
    kind: "pdf",
    title,
    text,
    wordCount: countWords(text),
    pageCount: pagesTotal,
  };
}

/* -------------------------------------------------------------------- EPUB */

function asArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export async function ingestEpub(
  buffer: Buffer,
  filename = "book.epub",
): Promise<IngestedSource> {
  let zip: AdmZip;
  try {
    zip = new AdmZip(buffer);
  } catch {
    throw new IngestError("This EPUB is not a valid ZIP archive.", "epub_invalid");
  }

  const entries = zip.getEntries();
  if (entries.length > 5000) {
    throw new IngestError("This EPUB contains too many files.", "epub_too_large");
  }
  const totalSize = entries.reduce((sum, entry) => sum + entry.header.size, 0);
  if (totalSize > 100 * 1024 * 1024) {
    throw new IngestError("This EPUB is larger than 100 MB.", "epub_too_large");
  }
  if (zip.getEntry("META-INF/encryption.xml")) {
    throw new IngestError("This EPUB is DRM-protected.", "epub_drm");
  }

  const containerEntry = zip.getEntry("META-INF/container.xml");
  if (!containerEntry) throw new IngestError("Missing EPUB container.", "epub_invalid");

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });

  const container = parser.parse(containerEntry.getData().toString("utf8"));
  const rootfile = asArray(container?.container?.rootfiles?.rootfile)[0];
  const opfPath = rootfile?.["@_full-path"];
  if (!opfPath) throw new IngestError("Missing EPUB package document.", "epub_invalid");

  const opfEntry = zip.getEntry(opfPath);
  if (!opfEntry) throw new IngestError("Missing OPF file.", "epub_invalid");

  const opf = parser.parse(opfEntry.getData().toString("utf8"));
  const pkg = opf?.package;
  if (!pkg) throw new IngestError("Unreadable EPUB package.", "epub_invalid");

  const manifest = new Map<string, string>();
  for (const item of asArray(pkg?.manifest?.item)) {
    if (item?.["@_id"] && item?.["@_href"]) {
      manifest.set(item["@_id"], item["@_href"]);
    }
  }

  const baseDir = path.posix.dirname(opfPath);
  const spine = asArray(pkg?.spine?.itemref)
    .map((ref) => manifest.get(ref?.["@_idref"]))
    .filter((href): href is string => Boolean(href));

  const titleMeta = pkg?.metadata?.["dc:title"];
  const title =
    (typeof titleMeta === "string" ? titleMeta : titleMeta?.["#text"]) ||
    filename.replace(/\.epub$/i, "");

  const authorMeta = pkg?.metadata?.["dc:creator"];
  const author =
    typeof authorMeta === "string" ? authorMeta : authorMeta?.["#text"] ?? undefined;

  const chunks: string[] = [];
  for (const href of spine) {
    const clean = href.split("#")[0];
    const entry = zip.getEntry(path.posix.join(baseDir, clean));
    if (!entry) continue;

    const $ = load(entry.getData().toString("utf8"));
    $("script, style, nav, svg").remove();

    const parts: string[] = [];
    $("h1, h2, h3, h4, p, li, blockquote, figcaption").each((_, element) => {
      const node = $(element);
      const value = node.text().replace(/\s+/g, " ").trim();
      if (!value) return;
      const tag = (element as { tagName?: string }).tagName?.toLowerCase();
      if (tag && /^h[1-4]$/.test(tag)) parts.push(`\n\n${"#".repeat(Number(tag[1]))} ${value}`);
      else parts.push(value);
    });

    const section = parts.join("\n").trim();
    if (section.split(/\s+/).length > 20) chunks.push(section);
  }

  const text = chunks.join("\n\n").trim();
  if (countWords(text) < 60) {
    throw new IngestError("No readable text found in this EPUB.", "epub_empty");
  }

  return {
    kind: "epub",
    title: title.trim(),
    author: author?.trim(),
    text,
    wordCount: countWords(text),
  };
}

export function ingestPlainText(text: string, title = "Pasted text"): IngestedSource {
  const trimmed = text.trim();
  if (countWords(trimmed) < 30) {
    throw new IngestError("Add at least a few paragraphs of text.", "text_too_short");
  }
  return {
    kind: "text",
    title,
    text: trimmed,
    wordCount: countWords(trimmed),
  };
}

/* --------------------------------------------------------------- sections */

/**
 * A chapter/section-sized slice of the source. Book mode generates from these
 * instead of a sampled digest, which is what makes whole-book coverage honest:
 * every section must be assigned to at least one lesson.
 */
export type SourceSection = {
  index: number;
  title: string;
  text: string;
  wordCount: number;
  pageStart?: number;
  pageEnd?: number;
};

/** Keep each section small enough to send to a model on its own. */
const MAX_SECTION_WORDS = 9_000;
const MIN_SECTION_WORDS = 220;

type RawSection = {
  title: string;
  pages: { number: number; body: string }[];
  text: string;
};

const TOC_LINE = /\.{2,}\s*\d+\s*$/;
const NUMBER_WORDS =
  "one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty";

function pdfPages(text: string) {
  const pages: { number: number; body: string }[] = [];
  const marker = /\[page (\d+)\]/g;
  let match: RegExpExecArray | null;
  let start = 0;
  let pageNumber = 0;

  while ((match = marker.exec(text))) {
    if (pageNumber > 0) {
      pages.push({ number: pageNumber, body: text.slice(start, match.index).trim() });
    }
    pageNumber = Number(match[1]);
    start = marker.lastIndex;
  }

  if (pageNumber > 0) {
    pages.push({ number: pageNumber, body: text.slice(start).trim() });
  }

  if (pages.length === 0) return [{ number: 1, body: text.trim() }];
  return pages;
}

type TocEntry = {
  kind: "chapter" | "part" | "other";
  key: string;
  title: string;
};

const STRUCTURAL_START =
  /^(chapter|part|appendix|introduction|foreword|preface|prologue|epilogue|conclusion|afterword|index|contents|table of contents)\b/i;

/** Code listings and tables use these; a chapter title never does. */
const CODE_SIGNAL = /#|;|=|\||\/\/|[{}<>\\]|∑|∂|π|∏/;
const TITLE_TAIL =
  /\b(?:of|and|the|to|in|for|with|by|on|at|from|that|which|is|are|was|were|as|but|or|a|an)$/i;
const SMALL_WORD =
  /^(?:a|an|and|as|at|but|by|for|from|in|into|of|on|or|over|the|to|with|without|via|vs)$/i;
const KNOWN_DISPLAY =
  /^(INTRODUCTION|CONTENTS|FOREWORD|PREFACE|PROLOGUE|EPILOGUE|CONCLUSION|AFTERWORD|APPENDIX|INDEX)$/;

function cleanLine(line: string) {
  return line.replace(/\s+/g, " ").trim();
}

/**
 * Display type is extracted as single letters ("1T A I N T A N A L Y S I S").
 * Collapse that back to a token so the chapter number can be read.
 */
function collapseDisplay(line: string) {
  const tokens = line.split(" ").filter(Boolean);
  if (tokens.length < 5) return line;
  const singles = tokens.filter(
    (token) => token.length === 1 && /[A-Za-z]/.test(token),
  ).length;
  if (singles / tokens.length < 0.55) return line;
  return tokens.join(" ").replace(/(?<=\b[A-Za-z])\s+(?=[A-Za-z]\b)/g, "");
}

function titleLike(text: string) {
  const words = text.split(/\s+/).filter(Boolean);
  if (
    words.length === 0 ||
    words.length > 10 ||
    text.length > 90 ||
    CODE_SIGNAL.test(text) ||
    TITLE_TAIL.test(text)
  ) {
    return false;
  }

  // A wrapped body sentence ("... Delves into more advanced reverse") carries
  // ordinary lowercase words. Title case keeps only small words lowercase.
  const prose = words.filter(
    (word, index) =>
      index > 0 && /^[a-z]/.test(word) && !SMALL_WORD.test(word.replace(/[^A-Za-z]/g, "")),
  ).length;

  return prose === 0;
}

function tocEntryFromLine(line: string): TocEntry | null {
  const cleaned = cleanLine(line)
    .replace(TOC_LINE, "")
    .replace(/\s+\d{1,4}$/, "")
    .trim();

  const chapter = new RegExp(
    `^(chapter|part|appendix)\\s+([0-9]{1,2}|[ivxlcdm]{1,6}|(?:${NUMBER_WORDS}))\\b\\s*[:.\\-–—]?\\s*(.*)$`,
    "i",
  ).exec(cleaned);

  if (chapter) {
    return {
      kind: chapter[1].toLowerCase() === "chapter" ? "chapter" : "part",
      key: chapter[2].toLowerCase(),
      title: chapter[3].replace(/\s+\d{1,4}$/, "").trim(),
    };
  }

  const plain =
    /^(introduction|foreword|preface|prologue|epilogue|conclusion|afterword|appendix|index|contents)$/i.exec(
      cleaned,
    );
  if (plain) return { kind: "other", key: plain[1].toLowerCase(), title: "" };

  return null;
}

/**
 * A contents page: many structural lines and little prose. Returns the lines
 * worth parsing as TOC entries, or null when the page is body text.
 */
function readTocPage(body: string, pageNumber: number) {
  const lines = body.split("\n").map(cleanLine).filter(Boolean);
  if (lines.length === 0) return null;

  const structural = lines.filter((line) => STRUCTURAL_START.test(line));
  const dotted = lines.filter((line) => TOC_LINE.test(line)).length;
  const ratio = structural.length / lines.length;

  const isToc =
    dotted >= 4 ||
    (structural.length >= 5 && ratio >= 0.5 && countWords(body) < 500) ||
    (pageNumber <= 8 && /^(contents|table of contents)$/i.test(lines[0] ?? ""));

  if (!isToc) return null;
  return structural.length > 0 ? structural : lines;
}

/**
 * Read only the top of a page, and only when the candidate is a real heading:
 * display type, "Chapter N", or a numbered section. Code listings, table
 * headers and body sentences that merely start with "Chapter 5" are rejected.
 */
function pdfChapterHeading(body: string, toc: TocEntry[]): string | null {
  // Read one line past the candidates so a wrapped heading can be recognised
  // by its lowercase continuation, but only the first three lines may become
  // a heading themselves.
  const lines = body.split("\n").map(cleanLine).filter(Boolean).slice(0, 4);

  const isContinuation = (index: number) => /^[a-z,;:)]/.test(lines[index + 1] ?? "");

  const chapterTitle = (inline: string, number: string) => {
    const entry = toc.find((item) => item.kind === "chapter" && item.key === number);
    const display = /^[A-Z0-9\s'’:,\-–—&.]+$/.test(inline);
    const title = entry?.title && (!inline || display) ? entry.title : inline;
    return title ? `Chapter ${number}: ${title}` : `Chapter ${number}`;
  };

  for (const [index, raw] of lines.entries()) {
    if (index > 2) break;
    if (!raw || raw.length > 110 || CODE_SIGNAL.test(raw)) continue;
    const line = collapseDisplay(raw);

    const chapter = /^chapter\s+([0-9]{1,2}|[ivxlcdm]{1,6})\b\s*[:.\-–—]?\s*(.*)$/i.exec(line);
    if (chapter) {
      const inline = chapter[2].trim();
      const number = String(Number(chapter[1]));
      const entry = toc.find((item) => item.kind === "chapter" && item.key === number);

      // A wrapped summary line has a lowercase next line. Trust the TOC title
      // when it knows the chapter; otherwise this is body text, not a heading.
      if (inline && !titleLike(inline) && (isContinuation(index) || !entry?.title)) {
        continue;
      }

      const display = /^[A-Z0-9\s'’:,\-–—&.]+$/.test(inline);
      const title =
        entry?.title && (!inline || display || !titleLike(inline))
          ? entry.title
          : inline;
      return title ? `Chapter ${number}: ${title}` : `Chapter ${number}`;
    }

    // Letter-spaced display headings collapse to one token.
    if (line !== raw && KNOWN_DISPLAY.test(line)) {
      return line[0] + line.slice(1).toLowerCase();
    }

    const part = new RegExp(
      `^part\\s+([ivxlcdm]{1,6}|[0-9]{1,2}|(?:${NUMBER_WORDS}))\\b\\s*[:.\\-–—]?\\s*(.*)$`,
      "i",
    ).exec(line);
    if (part) {
      // A part divider is a sparse page; a body paragraph can start "Part I…".
      if (countWords(body) > 150) continue;
      const inline = part[2].trim();
      if (inline && !titleLike(inline)) continue;
      const label = part[1].toUpperCase();
      return inline ? `Part ${label}: ${inline}` : `Part ${label}`;
    }

    const numbered = /^([0-9]{1,2}|[ivxlcdm]{1,6})[.)]?\s+([A-Z][^.!?]{2,80})$/.exec(line);
    if (numbered && titleLike(numbered[2]) && !isContinuation(index)) {
      const key = /^\d+$/.test(numbered[1])
        ? String(Number(numbered[1]))
        : numbered[1].toLowerCase();
      const entry = toc.find((item) => item.kind === "chapter" && item.key === key);
      if (entry?.title) return `Chapter ${key}: ${entry.title}`;
      return `${numbered[1]}. ${numbered[2]}`;
    }

    const display = /^([0-9]{1,2})\s*([A-Z][A-Z\s'’:,\-–—&.]{2,80})$/.exec(line);
    if (display) {
      const letters = display[2].match(/[A-Z]/g)?.length ?? 0;
      const hexDump = /(?:\b[0-9A-F]{2}\b\s*){3,}/.test(display[2]);
      if (letters >= 5 && !hexDump) {
        return chapterTitle("", String(Number(display[1])));
      }
    }

    if (
      /^[A-Z][A-Z\s'’:,\-–—&.]{3,80}$/.test(line) &&
      line.split(/\s+/).length >= 2 &&
      countWords(body) < 120 &&
      !isContinuation(index)
    ) {
      return line
        .toLowerCase()
        .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
    }
  }

  return null;
}

function pageRange(text: string) {
  const numbers = [...text.matchAll(/\[page (\d+)\]/g)].map((match) => Number(match[1]));
  if (numbers.length === 0) return {};
  return { pageStart: Math.min(...numbers), pageEnd: Math.max(...numbers) };
}

function rawToSection(raw: RawSection): SourceSection {
  return {
    index: 0,
    title: raw.title.trim(),
    text: raw.text.trim(),
    wordCount: countWords(raw.text),
    ...pageRange(raw.text),
  };
}

function parsePdfSections(text: string): SourceSection[] {
  const pages = pdfPages(text);

  // Read the contents pages first. Real books often set chapter openings in
  // letter-spaced display type, so the TOC is the reliable source of titles.
  const toc: TocEntry[] = [];
  const tocPages = new Set<number>();

  for (const page of pages) {
    if (page.number > 40) break;
    const entries = readTocPage(page.body, page.number);
    if (!entries) continue;
    tocPages.add(page.number);
    for (const line of entries) {
      const entry = tocEntryFromLine(line);
      if (
        entry &&
        !toc.some((item) => item.kind === entry.kind && item.key === entry.key)
      ) {
        toc.push(entry);
      }
    }
  }

  const raw: RawSection[] = [];
  const seenHeadings = new Set<string>();
  const firstTocPage = tocPages.size > 0 ? Math.min(...tocPages) : null;

  for (const page of pages) {
    // Covers, copyright and early-access blurbs sit before the contents page.
    if (firstTocPage !== null && page.number < firstTocPage) continue;
    if (tocPages.has(page.number)) continue;

    const heading = pdfChapterHeading(page.body, toc);
    if (heading) {
      const key = heading.toLowerCase().replace(/\s+/g, " ");
      const previous = raw[raw.length - 1];
      const previousWords = previous ? countWords(previous.text) : 0;

      // A repeated heading is a running header, not a new chapter.
      if (previous && seenHeadings.has(key) && previousWords >= MIN_SECTION_WORDS) {
        previous.text = `${previous.text}\n\n[page ${page.number}]\n${page.body}`.trim();
        previous.pages.push(page);
        continue;
      }

      // Title pages and part dividers are often a few lines on their own.
      if (previous && previousWords > 0 && previousWords < MIN_SECTION_WORDS) {
        previous.title = heading;
        previous.text = `${previous.text}\n\n[page ${page.number}]\n${page.body}`.trim();
        previous.pages.push(page);
        seenHeadings.add(key);
        continue;
      }

      seenHeadings.add(key);
      raw.push({
        title: heading,
        text: `[page ${page.number}]\n${page.body}`,
        pages: [page],
      });
      continue;
    }

    if (raw.length === 0) raw.push({ title: "Opening", text: "", pages: [] });
    const current = raw[raw.length - 1];
    current.text = `${current.text}\n\n[page ${page.number}]\n${page.body}`.trim();
    current.pages.push(page);
  }

  return finalizeSections(raw.map(rawToSection), "Pages");
}

function parseEpubSections(text: string): SourceSection[] {
  const lines = text.split("\n");
  const raw: SourceSection[] = [];
  let current: RawSection | null = null;

  const flush = () => {
    if (!current) return;
    const section = rawToSection(current);
    if (section.wordCount > 0) raw.push(section);
    current = null;
  };

  for (const line of lines) {
    const heading = /^#{1,2}\s+(.+?)\s*$/.exec(line.trim());
    if (heading) {
      flush();
      current = { title: heading[1], pages: [], text: line.trim() };
      continue;
    }

    if (!current) {
      current = { title: "Opening", pages: [], text: "" };
    }
    current.text = `${current.text}\n${line}`;
  }
  flush();

  const usable = raw.filter((section) => section.wordCount >= 40);
  if (usable.length < 2) return finalizeSections(chunkByWords(text, 7_000, "Part"), "Part");

  return finalizeSections(usable, "Part");
}

function parseTextSections(text: string): SourceSection[] {
  const hasHeadings = /^#{1,2}\s+.+$/m.test(text);
  if (!hasHeadings) return finalizeSections(chunkByWords(text, 7_000, "Part"), "Part");

  const raw: SourceSection[] = [];
  let current: RawSection | null = null;

  for (const line of text.split("\n")) {
    const heading = /^#{1,2}\s+(.+?)\s*$/.exec(line.trim());
    if (heading) {
      if (current) {
        const section = rawToSection(current);
        if (section.wordCount > 0) raw.push(section);
      }
      current = { title: heading[1], pages: [], text: line };
      continue;
    }
    if (!current) current = { title: "Opening", pages: [], text: "" };
    current.text = `${current.text}\n${line}`;
  }

  if (current) {
    const section = rawToSection(current);
    if (section.wordCount > 0) raw.push(section);
  }

  if (raw.filter((section) => section.wordCount >= 40).length < 2) {
    return finalizeSections(chunkByWords(text, 7_000, "Part"), "Part");
  }

  return finalizeSections(raw, "Part");
}

function chunkByWords(text: string, targetWords: number, prefix: string): SourceSection[] {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const chunks: SourceSection[] = [];
  let buffer: string[] = [];
  let words = 0;

  const push = () => {
    if (buffer.length === 0) return;
    const body = buffer.join("\n\n").trim();
    const range = pageRange(body);
    chunks.push({
      index: 0,
      title: range.pageStart
        ? `${prefix} ${range.pageStart}–${range.pageEnd}`
        : `${prefix} ${chunks.length + 1}`,
      text: body,
      wordCount: countWords(body),
      ...range,
    });
    buffer = [];
    words = 0;
  };

  for (const paragraph of paragraphs) {
    const paragraphWords = countWords(paragraph);
    if (words > 0 && words + paragraphWords > targetWords) push();
    buffer.push(paragraph);
    words += paragraphWords;
  }
  push();

  return chunks;
}

function mergeSmallSections(sections: SourceSection[]): SourceSection[] {
  const merged: SourceSection[] = [];

  for (const section of sections) {
    const previous = merged[merged.length - 1];
    if (previous && section.wordCount < MIN_SECTION_WORDS) {
      previous.text = `${previous.text}\n\n${section.text}`.trim();
      previous.wordCount = countWords(previous.text);
      previous.pageEnd = section.pageEnd ?? previous.pageEnd;
      continue;
    }
    merged.push({ ...section });
  }

  // A tiny trailing section belongs to the one before it.
  if (merged.length > 1) {
    const last = merged[merged.length - 1];
    if (last.wordCount < MIN_SECTION_WORDS) {
      const previous = merged[merged.length - 2];
      previous.text = `${previous.text}\n\n${last.text}`.trim();
      previous.wordCount = countWords(previous.text);
      previous.pageEnd = last.pageEnd ?? previous.pageEnd;
      merged.pop();
    }
  }

  return merged;
}

function splitLongSection(section: SourceSection): SourceSection[] {
  if (section.wordCount <= MAX_SECTION_WORDS) return [section];

  const parts = chunkByWords(section.text, MAX_SECTION_WORDS, section.title);
  return parts.map((part, index) => ({
    ...part,
    title: `${section.title} (part ${index + 1})`,
    pageStart: part.pageStart ?? section.pageStart,
    pageEnd: part.pageEnd ?? section.pageEnd,
  }));
}

function finalizeSections(sections: SourceSection[], fallbackPrefix: string): SourceSection[] {
  let list = sections
    .map((section) => ({
      ...section,
      title: section.title.replace(/\s+/g, " ").trim() || fallbackPrefix,
    }))
    .filter((section) => section.wordCount > 0);

  list = mergeSmallSections(list);
  list = list.flatMap(splitLongSection);

  // Very long books can yield hundreds of tiny chapters. Merge adjacent ones
  // until the map is teachable while still covering everything.
  const MAX_SECTIONS = 60;
  while (list.length > MAX_SECTIONS) {
    const previousLength = list.length;
    const target = Math.ceil(list.length / 2);
    const merged: SourceSection[] = [];
    const groupSize = Math.ceil(list.length / target);
    for (let start = 0; start < list.length; start += groupSize) {
      const group = list.slice(start, start + groupSize);
      if (group.length === 1) {
        merged.push(group[0]);
        continue;
      }
      merged.push({
        index: 0,
        title: `${group[0].title} – ${group[group.length - 1].title}`,
        text: group.map((section) => section.text).join("\n\n"),
        wordCount: group.reduce((sum, section) => sum + section.wordCount, 0),
        pageStart: group.find((section) => section.pageStart)?.pageStart,
        pageEnd: [...group].reverse().find((section) => section.pageEnd)?.pageEnd,
      });
    }
    if (merged.length >= previousLength) break;
    list = merged;
  }

  return list.map((section, index) => ({ ...section, index }));
}

/**
 * Split any long source into chapter-like sections. PDFs use the `[page n]`
 * markers and heading lines; EPUBs use the markdown headings emitted by the
 * spine walk. Everything falls back to contiguous word-count chunks, so no part
 * of the book is silently dropped.
 */
export function parseSections(source: {
  kind: string;
  text: string;
  pageCount?: number;
}): SourceSection[] {
  if (!source.text.trim()) return [];

  if (source.kind === "pdf" && /\[page \d+\]/.test(source.text)) {
    return parsePdfSections(source.text);
  }
  if (source.kind === "epub" || /^#{1,2}\s+.+$/m.test(source.text)) {
    return parseEpubSections(source.text);
  }
  return parseTextSections(source.text);
}

export function sourceIsBook(args: {
  kind: string;
  wordCount: number;
  minWords: number;
}) {
  if (args.kind === "pdf" || args.kind === "epub") return args.wordCount >= args.minWords;
  return args.wordCount >= Math.max(args.minWords * 2, 12_000);
}
