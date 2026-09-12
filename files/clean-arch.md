```js
const cleanArchLesson = {
  id: "clean-arch",
  moduleId: "architecture",
  title: { en: "Clean architecture, honestly assessed", ar: "Clean architecture بتقييم صادق" },
  summary: {
    en: "Keep business rules independent of the database and framework — and know when that independence is worth its cost.",
    ar: "اجعل قواعد العمل مستقلة عن قاعدة البيانات والـ framework — واعرف متى تستحق هذه الاستقلالية تكلفتها."
  },
  mins: 18,
  sections: [
    {
      key: "why",
      blocks: [
        { t: "p",
          en: "Clean architecture is a way to arrange code so your business rules do not depend on your database, web framework, or any outside tool. The rules sit in the center. Everything replaceable sits on the outside.",
          ar: "Clean architecture هي طريقة لترتيب الكود بحيث لا تعتمد قواعد عملك على قاعدة البيانات أو الـ web framework أو أي أداة خارجية. القواعد في المركز. وكل ما يمكن استبداله يكون في الخارج." },
        { t: "kv", rows: [
          { k: { en: "Clean architecture", ar: "Clean architecture" },
            v: { en: "Arranging code in rings so the core rules never depend on outer, replaceable tools.", ar: "ترتيب الكود في حلقات بحيث لا تعتمد قواعد المركز أبداً على الأدوات الخارجية القابلة للاستبدال." } },
          { k: { en: "Dependency rule", ar: "Dependency rule" },
            v: { en: "Source-code dependencies point only inward, toward the core. The core knows nothing about the outside.", ar: "اعتماديات الكود المصدري تشير للداخل فقط، نحو المركز. المركز لا يعرف شيئاً عن الخارج." } },
          { k: { en: "Domain / business logic", ar: "Domain / business logic" },
            v: { en: "The rules that make your product what it is, e.g. 'an order over $500 needs approval'.", ar: "القواعد التي تجعل منتجك ما هو عليه، مثل 'أي order أكبر من 500 دولار يحتاج موافقة'." } },
          { k: { en: "Infrastructure", ar: "Infrastructure" },
            v: { en: "Replaceable technical details: the database, the email sender, the web framework.", ar: "التفاصيل التقنية القابلة للاستبدال: قاعدة البيانات، مُرسِل الـ email، الـ web framework." } },
          { k: { en: "Use case", ar: "Use case" },
            v: { en: "One application action, e.g. 'place an order', that orchestrates domain rules.", ar: "إجراء واحد في التطبيق، مثل 'إنشاء order'، ينظّم قواعد الـ domain." } },
          { k: { en: "Dependency inversion", ar: "Dependency inversion" },
            v: { en: "The core defines an interface; the outer layer writes the class that implements it.", ar: "المركز يعرّف interface؛ والطبقة الخارجية تكتب الـ class الذي ينفّذه." } }
        ]},
        { t: "p",
          en: "Think of a restaurant kitchen. The recipes are the rules. A recipe does not care whether the tomatoes came from a truck or a local farm — it just needs tomatoes. Clean architecture makes your business rules the recipes: they state what they need, and the supplier can change without rewriting the recipe.",
          ar: "تخيّل مطبخ مطعم. الوصفات هي القواعد. الوصفة لا تهتم إن جاءت الطماطم من شاحنة أو من مزرعة قريبة — هي تحتاج طماطم فقط. Clean architecture تجعل قواعد عملك مثل الوصفات: تحدد ما تحتاجه، ويمكن للمورّد أن يتغير دون إعادة كتابة الوصفة." },
        { t: "p",
          en: "This exists because of a common pain: teams write the order-approval rule directly inside a controller and inside an Entity Framework query. Two years later they want to move from SQL Server to PostgreSQL, or test the rule without a database, and the rule is glued to both. Clean architecture pulls the rule out so it stands alone.",
          ar: "هذا موجود بسبب ألم شائع: الفِرق تكتب قاعدة الموافقة على الـ order مباشرة داخل الـ controller وداخل استعلام Entity Framework. بعد سنتين يريدون الانتقال من SQL Server إلى PostgreSQL، أو اختبار القاعدة دون قاعدة بيانات، فيجدونها ملتصقة بالاثنين. Clean architecture تسحب القاعدة إلى الخارج لتقف وحدها." },
        { t: "callout", kind: "note",
          en: "This lesson is an honest assessment, not a sales pitch. Clean architecture earns its cost on some systems and wastes your time on others. We will be specific about which is which.",
          ar: "هذا الدرس تقييم صادق، لا ترويج. Clean architecture تستحق تكلفتها على بعض الأنظمة وتضيّع وقتك على غيرها. سنكون محددين حول أيّها." }
      ]
    },
    {
      key: "problem",
      blocks: [
        { t: "p",
          en: "Take one concrete rule: an order over $500 needs manager approval before it ships. In a typical tangled codebase this rule lives inside the controller, mixed with model binding, and inside an EF Core query that also loads the customer. The rule is not one thing you can find; it is scattered across three files that each also do web and database work.",
          ar: "خذ قاعدة واحدة محددة: أي order أكبر من 500 دولار يحتاج موافقة مدير قبل الشحن. في قاعدة كود متشابكة معتادة، تعيش هذه القاعدة داخل الـ controller، ممزوجة بـ model binding، وداخل استعلام EF Core يحمّل العميل أيضاً. القاعدة ليست شيئاً واحداً تجده؛ إنها موزّعة عبر ثلاثة ملفات يقوم كل منها أيضاً بعمل الويب وقاعدة البيانات." },
        { t: "p",
          en: "Now compare the cost of two changes. To unit-test 'orders over $500 need approval', the tangled version needs a fake HTTP request and a test database, so the test takes about 800 ms to run — meaning it is slow enough that developers stop running it. The clean version tests the rule as a plain object in about 2 ms, so the whole suite runs on every save.",
          ar: "الآن قارن تكلفة تغييرين. لاختبار 'الـ orders فوق 500 دولار تحتاج موافقة'، النسخة المتشابكة تحتاج HTTP request وهمياً وقاعدة بيانات للاختبار، فيستغرق الاختبار نحو 800 ميلي ثانية — أي أنه بطيء بما يكفي ليتوقف المطورون عن تشغيله. النسخة النظيفة تختبر القاعدة ككائن عادي في نحو 2 ميلي ثانية، فتعمل المجموعة كلها عند كل حفظ." },
        { t: "p",
          en: "The second change is swapping the email provider. In the tangled version the SendGrid client is called directly inside the order code, so the switch touches every place that sends mail. In the clean version the order code only knows an interface named IEmailSender, so you write one new class and change one line of wiring.",
          ar: "التغيير الثاني هو تبديل مزوّد الـ email. في النسخة المتشابكة يُستدعى SendGrid client مباشرة داخل كود الـ order، فيمسّ التبديل كل مكان يرسل بريداً. في النسخة النظيفة يعرف كود الـ order فقط interface اسمه IEmailSender، فتكتب class جديداً واحداً وتغيّر سطر ربط واحداً." }
      ]
    },
    {
      key: "internals",
      blocks: [
        { t: "p",
          en: "The mechanism is the dependency rule, and it has one direction: inward. Picture rings. The innermost ring holds entities — the core objects like Order with their built-in rules. Around it sits the use-case ring — actions like PlaceOrder. Around that sit interface adapters — controllers and repository classes that translate between the outside and the core. The outermost ring is frameworks and drivers: ASP.NET Core, EF Core, the email SDK.",
          ar: "الآلية هي الـ dependency rule، ولها اتجاه واحد: للداخل. تخيّل حلقات. الحلقة الأعمق تحوي الـ entities — الكائنات الأساسية مثل Order بقواعدها المدمجة. حولها حلقة الـ use-cases — إجراءات مثل PlaceOrder. حولها الـ interface adapters — الـ controllers وكلاسات الـ repository التي تترجم بين الخارج والمركز. الحلقة الأبعد هي الـ frameworks والـ drivers: ASP.NET Core و EF Core و email SDK." },
        { t: "kv", rows: [
          { k: { en: "Entities (core)", ar: "Entities (المركز)" },
            v: { en: "Order, Money — objects with rules that are true no matter what app uses them.", ar: "Order و Money — كائنات بقواعد صحيحة مهما كان التطبيق الذي يستخدمها." } },
          { k: { en: "Use cases (application)", ar: "Use cases (التطبيق)" },
            v: { en: "PlaceOrder — one action; it calls entities and depends only on interfaces.", ar: "PlaceOrder — إجراء واحد؛ يستدعي الـ entities ويعتمد على interfaces فقط." } },
          { k: { en: "Interface adapters", ar: "Interface adapters" },
            v: { en: "OrderController, EfOrderRepository — translate HTTP and SQL to and from the core.", ar: "OrderController و EfOrderRepository — تترجم HTTP و SQL من وإلى المركز." } },
          { k: { en: "Frameworks & drivers", ar: "Frameworks و drivers" },
            v: { en: "ASP.NET Core, EF Core, SendGrid — the replaceable tools at the edge.", ar: "ASP.NET Core و EF Core و SendGrid — الأدوات القابلة للاستبدال عند الحافة." } }
        ]},
        { t: "p",
          en: "The trick that makes the inward rule possible is dependency inversion. The core needs to save an order, but it must not reference EF Core. So the core defines the interface it wants, and the outer ring writes the class that implements it. The arrow of dependency now points from the outer class to the core interface — inward, as required.",
          ar: "الحيلة التي تجعل قاعدة الاتجاه للداخل ممكنة هي dependency inversion. المركز يحتاج حفظ order، لكن يجب ألا يشير إلى EF Core. لذا يعرّف المركز الـ interface الذي يريده، وتكتب الحلقة الخارجية الـ class الذي ينفّذه. سهم الاعتماد الآن يشير من الـ class الخارجي إلى interface المركز — للداخل، كما هو مطلوب." },
        { t: "code", lang: "csharp", label: { en: "Core defines the interface; infrastructure implements it", ar: "المركز يعرّف الـ interface؛ والـ infrastructure ينفّذه" },
          code: "// --- Core project: no reference to EF Core or ASP.NET ---\npublic interface IOrderRepository\n{\n    Task<Order?> GetAsync(int id);\n    Task SaveAsync(Order order);\n}\n\npublic sealed class PlaceOrder            // the use case\n{\n    private readonly IOrderRepository _repo;\n    private readonly IEmailSender _email;\n    public PlaceOrder(IOrderRepository repo, IEmailSender email)\n        => (_repo, _email) = (repo, email);\n\n    public async Task Handle(Order order)\n    {\n        order.Validate();                 // domain rule lives on the entity\n        await _repo.SaveAsync(order);\n        await _email.SendConfirmation(order);\n    }\n}\n\n// --- Infrastructure project: references EF Core, depends on Core ---\npublic sealed class EfOrderRepository : IOrderRepository\n{\n    private readonly AppDbContext _db;\n    public EfOrderRepository(AppDbContext db) => _db = db;\n    public Task<Order?> GetAsync(int id) => _db.Orders.FindAsync(id).AsTask();\n    public async Task SaveAsync(Order order)\n    {\n        _db.Orders.Add(order);\n        await _db.SaveChangesAsync();\n    }\n}" },
        { t: "p",
          en: "Trace one request. A POST arrives at OrderController (outer). It builds an Order and calls PlaceOrder (core). PlaceOrder runs order.Validate(), then calls _repo.SaveAsync — but at runtime _repo is really an EfOrderRepository, handed in by the dependency injection container at startup. The core ran real database code without ever naming EF Core. That is the whole point: the center stayed clean, the edge did the dirty work.",
          ar: "تتبّع طلباً واحداً. يصل POST إلى OrderController (خارجي). يبني Order ويستدعي PlaceOrder (المركز). يشغّل PlaceOrder دالة order.Validate() ثم يستدعي _repo.SaveAsync — لكن وقت التشغيل يكون _repo فعلياً EfOrderRepository، مرّره container الـ dependency injection عند البدء. شغّل المركز كود قاعدة بيانات حقيقياً دون أن يسمّي EF Core أبداً. هذا هو المقصد كله: المركز بقي نظيفاً، والحافة قامت بالعمل المتّسخ." },
        { t: "p",
          en: "Back to the kitchen: the recipe (PlaceOrder) says 'give me tomatoes' (IOrderRepository). At service time a specific supplier (EfOrderRepository) shows up with real tomatoes. The recipe never wrote the supplier's name, so a new supplier changes nothing in the recipe.",
          ar: "عودة للمطبخ: الوصفة (PlaceOrder) تقول 'أعطني طماطم' (IOrderRepository). وقت الخدمة يظهر مورّد محدد (EfOrderRepository) بطماطم حقيقية. الوصفة لم تكتب اسم المورّد أبداً، فالمورّد الجديد لا يغيّر شيئاً في الوصفة." }
      ]
    },
    {
      key: "tradeoffs",
      blocks: [
        { t: "tradeoff",
          pros: {
            en: ["Business rules test in milliseconds, with no database or web server.", "You can swap the database or email provider by writing one class.", "New engineers find the rules in one place, not scattered across controllers.", "The core has no framework version to break during an upgrade."],
            ar: ["قواعد العمل تُختبَر في ميلي ثوانٍ، دون قاعدة بيانات أو web server.", "يمكنك تبديل قاعدة البيانات أو مزوّد الـ email بكتابة class واحد.", "المهندسون الجدد يجدون القواعد في مكان واحد، لا موزّعة عبر الـ controllers.", "المركز لا يملك إصدار framework ينكسر أثناء الترقية."]
          },
          cons: {
            en: ["More projects, interfaces, and mapping code for the same feature.", "A simple CRUD screen becomes several files instead of one.", "Junior developers often add layers with no logic, just pass-through calls.", "Slower to write the first version of a feature."],
            ar: ["مشاريع وinterfaces وكود mapping أكثر للميزة نفسها.", "شاشة CRUD بسيطة تصبح عدة ملفات بدل واحد.", "المطورون المبتدئون غالباً يضيفون طبقات بلا منطق، مجرد نداءات تمرير.", "أبطأ في كتابة النسخة الأولى من الميزة."]
          },
          limits: {
            en: ["It organizes dependencies; it does not make the rules themselves correct.", "It does not remove the database — it only hides it behind an interface.", "The payoff only appears when the system lives long and changes often."],
            ar: ["ينظّم الاعتماديات؛ لا يجعل القواعد نفسها صحيحة.", "لا يزيل قاعدة البيانات — فقط يخفيها خلف interface.", "العائد يظهر فقط حين يعيش النظام طويلاً ويتغير كثيراً."]
          },
          alts: {
            en: ["Vertical slice architecture — organize by feature, not by layer.", "A plain layered app for a small, short-lived service.", "Transaction script — one method per action — for simple CRUD."],
            ar: ["Vertical slice architecture — التنظيم حسب الميزة، لا حسب الطبقة.", "تطبيق layered عادي لخدمة صغيرة قصيرة العمر.", "Transaction script — دالة لكل إجراء — للـ CRUD البسيط."]
          }
        }
      ]
    },
    {
      key: "mistakes",
      blocks: [
        { t: "mistake",
          title: { en: "Anemic core: rules leak back out", ar: "مركز فارغ: القواعد تتسرّب للخارج" },
          body: { en: "A team made Order a bag of public setters with no methods, then put the $500 approval rule in the use case. Soon a second use case needed the same rule and copied it. The two copies drifted, and one shipped orders that should have been held. The rule belongs on the entity, so there is one copy.", ar: "فريق جعل Order مجرد حقيبة setters عامة بلا دوال، ثم وضع قاعدة الموافقة عند 500 دولار في الـ use case. سريعاً احتاجها use case ثانٍ فنسخها. النسختان تباعدتا، وواحدة شحنت orders كان يجب حجزها. القاعدة تنتمي إلى الـ entity، ليكون هناك نسخة واحدة." },
          fix: "// Rule lives on the entity, one copy\npublic void Place()\n{\n    if (Total > 500 && !ApprovedByManager)\n        throw new DomainException(\"Order over $500 needs approval\");\n    Status = OrderStatus.Placed;\n}" },
        { t: "mistake",
          title: { en: "The core references EF Core anyway", ar: "المركز يشير إلى EF Core رغم كل شيء" },
          body: { en: "The core project 'just' used [Column] attributes and DbContext for convenience. Now the core cannot compile without EF Core, so it cannot be tested alone and cannot move to another data store. The whole benefit is gone. If the core references any infrastructure package, the dependency rule is already broken.", ar: "مشروع المركز 'فقط' استخدم [Column] attributes و DbContext للراحة. الآن لا يُترجَم المركز دون EF Core، فلا يمكن اختباره وحده ولا نقله لمخزن بيانات آخر. الفائدة كلها ذهبت. إذا أشار المركز إلى أي حزمة infrastructure، فقد انكسرت الـ dependency rule بالفعل." } },
        { t: "mistake",
          title: { en: "Layers with no logic (pass-through)", ar: "طبقات بلا منطق (تمرير فقط)" },
          body: { en: "Every entity got a repository, a service, and a DTO that only copies fields — even for a read-only lookup table of countries. The country screen became five files that do nothing but forward the call. This is ceremony, not architecture. A tiny read path can call the database directly.", ar: "كل entity حصلت على repository وservice وDTO ينسخ الحقول فقط — حتى لجدول بحث للدول للقراءة فقط. شاشة الدول أصبحت خمسة ملفات لا تفعل شيئاً سوى تمرير النداء. هذا طقوس، لا معمارية. مسار قراءة صغير يمكنه استدعاء قاعدة البيانات مباشرة." } },
        { t: "mistake",
          title: { en: "Leaking the ORM entity to the API", ar: "تسريب entity الـ ORM إلى الـ API" },
          body: { en: "The controller returned the EF Order entity straight as JSON. Adding a lazy-loaded navigation later triggered extra queries during serialization, and an internal field leaked to clients. The outer ring should map to a response model the API owns, so the core shape can change without breaking the contract.", ar: "الـ controller أعاد entity الـ Order من EF مباشرة كـ JSON. إضافة navigation بتحميل كسول لاحقاً أطلقت استعلامات إضافية أثناء الـ serialization، وتسرّب حقل داخلي للعملاء. الحلقة الخارجية يجب أن تُحوِّل إلى response model يملكه الـ API، ليتغير شكل المركز دون كسر العقد." } }
      ]
    },
    {
      key: "interview",
      blocks: [
        { t: "qa", level: "junior",
          q: { en: "What is the dependency rule in one sentence?", ar: "ما هي الـ dependency rule في جملة واحدة؟" },
          a: { en: "Source-code dependencies only point inward: outer things like controllers and the database may know about the core, but the core must never know about them. That is what keeps the business rules testable and independent.", ar: "اعتماديات الكود تشير للداخل فقط: الأشياء الخارجية مثل الـ controllers وقاعدة البيانات يمكن أن تعرف المركز، لكن المركز يجب ألا يعرفها أبداً. هذا ما يبقي قواعد العمل قابلة للاختبار ومستقلة." } },
        { t: "qa", level: "mid",
          q: { en: "How does the core call the database without depending on it?", ar: "كيف يستدعي المركز قاعدة البيانات دون الاعتماد عليها؟" },
          a: { en: "Dependency inversion. The core declares an interface, say IOrderRepository, describing what it needs. The infrastructure project writes a class that implements it using EF Core. At startup the DI container binds the interface to that class, so at runtime the core runs real database code while its source only ever references the interface.", ar: "Dependency inversion. المركز يعلن interface، مثل IOrderRepository، يصف ما يحتاجه. مشروع الـ infrastructure يكتب class ينفّذه بـ EF Core. عند البدء يربط container الـ DI الـ interface بذلك الـ class، فوقت التشغيل يشغّل المركز كود قاعدة بيانات حقيقياً بينما مصدره يشير إلى الـ interface فقط." } },
        { t: "qa", level: "mid",
          q: { en: "Where does the $500 approval rule belong, and why?", ar: "أين تنتمي قاعدة الموافقة عند 500 دولار، ولماذا؟" },
          a: { en: "On the Order entity itself, as a method like Place(). If it sits in a use case or a controller, a second caller will duplicate it and the copies will drift. Putting it on the entity means the rule cannot be bypassed, because you cannot place an order without going through the method that enforces it.", ar: "على entity الـ Order نفسها، كدالة مثل Place(). إن كانت في use case أو controller، سينسخها مستدعٍ ثانٍ وتتباعد النسخ. وضعها على الـ entity يعني أن القاعدة لا يمكن تجاوزها، لأنك لا تستطيع إنشاء order دون المرور بالدالة التي تفرضها." } },
        { t: "qa", level: "senior",
          q: { en: "When is clean architecture the wrong choice?", ar: "متى تكون clean architecture الخيار الخطأ؟" },
          a: { en: "When the app is mostly CRUD with thin rules, or is a short-lived tool, or a small team needs to ship fast. The cost is real: more projects, interfaces, and mapping. If the domain has little logic, you pay that cost and get almost nothing back. For those, a vertical slice or a plain layered app is usually the honest call.", ar: "حين يكون التطبيق غالباً CRUD بقواعد رقيقة، أو أداة قصيرة العمر، أو فريق صغير يحتاج الشحن بسرعة. التكلفة حقيقية: مشاريع وinterfaces وmapping أكثر. إن كان للـ domain منطق قليل، تدفع تلك التكلفة ولا تسترد شيئاً تقريباً. لتلك الحالات، vertical slice أو تطبيق layered عادي هو القرار الصادق عادة." } },
        { t: "qa", level: "senior",
          q: { en: "A junior wrapped a read-only lookup in a repository, service, and DTO. Do you keep it?", ar: "مبتدئ غلّف جدول بحث للقراءة فقط بـ repository وservice وDTO. هل تبقيه؟" },
          a: { en: "No, not for a pure read with no rules. Those layers exist to protect business logic; a lookup has none, so they are pass-through ceremony that adds files and slows everyone. I would let a query read it directly. Clean architecture is about protecting the parts that have rules, not applying the same template to everything.", ar: "لا، ليس لقراءة صرفة بلا قواعد. تلك الطبقات موجودة لحماية منطق العمل؛ جدول البحث لا يملك منطقاً، فتصبح طقوس تمرير تضيف ملفات وتبطئ الجميع. سأدع استعلاماً يقرأه مباشرة. Clean architecture عن حماية الأجزاء التي لها قواعد، لا تطبيق القالب نفسه على كل شيء." } },
        { t: "qa", level: "staff",
          q: { en: "The team applies clean architecture everywhere and velocity is dropping. How do you fix it structurally?", ar: "الفريق يطبّق clean architecture في كل مكان والسرعة تنخفض. كيف تصلح الأمر هيكلياً؟" },
          a: { en: "I would stop treating it as a rule for all code. I would write a short guideline: rich-domain features use the full structure; simple CRUD and read-only paths use a direct, single-file approach. Then I would review a few real pull requests together to calibrate the team on that line. The goal is a shared judgment about where the cost pays off, not one template enforced by habit.", ar: "سأتوقف عن معاملتها كقاعدة لكل الكود. سأكتب دليلاً قصيراً: ميزات الـ domain الغنية تستخدم الهيكل الكامل؛ الـ CRUD البسيط ومسارات القراءة فقط تستخدم نهجاً مباشراً بملف واحد. ثم سأراجع بضعة pull requests حقيقية معاً لمعايرة الفريق على هذا الخط. الهدف حكم مشترك حول أين تُثمر التكلفة، لا قالب واحد يُفرَض بالعادة." } }
      ]
    },
    {
      key: "codereview",
      blocks: [
        { t: "review", severity: "high",
          title: { en: "EF entity returned straight from the controller", ar: "entity الـ EF يُعاد مباشرة من الـ controller" },
          bad: "public async Task<IActionResult> Get(int id)\n{\n    var order = await _db.Orders\n        .Include(o => o.Customer)\n        .FirstOrDefaultAsync(o => o.Id == id);\n    return Ok(order);   // EF entity serialized as-is\n}",
          good: "public async Task<IActionResult> Get(int id)\n{\n    var order = await _repo.GetAsync(id);\n    if (order is null) return NotFound();\n    return Ok(new OrderResponse(\n        order.Id, order.Total, order.Status.ToString()));\n}",
          why: { en: "Returning the EF entity ties the public API to the database shape and can trigger surprise lazy-load queries during serialization. Map to a response model the API owns, so the core can change without breaking clients.", ar: "إعادة entity الـ EF تربط الـ API العام بشكل قاعدة البيانات وقد تطلق استعلامات lazy-load مفاجئة أثناء الـ serialization. حوّل إلى response model يملكه الـ API، ليتغير المركز دون كسر العملاء." } },
        { t: "review", severity: "medium",
          title: { en: "Use case new()s its own dependency", ar: "الـ use case يُنشئ اعتماديته بنفسه" },
          bad: "public sealed class PlaceOrder\n{\n    private readonly EfOrderRepository _repo = new();  // hard-wired\n    public Task Handle(Order o) => _repo.SaveAsync(o);\n}",
          good: "public sealed class PlaceOrder\n{\n    private readonly IOrderRepository _repo;\n    public PlaceOrder(IOrderRepository repo) => _repo = repo;\n    public Task Handle(Order o) => _repo.SaveAsync(o);\n}",
          why: { en: "Calling new EfOrderRepository() inside the core points the dependency outward and drags EF Core into the core project, breaking the rule and the tests. Depend on the interface and let DI supply the class.", ar: "استدعاء new EfOrderRepository() داخل المركز يوجّه الاعتماد للخارج ويجرّ EF Core إلى مشروع المركز، فيكسر القاعدة والاختبارات. اعتمد على الـ interface ودع الـ DI يوفّر الـ class." } }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        { t: "p",
          en: "In a real service, clean architecture usually shows up as separate projects in one solution: Core (entities and use cases), Infrastructure (EF Core, email, HTTP clients), and Web (controllers, startup). The compiler enforces the dependency rule for you — Core references nothing, and if someone adds an EF Core package to Core, the build should be treated as a red flag in review.",
          ar: "في خدمة حقيقية، تظهر clean architecture عادة كمشاريع منفصلة في solution واحد: Core (entities وuse cases) وInfrastructure (EF Core وemail وHTTP clients) وWeb (controllers وstartup). المترجِم يفرض الـ dependency rule عنك — Core لا يشير لشيء، وإن أضاف أحد حزمة EF Core إلى Core، فيجب معاملة البناء كإشارة خطر في المراجعة." },
        { t: "ul",
          en: ["Core project: entities with rules, use cases, and the interfaces it needs.", "Infrastructure project: implements those interfaces with EF Core, SendGrid, etc.", "Web project: controllers map HTTP to use cases; Program.cs wires interfaces to classes.", "Only the Web project knows about all three, so it is the composition root."],
          ar: ["مشروع Core: entities بقواعدها، use cases، والـ interfaces التي يحتاجها.", "مشروع Infrastructure: ينفّذ تلك الـ interfaces بـ EF Core وSendGrid وغيرها.", "مشروع Web: الـ controllers تربط HTTP بالـ use cases؛ Program.cs يربط الـ interfaces بالكلاسات.", "مشروع Web وحده يعرف الثلاثة، فهو composition root."] },
        { t: "callout", kind: "tip",
          en: "You do not need one project per ring on day one. Start with folders in a single project, and split into separate projects only when the team keeps accidentally breaking the dependency rule.",
          ar: "لا تحتاج مشروعاً لكل حلقة من اليوم الأول. ابدأ بمجلدات في مشروع واحد، واقسمها إلى مشاريع منفصلة فقط حين يظل الفريق يكسر الـ dependency rule بالخطأ." }
      ]
    },
    {
      key: "perf",
      blocks: [
        { t: "kv", rows: [
          { k: { en: "CPU", ar: "CPU" },
            v: { en: "Mapping entities to DTOs adds small object-copy work per request; negligible unless the payload is huge.", ar: "تحويل الـ entities إلى DTOs يضيف نسخ كائنات صغيراً لكل طلب؛ لا يُذكر إلا إذا كان الحمل ضخماً." } },
          { k: { en: "Memory", ar: "Memory" },
            v: { en: "Extra DTO objects mean more short-lived allocations, so a little more garbage collection pressure.", ar: "كائنات DTO إضافية تعني تخصيصات قصيرة العمر أكثر، فضغط garbage collection أعلى قليلاً." } },
          { k: { en: "Latency", ar: "Latency" },
            v: { en: "Interfaces are one virtual call each — nanoseconds. They do not move p99 latency in any real API.", ar: "الـ interfaces نداء virtual واحد لكل منها — نانوثوانٍ. لا تحرّك زمن الاستجابة p99 في أي API حقيقي." } },
          { k: { en: "Database", ar: "Database" },
            v: { en: "Hiding EF behind a repository can encourage loading whole entities when a projection would be cheaper — watch for it.", ar: "إخفاء EF خلف repository قد يشجّع تحميل entities كاملة حين يكون الـ projection أرخص — انتبه له." } },
          { k: { en: "Scalability", ar: "Scalability" },
            v: { en: "No direct effect; the core is stateless, which is what actually helps you scale out.", ar: "لا أثر مباشر؛ المركز stateless، وهذا ما يساعدك فعلاً على التوسّع أفقياً." } }
        ]}
      ]
    },
    {
      key: "debug",
      blocks: [
        { t: "ul",
          en: ["Check project references (the .csproj files): the Core project should reference no infrastructure package — an EF Core entry there means the rule is broken.", "Run the use-case unit tests: if they need a database to pass, the core is not actually isolated.", "Search the core for 'DbContext', '[Column]', 'HttpContext': any hit is an outer concept that leaked in.", "Enable EF Core query logging during a request to spot lazy-load queries fired while mapping to a DTO.", "Read Program.cs: confirm every interface has exactly one registered implementation, or DI will throw at startup."],
          ar: ["افحص مراجع المشاريع (ملفات .csproj): مشروع Core يجب ألا يشير لأي حزمة infrastructure — وجود EF Core هناك يعني كسر القاعدة.", "شغّل اختبارات الـ use-case: إن احتاجت قاعدة بيانات لتنجح، فالمركز ليس معزولاً فعلاً.", "ابحث في المركز عن 'DbContext' و'[Column]' و'HttpContext': أي نتيجة مفهوم خارجي تسرّب للداخل.", "فعّل تسجيل استعلامات EF Core أثناء طلب لرصد استعلامات lazy-load تُطلَق أثناء التحويل إلى DTO.", "اقرأ Program.cs: تأكد أن كل interface له تنفيذ مسجّل واحد بالضبط، وإلا سيرمي الـ DI عند البدء."] },
        { t: "callout", kind: "tip",
          en: "The fastest health check for a clean core is the test suite's speed. If the domain tests run in milliseconds with no database, the dependency rule is holding. If they need setup, it already leaked.",
          ar: "أسرع فحص لصحة المركز النظيف هو سرعة مجموعة الاختبارات. إن عملت اختبارات الـ domain في ميلي ثوانٍ دون قاعدة بيانات، فالـ dependency rule صامدة. إن احتاجت إعداداً، فقد تسرّبت بالفعل." }
      ]
    },
    {
      key: "realworld",
      blocks: [
        { t: "p",
          en: "Clean architecture pays off most where the business rules are rich, long-lived, and change often, and where the same rules must run in more than one place. It pays off least on thin CRUD apps and throwaway tools, where the rules barely exist and the extra structure is pure overhead.",
          ar: "clean architecture تُثمر أكثر حيث تكون قواعد العمل غنية وطويلة العمر وتتغير كثيراً، وحيث يجب أن تعمل القواعد نفسها في أكثر من مكان. وتُثمر أقل على تطبيقات CRUD الرقيقة والأدوات المؤقتة، حيث تكاد القواعد لا توجد وتكون البنية الإضافية عبئاً صرفاً." },
        { t: "ul",
          en: ["Payment and billing systems: dense rules (fees, limits, refunds) that must be tested without touching real money.", "Insurance and lending platforms: pricing and eligibility rules that change with regulation and must be verified in isolation.", "Healthcare scheduling: rules that outlive several UI and database rewrites over a decade.", "Internal admin CRUD tool: the opposite case — a plain layered or vertical-slice approach ships faster and reads easier."],
          ar: ["أنظمة الدفع والفوترة: قواعد كثيفة (رسوم، حدود، استردادات) يجب اختبارها دون لمس مال حقيقي.", "منصات التأمين والإقراض: قواعد التسعير والأهلية تتغير مع التنظيم ويجب التحقق منها بمعزل.", "جدولة الرعاية الصحية: قواعد تعيش أطول من عدة إعادات كتابة للواجهة وقاعدة البيانات عبر عقد.", "أداة CRUD إدارية داخلية: الحالة المعاكسة — نهج layered عادي أو vertical-slice يشحن أسرع ويُقرأ أسهل."] }
      ]
    },
    {
      key: "exercises",
      blocks: [
        { t: "ex", diff: "easy",
          en: "Take an existing controller that queries EF Core directly and returns the entity. Introduce an IOrderRepository interface and an OrderResponse model. Success: the controller no longer names EF Core, and the JSON shape is unchanged.",
          ar: "خذ controller قائماً يستعلم EF Core مباشرة ويعيد الـ entity. أدخِل interface باسم IOrderRepository وmodel باسم OrderResponse. النجاح: الـ controller لم يعد يسمّي EF Core، وشكل الـ JSON لم يتغير." },
        { t: "ex", diff: "medium",
          en: "Move the '$500 needs approval' rule from wherever it currently lives onto the Order entity as a Place() method. Success: a unit test for the rule runs with no database and no web host, in under 10 ms.",
          ar: "انقل قاعدة 'فوق 500 دولار يحتاج موافقة' من مكانها الحالي إلى entity الـ Order كدالة Place(). النجاح: اختبار وحدة للقاعدة يعمل دون قاعدة بيانات ودون web host، في أقل من 10 ميلي ثانية." },
        { t: "ex", diff: "hard",
          en: "Split a single-project app into Core, Infrastructure, and Web projects with correct references, and wire the interfaces in Program.cs. Success: the solution builds, the app runs end to end, and adding an EF Core package to Core causes a build you would reject in review.",
          ar: "قسّم تطبيق مشروع واحد إلى مشاريع Core وInfrastructure وWeb بمراجع صحيحة، واربط الـ interfaces في Program.cs. النجاح: الـ solution يُبنى، والتطبيق يعمل من طرف لطرف، وإضافة حزمة EF Core إلى Core تنتج بناءً ترفضه في المراجعة." },
        { t: "ex", diff: "senior",
          en: "Write a one-page team guideline that names which feature types use the full structure and which use a direct single-file approach, then apply it to two real features — one rich-domain, one CRUD. Success: a peer can read the guideline and place a new feature on the right side without asking you.",
          ar: "اكتب دليلاً بصفحة واحدة يحدد أنواع الميزات التي تستخدم الهيكل الكامل وتلك التي تستخدم نهج ملف واحد مباشر، ثم طبّقه على ميزتين حقيقيتين — واحدة domain غنية وأخرى CRUD. النجاح: يمكن لزميل قراءة الدليل ووضع ميزة جديدة في الجانب الصحيح دون سؤالك." }
      ]
    },
    {
      key: "refs",
      blocks: [
        { t: "ref", label: { en: "The Clean Architecture (Robert C. Martin)", ar: "The Clean Architecture (Robert C. Martin)" }, url: "https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html", meta: { en: "Article", ar: "مقال" } },
        { t: "ref", label: { en: "Common web application architectures (.NET)", ar: "معماريات تطبيقات الويب الشائعة (.NET)" }, url: "https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures", meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref", label: { en: "Clean Architecture: A Craftsman's Guide (book)", ar: "Clean Architecture: A Craftsman's Guide (كتاب)" }, url: "https://www.oreilly.com/library/view/clean-architecture-a/9780134494272/", meta: { en: "Book", ar: "كتاب" } },
        { t: "ref", label: { en: "Jason Taylor Clean Architecture template", ar: "قالب Jason Taylor لـ Clean Architecture" }, url: "https://github.com/jasontaylordev/CleanArchitecture", meta: { en: "GitHub", ar: "GitHub" } }
      ]
    }
  ],
  quiz: [
    {
      q: { en: "Which way do source-code dependencies point under the dependency rule?", ar: "في أي اتجاه تشير اعتماديات الكود المصدري تحت الـ dependency rule؟" },
      options: [
        { en: "Outward, from the core toward the framework.", ar: "للخارج، من المركز نحو الـ framework." },
        { en: "Inward, from outer rings toward the core.", ar: "للداخل، من الحلقات الخارجية نحو المركز." },
        { en: "Both ways, as long as interfaces are used.", ar: "في الاتجاهين، طالما تُستخدم interfaces." },
        { en: "Toward the database, since it holds the data.", ar: "نحو قاعدة البيانات، لأنها تحمل البيانات." }
      ],
      correct: 1,
      why: { en: "The dependency rule requires dependencies to point only inward. The core knows nothing about the outer rings.", ar: "الـ dependency rule تتطلب أن تشير الاعتماديات للداخل فقط. المركز لا يعرف شيئاً عن الحلقات الخارجية." }
    },
    {
      q: { en: "How does the core use a database without depending on EF Core?", ar: "كيف يستخدم المركز قاعدة بيانات دون الاعتماد على EF Core؟" },
      options: [
        { en: "It references EF Core but only in test builds.", ar: "يشير إلى EF Core لكن في بناءات الاختبار فقط." },
        { en: "It defines an interface that infrastructure implements, wired by DI.", ar: "يعرّف interface ينفّذه الـ infrastructure، ويربطه الـ DI." },
        { en: "It copies the EF Core source into the core project.", ar: "ينسخ مصدر EF Core إلى مشروع المركز." },
        { en: "It calls the database over HTTP instead.", ar: "يستدعي قاعدة البيانات عبر HTTP بدلاً من ذلك." }
      ],
      correct: 1,
      why: { en: "Dependency inversion: the core owns the interface, infrastructure implements it, and the DI container binds them at startup.", ar: "Dependency inversion: المركز يملك الـ interface، والـ infrastructure ينفّذه، وcontainer الـ DI يربطهما عند البدء." }
    },
    {
      q: { en: "Where should the '$500 needs approval' rule live?", ar: "أين يجب أن تعيش قاعدة 'فوق 500 دولار يحتاج موافقة'؟" },
      options: [
        { en: "In each controller that creates an order.", ar: "في كل controller ينشئ order." },
        { en: "In the EF Core query as a filter.", ar: "في استعلام EF Core كـ filter." },
        { en: "On the Order entity, so there is one enforced copy.", ar: "على entity الـ Order، لتكون نسخة واحدة مفروضة." },
        { en: "In a config file read at runtime.", ar: "في ملف إعدادات يُقرأ وقت التشغيل." }
      ],
      correct: 2,
      why: { en: "Putting the rule on the entity gives one copy that cannot be bypassed, avoiding duplicated rules that drift apart.", ar: "وضع القاعدة على الـ entity يعطي نسخة واحدة لا يمكن تجاوزها، ويتجنب قواعد مكررة تتباعد." }
    },
    {
      q: { en: "Which situation is the WEAKEST case for full clean architecture?", ar: "أي موقف هو الحالة الأضعف لتطبيق clean architecture الكامل؟" },
      options: [
        { en: "A payment system with dense, long-lived rules.", ar: "نظام دفع بقواعد كثيفة طويلة العمر." },
        { en: "A thin CRUD admin tool with almost no rules.", ar: "أداة CRUD إدارية رقيقة بلا قواعد تقريباً." },
        { en: "An insurance platform with rules that change with regulation.", ar: "منصة تأمين بقواعد تتغير مع التنظيم." },
        { en: "A system whose rules must run in two places.", ar: "نظام يجب أن تعمل قواعده في مكانين." }
      ],
      correct: 1,
      why: { en: "With almost no business rules, the extra projects and mapping are pure overhead; a simpler approach ships faster.", ar: "مع غياب قواعد العمل تقريباً، تكون المشاريع والـ mapping الإضافية عبئاً صرفاً؛ نهج أبسط يشحن أسرع." }
    },
    {
      q: { en: "A reviewer sees an EF Core package added to the Core project. What does it mean?", ar: "مراجِع يرى حزمة EF Core مضافة إلى مشروع Core. ماذا يعني ذلك؟" },
      options: [
        { en: "Nothing; the core may reference any package.", ar: "لا شيء؛ يمكن للمركز أن يشير لأي حزمة." },
        { en: "The dependency rule is broken and the core is no longer isolated.", ar: "الـ dependency rule مكسورة والمركز لم يعد معزولاً." },
        { en: "Performance will improve because of caching.", ar: "سيتحسن الأداء بسبب الـ caching." },
        { en: "It is required for dependency injection to work.", ar: "هي مطلوبة ليعمل الـ dependency injection." }
      ],
      correct: 1,
      why: { en: "If the core references infrastructure, it can no longer be tested or moved independently — the whole benefit is lost.", ar: "إن أشار المركز إلى الـ infrastructure، فلا يمكن اختباره أو نقله باستقلال — تُفقَد الفائدة كلها." }
    }
  ]
};
```

NEXT: vertical-slice
