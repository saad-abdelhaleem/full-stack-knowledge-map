import { esc, L } from "../util.js";
import { allLessons, moduleById, modulePct } from "../lessons.js";
import { content } from "../data.js";

const WEEK_VALUES = [3, 5, 2, 0, 4, 6, 1];

export function renderHome(state, T) {
  const all = allLessons(content);
  const doneCount = all.filter((l) => state.completed.includes(l.id)).length;
  const remainingMins = all.filter((l) => !state.completed.includes(l.id)).reduce((a, l) => a + l.mins, 0);
  const overall = Math.round((doneCount / all.length) * 100);
  const nextLesson = all.find((l) => !state.completed.includes(l.id) && content.lessonDetail[l.id])
    || all.find((l) => !state.completed.includes(l.id)) || all[0];
  const curMod = moduleById(content, nextLesson.moduleId);
  const currentPct = modulePct(state, curMod);

  const stats = [
    { label: T.streak, value: "12", unit: state.lang === "ar" ? "يوم" : "days", note: state.lang === "ar" ? "أطول سلسلة: 18" : "Longest: 18 days" },
    { label: T.lessons_done, value: String(doneCount), unit: "/ " + all.length, note: `${overall}% ${T.overall.toLowerCase()}` },
    { label: T.time_left, value: String(Math.round(remainingMins / 60)), unit: T.hours_short, note: state.lang === "ar" ? "بمعدل 25 دقيقة يومياً" : "at 25 min a day" },
    { label: T.current_module, value: String(curMod.n), unit: "/ " + content.modules.length, note: L(state, curMod.title) }
  ];

  const dayLabels = state.lang === "ar" ? ["ح", "ن", "ث", "ر", "خ", "ج", "س"] : ["M", "T", "W", "T", "F", "S", "S"];
  const week = WEEK_VALUES.map((v, i) => ({
    h: Math.max(6, (v / 6) * 88) + "px",
    bg: v === 0 ? "var(--border2)" : v >= 5 ? "var(--accent)" : "color-mix(in oklab, var(--accent) 45%, var(--border2))",
    label: dayLabels[i]
  }));

  const recent = state.recent.map((id) => all.find((l) => l.id === id)).filter(Boolean);

  const achievements = [
    { label: T.ach_first, tone: "green", op: doneCount > 0 ? 1 : 0.4 },
    { label: T.ach_streak, tone: "blue", op: 1 },
    { label: T.ach_module, tone: "amber", op: content.modules.some((m) => modulePct(state, m) === 100) ? 1 : 0.4 },
    { label: T.ach_quiz, tone: "red", op: 0.4 }
  ];

  return `<div data-anim="in">
    <div style="font-family:var(--mono); font-size:11.5px; letter-spacing:.06em; text-transform:uppercase; color:var(--accent)">${esc(T.hero_kicker)}</div>
    <h1 style="margin:14px 0 0; font-size:clamp(28px, 4.2vw, 44px); line-height:1.1; letter-spacing:-.03em; font-weight:600; max-width:20ch; text-wrap:balance">${esc(T.hero_title)}</h1>
    <p style="margin:16px 0 0; font-size:16px; line-height:1.6; color:var(--fg2); max-width:62ch; text-wrap:pretty">${esc(T.hero_sub)}</p>

    <div style="display:flex; flex-wrap:wrap; gap:10px; margin-block-start:26px">
      <button class="btn-reset hv-bright" data-action="open-lesson" data-id="${esc(nextLesson.id)}" style="display:flex; align-items:center; gap:9px; padding:11px 18px; border-radius:11px; background:var(--accent); color:#fff; font-size:14px; font-weight:500; box-shadow:var(--shadow)">
        <span>${esc(T.continue_learning)}</span>
        <span style="font-family:var(--mono); opacity:.75">&rarr;</span>
      </button>
      <button class="btn-reset hv-border-fg" data-action="go" data-view="roadmap" style="padding:11px 18px; border-radius:11px; border:1px solid var(--border); background:var(--surface); font-size:14px; font-weight:500; color:var(--fg2)">${esc(T.browse_roadmap)}</button>
    </div>

    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(190px, 1fr)); gap:14px; margin-block-start:40px">
      ${stats.map((s) => `
        <div data-surface="1" class="card" style="padding:18px">
          <div style="font-size:11.5px; color:var(--fg3); letter-spacing:.01em">${esc(s.label)}</div>
          <div style="display:flex; align-items:baseline; gap:6px; margin-block-start:10px">
            <span style="font-size:30px; font-weight:600; letter-spacing:-.03em; line-height:1">${esc(s.value)}</span>
            <span style="font-size:12.5px; color:var(--fg3)">${esc(s.unit)}</span>
          </div>
          <div style="font-size:12px; color:var(--fg3); margin-block-start:8px">${esc(s.note)}</div>
        </div>`).join("")}
    </div>

    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:16px; margin-block-start:16px">
      <div data-surface="1" class="card" style="padding:20px">
        <div style="display:flex; align-items:center; justify-content:space-between; gap:12px">
          <span style="font-size:11.5px; font-weight:600; letter-spacing:.07em; text-transform:uppercase; color:var(--fg3)">${esc(T.current_module)}</span>
          <span data-tone="blue" style="font-size:10.5px; font-weight:600; padding:3px 8px; border-radius:20px">${esc(T.status_current)}</span>
        </div>
        <div style="display:flex; align-items:center; gap:16px; margin-block-start:16px">
          <div style="width:64px; height:64px; border-radius:50%; flex:none; background:conic-gradient(var(--accent) ${currentPct / 100}turn, var(--border2) 0); display:grid; place-items:center">
            <span style="width:50px; height:50px; border-radius:50%; background:var(--surface); display:grid; place-items:center; font-family:var(--mono); font-size:12.5px; font-weight:500">${currentPct}%</span>
          </div>
          <div style="min-width:0">
            <div style="font-size:16px; font-weight:600; letter-spacing:-.015em">${esc(L(state, curMod.title))}</div>
            <div style="font-size:13px; color:var(--fg2); margin-block-start:5px; line-height:1.5">${esc(L(state, curMod.blurb))}</div>
          </div>
        </div>
        <button class="btn-reset hv-border" data-action="open-lesson" data-id="${esc(nextLesson.id)}" style="margin-block-start:18px; width:100%; padding:10px; border-radius:10px; border:1px solid var(--border); background:var(--surface2); font-size:13px; font-weight:500; color:var(--fg); text-align:center">${esc(T.resume)} &middot; ${esc(L(state, nextLesson.title))}</button>
      </div>

      <div data-surface="1" class="card" style="padding:20px">
        <div style="font-size:11.5px; font-weight:600; letter-spacing:.07em; text-transform:uppercase; color:var(--fg3)">${esc(T.this_week)}</div>
        <div style="display:flex; align-items:flex-end; gap:8px; height:96px; margin-block-start:18px">
          ${week.map((d) => `
            <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:8px">
              <div style="width:100%; border-radius:6px 6px 3px 3px; background:${d.bg}; height:${d.h}"></div>
              <span style="font-family:var(--mono); font-size:10px; color:var(--fg3)">${esc(d.label)}</span>
            </div>`).join("")}
        </div>
        <div style="font-size:12.5px; color:var(--fg2); margin-block-start:16px; line-height:1.5">${esc(T.keep_going)}</div>
      </div>
    </div>

    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:16px; margin-block-start:16px">
      <div data-surface="1" class="card" style="padding:20px">
        <div style="font-size:11.5px; font-weight:600; letter-spacing:.07em; text-transform:uppercase; color:var(--fg3)">${esc(T.recently_viewed)}</div>
        <div style="display:flex; flex-direction:column; gap:2px; margin-block-start:12px">
          ${recent.map((l) => `
            <button class="btn-reset hv-surface" data-action="open-lesson" data-id="${esc(l.id)}" style="display:flex; align-items:center; gap:10px; padding:9px 10px; margin-inline:-10px; border-radius:9px">
              <span style="width:5px; height:5px; border-radius:50%; background:var(--fg3); flex:none"></span>
              <span style="flex:1; min-width:0; font-size:13.5px; color:var(--fg); overflow:hidden; text-overflow:ellipsis; white-space:nowrap">${esc(L(state, l.title))}</span>
              <span style="font-family:var(--mono); font-size:10.5px; color:var(--fg3); flex:none">${l.mins} ${esc(T.min)}</span>
            </button>`).join("")}
        </div>
      </div>
      <div data-surface="1" class="card" style="padding:20px">
        <div style="font-size:11.5px; font-weight:600; letter-spacing:.07em; text-transform:uppercase; color:var(--fg3)">${esc(T.achievements)}</div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(120px,1fr)); gap:10px; margin-block-start:14px">
          ${achievements.map((a) => `
            <div style="border:1px solid var(--border2); border-radius:11px; padding:12px; opacity:${a.op}">
              <span data-tone="${a.tone}" style="display:grid; place-items:center; width:22px; height:22px; border-radius:7px">
                <span style="width:7px; height:7px; border-radius:2px; background:currentColor; transform:rotate(45deg)"></span>
              </span>
              <div style="font-size:12px; color:var(--fg2); margin-block-start:10px; line-height:1.35">${esc(a.label)}</div>
            </div>`).join("")}
        </div>
      </div>
    </div>
  </div>`;
}
