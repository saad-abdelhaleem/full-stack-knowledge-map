```js
const outboxLesson = {
  id: "outbox",
  moduleId: "distributed",
  title: { en: "Outbox and exactly-once delivery", ar: "الـ outbox والتوصيل مرة واحدة" },
  summary: {
    en: "How to save data and send a message together, reliably, when the database and the message broker are two separate systems that can fail on their own.",
    ar: "كيف تحفظ البيانات وترسل رسالة معاً وبشكل موثوق، عندما يكون الـ database والـ message broker نظامين منفصلين قد يفشل كل منهما وحده."
  },
  mins: 19,
  sections: [
    {
      key: "why",
      blocks: [
        {
          t: "p",
          en: "The outbox pattern lets you update your database and send a message as one all-or-nothing step, even though the database and the message broker are two separate systems. Without it you can save an order but fail to announce it — or announce an order that was never saved — and the two systems drift apart.",
          ar: "الـ outbox pattern يتيح لك تحديث الـ database وإرسال رسالة كخطوة واحدة إما تنجح كلها أو تفشل كلها، رغم أن الـ database والـ message broker نظامان منفصلان. بدونه قد تحفظ order وتفشل في إعلانها، أو تعلن order لم تُحفظ أصلاً، فيبتعد النظامان عن بعضهما."
        },
        {
          t: "kv",
          rows: [
            { k: { en: "message broker", ar: "message broker" }, v: { en: "A separate service (RabbitMQ, Kafka, Azure Service Bus) that carries messages from one application to others.", ar: "خدمة منفصلة (RabbitMQ أو Kafka أو Azure Service Bus) تنقل الرسائل من تطبيق إلى تطبيقات أخرى." } },
            { k: { en: "dual write", ar: "dual write" }, v: { en: "Writing to two independent systems (a database and a broker) in one operation, with no shared transaction to keep them in step.", ar: "الكتابة إلى نظامين مستقلين (database وbroker) في عملية واحدة، دون transaction مشترك يبقيهما متوافقين." } },
            { k: { en: "transaction", ar: "transaction" }, v: { en: "A group of database changes that all commit together or all roll back; nothing partial survives.", ar: "مجموعة تغييرات في الـ database تُثبَّت كلها معاً أو تُلغى كلها؛ لا شيء ناقص يبقى." } },
            { k: { en: "outbox", ar: "outbox" }, v: { en: "An extra table in your own database where you write the message as part of the same transaction as your data.", ar: "جدول إضافي داخل الـ database عندك، تكتب فيه الرسالة كجزء من نفس الـ transaction الخاص ببياناتك." } },
            { k: { en: "relay", ar: "relay" }, v: { en: "A background process that reads unsent rows from the outbox table and pushes them to the broker.", ar: "عملية خلفية تقرأ الصفوف غير المُرسَلة من جدول الـ outbox وتدفعها إلى الـ broker." } },
            { k: { en: "idempotency", ar: "idempotency" }, v: { en: "An operation that gives the same result whether it runs once or many times, so a duplicate does no harm.", ar: "عملية تعطي نفس النتيجة سواء نُفِّذت مرة أو مرات، فلا يسبب التكرار أي ضرر." } }
          ]
        },
        {
          t: "p",
          en: "Take a place-order endpoint. It must do two things: save the order row, and publish an 'OrderPlaced' message so the email service and the inventory service react. That is two writes to two systems. If the database commit succeeds but the broker send times out, the order exists but nobody is told: no confirmation email, no stock decrement.",
          ar: "خذ endpoint لإنشاء order. عليه أن يفعل شيئين: يحفظ صف الـ order، وينشر رسالة 'OrderPlaced' كي يتفاعل معها الـ email service والـ inventory service. هذه كتابتان إلى نظامين. لو نجح commit في الـ database لكن انتهت مهلة إرسال الـ broker، تبقى الـ order موجودة لكن لا أحد يعلم: لا email تأكيد ولا خصم من المخزون."
        },
        {
          t: "p",
          en: "Think of mailing a signed contract. You file your copy in your cabinet (the database) and drop the other copy in the post box (the broker). If you file yours but the post send fails, your two records disagree. The outbox fixes this by writing the outgoing letter into your own cabinet first — in the same drawer as your record — and a courier picks it up later. Filing both copies is now one action.",
          ar: "تخيل إرسال عقد موقّع بالبريد. تحفظ نسختك في خزانتك (الـ database) وتضع النسخة الأخرى في صندوق البريد (الـ broker). لو حفظت نسختك وفشل الإرسال، تختلف نسختاك. الـ outbox يحل هذا بكتابة الرسالة الصادرة في خزانتك أولاً، في نفس الدرج مع سجلك، ثم يمر ساعٍ لاحقاً ويأخذها. حفظ النسختين صار عملاً واحداً."
        },
        {
          t: "callout",
          kind: "note",
          en: "The outbox does not remove duplicates. The relay can crash after sending but before marking the row sent, so the same message may go out twice. Exactly-once is reached by pairing the outbox (never lose a message) with idempotent consumers (a duplicate does no harm).",
          ar: "الـ outbox لا يمنع التكرار. قد يتعطل الـ relay بعد الإرسال وقبل تعليم الصف كمُرسَل، فتخرج نفس الرسالة مرتين. تُحقَّق exactly-once بجمع الـ outbox (لا تفقد رسالة) مع consumers من نوع idempotent (التكرار لا يضر)."
        }
      ]
    },
    {
      key: "problem",
      blocks: [
        {
          t: "p",
          en: "This is the dual-write problem. Your handler saves the order and then calls the broker — two steps, two systems, and no single transaction wrapping both. A failure between the two steps leaves the systems inconsistent, and there is no ordering of the two calls that closes every gap.",
          ar: "هذه هي مشكلة الـ dual write. الـ handler يحفظ الـ order ثم يستدعي الـ broker — خطوتان، نظامان، ولا transaction واحد يغلّف الاثنين. أي فشل بين الخطوتين يترك النظامين غير متوافقين، ولا يوجد ترتيب للاستدعاءين يغلق كل الثغرات."
        },
        {
          t: "kv",
          rows: [
            { k: { en: "DB commit succeeds, broker send fails", ar: "نجح commit في الـ DB وفشل إرسال الـ broker" }, v: { en: "The order exists but no message goes out. Downstream never reacts: no email, stock not reduced.", ar: "الـ order موجودة لكن لا رسالة تخرج. لا يتفاعل ما بعده: لا email ولا خصم مخزون." } },
            { k: { en: "Broker send succeeds, DB commit rolls back", ar: "نجح إرسال الـ broker وأُلغي commit في الـ DB" }, v: { en: "A message went out for an order that does not exist. Consumers act on a phantom order.", ar: "خرجت رسالة عن order غير موجودة. يتصرّف الـ consumers بناءً على order وهمية." } },
            { k: { en: "Send before commit, then commit", ar: "الإرسال قبل commit ثم commit" }, v: { en: "A consumer may read the order before it is committed and find nothing (a read-your-write gap).", ar: "قد يقرأ consumer الـ order قبل تثبيتها فلا يجد شيئاً (ثغرة read-your-write)." } },
            { k: { en: "Retry the send after a crash", ar: "إعادة الإرسال بعد تعطّل" }, v: { en: "You cannot tell if the first send arrived, so you either risk a duplicate or a silent loss.", ar: "لا تعرف إن وصل الإرسال الأول، فتخاطر إما بتكرار أو بفقدان صامت." } }
          ]
        },
        {
          t: "p",
          en: "The numbers make it real. A system processing 50,000 orders a day with a broker send-failure rate of just 0.1% loses about 50 announcements a day — meaning around 50 customers a day are charged with no confirmation and no inventory update. That is not a rare edge case; it is a steady daily leak that support and finance eventually notice.",
          ar: "الأرقام توضح الأمر. نظام يعالج 50,000 order يومياً بنسبة فشل إرسال في الـ broker قدرها 0.1% فقط يفقد نحو 50 إعلاناً يومياً — أي نحو 50 عميلاً يومياً يُدفع لهم بلا تأكيد وبلا تحديث مخزون. هذه ليست حالة نادرة، بل تسريب يومي ثابت يلاحظه الـ support والـ finance في النهاية."
        }
      ]
    },
    {
      key: "internals",
      blocks: [
        {
          t: "p",
          en: "There are two moving parts: an outbox table that lives in the same database as your business data, and a relay — a background worker that forwards rows from that table to the broker. The trick is that the message row and the business row are inserted in one database transaction, so they are atomic: all-or-nothing, both saved or neither.",
          ar: "هناك جزءان متحركان: جدول outbox يعيش في نفس الـ database مع بياناتك، وrelay — عامل خلفي يمرّر الصفوف من هذا الجدول إلى الـ broker. الحيلة أن صف الرسالة وصف البيانات يُدرَجان في transaction واحد، فيكونان atomic: إما الكل أو لا شيء، يُحفظان معاً أو لا يُحفظ أي منهما."
        },
        {
          t: "kv",
          rows: [
            { k: { en: "Outbox table", ar: "جدول Outbox" }, v: { en: "Columns: Id, Type, Payload (the serialized message), CreatedAt, ProcessedAt (null until sent).", ar: "أعمدة: Id وType وPayload (الرسالة مُسلسَلة) وCreatedAt وProcessedAt (null حتى الإرسال)." } },
            { k: { en: "The transaction", ar: "الـ transaction" }, v: { en: "One SaveChanges wrapping the business row and the outbox row together.", ar: "SaveChanges واحد يغلّف صف البيانات وصف الـ outbox معاً." } },
            { k: { en: "The relay", ar: "الـ relay" }, v: { en: "A loop that polls unprocessed rows, publishes each, then marks ProcessedAt.", ar: "حلقة تستعلم عن الصفوف غير المعالَجة، تنشر كل واحد، ثم تعلّم ProcessedAt." } },
            { k: { en: "The broker", ar: "الـ broker" }, v: { en: "The external system that finally receives and delivers the message to consumers.", ar: "النظام الخارجي الذي يستقبل الرسالة أخيراً ويسلّمها للـ consumers." } }
          ]
        },
        {
          t: "code",
          lang: "csharp",
          label: { en: "Step 1 — write order and message in one transaction", ar: "الخطوة 1 — اكتب الـ order والرسالة في transaction واحد" },
          code: "public async Task PlaceOrder(Order order, OrderPlaced evt)\n{\n    db.Orders.Add(order);\n    db.Outbox.Add(new OutboxMessage {\n        Id = Guid.NewGuid(),\n        Type = \"OrderPlaced\",\n        Payload = JsonSerializer.Serialize(evt),\n        CreatedAt = DateTime.UtcNow\n    });\n    // one SaveChanges = one transaction: order + message commit together\n    await db.SaveChangesAsync();\n}"
        },
        {
          t: "p",
          en: "Because both inserts share one transaction, the failure windows from the problem section disappear. There is no moment where the order is committed but the message is not, or the reverse. The handler never talks to the broker at all — it only writes to its own database, which it can do atomically.",
          ar: "لأن الإدراجين يتشاركان transaction واحداً، تختفي نوافذ الفشل من قسم المشكلة. لا توجد لحظة تكون فيها الـ order مثبَّتة والرسالة لا، أو العكس. الـ handler لا يكلّم الـ broker إطلاقاً — يكتب فقط إلى الـ database الخاص به، وهو ما يستطيع فعله بشكل atomic."
        },
        {
          t: "code",
          lang: "csharp",
          label: { en: "Step 2 — the relay loop (runs in the background)", ar: "الخطوة 2 — حلقة الـ relay (تعمل في الخلفية)" },
          code: "var pending = await db.Outbox\n    .Where(m => m.ProcessedAt == null)\n    .OrderBy(m => m.CreatedAt)\n    .Take(100)\n    .ToListAsync();\n\nforeach (var m in pending)\n{\n    await broker.PublishAsync(m.Type, m.Payload);  // publish first\n    m.ProcessedAt = DateTime.UtcNow;               // mark only after ack\n}\nawait db.SaveChangesAsync();"
        },
        {
          t: "p",
          en: "The relay is like a mailroom clerk who checks the outgoing tray every second, sends whatever is there, and stamps each item 'sent'. If the clerk faints right after dropping a letter in the post but before stamping it, next round he sends it again — the recipient might get two. That is why the relay is at-least-once, not exactly-once: it never loses a message, but it can repeat one. An alternative to polling is Change Data Capture (CDC) — a tool like Debezium tails the database's write log and emits the outbox rows for you, with no polling query.",
          ar: "الـ relay مثل موظف غرفة بريد يفحص صينية الصادر كل ثانية، يرسل ما فيها، ويختم كل عنصر بـ 'مُرسَل'. لو أُغمي عليه فور وضع رسالة في البريد وقبل ختمها، يرسلها مجدداً في الجولة التالية — قد يستلم المتلقي نسختين. لهذا الـ relay هو at-least-once لا exactly-once: لا يفقد رسالة لكنه قد يكررها. بديل الـ polling هو Change Data Capture (CDC) — أداة مثل Debezium تتابع سجل الكتابة في الـ database وتُصدِر صفوف الـ outbox نيابةً عنك، دون استعلام polling."
        }
      ]
    },
    {
      key: "tradeoffs",
      blocks: [
        {
          t: "tradeoff",
          pros: {
            en: ["No lost messages: they survive even if the broker is down when the order is placed.", "One local transaction — no slow distributed transaction across two systems.", "Works with any broker, since the handler only writes to its own database.", "Gives an audit trail: every message ever published is a row you can inspect."],
            ar: ["لا رسائل مفقودة: تبقى حتى لو كان الـ broker متوقفاً وقت إنشاء الـ order.", "transaction محلي واحد — دون transaction موزّع بطيء عبر نظامين.", "يعمل مع أي broker، لأن الـ handler يكتب فقط إلى الـ database الخاص به.", "يوفّر سجل تدقيق: كل رسالة نُشرت هي صف يمكنك فحصه."]
          },
          cons: {
            en: ["Adds latency: a message goes out after the next poll, not instantly.", "Needs a background relay that must run and be monitored.", "Duplicates are still possible, so consumers must be idempotent.", "The outbox table grows and needs regular cleanup."],
            ar: ["يضيف latency: الرسالة تخرج بعد الـ poll التالي لا فوراً.", "يحتاج relay خلفياً يجب أن يعمل ويُراقَب.", "التكرار ما زال ممكناً، فيجب أن تكون الـ consumers من نوع idempotent.", "جدول الـ outbox يكبر ويحتاج تنظيفاً منتظماً."]
          },
          limits: {
            en: ["Only covers messages that originate from a database write.", "Does not help if the consumer's side effect is itself non-idempotent.", "Polling adds steady database load at high message volume."],
            ar: ["يغطي فقط الرسائل الناشئة عن كتابة في الـ database.", "لا يفيد إن كان أثر الـ consumer نفسه غير idempotent.", "الـ polling يضيف حملاً ثابتاً على الـ database عند حجم رسائل كبير."]
          },
          alts: {
            en: ["Distributed transaction (two-phase commit): strong but slow and poorly supported by brokers.", "Change Data Capture (Debezium): tail the DB log instead of polling.", "Event sourcing: the event store is the source of truth, so there is no second write."],
            ar: ["transaction موزّع (two-phase commit): قوي لكنه بطيء وضعيف الدعم من الـ brokers.", "Change Data Capture (Debezium): تابع سجل الـ DB بدل الـ polling.", "Event sourcing: مخزن الأحداث هو مصدر الحقيقة، فلا توجد كتابة ثانية."]
          }
        }
      ]
    },
    {
      key: "mistakes",
      blocks: [
        {
          t: "mistake",
          title: { en: "Calling the broker from the request handler", ar: "استدعاء الـ broker من داخل الـ handler" },
          body: {
            en: "A team saved the order with SaveChanges, then called broker.Publish right after. That is the dual write again. When the broker had a 3-second blip during a sale, hundreds of orders committed with no OrderPlaced message, and the fix was manual replay from logs.",
            ar: "فريق حفظ الـ order بـ SaveChanges ثم استدعى broker.Publish مباشرة. هذه هي الـ dual write من جديد. حين تعطّل الـ broker 3 ثوانٍ أثناء عرض بيع، ثُبِّتت مئات الـ orders بلا رسالة OrderPlaced، وكان الإصلاح إعادة تشغيل يدوية من الـ logs."
          },
          fix: "db.Orders.Add(order);\ndb.Outbox.Add(new OutboxMessage { Type = \"OrderPlaced\", Payload = payload });\nawait db.SaveChangesAsync(); // no broker call in the request"
        },
        {
          t: "mistake",
          title: { en: "Marking the row processed before the broker confirms", ar: "تعليم الصف كمعالَج قبل تأكيد الـ broker" },
          body: {
            en: "The relay set ProcessedAt and then published. When a publish threw, the row was already marked done, so it was never retried and the message was lost. Always publish first and mark only after the broker acknowledges.",
            ar: "الـ relay ضبط ProcessedAt ثم نشر. حين رمى النشر استثناءً، كان الصف مُعلَّماً كمكتمل، فلم يُعَد أبداً وضاعت الرسالة. انشر أولاً دائماً وعلّم فقط بعد أن يؤكّد الـ broker."
          },
          fix: "await broker.PublishAsync(m.Type, m.Payload); // ack first\nm.ProcessedAt = DateTime.UtcNow;              // then mark"
        },
        {
          t: "mistake",
          title: { en: "Assuming the outbox alone gives exactly-once", ar: "افتراض أن الـ outbox وحده يعطي exactly-once" },
          body: {
            en: "A payments team believed the outbox meant no duplicates, so consumers were not idempotent. The relay crashed mid-batch, resent messages on restart, and a few customers were charged twice. The outbox guarantees delivery, not uniqueness — dedup on the consumer.",
            ar: "فريق مدفوعات ظنّ أن الـ outbox يعني لا تكرار، فلم تكن الـ consumers idempotent. تعطّل الـ relay في منتصف دفعة، وأعاد الإرسال عند التشغيل، فدُفع لبعض العملاء مرتين. الـ outbox يضمن التوصيل لا التفرّد — أزل التكرار عند الـ consumer."
          },
          fix: "if (await db.Processed.AnyAsync(p => p.MessageId == id)) return;\n// ... apply the effect ...\ndb.Processed.Add(new Processed { MessageId = id });"
        },
        {
          t: "mistake",
          title: { en: "Two relay instances polling the same rows", ar: "نسختا relay تستعلمان عن نفس الصفوف" },
          body: {
            en: "To scale, the team ran two relay instances. Both selected the same unprocessed rows and both published them, doubling every message. Without row-level locking, parallel pollers collide. Lock the rows you claim so a second poller skips them.",
            ar: "للتوسّع، شغّل الفريق نسختي relay. اختارت كلتاهما نفس الصفوف غير المعالَجة ونشرتهما، فتضاعفت كل رسالة. دون قفل على مستوى الصف، تتصادم الـ pollers المتوازية. اقفل الصفوف التي تأخذها كي تتخطاها النسخة الثانية."
          },
          fix: "SELECT TOP (100) * FROM Outbox WITH (UPDLOCK, READPAST)\nWHERE ProcessedAt IS NULL ORDER BY CreatedAt;"
        }
      ]
    },
    {
      key: "interview",
      blocks: [
        {
          t: "qa",
          level: "junior",
          q: { en: "What problem does the transactional outbox solve?", ar: "ما المشكلة التي يحلها الـ transactional outbox؟" },
          a: {
            en: "It solves the dual-write problem: you need to save data and send a message, but the database and the broker are separate systems with no shared transaction. The outbox writes the message into a table in the same database, in the same transaction as the data, so both commit together. A background relay sends it to the broker afterward.",
            ar: "يحل مشكلة الـ dual write: تحتاج حفظ بيانات وإرسال رسالة، لكن الـ database والـ broker نظامان منفصلان بلا transaction مشترك. الـ outbox يكتب الرسالة في جدول داخل نفس الـ database، في نفس الـ transaction مع البيانات، فيُثبَّتان معاً. ثم يرسلها relay خلفي إلى الـ broker لاحقاً."
          }
        },
        {
          t: "qa",
          level: "mid",
          q: { en: "Why not just use a distributed transaction across the database and the broker?", ar: "لماذا لا نستخدم فقط transaction موزّعاً عبر الـ database والـ broker؟" },
          a: {
            en: "Distributed transactions (two-phase commit) coordinate a commit across both systems, but they are slow, they hold locks while waiting for every participant, and most modern brokers like Kafka do not support them well. They also fail badly under partial failure. The outbox needs only one local transaction, which every database already does fast and reliably.",
            ar: "الـ transactions الموزّعة (two-phase commit) تنسّق commit عبر النظامين، لكنها بطيئة، وتحتجز أقفالاً أثناء انتظار كل مشارك، ومعظم الـ brokers الحديثة مثل Kafka لا تدعمها جيداً. كما تفشل بشكل سيئ تحت الفشل الجزئي. الـ outbox يحتاج transaction محلياً واحداً فقط، وهو ما يفعله كل database بسرعة وموثوقية."
          }
        },
        {
          t: "qa",
          level: "mid",
          q: { en: "Does the outbox give you exactly-once delivery?", ar: "هل يعطيك الـ outbox توصيلاً exactly-once؟" },
          a: {
            en: "Not on its own. The outbox guarantees a message is never lost, but the relay can crash after publishing and before marking the row sent, so the same message may go out twice — that is at-least-once. You get effectively exactly-once by making consumers idempotent: they record each message id they have handled and ignore repeats.",
            ar: "ليس وحده. الـ outbox يضمن ألا تُفقَد رسالة، لكن الـ relay قد يتعطّل بعد النشر وقبل تعليم الصف كمُرسَل، فتخرج نفس الرسالة مرتين — هذا at-least-once. تحصل عملياً على exactly-once بجعل الـ consumers idempotent: تسجّل كل message id عالجته وتتجاهل التكرار."
          }
        },
        {
          t: "qa",
          level: "senior",
          q: { en: "How does the relay avoid sending the same message twice, and can it fully?", ar: "كيف يتجنّب الـ relay إرسال نفس الرسالة مرتين، وهل يمكنه تماماً؟" },
          a: {
            en: "It publishes first and only marks ProcessedAt after the broker acknowledges, and it locks the rows it claims so parallel relays do not grab the same ones. But it can never be fully single-send: the gap between a successful publish and the mark is a place to crash, and on restart it will resend. So we accept at-least-once at the relay and push uniqueness to idempotent consumers, which is cheaper and more robust than trying to make the relay perfect.",
            ar: "ينشر أولاً ولا يعلّم ProcessedAt إلا بعد أن يؤكّد الـ broker، ويقفل الصفوف التي يأخذها كي لا تأخذ الـ relays المتوازية نفسها. لكنه لا يمكن أن يكون مُرسِلاً وحيداً تماماً: الفجوة بين نشر ناجح والتعليم مكان قابل للتعطّل، وعند التشغيل سيعيد الإرسال. لذا نقبل at-least-once عند الـ relay وندفع التفرّد إلى consumers من نوع idempotent، وهو أرخص وأمتن من محاولة جعل الـ relay مثالياً."
          }
        },
        {
          t: "qa",
          level: "senior",
          q: { en: "Polling versus Change Data Capture for the relay — when would you pick each?", ar: "الـ polling مقابل Change Data Capture للـ relay — متى تختار كلاً منهما؟" },
          a: {
            en: "Polling is simple: a query every second for unprocessed rows. It is easy to run and debug, but it adds constant database load and adds latency equal to the poll interval. CDC, using a tool like Debezium, tails the database's write-ahead log and emits outbox rows with near-zero lag and no polling query, but it is more infrastructure to operate and tie into. I start with polling and move to CDC only when the polling load or the added latency becomes a measured problem.",
            ar: "الـ polling بسيط: استعلام كل ثانية عن الصفوف غير المعالَجة. سهل التشغيل والتصحيح، لكنه يضيف حملاً ثابتاً على الـ database وlatency بقدر فترة الـ poll. الـ CDC، بأداة مثل Debezium، يتابع سجل الكتابة في الـ database ويُصدِر صفوف الـ outbox بتأخير شبه معدوم ودون استعلام polling، لكنه بنية أكثر لتشغيلها وربطها. أبدأ بالـ polling وأنتقل إلى الـ CDC فقط حين يصبح حمل الـ polling أو الـ latency مشكلة مقيسة."
          }
        },
        {
          t: "qa",
          level: "staff",
          q: { en: "How do you make outbox plus idempotency a default across many teams, not something each reinvents?", ar: "كيف تجعل الـ outbox مع الـ idempotency افتراضياً عبر فرق كثيرة، لا شيئاً يعيد كل فريق اختراعه؟" },
          a: {
            en: "I ship it as shared infrastructure, not documentation. A small library gives one call that writes a domain event to the outbox inside the current transaction, plus a hosted relay and a consumer wrapper that dedups on message id automatically. Teams get reliability by using the platform's publish and subscribe, without hand-rolling tables or poll loops. I back it with a lint or architecture test that flags any direct broker.Publish in a request path, and dashboards for outbox backlog that the platform team owns.",
            ar: "أطرحه كبنية مشتركة لا كتوثيق. مكتبة صغيرة تعطي استدعاءً واحداً يكتب domain event إلى الـ outbox داخل الـ transaction الحالي، مع relay مُستضاف وغلاف consumer يزيل التكرار على message id تلقائياً. تحصل الفرق على الموثوقية باستخدام publish وsubscribe الخاصين بالمنصّة، دون كتابة جداول أو حلقات polling يدوياً. أدعمه بـ lint أو architecture test يكشف أي broker.Publish مباشر في مسار request، وبلوحات لمراقبة تراكم الـ outbox يملكها فريق المنصّة."
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
          title: { en: "Publishing to the broker straight from the handler", ar: "النشر إلى الـ broker مباشرة من الـ handler" },
          bad: "db.Orders.Add(order);\nawait db.SaveChangesAsync();\nawait broker.PublishAsync(\"OrderPlaced\", payload); // separate system, no transaction",
          good: "db.Orders.Add(order);\ndb.Outbox.Add(new OutboxMessage { Type = \"OrderPlaced\", Payload = payload });\nawait db.SaveChangesAsync(); // order + message in one transaction",
          why: {
            en: "The bad version is a dual write. If the process dies or the broker times out between SaveChanges and Publish, the order is committed with no message and downstream never reacts. The good version writes the message to the outbox in the same transaction, so it can never be orphaned; a relay sends it later.",
            ar: "النسخة السيئة dual write. لو مات الـ process أو انتهت مهلة الـ broker بين SaveChanges وPublish، تُثبَّت الـ order بلا رسالة ولا يتفاعل ما بعدها. النسخة الجيدة تكتب الرسالة إلى الـ outbox في نفس الـ transaction فلا تصبح يتيمة أبداً؛ يرسلها relay لاحقاً."
          }
        },
        {
          t: "review",
          severity: "medium",
          title: { en: "Outbox row without a stable message id", ar: "صف outbox بلا message id ثابت" },
          bad: "db.Outbox.Add(new OutboxMessage { Type = \"OrderPlaced\", Payload = payload });\n// no id travels with the message, so a consumer cannot detect a resend",
          good: "db.Outbox.Add(new OutboxMessage {\n    Id = Guid.NewGuid(),          // travels with the message\n    Type = \"OrderPlaced\", Payload = payload\n});\n// consumer dedups on this Id",
          why: {
            en: "Since the relay is at-least-once, consumers need a stable id to recognise a duplicate. Without an id carried in the message, a resend after a relay crash looks like a brand-new event, and the consumer applies the effect twice. A generated id attached at write time makes consumer-side dedup possible.",
            ar: "بما أن الـ relay هو at-least-once، تحتاج الـ consumers id ثابتاً لتمييز التكرار. دون id محمول في الرسالة، تبدو إعادة الإرسال بعد تعطّل الـ relay كحدث جديد تماماً، فيطبّق الـ consumer الأثر مرتين. id مولَّد ومربوط وقت الكتابة يتيح إزالة التكرار عند الـ consumer."
          }
        }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        {
          t: "p",
          en: "In a typical order pipeline, the order service writes the order and an OrderPlaced row to its outbox in one transaction. A relay forwards OrderPlaced to the broker, where the email, inventory, and analytics services each consume it independently. If any consumer is down, the broker holds the message; if the relay lags, the outbox holds it. Nothing is lost because every hop has durable storage behind it.",
          ar: "في pipeline طلبات نموذجي، يكتب الـ order service الـ order وصف OrderPlaced إلى الـ outbox في transaction واحد. يمرّر relay رسالة OrderPlaced إلى الـ broker، حيث يستهلكها الـ email والـ inventory والـ analytics كلٌّ على حدة. لو تعطّل أي consumer، يحتفظ الـ broker بالرسالة؛ ولو تأخّر الـ relay، يحتفظ بها الـ outbox. لا شيء يُفقَد لأن كل قفزة خلفها تخزين دائم."
        },
        {
          t: "ul",
          en: ["Microservices publishing domain events so other services stay in sync.", "Saga steps: committing a local step and reliably triggering the next.", "Keeping a search index or cache updated after a database change.", "Sending emails, SMS, or push notifications that must not be silently dropped."],
          ar: ["Microservices تنشر domain events كي تبقى بقية الخدمات متزامنة.", "خطوات الـ saga: تثبيت خطوة محلية وتشغيل التالية بموثوقية.", "إبقاء search index أو cache محدّثاً بعد تغيير في الـ database.", "إرسال email أو SMS أو push notifications يجب ألا تُسقَط بصمت."]
        },
        {
          t: "callout",
          kind: "tip",
          en: "Keep the outbox table in the same database as the business data. A separate outbox database reintroduces the dual-write problem — the whole point is that the message row and the data share one transaction.",
          ar: "أبقِ جدول الـ outbox في نفس الـ database مع بيانات العمل. database outbox منفصل يعيد مشكلة الـ dual write — الهدف كله أن يتشارك صف الرسالة وصف البيانات transaction واحداً."
        }
      ]
    },
    {
      key: "perf",
      blocks: [
        {
          t: "kv",
          rows: [
            { k: { en: "Database", ar: "Database" }, v: { en: "Each transaction writes an extra outbox row; the poll query and cleanup add read/delete load. Index ProcessedAt and CreatedAt.", ar: "كل transaction يكتب صف outbox إضافياً؛ استعلام الـ poll والتنظيف يضيفان حمل قراءة/حذف. افهرس ProcessedAt وCreatedAt." } },
            { k: { en: "Latency", ar: "Latency" }, v: { en: "Downstream reaction is delayed by the poll interval — a 1-second poll means up to ~1 s before a message is even sent.", ar: "يتأخّر تفاعل ما بعده بقدر فترة الـ poll — poll بثانية يعني حتى نحو 1 ث قبل إرسال الرسالة أصلاً." } },
            { k: { en: "Scalability", ar: "Scalability" }, v: { en: "Multiple relay instances need row locking (UPDLOCK/READPAST) to scale without double-sending.", ar: "نسخ relay متعددة تحتاج قفل صفوف (UPDLOCK/READPAST) للتوسّع دون إرسال مزدوج." } },
            { k: { en: "Memory", ar: "Memory" }, v: { en: "The poll batch size (e.g. 100 rows) bounds how much the relay holds in memory per cycle.", ar: "حجم دفعة الـ poll (مثلاً 100 صف) يحدّ ما يحتفظ به الـ relay في الذاكرة لكل دورة." } },
            { k: { en: "Network", ar: "Network" }, v: { en: "One broker round-trip per message plus steady polling traffic to the database.", ar: "رحلة broker واحدة لكل رسالة إضافةً إلى حركة polling ثابتة نحو الـ database." } }
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
            "Query the outbox for rows where ProcessedAt IS NULL older than N seconds — a growing count means the relay is stuck or the broker is down.",
            "Read the relay logs for publish exceptions and the last CreatedAt it processed — tells you exactly where it stalled.",
            "Open the broker admin UI or metrics — confirm messages actually arrive and are not piling in a dead-letter queue.",
            "Trace one message id across producer log, outbox row, and consumer log — pinpoint where a specific message was lost or duplicated.",
            "Compare counts over a window: orders created versus OrderPlaced messages consumed — a gap quantifies the drift."
          ],
          ar: [
            "استعلم عن صفوف الـ outbox حيث ProcessedAt IS NULL وأقدم من N ثانية — عدد متزايد يعني أن الـ relay عالق أو الـ broker متوقف.",
            "اقرأ logs الـ relay بحثاً عن استثناءات نشر وآخر CreatedAt عالجه — يخبرك أين توقّف بالضبط.",
            "افتح واجهة إدارة الـ broker أو مقاييسه — تأكّد أن الرسائل تصل فعلاً ولا تتراكم في dead-letter queue.",
            "تتبّع message id واحداً عبر log المنتج وصف الـ outbox وlog الـ consumer — حدّد أين فُقدت أو تكرّرت رسالة بعينها.",
            "قارن الأعداد خلال نافذة: الـ orders المُنشأة مقابل رسائل OrderPlaced المستهلَكة — الفجوة تقيس الانحراف."
          ]
        },
        {
          t: "callout",
          kind: "tip",
          en: "Alert on outbox backlog depth and the age of the oldest unprocessed row, not just on relay uptime. The relay can be running and still fail every publish silently, so uptime alone tells you nothing.",
          ar: "نبّه على عمق تراكم الـ outbox وعمر أقدم صف غير معالَج، لا على تشغيل الـ relay فقط. قد يكون الـ relay يعمل ويفشل كل نشر بصمت، فالتشغيل وحده لا يخبرك بشيء."
        }
      ]
    },
    {
      key: "realworld",
      blocks: [
        {
          t: "p",
          en: "Any system where a database change must reliably trigger something elsewhere reaches for the outbox. The common thread is that losing the follow-up action is unacceptable and the broker cannot share the database's transaction.",
          ar: "أي نظام يجب فيه أن يُطلِق تغيير في الـ database شيئاً آخر بموثوقية يلجأ إلى الـ outbox. الخيط المشترك أن فقدان الإجراء التابع غير مقبول، والـ broker لا يمكنه مشاركة transaction الـ database."
        },
        {
          t: "ul",
          en: [
            "E-commerce order pipelines that must email, decrement stock, and start fulfilment.",
            "Payment and billing systems emitting settlement or refund events exactly once in effect.",
            "Ticketing and booking, where a confirmed seat hold must always be announced downstream.",
            "Any microservice publishing domain events to keep other services and read models in sync."
          ],
          ar: [
            "pipelines طلبات التجارة الإلكترونية التي يجب أن ترسل email وتخصم مخزوناً وتبدأ التنفيذ.",
            "أنظمة المدفوعات والفوترة التي تُصدِر أحداث تسوية أو استرداد مرة واحدة في الأثر.",
            "التذاكر والحجوزات، حيث يجب دائماً إعلان حجز مقعد مؤكَّد لما بعده.",
            "أي microservice ينشر domain events لإبقاء بقية الخدمات والـ read models متزامنة."
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
          en: "Add an OutboxMessage table and, in one SaveChanges, insert an order plus its message. Prove atomicity: throw an exception after adding both but before commit, and confirm neither row exists.",
          ar: "أضف جدول OutboxMessage، وفي SaveChanges واحد أدرِج order مع رسالتها. أثبت الـ atomicity: ارمِ استثناءً بعد إضافة الاثنين وقبل commit، وتأكّد أن أياً من الصفين غير موجود."
        },
        {
          t: "ex",
          diff: "medium",
          en: "Write a polling relay that publishes each pending message and marks ProcessedAt after the broker acks. Prove durability: stop the broker, create an order, restart the broker, and confirm the message is still delivered.",
          ar: "اكتب relay بالـ polling ينشر كل رسالة معلّقة ويعلّم ProcessedAt بعد ack الـ broker. أثبت الديمومة: أوقف الـ broker، أنشئ order، أعد تشغيل الـ broker، وتأكّد أن الرسالة سُلِّمت رغم ذلك."
        },
        {
          t: "ex",
          diff: "hard",
          en: "Run two relay instances against one outbox table using UPDLOCK/READPAST (or SKIP LOCKED). Generate 1,000 messages and prove every message is published exactly once with no duplicates under concurrent polling.",
          ar: "شغّل نسختي relay على جدول outbox واحد باستخدام UPDLOCK/READPAST (أو SKIP LOCKED). ولّد 1000 رسالة وأثبت أن كل رسالة نُشرت مرة واحدة بلا تكرار تحت polling متزامن."
        },
        {
          t: "ex",
          diff: "senior",
          en: "Make the consumer idempotent with a processed-messages table keyed by message id. Deliberately deliver the same message twice and prove its side effect (for example, decrementing stock) is applied only once.",
          ar: "اجعل الـ consumer idempotent بجدول رسائل معالَجة مفتاحه message id. سلّم نفس الرسالة مرتين عمداً وأثبت أن أثرها (مثلاً خصم المخزون) طُبِّق مرة واحدة فقط."
        }
      ]
    },
    {
      key: "refs",
      blocks: [
        {
          t: "ref",
          label: { en: "Transactional Outbox pattern (microservices.io)", ar: "نمط Transactional Outbox (microservices.io)" },
          url: "https://microservices.io/patterns/data/transactional-outbox.html",
          meta: { en: "Pattern", ar: "نمط" }
        },
        {
          t: "ref",
          label: { en: "Debezium Outbox Event Router", ar: "Debezium Outbox Event Router" },
          url: "https://debezium.io/documentation/reference/stable/transformations/outbox-event-router.html",
          meta: { en: "Docs", ar: "توثيق" }
        },
        {
          t: "ref",
          label: { en: ".NET microservices: event-based communication", ar: ".NET microservices: التواصل القائم على الأحداث" },
          url: "https://learn.microsoft.com/en-us/dotnet/architecture/microservices/multi-container-microservice-net-applications/integration-event-based-microservice-communications",
          meta: { en: "Docs", ar: "توثيق" }
        },
        {
          t: "ref",
          label: { en: "Designing Data-Intensive Applications (Kleppmann)", ar: "Designing Data-Intensive Applications (Kleppmann)" },
          url: "https://dataintensive.net/",
          meta: { en: "Book", ar: "كتاب" }
        }
      ]
    }
  ],
  quiz: [
    {
      q: { en: "What problem does the transactional outbox solve?", ar: "ما المشكلة التي يحلها الـ transactional outbox؟" },
      options: [
        { en: "It makes the message broker faster.", ar: "يجعل الـ message broker أسرع." },
        { en: "It lets a database write and a message send commit together as one atomic step.", ar: "يتيح لكتابة في الـ database وإرسال رسالة أن يُثبَّتا معاً كخطوة atomic واحدة." },
        { en: "It removes the need for a message broker.", ar: "يلغي الحاجة إلى message broker." },
        { en: "It encrypts messages in transit.", ar: "يشفّر الرسائل أثناء النقل." }
      ],
      correct: 1,
      why: {
        en: "The outbox writes the message into the same database and transaction as the data, so both persist together or not at all — solving the dual-write problem.",
        ar: "الـ outbox يكتب الرسالة في نفس الـ database والـ transaction مع البيانات، فيبقيان معاً أو لا يبقى أي منهما — حلاً لمشكلة الـ dual write."
      }
    },
    {
      q: { en: "The relay crashes right after publishing a message but before marking it processed. What happens on restart?", ar: "يتعطّل الـ relay فور نشر رسالة وقبل تعليمها كمعالَجة. ماذا يحدث عند التشغيل؟" },
      options: [
        { en: "The message is lost permanently.", ar: "تُفقَد الرسالة نهائياً." },
        { en: "The message is sent again — a duplicate.", ar: "تُرسَل الرسالة مجدداً — تكرار." },
        { en: "The original order is rolled back.", ar: "يُلغى الـ order الأصلي." },
        { en: "The row is skipped forever.", ar: "يُتخطّى الصف إلى الأبد." }
      ],
      correct: 1,
      why: {
        en: "The row is still marked unprocessed, so the relay republishes it — this is why the relay is at-least-once and consumers must be idempotent.",
        ar: "يبقى الصف مُعلَّماً كغير معالَج، فيعيد الـ relay نشره — لهذا الـ relay هو at-least-once ويجب أن تكون الـ consumers idempotent."
      }
    },
    {
      q: { en: "Why is the outbox alone not enough for exactly-once effects?", ar: "لماذا لا يكفي الـ outbox وحده لتحقيق أثر exactly-once؟" },
      options: [
        { en: "Because the broker deduplicates automatically.", ar: "لأن الـ broker يزيل التكرار تلقائياً." },
        { en: "Because the relay can resend after a crash, so consumers must be idempotent.", ar: "لأن الـ relay قد يعيد الإرسال بعد تعطّل، فيجب أن تكون الـ consumers idempotent." },
        { en: "Because the outbox frequently loses messages.", ar: "لأن الـ outbox يفقد الرسائل كثيراً." },
        { en: "Because local transactions are not atomic.", ar: "لأن الـ transactions المحلية ليست atomic." }
      ],
      correct: 1,
      why: {
        en: "The outbox guarantees delivery, not uniqueness. A resend after a relay crash is a duplicate; idempotent consumers make that duplicate harmless.",
        ar: "الـ outbox يضمن التوصيل لا التفرّد. إعادة الإرسال بعد تعطّل الـ relay تكرار؛ الـ consumers الـ idempotent تجعل ذلك التكرار غير ضار."
      }
    },
    {
      q: { en: "Why must the outbox table live in the same database as the business data?", ar: "لماذا يجب أن يعيش جدول الـ outbox في نفس الـ database مع بيانات العمل؟" },
      options: [
        { en: "For faster reads.", ar: "لقراءات أسرع." },
        { en: "So the message insert and the data write share one transaction.", ar: "كي يتشارك إدراج الرسالة وكتابة البيانات transaction واحداً." },
        { en: "Because brokers require it.", ar: "لأن الـ brokers تشترط ذلك." },
        { en: "To save storage space.", ar: "لتوفير مساحة تخزين." }
      ],
      correct: 1,
      why: {
        en: "A separate outbox database brings back the dual-write problem. Only a shared database lets both rows commit in one atomic transaction.",
        ar: "database outbox منفصل يعيد مشكلة الـ dual write. فقط database مشترك يتيح تثبيت الصفين في transaction atomic واحد."
      }
    },
    {
      q: { en: "Two relay instances poll the same outbox table. What prevents them from sending the same row twice?", ar: "نسختا relay تستعلمان عن نفس جدول الـ outbox. ما الذي يمنعهما من إرسال نفس الصف مرتين؟" },
      options: [
        { en: "A longer poll interval.", ar: "فترة poll أطول." },
        { en: "Row-level locking such as UPDLOCK/READPAST (SKIP LOCKED).", ar: "قفل على مستوى الصف مثل UPDLOCK/READPAST (SKIP LOCKED)." },
        { en: "A bigger poll batch size.", ar: "حجم دفعة poll أكبر." },
        { en: "Deleting rows immediately on read.", ar: "حذف الصفوف فور القراءة." }
      ],
      correct: 1,
      why: {
        en: "Row locking makes each poller claim rows the other skips, so a message is not published by both instances at once.",
        ar: "قفل الصفوف يجعل كل poller يأخذ صفوفاً يتخطاها الآخر، فلا تنشر النسختان رسالة واحدة معاً."
      }
    }
  ]
};
```

NEXT: benchmarking
