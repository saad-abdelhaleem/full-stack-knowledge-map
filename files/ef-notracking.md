```js
const efNoTrackingLesson = {
  id: "ef-notracking",
  moduleId: "efcore",
  title: { en: "When to go no-tracking", ar: "متى تستخدم no-tracking" },
  summary: {
    en: "EF Core remembers every entity it loads so it can detect your edits later. On a read-only endpoint that memory is pure waste — AsNoTracking turns it off, and this lesson shows exactly what you gain and what you give up.",
    ar: "EF Core يحتفظ بنسخة من كل entity يحمّله حتى يستطيع لاحقاً اكتشاف تعديلاتك. في endpoint للقراءة فقط هذه الذاكرة هدر كامل — AsNoTracking يوقفها، وهذا الدرس يوضح بالضبط ماذا تربح وماذا تخسر."
  },
  mins: 12,
  sections: [
    { key: "why", blocks: [
      { t: "p",
        en: "Every time EF Core loads a row into an object, it also keeps a private copy of that object's values. Later, when you call SaveChanges, it compares the object to that copy to work out what you changed. AsNoTracking tells EF Core to skip the copy. You get the objects, but EF Core forgets them the moment they leave the query.",
        ar: "في كل مرة يحمّل EF Core صفاً إلى object، يحتفظ أيضاً بنسخة خاصة من قيم ذلك الـ object. لاحقاً عند استدعاء SaveChanges، يقارن الـ object بتلك النسخة ليعرف ما الذي غيّرته. AsNoTracking يخبر EF Core بتخطي هذه النسخة. تحصل على الـ objects، لكن EF Core ينساها فور خروجها من الـ query."
      },
      { t: "kv", rows: [
        { k: { en: "Entity", ar: "Entity" },
          v: { en: "A C# object that maps to one row in a database table — for example an Order object for one row of the Orders table.", ar: "object في C# يقابل صفاً واحداً في جدول قاعدة البيانات — مثلاً object من نوع Order يقابل صفاً في جدول Orders." } },
        { k: { en: "DbContext", ar: "DbContext" },
          v: { en: "The EF Core object you run queries through. It represents one unit of work and is normally created and thrown away once per HTTP request.", ar: "الـ object في EF Core الذي تنفّذ الاستعلامات من خلاله. يمثّل وحدة عمل واحدة، وعادة يُنشأ ويُرمى مرة واحدة لكل HTTP request." } },
        { k: { en: "Change tracker", ar: "Change tracker" },
          v: { en: "The part of DbContext that holds every loaded entity plus a snapshot of its original values, so SaveChanges can spot edits.", ar: "الجزء من DbContext الذي يحتفظ بكل entity محمّل مع snapshot لقيمه الأصلية، حتى يستطيع SaveChanges اكتشاف التعديلات." } },
        { k: { en: "Snapshot", ar: "Snapshot" },
          v: { en: "The saved copy of an entity's property values as they were when it was loaded. Comparing object against snapshot is how EF Core builds the UPDATE statement.", ar: "النسخة المحفوظة من قيم خصائص الـ entity كما كانت وقت التحميل. مقارنة الـ object بالـ snapshot هي طريقة EF Core في بناء جملة UPDATE." } },
        { k: { en: "Identity resolution", ar: "Identity resolution" },
          v: { en: "The rule that two rows with the same primary key become the same C# object in memory, not two separate objects.", ar: "القاعدة التي تجعل صفّين بنفس الـ primary key يصبحان نفس الـ object في الذاكرة، لا objectين منفصلين." } },
        { k: { en: "AsNoTracking", ar: "AsNoTracking" },
          v: { en: "A LINQ call that turns tracking off for one query. The returned entities are plain objects EF Core will not watch.", ar: "استدعاء LINQ يوقف الـ tracking لاستعلام واحد. الـ entities الراجعة تكون objects عادية لا يراقبها EF Core." } }
      ]},
      { t: "p",
        en: "Tracking exists because of a promise EF Core makes: load an object, change a property in ordinary C#, call SaveChanges, and the right UPDATE appears. Nothing in the language tells EF Core that order.Status = \"Shipped\" happened. The only way to know is to remember what the value was before.",
        ar: "الـ tracking موجود بسبب وعد يقدّمه EF Core: حمّل object، غيّر خاصية بكود C# عادي، استدعِ SaveChanges، وستظهر جملة UPDATE الصحيحة. لا شيء في اللغة يخبر EF Core أن السطر order.Status = \"Shipped\" قد حدث. الطريقة الوحيدة للمعرفة هي تذكّر القيمة السابقة."
      },
      { t: "p",
        en: "Think of a hotel cloakroom. You hand over a coat, the clerk writes down what it looked like, and keeps the note until you come back. That note is the snapshot. It is worth writing if you will return to claim the coat. If you are just walking past the counter to look at the coats and leave, every note the clerk writes is wasted paper. A read-only endpoint is walking past the counter.",
        ar: "تخيّل غرفة معاطف في فندق. تسلّم معطفاً، يكتب الموظف وصفه، ويحتفظ بالورقة حتى تعود. تلك الورقة هي الـ snapshot. كتابتها مفيدة إن كنت ستعود لاستلام المعطف. أما إن كنت تمرّ أمام الطاولة لتنظر إلى المعاطف ثم تغادر، فكل ورقة يكتبها الموظف هدر. الـ endpoint الذي يقرأ فقط هو المرور أمام الطاولة."
      },
      { t: "callout", kind: "note",
        en: "No-tracking changes nothing about the SQL sent to the database. The same SELECT runs either way. What changes is how much work EF Core does with the rows after they arrive, and how much memory it holds on to.",
        ar: "الـ no-tracking لا يغيّر شيئاً في الـ SQL المرسل لقاعدة البيانات. نفس جملة SELECT تُنفّذ في الحالتين. ما يتغيّر هو حجم العمل الذي يقوم به EF Core بالصفوف بعد وصولها، ومقدار الذاكرة التي يحتفظ بها."
      }
    ]},
    { key: "problem", blocks: [
      { t: "p",
        en: "Here is the running example for the whole lesson. An operations dashboard calls GET /api/orders?status=Shipped. The handler loads 5,000 Order rows with their Customer and their OrderLines, shapes them into a response, and returns JSON. Nothing is ever written back. The endpoint is a pure read.",
        ar: "هذا هو المثال الذي سنستخدمه في الدرس كله. لوحة تشغيل تستدعي GET /api/orders?status=Shipped. الـ handler يحمّل 5000 صفاً من Order مع الـ Customer والـ OrderLines، يحوّلها إلى response، ويرجع JSON. لا شيء يُكتب إلى قاعدة البيانات. الـ endpoint قراءة صافية."
      },
      { t: "code", lang: "csharp",
        label: { en: "The read-only handler, tracked by default", ar: "الـ handler للقراءة فقط، مع tracking افتراضي" },
        code: "// Every entity below is tracked, even though nothing is ever saved.\nvar orders = await db.Orders\n    .Where(o => o.Status == \"Shipped\")\n    .Include(o => o.Customer)\n    .Include(o => o.Lines)\n    .ToListAsync();\n\nreturn orders.Select(o => new OrderDto(o.Id, o.Customer.Name, o.Lines.Count));"
      },
      { t: "p",
        en: "5,000 orders, each with one customer and an average of four lines, means EF Core materialises about 25,000 entities. Materialise means: read the row, create the C# object, fill its properties. With tracking on, each of those 25,000 objects also gets a snapshot and an entry in a dictionary keyed by its primary key. That is 25,000 extra objects EF Core keeps alive until the DbContext is disposed at the end of the request.",
        ar: "5000 order، لكل واحد customer وأربعة lines في المتوسط، يعني أن EF Core ينشئ حوالي 25000 entity. الإنشاء يعني: قراءة الصف، إنشاء object في C#، وتعبئة خصائصه. مع تفعيل الـ tracking، كل واحد من هذه الـ 25000 object يحصل أيضاً على snapshot وعلى مدخل في dictionary مفتاحه الـ primary key. أي 25000 object إضافي يبقيها EF Core حيّة حتى يتم dispose للـ DbContext في نهاية الـ request."
      },
      { t: "kv", rows: [
        { k: { en: "Tracked, 5,000 orders", ar: "مع tracking، 5000 order" },
          v: { en: "Roughly 210 ms to materialise and about 48 MB allocated per request. \"Allocated\" means memory the request asks for and the garbage collector must later reclaim.", ar: "حوالي 210 ms للإنشاء وحوالي 48 MB مخصّصة لكل request. \"مخصّصة\" تعني ذاكرة يطلبها الـ request ويجب على الـ garbage collector استرجاعها لاحقاً." } },
        { k: { en: "No-tracking, same query", ar: "بدون tracking، نفس الاستعلام" },
          v: { en: "Roughly 120 ms and about 29 MB — around 40% less time and 40% less memory, with identical SQL and identical JSON output.", ar: "حوالي 120 ms و29 MB تقريباً — أقل بحوالي 40% في الوقت و40% في الذاكرة، بنفس الـ SQL ونفس مخرجات JSON." } },
        { k: { en: "What the numbers mean", ar: "ماذا تعني الأرقام" },
          v: { en: "The database did the same work both times. The whole difference is bookkeeping EF Core performed in your process for edits that never came.", ar: "قاعدة البيانات قامت بنفس العمل في الحالتين. الفرق كله هو حسابات أجراها EF Core داخل عمليتك من أجل تعديلات لم تحدث أبداً." } },
        { k: { en: "The knock-on effect", ar: "الأثر غير المباشر" },
          v: { en: "48 MB per request on a busy endpoint pushes objects into gen 2, the slowest garbage-collection generation to clean, so pauses get longer under load.", ar: "48 MB لكل request على endpoint مزدحم تدفع الـ objects إلى gen 2، وهو أبطأ جيل في الـ garbage collection من حيث التنظيف، فتطول التوقّفات تحت الحمل." } }
      ]},
      { t: "p",
        en: "Treat those figures as the shape of the result, not a promise. The exact numbers depend on how many properties each entity has, because the snapshot copies one value per property. Wide entities with 30 columns pay far more for tracking than narrow ones with 4.",
        ar: "اعتبر هذه الأرقام شكل النتيجة لا وعداً بها. القيم الدقيقة تعتمد على عدد خصائص كل entity، لأن الـ snapshot ينسخ قيمة لكل خاصية. الـ entities العريضة بـ 30 عموداً تدفع ثمناً أكبر بكثير للـ tracking من الضيّقة بـ 4 أعمدة."
      }
    ]},
    { key: "internals", blocks: [
      { t: "p",
        en: "Follow one row of our Orders query from the database to your handler and the difference becomes obvious. The query pipeline is the same until the row arrives; then tracking adds three steps that no-tracking skips entirely.",
        ar: "تابع صفاً واحداً من استعلام Orders من قاعدة البيانات إلى الـ handler ويصبح الفرق واضحاً. مسار الاستعلام واحد حتى يصل الصف؛ بعدها يضيف الـ tracking ثلاث خطوات يتخطاها الـ no-tracking تماماً."
      },
      { t: "kv", rows: [
        { k: { en: "1. Read the row", ar: "1. قراءة الصف" },
          v: { en: "EF Core pulls column values out of the open DbDataReader — the low-level cursor that streams rows back from SQL Server. Same in both modes.", ar: "يسحب EF Core قيم الأعمدة من الـ DbDataReader المفتوح — وهو المؤشر منخفض المستوى الذي يمرّر الصفوف من SQL Server. متطابق في الوضعين." } },
        { k: { en: "2. Build the object", ar: "2. بناء الـ object" },
          v: { en: "It creates an Order instance and assigns each property. Same in both modes.", ar: "ينشئ نسخة من Order ويسند كل خاصية. متطابق في الوضعين." } },
        { k: { en: "3. Look up identity", ar: "3. البحث عن الهوية" },
          v: { en: "Tracked only: it hashes the primary key and checks an internal dictionary for an entity with that key. Skipped when no-tracking.", ar: "مع الـ tracking فقط: يحسب hash للـ primary key ويبحث في dictionary داخلي عن entity بنفس المفتاح. يُتخطّى مع no-tracking." } },
        { k: { en: "4. Take the snapshot", ar: "4. أخذ الـ snapshot" },
          v: { en: "Tracked only: it copies every scalar property value into a parallel array stored beside the entity. Skipped when no-tracking.", ar: "مع الـ tracking فقط: ينسخ قيمة كل خاصية بسيطة إلى مصفوفة موازية تُحفظ بجانب الـ entity. يُتخطّى مع no-tracking." } },
        { k: { en: "5. Fix up relationships", ar: "5. ربط العلاقات" },
          v: { en: "Tracked only: it wires each OrderLine into its parent Order's Lines collection using the tracked graph. No-tracking does a simpler local version of this per query.", ar: "مع الـ tracking فقط: يربط كل OrderLine بمجموعة Lines في الـ Order الأب باستخدام الرسم المتتبَّع. الـ no-tracking يقوم بنسخة أبسط ومحلّية من هذا داخل كل استعلام." } }
      ]},
      { t: "p",
        en: "Step 4 is the expensive one and it is worth being precise about why. The snapshot is not a deep clone of the object; it is a flat array holding one entry per mapped scalar property. For an Order with 22 columns that is a 22-slot array per row, allocated 5,000 times. Add the dictionary entry from step 3 and each tracked entity costs roughly 150-250 extra bytes plus two extra object allocations.",
        ar: "الخطوة 4 هي الأغلى ويستحق الأمر توضيح السبب بدقة. الـ snapshot ليس نسخة عميقة من الـ object؛ إنه مصفوفة مسطّحة تحتوي مدخلاً لكل خاصية بسيطة مربوطة. لـ Order فيه 22 عموداً هذا يعني مصفوفة من 22 خانة لكل صف، تُخصَّص 5000 مرة. أضف مدخل الـ dictionary من الخطوة 3، فيكلّف كل entity متتبَّع حوالي 150-250 بايت إضافية مع تخصيصين إضافيين."
      },
      { t: "p",
        en: "The everyday analogy for step 3 is a coat-check ticket number. The clerk keeps a numbered rack so that if you hand in a second coat with the same ticket, he does not create a new hook — he points you at the hook you already have. That is identity resolution. With no-tracking there is no rack, so a customer that appears on 300 different orders is built 300 separate times as 300 distinct C# objects, each holding the same name.",
        ar: "التشبيه اليومي للخطوة 3 هو رقم تذكرة المعطف. الموظف يحتفظ برفّ مرقّم، فإذا سلّمت معطفاً ثانياً بنفس التذكرة لا ينشئ خطّافاً جديداً — بل يدلّك على الخطّاف الموجود. هذا هو الـ identity resolution. مع no-tracking لا يوجد رفّ، فالـ customer الذي يظهر في 300 order يُبنى 300 مرة منفصلة كـ 300 object مختلف، كلّها تحمل نفس الاسم."
      },
      { t: "code", lang: "csharp",
        label: { en: "The three read modes, and what each returns", ar: "أوضاع القراءة الثلاثة وما يرجعه كل منها" },
        code: "// 1. Tracked (default). Same customer row -> one shared object.\nvar a = await db.Orders.Include(o => o.Customer).ToListAsync();\nbool sharedA = ReferenceEquals(a[0].Customer, a[1].Customer); // true if same CustomerId\n\n// 2. No-tracking. Same customer row -> a separate object per order.\nvar b = await db.Orders.AsNoTracking().Include(o => o.Customer).ToListAsync();\nbool sharedB = ReferenceEquals(b[0].Customer, b[1].Customer); // false\n\n// 3. No-tracking with identity resolution: no snapshots, but duplicates are merged.\nvar c = await db.Orders.AsNoTrackingWithIdentityResolution()\n                       .Include(o => o.Customer).ToListAsync();\nbool sharedC = ReferenceEquals(c[0].Customer, c[1].Customer); // true\n\n// Projecting to a DTO never tracks: no entity type comes out of the query.\nvar d = await db.Orders.Select(o => new OrderDto(o.Id, o.Customer.Name)).ToListAsync();"
      },
      { t: "p",
        en: "Mode 3 is the middle option people forget. AsNoTrackingWithIdentityResolution keeps a small dictionary of keys so duplicate rows collapse into one object, but still skips the snapshot. It costs more than plain no-tracking and less than full tracking. Reach for it when a query joins in a lookup entity that repeats a lot, such as one Customer across hundreds of orders.",
        ar: "الوضع 3 هو الخيار الوسط الذي ينساه الناس. AsNoTrackingWithIdentityResolution يحتفظ بـ dictionary صغير للمفاتيح فتنكمش الصفوف المكرّرة إلى object واحد، لكنه يتخطى الـ snapshot. تكلفته أعلى من no-tracking العادي وأقل من الـ tracking الكامل. استخدمه حين يضمّ الاستعلام entity مرجعياً يتكرّر كثيراً، مثل customer واحد عبر مئات الـ orders."
      },
      { t: "p",
        en: "One detail that surprises people: a query that ends in Select and produces a DTO is never tracked at all. A DTO, short for data transfer object, is a plain class of your own that only carries the fields a response needs — it is not part of the EF Core model. AsNoTracking on such a query is harmless but does nothing, because EF Core only tracks objects whose type it recognises as an entity.",
        ar: "تفصيلة تفاجئ الناس: الاستعلام الذي ينتهي بـ Select وينتج DTO لا يُتتبَّع إطلاقاً. الـ DTO، أي data transfer object، هو class خاص بك يحمل فقط الحقول التي يحتاجها الـ response — وهو ليس جزءاً من model الخاص بـ EF Core. وضع AsNoTracking على مثل هذا الاستعلام غير ضارّ لكنه بلا أثر، لأن EF Core يتتبّع فقط الـ objects التي يعرف نوعها كـ entity."
      }
    ]},
    { key: "tradeoffs", blocks: [
      { t: "tradeoff",
        pros: {
          en: [
            "Cuts memory and materialisation time on large reads, often by a third or more.",
            "Removes the risk of an accidental edit being written by a later SaveChanges.",
            "Keeps a long-lived DbContext from growing without limit as it loads more rows.",
            "Costs one method call and needs no change to the SQL or the response shape."
          ],
          ar: [
            "يقلّل الذاكرة وزمن الإنشاء في القراءات الكبيرة، غالباً بالثلث أو أكثر.",
            "يزيل خطر كتابة تعديل عرضي عند استدعاء SaveChanges لاحقاً.",
            "يمنع DbContext طويل العمر من التضخّم بلا حدّ كلما حمّل صفوفاً أكثر.",
            "يكلّف استدعاء دالة واحدة ولا يحتاج تغيير الـ SQL أو شكل الـ response."
          ]
        },
        cons: {
          en: [
            "Edits to the returned objects are silently ignored by SaveChanges.",
            "Duplicate rows become duplicate objects, so a repeated Customer is built many times.",
            "Attaching a no-tracking entity back for an update needs extra, error-prone code.",
            "Applied as a blanket default, it breaks write endpoints in ways that pass all read tests."
          ],
          ar: [
            "التعديلات على الـ objects الراجعة يتجاهلها SaveChanges بصمت.",
            "الصفوف المكرّرة تصبح objects مكرّرة، فالـ Customer المتكرّر يُبنى مرات كثيرة.",
            "إعادة ربط entity غير متتبَّع للتحديث تحتاج كوداً إضافياً وقابلاً للخطأ.",
            "تطبيقه كإعداد افتراضي شامل يكسر endpoints الكتابة بطريقة تنجح معها كل اختبارات القراءة."
          ]
        },
        limits: {
          en: [
            "Does not change the SQL sent, so it never fixes a slow or badly indexed query.",
            "Has no effect on queries that project to a DTO — those were never tracked.",
            "Saves nothing measurable on small result sets of a few dozen rows.",
            "Does not prevent over-fetching; you still load every mapped column of the entity."
          ],
          ar: [
            "لا يغيّر الـ SQL المرسل، فهو لا يصلح استعلاماً بطيئاً أو سيّئ الـ indexing.",
            "بلا أثر على الاستعلامات التي تُسقط إلى DTO — تلك لم تكن متتبَّعة أصلاً.",
            "لا يوفّر شيئاً ملموساً على نتائج صغيرة من بضع عشرات الصفوف.",
            "لا يمنع جلب بيانات زائدة؛ ما زلت تحمّل كل عمود مربوط في الـ entity."
          ]
        },
        alts: {
          en: [
            "Select projection to a DTO — usually better, since it also cuts the columns fetched.",
            "AsNoTrackingWithIdentityResolution when duplicate related rows dominate the result.",
            "QueryTrackingBehavior.NoTracking on the context, with AsTracking() on write paths.",
            "Dapper or a raw SQL read for reporting endpoints that never touch the domain model."
          ],
          ar: [
            "الإسقاط بـ Select إلى DTO — عادة أفضل، لأنه يقلّل الأعمدة المجلوبة أيضاً.",
            "AsNoTrackingWithIdentityResolution حين تغلب الصفوف المرتبطة المكرّرة على النتيجة.",
            "ضبط QueryTrackingBehavior.NoTracking على الـ context مع AsTracking() في مسارات الكتابة.",
            "Dapper أو SQL خام لـ endpoints التقارير التي لا تلمس نموذج المجال."
          ]
        }
      }
    ]},
    { key: "mistakes", blocks: [
      { t: "mistake",
        title: { en: "Editing an entity that came back from a no-tracking query", ar: "تعديل entity راجع من استعلام no-tracking" },
        body: {
          en: "A developer copied AsNoTracking from the dashboard query into the order-cancel handler because it looked faster. The handler loaded the order, set Status to \"Cancelled\", and called SaveChanges. SaveChanges returned 0 and threw nothing, because EF Core had no snapshot for that object and therefore saw no change. Cancellations silently stopped working for two days until a customer complained.",
          ar: "نسخ مطوّر AsNoTracking من استعلام اللوحة إلى handler إلغاء الطلب لأنه بدا أسرع. الـ handler حمّل الـ order، ضبط Status إلى \"Cancelled\"، واستدعى SaveChanges. أرجع SaveChanges القيمة 0 ولم يرمِ أي استثناء، لأن EF Core لا يملك snapshot لذلك الـ object فلم يرَ أي تغيير. توقّف الإلغاء بصمت ليومين حتى اشتكى عميل."
        },
        fix: "// Read-then-write paths must stay tracked.\nvar order = await db.Orders.FirstAsync(o => o.Id == id);  // tracked\norder.Status = \"Cancelled\";\nvar rows = await db.SaveChangesAsync();\nif (rows == 0) throw new InvalidOperationException(\"Nothing was saved.\");"
      },
      { t: "mistake",
        title: { en: "Turning no-tracking on globally without marking the write paths", ar: "تفعيل no-tracking عالمياً دون تحديد مسارات الكتابة" },
        body: {
          en: "A team set QueryTrackingBehavior.NoTracking on the DbContext to fix a memory problem. Reads got faster and every read test passed. Three weeks later an audit found that a nightly job which adjusted stock levels had been saving nothing since the change. The setting is a good idea, but only when every write path is switched back on with AsTracking() in the same commit.",
          ar: "ضبط فريق QueryTrackingBehavior.NoTracking على الـ DbContext لحل مشكلة ذاكرة. صارت القراءات أسرع ونجحت كل اختبارات القراءة. بعد ثلاثة أسابيع كشف تدقيق أن مهمة ليلية تعدّل مستويات المخزون لم تحفظ شيئاً منذ التغيير. الإعداد فكرة جيدة، لكن فقط إذا أُعيد تفعيل الـ tracking بـ AsTracking() في كل مسار كتابة ضمن نفس الـ commit."
        },
        fix: "services.AddDbContext<AppDb>(o => o\n    .UseSqlServer(cs)\n    .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking));\n\n// then, in every handler that intends to write:\nvar order = await db.Orders.AsTracking().FirstAsync(o => o.Id == id);"
      },
      { t: "mistake",
        title: { en: "Assuming no-tracking makes the query itself faster", ar: "افتراض أن no-tracking يسرّع الاستعلام نفسه" },
        body: {
          en: "An endpoint took 4 seconds. Someone added AsNoTracking and it still took 3.9 seconds. The time was not in EF Core at all — the query filtered on a column with no index, so SQL Server scanned 8 million rows. No-tracking only removes work that happens after the rows arrive in your process. If the database is the bottleneck, it saves you almost nothing.",
          ar: "استغرق endpoint أربع ثوانٍ. أضاف أحدهم AsNoTracking فصار 3.9 ثانية. الوقت لم يكن في EF Core أصلاً — الاستعلام كان يرشّح على عمود بلا index، فمسح SQL Server ثمانية ملايين صف. الـ no-tracking يزيل فقط العمل الذي يحدث بعد وصول الصفوف إلى عمليتك. إذا كانت قاعدة البيانات هي عنق الزجاجة، فلن يوفّر لك شيئاً تقريباً."
        }
      },
      { t: "mistake",
        title: { en: "Comparing no-tracking objects by reference", ar: "مقارنة objects الـ no-tracking بالمرجع" },
        body: {
          en: "A deduplication routine built a HashSet<Customer> from the dashboard results to count distinct customers. With tracking it returned 180. After AsNoTracking was added it returned 5,000, because each order now carried its own Customer object and the default HashSet comparison is by object reference, not by Id. The count on the dashboard was wrong for a month and nobody noticed because it only got bigger.",
          ar: "روتين إزالة تكرار بنى HashSet<Customer> من نتائج اللوحة لعدّ العملاء المميّزين. مع الـ tracking أرجع 180. بعد إضافة AsNoTracking أرجع 5000، لأن كل order صار يحمل Customer خاصاً به، والمقارنة الافتراضية في HashSet بمرجع الـ object لا بالـ Id. كان الرقم على اللوحة خاطئاً لشهر ولم ينتبه أحد لأنه كان يكبر فقط."
        },
        fix: "// Compare by key, not by reference.\nvar distinct = orders.Select(o => o.Customer.Id).Distinct().Count();\n\n// Or keep the merging behaviour and skip only the snapshots:\nvar orders = await db.Orders.AsNoTrackingWithIdentityResolution()\n                            .Include(o => o.Customer).ToListAsync();"
      }
    ]},
    { key: "interview", blocks: [
      { t: "qa", level: "junior",
        q: { en: "What does AsNoTracking do?", ar: "ماذا يفعل AsNoTracking؟" },
        a: {
          en: "It tells EF Core not to remember the entities that come back from that query. Normally EF Core keeps a copy of each loaded object's original values so SaveChanges can work out what you changed. If the query is read-only, that copy is never used, so AsNoTracking skips making it. You get the same objects and the same SQL, just less memory and less work.",
          ar: "يخبر EF Core ألا يتذكّر الـ entities الراجعة من ذلك الاستعلام. عادة يحتفظ EF Core بنسخة من القيم الأصلية لكل object محمّل حتى يعرف SaveChanges ما الذي غيّرته. إذا كان الاستعلام للقراءة فقط فهذه النسخة لا تُستخدم أبداً، فيتخطّى AsNoTracking إنشاءها. تحصل على نفس الـ objects ونفس الـ SQL، بذاكرة وعمل أقل."
        }
      },
      { t: "qa", level: "mid",
        q: { en: "You added AsNoTracking and the endpoint got no faster. Why?", ar: "أضفت AsNoTracking ولم يتحسّن الـ endpoint. لماذا؟" },
        a: {
          en: "Because the time was probably spent in the database, not in EF Core. No-tracking changes nothing about the SQL — the same statement runs with the same plan. It only removes the snapshot and identity work done after rows arrive. So it helps when you materialise a lot of entities, and helps almost nothing when a single slow query is scanning a table. I would check the SQL Server execution time first and only then look at materialisation.",
          ar: "على الأرجح لأن الوقت كان يُقضى في قاعدة البيانات لا في EF Core. الـ no-tracking لا يغيّر الـ SQL — نفس الجملة تُنفَّذ بنفس الخطة. هو يزيل فقط عمل الـ snapshot والهوية بعد وصول الصفوف. لذلك يفيد حين تنشئ عدداً كبيراً من الـ entities، ولا يفيد تقريباً حين يكون استعلام واحد بطيء يمسح جدولاً. سأفحص زمن التنفيذ في SQL Server أولاً ثم أنظر في الإنشاء."
        }
      },
      { t: "qa", level: "mid",
        q: { en: "What is identity resolution and how does no-tracking change it?", ar: "ما هو identity resolution وكيف يغيّره الـ no-tracking؟" },
        a: {
          en: "With tracking on, EF Core keeps a dictionary keyed by primary key. If the same customer row comes back on 300 different orders, all 300 orders point at one shared Customer object. With no-tracking there is no dictionary, so you get 300 separate Customer objects with the same data. That matters if any of your code compares objects by reference or puts them in a HashSet. If I need both the memory saving and the merging, I use AsNoTrackingWithIdentityResolution.",
          ar: "مع تفعيل الـ tracking يحتفظ EF Core بـ dictionary مفتاحه الـ primary key. إذا رجع نفس صف العميل في 300 order، تشير الـ 300 كلها إلى object واحد مشترك من Customer. مع no-tracking لا يوجد dictionary، فتحصل على 300 object منفصل بنفس البيانات. هذا مهم إذا كان كودك يقارن بالمرجع أو يضع الـ objects في HashSet. إن أردت التوفير في الذاكرة والدمج معاً أستخدم AsNoTrackingWithIdentityResolution."
        }
      },
      { t: "qa", level: "senior",
        q: { en: "Would you set NoTracking as the default for the whole DbContext?", ar: "هل تجعل NoTracking الإعداد الافتراضي للـ DbContext كله؟" },
        a: {
          en: "Yes for a service that is mostly reads, but only with a safety net. The danger is that a write path silently stops saving: SaveChanges returns 0 and throws nothing. So I do three things in the same change. I add AsTracking() to every handler that writes. I add a test that asserts a known update actually persists. And I make write handlers check the row count from SaveChanges rather than ignore it. Without those, the setting trades a memory problem for a correctness problem.",
          ar: "نعم لخدمة معظمها قراءات، لكن مع شبكة أمان. الخطر أن يتوقّف مسار كتابة عن الحفظ بصمت: يرجع SaveChanges القيمة 0 دون أي استثناء. لذلك أفعل ثلاثة أشياء في نفس التغيير. أضيف AsTracking() لكل handler يكتب. أضيف اختباراً يتأكد أن تحديثاً معروفاً يُحفظ فعلاً. وأجعل handlers الكتابة تفحص عدد الصفوف الراجع من SaveChanges بدل تجاهله. بدون ذلك يستبدل الإعداد مشكلة ذاكرة بمشكلة صحّة بيانات."
        }
      },
      { t: "qa", level: "senior",
        q: { en: "No-tracking or a Select projection — which do you reach for first?", ar: "no-tracking أم إسقاط بـ Select — أيّهما تختار أولاً؟" },
        a: {
          en: "The projection, because it fixes more. AsNoTracking still fetches every mapped column and still builds a full entity per row. A Select that returns only the four fields the dashboard shows narrows the SQL, cuts network bytes, builds a smaller object, and is never tracked anyway. I use AsNoTracking when I genuinely need the whole entity graph — for example when a mapper or a domain method needs the real type — and a projection everywhere else.",
          ar: "الإسقاط، لأنه يعالج أكثر. AsNoTracking ما زال يجلب كل عمود مربوط وينشئ entity كاملاً لكل صف. أما Select يرجع الحقول الأربعة التي تعرضها اللوحة فيضيّق الـ SQL، ويقلّل البايتات على الشبكة، وينشئ object أصغر، وهو غير متتبَّع أصلاً. أستخدم AsNoTracking حين أحتاج فعلاً رسم الـ entity كاملاً — مثلاً حين يحتاج mapper أو دالة مجال النوع الحقيقي — وأستخدم الإسقاط في كل ما عداه."
        }
      },
      { t: "qa", level: "staff",
        q: { en: "How do you stop this class of bug from recurring across a large team?", ar: "كيف تمنع تكرار هذا النوع من الأخطاء في فريق كبير؟" },
        a: {
          en: "I stop relying on people remembering. I split the data access into two entry points: a read context configured with NoTracking and exposing only IQueryable reads, and a write context that stays tracked. A handler physically cannot save through the read context, so the mistake becomes a compile-time problem instead of a silent runtime one. Alongside that I add one integration test per write endpoint that saves and re-reads, and a lint rule flagging AsNoTracking in the same method as SaveChanges. The rule catches the copy-paste, the split catches everything else.",
          ar: "أتوقّف عن الاعتماد على ذاكرة الناس. أفصل الوصول للبيانات إلى مدخلين: context للقراءة مضبوط على NoTracking ويعرض قراءات IQueryable فقط، وcontext للكتابة يبقى متتبَّعاً. لا يستطيع الـ handler فعلياً الحفظ عبر context القراءة، فيتحوّل الخطأ إلى مشكلة وقت ترجمة بدل خطأ صامت وقت التشغيل. إلى جانب ذلك أضيف اختبار تكامل واحداً لكل endpoint كتابة يحفظ ثم يعيد القراءة، وقاعدة lint تنبّه عند وجود AsNoTracking في نفس الدالة مع SaveChanges. القاعدة تلتقط النسخ واللصق، والفصل يلتقط ما تبقّى."
        }
      }
    ]},
    { key: "codereview", blocks: [
      { t: "review", severity: "high",
        title: { en: "A write path reading through a no-tracking query", ar: "مسار كتابة يقرأ عبر استعلام no-tracking" },
        bad: "public async Task Cancel(int id)\n{\n    var order = await db.Orders\n        .AsNoTracking()\n        .FirstAsync(o => o.Id == id);\n\n    order.Status = \"Cancelled\";\n    await db.SaveChangesAsync();   // saves nothing, throws nothing\n}",
        good: "public async Task Cancel(int id)\n{\n    var order = await db.Orders.FirstAsync(o => o.Id == id);  // tracked\n\n    order.Status = \"Cancelled\";\n    var rows = await db.SaveChangesAsync();\n    if (rows != 1)\n        throw new InvalidOperationException($\"Cancel({id}) saved {rows} rows.\");\n}",
        why: {
          en: "Because the entity has no snapshot, SaveChanges sees nothing to compare and issues no UPDATE. It returns 0 and succeeds. Nothing in logs, metrics or tests looks wrong. Any method that loads an entity and later calls SaveChanges must read tracked, and should assert the row count so a future regression fails loudly.",
          ar: "لأن الـ entity بلا snapshot، لا يجد SaveChanges ما يقارنه فلا يصدر أي UPDATE. يرجع 0 وينجح. لا شيء في الـ logs أو المقاييس أو الاختبارات يبدو خاطئاً. أي دالة تحمّل entity ثم تستدعي SaveChanges يجب أن تقرأ مع tracking، ويُفضّل أن تتحقق من عدد الصفوف حتى يفشل أي انحدار مستقبلي بصوت عالٍ."
        }
      },
      { t: "review", severity: "medium",
        title: { en: "AsNoTracking on a query that already projects to a DTO", ar: "AsNoTracking على استعلام يُسقط أصلاً إلى DTO" },
        bad: "var rows = await db.Orders\n    .AsNoTracking()                     // no effect here\n    .Where(o => o.Status == \"Shipped\")\n    .Select(o => new OrderDto(o.Id, o.Customer.Name))\n    .ToListAsync();",
        good: "// Projection already avoids tracking. Drop the call, and let the projection\n// also narrow the columns EF Core asks the database for.\nvar rows = await db.Orders\n    .Where(o => o.Status == \"Shipped\")\n    .Select(o => new OrderDto(o.Id, o.Customer.Name))\n    .ToListAsync();",
        why: {
          en: "OrderDto is not an entity, so EF Core never tracked it. The extra call is dead code, and worse, it teaches readers that AsNoTracking is what makes projections cheap. The real saving comes from selecting two columns instead of every mapped column of Order and Customer.",
          ar: "الـ OrderDto ليس entity، فلم يتتبّعه EF Core أصلاً. الاستدعاء الزائد كود ميّت، والأسوأ أنه يعلّم القارئ أن AsNoTracking هو سبب رخص الإسقاط. التوفير الحقيقي يأتي من اختيار عمودين بدل كل عمود مربوط في Order وCustomer."
        }
      }
    ]},
    { key: "sysdesign", blocks: [
      { t: "p",
        en: "In a service that both serves dashboards and processes orders, the tracking decision usually settles into a split: one path that reads and never writes, and one that reads in order to write. Making that split explicit in the code is worth more than sprinkling AsNoTracking calls, because it turns a thing people must remember into a thing the type system enforces.",
        ar: "في خدمة تخدم لوحات العرض وتعالج الطلبات معاً، يستقرّ قرار الـ tracking عادة على انقسام: مسار يقرأ ولا يكتب، ومسار يقرأ لكي يكتب. جعل هذا الفصل صريحاً في الكود أفضل من نثر استدعاءات AsNoTracking، لأنه يحوّل أمراً يجب أن يتذكّره الناس إلى أمر يفرضه نظام الأنواع."
      },
      { t: "ul",
        en: [
          "Read-side context: registered with QueryTrackingBehavior.NoTracking and exposed as a read-only interface with no SaveChanges method on it.",
          "Write-side context: default tracking, used only inside command handlers that end in SaveChanges.",
          "Reporting and export endpoints: project straight to DTOs, or drop to raw SQL when the shape has nothing to do with the domain model.",
          "Background jobs that page through millions of rows: no-tracking is not optional there, because a tracked context grows with every page and never shrinks until it is disposed."
        ],
        ar: [
          "context جانب القراءة: مسجّل بـ QueryTrackingBehavior.NoTracking ومعروض كواجهة للقراءة فقط بلا دالة SaveChanges.",
          "context جانب الكتابة: tracking افتراضي، يُستخدم فقط داخل command handlers تنتهي بـ SaveChanges.",
          "endpoints التقارير والتصدير: تُسقط مباشرة إلى DTOs، أو تنزل إلى SQL خام حين لا علاقة للشكل بنموذج المجال.",
          "المهام الخلفية التي تمرّ على ملايين الصفوف: الـ no-tracking ليس اختيارياً هناك، لأن context متتبَّع ينمو مع كل صفحة ولا يتقلّص حتى يتم dispose له."
        ]
      },
      { t: "callout", kind: "warn",
        en: "The split only helps if the read context physically cannot save. If both sides are the same class and the difference is a convention in a wiki page, the bug comes back within a quarter.",
        ar: "الفصل يفيد فقط إذا كان context القراءة غير قادر فعلياً على الحفظ. إذا كان الطرفان نفس الـ class والفرق مجرد عُرف مكتوب في صفحة wiki، فسيعود الخطأ خلال ربع سنة."
      }
    ]},
    { key: "perf", blocks: [
      { t: "kv", rows: [
        { k: { en: "Memory", ar: "Memory" },
          v: { en: "The largest win. Each tracked entity costs a snapshot array plus a dictionary entry — roughly 150-250 extra bytes and two allocations per row. On our 25,000-entity query that is about 19 MB per request that no-tracking never allocates.", ar: "المكسب الأكبر. كل entity متتبَّع يكلّف مصفوفة snapshot ومدخل dictionary — حوالي 150-250 بايت إضافية وتخصيصين لكل صف. في استعلامنا ذي الـ 25000 entity هذا حوالي 19 MB لكل request لا يخصّصها الـ no-tracking إطلاقاً." } },
        { k: { en: "CPU", ar: "CPU" },
          v: { en: "Copying property values into the snapshot and hashing primary keys is per-row work. It scales linearly with rows loaded, which is why the saving is invisible at 50 rows and obvious at 50,000.", ar: "نسخ قيم الخصائص إلى الـ snapshot وحساب hash للمفاتيح عمل يتكرر لكل صف. يتناسب خطياً مع عدد الصفوف المحمّلة، ولذلك التوفير غير مرئي عند 50 صفاً وواضح عند 50000." } },
        { k: { en: "Latency", ar: "Latency" },
          v: { en: "On the dashboard query the p99 dropped from 380 ms to 240 ms — meaning the slowest 1 request in 100 got 140 ms faster. Most of that came from shorter garbage-collection pauses, not from the query.", ar: "في استعلام اللوحة انخفض الـ p99 من 380 ms إلى 240 ms — أي أن أبطأ request من كل 100 صار أسرع بـ 140 ms. معظم ذلك جاء من قصر توقّفات الـ garbage collection لا من الاستعلام." } },
        { k: { en: "Database", ar: "Database" },
          v: { en: "No change at all. Identical SQL, identical plan, identical rows returned. If the plan is bad, no-tracking will not save you.", ar: "لا تغيير إطلاقاً. نفس الـ SQL، نفس الخطة، نفس الصفوف الراجعة. إذا كانت الخطة سيّئة فلن ينقذك الـ no-tracking." } },
        { k: { en: "Scalability", ar: "Scalability" },
          v: { en: "Lower allocation per request means more concurrent requests fit in the same heap before gen 2 collections start dominating. On read-heavy services this is often the difference between 2 and 3 instances.", ar: "تخصيص أقل لكل request يعني استيعاب requests متزامنة أكثر في نفس الـ heap قبل أن تسيطر عمليات جمع gen 2. في الخدمات كثيفة القراءة هذا غالباً الفرق بين نسختين وثلاث نسخ من الخدمة." } }
      ]}
    ]},
    { key: "debug", blocks: [
      { t: "ul",
        en: [
          "db.ChangeTracker.Entries().Count() right after a query — the number of entities EF Core is holding. If a read-only handler reports 25,000, tracking is on where it should not be.",
          "db.ChangeTracker.DebugView.ShortView in the debugger — a text dump listing each tracked entity and its state (Unchanged, Modified, Added, Deleted). Use it to see whether your edit was noticed at all.",
          "The return value of SaveChangesAsync — the number of rows actually written. A 0 where you expected 1 is the classic no-tracking write bug.",
          "dotnet-counters monitor --counters System.Runtime — watch alloc-rate and gen-2-gc-count while hitting the endpoint. A fall in both after adding AsNoTracking confirms the saving is real.",
          "EF Core's logged SQL at LogLevel.Information — compare the statements before and after your change. They must be byte-identical; if they are not, something other than tracking changed."
        ],
        ar: [
          "db.ChangeTracker.Entries().Count() مباشرة بعد الاستعلام — عدد الـ entities التي يحتفظ بها EF Core. إذا أرجع handler للقراءة فقط الرقم 25000، فالـ tracking مفعّل حيث لا ينبغي.",
          "db.ChangeTracker.DebugView.ShortView في الـ debugger — نص يسرد كل entity متتبَّع وحالته (Unchanged أو Modified أو Added أو Deleted). استخدمه لترى هل لُوحظ تعديلك أصلاً.",
          "القيمة الراجعة من SaveChangesAsync — عدد الصفوف المكتوبة فعلاً. الرقم 0 مكان 1 المتوقّع هو الخطأ الكلاسيكي للكتابة مع no-tracking.",
          "dotnet-counters monitor --counters System.Runtime — راقب alloc-rate وgen-2-gc-count أثناء ضرب الـ endpoint. انخفاضهما بعد إضافة AsNoTracking يؤكد أن التوفير حقيقي.",
          "الـ SQL المسجّل من EF Core عند LogLevel.Information — قارن الجمل قبل التغيير وبعده. يجب أن تكون متطابقة تماماً؛ إن لم تكن، فقد تغيّر شيء آخر غير الـ tracking."
        ]
      },
      { t: "callout", kind: "tip",
        en: "Add a debug-build check in your request pipeline: after the response is written, if ChangeTracker.Entries().Any() is true on a GET request, log a warning with the endpoint name. It finds every read path that is still tracking, without anyone having to audit the code by hand.",
        ar: "أضف فحصاً في نسخة الـ debug داخل مسار الـ request: بعد كتابة الـ response، إذا كانت ChangeTracker.Entries().Any() صحيحة على request من نوع GET، سجّل تحذيراً باسم الـ endpoint. هذا يكشف كل مسار قراءة ما زال يتتبّع، دون أن يراجع أحد الكود يدوياً."
      }
    ]},
    { key: "realworld", blocks: [
      { t: "p",
        en: "The pattern shows up wherever a system reads far more than it writes, and where a single request can pull thousands of rows into memory. In those places the change tracker is not a small overhead — it is a second copy of the whole result set that nobody asked for.",
        ar: "يظهر هذا النمط في كل نظام يقرأ أكثر بكثير مما يكتب، وحيث يستطيع request واحد سحب آلاف الصفوف إلى الذاكرة. في تلك الحالات لا يكون الـ change tracker عبئاً صغيراً — بل نسخة ثانية من كامل نتيجة الاستعلام لم يطلبها أحد."
      },
      { t: "ul",
        en: [
          "Analytics and admin dashboards: one screen aggregates orders, users and payments for a date range, and never writes a single row.",
          "Data export and reporting jobs: paging through millions of rows to build a CSV, where a tracked context would grow until the process runs out of memory.",
          "Search and listing endpoints in e-commerce: product grids and filters that are read thousands of times per minute and written once a day by a catalogue import.",
          "Read replicas in a CQRS-style split — CQRS meaning reads and writes go through separate models: the query side is a different connection to a read-only database, so tracking has nothing it could ever save to."
        ],
        ar: [
          "لوحات التحليلات والإدارة: شاشة واحدة تجمّع orders وusers وpayments لفترة زمنية، ولا تكتب صفاً واحداً.",
          "مهام التصدير والتقارير: المرور على ملايين الصفوف لبناء ملف CSV، حيث ينمو context متتبَّع حتى تنفد ذاكرة العملية.",
          "endpoints البحث والعرض في التجارة الإلكترونية: شبكات المنتجات والفلاتر تُقرأ آلاف المرات في الدقيقة وتُكتب مرة يومياً عبر استيراد الكتالوج.",
          "الـ read replicas في فصل بأسلوب CQRS — أي أن القراءات والكتابات تمرّ عبر models منفصلة: جانب الاستعلام اتصال مختلف بقاعدة بيانات للقراءة فقط، فلا يوجد ما يمكن للـ tracking أن يحفظ إليه."
        ]
      }
    ]},
    { key: "exercises", blocks: [
      { t: "ex", diff: "easy",
        en: "Write an endpoint that loads 5,000 orders with Include for Customer and Lines, and log db.ChangeTracker.Entries().Count() straight after the query. Then add AsNoTracking and log it again. You are right when the first run prints a five-digit number and the second prints 0.",
        ar: "اكتب endpoint يحمّل 5000 order مع Include للـ Customer والـ Lines، وسجّل db.ChangeTracker.Entries().Count() مباشرة بعد الاستعلام. ثم أضف AsNoTracking وسجّل مرة أخرى. تكون قد نجحت حين تطبع المحاولة الأولى رقماً من خمس خانات وتطبع الثانية 0."
      },
      { t: "ex", diff: "medium",
        en: "Measure the same two runs with BenchmarkDotNet using [MemoryDiagnoser], which reports bytes allocated per call. Report time and allocated bytes for tracked, no-tracking, and a Select projection. You are right when the projection wins on both numbers and you can explain in one sentence why.",
        ar: "قِس نفس المحاولتين بـ BenchmarkDotNet مع [MemoryDiagnoser] الذي يبلّغ عن البايتات المخصّصة لكل استدعاء. أورد الزمن والبايتات للـ tracked وللـ no-tracking وللإسقاط بـ Select. تكون قد نجحت حين يتفوّق الإسقاط في الرقمين وتستطيع شرح السبب في جملة واحدة."
      },
      { t: "ex", diff: "hard",
        en: "Reproduce the silent-write bug on purpose: load an order with AsNoTracking, change a property, call SaveChangesAsync, and assert that it returns 0 and the database row is unchanged. Then make it fail loudly instead — either by re-reading tracked, or by attaching the entity and marking the property modified. Explain in a comment which approach you would ship and why.",
        ar: "أعد إنتاج خطأ الكتابة الصامتة عمداً: حمّل order بـ AsNoTracking، غيّر خاصية، استدعِ SaveChangesAsync، وتأكّد أنه يرجع 0 وأن الصف في قاعدة البيانات لم يتغيّر. ثم اجعله يفشل بصوت عالٍ — إما بإعادة القراءة مع tracking أو بربط الـ entity وتحديد الخاصية كمعدَّلة. اشرح في تعليق أي الطريقتين ستطلقها ولماذا."
      },
      { t: "ex", diff: "senior",
        en: "Split your data access into a read context registered with QueryTrackingBehavior.NoTracking behind an interface with no SaveChanges, and a tracked write context. Migrate three endpoints onto the split. You are right when an attempt to save through the read interface fails to compile, and every existing integration test still passes unchanged.",
        ar: "افصل الوصول للبيانات إلى context للقراءة مسجّل بـ QueryTrackingBehavior.NoTracking خلف واجهة بلا SaveChanges، وcontext للكتابة متتبَّع. انقل ثلاثة endpoints إلى هذا الفصل. تكون قد نجحت حين تفشل محاولة الحفظ عبر واجهة القراءة في وقت الترجمة، وتظل كل اختبارات التكامل الحالية ناجحة دون تعديل."
      }
    ]},
    { key: "refs", blocks: [
      { t: "ref",
        label: { en: "EF Core — Tracking vs. no-tracking queries", ar: "EF Core — الاستعلامات المتتبَّعة مقابل غير المتتبَّعة" },
        url: "https://learn.microsoft.com/en-us/ef/core/querying/tracking",
        meta: { en: "Docs", ar: "توثيق" }
      },
      { t: "ref",
        label: { en: "EF Core — Identity resolution in the change tracker", ar: "EF Core — Identity resolution في الـ change tracker" },
        url: "https://learn.microsoft.com/en-us/ef/core/change-tracking/identity-resolution",
        meta: { en: "Docs", ar: "توثيق" }
      },
      { t: "ref",
        label: { en: "EF Core — Change tracking overview", ar: "EF Core — نظرة عامة على تتبّع التغييرات" },
        url: "https://learn.microsoft.com/en-us/ef/core/change-tracking/",
        meta: { en: "Docs", ar: "توثيق" }
      },
      { t: "ref",
        label: { en: "EF Core — Efficient querying guidance", ar: "EF Core — إرشادات الاستعلام الفعّال" },
        url: "https://learn.microsoft.com/en-us/ef/core/performance/efficient-querying",
        meta: { en: "Docs", ar: "توثيق" }
      }
    ]}
  ],
  quiz: [
    {
      q: { en: "What does the change tracker actually store for each loaded entity?", ar: "ماذا يخزّن الـ change tracker فعلياً لكل entity محمّل؟" },
      options: [
        { en: "A copy of the SQL that loaded it", ar: "نسخة من الـ SQL الذي حمّله" },
        { en: "A snapshot of its original property values plus an entry keyed by its primary key", ar: "snapshot لقيم خصائصه الأصلية ومدخلاً مفتاحه الـ primary key" },
        { en: "A database lock held until SaveChanges runs", ar: "قفلاً في قاعدة البيانات يبقى حتى ينفَّذ SaveChanges" },
        { en: "A serialized JSON copy of the whole object graph", ar: "نسخة JSON مسلسلة من رسم الـ objects كاملاً" }
      ],
      correct: 1,
      why: { en: "The snapshot is a flat array of the scalar values as loaded; the dictionary entry is what makes identity resolution work. Comparing object to snapshot at SaveChanges is how the UPDATE is built. No locks are held and nothing is serialized.", ar: "الـ snapshot مصفوفة مسطّحة للقيم البسيطة كما حُمّلت؛ ومدخل الـ dictionary هو ما يجعل الـ identity resolution يعمل. مقارنة الـ object بالـ snapshot عند SaveChanges هي طريقة بناء جملة UPDATE. لا تُحجز أي أقفال ولا يُسلسل شيء." }
    },
    {
      q: { en: "You add AsNoTracking to a query. What happens to the SQL sent to the database?", ar: "أضفت AsNoTracking إلى استعلام. ماذا يحدث للـ SQL المرسل إلى قاعدة البيانات؟" },
      options: [
        { en: "It becomes a simpler SELECT with fewer columns", ar: "يصبح SELECT أبسط بأعمدة أقل" },
        { en: "It gains a READ UNCOMMITTED hint", ar: "يكتسب تلميح READ UNCOMMITTED" },
        { en: "It is unchanged — only in-process work after the rows arrive is skipped", ar: "لا يتغيّر — يُتخطّى فقط العمل داخل العملية بعد وصول الصفوف" },
        { en: "It is split into one query per Include", ar: "ينقسم إلى استعلام لكل Include" }
      ],
      correct: 2,
      why: { en: "No-tracking is purely a client-side setting. The same statement runs with the same plan and returns the same rows; EF Core just skips snapshotting and identity lookup while building the objects.", ar: "الـ no-tracking إعداد على جانب العميل فقط. نفس الجملة تُنفَّذ بنفس الخطة وترجع نفس الصفوف؛ EF Core يتخطّى فقط الـ snapshot والبحث عن الهوية أثناء بناء الـ objects." }
    },
    {
      q: { en: "A handler loads an order with AsNoTracking, sets Status, and calls SaveChangesAsync. What happens?", ar: "handler يحمّل order بـ AsNoTracking، يضبط Status، ويستدعي SaveChangesAsync. ماذا يحدث؟" },
      options: [
        { en: "SaveChanges returns 0 and no exception is thrown", ar: "يرجع SaveChanges القيمة 0 ولا يُرمى أي استثناء" },
        { en: "An InvalidOperationException is thrown", ar: "يُرمى استثناء InvalidOperationException" },
        { en: "The update runs normally", ar: "ينفَّذ التحديث بشكل طبيعي" },
        { en: "A DbUpdateConcurrencyException is thrown", ar: "يُرمى استثناء DbUpdateConcurrencyException" }
      ],
      correct: 0,
      why: { en: "With no snapshot, EF Core has nothing to compare the object against, so it detects no change and issues no statement. The call succeeds and reports 0 rows written — which is why this bug is silent and can survive for weeks.", ar: "بلا snapshot لا يملك EF Core ما يقارن به الـ object، فلا يكتشف أي تغيير ولا يصدر أي جملة. ينجح الاستدعاء ويبلّغ عن 0 صف مكتوب — ولهذا يكون هذا الخطأ صامتاً وقد يعيش أسابيع." }
    },
    {
      q: { en: "Ten orders share the same CustomerId. With plain AsNoTracking and Include(o => o.Customer), how many Customer objects exist in memory?", ar: "عشرة orders تشترك في نفس الـ CustomerId. مع AsNoTracking العادي و Include(o => o.Customer)، كم object من Customer يوجد في الذاكرة؟" },
      options: [
        { en: "One shared object", ar: "object واحد مشترك" },
        { en: "Ten separate objects", ar: "عشرة objects منفصلة" },
        { en: "Zero — the customer is not loaded", ar: "صفر — الـ customer لا يُحمّل" },
        { en: "One object plus nine proxies pointing at it", ar: "object واحد وتسعة proxies تشير إليه" }
      ],
      correct: 1,
      why: { en: "Identity resolution needs the tracker's key dictionary, which plain no-tracking skips. Each order therefore builds its own Customer. Use AsNoTrackingWithIdentityResolution to get one shared object while still skipping snapshots.", ar: "الـ identity resolution يحتاج dictionary المفاتيح في الـ tracker، وهو ما يتخطاه الـ no-tracking العادي. لذلك يبني كل order Customer خاصاً به. استخدم AsNoTrackingWithIdentityResolution للحصول على object واحد مشترك مع تخطّي الـ snapshots." }
    },
    {
      q: { en: "Which query benefits least from adding AsNoTracking?", ar: "أي استعلام يستفيد أقل من إضافة AsNoTracking؟" },
      options: [
        { en: "One loading 50,000 entities with two Includes", ar: "استعلام يحمّل 50000 entity مع Include اثنين" },
        { en: "One paging through millions of rows in a background export", ar: "استعلام يمرّ على ملايين الصفوف في مهمة تصدير خلفية" },
        { en: "One ending in Select(o => new OrderDto(...))", ar: "استعلام ينتهي بـ Select(o => new OrderDto(...))" },
        { en: "One loading 20,000 wide entities with 30 columns each", ar: "استعلام يحمّل 20000 entity عريضاً بـ 30 عموداً لكل منها" }
      ],
      correct: 2,
      why: { en: "A projection produces OrderDto, which is not an entity in the model, so EF Core never tracked it in the first place. AsNoTracking there is harmless dead code. The other three materialise many entities and save real memory.", ar: "الإسقاط ينتج OrderDto وهو ليس entity في الـ model، فلم يتتبّعه EF Core أصلاً. وضع AsNoTracking هناك كود ميّت غير ضارّ. أما الثلاثة الأخرى فتنشئ entities كثيرة وتوفّر ذاكرة حقيقية." }
    }
  ]
};
```

NEXT: ef-n1
