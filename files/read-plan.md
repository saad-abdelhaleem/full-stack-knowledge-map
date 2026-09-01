```js
const readPlanLesson = {
  id: "read-plan",
  moduleId: "sql",
  title: { en: "Reading a plan", ar: "قراءة الخطة" },
  summary: {
    en: "An execution plan is the step-by-step recipe SQL Server chose for your query — learn to read it and you stop guessing why a query is slow.",
    ar: "الـ execution plan هي الخطوات التي اختارها SQL Server لتنفيذ الـ query — إذا عرفت قراءتها تتوقف عن التخمين في سبب البطء."
  },
  mins: 19,
  sections: [
    { key: "why", blocks: [
      { t: "p",
        en: "An execution plan is the list of steps SQL Server decided to run to answer your query. You write what you want; the database picks how to get it. The plan is the record of that choice, and it is the only place that tells you which step read 20 million rows to return 37.",
        ar: "الـ execution plan هي قائمة الخطوات التي قرر SQL Server تنفيذها للإجابة على الـ query. أنت تكتب ما تريده، وقاعدة البيانات تختار الطريقة. الخطة هي سجل هذا الاختيار، وهي المكان الوحيد الذي يخبرك أي خطوة قرأت 20 مليون صف لتعيد 37 صفاً."
      },
      { t: "kv", rows: [
        { k: { en: "Execution plan", ar: "Execution plan" },
          v: { en: "The ordered set of physical steps the database runs to produce your result.", ar: "مجموعة الخطوات الفعلية المرتّبة التي تنفّذها قاعدة البيانات لإنتاج النتيجة." } },
        { k: { en: "Operator", ar: "Operator" },
          v: { en: "One step in the plan — a scan, a seek, a join, a sort. Each has a name, a row count and a cost.", ar: "خطوة واحدة داخل الخطة — scan أو seek أو join أو sort. لكل واحدة اسم وعدد صفوف وتكلفة." } },
        { k: { en: "Scan", ar: "Scan" },
          v: { en: "Read every row in a table or index, then throw away the ones that do not match.", ar: "قراءة كل صف في الجدول أو الـ index ثم استبعاد الصفوف غير المطابقة." } },
        { k: { en: "Seek", ar: "Seek" },
          v: { en: "Use the index's sorted order to jump straight to the matching rows and read only those.", ar: "استخدام ترتيب الـ index للقفز مباشرة إلى الصفوف المطابقة وقراءتها وحدها." } },
        { k: { en: "Estimated rows", ar: "Estimated rows" },
          v: { en: "How many rows the optimizer predicted a step would produce, before the query ran.", ar: "عدد الصفوف الذي توقّعه الـ optimizer لخطوة ما قبل تنفيذ الـ query." } },
        { k: { en: "Actual rows", ar: "Actual rows" },
          v: { en: "How many rows that step really produced when the query ran.", ar: "عدد الصفوف الذي أنتجته الخطوة فعلياً عند تنفيذ الـ query." } },
        { k: { en: "Logical read", ar: "Logical read" },
          v: { en: "One 8 KB page fetched by the engine, from memory or from disk. It is the cleanest measure of work done.", ar: "قراءة صفحة واحدة بحجم 8 KB من الذاكرة أو القرص. هي أوضح مقياس لكمية العمل المنفَّذ." } }
      ]},
      { t: "p",
        en: "Think of a phone book sorted by last name. To find everyone called Mansour you can open it at the M section and read a few entries — that is a seek. Or you can start at page one and read every name to the end, keeping the Mansours — that is a scan. Both give the right answer. One reads 37 entries, the other reads two million. The plan tells you which one the database picked.",
        ar: "تخيّل دليل هاتف مرتّب حسب اسم العائلة. للعثور على كل من يُدعى منصور يمكنك فتحه عند حرف M وقراءة بضعة أسطر — هذا هو الـ seek. أو تبدأ من الصفحة الأولى وتقرأ كل اسم حتى النهاية وتحتفظ بمن يُدعى منصور — هذا هو الـ scan. الاثنان يعطيان النتيجة الصحيحة. أحدهما يقرأ 37 سطراً والآخر يقرأ مليونين. الخطة تخبرك أي طريقة اختارتها قاعدة البيانات."
      },
      { t: "p",
        en: "SQL is declarative: the text of your query never says \"use this index\" or \"join in this order\". A component called the query optimizer makes those decisions using statistics — small summaries the engine keeps about how values are distributed in each column. Because you did not make the decision, the only way to understand a slow query is to read the decision the optimizer made.",
        ar: "لغة SQL تصريحية: نص الـ query لا يقول أبداً «استخدم هذا الـ index» أو «نفّذ الـ join بهذا الترتيب». هناك مكوّن اسمه query optimizer يتخذ هذه القرارات اعتماداً على الـ statistics، وهي ملخّصات صغيرة يحتفظ بها المحرّك عن توزيع القيم في كل عمود. وبما أن القرار ليس قرارك، فالطريقة الوحيدة لفهم query بطيء هي قراءة القرار الذي اتخذه الـ optimizer."
      },
      { t: "callout", kind: "note",
        en: "A plan is a decision made from statistics, not from your data as it is right now. If the statistics are stale — say the table grew from 1,000 rows to 20 million since they were last updated — the SQL is fine and the plan is still wrong.",
        ar: "الخطة قرار مبني على الـ statistics، لا على بياناتك كما هي الآن. إذا كانت الـ statistics قديمة — مثلاً الجدول كبر من 1000 صف إلى 20 مليون منذ آخر تحديث لها — فالـ SQL سليم لكن الخطة تبقى خاطئة."
      }
    ]},

    { key: "problem", blocks: [
      { t: "p",
        en: "Here is the query we will follow through the whole lesson. It backs the endpoint GET /customers/42/orders. The Orders table holds 20 million rows. Its clustered index — the index that stores the actual table rows in sorted order — is on OrderId. There is no index on CustomerId.",
        ar: "هذا هو الـ query الذي سنتابعه في الدرس كله. هو خلف الـ endpoint المسمّى GET /customers/42/orders. جدول Orders فيه 20 مليون صف. والـ clustered index الخاص به — وهو الـ index الذي يخزّن صفوف الجدول نفسها مرتّبة — موجود على OrderId. ولا يوجد أي index على CustomerId."
      },
      { t: "code", lang: "sql", label: { en: "The query we will trace", ar: "الـ query الذي سنتتبّعه" },
        code: "SELECT o.OrderId, o.PlacedAt, o.Total\nFROM   dbo.Orders AS o\nWHERE  o.CustomerId = 42\n  AND  o.PlacedAt >= '2026-01-01'\nORDER BY o.PlacedAt DESC;"
      },
      { t: "p",
        en: "The endpoint returns 37 rows and takes 4.2 seconds. Nothing in the SQL text hints at why. The plan does: the top operator is a Clustered Index Scan on Orders with 20,000,000 actual rows, feeding a Filter that keeps 37 of them. In words: the engine read the entire table and threw away 99.9998% of it.",
        ar: "الـ endpoint يعيد 37 صفاً ويستغرق 4.2 ثانية. لا شيء في نص الـ SQL يشرح السبب. لكن الخطة تشرحه: الـ operator الأعلى هو Clustered Index Scan على Orders بعدد actual rows يساوي 20,000,000، يغذّي Filter يحتفظ بـ 37 صفاً منها. بكلمات أخرى: المحرّك قرأ الجدول كاملاً ثم رمى 99.9998% منه."
      },
      { t: "kv", rows: [
        { k: { en: "Before — operator", ar: "قبل — الـ operator" },
          v: { en: "Clustered Index Scan, 20,000,000 actual rows read to return 37.", ar: "Clustered Index Scan، قرأ 20,000,000 صف actual ليعيد 37." } },
        { k: { en: "Before — logical reads", ar: "قبل — logical reads" },
          v: { en: "412,000 pages. At 8 KB a page that is about 3.2 GB of data moved for 37 rows.", ar: "412,000 صفحة. بحجم 8 KB للصفحة يعني نحو 3.2 GB من البيانات تم تحريكها مقابل 37 صفاً." } },
        { k: { en: "Before — duration", ar: "قبل — المدة" },
          v: { en: "4.2 s, and it gets slower every month as the table grows.", ar: "4.2 ثانية، وتزداد بطئاً كل شهر مع نمو الجدول." } },
        { k: { en: "After — operator", ar: "بعد — الـ operator" },
          v: { en: "Index Seek on a new index, 37 actual rows read to return 37.", ar: "Index Seek على index جديد، قرأ 37 صفاً actual ليعيد 37." } },
        { k: { en: "After — logical reads / duration", ar: "بعد — logical reads والمدة" },
          v: { en: "5 pages, 3 ms. Same SQL text, same data — only the plan changed.", ar: "5 صفحات و3 ميلي ثانية. نفس نص الـ SQL ونفس البيانات — الخطة وحدها هي التي تغيّرت." } }
      ]},
      { t: "p",
        en: "The fix was one index: CREATE INDEX IX_Orders_Customer_Placed ON dbo.Orders (CustomerId, PlacedAt) INCLUDE (Total). But the fix is not the point of this lesson. The point is that you could only choose that index because the plan showed you which step was reading everything, and how many rows it was reading versus how many it kept.",
        ar: "الحل كان index واحداً: CREATE INDEX IX_Orders_Customer_Placed ON dbo.Orders (CustomerId, PlacedAt) INCLUDE (Total). لكن الحل ليس موضوع الدرس. الموضوع أنك لم تستطع اختيار هذا الـ index إلا لأن الخطة أرتك أي خطوة تقرأ كل شيء، وكم صفاً تقرأ مقابل كم صفاً تحتفظ به."
      }
    ]},

    { key: "internals", blocks: [
      { t: "p",
        en: "Your query text becomes a plan in four stages. Parse: check the text is valid SQL. Bind: resolve every name — does dbo.Orders exist, does it have a Total column, what type is it. Optimize: search many possible ways to run the query and pick one. Cache: store the winner in the plan cache, an area of memory keyed by the exact query text, so the next identical query skips optimization.",
        ar: "نص الـ query يتحوّل إلى خطة عبر أربع مراحل. Parse: التحقق أن النص SQL صالح. Bind: حلّ كل الأسماء — هل dbo.Orders موجود، هل فيه عمود Total، وما نوعه. Optimize: البحث في طرق تنفيذ كثيرة واختيار واحدة. Cache: تخزين الطريقة الفائزة في الـ plan cache، وهي منطقة ذاكرة مفهرسة بنص الـ query الحرفي، حتى يتخطّى الـ query المطابق التالي مرحلة الـ optimize."
      },
      { t: "p",
        en: "Optimizing is a search, not a calculation. The optimizer generates candidate plans, gives each one a cost — an abstract number estimating CPU and page reads, not seconds — and keeps the cheapest it found before its time budget ran out. Cost is computed from statistics, so the whole choice rests on the estimates being close to reality.",
        ar: "الـ optimize عملية بحث لا عملية حساب. الـ optimizer يولّد خططاً مرشّحة، ويعطي كل واحدة cost — وهو رقم تجريدي يقدّر استهلاك الـ CPU وعدد قراءات الصفحات، وليس ثواني — ثم يحتفظ بالأرخص الذي وجده قبل انتهاء ميزانية وقته. والـ cost محسوب من الـ statistics، لذلك القرار كله يقوم على أن تكون التقديرات قريبة من الواقع."
      },
      { t: "kv", rows: [
        { k: { en: "Optimizer", ar: "Optimizer" },
          v: { en: "The component that searches for a plan and picks the cheapest candidate it found.", ar: "المكوّن الذي يبحث عن خطة ويختار أرخص مرشّح وجده." } },
        { k: { en: "Statistics", ar: "Statistics" },
          v: { en: "A histogram per index or column: value ranges and roughly how many rows fall in each.", ar: "histogram لكل index أو عمود: نطاقات القيم وكم صفاً يقع تقريباً في كل نطاق." } },
        { k: { en: "Cardinality estimate", ar: "Cardinality estimate" },
          v: { en: "The row count the optimizer predicts for a step, read off those statistics.", ar: "عدد الصفوف الذي يتوقّعه الـ optimizer لخطوة ما، مأخوذاً من تلك الـ statistics." } },
        { k: { en: "Plan cache", ar: "Plan cache" },
          v: { en: "Memory holding compiled plans, keyed by query text, so identical queries reuse a plan.", ar: "ذاكرة تحتفظ بالخطط المُجمَّعة، مفهرسة بنص الـ query، ليعيد الـ queries المتطابقة استخدام الخطة." } },
        { k: { en: "Memory grant", ar: "Memory grant" },
          v: { en: "Memory reserved before the query runs for sorting and hashing, sized from the estimates.", ar: "ذاكرة تُحجز قبل تنفيذ الـ query لعمليات الـ sort والـ hash، ويُحدَّد حجمها من التقديرات." } }
      ]},
      { t: "p",
        en: "At run time the plan is a tree of operators that pull rows from each other, one row at a time. The operator at the top asks its child for a row; that child asks its own child; the request travels down to a scan or seek that actually touches data, and a row travels back up. It is a kitchen pass: the plating station asks the grill for the next plate, the grill asks the prep station. Nobody builds the whole result first. This is why you read a plan right to left for data flow — data starts at the rightmost operators and moves left toward the result.",
        ar: "أثناء التنفيذ تكون الخطة شجرة من الـ operators تسحب الصفوف من بعضها صفاً بصف. الـ operator الأعلى يطلب صفاً من ابنه، وذلك الابن يطلب من ابنه، وينزل الطلب حتى يصل إلى scan أو seek يلمس البيانات فعلاً، ثم يصعد الصف عائداً. الأمر يشبه مطبخ مطعم: محطة التقديم تطلب الطبق التالي من محطة الشوي، وهذه تطلب من محطة التحضير. لا أحد يجهّز النتيجة كاملة أولاً. لهذا تُقرأ الخطة من اليمين إلى اليسار لتتبّع تدفّق البيانات — البيانات تبدأ من الـ operators في أقصى اليمين وتتحرك يساراً نحو النتيجة."
      },
      { t: "code", lang: "sql", label: { en: "Getting the actual plan and the real numbers", ar: "الحصول على الخطة الفعلية والأرقام الحقيقية" },
        code: "-- STATISTICS IO prints pages read per table; TIME prints CPU and elapsed ms.\nSET STATISTICS IO, TIME ON;\n\n-- In SSMS press Ctrl+M first: that captures the ACTUAL plan,\n-- which carries real row counts. Ctrl+L gives only the estimated plan.\nSELECT o.OrderId, o.PlacedAt, o.Total\nFROM   dbo.Orders AS o\nWHERE  o.CustomerId = 42\n  AND  o.PlacedAt >= '2026-01-01'\nORDER BY o.PlacedAt DESC;\n\n-- Output before the index:\n-- Table 'Orders'. Scan count 1, logical reads 412000\n-- CPU time = 3980 ms, elapsed time = 4210 ms\n\n-- Output after the index:\n-- Table 'Orders'. Scan count 1, logical reads 5\n-- CPU time = 0 ms, elapsed time = 3 ms"
      },
      { t: "p",
        en: "The single most useful thing in an actual plan is the gap between estimated rows and actual rows on each operator. Hover any operator in SSMS and both numbers appear. If a step estimated 1 row and produced 20 million, every decision made above that step was based on a lie: the join type is wrong, the sort is spilling to disk because too little memory was reserved, and the index choice made no sense. Find the deepest operator — the one furthest right — where the two numbers first diverge badly. That is where the real problem starts; everything left of it is a symptom.",
        ar: "أهم شيء في الخطة الفعلية هو الفارق بين estimated rows و actual rows في كل operator. مرّر المؤشر فوق أي operator في SSMS فيظهر الرقمان. إذا قدّرت خطوة صفاً واحداً وأنتجت 20 مليوناً، فكل قرار فوق تلك الخطوة بُني على معلومة خاطئة: نوع الـ join غير مناسب، والـ sort ينزل إلى القرص لأن الذاكرة المحجوزة قليلة، واختيار الـ index بلا معنى. ابحث عن أعمق operator — الأبعد إلى اليمين — يظهر فيه الفارق الكبير أول مرة. هناك تبدأ المشكلة الحقيقية، وكل ما على يساره مجرد عرَض."
      },
      { t: "p",
        en: "A few operator names carry most of the signal. Index Seek reads only matching rows. Index Scan or Clustered Index Scan reads everything. Key Lookup means the index found the row but not all the columns you asked for, so the engine goes back to the table once per row — fine for 10 rows, disastrous for 100,000. Sort means the rows arrived in the wrong order and must be buffered; if the memory grant was too small it spills to tempdb, a temporary on-disk workspace, and slows down sharply. Hash Match builds an in-memory hash table for a join or grouping — normal for large sets, suspicious when the row counts are small.",
        ar: "بعض أسماء الـ operators تحمل معظم الإشارة. Index Seek يقرأ الصفوف المطابقة فقط. Index Scan أو Clustered Index Scan يقرأ كل شيء. Key Lookup يعني أن الـ index وجد الصف لكن ليس كل الأعمدة المطلوبة، فيعود المحرّك إلى الجدول مرة لكل صف — مقبول لعشرة صفوف، وكارثي لمئة ألف. Sort يعني أن الصفوف وصلت بترتيب خاطئ ويجب تخزينها مؤقتاً؛ وإذا كان الـ memory grant صغيراً ينزل إلى tempdb، وهي مساحة عمل مؤقتة على القرص، فيبطؤ بشكل حاد. Hash Match يبني hash table في الذاكرة لعملية join أو grouping — طبيعي مع مجموعات كبيرة، ومريب حين تكون أعداد الصفوف صغيرة."
      }
    ]},

    { key: "tradeoffs", blocks: [
      { t: "tradeoff",
        pros: {
          en: [
            "Shows exactly which step does the work, so tuning stops being guesswork.",
            "The estimated-vs-actual gap points straight at stale or missing statistics.",
            "Free and always available — no extra tooling to install in production.",
            "A saved plan is portable evidence you can attach to a ticket or review."
          ],
          ar: [
            "تُظهر بالضبط أي خطوة تقوم بالعمل، فيتوقف الضبط عن كونه تخميناً.",
            "الفارق بين estimated و actual يشير مباشرة إلى statistics قديمة أو مفقودة.",
            "مجانية ومتاحة دائماً — لا تحتاج أدوات إضافية في الإنتاج.",
            "الخطة المحفوظة دليل قابل للنقل ترفقه بتذكرة أو بمراجعة."
          ]
        },
        cons: {
          en: [
            "The cost percentages are estimates; the highest-cost operator is often not the slow one.",
            "Capturing an actual plan adds overhead, so you avoid it on the hottest paths.",
            "Plans for big queries are wide and hard to read without practice.",
            "The plan you get in SSMS can differ from the one the app gets."
          ],
          ar: [
            "نسب الـ cost تقديرية، والـ operator الأعلى تكلفة كثيراً ما لا يكون البطيء فعلاً.",
            "التقاط الخطة الفعلية يضيف overhead، لذا تتجنّبه في أكثر المسارات ازدحاماً.",
            "خطط الـ queries الكبيرة عريضة وصعبة القراءة بلا تمرين.",
            "الخطة التي تراها في SSMS قد تختلف عن الخطة التي يحصل عليها التطبيق."
          ]
        },
        limits: {
          en: [
            "A plan explains one execution, not the average of a thousand.",
            "It shows what the engine did, never why the query was written that way.",
            "Blocking and waiting on locks do not appear as an operator.",
            "Estimated plans carry no actual row counts at all."
          ],
          ar: [
            "الخطة تشرح تنفيذاً واحداً، لا متوسط ألف تنفيذ.",
            "تُظهر ما فعله المحرّك، ولا تُظهر أبداً لماذا كُتب الـ query بهذا الشكل.",
            "الـ blocking والانتظار على الـ locks لا يظهران كـ operator.",
            "الخطط التقديرية لا تحمل أي actual row counts."
          ]
        },
        alts: {
          en: [
            "Query Store: keeps plans and runtime stats per query over time, including regressions.",
            "Extended Events: capture the plans of the slowest real executions in production.",
            "sys.dm_exec_query_stats: rank cached queries by total CPU or reads first, then read plans.",
            "Application-level tracing (OpenTelemetry) to confirm the database is even the bottleneck."
          ],
          ar: [
            "Query Store: يحفظ الخطط وإحصاءات التنفيذ لكل query عبر الزمن، بما فيها حالات التراجع.",
            "Extended Events: التقاط خطط أبطأ التنفيذات الحقيقية في الإنتاج.",
            "sys.dm_exec_query_stats: رتّب الـ queries المخزّنة حسب إجمالي الـ CPU أو القراءات أولاً ثم اقرأ الخطط.",
            "التتبّع على مستوى التطبيق (OpenTelemetry) للتأكد أصلاً أن قاعدة البيانات هي عنق الزجاجة."
          ]
        }
      }
    ]},

    { key: "mistakes", blocks: [
      { t: "mistake",
        title: { en: "Tuning from the estimated plan", ar: "الضبط اعتماداً على الخطة التقديرية" },
        body: {
          en: "A developer pressed Ctrl+L in SSMS, saw an Index Seek with 12 estimated rows, and closed the ticket saying the query was fine. The estimated plan never runs the query, so those 12 rows were a prediction from statistics last updated when the table had 1,000 rows. The actual plan showed the same seek producing 4.1 million rows because the seek predicate matched a whole date range. Always capture the actual plan (Ctrl+M) before you conclude anything.",
          ar: "مطوّر ضغط Ctrl+L في SSMS ورأى Index Seek بتقدير 12 صفاً فأغلق التذكرة قائلاً إن الـ query سليم. الخطة التقديرية لا تنفّذ الـ query أصلاً، لذا كانت الـ 12 صفاً توقّعاً من statistics آخر تحديث لها كان والجدول فيه 1000 صف. الخطة الفعلية أظهرت أن نفس الـ seek ينتج 4.1 مليون صف لأن شرط الـ seek يغطي نطاق تواريخ كاملاً. التقط دائماً الخطة الفعلية (Ctrl+M) قبل أن تستنتج شيئاً."
        }
      },
      { t: "mistake",
        title: { en: "Chasing the highest cost percentage", ar: "مطاردة أعلى نسبة cost" },
        body: {
          en: "The plan showed a Sort at 87% cost, so the team spent a sprint removing the ORDER BY. Runtime dropped by 4%. The real problem was a Key Lookup at 2% cost that executed 240,000 times. Cost percentages come from the optimizer's estimates, not from measurement, so an operator with a bad estimate is shown as cheap no matter how long it actually runs. Rank operators by actual rows and by execution count, not by the percentage badge.",
          ar: "أظهرت الخطة Sort بنسبة 87% من الـ cost، فقضى الفريق sprint كاملاً في إزالة الـ ORDER BY. انخفض زمن التنفيذ 4% فقط. المشكلة الحقيقية كانت Key Lookup بنسبة 2% لكنه نُفّذ 240,000 مرة. نسب الـ cost تأتي من تقديرات الـ optimizer لا من قياس فعلي، لذا يظهر الـ operator ذو التقدير الخاطئ رخيصاً مهما طال تنفيذه. رتّب الـ operators حسب actual rows وعدد مرات التنفيذ، لا حسب شارة النسبة."
        }
      },
      { t: "mistake",
        title: { en: "Treating every scan as a bug", ar: "اعتبار كل scan خطأً" },
        body: {
          en: "A nightly report over a 900-row Countries table showed a Clustered Index Scan. Someone added three indexes to force seeks. Nothing got faster, writes got slower, and the extra indexes now need maintenance. A scan over a small table is the correct plan — reading 900 rows sequentially is cheaper than walking an index and jumping back for each row. A scan is only a problem when it reads far more rows than the query returns.",
          ar: "تقرير ليلي على جدول Countries فيه 900 صف أظهر Clustered Index Scan. أضاف أحدهم ثلاثة indexes لإجبار المحرّك على الـ seek. لم يتحسّن شيء، وصارت عمليات الكتابة أبطأ، والـ indexes الإضافية تحتاج صيانة الآن. الـ scan على جدول صغير هو الخطة الصحيحة — قراءة 900 صف بالتسلسل أرخص من المرور عبر index والعودة للجدول لكل صف. الـ scan يصبح مشكلة فقط حين يقرأ صفوفاً أكثر بكثير مما يعيده الـ query."
        }
      },
      { t: "mistake",
        title: { en: "Reproducing in SSMS with different settings", ar: "إعادة الإنتاج في SSMS بإعدادات مختلفة" },
        body: {
          en: "The query ran in 40 ms in SSMS and 6 s from the API, so the team blamed the network. The cause was SET ARITHABORT: SSMS sets it ON by default and the .NET client leaves it OFF. That difference makes the two connections use separate entries in the plan cache, and the app's entry held a plan compiled for a very different parameter value. Reproduce with the app's exact SET options, or read the plan the app actually used from the cache.",
          ar: "الـ query كان ينفّذ في 40 ميلي ثانية داخل SSMS وفي 6 ثوانٍ من الـ API، فألقى الفريق اللوم على الشبكة. السبب كان SET ARITHABORT: يضعه SSMS ON افتراضياً بينما يتركه عميل .NET على OFF. هذا الفرق يجعل الاتصالين يستخدمان مدخلين منفصلين في الـ plan cache، والمدخل الخاص بالتطبيق كان يحمل خطة مُجمَّعة لقيمة parameter مختلفة تماماً. أعِد الإنتاج بنفس SET options الخاصة بالتطبيق، أو اقرأ من الـ cache الخطة التي استخدمها التطبيق فعلاً."
        },
        fix: "SELECT qs.execution_count, qs.total_logical_reads, qp.query_plan, st.text\nFROM sys.dm_exec_query_stats AS qs\nCROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) AS st\nCROSS APPLY sys.dm_exec_query_plan(qs.plan_handle) AS qp\nWHERE st.text LIKE '%FROM dbo.Orders%'\nORDER BY qs.total_logical_reads DESC;"
      }
    ]},

    { key: "interview", blocks: [
      { t: "qa", level: "junior",
        q: { en: "What is the difference between an index seek and an index scan?", ar: "ما الفرق بين index seek و index scan؟" },
        a: {
          en: "A seek uses the index's sorted order to jump straight to the rows that match and reads only those. A scan reads every row in the index or table and filters afterwards. So a seek's cost depends on how many rows match, while a scan's cost depends on how big the table is. On a 20-million-row table a seek returning 37 rows touches a handful of pages; the scan touches hundreds of thousands.",
          ar: "الـ seek يستخدم ترتيب الـ index للقفز مباشرة إلى الصفوف المطابقة ويقرأها وحدها. والـ scan يقرأ كل صف في الـ index أو الجدول ثم يفلتر بعد ذلك. لذلك تكلفة الـ seek تعتمد على عدد الصفوف المطابقة، بينما تكلفة الـ scan تعتمد على حجم الجدول. على جدول فيه 20 مليون صف، الـ seek الذي يعيد 37 صفاً يلمس بضع صفحات، بينما الـ scan يلمس مئات الآلاف."
        }
      },
      { t: "qa", level: "mid",
        q: { en: "Estimated plan or actual plan — which do you ask for, and why?", ar: "الخطة التقديرية أم الفعلية — أيهما تطلب ولماذا؟" },
        a: {
          en: "Actual, almost always. The estimated plan shows the shape the optimizer chose but every row count in it is a prediction. The actual plan runs the query and records the real row counts, how many times each operator executed, and whether a sort spilled to disk. The gap between predicted and real is the main thing I am looking for, and the estimated plan cannot show a gap at all.",
          ar: "الفعلية في الغالب دائماً. الخطة التقديرية تُظهر الشكل الذي اختاره الـ optimizer لكن كل عدد صفوف فيها توقّع. الخطة الفعلية تنفّذ الـ query وتسجّل أعداد الصفوف الحقيقية وعدد مرات تنفيذ كل operator وما إذا كان الـ sort قد نزل إلى القرص. الفارق بين المتوقّع والحقيقي هو ما أبحث عنه أساساً، والخطة التقديرية لا تُظهر هذا الفارق إطلاقاً."
        }
      },
      { t: "qa", level: "mid",
        q: { en: "You see a Key Lookup executed 200,000 times. What is happening and what do you do?", ar: "ترى Key Lookup نُفّذ 200,000 مرة. ماذا يحدث وماذا تفعل؟" },
        a: {
          en: "The optimizer used a non-clustered index to find the matching rows, but that index does not contain every column the query selects. So for each row it goes back to the clustered index to fetch the missing columns — 200,000 separate round trips inside the engine. The fix is to make the index cover the query: add the missing columns as INCLUDE columns, which stores them in the index leaf without making them part of the sort key. Or select fewer columns if the query is asking for ones nobody uses.",
          ar: "الـ optimizer استخدم non-clustered index للعثور على الصفوف المطابقة، لكن هذا الـ index لا يحتوي كل الأعمدة التي يطلبها الـ query. لذلك يعود لكل صف إلى الـ clustered index لجلب الأعمدة الناقصة — 200,000 رحلة منفصلة داخل المحرّك. الحل أن تجعل الـ index يغطي الـ query: أضف الأعمدة الناقصة كـ INCLUDE columns، وهي تُخزَّن في ورقة الـ index دون أن تصبح جزءاً من مفتاح الترتيب. أو اطلب أعمدة أقل إذا كان الـ query يجلب أعمدة لا يستخدمها أحد."
        }
      },
      { t: "qa", level: "senior",
        q: { en: "A plan estimates 1 row and produces 4 million. What does that break downstream?", ar: "خطة تقدّر صفاً واحداً وتنتج 4 ملايين. ماذا يفسد ذلك في الخطوات التالية؟" },
        a: {
          en: "Everything above that operator was sized for one row. The optimizer probably picked a Nested Loops join, which is right for a few rows and terrible for millions because it repeats the inner side once per outer row. The memory grant for any sort or hash was computed for one row, so the sort spills to tempdb on disk. And it may have chosen a seek plus lookup instead of a scan, turning four million lookups into the dominant cost. I would find the source of the bad estimate first — usually stale statistics, a function wrapped around a column, or a multi-statement table-valued function that always guesses a fixed row count — rather than patching the join.",
          ar: "كل ما فوق ذلك الـ operator صُمِّم لصف واحد. غالباً اختار الـ optimizer عملية Nested Loops join، وهي مناسبة لعدد صفوف قليل وسيئة جداً للملايين لأنها تكرّر الجانب الداخلي مرة لكل صف خارجي. والـ memory grant لأي sort أو hash حُسِب لصف واحد، فينزل الـ sort إلى tempdb على القرص. وربما اختار seek مع lookup بدل الـ scan، فتصير أربعة ملايين lookup هي التكلفة الغالبة. سأبحث أولاً عن سبب التقدير الخاطئ — عادةً statistics قديمة، أو دالة ملفوفة حول عمود، أو multi-statement table-valued function تخمّن دائماً عدداً ثابتاً من الصفوف — بدل ترقيع الـ join."
        }
      },
      { t: "qa", level: "senior",
        q: { en: "Why can the same query be fast in SSMS and slow from the application?", ar: "لماذا يكون نفس الـ query سريعاً في SSMS وبطيئاً من التطبيق؟" },
        a: {
          en: "Usually they are not using the same plan. Plan cache entries are keyed partly by SET options, and SSMS defaults ARITHABORT to ON while most .NET clients leave it OFF, so the two get separate cached plans. The app's plan may have been compiled for a parameter value with a very different row count — that is parameter sniffing. Other causes are a different schema being used by default, or the app running inside a transaction that holds locks. I confirm by pulling the app's plan from sys.dm_exec_query_stats rather than re-running it myself.",
          ar: "غالباً لأنهما لا يستخدمان نفس الخطة. مفاتيح الـ plan cache تتضمن SET options، وSSMS يضع ARITHABORT على ON افتراضياً بينما معظم عملاء .NET يتركونه OFF، فيحصل كل منهما على خطة مخزّنة منفصلة. وقد تكون خطة التطبيق مُجمَّعة لقيمة parameter بعدد صفوف مختلف تماماً — وهذا هو الـ parameter sniffing. وهناك أسباب أخرى مثل اختلاف الـ schema الافتراضي، أو تنفيذ التطبيق داخل transaction يحتفظ بـ locks. أتأكد بسحب خطة التطبيق من sys.dm_exec_query_stats بدل إعادة التنفيذ بنفسي."
        }
      },
      { t: "qa", level: "staff",
        q: { en: "How do you stop plan regressions from reaching production in the first place?", ar: "كيف تمنع تراجع الخطط من الوصول إلى الإنتاج أصلاً؟" },
        a: {
          en: "I make plan quality a visible, owned signal instead of something one person notices during an incident. Turn on Query Store so every plan change is recorded with before-and-after runtime, and add an alert on regressed queries rather than waiting for a page. Put a check in CI that runs the top N queries against a production-sized restored database and fails the build if logical reads jump beyond a threshold — reads are stable, wall-clock time on shared CI machines is not. Make plans part of code review: any pull request that changes a query or an index attaches the before and after plan. Finally, agree as a team on where forcing a plan is allowed, so it stays a deliberate, documented exception with an expiry date instead of a permanent hidden patch.",
          ar: "أجعل جودة الخطط إشارة ظاهرة لها مالك، بدل أن تكون شيئاً يلاحظه شخص واحد أثناء حادثة. أشغّل Query Store ليُسجَّل كل تغيّر في الخطة مع زمن التنفيذ قبله وبعده، وأضيف تنبيهاً على الـ queries المتراجعة بدل انتظار مكالمة الطوارئ. أضع فحصاً في الـ CI ينفّذ أهم N من الـ queries على نسخة مستعادة بحجم الإنتاج ويُفشل الـ build إذا قفزت الـ logical reads فوق حد معيّن — القراءات مستقرة، أما الزمن الفعلي على أجهزة CI المشتركة فلا. وأجعل الخطط جزءاً من مراجعة الكود: أي pull request يغيّر query أو index يرفق الخطة قبل وبعد. وأخيراً نتفق كفريق على الحالات المسموح فيها بفرض خطة، لتبقى استثناءً مقصوداً وموثّقاً وله تاريخ انتهاء بدل أن يصير ترقيعاً دائماً مخفياً."
        }
      }
    ]},

    { key: "codereview", blocks: [
      { t: "review", severity: "high",
        title: { en: "A function around the column kills the seek", ar: "دالة حول العمود تلغي الـ seek" },
        bad: "SELECT o.OrderId, o.Total\nFROM   dbo.Orders AS o\nWHERE  YEAR(o.PlacedAt) = 2026\n  AND  o.CustomerId = 42;",
        good: "SELECT o.OrderId, o.Total\nFROM   dbo.Orders AS o\nWHERE  o.PlacedAt >= '2026-01-01'\n  AND  o.PlacedAt <  '2027-01-01'\n  AND  o.CustomerId = 42;",
        why: {
          en: "An index stores PlacedAt values in sorted order, not YEAR(PlacedAt) values. Once the column is wrapped in a function the engine cannot compare the index keys to 2026, so it computes YEAR() for every row — that forces a full scan. The plan shows Clustered Index Scan with 20 million actual rows. Rewriting it as a range on the raw column lets the same index seek to the first matching row: 37 actual rows, 5 logical reads. A predicate written so an index can be used this way is called SARGable, short for search-argument-able.",
          ar: "الـ index يخزّن قيم PlacedAt مرتّبة، لا قيم YEAR(PlacedAt). وبمجرد لفّ العمود داخل دالة لا يستطيع المحرّك مقارنة مفاتيح الـ index بالرقم 2026، فيحسب YEAR() لكل صف — وهذا يفرض scan كاملاً. تُظهر الخطة Clustered Index Scan بـ 20 مليون صف actual. وإعادة كتابته كنطاق على العمود الخام تتيح لنفس الـ index أن يعمل seek إلى أول صف مطابق: 37 صفاً actual و5 logical reads. الشرط المكتوب بحيث يمكن للـ index استخدامه يُسمّى SARGable، اختصاراً لـ search-argument-able."
        }
      },
      { t: "review", severity: "medium",
        title: { en: "SELECT * turns a covering index into a lookup storm", ar: "SELECT * يحوّل الـ covering index إلى عاصفة lookups" },
        bad: "// Repository method used by the orders list endpoint\nvar orders = await db.Orders\n    .Where(o => o.CustomerId == customerId)\n    .ToListAsync();   // materialises all 24 columns",
        good: "// Project only what the list screen renders\nvar orders = await db.Orders\n    .Where(o => o.CustomerId == customerId)\n    .Select(o => new OrderListItem(o.OrderId, o.PlacedAt, o.Total))\n    .ToListAsync();",
        why: {
          en: "IX_Orders_Customer_Placed includes OrderId, PlacedAt and Total, so the three-column version is answered from the index alone. Loading the whole entity asks for 24 columns, 21 of which are not in the index, so the plan adds a Key Lookup that runs once per row. On a customer with 8,000 orders that is 8,000 extra lookups and about 25,000 logical reads instead of 40. The list screen shows three columns, so nothing is lost by projecting.",
          ar: "الـ index المسمّى IX_Orders_Customer_Placed يحتوي OrderId و PlacedAt و Total، لذلك تُجاب النسخة ذات الأعمدة الثلاثة من الـ index وحده. أما تحميل الـ entity كاملاً فيطلب 24 عموداً، 21 منها ليست في الـ index، فتضيف الخطة Key Lookup ينفَّذ مرة لكل صف. مع عميل لديه 8000 order يعني ذلك 8000 lookup إضافياً ونحو 25,000 logical reads بدل 40. وشاشة القائمة تعرض ثلاثة أعمدة فقط، فلا شيء يُفقد بالـ projection."
        }
      }
    ]},

    { key: "sysdesign", blocks: [
      { t: "p",
        en: "In a real system, plan reading is not a one-off debugging trick — it is a step in a loop that runs continuously. Something reports slowness (an SLO alert, a customer ticket), you find which query is responsible, you read its plan, you change an index or the query, and you verify the plan changed the way you expected. The database is usually the first shared resource to saturate, so this loop is the one most backend teams run most often.",
        ar: "في نظام حقيقي، قراءة الخطط ليست حيلة تصحيح لمرة واحدة، بل خطوة في حلقة تعمل باستمرار. يظهر بلاغ بالبطء (تنبيه SLO أو تذكرة عميل)، فتجد أي query هو السبب، وتقرأ خطته، وتغيّر index أو الـ query، ثم تتحقق أن الخطة تغيّرت كما توقّعت. قاعدة البيانات عادةً أول مورد مشترك يصل إلى حد التشبّع، لذلك هذه الحلقة هي الأكثر تكراراً لدى معظم فرق الـ backend."
      },
      { t: "ul",
        en: [
          "Read-heavy API on a large table: the plan tells you whether an index seek or a scan backs your busiest endpoint.",
          "Reporting query added next to an OLTP workload: a plan with a large memory grant can starve short transactions of memory.",
          "After a bulk import: statistics go stale within minutes, plans regress, and the same query suddenly scans.",
          "Multi-tenant database: one tenant with a million rows and one with ten share a cached plan — read both plans, not one.",
          "During a database version upgrade: the cardinality estimator changes, so a set of plans shifts on the same day."
        ],
        ar: [
          "API كثيف القراءة على جدول كبير: الخطة تخبرك هل يقف خلف أكثر endpoint ازدحاماً عملية seek أم scan.",
          "query تقارير يُضاف بجانب حِمل OLTP: خطة بـ memory grant كبير قد تحرم الـ transactions القصيرة من الذاكرة.",
          "بعد استيراد دفعة بيانات: تصبح الـ statistics قديمة خلال دقائق، وتتراجع الخطط، ويبدأ نفس الـ query بعمل scan فجأة.",
          "قاعدة بيانات متعددة المستأجرين: مستأجر بمليون صف وآخر بعشرة يتشاركان خطة مخزّنة — اقرأ الخطتين لا خطة واحدة.",
          "أثناء ترقية إصدار قاعدة البيانات: يتغيّر الـ cardinality estimator، فتتبدّل مجموعة من الخطط في اليوم نفسه."
        ]
      },
      { t: "callout", kind: "tip",
        en: "Attach the before and after plan to the pull request that adds an index. It turns \"trust me, it is faster\" into evidence the next person can check when the query slows down again a year later.",
        ar: "أرفق الخطة قبل وبعد في الـ pull request الذي يضيف index. هذا يحوّل عبارة «ثق بي، صار أسرع» إلى دليل يستطيع الشخص التالي مراجعته حين يبطؤ الـ query مجدداً بعد سنة."
      }
    ]},

    { key: "perf", blocks: [
      { t: "kv", rows: [
        { k: { en: "Database", ar: "قاعدة البيانات" },
          v: { en: "Logical reads are the truest measure of query work: 412,000 pages before the index, 5 after. Unlike duration, they do not change with server load.", ar: "الـ logical reads أصدق مقياس لعمل الـ query: 412,000 صفحة قبل الـ index و5 بعده. وخلافاً للمدة، لا تتأثر بحِمل السيرفر." } },
        { k: { en: "Memory", ar: "الذاكرة" },
          v: { en: "Sorts and hash joins reserve memory up front from the estimate. A wrong estimate means a spill to tempdb — the plan marks the operator with a warning triangle.", ar: "عمليات الـ sort والـ hash join تحجز ذاكرة مسبقاً بناءً على التقدير. والتقدير الخاطئ يعني spill إلى tempdb — وتضع الخطة مثلث تحذير على الـ operator." } },
        { k: { en: "CPU", ar: "المعالج" },
          v: { en: "Scanning 20 million rows burned 3.98 s of CPU for 37 results. That CPU is taken from every other query on the same server.", ar: "الـ scan على 20 مليون صف استهلك 3.98 ثانية CPU مقابل 37 نتيجة. وهذا الـ CPU يُؤخذ من كل query آخر على نفس السيرفر." } },
        { k: { en: "Latency", ar: "زمن الاستجابة" },
          v: { en: "Plan-driven latency is bimodal: cache hit on a good plan gives 3 ms, a recompile with a bad parameter gives seconds. That shows up as a bad p99, not a bad average.", ar: "زمن الاستجابة المرتبط بالخطة ثنائي النمط: إصابة الـ cache بخطة جيدة تعطي 3 ميلي ثانية، وإعادة تجميع بقيمة parameter سيئة تعطي ثواني. وهذا يظهر في p99 السيئ لا في المتوسط." } },
        { k: { en: "Scalability", ar: "قابلية التوسّع" },
          v: { en: "A seek's cost grows with rows matched; a scan's grows with table size. The scan plan is the one that fails on the day the table doubles.", ar: "تكلفة الـ seek تنمو مع عدد الصفوف المطابقة، وتكلفة الـ scan تنمو مع حجم الجدول. خطة الـ scan هي التي تنهار يوم يتضاعف الجدول." } }
      ]}
    ]},

    { key: "debug", blocks: [
      { t: "ul",
        en: [
          "SET STATISTICS IO, TIME ON — look at logical reads per table; a table with far more reads than rows returned is your suspect.",
          "Ctrl+M in SSMS (Include Actual Execution Plan) — hover each operator and compare Estimated Number of Rows with Actual Number of Rows.",
          "Query Store (right-click database → Query Store → Top Resource Consuming Queries) — shows which query burns the most reads and whether its plan changed recently.",
          "sys.dm_exec_query_stats joined to sys.dm_exec_query_plan — gives you the plan the application actually ran, not the one SSMS would compile.",
          "sys.dm_db_missing_index_details — read it as a hint about which columns were filtered, never as an index script to run blindly."
        ],
        ar: [
          "SET STATISTICS IO, TIME ON — انظر إلى الـ logical reads لكل جدول؛ الجدول الذي قراءاته أكثر بكثير من الصفوف المعادة هو المشتبه به.",
          "Ctrl+M في SSMS (Include Actual Execution Plan) — مرّر فوق كل operator وقارن Estimated Number of Rows بـ Actual Number of Rows.",
          "Query Store (كليك يمين على قاعدة البيانات ← Query Store ← Top Resource Consuming Queries) — يُظهر أي query يستهلك أكثر القراءات وهل تغيّرت خطته مؤخراً.",
          "sys.dm_exec_query_stats مع sys.dm_exec_query_plan — يعطيك الخطة التي نفّذها التطبيق فعلاً، لا التي سيجمّعها SSMS.",
          "sys.dm_db_missing_index_details — اقرأه كإشارة إلى الأعمدة التي جرى الفلترة عليها، لا كسكربت index تنفّذه بلا تفكير."
        ]
      },
      { t: "callout", kind: "tip",
        en: "Right-click the leftmost operator, choose \"Show Execution Plan XML\", and search the text for the word \"Warnings\". Spills to tempdb, implicit type conversions and missing statistics all appear there, and all three are invisible in the graphical view unless you notice a small yellow triangle.",
        ar: "اضغط كليك يمين على الـ operator في أقصى اليسار واختر «Show Execution Plan XML»، ثم ابحث في النص عن كلمة Warnings. عمليات الـ spill إلى tempdb والتحويلات الضمنية للأنواع والـ statistics المفقودة تظهر كلها هناك، وهي غير مرئية في العرض الرسومي إلا إذا لاحظت مثلثاً أصفر صغيراً."
      }
    ]},

    { key: "realworld", blocks: [
      { t: "p",
        en: "Plan reading matters most wherever one database serves both interactive traffic and heavy queries on the same tables. In those systems a single bad plan does not just slow one endpoint — it consumes CPU and memory that every other query needs, so one scan becomes a site-wide slowdown.",
        ar: "قراءة الخطط تهم أكثر ما تهم حيث تخدم قاعدة بيانات واحدة حركة تفاعلية و queries ثقيلة على نفس الجداول. في هذه الأنظمة لا تبطئ الخطة السيئة endpoint واحداً فقط — بل تستهلك CPU وذاكرة يحتاجها كل query آخر، فيتحوّل scan واحد إلى بطء يعمّ الموقع كله."
      },
      { t: "ul",
        en: [
          "E-commerce order history: the same query is trivial for a new customer and enormous for a customer with 40,000 orders, so one cached plan cannot suit both.",
          "Payment and ledger systems: reports run against the same tables as live transactions, and a report's memory grant can stall payments.",
          "SaaS platforms with per-tenant data: tenant size varies by orders of magnitude, which is the classic source of a plan that fits the small tenants and destroys the large one.",
          "Analytics dashboards over an operational database: wide date-range filters make cardinality estimates unreliable, so plans flip between hash and loop joins as data grows."
        ],
        ar: [
          "سجل الطلبات في التجارة الإلكترونية: نفس الـ query تافه لعميل جديد وضخم لعميل لديه 40,000 order، فلا تصلح خطة مخزّنة واحدة للحالتين.",
          "أنظمة المدفوعات والدفاتر المحاسبية: التقارير تعمل على نفس جداول المعاملات الحية، وقد يوقف الـ memory grant الخاص بتقرير عمليات الدفع.",
          "منصات SaaS ببيانات لكل مستأجر: أحجام المستأجرين تتفاوت بمراتب كبيرة، وهذا المصدر الكلاسيكي لخطة تناسب المستأجرين الصغار وتدمّر الكبير.",
          "لوحات التحليلات فوق قاعدة بيانات تشغيلية: فلاتر النطاقات الزمنية الواسعة تجعل تقديرات الـ cardinality غير موثوقة، فتتنقّل الخطط بين hash join و loop join مع نمو البيانات."
        ]
      }
    ]},

    { key: "exercises", blocks: [
      { t: "ex", diff: "easy",
        en: "Create a table with 500,000 rows and no index besides the primary key. Run a WHERE on a non-key column with Ctrl+M on. Record the operator name, actual rows and logical reads. You are done when you can state, in one sentence, how many rows were read per row returned.",
        ar: "أنشئ جدولاً فيه 500,000 صف بلا index غير الـ primary key. نفّذ WHERE على عمود غير مفتاحي مع تفعيل Ctrl+M. سجّل اسم الـ operator وعدد actual rows وعدد logical reads. تنتهي حين تستطيع أن تقول في جملة واحدة كم صفاً قُرئ مقابل كل صف أُعيد."
      },
      { t: "ex", diff: "medium",
        en: "Take the same query and add a non-clustered index on the filtered column only. Re-run and capture the plan. It should now show an Index Seek plus a Key Lookup. Then add the selected columns as INCLUDE and re-run. You are done when the Key Lookup is gone and you can show the logical read count for all three versions.",
        ar: "خذ نفس الـ query وأضف non-clustered index على عمود الفلترة فقط. أعد التنفيذ والتقط الخطة. يجب أن تُظهر الآن Index Seek مع Key Lookup. ثم أضف الأعمدة المطلوبة كـ INCLUDE وأعد التنفيذ. تنتهي حين يختفي الـ Key Lookup وتستطيع عرض عدد الـ logical reads للنسخ الثلاث."
      },
      { t: "ex", diff: "hard",
        en: "Deliberately create a bad estimate: insert two million rows, then run UPDATE STATISTICS with a tiny sample, or disable auto-update and load the rows in bulk. Run a join and find the operator where estimated and actual first diverge by more than 100x. You are done when you can explain which downstream choice (join type, memory grant, or index choice) that gap caused.",
        ar: "اصنع تقديراً خاطئاً عن قصد: أدخل مليوني صف ثم نفّذ UPDATE STATISTICS بعيّنة صغيرة جداً، أو عطّل التحديث التلقائي وحمّل الصفوف دفعة واحدة. نفّذ join وابحث عن الـ operator الذي يتباعد فيه estimated و actual أول مرة بأكثر من 100 ضعف. تنتهي حين تستطيع شرح أي قرار لاحق (نوع الـ join أو الـ memory grant أو اختيار الـ index) سببه ذلك الفارق."
      },
      { t: "ex", diff: "senior",
        en: "Enable Query Store on a copy of a real database. Pick the top query by total logical reads, capture its plan, propose one change, apply it, and produce a one-page write-up with the before and after plans, the read counts, and the risk the change carries for writes. You are done when a colleague can review the decision without re-running anything themselves.",
        ar: "فعّل Query Store على نسخة من قاعدة بيانات حقيقية. اختر أعلى query من حيث إجمالي الـ logical reads، والتقط خطته، واقترح تغييراً واحداً، ثم طبّقه، وأنتج صفحة واحدة فيها الخطتان قبل وبعد وأعداد القراءات والمخاطر التي يحملها التغيير على عمليات الكتابة. تنتهي حين يستطيع زميل مراجعة القرار دون إعادة تنفيذ أي شيء بنفسه."
      }
    ]},

    { key: "refs", blocks: [
      { t: "ref", label: { en: "Execution plans — official overview", ar: "Execution plans — نظرة رسمية" },
        url: "https://learn.microsoft.com/en-us/sql/relational-databases/performance/execution-plans",
        meta: { en: "Docs", ar: "توثيق" } },
      { t: "ref", label: { en: "Display an actual execution plan", ar: "عرض الخطة الفعلية للتنفيذ" },
        url: "https://learn.microsoft.com/en-us/sql/relational-databases/performance/display-an-actual-execution-plan",
        meta: { en: "Docs", ar: "توثيق" } },
      { t: "ref", label: { en: "Cardinality estimation in SQL Server", ar: "تقدير الـ cardinality في SQL Server" },
        url: "https://learn.microsoft.com/en-us/sql/relational-databases/performance/cardinality-estimation-sql-server",
        meta: { en: "Docs", ar: "توثيق" } },
      { t: "ref", label: { en: "Execution Plan Reference — every operator explained", ar: "مرجع الـ Execution Plan — شرح كل operator" },
        url: "https://sqlserverfast.com/epr/",
        meta: { en: "Reference", ar: "مرجع" } }
    ]}
  ],
  quiz: [
    {
      q: { en: "What does the gap between estimated rows and actual rows on an operator tell you?", ar: "ماذا يخبرك الفارق بين estimated rows و actual rows على operator؟" },
      options: [
        { en: "The query returned the wrong results", ar: "أن الـ query أعاد نتائج خاطئة" },
        { en: "The optimizer's row prediction was wrong, so every choice made above that step is suspect", ar: "أن توقّع الـ optimizer لعدد الصفوف كان خاطئاً، فكل قرار فوق تلك الخطوة مشكوك فيه" },
        { en: "The server ran out of CPU during execution", ar: "أن السيرفر نفد منه الـ CPU أثناء التنفيذ" },
        { en: "The index needs to be rebuilt because of fragmentation", ar: "أن الـ index يحتاج إعادة بناء بسبب التجزئة" }
      ],
      correct: 1,
      why: { en: "Join type, memory grant and index choice are all derived from the estimate. A wrong estimate makes all of them wrong, even though the results are still correct.", ar: "نوع الـ join والـ memory grant واختيار الـ index كلها مشتقّة من التقدير. والتقدير الخاطئ يجعلها كلها خاطئة، رغم أن النتائج تبقى صحيحة." }
    },
    {
      q: { en: "Why is the operator with the highest cost percentage often not the slow one?", ar: "لماذا لا يكون الـ operator الأعلى نسبة cost هو البطيء غالباً؟" },
      options: [
        { en: "Cost percentages are randomised to avoid over-tuning", ar: "نسب الـ cost عشوائية لتجنّب المبالغة في الضبط" },
        { en: "Cost only counts CPU, never disk reads", ar: "الـ cost يحسب الـ CPU فقط ولا يحسب قراءات القرص" },
        { en: "Cost comes from the optimizer's estimates, so an operator with a bad estimate looks cheap no matter how long it runs", ar: "الـ cost يأتي من تقديرات الـ optimizer، فيبدو الـ operator ذو التقدير الخاطئ رخيصاً مهما طال تنفيذه" },
        { en: "Cost is measured only on the first execution and never updated", ar: "الـ cost يُقاس في أول تنفيذ فقط ولا يُحدَّث أبداً" }
      ],
      correct: 2,
      why: { en: "Cost percentages are estimates, not measurements. Rank operators by actual rows and by how many times they executed instead.", ar: "نسب الـ cost تقديرات لا قياسات. رتّب الـ operators حسب actual rows وعدد مرات تنفيذها بدلاً منها." }
    },
    {
      q: { en: "A Key Lookup appears with 200,000 executions. What is the direct cause?", ar: "يظهر Key Lookup بـ 200,000 تنفيذ. ما السبب المباشر؟" },
      options: [
        { en: "The non-clustered index used does not contain every column the query selects", ar: "الـ non-clustered index المستخدم لا يحتوي كل الأعمدة التي يطلبها الـ query" },
        { en: "The table has no primary key", ar: "الجدول لا يملك primary key" },
        { en: "The query is running at serializable isolation", ar: "الـ query يعمل بمستوى عزل serializable" },
        { en: "Statistics were updated too recently", ar: "الـ statistics حُدِّثت مؤخراً أكثر من اللازم" }
      ],
      correct: 0,
      why: { en: "The index locates the rows but the missing columns force one trip back to the clustered index per row. Adding those columns with INCLUDE removes the lookup.", ar: "الـ index يحدّد الصفوف لكن الأعمدة الناقصة تفرض رحلة عودة إلى الـ clustered index لكل صف. وإضافة تلك الأعمدة بـ INCLUDE تزيل الـ lookup." }
    },
    {
      q: { en: "When is a Clustered Index Scan the correct plan?", ar: "متى يكون Clustered Index Scan هو الخطة الصحيحة؟" },
      options: [
        { en: "Never — a scan always means a missing index", ar: "أبداً — الـ scan يعني دائماً index مفقوداً" },
        { en: "Only when the table has no indexes at all", ar: "فقط حين لا يملك الجدول أي indexes إطلاقاً" },
        { en: "When the table is small, or the query genuinely needs most of its rows", ar: "حين يكون الجدول صغيراً، أو حين يحتاج الـ query فعلاً معظم صفوفه" },
        { en: "Whenever the query has an ORDER BY clause", ar: "كلما احتوى الـ query على جملة ORDER BY" }
      ],
      correct: 2,
      why: { en: "Reading 900 rows sequentially beats seeking and jumping back per row. A scan is only a problem when it reads far more rows than the query returns.", ar: "قراءة 900 صف بالتسلسل أفضل من الـ seek والعودة لكل صف. الـ scan يصبح مشكلة فقط حين يقرأ صفوفاً أكثر بكثير مما يعيده الـ query." }
    },
    {
      q: { en: "Why can a query be fast in SSMS but slow from a .NET application?", ar: "لماذا قد يكون query سريعاً في SSMS وبطيئاً من تطبيق .NET؟" },
      options: [
        { en: "SSMS bypasses the query optimizer entirely", ar: "SSMS يتجاوز الـ query optimizer بالكامل" },
        { en: "Different SET options mean they use separate plan cache entries, so the app may run an older plan compiled for a different parameter", ar: "اختلاف SET options يعني استخدام مدخلين منفصلين في الـ plan cache، فقد ينفّذ التطبيق خطة أقدم مُجمَّعة لقيمة parameter مختلفة" },
        { en: "SSMS always keeps result sets in memory while applications do not", ar: "SSMS يحتفظ دائماً بالنتائج في الذاكرة بينما التطبيقات لا تفعل" },
        { en: "The .NET client adds mandatory encryption that slows every query", ar: "عميل .NET يضيف تشفيراً إلزامياً يبطئ كل query" }
      ],
      correct: 1,
      why: { en: "SSMS defaults ARITHABORT to ON and most .NET clients leave it OFF, which splits the plan cache. Pull the app's plan from sys.dm_exec_query_stats to see what it really ran.", ar: "SSMS يضع ARITHABORT على ON افتراضياً بينما معظم عملاء .NET يتركونه OFF، فينقسم الـ plan cache. اسحب خطة التطبيق من sys.dm_exec_query_stats لترى ما نفّذه فعلاً." }
    }
  ]
};
```

NEXT: param-sniffing
