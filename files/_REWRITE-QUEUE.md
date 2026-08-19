# Rewrite queue — legacy lessons written in the old dense style

These 16 lessons were written before the plain-language voice rules in `_GENERATION-SPEC.md`.
They are too dense and assume too much. Once every manifest lesson exists, the scheduled task
rewrites them from scratch, one per run, in manifest order, using the current spec.

Rules for a rewrite:

- Same `id`, `moduleId`, `mins`, and same 13 sections — only the writing changes.
- Same file path as the existing one (do not rename `anatomy-of-a-request.md`).
- Overwrite the `.md` file, then replace the matching `const ...Lesson = { ... };` block inside
  `js/content.js` in place. Do not add a second const and do not touch `lessonDetail` (the id is
  already registered there).
- Tick the checkbox below in the same run, so the next run knows where to continue.

## Queue

- [ ] http-anatomy  (file: anatomy-of-a-request.md)
- [ ] http-methods
- [ ] http-caching
- [ ] rest-constraints
- [ ] api-versioning
- [ ] api-errors
- [ ] status-choose
- [ ] status-retry
- [ ] stateless-why
- [ ] session-state
- [ ] stack-heap
- [ ] value-reference
- [ ] boxing
- [ ] gc-disposal
- [ ] tasks
- [ ] sync-primitives
