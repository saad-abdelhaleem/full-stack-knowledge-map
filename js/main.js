import { createStore, repo } from "./store.js";
import { buildT } from "./i18n.js";
import { content } from "./data.js";
import { findLesson } from "./lessons.js";
import { renderShell } from "./render/shell.js";
import { renderHome } from "./render/home.js";
import { renderRoadmap } from "./render/roadmap.js";
import { renderModule } from "./render/module.js";
import { renderLesson } from "./render/lesson.js";
import { renderInterview } from "./render/interview.js";
import { renderBookmarks } from "./render/bookmarks.js";

const seeded = [];
content.modules.forEach((m) => m.topics.forEach((t) => t.lessons.forEach((l) => { if (l.done) seeded.push(l.id); })));

const store = createStore({
  lang: "en", theme: "light",
  view: "home", moduleId: "runtime", lessonId: null, stage: "read",
  completed: seeded, bookmarks: [], recent: ["value-reference", "stack-heap"], stageProgress: {},
  openTopics: {}, openQa: {}, copied: null,
  palette: false, query: "",
  quiz: { i: 0, picked: null, checked: false, score: 0, finished: false },
  ivLevel: "all", ivModule: "all",
  sidebar: false
});

function applyDocumentAttrs() {
  const s = store.getState();
  const html = document.documentElement;
  html.setAttribute("data-theme", s.theme);
  html.setAttribute("dir", s.lang === "ar" ? "rtl" : "ltr");
  html.setAttribute("lang", s.lang);
}

function persist() {
  const s = store.getState();
  repo.save({
    lang: s.lang, theme: s.theme, completed: s.completed,
    bookmarks: s.bookmarks, recent: s.recent, stageProgress: s.stageProgress
  });
}

// ---------------------------------------------------------------------------
// actions — every data-action in the rendered markup resolves to one of these
// ---------------------------------------------------------------------------

let copyTimer = null;

const actions = {
  "go"(ds) {
    store.setState({ view: ds.view, sidebar: false });
    window.scrollTo(0, 0);
  },
  "go-module"(ds) {
    store.setState({ view: "module", moduleId: ds.id, sidebar: false });
    window.scrollTo(0, 0);
  },
  "open-lesson"(ds) {
    const l = findLesson(content, ds.id);
    store.setState((s) => ({
      view: "lesson", lessonId: ds.id, moduleId: l ? l.moduleId : s.moduleId,
      stage: "read", sidebar: false, palette: false,
      recent: [ds.id, ...s.recent.filter((r) => r !== ds.id)].slice(0, 5),
      openQa: {}, quiz: { i: 0, picked: null, checked: false, score: 0, finished: false }
    }));
    persist();
    window.scrollTo(0, 0);
  },
  "set-stage"(ds) {
    store.setState({ stage: ds.stage });
    window.scrollTo(0, 0);
  },
  "toggle-topic"(ds) {
    store.setState((s) => ({
      openTopics: { ...s.openTopics, [ds.id]: !(s.openTopics[ds.id] !== undefined ? s.openTopics[ds.id] : true) }
    }));
  },
  "toggle-bookmark"() {
    store.setState((s) => ({
      bookmarks: s.bookmarks.includes(s.lessonId) ? s.bookmarks.filter((b) => b !== s.lessonId) : [...s.bookmarks, s.lessonId]
    }));
    persist();
  },
  "toggle-qa"(ds) {
    store.setState((s) => ({ openQa: { ...s.openQa, [ds.key]: !s.openQa[ds.key] } }));
  },
  "copy-code"(ds) {
    if (navigator.clipboard) navigator.clipboard.writeText(ds.code).catch(() => {});
    store.setState({ copied: ds.key });
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => store.setState({ copied: null }), 1400);
  },
  "advance-stage"() {
    const s = store.getState();
    const level = s.stage === "read" ? 1 : 2;
    store.setState((st) => ({
      stageProgress: { ...st.stageProgress, [st.lessonId]: Math.max(level, st.stageProgress[st.lessonId] || 0) },
      stage: level === 1 ? "practice" : "quiz"
    }));
    persist();
    window.scrollTo(0, 0);
  },
  "stub-complete"() {
    const s = store.getState();
    const lref = findLesson(content, s.lessonId);
    store.setState((st) => ({ completed: st.completed.includes(st.lessonId) ? st.completed : [...st.completed, st.lessonId] }));
    persist();
    actions["go-module"]({ id: lref.moduleId });
  },
  "quiz-pick"(ds) {
    store.setState((s) => (s.quiz.checked ? {} : { quiz: { ...s.quiz, picked: Number(ds.index) } }));
  },
  "quiz-primary"() {
    const s = store.getState();
    const qz = s.quiz;
    if (qz.picked === null) return;
    const detail = content.lessonDetail[s.lessonId];
    const qList = detail ? detail.quiz : [];
    const cur = qList[Math.min(qz.i, qList.length - 1)];
    if (!qz.checked) {
      store.setState({ quiz: { ...qz, checked: true, score: qz.score + (qz.picked === cur.correct ? 1 : 0) } });
    } else if (qz.i + 1 >= qList.length) {
      store.setState({ quiz: { ...qz, finished: true } });
    } else {
      store.setState({ quiz: { ...qz, i: qz.i + 1, picked: null, checked: false } });
    }
  },
  "quiz-retry"() {
    store.setState({ quiz: { i: 0, picked: null, checked: false, score: 0, finished: false } });
  },
  "quiz-complete"() {
    const s = store.getState();
    store.setState((st) => ({ completed: st.completed.includes(st.lessonId) ? st.completed : [...st.completed, st.lessonId] }));
    persist();
    actions["go-module"]({ id: s.moduleId });
  },
  "set-iv-level"(ds) {
    store.setState({ ivLevel: ds.level });
  },
  "open-palette"() {
    store.setState({ palette: true, query: "" });
  },
  "close-palette"() {
    store.setState({ palette: false });
  },
  "palette-go-module"(ds) {
    store.setState({ palette: false });
    actions["go-module"](ds);
  },
  "palette-go-lesson"(ds) {
    actions["open-lesson"](ds);
  },
  "open-sidebar"() {
    store.setState({ sidebar: true });
  },
  "close-sidebar"() {
    store.setState({ sidebar: false });
  },
  "toggle-theme"() {
    store.setState((s) => ({ theme: s.theme === "dark" ? "light" : "dark" }));
    applyDocumentAttrs();
    persist();
  }
};

