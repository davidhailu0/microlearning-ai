# Lumen

Turn any topic, link, PDF, or EPUB into a visual micro-course you can finish in one sitting.
Three-minute lessons, one quiz each, an AI tutor that stays grounded in the lesson, and
FSRS spaced repetition for the ideas worth keeping.

> **Zero-config demo mode.** `npm install && npm run dev` works with no database and no API
> key. Curated courses, the review loop, quizzes, and the tutor all run against an in-memory
> store; add `DATABASE_URL` and an AI key (`OPENAI_API_KEY` or `OPENROUTER_API_KEY`)
> to switch to Postgres and real generation.

---

## Quick start

```bash
cd app
npm install
npm run dev
```

Open <http://localhost:3000>.

Demo mode seeds:

- **Thinking in Systems** — a fully authored 9-lesson hero course, with two lessons already
  completed so the dashboard, progress card, and review queue are populated.
- **Six curated courses** — Habits, LLMs, Attention Design, Money, Networks, Probability.
- 4 flashcards due today, 7-day streak, 2,480 XP.

Data lives in `globalThis.__lumenDemo` and resets when the dev server restarts.

---

## Full stack setup

### 1. Postgres / Supabase

```bash
cp .env.example .env.local   # and .env for scripts/worker — they load dotenv
# set DATABASE_URL=postgres://…
```

A pooled Supabase connection string works. Then:

```bash
npm run db:migrate   # applies drizzle/0000_*.sql
npm run seed         # demo user, hero course, 6 curated courses, 2 completed lessons
npm run dev
```

`npm run db:generate` regenerates SQL after schema changes; `npm run db:studio` opens Drizzle
Studio.

### 2. AI provider (OpenAI or OpenRouter)

Set **one** chat key:

```bash
# .env.local — pick either
OPENAI_API_KEY=sk-...           # generation + tutor + narration
# or
OPENROUTER_API_KEY=sk-or-...    # generation + tutor (no narration)
```

| Capability | Model | Notes |
| --- | --- | --- |
| Course generation | `OPENAI_MODEL` (default `gpt-4o`) | Strict JSON schema, with `json_object` and plain-prompt fallbacks for models that lack structured outputs |
| Tutor | `OPENAI_TUTOR_MODEL` (`gpt-4o-mini`) | Grounded in the current lesson's text |
| Lesson narration | `OPENAI_TTS_MODEL` (`gpt-4o-mini-tts`) | **OpenAI only** — OpenRouter has no `/audio/speech` endpoint |

OpenRouter is OpenAI-compatible, so the app reuses the same SDK client and swaps
the base URL, key, and attribution headers automatically. Bare model names are
prefixed for you (`gpt-4o-mini` → `openai/gpt-4o-mini`); pass a full slug to use
another vendor (`anthropic/claude-sonnet-4`). Any model that reliably emits JSON
works — the generator retries with progressively looser output constraints and
validates every response with Zod. If the key's remaining credit is smaller than
the completion budget, it retries at the affordable limit with a tighter 3×2
outline instead of failing outright.

If both keys are present, OpenAI wins; set `AI_PROVIDER=openrouter` to route
generation and the tutor through OpenRouter while keeping `OPENAI_API_KEY` for
narration. `OPENAI_BASE_URL` points the chat client at any other
OpenAI-compatible gateway.

**PDFs, EPUBs, and links are parsed locally** with `unpdf`, `adm-zip`, and
Readability. Extraction never calls an AI provider: upload the file, and only the
distilled text digest goes to the chat model. Image-only (scanned) PDFs have no
text layer and are not OCR'd yet.

Without a key, generation falls back to a deterministic local writer and narration is
disabled. The fallback is deliberately generic and labelled as demo output in the UI.

### 3. Supabase auth (optional)

Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
`SUPABASE_SERVICE_ROLE_KEY` to use Supabase sessions. Without them the app runs as the
single user in `DEMO_USER_ID`.

