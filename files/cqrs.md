```js
const cqrsLesson = {
  id: "cqrs",
  moduleId: "architecture",
  title: { en: "CQRS and when it is overkill", ar: "CQRS ومتى يكون مبالغة" },
  summary: {
    en: "Split the code that changes data from the code that reads it — and know when that split just adds work.",
    ar: "افصل الكود الذي يغيّر البيانات عن الكود الذي يقرأها — واعرف متى يكون هذا الفصل مجرد عمل إضافي."
  },
  mins: 16,
  sections: [
    { key: "why", blocks: [
      { t: "p",
        en: "CQRS means splitting one thing into two: the code that changes data and the code that reads data. CQRS is short for Command Query Responsibility Segregation. A command changes state (place an order). A query returns data and changes nothing (show my orders). Normally one model does both. CQRS says: use one model for writes and a separate model for reads.",
        ar: "CQRS يعني تقسيم شيء واحد إلى اثنين: الكود الذي يغيّر البيانات والكود الذي يقرأ البيانات. CQRS اختصار لـ Command Query Responsibility Segregation. الـ command يغيّر الحالة (تنفيذ طلب شراء). الـ query يعيد بيانات ولا يغيّر شيئاً (عرض طلباتي). عادةً model واحد يفعل الاثنين. CQRS يقول: استخدم model للكتابة و model منفصل للقراءة." },
      { t: "kv", rows: [
        { k: { en: "Command", ar: "Command" }, v: { en: "An operation that changes data. Returns nothing meaningful, or just an id.", ar: "عملية تغيّر البيانات. لا تعيد شيئاً ذا معنى، أو تعيد id فقط." } },
        { k: { en: "Query", ar: "Query" }, v: { en: "An operation that reads data and changes nothing. Safe to call many times.", ar: "عملية تقرأ البيانات ولا تغيّر شيئاً. آمنة للاستدعاء مرات كثيرة." } },
        { k: { en: "Write model", ar: "Write model" }, v: { en: "The classes that enforce rules when data changes — your domain entities.", ar: "الـ classes التي تفرض القواعد عند تغيّر البيانات — كيانات الـ domain لديك." } },
        { k: { en: "Read model", ar: "Read model" }, v: { en: "A shape built only for display — often a flat DTO matching one screen.", ar: "شكل مبني للعرض فقط — غالباً DTO مسطّح يطابق شاشة واحدة." } },
        { k: { en: "DTO", ar: "DTO" }, v: { en: "Data Transfer Object: a plain object with fields, no behavior, used to move data out.", ar: "Data Transfer Object: كائن بسيط بحقول وبلا سلوك، يُستخدم لإخراج البيانات." } },
        { k: { en: "Segregation", ar: "الفصل" }, v: { en: "Keeping the two paths apart so each can change without touching the other.", ar: "إبقاء المسارين منفصلين ليتغيّر كل منهما دون المساس بالآخر." } }
      ]},
      { t: "p",
        en: "The reason it exists: reads and writes want opposite things. A write needs strict rules — check the stock, check the balance, keep the data consistent. A read just needs to be fast and shaped for the screen. Forcing both through the same entity means every screen loads a full domain object it does not need, and every rule change risks breaking a display.",
        ar: "سبب وجوده: القراءة والكتابة تريدان أشياء متعاكسة. الكتابة تحتاج قواعد صارمة — تحقق من المخزون، تحقق من الرصيد، حافظ على اتساق البيانات. القراءة تحتاج فقط أن تكون سريعة ومشكّلة للشاشة. إجبار الاثنين عبر نفس الكيان يعني أن كل شاشة تحمّل كائن domain كاملاً لا تحتاجه، وأن كل تغيير في قاعدة يخاطر بكسر عرض." },
      { t: "p",
        en: "Think of a restaurant. The kitchen (writes) follows strict recipes and food-safety rules. The menu (reads) is printed to be scanned in seconds. You would never hand a diner the kitchen's recipe binder to choose lunch. CQRS keeps the recipe binder and the menu as two separate things, each tuned for its job.",
        ar: "تخيّل مطعماً. المطبخ (الكتابة) يتبع وصفات صارمة وقواعد سلامة غذائية. القائمة (القراءة) مطبوعة لتُقرأ في ثوانٍ. لن تعطي زبوناً ملف وصفات المطبخ ليختار غداءه. CQRS يبقي ملف الوصفات والقائمة شيئين منفصلين، كلٌّ مضبوط لعمله." },
      { t: "callout", kind: "note",
        en: "CQRS is only separating reads from writes. It does not require two databases, message queues, or event sourcing. Those are optional additions people confuse with CQRS itself.",
        ar: "CQRS هو فقط فصل القراءة عن الكتابة. لا يتطلب قاعدتي بيانات ولا message queues ولا event sourcing. تلك إضافات اختيارية يخلط الناس بينها وبين CQRS نفسه." }
    ]},
    { key: "problem", blocks: [
      { t: "p",
        en: "Take a running example: an Order screen in an online store. Before CQRS, one Order entity serves everything. It has the customer, the line items, the payment, the shipping address, and methods like Cancel() and AddItem() that enforce rules. The order-history page needs only three fields per order: id, date, total. But it loads the whole entity.",
        ar: "لنأخذ مثالاً جارياً: شاشة Order في متجر إلكتروني. قبل CQRS، كيان Order واحد يخدم كل شيء. فيه العميل، بنود الطلب، الدفع، عنوان الشحن، ودوال مثل Cancel() و AddItem() تفرض القواعد. صفحة سجل الطلبات تحتاج ثلاثة حقول فقط لكل طلب: id، التاريخ، الإجمالي. لكنها تحمّل الكيان كامله." },
      { t: "p",
        en: "The cost is concrete. Loading full orders for a customer with 200 orders pulls 200 orders plus every line item — say 2,000 rows and 40 columns each. The page shows 600 values. So it fetches roughly 80,000 values to display 600 — over 100 times more data than the screen uses. On top of that, every field the display reads is a field the write rules must keep valid.",
        ar: "التكلفة ملموسة. تحميل الطلبات الكاملة لعميل لديه 200 طلب يسحب 200 طلب مع كل بنودها — لنقل 2,000 صف و40 عموداً لكل صف. الصفحة تعرض 600 قيمة. أي أنها تجلب نحو 80,000 قيمة لتعرض 600 — أكثر من مئة ضعف ما تستخدمه الشاشة. إضافةً لذلك، كل حقل يقرأه العرض هو حقل يجب أن تبقيه قواعد الكتابة صالحاً." },
      { t: "kv", rows: [
        { k: { en: "One shared model", ar: "model مشترك واحد" }, v: { en: "Reads drag in write-side rules; writes must keep display fields valid. Every change is risky.", ar: "القراءة تجرّ قواعد جانب الكتابة؛ والكتابة يجب أن تبقي حقول العرض صالحة. كل تغيير محفوف بالخطر." } },
        { k: { en: "Split read/write", ar: "فصل القراءة/الكتابة" }, v: { en: "The history page runs a flat query returning 3 fields. The write model keeps its rules to itself.", ar: "صفحة السجل تشغّل query مسطّحاً يعيد 3 حقول. ونموذج الكتابة يحتفظ بقواعده لنفسه." } }
      ]},
      { t: "p",
        en: "After the split, the history page runs its own query — select id, date, total — and returns a small read model. The Order entity keeps Cancel() and AddItem() and never appears on the read path. Fewer values move, and the two concerns stop fighting over one class.",
        ar: "بعد الفصل، صفحة السجل تشغّل query خاصاً بها — select id, date, total — وتعيد read model صغيراً. كيان Order يحتفظ بـ Cancel() و AddItem() ولا يظهر أبداً في مسار القراءة. قيم أقل تتحرك، والاهتمامان يتوقفان عن التنازع على class واحد." }
    ]},
    { key: "internals", blocks: [
      { t: "p",
        en: "There are two levels of CQRS, and mixing them up causes most of the confusion. Level one is code-only: one database, but two code paths. Commands go through domain entities. Queries skip the entities and read straight into DTOs. Level two adds a second data store for reads, kept in sync from the writes. Start at level one; most systems never need level two.",
        ar: "هناك مستويان من CQRS، والخلط بينهما سبب معظم الالتباس. المستوى الأول كودي فقط: قاعدة بيانات واحدة لكن مساران في الكود. الـ commands تمرّ عبر كيانات الـ domain. والـ queries تتجاوز الكيانات وتقرأ مباشرةً إلى DTOs. المستوى الثاني يضيف مخزن بيانات ثانياً للقراءة، يُبقى متزامناً من الكتابة. ابدأ بالمستوى الأول؛ معظم الأنظمة لا تحتاج الثاني أبداً." },
      { t: "p",
        en: "Trace one request through level-one CQRS. A command arrives: PlaceOrder. A command handler loads the Customer entity, calls customer.PlaceOrder(items), which checks the credit limit and the stock, then saves through the ORM. An ORM (object-relational mapper, like EF Core) is the library that turns entities into SQL. Nothing is returned but the new order id.",
        ar: "تتبّع request واحداً عبر CQRS بالمستوى الأول. يصل command: PlaceOrder. الـ command handler يحمّل كيان Customer، ينادي customer.PlaceOrder(items)، الذي يتحقق من حد الائتمان والمخزون، ثم يحفظ عبر الـ ORM. الـ ORM (object-relational mapper، مثل EF Core) هو المكتبة التي تحوّل الكيانات إلى SQL. لا يُعاد شيء سوى id الطلب الجديد." },
      { t: "code", lang: "csharp",
        label: { en: "Command and query as two separate paths", ar: "الـ command والـ query كمسارين منفصلين" },
        code: "// WRITE path: goes through the domain entity and its rules\npublic async Task<int> Handle(PlaceOrder cmd)\n{\n    var customer = await _db.Customers\n        .Include(c => c.Orders)\n        .FirstAsync(c => c.Id == cmd.CustomerId);\n\n    var order = customer.PlaceOrder(cmd.Items); // rules live here\n    await _db.SaveChangesAsync();\n    return order.Id;                            // command returns only the id\n}\n\n// READ path: no entity, no rules, just the shape the screen needs\npublic async Task<List<OrderRow>> Handle(GetOrderHistory q)\n{\n    return await _db.Orders\n        .Where(o => o.CustomerId == q.CustomerId)\n        .Select(o => new OrderRow(o.Id, o.CreatedAt, o.Total)) // 3 fields\n        .AsNoTracking()   // no change tracking: read-only, faster\n        .ToListAsync();\n}" },
      { t: "kv", rows: [
        { k: { en: "Command handler", ar: "Command handler" }, v: { en: "Loads an entity, runs a state-changing method, saves. Returns an id or nothing.", ar: "يحمّل كياناً، ينفّذ دالة تغيّر الحالة، يحفظ. يعيد id أو لا شيء." } },
        { k: { en: "Query handler", ar: "Query handler" }, v: { en: "Projects rows straight into a DTO with Select. Never touches an entity.", ar: "يُسقط الصفوف مباشرةً إلى DTO عبر Select. لا يلمس كياناً أبداً." } },
        { k: { en: "Projection", ar: "Projection" }, v: { en: "Select in the query that picks only the columns the DTO needs — the SQL fetches only those.", ar: "الـ Select في الاستعلام الذي يختار الأعمدة التي يحتاجها الـ DTO فقط — والـ SQL يجلب تلك فقط." } },
        { k: { en: "Dispatcher", ar: "Dispatcher" }, v: { en: "Optional router (e.g. MediatR) that sends each command/query to its one handler.", ar: "موجّه اختياري (مثل MediatR) يرسل كل command/query إلى الـ handler الوحيد الخاص به." } }
      ]},
      { t: "p",
        en: "Level two, when you truly need it: writes still go to the main database, but a second read store — a denormalized table, a search index, or a cache — holds data pre-shaped for queries. The write path publishes a change; a small process updates the read store. This is where the everyday analogy returns: the kitchen cooks (writes) and a runner keeps the printed menu board (read store) updated, slightly behind but always readable.",
        ar: "المستوى الثاني، حين تحتاجه فعلاً: الكتابة ما زالت تذهب إلى القاعدة الرئيسية، لكن مخزن قراءة ثانياً — جدول denormalized أو search index أو cache — يحمل بيانات مُشكّلة مسبقاً للاستعلامات. مسار الكتابة ينشر تغييراً؛ وعملية صغيرة تحدّث مخزن القراءة. هنا تعود المشابهة اليومية: المطبخ يطبخ (الكتابة) وعامل يبقي لوح القائمة المطبوع (مخزن القراءة) محدّثاً، متأخراً قليلاً لكنه دائماً قابل للقراءة." },
      { t: "callout", kind: "warn",
        en: "A second read store is eventually consistent — meaning it lags the write store by a short, variable delay. A user can save data and not see it in a list one second later. If your screen cannot tolerate that lag, do not add a second store.",
        ar: "مخزن القراءة الثاني eventually consistent — أي يتأخر عن مخزن الكتابة بمقدار قصير ومتغيّر. قد يحفظ المستخدم بيانات ولا يراها في قائمة بعد ثانية. إذا كانت شاشتك لا تحتمل هذا التأخر، فلا تضف مخزناً ثانياً." }
    ]},
    { key: "tradeoffs", blocks: [
      { t: "tradeoff",
        pros: {
          en: [
            "Read queries return only the fields a screen needs, so they are smaller and faster.",
            "Write rules live in one place and stop leaking into display code.",
            "Read and write can scale and change independently.",
            "Each handler is small and does one thing, so it is easy to test."
          ],
          ar: [
            "استعلامات القراءة تعيد الحقول التي تحتاجها الشاشة فقط، فتكون أصغر وأسرع.",
            "قواعد الكتابة تعيش في مكان واحد وتتوقف عن التسرّب إلى كود العرض.",
            "القراءة والكتابة يمكن أن تتوسّعا وتتغيّرا بشكل مستقل.",
            "كل handler صغير ويفعل شيئاً واحداً، فيسهل اختباره."
          ]
        },
        cons: {
          en: [
            "More classes and files: a command, a query, and a handler for each use case.",
            "A read DTO and a write entity can drift apart and need separate maintenance.",
            "The two-path split confuses developers who expected one model.",
            "A second read store adds eventual consistency and a sync process to operate."
          ],
          ar: [
            "classes وملفات أكثر: command و query و handler لكل حالة استخدام.",
            "الـ read DTO وكيان الكتابة قد يتباعدان ويحتاجان صيانة منفصلة.",
            "الفصل بمسارين يربك المطورين الذين توقّعوا model واحداً.",
            "مخزن القراءة الثاني يضيف eventual consistency وعملية مزامنة يجب تشغيلها."
          ]
        },
        limits: {
          en: [
            "It does not make anything faster on its own — a bad query is still slow.",
            "It does not require or imply event sourcing or two databases.",
            "For a simple CRUD app the extra structure buys little.",
            "It does not remove the need for transactions on the write side."
          ],
          ar: [
            "لا يجعل أي شيء أسرع بذاته — الاستعلام السيئ يبقى بطيئاً.",
            "لا يتطلب ولا يعني event sourcing أو قاعدتي بيانات.",
            "لتطبيق CRUD بسيط، البنية الإضافية تجلب فائدة قليلة.",
            "لا يزيل الحاجة إلى transactions في جانب الكتابة."
          ]
        },
        alts: {
          en: [
            "A single model with plain Select projections for reads — most of the benefit, less structure.",
            "A repository per aggregate that exposes both reads and writes.",
            "A read-only replica database queried directly, no code split.",
            "Materialized views in the database for the heaviest read shapes."
          ],
          ar: [
            "model واحد مع Select projections بسيطة للقراءة — معظم الفائدة ببنية أقل.",
            "repository لكل aggregate يكشف القراءة والكتابة معاً.",
            "قاعدة replica للقراءة فقط يُستعلم منها مباشرةً، دون فصل في الكود.",
            "materialized views في القاعدة لأثقل أشكال القراءة."
          ]
        }
      }
    ]},
    { key: "mistakes", blocks: [
      { t: "mistake",
        title: { en: "Adding a second database on day one", ar: "إضافة قاعدة بيانات ثانية من اليوم الأول" },
        body: {
          en: "A team read that 'CQRS scales reads' and built a separate read database synced by messages, for an app with 3,000 users. Half the bugs became 'I saved it but the list is empty'. The lag between the two stores was the eventual consistency they never needed. One database with query projections would have shipped in a week and confused nobody.",
          ar: "قرأ فريق أن 'CQRS يوسّع القراءة' فبنى قاعدة قراءة منفصلة تُزامَن بالرسائل، لتطبيق فيه 3,000 مستخدم. صار نصف الأخطاء 'حفظتُ الأمر لكن القائمة فارغة'. التأخر بين المخزنين كان الـ eventual consistency الذي لم يحتاجوه قط. قاعدة واحدة مع query projections كانت ستُطلَق في أسبوع ولن تربك أحداً."
        }
      },
      { t: "mistake",
        title: { en: "Commands that return full read data", ar: "commands تعيد بيانات قراءة كاملة" },
        body: {
          en: "A CreateOrder command returned the full order with all line items, customer, and totals, because the UI wanted to show it. Now the command is coupled to a display shape, and any screen change forces a change to the write path. Return the id; let the screen issue a query for what it needs.",
          ar: "command باسم CreateOrder أعاد الطلب الكامل بكل بنوده والعميل والإجماليات، لأن الـ UI أراد عرضه. الآن الـ command مرتبط بشكل عرض، وأي تغيير في الشاشة يفرض تغييراً في مسار الكتابة. أعِد الـ id؛ ودع الشاشة تطلق query لما تحتاجه."
        },
        fix: "// command returns the id only\nreturn order.Id;\n// the screen then calls GetOrder(id) on the read path"
      },
      { t: "mistake",
        title: { en: "Queries that mutate data", ar: "استعلامات تغيّر البيانات" },
        body: {
          en: "A GetDashboard query also updated a last_viewed timestamp 'while it was there'. A retry of that read then wrote twice, and a read replica could not serve it at all. A query must change nothing. If a view needs a side effect, make it an explicit command.",
          ar: "استعلام GetDashboard حدّث أيضاً حقل last_viewed 'ما دام موجوداً'. عندها أعادت المحاولة لتلك القراءة الكتابة مرتين، ولم تستطع read replica خدمتها أصلاً. الـ query يجب ألا يغيّر شيئاً. إذا احتاج العرض أثراً جانبياً، فاجعله command صريحاً."
        }
      },
      { t: "mistake",
        title: { en: "Splitting every trivial CRUD entity", ar: "فصل كل كيان CRUD تافه" },
        body: {
          en: "A team applied CQRS to a settings table with five fields and no rules. They now maintain UpdateSetting command, GetSetting query, two handlers, and two DTOs — for a plain key/value edit. CQRS earns its cost where the read and write shapes truly differ. For flat CRUD, it is pure overhead.",
          ar: "طبّق فريق CQRS على جدول إعدادات فيه خمسة حقول وبلا قواعد. صاروا يصونون UpdateSetting command و GetSetting query و handlerين و DTOين — لتعديل key/value بسيط. CQRS يستحق تكلفته حيث يختلف شكلا القراءة والكتابة فعلاً. أما CRUD المسطّح فهو عبء صافٍ."
        }
      }
    ]},
    { key: "interview", blocks: [
      { t: "qa", level: "junior",
        q: { en: "What is the difference between a command and a query?", ar: "ما الفرق بين الـ command والـ query؟" },
        a: {
          en: "A command changes data and gives back nothing useful — maybe just an id. A query reads data and changes nothing, so you can call it as many times as you like with the same result. Place an order is a command; show my orders is a query.",
          ar: "الـ command يغيّر البيانات ولا يعيد شيئاً مفيداً — ربما id فقط. الـ query يقرأ البيانات ولا يغيّر شيئاً، فيمكنك استدعاؤه أي عدد من المرات بالنتيجة نفسها. تنفيذ طلب command؛ وعرض طلباتي query."
        }
      },
      { t: "qa", level: "mid",
        q: { en: "Does CQRS mean you need two databases?", ar: "هل CQRS يعني أنك تحتاج قاعدتي بيانات؟" },
        a: {
          en: "No. At its simplest, CQRS is just two code paths over one database: commands go through your domain entities, queries read straight into DTOs. A second read database is an optional step you take only when read load or read shapes justify it. Most systems stay on one database.",
          ar: "لا. في أبسط صوره، CQRS مجرد مسارين في الكود فوق قاعدة واحدة: الـ commands تمرّ عبر كيانات الـ domain، والـ queries تقرأ مباشرةً إلى DTOs. قاعدة القراءة الثانية خطوة اختيارية تأخذها فقط حين يبرّرها حمل القراءة أو أشكالها. معظم الأنظمة تبقى على قاعدة واحدة."
        }
      },
      { t: "qa", level: "mid",
        q: { en: "Why keep the read model separate from the write entity?", ar: "لماذا تبقي الـ read model منفصلاً عن كيان الكتابة؟" },
        a: {
          en: "Because they change for different reasons. The write entity changes when a business rule changes. The read model changes when a screen changes. If they share one class, a UI tweak can break a rule and a rule change can break a screen. Separating them means each side moves on its own.",
          ar: "لأنهما يتغيّران لأسباب مختلفة. كيان الكتابة يتغيّر حين تتغيّر قاعدة عمل. والـ read model يتغيّر حين تتغيّر شاشة. لو تشاركا class واحداً، فقد يكسر تعديل UI قاعدةً، وقد يكسر تغيير قاعدة شاشةً. فصلهما يعني أن كل جانب يتحرك بمفرده."
        }
      },
      { t: "qa", level: "senior",
        q: { en: "When would you reach for a separate read store, and what does it cost?", ar: "متى تلجأ إلى مخزن قراءة منفصل، وما تكلفته؟" },
        a: {
          en: "When reads vastly outnumber writes, or a screen needs a shape the write schema cannot serve cheaply — a full-text search, a heavy aggregate. The cost is eventual consistency: the read store lags the write store by a short delay, so a user may not see their change immediately. You pay with a sync process to build and monitor. I only take it when a real read problem is measured, not assumed.",
          ar: "حين تفوق القراءات الكتابات بكثير، أو تحتاج شاشة شكلاً لا يخدمه schema الكتابة بثمن رخيص — بحث نصي كامل، أو aggregate ثقيل. التكلفة هي eventual consistency: مخزن القراءة يتأخر عن مخزن الكتابة بمقدار قصير، فقد لا يرى المستخدم تغييره فوراً. وتدفع أيضاً بعملية مزامنة تبنيها وتراقبها. لا آخذها إلا حين تُقاس مشكلة قراءة حقيقية، لا تُفترض."
        }
      },
      { t: "qa", level: "senior",
        q: { en: "How is CQRS related to event sourcing?", ar: "كيف يرتبط CQRS بـ event sourcing؟" },
        a: {
          en: "They are separate ideas that pair well but do not require each other. Event sourcing stores state as a log of past events instead of current rows. CQRS just separates reads from writes. You can do CQRS with a normal table-based database and no events at all. People conflate them because event-sourced systems almost always use CQRS to build readable views, but the reverse is not true.",
          ar: "هما فكرتان منفصلتان تتناغمان لكن لا تشترط إحداهما الأخرى. event sourcing يخزّن الحالة كسجل أحداث ماضية بدل الصفوف الحالية. أما CQRS فيفصل القراءة عن الكتابة فقط. يمكنك تطبيق CQRS على قاعدة جداول عادية وبلا أحداث إطلاقاً. يخلط الناس بينهما لأن الأنظمة المبنية على الأحداث تستخدم CQRS دائماً تقريباً لبناء views قابلة للقراءة، لكن العكس غير صحيح."
        }
      },
      { t: "qa", level: "staff",
        q: { en: "A team wants CQRS everywhere. How do you steer that decision?", ar: "فريق يريد CQRS في كل مكان. كيف توجّه هذا القرار؟" },
        a: {
          en: "I would not ban it or mandate it; I would set a rule for where it applies. My guideline: use CQRS in a module only when its read and write shapes genuinely differ or its read load is high. For flat CRUD modules, keep one model. I would write this into the team's architecture guide with two or three worked examples, so the choice is per-module and evidence-based, not a blanket style everyone copies. That keeps the structure where it pays and out of where it only adds files.",
          ar: "لن أمنعه ولن أفرضه؛ سأضع قاعدة لموضع تطبيقه. دليلي: استخدم CQRS في module فقط حين يختلف شكلا قراءته وكتابته فعلاً أو حين يكون حمل قراءته عالياً. وللـ modules ذات CRUD المسطّح، أبقِ model واحداً. سأكتب هذا في دليل معمارية الفريق مع مثالين أو ثلاثة مشروحة، ليكون الاختيار لكل module ومبنياً على دليل، لا أسلوباً شاملاً ينسخه الجميع. هذا يبقي البنية حيث تنفع، وبعيداً عمّا يضيف ملفات فقط."
        }
      }
    ]},
    { key: "codereview", blocks: [
      { t: "review", severity: "high",
        title: { en: "A query loads a tracked entity and edits it", ar: "استعلام يحمّل كياناً متتبَّعاً ويعدّله" },
        bad: "public async Task<OrderDto> GetOrder(int id)\n{\n    var order = await _db.Orders.FirstAsync(o => o.Id == id);\n    order.LastViewed = DateTime.UtcNow; // write inside a read!\n    await _db.SaveChangesAsync();\n    return Map(order);\n}",
        good: "public async Task<OrderDto> GetOrder(int id)\n{\n    return await _db.Orders\n        .Where(o => o.Id == id)\n        .Select(o => new OrderDto(o.Id, o.CreatedAt, o.Total))\n        .AsNoTracking()\n        .FirstAsync(); // reads nothing more, writes nothing\n}",
        why: {
          en: "The bad version writes during a read, so a retried read writes twice and a read replica cannot serve it. It also loads and tracks a full entity to show three fields. The good version projects only what the DTO needs and marks the query read-only. If LastViewed must be recorded, that is a separate command.",
          ar: "النسخة السيئة تكتب أثناء القراءة، فتكتب مرتين عند إعادة المحاولة ولا تستطيع read replica خدمتها. كما تحمّل وتتتبّع كياناً كاملاً لعرض ثلاثة حقول. النسخة الجيدة تُسقط ما يحتاجه الـ DTO فقط وتعلّم الاستعلام للقراءة فقط. وإن وجب تسجيل LastViewed، فذلك command منفصل."
        }
      },
      { t: "review", severity: "medium",
        title: { en: "A command handler returns a display object", ar: "command handler يعيد كائن عرض" },
        bad: "public async Task<OrderDto> Handle(PlaceOrder cmd)\n{\n    var order = customer.PlaceOrder(cmd.Items);\n    await _db.SaveChangesAsync();\n    return Map(order); // command now owns a display shape\n}",
        good: "public async Task<int> Handle(PlaceOrder cmd)\n{\n    var order = customer.PlaceOrder(cmd.Items);\n    await _db.SaveChangesAsync();\n    return order.Id; // caller queries the read path for details\n}",
        why: {
          en: "Returning a DTO ties the write path to a screen's shape, so a UI change edits the command. Returning the id keeps the two paths independent: the caller runs a query when it wants details. This is a smell, not a crash, so it is medium severity — but it compounds as screens multiply.",
          ar: "إعادة DTO تربط مسار الكتابة بشكل شاشة، فيصير تغيير الـ UI يعدّل الـ command. إعادة الـ id تبقي المسارين مستقلين: المستدعي يشغّل query حين يريد التفاصيل. هذه رائحة كود لا انهيار، لذا خطورتها متوسطة — لكنها تتراكم مع تكاثر الشاشات."
        }
      }
    ]},
    { key: "sysdesign", blocks: [
      { t: "p",
        en: "CQRS shows up clearly in a system where one side is read-heavy. Take an e-commerce product catalog. Writes are rare — a merchant edits a product now and then. Reads are constant — every shopper browsing hits the catalog. The write side stays a normal transactional database with rules. The read side is a search index (like Elasticsearch) rebuilt from the writes, tuned for fast filtering and text search.",
        ar: "يظهر CQRS بوضوح في نظام أحد جانبيه ثقيل القراءة. خذ كتالوج منتجات متجر إلكتروني. الكتابة نادرة — التاجر يعدّل منتجاً بين حين وآخر. القراءة مستمرة — كل متسوّق يتصفّح يصل إلى الكتالوج. جانب الكتابة يبقى قاعدة transactional عادية بقواعدها. وجانب القراءة search index (مثل Elasticsearch) يُعاد بناؤه من الكتابة، مضبوطاً للتصفية والبحث النصي السريع." },
      { t: "ul",
        en: [
          "Draw the write and read paths as two separate arrows from the API — they should never cross.",
          "Name the read store and its lag budget: 'search index, up to 2 seconds behind writes'.",
          "Decide the sync mechanism up front: a message on each write, or a periodic rebuild.",
          "Mark which screens must be read-your-writes consistent — those read from the write store, not the index."
        ],
        ar: [
          "ارسم مساري الكتابة والقراءة كسهمين منفصلين من الـ API — يجب ألا يتقاطعا.",
          "سمِّ مخزن القراءة وميزانية تأخره: 'search index، متأخر حتى ثانيتين عن الكتابة'.",
          "احسم آلية المزامنة مبكراً: رسالة عند كل كتابة، أو إعادة بناء دورية.",
          "علّم الشاشات التي يجب أن تكون read-your-writes متسقة — تلك تقرأ من مخزن الكتابة لا من الـ index."
        ]
      },
      { t: "callout", kind: "tip",
        en: "Read-your-writes means a user always sees their own change immediately. For screens that need it (a checkout confirmation), read from the write store even in a CQRS system. Use the lagging read store only where a small delay is fine (a public listing).",
        ar: "read-your-writes يعني أن المستخدم يرى تغييره فوراً دائماً. للشاشات التي تحتاجه (تأكيد الدفع)، اقرأ من مخزن الكتابة حتى في نظام CQRS. استخدم مخزن القراءة المتأخر فقط حيث يكون التأخر الصغير مقبولاً (قائمة عامة)."
      }
    ]},
    { key: "perf", blocks: [
      { t: "kv", rows: [
        { k: { en: "Network", ar: "Network" }, v: { en: "Projected reads move only needed fields. The 80,000-value fetch drops to 600 — over 100x less data on the wire.", ar: "القراءات المُسقطة تنقل الحقول اللازمة فقط. جلب الـ 80,000 قيمة يهبط إلى 600 — أكثر من مئة ضعف بيانات أقل على الشبكة." } },
        { k: { en: "Memory", ar: "Memory" }, v: { en: "No change tracking on reads (AsNoTracking) means no snapshot per row, so far less heap used per query.", ar: "لا change tracking في القراءة (AsNoTracking) يعني لا snapshot لكل صف، فذاكرة heap أقل بكثير لكل استعلام." } },
        { k: { en: "Database", ar: "Database" }, v: { en: "A narrow projection can be served by a covering index; the full entity load usually cannot.", ar: "الـ projection الضيّق يمكن أن يخدمه covering index؛ أما تحميل الكيان الكامل فغالباً لا." } },
        { k: { en: "Scalability", ar: "Scalability" }, v: { en: "Reads and writes scale on separate stores, so a read spike does not slow the write path.", ar: "القراءة والكتابة تتوسّعان على مخزنين منفصلين، فلا يبطئ ارتفاع القراءة مسار الكتابة." } },
        { k: { en: "Latency", ar: "Latency" }, v: { en: "A pre-shaped read store answers heavy queries in one hop instead of joining many tables live.", ar: "مخزن قراءة مُشكّل مسبقاً يجيب الاستعلامات الثقيلة بقفزة واحدة بدل ربط جداول كثيرة حياً." } }
      ]}
    ]},
    { key: "debug", blocks: [
      { t: "ul",
        en: [
          "EF Core query logging — look at the generated SQL for a read: if it selects every column, your projection is missing.",
          "AsNoTracking check: search the read handlers for queries without it — each tracked read wastes memory.",
          "Sync lag metric on the read store: watch the gap between a write's timestamp and when the read store shows it.",
          "Message queue depth (if syncing by messages): a growing backlog means the read store is falling behind writes.",
          "Correlation ID in logs: follow one command, then the sync, then the query, to confirm the change flowed end to end."
        ],
        ar: [
          "EF Core query logging — انظر إلى الـ SQL المولّد لقراءة: إن اختار كل عمود، فالـ projection مفقود.",
          "فحص AsNoTracking: ابحث في read handlers عن استعلامات بلا هذا التعليم — كل قراءة متتبَّعة تهدر ذاكرة.",
          "مقياس تأخر المزامنة على مخزن القراءة: راقب الفجوة بين طابع وقت الكتابة ووقت ظهورها في مخزن القراءة.",
          "عمق message queue (إن كانت المزامنة بالرسائل): backlog متزايد يعني أن مخزن القراءة يتخلّف عن الكتابة.",
          "Correlation ID في الـ logs: تتبّع command واحداً، ثم المزامنة، ثم الاستعلام، لتأكيد أن التغيير سرى من طرف لطرف."
        ]
      },
      { t: "callout", kind: "tip",
        en: "When users report 'I saved it but do not see it', first check the sync lag metric, not the code. Nine times out of ten the write succeeded and the read store simply had not caught up yet.",
        ar: "حين يبلّغ المستخدمون 'حفظتُ لكنني لا أراه'، افحص مقياس تأخر المزامنة أولاً، لا الكود. في تسع من كل عشر حالات نجحت الكتابة وببساطة لم يلحق مخزن القراءة بعد."
      }
    ]},
    { key: "realworld", blocks: [
      { t: "p",
        en: "CQRS fits systems where reads and writes have clearly different shapes and volumes. It is common in domains with a rich write model — many rules on change — paired with simple, high-traffic reads. It is a poor fit for internal tools and flat CRUD, where one model is plenty and the extra structure only slows the team down.",
        ar: "CQRS يناسب الأنظمة التي يكون فيها للقراءة والكتابة شكلان وحجمان مختلفان بوضوح. يشيع في المجالات ذات نموذج كتابة غني — قواعد كثيرة على التغيير — مقروناً بقراءات بسيطة عالية الحركة. وهو خيار ضعيف للأدوات الداخلية وCRUD المسطّح، حيث يكفي model واحد وتبطئ البنية الإضافية الفريق فقط." },
      { t: "ul",
        en: [
          "E-commerce catalogs: rare product edits (writes) versus constant browsing and search (reads on an index).",
          "Banking and ledgers: strict, rule-heavy transaction writes versus fast statement and balance reads.",
          "Booking and reservation platforms: careful availability writes versus heavy read traffic on listings.",
          "Analytics dashboards: raw events written once, then read many times as pre-aggregated summaries."
        ],
        ar: [
          "كتالوجات التجارة الإلكترونية: تعديلات منتجات نادرة (كتابة) مقابل تصفّح وبحث دائم (قراءة على index).",
          "البنوك والسجلات المحاسبية: كتابات معاملات صارمة كثيرة القواعد مقابل قراءات كشوف وأرصدة سريعة.",
          "منصات الحجز: كتابات توافر دقيقة مقابل حركة قراءة ثقيلة على القوائم.",
          "لوحات التحليلات: أحداث خام تُكتب مرة، ثم تُقرأ مرات كثيرة كملخصات مُجمّعة مسبقاً."
        ]
      }
    ]},
    { key: "exercises", blocks: [
      { t: "ex", diff: "easy",
        en: "Take an existing endpoint that returns a full entity for a list screen. Rewrite its query with a Select projection into a small DTO holding only the displayed fields, and add AsNoTracking. You are right when the logged SQL selects only those columns.",
        ar: "خذ endpoint قائماً يعيد كياناً كاملاً لشاشة قائمة. أعِد كتابة استعلامه بـ Select projection إلى DTO صغير يحمل الحقول المعروضة فقط، وأضف AsNoTracking. تكون مصيباً حين يختار الـ SQL المسجّل تلك الأعمدة فقط." },
      { t: "ex", diff: "medium",
        en: "Split one feature into a command and a query with separate handlers. The command must return only an id; the query must build the display DTO. Prove it by changing the display shape and confirming the command file did not change.",
        ar: "افصل ميزة واحدة إلى command و query بـ handlerين منفصلين. يجب أن يعيد الـ command id فقط؛ وأن يبني الـ query الـ DTO المعروض. أثبت ذلك بتغيير شكل العرض والتأكد أن ملف الـ command لم يتغيّر." },
      { t: "ex", diff: "hard",
        en: "Build a level-two read store: on each write, publish a message that updates a denormalized read table. Add a metric for sync lag. You succeed when a write appears in the read table within your stated lag budget and the metric proves it.",
        ar: "ابنِ مخزن قراءة بالمستوى الثاني: عند كل كتابة، انشر رسالة تحدّث جدول قراءة denormalized. أضف مقياساً لتأخر المزامنة. تنجح حين تظهر الكتابة في جدول القراءة ضمن ميزانية التأخر المعلنة ويثبت المقياس ذلك." },
      { t: "ex", diff: "senior",
        en: "Audit a service and classify each module as 'CQRS earns its keep' or 'one model is enough', with a one-line reason each. Write a short guideline the team can apply per module. You are done when a peer can use it to decide a new module without asking you.",
        ar: "دقّق خدمةً وصنّف كل module بأنه 'CQRS يستحق تكلفته' أو 'model واحد يكفي'، بسبب من سطر واحد لكلٍّ. اكتب دليلاً قصيراً يطبّقه الفريق لكل module. تنتهي حين يستطيع زميل استخدامه ليقرر module جديداً دون سؤالك." }
    ]},
    { key: "refs", blocks: [
      { t: "ref",
        label: { en: "Martin Fowler — CQRS", ar: "Martin Fowler — CQRS" },
        url: "https://martinfowler.com/bliki/CQRS.html",
        meta: { en: "Article", ar: "مقال" } },
      { t: "ref",
        label: { en: "Microsoft — CQRS pattern", ar: "Microsoft — نمط CQRS" },
        url: "https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs",
        meta: { en: "Docs", ar: "توثيق" } },
      { t: "ref",
        label: { en: "Greg Young — CQRS Documents", ar: "Greg Young — وثائق CQRS" },
        url: "https://cqrs.files.wordpress.com/2010/11/cqrs_documents.pdf",
        meta: { en: "Paper", ar: "ورقة" } },
      { t: "ref",
        label: { en: "Microsoft — Query projections in EF Core", ar: "Microsoft — Query projections في EF Core" },
        url: "https://learn.microsoft.com/en-us/ef/core/querying/tracking",
        meta: { en: "Docs", ar: "توثيق" } }
    ]}
  ],
  quiz: [
    {
      q: { en: "What does CQRS separate?", ar: "ماذا يفصل CQRS؟" },
      options: [
        { en: "The frontend from the backend", ar: "الواجهة الأمامية عن الخلفية" },
        { en: "The code that changes data from the code that reads it", ar: "الكود الذي يغيّر البيانات عن الكود الذي يقرأها" },
        { en: "The database from the cache", ar: "قاعدة البيانات عن الـ cache" },
        { en: "Authentication from authorization", ar: "المصادقة عن التفويض" }
      ],
      correct: 1,
      why: {
        en: "CQRS splits the write path (commands, which change state) from the read path (queries, which only return data). That is its entire definition.",
        ar: "CQRS يفصل مسار الكتابة (commands التي تغيّر الحالة) عن مسار القراءة (queries التي تعيد بيانات فقط). هذا هو تعريفه بالكامل."
      }
    },
    {
      q: { en: "Which statement about CQRS is true?", ar: "أي عبارة عن CQRS صحيحة؟" },
      options: [
        { en: "It always requires two databases", ar: "يتطلب دائماً قاعدتي بيانات" },
        { en: "It requires event sourcing", ar: "يتطلب event sourcing" },
        { en: "It can be done with one database and two code paths", ar: "يمكن تطبيقه بقاعدة واحدة ومسارين في الكود" },
        { en: "It makes every query faster automatically", ar: "يجعل كل استعلام أسرع تلقائياً" }
      ],
      correct: 2,
      why: {
        en: "The simplest CQRS is code-only over one database: commands through entities, queries into DTOs. Two databases and event sourcing are optional additions, not requirements.",
        ar: "أبسط CQRS كودي فقط فوق قاعدة واحدة: commands عبر الكيانات، queries إلى DTOs. القاعدتان و event sourcing إضافات اختيارية لا شروط."
      }
    },
    {
      q: { en: "Why should a command handler return just an id, not a full DTO?", ar: "لماذا يجب أن يعيد الـ command handler الـ id فقط لا DTO كاملاً؟" },
      options: [
        { en: "To make the response smaller for the network", ar: "لجعل الاستجابة أصغر على الشبكة" },
        { en: "To keep the write path independent of any screen's shape", ar: "لإبقاء مسار الكتابة مستقلاً عن شكل أي شاشة" },
        { en: "Because DTOs cannot be serialized", ar: "لأن الـ DTOs لا يمكن تسلسلها" },
        { en: "Because commands are not allowed to return values", ar: "لأن الـ commands لا يُسمح لها بإعادة قيم" }
      ],
      correct: 1,
      why: {
        en: "Returning a display DTO ties the command to a screen, so a UI change edits the write path. Returning the id lets the caller run a query when it needs details.",
        ar: "إعادة DTO عرض تربط الـ command بشاشة، فيصير تغيير الـ UI يعدّل مسار الكتابة. إعادة الـ id تدع المستدعي يشغّل query حين يحتاج التفاصيل."
      }
    },
    {
      q: { en: "What is the main cost of adding a separate read store?", ar: "ما التكلفة الرئيسية لإضافة مخزن قراءة منفصل؟" },
      options: [
        { en: "It breaks all write transactions", ar: "يكسر كل transactions الكتابة" },
        { en: "Eventual consistency — the read store lags the write store", ar: "eventual consistency — مخزن القراءة يتأخر عن مخزن الكتابة" },
        { en: "It removes the ability to query by id", ar: "يزيل القدرة على الاستعلام بالـ id" },
        { en: "It forces the use of a relational database", ar: "يفرض استخدام قاعدة علائقية" }
      ],
      correct: 1,
      why: {
        en: "A second read store is kept in sync from writes with a short delay, so a user may not see a just-saved change immediately. That lag is the price you pay.",
        ar: "مخزن القراءة الثاني يُبقى متزامناً من الكتابة بتأخر قصير، فقد لا يرى المستخدم تغييراً حفظه للتو فوراً. هذا التأخر هو الثمن."
      }
    },
    {
      q: { en: "When is CQRS most likely overkill?", ar: "متى يكون CQRS مبالغة على الأرجح؟" },
      options: [
        { en: "A read-heavy catalog with a search index", ar: "كتالوج ثقيل القراءة مع search index" },
        { en: "A banking ledger with strict write rules", ar: "سجل بنكي بقواعد كتابة صارمة" },
        { en: "A flat CRUD settings table with no rules", ar: "جدول إعدادات CRUD مسطّح بلا قواعد" },
        { en: "An analytics dashboard over pre-aggregated data", ar: "لوحة تحليلات فوق بيانات مُجمّعة مسبقاً" }
      ],
      correct: 2,
      why: {
        en: "For a flat CRUD entity with no distinct read/write shapes and no rules, splitting into command, query, and two handlers is pure overhead with no payoff.",
        ar: "لكيان CRUD مسطّح بلا شكلين مختلفين للقراءة والكتابة وبلا قواعد، الفصل إلى command و query و handlerين عبء صافٍ بلا فائدة."
      }
    }
  ]
};
```

NEXT: events
