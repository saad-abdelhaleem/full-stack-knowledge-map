// Pure lookups over the content data (js/content.js). No state, no DOM —
// these are shared by the store logic and by every view renderer.

export function allLessons(content) {
  const out = [];
  content.modules.forEach((m) =>
    m.topics.forEach((t) =>
      t.lessons.forEach((l) => out.push({ ...l, moduleId: m.id, module: m, topic: t }))
    )
  );
  return out;
}

export function findLesson(content, id) {
  return allLessons(content).find((l) => l.id === id) || null;
}

export function moduleById(content, id) {
  return content.modules.find((m) => m.id === id) || content.modules[0];
}

export function modulePct(state, m) {
  const all = m.topics.flatMap((t) => t.lessons);
  const done = all.filter((l) => state.completed.includes(l.id)).length;
  return all.length ? Math.round((done / all.length) * 100) : 0;
}

export function moduleStatus(state, m) {
  const pct = modulePct(state, m);
  if (pct === 100) return "done";
  if (m.status === "locked") return "locked";
  if (pct > 0 || m.status === "current") return "current";
  return "open";
}

// Every { t: "qa" } block filed under a lesson's "interview" section,
// flattened across all lessons that have full detail content.
export function allInterviewQuestions(content) {
  const out = [];
  Object.values(content.lessonDetail).forEach((les) => {
    const sec = les.sections.find((x) => x.key === "interview");
    if (!sec) return;
    const m = moduleById(content, les.moduleId);
    sec.blocks.forEach((b, i) => out.push({ ...b, lesson: les, module: m, key: les.id + "-" + i }));
  });
  return out;
}