// ---------------------------------------------------------------------------
// render
// ---------------------------------------------------------------------------

const root = document.getElementById("app");

const VIEW_RENDERERS = {
  home: renderHome,
  roadmap: renderRoadmap,
  module: renderModule,
  lesson: renderLesson,
  interview: renderInterview,
  bookmarks: renderBookmarks
};

function render() {
  const active = document.activeElement;
  const activeId = active && active.id;
  const selStart = active && "selectionStart" in active ? active.selectionStart : null;
  const selEnd = active && "selectionEnd" in active ? active.selectionEnd : null;

  const state = store.getState();
  const T = buildT(state, content);
  const view = VIEW_RENDERERS[state.view] || renderHome;
  root.innerHTML = renderShell(state, T, content, view(state, T));

  if (activeId) {
    const el = document.getElementById(activeId);
    if (el) {
      el.focus();
      if (selStart != null && "setSelectionRange" in el) {
        try { el.setSelectionRange(selStart, selEnd); } catch { /* not a text-capable input */ }
      }
    }
  }
}

store.subscribe(render);

// ---------------------------------------------------------------------------
// wiring
// ---------------------------------------------------------------------------

root.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const handler = actions[el.dataset.action];
  if (handler) {
    e.preventDefault();
    handler(el.dataset, e);
  }
});

root.addEventListener("input", (e) => {
  if (e.target.id === "palette-query") {
    store.setState({ query: e.target.value });
  }
});

root.addEventListener("change", (e) => {
  if (e.target.id === "lang-select") {
    store.setState({ lang: e.target.value });
    applyDocumentAttrs();
    persist();
  }
  if (e.target.id === "iv-module-select") {
    store.setState({ ivModule: e.target.value });
  }
});

document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    store.setState((s) => ({ palette: !s.palette, query: "" }));
  }
  if (e.key === "Escape") {
    store.setState({ palette: false, sidebar: false });
  }
});

// ---------------------------------------------------------------------------
// boot
// ---------------------------------------------------------------------------

async function boot() {
  const saved = await repo.load();
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  store.setState({
    lang: saved.lang || "en",
    theme: saved.theme || (prefersDark ? "dark" : "light"),
    completed: saved.completed || seeded,
    bookmarks: saved.bookmarks || [],
    recent: saved.recent || ["value-reference", "stack-heap"],
    stageProgress: saved.stageProgress || {}
  });
  applyDocumentAttrs();
  render();
}

boot();
