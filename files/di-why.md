```js
const diWhyLesson = {
  id: "di-why",
  moduleId: "di",
  title: { en: "What DI actually buys you", ar: "ما يمنحه لك الـ DI فعلياً" },
  summary: {
    en: "Dependency injection means a class receives the things it needs instead of building them itself — and that one change is what makes code testable and swappable.",
    ar: "الـ dependency injection يعني أن الـ class يستقبل ما يحتاجه بدل أن يبنيه بنفسه — وهذا التغيير الصغير هو ما يجعل الكود قابلاً للاختبار وللتبديل."
  },
  mins: 12,
  sections: [
    {
      key: "why",
      blocks: [
        { t: "p",
          en: "Dependency injection (DI) is one rule: a class does not create the objects it depends on. It asks for them in its constructor, and whoever builds the class hands them over. That is the whole idea. Everything else — containers, lifetimes, attributes — is tooling around that one rule.",
          ar: "الـ dependency injection (DI) قاعدة واحدة: الـ class لا ينشئ الـ objects التي يعتمد عليها. يطلبها في الـ constructor، ومن يبني الـ class هو من يمرّرها له. هذه هي الفكرة كلها. كل ما عداها — الـ containers والـ lifetimes والـ attributes — أدوات مبنية حول هذه القاعدة." },
        { t: "kv", rows: [
          { k: { en: "Dependency", ar: "Dependency" },
            v: { en: "Any object a class needs to do its job — a database repository, an email sender, a clock.", ar: "أي object يحتاجه الـ class لينجز عمله — repository لقاعدة البيانات، sender للبريد، clock للوقت." } },
          { k: { en: "Injection", ar: "Injection" },
            v: { en: "Passing that object in from outside, normally through the constructor.", ar: "تمرير ذلك الـ object من الخارج، عادةً عبر الـ constructor." } },
          { k: { en: "Inversion of Control (IoC)", ar: "Inversion of Control (IoC)" },
            v: { en: "The general principle: the caller decides which concrete class is used, not the class itself.", ar: "المبدأ العام: المستدعي هو من يقرر أي concrete class يُستخدم، وليس الـ class نفسه." } },
          { k: { en: "DI container", ar: "DI container" },
            v: { en: "A library that knows which concrete class to build for each interface, and builds the whole chain for you.", ar: "مكتبة تعرف أي concrete class تبنيه لكل interface، وتبني السلسلة كاملة نيابةً عنك." } },
          { k: { en: "Concrete class", ar: "Concrete class" },
            v: { en: "A real, instantiable class such as SmtpEmailSender — as opposed to the interface IEmailSender.", ar: "class حقيقي يمكن إنشاؤه مثل SmtpEmailSender — مقابل الـ interface الاسمه IEmailSender." } },
          { k: { en: "Composition root", ar: "Composition root" },
            v: { en: "The single startup place where all those wiring decisions are made. In ASP.NET Core that is Program.cs.", ar: "المكان الوحيد عند الإقلاع حيث تُتخذ كل قرارات الربط. في ASP.NET Core هو Program.cs." } }
        ]},
        { t: "p",
          en: "The situation that forced DI to exist: you have an OrderService that saves an order and emails a confirmation. If it writes `new SmtpEmailSender()` inside itself, then OrderService is permanently tied to SMTP. You cannot test it without a mail server. You cannot swap SMTP for a queue without editing OrderService. And you cannot reuse it in a background job that must not send mail at all.",
          ar: "الموقف الذي فرض وجود الـ DI: لديك OrderService يحفظ الطلب ويرسل رسالة تأكيد. إذا كتب `new SmtpEmailSender()` بداخله، يصبح OrderService مرتبطاً بـ SMTP إلى الأبد. لا يمكنك اختباره بدون mail server. ولا يمكنك استبدال SMTP بـ queue دون تعديل OrderService. ولا يمكنك إعادة استخدامه في background job يجب ألا يرسل بريداً أصلاً." },
        { t: "p",
          en: "An everyday analogy: a chef who grows their own vegetables. The meal works, but the chef is now also a farmer. If you want the same recipe with different vegetables, you must retrain the chef. DI is the delivery crate at the kitchen door — the chef says what they need, someone else decides where it comes from. The recipe stops caring about the farm.",
          ar: "تشبيه من الحياة اليومية: طبّاخ يزرع خضاره بنفسه. الوجبة تنجح، لكن الطبّاخ صار مزارعاً أيضاً. وإذا أردت الوصفة نفسها بخضار مختلف، عليك إعادة تدريب الطبّاخ. الـ DI هو صندوق التوريد عند باب المطبخ — الطبّاخ يقول ماذا يحتاج، وشخص آخر يقرر من أين يأتي. الوصفة تتوقف عن الاهتمام بالمزرعة." },
        { t: "callout", kind: "note",
          en: "DI is a design habit, not a library. You can do DI with plain `new` calls in one startup file. A container only automates the wiring when the object graph — the chain of objects that depend on each other — gets deep.",
          ar: "الـ DI عادة تصميم، وليس مكتبة. يمكنك تطبيقه باستدعاءات `new` عادية في ملف إقلاع واحد. الـ container يؤتمت الربط فقط عندما يصبح الـ object graph — سلسلة الـ objects التي يعتمد بعضها على بعض — عميقاً." }
      ]
    },
    {
      key: "problem",
      blocks: [
        { t: "code", lang: "csharp",
          label: { en: "Before: OrderService builds its own world", ar: "قبل: OrderService يبني عالمه بنفسه" },
          code: "public class OrderService\n{\n    public async Task<int> PlaceAsync(Order order)\n    {\n        var repo = new SqlOrderRepository(\"Server=prod-db;...\");\n        var mail = new SmtpEmailSender(\"smtp.corp.local\", 587);\n\n        order.PlacedAt = DateTime.UtcNow;      // hidden dependency on the clock\n        var id = await repo.InsertAsync(order);\n        await mail.SendAsync(order.CustomerEmail, \"Order confirmed\");\n        return id;\n    }\n}" },
        { t: "p",
          en: "That class has three dependencies it never admits to: a database, an SMTP server, and the system clock. A unit test — a test that runs in memory with no external services — cannot run this method at all. To test the one line that matters (`PlacedAt` is set), you need a live database and a live mail server. On our team that test took 4.2 seconds and failed roughly 1 run in 10 because the test SMTP box was flaky.",
          ar: "هذا الـ class لديه ثلاث dependencies لا يعترف بها: قاعدة بيانات، وSMTP server، وساعة النظام. والـ unit test — الاختبار الذي يعمل في الذاكرة بدون خدمات خارجية — لا يستطيع تشغيل هذه الـ method إطلاقاً. لاختبار السطر الوحيد المهم (أن `PlacedAt` تُضبط) تحتاج قاعدة بيانات حيّة وmail server حي. في فريقنا استغرق هذا الاختبار 4.2 ثانية وكان يفشل في تشغيلة من كل عشر تقريباً لأن صندوق الـ SMTP الاختباري غير مستقر." },
        { t: "code", lang: "csharp",
          label: { en: "After: the same class, dependencies declared", ar: "بعد: نفس الـ class مع تصريح بالـ dependencies" },
          code: "public class OrderService\n{\n    private readonly IOrderRepository _repo;\n    private readonly IEmailSender _mail;\n    private readonly TimeProvider _clock;\n\n    public OrderService(IOrderRepository repo, IEmailSender mail, TimeProvider clock)\n    {\n        _repo = repo;\n        _mail = mail;\n        _clock = clock;\n    }\n\n    public async Task<int> PlaceAsync(Order order)\n    {\n        order.PlacedAt = _clock.GetUtcNow().UtcDateTime;\n        var id = await _repo.InsertAsync(order);\n        await _mail.SendAsync(order.CustomerEmail, \"Order confirmed\");\n        return id;\n    }\n}" },
        { t: "kv", rows: [
          { k: { en: "Test time", ar: "زمن الاختبار" }, v: { en: "4.2 s with real services → about 3 ms with in-memory fakes. Fast enough to run on every keystroke.", ar: "4.2 ثانية مع خدمات حقيقية ← نحو 3 ميلي ثانية مع بدائل in-memory. سريع بما يكفي ليعمل مع كل ضغطة زر." } },
          { k: { en: "Flaky failures", ar: "الفشل المتقطع" }, v: { en: "About 1 run in 10 failed for reasons unrelated to the code. After the change, zero.", ar: "نحو تشغيلة من كل عشر كانت تفشل لأسباب لا علاقة لها بالكود. بعد التغيير: صفر." } },
          { k: { en: "Swapping SMTP for a queue", ar: "استبدال SMTP بـ queue" }, v: { en: "Was: edit OrderService and every class like it. Now: one line in Program.cs.", ar: "كان: تعديل OrderService وكل class مشابه. الآن: سطر واحد في Program.cs." } },
          { k: { en: "Readable contract", ar: "عقد واضح" }, v: { en: "The constructor now lists everything the class touches. No hidden `new` inside a method.", ar: "الـ constructor صار يسرد كل ما يلمسه الـ class. لا `new` مخفي داخل method." } }
        ]}
      ]
    },
    {
      key: "internals",
      blocks: [
        { t: "p",
          en: "A DI container is a dictionary plus a recursive factory. At startup you fill the dictionary: for interface X, build concrete class Y. At request time you ask for one type, and the container walks the constructor parameters, building each one, until it reaches types that need nothing. Nothing magical happens — it is `new` calls in the right order, decided by reflection.",
          ar: "الـ DI container هو dictionary مع factory تعمل بشكل تكراري. عند الإقلاع تملأ الـ dictionary: للـ interface الاسمه X ابنِ الـ concrete class الاسمه Y. وعند الطلب تسأل عن نوع واحد، فيمشي الـ container على معطيات الـ constructor ويبني كلاً منها حتى يصل إلى أنواع لا تحتاج شيئاً. لا شيء سحري — إنها استدعاءات `new` بالترتيب الصحيح تقرّرها الـ reflection." },
        { t: "p",
          en: "Reflection is the runtime's ability to inspect a type and see its constructors and parameters while the program is running. That is how the container knows OrderService wants an IOrderRepository without anyone writing that down twice.",
          ar: "الـ reflection هي قدرة الـ runtime على فحص نوع ورؤية الـ constructors ومعطياتها أثناء تشغيل البرنامج. بهذا يعرف الـ container أن OrderService يريد IOrderRepository دون أن يكتب أحد ذلك مرتين." },
        { t: "code", lang: "csharp",
          label: { en: "Registration and resolution", ar: "التسجيل والاستخراج" },
          code: "// Program.cs — the composition root\nbuilder.Services.AddScoped<IOrderRepository, SqlOrderRepository>();\nbuilder.Services.AddSingleton<IEmailSender, SmtpEmailSender>();\nbuilder.Services.AddSingleton(TimeProvider.System);\nbuilder.Services.AddScoped<OrderService>();\n\n// Later, in a controller — the constructor is the only place you ask for things\npublic class OrdersController : ControllerBase\n{\n    private readonly OrderService _orders;\n    public OrdersController(OrderService orders) => _orders = orders;\n\n    [HttpPost]\n    public Task<int> Post(Order order) => _orders.PlaceAsync(order);\n}" },
        { t: "p",
          en: "Trace one POST /orders end to end. ASP.NET Core creates a scope for the request — a small container that lives exactly as long as that request. It asks the scope for OrdersController. The scope sees the constructor needs OrderService, so it builds that first. OrderService needs three things: IOrderRepository (scoped, so build one and remember it for this request), IEmailSender (singleton, so reuse the one built at startup), TimeProvider (singleton, same). Then it constructs OrderService, then the controller, then runs the action. When the response is written, the scope is disposed and every scoped object created inside it that implements IDisposable gets Dispose() called.",
          ar: "تتبّع طلب POST /orders من أوله لآخره. ينشئ ASP.NET Core scope للطلب — container صغير يعيش بطول الطلب بالضبط. يطلب من الـ scope كائن OrdersController. يرى الـ scope أن الـ constructor يحتاج OrderService فيبنيه أولاً. وOrderService يحتاج ثلاثة أشياء: IOrderRepository (scoped، فيُبنى واحد ويُحفظ لهذا الطلب)، وIEmailSender (singleton، فيُعاد استخدام الذي بُني عند الإقلاع)، وTimeProvider (singleton كذلك). ثم يُنشأ OrderService، ثم الـ controller، ثم تُنفَّذ الـ action. وعند كتابة الرد يُتخلّص من الـ scope فتُستدعى Dispose() على كل object من نوع scoped أُنشئ داخله ويطبّق IDisposable." },
        { t: "kv", rows: [
          { k: { en: "ServiceDescriptor", ar: "ServiceDescriptor" }, v: { en: "One registration row: service type, implementation type, lifetime.", ar: "سطر تسجيل واحد: نوع الخدمة، ونوع التنفيذ، والـ lifetime." } },
          { k: { en: "IServiceCollection", ar: "IServiceCollection" }, v: { en: "The list of those rows you build at startup. Just a list — it resolves nothing.", ar: "قائمة تلك الأسطر التي تبنيها عند الإقلاع. مجرد قائمة — لا تستخرج شيئاً." } },
          { k: { en: "IServiceProvider", ar: "IServiceProvider" }, v: { en: "The built, read-only container that actually creates objects.", ar: "الـ container المبني للقراءة فقط، وهو الذي ينشئ الـ objects فعلياً." } },
          { k: { en: "IServiceScope", ar: "IServiceScope" }, v: { en: "A short-lived child provider, one per HTTP request, disposed with the request.", ar: "provider ابن قصير العمر، واحد لكل HTTP request، ويُتخلّص منه مع الطلب." } },
          { k: { en: "Last registration wins", ar: "آخر تسجيل يفوز" }, v: { en: "Register the same interface twice and a plain resolve returns the last one; ask for IEnumerable<T> to get all.", ar: "إذا سجّلت نفس الـ interface مرتين يعيد الاستخراج العادي الأخير؛ اطلب IEnumerable<T> للحصول عليها كلها." } }
        ]},
        { t: "p",
          en: "An everyday analogy for the container: a hotel front desk. You ask for a room; the desk quietly handles keys, cleaning schedules and billing. You never learn where the keys are kept. The risk is the same as in a hotel — if you start walking into the back office to grab things yourself, the arrangement stops working. That is the service locator anti-pattern covered in the next lesson.",
          ar: "تشبيه للـ container: مكتب استقبال في فندق. تطلب غرفة، ويتولّى المكتب بهدوء المفاتيح وجداول التنظيف والفواتير. لن تعرف أبداً أين تُحفظ المفاتيح. والخطر نفسه خطر الفندق — إذا بدأت تدخل المكتب الخلفي لتأخذ الأشياء بنفسك، يتوقف الترتيب عن العمل. هذا هو الـ service locator anti-pattern الذي يتناوله الدرس التالي." }
      ]
    },
    {
      key: "tradeoffs",
      blocks: [
        { t: "tradeoff",
          pros: { en: [
            "Unit tests run in memory: pass a fake IEmailSender instead of starting a mail server.",
            "One place to change an implementation — the composition root, not every call site.",
            "The constructor documents exactly what a class depends on.",
            "Lifetimes and disposal are handled once by the container instead of by hand."
          ], ar: [
            "الـ unit tests تعمل في الذاكرة: مرّر IEmailSender وهمياً بدل تشغيل mail server.",
            "مكان واحد لتغيير التنفيذ — الـ composition root، لا كل موضع استدعاء.",
            "الـ constructor يوثّق بالضبط ما يعتمد عليه الـ class.",
            "الـ lifetimes والتخلّص تُدار مرة واحدة بواسطة الـ container بدل إدارتها يدوياً."
          ]},
          cons: { en: [
            "Wiring errors move from compile time to startup or first request.",
            "Ctrl+click on an interface no longer shows you the code that runs.",
            "Easy to over-abstract: an interface with exactly one implementation forever.",
            "Constructors quietly grow to eight parameters and nobody notices."
          ], ar: [
            "أخطاء الربط تنتقل من وقت الترجمة إلى وقت الإقلاع أو أول طلب.",
            "الضغط على الـ interface لم يعد يُظهر لك الكود الذي يعمل فعلاً.",
            "من السهل المبالغة في التجريد: interface بتنفيذ وحيد إلى الأبد.",
            "الـ constructors تكبر بهدوء إلى ثمانية معطيات ولا ينتبه أحد."
          ]},
          limits: { en: [
            "DI does not fix a bad boundary — it just makes the bad boundary injectable.",
            "It does not remove coupling, it moves it to the composition root.",
            "Static helpers, extension methods and `new` inside a method stay untestable.",
            "Resolving thousands of objects per request has a measurable reflection cost."
          ], ar: [
            "الـ DI لا يصلح حدوداً سيئة — بل يجعل الحدود السيئة قابلة للحقن فقط.",
            "لا يزيل الاقتران، بل ينقله إلى الـ composition root.",
            "الـ static helpers والـ extension methods و`new` داخل method تبقى غير قابلة للاختبار.",
            "استخراج آلاف الـ objects لكل طلب له تكلفة reflection قابلة للقياس."
          ]},
          alts: { en: [
            "Pure DI: wire everything with plain `new` in one startup file. Fine for small apps.",
            "Method injection: pass the dependency as a parameter when only one method needs it.",
            "Factory delegates (Func<T>) when creation must be deferred or parameterised.",
            "Static functions with no state, when there is nothing to swap."
          ], ar: [
            "Pure DI: اربط كل شيء بـ `new` عادي في ملف إقلاع واحد. مناسب للتطبيقات الصغيرة.",
            "Method injection: مرّر الـ dependency كمعطى عندما تحتاجها method واحدة فقط.",
            "Factory delegates (Func<T>) عندما يجب تأجيل الإنشاء أو تمرير معطيات له.",
            "دوال static بلا حالة، عندما لا يوجد شيء يُستبدل."
          ]}
        }
      ]
    },
    {
      key: "mistakes",
      blocks: [
        { t: "mistake",
          title: { en: "An interface for every class, on principle", ar: "interface لكل class من باب المبدأ" },
          body: { en: "A team added IOrderMapper, IPriceFormatter and IOrderValidator, each with exactly one implementation and no test that fakes them. The solution grew 60 files that only forward calls. Navigation slowed down and reviewers stopped following call chains. An interface earns its place when there is a second implementation, a real test double, or a boundary you own on one side only.", ar: "أضاف فريق IOrderMapper وIPriceFormatter وIOrderValidator، لكل منها تنفيذ واحد فقط ولا اختبار يستبدلها. كبر المشروع بـ 60 ملفاً لا تفعل سوى تمرير الاستدعاءات. تباطأ التنقل وتوقّف المراجعون عن تتبّع سلاسل الاستدعاء. الـ interface يستحق وجوده عندما يوجد تنفيذ ثانٍ، أو test double حقيقي، أو حدّ تملك جانباً واحداً منه فقط." },
          fix: "// Only introduce IEmailSender because tests must not send mail\n// and a queue-based sender is planned.\npublic sealed class OrderMapper { /* concrete, injected as itself */ }" },
        { t: "mistake",
          title: { en: "Newing up a dependency inside the method anyway", ar: "إنشاء الـ dependency داخل الـ method رغم كل شيء" },
          body: { en: "OrderService took IEmailSender in the constructor, but a later commit added `var audit = new FileAuditLog(\"C:/logs/audit.txt\");` inside PlaceAsync because it was quick. Every unit test then wrote to a real file, tests started failing in parallel runs with a file-lock error, and the class was untestable again on Linux CI.", ar: "أخذ OrderService الـ IEmailSender في الـ constructor، لكن commit لاحق أضاف `var audit = new FileAuditLog(\"C:/logs/audit.txt\");` داخل PlaceAsync لأنه أسرع. صارت كل الاختبارات تكتب في ملف حقيقي، وبدأت تفشل عند التشغيل المتوازي بخطأ قفل ملف، وعاد الـ class غير قابل للاختبار على Linux CI." },
          fix: "public OrderService(IOrderRepository repo, IEmailSender mail, IAuditLog audit)" },
        { t: "mistake",
          title: { en: "Injecting the container itself", ar: "حقن الـ container نفسه" },
          body: { en: "A constructor took IServiceProvider and did `_sp.GetRequiredService<IEmailSender>()` inside the method. The class now depends on everything and admits nothing, so a missing registration only surfaced as a runtime crash on the checkout endpoint in production — not at startup, and not in any test.", ar: "أخذ constructor كائن IServiceProvider ونفّذ `_sp.GetRequiredService<IEmailSender>()` داخل الـ method. صار الـ class يعتمد على كل شيء ولا يعترف بشيء، فظهر تسجيل ناقص على شكل انهيار وقت التشغيل على endpoint الدفع في الإنتاج — لا عند الإقلاع ولا في أي اختبار." },
          fix: "// Ask for what you need, not for the thing that has everything.\npublic OrderService(IEmailSender mail) => _mail = mail;" },
        { t: "mistake",
          title: { en: "Doing real work in the constructor", ar: "تنفيذ عمل حقيقي في الـ constructor" },
          body: { en: "A repository opened a database connection and ran a warm-up query in its constructor. Because the container builds objects while handling a request, a slow database turned every request into a 30-second hang, and the failure appeared as an unrelated timeout in the controller. Constructors should only assign fields.", ar: "فتح repository اتصالاً بقاعدة البيانات ونفّذ استعلام تسخين داخل الـ constructor. ولأن الـ container يبني الـ objects أثناء معالجة الطلب، حوّلت قاعدة بيانات بطيئة كل طلب إلى تعليق لثلاثين ثانية، وظهر العطل على شكل timeout لا علاقة له في الـ controller. الـ constructors يجب أن تُسند الحقول فقط." },
          fix: "// Move I/O to an explicit method the caller awaits.\npublic Task InitializeAsync(CancellationToken ct) => _db.OpenAsync(ct);" }
      ]
    },
    {
      key: "interview",
      blocks: [
        { t: "qa", level: "junior",
          q: { en: "What is dependency injection in one sentence?", ar: "ما هو الـ dependency injection في جملة واحدة؟" },
          a: { en: "It means a class asks for what it needs in its constructor instead of building it with `new`. So OrderService takes an IEmailSender rather than creating an SmtpEmailSender itself, and whoever builds OrderService decides which sender it gets. That is what lets me pass a fake sender in a test.", ar: "يعني أن الـ class يطلب ما يحتاجه في الـ constructor بدل أن يبنيه بـ `new`. فـ OrderService يأخذ IEmailSender بدل أن ينشئ SmtpEmailSender بنفسه، ومن يبني OrderService هو من يقرر أي sender يصله. هذا ما يسمح لي بتمرير sender وهمي في الاختبار." } },
        { t: "qa", level: "mid",
          q: { en: "What is the difference between inversion of control and a DI container?", ar: "ما الفرق بين inversion of control والـ DI container؟" },
          a: { en: "Inversion of control is the principle — the class no longer chooses its own collaborators, the caller does. Dependency injection is one way to apply it, by passing them in. A container is only a tool that automates that passing so I don't hand-write a hundred `new` calls. I can do full DI with no container at all; it is just tedious once the object graph is deep.", ar: "الـ inversion of control مبدأ — الـ class لم يعد يختار من يتعاون معه، بل المستدعي. والـ dependency injection طريقة لتطبيقه عبر تمريرها إليه. والـ container مجرد أداة تؤتمت هذا التمرير حتى لا أكتب مئة استدعاء `new` يدوياً. أستطيع تطبيق DI كاملاً بلا container، لكنه ممل عندما يعمق الـ object graph." } },
        { t: "qa", level: "mid",
          q: { en: "When would you not introduce an interface for a dependency?", ar: "متى لا تُدخِل interface لـ dependency؟" },
          a: { en: "When there is only ever going to be one implementation and no test needs to replace it. A mapper or a formatter with no I/O I inject as the concrete class. I add the interface when I hit a real reason: a second implementation, a test that must not touch the network, or a boundary between my code and something I don't own like SMTP or a payment gateway.", ar: "عندما لن يوجد سوى تنفيذ واحد ولا يحتاج أي اختبار لاستبداله. الـ mapper أو الـ formatter بلا I/O أحقنه كـ concrete class. وأضيف الـ interface عند وجود سبب حقيقي: تنفيذ ثانٍ، أو اختبار يجب ألا يلمس الشبكة، أو حدّ بين كودي وشيء لا أملكه مثل SMTP أو بوابة دفع." } },
        { t: "qa", level: "senior",
          q: { en: "What does DI not solve?", ar: "ما الذي لا يحله الـ DI؟" },
          a: { en: "It doesn't reduce coupling, it relocates it — all the decisions now sit in the composition root. It doesn't make a bad abstraction good; a leaky interface stays leaky when injected. It doesn't remove hidden state like static caches or DateTime.Now unless I inject those too. And it moves whole classes of wiring errors from the compiler to startup, which is why I always run container validation in CI.", ar: "لا يقلل الاقتران بل ينقله — كل القرارات صارت في الـ composition root. ولا يحوّل تجريداً سيئاً إلى جيد؛ الـ interface المتسرّب يبقى متسرّباً بعد الحقن. ولا يزيل الحالة المخفية مثل الـ static caches أو DateTime.Now إلا إذا حقنتها أيضاً. وينقل فئة كاملة من أخطاء الربط من الـ compiler إلى وقت الإقلاع، ولهذا أشغّل دائماً تحقق الـ container في الـ CI." } },
        { t: "qa", level: "senior",
          q: { en: "A class has ten constructor parameters. Is that a DI problem?", ar: "class لديه عشرة معطيات في الـ constructor. هل هذه مشكلة DI؟" },
          a: { en: "No, DI just made an existing problem visible. Ten dependencies means the class does ten things. I look for a group that always travels together and extract it into one service — for example three tax, discount and currency dependencies become an IPricingService. What I do not do is hide the count by injecting IServiceProvider; that removes the warning signal without fixing the design.", ar: "لا، الـ DI فقط أظهر مشكلة قائمة. عشر dependencies تعني أن الـ class يقوم بعشرة أعمال. أبحث عن مجموعة تسير معاً دائماً وأستخرجها في خدمة واحدة — مثلاً dependencies الضريبة والخصم والعملة تصبح IPricingService. وما لا أفعله هو إخفاء العدد بحقن IServiceProvider؛ هذا يزيل إشارة الإنذار دون إصلاح التصميم." } },
        { t: "qa", level: "staff",
          q: { en: "How do you stop DI misuse from spreading across a large codebase?", ar: "كيف تمنع إساءة استخدام الـ DI من الانتشار في كود قاعدة كبيرة؟" },
          a: { en: "I make the rules mechanical rather than cultural. First, turn on scope validation in every environment so lifetime mistakes fail at startup, not in production. Second, add an architecture test — a unit test that inspects types — that fails the build if any constructor outside the startup project takes IServiceProvider. Third, keep one composition root per deployable and review changes to it like schema changes. Fourth, write down when an interface is justified, so the decision is a team standard and not a per-reviewer opinion.", ar: "أجعل القواعد آلية لا ثقافية. أولاً، أفعّل التحقق من الـ scopes في كل بيئة حتى تفشل أخطاء الـ lifetime عند الإقلاع لا في الإنتاج. ثانياً، أضيف architecture test — اختبار يفحص الأنواع — يُفشل البناء إذا أخذ أي constructor خارج مشروع الإقلاع كائن IServiceProvider. ثالثاً، أبقي composition root واحداً لكل وحدة نشر وأراجع تغييراته مثل تغييرات الـ schema. رابعاً، أوثّق متى يكون الـ interface مبرراً، ليصبح القرار معياراً للفريق لا رأياً لكل مراجع." } }
      ]
    },
    {
      key: "codereview",
      blocks: [
        { t: "review", severity: "high",
          title: { en: "Service locator hidden behind a constructor", ar: "service locator مخفي خلف constructor" },
          bad: "public class OrderService\n{\n    private readonly IServiceProvider _sp;\n    public OrderService(IServiceProvider sp) => _sp = sp;\n\n    public async Task PlaceAsync(Order o)\n    {\n        var mail = _sp.GetRequiredService<IEmailSender>();\n        await mail.SendAsync(o.CustomerEmail, \"Order confirmed\");\n    }\n}",
          good: "public class OrderService\n{\n    private readonly IEmailSender _mail;\n    public OrderService(IEmailSender mail) => _mail = mail;\n\n    public Task PlaceAsync(Order o) =>\n        _mail.SendAsync(o.CustomerEmail, \"Order confirmed\");\n}",
          why: { en: "The bad version hides its real dependencies, so a missing registration crashes at request time on a live endpoint instead of failing at startup. It also breaks tests: constructing the class in a test now requires building a whole container. The good version states its needs, so both the container and the compiler can check them.", ar: "النسخة السيئة تخفي dependencies الحقيقية، فيؤدي تسجيل ناقص إلى انهيار وقت الطلب على endpoint حي بدل الفشل عند الإقلاع. وتكسر الاختبارات أيضاً: إنشاء الـ class في اختبار صار يتطلب بناء container كامل. النسخة الجيدة تصرّح باحتياجاتها فيستطيع الـ container والـ compiler التحقق منها." } },
        { t: "review", severity: "medium",
          title: { en: "Non-injectable clock makes the test time-dependent", ar: "ساعة غير قابلة للحقن تجعل الاختبار معتمداً على الوقت" },
          bad: "public bool IsExpired(Order o) =>\n    DateTime.UtcNow > o.PlacedAt.AddMinutes(30);",
          good: "public OrderService(TimeProvider clock) => _clock = clock;\n\npublic bool IsExpired(Order o) =>\n    _clock.GetUtcNow().UtcDateTime > o.PlacedAt.AddMinutes(30);\n\n// test: new FakeTimeProvider(new DateTimeOffset(2026, 1, 1, 12, 0, 0, TimeSpan.Zero))",
          why: { en: "DateTime.UtcNow is a hidden dependency on the machine clock. You cannot test the expiry boundary without sleeping for 30 minutes or mutating the system time. Injecting TimeProvider — the abstraction added in .NET 8 — makes the boundary a one-line test, and it also fixes bugs where a server in a different time zone behaves differently.", ar: "الـ DateTime.UtcNow هي dependency مخفية على ساعة الجهاز. لا يمكنك اختبار حدّ انتهاء الصلاحية دون الانتظار ثلاثين دقيقة أو تغيير وقت النظام. وحقن TimeProvider — التجريد المضاف في .NET 8 — يجعل اختبار الحدّ سطراً واحداً، ويعالج أيضاً أخطاء تظهر عندما يعمل server في منطقة زمنية مختلفة." } }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        { t: "p",
          en: "In a real system, DI is what makes the same business code run in three different hosts. The order-placing logic lives in one class. The web API registers a SQL repository and an SMTP sender. The nightly batch job registers the same repository with a longer command timeout and a no-op sender, because reprocessing must not re-email customers. The integration test registers an in-memory repository and a fake sender that records what was sent. One class, three wirings, zero `#if` blocks.",
          ar: "في نظام حقيقي، الـ DI هو ما يجعل نفس كود الأعمال يعمل في ثلاث بيئات استضافة. منطق تسجيل الطلب في class واحد. الـ web API يسجّل repository لـ SQL وsender لـ SMTP. والـ batch job الليلي يسجّل نفس الـ repository بمهلة أوامر أطول وsender لا يفعل شيئاً، لأن إعادة المعالجة يجب ألا تعيد مراسلة العملاء. والاختبار التكاملي يسجّل repository في الذاكرة وsender وهمياً يسجّل ما أُرسل. class واحد، وثلاث طرق ربط، وبلا كتل `#if`." },
        { t: "ul",
          en: [
            "Feature flags: register one of two IPricingStrategy implementations based on config read at startup.",
            "Multi-tenant systems: a scoped ITenantContext resolved from the request host name, injected everywhere below it.",
            "Vendor swap: moving from SendGrid to SES is a change to one registration line, not to every caller.",
            "Local development: register a fake payment gateway so nobody needs live vendor credentials to run the app.",
            "Testing seams: WebApplicationFactory replaces individual registrations so an integration test hits real routing with fake externals."
          ],
          ar: [
            "Feature flags: سجّل أحد تنفيذَي IPricingStrategy بناءً على إعدادات تُقرأ عند الإقلاع.",
            "الأنظمة متعددة المستأجرين: ITenantContext من نوع scoped يُستخرج من اسم مضيف الطلب ويُحقن في كل ما تحته.",
            "تبديل المزوّد: الانتقال من SendGrid إلى SES تغيير في سطر تسجيل واحد، لا في كل مستدعٍ.",
            "التطوير المحلي: سجّل بوابة دفع وهمية حتى لا يحتاج أحد بيانات اعتماد حقيقية لتشغيل التطبيق.",
            "منافذ الاختبار: WebApplicationFactory تستبدل تسجيلات مفردة ليصل الاختبار التكاملي إلى الـ routing الحقيقي مع خدمات خارجية وهمية."
          ]},
        { t: "callout", kind: "warn",
          en: "One composition root per deployable process. If a shared library calls AddSomething() and also decides lifetimes for types the host owns, two applications will disagree about how the same type behaves, and the difference only shows in one of them.",
          ar: "composition root واحد لكل عملية نشر. إذا استدعت مكتبة مشتركة AddSomething() وقررت أيضاً lifetimes لأنواع يملكها الـ host، فسيختلف تطبيقان حول سلوك النوع نفسه، ولن يظهر الفرق إلا في أحدهما."
        }
      ]
    },
    {
      key: "perf",
      blocks: [
        { t: "kv", rows: [
          { k: { en: "CPU", ar: "CPU" }, v: { en: "Resolution uses reflection once per type, then a cached compiled factory. Typical cost is tens of nanoseconds per object — irrelevant next to one database call.", ar: "الاستخراج يستخدم reflection مرة لكل نوع ثم factory مترجمة ومخزّنة. التكلفة المعتادة عشرات النانوثانية لكل object — لا تُذكر بجانب استدعاء واحد لقاعدة البيانات." } },
          { k: { en: "Memory", ar: "الذاكرة" }, v: { en: "Transient registrations allocate a fresh object per injection point. A transient injected into 50 places in one request means 50 objects the GC must clean up.", ar: "تسجيلات transient تخصص object جديداً لكل نقطة حقن. transient محقون في خمسين موضعاً داخل طلب واحد يعني خمسين object على الـ GC تنظيفها." } },
          { k: { en: "Startup latency", ar: "زمن الإقلاع" }, v: { en: "Building the provider and validating scopes adds milliseconds at boot. That is the right place to pay — it turns runtime crashes into startup failures.", ar: "بناء الـ provider والتحقق من الـ scopes يضيف ميلي ثوانٍ عند الإقلاع. وهذا هو المكان الصحيح للدفع — إذ يحوّل انهيارات وقت التشغيل إلى فشل عند الإقلاع." } },
          { k: { en: "Scalability", ar: "قابلية التوسّع" }, v: { en: "A singleton holding per-request data is shared across all concurrent requests and corrupts under load. This is the captive dependency problem, covered later in this module.", ar: "singleton يحمل بيانات خاصة بالطلب يُشارَك بين كل الطلبات المتزامنة ويفسد تحت الحمل. هذه مشكلة الـ captive dependency، وتأتي لاحقاً في هذه الوحدة." } },
          { k: { en: "Latency", ar: "زمن الاستجابة" }, v: { en: "Constructors doing I/O turn resolution into a blocking call inside the request path. Keep constructors to field assignment only.", ar: "الـ constructors التي تنفّذ I/O تحوّل الاستخراج إلى استدعاء حاجب داخل مسار الطلب. أبقِ الـ constructors على إسناد الحقول فقط." } }
        ]}
      ]
    },
    {
      key: "debug",
      blocks: [
        { t: "ul",
          en: [
            "Enable ValidateOnBuild and ValidateScopes in Program.cs — startup then throws with the exact type that is missing or mis-scoped, instead of failing on a random request.",
            "Log the registrations at boot: iterate builder.Services and print ServiceType, ImplementationType and Lifetime. You are looking for duplicates and unexpected lifetimes.",
            "Read the InvalidOperationException message carefully — 'Unable to resolve service for type X while attempting to activate Y' names both the missing dependency and the class that wanted it.",
            "Put a breakpoint in the suspect constructor and inspect the call stack; if the stack shows GetRequiredService called from business code, you have a service locator, not injection.",
            "In tests, build the provider with new ServiceCollection() plus only the registrations under test — if that throws, the graph is bigger than the class claims."
          ],
          ar: [
            "فعّل ValidateOnBuild وValidateScopes في Program.cs — عندها يرمي الإقلاع استثناءً يسمّي النوع الناقص أو الخاطئ الـ scope بالضبط بدل الفشل في طلب عشوائي.",
            "سجّل التسجيلات عند الإقلاع: مُرّ على builder.Services واطبع ServiceType وImplementationType وLifetime. أنت تبحث عن تكرارات وlifetimes غير متوقعة.",
            "اقرأ رسالة InvalidOperationException بعناية — عبارة 'Unable to resolve service for type X while attempting to activate Y' تسمّي الـ dependency الناقصة والـ class الذي طلبها معاً.",
            "ضع breakpoint في الـ constructor المشتبه به وافحص call stack؛ إذا أظهر الـ stack استدعاء GetRequiredService من كود الأعمال فلديك service locator لا injection.",
            "في الاختبارات ابنِ الـ provider بـ new ServiceCollection() مع التسجيلات موضع الاختبار فقط — إذا رمى استثناءً فالـ graph أكبر مما يدّعيه الـ class."
          ]},
        { t: "callout", kind: "tip",
          en: "Add ValidateOnBuild = true and ValidateScopes = true for every environment, not just Development. The few milliseconds at startup buy you a loud, immediate failure instead of a captive-dependency bug that only appears under concurrent load in production.",
          ar: "أضف ValidateOnBuild = true وValidateScopes = true لكل البيئات لا لبيئة التطوير فقط. الميلي ثوانٍ القليلة عند الإقلاع تشتري لك فشلاً واضحاً وفورياً بدل خطأ captive dependency لا يظهر إلا تحت حمل متزامن في الإنتاج."
        }
      ]
    },
    {
      key: "realworld",
      blocks: [
        { t: "p",
          en: "The clearest sign DI is earning its cost is when a business requirement changes an external system and no business code changes with it. A payments team switching card processors, a logistics team adding a second carrier, a messaging platform moving from a self-hosted queue to a managed one — in each case the shipping code stays the same and the registration line changes. Where DI stops paying is a small internal tool with one implementation of everything: there the interfaces are pure overhead.",
          ar: "أوضح دليل على أن الـ DI يستحق تكلفته هو أن يتغير نظام خارجي بسبب متطلب عمل دون أن يتغير معه أي كود أعمال. فريق مدفوعات يبدّل معالج البطاقات، وفريق شحن يضيف ناقلاً ثانياً، ومنصة رسائل تنتقل من queue ذاتية الاستضافة إلى مُدارة — في كل حالة يبقى كود الشحن كما هو ويتغير سطر التسجيل. وحيث يتوقف الـ DI عن الدفع هو أداة داخلية صغيرة بتنفيذ واحد لكل شيء: هناك تكون الـ interfaces عبئاً خالصاً." },
        { t: "ul",
          en: [
            "Payment systems: an IPaymentGateway with a sandbox implementation lets the whole checkout flow be tested without moving money.",
            "Multi-region SaaS: the same service registered with a different storage implementation per region, chosen at startup from configuration.",
            "Regulated industries: an IAuditLog interface makes it provable that every write path goes through auditing, because nothing can construct its own logger.",
            "Legacy migration: register the new implementation behind the same interface and switch traffic with a config flag, keeping the old one as an instant rollback."
          ],
          ar: [
            "أنظمة الدفع: IPaymentGateway بتنفيذ sandbox يسمح باختبار مسار الدفع كاملاً دون تحريك أموال.",
            "SaaS متعدد المناطق: نفس الخدمة مسجّلة بتنفيذ تخزين مختلف لكل منطقة، يُختار عند الإقلاع من الإعدادات.",
            "القطاعات المنظّمة: interface الاسمه IAuditLog يجعل من الممكن إثبات أن كل مسار كتابة يمر بالتدقيق، لأن لا شيء يستطيع بناء logger خاص به.",
            "ترحيل الأنظمة القديمة: سجّل التنفيذ الجديد خلف نفس الـ interface وبدّل الحركة بـ config flag، مع إبقاء القديم كتراجع فوري."
          ]}
      ]
    },
    {
      key: "exercises",
      blocks: [
        { t: "ex", diff: "easy",
          en: "Take the first OrderService in this lesson and refactor it to constructor injection with IOrderRepository, IEmailSender and TimeProvider. You are done when a unit test constructs the class with three fakes, asserts PlacedAt equals a fixed date, and runs in under 10 milliseconds with no database or mail server.",
          ar: "خذ نسخة OrderService الأولى في هذا الدرس وأعد كتابتها بحقن عبر الـ constructor لـ IOrderRepository وIEmailSender وTimeProvider. تكون قد أنهيت عندما ينشئ unit test الـ class بثلاثة بدائل وهمية، ويتحقق أن PlacedAt تساوي تاريخاً ثابتاً، وينتهي في أقل من 10 ميلي ثانية بلا قاعدة بيانات ولا mail server." },
        { t: "ex", diff: "medium",
          en: "Wire the same service two ways in one solution: an API host that registers SmtpEmailSender, and a console batch host that registers a NoOpEmailSender. Proof of success: running the batch host places an order and sends nothing, with zero changes to OrderService.",
          ar: "اربط الخدمة نفسها بطريقتين في مشروع واحد: مضيف API يسجّل SmtpEmailSender، ومضيف console للمعالجة يسجّل NoOpEmailSender. دليل النجاح: تشغيل مضيف المعالجة ينشئ طلباً ولا يرسل شيئاً، دون أي تغيير في OrderService." },
        { t: "ex", diff: "hard",
          en: "Write a startup check that iterates IServiceCollection and fails the build if any registered implementation type has a constructor parameter of type IServiceProvider. Prove it works by adding one offending class and seeing the app refuse to start with a message naming that class.",
          ar: "اكتب فحصاً عند الإقلاع يمرّ على IServiceCollection ويُفشل التشغيل إذا كان لأي نوع تنفيذ مسجّل معطى constructor من نوع IServiceProvider. أثبت أنه يعمل بإضافة class مخالف واحد ورؤية التطبيق يرفض الإقلاع برسالة تسمّي ذلك الـ class." },
        { t: "ex", diff: "senior",
          en: "Take a class in your codebase with six or more constructor parameters. Group the parameters that always change together and extract them behind one new service, so the constructor drops to three or fewer. Write a short note explaining why each remaining parameter is a genuinely separate reason to change, and have a teammate try to argue one of them away.",
          ar: "خذ class في كودك بستة معطيات constructor أو أكثر. اجمع المعطيات التي تتغير معاً دائماً واستخرجها خلف خدمة جديدة واحدة، حتى ينزل الـ constructor إلى ثلاثة أو أقل. اكتب ملاحظة قصيرة تشرح لماذا يمثل كل معطى متبقٍ سبب تغيير منفصلاً فعلاً، واطلب من زميل أن يحاول دحض أحدها." }
      ]
    },
    {
      key: "refs",
      blocks: [
        { t: "ref", label: { en: "Dependency injection in .NET", ar: "الـ Dependency injection في .NET" },
          url: "https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection",
          meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref", label: { en: "Dependency injection guidelines", ar: "إرشادات الـ Dependency injection" },
          url: "https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection-guidelines",
          meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref", label: { en: "Dependency injection in ASP.NET Core", ar: "الـ Dependency injection في ASP.NET Core" },
          url: "https://learn.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection",
          meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref", label: { en: "Martin Fowler — Inversion of Control Containers and the Dependency Injection pattern", ar: "Martin Fowler — حاويات Inversion of Control ونمط Dependency Injection" },
          url: "https://martinfowler.com/articles/injection.html",
          meta: { en: "Article", ar: "مقال" } }
      ]
    }
  ],
  quiz: [
    {
      q: { en: "What is the single rule that defines dependency injection?", ar: "ما القاعدة الوحيدة التي تعرّف الـ dependency injection؟" },
      options: [
        { en: "Every class must have an interface", ar: "كل class يجب أن يكون له interface" },
        { en: "A class receives its dependencies instead of creating them", ar: "الـ class يستقبل dependencies بدل أن ينشئها" },
        { en: "All services must be registered as singletons", ar: "كل الخدمات يجب أن تُسجّل كـ singletons" },
        { en: "Object creation must go through a container library", ar: "إنشاء الـ objects يجب أن يمرّ بمكتبة container" }
      ],
      correct: 1,
      why: { en: "Interfaces, lifetimes and containers are tooling. The rule itself is that the class does not build what it depends on — someone else passes it in.", ar: "الـ interfaces والـ lifetimes والـ containers أدوات. القاعدة نفسها أن الـ class لا يبني ما يعتمد عليه — بل يمرّره له غيره." }
    },
    {
      q: { en: "A class takes IServiceProvider in its constructor and resolves services inside methods. What is the main problem?", ar: "class يأخذ IServiceProvider في الـ constructor ويستخرج الخدمات داخل الـ methods. ما المشكلة الأساسية؟" },
      options: [
        { en: "Resolution is too slow at runtime", ar: "الاستخراج بطيء جداً وقت التشغيل" },
        { en: "The container cannot dispose the objects", ar: "الـ container لا يستطيع التخلص من الـ objects" },
        { en: "Its real dependencies are hidden, so missing registrations fail at request time", ar: "dependencies الحقيقية مخفية، فتفشل التسجيلات الناقصة وقت الطلب" },
        { en: "IServiceProvider cannot be injected in ASP.NET Core", ar: "لا يمكن حقن IServiceProvider في ASP.NET Core" }
      ],
      correct: 2,
      why: { en: "This is the service locator anti-pattern. The constructor no longer describes what the class needs, so neither the container's validation nor a reviewer can catch a missing registration before production.", ar: "هذا هو الـ service locator anti-pattern. لم يعد الـ constructor يصف ما يحتاجه الـ class، فلا تحقق الـ container ولا المراجع يستطيع اكتشاف تسجيل ناقص قبل الإنتاج." }
    },
    {
      q: { en: "Which statement about inversion of control and DI containers is correct?", ar: "أي عبارة صحيحة عن الـ inversion of control والـ DI containers؟" },
      options: [
        { en: "They are two names for the same thing", ar: "هما اسمان للشيء نفسه" },
        { en: "IoC is the principle; a container is optional tooling that automates the wiring", ar: "الـ IoC مبدأ؛ والـ container أداة اختيارية تؤتمت الربط" },
        { en: "A container is required to apply IoC", ar: "الـ container ضروري لتطبيق الـ IoC" },
        { en: "IoC only applies to web applications", ar: "الـ IoC ينطبق على تطبيقات الويب فقط" }
      ],
      correct: 1,
      why: { en: "You can apply IoC with plain `new` calls in one startup file. A container only saves you from writing that wiring by hand when the object graph gets deep.", ar: "يمكنك تطبيق الـ IoC باستدعاءات `new` عادية في ملف إقلاع واحد. والـ container يوفر عليك كتابة الربط يدوياً فقط عندما يعمق الـ object graph." }
    },
    {
      q: { en: "When is adding an interface for a dependency clearly justified?", ar: "متى تكون إضافة interface لـ dependency مبررة بوضوح؟" },
      options: [
        { en: "Whenever the class has more than one method", ar: "كلما كان للـ class أكثر من method" },
        { en: "For every class, as a coding standard", ar: "لكل class، كمعيار برمجي" },
        { en: "When a test must replace it, or a second implementation exists, or it crosses a boundary you don't own", ar: "عندما يجب أن يستبدله اختبار، أو يوجد تنفيذ ثانٍ، أو يعبر حدّاً لا تملكه" },
        { en: "Only when the class performs database access", ar: "فقط عندما يصل الـ class إلى قاعدة البيانات" }
      ],
      correct: 2,
      why: { en: "An interface with exactly one implementation and no test double adds a file and an indirection without buying anything. The justification has to be concrete.", ar: "interface بتنفيذ واحد فقط وبلا بديل اختباري يضيف ملفاً وطبقة وساطة دون فائدة. يجب أن يكون المبرر ملموساً." }
    },
    {
      q: { en: "Why should a constructor avoid doing I/O such as opening a database connection?", ar: "لماذا يجب أن يتجنب الـ constructor عمليات I/O مثل فتح اتصال بقاعدة البيانات؟" },
      options: [
        { en: "Constructors cannot contain async code at all", ar: "الـ constructors لا يمكن أن تحتوي كوداً async إطلاقاً" },
        { en: "The container builds objects inside the request path, so slow I/O becomes request latency and errors surface far from their cause", ar: "الـ container يبني الـ objects داخل مسار الطلب، فيتحول الـ I/O البطيء إلى زمن استجابة وتظهر الأخطاء بعيداً عن سببها" },
        { en: "The container caches constructor results forever", ar: "الـ container يخزّن نتائج الـ constructor إلى الأبد" },
        { en: "It prevents the class from being registered as scoped", ar: "يمنع تسجيل الـ class كـ scoped" }
      ],
      correct: 1,
      why: { en: "Resolution happens while a request is being handled. A constructor that blocks on a slow database turns every request into a hang, and the failure appears as an unrelated timeout in the controller. Constructors should only assign fields.", ar: "الاستخراج يحدث أثناء معالجة الطلب. والـ constructor الذي يتوقف على قاعدة بيانات بطيئة يحوّل كل طلب إلى تعليق، ويظهر العطل على شكل timeout لا علاقة له في الـ controller. الـ constructors يجب أن تُسند الحقول فقط." }
    }
  ]
};
```

NEXT: di-root
