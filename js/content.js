// Backend Knowledge Map — content + i18n data
// Every user-facing string is {en, ar}. Technical terms stay in Latin script in Arabic.

export const ui = {
  brand: { en: "Backend Knowledge Map", ar: "خريطة معرفة الـ Backend" },
  brandShort: { en: "BKM", ar: "BKM" },
  nav_home: { en: "Home", ar: "الرئيسية" },
  nav_roadmap: { en: "Roadmap", ar: "خريطة التعلّم" },
  nav_interview: { en: "Interview Prep", ar: "أسئلة المقابلات" },
  nav_bookmarks: { en: "Bookmarks", ar: "المحفوظات" },
  modules: { en: "Modules", ar: "الوحدات" },
  search: { en: "Search", ar: "بحث" },
  search_ph: { en: "Search lessons, concepts, questions…", ar: "ابحث في الدروس والمفاهيم والأسئلة…" },
  search_hint: { en: "Type to search across every module", ar: "اكتب للبحث في كل الوحدات" },
  no_results: { en: "No matches", ar: "لا نتائج" },
  theme_light: { en: "Light", ar: "نهاري" },
  theme_dark: { en: "Dark", ar: "ليلي" },
  language: { en: "Language", ar: "اللغة" },
  hero_kicker: { en: "Senior .NET track", ar: "مسار .NET المتقدّم" },
  hero_title: { en: "Understand the backend, not just the syntax.", ar: "افهم الـ backend، لا الـ syntax فقط." },
  hero_sub: {
    en: "Every lesson starts with the problem that made the solution necessary, then goes down to how it actually works inside the runtime.",
    ar: "كل درس يبدأ بالمشكلة التي جعلت الحل ضرورياً، ثم ينزل إلى ما يحدث فعلياً داخل الـ runtime."
  },
  continue_learning: { en: "Continue learning", ar: "أكمل التعلّم" },
  browse_roadmap: { en: "Browse the roadmap", ar: "استعرض الخريطة" },
  current_module: { en: "Current module", ar: "الوحدة الحالية" },
  streak: { en: "Day streak", ar: "أيام متتابعة" },
  lessons_done: { en: "Lessons completed", ar: "دروس مكتملة" },
  time_left: { en: "Est. time remaining", ar: "الوقت المتبقي تقديرياً" },
  overall: { en: "Overall progress", ar: "التقدّم الكلي" },
  this_week: { en: "This week", ar: "هذا الأسبوع" },
  recently_viewed: { en: "Recently viewed", ar: "آخر ما شاهدت" },
  achievements: { en: "Achievements", ar: "الإنجازات" },
  roadmap_title: { en: "The knowledge map", ar: "خريطة المعرفة" },
  roadmap_sub: {
    en: "Ten modules, ordered so each one earns the next. Follow the spine; the branches are the topics inside each module.",
    ar: "عشر وحدات مرتّبة بحيث تفتح كل واحدة الطريق للتالية. اتبع العمود الفقري؛ والفروع هي مواضيع كل وحدة."
  },
  status_done: { en: "Completed", ar: "مكتملة" },
  status_current: { en: "In progress", ar: "قيد الدراسة" },
  status_open: { en: "Available", ar: "متاحة" },
  status_locked: { en: "Locked", ar: "مقفلة" },
  locked_note: { en: "Finish the previous module to unlock", ar: "أكمل الوحدة السابقة لفتحها" },
  topics: { en: "Topics", ar: "المواضيع" },
  lessons: { en: "lessons", ar: "دروس" },
  min: { en: "min", ar: "دقيقة" },
  hours_short: { en: "h", ar: "س" },
  start: { en: "Start", ar: "ابدأ" },
  review: { en: "Review", ar: "مراجعة" },
  resume: { en: "Resume", ar: "متابعة" },
  stage_read: { en: "Read", ar: "اقرأ" },
  stage_practice: { en: "Practice", ar: "تمرّن" },
  stage_quiz: { en: "Quiz", ar: "اختبار" },
  stage_locked: { en: "Finish the previous stage first", ar: "أكمل المرحلة السابقة أولاً" },
  mark_read: { en: "I've read this — unlock Practice", ar: "أنهيت القراءة — افتح التمارين" },
  mark_practice: { en: "Done practising — unlock the Quiz", ar: "أنهيت التمارين — افتح الاختبار" },
  on_this_page: { en: "On this page", ar: "في هذه الصفحة" },
  reading_time: { en: "read", ar: "قراءة" },
  bookmark: { en: "Bookmark", ar: "احفظ" },
  bookmarked: { en: "Bookmarked", ar: "محفوظ" },
  copy: { en: "Copy", ar: "نسخ" },
  copied: { en: "Copied", ar: "تم النسخ" },
  bad_code: { en: "Don't do this", ar: "لا تفعل هذا" },
  good_code: { en: "Do this instead", ar: "افعل هذا بدلاً منه" },
  severity: { en: "Severity", ar: "الخطورة" },
  sev_high: { en: "High", ar: "عالية" },
  sev_med: { en: "Medium", ar: "متوسطة" },
  sev_low: { en: "Low", ar: "منخفضة" },
  level_junior: { en: "Junior", ar: "Junior" },
  level_mid: { en: "Mid", ar: "Mid" },
  level_senior: { en: "Senior", ar: "Senior" },
  level_staff: { en: "Staff", ar: "Staff" },
  show_answer: { en: "Show answer", ar: "اعرض الإجابة" },
  hide_answer: { en: "Hide answer", ar: "أخفِ الإجابة" },
  diff_easy: { en: "Easy", ar: "سهل" },
  diff_medium: { en: "Medium", ar: "متوسط" },
  diff_hard: { en: "Hard", ar: "صعب" },
  diff_senior: { en: "Senior", ar: "متقدّم" },
  check: { en: "Check answer", ar: "تحقّق" },
  next_q: { en: "Next question", ar: "السؤال التالي" },
  correct: { en: "Correct", ar: "صحيح" },
  incorrect: { en: "Not quite", ar: "ليست الإجابة" },
  quiz_done: { en: "Quiz complete", ar: "انتهى الاختبار" },
  score: { en: "Score", ar: "النتيجة" },
  retry: { en: "Try again", ar: "أعد المحاولة" },
  finish_lesson: { en: "Complete lesson", ar: "أكمل الدرس" },
  next_lesson: { en: "Next lesson", ar: "الدرس التالي" },
  lesson_complete: { en: "Lesson complete", ar: "الدرس مكتمل" },
  iv_title: { en: "Interview preparation", ar: "التحضير للمقابلات" },
  iv_sub: {
    en: "Every interview question in the map, filterable by level. Answer out loud before you reveal.",
    ar: "كل أسئلة المقابلات في الخريطة، مرتّبة حسب المستوى. أجب بصوت عالٍ قبل أن تكشف الإجابة."
  },
  all_levels: { en: "All levels", ar: "كل المستويات" },
  all_modules: { en: "All modules", ar: "كل الوحدات" },
  questions: { en: "questions", ar: "سؤال" },
  soon: { en: "Content in progress", ar: "المحتوى قيد الإعداد" },
  soon_body: {
    en: "This lesson is scaffolded with the same 14-section structure. The written material lands with the next content pass.",
    ar: "هذا الدرس مبني بنفس هيكل الأربعة عشر قسماً. المادة المكتوبة ستُضاف في الدفعة القادمة."
  },
  no_bookmarks: { en: "Nothing saved yet. Bookmark a lesson and it shows up here.", ar: "لا شيء محفوظ بعد. احفظ درساً وسيظهر هنا." },
  back: { en: "Back", ar: "رجوع" },
  ach_first: { en: "First lesson done", ar: "أول درس مكتمل" },
  ach_streak: { en: "7-day streak", ar: "7 أيام متتابعة" },
  ach_module: { en: "Module cleared", ar: "وحدة مكتملة" },
  ach_quiz: { en: "Perfect quiz", ar: "اختبار كامل" },
  keep_going: { en: "You're on a roll. One lesson today keeps the streak alive.", ar: "أنت في تقدّم جيد. درس واحد اليوم يحفظ سلسلتك." }
};

const sectionTitles = {
  why: { en: "Why does this exist?", ar: "لماذا يوجد هذا؟" },
  problem: { en: "The problem it solves", ar: "المشكلة التي يحلّها" },
  internals: { en: "How it works internally", ar: "كيف يعمل داخلياً" },
  tradeoffs: { en: "Trade-offs", ar: "المقايضات" },
  mistakes: { en: "Common mistakes", ar: "أخطاء شائعة" },
  interview: { en: "Interview questions", ar: "أسئلة المقابلات" },
  codereview: { en: "Code review", ar: "مراجعة كود" },
  sysdesign: { en: "System design", ar: "تصميم الأنظمة" },
  perf: { en: "Performance", ar: "الأداء" },
  debug: { en: "Debugging", ar: "التشخيص" },
  realworld: { en: "Real-world examples", ar: "أمثلة من الواقع" },
  exercises: { en: "Exercises", ar: "تمارين" },
  quiz: { en: "Quiz", ar: "اختبار" },
  refs: { en: "References", ar: "مراجع" }
};
export const SECTION_TITLES = sectionTitles;

// ---------------------------------------------------------------- lesson: async/await

