```js
const deadlocksLesson = {
  id: "deadlocks",
  moduleId: "sql",
  title: { en: "Deadlocks and how to read the graph", ar: "الـ deadlocks وقراءة الرسم" },
  summary: {
    en: "Two transactions each hold a lock the other one needs, so neither can move; SQL Server kills one of them. Here is why it happens and how to stop it.",
    ar: "كل transaction تمسك lock تحتاجه الأخرى، فلا تتقدّم أي منهما، و SQL Server يقتل واحدة. هنا سبب حدوث ذلك وكيف توقفه."
  },
  mins: 16,
  sections: [
    {
      key: "why",
      blocks: [
        {
          t: "p",
          en: "A deadlock happens when two transactions each hold something the other one is waiting for. Neither can finish, and neither will ever give up on its own. SQL Server notices this, picks one of them, and cancels it with error 1205. Your application sees a failed request that would have succeeded if it had run a second earlier or a second later.",
          ar: "الـ deadlock يحدث عندما تمسك كل transaction شيئاً تنتظره الأخرى. لا تستطيع أي منهما الانتهاء، ولن تتنازل أي منهما من تلقاء نفسها. SQL Server يلاحظ ذلك، يختار واحدة، ويلغيها بالخطأ 1205. تطبيقك يرى request فاشلاً كان سينجح لو نُفّذ قبل ثانية أو بعد ثانية."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "Transaction", ar: "Transaction" },
              v: {
                en: "A group of database statements that either all take effect or none do. It starts with BEGIN TRAN and ends with COMMIT or ROLLBACK.",
                ar: "مجموعة من جمل قاعدة البيانات تُطبَّق كلها أو لا يُطبَّق أي منها. تبدأ بـ BEGIN TRAN وتنتهي بـ COMMIT أو ROLLBACK."
              }
            },
            {
              k: { en: "Lock", ar: "Lock" },
              v: {
                en: "A marker SQL Server puts on a row, page or table saying \"I am using this\". Other transactions that need it in a conflicting way must wait.",
                ar: "علامة يضعها SQL Server على row أو page أو table تقول «أنا أستخدم هذا». أي transaction أخرى تحتاجه بشكل متعارض يجب أن تنتظر."
              }
            },
            {
              k: { en: "Shared (S) lock", ar: "Shared (S) lock" },
              v: {
                en: "Taken when reading. Many readers can hold it on the same row at once. It blocks writers.",
                ar: "يُؤخذ عند القراءة. عدة قرّاء يمكنهم إمساكه على نفس الـ row في وقت واحد. يمنع الكتّاب."
              }
            },
            {
              k: { en: "Exclusive (X) lock", ar: "Exclusive (X) lock" },
              v: {
                en: "Taken when writing. Only one transaction can hold it on a row, and it blocks everyone else, readers included. It is held until the transaction ends.",
                ar: "يُؤخذ عند الكتابة. transaction واحدة فقط يمكنها إمساكه على row، ويمنع الجميع بمن فيهم القرّاء. يبقى ممسوكاً حتى تنتهي الـ transaction."
              }
            },
            {
              k: { en: "Blocking", ar: "Blocking" },
              v: {
                en: "One transaction waits for another. This is normal and resolves by itself once the first one commits. A deadlock is different: the waiting is circular, so it never resolves.",
                ar: "transaction تنتظر أخرى. هذا طبيعي ويُحلّ وحده بمجرد أن تعمل الأولى COMMIT. الـ deadlock مختلف: الانتظار دائري، فلا يُحلّ أبداً."
              }
            },
            {
              k: { en: "Victim", ar: "Victim" },
              v: {
                en: "The transaction SQL Server chooses to cancel to break the cycle. Its work is rolled back and the client gets error 1205.",
                ar: "الـ transaction التي يختار SQL Server إلغاءها لكسر الدائرة. يُتراجَع عن عملها ويحصل العميل على الخطأ 1205."
              }
            }
          ]
        },
        {
          t: "p",
          en: "Think of two people cooking in a small kitchen. One picks up the pan and then reaches for the lid. The other picks up the lid and then reaches for the pan. Each is holding exactly what the other needs next, and both are politely waiting. Nobody drops anything, so they stand there forever. That is a deadlock. The pan and the lid are rows in your tables, and \"picking up\" is taking an exclusive lock on a row you just wrote to.",
          ar: "تخيّل شخصين يطبخان في مطبخ صغير. الأول يأخذ المقلاة ثم يمدّ يده للغطاء. الثاني يأخذ الغطاء ثم يمدّ يده للمقلاة. كل واحد يمسك بالضبط ما يحتاجه الآخر، وكلاهما ينتظر بأدب. لا أحد يترك ما بيده، فيبقيان واقفَين للأبد. هذا هو الـ deadlock. المقلاة والغطاء هما rows في جداولك، و«الأخذ» هو وضع exclusive lock على row كتبت فيه للتو."
        },
        {
          t: "p",
          en: "The fix in the kitchen is a rule: everyone picks up the pan first, then the lid. Nobody can be stuck holding the lid while waiting for the pan, because the lid is never taken first. The same rule works in a database. Most deadlocks in real systems come from two code paths touching the same two tables in opposite orders, and most of them disappear when you force one order.",
          ar: "الحل في المطبخ قاعدة: الجميع يأخذ المقلاة أولاً ثم الغطاء. لا يمكن لأحد أن يعلق ممسكاً بالغطاء بينما ينتظر المقلاة، لأن الغطاء لا يُؤخذ أولاً أبداً. نفس القاعدة تعمل في قاعدة البيانات. معظم الـ deadlocks في الأنظمة الحقيقية تأتي من مسارَي كود يلمسان نفس الجدولَين بترتيبَين متعاكسَين، ومعظمها يختفي عندما تفرض ترتيباً واحداً."
        },
        {
          t: "callout",
          kind: "note",
          en: "A deadlock is not a corruption or a bug in SQL Server. It is SQL Server protecting you: without detection, both transactions would hang until their connections timed out, holding their locks the whole time and freezing everything behind them.",
          ar: "الـ deadlock ليس فساداً في البيانات ولا خطأ في SQL Server. هو SQL Server يحميك: بدون الكشف، كانت الـ transaction ستتعلّق حتى انتهاء مهلة الاتصال، ممسكة بالـ locks طوال الوقت ومجمّدة كل ما خلفها."
        }
      ]
    },
    {
      key: "problem",
      blocks: [
        {
          t: "p",
          en: "Here is the running example for this lesson. An e-commerce backend has two endpoints. POST /orders/{id}/confirm marks an order as confirmed, then decreases the stock count for each product in it. POST /inventory/adjust does a warehouse correction: it changes the stock count for a product, then updates any pending orders for that product. One path writes Orders then Inventory. The other writes Inventory then Orders.",
          ar: "هذا هو المثال الجاري في هذا الدرس. backend لمتجر إلكتروني فيه endpointان. الأول POST /orders/{id}/confirm يعلّم الـ order كمؤكَّد ثم ينقص كمية المخزون لكل product فيه. والثاني POST /inventory/adjust يصحّح المستودع: يغيّر كمية المخزون لـ product ثم يحدّث أي orders معلّقة لذلك الـ product. مسار يكتب Orders ثم Inventory. والمسار الآخر يكتب Inventory ثم Orders."
        },
        {
          t: "p",
          en: "For months nothing went wrong, because warehouse corrections were rare. Then the warehouse team started running corrections continuously during business hours. The order confirmation endpoint began failing with \"Transaction (Process ID 71) was deadlocked on lock resources with another process and has been chosen as the deadlock victim\". The failures were not constant: they only happened when the two paths overlapped in time on the same product.",
          ar: "لشهور لم يحدث شيء، لأن تصحيحات المستودع كانت نادرة. ثم بدأ فريق المستودع يشغّل التصحيحات باستمرار خلال ساعات العمل. وبدأ endpoint تأكيد الطلب يفشل برسالة «Transaction (Process ID 71) was deadlocked on lock resources ... chosen as the deadlock victim». الفشل لم يكن ثابتاً: كان يحدث فقط عندما يتداخل المساران زمنياً على نفس الـ product."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "Before the fix", ar: "قبل الإصلاح" },
              v: {
                en: "30,000 confirm calls per hour, 180 of them failing with error 1205. That is 0.6% — six out of every thousand customers saw \"something went wrong\" on checkout, at random.",
                ar: "30,000 استدعاء confirm في الساعة، 180 منها تفشل بالخطأ 1205. أي 0.6% — ستة من كل ألف عميل رأوا «حدث خطأ ما» عند الدفع، بشكل عشوائي."
              }
            },
            {
              k: { en: "After adding retries only", ar: "بعد إضافة إعادة المحاولة فقط" },
              v: {
                en: "Customer-visible failures dropped to about 2 per hour, but the database still did 180 rollbacks per hour and p99 latency on confirm rose from 90 ms to 340 ms — meaning the slowest 1 request in 100 now took 340 ms, because it was really two attempts.",
                ar: "الفشل الظاهر للعميل نزل إلى نحو 2 في الساعة، لكن قاعدة البيانات ظلّت تنفّذ 180 rollback في الساعة، وارتفع p99 لـ confirm من 90 ms إلى 340 ms — أي أن أبطأ request واحد من كل 100 صار يستغرق 340 ms، لأنه في الحقيقة محاولتان."
              }
            },
            {
              k: { en: "After fixing lock order", ar: "بعد إصلاح ترتيب الـ locks" },
              v: {
                en: "Both endpoints changed to touch Inventory first, then Orders. Deadlocks went to zero over a full week. The retry logic stayed in place as a safety net but almost never fired.",
                ar: "غُيّر الـ endpointان ليلمسا Inventory أولاً ثم Orders. صارت الـ deadlocks صفراً على مدى أسبوع كامل. بقي منطق إعادة المحاولة كشبكة أمان لكنه لم يعمل تقريباً."
              }
            }
          ]
        }
      ]
    },
    {
      key: "internals",
      blocks: [
        {
          t: "p",
          en: "SQL Server tracks every lock in a structure called the lock manager. When a transaction asks for a lock that conflicts with one already held, it does not fail — it is put on a wait list attached to that lock, and its worker thread goes to sleep. So at any moment the server knows two things: who holds what, and who is waiting for what. Those two facts are enough to draw a graph of \"A is waiting for B\".",
          ar: "SQL Server يتتبّع كل lock في بنية اسمها lock manager. عندما تطلب transaction قفلاً يتعارض مع قفل ممسوك بالفعل، فهي لا تفشل — توضع في قائمة انتظار مرتبطة بذلك الـ lock، وينام الـ thread الخاص بها. إذن في أي لحظة يعرف الخادم أمرين: من يمسك ماذا، ومن ينتظر ماذا. هاتان الحقيقتان تكفيان لرسم graph من نوع «A ينتظر B»."
        },
        {
          t: "p",
          en: "A background task called the deadlock monitor walks that graph looking for a cycle — a path that leads back to where it started, like A waits for B and B waits for A. It runs every 5 seconds by default. When a deadlock is detected it switches to running immediately after each one, because deadlocks tend to arrive in bursts. This is why a deadlock is usually reported within a few seconds rather than instantly.",
          ar: "مهمة خلفية اسمها deadlock monitor تمشي على ذلك الـ graph بحثاً عن دورة — مسار يعود إلى نقطة بدايته، مثل A ينتظر B و B ينتظر A. تعمل كل 5 ثوانٍ افتراضياً. وعند اكتشاف deadlock تنتقل للعمل مباشرة بعد كل واحد، لأن الـ deadlocks تأتي عادة على دفعات. لهذا يُبلَّغ عن الـ deadlock خلال ثوانٍ قليلة لا فوراً."
        },
        {
          t: "code",
          lang: "sql",
          label: { en: "The two transactions that collide", ar: "الـ transactionان اللتان تتصادمان" },
          code: "-- Session A: POST /orders/42/confirm\nBEGIN TRAN;\nUPDATE Orders    SET Status = 'Confirmed' WHERE Id = 42;      -- takes X lock on Orders row 42\n-- ... application does some work here, maybe 20 ms ...\nUPDATE Inventory SET Qty = Qty - 1        WHERE Sku = 'ABC';    -- now WAITS for Inventory row ABC\nCOMMIT;\n\n-- Session B: POST /inventory/adjust  (running at the same moment)\nBEGIN TRAN;\nUPDATE Inventory SET Qty = 500            WHERE Sku = 'ABC';    -- takes X lock on Inventory row ABC\nUPDATE Orders    SET Status = 'OnHold'    WHERE Id = 42;        -- now WAITS for Orders row 42\nCOMMIT;\n\n-- A holds Orders 42 and wants Inventory ABC.\n-- B holds Inventory ABC and wants Orders 42.\n-- Cycle. One of them is killed with error 1205."
        },
        {
          t: "p",
          en: "Once a cycle is found, SQL Server must break it by cancelling one participant. It picks the transaction that is cheapest to undo, measured by how much transaction log it has written so far. Less work written means less work to roll back. You can override this with SET DEADLOCK_PRIORITY, which tells the server to prefer killing a specific session — useful when a background report should always lose to a customer-facing write.",
          ar: "بمجرد العثور على الدورة، يجب على SQL Server كسرها بإلغاء أحد المشاركين. يختار الـ transaction الأرخص في التراجع، مقيسة بكمية الـ transaction log التي كتبتها حتى الآن. عمل أقل مكتوب يعني تراجعاً أقل. يمكنك تجاوز ذلك بـ SET DEADLOCK_PRIORITY الذي يخبر الخادم أن يفضّل قتل session معيّنة — مفيد عندما يجب أن يخسر تقرير خلفي دائماً أمام كتابة تخصّ عميلاً."
        },
        {
          t: "p",
          en: "The victim is rolled back completely and its client receives error 1205. The other transaction wakes up, gets the lock it was waiting for, and finishes normally. Nothing is left half-done: the rollback is a real rollback, so the victim's earlier statements are undone too. This matters for retry logic — you retry the whole transaction, not the statement that failed.",
          ar: "يُتراجَع عن الـ victim بالكامل ويستلم عميلها الخطأ 1205. أما الأخرى فتستيقظ، تحصل على القفل الذي كانت تنتظره، وتنتهي بشكل طبيعي. لا شيء يبقى نصف منجز: الـ rollback حقيقي، فتُلغى أيضاً الجمل السابقة للـ victim. هذا مهم لمنطق إعادة المحاولة — أنت تعيد الـ transaction كاملة لا الجملة التي فشلت."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "Lock manager", ar: "Lock manager" },
              v: { en: "Keeps the list of held locks and the wait list behind each one.", ar: "يحتفظ بقائمة الـ locks الممسوكة وقائمة الانتظار خلف كل واحد." }
            },
            {
              k: { en: "Wait-for graph", ar: "Wait-for graph" },
              v: { en: "The picture built from those lists: an arrow from each waiter to the transaction it waits on.", ar: "الصورة المبنية من تلك القوائم: سهم من كل منتظر إلى الـ transaction التي ينتظرها." }
            },
            {
              k: { en: "Deadlock monitor", ar: "Deadlock monitor" },
              v: { en: "Background task that searches the graph for a cycle, every 5 seconds by default.", ar: "مهمة خلفية تبحث في الـ graph عن دورة، كل 5 ثوانٍ افتراضياً." }
            },
            {
              k: { en: "Victim selection", ar: "اختيار الـ victim" },
              v: { en: "Lowest rollback cost wins the right to survive; DEADLOCK_PRIORITY overrides it.", ar: "الأقل تكلفة في التراجع يفوز بالبقاء؛ و DEADLOCK_PRIORITY يتجاوز ذلك." }
            },
            {
              k: { en: "Error 1205", ar: "الخطأ 1205" },
              v: { en: "The number the victim's client receives. In .NET it arrives as SqlException with Number == 1205.", ar: "الرقم الذي يستلمه عميل الـ victim. في .NET يصل كـ SqlException بـ Number == 1205." }
            }
          ]
        },
        {
          t: "p",
          en: "One more mechanism matters: lock escalation. If a single statement takes more than about 5,000 row locks on one table, SQL Server may swap them all for one lock on the whole table, to save memory. That single table lock conflicts with far more transactions than the row locks did, so a query that was safe at small volumes can start deadlocking once the data grows. Batching large updates into chunks of a few thousand rows avoids crossing that line.",
          ar: "هناك آلية أخرى مهمة: lock escalation. إذا أخذت جملة واحدة أكثر من نحو 5,000 row lock على جدول واحد، قد يستبدلها SQL Server كلها بقفل واحد على الجدول بأكمله لتوفير الذاكرة. ذلك القفل الواحد يتعارض مع transactions أكثر بكثير مما كانت تفعله row locks، فاستعلام كان آمناً على بيانات صغيرة قد يبدأ في إنتاج deadlocks بعد نمو البيانات. تقسيم التحديثات الكبيرة إلى دفعات من بضعة آلاف row يتجنّب تجاوز ذلك الحد."
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
              "Consistent lock ordering removes whole classes of deadlock permanently, with no runtime cost",
              "Retry with backoff turns a rare deadlock into an invisible delay for the user",
              "Shorter transactions reduce the time window in which a cycle can form",
              "RCSI removes reader/writer deadlocks by letting readers see a previous row version instead of waiting"
            ],
            ar: [
              "ترتيب الـ locks الموحّد يزيل أصنافاً كاملة من الـ deadlock نهائياً وبدون تكلفة وقت تشغيل",
              "إعادة المحاولة مع backoff تحوّل deadlock نادراً إلى تأخير غير مرئي للمستخدم",
              "الـ transactions الأقصر تقلّص النافذة الزمنية التي يمكن أن تتشكّل فيها الدورة",
              "RCSI يزيل deadlocks القارئ/الكاتب بجعل القرّاء يرون نسخة سابقة من الـ row بدل الانتظار"
            ]
          },
          cons: {
            en: [
              "Enforcing one lock order across many code paths is a discipline nothing checks for you",
              "Retries hide the real cause, so the deadlock rate quietly grows until it hurts",
              "Retrying a transaction with side effects outside the database can duplicate those side effects",
              "RCSI moves row versions into tempdb, which grows and can become its own bottleneck"
            ],
            ar: [
              "فرض ترتيب واحد للـ locks عبر مسارات كود كثيرة انضباط لا يتحقّق منه شيء تلقائياً",
              "إعادة المحاولة تخفي السبب الحقيقي، فينمو معدّل الـ deadlock بهدوء حتى يؤلم",
              "إعادة transaction لها آثار جانبية خارج قاعدة البيانات قد تكرّر تلك الآثار",
              "RCSI ينقل نسخ الـ rows إلى tempdb الذي ينمو وقد يصير عنق زجاجة بحد ذاته"
            ]
          },
          limits: {
            en: [
              "Detection takes up to 5 seconds, so one participant is stuck waiting that long",
              "You cannot choose the victim without DEADLOCK_PRIORITY, and even then only relatively",
              "Deadlocks that involve parallel workers inside one query are not fixed by lock ordering",
              "Retrying is only correct if the transaction is idempotent"
            ],
            ar: [
              "الكشف قد يستغرق حتى 5 ثوانٍ، فيبقى أحد المشاركين منتظراً تلك المدة",
              "لا يمكنك اختيار الـ victim بدون DEADLOCK_PRIORITY، وحتى معه الاختيار نسبي فقط",
              "الـ deadlocks التي تشمل parallel workers داخل استعلام واحد لا يصلحها ترتيب الـ locks",
              "إعادة المحاولة صحيحة فقط إذا كانت الـ transaction idempotent"
            ]
          },
          alts: {
            en: [
              "Serialize the conflicting work through a queue so only one writer touches the rows at a time",
              "Take an application lock (sp_getapplock) on a business key before starting the writes",
              "Use an index so the writer locks only the rows it needs instead of scanning and locking extra ones",
              "Move the second write out of the transaction entirely using the outbox pattern"
            ],
            ar: [
              "تسلسل العمل المتعارض عبر queue بحيث يلمس كاتب واحد فقط الـ rows في كل مرة",
              "أخذ application lock عبر sp_getapplock على مفتاح أعمال قبل بدء الكتابات",
              "استخدام index ليقفل الكاتب الـ rows التي يحتاجها فقط بدل مسح وقفل rows إضافية",
              "إخراج الكتابة الثانية من الـ transaction تماماً باستخدام نمط outbox"
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
          title: { en: "Catching the deadlock and retrying only the failed statement", ar: "التقاط الـ deadlock وإعادة الجملة الفاشلة فقط" },
          body: {
            en: "A developer wrapped the second UPDATE in a try/catch and re-ran just that UPDATE on error 1205. But the deadlock rolled back the whole transaction, including the first UPDATE that set the order to Confirmed. The retry ran outside any transaction and succeeded, so inventory dropped by one for an order that was never confirmed. Stock counts drifted below reality by a few units a day for two months before anyone noticed.",
            ar: "غلّف مطوّر جملة UPDATE الثانية بـ try/catch وأعاد تلك الجملة وحدها عند الخطأ 1205. لكن الـ deadlock تراجع عن الـ transaction كاملة بما فيها UPDATE الأولى التي جعلت الـ order مؤكَّداً. أُعيدت الجملة خارج أي transaction ونجحت، فنقص المخزون واحداً لـ order لم يُؤكَّد أبداً. انحرفت أعداد المخزون تحت الواقع ببضع وحدات يومياً لشهرين قبل أن ينتبه أحد."
          },
          fix: "// Retry the whole unit of work, never one statement.\nawait retryPolicy.ExecuteAsync(async () =>\n{\n    await using var tx = await conn.BeginTransactionAsync(ct);\n    await ConfirmOrderAsync(conn, tx, orderId, ct);\n    await DecrementStockAsync(conn, tx, sku, ct);\n    await tx.CommitAsync(ct);\n});"
        },
        {
          t: "mistake",
          title: { en: "Calling an external API inside the transaction", ar: "استدعاء API خارجي داخل الـ transaction" },
          body: {
            en: "The confirm endpoint called the payment provider between the two UPDATE statements, while holding the exclusive lock on the order row. The provider normally answered in 80 ms but occasionally took 3 seconds. During those 3 seconds every other transaction that needed that order row queued up behind it, which made a deadlock far more likely and turned a rare event into a daily one. Locks are held until COMMIT, so any slow call inside a transaction multiplies the collision window.",
            ar: "كان endpoint التأكيد يستدعي مزوّد الدفع بين جملتَي UPDATE، وهو ممسك بـ exclusive lock على row الـ order. المزوّد كان يجيب عادة خلال 80 ms لكنه أحياناً يستغرق 3 ثوانٍ. خلال تلك الثواني كانت كل transaction أخرى تحتاج ذلك الـ row تصطف خلفه، ما رفع احتمال الـ deadlock كثيراً وحوّل حدثاً نادراً إلى حدث يومي. الـ locks تبقى حتى COMMIT، فأي استدعاء بطيء داخل transaction يضاعف نافذة التصادم."
          }
        },
        {
          t: "mistake",
          title: { en: "Reading with UPDLOCK missing, then writing", ar: "القراءة بدون UPDLOCK ثم الكتابة" },
          body: {
            en: "Two sessions both ran SELECT Qty FROM Inventory WHERE Sku = 'ABC' and each took a shared lock, which they are allowed to hold at the same time. Then both tried to UPDATE the same row, and each needed to upgrade its shared lock to exclusive. Neither could, because the other's shared lock was in the way. This is a conversion deadlock, and it happens on a single row in a single table, so lock ordering does not help. Reading with UPDLOCK takes an update lock up front, which two sessions cannot both hold.",
            ar: "شغّلت جلستان SELECT Qty FROM Inventory WHERE Sku = 'ABC' وأخذت كل منهما shared lock، وهذا مسموح في نفس الوقت. ثم حاولت كل منهما UPDATE لنفس الـ row، واحتاجت كل واحدة ترقية قفلها من shared إلى exclusive. لم تستطع أي منهما، لأن shared lock الأخرى في الطريق. هذا conversion deadlock، ويحدث على row واحد في جدول واحد، فترتيب الـ locks لا يساعد. القراءة بـ UPDLOCK تأخذ update lock مقدماً، ولا يمكن لجلستين إمساكه معاً."
          },
          fix: "SELECT Qty FROM Inventory WITH (UPDLOCK, ROWLOCK)\nWHERE Sku = 'ABC';\n-- then UPDATE the same row in the same transaction"
        },
        {
          t: "mistake",
          title: { en: "Assuming an index change cannot cause deadlocks", ar: "افتراض أن تغيير الـ index لا يسبّب deadlocks" },
          body: {
            en: "Someone dropped a non-clustered index on Inventory.Sku because it looked unused in a monthly report. Without it, the UPDATE ... WHERE Sku = 'ABC' could no longer jump straight to one row; it scanned the table and briefly locked every row it touched on the way. Deadlock rate went from about 3 a day to 400 a day within an hour of the deploy. The lock order had not changed at all — only the set of rows being locked had grown.",
            ar: "حذف أحدهم non-clustered index على Inventory.Sku لأنه بدا غير مستخدَم في تقرير شهري. بدونه لم تعد UPDATE ... WHERE Sku = 'ABC' تقفز مباشرة إلى row واحد؛ صارت تمسح الجدول وتقفل مؤقتاً كل row تمرّ به. ارتفع معدّل الـ deadlock من نحو 3 يومياً إلى 400 يومياً خلال ساعة من النشر. ترتيب الـ locks لم يتغيّر إطلاقاً — ما تغيّر هو اتساع مجموعة الـ rows المقفولة."
          }
        }
      ]
    },
    {
      key: "interview",
      blocks: [
        {
          t: "qa",
          level: "junior",
          q: { en: "What is the difference between blocking and a deadlock?", ar: "ما الفرق بين الـ blocking والـ deadlock؟" },
          a: {
            en: "Blocking is one transaction waiting for another to finish. It is normal, and it clears by itself the moment the first one commits. A deadlock is when that waiting forms a circle: A waits for B and B waits for A, so nothing will ever clear it. SQL Server detects the circle and cancels one of them with error 1205 so the other can continue.",
            ar: "الـ blocking هو انتظار transaction لأخرى حتى تنتهي. هذا طبيعي ويزول وحده لحظة عمل الأولى COMMIT. أما الـ deadlock فهو أن يصير الانتظار دائرة: A ينتظر B و B ينتظر A، فلا شيء سيزيله أبداً. SQL Server يكتشف الدائرة ويلغي واحدة بالخطأ 1205 لتكمل الأخرى."
          }
        },
        {
          t: "qa",
          level: "mid",
          q: { en: "How does SQL Server choose which transaction to kill?", ar: "كيف يختار SQL Server أي transaction يقتل؟" },
          a: {
            en: "By rollback cost — roughly how much transaction log each one has written. The cheaper one to undo becomes the victim. You can influence it with SET DEADLOCK_PRIORITY: give a background job LOW priority and it will be chosen over a customer-facing transaction. That does not reduce the number of deadlocks, it just decides who pays for them.",
            ar: "حسب تكلفة الـ rollback — تقريباً كمية الـ transaction log التي كتبتها كل واحدة. الأرخص في التراجع تصير الـ victim. يمكنك التأثير على ذلك بـ SET DEADLOCK_PRIORITY: أعطِ مهمة خلفية أولوية LOW فتُختار قبل transaction تخصّ عميلاً. هذا لا يقلّل عدد الـ deadlocks، بل يقرّر فقط من يدفع ثمنها."
          }
        },
        {
          t: "qa",
          level: "mid",
          q: { en: "Is it enough to just retry on error 1205?", ar: "هل تكفي إعادة المحاولة عند الخطأ 1205؟" },
          a: {
            en: "It is a necessary safety net but not a fix. Retry is only correct if you retry the whole transaction and the work is idempotent — if the transaction also sent an email or charged a card, the retry duplicates that. And retries hide the trend: the deadlock rate can climb from three a day to hundreds and you will only see it as rising latency. I treat retries as the seatbelt and lock ordering as the brakes.",
            ar: "هي شبكة أمان ضرورية لكنها ليست إصلاحاً. إعادة المحاولة صحيحة فقط إذا أعدت الـ transaction كاملة وكان العمل idempotent — فإذا كانت الـ transaction ترسل بريداً أو تسحب من بطاقة، فستكرّر الإعادة ذلك. كما أن الإعادة تخفي الاتجاه: قد يرتفع معدّل الـ deadlock من ثلاثة يومياً إلى مئات ولن تراه إلا كارتفاع في الـ latency. أعتبر إعادة المحاولة حزام الأمان وترتيب الـ locks الفرامل."
          }
        },
        {
          t: "qa",
          level: "senior",
          q: { en: "You have a deadlock between two sessions on a single row of one table. Lock ordering cannot help. What is happening?", ar: "لديك deadlock بين جلستين على row واحد في جدول واحد. ترتيب الـ locks لا يساعد. ما الذي يحدث؟" },
          a: {
            en: "That is almost always a conversion deadlock. Both sessions read the row first and took a shared lock, which they are allowed to hold together. Then both tried to write, and each needed to convert its shared lock into an exclusive one, which the other's shared lock blocks. The fix is to take the stronger lock at read time with WITH (UPDLOCK) so only one session can be in that position, or to skip the read and write conditionally in one statement.",
            ar: "هذا غالباً conversion deadlock. قرأت الجلستان الـ row أولاً وأخذت كل منهما shared lock، وهذا مسموح معاً. ثم حاولت كل منهما الكتابة، فاحتاجت تحويل قفلها من shared إلى exclusive، وهو ما يمنعه shared lock الأخرى. الحل أخذ القفل الأقوى وقت القراءة بـ WITH (UPDLOCK) بحيث تكون جلسة واحدة فقط في ذلك الموقع، أو تجاوز القراءة والكتابة بشرط داخل جملة واحدة."
          }
        },
        {
          t: "qa",
          level: "senior",
          q: { en: "Would turning on read committed snapshot isolation solve your deadlocks?", ar: "هل تفعيل read committed snapshot isolation سيحلّ الـ deadlocks لديك؟" },
          a: {
            en: "It solves one specific family: deadlocks where a reader and a writer block each other. Under RCSI a reader does not take shared locks at all — it reads the last committed version of the row from tempdb, so it never waits and never appears in a wait-for graph. It does nothing for writer-versus-writer deadlocks, which is what the classic opposite-lock-order case is. And it shifts load onto tempdb, so you size and watch tempdb before turning it on.",
            ar: "يحلّ عائلة واحدة محدّدة: الـ deadlocks التي يمنع فيها قارئ وكاتب بعضهما. تحت RCSI لا يأخذ القارئ shared locks إطلاقاً — يقرأ آخر نسخة مؤكَّدة من الـ row من tempdb، فلا ينتظر ولا يظهر في wait-for graph. لكنه لا يفعل شيئاً لـ deadlocks بين كاتب وكاتب، وهي حالة الترتيب المتعاكس الكلاسيكية. كما ينقل الحمل إلى tempdb، فتقيس حجمه وتراقبه قبل التفعيل."
          }
        },
        {
          t: "qa",
          level: "staff",
          q: { en: "Deadlocks keep coming back in your codebase even after each one is fixed. What do you change structurally?", ar: "الـ deadlocks تعود باستمرار في قاعدة الكود حتى بعد إصلاح كل واحدة. ما الذي تغيّره هيكلياً؟" },
          a: {
            en: "Fixing them one at a time means the rule lives in people's heads. I make it visible and enforced. First, write down a single global lock order for the write-heavy tables and put it in the repository next to the data access code. Second, funnel every multi-table write through a small number of reviewed functions instead of letting any handler open a transaction. Third, make deadlocks a monitored metric with an alert, not a log line, so a regression is caught in hours. Fourth, add a load test that runs the two conflicting endpoints concurrently, so a wrong order fails CI instead of production. The goal is that the next person cannot accidentally write the reversed order.",
            ar: "إصلاحها واحدة واحدة يعني أن القاعدة تعيش في رؤوس الناس. أنا أجعلها مرئية ومفروضة. أولاً، أكتب ترتيب locks عالمياً واحداً للجداول كثيرة الكتابة وأضعه في المستودع بجانب كود الوصول للبيانات. ثانياً، أمرّر كل كتابة متعدّدة الجداول عبر عدد صغير من الدوال المراجَعة بدل ترك أي handler يفتح transaction. ثالثاً، أجعل الـ deadlocks مقياساً مراقَباً مع تنبيه لا مجرد سطر log، ليُلتقط أي تراجع خلال ساعات. رابعاً، أضيف اختبار حمل يشغّل الـ endpointين المتعارضين معاً، ليفشل الترتيب الخاطئ في CI بدل الإنتاج. الهدف أن يصبح من المستحيل على الشخص التالي أن يكتب الترتيب المعكوس بالخطأ."
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
          title: { en: "Two tables written in opposite orders in two handlers", ar: "جدولان يُكتَبان بترتيبَين متعاكسَين في handlerين" },
          bad: "// OrderService.cs\nawait _db.Orders.Where(o => o.Id == id)\n    .ExecuteUpdateAsync(s => s.SetProperty(o => o.Status, \"Confirmed\"), ct);\nawait _db.Inventory.Where(i => i.Sku == sku)\n    .ExecuteUpdateAsync(s => s.SetProperty(i => i.Qty, i => i.Qty - 1), ct);\n\n// InventoryService.cs\nawait _db.Inventory.Where(i => i.Sku == sku)\n    .ExecuteUpdateAsync(s => s.SetProperty(i => i.Qty, newQty), ct);\nawait _db.Orders.Where(o => o.Sku == sku && o.Status == \"Pending\")\n    .ExecuteUpdateAsync(s => s.SetProperty(o => o.Status, \"OnHold\"), ct);",
          good: "// Documented rule: Inventory is always locked before Orders.\n// OrderService.cs\nawait _db.Inventory.Where(i => i.Sku == sku)\n    .ExecuteUpdateAsync(s => s.SetProperty(i => i.Qty, i => i.Qty - 1), ct);\nawait _db.Orders.Where(o => o.Id == id)\n    .ExecuteUpdateAsync(s => s.SetProperty(o => o.Status, \"Confirmed\"), ct);\n\n// InventoryService.cs keeps the same order: Inventory, then Orders.",
          why: {
            en: "Each file reads fine alone, which is why this survives review. Run them at the same moment on the same SKU and you get the exact cycle from the internals section. Picking one order — here Inventory first — and writing that rule down next to the code removes the cycle completely, with no runtime cost.",
            ar: "كل ملف يبدو سليماً وحده، ولهذا ينجو من المراجعة. شغّلهما في نفس اللحظة على نفس الـ SKU وتحصل على نفس الدورة الموجودة في قسم internals. اختيار ترتيب واحد — هنا Inventory أولاً — وكتابة تلك القاعدة بجانب الكود يزيل الدورة تماماً وبدون تكلفة وقت تشغيل."
          }
        },
        {
          t: "review",
          severity: "medium",
          title: { en: "Retry policy that also retries non-deadlock errors", ar: "سياسة إعادة محاولة تعيد أيضاً أخطاء غير الـ deadlock" },
          bad: "var policy = Policy\n    .Handle<SqlException>()               // every SQL error, including constraint violations\n    .RetryAsync(5);                        // no delay at all\n\nawait policy.ExecuteAsync(() => ConfirmOrderAsync(orderId, ct));",
          good: "var policy = Policy\n    .Handle<SqlException>(ex => ex.Number == 1205)   // deadlock victim only\n    .WaitAndRetryAsync(3, attempt =>\n        TimeSpan.FromMilliseconds(\n            Math.Pow(2, attempt) * 50 + Random.Shared.Next(0, 50)));\n\nawait policy.ExecuteAsync(() => ConfirmOrderAsync(orderId, ct));",
          why: {
            en: "Retrying every SqlException means a duplicate-key or foreign-key violation is retried five times, turning one clear error into five identical failures and five wasted round trips. Retrying instantly also makes deadlocks worse: both victims come back at the same moment and collide again. Filtering on error number 1205 and adding a growing delay with a small random amount added spreads the retries apart.",
            ar: "إعادة كل SqlException تعني أن خطأ duplicate-key أو foreign-key سيُعاد خمس مرات، فيتحوّل خطأ واحد واضح إلى خمسة إخفاقات متطابقة وخمس رحلات ضائعة. كما أن الإعادة الفورية تزيد الـ deadlocks سوءاً: يعود الـ victims في نفس اللحظة ويتصادمون مجدداً. الفلترة على رقم الخطأ 1205 وإضافة تأخير متزايد مع مقدار عشوائي صغير يباعد بين المحاولات."
          }
        }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        {
          t: "p",
          en: "In a system design discussion, deadlocks show up the moment you have more than one write path over the same set of tables. The usual shape is an inventory or balance table that several features decrement, plus a second table each feature updates alongside it. The design question is not \"how do we retry\" but \"who is allowed to write these tables, and in what order\".",
          ar: "في نقاش تصميم النظام، تظهر الـ deadlocks لحظة وجود أكثر من مسار كتابة على نفس مجموعة الجداول. الشكل المعتاد جدول مخزون أو رصيد تنقص منه عدة ميزات، مع جدول ثانٍ تحدّثه كل ميزة بجانبه. سؤال التصميم ليس «كيف نعيد المحاولة» بل «من يُسمح له بالكتابة في هذه الجداول، وبأي ترتيب»."
        },
        {
          t: "ul",
          en: [
            "Write the global lock order into the design doc, not just the code: Inventory before Orders, Accounts before Ledger.",
            "Give each hot table one owning service or one owning module, so the number of write paths stays small enough to review.",
            "For the hottest rows, serialize writes through a queue partitioned by the row's key — all writes for SKU ABC go to the same consumer, so they never overlap.",
            "Keep the transaction boundary around database work only. Payments, emails and other external calls go before it or after it, never inside it.",
            "Decide up front whether a failed write is retried by the caller or by a background process, because that decides whether the operation must be idempotent."
          ],
          ar: [
            "اكتب ترتيب الـ locks العالمي في مستند التصميم لا في الكود فقط: Inventory قبل Orders، و Accounts قبل Ledger.",
            "امنح كل جدول ساخن خدمة مالكة واحدة أو module مالكاً واحداً، ليبقى عدد مسارات الكتابة صغيراً بما يكفي للمراجعة.",
            "لأكثر الـ rows سخونة، سلسِل الكتابات عبر queue مقسّم بمفتاح الـ row — كل كتابات SKU ABC تذهب لنفس الـ consumer فلا تتداخل أبداً.",
            "أبقِ حدود الـ transaction حول عمل قاعدة البيانات فقط. المدفوعات والبريد والاستدعاءات الخارجية قبلها أو بعدها، لا داخلها أبداً.",
            "قرّر مسبقاً هل يعيد الكتابة الفاشلة المستدعي أم عملية خلفية، لأن ذلك يحدّد هل يجب أن تكون العملية idempotent."
          ]
        },
        {
          t: "callout",
          kind: "tip",
          en: "A good interview answer here names the trade-off out loud: a queue per key removes deadlocks entirely but adds a hop, a delay and an ordering guarantee you now have to maintain. Consistent lock ordering is free but relies on people following a rule.",
          ar: "الإجابة الجيدة في المقابلة تسمّي المقايضة صراحة: queue لكل مفتاح يزيل الـ deadlocks تماماً لكنه يضيف قفزة وتأخيراً وضمان ترتيب صرت مسؤولاً عن صيانته. أما ترتيب الـ locks الموحّد فمجاني لكنه يعتمد على التزام الناس بقاعدة."
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
                en: "The victim waits up to 5 seconds for detection, then pays a rollback, then the retry runs from scratch. One deadlock can turn a 90 ms request into a multi-second one, which is why deadlocks usually appear first as a p99 spike.",
                ar: "الـ victim ينتظر حتى 5 ثوانٍ للكشف، ثم يدفع rollback، ثم تعمل إعادة المحاولة من الصفر. deadlock واحد يحوّل request مدته 90 ms إلى عدة ثوانٍ، ولهذا تظهر الـ deadlocks أولاً كارتفاع في p99."
              }
            },
            {
              k: { en: "Database CPU", ar: "CPU قاعدة البيانات" },
              v: {
                en: "Every deadlock is wasted work: the victim's reads, writes and log records are all thrown away and then redone. At a few hundred per hour this is measurable CPU spent producing nothing.",
                ar: "كل deadlock عمل ضائع: قراءات الـ victim وكتاباته وسجلات الـ log تُرمى كلها ثم تُعاد. عند بضع مئات في الساعة يصير هذا CPU ملموساً يُنفَق بلا ناتج."
              }
            },
            {
              k: { en: "Scalability", ar: "قابلية التوسّع" },
              v: {
                en: "Deadlock probability grows faster than traffic, because it depends on two paths overlapping. Doubling concurrency on the same rows can roughly quadruple the deadlock rate, so a system that is fine at 100 requests per second can be unusable at 300.",
                ar: "احتمال الـ deadlock ينمو أسرع من نمو الحركة، لأنه يعتمد على تداخل مسارين. مضاعفة التزامن على نفس الـ rows قد تضاعف معدّل الـ deadlock أربع مرات تقريباً، فنظام سليم عند 100 request في الثانية قد يصير غير قابل للاستخدام عند 300."
              }
            },
            {
              k: { en: "Memory (tempdb)", ar: "الذاكرة (tempdb)" },
              v: {
                en: "If you fix reader/writer deadlocks by enabling RCSI, every updated row keeps a previous version in tempdb until no transaction needs it. A long-running report can hold versions alive and grow tempdb by gigabytes.",
                ar: "إذا أصلحت deadlocks القارئ/الكاتب بتفعيل RCSI، فكل row محدَّث يحتفظ بنسخة سابقة في tempdb حتى لا تحتاجها أي transaction. تقرير طويل التشغيل قد يبقي النسخ حيّة ويضخّم tempdb بجيجابايتات."
              }
            },
            {
              k: { en: "Throughput", ar: "الإنتاجية" },
              v: {
                en: "Long transactions hold exclusive locks longer, so the queue behind each hot row gets longer too. Cutting a transaction from 200 ms to 20 ms usually cuts both blocking and deadlocks by roughly the same factor.",
                ar: "الـ transactions الطويلة تمسك الـ exclusive locks لمدة أطول، فيطول الطابور خلف كل row ساخن. تقليص transaction من 200 ms إلى 20 ms يقلّص عادة الـ blocking والـ deadlocks بنفس النسبة تقريباً."
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
            "system_health Extended Events session — it is on by default and already stores recent deadlock reports; query sys.fn_xe_file_target_read_file for the xml_deadlock_report event and read the graph without changing anything on the server.",
            "The deadlock graph XML itself — read the <victim-list> to see who was killed, then each <process> node for its inputbuf (the actual SQL text) and each <resource> node for the object and index name that was locked. Those two names tell you the lock order each side used.",
            "sys.dm_tran_locks joined to sys.dm_exec_requests — run it during live blocking to see which session holds which lock and which is waiting; the wait_type column shows LCK_M_X when a session is waiting for an exclusive lock.",
            "SET DEADLOCK_PRIORITY LOW in your batch and reporting jobs — not a diagnostic, but it makes the background job the victim, so the deadlock graphs you collect keep pointing at the same pair instead of moving around.",
            "A concurrency test that runs the two suspect endpoints in a tight loop against a test database — if the deadlock reproduces in 30 seconds locally you can verify the fix instead of guessing from production logs."
          ],
          ar: [
            "جلسة Extended Events المسماة system_health — مفعّلة افتراضياً وتخزّن تقارير الـ deadlock الأخيرة؛ استعلم sys.fn_xe_file_target_read_file عن حدث xml_deadlock_report واقرأ الرسم دون تغيير أي شيء على الخادم.",
            "ملف الـ deadlock graph بصيغة XML نفسه — اقرأ <victim-list> لترى من قُتل، ثم كل <process> لترى inputbuf (نص الـ SQL الفعلي) وكل <resource> لترى اسم الكائن والـ index المقفول. هذان الاسمان يخبرانك بترتيب الـ locks الذي استخدمه كل طرف.",
            "sys.dm_tran_locks مع sys.dm_exec_requests — شغّلها أثناء blocking حي لترى أي session تمسك أي lock وأيها تنتظر؛ عمود wait_type يظهر LCK_M_X عندما تنتظر session قفلاً exclusive.",
            "SET DEADLOCK_PRIORITY LOW في مهام الدفعات والتقارير — ليست أداة تشخيص، لكنها تجعل المهمة الخلفية هي الـ victim، فتظلّ رسوم الـ deadlock التي تجمعها تشير إلى نفس الزوج بدل أن تتنقّل.",
            "اختبار تزامن يشغّل الـ endpointين المشتبه بهما في حلقة مكثّفة على قاعدة بيانات اختبار — إذا تكرّر الـ deadlock خلال 30 ثانية محلياً تستطيع التحقّق من الإصلاح بدل التخمين من سجلات الإنتاج."
          ]
        },
        {
          t: "callout",
          kind: "tip",
          en: "Read the deadlock graph in this order: victim first, then the two inputbuf blocks side by side, then the two resource names. In almost every case the answer is visible in that last step — one side locked table X then table Y, the other did the opposite.",
          ar: "اقرأ الـ deadlock graph بهذا الترتيب: الـ victim أولاً، ثم كتلتا inputbuf جنباً إلى جنب، ثم اسما الـ resource. في معظم الحالات تكون الإجابة ظاهرة في الخطوة الأخيرة — طرف قفل الجدول X ثم Y، والطرف الآخر فعل العكس."
        }
      ]
    },
    {
      key: "realworld",
      blocks: [
        {
          t: "p",
          en: "Deadlocks concentrate wherever many users compete for the same small set of rows. The row is usually a counter, a balance or a status that everyone must update, and the competition gets worse at exactly the moments the business cares most about — a sale, a payout run, a match kickoff.",
          ar: "تتركّز الـ deadlocks حيث يتنافس مستخدمون كثيرون على نفس المجموعة الصغيرة من الـ rows. الـ row عادة عدّاد أو رصيد أو حالة يجب أن يحدّثها الجميع، ويشتدّ التنافس في نفس اللحظات التي تهمّ العمل أكثر — تخفيضات، دورة صرف، بداية مباراة."
        },
        {
          t: "ul",
          en: [
            "Ticketing and event platforms: thousands of buyers decrement the same seat-availability row in the first minute of a sale, while an admin path adjusts the same rows in a different order.",
            "Payment and ledger systems: transferring money touches two account rows, and two transfers in opposite directions between the same accounts is the textbook cycle.",
            "Warehouse and fulfilment systems: picking, receiving and correction jobs all write stock levels and order lines, each written by a different team at a different time.",
            "Multiplayer game backends: a match-end job writes player stats then leaderboards, while a leaderboard rebuild writes leaderboards then player stats."
          ],
          ar: [
            "منصّات التذاكر والفعاليات: آلاف المشترين ينقصون نفس row توفّر المقاعد في الدقيقة الأولى من البيع، بينما مسار إداري يعدّل نفس الـ rows بترتيب مختلف.",
            "أنظمة المدفوعات والدفاتر: تحويل المال يلمس row حسابَين، وتحويلان باتجاهين متعاكسين بين نفس الحسابين هما الدورة الكلاسيكية.",
            "أنظمة المستودعات والتجهيز: مهام السحب والاستلام والتصحيح كلها تكتب مستويات المخزون وسطور الطلب، وكل واحدة كتبها فريق مختلف في وقت مختلف.",
            "backends ألعاب متعدّدة اللاعبين: مهمة نهاية المباراة تكتب إحصاءات اللاعبين ثم الـ leaderboards، بينما إعادة بناء الـ leaderboard تكتبها أولاً ثم إحصاءات اللاعبين."
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
          en: "Reproduce a deadlock on purpose. Open two query windows, create two small tables A and B with one row each, and in each window run a transaction that updates them in opposite orders with a WAITFOR DELAY '00:00:05' in between. You succeeded when one window returns error 1205 and the other commits.",
          ar: "أعِد إنتاج deadlock عمداً. افتح نافذتي استعلام، أنشئ جدولين صغيرين A و B فيهما row واحد لكل منهما، وفي كل نافذة شغّل transaction تحدّثهما بترتيبين متعاكسين مع WAITFOR DELAY '00:00:05' بينهما. تنجح عندما تُرجِع نافذة الخطأ 1205 وتنجح الأخرى في الـ COMMIT."
        },
        {
          t: "ex",
          diff: "medium",
          en: "Pull the deadlock you just caused out of the system_health session using sys.fn_xe_file_target_read_file, and from the XML alone write down: which session was the victim, the two SQL statements, and the two locked object names in the order each side took them. You succeeded when you can state the lock order of both sides without looking at your original scripts.",
          ar: "استخرج الـ deadlock الذي سبّبته من جلسة system_health باستخدام sys.fn_xe_file_target_read_file، ومن الـ XML وحده اكتب: أي session كانت الـ victim، وجملتَي الـ SQL، واسمَي الكائنين المقفولين بترتيب أخذ كل طرف لهما. تنجح عندما تستطيع ذكر ترتيب الـ locks للطرفين دون النظر إلى سكربتاتك الأصلية."
        },
        {
          t: "ex",
          diff: "hard",
          en: "Build the two endpoints from this lesson in ASP.NET Core over a real database, then run them concurrently with 50 parallel callers on the same SKU for two minutes and record the deadlock count. Fix it by lock ordering only — no retries — and run the same load again. You succeeded when the count goes from clearly non-zero to zero with no change to the retry code.",
          ar: "ابنِ الـ endpointين من هذا الدرس في ASP.NET Core فوق قاعدة بيانات حقيقية، ثم شغّلهما معاً بـ 50 مستدعياً متوازياً على نفس الـ SKU لدقيقتين وسجّل عدد الـ deadlocks. أصلحه بترتيب الـ locks فقط — بدون إعادة محاولة — وأعِد نفس الحمل. تنجح عندما ينتقل العدد من رقم واضح غير صفري إلى صفر دون أي تغيير في كود إعادة المحاولة."
        },
        {
          t: "ex",
          diff: "senior",
          en: "Take the same load test and instead reproduce a conversion deadlock: have both callers SELECT the row and then UPDATE it inside one transaction. Show that lock ordering does not fix it, then fix it with WITH (UPDLOCK) on the SELECT. Write a short note explaining to a teammate why the first fix could not have worked.",
          ar: "خذ نفس اختبار الحمل وأعِد بدلاً من ذلك إنتاج conversion deadlock: اجعل كلا المستدعيَين ينفّذ SELECT للـ row ثم UPDATE داخل transaction واحدة. أظهِر أن ترتيب الـ locks لا يصلحه، ثم أصلحه بـ WITH (UPDLOCK) على الـ SELECT. اكتب ملاحظة قصيرة تشرح لزميل لماذا لم يكن الإصلاح الأول ليعمل."
        }
      ]
    },
    {
      key: "refs",
      blocks: [
        {
          t: "ref",
          label: { en: "SQL Server deadlocks guide", ar: "دليل الـ deadlocks في SQL Server" },
          url: "https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-deadlocks-guide",
          meta: { en: "Docs", ar: "توثيق" }
        },
        {
          t: "ref",
          label: { en: "Transaction locking and row versioning guide", ar: "دليل الـ locking و row versioning" },
          url: "https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide",
          meta: { en: "Docs", ar: "توثيق" }
        },
        {
          t: "ref",
          label: { en: "Analyze and prevent deadlocks in Azure SQL Database", ar: "تحليل ومنع الـ deadlocks في Azure SQL Database" },
          url: "https://learn.microsoft.com/en-us/azure/azure-sql/database/analyze-prevent-deadlocks",
          meta: { en: "Guide", ar: "دليل" }
        },
        {
          t: "ref",
          label: { en: "EF Core connection resiliency and retry strategies", ar: "مرونة الاتصال واستراتيجيات إعادة المحاولة في EF Core" },
          url: "https://learn.microsoft.com/en-us/ef/core/miscellaneous/connection-resiliency",
          meta: { en: "Docs", ar: "توثيق" }
        }
      ]
    }
  ],
  quiz: [
    {
      q: {
        en: "What distinguishes a deadlock from ordinary blocking?",
        ar: "ما الذي يميّز الـ deadlock عن الـ blocking العادي؟"
      },
      options: [
        { en: "A deadlock only happens on tables without indexes", ar: "الـ deadlock يحدث فقط على جداول بلا indexes" },
        { en: "The waiting forms a cycle, so it can never resolve on its own", ar: "الانتظار يشكّل دورة، فلا يمكن أن يُحلّ من تلقاء نفسه" },
        { en: "A deadlock is always caused by a long-running query", ar: "الـ deadlock سببه دائماً استعلام طويل التشغيل" },
        { en: "Blocking rolls back the transaction, a deadlock does not", ar: "الـ blocking يتراجع عن الـ transaction، والـ deadlock لا" }
      ],
      correct: 1,
      why: {
        en: "Blocking is one-directional and clears when the holder commits. A deadlock is circular — each side holds what the other needs — so it never clears without someone being killed.",
        ar: "الـ blocking باتجاه واحد ويزول عندما تعمل الممسكة COMMIT. أما الـ deadlock فدائري — كل طرف يمسك ما يحتاجه الآخر — فلا يزول أبداً دون قتل أحدهما."
      }
    },
    {
      q: {
        en: "How does SQL Server decide which transaction becomes the victim?",
        ar: "كيف يقرّر SQL Server أي transaction تصير الـ victim؟"
      },
      options: [
        { en: "The one that started last", ar: "التي بدأت أخيراً" },
        { en: "The one holding the most locks", ar: "التي تمسك أكبر عدد من الـ locks" },
        { en: "The one that is cheapest to roll back, unless DEADLOCK_PRIORITY says otherwise", ar: "الأرخص في التراجع، إلا إذا قال DEADLOCK_PRIORITY غير ذلك" },
        { en: "The one connected from the slowest client", ar: "التي تتصل من أبطأ عميل" }
      ],
      correct: 2,
      why: {
        en: "Victim selection is based on rollback cost — roughly the amount of transaction log written. SET DEADLOCK_PRIORITY lets you override the choice, for example so a background job always loses.",
        ar: "اختيار الـ victim مبني على تكلفة الـ rollback — تقريباً كمية الـ transaction log المكتوبة. و SET DEADLOCK_PRIORITY يسمح بتجاوز الاختيار، مثلاً ليخسر عمل خلفي دائماً."
      }
    },
    {
      q: {
        en: "Two sessions each SELECT the same row, then each UPDATE it, and they deadlock. What is this called and what fixes it?",
        ar: "جلستان تنفّذان SELECT لنفس الـ row ثم UPDATE له، فيحدث deadlock. ما اسم هذا وما الذي يصلحه؟"
      },
      options: [
        { en: "A conversion deadlock; read with WITH (UPDLOCK) so only one session can hold the upgrade path", ar: "conversion deadlock؛ اقرأ بـ WITH (UPDLOCK) ليكون مسار الترقية لجلسة واحدة فقط" },
        { en: "A lock escalation deadlock; add more memory to the server", ar: "deadlock بسبب lock escalation؛ أضف ذاكرة للخادم" },
        { en: "An ordering deadlock; swap the order of the two tables", ar: "deadlock ترتيب؛ بدّل ترتيب الجدولين" },
        { en: "A parallelism deadlock; set MAXDOP to 1", ar: "deadlock توازٍ؛ اضبط MAXDOP على 1" }
      ],
      correct: 0,
      why: {
        en: "Both sessions hold a shared lock on the same row and each needs to convert it to exclusive, which the other's shared lock blocks. Only one table and one row are involved, so lock ordering cannot help; taking an update lock at read time can.",
        ar: "كلتا الجلستين تمسك shared lock على نفس الـ row وتحتاج تحويله إلى exclusive، وهو ما يمنعه shared lock الأخرى. جدول واحد و row واحد فقط، فترتيب الـ locks لا يساعد؛ لكن أخذ update lock وقت القراءة يساعد."
      }
    },
    {
      q: {
        en: "Why is retrying only the statement that returned error 1205 wrong?",
        ar: "لماذا تكون إعادة الجملة التي أرجعت الخطأ 1205 وحدها خطأً؟"
      },
      options: [
        { en: "Because error 1205 cannot be caught in .NET", ar: "لأن الخطأ 1205 لا يمكن التقاطه في .NET" },
        { en: "Because the retry needs a new connection string", ar: "لأن إعادة المحاولة تحتاج connection string جديداً" },
        { en: "Because the whole transaction was rolled back, so earlier statements are gone and the retry runs on partial state", ar: "لأن الـ transaction كاملة تراجعت، فالجمل السابقة اختفت وتعمل الإعادة على حالة ناقصة" },
        { en: "Because SQL Server blocks the session for 5 seconds after a deadlock", ar: "لأن SQL Server يمنع الـ session لخمس ثوانٍ بعد الـ deadlock" }
      ],
      correct: 2,
      why: {
        en: "A deadlock rolls the victim back completely. Re-running one statement leaves the earlier work undone, which is how the inventory count in the lesson drifted away from reality. Always retry the whole unit of work.",
        ar: "الـ deadlock يتراجع عن الـ victim بالكامل. إعادة جملة واحدة تترك العمل السابق ملغى، وهكذا انحرف عدّاد المخزون في الدرس عن الواقع. أعِد دائماً وحدة العمل كاملة."
      }
    },
    {
      q: {
        en: "Which deadlocks does enabling read committed snapshot isolation (RCSI) remove?",
        ar: "أي deadlocks يزيلها تفعيل read committed snapshot isolation (RCSI)؟"
      },
      options: [
        { en: "All of them, because readers and writers stop taking locks", ar: "كلها، لأن القرّاء والكتّاب يتوقّفون عن أخذ locks" },
        { en: "Only those where a reader and a writer block each other, since readers stop taking shared locks", ar: "فقط تلك التي يمنع فيها قارئ وكاتب بعضهما، لأن القرّاء يتوقّفون عن أخذ shared locks" },
        { en: "Only conversion deadlocks on a single row", ar: "فقط conversion deadlocks على row واحد" },
        { en: "None; RCSI is only about performance of large scans", ar: "لا شيء؛ RCSI يخصّ أداء المسوحات الكبيرة فقط" }
      ],
      correct: 1,
      why: {
        en: "Under RCSI a reader reads the last committed version of a row from tempdb instead of waiting for a lock, so reader/writer cycles disappear. Writer-versus-writer deadlocks, including the opposite-lock-order case, are unaffected.",
        ar: "تحت RCSI يقرأ القارئ آخر نسخة مؤكَّدة من الـ row من tempdb بدل انتظار قفل، فتختفي دورات القارئ/الكاتب. أما الـ deadlocks بين كاتب وكاتب، ومنها حالة الترتيب المتعاكس، فلا تتأثّر."
      }
    }
  ]
};
```

NEXT: retries
