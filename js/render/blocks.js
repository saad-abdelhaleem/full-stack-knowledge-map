// Renders one content block from a lesson section (or, for "qa", an
// interview-browser item). Mirrors the block types authored in js/content.js:
// p, ul, code, callout, kv, diagram, tradeoff, mistake, qa, review, ex, ref.

import { esc, L } from "../util.js";
import { LEVEL_TONE, DIFF_TONE, SEV_TONE } from "../constants.js";
import { threadpoolDiagram, gcHeapDiagram } from "../diagrams.js";

const CALLOUT_TONE = { warn: "amber", tip: "green", note: "blue" };

export function renderBlock(state, T, b, keyBase) {
  switch (b.t) {
    case "p":
      return `<p style="margin:0; font-size:15px; line-height:1.72; color:var(--fg2); max-width:70ch; text-wrap:pretty">${esc(L(state, b))}</p>`;

    case "ul": {
      const items = (b[state.lang] || b.en) || [];
      return `<div style="display:flex; flex-direction:column; gap:9px; max-width:70ch">
        ${items.map((x) => `
          <div style="display:flex; gap:11px; align-items:flex-start">
            <span style="width:5px; height:5px; border-radius:50%; background:var(--fg3); flex:none; margin-block-start:8px"></span>
            <span style="font-size:14.5px; line-height:1.62; color:var(--fg2); text-wrap:pretty">${esc(x)}</span>
          </div>`).join("")}
      </div>`;
    }

    case "code": {
      const copied = state.copied === keyBase;
      return `<div style="border:1px solid var(--border); border-radius:12px; overflow:hidden; background:var(--code-bg)">
        <div style="display:flex; align-items:center; gap:10px; padding:9px 13px; border-block-end:1px solid var(--border2)">
          <span style="font-family:var(--mono); font-size:11px; color:var(--fg3)">${esc(L(state, b.label))}</span>
          <span style="flex:1"></span>
          <span style="font-family:var(--mono); font-size:10.5px; color:var(--fg3)">${esc(b.lang)}</span>
          <button class="btn-reset hv-border-fg" data-action="copy-code" data-key="${esc(keyBase)}" data-code="${esc(b.code)}" style="background:transparent; border:1px solid var(--border); border-radius:6px; padding:3px 8px; font-size:11px; color:var(--fg3)">${copied ? esc(T.copied) : esc(T.copy)}</button>
        </div>
        <pre dir="ltr" style="margin:0; padding:15px 16px; overflow:auto; text-align:left; font-family:var(--mono); font-size:12.5px; line-height:1.7; color:var(--fg2)">${esc(b.code)}</pre>
      </div>`;
    }

    case "callout": {
      const tone = CALLOUT_TONE[b.kind] || "blue";
      return `<div data-tone="${tone}" style="display:flex; gap:13px; padding:15px 16px; border-radius:12px; max-width:72ch">
        <span style="width:6px; height:6px; border-radius:50%; background:currentColor; flex:none; margin-block-start:8px"></span>
        <span style="font-size:14px; line-height:1.65; color:var(--fg2); text-wrap:pretty">${esc(L(state, b))}</span>
      </div>`;
    }

    case "kv":
      return `<div style="border:1px solid var(--border); border-radius:12px; overflow:hidden; background:var(--surface)">
        ${b.rows.map((row) => `
          <div style="display:grid; grid-template-columns:minmax(120px, 170px) minmax(0,1fr); gap:16px; padding:14px 16px; border-block-end:1px solid var(--border2)">
            <span style="font-size:13px; font-weight:600; color:var(--fg)">${esc(L(state, row.k))}</span>
            <span style="font-size:13.5px; line-height:1.6; color:var(--fg2); text-wrap:pretty">${esc(L(state, row.v))}</span>
          </div>`).join("")}
      </div>`;

    case "tradeoff": {
      const groups = [
        { label: T.pros, tone: "green", items: b.pros[state.lang] || b.pros.en },
        { label: T.cons, tone: "red", items: b.cons[state.lang] || b.cons.en },
        { label: T.limits, tone: "amber", items: b.limits[state.lang] || b.limits.en },
        { label: T.alts, tone: "blue", items: b.alts[state.lang] || b.alts.en }
      ];
      return `<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px,1fr)); gap:14px">
        ${groups.map((g) => `
          <div data-surface="1" class="card" style="padding:16px">
            <div style="display:flex; align-items:center; gap:8px">
              <span data-tone="${g.tone}" style="width:16px; height:16px; border-radius:5px; display:grid; place-items:center">
                <span style="width:5px; height:5px; border-radius:1px; background:currentColor"></span>
              </span>
              <span style="font-size:12px; font-weight:600; letter-spacing:.05em; text-transform:uppercase; color:var(--fg3)">${esc(g.label)}</span>
            </div>
            <div style="display:flex; flex-direction:column; gap:8px; margin-block-start:12px">
              ${g.items.map((it) => `<div style="font-size:13.5px; line-height:1.55; color:var(--fg2); text-wrap:pretty">${esc(it)}</div>`).join("")}
            </div>
          </div>`).join("")}
      </div>`;
    }

    case "mistake":
      return `<div data-surface="1" class="card" style="padding:16px 18px">
        <div style="display:flex; align-items:flex-start; gap:11px">
          <span data-tone="red" style="width:18px; height:18px; border-radius:50%; display:grid; place-items:center; flex:none; font-family:var(--mono); font-size:11px; margin-block-start:1px">&times;</span>
          <div style="min-width:0">
            <div style="font-size:14.5px; font-weight:600; letter-spacing:-.01em">${esc(L(state, b.title))}</div>
            <div style="font-size:14px; line-height:1.65; color:var(--fg2); margin-block-start:7px; text-wrap:pretty">${esc(L(state, b.body))}</div>
            ${b.fix ? `<pre dir="ltr" style="margin:12px 0 0; padding:12px 14px; background:var(--code-bg); border:1px solid var(--border2); border-radius:10px; overflow:auto; text-align:left; font-family:var(--mono); font-size:12px; line-height:1.65; color:var(--fg2)">${esc(b.fix)}</pre>` : ""}
          </div>
        </div>
      </div>`;

    case "qa": {
      const open = !!state.openQa[keyBase];
      const tone = LEVEL_TONE[b.level];
      return `<div data-surface="1" class="card" style="overflow:hidden">
        <button class="btn-reset hv-surface" data-action="toggle-qa" data-key="${esc(keyBase)}" style="width:100%; display:flex; align-items:flex-start; gap:12px; padding:15px 17px">
          <span data-tone="${tone}" style="font-size:10.5px; font-weight:600; letter-spacing:.03em; padding:3px 8px; border-radius:20px; flex:none">${esc(T["level_" + b.level])}</span>
          <span style="flex:1; min-width:0; font-size:14.5px; font-weight:500; line-height:1.5; color:var(--fg); text-wrap:pretty">${esc(L(state, b.q))}</span>
          <span style="font-size:11.5px; color:var(--fg3); flex:none; white-space:nowrap">${open ? esc(T.hide_answer) : esc(T.show_answer)}</span>
        </button>
        ${open ? `<div style="padding:0 17px 17px; margin-inline-start:58px">
          <div style="border-inline-start:2px solid var(--accent); padding-inline-start:14px; font-size:14px; line-height:1.7; color:var(--fg2); text-wrap:pretty">${esc(L(state, b.a))}</div>
        </div>` : ""}
      </div>`;
    }

    case "review": {
      const tone = SEV_TONE[b.severity];
      return `<div data-surface="1" class="card" style="overflow:hidden">
        <div style="display:flex; align-items:center; gap:10px; padding:14px 17px; border-block-end:1px solid var(--border2)">
          <span style="flex:1; min-width:0; font-size:14.5px; font-weight:600; letter-spacing:-.01em">${esc(L(state, b.title))}</span>
          <span style="font-size:11px; color:var(--fg3)">${esc(T.severity)}</span>
          <span data-tone="${tone}" style="font-size:10.5px; font-weight:600; padding:3px 9px; border-radius:20px">${esc(T["sev_" + b.severity])}</span>
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px,1fr)); gap:1px; background:var(--border2)">
          <div style="background:var(--surface)">
            <div style="display:flex; align-items:center; gap:8px; padding:11px 15px">
              <span style="width:6px; height:6px; border-radius:50%; background:var(--danger)"></span>
              <span style="font-size:11.5px; font-weight:600; color:var(--danger)">${esc(T.bad_code)}</span>
            </div>
            <pre dir="ltr" style="margin:0; padding:0 15px 16px; overflow:auto; text-align:left; font-family:var(--mono); font-size:12px; line-height:1.7; color:var(--fg2)">${esc(b.bad)}</pre>
          </div>
          <div style="background:var(--surface)">
            <div style="display:flex; align-items:center; gap:8px; padding:11px 15px">
              <span style="width:6px; height:6px; border-radius:50%; background:var(--ok)"></span>
              <span style="font-size:11.5px; font-weight:600; color:var(--ok)">${esc(T.good_code)}</span>
            </div>
            <pre dir="ltr" style="margin:0; padding:0 15px 16px; overflow:auto; text-align:left; font-family:var(--mono); font-size:12px; line-height:1.7; color:var(--fg2)">${esc(b.good)}</pre>
          </div>
        </div>
        <div style="padding:15px 17px; border-block-start:1px solid var(--border2); font-size:14px; line-height:1.68; color:var(--fg2); background:var(--surface2); text-wrap:pretty">${esc(L(state, b.why))}</div>
      </div>`;
    }

    case "ex":
      return `<div data-surface="1" class="card" style="display:flex; gap:14px; align-items:flex-start; padding:16px 18px">
        <span data-tone="${DIFF_TONE[b.diff]}" style="font-size:10.5px; font-weight:600; letter-spacing:.03em; padding:4px 9px; border-radius:20px; flex:none">${esc(T["diff_" + b.diff])}</span>
        <span style="flex:1; min-width:0; font-size:14.5px; line-height:1.65; color:var(--fg2); text-wrap:pretty">${esc(L(state, b))}</span>
      </div>`;

    case "ref":
      return `<a href="${esc(b.url)}" target="_blank" rel="noreferrer" class="hv-ref" style="display:flex; align-items:center; gap:12px; padding:12px 15px; border:1px solid var(--border); border-radius:11px; background:var(--surface); text-decoration:none">
        <span style="font-size:14px; color:var(--fg); flex:1; min-width:0; text-wrap:pretty">${esc(L(state, b.label))}</span>
        <span data-tone="grey" style="font-size:10.5px; font-weight:600; padding:3px 8px; border-radius:6px; flex:none">${esc(L(state, b.meta))}</span>
        <span style="font-family:var(--mono); font-size:12px; color:var(--fg3); flex:none">&#8599;</span>
      </a>`;

    case "diagram":
      if (b.name === "threadpool") return renderThreadpoolDiagram(state);
      if (b.name === "gcheap") return renderGcDiagram(state);
      return "";

    default:
      return "";
  }
}

