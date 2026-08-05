import { esc, L } from "../util.js";
import { findLesson, moduleById } from "../lessons.js";
import { content } from "../data.js";
import { SECTION_ORDER, READ_KEYS } from "../constants.js";
import { renderBlock } from "./blocks.js";

function renderStages(state, T, detail, prog) {
  const defs = [
    { n: "01", id: "read", need: 0, label: T.stage_read },
    { n: "02", id: "practice", need: 1, label: T.stage_practice },
    { n: "03", id: "quiz", need: 2, label: T.stage_quiz }
  ];
  return defs.map((st) => {
    const locked = detail ? prog < st.need : st.need > 0;
    const active = state.stage === st.id;
    return `<button class="btn-reset" ${locked ? "disabled" : `data-action="set-stage" data-stage="${st.id}"`} title="${locked ? esc(T.stage_locked) : ""}"
      style="display:flex; align-items:center; gap:8px; padding:8px 14px; border-radius:9px; background:${active ? "var(--surface)" : "transparent"}; color:${active ? "var(--fg)" : locked ? "var(--fg3)" : "var(--fg2)"}; font-size:13px; font-weight:500; box-shadow:${active ? "var(--shadow)" : "none"}; cursor:${locked ? "not-allowed" : "pointer"}; opacity:${locked ? 0.55 : 1}">
      <span style="font-family:var(--mono); font-size:10.5px; opacity:.65">${st.n}</span>
      <span>${esc(st.label)}</span>
      ${locked ? `<span style="width:7px; height:9px; border:1.5px solid currentColor; border-radius:2px; opacity:.6"></span>` : ""}
    </button>`;
  }).join("");
}

function renderQuiz(state, T, detail) {
  const qz = state.quiz;
  const qList = detail ? detail.quiz : [];
  if (!qList.length) return "";

  if (qz.finished) {
    const scoreTurn = qz.score / qList.length;
    const summary = state.lang === "ar"
      ? `أجبت ${qz.score} من ${qList.length} بشكل صحيح.`
      : `You answered ${qz.score} of ${qList.length} correctly.`;
    return `<div>
      <div data-surface="1" data-anim="in" class="card" style="padding:28px; max-width:520px; text-align:center">
        <div style="width:96px; height:96px; margin:0 auto; border-radius:50%; background:conic-gradient(var(--ok) ${scoreTurn}turn, var(--border2) 0); display:grid; place-items:center">
          <span style="width:78px; height:78px; border-radius:50%; background:var(--surface); display:grid; place-items:center; font-family:var(--mono); font-size:18px; font-weight:500">${qz.score}/${qList.length}</span>
        </div>
        <div style="font-size:19px; font-weight:600; margin-block-start:20px; letter-spacing:-.02em">${esc(T.quiz_done)}</div>
        <div style="font-size:14px; color:var(--fg2); margin-block-start:8px">${esc(summary)}</div>
        <div style="display:flex; gap:10px; justify-content:center; margin-block-start:22px; flex-wrap:wrap">
          <button class="btn-reset hv-border" data-action="quiz-retry" style="padding:11px 18px; border-radius:10px; border:1px solid var(--border); background:var(--surface2); font-size:13.5px; font-weight:500; color:var(--fg)">${esc(T.retry)}</button>
          <button class="btn-reset" data-action="quiz-complete" style="padding:11px 18px; border-radius:10px; border:0; background:var(--accent); color:#fff; font-size:13.5px; font-weight:500">${esc(T.finish_lesson)}</button>
        </div>
      </div>
    </div>`;
  }

  const cur = qList[Math.min(qz.i, qList.length - 1)];
  const keys = ["A", "B", "C", "D"];
  const pct = Math.round(((qz.i + (qz.checked ? 1 : 0)) / qList.length) * 100);
  const tone = qz.picked === cur.correct ? "green" : "red";
  const verdict = qz.picked === cur.correct ? T.correct : T.incorrect;
  const primaryLabel = qz.checked ? (qz.i + 1 >= qList.length ? T.quiz_done : T.next_q) : T.check;
  const primaryDisabled = qz.picked === null;

  const options = cur.options.map((o, i) => {
    const optState = !qz.checked ? (qz.picked === i ? "picked" : "idle") : i === cur.correct ? "right" : (qz.picked === i ? "wrong" : "idle");
    return `<button class="btn-reset hv-border" data-action="${qz.checked ? "" : "quiz-pick"}" data-index="${i}" data-opt="${optState}" style="display:flex; align-items:center; gap:12px; padding:13px 15px; border:1px solid var(--border); background:var(--surface2); border-radius:11px; font-size:14px; color:var(--fg)">
      <span style="font-family:var(--mono); font-size:11px; color:var(--fg3); flex:none">${keys[i]}</span>
      <span style="flex:1; min-width:0; line-height:1.5; text-wrap:pretty">${esc(L(state, o))}</span>
    </button>`;
  }).join("");

  return `<div>
    <div data-surface="1" class="card" style="padding:24px; max-width:720px">
      <div style="display:flex; align-items:center; gap:12px">
        <span style="font-family:var(--mono); font-size:11.5px; color:var(--fg3)">${qz.i + 1} / ${qList.length}</span>
        <span style="flex:1; height:3px; border-radius:3px; background:var(--border2); overflow:hidden">
          <span style="display:block; height:100%; width:${pct}%; background:var(--accent); transition:width .3s ease"></span>
        </span>
      </div>
      <h3 style="margin:20px 0 0; font-size:18px; font-weight:600; line-height:1.45; letter-spacing:-.015em; text-wrap:pretty">${esc(L(state, cur.q))}</h3>
      <div style="display:flex; flex-direction:column; gap:9px; margin-block-start:20px">${options}</div>
      ${qz.checked ? `<div data-tone="${tone}" style="margin-block-start:18px; padding:15px 16px; border-radius:12px">
        <div style="font-size:12.5px; font-weight:600">${esc(verdict)}</div>
        <div style="font-size:13.5px; line-height:1.65; color:var(--fg2); margin-block-start:7px; text-wrap:pretty">${esc(L(state, cur.why))}</div>
      </div>` : ""}
      <div style="display:flex; gap:10px; margin-block-start:20px">
        <button class="btn-reset" data-action="quiz-primary" ${primaryDisabled ? "disabled" : ""} style="padding:11px 18px; border-radius:10px; border:0; background:var(--accent); color:#fff; font-size:13.5px; font-weight:500; opacity:${primaryDisabled ? 0.5 : 1}; cursor:${primaryDisabled ? "not-allowed" : "pointer"}">${esc(primaryLabel)}</button>
      </div>
    </div>
  </div>`;
}

