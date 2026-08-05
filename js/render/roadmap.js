import { esc, L } from "../util.js";
import { modulePct, moduleStatus } from "../lessons.js";
import { content } from "../data.js";

export function renderRoadmap(state, T) {
  const rows = content.modules.map((m, i) => {
    const st = moduleStatus(state, m);
    const tone = st === "done" ? "green" : st === "current" ? "blue" : "grey";
    const locked = st === "locked";
    const side = i % 2 === 0 ? "l" : "r";
    const pct = modulePct(state, m);
    const dot = st === "done" ? "var(--ok)" : st === "current" ? "var(--accent)" : "var(--border)";
    const dotRing = st === "current" ? "var(--accent)" : "var(--border)";
    const border = st === "current" ? "color-mix(in oklab, var(--accent) 40%, var(--border))" : "var(--border)";
    const shadow = st === "current" ? "var(--shadow)" : "none";
    const barBg = st === "done" ? "var(--ok)" : "var(--accent)";
    const nLabel = (m.n < 10 ? "0" : "") + m.n;

    return `<div data-rmrow="1" data-side="${side}" style="min-height:126px">
      <div data-rmspine="1" style="grid-column:2; justify-self:center; align-self:stretch; position:relative; display:grid; place-items:center; width:100%">
        <span style="position:absolute; inset-block:0; inset-inline-start:50%; width:2px; margin-inline-start:-1px; background:linear-gradient(var(--border2), var(--border))"></span>
        <span style="position:relative; width:15px; height:15px; border-radius:50%; background:${dot}; border:3px solid var(--bg); box-shadow:0 0 0 1.5px ${dotRing}"></span>
      </div>
      <button data-rmcard="1" data-surface="1" class="btn-reset hv-lift" data-action="go-module" data-id="${esc(m.id)}" style="background:var(--surface); border:1px solid ${border}; border-radius:14px; padding:18px; box-shadow:${shadow}; opacity:${locked ? 0.55 : 1}; cursor:pointer">
        <div style="display:flex; align-items:center; gap:10px">
          <span data-tone="${tone}" style="font-family:var(--mono); font-size:10.5px; font-weight:500; padding:3px 7px; border-radius:6px">${nLabel}</span>
          <span data-tone="${tone}" style="font-size:10.5px; font-weight:600; letter-spacing:.02em; padding:3px 8px; border-radius:20px">${esc(T["status_" + st])}</span>
          <span style="flex:1"></span>
          <span style="font-family:var(--mono); font-size:11px; color:var(--fg3)">${m.hours} ${esc(T.hours_short)}</span>
        </div>
        <div style="font-size:17px; font-weight:600; letter-spacing:-.02em; margin-block-start:12px">${esc(L(state, m.title))}</div>
        <div style="font-size:13px; line-height:1.55; color:var(--fg2); margin-block-start:7px; text-wrap:pretty">${esc(L(state, m.blurb))}</div>
        <div style="display:flex; flex-wrap:wrap; gap:6px; margin-block-start:14px">
          ${m.topics.map((t) => `<span class="chip">${esc(L(state, t.title))}</span>`).join("")}
        </div>
        <div style="display:flex; align-items:center; gap:10px; margin-block-start:16px">
          <span style="flex:1; height:4px; border-radius:4px; background:var(--border2); overflow:hidden">
            <span style="display:block; height:100%; width:${pct}%; background:${barBg}; border-radius:4px; transition:width .4s ease"></span>
          </span>
          <span style="font-family:var(--mono); font-size:11px; color:var(--fg3)">${pct}%</span>
        </div>
      </button>
    </div>`;
  }).join("");

  return `<div data-anim="in">
    <h1 style="margin:0; font-size:clamp(24px,3.4vw,34px); font-weight:600; letter-spacing:-.028em">${esc(T.roadmap_title)}</h1>
    <p style="margin:12px 0 0; font-size:15px; line-height:1.6; color:var(--fg2); max-width:66ch; text-wrap:pretty">${esc(T.roadmap_sub)}</p>
    <div style="display:flex; flex-direction:column; margin-block-start:36px">${rows}</div>
  </div>`;
}
