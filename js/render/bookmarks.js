import { esc, L } from "../util.js";
import { findLesson, moduleById } from "../lessons.js";
import { content } from "../data.js";

export function renderBookmarks(state, T) {
  const items = state.bookmarks.map((id) => findLesson(content, id)).filter(Boolean);

  const rows = items.map((l) => `
    <button class="btn-reset hv-border" data-action="open-lesson" data-id="${esc(l.id)}" data-surface="1" style="display:flex; align-items:center; gap:12px; padding:15px 17px; background:var(--surface); border:1px solid var(--border); border-radius:13px">
      <span style="width:7px; height:7px; border-radius:2px; background:var(--accent); flex:none"></span>
      <span style="flex:1; min-width:0">
        <span style="display:block; font-size:14.5px; font-weight:500; color:var(--fg)">${esc(L(state, l.title))}</span>
        <span style="display:block; font-size:11.5px; color:var(--fg3); margin-block-start:4px">${esc(L(state, moduleById(content, l.moduleId).title))}</span>
      </span>
      <span style="font-family:var(--mono); font-size:11px; color:var(--fg3)">${l.mins} ${esc(T.min)}</span>
    </button>`).join("");

  const empty = items.length === 0
    ? `<div style="padding:40px 20px; text-align:center; font-size:13.5px; color:var(--fg3); border:1px dashed var(--border); border-radius:14px; text-wrap:pretty">${esc(T.no_bookmarks)}</div>`
    : "";

  return `<div data-anim="in">
    <h1 style="margin:0; font-size:clamp(24px,3.4vw,34px); font-weight:600; letter-spacing:-.028em">${esc(T.nav_bookmarks)}</h1>
    <div style="display:flex; flex-direction:column; gap:9px; margin-block-start:26px; max-width:640px">${rows}${empty}</div>
  </div>`;
}
