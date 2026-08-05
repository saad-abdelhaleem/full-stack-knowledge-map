import { esc, L } from "../util.js";
import { allLessons, allInterviewQuestions, moduleById, modulePct, moduleStatus } from "../lessons.js";
import { LEVEL_TONE } from "../constants.js";

function renderPalette(state, T, content) {
  if (!state.palette) return "";
  const q = state.query.trim().toLowerCase();
  const all = allLessons(content);
  const ivAll = allInterviewQuestions(content);
  let results = [];
  if (q) {
    content.modules.forEach((mm) => {
      if (L(state, mm.title).toLowerCase().includes(q)) {
        results.push({ kind: T.modules, tone: "grey", title: L(state, mm.title), sub: L(state, mm.blurb).slice(0, 70), action: `data-action="palette-go-module" data-id="${esc(mm.id)}"` });
      }
    });
    all.forEach((l) => {
      if (L(state, l.title).toLowerCase().includes(q)) {
        results.push({ kind: T.stage_read, tone: "blue", title: L(state, l.title), sub: `${esc(L(state, l.module.title))} · ${l.mins} ${T.min}`, action: `data-action="palette-go-lesson" data-id="${esc(l.id)}"` });
      }
    });
    ivAll.forEach((iq) => {
      if (L(state, iq.q).toLowerCase().includes(q)) {
        results.push({ kind: T["level_" + iq.level], tone: LEVEL_TONE[iq.level], title: L(state, iq.q), sub: L(state, iq.lesson.title), action: `data-action="palette-go-lesson" data-id="${esc(iq.lesson.id)}"` });
      }
    });
    results = results.slice(0, 12);
  } else {
    results = all.slice(0, 6).map((l) => ({ kind: T.stage_read, tone: "blue", title: L(state, l.title), sub: L(state, l.module.title), action: `data-action="palette-go-lesson" data-id="${esc(l.id)}"` }));
  }
  const noResults = q.length > 0 && results.length === 0;

  return `<div style="position:fixed; inset:0; z-index:90; background:color-mix(in oklab, #05070a 46%, transparent); backdrop-filter:blur(3px); display:flex; align-items:flex-start; justify-content:center; padding:12vh 16px 16px" data-action="close-palette">
    <div data-anim="in" style="width:100%; max-width:640px; background:var(--surface); border:1px solid var(--border); border-radius:16px; box-shadow:var(--shadow); overflow:hidden" onclick="event.stopPropagation()">
      <div style="display:flex; align-items:center; gap:10px; padding:14px 16px; border-bottom:1px solid var(--border2)">
        <span style="width:7px; height:7px; border-radius:50%; background:var(--accent); flex:none"></span>
        <input id="palette-query" value="${esc(state.query)}" placeholder="${esc(T.search_ph)}" autofocus style="flex:1; min-width:0; border:0; background:transparent; outline:none; font-size:15px; padding:2px 0" />
        <span class="kbd">esc</span>
      </div>
      <div style="max-height:min(52vh, 420px); overflow:auto; padding:8px">
        ${results.map((r) => `
          <button class="btn-reset hv-surface" ${r.action} style="width:100%; display:flex; align-items:center; gap:12px; border-radius:10px; padding:10px 12px">
            <span data-tone="${r.tone}" style="font-size:10px; font-weight:600; letter-spacing:.04em; text-transform:uppercase; padding:3px 7px; border-radius:6px; flex:none">${esc(r.kind)}</span>
            <span style="flex:1; min-width:0">
              <span style="display:block; font-size:14px; font-weight:500; color:var(--fg); overflow:hidden; text-overflow:ellipsis; white-space:nowrap">${esc(r.title)}</span>
              <span style="display:block; font-size:12px; color:var(--fg3); margin-block-start:2px">${esc(r.sub)}</span>
            </span>
          </button>`).join("")}
        ${noResults ? `<div style="padding:28px 12px; text-align:center; font-size:13px; color:var(--fg3)">${esc(T.no_results)}</div>` : ""}
      </div>
    </div>
  </div>`;
}

