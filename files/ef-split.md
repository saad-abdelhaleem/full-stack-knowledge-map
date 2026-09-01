```js
const efSplitLesson = {
  id: "ef-split",
  moduleId: "efcore",
  title: { en: "Split queries and projections", ar: "الاستعلامات المنفصلة والـ projections" },
  summary: {
    en: "Loading two child collections in one SQL query multiplies rows; split queries and Select projections are the two ways out.",
    ar: "تحميل مجموعتين من الأبناء في استعلام SQL واحد يضاعف عدد الصفوف؛ الـ split queries و الـ Select projections هما المخرجان."
  },
  mins: 14,
  sections: [
    { key: "why", blocks: [
      { t: "p",
        en: "When you ask EF Core to load one row plus two of its child lists in a single SQL query, the database has to put all of it in one flat result. It does that by pairing every child of the first list with every child of the second. The row count multiplies, and the same parent data is repeated in every row. Split queries and projections are the two fixes: send more than one query, or ask for fewer columns.",
        ar: "عندما تطلب من EF Core تحميل صف واحد مع قائمتين من أبنائه في استعلام SQL واحد، على الـ database أن تضع كل ذلك في نتيجة مسطّحة واحدة. تفعل ذلك بمزاوجة كل ابن من القائمة الأولى مع كل ابن من القائمة الثانية. عدد الصفوف يتضاعف، وبيانات الأب نفسها تتكرر في كل صف. الحل طريقان: إرسال أكثر من استعلام، أو طلب أعمدة أقل."
      },
      { t: "kv", rows: [
        { k: { en: "Collection navigation", ar: "Collection navigation" },
          v: { en: "A property on an entity that holds a list of related entities, like Order.Lines. A reference navigation holds a single one, like Order.Customer.", ar: "خاصية على الـ entity تحمل قائمة من entities مرتبطة، مثل Order.Lines. أما reference navigation فتحمل واحداً فقط، مثل Order.Customer." } },
        { k: { en: "Include / eager loading", ar: "Include / eager loading" },
          v: { en: "Telling EF to fetch a navigation together with the parent, in the same trip, instead of later.", ar: "إخبار EF بجلب الـ navigation مع الأب في نفس الرحلة بدلاً من جلبها لاحقاً." } },
        { k: { en: "Cartesian explosion", ar: "Cartesian explosion" },
          v: { en: "The row blow-up you get when one query joins two independent child lists: rows = children in list A × children in list B.", ar: "انفجار الصفوف الذي يحدث عندما يضم استعلام واحد قائمتَي أبناء مستقلتين: الصفوف = أبناء القائمة A × أبناء القائمة B." } },
        { k: { en: "Split query", ar: "Split query" },
          v: { en: "EF sends one SQL query per collection instead of one big joined query, then stitches the results together in memory.", ar: "يرسل EF استعلام SQL لكل مجموعة بدل استعلام واحد كبير بـ joins، ثم يجمّع النتائج في الذاكرة." } },
        { k: { en: "Projection", ar: "Projection" },
          v: { en: "A Select that builds a new shape (usually a DTO) instead of returning full entities, so only the columns you named are read.", ar: "استعلام Select يبني شكلاً جديداً (عادة DTO) بدل إرجاع entities كاملة، فتُقرأ الأعمدة التي سمّيتها فقط." } },
        { k: { en: "DTO", ar: "DTO" },
          v: { en: "Data Transfer Object — a small plain class that carries exactly the fields one screen or endpoint needs.", ar: "Data Transfer Object — كلاس بسيط صغير يحمل بالضبط الحقول التي تحتاجها شاشة أو endpoint واحد." } }
      ]},
      { t: "p",
        en: "Here is the running example for this whole lesson: an endpoint GET /api/orders/{id} that returns one order with its lines and its payments. A real order in this system has 50 lines and 20 payments. The natural EF code Includes both lists. That should return 71 things: 1 order, 50 lines, 20 payments. Instead the database returns 1,000 rows — 50 × 20 — and the order's own columns are copied into every one of them.",
        ar: "هذا هو المثال الذي سنستخدمه طوال الدرس: endpoint اسمه GET /api/orders/{id} يعيد order واحداً مع lines و payments الخاصة به. الـ order الحقيقي في هذا النظام فيه 50 line و 20 payment. الكود الطبيعي في EF يعمل Include للقائمتين. المفروض أن يعيد 71 عنصراً: order واحد و50 line و20 payment. لكن الـ database تعيد 1,000 صف — 50 × 20 — وأعمدة الـ order نفسه منسوخة في كل صف منها."
      },
      { t: "p",
        en: "The everyday analogy: you ask a shop for a list of your purchases and a list of your payments, and you insist on one sheet of paper. The clerk cannot put two separate lists side by side on one sheet without inventing pairs, so they write every purchase next to every payment. You get 1,000 lines describing 70 facts. Asking for two sheets — one query per list — is the split query. Asking only for the item names and amounts instead of the full records is the projection.",
        ar: "التشبيه اليومي: تطلب من متجر قائمة مشترياتك وقائمة مدفوعاتك، وتصرّ على ورقة واحدة. الموظف لا يستطيع وضع قائمتين منفصلتين جنباً إلى جنب في ورقة واحدة دون اختراع أزواج، فيكتب كل عملية شراء بجانب كل عملية دفع. تحصل على 1,000 سطر تصف 70 معلومة. طلب ورقتين — استعلام لكل قائمة — هو الـ split query. وطلب أسماء الأصناف والمبالغ فقط بدل السجلات الكاملة هو الـ projection."
      },
      { t: "callout", kind: "note",
        en: "This is a different problem from N+1. N+1 is one query per parent row and grows with the number of parents. Cartesian explosion is a single query whose row count grows with the product of the child lists.",
        ar: "هذه مشكلة مختلفة عن N+1. الـ N+1 هو استعلام لكل صف أب ويكبر بعدد الآباء. أما الـ cartesian explosion فهو استعلام واحد يكبر عدد صفوفه بحاصل ضرب قوائم الأبناء."
      }
    ]},

    { key: "problem", blocks: [
      { t: "p",
        en: "The code that causes it looks completely reasonable. Two Include calls, one query, no loop. Nothing in the C# hints that the result set is about to multiply.",
        ar: "الكود الذي يسبب المشكلة يبدو معقولاً تماماً. استدعاءان لـ Include، استعلام واحد، بلا loop. لا شيء في الـ C# يلمّح إلى أن مجموعة النتائج على وشك أن تتضاعف."
      },
      { t: "code", lang: "csharp",
        label: { en: "The innocent-looking query", ar: "الاستعلام الذي يبدو بريئاً" },
        code: "var order = await db.Orders\n    .Include(o => o.Lines)      // 50 rows\n    .Include(o => o.Payments)   // 20 rows\n    .FirstOrDefaultAsync(o => o.Id == id);\n\n// Expected from the database: 71 rows.\n// Actually returned:          1,000 rows (50 x 20)."
      },
      { t: "p",
        en: "SQL Server does exactly what it was asked. It joins Orders to OrderLines, then joins that to Payments. Because a line and a payment have no relationship to each other, every line is matched with every payment. Each of the 1,000 rows also carries all the Order columns and all the OrderLine columns again.",
        ar: "SQL Server ينفّذ ما طُلب منه بالضبط. يعمل join بين Orders و OrderLines، ثم join لتلك النتيجة مع Payments. ولأن الـ line والـ payment لا علاقة بينهما، يُقابَل كل line بكل payment. وكل صف من الـ 1,000 صف يحمل أيضاً كل أعمدة الـ Order وكل أعمدة الـ OrderLine مرة أخرى."
      },
      { t: "kv", rows: [
        { k: { en: "Rows on the wire", ar: "الصفوف على الشبكة" },
          v: { en: "1,000 instead of 71 — 14 times more rows for the same information.", ar: "1,000 بدل 71 — أربعة عشر ضعف الصفوف لنفس المعلومة." } },
        { k: { en: "Bytes read from SQL", ar: "البايتات المقروءة من SQL" },
          v: { en: "About 1.2 MB instead of about 40 KB, because wide parent columns repeat in every row.", ar: "حوالي 1.2 ميغابايت بدل حوالي 40 كيلوبايت، لأن أعمدة الأب العريضة تتكرر في كل صف." } },
        { k: { en: "Endpoint p99", ar: "p99 للـ endpoint" },
          v: { en: "Went from 40 ms to 310 ms — meaning the slowest 1 request in 100 took 310 ms.", ar: "ارتفع من 40 ms إلى 310 ms — أي أن أبطأ طلب من كل 100 طلب استغرق 310 ms." } },
        { k: { en: "Where the time goes", ar: "أين يذهب الوقت" },
          v: { en: "Not the query plan. It is reading 1,000 rows over the network and materialising them into objects.", ar: "ليس في خطة الاستعلام. الوقت يذهب في قراءة 1,000 صف عبر الشبكة وتحويلها إلى كائنات." } }
      ]},
      { t: "p",
        en: "Two things make this worse in production than in a demo. First, it scales with data: an order with 200 lines and 100 payments returns 20,000 rows, and the growth is multiplication, not addition. Second, the returned object graph is correct — EF removes the duplicates when it builds the objects — so tests pass and nobody notices until the table is big.",
        ar: "أمران يجعلان هذا أسوأ في الإنتاج منه في التجربة. الأول: أنه يتوسّع مع البيانات؛ order فيه 200 line و100 payment يعيد 20,000 صف، والنمو ضرب لا جمع. الثاني: أن شجرة الكائنات الناتجة صحيحة — إذ يحذف EF التكرار عند بناء الكائنات — فتنجح الاختبارات ولا ينتبه أحد حتى يكبر الجدول."
      }
    ]},

    { key: "internals", blocks: [
      { t: "p",
        en: "Trace one request through EF Core to see where the rows come from. EF turns your LINQ into a query tree, decides how many SQL statements to send, sends them, then builds objects from the rows that come back. The number of SQL statements is the whole subject of this lesson.",
        ar: "تتبّع طلباً واحداً داخل EF Core لترى من أين تأتي الصفوف. يحوّل EF كود الـ LINQ إلى شجرة استعلام، ثم يقرر كم جملة SQL سيرسل، ثم يرسلها، ثم يبني الكائنات من الصفوف العائدة. عدد جمل الـ SQL هو موضوع هذا الدرس كله."
      },
      { t: "kv", rows: [
        { k: { en: "Query pipeline", ar: "Query pipeline" },
          v: { en: "The stage that turns your LINQ expression into SQL text. It decides single vs split here.", ar: "المرحلة التي تحوّل تعبير الـ LINQ إلى نص SQL. القرار بين single و split يُتخذ هنا." } },
        { k: { en: "Materialiser", ar: "Materialiser" },
          v: { en: "The generated code that reads the DbDataReader row by row and creates entity instances.", ar: "الكود المولَّد الذي يقرأ الـ DbDataReader صفاً صفاً وينشئ نسخ الـ entities." } },
        { k: { en: "Identity map", ar: "Identity map" },
          v: { en: "A dictionary of primary key to already-created instance, so the same key never becomes two objects.", ar: "قاموس من المفتاح الأساسي إلى النسخة المُنشأة مسبقاً، حتى لا يصير المفتاح الواحد كائنين." } },
        { k: { en: "Round trip", ar: "Round trip" },
          v: { en: "One network journey to the database and back. Its cost is fixed latency, paid per query.", ar: "رحلة شبكة واحدة إلى الـ database والعودة. تكلفتها زمن ثابت يُدفع لكل استعلام." } }
      ]},
      { t: "p",
        en: "In single-query mode, EF emits one SELECT with a LEFT JOIN per collection. All 1,000 rows arrive on one reader. The materialiser reads row 1, sees order 7, creates it, and puts it in the identity map. It then reads the line columns, sees line 1, creates it and attaches it. It reads the payment columns, sees payment 1, attaches it. On row 2 it sees order 7 again in the identity map and reuses the existing object, sees line 1 again and skips it, and only payment 2 is new. So 930 of the 1,000 rows are discarded after being parsed. The object graph is right; the work was wasted.",
        ar: "في وضع single query يُصدر EF جملة SELECT واحدة فيها LEFT JOIN لكل مجموعة. تصل الصفوف الألف كلها على reader واحد. يقرأ الـ materialiser الصف الأول، يرى order رقم 7، ينشئه ويضعه في الـ identity map. ثم يقرأ أعمدة الـ line، يرى line رقم 1، ينشئه ويربطه. ثم يقرأ أعمدة الـ payment، يرى payment رقم 1، يربطه. في الصف الثاني يجد order 7 موجوداً في الـ identity map فيعيد استخدام الكائن نفسه، ويجد line 1 مكرراً فيتجاهله، والجديد فقط هو payment 2. أي أن 930 صفاً من الألف تُهمَل بعد تحليلها. النتيجة صحيحة لكن العمل ضاع."
      },
      { t: "p",
        en: "Calling AsSplitQuery changes the plan. EF sends one SELECT for the order, one for its lines, one for its payments — three round trips instead of one. Each child query repeats the same WHERE filter as the parent and adds ORDER BY on the parent key columns. The ordering is not decoration: EF walks the child readers in the same key order as the parents so it can attach each child to the right parent without holding everything in a dictionary.",
        ar: "استدعاء AsSplitQuery يغيّر الخطة. يرسل EF جملة SELECT للـ order، وأخرى لـ lines، وأخرى لـ payments — ثلاث round trips بدل واحدة. كل استعلام أبناء يكرر نفس شرط الـ WHERE الخاص بالأب ويضيف ORDER BY على أعمدة مفتاح الأب. هذا الترتيب ليس زينة: يمرّ EF على readers الأبناء بنفس ترتيب مفاتيح الآباء ليربط كل ابن بأبيه الصحيح دون الاحتفاظ بكل شيء في قاموس."
      },
      { t: "code", lang: "sql",
        label: { en: "One query vs three (shortened)", ar: "استعلام واحد مقابل ثلاثة (مختصر)" },
        code: "-- SINGLE QUERY: 1,000 rows, Order columns repeated 1,000 times\nSELECT o.*, l.*, p.*\nFROM Orders o\nLEFT JOIN OrderLines l ON l.OrderId = o.Id\nLEFT JOIN Payments   p ON p.OrderId = o.Id\nWHERE o.Id = @id;\n\n-- SPLIT QUERY: three statements, 1 + 50 + 20 = 71 rows total\nSELECT TOP(1) o.* FROM Orders o WHERE o.Id = @id;\n\nSELECT l.* FROM OrderLines l\nINNER JOIN (SELECT TOP(1) o.Id FROM Orders o WHERE o.Id = @id) t ON l.OrderId = t.Id\nORDER BY t.Id;\n\nSELECT p.* FROM Payments p\nINNER JOIN (SELECT TOP(1) o.Id FROM Orders o WHERE o.Id = @id) t ON p.OrderId = t.Id\nORDER BY t.Id;"
      },
      { t: "p",
        en: "The projection route removes the problem from a different direction. A Select that names specific fields makes EF read only those columns and skip the change tracker entirely, because the result is a plain object EF has no reason to track. You still get one SQL statement, but the repeated columns are narrow ones — an integer and a decimal per row instead of every column of Orders. Projecting a child list inside the Select is also allowed, and EF applies the same single-vs-split rule to it.",
        ar: "طريق الـ projection يزيل المشكلة من اتجاه آخر. جملة Select تسمّي حقولاً محددة تجعل EF يقرأ تلك الأعمدة فقط ويتجاوز الـ change tracker تماماً، لأن الناتج كائن عادي لا سبب لتتبّعه. تبقى جملة SQL واحدة، لكن الأعمدة المكررة تصبح ضيّقة — عدد صحيح ورقم عشري لكل صف بدل كل أعمدة Orders. ويُسمح أيضاً بعمل projection لقائمة أبناء داخل الـ Select، ويطبّق EF عليها نفس قاعدة single مقابل split."
      },
      { t: "code", lang: "csharp",
        label: { en: "The two fixes", ar: "الحلّان" },
        code: "// Fix 1 — split query: same entities, three cheap queries.\nvar order = await db.Orders\n    .Include(o => o.Lines)\n    .Include(o => o.Payments)\n    .AsSplitQuery()\n    .FirstOrDefaultAsync(o => o.Id == id);\n\n// Fix 2 — projection: one query, only the columns the screen shows.\nvar dto = await db.Orders\n    .Where(o => o.Id == id)\n    .Select(o => new OrderDto(\n        o.Id,\n        o.PlacedAtUtc,\n        o.Lines.Select(l => new LineDto(l.Sku, l.Qty, l.UnitPrice)).ToList(),\n        o.Payments.Select(p => new PaymentDto(p.Method, p.Amount)).ToList()))\n    .AsSplitQuery()\n    .FirstOrDefaultAsync();\n\n// Make split the default for the whole app, opt out per query with AsSingleQuery().\nservices.AddDbContext<AppDb>(o => o.UseSqlServer(cs,\n    sql => sql.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery)));"
      },
      { t: "p",
        en: "One mechanism you must know before you turn split queries on everywhere: the three statements are separate. By default they are not wrapped in a transaction, so another user can insert a payment in the gap between statement two and statement three. You then return an order whose lines are from 10:00:00.100 and whose payments are from 10:00:00.140. A single query cannot show that skew; a split query can.",
        ar: "آلية واحدة يجب أن تعرفها قبل تفعيل الـ split queries في كل مكان: الجُمل الثلاث منفصلة. افتراضياً لا تُلف في transaction، فيستطيع مستخدم آخر إدراج payment في الفجوة بين الجملة الثانية والثالثة. عندها تعيد order أسطره من اللحظة 10:00:00.100 ومدفوعاته من اللحظة 10:00:00.140. الاستعلام الواحد لا يمكن أن يُظهر هذا التفاوت، أما الـ split query فيمكن."
      }
    ]},

    { key: "tradeoffs", blocks: [
      { t: "tradeoff",
        pros: {
          en: [
            "Row count becomes a sum (1 + 50 + 20) instead of a product (50 x 20).",
            "Parent columns are sent once per parent, not once per combination.",
            "Memory use during materialisation drops with the row count.",
            "One line of code, no change to the returned object graph."
          ],
          ar: [
            "عدد الصفوف يصبح جمعاً (1 + 50 + 20) بدل ضرب (50 × 20).",
            "أعمدة الأب تُرسل مرة لكل أب، لا مرة لكل تركيبة.",
            "استهلاك الذاكرة أثناء بناء الكائنات ينخفض مع انخفاض عدد الصفوف.",
            "سطر واحد من الكود، ولا تغيير في شجرة الكائنات العائدة."
          ]
        },
        cons: {
          en: [
            "One network round trip per collection instead of one in total.",
            "No transaction by default, so the collections can be from different moments.",
            "Each child query re-runs the parent's filter, so an expensive WHERE is paid again.",
            "Harder to read in a SQL trace: one logical read is now several statements."
          ],
          ar: [
            "round trip شبكية لكل مجموعة بدل واحدة إجمالاً.",
            "لا transaction افتراضياً، فقد تأتي المجموعات من لحظات مختلفة.",
            "كل استعلام أبناء يعيد تنفيذ شرط الأب، فالـ WHERE المكلف يُدفع ثمنه مجدداً.",
            "أصعب في القراءة داخل SQL trace: قراءة منطقية واحدة صارت عدة جُمل."
          ]
        },
        limits: {
          en: [
            "Only helps when two or more collections load at the same level.",
            "Useless for a single collection — one Include never explodes.",
            "Does not reduce the number of columns; a wide entity is still wide.",
            "EF Core 5.0 and later only."
          ],
          ar: [
            "ينفع فقط عند تحميل مجموعتين أو أكثر على نفس المستوى.",
            "بلا فائدة مع مجموعة واحدة — Include واحد لا ينفجر أبداً.",
            "لا يقلّل عدد الأعمدة؛ الـ entity العريض يبقى عريضاً.",
            "متاح في EF Core 5.0 فما فوق فقط."
          ]
        },
        alts: {
          en: [
            "Select projection to a DTO: fewer columns and no tracking, best for read endpoints.",
            "Two separate LINQ queries you write and combine yourself.",
            "Paginate the big child list instead of loading all of it.",
            "A raw SQL or Dapper query for one hot read path."
          ],
          ar: [
            "Select projection إلى DTO: أعمدة أقل وبلا tracking، الأنسب لـ endpoints القراءة.",
            "استعلاما LINQ منفصلان تكتبهما وتدمج نتيجتهما بنفسك.",
            "ترقيم صفحات للقائمة الكبيرة بدل تحميلها كاملة.",
            "استعلام SQL خام أو Dapper لمسار قراءة واحد ساخن."
          ]
        }
      }
    ]},

    { key: "mistakes", blocks: [
      { t: "mistake",
        title: { en: "Adding a second Include and never rechecking the SQL", ar: "إضافة Include ثانٍ دون مراجعة الـ SQL" },
        body: {
          en: "A developer added .Include(o => o.Payments) to an existing query that already had .Include(o => o.Lines). The endpoint had been stable for a year. After deploy, p95 latency on GET /api/orders/{id} went from 55 ms to 480 ms — the slowest 5 requests in 100 now took nearly half a second. Nothing else changed. The second Include turned 51 rows into 1,000 because every line was now paired with every payment.",
          ar: "أضاف مطوّر ‎.Include(o => o.Payments)‎ إلى استعلام كان فيه ‎.Include(o => o.Lines)‎ أصلاً. كان الـ endpoint مستقراً لسنة. بعد النشر ارتفع زمن p95 لـ GET /api/orders/{id} من 55 ms إلى 480 ms — أي أن أبطأ 5 طلبات من كل 100 صارت تقارب نصف ثانية. لم يتغيّر شيء آخر. الـ Include الثاني حوّل 51 صفاً إلى 1,000 لأن كل line صار مقترناً بكل payment."
        },
        fix: ".Include(o => o.Lines)\n.Include(o => o.Payments)\n.AsSplitQuery()"
      },
      { t: "mistake",
        title: { en: "Turning split query on globally for a chatty database", ar: "تفعيل split query عالمياً مع database بعيدة" },
        body: {
          en: "A team set UseQuerySplittingBehavior(SplitQuery) for the whole application. Local tests were fine because the database was on the same machine. In production the database was in another availability zone with 4 ms round trip time. A page that loaded a customer with four collections now paid five round trips instead of one — 20 ms of pure network latency added to every call, on queries that returned 30 rows and never needed splitting.",
          ar: "فعّل فريق ‎UseQuerySplittingBehavior(SplitQuery)‎ للتطبيق كله. نجحت الاختبارات محلياً لأن الـ database على نفس الجهاز. في الإنتاج كانت الـ database في availability zone أخرى بزمن round trip يبلغ 4 ms. صفحة تحمّل customer مع أربع مجموعات صارت تدفع خمس round trips بدل واحدة — 20 ms زمن شبكة صافٍ يُضاف إلى كل نداء، على استعلامات تعيد 30 صفاً ولم تحتج تقسيماً أصلاً."
        },
        fix: "// keep single as the default, split the few queries that need it\n.AsSplitQuery()   // per query\n// or, if global split is on:\n.AsSingleQuery()  // opt this query back out"
      },
      { t: "mistake",
        title: { en: "Split query on a financial read that must be consistent", ar: "split query على قراءة مالية يجب أن تكون متسقة" },
        body: {
          en: "A balance screen loaded an account with its charges and its credits using AsSplitQuery. Under load, a payment landed between the charges query and the credits query. The screen showed a charge that the just-recorded credit had already covered, and the displayed balance was wrong by that amount. It reproduced roughly once in 5,000 page loads, which is often enough to matter and rare enough to look like a ghost. The fix wraps the read in a snapshot-isolation transaction — a mode where every statement inside it sees the database exactly as it was when the transaction started.",
          ar: "شاشة رصيد كانت تحمّل account مع charges و credits باستخدام AsSplitQuery. تحت الحمل وصل payment بين استعلام الـ charges واستعلام الـ credits. أظهرت الشاشة charge كان الـ credit المسجَّل للتو قد غطّاه، فظهر الرصيد خاطئاً بذلك المبلغ. تكرّر الأمر مرة تقريباً كل 5,000 تحميل للصفحة، وهو معدّل يكفي ليضر ويندر بما يكفي ليبدو كشبح. الحل هو لفّ القراءة في transaction بعزل snapshot — وهو وضع ترى فيه كل جملة داخله الـ database كما كانت لحظة بدء الـ transaction بالضبط."
        },
        fix: "using var tx = await db.Database.BeginTransactionAsync(\n    System.Data.IsolationLevel.Snapshot);\nvar acct = await db.Accounts\n    .Include(a => a.Charges).Include(a => a.Credits)\n    .AsSplitQuery().FirstAsync(a => a.Id == id);\nawait tx.CommitAsync();"
      },
      { t: "mistake",
        title: { en: "Splitting instead of projecting on a read-only endpoint", ar: "التقسيم بدل الـ projection في endpoint للقراءة فقط" },
        body: {
          en: "A report endpoint returned 200 orders with lines and payments, each entity having about 40 columns. AsSplitQuery fixed the row explosion, so the team stopped there. The endpoint still moved 18 MB per call and spent 300 ms in the change tracker building and snapshotting entities that were serialised to JSON and thrown away. A Select projection to a DTO with 6 fields cut the payload to 900 KB and the time to 45 ms.",
          ar: "endpoint تقارير كان يعيد 200 order مع lines و payments، وكل entity فيه نحو 40 عموداً. أصلح AsSplitQuery انفجار الصفوف، فتوقف الفريق عند ذلك. ظل الـ endpoint ينقل 18 ميغابايت لكل نداء ويقضي 300 ms في الـ change tracker وهو يبني ويصوّر entities تُحوَّل إلى JSON ثم تُرمى. أدّى Select projection إلى DTO بستة حقول إلى خفض الحمولة إلى 900 كيلوبايت والزمن إلى 45 ms."
        },
        fix: ".AsNoTracking()\n.Select(o => new OrderRowDto(o.Id, o.PlacedAtUtc, o.Total))"
      }
    ]},

    { key: "interview", blocks: [
      { t: "qa", level: "junior",
        q: { en: "What does AsSplitQuery do?", ar: "ماذا يفعل AsSplitQuery؟" },
        a: {
          en: "It tells EF Core to load each included collection with its own SQL query instead of joining them all into one. So an order with lines and payments becomes three queries instead of one. You get the same objects back; only the number of database trips changes.",
          ar: "يخبر EF Core أن يحمّل كل مجموعة مضمّنة باستعلام SQL خاص بها بدل ضمّها كلها في استعلام واحد. فـ order مع lines و payments يصبح ثلاثة استعلامات بدل واحد. تحصل على نفس الكائنات؛ ما يتغيّر هو عدد الرحلات إلى الـ database فقط."
        }
      },
      { t: "qa", level: "mid",
        q: { en: "Why do two Includes multiply rows instead of adding them?", ar: "لماذا يضاعف Include-ان عدد الصفوف بدل أن يجمعاها؟" },
        a: {
          en: "Because SQL returns one flat table. The lines and the payments are two independent lists hanging off the same order, and there is no way to place them side by side in one result without pairing them. The join pairs every line with every payment, so you get lines times payments rows, each repeating the order's columns.",
          ar: "لأن SQL يعيد جدولاً مسطّحاً واحداً. الـ lines والـ payments قائمتان مستقلتان معلّقتان بنفس الـ order، ولا سبيل لوضعهما جنباً إلى جنب في نتيجة واحدة دون مزاوجتهما. الـ join يزاوج كل line مع كل payment، فتحصل على عدد صفوف يساوي lines × payments، كل منها يكرر أعمدة الـ order."
        }
      },
      { t: "qa", level: "mid",
        q: { en: "When would you choose a projection over a split query?", ar: "متى تختار projection بدل split query؟" },
        a: {
          en: "Whenever the path is read-only and I know exactly which fields the caller needs. A projection wins twice: it reads fewer columns and it skips change tracking, because a DTO is not an entity. I keep split queries for cases where I actually need tracked entities — usually a write path that loads an aggregate before modifying it.",
          ar: "كلما كان المسار للقراءة فقط وأعرف بالضبط الحقول التي يحتاجها المستدعي. الـ projection يربح مرتين: يقرأ أعمدة أقل ويتجاوز الـ change tracking، لأن الـ DTO ليس entity. وأبقي الـ split queries للحالات التي أحتاج فيها entities متتبَّعة فعلاً — عادة مسار كتابة يحمّل aggregate قبل تعديله."
        }
      },
      { t: "qa", level: "senior",
        q: { en: "What is the correctness cost of split queries?", ar: "ما تكلفة الصحّة في الـ split queries؟" },
        a: {
          en: "The queries run at different moments and, by default, outside a transaction. Another writer can commit between them, so the parent and the two collections can each reflect a different point in time. For most screens nobody notices. For anything where the collections must add up — balances, stock counts, audit views — I wrap the read in a snapshot transaction so all three statements see one consistent version of the data.",
          ar: "الاستعلامات تُنفَّذ في لحظات مختلفة، وافتراضياً خارج transaction. يستطيع كاتب آخر أن يعمل commit بينها، فيعكس الأب وكل مجموعة نقطة زمنية مختلفة. في معظم الشاشات لا ينتبه أحد. أما فيما يجب أن تتوازن فيه المجموعات — أرصدة، جرد مخزون، شاشات تدقيق — فألفّ القراءة في transaction بمستوى snapshot حتى ترى الجُمل الثلاث نسخة واحدة متسقة من البيانات."
        }
      },
      { t: "qa", level: "senior",
        q: { en: "Would you enable split queries globally? Defend the answer.", ar: "هل تفعّل الـ split queries عالمياً؟ دافع عن إجابتك." },
        a: {
          en: "Usually no. Global split trades a row problem you have on a few queries for a latency cost on every query, and that cost is proportional to how far the database is. If most of my Includes are single collections, splitting them buys nothing and costs a round trip each. I would rather enable the EF warning for multiple collection includes, treat it as an error in CI, and add AsSplitQuery deliberately where the log shows it is needed.",
          ar: "عادةً لا. التفعيل العالمي يقايض مشكلة صفوف في بضعة استعلامات بتكلفة زمن على كل استعلام، وهذه التكلفة تتناسب مع بُعد الـ database. إذا كانت معظم Includes عندي لمجموعة واحدة، فالتقسيم لا يفيد ويكلّف round trip لكل منها. أفضّل تفعيل تحذير EF الخاص بتعدد الـ collection includes، واعتباره خطأً في الـ CI، ثم إضافة AsSplitQuery عن قصد حيث يُظهر الـ log الحاجة."
        }
      },
      { t: "qa", level: "staff",
        q: { en: "How do you stop this class of bug from reappearing across many teams?", ar: "كيف تمنع هذا النوع من الأخطاء من التكرار عبر فرق كثيرة؟" },
        a: {
          en: "I make it visible rather than relying on people to remember. Three moves. First, configure the multiple-collection-include warning to throw in development and test builds, so the query fails loudly at the moment someone writes it. Second, put a per-request query log with row counts in the local dev experience, so a 1,000-row read is obvious before review. Third, set a team convention that read endpoints return DTOs, which removes the whole category by default and makes any raw-entity read a deliberate, reviewable choice.",
          ar: "أجعل المشكلة مرئية بدل الاعتماد على ذاكرة الناس. ثلاث خطوات. الأولى: ضبط تحذير تعدد الـ collection includes ليُلقي استثناءً في بيئتَي التطوير والاختبار، فيفشل الاستعلام بصوت عالٍ لحظة كتابته. الثانية: إظهار سجل استعلامات لكل طلب مع عدد الصفوف في بيئة المطوّر، فتصبح قراءة بألف صف واضحة قبل المراجعة. الثالثة: وضع عرف للفريق بأن endpoints القراءة تعيد DTOs، وهذا يلغي الصنف كله افتراضياً ويجعل أي قراءة بـ entities خاماً قراراً مقصوداً وقابلاً للمراجعة."
        }
      }
    ]},

    { key: "codereview", blocks: [
      { t: "review", severity: "high",
        title: { en: "Two collection Includes in one query", ar: "Include لمجموعتين في استعلام واحد" },
        bad: "var order = await db.Orders\n    .Include(o => o.Lines)\n    .Include(o => o.Payments)\n    .FirstOrDefaultAsync(o => o.Id == id);",
        good: "var order = await db.Orders\n    .Include(o => o.Lines)\n    .Include(o => o.Payments)\n    .AsSplitQuery()\n    .FirstOrDefaultAsync(o => o.Id == id);",
        why: {
          en: "Two collections at the same level make the database pair every child of one list with every child of the other. With 50 lines and 20 payments that is 1,000 rows carrying 71 facts. AsSplitQuery sends three small queries instead and returns exactly the same object. Flag this every time you see a second collection Include with no AsSplitQuery next to it.",
          ar: "مجموعتان على نفس المستوى تجعلان الـ database تزاوج كل ابن من قائمة مع كل ابن من الأخرى. مع 50 line و20 payment تصير 1,000 صف تحمل 71 معلومة. AsSplitQuery يرسل ثلاثة استعلامات صغيرة بدلاً منها ويعيد نفس الكائن تماماً. نبّه على هذا كلما رأيت Include ثانياً لمجموعة بلا AsSplitQuery بجانبه."
        }
      },
      { t: "review", severity: "medium",
        title: { en: "Loading full entities to build a response DTO", ar: "تحميل entities كاملة لبناء DTO للاستجابة" },
        bad: "var orders = await db.Orders\n    .Include(o => o.Lines)\n    .Where(o => o.CustomerId == customerId)\n    .ToListAsync();\n\nreturn orders.Select(o => new OrderSummary(\n    o.Id, o.PlacedAtUtc, o.Lines.Sum(l => l.Qty)));",
        good: "return await db.Orders\n    .Where(o => o.CustomerId == customerId)\n    .Select(o => new OrderSummary(\n        o.Id, o.PlacedAtUtc, o.Lines.Sum(l => l.Qty)))\n    .ToListAsync();",
        why: {
          en: "The bad version reads every column of every order and every line, tracks all of them, and then throws almost all of it away in memory. The good version pushes the Sum into SQL, reads three values per order, and returns objects the change tracker ignores. Same result, a fraction of the columns and none of the tracking work.",
          ar: "النسخة السيئة تقرأ كل أعمدة كل order وكل line، وتتتبّعها جميعاً، ثم ترمي أغلبها في الذاكرة. النسخة الجيدة تدفع الـ Sum إلى SQL، وتقرأ ثلاث قيم لكل order، وتعيد كائنات يتجاهلها الـ change tracker. نفس النتيجة، بجزء بسيط من الأعمدة وبلا أي عمل تتبّع."
        }
      }
    ]},

    { key: "sysdesign", blocks: [
      { t: "p",
        en: "In a typical order service this decision is made per endpoint, not per application. The write path — POST /api/orders/{id}/cancel — loads the order aggregate (the order plus everything that must change with it) with tracked entities so SaveChanges can detect what changed; that path benefits from AsSplitQuery when it needs more than one collection. The read path — GET /api/orders?customerId= — feeds a screen and should project straight to DTOs, which sidesteps the whole problem and keeps payloads small.",
        ar: "في خدمة orders نموذجية يُتخذ هذا القرار لكل endpoint، لا لكل تطبيق. مسار الكتابة — POST /api/orders/{id}/cancel — يحمّل الـ aggregate (الـ order وكل ما يجب أن يتغيّر معه) بـ entities متتبَّعة ليكتشف SaveChanges ما تغيّر؛ وهذا المسار يستفيد من AsSplitQuery عند حاجته لأكثر من مجموعة. أما مسار القراءة — GET /api/orders?customerId= — فيغذّي شاشة ويجب أن يعمل projection مباشرة إلى DTOs، وهذا يتفادى المشكلة كلها ويبقي الحمولات صغيرة."
      },
      { t: "ul",
        en: [
          "Read endpoints return DTOs by default; returning entities is the exception that needs a reason.",
          "Write paths load tracked aggregates, and add AsSplitQuery only when two or more collections are included.",
          "Keep the global splitting behaviour at SingleQuery and opt in per query, unless your database is on the same host.",
          "Anywhere the collections must be mutually consistent, wrap the read in a snapshot-isolation transaction.",
          "Never load an unbounded child collection for a screen; page it or aggregate it in SQL."
        ],
        ar: [
          "endpoints القراءة تعيد DTOs افتراضياً؛ وإعادة entities هي الاستثناء الذي يحتاج مبرراً.",
          "مسارات الكتابة تحمّل aggregates متتبَّعة، وتضيف AsSplitQuery فقط عند تضمين مجموعتين أو أكثر.",
          "أبقِ سلوك التقسيم العام على SingleQuery واختر التقسيم لكل استعلام على حدة، إلا إذا كانت الـ database على نفس الخادم.",
          "حيثما وجب أن تكون المجموعات متسقة فيما بينها، لُفّ القراءة في transaction بعزل snapshot.",
          "لا تحمّل أبداً مجموعة أبناء غير محدودة لأجل شاشة؛ قسّمها إلى صفحات أو اجمعها في SQL."
        ]
      },
      { t: "callout", kind: "tip",
        en: "A useful rule for design reviews: count the collection navigations in the query. Zero or one means single query is fine. Two or more means either split it or project it — never leave it as is.",
        ar: "قاعدة مفيدة في مراجعات التصميم: عُدّ الـ collection navigations في الاستعلام. صفر أو واحدة تعني أن الاستعلام الواحد مناسب. اثنتان أو أكثر تعني إما التقسيم أو الـ projection — ولا تتركه كما هو أبداً."
      }
    ]},

    { key: "perf", blocks: [
      { t: "kv", rows: [
        { k: { en: "Network", ar: "الشبكة" },
          v: { en: "Single query moves rows = product of collections; split moves the sum. In the example, 1.2 MB versus 40 KB per call. Split adds one round trip per collection, so its cost is round-trip time times the number of collections.", ar: "الاستعلام الواحد ينقل صفوفاً = حاصل ضرب المجموعات؛ والمقسّم ينقل المجموع. في مثالنا 1.2 ميغابايت مقابل 40 كيلوبايت لكل نداء. والتقسيم يضيف round trip لكل مجموعة، فتكلفته = زمن الـ round trip × عدد المجموعات." } },
        { k: { en: "Memory", ar: "الذاكرة" },
          v: { en: "Every returned row is parsed into strings and values before duplicates are dropped, so a 1,000-row read allocates for 1,000 rows even though 70 survive. Fewer rows means less garbage and shorter GC pauses.", ar: "كل صف عائد يُحلَّل إلى نصوص وقيم قبل حذف التكرار، فقراءة بألف صف تحجز ذاكرة لألف صف رغم بقاء 70 فقط. صفوف أقل تعني قمامة أقل وتوقفات GC أقصر." } },
        { k: { en: "Database", ar: "الـ database" },
          v: { en: "Split runs the parent's WHERE once per statement. If that filter is a cheap primary-key lookup this is free; if it is an expensive scan you pay for it three times.", ar: "التقسيم ينفّذ شرط WHERE الخاص بالأب مرة لكل جملة. إن كان الشرط بحثاً رخيصاً بالمفتاح الأساسي فهو مجاني؛ وإن كان مسحاً مكلفاً فستدفع ثمنه ثلاث مرات." } },
        { k: { en: "CPU", ar: "المعالج" },
          v: { en: "Materialising and change-tracking dominate here, not SQL execution. A projection removes both: no tracking snapshot and far fewer columns to convert.", ar: "بناء الكائنات والـ change tracking هما ما يستهلك المعالج هنا، لا تنفيذ الـ SQL. الـ projection يزيل الاثنين: لا لقطة تتبّع، وأعمدة أقل بكثير لتحويلها." } },
        { k: { en: "Scalability", ar: "قابلية التوسّع" },
          v: { en: "Cartesian growth is multiplicative, so a good customer with more data is the one who breaks the endpoint. That makes the failure grow with success.", ar: "النمو الديكارتي ضربي، فالعميل الجيد صاحب البيانات الأكثر هو من يكسر الـ endpoint. أي أن العطل يكبر مع النجاح." } }
      ]}
    ]},

    { key: "debug", blocks: [
      { t: "ul",
        en: [
          "Turn on EF's SQL logging with LogTo(Console.WriteLine) — look at how many SELECT statements one call emits, and whether one of them joins two child tables.",
          "Enable EnableSensitiveDataLogging in development only — it shows parameter values so you can replay the exact statement in SSMS.",
          "Run the generated SQL in SQL Server Management Studio and read the row count in the results tab — if it is far above the number of entities you expect, that is the explosion.",
          "Configure the MultipleCollectionIncludeWarning to throw: ConfigureWarnings(w => w.Throw(CoreEventId.MultipleCollectionIncludeWarning)) — the query then fails at development time instead of degrading in production.",
          "Watch the Microsoft.EntityFrameworkCore counters, or the timing spans your monitoring tool records per request, for rows read per call — a jump in rows while query time stays flat points at materialisation, not at the plan."
        ],
        ar: [
          "فعّل تسجيل SQL في EF عبر LogTo(Console.WriteLine) — وانظر كم جملة SELECT يصدرها نداء واحد، وهل فيها جملة تضم جدولَي أبناء.",
          "فعّل EnableSensitiveDataLogging في بيئة التطوير فقط — يُظهر قيم الـ parameters فتستطيع إعادة تشغيل الجملة نفسها في SSMS.",
          "شغّل الـ SQL المولَّد في SQL Server Management Studio واقرأ عدد الصفوف في تبويب النتائج — إن كان أكبر بكثير من عدد الـ entities المتوقع فهذا هو الانفجار.",
          "اضبط MultipleCollectionIncludeWarning ليُلقي استثناءً: ConfigureWarnings(w => w.Throw(CoreEventId.MultipleCollectionIncludeWarning)) — فيفشل الاستعلام وقت التطوير بدل أن يتدهور في الإنتاج.",
          "راقب عدّادات Microsoft.EntityFrameworkCore، أو الفترات الزمنية التي تسجّلها أداة المراقبة لكل طلب، لعدد الصفوف المقروءة في كل نداء — قفزة في الصفوف مع ثبات زمن الاستعلام تشير إلى بناء الكائنات لا إلى الخطة."
        ]
      },
      { t: "callout", kind: "tip",
        en: "The fastest check needs no tools: multiply the sizes of the child collections in your head. Two collections of 50 and 20 means 1,000 rows. If that number is much larger than the number of objects you expect back, you have found the bug.",
        ar: "أسرع فحص لا يحتاج أدوات: اضرب أحجام مجموعات الأبناء ذهنياً. مجموعتان بحجم 50 و20 تعني 1,000 صف. إذا كان هذا الرقم أكبر بكثير من عدد الكائنات التي تتوقع عودتها، فقد وجدت الخطأ."
      }
    ]},

    { key: "realworld", blocks: [
      { t: "p",
        en: "This bug shows up wherever one record owns several independent lists, which is most business software. It stays invisible during development because test data is small, and it appears in production on the biggest and most valuable records — the customer with the longest history, the order with the most amendments.",
        ar: "يظهر هذا الخطأ حيثما يملك سجل واحد عدة قوائم مستقلة، وهذا حال معظم برمجيات الأعمال. يبقى غير مرئي أثناء التطوير لأن بيانات الاختبار صغيرة، ويظهر في الإنتاج على أكبر السجلات وأثمنها — العميل صاحب أطول تاريخ، والـ order صاحب أكثر التعديلات."
      },
      { t: "ul",
        en: [
          "E-commerce order pages: an order owns lines, payments, shipments and status history — four lists that multiply together into hundreds of thousands of rows.",
          "Insurance and claims systems: a policy owns coverages, documents and endorsements, and the oldest policies are the ones that time out.",
          "Ticketing and support tools: a ticket owns comments, attachments and audit events, so the busiest ticket is the slowest to open.",
          "Reporting and export endpoints: they read many parents with many children, so they are the first place a projection pays for itself."
        ],
        ar: [
          "صفحات الـ orders في التجارة الإلكترونية: الـ order يملك lines و payments و shipments وسجل الحالات — أربع قوائم تتضاعف معاً إلى مئات آلاف الصفوف.",
          "أنظمة التأمين والمطالبات: الـ policy يملك coverages و documents و endorsements، وأقدم الوثائق هي التي تنتهي مهلتها.",
          "أدوات التذاكر والدعم: التذكرة تملك comments و attachments و audit events، فأكثر التذاكر نشاطاً هي أبطؤها فتحاً.",
          "endpoints التقارير والتصدير: تقرأ آباءً كثيرين بأبناء كثيرين، فهي أول مكان يردّ فيه الـ projection تكلفته."
        ]
      }
    ]},

    { key: "exercises", blocks: [
      { t: "ex", diff: "easy",
        en: "Seed one order with 50 lines and 20 payments. Write the query with both Includes, enable LogTo, and count the rows the database returns. You are right when the log shows one SELECT and the result has 1,000 rows for 71 entities.",
        ar: "أنشئ order واحداً بـ 50 line و20 payment. اكتب الاستعلام بالـ Include-ين، فعّل LogTo، وعُدّ الصفوف التي تعيدها الـ database. تكون على صواب حين يُظهر الـ log جملة SELECT واحدة ونتيجة فيها 1,000 صف مقابل 71 entity."
      },
      { t: "ex", diff: "medium",
        en: "Add AsSplitQuery to the same query and rerun it. You are right when the log shows three SELECT statements totalling 71 rows, and an equality check confirms the returned object graph is identical to the single-query version.",
        ar: "أضف AsSplitQuery إلى نفس الاستعلام وأعد تشغيله. تكون على صواب حين يُظهر الـ log ثلاث جمل SELECT مجموعها 71 صفاً، ويؤكد فحص تطابق أن شجرة الكائنات العائدة مطابقة لنسخة الاستعلام الواحد."
      },
      { t: "ex", diff: "hard",
        en: "Rewrite the endpoint as a Select projection into an OrderDto with only Id, PlacedAtUtc, line SKU/qty and payment method/amount. Measure both versions with a stopwatch over 200 calls. You are right when the projection reads fewer columns in the SQL log and no entity appears in db.ChangeTracker.Entries().",
        ar: "أعد كتابة الـ endpoint كـ Select projection إلى OrderDto يحوي فقط Id و PlacedAtUtc و SKU/qty للـ lines و method/amount للـ payments. قِس النسختين بـ stopwatch على 200 نداء. تكون على صواب حين يقرأ الـ projection أعمدة أقل في سجل الـ SQL ولا يظهر أي entity في db.ChangeTracker.Entries()."
      },
      { t: "ex", diff: "senior",
        en: "Prove the consistency gap. Run the split query in a loop while a second process inserts payments continuously, and assert that the sum of payments matches the order total. You are right when you can make the assertion fail without a transaction, and make it pass by wrapping the read in a snapshot-isolation transaction.",
        ar: "أثبت فجوة الاتساق. شغّل الـ split query في حلقة بينما تُدرِج عملية ثانية payments باستمرار، وتحقّق أن مجموع المدفوعات يطابق إجمالي الـ order. تكون على صواب حين تستطيع إفشال التحقق بلا transaction، وإنجاحه بلفّ القراءة في transaction بعزل snapshot."
      }
    ]},

    { key: "refs", blocks: [
      { t: "ref",
        label: { en: "EF Core: single vs split queries", ar: "EF Core: single مقابل split queries" },
        url: "https://learn.microsoft.com/en-us/ef/core/querying/single-split-queries",
        meta: { en: "Docs", ar: "توثيق" }
      },
      { t: "ref",
        label: { en: "EF Core: efficient querying", ar: "EF Core: الاستعلام الفعّال" },
        url: "https://learn.microsoft.com/en-us/ef/core/performance/efficient-querying",
        meta: { en: "Docs", ar: "توثيق" }
      },
      { t: "ref",
        label: { en: "EF Core: loading related data", ar: "EF Core: تحميل البيانات المرتبطة" },
        url: "https://learn.microsoft.com/en-us/ef/core/querying/related-data/",
        meta: { en: "Docs", ar: "توثيق" }
      },
      { t: "ref",
        label: { en: "Entity Framework Core in Action (Jon P Smith)", ar: "Entity Framework Core in Action (Jon P Smith)" },
        url: "https://www.manning.com/books/entity-framework-core-in-action-second-edition",
        meta: { en: "Book", ar: "كتاب" }
      }
    ]}
  ],
  quiz: [
    {
      q: {
        en: "An order has 40 lines and 15 payments. How many rows does a single query with both Includes return?",
        ar: "order فيه 40 line و15 payment. كم صفاً يعيد استعلام واحد فيه الـ Include-ان؟"
      },
      options: [
        { en: "55", ar: "55" },
        { en: "56", ar: "56" },
        { en: "600", ar: "600" },
        { en: "601", ar: "601" }
      ],
      correct: 2,
      why: {
        en: "The join pairs every line with every payment, so the row count is 40 x 15 = 600, not 40 + 15. That is the cartesian explosion.",
        ar: "الـ join يزاوج كل line مع كل payment، فعدد الصفوف 40 × 15 = 600، لا 40 + 15. هذا هو الـ cartesian explosion."
      }
    },
    {
      q: {
        en: "What is the main risk of AsSplitQuery that a single query does not have?",
        ar: "ما الخطر الأساسي في AsSplitQuery والذي لا يوجد في الاستعلام الواحد؟"
      },
      options: [
        { en: "It returns a different object graph than the single query", ar: "يعيد شجرة كائنات مختلفة عن الاستعلام الواحد" },
        { en: "The collections can come from different points in time unless you use a transaction", ar: "قد تأتي المجموعات من نقاط زمنية مختلفة ما لم تستخدم transaction" },
        { en: "It disables change tracking on the loaded entities", ar: "يعطّل الـ change tracking على الـ entities المحمّلة" },
        { en: "It stops EF from translating the WHERE clause to SQL", ar: "يمنع EF من ترجمة شرط WHERE إلى SQL" }
      ],
      correct: 1,
      why: {
        en: "The statements run separately and, by default, outside a transaction, so a writer can commit between them. The object graph and tracking behaviour are unchanged.",
        ar: "الجُمل تُنفَّذ منفصلة وافتراضياً خارج transaction، فيمكن لكاتب أن يعمل commit بينها. أما شجرة الكائنات وسلوك التتبّع فلا يتغيران."
      }
    },
    {
      q: {
        en: "Which query benefits least from AsSplitQuery?",
        ar: "أي استعلام يستفيد أقل ما يمكن من AsSplitQuery؟"
      },
      options: [
        { en: "One Include of a single collection", ar: "Include واحد لمجموعة واحدة" },
        { en: "Two collection Includes at the same level", ar: "Include-ان لمجموعتين على نفس المستوى" },
        { en: "Three collection Includes on a large parent", ar: "ثلاثة Includes لمجموعات على أب كبير" },
        { en: "Two collections plus a nested ThenInclude collection", ar: "مجموعتان مع ThenInclude لمجموعة متداخلة" }
      ],
      correct: 0,
      why: {
        en: "With one collection there is nothing to multiply against, so the single query already returns the minimum rows. Splitting only adds a round trip.",
        ar: "مع مجموعة واحدة لا يوجد ما تُضرب فيه، فالاستعلام الواحد يعيد أصلاً الحد الأدنى من الصفوف. والتقسيم يضيف round trip فقط."
      }
    },
    {
      q: {
        en: "Why does a Select projection to a DTO usually beat AsSplitQuery on a read-only endpoint?",
        ar: "لماذا يتفوّق Select projection إلى DTO عادةً على AsSplitQuery في endpoint للقراءة فقط؟"
      },
      options: [
        { en: "It always sends fewer SQL statements", ar: "يرسل دائماً جمل SQL أقل" },
        { en: "It reads only the named columns and skips change tracking", ar: "يقرأ الأعمدة المسمّاة فقط ويتجاوز الـ change tracking" },
        { en: "It runs inside a transaction automatically", ar: "يعمل داخل transaction تلقائياً" },
        { en: "It removes the need for indexes on the child tables", ar: "يلغي الحاجة إلى فهارس على جداول الأبناء" }
      ],
      correct: 1,
      why: {
        en: "A projection returns plain objects, so EF reads fewer columns and does not snapshot anything for the change tracker. The number of statements can still be one or several.",
        ar: "الـ projection يعيد كائنات عادية، فيقرأ EF أعمدة أقل ولا يأخذ لقطة لأي شيء للـ change tracker. أما عدد الجُمل فقد يبقى واحداً أو أكثر."
      }
    },
    {
      q: {
        en: "Why does EF add an ORDER BY on the parent key columns in a split query?",
        ar: "لماذا يضيف EF جملة ORDER BY على أعمدة مفتاح الأب في الـ split query؟"
      },
      options: [
        { en: "To make the API response sorted for the client", ar: "ليجعل استجابة الـ API مرتّبة للعميل" },
        { en: "To let the database reuse the cached plan", ar: "ليتيح للـ database إعادة استخدام الخطة المخزّنة" },
        { en: "So it can walk parents and children in the same key order and attach each child correctly", ar: "ليتمكن من المرور على الآباء والأبناء بنفس ترتيب المفاتيح وربط كل ابن بشكل صحيح" },
        { en: "Because SQL Server requires ORDER BY on every JOIN", ar: "لأن SQL Server يشترط ORDER BY في كل JOIN" }
      ],
      correct: 2,
      why: {
        en: "The child rows arrive in a separate result set, so EF needs a shared order to line them up with their parents while reading. It is a correlation mechanism, not presentation.",
        ar: "صفوف الأبناء تصل في مجموعة نتائج منفصلة، فيحتاج EF ترتيباً مشتركاً ليصفّها مع آبائها أثناء القراءة. إنها آلية ربط، لا عرض."
      }
    }
  ]
};
```

NEXT: clustered
