```js
const apiVersioningLesson = {
  id: "api-versioning",
  moduleId: "foundations",
  title: { en: "Versioning and evolution", ar: "الإصدارات والتطوّر" },
  summary: {
    en: "How to change the shape of your requests and responses without breaking the programs that already call you.",
    ar: "كيف تغيّر شكل الـ request والـ response دون أن تكسر البرامج التي تستدعيك بالفعل."
  },
  mins: 15,
  sections: [
    {
      key: "why",
      blocks: [
        { t: "p",
          en: "An API version is a label on a request that tells the server which shape of input and output the caller expects. You need it because the moment another program reads your JSON, that JSON stops being yours to edit. Change it and their code breaks on the day you deploy, not on the day they are ready.",
          ar: "الـ API version هو label على الـ request يخبر الـ server بأي شكل من الـ input والـ output يتوقعه الـ caller. تحتاجه لأنه بمجرد أن يقرأ برنامج آخر الـ JSON الخاص بك، لم يعد ملكك لتعدّله كما تريد. إذا غيّرته سيتعطّل كودهم يوم تنشر أنت، لا يوم يكونون هم جاهزين."
        },
        { t: "kv", rows: [
          { k: { en: "Client", ar: "Client" },
            v: { en: "Any program that calls your API: a mobile app, a partner's server, your own frontend. The key point is that you usually cannot redeploy it.", ar: "أي برنامج يستدعي الـ API: تطبيق موبايل، server لشريك، أو الـ frontend الخاص بك. النقطة المهمة أنك عادةً لا تستطيع إعادة نشره." } },
          { k: { en: "Contract", ar: "Contract" },
            v: { en: "The exact fields, types and rules a client depends on. It is not a document — it is whatever the client's code actually reads.", ar: "الـ fields والأنواع والقواعد التي يعتمد عليها الـ client. ليس مستنداً — هو ما يقرأه كود الـ client فعلياً." } },
          { k: { en: "Breaking change", ar: "Breaking change" },
            v: { en: "A change that makes correct old client code stop working: removing a field, renaming it, changing its type, or requiring a new input.", ar: "تغيير يجعل كود client قديماً وصحيحاً يتوقف عن العمل: حذف field، أو إعادة تسميته، أو تغيير نوعه، أو طلب input جديد إجبارياً." } },
          { k: { en: "Additive change", ar: "Additive change" },
            v: { en: "A change old clients can safely ignore: a new optional field in the response, or a new optional input.", ar: "تغيير يستطيع الـ clients القدامى تجاهله بأمان: field اختياري جديد في الـ response، أو input اختياري جديد." } },
          { k: { en: "Deprecation", ar: "Deprecation" },
            v: { en: "Publicly announcing that a version will be switched off on a stated date, while it keeps working until then.", ar: "إعلان علني أن نسخة ستُغلق في تاريخ محدّد، مع بقائها تعمل حتى ذلك التاريخ." } },
          { k: { en: "Sunset", ar: "Sunset" },
            v: { en: "A standard HTTP response header carrying the date a version stops working, so the removal is machine-readable, not just an email.", ar: "response header قياسي في HTTP يحمل تاريخ توقّف النسخة، حتى يكون الإغلاق قابلاً للقراءة آلياً لا مجرد بريد إلكتروني." } }
        ]},
        { t: "p",
          en: "The pressure comes from one fact: you deploy and they do not. You can ship a new build of your service in ten minutes. A mobile app on a customer's phone updates when that customer feels like it, which for many people is never. So at any moment your single server is being called by three or four generations of client code at the same time. Versioning is what lets those generations run side by side.",
          ar: "الضغط يأتي من حقيقة واحدة: أنت تنشر وهم لا ينشرون. تستطيع إصدار نسخة جديدة من الـ service خلال عشر دقائق. أما تطبيق الموبايل على هاتف العميل فيتحدّث عندما يريد العميل، وكثيرون لا يفعلون أبداً. لذلك في أي لحظة يستدعي الـ server الواحد ثلاثة أو أربعة أجيال من كود الـ clients في الوقت نفسه. الـ versioning هو ما يسمح لهذه الأجيال بالعمل جنباً إلى جنب."
        },
        { t: "p",
          en: "Think of the power sockets in an office building. Once people have plugged in laptops, printers and lamps, you cannot change the pin layout on a Tuesday. What buildings do instead is install the new socket type next to the old one. They put a notice on the old one saying it goes away next year. Both stay live during the switch. An API version is that second socket: the old shape stays powered while callers move over at their own pace.",
          ar: "تخيّل مقابس الكهرباء في مبنى مكاتب. بعد أن يوصّل الناس أجهزة اللابتوب والطابعات والمصابيح، لا تستطيع تغيير شكل الفتحات فجأة. ما تفعله المباني هو تركيب المقبس الجديد بجوار القديم. ثم تضع إشعاراً على القديم بأنه سيُزال العام القادم. ويبقى الاثنان يعملان أثناء الانتقال. الـ API version هو ذلك المقبس الثاني: الشكل القديم يبقى يعمل بينما ينتقل الـ callers بالسرعة التي تناسبهم."
        },
        { t: "callout", kind: "note",
          en: "Versioning is not something you add later. Your first public release is v1 whether you label it or not — and an unlabelled API is simply a v1 with no way to move off it.",
          ar: "الـ versioning ليس شيئاً تضيفه لاحقاً. أول إصدار عام لديك هو v1 سواء وضعت له label أم لا — والـ API بلا label هو ببساطة v1 لا تملك طريقة للخروج منه."
        }
      ]
    },
    {
      key: "problem",
      blocks: [
        { t: "p",
          en: "Take one endpoint. GET /orders/1017 returns { \"id\": 1017, \"customerName\": \"Sara\", \"total\": 249.50 }. The team now wants a customer object instead of a flat name, and wants total renamed to totalAmount to match the rest of the API. Both changes are small, correct, and take an afternoon.",
          ar: "خذ endpoint واحداً. الاستدعاء GET /orders/1017 يُرجع { \"id\": 1017, \"customerName\": \"Sara\", \"total\": 249.50 }. الآن يريد الفريق customer object بدل الاسم المسطّح، ويريد إعادة تسمية total إلى totalAmount ليتطابق مع بقية الـ API. التغييران صغيران وصحيحان ويستغرقان بعد ظهر واحد."
        },
        { t: "p",
          en: "Deploying that over the old response breaks every client reading total. In a typical mobile product, about 40 out of every 100 active installs still run a build from three months ago. That means 40% of your users are executing code you cannot patch. Those users see 0.00 on the order screen. Their JSON parser looked for total, did not find it, and left the number at its default value of zero. Nothing throws. Nothing appears in your error logs. You learn about it from support tickets the next morning.",
          ar: "نشر هذا فوق الـ response القديم يكسر كل client يقرأ total. في منتج موبايل نموذجي، حوالي 40 من كل 100 تثبيت نشط ما زالت تعمل بنسخة عمرها ثلاثة أشهر. هذا يعني أن 40% من مستخدميك ينفّذون كوداً لا تستطيع تعديله. هؤلاء يرون 0.00 في شاشة الطلب. الـ JSON parser بحث عن total ولم يجده، فترك الرقم على قيمته الافتراضية صفر. لا يُرمى أي exception. لا يظهر شيء في سجلات الأخطاء. تعرف بالأمر من تذاكر الدعم في صباح اليوم التالي."
        },
        { t: "kv", rows: [
          { k: { en: "Add optional deliveryEta to the response", ar: "إضافة deliveryEta اختياري إلى الـ response" },
            v: { en: "Safe. Old parsers skip fields they do not recognise, so nothing notices.", ar: "آمن. الـ parsers القديمة تتجاهل الـ fields التي لا تعرفها، فلا يلاحظ أحد." } },
          { k: { en: "Rename total to totalAmount", ar: "إعادة تسمية total إلى totalAmount" },
            v: { en: "Breaking, and silently so. Every client reading total now reads zero and shows a wrong number.", ar: "كاسر، وبصمت. كل client يقرأ total صار يقرأ صفراً ويعرض رقماً خاطئاً." } },
          { k: { en: "Change total from 249.50 to \"249.50\"", ar: "تغيير total من 249.50 إلى \"249.50\"" },
            v: { en: "Breaking. A client deserializing into a decimal field now throws a parse error on every order.", ar: "كاسر. الـ client الذي يحوّلها إلى decimal صار يرمي parse error مع كل طلب." } },
          { k: { en: "Make the optional currency input required", ar: "جعل الـ input الاختياري currency إجبارياً" },
            v: { en: "Breaking. Old clients get 400 responses for requests that succeeded yesterday.", ar: "كاسر. الـ clients القدامى يحصلون على 400 لطلبات كانت تنجح بالأمس." } },
          { k: { en: "Accept a longer note field than before", ar: "قبول note أطول مما كان" },
            v: { en: "Safe. Loosening validation never invalidates a request that already passed.", ar: "آمن. تخفيف الـ validation لا يُبطل أبداً طلباً كان يمرّ من قبل." } }
        ]}
      ]
    },
    {
      key: "internals",
      blocks: [
        { t: "p",
          en: "Versioning is two separate mechanisms, and mixing them up is where most of the confusion comes from. The first is how the version gets into the request. The second is how the server uses it to pick which piece of code runs.",
          ar: "الـ versioning آليتان منفصلتان، والخلط بينهما مصدر معظم الالتباس. الأولى: كيف تصل النسخة داخل الـ request. الثانية: كيف يستخدمها الـ server لاختيار الكود الذي سينفَّذ."
        },
        { t: "p",
          en: "There are four common ways to carry the version. In the path: GET /v1/orders/1017, visible in every log line and every browser bar. In a custom header: GET /orders/1017 with X-Api-Version: 2, which keeps the URL stable. In the media type, using content negotiation — the mechanism where the client states the format it wants in the Accept header: Accept: application/vnd.shop.order+json;v=2. Or in the query string: /orders/1017?api-version=2. They differ only in where the label sits; everything after that is identical.",
          ar: "هناك أربع طرق شائعة لحمل النسخة. في المسار: GET /v1/orders/1017، وتظهر في كل سطر log وفي شريط المتصفح. في header مخصّص: GET /orders/1017 مع X-Api-Version: 2، وهذا يُبقي الـ URL ثابتاً. في الـ media type عبر content negotiation — وهي الآلية التي يعلن فيها الـ client الصيغة التي يريدها في الـ Accept header: Accept: application/vnd.shop.order+json;v=2. أو في الـ query string: /orders/1017?api-version=2. الفرق بينها هو موضع الـ label فقط؛ وما بعد ذلك متطابق."
        },
        { t: "kv", rows: [
          { k: { en: "Version reader", ar: "Version reader" },
            v: { en: "The component that pulls the version out of the request — a path segment, a header, or a query parameter.", ar: "المكوّن الذي يستخرج النسخة من الـ request: جزء من المسار، أو header، أو query parameter." } },
          { k: { en: "Default version", ar: "Default version" },
            v: { en: "What the server assumes when a request carries no version at all. Usually the oldest version you still support.", ar: "ما يفترضه الـ server عندما لا يحمل الـ request أي نسخة. عادةً أقدم نسخة ما زلت تدعمها." } },
          { k: { en: "Action selector", ar: "Action selector" },
            v: { en: "The step that looks at all handler methods matching the route and keeps the one declared for that version.", ar: "الخطوة التي تنظر إلى كل الـ handler methods المطابقة للمسار وتُبقي تلك المعلنة لتلك النسخة." } },
          { k: { en: "Version metadata", ar: "Version metadata" },
            v: { en: "Headers the server adds to the response — api-supported-versions and Sunset — so a client can discover what exists and what is ending.", ar: "headers يضيفها الـ server إلى الـ response — مثل api-supported-versions و Sunset — ليكتشف الـ client ما هو متاح وما سينتهي." } }
        ]},
        { t: "p",
          en: "Now trace one request end to end in ASP.NET Core using the Asp.Versioning package. First, routing matches the template v{version:apiVersion}/orders/{id} against GET /v2/orders/1017 and captures the text 2. Second, the version reader turns that text into an ApiVersion value of 2.0. Third, the action selector looks at both methods that could serve /orders/{id} and keeps the one marked MapToApiVersion(\"2.0\"). Fourth, that method runs, loads the order, and maps it to the v2 response type. Fifth, the middleware attaches api-supported-versions: 1.0, 2.0 to the response. The version reader is the receptionist reading the floor number off your visitor pass; the action selector is the lift that only stops at that floor. The building underneath — the database, the business rules — is the same either way.",
          ar: "الآن تتبّع request واحداً من أوله إلى آخره في ASP.NET Core باستخدام حزمة Asp.Versioning. أولاً: الـ routing يطابق القالب v{version:apiVersion}/orders/{id} مع GET /v2/orders/1017 ويلتقط النص 2. ثانياً: الـ version reader يحوّل هذا النص إلى قيمة ApiVersion تساوي 2.0. ثالثاً: الـ action selector ينظر إلى الـ method-ين اللذين يمكنهما خدمة /orders/{id} ويُبقي الموسوم بـ MapToApiVersion(\"2.0\"). رابعاً: تُنفَّذ تلك الـ method، تقرأ الطلب، وتحوّله إلى نوع الـ response الخاص بـ v2. خامساً: يضيف الـ middleware الترويسة api-supported-versions: 1.0, 2.0 إلى الـ response. الـ version reader هو موظف الاستقبال الذي يقرأ رقم الطابق من بطاقة الزائر؛ والـ action selector هو المصعد الذي لا يقف إلا عند ذلك الطابق. أما المبنى تحتهما — قاعدة البيانات وقواعد العمل — فهو نفسه في الحالتين."
        },
        { t: "code", lang: "csharp",
          label: { en: "Two versions of one endpoint over one domain object", ar: "نسختان من endpoint واحد فوق domain object واحد" },
          code: "// Program.cs — configured once for the whole app\nbuilder.Services.AddApiVersioning(o =>\n{\n    o.DefaultApiVersion = new ApiVersion(1, 0);\n    o.AssumeDefaultVersionWhenUnspecified = true;  // callers sending no version get 1.0\n    o.ReportApiVersions = true;                    // adds api-supported-versions header\n    o.ApiVersionReader = new UrlSegmentApiVersionReader();\n});\n\n[ApiController]\n[Route(\"v{version:apiVersion}/orders\")]\n[ApiVersion(\"1.0\", Deprecated = true)]\n[ApiVersion(\"2.0\")]\npublic class OrdersController : ControllerBase\n{\n    private readonly IOrderService _orders;\n\n    [HttpGet(\"{id:int}\"), MapToApiVersion(\"1.0\")]\n    public async Task<ActionResult<OrderV1>> GetV1(int id)\n    {\n        var order = await _orders.GetAsync(id);   // same domain object\n        return order is null ? NotFound() : OrderV1.From(order);\n    }\n\n    [HttpGet(\"{id:int}\"), MapToApiVersion(\"2.0\")]\n    public async Task<ActionResult<OrderV2>> GetV2(int id)\n    {\n        var order = await _orders.GetAsync(id);   // same domain object\n        return order is null ? NotFound() : OrderV2.From(order);\n    }\n}\n\n// OrderV1.From(order) -> { \"id\": 1017, \"customerName\": \"Sara\", \"total\": 249.50 }\n// OrderV2.From(order) -> { \"id\": 1017, \"customer\": { \"id\": 88, \"name\": \"Sara\" }, \"totalAmount\": 249.50 }"
        },
        { t: "p",
          en: "Notice what is not versioned. Both handlers call the same service and load the same Order entity. The version applies to the response type, not to your domain model or your database. Keeping one internal Order plus two small mapping methods is exactly what stops two versions from slowly drifting into two half-maintained products.",
          ar: "لاحظ ما هو غير مُنسَّخ. كلا الـ handler-ين يستدعي نفس الـ service ويقرأ نفس الـ Order entity. النسخة تنطبق على نوع الـ response، لا على الـ domain model ولا على قاعدة البيانات. الاحتفاظ بـ Order داخلي واحد مع mapping method-ين صغيرين هو بالضبط ما يمنع النسختين من الانحراف تدريجياً إلى منتجَين نصف مُصانَين."
        }
      ]
    },
    {
      key: "tradeoffs",
      blocks: [
        { t: "tradeoff",
          pros: {
            en: [
              "Putting the version in the URL makes it visible in logs, curl commands and browser bars — you always know which version a request used.",
              "A gateway or load balancer can route /v1 and /v2 to completely different deployments with no code involved.",
              "Easy to explain to a partner in one sentence: \"call /v2 instead\".",
              "Anyone can test it by pasting a URL; no client library or special header needed."
            ],
            ar: [
              "وضع النسخة في الـ URL يجعلها ظاهرة في الـ logs وأوامر curl وشريط المتصفح — تعرف دائماً أي نسخة استُخدمت.",
              "يستطيع الـ gateway أو الـ load balancer توجيه /v1 و /v2 إلى deployments مختلفة تماماً دون أي كود.",
              "سهل الشرح لشريك في جملة واحدة: «استدعِ /v2 بدلاً منه».",
              "يستطيع أي شخص تجربته بلصق URL؛ دون حاجة إلى client library أو header خاص."
            ]
          },
          cons: {
            en: [
              "The same order now has two URLs, which contradicts the idea that a URL names one resource.",
              "It tempts teams to bump the entire API for a change that touched one field.",
              "Clients hard-code the version into URL strings scattered across their codebase, making their upgrade harder than it should be.",
              "Two live versions means two sets of tests and two places to apply every fix."
            ],
            ar: [
              "الطلب نفسه صار له URL-ان، وهذا يناقض فكرة أن الـ URL يسمّي resource واحداً.",
              "يغري الفرق برفع نسخة الـ API كلها من أجل تغيير مسّ field واحداً.",
              "الـ clients يضعون النسخة داخل نصوص URL منتشرة في كودهم، ما يجعل ترقيتهم أصعب مما يجب.",
              "نسختان حيّتان تعنيان مجموعتَي اختبارات وموضعَين لتطبيق كل إصلاح."
            ]
          },
          limits: {
            en: [
              "It only versions the URL, so it cannot express \"same endpoint, different response format\".",
              "HTTP caches key on the full URL, so v1 and v2 are cached separately even when the bytes are identical.",
              "It says nothing about messages on a queue or gRPC calls, which need their own scheme.",
              "It does not help with a change inside a field's meaning — same name, same type, new semantics is invisible to any versioning scheme."
            ],
            ar: [
              "يُنسّخ الـ URL فقط، فلا يستطيع التعبير عن «نفس الـ endpoint بصيغة response مختلفة».",
              "الـ HTTP caches تعتمد على الـ URL كاملاً، فتُخزَّن v1 و v2 منفصلتين حتى لو كانت البايتات متطابقة.",
              "لا يقول شيئاً عن الرسائل في الـ queue أو استدعاءات gRPC، وهذه تحتاج أسلوبها الخاص.",
              "لا يساعد عندما يتغيّر معنى الـ field: نفس الاسم ونفس النوع بدلالة جديدة لا يراه أي أسلوب versioning."
            ]
          },
          alts: {
            en: [
              "Header versioning (X-Api-Version: 2) — stable URLs, but invisible in logs unless you log that header on purpose.",
              "Media-type versioning through Accept — the most correct under REST rules, and the hardest for partners to get right.",
              "Date versioning (2024-08-01) — one global timeline; good when many small changes ship often, as each account is pinned to a date.",
              "No versions at all — allow only additive changes and never remove a field. Cheapest to run, and it forces you to live with old names forever."
            ],
            ar: [
              "Header versioning عبر X-Api-Version: 2 — URLs ثابتة، لكنها غير مرئية في الـ logs ما لم تسجّل ذلك الـ header عمداً.",
              "Media-type versioning عبر Accept — الأصحّ وفق قواعد REST، والأصعب على الشركاء أن يضبطوه.",
              "Date versioning مثل 2024-08-01 — خط زمني واحد؛ مناسب عندما تُنشر تغييرات صغيرة كثيرة، إذ يُثبَّت كل حساب على تاريخ.",
              "بلا versions إطلاقاً — تسمح بالتغييرات الإضافية فقط ولا تحذف field أبداً. الأرخص تشغيلاً، ويجبرك على التعايش مع الأسماء القديمة إلى الأبد."
            ]
          }
        }
      ]
    },
    {
      key: "mistakes",
      blocks: [
        { t: "mistake",
          title: { en: "Bumping the whole API for one field", ar: "رفع نسخة الـ API كلها من أجل field واحد" },
          body: {
            en: "A team renamed total to totalAmount on the order endpoint and created /v2 for all 47 endpoints in the service. Forty-six of them were copy-pasted unchanged. Six months later a bug fix landed in /v2/customers and nobody remembered /v1/customers, so the same customer id returned two different email addresses depending on which URL you asked. Version the smallest unit you can: one endpoint, or even one response type.",
            ar: "فريق أعاد تسمية total إلى totalAmount في endpoint الطلبات وأنشأ /v2 لكل الـ 47 endpoint في الـ service. ستة وأربعون منها نُسخت كما هي. بعد ستة أشهر نزل إصلاح خطأ في /v2/customers ونسي الجميع /v1/customers، فصار نفس الـ customer id يُرجع بريدين مختلفين حسب الـ URL الذي تسأله. نسّخ أصغر وحدة ممكنة: endpoint واحد، أو حتى نوع response واحد."
          },
          fix: "// version the controller that changed, not the service\n[ApiVersion(\"1.0\")]\n[ApiVersion(\"2.0\")]\n[Route(\"v{version:apiVersion}/customers\")]\npublic class CustomersController : ControllerBase\n{\n    // one action serves both versions - nothing changed here\n    [HttpGet(\"{id:int}\")]\n    public Task<CustomerDto> Get(int id) => _customers.GetAsync(id);\n}"
        },
        { t: "mistake",
          title: { en: "Calling a new required input \"additive\"", ar: "تسمية input إجباري جديد «إضافة»" },
          body: {
            en: "A team added currency to the POST /orders body and marked it [Required]. They filed it as an additive change in the release notes, because nothing had been removed. Within an hour every old client was getting 400 responses on requests that had worked the previous day, and order creation dropped by a third. Adding an input is only safe while the server still accepts requests that leave it out.",
            ar: "فريق أضاف currency إلى جسم POST /orders ووسمه بـ [Required]. سجّلوه في ملاحظات الإصدار كتغيير إضافي لأن شيئاً لم يُحذف. خلال ساعة صار كل client قديم يتلقى 400 على طلبات كانت تعمل بالأمس، وانخفض إنشاء الطلبات بمقدار الثلث. إضافة input تكون آمنة فقط ما دام الـ server يقبل الطلبات التي لا تحتوي عليه."
          },
          fix: "public class CreateOrderRequest\n{\n    public required List<OrderLine> Lines { get; init; }\n\n    // optional, with the previous implicit behaviour as the default\n    public string Currency { get; init; } = \"EUR\";\n}"
        },
        { t: "mistake",
          title: { en: "Adding versioning without keeping the old route alive", ar: "إضافة versioning دون إبقاء المسار القديم يعمل" },
          body: {
            en: "An API had been live and unversioned for a year at /orders. The team introduced versioning by adding v{version:apiVersion} to the route template. Every existing caller was still requesting /orders, which now matched no route, so they all received 404. The 404s were logged as client errors, not server errors, so no alert fired and the outage lasted two hours. When you add versioning to a live API, the old unversioned route must keep working and must map to v1.",
            ar: "كان هناك API يعمل بلا versions منذ سنة على /orders. أضاف الفريق الـ versioning بوضع v{version:apiVersion} في قالب المسار. كل الـ callers القدامى ظلّوا يطلبون /orders، الذي لم يعد يطابق أي مسار، فتلقّوا جميعاً 404. سُجّلت الـ 404 كأخطاء client لا server، فلم ينطلق أي تنبيه واستمر العطل ساعتين. عند إضافة versioning إلى API حيّ، يجب أن يبقى المسار القديم بلا نسخة يعمل وأن يُوجَّه إلى v1."
          },
          fix: "[ApiVersion(\"1.0\")]\n[ApiVersion(\"2.0\")]\n[Route(\"orders\")]                        // old callers, no version segment\n[Route(\"v{version:apiVersion}/orders\")]  // new callers\npublic class OrdersController : ControllerBase { }\n\n// and in Program.cs:\no.AssumeDefaultVersionWhenUnspecified = true;"
        },
        { t: "mistake",
          title: { en: "Never turning an old version off", ar: "عدم إغلاق أي نسخة قديمة أبداً" },
          body: {
            en: "v1 shipped in 2021 and was never removed. By 2025 the service had five live versions, so every security fix had to be written and tested five times. A change to the pricing rule was applied to four of the five. The one missed was v2, still used by a payment partner. It billed the old price for eleven days before anyone noticed. A version you cannot retire is a version you pay for forever. Announce a removal date with the Sunset header on the day you release its replacement, not years later.",
            ar: "صدرت v1 في 2021 ولم تُزل أبداً. بحلول 2025 كان لدى الـ service خمس نسخ حيّة، فصار كل إصلاح أمني يُكتب ويُختبر خمس مرات. طُبّق تغيير في قاعدة التسعير على أربع من الخمس. والمنسيّة كانت v2، وما زال يستخدمها شريك دفع. فحاسب بالسعر القديم أحد عشر يوماً قبل أن يلاحظ أحد. النسخة التي لا تستطيع إيقافها نسخة تدفع ثمنها إلى الأبد. أعلن تاريخ الإزالة عبر الـ Sunset header يوم تُطلق بديلها، لا بعد سنوات."
          },
          fix: "// returned on every v1 response from the day v2 ships\nSunset: Sat, 31 Jan 2026 23:59:59 GMT\nDeprecation: true\nLink: <https://docs.example.com/migrate-v2>; rel=\"deprecation\""
        }
      ]
    },
    {
      key: "interview",
      blocks: [
        { t: "qa", level: "junior",
          q: { en: "What makes a change a breaking change?", ar: "ما الذي يجعل التغيير breaking change؟" },
          a: {
            en: "A change is breaking if a client that was written correctly against the old contract stops working. In practice that means four things: you removed a field, you renamed a field, you changed a field's type, or you started requiring an input that used to be optional. Everything else is usually safe, because clients ignore what they do not recognise. The test I apply is: could an old caller's code still produce the same result without being edited? If not, it is breaking.",
            ar: "التغيير يكون breaking إذا توقّف client كُتب بشكل صحيح على العقد القديم عن العمل. عملياً هذا يعني أربعة أشياء: حذفت field، أو أعدت تسميته، أو غيّرت نوعه، أو صرت تشترط input كان اختيارياً. ما عدا ذلك آمن غالباً لأن الـ clients تتجاهل ما لا تعرفه. الاختبار الذي أطبّقه: هل يستطيع كود caller قديم أن ينتج نفس النتيجة دون تعديل؟ إذا لا، فهو breaking."
          }
        },
        { t: "qa", level: "mid",
          q: { en: "URL versioning or header versioning — how do you choose?", ar: "URL versioning أم header versioning — كيف تختار؟" },
          a: {
            en: "I choose by who the callers are. If the API is public or has outside partners, I put the version in the URL. It shows up in their logs and in mine. They can test it by pasting a link. And support conversations become one sentence. If the callers are internal teams and I care about stable URLs and clean caching, a header is nicer. The one thing I do not do is support both, because then two requests that look different are the same and every log query has to check two places.",
            ar: "أختار حسب هوية الـ callers. إذا كان الـ API عاماً أو لديه شركاء خارجيون أضع النسخة في الـ URL. فهي تظهر في سجلاتهم وسجلاتي. ويستطيعون تجربتها بلصق رابط. وتصير محادثة الدعم جملة واحدة. أما إذا كان الـ callers فرقاً داخلية وأهتم بثبات الـ URLs ونظافة الـ caching فالـ header أفضل. الشيء الوحيد الذي لا أفعله هو دعم الاثنين معاً، لأن حينها يصير طلبان مختلفان في الشكل نفس الشيء، وكل استعلام logs يجب أن يفحص موضعين."
          }
        },
        { t: "qa", level: "mid",
          q: { en: "You need to rename a field. Do it without creating a new version.", ar: "تحتاج إلى إعادة تسمية field. افعل ذلك دون إنشاء نسخة جديدة." },
          a: {
            en: "I use expand then contract. First expand: I add totalAmount to the response and keep total, both filled from the same value. Nothing breaks, because old clients read the old name and new clients read the new one. Then I mark total deprecated in the OpenAPI document and put a Sunset date on it. Then I wait, and I watch which clients still call that endpoint on old app builds. Only when that number is effectively zero, or the announced date has passed, do I contract: remove total, and that removal is the change that needs a new major version. The rename itself never needed one.",
            ar: "أستخدم expand ثم contract. أولاً التوسيع: أضيف totalAmount إلى الـ response وأُبقي total، ويُملأ الاثنان من نفس القيمة. لا شيء ينكسر، لأن الـ clients القدامى يقرأون الاسم القديم والجدد يقرأون الجديد. ثم أضع total كـ deprecated في مستند الـ OpenAPI وأضع له تاريخ Sunset. ثم أنتظر وأراقب أي clients ما زالت تستدعي الـ endpoint بنسخ تطبيق قديمة. وعندما يصير هذا الرقم صفراً عملياً، أو يمرّ التاريخ المعلن، أنفّذ التقليص: أحذف total، وهذا الحذف هو التغيير الذي يحتاج نسخة major جديدة. أما إعادة التسمية نفسها فلم تحتج واحدة أبداً."
          }
        },
        { t: "qa", level: "senior",
          q: { en: "How do you know it is safe to delete v1?", ar: "كيف تعرف أن حذف v1 آمن؟" },
          a: {
            en: "I do not decide it, I measure it. I need a counter of requests broken down by version and by client identity — an API key, a client id header, or at worst a user agent. That gives me a list: who is on v1, how much traffic, and whether it is growing or shrinking. Then I contact the top callers directly, because a changelog nobody reads is not notice. Then I run a brownout: return 410 Gone for v1 for ten minutes at a scheduled time, and see who calls me. If the brownout is quiet, the removal will be quiet. If it is not, I have found the client that never read the email, and I have found it without a real outage.",
            ar: "لا أقرّر ذلك، بل أقيسه. أحتاج عدّاداً للطلبات مقسّماً حسب النسخة وحسب هوية الـ client — مفتاح API، أو header فيه client id، أو في أسوأ الأحوال الـ user agent. هذا يعطيني قائمة: من على v1، وكم حجم الحركة، وهل تنمو أم تتراجع. ثم أتواصل مع أكبر الـ callers مباشرة، لأن changelog لا يقرأه أحد ليس إشعاراً. ثم أنفّذ brownout: أُرجع 410 Gone لـ v1 لمدة عشر دقائق في وقت محدّد وأرى من يتصل بي. إذا كان الـ brownout هادئاً فالإزالة ستكون هادئة. وإذا لم يكن، أكون قد وجدت الـ client الذي لم يقرأ البريد، ووجدته دون عطل حقيقي."
          }
        },
        { t: "qa", level: "senior",
          q: { en: "How do you version an event on a message queue, where there is no URL and no Accept header?", ar: "كيف تُنسّخ event على message queue حيث لا يوجد URL ولا Accept header؟" },
          a: {
            en: "The version goes in the message itself. Every message carries an envelope, which is a small wrapper around the payload. That envelope holds a type name and a version number. Some teams put a schema id there instead, pointing at a schema registry — a service that stores the agreed shape of each message type. Consumers must be written to tolerate unknown fields, because producers will add them. The rule I enforce is simple: a producer never changes the meaning of an existing field in place. It adds a new field instead. Or it publishes a new message type and sends both for a while, until every consumer has moved. The hard part that is different from HTTP is that old messages live in the log forever, so a consumer replaying history must still understand every version ever published.",
            ar: "النسخة توضع داخل الرسالة نفسها. كل رسالة تحمل envelope، وهو غلاف صغير حول الـ payload. هذا الغلاف يحمل اسم النوع ورقم النسخة. بعض الفرق تضع فيه schema id بدلاً من ذلك، يشير إلى schema registry — وهي خدمة تخزّن الشكل المتفق عليه لكل نوع رسالة. يجب أن يُكتب الـ consumers ليتحمّلوا fields غير معروفة، لأن الـ producers سيضيفونها. القاعدة التي أفرضها بسيطة: الـ producer لا يغيّر معنى field قائم في مكانه أبداً. بل يضيف field جديداً. أو ينشر نوع رسالة جديداً ويرسل الاثنين فترة، حتى ينتقل كل consumer. الجزء الصعب المختلف عن HTTP أن الرسائل القديمة تبقى في الـ log إلى الأبد، فأي consumer يعيد قراءة التاريخ يجب أن يفهم كل نسخة نُشرت يوماً."
          }
        },
        { t: "qa", level: "staff",
          q: { en: "Two teams keep breaking each other's clients. What do you change organizationally?", ar: "فريقان يكسران باستمرار clients بعضهما. ما الذي تغيّره تنظيمياً؟" },
          a: {
            en: "I make breakage detectable before deploy instead of after, because right now the only detector is a customer. Four changes. One: a written compatibility policy — one page listing exactly what counts as breaking, so the argument is settled once instead of per pull request. Two: consumer-driven contract tests in CI, where each consumer publishes the fields it actually reads and the provider's build fails if it removes one. Three: a real registry of who calls what, built from production traffic rather than from memory, so nobody says \"I think nothing uses that\". Four: deprecation as a process with a named owner and a date, not goodwill. And I would make the number of live versions a tracked metric per team, because until keeping five versions alive costs somebody something visible, nobody retires anything.",
            ar: "أجعل الكسر قابلاً للاكتشاف قبل النشر لا بعده، لأن الكاشف الوحيد حالياً هو العميل. أربعة تغييرات. الأول: سياسة توافق مكتوبة — صفحة واحدة تحدّد بالضبط ما يُعدّ breaking، فيُحسم النقاش مرة واحدة بدل أن يتكرر مع كل pull request. الثاني: consumer-driven contract tests في الـ CI، حيث ينشر كل consumer الـ fields التي يقرأها فعلاً ويفشل بناء الـ provider إذا حذف واحداً منها. الثالث: سجلّ حقيقي لمن يستدعي ماذا، مبني على حركة الإنتاج لا على الذاكرة، حتى لا يقول أحد «أظن لا شيء يستخدم هذا». الرابع: الـ deprecation كعملية لها مالك محدّد وتاريخ محدّد، لا كحسن نية. وسأجعل عدد النسخ الحيّة مقياساً متابَعاً لكل فريق، لأنه ما لم يكلّف إبقاء خمس نسخ أحداً شيئاً مرئياً، لن يتقاعد أي شيء."
          }
        }
      ]
    },
    {
      key: "codereview",
      blocks: [
        { t: "review", severity: "high",
          title: { en: "Changing a field's type in place", ar: "تغيير نوع الـ field في مكانه" },
          bad: "public class OrderResponse\n{\n    public int Id { get; set; }\n\n    // was: public decimal Total { get; set; }\n    public string Total { get; set; }   // now formatted as \"249.50 EUR\"\n}",
          good: "public class OrderResponse\n{\n    public int Id { get; set; }\n\n    public decimal Total { get; set; }          // unchanged: still a number\n    public string TotalFormatted { get; set; }  // new and optional: old clients ignore it\n}",
          why: {
            en: "A client that deserializes Total into a decimal property now fails on every single order, or silently gets zero, depending on its parser settings. There is no partial damage here — the field is on the main response of the main endpoint, so this is a total outage for older callers. Adding a second field costs about twenty bytes per response and breaks nobody. Remove Total in a later version, once you have measured that nothing reads it.",
            ar: "الـ client الذي يحوّل Total إلى خاصية decimal صار يفشل مع كل طلب، أو يحصل على صفر بصمت، حسب إعدادات الـ parser لديه. لا يوجد ضرر جزئي هنا — الـ field في الـ response الرئيسي للـ endpoint الرئيسي، فهذا عطل كامل للـ callers القدامى. إضافة field ثانٍ تكلّف نحو عشرين بايت في الـ response ولا تكسر أحداً. احذف Total في نسخة لاحقة بعد أن تقيس أن لا شيء يقرأه."
          }
        },
        { t: "review", severity: "medium",
          title: { en: "Version checks leaking into the service layer", ar: "تسرّب فحص النسخة إلى طبقة الـ service" },
          bad: "public async Task<object> GetOrder(int id, string apiVersion)\n{\n    var order = await _repo.GetAsync(id);\n    if (order is null) return null;\n\n    if (apiVersion == \"1.0\")\n        return new { order.Id, customerName = order.Customer.Name, total = order.Total };\n\n    return new { order.Id,\n                 customer = new { order.Customer.Id, order.Customer.Name },\n                 totalAmount = order.Total };\n}",
          good: "// the service knows nothing about versions\npublic Task<Order?> GetOrder(int id) => _repo.GetAsync(id);\n\n// each versioned response type owns its own mapping\npublic sealed record OrderV1(int Id, string CustomerName, decimal Total)\n{\n    public static OrderV1 From(Order o) => new(o.Id, o.Customer.Name, o.Total);\n}\n\npublic sealed record OrderV2(int Id, CustomerV2 Customer, decimal TotalAmount)\n{\n    public static OrderV2 From(Order o) =>\n        new(o.Id, new CustomerV2(o.Customer.Id, o.Customer.Name), o.Total);\n}",
          why: {
            en: "Version if-statements spread. Once one service method branches on the version string, the next one does too, and a third version adds a branch to all of them. Two things then get hard: retiring v1 means hunting those branches across the whole codebase, and the return type object means the compiler cannot tell you what either version actually returns. Keeping version knowledge at the edge — in the controller and the response records — makes retiring v1 a matter of deleting one record and one action method.",
            ar: "شروط النسخة تنتشر. بمجرد أن تتفرّع service method واحدة على نص النسخة، تتفرّع التالية أيضاً، ثم تضيف نسخة ثالثة فرعاً إلى كلها. عندها يصعب أمران: التخلّص من v1 يعني ملاحقة تلك الفروع في الكود كله، ونوع الإرجاع object يعني أن الـ compiler لا يستطيع إخبارك بما تُرجعه كل نسخة فعلاً. إبقاء معرفة النسخة عند الحافة — في الـ controller وفي records الـ response — يجعل إزالة v1 مجرد حذف record واحد و action method واحدة."
          }
        }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        { t: "p",
          en: "In a real system the version is two decisions in two places. At the edge it is a routing decision. An API gateway is the single entry point sitting in front of your services. It reads /v1 or /v2 from the path and can send each to an entirely different deployment. That is how you run a risky v2 rewrite next to a stable v1 without one destabilising the other. It is also how you roll v2 out to 5% of traffic first. Inside the service it is a mapping decision: the same domain object, two response shapes.",
          ar: "في نظام حقيقي، النسخة قراران في موضعين. عند الحافة هي قرار routing. الـ API gateway هو نقطة الدخول الواحدة أمام خدماتك. يقرأ /v1 أو /v2 من المسار ويستطيع توجيه كل منهما إلى deployment مختلف تماماً. هكذا تشغّل إعادة كتابة v2 المحفوفة بالمخاطر بجوار v1 المستقرة دون أن تزعزع إحداهما الأخرى. وهكذا أيضاً تطرح v2 على 5% من الحركة أولاً. وداخل الـ service هي قرار mapping: نفس الـ domain object بشكلَي response."
        },
        { t: "p",
          en: "The retirement date is never an engineering preference. It is set by the slowest client you have, and the slowest client is almost always a mobile app or a partner integration that was written once and never touched again.",
          ar: "تاريخ التقاعد ليس تفضيلاً هندسياً أبداً. يحدّده أبطأ client لديك، وأبطأ client هو غالباً تطبيق موبايل أو تكامل شريك كُتب مرة واحدة ولم يُمسّ بعدها."
        },
        { t: "ul",
          en: [
            "Public and partner APIs: versions are contractual. Retirement needs written notice, often six to twelve months ahead.",
            "Mobile backends: the version is effectively the app build. Pick the retirement date from install statistics, not from a sprint plan.",
            "Internal service-to-service: teams often skip versions entirely and rely on consumer-driven contract tests plus coordinated deploys, because both sides can ship on the same day.",
            "Event streams: the version lives in the message envelope, and old events stay in the log forever, so consumers must handle every version ever published.",
            "Gateways and CDNs: the version is part of the cache key, so launching v2 starts from a completely cold cache."
          ],
          ar: [
            "الـ APIs العامة والشركاء: النسخ تعاقدية. الإزالة تحتاج إشعاراً مكتوباً، غالباً قبل ستة إلى اثني عشر شهراً.",
            "خلفيات تطبيقات الموبايل: النسخة هي عملياً نسخة التطبيق. اختر تاريخ الإزالة من إحصاءات التثبيت لا من خطة الـ sprint.",
            "بين الخدمات الداخلية: كثير من الفرق تتجاوز الـ versions تماماً وتعتمد على consumer-driven contract tests مع نشر منسّق، لأن الطرفين يستطيعان النشر في اليوم نفسه.",
            "تدفّقات الأحداث: النسخة داخل الـ envelope، والأحداث القديمة تبقى في الـ log إلى الأبد، فيجب أن يتعامل الـ consumers مع كل نسخة نُشرت.",
            "الـ gateways والـ CDNs: النسخة جزء من مفتاح الـ cache، فإطلاق v2 يبدأ من cache بارد تماماً."
          ]
        },
        { t: "callout", kind: "tip",
          en: "Put the resolved version into your log context and into your request metrics from day one. \"How much traffic is still on v1, and whose is it\" is the single number that decides every retirement conversation, and you cannot obtain it retroactively.",
          ar: "ضع النسخة المُختارة في سياق الـ logs وفي مقاييس الطلبات من اليوم الأول. «كم من الحركة ما زال على v1 ولمن هي» هو الرقم الوحيد الذي يحسم كل نقاش إزالة، ولا يمكن الحصول عليه بأثر رجعي."
        }
      ]
    },
    {
      key: "perf",
      blocks: [
        { t: "kv", rows: [
          { k: { en: "CPU", ar: "CPU" },
            v: { en: "Selecting the version is part of route matching — a dictionary lookup, well under a microsecond. It never appears in a profile. The real cost is mapping the domain object to a version-specific response, which is the same cost you already pay for any DTO.", ar: "اختيار النسخة جزء من مطابقة المسار — بحث في dictionary أقل بكثير من ميكروثانية. لا يظهر في أي profile. التكلفة الحقيقية هي تحويل الـ domain object إلى response خاص بالنسخة، وهي نفس تكلفة أي DTO تدفعها أصلاً." } },
          { k: { en: "Memory", ar: "Memory" },
            v: { en: "Each live version keeps its own response classes and its own cached JSON serializer metadata. Five versions of forty endpoints is a few hundred extra types — tens of megabytes, not a problem, but not free either.", ar: "كل نسخة حيّة تحتفظ بـ classes الـ response الخاصة بها وبـ metadata الـ JSON serializer المخزّنة لها. خمس نسخ لأربعين endpoint تعني بضع مئات من الأنواع الإضافية — عشرات الميغابايت، ليست مشكلة لكنها ليست مجانية." } },
          { k: { en: "Network", ar: "Network" },
            v: { en: "With URL versioning, /v1/orders/1017 and /v2/orders/1017 are separate cache keys in the CDN and in every HTTP cache. A v2 launch therefore starts cold and can briefly double the traffic reaching your origin servers.", ar: "مع URL versioning يكون /v1/orders/1017 و /v2/orders/1017 مفتاحَي cache منفصلين في الـ CDN وفي كل HTTP cache. لذلك يبدأ إطلاق v2 بارداً وقد يضاعف مؤقتاً الحركة الواصلة إلى خوادم الأصل." } },
          { k: { en: "Database", ar: "Database" },
            v: { en: "Both versions read the same tables, so a version bump adds no database load by itself. It adds risk instead: two mappings can quietly disagree about which rows they filter, and the difference shows up as wrong data, not as slowness.", ar: "كلتا النسختين تقرأان نفس الجداول، فرفع النسخة لا يضيف حملاً على قاعدة البيانات بحد ذاته. لكنه يضيف مخاطرة: قد يختلف الـ mapping-ان بصمت في الصفوف التي يرشّحانها، ويظهر الفرق كبيانات خاطئة لا كبطء." } },
          { k: { en: "Scalability", ar: "Scalability" },
            v: { en: "Versions are the cheapest boundary to scale independently. Routing /v2 to its own deployment gives the rewrite its own instance count, its own limits, and its own failure domain — if v2 falls over, v1 traffic is untouched.", ar: "الـ versions أرخص حدّ يمكن توسيعه باستقلال. توجيه /v2 إلى deployment خاص يمنح الإعادة عدد instances خاصاً وحدوداً خاصة ونطاق فشل خاصاً — إذا سقطت v2 تبقى حركة v1 سليمة." } }
        ]}
      ]
    },
    {
      key: "debug",
      blocks: [
        { t: "ul",
          en: [
            "curl -i https://api.example.com/v1/orders/1017 — read the response headers, not just the body. api-supported-versions lists every version the server admits to; Sunset and Deprecation tell you whether this one is already scheduled to die.",
            "A request counter split by version and client, such as http_requests_total{api_version=\"1.0\", client_id=\"...\"} in Prometheus — you are looking for the version whose count has reached zero, or the client that keeps it above zero.",
            "Access logs filtered to one version: grep '/v1/' access.log | awk '{print $12}' | sort | uniq -c | sort -rn — the output is a ranked list of user agents, which is your list of who still needs to migrate.",
            "An OpenAPI diff between two releases: openapi-diff old.json new.json — it prints removed fields and newly required inputs, which is almost exactly the definition of a breaking change. Run it in CI, not by hand.",
            "A scheduled brownout: return 410 Gone for v1 for ten minutes at a known time and watch the error dashboard — you are looking for which clients start paging you, before you find out the permanent way."
          ],
          ar: [
            "curl -i https://api.example.com/v1/orders/1017 — اقرأ ترويسات الـ response لا الجسم فقط. الـ api-supported-versions تسرد كل نسخة يعترف بها الـ server؛ و Sunset و Deprecation تخبرانك إن كانت هذه النسخة مجدولة للإغلاق.",
            "عدّاد طلبات مقسّم حسب النسخة والـ client، مثل http_requests_total{api_version=\"1.0\", client_id=\"...\"} في Prometheus — تبحث عن النسخة التي وصل عدّادها إلى صفر، أو عن الـ client الذي يُبقيه فوق الصفر.",
            "سجلات الوصول مرشّحة على نسخة واحدة: grep '/v1/' access.log | awk '{print $12}' | sort | uniq -c | sort -rn — الناتج قائمة مرتّبة بالـ user agents، وهي قائمة من ما زال عليه الانتقال.",
            "مقارنة مستندَي OpenAPI بين إصدارين: openapi-diff old.json new.json — تطبع الـ fields المحذوفة والـ inputs التي صارت إجبارية، وهذا تقريباً تعريف الـ breaking change. شغّلها في الـ CI لا يدوياً.",
            "brownout مجدول: أرجِع 410 Gone لـ v1 عشر دقائق في وقت معروف وراقب لوحة الأخطاء — تبحث عن الـ clients الذين يبدأون بالاتصال بك، قبل أن تعرفهم بالطريقة الدائمة."
          ]
        },
        { t: "callout", kind: "tip",
          en: "When a client reports \"the amount is empty since your deploy\", ask for the raw response body, not a screenshot. A silent null from a renamed field and a genuinely empty value look identical in every UI, and only the body tells you which one you are dealing with.",
          ar: "عندما يبلّغ client أن «المبلغ فارغ منذ نشرتكم»، اطلب جسم الـ response الخام لا لقطة شاشة. الـ null الصامت الناتج عن إعادة تسمية field والقيمة الفارغة الحقيقية يبدوان متطابقين في أي واجهة، وجسم الـ response وحده يخبرك أيهما لديك."
        }
      ]
    },
    {
      key: "realworld",
      blocks: [
        { t: "p",
          en: "Versioning matters exactly where the caller and the callee are deployed by different people on different schedules. The more independent those two release cycles are, the more formal the versioning has to be — and the longer old versions live.",
          ar: "الـ versioning يهمّ بالضبط حيث يَنشر الـ caller والـ callee أشخاص مختلفون بجداول مختلفة. وكلما زاد استقلال دورتَي الإصدار، صار الـ versioning أكثر رسمية — وعاشت النسخ القديمة أطول."
        },
        { t: "ul",
          en: [
            "Payment and banking platforms: a partner integrates once and rarely touches the code again, so old versions stay live for years and retirement becomes a legal notice rather than a ticket.",
            "Mobile-first consumer products: the backend is versioned by app build, and the retirement date is chosen from install statistics — you cannot remove a version faster than users update.",
            "Marketplace and platform APIs with third-party developers: usually date-based versions, with each developer account pinned to the version it signed up on and upgrading only when it opts in.",
            "Internal microservice fleets: often no versions at all, replaced by contract tests in CI and deploying both sides together — versioning appears only at the boundary that faces outside."
          ],
          ar: [
            "منصات الدفع والبنوك: الشريك يتكامل مرة واحدة ونادراً ما يعود إلى الكود، فتبقى النسخ القديمة حيّة سنوات وتصير الإزالة إشعاراً قانونياً لا تذكرة عمل.",
            "المنتجات الاستهلاكية القائمة على الموبايل: الـ backend مُنسّخ حسب نسخة التطبيق، ويُختار تاريخ الإزالة من إحصاءات التثبيت — لا تستطيع حذف نسخة أسرع من تحديث المستخدمين.",
            "منصات الأسواق والـ APIs المفتوحة لمطوّرين خارجيين: عادةً نسخ بالتاريخ، ويُثبَّت كل حساب مطوّر على النسخة التي سجّل عليها ولا يترقّى إلا باختياره.",
            "أساطيل الـ microservices الداخلية: غالباً بلا versions إطلاقاً، وتُستبدل بـ contract tests في الـ CI ونشر الطرفين معاً — ولا يظهر الـ versioning إلا عند الحد المواجه للخارج."
          ]
        }
      ]
    },
    {
      key: "exercises",
      blocks: [
        { t: "ex", diff: "easy",
          en: "Take any endpoint you own and add one optional field to its response. Then call it with a deserializer class that does not know the new field. You are done when the old caller produces exactly the same result as before, which proves for yourself that additive changes are safe.",
          ar: "خذ أي endpoint تملكه وأضف field اختيارياً واحداً إلى الـ response. ثم استدعِه بـ class deserializer لا يعرف الـ field الجديد. تكون قد انتهيت عندما ينتج الـ caller القديم نفس النتيجة تماماً، وهذا يثبت لك بنفسك أن التغييرات الإضافية آمنة."
        },
        { t: "ex", diff: "medium",
          en: "Add Asp.Versioning.Mvc to an ASP.NET Core API, put v{version:apiVersion} in the route template, and serve the same endpoint at 1.0 and 2.0 with different response shapes. You are done when curl /v1/orders/1 and curl /v2/orders/1 return different JSON, and both responses carry api-supported-versions: 1.0, 2.0.",
          ar: "أضف Asp.Versioning.Mvc إلى API في ASP.NET Core، وضع v{version:apiVersion} في قالب المسار، وقدّم نفس الـ endpoint على 1.0 و 2.0 بشكلَي response مختلفين. تكون قد انتهيت عندما يُرجع curl /v1/orders/1 و curl /v2/orders/1 نتيجتَي JSON مختلفتين، ويحمل الاثنان api-supported-versions: 1.0, 2.0."
        },
        { t: "ex", diff: "hard",
          en: "Implement expand/contract for a renamed field: return both total and totalAmount, mark the old one deprecated in your OpenAPI document, and emit a Sunset header with a real date. Then write a CI check that fails the build when a field disappears from the OpenAPI document before its Sunset date has passed. You are done when a pull request deleting total is blocked by the build with a message naming the field.",
          ar: "نفّذ expand/contract لإعادة تسمية field: أرجِع total و totalAmount معاً، وضع القديم كـ deprecated في مستند الـ OpenAPI، وأصدر Sunset header بتاريخ حقيقي. ثم اكتب فحص CI يُفشل البناء عندما يختفي field من مستند الـ OpenAPI قبل مرور تاريخ الـ Sunset الخاص به. تكون قد انتهيت عندما يوقف البناءُ pull request يحذف total برسالة تذكر اسم الـ field."
        },
        { t: "ex", diff: "senior",
          en: "For a system with two live versions, write the full retirement plan: the traffic query that produces per-version, per-client volume; the notice you would send and to whom; the brownout schedule; and the condition that triggers a rollback. Then run the brownout in staging with one client pinned to v1. You are done when you can state, with numbers, how much traffic would break and which clients own it.",
          ar: "لنظام فيه نسختان حيّتان، اكتب خطة التقاعد الكاملة: استعلام الحركة الذي ينتج الحجم حسب النسخة وحسب الـ client؛ والإشعار الذي سترسله ولمن؛ وجدول الـ brownout؛ والشرط الذي يُطلق التراجع. ثم نفّذ الـ brownout في بيئة staging مع client واحد مثبّت على v1. تكون قد انتهيت عندما تستطيع أن تقول بالأرقام كم من الحركة سينكسر ولأي clients يعود."
        }
      ]
    },
    {
      key: "refs",
      blocks: [
        { t: "ref",
          label: { en: "ASP.NET Core API Versioning (Asp.Versioning)", ar: "ASP.NET Core API Versioning (حزمة Asp.Versioning)" },
          url: "https://github.com/dotnet/aspnet-api-versioning",
          meta: { en: "Docs", ar: "توثيق" }
        },
        { t: "ref",
          label: { en: "Microsoft REST API Guidelines — versioning and breaking changes", ar: "إرشادات Microsoft لـ REST API — الإصدارات والتغييرات الكاسرة" },
          url: "https://github.com/microsoft/api-guidelines",
          meta: { en: "Guide", ar: "دليل" }
        },
        { t: "ref",
          label: { en: "Stripe: how we version our API without breaking users", ar: "Stripe: كيف نُصدر نسخ الـ API دون كسر المستخدمين" },
          url: "https://stripe.com/blog/api-versioning",
          meta: { en: "Article", ar: "مقال" }
        },
        { t: "ref",
          label: { en: "RFC 8594 — the Sunset HTTP header field", ar: "RFC 8594 — ترويسة Sunset في HTTP" },
          url: "https://www.rfc-editor.org/rfc/rfc8594.html",
          meta: { en: "Spec", ar: "مواصفة" }
        }
      ]
    }
  ],
  quiz: [
    {
      q: { en: "Which of these can you deploy without a new version?", ar: "أي من هذه تستطيع نشره دون نسخة جديدة؟" },
      options: [
        { en: "Renaming total to totalAmount in the response.", ar: "إعادة تسمية total إلى totalAmount في الـ response." },
        { en: "Adding an optional deliveryEta field to the response.", ar: "إضافة field اختياري deliveryEta إلى الـ response." },
        { en: "Making the optional currency input required.", ar: "جعل الـ input الاختياري currency إجبارياً." },
        { en: "Changing total from a number to a string.", ar: "تغيير total من رقم إلى نص." }
      ],
      correct: 1,
      why: {
        en: "Clients ignore fields they do not recognise, so a new optional response field breaks nobody. The other three all invalidate code that worked yesterday: two change what a field is called or contains, and one starts rejecting requests that used to succeed.",
        ar: "الـ clients تتجاهل الـ fields التي لا تعرفها، فإضافة field اختياري في الـ response لا تكسر أحداً. أما الثلاثة الأخرى فتُبطل كوداً كان يعمل بالأمس: اثنان يغيّران اسم الـ field أو محتواه، وواحد يبدأ برفض طلبات كانت تنجح."
      }
    },
    {
      q: { en: "What does AssumeDefaultVersionWhenUnspecified = true do?", ar: "ماذا يفعل AssumeDefaultVersionWhenUnspecified = true؟" },
      options: [
        { en: "Rejects any request that does not carry a version.", ar: "يرفض أي request لا يحمل نسخة." },
        { en: "Routes version-less requests to the newest version available.", ar: "يوجّه الطلبات بلا نسخة إلى أحدث نسخة متاحة." },
        { en: "Routes version-less requests to the DefaultApiVersion you configured.", ar: "يوجّه الطلبات بلا نسخة إلى الـ DefaultApiVersion الذي ضبطته." },
        { en: "Adds the api-supported-versions header to every response.", ar: "يضيف ترويسة api-supported-versions إلى كل response." }
      ],
      correct: 2,
      why: {
        en: "It falls back to the DefaultApiVersion you set — usually the oldest version you still support — so callers who have never sent a version keep working. Routing to the newest version would break them on every release. Reporting supported versions is a separate setting called ReportApiVersions.",
        ar: "يرجع إلى الـ DefaultApiVersion الذي حدّدته — عادةً أقدم نسخة ما زلت تدعمها — فيستمر عمل الـ callers الذين لم يرسلوا نسخة قط. التوجيه إلى الأحدث كان سيكسرهم مع كل إصدار. أما الإبلاغ عن النسخ المدعومة فإعداد منفصل اسمه ReportApiVersions."
      }
    },
    {
      q: { en: "A team renamed a response field and deployed. Support tickets arrived, but the error logs stayed empty. Why?", ar: "فريق أعاد تسمية field في الـ response ونشر. وصلت تذاكر دعم لكن سجلات الأخطاء بقيت فارغة. لماذا؟" },
      options: [
        { en: "The logger was misconfigured for that endpoint.", ar: "كان الـ logger مضبوطاً بشكل خاطئ لذلك الـ endpoint." },
        { en: "Most JSON deserializers ignore unknown fields and leave missing ones at their default value.", ar: "معظم الـ JSON deserializers تتجاهل الـ fields غير المعروفة وتترك المفقودة على قيمتها الافتراضية." },
        { en: "The load balancer absorbed the 500 responses before they were logged.", ar: "امتصّ الـ load balancer استجابات 500 قبل تسجيلها." },
        { en: "The clients were serving the old response from their cache.", ar: "كان الـ clients يقدّمون الـ response القديم من الـ cache لديهم." }
      ],
      correct: 1,
      why: {
        en: "A typical JSON deserializer does not fail on a missing field; it leaves the property at 0, null or empty. The screen shows 0.00 and nothing throws anywhere. That is exactly why a rename is more dangerous than a change that crashes loudly — the damage is invisible to your monitoring.",
        ar: "الـ JSON deserializer المعتاد لا يفشل عند غياب field؛ بل يترك الخاصية على 0 أو null أو فارغة. تعرض الشاشة 0.00 ولا يُرمى شيء في أي مكان. لهذا السبب بالذات تكون إعادة التسمية أخطر من تغيير ينهار بصوت عالٍ — الضرر غير مرئي لمراقبتك."
      }
    },
    {
      q: { en: "What is the strongest argument against putting the version in the URL path?", ar: "ما أقوى حجة ضد وضع النسخة في مسار الـ URL؟" },
      options: [
        { en: "A gateway cannot route on it.", ar: "لا يستطيع الـ gateway التوجيه بناءً عليها." },
        { en: "It does not appear in server logs.", ar: "لا تظهر في سجلات الـ server." },
        { en: "The same resource ends up with several URLs, and it tempts teams to bump every endpoint at once.", ar: "ينتهي نفس الـ resource بعدة URLs، وتُغري الفرق برفع نسخة كل endpoint دفعة واحدة." },
        { en: "It requires the client to use a generated client library.", ar: "تتطلّب من الـ client استخدام client library مولَّدة." }
      ],
      correct: 2,
      why: {
        en: "Routing and log visibility are the strengths of URL versioning, not weaknesses, and no client library is needed. The real costs are different. One order now answers to two addresses. And because the version sits on the path prefix, teams tend to create v2 for all 47 endpoints when only one of them changed.",
        ar: "التوجيه والظهور في الـ logs هما نقطتا قوة في URL versioning لا ضعف، ولا حاجة إلى client library. التكلفة الحقيقية مختلفة. الطلب الواحد صار يستجيب لعنوانين. ولأن النسخة في بداية المسار، تميل الفرق إلى إنشاء v2 لكل الـ 47 endpoint بينما تغيّر واحد منها فقط."
      }
    },
    {
      q: { en: "Before removing v1, the most useful thing to have is:", ar: "قبل إزالة v1، أكثر شيء مفيد أن يكون لديك هو:" },
      options: [
        { en: "A blog post announcing the removal.", ar: "منشور مدوّنة يعلن الإزالة." },
        { en: "Per-version, per-client request counts taken from production traffic.", ar: "عدد الطلبات حسب النسخة وحسب الـ client مأخوذاً من حركة الإنتاج." },
        { en: "A complete unit test suite for v2.", ar: "مجموعة اختبارات وحدة كاملة لـ v2." },
        { en: "A feature flag that switches v1 off instantly.", ar: "feature flag يُطفئ v1 فوراً." }
      ],
      correct: 1,
      why: {
        en: "Retirement is a question about who is still calling you, and only production traffic answers it. The announcement matters, but without per-client counts you do not know who to address it to or whether the deadline is realistic. The flag and the tests are useful mechanics; they tell you nothing about impact.",
        ar: "التقاعد سؤال عن من ما زال يستدعيك، وحركة الإنتاج وحدها تجيب عليه. الإعلان مهم، لكن دون أعداد لكل client لا تعرف لمن توجّهه ولا هل الموعد واقعي. أما الـ flag والاختبارات فأدوات مفيدة، لكنها لا تخبرك شيئاً عن الأثر."
      }
    }
  ]
};

NEXT: api-errors