function renderSidebar(state, T, content) {
  const navDef = [
    { id: "home", label: T.nav_home, meta: "" },
    { id: "roadmap", label: T.nav_roadmap, meta: String(content.modules.length) },
    { id: "interview", label: T.nav_interview, meta: String(allInterviewQuestions(content).length) },
    { id: "bookmarks", label: T.nav_bookmarks, meta: state.bookmarks.length ? String(state.bookmarks.length) : "" }
  ];

  const moduleNav = content.modules.map((m) => {
    const st = moduleStatus(state, m);
    const active = state.view !== "home" && state.moduleId === m.id;
    const tone = st === "done" ? "green" : st === "current" ? "blue" : "grey";
    return `<button class="btn-reset hv-surface" data-action="go-module" data-id="${esc(m.id)}" style="display:flex; align-items:center; gap:10px; padding:7px 12px; border-radius:9px; background:${active ? "var(--surface2)" : "transparent"}">
      <span data-tone="${tone}" style="width:20px; height:20px; border-radius:6px; display:grid; place-items:center; font-family:var(--mono); font-size:10px; font-weight:500; flex:none">${m.n}</span>
      <span style="flex:1; min-width:0; font-size:13px; color:${st === "locked" ? "var(--fg3)" : "var(--fg)"}; overflow:hidden; text-overflow:ellipsis; white-space:nowrap">${esc(L(state, m.title))}</span>
      <span style="font-family:var(--mono); font-size:10.5px; color:var(--fg3)">${modulePct(state, m)}%</span>
    </button>`;
  }).join("");

  return `<aside data-sidebar="1" data-open="${state.sidebar ? "1" : "0"}" style="width:272px; flex:none; height:100vh; background:var(--surface); border-inline-end:1px solid var(--border); display:flex; flex-direction:column; transition:transform .26s cubic-bezier(.2,.7,.3,1), background-color .28s ease">
    <div style="padding:20px 20px 14px">
      <button class="btn-reset" data-action="go" data-view="home" style="display:flex; align-items:center; gap:10px">
        <span style="width:26px; height:26px; border-radius:8px; background:var(--accent); display:grid; place-items:center; flex:none">
          <span style="width:8px; height:8px; border-radius:2px; background:#fff; transform:rotate(45deg)"></span>
        </span>
        <span style="font-size:14px; font-weight:600; letter-spacing:-.01em; line-height:1.2">${esc(T.brand)}</span>
      </button>
    </div>

    <button class="btn-reset hv-border-fg" data-action="open-palette" style="margin:0 16px 16px; display:flex; align-items:center; gap:9px; padding:9px 11px; border:1px solid var(--border); background:var(--surface2); border-radius:10px; font-size:13px; color:var(--fg3)">
      <span style="width:11px; height:11px; border:1.5px solid currentColor; border-radius:50%; flex:none"></span>
      <span style="flex:1; text-align:start">${esc(T.search)}</span>
      <span class="kbd">⌘K</span>
    </button>

    <nav style="padding:0 12px; display:flex; flex-direction:column; gap:2px">
      ${navDef.map((n) => `
        <button class="btn-reset hv-surface-fg" data-action="go" data-view="${n.id}" data-tone="${state.view === n.id ? "blue" : "grey"}" style="display:flex; align-items:center; justify-content:space-between; gap:8px; padding:8px 12px; border-radius:9px; font-size:13.5px; font-weight:500; color:var(--fg2)">
          <span>${esc(n.label)}</span>
          <span style="font-family:var(--mono); font-size:11px; opacity:.7">${esc(n.meta)}</span>
        </button>`).join("")}
    </nav>

    <div style="margin:20px 0 8px; padding:0 20px; font-size:10.5px; font-weight:600; letter-spacing:.09em; text-transform:uppercase; color:var(--fg3)">${esc(T.modules)}</div>
    <div style="flex:1; overflow:auto; padding:0 12px 20px; display:flex; flex-direction:column; gap:1px">${moduleNav}</div>
  </aside>`;
}

