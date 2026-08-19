```js
const diRootLesson = {
  id: "di-root",
  moduleId: "di",
  title: { en: "The composition root", ar: "جذر التركيب" },
  summary: {
    en: "One place in the app decides which concrete class fills which interface — and no other file is allowed to ask the container for anything.",
    ar: "مكان واحد في التطبيق يقرر أي class فعلي يملأ أي interface — ولا يُسمح لأي ملف آخر أن يطلب شيئاً من الـ container."
  },
  mins: 11,
  sections: [
    {
      key: "why",
      blocks: [
        {
          t: "p",
          en: "A composition root is the single place in your program where you decide which real class is used for each interface. In ASP.NET Core it is the block of services.AddScoped(...) calls in Program.cs. Everything else in the app just receives what it needs through its constructor and never asks for anything.",
          ar: "الـ composition root هو المكان الوحيد في برنامجك الذي تقرر فيه أي class حقيقي يُستخدم لكل interface. في ASP.NET Core هو كتلة استدعاءات services.AddScoped(...) في Program.cs. كل شيء آخر في التطبيق يستقبل ما يحتاجه عبر الـ constructor ولا يطلب أي شيء بنفسه."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "Object graph", ar: "Object graph" },
              v: { en: "One object plus every object it holds, plus everything those hold. CheckoutHandler holds a repository, which holds a DbContext — that whole chain is the graph.", ar: "كائن واحد مع كل الكائنات التي يحملها، ومع ما تحمله تلك بدورها. CheckoutHandler يحمل repository، والـ repository يحمل DbContext — هذه السلسلة كلها هي الـ graph." }
            },
            {
              k: { en: "Composition root", ar: "Composition root" },
              v: { en: "The one place where that graph is wired up. In ASP.NET Core: Program.cs plus any extension methods it calls.", ar: "المكان الوحيد الذي يُبنى فيه ذلك الـ graph. في ASP.NET Core: Program.cs وأي extension methods يستدعيها." }
            },
            {
              k: { en: "Container", ar: "Container" },
              v: { en: "The library that builds the graph for you from a list of registrations. In ASP.NET Core it is IServiceProvider.", ar: "المكتبة التي تبني الـ graph نيابة عنك من قائمة تسجيلات. في ASP.NET Core هي IServiceProvider." }
            },
            {
              k: { en: "Service locator", ar: "Service locator" },
              v: { en: "Any code that calls the container itself to fetch a dependency mid-execution, such as provider.GetService<IEmailSender>() inside a handler.", ar: "أي كود يستدعي الـ container بنفسه ليجلب dependency أثناء التنفيذ، مثل provider.GetService<IEmailSender>() داخل handler." }
            },
            {
              k: { en: "Registration", ar: "Registration" },
              v: { en: "One line that maps an interface to a concrete class and a lifetime, e.g. AddScoped<IOrderRepository, SqlOrderRepository>().", ar: "سطر واحد يربط interface بـ class فعلي وبـ lifetime، مثل AddScoped<IOrderRepository, SqlOrderRepository>()." }
            },
            {
              k: { en: "Pure DI", ar: "Pure DI" },
              v: { en: "Building the graph by hand with new, without any container library. Perfectly valid for small apps.", ar: "بناء الـ graph يدوياً بـ new دون أي مكتبة container. خيار صحيح تماماً للتطبيقات الصغيرة." }
            }
          ]
        },
        {
          t: "p",
          en: "The rule exists because wiring decisions spread. A team starts with clean constructors, then one class needs a logger in a deep method, so someone grabs it from the container right there. Six months later the real dependency list of a class is scattered across its method bodies, and you cannot read a constructor to know what a class touches.",
          ar: "القاعدة موجودة لأن قرارات التركيب تنتشر. يبدأ الفريق بـ constructors نظيفة، ثم يحتاج class واحد إلى logger داخل method عميقة، فيجلبه أحدهم من الـ container هناك مباشرة. بعد ستة أشهر تصبح قائمة الـ dependencies الحقيقية موزعة داخل أجسام الـ methods، ولا تستطيع قراءة constructor لتعرف ما الذي يلمسه الـ class."
        },
        {
          t: "p",
          en: "Think of a building's electrical panel. Every circuit is decided in one metal box near the door. A lamp does not run its own wire back to the street; it plugs into a socket and receives power. The panel is the composition root, the socket is the constructor, and a class that calls the container is a lamp that drilled through the wall to tap the mains directly. It works, until someone needs to know what is actually connected.",
          ar: "تخيّل لوحة الكهرباء في مبنى. كل دائرة تُقرَّر في صندوق معدني واحد قرب الباب. المصباح لا يمدّ سلكاً خاصاً به إلى الشارع؛ بل يوصَل بمقبس ويستقبل الطاقة. اللوحة هي الـ composition root، والمقبس هو الـ constructor، والـ class الذي يستدعي الـ container هو مصباح ثقب الجدار ليصل إلى الخط الرئيسي مباشرة. يعمل، إلى أن يحتاج أحدهم أن يعرف ما المتصل فعلاً."
        },
        {
          t: "callout",
          kind: "note",
          en: "A composition root is a place, not a library. You can have a perfect composition root with zero container code — just a few new calls in Program.cs. The container is a convenience for large graphs, not the point.",
          ar: "الـ composition root مكان وليس مكتبة. يمكن أن يكون لديك composition root مثالي بلا أي كود container — فقط بضع استدعاءات new في Program.cs. الـ container وسيلة راحة للـ graphs الكبيرة، وليس الهدف."
        }
      ]
    },
    {
      key: "problem",
      blocks: [
        {
          t: "p",
          en: "Take one endpoint: POST /orders, handled by CheckoutHandler. It needs three things — a repository to save the order, a payment gateway to charge the card, and an email sender for the receipt. In the broken version the constructor takes only IServiceProvider, and each dependency is fetched inside the method with GetRequiredService. The constructor tells you nothing.",
          ar: "خذ endpoint واحداً: POST /orders يعالجه CheckoutHandler. يحتاج ثلاثة أشياء — repository لحفظ الـ order، وpayment gateway لسحب المبلغ من البطاقة، وemail sender لإرسال الإيصال. في النسخة السيئة يأخذ الـ constructor فقط IServiceProvider، وكل dependency يُجلب داخل الـ method بـ GetRequiredService. الـ constructor لا يخبرك بشيء."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "Reading the class", ar: "قراءة الـ class" },
              v: { en: "Before: you must read all 240 lines of the method bodies to list the dependencies. After: the constructor signature lists all three on one line.", ar: "قبل: عليك قراءة 240 سطراً من أجسام الـ methods لتحصر الـ dependencies. بعد: توقيع الـ constructor يعرضها الثلاثة في سطر واحد." }
            },
            {
              k: { en: "Writing a unit test", ar: "كتابة unit test" },
              v: { en: "Before: the test must build a fake IServiceProvider that answers three different GetRequiredService calls. After: new CheckoutHandler(fakeRepo, fakeGateway, fakeMail) — one line.", ar: "قبل: على الاختبار بناء IServiceProvider وهمي يجيب على ثلاثة استدعاءات GetRequiredService مختلفة. بعد: new CheckoutHandler(fakeRepo, fakeGateway, fakeMail) — سطر واحد." }
            },
            {
              k: { en: "When a registration is missing", ar: "عند نسيان تسجيل" },
              v: { en: "Before: the app starts fine and throws at 3 a.m. on the first checkout. After: startup validation throws on boot, before any user sees it.", ar: "قبل: التطبيق يقلع بشكل سليم ثم يرمي exception الساعة 3 صباحاً عند أول عملية شراء. بعد: التحقق عند الإقلاع يرمي فوراً، قبل أن يرى أي مستخدم ذلك." }
            },
            {
              k: { en: "Swapping an implementation", ar: "تبديل تنفيذ" },
              v: { en: "Before: you grep the whole solution for GetRequiredService<IPaymentGateway>. After: you change one line in Program.cs.", ar: "قبل: تبحث في الحل كله عن GetRequiredService<IPaymentGateway>. بعد: تغيّر سطراً واحداً في Program.cs." }
            }
          ]
        },
        {
          t: "p",
          en: "The cost is not style. A class that hides its dependencies breaks the compiler's ability to help you. Add a fourth dependency to a constructor and every caller and every test fails to compile until it is handled — that is a loud, immediate signal. Add a fourth GetRequiredService call inside a method and nothing fails until that line runs in production.",
          ar: "التكلفة ليست مسألة أسلوب. الـ class الذي يخفي dependencies يعطّل قدرة الـ compiler على مساعدتك. أضف dependency رابعاً إلى constructor فيفشل كل مستدعٍ وكل اختبار في الترجمة حتى تعالجه — إشارة صريحة وفورية. أضف استدعاء GetRequiredService رابعاً داخل method فلا يفشل شيء حتى ينفَّذ ذلك السطر في الإنتاج."
        }
      ]
    },
    {
      key: "internals",
      blocks: [
        {
          t: "p",
          en: "Here is what actually happens on one request, in order. At startup, each services.Add... call appends a ServiceDescriptor to a list — a small record holding the interface, the concrete type or factory, and the lifetime. Nothing is created yet; the list is only a plan. Then Build() freezes that list into the root IServiceProvider.",
          ar: "إليك ما يحدث فعلياً في request واحد، بالترتيب. عند الإقلاع، كل استدعاء services.Add... يضيف ServiceDescriptor إلى قائمة — سجل صغير يحمل الـ interface والنوع الفعلي أو الـ factory والـ lifetime. لا شيء يُنشأ بعد؛ القائمة مجرد خطة. ثم يجمّد Build() تلك القائمة في IServiceProvider الجذري."
        },
        {
          t: "p",
          en: "When a request arrives, ASP.NET Core creates a scope — a child container that lives exactly as long as that request and tracks everything it created. It asks that scope for CheckoutHandler. The container reads CheckoutHandler's single public constructor, sees it wants IOrderRepository, IPaymentGateway and IEmailSender, and resolves each one first, recursively. Then it calls the constructor with the finished objects. When the response is written, the scope is disposed and every IDisposable it created is disposed with it.",
          ar: "عند وصول request ينشئ ASP.NET Core scope — container ابن يعيش بالضبط بطول ذلك الـ request ويتتبّع كل ما أنشأه. يطلب من ذلك الـ scope كائن CheckoutHandler. يقرأ الـ container الـ constructor العام الوحيد لـ CheckoutHandler، يرى أنه يريد IOrderRepository و IPaymentGateway و IEmailSender، فيحلّ كلاً منها أولاً بشكل تكراري. ثم يستدعي الـ constructor بالكائنات الجاهزة. وعند كتابة الـ response يُتخلَّص من الـ scope ويُتخلَّص معه من كل IDisposable أنشأه."
        },
        {
          t: "p",
          en: "Notice where the container appears in that story: at the very edge, in framework code, exactly once per request. That single call is the composition root doing its job. Your handler never sees the container at all — it just receives three ready objects. This is the whole difference between dependency injection and a service locator: who makes the call.",
          ar: "لاحظ أين يظهر الـ container في هذه القصة: عند الحافة تماماً، داخل كود الـ framework، مرة واحدة لكل request. ذلك الاستدعاء الوحيد هو الـ composition root وهو يؤدي عمله. الـ handler لديك لا يرى الـ container إطلاقاً — بل يستقبل ثلاثة كائنات جاهزة. هذا هو كامل الفرق بين dependency injection و service locator: من يقوم بالاستدعاء."
        },
        {
          t: "p",
          en: "The analogy is a restaurant kitchen. Ingredients are gathered at the pass before the dish is started; the cook does not walk to the storeroom in the middle of plating. Gathering at the pass is constructor injection. Walking to the storeroom mid-dish is service locator — it works, but now nobody can tell from the recipe what the dish contains.",
          ar: "التشبيه هو مطبخ مطعم. تُجمع المكوّنات عند نقطة التحضير قبل بدء الطبق؛ الطاهي لا يمشي إلى المخزن في منتصف التقديم. الجمع عند نقطة التحضير هو constructor injection. المشي إلى المخزن أثناء الطبق هو service locator — يعمل، لكن لا أحد يستطيع أن يعرف من الوصفة ما الذي يحتويه الطبق."
        },
        {
          t: "code",
          lang: "csharp",
          label: { en: "Service locator vs constructor injection", ar: "Service locator مقابل constructor injection" },
          code: "// BAD - dependencies hidden inside method bodies\npublic sealed class CheckoutHandler\n{\n    private readonly IServiceProvider _sp;\n    public CheckoutHandler(IServiceProvider sp) => _sp = sp;\n\n    public async Task<Guid> HandleAsync(CheckoutCommand cmd, CancellationToken ct)\n    {\n        // nothing in the constructor told you these three exist\n        var repo    = _sp.GetRequiredService<IOrderRepository>();\n        var gateway = _sp.GetRequiredService<IPaymentGateway>();\n        var mail    = _sp.GetRequiredService<IEmailSender>();\n        ...\n    }\n}\n\n// GOOD - the constructor is the honest dependency list\npublic sealed class CheckoutHandler\n{\n    private readonly IOrderRepository _repo;\n    private readonly IPaymentGateway _gateway;\n    private readonly IEmailSender _mail;\n\n    public CheckoutHandler(IOrderRepository repo, IPaymentGateway gateway, IEmailSender mail)\n        => (_repo, _gateway, _mail) = (repo, gateway, mail);\n\n    public async Task<Guid> HandleAsync(CheckoutCommand cmd, CancellationToken ct)\n    {\n        var order = await _repo.CreateAsync(cmd.Items, ct);\n        await _gateway.ChargeAsync(order.Total, cmd.Card, ct);\n        await _mail.SendReceiptAsync(order, ct);\n        return order.Id;\n    }\n}"
        },
        {
          t: "code",
          lang: "csharp",
          label: { en: "The composition root itself", ar: "الـ composition root نفسه" },
          code: "// Program.cs - the only file that names concrete classes\nvar builder = WebApplication.CreateBuilder(args);\n\nbuilder.Services.AddOrdering(builder.Configuration);   // one module, one method\nbuilder.Services.AddPayments(builder.Configuration);\n\nvar app = builder.Build();\napp.MapPost(\"/orders\", async (CheckoutCommand cmd, CheckoutHandler h, CancellationToken ct)\n    => Results.Ok(await h.HandleAsync(cmd, ct)));\napp.Run();\n\n// Ordering/DependencyInjection.cs - still part of the composition root\npublic static IServiceCollection AddOrdering(this IServiceCollection s, IConfiguration cfg)\n{\n    s.AddScoped<CheckoutHandler>();\n    s.AddScoped<IOrderRepository, SqlOrderRepository>();\n    s.AddSingleton<IClock, SystemClock>();\n    return s;\n}"
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "ServiceDescriptor", ar: "ServiceDescriptor" },
              v: { en: "The record produced by one Add call: interface + implementation + lifetime. The registration list is just a List of these.", ar: "السجل الناتج عن استدعاء Add واحد: interface + implementation + lifetime. قائمة التسجيلات مجرد List من هذه." }
            },
            {
              k: { en: "Root provider", ar: "Root provider" },
              v: { en: "The provider created by Build(). It lives for the whole process and owns every singleton.", ar: "الـ provider الذي ينشئه Build(). يعيش طوال عمر العملية ويملك كل singleton." }
            },
            {
              k: { en: "Scope", ar: "Scope" },
              v: { en: "A child provider created per request. It owns scoped objects and disposes them when the request ends.", ar: "provider ابن يُنشأ لكل request. يملك الكائنات الـ scoped ويتخلص منها عند انتهاء الـ request." }
            },
            {
              k: { en: "Constructor selection", ar: "اختيار الـ constructor" },
              v: { en: "The container picks the public constructor whose parameters it can all satisfy. Two equally satisfiable constructors is an error — keep one.", ar: "يختار الـ container الـ constructor العام الذي يستطيع تلبية كل معاملاته. وجود اثنين قابلين للتلبية بالتساوي خطأ — أبقِ واحداً." }
            },
            {
              k: { en: "Registration order", ar: "ترتيب التسجيل" },
              v: { en: "For one interface, the last registration wins when you resolve a single instance. Resolving IEnumerable of it gives you all of them in registration order.", ar: "لـ interface واحد يفوز آخر تسجيل عند طلب نسخة واحدة. طلب IEnumerable منه يعطيك كلها بترتيب التسجيل." }
            }
          ]
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
              "A constructor is an honest, compiler-checked list of what a class touches.",
              "Swapping a real implementation for a fake, or SQL for Postgres, is one line in one file.",
              "Missing or misconfigured wiring fails at startup instead of on a live request.",
              "Unit tests construct the class directly, with no container and no framework."
            ],
            ar: [
              "الـ constructor قائمة صادقة يفحصها الـ compiler لما يلمسه الـ class.",
              "تبديل تنفيذ حقيقي بآخر وهمي، أو SQL بـ Postgres، سطر واحد في ملف واحد.",
              "التركيب الناقص أو الخاطئ يفشل عند الإقلاع بدل الفشل على request حي.",
              "الاختبارات تبني الـ class مباشرة بلا container وبلا framework."
            ]
          },
          cons: {
            en: [
              "Program.cs grows long, and one bad registration can break the whole app at boot.",
              "Constructors with eight parameters look ugly — but that is the class being too big, not the pattern failing.",
              "Some frameworks create objects themselves and give you no constructor to inject into.",
              "Registration mistakes are runtime errors, not compile errors, unless you validate at startup."
            ],
            ar: [
              "Program.cs يطول، وتسجيل واحد خاطئ قد يعطّل التطبيق كله عند الإقلاع.",
              "الـ constructors ذات ثمانية معاملات تبدو قبيحة — لكن هذا يعني أن الـ class كبير جداً، لا أن النمط فشل.",
              "بعض الـ frameworks تنشئ الكائنات بنفسها ولا تعطيك constructor لتحقن فيه.",
              "أخطاء التسجيل أخطاء runtime لا أخطاء ترجمة، إلا إذا تحققت عند الإقلاع."
            ]
          },
          limits: {
            en: [
              "It does not help with objects created per item inside a loop — use a factory for those.",
              "Static helpers, extension methods and entities constructed with new are outside the graph entirely.",
              "Background services and message consumers must open their own scope by hand.",
              "It cannot make a badly split class testable; it only exposes how many things the class does."
            ],
            ar: [
              "لا يساعد في الكائنات التي تُنشأ لكل عنصر داخل loop — استخدم factory لها.",
              "الـ static helpers و extension methods والـ entities المنشأة بـ new خارج الـ graph تماماً.",
              "الـ background services ومستهلكو الرسائل عليهم فتح scope خاص بهم يدوياً.",
              "لا يجعل class سيئ التقسيم قابلاً للاختبار؛ هو فقط يكشف كم مهمة يؤديها."
            ]
          },
          alts: {
            en: [
              "Pure DI: build the graph with new in Program.cs, no container library at all.",
              "Inject a typed factory (IOrderExporterFactory) when you need an object per loop item.",
              "Pass a value as a method parameter instead of a dependency when it changes per call.",
              "Use Func<T> or Lazy<T> when a dependency is expensive and rarely used."
            ],
            ar: [
              "Pure DI: ابنِ الـ graph بـ new في Program.cs بلا مكتبة container.",
              "احقن factory مكتوبة النوع (IOrderExporterFactory) عند الحاجة إلى كائن لكل عنصر في loop.",
              "مرّر القيمة كمعامل method بدل جعلها dependency عندما تتغير مع كل استدعاء.",
              "استخدم Func<T> أو Lazy<T> عندما يكون الـ dependency مكلفاً ونادر الاستخدام."
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
          title: { en: "Injecting IServiceProvider to avoid a long constructor", ar: "حقن IServiceProvider هرباً من constructor طويل" },
          body: {
            en: "A team hit a nine-parameter constructor on CheckoutHandler and replaced all nine with IServiceProvider. The class kept doing nine things; it just stopped saying so. Six weeks later a refactor deleted the IEmailSender registration, the build stayed green, and receipts silently stopped going out for two days. The long constructor was the warning; hiding it removed the warning, not the problem.",
            ar: "واجه فريق constructor بتسعة معاملات في CheckoutHandler فاستبدلها كلها بـ IServiceProvider. بقي الـ class يؤدي تسع مهام؛ فقط توقف عن الإفصاح عنها. بعد ستة أسابيع حذف refactor تسجيل IEmailSender، وبقي الـ build أخضر، وتوقف إرسال الإيصالات بصمت ليومين. الـ constructor الطويل كان التحذير؛ إخفاؤه أزال التحذير لا المشكلة."
          },
          fix: "// split by responsibility instead\npublic CheckoutHandler(IOrderRepository repo, IPaymentGateway gateway, IEmailSender mail) { ... }\npublic RefundHandler(IOrderRepository repo, IPaymentGateway gateway) { ... }"
        },
        {
          t: "mistake",
          title: { en: "Resolving from the root provider inside a background job", ar: "الحل من الـ root provider داخل background job" },
          body: {
            en: "A nightly job called _rootProvider.GetRequiredService<AppDbContext>() directly instead of creating a scope. The DbContext was registered as scoped, but resolved from the root it was never disposed, so it lived for the whole process and its change tracker accumulated every entity from every night. Memory grew about 400 MB per week — meaning the pod was restarted by the platform roughly every eight days.",
            ar: "استدعت مهمة ليلية _rootProvider.GetRequiredService<AppDbContext>() مباشرة بدل إنشاء scope. كان الـ DbContext مسجلاً كـ scoped، لكن حلّه من الجذر يعني أنه لم يُتخلص منه أبداً، فعاش طوال عمر العملية وتراكمت في الـ change tracker كل entity من كل ليلة. نمت الذاكرة نحو 400 MB أسبوعياً — أي أن الـ pod كان يُعاد تشغيله من المنصة كل ثمانية أيام تقريباً."
          },
          fix: "using var scope = _scopeFactory.CreateScope();\nvar db = scope.ServiceProvider.GetRequiredService<AppDbContext>();\nawait DoNightlyWorkAsync(db, ct);   // disposed with the scope"
        },
        {
          t: "mistake",
          title: { en: "A second composition root inside a library", ar: "composition root ثانٍ داخل مكتبة" },
          body: {
            en: "A shared Payments library built its own ServiceCollection internally so it could be used without setup. The host app registered a real IClock for testing; the library kept building its own SystemClock from its private container. Time-travel tests passed in the app and failed inside payment logic, and it took a day to find because both objects had the same type name.",
            ar: "بنت مكتبة Payments مشتركة ServiceCollection خاصاً بها داخلياً لتُستخدم بلا إعداد. سجّل التطبيق المضيف IClock حقيقياً لأغراض الاختبار؛ وبقيت المكتبة تبني SystemClock الخاص بها من container خاص. نجحت اختبارات تغيير الوقت في التطبيق وفشلت داخل منطق الدفع، واستغرق اكتشاف السبب يوماً لأن الكائنين يحملان نفس اسم النوع."
          },
          fix: "// a library exposes registrations, it does not build a provider\npublic static IServiceCollection AddPayments(this IServiceCollection s, IConfiguration cfg) { ... }"
        },
        {
          t: "mistake",
          title: { en: "Doing real work in a constructor", ar: "تنفيذ عمل حقيقي داخل constructor" },
          body: {
            en: "SqlOrderRepository opened a database connection and ran a warm-up query in its constructor. Because the container builds the graph before the handler runs, every request paid that cost even when the endpoint short-circuited on a validation error. p99 latency was 900 ms — meaning the slowest 1 in 100 requests took nearly a second — for a request that did no database work at all.",
            ar: "كان SqlOrderRepository يفتح اتصال قاعدة بيانات وينفّذ استعلام تسخين داخل الـ constructor. ولأن الـ container يبني الـ graph قبل تشغيل الـ handler، دفع كل request تلك التكلفة حتى عندما ينتهي الـ endpoint مبكراً بخطأ تحقق. كان p99 يساوي 900 ms — أي أن أبطأ request من كل 100 استغرق قرابة الثانية — لطلب لم يلمس قاعدة البيانات إطلاقاً."
          },
          fix: "// constructors only assign fields; do work in the method\npublic SqlOrderRepository(NpgsqlDataSource ds) => _ds = ds;\npublic async Task<Order> CreateAsync(...) { await using var conn = await _ds.OpenConnectionAsync(ct); ... }"
        }
      ]
    },
    {
      key: "interview",
      blocks: [
        {
          t: "qa",
          level: "junior",
          q: { en: "What is a composition root?", ar: "ما هو الـ composition root؟" },
          a: {
            en: "It is the one place in the app where you decide which concrete class fills each interface. In ASP.NET Core that is Program.cs and the AddX extension methods it calls. Everywhere else, classes just take what they need in the constructor. The point is that if I want to know what the app is actually made of, there is exactly one file to read.",
            ar: "هو المكان الوحيد في التطبيق الذي تقرر فيه أي class فعلي يملأ كل interface. في ASP.NET Core هو Program.cs وامتدادات AddX التي يستدعيها. في كل مكان آخر تأخذ الـ classes ما تحتاجه في الـ constructor. الفكرة أنني إن أردت معرفة مما يتكوّن التطبيق فعلاً، هناك ملف واحد بالضبط أقرأه."
          }
        },
        {
          t: "qa",
          level: "mid",
          q: { en: "Why is calling GetRequiredService inside a service considered an anti-pattern?", ar: "لماذا يُعد استدعاء GetRequiredService داخل service نمطاً سيئاً؟" },
          a: {
            en: "Because it hides the dependency from the constructor, and the constructor is the only thing the compiler and the reader can trust. If I add a dependency the honest way, every test stops compiling until I supply it. If I add it with GetRequiredService, nothing fails until that exact line runs in production. It also makes the class depend on the container, so I cannot test it without one.",
            ar: "لأنه يخفي الـ dependency عن الـ constructor، والـ constructor هو الشيء الوحيد الذي يثق به الـ compiler والقارئ. إن أضفت dependency بالطريقة الصادقة تتوقف كل الاختبارات عن الترجمة حتى أوفّره. وإن أضفته بـ GetRequiredService لا يفشل شيء حتى ينفَّذ ذلك السطر بالضبط في الإنتاج. كما يجعل الـ class يعتمد على الـ container فلا أستطيع اختباره بدونه."
          }
        },
        {
          t: "qa",
          level: "mid",
          q: { en: "Are there legitimate places to touch the container directly?", ar: "هل توجد أماكن مشروعة للتعامل مع الـ container مباشرة؟" },
          a: {
            en: "Yes, at the edges. Framework integration points, middleware that must resolve per request, and background jobs that create a scope with IServiceScopeFactory — those are all composition root code, just not in Program.cs. The test is simple: is this a place that starts a unit of work, or is it business logic? Starting a unit of work may resolve. Business logic never does.",
            ar: "نعم، عند الحواف. نقاط التكامل مع الـ framework، والـ middleware الذي يجب أن يحل لكل request، والـ background jobs التي تنشئ scope بـ IServiceScopeFactory — كلها كود composition root وإن لم تكن في Program.cs. الاختبار بسيط: هل هذا مكان يبدأ وحدة عمل، أم منطق أعمال؟ الذي يبدأ وحدة عمل قد يحل. منطق الأعمال لا يفعل أبداً."
          }
        },
        {
          t: "qa",
          level: "senior",
          q: { en: "How do you handle needing many instances of something at runtime, like one exporter per file?", ar: "كيف تتعامل مع الحاجة إلى نسخ كثيرة من شيء أثناء التشغيل، مثل exporter لكل ملف؟" },
          a: {
            en: "I inject a factory interface I own, not the container. Something like IOrderExporterFactory with a Create(string format) method. The factory implementation lives next to the composition root and is allowed to know about concrete types. My business class then depends on one narrow interface it can fake in a test, instead of on IServiceProvider, which can produce anything.",
            ar: "أحقن factory interface أملكه أنا، لا الـ container. شيء مثل IOrderExporterFactory بـ method اسمها Create(string format). تنفيذ الـ factory يعيش بجوار الـ composition root ويُسمح له بمعرفة الأنواع الفعلية. عندها يعتمد class الأعمال لدي على interface ضيق واحد أستطيع تزييفه في اختبار، بدل الاعتماد على IServiceProvider الذي ينتج أي شيء."
          }
        },
        {
          t: "qa",
          level: "senior",
          q: { en: "Do you need a DI container at all?", ar: "هل تحتاج إلى DI container أصلاً؟" },
          a: {
            en: "No. Dependency injection is passing dependencies in; a container is just automation for that. For a small service I can wire the whole graph by hand in Program.cs with new, and get compile-time checking of the wiring for free. I reach for a container when the graph is deep, when lifetimes differ per request, or when the framework already provides one — which in ASP.NET Core it does.",
            ar: "لا. الـ dependency injection هو تمرير الـ dependencies للداخل؛ والـ container مجرد أتمتة لذلك. في خدمة صغيرة أستطيع تركيب الـ graph كله يدوياً في Program.cs بـ new، وأحصل مجاناً على فحص التركيب وقت الترجمة. ألجأ إلى container عندما يكون الـ graph عميقاً، أو تختلف الـ lifetimes لكل request، أو عندما يوفره الـ framework أصلاً — وهذا حال ASP.NET Core."
          }
        },
        {
          t: "qa",
          level: "staff",
          q: { en: "A large codebase has service locator calls in 200 places. How do you actually fix that across a team?", ar: "قاعدة كود كبيرة فيها استدعاءات service locator في 200 موضع. كيف تصلح ذلك فعلياً على مستوى فريق؟" },
          a: {
            en: "I would not open a 200-file pull request; nobody can review that. First I stop the bleeding: an analyzer or architecture test that fails the build if IServiceProvider is injected into anything outside the composition root project, with the existing 200 in a baseline file. Then each team removes its own entries as it touches those files, and the baseline count is a visible number in the weekly engineering review. I would also add ValidateOnBuild and ValidateScopes in every environment so wiring errors become boot failures. The mechanism matters more than the cleanup: without the analyzer the count starts growing again the month after the migration ends.",
            ar: "لن أفتح pull request بـ 200 ملف؛ لا أحد يستطيع مراجعته. أوقف النزيف أولاً: analyzer أو architecture test يفشل الـ build إذا حُقن IServiceProvider في أي شيء خارج مشروع الـ composition root، مع وضع الـ 200 الحالية في ملف baseline. ثم يزيل كل فريق مواضعه أثناء عمله على تلك الملفات، ويكون رقم الـ baseline رقماً ظاهراً في مراجعة الهندسة الأسبوعية. كما أضيف ValidateOnBuild و ValidateScopes في كل البيئات ليصبح خطأ التركيب فشلاً عند الإقلاع. الآلية أهم من التنظيف: بلا الـ analyzer يعود الرقم للنمو في الشهر التالي لانتهاء الترحيل."
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
          title: { en: "Business class depends on IServiceProvider", ar: "class أعمال يعتمد على IServiceProvider" },
          bad: "public sealed class InvoiceService\n{\n    private readonly IServiceProvider _sp;\n    public InvoiceService(IServiceProvider sp) => _sp = sp;\n\n    public async Task IssueAsync(Guid orderId, CancellationToken ct)\n    {\n        var repo = _sp.GetRequiredService<IOrderRepository>();\n        var pdf  = _sp.GetRequiredService<IPdfRenderer>();\n        var mail = _sp.GetRequiredService<IEmailSender>();\n        ...\n    }\n}",
          good: "public sealed class InvoiceService\n{\n    private readonly IOrderRepository _repo;\n    private readonly IPdfRenderer _pdf;\n    private readonly IEmailSender _mail;\n\n    public InvoiceService(IOrderRepository repo, IPdfRenderer pdf, IEmailSender mail)\n        => (_repo, _pdf, _mail) = (repo, pdf, mail);\n\n    public async Task IssueAsync(Guid orderId, CancellationToken ct) { ... }\n}",
          why: {
            en: "The bad version compiles even after IPdfRenderer is unregistered, and fails only when an invoice is issued. The good version is a compile error the moment a dependency disappears, and a test can build it with three fakes and no container.",
            ar: "النسخة السيئة تُترجم حتى بعد إلغاء تسجيل IPdfRenderer، وتفشل فقط عند إصدار فاتورة. النسخة الجيدة تصبح خطأ ترجمة لحظة اختفاء أي dependency، ويستطيع الاختبار بناءها بثلاثة كائنات وهمية وبلا container."
          }
        },
        {
          t: "review",
          severity: "medium",
          title: { en: "A library builds its own provider", ar: "مكتبة تبني provider خاصاً بها" },
          bad: "// inside the shared Payments package\npublic static class PaymentsBootstrap\n{\n    private static readonly IServiceProvider Provider = new ServiceCollection()\n        .AddSingleton<IClock, SystemClock>()\n        .AddSingleton<IPaymentGateway, StripeGateway>()\n        .BuildServiceProvider();\n\n    public static IPaymentGateway Gateway => Provider.GetRequiredService<IPaymentGateway>();\n}",
          good: "// the library only offers registrations; the host decides\npublic static class PaymentsRegistration\n{\n    public static IServiceCollection AddPayments(this IServiceCollection s, IConfiguration cfg)\n    {\n        s.AddSingleton<IPaymentGateway, StripeGateway>();\n        s.TryAddSingleton<IClock, SystemClock>();   // host can override\n        return s;\n    }\n}",
          why: {
            en: "A second provider means a second set of singletons the host cannot see, configure or replace. TryAddSingleton registers a default only if the host has not already registered its own, so a test clock actually wins.",
            ar: "وجود provider ثانٍ يعني مجموعة singletons ثانية لا يراها المضيف ولا يضبطها ولا يستبدلها. TryAddSingleton يسجّل الافتراضي فقط إن لم يسجّل المضيف واحداً خاصاً به، فيفوز clock الاختبار فعلاً."
          }
        }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        {
          t: "p",
          en: "In a service with several entry points — HTTP endpoints, a message consumer, a nightly job and a CLI admin tool — each entry point is its own composition root. They share the same AddOrdering registration method but each builds its provider and starts its own scopes. This is why registration code belongs in per-module extension methods rather than inline in Program.cs: the CLI can reuse AddOrdering without dragging in HTTP concerns.",
          ar: "في خدمة بعدة نقاط دخول — HTTP endpoints ومستهلك رسائل ومهمة ليلية وأداة إدارة CLI — كل نقطة دخول هي composition root خاص بها. كلها تشترك في نفس method التسجيل AddOrdering لكن كلاً منها يبني provider خاصاً به ويفتح scopes خاصة به. لهذا يجب أن يعيش كود التسجيل في extension methods لكل module بدل كتابته داخل Program.cs: تستطيع أداة الـ CLI إعادة استخدام AddOrdering دون جرّ اهتمامات HTTP معها."
        },
        {
          t: "ul",
          en: [
            "One registration method per module (AddOrdering, AddPayments), each owning only its own types.",
            "Environment differences live at the root: a real gateway in production, a fake one in local development, chosen by one if statement.",
            "Message consumers create a scope per message so each message gets a fresh DbContext, exactly like an HTTP request.",
            "Integration tests replace one registration in the root and leave the other 60 alone — that is the main practical payoff.",
            "Startup validation runs in every environment, so a bad registration fails the deployment health check instead of a customer request."
          ],
          ar: [
            "method تسجيل واحدة لكل module (AddOrdering و AddPayments)، كل منها يملك أنواعه فقط.",
            "اختلافات البيئات تعيش عند الجذر: gateway حقيقي في الإنتاج وآخر وهمي في التطوير المحلي، يختارهما شرط if واحد.",
            "مستهلكو الرسائل ينشئون scope لكل رسالة فتحصل كل رسالة على DbContext جديد، تماماً كـ HTTP request.",
            "اختبارات التكامل تستبدل تسجيلاً واحداً في الجذر وتترك الستين الآخرين — وهذا هو المكسب العملي الأساسي.",
            "التحقق عند الإقلاع يعمل في كل البيئات، فيفشل التسجيل الخاطئ في فحص صحة النشر بدل أن يفشل في طلب عميل."
          ]
        },
        {
          t: "callout",
          kind: "tip",
          en: "Turn on both validation flags in every environment, not just development: ValidateOnBuild checks that every registration can actually be constructed, and ValidateScopes catches a singleton holding a scoped object. Both convert a 3 a.m. incident into a failed deploy.",
          ar: "فعّل كلا خياري التحقق في كل البيئات لا في التطوير فقط: ValidateOnBuild يتأكد أن كل تسجيل قابل للبناء فعلاً، و ValidateScopes يكشف singleton يحمل كائناً scoped. كلاهما يحوّل حادثة الساعة 3 صباحاً إلى نشر فاشل."
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
              v: { en: "Resolving a graph is reflection once, then a compiled factory that is cached. Cost is roughly tens of nanoseconds per object after warm-up — irrelevant next to one database call.", ar: "حل الـ graph يستخدم reflection مرة واحدة ثم factory مترجمة ومخزنة. التكلفة نحو عشرات النانوثانية لكل كائن بعد التسخين — لا تُذكر بجانب استدعاء قاعدة بيانات واحد." }
            },
            {
              k: { en: "Memory", ar: "الذاكرة" },
              v: { en: "Each scope allocates a small list to track disposables. Resolving scoped services from the root provider instead leaks them for the life of the process.", ar: "كل scope يخصص قائمة صغيرة لتتبع الكائنات القابلة للتخلص. أما حل الخدمات الـ scoped من الـ root provider فيسرّبها طوال عمر العملية." }
            },
            {
              k: { en: "Latency", ar: "زمن الاستجابة" },
              v: { en: "Work done in a constructor is paid on every request that resolves the class, even if the method is never called. Keep constructors to field assignment.", ar: "العمل داخل الـ constructor يُدفع في كل request يحل ذلك الـ class، حتى لو لم تُستدعَ الـ method أبداً. اجعل الـ constructors مجرد إسناد حقول." }
            },
            {
              k: { en: "Startup", ar: "الإقلاع" },
              v: { en: "ValidateOnBuild constructs every registration once at boot. On a large app this adds a few hundred milliseconds to startup and is worth it.", ar: "ValidateOnBuild يبني كل تسجيل مرة عند الإقلاع. في تطبيق كبير يضيف بضع مئات من الميلي ثانية إلى وقت البدء ويستحق ذلك." }
            },
            {
              k: { en: "Scalability", ar: "قابلية التوسّع" },
              v: { en: "Scoped lifetimes keep per-request state out of shared objects, which is what lets you run many instances of the service behind a load balancer safely.", ar: "الـ scoped lifetimes تُبقي حالة الـ request خارج الكائنات المشتركة، وهذا ما يسمح بتشغيل نسخ كثيرة من الخدمة خلف load balancer بأمان." }
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
            "Grep the solution for GetRequiredService and GetService outside the composition root project — every hit outside Program.cs, middleware or a job host is a candidate service locator.",
            "Set ValidateOnBuild = true and run the app: the exception message names the exact interface that has no registration.",
            "Set ValidateScopes = true and hit the endpoint: it throws with the singleton and the scoped type it wrongly captured.",
            "Dump the registrations at startup by looping over IServiceCollection and logging ServiceType, ImplementationType and Lifetime — this instantly shows a duplicate registration where the last one silently wins.",
            "In a memory dump (dotnet-dump analyze, then dumpheap -stat), a growing count of DbContext instances usually means something resolved a scoped service from the root provider."
          ],
          ar: [
            "ابحث في الحل عن GetRequiredService و GetService خارج مشروع الـ composition root — كل نتيجة خارج Program.cs أو middleware أو مضيف job هي service locator محتمل.",
            "اضبط ValidateOnBuild = true وشغّل التطبيق: رسالة الـ exception تذكر بالضبط الـ interface الذي بلا تسجيل.",
            "اضبط ValidateScopes = true واستدعِ الـ endpoint: يرمي exception يذكر الـ singleton والنوع الـ scoped الذي احتجزه خطأً.",
            "اطبع التسجيلات عند الإقلاع بالمرور على IServiceCollection وتسجيل ServiceType و ImplementationType و Lifetime — هذا يكشف فوراً تسجيلاً مكرراً يفوز فيه الأخير بصمت.",
            "في memory dump (dotnet-dump analyze ثم dumpheap -stat)، تزايد عدد نسخ DbContext يعني عادةً أن شيئاً حلّ خدمة scoped من الـ root provider."
          ]
        },
        {
          t: "callout",
          kind: "tip",
          en: "Before debugging a wiring bug, log the resolved implementation type at startup for the interface you suspect: logger.LogInformation(\"IClock -> {Type}\", clock.GetType().Name). Half of these bugs are simply a second registration overriding the first.",
          ar: "قبل تتبع خطأ تركيب، سجّل نوع التنفيذ المُحَل عند الإقلاع للـ interface المشتبه به: logger.LogInformation(\"IClock -> {Type}\", clock.GetType().Name). نصف هذه الأخطاء ببساطة تسجيل ثانٍ يتجاوز الأول."
        }
      ]
    },
    {
      key: "realworld",
      blocks: [
        {
          t: "p",
          en: "The composition root earns its keep the first time a system needs the same business code in two hosts, or needs a real dependency swapped for a fake in a test suite. Teams that skipped it usually discover the cost during a migration: the code compiles fine, but the concrete class names are sprinkled through hundreds of methods, so there is no single place to change them.",
          ar: "يثبت الـ composition root قيمته أول مرة يحتاج فيها النظام إلى نفس كود الأعمال في مضيفين مختلفين، أو إلى استبدال dependency حقيقي بآخر وهمي في مجموعة اختبارات. الفرق التي تجاوزته تكتشف التكلفة عادةً أثناء ترحيل: الكود يُترجم بلا مشاكل، لكن أسماء الـ classes الفعلية منثورة في مئات الـ methods، فلا يوجد مكان واحد لتغييرها."
        },
        {
          t: "ul",
          en: [
            "Payment platforms register a real card gateway in production and a deterministic fake in the sandbox environment, from one if statement at the root — no code in the domain knows which is live.",
            "Multi-tenant SaaS resolves a tenant-specific connection string per request, so the root registers a scoped factory and every repository below it stays tenant-agnostic.",
            "E-commerce backends run the same order code behind an HTTP API and a queue consumer; each host is a separate root reusing one AddOrdering method.",
            "Regulated systems (health, finance) rely on the root as the audit point: one file shows which concrete implementations are in production, which auditors can read without reading the app."
          ],
          ar: [
            "منصات الدفع تسجّل gateway بطاقات حقيقياً في الإنتاج وآخر وهمياً حتمياً في بيئة الاختبار، عبر شرط if واحد عند الجذر — ولا يعرف أي كود في المجال أيهما يعمل.",
            "أنظمة SaaS متعددة المستأجرين تحلّ connection string خاصاً بكل مستأجر لكل request، فيسجل الجذر factory بعمر scoped وتبقى كل الـ repositories تحته غير مرتبطة بالمستأجر.",
            "أنظمة التجارة الإلكترونية تشغّل نفس كود الطلبات خلف HTTP API وخلف مستهلك طابور؛ كل مضيف جذر منفصل يعيد استخدام method واحدة هي AddOrdering.",
            "الأنظمة المنظَّمة (صحة، مالية) تعتمد على الجذر كنقطة تدقيق: ملف واحد يبيّن التنفيذات الفعلية في الإنتاج، ويستطيع المدققون قراءته دون قراءة التطبيق."
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
          en: "Take a class that injects IServiceProvider and convert it to constructor injection. You are done when the class no longer references Microsoft.Extensions.DependencyInjection at all and a unit test constructs it with plain fakes.",
          ar: "خذ class يحقن IServiceProvider وحوّله إلى constructor injection. تنتهي عندما لا يشير الـ class إلى Microsoft.Extensions.DependencyInjection إطلاقاً ويبنيه unit test بكائنات وهمية عادية."
        },
        {
          t: "ex",
          diff: "medium",
          en: "Move all registrations out of Program.cs into one AddX extension method per module, then enable ValidateOnBuild and ValidateScopes. You are done when Program.cs is under 25 lines and the app still boots clean.",
          ar: "انقل كل التسجيلات من Program.cs إلى extension method واحدة AddX لكل module، ثم فعّل ValidateOnBuild و ValidateScopes. تنتهي عندما يصبح Program.cs أقل من 25 سطراً ويقلع التطبيق نظيفاً."
        },
        {
          t: "ex",
          diff: "hard",
          en: "Replace a service-locator-based factory with a typed factory interface you own, for a case that needs one object per loop item. You are done when the calling class depends only on your factory interface and a test can supply a fake factory returning a stub.",
          ar: "استبدل factory قائمة على service locator بـ factory interface مكتوبة النوع تملكها أنت، لحالة تحتاج كائناً لكل عنصر في loop. تنتهي عندما يعتمد الـ class المستدعي على interface الـ factory فقط ويستطيع اختبار تمرير factory وهمية تُرجع stub."
        },
        {
          t: "ex",
          diff: "senior",
          en: "Write an architecture test (NetArchTest or a reflection loop) that fails the build if any type outside the composition root project has an IServiceProvider constructor parameter. You are done when the test fails on a deliberately added violation and passes on the current code.",
          ar: "اكتب architecture test (بـ NetArchTest أو حلقة reflection) يفشل الـ build إذا كان أي نوع خارج مشروع الـ composition root يأخذ IServiceProvider كمعامل constructor. تنتهي عندما يفشل الاختبار على مخالفة أضفتها عمداً وينجح على الكود الحالي."
        }
      ]
    },
    {
      key: "refs",
      blocks: [
        {
          t: "ref",
          label: { en: "Dependency injection in ASP.NET Core", ar: "Dependency injection في ASP.NET Core" },
          url: "https://learn.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection",
          meta: { en: "Docs", ar: "توثيق" }
        },
        {
          t: "ref",
          label: { en: "Dependency injection guidelines (.NET)", ar: "إرشادات dependency injection في .NET" },
          url: "https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection-guidelines",
          meta: { en: "Docs", ar: "توثيق" }
        },
        {
          t: "ref",
          label: { en: "Mark Seemann — Composition Root pattern", ar: "Mark Seemann — نمط Composition Root" },
          url: "https://blog.ploeh.dk/2011/07/28/CompositionRoot/",
          meta: { en: "Article", ar: "مقال" }
        },
        {
          t: "ref",
          label: { en: "Martin Fowler — Inversion of Control Containers and the Dependency Injection pattern", ar: "Martin Fowler — حاويات Inversion of Control ونمط Dependency Injection" },
          url: "https://martinfowler.com/articles/injection.html",
          meta: { en: "Article", ar: "مقال" }
        }
      ]
    }
  ],
  quiz: [
    {
      q: {
        en: "What is the defining property of a composition root?",
        ar: "ما الخاصية التي تُعرّف الـ composition root؟"
      },
      options: [
        { en: "It is a class that wraps the DI container behind a static property", ar: "class يغلّف الـ DI container خلف خاصية static" },
        { en: "It is the single place where concrete implementations are chosen and object graphs are built", ar: "المكان الوحيد الذي تُختار فيه التنفيذات الفعلية وتُبنى فيه الـ object graphs" },
        { en: "It is the base class every service inherits from", ar: "الـ base class الذي ترث منه كل الخدمات" },
        { en: "It is the container library itself", ar: "مكتبة الـ container نفسها" }
      ],
      correct: 1,
      why: {
        en: "A composition root is a place in the program, not a class or a library. Its defining property is that it is the only code that names concrete implementations.",
        ar: "الـ composition root مكان في البرنامج لا class ولا مكتبة. خاصيته المميِّزة أنه الكود الوحيد الذي يذكر التنفيذات الفعلية."
      }
    },
    {
      q: {
        en: "Why is injecting IServiceProvider into a business class worse than a long constructor?",
        ar: "لماذا حقن IServiceProvider في class أعمال أسوأ من constructor طويل؟"
      },
      options: [
        { en: "It allocates more memory per request", ar: "يخصص ذاكرة أكبر لكل request" },
        { en: "It prevents the container from using compiled factories", ar: "يمنع الـ container من استخدام factories مترجمة" },
        { en: "It hides the dependencies, so a missing registration fails at runtime instead of at compile time", ar: "يخفي الـ dependencies فيصبح التسجيل الناقص فشلاً وقت التشغيل بدل وقت الترجمة" },
        { en: "It makes the class thread-unsafe", ar: "يجعل الـ class غير آمن مع الـ threads" }
      ],
      correct: 2,
      why: {
        en: "The long constructor is honest: remove a dependency and the build breaks immediately. With IServiceProvider nothing breaks until that line runs in production.",
        ar: "الـ constructor الطويل صادق: احذف dependency فينكسر الـ build فوراً. مع IServiceProvider لا ينكسر شيء حتى ينفَّذ ذلك السطر في الإنتاج."
      }
    },
    {
      q: {
        en: "A background job needs a scoped DbContext. What is the correct approach?",
        ar: "مهمة background تحتاج DbContext بعمر scoped. ما الأسلوب الصحيح؟"
      },
      options: [
        { en: "Inject the DbContext directly into the job's constructor", ar: "حقن الـ DbContext مباشرة في constructor المهمة" },
        { en: "Resolve it from the root provider once and reuse it", ar: "حلّه من الـ root provider مرة واحدة وإعادة استخدامه" },
        { en: "Register the DbContext as a singleton instead", ar: "تسجيل الـ DbContext كـ singleton بدلاً من ذلك" },
        { en: "Create a scope with IServiceScopeFactory per unit of work and resolve inside it", ar: "إنشاء scope بـ IServiceScopeFactory لكل وحدة عمل والحل داخله" }
      ],
      correct: 3,
      why: {
        en: "A hosted service is a singleton, so it cannot hold a scoped object. Creating a scope per unit of work gives a fresh DbContext that is disposed when the scope ends.",
        ar: "الـ hosted service كائن singleton فلا يستطيع الاحتفاظ بكائن scoped. إنشاء scope لكل وحدة عمل يعطي DbContext جديداً يُتخلص منه عند انتهاء الـ scope."
      }
    },
    {
      q: {
        en: "You need a new exporter object for each file in a loop. What should the business class depend on?",
        ar: "تحتاج كائن exporter جديداً لكل ملف داخل loop. على ماذا يجب أن يعتمد class الأعمال؟"
      },
      options: [
        { en: "A narrow factory interface you define and own", ar: "factory interface ضيق تعرّفه وتملكه أنت" },
        { en: "IServiceProvider, so it can resolve one per iteration", ar: "IServiceProvider ليحل واحداً في كل دورة" },
        { en: "A static factory class that news up the exporter", ar: "class factory ثابت ينشئ الـ exporter بـ new" },
        { en: "IServiceScopeFactory, creating a scope per file", ar: "IServiceScopeFactory بإنشاء scope لكل ملف" }
      ],
      correct: 0,
      why: {
        en: "A typed factory keeps the dependency narrow and fakeable in tests. IServiceProvider can produce anything, so it tells the reader and the test nothing.",
        ar: "الـ factory مكتوبة النوع تُبقي الـ dependency ضيقاً وقابلاً للتزييف في الاختبارات. أما IServiceProvider فينتج أي شيء، فلا يخبر القارئ ولا الاختبار بشيء."
      }
    },
    {
      q: {
        en: "What does enabling ValidateOnBuild on the service provider give you?",
        ar: "ماذا يمنحك تفعيل ValidateOnBuild على الـ service provider؟"
      },
      options: [
        { en: "It caches compiled factories so resolution is faster", ar: "يخزّن factories مترجمة فيصبح الحل أسرع" },
        { en: "It rejects any class that injects IServiceProvider", ar: "يرفض أي class يحقن IServiceProvider" },
        { en: "It fails at startup if any registered service cannot actually be constructed", ar: "يفشل عند الإقلاع إذا كانت أي خدمة مسجّلة غير قابلة للبناء فعلاً" },
        { en: "It automatically disposes singletons at the end of each request", ar: "يتخلص تلقائياً من الـ singletons في نهاية كل request" }
      ],
      correct: 2,
      why: {
        en: "ValidateOnBuild tries to construct every registration at boot, so a missing or unsatisfiable dependency becomes a failed deploy instead of a failed customer request.",
        ar: "يحاول ValidateOnBuild بناء كل تسجيل عند الإقلاع، فيتحول الـ dependency الناقص أو غير القابل للتلبية إلى نشر فاشل بدل طلب عميل فاشل."
      }
    }
  ]
};
```

NEXT: di-lifetimes
