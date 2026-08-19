# Backend Knowledge Map — lesson generation spec

This file is the single source of truth for the automated lesson-generation task.
It is NOT a lesson. Any file in this folder whose name starts with `_` is not a lesson.

---

## Role

You are writing lesson content for **Backend Knowledge Map**, a bilingual (English/Arabic) senior
.NET backend learning site. Every string in the site is `{ en: "...", ar: "..." }`. Arabic keeps
all technical terms (thread, heap, async, index, transaction, etc.) in Latin script — never
translate or transliterate them into Arabic letters. Arabic is not a shallow translation of the
English; it should read as if a senior Arabic-speaking engineer wrote it directly, with the same
technical weight, same numbers, same examples.

**Audience**: mid-to-senior backend engineers, many prepping for interviews. They already know
the syntax. Every lesson exists to go one level deeper than a tutorial: why the thing exists, what
actually happens at runtime, what breaks in production, and how to defend a decision in an
interview or a design review.

**Voice — READ THIS TWICE. This is the most important rule in the file.**

The reader is studying this to understand the topic. They must never need a second explanation
from anywhere else. If a sentence would send them to Google, the sentence is wrong.

Write plainly and directly:

- **Explain, don't perform.** Simple words. Short sentences, one idea each, ~20 words max. No
  literary or ornate phrasing in either language.
- **Assume the reader knows C# syntax but does NOT know this topic.** Nothing is "obviously" true.
- **Define every technical term the first time it appears**, in the same sentence or the next one,
  in plain words. No term arrives naked. This includes spec names, algorithm names and acronyms —
  if you write "RFC 7807" or "B-tree" you immediately say what it is in half a sentence.
- **Lead every section with the point.** First sentence = the main idea in plain language. Details
  come after, never before.
- **Use one concrete running example through the whole lesson** — a real endpoint, a real query, a
  real bug — instead of abstract statements. Show the actual thing happening.
- **Use an everyday analogy** at least once in `why` and once in `internals` to anchor the
  mechanism, then immediately map the analogy back to the real thing.
- **Keep the numbers, but say what they mean.** Not "p99 was 8 s" but "p99 was 8 s — meaning the
  slowest 1 in 100 requests took 8 seconds".
- **No jargon stacking.** Never more than one new term per sentence.
- **Concrete failures.** Every "mistake" and "review" item shows a specific scenario — what someone
  wrote, what happened in production, why. Not a generic warning.
- **Interview answers are spoken answers** — what a strong candidate would actually say out loud,
  in plain language, not a textbook definition.

**Arabic specifically**: write modern, plain, practical Arabic — the way a senior engineer explains
something to a colleague at a whiteboard. Keep all technical terms in Latin script. Do NOT use
classical/literary Arabic, ornate verbs, or dramatic metaphors (no «تعضّك», «تسلب المصمّم حرية ما»,
«يسافر عبر الـ socket»). Prefer the direct verb and the short sentence. Arabic carries the same
information as English, at the same depth — but it must read easily on the first pass.

