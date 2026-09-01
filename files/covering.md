```js
const coveringLesson = {
  id: "covering",
  moduleId: "sql",
  title: { en: "Covering indexes and key lookups", ar: "الفهارس الشاملة وعمليات البحث بالمفتاح" },
  summary: {
    en: "A covering index holds every column a query asks for, so SQL Server answers the query from the index alone and never goes back to the table.",
    ar: "الـ covering index يحتوي كل الأعمدة التي يطلبها الـ query، فيجيب SQL Server من الـ index وحده ولا يعود إلى الجدول."
  },
  mins: 15,
  sections: [
    {
      key: "why",
      blocks: [
        { t: "p",
          en: "An index normally holds only the columns you search on. If your query also asks for other columns, SQL Server has to go back to the table row by row to fetch them. That second trip is called a key lookup, and it is the single most common reason a query that 'has an index' is still slow. A covering index removes the second trip by storing those extra columns inside the index itself.",
          ar: "الـ index عادةً يحتوي فقط الأعمدة التي تبحث بها. إذا طلب الـ query أعمدة أخرى، يضطر SQL Server للعودة إلى الجدول صفاً بصف ليجلبها. هذه الرحلة الثانية اسمها key lookup، وهي أشهر سبب لبقاء query بطيئاً رغم وجود index. الـ covering index يلغي الرحلة الثانية لأنه يخزّن تلك الأعمدة داخل الـ index نفسه." },
        { t: "kv", rows: [
          { k: { en: "Index", ar: "Index" },
            v: { en: "A separate, sorted copy of one or more columns, kept in sync with the table, used to find rows fast.", ar: "نسخة منفصلة ومرتّبة من عمود أو أكثر، تبقى متزامنة مع الجدول، تُستخدم لإيجاد الصفوف بسرعة." } },
          { k: { en: "Clustered index", ar: "Clustered index" },
            v: { en: "The table itself, physically sorted by its key. A table has at most one. Its leaf pages ARE the full rows.", ar: "الجدول نفسه، مرتّب فيزيائياً حسب مفتاحه. لكل جدول واحد على الأكثر. صفحاته الطرفية هي الصفوف الكاملة." } },
          { k: { en: "Non-clustered index", ar: "Non-clustered index" },
            v: { en: "A side structure holding its key columns plus a pointer back to the full row. A table can have many.", ar: "بنية جانبية تحتوي أعمدة مفتاحها بالإضافة إلى pointer يعود للصف الكامل. يمكن أن يكون للجدول عدة منها." } },
          { k: { en: "Key lookup", ar: "Key lookup" },
            v: { en: "The extra read that follows that pointer into the clustered index to fetch columns the index does not have. Happens once per matching row.", ar: "القراءة الإضافية التي تتبع ذلك الـ pointer إلى الـ clustered index لجلب أعمدة لا يملكها الـ index. تحدث مرة لكل صف مطابق." } },
          { k: { en: "Covering index", ar: "Covering index" },
            v: { en: "An index that already contains every column one specific query needs, so no key lookup is required.", ar: "index يحتوي أصلاً كل عمود يحتاجه query معيّن، فلا حاجة لأي key lookup." } },
          { k: { en: "INCLUDE", ar: "INCLUDE" },
            v: { en: "A CREATE INDEX clause that stores extra columns in the index leaf without making them part of the sort key.", ar: "جملة في CREATE INDEX تخزّن أعمدة إضافية في leaf الـ index دون جعلها جزءاً من مفتاح الترتيب." } }
        ]},
        { t: "p",
          en: "Think of a printed cookbook. The index at the back lists dish names in alphabetical order, and next to each name a page number. If you only want to know whether the book has a recipe for lasagne, the back index answers you instantly. If you also want the cooking time, the back index cannot help — you flip to page 214 and read it there. One flip is cheap. Two hundred flips, one per dish, is not. Now imagine the back index printed the cooking time next to each name. That is a covering index: the answer is complete where you are already looking.",
          ar: "تخيّل كتاب طبخ مطبوع. الفهرس في آخره يسرد أسماء الأطباق أبجدياً، وبجانب كل اسم رقم صفحة. إذا أردت فقط معرفة هل يوجد وصفة للازانيا، الفهرس يجيبك فوراً. أما إذا أردت أيضاً مدة الطهي، فالفهرس لا يكفي — تفتح صفحة 214 وتقرأها هناك. فتح صفحة واحدة رخيص. فتح مئتي صفحة، واحدة لكل طبق، ليس رخيصاً. الآن تخيّل أن الفهرس طبع مدة الطهي بجانب كل اسم. هذا هو الـ covering index: الجواب كامل في المكان الذي تنظر إليه أصلاً." },
        { t: "p",
          en: "The running example for this whole lesson is one endpoint: GET /customers/{id}/orders, which returns a customer's recent orders. It runs this query against an Orders table of 40 million rows: SELECT OrderId, OrderDate, TotalAmount FROM Orders WHERE CustomerId = 4821 ORDER BY OrderDate DESC. There is already an index on CustomerId. The endpoint still takes 900 ms. We will find out why and fix it.",
          ar: "المثال الجاري في هذا الدرس كله هو endpoint واحد: GET /customers/{id}/orders، يعيد آخر طلبات عميل. ينفّذ هذا الـ query على جدول Orders فيه 40 مليون صف: SELECT OrderId, OrderDate, TotalAmount FROM Orders WHERE CustomerId = 4821 ORDER BY OrderDate DESC. يوجد أصلاً index على CustomerId. ومع ذلك الـ endpoint يستغرق 900 ms. سنعرف السبب ونصلحه." },
        { t: "callout", kind: "note",
          en: "\"Covering\" is not a property of an index by itself. It is a relationship between an index and one query. The same index covers query A and does not cover query B. Always say \"this index covers that query\".",
          ar: "«Covering» ليست خاصية في الـ index بذاته، بل علاقة بين index و query واحد. نفس الـ index قد يغطي query A ولا يغطي query B. قل دائماً «هذا الـ index يغطي ذلك الـ query»." }
      ]
    },
    {
      key: "problem",
      blocks: [
        { t: "p",
          en: "With only IX_Orders_CustomerId on (CustomerId), SQL Server finds the 400 rows for customer 4821 quickly. Finding them is not the problem. The index leaf stores CustomerId and the clustered key OrderId, and nothing else. The query also wants OrderDate and TotalAmount. So the engine performs 400 key lookups. Each one is a separate jump into the clustered index, reading an 8 KB page from a different place on disk.",
          ar: "مع وجود IX_Orders_CustomerId على (CustomerId) فقط، يجد SQL Server الـ 400 صف الخاصة بالعميل 4821 بسرعة. إيجادها ليس المشكلة. الـ leaf في الـ index يخزّن CustomerId والمفتاح الـ clustered وهو OrderId، ولا شيء آخر. لكن الـ query يريد أيضاً OrderDate و TotalAmount. لذلك ينفّذ المحرّك 400 key lookup. كل واحدة قفزة منفصلة إلى الـ clustered index، تقرأ صفحة 8 KB من مكان مختلف على القرص." },
        { t: "kv", rows: [
          { k: { en: "Before — index on (CustomerId)", ar: "قبل — index على (CustomerId)" },
            v: { en: "1 213 logical reads (a logical read is one 8 KB page fetched, from memory or disk), ~900 ms, plan shows Index Seek + Key Lookup + Nested Loops + Sort.", ar: "1213 logical reads (الـ logical read هو جلب صفحة واحدة بحجم 8 KB، من الذاكرة أو القرص)، حوالي 900 ms، والخطة تُظهر Index Seek و Key Lookup و Nested Loops و Sort." } },
          { k: { en: "After — index on (CustomerId, OrderDate DESC) INCLUDE (TotalAmount)", ar: "بعد — index على (CustomerId, OrderDate DESC) INCLUDE (TotalAmount)" },
            v: { en: "6 logical reads, ~4 ms, plan shows one Index Seek and nothing else.", ar: "6 logical reads، حوالي 4 ms، والخطة تُظهر Index Seek واحداً فقط ولا شيء غيره." } },
          { k: { en: "What changed", ar: "ما الذي تغيّر" },
            v: { en: "Reads dropped about 200x. The rows returned are identical. No query text was rewritten — only the index definition.", ar: "انخفضت القراءات نحو 200 ضعف. الصفوف المعادة نفسها تماماً. لم يُعد كتابة أي جزء من الـ query — فقط تعريف الـ index." } }
        ]},
        { t: "p",
          en: "Two numbers matter here. 1 213 reads means the engine touched 1 213 pages to return 400 small rows — roughly three pages per row, which is pure waste. And 900 ms is wall-clock time on a warm cache. On a cold cache each lookup can be a separate random disk read. The same query has been measured at over 6 seconds that way. The fix cost one CREATE INDEX statement.",
          ar: "رقمان مهمان هنا. 1213 قراءة تعني أن المحرّك لمس 1213 صفحة ليعيد 400 صفاً صغيراً — أي نحو ثلاث صفحات لكل صف، وهذا هدر خالص. و900 ms هو زمن فعلي مع cache دافئ. ومع cache بارد قد تكون كل عملية lookup قراءة قرص عشوائية منفصلة. وقيس نفس الـ query عندها بأكثر من 6 ثوانٍ. والإصلاح كلّف جملة CREATE INDEX واحدة." },
        { t: "p",
          en: "Notice the Sort operator in the 'before' plan too. The query ends with ORDER BY OrderDate DESC, and the old index knows nothing about OrderDate, so SQL Server had to collect all 400 rows and sort them in memory afterwards. Putting OrderDate into the index key in DESC order removed the sort as well — one index change fixed two separate problems.",
          ar: "لاحظ أيضاً وجود operator اسمه Sort في الخطة «قبل». الـ query ينتهي بـ ORDER BY OrderDate DESC، والـ index القديم لا يعرف شيئاً عن OrderDate، فاضطر SQL Server لجمع الـ 400 صف ثم ترتيبها في الذاكرة. وضع OrderDate في مفتاح الـ index بترتيب DESC ألغى الـ sort أيضاً — تغيير index واحد أصلح مشكلتين منفصلتين." }
      ]
    },
    {
      key: "internals",
      blocks: [
        { t: "p",
          en: "Every index in SQL Server is a B-tree — a tree structure where each node is one 8 KB page, and each level narrows the search until you reach the bottom. The bottom level is called the leaf level, and it holds the actual index entries in sorted order. Levels above the leaf are just signposts saying 'keys from X to Y live on that page'. A 40-million-row index is typically 3 to 4 levels deep, so finding one entry costs 3 or 4 page reads no matter how big the table is.",
          ar: "كل index في SQL Server هو B-tree — بنية شجرية كل عقدة فيها صفحة 8 KB، وكل مستوى يضيّق البحث حتى تصل إلى الأسفل. المستوى الأسفل اسمه leaf level ويحتوي مدخلات الـ index الفعلية مرتّبة. أما المستويات فوقه فهي لافتات تقول «المفاتيح من X إلى Y موجودة في تلك الصفحة». الـ index على 40 مليون صف عمقه عادةً 3 أو 4 مستويات، فإيجاد مدخلة واحدة يكلّف 3 أو 4 قراءات صفحات مهما كبر الجدول." },
        { t: "p",
          en: "What sits in the leaf is the whole story. In a clustered index the leaf pages contain the complete rows — the clustered index is the table. In a non-clustered index the leaf contains the index key columns, any INCLUDE columns, and a pointer to the row. On a table that has a clustered index, that pointer is the clustered key value itself. On a table with no clustered index — such a table is called a heap — it is a physical address called a RID. So a non-clustered index leaf entry is small, and its size is exactly what decides whether a lookup is needed.",
          ar: "ما يوجد في الـ leaf هو القصة كلها. في الـ clustered index تحتوي صفحات الـ leaf الصفوف الكاملة — فالـ clustered index هو الجدول. أما في الـ non-clustered index فيحتوي الـ leaf أعمدة مفتاح الـ index، وأي أعمدة INCLUDE، و pointer إلى الصف. في جدول له clustered index يكون هذا الـ pointer هو قيمة المفتاح الـ clustered نفسها. أما في جدول بلا clustered index — ويسمّى heap — فيكون عنواناً فيزيائياً اسمه RID. إذن مدخلة الـ leaf في الـ non-clustered index صغيرة، وحجمها بالضبط هو ما يحدّد إن كنا نحتاج lookup أم لا." },
        { t: "kv", rows: [
          { k: { en: "Key columns", ar: "أعمدة المفتاح" },
            v: { en: "The columns after CREATE INDEX ... ON Table(...). They define the sort order, so they can be searched, range-scanned and used to satisfy ORDER BY.", ar: "الأعمدة التي تأتي بعد CREATE INDEX ... ON Table(...). تحدّد ترتيب الفرز، لذلك يمكن البحث بها ومسح نطاقات منها واستخدامها لتلبية ORDER BY." } },
          { k: { en: "INCLUDE columns", ar: "أعمدة INCLUDE" },
            v: { en: "Stored only in the leaf, not sorted. Useless for searching or ordering, perfect for returning. They do not count toward the 900-byte key size limit.", ar: "تُخزَّن في الـ leaf فقط وغير مرتّبة. لا تفيد في البحث أو الترتيب، ومثالية للإرجاع. ولا تُحتسب ضمن حد حجم المفتاح البالغ 900 بايت." } },
          { k: { en: "Row locator", ar: "Row locator" },
            v: { en: "The clustered key (or RID) silently added to every non-clustered leaf entry. This is why the clustered key should be narrow.", ar: "المفتاح الـ clustered (أو RID) يُضاف ضمنياً إلى كل مدخلة leaf في الـ non-clustered. لهذا يجب أن يكون المفتاح الـ clustered ضيقاً." } },
          { k: { en: "Key Lookup operator", ar: "Key Lookup operator" },
            v: { en: "What appears in the plan when the leaf entry is not enough. Always paired with Nested Loops, and executed once per matching row.", ar: "ما يظهر في الخطة عندما لا تكفي مدخلة الـ leaf. يظهر دائماً مع Nested Loops، وينفَّذ مرة لكل صف مطابق." } }
        ]},
        { t: "p",
          en: "Now trace our query step by step. The engine seeks into IX_Orders_CustomerId looking for CustomerId = 4821: three page reads to walk down the tree, then it reads the leaf entries in order. Each entry gives it an OrderId. For each of those 400 OrderIds it starts again at the top of the clustered index and walks down 3 levels to fetch the row and read OrderDate and TotalAmount. That is 400 × 3 = 1 200 extra reads. Add the initial seek and you get the 1 213 we measured. The cost is not one big scan; it is four hundred small ones.",
          ar: "الآن تتبّع الـ query خطوة بخطوة. يبدأ المحرّك بـ seek داخل IX_Orders_CustomerId بحثاً عن CustomerId = 4821: ثلاث قراءات صفحات للنزول في الشجرة، ثم يقرأ مدخلات الـ leaf بالترتيب. كل مدخلة تعطيه OrderId. ولكل واحد من هذه الـ 400 OrderId يبدأ من جديد من أعلى الـ clustered index وينزل 3 مستويات ليجلب الصف ويقرأ OrderDate و TotalAmount. هذا 400 × 3 = 1200 قراءة إضافية. أضف الـ seek الأول تحصل على 1213 التي قسناها. التكلفة ليست مسحاً كبيراً واحداً، بل أربعمئة مسح صغير." },
        { t: "code", lang: "sql",
          label: { en: "The before index, the after index, and how to see the difference", ar: "الـ index قبل، والـ index بعد، وكيف ترى الفرق" },
          code: "-- what exists today: finds the rows, then must go get the columns\nCREATE NONCLUSTERED INDEX IX_Orders_CustomerId\n    ON dbo.Orders (CustomerId);\n\n-- the query the endpoint runs\nSET STATISTICS IO ON;      -- prints how many 8 KB pages were read\nSET STATISTICS TIME ON;    -- prints CPU and elapsed milliseconds\n\nSELECT OrderId, OrderDate, TotalAmount\nFROM   dbo.Orders\nWHERE  CustomerId = 4821\nORDER  BY OrderDate DESC;\n-- Table 'Orders'. logical reads 1213   <-- 400 key lookups hiding here\n\n-- the covering index: CustomerId to seek, OrderDate to seek+sort,\n-- TotalAmount only to return. OrderId is already there as the clustered key.\nCREATE NONCLUSTERED INDEX IX_Orders_Customer_Date\n    ON dbo.Orders (CustomerId, OrderDate DESC)\n    INCLUDE (TotalAmount);\n\n-- same query, now: logical reads 6, no Key Lookup, no Sort" },
        { t: "p",
          en: "Why is TotalAmount in INCLUDE and not in the key? Because the query never searches or sorts by it — it only returns it. Key columns cost more. They are stored at every level of the B-tree, and they must be kept in sort order on every insert. All key columns together also cannot exceed 900 bytes. INCLUDE columns live only in the leaf, are not sorted, and have no such limit. The rule is simple: search or sort on it, put it in the key; only display it, put it in INCLUDE.",
          ar: "لماذا وُضع TotalAmount في INCLUDE وليس في المفتاح؟ لأن الـ query لا يبحث ولا يرتّب به — فقط يعيده. أعمدة المفتاح أغلى. تُخزَّن في كل مستوى من الـ B-tree، ويجب إبقاؤها مرتّبة عند كل insert. كما أن مجموع أعمدة المفتاح لا يتجاوز 900 بايت. أما أعمدة INCLUDE فتوجد في الـ leaf فقط وغير مرتّبة وبلا هذا الحد. القاعدة بسيطة: إن كنت تبحث أو ترتّب بالعمود ضعه في المفتاح، وإن كنت تعرضه فقط ضعه في INCLUDE." },
        { t: "callout", kind: "tip",
          en: "The optimizer does not decide 'is this index covering'. It costs each option. When the number of matching rows is small it accepts key lookups; past a tipping point of roughly 25-30% of the table it abandons the index and scans instead. That is why the same index seeks for customer 4821 and scans for a customer with a million orders.",
          ar: "الـ optimizer لا يقرّر «هل هذا الـ index covering». بل يحسب تكلفة كل خيار. عندما يكون عدد الصفوف المطابقة صغيراً يقبل الـ key lookups؛ وبعد نقطة انقلاب تقارب 25-30% من الجدول يترك الـ index ويقوم بـ scan. لهذا نفس الـ index يعمل seek للعميل 4821 و scan لعميل عنده مليون طلب." }
      ]
    },
    {
      key: "tradeoffs",
      blocks: [
        { t: "tradeoff",
          pros: {
            en: [
              "Removes the key lookup entirely — reads drop by 10x to 200x on selective queries.",
              "Ordering the key columns right also removes the Sort operator, which frees memory grants.",
              "No application change: the query text stays the same, only the index definition moves.",
              "Makes the query's cost predictable, because it no longer depends on how scattered the rows are on disk."
            ],
            ar: [
              "يلغي الـ key lookup تماماً — تنخفض القراءات بين 10 و200 ضعف في الاستعلامات الانتقائية.",
              "ترتيب أعمدة المفتاح بشكل صحيح يلغي أيضاً operator الـ Sort، وهذا يحرّر memory grants.",
              "لا تغيير في التطبيق: نص الـ query يبقى كما هو، ويتغيّر تعريف الـ index فقط.",
              "يجعل تكلفة الـ query متوقّعة، لأنها لم تعد تعتمد على مدى تشتّت الصفوف على القرص."
            ]
          },
          cons: {
            en: [
              "Every INCLUDE column is a second physical copy of that data, so the index grows and takes disk, memory and backup space.",
              "Every INSERT, UPDATE and DELETE must maintain the index too — writes get slower.",
              "Updating an included column now dirties the index as well as the table, doubling the log written.",
              "Covering is per-query, so a wide covering strategy tends to breed one index per query."
            ],
            ar: [
              "كل عمود في INCLUDE هو نسخة فيزيائية ثانية من البيانات، فيكبر الـ index ويأخذ مساحة قرص وذاكرة ونسخ احتياطي.",
              "كل INSERT و UPDATE و DELETE يجب أن يصون الـ index أيضاً — فتصبح الكتابة أبطأ.",
              "تحديث عمود موجود في INCLUDE صار يمسّ الـ index والجدول معاً، فيتضاعف حجم الـ log المكتوب.",
              "الـ covering مرتبط بـ query واحد، لذلك التوسّع فيه يميل إلى إنتاج index لكل query."
            ]
          },
          limits: {
            en: [
              "Key columns together cannot exceed 900 bytes; INCLUDE columns are exempt but still consume leaf space.",
              "A non-clustered index allows at most 32 key columns and 1023 INCLUDE columns.",
              "SELECT * can almost never be covered — adding every column just duplicates the table.",
              "Covering does not help if the WHERE clause is not selective; the optimizer will scan anyway."
            ],
            ar: [
              "مجموع أعمدة المفتاح لا يتجاوز 900 بايت؛ وأعمدة INCLUDE مستثناة لكنها تستهلك مساحة الـ leaf.",
              "الـ non-clustered index يسمح بـ 32 عمود مفتاح كحد أقصى و1023 عمود INCLUDE.",
              "SELECT * يستحيل تغطيته تقريباً — إضافة كل الأعمدة تكرّر الجدول ببساطة.",
              "الـ covering لا يفيد إذا لم تكن شروط WHERE انتقائية؛ الـ optimizer سيقوم بـ scan على أي حال."
            ]
          },
          alts: {
            en: [
              "Narrow the SELECT list: often the query asks for columns nobody displays, and removing them makes an existing index covering.",
              "A filtered index (WHERE clause on the index) covers a hot subset at a fraction of the size.",
              "A columnstore index for analytic queries that touch few columns across many rows.",
              "Accept the key lookup when the query returns 1-5 rows; three extra reads are not worth a new index."
            ],
            ar: [
              "قلّل أعمدة SELECT: كثيراً ما يطلب الـ query أعمدة لا يعرضها أحد، وحذفها يجعل index موجوداً يغطي الاستعلام.",
              "الـ filtered index (بشرط WHERE على الـ index) يغطي مجموعة فرعية مطلوبة بحجم أصغر بكثير.",
              "الـ columnstore index للاستعلامات التحليلية التي تلمس أعمدة قليلة عبر صفوف كثيرة.",
              "اقبل الـ key lookup عندما يعيد الـ query من 1 إلى 5 صفوف؛ ثلاث قراءات إضافية لا تستحق index جديداً."
            ]
          }
        }
      ]
    },
    {
      key: "mistakes",
      blocks: [
        { t: "mistake",
          title: { en: "Blindly applying the missing-index suggestion", ar: "تطبيق اقتراح missing index بشكل أعمى" },
          body: {
            en: "SQL Server's execution plan showed a green 'Missing Index (Impact 96%)' hint, and a developer pasted it in as-is. The suggestion listed 11 INCLUDE columns because the query did SELECT *. The new index was 3.2 GB on a 4 GB table, and nightly imports went from 8 minutes to 41. The suggestion had also ignored an existing index that already covered 9 of those columns. The engine only ever suggests, never judges cost of writes or overlap with existing indexes.",
            ar: "أظهرت خطة التنفيذ في SQL Server تلميحاً أخضر «Missing Index (Impact 96%)»، فنسخه المطوّر كما هو. الاقتراح سرد 11 عموداً في INCLUDE لأن الـ query كان SELECT *. صار حجم الـ index الجديد 3.2 GB على جدول حجمه 4 GB، وارتفع زمن الاستيراد الليلي من 8 دقائق إلى 41. كما تجاهل الاقتراح وجود index قائم يغطي 9 من تلك الأعمدة. المحرّك يقترح فقط، ولا يقيّم أبداً تكلفة الكتابة ولا التداخل مع الـ indexes الموجودة."
          },
          fix: "-- read the suggestion, then trim it:\n-- 1. replace SELECT * with the 3 columns the UI shows\n-- 2. check sys.dm_db_index_usage_stats for an index you can extend instead\n-- 3. only then CREATE INDEX with the columns that survived"
        },
        { t: "mistake",
          title: { en: "Putting return-only columns in the key", ar: "وضع أعمدة العرض فقط في المفتاح" },
          body: {
            en: "Someone wrote the index as (CustomerId, OrderDate, TotalAmount, Notes) with no INCLUDE at all. Notes is an nvarchar(400) column, so every level of the B-tree — not just the leaf — now carries up to 800 bytes of text per entry. The index grew about 5x, the tree gained a level, and inserts had to keep Notes in sort order for no reason, since nothing ever sorts or filters by Notes.",
            ar: "كتب أحدهم الـ index هكذا (CustomerId, OrderDate, TotalAmount, Notes) بدون INCLUDE إطلاقاً. وعمود Notes من نوع nvarchar(400)، فصار كل مستوى في الـ B-tree — لا الـ leaf وحده — يحمل حتى 800 بايت من النص لكل مدخلة. كبر الـ index نحو 5 أضعاف، واكتسبت الشجرة مستوى إضافياً، واضطرت عمليات الـ insert لإبقاء Notes مرتّباً بلا سبب، لأن لا أحد يرتّب أو يفلتر بـ Notes."
          },
          fix: "-- key = what you search or sort by; INCLUDE = what you only return\nCREATE NONCLUSTERED INDEX IX_Orders_Customer_Date\n    ON dbo.Orders (CustomerId, OrderDate DESC)\n    INCLUDE (TotalAmount, Notes);"
        },
        { t: "mistake",
          title: { en: "Wrong key column order", ar: "ترتيب خاطئ لأعمدة المفتاح" },
          body: {
            en: "An index on (OrderDate, CustomerId) was created for our query. It contains both columns, so it looks covering — and the plan still scanned it. A B-tree is sorted by the first key column first, exactly like a phone book sorted by surname then first name. Asking for everyone named 'Sara' means reading the whole book. The query filters on CustomerId, so CustomerId must come first.",
            ar: "أُنشئ index على (OrderDate, CustomerId) من أجل استعلامنا. يحتوي العمودين، فيبدو covering — ومع ذلك بقيت الخطة تقوم بـ scan عليه. الـ B-tree مرتّب حسب عمود المفتاح الأول أولاً، تماماً مثل دليل هاتف مرتّب بالاسم العائلي ثم الأول. طلب كل من اسمه «سارة» يعني قراءة الدليل كله. والـ query يفلتر على CustomerId، لذلك يجب أن يأتي CustomerId أولاً."
          },
          fix: "-- equality filter first, then the range/ORDER BY column, then INCLUDE\nON dbo.Orders (CustomerId, OrderDate DESC) INCLUDE (TotalAmount)"
        },
        { t: "mistake",
          title: { en: "Wrapping the indexed column in a function", ar: "تغليف العمود المفهرس بدالة" },
          body: {
            en: "The covering index was perfect, then a filter was added: WHERE YEAR(OrderDate) = 2024. The moment a column is passed to a function, SQL Server can no longer match it against the sorted index entries — the index stores OrderDate values, not YEAR(OrderDate) values. This is called a non-sargable predicate, meaning 'not searchable by index'. The plan fell back to scanning all 40 million rows even though the index still covered every column.",
            ar: "كان الـ covering index مثالياً، ثم أُضيف فلتر: WHERE YEAR(OrderDate) = 2024. في اللحظة التي يُمرَّر فيها العمود إلى دالة، لا يستطيع SQL Server مطابقته مع مدخلات الـ index المرتّبة — لأن الـ index يخزّن قيم OrderDate لا قيم YEAR(OrderDate). يسمّى هذا predicate غير sargable، أي «غير قابل للبحث بالـ index». وعادت الخطة إلى مسح 40 مليون صف رغم أن الـ index ما زال يغطي كل الأعمدة."
          },
          fix: "-- bad:  WHERE YEAR(OrderDate) = 2024\n-- good: keep the column bare and turn it into a range\nWHERE OrderDate >= '2024-01-01' AND OrderDate < '2025-01-01'"
        }
      ]
    },
    {
      key: "interview",
      blocks: [
        { t: "qa", level: "junior",
          q: { en: "What is a key lookup?", ar: "ما هو الـ key lookup؟" },
          a: { en: "It's the extra read SQL Server does when a non-clustered index finds your rows but doesn't hold all the columns you asked for. The index entry has a pointer to the full row, so the engine follows that pointer into the clustered index to fetch the missing columns. It does that once per row, so 400 matching rows means 400 lookups. It's cheap for a couple of rows and very expensive for a few hundred.",
            ar: "هي القراءة الإضافية التي ينفّذها SQL Server عندما يجد الـ non-clustered index صفوفك لكنه لا يحتوي كل الأعمدة التي طلبتها. مدخلة الـ index فيها pointer إلى الصف الكامل، فيتبعه المحرّك إلى الـ clustered index ليجلب الأعمدة الناقصة. يفعل ذلك مرة لكل صف، فـ 400 صف مطابق تعني 400 lookup. رخيصة لصفّين، وغالية جداً لبضع مئات." } },
        { t: "qa", level: "mid",
          q: { en: "When would you put a column in INCLUDE instead of the index key?", ar: "متى تضع عموداً في INCLUDE بدل مفتاح الـ index؟" },
          a: { en: "When the query only returns the column and never filters, joins or sorts by it. Key columns are stored at every level of the B-tree and have to stay sorted, so they make the whole index bigger and slower to write. INCLUDE columns sit only in the leaf pages. So TotalAmount, which we just display, goes in INCLUDE; CustomerId, which we filter on, and OrderDate, which we sort by, go in the key.",
            ar: "عندما يعيد الـ query العمود فقط ولا يفلتر ولا يعمل join ولا يرتّب به. أعمدة المفتاح تُخزَّن في كل مستوى من الـ B-tree ويجب أن تبقى مرتّبة، فتكبّر الـ index كله وتبطّئ الكتابة. أما أعمدة INCLUDE فتوجد في صفحات الـ leaf فقط. لذلك TotalAmount الذي نعرضه فقط يذهب إلى INCLUDE؛ و CustomerId الذي نفلتر به و OrderDate الذي نرتّب به يذهبان إلى المفتاح." } },
        { t: "qa", level: "mid",
          q: { en: "You added every column to INCLUDE and the query got faster. What did you actually buy and pay?", ar: "أضفت كل الأعمدة إلى INCLUDE وصار الـ query أسرع. ما الذي ربحته وما الذي دفعته فعلياً؟" },
          a: { en: "I bought read speed by making a second copy of the table. That copy has to be written on every insert and update. It also sits in the buffer pool competing for memory with real table pages, and it makes backups and index rebuilds longer. If the table is write-heavy that trade is usually bad. The honest fix is almost always to shrink the SELECT list first and see how many columns actually need covering.",
            ar: "ربحت سرعة القراءة مقابل إنشاء نسخة ثانية من الجدول. هذه النسخة يجب كتابتها عند كل insert و update. كما تجلس في الـ buffer pool تنافس صفحات الجدول الحقيقية على الذاكرة، وتطيل النسخ الاحتياطي وإعادة بناء الـ indexes. إذا كان الجدول كثيف الكتابة فهذه مقايضة سيئة عادةً. والحل الصادق غالباً أن تقلّص قائمة SELECT أولاً وترى كم عموداً يحتاج التغطية فعلاً." } },
        { t: "qa", level: "senior",
          q: { en: "The plan shows a key lookup but the query is fast. Do you fix it?", ar: "الخطة تُظهر key lookup لكن الـ query سريع. هل تصلحه؟" },
          a: { en: "Not by itself. A key lookup on a query returning three rows costs about nine extra page reads — that's noise. What I'd check is how the row count behaves across real parameter values. If some customers have 3 orders and others have 5 000, the same plan is fine for one and terrible for the other. So I'd look at the actual row counts in production, not the one execution in front of me, and only add the index if the expensive case is common.",
            ar: "ليس بمجرّد وجوده. الـ key lookup في query يعيد ثلاثة صفوف يكلّف نحو تسع قراءات صفحات إضافية — وهذا ضجيج. ما أفحصه هو كيف يتغيّر عدد الصفوف عبر قيم الـ parameters الحقيقية. إذا كان بعض العملاء لديهم 3 طلبات وآخرون 5000، فنفس الخطة ممتازة لحالة وكارثية لأخرى. لذلك أنظر إلى أعداد الصفوف الفعلية في الإنتاج، لا إلى التنفيذ الواحد أمامي، ولا أضيف الـ index إلا إذا كانت الحالة الغالية شائعة." } },
        { t: "qa", level: "senior",
          q: { en: "How do you decide between adding a new covering index and extending an existing one?", ar: "كيف تقرّر بين إضافة covering index جديد وتوسيع index قائم؟" },
          a: { en: "I look for an index whose key columns are a prefix of what I need. If one exists on (CustomerId) and I need (CustomerId, OrderDate), extending it is strictly better — I get the new query covered and I drop one index instead of maintaining two. If the leading columns differ, extending doesn't work and I need a separate index. The thing I never do is add an index that's a duplicate with one extra INCLUDE; I merge them, because two nearly identical indexes pay full write cost twice.",
            ar: "أبحث عن index تكون أعمدة مفتاحه بادئة لما أحتاجه. إذا وُجد index على (CustomerId) وأحتاج (CustomerId, OrderDate) فتوسيعه أفضل قطعاً — أغطّي الـ query الجديد وأتخلّص من index بدل صيانة اثنين. وإذا اختلفت الأعمدة الأولى فالتوسيع لا ينفع وأحتاج index منفصلاً. الشيء الذي لا أفعله أبداً هو إضافة index مكرّر بفارق عمود INCLUDE واحد؛ أدمجهما، لأن index شبه متطابقين يدفعان تكلفة الكتابة كاملة مرتين." } },
        { t: "qa", level: "staff",
          q: { en: "Your team keeps shipping one-off covering indexes and the biggest tables now have 20 each. How do you stop this structurally?", ar: "فريقك يشحن باستمرار covering indexes لمرة واحدة، وصار في أكبر الجداول 20 index لكل منها. كيف توقف هذا هيكلياً؟" },
          a: { en: "The root cause is that adding an index has no owner and no cost signal, so it always looks free at review time. I'd do three things. First, make index changes go through migrations in the same repo as the code, so they get reviewed like code instead of being applied by hand. Second, put a weekly report in the team channel from sys.dm_db_index_usage_stats showing indexes with zero seeks and non-zero writes — that turns 'we might need it' into a number. Third, add a rule to the review checklist: a new index needs the query it serves, the row counts, and a check that no existing index shares its leading columns. That last one alone usually cuts half of them.",
            ar: "السبب الجذري أن إضافة index بلا مالك وبلا إشارة تكلفة، فتبدو دائماً مجانية وقت المراجعة. سأفعل ثلاثة أشياء. أولاً، أجعل تغييرات الـ indexes تمرّ عبر migrations في نفس مستودع الكود، فتُراجَع مثل الكود بدل تطبيقها يدوياً. ثانياً، أضع تقريراً أسبوعياً في قناة الفريق من sys.dm_db_index_usage_stats يُظهر الـ indexes التي seeks لها صفر وكتاباتها ليست صفراً — هذا يحوّل «ربما نحتاجه» إلى رقم. ثالثاً، أضيف قاعدة إلى قائمة المراجعة: أي index جديد يحتاج الـ query الذي يخدمه، وأعداد الصفوف، وتأكيداً أن لا index قائماً يشاركه أعمدته الأولى. هذه الأخيرة وحدها تحذف نصفها عادةً." } }
      ]
    },
    {
      key: "codereview",
      blocks: [
        { t: "review", severity: "high",
          title: { en: "SELECT * in a hot read path makes covering impossible", ar: "استخدام SELECT * في مسار قراءة مزدحم يجعل التغطية مستحيلة" },
          bad: "// OrdersRepository.cs — returns the whole entity to the API\npublic async Task<List<Order>> GetForCustomerAsync(int customerId) =>\n    await _db.Orders\n        .Where(o => o.CustomerId == customerId)\n        .OrderByDescending(o => o.OrderDate)\n        .ToListAsync();\n// EF emits: SELECT o.OrderId, o.CustomerId, o.OrderDate, o.TotalAmount,\n//                  o.Notes, o.ShippingAddress, o.BillingAddress, o.Status, ...\n// 400 key lookups, 1213 logical reads",
          good: "// return only what the endpoint serializes\npublic async Task<List<OrderListItem>> GetForCustomerAsync(int customerId) =>\n    await _db.Orders\n        .Where(o => o.CustomerId == customerId)\n        .OrderByDescending(o => o.OrderDate)\n        .Select(o => new OrderListItem(o.OrderId, o.OrderDate, o.TotalAmount))\n        .ToListAsync();\n// SELECT o.OrderId, o.OrderDate, o.TotalAmount -> covered, 6 logical reads",
          why: {
            en: "Loading the full entity forces every column into the SELECT list, and a covering index for all of them would be a copy of the table. Projecting to a small type first makes a three-column index enough. This is the cheapest fix in the lesson: it changes one query and needs no new storage.",
            ar: "تحميل الـ entity كاملاً يفرض كل الأعمدة في قائمة SELECT، و covering index لكل هذه الأعمدة سيكون نسخة من الجدول. الإسقاط إلى نوع صغير أولاً يجعل index بثلاثة أعمدة كافياً. هذا أرخص إصلاح في الدرس: يغيّر query واحداً ولا يحتاج أي تخزين جديد."
          }
        },
        { t: "review", severity: "medium",
          title: { en: "A new index that duplicates an existing one", ar: "index جديد يكرّر index موجوداً" },
          bad: "-- already in the database\nCREATE INDEX IX_Orders_Cust ON dbo.Orders (CustomerId) INCLUDE (TotalAmount);\n\n-- added in this pull request for a new screen\nCREATE INDEX IX_Orders_Cust_2 ON dbo.Orders (CustomerId) INCLUDE (TotalAmount, Status);",
          good: "-- extend the existing index instead of adding a near-twin\nDROP INDEX IX_Orders_Cust ON dbo.Orders;\nCREATE INDEX IX_Orders_Cust ON dbo.Orders (CustomerId)\n    INCLUDE (TotalAmount, Status);\n\n-- or, in one statement:\nCREATE INDEX IX_Orders_Cust ON dbo.Orders (CustomerId)\n    INCLUDE (TotalAmount, Status) WITH (DROP_EXISTING = ON);",
          why: {
            en: "Two indexes with the same key columns both get updated on every write, both occupy buffer pool memory, and both are backed up — for one extra column. Because the key columns match exactly, the wider one serves every query the narrow one served, so merging loses nothing. DROP_EXISTING = ON rebuilds in place and keeps the table usable.",
            ar: "index بنفس أعمدة المفتاح يُحدَّثان كلاهما عند كل كتابة، ويشغلان معاً ذاكرة الـ buffer pool، ويُنسخان احتياطياً — مقابل عمود إضافي واحد. ولأن أعمدة المفتاح متطابقة تماماً، فالأوسع يخدم كل query كان يخدمه الأضيق، والدمج لا يخسر شيئاً. و DROP_EXISTING = ON يعيد البناء في مكانه ويبقي الجدول قابلاً للاستخدام."
          }
        }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        { t: "p",
          en: "In a typical order-management system the Orders table serves two very different populations. The customer-facing API reads a handful of columns for one customer at a time, thousands of times a minute. The back-office and reporting jobs read many columns across date ranges, a few times an hour. Designing one index for both gives you an index that is too wide for the first and too narrow for the second.",
          ar: "في نظام إدارة طلبات نموذجي يخدم جدول Orders فئتين مختلفتين تماماً. الـ API الموجّه للعميل يقرأ عدداً قليلاً من الأعمدة لعميل واحد في المرة، آلاف المرات في الدقيقة. أما وظائف الـ back-office والتقارير فتقرأ أعمدة كثيرة عبر نطاقات تواريخ، بضع مرات في الساعة. تصميم index واحد للاثنين ينتج index أوسع مما يلزم للأول وأضيق مما يلزم للثاني." },
        { t: "ul",
          en: [
            "Cover the top few read paths by request volume, not by how slow they feel. A 900 ms query called 40 times a day matters less than a 90 ms one called 40 times a second.",
            "Let reporting queries pay for key lookups or a scan; they run off-peak and nobody is waiting on a screen.",
            "If a read replica exists, put the wide reporting indexes there only, so the write-serving primary stays lean.",
            "Keep the clustered key narrow — an int identity, not a composite of four columns. It is silently copied into every non-clustered leaf entry, so a wide clustered key inflates every index you have.",
            "Ship index changes as versioned migrations next to the code, so a covering index is reviewed together with the query that needs it."
          ],
          ar: [
            "غطِّ أهم مسارات القراءة حسب حجم الطلبات، لا حسب شعورك ببطئها. فـ query يستغرق 900 ms ويُستدعى 40 مرة يومياً أقل أهمية من آخر يستغرق 90 ms ويُستدعى 40 مرة في الثانية.",
            "دع استعلامات التقارير تدفع ثمن الـ key lookups أو الـ scan؛ فهي تعمل خارج وقت الذروة ولا أحد ينتظر أمام شاشة.",
            "إذا وُجد read replica فضع indexes التقارير الواسعة عليه فقط، ليبقى الـ primary الذي يخدم الكتابة خفيفاً.",
            "أبقِ المفتاح الـ clustered ضيقاً — int identity وليس تركيبة من أربعة أعمدة. فهو يُنسَخ ضمنياً في كل مدخلة leaf في كل non-clustered index، والمفتاح الواسع ينفخ كل الـ indexes لديك.",
            "اشحن تغييرات الـ indexes على شكل migrations مُصدَّرة بجانب الكود، ليُراجَع الـ covering index مع الـ query الذي يحتاجه."
          ] },
        { t: "callout", kind: "warn",
          en: "Creating an index on a large table takes a schema modification lock and blocks writers unless you use WITH (ONLINE = ON), which needs Enterprise Edition. On a 40-million-row table this can mean minutes of blocked inserts. Plan index creation like a deployment, not like a config change.",
          ar: "إنشاء index على جدول كبير يأخذ schema modification lock ويحجب الكتابة إلا إذا استخدمت WITH (ONLINE = ON) التي تحتاج Enterprise Edition. على جدول فيه 40 مليون صف قد يعني هذا دقائق من عمليات insert محجوبة. خطّط لإنشاء الـ index كأنه عملية نشر لا كأنه تغيير إعدادات." }
      ]
    },
    {
      key: "perf",
      blocks: [
        { t: "kv", rows: [
          { k: { en: "Latency", ar: "Latency" },
            v: { en: "Our endpoint went from ~900 ms to ~4 ms. The saving scales with matching rows: 3 rows saves almost nothing, 400 rows saves 200x, 5 000 rows the optimizer would have scanned anyway.", ar: "انخفض الـ endpoint من نحو 900 ms إلى نحو 4 ms. والتوفير يتناسب مع عدد الصفوف المطابقة: 3 صفوف لا توفّر شيئاً تقريباً، و400 صف توفّر 200 ضعفاً، و5000 صف كان الـ optimizer سيقوم بـ scan لها أصلاً." } },
          { k: { en: "Database I/O", ar: "Database I/O" },
            v: { en: "1 213 logical reads to 6. Each key lookup is a random access to a different page. The covering seek reads a few pages that sit next to each other, which is far friendlier to disk and to read-ahead.", ar: "من 1213 logical read إلى 6. كل key lookup وصول عشوائي إلى صفحة مختلفة. أما الـ seek المغطّى فيقرأ بضع صفحات متجاورة، وهذا ألطف بكثير على القرص وعلى الـ read-ahead." } },
          { k: { en: "Memory", ar: "Memory" },
            v: { en: "Two effects pull in opposite directions. Dropping the Sort operator releases the memory grant SQL Server reserved for sorting. But every INCLUDE column makes the index bigger, so it occupies more buffer pool and evicts other pages.", ar: "أثران متعاكسان. إلغاء operator الـ Sort يحرّر الـ memory grant الذي حجزه SQL Server للترتيب. لكن كل عمود INCLUDE يكبّر الـ index، فيشغل مساحة أكبر في الـ buffer pool ويطرد صفحات أخرى." } },
          { k: { en: "Write cost", ar: "تكلفة الكتابة" },
            v: { en: "Each extra index adds work to every INSERT and DELETE, and to any UPDATE that touches one of its columns. A table with 12 indexes can spend more time maintaining indexes than writing rows.", ar: "كل index إضافي يضيف عملاً إلى كل INSERT و DELETE، وإلى أي UPDATE يمسّ أحد أعمدته. جدول فيه 12 index قد يقضي في صيانة الـ indexes وقتاً أطول مما يقضيه في كتابة الصفوف." } },
          { k: { en: "Scalability", ar: "Scalability" },
            v: { en: "Fewer reads per request means each request holds shared locks for less time, so concurrency improves beyond the direct latency win — the same server handles more requests per second.", ar: "قراءات أقل لكل طلب تعني أن كل طلب يمسك shared locks لوقت أقصر، فتتحسّن الـ concurrency أكثر من مجرد كسب الـ latency المباشر — ونفس الخادم يخدم طلبات أكثر في الثانية." } }
        ]}
      ]
    },
    {
      key: "debug",
      blocks: [
        { t: "ul",
          en: [
            "SET STATISTICS IO ON before running the query — the 'logical reads' number per table is the honest cost; if it is far larger than the rows returned, you are paying for lookups.",
            "Include Actual Execution Plan in SSMS (Ctrl+M) — look for a Key Lookup operator; hover it to see 'Number of Executions', which is how many rows paid the extra trip.",
            "In the same plan, check the Output List of the Key Lookup — those are exactly the columns missing from your index, so it tells you what to INCLUDE.",
            "Query sys.dm_db_missing_index_details joined to sys.dm_db_missing_index_group_stats — a starting suggestion, never a final answer; always trim its INCLUDE list.",
            "Query sys.dm_db_index_usage_stats — user_seeks near zero with high user_updates means an index that only costs you money, and is a candidate to drop."
          ],
          ar: [
            "شغّل SET STATISTICS IO ON قبل تنفيذ الـ query — رقم «logical reads» لكل جدول هو التكلفة الصادقة؛ وإذا كان أكبر بكثير من عدد الصفوف المعادة فأنت تدفع ثمن lookups.",
            "فعّل Actual Execution Plan في SSMS (Ctrl+M) — ابحث عن operator اسمه Key Lookup؛ ومرّر المؤشر فوقه لترى «Number of Executions»، وهو عدد الصفوف التي دفعت الرحلة الإضافية.",
            "في نفس الخطة، افحص Output List الخاص بالـ Key Lookup — هذه بالضبط الأعمدة الناقصة من الـ index، فهي تخبرك بما تضعه في INCLUDE.",
            "استعلم sys.dm_db_missing_index_details مع sys.dm_db_missing_index_group_stats — اقتراح للبدء لا جواباً نهائياً؛ وقلّص دائماً قائمة INCLUDE فيه.",
            "استعلم sys.dm_db_index_usage_stats — قيمة user_seeks قريبة من الصفر مع user_updates عالية تعني index يكلّفك فقط، وهو مرشّح للحذف."
          ] },
        { t: "callout", kind: "tip",
          en: "Fastest way to prove a covering index will help, without creating it: run the query with SELECT list trimmed to only the indexed columns. If reads collapse, key lookups were the whole cost. This takes ten seconds and needs no schema change or maintenance window.",
          ar: "أسرع طريقة لإثبات أن الـ covering index سيفيد، دون إنشائه: نفّذ الـ query مع تقليص قائمة SELECT إلى الأعمدة المفهرسة فقط. إذا انهارت القراءات فالـ key lookups كانت التكلفة كلها. يستغرق هذا عشر ثوانٍ ولا يحتاج تغيير schema ولا نافذة صيانة." }
      ]
    },
    {
      key: "realworld",
      blocks: [
        { t: "p",
          en: "Covering indexes show up wherever one screen reads a small, fixed set of columns from a very large table, over and over. The pattern is always the same: a list view filtered by one owner id and sorted by time. Recognising that shape is most of the work — the index almost writes itself once you know which columns the screen displays.",
          ar: "تظهر الـ covering indexes في كل مكان تقرأ فيه شاشة واحدة مجموعة صغيرة ثابتة من الأعمدة من جدول ضخم، مراراً وتكراراً. النمط دائماً نفسه: قائمة مفلترة بمعرّف مالك واحد ومرتّبة زمنياً. التعرّف على هذا الشكل هو معظم العمل — فالـ index يكتب نفسه تقريباً بمجرد معرفة الأعمدة التي تعرضها الشاشة." },
        { t: "ul",
          en: [
            "E-commerce order history: an index on (CustomerId, OrderDate DESC) including the two or three fields the list row shows. The order detail page reads a single row, so it needs no covering.",
            "Chat and messaging: (ConversationId, SentAt DESC) including sender and a truncated preview, so loading the last 50 messages never touches the message body column.",
            "Audit and activity logs: (EntityId, OccurredAt DESC) including action type and actor — huge append-only tables where a wide covering index is affordable because rows are never updated.",
            "Multi-tenant SaaS: nearly every index starts with TenantId, and covering the tenant's most-used list view is usually the single biggest latency win in the product."
          ],
          ar: [
            "سجل الطلبات في التجارة الإلكترونية: index على (CustomerId, OrderDate DESC) يتضمّن الحقلين أو الثلاثة التي يعرضها صف القائمة. أما صفحة تفاصيل الطلب فتجلب صفاً واحداً ولا تحتاج تغطية.",
            "الدردشة والمراسلة: (ConversationId, SentAt DESC) يتضمّن المرسل ومعاينة مختصرة، فتحميل آخر 50 رسالة لا يلمس عمود نص الرسالة إطلاقاً.",
            "سجلات التدقيق والنشاط: (EntityId, OccurredAt DESC) يتضمّن نوع الإجراء والفاعل — جداول ضخمة للإضافة فقط، والـ covering index الواسع فيها مقبول لأن الصفوف لا تُحدَّث أبداً.",
            "أنظمة SaaS متعددة المستأجرين: كل index تقريباً يبدأ بـ TenantId، وتغطية شاشة القائمة الأكثر استخداماً عند المستأجر هي عادةً أكبر مكسب latency في المنتج."
          ] }
      ]
    },
    {
      key: "exercises",
      blocks: [
        { t: "ex", diff: "easy",
          en: "Create an Orders table with 1 million rows and an index on (CustomerId) only. Run the lesson's query with SET STATISTICS IO ON and write down the logical reads. Add the covering index and run it again. You are done when you can state both numbers and point at the Key Lookup operator that disappeared.",
          ar: "أنشئ جدول Orders فيه مليون صف مع index على (CustomerId) فقط. نفّذ query الدرس مع SET STATISTICS IO ON وسجّل عدد الـ logical reads. أضف الـ covering index ونفّذه مرة أخرى. تنتهي عندما تستطيع ذكر الرقمين والإشارة إلى operator الـ Key Lookup الذي اختفى." },
        { t: "ex", diff: "medium",
          en: "Build two indexes on the same table: (CustomerId, OrderDate) and (OrderDate, CustomerId). Run the same WHERE CustomerId = @id query against each using an index hint. Explain in two sentences why one seeks and the other scans, using the sort order of the B-tree.",
          ar: "أنشئ index اثنين على نفس الجدول: (CustomerId, OrderDate) و (OrderDate, CustomerId). نفّذ نفس الـ query بشرط WHERE CustomerId = @id على كل منهما باستخدام index hint. اشرح في جملتين لماذا يقوم أحدهما بـ seek والآخر بـ scan، مستنداً إلى ترتيب الفرز في الـ B-tree." },
        { t: "ex", diff: "hard",
          en: "Measure the write cost. Time inserting 100 000 rows into the table with only the clustered index, then again with three covering indexes present. Report the percentage slowdown and the extra space used from sys.dm_db_partition_stats. You have succeeded when you can argue both sides of adding the third index with your own numbers.",
          ar: "قِس تكلفة الكتابة. سجّل زمن إدخال 100000 صف إلى الجدول مع الـ clustered index وحده، ثم مرة أخرى مع وجود ثلاثة covering indexes. اذكر نسبة التباطؤ والمساحة الإضافية من sys.dm_db_partition_stats. تنجح عندما تستطيع الدفاع عن الرأيين في إضافة الـ index الثالث بأرقامك أنت." },
        { t: "ex", diff: "senior",
          en: "Take a real database you work on. Write a query over sys.dm_db_index_usage_stats and sys.indexes that lists every index with fewer than 100 seeks and more than 10 000 updates since the last restart, together with its size. Turn the result into a one-page proposal naming which indexes to drop and the risk of each. Done means a teammate can act on it without asking you a question.",
          ar: "خذ قاعدة بيانات حقيقية تعمل عليها. اكتب query على sys.dm_db_index_usage_stats و sys.indexes يسرد كل index عدد seeks له أقل من 100 و updates أكثر من 10000 منذ آخر إعادة تشغيل، مع حجمه. حوّل النتيجة إلى مقترح من صفحة واحدة يسمّي الـ indexes المرشّحة للحذف ومخاطر كل منها. تنتهي عندما يستطيع زميل التصرّف بناءً عليه دون أن يسألك شيئاً." }
      ]
    },
    {
      key: "refs",
      blocks: [
        { t: "ref", label: { en: "SQL Server Index Architecture and Design Guide", ar: "دليل بنية وتصميم الـ indexes في SQL Server" },
          url: "https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-index-design-guide",
          meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref", label: { en: "CREATE INDEX (Transact-SQL) — key columns, INCLUDE, limits", ar: "CREATE INDEX (Transact-SQL) — أعمدة المفتاح و INCLUDE والحدود" },
          url: "https://learn.microsoft.com/en-us/sql/t-sql/statements/create-index-transact-sql",
          meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref", label: { en: "Use The Index, Luke — index-only scan (covering index)", ar: "Use The Index, Luke — الـ index-only scan (الـ covering index)" },
          url: "https://use-the-index-luke.com/sql/clustering/index-only-scan-covering-index",
          meta: { en: "Guide", ar: "دليل" } },
        { t: "ref", label: { en: "Showplan logical and physical operators reference (Key Lookup)", ar: "مرجع operators الخطة المنطقية والفيزيائية (Key Lookup)" },
          url: "https://learn.microsoft.com/en-us/sql/relational-databases/showplan-logical-and-physical-operators-reference",
          meta: { en: "Docs", ar: "توثيق" } }
      ]
    }
  ],
  quiz: [
    {
      q: { en: "What exactly is a key lookup?", ar: "ما هو الـ key lookup بالضبط؟" },
      options: [
        { en: "A second read into the clustered index to fetch columns the non-clustered index does not store, performed once per matching row.", ar: "قراءة ثانية داخل الـ clustered index لجلب أعمدة لا يخزّنها الـ non-clustered index، تُنفَّذ مرة لكل صف مطابق." },
        { en: "The initial descent through the B-tree levels to find the first matching entry.", ar: "النزول الأول عبر مستويات الـ B-tree لإيجاد أول مدخلة مطابقة." },
        { en: "A lock taken on the index key while the row is read.", ar: "قفل يؤخذ على مفتاح الـ index أثناء قراءة الصف." },
        { en: "The optimizer's step that decides which index to use.", ar: "خطوة الـ optimizer التي تقرّر أي index يُستخدم." }
      ],
      correct: 0,
      why: { en: "The index entry holds only its key columns, any INCLUDE columns and a pointer to the row. If the query needs a column that is not there, the engine follows that pointer — once per row, which is why 400 rows cost 400 lookups.", ar: "مدخلة الـ index تحتوي فقط أعمدة مفتاحها وأعمدة INCLUDE و pointer إلى الصف. فإذا احتاج الـ query عموداً غير موجود، يتبع المحرّك ذلك الـ pointer — مرة لكل صف، ولهذا تكلّف 400 صف 400 lookup." }
    },
    {
      q: { en: "Which column belongs in INCLUDE rather than in the index key?", ar: "أي عمود ينتمي إلى INCLUDE بدل مفتاح الـ index؟" },
      options: [
        { en: "A column used in the WHERE clause with an equality test.", ar: "عمود يُستخدم في WHERE باختبار مساواة." },
        { en: "A column the query only returns in the SELECT list.", ar: "عمود يعيده الـ query في قائمة SELECT فقط." },
        { en: "A column used in ORDER BY.", ar: "عمود يُستخدم في ORDER BY." },
        { en: "A column used as a join condition.", ar: "عمود يُستخدم كشرط join." }
      ],
      correct: 1,
      why: { en: "INCLUDE columns are stored only in the leaf and are not sorted, so they cannot help with searching, joining or ordering. They are exactly right for columns you only display, and they keep the key narrow.", ar: "أعمدة INCLUDE تُخزَّن في الـ leaf فقط وغير مرتّبة، فلا تفيد في البحث أو الـ join أو الترتيب. وهي مناسبة تماماً للأعمدة التي تعرضها فقط، وتُبقي المفتاح ضيقاً." }
    },
    {
      q: { en: "An index exists on (OrderDate, CustomerId). The query filters WHERE CustomerId = 4821. Why is it still slow?", ar: "يوجد index على (OrderDate, CustomerId). والـ query يفلتر بـ WHERE CustomerId = 4821. لماذا ما زال بطيئاً؟" },
      options: [
        { en: "Because the index is missing the TotalAmount column.", ar: "لأن الـ index تنقصه TotalAmount." },
        { en: "Because two-column indexes cannot be used for single-column filters.", ar: "لأن الـ indexes بعمودين لا تُستخدم لفلاتر عمود واحد." },
        { en: "Because the index is sorted by OrderDate first, so rows for one CustomerId are scattered through the whole index.", ar: "لأن الـ index مرتّب بـ OrderDate أولاً، فصفوف CustomerId واحد متناثرة عبر الـ index كله." },
        { en: "Because SQL Server ignores indexes whose first column is a date.", ar: "لأن SQL Server يتجاهل الـ indexes التي عمودها الأول تاريخ." }
      ],
      correct: 2,
      why: { en: "A B-tree is sorted by the leading key column first, like a phone book sorted by surname. Filtering only on the second column means the engine cannot narrow the search and must scan the index. The filtered column must lead.", ar: "الـ B-tree مرتّب حسب عمود المفتاح الأول، مثل دليل هاتف مرتّب بالاسم العائلي. الفلترة على العمود الثاني فقط تعني أن المحرّك لا يستطيع تضييق البحث ويضطر لمسح الـ index. يجب أن يتصدّر العمود المفلتر." }
    },
    {
      q: { en: "What is the main cost of adding a wide covering index to a write-heavy table?", ar: "ما التكلفة الرئيسية لإضافة covering index واسع على جدول كثيف الكتابة؟" },
      options: [
        { en: "Reads of other queries become incorrect until statistics are updated.", ar: "تصبح قراءات الاستعلامات الأخرى غير صحيحة حتى تُحدَّث الإحصائيات." },
        { en: "The index must be maintained on every insert, update and delete, and it duplicates the included data on disk and in memory.", ar: "يجب صيانة الـ index عند كل insert و update و delete، وهو يكرّر البيانات المضمّنة على القرص وفي الذاكرة." },
        { en: "SQL Server will stop using the clustered index.", ar: "سيتوقف SQL Server عن استخدام الـ clustered index." },
        { en: "Query plans can no longer be cached.", ar: "لن يعود بالإمكان تخزين خطط الاستعلام في الـ cache." }
      ],
      correct: 1,
      why: { en: "A covering index is a second copy of the columns it holds. Every write has to update that copy, and the copy competes for buffer pool memory and backup time. On a write-heavy table this can outweigh the read gain.", ar: "الـ covering index نسخة ثانية من الأعمدة التي يحملها. كل كتابة يجب أن تحدّث تلك النسخة، والنسخة تنافس على ذاكرة الـ buffer pool ووقت النسخ الاحتياطي. وفي جدول كثيف الكتابة قد يفوق هذا مكسب القراءة." }
    },
    {
      q: { en: "A perfect covering index exists, but the query uses WHERE YEAR(OrderDate) = 2024 and still scans. Why?", ar: "يوجد covering index مثالي، لكن الـ query يستخدم WHERE YEAR(OrderDate) = 2024 وما زال يقوم بـ scan. لماذا؟" },
      options: [
        { en: "The index stores raw OrderDate values, not YEAR(OrderDate), so the sorted entries cannot be matched against the function's result.", ar: "الـ index يخزّن قيم OrderDate الخام لا YEAR(OrderDate)، فلا يمكن مطابقة المدخلات المرتّبة مع نتيجة الدالة." },
        { en: "YEAR() is not supported in a WHERE clause.", ar: "الدالة YEAR() غير مدعومة في جملة WHERE." },
        { en: "Covering indexes only work with equality on integer columns.", ar: "الـ covering indexes تعمل فقط مع المساواة على أعمدة integer." },
        { en: "The statistics for the index are out of date.", ar: "إحصائيات الـ index قديمة." }
      ],
      correct: 0,
      why: { en: "Wrapping a column in a function makes the predicate non-sargable — not searchable by index — because the sorted values in the index no longer line up with what is being compared. Rewrite it as a range: OrderDate >= '2024-01-01' AND OrderDate < '2025-01-01'.", ar: "تغليف العمود بدالة يجعل الـ predicate غير sargable — أي غير قابل للبحث بالـ index — لأن القيم المرتّبة في الـ index لم تعد تطابق ما تجري مقارنته. أعد كتابته كنطاق: OrderDate >= '2024-01-01' AND OrderDate < '2025-01-01'." }
    }
  ]
};
```

NEXT: read-plan
