```js
const syncPrimitivesLesson = {
  id: "sync-primitives",
  moduleId: "runtime",
  title: { en: "Locks and synchronization primitives", ar: "الأقفال وأدوات التزامن" },
  summary: {
    en: "Which lock to reach for when several threads touch the same data, what each one costs, and why deadlocks happen.",
    ar: "أي lock تستخدم عندما تلمس عدة threads نفس البيانات، وكم تكلفة كل واحد، ولماذا تحدث الـ deadlocks."
  },
  mins: 20,
  sections: [
    {
      key: "why",
      blocks: [
        {
          t: "p",
          en: "A lock is a rule that says: only one thread at a time may run this piece of code. You need one whenever two or more threads read and write the same data in memory, because without it their steps can interleave and leave the data wrong.",
          ar: "الـ lock هو قاعدة تقول: thread واحد فقط في كل لحظة يستطيع تنفيذ هذا الجزء من الكود. تحتاجه عندما يقرأ ويكتب أكثر من thread نفس البيانات في الذاكرة، لأن خطواتهم بدون lock قد تتداخل وتترك البيانات خاطئة."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "Thread", ar: "Thread" },
              v: {
                en: "One line of execution inside your process. ASP.NET Core serves many requests on many threads at the same moment.",
                ar: "خط تنفيذ واحد داخل الـ process. ASP.NET Core يخدم عدة requests على عدة threads في نفس اللحظة."
              }
            },
            {
              k: { en: "Shared state", ar: "Shared state" },
              v: {
                en: "Any variable more than one thread can reach: a static field, a field on a singleton service, a cached dictionary.",
                ar: "أي متغير يصل إليه أكثر من thread: static field، أو field داخل singleton service، أو dictionary مخزّن في الذاكرة."
              }
            },
            {
              k: { en: "Race condition", ar: "Race condition" },
              v: {
                en: "A bug where the result depends on the exact order in which two threads happened to run.",
                ar: "خطأ تعتمد نتيجته على الترتيب الذي صادف أن ينفّذ به الـ threads خطواتهم."
              }
            },
            {
              k: { en: "Critical section", ar: "Critical section" },
              v: {
                en: "The few lines that must never run on two threads at once. The lock wraps exactly these lines.",
                ar: "الأسطر القليلة التي يجب ألا تُنفَّذ على thread-ين في نفس الوقت. الـ lock يحيط بهذه الأسطر بالضبط."
              }
            },
            {
              k: { en: "Mutual exclusion", ar: "Mutual exclusion" },
              v: {
                en: "The guarantee that only one thread is inside the critical section. Every lock gives you this and nothing more.",
                ar: "الضمان بأن thread واحداً فقط داخل الـ critical section. كل lock يعطيك هذا الضمان ولا شيء أكثر."
              }
            },
            {
              k: { en: "Contention", ar: "Contention" },
              v: {
                en: "Two or more threads wanting the same lock at the same time. One runs, the others wait.",
                ar: "رغبة أكثر من thread في نفس الـ lock في نفس الوقت. واحد ينفّذ والباقي ينتظر."
              }
            }
          ]
        },
        {
          t: "p",
          en: "Here is the example we will follow through the whole lesson. A singleton service counts how many requests each API key has made this minute, using a plain Dictionary<string, int>. Two requests with the same key arrive at the same instant. Both threads read the count, see 4, both compute 5, both store 5. Two requests happened but the counter moved by one, so one request slipped through the limit for free.",
          ar: "هذا هو المثال الذي سنتابعه طوال الدرس. singleton service يعدّ كم request أرسله كل API key في هذه الدقيقة، باستخدام Dictionary<string, int> عادي. يصل request-ان بنفس الـ key في نفس اللحظة. كلا الـ threads يقرأ العدّاد ويجد 4، وكلاهما يحسب 5، وكلاهما يكتب 5. حدث request-ان لكن العدّاد تحرّك بمقدار واحد، فمرّ request واحد مجاناً فوق الحد."
        },
        {
          t: "p",
          en: "Think of a small café with one toilet and one key hanging behind the counter. You take the key, go in, come back and hang it up. Nobody else can be inside while you hold it. The lock object is that key, the toilet is the dictionary, and hanging the key back is releasing the lock. If a second key exists, the whole arrangement is pointless — which is exactly what happens when one code path locks on a different object than the others.",
          ar: "تخيّل مقهى صغيراً فيه حمّام واحد ومفتاح واحد معلّق خلف الكاونتر. تأخذ المفتاح، تدخل، تعود وتعلّقه. لا أحد يستطيع الدخول ما دام المفتاح معك. كائن الـ lock هو ذلك المفتاح، والحمّام هو الـ dictionary، وتعليق المفتاح هو تحرير الـ lock. لو وُجد مفتاح ثانٍ، فالترتيب كله بلا فائدة — وهذا بالضبط ما يحدث عندما يستخدم مسار كود واحد كائن lock مختلفاً عن البقية."
        },
        {
          t: "callout",
          kind: "note",
          en: "A lock protects data, not code. Every place that touches that dictionary — reads included — must take the same lock object. One forgotten read path makes all the other locks useless.",
          ar: "الـ lock يحمي البيانات لا الكود. كل مكان يلمس ذلك الـ dictionary — بما في ذلك القراءة — يجب أن يأخذ نفس كائن الـ lock. مسار قراءة واحد منسي يجعل كل الأقفال الأخرى بلا قيمة."
        }
      ]
    },
    {
      key: "problem",
      blocks: [
        {
          t: "p",
          en: "The line _counts[key] = _counts[key] + 1 looks like one action but it is three: read the current value from memory, add one in a CPU register, store the result back. A thread can be paused by the operating system between any two of those steps, and another thread can run the same three steps in the gap.",
          ar: "السطر _counts[key] = _counts[key] + 1 يبدو عملية واحدة لكنه ثلاث عمليات: قراءة القيمة الحالية من الذاكرة، وإضافة واحد داخل CPU register، ثم كتابة النتيجة. نظام التشغيل قد يوقف الـ thread بين أي خطوتين، ويشغّل thread آخر ينفّذ نفس الخطوات الثلاث في تلك الفجوة."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "Step 1 — thread A", ar: "الخطوة 1 — thread A" },
              v: { en: "Reads _counts[\"k1\"] and gets 4. Then the OS pauses it.", ar: "يقرأ ‎_counts[\"k1\"]‎ فيجد 4. ثم يوقفه نظام التشغيل." }
            },
            {
              k: { en: "Step 2 — thread B", ar: "الخطوة 2 — thread B" },
              v: { en: "Reads the same slot, also gets 4, computes 5, stores 5.", ar: "يقرأ نفس الخانة، ويجد 4 أيضاً، يحسب 5، ويكتب 5." }
            },
            {
              k: { en: "Step 3 — thread A resumes", ar: "الخطوة 3 — يستأنف thread A" },
              v: { en: "Still holds 4 in its register, computes 5, stores 5 over B's value.", ar: "ما زال يحمل 4 في الـ register، يحسب 5، ويكتب 5 فوق قيمة B." }
            },
            {
              k: { en: "Result", ar: "النتيجة" },
              v: { en: "Two increments happened, the counter shows one. This is called a lost update.", ar: "حدثت زيادتان والعدّاد يظهر واحدة. يسمّى هذا lost update." }
            }
          ]
        },
        {
          t: "p",
          en: "Run this as a test: 8 threads, each incrementing the same key 100,000 times. The correct answer is 800,000. Without a lock a typical run lands somewhere between 250,000 and 650,000 — meaning hundreds of thousands of increments were silently overwritten. The number is different on every run, which is why this class of bug never reproduces on demand.",
          ar: "جرّب هذا كاختبار: 8 threads، كل واحد يزيد نفس الـ key مئة ألف مرة. الإجابة الصحيحة 800,000. بدون lock تكون النتيجة عادةً بين 250,000 و650,000 — أي أن مئات الآلاف من الزيادات كُتب فوقها بصمت. الرقم يختلف في كل تشغيل، ولهذا لا يتكرر هذا النوع من الأخطاء عند الطلب."
        },
        {
          t: "p",
          en: "Wrap those three steps in a lock and every run returns exactly 800,000. The cost is real but small: on a modern machine taking and releasing a lock that nobody else wants costs roughly 20 nanoseconds — about the time of a few dozen simple instructions. Under the heavy contention of this test the whole loop still finishes in well under a second. The bug was free to introduce and the fix is cheap; the expensive case is contention, covered below.",
          ar: "ضع الخطوات الثلاث داخل lock وستحصل على 800,000 بالضبط في كل تشغيل. التكلفة حقيقية لكنها صغيرة: على جهاز حديث، أخذ lock لا ينازعك عليه أحد وتحريره يكلّف نحو 20 nanosecond — أي زمن بضع عشرات من التعليمات البسيطة. وحتى مع الـ contention الشديد في هذا الاختبار، تنتهي الحلقة كلها في أقل من ثانية. إدخال الخطأ كان مجانياً وإصلاحه رخيص؛ الحالة المكلفة هي الـ contention، ونشرحها لاحقاً."
        }
      ]
    },
    {
      key: "internals",
      blocks: [
        {
          t: "p",
          en: "The C# lock statement is not a primitive of its own. The compiler rewrites it into two calls on the Monitor class — Monitor.Enter and Monitor.Exit — with a try/finally so the lock is released even if your code throws. Monitor is the type that actually does the work.",
          ar: "تعليمة lock في C# ليست أداة قائمة بذاتها. المترجم يحوّلها إلى استدعاءين على صنف Monitor — هما Monitor.Enter و Monitor.Exit — داخل try/finally حتى يتحرر الـ lock حتى لو رمى كودك exception. الـ Monitor هو النوع الذي ينفّذ العمل فعلياً."
        },
        {
          t: "code",
          lang: "csharp",
          label: { en: "What lock compiles to", ar: "إلى ماذا تُترجَم lock" },
          code: "// what you write\nprivate readonly object _gate = new();\n\nlock (_gate)\n{\n    _counts[key] = _counts[key] + 1;\n}\n\n// what the compiler emits (roughly)\nbool lockTaken = false;\ntry\n{\n    Monitor.Enter(_gate, ref lockTaken);\n    _counts[key] = _counts[key] + 1;\n}\nfinally\n{\n    if (lockTaken) Monitor.Exit(_gate);\n}"
        },
        {
          t: "p",
          en: "Every object on the heap has a small header word in front of it. When a thread takes an uncontended lock, the runtime writes that thread's id and a recursion count straight into the header. This is the thin lock: no operating system involved, just a compare-and-swap instruction, which is why it costs tens of nanoseconds. If a second thread arrives while the first still holds it, the runtime inflates the lock — it allocates a sync block, a separate structure that can hold a waiting list, and points the header at it.",
          ar: "كل object على الـ heap له header word صغير قبله. عندما يأخذ thread قفلاً لا ينازعه عليه أحد، يكتب الـ runtime رقم ذلك الـ thread وعدّاد التكرار مباشرة داخل الـ header. هذا هو الـ thin lock: لا دخل لنظام التشغيل، مجرد تعليمة compare-and-swap، ولهذا تكلفته عشرات النانوثانية. وإذا وصل thread ثانٍ بينما الأول ما زال ممسكاً بالقفل، يقوم الـ runtime بـ inflation — يخصّص sync block، وهو بنية منفصلة تستطيع حفظ قائمة انتظار، ويجعل الـ header يشير إليها."
        },
        {
          t: "p",
          en: "The waiting thread does not sleep immediately. It first spins: it runs a tight empty loop for a very short while, betting the lock will be free within a few hundred nanoseconds. If that bet fails, the thread asks the operating system to park it, which means a context switch — the OS saves this thread's state and gives the CPU core to someone else. Parking and waking again costs on the order of a microsecond, roughly fifty times a clean lock. That gap is the whole performance story of locking.",
          ar: "الـ thread المنتظر لا ينام فوراً. أولاً يقوم بـ spin: يدور في حلقة فارغة قصيرة جداً، مراهناً على أن القفل سيتحرر خلال بضع مئات من النانوثانية. وإذا فشلت المراهنة، يطلب من نظام التشغيل أن يوقفه (park)، وهذا يعني context switch — يحفظ النظام حالة الـ thread ويعطي نواة المعالج لغيره. الإيقاف ثم الإيقاظ يكلّفان نحو microsecond واحد، أي حوالي خمسين ضعف قفل نظيف. هذه الفجوة هي كل قصة أداء الأقفال."
        },
        {
          t: "p",
          en: "The bakery makes this concrete. You walk up and the counter is free, so you are served at once — that is the thin lock. Someone is being served, so you take a numbered ticket and stand right there watching — that is the sync block plus spinning. The queue turns out to be long, so you sit down and wait for your number to be called — that is the OS parking your thread. Sitting down is comfortable but standing up again takes time, and that time is what you pay under contention.",
          ar: "مثال المخبز يوضّح هذا. تصل والكاونتر فارغ فتُخدَم فوراً — هذا هو الـ thin lock. أو يكون هناك زبون فتأخذ رقماً وتقف تراقب — هذا هو الـ sync block مع الـ spinning. ثم يتبيّن أن الطابور طويل فتجلس وتنتظر مناداة رقمك — هذا هو إيقاف نظام التشغيل للـ thread. الجلوس مريح لكن النهوض يستغرق وقتاً، وهذا الوقت هو ما تدفعه عند الـ contention."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "Monitor / lock", ar: "Monitor / lock" },
              v: {
                en: "Thread-affine and re-entrant: the thread that took it must release it, and it may take it again without blocking itself. Cannot span an await.",
                ar: "مرتبط بالـ thread وقابل لإعادة الدخول: الـ thread الذي أخذه هو من يحرره، ويستطيع أخذه مرة أخرى دون أن يعلّق نفسه. لا يمكن أن يمتد عبر await."
              }
            },
            {
              k: { en: "SemaphoreSlim", ar: "SemaphoreSlim" },
              v: {
                en: "A counter of permits. new SemaphoreSlim(1, 1) behaves like a lock. Not thread-affine, so it is the one you use around await.",
                ar: "عدّاد تصاريح. ‎new SemaphoreSlim(1, 1)‎ يتصرف كـ lock. غير مرتبط بالـ thread، ولهذا هو الأداة التي تستخدمها حول await."
              }
            },
            {
              k: { en: "ReaderWriterLockSlim", ar: "ReaderWriterLockSlim" },
              v: {
                en: "Lets many readers in together but only one writer alone. Costs about two to three times a plain lock per operation.",
                ar: "يسمح بدخول عدة readers معاً ولكن writer واحد بمفرده. يكلّف نحو ضعفين إلى ثلاثة أضعاف الـ lock العادي لكل عملية."
              }
            },
            {
              k: { en: "Interlocked", ar: "Interlocked" },
              v: {
                en: "A single CPU instruction that reads, changes and stores one number atomically. No lock at all for counters and flags.",
                ar: "تعليمة معالج واحدة تقرأ وتعدّل وتكتب رقماً واحداً بشكل ذرّي. بلا lock إطلاقاً للعدّادات والـ flags."
              }
            },
            {
              k: { en: "ConcurrentDictionary", ar: "ConcurrentDictionary" },
              v: {
                en: "A dictionary with the locking already built in and split across internal buckets. Usually beats writing your own lock.",
                ar: "dictionary مبني داخله القفل وموزّع على buckets داخلية. عادةً أفضل من كتابة lock بنفسك."
              }
            }
          ]
        },
        {
          t: "p",
          en: "Monitor is tied to the thread that entered it, and await can resume your method on a different thread. That mismatch is why C# refuses to compile an await inside a lock block: the thread that would call Monitor.Exit might not be the one that called Monitor.Enter. SemaphoreSlim has no thread identity — it just counts permits — so it is the correct tool when the protected work is asynchronous.",
          ar: "الـ Monitor مرتبط بالـ thread الذي دخله، و await قد يستأنف الدالة على thread مختلف. هذا التعارض هو سبب رفض C# ترجمة await داخل كتلة lock: قد لا يكون الـ thread الذي سينادي Monitor.Exit هو نفسه الذي نادى Monitor.Enter. أما SemaphoreSlim فلا هوية thread له — إنه يعدّ التصاريح فقط — ولذلك هو الأداة الصحيحة عندما يكون العمل المحمي asynchronous."
        },
        {
          t: "code",
          lang: "csharp",
          label: { en: "Async-safe mutual exclusion", ar: "mutual exclusion آمن مع async" },
          code: "private readonly SemaphoreSlim _gate = new(1, 1);\n\npublic async Task<int> BumpAsync(string key, CancellationToken ct)\n{\n    await _gate.WaitAsync(ct);          // waits without blocking a thread\n    try\n    {\n        var current = await _store.GetAsync(key, ct);\n        var next = current + 1;\n        await _store.SetAsync(key, next, ct);\n        return next;\n    }\n    finally\n    {\n        _gate.Release();                 // must be in finally, or the permit is lost forever\n    }\n}\n\n// SemaphoreSlim is NOT re-entrant: calling BumpAsync from inside BumpAsync\n// on the same thread deadlocks against itself."
        },
        {
          t: "callout",
          kind: "tip",
          en: "Since .NET 9 and C# 13 you can declare the field as System.Threading.Lock instead of object. The lock statement then uses a faster dedicated path, and the compiler warns you if you pass that field to Monitor.Enter by mistake. The semantics are the same, so it is a drop-in change.",
          ar: "منذ .NET 9 و C# 13 يمكنك تعريف الحقل بنوع System.Threading.Lock بدل object. عندها تستخدم تعليمة lock مساراً مخصصاً أسرع، ويحذّرك المترجم إن مرّرت الحقل إلى Monitor.Enter بالخطأ. الدلالات نفسها، فهو تغيير مباشر دون أثر جانبي."
        }
      ]
    },
    {
      key: "tradeoffs",
      blocks: [
        {
          t: "tradeoff",
          pros: {
            en: [
              "Correctness that is easy to see: one lock object, one critical section, one rule.",
              "An uncontended lock costs about 20 nanoseconds, so the safe version is rarely the slow version.",
              "Entering and leaving a lock also publishes your writes to other threads, so you do not need volatile as well.",
              "Works for any shape of data, including several fields that must change together."
            ],
            ar: [
              "صحة يسهل رؤيتها: كائن lock واحد، critical section واحدة، قاعدة واحدة.",
              "القفل غير المتنازَع عليه يكلّف نحو 20 nanosecond، فالنسخة الآمنة نادراً ما تكون البطيئة.",
              "الدخول إلى الـ lock والخروج منه ينشران كتاباتك لبقية الـ threads، فلا تحتاج volatile إضافياً.",
              "يصلح لأي شكل من البيانات، بما فيها عدة fields يجب أن تتغير معاً."
            ]
          },
          cons: {
            en: [
              "Under contention threads get parked by the OS, turning a 20 nanosecond operation into roughly a microsecond.",
              "Two locks taken in different orders by two threads deadlock, and the app simply stops responding.",
              "A lock serialises that code path, so extra CPU cores stop helping past a point.",
              "It is invisible in the type system: nothing stops a new code path from touching the data without locking."
            ],
            ar: [
              "مع الـ contention يوقف نظام التشغيل الـ threads، فتتحول عملية من 20 nanosecond إلى نحو microsecond.",
              "أخذ قفلين بترتيبين مختلفين من thread-ين يسبّب deadlock، ويتوقف التطبيق عن الاستجابة ببساطة.",
              "الـ lock يجعل مسار الكود تسلسلياً، فتتوقف النوى الإضافية عن المساعدة بعد حدّ معيّن.",
              "غير مرئي في نظام الأنواع: لا شيء يمنع مسار كود جديد من لمس البيانات بدون قفل."
            ]
          },
          limits: {
            en: [
              "Protects memory inside one process only — it means nothing across two servers or two pods.",
              "Monitor cannot be held across an await, so async code needs SemaphoreSlim instead.",
              "Fairness is not guaranteed: a thread can be skipped repeatedly while others keep taking the lock.",
              "Holding a lock during I/O multiplies its hold time by thousands and ruins throughput."
            ],
            ar: [
              "يحمي الذاكرة داخل process واحد فقط — لا يعني شيئاً عبر خادمين أو pod-ين.",
              "لا يمكن إمساك Monitor عبر await، فالكود الـ async يحتاج SemaphoreSlim بدلاً منه.",
              "العدالة غير مضمونة: قد يُتجاوز thread مراراً بينما يأخذ غيره القفل.",
              "إمساك القفل أثناء I/O يضاعف مدة الإمساك آلاف المرات ويدمّر الـ throughput."
            ]
          },
          alts: {
            en: [
              "Interlocked.Increment or Interlocked.CompareExchange for a single number or reference.",
              "ConcurrentDictionary and the other System.Collections.Concurrent types, which lock internally per bucket.",
              "Immutable state swapped atomically: build a new object, then publish it with one reference assignment.",
              "No sharing at all: give each request its own copy, or push coordination into the database or Redis."
            ],
            ar: [
              "‎Interlocked.Increment‎ أو ‎Interlocked.CompareExchange‎ لرقم واحد أو مرجع واحد.",
              "ConcurrentDictionary وبقية أنواع System.Collections.Concurrent، وهي تقفل داخلياً على مستوى الـ bucket.",
              "حالة immutable تُبدَّل ذرّياً: ابنِ object جديداً ثم انشره بإسناد مرجع واحد.",
              "لا مشاركة أصلاً: أعطِ كل request نسخته، أو انقل التنسيق إلى قاعدة البيانات أو Redis."
            ]
          }
        }
      ]
    },
    {
      key: "mistakes",
      blocks: [
        {
          t: "mistake",
          title: { en: "Blocking on async work inside a lock", ar: "الانتظار المتزامن لعمل async داخل lock" },
          body: {
            en: "A team wanted to refresh the rate-limit config from an HTTP endpoint under a lock, and since lock forbids await they wrote .Result instead. Calling .Result blocks the current thread until the HTTP call finishes. That thread is a thread-pool thread, and it is holding the lock the whole time — typically 50 to 200 milliseconds instead of microseconds. Under load every request queued behind that lock, the thread pool ran out of free threads, and the service returned 504 gateway timeouts while CPU sat near zero.",
            ar: "أراد فريق تحديث إعدادات الـ rate limit من HTTP endpoint داخل lock، ولأن lock يمنع await كتبوا ‎.Result‎ بدلاً منه. استدعاء ‎.Result‎ يعلّق الـ thread الحالي حتى ينتهي طلب الـ HTTP. ذلك الـ thread من الـ thread pool، وهو ممسك بالقفل طوال الوقت — عادة 50 إلى 200 millisecond بدل الميكروثانية. تحت الحمل اصطفّت كل الـ requests خلف ذلك القفل، ونفدت threads الـ pool، وأرجعت الخدمة 504 بينما استهلاك المعالج قرب الصفر."
          },
          fix: "// use SemaphoreSlim and await, and keep the I/O outside the critical section\nvar fresh = await _http.GetConfigAsync(ct);   // slow work, no lock held\nawait _gate.WaitAsync(ct);\ntry { _config = fresh; }                      // fast work, lock held\nfinally { _gate.Release(); }"
        },
        {
          t: "mistake",
          title: { en: "Locking on an object other code can also reach", ar: "القفل على كائن يستطيع كود آخر الوصول إليه" },
          body: {
            en: "A cache class used lock (this) so callers would not need a separate field. A logging decorator elsewhere also did lock (cacheInstance) around its own work. Both were locking the same object without knowing it, so an unrelated log flush could block every cache read. The same trap applies to lock on a string: identical string literals are interned, meaning they are the same object process-wide, so lock (\"users\") in two unrelated classes is one shared lock. Always lock a private readonly field that nothing outside the class can see.",
            ar: "استخدم صنف cache التعليمة ‎lock (this)‎ حتى لا يحتاج المستدعون حقلاً منفصلاً. وفي مكان آخر كان logging decorator يستخدم ‎lock (cacheInstance)‎ حول عمله الخاص. كلاهما كان يقفل على نفس الكائن دون أن يدري، فصار flush للـ log قادراً على تعليق كل قراءات الـ cache. ونفس الفخ ينطبق على القفل على string: النصوص الحرفية المتطابقة تُوحَّد في الذاكرة (interning)، أي أنها نفس الكائن داخل الـ process، فـ ‎lock (\"users\")‎ في صنفين لا علاقة بينهما هو قفل واحد مشترك. اقفل دائماً على private readonly field لا يراه أحد خارج الصنف."
          },
          fix: "private readonly object _gate = new();   // or: private readonly Lock _gate = new();  (.NET 9+)\nlock (_gate) { /* ... */ }"
        },
        {
          t: "mistake",
          title: { en: "Locking the writes but not the reads", ar: "قفل الكتابة دون القراءة" },
          body: {
            en: "The increment path took the lock correctly, but the GET endpoint read the dictionary directly because \"reading is harmless\". Dictionary<K,V> resizes its internal array when it grows, and a reader walking that array mid-resize can see a half-built structure. In production this showed up as an occasional IndexOutOfRangeException from inside Dictionary itself, and once as a request that looped forever at 100% CPU. Reads need the same lock, or the type must be ConcurrentDictionary.",
            ar: "كان مسار الزيادة يأخذ القفل بشكل صحيح، لكن الـ GET endpoint كان يقرأ الـ dictionary مباشرة لأن «القراءة غير ضارة». الـ ‎Dictionary<K,V>‎ يعيد تحجيم مصفوفته الداخلية عند النمو، والقارئ الذي يمرّ على تلك المصفوفة أثناء إعادة التحجيم قد يرى بنية نصف مبنيّة. في الإنتاج ظهر هذا كـ IndexOutOfRangeException من داخل Dictionary نفسه، ومرة كـ request علق في حلقة لا تنتهي مستهلكاً 100% من المعالج. القراءات تحتاج نفس القفل، أو يصبح النوع ConcurrentDictionary."
          }
        },
        {
          t: "mistake",
          title: { en: "Two locks taken in two different orders", ar: "قفلان يُؤخذان بترتيبين مختلفين" },
          body: {
            en: "A transfer method locked the source account then the destination account. A separate reconciliation job locked the destination then the source. Normally nothing happens. When both ran on the same pair at the same instant, each thread held one lock and waited for the other, forever. Nothing crashed and no exception was logged — two requests simply never returned, and an hour later the thread pool was exhausted. The rule that prevents it is boring and effective: when a code path needs more than one lock, always take them in one fixed global order, for example sorted by account id.",
            ar: "كانت دالة التحويل تقفل الحساب المصدر ثم الحساب الهدف. وكانت مهمة تسوية منفصلة تقفل الهدف ثم المصدر. في الأحوال العادية لا يحدث شيء. وعندما عملت الاثنتان على نفس الزوج في نفس اللحظة، أمسك كل thread قفلاً وانتظر الآخر إلى الأبد. لم ينهَر شيء ولم يُسجَّل exception — فقط request-ان لم يعودا أبداً، وبعد ساعة نفدت threads الـ pool. القاعدة التي تمنع هذا مملّة وفعّالة: عندما يحتاج مسار كود أكثر من قفل، خذها دائماً بترتيب عام ثابت، مثلاً مرتّبة حسب رقم الحساب."
          },
          fix: "var first  = a.Id < b.Id ? a : b;   // fixed global order, every caller, every time\nvar second = a.Id < b.Id ? b : a;\nlock (first.Gate) lock (second.Gate) { Transfer(a, b, amount); }"
        }
      ]
    },
    {
      key: "interview",
      blocks: [
        {
          t: "qa",
          level: "junior",
          q: { en: "What does the lock statement actually do?", ar: "ماذا تفعل تعليمة lock فعلياً؟" },
          a: {
            en: "It makes sure only one thread at a time runs the code inside the braces. The compiler turns it into Monitor.Enter and Monitor.Exit wrapped in a try/finally, so the lock is released even if the code throws. The object you pass is just a ticket — its identity is what matters, not its contents — so it should be a private field that only this class can reach.",
            ar: "تضمن أن thread واحداً فقط في كل لحظة ينفّذ الكود داخل الأقواس. المترجم يحوّلها إلى Monitor.Enter و Monitor.Exit داخل try/finally، فيتحرر القفل حتى لو رمى الكود exception. الكائن الذي تمرّره مجرد تذكرة — المهم هويته لا محتواه — لذا يجب أن يكون private field لا يصل إليه إلا هذا الصنف."
          }
        },
        {
          t: "qa",
          level: "mid",
          q: { en: "lock versus SemaphoreSlim(1, 1) — when do you pick each?", ar: "lock مقابل ‎SemaphoreSlim(1, 1)‎ — متى تختار كلاً منهما؟" },
          a: {
            en: "Both allow one thread in at a time. I use lock for short synchronous work because it is cheaper and releases automatically. I use SemaphoreSlim(1, 1) whenever there is an await inside the critical section, because lock is tied to a specific thread and await can resume on another one. The costs of SemaphoreSlim are that it is not re-entrant and that you must Release in a finally, otherwise the permit is gone for the lifetime of the process.",
            ar: "كلاهما يسمح بدخول thread واحد في كل مرة. أستخدم lock للعمل المتزامن القصير لأنه أرخص ويتحرر تلقائياً. وأستخدم ‎SemaphoreSlim(1, 1)‎ كلما وُجد await داخل الـ critical section، لأن lock مرتبط بـ thread محدد و await قد يستأنف على thread آخر. عيوب SemaphoreSlim أنه غير قابل لإعادة الدخول، وأنه يجب استدعاء Release داخل finally، وإلا ضاع التصريح لبقية عمر الـ process."
          }
        },
        {
          t: "qa",
          level: "mid",
          q: { en: "Why does C# refuse to let you await inside a lock?", ar: "لماذا ترفض C# استخدام await داخل lock؟" },
          a: {
            en: "Because Monitor is thread-affine: the exact thread that entered must be the one that exits. After an await, the rest of the method can continue on a different thread-pool thread, so the Exit call could come from a thread that never entered. That would either throw or silently corrupt the lock state, so the compiler blocks it up front. The escape hatch is SemaphoreSlim, which counts permits and does not care which thread releases.",
            ar: "لأن Monitor مرتبط بالـ thread: نفس الـ thread الذي دخل يجب أن يكون الذي يخرج. بعد await قد يكمل باقي الدالة على thread آخر من الـ pool، فيأتي استدعاء Exit من thread لم يدخل أصلاً. هذا إما يرمي exception أو يفسد حالة القفل بصمت، لذا يمنعه المترجم مسبقاً. البديل هو SemaphoreSlim الذي يعدّ التصاريح ولا يهمّه أي thread يحرّر."
          }
        },
        {
          t: "qa",
          level: "senior",
          q: { en: "When is ReaderWriterLockSlim actually worth it over a plain lock?", ar: "متى يستحق ReaderWriterLockSlim الاستخدام فعلاً بدل lock عادي؟" },
          a: {
            en: "Only when reads heavily outnumber writes and each read section is long enough to matter. ReaderWriterLockSlim lets many readers in together, but each acquire costs roughly two to three times a plain lock because it maintains more state. So if the protected work is a single dictionary lookup taking 30 nanoseconds, the bookkeeping costs more than the parallelism saves. My default is a plain lock; if the data is a read-mostly map I usually skip both and use ConcurrentDictionary, or swap an immutable snapshot on write.",
            ar: "فقط عندما تفوق القراءات الكتابات بفارق كبير وتكون كل عملية قراءة طويلة بما يكفي. ReaderWriterLockSlim يسمح بدخول عدة readers معاً، لكن كل عملية أخذ تكلّف نحو ضعفين إلى ثلاثة أضعاف الـ lock العادي لأنه يحتفظ بحالة أكثر. فإذا كان العمل المحمي مجرد بحث في dictionary يستغرق 30 nanosecond، فتكلفة الإدارة أكبر مما يوفّره التوازي. الافتراضي عندي هو lock عادي؛ وإذا كانت البيانات خريطة قراءتها غالبة أتجاوز الاثنين وأستخدم ConcurrentDictionary أو أبدّل snapshot غير قابل للتعديل عند الكتابة."
          }
        },
        {
          t: "qa",
          level: "senior",
          q: { en: "How do you stop deadlocks in a codebase that has several locks?", ar: "كيف تمنع الـ deadlocks في كود يحتوي عدة أقفال؟" },
          a: {
            en: "Three rules, in order of value. First, never call code you do not control while holding a lock — no HTTP, no database, no event handler, no virtual method someone can override. Second, if a path truly needs two locks, define one global order and take them in that order everywhere, for example sorted by entity id. Third, prefer designs with only one lock per piece of state, so the question never comes up. If I inherit a system that already deadlocks, I capture a dump and use the thread list to see which thread waits on which lock.",
            ar: "ثلاث قواعد مرتّبة حسب الأهمية. أولاً: لا تنادِ أبداً كوداً لا تتحكم به وأنت ممسك بقفل — لا HTTP، ولا قاعدة بيانات، ولا event handler، ولا دالة virtual يستطيع أحد إعادة تعريفها. ثانياً: إذا احتاج مسار قفلين فعلاً، حدّد ترتيباً عاماً واحداً وخذها به في كل مكان، مثلاً مرتّبة حسب معرّف الكيان. ثالثاً: فضّل تصميماً فيه قفل واحد لكل قطعة حالة، فلا يُطرح السؤال أصلاً. وإذا ورثت نظاماً يقع فيه deadlock بالفعل، آخذ dump وأستخدم قائمة الـ threads لأرى أي thread ينتظر أي قفل."
          }
        },
        {
          t: "qa",
          level: "staff",
          q: { en: "Your teams keep shipping concurrency bugs. What do you change structurally?", ar: "فرقك تُصدر باستمرار أخطاء تزامن. ما الذي تغيّره على مستوى البنية؟" },
          a: {
            en: "I stop treating it as a review-discipline problem and remove the shared mutable state instead. Concretely: singletons hold only immutable configuration, anything mutable becomes scoped per request or moves behind a concurrent collection, and cross-instance coordination moves to the database or Redis where it actually works across pods. I add one owner per piece of shared state so there is a single file to review. I add a stress test in CI that runs the hot path on many threads and asserts the invariant, because these bugs never appear in a single-threaded unit test. Finally I write down the lock-ordering rule in the coding guide, so a reviewer can point at a line instead of arguing from taste.",
            ar: "أتوقف عن اعتبارها مشكلة انضباط في المراجعة وأزيل الحالة المشتركة القابلة للتعديل بدلاً من ذلك. عملياً: الـ singletons تحمل إعدادات immutable فقط، وأي شيء قابل للتعديل يصبح scoped لكل request أو ينتقل خلف concurrent collection، والتنسيق بين النسخ ينتقل إلى قاعدة البيانات أو Redis حيث يعمل فعلاً عبر الـ pods. أعيّن مالكاً واحداً لكل قطعة حالة مشتركة ليصبح هناك ملف واحد للمراجعة. وأضيف stress test في الـ CI يشغّل المسار الساخن على عدة threads ويتحقق من الثابت، لأن هذه الأخطاء لا تظهر في unit test أحادي الـ thread. وأخيراً أكتب قاعدة ترتيب الأقفال في دليل الكود، ليشير المراجع إلى سطر بدل أن يجادل بالذوق."
          }
        }
      ]
    },
    {
      key: "codereview",
      blocks: [
        {
          t: "review",
          severity: "high",
          title: { en: "I/O performed while holding the lock", ar: "تنفيذ I/O أثناء إمساك القفل" },
          bad: "lock (_gate)\n{\n    if (!_cache.TryGetValue(key, out var value))\n    {\n        value = _db.LoadAsync(key).Result;   // blocks the thread, holds the lock\n        _cache[key] = value;\n    }\n}\nreturn value;",
          good: "if (_cache.TryGetValue(key, out var value)) return value;\n\nvar loaded = await _db.LoadAsync(key, ct);   // slow work, no lock held\n\nawait _gate.WaitAsync(ct);\ntry\n{\n    if (!_cache.TryGetValue(key, out value))  // re-check: someone may have won the race\n    {\n        _cache[key] = loaded;\n        value = loaded;\n    }\n}\nfinally { _gate.Release(); }\nreturn value;",
          why: {
            en: "The bad version holds the lock for the length of a database round trip, so lock hold time jumps from microseconds to tens of milliseconds and every other caller queues behind it. Using .Result also blocks a thread-pool thread, so under load the pool runs out and unrelated endpoints start timing out. The good version does the slow work outside the lock and only takes it for the fast dictionary write, re-checking inside because another thread may have filled the entry meanwhile.",
            ar: "النسخة السيئة تمسك القفل طوال رحلة ذهاب وإياب إلى قاعدة البيانات، فيقفز زمن الإمساك من ميكروثوانٍ إلى عشرات الميلي ثانية ويصطف كل المستدعين خلفه. كما أن ‎.Result‎ يعلّق thread من الـ pool، فتحت الحمل تنفد الـ pool وتبدأ endpoints أخرى لا علاقة لها بالانتهاء بـ timeout. النسخة الجيدة تنفّذ العمل البطيء خارج القفل وتأخذه فقط للكتابة السريعة في الـ dictionary، مع إعادة الفحص بالداخل لأن thread آخر قد يكون ملأ المدخل في الأثناء."
          }
        },
        {
          t: "review",
          severity: "low",
          title: { en: "A lock used where one atomic instruction is enough", ar: "قفل في مكان تكفي فيه تعليمة ذرّية واحدة" },
          bad: "private long _processed;\nprivate readonly object _gate = new();\n\npublic void MarkProcessed()\n{\n    lock (_gate) { _processed++; }\n}\n\npublic long Processed\n{\n    get { lock (_gate) { return _processed; } }\n}",
          good: "private long _processed;\n\npublic void MarkProcessed() => Interlocked.Increment(ref _processed);\n\npublic long Processed => Interlocked.Read(ref _processed);",
          why: {
            en: "Interlocked.Increment performs the read, add and store as one CPU instruction that no other thread can interrupt, so it is correct without a lock and costs a few nanoseconds instead of twenty plus the risk of parking under contention. This is a low-severity comment because the original code is correct — it is only wasteful — but on a counter touched on every request the difference shows up in a profile. Note Interlocked.Read for the getter: a 64-bit read is not guaranteed atomic on a 32-bit process.",
            ar: "‎Interlocked.Increment‎ ينفّذ القراءة والإضافة والكتابة كتعليمة معالج واحدة لا يستطيع thread آخر مقاطعتها، فهو صحيح بلا قفل ويكلّف بضع نانوثوانٍ بدل عشرين، دون خطر الإيقاف عند الـ contention. هذه ملاحظة منخفضة الخطورة لأن الكود الأصلي صحيح — لكنه مهدر فقط — إلا أن الفارق يظهر في الـ profile على عدّاد يُلمَس في كل request. لاحظ ‎Interlocked.Read‎ في الـ getter: قراءة 64 بت ليست مضمونة الذرّية في process بـ 32 بت."
          }
        }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        {
          t: "p",
          en: "Every primitive in this lesson lives inside one process. The moment you run two copies of the service — two pods, two VMs, a blue/green pair — the lock in instance A is invisible to instance B, and the guarantee is gone. This is the single most common design mistake with locks: an in-memory rate limiter that was correct on one box silently allows double the traffic on two.",
          ar: "كل أداة في هذا الدرس تعيش داخل process واحد. وفي اللحظة التي تشغّل فيها نسختين من الخدمة — pod-ان، أو جهازان، أو زوج blue/green — يصبح القفل في النسخة A غير مرئي للنسخة B، ويضيع الضمان. هذا أشيع خطأ تصميمي مع الأقفال: rate limiter في الذاكرة كان صحيحاً على خادم واحد يسمح بضعف الحركة بصمت على خادمين."
        },
        {
          t: "ul",
          en: [
            "In-process lock: correct for state that belongs to this instance only, such as a connection pool or a local cache slot.",
            "Partition by key: route all requests for one API key to one instance with consistent hashing, so an in-process lock becomes valid again.",
            "Database as the coordinator: a unique constraint, an UPDATE ... WHERE version = @v, or SELECT ... FOR UPDATE gives mutual exclusion across all instances.",
            "Distributed lock in Redis: SET key value NX PX 30000 plus a token you check before releasing. It needs a lease timeout, and it is a performance optimisation, not a correctness guarantee.",
            "No lock at all: make the operation idempotent so running it twice is harmless, which is usually cheaper than coordinating."
          ],
          ar: [
            "قفل داخل الـ process: صحيح لحالة تخص هذه النسخة وحدها، مثل connection pool أو خانة cache محلية.",
            "التقسيم حسب المفتاح: وجّه كل requests مفتاح واحد إلى نسخة واحدة عبر consistent hashing، فيعود القفل داخل الـ process صالحاً.",
            "قاعدة البيانات كمنسّق: unique constraint، أو ‎UPDATE ... WHERE version = @v‎، أو ‎SELECT ... FOR UPDATE‎ تعطي mutual exclusion عبر كل النسخ.",
            "distributed lock في Redis: ‎SET key value NX PX 30000‎ مع token تتحقق منه قبل التحرير. يحتاج مهلة lease، وهو تحسين أداء لا ضمان صحة.",
            "لا قفل إطلاقاً: اجعل العملية idempotent بحيث لا يضرّ تنفيذها مرتين، وهذا عادة أرخص من التنسيق."
          ]
        },
        {
          t: "callout",
          kind: "warn",
          en: "A Redis lock can expire while the holder is still working — a long garbage-collection pause or a slow query is enough. Never assume a distributed lock means nobody else is inside. Make the protected operation safe to run twice as well.",
          ar: "قد تنتهي صلاحية قفل Redis بينما صاحبه ما زال يعمل — توقّف طويل للـ garbage collector أو استعلام بطيء يكفي. لا تفترض أبداً أن الـ distributed lock يعني أن لا أحد غيرك بالداخل. اجعل العملية المحمية آمنة عند تنفيذها مرتين أيضاً."
        }
      ]
    },
    {
      key: "perf",
      blocks: [
        {
          t: "kv",
          rows: [
            {
              k: { en: "CPU", ar: "CPU" },
              v: {
                en: "An uncontended lock is one atomic instruction, around 20 ns. Under contention threads spin first, burning CPU without doing work, then get parked.",
                ar: "القفل غير المتنازَع عليه تعليمة ذرّية واحدة، نحو 20 ns. ومع الـ contention تدور الـ threads أولاً فتستهلك المعالج بلا إنتاج، ثم تُوقَف."
              }
            },
            {
              k: { en: "Latency", ar: "Latency" },
              v: {
                en: "Parking and waking a thread costs about a microsecond, roughly fifty times a clean lock. This lands on p99 first — the slowest 1 request in 100.",
                ar: "إيقاف الـ thread وإيقاظه يكلّفان نحو microsecond، أي حوالي خمسين ضعف قفل نظيف. ويظهر الأثر أولاً في p99 — أبطأ request من كل مئة."
              }
            },
            {
              k: { en: "Scalability", ar: "Scalability" },
              v: {
                en: "A lock serialises its section, so throughput stops rising with core count once that section dominates. Shrinking the section beats adding cores.",
                ar: "القفل يجعل قسمه تسلسلياً، فيتوقف الـ throughput عن الارتفاع مع عدد النوى حين يهيمن ذلك القسم. تقليص القسم أجدى من إضافة نوى."
              }
            },
            {
              k: { en: "Memory", ar: "Memory" },
              v: {
                en: "The thin lock is free — it reuses the object header. Contention allocates a sync block per contended object, and ReaderWriterLockSlim keeps per-thread state.",
                ar: "الـ thin lock مجاني — يعيد استخدام header الكائن. أما الـ contention فيخصّص sync block لكل كائن متنازع عليه، و ReaderWriterLockSlim يحتفظ بحالة لكل thread."
              }
            },
            {
              k: { en: "Throughput under load", ar: "Throughput تحت الحمل" },
              v: {
                en: "Hold time matters more than lock choice: 10 ms of I/O inside a lock caps that path at about 100 operations per second no matter how many cores you add.",
                ar: "مدة الإمساك أهم من نوع القفل: 10 ms من I/O داخل قفل تحدّ ذلك المسار بنحو 100 عملية في الثانية مهما أضفت من نوى."
              }
            }
          ]
        }
      ]
    },
    {
      key: "debug",
      blocks: [
        {
          t: "ul",
          en: [
            "dotnet-counters monitor --counters System.Runtime — watch monitor-lock-contention-count; a number that climbs steadily means threads are queueing on a lock.",
            "dotnet-dump collect, then dotnet-dump analyze and the syncblk command — lists every contended lock with the thread that owns it and the threads waiting.",
            "clrstack -all inside the same dump — look for frames sitting in Monitor.Enter or SemaphoreSlim.Wait; that stack tells you which lock and which code path.",
            "dotnet-counters threadpool-queue-length — a queue that keeps growing while CPU is low means threads are blocked, not busy; classic sign of I/O under a lock.",
            "Visual Studio Parallel Stacks window while paused — draws threads grouped by call stack, and a deadlock appears as two groups each waiting inside the other's lock."
          ],
          ar: [
            "‎dotnet-counters monitor --counters System.Runtime‎ — راقب monitor-lock-contention-count؛ ارتفاعه المستمر يعني اصطفاف threads على قفل.",
            "‎dotnet-dump collect‎ ثم ‎dotnet-dump analyze‎ والأمر syncblk — يعرض كل قفل متنازع عليه مع الـ thread المالك والـ threads المنتظرة.",
            "‎clrstack -all‎ داخل نفس الـ dump — ابحث عن إطارات واقفة في ‎Monitor.Enter‎ أو ‎SemaphoreSlim.Wait‎؛ ذلك الـ stack يدلّك على القفل ومسار الكود.",
            "‎dotnet-counters‎ مع threadpool-queue-length — طابور يكبر باستمرار بينما المعالج منخفض يعني أن الـ threads معلّقة لا مشغولة؛ علامة كلاسيكية على I/O داخل قفل.",
            "نافذة Parallel Stacks في Visual Studio أثناء الإيقاف — ترسم الـ threads مجمّعة حسب الـ call stack، ويظهر الـ deadlock كمجموعتين كل منهما تنتظر داخل قفل الأخرى."
          ]
        },
        {
          t: "callout",
          kind: "tip",
          en: "If requests hang but CPU is near zero and no exception is logged, assume a deadlock or a blocked thread before you suspect the network. Take a dump while it is stuck — a restarted process tells you nothing.",
          ar: "إذا تعلّقت الـ requests بينما استهلاك المعالج قرب الصفر ولا يوجد exception مسجّل، افترض deadlock أو thread معلّق قبل أن تشك في الشبكة. خذ dump أثناء التعلّق — الـ process بعد إعادة التشغيل لا يخبرك بشيء."
        }
      ]
    },
    {
      key: "realworld",
      blocks: [
        {
          t: "p",
          en: "Locks show up wherever one process owns a piece of state that many requests touch. The pattern is almost always the same: a singleton holds a table, a counter or a connection, and the fix is either a concurrent collection, a much smaller critical section, or moving the coordination outside the process entirely.",
          ar: "تظهر الأقفال حيثما امتلك process واحد قطعة حالة تلمسها requests كثيرة. والنمط يكاد يكون واحداً دائماً: singleton يحمل جدولاً أو عدّاداً أو اتصالاً، والحل إما concurrent collection، أو critical section أصغر بكثير، أو نقل التنسيق خارج الـ process كلياً."
        },
        {
          t: "ul",
          en: [
            "API gateways and rate limiters: per-key counters updated on every request, the exact case in this lesson, usually moved to Redis once there is more than one instance.",
            "Payment and ledger services: transferring between two accounts needs both rows consistent, which is where lock-ordering deadlocks appear and why the database transaction is the better boundary.",
            "Chat and realtime platforms: a connection registry mapping user id to open sockets, read constantly and written on connect and disconnect — a textbook read-mostly map.",
            "Background job runners: a leader-election or lease flag ensuring only one worker processes a queue item, done with an in-process lock in a single-instance service and with a database lease once it scales out."
          ],
          ar: [
            "بوابات الـ API والـ rate limiters: عدّادات لكل مفتاح تُحدَّث مع كل request، وهي حالة هذا الدرس بالضبط، وتنتقل عادة إلى Redis عند وجود أكثر من نسخة.",
            "خدمات الدفع والدفاتر المحاسبية: التحويل بين حسابين يحتاج اتساق الصفّين معاً، وهنا تظهر deadlocks ترتيب الأقفال، ولهذا تكون transaction قاعدة البيانات حدّاً أفضل.",
            "منصات المحادثة والزمن الحقيقي: سجل اتصالات يربط معرّف المستخدم بالـ sockets المفتوحة، يُقرأ باستمرار ويُكتب عند الاتصال والانفصال — مثال نموذجي لخريطة القراءة فيها غالبة.",
            "مشغّلات المهام الخلفية: علامة leader election أو lease تضمن أن worker واحداً يعالج عنصر الطابور، تُنفَّذ بقفل داخل الـ process في خدمة بنسخة واحدة، وبـ lease في قاعدة البيانات عند التوسّع."
          ]
        }
      ]
    },
    {
      key: "exercises",
      blocks: [
        {
          t: "ex",
          diff: "easy",
          en: "Write a console app with a shared int field and 8 threads each incrementing it 100,000 times. Run it three times and record the results. Then add a lock and run it three times again. You are done when the unlocked version gives three different wrong numbers and the locked version gives exactly 800,000 every time.",
          ar: "اكتب console app فيه حقل int مشترك و8 threads كل منها يزيده مئة ألف مرة. شغّله ثلاث مرات وسجّل النتائج. ثم أضف lock وشغّله ثلاث مرات أخرى. تنتهي حين تعطي النسخة بلا قفل ثلاثة أرقام خاطئة مختلفة، وتعطي النسخة المقفلة 800,000 بالضبط في كل مرة."
        },
        {
          t: "ex",
          diff: "medium",
          en: "Take the same counter and implement it three ways: lock, Interlocked.Increment, and ConcurrentDictionary.AddOrUpdate. Measure all three with BenchmarkDotNet at 1, 4 and 16 threads. You are done when you can state in one sentence which one wins at each thread count and why.",
          ar: "خذ نفس العدّاد ونفّذه بثلاث طرق: lock، و‎Interlocked.Increment‎، و‎ConcurrentDictionary.AddOrUpdate‎. قِس الثلاثة بـ BenchmarkDotNet عند 1 و4 و16 thread. تنتهي حين تستطيع أن تقول في جملة واحدة أيها يفوز عند كل عدد threads ولماذا."
        },
        {
          t: "ex",
          diff: "hard",
          en: "Build a deliberate deadlock: two accounts, two locks, one method that locks source then destination and another that locks destination then source, called in a loop from two threads. When it hangs, capture a dump with dotnet-dump and use syncblk and clrstack to name both threads and both locks. Then fix it with a fixed lock order and show the loop now completes.",
          ar: "اصنع deadlock متعمّداً: حسابان، قفلان، دالة تقفل المصدر ثم الهدف وأخرى تقفل الهدف ثم المصدر، تُستدعيان في حلقة من thread-ين. عند التعلّق، خذ dump بـ dotnet-dump واستخدم syncblk و clrstack لتسمية الـ thread-ين والقفلين. ثم أصلحه بترتيب قفل ثابت وأظهر أن الحلقة تكتمل الآن."
        },
        {
          t: "ex",
          diff: "senior",
          en: "Take a read-mostly configuration object guarded by a lock on both reads and writes. Replace it with an immutable snapshot swapped by a single reference assignment on write, with readers taking no lock at all. Prove with a load test that p99 read latency drops, and write down in three lines which guarantee you gave up by doing this.",
          ar: "خذ كائن إعدادات قراءته غالبة محمياً بقفل على القراءة والكتابة معاً. استبدله بـ snapshot غير قابل للتعديل يُبدَّل بإسناد مرجع واحد عند الكتابة، بحيث لا يأخذ القرّاء أي قفل. أثبت باختبار حمل أن p99 لزمن القراءة ينخفض، واكتب في ثلاثة أسطر أي ضمان تنازلت عنه بهذا التغيير."
        }
      ]
    },
    {
      key: "refs",
      blocks: [
        {
          t: "ref",
          label: { en: "The lock statement (C# reference)", ar: "تعليمة lock (مرجع C#)" },
          url: "https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/lock",
          meta: { en: "Docs", ar: "توثيق" }
        },
        {
          t: "ref",
          label: { en: "SemaphoreSlim API reference", ar: "مرجع SemaphoreSlim" },
          url: "https://learn.microsoft.com/en-us/dotnet/api/system.threading.semaphoreslim",
          meta: { en: "Docs", ar: "توثيق" }
        },
        {
          t: "ref",
          label: { en: "ReaderWriterLockSlim API reference", ar: "مرجع ReaderWriterLockSlim" },
          url: "https://learn.microsoft.com/en-us/dotnet/api/system.threading.readerwriterlockslim",
          meta: { en: "Docs", ar: "توثيق" }
        },
        {
          t: "ref",
          label: { en: "Stephen Cleary — Don't block on async code", ar: "Stephen Cleary — لا تعلّق الـ thread على كود async" },
          url: "https://blog.stephencleary.com/2012/07/dont-block-on-async-code.html",
          meta: { en: "Article", ar: "مقال" }
        }
      ]
    }
  ],
  quiz: [
    {
      q: {
        en: "Why is counter++ on a shared field unsafe without synchronization?",
        ar: "لماذا يكون ‎counter++‎ على حقل مشترك غير آمن بدون تزامن؟"
      },
      options: [
        { en: "Because ++ is not supported on shared fields", ar: "لأن ‎++‎ غير مدعوم على الحقول المشتركة" },
        { en: "Because it is three steps — read, add, store — and another thread can run between them", ar: "لأنه ثلاث خطوات — قراءة وإضافة وكتابة — ويمكن أن يعمل thread آخر بينها" },
        { en: "Because the garbage collector may move the field", ar: "لأن الـ garbage collector قد ينقل الحقل" },
        { en: "Because int is a value type", ar: "لأن int نوع قيمة" }
      ],
      correct: 1,
      why: {
        en: "The increment is read, add in a register, store back. A thread can be paused between any two steps, so two threads can read the same old value and both write the same new one, losing an update.",
        ar: "الزيادة هي قراءة، ثم إضافة في register، ثم كتابة. يمكن إيقاف الـ thread بين أي خطوتين، فيقرأ thread-ان نفس القيمة القديمة ويكتبان نفس القيمة الجديدة، فتضيع زيادة."
      }
    },
    {
      q: {
        en: "Why can't you use await inside a lock block?",
        ar: "لماذا لا يمكنك استخدام await داخل كتلة lock؟"
      },
      options: [
        { en: "Because await allocates memory and the lock forbids allocation", ar: "لأن await يخصّص ذاكرة والـ lock يمنع التخصيص" },
        { en: "Because Monitor is thread-affine and the code after await may resume on a different thread", ar: "لأن Monitor مرتبط بالـ thread وقد يستأنف الكود بعد await على thread آخر" },
        { en: "Because the lock would be released automatically at the await", ar: "لأن القفل سيتحرر تلقائياً عند await" },
        { en: "Because async methods cannot throw inside a finally block", ar: "لأن دوال async لا تستطيع رمي exception داخل finally" }
      ],
      correct: 1,
      why: {
        en: "Monitor requires the entering thread to be the exiting thread. After an await the continuation can run on another thread-pool thread, so the compiler blocks the pattern. Use SemaphoreSlim, which counts permits and has no thread identity.",
        ar: "يشترط Monitor أن يكون الـ thread الداخل هو الخارج. وبعد await قد تعمل التتمة على thread آخر من الـ pool، لذا يمنع المترجم هذا النمط. استخدم SemaphoreSlim الذي يعدّ التصاريح ولا هوية thread له."
      }
    },
    {
      q: {
        en: "What makes lock (\"users\") dangerous?",
        ar: "ما الخطر في ‎lock (\"users\")‎؟"
      },
      options: [
        { en: "Strings are immutable so the lock never releases", ar: "النصوص immutable فلا يتحرر القفل أبداً" },
        { en: "Identical string literals are interned, so unrelated classes end up sharing one lock", ar: "النصوص الحرفية المتطابقة تُوحَّد في الذاكرة، فتتشارك أصناف لا علاقة بينها قفلاً واحداً" },
        { en: "Strings cannot be used with Monitor at all", ar: "لا يمكن استخدام النصوص مع Monitor إطلاقاً" },
        { en: "The lock will be collected by the GC while held", ar: "سيجمع الـ GC القفل أثناء إمساكه" }
      ],
      correct: 1,
      why: {
        en: "The runtime interns identical literals into one shared instance, so two unrelated components locking the same text block each other. Lock on a private readonly field instead.",
        ar: "يوحّد الـ runtime النصوص الحرفية المتطابقة في نسخة واحدة مشتركة، فيعلّق مكوّنان لا علاقة بينهما أحدهما الآخر. اقفل على private readonly field بدلاً من ذلك."
      }
    },
    {
      q: {
        en: "When does ReaderWriterLockSlim beat a plain lock?",
        ar: "متى يتفوق ReaderWriterLockSlim على lock عادي؟"
      },
      options: [
        { en: "Always, because it allows concurrent readers", ar: "دائماً، لأنه يسمح بقرّاء متزامنين" },
        { en: "When reads greatly outnumber writes and each read section is long enough to offset its higher per-acquire cost", ar: "عندما تفوق القراءات الكتابات بكثير ويكون كل قسم قراءة طويلاً بما يعوّض تكلفة الأخذ الأعلى" },
        { en: "When the protected work contains an await", ar: "عندما يحتوي العمل المحمي على await" },
        { en: "When you need re-entrancy", ar: "عندما تحتاج إعادة الدخول" }
      ],
      correct: 1,
      why: {
        en: "Each acquire costs roughly two to three times a plain lock. If the read section is a 30 nanosecond lookup, the bookkeeping costs more than the concurrency gains, so it only pays off with long, frequent reads.",
        ar: "كل عملية أخذ تكلّف نحو ضعفين إلى ثلاثة أضعاف الـ lock العادي. فإذا كان قسم القراءة بحثاً يستغرق 30 nanosecond، تكون تكلفة الإدارة أكبر من مكسب التوازي، فلا يستحق إلا مع قراءات طويلة ومتكررة."
      }
    },
    {
      q: {
        en: "Two threads deadlock on two locks. What is the standard prevention?",
        ar: "thread-ان يقعان في deadlock على قفلين. ما الوقاية القياسية؟"
      },
      options: [
        { en: "Add a timeout to every lock and retry forever", ar: "أضف timeout لكل قفل وأعد المحاولة إلى ما لا نهاية" },
        { en: "Always acquire the locks in one fixed global order in every code path", ar: "خذ الأقفال دائماً بترتيب عام ثابت واحد في كل مسارات الكود" },
        { en: "Replace both locks with SemaphoreSlim", ar: "استبدل القفلين بـ SemaphoreSlim" },
        { en: "Make the lock objects static", ar: "اجعل كائني القفل static" }
      ],
      correct: 1,
      why: {
        en: "A deadlock needs a cycle in the wait graph. A single global ordering, for example sorting by entity id, makes a cycle impossible. Timeouts only turn a hang into a retry storm, and SemaphoreSlim deadlocks the same way.",
        ar: "يحتاج الـ deadlock إلى دورة في رسم الانتظار. وترتيب عام واحد، مثل الترتيب حسب معرّف الكيان، يجعل الدورة مستحيلة. أما الـ timeouts فتحوّل التعلّق إلى عاصفة إعادة محاولة، و SemaphoreSlim يقع في نفس المشكلة."
      }
    }
  ]
};
```

NEXT: DONE
