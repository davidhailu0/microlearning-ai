import { NextResponse } from "next/server";
import { ingestEpub, ingestPdf, IngestError } from "@/lib/ingest";

export const runtime = "nodejs";
export const maxDuration = 120;

const PDF_LIMIT = 50 * 1024 * 1024;
const EPUB_LIMIT = 100 * 1024 * 1024;

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Expected a file upload." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }

  const name = file.name.toLowerCase();
  const isPdf = name.endsWith(".pdf");
  const isEpub = name.endsWith(".epub");

  if (!isPdf && !isEpub) {
    return NextResponse.json({ error: "Upload a PDF or EPUB." }, { status: 415 });
  }

  if (isPdf && file.size > PDF_LIMIT) {
    return NextResponse.json({ error: "PDFs are limited to 50 MB." }, { status: 413 });
  }
  if (isEpub && file.size > EPUB_LIMIT) {
    return NextResponse.json({ error: "EPUBs are limited to 100 MB." }, { status: 413 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const source = isPdf
      ? await ingestPdf(buffer, file.name)
      : await ingestEpub(buffer, file.name);

    return NextResponse.json({
      kind: source.kind,
      title: source.title,
      text: source.text,
      wordCount: source.wordCount,
      pageCount: source.pageCount ?? null,
    });
  } catch (error) {
    if (error instanceof IngestError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: 422 });
    }
    return NextResponse.json(
      { error: "We couldn't read that file. Try exporting it again." },
      { status: 422 },
    );
  }
}