const asyncLesson = {
  id: "async-await",
  moduleId: "runtime",
  title: { en: "async / await and the ThreadPool", ar: "async / await والـ ThreadPool" },
  summary: {
    en: "What the compiler builds for you, why a thread is not the same thing as a task, and how to avoid starving the pool.",
    ar: "ما الذي يبنيه الـ compiler لك، ولماذا الـ thread ليس نفس الـ task، وكيف تتجنّب استنزاف الـ pool."
  },
  mins: 24,
  sections: [
    { key: "why", blocks: [
      { t: "p", en: "A thread is an expensive object. Each one reserves a megabyte of stack, needs kernel bookkeeping, and costs a context switch every time the scheduler moves it. Yet for most of a web request's life, the thread that owns it is doing nothing: it is parked, waiting for a database, a queue, or another HTTP call to answer.", ar: "الـ thread كائن مكلف. كل واحد يحتجز ميغابايت من الـ stack، ويحتاج إدارة من الـ kernel، ويكلّف context switch في كل مرة ينقله الـ scheduler. ومع ذلك، معظم عمر الـ request يكون الـ thread المالك له لا يفعل شيئاً: إنه متوقف ينتظر قاعدة بيانات أو queue أو استدعاء HTTP آخر." },
      { t: "p", en: "async/await exists to break the link between \"a request is in flight\" and \"a thread is held hostage\". The waiting is tracked by an object on the heap instead of a thread on the stack.", ar: "وُجد async/await ليفصل بين «هناك request جارٍ» و«هناك thread محتجز». الانتظار يُتابَع عبر كائن على الـ heap بدلاً من thread على الـ stack." },
      { t: "callout", kind: "tip", en: "async is about throughput and resource use, not speed. A single awaited call does not get faster; the server just handles far more of them at once.", ar: "الـ async يتعلق بالـ throughput واستهلاك الموارد، لا بالسرعة. الاستدعاء الواحد لا يصبح أسرع؛ لكن السيرفر يخدم عدداً أكبر بكثير في نفس الوقت." }
    ]},
    { key: "problem", blocks: [
      { t: "p", en: "Take a service that fans out to three downstream APIs, each taking about 100 ms. Synchronously, one request occupies one thread for 300 ms. To serve 1,000 concurrent requests you need roughly 1,000 threads — far past the point where the scheduler and the memory subsystem stop cooperating.", ar: "خذ خدمة تستدعي ثلاث APIs خارجية، كل منها ~100 ملّي ثانية. بشكل synchronous، كل request يحتجز thread لمدة 300 ملّي ثانية. لخدمة 1000 request متزامن تحتاج ~1000 thread — وهذا أبعد بكثير من الحد الذي يتوقف عنده الـ scheduler والذاكرة عن التعاون." },
      { t: "p", en: "Asynchronously the same load needs a handful of threads, because during those 300 ms of waiting no thread is assigned to the request at all. The ThreadPool only needs a thread at the moments where CPU work actually happens: before the first await, and after each continuation resumes.", ar: "بشكل asynchronous يحتاج نفس الحمل عدداً قليلاً من الـ threads، لأن خلال تلك 300 ملّي ثانية من الانتظار لا يوجد thread مخصّص للـ request إطلاقاً. الـ ThreadPool يحتاج thread فقط في اللحظات التي يحدث فيها عمل CPU فعلي: قبل أول await، وبعد كل continuation." },
      { t: "kv", rows: [
        { k: { en: "Sync, 1k concurrent", ar: "Sync، ألف متزامن" }, v: { en: "~1000 threads · ~1 GB of stack · heavy context switching", ar: "~1000 thread · ~1 غيغابايت stack · context switching كثيف" } },
        { k: { en: "Async, 1k concurrent", ar: "Async، ألف متزامن" }, v: { en: "~cores × 2 threads · state machines on the heap · negligible switching", ar: "~عدد الأنوية × 2 thread · state machines على الـ heap · تبديل مهمل" } }
      ]}
    ]},
    { key: "internals", blocks: [
      { t: "p", en: "await is not a keyword the CPU understands. The C# compiler rewrites an async method into a state machine struct implementing IAsyncStateMachine. Everything that was a local variable becomes a field on that struct, so it can survive across suspension points.", ar: "الـ await ليس كلمة يفهمها الـ CPU. الـ C# compiler يعيد كتابة الـ async method إلى state machine struct ينفّذ IAsyncStateMachine. كل ما كان متغيراً محلياً يصبح field في هذا الـ struct، حتى يبقى حياً بين نقاط التوقف." },
      { t: "code", lang: "csharp", label: { en: "What you write", ar: "ما تكتبه" }, code: "async Task<Order> GetOrderAsync(int id)\n{\n    var order = await _db.Orders.FindAsync(id);\n    var price = await _pricing.QuoteAsync(order.Sku);\n    order.Total = price;\n    return order;\n}" },
      { t: "code", lang: "csharp", label: { en: "Roughly what the compiler emits", ar: "ما يولّده الـ compiler تقريباً" }, code: "struct StateMachine : IAsyncStateMachine\n{\n    int _state;               // -1 = not started, 0..n = resume point\n    int _id;                  // hoisted parameter\n    Order _order;             // hoisted local\n    TaskAwaiter<Order> _a1;   // the awaiter we are parked on\n    AsyncTaskMethodBuilder<Order> _builder;\n\n    public void MoveNext()\n    {\n        switch (_state)\n        {\n            case -1:\n                _a1 = _db.Orders.FindAsync(_id).GetAwaiter();\n                if (!_a1.IsCompleted)\n                {\n                    _state = 0;\n                    _builder.AwaitUnsafeOnCompleted(ref _a1, ref this); // return!\n                    return;\n                }\n                goto case 0;\n            case 0:\n                _order = _a1.GetResult();\n                // ... next await, same shape\n                break;\n        }\n    }\n}" },
      { t: "p", en: "The important line is AwaitUnsafeOnCompleted. It registers MoveNext as the continuation and then returns from the method. The calling thread walks back up the stack and is free — it goes back to the ThreadPool and picks up other work.", ar: "السطر المهم هو AwaitUnsafeOnCompleted. يسجّل MoveNext كـ continuation ثم يخرج من الـ method. الـ thread المستدعي يعود إلى أعلى الـ stack ويصبح حراً — يرجع إلى الـ ThreadPool ويأخذ عملاً آخر." },
      { t: "diagram", name: "threadpool" },
      { t: "p", en: "For real I/O, nothing is polling. The socket read is handed to the OS completion port (IOCP on Windows, epoll/io_uring behind the scenes on Linux). When the kernel signals completion, the runtime queues MoveNext onto the ThreadPool. That is why an async I/O wait costs zero threads: the wait lives in the kernel.", ar: "في الـ I/O الحقيقي لا يوجد polling. قراءة الـ socket تُسلَّم إلى completion port في نظام التشغيل (IOCP على Windows، وepoll/io_uring على Linux). عندما يشير الـ kernel إلى الاكتمال، يضع الـ runtime الـ MoveNext في طابور الـ ThreadPool. لهذا انتظار الـ I/O غير المتزامن يكلّف صفر threads: الانتظار يعيش في الـ kernel." },
      { t: "p", en: "Where MoveNext resumes depends on the SynchronizationContext (or TaskScheduler) captured at the await. In ASP.NET Core there is no SynchronizationContext, so continuations run on a plain ThreadPool thread. In WPF or WinForms the captured context marshals you back to the UI thread — which is where sync-over-async deadlocks come from.", ar: "مكان استئناف MoveNext يعتمد على الـ SynchronizationContext (أو TaskScheduler) المُلتقط عند الـ await. في ASP.NET Core لا يوجد SynchronizationContext، فتُنفَّذ الـ continuations على thread عادي من الـ pool. أما في WPF أو WinForms فالسياق الملتقط يعيدك إلى الـ UI thread — ومن هنا تأتي حالات الـ deadlock في sync-over-async." },
      { t: "callout", kind: "note", en: "The ThreadPool grows, but slowly — roughly one extra thread per 0.5 s once it is past the minimum. A burst of blocked threads therefore shows up as a latency cliff, not a clean failure.", ar: "الـ ThreadPool يتوسّع لكن ببطء — قرابة thread إضافي كل نصف ثانية بعد تجاوز الحد الأدنى. لذلك دفعة من الـ threads المحجوزة تظهر كهبوط حاد في زمن الاستجابة، لا كفشل واضح." }
    ]},
    { key: "tradeoffs", blocks: [
      { t: "tradeoff",
        pros: { en: ["Throughput scales with cores rather than with connections", "Memory per in-flight operation drops from ~1 MB of stack to a small heap object", "Cancellation and timeouts become first class via CancellationToken", "Composition: WhenAll / WhenAny express fan-out naturally"],
                ar: ["الـ throughput يتناسب مع عدد الأنوية لا مع عدد الاتصالات", "الذاكنة لكل عملية جارية تنزل من ~1 ميغابايت stack إلى كائن صغير على الـ heap", "الإلغاء والمُهل يصبحان جزءاً أصيلاً من التصميم عبر CancellationToken", "التركيب: WhenAll / WhenAny يعبّران عن التوزيع المتوازي بشكل طبيعي"] },
        cons: { en: ["async colours your whole call stack — it has to go all the way down", "Stack traces get harder to read; exceptions arrive wrapped", "Each await that actually suspends allocates (Task + state machine box)", "Debugging concurrency is genuinely harder than debugging sequential code"],
                ar: ["الـ async يصبغ سلسلة الاستدعاء بالكامل — يجب أن ينزل حتى الأسفل", "قراءة الـ stack traces تصبح أصعب، والاستثناءات تصل ملفوفة", "كل await يتوقف فعلياً يخصّص ذاكرة (Task + تعليب الـ state machine)", "تشخيص التزامن أصعب فعلياً من تشخيص كود تسلسلي"] },
        limits: { en: ["It does nothing for CPU-bound work — that still needs a thread", "It does not make a slow query fast", "Under CPU saturation async and sync perform the same"],
                  ar: ["لا يفيد في العمل المرتبط بالـ CPU — هذا يحتاج thread فعلياً", "لا يجعل الاستعلام البطيء سريعاً", "عند تشبّع الـ CPU يتساوى أداء async وsync"] },
        alts: { en: ["Dedicated threads for long-running blocking work (TaskCreationOptions.LongRunning)", "Channels / queues to move work off the request path entirely", "Batching to reduce the number of round trips instead of overlapping them"],
                ar: ["threads مخصّصة للعمل الطويل الحاجز (TaskCreationOptions.LongRunning)", "Channels أو queues لنقل العمل خارج مسار الـ request بالكامل", "الـ batching لتقليل عدد الرحلات بدلاً من تشبيكها"] }
      }
    ]},
    { key: "mistakes", blocks: [
      { t: "mistake", title: { en: ".Result / .Wait() on an async call", ar: "استخدام .Result أو .Wait() على استدعاء async" },
        body: { en: "Blocks the current thread until the task finishes. In a UI or legacy ASP.NET context the continuation needs that same thread and you deadlock instantly. In ASP.NET Core it will not deadlock, but you burn a pool thread per request and lose the entire benefit.", ar: "يحجز الـ thread الحالي حتى ينتهي الـ task. في سياق UI أو ASP.NET القديم يحتاج الـ continuation نفس الـ thread فيحدث deadlock فوراً. في ASP.NET Core لن يحدث deadlock لكنك تستهلك thread من الـ pool لكل request وتفقد الفائدة كلها." } },
      { t: "mistake", title: { en: "async void", ar: "async void" },
        body: { en: "There is no Task to await and no Task to hold the exception, so a throw goes straight to the synchronization context and usually takes the process down. Only legitimate for event handlers.", ar: "لا يوجد Task تنتظره ولا Task يحمل الاستثناء، فالـ throw يصل مباشرة إلى الـ synchronization context وعادة يُسقط العملية. مقبول فقط في معالجات الأحداث." } },
      { t: "mistake", title: { en: "Task.Run to \"make it async\" in a controller", ar: "استخدام Task.Run لجعل الكود async داخل controller" },
        body: { en: "On the server this moves work from one pool thread to another pool thread and adds a hop. It does not free anything. Task.Run is for pushing CPU work off a UI thread, not for wrapping I/O.", ar: "على السيرفر ينقل العمل من thread في الـ pool إلى thread آخر في نفس الـ pool ويضيف خطوة زائدة. لا يحرّر شيئاً. الـ Task.Run لدفع عمل الـ CPU بعيداً عن UI thread، لا لتغليف الـ I/O." } },
      { t: "mistake", title: { en: "Forgetting ConfigureAwait(false) in a library", ar: "إهمال ConfigureAwait(false) في مكتبة" },
        body: { en: "Library code cannot know who calls it. Capturing a caller's context adds a marshalling hop at best and deadlocks at worst. Application code in ASP.NET Core does not need it; shared libraries do.", ar: "كود المكتبة لا يعرف من يستدعيه. التقاط سياق المستدعي يضيف خطوة نقل في أفضل الحالات وdeadlock في أسوأها. كود التطبيق في ASP.NET Core لا يحتاجه؛ المكتبات المشتركة تحتاجه." } },
      { t: "mistake", title: { en: "Sequential awaits where parallel would do", ar: "await متسلسلة حيث كان التوازي ممكناً" },
        body: { en: "Three independent 100 ms calls awaited one after the other cost 300 ms. Start all three, then await Task.WhenAll — 100 ms. Only valid when the calls truly do not depend on each other and the downstream can take the concurrency.", ar: "ثلاث استدعاءات مستقلة بـ100 ملّي ثانية تُنتظر واحدة بعد الأخرى تكلّف 300 ملّي ثانية. ابدأ الثلاثة ثم await Task.WhenAll — 100 ملّي ثانية. صالح فقط عندما لا تعتمد الاستدعاءات على بعضها وتتحمّل الخدمات التزامن." },
        fix: "var a = _svc1.GetAsync(ct);\nvar b = _svc2.GetAsync(ct);\nvar c = _svc3.GetAsync(ct);\nawait Task.WhenAll(a, b, c);" },
      { t: "mistake", title: { en: "Fire and forget without a guard", ar: "fire-and-forget بدون حماية" },
        body: { en: "An unawaited task that throws becomes an unobserved exception, and the work silently disappears when the host recycles. Use a background service, a queue, or at minimum log the failure.", ar: "Task غير مُنتظر يرمي استثناءً يصبح unobserved exception، والعمل يختفي بصمت عند إعادة تدوير الـ host. استخدم background service أو queue، أو على الأقل سجّل الفشل." } }
    ]},
    { key: "interview", blocks: [
      { t: "qa", level: "junior", q: { en: "Does await create a new thread?", ar: "هل الـ await ينشئ thread جديداً؟" },
        a: { en: "No. await registers a continuation and returns. For I/O the wait happens in the OS; no thread is assigned during it. The continuation later runs on some thread — usually a ThreadPool thread — but nothing new was created.", ar: "لا. الـ await يسجّل continuation ويخرج. في الـ I/O يحدث الانتظار داخل نظام التشغيل ولا يُخصَّص thread خلاله. الـ continuation ينفّذ لاحقاً على thread ما — عادة من الـ ThreadPool — لكن لم يُنشأ شيء جديد." } },
      { t: "qa", level: "junior", q: { en: "What is the difference between Task and Thread?", ar: "ما الفرق بين Task و Thread؟" },
        a: { en: "A Thread is an OS scheduling unit. A Task is a promise of a future result; it may run on a pool thread, on the current thread, or represent work no thread is doing at all, like an I/O wait.", ar: "الـ Thread وحدة جدولة في نظام التشغيل. الـ Task وعد بنتيجة مستقبلية؛ قد ينفّذ على thread من الـ pool أو على الـ thread الحالي أو يمثّل عملاً لا ينفّذه أي thread، مثل انتظار I/O." } },
      { t: "qa", level: "mid", q: { en: "Why can Task.Result deadlock, and why does it not in ASP.NET Core?", ar: "لماذا يسبب Task.Result حالة deadlock، ولماذا لا يحدث ذلك في ASP.NET Core؟" },
        a: { en: "With a single-threaded SynchronizationContext, the blocked thread is the only thread allowed to run the continuation, so the continuation can never start. ASP.NET Core removed the SynchronizationContext, so continuations go to the pool and can run on a different thread — you still lose a thread, but you do not lock up.", ar: "مع SynchronizationContext أحادي الـ thread، يكون الـ thread المحجوز هو الوحيد المسموح له بتنفيذ الـ continuation، فلا يبدأ أبداً. ASP.NET Core أزال الـ SynchronizationContext، فتذهب الـ continuations إلى الـ pool ويمكن تنفيذها على thread آخر — تخسر thread لكن لا يتجمّد النظام." } },
      { t: "qa", level: "mid", q: { en: "When would you return ValueTask instead of Task?", ar: "متى تُرجِع ValueTask بدلاً من Task؟" },
        a: { en: "On a hot path that usually completes synchronously — a cache hit, a buffered read. It avoids the Task allocation. The cost is a stricter contract: a ValueTask may be awaited only once and must not be stored or awaited concurrently.", ar: "في مسار ساخن يكتمل عادة بشكل synchronous — cache hit أو قراءة من buffer. يوفّر تخصيص الـ Task. والثمن عقد أكثر صرامة: الـ ValueTask يُنتظر مرة واحدة فقط ولا يُخزَّن ولا يُنتظر بالتوازي." } },
      { t: "qa", level: "senior", q: { en: "Production symptom: p99 latency climbs to seconds under load while CPU sits at 20%. How do you diagnose it?", ar: "أعراض في الإنتاج: زمن الاستجابة p99 يصل إلى ثوانٍ تحت الحمل بينما الـ CPU على 20%. كيف تشخّص ذلك؟" },
        a: { en: "That shape is thread pool starvation. Watch dotnet-counters for ThreadPool Queue Length and Thread Count — a growing queue with idle CPU means threads are blocked, not busy. Then take a dump and look at parallel stacks for frames sitting in Monitor.Wait, Task.Result, .Wait(), or a synchronous DB/HTTP call. The fix is removing the block, not raising ThreadPool.SetMinThreads — that only buys time.", ar: "هذا الشكل هو thread pool starvation. راقب dotnet-counters على ThreadPool Queue Length و Thread Count — طابور متزايد مع CPU خامل يعني أن الـ threads محجوزة لا مشغولة. ثم خذ dump وافحص الـ parallel stacks بحثاً عن إطارات متوقفة على Monitor.Wait أو Task.Result أو .Wait() أو استدعاء DB/HTTP متزامن. الحل إزالة الحجز، لا رفع ThreadPool.SetMinThreads — هذا يشتري وقتاً فقط." } },
      { t: "qa", level: "senior", q: { en: "How does cancellation actually propagate?", ar: "كيف ينتشر الإلغاء فعلياً؟" },
        a: { en: "Cooperatively. A CancellationToken is a signal; nothing is preempted. Each layer must accept the token, pass it down, and either poll ThrowIfCancellationRequested or hand it to an API that registers a callback. A token that stops at your controller boundary is decoration, not cancellation.", ar: "بشكل تعاوني. الـ CancellationToken إشارة فقط؛ لا شيء يُقاطَع قسراً. كل طبقة يجب أن تستقبل الـ token وتمرّره للأسفل، وإما تفحص ThrowIfCancellationRequested أو تمرّره لـ API يسجّل callback. الـ token الذي يتوقف عند حدود الـ controller زينة لا إلغاء." } },
      { t: "qa", level: "staff", q: { en: "You own a platform where teams keep shipping sync-over-async. How do you fix it structurally?", ar: "أنت مسؤول عن منصة تستمر الفرق في نشر sync-over-async فيها. كيف تحل المشكلة هيكلياً؟" },
        a: { en: "Make the wrong thing hard and the right thing default. Ban the blocking members with an analyzer at build time, ship shared clients that only expose async APIs, put ThreadPool queue length on the service dashboard with an alert, and add a load test to the pipeline that fails on latency regression. Education alone does not survive team turnover; the build gate does.", ar: "اجعل الخطأ صعباً والصحيح افتراضياً. امنع الأعضاء الحاجزين عبر analyzer وقت البناء، وانشر clients مشتركة لا تعرض إلا APIs غير متزامنة، وضع ThreadPool queue length على لوحة الخدمة مع تنبيه، وأضف اختبار حمل في الـ pipeline يفشل عند تراجع زمن الاستجابة. التوعية وحدها لا تصمد أمام تغيّر الفرق؛ بوابة البناء تصمد." } },
      { t: "qa", level: "staff", q: { en: "Where does async stop helping, and what do you reach for then?", ar: "أين يتوقف الـ async عن الإفادة، وما البديل حينها؟" },
        a: { en: "When the bottleneck is downstream capacity rather than local threads. Freeing threads then just lets you queue more work against something already saturated, turning a fast failure into a slow one. That is the point for backpressure: bounded queues, concurrency limits per dependency, load shedding, and circuit breakers.", ar: "عندما يكون العنق سعة الخدمات الخارجية لا الـ threads المحلية. تحرير الـ threads حينها يعني فقط أن تصطف أعمال أكثر أمام شيء مُشبع بالفعل، فيتحوّل الفشل السريع إلى فشل بطيء. هنا يأتي دور الـ backpressure: طوابير محدودة، وحدود تزامن لكل تبعية، وإسقاط الحمل، وcircuit breakers." } }
    ]},
    { key: "codereview", blocks: [
      { t: "review", severity: "high",
        title: { en: "Blocking inside a request handler", ar: "حجز داخل معالج request" },
        bad: "[HttpGet(\"{id}\")]\npublic IActionResult Get(int id)\n{\n    var order = _repo.GetAsync(id).Result;   // blocks a pool thread\n    var quote = _pricing.QuoteAsync(order.Sku).GetAwaiter().GetResult();\n    return Ok(new { order, quote });\n}",
        good: "[HttpGet(\"{id}\")]\npublic async Task<IActionResult> Get(int id, CancellationToken ct)\n{\n    var order = await _repo.GetAsync(id, ct);\n    var quote = await _pricing.QuoteAsync(order.Sku, ct);\n    return Ok(new { order, quote });\n}",
        why: { en: "Each blocked call holds a ThreadPool thread for the full I/O duration. Under load the pool cannot inject threads fast enough and every endpoint in the process gets slower — including healthy ones. The async version also honours client disconnects through the token.", ar: "كل استدعاء محجوز يحتجز thread من الـ ThreadPool لكامل مدة الـ I/O. تحت الحمل لا يستطيع الـ pool إضافة threads بالسرعة الكافية فتتباطأ كل نقاط النهاية في العملية — حتى السليمة منها. والنسخة غير المتزامنة تحترم أيضاً انقطاع العميل عبر الـ token." } },
      { t: "review", severity: "medium",
        title: { en: "Awaiting in a loop over independent items", ar: "await داخل حلقة على عناصر مستقلة" },
        bad: "foreach (var id in ids)\n    results.Add(await _client.FetchAsync(id));",
        good: "using var gate = new SemaphoreSlim(8);\nvar tasks = ids.Select(async id =>\n{\n    await gate.WaitAsync(ct);\n    try { return await _client.FetchAsync(id, ct); }\n    finally { gate.Release(); }\n});\nvar results = await Task.WhenAll(tasks);",
        why: { en: "The loop serialises latency: 200 items × 50 ms is 10 seconds. WhenAll overlaps them, and the semaphore keeps the fan-out bounded so you do not replace your own bottleneck with a downstream outage.", ar: "الحلقة تجعل زمن الانتظار تسلسلياً: 200 عنصر × 50 ملّي ثانية = 10 ثوان. الـ WhenAll يشبكها، والـ semaphore يحدّ التوزيع حتى لا تستبدل عنق زجاجتك بانهيار خدمة خارجية." } }
    ]},
    { key: "sysdesign", blocks: [
      { t: "p", en: "Asynchrony is what makes a modern API gateway viable. A gateway does almost no computation: it authenticates, routes, aggregates, and waits. With async, one modest instance can hold tens of thousands of open connections, because an idle connection costs a socket and a small object rather than a thread.", ar: "اللاتزامن هو ما يجعل الـ API gateway الحديث عملياً. الـ gateway لا يحسب شيئاً تقريباً: يوثّق، ويوجّه، ويجمّع، وينتظر. مع الـ async يمكن لنسخة متوسطة أن تحمل عشرات آلاف الاتصالات المفتوحة، لأن الاتصال الخامل يكلّف socket وكائناً صغيراً لا thread." },
      { t: "ul", en: ["Backend-for-frontend endpoints that fan out to several services and merge one response", "Long-polling, SSE and WebSocket endpoints, where connections are mostly idle by definition", "Queue consumers that spend their life awaiting a broker", "Streaming responses with IAsyncEnumerable, so you do not buffer a large result set in memory"],
             ar: ["نقاط backend-for-frontend التي توزّع على عدة خدمات وتدمج استجابة واحدة", "نقاط long-polling وSSE وWebSocket، حيث الاتصالات خاملة بطبيعتها", "مستهلكو الطوابير الذين يقضون عمرهم في انتظار الـ broker", "الاستجابات المتدفقة عبر IAsyncEnumerable، فلا تُخزّن نتيجة كبيرة في الذاكرة"] },
      { t: "callout", kind: "warn", en: "Async increases the concurrency your service can push downstream. Always pair it with a concurrency limit per dependency, or the first thing you scale is the outage.", ar: "الـ async يزيد التزامن الذي تدفعه خدمتك إلى الخدمات الخارجية. اقرنه دائماً بحد تزامن لكل تبعية، وإلا فأول ما ستوسّعه هو الانهيار." }
    ]},
    { key: "perf", blocks: [
      { t: "kv", rows: [
        { k: { en: "Memory", ar: "الذاكرة" }, v: { en: "A suspended await boxes the state machine onto the heap and allocates a Task. Synchronous fast paths should return ValueTask to avoid both. Watch for closures capturing more than they need.", ar: "الـ await الذي يتوقف فعلياً يعلّب الـ state machine على الـ heap ويخصّص Task. المسارات السريعة المتزامنة يجب أن تُرجِع ValueTask لتجنّب الاثنين. وانتبه للـ closures التي تلتقط أكثر مما تحتاج." } },
        { k: { en: "CPU", ar: "المعالج" }, v: { en: "Roughly 100 ns of overhead per suspension — irrelevant next to a 5 ms query, significant in a million-iteration loop. Do not make trivial synchronous methods async.", ar: "قرابة 100 نانوثانية زيادة لكل توقف — لا قيمة لها أمام استعلام 5 ملّي ثانية، لكنها مهمة في حلقة بمليون تكرار. لا تجعل الـ methods المتزامنة التافهة async." } },
        { k: { en: "Network", ar: "الشبكة" }, v: { en: "Reuse HttpClient through IHttpClientFactory. A new HttpClient per call exhausts sockets in TIME_WAIT and adds a TLS handshake to every request.", ar: "أعد استخدام HttpClient عبر IHttpClientFactory. إنشاء HttpClient لكل استدعاء يستنزف الـ sockets في TIME_WAIT ويضيف TLS handshake لكل request." } },
        { k: { en: "Database", ar: "قاعدة البيانات" }, v: { en: "The connection pool becomes the new limit. Async lets 5,000 requests race for 100 connections; that is a Timeout expired exception, not a win. Size the pool and the concurrency limit together.", ar: "الـ connection pool يصبح الحد الجديد. الـ async يسمح لـ5000 request بالتسابق على 100 اتصال؛ والنتيجة استثناء Timeout expired لا مكسب. حدّد حجم الـ pool وحد التزامن معاً." } },
        { k: { en: "Scalability", ar: "قابلية التوسّع" }, v: { en: "Throughput becomes a function of cores and downstream capacity instead of connection count — the difference between vertical scaling and horizontal scaling actually paying off.", ar: "الـ throughput يصبح دالة لعدد الأنوية وسعة الخدمات الخارجية بدلاً من عدد الاتصالات — وهذا فرق بين التوسّع العمودي والتوسّع الأفقي المُجدي." } },
        { k: { en: "Latency", ar: "زمن الاستجابة" }, v: { en: "Median barely moves; p99 improves dramatically because requests stop queueing behind held threads. If p99 gets worse after going async, look for an unbounded fan-out.", ar: "الوسيط لا يتغير كثيراً؛ لكن p99 يتحسّن بشكل كبير لأن الـ requests تتوقف عن الاصطفاف خلف threads محجوزة. وإذا سُوء p99 بعد التحويل إلى async فابحث عن fan-out غير محدود." } }
      ]}
    ]},
    { key: "debug", blocks: [
      { t: "ul", en: ["dotnet-counters monitor --counters System.Runtime — read threadpool-queue-length, threadpool-thread-count and gc-heap-size together; a rising queue with flat CPU is starvation", "dotnet-dump collect then dumpasync in dotnet-dump analyze — shows async call chains that a normal stack trace cannot reconstruct", "Visual Studio Parallel Stacks or dotnet-stack report — find the frames sitting in Task.Result, .Wait(), Monitor.Wait or a sync socket read", "Distributed tracing (OpenTelemetry) — spans reveal whether the time went to waiting on a dependency or to sitting in your own queue", "TaskScheduler.UnobservedTaskException — hook it in production to catch fire-and-forget failures you are currently swallowing"],
             ar: ["dotnet-counters monitor --counters System.Runtime — اقرأ threadpool-queue-length وthreadpool-thread-count وgc-heap-size معاً؛ طابور متزايد مع CPU ثابت يعني starvation", "dotnet-dump collect ثم dumpasync داخل dotnet-dump analyze — يعرض سلاسل الاستدعاء غير المتزامنة التي لا يستطيع الـ stack trace العادي إعادة بنائها", "Parallel Stacks في Visual Studio أو dotnet-stack report — ابحث عن الإطارات المتوقفة على Task.Result أو .Wait() أو Monitor.Wait أو قراءة socket متزامنة", "التتبّع الموزّع (OpenTelemetry) — الـ spans تكشف إن كان الوقت ذهب لانتظار تبعية أم للاصطفاف في طابورك", "TaskScheduler.UnobservedTaskException — علّق عليه في الإنتاج لتلتقط فشل fire-and-forget الذي تبتلعه حالياً"] },
      { t: "callout", kind: "tip", en: "Reproduce starvation before you fix it: a load test with 500 virtual users against an endpoint containing one .Result will show the latency cliff within a minute. Then remove the block and run the same test.", ar: "أعد إنتاج الـ starvation قبل إصلاحه: اختبار حمل بـ500 مستخدم افتراضي على نقطة تحتوي .Result واحدة سيُظهر الهبوط الحاد في دقيقة. ثم أزل الحجز وأعد نفس الاختبار." }
    ]},
    { key: "realworld", blocks: [
      { t: "p", en: "Every high-throughput service you use is asynchronous somewhere in its stack, because the alternative does not fit on the hardware. The shapes repeat:", ar: "كل خدمة عالية الـ throughput تستخدمها هي غير متزامنة في مكان ما من طبقاتها، لأن البديل لا يتسع على العتاد. والأنماط تتكرر:" },
      { t: "ul", en: ["Chat and messaging platforms hold millions of mostly-idle connections; a thread per connection is arithmetically impossible", "Video and content platforms build one screen from many service calls, so the page is as slow as the slowest call, not the sum of all of them", "Ride-hailing and delivery services stream position updates continuously — long-lived, low-traffic connections are the async use case", "Cloud SDKs expose async-only clients because a control-plane call can take seconds and holding a thread for it is indefensible"],
             ar: ["منصات المحادثة تحمل ملايين الاتصالات الخاملة معظم الوقت؛ وthread لكل اتصال مستحيل حسابياً", "منصات الفيديو والمحتوى تبني الشاشة من استدعاءات خدمات كثيرة، فتصبح الصفحة بسرعة أبطأ استدعاء لا بمجموعها", "خدمات النقل والتوصيل تبثّ تحديثات الموقع باستمرار — اتصالات طويلة العمر قليلة الحركة، وهي حالة الـ async النموذجية", "SDKs السحابية تعرض clients غير متزامنة فقط لأن استدعاء control-plane قد يستغرق ثوانٍ وحجز thread له غير مبرّر"] }
    ]},
    { key: "exercises", blocks: [
      { t: "ex", diff: "easy", en: "Write a minimal API endpoint that calls two independent HTTP services and returns both results. Measure it with sequential awaits, then with Task.WhenAll, and record the difference.", ar: "اكتب نقطة minimal API تستدعي خدمتي HTTP مستقلتين وتعيد النتيجتين. قِسها بـawait متسلسلة ثم بـTask.WhenAll، وسجّل الفرق." },
      { t: "ex", diff: "medium", en: "Deliberately cause thread pool starvation: one endpoint with a .Result on a 200 ms call, hit it with 300 concurrent users, and capture the queue length from dotnet-counters. Then fix it and prove the cliff is gone.", ar: "تسبّب في thread pool starvation عن قصد: نقطة واحدة فيها .Result على استدعاء 200 ملّي ثانية، اضربها بـ300 مستخدم متزامن، والتقط طول الطابور من dotnet-counters. ثم أصلحها وأثبت أن الهبوط اختفى." },
      { t: "ex", diff: "hard", en: "Implement a bounded async cache: concurrent callers asking for the same missing key must trigger exactly one load and all await the same result. Handle failure so a thrown load does not poison the cache entry.", ar: "نفّذ async cache محدوداً: المستدعون المتزامنون لنفس المفتاح المفقود يجب أن يشغّلوا تحميلاً واحداً بالضبط وينتظروا نفس النتيجة. وتعامل مع الفشل بحيث لا يسمّم تحميل فاشل المدخل في الـ cache." },
      { t: "ex", diff: "senior", en: "Take a synchronous legacy service and write the migration plan: the order of layers to convert, how to keep the public API stable during the transition, the analyzer rules you add, and the metrics that tell you it worked. One page.", ar: "خذ خدمة قديمة متزامنة واكتب خطة الترحيل: ترتيب الطبقات التي تُحوَّل، وكيف تُبقي الـ API العامة مستقرة خلال الانتقال، وقواعد الـ analyzer التي تضيفها، والمقاييس التي تخبرك أن الخطة نجحت. صفحة واحدة." }
    ]},
    { key: "refs", blocks: [
      { t: "ref", label: { en: "Asynchronous programming — Microsoft Learn", ar: "البرمجة غير المتزامنة — Microsoft Learn" }, url: "https://learn.microsoft.com/dotnet/csharp/asynchronous-programming/", meta: { en: "Docs", ar: "توثيق" } },
      { t: "ref", label: { en: "Stephen Cleary — Async and Await", ar: "Stephen Cleary — Async and Await" }, url: "https://blog.stephencleary.com/2012/02/async-and-await.html", meta: { en: "Article", ar: "مقال" } },
      { t: "ref", label: { en: "Stephen Toub — How Async/Await Really Works in C#", ar: "Stephen Toub — كيف يعمل Async/Await فعلياً" }, url: "https://devblogs.microsoft.com/dotnet/how-async-await-really-works/", meta: { en: "Deep dive", ar: "تفصيل عميق" } },
      { t: "ref", label: { en: "ThreadPool starvation — .NET diagnostics docs", ar: "ThreadPool starvation — توثيق تشخيص .NET" }, url: "https://learn.microsoft.com/dotnet/core/diagnostics/", meta: { en: "Docs", ar: "توثيق" } },
      { t: "ref", label: { en: "Concurrency in C# Cookbook — Stephen Cleary", ar: "Concurrency in C# Cookbook — Stephen Cleary" }, url: "https://www.oreilly.com/library/view/concurrency-in-c/9781492054498/", meta: { en: "Book", ar: "كتاب" } }
    ]}
  ],
  quiz: [
    { q: { en: "Under load, CPU is at 15% and p99 latency is 8 seconds. What is the most likely cause?", ar: "تحت الحمل، الـ CPU على 15% وp99 يساوي 8 ثوان. ما السبب الأرجح؟" },
      options: [{ en: "The garbage collector is pausing too often", ar: "الـ garbage collector يوقف التنفيذ كثيراً" }, { en: "ThreadPool starvation from blocking calls", ar: "ThreadPool starvation بسبب استدعاءات حاجزة" }, { en: "The CPU needs more cores", ar: "الـ CPU يحتاج أنوية أكثر" }, { en: "Serialization overhead", ar: "زيادة زمن الـ serialization" }],
      correct: 1, why: { en: "Idle CPU with terrible latency means threads are waiting, not working. GC pauses would show as CPU spikes; more cores cannot help threads that are blocked.", ar: "CPU خامل مع زمن استجابة سيئ يعني أن الـ threads تنتظر لا تعمل. توقّفات الـ GC تظهر كقفزات CPU، وزيادة الأنوية لا تنفع threads محجوزة." } },
    { q: { en: "In ASP.NET Core, what does await do to the request's thread while an I/O call is in flight?", ar: "في ASP.NET Core، ماذا يفعل الـ await بـthread الـ request أثناء استدعاء I/O جارٍ؟" },
      options: [{ en: "Keeps it parked on the request", ar: "يبقيه متوقفاً على الـ request" }, { en: "Returns it to the ThreadPool", ar: "يعيده إلى الـ ThreadPool" }, { en: "Creates a second thread to wait", ar: "ينشئ thread ثانياً للانتظار" }, { en: "Moves it to a dedicated I/O thread", ar: "ينقله إلى thread مخصّص للـ I/O" }],
      correct: 1, why: { en: "The method returns at the suspension point and the thread goes back to the pool. The wait itself is held by the OS completion port.", ar: "الـ method تخرج عند نقطة التوقف ويعود الـ thread إلى الـ pool. والانتظار نفسه يحمله completion port في نظام التشغيل." } },
    { q: { en: "Which is the correct use of Task.Run in an ASP.NET Core controller?", ar: "ما الاستخدام الصحيح لـTask.Run داخل controller في ASP.NET Core؟" },
      options: [{ en: "Wrapping a database call to make it async", ar: "تغليف استدعاء قاعدة بيانات لجعله async" }, { en: "Wrapping an HTTP call to avoid blocking", ar: "تغليف استدعاء HTTP لتجنّب الحجز" }, { en: "Almost never — it just moves work between pool threads", ar: "تقريباً أبداً — هو ينقل العمل بين threads نفس الـ pool" }, { en: "Around every handler for safety", ar: "حول كل معالج من أجل الأمان" }],
      correct: 2, why: { en: "On the server there is no UI thread to protect. Task.Run adds a queue hop and frees nothing; use the genuinely async API instead.", ar: "على السيرفر لا يوجد UI thread تحميه. الـ Task.Run يضيف خطوة في الطابور ولا يحرّر شيئاً؛ استخدم الـ API غير المتزامن الحقيقي." } },
    { q: { en: "Why must a library use ConfigureAwait(false) while application code usually need not?", ar: "لماذا تحتاج المكتبة إلى ConfigureAwait(false) بينما كود التطبيق عادة لا يحتاجه؟" },
      options: [{ en: "It makes the library faster in all cases", ar: "يجعل المكتبة أسرع في كل الحالات" }, { en: "A library cannot know its caller's synchronization context", ar: "المكتبة لا تعرف السياق الذي يستدعيها" }, { en: "It is required for cancellation to work", ar: "لازم لعمل الإلغاء" }, { en: "It prevents exceptions from being wrapped", ar: "يمنع لفّ الاستثناءات" }],
      correct: 1, why: { en: "The library may be consumed from WPF, from a legacy ASP.NET app, or from a console app. Not capturing the context avoids an unnecessary marshalling hop and the classic deadlock.", ar: "قد تُستخدم المكتبة من WPF أو من تطبيق ASP.NET قديم أو من console. عدم التقاط السياق يتجنّب خطوة نقل زائدة والـ deadlock الكلاسيكي." } },
    { q: { en: "What is the strongest reason to prefer ValueTask on a hot path?", ar: "ما أقوى سبب لتفضيل ValueTask في مسار ساخن؟" },
      options: [{ en: "It cannot throw", ar: "لا يمكن أن يرمي استثناءً" }, { en: "It avoids a heap allocation when the call completes synchronously", ar: "يتجنّب تخصيصاً على الـ heap عندما يكتمل الاستدعاء بشكل synchronous" }, { en: "It supports multiple awaits", ar: "يدعم عدة awaits" }, { en: "It runs on a dedicated thread", ar: "ينفّذ على thread مخصّص" }],
      correct: 1, why: { en: "Cache hits and buffered reads finish without suspending, so there is nothing to allocate. The trade-off is that a ValueTask may be awaited only once.", ar: "الـ cache hits والقراءات من الـ buffer تنتهي بلا توقف، فلا شيء يُخصَّص. والمقايضة أن الـ ValueTask يُنتظر مرة واحدة فقط." } }
  ]
};

