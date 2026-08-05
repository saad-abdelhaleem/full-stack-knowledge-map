import { esc, L } from "../util.js";
import { moduleById, modulePct, moduleStatus } from "../lessons.js";
import { content } from "../data.js";

export function renderModule(state, T) {
  const m = moduleById(content, state.moduleId);
  const st = moduleStatus(state, m);
  const tone = st === "done" ? "green" : st === "current" ? "blue" : "grey";
  const mLessons = m.topics.flatMap((t) => t.lessons);
  const nLabel = (m.n < 10 ? "0" : "") + m.n;

  const topics = m.topics.map((t, i) => {
    const open = state.openTopics[t.id] !== undefined ? state.openTopics[t.id] : true;
    const done = t.lessons.filter((l) => state.completed.includes(l.id)).length;
    const index = (i + 1 < 10 ? "0" : "") + (i + 1);

    const lessons = t.lessons.map((l) => {
      const isDone = state.completed.includes(l.id);
      return `<button class="btn-reset hv-surface" data-action="open-lesson" data-id="${esc(l.id)}" style="width:100%; display:flex; align-items:center; gap:12px; padding:11px 12px; border-radius:10px">
        <span data-tone="${isDone ? "green" : "grey"}" style="width:19px; height:19px; border-radius:50%; display:grid; place-items:center; flex:none; font-size:10px">${isDone ? "&#10003;" : ""}</span>
        <span style="flex:1; min-width:0; font-size:13.5px; color:var(--fg)">${esc(L(state, l.title))}</span>
        ${l.deep ? `<span data-tone="blue" style="font-size:10px; font-weight:600; letter-spacing:.03em; text-transform:uppercase; padding:2px 7px; border-radius:5px; flex:none">deep dive</span>` : ""}
        <span style="font-family:var(--mono); font-size:10.5px; color:var(--fg3); flex:none">${l.mins} ${esc(T.min)}</span>
      </button>`;
    }).join("");

    return `<div data-surface="1" class="card" style="overflow:hidden">
      <button class="btn-reset hv-surface" data-action="toggle-topic" data-id="${esc(t.id)}" style="width:100%; display:flex; align-items:center; gap:12px; padding:16px 18px">
        <span style="font-family:var(--mono); font-size:11px; color:var(--fg3); flex:none">${index}</span>
        <span style="flex:1; min-width:0; font-size:15px; font-weight:600; letter-spacing:-.015em">${esc(L(state, t.title))}</span>
        <span style="font-size:11.5px; color:var(--fg3)">${done}/${t.lessons.length} ${esc(T.lessons)}</span>
        <span style="font-family:var(--mono); font-size:12px; color:var(--fg3); transform:rotate(${open ? "180deg" : "0deg"}); transition:transform .2s ease">&#9662;</span>
      </button>
      ${open ? `<div style="border-block-start:1px solid var(--border2); padding:6px">${lessons}</div>` : ""}
    </div>`;
  }).join("");

  return `<div data-anim="in">
    <div style="display:flex; align-items:center; gap:10px">
      <span data-tone="${tone}" style="font-family:var(--mono); font-size:11px; padding:4px 8px; border-radius:7px">${nLabel}</span>
      <span data-tone="${tone}" style="font-size:10.5px; font-weight:600; padding:3px 9px; border-radius:20px">${esc(T["status_" + st])}</span>
    </div>
    <h1 style="margin:16px 0 0; font-size:clamp(24px,3.4vw,34px); font-weight:600; letter-spacing:-.028em">${esc(L(state, m.title))}</h1>
    <p style="margin:12px 0 0; font-size:15px; line-height:1.6; color:var(--fg2); max-width:66ch; text-wrap:pretty">${esc(L(state, m.blurb))}</p>

    <div style="display:flex; align-items:center; gap:24px; margin-block-start:24px; padding:16px 0; border-block:1px solid var(--border2)">
      <div>
        <div style="font-family:var(--mono); font-size:20px; font-weight:500">${modulePct(state, m)}%</div>
        <div style="font-size:11.5px; color:var(--fg3); margin-block-start:3px">${esc(T.overall)}</div>
      </div>
      <div>
        <div style="font-family:var(--mono); font-size:20px; font-weight:500">${mLessons.length}</div>
        <div style="font-size:11.5px; color:var(--fg3); margin-block-start:3px">${esc(T.lessons)}</div>
      </div>
      <div>
        <div style="font-family:var(--mono); font-size:20px; font-weight:500">${m.hours} ${esc(T.hours_short)}</div>
        <div style="font-size:11.5px; color:var(--fg3); margin-block-start:3px">${esc(T.time_left)}</div>
      </div>
    </div>

    <div style="display:flex; flex-direction:column; gap:14px; margin-block-start:28px">${topics}</div>
  </div>`;
}
