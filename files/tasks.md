```js
const tasksLesson = {
  id: "tasks",
  moduleId: "runtime",
  title: { en: "Tasks, scheduling and cancellation", ar: "الـ tasks والجدولة والإلغاء" },
  summary: {
    en: "A Task is a receipt for work that is not finished yet — this lesson shows who actually runs that work, how a result gets attached to it, and how to stop it when nobody wants the answer any more.",
    ar: "الـ Task هو إيصال لعمل لم ينتهِ بعد — هذا الدرس يشرح من ينفّذ هذا العمل فعلياً، وكيف تُربط النتيجة به، وكيف توقفه عندما لم يعد أحد يريد الإجابة."
  },
  mins: 18,
  sections: [
    {
      key: "why",
      blocks: [
        {
          t: "p",
          en: "A Task is an object that stands for work that may not be done yet. You get the object immediately. The result arrives later. Tasks exist so your code can start slow work, hand the thread back to someone else, and be told when the answer is ready.",
          ar: "الـ Task هو object يمثّل عملاً قد لا يكون قد انتهى بعد. تحصل على الـ object فوراً، وتصل النتيجة لاحقاً. الـ Tasks موجودة حتى يستطيع كودك أن يبدأ عملاً بطيئاً، ويعيد الـ thread لغيره، ثم يُبلَّغ عندما تجهز الإجابة."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "Thread", ar: "Thread" },
              v: {
                en: "One line of execution the operating system can run on a CPU core. Each one costs about 1 MB of stack memory.",
                ar: "خط تنفيذ واحد يستطيع نظام التشغيل تشغيله على نواة CPU. كل واحد يكلّف حوالي 1 MB من ذاكرة الـ stack."
              }
            },
            {
              k: { en: "Thread pool", ar: "Thread pool" },
              v: {
                en: "A shared set of threads that .NET keeps alive and reuses, so you never pay to create a thread per piece of work.",
                ar: "مجموعة مشتركة من الـ threads يبقيها .NET حيّة ويعيد استخدامها، حتى لا تدفع ثمن إنشاء thread لكل قطعة عمل."
              }
            },
            {
              k: { en: "Task", ar: "Task" },
              v: {
                en: "An object holding a state (waiting, done, failed, cancelled), a result or an exception, and a list of things to run when it finishes.",
                ar: "object يحمل حالة (ينتظر، انتهى، فشل، أُلغي)، ونتيجة أو exception، وقائمة بما يجب تشغيله عند انتهائه."
              }
            },
            {
              k: { en: "Task<T>", ar: "Task<T>" },
              v: {
                en: "The same thing, but it also carries a value of type T when it finishes. Task alone carries no value.",
                ar: "الشيء نفسه، لكنه يحمل أيضاً قيمة من النوع T عند انتهائه. الـ Task وحده لا يحمل قيمة."
              }
            },
            {
              k: { en: "Continuation", ar: "Continuation" },
              v: {
                en: "The piece of code that should run after a Task finishes. Everything after an await becomes one.",
                ar: "قطعة الكود التي يجب أن تعمل بعد انتهاء الـ Task. كل ما يأتي بعد await يتحوّل إلى واحدة."
              }
            },
            {
              k: { en: "Scheduler", ar: "Scheduler" },
              v: {
                en: "The component that decides which thread actually runs a continuation. By default it is the thread pool.",
                ar: "المكوّن الذي يقرّر أي thread ينفّذ الـ continuation فعلياً. افتراضياً هو الـ thread pool."
              }
            },
            {
              k: { en: "CancellationToken", ar: "CancellationToken" },
              v: {
                en: "A small read-only object you pass around that answers one question: has someone asked us to stop?",
                ar: "object صغير للقراءة فقط تمرّره بين الدوال ويجيب عن سؤال واحد: هل طلب أحدهم منّا التوقف؟"
              }
            }
          ]
        },
        {
          t: "p",
          en: "Think of a coat check at a theatre. You hand over your coat and get a numbered ticket straight away. The ticket is not the coat. It is a promise that a coat can be fetched with it later. You are free to walk away and do other things. A Task is that ticket, and your thread is you: it gets to leave instead of standing at the counter.",
          ar: "تخيّل مكتب حفظ المعاطف في مسرح. تسلّم معطفك وتأخذ تذكرة مرقّمة فوراً. التذكرة ليست المعطف، بل وعد بأن المعطف يمكن استرجاعه بها لاحقاً. وأنت حر في الابتعاد وعمل أشياء أخرى. الـ Task هو تلك التذكرة، والـ thread هو أنت: يستطيع أن يغادر بدل الوقوف أمام المنضدة."
        },
        {
          t: "p",
          en: "The running example for this whole lesson is one endpoint: GET /api/reports/{id}. It calls an external pricing service over HTTP, and that service takes about 2 seconds to answer. The phone app that calls us gives up after 5 seconds. So we have two problems to solve: do not waste a thread standing still for 2 seconds, and do not keep working for 2 more seconds after the caller has already walked away.",
          ar: "المثال الجاري في هذا الدرس كله هو endpoint واحد: GET /api/reports/{id}. يستدعي pricing service خارجية عبر HTTP، وتلك الخدمة تستغرق حوالي ثانيتين للرد. وتطبيق الهاتف الذي يستدعينا يستسلم بعد 5 ثوانٍ. إذاً أمامنا مشكلتان: ألّا نهدر thread واقفاً بلا عمل لمدة ثانيتين، وألّا نكمل العمل ثانيتين إضافيتين بعد أن انصرف المتصل أصلاً."
        },
        {
          t: "callout",
          kind: "note",
          en: "A Task does not mean \"a thread is running this\". Most Tasks in a web API represent waiting for the network or the disk, and while they wait no thread is involved at all. Only Task.Run explicitly asks the thread pool to run code.",
          ar: "وجود Task لا يعني «هناك thread يشغّل هذا». معظم الـ Tasks في web API تمثّل انتظاراً للشبكة أو القرص، وأثناء الانتظار لا يوجد thread مشغول إطلاقاً. فقط Task.Run يطلب صراحةً من الـ thread pool تشغيل كود."
        }
      ]
    },
    {
      key: "problem",
      blocks: [
        {
          t: "p",
          en: "The first version of our endpoint called the pricing service and blocked on the answer with .Result. Blocking means the thread sits on that line and does nothing until the value arrives. For 2 seconds, one whole thread of the pool is parked doing zero work.",
          ar: "النسخة الأولى من الـ endpoint استدعت الـ pricing service وحجزت الـ thread على النتيجة باستخدام ‎.Result. الحجب يعني أن الـ thread يقف عند ذلك السطر ولا يفعل شيئاً حتى تصل القيمة. لمدة ثانيتين، يبقى thread كامل من الـ pool متوقفاً بلا أي عمل."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "Blocking version, 200 requests/second", ar: "النسخة الحاجبة، 200 request في الثانية" },
              v: {
                en: "Each request holds a thread for 2 s, so about 400 threads are needed at once. The pool starts with roughly one thread per CPU core and adds only about one extra thread per second, so requests queue. Measured p99 (the slowest 1 request in 100) went from 2 s to 31 s.",
                ar: "كل request يحجز thread لمدة ثانيتين، أي نحتاج حوالي 400 thread في وقت واحد. الـ pool يبدأ بحوالي thread لكل نواة CPU ويضيف thread إضافياً واحداً فقط كل ثانية تقريباً، فتتراكم الطلبات في طابور. الـ p99 المقاس (أبطأ request من كل 100) ارتفع من ثانيتين إلى 31 ثانية."
              }
            },
            {
              k: { en: "Awaiting version, same load", ar: "النسخة التي تستخدم await، نفس الحمل" },
              v: {
                en: "The thread is returned to the pool during the 2 s wait, so about 8 threads serve all 200 requests per second. p99 stayed at 2.1 s and memory dropped by roughly 390 MB of thread stacks.",
                ar: "يُعاد الـ thread إلى الـ pool أثناء الانتظار لثانيتين، فتكفي حوالي 8 threads لخدمة 200 request في الثانية. بقي الـ p99 عند 2.1 ثانية وانخفضت الذاكرة بحوالي 390 MB من stacks الـ threads."
              }
            },
            {
              k: { en: "Cancellation ignored", ar: "تجاهل الإلغاء" },
              v: {
                en: "The phone gives up at 5 s and retries. The server never hears about it and finishes the abandoned work anyway. During a slow period we measured 34% of all pricing calls being for answers nobody would read.",
                ar: "الهاتف يستسلم عند 5 ثوانٍ ويعيد المحاولة. الخادم لا يعلم بذلك ويكمل العمل المهجور على أي حال. في فترة بطء قِسنا أن 34% من كل استدعاءات الـ pricing كانت لإجابات لن يقرأها أحد."
              }
            }
          ]
        },
        {
          t: "p",
          en: "So the lesson has two halves. The first half is scheduling: who runs your code and when the thread is free. The second half is cancellation: how a caller walking away turns into your code actually stopping. Both are carried by the same Task object.",
          ar: "إذاً الدرس نصفان. النصف الأول هو الجدولة: من ينفّذ كودك ومتى يتحرّر الـ thread. النصف الثاني هو الإلغاء: كيف يتحوّل انصراف المتصل إلى توقف فعلي لكودك. والاثنان يحملهما نفس الـ Task object."
        }
      ]
    },
    {
      key: "internals",
      blocks: [
        {
          t: "p",
          en: "A Task is a normal object on the heap with three important fields: a state flag, a slot for the result or the exception, and a list of continuations. Nothing more magical than that. The state moves in one direction only: from waiting, to exactly one of completed, faulted or cancelled. Once it moves, it never changes again.",
          ar: "الـ Task هو object عادي على الـ heap فيه ثلاثة حقول مهمة: علم للحالة، وخانة للنتيجة أو الـ exception، وقائمة continuations. لا شيء سحري أكثر من ذلك. الحالة تتحرّك في اتجاه واحد فقط: من «ينتظر» إلى واحدة فقط من: انتهى، فشل، أو أُلغي. وبمجرد أن تتحرك لا تتغيّر مرة أخرى."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "Task state", ar: "حالة الـ Task" },
              v: {
                en: "WaitingForActivation, Running, RanToCompletion, Faulted or Canceled. You read it through IsCompleted, IsFaulted, IsCanceled and Status.",
                ar: "WaitingForActivation أو Running أو RanToCompletion أو Faulted أو Canceled. تقرأها عبر IsCompleted و IsFaulted و IsCanceled و Status."
              }
            },
            {
              k: { en: "Continuation list", ar: "قائمة الـ continuations" },
              v: {
                en: "Callbacks to run when the state becomes final. Usually there is exactly one: the rest of your async method.",
                ar: "callbacks تُشغَّل عندما تصبح الحالة نهائية. عادة توجد واحدة فقط: بقية الـ async method خاصتك."
              }
            },
            {
              k: { en: "TaskCompletionSource<T>", ar: "TaskCompletionSource<T>" },
              v: {
                en: "A remote control for a Task you create by hand. It gives you a Task plus SetResult, SetException and SetCanceled to finish it later from any code.",
                ar: "جهاز تحكّم عن بُعد لـ Task تنشئه بنفسك. يعطيك Task مع SetResult و SetException و SetCanceled لإنهائه لاحقاً من أي كود."
              }
            },
            {
              k: { en: "TaskScheduler", ar: "TaskScheduler" },
              v: {
                en: "Decides which thread runs a continuation. TaskScheduler.Default hands it to the thread pool; UI apps have one that forces the UI thread.",
                ar: "يقرّر أي thread ينفّذ الـ continuation. الـ TaskScheduler.Default يسلّمه للـ thread pool؛ وتطبيقات الواجهة لديها scheduler يفرض thread الواجهة."
              }
            },
            {
              k: { en: "SynchronizationContext", ar: "SynchronizationContext" },
              v: {
                en: "An older mechanism that says \"resume on my special thread\". ASP.NET Core has none, which is why continuations there just go to the pool.",
                ar: "آلية أقدم تقول «استأنف على thread الخاص بي». ASP.NET Core لا يملك واحداً، ولهذا تذهب الـ continuations فيه إلى الـ pool مباشرة."
              }
            }
          ]
        },
        {
          t: "p",
          en: "Now trace one call to our endpoint, step by step. The request arrives on a pool thread. Your method runs normally until the await. SendAsync starts a network write and returns a Task that is still in the waiting state. The compiler has already rewritten the rest of your method into a state machine — a small struct holding your local variables plus a number saying which step you are on. That state machine is registered as the Task's continuation. Your method then returns, and the pool thread is free to serve another request. It is not sleeping, not blocked, just gone.",
          ar: "الآن تابع استدعاءً واحداً لـ endpoint خطوة بخطوة. يصل الـ request على thread من الـ pool. تعمل دالتك بشكل عادي حتى الـ await. يبدأ SendAsync كتابة على الشبكة ويعيد Task ما زال في حالة الانتظار. المترجم كان قد أعاد كتابة بقية دالتك على شكل state machine — struct صغير يحمل المتغيرات المحلية ورقماً يقول عند أي خطوة أنت. يُسجَّل هذا الـ state machine كـ continuation للـ Task. ثم تعود دالتك، ويتحرّر thread الـ pool ليخدم request آخر. هو ليس نائماً ولا محجوزاً، بل انصرف."
        },
        {
          t: "p",
          en: "Two seconds later the network card receives the reply. The operating system signals .NET's I/O completion mechanism, a pool thread picks up that notification, and it calls SetResult on the Task. Setting the result flips the state to completed and then runs the continuation list. Your state machine wakes up on whatever pool thread happened to do that, jumps to the step number it saved, and carries on with your local variables intact. This is the whole trick: no thread waited, and yet the code reads top to bottom.",
          ar: "بعد ثانيتين تستقبل كرت الشبكة الرد. يُبلّغ نظام التشغيل آلية إتمام الـ I/O في .NET، فيلتقط أحد threads الـ pool ذلك الإشعار ويستدعي SetResult على الـ Task. ضبط النتيجة يقلب الحالة إلى «انتهى» ثم يشغّل قائمة الـ continuations. يستيقظ الـ state machine خاصتك على أي thread من الـ pool صادف أنه قام بذلك، ويقفز إلى رقم الخطوة المحفوظ، ويكمل ومتغيراتك المحلية سليمة. هذه هي الحيلة كلها: لا thread انتظر، ومع ذلك يُقرأ الكود من أعلى إلى أسفل."
        },
        {
          t: "code",
          lang: "csharp",
          label: { en: "The endpoint, and the Task it produces", ar: "الـ endpoint والـ Task الذي ينتجه" },
          code: "// Each pool thread has its own small queue of work plus access to a shared\n// global queue. Idle threads steal work from busy threads' queues. You never\n// control this directly - you only control whether you hold a thread or not.\n\napp.MapGet(\"/api/reports/{id}\", async (int id, PricingClient pricing, CancellationToken ct) =>\n{\n    // ct is filled in by ASP.NET Core. It is cancelled when the client disconnects.\n    var prices = await pricing.GetPricesAsync(id, ct);   // thread is released here\n    return Results.Ok(Report.From(prices));              // resumed on some pool thread\n});\n\n// What the await is really doing, written out by hand:\nvar task = pricing.GetPricesAsync(id, ct);\nif (task.IsCompleted)\n{\n    // Fast path: the answer was already cached, so no thread is ever released.\n    var prices = task.Result;\n}\nelse\n{\n    // Slow path: register \"the rest of this method\" as a continuation and return.\n    task.GetAwaiter().OnCompleted(RestOfTheMethod);\n}"
        },
        {
          t: "p",
          en: "Cancellation is deliberately simple, and it is cooperative — meaning nothing is forcibly killed, the running code has to agree to stop. A CancellationTokenSource owns a boolean and a list of callbacks. Calling Cancel() sets the boolean to true and fires the callbacks. A CancellationToken is just a read-only handle on that same object, cheap to copy and pass around. Code that wants to be stoppable checks the boolean, or registers a callback. If nobody checks, nothing stops.",
          ar: "الإلغاء بسيط عن قصد، وهو تعاوني — أي لا شيء يُقتل قسراً، بل يجب أن يوافق الكود العامل على التوقف. الـ CancellationTokenSource يملك قيمة boolean وقائمة callbacks. استدعاء Cancel() يجعل الـ boolean يساوي true ويُطلق الـ callbacks. والـ CancellationToken مجرّد مقبض للقراءة فقط على نفس الـ object، رخيص النسخ والتمرير. الكود الذي يريد أن يكون قابلاً للإيقاف يفحص الـ boolean أو يسجّل callback. وإذا لم يفحص أحد، لا يتوقف شيء."
        },
        {
          t: "code",
          lang: "csharp",
          label: { en: "Cancellation, and building a Task by hand", ar: "الإلغاء، وبناء Task يدوياً" },
          code: "// 1. Cooperative checking inside a loop you own.\nforeach (var sku in skus)\n{\n    ct.ThrowIfCancellationRequested();   // throws OperationCanceledException if Cancel() was called\n    await PriceOneAsync(sku, ct);        // and pass it down, always\n}\n\n// 2. Adding your own deadline on top of the caller's cancellation.\nusing var timeout = CancellationTokenSource.CreateLinkedTokenSource(ct);\ntimeout.CancelAfter(TimeSpan.FromSeconds(3));\n// timeout.Token is cancelled if EITHER the client disconnects OR 3 seconds pass.\nvar prices = await pricing.GetPricesAsync(id, timeout.Token);\n\n// 3. TaskCompletionSource: turn a callback-based API into an awaitable Task.\nTask<Quote> WaitForQuoteAsync(string id, CancellationToken ct)\n{\n    // RunContinuationsAsynchronously stops the continuation from running on the\n    // library's own callback thread, which can otherwise deadlock that library.\n    var tcs = new TaskCompletionSource<Quote>(TaskCreationOptions.RunContinuationsAsynchronously);\n\n    _bus.OnQuote(id, quote => tcs.TrySetResult(quote));\n    ct.Register(() => tcs.TrySetCanceled(ct));   // cancel the Task when the token fires\n\n    return tcs.Task;\n}"
        },
        {
          t: "p",
          en: "One last mechanism, because it explains a lot of production pain. The thread pool grows slowly on purpose: after its initial threads are busy it injects roughly one new thread per second. That is fine when threads are released quickly, and terrible when they are blocked, because demand grows in milliseconds while supply grows in seconds. That gap is exactly what the 31-second p99 in the problem section was.",
          ar: "آلية أخيرة، لأنها تفسّر كثيراً من الألم في الإنتاج. الـ thread pool ينمو ببطء عن قصد: بعد انشغال threads البداية يضيف تقريباً thread واحداً جديداً كل ثانية. هذا مقبول عندما تتحرّر الـ threads بسرعة، وكارثي عندما تكون محجوزة، لأن الطلب ينمو بالمللي ثانية بينما العرض ينمو بالثواني. هذه الفجوة هي بالضبط سبب الـ p99 البالغ 31 ثانية في قسم المشكلة."
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
              "One thread can serve many waiting requests, so memory and thread count stay small.",
              "Cancellation travels through the whole call chain as one small value.",
              "TaskCompletionSource lets any callback-based library become awaitable.",
              "Failures arrive as normal exceptions at the await, not as callback spaghetti."
            ],
            ar: [
              "thread واحد يخدم طلبات كثيرة منتظرة، فتبقى الذاكرة وعدد الـ threads صغيرة.",
              "الإلغاء ينتقل عبر سلسلة الاستدعاء كلها كقيمة صغيرة واحدة.",
              "الـ TaskCompletionSource يجعل أي مكتبة قائمة على callbacks قابلة للـ await.",
              "الأخطاء تصل كـ exceptions عادية عند الـ await، لا كفوضى callbacks."
            ]
          },
          cons: {
            en: [
              "Every await allocates a state machine on the heap when it actually suspends.",
              "Stack traces get shorter and harder to read across await points.",
              "One blocking call anywhere in the chain can starve the whole pool.",
              "Cancellation only works if every layer passes the token down."
            ],
            ar: [
              "كل await يخصّص state machine على الـ heap عندما يتوقف فعلياً.",
              "الـ stack traces تصبح أقصر وأصعب قراءة عبر نقاط الـ await.",
              "استدعاء حاجب واحد في أي مكان بالسلسلة يمكن أن يجوّع الـ pool كله.",
              "الإلغاء لا يعمل إلا إذا مرّرت كل طبقة الـ token للأسفل."
            ]
          },
          limits: {
            en: [
              "Cancellation is cooperative: a CPU loop that never checks the token cannot be stopped.",
              "Cancelling an HTTP call does not undo work the other service already did.",
              "Task.Run does not make CPU work faster; it only moves it to another pool thread.",
              "A Task holds its result in memory until nothing references it any more."
            ],
            ar: [
              "الإلغاء تعاوني: حلقة CPU لا تفحص الـ token أبداً لا يمكن إيقافها.",
              "إلغاء استدعاء HTTP لا يلغي العمل الذي نفّذته الخدمة الأخرى فعلاً.",
              "الـ Task.Run لا يجعل عمل الـ CPU أسرع؛ بل ينقله فقط إلى thread آخر من الـ pool.",
              "الـ Task يحتفظ بنتيجته في الذاكرة حتى لا يبقى أي مرجع إليه."
            ]
          },
          alts: {
            en: [
              "ValueTask<T> for hot paths that usually complete synchronously, to avoid the allocation.",
              "IAsyncEnumerable<T> when results stream in one by one instead of arriving all at once.",
              "Channel<T> for producer/consumer pipelines inside one process.",
              "A background queue plus a status endpoint when work outlives any single request."
            ],
            ar: [
              "الـ ValueTask<T> للمسارات الساخنة التي تنتهي عادة بشكل متزامن، لتفادي التخصيص.",
              "الـ IAsyncEnumerable<T> عندما تصل النتائج واحدة تلو الأخرى بدل وصولها دفعة واحدة.",
              "الـ Channel<T> لخطوط منتِج/مستهلك داخل نفس الـ process.",
              "طابور في الخلفية مع endpoint للحالة عندما يمتد العمل لما بعد أي request واحد."
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
          title: { en: "Calling .Result or .Wait() to \"just get the value\"", ar: "استدعاء ‎.Result أو ‎.Wait() «فقط للحصول على القيمة»" },
          body: {
            en: "A controller could not be made async quickly, so someone wrote pricing.GetPricesAsync(id).Result. Each call parked a pool thread for 2 seconds. Under a marketing push the API stopped answering entirely for 40 seconds at a time: every pool thread was parked on .Result, so no thread was left to handle the network replies that would have unparked them. On top of that, .Result wraps any failure in an AggregateException, so the real error was buried one level down and the alerts said nothing useful.",
            ar: "لم يكن من السهل تحويل controller إلى async بسرعة، فكتب أحدهم pricing.GetPricesAsync(id).Result. كل استدعاء حجز thread من الـ pool لثانيتين. وأثناء حملة تسويقية توقفت الـ API عن الرد تماماً لفترات 40 ثانية: كل threads الـ pool كانت محجوزة على ‎.Result، فلم يبقَ thread يعالج ردود الشبكة التي كانت ستحرّرها. إضافة لذلك، ‎.Result يغلّف أي فشل داخل AggregateException، فدُفن الخطأ الحقيقي طبقة للأسفل ولم تقل التنبيهات شيئاً مفيداً."
          },
          fix: "// Make the whole chain async instead. If you truly cannot, at least\n// use GetAwaiter().GetResult() so the original exception is not wrapped.\nvar prices = await pricing.GetPricesAsync(id, ct);"
        },
        {
          t: "mistake",
          title: { en: "Accepting a CancellationToken and not passing it on", ar: "استقبال CancellationToken وعدم تمريره" },
          body: {
            en: "The endpoint signature had a CancellationToken ct, so the team believed cancellation worked. But the repository called _db.ToListAsync() with no token, and the HTTP client call had none either. When the phone app gave up at 5 seconds, the server kept the database query and the pricing call running to the end. During an incident, 34% of pricing calls were for abandoned requests, and those wasted calls were themselves part of why the service was slow.",
            ar: "كان توقيع الـ endpoint يحتوي CancellationToken ct، فاعتقد الفريق أن الإلغاء يعمل. لكن الـ repository استدعى ‎_db.ToListAsync() بدون token، واستدعاء HTTP client أيضاً بلا token. وعندما استسلم تطبيق الهاتف عند 5 ثوانٍ، أكمل الخادم استعلام قاعدة البيانات واستدعاء الـ pricing حتى النهاية. خلال حادثة، كانت 34% من استدعاءات الـ pricing لطلبات مهجورة، وهذه الاستدعاءات المهدورة كانت هي نفسها جزءاً من سبب بطء الخدمة."
          },
          fix: "// A token that is not passed down is decoration. Pass it everywhere.\nvar rows = await _db.Prices.Where(p => p.ReportId == id).ToListAsync(ct);\nvar reply = await _http.GetAsync(url, ct);"
        },
        {
          t: "mistake",
          title: { en: "Wrapping synchronous work in Task.Run to look async", ar: "تغليف عمل متزامن داخل Task.Run ليبدو async" },
          body: {
            en: "A reviewer asked for an async version, so the author wrote await Task.Run(() => BuildReport(id)). In a web API this makes things worse, not better. The request thread is released, but a second pool thread is immediately taken to do the same CPU work, plus the cost of queueing and switching. Throughput dropped about 8% and the flame graph showed more time in the scheduler than before. Task.Run belongs in desktop and mobile apps, where its job is to get work off the UI thread.",
            ar: "طلب المراجع نسخة async، فكتب المؤلف await Task.Run(() => BuildReport(id)). في web API هذا يزيد الأمر سوءاً لا تحسّناً. يتحرّر thread الـ request، لكن يُؤخذ فوراً thread ثانٍ من الـ pool لتنفيذ نفس عمل الـ CPU، مع تكلفة الطابور وتبديل السياق. انخفض الـ throughput حوالي 8% وأظهر الـ flame graph وقتاً في الـ scheduler أكثر من السابق. مكان Task.Run هو تطبيقات سطح المكتب والموبايل، حيث مهمته إبعاد العمل عن thread الواجهة."
          }
        },
        {
          t: "mistake",
          title: { en: "Starting a Task and never awaiting it", ar: "بدء Task وعدم انتظاره أبداً" },
          body: {
            en: "Someone wanted to send an audit event without slowing the response, so they wrote _ = _audit.SendAsync(evt); and moved on. Two things went wrong. Failures inside that Task were never observed, so a broken audit endpoint stayed invisible for three weeks. And when the app shut down during a deploy, in-flight audit calls were killed mid-way, losing about 1,200 events per deployment. The same bug in async void form is worse: an exception there is thrown on the pool thread and crashes the process.",
            ar: "أراد أحدهم إرسال audit event دون إبطاء الرد، فكتب ‎_ = _audit.SendAsync(evt); وتابع. حدث خطآن. الأخطاء داخل ذلك الـ Task لم تُلاحَظ أبداً، فبقي audit endpoint معطّل غير مرئي ثلاثة أسابيع. وعندما أُغلق التطبيق أثناء deploy، قُتلت استدعاءات الـ audit الجارية في منتصفها وضاع حوالي 1,200 event لكل deployment. ونفس الخطأ بصيغة async void أسوأ: الـ exception هناك يُرمى على thread الـ pool ويُسقط الـ process."
          },
          fix: "// Hand it to a component that owns its lifetime and logs its failures.\n_auditQueue.Enqueue(evt);   // a Channel<T> drained by a BackgroundService"
        }
      ]
    },
    {
      key: "interview",
      blocks: [
        {
          t: "qa",
          level: "junior",
          q: { en: "What is a Task, in your own words?", ar: "ما هو الـ Task، بكلماتك؟" },
          a: {
            en: "It is an object that represents work that might not be finished yet. You get it back immediately, and it carries the state of that work — still running, finished with a value, failed with an exception, or cancelled. Task<T> is the same thing but it also carries a result of type T. The key thing people get wrong is assuming a Task means a thread is running. For network or disk work, nothing is running: the Task is just waiting to be told the answer arrived.",
            ar: "هو object يمثّل عملاً قد لا يكون انتهى بعد. تستلمه فوراً، وهو يحمل حالة ذلك العمل — ما زال يعمل، أو انتهى بقيمة، أو فشل بـ exception، أو أُلغي. والـ Task<T> نفس الشيء لكنه يحمل أيضاً نتيجة من النوع T. أكثر خطأ شائع هو افتراض أن وجود Task يعني وجود thread يعمل. في عمل الشبكة أو القرص لا شيء يعمل: الـ Task ينتظر فقط إشعاراً بوصول الإجابة."
          }
        },
        {
          t: "qa",
          level: "mid",
          q: { en: "Which thread runs the code after an await?", ar: "أي thread ينفّذ الكود بعد الـ await؟" },
          a: {
            en: "In ASP.NET Core, whichever thread pool thread is free at that moment — it is usually not the one you started on, and that is fine, because ASP.NET Core has no special request thread. In a desktop or mobile app there is a SynchronizationContext that forces the resume back onto the UI thread, so you can touch controls. That difference is also why ConfigureAwait(false) matters in a shared library: it says \"do not bother going back to the special thread\", which avoids a deadlock if the caller ever blocks on your Task.",
            ar: "في ASP.NET Core، أي thread متاح من الـ thread pool في تلك اللحظة — وغالباً ليس الذي بدأت عليه، وهذا مقبول لأن ASP.NET Core لا يملك thread خاصاً للـ request. أما في تطبيق سطح مكتب أو موبايل فهناك SynchronizationContext يفرض العودة إلى thread الواجهة حتى تستطيع لمس عناصر الواجهة. هذا الفرق هو أيضاً سبب أهمية ConfigureAwait(false) في مكتبة مشتركة: يقول «لا تعد إلى الـ thread الخاص»، وهذا يتفادى deadlock إذا حجب المستدعي على الـ Task خاصتك."
          }
        },
        {
          t: "qa",
          level: "mid",
          q: { en: "What does CancellationToken actually do?", ar: "ماذا يفعل الـ CancellationToken فعلياً؟" },
          a: {
            en: "Almost nothing on its own. It is a read-only view over a boolean plus a callback list owned by a CancellationTokenSource. When someone calls Cancel, the boolean flips and the callbacks fire. Your code stops only because it checks that boolean — usually through ThrowIfCancellationRequested, or because a library like HttpClient registered a callback that aborts the socket. If you accept a token and never pass it down, cancellation silently does nothing, and that is the single most common bug in this area.",
            ar: "لا شيء تقريباً بمفرده. هو عرض للقراءة فقط على قيمة boolean وقائمة callbacks يملكها CancellationTokenSource. عندما يستدعي أحدهم Cancel، تنقلب الـ boolean وتُطلق الـ callbacks. وكودك يتوقف فقط لأنه يفحص تلك الـ boolean — عادة عبر ThrowIfCancellationRequested، أو لأن مكتبة مثل HttpClient سجّلت callback يقطع الـ socket. وإذا استقبلت token ولم تمرّره للأسفل، فالإلغاء لا يفعل شيئاً بصمت، وهذا أشهر خطأ في هذا الموضوع."
          }
        },
        {
          t: "qa",
          level: "senior",
          q: { en: "Why does blocking on .Result hurt more than the 2 seconds it costs?", ar: "لماذا يضر الحجب على ‎.Result أكثر من الثانيتين التي يكلّفها؟" },
          a: {
            en: "Because you are not spending 2 seconds of your own time, you are spending 2 seconds of a shared resource. The thread pool starts with about one thread per core and then adds roughly one thread per second. Load can double in a millisecond; the pool cannot. So blocked threads pile up faster than new ones appear, and the queue of waiting requests grows without limit. Worse, the threads that would complete the pending I/O are themselves blocked, so the system can stall completely. We saw p99 go from 2 seconds to 31 — and the fix was deleting one .Result.",
            ar: "لأنك لا تنفق ثانيتين من وقتك، بل ثانيتين من مورد مشترك. الـ thread pool يبدأ بحوالي thread لكل نواة ثم يضيف تقريباً thread كل ثانية. الحمل قد يتضاعف خلال مللي ثانية، والـ pool لا يستطيع. فتتراكم الـ threads المحجوبة أسرع من ظهور جديدة، وينمو طابور الطلبات بلا حد. والأسوأ أن الـ threads التي كانت ستُكمل عمليات الـ I/O المعلّقة هي نفسها محجوبة، فيتجمّد النظام كلياً. رأينا الـ p99 ينتقل من ثانيتين إلى 31 — وكان الإصلاح حذف ‎.Result واحد."
          }
        },
        {
          t: "qa",
          level: "senior",
          q: { en: "When would you reach for TaskCompletionSource?", ar: "متى تلجأ إلى TaskCompletionSource؟" },
          a: {
            en: "When the thing you are waiting for is not a Task yet. Say a message bus calls you back with a quote at some unknown later time. You create a TaskCompletionSource, return its Task to the caller, and call TrySetResult from inside the callback when the message arrives. I always create it with RunContinuationsAsynchronously, otherwise the caller's continuation runs on the bus library's own callback thread, which can deadlock that library or slow its dispatch loop. And I register the cancellation token so the Task can be cancelled instead of hanging forever.",
            ar: "عندما لا يكون الشيء الذي تنتظره Task أصلاً. مثلاً message bus يستدعيك برد سعر في وقت لاحق غير معروف. تنشئ TaskCompletionSource وتعيد الـ Task خاصته للمستدعي، وتستدعي TrySetResult من داخل الـ callback عند وصول الرسالة. أنا أنشئه دائماً بـ RunContinuationsAsynchronously، وإلا فإن continuation المستدعي سيعمل على thread الـ callback الخاص بمكتبة الـ bus، وهذا قد يسبب deadlock لها أو يبطّئ حلقة التوزيع فيها. وأسجّل الـ cancellation token حتى يمكن إلغاء الـ Task بدل تعليقه للأبد."
          }
        },
        {
          t: "qa",
          level: "staff",
          q: { en: "How do you stop blocking calls from creeping back into a large codebase?", ar: "كيف تمنع الاستدعاءات الحاجبة من التسلل مجدداً إلى قاعدة كود كبيرة؟" },
          a: {
            en: "You make it structural rather than a rule people remember. Turn on the Microsoft.VisualStudio.Threading analyzers so .Result and .Wait() fail the build, not the review. Require a CancellationToken parameter on every public async method in the internal API guidelines, and add a small architecture test that fails when one is missing. Put thread pool queue length and thread count on the main dashboard, because a rising queue with idle CPU is the signature of blocking and nothing else looks like it. Then run one blameless review of the incident it caused, so the team connects the rule to a real outage they remember.",
            ar: "تجعل الأمر بنيوياً بدل أن يكون قاعدة يتذكّرها الناس. فعّل محلّلات Microsoft.VisualStudio.Threading حتى يُسقط ‎.Result و ‎.Wait() الـ build لا المراجعة. اشترط في إرشادات الـ API الداخلية وجود parameter من نوع CancellationToken في كل async method عامة، وأضف architecture test صغيراً يفشل عند غيابه. ضع طول طابور الـ thread pool وعدد الـ threads على اللوحة الرئيسية، لأن طابوراً يتصاعد مع CPU خامل هو بصمة الحجب ولا شيء آخر يشبهها. ثم أجرِ مراجعة واحدة بلا لوم للحادثة التي سبّبها، ليربط الفريق القاعدة بانقطاع حقيقي يتذكّره."
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
          title: { en: "Blocking inside a constructor to load configuration", ar: "الحجب داخل constructor لتحميل الإعدادات" },
          bad: "public class PricingClient\n{\n    private readonly Settings _settings;\n\n    public PricingClient(ISettingsStore store)\n    {\n        // Blocks a pool thread every time the DI container builds this object.\n        _settings = store.LoadAsync().GetAwaiter().GetResult();\n    }\n}",
          good: "public class PricingClient\n{\n    private readonly ISettingsStore _store;\n    public PricingClient(ISettingsStore store) => _store = store;\n\n    public async Task<Quote[]> GetPricesAsync(int id, CancellationToken ct)\n    {\n        var settings = await _store.LoadAsync(ct);   // no blocking, and cancellable\n        ...\n    }\n}\n\n// Or load it once at startup, before traffic arrives:\n// builder.Services.AddSingleton(await SettingsStore.LoadAsync());",
          why: {
            en: "Constructors cannot be async, so people block in them. If this class is registered as scoped, every single request blocks a pool thread while building it — the cost is paid before your endpoint code even starts. The fix is either to move the load into the async method, or to do it once during startup where blocking is harmless because no requests are being served yet.",
            ar: "الـ constructors لا يمكن أن تكون async، فيلجأ الناس للحجب داخلها. وإذا سُجّل هذا الصنف كـ scoped فإن كل request يحجب thread من الـ pool أثناء بنائه — والتكلفة تُدفع قبل أن يبدأ كود الـ endpoint أصلاً. الحل إما نقل التحميل إلى الـ async method، أو تنفيذه مرة واحدة عند الإقلاع حيث الحجب غير ضار لأنه لا توجد طلبات تُخدَم بعد."
          }
        },
        {
          t: "review",
          severity: "medium",
          title: { en: "Task.WhenAll without a shared deadline", ar: "Task.WhenAll بدون مهلة مشتركة" },
          bad: "var tasks = warehouseIds.Select(w => _stock.CheckAsync(w, ct));\nvar results = await Task.WhenAll(tasks);\n// If one warehouse hangs, this waits for it forever - even though the other\n// nine answered in 80 ms. And if two fail, WhenAll surfaces only the first\n// exception when you await it.",
          good: "using var deadline = CancellationTokenSource.CreateLinkedTokenSource(ct);\ndeadline.CancelAfter(TimeSpan.FromSeconds(2));\n\nvar all = Task.WhenAll(warehouseIds.Select(w => _stock.CheckAsync(w, deadline.Token)));\ntry\n{\n    var results = await all;\n}\ncatch (Exception)\n{\n    // all.Exception is an AggregateException holding every failure, not just one.\n    foreach (var e in all.Exception!.InnerExceptions) _log.LogWarning(e, \"warehouse check failed\");\n    throw;\n}",
          why: {
            en: "Task.WhenAll finishes only when the slowest task finishes, so your latency is the worst member of the group. A linked token source with CancelAfter gives the whole group one shared deadline. The second point is about errors: awaiting WhenAll rethrows only the first exception, so if you want to log all of them you read Task.Exception.InnerExceptions from the Task object itself.",
            ar: "الـ Task.WhenAll ينتهي فقط عندما تنتهي أبطأ task، فيصبح زمنك هو زمن أسوأ عضو في المجموعة. واستخدام linked token source مع CancelAfter يعطي المجموعة كلها مهلة مشتركة واحدة. والنقطة الثانية عن الأخطاء: عمل await على WhenAll يعيد رمي أول exception فقط، فإذا أردت تسجيلها كلها اقرأ Task.Exception.InnerExceptions من الـ Task نفسه."
          }
        }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        {
          t: "p",
          en: "In a real system, Tasks and cancellation are how a deadline travels. A request arrives with a budget — say 5 seconds, because that is when the phone gives up. Every hop must know that budget and shrink it: the gateway keeps 5 s, our report service takes 4.5 s, the pricing call gets 3 s, the database query gets 2 s. A linked CancellationTokenSource at each hop is the mechanism that carries this. Without it, a slow dependency spreads: work piles up at every layer for answers nobody will ever read.",
          ar: "في نظام حقيقي، الـ Tasks والإلغاء هما الطريقة التي تنتقل بها المهلة. يصل الـ request ومعه ميزانية زمنية — مثلاً 5 ثوانٍ لأن الهاتف يستسلم عندها. وكل قفزة يجب أن تعرف تلك الميزانية وتقلّصها: الـ gateway يبقي 5 ثوانٍ، وخدمة التقارير تأخذ 4.5، واستدعاء الـ pricing يأخذ 3، واستعلام قاعدة البيانات يأخذ 2. والـ linked CancellationTokenSource عند كل قفزة هو الآلية التي تحمل ذلك. وبدونه تنتشر بطء التبعية: يتراكم العمل في كل طبقة من أجل إجابات لن يقرأها أحد."
        },
        {
          t: "ul",
          en: [
            "ASP.NET Core gives you HttpContext.RequestAborted, a token that fires when the client's connection drops — bind it as a CancellationToken parameter and pass it everywhere.",
            "Work that must survive the request (sending an email, writing an audit record) does not belong on the request's token; put it on a queue that a BackgroundService drains.",
            "IHostApplicationLifetime.ApplicationStopping is a token too: use it so background loops exit cleanly during a deploy instead of being killed.",
            "A cancelled request is not an error. Catch OperationCanceledException at the edge and record it as a separate outcome, or your error rate graph will lie during every slow period.",
            "Cancelling a write call is risky: the other service may have already applied it. Pair cancellation with idempotency keys so a retry cannot double-charge."
          ],
          ar: [
            "يوفّر ASP.NET Core الخاصية HttpContext.RequestAborted، وهي token يُطلق عند انقطاع اتصال العميل — اربطه كـ parameter من نوع CancellationToken ومرّره في كل مكان.",
            "العمل الذي يجب أن يستمر بعد الـ request (إرسال بريد، كتابة سجل audit) لا مكان له على token الـ request؛ ضعه في طابور يفرغه BackgroundService.",
            "الـ IHostApplicationLifetime.ApplicationStopping هو token أيضاً: استخدمه لتخرج حلقات الخلفية بشكل نظيف أثناء الـ deploy بدل أن تُقتل.",
            "الـ request الملغى ليس خطأ. التقط OperationCanceledException عند الحافة وسجّله كنتيجة منفصلة، وإلا فسيكذب رسم معدّل الأخطاء في كل فترة بطء.",
            "إلغاء استدعاء كتابة محفوف بالمخاطر: قد تكون الخدمة الأخرى طبّقته فعلاً. اقرن الإلغاء بمفاتيح idempotency حتى لا تسبّب إعادة المحاولة خصماً مزدوجاً."
          ]
        },
        {
          t: "callout",
          kind: "warn",
          en: "Do not use the request's CancellationToken for the part of an operation that must complete. If you pass it to the code that writes the payment record, a client that hangs up mid-request can leave you with money taken and no record of it.",
          ar: "لا تستخدم CancellationToken الخاص بالـ request في الجزء الذي يجب أن يكتمل من العملية. إذا مرّرته للكود الذي يكتب سجل الدفع، فإن عميلاً يقطع الاتصال في منتصف الـ request قد يتركك وقد أُخذ المال دون أي سجل له."
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
              k: { en: "Memory", ar: "الذاكرة" },
              v: {
                en: "A blocked thread costs about 1 MB of stack. A suspended async method costs roughly 100-200 bytes of state machine. That is the 390 MB we saved by removing the blocking call.",
                ar: "الـ thread المحجوب يكلّف حوالي 1 MB من الـ stack. والـ async method المعلّقة تكلّف تقريباً 100-200 بايت من الـ state machine. هذا هو الفرق البالغ 390 MB الذي وفّرناه بإزالة الاستدعاء الحاجب."
              }
            },
            {
              k: { en: "CPU", ar: "الـ CPU" },
              v: {
                en: "An await that completes synchronously costs a few nanoseconds and allocates nothing. One that suspends costs roughly 100-300 ns plus one allocation. Both are irrelevant next to a 2 ms network call — so never avoid await to save CPU.",
                ar: "الـ await الذي ينتهي بشكل متزامن يكلّف بضع نانوثوانٍ ولا يخصّص شيئاً. والذي يتوقف يكلّف تقريباً 100-300 نانوثانية مع تخصيص واحد. وكلاهما لا يُذكر أمام استدعاء شبكة يستغرق 2 مللي ثانية — فلا تتجنب await لتوفير CPU."
              }
            },
            {
              k: { en: "Scalability", ar: "قابلية التوسّع" },
              v: {
                en: "With blocking, concurrent requests are capped by thread count. Without it, they are capped by sockets and memory — thousands instead of hundreds on the same machine.",
                ar: "مع الحجب، يُحدَّد عدد الطلبات المتزامنة بعدد الـ threads. وبدونه يُحدَّد بعدد الـ sockets والذاكرة — آلاف بدل مئات على نفس الجهاز."
              }
            },
            {
              k: { en: "Latency", ar: "زمن الاستجابة" },
              v: {
                en: "Thread pool starvation shows up as high p99 with low CPU: requests are not slow to compute, they are slow to start. Watch queue length, not CPU.",
                ar: "تجويع الـ thread pool يظهر كـ p99 مرتفع مع CPU منخفض: الطلبات ليست بطيئة في الحساب، بل بطيئة في البدء. راقب طول الطابور لا الـ CPU."
              }
            },
            {
              k: { en: "Network", ar: "الشبكة" },
              v: {
                en: "Cancelling an HttpClient call aborts the socket, which frees a connection from the pool immediately. That is why deadlines improve throughput, not just tidiness.",
                ar: "إلغاء استدعاء HttpClient يقطع الـ socket، مما يحرّر اتصالاً من الـ pool فوراً. لهذا تُحسّن المهل الـ throughput، لا مجرد الترتيب."
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
            "dotnet-counters monitor --process-id <pid> System.Runtime — watch ThreadPool Thread Count and ThreadPool Queue Length. A queue that keeps growing while CPU stays under 30% means threads are blocked, not busy.",
            "dotnet-dump collect then dumpasync in dotnet-dump analyze — lists every suspended async state machine and what it is waiting on. This is how you find the one call that never returns.",
            "dotnet-stack report --process-id <pid> — prints every thread's stack. If dozens of threads all sit on GetResult or Monitor.Wait, you are looking at blocking, and the frame above it names the guilty method.",
            "TaskScheduler.UnobservedTaskException — hook it at startup and log. It fires for fire-and-forget Tasks whose failures nobody looked at, which is exactly the audit bug above.",
            "In logs, count OperationCanceledException separately from real errors. A sudden rise means clients are timing out on you, which is an early warning before the error rate moves."
          ],
          ar: [
            "dotnet-counters monitor --process-id <pid> System.Runtime — راقب ThreadPool Thread Count و ThreadPool Queue Length. طابور يتصاعد باستمرار مع بقاء الـ CPU تحت 30% يعني أن الـ threads محجوبة لا مشغولة.",
            "dotnet-dump collect ثم dumpasync داخل dotnet-dump analyze — يعرض كل async state machine معلّقة وما تنتظره. هكذا تجد الاستدعاء الوحيد الذي لا يعود أبداً.",
            "dotnet-stack report --process-id <pid> — يطبع stack كل thread. إذا كانت عشرات الـ threads كلها عند GetResult أو Monitor.Wait فأنت أمام حجب، والإطار الذي فوقه يسمّي الدالة المسؤولة.",
            "TaskScheduler.UnobservedTaskException — اربطه عند الإقلاع وسجّل. يُطلق للـ Tasks من نوع fire-and-forget التي لم ينظر أحد في أخطائها، وهو بالضبط خطأ الـ audit أعلاه.",
            "في السجلات، عُدّ OperationCanceledException بشكل منفصل عن الأخطاء الحقيقية. ارتفاعه المفاجئ يعني أن العملاء تنتهي مهلهم عندك، وهو إنذار مبكر قبل تحرّك معدّل الأخطاء."
          ]
        },
        {
          t: "callout",
          kind: "tip",
          en: "Reproduce starvation on purpose before you need to recognise it. Call ThreadPool.SetMaxThreads to a small number on a test instance, send load through a blocking endpoint, and watch the counters. Once you have seen the shape — flat CPU, rising queue, rising p99 — you will identify it in production in under a minute.",
          ar: "أعِد إنتاج التجويع عمداً قبل أن تحتاج إلى التعرّف عليه. استدعِ ThreadPool.SetMaxThreads برقم صغير على نسخة اختبار، أرسل حملاً عبر endpoint حاجب، وراقب العدّادات. وبمجرد أن ترى الشكل — CPU ثابت، طابور يتصاعد، p99 يتصاعد — ستتعرّف عليه في الإنتاج في أقل من دقيقة."
        }
      ]
    },
    {
      key: "realworld",
      blocks: [
        {
          t: "p",
          en: "Any backend that talks to something slower than itself lives on this mechanism. The pattern is always the same shape: a request arrives with a deadline, work fans out to dependencies, results are gathered, and anything still running when the deadline passes is cancelled so the capacity goes to requests that can still be answered.",
          ar: "أي backend يتحدّث إلى شيء أبطأ منه يعيش على هذه الآلية. والنمط دائماً بنفس الشكل: يصل request ومعه مهلة، يتوزّع العمل على التبعيات، تُجمع النتائج، وكل ما يزال يعمل بعد انقضاء المهلة يُلغى لتذهب الطاقة إلى طلبات ما زال يمكن الرد عليها."
        },
        {
          t: "ul",
          en: [
            "Travel search sites query many airline APIs at once with Task.WhenAll under one 3-second deadline, and show whatever answered in time.",
            "Chat and notification platforms hold tens of thousands of open connections per machine; each one is a suspended Task, not a thread, which is the only reason the numbers work.",
            "E-commerce checkout deliberately excludes the payment write from the request's cancellation token, so a customer closing the tab cannot create a charge with no order.",
            "Data export tools run long jobs on a background queue and return a job id immediately, because no HTTP request should be held open for a 20-minute report."
          ],
          ar: [
            "مواقع البحث عن الرحلات تستعلم من عدة APIs لشركات طيران في وقت واحد عبر Task.WhenAll تحت مهلة واحدة 3 ثوانٍ، وتعرض ما وصل في الوقت المحدد.",
            "منصات المحادثة والإشعارات تحتفظ بعشرات آلاف الاتصالات المفتوحة لكل جهاز؛ كل اتصال هو Task معلّق لا thread، وهذا هو السبب الوحيد لنجاح الأرقام.",
            "صفحات الدفع في التجارة الإلكترونية تستثني عمداً كتابة الدفع من token إلغاء الـ request، حتى لا ينشئ إغلاق العميل للتبويب خصماً بلا طلب.",
            "أدوات تصدير البيانات تشغّل المهام الطويلة على طابور خلفي وتعيد job id فوراً، لأنه لا يجوز إبقاء request مفتوحاً لتقرير يستغرق 20 دقيقة."
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
          en: "Write an endpoint that awaits Task.Delay(10_000, ct) and returns 200. Call it, then close the client after 1 second. Log inside a catch for OperationCanceledException. You got it right when the log line appears about 1 second in, not 10.",
          ar: "اكتب endpoint ينتظر Task.Delay(10_000, ct) ويعيد 200. استدعه ثم أغلق العميل بعد ثانية. سجّل داخل catch لـ OperationCanceledException. تكون قد نجحت عندما يظهر سطر السجل بعد ثانية تقريباً لا بعد 10."
        },
        {
          t: "ex",
          diff: "medium",
          en: "Build two endpoints that call the same 2-second fake service: one with .Result and one with await. Send 200 concurrent requests at each and record p99 plus ThreadPool Thread Count from dotnet-counters. You got it right when the blocking one shows a thread count climbing by about one per second and a p99 many times larger.",
          ar: "ابنِ endpointين يستدعيان نفس الخدمة الوهمية ذات الثانيتين: واحد بـ ‎.Result وآخر بـ await. أرسل 200 request متزامن لكل منهما وسجّل الـ p99 مع ThreadPool Thread Count من dotnet-counters. تكون قد نجحت عندما يُظهر الحاجب عدد threads يتسلّق بحوالي واحد في الثانية و p99 أكبر بأضعاف."
        },
        {
          t: "ex",
          diff: "hard",
          en: "Wrap a callback-based API in a Task using TaskCompletionSource. Support cancellation through ct.Register and make sure the registration is disposed when the Task finishes, so a long-lived token does not leak callbacks. Prove it with a test that cancels before the callback fires and asserts TaskCanceledException, and a memory check showing the callback list does not grow over 10,000 calls.",
          ar: "غلّف API قائمة على callbacks داخل Task باستخدام TaskCompletionSource. ادعم الإلغاء عبر ct.Register واحرص على التخلص من التسجيل عند انتهاء الـ Task، حتى لا يسرّب token طويل العمر قائمة callbacks. أثبت ذلك باختبار يُلغي قبل إطلاق الـ callback ويتحقق من TaskCanceledException، وبفحص ذاكرة يُظهر أن قائمة الـ callbacks لا تنمو عبر 10,000 استدعاء."
        },
        {
          t: "ex",
          diff: "senior",
          en: "Implement an end-to-end deadline budget across three layers: an endpoint with a 5-second budget, a service that reserves 4 s for itself, and a client call limited to 2.5 s, all with linked token sources. Add a metric for cancelled requests. You got it right when slowing the dependency to 10 s produces cancellations at 2.5 s, no thread growth, and a clean 504 response instead of a 500.",
          ar: "نفّذ ميزانية مهلة من الطرف إلى الطرف عبر ثلاث طبقات: endpoint بميزانية 5 ثوانٍ، وservice يحجز 4 ثوانٍ لنفسه، واستدعاء client محدود بـ 2.5 ثانية، كلها بـ linked token sources. أضف مقياساً للطلبات الملغاة. تكون قد نجحت عندما يؤدي إبطاء التبعية إلى 10 ثوانٍ إلى إلغاءات عند 2.5 ثانية، بلا نمو في الـ threads، وبرد 504 نظيف بدل 500."
        }
      ]
    },
    {
      key: "refs",
      blocks: [
        {
          t: "ref",
          label: { en: "Task-based Asynchronous Pattern (TAP)", ar: "نمط Task-based Asynchronous Pattern" },
          url: "https://learn.microsoft.com/en-us/dotnet/standard/asynchronous-programming-patterns/task-based-asynchronous-pattern-tap",
          meta: { en: "Docs", ar: "توثيق" }
        },
        {
          t: "ref",
          label: { en: "Cancellation in managed threads", ar: "الإلغاء في الـ managed threads" },
          url: "https://learn.microsoft.com/en-us/dotnet/standard/threading/cancellation-in-managed-threads",
          meta: { en: "Docs", ar: "توثيق" }
        },
        {
          t: "ref",
          label: { en: "How async/await really works in C#", ar: "كيف يعمل async/await فعلياً في C#" },
          url: "https://devblogs.microsoft.com/dotnet/how-async-await-really-works/",
          meta: { en: "Article", ar: "مقال" }
        },
        {
          t: "ref",
          label: { en: "Stephen Cleary — Don't block on async code", ar: "Stephen Cleary — لا تحجب على كود async" },
          url: "https://blog.stephencleary.com/2012/07/dont-block-on-async-code.html",
          meta: { en: "Article", ar: "مقال" }
        }
      ]
    }
  ],
  quiz: [
    {
      q: {
        en: "In ASP.NET Core, what happens to the request's thread when your code hits an await on a network call?",
        ar: "في ASP.NET Core، ماذا يحدث لـ thread الـ request عندما يصل كودك إلى await على استدعاء شبكة؟"
      },
      options: [
        { en: "It sleeps until the reply arrives, then continues.", ar: "ينام حتى يصل الرد ثم يكمل." },
        { en: "It returns to the thread pool and can serve other requests.", ar: "يعود إلى الـ thread pool ويستطيع خدمة طلبات أخرى." },
        { en: "It is destroyed and a brand new thread is created later.", ar: "يُدمَّر ويُنشأ thread جديد تماماً لاحقاً." },
        { en: "It is pinned to the socket until the response is fully read.", ar: "يُثبَّت على الـ socket حتى تُقرأ الاستجابة بالكامل." }
      ],
      correct: 1,
      why: {
        en: "The rest of the method is registered as a continuation on the Task and the thread is released to the pool. When the reply arrives, the continuation runs on whatever pool thread is free.",
        ar: "تُسجَّل بقية الدالة كـ continuation على الـ Task ويُعاد الـ thread إلى الـ pool. وعند وصول الرد يعمل الـ continuation على أي thread متاح من الـ pool."
      }
    },
    {
      q: {
        en: "A method takes a CancellationToken but never passes it to the database or HTTP calls inside it. What is the effect?",
        ar: "دالة تستقبل CancellationToken لكنها لا تمرّره لاستدعاءات قاعدة البيانات أو HTTP داخلها. ما الأثر؟"
      },
      options: [
        { en: "Cancellation still works, because the runtime propagates tokens automatically.", ar: "الإلغاء يعمل مع ذلك، لأن الـ runtime ينشر الـ tokens تلقائياً." },
        { en: "The method throws an exception at startup for an unused parameter.", ar: "ترمي الدالة exception عند الإقلاع بسبب parameter غير مستخدم." },
        { en: "Nothing is cancelled; the work runs to completion after the caller has gone.", ar: "لا شيء يُلغى؛ يكتمل العمل بعد انصراف المتصل." },
        { en: "The token cancels the method but not its caller.", ar: "يُلغي الـ token الدالة لكن ليس مستدعيها." }
      ],
      correct: 2,
      why: {
        en: "Cancellation is cooperative and there is no automatic propagation. A token that is not checked and not passed down changes nothing at all.",
        ar: "الإلغاء تعاوني ولا يوجد انتشار تلقائي. الـ token الذي لا يُفحص ولا يُمرَّر للأسفل لا يغيّر شيئاً إطلاقاً."
      }
    },
    {
      q: {
        en: "You see p99 latency of 25 seconds while CPU sits at 20% and the thread pool queue keeps growing. What is the most likely cause?",
        ar: "ترى p99 يبلغ 25 ثانية بينما الـ CPU عند 20% وطابور الـ thread pool يتصاعد. ما السبب الأرجح؟"
      },
      options: [
        { en: "The garbage collector is pausing the application.", ar: "الـ garbage collector يوقف التطبيق مؤقتاً." },
        { en: "Threads are blocked on synchronous waits, so the pool cannot keep up.", ar: "الـ threads محجوبة على انتظارات متزامنة، فلا يستطيع الـ pool المجاراة." },
        { en: "The database is missing an index.", ar: "قاعدة البيانات تفتقد index." },
        { en: "Too many objects are being allocated on the heap.", ar: "يجري تخصيص عدد كبير جداً من الـ objects على الـ heap." }
      ],
      correct: 1,
      why: {
        en: "Idle CPU with a growing queue is the signature of thread pool starvation: work is waiting to start, not slow to compute. The pool adds only about one thread per second, so blocked threads accumulate.",
        ar: "CPU خامل مع طابور متصاعد هو بصمة تجويع الـ thread pool: العمل ينتظر البدء لا أنه بطيء الحساب. والـ pool يضيف حوالي thread واحد في الثانية، فتتراكم الـ threads المحجوبة."
      }
    },
    {
      q: {
        en: "What is the main reason to create a TaskCompletionSource with RunContinuationsAsynchronously?",
        ar: "ما السبب الرئيسي لإنشاء TaskCompletionSource بخيار RunContinuationsAsynchronously؟"
      },
      options: [
        { en: "It makes the Task complete faster.", ar: "يجعل الـ Task ينتهي أسرع." },
        { en: "It stops the awaiting code from running on the thread that called SetResult.", ar: "يمنع الكود المنتظِر من العمل على الـ thread الذي استدعى SetResult." },
        { en: "It enables cancellation support on the Task.", ar: "يفعّل دعم الإلغاء على الـ Task." },
        { en: "It allows the Task to be completed more than once.", ar: "يسمح بإنهاء الـ Task أكثر من مرة." }
      ],
      correct: 1,
      why: {
        en: "By default the continuation runs inline on whichever thread completed the Task — often a library's own callback thread. Hijacking that thread can deadlock the library or stall its dispatch loop.",
        ar: "افتراضياً يعمل الـ continuation مباشرة على الـ thread الذي أنهى الـ Task — وغالباً يكون thread callback خاصاً بمكتبة. واختطاف ذلك الـ thread قد يسبب deadlock للمكتبة أو يعطّل حلقة التوزيع فيها."
      }
    },
    {
      q: {
        en: "Which piece of work should NOT be tied to the incoming request's CancellationToken?",
        ar: "أي عمل يجب ألّا يُربط بـ CancellationToken الخاص بالـ request الوارد؟"
      },
      options: [
        { en: "A read query that builds the response body.", ar: "استعلام قراءة يبني جسم الاستجابة." },
        { en: "An HTTP call to a pricing service for display data.", ar: "استدعاء HTTP لخدمة تسعير لبيانات العرض." },
        { en: "Writing the payment record after the card has been charged.", ar: "كتابة سجل الدفع بعد خصم المبلغ من البطاقة." },
        { en: "A cache lookup before the main query.", ar: "بحث في الـ cache قبل الاستعلام الرئيسي." }
      ],
      correct: 2,
      why: {
        en: "If the client hangs up mid-request, cancelling the write can leave money taken with no record of it. Work that must complete gets its own token, or none at all, and is usually moved to a durable queue.",
        ar: "إذا قطع العميل الاتصال في منتصف الـ request، فإن إلغاء الكتابة قد يترك المال مخصوماً بلا سجل له. العمل الذي يجب أن يكتمل يأخذ token خاصاً به أو لا يأخذ أياً، ويُنقل عادة إلى طابور دائم."
      }
    }
  ]
};
```

NEXT: sync-primitives