export function renderLesson(state, T) {
  const lref = state.lessonId ? findLesson(content, state.lessonId) : null;
  if (!lref) return `<div data-anim="in"><p style="color:var(--fg2)">Lesson not found.</p></div>`;

  const detail = content.lessonDetail[state.lessonId] || null;
  const prog = state.stageProgress[state.lessonId] || 0;
  const isComplete = state.completed.includes(lref.id);
  const bm = state.bookmarks.includes(lref.id);

  const stagesHtml = renderStages(state, T, detail, prog);

  let sectionsHtml = "";
  let railHtml = "";
  let ctaHtml = "";
  let quizHtml = "";
  let stubHtml = "";

  if (detail) {
    const keys = state.stage === "read" ? READ_KEYS : state.stage === "practice" ? ["exercises"] : [];
    const sections = keys.map((k) => {
      const sec = detail.sections.find((x) => x.key === k);
      if (!sec) return null;
      const n = SECTION_ORDER.indexOf(k) + 1;
      return { key: k, anchor: "sec-" + k, n: (n < 10 ? "0" : "") + n, title: L(state, content.SECTION_TITLES[k]), blocks: sec.blocks };
    }).filter(Boolean);

    sectionsHtml = sections.map((sec) => `
      <section id="${sec.anchor}" style="scroll-margin-top:80px">
        <div style="display:flex; align-items:center; gap:12px">
          <span style="font-family:var(--mono); font-size:11px; color:var(--fg3)">${sec.n}</span>
          <h2 style="margin:0; font-size:20px; font-weight:600; letter-spacing:-.02em">${esc(sec.title)}</h2>
          <span style="flex:1; height:1px; background:var(--border2)"></span>
        </div>
        <div style="display:flex; flex-direction:column; gap:16px; margin-block-start:18px">
          ${sec.blocks.map((b, i) => renderBlock(state, T, b, sec.key + "-" + i)).join("")}
        </div>
      </section>`).join("");

    railHtml = sections.map((sec) => `<a href="#${sec.anchor}" class="hv-rail" style="padding:6px 12px; font-size:12.5px; color:var(--fg3); text-decoration:none; border-inline-start:2px solid transparent; margin-inline-start:-1px">${esc(sec.title)}</a>`).join("");

    const showCta = state.stage === "read" || state.stage === "practice";
    if (showCta) {
      const label = state.stage === "read" ? T.mark_read : T.mark_practice;
      ctaHtml = `<button class="btn-reset hv-bright" data-action="advance-stage" style="align-self:flex-start; display:flex; align-items:center; gap:10px; padding:12px 20px; border-radius:11px; border:0; background:var(--accent); color:#fff; font-size:14px; font-weight:500; box-shadow:var(--shadow)">
        <span>${esc(label)}</span>
        <span style="font-family:var(--mono); opacity:.75">&rarr;</span>
      </button>`;
    }
    if (state.stage === "quiz") quizHtml = renderQuiz(state, T, detail);
  } else {
    const outline = SECTION_ORDER.map((k) => `<span class="chip" style="padding:4px 10px">${esc(L(state, content.SECTION_TITLES[k]))}</span>`).join("");
    const stubCta = state.lang === "ar" ? "علّمه كمقروء وتابع" : "Mark as read and move on";
    stubHtml = `<div data-surface="1" style="background:var(--surface); border:1px dashed var(--border); border-radius:14px; padding:28px; max-width:600px">
      <div style="font-size:15px; font-weight:600">${esc(T.soon)}</div>
      <div style="font-size:14px; line-height:1.65; color:var(--fg2); margin-block-start:9px; text-wrap:pretty">${esc(T.soon_body)}</div>
      <div style="display:flex; flex-wrap:wrap; gap:7px; margin-block-start:18px">${outline}</div>
      <button class="btn-reset hv-border" data-action="stub-complete" style="margin-block-start:20px; padding:10px 16px; border-radius:10px; border:1px solid var(--border); background:var(--surface2); font-size:13.5px; font-weight:500; color:var(--fg)">${esc(stubCta)}</button>
    </div>`;
  }

  return `<div data-anim="in" style="display:grid; grid-template-columns:minmax(0,1fr) auto; gap:40px; align-items:start">
    <div style="min-width:0">
      <div style="font-family:var(--mono); font-size:11.5px; color:var(--accent); letter-spacing:.04em">${esc(L(state, moduleById(content, lref.moduleId).title))}</div>
      <h1 style="margin:12px 0 0; font-size:clamp(24px,3.2vw,34px); font-weight:600; letter-spacing:-.028em; line-height:1.15; text-wrap:balance">${esc(L(state, lref.title))}</h1>
      <p style="margin:14px 0 0; font-size:15.5px; line-height:1.6; color:var(--fg2); max-width:64ch; text-wrap:pretty">${detail ? esc(L(state, detail.summary)) : ""}</p>

      <div style="display:flex; align-items:center; flex-wrap:wrap; gap:14px; margin-block-start:20px; padding-block-end:20px; border-block-end:1px solid var(--border2)">
        <span style="font-family:var(--mono); font-size:11.5px; color:var(--fg3)">${lref.mins} ${esc(T.min)} ${esc(T.reading_time)}</span>
        <span style="width:1px; height:12px; background:var(--border)"></span>
        <button class="btn-reset hv-border" data-action="toggle-bookmark" style="display:flex; align-items:center; gap:7px; background:transparent; border:1px solid var(--border); border-radius:8px; padding:5px 10px; font-size:12px; color:${bm ? "var(--accent)" : "var(--fg2)"}">
          <span style="width:8px; height:8px; background:${bm ? "currentColor" : "transparent"}; border:1.5px solid currentColor; border-radius:2px"></span>
          <span>${bm ? esc(T.bookmarked) : esc(T.bookmark)}</span>
        </button>
        ${isComplete ? `<span data-tone="green" style="font-size:11px; font-weight:600; padding:4px 10px; border-radius:20px">${esc(T.lesson_complete)}</span>` : ""}
      </div>

      <div style="display:flex; gap:6px; margin-block-start:22px; padding:5px; background:var(--surface2); border:1px solid var(--border2); border-radius:12px; width:fit-content; max-width:100%; flex-wrap:wrap">${stagesHtml}</div>

      <div style="display:flex; flex-direction:column; gap:44px; margin-block-start:40px">${sectionsHtml}</div>

      ${ctaHtml}
      ${quizHtml}
      ${stubHtml}
    </div>

    <aside data-railcol="1" style="width:212px; flex:none; position:sticky; top:76px">
      <div style="font-size:10.5px; font-weight:600; letter-spacing:.09em; text-transform:uppercase; color:var(--fg3)">${esc(T.on_this_page)}</div>
      <nav style="display:flex; flex-direction:column; gap:1px; margin-block-start:12px; border-inline-start:1px solid var(--border2)">${railHtml}</nav>
    </aside>
  </div>`;
}
