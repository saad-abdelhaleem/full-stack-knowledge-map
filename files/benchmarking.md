```js
const benchmarkingLesson = {
  id: "benchmarking",
  moduleId: "performance",
  title: { en: "Benchmarking honestly", ar: "قياس الأداء بأمانة" },
  summary: {
    en: "How to measure code speed so the number means something — warmup, isolation, and the mistakes that produce fake results.",
    ar: "كيف تقيس سرعة الكود بحيث يعني الرقم شيئاً حقيقياً — الـ warmup والعزل والأخطاء التي تنتج أرقاماً مزيّفة."
  },
  mins: 15,
  sections: [
    {
      key: "why",
      blocks: [
        { t: "p",
          en: "A benchmark is a small, repeatable test that measures how long a piece of code takes to run. You use it to answer one question: is version A faster than version B? The problem is that measuring code speed is easy to get wrong, and a wrong number looks exactly like a right one.",
          ar: "الـ benchmark هو اختبار صغير قابل للتكرار يقيس كم يستغرق تشغيل جزء من الكود. تستخدمه للإجابة عن سؤال واحد: هل النسخة A أسرع من النسخة B؟ المشكلة أن قياس سرعة الكود سهل الخطأ، والرقم الخاطئ يبدو تماماً مثل الرقم الصحيح." },
        { t: "kv", rows: [
          { k: { en: "Benchmark", ar: "Benchmark" }, v: { en: "A repeatable test that measures how long code takes.", ar: "اختبار قابل للتكرار يقيس الزمن الذي يستغرقه الكود." } },
          { k: { en: "JIT (Just-In-Time compiler)", ar: "JIT" }, v: { en: "The part of .NET that turns your code into machine code the first time a method runs.", ar: "الجزء من .NET الذي يحوّل الكود إلى machine code أول مرة تعمل فيها الدالة." } },
          { k: { en: "Warmup", ar: "Warmup" }, v: { en: "Running the code a few times before measuring, so the JIT has already compiled it.", ar: "تشغيل الكود عدة مرات قبل القياس، حتى يكون الـ JIT قد جهّزه مسبقاً." } },
          { k: { en: "Throughput", ar: "Throughput" }, v: { en: "How many operations run per second — the inverse of time per operation.", ar: "عدد العمليات في الثانية — عكس الزمن لكل عملية." } },
          { k: { en: "Variance", ar: "Variance" }, v: { en: "How much the measured times spread around the average; high variance means an unreliable result.", ar: "مقدار تشتّت الأزمنة حول المتوسط؛ الـ variance العالي يعني نتيجة غير موثوقة." } },
          { k: { en: "Dead code elimination", ar: "Dead code elimination" }, v: { en: "The compiler deleting code whose result is never used — which can make a benchmark measure nothing.", ar: "حذف المترجم للكود الذي لا تُستخدم نتيجته — ما قد يجعل الـ benchmark يقيس لا شيء." } }
        ]},
        { t: "p",
          en: "Think of timing a runner. If you start the stopwatch while they are still tying their shoes, the time is meaningless. Code has the same warmup: the first run pays for the JIT compiling the method and for cold CPU caches. Measuring that first run tells you about startup, not about steady-state speed.",
          ar: "تخيّل توقيت عدّاء. لو بدأت الـ stopwatch وهو ما زال يربط حذاءه، فالزمن بلا معنى. الكود له warmup مماثل: التشغيل الأول يدفع ثمن ترجمة الـ JIT للدالة وثمن الـ CPU caches الباردة. قياس ذلك التشغيل الأول يخبرك عن بدء التشغيل، لا عن السرعة في الحالة المستقرة." },
        { t: "p",
          en: "Our running example for the whole lesson: building a 10,000-character string. One version uses `+=` in a loop; the other uses `StringBuilder`. We want an honest answer to which is faster and by how much.",
          ar: "مثالنا الجاري طوال الدرس: بناء نص من 10,000 حرف. نسخة تستخدم `+=` داخل loop؛ والأخرى تستخدم `StringBuilder`. نريد إجابة أمينة: أيهما أسرع وبكم." },
        { t: "callout", kind: "note",
          en: "A benchmark measures relative speed under controlled conditions. It does not prove your production endpoint is fast — that needs load testing and real traffic. Keep the two apart in your head.",
          ar: "الـ benchmark يقيس السرعة النسبية تحت ظروف مضبوطة. لا يثبت أن endpoint الإنتاج سريع — ذلك يحتاج load testing وترافيك حقيقي. افصل بين الاثنين في ذهنك." }
      ]
    },
    {
      key: "problem",
      blocks: [
        { t: "p",
          en: "The obvious way to measure is to wrap the code in a `Stopwatch` and print the elapsed time. It looks correct and it is almost always wrong. Run it once and you measure JIT compilation plus cold caches. Run it in a Debug build and the compiler skips the optimizations that ship to production.",
          ar: "الطريقة البديهية للقياس هي لفّ الكود بـ `Stopwatch` وطباعة الزمن المنقضي. تبدو صحيحة وهي خاطئة غالباً. شغّلها مرة واحدة فتقيس ترجمة الـ JIT مع الـ caches الباردة. شغّلها في Debug build فيتخطّى المترجم التحسينات التي تذهب للإنتاج." },
        { t: "code", lang: "csharp", label: { en: "The naive measurement — do not trust this", ar: "القياس الساذج — لا تثق به" },
          code: "var sw = Stopwatch.StartNew();\nstring s = \"\";\nfor (int i = 0; i < 10_000; i++)\n    s += \"x\";           // each += copies the whole string so far\nsw.Stop();\nConsole.WriteLine(sw.ElapsedMilliseconds + \" ms\");\n// prints wildly different numbers each run: 6, 14, 3, 22 ..." },
        { t: "p",
          en: "The numbers jump around because a single run is dominated by noise: garbage collection firing at a random moment, the operating system scheduling another process onto your core, and the first-call JIT cost. One run gives you one draw from a noisy distribution, not the true speed.",
          ar: "الأرقام تقفز لأن التشغيل الواحد تسيطر عليه الضوضاء: الـ garbage collection يعمل في لحظة عشوائية، ونظام التشغيل يجدول عملية أخرى على نفس النواة، وتكلفة الـ JIT في الاستدعاء الأول. التشغيل الواحد يعطيك سحبة واحدة من توزيع صاخب، لا السرعة الحقيقية." },
        { t: "kv", rows: [
          { k: { en: "Naive Stopwatch, 1 run, Debug", ar: "Stopwatch ساذج، تشغيل واحد، Debug" }, v: { en: "3–22 ms, unrepeatable — measures noise and startup, not the code.", ar: "3–22 ms، غير قابل للتكرار — يقيس الضوضاء وبدء التشغيل، لا الكود." } },
          { k: { en: "Proper benchmark, Release", ar: "Benchmark سليم، Release" }, v: { en: "+= ≈ 55 µs, StringBuilder ≈ 6 µs — StringBuilder about 9× faster, stable across runs.", ar: "‏+= ≈ 55 µs، StringBuilder ≈ 6 µs — الـ StringBuilder أسرع نحو 9× وثابت عبر التشغيلات." } }
        ]},
        { t: "p",
          en: "The difference is not small. µs means microsecond — one millionth of a second. The honest tool gives a stable ratio (StringBuilder ~9× faster) that you can defend in a review. The naive tool gave a number you could not repeat, which means it proved nothing.",
          ar: "الفرق ليس صغيراً. µs تعني microsecond — جزء من مليون من الثانية. الأداة الأمينة تعطي نسبة ثابتة (StringBuilder أسرع بنحو 9×) يمكنك الدفاع عنها في مراجعة. الأداة الساذجة أعطت رقماً لا يمكنك تكراره، ما يعني أنها لم تثبت شيئاً." }
      ]
    },
    {
      key: "internals",
      blocks: [
        { t: "p",
          en: "The standard tool in .NET is BenchmarkDotNet, a library that runs your method for you and does everything the naive approach skips. You mark a method with `[Benchmark]` and call `BenchmarkRunner.Run<T>()`. It measures correctly by controlling the three things that ruin a benchmark: cold JIT, dead code, and noise.",
          ar: "الأداة القياسية في .NET هي BenchmarkDotNet، مكتبة تشغّل دالتك عنك وتفعل كل ما يتخطّاه الأسلوب الساذج. تضع `[Benchmark]` على الدالة وتستدعي `BenchmarkRunner.Run<T>()`. تقيس بشكل صحيح عبر ضبط ثلاثة أمور تفسد الـ benchmark: الـ JIT البارد، والكود الميت، والضوضاء." },
        { t: "code", lang: "csharp", label: { en: "The same comparison, measured honestly", ar: "نفس المقارنة، مقيسة بأمانة" },
          code: "[MemoryDiagnoser]                 // also report allocations and GC\npublic class StringBench\n{\n    [Params(10_000)]              // run the whole thing for this input size\n    public int N;\n\n    [Benchmark(Baseline = true)]  // the reference to compare against\n    public string PlusEquals()\n    {\n        string s = \"\";\n        for (int i = 0; i < N; i++) s += \"x\";\n        return s;                 // returned, so it is not dead code\n    }\n\n    [Benchmark]\n    public string Builder()\n    {\n        var sb = new StringBuilder();\n        for (int i = 0; i < N; i++) sb.Append('x');\n        return sb.ToString();\n    }\n}\n// Program.cs:  BenchmarkRunner.Run<StringBench>();   // in a Release build" },
        { t: "p",
          en: "Here is what the library does, step by step, for each method. First it runs a pilot stage to find how many times it must call the method so one measurement lasts long enough to be reliable. Then it runs warmup iterations — throwaway runs that let the JIT compile the method to optimized machine code and warm the CPU caches. Only then does it run the measured iterations and record each timing.",
          ar: "إليك ما تفعله المكتبة، خطوة بخطوة، لكل دالة. أولاً تشغّل مرحلة pilot لتجد كم مرة يجب استدعاء الدالة حتى يدوم القياس الواحد وقتاً كافياً ليكون موثوقاً. ثم تشغّل تكرارات warmup — تشغيلات تُرمى تسمح للـ JIT بترجمة الدالة إلى machine code محسّن وتسخين الـ CPU caches. عندها فقط تشغّل التكرارات المقيسة وتسجّل كل توقيت." },
        { t: "kv", rows: [
          { k: { en: "Process isolation", ar: "Process isolation" }, v: { en: "Each method runs in its own separate process so one cannot pollute another's JIT or caches.", ar: "كل دالة تعمل في process منفصل خاص بها فلا تلوّث واحدة الـ JIT أو الـ caches للأخرى." } },
          { k: { en: "Warmup iterations", ar: "تكرارات الـ warmup" }, v: { en: "Discarded runs that trigger JIT compilation before measuring.", ar: "تشغيلات مُهملة تُطلق ترجمة الـ JIT قبل القياس." } },
          { k: { en: "Measured iterations", ar: "التكرارات المقيسة" }, v: { en: "The runs that count; the mean and spread come from these.", ar: "التشغيلات التي تُحتسب؛ المتوسط والتشتّت يأتيان منها." } },
          { k: { en: "Consuming the result", ar: "استهلاك النتيجة" }, v: { en: "Returning a value stops the compiler from deleting the work as dead code.", ar: "إرجاع قيمة يمنع المترجم من حذف العمل باعتباره كوداً ميتاً." } }
        ]},
        { t: "p",
          en: "The warmup step is the runner tying their shoes off the clock. By the time BenchmarkDotNet starts the real stopwatch, the method is already fully compiled and the caches are warm — so the number reflects steady-state speed, which is what runs in production. It repeats the measured iterations many times and reports the mean, the standard deviation (how much the times spread), and the median.",
          ar: "خطوة الـ warmup هي ربط العدّاء لحذائه خارج التوقيت. عندما يبدأ BenchmarkDotNet الـ stopwatch الحقيقي، تكون الدالة قد تُرجمت بالكامل والـ caches ساخنة — فيعكس الرقم السرعة في الحالة المستقرة، وهي ما يعمل في الإنتاج. يكرّر التكرارات المقيسة مرات كثيرة ويبلّغ المتوسط والـ standard deviation (مقدار تشتّت الأزمنة) والوسيط." }
      ]
    },
    {
      key: "tradeoffs",
      blocks: [
        { t: "tradeoff",
          pros: { en: [
            "Results are stable and repeatable, so a comparison actually means something.",
            "Handles JIT warmup, dead-code elimination, and process isolation for you.",
            "[MemoryDiagnoser] reports allocations and GC counts, not just time.",
            "[Params] runs the same benchmark across several input sizes automatically."
          ], ar: [
            "النتائج ثابتة وقابلة للتكرار، فالمقارنة تعني شيئاً فعلاً.",
            "يتكفّل بالـ JIT warmup وحذف الكود الميت وعزل الـ process عنك.",
            "‏[MemoryDiagnoser] يبلّغ الـ allocations وعدّات الـ GC، لا الزمن فقط.",
            "‏[Params] يشغّل نفس الـ benchmark عبر أحجام مدخلات عدة تلقائياً."
          ]},
          cons: { en: [
            "A full run is slow — seconds to minutes per method because of many iterations.",
            "Measures a method in isolation, not your real endpoint under load.",
            "Setup has rules (Release build, no debugger) that are easy to get wrong."
          ], ar: [
            "التشغيل الكامل بطيء — ثوانٍ إلى دقائق لكل دالة بسبب كثرة التكرارات.",
            "يقيس دالة معزولة، لا endpoint الحقيقي تحت الحمل.",
            "للإعداد قواعد (Release build، بلا debugger) يسهل الإخطاء فيها."
          ]},
          limits: { en: [
            "Tells you relative speed, not whether the code is fast enough for your SLO.",
            "Micro-optimizing a method that is not the bottleneck wastes effort.",
            "Numbers are machine-specific; compare on the same hardware."
          ], ar: [
            "يخبرك بالسرعة النسبية، لا إن كان الكود سريعاً كفاية لـ SLO لديك.",
            "التحسين الدقيق لدالة ليست عنق الزجاجة يهدر الجهد.",
            "الأرقام خاصة بالجهاز؛ قارن على نفس العتاد."
          ]},
          alts: { en: [
            "Load testing (k6, wrk) for whole-endpoint throughput under traffic.",
            "A profiler (dotTrace, PerfView) to find which method to benchmark first.",
            "Production metrics and percentiles for real user-facing latency."
          ], ar: [
            "‏Load testing (k6، wrk) لقياس throughput الـ endpoint كاملاً تحت الترافيك.",
            "‏Profiler (dotTrace، PerfView) لإيجاد أي دالة تقيسها أولاً.",
            "مقاييس الإنتاج والـ percentiles للـ latency الحقيقي أمام المستخدم."
          ]}
        }
      ]
    },
    {
      key: "mistakes",
      blocks: [
        { t: "mistake",
          title: { en: "Benchmarking a Debug build", ar: "قياس Debug build" },
          body: { en: "Someone ran BenchmarkDotNet from Visual Studio with the debugger attached, in a Debug configuration. Debug turns off compiler optimizations, so every number was 2–5× slower than production and the ranking between methods even flipped. BenchmarkDotNet actually warns about this, but the warning was ignored.", ar: "شغّل أحدهم BenchmarkDotNet من Visual Studio مع الـ debugger موصولاً، في إعداد Debug. الـ Debug يطفئ تحسينات المترجم، فكان كل رقم أبطأ 2–5× من الإنتاج بل انقلب الترتيب بين الدوال. الأداة تحذّر من هذا فعلاً، لكن التحذير أُهمل." },
          fix: "dotnet run -c Release --project Bench   # always Release, no debugger" },
        { t: "mistake",
          title: { en: "The compiler deleted the work", ar: "المترجم حذف العمل" },
          body: { en: "A benchmark computed a hash but never used the result. In an optimized build the compiler saw the result was unused and removed the whole computation — dead code elimination. The benchmark reported 0.3 ns, which is impossibly fast, because it was measuring an empty method. Returning the value fixes it.", ar: "حسب benchmark قيمة hash لكنه لم يستخدم النتيجة. في build محسّن رأى المترجم أن النتيجة غير مستخدمة فأزال الحساب كله — dead code elimination. أبلغ الـ benchmark 0.3 ns، وهي سرعة مستحيلة، لأنه كان يقيس دالة فارغة. إرجاع القيمة يصلح ذلك." },
          fix: "[Benchmark]\npublic int Work() => Compute(input);   // return it, do not discard" },
        { t: "mistake",
          title: { en: "Setup counted as measurement", ar: "إعداد محسوب ضمن القياس" },
          body: { en: "The benchmark allocated a 1 million-item array inside the measured method. Building the array dwarfed the operation being tested, so the result was mostly array-allocation time. Move one-time setup into a `[GlobalSetup]` method, which runs once and is not timed.", ar: "خصّص الـ benchmark مصفوفة من مليون عنصر داخل الدالة المقيسة. بناء المصفوفة طغى على العملية المختبَرة، فكانت النتيجة زمن تخصيص المصفوفة غالباً. انقل الإعداد لمرة واحدة إلى دالة `[GlobalSetup]` تعمل مرة واحدة ولا تُقاس." },
          fix: "[GlobalSetup] public void Setup() => _data = BuildData();\n[Benchmark] public int Sum() => _data.Sum();" },
        { t: "mistake",
          title: { en: "Trusting a tiny difference", ar: "الثقة بفارق ضئيل" },
          body: { en: "Two methods measured 12.1 ns and 12.4 ns, and someone declared the first the winner. But the standard deviation was ±0.5 ns, larger than the 0.3 ns gap — so the difference is noise. When the spread overlaps the gap, the honest conclusion is 'no measurable difference'.", ar: "قِيست دالتان بـ 12.1 ns و 12.4 ns، فأعلن أحدهم الأولى فائزة. لكن الـ standard deviation كان ±0.5 ns، أكبر من الفجوة 0.3 ns — فالفرق ضوضاء. حين يتداخل التشتّت مع الفجوة، الاستنتاج الأمين هو «لا فرق قابل للقياس»." } }
      ]
    },
    {
      key: "interview",
      blocks: [
        { t: "qa", level: "junior",
          q: { en: "Why not just wrap code in a Stopwatch to measure it?", ar: "لماذا لا نلفّ الكود بـ Stopwatch للقياس فقط؟" },
          a: { en: "Because a single Stopwatch run measures the wrong things: the first call pays for JIT compilation and cold caches, and one run gets hit by random garbage collection and OS scheduling. You get a number you can't repeat. A real benchmark warms up first, runs many times, and reports the spread so you know if the result is trustworthy.", ar: "لأن تشغيل Stopwatch واحداً يقيس أموراً خاطئة: الاستدعاء الأول يدفع ترجمة الـ JIT والـ caches الباردة، والتشغيل الواحد يصيبه garbage collection عشوائي وجدولة نظام التشغيل. تحصل على رقم لا يمكنك تكراره. الـ benchmark الحقيقي يسخّن أولاً، ويشغّل مرات كثيرة، ويبلّغ التشتّت لتعرف إن كانت النتيجة موثوقة." } },
        { t: "qa", level: "mid",
          q: { en: "What is warmup and why does it matter?", ar: "ما هو الـ warmup ولماذا يهم؟" },
          a: { en: "Warmup is running the code a few times before you start measuring. The first time a method runs, the JIT compiles it from IL to machine code, and the CPU caches are cold. If you measure that first run you measure compilation, not the code. Warmup gets the method compiled and the caches warm, so the measured runs reflect steady-state speed — what actually runs in production.", ar: "الـ warmup هو تشغيل الكود عدة مرات قبل بدء القياس. أول مرة تعمل الدالة يترجمها الـ JIT من IL إلى machine code، والـ CPU caches باردة. لو قست ذلك التشغيل الأول فأنت تقيس الترجمة، لا الكود. الـ warmup يجعل الدالة مترجمة والـ caches ساخنة، فتعكس التشغيلات المقيسة السرعة في الحالة المستقرة — ما يعمل فعلاً في الإنتاج." } },
        { t: "qa", level: "mid",
          q: { en: "How do you know a measured difference is real and not noise?", ar: "كيف تعرف أن الفرق المقيس حقيقي وليس ضوضاء؟" },
          a: { en: "You look at the standard deviation, which tells you how much the times spread around the mean. If method A is 12.1 ns ± 0.5 and method B is 12.4 ns ± 0.5, the gap is 0.3 ns but the spread is 0.5 ns — they overlap, so there's no measurable difference. A real difference is one where the gap is clearly bigger than the spread.", ar: "تنظر إلى الـ standard deviation، الذي يخبرك بمقدار تشتّت الأزمنة حول المتوسط. لو كانت A بـ 12.1 ns ± 0.5 و B بـ 12.4 ns ± 0.5، فالفجوة 0.3 ns لكن التشتّت 0.5 ns — يتداخلان، فلا فرق قابل للقياس. الفرق الحقيقي هو حين تكون الفجوة أكبر بوضوح من التشتّت." } },
        { t: "qa", level: "senior",
          q: { en: "What is dead-code elimination and how does it break a benchmark?", ar: "ما هو dead-code elimination وكيف يفسد الـ benchmark؟" },
          a: { en: "The optimizing compiler removes code whose result is never used. In a benchmark, if you compute something and throw the result away, the compiler can delete the whole computation — so you measure an empty method and get an impossibly fast number like 0.3 ns. You prevent it by returning the result from the benchmark method, or in tricky cases by handing it to a consumer object, so the compiler must keep the work.", ar: "المترجم المحسّن يزيل الكود الذي لا تُستخدم نتيجته. في الـ benchmark، لو حسبت شيئاً ورميت النتيجة، فقد يحذف المترجم الحساب كله — فتقيس دالة فارغة وتحصل على رقم مستحيل السرعة مثل 0.3 ns. تمنعه بإرجاع النتيجة من دالة الـ benchmark، أو في الحالات الصعبة بتسليمها لكائن consumer، فيُلزم المترجم بإبقاء العمل." } },
        { t: "qa", level: "senior",
          q: { en: "When is a micro-benchmark the wrong tool?", ar: "متى يكون الـ micro-benchmark الأداة الخطأ؟" },
          a: { en: "When the question is about the whole system, not one method. A micro-benchmark compares two implementations in isolation. It won't tell you your endpoint's latency under 500 concurrent users, or that the real cost is a database round trip. For that you need load testing and production percentiles. Reach for a micro-benchmark only after a profiler has shown you which method actually matters.", ar: "حين يكون السؤال عن النظام كله، لا عن دالة واحدة. الـ micro-benchmark يقارن تنفيذين معزولين. لن يخبرك بـ latency الـ endpoint تحت 500 مستخدماً متزامناً، ولا أن التكلفة الحقيقية هي جولة إلى قاعدة البيانات. لذلك تحتاج load testing و percentiles الإنتاج. لا تلجأ للـ micro-benchmark إلا بعد أن يريك الـ profiler أي دالة تهم فعلاً." } },
        { t: "qa", level: "staff",
          q: { en: "How do you stop your team from shipping benchmarks that lie?", ar: "كيف تمنع فريقك من شحن benchmarks تكذب؟" },
          a: { en: "Make the honest path the default. Keep one benchmark project that only builds in Release, so nobody measures Debug by accident. Require that any performance claim in a pull request links to a BenchmarkDotNet result with the mean and standard deviation, not a Stopwatch screenshot. Add a short review checklist — results consumed, setup outside the timed region, same hardware — and run key benchmarks in CI so a regression is caught automatically instead of argued about.", ar: "اجعل الطريق الأمين هو الافتراضي. احتفظ بمشروع benchmark واحد يُبنى في Release فقط، فلا يقيس أحد Debug بالخطأ. اشترط أن يربط أي ادّعاء أداء في pull request بنتيجة BenchmarkDotNet فيها المتوسط والـ standard deviation، لا صورة Stopwatch. أضف قائمة مراجعة قصيرة — النتائج مستهلَكة، الإعداد خارج المنطقة المقيسة، نفس العتاد — وشغّل الـ benchmarks الأساسية في CI حتى يُلتقط أي تراجع تلقائياً بدل الجدال حوله." } }
      ]
    },
    {
      key: "codereview",
      blocks: [
        { t: "review", severity: "high",
          title: { en: "A perf claim backed by a one-shot Stopwatch", ar: "ادّعاء أداء مسنود بـ Stopwatch لمرة واحدة" },
          bad: "// PR says: \"new parser is 3x faster\"\nvar sw = Stopwatch.StartNew();\nParseNew(input);\nsw.Stop();\nConsole.WriteLine(sw.ElapsedMilliseconds);",
          good: "[MemoryDiagnoser]\npublic class ParserBench\n{\n    [GlobalSetup] public void Setup() => _input = LoadSample();\n    [Benchmark(Baseline = true)] public Node Old() => ParseOld(_input);\n    [Benchmark] public Node New() => ParseNew(_input);\n}",
          why: { en: "The bad version measures one cold run in an unknown build config, so the '3x' is unrepeatable and could be pure noise. The good version warms up, runs many iterations, isolates setup, and reports a mean with a spread — a claim a reviewer can actually check.", ar: "النسخة السيئة تقيس تشغيلاً بارداً واحداً في إعداد build مجهول، فالـ «3x» غير قابل للتكرار وقد يكون ضوضاء صرفة. النسخة الجيدة تسخّن وتشغّل تكرارات كثيرة وتعزل الإعداد وتبلّغ متوسطاً بتشتّت — ادّعاء يمكن للمراجع فحصه فعلاً." } },
        { t: "review", severity: "medium",
          title: { en: "Discarded result and setup inside the loop", ar: "نتيجة مُهملة وإعداد داخل الـ loop" },
          bad: "[Benchmark]\npublic void Serialize()\n{\n    var data = BuildLargeObject();   // rebuilt every call\n    JsonSerializer.Serialize(data);  // result discarded\n}",
          good: "[GlobalSetup] public void Setup() => _data = BuildLargeObject();\n[Benchmark]\npublic string Serialize() => JsonSerializer.Serialize(_data);",
          why: { en: "Rebuilding the object every call folds setup cost into the measurement, and returning nothing lets the compiler delete the serialize call as dead code. Moving setup to [GlobalSetup] and returning the result makes the benchmark measure only serialization.", ar: "إعادة بناء الكائن كل استدعاء تدمج تكلفة الإعداد في القياس، وعدم إرجاع شيء يسمح للمترجم بحذف استدعاء الـ serialize ككود ميت. نقل الإعداد إلى [GlobalSetup] وإرجاع النتيجة يجعل الـ benchmark يقيس الـ serialization فقط." } }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        { t: "p",
          en: "Benchmarking sits at the small end of a performance toolkit, and it only pays off when you already know where the cost is. The usual flow in a real system: production metrics show an endpoint is slow, a profiler points to one hot method, and only then do you write a micro-benchmark to compare two fixes for that specific method.",
          ar: "الـ benchmarking يقع في الطرف الصغير من عدّة الأداء، ولا يفيد إلا حين تعرف مسبقاً أين التكلفة. المسار المعتاد في نظام حقيقي: مقاييس الإنتاج تُظهر endpoint بطيئاً، والـ profiler يشير إلى دالة ساخنة واحدة، وعندها فقط تكتب micro-benchmark لمقارنة إصلاحين لتلك الدالة تحديداً." },
        { t: "ul",
          en: [
            "Profiler first: find the method that actually dominates, so you don't benchmark the wrong thing.",
            "Micro-benchmark second: compare candidate fixes for that one method with stable numbers.",
            "CI gate: run the key benchmarks on every change and fail the build on a clear regression.",
            "Load test last: confirm the fix helps the whole endpoint under realistic concurrency."
          ],
          ar: [
            "الـ profiler أولاً: جد الدالة التي تهيمن فعلاً، حتى لا تقيس الشيء الخطأ.",
            "الـ micro-benchmark ثانياً: قارن الإصلاحات المرشحة لتلك الدالة بأرقام ثابتة.",
            "بوابة CI: شغّل الـ benchmarks الأساسية عند كل تغيير وأفشل الـ build عند تراجع واضح.",
            "الـ load test أخيراً: أكّد أن الإصلاح يفيد الـ endpoint كاملاً تحت تزامن واقعي."
          ]
        },
        { t: "callout", kind: "tip",
          en: "A benchmark answers 'which is faster'. It never answers 'is this fast enough' — that is a question about your SLO and real traffic, and only load testing and production data can answer it.",
          ar: "الـ benchmark يجيب «أيهما أسرع». لا يجيب أبداً «هل هذا سريع كفاية» — ذلك سؤال عن SLO لديك والترافيك الحقيقي، ولا يجيبه إلا load testing وبيانات الإنتاج." }
      ]
    },
    {
      key: "perf",
      blocks: [
        { t: "kv", rows: [
          { k: { en: "CPU", ar: "CPU" }, v: { en: "Pin to steady-state speed; warmup removes JIT cost so you measure the real instruction work.", ar: "ثبّت على السرعة المستقرة؛ الـ warmup يزيل تكلفة الـ JIT فتقيس عمل التعليمات الحقيقي." } },
          { k: { en: "Memory", ar: "Memory" }, v: { en: "[MemoryDiagnoser] reports bytes allocated per call — often the real difference between two versions.", ar: "‏[MemoryDiagnoser] يبلّغ الـ bytes المخصّصة لكل استدعاء — غالباً الفرق الحقيقي بين نسختين." } },
          { k: { en: "GC pressure", ar: "ضغط الـ GC" }, v: { en: "Gen0/1/2 collection counts show if a method makes garbage that will stall the app later.", ar: "عدّات جمع Gen0/1/2 تُظهر إن كانت الدالة تنتج garbage سيُعطّل التطبيق لاحقاً." } },
          { k: { en: "Variance", ar: "Variance" }, v: { en: "High standard deviation means the result is unreliable; a noisy machine inflates it.", ar: "‏standard deviation عالٍ يعني نتيجة غير موثوقة؛ الجهاز الصاخب يضخّمه." } },
          { k: { en: "Scalability", ar: "Scalability" }, v: { en: "Use [Params] with several input sizes to see if cost grows linearly or worse (e.g. += is O(n²)).", ar: "استخدم [Params] بأحجام مدخلات عدة لترى إن كانت التكلفة تنمو خطياً أو أسوأ (مثلاً += بترتيب O(n²))." } }
        ]}
      ]
    },
    {
      key: "debug",
      blocks: [
        { t: "ul",
          en: [
            "The BenchmarkDotNet summary table: check Mean, StdDev (spread), and the Ratio column against the baseline.",
            "Its startup validation warnings: it prints a warning if you run in Debug or with a debugger attached.",
            "[MemoryDiagnoser] columns (Allocated, Gen0): look for a version that allocates far more memory.",
            "[DisassemblyDiagnoser]: dumps the generated machine code so you can confirm the work wasn't optimized away.",
            "dotnet-counters: watch GC and CPU counters live to confirm your benchmark machine is otherwise idle."
          ],
          ar: [
            "جدول ملخص BenchmarkDotNet: افحص Mean و StdDev (التشتّت) وعمود Ratio مقابل الـ baseline.",
            "تحذيرات التحقق عند بدء التشغيل: يطبع تحذيراً إن شغّلت في Debug أو مع debugger موصول.",
            "أعمدة [MemoryDiagnoser] (Allocated، Gen0): ابحث عن نسخة تخصّص ذاكرة أكثر بكثير.",
            "‏[DisassemblyDiagnoser]: يُخرج الـ machine code المولّد لتؤكد أن العمل لم يُحسَّن بالحذف.",
            "‏dotnet-counters: راقب عدّادات GC وCPU حيّة لتؤكد أن جهاز الـ benchmark خامل بخلاف ذلك."
          ]
        },
        { t: "callout", kind: "tip",
          en: "If a result looks impossibly fast (sub-nanosecond, or exactly zero), assume dead-code elimination before you celebrate. Return the value and re-run; the number will jump to something believable.",
          ar: "إن بدت النتيجة سريعة بشكل مستحيل (دون النانوثانية، أو صفراً بالضبط)، افترض dead-code elimination قبل أن تحتفل. أرجع القيمة وأعد التشغيل؛ سيقفز الرقم إلى شيء معقول." }
      ]
    },
    {
      key: "realworld",
      blocks: [
        { t: "p",
          en: "Honest benchmarking shows up wherever a small piece of code runs an enormous number of times, so a few nanoseconds per call add up to real money and latency. In those places teams keep a permanent benchmark suite and treat a regression like a failing test.",
          ar: "قياس الأداء بأمانة يظهر حيثما يعمل جزء صغير من الكود عدداً هائلاً من المرات، فتتراكم بضع نانوثوانٍ لكل استدعاء إلى مال و latency حقيقيين. في تلك الأماكن يحتفظ الفرق بمجموعة benchmarks دائمة ويعاملون التراجع كاختبار فاشل." },
        { t: "ul",
          en: [
            "Serialization libraries: JSON and binary serializers publish benchmarks because they run on every request.",
            "High-throughput APIs: gateways and payment processors benchmark hot paths where each call is billed.",
            "Game and trading engines: nanosecond-level loops where warmup and variance decide the outcome.",
            "Framework and runtime teams: they gate releases on benchmark suites to prevent silent slowdowns."
          ],
          ar: [
            "مكتبات الـ serialization: مسلسِلات JSON والثنائية تنشر benchmarks لأنها تعمل في كل request.",
            "‏APIs عالية الـ throughput: البوابات ومعالِجات الدفع تقيس المسارات الساخنة حيث يُحاسَب كل استدعاء.",
            "محركات الألعاب والتداول: loops بمستوى النانوثانية حيث يحسم الـ warmup والـ variance النتيجة.",
            "فرق الـ framework والـ runtime: يبنون الإصدارات على مجموعات benchmarks لمنع التباطؤ الصامت."
          ]
        }
      ]
    },
    {
      key: "exercises",
      blocks: [
        { t: "ex", diff: "easy",
          en: "Set up a BenchmarkDotNet project comparing string `+=` in a loop against `StringBuilder` for a 10,000-character string. Run it in Release. You are done when the summary table shows StringBuilder clearly faster with a small standard deviation.",
          ar: "أنشئ مشروع BenchmarkDotNet يقارن `+=` داخل loop مع `StringBuilder` لنص من 10,000 حرف. شغّله في Release. تنتهي حين يُظهر جدول الملخص StringBuilder أسرع بوضوح بـ standard deviation صغير." },
        { t: "ex", diff: "medium",
          en: "Write a benchmark that returns nothing and computes an unused value, then observe the impossibly fast time. Fix it by returning the value. You are done when the time jumps from near-zero to a believable, stable number.",
          ar: "اكتب benchmark لا يُرجع شيئاً ويحسب قيمة غير مستخدمة، ثم لاحظ الزمن السريع المستحيل. أصلحه بإرجاع القيمة. تنتهي حين يقفز الزمن من قرب الصفر إلى رقم معقول وثابت." },
        { t: "ex", diff: "hard",
          en: "Use [Params] with sizes 1,000 / 10,000 / 100,000 on the += benchmark and plot mean against size. You are done when you can show the time grows roughly with the square of the size, confirming += is O(n²).",
          ar: "استخدم [Params] بأحجام 1,000 / 10,000 / 100,000 على benchmark الـ +=، وارسم المتوسط مقابل الحجم. تنتهي حين تستطيع إظهار أن الزمن ينمو تقريباً مع مربع الحجم، مؤكداً أن += بترتيب O(n²)." },
        { t: "ex", diff: "senior",
          en: "Add a benchmark to your team's CI so a pull request fails when a key method regresses by more than a set threshold. You are done when a deliberately slowed method turns the build red and the report names the regressed benchmark.",
          ar: "أضف benchmark إلى CI فريقك بحيث يفشل الـ pull request حين تتراجع دالة أساسية أكثر من حدّ محدّد. تنتهي حين تُحوّل دالة أُبطئت عمداً الـ build إلى الأحمر ويسمّي التقرير الـ benchmark المتراجع." }
      ]
    },
    {
      key: "refs",
      blocks: [
        { t: "ref", label: { en: "BenchmarkDotNet — Overview", ar: "BenchmarkDotNet — نظرة عامة" }, url: "https://benchmarkdotnet.org/articles/overview.html", meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref", label: { en: "BenchmarkDotNet — Good practices", ar: "BenchmarkDotNet — ممارسات جيدة" }, url: "https://benchmarkdotnet.org/articles/guides/good-practices.html", meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref", label: { en: ".NET tiered compilation", ar: "الترجمة المتدرّجة في .NET" }, url: "https://learn.microsoft.com/en-us/dotnet/core/runtime-config/compilation", meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref", label: { en: "Pro .NET Benchmarking (Andrey Akinshin)", ar: "Pro .NET Benchmarking (Andrey Akinshin)" }, url: "https://link.springer.com/book/10.1007/978-1-4842-4941-3", meta: { en: "Book", ar: "كتاب" } }
      ]
    }
  ],
  quiz: [
    {
      q: { en: "Why is a single Stopwatch run an unreliable benchmark?", ar: "لماذا يكون تشغيل Stopwatch واحد benchmark غير موثوق؟" },
      options: [
        { en: "Stopwatch is not accurate enough to measure milliseconds", ar: "الـ Stopwatch غير دقيق كفاية لقياس الميلي ثانية" },
        { en: "It captures JIT compilation, cold caches, and random noise in one draw", ar: "يلتقط ترجمة الـ JIT والـ caches الباردة والضوضاء العشوائية في سحبة واحدة" },
        { en: "Stopwatch only works in Debug builds", ar: "الـ Stopwatch يعمل في Debug builds فقط" },
        { en: "It always reports zero for fast methods", ar: "يبلّغ دائماً صفراً للدوال السريعة" }
      ],
      correct: 1,
      why: { en: "One run is dominated by first-call JIT cost, cold caches, and random GC/scheduling, so it is not repeatable.", ar: "التشغيل الواحد تسيطر عليه تكلفة الـ JIT في أول استدعاء والـ caches الباردة والـ GC/الجدولة العشوائية، فلا يتكرر." }
    },
    {
      q: { en: "What does warmup accomplish before measurement starts?", ar: "ماذا يحقق الـ warmup قبل بدء القياس؟" },
      options: [
        { en: "It clears the garbage collector's memory", ar: "يمسح ذاكرة الـ garbage collector" },
        { en: "It gets the method JIT-compiled and the caches warm", ar: "يجعل الدالة مترجمة بالـ JIT والـ caches ساخنة" },
        { en: "It increases the CPU clock speed", ar: "يرفع سرعة ساعة الـ CPU" },
        { en: "It runs the method in Debug mode first", ar: "يشغّل الدالة في وضع Debug أولاً" }
      ],
      correct: 1,
      why: { en: "Warmup runs the code so the JIT compiles it and caches warm up, making the measured runs reflect steady-state speed.", ar: "الـ warmup يشغّل الكود ليترجمه الـ JIT وتسخن الـ caches، فتعكس التشغيلات المقيسة السرعة في الحالة المستقرة." }
    },
    {
      q: { en: "A benchmark reports 0.2 ns for a hash computation. What is the likely cause?", ar: "يبلّغ benchmark 0.2 ns لحساب hash. ما السبب المرجّح؟" },
      options: [
        { en: "The CPU is extremely fast", ar: "الـ CPU سريع للغاية" },
        { en: "The result is unused, so the compiler removed the code (dead-code elimination)", ar: "النتيجة غير مستخدمة، فأزال المترجم الكود (dead-code elimination)" },
        { en: "The benchmark ran too many iterations", ar: "شغّل الـ benchmark تكرارات كثيرة جداً" },
        { en: "MemoryDiagnoser was disabled", ar: "كان MemoryDiagnoser معطّلاً" }
      ],
      correct: 1,
      why: { en: "Sub-nanosecond times usually mean the compiler deleted the unused computation; returning the value forces it to stay.", ar: "الأزمنة دون النانوثانية تعني عادةً أن المترجم حذف الحساب غير المستخدم؛ إرجاع القيمة يُبقيه." }
    },
    {
      q: { en: "Method A is 12.1 ns ± 0.5 and method B is 12.4 ns ± 0.5. What is the honest conclusion?", ar: "الدالة A بـ 12.1 ns ± 0.5 والدالة B بـ 12.4 ns ± 0.5. ما الاستنتاج الأمين؟" },
      options: [
        { en: "A is clearly faster and should be chosen", ar: "A أسرع بوضوح ويجب اختيارها" },
        { en: "B is faster because it has a higher number", ar: "B أسرع لأن رقمها أعلى" },
        { en: "The spread overlaps the gap, so there is no measurable difference", ar: "التشتّت يتداخل مع الفجوة، فلا فرق قابل للقياس" },
        { en: "The benchmark must be re-run in Debug", ar: "يجب إعادة تشغيل الـ benchmark في Debug" }
      ],
      correct: 2,
      why: { en: "The 0.3 ns gap is smaller than the ±0.5 ns spread, so the difference is within noise and not measurable.", ar: "الفجوة 0.3 ns أصغر من التشتّت ±0.5 ns، فالفرق ضمن الضوضاء وغير قابل للقياس." }
    },
    {
      q: { en: "When is a micro-benchmark the wrong tool for a performance question?", ar: "متى يكون الـ micro-benchmark الأداة الخطأ لسؤال أداء؟" },
      options: [
        { en: "When comparing two implementations of the same method", ar: "عند مقارنة تنفيذين لنفس الدالة" },
        { en: "When you need whole-endpoint latency under concurrent load", ar: "عندما تحتاج latency الـ endpoint كاملاً تحت حمل متزامن" },
        { en: "When you want allocation counts per call", ar: "عندما تريد عدّات الـ allocation لكل استدعاء" },
        { en: "When you already know which method is hot", ar: "عندما تعرف مسبقاً أي دالة ساخنة" }
      ],
      correct: 1,
      why: { en: "Micro-benchmarks measure a method in isolation; whole-system latency under real concurrency needs load testing and production metrics.", ar: "الـ micro-benchmarks تقيس دالة معزولة؛ أما latency النظام كله تحت تزامن حقيقي فيحتاج load testing ومقاييس إنتاج." }
    }
  ]
};
```

NEXT: percentiles
