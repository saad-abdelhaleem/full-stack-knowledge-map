```js
const clusteredLesson = {
  id: "clustered",
  moduleId: "sql",
  title: { en: "Clustered vs non-clustered", ar: "Clustered مقابل Non-clustered" },
  summary: {
    en: "A clustered index decides the order the table's rows are physically stored in; a non-clustered index is a small separate copy of a few columns that points back to those rows.",
    ar: "الـ clustered index يحدد الترتيب الفعلي لتخزين صفوف الجدول على القرص، والـ non-clustered index نسخة صغيرة منفصلة من بعض الأعمدة تشير إلى تلك الصفوف."
  },
  mins: 16,
  sections: [
    {
      key: "why",
      blocks: [
        { t: "p",
          en: "An index is an extra sorted structure the database keeps beside your data so it can jump straight to the rows you asked for instead of reading the whole table. SQL Server has two kinds. A clustered index sorts and stores the actual table rows in the order of its key columns — the table becomes the index. A non-clustered index is a separate, smaller structure holding only a few columns in sorted order, plus a pointer to where the full row lives.",
          ar: "الـ index هو بنية إضافية مرتبة تحتفظ بها قاعدة البيانات بجانب بياناتك، لتصل مباشرة إلى الصفوف المطلوبة بدل قراءة الجدول كله. في SQL Server يوجد نوعان. الـ clustered index يرتّب ويخزّن صفوف الجدول الفعلية بترتيب أعمدة مفتاحه، أي أن الجدول نفسه يصبح هو الـ index. أما الـ non-clustered index فهو بنية منفصلة أصغر تحتوي على بعض الأعمدة فقط بترتيب مرتّب، مع مؤشر إلى مكان الصف الكامل." },
        { t: "kv", rows: [
          { k: { en: "Page", ar: "Page" },
            v: { en: "The 8 KB block SQL Server reads and writes as one unit. Every row lives inside some page; you never read half a page.", ar: "الوحدة بحجم 8 KB التي يقرأها SQL Server ويكتبها دفعة واحدة. كل صف يقع داخل page ما، ولا يمكن قراءة نصف page." } },
          { k: { en: "B-tree", ar: "B-tree" },
            v: { en: "The tree shape both index types use: a root page at the top, a few levels of pointer pages, and the sorted data at the bottom. Each level narrows the search.", ar: "شكل الشجرة الذي يستخدمه النوعان: root page في الأعلى، ثم مستويات قليلة من صفحات المؤشرات، والبيانات المرتبة في الأسفل. كل مستوى يضيّق نطاق البحث." } },
          { k: { en: "Leaf level", ar: "Leaf level" },
            v: { en: "The bottom row of pages in the tree. For a clustered index the leaf holds the full rows. For a non-clustered index it holds only the indexed columns.", ar: "المستوى الأسفل من الصفحات في الشجرة. في الـ clustered index يحتوي الـ leaf على الصفوف الكاملة، وفي الـ non-clustered يحتوي على الأعمدة المفهرسة فقط." } },
          { k: { en: "Seek vs scan", ar: "Seek مقابل Scan" },
            v: { en: "A seek walks down the tree to the exact rows it needs. A scan reads every page at the leaf level from start to end.", ar: "الـ seek ينزل عبر الشجرة إلى الصفوف المطلوبة بالضبط، والـ scan يقرأ كل صفحات المستوى الأسفل من البداية إلى النهاية." } },
          { k: { en: "Key lookup", ar: "Key lookup" },
            v: { en: "The extra trip from a non-clustered index back to the clustered index to fetch columns the non-clustered index does not carry.", ar: "الرحلة الإضافية من الـ non-clustered index إلى الـ clustered index لجلب أعمدة لا يحملها الـ non-clustered index." } },
          { k: { en: "Heap", ar: "Heap" },
            v: { en: "A table with no clustered index. Its rows sit in no particular order, and non-clustered indexes point at them by physical address (RID).", ar: "جدول بلا clustered index. صفوفه غير مرتبة بأي ترتيب، والـ non-clustered indexes تشير إليها بعنوان فيزيائي (RID)." } },
          { k: { en: "Logical reads", ar: "Logical reads" },
            v: { en: "How many 8 KB pages a query touched. It is the honest cost number — unlike time, it does not change with cache warmth or machine load.", ar: "عدد صفحات الـ 8 KB التي لمسها الاستعلام. هو رقم التكلفة الصادق، لأنه لا يتغير حسب حرارة الـ cache أو حِمل الجهاز، بعكس الزمن." } }
        ]},
        { t: "p",
          en: "Think of a printed phone book sorted by last name. The book itself is the clustered index: the entries are physically in that order, so finding \"Nassar\" means flipping to the N section, not reading every page. Now imagine a thin appendix at the back listing phone numbers in numeric order, each with the page number where that person appears. That appendix is a non-clustered index: it is small, it is sorted differently, and it does not contain the person's address — for that you must turn to the page it points at. That turn is the key lookup.",
          ar: "تخيّل دليل هاتف مطبوع مرتّب حسب اسم العائلة. الكتاب نفسه هو الـ clustered index: المدخلات مرتبة فعلياً بهذا الشكل، فالوصول إلى «نصار» يعني فتح قسم النون لا قراءة كل الصفحات. الآن تخيّل ملحقاً رفيعاً في آخر الكتاب يسرد أرقام الهواتف بترتيب رقمي، ومع كل رقم رقم الصفحة التي يظهر فيها صاحبه. هذا الملحق هو الـ non-clustered index: صغير، ومرتّب بطريقة مختلفة، ولا يحتوي على عنوان الشخص، فللحصول على العنوان يجب فتح الصفحة التي يشير إليها. هذه هي عملية الـ key lookup." },
        { t: "p",
          en: "This distinction exists because a table can be physically stored in only one order at a time — a book can only be bound one way. So SQL Server allows at most one clustered index per table, and up to 999 non-clustered indexes. Every design question in this lesson comes from that single limit: you get one physical order for free, and every other access path costs you a separate structure that must be kept up to date on every insert, update and delete.",
          ar: "هذا التمييز موجود لأن الجدول يمكن تخزينه فيزيائياً بترتيب واحد فقط في أي لحظة، تماماً كما يُجلَّد الكتاب بطريقة واحدة. لذلك يسمح SQL Server بـ clustered index واحد كحد أقصى لكل جدول، وحتى 999 من الـ non-clustered indexes. كل أسئلة التصميم في هذا الدرس تنبع من هذا الحد: تحصل على ترتيب فيزيائي واحد مجاناً، وأي مسار وصول آخر يكلفك بنية منفصلة يجب تحديثها مع كل insert و update و delete." },
        { t: "callout", kind: "note",
          en: "In SQL Server, declaring a PRIMARY KEY creates a clustered index on those columns by default. That default is a choice someone made for you, and it is often the wrong one — you can write PRIMARY KEY NONCLUSTERED and cluster on something else.",
          ar: "في SQL Server، تعريف PRIMARY KEY ينشئ clustered index على تلك الأعمدة افتراضياً. هذا الافتراض قرار اتُّخذ نيابة عنك، وغالباً يكون خاطئاً — يمكنك كتابة PRIMARY KEY NONCLUSTERED وعمل clustering على عمود آخر." }
      ]
    },
    {
      key: "problem",
      blocks: [
        { t: "p",
          en: "The running example for this lesson is one table and one query. The table is Orders in an e-commerce system: 20 million rows, about 400 bytes per row, roughly 8 GB on disk. The query powers the \"my orders\" page: give me one customer's orders from the last 90 days, newest first, returning the order id, date and total.",
          ar: "المثال الذي سنستخدمه طوال الدرس هو جدول واحد واستعلام واحد. الجدول هو Orders في نظام تجارة إلكترونية: 20 مليون صف، حوالي 400 بايت لكل صف، أي نحو 8 GB على القرص. الاستعلام يخدم صفحة «طلباتي»: أعطني طلبات عميل واحد خلال آخر 90 يوماً، الأحدث أولاً، مع رقم الطلب والتاريخ والإجمالي." },
        { t: "code", lang: "sql", label: { en: "The query and the table as first written", ar: "الاستعلام والجدول كما كُتبا أول مرة" },
          code: "CREATE TABLE dbo.Orders (\n    OrderId    int IDENTITY PRIMARY KEY,   -- clustered by default\n    CustomerId int          NOT NULL,\n    OrderDate  datetime2(0) NOT NULL,\n    Status     tinyint      NOT NULL,\n    Total      decimal(18,2) NOT NULL,\n    Notes      nvarchar(400) NULL\n);\n\nSELECT OrderId, OrderDate, Total\nFROM   dbo.Orders\nWHERE  CustomerId = 91422\n  AND  OrderDate >= DATEADD(day, -90, SYSUTCDATETIME())\nORDER BY OrderDate DESC;" },
        { t: "p",
          en: "With only the default clustered index on OrderId, there is no structure sorted by CustomerId. SQL Server has one option: read the entire clustered index from the first page to the last and throw away every row that does not belong to customer 91422. Measured with SET STATISTICS IO ON, that is 1,010,000 logical reads — meaning the engine touched just over a million 8 KB pages, about 8 GB, to return 14 rows. On a warm cache it took 2.3 seconds of CPU; on a cold cache the disk read dominated and it took 9 seconds.",
          ar: "مع وجود الـ clustered index الافتراضي على OrderId فقط، لا توجد أي بنية مرتبة حسب CustomerId. أمام SQL Server خيار واحد: قراءة الـ clustered index كاملاً من أول صفحة إلى آخرها ورمي كل صف لا يخص العميل 91422. بقياس SET STATISTICS IO ON، النتيجة 1,010,000 logical reads، أي أن المحرك لمس أكثر من مليون page بحجم 8 KB، نحو 8 GB، ليعيد 14 صفاً. مع cache دافئ استغرق 2.3 ثانية من الـ CPU، ومع cache بارد سيطرت قراءة القرص فاستغرق 9 ثوانٍ." },
        { t: "p",
          en: "Now add one non-clustered index on (CustomerId, OrderDate) that also carries Total. The same query drops to 6 logical reads and under 1 millisecond. Six pages instead of a million is a factor of about 168,000. Nothing about the hardware changed; the engine simply gained a sorted path from CustomerId straight to the rows it wanted, and the index already held every column the query asked for, so it never had to visit the table at all.",
          ar: "الآن أضف non-clustered index واحداً على (CustomerId, OrderDate) يحمل معه عمود Total. ينخفض الاستعلام نفسه إلى 6 logical reads وأقل من ميلي ثانية واحدة. ست صفحات بدل مليون يعني تحسناً بمعامل 168,000 تقريباً. لم يتغير شيء في العتاد، فقط حصل المحرك على مسار مرتّب من CustomerId إلى الصفوف المطلوبة مباشرة، والـ index كان يحمل أصلاً كل الأعمدة التي طلبها الاستعلام، فلم يحتج لزيارة الجدول إطلاقاً." },
        { t: "kv", rows: [
          { k: { en: "Before: clustered index scan", ar: "قبل: clustered index scan" },
            v: { en: "1,010,000 logical reads, 2.3 s CPU, 14 rows returned out of 20,000,000 read. Cost grows with the table.", ar: "1,010,000 logical reads و2.3 ثانية CPU، وإرجاع 14 صفاً من أصل 20,000,000 صف مقروء. التكلفة تنمو مع حجم الجدول." } },
          { k: { en: "After: non-clustered index seek", ar: "بعد: non-clustered index seek" },
            v: { en: "6 logical reads, under 1 ms, 14 rows read and 14 returned. Cost grows with the number of matching rows, not the table.", ar: "6 logical reads وأقل من ميلي ثانية، وقراءة 14 صفاً وإرجاع 14. التكلفة تنمو مع عدد الصفوف المطابقة لا مع حجم الجدول." } },
          { k: { en: "What it cost", ar: "ما الذي كلّفه ذلك" },
            v: { en: "About 420 MB of extra storage, and every INSERT into Orders now writes to two structures instead of one.", ar: "نحو 420 MB مساحة تخزين إضافية، وكل INSERT في Orders صار يكتب في بنيتين بدل واحدة." } }
        ]}
      ]
    },
    {
      key: "internals",
      blocks: [
        { t: "p",
          en: "Both index types are B-trees. A B-tree is a shallow tree built so that finding any key takes the same small number of page reads no matter how big the table is. It has a single root page at the top, one or more levels of intermediate pages in the middle, and the leaf level at the bottom. Each non-leaf page holds a list of key values paired with the address of a page one level down. To find a key you read the root, pick the one child whose key range contains your value, read that child, and repeat until you reach a leaf.",
          ar: "كلا النوعين عبارة عن B-tree. الـ B-tree شجرة ضحلة مبنية بحيث يستغرق الوصول إلى أي مفتاح نفس العدد الصغير من قراءات الصفحات مهما كبر الجدول. لها root page واحدة في الأعلى، ومستوى أو أكثر من الصفحات الوسيطة، ثم الـ leaf level في الأسفل. كل صفحة غير leaf تحتوي على قائمة من قيم المفاتيح مع عنوان صفحة في المستوى الأدنى. للوصول إلى مفتاح تقرأ الـ root، وتختار الابن الوحيد الذي يقع نطاق مفاتيحه على قيمتك، ثم تقرأ تلك الصفحة، وتكرر حتى تصل إلى leaf." },
        { t: "p",
          en: "The tree is shallow because each 8 KB page can hold hundreds of key-plus-pointer entries. With a 4-byte int key, one page holds roughly 800 entries, so three levels address about 800 × 800 × 800 = 512 million rows. That is why our 20-million-row table needs only three page reads to descend the tree, and why index depth barely grows as data grows. It is also why a wide key hurts: an 80-byte key fits only about 100 entries per page, so the same table now needs four levels instead of three, and every lookup pays an extra read.",
          ar: "الشجرة ضحلة لأن كل page بحجم 8 KB تتسع لمئات المدخلات من نوع مفتاح + مؤشر. مع مفتاح من نوع int بحجم 4 بايت، تتسع الصفحة لنحو 800 مدخل، فثلاثة مستويات تغطي نحو 800 × 800 × 800 = 512 مليون صف. لهذا يحتاج جدولنا ذو الـ 20 مليون صف إلى ثلاث قراءات صفحات فقط للنزول في الشجرة، ولهذا لا يزداد عمق الـ index تقريباً مع نمو البيانات. ولهذا أيضاً يضر المفتاح العريض: مفتاح بحجم 80 بايت يتسع لنحو 100 مدخل فقط في الصفحة، فيحتاج الجدول نفسه إلى أربعة مستويات بدل ثلاثة، وكل بحث يدفع قراءة إضافية." },
        { t: "p",
          en: "The one real difference between the two index types is what sits at the leaf level. In a clustered index the leaf pages are the table: the full row, every column, stored in clustered-key order. There is no separate copy of the data. In a non-clustered index the leaf pages hold only the index key columns, any INCLUDE columns, and the clustered key of the matching row — that clustered key is the pointer back. If the table is a heap (no clustered index), the pointer is instead an 8-byte physical address called a RID, made of file number, page number and slot number.",
          ar: "الفرق الحقيقي الوحيد بين النوعين هو ما يوجد في الـ leaf level. في الـ clustered index صفحات الـ leaf هي الجدول نفسه: الصف الكامل بكل أعمدته، مخزّن بترتيب الـ clustered key. لا توجد نسخة منفصلة من البيانات. في الـ non-clustered index تحتوي صفحات الـ leaf على أعمدة مفتاح الـ index فقط، وأي أعمدة INCLUDE، بالإضافة إلى الـ clustered key للصف المطابق — وهذا الـ clustered key هو المؤشر للعودة. وإذا كان الجدول heap بلا clustered index، يكون المؤشر عنواناً فيزيائياً بحجم 8 بايت يُسمى RID ويتكون من رقم الملف ورقم الصفحة ورقم الخانة." },
        { t: "code", lang: "sql", label: { en: "Tracing our query with and without the covering columns", ar: "تتبّع استعلامنا مع أعمدة التغطية وبدونها" },
          code: "-- (a) index on the filter columns only\nCREATE NONCLUSTERED INDEX IX_Orders_Customer_Date\n    ON dbo.Orders (CustomerId, OrderDate DESC);\n\n-- plan: Index Seek  ->  Key Lookup (Clustered)  ->  Nested Loops\n-- Total is not in the index, so each of the 14 rows costs a\n-- separate 3-page descent of the clustered index: 6 + 14*3 = 48 reads.\n\n-- (b) same index, carrying Total at the leaf\nCREATE NONCLUSTERED INDEX IX_Orders_Customer_Date\n    ON dbo.Orders (CustomerId, OrderDate DESC)\n    INCLUDE (Total)\n    WITH (DROP_EXISTING = ON);\n\n-- plan: Index Seek only. 6 reads. The index now answers the\n-- whole query by itself, so it is a covering index for it." },
        { t: "p",
          en: "Follow version (b) step by step. SQL Server reads the index root page and finds the child covering CustomerId 91422. It reads that intermediate page and finds the leaf page where customer 91422's newest orders begin. Because the key is (CustomerId, OrderDate DESC), all of that customer's rows are physically next to each other and already in newest-first order — so the ORDER BY costs nothing, no sort operator appears in the plan. The engine walks the leaf forward until OrderDate falls below the 90-day cutoff, then stops. It read 3 pages descending plus 3 leaf pages: 6 logical reads.",
          ar: "تابع النسخة (b) خطوة بخطوة. يقرأ SQL Server صفحة الـ root ويجد الابن الذي يغطي CustomerId رقم 91422. ثم يقرأ تلك الصفحة الوسيطة ويجد صفحة الـ leaf التي تبدأ عندها أحدث طلبات العميل 91422. ولأن المفتاح هو (CustomerId, OrderDate DESC)، فإن كل صفوف هذا العميل متجاورة فيزيائياً ومرتبة أصلاً من الأحدث إلى الأقدم، فلا تكلف جملة ORDER BY شيئاً ولا يظهر أي sort operator في الخطة. يمشي المحرك في الـ leaf إلى الأمام حتى يهبط OrderDate تحت حد الـ 90 يوماً ثم يتوقف. قرأ 3 صفحات في النزول و3 صفحات leaf: أي 6 logical reads." },
        { t: "kv", rows: [
          { k: { en: "Clustered index leaf", ar: "leaf الـ clustered index" },
            v: { en: "The actual data rows, in key order. One per table. Changing the clustered key of a row physically moves the row.", ar: "صفوف البيانات الفعلية بترتيب المفتاح. واحد لكل جدول. تغيير الـ clustered key لصف ينقل الصف فيزيائياً." } },
          { k: { en: "Non-clustered leaf", ar: "leaf الـ non-clustered" },
            v: { en: "Key columns + INCLUDE columns + the clustered key as a pointer. Much narrower, so far more rows fit per page.", ar: "أعمدة المفتاح + أعمدة INCLUDE + الـ clustered key كمؤشر. أضيق بكثير، فيتسع عدد أكبر من الصفوف في كل صفحة." } },
          { k: { en: "Page split", ar: "Page split" },
            v: { en: "When a row must be inserted into a full page, SQL Server allocates a new page and moves half the rows there. Costs writes and leaves both pages half empty.", ar: "عندما يجب إدراج صف في صفحة ممتلئة، يخصص SQL Server صفحة جديدة وينقل نصف الصفوف إليها. يكلّف عمليات كتابة ويترك الصفحتين نصف فارغتين." } },
          { k: { en: "Fragmentation", ar: "Fragmentation" },
            v: { en: "The result of many page splits: leaf pages are no longer in physical order on disk, so range scans read more pages and lose the benefit of sequential I/O.", ar: "نتيجة كثرة الـ page splits: صفحات الـ leaf لم تعد بترتيب فيزيائي على القرص، فتقرأ عمليات المسح صفحات أكثر وتفقد ميزة الـ I/O المتسلسل." } },
          { k: { en: "Uniquifier", ar: "Uniquifier" },
            v: { en: "If a clustered index is not declared UNIQUE, SQL Server silently adds a hidden 4-byte counter to duplicate keys, widening every non-clustered index too.", ar: "إذا لم يُعرَّف الـ clustered index كـ UNIQUE، يضيف SQL Server بصمت عدّاداً مخفياً بحجم 4 بايت للمفاتيح المكررة، ما يوسّع كل الـ non-clustered indexes أيضاً." } }
        ]},
        { t: "p",
          en: "One more consequence follows from the leaf layout, and it is the one people miss. Because every non-clustered index stores the clustered key inside every one of its leaf entries, the clustered key is copied into every other index on the table. A 4-byte int clustered key on a table with six non-clustered indexes adds 4 bytes × 20 million rows × 6 indexes = about 480 MB. Swap it for a 16-byte GUID and the same tables cost 1.9 GB — an extra 1.4 GB that buys nothing, and pushes real data out of memory.",
          ar: "تنتج نتيجة أخرى من ترتيب الـ leaf، وهي التي يغفل عنها الناس. لأن كل non-clustered index يخزّن الـ clustered key داخل كل مدخل من مدخلات الـ leaf، فإن الـ clustered key يُنسخ إلى كل index آخر على الجدول. مفتاح int بحجم 4 بايت على جدول فيه ستة non-clustered indexes يضيف 4 بايت × 20 مليون صف × 6 indexes، أي نحو 480 MB. استبدله بـ GUID بحجم 16 بايت فتصبح التكلفة 1.9 GB، أي 1.4 GB إضافية لا تشتري شيئاً وتدفع بيانات حقيقية خارج الذاكرة." }
      ]
    },
    {
      key: "tradeoffs",
      blocks: [
        { t: "tradeoff",
          pros: {
            en: [
              "A clustered index makes range queries on its key almost free — matching rows are physically adjacent, so one seek plus a short walk returns them all.",
              "It removes sorts: data already in key order means ORDER BY on that key costs nothing.",
              "Non-clustered indexes are narrow, so a query answered entirely from one touches a fraction of the pages the table would.",
              "You can have many non-clustered indexes, each serving a different access pattern of the same table."
            ],
            ar: [
              "الـ clustered index يجعل استعلامات النطاق على مفتاحه شبه مجانية، لأن الصفوف المطابقة متجاورة فيزيائياً، فيكفي seek واحد ومشي قصير لإرجاعها كلها.",
              "يلغي عمليات الفرز: البيانات مرتبة أصلاً بترتيب المفتاح، فلا تكلّف ORDER BY على ذلك المفتاح شيئاً.",
              "الـ non-clustered indexes ضيقة، فالاستعلام الذي يُجاب كلياً من أحدها يلمس جزءاً بسيطاً من الصفحات التي يلمسها الجدول.",
              "يمكنك امتلاك عدة non-clustered indexes، كل واحد يخدم نمط وصول مختلفاً لنفس الجدول."
            ]
          },
          cons: {
            en: [
              "Every index must be updated on INSERT, UPDATE and DELETE — six indexes means six writes per row inserted.",
              "The clustered key is copied into every non-clustered index, so a wide clustered key inflates the whole table's storage.",
              "A non-clustered index that lacks a needed column triggers a key lookup per row, which is fine for 14 rows and terrible for 50,000.",
              "Indexes consume buffer pool memory; pages cached for an unused index are pages not cached for a hot one."
            ],
            ar: [
              "يجب تحديث كل index عند INSERT وUPDATE وDELETE — ستة indexes تعني ست عمليات كتابة لكل صف مُدرج.",
              "يُنسخ الـ clustered key داخل كل non-clustered index، فالمفتاح العريض يضخّم تخزين الجدول كله.",
              "الـ non-clustered index الذي ينقصه عمود مطلوب يسبب key lookup لكل صف، وهذا مقبول مع 14 صفاً وكارثي مع 50,000.",
              "الـ indexes تستهلك ذاكرة الـ buffer pool، والصفحات المخزّنة لـ index غير مستخدم هي صفحات لم تُخزَّن لـ index نشط."
            ]
          },
          limits: {
            en: [
              "At most one clustered index per table, because a table has only one physical order.",
              "An index only helps when the leading key column appears in the WHERE or JOIN — an index on (CustomerId, OrderDate) cannot seek on OrderDate alone.",
              "Index keys are limited to 900 bytes for a clustered index and 1700 for a non-clustered one.",
              "Indexes do not help when the query returns most of the table; past roughly 1-5% of rows the optimizer prefers a scan and is usually right."
            ],
            ar: [
              "clustered index واحد كحد أقصى لكل جدول، لأن للجدول ترتيباً فيزيائياً واحداً فقط.",
              "الـ index يفيد فقط عندما يظهر عمود المفتاح الأول في WHERE أو JOIN — الـ index على (CustomerId, OrderDate) لا يستطيع عمل seek على OrderDate وحده.",
              "مفاتيح الـ index محدودة بـ 900 بايت للـ clustered index و1700 بايت للـ non-clustered.",
              "الـ indexes لا تفيد عندما يعيد الاستعلام معظم الجدول؛ فبعد نحو 1-5% من الصفوف يفضّل الـ optimizer عمل scan، وهو محق عادة."
            ]
          },
          alts: {
            en: [
              "Heap plus non-clustered indexes: acceptable for staging tables written once and read by index only.",
              "Columnstore index: stores data by column instead of by row, far better for scanning millions of rows for analytics.",
              "Filtered index (WHERE clause on the index): a much smaller index when queries only ever touch a subset, such as active orders.",
              "Indexed view: pre-computes a join or aggregate and stores it, at the cost of slowing every write to the base tables."
            ],
            ar: [
              "heap مع non-clustered indexes: مقبول لجداول التجهيز التي تُكتب مرة وتُقرأ عبر الـ index فقط.",
              "Columnstore index: يخزّن البيانات حسب العمود لا حسب الصف، وهو أفضل بكثير لمسح ملايين الصفوف لأغراض التحليل.",
              "Filtered index (بجملة WHERE على الـ index): index أصغر بكثير عندما تلمس الاستعلامات مجموعة جزئية فقط، مثل الطلبات النشطة.",
              "Indexed view: يحسب مسبقاً join أو aggregate ويخزّنه، مقابل إبطاء كل عملية كتابة على الجداول الأساسية."
            ]
          }
        }
      ]
    },
    {
      key: "mistakes",
      blocks: [
        { t: "mistake",
          title: { en: "Clustering on a random GUID", ar: "عمل clustering على GUID عشوائي" },
          body: {
            en: "A team declared OrderId as uniqueidentifier DEFAULT NEWID() and made it the primary key, so it became the clustered key. NEWID() produces random values, so each new order lands in a random position in the middle of the table instead of at the end. Every insert had a good chance of hitting a full page, forcing a page split. Within three weeks the index was 78% fragmented, inserts had slowed from 900 to 210 per second, and the 16-byte key had added 1.4 GB across the table's six non-clustered indexes. The fix is NEWSEQUENTIALID(), which generates GUIDs in increasing order so inserts always append at the end, or an int IDENTITY clustered key with the GUID kept as a unique non-clustered index for external references.",
            ar: "عرّف فريق العمود OrderId على أنه uniqueidentifier DEFAULT NEWID() وجعله primary key، فصار هو الـ clustered key. الدالة NEWID() تنتج قيماً عشوائية، فكل طلب جديد يهبط في موضع عشوائي وسط الجدول بدل نهايته. لذلك كان لكل insert احتمال كبير أن يصادف صفحة ممتلئة فيفرض page split. خلال ثلاثة أسابيع بلغ الـ fragmentation نسبة 78%، وتباطأت عمليات الإدراج من 900 إلى 210 في الثانية، وأضاف المفتاح ذو الـ 16 بايت نحو 1.4 GB عبر الـ non-clustered indexes الستة للجدول. الحل هو NEWSEQUENTIALID() التي تولّد GUIDs بترتيب تصاعدي فتُلحَق عمليات الإدراج دائماً في النهاية، أو استخدام int IDENTITY كـ clustered key مع إبقاء الـ GUID كـ unique non-clustered index للإشارات الخارجية." },
          fix: "ALTER TABLE dbo.Orders\n  ADD CONSTRAINT PK_Orders PRIMARY KEY NONCLUSTERED (OrderGuid);\nCREATE UNIQUE CLUSTERED INDEX CX_Orders_OrderId ON dbo.Orders (OrderId);" },
        { t: "mistake",
          title: { en: "One index per column", ar: "index لكل عمود" },
          body: {
            en: "Someone read that indexes make queries faster and created eight single-column non-clustered indexes on Orders — one on CustomerId, one on OrderDate, one on Status, and so on. Our query still could not be answered by any of them alone, because the filter needs CustomerId and OrderDate together and no single-column index gives that. Meanwhile the nightly import that inserts 2 million orders went from 6 minutes to 41 minutes, because each row now wrote nine structures. Two well-chosen composite indexes replaced all eight and brought the import back to 9 minutes.",
            ar: "قرأ أحدهم أن الـ indexes تسرّع الاستعلامات فأنشأ ثمانية non-clustered indexes بعمود واحد على Orders: واحد على CustomerId وآخر على OrderDate وآخر على Status وهكذا. ومع ذلك لم يستطع أي منها الإجابة على استعلامنا وحده، لأن الفلترة تحتاج CustomerId وOrderDate معاً ولا يوفر ذلك أي index بعمود واحد. في المقابل ارتفع زمن الاستيراد الليلي الذي يُدرج مليوني طلب من 6 دقائق إلى 41 دقيقة، لأن كل صف صار يكتب في تسع بنى. استُبدلت الثمانية بـ composite index مدروسين، فعاد الاستيراد إلى 9 دقائق." },
          fix: "-- one composite index that actually matches the WHERE clause\nCREATE NONCLUSTERED INDEX IX_Orders_Customer_Date\n    ON dbo.Orders (CustomerId, OrderDate DESC) INCLUDE (Total);" },
        { t: "mistake",
          title: { en: "Wrong column order in a composite key", ar: "ترتيب خاطئ للأعمدة في مفتاح مركّب" },
          body: {
            en: "The index was created as (OrderDate, CustomerId) instead of (CustomerId, OrderDate). An index is sorted by its first key column first, so this one groups all orders by date and scatters each customer's rows across every date. The query could no longer seek to one customer; SQL Server had to scan the whole 90-day date range — 340,000 rows — and filter CustomerId row by row. Reads went from 6 to 4,900. Rule: the column you compare with equals (=) goes first; the column you compare with a range (>=, BETWEEN) goes after it.",
            ar: "أُنشئ الـ index بترتيب (OrderDate, CustomerId) بدل (CustomerId, OrderDate). الـ index مرتّب حسب عمود مفتاحه الأول أولاً، فهذا الترتيب يجمّع الطلبات حسب التاريخ ويبعثر صفوف كل عميل عبر كل التواريخ. لم يعد بإمكان الاستعلام عمل seek لعميل واحد، فاضطر SQL Server لمسح نطاق الـ 90 يوماً كاملاً — 340,000 صف — وفلترة CustomerId صفاً صفاً. ارتفعت القراءات من 6 إلى 4,900. القاعدة: العمود الذي تقارنه بالمساواة (=) يأتي أولاً، والعمود الذي تقارنه بنطاق (>= أو BETWEEN) يأتي بعده." },
          fix: "-- equality column first, range column second\nCREATE NONCLUSTERED INDEX IX_Orders_Customer_Date\n    ON dbo.Orders (CustomerId, OrderDate DESC) INCLUDE (Total);" },
        { t: "mistake",
          title: { en: "Wrapping the indexed column in a function", ar: "تغليف العمود المفهرس داخل دالة" },
          body: {
            en: "A developer wrote WHERE CAST(OrderDate AS date) = @day. The index is sorted by OrderDate, not by CAST(OrderDate AS date), so SQL Server cannot use the sorted order — it must compute the function for all 20 million rows before it can compare. This is called a non-sargable predicate, meaning a condition the engine cannot turn into an index seek. The plan flipped from a seek to a full scan and the query went from 3 ms to 2.1 s. Rewriting it as a range against the raw column restored the seek.",
            ar: "كتب أحد المطورين WHERE CAST(OrderDate AS date) = @day. الـ index مرتّب حسب OrderDate لا حسب CAST(OrderDate AS date)، فلا يستطيع SQL Server استخدام الترتيب المخزّن، ويضطر لحساب الدالة على العشرين مليون صف قبل المقارنة. يُسمى هذا predicate غير sargable، أي شرط لا يستطيع المحرك تحويله إلى index seek. تحوّلت الخطة من seek إلى scan كامل وارتفع زمن الاستعلام من 3 ميلي ثانية إلى 2.1 ثانية. وإعادة كتابته كنطاق على العمود الخام أعادت الـ seek." },
          fix: "WHERE OrderDate >= @day\n  AND OrderDate <  DATEADD(day, 1, @day);" }
      ]
    },
    {
      key: "interview",
      blocks: [
        { t: "qa", level: "junior",
          q: { en: "What is the difference between a clustered and a non-clustered index?", ar: "ما الفرق بين الـ clustered index والـ non-clustered index؟" },
          a: {
            en: "The clustered index is the table. Its bottom level holds the actual rows, stored in the order of its key columns, so a table can only have one — you can only store the rows in one order. A non-clustered index is a separate, narrower structure: its bottom level holds just the indexed columns plus a pointer back to the row, which in SQL Server is the clustered key. So a non-clustered index is a shortcut, and if it doesn't carry a column your query needs, the engine has to follow the pointer back to the table for each row.",
            ar: "الـ clustered index هو الجدول نفسه. مستواه الأسفل يحتوي على الصفوف الفعلية مخزّنة بترتيب أعمدة مفتاحه، ولهذا لا يمكن أن يوجد أكثر من واحد — لأن الصفوف تُخزَّن بترتيب واحد فقط. أما الـ non-clustered index فبنية منفصلة أضيق: مستواه الأسفل يحتوي على الأعمدة المفهرسة فقط مع مؤشر يعود إلى الصف، وهو في SQL Server الـ clustered key. إذن الـ non-clustered index اختصار، وإذا لم يحمل عموداً يحتاجه استعلامك فسيتبع المحرك المؤشر إلى الجدول لكل صف." } },
        { t: "qa", level: "mid",
          q: { en: "You see a Key Lookup in a plan. What is it and when do you care?", ar: "ترى Key Lookup في خطة تنفيذ. ما هي ومتى تهتم بها؟" },
          a: {
            en: "A key lookup is the engine going back to the clustered index to fetch columns the non-clustered index didn't have. It costs roughly three extra page reads per row, because it walks the clustered index tree from the root each time. For a query returning 14 rows that's 42 reads and I ignore it. For one returning 50,000 rows that's 150,000 reads and the optimizer will usually abandon the index entirely and scan the table instead. So I care once the row count is in the thousands — and the fix is to add the missing columns to the index with INCLUDE, as long as they aren't huge.",
            ar: "الـ key lookup هي رجوع المحرك إلى الـ clustered index لجلب أعمدة لم يحملها الـ non-clustered index. تكلفتها نحو ثلاث قراءات صفحات إضافية لكل صف، لأنها تنزل في شجرة الـ clustered index من الـ root في كل مرة. مع استعلام يعيد 14 صفاً تعني 42 قراءة وأتجاهلها. ومع استعلام يعيد 50,000 صف تعني 150,000 قراءة، وغالباً سيتخلى الـ optimizer عن الـ index كلياً ويمسح الجدول. لذلك أهتم عندما يصل عدد الصفوف إلى الآلاف، والحل إضافة الأعمدة الناقصة إلى الـ index عبر INCLUDE ما دامت ليست ضخمة." } },
        { t: "qa", level: "mid",
          q: { en: "What makes a good clustered key?", ar: "ما الذي يجعل الـ clustered key جيداً؟" },
          a: {
            en: "Four things: narrow, because the key is copied into every non-clustered index; unique, because otherwise SQL Server adds a hidden 4-byte uniquifier; ever-increasing, so inserts append at the end of the last page instead of splitting pages in the middle; and static, because changing a clustered key physically moves the row and updates the pointer in every non-clustered index. An int or bigint IDENTITY column hits all four. A random GUID fails three of them. Occasionally I'll cluster on something else — a tenant id plus id on a multi-tenant table — when almost every query filters on that tenant and I want its rows physically together.",
            ar: "أربعة أشياء: أن يكون ضيقاً لأنه يُنسخ داخل كل non-clustered index؛ وفريداً وإلا أضاف SQL Server uniquifier مخفياً بحجم 4 بايت؛ ومتزايداً باستمرار حتى تُلحَق عمليات الإدراج في نهاية آخر صفحة بدل تقسيم صفحات في المنتصف؛ وثابتاً لأن تغيير الـ clustered key ينقل الصف فيزيائياً ويحدّث المؤشر في كل non-clustered index. عمود int أو bigint من نوع IDENTITY يحقق الأربعة، والـ GUID العشوائي يفشل في ثلاثة منها. أحياناً أختار مفتاحاً آخر — مثل tenant id مع id في جدول متعدد المستأجرين — عندما تفلتر كل الاستعلامات تقريباً على ذلك الـ tenant وأريد صفوفه متجاورة فيزيائياً." } },
        { t: "qa", level: "senior",
          q: { en: "When is a heap — a table with no clustered index — the right choice?", ar: "متى يكون الـ heap، أي جدول بلا clustered index، هو الخيار الصحيح؟" },
          a: {
            en: "Rarely, but it happens. A staging table that gets bulk-loaded, read once and truncated is a fair case: there is no range query to benefit from physical order, and skipping the clustered index makes the bulk insert measurably faster because rows just get appended wherever there is space. The catch is that once you UPDATE rows in a heap and they no longer fit in place, SQL Server leaves a forwarding pointer behind, and reads start chasing two pages per row. So: heap for write-once-read-once tables, clustered index for anything that lives and gets updated.",
            ar: "نادراً، لكنه يحدث. جدول تجهيز يُحمَّل دفعة واحدة ويُقرأ مرة ثم يُفرَّغ حالة معقولة: لا يوجد استعلام نطاق يستفيد من الترتيب الفيزيائي، وتجاهل الـ clustered index يجعل الإدراج الكمّي أسرع بشكل ملموس لأن الصفوف تُلحَق في أي مساحة متاحة. المشكلة أنك حين تُجري UPDATE على صفوف في heap ولم تعد تتسع في مكانها، يترك SQL Server forwarding pointer، فتبدأ القراءات بملاحقة صفحتين لكل صف. إذن: heap للجداول التي تُكتب مرة وتُقرأ مرة، وclustered index لأي جدول يعيش ويُحدَّث." } },
        { t: "qa", level: "senior",
          q: { en: "The optimizer ignored the index you created. Why might that be correct?", ar: "تجاهل الـ optimizer الـ index الذي أنشأته. لماذا قد يكون محقاً؟" },
          a: {
            en: "The usual reason is the tipping point. If a query matches a large share of the table, using a non-clustered index means one key lookup per row — thousands of random page reads — while scanning the clustered index reads pages sequentially, which is much cheaper per page. Somewhere around 1-5% of rows the scan wins, and the optimizer picks it. The other honest reasons are stale statistics making it estimate the wrong row count, a leading key column that isn't in the WHERE clause, and a predicate wrapped in a function so it can't seek at all. I check the estimated versus actual row counts in the plan first; a big gap points at statistics rather than the index.",
            ar: "السبب الشائع هو نقطة الانقلاب. إذا طابق الاستعلام نسبة كبيرة من الجدول، فاستخدام non-clustered index يعني key lookup لكل صف، أي آلاف القراءات العشوائية، بينما مسح الـ clustered index يقرأ الصفحات بالتسلسل وهو أرخص بكثير لكل صفحة. عند حدود 1-5% من الصفوف يفوز الـ scan فيختاره الـ optimizer. الأسباب الأخرى الحقيقية: statistics قديمة تجعله يقدّر عدد صفوف خاطئاً، أو عمود مفتاح أول غير موجود في WHERE، أو predicate مغلّف بدالة فلا يستطيع عمل seek أصلاً. أبدأ بمقارنة الصفوف المقدّرة بالفعلية في الخطة؛ الفجوة الكبيرة تشير إلى الـ statistics لا إلى الـ index." } },
        { t: "qa", level: "staff",
          q: { en: "Your team keeps adding indexes to fix slow queries and the write path keeps degrading. How do you fix this structurally?", ar: "فريقك يضيف indexes باستمرار لإصلاح استعلامات بطيئة، ومسار الكتابة يتدهور. كيف تعالج هذا بنيوياً؟" },
          a: {
            en: "The problem isn't the individual index, it's that nobody owns the total. I do three things. First, make the cost visible: a weekly report from sys.dm_db_index_usage_stats showing every index with more writes than reads, and every index unused since restart — those get dropped on a schedule, not debated case by case. Second, make index changes go through migrations reviewed like code, with the query they serve and its measured before/after reads in the pull request description; that alone stops most duplicate indexes, since reviewers can see an existing index already covers it. Third, set a per-table budget — say five non-clustered indexes on hot write tables — so adding a sixth forces someone to justify removing one. The point is turning an invisible, gradual cost into a decision someone has to make out loud.",
            ar: "المشكلة ليست في الـ index الواحد بل في أن لا أحد يملك المجموع. أفعل ثلاثة أشياء. أولاً أجعل التكلفة مرئية: تقرير أسبوعي من sys.dm_db_index_usage_stats يعرض كل index عدد عمليات الكتابة عليه أكبر من القراءة، وكل index غير مستخدم منذ إعادة التشغيل — وتُحذف هذه وفق جدول ثابت لا بنقاش لكل حالة. ثانياً أجعل تغييرات الـ index تمر عبر migrations تُراجَع مثل الكود، مع ذكر الاستعلام الذي تخدمه وقياس القراءات قبل وبعد في وصف الـ pull request؛ هذا وحده يمنع معظم الـ indexes المكررة لأن المراجع يرى أن index موجوداً يغطيها. ثالثاً أضع ميزانية لكل جدول — مثلاً خمسة non-clustered indexes على جداول الكتابة النشطة — فإضافة السادس تُجبر أحدهم على تبرير حذف واحد. الهدف تحويل تكلفة خفية تدريجية إلى قرار يجب أن يُعلن." } }
      ]
    },
    {
      key: "codereview",
      blocks: [
        { t: "review", severity: "high",
          title: { en: "Random GUID as the clustered primary key", ar: "GUID عشوائي كـ clustered primary key" },
          bad: "CREATE TABLE dbo.Orders (\n    OrderId    uniqueidentifier NOT NULL\n                 CONSTRAINT DF_Orders_Id DEFAULT NEWID()\n                 CONSTRAINT PK_Orders PRIMARY KEY,   -- clustered!\n    CustomerId int NOT NULL,\n    OrderDate  datetime2(0) NOT NULL\n);",
          good: "CREATE TABLE dbo.Orders (\n    OrderId    bigint IDENTITY(1,1) NOT NULL,\n    PublicId   uniqueidentifier NOT NULL\n                 CONSTRAINT DF_Orders_PublicId DEFAULT NEWID(),\n    CustomerId int NOT NULL,\n    OrderDate  datetime2(0) NOT NULL,\n    CONSTRAINT PK_Orders PRIMARY KEY NONCLUSTERED (PublicId)\n);\nCREATE UNIQUE CLUSTERED INDEX CX_Orders ON dbo.Orders (OrderId);",
          why: {
            en: "PRIMARY KEY is clustered by default, so this stores 20 million rows in random GUID order. New rows land in the middle of full pages and split them, which fragments the index and slows inserts; and the 16-byte key is copied into every non-clustered index. The fix keeps a GUID for URLs and external systems but clusters on an increasing bigint, so inserts append at the end and the copied pointer is 8 bytes instead of 16.",
            ar: "الـ PRIMARY KEY يكون clustered افتراضياً، فهذا يخزّن 20 مليون صف بترتيب GUID عشوائي. تهبط الصفوف الجديدة وسط صفحات ممتلئة فتقسمها، ما يسبب fragmentation ويبطئ الإدراج؛ كما يُنسخ المفتاح ذو الـ 16 بايت داخل كل non-clustered index. الحل يُبقي الـ GUID للروابط والأنظمة الخارجية لكنه يعمل clustering على bigint متزايد، فتُلحَق عمليات الإدراج في النهاية ويصبح المؤشر المنسوخ 8 بايت بدل 16." } },
        { t: "review", severity: "medium",
          title: { en: "Duplicate index that a wider one already covers", ar: "index مكرر يغطيه index أوسع موجود" },
          bad: "-- already exists:\n-- IX_Orders_Customer_Date ON Orders (CustomerId, OrderDate DESC) INCLUDE (Total)\n\n-- added in this pull request:\nCREATE NONCLUSTERED INDEX IX_Orders_Customer\n    ON dbo.Orders (CustomerId);",
          good: "-- nothing new is needed: a seek on CustomerId alone already\n-- uses IX_Orders_Customer_Date, because CustomerId is its\n-- leading key column.\n\n-- if Status is also filtered, extend the existing index instead:\nCREATE NONCLUSTERED INDEX IX_Orders_Customer_Date\n    ON dbo.Orders (CustomerId, OrderDate DESC)\n    INCLUDE (Total, Status)\n    WITH (DROP_EXISTING = ON);",
          why: {
            en: "An index can be used by any query that filters on a prefix of its key columns, so (CustomerId, OrderDate) already serves queries that filter on CustomerId alone. The new index adds nothing readers can use, but every insert, update and delete now maintains one more structure. When you need an extra column, widen the existing index rather than creating a second one that overlaps it.",
            ar: "يمكن استخدام الـ index في أي استعلام يفلتر على بادئة من أعمدة مفتاحه، فالـ index على (CustomerId, OrderDate) يخدم أصلاً الاستعلامات التي تفلتر على CustomerId وحده. الـ index الجديد لا يضيف شيئاً للقراءة، لكن كل insert وupdate وdelete صار يصون بنية إضافية. وعندما تحتاج عموداً إضافياً، وسّع الـ index الموجود بدل إنشاء ثانٍ يتداخل معه." } }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        { t: "p",
          en: "Index choice is a system design decision, not a database detail, because it fixes which access patterns are cheap. In our e-commerce example, clustering Orders on (CustomerId, OrderId) instead of OrderId alone puts each customer's orders physically together — the \"my orders\" page becomes a single seek plus a short walk, and it stays that fast at 200 million rows. But the same choice makes the operations dashboard's \"all orders in the last hour\" query scan, because recent orders are now scattered across every customer. You cannot have both from one physical order; you choose which query is the one that must never be slow.",
          ar: "اختيار الـ index قرار تصميم نظام لا تفصيلة قاعدة بيانات، لأنه يحدد أي أنماط الوصول ستكون رخيصة. في مثالنا، عمل clustering لجدول Orders على (CustomerId, OrderId) بدل OrderId وحده يضع طلبات كل عميل متجاورة فيزيائياً، فتصبح صفحة «طلباتي» seek واحداً ومشياً قصيراً، وتبقى بهذه السرعة عند 200 مليون صف. لكن الاختيار نفسه يجعل استعلام لوحة التشغيل «كل الطلبات في آخر ساعة» يعمل scan، لأن الطلبات الحديثة صارت مبعثرة عبر كل العملاء. لا يمكن الحصول على الاثنين من ترتيب فيزيائي واحد، فتختار أي استعلام يجب ألا يبطؤ أبداً." },
        { t: "ul",
          en: [
            "Multi-tenant systems usually cluster every large table on (TenantId, Id): each tenant's data sits together, so one tenant's big scan reads its own pages and evicts less of everyone else's data from memory.",
            "Time-series and log tables cluster on (Timestamp, Id) because nearly every query is a time range and the writes naturally arrive in increasing order — the ideal insert pattern.",
            "Reporting workloads often keep the row-based clustered index for the application and add a non-clustered columnstore index for analytics, so scans of millions of rows do not fight the transactional path.",
            "Read replicas let you add indexes that only reporting needs, keeping the write-heavy primary's index count low — the cost is replication lag between what a report sees and what the primary has."
          ],
          ar: [
            "الأنظمة متعددة المستأجرين تعمل clustering لكل جدول كبير على (TenantId, Id): بيانات كل مستأجر متجاورة، فمسح مستأجر واحد يقرأ صفحاته هو ويطرد قدراً أقل من بيانات الآخرين من الذاكرة.",
            "جداول السلاسل الزمنية والسجلات تعمل clustering على (Timestamp, Id) لأن معظم الاستعلامات نطاق زمني، ولأن الكتابات تصل طبيعياً بترتيب تصاعدي، وهو نمط الإدراج المثالي.",
            "أحمال التقارير غالباً تُبقي الـ clustered index الصفّي للتطبيق وتضيف non-clustered columnstore index للتحليلات، حتى لا يتنازع مسح ملايين الصفوف مع المسار المعاملاتي.",
            "الـ read replicas تتيح إضافة indexes تحتاجها التقارير فقط، مع إبقاء عدد الـ indexes منخفضاً على الـ primary كثيف الكتابة — والتكلفة هي تأخر النسخ بين ما يراه التقرير وما لدى الـ primary."
          ] },
        { t: "callout", kind: "warn",
          en: "Changing a clustered index on a large table rebuilds the table and every non-clustered index on it. On 20 million rows that is minutes of blocking and roughly 1.5× the table size in extra space and transaction log. Plan it as a migration with a maintenance window, or use ONLINE = ON on an edition that supports it.",
          ar: "تغيير الـ clustered index على جدول كبير يعيد بناء الجدول وكل الـ non-clustered indexes عليه. على 20 مليون صف يعني ذلك دقائق من الحجب، ونحو 1.5 ضعف حجم الجدول من المساحة الإضافية والـ transaction log. خطّط له كـ migration بنافذة صيانة، أو استخدم ONLINE = ON في الإصدارات التي تدعمه." }
      ]
    },
    {
      key: "perf",
      blocks: [
        { t: "kv", rows: [
          { k: { en: "Memory", ar: "الذاكرة" },
            v: { en: "Index pages compete with data pages for the buffer pool — SQL Server's in-memory page cache. A 420 MB index that serves a hot query pays for itself; an unused one just evicts pages you needed.", ar: "صفحات الـ index تتنافس مع صفحات البيانات على الـ buffer pool، وهو ذاكرة SQL Server المؤقتة للصفحات. index بحجم 420 MB يخدم استعلاماً نشطاً يستحق تكلفته، وآخر غير مستخدم يطرد صفحات كنت تحتاجها." } },
          { k: { en: "Database reads", ar: "قراءات قاعدة البيانات" },
            v: { en: "The number that matters. Our query went from 1,010,000 logical reads to 6. Measure with SET STATISTICS IO ON, not with a stopwatch — time varies with cache warmth, reads do not.", ar: "الرقم المهم. انخفض استعلامنا من 1,010,000 logical reads إلى 6. قسه بـ SET STATISTICS IO ON لا بساعة إيقاف، لأن الزمن يتغير بحرارة الـ cache والقراءات لا تتغير." } },
          { k: { en: "Write cost", ar: "تكلفة الكتابة" },
            v: { en: "Each index adds one structure to maintain per row changed. In the example, going from 1 to 9 indexes turned a 6-minute nightly import into 41 minutes.", ar: "كل index يضيف بنية تُصان لكل صف يتغير. في المثال، الانتقال من index واحد إلى تسعة حوّل استيراداً ليلياً مدته 6 دقائق إلى 41 دقيقة." } },
          { k: { en: "Latency", ar: "زمن الاستجابة" },
            v: { en: "A seek's cost stays flat as the table grows because tree depth grows logarithmically; a scan's cost grows linearly. That is why scans quietly get worse over months while seeks do not.", ar: "تكلفة الـ seek تبقى ثابتة تقريباً مع نمو الجدول لأن عمق الشجرة ينمو لوغاريتمياً، بينما تنمو تكلفة الـ scan خطياً. لهذا تسوء عمليات الـ scan بهدوء عبر الأشهر بينما لا تسوء عمليات الـ seek." } },
          { k: { en: "Scalability", ar: "قابلية التوسّع" },
            v: { en: "Scans hold shared locks over many pages and lengthen blocking chains under load. Replacing one scan with a seek often removes a concurrency problem, not just a slow query.", ar: "عمليات الـ scan تحتفظ بأقفال مشتركة على صفحات كثيرة وتطيل سلاسل الحجب تحت الحمل. استبدال scan واحد بـ seek يزيل غالباً مشكلة تزامن، لا مجرد استعلام بطيء." } }
        ]}
      ]
    },
    {
      key: "debug",
      blocks: [
        { t: "ul",
          en: [
            "SET STATISTICS IO, TIME ON before the query: read the \"logical reads\" number per table. A number far larger than the rows returned means the engine is reading pages it throws away.",
            "The actual execution plan (Ctrl+M in SSMS): look for the operator names — Index Seek is good, Clustered Index Scan on a filtered query is the smell, Key Lookup with a high row count is the next thing to fix.",
            "Hover any plan operator and compare \"Estimated Number of Rows\" with \"Actual Number of Rows\". A gap of 10× or more means statistics are stale; run UPDATE STATISTICS before blaming the index.",
            "sys.dm_db_index_usage_stats: shows seeks, scans and updates per index since the last restart. Indexes with many updates and zero seeks are pure write cost and are candidates to drop.",
            "sys.dm_db_index_physical_stats: reports avg_fragmentation_in_percent and page fullness. Above ~30% fragmentation on a large index, rebuild it and then ask what insert pattern caused it."
          ],
          ar: [
            "شغّل SET STATISTICS IO, TIME ON قبل الاستعلام واقرأ رقم «logical reads» لكل جدول. رقم أكبر بكثير من عدد الصفوف المُعادة يعني أن المحرك يقرأ صفحات يرميها.",
            "خطة التنفيذ الفعلية (Ctrl+M في SSMS): انظر إلى أسماء العمليات — Index Seek جيد، وClustered Index Scan في استعلام مفلتر هو المؤشر السيئ، وKey Lookup مع عدد صفوف كبير هو ما تصلحه تالياً.",
            "مرّر المؤشر على أي operator في الخطة وقارن «Estimated Number of Rows» بـ «Actual Number of Rows». فجوة بمقدار 10 أضعاف أو أكثر تعني statistics قديمة، فشغّل UPDATE STATISTICS قبل أن تلوم الـ index.",
            "sys.dm_db_index_usage_stats: يعرض عمليات الـ seek والـ scan والتحديث لكل index منذ آخر إعادة تشغيل. الـ indexes ذات التحديثات الكثيرة وصفر seeks تكلفة كتابة صافية ومرشحة للحذف.",
            "sys.dm_db_index_physical_stats: يعرض avg_fragmentation_in_percent ومدى امتلاء الصفحات. فوق نحو 30% fragmentation على index كبير، أعد بناءه ثم اسأل أي نمط إدراج تسبب فيه."
          ] },
        { t: "callout", kind: "tip",
          en: "Do not blindly create the index the plan's green \"missing index\" hint suggests. It is generated from one query in isolation, it always puts the columns in an order it did not think about, and it often duplicates an index you already have. Read it as a hint about which columns matter, then decide whether to widen an existing index instead.",
          ar: "لا تنشئ بشكل أعمى الـ index الذي يقترحه تلميح «missing index» الأخضر في الخطة. فهو مولَّد من استعلام واحد بمعزل عن غيره، ويضع الأعمدة دائماً بترتيب لم يفكر فيه، وغالباً يكرر index تملكه أصلاً. اقرأه كإشارة إلى الأعمدة المهمة، ثم قرر ما إذا كان الأفضل توسيع index موجود." }
      ]
    },
    {
      key: "realworld",
      blocks: [
        { t: "p",
          en: "The pattern repeats across industries: a table grows past the point where a scan is affordable, and the fix is choosing which order the rows live in. Teams usually meet it the same way — a page that was fine at 2 million rows starts timing out at 40 million, and the plan shows the same clustered index scan that was always there but used to be cheap.",
          ar: "يتكرر النمط عبر القطاعات: يكبر الجدول حتى يتجاوز النقطة التي يكون فيها الـ scan محتملاً، ويكون الحل هو اختيار الترتيب الذي تعيش به الصفوف. وعادة يصطدم الفريق بالأمر بنفس الطريقة: صفحة كانت سليمة عند مليوني صف تبدأ بانتهاء المهلة عند 40 مليوناً، وتُظهر الخطة نفس الـ clustered index scan الذي كان موجوداً دائماً لكنه كان رخيصاً." },
        { t: "ul",
          en: [
            "Payment systems cluster the ledger on (AccountId, PostedAt) so a statement for one account is one contiguous range read, no matter how many accounts the system holds.",
            "Chat platforms cluster messages on (ConversationId, MessageId): loading the last 50 messages of a room reads a handful of adjacent pages instead of searching a global message table.",
            "IoT and metrics pipelines cluster on (DeviceId, Timestamp) and partition by month, so old data can be dropped by removing a partition instead of running a DELETE over billions of rows.",
            "Multi-tenant SaaS products cluster on (TenantId, Id), which also limits blast radius: a heavy query from one customer reads mostly its own pages rather than pushing every other tenant's data out of cache."
          ],
          ar: [
            "أنظمة المدفوعات تعمل clustering لدفتر الحسابات على (AccountId, PostedAt)، فيصبح كشف حساب واحد قراءة نطاق متصل واحد مهما بلغ عدد الحسابات في النظام.",
            "منصات المحادثة تعمل clustering للرسائل على (ConversationId, MessageId): تحميل آخر 50 رسالة في غرفة يقرأ عدداً قليلاً من الصفحات المتجاورة بدل البحث في جدول رسائل عام.",
            "خطوط بيانات IoT والمقاييس تعمل clustering على (DeviceId, Timestamp) مع partition شهري، فيمكن التخلص من البيانات القديمة بحذف partition بدل تشغيل DELETE على مليارات الصفوف.",
            "منتجات SaaS متعددة المستأجرين تعمل clustering على (TenantId, Id)، وهذا يحدّ أيضاً من نطاق الضرر: استعلام ثقيل من عميل واحد يقرأ صفحاته هو غالباً بدل دفع بيانات بقية المستأجرين خارج الـ cache."
          ] }
      ]
    },
    {
      key: "exercises",
      blocks: [
        { t: "ex", diff: "easy",
          en: "Create a table with 1 million rows and an int IDENTITY clustered primary key. Run a query filtering on a non-indexed column with SET STATISTICS IO ON and write down the logical reads. Add a non-clustered index on that column and run it again. You are done when you can state both read counts and explain, in one sentence, why the second one does not grow if you double the table size.",
          ar: "أنشئ جدولاً بمليون صف مع clustered primary key من نوع int IDENTITY. شغّل استعلاماً يفلتر على عمود غير مفهرس مع SET STATISTICS IO ON ودوّن عدد الـ logical reads. ثم أضف non-clustered index على ذلك العمود وأعد التشغيل. تكون قد أنجزت عندما تستطيع ذكر الرقمين وتفسير سبب عدم نمو الرقم الثاني إذا ضاعفت حجم الجدول، في جملة واحدة." },
        { t: "ex", diff: "medium",
          en: "Reproduce a key lookup and then remove it. Index only the filter column, run a query that also selects a column not in the index, and confirm the plan shows Index Seek plus Key Lookup. Then rebuild the index with INCLUDE for the missing column. You are done when the Key Lookup operator is gone and you can quote the before and after logical reads.",
          ar: "أعد إنتاج key lookup ثم أزلها. افهرس عمود الفلترة فقط، وشغّل استعلاماً يختار أيضاً عموداً غير موجود في الـ index، وتأكد أن الخطة تُظهر Index Seek مع Key Lookup. ثم أعد بناء الـ index بـ INCLUDE للعمود الناقص. تكون قد أنجزت عندما تختفي عملية Key Lookup وتستطيع ذكر الـ logical reads قبل وبعد." },
        { t: "ex", diff: "hard",
          en: "Find the tipping point yourself. Keep one non-clustered index and one covering-free query, and run it selecting 10, 100, 1,000, 10,000 and 100,000 rows from a 5-million-row table. Record the plan operator each time. You are done when you can name the row count at which the optimizer switched from Index Seek with Key Lookup to Clustered Index Scan, and express it as a percentage of the table.",
          ar: "اعثر على نقطة الانقلاب بنفسك. أبقِ non-clustered index واحداً واستعلاماً غير مغطّى، وشغّله ليعيد 10 ثم 100 ثم 1,000 ثم 10,000 ثم 100,000 صف من جدول فيه 5 ملايين صف. سجّل الـ operator في الخطة كل مرة. تكون قد أنجزت عندما تحدد عدد الصفوف الذي انتقل عنده الـ optimizer من Index Seek مع Key Lookup إلى Clustered Index Scan، وتعبّر عنه كنسبة مئوية من الجدول." },
        { t: "ex", diff: "senior",
          en: "Build the two-table case. Create Orders clustered on OrderId and a copy clustered on (CustomerId, OrderId), each with 5 million rows and identical data. Run three workloads on both: the per-customer page query, a last-hour operations query, and a 100,000-row insert. You are done when you can produce a short table of reads and duration for all six runs, and write two sentences saying which clustered key you would ship and what you are giving up.",
          ar: "ابنِ حالة الجدولين. أنشئ Orders بـ clustering على OrderId، ونسخة بـ clustering على (CustomerId, OrderId)، كلٌّ بخمسة ملايين صف وببيانات متطابقة. شغّل ثلاثة أحمال على الاثنين: استعلام صفحة العميل، واستعلام تشغيل لآخر ساعة، وإدراج 100,000 صف. تكون قد أنجزت عندما تنتج جدولاً قصيراً بالقراءات والمدة للتشغيلات الستة، وتكتب جملتين تحددان أي clustered key ستعتمده وما الذي تتنازل عنه." }
      ]
    },
    {
      key: "refs",
      blocks: [
        { t: "ref",
          label: { en: "SQL Server index architecture and design guide", ar: "دليل بنية وتصميم الـ indexes في SQL Server" },
          url: "https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-index-design-guide",
          meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref",
          label: { en: "Clustered and non-clustered indexes described", ar: "شرح الـ clustered والـ non-clustered indexes" },
          url: "https://learn.microsoft.com/en-us/sql/relational-databases/indexes/clustered-and-nonclustered-indexes-described",
          meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref",
          label: { en: "Use The Index, Luke — anatomy of an index", ar: "Use The Index, Luke — تشريح الـ index" },
          url: "https://use-the-index-luke.com/sql/anatomy",
          meta: { en: "Guide", ar: "دليل" } },
        { t: "ref",
          label: { en: "Brent Ozar — How to think like the SQL Server engine", ar: "Brent Ozar — كيف تفكر مثل محرك SQL Server" },
          url: "https://www.brentozar.com/archive/2018/02/how-to-think-like-the-sql-server-engine/",
          meta: { en: "Article", ar: "مقال" } }
      ]
    }
  ],
  quiz: [
    {
      q: { en: "How many clustered indexes can a single table have, and why?", ar: "كم clustered index يمكن أن يوجد على جدول واحد، ولماذا؟" },
      options: [
        { en: "One, because the clustered index defines the physical order the rows are stored in", ar: "واحد، لأن الـ clustered index يحدد الترتيب الفيزيائي لتخزين الصفوف" },
        { en: "One per filegroup, because each filegroup stores its own copy", ar: "واحد لكل filegroup، لأن كل filegroup يخزّن نسخته الخاصة" },
        { en: "Up to 999, the same as non-clustered indexes", ar: "حتى 999، مثل الـ non-clustered indexes" },
        { en: "Unlimited, but only one can be used per query", ar: "بلا حد، لكن يمكن استخدام واحد فقط في كل استعلام" }
      ],
      correct: 0,
      why: { en: "The clustered index's leaf level is the table data itself, stored in key order. Rows can only be stored in one order, so there can only be one clustered index.", ar: "المستوى الأسفل للـ clustered index هو بيانات الجدول نفسها مخزّنة بترتيب المفتاح. والصفوف تُخزَّن بترتيب واحد فقط، لذلك لا يمكن وجود أكثر من clustered index واحد." }
    },
    {
      q: { en: "What does the leaf level of a non-clustered index contain in SQL Server?", ar: "ماذا يحتوي المستوى الأسفل للـ non-clustered index في SQL Server؟" },
      options: [
        { en: "The full rows, duplicated from the table", ar: "الصفوف الكاملة، منسوخة من الجدول" },
        { en: "The key columns, any INCLUDE columns, and the clustered key as a pointer", ar: "أعمدة المفتاح وأي أعمدة INCLUDE والـ clustered key كمؤشر" },
        { en: "Only the key columns, with no way back to the row", ar: "أعمدة المفتاح فقط، بلا طريقة للعودة إلى الصف" },
        { en: "A compressed copy of the whole table", ar: "نسخة مضغوطة من الجدول كله" }
      ],
      correct: 1,
      why: { en: "It stores only the indexed columns plus INCLUDE columns, and uses the clustered key (or a RID on a heap) to find the full row when more columns are needed.", ar: "يخزّن الأعمدة المفهرسة فقط مع أعمدة INCLUDE، ويستخدم الـ clustered key (أو RID في الـ heap) للوصول إلى الصف الكامل عند الحاجة إلى أعمدة إضافية." }
    },
    {
      q: { en: "Why does clustering on a random GUID slow down inserts?", ar: "لماذا يبطئ الـ clustering على GUID عشوائي عمليات الإدراج؟" },
      options: [
        { en: "GUIDs cannot be compared, so the engine falls back to a scan", ar: "لا يمكن مقارنة الـ GUIDs، فيلجأ المحرك إلى الـ scan" },
        { en: "The engine must rebuild statistics after every insert", ar: "يجب على المحرك إعادة بناء الـ statistics بعد كل إدراج" },
        { en: "New rows land in random positions inside already-full pages, forcing page splits", ar: "تهبط الصفوف الجديدة في مواضع عشوائية داخل صفحات ممتلئة، ما يفرض page splits" },
        { en: "GUID keys disable the buffer pool for that table", ar: "مفاتيح الـ GUID تعطّل الـ buffer pool لذلك الجدول" }
      ],
      correct: 2,
      why: { en: "Random keys mean inserts hit the middle of the index. When the target page is full, SQL Server splits it — extra writes, fragmentation, and half-empty pages.", ar: "المفاتيح العشوائية تجعل الإدراج يصيب وسط الـ index. وعندما تكون الصفحة الهدف ممتلئة يقسمها SQL Server، فتنتج كتابات إضافية وfragmentation وصفحات نصف فارغة." }
    },
    {
      q: { en: "A query filters on CustomerId and OrderDate. Which index lets it seek?", ar: "استعلام يفلتر على CustomerId وOrderDate. أي index يتيح له عمل seek؟" },
      options: [
        { en: "(OrderDate, CustomerId)", ar: "(OrderDate, CustomerId)" },
        { en: "(CustomerId, OrderDate)", ar: "(CustomerId, OrderDate)" },
        { en: "Two separate single-column indexes on each", ar: "index منفصل بعمود واحد لكل منهما" },
        { en: "Any of them — column order does not affect seeks", ar: "أي منها — ترتيب الأعمدة لا يؤثر على الـ seek" }
      ],
      correct: 1,
      why: { en: "An index is sorted by its first key column first. Putting the equality column (CustomerId) first groups that customer's rows together; the range column (OrderDate) then narrows within that group.", ar: "الـ index مرتّب حسب عمود مفتاحه الأول أولاً. وضع عمود المساواة (CustomerId) أولاً يجمّع صفوف ذلك العميل معاً، ثم يضيّق عمود النطاق (OrderDate) داخل تلك المجموعة." }
    },
    {
      q: { en: "The plan shows an Index Seek followed by a Key Lookup returning 60,000 rows. What is the usual fix?", ar: "تُظهر الخطة Index Seek يتبعه Key Lookup يعيد 60,000 صف. ما الحل المعتاد؟" },
      options: [
        { en: "Add the columns the query selects to the index with INCLUDE", ar: "أضف الأعمدة التي يختارها الاستعلام إلى الـ index عبر INCLUDE" },
        { en: "Drop the non-clustered index so the engine scans instead", ar: "احذف الـ non-clustered index ليعمل المحرك scan بدلاً منه" },
        { en: "Add a second non-clustered index on the selected columns", ar: "أضف non-clustered index ثانياً على الأعمدة المختارة" },
        { en: "Rebuild the clustered index to remove fragmentation", ar: "أعد بناء الـ clustered index لإزالة الـ fragmentation" }
      ],
      correct: 0,
      why: { en: "The lookup exists because the index lacks a column the query needs. INCLUDE stores that column at the leaf, making the index cover the query so no trip back to the table is needed.", ar: "الـ lookup موجودة لأن الـ index ينقصه عمود يحتاجه الاستعلام. وINCLUDE يخزّن ذلك العمود في الـ leaf فيصبح الـ index مغطياً للاستعلام ولا يحتاج للعودة إلى الجدول." }
    }
  ]
};
```

NEXT: covering
