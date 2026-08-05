import { esc, L } from "../util.js";
import { allInterviewQuestions, moduleById } from "../lessons.js";
import { content } from "../data.js";
import { LEVEL_TONE } from "../constants.js";

const LEVELS = ["all", "junior", "mid", "senior", "staff"];

export function renderInterview(state, T) {
  const ivAll = allInterviewQuestions(content);
  const moduleIds = Array.from(new Set(ivAll.map((q) => q.module.id)));

  const levelChips = LEVELS.map((lv) => {
    const active = state.ivLevel === lv;
    const label = lv === "all" ? T.all_levels : T["level_" + lv];
    return `<button class="btn-reset" data-action="set-iv-level" data-level="${lv}" style="padding:7px 14px; border-radius:20px; border:1px solid ${active ? "var(--accent)" : "var(--border)"}; background:${active ? "var(--accent-soft)" : "var(--surface)"}; color:${active ? "var(--accent)" : "var(--fg2)"}; font-size:12.5px; font-weight:500">${esc(label)}</button>`;
  }).join("");

  const moduleOptions = [`<option value="all" ${state.ivModule === "all" ? "selected" : ""}>${esc(T.all_modules)}</option>`]
    .concat(moduleIds.map((id) => `<option value="${esc(id)}" ${state.ivModule === id ? "selected" : ""}>${esc(L(state, moduleById(content, id).title))}</option>`))
    .join("");

  const filtered = ivAll.filter((q) => (state.ivLevel === "all" || q.level === state.ivLevel) && (state.ivModule === "all" || q.module.id === state.ivModule));
  const items = filtered
    .map((q) => {
      const open = !!state.openQa["iv-" + q.key];
      return `<div data-surface="1" class="card" style="overflow:hidden">
        <button class="btn-reset hv-surface" data-action="toggle-qa" data-key="iv-${esc(q.key)}" style="width:100%; display:flex; align-items:flex-start; gap:12px; padding:15px 17px">
          <span data-tone="${LEVEL_TONE[q.level]}" style="font-size:10.5px; font-weight:600; padding:3px 8px; border-radius:20px; flex:none">${esc(T["level_" + q.level])}</span>
          <span style="flex:1; min-width:0">
            <span style="display:block; font-size:14.5px; font-weight:500; line-height:1.5; color:var(--fg); text-wrap:pretty">${esc(L(state, q.q))}</span>
            <span style="display:block; font-size:11.5px; color:var(--fg3); margin-block-start:6px">${esc(L(state, q.module.title))} &middot; ${esc(L(state, q.lesson.title))}</span>
          </span>
          <span style="font-size:11.5px; color:var(--fg3); flex:none; white-space:nowrap">${open ? esc(T.hide_answer) : esc(T.show_answer)}</span>
        </button>
        ${open ? `<div style="padding:0 17px 17px; margin-inline-start:58px">
          <div style="border-inline-start:2px solid var(--accent); padding-inline-start:14px; font-size:14px; line-height:1.7; color:var(--fg2); text-wrap:pretty">${esc(L(state, q.a))}</div>
        </div>` : ""}
      </div>`;
    }).join("");

  return `<div data-anim="in">
    <h1 style="margin:0; font-size:clamp(24px,3.4vw,34px); font-weight:600; letter-spacing:-.028em">${esc(T.iv_title)}</h1>
    <p style="margin:12px 0 0; font-size:15px; line-height:1.6; color:var(--fg2); max-width:64ch; text-wrap:pretty">${esc(T.iv_sub)}</p>

    <div style="display:flex; flex-wrap:wrap; gap:7px; margin-block-start:26px">${levelChips}</div>
    <div style="display:flex; align-items:center; gap:12px; margin-block-start:14px">
      <select id="iv-module-select" style="appearance:none; border:1px solid var(--border); background:var(--surface); border-radius:9px; padding:7px 12px; font-size:12.5px; color:var(--fg2)">${moduleOptions}</select>
      <span style="font-family:var(--mono); font-size:11.5px; color:var(--fg3)">${filtered.length} ${esc(T.questions)}</span>
    </div>

    <div style="display:flex; flex-direction:column; gap:10px; margin-block-start:24px">${items}</div>
  </div>`;
}