**Banned**: filler openers ("in today's fast-paced world"), vague words used alone ("fast", "a
lot", "efficient"), sentences that only restate the section title, and any explanation that assumes
the reader already knows the answer.

---

## Output schema — exact JS shape

Each lesson is one JS object literal, matching this structure exactly (field names, casing,
nesting):

```js
const exampleLesson = {
  id: "kebab-case-id",              // MUST equal the id given in the manifest below, exactly
  moduleId: "module-id",            // MUST equal the moduleId given in the manifest below, exactly
  title: { en: "...", ar: "..." },
  summary: { en: "...", ar: "..." }, // one sentence, appears under the H1
  mins: 14,                          // MUST equal the mins given in the manifest below, exactly
  sections: [
    { key: "why", blocks: [ /* block objects, see below */ ] },
    { key: "problem", blocks: [...] },
    { key: "internals", blocks: [...] },
    { key: "tradeoffs", blocks: [...] },
    { key: "mistakes", blocks: [...] },
    { key: "interview", blocks: [...] },
    { key: "codereview", blocks: [...] },
    { key: "sysdesign", blocks: [...] },
    { key: "perf", blocks: [...] },
    { key: "debug", blocks: [...] },
    { key: "realworld", blocks: [...] },
    { key: "exercises", blocks: [...] },
    { key: "refs", blocks: [...] }
  ],
  quiz: [ /* 5 quiz question objects, see below */ ]
};
```

All 13 section keys are required, in that exact order, every time. Do not add, rename, reorder,
or skip a section.

## Block types (used inside `blocks: [...]`)

Use **only** these block shapes — the renderer only knows these `t` values:

```js
// paragraph
{ t: "p", en: "...", ar: "..." }

// bullet list
{ t: "ul", en: ["...", "..."], ar: ["...", "..."] }

// callout box — kind is exactly one of: tip | note | warn
{ t: "callout", kind: "tip", en: "...", ar: "..." }

// key/value table
{ t: "kv", rows: [
  { k: { en: "...", ar: "..." }, v: { en: "...", ar: "..." } }
]}

// code sample — lang is a real language id (csharp, sql, json, bash, etc.)
{ t: "code", lang: "csharp", label: { en: "...", ar: "..." }, code: "line1\nline2\n..." }

// pros/cons/limits/alternatives grid — each array has 3-5 short items
{ t: "tradeoff",
  pros:  { en: [...], ar: [...] },
  cons:  { en: [...], ar: [...] },
  limits:{ en: [...], ar: [...] },
  alts:  { en: [...], ar: [...] }
}

// a named mistake — fix is optional (omit the key if there's no short code fix)
{ t: "mistake", title: { en: "...", ar: "..." }, body: { en: "...", ar: "..." }, fix: "code\nhere" }

// interview Q&A — level is exactly one of: junior | mid | senior | staff
{ t: "qa", level: "mid", q: { en: "...", ar: "..." }, a: { en: "...", ar: "..." } }

// code review bad/good pair — severity is exactly one of: high | medium | low
{ t: "review", severity: "high",
  title: { en: "...", ar: "..." },
  bad: "code\nhere",
  good: "code\nhere",
  why: { en: "...", ar: "..." }
}

// exercise — diff is exactly one of: easy | medium | hard | senior
{ t: "ex", diff: "medium", en: "...", ar: "..." }

// external reference link — url MUST be a real, working URL you are confident exists
// (official docs, well-known books/articles). Never invent a URL.
{ t: "ref", label: { en: "...", ar: "..." }, url: "https://...", meta: { en: "Docs", ar: "توثيق" } }
```

Do **not** use `{ t: "diagram" }` — the two existing custom diagrams (`threadpool`, `gcheap`) are
hand-built assets that don't exist for new topics. If a lesson needs a visual explanation, use a
`kv` table or a short `code`/`callout` block instead.

## Quiz shape

```js
quiz: [
  {
    q: { en: "...", ar: "..." },
    options: [
      { en: "...", ar: "..." }, { en: "...", ar: "..." },
      { en: "...", ar: "..." }, { en: "...", ar: "..." }
    ],
    correct: 1,   // 0-based index into options
    why: { en: "...", ar: "..." }
  }
  // exactly 5 questions total
]
```

## Depth calibration per section (match this — not more, not less)

- **why** — in this exact order:
  1. one `p` that states, in one or two plain sentences, what this topic is and what problem it
     solves. A reader who stops here still learns something true.
  2. one `kv` block: the **glossary**, 3-6 rows. `k` = every term the lesson depends on,
     `v` = a one-line plain-language meaning. This is what stops the reader searching elsewhere.
  3. 1-2 more `p` blocks: the real situation that forced this thing to exist, with the everyday
     analogy.
  4. optional `callout`.
- **problem** — 2-3 `p`/`kv` blocks. Show the concrete before/after with numbers, and say what each
  number means in words.
- **internals** — the deepest section, still written plainly. 3-4 `p` blocks, at least one `code`
  block, usually a `kv` block naming the moving parts. Walk through what happens step by step, in
  order, as if tracing one request. Explain each mechanism the first time it appears.
- **tradeoffs** — exactly one `tradeoff` block, 3-4 short items per list, each understandable on
  its own without the rest of the lesson.
- **mistakes** — 4 `mistake` blocks. Each: what someone actually wrote, what broke, why.
- **interview** — 6 `qa` blocks: 1 junior, 2 mid, 2 senior, 1 staff. Answers are spoken-style and
  self-contained. The staff question is about organizational/structural fixes, not code.
- **codereview** — 2 `review` blocks (one `high`, one `medium`/`low` severity).
- **sysdesign** — 1-2 `p` blocks + 1 `ul` block, sometimes a `callout`. Where this shows up in a
  real system, described concretely.
- **perf** — 1 `kv` block, 4-5 rows chosen from: Memory, CPU, Network, Database, Scalability,
  Latency — whichever actually apply.
- **debug** — 1 `ul` block (4-5 concrete tools/commands, each with a half-line saying what you're
  looking for in its output) + 1 `callout` (tip).
- **realworld** — 1 `p` block + 1 `ul` block (4 items). Describe *patterns/industries* ("chat
  platforms", "payment systems"), not named companies.
- **exercises** — exactly 4 `ex` blocks: one each of easy, medium, hard, senior. Each states what
  to build and what result proves you got it right.
- **refs** — 4 `ref` blocks, real URLs only (learn.microsoft.com, well-known books/blogs).

## Length bar

Target **~200-260 lines / 55-75 KB** per lesson file.

Some earlier files in this folder are 140-175 KB. That was too long and too dense — do not use them
as the model. Length is not the goal; a reader finishing the lesson with no unanswered questions is
the goal. Cut any sentence that does not teach something. If a section feels long, it is usually
because a term was left unexplained earlier and is now being worked around.

Do NOT read an old lesson file for calibration — it costs a lot of budget and reflects the old,
too-dense style. This spec is the only calibration you need.

---

## Lesson manifest — 51 lessons across 10 modules

Each entry: `id | moduleId | title (en) — title (ar) | mins | one-line brief`

**Module: foundations** — "Backend Foundations": the contract of the web.
- `http-anatomy | foundations | Anatomy of a request — تشريح الـ request | 14` — the full HTTP request/response lifecycle from socket to handler: request line, headers, body, how a server parses it.
- `http-methods | foundations | Methods, safety and idempotency — الـ methods والأمان والـ idempotency | 12` — GET/POST/PUT/PATCH/DELETE semantics, what "safe" and "idempotent" actually guarantee, why PUT vs POST matters for retries.
- `http-caching | foundations | Caching headers — ترويسات الـ caching | 16` — Cache-Control, ETag, Last-Modified, validation vs expiration caching, CDN interaction.
- `rest-constraints | foundations | The six constraints — القيود الستة | 13` — Fielding's REST constraints explained with what breaks when each is violated, not just a definition list.
- `api-versioning | foundations | Versioning and evolution — الإصدارات والتطوّر | 15` — URL vs header vs content-negotiation versioning, breaking vs non-breaking changes, deprecation strategy.
- `api-errors | foundations | Error contracts — عقود الأخطاء | 11` — RFC 7807 problem details, consistent error shapes, what a client actually needs to act on an error.
- `status-choose | foundations | Choosing the right code — اختيار الكود الصحيح | 10` — the practical decision tree between 400 vs 422 vs 409 vs 404 vs 403, common misuses.
- `status-retry | foundations | What clients retry on — ما يعيد العملاء المحاولة عليه | 9` — which status codes are safe to retry, why 500 is not always safe, Retry-After.
- `stateless-why | foundations | Why stateless scales — لماذا يتوسّع الـ stateless | 12` — how statelessness enables horizontal scaling and load balancing, the failure modes of sticky sessions.
- `session-state | foundations | Where session state goes — إلى أين تذهب حالة الجلسة | 14` — cookies, JWTs, server-side session stores (Redis), trade-offs of each for a stateless backend.

**Module: runtime** — "C# Runtime": what the CLR does under your code. (`async-await` and `gc`
already exist — skip them.)
- `stack-heap | runtime | Stack, heap and what lives where — الـ stack والـ heap وما يعيش في كل منهما | 15` — how method calls, locals, and objects are actually laid out in memory; when a struct escapes to the heap.
- `value-reference | runtime | Value vs reference semantics — دلالات القيمة مقابل المرجع | 17` — copy semantics, mutation surprises, `ref`/`in`/`out`, records vs classes vs structs.
- `boxing | runtime | Boxing and its cost — الـ boxing وتكلفته | 12` — what boxing/unboxing actually does, where it silently happens (non-generic collections, interface calls on structs), how to avoid it.
- `gc-disposal | runtime | IDisposable and deterministic cleanup — IDisposable والتنظيف الحتمي | 14` — the dispose pattern, `using`/`await using`, finalizers vs Dispose, SafeHandle.
- `tasks | runtime | Tasks, scheduling and cancellation — الـ tasks والجدولة والإلغاء | 18` — Task vs Task<T>, TaskCompletionSource, how the TaskScheduler picks work, cooperative cancellation end to end.
- `sync-primitives | runtime | Locks and synchronization primitives — الأقفال وأدوات التزامن | 20` — lock/Monitor, SemaphoreSlim, ReaderWriterLockSlim, when each applies, deadlock causes.
- `exception-cost | runtime | Cost, filters and rethrow — التكلفة والـ filters وإعادة الرمي | 13` — real cost of throwing, exception filters (`when`), `throw;` vs `throw ex;`, exceptions as control flow (why not to).
- `exception-design | runtime | Designing failure boundaries — تصميم حدود الفشل | 15` — where to catch vs let bubble, custom exception hierarchies, global exception middleware in ASP.NET Core.

**Module: di** — "Dependency Injection": lifetimes and the composition root.
- `di-why | di | What DI actually buys you — ما يمنحه لك الـ DI فعلياً | 12` — inversion of control vs the DI container, testability, what DI does NOT solve.
- `di-root | di | The composition root — جذر التركيب | 11` — where object graphs should be composed, service locator anti-pattern, why resolving from the container mid-code is a smell.
- `di-lifetimes | di | Singleton, scoped, transient — Singleton و Scoped و Transient | 16` — exact lifetime semantics in ASP.NET Core's container, per-request scope, common lifetime mismatches.
- `captive | di | Captive dependencies — الـ Captive dependencies | 13` — a singleton holding a scoped/transient dependency, why it only shows up in production, how the container can catch it (validate scopes).

**Module: efcore** — "Entity Framework Core": change tracking and query translation.
- `ef-tracking | efcore | How the tracker works — كيف يعمل الـ tracker | 18` — the change tracker's snapshot/proxy mechanics, entity states, SaveChanges internals.
- `ef-notracking | efcore | When to go no-tracking — متى تستخدم no-tracking | 12` — AsNoTracking trade-offs, read-only query paths, identity resolution differences.
- `ef-n1 | efcore | N+1 and eager loading — N+1 والتحميل المبكر | 17` — how N+1 happens with lazy loading, Include/ThenInclude, detecting it with logging/interceptors.
- `ef-split | efcore | Split queries and projections — الاستعلامات المنفصلة والـ projections | 14` — AsSplitQuery vs single query cartesian explosion, Select projections to avoid over-fetching.

**Module: sql** — "SQL Server": indexes, plans, isolation, locking.
- `clustered | sql | Clustered vs non-clustered — Clustered مقابل Non-clustered | 16` — how each index is physically structured, why a table has at most one clustered index, key lookups.
- `covering | sql | Covering indexes and key lookups — الفهارس الشاملة وعمليات البحث بالمفتاح | 15` — INCLUDE columns, when the optimizer avoids a key lookup, index tuning from a real query.
- `read-plan | sql | Reading a plan — قراءة الخطة | 19` — scan vs seek, estimated vs actual rows, the operators that signal trouble (sort, hash match, key lookup).
- `param-sniffing | sql | Parameter sniffing | 14` — how the plan cache picks a plan for the first parameter value seen, why it goes wrong, OPTIMIZE FOR / RECOMPILE.
- `isolation-levels | sql | Isolation levels — مستويات العزل | 18` — read committed through serializable, dirty/non-repeatable/phantom reads, RCSI.
- `deadlocks | sql | Deadlocks and how to read the graph — الـ deadlocks وقراءة الرسم | 16` — lock ordering causes, reading a deadlock graph, retry vs prevention.

**Module: distributed** — "Distributed Systems": partial failure as the normal case.
- `retries | distributed | Retries, backoff and jitter — إعادة المحاولة والتراجع والـ jitter | 15` — exponential backoff, why jitter matters (thundering herd), retry budgets.
- `idempotency | distributed | Idempotency keys — مفاتيح الـ idempotency | 14` — client-generated idempotency keys, server-side dedup storage, at-least-once delivery.
- `timeouts | distributed | Timeouts and circuit breakers — المُهل والـ circuit breakers | 16` — timeout budgets across a call chain, circuit breaker states (closed/open/half-open), Polly.
- `cap | distributed | CAP in practice — CAP عملياً | 17` — what CAP actually constrains (only under partition), PACELC, real examples of CP vs AP systems.
- `outbox | distributed | Outbox and exactly-once delivery — الـ outbox والتوصيل مرة واحدة | 19` — the dual-write problem, transactional outbox pattern, exactly-once as effectively-once + idempotency.

**Module: performance** — "Performance": measure, find the bottleneck, fix it.
- `benchmarking | performance | Benchmarking honestly — قياس الأداء بأمانة | 15` — BenchmarkDotNet methodology, JIT warmup, common benchmarking mistakes that produce fake numbers.
- `percentiles | performance | Percentiles, not averages — النسب المئوية لا المتوسطات | 12` — why averages hide tail latency, p50/p95/p99, how to reason about SLOs.
- `cache-layers | performance | Cache layers and invalidation — طبقات الـ cache والإبطال | 18` — in-process vs distributed cache (Redis), cache-aside vs write-through, invalidation strategies.
- `stampede | performance | Stampedes and stale-while-revalidate — الـ stampede و stale-while-revalidate | 14` — cache stampede on expiry under load, locking/single-flight, stale-while-revalidate pattern.

**Module: architecture** — "Architecture": boundaries and structures that survive change.
- `clean-arch | architecture | Clean architecture, honestly assessed — Clean architecture بتقييم صادق | 18` — dependency rule, where it earns its cost vs where it's over-engineering for a CRUD app.
- `vertical-slice | architecture | Vertical slices — الشرائح العمودية | 14` — feature-folder/vertical slice architecture as an alternative to layered architecture, trade-offs.
- `cqrs | architecture | CQRS and when it is overkill — CQRS ومتى يكون مبالغة | 16` — command/query separation, when a single model is enough, CQRS without event sourcing.
- `events | architecture | Domain events — أحداث المجال | 15` — domain events vs integration events, in-process vs out-of-process publishing, decoupling side effects.

**Module: observability** — "Observability": logs, metrics, traces.
- `structured-logs | observability | Structured logging — التسجيل المنظّم | 13` — structured vs string logs, correlation IDs, log levels that are actually actionable.
- `metrics | observability | Metrics that matter — المقاييس المهمة | 14` — RED/USE methods, counters vs gauges vs histograms, avoiding metric explosion (cardinality).
- `tracing | observability | Distributed tracing — التتبّع الموزّع | 17` — spans, trace context propagation (W3C traceparent), OpenTelemetry basics, reading a trace to find the real bottleneck.

**Module: skills** — "Engineering Skills": craft that survives disagreement.
- `code-review | skills | Reviewing code well — مراجعة الكود بشكل جيد | 14` — what to actually look for, giving feedback that lands, when to block vs comment.
- `design-doc | skills | Writing a design doc — كتابة مستند تصميم | 16` — structure of a good design doc (context, options considered, trade-offs, decision), getting real feedback.
- `tradeoff-writing | skills | Arguing trade-offs — مناقشة المقايضات | 12` — making a technical argument that survives disagreement, steelmanning the alternative, disagree-and-commit.

---

## Manifest order (authoritative work queue)

Lessons are produced strictly in this order:

1. http-anatomy
2. http-methods
3. http-caching
4. rest-constraints
5. api-versioning
6. api-errors
7. status-choose
8. status-retry
9. stateless-why
10. session-state
11. stack-heap
12. value-reference
13. boxing
14. gc-disposal
15. tasks
16. sync-primitives
17. exception-cost
18. exception-design
19. di-why
20. di-root
21. di-lifetimes
22. captive
23. ef-tracking
24. ef-notracking
25. ef-n1
26. ef-split
27. clustered
28. covering
29. read-plan
30. param-sniffing
31. isolation-levels
32. deadlocks
33. retries
34. idempotency
35. timeouts
36. cap
37. outbox
38. benchmarking
39. percentiles
40. cache-layers
41. stampede
42. clean-arch
43. vertical-slice
44. cqrs
45. events
46. structured-logs
47. metrics
48. tracing
49. code-review
50. design-doc
51. tradeoff-writing

## File output format

One file per lesson, at `D:\00-Work\backend-knowledge\files\<lesson-id>.md`.
File content is exactly:

- a single fenced ` ```js ` block containing only the `const <camelCaseName>Lesson = { ... };`
  declaration — no imports, no commentary inside or outside the fence
- a blank line
- one final line: `NEXT: <next-lesson-id>` (or `DONE` when the manifest is exhausted)

Note: `http-anatomy` was written before this convention and lives at `anatomy-of-a-request.md`.
Treat it as done. All new files use the lesson id as the filename.

## Wiring the lesson into `js/content.js`

Every lesson must also be inserted into `D:\00-Work\backend-knowledge\js\content.js`, which is the
file the site actually loads. Its layout is:

```
export const ui = { ... };
const sectionTitles = { ... };
export const SECTION_TITLES = sectionTitles;

// ---------------------------------------------------------------- lesson: async/await
const asyncLesson = { ... };
// ---------------------------------------------------------------- lesson: GC
const gcLesson = { ... };
// ... one const per lesson, in manifest order ...

export const lessonDetail = {
  "async-await": asyncLesson, "gc": gcLesson,
  "http-anatomy": httpAnatomyLesson, ...
};

// ---------------------------------------------------------------- modules
export const modules = [ ... ];
```

Two edits per lesson, both idempotent — if `id: "<lesson-id>"` already appears in content.js, the
lesson is already wired; skip both edits:

1. **Insert the const.** Immediately before the line `export const lessonDetail = {`, insert a
   blank line, then a separator comment in the existing style
   (`// ---------------------------------------------------------------- lesson: <short name>`),
   then a blank line, then the exact same `const <camelCaseName>Lesson = { ... };` body written to
   the `.md` file — the two must be byte-identical apart from the markdown fence. Do NOT paste the
   ```js fence or the `NEXT:` line into content.js.
2. **Register it.** Add `"<lesson-id>": <camelCaseName>Lesson` to the `lessonDetail` object literal,
   grouped on a line with its module siblings, keeping manifest order and valid comma placement.

Do **not** touch `export const modules = [ ... ]` — it already lists every manifest lesson with its
title, mins and `done` flag. Do not change any other export.

After editing, content.js must still be valid ES module syntax: balanced braces, a comma between
every `lessonDetail` entry, no trailing comma before `}`, no duplicate keys.