// ---------------------------------------------------------------- lesson: garbage collector

const gcLesson = {
  id: "gc",
  moduleId: "runtime",
  title: { en: "The Garbage Collector and managed memory", ar: "الـ Garbage Collector وإدارة الذاكرة" },
  summary: {
    en: "Generations, the large object heap, what actually causes a pause, and how to stop allocating your way into one.",
    ar: "الأجيال، والـ large object heap، وما يسبّب التوقف فعلياً، وكيف تتوقف عن التخصيص الذي يقودك إليه."
  },
  mins: 22,
  sections: [
    { key: "why", blocks: [
      { t: "p", en: "Manual memory management is correct only if every path frees exactly once. Decades of shipped software show that humans do not manage that at scale: use-after-free, double free, and leaks are the result. The GC trades a small, measurable runtime cost for the removal of an entire class of bugs.", ar: "الإدارة اليدوية للذاكرة صحيحة فقط إذا حرّر كل مسار مرة واحدة بالضبط. عقود من البرمجيات تُظهر أن البشر لا ينجحون في ذلك على نطاق واسع: use-after-free وdouble free والتسريبات هي النتيجة. الـ GC يقايض تكلفة صغيرة قابلة للقياس مقابل إزالة صنف كامل من الأخطاء." },
      { t: "p", en: "The other half of the deal is allocation speed. Because the managed heap is compacted, allocating is usually a pointer bump: increment a pointer, return the address. That is faster than a general-purpose malloc walking a free list.", ar: "النصف الآخر من الصفقة هو سرعة التخصيص. لأن الـ managed heap مضغوط، فالتخصيص عادة مجرد تحريك مؤشر: زد المؤشر وأعد العنوان. وهذا أسرع من malloc عام يمشي على قائمة حرة." }
    ]},
    { key: "problem", blocks: [
      { t: "p", en: "The GC solves lifetime, not usage. It answers \"is anything still able to reach this object?\" — and if nothing can, the memory returns. What it does not solve is you keeping references alive: a static dictionary, an event handler never unsubscribed, or a cache with no eviction policy is a leak the GC is contractually obliged to respect.", ar: "الـ GC يحل مسألة العمر لا مسألة الاستخدام. يجيب على سؤال: «هل ما زال شيء يستطيع الوصول إلى هذا الكائن؟» — وإن لم يستطع، تعود الذاكرة. وما لا يحله هو إبقاؤك للمراجع حية: dictionary ثابت، أو event handler لم تُلغِ الاشتراك فيه، أو cache بلا سياسة إخراج — كلها تسريبات يلزم الـ GC عقدياً باحترامها." },
      { t: "callout", kind: "note", en: "\"Managed\" means no dangling pointers. It does not mean no memory leaks.", ar: "«Managed» تعني لا مؤشرات معلّقة. لا تعني عدم وجود تسريبات ذاكرة." }
    ]},
    { key: "internals", blocks: [
      { t: "p", en: "The heap is generational, on the empirical observation that most objects die young. New allocations go into gen 0, a small region — a few hundred kilobytes to a few megabytes. When it fills, a gen 0 collection runs, which is cheap because it only has to look at a small region.", ar: "الـ heap مقسّم إلى أجيال، بناءً على ملاحظة تجريبية: معظم الكائنات تموت صغيرة. التخصيصات الجديدة تذهب إلى gen 0، وهي منطقة صغيرة — من مئات الكيلوبايت إلى بضعة ميغابايت. وعند امتلائها يجري gen 0 collection، وهو رخيص لأنه يفحص منطقة صغيرة فقط." },
      { t: "diagram", name: "gcheap" },
      { t: "p", en: "Survivors are promoted: gen 0 to gen 1, gen 1 to gen 2. Gen 2 is the whole long-lived heap, so a gen 2 collection is the expensive one — it must trace the full object graph. Anything allocated at 85 KB or larger skips straight to the Large Object Heap, which is collected with gen 2 and is not compacted by default.", ar: "الناجون يُرقّون: من gen 0 إلى gen 1، ومن gen 1 إلى gen 2. الـ gen 2 هو كامل الـ heap طويل العمر، لذا فـgen 2 collection هو المكلف — لأنه يجب أن يتبع رسم الكائنات كاملاً. وأي كائن بحجم 85 كيلوبايت أو أكثر يذهب مباشرة إلى الـ Large Object Heap، الذي يُجمع مع gen 2 ولا يُضغط افتراضياً." },
      { t: "p", en: "A collection has three phases. Mark: start from the roots — stacks, statics, GC handles, finalizer queue — and follow every reference, marking what is reachable. Sweep or plan: work out what is garbage. Compact: move survivors together and update every reference to them. Compaction is why object addresses are not stable, and why pinning a buffer for interop hurts.", ar: "لكل عملية جمع ثلاث مراحل. Mark: ابدأ من الجذور — الـ stacks والـ statics وGC handles وطابور الـ finalizer — واتبع كل مرجع، وعلّم ما يمكن الوصول إليه. Sweep أو plan: حدّد ما هو نفايات. Compact: انقل الناجين معاً وحدّث كل المراجع إليهم. الضغط هو سبب عدم ثبات عناوين الكائنات، وسبب ضرر تثبيت (pinning) الـ buffers للـ interop." },
      { t: "kv", rows: [
        { k: { en: "Workstation GC", ar: "Workstation GC" }, v: { en: "One collection thread, tuned for low pause on a desktop. The default for client apps.", ar: "thread جمع واحد، مضبوط لتوقف قصير على سطح المكتب. الافتراضي لتطبيقات العميل." } },
        { k: { en: "Server GC", ar: "Server GC" }, v: { en: "One heap and one collection thread per core. Much higher throughput, more memory used. Default in ASP.NET Core; the wrong choice inside a one-core container.", ar: "heap وthread جمع لكل نواة. throughput أعلى بكثير واستهلاك ذاكرة أكبر. الافتراضي في ASP.NET Core؛ وخيار خاطئ داخل حاوية بنواة واحدة." } },
        { k: { en: "Background gen 2", ar: "Background gen 2" }, v: { en: "Marks the gen 2 graph concurrently with your code running, so the stop-the-world portion is short instead of proportional to heap size.", ar: "يعلّم رسم gen 2 بالتوازي مع تنفيذ كودك، فتكون فترة إيقاف العالم قصيرة بدلاً من أن تتناسب مع حجم الـ heap." } },
        { k: { en: "Card table", ar: "Card table" }, v: { en: "A write barrier records which old-generation regions were written to, so a gen 0 collection can find old-to-new references without scanning all of gen 2.", ar: "write barrier يسجّل مناطق الأجيال القديمة التي كُتب فيها، فيستطيع gen 0 collection إيجاد المراجع من القديم إلى الجديد دون مسح gen 2 كله." } }
      ]},
      { t: "callout", kind: "warn", en: "Finalizers do not free memory — they delay it. An object with a finalizer survives the collection that found it dead, waits in the finalizer queue, and is only released on the next collection. A blocking finalizer stalls that queue for every object behind it.", ar: "الـ finalizers لا تحرّر الذاكرة — بل تؤخّرها. الكائن الذي له finalizer ينجو من العملية التي وجدته ميتاً، وينتظر في طابور الـ finalizer، ولا يُحرَّر إلا في العملية التالية. وfinalizer حاجز يعطّل ذلك الطابور لكل كائن خلفه." }
    ]},
    { key: "tradeoffs", blocks: [
      { t: "tradeoff",
        pros: { en: ["Removes use-after-free, double free and most leaks by construction", "Allocation is a pointer bump — cheaper than a general allocator", "Compaction keeps hot objects close, which the CPU cache rewards", "Developers spend their attention on the domain, not on ownership"],
                ar: ["يزيل use-after-free وdouble free ومعظم التسريبات بحكم البناء", "التخصيص مجرد تحريك مؤشر — أرخص من مخصّص عام", "الضغط يُبقي الكائنات الساخنة متقاربة، وهو ما يكافئه cache المعالج", "المطورون يصرفون انتباههم على المجال لا على الملكية"] },
        cons: { en: ["Pauses are non-deterministic — a problem for hard real time", "Higher memory ceiling: the heap holds garbage until a collection runs", "Allocation patterns become a performance concern you must learn to see", "Unmanaged resources still need IDisposable; the GC does not know about handles"],
                ar: ["التوقّفات غير حتمية — مشكلة في الأنظمة ذات الزمن الحقيقي الصارم", "سقف ذاكرة أعلى: الـ heap يحمل النفايات حتى تجري عملية جمع", "أنماط التخصيص تصبح هماً أدائياً يجب أن تتعلم رؤيته", "الموارد غير المُدارة تحتاج IDisposable؛ الـ GC لا يعرف الـ handles"] },
        limits: { en: ["Cannot collect what is still reachable — statics, events and caches leak by design", "Large Object Heap fragments because it is not compacted by default", "Pinned buffers block compaction and fragment the heap"],
                  ar: ["لا يجمع ما يمكن الوصول إليه — الـ statics والأحداث والـ caches تسرّب بحكم التصميم", "الـ Large Object Heap يتفتّت لأنه لا يُضغط افتراضياً", "الـ buffers المثبّتة تمنع الضغط وتفتّت الـ heap"] },
        alts: { en: ["Span<T> and stackalloc to keep short-lived data off the heap entirely", "ArrayPool<T> and MemoryPool<T> to reuse large buffers instead of re-allocating", "Structs and readonly struct for small value-like data", "Native memory via NativeMemory.Alloc for the rare case that must be unmanaged"],
                ar: ["Span<T> و stackalloc لإبقاء البيانات قصيرة العمر خارج الـ heap تماماً", "ArrayPool<T> و MemoryPool<T> لإعادة استخدام الـ buffers الكبيرة بدلاً من إعادة تخصيصها", "الـ structs و readonly struct للبيانات الصغيرة ذات الطابع القيمي", "الذاكرة الأصلية عبر NativeMemory.Alloc للحالة النادرة التي يجب أن تكون غير مُدارة"] }
      }
    ]},
    { key: "mistakes", blocks: [
      { t: "mistake", title: { en: "Calling GC.Collect()", ar: "استدعاء GC.Collect()" },
        body: { en: "It forces a full blocking collection, discards the tuning the runtime learned about your workload, and promotes objects that would have died in gen 0. Almost every use in application code is a workaround for a leak that is still there.", ar: "يفرض عملية جمع كاملة حاجزة، ويهدر الضبط الذي تعلّمه الـ runtime عن حملك، ويُرقّي كائنات كانت ستموت في gen 0. وكل استخدام له في كود التطبيق تقريباً هو تغطية على تسريب لا يزال موجوداً." } },
      { t: "mistake", title: { en: "Events that are never unsubscribed", ar: "أحداث لا يُلغى الاشتراك فيها" },
        body: { en: "The publisher holds a reference to the subscriber. A long-lived publisher therefore keeps every short-lived subscriber alive — the most common managed leak there is. Unsubscribe in Dispose, or use weak references.", ar: "الناشر يحمل مرجعاً للمشترك. لذا يُبقي ناشر طويل العمر كل مشترك قصير العمر حياً — وهو أشهر تسريب مُدار. ألغِ الاشتراك في Dispose أو استخدم مراجع ضعيفة." } },
      { t: "mistake", title: { en: "Ignoring the 85 KB threshold", ar: "تجاهل حد الـ85 كيلوبايت" },
        body: { en: "Repeatedly allocating arrays just over 85 KB fills the LOH, which is not compacted, so you fragment memory and force gen 2 collections. Rent from ArrayPool<byte> instead.", ar: "تخصيص مصفوفات فوق 85 كيلوبايت مراراً يملأ الـ LOH غير المضغوط، فتُفتّت الذاكرة وتفرض عمليات gen 2. استعِر من ArrayPool<byte> بدلاً من ذلك." },
        fix: "var buffer = ArrayPool<byte>.Shared.Rent(size);\ntry { /* use buffer */ }\nfinally { ArrayPool<byte>.Shared.Return(buffer); }" },
      { t: "mistake", title: { en: "Server GC inside a small container", ar: "Server GC داخل حاوية صغيرة" },
        body: { en: "Server GC sizes its heaps per core and can happily use several times the memory a workstation configuration would. In a 512 MB container that reads as an OOMKill. Set DOTNET_gcServer deliberately and give the runtime accurate CPU and memory limits.", ar: "الـ Server GC يحدّد أحجام heaps لكل نواة وقد يستخدم أضعاف ما تستخدمه إعدادات workstation. وفي حاوية بـ512 ميغابايت يظهر ذلك كـOOMKill. اضبط DOTNET_gcServer بوعي وأعطِ الـ runtime حدود CPU وذاكرة دقيقة." } },
      { t: "mistake", title: { en: "String concatenation in a loop", ar: "دمج النصوص داخل حلقة" },
        body: { en: "Strings are immutable, so every += allocates a new one and abandons the old. Ten thousand iterations is ten thousand dead strings and a lot of gen 0 pressure. Use StringBuilder, or string.Create / interpolated handlers on hot paths.", ar: "النصوص غير قابلة للتغيير، فكل += يخصّص نصاً جديداً ويتخلى عن القديم. عشرة آلاف تكرار تعني عشرة آلاف نص ميت وضغطاً كبيراً على gen 0. استخدم StringBuilder أو string.Create في المسارات الساخنة." } }
    ]},
    { key: "interview", blocks: [
      { t: "qa", level: "junior", q: { en: "What is the difference between a value type and a reference type in terms of memory?", ar: "ما الفرق بين value type و reference type من ناحية الذاكرة؟" },
        a: { en: "A value type holds its data inline — on the stack as a local, or inside its containing object on the heap. A reference type is always a heap object; the variable holds the address. \"Structs are on the stack\" is a useful simplification, not a rule: a struct field of a class lives on the heap.", ar: "الـ value type يحمل بياناته داخلياً — على الـ stack كمتغير محلي، أو داخل الكائن الحاوي على الـ heap. أما reference type فهو دائماً كائن على الـ heap والمتغير يحمل العنوان. وعبارة «الـ structs على الـ stack» تبسيط مفيد لا قاعدة: struct كـfield في class يعيش على الـ heap." } },
      { t: "qa", level: "junior", q: { en: "What does IDisposable have to do with the GC?", ar: "ما علاقة IDisposable بالـ GC؟" },
        a: { en: "Almost nothing, and that is the point. The GC reclaims managed memory. IDisposable releases things the GC has no idea about: file handles, sockets, database connections. using guarantees the release happens promptly instead of whenever a collection happens to run.", ar: "لا شيء تقريباً، وهذا هو المقصود. الـ GC يستعيد الذاكرة المُدارة. أما IDisposable فيحرّر ما لا يعرفه الـ GC: file handles وsockets واتصالات قواعد البيانات. وusing يضمن التحرير فوراً بدلاً من انتظار عملية جمع." } },
      { t: "qa", level: "mid", q: { en: "Why is a gen 2 collection so much more expensive than gen 0?", ar: "لماذا تكون عملية gen 2 أغلى بكثير من gen 0؟" },
        a: { en: "Gen 0 is a small region and the card table tells the GC which old regions might point into it, so the work is bounded. Gen 2 is the entire long-lived heap: the collector must trace the whole reachable graph and potentially compact gigabytes. Cost scales with live data, not with garbage.", ar: "الـ gen 0 منطقة صغيرة، والـ card table يخبر الـ GC أي مناطق قديمة قد تشير إليها، فيكون العمل محدوداً. أما gen 2 فهو كامل الـ heap طويل العمر: يجب على الجامع أن يتبع الرسم القابل للوصول بالكامل وربما يضغط غيغابايتات. والتكلفة تتناسب مع البيانات الحيّة لا مع النفايات." } },
      { t: "qa", level: "mid", q: { en: "What is boxing and when does it actually matter?", ar: "ما هو الـ boxing ومتى يهم فعلياً؟" },
        a: { en: "Boxing wraps a value type in a heap object so it can be treated as object or a non-generic interface. One box is trivial; a box per item in a hot loop is a measurable allocation rate. Generics, generic constraints and Span<T> are how you avoid it.", ar: "الـ boxing يلفّ value type في كائن على الـ heap ليُعامَل كـobject أو interface غير عام. صندوق واحد لا قيمة له؛ لكن صندوقاً لكل عنصر في حلقة ساخنة يعني معدل تخصيص ملحوظاً. والـ generics وقيودها وSpan<T> هي طريقة تجنّبه." } },
      { t: "qa", level: "senior", q: { en: "Memory grows steadily in production and never comes back down. Walk me through the investigation.", ar: "الذاكرة تنمو باطراد في الإنتاج ولا تعود للانخفاض. اشرح لي خطوات التحقيق." },
        a: { en: "First separate a leak from a high ceiling: does gen 2 size grow monotonically across collections? Then take two dumps twenty minutes apart under the same load, and diff the object counts by type — the type that grew is your lead. Follow GC roots on a sample instance to find who is holding it. Usual suspects: a static collection, an event subscription, a cache with no eviction, or an HttpClient captured somewhere it should not be. Confirm by fixing one holder and re-running the same soak test.", ar: "أولاً افصل التسريب عن السقف العالي: هل ينمو حجم gen 2 باطراد عبر عمليات الجمع؟ ثم خذ dumpين بفارق عشرين دقيقة تحت نفس الحمل، وقارن عدد الكائنات حسب النوع — النوع الذي نما هو دليلك. اتبع GC roots على نسخة نموذجية لمعرفة من يحملها. المشتبهون المعتادون: مجموعة static، أو اشتراك في حدث، أو cache بلا إخراج، أو HttpClient مُلتقط في مكان لا يجب. أكّد ذلك بإصلاح حامل واحد وإعادة نفس اختبار التحميل الطويل." } },
      { t: "qa", level: "senior", q: { en: "How would you reduce allocations on a hot path without hurting readability?", ar: "كيف تقلّل التخصيصات في مسار ساخن دون الإضرار بقابلية القراءة؟" },
        a: { en: "Measure first with a memory profiler or BenchmarkDotNet MemoryDiagnoser, so you optimise the top allocator rather than a guess. Then in order of payoff: pool large buffers with ArrayPool, use Span and stackalloc for slicing and parsing, remove boxing and LINQ closures from the innermost loop, and return ValueTask where the fast path is synchronous. Keep the optimised code behind a clean interface so the rest of the codebase stays ordinary.", ar: "قِس أولاً بمحلّل ذاكرة أو MemoryDiagnoser في BenchmarkDotNet، حتى تُحسّن أكبر مخصّص لا تخميناً. ثم حسب الجدوى: جمّع الـ buffers الكبيرة عبر ArrayPool، واستخدم Span وstackalloc للتقطيع والتحليل، وأزل الـ boxing وclosures الـ LINQ من الحلقة الأعمق، وأرجع ValueTask حيث يكون المسار السريع متزامناً. وأبقِ الكود المُحسَّن خلف interface نظيف ليبقى بقية النظام عادياً." } },
      { t: "qa", level: "staff", q: { en: "A latency-sensitive service has an SLO on p99. How do you make GC pauses a non-issue?", ar: "خدمة حسّاسة لزمن الاستجابة لديها SLO على p99. كيف تجعل توقّفات الـ GC غير مؤثرة؟" },
        a: { en: "Treat pause time as a budgeted resource. Reduce the live set so gen 2 tracing is cheap, keep allocation rate low so collections are rare, enable Server GC with background gen 2, and pin CPU and memory limits so the runtime tunes for the real box. Then instrument: pause duration percentiles as a first-class metric next to request latency. If the budget still does not fit, that is the argument for moving the hottest component to a pooled, allocation-free design rather than fighting the collector.", ar: "اعتبر زمن التوقف مورداً ذا ميزانية. قلّل المجموعة الحيّة ليصبح تتبّع gen 2 رخيصاً، وأبقِ معدل التخصيص منخفضاً لتكون العمليات نادرة، وفعّل Server GC مع background gen 2، وثبّت حدود CPU والذاكرة ليضبط الـ runtime نفسه على الجهاز الحقيقي. ثم قِس: نسب زمن التوقف كمقياس أصيل بجانب زمن استجابة الـ request. وإن لم تتسع الميزانية بعد ذلك، فهذه هي الحجة لنقل أسخن مكوّن إلى تصميم مجمّع بلا تخصيصات بدلاً من مصارعة الجامع." } }
    ]},
    { key: "codereview", blocks: [
      { t: "review", severity: "high",
        title: { en: "Unbounded static cache", ar: "cache ثابت بلا حدود" },
        bad: "static readonly Dictionary<string, Report> _cache = new();\n\npublic Report Get(string key)\n{\n    if (!_cache.TryGetValue(key, out var r))\n        _cache[key] = r = Build(key);   // never evicted, never bounded\n    return r;\n}",
        good: "private readonly IMemoryCache _cache;\n\npublic Report Get(string key) =>\n    _cache.GetOrCreate(key, e =>\n    {\n        e.SetSize(1);\n        e.SlidingExpiration = TimeSpan.FromMinutes(10);\n        return Build(key);\n    });\n// registered with: services.AddMemoryCache(o => o.SizeLimit = 5_000);",
        why: { en: "A static dictionary is a GC root that lives for the whole process. Every entry is permanently reachable, so gen 2 grows without limit and collections get slower as it does. It is also not thread-safe here: concurrent writes can corrupt the dictionary's internal state.", ar: "الـ dictionary الثابت جذر GC يعيش طول عمر العملية. كل مدخل يبقى قابلاً للوصول دائماً، فينمو gen 2 بلا حد وتصبح عمليات الجمع أبطأ معه. وهو أيضاً غير آمن مع التزامن هنا: الكتابات المتزامنة قد تُفسد الحالة الداخلية للـ dictionary." } },
      { t: "review", severity: "medium",
        title: { en: "Buffer allocated per call", ar: "buffer يُخصَّص لكل استدعاء" },
        bad: "public async Task CopyAsync(Stream src, Stream dst)\n{\n    var buffer = new byte[128 * 1024];   // LOH, every call\n    int read;\n    while ((read = await src.ReadAsync(buffer)) > 0)\n        await dst.WriteAsync(buffer.AsMemory(0, read));\n}",
        good: "public async Task CopyAsync(Stream src, Stream dst)\n{\n    var buffer = ArrayPool<byte>.Shared.Rent(128 * 1024);\n    try\n    {\n        int read;\n        while ((read = await src.ReadAsync(buffer)) > 0)\n            await dst.WriteAsync(buffer.AsMemory(0, read));\n    }\n    finally { ArrayPool<byte>.Shared.Return(buffer); }\n}",
        why: { en: "128 KB is above the 85 KB threshold, so each call allocates on the Large Object Heap — which is not compacted and is only collected with gen 2. A busy endpoint turns that into fragmentation plus frequent expensive collections. Pooling makes the steady-state allocation zero.", ar: "الـ128 كيلوبايت فوق حد الـ85، فكل استدعاء يخصّص على الـ Large Object Heap — الذي لا يُضغط ولا يُجمع إلا مع gen 2. ونقطة نهاية مزدحمة تحوّل ذلك إلى تفتّت مع عمليات جمع مكلفة متكررة. والتجميع يجعل التخصيص في الحالة المستقرة صفراً." } }
    ]},
    { key: "sysdesign", blocks: [
      { t: "p", en: "Memory behaviour decides your deployment shape more often than CPU does. Container limits, autoscaling thresholds, and how many instances fit on a node are all downstream of the heap.", ar: "سلوك الذاكرة يحدّد شكل نشرك أكثر ممّا يحدّده الـ CPU. حدود الحاويات، وعتبات التوسّع التلقائي، وعدد النسخ التي تتسع على العقدة — كلها نتيجة لسلوك الـ heap." },
      { t: "ul", en: ["Set container memory limits and tell the runtime about them; a GC that thinks it has the whole host will happily get OOMKilled", "High-throughput pipelines (serialization, compression, proxying) are designed around pooled buffers, not around the collector", "In-process caches are a capacity decision: they trade gen 2 size and pause time for fewer round trips", "Batch and reporting workloads have a different profile from request handling — separate them so one does not set the other's GC tuning"],
             ar: ["اضبط حدود ذاكرة الحاوية وأخبر الـ runtime بها؛ الـ GC الذي يظن أن الجهاز كله له سيُقتل بـOOM", "الـ pipelines عالية الـ throughput (serialization وضغط وproxy) تُصمّم حول buffers مجمّعة لا حول الجامع", "الـ caches داخل العملية قرار سعة: تقايض حجم gen 2 وزمن التوقف مقابل رحلات أقل", "أحمال الـ batch والتقارير لها ملف مختلف عن معالجة الـ requests — افصلهما حتى لا يضبط أحدهما GC الآخر"] }
    ]},
    { key: "perf", blocks: [
      { t: "kv", rows: [
        { k: { en: "Memory", ar: "الذاكرة" }, v: { en: "Track allocation rate and gen 2 size separately. High allocation with a flat gen 2 is healthy churn; a growing gen 2 is a leak or an oversized cache.", ar: "تابع معدل التخصيص وحجم gen 2 بشكل منفصل. تخصيص عالٍ مع gen 2 ثابت هو دوران صحي؛ أما gen 2 المتزايد فهو تسريب أو cache مفرط." } },
        { k: { en: "CPU", ar: "المعالج" }, v: { en: "Collection work is CPU work. A service spending more than about 10% of CPU in GC is telling you to allocate less, not to buy cores.", ar: "عمل الجمع عمل CPU. الخدمة التي تصرف أكثر من ~10% من الـ CPU في الـ GC تخبرك أن تخصّص أقل، لا أن تشتري أنوية." } },
        { k: { en: "Latency", ar: "زمن الاستجابة" }, v: { en: "GC pauses land in the tail. A p50 that looks fine with a bad p99 and periodic spikes is a classic collection signature.", ar: "توقّفات الـ GC تظهر في الذيل. p50 جيد مع p99 سيئ وقفزات دورية هو بصمة كلاسيكية لعمليات الجمع." } },
        { k: { en: "Database", ar: "قاعدة البيانات" }, v: { en: "Loading whole tables to filter in memory is a memory problem disguised as a query. Project only the columns you need and page the results.", ar: "تحميل جداول كاملة لتصفيتها في الذاكرة مشكلة ذاكرة متنكّرة كمشكلة استعلام. اختر الأعمدة التي تحتاجها فقط وصفّح النتائج." } },
        { k: { en: "Scalability", ar: "قابلية التوسّع" }, v: { en: "Per-instance memory sets your density. Halving the working set can halve the bill without touching a line of business logic.", ar: "ذاكرة النسخة الواحدة تحدّد كثافة النشر. تنصيف مجموعة العمل قد يُنصّف الفاتورة دون تعديل سطر واحد من منطق العمل." } }
      ]}
    ]},
    { key: "debug", blocks: [
      { t: "ul", en: ["dotnet-counters — gc-heap-size, gen-0/1/2-gc-count, alloc-rate and time-in-gc give you the shape in seconds", "dotnet-gcdump — a heap snapshot you can open in Visual Studio; diff two of them to find what grew", "dotnet-dump analyze — dumpheap -stat for counts by type, then gcroot on an instance to see who holds it", "BenchmarkDotNet with MemoryDiagnoser — allocations per operation, before and after your change", "PerfView or dotnet-trace — for pause durations and which generation is causing them"],
             ar: ["dotnet-counters — الـgc-heap-size وأعداد gen-0/1/2 وalloc-rate وtime-in-gc تعطيك الصورة في ثوان", "dotnet-gcdump — لقطة heap تفتحها في Visual Studio؛ قارن لقطتين لتجد ما نما", "dotnet-dump analyze — استخدم dumpheap -stat للأعداد حسب النوع، ثم gcroot على نسخة لترى من يحملها", "BenchmarkDotNet مع MemoryDiagnoser — التخصيصات لكل عملية، قبل تغييرك وبعده", "PerfView أو dotnet-trace — لمدد التوقف وأي جيل يسبّبها"] },
      { t: "callout", kind: "tip", en: "Always diff two snapshots under the same load. A single heap dump tells you what is big; two tell you what is growing, and only the second question identifies a leak.", ar: "قارن دائماً لقطتين تحت نفس الحمل. لقطة heap واحدة تخبرك بما هو كبير؛ ولقطتان تخبرانك بما ينمو، والسؤال الثاني وحده يحدّد التسريب." }
    ]},
    { key: "realworld", blocks: [
      { t: "p", en: "Wherever a managed runtime handles serious volume, the same engineering shows up: reduce allocation, pool what is large, and measure pause time as a product metric.", ar: "في كل مكان يتعامل فيه runtime مُدار مع حجم جدّي، يظهر نفس الهندسة: قلّل التخصيص، وجمّع ما هو كبير، وقِس زمن التوقف كمقياس منتج." },
      { t: "ul", en: ["Web servers and reverse proxies process bytes through pooled buffers and pipelines so a request costs near-zero allocations", "Search and analytics engines fight the tail: pause time is a user-visible latency, so live-set size becomes a design constraint", "Trading and telemetry systems adopt allocation-free hot paths and pre-warmed pools rather than accept non-deterministic pauses", "Cost-driven platform teams treat working-set reduction as an infrastructure saving, because density per node is money"],
             ar: ["سيرفرات الويب والـ reverse proxies تعالج البايتات عبر buffers مجمّعة وpipelines حتى يكلّف الـ request تخصيصات تقارب الصفر", "محرّكات البحث والتحليلات تحارب الذيل: زمن التوقف زمن استجابة يراه المستخدم، فيصبح حجم المجموعة الحيّة قيداً تصميمياً", "أنظمة التداول والقياس تتبنّى مسارات ساخنة بلا تخصيص وpools مُسخّنة مسبقاً بدلاً من قبول توقّفات غير حتمية", "فرق المنصات المدفوعة بالتكلفة تعتبر تقليص مجموعة العمل وفراً في البنية التحتية، لأن الكثافة على العقدة مال"] }
    ]},
    { key: "exercises", blocks: [
      { t: "ex", diff: "easy", en: "Write a loop that builds a 50,000-character string with += and then with StringBuilder. Measure both with BenchmarkDotNet and MemoryDiagnoser, and explain the allocation numbers.", ar: "اكتب حلقة تبني نصاً بخمسين ألف حرف باستخدام += ثم باستخدام StringBuilder. قِس الاثنين بـBenchmarkDotNet وMemoryDiagnoser، واشرح أرقام التخصيص." },
      { t: "ex", diff: "medium", en: "Build a leak on purpose: an event publisher that outlives its subscribers. Take two gcdumps, diff them, and identify the growing type and its GC root. Then fix it and prove the growth is gone.", ar: "ابنِ تسريباً عن قصد: ناشر أحداث يعيش أطول من مشتركيه. خذ لقطتي gcdump، قارنهما، وحدّد النوع المتزايد وجذر GC الخاص به. ثم أصلحه وأثبت أن النمو اختفى." },
      { t: "ex", diff: "hard", en: "Take a JSON parsing path that allocates a 200 KB buffer per request and rewrite it with ArrayPool and Span so steady-state allocation is zero. Report allocations per operation before and after.", ar: "خذ مسار تحليل JSON يخصّص buffer بحجم 200 كيلوبايت لكل request وأعد كتابته بـArrayPool وSpan ليصبح التخصيص في الحالة المستقرة صفراً. واذكر التخصيصات لكل عملية قبل وبعد." },
      { t: "ex", diff: "senior", en: "Write the memory budget for a service you own: expected live set, allocation rate, container limit, GC mode with justification, the alerts you would set, and what you would do first if the budget were exceeded.", ar: "اكتب ميزانية الذاكرة لخدمة تملكها: المجموعة الحيّة المتوقعة، ومعدل التخصيص، وحد الحاوية، ووضع الـ GC مع التبرير، والتنبيهات التي تضبطها، وما ستفعله أولاً إن تجاوزت الميزانية." }
    ]},
    { key: "refs", blocks: [
      { t: "ref", label: { en: "Fundamentals of garbage collection — Microsoft Learn", ar: "أساسيات الـ garbage collection — Microsoft Learn" }, url: "https://learn.microsoft.com/dotnet/standard/garbage-collection/fundamentals", meta: { en: "Docs", ar: "توثيق" } },
      { t: "ref", label: { en: "Workstation and server GC", ar: "Workstation و Server GC" }, url: "https://learn.microsoft.com/dotnet/standard/garbage-collection/workstation-server-gc", meta: { en: "Docs", ar: "توثيق" } },
      { t: "ref", label: { en: "Large object heap uncovered", ar: "الـ Large Object Heap مكشوفاً" }, url: "https://learn.microsoft.com/dotnet/standard/garbage-collection/large-object-heap", meta: { en: "Docs", ar: "توثيق" } },
      { t: "ref", label: { en: "Pro .NET Memory Management — Konrad Kokosa", ar: "Pro .NET Memory Management — Konrad Kokosa" }, url: "https://prodotnetmemory.com/", meta: { en: "Book", ar: "كتاب" } },
      { t: "ref", label: { en: "BenchmarkDotNet MemoryDiagnoser", ar: "MemoryDiagnoser في BenchmarkDotNet" }, url: "https://benchmarkdotnet.org/articles/configs/diagnosers.html", meta: { en: "Tool", ar: "أداة" } }
    ]}
  ],
  quiz: [
    { q: { en: "Which allocation goes straight to the Large Object Heap?", ar: "أي تخصيص يذهب مباشرة إلى الـ Large Object Heap؟" },
      options: [{ en: "Any array", ar: "أي مصفوفة" }, { en: "An object of 85 KB or more", ar: "كائن بحجم 85 كيلوبايت أو أكثر" }, { en: "Anything allocated in a loop", ar: "أي شيء يُخصَّص في حلقة" }, { en: "Anything with a finalizer", ar: "أي شيء له finalizer" }],
      correct: 1, why: { en: "The threshold is 85,000 bytes. The LOH is collected with gen 2 and is not compacted by default, so repeated large allocations fragment it.", ar: "الحد هو 85000 بايت. الـ LOH يُجمع مع gen 2 ولا يُضغط افتراضياً، فالتخصيصات الكبيرة المتكررة تفتّته." } },
    { q: { en: "What does adding a finalizer to a class cost?", ar: "ما تكلفة إضافة finalizer إلى class؟" },
      options: [{ en: "Nothing, it is free", ar: "لا شيء، مجاني" }, { en: "The object survives one extra collection", ar: "الكائن ينجو من عملية جمع إضافية" }, { en: "The object is never collected", ar: "الكائن لا يُجمع أبداً" }, { en: "It forces a gen 2 collection", ar: "يفرض عملية gen 2" }],
      correct: 1, why: { en: "Finalizable objects are moved to the finalizer queue, run on the finalizer thread, and only then become collectable — so they are promoted and freed later than they should be.", ar: "الكائنات القابلة للـ finalize تُنقل إلى طابور الـ finalizer وتُنفّذ على thread الـ finalizer، وبعدها فقط تصبح قابلة للجمع — فتُرقّى وتُحرَّر متأخرة." } },
    { q: { en: "Memory grows steadily and gen 2 never shrinks. Best first move?", ar: "الذاكرة تنمو باطراد وgen 2 لا ينكمش أبداً. ما أفضل خطوة أولى؟" },
      options: [{ en: "Call GC.Collect() periodically", ar: "استدعِ GC.Collect() دورياً" }, { en: "Increase the container memory limit", ar: "ارفع حد ذاكرة الحاوية" }, { en: "Diff two heap snapshots taken under the same load", ar: "قارن لقطتي heap مأخوذتين تحت نفس الحمل" }, { en: "Switch to Workstation GC", ar: "انتقل إلى Workstation GC" }],
      correct: 2, why: { en: "You need to know which type is growing and what roots it before changing anything. The other three options hide the symptom without touching the cause.", ar: "تحتاج أن تعرف أي نوع ينمو ومن يجذّره قبل تغيير أي شيء. الخيارات الثلاثة الأخرى تخفي العَرَض دون مساس السبب." } },
    { q: { en: "Why is Server GC often the wrong default in a single-core container?", ar: "لماذا يكون Server GC غالباً خياراً خاطئاً في حاوية بنواة واحدة؟" },
      options: [{ en: "It is slower at allocating", ar: "أبطأ في التخصيص" }, { en: "It sizes heaps per core and uses far more memory", ar: "يحدّد أحجام heaps لكل نواة ويستخدم ذاكرة أكثر بكثير" }, { en: "It does not support background collection", ar: "لا يدعم الجمع في الخلفية" }, { en: "It disables compaction", ar: "يعطّل الضغط" }],
      correct: 1, why: { en: "Server GC trades memory for throughput. In a tightly limited container that extra headroom is exactly what triggers an OOMKill.", ar: "الـ Server GC يقايض الذاكرة مقابل الـ throughput. وفي حاوية محدودة بشدة، تلك المساحة الزائدة هي بالضبط ما يُطلق OOMKill." } },
    { q: { en: "A static Dictionary used as a cache with no eviction is best described as:", ar: "Dictionary ثابت مستخدم كـcache بلا إخراج يوصف بأنه:" },
      options: [{ en: "Safe, because the GC will clean it", ar: "آمن، لأن الـ GC سينظّفه" }, { en: "A GC root that leaks by design", ar: "جذر GC يسرّب بحكم التصميم" }, { en: "Only a thread-safety problem", ar: "مشكلة أمان تزامن فقط" }, { en: "Fine if entries are small", ar: "لا بأس به إن كانت المدخلات صغيرة" }],
      correct: 1, why: { en: "It is reachable for the life of the process, so every entry stays live. The GC is behaving correctly; the design is the leak.", ar: "يمكن الوصول إليه طول عمر العملية، فيبقى كل مدخل حياً. الـ GC يعمل بشكل صحيح؛ والتصميم هو التسريب." } }
  ]
};

