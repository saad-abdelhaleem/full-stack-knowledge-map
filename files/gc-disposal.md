```js
const gcDisposalLesson = {
  id: "gc-disposal",
  moduleId: "runtime",
  title: { en: "IDisposable and deterministic cleanup", ar: "IDisposable والتنظيف الحتمي" },
  summary: {
    en: "The garbage collector frees memory, but it does not close files, sockets or database connections — `IDisposable` is how you release those at a moment you choose instead of a moment you cannot predict.",
    ar: "الـ garbage collector يحرّر الذاكرة، لكنه لا يغلق الملفات ولا الـ sockets ولا اتصالات قاعدة البيانات — و`IDisposable` هو الطريقة التي تحرّر بها هذه الأشياء في لحظة تختارها أنت بدل لحظة لا يمكنك التنبّؤ بها."
  },
  mins: 14,
  sections: [
    {
      key: "why",
      blocks: [
        { t: "p",
          en: "Some objects hold on to something outside your program: an open file on disk, a network socket, a connection borrowed from a database connection pool. The .NET runtime can free the object's memory on its own, but it cannot know that you are finished using the file or the connection. `IDisposable` is a simple agreement between the object and you: the object exposes a method called `Dispose()`, and you promise to call it the moment you are done. Calling it releases the outside resource right then — not later, not maybe.",
          ar: "بعض الكائنات تمسك بشيء خارج برنامجك: ملف مفتوح على القرص، أو socket على الشبكة، أو اتصال مستعار من connection pool لقاعدة البيانات. الـ runtime يستطيع تحرير ذاكرة الكائن وحده، لكنه لا يمكن أن يعرف أنك انتهيت من استخدام الملف أو الاتصال. و`IDisposable` اتفاق بسيط بين الكائن وبينك: الكائن يوفّر method اسمها `Dispose()`، وأنت تتعهّد باستدعائها لحظة انتهائك. استدعاؤها يحرّر المورد الخارجي في تلك اللحظة — لا بعدها، ولا ربّما." },

        { t: "kv", rows: [
          { k: { en: "Managed memory", ar: "Managed memory" },
            v: { en: "The memory your objects live in. The garbage collector (GC) finds objects nobody references any more and reclaims their memory automatically.", ar: "الذاكرة التي تعيش فيها كائناتك. الـ garbage collector (GC) يجد الكائنات التي لم يعد أحد يشير إليها ويستعيد ذاكرتها تلقائياً." } },
          { k: { en: "Unmanaged resource", ar: "Unmanaged resource" },
            v: { en: "Anything the GC does not manage: an OS file handle, a socket, a pooled DB connection, a lock on a shared file. The operating system or a pool owns it, not the GC.", ar: "أي شيء لا يديره الـ GC: file handle من نظام التشغيل، أو socket، أو اتصال من pool، أو قفل على ملف مشترك. يملكه نظام التشغيل أو الـ pool، لا الـ GC." } },
          { k: { en: "IDisposable", ar: "IDisposable" },
            v: { en: "An interface with one method, `void Dispose()`. A type implements it to say: I hold something that must be released explicitly.", ar: "واجهة بـ method واحدة هي `void Dispose()`. النوع ينفّذها ليقول: أنا أمسك بشيء يجب تحريره صراحةً." } },
          { k: { en: "Deterministic", ar: "Deterministic" },
            v: { en: "Happening at an exact point in the code that you can point at. `Dispose()` is deterministic; the GC is not — it runs when it decides to.", ar: "يحدث عند نقطة محدّدة في الكود تستطيع الإشارة إليها. `Dispose()` حتمي؛ والـ GC ليس كذلك — يعمل حين يقرّر هو." } },
          { k: { en: "Finalizer", ar: "Finalizer" },
            v: { en: "An optional method (`~MyType()`) the GC calls before it frees an object. It is a last-resort safety net, and you cannot control when it runs.", ar: "method اختيارية (`~MyType()`) يستدعيها الـ GC قبل تحرير الكائن. هي شبكة أمان أخيرة، ولا تتحكّم في وقت تشغيلها." } },
          { k: { en: "using statement", ar: "using statement" },
            v: { en: "C# syntax that calls `Dispose()` for you when a variable goes out of scope, even if an exception is thrown.", ar: "صياغة في C# تستدعي `Dispose()` نيابةً عنك عند خروج المتغيّر من نطاقه، حتى لو رُمي exception." } }
        ]},

        { t: "p",
          en: "Think of a shared toolbox at a workshop. Cleaning your own desk is the GC's job — it happens on its own schedule and nobody suffers if it is late. Returning the borrowed spanner to the toolbox is `Dispose()`. If you keep the spanner in a drawer, your desk still looks clean, but the next person who needs that spanner waits. The toolbox is the connection pool; the spanner is a connection; the waiting person is the next HTTP request.",
          ar: "تخيّل صندوق عدّة مشترك في ورشة. تنظيف مكتبك أنت هو عمل الـ GC — يحدث بجدوله الخاص ولا يتضرّر أحد إن تأخّر. أمّا إعادة المفتاح المستعار إلى الصندوق فهي `Dispose()`. إن أبقيت المفتاح في درجك، سيبقى مكتبك نظيفاً في الظاهر، لكن من يحتاج ذلك المفتاح بعدك سينتظر. الصندوق هو الـ connection pool؛ والمفتاح هو connection؛ والمنتظِر هو الطلب التالي." },

        { t: "p",
          en: "Here is the running example for this whole lesson. An endpoint `GET /reports/{id}/export` opens a database connection, reads rows, and writes them to a temporary CSV file before returning it. It holds two outside resources at once: a pooled `SqlConnection` and an OS file handle from `FileStream`. Every mistake in this lesson is a version of holding one of those two for longer than the request that needed it.",
          ar: "هذا هو المثال الجاري في الدرس كلّه. endpoint اسمه `GET /reports/{id}/export` يفتح اتصالاً بقاعدة البيانات، ويقرأ صفوفاً، ويكتبها في ملف CSV مؤقّت ثم يعيده. هو يمسك بموردين خارجيين في آنٍ واحد: `SqlConnection` من pool، و file handle من نظام التشغيل عبر `FileStream`. كل خطأ في هذا الدرس هو صورة من صور الإمساك بأحدهما مدّةً أطول من الطلب الذي احتاجه." },

        { t: "callout", kind: "note",
          en: "`Dispose()` never frees memory. It releases the outside thing — the handle, the socket, the pooled connection. The object's own memory is still the GC's job and is freed later. Mixing these two up is the root of most confusion here.",
          ar: "`Dispose()` لا يحرّر الذاكرة أبداً. هو يحرّر الشيء الخارجي — الـ handle أو الـ socket أو الاتصال من الـ pool. أمّا ذاكرة الكائن نفسه فتبقى مسؤولية الـ GC وتُحرَّر لاحقاً. الخلط بين الاثنين هو أصل معظم الالتباس هنا." }
      ]
    },

    {
      key: "problem",
      blocks: [
        { t: "p",
          en: "The export endpoint shipped without a `using` around its `SqlConnection`. Nothing failed in testing, because one developer clicking once returns the connection whenever the GC eventually runs. In production the endpoint took 40 requests per second, each query took about 200 milliseconds, and the ADO.NET connection pool has a default maximum of 100 connections. Connections were only returned when a GC happened — roughly every 4 seconds under that load. So about 320 requests' worth of connections piled up before any of them came back.",
          ar: "نُشِر الـ endpoint بدون `using` حول الـ `SqlConnection`. لم يفشل شيء في الاختبار، لأن مطوّراً واحداً ينقر مرة واحدة يعيد الاتصال متى عمل الـ GC في النهاية. في الإنتاج استقبل الـ endpoint 40 طلباً في الثانية، وكل استعلام استغرق نحو 200 جزء من الألف من الثانية، والحد الأقصى الافتراضي لـ ADO.NET connection pool هو 100 اتصال. والاتصالات كانت تُعاد فقط عند حدوث GC — أي كل 4 ثوانٍ تقريباً تحت هذا الحمل. فتراكمت اتصالات ما يعادل 320 طلباً قبل أن يعود أيٌّ منها." },

        { t: "kv", rows: [
          { k: { en: "Symptom", ar: "العَرَض" },
            v: { en: "After ~3 seconds of traffic, requests failed with `InvalidOperationException: Timeout expired. The timeout period elapsed prior to obtaining a connection from the pool.`", ar: "بعد نحو 3 ثوانٍ من الحمل، فشلت الطلبات بـ `InvalidOperationException: Timeout expired. The timeout period elapsed prior to obtaining a connection from the pool.`" } },
          { k: { en: "What that message means", ar: "معنى تلك الرسالة" },
            v: { en: "The request asked the pool for a connection, waited the default 15 seconds, got none, and gave up. The database itself was healthy the whole time.", ar: "الطلب طلب اتصالاً من الـ pool، وانتظر 15 ثانية وهي المهلة الافتراضية، ولم يحصل على شيء، فاستسلم. وقاعدة البيانات نفسها كانت سليمة طوال الوقت." } },
          { k: { en: "Before the fix", ar: "قبل الإصلاح" },
            v: { en: "Pool at its 100 limit permanently; p99 latency 15 s — meaning the slowest 1 in 100 requests took 15 seconds, all of it waiting on the pool; CPU under 10%.", ar: "الـ pool ثابت على حدّه 100 دائماً؛ وp99 يساوي 15 ثانية — أي أن أبطأ طلب من كل 100 استغرق 15 ثانية، كلّها انتظار على الـ pool؛ والمعالج تحت 10%." } },
          { k: { en: "After adding `using`", ar: "بعد إضافة `using`" },
            v: { en: "Each connection returned after about 200 ms; steady pool usage around 8 connections; p99 latency 240 ms. Zero code changed except one keyword.", ar: "كل اتصال عاد بعد نحو 200 جزء من الألف من الثانية؛ واستخدام الـ pool استقرّ عند 8 اتصالات تقريباً؛ وp99 صار 240 جزءاً من الألف. ولم يتغيّر شيء في الكود سوى كلمة واحدة." } }
        ]},

        { t: "p",
          en: "The important detail is that the leak was not a memory leak. Total memory looked normal, because a `SqlConnection` object is tiny. The scarce thing was the pool slot the object was sitting on. That is exactly the class of resource the GC does not count and cannot help with, and it is why `Dispose()` exists as a separate concept from garbage collection.",
          ar: "التفصيل المهم أن التسريب لم يكن تسريب ذاكرة. الذاكرة الكلية بدت طبيعية، لأن كائن `SqlConnection` صغير جداً. الشيء الشحيح كان مقعد الـ pool الذي يجلس عليه الكائن. وهذا بالضبط صنف الموارد الذي لا يحسبه الـ GC ولا يستطيع مساعدتك فيه، وهو سبب وجود `Dispose()` كمفهوم منفصل عن جمع القمامة." }
      ]
    },

    {
      key: "internals",
      blocks: [
        { t: "p",
          en: "Start with `using`, because it is not magic — the compiler rewrites it into a `try`/`finally`. Whatever happens inside the block, including a thrown exception or an early `return`, the `finally` runs and `Dispose()` is called. That is the entire guarantee, and it is why manual `Dispose()` calls at the end of a method are worse: an exception thrown two lines earlier skips them.",
          ar: "ابدأ بـ `using`، فهي ليست سحراً — المترجم يعيد كتابتها إلى `try`/`finally`. ومهما حدث داخل الكتلة، بما في ذلك رمي exception أو `return` مبكر، فإن الـ `finally` يعمل ويُستدعى `Dispose()`. هذا هو الضمان كلّه، وهو سبب أن استدعاء `Dispose()` يدوياً في آخر الـ method أسوأ: فـ exception يُرمى قبله بسطرين يتخطّاه." },

        { t: "code", lang: "csharp",
          label: { en: "What the compiler does with `using`", ar: "ما يفعله المترجم بـ `using`" },
          code: "// what you write\nusing var conn = new SqlConnection(cs);\nawait conn.OpenAsync(ct);\nvar rows = await ReadRowsAsync(conn, id, ct);\n\n// what the compiler emits (simplified)\nSqlConnection conn = new SqlConnection(cs);\ntry\n{\n    await conn.OpenAsync(ct);\n    var rows = await ReadRowsAsync(conn, id, ct);\n}\nfinally\n{\n    if (conn != null) ((IDisposable)conn).Dispose();\n}" },

        { t: "p",
          en: "Now the safety net. A finalizer is a method the GC calls on an object just before reclaiming it, written as `~MyType()`. It exists for one case only: a type that wraps a raw OS handle and would leak that handle forever if the caller forgot to dispose. Finalizers are expensive. When the GC first meets an object with a finalizer, it cannot free it; it moves the object to a finalization queue, a background thread runs the finalizer, and only the next collection actually frees the memory. So a finalizer makes the object survive one extra GC round, and you have no say in when that happens.",
          ar: "الآن شبكة الأمان. الـ finalizer هي method يستدعيها الـ GC على الكائن قبيل استعادته، وتُكتب `~MyType()`. وهي موجودة لحالة واحدة فقط: نوع يغلّف OS handle خاماً وسيسرّب ذلك الـ handle للأبد لو نسي المستدعي التخلّص منه. والـ finalizers مكلفة. فحين يلتقي الـ GC أول مرة بكائن له finalizer لا يستطيع تحريره؛ بل ينقله إلى finalization queue، ويشغّل thread في الخلفية الـ finalizer، ولا تُحرَّر الذاكرة فعلياً إلا في الجولة التالية. أي أن الـ finalizer يجعل الكائن ينجو من دورة GC إضافية، ولا رأي لك في موعد ذلك." },

        { t: "p",
          en: "The hotel analogy: `Dispose()` is handing your key card back at the desk on your way out — instant, and the room is free for the next guest. A finalizer is the cleaner who eventually notices the room is empty and reports it. The room still gets freed, but hours later, and only because someone else did a sweep. You never plan around the cleaner. This is why `Dispose()` calls `GC.SuppressFinalize(this)`: once you have handed the key back, telling the GC to skip the finalizer removes that extra survival round entirely.",
          ar: "تشبيه الفندق: `Dispose()` هو تسليم بطاقة الغرفة عند المكتب وأنت خارج — فوري، والغرفة تصير جاهزة للنزيل التالي. أمّا الـ finalizer فهو عامل النظافة الذي يلاحظ في النهاية أن الغرفة فارغة فيبلّغ عنها. الغرفة تتحرّر أيضاً، لكن بعد ساعات، ولأن شخصاً آخر قام بجولة. وأنت لا تخطّط أبداً اعتماداً على عامل النظافة. لهذا يستدعي `Dispose()` الأمر `GC.SuppressFinalize(this)`: فبعد أن سلّمت البطاقة، إخبار الـ GC بتخطّي الـ finalizer يلغي دورة النجاة الإضافية كلياً." },

        { t: "kv", rows: [
          { k: { en: "`Dispose()` (public)", ar: "`Dispose()` (public)" },
            v: { en: "What callers and `using` call. It should do the cleanup once and then call `GC.SuppressFinalize(this)`.", ar: "ما يستدعيه المستدعون و`using`. ينبغي أن ينفّذ التنظيف مرة واحدة ثم يستدعي `GC.SuppressFinalize(this)`." } },
          { k: { en: "`Dispose(bool disposing)`", ar: "`Dispose(bool disposing)`" },
            v: { en: "The protected virtual method that holds the real cleanup, so a derived class can extend it. `disposing: true` means a human called Dispose; `false` means the finalizer is running.", ar: "الـ method المحمية الافتراضية التي تحمل التنظيف الفعلي، ليتمكّن نوع مشتق من توسيعها. `disposing: true` تعني أن أحداً استدعى Dispose؛ و`false` تعني أن الـ finalizer يعمل." } },
          { k: { en: "Why the bool matters", ar: "لماذا يهمّ الـ bool" },
            v: { en: "During finalization, other managed objects your type references may already be finalized. So when `disposing` is false you touch only raw handles, never other objects.", ar: "أثناء الـ finalization قد تكون كائنات managed أخرى يشير إليها نوعك قد جرى إنهاؤها. لذلك حين تكون `disposing` بقيمة false تلمس handles خاماً فقط، ولا تلمس كائنات أخرى أبداً." } },
          { k: { en: "`SafeHandle`", ar: "`SafeHandle`" },
            v: { en: "A built-in wrapper around an OS handle that already has a correct finalizer. If your fields are `SafeHandle`s, you do not need to write a finalizer at all.", ar: "غلاف جاهز حول OS handle، وله finalizer صحيح أصلاً. فإن كانت حقولك من نوع `SafeHandle` فلست بحاجة لكتابة finalizer إطلاقاً." } },
          { k: { en: "`IAsyncDisposable`", ar: "`IAsyncDisposable`" },
            v: { en: "`ValueTask DisposeAsync()`, used with `await using`. For resources whose cleanup does I/O — flushing a buffered file, closing a TLS stream politely.", ar: "`ValueTask DisposeAsync()`، وتُستخدم مع `await using`. للموارد التي يحتاج تنظيفها إلى I/O — إفراغ ملف مخزَّن مؤقتاً، أو إغلاق TLS stream بأدب." } }
        ]},

        { t: "code", lang: "csharp",
          label: { en: "The full dispose pattern, and the version you usually need", ar: "نمط التخلّص الكامل، والنسخة التي تحتاجها عادةً" },
          code: "// Full pattern - only when your type directly owns a raw OS handle\npublic sealed class ReportExporter : IDisposable, IAsyncDisposable\n{\n    private readonly SqlConnection _conn;\n    private readonly FileStream _file;\n    private bool _disposed;\n\n    public void Dispose()\n    {\n        if (_disposed) return;   // Dispose must be safe to call twice\n        _disposed = true;\n        _file.Dispose();         // release the OS file handle\n        _conn.Dispose();         // return the connection to the pool\n        GC.SuppressFinalize(this);\n    }\n\n    public async ValueTask DisposeAsync()\n    {\n        if (_disposed) return;\n        _disposed = true;\n        await _file.DisposeAsync();  // flushes buffered bytes without blocking a thread\n        await _conn.DisposeAsync();\n        GC.SuppressFinalize(this);\n    }\n}\n\n// 95% of real types: no finalizer, no bool, no virtual method.\n// You only hold other IDisposables, so you just dispose them." },

        { t: "p",
          en: "One last mechanism, because it silently disposes things for you: ASP.NET Core's dependency injection container. Every HTTP request gets a scope, and any service the container creates that implements `IDisposable` is disposed when that scope ends. That is why you must not dispose a service that was injected into your constructor — the container already owns it and will dispose it again. You dispose only what you created yourself with `new`.",
          ar: "آلية أخيرة، لأنها تتخلّص من الأشياء نيابةً عنك بصمت: حاوية الـ dependency injection في ASP.NET Core. كل طلب HTTP يحصل على scope، وأي خدمة تنشئها الحاوية وتنفّذ `IDisposable` يجري التخلّص منها عند انتهاء ذلك الـ scope. ولهذا يجب ألّا تتخلّص من خدمة حُقنت في الـ constructor — فالحاوية تملكها أصلاً وستتخلّص منها مرة أخرى. أنت تتخلّص فقط ممّا أنشأته بنفسك بـ `new`." }
      ]
    },

    {
      key: "tradeoffs",
      blocks: [
        { t: "tradeoff",
          pros: {
            en: [
              "Release happens at an exact line you can point at, so pool and handle usage stays flat under load",
              "`using` survives exceptions and early returns, so cleanup is not something a reviewer has to verify by reading every path",
              "Scarce resources (pool slots, file handles, sockets) stop being tied to unpredictable GC timing",
              "The DI container disposes scoped services for you, so most application code needs no cleanup code at all"
            ],
            ar: [
              "التحرير يحدث عند سطر محدّد تستطيع الإشارة إليه، فيبقى استخدام الـ pool والـ handles ثابتاً تحت الحمل",
              "`using` تنجو من الـ exceptions ومن الـ return المبكر، فالتنظيف ليس شيئاً يتحقّق منه المراجع بقراءة كل مسار",
              "الموارد الشحيحة (مقاعد الـ pool، الـ file handles، الـ sockets) لم تعد مرتبطة بتوقيت GC لا يمكن التنبّؤ به",
              "الحاوية تتخلّص من الخدمات scoped نيابةً عنك، فمعظم كود التطبيق لا يحتاج كود تنظيف إطلاقاً"
            ]
          },
          cons: {
            en: [
              "`IDisposable` is contagious: a type holding one must implement it too, and so must its holder, up the chain",
              "Ownership becomes ambiguous — two places both think they should dispose the same object",
              "`await using` in a hot path adds an async state machine even when disposal completes instantly",
              "A wrongly written finalizer costs an extra GC round per object and can run on an object whose fields are already gone"
            ],
            ar: [
              "`IDisposable` مُعدٍ: النوع الذي يمسك بواحد يجب أن ينفّذه أيضاً، وكذلك من يمسك به، صعوداً في السلسلة",
              "الملكية تصبح غامضة — موضعان يظنّ كلٌّ منهما أنه المسؤول عن التخلّص من الكائن نفسه",
              "`await using` في مسار ساخن يضيف async state machine حتى حين يكتمل التخلّص فوراً",
              "finalizer مكتوب خطأً يكلّف دورة GC إضافية لكل كائن، وقد يعمل على كائن اختفت حقوله أصلاً"
            ]
          },
          limits: {
            en: [
              "`Dispose()` frees the outside resource only; the object's memory still waits for the GC",
              "Nothing in the language forces a caller to dispose — it is a convention plus analyzer warnings",
              "A synchronous `Dispose()` that does I/O blocks a thread-pool thread and can starve the server",
              "A process killed with SIGKILL runs no finalizers and no dispose calls at all"
            ],
            ar: [
              "`Dispose()` يحرّر المورد الخارجي فقط؛ أما ذاكرة الكائن فما زالت تنتظر الـ GC",
              "لا شيء في اللغة يجبر المستدعي على التخلّص — إنها اتفاقية إضافةً إلى تحذيرات الـ analyzers",
              "`Dispose()` متزامن يجري I/O يحجب thread من الـ thread pool وقد يجوّع الخادم",
              "العملية التي تُقتل بـ SIGKILL لا تشغّل أي finalizer ولا أي استدعاء dispose"
            ]
          },
          alts: {
            en: [
              "Let the DI container own the lifetime and dispose it at end of scope — the default for services",
              "Use `SafeHandle` fields instead of writing a finalizer around a raw handle",
              "Use a pool with its own return mechanism (`ArrayPool<T>`, `ObjectPool<T>`) when reuse matters more than release",
              "Keep the resource inside one method so it never escapes and ownership cannot be argued about"
            ],
            ar: [
              "دع الحاوية تملك دورة الحياة وتتخلّص منها عند نهاية الـ scope — وهذا الوضع الافتراضي للخدمات",
              "استخدم حقول `SafeHandle` بدل كتابة finalizer حول handle خام",
              "استخدم pool له آلية إعادة خاصة (`ArrayPool<T>` أو `ObjectPool<T>`) حين تكون إعادة الاستخدام أهم من التحرير",
              "أبقِ المورد داخل method واحدة فلا يهرب أبداً ولا يمكن الاختلاف على ملكيته"
            ]
          }
        }
      ]
    },

    {
      key: "mistakes",
      blocks: [
        { t: "mistake",
          title: { en: "Wrapping an injected dependency in `using`", ar: "لفّ تبعية محقونة داخل `using`" },
          body: {
            en: "A developer saw that `HttpClient` implements `IDisposable` and wrote `using var client = _httpClientFactory.CreateClient();` in the export handler. The factory's client is backed by a message handler the factory pools and reuses. Disposing it per request threw the handler away, so every request opened a fresh TCP connection and a fresh TLS handshake. Latency rose by 60 ms per call and the server accumulated sockets stuck in TIME_WAIT, a state where a closed socket is held for a couple of minutes. The rule: you dispose what you created with `new`, never what was handed to you.",
            ar: "رأى مطوّر أن `HttpClient` ينفّذ `IDisposable` فكتب `using var client = _httpClientFactory.CreateClient();` داخل معالج التصدير. لكن عميل الـ factory مبنيّ على message handler تجمّعه الـ factory وتعيد استخدامه. والتخلّص منه في كل طلب رمى ذلك الـ handler، فصار كل طلب يفتح TCP connection جديداً وTLS handshake جديداً. ارتفع الزمن 60 جزءاً من الألف من الثانية لكل نداء، وتراكمت على الخادم sockets عالقة في حالة TIME_WAIT، وهي حالة يُحتفظ فيها بالـ socket المغلق لدقيقتين تقريباً. القاعدة: تتخلّص ممّا أنشأته بـ `new`، لا ممّا سُلِّم إليك." },
          fix: "// bad\nusing var client = _httpClientFactory.CreateClient();\n\n// good - the factory owns the handler's lifetime\nvar client = _httpClientFactory.CreateClient();" },

        { t: "mistake",
          title: { en: "Disposing before the async work finished", ar: "التخلّص قبل انتهاء العمل غير المتزامن" },
          body: {
            en: "The export method returned a `Task` without awaiting it inside the `using` block. The method returned as soon as the task started, the `using` block ended, and `Dispose()` closed the `FileStream` while the copy was still writing to it. In production this produced `ObjectDisposedException: Cannot access a closed file` on roughly 1 in 30 exports — only the ones where the write had not already completed synchronously. The fix is a single `await`, which keeps the method inside the `using` until the work is actually done.",
            ar: "أعادت method التصدير `Task` دون انتظارها داخل كتلة `using`. عادت الـ method بمجرد بدء الـ task، فانتهت كتلة `using`، وأغلق `Dispose()` الـ `FileStream` بينما النسخ ما زال يكتب فيه. في الإنتاج أنتج هذا `ObjectDisposedException: Cannot access a closed file` في نحو 1 من كل 30 عملية تصدير — تحديداً تلك التي لم تكن الكتابة فيها قد اكتملت متزامنةً. والإصلاح `await` واحدة، تُبقي الـ method داخل الـ `using` حتى ينتهي العمل فعلاً." ,
          },
          fix: "// bad - Dispose runs while the copy is still in flight\nusing var file = File.Create(path);\nreturn source.CopyToAsync(file, ct);\n\n// good\nusing var file = File.Create(path);\nawait source.CopyToAsync(file, ct);" },

        { t: "mistake",
          title: { en: "Writing a finalizer for a type that has no raw handle", ar: "كتابة finalizer لنوع لا يملك handle خاماً" },
          body: {
            en: "Someone added `~ReportExporter() => Dispose();` because it looked safer. The type only held a `SqlConnection` and a `FileStream`, both of which already protect themselves. The result: every exporter instance survived an extra GC round and was promoted to a higher GC generation, meaning it now needed a more expensive collection to be freed. Under load the finalizer queue grew faster than the finalizer thread drained it, and memory climbed steadily. Deleting the finalizer flattened the memory graph the same afternoon.",
            ar: "أضاف أحدهم `~ReportExporter() => Dispose();` لأنها بدت أكثر أماناً. لكن النوع لا يمسك سوى `SqlConnection` و`FileStream`، وكلاهما يحمي نفسه أصلاً. والنتيجة: كل نسخة من الـ exporter نجت من دورة GC إضافية وتمّت ترقيتها إلى generation أعلى، أي صارت تحتاج جمعاً أغلى لتُحرَّر. وتحت الحمل نما طابور الـ finalizer أسرع مما يفرغه thread الـ finalizer، فتسلّقت الذاكرة باطّراد. وحذف الـ finalizer سوّى منحنى الذاكرة في العصر نفسه." } },

        { t: "mistake",
          title: { en: "A `CancellationTokenSource` that is never disposed", ar: "`CancellationTokenSource` لا يُتخلَّص منه أبداً" },
          body: {
            en: "The handler created `new CancellationTokenSource(TimeSpan.FromSeconds(30))` per export to enforce a timeout, and never disposed it. A CTS created with a timeout registers a timer, and a linked CTS registers a callback on its parent. Neither is released until Dispose is called. At 40 requests per second the timer queue grew to hundreds of thousands of live registrations, and `dotnet-counters` showed timer count climbing without ever falling. Timeouts still worked, which is why nobody suspected it for two weeks.",
            ar: "أنشأ المعالج `new CancellationTokenSource(TimeSpan.FromSeconds(30))` لكل عملية تصدير لفرض مهلة، ولم يتخلّص منه أبداً. والـ CTS المنشأ بمهلة يسجّل timer، والـ CTS المرتبط يسجّل callback على أبيه. ولا يُحرَّر أيٌّ منهما قبل استدعاء Dispose. وعند 40 طلباً في الثانية نما طابور الـ timers إلى مئات الآلاف من التسجيلات الحيّة، وأظهر `dotnet-counters` عدد الـ timers يتسلّق دون أن يهبط. والمُهل كانت تعمل، ولهذا لم يشكّ أحد بالأمر أسبوعين." ,
          },
          fix: "using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);\ncts.CancelAfter(TimeSpan.FromSeconds(30));" }
      ]
    },

    {
      key: "interview",
      blocks: [
        { t: "qa", level: "junior",
          q: { en: "What is the difference between the garbage collector freeing an object and calling `Dispose()` on it?", ar: "ما الفرق بين تحرير الـ garbage collector للكائن واستدعاء `Dispose()` عليه؟" },
          a: { en: "The GC only handles memory, and it runs whenever it decides to. `Dispose()` handles everything that is not memory — an open file, a socket, a connection borrowed from a pool — and it runs exactly where I call it. So if my object holds a database connection, the GC freeing the object eventually is not good enough, because the pool has a hard limit and other requests are waiting for a slot. I call `Dispose()`, usually through a `using` statement, to give that slot back immediately.", ar: "الـ GC يتولّى الذاكرة فقط، ويعمل متى قرّر هو. أمّا `Dispose()` فيتولّى كل ما ليس ذاكرة — ملف مفتوح، أو socket، أو اتصال مستعار من pool — ويعمل تماماً حيث أستدعيه. فإن كان كائني يمسك باتصال قاعدة بيانات، فتحرير الـ GC له في النهاية غير كافٍ، لأن للـ pool حدّاً صارماً وطلبات أخرى تنتظر مقعداً. لذلك أستدعي `Dispose()`، عادةً عبر `using`، لأعيد ذلك المقعد فوراً." } },

        { t: "qa", level: "mid",
          q: { en: "What does the compiler actually generate for a `using` statement, and why does that matter?", ar: "ما الذي يولّده المترجم فعلياً من `using`، ولماذا يهمّ ذلك؟" },
          a: { en: "It generates a `try`/`finally`, with `Dispose()` in the `finally`. That matters because the `finally` runs no matter how the block exits — normal completion, an early `return`, or a thrown exception. If instead I write `Dispose()` as the last line of the method, any exception above that line skips it, and that is precisely when I most need the resource released. So `using` is not shorthand for tidiness; it is the only version that is correct on the failure path.", ar: "يولّد `try`/`finally`، مع `Dispose()` داخل الـ `finally`. وهذا مهم لأن الـ `finally` يعمل مهما كانت طريقة الخروج من الكتلة — اكتمال طبيعي، أو `return` مبكر، أو exception مرميّ. أمّا لو كتبت `Dispose()` كآخر سطر في الـ method، فأي exception فوق ذلك السطر يتخطّاه، وهذه بالذات اللحظة التي أحتاج فيها تحرير المورد أكثر من أي وقت. فـ`using` ليست اختصاراً للترتيب؛ إنها النسخة الوحيدة الصحيحة على مسار الفشل." } },

        { t: "qa", level: "mid",
          q: { en: "Why does the standard dispose pattern call `GC.SuppressFinalize(this)`?", ar: "لماذا يستدعي نمط التخلّص القياسي `GC.SuppressFinalize(this)`؟" },
          a: { en: "Because a finalizer is a fallback for callers who forgot to dispose, and if I did dispose, the fallback is pure cost. An object with a live finalizer cannot be freed on the first collection: the GC puts it on a finalization queue, a separate thread runs the finalizer, and only the next collection frees the memory. `SuppressFinalize` tells the GC to skip all of that. It is only meaningful in a type that actually has a finalizer — in a type without one, the call is harmless but pointless.", ar: "لأن الـ finalizer احتياطٌ لمن نسي التخلّص، وإن كنت قد تخلّصت فعلاً فالاحتياط تكلفة صافية. الكائن الذي له finalizer حيّ لا يمكن تحريره في الجمع الأول: يضعه الـ GC في finalization queue، ويشغّل thread منفصل الـ finalizer، ولا تُحرَّر الذاكرة إلا في الجمع التالي. و`SuppressFinalize` يخبر الـ GC بتخطّي هذا كلّه. وهو ذو معنى فقط في نوع له finalizer فعلاً — أمّا في نوع بلا finalizer فالاستدعاء غير ضار لكنه بلا فائدة." } },

        { t: "qa", level: "senior",
          q: { en: "When would you implement `IAsyncDisposable` instead of, or alongside, `IDisposable`?", ar: "متى تنفّذ `IAsyncDisposable` بدل `IDisposable` أو إلى جانبه؟" },
          a: { en: "When the cleanup itself has to do I/O. A buffered `FileStream` still has bytes in memory that must be written to disk; a TLS stream should send a close-notify to the other side; a pooled connection may need to roll back a transaction on the server. If I do that in a synchronous `Dispose()`, I block a thread-pool thread on I/O, and under load that is how you starve the thread pool — you see queueing and a rising p99 while CPU sits low. So I implement `IAsyncDisposable` and use `await using`, and I usually implement `IDisposable` too so callers that cannot await still get correct cleanup.", ar: "حين يحتاج التنظيف نفسه إلى I/O. فـ`FileStream` مخزَّن ما زالت لديه بايتات في الذاكرة يجب كتابتها على القرص؛ وTLS stream ينبغي أن يرسل close-notify للطرف الآخر؛ واتصال من pool قد يحتاج التراجع عن transaction على الخادم. فإن فعلت ذلك داخل `Dispose()` متزامن فأنا أحجب thread من الـ thread pool على I/O، وتحت الحمل هكذا تُجوّع الـ thread pool — ترى طوابير وp99 صاعداً بينما المعالج منخفض. لذلك أنفّذ `IAsyncDisposable` وأستخدم `await using`، وأنفّذ `IDisposable` أيضاً عادةً كي يحصل المستدعون الذين لا يستطيعون الانتظار على تنظيف صحيح." } },

        { t: "qa", level: "senior",
          q: { en: "A colleague adds a finalizer to every disposable type 'just in case'. What do you tell them?", ar: "زميل يضيف finalizer لكل نوع disposable «احتياطاً». بماذا تجيبه؟" },
          a: { en: "That it is a net loss unless the type directly owns a raw OS handle. Every finalizer makes its objects survive an extra collection and get promoted to an older generation, which is more expensive to collect. It also runs on a single shared thread, so a slow finalizer blocks everyone else's. And it runs when other managed objects the type references may already be finalized, so touching them is undefined. If we genuinely wrap a raw handle, the right answer is a `SafeHandle` field, which already has a correct finalizer written by the framework — then our type needs none.", ar: "أقول إنها خسارة صافية إلا إذا كان النوع يملك مباشرةً OS handle خاماً. فكل finalizer يجعل كائناته تنجو من جمع إضافي وتُرقَّى إلى generation أقدم، وجمعه أغلى. كما يعمل على thread واحد مشترك، فـ finalizer بطيء يعطّل البقية. ويعمل في وقت قد تكون فيه كائنات managed أخرى يشير إليها النوع قد أُنهيت، فلمسها سلوك غير معرَّف. وإن كنّا فعلاً نغلّف handle خاماً فالجواب الصحيح حقل `SafeHandle`، وله finalizer صحيح كتبه الإطار — فلا يحتاج نوعنا أيّ finalizer." } },

        { t: "qa", level: "staff",
          q: { en: "Disposal bugs keep reaching production across several teams. What do you change structurally?", ar: "أخطاء التخلّص تصل الإنتاج باستمرار عبر عدة فرق. ما الذي تغيّره هيكلياً؟" },
          a: { en: "I stop treating it as a review problem and make the machine catch it. First, turn on the .NET analyzers CA2000 and CA1063 as build errors, so an undisposed local or a wrong dispose pattern fails CI instead of a reviewer's attention. Second, write down one ownership rule for all services: the container owns anything it constructs, application code disposes only what it created with `new`, and injected dependencies are never disposed. Third, expose pool and handle counts as dashboards — connection pool size, process handle count, timer count — so a leak shows as a line that climbs and never falls, hours before it becomes an outage. Fourth, prefer factory-provided clients and DI-managed lifetimes so that most code has no disposal decision to get wrong.", ar: "أتوقّف عن التعامل معها كمشكلة مراجعة وأجعل الآلة تلتقطها. أولاً، أفعّل الـ analyzers CA2000 وCA1063 كأخطاء بناء، فيفشل الـ CI عند متغيّر محلي بلا تخلّص أو نمط تخلّص خاطئ بدل الاعتماد على انتباه المراجع. ثانياً، أكتب قاعدة ملكية واحدة لكل الخدمات: الحاوية تملك ما تنشئه، وكود التطبيق يتخلّص فقط ممّا أنشأه بـ `new`، والتبعيات المحقونة لا يُتخلَّص منها أبداً. ثالثاً، أعرض عدّادات الـ pool والـ handles على لوحات — حجم الـ connection pool، وعدد handles العملية، وعدد الـ timers — فيظهر التسريب كخط يصعد ولا يهبط، قبل ساعات من تحوّله إلى انقطاع. رابعاً، أفضّل العملاء الآتين من factory ودورات الحياة التي تديرها الحاوية، فلا يبقى لمعظم الكود قرار تخلّص يمكن أن يخطئ فيه." } }
      ]
    },

    {
      key: "codereview",
      blocks: [
        { t: "review", severity: "high",
          title: { en: "Returning a stream that the method already disposed", ar: "إعادة stream تخلّصت منه الـ method أصلاً" },
          bad: "public async Task<Stream> ExportAsync(int id, CancellationToken ct)\n{\n    using var file = File.Create(GetTempPath(id));\n    await WriteRowsAsync(file, id, ct);\n    return file;   // Dispose runs here, before the caller reads a byte\n}",
          good: "// Option 1: let the caller own it - no using here, documented in the name\npublic async Task<Stream> OpenExportAsync(int id, CancellationToken ct)\n{\n    var file = File.Create(GetTempPath(id));\n    await WriteRowsAsync(file, id, ct);\n    file.Position = 0;\n    return file;   // caller wraps this in its own using\n}\n\n// Option 2: never let it escape - caller passes the destination in\npublic async Task ExportToAsync(int id, Stream destination, CancellationToken ct)\n{\n    using var file = File.Create(GetTempPath(id));\n    await WriteRowsAsync(file, id, ct);\n    file.Position = 0;\n    await file.CopyToAsync(destination, ct);\n}",
          why: { en: "The `using` disposes the stream at the closing brace, which happens before `return` hands anything to the caller. The caller then gets a closed stream and the first read throws `ObjectDisposedException`. Worse, it usually works in a unit test where the file is small and buffered, and fails on the larger production file — an intermittent bug that costs days. Both fixes remove the ambiguity: either the caller clearly owns the stream (option 1), or the stream never leaves the method (option 2). Option 2 is safer because there is no ownership question left to get wrong.", ar: "الـ `using` يتخلّص من الـ stream عند القوس المغلق، وهذا يحدث قبل أن يسلّم `return` أي شيء للمستدعي. فيحصل المستدعي على stream مغلق، وأول قراءة ترمي `ObjectDisposedException`. والأسوأ أن الحالة تنجح عادةً في unit test لأن الملف صغير ومخزَّن مؤقتاً، وتفشل على ملف الإنتاج الأكبر — خطأ متقطّع يكلّف أياماً. والإصلاحان يزيلان الغموض: إمّا أن يملك المستدعي الـ stream بوضوح (الخيار الأول)، أو ألّا يغادر الـ stream الـ method أبداً (الخيار الثاني). والخيار الثاني أأمن لأنه لا يترك سؤال ملكية يمكن الخطأ فيه." } },

        { t: "review", severity: "medium",
          title: { en: "Manual try/finally with a null check instead of `using`", ar: "try/finally يدوي مع فحص null بدل `using`" },
          bad: "SqlConnection conn = null;\ntry\n{\n    conn = new SqlConnection(_cs);\n    await conn.OpenAsync(ct);\n    return await ReadRowsAsync(conn, id, ct);\n}\nfinally\n{\n    if (conn != null)\n        conn.Dispose();   // blocks a thread if the driver has to talk to the server\n}",
          good: "await using var conn = new SqlConnection(_cs);\nawait conn.OpenAsync(ct);\nreturn await ReadRowsAsync(conn, id, ct);",
          why: { en: "The manual version is correct today, but it is four extra lines whose correctness a reviewer has to verify by hand, and it invites someone to later add a `return` above the `try` or an assignment that skips it. It also calls the synchronous `Dispose()`, which for a connection can block the calling thread while the driver resets state with the server. `await using` gives the same try/finally, generated by the compiler and impossible to get wrong, and routes cleanup through `DisposeAsync()` so nothing blocks a thread-pool thread. Flag it as medium rather than high because nothing is broken yet — this is about removing a future foot-gun.", ar: "النسخة اليدوية صحيحة اليوم، لكنها أربعة أسطر إضافية يجب على المراجع التحقّق من صحتها يدوياً، وتغري لاحقاً بإضافة `return` فوق الـ `try` أو إسناد يتخطّاه. كما تستدعي `Dispose()` المتزامن، وهو في حالة الاتصال قد يحجب thread المستدعي بينما يعيد الـ driver ضبط الحالة مع الخادم. و`await using` يعطي نفس الـ try/finally مولَّداً من المترجم ويستحيل الخطأ فيه، ويمرّر التنظيف عبر `DisposeAsync()` فلا يُحجب أي thread من الـ thread pool. أصنّفها medium لا high لأن شيئاً لم ينكسر بعد — الأمر يتعلّق بإزالة فخّ مستقبلي." } }
      ]
    },

    {
      key: "sysdesign",
      blocks: [
        { t: "p",
          en: "In a real system, disposal is a capacity concern, not a tidiness concern. Every service instance has a fixed number of the scarce things: a connection pool capped at 100, an OS limit on open file descriptors, a socket count bounded by ephemeral ports. Holding any of them a few hundred milliseconds longer than necessary multiplies straight through your concurrency. At 40 requests per second, an extra 500 ms of hold time means 20 more resources permanently in use — which is fine until it is not.",
          ar: "في نظام حقيقي، التخلّص مسألة سعة لا مسألة ترتيب. فكل نسخة من الخدمة لديها عدد ثابت من الأشياء الشحيحة: connection pool محدود بـ 100، وحدّ من نظام التشغيل على الـ file descriptors المفتوحة، وعدد sockets مقيّد بالمنافذ المؤقّتة. والإمساك بأيٍّ منها بضع مئات من أجزاء الألف من الثانية زيادةً عن اللازم يتضاعف مباشرةً مع تزامنك. فعند 40 طلباً في الثانية، 500 جزء من الألف إضافية من الإمساك تعني 20 مورداً إضافياً مستخدماً دائماً — وهذا مقبول حتى يصبح غير مقبول." },

        { t: "ul",
          en: [
            "Request-scoped services: the container disposes them when the HTTP response finishes, so anything holding a connection should be scoped, never singleton.",
            "Background workers: a hosted service must create its own scope per work item (`IServiceScopeFactory.CreateAsyncScope()`), otherwise scoped services live for the lifetime of the process.",
            "Long-lived clients: gRPC channels, `HttpClient` handlers and message-bus connections are deliberately shared and long-lived — disposing them per call destroys connection reuse.",
            "Graceful shutdown: on SIGTERM the host disposes singletons and lets in-flight scopes finish; on SIGKILL nothing runs, so never make correctness depend on cleanup at shutdown."
          ],
          ar: [
            "الخدمات ذات الـ scope للطلب: تتخلّص منها الحاوية عند انتهاء استجابة HTTP، لذا أي شيء يمسك باتصال ينبغي أن يكون scoped لا singleton.",
            "العمّال في الخلفية: على الـ hosted service إنشاء scope خاص لكل وحدة عمل (`IServiceScopeFactory.CreateAsyncScope()`)، وإلا عاشت الخدمات scoped طوال عمر العملية.",
            "العملاء طويلو العمر: قنوات gRPC ومعالِجات `HttpClient` واتصالات message bus مشتركة وطويلة العمر عمداً — والتخلّص منها في كل نداء يدمّر إعادة استخدام الاتصالات.",
            "الإيقاف السلس: عند SIGTERM يتخلّص الـ host من الـ singletons ويترك الـ scopes الجارية تُنهي عملها؛ وعند SIGKILL لا يعمل شيء، فلا تجعل الصحة تعتمد على تنظيف عند الإيقاف أبداً."
          ]
        },

        { t: "callout", kind: "warn",
          en: "A singleton that holds a scoped service is called a captive dependency: the scoped service is created once and never disposed, so its connection is held for the life of the process. The container can catch this for you — `ValidateScopes` is on by default in Development and should be turned on for all environments.",
          ar: "الـ singleton الذي يمسك بخدمة scoped يُسمّى captive dependency: فالخدمة scoped تُنشأ مرة واحدة ولا يُتخلَّص منها أبداً، فيبقى اتصالها محجوزاً طوال عمر العملية. والحاوية تستطيع اكتشاف ذلك — فـ `ValidateScopes` مفعّل افتراضياً في Development وينبغي تفعيله في كل البيئات." }
      ]
    },

    {
      key: "perf",
      blocks: [
        { t: "kv", rows: [
          { k: { en: "Memory", ar: "Memory" },
            v: { en: "A finalizer forces the object to survive one extra collection and be promoted to an older GC generation, which is collected far less often. Removing needless finalizers is often the single biggest win.", ar: "الـ finalizer يجبر الكائن على النجاة من جمع إضافي والترقّي إلى generation أقدم يُجمَع بوتيرة أقل بكثير. وإزالة الـ finalizers غير الضرورية هي غالباً أكبر مكسب منفرد." } },
          { k: { en: "Database", ar: "Database" },
            v: { en: "Hold time per connection directly sets how many concurrent requests one instance can serve. 200 ms hold at 40 rps needs 8 pool slots; 15 s hold needs 600, which no default pool has.", ar: "زمن الإمساك بكل اتصال يحدّد مباشرةً عدد الطلبات المتزامنة التي تخدمها نسخة واحدة. إمساك 200 جزء من الألف عند 40 طلباً/ثانية يحتاج 8 مقاعد؛ وإمساك 15 ثانية يحتاج 600، ولا pool افتراضي يملكها." } },
          { k: { en: "Latency", ar: "Latency" },
            v: { en: "A synchronous `Dispose()` that flushes to disk or talks to the server blocks a thread-pool thread. Under load this shows up as queueing: p99 climbs while CPU stays low.", ar: "`Dispose()` متزامن يفرغ إلى القرص أو يخاطب الخادم يحجب thread من الـ thread pool. وتحت الحمل يظهر ذلك كطوابير: p99 يصعد بينما المعالج منخفض." } },
          { k: { en: "Network", ar: "Network" },
            v: { en: "Disposing a pooled HTTP handler per request forces a new TCP connection and TLS handshake each time — typically 40-80 ms added per call, plus sockets stuck in TIME_WAIT.", ar: "التخلّص من HTTP handler من pool في كل طلب يفرض TCP connection جديداً وTLS handshake في كل مرة — عادةً 40 إلى 80 جزءاً من الألف مضافة لكل نداء، مع sockets عالقة في TIME_WAIT." } },
          { k: { en: "Scalability", ar: "Scalability" },
            v: { en: "Correct disposal keeps resource use proportional to in-flight requests. Missing disposal makes it proportional to total requests since the last GC, which does not scale with traffic.", ar: "التخلّص الصحيح يبقي استهلاك الموارد متناسباً مع الطلبات الجارية. وغيابه يجعله متناسباً مع مجموع الطلبات منذ آخر GC، وهذا لا يتوسّع مع الحمل." } }
        ]}
      ]
    },

    {
      key: "debug",
      blocks: [
        { t: "ul",
          en: [
            "`dotnet-counters monitor --process-id <pid> System.Runtime Microsoft.Data.SqlClient.EventSource` — watch `active hard connections` and `number of pooled connections`; a line that climbs and never falls is a leak.",
            "`dotnet-counters` on `System.Runtime` also shows `gen-2-gc-count` and `time-in-gc`; rising gen-2 collections with flat allocation often means finalizable objects being promoted.",
            "`dotnet-dump collect` then `dumpheap -stat` in `dotnet-dump analyze` — look for thousands of live `SqlConnection` or `FileStream` instances; `gcroot <address>` tells you what is still holding one.",
            "`Process.HandleCount` (or Task Manager's Handles column) — a steadily rising handle count with steady traffic means file or socket handles are not being released.",
            "Enable analyzers CA2000 (dispose objects before losing scope) and CA1063 (implement IDisposable correctly) as build errors — they catch most of this before it ever runs."
          ],
          ar: [
            "`dotnet-counters monitor --process-id <pid> System.Runtime Microsoft.Data.SqlClient.EventSource` — راقب `active hard connections` و`number of pooled connections`؛ فالخط الذي يصعد ولا يهبط تسريب.",
            "`dotnet-counters` على `System.Runtime` يعرض أيضاً `gen-2-gc-count` و`time-in-gc`؛ وارتفاع جمع gen-2 مع تخصيص ثابت يعني غالباً كائنات لها finalizers تُرقَّى.",
            "`dotnet-dump collect` ثم `dumpheap -stat` داخل `dotnet-dump analyze` — ابحث عن آلاف النسخ الحيّة من `SqlConnection` أو `FileStream`؛ و`gcroot <address>` يخبرك من ما زال ممسكاً بواحدة.",
            "`Process.HandleCount` (أو عمود Handles في Task Manager) — ارتفاع مطّرد في عدد الـ handles مع حمل ثابت يعني أن handles الملفات أو الـ sockets لا تُحرَّر.",
            "فعّل الـ analyzers CA2000 (التخلّص من الكائنات قبل فقدان النطاق) وCA1063 (تنفيذ IDisposable بشكل صحيح) كأخطاء بناء — فهي تلتقط معظم هذا قبل التشغيل أصلاً."
          ]
        },

        { t: "callout", kind: "tip",
          en: "When you see `ObjectDisposedException`, do not add a null check or a try/catch. The exception is telling you the ownership is wrong: something disposed an object that another piece of code still needed. Find who created it and who disposed it — one of the two is not the owner.",
          ar: "حين ترى `ObjectDisposedException` لا تضف فحص null ولا try/catch. الـ exception يخبرك أن الملكية خاطئة: شيء ما تخلّص من كائن ما زال جزء آخر من الكود يحتاجه. ابحث عمّن أنشأه وعمّن تخلّص منه — أحدهما ليس المالك." }
      ]
    },

    {
      key: "realworld",
      blocks: [
        { t: "p",
          en: "Disposal failures look different depending on which scarce resource runs out first, and the shape of the incident tells you where to look. A service that talks mostly to a database dies from pool exhaustion; a service that writes files dies from file descriptor limits; a service that calls other services dies from socket exhaustion. In all three the CPU is low and the dependency is healthy — the process is simply holding things it stopped using.",
          ar: "أعطال التخلّص تبدو مختلفة بحسب أي مورد شحيح ينفد أولاً، وشكل الحادثة يدلّك أين تبحث. فالخدمة التي تخاطب قاعدة بيانات غالباً تموت من نفاد الـ pool؛ والخدمة التي تكتب ملفات تموت من حدود الـ file descriptors؛ والخدمة التي تنادي خدمات أخرى تموت من نفاد الـ sockets. وفي الثلاث يكون المعالج منخفضاً والتبعية سليمة — العملية ببساطة تمسك بأشياء توقّفت عن استخدامها." },

        { t: "ul",
          en: [
            "Reporting and export features: long-running queries plus temporary files, the two resources most often held past the end of the request.",
            "File ingestion pipelines: thousands of small files per batch, where one missing `using` per file exhausts the process's file descriptor limit within minutes.",
            "Payment and order systems: a database transaction left open because its connection was not disposed holds locks, and other requests block behind it rather than failing fast.",
            "Chat and streaming platforms: each open connection is a socket and a buffer, so cleanup on disconnect is what caps how many concurrent users one instance holds."
          ],
          ar: [
            "ميزات التقارير والتصدير: استعلامات طويلة إضافةً إلى ملفات مؤقّتة، وهما أكثر موردين يُمسَك بهما بعد نهاية الطلب.",
            "خطوط استيعاب الملفات: آلاف الملفات الصغيرة في الدفعة الواحدة، حيث `using` واحدة ناقصة لكل ملف تستنفد حدّ الـ file descriptors للعملية خلال دقائق.",
            "أنظمة الدفع والطلبات: transaction تُركت مفتوحة لأن اتصالها لم يُتخلَّص منه تحجز أقفالاً، فتتعطّل الطلبات الأخرى خلفها بدل أن تفشل سريعاً.",
            "منصّات المحادثة والبث: كل اتصال مفتوح هو socket وbuffer، فالتنظيف عند قطع الاتصال هو ما يحدّد عدد المستخدمين المتزامنين لنسخة واحدة."
          ]
        }
      ]
    },

    {
      key: "exercises",
      blocks: [
        { t: "ex", diff: "easy",
          en: "Write a small console app that opens 200 `SqlConnection` objects in a loop without disposing them, against a connection string with `Max Pool Size=10`. Record the exception and how long it took to appear. Then add `using` and rerun. You have it right when the second run finishes with no exception and `dotnet-counters` shows pooled connections staying at or below 10.",
          ar: "اكتب تطبيق console صغيراً يفتح 200 كائن `SqlConnection` في حلقة دون التخلّص منها، مقابل connection string فيه `Max Pool Size=10`. سجّل الـ exception وكم استغرق ظهوره. ثم أضف `using` وأعد التشغيل. تكون قد أصبت حين ينتهي التشغيل الثاني بلا exception ويُظهر `dotnet-counters` أن الاتصالات من الـ pool بقيت عند 10 أو أقل." },

        { t: "ex", diff: "medium",
          en: "Take the bad code review example (returning a stream from inside a `using`) and reproduce the failure. Write one test with a 100-byte payload and one with a 10 MB payload. You have it right when the small test passes and the large one throws `ObjectDisposedException`, and you can explain in one sentence why buffering hid the bug.",
          ar: "خذ مثال المراجعة السيئ (إعادة stream من داخل `using`) وأعد إنتاج الفشل. اكتب اختباراً بحمولة 100 بايت وآخر بحمولة 10 ميجابايت. تكون قد أصبت حين ينجح الاختبار الصغير ويرمي الكبير `ObjectDisposedException`، وتستطيع شرح سبب إخفاء الـ buffering للخطأ في جملة واحدة." },

        { t: "ex", diff: "hard",
          en: "Build a type that wraps a raw OS file handle twice: once with a hand-written finalizer, once with a `SafeFileHandle` field and no finalizer. Allocate 100,000 of each and measure with `dotnet-counters`. You have it right when you can show the finalizer version producing more gen-1/gen-2 collections and a non-empty finalization queue, and explain the extra collection each object survives.",
          ar: "ابنِ نوعاً يغلّف OS file handle خاماً مرتين: مرة بـ finalizer مكتوب يدوياً، ومرة بحقل `SafeFileHandle` بلا finalizer. خصّص 100000 من كلٍّ وقِس بـ `dotnet-counters`. تكون قد أصبت حين تُظهر أن نسخة الـ finalizer تنتج جمع gen-1/gen-2 أكثر وطابور finalization غير فارغ، وتشرح الجمع الإضافي الذي ينجو منه كل كائن." },

        { t: "ex", diff: "senior",
          en: "Add a background hosted service that processes queue items and resolves a scoped repository. First write it resolving the repository directly from the root provider, run it for ten minutes under load, and record connection pool usage. Then switch to `CreateAsyncScope()` per item. You have it right when pool usage goes from monotonically climbing to flat, and you can write the two-sentence ownership rule that would have prevented the first version from being merged.",
          ar: "أضف hosted service في الخلفية يعالج عناصر من طابور ويحلّ repository من نوع scoped. اكتبه أولاً وهو يحلّ الـ repository مباشرةً من الـ root provider، وشغّله عشر دقائق تحت حمل، وسجّل استخدام الـ connection pool. ثم انتقل إلى `CreateAsyncScope()` لكل عنصر. تكون قد أصبت حين يتحوّل استخدام الـ pool من صعود مطّرد إلى خط مستوٍ، وتستطيع كتابة قاعدة الملكية في جملتين التي كانت ستمنع دمج النسخة الأولى." }
      ]
    },

    {
      key: "refs",
      blocks: [
        { t: "ref", label: { en: "Implementing a Dispose method", ar: "تنفيذ Dispose method" },
          url: "https://learn.microsoft.com/en-us/dotnet/standard/garbage-collection/implementing-dispose",
          meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref", label: { en: "Implementing DisposeAsync", ar: "تنفيذ DisposeAsync" },
          url: "https://learn.microsoft.com/en-us/dotnet/standard/garbage-collection/implementing-disposeasync",
          meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref", label: { en: "CA1063: Implement IDisposable correctly", ar: "CA1063: تنفيذ IDisposable بشكل صحيح" },
          url: "https://learn.microsoft.com/en-us/dotnet/fundamentals/code-analysis/quality-rules/ca1063",
          meta: { en: "Analyzer rule", ar: "قاعدة analyzer" } },
        { t: "ref", label: { en: "SafeHandle class", ar: "الصنف SafeHandle" },
          url: "https://learn.microsoft.com/en-us/dotnet/api/system.runtime.interopservices.safehandle",
          meta: { en: "API reference", ar: "مرجع API" } }
      ]
    }
  ],
  quiz: [
    {
      q: { en: "What does calling `Dispose()` on an object actually do?", ar: "ماذا يفعل استدعاء `Dispose()` على كائن فعلياً؟" },
      options: [
        { en: "It frees the object's memory immediately, ahead of the garbage collector", ar: "يحرّر ذاكرة الكائن فوراً، قبل الـ garbage collector" },
        { en: "It releases resources the GC does not manage — file handles, sockets, pooled connections — at that exact point in the code", ar: "يحرّر موارد لا يديرها الـ GC — file handles وsockets واتصالات من pool — عند تلك النقطة بالضبط في الكود" },
        { en: "It marks the object for collection in the next GC cycle", ar: "يعلّم الكائن ليُجمَع في دورة الـ GC التالية" },
        { en: "It runs the object's finalizer synchronously", ar: "يشغّل الـ finalizer الخاص بالكائن بشكل متزامن" }
      ],
      correct: 1,
      why: { en: "`Dispose()` is only about resources the runtime cannot see: an OS file handle, a socket, a slot borrowed from a connection pool. The object's own memory is untouched and is still freed later by the GC, which is why option A is wrong. Option C describes something that does not exist — there is no 'mark for collection' call; the GC decides on its own by tracing references. Option D reverses the relationship: a correctly written `Dispose()` typically calls `GC.SuppressFinalize(this)` so the finalizer does not run at all. The practical consequence is the one from the export endpoint: without `Dispose()` the connection is returned only when a GC happens, and the pool runs dry long before that.", ar: "`Dispose()` يخصّ فقط الموارد التي لا يراها الـ runtime: OS file handle، أو socket، أو مقعد مستعار من connection pool. أمّا ذاكرة الكائن نفسه فلا تُمَسّ ويحرّرها الـ GC لاحقاً، ولهذا الخيار الأول خاطئ. والخيار الثالث يصف شيئاً غير موجود — لا يوجد استدعاء «تعليم للجمع»؛ فالـ GC يقرّر وحده بتتبّع المراجع. والخيار الرابع يقلب العلاقة: فـ`Dispose()` المكتوب بشكل صحيح يستدعي عادةً `GC.SuppressFinalize(this)` كي لا يعمل الـ finalizer إطلاقاً. والنتيجة العملية هي نفسها في مثال endpoint التصدير: بدون `Dispose()` لا يعود الاتصال إلا عند حدوث GC، والـ pool ينضب قبل ذلك بكثير." }
    },
    {
      q: { en: "Why is `using var conn = ...;` safer than calling `conn.Dispose()` on the last line of the method?", ar: "لماذا `using var conn = ...;` أأمن من استدعاء `conn.Dispose()` في آخر سطر من الـ method؟" },
      options: [
        { en: "`using` disposes the object earlier, reducing how long the resource is held", ar: "`using` يتخلّص من الكائن أبكر، فيقلّل مدة الإمساك بالمورد" },
        { en: "`using` compiles to a `try`/`finally`, so `Dispose()` still runs if an exception is thrown or the method returns early", ar: "`using` يترجَم إلى `try`/`finally`، فيعمل `Dispose()` حتى لو رُمي exception أو عادت الـ method مبكراً" },
        { en: "`using` calls `DisposeAsync()` instead, which never blocks a thread", ar: "`using` يستدعي `DisposeAsync()` بدلاً من ذلك، وهو لا يحجب thread أبداً" },
        { en: "`using` prevents other code from referencing the variable after disposal", ar: "`using` يمنع كوداً آخر من الإشارة إلى المتغيّر بعد التخلّص" }
      ],
      correct: 1,
      why: { en: "The compiler turns `using` into `try { ... } finally { obj?.Dispose(); }`. The `finally` runs on every exit path, including the exception path — which is exactly the path where an unreleased connection matters most, because a failing endpoint under load is when the pool is already under pressure. Option A is wrong: both versions dispose at the same logical point, at the end of the scope. Option C confuses the two forms — the async version is `await using`, and plain `using` always calls the synchronous `Dispose()`. Option D is wrong because a `using` declaration does not stop you referencing the variable afterwards inside the same scope; nothing in the language prevents use-after-dispose, which is why `ObjectDisposedException` exists.", ar: "المترجم يحوّل `using` إلى `try { ... } finally { obj?.Dispose(); }`. والـ `finally` يعمل على كل مسارات الخروج، بما فيها مسار الـ exception — وهو بالضبط المسار الذي يهمّ فيه الاتصال غير المحرَّر أكثر شيء، لأن endpoint يفشل تحت الحمل يعني أن الـ pool تحت ضغط أصلاً. والخيار الأول خاطئ: فالنسختان تتخلّصان عند النقطة المنطقية نفسها، أي نهاية النطاق. والخيار الثالث يخلط الصيغتين — فالنسخة غير المتزامنة هي `await using`، و`using` العادية تستدعي دائماً `Dispose()` المتزامن. والخيار الرابع خاطئ لأن تعريف `using` لا يمنعك من الإشارة إلى المتغيّر بعد ذلك داخل النطاق نفسه؛ ولا شيء في اللغة يمنع الاستخدام بعد التخلّص، ولهذا يوجد `ObjectDisposedException`." }
    },
    {
      q: { en: "A type holds only a `SqlConnection` and a `FileStream`. Should it have a finalizer?", ar: "نوع يمسك فقط بـ `SqlConnection` و`FileStream`. هل ينبغي أن يكون له finalizer؟" },
      options: [
        { en: "Yes — a finalizer is the safety net for callers who forget to dispose", ar: "نعم — الـ finalizer شبكة أمان لمن ينسى التخلّص" },
        { en: "No — it holds no raw OS handle of its own, and the finalizer would cost an extra GC round per instance for nothing", ar: "لا — فهو لا يملك OS handle خاماً خاصاً به، والـ finalizer سيكلّف دورة GC إضافية لكل نسخة بلا مقابل" },
        { en: "Yes, but only if the type is sealed", ar: "نعم، لكن فقط إذا كان النوع sealed" },
        { en: "No, because finalizers are not supported on types that implement `IAsyncDisposable`", ar: "لا، لأن الـ finalizers غير مدعومة في الأنواع التي تنفّذ `IAsyncDisposable`" }
      ],
      correct: 1,
      why: { en: "A finalizer is only justified when a type directly owns a raw operating-system handle that nothing else will release. `SqlConnection` and `FileStream` already protect their own handles, so this type is just a holder. Adding a finalizer makes every instance survive its first collection: the GC moves it to a finalization queue, a shared background thread runs the finalizer, and only the next collection frees the memory — meanwhile the object has been promoted to an older generation that is collected far less often. Option A states the intent correctly but ignores that the wrapped types already provide it. Option C is irrelevant; sealing changes nothing about finalization cost. Option D is simply false — the two features are unrelated, and a type may have both.", ar: "الـ finalizer مبرَّر فقط حين يملك النوع مباشرةً OS handle خاماً لن يحرّره شيء آخر. و`SqlConnection` و`FileStream` يحميان handles الخاصة بهما أصلاً، فهذا النوع مجرّد حامل. وإضافة finalizer تجعل كل نسخة تنجو من جمعها الأول: ينقلها الـ GC إلى finalization queue، ويشغّل thread مشترك في الخلفية الـ finalizer، ولا تُحرَّر الذاكرة إلا في الجمع التالي — وفي الأثناء تكون قد رُقّيت إلى generation أقدم يُجمَع بوتيرة أقل بكثير. والخيار الأول يذكر القصد بشكل صحيح لكنه يتجاهل أن الأنواع المغلَّفة توفّره أصلاً. والخيار الثالث لا علاقة له بالموضوع؛ فالـ sealing لا يغيّر شيئاً في تكلفة الـ finalization. والخيار الرابع خاطئ ببساطة — فالميزتان لا علاقة بينهما، ويمكن للنوع أن يجمعهما." }
    },
    {
      q: { en: "Why does `IAsyncDisposable` exist when `IDisposable` already releases resources?", ar: "لماذا يوجد `IAsyncDisposable` مع أن `IDisposable` يحرّر الموارد أصلاً؟" },
      options: [
        { en: "It disposes the object on a background thread so the caller does not have to wait at all", ar: "يتخلّص من الكائن على thread في الخلفية فلا ينتظر المستدعي إطلاقاً" },
        { en: "Some cleanup has to do I/O — flushing buffered bytes, closing a TLS stream, rolling back a server-side transaction — and doing that synchronously blocks a thread-pool thread", ar: "بعض التنظيف يحتاج I/O — إفراغ بايتات مخزَّنة، أو إغلاق TLS stream، أو التراجع عن transaction على الخادم — وفعل ذلك متزامناً يحجب thread من الـ thread pool" },
        { en: "It replaces `IDisposable` in .NET Core, and a type should never implement both", ar: "يحلّ محلّ `IDisposable` في .NET Core، ولا ينبغي لنوع أن ينفّذ كليهما" },
        { en: "It guarantees the finalizer will not run, so `GC.SuppressFinalize` becomes unnecessary", ar: "يضمن ألّا يعمل الـ finalizer، فيصبح `GC.SuppressFinalize` غير ضروري" }
      ],
      correct: 1,
      why: { en: "The whole reason is that cleanup is sometimes real work over the network or the disk. If that work happens inside a synchronous `Dispose()`, the calling thread — a thread-pool thread inside a request handler — sits blocked. A hundred concurrent disposals each blocking a few milliseconds is enough to starve the pool, which appears as queueing and a rising p99 with low CPU. Option A describes fire-and-forget disposal, which would be dangerous: the caller would move on while the resource is still held, defeating the point of deterministic cleanup. Option C is wrong twice — implementing both is normal and recommended, and the DI container handles both. Option D mixes up unrelated mechanisms; `GC.SuppressFinalize` is still needed by any type that has a finalizer, whichever disposal interface it uses.", ar: "السبب كلّه أن التنظيف أحياناً عمل حقيقي عبر الشبكة أو القرص. فإن جرى ذلك داخل `Dispose()` متزامن يبقى thread المستدعي — وهو thread من الـ thread pool داخل معالج طلبات — محجوباً. ومئة عملية تخلّص متزامنة تحجب كلٌّ منها بضعة أجزاء من الألف تكفي لتجويع الـ pool، فيظهر ذلك كطوابير وp99 صاعد مع معالج منخفض. والخيار الأول يصف تخلّصاً يُطلَق ويُنسى، وهو خطر: إذ يمضي المستدعي بينما المورد ما زال محجوزاً، فيُبطل مقصد التنظيف الحتمي. والخيار الثالث خاطئ مرتين — فتنفيذ الاثنين عادي ومستحسَن، والحاوية تتعامل مع كليهما. والخيار الرابع يخلط آليتين لا علاقة بينهما؛ فـ`GC.SuppressFinalize` ما زال لازماً لأي نوع له finalizer، مهما كانت واجهة التخلّص المستخدمة." }
    },
    {
      q: { en: "A handler injects `IHttpClientFactory`, calls `CreateClient()`, and wraps the result in `using`. What happens?", ar: "معالج يحقن `IHttpClientFactory`، ويستدعي `CreateClient()`، ويلفّ النتيجة في `using`. ماذا يحدث؟" },
      options: [
        { en: "Nothing bad — `HttpClient` implements `IDisposable`, so disposing it per request is correct", ar: "لا شيء سيّئ — فـ`HttpClient` ينفّذ `IDisposable`، والتخلّص منه في كل طلب صحيح" },
        { en: "The pooled message handler is thrown away, so every request opens a new TCP connection and TLS handshake, adding latency and leaving sockets in TIME_WAIT", ar: "يُرمى الـ message handler المجمَّع، فيفتح كل طلب TCP connection وTLS handshake جديدين، فيزيد الزمن وتبقى sockets في TIME_WAIT" },
        { en: "The container throws `ObjectDisposedException` on the next request because the factory was disposed", ar: "ترمي الحاوية `ObjectDisposedException` في الطلب التالي لأنه جرى التخلّص من الـ factory" },
        { en: "The client is disposed twice — once by the `using` and once by the container — which throws", ar: "يجري التخلّص من العميل مرتين — مرة بـ `using` ومرة بالحاوية — فيُرمى exception" }
      ],
      correct: 1,
      why: { en: "The factory exists specifically to pool and reuse the underlying `HttpMessageHandler`, because that handler is what owns the TCP connections. Disposing the client per request discards that reuse: each call pays for a new connection setup and TLS handshake, typically 40-80 ms, and the closed sockets sit in TIME_WAIT for a couple of minutes, which can exhaust ephemeral ports. Option A repeats the common misreading — the interface being present does not mean you are the owner. Option C is wrong: disposing a client does not dispose the factory, which is a singleton. Option D is wrong because `Dispose()` is required to be safe to call more than once; a correct implementation returns immediately on the second call rather than throwing. The rule that avoids all of this: dispose what you created with `new`, never what a factory or the container handed you.", ar: "الـ factory موجودة تحديداً لتجميع `HttpMessageHandler` الأساسي وإعادة استخدامه، لأن ذلك الـ handler هو من يملك اتصالات TCP. والتخلّص من العميل في كل طلب يلغي إعادة الاستخدام: فكل نداء يدفع ثمن إنشاء اتصال جديد وTLS handshake، عادةً 40 إلى 80 جزءاً من الألف، وتبقى الـ sockets المغلقة في TIME_WAIT دقيقتين تقريباً، وهذا قد يستنفد المنافذ المؤقّتة. والخيار الأول يكرّر سوء الفهم الشائع — فوجود الواجهة لا يعني أنك المالك. والخيار الثالث خاطئ: فالتخلّص من عميل لا يتخلّص من الـ factory، وهي singleton. والخيار الرابع خاطئ لأن `Dispose()` مطلوب أن يكون آمناً للاستدعاء أكثر من مرة؛ فالتنفيذ الصحيح يعود فوراً في الاستدعاء الثاني بدل أن يرمي. والقاعدة التي تتجنّب هذا كلّه: تخلّص ممّا أنشأته بـ `new`، لا ممّا سلّمته لك factory أو الحاوية." }
    }
  ]
};
```

NEXT: tasks