### 4. Job execution

By default (`INLINE_JOBS=true`) generation and TTS run inside the request lifetime using
Next's `after()` — fine for local use and small deployments. For a dedicated process:

```bash
# .env.local
INLINE_JOBS=false

npm run worker
```

The worker polls Postgres (`jobs` table) with `FOR UPDATE SKIP LOCKED` semantics, so you can
run more than one.

---

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Next dev server |
| `npm run build` / `start` | Production build and server |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run worker` | Standalone job worker (TTS, deferred generation) |
| `npm run db:generate` / `db:migrate` / `db:push` / `db:studio` | Drizzle tooling |
| `npm run seed` | Seed the demo user and curated catalogue |

---

## What is in the app

### Screens

| Route | Screen |
| --- | --- |
| `/` | Dashboard: greeting, create bar (Prompt / Link / File / Text), stat strip, active courses, generated-course history, review callout, searchable library |
| `/courses` | Every course you generated, newest first, with source filters (PDF / EPUB / Link / Text / Topic), search, and progress |
| `/course/[courseId]` | Course detail: modules, lesson list, progress, continue |
| `/lesson/[lessonId]` | Distraction-free reader: blocks, diagrams, audio player, quiz, complete bar, tutor FAB |
| `/review` | Flip-card deck with Hard / Good / Easy grading and keyboard shortcuts |

The reader hides the global chrome, keeps a slim progress header, and returns you to the
course or the next lesson when you finish.

### API

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/courses/generate` | `POST` | `{ kind: "prompt" \| "text" \| "url", prompt?, text?, url?, lessonCount?, level? }` → `202 { jobId }` |
| `/api/ingest` | `POST` | Parse a pasted URL or uploaded PDF/EPUB into text (size and SSRF guarded) |
| `/api/jobs/[jobId]` | `GET` | Status, stage, progress, resulting `courseId` |
| `/api/lessons/[lessonId]/complete` | `POST` | Mark complete, award XP, schedule the lesson's flashcards |
| `/api/quizzes/[quizId]/submit` | `POST` | `{ optionId }` → correctness, explanation, XP |
| `/api/review` | `POST` | `{ flashcardId, rating: "hard" \| "good" \| "easy" }` → next due, interval, previews |
| `/api/tutor` | `POST` | `{ lessonId, messages[] }` → grounded reply |

### Source ingestion

- **URL** — Readability + linkedom, with a private-address/SSRF guard
  (`ALLOW_PRIVATE_URLS=false`).
- **PDF** — `unpdf`, text-first, 200+ page books supported up to `MAX_SOURCE_CHARS`.
- **EPUB** — `adm-zip` + `fast-xml-parser` spine walk.
- **Text** — used directly.

Uploaded files keep their original PDF/EPUB label in `/courses`, even though the
server receives pre-extracted text. Everything you generate is listed there, not
just courses you have started.

Long sources are distilled into a course outline rather than embedded whole. See
`../PDF-PIPELINE.md` and `../V3-FULL-BOOK-VISUAL.md` for the chunking/distillation design.

### Data model

`users` · `streaks` · `friendships` · `courses` · `course_progress` · `modules` ·
`lessons` · `lesson_progress` · `content_blocks` · `quizzes` · `questions` ·
`quiz_options` · `quiz_attempts` · `flashcards` · `card_states` · `reviews` ·
`xp_events` · `daily_activity` · `jobs` · `sources` · `citations` · `audio_assets`

Two design decisions worth knowing:

1. **Cards are scheduled when a lesson is completed, not when a course is generated.**
   Otherwise a freshly generated 9-lesson course would dump ~18 unseen cards into today's
   queue. This is enforced in both `completeLesson` (Postgres) and `ensureDemoCardStates`
   (demo store).