export const lessonDetail = { "async-await": asyncLesson, "gc": gcLesson };

// ---------------------------------------------------------------- modules

export const modules = [
  { id: "foundations", n: 1, status: "done", hours: 6,
    title: { en: "Backend Foundations", ar: "أساسيات الـ Backend" },
    blurb: { en: "The contract of the web: what a request is, what a status code promises, and why statelessness is a design choice.", ar: "عقد الويب: ما هو الـ request، وما يعنيه الـ status code، ولماذا الـ statelessness قرار تصميمي." },
    topics: [
      { id: "http", title: { en: "HTTP", ar: "HTTP" }, lessons: [
        { id: "http-anatomy", title: { en: "Anatomy of a request", ar: "تشريح الـ request" }, mins: 14, done: true },
        { id: "http-methods", title: { en: "Methods, safety and idempotency", ar: "الـ methods والأمان والـ idempotency" }, mins: 12, done: true },
        { id: "http-caching", title: { en: "Caching headers", ar: "ترويسات الـ caching" }, mins: 16, done: true }
      ]},
      { id: "rest", title: { en: "REST & API design", ar: "REST وتصميم الـ APIs" }, lessons: [
        { id: "rest-constraints", title: { en: "The six constraints", ar: "القيود الستة" }, mins: 13, done: true },
        { id: "api-versioning", title: { en: "Versioning and evolution", ar: "الإصدارات والتطوّر" }, mins: 15, done: true },
        { id: "api-errors", title: { en: "Error contracts", ar: "عقود الأخطاء" }, mins: 11, done: true }
      ]},
      { id: "status", title: { en: "Status codes", ar: "الـ Status codes" }, lessons: [
        { id: "status-choose", title: { en: "Choosing the right code", ar: "اختيار الكود الصحيح" }, mins: 10, done: true },
        { id: "status-retry", title: { en: "What clients retry on", ar: "ما يعيد العملاء المحاولة عليه" }, mins: 9, done: true }
      ]},
      { id: "stateless", title: { en: "Stateless & client–server", ar: "Stateless و Client–Server" }, lessons: [
        { id: "stateless-why", title: { en: "Why stateless scales", ar: "لماذا يتوسّع الـ stateless" }, mins: 12, done: true },
        { id: "session-state", title: { en: "Where session state goes", ar: "إلى أين تذهب حالة الجلسة" }, mins: 14, done: true }
      ]}
    ]},
  { id: "runtime", n: 2, status: "current", hours: 9,
    title: { en: "C# Runtime", ar: "الـ C# Runtime" },
    blurb: { en: "What the CLR does under your code: memory, the collector, value and reference semantics, tasks and threads.", ar: "ما يفعله الـ CLR تحت كودك: الذاكرة، والجامع، ودلالات القيمة والمرجع، والـ tasks والـ threads." },
    topics: [
      { id: "memory", title: { en: "Memory model", ar: "نموذج الذاكرة" }, lessons: [
        { id: "stack-heap", title: { en: "Stack, heap and what lives where", ar: "الـ stack والـ heap وما يعيش في كل منهما" }, mins: 15, done: true },
        { id: "value-reference", title: { en: "Value vs reference semantics", ar: "دلالات القيمة مقابل المرجع" }, mins: 17, done: true },
        { id: "boxing", title: { en: "Boxing and its cost", ar: "الـ boxing وتكلفته" }, mins: 12, done: false }
      ]},
      { id: "gc", title: { en: "Garbage Collector", ar: "الـ Garbage Collector" }, lessons: [
        { id: "gc", title: { en: "The Garbage Collector and managed memory", ar: "الـ Garbage Collector وإدارة الذاكرة" }, mins: 22, done: false, deep: true },
        { id: "gc-disposal", title: { en: "IDisposable and deterministic cleanup", ar: "IDisposable والتنظيف الحتمي" }, mins: 14, done: false }
      ]},
      { id: "async", title: { en: "Concurrency", ar: "التزامن" }, lessons: [
        { id: "async-await", title: { en: "async / await and the ThreadPool", ar: "async / await والـ ThreadPool" }, mins: 24, done: false, deep: true },
        { id: "tasks", title: { en: "Tasks, scheduling and cancellation", ar: "الـ tasks والجدولة والإلغاء" }, mins: 18, done: false },
        { id: "sync-primitives", title: { en: "Locks and synchronization primitives", ar: "الأقفال وأدوات التزامن" }, mins: 20, done: false }
      ]},
      { id: "exceptions", title: { en: "Exceptions", ar: "الاستثناءات" }, lessons: [
        { id: "exception-cost", title: { en: "Cost, filters and rethrow", ar: "التكلفة والـ filters وإعادة الرمي" }, mins: 13, done: false },
        { id: "exception-design", title: { en: "Designing failure boundaries", ar: "تصميم حدود الفشل" }, mins: 15, done: false }
      ]}
    ]},
  { id: "di", n: 3, status: "open", hours: 4,
    title: { en: "Dependency Injection", ar: "Dependency Injection" },
    blurb: { en: "Lifetimes, the composition root, and the captive dependency bug that only appears in production.", ar: "الـ lifetimes، وجذر التركيب، وخطأ الـ captive dependency الذي لا يظهر إلا في الإنتاج." },
    topics: [
      { id: "di-basics", title: { en: "Inversion of control", ar: "عكس التحكّم" }, lessons: [
        { id: "di-why", title: { en: "What DI actually buys you", ar: "ما يمنحه لك الـ DI فعلياً" }, mins: 12, done: false },
        { id: "di-root", title: { en: "The composition root", ar: "جذر التركيب" }, mins: 11, done: false }
      ]},
      { id: "lifetimes", title: { en: "Lifetimes", ar: "الـ Lifetimes" }, lessons: [
        { id: "di-lifetimes", title: { en: "Singleton, scoped, transient", ar: "Singleton و Scoped و Transient" }, mins: 16, done: false },
        { id: "captive", title: { en: "Captive dependencies", ar: "الـ Captive dependencies" }, mins: 13, done: false }
      ]}
    ]},
  { id: "efcore", n: 4, status: "locked", hours: 8,
    title: { en: "Entity Framework Core", ar: "Entity Framework Core" },
    blurb: { en: "Change tracking, the queries EF writes for you, and the N+1 that shows up under real data volume.", ar: "تتبّع التغييرات، والاستعلامات التي يكتبها EF لك، والـ N+1 الذي يظهر مع حجم بيانات حقيقي." },
    topics: [
      { id: "tracking", title: { en: "Change tracking", ar: "تتبّع التغييرات" }, lessons: [
        { id: "ef-tracking", title: { en: "How the tracker works", ar: "كيف يعمل الـ tracker" }, mins: 18, done: false },
        { id: "ef-notracking", title: { en: "When to go no-tracking", ar: "متى تستخدم no-tracking" }, mins: 12, done: false }
      ]},
      { id: "queries", title: { en: "Query translation", ar: "ترجمة الاستعلامات" }, lessons: [
        { id: "ef-n1", title: { en: "N+1 and eager loading", ar: "N+1 والتحميل المبكر" }, mins: 17, done: false },
        { id: "ef-split", title: { en: "Split queries and projections", ar: "الاستعلامات المنفصلة والـ projections" }, mins: 14, done: false }
      ]}
    ]},
  { id: "sql", n: 5, status: "locked", hours: 9,
    title: { en: "SQL Server", ar: "SQL Server" },
    blurb: { en: "Indexes, execution plans, isolation levels and the locking behaviour behind your slowest endpoint.", ar: "الفهارس، وخطط التنفيذ، ومستويات العزل، وسلوك الأقفال خلف أبطأ نقطة نهاية لديك." },
    topics: [
      { id: "indexes", title: { en: "Indexes", ar: "الفهارس" }, lessons: [
        { id: "clustered", title: { en: "Clustered vs non-clustered", ar: "Clustered مقابل Non-clustered" }, mins: 16, done: false },
        { id: "covering", title: { en: "Covering indexes and key lookups", ar: "الفهارس الشاملة وعمليات البحث بالمفتاح" }, mins: 15, done: false }
      ]},
      { id: "plans", title: { en: "Execution plans", ar: "خطط التنفيذ" }, lessons: [
        { id: "read-plan", title: { en: "Reading a plan", ar: "قراءة الخطة" }, mins: 19, done: false },
        { id: "param-sniffing", title: { en: "Parameter sniffing", ar: "Parameter sniffing" }, mins: 14, done: false }
      ]},
      { id: "isolation", title: { en: "Transactions", ar: "المعاملات" }, lessons: [
        { id: "isolation-levels", title: { en: "Isolation levels", ar: "مستويات العزل" }, mins: 18, done: false },
        { id: "deadlocks", title: { en: "Deadlocks and how to read the graph", ar: "الـ deadlocks وقراءة الرسم" }, mins: 16, done: false }
      ]}
    ]},
  { id: "distributed", n: 6, status: "locked", hours: 10,
    title: { en: "Distributed Systems", ar: "الأنظمة الموزّعة" },
    blurb: { en: "Partial failure as the normal case: retries, idempotency, consistency and the outbox pattern.", ar: "الفشل الجزئي كحالة طبيعية: إعادة المحاولة، والـ idempotency، والاتساق، ونمط الـ outbox." },
    topics: [
      { id: "failure", title: { en: "Failure modes", ar: "أنماط الفشل" }, lessons: [
        { id: "retries", title: { en: "Retries, backoff and jitter", ar: "إعادة المحاولة والتراجع والـ jitter" }, mins: 15, done: false },
        { id: "idempotency", title: { en: "Idempotency keys", ar: "مفاتيح الـ idempotency" }, mins: 14, done: false },
        { id: "timeouts", title: { en: "Timeouts and circuit breakers", ar: "المُهل والـ circuit breakers" }, mins: 16, done: false }
      ]},
      { id: "consistency", title: { en: "Consistency", ar: "الاتساق" }, lessons: [
        { id: "cap", title: { en: "CAP in practice", ar: "CAP عملياً" }, mins: 17, done: false },
        { id: "outbox", title: { en: "Outbox and exactly-once delivery", ar: "الـ outbox والتوصيل مرة واحدة" }, mins: 19, done: false }
      ]}
    ]},
  { id: "performance", n: 7, status: "locked", hours: 7,
    title: { en: "Performance", ar: "الأداء" },
    blurb: { en: "Measure, find the real bottleneck, then fix it. Caching, pooling and the arithmetic of latency.", ar: "قِس، وجد العنق الحقيقي، ثم أصلحه. الـ caching والـ pooling وحسابات زمن الاستجابة." },
    topics: [
      { id: "measure", title: { en: "Measurement", ar: "القياس" }, lessons: [
        { id: "benchmarking", title: { en: "Benchmarking honestly", ar: "قياس الأداء بأمانة" }, mins: 15, done: false },
        { id: "percentiles", title: { en: "Percentiles, not averages", ar: "النسب المئوية لا المتوسطات" }, mins: 12, done: false }
      ]},
      { id: "caching", title: { en: "Caching", ar: "الـ Caching" }, lessons: [
        { id: "cache-layers", title: { en: "Cache layers and invalidation", ar: "طبقات الـ cache والإبطال" }, mins: 18, done: false },
        { id: "stampede", title: { en: "Stampedes and stale-while-revalidate", ar: "الـ stampede و stale-while-revalidate" }, mins: 14, done: false }
      ]}
    ]},
  { id: "architecture", n: 8, status: "locked", hours: 8,
    title: { en: "Architecture", ar: "المعمارية" },
    blurb: { en: "Boundaries, dependencies pointing inward, and choosing a structure you can still change in two years.", ar: "الحدود، والتبعيات التي تتجه للداخل، واختيار بنية تستطيع تغييرها بعد عامين." },
    topics: [
      { id: "layers", title: { en: "Boundaries", ar: "الحدود" }, lessons: [
        { id: "clean-arch", title: { en: "Clean architecture, honestly assessed", ar: "Clean architecture بتقييم صادق" }, mins: 18, done: false },
        { id: "vertical-slice", title: { en: "Vertical slices", ar: "الشرائح العمودية" }, mins: 14, done: false }
      ]},
      { id: "patterns", title: { en: "Patterns", ar: "الأنماط" }, lessons: [
        { id: "cqrs", title: { en: "CQRS and when it is overkill", ar: "CQRS ومتى يكون مبالغة" }, mins: 16, done: false },
        { id: "events", title: { en: "Domain events", ar: "أحداث المجال" }, mins: 15, done: false }
      ]}
    ]},
  { id: "observability", n: 9, status: "locked", hours: 5,
    title: { en: "Observability", ar: "قابلية المراقبة" },
    blurb: { en: "Logs, metrics and traces that answer questions you have not thought of yet.", ar: "سجلات ومقاييس وتتبّعات تجيب أسئلة لم تفكّر بها بعد." },
    topics: [
      { id: "signals", title: { en: "The three signals", ar: "الإشارات الثلاث" }, lessons: [
        { id: "structured-logs", title: { en: "Structured logging", ar: "التسجيل المنظّم" }, mins: 13, done: false },
        { id: "metrics", title: { en: "Metrics that matter", ar: "المقاييس المهمة" }, mins: 14, done: false },
        { id: "tracing", title: { en: "Distributed tracing", ar: "التتبّع الموزّع" }, mins: 17, done: false }
      ]}
    ]},
  { id: "skills", n: 10, status: "locked", hours: 5,
    title: { en: "Engineering Skills", ar: "مهارات الهندسة" },
    blurb: { en: "Reviewing code, writing a design doc, and making a technical argument that survives disagreement.", ar: "مراجعة الكود، وكتابة مستند تصميم، وبناء حجة تقنية تصمد أمام الاعتراض." },
    topics: [
      { id: "craft", title: { en: "Craft", ar: "الحرفة" }, lessons: [
        { id: "code-review", title: { en: "Reviewing code well", ar: "مراجعة الكود بشكل جيد" }, mins: 14, done: false },
        { id: "design-doc", title: { en: "Writing a design doc", ar: "كتابة مستند تصميم" }, mins: 16, done: false },
        { id: "tradeoff-writing", title: { en: "Arguing trade-offs", ar: "مناقشة المقايضات" }, mins: 12, done: false }
      ]}
    ]}
];