function renderThreadpoolDiagram(state) {
  const d = threadpoolDiagram(state.lang);
  return `<div class="card" style="padding:20px; overflow:hidden">
    <div style="font-size:11.5px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:var(--fg3)">${esc(d.title)}</div>
    <div style="display:flex; flex-direction:column; gap:22px; margin-block-start:20px">
      <div>
        <div style="display:flex; align-items:center; gap:9px; margin-block-end:9px">
          <span style="width:7px; height:7px; border-radius:2px; background:var(--danger)"></span>
          <span style="font-size:12.5px; font-weight:600">${esc(d.sync)}</span>
        </div>
        <div style="height:34px; border-radius:9px; background:var(--code-bg); border:1px solid var(--border2); display:flex; overflow:hidden">
          <div style="width:100%; background:color-mix(in oklab, var(--danger) 20%, transparent); display:grid; place-items:center; font-size:11.5px; color:var(--fg2)">${esc(d.syncLabel)}</div>
        </div>
      </div>
      <div>
        <div style="display:flex; align-items:center; gap:9px; margin-block-end:9px">
          <span style="width:7px; height:7px; border-radius:2px; background:var(--ok)"></span>
          <span style="font-size:12.5px; font-weight:600">${esc(d.async)}</span>
        </div>
        <div style="height:34px; border-radius:9px; background:var(--code-bg); border:1px solid var(--border2); display:flex; overflow:hidden; position:relative">
          <div style="width:7%; background:color-mix(in oklab, var(--ok) 34%, transparent)"></div>
          <div style="flex:1; display:grid; place-items:center; font-size:11.5px; color:var(--fg3); position:relative; overflow:hidden">
            <span style="position:absolute; inset-block:0; width:34%; background:linear-gradient(90deg, transparent, color-mix(in oklab, var(--accent) 16%, transparent), transparent); animation:bkm-sweep 2.8s linear infinite"></span>
            <span style="position:relative">${esc(d.wait)}</span>
          </div>
          <div style="width:9%; background:color-mix(in oklab, var(--ok) 34%, transparent)"></div>
        </div>
      </div>
    </div>
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px,1fr)); gap:12px; margin-block-start:20px; padding-block-start:16px; border-block-start:1px solid var(--border2)">
      ${d.notes.map((n) => `<div style="font-size:12px; line-height:1.55; color:var(--fg3); text-wrap:pretty">${esc(n)}</div>`).join("")}
    </div>
  </div>`;
}

