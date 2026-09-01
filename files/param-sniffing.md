```js
const paramSniffingLesson = {
  id: "param-sniffing",
  moduleId: "sql",
  title: { en: "Parameter sniffing", ar: "الـ Parameter sniffing" },
  summary: {
    en: "SQL Server builds a query plan using the parameter values it saw the first time, then reuses that plan for every value after — which is usually a win and occasionally a production outage.",
    ar: "SQL Server يبني الـ plan للاستعلام باستخدام قيم الـ parameters التي رآها في أول تنفيذ، ثم يعيد استخدام نفس الـ plan لكل القيم بعدها — وهذا مفيد في الغالب، ويسبب أحياناً توقف الإنتاج."
  },
  mins: 14,
  sections: [
    {
      key: "why",
      blocks: [
        { t: "p",
          en: "When you run a parameterized query, SQL Server does not work out how to run it every time. It works it out once, using the actual parameter values from that first run, saves the resulting plan, and reuses it for all later runs. Looking at those first values is called parameter sniffing. It saves a lot of CPU. It also means one unlucky first run can leave every later run with a plan that does not fit its values.",
          ar: "عندما تنفّذ استعلاماً فيه parameters، SQL Server لا يحسب طريقة تنفيذه في كل مرة. يحسبها مرة واحدة باستخدام القيم الفعلية من أول تنفيذ، يحفظ الـ plan الناتج، ويعيد استخدامه في كل التنفيذات التالية. النظر إلى قيم أول تنفيذ اسمه parameter sniffing. هذا يوفّر CPU كثيراً. ويعني أيضاً أن تنفيذاً أولاً سيّئ الحظ قد يترك كل التنفيذات التالية مع plan لا يناسب قيمها." },
        { t: "kv", rows: [
          { k: { en: "Execution plan", ar: "Execution plan" },
            v: { en: "The step-by-step recipe SQL Server picks for one query: which index to use, in what order to join, whether to sort. Two plans can return the same rows and differ 1000x in speed.", ar: "الوصفة خطوة بخطوة التي يختارها SQL Server لاستعلام واحد: أي index يستخدم، بأي ترتيب يعمل الـ joins، وهل يعمل sort. اثنان من الـ plans قد يعيدان نفس الصفوف ويختلفان 1000 ضعف في السرعة." } },
          { k: { en: "Plan cache", ar: "Plan cache" },
            v: { en: "An area of SQL Server memory holding compiled plans, keyed by the text of the query. Before compiling, the engine looks here first.", ar: "منطقة في ذاكرة SQL Server تحتفظ بالـ plans المُجمّعة، مفهرسة بنص الاستعلام. قبل التجميع يبحث المحرك هنا أولاً." } },
          { k: { en: "Statistics / histogram", ar: "Statistics / histogram" },
            v: { en: "A small summary SQL Server keeps per column describing how values are spread — how many rows have each value. The histogram is the part that stores counts per value range.", ar: "ملخّص صغير يحتفظ به SQL Server لكل column يصف توزيع القيم — كم صفاً لكل قيمة. الـ histogram هو الجزء الذي يخزّن الأعداد لكل مدى قيم." } },
          { k: { en: "Cardinality estimate", ar: "Cardinality estimate" },
            v: { en: "The engine's guess at how many rows a step will produce. Every plan choice follows from this guess. A wrong guess is the root cause of nearly every bad plan.", ar: "تخمين المحرك لعدد الصفوف التي ستنتجها خطوة ما. كل قرارات الـ plan تُبنى على هذا التخمين. التخمين الخاطئ هو السبب الجذري لأغلب الـ plans السيئة." } },
          { k: { en: "Key lookup", ar: "Key lookup" },
            v: { en: "When a narrow index gives the engine a row's key but not the columns it needs, it goes back to the table for each row. Cheap for 3 rows, ruinous for 900,000.", ar: "عندما يعطي index ضيّق المحرك مفتاح الصف دون الأعمدة المطلوبة، يعود إلى الجدول لكل صف. رخيص لثلاثة صفوف، وكارثي لـ 900,000." } },
          { k: { en: "Memory grant", ar: "Memory grant" },
            v: { en: "RAM reserved for a query before it starts, sized from the row estimate, used for sorts and hash joins. Too little means spilling to disk; too much starves other queries.", ar: "ذاكرة RAM محجوزة للاستعلام قبل بدايته، حجمها مشتق من تقدير الصفوف، وتُستخدم للـ sorts والـ hash joins. القليل منها يعني spill إلى القرص، والكثير منها يجوّع باقي الاستعلامات." } }
        ]},
        { t: "p",
          en: "Think of a kitchen that sets up its whole line based on the first order of the morning. The first order is one espresso, so the kitchen puts out one small cup and one shot of coffee. That setup is fast and perfect — until a bus of two hundred people walks in and the kitchen serves them one cup at a time, because that is the setup it committed to. Parameter sniffing is the same commitment: the plan is shaped around the first customer, then handed to everyone.",
          ar: "تخيّل مطبخاً يرتّب خط عمله كله حسب أول طلب في الصباح. أول طلب هو espresso واحد، فيخرج المطبخ كوباً صغيراً وجرعة قهوة واحدة. هذا الترتيب سريع ومثالي — إلى أن يدخل باص فيه مئتا شخص فيخدمهم المطبخ كوباً واحداً في كل مرة، لأن هذا هو الترتيب الذي التزم به. الـ parameter sniffing نفس الالتزام: الـ plan يُصمَّم حول أول عميل ثم يُسلَّم للجميع." },
        { t: "p",
          en: "The feature exists because compiling a plan is expensive. Working out the best plan for a query with four joins can cost tens of milliseconds of CPU. On a procedure called 50,000 times a minute, recompiling every call would burn more CPU than running the query. So SQL Server compiles once and reuses. Sniffing the real values makes that one plan as good as possible — for the values it saw.",
          ar: "هذه الآلية موجودة لأن تجميع الـ plan مكلف. حساب أفضل plan لاستعلام فيه أربعة joins قد يكلّف عشرات الميلي ثانية من الـ CPU. في procedure تُستدعى 50,000 مرة في الدقيقة، إعادة التجميع في كل استدعاء ستستهلك CPU أكثر من تنفيذ الاستعلام نفسه. لذلك يجمّع SQL Server مرة ويعيد الاستخدام. والنظر إلى القيم الحقيقية يجعل ذلك الـ plan الوحيد أفضل ما يمكن — بالنسبة للقيم التي رآها." },
        { t: "callout", kind: "note",
          en: "Parameter sniffing is not a bug and there is no switch that makes it always right. It only hurts when your data is skewed — when some parameter values match very few rows and others match very many. On evenly spread data you will never notice it.",
          ar: "الـ parameter sniffing ليس خطأً، ولا يوجد مفتاح يجعله صحيحاً دائماً. لا يؤذي إلا عندما تكون بياناتك skewed — أي بعض قيم الـ parameters تطابق صفوفاً قليلة جداً وأخرى تطابق صفوفاً كثيرة جداً. على بيانات موزّعة بالتساوي لن تلاحظه أبداً." }
      ]
    },
    {
      key: "problem",
      blocks: [
        { t: "p",
          en: "Here is the running example for this lesson. An orders API exposes GET /orders?customerId=... and every call runs the same stored procedure. The Orders table has 40 million rows. Customer 42 is a normal shop with 3 orders. Customer 7 is a wholesale account with 900,000 orders. Same procedure, same SQL text, one cached plan for both.",
          ar: "هذا هو المثال الجاري في هذا الدرس. واجهة orders تعرض GET /orders?customerId=... وكل استدعاء ينفّذ نفس الـ stored procedure. جدول Orders فيه 40 مليون صف. العميل 42 متجر عادي لديه 3 طلبات. العميل 7 حساب جملة لديه 900,000 طلب. نفس الـ procedure، نفس نص SQL، وplan واحد مخزّن للاثنين." },
        { t: "code", lang: "sql",
          label: { en: "One procedure, two very different customers", ar: "procedure واحدة، وعميلان مختلفان تماماً" },
          code: "CREATE PROCEDURE dbo.GetOrdersByCustomer\n    @CustomerId int\nAS\nSELECT o.OrderId, o.PlacedAt, o.Status, o.TotalAmount\nFROM   dbo.Orders AS o\nWHERE  o.CustomerId = @CustomerId\nORDER  BY o.PlacedAt DESC;\nGO\n\n-- index available:\n-- CREATE NONCLUSTERED INDEX IX_Orders_CustomerId ON dbo.Orders (CustomerId);\n-- it does NOT contain PlacedAt, Status or TotalAmount, so those need a key lookup\n\nEXEC dbo.GetOrdersByCustomer @CustomerId = 42;  -- 3 rows\nEXEC dbo.GetOrdersByCustomer @CustomerId = 7;   -- 900,000 rows" },
        { t: "p",
          en: "If customer 42 runs first, SQL Server sees a value that matches 3 rows. It picks an index seek on IX_Orders_CustomerId — jumping straight to the matching entries instead of reading the whole index — plus a key lookup per row. That is the cheapest plan for 3 rows, about 2 ms. Then customer 7 arrives and reuses that plan: 900,000 key lookups, one row at a time. Measured p99 for that endpoint went from 40 ms to 8 s — meaning the slowest 1 request in 100 took eight seconds instead of forty milliseconds.",
          ar: "إذا نُفّذ العميل 42 أولاً، يرى SQL Server قيمة تطابق 3 صفوف. فيختار index seek على IX_Orders_CustomerId — أي القفز مباشرةً إلى المدخلات المطابقة بدل قراءة الـ index كله — مع key lookup لكل صف. وهذا أرخص plan لثلاثة صفوف، حوالي 2 ms. ثم يأتي العميل 7 ويعيد استخدام نفس الـ plan: 900,000 عملية key lookup، صفاً بصف. الـ p99 المقاس لهذه الواجهة ارتفع من 40 ms إلى 8 s — أي أن أبطأ طلب من كل 100 طلب استغرق ثماني ثوانٍ بدل أربعين ميلي ثانية." },
        { t: "p",
          en: "Now restart SQL Server, or let the plan fall out of cache overnight, and suppose customer 7 runs first. SQL Server sees 900,000 rows, picks a clustered index scan — reading the whole table from start to end — with a sort, and asks for a 900 MB memory grant. That plan is right for customer 7. Customer 42 then scans 40 million rows to find 3, and holds a 900 MB reservation while doing it. Under load, other queries wait for memory — a wait type called RESOURCE_SEMAPHORE — and the whole server slows down. Same code, same data, opposite failure.",
          ar: "الآن أعد تشغيل SQL Server، أو دع الـ plan يخرج من الـ cache ليلاً، وافترض أن العميل 7 نُفّذ أولاً. يرى SQL Server 900,000 صف، فيختار clustered index scan — أي قراءة الجدول كله من أوله إلى آخره — مع sort، ويطلب memory grant بحجم 900 MB. هذا الـ plan صحيح للعميل 7. بعدها العميل 42 يمسح 40 مليون صف ليجد 3، وهو محتجز 900 MB أثناء ذلك. تحت الضغط تنتظر بقية الاستعلامات الذاكرة — نوع انتظار اسمه RESOURCE_SEMAPHORE — ويبطؤ الخادم كله. نفس الكود، نفس البيانات، وفشل معاكس." },
        { t: "kv", rows: [
          { k: { en: "Plan compiled for the small value, run with a big one", ar: "plan مُجمَّع لقيمة صغيرة ويُنفَّذ بقيمة كبيرة" },
            v: { en: "Seek plus key lookup repeated hundreds of thousands of times. The query is slow and its logical reads — the count of 8 KB pages it touched — go up by orders of magnitude. Usually one slow request, not a server-wide problem.", ar: "seek مع key lookup يتكرر مئات الآلاف من المرات. الاستعلام بطيء، وترتفع الـ logical reads — عدد صفحات الـ 8 KB التي لمسها — بمراتب. عادةً طلب بطيء واحد، لا مشكلة في الخادم كله." } },
          { k: { en: "Plan compiled for the big value, run with a small one", ar: "plan مُجمَّع لقيمة كبيرة ويُنفَّذ بقيمة صغيرة" },
            v: { en: "Full scan and an oversized memory grant on every tiny call. Wastes CPU and RAM, and this one does take the whole server down under concurrency.", ar: "scan كامل وmemory grant مبالغ فيه في كل استدعاء صغير. يهدر CPU وRAM، وهذا النوع تحديداً يُسقط الخادم كله تحت التزامن." } },
          { k: { en: "The giveaway symptom", ar: "العَرَض الدال" },
            v: { en: "The same query has a huge spread between its fastest and slowest execution, and it 'fixes itself' after a restart or an index rebuild — then comes back days later.", ar: "نفس الاستعلام لديه فارق ضخم بين أسرع وأبطأ تنفيذ، و«يُصلح نفسه» بعد إعادة تشغيل أو index rebuild — ثم يعود بعد أيام." } }
        ]}
      ]
    },
    {
      key: "internals",
      blocks: [
        { t: "p",
          en: "Follow one call, EXEC dbo.GetOrdersByCustomer @CustomerId = 42, through the engine in order. First, SQL Server parses the text and turns it into a tree of logical operations. Second, it hashes the query text plus the connection's SET options — settings such as ANSI_NULLS — into a cache key and looks in the plan cache. If a matching plan is there, it is used as is and no optimization happens at all. If not, the optimizer runs.",
          ar: "تابع استدعاءً واحداً، EXEC dbo.GetOrdersByCustomer @CustomerId = 42، عبر المحرك بالترتيب. أولاً، يحلّل SQL Server النص ويحوّله إلى شجرة عمليات منطقية. ثانياً، يحسب hash لنص الاستعلام مع SET options الخاصة بالاتصال — إعدادات مثل ANSI_NULLS — ليكوّن مفتاح cache ويبحث في الـ plan cache. إذا وُجد plan مطابق يُستخدم كما هو ولا يحدث أي optimization. وإن لم يوجد، يعمل الـ optimizer." },
        { t: "p",
          en: "This is where sniffing happens. The optimizer takes the actual runtime value 42, looks it up in the histogram for the CustomerId column, and reads out an estimate: about 3 rows. Every later decision follows from that number. With 3 rows, a seek plus key lookup is cheapest, so that is the plan. The value 42 is then baked into the plan's cost assumptions and the plan is stored in cache under the query text — not under the value.",
          ar: "هنا يحدث الـ sniffing. يأخذ الـ optimizer القيمة الفعلية 42، ويبحث عنها في الـ histogram الخاص بعمود CustomerId، ويستخرج تقديراً: حوالي 3 صفوف. كل القرارات التالية تُبنى على هذا الرقم. مع 3 صفوف يكون seek مع key lookup هو الأرخص، فيصبح هو الـ plan. ثم تُدمَج القيمة 42 في افتراضات تكلفة الـ plan، ويُخزَّن الـ plan في الـ cache تحت نص الاستعلام — لا تحت القيمة." },
        { t: "kv", rows: [
          { k: { en: "Cache key", ar: "Cache key" },
            v: { en: "Query text plus SET options. Parameter values are not part of it, which is exactly why one plan serves every value.", ar: "نص الاستعلام مع SET options. قيم الـ parameters ليست جزءاً منه، وهذا بالضبط سبب خدمة plan واحد لكل القيم." } },
          { k: { en: "Sniffed value", ar: "القيمة المسحوبة (sniffed)" },
            v: { en: "The parameter value present at compile time. Stored in the plan XML as ParameterCompiledValue.", ar: "قيمة الـ parameter الموجودة وقت التجميع. تُخزَّن في plan XML باسم ParameterCompiledValue." } },
          { k: { en: "Runtime value", ar: "القيمة وقت التنفيذ" },
            v: { en: "The value of this particular execution. Shown as ParameterRuntimeValue in an actual plan. When the two differ a lot, you have found your problem.", ar: "قيمة هذا التنفيذ بالذات. تظهر باسم ParameterRuntimeValue في الـ actual plan. عندما تختلف القيمتان كثيراً تكون قد وجدت مشكلتك." } },
          { k: { en: "Density vector", ar: "Density vector" },
            v: { en: "The other number statistics keep: average rows per distinct value, that is total rows divided by number of distinct values. Used when no value can be sniffed.", ar: "الرقم الآخر الذي تحتفظ به الـ statistics: متوسط الصفوف لكل قيمة مميزة، أي إجمالي الصفوف مقسوماً على عدد القيم المميزة. يُستخدم عندما لا يمكن سحب أي قيمة." } }
        ]},
        { t: "p",
          en: "A car navigation app makes the same trade. You ask for a route once at 6 a.m., it sees empty roads and sends you down the small back streets. If it saved that route and reused it at 6 p.m. without re-checking traffic, it would be fast to answer and badly wrong. SQL Server's plan cache is that saved route, and the traffic it checked once is the parameter value it sniffed.",
          ar: "تطبيق الملاحة في السيارة يعمل نفس المقايضة. تطلب طريقاً مرة عند السادسة صباحاً، فيرى شوارع فارغة ويرسلك في الطرق الجانبية الصغيرة. لو حفظ ذلك الطريق وأعاد استخدامه عند السادسة مساءً دون فحص الازدحام من جديد، لكان سريع الرد وخاطئاً تماماً. الـ plan cache في SQL Server هو ذلك الطريق المحفوظ، والازدحام الذي فحصه مرة واحدة هو قيمة الـ parameter التي سحبها." },
        { t: "code", lang: "xml",
          label: { en: "The proof, inside the actual execution plan XML", ar: "الدليل، داخل XML الخاص بالـ actual execution plan" },
          code: "<ParameterList>\n  <ColumnReference Column=\"@CustomerId\"\n                   ParameterCompiledValue=\"(42)\"\n                   ParameterRuntimeValue=\"(7)\" />\n</ParameterList>\n\n<!-- and on the seek operator: -->\n<!-- EstimateRows=\"3.02\"  ActualRows=\"900000\" -->\n<!-- compiled for 42, executed for 7: a 300,000x estimate error -->" },
        { t: "p",
          en: "Plans do not live forever, and that is why the problem seems random. A cached plan is thrown away when the instance restarts or fails over, when memory pressure evicts it, when statistics on the table are updated automatically after enough rows change, when an index on the table is rebuilt, when someone runs ALTER PROCEDURE, or when DBCC FREEPROCCACHE is executed. The next call after any of those recompiles and re-sniffs. So the plan you get depends on who happened to call first after the last eviction — which is why the answer to 'what changed?' is often 'nothing'.",
          ar: "الـ plans لا تعيش للأبد، ولهذا تبدو المشكلة عشوائية. يُلغى الـ plan المخزَّن عند إعادة تشغيل الـ instance أو الـ failover، وعند طرده بسبب ضغط الذاكرة، وعند تحديث الـ statistics تلقائياً بعد تغيّر عدد كافٍ من الصفوف، وعند إعادة بناء index على الجدول، وعند تنفيذ ALTER PROCEDURE، وعند تنفيذ DBCC FREEPROCCACHE. أول استدعاء بعد أي من هذه يعيد التجميع ويعيد الـ sniffing. لذلك الـ plan الذي تحصل عليه يعتمد على من صادف أن استدعى أولاً بعد آخر عملية طرد — ولهذا الإجابة على «ما الذي تغيّر؟» تكون غالباً «لا شيء»." },
        { t: "p",
          en: "There is one more mechanism worth knowing, because it explains a popular but misunderstood trick. If you copy a parameter into a local variable, or declare a variable and assign it, the optimizer cannot see the value at compile time — assignment happens at run time. So it falls back to the density vector: total rows divided by distinct customers. With 40 million orders and 200,000 customers that is a flat estimate of 200 rows for every customer, forever. OPTIMIZE FOR UNKNOWN does exactly the same thing, explicitly. It is not a fix; it is a different, permanently mediocre guess.",
          ar: "هناك آلية أخرى تستحق المعرفة، لأنها تفسّر حيلة شائعة لكن مُساء فهمها. إذا نسخت الـ parameter إلى متغير محلي، أو أعلنت متغيراً وأسندت له قيمة، لا يستطيع الـ optimizer رؤية القيمة وقت التجميع — لأن الإسناد يحدث وقت التنفيذ. فيرجع إلى الـ density vector: إجمالي الصفوف مقسوماً على عدد العملاء المميزين. مع 40 مليون طلب و200,000 عميل يعطي ذلك تقديراً ثابتاً قدره 200 صف لكل عميل، دائماً. وOPTIMIZE FOR UNKNOWN يفعل نفس الشيء بشكل صريح. هذه ليست حلاً، بل تخمين مختلف ومتوسط الجودة بشكل دائم." },
        { t: "callout", kind: "tip",
          en: "SQL Server 2022 added Parameter Sensitive Plan optimization. For an eligible predicate — a single WHERE condition on a skewed column — the engine caches up to three plan variants, for low, medium and high row counts, and picks between them by value. It reduces the problem but does not remove it: it covers a limited set of condition shapes, and only when the database runs at compatibility level 160, the setting that turns on SQL Server 2022 optimizer behaviour.",
          ar: "أضاف SQL Server 2022 ميزة Parameter Sensitive Plan optimization. لشرط مؤهَّل — أي شرط WHERE واحد على عمود skewed — يخزّن المحرك حتى ثلاثة variants من الـ plan، لأعداد صفوف منخفضة ومتوسطة وعالية، ويختار بينها حسب القيمة. تقلّل المشكلة لكنها لا تلغيها: تغطي أشكالاً محدودة من الشروط، وفقط عندما تعمل قاعدة البيانات على compatibility level 160، وهو الإعداد الذي يفعّل سلوك optimizer الخاص بـ SQL Server 2022." }
      ]
    },
    {
      key: "tradeoffs",
      blocks: [
        { t: "tradeoff",
          pros: {
            en: [
              "One compile serves millions of executions, so CPU spent on optimization stays near zero.",
              "The cached plan is tuned to real data, not to a generic guess — for matching values it is the best plan available.",
              "Plan reuse keeps execution times stable and predictable when data is evenly spread.",
              "Nothing to configure: it is on by default and correct for most workloads."
            ],
            ar: [
              "تجميع واحد يخدم ملايين التنفيذات، فيبقى الـ CPU المستهلك في الـ optimization قريباً من الصفر.",
              "الـ plan المخزَّن مضبوط على بيانات حقيقية لا على تخمين عام — وللقيم المشابهة هو أفضل plan متاح.",
              "إعادة استخدام الـ plan تُبقي أزمنة التنفيذ مستقرة ومتوقّعة عندما تكون البيانات موزّعة بالتساوي.",
              "لا شيء لتضبطه: مفعّل افتراضياً وصحيح لمعظم أحمال العمل."
            ]
          },
          cons: {
            en: [
              "On skewed data the plan fits one class of values and is wrong for the rest.",
              "Which plan you get depends on who called first after the last cache eviction — effectively random.",
              "A plan compiled for a large value reserves a large memory grant for every small call too.",
              "The symptom is intermittent, so it is usually misdiagnosed as a network, index or 'flaky server' problem."
            ],
            ar: [
              "على البيانات الـ skewed يناسب الـ plan فئة واحدة من القيم ويكون خاطئاً لبقيتها.",
              "أي plan تحصل عليه يعتمد على من استدعى أولاً بعد آخر طرد من الـ cache — أي عشوائياً عملياً.",
              "الـ plan المُجمَّع لقيمة كبيرة يحجز memory grant كبيراً حتى في الاستدعاءات الصغيرة.",
              "العَرَض متقطّع، فيُشخَّص عادةً بشكل خاطئ كمشكلة شبكة أو index أو «خادم غير مستقر»."
            ]
          },
          limits: {
            en: [
              "Only matters when the column's values are unevenly spread; on uniform data it is invisible.",
              "Cannot be fixed by better indexes alone — a wrong row estimate picks the wrong plan even with a perfect index.",
              "SQL Server 2022's Parameter Sensitive Plan optimization covers only some predicate shapes, at compatibility level 160.",
              "Statistics are sampled, not exact, so even a sniffed estimate can be off on very large tables."
            ],
            ar: [
              "لا يهم إلا عندما تكون قيم العمود غير موزّعة بالتساوي؛ على البيانات المنتظمة يكون غير مرئي.",
              "لا يُحلّ بتحسين الـ indexes وحده — تقدير الصفوف الخاطئ يختار plan خاطئاً حتى مع index مثالي.",
              "ميزة Parameter Sensitive Plan optimization في SQL Server 2022 تغطي أشكالاً معيّنة فقط من الشروط، وعند compatibility level 160.",
              "الـ statistics مأخوذة بالعيّنة لا بشكل دقيق، فحتى التقدير المسحوب قد يكون بعيداً على الجداول الضخمة."
            ]
          },
          alts: {
            en: [
              "OPTION (RECOMPILE) on the one skewed statement: a fresh plan per call, paid for in compile CPU.",
              "OPTIMIZE FOR (@CustomerId = 7): always compile for a chosen value you decide is representative.",
              "Split the work: separate procedures or an IF branch so small and large cases get their own cached plans.",
              "Force a known-good plan in Query Store, and review it on a schedule so it does not become a fossil."
            ],
            ar: [
              "OPTION (RECOMPILE) على الجملة الـ skewed وحدها: plan جديد لكل استدعاء، ثمنه CPU للتجميع.",
              "OPTIMIZE FOR (@CustomerId = 7): التجميع دائماً لقيمة تختارها أنت وتعتبرها ممثِّلة.",
              "قسّم العمل: procedures منفصلة أو فرع IF بحيث تحصل الحالات الصغيرة والكبيرة على plans مخزّنة خاصة بها.",
              "ثبّت plan معروف الجودة في Query Store، وراجعه دورياً حتى لا يتحوّل إلى أثر قديم."
            ]
          }
        }
      ]
    },
    {
      key: "mistakes",
      blocks: [
        { t: "mistake",
          title: { en: "Copying the parameter into a local variable to 'disable sniffing'", ar: "نسخ الـ parameter إلى متغير محلي لـ«تعطيل الـ sniffing»" },
          body: {
            en: "A developer found a blog post and added DECLARE @cid int = @CustomerId at the top of GetOrdersByCustomer, then used @cid in the WHERE. The 8 s outlier disappeared, so it shipped. Two weeks later every call was slow-ish: the optimizer now estimates 200 rows for everyone, so customer 7 gets a plan sized for 200 rows and still does hundreds of thousands of key lookups, while customer 42 pays for a plan that is no longer a clean 3-row seek. They traded one broken case for a permanently mediocre one across the board.",
            ar: "وجد مطوّر منشوراً على مدونة فأضاف DECLARE @cid int = @CustomerId في أعلى GetOrdersByCustomer، ثم استخدم @cid في الـ WHERE. اختفت الحالة الشاذة ذات الثماني ثوانٍ فتم النشر. بعد أسبوعين صار كل استدعاء بطيئاً نسبياً: الـ optimizer صار يقدّر 200 صف للجميع، فيحصل العميل 7 على plan مصمَّم لـ200 صف ويظل ينفّذ مئات الآلاف من الـ key lookups، بينما يدفع العميل 42 ثمن plan لم يعد seek نظيفاً لثلاثة صفوف. استبدلوا حالة واحدة سيئة بحالة متوسطة السوء بشكل دائم للجميع."
          },
          fix: "-- keep the parameter visible to the optimizer, recompile only the skewed statement\nSELECT o.OrderId, o.PlacedAt, o.Status, o.TotalAmount\nFROM   dbo.Orders AS o\nWHERE  o.CustomerId = @CustomerId\nORDER  BY o.PlacedAt DESC\nOPTION (RECOMPILE);" },
        { t: "mistake",
          title: { en: "OPTION (RECOMPILE) on a query that runs 5,000 times a second", ar: "OPTION (RECOMPILE) على استعلام يُنفَّذ 5,000 مرة في الثانية" },
          body: {
            en: "RECOMPILE worked so well on the reporting procedure that the team added it to the lookup used by every page load. Each execution now compiles a plan first. Compilation takes CPU, and on some builds concurrent compilations queue behind each other on internal engine locks. CPU on the instance went from 30% to 95% with no change in query count, and the slow query was not slow — the server was simply spending its time optimizing. RECOMPILE is right for expensive, infrequent, skew-prone queries and wrong for cheap frequent ones.",
            ar: "نجح RECOMPILE جيداً على procedure التقارير فأضافه الفريق إلى استعلام البحث المستخدم في كل تحميل صفحة. صار كل تنفيذ يجمّع plan أولاً. التجميع يستهلك CPU، وفي بعض الإصدارات تصطف عمليات التجميع المتزامنة خلف بعضها على أقفال داخلية في المحرك. ارتفع CPU على الـ instance من 30% إلى 95% دون أي تغيّر في عدد الاستعلامات، ولم يكن الاستعلام البطيء بطيئاً — الخادم ببساطة كان يقضي وقته في الـ optimization. الـ RECOMPILE مناسب للاستعلامات المكلفة نادرة التنفيذ والمعرّضة للـ skew، وغير مناسب للاستعلامات الرخيصة عالية التكرار."
          } },
        { t: "mistake",
          title: { en: "Rebuilding indexes nightly as the cure", ar: "إعادة بناء الـ indexes ليلياً كعلاج" },
          body: {
            en: "A slow procedure got fast right after an index rebuild, so a nightly rebuild job was added and declared a fix. It works for a reason nobody checked: rebuilding an index updates statistics, which invalidates the cached plan, so the next morning's first caller re-sniffs. The team was not fixing fragmentation, they were shuffling the lottery. It failed the first time a large customer logged in at 6:01 a.m., and it burned hours of I/O every night for nothing.",
            ar: "صارت procedure بطيئة سريعة مباشرة بعد index rebuild، فأُضيفت مهمة rebuild ليلية واعتُبرت حلاً. تعمل لسبب لم يتحقق منه أحد: إعادة بناء الـ index تُحدّث الـ statistics، مما يُبطل الـ plan المخزَّن، فيعيد أول مستدعٍ في الصباح عملية الـ sniffing. الفريق لم يكن يعالج الـ fragmentation، بل كان يعيد خلط اليانصيب. فشل الحل أول مرة سجّل فيها عميل كبير الدخول عند 6:01 صباحاً، واستهلك ساعات من الـ I/O كل ليلة بلا فائدة."
          } },
        { t: "mistake",
          title: { en: "Turning parameter sniffing off for the whole database", ar: "إيقاف الـ parameter sniffing لقاعدة البيانات كلها" },
          body: {
            en: "After a bad week someone ran ALTER DATABASE SCOPED CONFIGURATION SET PARAMETER_SNIFFING = OFF. That makes every query in the database use the density-vector average instead of real values — the local-variable behaviour, applied globally. The one problem procedure improved. Forty other procedures that relied on accurate estimates for correct join order got worse, and because the change was invisible in the code, the next team spent a day comparing plans before someone checked the database configuration.",
            ar: "بعد أسبوع سيّئ نفّذ أحدهم ALTER DATABASE SCOPED CONFIGURATION SET PARAMETER_SNIFFING = OFF. هذا يجعل كل استعلام في قاعدة البيانات يستخدم متوسط الـ density vector بدل القيم الحقيقية — سلوك المتغير المحلي مطبَّقاً عالمياً. تحسّنت الـ procedure المشكِلة الوحيدة. وساءت أربعون procedure أخرى كانت تعتمد على تقديرات دقيقة لترتيب الـ joins الصحيح، ولأن التغيير غير مرئي في الكود، أمضى الفريق التالي يوماً في مقارنة الـ plans قبل أن يتفقّد أحدهم إعدادات قاعدة البيانات."
          } }
      ]
    },
    {
      key: "interview",
      blocks: [
        { t: "qa", level: "junior",
          q: { en: "What is parameter sniffing?", ar: "ما هو الـ parameter sniffing؟" },
          a: {
            en: "When SQL Server compiles a parameterized query it looks at the actual parameter values of that first execution and uses them to estimate how many rows come back. It builds the plan around that estimate, caches the plan under the query text, and reuses it for every later call whatever values they pass. That is sniffing. It is good when all values behave alike and bad when one value matches three rows and another matches a million.",
            ar: "عندما يجمّع SQL Server استعلاماً فيه parameters، ينظر إلى القيم الفعلية في أول تنفيذ ويستخدمها لتقدير عدد الصفوف الراجعة. يبني الـ plan حول ذلك التقدير، يخزّنه تحت نص الاستعلام، ويعيد استخدامه لكل استدعاء لاحق مهما كانت قيمه. هذا هو الـ sniffing. مفيد عندما تتصرف كل القيم بشكل متشابه، وسيّئ عندما تطابق قيمة ثلاثة صفوف وتطابق أخرى مليوناً."
          } },
        { t: "qa", level: "mid",
          q: { en: "Why does SQL Server do this instead of compiling every time?", ar: "لماذا يفعل SQL Server هذا بدل التجميع في كل مرة؟" },
          a: {
            en: "Because optimizing is expensive. For a query with several joins the optimizer explores many possible orders and access paths, which can take tens of milliseconds of CPU. If a procedure runs fifty thousand times a minute, compiling each time costs far more than executing. Caching one plan turns that into a one-off cost. Sniffing is what makes that single cached plan good rather than generic — it is just tied to whichever values happened to be there.",
            ar: "لأن الـ optimization مكلف. في استعلام فيه عدة joins يستكشف الـ optimizer ترتيبات ومسارات وصول كثيرة، وقد يستغرق عشرات الميلي ثانية من الـ CPU. لو نُفّذت procedure خمسين ألف مرة في الدقيقة، لكان التجميع في كل مرة أغلى بكثير من التنفيذ. تخزين plan واحد يحوّل ذلك إلى تكلفة تُدفع مرة. والـ sniffing هو ما يجعل ذلك الـ plan الوحيد جيداً بدل أن يكون عاماً — لكنه مرتبط بالقيم التي صادف وجودها."
          } },
        { t: "qa", level: "mid",
          q: { en: "How do you confirm a slow procedure is actually a sniffing problem?", ar: "كيف تتأكد أن procedure بطيئة هي فعلاً مشكلة sniffing؟" },
          a: {
            en: "Two checks. First, capture the actual execution plan of a slow run and compare estimated rows against actual rows on the operator reading the table — a sniffing problem shows a huge gap, like an estimate of 3 against 900,000 actual. Second, open the plan XML and read the ParameterList: if ParameterCompiledValue is a different value from ParameterRuntimeValue, you are literally looking at the plan built for someone else. Query Store confirms it from the other side: the same query id with a wide spread between minimum and maximum duration.",
            ar: "فحصان. أولاً، التقط الـ actual execution plan لتنفيذ بطيء وقارن الصفوف المقدَّرة بالصفوف الفعلية على المُشغِّل الذي يقرأ الجدول — مشكلة الـ sniffing تُظهر فجوة ضخمة، مثل تقدير 3 مقابل 900,000 فعلي. ثانياً، افتح plan XML واقرأ الـ ParameterList: إذا كانت ParameterCompiledValue مختلفة عن ParameterRuntimeValue فأنت تنظر حرفياً إلى plan بُني لشخص آخر. وQuery Store يؤكدها من الجهة الأخرى: نفس query id مع فارق واسع بين أقل وأعلى مدة."
          } },
        { t: "qa", level: "senior",
          q: { en: "What is the difference between OPTION (RECOMPILE) and OPTIMIZE FOR UNKNOWN?", ar: "ما الفرق بين OPTION (RECOMPILE) و OPTIMIZE FOR UNKNOWN؟" },
          a: {
            en: "RECOMPILE builds a new plan for this execution using this execution's real values, then throws it away. You always get a plan that fits, and you pay compile CPU on every call. OPTIMIZE FOR UNKNOWN does the opposite: it deliberately ignores the values and estimates from the average rows per distinct value, then caches that one plan. So RECOMPILE is always right and sometimes too expensive; UNKNOWN is cheap and permanently average — it protects you from the worst case by giving up the best case. UNKNOWN only makes sense when the average plan is acceptable for every value, which on skewed data it usually is not.",
            ar: "الـ RECOMPILE يبني plan جديداً لهذا التنفيذ باستخدام قيمه الحقيقية ثم يتخلّص منه. تحصل دائماً على plan مناسب، وتدفع CPU للتجميع في كل استدعاء. وOPTIMIZE FOR UNKNOWN يفعل العكس: يتجاهل القيم عمداً ويقدّر من متوسط الصفوف لكل قيمة مميزة، ثم يخزّن ذلك الـ plan الواحد. إذاً RECOMPILE صحيح دائماً ومكلف أحياناً؛ وUNKNOWN رخيص ومتوسط بشكل دائم — يحميك من أسوأ حالة مقابل التخلي عن أفضل حالة. وUNKNOWN منطقي فقط عندما يكون الـ plan المتوسط مقبولاً لكل القيم، وهذا غالباً غير صحيح على بيانات skewed."
          } },
        { t: "qa", level: "senior",
          q: { en: "You cannot put RECOMPILE on a hot query. What else do you do?", ar: "لا يمكنك وضع RECOMPILE على استعلام عالي التردد. ماذا تفعل غير ذلك؟" },
          a: {
            en: "I separate the cases so each gets its own cached plan. Concretely: branch on a cheap pre-check — count the customer's orders, or read a flag on the customer row — and call one of two procedures, one written for small customers and one for large. Different query text means different cache entries, so each keeps a plan that fits. If branching is not practical I look at whether an index can make the plans converge, for example a covering index that removes the key lookup so the seek is fine at any size. Only then do I consider OPTIMIZE FOR with a value I can justify, and I document why that value was chosen because it will look arbitrary to whoever reads it next.",
            ar: "أفصل الحالات ليحصل كل منها على plan مخزَّن خاص به. عملياً: أتفرّع بناءً على فحص مسبق رخيص — عدّ طلبات العميل، أو قراءة flag في صف العميل — ثم أستدعي واحدة من procedures اثنتين، واحدة مكتوبة للعملاء الصغار وأخرى للكبار. اختلاف نص الاستعلام يعني مدخلات cache مختلفة، فيحتفظ كل منهما بـ plan مناسب. وإن كان التفرّع غير عملي، أنظر هل يمكن لـ index أن يجعل الـ plans تتقارب، مثل covering index يزيل الـ key lookup فيصبح الـ seek جيداً عند أي حجم. وبعد ذلك فقط أفكّر في OPTIMIZE FOR بقيمة أستطيع تبريرها، وأوثّق سبب اختيارها لأنها ستبدو اعتباطية لمن يقرأ الكود بعدي."
          } },
        { t: "qa", level: "staff",
          q: { en: "How do you stop this class of incident happening again across many teams?", ar: "كيف تمنع تكرار هذا النوع من الحوادث عبر فرق متعددة؟" },
          a: {
            en: "I treat plan choice as something the platform observes, not something each team remembers. First, turn Query Store on everywhere with a retention policy, and alert on regression — same query id, new plan, duration up by some factor — so the problem is caught by a signal instead of by a customer. Second, make skew visible: a scheduled report of the most lopsided columns per table, so teams know which parameters are dangerous before they write the query. Third, agree one written rule for mitigations and where each is allowed, so people stop copying the local-variable trick from blogs. Fourth, ban silent global switches like the database-scoped PARAMETER_SNIFFING setting, because an invisible change costs the next team a day of debugging. The goal is that a bad plan produces a page with a link to the plan diff, not a week of guessing.",
            ar: "أتعامل مع اختيار الـ plan كشيء تراقبه المنصة، لا كشيء يتذكره كل فريق. أولاً، تفعيل Query Store في كل مكان مع سياسة احتفاظ، وتنبيه عند التراجع — نفس query id، وplan جديد، ومدة أعلى بمضاعف معيّن — ليُكتشف الأمر بإشارة لا بشكوى عميل. ثانياً، إظهار الـ skew: تقرير مجدول بأكثر الأعمدة تفاوتاً في كل جدول، ليعرف الفريق أي الـ parameters خطرة قبل كتابة الاستعلام. ثالثاً، الاتفاق على قاعدة مكتوبة واحدة لطرق المعالجة وأين يُسمح بكل منها، حتى يتوقف الناس عن نسخ حيلة المتغير المحلي من المدونات. رابعاً، منع المفاتيح العامة الصامتة مثل إعداد PARAMETER_SNIFFING على مستوى قاعدة البيانات، لأن تغييراً غير مرئي يكلّف الفريق التالي يوماً من التتبّع. الهدف أن ينتج الـ plan السيّئ تنبيهاً فيه رابط لمقارنة الـ plans، لا أسبوعاً من التخمين."
          } }
      ]
    },
    {
      key: "codereview",
      blocks: [
        { t: "review", severity: "high",
          title: { en: "Local variable used to hide a sniffing problem", ar: "متغير محلي يُستخدم لإخفاء مشكلة sniffing" },
          bad: "CREATE PROCEDURE dbo.GetOrdersByCustomer\n    @CustomerId int\nAS\n-- \"fixes\" the slow customer, per a blog post\nDECLARE @cid int = @CustomerId;\n\nSELECT o.OrderId, o.PlacedAt, o.Status, o.TotalAmount\nFROM   dbo.Orders AS o\nWHERE  o.CustomerId = @cid\nORDER  BY o.PlacedAt DESC;",
          good: "CREATE PROCEDURE dbo.GetOrdersByCustomer\n    @CustomerId int\nAS\n-- Orders.CustomerId is heavily skewed (3 rows .. 900k rows per customer).\n-- Recompile is affordable here: this proc runs ~200 times/minute, not per page load.\nSELECT o.OrderId, o.PlacedAt, o.Status, o.TotalAmount\nFROM   dbo.Orders AS o\nWHERE  o.CustomerId = @CustomerId\nORDER  BY o.PlacedAt DESC\nOPTION (RECOMPILE);",
          why: {
            en: "The local variable does not disable a bad plan, it replaces a value-specific estimate with a flat average — 200 rows for every customer here. Both extremes then get a plan built for a customer who does not exist. It also hides the intent: nothing in the code says why the copy is there, so the next reader deletes it. The good version keeps the parameter visible to the optimizer, gets a correct plan per call, and states in a comment both the skew and the call rate that makes RECOMPILE affordable.",
            ar: "المتغير المحلي لا يعطّل plan سيّئاً، بل يستبدل تقديراً خاصاً بالقيمة بمتوسط ثابت — 200 صف لكل عميل هنا. فيحصل الطرفان على plan مبني لعميل غير موجود. كما أنه يخفي النية: لا شيء في الكود يقول لماذا وُضع النسخ، فيحذفه القارئ التالي. النسخة الجيدة تُبقي الـ parameter مرئياً للـ optimizer، وتحصل على plan صحيح لكل استدعاء، وتذكر في تعليق كلاً من الـ skew ومعدّل الاستدعاء الذي يجعل RECOMPILE مقبول التكلفة."
          } },
        { t: "review", severity: "medium",
          title: { en: "RECOMPILE added to a query on the request hot path", ar: "RECOMPILE مضاف إلى استعلام في المسار الساخن للطلبات" },
          bad: "-- called on every page load: ~5,000 executions/second\nSELECT TOP (20) p.ProductId, p.Name, p.Price\nFROM   dbo.Products AS p\nWHERE  p.CategoryId = @CategoryId\nORDER  BY p.Rank\nOPTION (RECOMPILE);",
          good: "-- Categories are mildly skewed; the 'Electronics' plan is fine for all of them.\n-- Chosen because it is the 90th-percentile category size; revisit if catalogue shape changes.\nSELECT TOP (20) p.ProductId, p.Name, p.Price\nFROM   dbo.Products AS p\nWHERE  p.CategoryId = @CategoryId\nORDER  BY p.Rank\nOPTION (OPTIMIZE FOR (@CategoryId = 17));",
          why: {
            en: "At five thousand executions a second, compiling a plan per execution costs more CPU than running the query, and compilation does not scale linearly across cores. The query itself is cheap and the skew is mild, so a single plan chosen for a representative category is good enough for all of them. The comment matters as much as the hint: an OPTIMIZE FOR value with no explanation is unmaintainable, because nobody later knows whether 17 still means anything.",
            ar: "عند خمسة آلاف تنفيذ في الثانية، تجميع plan لكل تنفيذ يكلّف CPU أكثر من تنفيذ الاستعلام نفسه، والتجميع لا يتوسّع خطياً عبر الأنوية. الاستعلام نفسه رخيص والـ skew بسيط، فplan واحد مختار لفئة ممثِّلة يكفي للجميع. والتعليق لا يقل أهمية عن الـ hint: قيمة OPTIMIZE FOR بلا تفسير غير قابلة للصيانة، لأن لا أحد لاحقاً يعرف هل ما زال الرقم 17 يعني شيئاً."
          } }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        { t: "p",
          en: "Parameter sniffing shows up wherever one shared query serves tenants of wildly different sizes. A tenant here means one customer organisation whose rows sit in the same tables as everyone else's. The classic case is multi-tenant software: 5,000 small customers and three enormous ones, all hitting the same procedure with a TenantId. The plan is chosen by whoever calls first after a deploy, so a deploy at 3 a.m. quietly picks the small-tenant plan and the large tenants time out from 9 a.m. onwards. Designing around it means deciding, at design time, whether one code path can serve both sizes.",
          ar: "يظهر الـ parameter sniffing في كل مكان يخدم فيه استعلام مشترك واحد tenants بأحجام شديدة الاختلاف. والـ tenant هنا يعني مؤسسة عميل واحدة تقع صفوفها في نفس جداول الجميع. الحالة الكلاسيكية هي البرمجيات متعددة الـ tenants: 5,000 عميل صغير وثلاثة ضخمة، وكلهم يستدعون نفس الـ procedure بـ TenantId. يُختار الـ plan حسب من يستدعي أولاً بعد النشر، فنشرٌ عند الثالثة فجراً يختار بهدوء plan العملاء الصغار، وتبدأ الـ tenants الكبيرة في الـ timeout من التاسعة صباحاً." },
        { t: "ul",
          en: [
            "Decide early which columns are skewed — tenant id, customer id, status, country — and treat any query filtering on them as parameter-sensitive by default.",
            "Give large tenants their own code path, or their own database, so their queries never share a cache entry with small ones.",
            "Set a per-query timeout on the application side that is shorter than the request timeout, so a bad plan fails one request instead of holding a connection and exhausting the pool.",
            "Keep reporting endpoints and transactional endpoints in separate procedures even when the SQL looks identical — different shapes of load need different plans.",
            "Warm the cache deliberately after a deploy or failover by running the representative parameter values, rather than letting the first real caller decide for everyone."
          ],
          ar: [
            "حدّد مبكراً أي الأعمدة skewed — tenant id، customer id، status، country — واعتبر أي استعلام يرشّح عليها حسّاساً للـ parameters افتراضياً.",
            "امنح الـ tenants الكبيرة مساراً برمجياً خاصاً بها، أو قاعدة بيانات خاصة، حتى لا تشترك استعلاماتها أبداً في مدخل cache مع الصغيرة.",
            "اضبط timeout لكل استعلام في التطبيق أقصر من timeout الطلب، حتى يُفشل الـ plan السيّئ طلباً واحداً بدل أن يحتجز اتصالاً ويستنزف الـ connection pool.",
            "أبقِ واجهات التقارير وواجهات المعاملات في procedures منفصلة حتى لو بدا SQL متطابقاً — أشكال الحمل المختلفة تحتاج plans مختلفة.",
            "سخّن الـ cache عمداً بعد كل نشر أو failover بتنفيذ قيم الـ parameters الممثِّلة، بدل ترك أول مستدعٍ حقيقي يقرر عن الجميع."
          ] },
        { t: "callout", kind: "warn",
          en: "A bad plan does not stay a database problem. A query that normally takes 40 ms and now takes 8 s holds its connection for 200 times longer. The application's connection pool empties, healthy requests queue behind it, and the outage looks like the API is down. Timeouts on the client side are what keeps one bad plan from becoming a full outage.",
          ar: "الـ plan السيّئ لا يبقى مشكلة قاعدة بيانات. استعلام يستغرق عادةً 40 ms وصار يستغرق 8 s يحتجز اتصاله لمدة أطول 200 مرة. يفرغ الـ connection pool في التطبيق، وتصطف الطلبات السليمة خلفه، ويبدو التعطّل وكأن الـ API متوقفة. الـ timeouts في جهة العميل هي ما يمنع plan سيّئاً واحداً من التحوّل إلى تعطّل كامل." }
      ]
    },
    {
      key: "perf",
      blocks: [
        { t: "kv", rows: [
          { k: { en: "CPU", ar: "CPU" },
            v: { en: "Two opposite risks: a scan plan burns CPU reading rows it does not need, and RECOMPILE everywhere burns CPU optimizing. Watch compilations per second next to batch requests per second — a ratio above roughly 10% means you are compiling too much.", ar: "خطران متعاكسان: plan فيه scan يستهلك CPU في قراءة صفوف لا يحتاجها، وRECOMPILE في كل مكان يستهلك CPU في الـ optimization. راقب compilations per second بجانب batch requests per second — نسبة أعلى من 10% تقريباً تعني أنك تجمّع أكثر من اللازم." } },
          { k: { en: "Memory", ar: "Memory" },
            v: { en: "The memory grant is sized from the row estimate at compile time. Over-estimate and every small call reserves RAM it never uses, causing RESOURCE_SEMAPHORE waits. Under-estimate and sorts and hash joins spill to tempdb, which turns a memory operation into disk I/O.", ar: "حجم الـ memory grant يُشتق من تقدير الصفوف وقت التجميع. التقدير الزائد يجعل كل استدعاء صغير يحجز RAM لا يستخدمها، مسبباً انتظارات RESOURCE_SEMAPHORE. والتقدير الناقص يجعل الـ sorts والـ hash joins تعمل spill إلى tempdb، فتتحول عملية ذاكرة إلى I/O على القرص." } },
          { k: { en: "Database I/O", ar: "Database I/O" },
            v: { en: "The clearest metric is logical reads per execution for the same query. A 3-row call doing 400,000 logical reads is a wrong plan, not a slow disk. Compare the same query id across executions rather than looking at one number.", ar: "أوضح مقياس هو logical reads لكل تنفيذ لنفس الاستعلام. استدعاء يعيد 3 صفوف وينفّذ 400,000 logical read هو plan خاطئ لا قرص بطيء. قارن نفس query id عبر التنفيذات بدل النظر إلى رقم واحد." } },
          { k: { en: "Latency", ar: "Latency" },
            v: { en: "Parameter sniffing is a tail-latency problem: the average barely moves because most callers are small, while p99 explodes. If you only chart averages you will not see it at all.", ar: "الـ parameter sniffing مشكلة tail latency: المتوسط بالكاد يتحرك لأن معظم المستدعين صغار، بينما ينفجر p99. إذا كنت ترسم المتوسطات فقط فلن تراها إطلاقاً." } },
          { k: { en: "Scalability", ar: "Scalability" },
            v: { en: "It scales the wrong way: the bigger a tenant grows, the more the shared plan misfits it, so the largest and most valuable customers hit the problem first and hardest.", ar: "يتوسّع في الاتجاه الخاطئ: كلما كبر الـ tenant زاد عدم ملاءمة الـ plan المشترك له، فيصطدم أكبر العملاء وأكثرهم قيمة بالمشكلة أولاً وأشدّها." } }
        ]}
      ]
    },
    {
      key: "debug",
      blocks: [
        { t: "ul",
          en: [
            "Query Store, Regressed Queries view: pick the query, see its plans side by side. You are looking for one query id with two plan ids and a step change in average duration at a specific time.",
            "sys.dm_exec_query_stats joined to sys.dm_exec_sql_text and sys.dm_exec_query_plan: compare min_elapsed_time with max_elapsed_time for the same plan handle. A ratio of 1000x on one plan is the signature.",
            "The actual execution plan of a slow call: hover the operator reading the table and compare 'Estimated Number of Rows' with 'Actual Number of Rows'. A gap of more than about 10x explains the plan choice.",
            "The plan XML ParameterList element: ParameterCompiledValue versus ParameterRuntimeValue. Different values there is direct proof the plan was built for someone else's parameters.",
            "sys.dm_exec_query_memory_grants during the incident, plus any yellow spill warnings on the plan operators. Requested versus used grant tells you which direction the estimate went wrong."
          ],
          ar: [
            "Query Store، عرض Regressed Queries: اختر الاستعلام وشاهد plans جنباً إلى جنب. تبحث عن query id واحد بـ plan ids اثنين وقفزة في متوسط المدة عند وقت محدد.",
            "sys.dm_exec_query_stats مع sys.dm_exec_sql_text و sys.dm_exec_query_plan: قارن min_elapsed_time بـ max_elapsed_time لنفس plan handle. نسبة 1000 ضعف على plan واحد هي البصمة المميزة.",
            "الـ actual execution plan لاستدعاء بطيء: مرّر المؤشر على المُشغِّل الذي يقرأ الجدول وقارن Estimated Number of Rows بـ Actual Number of Rows. فجوة أكبر من 10 أضعاف تقريباً تفسّر اختيار الـ plan.",
            "عنصر ParameterList في plan XML: ParameterCompiledValue مقابل ParameterRuntimeValue. اختلاف القيمتين دليل مباشر أن الـ plan بُني لـ parameters شخص آخر.",
            "sys.dm_exec_query_memory_grants أثناء الحادثة، مع أي تحذيرات spill صفراء على مُشغِّلات الـ plan. المقارنة بين الحجم المطلوب والمستخدَم تخبرك في أي اتجاه أخطأ التقدير."
          ] },
        { t: "callout", kind: "tip",
          en: "Save the bad plan before you do anything else. Clearing the cache, rebuilding an index or restarting the service makes the symptom vanish and destroys the evidence, and you will not be able to prove what happened. Export the plan XML from Query Store or sys.dm_exec_query_plan first, then fix.",
          ar: "احفظ الـ plan السيّئ قبل أي شيء آخر. مسح الـ cache أو إعادة بناء index أو إعادة تشغيل الخدمة يُخفي العَرَض ويتلف الدليل، ولن تستطيع إثبات ما حدث. صدّر plan XML من Query Store أو من sys.dm_exec_query_plan أولاً، ثم عالج المشكلة."
        }
      ]
    },
    {
      key: "realworld",
      blocks: [
        { t: "p",
          en: "The pattern repeats in any system where a filter column has a few very heavy values and a long tail of light ones. Nobody notices during development, because test data is evenly generated and every value looks the same size. It appears months into production, on the day the first large account starts using the product seriously, and it usually arrives as an intermittent timeout rather than an obvious database error.",
          ar: "يتكرر النمط في أي نظام يحتوي فيه عمود الترشيح على قيم قليلة ثقيلة جداً وذيل طويل من القيم الخفيفة. لا يلاحظه أحد أثناء التطوير، لأن بيانات الاختبار مولَّدة بالتساوي وكل قيمة تبدو بنفس الحجم. يظهر بعد أشهر في الإنتاج، في اليوم الذي يبدأ فيه أول حساب كبير باستخدام المنتج بجدية، ويصل عادةً على شكل timeout متقطّع لا كخطأ قاعدة بيانات واضح." },
        { t: "ul",
          en: [
            "Multi-tenant SaaS: one shared schema where a handful of enterprise tenants hold most of the rows, so a TenantId filter is the most parameter-sensitive predicate in the product.",
            "E-commerce order history: most shoppers have a few orders and marketplace sellers have hundreds of thousands, all served by the same customer-orders endpoint.",
            "Ticketing and support systems: filtering by status, where 'Open' matches a few thousand rows and 'Closed' matches ten million, and the same query serves both dashboards.",
            "Reporting endpoints layered on the transactional database: a date-range parameter where 'today' and 'last three years' share one cached plan and need completely different ones."
          ],
          ar: [
            "SaaS متعدد الـ tenants: schema مشترك تملك فيه حفنة من الـ tenants المؤسسية معظم الصفوف، فيصبح الترشيح بـ TenantId أكثر الشروط حساسية للـ parameters في المنتج.",
            "سجل الطلبات في التجارة الإلكترونية: معظم المشترين لديهم طلبات قليلة والبائعون لديهم مئات الآلاف، والجميع يُخدَّم من نفس واجهة طلبات العميل.",
            "أنظمة التذاكر والدعم: الترشيح بـ status، حيث تطابق «Open» بضعة آلاف صف وتطابق «Closed» عشرة ملايين، ونفس الاستعلام يخدم اللوحتين.",
            "واجهات التقارير المبنية فوق قاعدة بيانات المعاملات: parameter لمدى تاريخي، حيث تتشارك «اليوم» و«آخر ثلاث سنوات» plan واحداً مخزَّناً بينما تحتاجان plans مختلفة تماماً."
          ] }
      ]
    },
    {
      key: "exercises",
      blocks: [
        { t: "ex", diff: "easy",
          en: "Build a table of 2 million rows where one CustomerId owns 1.5 million of them and 50,000 other customers share the rest. Write a procedure filtering on CustomerId. Run it first for a small customer, then for the big one, capturing actual plans for both. You are done when you can point at the plan XML and read ParameterCompiledValue and ParameterRuntimeValue holding different values.",
          ar: "ابنِ جدولاً فيه مليونا صف، يملك CustomerId واحد 1.5 مليون منها ويتقاسم 50,000 عميل آخر الباقي. اكتب procedure ترشّح على CustomerId. نفّذها أولاً لعميل صغير ثم للكبير، مع التقاط الـ actual plans للاثنين. تنتهي عندما تستطيع الإشارة إلى plan XML وقراءة ParameterCompiledValue و ParameterRuntimeValue بقيمتين مختلفتين." },
        { t: "ex", diff: "medium",
          en: "Using the same table, clear the plan cache and run the big customer first, then the small one. Record the duration, logical reads and requested memory grant for the small customer under each of the two plans. You are done when you have a small table of four numbers showing that the same call is fast or slow purely depending on which value compiled the plan.",
          ar: "باستخدام نفس الجدول، امسح الـ plan cache ونفّذ العميل الكبير أولاً ثم الصغير. سجّل المدة وlogical reads وحجم الـ memory grant المطلوب للعميل الصغير تحت كل من الـ plan اثنين. تنتهي عندما يكون لديك جدول صغير من أربعة أرقام يُظهر أن نفس الاستدعاء يكون سريعاً أو بطيئاً فقط حسب القيمة التي جمّعت الـ plan." },
        { t: "ex", diff: "hard",
          en: "Fix the same procedure three different ways: OPTION (RECOMPILE), OPTIMIZE FOR UNKNOWN, and splitting into two procedures chosen by a cheap pre-check. Measure all three under a load of 95% small customers and 5% large ones. You are done when you can state, with numbers, which one gives the best p99 and which one costs the most CPU, and explain why they are not the same option.",
          ar: "عالج نفس الـ procedure بثلاث طرق: OPTION (RECOMPILE)، وOPTIMIZE FOR UNKNOWN، والتقسيم إلى procedures اثنتين يُختار بينهما بفحص مسبق رخيص. قِس الثلاثة تحت حمل مكوّن من 95% عملاء صغار و5% كبار. تنتهي عندما تستطيع أن تذكر بالأرقام أيها يعطي أفضل p99 وأيها يكلّف أكثر CPU، وتشرح لماذا ليسا نفس الخيار." },
        { t: "ex", diff: "senior",
          en: "Enable Query Store on the test database and write a query against its views that lists, for the last day, every query whose maximum duration is more than 20 times its minimum duration and which has more than one plan. Turn that into an alert definition with a threshold you can defend. You are done when your alert fires on the seeded problem and stays silent for a day of normal mixed traffic.",
          ar: "فعّل Query Store على قاعدة بيانات الاختبار واكتب استعلاماً على عروضها يسرد، لآخر يوم، كل استعلام تتجاوز مدته القصوى عشرين ضعف مدته الدنيا ولديه أكثر من plan واحد. حوّل ذلك إلى تعريف تنبيه بعتبة تستطيع الدفاع عنها. تنتهي عندما يُطلق تنبيهك على المشكلة المزروعة ويبقى صامتاً ليوم كامل من حركة مرور عادية مختلطة." }
      ]
    },
    {
      key: "refs",
      blocks: [
        { t: "ref",
          label: { en: "Query Processing Architecture Guide — compilation, plan caching and parameter sensitivity", ar: "دليل معمارية معالجة الاستعلامات — التجميع وتخزين الـ plans وحساسية الـ parameters" },
          url: "https://learn.microsoft.com/en-us/sql/relational-databases/query-processing-architecture-guide",
          meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref",
          label: { en: "Query hints (Transact-SQL) — RECOMPILE, OPTIMIZE FOR, OPTIMIZE FOR UNKNOWN", ar: "Query hints في Transact-SQL — RECOMPILE و OPTIMIZE FOR و OPTIMIZE FOR UNKNOWN" },
          url: "https://learn.microsoft.com/en-us/sql/t-sql/queries/hints-transact-sql-query",
          meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref",
          label: { en: "Parameter Sensitive Plan optimization (SQL Server 2022)", ar: "Parameter Sensitive Plan optimization في SQL Server 2022" },
          url: "https://learn.microsoft.com/en-us/sql/relational-databases/performance/parameter-sensitive-plan-optimization",
          meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref",
          label: { en: "Monitoring performance by using the Query Store", ar: "مراقبة الأداء باستخدام Query Store" },
          url: "https://learn.microsoft.com/en-us/sql/relational-databases/performance/monitoring-performance-by-using-the-query-store",
          meta: { en: "Docs", ar: "توثيق" } }
      ]
    }
  ],
  quiz: [
    {
      q: { en: "What exactly does SQL Server use the sniffed parameter value for?", ar: "ما الذي يستخدم SQL Server قيمة الـ parameter المسحوبة من أجله بالضبط؟" },
      options: [
        { en: "To decide whether the query is allowed to run", ar: "ليقرر هل يُسمح للاستعلام بالتنفيذ" },
        { en: "To estimate how many rows the query will return, which then drives every plan choice", ar: "ليقدّر عدد الصفوف التي سيعيدها الاستعلام، وهذا التقدير يقود كل قرارات الـ plan" },
        { en: "To build the plan cache key so each value gets its own plan", ar: "ليبني مفتاح الـ plan cache بحيث تحصل كل قيمة على plan خاص بها" },
        { en: "To decide the transaction isolation level", ar: "ليقرر مستوى عزل الـ transaction" }
      ],
      correct: 1,
      why: { en: "The value is looked up in the column's histogram to produce a row estimate. Everything else — seek or scan, join order, memory grant — follows from that number. The cache key is the query text plus SET options, not the value.", ar: "يُبحث عن القيمة في الـ histogram الخاص بالعمود لإنتاج تقدير للصفوف. وكل ما عداه — seek أو scan، ترتيب الـ joins، الـ memory grant — يتبع ذلك الرقم. ومفتاح الـ cache هو نص الاستعلام مع SET options لا القيمة." }
    },
    {
      q: { en: "A procedure was fine for months and became slow one morning with no code or data change. What is the most likely trigger?", ar: "procedure كانت سليمة لأشهر وصارت بطيئة صباح يوم دون تغيير في الكود أو البيانات. ما السبب الأرجح؟" },
      options: [
        { en: "The cached plan was evicted overnight and the first caller that morning compiled a plan that suits only their values", ar: "طُرد الـ plan المخزَّن ليلاً، وأول مستدعٍ في الصباح جمّع plan يناسب قيمه هو فقط" },
        { en: "The clustered index became fragmented past 30%", ar: "تجزّأ الـ clustered index بما يتجاوز 30%" },
        { en: "The connection pool was exhausted", ar: "استُنزف الـ connection pool" },
        { en: "The database switched isolation level automatically", ar: "غيّرت قاعدة البيانات مستوى العزل تلقائياً" }
      ],
      correct: 0,
      why: { en: "Restarts, failovers, memory pressure, automatic statistics updates and index rebuilds all evict plans. Whoever calls first afterwards decides the plan for everyone, which is why the change appears to come from nowhere.", ar: "إعادة التشغيل والـ failover وضغط الذاكرة وتحديث الـ statistics التلقائي وإعادة بناء الـ indexes كلها تطرد الـ plans. ومن يستدعي أولاً بعدها يقرر الـ plan للجميع، ولهذا يبدو التغيير وكأنه جاء من العدم." }
    },
    {
      q: { en: "What does copying a parameter into a local variable actually change?", ar: "ما الذي يغيّره فعلياً نسخ الـ parameter إلى متغير محلي؟" },
      options: [
        { en: "It forces a recompile on every execution", ar: "يفرض إعادة تجميع في كل تنفيذ" },
        { en: "It makes the optimizer use the average rows per distinct value instead of a value-specific estimate", ar: "يجعل الـ optimizer يستخدم متوسط الصفوف لكل قيمة مميزة بدل تقدير خاص بالقيمة" },
        { en: "It stops the query from being cached at all", ar: "يمنع تخزين الاستعلام في الـ cache نهائياً" },
        { en: "It makes SQL Server keep one plan per distinct value", ar: "يجعل SQL Server يحتفظ بـ plan لكل قيمة مميزة" }
      ],
      correct: 1,
      why: { en: "The assignment happens at run time, so no value is visible at compile time and the optimizer falls back to the density vector — total rows divided by distinct values. That is the same behaviour as OPTIMIZE FOR UNKNOWN: a permanently average guess, not a fix.", ar: "الإسناد يحدث وقت التنفيذ، فلا تكون أي قيمة مرئية وقت التجميع ويرجع الـ optimizer إلى الـ density vector — إجمالي الصفوف مقسوماً على القيم المميزة. وهو نفس سلوك OPTIMIZE FOR UNKNOWN: تخمين متوسط بشكل دائم لا حل." }
    },
    {
      q: { en: "Which single piece of evidence proves a plan was compiled for different parameter values than the ones it just ran with?", ar: "أي دليل واحد يُثبت أن الـ plan جُمّع لقيم parameters مختلفة عن التي نُفّذ بها للتو؟" },
      options: [
        { en: "A high fragmentation percentage in sys.dm_db_index_physical_stats", ar: "نسبة fragmentation عالية في sys.dm_db_index_physical_stats" },
        { en: "ParameterCompiledValue differing from ParameterRuntimeValue in the actual plan XML", ar: "اختلاف ParameterCompiledValue عن ParameterRuntimeValue في XML الخاص بالـ actual plan" },
        { en: "A high number of batch requests per second", ar: "عدد عالٍ من batch requests في الثانية" },
        { en: "The presence of a clustered index scan operator", ar: "وجود مُشغِّل clustered index scan" }
      ],
      correct: 1,
      why: { en: "The plan XML records both values. When they differ you are looking directly at a plan built for another value. A scan operator alone proves nothing — a scan is the right choice for a large result.", ar: "يسجّل plan XML كلتا القيمتين. وعند اختلافهما تكون تنظر مباشرةً إلى plan بُني لقيمة أخرى. ووجود مُشغِّل scan وحده لا يُثبت شيئاً — فالـ scan خيار صحيح لنتيجة كبيرة." }
    },
    {
      q: { en: "When is OPTION (RECOMPILE) the wrong mitigation?", ar: "متى يكون OPTION (RECOMPILE) معالجة خاطئة؟" },
      options: [
        { en: "On an expensive reporting query run a few times an hour", ar: "على استعلام تقارير مكلف يُنفَّذ بضع مرات في الساعة" },
        { en: "On a cheap query executed thousands of times a second, where compile CPU exceeds execution cost", ar: "على استعلام رخيص يُنفَّذ آلاف المرات في الثانية، حيث تتجاوز تكلفة التجميع تكلفة التنفيذ" },
        { en: "Any time the filter column is skewed", ar: "في أي وقت يكون فيه عمود الترشيح skewed" },
        { en: "Whenever Query Store is enabled", ar: "كلما كان Query Store مفعّلاً" }
      ],
      correct: 1,
      why: { en: "RECOMPILE always produces a fitting plan but charges compile CPU per execution. On a hot, cheap query that cost dominates and can push the instance to full CPU. There, prefer splitting the code path, a covering index, or a justified OPTIMIZE FOR value.", ar: "الـ RECOMPILE ينتج دائماً plan مناسباً لكنه يفرض تكلفة CPU للتجميع في كل تنفيذ. وعلى استعلام رخيص عالي التردد تسيطر هذه التكلفة وقد ترفع الـ instance إلى CPU كامل. هناك يُفضَّل تقسيم المسار البرمجي، أو covering index، أو قيمة OPTIMIZE FOR مبرَّرة." }
    }
  ]
};
```

NEXT: isolation-levels
