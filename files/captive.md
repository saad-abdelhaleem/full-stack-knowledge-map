```js
const captiveLesson = {
  id: "captive",
  moduleId: "di",
  title: { en: "Captive dependencies", ar: "الـ Captive dependencies" },
  summary: {
    en: "A captive dependency is a short-lived object trapped inside a long-lived one, so it keeps living — and giving wrong answers — long after it should have been thrown away.",
    ar: "الـ captive dependency هو object قصير العمر محبوس داخل object طويل العمر، فيبقى حياً — ويعطي إجابات خاطئة — بعد وقت طويل من اللحظة التي كان يجب أن يُرمى فيها."
  },
  mins: 13,
  sections: [
    {
      key: "why",
      blocks: [
        {
          t: "p",
          en: "A captive dependency happens when a service that lives for the whole life of the application holds on to a service that was meant to live for one request only. The short-lived service never gets released. It keeps serving every request from then on, with data and connections that belong to a request that finished hours ago.",
          ar: "الـ captive dependency يحدث عندما يمسك service يعيش طوال عمر التطبيق بـ service كان من المفترض أن يعيش لطلب واحد فقط. الـ service قصير العمر لا يُحرَّر أبداً. يبقى يخدم كل request بعد ذلك، ببيانات و connections تخصّ request انتهى منذ ساعات."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "Lifetime", ar: "Lifetime" },
              v: {
                en: "The rule that tells the DI container how long one instance of a service should be reused before a new one is created.",
                ar: "القاعدة التي تخبر الـ DI container كم يعيد استخدام نسخة واحدة من الـ service قبل إنشاء نسخة جديدة."
              }
            },
            {
              k: { en: "Singleton", ar: "Singleton" },
              v: {
                en: "One instance for the whole application. Created once, reused by every request until the process shuts down.",
                ar: "نسخة واحدة للتطبيق كله. تُنشأ مرة واحدة ويعيد كل request استخدامها حتى يتوقف الـ process."
              }
            },
            {
              k: { en: "Scoped", ar: "Scoped" },
              v: {
                en: "One instance per scope. In ASP.NET Core a scope is one HTTP request, so you get a fresh instance per request and it is disposed when the request ends.",
                ar: "نسخة واحدة لكل scope. في ASP.NET Core الـ scope هو HTTP request واحد، فتحصل على نسخة جديدة لكل request ويتم dispose لها عند انتهاء الـ request."
              }
            },
            {
              k: { en: "Transient", ar: "Transient" },
              v: {
                en: "A brand new instance every single time somebody asks for the service.",
                ar: "نسخة جديدة تماماً في كل مرة يطلب فيها أحد الـ service."
              }
            },
            {
              k: { en: "Captive dependency", ar: "Captive dependency" },
              v: {
                en: "A scoped or transient service held by a longer-lived service, so it is forced to live as long as its holder.",
                ar: "service من نوع scoped أو transient يمسك به service أطول عمراً، فيُجبَر على العيش بطول عمر من يمسكه."
              }
            },
            {
              k: { en: "Scope validation", ar: "Scope validation" },
              v: {
                en: "A container setting that throws an error at startup or at resolve time when a scoped service is pulled into something longer-lived.",
                ar: "إعداد في الـ container يرمي خطأ عند الـ startup أو عند الـ resolve إذا سُحب service من نوع scoped إلى شيء أطول عمراً."
              }
            }
          ]
        },
        {
          t: "p",
          en: "Think of a hotel front desk. The desk itself is there every day for years — that is the singleton. A guest's room key works only for the nights that guest booked — that is the scoped service. If a clerk drops one guest's key into the desk drawer and then hands that same key to every guest who checks in afterwards, the key still opens a door, so nothing looks broken at first. It just opens the wrong door. A captive dependency is that key in the drawer.",
          ar: "تخيّل مكتب استقبال في فندق. المكتب نفسه موجود كل يوم لسنوات — هذا هو الـ singleton. مفتاح غرفة النزيل يعمل فقط لليالي التي حجزها — هذا هو الـ scoped service. لو وضع الموظف مفتاح نزيل واحد في درج المكتب ثم أعطى نفس المفتاح لكل نزيل يصل بعده، سيظل المفتاح يفتح باباً، فلا يبدو شيء معطوباً في البداية. لكنه يفتح الباب الخطأ. الـ captive dependency هو ذلك المفتاح في الدرج."
        },
        {
          t: "p",
          en: "The container cannot fix this for you, because constructor injection happens once. When the container builds a singleton it fills its constructor parameters at that moment and stores the finished object. Nobody comes back later to refresh those parameters. So whatever was passed in on the first request stays there forever.",
          ar: "الـ container لا يستطيع إصلاح هذا نيابةً عنك، لأن الـ constructor injection يحدث مرة واحدة. عندما يبني الـ container نسخة singleton يملأ parameters الـ constructor في تلك اللحظة ويخزّن الـ object الجاهز. لا أحد يعود لاحقاً ليحدّث تلك الـ parameters. لذلك يبقى ما مُرّر في أول request موجوداً إلى الأبد."
        },
        {
          t: "callout",
          kind: "note",
          en: "The rule is one line: a service may only depend on services whose lifetime is the same or longer. Singleton may hold singleton. Scoped may hold scoped or singleton. Transient may hold anything. Going the other way is a captive dependency.",
          ar: "القاعدة سطر واحد: يمكن للـ service أن يعتمد فقط على services عمرها مساوٍ أو أطول. الـ singleton يمسك singleton. الـ scoped يمسك scoped أو singleton. الـ transient يمسك أي شيء. العكس هو captive dependency."
        }
      ]
    },
    {
      key: "problem",
      blocks: [
        {
          t: "p",
          en: "Here is the running example for this lesson. An endpoint GET /api/orders/{id} returns an order with its discounted price. The price comes from OrderPricingService, which was registered as a singleton because somebody wanted to avoid rebuilding it on every request. OrderPricingService takes IDiscountRepository in its constructor, and that repository was registered as scoped because it wraps AppDbContext — the Entity Framework Core object that talks to the database and is designed to be created and thrown away per request.",
          ar: "هذا هو المثال الجاري في هذا الدرس. الـ endpoint واسمه GET /api/orders/{id} يُرجع order مع سعره بعد الخصم. السعر يأتي من OrderPricingService المسجَّل كـ singleton لأن أحدهم أراد تجنّب إعادة بنائه في كل request. الـ OrderPricingService يأخذ IDiscountRepository في الـ constructor، وذلك الـ repository مسجَّل كـ scoped لأنه يغلّف AppDbContext — وهو object الخاص بـ Entity Framework Core الذي يتحدث مع الـ database ومصمَّم ليُنشأ ويُرمى مع كل request."
        },
        {
          t: "p",
          en: "The first request of the day at 09:00 builds the singleton. That build pulls one AppDbContext out of the first request's scope and staples it to the singleton. The request finishes, its scope is disposed, but the singleton still holds that DbContext. Every request for the rest of the day reads through it.",
          ar: "أول request في اليوم عند الساعة 09:00 يبني الـ singleton. عملية البناء تسحب نسخة AppDbContext واحدة من scope ذلك الـ request وتثبّتها داخل الـ singleton. ينتهي الـ request ويتم dispose للـ scope الخاص به، لكن الـ singleton ما زال ممسكاً بذلك الـ DbContext. وكل request في بقية اليوم يقرأ من خلاله."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "Stale reads", ar: "قراءات قديمة" },
              v: {
                en: "A discount changed at 11:00. The API still returned the old price at 17:00, because the DbContext had cached that row in memory since 09:00 and never asked the database again.",
                ar: "تغيّر خصم عند الساعة 11:00. ظل الـ API يُرجع السعر القديم عند 17:00، لأن الـ DbContext احتفظ بذلك الصف في الذاكرة منذ 09:00 ولم يسأل الـ database مرة أخرى."
              }
            },
            {
              k: { en: "Random crashes", ar: "أعطال عشوائية" },
              v: {
                en: "AppDbContext is not thread-safe — two threads using it at once corrupt its internal state. Under parallel traffic you get: A second operation was started on this context instance before a previous operation completed. About 1 request in 300 failed with a 500.",
                ar: "الـ AppDbContext ليس thread-safe — استخدامه من أكثر من thread في نفس الوقت يفسد حالته الداخلية. تحت traffic متوازٍ تظهر الرسالة: A second operation was started on this context instance before a previous operation completed. فشل نحو request واحد من كل 300 بخطأ 500."
              }
            },
            {
              k: { en: "Memory growth", ar: "نمو الذاكرة" },
              v: {
                en: "The DbContext change tracker keeps a copy of every entity it loaded. Instead of ~40,000 short-lived contexts a day, there was one that never let go: process memory reached 2.1 GB after eight hours and only dropped on restart.",
                ar: "الـ change tracker في الـ DbContext يحتفظ بنسخة من كل entity حمّلها. فبدلاً من حوالي 40,000 context قصير العمر يومياً، كان هناك واحد لا يُفلت أبداً: وصلت ذاكرة الـ process إلى 2.1 GB بعد ثماني ساعات ولم تنخفض إلا عند إعادة التشغيل."
              }
            }
          ]
        },
        {
          t: "p",
          en: "None of these three symptoms points at dependency injection. They look like a caching bug, a concurrency bug and a memory leak — three separate tickets, one root cause. That is why captive dependencies are worth learning as a named pattern.",
          ar: "لا يشير أي من هذه الأعراض الثلاثة إلى الـ dependency injection. تبدو كأنها مشكلة caching، ومشكلة concurrency، وتسريب ذاكرة — ثلاث تذاكر منفصلة وسبب جذري واحد. لهذا يستحق الـ captive dependency أن تتعلّمه كنمط له اسم."
        }
      ]
    },
    {
      key: "internals",
      blocks: [
        {
          t: "p",
          en: "Follow one resolution step by step. ASP.NET Core builds a root ServiceProvider at startup — the object that knows how to create every registered service. For each incoming HTTP request the framework asks that root provider for a child scope, resolves the controller from the scope, and disposes the scope when the response is written.",
          ar: "تابع عملية resolve واحدة خطوة بخطوة. يبني ASP.NET Core عند الـ startup نسخة root ServiceProvider — وهو الـ object الذي يعرف كيف يُنشئ كل service مسجَّل. ولكل HTTP request وارد يطلب الـ framework من ذلك الـ root provider نسخة scope فرعية، ويعمل resolve للـ controller من داخل الـ scope، ثم يعمل dispose للـ scope عند كتابة الـ response."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "Root provider", ar: "Root provider" },
              v: {
                en: "The top-level container created at startup. It caches every singleton and is disposed only when the application shuts down.",
                ar: "الـ container الأعلى الذي يُنشأ عند الـ startup. يخزّن كل singleton ولا يتم dispose له إلا عند إيقاف التطبيق."
              }
            },
            {
              k: { en: "Scope", ar: "Scope" },
              v: {
                en: "A child container created per request. It caches scoped services and disposes the disposable ones when the request ends.",
                ar: "container فرعي يُنشأ لكل request. يخزّن الـ scoped services ويعمل dispose لما هو disposable منها عند انتهاء الـ request."
              }
            },
            {
              k: { en: "IServiceScopeFactory", ar: "IServiceScopeFactory" },
              v: {
                en: "A singleton service you can inject anywhere to create a scope by hand. This is the supported way for a long-lived object to use scoped services.",
                ar: "service من نوع singleton يمكنك حقنه في أي مكان لإنشاء scope يدوياً. هذه هي الطريقة المدعومة لكي يستخدم object طويل العمر خدمات scoped."
              }
            },
            {
              k: { en: "ValidateScopes", ar: "ValidateScopes" },
              v: {
                en: "A ServiceProviderOptions flag. When on, resolving a scoped service directly from the root provider throws instead of quietly succeeding.",
                ar: "خيار داخل ServiceProviderOptions. عند تفعيله، يرمي الـ container خطأ إذا تم resolve لخدمة scoped مباشرة من الـ root provider بدل أن ينجح بصمت."
              }
            },
            {
              k: { en: "ValidateOnBuild", ar: "ValidateOnBuild" },
              v: {
                en: "A second flag that walks every registration at startup and fails fast if a graph cannot be built, so you find the problem before traffic arrives.",
                ar: "خيار ثانٍ يمرّ على كل التسجيلات عند الـ startup ويفشل مبكراً إذا تعذّر بناء graph ما، فتكتشف المشكلة قبل وصول الـ traffic."
              }
            }
          ]
        },
        {
          t: "code",
          lang: "csharp",
          label: { en: "The registration that creates the trap", ar: "التسجيل الذي يصنع الفخ" },
          code: "// Program.cs\nbuilder.Services.AddDbContext<AppDbContext>(o => o.UseSqlServer(cs)); // scoped by default\nbuilder.Services.AddScoped<IDiscountRepository, DiscountRepository>();\nbuilder.Services.AddSingleton<OrderPricingService>();                  // <-- the trap\n\npublic sealed class OrderPricingService\n{\n    private readonly IDiscountRepository _discounts;\n\n    // Resolved ONCE, on the first request that needs pricing.\n    // Whatever DbContext is alive at that moment is captured for the process lifetime.\n    public OrderPricingService(IDiscountRepository discounts) => _discounts = discounts;\n\n    public async Task<decimal> PriceAsync(Order order, CancellationToken ct)\n    {\n        var rule = await _discounts.FindForSkuAsync(order.Sku, ct); // stale after the first read\n        return rule is null ? order.ListPrice : rule.Apply(order.ListPrice);\n    }\n}"
        },
        {
          t: "p",
          en: "The singleton took a photograph of its dependencies at the moment it was born, and it will keep showing you that photograph for the rest of the day. The photo was accurate when it was taken. It just never updates. Mapping that back: the photo is the IDiscountRepository reference, and the world it pictured — an open database connection and a request that was still running — is long gone.",
          ar: "الـ singleton التقط صورة لاعتمادياته لحظة ولادته، وسيظل يعرض عليك تلك الصورة بقية اليوم. كانت الصورة صحيحة وقت التقاطها، لكنها لا تتحدث أبداً. والربط بالواقع: الصورة هي مرجع الـ IDiscountRepository، والعالم الذي صوّرته — connection مفتوح على الـ database و request كان ما زال يعمل — قد انتهى منذ زمن."
        },
        {
          t: "p",
          en: "The built-in container does have a guard. ValidateScopes makes the root provider refuse to hand out a scoped service, which is exactly what happens while building a singleton. WebApplication.CreateBuilder turns both ValidateScopes and ValidateOnBuild on when the environment is Development, and off otherwise. That default is why so many teams meet this bug for the first time in production.",
          ar: "الـ container المدمج فيه حماية بالفعل. الـ ValidateScopes يجعل الـ root provider يرفض تسليم service من نوع scoped، وهو بالضبط ما يحدث أثناء بناء singleton. و WebApplication.CreateBuilder يفعّل ValidateScopes و ValidateOnBuild معاً عندما تكون البيئة Development، ويعطّلهما فيما عدا ذلك. هذا الإعداد الافتراضي هو سبب لقاء فرق كثيرة بهذه المشكلة لأول مرة في الـ production."
        },
        {
          t: "code",
          lang: "bash",
          label: { en: "What the guard prints when it catches the graph", ar: "ما يطبعه الحارس عندما يمسك الـ graph" },
          code: "System.InvalidOperationException: Cannot consume scoped service\n'IDiscountRepository' from singleton 'OrderPricingService'.\n\n# Turn the guard on in every environment, not just Development:\n# builder.Host.UseDefaultServiceProvider((ctx, o) => {\n#     o.ValidateScopes  = true;   // catch captive dependencies at resolve time\n#     o.ValidateOnBuild = true;   // and at startup, before the first request\n# });"
        },
        {
          t: "p",
          en: "Transient inside a singleton is captive too, and it has an extra problem. When the container creates a disposable transient it keeps a reference so it can dispose it later. If the transient was created while building a singleton, that reference sits on the root provider, so the object is only disposed at shutdown. A transient that opens a file handle or a socket then leaks one handle per creation for the life of the process.",
          ar: "الـ transient داخل singleton هو أيضاً captive، وله مشكلة إضافية. عندما يُنشئ الـ container نسخة transient قابلة لـ dispose يحتفظ بمرجع لها ليعمل لها dispose لاحقاً. وإذا أُنشئت تلك النسخة أثناء بناء singleton، يبقى المرجع على الـ root provider، فلا يتم dispose لها إلا عند إيقاف التطبيق. أي transient يفتح file handle أو socket يسرّب handle واحداً في كل إنشاء طوال عمر الـ process."
        },
        {
          t: "code",
          lang: "csharp",
          label: { en: "The fix: create a scope per unit of work", ar: "الحل: أنشئ scope لكل وحدة عمل" },
          code: "public sealed class OrderPricingService            // still a singleton, now safe\n{\n    private readonly IServiceScopeFactory _scopes;    // singleton, so no capture\n\n    public OrderPricingService(IServiceScopeFactory scopes) => _scopes = scopes;\n\n    public async Task<decimal> PriceAsync(Order order, CancellationToken ct)\n    {\n        await using var scope = _scopes.CreateAsyncScope();          // fresh scope\n        var discounts = scope.ServiceProvider.GetRequiredService<IDiscountRepository>();\n        var rule = await discounts.FindForSkuAsync(order.Sku, ct);   // fresh DbContext\n        return rule is null ? order.ListPrice : rule.Apply(order.ListPrice);\n    }                                                                 // scope disposed here\n}\n\n// Simpler alternative when the service holds no expensive state:\n// builder.Services.AddScoped<OrderPricingService>();"
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
              "Creating a scope by hand lets a genuinely long-lived object use per-request services safely",
              "The scope's lifetime is written in your code, so it is obvious where the DbContext dies",
              "Scope validation turns a silent data bug into a loud startup error",
              "Works the same for background workers, timers and message consumers"
            ],
            ar: [
              "إنشاء scope يدوياً يسمح لـ object طويل العمر فعلاً باستخدام خدمات لكل request بأمان",
              "عمر الـ scope مكتوب في الكود، فيصبح واضحاً أين يموت الـ DbContext",
              "الـ scope validation يحوّل مشكلة بيانات صامتة إلى خطأ صريح عند الـ startup",
              "يعمل بنفس الطريقة مع background workers و timers و message consumers"
            ]
          },
          cons: {
            en: [
              "The service now knows about the container, which is a weaker design than plain constructor injection",
              "Every method that touches data needs its own scope block, so there is more code",
              "Forgetting to dispose the scope leaks the services inside it",
              "Unit tests must supply a real IServiceScopeFactory or a stand-in for it"
            ],
            ar: [
              "الـ service صار يعرف بوجود الـ container، وهذا تصميم أضعف من الـ constructor injection العادي",
              "كل method تتعامل مع البيانات تحتاج block خاصاً بها لإنشاء scope، فيزيد حجم الكود",
              "نسيان dispose للـ scope يسرّب الخدمات التي بداخله",
              "اختبارات الـ unit tests تحتاج IServiceScopeFactory حقيقياً أو بديلاً عنه"
            ]
          },
          limits: {
            en: [
              "Scope validation only checks lifetimes; it cannot see state you cache yourself in a static field",
              "It does not fire for services built by a factory lambda that calls the root provider",
              "It is off by default outside Development, so it protects nobody until you enable it",
              "A scope you create is not the HTTP request scope, so request-only data such as HttpContext is not there"
            ],
            ar: [
              "الـ scope validation يفحص الـ lifetimes فقط؛ ولا يرى حالة تخزّنها بنفسك في static field",
              "لا يعمل مع الخدمات المبنية عبر factory lambda تستدعي الـ root provider",
              "معطَّل افتراضياً خارج بيئة Development، فلا يحمي أحداً حتى تفعّله",
              "الـ scope الذي تنشئه ليس scope الـ HTTP request، فالبيانات الخاصة بالـ request مثل HttpContext غير موجودة فيه"
            ]
          },
          alts: {
            en: [
              "Make the holder scoped instead — the simplest fix when it holds no expensive state",
              "Inject a factory delegate such as Func<IDiscountRepository> that resolves from the current scope",
              "Split the service: a singleton for the cheap cached part, a scoped one for the data part",
              "Use a container that checks lifetimes at build time by default, such as Autofac or Simple Injector"
            ],
            ar: [
              "اجعل الـ holder نفسه scoped — أبسط حل عندما لا يحتفظ بحالة مكلفة",
              "احقن factory delegate مثل Func<IDiscountRepository> يعمل resolve من الـ scope الحالي",
              "قسّم الـ service: singleton للجزء المخزَّن الرخيص، و scoped للجزء الذي يقرأ البيانات",
              "استخدم container يفحص الـ lifetimes وقت البناء افتراضياً مثل Autofac أو Simple Injector"
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
          title: { en: "A singleton holding a DbContext", ar: "singleton يمسك DbContext" },
          body: {
            en: "Somebody registered OrderPricingService as a singleton to avoid rebuilding it per request, and its constructor took IDiscountRepository, which wraps AppDbContext. Tests passed because they ran one request at a time. In production two threads hit the same DbContext and the API started returning 500 with the message about a second operation on the same context.",
            ar: "سجّل أحدهم OrderPricingService كـ singleton لتجنّب إعادة بنائه مع كل request، وكان الـ constructor يأخذ IDiscountRepository الذي يغلّف AppDbContext. نجحت الاختبارات لأنها كانت تشغّل request واحداً في كل مرة. في الـ production استخدم أكثر من thread نفس الـ DbContext وبدأ الـ API يُرجع 500 مع رسالة عن عملية ثانية على نفس الـ context."
          },
          fix: "// before\nbuilder.Services.AddSingleton<OrderPricingService>();\n// after — matches the lifetime of what it depends on\nbuilder.Services.AddScoped<OrderPricingService>();"
        },
        {
          t: "mistake",
          title: { en: "Registering everything as singleton for speed", ar: "تسجيل كل شيء كـ singleton طلباً للسرعة" },
          body: {
            en: "A team measured that creating services cost time and switched forty registrations from scoped to singleton in one commit. Creating a small service is a few nanoseconds of allocation, so the win was invisible. What they got instead was three captive DbContexts and a service that cached the current user's tenant id from the first request and applied it to everybody.",
            ar: "قاس فريق أن إنشاء الخدمات يكلّف وقتاً فحوّل أربعين تسجيلاً من scoped إلى singleton في commit واحد. إنشاء service صغير يكلّف بضع nanoseconds من التخصيص، فكان المكسب غير محسوس. وما حصلوا عليه بدلاً من ذلك: ثلاثة DbContext محبوسة، و service خزّن tenant id الخاص بأول مستخدم وطبّقه على الجميع."
          }
        },
        {
          t: "mistake",
          title: { en: "Injecting scoped services into a BackgroundService", ar: "حقن خدمات scoped داخل BackgroundService" },
          body: {
            en: "A nightly job class inherited from BackgroundService and took IOrderRepository in its constructor. BackgroundService is registered as a singleton by AddHostedService, so the repository and its DbContext were captured at startup. The job worked on day one and threw ObjectDisposedException on day two, after the first connection had been dropped by the database server.",
            ar: "class لمهمة ليلية ورث من BackgroundService وأخذ IOrderRepository في الـ constructor. الـ BackgroundService يُسجَّل كـ singleton عبر AddHostedService، فتم حبس الـ repository ومعه الـ DbContext عند الـ startup. عملت المهمة في اليوم الأول ورمت ObjectDisposedException في اليوم الثاني بعد أن أسقط الـ database server أول connection."
          },
          fix: "protected override async Task ExecuteAsync(CancellationToken ct)\n{\n    await using var scope = _scopes.CreateAsyncScope();   // IServiceScopeFactory injected\n    var repo = scope.ServiceProvider.GetRequiredService<IOrderRepository>();\n    await repo.CloseExpiredAsync(ct);\n}"
        },
        {
          t: "mistake",
          title: { en: "Hiding the capture inside a factory lambda", ar: "إخفاء الحبس داخل factory lambda" },
          body: {
            en: "After the validator started failing the build, someone rewrote the registration as AddSingleton(sp => new OrderPricingService(sp.GetRequiredService<IDiscountRepository>())). The error disappeared because the lambda resolves from whatever provider is passed in, and for a singleton that is the root provider. The captive dependency was unchanged; only the warning was gone.",
            ar: "بعد أن بدأ الـ validator يُفشل البناء، أعاد أحدهم كتابة التسجيل هكذا: AddSingleton(sp => new OrderPricingService(sp.GetRequiredService<IDiscountRepository>())). اختفى الخطأ لأن الـ lambda تعمل resolve من الـ provider الممرَّر إليها، وهو للـ singleton الـ root provider. لم يتغيّر الـ captive dependency إطلاقاً؛ اختفى التحذير فقط."
          },
          fix: "// Do not silence the validator. Either scope the holder,\n// or take IServiceScopeFactory and open a scope per call."
        }
      ]
    },
    {
      key: "interview",
      blocks: [
        {
          t: "qa",
          level: "junior",
          q: { en: "What is a captive dependency?", ar: "ما هو الـ captive dependency؟" },
          a: {
            en: "It is when a service that lives a long time holds a service that was supposed to live a short time. The classic case is a singleton that takes a scoped repository in its constructor. The constructor runs once, so that repository is stuck inside the singleton forever, even though it was meant to be thrown away at the end of one request.",
            ar: "هو أن يمسك service طويل العمر بـ service كان مفترضاً أن يعيش وقتاً قصيراً. الحالة الكلاسيكية singleton يأخذ repository من نوع scoped في الـ constructor. الـ constructor يعمل مرة واحدة، فيبقى ذلك الـ repository عالقاً داخل الـ singleton إلى الأبد رغم أنه كان يجب أن يُرمى عند نهاية request واحد."
          }
        },
        {
          t: "qa",
          level: "mid",
          q: { en: "Why does this usually pass tests and fail in production?", ar: "لماذا تنجح الاختبارات عادةً ويفشل الأمر في الـ production؟" },
          a: {
            en: "Two reasons. First, tests normally send one request at a time, so a shared DbContext is never used by two threads at once and nothing crashes. Second, ASP.NET Core only turns scope validation on in the Development environment, so the container throws on your machine but stays quiet in production if the app was started with a different environment name or a hand-built provider.",
            ar: "سببان. الأول أن الاختبارات ترسل عادةً request واحداً في كل مرة، فلا يستخدم أكثر من thread نفس الـ DbContext معاً ولا ينهار شيء. والثاني أن ASP.NET Core يفعّل الـ scope validation في بيئة Development فقط، فيرمي الـ container خطأً على جهازك ويصمت في الـ production إذا شُغّل التطبيق باسم بيئة مختلف أو بـ provider مبني يدوياً."
          }
        },
        {
          t: "qa",
          level: "mid",
          q: { en: "How do you fix a singleton that genuinely needs a scoped service?", ar: "كيف تصلح singleton يحتاج فعلاً إلى service من نوع scoped؟" },
          a: {
            en: "Inject IServiceScopeFactory instead of the service itself. That factory is a singleton, so nothing is captured. Inside each method you call CreateAsyncScope, resolve the scoped service from that scope, do the work, and let the using statement dispose the scope. Each call gets a fresh DbContext, exactly like a request would.",
            ar: "احقن IServiceScopeFactory بدل الـ service نفسه. هذا الـ factory من نوع singleton فلا يُحبس شيء. وداخل كل method تستدعي CreateAsyncScope، وتعمل resolve للخدمة scoped من ذلك الـ scope، وتنفّذ العمل، وتترك جملة using تعمل dispose للـ scope. كل استدعاء يحصل على DbContext جديد تماماً كما لو كان request."
          }
        },
        {
          t: "qa",
          level: "senior",
          q: { en: "Is a transient inside a singleton a problem too?", ar: "هل الـ transient داخل singleton مشكلة أيضاً؟" },
          a: {
            en: "Yes, and it is sneakier. The transient is created once and then behaves like a singleton, which breaks any assumption that it is fresh. On top of that, if it implements IDisposable the container tracks it on the root provider so it can dispose it, and the root provider is only disposed at shutdown. So a disposable transient resolved into singletons is a slow leak of whatever it holds — connections, handles, buffers.",
            ar: "نعم، وهي أخبث. تُنشأ نسخة الـ transient مرة واحدة ثم تتصرف كأنها singleton، فينهار أي افتراض بأنها جديدة. وفوق ذلك، إذا كانت تطبّق IDisposable فإن الـ container يتتبعها على الـ root provider ليعمل لها dispose، والـ root provider لا يتم dispose له إلا عند إيقاف التطبيق. لذلك أي transient قابل لـ dispose يُحقن في singletons هو تسريب بطيء لما يمسكه: connections و handles و buffers."
          }
        },
        {
          t: "qa",
          level: "senior",
          q: { en: "When is holding a scoped service in a longer-lived object actually acceptable?", ar: "متى يكون الإمساك بخدمة scoped داخل object أطول عمراً مقبولاً فعلاً؟" },
          a: {
            en: "Almost never for stateful services like a DbContext or anything holding a connection. It is acceptable when the scoped registration is only scoped for convenience and the object is genuinely stateless and thread-safe — for example a small options reader with no per-request data. Even then I would change its registration to singleton rather than rely on the capture, because the next person to add a field to that class turns it into a bug.",
            ar: "تقريباً أبداً مع الخدمات ذات الحالة مثل DbContext أو أي شيء يمسك connection. يكون مقبولاً عندما يكون التسجيل scoped لمجرد التسهيل ويكون الـ object فعلاً بلا حالة و thread-safe — مثل قارئ options صغير لا يحمل بيانات خاصة بالـ request. وحتى حينها سأغيّر تسجيله إلى singleton بدل الاعتماد على الحبس، لأن أول شخص يضيف field إلى ذلك الـ class يحوّله إلى مشكلة."
          }
        },
        {
          t: "qa",
          level: "staff",
          q: { en: "How do you stop this class of bug across many teams, not just one service?", ar: "كيف توقف هذا النوع من الأخطاء عبر فرق كثيرة، لا service واحد فقط؟" },
          a: {
            en: "Make the container refuse to start. Turn ValidateScopes and ValidateOnBuild on in every environment, not just Development, so a bad graph fails at deployment instead of at 3am. Then add one integration test per service that builds the real provider and asserts it validates — that catches registrations added later. Beyond tooling, publish a one-page rule that lifetimes may only point at equal or longer lifetimes, and put the composition root in a single reviewed file so registrations are never scattered across twenty modules where nobody sees the whole graph.",
            ar: "اجعل الـ container يرفض العمل من الأساس. فعّل ValidateScopes و ValidateOnBuild في كل البيئات لا في Development فقط، ليفشل الـ graph الخاطئ وقت النشر بدل الساعة الثالثة فجراً. ثم أضف integration test واحداً لكل service يبني الـ provider الحقيقي ويتأكد من نجاح الـ validation — هذا يمسك التسجيلات المضافة لاحقاً. وبعيداً عن الأدوات، انشر قاعدة من صفحة واحدة: الـ lifetimes تشير فقط إلى lifetimes مساوية أو أطول، وضع الـ composition root في ملف واحد تتم مراجعته حتى لا تتناثر التسجيلات في عشرين module لا يرى فيها أحد الـ graph كاملاً."
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
          title: { en: "Singleton constructor takes a data service", ar: "constructor لـ singleton يأخذ service بيانات" },
          bad: "builder.Services.AddSingleton<OrderPricingService>();\n\npublic sealed class OrderPricingService\n{\n    private readonly IDiscountRepository _discounts;   // scoped\n    public OrderPricingService(IDiscountRepository discounts) => _discounts = discounts;\n}",
          good: "builder.Services.AddSingleton<OrderPricingService>();\n\npublic sealed class OrderPricingService\n{\n    private readonly IServiceScopeFactory _scopes;     // singleton\n    public OrderPricingService(IServiceScopeFactory scopes) => _scopes = scopes;\n\n    public async Task<decimal> PriceAsync(Order o, CancellationToken ct)\n    {\n        await using var scope = _scopes.CreateAsyncScope();\n        var discounts = scope.ServiceProvider.GetRequiredService<IDiscountRepository>();\n        var rule = await discounts.FindForSkuAsync(o.Sku, ct);\n        return rule is null ? o.ListPrice : rule.Apply(o.ListPrice);\n    }\n}",
          why: {
            en: "The bad version captures one DbContext for the life of the process, which gives stale prices and crashes under parallel requests. The good version keeps the singleton but opens a fresh scope per call, so each call gets its own DbContext and disposes it immediately.",
            ar: "النسخة السيئة تحبس DbContext واحداً طوال عمر الـ process، فتُعطي أسعاراً قديمة وتنهار تحت requests متوازية. النسخة الجيدة تُبقي الـ singleton لكنها تفتح scope جديداً لكل استدعاء، فيحصل كل استدعاء على DbContext خاص به ويتم dispose له فوراً."
          }
        },
        {
          t: "review",
          severity: "medium",
          title: { en: "Scope validation only in Development", ar: "تفعيل scope validation في Development فقط" },
          bad: "var builder = WebApplication.CreateBuilder(args);\n// ValidateScopes and ValidateOnBuild are on in Development only.\n// Staging and Production start happily with a broken object graph.",
          good: "var builder = WebApplication.CreateBuilder(args);\nbuilder.Host.UseDefaultServiceProvider((_, o) =>\n{\n    o.ValidateScopes  = true;   // every environment\n    o.ValidateOnBuild = true;   // fail at startup, not on first request\n});",
          why: {
            en: "Relying on the default means the check runs where the bug is harmless and is off where it hurts. Turning both flags on everywhere converts a silent production data bug into a deployment that refuses to start, which is far cheaper to deal with.",
            ar: "الاعتماد على الإعداد الافتراضي يعني أن الفحص يعمل حيث المشكلة غير ضارة ويتعطّل حيث تؤذي. تفعيل الخيارين في كل مكان يحوّل مشكلة بيانات صامتة في الـ production إلى deployment يرفض العمل، وهذا أرخص كثيراً في التعامل."
          }
        }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        {
          t: "p",
          en: "The place this bites hardest in a real system is anything that runs outside an HTTP request: a queue consumer, a scheduled job, a cache warmer, a SignalR hub backplane. All of these are registered once and live for the life of the process, so they sit exactly where the trap is. The standard shape is one scope per unit of work — per message, per job run, per batch — created and disposed inside the loop, never around it.",
          ar: "أكثر مكان تظهر فيه هذه المشكلة في نظام حقيقي هو كل ما يعمل خارج HTTP request: مستهلك queue، أو مهمة مجدولة، أو مهمة تسخين cache، أو backplane لـ SignalR hub. كلها تُسجَّل مرة واحدة وتعيش طوال عمر الـ process، فتجلس تماماً حيث يوجد الفخ. الشكل المعتاد هو scope واحد لكل وحدة عمل — لكل message أو تشغيل مهمة أو batch — يُنشأ ويتم dispose له داخل الحلقة لا حولها."
        },
        {
          t: "ul",
          en: [
            "Message consumer: create the scope after receiving the message, dispose it after the acknowledgement, so a poison message cannot corrupt the next one's DbContext.",
            "Scheduled job: create one scope per run; for a long job that processes 100k rows, create a scope per batch of a few thousand so the change tracker does not grow without limit.",
            "Cache warmer: the cache itself is a singleton; the code that reads the database to fill it must open a scope each time it refreshes.",
            "Multi-tenant systems: tenant identity is per-request data, so a singleton that caches it serves the first tenant's data to everyone — treat this as the same bug."
          ],
          ar: [
            "مستهلك الـ messages: أنشئ الـ scope بعد استلام الـ message واعمل له dispose بعد الـ acknowledgement، حتى لا تُفسد message سيئة الـ DbContext الخاص بالتالية.",
            "المهمة المجدولة: scope واحد لكل تشغيل؛ وللمهمة الطويلة التي تعالج 100k صف، أنشئ scope لكل batch من بضعة آلاف حتى لا ينمو الـ change tracker بلا حدود.",
            "مهمة تسخين الـ cache: الـ cache نفسه singleton، أما الكود الذي يقرأ من الـ database ليملأه فيجب أن يفتح scope في كل تحديث.",
            "الأنظمة متعددة المستأجرين: هوية الـ tenant بيانات خاصة بالـ request، لذا أي singleton يخزّنها يقدّم بيانات أول tenant للجميع — عامل هذا كنفس المشكلة."
          ]
        },
        {
          t: "callout",
          kind: "warn",
          en: "IHttpContextAccessor is a singleton that reads request data from an async-local slot. It is safe to inject anywhere, but the HttpContext it returns is null outside a request. Reading it from a background worker and caching the result is the same trap with a different name.",
          ar: "الـ IHttpContextAccessor هو singleton يقرأ بيانات الـ request من مكان async-local. حقنه آمن في أي مكان، لكن الـ HttpContext الذي يُرجعه يكون null خارج الـ request. قراءته من background worker وتخزين النتيجة هي نفس الفخ باسم مختلف."
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
                en: "A captured DbContext never clears its change tracker, so every entity read since startup stays reachable. In the example the process grew to 2.1 GB in eight hours and only fell on restart.",
                ar: "الـ DbContext المحبوس لا يفرّغ الـ change tracker أبداً، فيبقى كل entity قُرئ منذ الـ startup محجوزاً في الذاكرة. في المثال نمت الـ process إلى 2.1 GB خلال ثماني ساعات ولم تنخفض إلا عند إعادة التشغيل."
              }
            },
            {
              k: { en: "Database", ar: "قاعدة البيانات" },
              v: {
                en: "One connection is held open for the process lifetime instead of being returned to the pool per request, and the server may kill it after an idle timeout, which turns every later query into an error.",
                ar: "يبقى connection واحد مفتوحاً طوال عمر الـ process بدل إعادته إلى الـ pool بعد كل request، وقد يقتله الـ server بعد مهلة خمول، فيتحول كل استعلام لاحق إلى خطأ."
              }
            },
            {
              k: { en: "Latency", ar: "زمن الاستجابة" },
              v: {
                en: "As the change tracker fills, every SaveChanges scans more tracked entities, so write latency climbs slowly through the day instead of staying flat.",
                ar: "كلما امتلأ الـ change tracker صار كل SaveChanges يمسح عدداً أكبر من الـ entities المتتبَّعة، فيرتفع زمن الكتابة تدريجياً خلال اليوم بدل أن يبقى ثابتاً."
              }
            },
            {
              k: { en: "Scalability", ar: "قابلية التوسّع" },
              v: {
                en: "A shared non-thread-safe object becomes the serialization point of the whole endpoint: adding CPU cores or instances does not help, because concurrent calls corrupt it rather than queue politely.",
                ar: "الـ object المشترك غير الـ thread-safe يصبح نقطة التسلسل في الـ endpoint كله: إضافة أنوية أو نسخ لا تساعد، لأن الاستدعاءات المتزامنة تفسده بدل أن تصطف بانتظام."
              }
            },
            {
              k: { en: "CPU", ar: "المعالج" },
              v: {
                en: "The cost you were trying to save is tiny — resolving a small scoped service is an allocation and a constructor call, in the tens of nanoseconds. Singleton was never the performance win it looked like.",
                ar: "التكلفة التي كنت تحاول توفيرها ضئيلة — عمل resolve لخدمة scoped صغيرة هو تخصيص واستدعاء constructor بترتيب عشرات الـ nanoseconds. لم يكن الـ singleton أبداً المكسب الذي بدا عليه."
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
            "Turn on ValidateScopes and ValidateOnBuild and start the app: the exception message names both services, in the form 'Cannot consume scoped service X from singleton Y'.",
            "Write a test that calls builder.Build() on the real service collection with validation on; a failing test tells you the exact registration before anything ships.",
            "Log the hash code of the DbContext instance at the top of the request (context.ContextId): the same value across two different requests proves it is shared.",
            "Take a memory dump with dotnet-dump and run 'dumpheap -stat -type DbContext': more than a handful of live contexts on an idle process means something is holding them.",
            "Search the codebase for AddSingleton and read each constructor: any parameter that ends in Repository, DbContext, UnitOfWork or Accessor deserves a second look."
          ],
          ar: [
            "فعّل ValidateScopes و ValidateOnBuild وشغّل التطبيق: رسالة الخطأ تذكر اسم الخدمتين بالشكل 'Cannot consume scoped service X from singleton Y'.",
            "اكتب اختباراً يستدعي builder.Build() على الـ service collection الحقيقي مع تفعيل الـ validation؛ فشل الاختبار يدلّك على التسجيل بالضبط قبل أي نشر.",
            "سجّل معرّف نسخة الـ DbContext في بداية كل request عبر context.ContextId: تكرار نفس القيمة في طلبين مختلفين يثبت أنه مشترك.",
            "خذ memory dump عبر dotnet-dump ونفّذ 'dumpheap -stat -type DbContext': وجود أكثر من عدد قليل من الـ contexts الحية على process خامل يعني أن شيئاً يمسكها.",
            "ابحث في الكود عن AddSingleton واقرأ كل constructor: أي parameter ينتهي بـ Repository أو DbContext أو UnitOfWork أو Accessor يستحق نظرة ثانية."
          ]
        },
        {
          t: "callout",
          kind: "tip",
          en: "Quick field test with no tooling: log the value of GetHashCode on the injected dependency at the start of each request. If two different requests print the same number for a service you registered as scoped, you have found a captive dependency.",
          ar: "اختبار سريع بلا أدوات: سجّل قيمة GetHashCode للاعتمادية المحقونة في بداية كل request. إذا طبع طلبان مختلفان نفس الرقم لخدمة سجّلتها scoped، فقد وجدت captive dependency."
        }
      ]
    },
    {
      key: "realworld",
      blocks: [
        {
          t: "p",
          en: "This bug shows up wherever a system mixes request handling with long-running work in the same process, which is most backend services once they grow past a single controller. It is common in teams that started with a small app where everything was a singleton and never revisited the registrations as the app added a database, a queue and a scheduler.",
          ar: "تظهر هذه المشكلة في كل نظام يخلط معالجة الـ requests مع عمل طويل الأمد في نفس الـ process، وهو حال معظم الخدمات الخلفية بعد أن تكبر عن controller واحد. وهي شائعة في الفرق التي بدأت بتطبيق صغير كان كل شيء فيه singleton ولم تراجع التسجيلات بعد أن أضاف التطبيق database و queue و scheduler."
        },
        {
          t: "ul",
          en: [
            "Payment systems: a singleton fee calculator captures a repository and keeps charging yesterday's rate after a pricing change is published.",
            "Multi-tenant SaaS platforms: a cached tenant context from the first request leaks one tenant's data into another tenant's response — the most expensive form of this bug.",
            "Order and inventory services with nightly jobs: the job class is a hosted service, so its repository is captured at startup and fails the next night on a dead connection.",
            "Chat and notification platforms: a hub or consumer registered once holds a scoped user-context service, so messages get attributed to whoever connected first after a deploy."
          ],
          ar: [
            "أنظمة الدفع: حاسبة رسوم من نوع singleton تحبس repository فتظل تحسب سعر الأمس بعد نشر تغيير في التسعير.",
            "منصات SaaS متعددة المستأجرين: تخزين tenant context من أول request يسرّب بيانات مستأجر داخل response مستأجر آخر — وهو أغلى صور هذه المشكلة.",
            "خدمات الطلبات والمخزون ذات المهام الليلية: class المهمة hosted service، فيُحبس الـ repository عند الـ startup ويفشل في الليلة التالية على connection ميّت.",
            "منصات المحادثة والإشعارات: hub أو consumer يُسجَّل مرة واحدة ويمسك خدمة user-context من نوع scoped، فتُنسب الرسائل إلى أول من اتصل بعد النشر."
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
          en: "Build a minimal API with one scoped service that stores a Guid created in its constructor, and one singleton that injects it and returns that Guid. Call the endpoint three times. You are right when the singleton returns the same Guid all three times while a scoped endpoint returns a different one each time.",
          ar: "ابنِ minimal API فيه service من نوع scoped يخزّن Guid يُنشأ في الـ constructor، و singleton يحقنه ويُرجع ذلك الـ Guid. استدعِ الـ endpoint ثلاث مرات. تكون قد نجحت عندما يُرجع الـ singleton نفس الـ Guid في المرات الثلاث بينما يُرجع endpoint من نوع scoped قيمة مختلفة في كل مرة."
        },
        {
          t: "ex",
          diff: "medium",
          en: "Take the same app and turn ValidateScopes and ValidateOnBuild on for all environments. You are right when the application fails at startup with a message naming both the singleton and the scoped service, and starts cleanly again after you change the singleton registration to scoped.",
          ar: "خذ نفس التطبيق وفعّل ValidateScopes و ValidateOnBuild لكل البيئات. تكون قد نجحت عندما يفشل التطبيق عند الـ startup برسالة تذكر اسم الـ singleton والخدمة scoped معاً، ثم يعمل بشكل سليم بعد تغيير تسجيل الـ singleton إلى scoped."
        },
        {
          t: "ex",
          diff: "hard",
          en: "Write a BackgroundService that reads rows through EF Core every second, first by injecting the DbContext directly and then by using IServiceScopeFactory. You are right when the first version throws ObjectDisposedException or a concurrency error within a few minutes and the second runs for an hour with flat memory in dotnet-counters.",
          ar: "اكتب BackgroundService يقرأ صفوفاً عبر EF Core كل ثانية، أولاً بحقن الـ DbContext مباشرة ثم باستخدام IServiceScopeFactory. تكون قد نجحت عندما ترمي النسخة الأولى ObjectDisposedException أو خطأ concurrency خلال دقائق، بينما تعمل الثانية ساعة كاملة بذاكرة ثابتة في dotnet-counters."
        },
        {
          t: "ex",
          diff: "senior",
          en: "Add an integration test to an existing service that builds the real IServiceCollection from Program.cs with validation enabled and asserts the provider builds. Then add a deliberate captive registration on a branch. You are right when the test fails with the name of the offending pair and the pipeline blocks the merge.",
          ar: "أضف integration test إلى service قائم يبني الـ IServiceCollection الحقيقي من Program.cs مع تفعيل الـ validation ويتأكد من نجاح بناء الـ provider. ثم أضف تسجيلاً captive متعمداً في branch. تكون قد نجحت عندما يفشل الاختبار ذاكراً اسم الزوج المخالف ويمنع الـ pipeline عملية الدمج."
        }
      ]
    },
    {
      key: "refs",
      blocks: [
        {
          t: "ref",
          label: { en: "Dependency injection guidelines (.NET)", ar: "إرشادات الـ dependency injection في .NET" },
          url: "https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection-guidelines",
          meta: { en: "Docs", ar: "توثيق" }
        },
        {
          t: "ref",
          label: { en: "Dependency injection in ASP.NET Core", ar: "الـ dependency injection في ASP.NET Core" },
          url: "https://learn.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection",
          meta: { en: "Docs", ar: "توثيق" }
        },
        {
          t: "ref",
          label: { en: "DbContext lifetime, configuration and initialization", ar: "عمر الـ DbContext وإعداده وتهيئته" },
          url: "https://learn.microsoft.com/en-us/ef/core/dbcontext-configuration/",
          meta: { en: "Docs", ar: "توثيق" }
        },
        {
          t: "ref",
          label: { en: "Mark Seemann — Captive Dependency", ar: "Mark Seemann — Captive Dependency" },
          url: "https://blog.ploeh.dk/2014/06/02/captive-dependency/",
          meta: { en: "Article", ar: "مقال" }
        }
      ]
    }
  ],
  quiz: [
    {
      q: {
        en: "A service registered as singleton takes a scoped repository in its constructor. How many repository instances exist over the application's life?",
        ar: "service مسجَّل كـ singleton يأخذ repository من نوع scoped في الـ constructor. كم نسخة من الـ repository توجد طوال عمر التطبيق؟"
      },
      options: [
        { en: "One per HTTP request", ar: "واحدة لكل HTTP request" },
        { en: "Exactly one, created when the singleton was first built", ar: "واحدة فقط، تُنشأ عند بناء الـ singleton لأول مرة" },
        { en: "One per thread", ar: "واحدة لكل thread" },
        { en: "A new one on every method call", ar: "واحدة جديدة عند كل استدعاء method" }
      ],
      correct: 1,
      why: {
        en: "Constructor injection runs once for a singleton, so the repository resolved at that moment is the only one that will ever be used by that singleton.",
        ar: "الـ constructor injection يعمل مرة واحدة للـ singleton، لذلك الـ repository الذي تم resolve له في تلك اللحظة هو الوحيد الذي سيستخدمه ذلك الـ singleton إلى الأبد."
      }
    },
    {
      q: {
        en: "Which lifetime combination is safe?",
        ar: "أي تركيبة lifetimes تُعد آمنة؟"
      },
      options: [
        { en: "Singleton depending on scoped", ar: "singleton يعتمد على scoped" },
        { en: "Singleton depending on transient", ar: "singleton يعتمد على transient" },
        { en: "Scoped depending on singleton", ar: "scoped يعتمد على singleton" },
        { en: "Singleton depending on a scoped factory lambda", ar: "singleton يعتمد على factory lambda من نوع scoped" }
      ],
      correct: 2,
      why: {
        en: "A service may only depend on something that lives at least as long as it does. Scoped depending on singleton follows that rule; the other three trap a shorter-lived object inside a longer-lived one.",
        ar: "يمكن للـ service أن يعتمد فقط على شيء يعيش بقدر عمره على الأقل. اعتماد scoped على singleton يتبع هذه القاعدة؛ أما الثلاثة الأخرى فتحبس object أقصر عمراً داخل آخر أطول."
      }
    },
    {
      q: {
        en: "What does ValidateScopes do?",
        ar: "ماذا يفعل الـ ValidateScopes؟"
      },
      options: [
        { en: "It disposes scoped services earlier to save memory", ar: "يعمل dispose للخدمات scoped مبكراً لتوفير الذاكرة" },
        { en: "It throws when a scoped service is resolved from the root provider", ar: "يرمي خطأ عند عمل resolve لخدمة scoped من الـ root provider" },
        { en: "It makes singletons thread-safe automatically", ar: "يجعل الـ singletons آمنة للـ threads تلقائياً" },
        { en: "It converts scoped registrations to transient at runtime", ar: "يحوّل التسجيلات scoped إلى transient وقت التشغيل" }
      ],
      correct: 1,
      why: {
        en: "Building a singleton resolves its dependencies from the root provider, so refusing scoped resolution there is exactly what catches a captive dependency.",
        ar: "بناء الـ singleton يعمل resolve لاعتمادياته من الـ root provider، لذا فإن رفض عمل resolve لخدمة scoped هناك هو بالضبط ما يمسك الـ captive dependency."
      }
    },
    {
      q: {
        en: "A BackgroundService needs a scoped repository. What is the correct approach?",
        ar: "يحتاج BackgroundService إلى repository من نوع scoped. ما الأسلوب الصحيح؟"
      },
      options: [
        { en: "Inject the repository in the constructor and keep it in a field", ar: "احقن الـ repository في الـ constructor واحتفظ به في field" },
        { en: "Register the repository as singleton so the lifetimes match", ar: "سجّل الـ repository كـ singleton لتتطابق الـ lifetimes" },
        { en: "Inject IServiceScopeFactory and create a scope per unit of work", ar: "احقن IServiceScopeFactory وأنشئ scope لكل وحدة عمل" },
        { en: "Resolve it from a static ServiceProvider held in a global field", ar: "اعمل resolve له من ServiceProvider ثابت محفوظ في field عام" }
      ],
      correct: 2,
      why: {
        en: "AddHostedService registers the worker as a singleton, so constructor injection captures the repository. A scope created per message or per run gives fresh, disposable dependencies.",
        ar: "الـ AddHostedService يسجّل الـ worker كـ singleton، فيؤدي الـ constructor injection إلى حبس الـ repository. إنشاء scope لكل message أو لكل تشغيل يعطي اعتماديات جديدة وقابلة لـ dispose."
      }
    },
    {
      q: {
        en: "Why is a disposable transient resolved into a singleton worse than an ordinary captive dependency?",
        ar: "لماذا يكون الـ transient القابل لـ dispose المحقون في singleton أسوأ من captive dependency عادي؟"
      },
      options: [
        { en: "The container never disposes it at all", ar: "الـ container لا يعمل له dispose إطلاقاً" },
        { en: "The root provider tracks it for disposal and only releases it at shutdown, so its resources leak for the whole process life", ar: "الـ root provider يتتبعه لعمل dispose ولا يحرّره إلا عند الإيقاف، فتتسرّب موارده طوال عمر الـ process" },
        { en: "Transient services are always thread-unsafe", ar: "الخدمات transient غير آمنة للـ threads دائماً" },
        { en: "ValidateScopes cannot detect any transient registration", ar: "الـ ValidateScopes لا يستطيع اكتشاف أي تسجيل transient" }
      ],
      correct: 1,
      why: {
        en: "Disposable services created while building a singleton are tracked on the root provider, which is disposed only when the application stops, so handles and connections stay open for hours.",
        ar: "الخدمات القابلة لـ dispose التي تُنشأ أثناء بناء singleton يتم تتبعها على الـ root provider، ولا يتم dispose له إلا عند إيقاف التطبيق، فتبقى الـ handles والـ connections مفتوحة لساعات."
      }
    }
  ]
};
```

NEXT: ef-tracking
