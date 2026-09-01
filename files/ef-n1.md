```js
const efN1Lesson = {
  id: "ef-n1",
  moduleId: "efcore",
  title: { en: "N+1 and eager loading", ar: "N+1 والتحميل المبكر" },
  summary: {
    en: "Why one innocent loop turns a single query into hundreds, and how Include, projections and logging let you find and kill it.",
    ar: "لماذا يحوّل loop واحد بريء استعلاماً واحداً إلى مئات الاستعلامات، وكيف تجد المشكلة وتقضي عليها باستخدام Include و projections و logging."
  },
  mins: 17,
  sections: [
    {
      key: "why",
      blocks: [
        {
          t: "p",
          en: "N+1 is a bug where your code runs one database query to get a list, then one more query for every single row in that list. Fifty orders means fifty-one round trips to the database instead of one. Eager loading is the fix: you tell EF Core to fetch the related data in the same trip, before the loop starts.",
          ar: "الـ N+1 هو خطأ يشغّل استعلاماً واحداً لجلب قائمة، ثم استعلاماً إضافياً لكل صف في تلك القائمة. خمسون order تعني 51 رحلة إلى قاعدة البيانات بدل رحلة واحدة. الحل هو eager loading: تطلب من EF Core جلب البيانات المرتبطة في نفس الرحلة، قبل بدء الـ loop."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "Navigation property", ar: "Navigation property" },
              v: {
                en: "A property on an entity that points at related rows, like order.Customer or order.Lines. It is not a column; EF fills it by running a query.",
                ar: "خاصية على الـ entity تشير إلى صفوف مرتبطة، مثل order.Customer أو order.Lines. ليست عموداً في الجدول؛ EF يملؤها عبر تشغيل استعلام."
              }
            },
            {
              k: { en: "Round trip", ar: "Round trip" },
              v: {
                en: "One full network journey: your app sends SQL to the database and waits for the answer. Each one costs about 0.5-2 ms even for a trivial query.",
                ar: "رحلة شبكة كاملة: التطبيق يرسل SQL إلى قاعدة البيانات وينتظر الرد. كل رحلة تكلّف حوالي 0.5-2 ms حتى لو كان الاستعلام تافهاً."
              }
            },
            {
              k: { en: "Eager loading", ar: "Eager loading" },
              v: {
                en: "Asking for the related data up front, in the same query, using Include(...) or a Select projection.",
                ar: "طلب البيانات المرتبطة مسبقاً وفي نفس الاستعلام، عبر Include(...) أو Select projection."
              }
            },
            {
              k: { en: "Lazy loading", ar: "Lazy loading" },
              v: {
                en: "EF silently runs a query the moment you touch a navigation property. Convenient to write, and the usual cause of N+1.",
                ar: "EF يشغّل استعلاماً بصمت لحظة لمسك navigation property. مريح في الكتابة، وهو السبب المعتاد للـ N+1."
              }
            },
            {
              k: { en: "Explicit loading", ar: "Explicit loading" },
              v: {
                en: "You call Entry(x).Collection(...).LoadAsync() yourself. Same query as lazy loading, but you can see it in the code.",
                ar: "تستدعي Entry(x).Collection(...).LoadAsync() بنفسك. نفس استعلام lazy loading، لكنه ظاهر في الكود."
              }
            },
            {
              k: { en: "Projection", ar: "Projection" },
              v: {
                en: "A Select that builds a small result shape (a DTO) instead of loading full entities. EF turns it into one SQL statement with joins.",
                ar: "Select يبني شكل نتيجة صغيراً (DTO) بدل تحميل entities كاملة. EF يحوّله إلى جملة SQL واحدة مع joins."
              }
            }
          ]
        },
        {
          t: "p",
          en: "The problem exists because C# object graphs and SQL result sets are shaped differently. In C#, order.Customer.Name looks like reading a field in memory. In SQL, that same access may need a join or another SELECT. EF Core hides the gap, and the hidden work is invisible in the code you read during review.",
          ar: "المشكلة موجودة لأن شكل object graph في C# يختلف عن شكل نتيجة SQL. في C#، تبدو order.Customer.Name كقراءة حقل من الذاكرة. في SQL، نفس الوصول قد يحتاج join أو SELECT آخر. EF Core يخفي هذه الفجوة، والعمل المخفي غير مرئي في الكود أثناء المراجعة."
        },
        {
          t: "p",
          en: "Think of a warehouse. You send a runner with a list of fifty item numbers and he brings back one crate with all fifty. That is eager loading. N+1 is sending the runner once to get the list of numbers, then sending him back for item one, again for item two, and so on. Each trip is short. Fifty-one trips are not. The database is the warehouse and the network is the walk.",
          ar: "تخيّل مستودعاً. ترسل عاملاً بقائمة فيها خمسون رقم صنف فيعود بصندوق واحد يحوي الخمسين. هذا هو eager loading. الـ N+1 هو أن ترسله مرة لجلب قائمة الأرقام، ثم ترسله للصنف الأول، ثم للثاني، وهكذا. كل رحلة قصيرة. لكن 51 رحلة ليست قصيرة. قاعدة البيانات هي المستودع، والشبكة هي المشي."
        },
        {
          t: "callout",
          kind: "note",
          en: "N+1 rarely fails in development. With ten test rows and a database on localhost the page loads in 30 ms. In production with 50 rows per page and a 1 ms network hop, the same code takes 10x longer — and it gets worse as data grows.",
          ar: "الـ N+1 نادراً ما يظهر أثناء التطوير. مع عشرة صفوف اختبار وقاعدة بيانات على localhost تُحمّل الصفحة في 30 ms. في production مع 50 صفاً لكل صفحة و 1 ms تأخير شبكة، نفس الكود يستغرق عشرة أضعاف — ويزداد سوءاً كلما كبرت البيانات."
        }
      ]
    },
    {
      key: "problem",
      blocks: [
        {
          t: "p",
          en: "Here is the running example used for the rest of this lesson. An endpoint GET /api/orders returns the 50 newest orders. Each result line shows the order number, the customer's name, and how many line items the order has. The Order entity has a Customer navigation property and a Lines collection.",
          ar: "هذا هو المثال الجاري الذي سنستخدمه في بقية الدرس. endpoint اسمه GET /api/orders يعيد أحدث 50 order. كل سطر في النتيجة يعرض رقم الـ order واسم الـ customer وعدد الـ line items. الـ entity المسمى Order لديه navigation property اسمه Customer و collection اسمه Lines."
        },
        {
          t: "code",
          lang: "csharp",
          label: { en: "The version that looks fine and is not", ar: "النسخة التي تبدو سليمة وهي ليست كذلك" },
          code: "var orders = await db.Orders\n    .OrderByDescending(o => o.CreatedAt)\n    .Take(50)\n    .ToListAsync();                       // query 1\n\nvar result = new List<OrderRow>();\nforeach (var o in orders)\n{\n    result.Add(new OrderRow(\n        o.Number,\n        o.Customer.Name,                  // query 2..51  (one per order)\n        o.Lines.Count));                  // query 52..101 (one per order)\n}"
        },
        {
          t: "p",
          en: "Two navigation properties are touched inside the loop, so with lazy loading enabled this runs 101 queries: one for the orders, 50 for the customers, 50 for the line collections. Nothing in the C# says \"query\". The dots do it.",
          ar: "يتم لمس اثنين من navigation properties داخل الـ loop، لذا مع تفعيل lazy loading يشغّل هذا الكود 101 استعلام: واحد للـ orders، و50 للـ customers، و50 لمجموعات الـ lines. لا شيء في كود C# يقول «استعلام». النقاط هي التي تفعل ذلك."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "Before — lazy loading in the loop", ar: "قبل — lazy loading داخل الـ loop" },
              v: {
                en: "101 queries, 640 ms average response time, and roughly 101 connection checkouts from the pool per request. Under 100 concurrent users the pool of 100 connections is exhausted and requests start queueing.",
                ar: "101 استعلام، متوسط زمن الاستجابة 640 ms، وحوالي 101 سحب connection من الـ pool لكل request. مع 100 مستخدم متزامن ينفد pool المكوّن من 100 connection وتبدأ الـ requests بالانتظار في طابور."
              }
            },
            {
              k: { en: "After — one projected query", ar: "بعد — استعلام واحد بـ projection" },
              v: {
                en: "1 query, 12 ms average response time. Same rows returned, same JSON on the wire. The database does one join and one grouped count instead of 100 tiny lookups.",
                ar: "استعلام واحد، متوسط زمن الاستجابة 12 ms. نفس الصفوف تُعاد، ونفس الـ JSON يُرسل. قاعدة البيانات تنفّذ join واحداً و count مجمّعاً واحداً بدل 100 عملية بحث صغيرة."
              }
            },
            {
              k: { en: "Why the gap is so wide", ar: "لماذا الفارق كبير إلى هذا الحد" },
              v: {
                en: "Each extra query costs about 6 ms end to end: 1 ms network each way, plus parsing, plan lookup, and result materialisation. 100 x 6 ms is 600 ms of pure overhead — the actual row reading is a rounding error.",
                ar: "كل استعلام إضافي يكلّف حوالي 6 ms من البداية للنهاية: 1 ms شبكة في كل اتجاه، بالإضافة إلى parsing و plan lookup و materialisation للنتيجة. 100 × 6 ms تساوي 600 ms عبئاً صافياً — أما قراءة الصفوف نفسها فهي خطأ تقريب."
              }
            }
          ]
        },
        {
          t: "p",
          en: "The cost scales with the number of rows, not with the size of the data. Doubling the page size to 100 orders doubles the query count. That is the signature of N+1: latency grows in a straight line with row count, while the amount of returned data barely changes.",
          ar: "التكلفة تتناسب مع عدد الصفوف لا مع حجم البيانات. مضاعفة حجم الصفحة إلى 100 order تضاعف عدد الاستعلامات. هذه هي بصمة الـ N+1: زمن الاستجابة يزيد بخط مستقيم مع عدد الصفوف، بينما حجم البيانات المعادة لا يكاد يتغيّر."
        }
      ]
    },
    {
      key: "internals",
      blocks: [
        {
          t: "p",
          en: "To understand N+1 you need to know exactly when EF Core decides to talk to the database. A LINQ query is not executed when you write it. It is executed when something forces it to produce values — calling ToListAsync, FirstOrDefaultAsync, CountAsync, or starting a foreach over it. Until then EF is only building a tree of expressions describing what you asked for.",
          ar: "لفهم الـ N+1 تحتاج أن تعرف بالضبط متى يقرّر EF Core التحدّث إلى قاعدة البيانات. استعلام LINQ لا يُنفَّذ عند كتابته. يُنفَّذ عندما يجبره شيء على إنتاج قيم — استدعاء ToListAsync أو FirstOrDefaultAsync أو CountAsync أو بدء foreach عليه. قبل ذلك يبني EF شجرة expressions تصف ما طلبته فقط."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "Expression tree", ar: "Expression tree" },
              v: {
                en: "A data structure describing your LINQ code as objects instead of compiled instructions, so EF can read it and write SQL from it.",
                ar: "بنية بيانات تصف كود LINQ الخاص بك ككائنات بدل تعليمات مترجمة، ليتمكّن EF من قراءتها وكتابة SQL منها."
              }
            },
            {
              k: { en: "Query pipeline", ar: "Query pipeline" },
              v: {
                en: "The EF stage that translates the expression tree into SQL, decides which parts run on the server, and caches the result by query shape.",
                ar: "المرحلة في EF التي تترجم الـ expression tree إلى SQL، وتقرّر أي أجزاء تُنفَّذ على الـ server، وتحفظ النتيجة في cache حسب شكل الاستعلام."
              }
            },
            {
              k: { en: "Materialiser", ar: "Materialiser" },
              v: {
                en: "The generated code that reads each row from the data reader and turns it into a C# object, wiring navigation properties as it goes.",
                ar: "الكود المولَّد الذي يقرأ كل صف من الـ data reader ويحوّله إلى كائن C#، ويربط navigation properties أثناء ذلك."
              }
            },
            {
              k: { en: "Proxy", ar: "Proxy" },
              v: {
                en: "With lazy loading, EF returns a generated subclass of your entity that overrides each virtual navigation property and runs a query on first access.",
                ar: "مع lazy loading يعيد EF فئة فرعية مولَّدة من الـ entity، تعيد تعريف كل virtual navigation property وتشغّل استعلاماً عند أول وصول."
              }
            },
            {
              k: { en: "Identity map", ar: "Identity map" },
              v: {
                en: "The change tracker's dictionary of already-loaded entities keyed by primary key, so the same row loaded twice becomes one object.",
                ar: "قاموس في change tracker يحتوي الـ entities المحمّلة مسبقاً مفهرسة بالـ primary key، بحيث يصبح الصف المحمّل مرتين كائناً واحداً."
              }
            }
          ]
        },
        {
          t: "p",
          en: "Step by step for the 50-order request with lazy loading on. First, ToListAsync executes the orders query and the materialiser builds 50 Order proxies — generated subclasses, not plain Order objects. Second, the loop reads o.Customer. That property is virtual, so the proxy's override runs instead of a plain field read. It asks the change tracker whether customer 917 is already loaded. It is not, so EF issues SELECT * FROM Customers WHERE Id = 917 and waits. Third, o.Lines.Count does the same for the collection: SELECT * FROM OrderLines WHERE OrderId = 5501, loads every line into memory, and then counts them in C#.",
          ar: "خطوة بخطوة لطلب الـ 50 order مع تفعيل lazy loading. أولاً، ToListAsync ينفّذ استعلام الـ orders ويبني الـ materialiser خمسين proxy من نوع Order — فئات فرعية مولَّدة لا كائنات Order عادية. ثانياً، الـ loop يقرأ o.Customer. هذه الخاصية virtual، لذا يعمل الـ override في الـ proxy بدل قراءة حقل عادي. يسأل change tracker إن كان customer رقم 917 محمّلاً مسبقاً. ليس محمّلاً، فيُصدر EF جملة SELECT * FROM Customers WHERE Id = 917 وينتظر. ثالثاً، o.Lines.Count يفعل الشيء نفسه للـ collection: SELECT * FROM OrderLines WHERE OrderId = 5501، يحمّل كل الأسطر إلى الذاكرة ثم يعدّها في C#."
        },
        {
          t: "p",
          en: "Each of those queries is synchronous from the caller's point of view. The property getter cannot be awaited, so the thread blocks on network I/O 100 times. That is why a lazy-loading N+1 also burns thread pool threads, not just database time.",
          ar: "كل واحد من هذه الاستعلامات متزامن من وجهة نظر المستدعي. لا يمكن عمل await على property getter، لذا يتوقّف الـ thread على network I/O مئة مرة. لهذا السبب فإن N+1 الناتج عن lazy loading يستهلك threads من الـ thread pool أيضاً، لا وقت قاعدة البيانات فقط."
        },
        {
          t: "code",
          lang: "sql",
          label: { en: "What the database actually receives (abridged)", ar: "ما تستقبله قاعدة البيانات فعلياً (مختصراً)" },
          code: "-- query 1\nSELECT TOP(50) o.Id, o.Number, o.CustomerId, o.CreatedAt\nFROM Orders AS o ORDER BY o.CreatedAt DESC;\n\n-- queries 2..51, one per order, values change only\nSELECT c.Id, c.Name, c.Email FROM Customers AS c WHERE c.Id = 917;\nSELECT c.Id, c.Name, c.Email FROM Customers AS c WHERE c.Id = 918;\n\n-- queries 52..101, one per order\nSELECT l.Id, l.OrderId, l.Sku, l.Qty, l.Price\nFROM OrderLines AS l WHERE l.OrderId = 5501;"
        },
        {
          t: "p",
          en: "Now the fix. Include(o => o.Customer) tells the query pipeline to add a LEFT JOIN to Customers so the customer columns arrive with the order row. The materialiser attaches the customer object while reading the same result set, so no second query is possible. A projection goes further: Select(o => new OrderRow(o.Number, o.Customer.Name, o.Lines.Count())) never builds entities at all. EF translates Lines.Count() into a correlated subquery or a grouped join, so the count happens inside SQL Server and only three small columns cross the network per row.",
          ar: "الآن الحل. الاستدعاء Include(o => o.Customer) يخبر الـ query pipeline بإضافة LEFT JOIN إلى جدول Customers ليصل عمود الاسم مع صف الـ order. الـ materialiser يربط كائن الـ customer أثناء قراءة نفس مجموعة النتائج، فلا يمكن أن يحدث استعلام ثانٍ. الـ projection يذهب أبعد: الاستدعاء Select(o => new OrderRow(o.Number, o.Customer.Name, o.Lines.Count())) لا يبني entities إطلاقاً. يترجم EF جملة Lines.Count() إلى correlated subquery أو grouped join، فيتم العدّ داخل SQL Server ولا يعبر الشبكة سوى ثلاثة أعمدة صغيرة لكل صف."
        },
        {
          t: "code",
          lang: "csharp",
          label: { en: "One query, one round trip", ar: "استعلام واحد، رحلة واحدة" },
          code: "var result = await db.Orders\n    .AsNoTracking()\n    .OrderByDescending(o => o.CreatedAt)\n    .Take(50)\n    .Select(o => new OrderRow(\n        o.Number,\n        o.Customer.Name,      // becomes a JOIN\n        o.Lines.Count()))     // becomes a subquery, counted in SQL\n    .ToListAsync();"
        },
        {
          t: "callout",
          kind: "tip",
          en: "Include only works on a query. Once ToListAsync has run, the objects are plain C# objects and Include on them is impossible. If you find yourself wanting related data after materialising, the Include belonged earlier in the chain.",
          ar: "الـ Include يعمل على الاستعلام فقط. بعد تنفيذ ToListAsync تصبح الكائنات كائنات C# عادية ولا يمكن تطبيق Include عليها. إذا وجدت نفسك تحتاج بيانات مرتبطة بعد الـ materialisation، فمكان الـ Include كان أبكر في السلسلة."
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
              "One round trip instead of N+1, so latency stops growing with row count.",
              "The database does the joining and counting, which is what it is optimised for.",
              "A projection returns only the columns you need, cutting network bytes and memory.",
              "The generated SQL is visible in logs, so the cost is reviewable."
            ],
            ar: [
              "رحلة واحدة بدل N+1، فيتوقّف زمن الاستجابة عن النمو مع عدد الصفوف.",
              "قاعدة البيانات تنفّذ الـ join والعدّ، وهو ما صُمّمت له.",
              "الـ projection يعيد الأعمدة التي تحتاجها فقط، فيقلّ حجم الشبكة والذاكرة.",
              "الـ SQL المولَّد ظاهر في الـ logs، فتصبح التكلفة قابلة للمراجعة."
            ]
          },
          cons: {
            en: [
              "Including several collections in one query multiplies rows — 50 orders x 10 lines x 3 tags is 1500 duplicated rows.",
              "Projections need a DTO type per shape, which is more code to maintain.",
              "Include pulls whole entities including columns you never read.",
              "A single big query can pick a worse execution plan than several small ones."
            ],
            ar: [
              "تضمين عدة collections في استعلام واحد يضاعف الصفوف — 50 order × 10 lines × 3 tags يساوي 1500 صف مكرّر.",
              "الـ projections تحتاج نوع DTO لكل شكل، أي كود إضافي للصيانة.",
              "الـ Include يجلب entities كاملة بما فيها أعمدة لا تقرأها أبداً.",
              "استعلام واحد كبير قد يختار execution plan أسوأ من عدة استعلامات صغيرة."
            ]
          },
          limits: {
            en: [
              "Include is ignored if the query ends in a Select projection — the projection decides what loads.",
              "Filtering inside Include is limited to Where, OrderBy, Skip and Take on the collection.",
              "Client-side operations after ToList cannot be translated, so they cannot be batched.",
              "Two collection Includes at the same level need AsSplitQuery to stay sane."
            ],
            ar: [
              "يُتجاهل الـ Include إذا انتهى الاستعلام بـ Select projection — الـ projection هو من يقرّر ما يُحمَّل.",
              "الفلترة داخل Include محدودة بـ Where و OrderBy و Skip و Take على الـ collection.",
              "العمليات على جانب العميل بعد ToList لا يمكن ترجمتها، لذا لا يمكن تجميعها.",
              "وجود Include لمجموعتين في نفس المستوى يحتاج AsSplitQuery حتى يبقى الأمر معقولاً."
            ]
          },
          alts: {
            en: [
              "AsSplitQuery: one query per collection — a fixed small number, not one per row.",
              "Two manual queries plus an in-memory join by key, when the shapes are awkward.",
              "A database view or stored procedure when the query is genuinely complex.",
              "A denormalised read model updated on write, for very hot list endpoints."
            ],
            ar: [
              "AsSplitQuery: استعلام لكل collection — عدد صغير ثابت، لا استعلام لكل صف.",
              "استعلامان يدويان مع join في الذاكرة بالمفتاح، عندما تكون الأشكال معقدة.",
              "view أو stored procedure في قاعدة البيانات عندما يكون الاستعلام معقّداً فعلاً.",
              "read model غير مطبَّع يُحدَّث عند الكتابة، للـ endpoints شديدة الاستخدام."
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
          title: { en: "Mapping to a DTO after ToListAsync", ar: "التحويل إلى DTO بعد ToListAsync" },
          body: {
            en: "A developer wrote the orders query, called ToListAsync, then mapped to OrderRow in a foreach because that felt cleaner than a long Select. The mapping touched o.Customer.Name. Because ToListAsync had already run, EF could no longer add a join — it had to lazy-load each customer separately. The endpoint went from 12 ms to 640 ms and nobody noticed for three weeks, because the change looked like pure refactoring in the pull request.",
            ar: "كتب مطوّر استعلام الـ orders، ثم استدعى ToListAsync، ثم حوّل النتائج إلى OrderRow داخل foreach لأن ذلك بدا أنظف من Select طويل. عملية التحويل لمست o.Customer.Name. وبما أن ToListAsync كان قد نُفِّذ، لم يعد بإمكان EF إضافة join — فاضطر إلى تحميل كل customer بشكل منفصل عبر lazy loading. ارتفع زمن الـ endpoint من 12 ms إلى 640 ms ولم يلاحظ أحد لثلاثة أسابيع، لأن التغيير بدا مجرّد refactoring في الـ pull request."
          },
          fix: "// map inside the query, before it executes\nvar rows = await db.Orders\n    .Select(o => new OrderRow(o.Number, o.Customer.Name, o.Lines.Count()))\n    .ToListAsync();"
        },
        {
          t: "mistake",
          title: { en: "Counting a collection in C# instead of SQL", ar: "عدّ الـ collection في C# بدل SQL" },
          body: {
            en: "The code used o.Lines.Count — the property on the loaded collection — instead of o.Lines.Count() inside a projection. The property forces EF to load every OrderLine row into memory just to count them. One order with 4000 lines pulled 4000 rows across the network to produce the number 4000. Memory per request went from 200 KB to 40 MB and the service started hitting garbage collection pauses.",
            ar: "استخدم الكود o.Lines.Count — الخاصية على الـ collection المحمّلة — بدل o.Lines.Count() داخل projection. الخاصية تجبر EF على تحميل كل صفوف OrderLine إلى الذاكرة لمجرّد عدّها. order واحد فيه 4000 سطر سحب 4000 صف عبر الشبكة لإنتاج الرقم 4000. ارتفعت الذاكرة لكل request من 200 KB إلى 40 MB وبدأت الخدمة تعاني من توقّفات garbage collection."
          },
          fix: ".Select(o => new { o.Number, LineCount = o.Lines.Count() })\n// translates to: (SELECT COUNT(*) FROM OrderLines WHERE OrderId = o.Id)"
        },
        {
          t: "mistake",
          title: { en: "Calling a repository inside the loop", ar: "استدعاء repository داخل الـ loop" },
          body: {
            en: "There was no lazy loading enabled, so the team assumed they were safe. But the loop called _customerRepo.GetByIdAsync(o.CustomerId) for each order. That is the same N+1 written by hand — 50 separate SELECT statements — and it is worse, because Include cannot help. Disabling lazy loading removes one source of N+1, not the pattern itself.",
            ar: "لم يكن lazy loading مفعّلاً، لذا افترض الفريق أنهم بأمان. لكن الـ loop كان يستدعي ‎_customerRepo.GetByIdAsync(o.CustomerId)‎ لكل order. هذا هو نفس الـ N+1 مكتوباً يدوياً — 50 جملة SELECT منفصلة — وهو أسوأ، لأن Include لا يمكنه المساعدة. تعطيل lazy loading يزيل مصدراً واحداً للـ N+1، لا النمط نفسه."
          },
          fix: "var ids = orders.Select(o => o.CustomerId).Distinct().ToList();\nvar customers = await db.Customers\n    .Where(c => ids.Contains(c.Id))\n    .ToDictionaryAsync(c => c.Id);   // one query, then look up in memory"
        },
        {
          t: "mistake",
          title: { en: "Fixing N+1 with several collection Includes", ar: "معالجة N+1 بعدة Include لمجموعات" },
          body: {
            en: "Someone replaced the loop with Include(o => o.Lines).Include(o => o.Tags).Include(o => o.Payments). The query count dropped to one, and the response got slower. A single SQL statement joining three collections returns the cross product: an order with 10 lines, 3 tags and 2 payments produces 60 rows, and every order column is repeated 60 times. 50 orders became 3000 rows and 40 MB of duplicated data on the wire.",
            ar: "استبدل أحدهم الـ loop بـ Include(o => o.Lines).Include(o => o.Tags).Include(o => o.Payments). انخفض عدد الاستعلامات إلى واحد، وصارت الاستجابة أبطأ. جملة SQL واحدة تربط ثلاث collections تعيد الجداء الديكارتي: order فيه 10 lines و3 tags و2 payments ينتج 60 صفاً، وكل أعمدة الـ order تتكرّر 60 مرة. فصارت الخمسون order ثلاثة آلاف صف و40 MB من البيانات المكرّرة على الشبكة."
          },
          fix: "db.Orders.Include(o => o.Lines).Include(o => o.Tags)\n         .AsSplitQuery()   // 3 queries total, not 1 huge one"
        }
      ]
    },
    {
      key: "interview",
      blocks: [
        {
          t: "qa",
          level: "junior",
          q: { en: "What is an N+1 query problem?", ar: "ما هي مشكلة N+1 query؟" },
          a: {
            en: "You run one query to get a list of N things, then one more query for each of those N things. So N+1 queries in total. Classic case: load 50 orders, then loop over them and read order.Customer.Name. Each read fires its own SELECT. The fix is to ask for the related data in the first query, using Include or a Select projection.",
            ar: "تشغّل استعلاماً واحداً لجلب قائمة فيها N عنصر، ثم استعلاماً إضافياً لكل عنصر من الـ N. أي N+1 استعلاماً في المجموع. الحالة الكلاسيكية: تحميل 50 order ثم عمل loop عليها وقراءة order.Customer.Name. كل قراءة تطلق SELECT خاصاً بها. الحل هو طلب البيانات المرتبطة في الاستعلام الأول باستخدام Include أو Select projection."
          }
        },
        {
          t: "qa",
          level: "mid",
          q: { en: "Include or Select — which do you reach for and why?", ar: "Include أم Select — أيهما تختار ولماذا؟" },
          a: {
            en: "Select for anything read-only that goes out as JSON, because it fetches only the columns I actually return and produces a smaller result set. Include when I need real tracked entities because I am about to modify them and call SaveChanges. If a query ends in a Select, any Include earlier in the chain is ignored anyway — the projection decides what gets loaded.",
            ar: "أستخدم Select لأي شيء للقراءة فقط يخرج كـ JSON، لأنه يجلب الأعمدة التي أعيدها فعلاً وينتج نتيجة أصغر. وأستخدم Include عندما أحتاج entities حقيقية متتبَّعة لأنني سأعدّلها ثم أستدعي SaveChanges. وإذا انتهى الاستعلام بـ Select فإن أي Include سابق في السلسلة يُتجاهل على أي حال — الـ projection هو من يحدّد ما يُحمَّل."
          }
        },
        {
          t: "qa",
          level: "mid",
          q: { en: "You added Include and the endpoint got slower. What happened?", ar: "أضفت Include فصار الـ endpoint أبطأ. ماذا حدث؟" },
          a: {
            en: "Almost certainly a cartesian explosion — the row count multiplying. One SQL statement joining two or more collections returns every combination. Ten lines and three tags per order is thirty rows per order, with the order's own columns repeated thirty times. Query count went down, bytes on the wire went way up. AsSplitQuery fixes it: EF runs one query per collection and stitches the results together in memory.",
            ar: "شبه مؤكد أنه cartesian explosion — تضاعف عدد الصفوف. جملة SQL واحدة تربط collection أو أكثر تعيد كل التوليفات. عشرة lines وثلاثة tags لكل order تعني ثلاثين صفاً لكل order، وأعمدة الـ order نفسها مكرّرة ثلاثين مرة. انخفض عدد الاستعلامات لكن حجم البيانات على الشبكة ارتفع كثيراً. الحل AsSplitQuery: يشغّل EF استعلاماً لكل collection ثم يجمع النتائج في الذاكرة."
          }
        },
        {
          t: "qa",
          level: "senior",
          q: { en: "How do you detect N+1 before it reaches production?", ar: "كيف تكتشف N+1 قبل وصوله إلى production؟" },
          a: {
            en: "Three layers. In development I turn on EF command logging so every SQL statement prints; a burst of near-identical SELECTs differing only in the id is the tell. In tests I add a DbCommandInterceptor that counts commands per scope and fails the test if a list endpoint exceeds a threshold like five. In production I read distributed traces — an N+1 shows as a wall of short database spans inside one request span. The test-level counter is the one that actually stops regressions, because it fails the build.",
            ar: "ثلاث طبقات. في بيئة التطوير أفعّل EF command logging ليُطبع كل SQL statement؛ والعلامة هي دفعة من SELECT شبه متطابقة لا تختلف إلا في الـ id. في الاختبارات أضيف DbCommandInterceptor يعدّ الأوامر لكل scope ويُفشل الاختبار إذا تجاوز endpoint القائمة حدّاً مثل خمسة. في production أقرأ الـ distributed traces — يظهر الـ N+1 كجدار من database spans القصيرة داخل span واحد للطلب. العدّاد في الاختبارات هو ما يمنع الانحدارات فعلاً، لأنه يُفشل الـ build."
          }
        },
        {
          t: "qa",
          level: "senior",
          q: { en: "Would you ever leave an N+1 in place on purpose?", ar: "هل تترك N+1 قائماً عن قصد في أي حالة؟" },
          a: {
            en: "Yes, when N is bounded and small and the alternative is genuinely worse. A detail page loading one order and its three related lookups is four queries; joining them all could pick a bad plan for no real gain. What I will not accept is an unbounded N — anything driven by a page size or a user-supplied list, because that grows with traffic and data. The question I ask is not 'is there a loop' but 'what is the largest value N can take next year'.",
            ar: "نعم، عندما يكون N محدوداً وصغيراً والبديل أسوأ فعلاً. صفحة تفاصيل تحمّل order واحداً وثلاث lookups مرتبطة تعني أربعة استعلامات؛ وربطها كلها قد يختار plan سيئاً بلا مكسب حقيقي. ما لا أقبله هو N غير محدود — أي شيء يحدّده حجم الصفحة أو قائمة يرسلها المستخدم، لأنه ينمو مع الترافيك والبيانات. السؤال الذي أطرحه ليس «هل يوجد loop» بل «ما أكبر قيمة يمكن أن يبلغها N السنة القادمة»."
          }
        },
        {
          t: "qa",
          level: "staff",
          q: { en: "Your teams keep shipping N+1s. What do you change structurally?", ar: "فرقك تستمر في إطلاق N+1. ما الذي تغيّره هيكلياً؟" },
          a: {
            en: "I stop treating it as a knowledge problem and make the default safe. First, turn lazy loading off across every context — the proxies package is simply not referenced, so the accidental version cannot be written. Second, add a shared test helper that asserts a maximum command count per request, and wire it into the template every new service is generated from. Third, put a p95 latency and a database-calls-per-request panel on each service dashboard, so the regression is visible the day it ships rather than at the next incident. Training one team teaches one team; changing the template changes everyone hired after today.",
            ar: "أتوقّف عن التعامل معها كمشكلة معرفة وأجعل الوضع الافتراضي آمناً. أولاً، أطفئ lazy loading في كل contexts — لا يُضاف package الخاص بالـ proxies أصلاً، فتصبح النسخة العرَضية غير قابلة للكتابة. ثانياً، أضيف test helper مشترك يتحقّق من حدّ أقصى لعدد الأوامر لكل request، وأضعه في الـ template الذي تُولَّد منه كل خدمة جديدة. ثالثاً، أضع لوحة لـ p95 latency وعدد استدعاءات قاعدة البيانات لكل request في dashboard كل خدمة، ليظهر الانحدار يوم إطلاقه لا عند الحادث التالي. تدريب فريق واحد يعلّم فريقاً واحداً؛ أما تغيير الـ template فيغيّر كل من يُوظَّف بعد اليوم."
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
          title: { en: "Navigation property touched after the query ran", ar: "لمس navigation property بعد تنفيذ الاستعلام" },
          bad: "var orders = await db.Orders.Take(50).ToListAsync();\nreturn orders.Select(o => new OrderRow(\n    o.Number,\n    o.Customer.Name,       // lazy load, once per order\n    o.Lines.Count));       // loads every line, once per order",
          good: "return await db.Orders\n    .AsNoTracking()\n    .Take(50)\n    .Select(o => new OrderRow(\n        o.Number,\n        o.Customer.Name,\n        o.Lines.Count()))\n    .ToListAsync();",
          why: {
            en: "ToListAsync ends the query. After it, EF has no chance to add a join, so each dot on a navigation property becomes its own SELECT. Moving the Select before ToListAsync means EF sees the whole shape and emits one statement. In the bad version this is 101 queries; in the good version it is 1.",
            ar: "الاستدعاء ToListAsync ينهي الاستعلام. بعده لا تبقى فرصة أمام EF لإضافة join، فتتحوّل كل نقطة على navigation property إلى SELECT مستقل. نقل الـ Select قبل ToListAsync يجعل EF يرى الشكل كاملاً ويُصدر جملة واحدة. النسخة السيئة تعني 101 استعلام؛ والنسخة الجيدة استعلاماً واحداً."
          }
        },
        {
          t: "review",
          severity: "medium",
          title: { en: "Include used where a projection was enough", ar: "استخدام Include حيث كان projection كافياً" },
          bad: "var orders = await db.Orders\n    .Include(o => o.Customer)   // pulls all 22 customer columns\n    .Include(o => o.Lines)      // pulls every line row\n    .Take(50)\n    .ToListAsync();\nreturn orders.Select(o => new OrderRow(o.Number, o.Customer.Name, o.Lines.Count));",
          good: "return await db.Orders\n    .AsNoTracking()\n    .Take(50)\n    .Select(o => new OrderRow(o.Number, o.Customer.Name, o.Lines.Count()))\n    .ToListAsync();",
          why: {
            en: "The bad version is correct — no N+1 — but wasteful. It loads full Customer rows and every OrderLine row just to read one name and one number, then tracks all of it in the change tracker. The projection reads three values per order and tracks nothing. Measured on a real table this was 40 MB versus 90 KB returned, and 180 ms versus 12 ms.",
            ar: "النسخة السيئة صحيحة — لا يوجد N+1 — لكنها مهدِرة. تحمّل صفوف Customer كاملة وكل صفوف OrderLine لمجرّد قراءة اسم واحد ورقم واحد، ثم تتتبّع كل ذلك في change tracker. أما الـ projection فيقرأ ثلاث قيم لكل order ولا يتتبّع شيئاً. القياس على جدول حقيقي أعطى 40 MB مقابل 90 KB من البيانات المعادة، و180 ms مقابل 12 ms."
          }
        }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        {
          t: "p",
          en: "N+1 is a system design problem, not only a code problem, because it turns one user request into many database requests. A service that holds a pool of 100 database connections and does 101 queries per request can serve roughly one request at a time per connection burst. The database becomes the bottleneck long before CPU does, and adding application servers makes it worse — more servers means more concurrent tiny queries hitting the same database.",
          ar: "الـ N+1 مشكلة تصميم نظام لا مشكلة كود فقط، لأنه يحوّل طلب مستخدم واحد إلى طلبات كثيرة لقاعدة البيانات. خدمة لديها pool من 100 connection وتنفّذ 101 استعلاماً لكل request تستطيع خدمة طلب واحد تقريباً في كل دفعة. تصبح قاعدة البيانات هي عنق الزجاجة قبل الـ CPU بكثير، وإضافة application servers تزيد الأمر سوءاً — خوادم أكثر تعني استعلامات صغيرة متزامنة أكثر على نفس قاعدة البيانات."
        },
        {
          t: "ul",
          en: [
            "List and search endpoints: any paginated screen is N+1's natural home, because the page size directly sets N.",
            "GraphQL and similar flexible query APIs: each nested field a client asks for can become its own resolver query, so a single client request can produce thousands. This is why DataLoader-style batching exists.",
            "Report and export jobs: a nightly export over 200,000 rows with one lookup per row is 200,000 queries — the job runs for hours and holds locks the whole time.",
            "Background message consumers: processing a batch of 500 messages and loading a related aggregate per message will saturate the connection pool and starve the live web traffic sharing that database."
          ],
          ar: [
            "endpoints القوائم والبحث: أي شاشة مقسّمة إلى صفحات هي البيئة الطبيعية للـ N+1، لأن حجم الصفحة يحدّد N مباشرة.",
            "GraphQL وواجهات الاستعلام المرنة المشابهة: كل حقل متداخل يطلبه العميل قد يصبح استعلام resolver خاصاً به، فينتج عن طلب واحد آلاف الاستعلامات. لهذا وُجدت آلية التجميع بأسلوب DataLoader.",
            "مهام التقارير والتصدير: تصدير ليلي على 200,000 صف مع lookup لكل صف يعني 200,000 استعلام — تعمل المهمة ساعات وتحتجز locks طوال الوقت.",
            "مستهلكو الرسائل في الخلفية: معالجة دفعة من 500 رسالة مع تحميل aggregate مرتبط لكل رسالة تُشبع connection pool وتُجوّع ترافيك الويب الحي الذي يشارك نفس قاعدة البيانات."
          ]
        },
        {
          t: "callout",
          kind: "warn",
          en: "When a service is behind a read replica, N+1 can also break correctness expectations. Each of the 101 queries may land on a different replica with slightly different lag, so the customer name you read can be newer or older than the order row it belongs to.",
          ar: "عندما تكون الخدمة خلف read replica، قد يكسر الـ N+1 توقّعات الصحة أيضاً. كل استعلام من الـ 101 قد يصل إلى replica مختلفة بتأخير مختلف قليلاً، فيكون اسم الـ customer الذي تقرأه أحدث أو أقدم من صف الـ order الذي ينتمي إليه."
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
              k: { en: "Latency", ar: "Latency" },
              v: {
                en: "Each extra round trip adds roughly 6 ms in a normal cloud setup. 100 extra queries is 600 ms added to every request, and it is serial — the loop waits for each one.",
                ar: "كل رحلة إضافية تضيف حوالي 6 ms في بيئة سحابية عادية. مئة استعلام إضافي تعني 600 ms تُضاف لكل request، وهي متسلسلة — الـ loop ينتظر كل واحد منها."
              }
            },
            {
              k: { en: "Database", ar: "Database" },
              v: {
                en: "101 plan-cache lookups, 101 connection checkouts and 101 log entries instead of one. The queries are individually cheap, which is why they hide in slow-query logs that filter on duration.",
                ar: "101 بحث في plan cache و101 سحب connection و101 سطر log بدل واحد. كل استعلام رخيص بمفرده، ولهذا يختبئ في slow-query logs التي تفلتر حسب المدة."
              }
            },
            {
              k: { en: "Memory", ar: "Memory" },
              v: {
                en: "Loading full entities to read two fields is the main waste. 50 orders with all lines tracked can be 40 MB per request; the equivalent projection is about 90 KB.",
                ar: "تحميل entities كاملة لقراءة حقلين هو الهدر الأساسي. خمسون order مع كل الـ lines متتبَّعة قد تبلغ 40 MB لكل request؛ بينما الـ projection المكافئ حوالي 90 KB."
              }
            },
            {
              k: { en: "Scalability", ar: "Scalability" },
              v: {
                en: "The connection pool is the hard ceiling. At 101 queries per request, 100 concurrent users need far more pool slots than exist, so requests queue and p99 latency climbs steeply while CPU stays low.",
                ar: "الـ connection pool هو السقف الصلب. عند 101 استعلام لكل request، يحتاج 100 مستخدم متزامن عدد slots أكبر بكثير من المتاح، فتصطف الطلبات ويرتفع p99 latency بحدّة بينما يبقى الـ CPU منخفضاً."
              }
            },
            {
              k: { en: "CPU", ar: "CPU" },
              v: {
                en: "Secondary but real: EF materialises and change-tracks every loaded entity. Tracking 50 orders plus 4000 lines means 4050 snapshot copies; AsNoTracking removes that work entirely for read paths.",
                ar: "ثانوي لكنه حقيقي: يقوم EF بعمل materialisation و change tracking لكل entity محمّل. تتبّع 50 order مع 4000 line يعني 4050 نسخة snapshot؛ واستخدام AsNoTracking يزيل هذا العمل تماماً في مسارات القراءة."
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
            "EF command logging: add .LogTo(Console.WriteLine, new[] { DbLoggerCategory.Database.Command.Name }, LogLevel.Information) to your DbContext options. Look for a run of near-identical SELECT statements where only the parameter value changes — that repeated shape is N+1.",
            "A DbCommandInterceptor counting commands: override ReaderExecutedAsync, increment a counter held in a scoped service, and log the total at the end of each request. Look for any request whose count is larger than about five.",
            "SQL Server Extended Events or Profiler, filtered on your application name: look for hundreds of executions of the same statement text within one second — high execution count with tiny duration each is the fingerprint.",
            "OpenTelemetry traces with the EF Core instrumentation enabled: open one slow request and look for a long ladder of short database spans stacked inside a single HTTP span, instead of one or two wide ones.",
            "MiniProfiler in a development build: it prints the query count and the duplicate-query warning directly on the page, so you see the number without reading any log."
          ],
          ar: [
            "EF command logging: أضف ‎.LogTo(Console.WriteLine, new[] { DbLoggerCategory.Database.Command.Name }, LogLevel.Information)‎ إلى خيارات الـ DbContext. ابحث عن سلسلة جمل SELECT شبه متطابقة لا تتغيّر فيها إلا قيمة الـ parameter — هذا الشكل المتكرّر هو N+1.",
            "DbCommandInterceptor يعدّ الأوامر: أعد تعريف ReaderExecutedAsync، وزد عدّاداً في خدمة scoped، وسجّل المجموع في نهاية كل request. ابحث عن أي request عدده أكبر من خمسة تقريباً.",
            "SQL Server Extended Events أو Profiler مع فلترة على اسم تطبيقك: ابحث عن مئات التنفيذات لنفس نص الجملة خلال ثانية واحدة — عدد تنفيذ عالٍ مع مدة ضئيلة لكل واحدة هي البصمة.",
            "OpenTelemetry traces مع تفعيل instrumentation الخاص بـ EF Core: افتح request بطيئاً وابحث عن سلّم طويل من database spans القصيرة داخل HTTP span واحد، بدل span أو اثنين عريضين.",
            "MiniProfiler في نسخة التطوير: يطبع عدد الاستعلامات وتحذير الاستعلامات المكرّرة على الصفحة مباشرة، فترى الرقم دون قراءة أي log."
          ]
        },
        {
          t: "callout",
          kind: "tip",
          en: "The fastest confirmation takes one minute: call the endpoint with page size 10, then with page size 100, and compare response times. If the time grows roughly ten times while the response body stays a similar size, it is N+1 and not slow SQL.",
          ar: "أسرع تأكيد يستغرق دقيقة واحدة: نادِ الـ endpoint بحجم صفحة 10، ثم بحجم صفحة 100، وقارن أزمنة الاستجابة. إذا تضاعف الزمن نحو عشر مرات بينما بقي حجم الرد متقارباً، فالمشكلة N+1 وليست SQL بطيئاً."
        }
      ]
    },
    {
      key: "realworld",
      blocks: [
        {
          t: "p",
          en: "N+1 is one of the most common causes of an application that is fast in staging and slow on launch day. It usually surfaces as a support ticket about one specific page, not as a database alert, because each individual query looks healthy. Teams find it when traffic or data grows past the point where the extra round trips fit inside the latency budget.",
          ar: "الـ N+1 من أكثر أسباب تطبيق سريع في staging وبطيء يوم الإطلاق. يظهر عادة كتذكرة دعم عن صفحة واحدة بعينها، لا كتنبيه من قاعدة البيانات، لأن كل استعلام منفرد يبدو سليماً. تكتشفه الفرق عندما ينمو الترافيك أو البيانات إلى حدّ لم تعد فيه الرحلات الإضافية تتّسع داخل ميزانية زمن الاستجابة."
        },
        {
          t: "ul",
          en: [
            "E-commerce catalogues: a product list page showing each item's category name and review count — two navigation properties per row, so a 60-item grid becomes 121 queries and the page takes over a second.",
            "Admin and back-office tools: grids showing 200 rows with a status label resolved per row. Nobody load-tests internal tools, so these run for years at 4 seconds a page until someone finally measures.",
            "Reporting and data export jobs: a CSV export that enriches each row with a lookup runs one query per row. At 200,000 rows the job takes six hours instead of four minutes.",
            "Multi-tenant SaaS dashboards: a summary widget that loads each tenant's counts separately. It is fine for the first hundred tenants and falls over silently once onboarding passes a few thousand."
          ],
          ar: [
            "كتالوجات التجارة الإلكترونية: صفحة قائمة منتجات تعرض اسم الفئة وعدد المراجعات لكل عنصر — اثنان من navigation properties لكل صف، فتصبح شبكة من 60 عنصراً 121 استعلاماً وتستغرق الصفحة أكثر من ثانية.",
            "أدوات الإدارة والـ back-office: جداول تعرض 200 صف مع تسمية حالة تُحلّ لكل صف. لا أحد يختبر حمل الأدوات الداخلية، فتظل تعمل سنوات بأربع ثوانٍ للصفحة حتى يقيسها أحد أخيراً.",
            "مهام التقارير وتصدير البيانات: تصدير CSV يُثري كل صف بـ lookup فيشغّل استعلاماً لكل صف. عند 200,000 صف تستغرق المهمة ست ساعات بدل أربع دقائق.",
            "لوحات SaaS متعدّدة المستأجرين: widget ملخّص يحمّل أعداد كل tenant بشكل منفصل. يعمل جيداً لأول مئة tenant وينهار بصمت بعد تجاوز بضعة آلاف."
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
          en: "Build the Orders/Customers/OrderLines tables with 50 orders and 10 lines each. Write the loop version from this lesson with EF command logging turned on. Count the SELECT statements in the console. You are done when you can point at exactly 101 statements and say which line of C# caused each group.",
          ar: "أنشئ جداول Orders و Customers و OrderLines مع 50 order وعشرة lines لكل واحد. اكتب نسخة الـ loop من هذا الدرس مع تفعيل EF command logging. عُدّ جمل SELECT في الـ console. تكون قد أنجزت عندما تستطيع الإشارة إلى 101 جملة بالضبط وتحديد أي سطر C# سبّب كل مجموعة."
        },
        {
          t: "ex",
          diff: "medium",
          en: "Rewrite the same endpoint three ways: with Include, with a Select projection, and with two manual queries joined in memory by customer id. Measure response time and returned bytes for each. You are done when you have a three-row table of numbers and can explain why the projection wins on both.",
          ar: "أعد كتابة نفس الـ endpoint بثلاث طرق: باستخدام Include، وباستخدام Select projection، وباستعلامين يدويين يُدمجان في الذاكرة عبر customer id. قِس زمن الاستجابة وحجم البيانات المعادة لكل طريقة. تكون قد أنجزت عندما يكون لديك جدول من ثلاثة صفوف من الأرقام وتستطيع شرح سبب تفوّق الـ projection في الاثنين."
        },
        {
          t: "ex",
          diff: "hard",
          en: "Add Include for two collections (Lines and Tags) on the same query and log the row count the database returns. Then add AsSplitQuery and log it again. You are done when you can state the exact row count for both, show the multiplication that produces the first number, and say at which collection size split queries become the better choice.",
          ar: "أضف Include لمجموعتين (Lines و Tags) على نفس الاستعلام وسجّل عدد الصفوف التي تعيدها قاعدة البيانات. ثم أضف AsSplitQuery وسجّل العدد مرة أخرى. تكون قد أنجزت عندما تستطيع ذكر عدد الصفوف بالضبط في الحالتين، وإظهار عملية الضرب التي تنتج الرقم الأول، وتحديد حجم الـ collection الذي تصبح عنده الاستعلامات المنفصلة الخيار الأفضل."
        },
        {
          t: "ex",
          diff: "senior",
          en: "Write a DbCommandInterceptor that counts executed commands per request scope, and an integration test helper that fails any test whose request exceeds a configured limit. Apply it to three existing endpoints. You are done when the helper catches at least one real N+1 you did not know about, and when re-introducing the loop version breaks the build.",
          ar: "اكتب DbCommandInterceptor يعدّ الأوامر المنفَّذة لكل request scope، و helper لاختبارات التكامل يُفشل أي اختبار يتجاوز طلبه حداً مضبوطاً. طبّقه على ثلاثة endpoints موجودة. تكون قد أنجزت عندما يلتقط الـ helper حالة N+1 حقيقية واحدة على الأقل لم تكن تعرف بها، وعندما تؤدي إعادة إدخال نسخة الـ loop إلى كسر الـ build."
        }
      ]
    },
    {
      key: "refs",
      blocks: [
        {
          t: "ref",
          label: { en: "EF Core — Eager loading of related data (Include, ThenInclude, filtered include)", ar: "EF Core — التحميل المبكر للبيانات المرتبطة (Include و ThenInclude و filtered include)" },
          url: "https://learn.microsoft.com/en-us/ef/core/querying/related-data/eager",
          meta: { en: "Docs", ar: "توثيق" }
        },
        {
          t: "ref",
          label: { en: "EF Core — Single vs split queries and cartesian explosion", ar: "EF Core — الاستعلام الواحد مقابل المنفصل والـ cartesian explosion" },
          url: "https://learn.microsoft.com/en-us/ef/core/querying/single-split-queries",
          meta: { en: "Docs", ar: "توثيق" }
        },
        {
          t: "ref",
          label: { en: "EF Core — Efficient querying (projections, tracking, round trips)", ar: "EF Core — الاستعلام الفعّال (projections والتتبّع والرحلات)" },
          url: "https://learn.microsoft.com/en-us/ef/core/performance/efficient-querying",
          meta: { en: "Docs", ar: "توثيق" }
        },
        {
          t: "ref",
          label: { en: "EF Core — Lazy loading of related data, and why proxies fire queries", ar: "EF Core — التحميل الكسول للبيانات المرتبطة، ولماذا تطلق الـ proxies استعلامات" },
          url: "https://learn.microsoft.com/en-us/ef/core/querying/related-data/lazy",
          meta: { en: "Docs", ar: "توثيق" }
        }
      ]
    }
  ],
  quiz: [
    {
      q: {
        en: "You load 50 orders with ToListAsync, then loop and read o.Customer.Name with lazy loading enabled. How many queries run in total?",
        ar: "تحمّل 50 order عبر ToListAsync ثم تعمل loop وتقرأ o.Customer.Name مع تفعيل lazy loading. كم استعلاماً يُنفَّذ في المجموع؟"
      },
      options: [
        { en: "1 — EF batches the customer reads automatically", ar: "1 — يجمّع EF قراءات الـ customer تلقائياً" },
        { en: "2 — one for orders, one for all customers", ar: "2 — واحد للـ orders وواحد لكل الـ customers" },
        { en: "51 — one for orders, one per order for the customer", ar: "51 — واحد للـ orders وواحد لكل order لجلب الـ customer" },
        { en: "50 — one per order only", ar: "50 — واحد لكل order فقط" }
      ],
      correct: 2,
      why: {
        en: "The list query is one. Each o.Customer access on a proxy runs its own SELECT because the customer is not yet in the change tracker, so 50 more. That is the N+1 shape: 50 + 1 = 51.",
        ar: "استعلام القائمة واحد. وكل وصول إلى o.Customer على الـ proxy يشغّل SELECT خاصاً به لأن الـ customer ليس في change tracker بعد، أي 50 استعلاماً إضافياً. هذا هو شكل N+1: ‎50 + 1 = 51‎."
      }
    },
    {
      q: {
        en: "Why does o.Lines.Count() inside a Select behave differently from o.Lines.Count after loading?",
        ar: "لماذا يختلف سلوك o.Lines.Count() داخل Select عن o.Lines.Count بعد التحميل؟"
      },
      options: [
        { en: "They are identical; the parentheses are only style", ar: "متطابقان؛ الأقواس مسألة أسلوب فقط" },
        { en: "Count() in a projection is translated to SQL, while Count on a loaded collection needs every row in memory first", ar: "الـ Count() داخل projection يُترجَم إلى SQL، بينما Count على collection محمّلة يحتاج كل الصفوف في الذاكرة أولاً" },
        { en: "Count() is slower because it opens a second connection", ar: "الـ Count() أبطأ لأنه يفتح connection ثانياً" },
        { en: "Count on a collection is translated to SQL, Count() is not", ar: "الـ Count على collection يُترجَم إلى SQL، و Count() لا يُترجَم" }
      ],
      correct: 1,
      why: {
        en: "Inside a projection EF turns Count() into a COUNT(*) subquery, so only a number crosses the network. The property version requires the collection to be materialised, so every line row is fetched just to be counted.",
        ar: "داخل الـ projection يحوّل EF جملة Count() إلى subquery فيها COUNT(*)، فلا يعبر الشبكة سوى رقم. أما نسخة الخاصية فتتطلّب materialisation للـ collection، فتُجلب كل صفوف الـ lines لمجرّد عدّها."
      }
    },
    {
      q: {
        en: "A query has Include(o => o.Lines) and Include(o => o.Tags) in one statement. Each order has 10 lines and 3 tags. How many rows come back per order?",
        ar: "استعلام فيه Include(o => o.Lines) و Include(o => o.Tags) في جملة واحدة. كل order فيه 10 lines و3 tags. كم صفاً يعود لكل order؟"
      },
      options: [
        { en: "13 — the two collections are appended", ar: "13 — تُضاف المجموعتان إلى بعضهما" },
        { en: "10 — the larger collection wins", ar: "10 — المجموعة الأكبر هي الحاسمة" },
        { en: "1 — EF flattens it into a single row", ar: "1 — يسطّح EF النتيجة إلى صف واحد" },
        { en: "30 — every line is paired with every tag", ar: "30 — كل line يُقرن بكل tag" }
      ],
      correct: 3,
      why: {
        en: "Joining two collections in one SQL statement produces the cross product, 10 x 3 = 30 rows, with the order's own columns repeated 30 times. AsSplitQuery avoids this by running one query per collection.",
        ar: "ربط مجموعتين في جملة SQL واحدة ينتج الجداء الديكارتي، ‎10 × 3 = 30‎ صفاً، مع تكرار أعمدة الـ order نفسها 30 مرة. ويتجنّب AsSplitQuery ذلك بتشغيل استعلام لكل collection."
      }
    },
    {
      q: {
        en: "Which observation most reliably identifies N+1 rather than a slow query?",
        ar: "أي ملاحظة تحدّد N+1 بشكل موثوق أكثر بدل استعلام بطيء؟"
      },
      options: [
        { en: "Database CPU is pinned at 100%", ar: "الـ CPU في قاعدة البيانات ثابت عند 100%" },
        { en: "Response time scales with row count while returned data stays about the same size", ar: "زمن الاستجابة يتناسب مع عدد الصفوف بينما يبقى حجم البيانات المعادة متقارباً" },
        { en: "One statement appears in the slow-query log", ar: "تظهر جملة واحدة في slow-query log" },
        { en: "The endpoint is slower on the first call after a deploy", ar: "الـ endpoint أبطأ في أول استدعاء بعد النشر" }
      ],
      correct: 1,
      why: {
        en: "N+1 costs scale with the number of rows, not the amount of data. Individual queries stay fast, so they never appear in duration-filtered slow-query logs — the ten-versus-hundred page-size comparison is the reliable test.",
        ar: "تكلفة N+1 تتناسب مع عدد الصفوف لا مع حجم البيانات. تبقى الاستعلامات المنفردة سريعة، فلا تظهر في slow-query logs المفلترة حسب المدة — والمقارنة بين حجم صفحة 10 و100 هي الاختبار الموثوق."
      }
    },
    {
      q: {
        en: "A query is written as db.Orders.Include(o => o.Customer).Select(o => new { o.Number }). What does EF load?",
        ar: "استعلام مكتوب هكذا: db.Orders.Include(o => o.Customer).Select(o => new { o.Number }). ماذا يحمّل EF؟"
      },
      options: [
        { en: "Only the Number column — the Include is ignored because the projection decides the shape", ar: "عمود Number فقط — يُتجاهل الـ Include لأن الـ projection يحدّد الشكل" },
        { en: "Number plus all Customer columns", ar: "Number مع كل أعمدة الـ Customer" },
        { en: "Nothing — this combination throws at runtime", ar: "لا شيء — هذه التركيبة ترمي استثناءً وقت التشغيل" },
        { en: "Full Order entities with Customer attached", ar: "entities كاملة من Order مع Customer مرفق" }
      ],
      correct: 0,
      why: {
        en: "When a query ends in a projection, the projection alone determines what is fetched, and any earlier Include is dropped. This surprises people who add Include to fix N+1 without noticing a Select further down the chain.",
        ar: "عندما ينتهي الاستعلام بـ projection، فإن الـ projection وحده يحدّد ما يُجلَب، ويُسقَط أي Include سابق. وهذا يفاجئ من يضيف Include لمعالجة N+1 دون أن ينتبه لوجود Select لاحق في السلسلة."
      }
    }
  ]
};
```

NEXT: ef-split
