```js
const diLifetimesLesson = {
  id: "di-lifetimes",
  moduleId: "di",
  title: { en: "Singleton, scoped, transient", ar: "Singleton و Scoped و Transient" },
  summary: {
    en: "A lifetime is the rule that decides how long one object lives and who shares it — pick it wrong and you get leaks, crashes, or data from another user's request.",
    ar: "الـ lifetime هو القاعدة التي تحدد كم يعيش الكائن ومن يشاركه — واختيارها الخطأ يسبب تسريب ذاكرة أو أخطاء وقت التشغيل أو ظهور بيانات مستخدم في request مستخدم آخر."
  },
  mins: 16,
  sections: [
    {
      key: "why",
      blocks: [
        {
          t: "p",
          en: "When you register a class with a DI container, you also tell it one thing: how long each object of that class should live, and who is allowed to share it. That rule is called the lifetime. ASP.NET Core gives you three: singleton (one object for the whole application), scoped (one object per HTTP request), and transient (a brand new object every single time someone asks).",
          ar: "عندما تسجّل class في الـ DI container فأنت تحدّد شيئاً واحداً إضافياً: كم يعيش الكائن، ومن يُسمح له بمشاركته. هذه القاعدة اسمها lifetime. يعطيك ASP.NET Core ثلاثة خيارات: singleton (كائن واحد لكل التطبيق)، و scoped (كائن واحد لكل HTTP request)، و transient (كائن جديد في كل مرة يُطلب فيها)."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "DI container", ar: "DI container" },
              v: {
                en: "The object that builds your classes for you. You tell it 'when someone needs IPriceService, give them PriceService', and it wires the whole object graph.",
                ar: "الكائن الذي يبني classes نيابة عنك. تخبره: عندما يحتاج أحد IPriceService أعطه PriceService، وهو يركّب شجرة الكائنات كاملة."
              }
            },
            {
              k: { en: "Registration", ar: "Registration" },
              v: {
                en: "One line like services.AddScoped<IPriceService, PriceService>() that records the service type, the implementation type and the lifetime.",
                ar: "سطر مثل services.AddScoped<IPriceService, PriceService>() يسجّل نوع الخدمة ونوع التنفيذ والـ lifetime."
              }
            },
            {
              k: { en: "Resolve", ar: "Resolve" },
              v: {
                en: "Asking the container for an object. Either the framework does it for you (constructor injection) or you call provider.GetRequiredService<T>() by hand.",
                ar: "طلب كائن من الـ container. إمّا أن يفعلها الـ framework نيابة عنك (constructor injection) أو تناديها يدوياً عبر provider.GetRequiredService<T>()."
              }
            },
            {
              k: { en: "Scope", ar: "Scope" },
              v: {
                en: "A short-lived box the container opens, hands out objects into, then closes and disposes. In a web app the framework opens one scope per HTTP request.",
                ar: "صندوق قصير العمر يفتحه الـ container، يضع فيه الكائنات، ثم يغلقه ويستدعي Dispose عليها. في تطبيق ويب يفتح الـ framework scope واحداً لكل HTTP request."
              }
            },
            {
              k: { en: "Root provider", ar: "Root provider" },
              v: {
                en: "The one top-level container that lives as long as the app. Singletons are stored here, so they are never disposed until shutdown.",
                ar: "الـ container الجذري الوحيد الذي يعيش بعمر التطبيق. الـ singletons تُخزَّن فيه، لذلك لا يُستدعى Dispose عليها إلا عند إغلاق التطبيق."
              }
            },
            {
              k: { en: "Thread safety", ar: "Thread safety" },
              v: {
                en: "A class is thread-safe if two requests running at the same moment can call it without corrupting its data. Singletons need this; scoped objects usually do not.",
                ar: "الـ class يكون thread-safe إذا استطاع requestان يعملان في نفس اللحظة استدعاءه دون إفساد بياناته. الـ singletons تحتاج هذا، والكائنات الـ scoped غالباً لا."
              }
            }
          ]
        },
        {
          t: "p",
          en: "Think of a coffee shop. The espresso machine is bought once and every barista uses the same one all day — that is a singleton. When a customer orders, the shop puts a tray on the counter and everything for that customer goes on that tray until they leave — that is scoped. A paper napkin is pulled fresh for every drink and thrown away — that is transient. The tray exists because things belonging to one customer must not mix with another customer's things. That is exactly why scoped exists in a web server.",
          ar: "تخيّل مقهى. ماكينة الإسبريسو تُشترى مرة واحدة ويستخدمها كل الباريستا طوال اليوم — هذا singleton. عندما يطلب زبون، يوضع له صينية على الطاولة ويوضع كل ما يخصّه عليها حتى يغادر — هذا scoped. المنديل الورقي يُسحب جديداً مع كل مشروب ثم يُرمى — هذا transient. الصينية موجودة لأن أغراض زبون يجب ألّا تختلط بأغراض زبون آخر. وهذا بالضبط سبب وجود scoped في خادم ويب."
        },
        {
          t: "p",
          en: "The reason this matters is that a web server handles many requests at the same time, on many threads. Our running example through this lesson is one endpoint: POST /orders. It uses an OrderService, which needs an AppDbContext to write the order, an IExchangeRateCache to convert currency, and an ICurrentUser to know who is ordering. Those three want three different lifetimes, and picking the wrong one for any of them produces a bug that only appears under real traffic.",
          ar: "أهمية هذا تأتي من أن خادم الويب يعالج requests كثيرة في نفس الوقت وعلى threads متعددة. المثال الذي سنستخدمه في الدرس كله هو endpoint واحد: POST /orders. يستعمل OrderService الذي يحتاج AppDbContext لكتابة الطلب، و IExchangeRateCache لتحويل العملة، و ICurrentUser لمعرفة صاحب الطلب. هذه الثلاثة تريد ثلاثة lifetimes مختلفة، واختيار الخطأ لأي منها ينتج bug لا يظهر إلا تحت حمل حقيقي."
        },
        {
          t: "callout",
          kind: "note",
          en: "Lifetime is a property of the registration, not of the class. The same class can be registered as a singleton in one app and as scoped in another. Nothing in the class file tells you which — you must read Program.cs.",
          ar: "الـ lifetime خاصية للـ registration وليست خاصية للـ class. نفس الـ class يمكن تسجيله singleton في تطبيق و scoped في تطبيق آخر. لا شيء في ملف الـ class يخبرك بذلك — يجب أن تقرأ Program.cs."
        }
      ]
    },
    {
      key: "problem",
      blocks: [
        {
          t: "p",
          en: "Here is the concrete failure. A team registered AppDbContext as a singleton because it looked expensive to create and they wanted to save time. AppDbContext is Entity Framework Core's database session object; it holds a list of the entities it has loaded and the changes you made to them. In development, one developer clicked through the app one page at a time and everything worked. In production, two customers posted an order in the same 30 milliseconds, both requests used the same AppDbContext instance, and the app started throwing 'A second operation was started on this context before a previous operation completed'.",
          ar: "إليك الفشل بشكل ملموس. فريق سجّل AppDbContext كـ singleton لأن إنشاءه بدا مكلفاً وأرادوا توفير الوقت. الـ AppDbContext هو كائن جلسة قاعدة البيانات في Entity Framework Core؛ يحتفظ بقائمة الـ entities التي حمّلها والتعديلات التي أجريتها عليها. في بيئة التطوير كان مطوّر واحد يتنقّل بين الصفحات واحدة تلو الأخرى فعمل كل شيء. في الإنتاج أرسل زبونان طلبين خلال نفس الـ 30 ميلي ثانية، فاستخدم الـ requestان نفس نسخة AppDbContext، وبدأ التطبيق يرمي: A second operation was started on this context before a previous operation completed."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "Before — AddSingleton<AppDbContext>()", ar: "قبل — AddSingleton<AppDbContext>()" },
              v: {
                en: "One shared database session for the whole app. Under 200 requests per second the error rate on POST /orders was 4% — meaning 4 out of every 100 orders failed with a 500. Memory grew by about 900 MB over 6 hours because every entity ever loaded stayed tracked in that one context and was never released.",
                ar: "جلسة قاعدة بيانات واحدة مشتركة للتطبيق كله. عند 200 request في الثانية كانت نسبة الأخطاء على POST /orders تساوي 4% — أي أن 4 من كل 100 طلب فشلت بـ 500. ونمت الذاكرة نحو 900 ميغابايت خلال 6 ساعات لأن كل entity حُمّل بقي متتبَّعاً في ذلك الـ context ولم يُحرَّر أبداً."
              }
            },
            {
              k: { en: "After — AddDbContext<AppDbContext>() (scoped)", ar: "بعد — AddDbContext<AppDbContext>() (scoped)" },
              v: {
                en: "One database session per HTTP request, disposed when the request ends. Error rate on POST /orders dropped to 0.02% — the normal background rate from real database timeouts. Memory settled flat at about 400 MB. Median response time rose by 0.4 ms, the cost of creating one context per request.",
                ar: "جلسة قاعدة بيانات واحدة لكل HTTP request، يُستدعى Dispose عليها عند انتهاء الـ request. انخفضت نسبة الأخطاء على POST /orders إلى 0.02% — وهي النسبة الطبيعية الناتجة عن timeouts حقيقية في قاعدة البيانات. واستقرّت الذاكرة عند نحو 400 ميغابايت. وارتفع زمن الاستجابة الوسيط بمقدار 0.4 ميلي ثانية، وهي تكلفة إنشاء context واحد لكل request."
              }
            }
          ]
        },
        {
          t: "p",
          en: "Notice the shape of the bug. Nothing was wrong with the code of OrderService or AppDbContext. The bug lived in one word in Program.cs. This is what makes lifetimes worth learning properly: the mistake is invisible in the class you are reading, it survives every unit test, and it only shows up when two requests overlap in time.",
          ar: "لاحظ شكل الـ bug. لا خطأ في كود OrderService ولا في AppDbContext. الـ bug كان في كلمة واحدة داخل Program.cs. وهذا ما يجعل تعلّم الـ lifetimes بشكل صحيح مهماً: الخطأ غير مرئي في الـ class الذي تقرأه، وينجو من كل unit test، ولا يظهر إلا عندما يتداخل requestان في الزمن."
        }
      ]
    },
    {
      key: "internals",
      blocks: [
        {
          t: "p",
          en: "The container is, at heart, a list plus two dictionaries. The list is built at startup: every services.AddX() call appends one ServiceDescriptor, a small record holding the service type, how to create it, and the lifetime. When you call builder.Build(), that list is frozen into a ServiceProvider. From then on nothing new can be registered — resolution only reads.",
          ar: "الـ container في جوهره قائمة ومعها dictionary اثنان. القائمة تُبنى عند الإقلاع: كل استدعاء services.AddX() يضيف ServiceDescriptor واحداً، وهو سجل صغير يحمل نوع الخدمة وطريقة إنشائه والـ lifetime. وعندما تنادي builder.Build() تتجمّد القائمة داخل ServiceProvider. بعد ذلك لا يمكن تسجيل شيء جديد — عملية الـ resolution تقرأ فقط."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "ServiceDescriptor", ar: "ServiceDescriptor" },
              v: { en: "One registration: service type, implementation type or factory, and lifetime. The whole container is a list of these.", ar: "تسجيل واحد: نوع الخدمة، ونوع التنفيذ أو الـ factory، والـ lifetime. الـ container كله قائمة من هذه." }
            },
            {
              k: { en: "Root ServiceProvider", ar: "Root ServiceProvider" },
              v: { en: "Created by Build(). Holds the singleton cache — a dictionary from descriptor to the one instance — and lives until shutdown.", ar: "يُنشأ عبر Build(). يحمل الـ cache الخاص بالـ singletons — dictionary من الـ descriptor إلى النسخة الوحيدة — ويعيش حتى إغلاق التطبيق." }
            },
            {
              k: { en: "IServiceScopeFactory", ar: "IServiceScopeFactory" },
              v: { en: "The object that opens a new scope. ASP.NET Core calls it once per HTTP request; you call it yourself inside background jobs.", ar: "الكائن الذي يفتح scope جديداً. ينادي عليه ASP.NET Core مرة لكل HTTP request، وتناديه أنت بنفسك داخل الـ background jobs." }
            },
            {
              k: { en: "Scope's ResolvedServices", ar: "ResolvedServices داخل الـ scope" },
              v: { en: "A dictionary inside each scope holding the scoped instances already created for it. Second request for the same type returns the same object.", ar: "dictionary داخل كل scope يحمل النسخ الـ scoped التي أُنشئت له. الطلب الثاني لنفس النوع يعيد نفس الكائن." }
            },
            {
              k: { en: "Disposables list", ar: "قائمة الـ Disposables" },
              v: { en: "Each scope also keeps a plain list of every object it created that implements IDisposable, so it can dispose them when the scope closes.", ar: "كل scope يحتفظ أيضاً بقائمة عادية بكل كائن أنشأه ويطبّق IDisposable، ليستدعي Dispose عليها عند إغلاق الـ scope." }
            }
          ]
        },
        {
          t: "p",
          en: "Now trace one POST /orders from the top. A request arrives. Very early in the pipeline, ASP.NET Core calls IServiceScopeFactory.CreateScope() and stores the resulting scope on HttpContext.RequestServices — the container that belongs to this request only. Routing picks your endpoint, and the framework asks that scope for OrderService. The scope reads OrderService's constructor and sees it needs three things, so it resolves each one by its own rule. AppDbContext is scoped: the scope checks its ResolvedServices dictionary, finds nothing, creates one, stores it, and hands it back. IExchangeRateCache is a singleton: the scope does not create it, it forwards the request up to the root provider, which returns the one instance created earlier. ICurrentUser is transient: a new object is made, handed over, and not cached anywhere.",
          ar: "لنتتبّع الآن request واحداً على POST /orders من البداية. يصل الـ request. في وقت مبكر جداً من الـ pipeline ينادي ASP.NET Core على IServiceScopeFactory.CreateScope() ويضع الـ scope الناتج في HttpContext.RequestServices — وهو الـ container الخاص بهذا الـ request وحده. يختار الـ routing الـ endpoint، ثم يطلب الـ framework من ذلك الـ scope كائن OrderService. يقرأ الـ scope الـ constructor فيجد أنه يحتاج ثلاثة أشياء، فيحلّ كلاً منها بقاعدته الخاصة. الـ AppDbContext هو scoped: يبحث الـ scope في dictionary الخاص به فلا يجد شيئاً، فينشئ واحداً ويخزّنه ويعيده. والـ IExchangeRateCache هو singleton: لا ينشئه الـ scope بل يمرّر الطلب إلى الـ root provider الذي يعيد النسخة الوحيدة المُنشأة سابقاً. والـ ICurrentUser هو transient: يُنشأ كائن جديد ويُسلَّم ولا يُخزَّن في أي مكان."
        },
        {
          t: "p",
          en: "The scope is like a locker at a swimming pool. You are given one locker for your visit. Anything you put in it is yours and nobody else can reach it. The pool's water filter, on the other hand, is shared by everyone in the building — you never get your own. When you leave, an attendant empties your locker completely. That emptying is the important part: when the response is written, ASP.NET Core disposes the scope, which walks its disposables list in reverse creation order and calls Dispose (or DisposeAsync) on each one. Your AppDbContext closes its database connection there. Singletons are not in that list — they are in the root provider's list and are only disposed when the whole application shuts down.",
          ar: "الـ scope يشبه خزانة في مسبح. تُعطى خزانة واحدة لزيارتك. كل ما تضعه فيها ملكك ولا يصل إليه أحد غيرك. أمّا فلتر مياه المسبح فيشترك فيه الجميع — لا تحصل على نسخة خاصة منه. وعندما تغادر، يفرّغ الموظف خزانتك بالكامل. هذا التفريغ هو الجزء المهم: عند كتابة الـ response يستدعي ASP.NET Core التخلّص من الـ scope، فيمرّ على قائمة الـ disposables بترتيب عكسي للإنشاء وينادي Dispose (أو DisposeAsync) على كل عنصر. وهناك يغلق الـ AppDbContext اتصاله بقاعدة البيانات. الـ singletons ليست في تلك القائمة — هي في قائمة الـ root provider ولا يُستدعى Dispose عليها إلا عند إغلاق التطبيق كله."
        },
        {
          t: "code",
          lang: "csharp",
          label: { en: "The three lifetimes on the running example", ar: "الـ lifetimes الثلاثة على المثال الجاري" },
          code: "// Program.cs — the only place lifetimes are decided\n\n// Singleton: created once, shared by every request, MUST be thread-safe.\n// Holds currency rates refreshed in the background; no per-user data inside.\nbuilder.Services.AddSingleton<IExchangeRateCache, ExchangeRateCache>();\n\n// Scoped: one per HTTP request. AddDbContext registers scoped by default.\n// Not thread-safe, and it must be disposed when the request ends.\nbuilder.Services.AddDbContext<AppDbContext>(o =>\n    o.UseSqlServer(builder.Configuration.GetConnectionString(\"Orders\")));\n\n// Scoped: everything in one request must see the same order state.\nbuilder.Services.AddScoped<IOrderService, OrderService>();\n\n// Transient: cheap, stateless, no fields worth sharing.\nbuilder.Services.AddTransient<ICurrentUser, HttpContextCurrentUser>();\n\n// Turn on the safety net (see the callout below).\nbuilder.Host.UseDefaultServiceProvider(o =>\n{\n    o.ValidateScopes = true;      // fail if a singleton captures a scoped service\n    o.ValidateOnBuild = true;     // fail at startup, not on the first request\n});"
        },
        {
          t: "p",
          en: "One detail surprises people: transient does not mean 'not tracked'. If a transient object implements IDisposable, the scope that created it still adds it to the disposables list and holds a reference until the scope closes. Resolve a disposable transient in a loop from a long-lived scope and you build a list that only grows. That is a real memory leak with the word 'transient' printed on it.",
          ar: "تفصيل يفاجئ الكثيرين: transient لا تعني أن الكائن غير متتبَّع. إذا كان الكائن الـ transient يطبّق IDisposable فإن الـ scope الذي أنشأه يضيفه إلى قائمة الـ disposables ويحتفظ بمرجع له حتى يُغلق الـ scope. إذا استخرجت كائناً transient قابلاً للتخلّص داخل حلقة من scope طويل العمر فأنت تبني قائمة تكبر ولا تصغر. وهذا تسريب ذاكرة حقيقي مكتوب عليه كلمة transient."
        },
        {
          t: "callout",
          kind: "tip",
          en: "ValidateScopes and ValidateOnBuild are on by default only in the Development environment. Turn them on explicitly for every environment. ValidateOnBuild moves the failure from 'first request in production at 2 a.m.' to 'the app refuses to start during deployment', which is the failure you want.",
          ar: "خياران ValidateScopes و ValidateOnBuild مفعّلان افتراضياً في بيئة Development فقط. فعّلهما صراحة في كل البيئات. الخيار ValidateOnBuild ينقل الفشل من «أول request في الإنتاج الساعة الثانية فجراً» إلى «التطبيق يرفض الإقلاع أثناء النشر»، وهو الفشل الذي تريده."
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
              "Singleton: created once, so expensive setup (HTTP connection pools, parsed config, in-memory caches) is paid a single time.",
              "Scoped: gives every request its own copy, so one user's data can never leak into another user's response.",
              "Scoped: the container disposes it for you at the end of the request, so connections and files close on their own.",
              "Transient: no shared state at all, so it is the one lifetime that can never surprise you with cross-request bugs."
            ],
            ar: [
              "Singleton: يُنشأ مرة واحدة، فتُدفع تكلفة الإعداد المرتفعة (HTTP connection pools، قراءة الإعدادات، الـ caches في الذاكرة) مرة واحدة فقط.",
              "Scoped: يعطي كل request نسخته الخاصة، فلا يمكن أبداً أن تتسرّب بيانات مستخدم إلى response مستخدم آخر.",
              "Scoped: الـ container ينادي Dispose عليه في نهاية الـ request، فتُغلق الاتصالات والملفات تلقائياً.",
              "Transient: لا حالة مشتركة إطلاقاً، فهو الـ lifetime الوحيد الذي لا يفاجئك بأخطاء تعبر بين الـ requests."
            ]
          },
          cons: {
            en: [
              "Singleton: every field inside it is touched by many threads at once, so you must make it thread-safe yourself.",
              "Singleton: anything it holds is held for the life of the app — a forgotten dictionary becomes a permanent memory leak.",
              "Scoped: unusable directly from a background worker, which has no HTTP request and therefore no scope.",
              "Transient: allocating a new object per injection point adds garbage collection pressure in hot code paths."
            ],
            ar: [
              "Singleton: كل حقل داخله تلمسه threads كثيرة في نفس الوقت، فعليك أنت جعله thread-safe.",
              "Singleton: كل ما يحتفظ به يبقى محفوظاً بعمر التطبيق — dictionary منسي يتحوّل إلى تسريب ذاكرة دائم.",
              "Scoped: لا يمكن استخدامه مباشرة من background worker لأنه بلا HTTP request وبالتالي بلا scope.",
              "Transient: إنشاء كائن جديد عند كل نقطة حقن يزيد الضغط على الـ garbage collector في المسارات الساخنة."
            ]
          },
          limits: {
            en: [
              "A singleton may only depend on other singletons; depending on a scoped service is the captive dependency bug.",
              "A transient injected into a singleton is created once and then lives forever — the word transient buys you nothing there.",
              "The built-in container has no per-thread or per-session lifetime; only these three exist.",
              "A disposable transient is still held by its scope until that scope closes, so it is not free of lifetime concerns."
            ],
            ar: [
              "الـ singleton يجوز أن يعتمد على singletons فقط؛ واعتماده على خدمة scoped هو bug الـ captive dependency.",
              "الـ transient المحقون داخل singleton يُنشأ مرة واحدة ثم يعيش للأبد — كلمة transient لا تفيدك هناك بشيء.",
              "الـ container المدمج لا يملك lifetime لكل thread أو لكل session؛ الثلاثة هذه فقط موجودة.",
              "الـ transient القابل للتخلّص يبقى محفوظاً في scope حتى يُغلق، فهو ليس خالياً من هموم الـ lifetime."
            ]
          },
          alts: {
            en: [
              "Inject IServiceScopeFactory into a singleton and open a short scope per unit of work — the standard fix for background jobs.",
              "Use a factory delegate (Func<T>) or a typed factory so the singleton creates the short-lived object on demand.",
              "Use IHttpClientFactory instead of a singleton HttpClient so socket and DNS handling are managed for you.",
              "Third-party containers such as Autofac add extra lifetimes (per matching scope, per thread) if you truly need them."
            ],
            ar: [
              "احقن IServiceScopeFactory في الـ singleton وافتح scope قصيراً لكل وحدة عمل — وهو الحل القياسي للـ background jobs.",
              "استخدم factory delegate مثل Func<T> أو typed factory ليصنع الـ singleton الكائن قصير العمر عند الحاجة.",
              "استخدم IHttpClientFactory بدل HttpClient كـ singleton ليُدار لك أمر الـ sockets و DNS.",
              "الـ containers الخارجية مثل Autofac تضيف lifetimes إضافية (per matching scope، per thread) إن احتجتها فعلاً."
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
          title: { en: "Storing per-user data in a singleton", ar: "تخزين بيانات المستخدم في singleton" },
          body: {
            en: "Someone wrote a class called TenantContext with a settable TenantId property and registered it as a singleton, then set it in middleware at the start of each request. It worked in testing with one user. In production, request A set TenantId = 17, then request B set it to 42 half a millisecond later, and request A read 42 when it saved the order. Customer 17's order was written into customer 42's account. A singleton has one set of fields shared by every thread; writing per-request data into it is the same as writing it into a global variable.",
            ar: "كتب أحدهم class باسم TenantContext يحتوي على خاصية TenantId قابلة للكتابة وسجّله singleton، ثم ضبطها في middleware عند بداية كل request. عمل الأمر في الاختبار بمستخدم واحد. في الإنتاج ضبط request A القيمة TenantId = 17، ثم ضبطها request B إلى 42 بعد نصف ميلي ثانية، فقرأ request A القيمة 42 عند حفظ الطلب. فكُتب طلب الزبون 17 في حساب الزبون 42. الـ singleton يملك مجموعة حقول واحدة تتشاركها كل الـ threads، وكتابة بيانات خاصة بالـ request فيه تعادل كتابتها في متغيّر عام."
          },
          fix: "// TenantContext holds request data -> it must be scoped, not singleton.\nbuilder.Services.AddScoped<TenantContext>();"
        },
        {
          t: "mistake",
          title: { en: "Injecting a scoped service into a singleton", ar: "حقن خدمة scoped داخل singleton" },
          body: {
            en: "A ReportGenerator was registered as a singleton and took AppDbContext in its constructor. The container built ReportGenerator on the first request, resolved one AppDbContext from that request's scope, and stored it inside the singleton forever. That context was disposed when the first request ended, so every later report threw ObjectDisposedException. This is called a captive dependency: the long-lived object captures the short-lived one and holds it past its intended life. ValidateScopes catches it immediately at startup.",
            ar: "سُجّل ReportGenerator كـ singleton وأخذ AppDbContext في الـ constructor. بنى الـ container كائن ReportGenerator عند أول request، وحلّ AppDbContext واحداً من scope ذلك الـ request، وخزّنه داخل الـ singleton إلى الأبد. ثم استُدعي Dispose على ذلك الـ context عند انتهاء أول request، فصار كل تقرير لاحق يرمي ObjectDisposedException. هذا يُسمّى captive dependency: الكائن طويل العمر يحتجز الكائن قصير العمر ويحتفظ به بعد انتهاء عمره المفترض. وخيار ValidateScopes يكشفه فوراً عند الإقلاع."
          },
          fix: "// Keep the singleton, but open a fresh scope per unit of work.\npublic ReportGenerator(IServiceScopeFactory scopeFactory) => _scopeFactory = scopeFactory;\n\npublic async Task RunAsync()\n{\n    using var scope = _scopeFactory.CreateScope();\n    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();\n    // ... use db, then the scope disposes it here\n}"
        },
        {
          t: "mistake",
          title: { en: "Resolving scoped services in a background service", ar: "استخراج خدمات scoped داخل background service" },
          body: {
            en: "A class inheriting BackgroundService took IOrderService in its constructor. BackgroundService instances are registered as singletons by AddHostedService, so the container resolved one IOrderService and its AppDbContext at startup and reused them for the entire life of the process. After a day the context had tracked 2.1 million entities, SaveChanges took 40 seconds, and memory sat at 6 GB. A background worker has no HTTP request, so it has no scope of its own — you must create one for each loop iteration.",
            ar: "class يرث BackgroundService أخذ IOrderService في الـ constructor. نسخ BackgroundService تُسجَّل كـ singletons عبر AddHostedService، فحلّ الـ container كائن IOrderService واحداً و AppDbContext واحداً عند الإقلاع وأعاد استخدامهما طوال عمر العملية. وبعد يوم كان الـ context قد تتبّع 2.1 مليون entity، وصار SaveChanges يستغرق 40 ثانية، واستقرّت الذاكرة عند 6 غيغابايت. الـ background worker بلا HTTP request، أي بلا scope خاص به — يجب أن تنشئ scope لكل دورة في الحلقة."
          },
          fix: "protected override async Task ExecuteAsync(CancellationToken ct)\n{\n    while (!ct.IsCancellationRequested)\n    {\n        using (var scope = _scopeFactory.CreateScope())\n        {\n            var orders = scope.ServiceProvider.GetRequiredService<IOrderService>();\n            await orders.ProcessPendingAsync(ct);\n        }   // scope closes here: the DbContext is disposed every iteration\n        await Task.Delay(TimeSpan.FromSeconds(30), ct);\n    }\n}"
        },
        {
          t: "mistake",
          title: { en: "Registering the same interface twice with different lifetimes", ar: "تسجيل نفس الـ interface مرتين بـ lifetimes مختلفة" },
          body: {
            en: "One file had AddScoped<IExchangeRateCache, ExchangeRateCache>() and another module's extension method had AddSingleton<IExchangeRateCache, ExchangeRateCache>(). The container does not complain; it keeps both descriptors and, when you ask for a single IExchangeRateCache, returns the last one registered. Registration order became load-bearing, and a harmless reordering of two lines in Program.cs silently changed the cache from per-request to global. Use TryAddSingleton and TryAddScoped in shared extension methods — they add the registration only if that service type is not already registered.",
            ar: "ملف يحوي AddScoped<IExchangeRateCache, ExchangeRateCache>() وملف آخر فيه extension method يحوي AddSingleton<IExchangeRateCache, ExchangeRateCache>(). الـ container لا يعترض؛ يحتفظ بالـ descriptorين، وعندما تطلب IExchangeRateCache واحداً يعيد آخر تسجيل. فأصبح ترتيب التسجيل حاسماً، وإعادة ترتيب سطرين في Program.cs بدّلت الـ cache من per-request إلى عام دون أي إنذار. استخدم TryAddSingleton و TryAddScoped داخل الـ extension methods المشتركة — فهي تضيف التسجيل فقط إذا لم يكن نوع الخدمة مسجَّلاً أصلاً."
          },
          fix: "using Microsoft.Extensions.DependencyInjection.Extensions;\n\nservices.TryAddSingleton<IExchangeRateCache, ExchangeRateCache>();"
        }
      ]
    },
    {
      key: "interview",
      blocks: [
        {
          t: "qa",
          level: "junior",
          q: { en: "What is the difference between singleton, scoped and transient?", ar: "ما الفرق بين singleton و scoped و transient؟" },
          a: {
            en: "Singleton means the container creates the object once and hands the same one to everybody for the whole life of the app. Scoped means one object per scope, and in a web app the framework opens one scope per HTTP request, so it is effectively one object per request. Transient means a new object every time it is asked for, even twice inside the same request. My default is scoped for anything that touches the database or the current user, singleton for shared caches and clients, transient for small stateless helpers.",
            ar: "الـ singleton يعني أن الـ container ينشئ الكائن مرة واحدة ويعطي نفس الكائن للجميع طوال عمر التطبيق. والـ scoped يعني كائناً واحداً لكل scope، وفي تطبيق ويب يفتح الـ framework scope واحداً لكل HTTP request، أي عملياً كائن واحد لكل request. والـ transient يعني كائناً جديداً في كل مرة يُطلب فيها، حتى لو طُلب مرتين داخل نفس الـ request. الافتراضي عندي: scoped لأي شيء يلمس قاعدة البيانات أو المستخدم الحالي، و singleton للـ caches والـ clients المشتركة، و transient للمساعدات الصغيرة بلا حالة."
          }
        },
        {
          t: "qa",
          level: "mid",
          q: { en: "Why is AppDbContext registered as scoped and not singleton?", ar: "لماذا يُسجَّل AppDbContext كـ scoped وليس singleton؟" },
          a: {
            en: "Two reasons. First, it is not thread-safe: it keeps one database connection and a list of tracked entities, and if two requests use it at the same moment you get 'A second operation was started on this context'. Second, it is designed to be short-lived. It remembers every entity it loaded so it can work out what changed, and that list never shrinks on its own. A per-request context is created, used, and disposed, which drops both the connection and the tracked entities. AddDbContext already registers it as scoped by default — you have to go out of your way to break this.",
            ar: "لسببين. الأول أنه ليس thread-safe: يحتفظ باتصال واحد بقاعدة البيانات وبقائمة الـ entities المتتبَّعة، وإذا استخدمه requestان في نفس اللحظة تحصل على الخطأ A second operation was started on this context. والثاني أنه مصمَّم ليكون قصير العمر. فهو يتذكّر كل entity حمّله ليعرف ما الذي تغيّر، وتلك القائمة لا تصغر من تلقاء نفسها. الـ context لكل request يُنشأ ثم يُستخدم ثم يُتخلَّص منه، فيُغلق الاتصال وتُحرَّر الـ entities. والـ AddDbContext يسجّله scoped افتراضياً — تحتاج جهداً متعمّداً لكسر ذلك."
          }
        },
        {
          t: "qa",
          level: "mid",
          q: { en: "What happens if you inject a transient service into a singleton?", ar: "ماذا يحدث لو حقنت خدمة transient داخل singleton؟" },
          a: {
            en: "It gets created once, when the singleton is created, and then lives as long as the singleton does. The word transient describes how the container hands it out, not how long it lives after that. So if that transient holds any per-request state you have the same bug as injecting a scoped service, except the container will not warn you — ValidateScopes only checks scoped-into-singleton, not transient-into-singleton. If the transient is disposable this is also a leak, because the root provider adds it to its disposables list and never releases it. If a singleton needs a fresh instance each time, inject a Func<T> or IServiceScopeFactory instead.",
            ar: "يُنشأ مرة واحدة عند إنشاء الـ singleton ثم يعيش بعمره. كلمة transient تصف طريقة تسليم الـ container له، لا مدة حياته بعد ذلك. فإذا كان يحمل أي حالة خاصة بالـ request فأنت أمام نفس bug حقن خدمة scoped، لكن دون تحذير من الـ container — لأن ValidateScopes يفحص scoped داخل singleton فقط، لا transient داخل singleton. وإذا كان الـ transient قابلاً للتخلّص فهذا تسريب أيضاً، لأن الـ root provider يضيفه إلى قائمة الـ disposables ولا يحرّره أبداً. إذا احتاج الـ singleton نسخة جديدة في كل مرة، احقن Func<T> أو IServiceScopeFactory بدلاً من ذلك."
          }
        },
        {
          t: "qa",
          level: "senior",
          q: { en: "How do you use a scoped service from a background job?", ar: "كيف تستخدم خدمة scoped من داخل background job؟" },
          a: {
            en: "You create the scope yourself. A hosted service is registered as a singleton, so it cannot take a scoped dependency in its constructor. Instead I inject IServiceScopeFactory, and inside the work loop I write using var scope = _scopeFactory.CreateScope(); then resolve what I need from scope.ServiceProvider. The important part is where the scope boundary goes: one scope per unit of work, not one for the whole worker. If I open one scope for the lifetime of the worker, the DbContext inside it accumulates tracked entities for days and SaveChanges gets slower every hour.",
            ar: "تنشئ الـ scope بنفسك. الـ hosted service مسجَّل كـ singleton، فلا يمكنه أخذ اعتماد scoped في الـ constructor. بدلاً من ذلك أحقن IServiceScopeFactory، وداخل حلقة العمل أكتب using var scope = _scopeFactory.CreateScope(); ثم أستخرج ما أحتاجه من scope.ServiceProvider. والجزء المهم هو مكان حدّ الـ scope: scope واحد لكل وحدة عمل، لا scope واحد للـ worker كله. فلو فتحت scope واحداً بعمر الـ worker لتراكمت الـ entities المتتبَّعة داخل الـ DbContext لأيام وصار SaveChanges أبطأ كل ساعة."
          }
        },
        {
          t: "qa",
          level: "senior",
          q: { en: "A singleton cache is showing stale data for some users only. How do you reason about it?", ar: "cache من نوع singleton يُظهر بيانات قديمة لبعض المستخدمين فقط. كيف تفكّر في المشكلة؟" },
          a: {
            en: "The phrase 'some users only' points at shared state keyed wrongly. A singleton is shared by everyone, so if the cache key does not include the tenant or user id, the first user to fill an entry decides what everyone else sees. I would dump the key format first — that is usually the whole bug. If the keys are right, I look at whether anything per-request was captured inside the singleton at construction time, for example an ICurrentUser injected into it, which froze the identity of whoever made the first request. The general rule I state in review is: a singleton may hold data that is true for the whole application, and nothing else.",
            ar: "عبارة «بعض المستخدمين فقط» تشير إلى حالة مشتركة بمفتاح خاطئ. الـ singleton يتشاركه الجميع، فإذا لم يتضمّن مفتاح الـ cache معرّف الـ tenant أو المستخدم فإن أول مستخدم يملأ المدخل يقرّر ما يراه الباقون. سأطبع شكل المفتاح أولاً — وغالباً تكون هذه هي المشكلة كلها. وإذا كانت المفاتيح صحيحة، أفحص هل احتُجز داخل الـ singleton شيء خاص بالـ request عند الإنشاء، مثل ICurrentUser محقون فيه، فجمّد هوية صاحب أول request. والقاعدة التي أذكرها في المراجعة: الـ singleton يجوز أن يحمل بيانات صحيحة للتطبيق كله، ولا شيء غير ذلك."
          }
        },
        {
          t: "qa",
          level: "staff",
          q: { en: "How do you stop lifetime bugs from reaching production across many teams?", ar: "كيف تمنع أخطاء الـ lifetime من الوصول إلى الإنتاج عبر فرق متعددة؟" },
          a: {
            en: "I make the failure loud and early instead of relying on reviewers. Three things. One: turn on ValidateScopes and ValidateOnBuild in every environment, so a captive dependency stops the deployment rather than the first user. Two: add one integration test that builds the real service provider from the real Program.cs and asserts it validates — that single test catches most of these before merge. Three: give each team a registration extension method per module that uses TryAdd, so nobody registers the same interface twice with different lifetimes. Then I write down the two rules people actually remember: per-request data lives in a scoped service, and a singleton's fields must be safe to read from many threads at once.",
            ar: "أجعل الفشل صاخباً ومبكراً بدل الاعتماد على المراجعين. ثلاثة أشياء. الأول: تفعيل ValidateScopes و ValidateOnBuild في كل البيئات، فيوقف الـ captive dependency عملية النشر بدل أن يوقف أول مستخدم. الثاني: إضافة integration test واحد يبني الـ service provider الحقيقي من Program.cs الحقيقي ويتحقق من نجاح الـ validation — هذا الاختبار وحده يمسك معظم الحالات قبل الدمج. الثالث: إعطاء كل فريق extension method للتسجيل خاصة بالـ module تستخدم TryAdd، فلا يسجّل أحد نفس الـ interface مرتين بـ lifetimes مختلفة. ثم أكتب القاعدتين اللتين يتذكّرهما الناس فعلاً: بيانات الـ request تعيش في خدمة scoped، وحقول الـ singleton يجب أن تكون آمنة للقراءة من threads متعددة في نفس الوقت."
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
          title: { en: "Mutable per-request state on a singleton", ar: "حالة متغيّرة خاصة بالـ request داخل singleton" },
          bad: "public class RequestContext\n{\n    public string UserId { get; set; }   // written by middleware on every request\n}\n\nbuilder.Services.AddSingleton<RequestContext>();\n\n// middleware\napp.Use(async (ctx, next) =>\n{\n    var rc = ctx.RequestServices.GetRequiredService<RequestContext>();\n    rc.UserId = ctx.User.FindFirst(\"sub\")!.Value;   // overwrites the previous request\n    await next();\n});",
          good: "public class RequestContext\n{\n    public string UserId { get; set; }\n}\n\nbuilder.Services.AddScoped<RequestContext>();   // one per HTTP request\n\n// middleware is unchanged, but now each request writes to its own instance",
          why: {
            en: "With AddSingleton there is exactly one RequestContext object in the whole process. Two overlapping requests write to the same UserId field, and whichever wrote last wins for both. That means user A can be charged for user B's order. Changing one word to AddScoped gives each request its own instance and the middleware code needs no change at all.",
            ar: "مع AddSingleton يوجد كائن RequestContext واحد فقط في العملية كلها. requestان متداخلان يكتبان في نفس الحقل UserId، ومن كتب أخيراً تفوز قيمته للاثنين. أي أن المستخدم A قد يُحاسَب على طلب المستخدم B. تغيير كلمة واحدة إلى AddScoped يعطي كل request نسخته الخاصة، ولا يحتاج كود الـ middleware أي تعديل."
          }
        },
        {
          t: "review",
          severity: "medium",
          title: { en: "Transient registration for an expensive, thread-safe client", ar: "تسجيل transient لعميل مكلف وthread-safe" },
          bad: "// ExchangeRateClient opens an HttpClient and parses a 2 MB rate table in its constructor.\nbuilder.Services.AddTransient<IExchangeRateClient, ExchangeRateClient>();\n\n// OrderService, PricingService and InvoiceService each get their own copy\n// -> three constructions and three 2 MB parses per request.",
          good: "// The client holds no per-request state and its methods only read, so one instance is safe.\nbuilder.Services.AddSingleton<IExchangeRateClient, ExchangeRateClient>();\n\n// If it needs outbound HTTP, let the factory manage sockets and DNS refresh:\nbuilder.Services.AddHttpClient<IExchangeRateClient, ExchangeRateClient>();",
          why: {
            en: "Transient means a new object at every injection point, so one request that touches three services builds this client three times and re-parses 2 MB three times. Measured on the running example this added about 11 ms to p50 — the typical request — and roughly 6 MB of garbage per request. The class has no mutable fields and its methods only read, so a single shared instance is correct and free.",
            ar: "الـ transient يعني كائناً جديداً عند كل نقطة حقن، فـ request واحد يمرّ على ثلاث خدمات يبني هذا العميل ثلاث مرات ويعيد تحليل 2 ميغابايت ثلاث مرات. وبالقياس على المثال الجاري أضاف هذا نحو 11 ميلي ثانية إلى p50 — أي الـ request المتوسط — وحوالي 6 ميغابايت من القمامة لكل request. الـ class لا يملك حقولاً متغيّرة ودوالّه تقرأ فقط، لذا نسخة واحدة مشتركة صحيحة وبلا تكلفة."
          }
        }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        {
          t: "p",
          en: "In a running system, lifetimes decide where the boundaries of shared state sit. Take the order service again, deployed as four instances behind a load balancer. Each instance has its own singletons — so a singleton is not global across the cluster, only inside one process. An in-memory rate cache registered as a singleton means four caches that can disagree with each other for as long as their refresh interval. If the design needs one shared answer for all instances, the singleton has to be backed by something external such as Redis, and the singleton then holds only the connection, not the data.",
          ar: "في نظام يعمل فعلاً، الـ lifetimes تحدّد أين تقع حدود الحالة المشتركة. خذ خدمة الطلبات مرة أخرى، منشورة كأربع نسخ خلف load balancer. كل نسخة تملك singletons خاصة بها — أي أن الـ singleton ليس عاماً على مستوى الـ cluster بل داخل عملية واحدة فقط. و cache للأسعار في الذاكرة مسجَّل كـ singleton يعني أربعة caches قد تختلف فيما بينها طوال فترة التحديث. وإذا كان التصميم يحتاج إجابة واحدة مشتركة لكل النسخ، فيجب أن يستند الـ singleton إلى شيء خارجي مثل Redis، ويحتفظ الـ singleton حينها بالاتصال فقط لا بالبيانات."
        },
        {
          t: "ul",
          en: [
            "Scope boundary in HTTP: the framework opens one scope per request, so 'per request' and 'per scope' are the same thing in a controller or minimal API handler.",
            "Scope boundary in a message consumer: most libraries (MassTransit, Rebus, Azure Service Bus processors) open one scope per message. That is the right unit — one message, one DbContext, one transaction.",
            "Scope boundary in a scheduled job: nobody opens it for you. Create one scope per item processed, not one per run, or the tracked-entity list grows all night.",
            "Scope boundary in gRPC streaming: one scope covers the whole stream, which can be minutes long. Do not put a DbContext there; open a child scope per message instead.",
            "Cluster boundary: singletons are per process, not per deployment. Any invariant that must hold across instances belongs in a database, Redis, or a distributed lock — never in a static field or a singleton."
          ],
          ar: [
            "حدّ الـ scope في HTTP: الـ framework يفتح scope واحداً لكل request، فـ «لكل request» و«لكل scope» شيء واحد داخل controller أو minimal API handler.",
            "حدّ الـ scope في مستهلك الرسائل: معظم المكتبات (MassTransit، Rebus، معالجات Azure Service Bus) تفتح scope واحداً لكل رسالة. وهذه هي الوحدة الصحيحة — رسالة واحدة، DbContext واحد، transaction واحدة.",
            "حدّ الـ scope في الـ scheduled job: لا أحد يفتحه نيابة عنك. أنشئ scope لكل عنصر تعالجه لا لكل تشغيل، وإلا نمت قائمة الـ entities المتتبَّعة طوال الليل.",
            "حدّ الـ scope في gRPC streaming: scope واحد يغطّي الـ stream كله وقد يمتد دقائق. لا تضع DbContext هناك؛ افتح scope فرعياً لكل رسالة بدلاً من ذلك.",
            "حدّ الـ cluster: الـ singletons لكل process لا لكل deployment. أي قاعدة يجب أن تصحّ عبر النسخ تنتمي إلى قاعدة بيانات أو Redis أو distributed lock — لا إلى حقل static أو singleton."
          ]
        },
        {
          t: "callout",
          kind: "warn",
          en: "A static field is a singleton that the container cannot see, cannot validate, and cannot dispose. If you find yourself writing 'static readonly Dictionary' to share state, register a singleton instead — you get the same sharing plus scope validation and clean shutdown.",
          ar: "الحقل الـ static هو singleton لا يراه الـ container ولا يستطيع فحصه ولا التخلّص منه. إذا وجدت نفسك تكتب static readonly Dictionary لمشاركة الحالة، فسجّل singleton بدلاً منه — تحصل على نفس المشاركة إضافة إلى فحص الـ scopes وإغلاق نظيف."
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
                en: "Scoped and transient objects become garbage at the end of the request, which is cheap — the garbage collector reclaims short-lived objects quickly. Singletons never become garbage, so anything they hold is permanent. A singleton holding a growing list is the most common managed memory leak in ASP.NET Core.",
                ar: "الكائنات الـ scoped والـ transient تصبح قمامة عند نهاية الـ request، وهذا رخيص لأن الـ garbage collector يستعيد الكائنات قصيرة العمر بسرعة. أمّا الـ singletons فلا تصبح قمامة أبداً، فكل ما تحمله دائم. و singleton يحمل قائمة تكبر هو أشيع تسريب ذاكرة مُدارة في ASP.NET Core."
              }
            },
            {
              k: { en: "CPU", ar: "المعالج" },
              v: {
                en: "Resolving a service is a dictionary lookup plus a call to a compiled factory — measured in tens of nanoseconds, so the resolution itself is never your bottleneck. The cost is in the constructors: a transient with heavy constructor work runs that work at every injection point.",
                ar: "استخراج خدمة يعادل بحثاً في dictionary مع نداء لـ factory مُترجمة — بترتيب عشرات النانوثانية، فالاستخراج نفسه ليس عنق الزجاجة أبداً. التكلفة في الـ constructors: الـ transient ذو الـ constructor الثقيل يعيد ذلك العمل عند كل نقطة حقن."
              }
            },
            {
              k: { en: "Latency", ar: "زمن الاستجابة" },
              v: {
                en: "Creating one DbContext per request costs roughly 0.2-0.5 ms — invisible next to a database round trip of 5-20 ms. Do not trade correctness for that. The latency wins from lifetimes come from singletons that avoid re-reading config or re-establishing connections, not from avoiding allocations.",
                ar: "إنشاء DbContext واحد لكل request يكلّف نحو 0.2-0.5 ميلي ثانية — وهو غير مرئي بجانب رحلة إلى قاعدة البيانات تستغرق 5-20 ميلي ثانية. لا تُقايض الصحة بذلك. المكاسب الحقيقية في زمن الاستجابة تأتي من singletons تتفادى إعادة قراءة الإعدادات أو إعادة فتح الاتصالات، لا من تفادي التخصيصات."
              }
            },
            {
              k: { en: "Scalability", ar: "قابلية التوسّع" },
              v: {
                en: "A singleton that takes a lock around shared state turns concurrent requests into a queue: with a 2 ms critical section, one instance cannot exceed about 500 requests per second no matter how many CPU cores it has. Prefer immutable data or concurrent collections inside singletons.",
                ar: "الـ singleton الذي يأخذ lock حول حالة مشتركة يحوّل الـ requests المتوازية إلى طابور: بقسم حرج طوله 2 ميلي ثانية لا تتجاوز النسخة الواحدة نحو 500 request في الثانية مهما بلغ عدد أنوية المعالج. فضّل البيانات غير القابلة للتغيير أو الـ concurrent collections داخل الـ singletons."
              }
            },
            {
              k: { en: "Database", ar: "قاعدة البيانات" },
              v: {
                en: "Scoped DbContext instances borrow a connection from the ADO.NET pool and return it on dispose. A leaked or long-lived context holds its connection, and when the pool (default 100 connections) empties, every request blocks for 30 seconds and then throws a timeout.",
                ar: "نسخ DbContext الـ scoped تستعير اتصالاً من الـ pool الخاص بـ ADO.NET وتعيده عند الـ dispose. والـ context المتسرّب أو طويل العمر يحتجز اتصاله، وعندما يفرغ الـ pool (افتراضياً 100 اتصال) يتوقف كل request ثلاثين ثانية ثم يرمي timeout."
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
            "Turn on scope validation and read the startup exception: with ValidateOnBuild the app refuses to start and the message names both services, e.g. 'Cannot consume scoped service AppDbContext from singleton ReportGenerator'. That one line usually is the whole diagnosis.",
            "Print the registration table at startup: loop over builder.Services and log descriptor.ServiceType.Name, descriptor.ImplementationType?.Name and descriptor.Lifetime. Look for the same ServiceType appearing twice with different lifetimes — that is the duplicate-registration bug.",
            "Take a memory dump with dotnet-dump collect -p <pid> and run dumpheap -stat inside dotnet-dump analyze. Look for one type with a count that grows between two dumps taken an hour apart; then gcroot <address> shows what is holding it, and the root is usually a singleton.",
            "Log an object id per instance: add a Guid field set in the constructor and log it. If the same Guid shows up in two different requests, that service is more shared than you thought; if it changes twice inside one request, it is transient when you meant scoped.",
            "Watch the connection pool with the Microsoft.Data.SqlClient event counters (dotnet-counters monitor -p <pid> Microsoft.Data.SqlClient.EventSource). A rising 'active hard connections' that never falls means contexts are not being disposed."
          ],
          ar: [
            "فعّل فحص الـ scopes واقرأ استثناء الإقلاع: مع ValidateOnBuild يرفض التطبيق الإقلاع وتذكر الرسالة الخدمتين، مثل: Cannot consume scoped service AppDbContext from singleton ReportGenerator. هذا السطر وحده هو التشخيص كاملاً عادة.",
            "اطبع جدول التسجيلات عند الإقلاع: مرّ على builder.Services وسجّل descriptor.ServiceType.Name و descriptor.ImplementationType?.Name و descriptor.Lifetime. ابحث عن نفس ServiceType مكرراً بـ lifetimes مختلفة — هذا هو bug التسجيل المزدوج.",
            "خذ memory dump عبر dotnet-dump collect -p <pid> ثم شغّل dumpheap -stat داخل dotnet-dump analyze. ابحث عن نوع واحد يزداد عدده بين dumpين بينهما ساعة؛ ثم يُظهر gcroot <address> من يحتجزه، والجذر غالباً singleton.",
            "سجّل معرّفاً لكل نسخة: أضف حقل Guid يُضبط في الـ constructor وسجّله. إذا ظهر نفس الـ Guid في requestين مختلفين فالخدمة مشتركة أكثر مما تظن؛ وإذا تغيّر مرتين داخل request واحد فهي transient بينما قصدتها scoped.",
            "راقب connection pool عبر event counters الخاصة بـ Microsoft.Data.SqlClient (dotnet-counters monitor -p <pid> Microsoft.Data.SqlClient.EventSource). ارتفاع active hard connections دون أن ينخفض يعني أن الـ contexts لا يُتخلَّص منها."
          ]
        },
        {
          t: "callout",
          kind: "tip",
          en: "Fastest reproduction for a suspected lifetime bug: send the same endpoint 50 parallel requests with different user ids and assert each response carries its own user id back. Sequential tests almost never reproduce these bugs, because the whole failure depends on two requests overlapping in time.",
          ar: "أسرع طريقة لإعادة إنتاج bug lifetime مشتبه به: أرسل 50 request متوازياً لنفس الـ endpoint بمعرّفات مستخدمين مختلفة وتحقق أن كل response يعيد معرّفه الصحيح. الاختبارات التتابعية لا تعيد إنتاج هذه الأخطاء تقريباً، لأن الفشل كله يعتمد على تداخل requestين في الزمن."
        }
      ]
    },
    {
      key: "realworld",
      blocks: [
        {
          t: "p",
          en: "Lifetime choices show up as production incidents in any system where one process serves many users at once. The pattern is always the same: something that should have been per-user was shared, or something that should have been shared was rebuilt on every call. The four cases below are the ones that recur across industries.",
          ar: "اختيارات الـ lifetime تظهر كحوادث إنتاج في أي نظام تخدم فيه عملية واحدة مستخدمين كثيرين في نفس الوقت. النمط واحد دائماً: شيء كان يجب أن يكون لكل مستخدم صار مشتركاً، أو شيء كان يجب أن يكون مشتركاً صار يُبنى في كل نداء. الحالات الأربع التالية هي الأكثر تكراراً عبر المجالات."
        },
        {
          t: "ul",
          en: [
            "Multi-tenant SaaS platforms: the tenant id is resolved from the host name in middleware and must live in a scoped service. Putting it in a singleton is the classic cross-tenant data leak, and it is usually found by a customer, not by monitoring.",
            "Payment systems: the payment gateway client is a singleton so its TLS connections and access token are reused, while the ledger DbContext is scoped so each payment is one transaction that commits or rolls back on its own.",
            "Background processing and ETL services: a nightly import that opens one scope for the whole run slows down hour after hour as the change tracker fills. Opening a scope per batch of a few hundred rows keeps the run time flat.",
            "Chat and real-time platforms: a SignalR hub instance is created per message, but the connection registry that maps user ids to connections is a singleton — and because it is written from many threads at once, it must be a concurrent collection, not a plain Dictionary."
          ],
          ar: [
            "منصات SaaS متعددة المستأجرين: معرّف الـ tenant يُستخرج من اسم المضيف في الـ middleware ويجب أن يعيش في خدمة scoped. ووضعه في singleton هو التسريب الكلاسيكي للبيانات بين المستأجرين، ويكتشفه عادة زبون لا نظام المراقبة.",
            "أنظمة المدفوعات: عميل بوابة الدفع singleton ليُعاد استخدام اتصالات TLS و access token، بينما DbContext الخاص بالدفتر scoped ليكون كل دفعة transaction واحدة تُثبَّت أو تُلغى وحدها.",
            "خدمات المعالجة الخلفية و ETL: استيراد ليلي يفتح scope واحداً للتشغيل كله يبطؤ ساعة بعد ساعة مع امتلاء الـ change tracker. وفتح scope لكل دفعة من بضع مئات الصفوف يبقي زمن التشغيل ثابتاً.",
            "منصات الدردشة والزمن الحقيقي: نسخة SignalR hub تُنشأ لكل رسالة، لكن سجل الاتصالات الذي يربط معرّفات المستخدمين بالاتصالات singleton — ولأنه يُكتب من threads كثيرة في نفس الوقت يجب أن يكون concurrent collection لا Dictionary عادياً."
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
          en: "Register one class three times in three separate apps — as singleton, scoped and transient — with a Guid field set in its constructor. Inject it twice into the same endpoint and return both Guids. You got it right when the singleton returns the same Guid across two different requests, the scoped one returns matching Guids inside a request but different ones across requests, and the transient returns two different Guids inside a single request.",
          ar: "سجّل class واحداً ثلاث مرات في ثلاثة تطبيقات منفصلة — singleton ثم scoped ثم transient — مع حقل Guid يُضبط في الـ constructor. احقنه مرتين في نفس الـ endpoint وأعد الـ Guidين. تكون قد نجحت عندما يعيد الـ singleton نفس الـ Guid عبر requestين مختلفين، ويعيد الـ scoped قيمتين متطابقتين داخل الـ request ومختلفتين بين الـ requests، ويعيد الـ transient قيمتين مختلفتين داخل request واحد."
        },
        {
          t: "ex",
          diff: "medium",
          en: "Reproduce the captive dependency on purpose: register a singleton that takes AppDbContext in its constructor, with ValidateScopes turned off. Call the endpoint twice and capture the exact exception on the second call. Then turn ValidateOnBuild on and confirm the app now fails at startup instead. You got it right when you can state, in one sentence, what changed about when the failure happens.",
          ar: "أعد إنتاج الـ captive dependency عمداً: سجّل singleton يأخذ AppDbContext في الـ constructor مع تعطيل ValidateScopes. نادِ الـ endpoint مرتين والتقط الاستثناء الدقيق في النداء الثاني. ثم فعّل ValidateOnBuild وتأكّد أن التطبيق صار يفشل عند الإقلاع بدلاً من ذلك. تكون قد نجحت عندما تستطيع أن تقول في جملة واحدة ما الذي تغيّر في توقيت الفشل."
        },
        {
          t: "ex",
          diff: "hard",
          en: "Write a BackgroundService that processes 100,000 rows. Version A resolves IOrderService once in the constructor; version B opens a scope per batch of 500 rows. Log elapsed time per batch and working-set memory every 10 batches. You got it right when version A shows per-batch time climbing steadily and memory rising without limit, while version B stays flat on both — and you can explain the climb by naming what the change tracker accumulates.",
          ar: "اكتب BackgroundService يعالج 100000 صف. النسخة A تستخرج IOrderService مرة واحدة في الـ constructor؛ والنسخة B تفتح scope لكل دفعة من 500 صف. سجّل الزمن المستغرق لكل دفعة وحجم الذاكرة كل 10 دفعات. تكون قد نجحت عندما تُظهر النسخة A زمناً يتصاعد باطراد وذاكرة ترتفع بلا حدّ، بينما تبقى النسخة B ثابتة في الاثنين — وتستطيع تفسير التصاعد بتسمية ما يتراكم داخل الـ change tracker."
        },
        {
          t: "ex",
          diff: "senior",
          en: "Add a guard to a real solution: write one integration test that builds the application's real service provider with ValidateScopes and ValidateOnBuild enabled and asserts it constructs without throwing. Then add a second test that walks builder.Services and fails if any service type is registered more than once with two different lifetimes. You got it right when introducing either bug on purpose turns the build red without anyone reading Program.cs.",
          ar: "أضف حاجزاً وقائياً إلى حل حقيقي: اكتب integration test واحداً يبني الـ service provider الحقيقي للتطبيق مع تفعيل ValidateScopes و ValidateOnBuild ويتحقق أنه يُبنى دون رمي استثناء. ثم أضف اختباراً ثانياً يمرّ على builder.Services ويفشل إذا سُجِّل أي نوع خدمة أكثر من مرة بـ lifetimes مختلفة. تكون قد نجحت عندما يؤدي إدخال أي من الخطأين عمداً إلى تعطيل الـ build دون أن يقرأ أحد Program.cs."
        }
      ]
    },
    {
      key: "refs",
      blocks: [
        {
          t: "ref",
          label: { en: "Dependency injection in ASP.NET Core — service lifetimes", ar: "الـ Dependency injection في ASP.NET Core — أعمار الخدمات" },
          url: "https://learn.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection",
          meta: { en: "Docs", ar: "توثيق" }
        },
        {
          t: "ref",
          label: { en: "Dependency injection guidelines — scope validation and anti-patterns", ar: "إرشادات الـ Dependency injection — فحص الـ scopes والأنماط الخاطئة" },
          url: "https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection-guidelines",
          meta: { en: "Docs", ar: "توثيق" }
        },
        {
          t: "ref",
          label: { en: "DbContext lifetime, configuration and initialization", ar: "عمر DbContext وإعداده وتهيئته" },
          url: "https://learn.microsoft.com/en-us/ef/core/dbcontext-configuration/",
          meta: { en: "Docs", ar: "توثيق" }
        },
        {
          t: "ref",
          label: { en: "Consuming a scoped service in a background task", ar: "استخدام خدمة scoped داخل مهمة خلفية" },
          url: "https://learn.microsoft.com/en-us/dotnet/core/extensions/scoped-service",
          meta: { en: "Docs", ar: "توثيق" }
        }
      ]
    }
  ],
  quiz: [
    {
      q: {
        en: "In an ASP.NET Core web app, how many instances of a scoped service exist during one HTTP request that injects it into three different classes?",
        ar: "في تطبيق ASP.NET Core، كم نسخة من خدمة scoped توجد أثناء HTTP request واحد يحقنها في ثلاثة classes مختلفة؟"
      },
      options: [
        { en: "Three — one per injection point", ar: "ثلاث — واحدة لكل نقطة حقن" },
        { en: "One — the scope caches it after the first resolve", ar: "واحدة — الـ scope يخزّنها بعد أول استخراج" },
        { en: "One for the whole application, shared by all requests", ar: "واحدة للتطبيق كله يتشاركها كل الـ requests" },
        { en: "It depends on how many threads the request uses", ar: "يعتمد على عدد الـ threads التي يستخدمها الـ request" }
      ],
      correct: 1,
      why: {
        en: "The scope keeps a dictionary of the scoped instances it has already created. The first resolve creates the object and stores it; the next two return the same object. A new request gets a new scope and therefore a new instance.",
        ar: "الـ scope يحتفظ بـ dictionary للنسخ الـ scoped التي أنشأها. أول استخراج ينشئ الكائن ويخزّنه، والاستخراجان التاليان يعيدان نفس الكائن. والـ request الجديد يحصل على scope جديد وبالتالي نسخة جديدة."
      }
    },
    {
      q: {
        en: "You inject a transient service into a singleton. How long does that transient instance live?",
        ar: "حقنت خدمة transient داخل singleton. كم تعيش تلك النسخة الـ transient؟"
      },
      options: [
        { en: "It is recreated on every method call of the singleton", ar: "يُعاد إنشاؤها عند كل نداء لدالة في الـ singleton" },
        { en: "Until the end of the first HTTP request", ar: "حتى نهاية أول HTTP request" },
        { en: "As long as the singleton — that is, until the app shuts down", ar: "بعمر الـ singleton — أي حتى إغلاق التطبيق" },
        { en: "The container throws at startup because this is not allowed", ar: "الـ container يرمي استثناء عند الإقلاع لأن هذا ممنوع" }
      ],
      correct: 2,
      why: {
        en: "Transient describes how the container hands the object out — a new one per request for it — not how long the receiver keeps it. The singleton is built once and holds that instance forever, so the transient effectively becomes a singleton.",
        ar: "كلمة transient تصف طريقة تسليم الـ container للكائن — نسخة جديدة لكل طلب له — لا مدة احتفاظ المستقبِل به. الـ singleton يُبنى مرة واحدة ويحتفظ بتلك النسخة إلى الأبد، فيصبح الـ transient عملياً singleton."
      }
    },
    {
      q: {
        en: "A BackgroundService needs an AppDbContext. What is the correct approach?",
        ar: "خدمة BackgroundService تحتاج AppDbContext. ما الأسلوب الصحيح؟"
      },
      options: [
        { en: "Inject AppDbContext directly into its constructor", ar: "حقن AppDbContext مباشرة في الـ constructor" },
        { en: "Register AppDbContext as a singleton so the worker can hold it", ar: "تسجيل AppDbContext كـ singleton ليحتفظ به الـ worker" },
        { en: "Inject IServiceScopeFactory and create a scope per unit of work", ar: "حقن IServiceScopeFactory وإنشاء scope لكل وحدة عمل" },
        { en: "Create a new AppDbContext with new AppDbContext() inside the loop", ar: "إنشاء AppDbContext جديد عبر new AppDbContext() داخل الحلقة" }
      ],
      correct: 2,
      why: {
        en: "A hosted service is a singleton, so it cannot take a scoped dependency. Injecting IServiceScopeFactory and opening a scope per unit of work gives a fresh context that is disposed each iteration, which keeps the change tracker small and returns the connection to the pool.",
        ar: "الـ hosted service هو singleton فلا يمكنه أخذ اعتماد scoped. وحقن IServiceScopeFactory وفتح scope لكل وحدة عمل يعطي context جديداً يُتخلَّص منه في كل دورة، فيبقى الـ change tracker صغيراً ويعود الاتصال إلى الـ pool."
      }
    },
    {
      q: {
        en: "What does ValidateScopes = true actually detect?",
        ar: "ما الذي يكتشفه ValidateScopes = true فعلياً؟" 
      },
      options: [
        { en: "Any service registered twice with different lifetimes", ar: "أي خدمة سُجِّلت مرتين بـ lifetimes مختلفة" },
        { en: "A singleton resolving a scoped service, and resolving a scoped service from the root provider", ar: "singleton يستخرج خدمة scoped، واستخراج خدمة scoped من الـ root provider" },
        { en: "Services that are never resolved by anything", ar: "الخدمات التي لا يستخرجها أحد أبداً" },
        { en: "Disposable transients that leak inside a long-lived scope", ar: "الـ transients القابلة للتخلّص التي تتسرّب داخل scope طويل العمر" }
      ],
      correct: 1,
      why: {
        en: "Scope validation checks exactly two things: that no singleton captures a scoped service, and that nothing resolves a scoped service straight from the root provider. It does not check duplicate registrations, unused services, or disposable transients captured by singletons.",
        ar: "فحص الـ scopes يتحقق من شيئين بالضبط: ألّا يحتجز أي singleton خدمة scoped، وألّا يُستخرج شيء scoped مباشرة من الـ root provider. ولا يفحص التسجيلات المكررة ولا الخدمات غير المستخدمة ولا الـ transients القابلة للتخلّص المحتجزة داخل singletons."
      }
    },
    {
      q: {
        en: "You register IExchangeRateCache as scoped in one file and as singleton in another. What does the container do when you resolve a single IExchangeRateCache?",
        ar: "سجّلت IExchangeRateCache كـ scoped في ملف وكـ singleton في ملف آخر. ماذا يفعل الـ container عندما تستخرج IExchangeRateCache واحداً؟"
      },
      options: [
        { en: "Throws an InvalidOperationException about the conflict", ar: "يرمي InvalidOperationException بسبب التعارض" },
        { en: "Uses the first registration and ignores the second", ar: "يستخدم أول تسجيل ويتجاهل الثاني" },
        { en: "Uses the last registration; both descriptors are kept", ar: "يستخدم آخر تسجيل، مع الاحتفاظ بالـ descriptorين" },
        { en: "Picks the longer lifetime automatically", ar: "يختار الـ lifetime الأطول تلقائياً" }
      ],
      correct: 2,
      why: {
        en: "The container keeps every descriptor and returns the last one added when you ask for a single instance (asking for IEnumerable<IExchangeRateCache> gives you both). That makes registration order silently significant, which is why shared extension methods should use TryAdd.",
        ar: "الـ container يحتفظ بكل الـ descriptors ويعيد آخر ما أُضيف عندما تطلب نسخة واحدة (وطلب IEnumerable<IExchangeRateCache> يعطيك الاثنين). وهذا يجعل ترتيب التسجيل مؤثراً بصمت، ولذلك ينبغي أن تستخدم الـ extension methods المشتركة TryAdd."
      }
    }
  ]
};
```

NEXT: captive