function renderCrumbs(state, T, content) {
  const crumbs = [{ label: T.brand, fg: "var(--fg3)", action: `data-action="go" data-view="home"` }];
  const m = moduleById(content, state.moduleId);
  if (state.view === "roadmap") crumbs.push({ label: "/ " + T.nav_roadmap, fg: "var(--fg2)", action: "" });
  if (state.view === "interview") crumbs.push({ label: "/ " + T.nav_interview, fg: "var(--fg2)", action: "" });
  if (state.view === "bookmarks") crumbs.push({ label: "/ " + T.nav_bookmarks, fg: "var(--fg2)", action: "" });
  if (state.view === "module" || state.view === "lesson") {
    crumbs.push({ label: "/ " + L(state, m.title), fg: "var(--fg2)", action: `data-action="go-module" data-id="${esc(m.id)}"` });
  }
  if (state.view === "lesson" && state.lessonId) {
    const lref = allLessons(content).find((l) => l.id === state.lessonId);
    if (lref) crumbs.push({ label: "/ " + L(state, lref.title), fg: "var(--fg)", action: "" });
  }
  return crumbs.map((c) => `<button class="btn-reset hv-fg" ${c.action} style="font-size:12.5px; color:${c.fg}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:42ch">${esc(c.label)}</button>`).join("");
}

function renderHeader(state, T, content) {
  return `<header style="position:sticky; top:0; z-index:40; display:flex; align-items:center; gap:12px; padding:12px 24px; background:color-mix(in oklab, var(--bg) 88%, transparent); backdrop-filter:blur(10px); border-block-end:1px solid var(--border2)">
    <button data-menubtn="1" data-action="open-sidebar" aria-label="Menu" style="display:flex; align-items:center; justify-content:center; width:32px; height:32px; border:1px solid var(--border); background:var(--surface); border-radius:9px; flex:none">
      <span style="display:block; width:13px; height:1.5px; background:var(--fg2); box-shadow:0 4px 0 var(--fg2), 0 -4px 0 var(--fg2)"></span>
    </button>
    <div style="flex:1; min-width:0; display:flex; align-items:center; gap:7px; font-size:12.5px; color:var(--fg3); overflow:hidden">${renderCrumbs(state, T, content)}</div>
    <div style="display:flex; align-items:center; gap:8px; flex:none">
      <select id="lang-select" aria-label="${esc(T.language)}" style="appearance:none; border:1px solid var(--border); background:var(--surface); border-radius:9px; padding:6px 10px; font-size:12.5px; color:var(--fg2)">
        <option value="en" ${state.lang === "en" ? "selected" : ""}>English</option>
        <option value="ar" ${state.lang === "ar" ? "selected" : ""}>العربية</option>
      </select>
      <button class="btn-reset hv-border-fg" data-action="toggle-theme" aria-label="${esc(T.theme_label)}" style="display:flex; align-items:center; gap:7px; border:1px solid var(--border); background:var(--surface); border-radius:9px; padding:6px 10px; font-size:12.5px; color:var(--fg2)">
        <span style="width:11px; height:11px; border-radius:50%; border:1.5px solid currentColor; background:${state.theme === "dark" ? "currentColor" : "transparent"}"></span>
        <span>${esc(T.theme_label)}</span>
      </button>
    </div>
  </header>`;
}

export function renderShell(state, T, content, mainHtml) {
  return `
    ${renderPalette(state, T, content)}
    <div data-scrim="1" style="position:fixed; inset:0; z-index:50; background:color-mix(in oklab, #05070a 40%, transparent); opacity:${state.sidebar ? 1 : 0}; pointer-events:${state.sidebar ? "auto" : "none"}; transition:opacity .2s ease" data-action="close-sidebar"></div>
    <div style="display:flex; align-items:flex-start; max-width:1680px; margin:0 auto">
      ${renderSidebar(state, T, content)}
      <div style="flex:1; min-width:0">
        ${renderHeader(state, T, content)}
        <main style="padding:32px 24px 96px; max-width:1160px">${mainHtml}</main>
      </div>
    </div>`;
}
