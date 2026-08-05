// Copy + data for the two hand-built diagrams referenced by { t: "diagram" }
// blocks in content.js (name: "threadpool" | "gcheap"). Kept separate from
// content.js because it's presentation copy for a fixed pair of visuals,
// not lesson content.

export function threadpoolDiagram(lang) {
  const ar = lang === "ar";
  return {
    title: ar ? "من يحتجز الـ thread أثناء 300 ملّي ثانية من الانتظار" : "Who holds a thread during 300 ms of waiting",
    sync: ar ? "Synchronous — الـ thread محتجز طول الوقت" : "Synchronous — thread held the whole time",
    syncLabel: ar ? "thread واحد محجوز · 300 ملّي ثانية" : "1 thread blocked · 300 ms",
    async: ar ? "Asynchronous — الـ thread يعود إلى الـ pool" : "Asynchronous — thread returns to the pool",
    wait: ar ? "الانتظار في الـ kernel · صفر threads" : "waiting in the kernel · zero threads",
    notes: [
      ar ? "الأجزاء الملوّنة عمل CPU حقيقي: قبل أول await وبعد كل continuation." : "The coloured slivers are real CPU work: before the first await, and after each continuation.",
      ar ? "الفراغ في المنتصف لا يملكه أي thread — الـ completion port في نظام التشغيل يحمله." : "The gap in the middle is owned by no thread — the OS completion port holds it.",
      ar ? "لهذا 1000 request متزامن تحتاج عشرات الـ threads لا آلافها." : "That is why 1,000 concurrent requests need tens of threads, not thousands."
    ]
  };
}

export function gcHeapDiagram(lang) {
  const ar = lang === "ar";
  return {
    title: ar ? "الـ managed heap: التخصيص على اليسار، والتكلفة على اليمين" : "The managed heap: allocation on the left, cost on the right",
    flow: ar ? "gen 0 → (نجا) → gen 1 → (نجا) → gen 2 · ≥ 85 كيلوبايت → LOH" : "gen 0 → (survived) → gen 1 → (survived) → gen 2 · ≥ 85 KB → LOH",
    bands: [
      { tag: "gen 0", name: ar ? "الحضانة" : "The nursery", size: ar ? "مئات الكيلوبايت – ميغابايتات" : "hundreds of KB – a few MB",
        note: ar ? "كل تخصيص جديد. معظم الكائنات تموت هنا، والجمع رخيص." : "Every new allocation. Most objects die here and collection is cheap.",
        tone: "ok", anim: "bkm-pulse 1.8s ease-in-out infinite" },
      { tag: "gen 1", name: ar ? "المخزن المؤقت" : "The buffer", size: ar ? "صغير" : "small",
        note: ar ? "منطقة عازلة بين قصير العمر وطويله." : "A buffer between short-lived and long-lived objects.",
        tone: "accent", anim: "none" },
      { tag: "gen 2", name: ar ? "طويل العمر" : "Long-lived", size: ar ? "كامل الـ heap المتبقي" : "the rest of the heap",
        note: ar ? "الجمع هنا يتبع الرسم كاملاً — وهو المكلف." : "Collecting here traces the whole graph — this is the expensive one.",
        tone: "warn", anim: "none" },
      { tag: "LOH", name: ar ? "الكائنات الكبيرة" : "Large objects", size: "≥ 85 KB",
        note: ar ? "يُجمع مع gen 2 ولا يُضغط افتراضياً، فيتفتّت." : "Collected with gen 2, not compacted by default, so it fragments.",
        tone: "danger", anim: "none" }
    ]
  };
}
