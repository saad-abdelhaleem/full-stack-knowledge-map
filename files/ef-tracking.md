```js
const efTrackingLesson = {
  id: "ef-tracking",
  moduleId: "efcore",
  title: { en: "How the tracker works", ar: "كيف يعمل الـ tracker" },
  summary: {
    en: "EF Core remembers every entity it hands you and compares it to a saved copy, so SaveChanges can write only what you actually changed.",
    ar: "EF Core يتذكر كل entity يعطيك إياه ويقارنه بنسخة محفوظة، فيكتب SaveChanges ما غيّرته أنت فقط."
  },
  mins: 18,
  sections: [
    {
      key: "why",
      blocks: [
        { t: "p",
          en: "Change tracking is how EF Core turns normal C# object edits into SQL. You load an Order, set order.Status = \"Shipped\", call SaveChanges, and an UPDATE statement appears. Nobody wrote that SQL. EF wrote it because it kept a copy of the row as it looked when it was loaded, and compared that copy to the object in memory.",
          ar: "الـ change tracking هو الطريقة التي يحوّل بها EF Core تعديلاتك العادية على الكائنات إلى SQL. تحمّل Order، تكتب order.Status = \"Shipped\"، تستدعي SaveChanges، فيظهر UPDATE statement. لم يكتبه أحد. EF كتبه لأنه احتفظ بنسخة من الصف كما كان وقت التحميل، ثم قارن تلك النسخة بالكائن في الذاكرة."
        },
        { t: "kv", rows: [
          { k: { en: "DbContext", ar: "DbContext" },
            v: { en: "The object you use to query and save. It also holds the tracker. Normally you create one per HTTP request and dispose it at the end.", ar: "الكائن الذي تستعلم وتحفظ من خلاله. يحمل أيضاً الـ tracker. عادةً تنشئ واحداً لكل HTTP request وتتخلص منه في النهاية." } },
          { k: { en: "Entity", ar: "Entity" },
            v: { en: "A plain C# object that maps to one row in a table — for example an Order object mapped to one row in the Orders table.", ar: "كائن C# عادي يقابل صفاً واحداً في جدول — مثلاً كائن Order يقابل صفاً في جدول Orders." } },
          { k: { en: "Change tracker", ar: "Change tracker" },
            v: { en: "A list inside the DbContext of every entity it loaded or was told about, plus what it knows about each one.", ar: "قائمة داخل الـ DbContext بكل entity حمّله أو أُخبر به، مع ما يعرفه عن كل واحد." } },
          { k: { en: "Snapshot", ar: "Snapshot" },
            v: { en: "The private copy of the entity's property values taken at load time. This is the \"before\" picture used for comparison.", ar: "النسخة الخاصة من قيم خصائص الـ entity المأخوذة وقت التحميل. هي صورة \"قبل\" المستخدمة في المقارنة." } },
          { k: { en: "Entity state", ar: "Entity state" },
            v: { en: "One label per tracked entity: Added, Modified, Deleted, Unchanged or Detached. It decides which SQL statement (if any) gets written.", ar: "تسمية واحدة لكل entity متتبَّع: Added أو Modified أو Deleted أو Unchanged أو Detached. هي التي تحدد أي SQL statement سيُكتب، إن وُجد." } },
          { k: { en: "SaveChanges", ar: "SaveChanges" },
            v: { en: "The method that compares every tracked entity to its snapshot, generates INSERT/UPDATE/DELETE, and sends them in one transaction.", ar: "الميثود التي تقارن كل entity متتبَّع بالـ snapshot الخاص به، تولّد INSERT/UPDATE/DELETE، وترسلها في transaction واحدة." } }
        ]},
        { t: "p",
          en: "Before this existed, teams wrote the UPDATE by hand for every field that might change. That is fine for one field and painful for twenty: you either update all twenty columns every time, or you write branching code that builds the SQL string from what changed. Both are easy to get wrong, and both leak database details into business code.",
          ar: "قبل وجود هذا، كانت الفرق تكتب UPDATE يدوياً لكل حقل قد يتغيّر. هذا مقبول مع حقل واحد ومؤلم مع عشرين: إما تحدّث الأعمدة العشرين كل مرة، أو تكتب كوداً متفرعاً يبني نص الـ SQL مما تغيّر. كلا الطريقين سهل الخطأ، وكلاهما يسرّب تفاصيل الـ database إلى كود الـ business."
        },
        { t: "p",
          en: "The everyday analogy: a clerk photocopies your form before handing it to you. You fill in two boxes and hand it back. The clerk lays the photocopy next to your version, sees only those two boxes differ, and types just those two into the system. The photocopy is the snapshot. The comparison is DetectChanges. Typing them in is the UPDATE.",
          ar: "التشبيه اليومي: موظف يصوّر استمارتك قبل أن يعطيك إياها. تملأ خانتين وتعيدها. يضع الموظف الصورة بجانب نسختك، يرى أن الخانتين فقط مختلفتان، فيُدخل هاتين الخانتين إلى النظام. الصورة هي الـ snapshot، والمقارنة هي DetectChanges، والإدخال هو الـ UPDATE."
        },
        { t: "callout", kind: "note",
          en: "The tracker is per DbContext instance, not global. Two DbContext objects loading the same order row give you two separate objects, each with its own snapshot, that know nothing about each other.",
          ar: "الـ tracker خاص بكل instance من DbContext، وليس عاماً. لو حمّل كائنا DbContext نفس صف الـ order، ستحصل على كائنين منفصلين، لكل واحد snapshot خاص، ولا يعرف أحدهما عن الآخر شيئاً."
        }
      ]
    },
    {
      key: "problem",
      blocks: [
        { t: "p",
          en: "Take one concrete endpoint that we will follow through the whole lesson: PATCH /orders/{id}/status, which changes an order's status and nothing else. The Orders table has 18 columns, including a Notes column that can hold a few kilobytes of text.",
          ar: "خذ endpoint واحداً محدداً سنتابعه طوال الدرس: PATCH /orders/{id}/status، الذي يغيّر status الـ order ولا شيء غيره. جدول Orders فيه 18 عموداً، من بينها عمود Notes قد يحمل بضعة كيلوبايت من النص."
        },
        { t: "kv", rows: [
          { k: { en: "Hand-written SQL, all columns", ar: "SQL مكتوب يدوياً، كل الأعمدة" },
            v: { en: "One UPDATE that sets all 18 columns. It works, but it rewrites Notes too — so if another request changed Notes one second ago, this request silently overwrites it with the older value.", ar: "UPDATE واحد يضبط الأعمدة الـ 18 كلها. يعمل، لكنه يعيد كتابة Notes أيضاً — فإذا غيّر request آخر قيمة Notes قبل ثانية، فهذا الـ request يستبدلها بصمت بالقيمة الأقدم." } },
          { k: { en: "Hand-written SQL, one column", ar: "SQL مكتوب يدوياً، عمود واحد" },
            v: { en: "Correct and fast, but you now need a separate hand-written statement for every combination of fields any endpoint might change.", ar: "صحيح وسريع، لكنك الآن تحتاج statement منفصلاً مكتوباً يدوياً لكل تركيبة حقول قد يغيّرها أي endpoint." } },
          { k: { en: "EF Core with tracking", ar: "EF Core مع tracking" },
            v: { en: "You write order.Status = \"Shipped\" and SaveChanges emits UPDATE Orders SET Status = @p0 WHERE Id = @p1. One column, because only one changed.", ar: "تكتب order.Status = \"Shipped\" فيصدر SaveChanges الأمر UPDATE Orders SET Status = @p0 WHERE Id = @p1. عمود واحد، لأن واحداً فقط تغيّر." } }
        ]},
        { t: "p",
          en: "The same mechanism costs you on the read path. A reporting endpoint that loads 20,000 orders with tracking on must build 20,000 snapshots — a second full copy of every property of every row. On a real service this measured 1.9 seconds and about 180 MB of memory. The same query with tracking turned off measured 0.4 seconds and about 60 MB. Same rows, same SQL: the difference is only the bookkeeping EF does for changes that this endpoint will never make.",
          ar: "نفس الآلية تكلّفك في مسار القراءة. endpoint تقارير يحمّل 20,000 order مع تشغيل الـ tracking يجب أن يبني 20,000 snapshot — نسخة ثانية كاملة من كل خاصية في كل صف. على خدمة حقيقية قيس هذا بـ 1.9 ثانية وحوالي 180 ميغابايت من الذاكرة. نفس الاستعلام مع إيقاف الـ tracking قيس بـ 0.4 ثانية وحوالي 60 ميغابايت. نفس الصفوف ونفس الـ SQL: الفرق هو فقط الدفاتر التي يمسكها EF لتغييرات لن يجريها هذا الـ endpoint أبداً."
        },
        { t: "p",
          en: "So the rule the rest of the lesson builds on is simple: tracking is a write-path feature that you pay for on every path unless you turn it off. Understanding exactly what it does tells you when that payment is worth it.",
          ar: "إذن القاعدة التي يُبنى عليها بقية الدرس بسيطة: الـ tracking ميزة لمسار الكتابة، لكنك تدفع ثمنها في كل مسار ما لم توقفها. فهم ما تفعله بالضبط يخبرك متى يستحق هذا الثمن."
        }
      ]
    },
    {
      key: "internals",
      blocks: [
        { t: "p",
          en: "Follow one request through the tracker, step by step. The request is PATCH /orders/42/status with body { \"status\": \"Shipped\" }.",
          ar: "تابع request واحداً عبر الـ tracker خطوة بخطوة. الـ request هو PATCH /orders/42/status مع body فيه { \"status\": \"Shipped\" }."
        },
        { t: "kv", rows: [
          { k: { en: "1. Query runs", ar: "1. تنفيذ الاستعلام" },
            v: { en: "context.Orders.FindAsync(42) sends SELECT ... WHERE Id = 42 and gets one row back from SQL Server.", ar: "context.Orders.FindAsync(42) يرسل SELECT ... WHERE Id = 42 ويستقبل صفاً واحداً من SQL Server." } },
          { k: { en: "2. Materialization", ar: "2. Materialization" },
            v: { en: "EF creates the Order object and copies each column value into the matching property. \"Materialization\" just means turning a row into an object.", ar: "ينشئ EF كائن Order وينسخ قيمة كل عمود إلى الخاصية المقابلة. \"Materialization\" تعني ببساطة تحويل صف إلى كائن." } },
          { k: { en: "3. Identity map check", ar: "3. فحص الـ identity map" },
            v: { en: "The identity map is a dictionary inside the tracker keyed by primary key. If Order 42 is already there, EF returns the existing object instead of a second one.", ar: "الـ identity map هو dictionary داخل الـ tracker مفتاحه الـ primary key. لو كان Order 42 موجوداً فيه، يعيد EF الكائن الموجود بدل إنشاء ثانٍ." } },
          { k: { en: "4. Snapshot taken", ar: "4. أخذ الـ snapshot" },
            v: { en: "EF stores a second copy of all 18 property values next to the entry, and marks the state Unchanged.", ar: "يخزّن EF نسخة ثانية من قيم الخصائص الـ 18 بجانب الـ entry، ويضع الحالة Unchanged." } },
          { k: { en: "5. You mutate", ar: "5. أنت تعدّل" },
            v: { en: "order.Status = \"Shipped\" changes the object only. Nothing is sent to the database and the state is still Unchanged at this moment.", ar: "order.Status = \"Shipped\" يغيّر الكائن فقط. لا شيء يُرسل إلى الـ database والحالة ما زالت Unchanged في هذه اللحظة." } },
          { k: { en: "6. DetectChanges", ar: "6. DetectChanges" },
            v: { en: "SaveChanges first walks every tracked entity and compares each property to its snapshot. Status differs, so the entry becomes Modified with Status marked as the changed property.", ar: "يمشي SaveChanges أولاً على كل entity متتبَّع ويقارن كل خاصية بالـ snapshot. Status مختلف، فتصبح الحالة Modified مع تعليم Status كخاصية متغيّرة." } },
          { k: { en: "7. SQL generated and sent", ar: "7. توليد الـ SQL وإرساله" },
            v: { en: "One UPDATE touching only the changed columns, inside a transaction, then the snapshot is refreshed and the state goes back to Unchanged.", ar: "UPDATE واحد يمسّ الأعمدة المتغيّرة فقط، داخل transaction، ثم يُحدَّث الـ snapshot وتعود الحالة إلى Unchanged." } }
        ]},
        { t: "p",
          en: "The important part of step 6 is that EF does not know you changed anything until it looks. There is no event, no interception of the property setter on a normal class. The tracker is passive: it holds the before-picture and compares on demand. That is why the work happens all at once inside SaveChanges rather than at the moment you typed the assignment.",
          ar: "الجزء المهم في الخطوة 6 هو أن EF لا يعرف أنك غيّرت شيئاً حتى ينظر. لا يوجد event ولا اعتراض لـ property setter في class عادي. الـ tracker سلبي: يحتفظ بصورة \"قبل\" ويقارن عند الطلب. لذلك يحدث العمل كله دفعة واحدة داخل SaveChanges، لا في لحظة كتابتك للإسناد."
        },
        { t: "p",
          en: "Back to the clerk analogy: the clerk does not watch you write. He only compares the two sheets when you hand the form back. Handing it back is SaveChanges. If you never hand it back, nothing reaches the system no matter how much you wrote.",
          ar: "عودة إلى تشبيه الموظف: الموظف لا يراقبك وأنت تكتب. يقارن الورقتين فقط عندما تعيد الاستمارة. الإعادة هي SaveChanges. إن لم تُعِدها، لا يصل شيء إلى النظام مهما كتبت."
        },
        { t: "code", lang: "csharp", label: { en: "Watching the state change", ar: "مراقبة تغيّر الحالة" },
          code: "var order = await context.Orders.FindAsync(42);\n\n// EF loaded it and took a snapshot. Nothing changed yet.\nConsole.WriteLine(context.Entry(order).State);   // Unchanged\n\norder.Status = \"Shipped\";\n\n// Still Unchanged: EF has not compared anything yet.\nConsole.WriteLine(context.Entry(order).State);   // Unchanged\n\n// DetectChanges runs here and flips the state.\ncontext.ChangeTracker.DetectChanges();\nConsole.WriteLine(context.Entry(order).State);   // Modified\n\n// Which properties EF thinks changed:\nforeach (var p in context.Entry(order).Properties.Where(p => p.IsModified))\n    Console.WriteLine(p.Metadata.Name);          // Status\n\nawait context.SaveChangesAsync();\n// UPDATE [Orders] SET [Status] = @p0 WHERE [Id] = @p1;\nConsole.WriteLine(context.Entry(order).State);   // Unchanged again"
        },
        { t: "p",
          en: "DetectChanges is called for you before SaveChanges, and also before most queries and before ChangeTracker.Entries(). Its cost is proportional to tracked entities times properties each. With 20 tracked entities that is invisible. With 20,000 tracked entities, and a loop that triggers it once per iteration, you get 20,000 full scans of 20,000 entities — quadratic work that turns a one-second job into minutes.",
          ar: "يُستدعى DetectChanges نيابةً عنك قبل SaveChanges، وأيضاً قبل معظم الاستعلامات وقبل ChangeTracker.Entries(). تكلفته تتناسب مع عدد الـ entities المتتبَّعة مضروباً في عدد خصائص كل واحد. مع 20 entity لا تُلاحَظ. مع 20,000 entity، وحلقة تطلقه مرة في كل دورة، تحصل على 20,000 مسح كامل لـ 20,000 entity — عمل تربيعي يحوّل مهمة من ثانية إلى دقائق."
        },
        { t: "p",
          en: "Two details change the picture. First, entities with change-tracking proxies — classes whose properties are virtual, wrapped by EF in a generated subclass — report changes immediately, so DetectChanges has nothing to scan. Second, an entity you did not load, for example one deserialized from JSON, is Detached: the tracker has never seen it and has no snapshot for it, which is where the next section's problems start.",
          ar: "تفصيلان يغيّران الصورة. الأول: الـ entities التي تستخدم change-tracking proxies — أي classes خصائصها virtual ويغلّفها EF بـ subclass مولَّد — تبلّغ عن التغيير فوراً، فلا يبقى لـ DetectChanges ما يمسحه. الثاني: أي entity لم تحمّله أنت، مثلاً كائن ناتج عن deserialization لـ JSON، يكون Detached: الـ tracker لم يره قط ولا يملك له snapshot، ومن هنا تبدأ مشاكل القسم التالي."
        }
      ]
    },
    {
      key: "tradeoffs",
      blocks: [
        { t: "tradeoff",
          pros: {
            en: [
              "Writes only the columns that changed, so two requests editing different fields of the same row do not overwrite each other.",
              "Business code stays plain C#: set a property, save. No SQL string building.",
              "The identity map guarantees one object per row per DbContext, so two parts of the same request always see the same order object.",
              "Related objects added to a tracked entity's collection are saved automatically, in the right order, in one transaction."
            ],
            ar: [
              "يكتب الأعمدة المتغيّرة فقط، فلا يدهس request بيانات request آخر يعدّل حقولاً مختلفة من نفس الصف.",
              "كود الـ business يبقى C# عادياً: اضبط خاصية، احفظ. بلا بناء نصوص SQL.",
              "الـ identity map يضمن كائناً واحداً لكل صف داخل كل DbContext، فيرى جزآن من نفس الـ request نفس كائن الـ order.",
              "الكائنات المرتبطة المضافة إلى collection لـ entity متتبَّع تُحفظ تلقائياً، بالترتيب الصحيح، في transaction واحدة."
            ]
          },
          cons: {
            en: [
              "Every loaded entity costs a second copy of its data in memory for the snapshot.",
              "DetectChanges scans all tracked entities, so cost grows with how much you loaded, not with how much you changed.",
              "Changes are invisible until SaveChanges, which hides mistakes until later in the request.",
              "An accidental mutation anywhere in the request gets saved along with the intended one."
            ],
            ar: [
              "كل entity محمّل يكلّف نسخة ثانية من بياناته في الذاكرة من أجل الـ snapshot.",
              "DetectChanges يمسح كل الـ entities المتتبَّعة، فالتكلفة تنمو مع حجم ما حمّلته لا مع حجم ما غيّرته.",
              "التغييرات غير مرئية حتى SaveChanges، ما يخفي الأخطاء إلى وقت لاحق من الـ request.",
              "أي تعديل غير مقصود في أي مكان من الـ request يُحفظ مع التعديل المقصود."
            ]
          },
          limits: {
            en: [
              "Tracking only works inside one DbContext instance; it does not span requests or servers.",
              "It cannot see changes another user made to the same row after you loaded it — that needs a concurrency token, a version column EF adds to the WHERE clause so a stale update fails instead of winning.",
              "Detached objects (from JSON, from a cache) have no snapshot, so EF cannot tell what changed in them.",
              "It does not batch unlimited work: thousands of tracked changes in one SaveChanges still means thousands of statements."
            ],
            ar: [
              "الـ tracking يعمل داخل instance واحد من DbContext فقط؛ لا يمتد عبر الـ requests أو الخوادم.",
              "لا يرى تغييراً أجراه مستخدم آخر على نفس الصف بعد تحميلك له — هذا يحتاج concurrency token، وهو عمود إصدار يضعه EF في جملة WHERE ليفشل التحديث القديم بدل أن ينجح.",
              "الكائنات الـ detached (من JSON أو من cache) بلا snapshot، فلا يستطيع EF معرفة ما تغيّر فيها.",
              "لا يجمع عملاً بلا حدود: آلاف التغييرات المتتبَّعة في SaveChanges واحد تبقى آلاف الـ statements."
            ]
          },
          alts: {
            en: [
              "AsNoTracking for read-only queries: no snapshot, no DetectChanges, same rows.",
              "ExecuteUpdate/ExecuteDelete for bulk edits: one SQL statement, no entities loaded at all.",
              "Dapper or raw ADO.NET where you want to own the SQL and skip the object graph entirely.",
              "Explicit Entry(entity).Property(x).IsModified = true when you know exactly which field to write."
            ],
            ar: [
              "AsNoTracking للاستعلامات للقراءة فقط: بلا snapshot وبلا DetectChanges ونفس الصفوف.",
              "ExecuteUpdate/ExecuteDelete للتعديلات الجماعية: SQL statement واحد وبلا تحميل أي entities.",
              "Dapper أو ADO.NET الخام حين تريد امتلاك الـ SQL وتخطّي شجرة الكائنات كلياً.",
              "الضبط الصريح Entry(entity).Property(x).IsModified = true حين تعرف الحقل المطلوب كتابته بالضبط."
            ]
          }
        }
      ]
    },
    {
      key: "mistakes",
      blocks: [
        { t: "mistake",
          title: { en: "Update(entity) on an object built from the request body", ar: "استدعاء Update(entity) على كائن مبني من body الـ request" },
          body: {
            en: "A team mapped the incoming JSON straight to an Order and called context.Update(order). The JSON had no Notes field, so Notes was null on the object. Update marks every property Modified because there is no snapshot to compare against, so the UPDATE wrote all 18 columns and erased the Notes of every order that endpoint touched. Load the row first, then assign only the fields the request is allowed to change.",
            ar: "فريق حوّل الـ JSON الوارد مباشرةً إلى Order واستدعى context.Update(order). الـ JSON لم يحتوِ حقل Notes، فكانت قيمته null في الكائن. Update يعلّم كل الخصائص كـ Modified لأنه لا يوجد snapshot للمقارنة، فكتب الـ UPDATE الأعمدة الـ 18 كلها ومسح Notes لكل order مسّه هذا الـ endpoint. حمّل الصف أولاً، ثم أسنِد الحقول المسموح للـ request بتغييرها فقط."
          },
          fix: "var order = await context.Orders.FindAsync(id);\nif (order is null) return Results.NotFound();\norder.Status = dto.Status;   // only this column ends up in the UPDATE\nawait context.SaveChangesAsync();"
        },
        { t: "mistake",
          title: { en: "Tracking a report query", ar: "تتبّع استعلام تقارير" },
          body: {
            en: "An export endpoint ran context.Orders.Include(o => o.Lines).ToListAsync() over 20,000 orders and 90,000 lines, then only serialized them to CSV. Tracking built 110,000 snapshots that were never compared to anything. Memory per request went to roughly 180 MB and three concurrent exports pushed the pod into an out-of-memory restart. Adding AsNoTracking cut memory to about 60 MB and the request time from 1.9 s to 0.4 s.",
            ar: "endpoint تصدير نفّذ context.Orders.Include(o => o.Lines).ToListAsync() على 20,000 order و 90,000 line، ثم حوّلها إلى CSV فقط. بنى الـ tracking 110,000 snapshot لم تُقارن بشيء أبداً. ارتفعت الذاكرة لكل request إلى حوالي 180 ميغابايت، وثلاث عمليات تصدير متزامنة دفعت الـ pod إلى إعادة تشغيل بسبب نفاد الذاكرة. إضافة AsNoTracking خفّضت الذاكرة إلى حوالي 60 ميغابايت وزمن الـ request من 1.9 ثانية إلى 0.4 ثانية."
          },
          fix: "var orders = await context.Orders\n    .Include(o => o.Lines)\n    .AsNoTracking()\n    .ToListAsync();"
        },
        { t: "mistake",
          title: { en: "A loop that calls SaveChanges every iteration", ar: "حلقة تستدعي SaveChanges في كل دورة" },
          body: {
            en: "A nightly job loaded 20,000 tracked orders and called SaveChanges inside the loop after editing each one. Every call ran DetectChanges over all 20,000 tracked entities, so the job did about 400 million property comparisons plus 20,000 separate round trips to the database. It took 14 minutes. Batching into one SaveChanges after the loop brought it to 11 seconds; ExecuteUpdate brought it to under a second.",
            ar: "مهمة ليلية حمّلت 20,000 order متتبَّع واستدعت SaveChanges داخل الحلقة بعد تعديل كل واحد. كل استدعاء شغّل DetectChanges على الـ 20,000 entity كلها، فأجرت المهمة حوالي 400 مليون مقارنة خصائص إضافةً إلى 20,000 رحلة منفصلة إلى الـ database. استغرقت 14 دقيقة. تجميعها في SaveChanges واحد بعد الحلقة أنزلها إلى 11 ثانية، و ExecuteUpdate أنزلها إلى أقل من ثانية."
          },
          fix: "await context.Orders\n    .Where(o => o.Status == \"Pending\" && o.CreatedAt < cutoff)\n    .ExecuteUpdateAsync(s => s.SetProperty(o => o.Status, \"Expired\"));"
        },
        { t: "mistake",
          title: { en: "A DbContext that lives too long", ar: "DbContext يعيش طويلاً" },
          body: {
            en: "A background worker registered its DbContext as a singleton — one instance for the whole process lifetime. The tracker kept every entity it ever loaded, so memory grew all day and never came down, and a stale order object from an hour earlier was returned from the identity map instead of fresh data. Register DbContext as scoped, or in a worker create one per unit of work with IDbContextFactory.",
            ar: "worker خلفي سجّل الـ DbContext كـ singleton — instance واحد طوال عمر العملية. احتفظ الـ tracker بكل entity حمّله يوماً، فنمت الذاكرة طوال اليوم ولم تنخفض، وأُعيد كائن order قديم من قبل ساعة من الـ identity map بدل بيانات جديدة. سجّل الـ DbContext كـ scoped، أو في الـ worker أنشئ واحداً لكل وحدة عمل عبر IDbContextFactory."
          },
          fix: "// in Program.cs\nbuilder.Services.AddDbContextFactory<AppDb>(o => o.UseSqlServer(cs));\n\n// in the worker, one context per unit of work\nawait using var context = await factory.CreateDbContextAsync(ct);"
        }
      ]
    },
    {
      key: "interview",
      blocks: [
        { t: "qa", level: "junior",
          q: { en: "You changed a property but the database still shows the old value. Why?", ar: "غيّرت خاصية لكن الـ database ما زال يعرض القيمة القديمة. لماذا؟" },
          a: { en: "Because setting a property only changes the object in memory. EF does not write anything until SaveChanges runs — that is the point where it compares each tracked object to the copy it took at load time and generates the UPDATE. So either SaveChanges was never called, or it was called on a different DbContext than the one that loaded the object.", ar: "لأن ضبط الخاصية يغيّر الكائن في الذاكرة فقط. EF لا يكتب شيئاً حتى يعمل SaveChanges — تلك هي النقطة التي يقارن فيها كل كائن متتبَّع بالنسخة التي أخذها وقت التحميل ويولّد الـ UPDATE. إذن إما أن SaveChanges لم يُستدعَ، أو استُدعي على DbContext غير الذي حمّل الكائن." }
        },
        { t: "qa", level: "mid",
          q: { en: "What does AsNoTracking actually skip?", ar: "ماذا يتخطّى AsNoTracking فعلياً؟" },
          a: { en: "Two things: EF does not store the snapshot copy of the entity's values, and it does not put the entity in the identity map. The SQL sent is identical. What you lose is the ability to change the object and have SaveChanges notice, plus the guarantee that the same row loaded twice gives you the same object. For a read-only endpoint you need neither, and you save both the memory and the DetectChanges scan.", ar: "شيئان: EF لا يخزّن نسخة الـ snapshot لقيم الـ entity، ولا يضعه في الـ identity map. الـ SQL المرسل مطابق. ما تخسره هو قدرة SaveChanges على ملاحظة تعديلك للكائن، إضافةً إلى ضمان أن نفس الصف المحمَّل مرتين يعطيك نفس الكائن. في endpoint للقراءة فقط لا تحتاج أياً منهما، فتوفّر الذاكرة ومسح DetectChanges معاً." }
        },
        { t: "qa", level: "mid",
          q: { en: "What is the difference between Attach and Update on a detached entity?", ar: "ما الفرق بين Attach و Update على entity غير متتبَّع؟" },
          a: { en: "Both start tracking an object EF did not load. Attach marks it Unchanged, so SaveChanges writes nothing until you change something or mark a property modified yourself. Update marks every property as Modified, so SaveChanges writes all columns. Update is dangerous with objects built from a request body, because any field the client did not send is written as its default — usually null.", ar: "كلاهما يبدأ تتبّع كائن لم يحمّله EF. Attach يضعه Unchanged، فلا يكتب SaveChanges شيئاً حتى تغيّر شيئاً أو تعلّم خاصية كـ modified بنفسك. Update يعلّم كل الخصائص كـ Modified، فيكتب SaveChanges كل الأعمدة. Update خطر مع كائنات مبنية من body الـ request، لأن أي حقل لم يرسله الـ client يُكتب بقيمته الافتراضية — عادةً null." }
        },
        { t: "qa", level: "senior",
          q: { en: "Why can DetectChanges become the bottleneck, and what do you do about it?", ar: "لماذا قد يصبح DetectChanges عنق الزجاجة، وماذا تفعل حياله؟" },
          a: { en: "Its cost is the number of tracked entities times the properties on each, and it runs before every SaveChanges and before most queries. If you load 20,000 entities and call SaveChanges inside a loop, you pay that full scan 20,000 times, which is quadratic. The fixes in order of preference: do not track what you will not change, batch into one SaveChanges, or skip entities entirely with ExecuteUpdate. Turning off auto-detect is a last resort because then a missed manual DetectChanges call silently loses a write.", ar: "تكلفته هي عدد الـ entities المتتبَّعة مضروباً في خصائص كل واحد، ويعمل قبل كل SaveChanges وقبل معظم الاستعلامات. لو حمّلت 20,000 entity واستدعيت SaveChanges داخل حلقة، تدفع المسح الكامل 20,000 مرة، وهذا تربيعي. الحلول بترتيب الأفضلية: لا تتتبّع ما لن تغيّره، اجمع في SaveChanges واحد، أو تخطَّ الـ entities كلياً بـ ExecuteUpdate. إيقاف الكشف التلقائي هو الملاذ الأخير، لأن نسيان استدعاء DetectChanges يدوياً يضيّع عملية كتابة بصمت." }
        },
        { t: "qa", level: "senior",
          q: { en: "Two requests load the same order and save different fields. What happens?", ar: "request-ان يحمّلان نفس الـ order ويحفظان حقلين مختلفين. ماذا يحدث؟" },
          a: { en: "Each request has its own DbContext, its own object and its own snapshot, so each generates an UPDATE touching only its own column. Because the two UPDATEs touch different columns, both survive — this is the main practical benefit of column-level change tracking. It stops being safe when both change the same column, or when a value depends on what was read: an inventory decrement read as 10 by both requests writes 9 twice instead of 8. That case needs a concurrency token, which is a version column EF puts in the WHERE clause so the second update fails and can be retried.", ar: "كل request له DbContext خاص وكائن خاص و snapshot خاص، فيولّد كل واحد UPDATE يمسّ عموده هو فقط. ولأن الـ UPDATE-ين يمسّان عمودين مختلفين، ينجو كلاهما — وهذه الفائدة العملية الأساسية للـ tracking على مستوى العمود. تتوقف السلامة حين يغيّر الاثنان نفس العمود، أو حين تعتمد القيمة على ما قُرئ: إنقاص مخزون قرأه الاثنان كـ 10 يكتب 9 مرتين بدل 8. تلك الحالة تحتاج concurrency token، وهو عمود إصدار يضعه EF في جملة WHERE ليفشل التحديث الثاني فيُعاد تنفيذه." }
        },
        { t: "qa", level: "staff",
          q: { en: "How do you stop tracking mistakes from recurring across a large team?", ar: "كيف تمنع تكرار أخطاء الـ tracking عبر فريق كبير؟" },
          a: { en: "Make the safe path the default and the unsafe path visible. Split read and write access: query methods return projections from no-tracking queries, and only a small write layer holds a tracking DbContext. Turn on the container's scope validation and EF's warning for a DbContext resolved outside a request scope. Add an analyzer or review rule that flags context.Update on an object that was not loaded in the same method. Then add one integration test per write endpoint asserting the exact columns in the generated SQL, so the Notes-erasing bug fails in CI instead of in production.", ar: "اجعل المسار الآمن هو الافتراضي والمسار الخطر ظاهراً. افصل القراءة عن الكتابة: ميثودات الاستعلام تعيد projections من استعلامات no-tracking، وطبقة كتابة صغيرة فقط تمسك DbContext متتبِّعاً. فعّل scope validation في الـ container وتحذير EF لأي DbContext يُحلّ خارج نطاق الـ request. أضف analyzer أو قاعدة مراجعة تعلّم استدعاء context.Update على كائن لم يُحمَّل في نفس الميثود. ثم أضف اختبار تكامل لكل endpoint كتابة يتحقق من الأعمدة الفعلية في الـ SQL المولَّد، ليفشل خطأ مسح Notes في الـ CI بدل الإنتاج." }
        }
      ]
    },
    {
      key: "codereview",
      blocks: [
        { t: "review", severity: "high",
          title: { en: "Saving a request DTO as if it were the row", ar: "حفظ DTO الـ request كأنه الصف" },
          bad: "[HttpPut(\"/orders/{id}\")]\npublic async Task<IResult> Update(int id, OrderDto dto)\n{\n    var order = new Order { Id = id, Status = dto.Status };\n    context.Update(order);              // every column marked Modified\n    await context.SaveChangesAsync();\n    return Results.NoContent();\n}",
          good: "[HttpPut(\"/orders/{id}\")]\npublic async Task<IResult> Update(int id, OrderDto dto)\n{\n    var order = await context.Orders.FindAsync(id);\n    if (order is null) return Results.NotFound();\n\n    order.Status = dto.Status;          // only Status ends up Modified\n    await context.SaveChangesAsync();\n    return Results.NoContent();\n}",
          why: { en: "OrderDto is a DTO — the plain object the JSON request body maps to. The bad version builds an Order from it, so there is no snapshot, EF marks all 18 columns Modified and writes the object's defaults over the real row — CustomerId becomes 0, Notes becomes null, CreatedAt becomes the year 0001. The good version loads the row first, which gives EF a snapshot, so the UPDATE contains one column. It costs one extra SELECT and prevents silent data loss.", ar: "OrderDto هو DTO — الكائن البسيط الذي يقابل body الـ JSON. النسخة السيئة تبني Order منه، فلا يوجد snapshot، ويعلّم EF الأعمدة الـ 18 كلها كـ Modified ويكتب قيم الكائن الافتراضية فوق الصف الحقيقي — CustomerId يصبح 0 و Notes يصبح null و CreatedAt يصبح السنة 0001. النسخة الجيدة تحمّل الصف أولاً فتعطي EF snapshot، فيحتوي الـ UPDATE عموداً واحداً. تكلفتها SELECT إضافي واحد وتمنع فقدان بيانات صامتاً." }
        },
        { t: "review", severity: "medium",
          title: { en: "A read endpoint that tracks and over-fetches", ar: "endpoint قراءة يتتبّع ويجلب أكثر من اللازم" },
          bad: "var orders = await context.Orders\n    .Include(o => o.Lines)\n    .Where(o => o.CustomerId == customerId)\n    .ToListAsync();\n\nreturn orders.Select(o => new OrderSummary(o.Id, o.Status, o.Total));",
          good: "var orders = await context.Orders\n    .Where(o => o.CustomerId == customerId)\n    .Select(o => new OrderSummary(o.Id, o.Status, o.Total))\n    .AsNoTracking()\n    .ToListAsync();\n\nreturn orders;",
          why: { en: "The bad version loads every column of every order plus all its lines, snapshots all of them, and then throws almost all of it away in memory. The good version asks SQL Server for three columns and no lines at all, and skips snapshots. On a customer with 400 orders this went from about 30 MB and 210 ms to under 1 MB and 12 ms.", ar: "النسخة السيئة تحمّل كل أعمدة كل order مع كل الـ lines، وتأخذ snapshot لها جميعاً، ثم ترمي معظمها في الذاكرة. النسخة الجيدة تطلب من SQL Server ثلاثة أعمدة وبلا lines إطلاقاً، وتتخطّى الـ snapshots. مع عميل لديه 400 order انتقلت من حوالي 30 ميغابايت و 210 ميلي ثانية إلى أقل من 1 ميغابايت و 12 ميلي ثانية." }
        }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        { t: "p",
          en: "In a typical ASP.NET Core service the DbContext is registered as scoped, meaning one instance is created per HTTP request and disposed when the response is sent. That lifetime is what makes tracking safe: the tracker starts empty, holds only this request's entities, and is thrown away with them. It is also why a scoped DbContext must never be captured by a singleton — the singleton would keep the tracker and its entities alive forever.",
          ar: "في خدمة ASP.NET Core نموذجية يُسجَّل الـ DbContext كـ scoped، أي يُنشأ instance لكل HTTP request ويُتخلَّص منه عند إرسال الرد. هذا العمر هو ما يجعل الـ tracking آمناً: يبدأ الـ tracker فارغاً، يحمل entities هذا الـ request فقط، ويُرمى معها. وهو أيضاً سبب منع أي singleton من الاحتفاظ بـ DbContext من نوع scoped — لأن الـ singleton سيبقي الـ tracker و entities حيّة إلى الأبد."
        },
        { t: "p",
          en: "Once a service grows, the useful split is by direction of data. Read endpoints go through no-tracking projection queries that return exactly the shape the response needs. Write endpoints load the specific rows they will change, mutate them, and call SaveChanges once. Background jobs create a fresh DbContext per batch so the tracker never accumulates.",
          ar: "حين تكبر الخدمة، يكون التقسيم المفيد حسب اتجاه البيانات. endpoints القراءة تمرّ عبر استعلامات projection بلا tracking تعيد بالضبط الشكل الذي يحتاجه الرد. endpoints الكتابة تحمّل الصفوف التي ستغيّرها فقط، تعدّلها، وتستدعي SaveChanges مرة واحدة. المهام الخلفية تنشئ DbContext جديداً لكل دفعة حتى لا يتراكم الـ tracker."
        },
        { t: "ul",
          en: [
            "Request-scoped DbContext: one tracker per request, disposed with the request.",
            "Read path: AsNoTracking plus Select projection, so nothing is snapshotted and nothing extra is fetched.",
            "Write path: load, mutate, single SaveChanges, which is also a single database transaction.",
            "Bulk maintenance path: ExecuteUpdate or ExecuteDelete, which never load entities at all.",
            "Background jobs: IDbContextFactory and a new context per batch of a few hundred rows."
          ],
          ar: [
            "DbContext بعمر الـ request: tracker واحد لكل request يُتخلَّص منه مع الـ request.",
            "مسار القراءة: AsNoTracking مع Select projection، فلا snapshots ولا جلب زائد.",
            "مسار الكتابة: تحميل، تعديل، SaveChanges واحد، وهو أيضاً transaction واحدة في الـ database.",
            "مسار الصيانة الجماعية: ExecuteUpdate أو ExecuteDelete، بلا تحميل أي entities.",
            "المهام الخلفية: IDbContextFactory و context جديد لكل دفعة من بضع مئات من الصفوف."
          ]
        },
        { t: "callout", kind: "warn",
          en: "SaveChanges wraps all pending changes in one transaction. That is usually what you want, but it also means one failed row rolls back the other 999. For large batches, save in chunks so a single bad row does not undo an hour of work.",
          ar: "SaveChanges يغلّف كل التغييرات المعلّقة في transaction واحدة. هذا غالباً ما تريده، لكنه يعني أيضاً أن فشل صف واحد يتراجع عن الـ 999 الباقية. في الدفعات الكبيرة احفظ على قطع حتى لا يُلغي صف سيئ واحد ساعة من العمل."
        }
      ]
    },
    {
      key: "perf",
      blocks: [
        { t: "kv", rows: [
          { k: { en: "Memory", ar: "Memory" },
            v: { en: "Each tracked entity costs roughly twice its data: the object plus its snapshot, plus the tracker entry. 20,000 orders measured about 180 MB tracked versus 60 MB with AsNoTracking.", ar: "كل entity متتبَّع يكلّف تقريباً ضعف بياناته: الكائن مع الـ snapshot، إضافةً إلى entry في الـ tracker. قيست 20,000 order بحوالي 180 ميغابايت مع الـ tracking مقابل 60 ميغابايت مع AsNoTracking." } },
          { k: { en: "CPU", ar: "CPU" },
            v: { en: "DetectChanges compares tracked entities times properties each. It is free at 20 entities and dominant at 20,000 if it runs repeatedly.", ar: "DetectChanges يقارن عدد الـ entities المتتبَّعة مضروباً في خصائص كل واحد. مجاني عند 20 entity ومهيمن عند 20,000 إذا تكرر تشغيله." } },
          { k: { en: "Database", ar: "Database" },
            v: { en: "Column-level updates mean smaller writes and smaller transaction log records — the log is the file SQL Server writes every change to before applying it.", ar: "التحديث على مستوى العمود يعني كتابات أصغر وسجلات أصغر في الـ transaction log — وهو الملف الذي يكتب فيه SQL Server كل تغيير قبل تطبيقه." } },
          { k: { en: "Latency", ar: "Latency" },
            v: { en: "One SaveChanges is one round trip for the whole batch. SaveChanges inside a loop turns N changes into N round trips, and network time then dominates.", ar: "SaveChanges واحد يعني رحلة واحدة للدفعة كلها. SaveChanges داخل حلقة يحوّل N تغييراً إلى N رحلة، فيهيمن زمن الشبكة." } },
          { k: { en: "Scalability", ar: "Scalability" },
            v: { en: "Per-request memory sets how many concurrent requests fit in a pod. Cutting tracked reads is often the cheapest way to raise concurrency without adding instances.", ar: "الذاكرة لكل request تحدد كم request متزامناً يتسع في الـ pod. تقليل القراءات المتتبَّعة غالباً أرخص طريقة لرفع التزامن بلا إضافة instances." } }
        ]}
      ]
    },
    {
      key: "debug",
      blocks: [
        { t: "ul",
          en: [
            "context.ChangeTracker.DebugView.ShortView — prints every tracked entity and its state; look for entities you never meant to load, or a Modified entity you did not touch.",
            "context.ChangeTracker.Entries().Count() before SaveChanges — if this is in the thousands on a normal request, something is loading a whole table.",
            "EF logging at Information level with EnableSensitiveDataLogging in development — shows the exact UPDATE text; check that its SET list has only the columns you expected.",
            "context.Entry(order).Property(o => o.Status).OriginalValue — shows what the snapshot holds, which tells you whether EF thinks the value changed at all.",
            "A memory dump or dotnet-counters on working set during an export — a tracked report query shows up as a large, short-lived spike per request."
          ],
          ar: [
            "context.ChangeTracker.DebugView.ShortView — يطبع كل entity متتبَّع وحالته؛ ابحث عن entities لم تقصد تحميلها، أو entity في حالة Modified لم تلمسه.",
            "context.ChangeTracker.Entries().Count() قبل SaveChanges — لو كان بالآلاف في request عادي، فشيء ما يحمّل جدولاً كاملاً.",
            "logging لـ EF عند مستوى Information مع EnableSensitiveDataLogging في بيئة التطوير — يعرض نص الـ UPDATE بالضبط؛ تحقق أن قائمة SET فيه تحتوي الأعمدة المتوقعة فقط.",
            "context.Entry(order).Property(o => o.Status).OriginalValue — يعرض ما يحمله الـ snapshot، فيخبرك إن كان EF يرى تغيّراً أصلاً.",
            "memory dump أو dotnet-counters على الـ working set أثناء التصدير — استعلام تقارير متتبَّع يظهر كقفزة كبيرة قصيرة العمر لكل request."
          ]
        },
        { t: "callout", kind: "tip",
          en: "When an unexpected UPDATE appears in the logs, print DebugView right before SaveChanges. It names the entity and the exact properties EF thinks changed, which usually points straight at the line that mutated something by accident.",
          ar: "حين يظهر UPDATE غير متوقع في الـ logs، اطبع DebugView قبل SaveChanges مباشرةً. يسمّي الـ entity والخصائص التي يرى EF أنها تغيّرت، وهذا يشير عادةً مباشرةً إلى السطر الذي عدّل شيئاً بالخطأ."
        }
      ]
    },
    {
      key: "realworld",
      blocks: [
        { t: "p",
          en: "The pattern shows up wherever a system has a small number of write endpoints and a large number of read endpoints over the same tables. The writes benefit from tracking because they change one or two fields of a row that other requests are also touching. The reads pay for it and get nothing back, which is why the same table can be both cheap and expensive depending on the path.",
          ar: "يظهر النمط في كل نظام فيه عدد قليل من endpoints الكتابة وعدد كبير من endpoints القراءة على نفس الجداول. الكتابات تستفيد من الـ tracking لأنها تغيّر حقلاً أو حقلين من صف تلمسه requests أخرى أيضاً. القراءات تدفع الثمن ولا تأخذ مقابلاً، ولذلك قد يكون نفس الجدول رخيصاً أو مكلفاً حسب المسار."
        },
        { t: "ul",
          en: [
            "Order management systems: status changes from many services touch different columns of the same order row, and column-level updates keep them from overwriting each other.",
            "Admin back-offices: a form edits 3 of 40 fields, and tracking means the other 37 are never written, so audit triggers do not fire on unchanged columns.",
            "Reporting and export endpoints: the classic place where forgetting AsNoTracking doubles memory for no benefit.",
            "Nightly batch jobs: the classic place where a long-lived DbContext accumulates entities until the process runs out of memory."
          ],
          ar: [
            "أنظمة إدارة الطلبات: تغييرات الـ status من خدمات متعددة تمسّ أعمدة مختلفة من نفس صف الـ order، والتحديث على مستوى العمود يمنعها من دهس بعضها.",
            "لوحات الإدارة الخلفية: نموذج يعدّل 3 حقول من 40، والـ tracking يعني أن الـ 37 الباقية لا تُكتب أبداً، فلا تنطلق audit triggers على أعمدة لم تتغيّر.",
            "endpoints التقارير والتصدير: المكان الكلاسيكي الذي يضاعف فيه نسيان AsNoTracking الذاكرة بلا فائدة.",
            "المهام الليلية المجمّعة: المكان الكلاسيكي الذي يتراكم فيه الـ entities في DbContext طويل العمر حتى تنفد ذاكرة العملية."
          ]
        }
      ]
    },
    {
      key: "exercises",
      blocks: [
        { t: "ex", diff: "easy",
          en: "Load one order, change only its Status, and log context.Entry(order).State before the change, after the change, after a manual DetectChanges, and after SaveChanges. You are right when you see Unchanged, Unchanged, Modified, Unchanged in that order.",
          ar: "حمّل order واحداً، غيّر Status فقط، وسجّل context.Entry(order).State قبل التغيير وبعده وبعد DetectChanges يدوي وبعد SaveChanges. تكون مصيباً حين ترى Unchanged ثم Unchanged ثم Modified ثم Unchanged بهذا الترتيب."
        },
        { t: "ex", diff: "medium",
          en: "Write two versions of a PUT endpoint: one that calls context.Update on an object built from the DTO, one that loads the row first. Capture the generated SQL for both. You are right when the first UPDATE lists every column and the second lists exactly one.",
          ar: "اكتب نسختين من endpoint من نوع PUT: واحدة تستدعي context.Update على كائن مبني من الـ DTO، وأخرى تحمّل الصف أولاً. التقط الـ SQL المولَّد لكل منهما. تكون مصيباً حين يسرد الـ UPDATE الأول كل الأعمدة ويسرد الثاني عموداً واحداً بالضبط."
        },
        { t: "ex", diff: "hard",
          en: "Seed 20,000 orders. Time three versions of a job that expires old ones: SaveChanges inside the loop, one SaveChanges after the loop, and ExecuteUpdate. Record wall time and peak working set for each. You are right when the three timings differ by roughly two orders of magnitude and you can explain each gap by DetectChanges cost and round trips.",
          ar: "أنشئ 20,000 order للاختبار. قِس زمن ثلاث نسخ من مهمة تُنهي القديمة منها: SaveChanges داخل الحلقة، و SaveChanges واحد بعد الحلقة، و ExecuteUpdate. سجّل الزمن الحقيقي وذروة الـ working set لكل نسخة. تكون مصيباً حين تختلف الأزمنة الثلاثة بنحو مرتبتين عشريتين وتستطيع تفسير كل فجوة بتكلفة DetectChanges وعدد الرحلات."
        },
        { t: "ex", diff: "senior",
          en: "Add an EF SaveChanges interceptor that logs the entity name and the modified property names for every write in your service, then run your integration test suite. You are right when the log reveals at least one endpoint writing a column it was never supposed to touch, and you can point at the line that caused it.",
          ar: "أضف interceptor لـ SaveChanges في EF يسجّل اسم الـ entity وأسماء الخصائص المعدَّلة لكل عملية كتابة في خدمتك، ثم شغّل مجموعة اختبارات التكامل. تكون مصيباً حين يكشف الـ log عن endpoint واحد على الأقل يكتب عموداً لم يكن يُفترض أن يمسّه، وتستطيع الإشارة إلى السطر المسبِّب."
        }
      ]
    },
    {
      key: "refs",
      blocks: [
        { t: "ref", label: { en: "EF Core — Change tracking overview", ar: "EF Core — نظرة عامة على الـ change tracking" },
          url: "https://learn.microsoft.com/en-us/ef/core/change-tracking/",
          meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref", label: { en: "EF Core — Change detection and notifications", ar: "EF Core — كشف التغيير والإشعارات" },
          url: "https://learn.microsoft.com/en-us/ef/core/change-tracking/change-detection",
          meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref", label: { en: "EF Core — Tracking vs no-tracking queries", ar: "EF Core — الاستعلامات المتتبَّعة مقابل غير المتتبَّعة" },
          url: "https://learn.microsoft.com/en-us/ef/core/querying/tracking",
          meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref", label: { en: "EF Core — Saving data and SaveChanges", ar: "EF Core — حفظ البيانات و SaveChanges" },
          url: "https://learn.microsoft.com/en-us/ef/core/saving/basic",
          meta: { en: "Docs", ar: "توثيق" } }
      ]
    }
  ],
  quiz: [
    {
      q: { en: "At what moment does EF Core decide that a loaded entity is Modified?", ar: "في أي لحظة يقرر EF Core أن entity محمَّلاً أصبح Modified؟" },
      options: [
        { en: "The instant you assign a new value to one of its properties", ar: "لحظة إسنادك قيمة جديدة لإحدى خصائصه" },
        { en: "When DetectChanges runs and compares the entity to its snapshot", ar: "حين يعمل DetectChanges ويقارن الـ entity بالـ snapshot الخاص به" },
        { en: "When the entity is first materialized from the query result", ar: "حين يُبنى الـ entity أول مرة من نتيجة الاستعلام" },
        { en: "When the database transaction commits", ar: "حين تُثبَّت transaction الـ database" }
      ],
      correct: 1,
      why: { en: "For a normal (non-proxy) entity the setter is plain C# and EF sees nothing. The state flips only when DetectChanges compares the current values to the snapshot, which happens automatically just before SaveChanges.", ar: "في entity عادي (بلا proxy) يكون الـ setter كود C# عادي ولا يرى EF شيئاً. تتغيّر الحالة فقط حين يقارن DetectChanges القيم الحالية بالـ snapshot، وهو ما يحدث تلقائياً قبل SaveChanges مباشرةً." }
    },
    {
      q: { en: "Why is context.Update(entity) risky on an object built from a request body?", ar: "لماذا يكون context.Update(entity) خطراً على كائن مبني من body الـ request؟" },
      options: [
        { en: "It throws if the entity is already tracked by another context", ar: "يرمي استثناءً إن كان الـ entity متتبَّعاً بواسطة context آخر" },
        { en: "It runs a SELECT first, doubling the round trips", ar: "ينفّذ SELECT أولاً فيضاعف عدد الرحلات" },
        { en: "There is no snapshot, so every property is marked Modified and all columns are written", ar: "لا يوجد snapshot، فتُعلَّم كل خاصية كـ Modified وتُكتب كل الأعمدة" },
        { en: "It skips the transaction, so a failure leaves the row half-written", ar: "يتخطّى الـ transaction، ففشلٌ ما يترك الصف نصف مكتوب" }
      ],
      correct: 2,
      why: { en: "Update attaches the object and marks everything Modified because EF has no before-picture. Any field the client did not send is written as its default value, which silently erases real data.", ar: "Update يربط الكائن ويعلّم كل شيء كـ Modified لأن EF لا يملك صورة \"قبل\". أي حقل لم يرسله الـ client يُكتب بقيمته الافتراضية، فيمسح بيانات حقيقية بصمت." }
    },
    {
      q: { en: "What exactly does AsNoTracking change about a query?", ar: "ما الذي يغيّره AsNoTracking بالضبط في الاستعلام؟" },
      options: [
        { en: "It sends different SQL that selects fewer columns", ar: "يرسل SQL مختلفاً يختار أعمدة أقل" },
        { en: "It sends the same SQL but skips the snapshot and the identity map", ar: "يرسل نفس الـ SQL لكنه يتخطّى الـ snapshot والـ identity map" },
        { en: "It makes the entities read-only so mutating them throws", ar: "يجعل الـ entities للقراءة فقط فيرمي استثناءً عند تعديلها" },
        { en: "It opens a separate read-only database connection", ar: "يفتح اتصال database منفصلاً للقراءة فقط" }
      ],
      correct: 1,
      why: { en: "The SQL is identical. EF simply does not store the copy of the values and does not register the entity in the identity map, so it uses less memory and has nothing to scan in DetectChanges.", ar: "الـ SQL مطابق. ببساطة لا يخزّن EF نسخة القيم ولا يسجّل الـ entity في الـ identity map، فيستهلك ذاكرة أقل ولا يجد ما يمسحه في DetectChanges." }
    },
    {
      q: { en: "A job loads 20,000 tracked orders and calls SaveChanges inside the loop. What is the main cost?", ar: "مهمة تحمّل 20,000 order متتبَّع وتستدعي SaveChanges داخل الحلقة. ما التكلفة الأساسية؟" },
      options: [
        { en: "SQL Server escalates row locks to a table lock on the first save", ar: "يرفّع SQL Server أقفال الصفوف إلى قفل جدول عند أول حفظ" },
        { en: "Each SaveChanges rescans all 20,000 tracked entities, so the work is quadratic", ar: "كل SaveChanges يعيد مسح الـ 20,000 entity كلها، فيصبح العمل تربيعياً" },
        { en: "The snapshots are rebuilt from the database on every iteration", ar: "تُعاد بناء الـ snapshots من الـ database في كل دورة" },
        { en: "EF keeps one open transaction for the whole loop", ar: "يبقي EF transaction واحدة مفتوحة طوال الحلقة" }
      ],
      correct: 1,
      why: { en: "DetectChanges runs before every SaveChanges and its cost grows with everything tracked, not with what changed. 20,000 saves times 20,000 entities is hundreds of millions of comparisons, plus 20,000 round trips.", ar: "DetectChanges يعمل قبل كل SaveChanges وتكلفته تنمو مع كل ما هو متتبَّع لا مع ما تغيّر. 20,000 حفظ مضروبة في 20,000 entity تعني مئات الملايين من المقارنات، إضافةً إلى 20,000 رحلة." }
    },
    {
      q: { en: "Why must a singleton service never hold a scoped DbContext?", ar: "لماذا يجب ألا يحتفظ أي singleton service بـ DbContext من نوع scoped؟" },
      options: [
        { en: "DbContext is thread-safe only inside a request scope", ar: "الـ DbContext آمن للـ threads داخل نطاق الـ request فقط" },
        { en: "The tracker keeps every loaded entity alive, so memory grows and stale objects are returned", ar: "يبقي الـ tracker كل entity محمَّل حياً، فتنمو الذاكرة وتُعاد كائنات قديمة" },
        { en: "Singletons cannot open database connections", ar: "الـ singletons لا تستطيع فتح اتصالات database" },
        { en: "SaveChanges is disabled outside a request scope", ar: "SaveChanges معطّل خارج نطاق الـ request" }
      ],
      correct: 1,
      why: { en: "A DbContext that never gets disposed keeps its change tracker and identity map forever. Memory climbs all day, and a query for a row already in the identity map returns the old object instead of fresh data.", ar: "DbContext لا يُتخلَّص منه أبداً يحتفظ بـ change tracker و identity map إلى الأبد. ترتفع الذاكرة طوال اليوم، ويعيد الاستعلام عن صف موجود في الـ identity map الكائن القديم بدل بيانات جديدة." }
    }
  ]
};
```

NEXT: ef-notracking
