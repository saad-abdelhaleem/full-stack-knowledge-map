```js
const isolationLevelsLesson = {
  id: "isolation-levels",
  moduleId: "sql",
  title: { en: "Isolation levels", ar: "مستويات العزل" },
  summary: {
    en: "How much one transaction is allowed to see of another transaction's unfinished work — and what you pay in blocking to see less.",
    ar: "كم يُسمح لـ transaction أن يرى من عمل transaction آخر لم ينتهِ بعد — وما الذي تدفعه من blocking لترى أقل."
  },
  mins: 18,
  sections: [
    { key: "why", blocks: [
      { t: "p",
        en: "A database usually runs many transactions at the same time. An isolation level is the rule that decides how much of another transaction's half-finished work your transaction is allowed to see. Pick a strict level and you see a cleaner picture but wait more; pick a loose level and you wait less but can read data that is wrong or about to change.",
        ar: "قاعدة البيانات تنفّذ عادة عدة transactions في نفس الوقت. مستوى العزل (isolation level) هو القاعدة التي تحدد كم يُسمح لك أن ترى من عمل transaction آخر لم ينتهِ. المستوى الصارم يعطيك صورة أنظف لكنك تنتظر أكثر؛ والمستوى المتساهل ينتظر أقل لكنه قد يقرأ بيانات خاطئة أو على وشك التغيّر." },

      { t: "kv", rows: [
        { k: { en: "Transaction", ar: "Transaction" },
          v: { en: "A group of reads and writes that the database treats as one unit: all of it commits, or all of it is rolled back.", ar: "مجموعة من عمليات القراءة والكتابة تعاملها قاعدة البيانات كوحدة واحدة: إما تُثبَّت كلها (commit) أو تُلغى كلها (rollback)." } },
        { k: { en: "Commit / rollback", ar: "Commit / rollback" },
          v: { en: "Commit makes the transaction's changes permanent and visible. Rollback throws them away as if they never happened.", ar: "الـ commit يجعل تغييرات الـ transaction دائمة ومرئية. والـ rollback يرميها كأنها لم تحدث." } },
        { k: { en: "Lock", ar: "Lock" },
          v: { en: "A marker the database puts on a row or a page so another transaction that wants a conflicting access has to wait.", ar: "علامة تضعها قاعدة البيانات على row أو page، فيضطر أي transaction آخر يريد وصولاً متعارضاً إلى الانتظار." } },
        { k: { en: "Blocking", ar: "Blocking" },
          v: { en: "One transaction waiting on a lock another transaction holds. It is normal and short-lived; it becomes a problem when it is long.", ar: "انتظار transaction لـ lock يحمله transaction آخر. هذا طبيعي وقصير عادةً، ويصبح مشكلة عندما يطول." } },
        { k: { en: "Read anomaly", ar: "Read anomaly" },
          v: { en: "A specific wrong result a read can return because of concurrency: dirty read, non-repeatable read, or phantom read.", ar: "نتيجة خاطئة محددة قد ترجعها القراءة بسبب التزامن: dirty read أو non-repeatable read أو phantom read." } },
        { k: { en: "Row version", ar: "Row version" },
          v: { en: "A saved copy of a row as it looked before the current change, so readers can see the old value instead of waiting.", ar: "نسخة محفوظة من الـ row كما كان قبل التغيير الحالي، حتى يرى القارئ القيمة القديمة بدل الانتظار." } }
      ]},

      { t: "p",
        en: "The running example for this lesson is a seat-booking API for a concert. One table, Seats, with columns SeatId, EventId and BookedBy. Two things run against it constantly: a booking request that checks a seat is free and then marks it taken, and an availability request that counts the free seats for the event. On a popular event both run hundreds of times a second, at the same time, on overlapping rows.",
        ar: "المثال الذي سنستخدمه طوال الدرس هو API لحجز مقاعد حفلة. جدول واحد اسمه Seats بأعمدة SeatId و EventId و BookedBy. شيئان ينفَّذان عليه باستمرار: طلب حجز يتحقق أن المقعد شاغر ثم يعلّمه محجوزاً، وطلب توفّر يحسب عدد المقاعد الشاغرة للحفلة. في حفلة مطلوبة يعملان مئات المرات في الثانية، في نفس الوقت، على rows متداخلة." },

      { t: "p",
        en: "Think of a shared whiteboard in a meeting room. Someone is halfway through rewriting the schedule: half the old times are erased, the new ones are not written yet. Isolation level is the rule about who may look at the board during that. \"Read the board any time\" is fast but you may copy a half-erased schedule. \"Nobody looks until the pen is down\" is correct but everyone stands and waits. \"Keep a photo of the board from before the edit and read that\" is the third option — nobody waits, and everyone reads a consistent, slightly older schedule. Those three rules map to READ UNCOMMITTED, SERIALIZABLE, and snapshot-based isolation, which the rest of the lesson explains one by one.",
        ar: "تخيّل whiteboard مشترك في غرفة اجتماعات. شخص في منتصف إعادة كتابة الجدول: نصف الأوقات القديمة مُسحت والجديدة لم تُكتب بعد. مستوى العزل هو القاعدة التي تحدد من يحق له النظر إلى اللوح في تلك اللحظة. «انظر متى شئت» سريع لكنك قد تنسخ جدولاً نصف ممسوح. «لا أحد ينظر حتى يُرفع القلم» صحيح لكن الجميع يقف وينتظر. «احتفظ بصورة للّوح قبل التعديل واقرأ منها» هو الخيار الثالث: لا أحد ينتظر، والجميع يقرأ جدولاً متسقاً لكنه أقدم قليلاً. هذه القواعد الثلاث تقابل READ UNCOMMITTED و SERIALIZABLE والعزل المبني على snapshot، وهو ما يشرحه باقي الدرس واحداً واحداً." },

      { t: "callout", kind: "note",
        en: "SQL Server's default for a plain connection is READ COMMITTED using locks. Entity Framework Core does not change that: if you never write BeginTransaction, every SaveChanges is its own READ COMMITTED transaction. So you are already using an isolation level today, whether or not you chose it.",
        ar: "الوضع الافتراضي في SQL Server لأي connection عادي هو READ COMMITTED باستخدام locks. و Entity Framework Core لا يغيّر ذلك: إن لم تكتب BeginTransaction أبداً، فكل SaveChanges هو transaction مستقل بمستوى READ COMMITTED. أي أنك تستخدم مستوى عزل اليوم بالفعل، اخترته أو لم تخترْه." }
    ]},
    { key: "problem", blocks: [
      { t: "p",
        en: "The booking endpoint originally ran two statements in one transaction: a SELECT to check the seat is free, then an UPDATE to set BookedBy. At the default level, READ COMMITTED with locks, the SELECT releases its lock the moment it finishes reading. It does not hold it until the transaction ends. So two requests for seat 12 can both read \"free\" a millisecond apart, and both then run the UPDATE. One overwrites the other. In one hour of load testing at 200 bookings per second, 41 seats came out double-booked — about 1 in every 17,000 bookings. Rare enough to pass code review, frequent enough to be a support ticket every day.",
        ar: "endpoint الحجز كان ينفّذ جملتين داخل transaction واحد: SELECT للتحقق أن المقعد شاغر، ثم UPDATE لتعيين BookedBy. في المستوى الافتراضي، READ COMMITTED بالـ locks، يحرّر الـ SELECT قفله فور انتهائه من القراءة ولا يحتفظ به حتى نهاية الـ transaction. لذلك يمكن لطلبين على المقعد 12 أن يقرآ «شاغر» بفارق ميلي ثانية، ثم ينفّذ كلاهما الـ UPDATE، فيكتب أحدهما فوق الآخر. في ساعة اختبار حِمل بمعدل 200 حجز في الثانية خرج 41 مقعداً محجوزاً مرتين — أي واحد من كل 17,000 حجز تقريباً. نادر بما يكفي ليمرّ من مراجعة الكود، ومتكرر بما يكفي ليصبح تذكرة دعم يومية." },

      { t: "p",
        en: "The availability endpoint had the mirror-image problem. It ran two counts in one transaction — total seats, then booked seats — and returned the difference. Between the two counts, other bookings committed. The page showed 40 free out of 500 while the real number was 37. Worse, the count query took a shared lock on every row it scanned, so during peak the booking UPDATEs queued behind it. Average booking latency was 120 ms, but p99 was 8 s — meaning the slowest 1 in 100 bookings took 8 seconds, almost all of it spent waiting for the counting query to let go.",
        ar: "endpoint التوفّر كان يعاني من المشكلة المعاكسة. كان ينفّذ عدّتين داخل transaction واحد — إجمالي المقاعد ثم المقاعد المحجوزة — ويرجع الفرق. وبين العدّتين تُثبَّت حجوزات أخرى، فتعرض الصفحة 40 مقعداً شاغراً من 500 بينما الرقم الحقيقي 37. والأسوأ أن استعلام العدّ كان يأخذ shared lock على كل row يمرّ عليه، فتصطف UPDATE الحجوزات خلفه وقت الذروة. متوسط زمن الحجز كان 120 ms لكن p99 كان 8 s — أي أن أبطأ حجز من كل 100 استغرق 8 ثوانٍ، معظمها انتظار حتى يفرج استعلام العدّ عن أقفاله." },

      { t: "kv", rows: [
        { k: { en: "Dirty read", ar: "Dirty read" },
          v: { en: "You read a value another transaction wrote but has not committed. If it rolls back, you acted on a number that never existed.", ar: "تقرأ قيمة كتبها transaction آخر ولم يُثبّتها بعد. فإن عمل rollback تكون قد تصرّفت بناءً على رقم لم يوجد أصلاً." } },
        { k: { en: "Non-repeatable read", ar: "Non-repeatable read" },
          v: { en: "You read the same row twice in one transaction and get two different values, because someone updated it in between.", ar: "تقرأ نفس الـ row مرتين داخل transaction واحد فتحصل على قيمتين مختلفتين، لأن أحدهم عدّله بينهما." } },
        { k: { en: "Phantom read", ar: "Phantom read" },
          v: { en: "You run the same WHERE twice and get a different number of rows, because someone inserted or deleted rows that match it.", ar: "تنفّذ نفس شرط الـ WHERE مرتين فتحصل على عدد rows مختلف، لأن أحدهم أدخل أو حذف rows تطابقه." } },
        { k: { en: "Lost update", ar: "Lost update" },
          v: { en: "Two transactions read the same value, both compute a new one from it, and the second write silently erases the first. This is the double-booking above.", ar: "transactionان يقرآن نفس القيمة، ويحسب كل منهما قيمة جديدة منها، فتمحو الكتابة الثانية الأولى بصمت. وهذا هو الحجز المزدوج أعلاه." } }
      ]},

      { t: "p",
        en: "These four names are the whole vocabulary. Every isolation level is just a statement of which of them it prevents and which it allows. Nothing more mysterious than that.",
        ar: "هذه الأسماء الأربعة هي كل المفردات المطلوبة. كل مستوى عزل ليس إلا إعلاناً عن أي منها يمنع وأيها يسمح به. لا شيء أغمض من ذلك." }
    ]},
    { key: "internals", blocks: [
      { t: "p",
        en: "SQL Server has two completely different machines for isolation, and knowing which one is running explains almost every surprise. The first is locking: readers and writers take locks and wait for each other. The second is row versioning: writers keep the old copy of each row they change, and readers read that old copy without waiting at all. Four of the levels use locks. Two use versions. The level you pick is really a choice of machine plus a choice of how long locks are held.",
        ar: "لدى SQL Server آليتان مختلفتان تماماً للعزل، ومعرفة أيهما تعمل يفسّر تقريباً كل مفاجأة. الأولى هي الـ locking: القارئون والكاتبون يأخذون locks وينتظر بعضهم بعضاً. والثانية هي row versioning: الكاتب يحتفظ بالنسخة القديمة من كل row يغيّره، فيقرأ القارئ تلك النسخة القديمة دون أي انتظار. أربعة مستويات تستخدم الـ locks، ومستويان يستخدمان النسخ. اختيارك لمستوى العزل هو في الحقيقة اختيار للآلية، بالإضافة إلى اختيار مدة الاحتفاظ بالـ locks." },

      { t: "kv", rows: [
        { k: { en: "Shared lock (S)", ar: "Shared lock (S)" },
          v: { en: "Taken by a reader. Many readers can hold it on the same row together. A writer cannot take its lock while any S lock is there.", ar: "يأخذه القارئ. يمكن لعدة قرّاء حمله على نفس الـ row معاً، ولا يستطيع الكاتب أخذ قفله ما دام هناك S lock." } },
        { k: { en: "Exclusive lock (X)", ar: "Exclusive lock (X)" },
          v: { en: "Taken by a writer on any row it changes. Only one at a time, and it is always held until commit or rollback — at every isolation level.", ar: "يأخذه الكاتب على كل row يغيّره. واحد فقط في المرة، ويُحتفظ به دائماً حتى الـ commit أو الـ rollback — في كل مستويات العزل." } },
        { k: { en: "Range lock", ar: "Range lock" },
          v: { en: "A lock on the gap between index keys, not just on existing rows. It blocks inserts that would fall in that gap. Only SERIALIZABLE takes these.", ar: "قفل على الفراغ بين مفاتيح الـ index وليس على الـ rows الموجودة فقط. يمنع أي insert يقع داخل ذلك الفراغ. و SERIALIZABLE وحده يأخذه." } },
        { k: { en: "Version store", ar: "Version store" },
          v: { en: "An area where SQL Server keeps the previous copies of changed rows so readers can read the old value. It lives in tempdb, the scratch database the server uses for temporary work.", ar: "منطقة يحتفظ فيها SQL Server بالنسخ السابقة من الـ rows المتغيّرة ليقرأ القارئ القيمة القديمة. وتوجد داخل tempdb، وهي قاعدة البيانات المؤقتة التي يستخدمها الخادم للعمل العابر." } },
        { k: { en: "RCSI", ar: "RCSI" },
          v: { en: "Read Committed Snapshot Isolation — a database setting that makes READ COMMITTED use versions instead of shared locks. Statement-level: each statement sees a fresh snapshot.", ar: "Read Committed Snapshot Isolation — إعداد على مستوى قاعدة البيانات يجعل READ COMMITTED يستخدم النسخ بدل الـ shared locks. يعمل على مستوى الجملة: كل جملة ترى snapshot جديداً." } },
        { k: { en: "SNAPSHOT", ar: "SNAPSHOT" },
          v: { en: "A separate isolation level where the whole transaction sees the database exactly as it was at the moment the transaction started.", ar: "مستوى عزل منفصل يرى فيه الـ transaction كله قاعدة البيانات كما كانت تماماً لحظة بدء الـ transaction." } }
      ]},

      { t: "p",
        en: "Trace one booking through the lock machine. The transaction begins. The SELECT on seat 12 takes a shared lock on that row. Under READ UNCOMMITTED it takes no lock at all. Under READ COMMITTED it takes the shared lock, reads, and drops it immediately. That early release is the single most important detail in this lesson. It is what lets a second reader slip in. Under REPEATABLE READ it holds that shared lock until commit, so nobody can change seat 12 underneath you, but somebody can still insert a new seat row. Under SERIALIZABLE it holds a range lock over the whole EventId = 90 range in the index, so inserts in that range wait too. Then the UPDATE takes an exclusive lock on seat 12, and that one is held until commit no matter which level you chose.",
        ar: "تتبّع حجزاً واحداً عبر آلية الـ locks. يبدأ الـ transaction. الـ SELECT على المقعد 12 يأخذ shared lock على ذلك الـ row. في READ UNCOMMITTED لا يأخذ أي قفل إطلاقاً. في READ COMMITTED يأخذ الـ shared lock ويقرأ ثم يتركه فوراً. وهذا التحرير المبكر هو أهم تفصيل في الدرس كله. فهو ما يسمح لقارئ ثانٍ بالتسلل. في REPEATABLE READ يحتفظ بذلك الـ shared lock حتى الـ commit، فلا يستطيع أحد تغيير المقعد 12 من تحتك، لكن يستطيع أحدهم إدخال row مقعد جديد. وفي SERIALIZABLE يحتفظ بـ range lock على مدى EventId = 90 كاملاً داخل الـ index، فينتظر الـ insert في ذلك المدى أيضاً. ثم يأخذ الـ UPDATE قفل exclusive على المقعد 12، وهذا يُحتفظ به حتى الـ commit مهما كان المستوى الذي اخترته." },

      { t: "code", lang: "sql",
        label: { en: "The same booking at three levels", ar: "نفس الحجز في ثلاثة مستويات" },
        code: "-- 1) Default READ COMMITTED: the check and the write are not one atomic step.\nBEGIN TRAN;\n  SELECT BookedBy FROM Seats WHERE SeatId = 12;   -- S lock taken, then released\n  -- another session can read 'free' right here\n  UPDATE Seats SET BookedBy = @user WHERE SeatId = 12;\nCOMMIT;\n\n-- 2) Same shape, but the read takes the write lock up front.\n-- UPDLOCK = take the lock you will need for the UPDATE now.\n-- HOLDLOCK = keep it until commit.\nBEGIN TRAN;\n  SELECT BookedBy FROM Seats WITH (UPDLOCK, HOLDLOCK)\n  WHERE SeatId = 12;\n  UPDATE Seats SET BookedBy = @user WHERE SeatId = 12;\nCOMMIT;\n\n-- 3) No transaction at all: let one statement do the check and the write.\n-- Rows affected = 0 means somebody else got the seat first.\nUPDATE Seats\n   SET BookedBy = @user\n WHERE SeatId = 12 AND BookedBy IS NULL;" },

      { t: "p",
        en: "Now trace the same booking through the version machine. You turn it on with ALTER DATABASE ... SET READ_COMMITTED_SNAPSHOT ON. Before the UPDATE changes seat 12, SQL Server copies the row's old contents into the version store. It then stamps the live row with a pointer to that copy and a transaction sequence number. A reader arriving mid-update does not queue behind the exclusive lock. It follows the pointer, finds the version that was committed before its own statement started, and returns it. Readers never block writers and writers never block readers. The cost just moves. Tempdb now holds every old version until the last transaction that might need it finishes. And 14 extra bytes are added to every row that has ever been versioned.",
        ar: "الآن تتبّع نفس الحجز عبر آلية النسخ. تفعّلها بـ ALTER DATABASE ... SET READ_COMMITTED_SNAPSHOT ON. قبل أن يغيّر الـ UPDATE المقعد 12، ينسخ SQL Server المحتوى القديم للـ row إلى الـ version store. ثم يضع على الـ row الحي مؤشراً إلى تلك النسخة ورقماً تسلسلياً للـ transaction. القارئ الذي يصل أثناء التعديل لا يقف خلف الـ exclusive lock، بل يتبع المؤشر ويجد النسخة التي كانت مثبَّتة قبل بدء جملته ويرجعها. فلا يعطّل القرّاءُ الكتّابَ ولا العكس. لكن التكلفة تنتقل فقط. صار tempdb يحمل كل نسخة قديمة حتى ينتهي آخر transaction قد يحتاجها. وتُضاف 14 بايت لكل row سبق أن أُنشئت له نسخة." },

      { t: "p",
        en: "There is one trap in the version machine. Because readers never wait, two transactions can both read the old value and both decide to write. Under RCSI the second UPDATE still blocks on the exclusive lock and then re-reads the current row, so a plain UPDATE ... WHERE BookedBy IS NULL is still safe. Under SNAPSHOT it is different: the second transaction is aborted at commit with error 3960, an update conflict, because the row it based its decision on changed after its snapshot was taken. That means any code using SNAPSHOT must be ready to catch 3960 and retry the whole transaction.",
        ar: "هناك فخ واحد في آلية النسخ. لأن القرّاء لا ينتظرون، يمكن لـ transactionين أن يقرآ القيمة القديمة ويقرّرا الكتابة معاً. في RCSI يبقى الـ UPDATE الثاني محجوزاً على الـ exclusive lock ثم يعيد قراءة الـ row الحالي، لذا يبقى UPDATE ... WHERE BookedBy IS NULL آمناً. أما في SNAPSHOT فالوضع مختلف: يُلغى الـ transaction الثاني عند الـ commit بالخطأ 3960، وهو update conflict، لأن الـ row الذي بنى عليه قراره تغيّر بعد أخذ الـ snapshot. أي أن أي كود يستخدم SNAPSHOT يجب أن يكون مستعداً لالتقاط 3960 وإعادة تنفيذ الـ transaction كاملاً." },

      { t: "kv", rows: [
        { k: { en: "READ UNCOMMITTED", ar: "READ UNCOMMITTED" },
          v: { en: "Takes no shared locks. Allows dirty, non-repeatable and phantom reads. Same thing as the NOLOCK hint.", ar: "لا يأخذ shared locks. يسمح بـ dirty و non-repeatable و phantom reads. وهو نفسه تلميح NOLOCK." } },
        { k: { en: "READ COMMITTED (locking)", ar: "READ COMMITTED (locking)" },
          v: { en: "Shared lock taken and released per row read. No dirty reads. Non-repeatable and phantom reads still possible. The default.", ar: "يأخذ shared lock ويحرّره مع كل row يُقرأ. لا dirty reads، لكن non-repeatable و phantom ما زالا ممكنين. وهو الافتراضي." } },
        { k: { en: "READ COMMITTED (RCSI)", ar: "READ COMMITTED (RCSI)" },
          v: { en: "Same guarantees, no shared locks at all. Each statement reads a snapshot as of when that statement began.", ar: "نفس الضمانات لكن بلا shared locks إطلاقاً. كل جملة تقرأ snapshot كما كان عند بدء تلك الجملة." } },
        { k: { en: "REPEATABLE READ", ar: "REPEATABLE READ" },
          v: { en: "Holds shared locks until commit. Rows you read cannot change. New matching rows can still appear.", ar: "يحتفظ بالـ shared locks حتى الـ commit. لا تتغير الـ rows التي قرأتها، لكن قد تظهر rows جديدة مطابقة." } },
        { k: { en: "SERIALIZABLE", ar: "SERIALIZABLE" },
          v: { en: "Adds range locks so no new matching rows can appear. Prevents all three read anomalies. Highest blocking and deadlock risk.", ar: "يضيف range locks فلا تظهر rows جديدة مطابقة. يمنع الأنواع الثلاثة من الشذوذ، وهو الأعلى في الـ blocking وخطر الـ deadlock." } },
        { k: { en: "SNAPSHOT", ar: "SNAPSHOT" },
          v: { en: "Whole transaction reads one snapshot from its start. No read anomalies, no read blocking, but writes can fail with error 3960.", ar: "الـ transaction كله يقرأ snapshot واحداً من لحظة بدايته. لا شذوذ في القراءة ولا انتظار عند القراءة، لكن الكتابة قد تفشل بالخطأ 3960." } }
      ]}
    ]},
    { key: "tradeoffs", blocks: [
      { t: "tradeoff",
        pros: {
          en: [
            "Switching READ COMMITTED to RCSI removes reader-writer blocking entirely, usually with no code change.",
            "Snapshot reads give a report a single consistent picture without freezing the tables it reads.",
            "Higher lock-based levels genuinely prevent lost updates without any extra application logic.",
            "The level is set per transaction, so one slow report does not force the whole app to change."
          ],
          ar: [
            "تحويل READ COMMITTED إلى RCSI يزيل تعطيل القارئ للكاتب تماماً، وغالباً بلا أي تغيير في الكود.",
            "قراءات الـ snapshot تعطي التقرير صورة متسقة واحدة دون تجميد الجداول التي يقرأها.",
            "المستويات الأعلى المبنية على الـ locks تمنع فعلاً الـ lost update بلا أي منطق إضافي في التطبيق.",
            "المستوى يُضبط لكل transaction، فلا يجبر تقرير بطيء واحد التطبيق كله على التغيّر."
          ]
        },
        cons: {
          en: [
            "REPEATABLE READ and SERIALIZABLE hold locks longer, so blocking and deadlocks both go up.",
            "Row versioning pushes load onto tempdb; a long-open transaction makes the version store grow without bound.",
            "SNAPSHOT can abort your transaction with error 3960, so every writer needs retry logic.",
            "READ UNCOMMITTED can return rows twice, skip rows, or return values that were rolled back."
          ],
          ar: [
            "REPEATABLE READ و SERIALIZABLE يحتفظان بالـ locks مدة أطول، فيزيد الـ blocking والـ deadlocks معاً.",
            "الـ row versioning ينقل الحمل إلى tempdb، و transaction مفتوح لوقت طويل يجعل الـ version store ينمو بلا حد.",
            "SNAPSHOT قد يُلغي الـ transaction بالخطأ 3960، فكل كاتب يحتاج منطق إعادة محاولة.",
            "READ UNCOMMITTED قد يرجع rows مكررة أو يتخطى rows أو يرجع قيماً جرى التراجع عنها."
          ]
        },
        limits: {
          en: [
            "No isolation level protects data you read in one request and write back in a later request.",
            "SERIALIZABLE only blocks inserts in ranges it can lock; without a usable index it locks far more than you meant.",
            "Turning RCSI on requires exclusive access to the database for a moment, so it is not a free live change.",
            "Isolation says nothing about durability or about work that happens outside the database."
          ],
          ar: [
            "لا يوجد مستوى عزل يحمي بيانات قرأتها في طلب وكتبتها في طلب لاحق.",
            "SERIALIZABLE يمنع الـ insert فقط في المدى الذي يستطيع قفله؛ وبلا index مناسب يقفل أكثر بكثير مما قصدت.",
            "تفعيل RCSI يحتاج وصولاً حصرياً لقاعدة البيانات للحظة، فهو ليس تغييراً مجانياً أثناء التشغيل.",
            "العزل لا يقول شيئاً عن الـ durability ولا عن العمل الذي يحدث خارج قاعدة البيانات."
          ]
        },
        alts: {
          en: [
            "One atomic UPDATE ... WHERE that both checks and writes, then look at rows affected.",
            "Optimistic concurrency: a rowversion column, which SQL Server bumps on every change, compared in the WHERE clause; retry on zero rows.",
            "A unique constraint or filtered index that makes the bad state impossible to store at all.",
            "Application-level locks (sp_getapplock) when the thing you must serialize is not a row."
          ],
          ar: [
            "جملة UPDATE ... WHERE ذرّية واحدة تتحقق وتكتب معاً، ثم تفحص عدد الـ rows المتأثرة.",
            "التزامن التفاؤلي: عمود rowversion يزيده SQL Server مع كل تغيير، يُقارَن داخل الـ WHERE، مع إعادة المحاولة عند صفر rows.",
            "قيد unique أو filtered index يجعل الحالة الخاطئة مستحيلة التخزين أصلاً.",
            "أقفال على مستوى التطبيق (sp_getapplock) حين يكون ما تريد ترتيبه ليس row."
          ]
        }
      }
    ]},
    { key: "mistakes", blocks: [
      { t: "mistake",
        title: { en: "NOLOCK sprinkled on every query to \"make it faster\"", ar: "رشّ NOLOCK على كل استعلام «ليصبح أسرع»" },
        body: {
          en: "A team added WITH (NOLOCK) to every SELECT in the reporting layer after a blocking incident. NOLOCK means READ UNCOMMITTED for that table. Six weeks later the nightly revenue report was 3% off. Dirty reads were only half the cause. A page is the 8 KB unit SQL Server stores rows in. When a page fills up, SQL Server does a page split: it moves half the rows to a new page. A scan holding no shared lock can be reading while that happens, so it may read a page twice or skip one. The report counted some orders twice and missed others. NOLOCK does not make queries faster; it makes them not wait, which is a different thing.",
          ar: "فريق أضاف WITH (NOLOCK) إلى كل SELECT في طبقة التقارير بعد حادثة blocking. و NOLOCK يعني READ UNCOMMITTED لذلك الجدول. بعد ستة أسابيع كان تقرير الإيرادات الليلي مخطئاً بنسبة 3%. والـ dirty reads كانت نصف السبب فقط. الـ page هي وحدة الـ 8 KB التي يخزّن SQL Server الـ rows داخلها. وحين تمتلئ page ينفّذ SQL Server عملية page split: ينقل نصف الـ rows إلى page جديدة. والـ scan الذي لا يحمل shared lock قد يكون يقرأ أثناء ذلك، فيقرأ page مرتين أو يتخطى واحدة. فعدّ التقرير بعض الطلبات مرتين وأسقط أخرى. NOLOCK لا يجعل الاستعلام أسرع، بل يجعله لا ينتظر، وهذان أمران مختلفان."
        },
        fix: "-- Instead of NOLOCK, remove the blocking at its source:\nALTER DATABASE Booking SET READ_COMMITTED_SNAPSHOT ON;\n-- readers now get a consistent, committed snapshot and never wait" },

      { t: "mistake",
        title: { en: "Assuming SELECT-then-UPDATE in a transaction is atomic", ar: "افتراض أن SELECT ثم UPDATE داخل transaction عملية ذرّية" },
        body: {
          en: "This is the double-booking bug from the start of the lesson. The developer reasoned: it is all inside BeginTransaction, so nothing can get between the two statements. But a transaction is a unit of commit, not a unit of exclusion. At READ COMMITTED the shared lock from the SELECT is gone the instant the read finishes, so a second session reads the same free seat. The transaction boundary did not create any protection here.",
          ar: "هذا هو خطأ الحجز المزدوج من بداية الدرس. فكّر المطوّر: كل شيء داخل BeginTransaction، إذن لا شيء يمكنه الدخول بين الجملتين. لكن الـ transaction وحدة تثبيت وليس وحدة إقصاء. في READ COMMITTED يختفي الـ shared lock الخاص بالـ SELECT فور انتهاء القراءة، فيقرأ session ثانٍ نفس المقعد الشاغر. حدّ الـ transaction لم يوفّر أي حماية هنا."
        },
        fix: "UPDATE Seats\n   SET BookedBy = @user\n WHERE SeatId = @seatId AND BookedBy IS NULL;\n-- @@ROWCOUNT = 0  ->  return 409 Conflict, the seat was taken" },

      { t: "mistake",
        title: { en: "Setting SERIALIZABLE globally to be safe", ar: "ضبط SERIALIZABLE على مستوى النظام «احتياطاً»" },
        body: {
          en: "After the double-booking incident someone set the isolation level to SERIALIZABLE in a connection interceptor so it applied to every query. Bookings became correct. Everything else got worse: deadlocks went from about 2 a day to 400 a day. The reason is range locks. The availability count runs WHERE EventId = 90, and at SERIALIZABLE that takes a range lock covering every seat of the event, so every booking for that event waits behind every count. Correctness for one endpoint was bought with contention on all of them.",
          ar: "بعد حادثة الحجز المزدوج ضبط أحدهم مستوى العزل على SERIALIZABLE داخل connection interceptor فطُبِّق على كل استعلام. صارت الحجوزات صحيحة، وساء كل شيء آخر: ارتفعت الـ deadlocks من نحو 2 يومياً إلى 400 يومياً. والسبب هو الـ range locks. استعلام التوفّر ينفّذ WHERE EventId = 90، وفي SERIALIZABLE يأخذ ذلك range lock يغطي كل مقاعد الحفلة، فينتظر كل حجز خلف كل عملية عدّ. اشتُريت صحة endpoint واحد بثمن تنافس على كل الباقي."
        } },

      { t: "mistake",
        title: { en: "A long transaction opened before the work starts", ar: "transaction طويل يُفتح قبل أن يبدأ العمل" },
        body: {
          en: "The booking handler called BeginTransaction, then called the payment provider over HTTP, then wrote the seat. The HTTP call takes 400 ms on a good day and 30 s when the provider is slow. During all that time the transaction holds its locks, and under RCSI it also pins every row version created since it started, so tempdb grew by 60 GB during one provider outage. The rule that follows: open the transaction as late as possible, do no network calls inside it, and commit as soon as the writes are done.",
          ar: "معالج الحجز كان ينادي BeginTransaction، ثم ينادي مزوّد الدفع عبر HTTP، ثم يكتب المقعد. نداء الـ HTTP يستغرق 400 ms في اليوم الجيد و 30 s حين يبطئ المزوّد. وطوال ذلك الوقت يحتفظ الـ transaction بأقفاله، وفي RCSI يثبّت أيضاً كل row version أُنشئت منذ بدايته، فنما tempdb بمقدار 60 GB أثناء انقطاع واحد عند المزوّد. والقاعدة الناتجة: افتح الـ transaction في أقصى وقت متأخر ممكن، ولا تنفّذ نداءات شبكة داخله، وثبّته فور انتهاء الكتابة."
        } }
    ]},
    { key: "interview", blocks: [
      { t: "qa", level: "junior",
        q: { en: "What is a dirty read?", ar: "ما هو الـ dirty read؟" },
        a: {
          en: "It is reading a value that another transaction has written but not committed yet. If that transaction rolls back, the value you read never really existed, and anything you decided from it is wrong. Only READ UNCOMMITTED allows it, and that is the same thing as putting NOLOCK on a query. Every other level stops it.",
          ar: "هو أن تقرأ قيمة كتبها transaction آخر ولم يثبّتها بعد. فإن عمل rollback تكون القيمة التي قرأتها لم توجد أصلاً، وأي قرار بنيته عليها خاطئ. المستوى الوحيد الذي يسمح به هو READ UNCOMMITTED، وهو نفسه وضع NOLOCK على الاستعلام. وكل المستويات الأخرى تمنعه."
        } },

      { t: "qa", level: "mid",
        q: { en: "What is the default isolation level in SQL Server and what does it actually guarantee?", ar: "ما مستوى العزل الافتراضي في SQL Server وما الذي يضمنه فعلياً؟" },
        a: {
          en: "READ COMMITTED, using locks. It guarantees one thing: every value you read was committed at the moment you read it. That is all. It does not promise the value will still be there a millisecond later, and it does not promise a second run of the same query returns the same rows. Practically, that means a SELECT followed by an UPDATE in the same transaction is not protected — someone can change the row in between.",
          ar: "هو READ COMMITTED باستخدام الـ locks. ويضمن شيئاً واحداً: أن كل قيمة تقرأها كانت مثبَّتة لحظة قراءتك لها. هذا كل شيء. لا يعد بأن القيمة ستبقى بعد ميلي ثانية، ولا بأن إعادة نفس الاستعلام ترجع نفس الـ rows. عملياً هذا يعني أن SELECT يتبعه UPDATE داخل نفس الـ transaction غير محمي، فقد يغيّر أحدهم الـ row بينهما."
        } },

      { t: "qa", level: "mid",
        q: { en: "Difference between a non-repeatable read and a phantom read?", ar: "ما الفرق بين non-repeatable read و phantom read؟" },
        a: {
          en: "Both mean you read twice and got different answers, but the cause is different. Non-repeatable read is about a row that already existed and whose value changed — you read seat 12 as free, then read it again and it is booked. Phantom read is about the set of rows matching your filter changing — you count 40 free seats, someone inserts a new seat row, you count again and get 41. REPEATABLE READ stops the first because it keeps its shared locks. Only SERIALIZABLE stops the second, because you need a lock on the gap where the new row would go, not just on rows that exist.",
          ar: "كلاهما يعني أنك قرأت مرتين وحصلت على إجابتين مختلفتين، لكن السبب مختلف. الـ non-repeatable read يخصّ row كان موجوداً وتغيّرت قيمته — قرأت المقعد 12 شاغراً ثم قرأته فوجدته محجوزاً. والـ phantom read يخصّ تغيّر مجموعة الـ rows المطابقة للفلتر — عددت 40 مقعداً شاغراً فأدخل أحدهم row مقعد جديد فعددت مرة أخرى فحصلت على 41. REPEATABLE READ يمنع الأول لأنه يحتفظ بالـ shared locks. و SERIALIZABLE وحده يمنع الثاني، لأنك تحتاج قفلاً على الفراغ الذي سيدخل فيه الـ row الجديد لا على الـ rows الموجودة فقط."
        } },

      { t: "qa", level: "senior",
        q: { en: "You have a reporting query blocking writes for seconds at a time. Walk me through your options.", ar: "لديك استعلام تقارير يعطّل الكتابة لثوانٍ في كل مرة. اشرح خياراتك." },
        a: {
          en: "First I confirm it really is lock waiting and not slow disk. I check the wait type on the blocked sessions; anything starting with LCK_M_ is a lock wait. If it is locks, the cheap and correct fix is RCSI. Turn on READ_COMMITTED_SNAPSHOT and the report reads row versions instead of taking shared locks. It stops blocking writers with no query changes at all. The cost is tempdb space and 14 bytes per versioned row, so I'd size tempdb and watch the version store before flipping it. If I cannot change database settings, the second option is to make the report cheaper so it holds locks for less time. Usually a covering index — one that already contains every column the query needs — turns a full table scan into a targeted seek. NOLOCK is the option I would not take. A scan without shared locks can double-count or skip rows while pages are being split, and a wrong report is worse than a slow one.",
          ar: "أولاً أتأكد أنه انتظار locks فعلاً وليس قرصاً بطيئاً. أفحص نوع الانتظار للـ sessions المعطَّلة؛ وكل ما يبدأ بـ LCK_M_ هو انتظار قفل. إن كانت locks فالحل الرخيص والصحيح هو RCSI. أفعّل READ_COMMITTED_SNAPSHOT فيقرأ التقرير row versions بدل أخذ shared locks. فيتوقف عن تعطيل الكتّاب دون تغيير أي استعلام إطلاقاً. والتكلفة مساحة في tempdb و 14 بايت لكل row له نسخة، لذلك أحدّد حجم tempdb وأراقب الـ version store قبل التفعيل. وإن لم أستطع تغيير إعدادات قاعدة البيانات، فالخيار الثاني أن أجعل التقرير أرخص ليحتفظ بالأقفال وقتاً أقل. وغالباً يحوّل covering index — وهو index يحتوي أصلاً كل عمود يحتاجه الاستعلام — الـ scan الكامل للجدول إلى seek محدد. أما NOLOCK فهو الخيار الذي لن آخذه. فالـ scan بلا shared locks قد يعدّ rows مرتين أو يتخطاها أثناء تقسيم الـ pages، وتقرير خاطئ أسوأ من تقرير بطيء."
        } },

      { t: "qa", level: "senior",
        q: { en: "When would you use SNAPSHOT instead of RCSI?", ar: "متى تستخدم SNAPSHOT بدل RCSI؟" },
        a: {
          en: "When one transaction runs several statements and they all have to see the same picture. RCSI gives each statement its own fresh snapshot, so a transaction that counts total seats and then counts booked seats can still see them from two different moments. SNAPSHOT fixes the whole transaction to the instant it began, so both counts agree. The price is on the write side. If another transaction changed a row after your snapshot was taken, your commit fails with error 3960. So I only use SNAPSHOT where I can retry the whole transaction cleanly. In practice that means read-mostly work like a report or an export.",
          ar: "حين ينفّذ transaction واحد عدة جمل ويجب أن ترى كلها نفس الصورة. RCSI يعطي كل جملة snapshot جديداً خاصاً بها، فقد يرى transaction يعدّ إجمالي المقاعد ثم يعدّ المحجوزة رقمين من لحظتين مختلفتين. أما SNAPSHOT فيثبّت الـ transaction كله على لحظة بدايته، فتتفق العدّتان. والثمن يقع على جانب الكتابة. فإذا غيّر transaction آخر row بعد أخذ الـ snapshot، يفشل الـ commit بالخطأ 3960. لذلك أستخدم SNAPSHOT فقط حيث أستطيع إعادة تنفيذ الـ transaction كاملاً بنظافة. وعملياً هذا يعني عمل قراءة في معظمه مثل تقرير أو تصدير."
        } },

      { t: "qa", level: "staff",
        q: { en: "Concurrency bugs keep reaching production in your org. What do you change structurally?", ar: "أخطاء التزامن تصل إلى الإنتاج باستمرار في مؤسستك. ما الذي تغيّره هيكلياً؟" },
        a: {
          en: "I stop treating it as a knowledge problem, because these bugs never show up in a single-user test. Three changes. First, correctness moves into the schema wherever possible — a unique index on the booked seat means the database rejects the double booking no matter what any service does. Second, the load test suite gets a concurrency job that runs the critical write paths at real parallelism and asserts invariants afterwards; that is what turns a 1-in-17,000 race into a red build. Third, isolation level becomes an explicit, reviewed decision. One shared data-access helper requires the caller to name both the level and the retry policy. Then nobody sets SERIALIZABLE globally in an interceptor, and nobody discovers the default by accident. Finally I make sure someone owns tempdb and version-store monitoring, since that is the new failure mode once RCSI is on.",
          ar: "أتوقف عن التعامل معها كمشكلة معرفة، لأن هذه الأخطاء لا تظهر أبداً في اختبار بمستخدم واحد. ثلاثة تغييرات. أولاً، تنتقل الصحة إلى الـ schema كلما أمكن — unique index على المقعد المحجوز يجعل قاعدة البيانات ترفض الحجز المزدوج مهما فعلت أي خدمة. ثانياً، تحصل مجموعة اختبارات الحِمل على مهمة تزامن تشغّل مسارات الكتابة الحرجة بتوازٍ حقيقي ثم تتحقق من الثوابت؛ هذا ما يحوّل حالة واحدة من 17,000 إلى build أحمر. ثالثاً، يصبح مستوى العزل قراراً صريحاً تجري مراجعته. helper واحد مشترك للوصول إلى البيانات يُلزم المنادي بتسمية المستوى وسياسة إعادة المحاولة معاً. عندها لا يضبط أحد SERIALIZABLE عالمياً داخل interceptor، ولا يكتشف أحد الافتراضي بالصدفة. وأخيراً أضمن أن هناك من يملك مراقبة tempdb والـ version store، لأنه وضع الفشل الجديد بعد تفعيل RCSI."
        } }
    ]},
    { key: "codereview", blocks: [
      { t: "review", severity: "high",
        title: { en: "Check-then-write across two statements", ar: "تحقّق ثم اكتب عبر جملتين" },
        bad: "using var tx = await db.Database.BeginTransactionAsync();\n\nvar seat = await db.Seats.FirstAsync(s => s.SeatId == seatId);\nif (seat.BookedBy is not null)\n    return Conflict();\n\nseat.BookedBy = userId;\nawait db.SaveChangesAsync();\nawait tx.CommitAsync();",
        good: "// One statement decides and writes. No window in between.\nvar rows = await db.Database.ExecuteSqlInterpolatedAsync($@\"\n    UPDATE Seats\n       SET BookedBy = {userId}\n     WHERE SeatId = {seatId} AND BookedBy IS NULL\");\n\nreturn rows == 0 ? Conflict() : Ok();",
        why: {
          en: "The transaction does not make the read and the write one step. At READ COMMITTED the read's shared lock is released as soon as the row is read, so two requests can both see BookedBy = null and both write. The rewrite moves the condition into the UPDATE itself, which holds an exclusive lock while it evaluates, so only one request can match. Rows affected of 0 is the signal that someone else won, and it maps cleanly to 409 Conflict.",
          ar: "الـ transaction لا يجعل القراءة والكتابة خطوة واحدة. في READ COMMITTED يُحرَّر الـ shared lock الخاص بالقراءة فور قراءة الـ row، فيمكن لطلبين أن يريا BookedBy = null وأن يكتبا معاً. إعادة الكتابة تنقل الشرط إلى داخل الـ UPDATE نفسه، وهو يحمل exclusive lock أثناء التقييم، فلا يطابق إلا طلب واحد. وعدد الـ rows المتأثرة صفر هو الإشارة إلى أن غيرك فاز، ويقابل 409 Conflict مباشرة."
        } },

      { t: "review", severity: "medium",
        title: { en: "SNAPSHOT transaction with no retry", ar: "transaction بمستوى SNAPSHOT بلا إعادة محاولة" },
        bad: "using var tx = await db.Database.BeginTransactionAsync(\n    IsolationLevel.Snapshot);\n\nawait ApplySeatChangesAsync(db, changes);\nawait db.SaveChangesAsync();\nawait tx.CommitAsync();   // can throw SqlException 3960",
        good: "var policy = Policy\n    .Handle<SqlException>(e => e.Number == 3960)\n    .WaitAndRetryAsync(3, a => TimeSpan.FromMilliseconds(50 * a));\n\nawait policy.ExecuteAsync(async () =>\n{\n    // A fresh DbContext each attempt: the old one still holds\n    // the entities loaded under the stale snapshot.\n    using var db = factory.CreateDbContext();\n    using var tx = await db.Database.BeginTransactionAsync(\n        IsolationLevel.Snapshot);\n\n    await ApplySeatChangesAsync(db, changes);\n    await db.SaveChangesAsync();\n    await tx.CommitAsync();\n});",
        why: {
          en: "SNAPSHOT trades waiting for failing. If another transaction changed a row you based your write on after your snapshot was taken, SQL Server raises error 3960 instead of blocking. Without a retry that becomes a 500 for the user under load, and the failures cluster exactly when the system is busiest. The retry also has to build a new DbContext, because the old one is still tracking entities read from the stale snapshot and would send the same doomed write again.",
          ar: "SNAPSHOT يستبدل الانتظار بالفشل. فإذا غيّر transaction آخر row بنيت كتابتك عليه بعد أخذ الـ snapshot، يرفع SQL Server الخطأ 3960 بدل التعطيل. وبلا إعادة محاولة يتحول ذلك إلى 500 للمستخدم تحت الحِمل، وتتجمّع الأعطال تحديداً حين يكون النظام في أشدّ انشغاله. كما يجب أن تبني إعادة المحاولة DbContext جديداً، لأن القديم ما زال يتتبّع entities قُرئت من snapshot قديم وسيرسل نفس الكتابة الفاشلة مرة أخرى."
        } }
    ]},
    { key: "sysdesign", blocks: [
      { t: "p",
        en: "In a system design discussion, isolation level is where you answer \"what happens when two users do this at the same time?\". For the booking service the answer has three layers, and the interviewer is checking whether you know they are separate. The database has a unique filtered index — an index over only the rows matching a condition, which refuses duplicates among them. Two rows can then never claim the same seat. That is the last line of defence and no code can bypass it. The write path uses a single conditional UPDATE so the normal case never needs a high isolation level at all. The read path runs under RCSI so the availability page and the reports never block a booking.",
        ar: "في نقاش تصميم النظام، مستوى العزل هو المكان الذي تجيب فيه على سؤال «ماذا يحدث حين ينفّذ مستخدمان هذا في نفس الوقت؟». في خدمة الحجز تتكون الإجابة من ثلاث طبقات، والممتحِن يتحقق إن كنت تعرف أنها منفصلة. قاعدة البيانات فيها unique filtered index — وهو index على الـ rows المطابقة لشرط معيّن فقط، ويرفض التكرار بينها. عندها لا يمكن أن يدّعي rowان نفس المقعد. وهذا خط الدفاع الأخير ولا يستطيع أي كود تجاوزه. ومسار الكتابة يستخدم UPDATE شرطياً واحداً فلا تحتاج الحالة العادية مستوى عزل عالياً إطلاقاً. ومسار القراءة يعمل تحت RCSI فلا تعطّل صفحة التوفّر ولا التقارير أي حجز." },

      { t: "ul",
        en: [
          "Draw the read path and the write path separately: they almost always want different isolation levels and different indexes.",
          "Say which invariant the database enforces itself. \"Two people cannot book one seat\" should be a constraint, not a code comment.",
          "Isolation stops at the database boundary. If a booking also calls a payment API, you need an idempotency key (an id that makes a repeated call a no-op) and an outbox, not a higher isolation level.",
          "In a read-replica setup, the replica lags. A user who books and is redirected to a page reading from the replica may not see the booking — route read-after-write to the primary.",
          "Name the retry policy at the same time as the isolation level. SNAPSHOT without retry and SERIALIZABLE without deadlock retry are both incomplete designs."
        ],
        ar: [
          "ارسم مسار القراءة ومسار الكتابة منفصلين: كل منهما يريد عادةً مستوى عزل مختلفاً و indexes مختلفة.",
          "حدّد أي ثابت تفرضه قاعدة البيانات بنفسها. «لا يمكن لشخصين حجز مقعد واحد» يجب أن يكون constraint لا تعليقاً في الكود.",
          "العزل يتوقف عند حدود قاعدة البيانات. فإن كان الحجز ينادي أيضاً API دفع، فأنت تحتاج idempotency key (معرّف يجعل النداء المكرر بلا أثر) و outbox، لا مستوى عزل أعلى.",
          "في إعداد فيه read replica هناك تأخر. فالمستخدم الذي يحجز ثم يُحوَّل إلى صفحة تقرأ من الـ replica قد لا يرى حجزه — وجّه القراءة بعد الكتابة إلى الـ primary.",
          "سمِّ سياسة إعادة المحاولة مع تسمية مستوى العزل. فـ SNAPSHOT بلا retry و SERIALIZABLE بلا retry للـ deadlock كلاهما تصميم ناقص."
        ] },

      { t: "callout", kind: "tip",
        en: "A useful sentence in a design review: \"the isolation level protects a transaction, the constraint protects the data\". Isolation is about what one connection sees while it works. A unique index is about what the table will ever be allowed to hold. You want the second one for anything that must never be true.",
        ar: "جملة مفيدة في مراجعة التصميم: «مستوى العزل يحمي transaction، والـ constraint يحمي البيانات». العزل يتعلق بما يراه connection واحد أثناء عمله. أما الـ unique index فيتعلق بما يُسمح للجدول بحمله أصلاً. وأنت تريد الثاني لأي شيء يجب ألا يكون صحيحاً أبداً." }
    ]},
    { key: "perf", blocks: [
      { t: "kv", rows: [
        { k: { en: "Latency", ar: "Latency" },
          v: { en: "Lock waiting shows up in the tail, not the average. The booking p99 of 8 s came almost entirely from waiting behind a reporting scan; after RCSI it fell to 180 ms while p50 barely moved.", ar: "انتظار الـ locks يظهر في الذيل لا في المتوسط. زمن p99 للحجز البالغ 8 s كان كله تقريباً انتظاراً خلف scan تقارير؛ وبعد RCSI نزل إلى 180 ms بينما لم يتحرك p50 تقريباً." } },
        { k: { en: "Database", ar: "Database" },
          v: { en: "Higher lock-based levels multiply deadlocks, because holding more locks for longer creates more chances for two sessions to want each other's locks in opposite order.", ar: "المستويات الأعلى المبنية على الـ locks تضاعف الـ deadlocks، لأن حمل أقفال أكثر لوقت أطول يخلق فرصاً أكثر لأن يريد sessionان أقفال بعضهما بترتيب معاكس." } },
        { k: { en: "Memory", ar: "Memory" },
          v: { en: "Row versioning adds 14 bytes to every row it touches and keeps old versions in tempdb. A single transaction left open for an hour can hold gigabytes of versions alive.", ar: "الـ row versioning يضيف 14 بايت لكل row يلمسه ويحتفظ بالنسخ القديمة في tempdb. و transaction واحد يُترك مفتوحاً ساعة قد يبقي gigabytes من النسخ حيّة." } },
        { k: { en: "CPU", ar: "CPU" },
          v: { en: "Reading a versioned row costs a pointer hop per version in the chain. Rows updated many times in a short window get long chains and measurably slower reads.", ar: "قراءة row له نسخ تكلّف قفزة مؤشر لكل نسخة في السلسلة. والـ rows التي تُعدَّل مرات كثيرة في فترة قصيرة تكوّن سلاسل طويلة وقراءات أبطأ بشكل ملموس." } },
        { k: { en: "Scalability", ar: "Scalability" },
          v: { en: "Lock contention gets worse as you add application servers, since more concurrent transactions want the same rows. Snapshot reads scale with hardware instead.", ar: "التنافس على الأقفال يسوء كلما أضفت خوادم تطبيق، لأن transactions متزامنة أكثر تريد نفس الـ rows. أما قراءات الـ snapshot فتتوسّع مع العتاد بدلاً من ذلك." } }
      ]}
    ]},
    { key: "debug", blocks: [
      { t: "ul",
        en: [
          "sys.dm_exec_requests joined to sys.dm_exec_sql_text: look at blocking_session_id to find who is waiting on whom, and wait_type starting with LCK_M_ to confirm it is a lock wait and not slow disk.",
          "sys.dm_tran_locks: shows every lock currently held, with resource_type and request_mode. RangeS-S in request_mode means someone is running at SERIALIZABLE.",
          "DBCC USEROPTIONS on the live connection: prints the isolation level that connection is actually using, which is how you catch an interceptor or a TransactionScope changing it behind your back.",
          "sys.databases: read is_read_committed_snapshot_on and snapshot_isolation_state to know which machine — locks or versions — is really running before you theorise.",
          "sys.dm_tran_version_store_space_usage plus sys.dm_tran_active_snapshot_database_transactions: if tempdb is growing, the second view names the oldest open transaction that is pinning the versions."
        ],
        ar: [
          "sys.dm_exec_requests مع sys.dm_exec_sql_text: انظر إلى blocking_session_id لتعرف من ينتظر من، وإلى wait_type الذي يبدأ بـ LCK_M_ لتؤكد أنه انتظار قفل لا قرص بطيء.",
          "sys.dm_tran_locks: يعرض كل قفل محمول حالياً مع resource_type و request_mode. ووجود RangeS-S في request_mode يعني أن أحدهم يعمل بمستوى SERIALIZABLE.",
          "DBCC USEROPTIONS على الـ connection الحي: يطبع مستوى العزل الذي يستخدمه ذلك الـ connection فعلاً، وبه تكتشف interceptor أو TransactionScope يغيّره من خلف ظهرك.",
          "sys.databases: اقرأ is_read_committed_snapshot_on و snapshot_isolation_state لتعرف أي آلية — الأقفال أم النسخ — تعمل فعلاً قبل أن تضع أي فرضية.",
          "sys.dm_tran_version_store_space_usage مع sys.dm_tran_active_snapshot_database_transactions: إن كان tempdb ينمو، فالـ view الثاني يسمّي أقدم transaction مفتوح يثبّت النسخ."
        ] },

      { t: "callout", kind: "tip",
        en: "To reproduce a concurrency bug on purpose, open two query windows and step through them by hand. In window one run BEGIN TRAN and the SELECT, and stop. In window two run the same SELECT, then the UPDATE. Then go back and finish window one. If both windows think they got the seat, you have proved the race in ten seconds — no load test needed. Always finish with ROLLBACK in both windows so you do not leave locks held.",
        ar: "لإعادة إنتاج خطأ تزامن عمداً، افتح نافذتي استعلام ونفّذهما خطوة بخطوة يدوياً. في النافذة الأولى نفّذ BEGIN TRAN ثم الـ SELECT وتوقف. وفي الثانية نفّذ نفس الـ SELECT ثم الـ UPDATE. ثم عد وأكمل النافذة الأولى. فإن ظنّت النافذتان أن كلاً منهما حصل على المقعد، تكون قد أثبتّ التسابق في عشر ثوانٍ بلا اختبار حِمل. وأنهِ دائماً بـ ROLLBACK في النافذتين حتى لا تترك أقفالاً محمولة." }
    ]},
    { key: "realworld", blocks: [
      { t: "p",
        en: "The pattern repeats anywhere a limited resource is claimed by many people at once. The details change but the shape does not: read the current state, decide, write. Every industry below has its own version of the double-booked seat. Each one ends up choosing between a stricter isolation level, a single conditional write, and a constraint that makes the bad state unstorable.",
        ar: "يتكرر النمط في كل مكان يطلب فيه كثيرون مورداً محدوداً في نفس الوقت. تتغير التفاصيل ولا يتغير الشكل: اقرأ الحالة الحالية، قرّر، اكتب. كل قطاع أدناه له نسخته من المقعد المحجوز مرتين. وكل واحد منها ينتهي إلى الاختيار بين مستوى عزل أصرم، أو كتابة شرطية واحدة، أو constraint يجعل الحالة الخاطئة غير قابلة للتخزين." },

      { t: "ul",
        en: [
          "Ticketing and travel booking: the same seat or room claimed twice. Usually solved with a conditional UPDATE plus a unique index, never with SERIALIZABLE, because contention on a popular event would be extreme.",
          "Payment and ledger systems: a balance read, checked, then debited. These often do use SERIALIZABLE or explicit UPDLOCK on the account row, because a wrong balance is worse than a slow one, and the contention per account is low.",
          "E-commerce inventory: the last unit sold to two buyers. Many shops deliberately accept the risk at the cart stage and only enforce at checkout, because holding stock strictly hurts conversion more than a rare oversell costs.",
          "Analytics and reporting on the operational database: long-running reads that used to block writes. This is the classic reason a team turns RCSI on, and the reason NOLOCK spread through so many codebases before that."
        ],
        ar: [
          "التذاكر وحجوزات السفر: نفس المقعد أو الغرفة يُطلب مرتين. يُحل عادةً بـ UPDATE شرطي مع unique index، ولا يُحل بـ SERIALIZABLE، لأن التنافس على حفلة مطلوبة سيكون شديداً.",
          "أنظمة الدفع والدفاتر المحاسبية: رصيد يُقرأ ويُفحص ثم يُخصم منه. هذه كثيراً ما تستخدم فعلاً SERIALIZABLE أو UPDLOCK صريحاً على row الحساب، لأن رصيداً خاطئاً أسوأ من رصيد بطيء، والتنافس على الحساب الواحد منخفض.",
          "مخزون التجارة الإلكترونية: آخر قطعة تُباع لمشتريين. كثير من المتاجر يقبل الخطر عمداً في مرحلة السلة ويفرض الشرط عند الدفع فقط، لأن حجز المخزون بصرامة يضرّ التحويل أكثر مما يكلّف بيع زائد نادر.",
          "التحليلات والتقارير على قاعدة البيانات التشغيلية: قراءات طويلة كانت تعطّل الكتابة. وهذا السبب الكلاسيكي لتفعيل الفريق لـ RCSI، وهو نفسه سبب انتشار NOLOCK في كثير من الأكواد قبل ذلك."
        ] }
    ]},
    { key: "exercises", blocks: [
      { t: "ex", diff: "easy",
        en: "Create a Seats table and reproduce a non-repeatable read by hand with two query windows. In window one, BEGIN TRAN and SELECT seat 12. In window two, UPDATE seat 12 and COMMIT. Back in window one, SELECT seat 12 again. You have got it right when the two SELECTs in the same transaction return different values. Then repeat the whole thing at REPEATABLE READ and confirm window two now waits instead.",
        ar: "أنشئ جدول Seats وأعد إنتاج non-repeatable read يدوياً بنافذتي استعلام. في النافذة الأولى نفّذ BEGIN TRAN ثم SELECT للمقعد 12. وفي الثانية نفّذ UPDATE للمقعد 12 ثم COMMIT. ثم عد إلى الأولى ونفّذ SELECT للمقعد 12 مرة أخرى. تكون قد نجحت حين يرجع الـ SELECTان داخل نفس الـ transaction قيمتين مختلفتين. ثم كرّر كل ذلك بمستوى REPEATABLE READ وتأكد أن النافذة الثانية صارت تنتظر بدلاً من ذلك." },

      { t: "ex", diff: "medium",
        en: "Write a small console app that fires 200 concurrent booking attempts at the same seat, first with the SELECT-then-UPDATE version and then with the single conditional UPDATE. Count how many attempts believed they succeeded. You have got it right when the first version reports more than one winner at least sometimes, and the second reports exactly one every run.",
        ar: "اكتب تطبيق console صغيراً يطلق 200 محاولة حجز متزامنة على نفس المقعد، أولاً بنسخة SELECT ثم UPDATE، ثم بنسخة الـ UPDATE الشرطي الواحد. واحسب كم محاولة ظنّت أنها نجحت. تكون قد نجحت حين تُبلّغ النسخة الأولى عن أكثر من فائز في بعض المرات على الأقل، وتُبلّغ الثانية عن فائز واحد بالضبط في كل تشغيل." },

      { t: "ex", diff: "hard",
        en: "Turn RCSI on in a copy of the database and measure the difference. Run a slow reporting query in a loop while the booking load test runs, and record p50 and p99 booking latency before and after the change. You have got it right when you can show the p99 dropping while p50 stays roughly the same, and can point to the version store size growing in sys.dm_tran_version_store_space_usage as the cost you paid.",
        ar: "فعّل RCSI في نسخة من قاعدة البيانات وقِس الفرق. شغّل استعلام تقارير بطيئاً في حلقة أثناء تشغيل اختبار حِمل الحجز، وسجّل p50 و p99 لزمن الحجز قبل التغيير وبعده. تكون قد نجحت حين تستطيع إظهار انخفاض p99 مع بقاء p50 كما هو تقريباً، وتستطيع الإشارة إلى نمو حجم الـ version store في sys.dm_tran_version_store_space_usage باعتباره الثمن الذي دفعته." },

      { t: "ex", diff: "senior",
        en: "Take an existing write path in your own codebase that reads, decides, then writes. Write a one-page note that names the isolation level it runs under today, the exact anomaly it is exposed to, the smallest fix, and what the fix costs. Then add the database constraint that would make the bad state impossible. You have got it right when a colleague who did not write the code can read the note and agree or disagree with a specific reason.",
        ar: "خذ مسار كتابة موجوداً في كودك يقرأ ثم يقرّر ثم يكتب. اكتب ملاحظة من صفحة واحدة تسمّي مستوى العزل الذي يعمل به اليوم، والشذوذ المحدد المعرّض له، وأصغر إصلاح ممكن، وتكلفة ذلك الإصلاح. ثم أضف الـ constraint في قاعدة البيانات الذي يجعل الحالة الخاطئة مستحيلة. تكون قد نجحت حين يستطيع زميل لم يكتب هذا الكود أن يقرأ الملاحظة ويوافق أو يعترض بسبب محدد." }
    ]},
    { key: "refs", blocks: [
      { t: "ref",
        label: { en: "SET TRANSACTION ISOLATION LEVEL — the exact guarantees of each level", ar: "SET TRANSACTION ISOLATION LEVEL — الضمانات الدقيقة لكل مستوى" },
        url: "https://learn.microsoft.com/en-us/sql/t-sql/statements/set-transaction-isolation-level-transact-sql",
        meta: { en: "Docs", ar: "توثيق" } },
      { t: "ref",
        label: { en: "Transaction locking and row versioning guide — how the two machines work", ar: "دليل الـ locking و row versioning — كيف تعمل الآليتان" },
        url: "https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide",
        meta: { en: "Docs", ar: "توثيق" } },
      { t: "ref",
        label: { en: "A Critique of ANSI SQL Isolation Levels — the paper that named snapshot isolation", ar: "A Critique of ANSI SQL Isolation Levels — الورقة التي سمّت snapshot isolation" },
        url: "https://www.microsoft.com/en-us/research/publication/a-critique-of-ansi-sql-isolation-levels/",
        meta: { en: "Paper", ar: "ورقة بحثية" } },
      { t: "ref",
        label: { en: "EF Core transactions — setting the isolation level from C#", ar: "transactions في EF Core — ضبط مستوى العزل من C#" },
        url: "https://learn.microsoft.com/en-us/ef/core/saving/transactions",
        meta: { en: "Docs", ar: "توثيق" } }
    ]}
  ],
  quiz: [
    {
      q: { en: "At the default READ COMMITTED with locks, what happens to the shared lock a SELECT takes?", ar: "في الوضع الافتراضي READ COMMITTED بالـ locks، ماذا يحدث للـ shared lock الذي يأخذه الـ SELECT؟" },
      options: [
        { en: "It is held until the transaction commits or rolls back", ar: "يُحتفظ به حتى يُثبَّت الـ transaction أو يُلغى" },
        { en: "It is released as soon as the row has been read", ar: "يُحرَّر فور قراءة الـ row" },
        { en: "It is never taken at all", ar: "لا يُؤخذ إطلاقاً" },
        { en: "It is upgraded to an exclusive lock automatically", ar: "يُرقّى تلقائياً إلى exclusive lock" }
      ],
      correct: 1,
      why: { en: "READ COMMITTED takes the shared lock, reads, and drops it immediately. That early release is exactly why a SELECT-then-UPDATE inside a transaction is not protected: another session can read the same row in the gap. Exclusive locks from writes are the ones held until commit, at every level.", ar: "READ COMMITTED يأخذ الـ shared lock ويقرأ ثم يتركه فوراً. وهذا التحرير المبكر هو تحديداً سبب عدم حماية SELECT ثم UPDATE داخل transaction: يستطيع session آخر قراءة نفس الـ row في تلك الفجوة. أما أقفال الـ exclusive الناتجة عن الكتابة فهي التي يُحتفظ بها حتى الـ commit، في كل المستويات." }
    },
    {
      q: { en: "Which isolation level is the only one that prevents phantom reads using locks?", ar: "أي مستوى عزل هو الوحيد الذي يمنع الـ phantom reads باستخدام الـ locks؟" },
      options: [
        { en: "READ COMMITTED", ar: "READ COMMITTED" },
        { en: "REPEATABLE READ", ar: "REPEATABLE READ" },
        { en: "SERIALIZABLE", ar: "SERIALIZABLE" },
        { en: "READ UNCOMMITTED", ar: "READ UNCOMMITTED" }
      ],
      correct: 2,
      why: { en: "A phantom is a new row appearing that matches your WHERE. Stopping it needs a lock on the gap where that row would be inserted, not just on rows that already exist. Only SERIALIZABLE takes those range locks. REPEATABLE READ holds shared locks on rows it read, so values cannot change, but new rows can still appear.", ar: "الـ phantom هو ظهور row جديد يطابق شرط الـ WHERE. ومنعه يحتاج قفلاً على الفراغ الذي سيُدخَل فيه ذلك الـ row لا على الـ rows الموجودة فقط. و SERIALIZABLE وحده يأخذ هذه الـ range locks. أما REPEATABLE READ فيحتفظ بأقفال shared على الـ rows التي قرأها، فلا تتغير القيم، لكن قد تظهر rows جديدة." }
    },
    {
      q: { en: "What is the main difference between RCSI and the SNAPSHOT isolation level?", ar: "ما الفرق الأساسي بين RCSI ومستوى العزل SNAPSHOT؟" },
      options: [
        { en: "RCSI gives each statement a fresh snapshot; SNAPSHOT fixes the whole transaction to its start", ar: "RCSI يعطي كل جملة snapshot جديداً، بينما SNAPSHOT يثبّت الـ transaction كله على لحظة بدايته" },
        { en: "RCSI uses locks while SNAPSHOT uses row versions", ar: "RCSI يستخدم الـ locks بينما SNAPSHOT يستخدم row versions" },
        { en: "RCSI allows dirty reads while SNAPSHOT does not", ar: "RCSI يسمح بالـ dirty reads بينما SNAPSHOT لا يسمح" },
        { en: "They are two names for the same setting", ar: "هما اسمان لنفس الإعداد" }
      ],
      correct: 0,
      why: { en: "Both read row versions and neither allows dirty reads. The scope differs: under RCSI two statements in one transaction can see two different moments, so a transaction that counts twice can still get inconsistent numbers. SNAPSHOT pins the whole transaction to one instant, at the cost of possible update conflicts (error 3960) at commit.", ar: "كلاهما يقرأ row versions ولا يسمح أي منهما بالـ dirty reads. الفرق في النطاق: في RCSI قد ترى جملتان داخل transaction واحد لحظتين مختلفتين، فقد يحصل transaction يعدّ مرتين على أرقام غير متسقة. أما SNAPSHOT فيثبّت الـ transaction كله على لحظة واحدة، بثمن احتمال حدوث update conflict (الخطأ 3960) عند الـ commit." }
    },
    {
      q: { en: "Why can a report using WITH (NOLOCK) return a total that is wrong even if nothing was rolled back?", ar: "لماذا قد يرجع تقرير يستخدم WITH (NOLOCK) إجمالياً خاطئاً حتى لو لم يحدث أي rollback؟" },
      options: [
        { en: "NOLOCK rounds numeric values to save time", ar: "NOLOCK يقرّب القيم الرقمية لتوفير الوقت" },
        { en: "A scan with no shared lock can read a page twice or skip one when a page split moves rows", ar: "الـ scan بلا shared lock قد يقرأ page مرتين أو يتخطى واحدة حين يحرّك page split بعض الـ rows" },
        { en: "NOLOCK reads only committed rows from before the transaction started", ar: "NOLOCK يقرأ فقط الـ rows المثبَّتة قبل بدء الـ transaction" },
        { en: "NOLOCK silently converts the query to SERIALIZABLE", ar: "NOLOCK يحوّل الاستعلام بصمت إلى SERIALIZABLE" }
      ],
      correct: 1,
      why: { en: "Dirty reads are only half the danger. Because the scan holds no shared lock, concurrent writes can move rows between pages while it is running, so it can count the same row twice or miss it entirely. That produces a wrong total with no rollback anywhere in sight.", ar: "الـ dirty reads نصف الخطر فقط. فلأن الـ scan لا يحمل shared lock، تستطيع الكتابات المتزامنة نقل rows بين الـ pages أثناء عمله، فيعدّ نفس الـ row مرتين أو يفوّته كلياً. وهذا ينتج إجمالياً خاطئاً بلا أي rollback في الصورة." }
    },
    {
      q: { en: "The seat-booking endpoint double-books under load. Which fix removes the race with the least added contention?", ar: "endpoint حجز المقاعد يحجز مرتين تحت الحِمل. أي إصلاح يزيل التسابق بأقل تنافس مضاف؟" },
      options: [
        { en: "Set SERIALIZABLE for every connection in the application", ar: "ضبط SERIALIZABLE لكل connection في التطبيق" },
        { en: "Add WITH (NOLOCK) to the SELECT so it does not conflict", ar: "إضافة WITH (NOLOCK) إلى الـ SELECT حتى لا يتعارض" },
        { en: "Do the check and the write in one UPDATE ... WHERE BookedBy IS NULL and inspect rows affected", ar: "تنفيذ التحقق والكتابة في UPDATE ... WHERE BookedBy IS NULL واحد وفحص عدد الـ rows المتأثرة" },
        { en: "Wrap the two statements in a longer transaction with a retry loop", ar: "تغليف الجملتين في transaction أطول مع حلقة إعادة محاولة" }
      ],
      correct: 2,
      why: { en: "A single conditional UPDATE evaluates its WHERE while holding the exclusive lock, so exactly one request can match and the gap between checking and writing disappears. It adds no extra locking beyond the write itself. SERIALIZABLE would also fix it but adds range locks across every query, and NOLOCK makes the race more likely, not less.", ar: "جملة UPDATE شرطية واحدة تقيّم شرط الـ WHERE وهي تحمل الـ exclusive lock، فلا يطابق إلا طلب واحد بالضبط وتختفي الفجوة بين التحقق والكتابة. ولا تضيف أي قفل زائد عن الكتابة نفسها. و SERIALIZABLE يصلح المشكلة أيضاً لكنه يضيف range locks على كل الاستعلامات، أما NOLOCK فيزيد احتمال التسابق لا يقلّله." }
    }
  ]
};
```

NEXT: deadlocks