function renderGcDiagram(state) {
  const d = gcHeapDiagram(state.lang);
  return `<div class="card" style="padding:20px; overflow:hidden">
    <div style="font-size:11.5px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:var(--fg3)">${esc(d.title)}</div>
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px,1fr)); gap:10px; margin-block-start:18px">
      ${d.bands.map((g) => `
        <div style="border:1px solid color-mix(in oklab, var(--${g.tone}) ${g.tone === "ok" ? 30 : g.tone === "accent" ? 26 : g.tone === "warn" ? 28 : 26}%, var(--border)); border-radius:12px; padding:14px; background:color-mix(in oklab, var(--${g.tone}) ${g.tone === "ok" ? 10 : g.tone === "accent" ? 8 : g.tone === "warn" ? 10 : 9}%, transparent); position:relative; overflow:hidden">
          <span style="position:absolute; inset-block-start:12px; inset-inline-end:12px; width:7px; height:7px; border-radius:50%; background:var(--${g.tone}); animation:${g.anim}"></span>
          <div style="font-family:var(--mono); font-size:11px; color:var(--fg3)">${esc(g.tag)}</div>
          <div style="font-size:14px; font-weight:600; margin-block-start:9px; letter-spacing:-.01em">${esc(g.name)}</div>
          <div style="font-size:11.5px; color:var(--fg3); margin-block-start:5px">${esc(g.size)}</div>
          <div style="font-size:12px; color:var(--fg2); margin-block-start:10px; line-height:1.5; text-wrap:pretty">${esc(g.note)}</div>
        </div>`).join("")}
    </div>
    <div style="display:flex; align-items:center; gap:10px; margin-block-start:16px; padding-block-start:16px; border-block-start:1px solid var(--border2)">
      <span style="font-family:var(--mono); font-size:11px; color:var(--fg3)">${esc(d.flow)}</span>
    </div>
  </div>`;
}