2. **FSRS state lives on `card_states`** (`due`, `stability`, `difficulty`,
   `elapsedDays`, `scheduledDays`, `learningSteps`, `reps`, `lapses`, `state`,
   `retrievability`), with every grade appended to `reviews` for auditability. The
   scheduler is [`ts-fsrs`](https://github.com/open-spaced-repetition/ts-fsrs).

### Generation pipeline

```
prompt / URL / PDF / EPUB / text
        │
        ▼
  ingest + normalise ──► source chunks
        │
        ▼
  chat model structured output (Zod-validated, repaired if needed)
        │
        ▼
  Course → Modules → Lessons → Blocks (hook, paragraphs, bullets, takeaway,
  diagram, callout, quote, stat, definition, comparison) + Quiz + 2 Flashcards
        │
        ▼
  persist (Postgres + Drizzle, or demo store)
        │
        └──► enqueue TTS jobs (one per lesson) ──► audio_assets
```

A generation job reports `queued → ingesting → outlining → writing → narrating → ready`,
with `stage`, `progress`, and `error` surfaced to the polling UI.

---

## Project layout

```
app/
  src/app/
    (app)/                 dashboard, course, review (global chrome)
    lesson/[lessonId]/     distraction-free reader
    api/                   route handlers
  src/components/
    dashboard/             create bar, stat strip
    course/                cards, library grid, progress
    lesson/                block renderer, diagram, audio, quiz, complete, tutor
    review/                flip deck
    ui/                    shadcn/ui primitives
  src/lib/
    ai/                    prompt, generation, repair, TTS
    ingest.ts              URL/PDF/EPUB extraction
    fsrs.ts                scheduler wrapper + interval previews
    repo.ts                all data access (Postgres + demo switch)
    demo.ts                in-memory store, authored hero, curated catalogue
    jobs.ts                job runner, inline/worker shared logic
    db/schema.ts           Drizzle schema (22 tables)
  src/db/                  migrations runner, seed
  src/worker/              standalone poller
  drizzle/                 generated SQL
```

Architecture detail lives in `../ARCHITECTURE.md` (schema, API contracts, and pipeline
decisions), `../PDF-PIPELINE.md`, and `../V3-FULL-BOOK-VISUAL.md`.

---

## UI conventions

- Next.js App Router + React Server Components, TypeScript, Tailwind v4.
- shadcn/ui defaults with the **Zinc** palette and **0.75rem** radius; light/dark via
  `next-themes` (`system` by default).
- Geist Sans / Geist Mono via `next/font`.
- Amber accent for attention, emerald for success/completion, destructive red only for errors.
- Keyboard: `space`/`enter` reveal a card, `1`/`h` hard, `2`/`g` good, `3`/`e` easy.
- Reader typography: 15.5px / 1.78 line-height, max 2xl measure, `text-wrap: balance` on headings.

---

## Verification

```bash
npm run typecheck
npm run build
```

Demo-mode smoke test:

```bash
curl -s -X POST http://localhost:3000/api/courses/generate \
  -H "content-type: application/json" \
  -d '{"kind":"prompt","prompt":"how vaccines train the immune system"}'

# → {"jobId":"…"}
curl -s http://localhost:3000/api/jobs/<jobId>
# → {"status":"succeeded","stage":"Ready — 9 lessons","courseId":"…"}
```

UI was verified over the Chrome DevTools Protocol (REA MCP): DOM/accessibility inspection,
console/network checks, and screenshots in light and dark mode at desktop and mobile widths.

---

## Known limits

- Demo mode is single-process and volatile; use Postgres for anything you care about.
- TTS requires `OPENAI_API_KEY` plus storage (`SUPABASE_AUDIO_BUCKET`); OpenRouter
  cannot narrate, so OpenRouter-only setups show a "no narration" state instead of a
  broken player. Scanned PDFs are not OCR'd.
- The deterministic fallback generator is topic-agnostic by design — it keeps the product
  usable without a key, not to replace the model.
- Friend streaks are modelled in the schema but not yet surfaced in the UI.
- No git repository is initialised in this workspace yet.
