```js
const eventsLesson = {
  id: "events",
  moduleId: "architecture",
  title: { en: "Domain events", ar: "أحداث المجال" },
  summary: {
    en: "How to let one action trigger other work without the code that does the action knowing about that work.",
    ar: "كيف تجعل فعلاً واحداً يشغّل أعمالاً أخرى دون أن يعرف الكود الذي ينفّذ الفعل شيئاً عن تلك الأعمال."
  },
  mins: 15,
  sections: [
    {
      key: "why",
      blocks: [
        { t: "p",
          en: "A domain event is a small record saying that something important already happened in your app, like \"an order was placed\". Other code can react to it. This lets one action set off extra work without knowing what that work is.",
          ar: "الـ domain event هو سجل صغير يقول إن شيئاً مهماً حدث بالفعل في تطبيقك، مثل «تم إنشاء order». يمكن لكود آخر أن يتفاعل معه. هذا يجعل فعلاً واحداً يشغّل أعمالاً إضافية دون أن يعرف ما هي تلك الأعمال." },
        { t: "kv", rows: [
          { k: { en: "Domain event", ar: "Domain event" },
            v: { en: "A record that something important already happened inside your app, named in the past tense (OrderPlaced).", ar: "سجل بأن شيئاً مهماً حدث بالفعل داخل تطبيقك، بصيغة الماضي (OrderPlaced)." } },
          { k: { en: "Integration event", ar: "Integration event" },
            v: { en: "A message sent to other services or systems to tell them something happened.", ar: "رسالة تُرسل إلى خدمات أو أنظمة أخرى لإخبارها بأن شيئاً حدث." } },
          { k: { en: "Handler", ar: "Handler" },
            v: { en: "Code that runs in reaction to an event.", ar: "كود يعمل كردّ فعل على event." } },
          { k: { en: "Publish / dispatch", ar: "Publish / dispatch" },
            v: { en: "Hand an event off so its handlers get to run.", ar: "تسليم الـ event لكي تعمل الـ handlers الخاصة به." } },
          { k: { en: "In-process vs out-of-process", ar: "In-process مقابل out-of-process" },
            v: { en: "Handlers in the same app and process, versus in another service reached over the network.", ar: "handlers في نفس التطبيق ونفس الـ process، مقابل handlers في خدمة أخرى تُوصل عبر الشبكة." } },
          { k: { en: "Side effect", ar: "Side effect" },
            v: { en: "Extra work caused by the main action (email, stats) but not the action itself.", ar: "عمل إضافي يسبّبه الفعل الرئيسي (email، إحصاءات) لكنه ليس الفعل نفسه." } }
        ]},
        { t: "p",
          en: "The running example for this whole lesson: a customer places an order. Placing the order is the main action. But three more things must happen: reduce the stock count, email a confirmation, and add loyalty points.",
          ar: "المثال الجاري في هذا الدرس كله: عميل ينشئ order. إنشاء الـ order هو الفعل الرئيسي. لكن يجب أن تحدث ثلاثة أشياء أخرى: إنقاص عدد المخزون، إرسال email تأكيد، وإضافة نقاط ولاء." },
        { t: "p",
          en: "Think of a hotel front desk. When a guest checks in, the clerk does not personally clean the room, cook breakfast, and update billing. The clerk just announces \"room 204 is now occupied\", and housekeeping, the kitchen, and billing each react on their own. The domain event is that announcement.",
          ar: "تخيّل مكتب استقبال فندق. عندما يسجّل نزيل دخوله، لا يقوم الموظف شخصياً بتنظيف الغرفة وطهي الفطور وتحديث الفواتير. الموظف فقط يعلن «الغرفة 204 صارت مشغولة»، وقسم النظافة والمطبخ والفواتير كلٌّ يتفاعل بنفسه. الـ domain event هو ذلك الإعلان." },
        { t: "callout", kind: "note",
          en: "A domain event is named in the past tense because it describes a fact that already happened. You react to it; you cannot cancel it by refusing to handle it.",
          ar: "الـ domain event يُسمّى بصيغة الماضي لأنه يصف حقيقة حدثت بالفعل. أنت تتفاعل معه؛ لا يمكنك إلغاؤه برفض معالجته." }
      ]
    },
    {
      key: "problem",
      blocks: [
        { t: "p",
          en: "Without events, the order code calls every side effect directly. The method that places the order also reduces stock, sends the email, and adds points. It now depends on the inventory service, the email service, and the loyalty service all at once.",
          ar: "بدون events، كود الـ order يستدعي كل side effect مباشرة. الـ method التي تنشئ الـ order تنقص المخزون أيضاً، وترسل الـ email، وتضيف النقاط. صارت تعتمد على inventory service و email service و loyalty service كلها في آن واحد." },
        { t: "code", lang: "csharp", label: { en: "Before: everything wired directly", ar: "قبل: كل شيء موصول مباشرة" },
          code: "public async Task PlaceOrder(Cart cart)\n{\n    var order = Order.Create(cart);\n    _db.Orders.Add(order);\n    await _db.SaveChangesAsync();\n\n    // three side effects hard-wired into the order method\n    await _inventory.Reduce(order.Items);\n    await _email.SendConfirmation(order);\n    await _loyalty.AddPoints(order.CustomerId, order.Total);\n}" },
        { t: "p",
          en: "The cost shows up when the list grows. Add \"notify the warehouse\" and you edit PlaceOrder again. One method now has five reasons to change. If the email service is down, the whole order call fails even though the order itself is fine.",
          ar: "التكلفة تظهر عندما تكبر القائمة. أضف «أبلغ المستودع» وستعدّل PlaceOrder مرة أخرى. صار لدى method واحدة خمسة أسباب للتغيّر. وإذا كانت خدمة الـ email متوقفة، يفشل استدعاء الـ order كله رغم أن الـ order نفسه سليم." },
        { t: "code", lang: "csharp", label: { en: "After: raise one event, react elsewhere", ar: "بعد: أطلق event واحد، وتفاعل في مكان آخر" },
          code: "public async Task PlaceOrder(Cart cart)\n{\n    var order = Order.Create(cart);\n    order.Raise(new OrderPlaced(order.Id, order.CustomerId, order.Total));\n    _db.Orders.Add(order);\n    await _db.SaveChangesAsync(); // event is dispatched here; handlers do the rest\n}" },
        { t: "p",
          en: "Now PlaceOrder has one job: create the order and record that it happened. Inventory, email, and loyalty each live in their own handler. Adding a fourth reaction means adding a fourth handler, and touching nothing that already works.",
          ar: "الآن لدى PlaceOrder مهمة واحدة: إنشاء الـ order وتسجيل أنه حدث. الـ inventory والـ email والـ loyalty كلٌّ يعيش في handler خاص به. إضافة تفاعل رابع تعني إضافة handler رابع، ودون لمس أي شيء يعمل بالفعل." }
      ]
    },
    {
      key: "internals",
      blocks: [
        { t: "p",
          en: "Follow one order through the system. The entity does not send the event anywhere yet; it just adds it to a list on itself. The event is a plain object holding the facts a handler will need.",
          ar: "تابِع order واحداً عبر النظام. الـ entity لا ترسل الـ event إلى أي مكان بعد؛ فقط تضيفه إلى قائمة على نفسها. الـ event كائن بسيط يحمل الحقائق التي سيحتاجها الـ handler." },
        { t: "code", lang: "csharp", label: { en: "The event and the entity that holds it", ar: "الـ event والـ entity التي تحمله" },
          code: "public record OrderPlaced(Guid OrderId, Guid CustomerId, decimal Total);\n\npublic class Order\n{\n    private readonly List<object> _events = new();\n    public IReadOnlyList<object> Events => _events;\n    public void Raise(object e) => _events.Add(e);\n    public void ClearEvents() => _events.Clear();\n}" },
        { t: "p",
          en: "The dispatcher is the part that takes each event off the list and finds its handlers. A common place to run it is right after the database save succeeds, so events only fire for changes that were actually committed.",
          ar: "الـ dispatcher هو الجزء الذي يأخذ كل event من القائمة ويجد الـ handlers الخاصة به. مكان شائع لتشغيله هو مباشرة بعد نجاح حفظ قاعدة البيانات، حتى لا تُطلق الـ events إلا للتغييرات التي تم اعتمادها (commit) فعلاً." },
        { t: "code", lang: "csharp", label: { en: "Dispatching after save", ar: "الـ dispatch بعد الحفظ" },
          code: "public override async Task<int> SaveChangesAsync(CancellationToken ct = default)\n{\n    var entities = ChangeTracker.Entries<Order>().Select(e => e.Entity).ToList();\n    var result = await base.SaveChangesAsync(ct); // commit first\n\n    foreach (var entity in entities)\n    {\n        foreach (var e in entity.Events)\n            await _dispatcher.Dispatch(e); // then react\n        entity.ClearEvents();\n    }\n    return result;\n}" },
        { t: "kv", rows: [
          { k: { en: "Raise", ar: "Raise" }, v: { en: "The entity adds the event to its own list. Nothing runs yet.", ar: "الـ entity تضيف الـ event إلى قائمتها. لا شيء يعمل بعد." } },
          { k: { en: "Dispatch", ar: "Dispatch" }, v: { en: "The dispatcher looks up every handler registered for that event type.", ar: "الـ dispatcher يبحث عن كل handler مُسجّل لنوع الـ event ذاك." } },
          { k: { en: "Handle", ar: "Handle" }, v: { en: "Each handler runs its own logic: reduce stock, send email, add points.", ar: "كل handler ينفّذ منطقه الخاص: إنقاص المخزون، إرسال email، إضافة نقاط." } }
        ]},
        { t: "p",
          en: "The analogy again: raising is writing the guest's name on the whiteboard. Dispatching is the front desk reading the board aloud. Handling is each department doing its job. The desk never needs to know what housekeeping actually does.",
          ar: "الـ analogy مرة أخرى: الـ raise هو كتابة اسم النزيل على اللوحة. الـ dispatch هو قراءة المكتب للّوحة بصوت عالٍ. الـ handle هو قيام كل قسم بعمله. المكتب لا يحتاج أبداً لمعرفة ما يفعله قسم النظافة فعلاً." },
        { t: "callout", kind: "warn",
          en: "In-process handlers usually run inside the same transaction as the save, or right after it. If a handler throws, decide clearly: does the whole order roll back, or was that side effect optional? Silence here causes lost work.",
          ar: "الـ handlers الـ in-process عادة تعمل داخل نفس الـ transaction الخاصة بالحفظ، أو مباشرة بعده. إذا رمى handler استثناء، قرّر بوضوح: هل يتراجع الـ order كله، أم كان ذلك الـ side effect اختيارياً؟ الغموض هنا يسبّب فقدان عمل." }
      ]
    },
    {
      key: "tradeoffs",
      blocks: [
        { t: "tradeoff",
          pros: {
            en: ["The action code stays small and has one reason to change.", "New reactions are added as new handlers, without editing old code.", "Side effects are named and easy to find, one per handler.", "Handlers can be tested on their own with a fake event."],
            ar: ["كود الفعل يبقى صغيراً وله سبب واحد للتغيّر.", "التفاعلات الجديدة تُضاف كـ handlers جديدة، دون تعديل الكود القديم.", "الـ side effects مُسمّاة وسهلة الإيجاد، واحد لكل handler.", "يمكن اختبار الـ handlers بمفردها بـ event وهمي."]
          },
          cons: {
            en: ["The flow is harder to read: you cannot see all reactions in one place.", "Too many events make a codebase feel like magic that happens somewhere.", "Debugging jumps across files to follow one request.", "Ordering between handlers is not obvious and easy to get wrong."],
            ar: ["التدفّق أصعب في القراءة: لا ترى كل التفاعلات في مكان واحد.", "كثرة الـ events تجعل الكود يبدو كسحر يحدث في مكان ما.", "الـ debugging يقفز بين الملفات لتتبّع request واحد.", "الترتيب بين الـ handlers غير واضح ويسهل الخطأ فيه."]
          },
          limits: {
            en: ["Does not by itself make anything asynchronous or reliable.", "In-process events die with the process if not persisted.", "Not a substitute for a real message queue across services."],
            ar: ["لا يجعل بذاته أي شيء asynchronous أو موثوقاً.", "الـ events الـ in-process تموت مع الـ process إن لم تُحفظ.", "ليست بديلاً عن message queue حقيقية بين الخدمات."]
          },
          alts: {
            en: ["Direct method calls when there are only one or two side effects.", "Integration events over a broker when other services must react.", "The outbox pattern when the event must survive a crash."],
            ar: ["استدعاءات method مباشرة عندما يوجد side effect أو اثنان فقط.", "Integration events عبر broker عندما يجب أن تتفاعل خدمات أخرى.", "نمط الـ outbox عندما يجب أن ينجو الـ event من انهيار."]
          }
        }
      ]
    },
    {
      key: "mistakes",
      blocks: [
        { t: "mistake",
          title: { en: "Raising the event before the save succeeds", ar: "إطلاق الـ event قبل نجاح الحفظ" },
          body: { en: "A team dispatched OrderPlaced right after Order.Create, before SaveChanges. The save then failed on a constraint, but the email and loyalty points had already gone out. Customers got a confirmation for an order that does not exist.", ar: "فريق أطلق OrderPlaced مباشرة بعد Order.Create، قبل SaveChanges. ثم فشل الحفظ بسبب constraint، لكن الـ email والنقاط كانت قد خرجت بالفعل. حصل العملاء على تأكيد لـ order غير موجود." },
          fix: "// dispatch AFTER the commit, not before\nvar result = await base.SaveChangesAsync(ct);\nawait DispatchEvents();" },
        { t: "mistake",
          title: { en: "One handler quietly swallowing its exception", ar: "handler يبتلع استثناءه بصمت" },
          body: { en: "The email handler wrapped its work in try/catch and logged nothing on failure. For weeks, roughly 2% of orders sent no confirmation and nobody noticed, because the order call still returned 200 OK.", ar: "الـ email handler غلّف عمله بـ try/catch ولم يسجّل شيئاً عند الفشل. لأسابيع، نحو 2% من الـ orders لم ترسل تأكيداً ولم يلاحظ أحد، لأن استدعاء الـ order ظل يعيد 200 OK." },
          fix: "catch (Exception ex)\n{\n    _log.Error(ex, \"Email handler failed for {OrderId}\", e.OrderId);\n    throw; // or push to a retry queue\n}" },
        { t: "mistake",
          title: { en: "Putting business rules inside a handler", ar: "وضع قواعد العمل داخل handler" },
          body: { en: "A handler for OrderPlaced decided whether the order qualified for free shipping, then changed the order total. Because handlers ran in an unpredictable order, the total was sometimes read by another handler before it was updated.", ar: "handler لـ OrderPlaced قرّر ما إذا كان الـ order مؤهلاً للشحن المجاني، ثم غيّر إجمالي الـ order. ولأن الـ handlers عملت بترتيب غير متوقّع، قُرئ الإجمالي أحياناً بواسطة handler آخر قبل تحديثه." },
          fix: "// decide free shipping inside Order.Create, before the event\n// handlers should react, not change core state" },
        { t: "mistake",
          title: { en: "Using a domain event to talk to another service", ar: "استخدام domain event للتخاطب مع خدمة أخرى" },
          body: { en: "An in-process OrderPlaced handler made an HTTP call to a separate billing service. When billing was slow, order placement slowed with it, and a billing outage started failing orders — the exact coupling events were meant to remove.", ar: "handler لـ OrderPlaced داخل الـ process أجرى HTTP call إلى خدمة billing منفصلة. وعندما أبطأت الـ billing، أبطأ معها إنشاء الـ order، وبدأ انقطاع الـ billing بإفشال الـ orders — نفس الاقتران الذي جاءت الـ events لإزالته." },
          fix: "// publish an integration event to a broker instead;\n// let billing consume it on its own schedule" }
      ]
    },
    {
      key: "interview",
      blocks: [
        { t: "qa", level: "junior",
          q: { en: "What is a domain event?", ar: "ما هو الـ domain event؟" },
          a: { en: "It is a small object that records that something meaningful already happened in the app, like an order being placed. Other code subscribes to it and reacts, instead of the original code calling everything directly.", ar: "هو كائن صغير يسجّل أن شيئاً مهماً حدث بالفعل في التطبيق، مثل إنشاء order. كود آخر يشترك فيه ويتفاعل، بدل أن يستدعي الكود الأصلي كل شيء مباشرة." } },
        { t: "qa", level: "mid",
          q: { en: "What is the difference between a domain event and an integration event?", ar: "ما الفرق بين الـ domain event والـ integration event؟" },
          a: { en: "A domain event stays inside one app and is handled in the same process. An integration event is published to other services, usually over a message broker. Domain events are about internal decoupling; integration events are about telling the outside world.", ar: "الـ domain event يبقى داخل تطبيق واحد ويُعالَج في نفس الـ process. الـ integration event يُنشر إلى خدمات أخرى، عادة عبر message broker. الـ domain events تخصّ فكّ الاقتران الداخلي؛ والـ integration events تخصّ إبلاغ العالم الخارجي." } },
        { t: "qa", level: "mid",
          q: { en: "When should you dispatch the events — before or after SaveChanges?", ar: "متى تُطلق الـ events — قبل SaveChanges أم بعده؟" },
          a: { en: "After, so events only fire for changes that actually committed. If you dispatch before the save and the save fails, you have already run side effects like emails for something that never persisted.", ar: "بعده، حتى لا تُطلق الـ events إلا للتغييرات التي تم اعتمادها فعلاً. إذا أطلقتها قبل الحفظ وفشل الحفظ، تكون قد نفّذت side effects مثل الـ emails لشيء لم يُحفظ أبداً." } },
        { t: "qa", level: "senior",
          q: { en: "How do you keep event ordering from becoming a hidden bug?", ar: "كيف تمنع ترتيب الـ events من أن يصبح bug مخفياً؟" },
          a: { en: "Do not let handlers depend on each other's output. Each handler should react to the same facts on the event and not to state another handler changed. If order truly matters, that is a sign the work belongs in one handler or in the main action, not spread across several.", ar: "لا تجعل الـ handlers تعتمد على مخرجات بعضها. كل handler يجب أن يتفاعل مع نفس الحقائق الموجودة في الـ event لا مع حالة غيّرها handler آخر. إذا كان الترتيب مهماً فعلاً، فهذه إشارة إلى أن العمل يخصّ handler واحداً أو الفعل الرئيسي، لا موزّعاً على عدة handlers." } },
        { t: "qa", level: "senior",
          q: { en: "An in-process handler needs to call another service. What do you do?", ar: "handler داخل الـ process يحتاج لاستدعاء خدمة أخرى. ماذا تفعل؟" },
          a: { en: "Do not make that network call inside the in-process handler, because it recouples your latency and uptime to theirs. Turn it into an integration event: publish it to a broker, and let the other service consume it on its own time. To make that reliable, store the event with the transaction using the outbox pattern.", ar: "لا تُجرِ ذلك الـ network call داخل الـ handler الـ in-process، لأنه يعيد ربط زمن استجابتك وتوافرك بهما. حوّله إلى integration event: انشره على broker، ودع الخدمة الأخرى تستهلكه في وقتها. ولجعل ذلك موثوقاً، احفظ الـ event مع الـ transaction باستخدام نمط الـ outbox." } },
        { t: "qa", level: "staff",
          q: { en: "A team overused events and now no one can trace a request. How do you fix it structurally?", ar: "فريق أفرط في استخدام الـ events والآن لا أحد يستطيع تتبّع request. كيف تصلح ذلك هيكلياً؟" },
          a: { en: "Set a rule for when an event is justified: use it when a reaction is genuinely optional or owned by another team, and use a direct call when it is core to the action. Add distributed tracing so every publish and handler shows up on one trace. And keep a written list of each event and its handlers so the fan-out is visible, not folklore.", ar: "ضَع قاعدة لمتى يكون الـ event مبرّراً: استخدمه عندما يكون التفاعل اختيارياً فعلاً أو مملوكاً لفريق آخر، واستخدم استدعاءً مباشراً عندما يكون جوهرياً للفعل. أضف distributed tracing حتى يظهر كل publish و handler على trace واحد. واحتفظ بقائمة مكتوبة لكل event و handlers الخاصة به حتى يكون التوزّع مرئياً لا شفهياً." } }
      ]
    },
    {
      key: "codereview",
      blocks: [
        { t: "review", severity: "high",
          title: { en: "Side effect runs before the change is committed", ar: "side effect يعمل قبل اعتماد التغيير" },
          bad: "order.Raise(new OrderPlaced(...));\nawait _dispatcher.Dispatch(order.Events); // fires now\n_db.Orders.Add(order);\nawait _db.SaveChangesAsync();               // may still fail",
          good: "order.Raise(new OrderPlaced(...));\n_db.Orders.Add(order);\nawait _db.SaveChangesAsync();               // commit first\nawait _dispatcher.Dispatch(order.Events);   // then react",
          why: { en: "Dispatching before the save means emails and points can go out for an order that fails to persist. Always commit first, then dispatch, so handlers only react to real, saved facts.", ar: "الـ dispatch قبل الحفظ يعني أن الـ emails والنقاط قد تخرج لـ order يفشل حفظه. اعتمد أولاً ثم أطلق، حتى تتفاعل الـ handlers مع حقائق حقيقية محفوظة فقط." } },
        { t: "review", severity: "medium",
          title: { en: "Event carries the whole entity instead of the facts", ar: "الـ event يحمل الـ entity كاملة بدل الحقائق" },
          bad: "public record OrderPlaced(Order Order); // whole live entity",
          good: "public record OrderPlaced(Guid OrderId, Guid CustomerId, decimal Total);",
          why: { en: "Passing the live entity lets a handler mutate it after the fact and couples handlers to the full model. Carry only the plain values a handler needs, so the event is a stable, read-only record of what happened.", ar: "تمرير الـ entity الحيّة يتيح لـ handler تعديلها لاحقاً ويربط الـ handlers بالنموذج كاملاً. احمل فقط القيم البسيطة التي يحتاجها الـ handler، ليكون الـ event سجلاً ثابتاً للقراءة فقط لما حدث." } }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        { t: "p",
          en: "In a real system, domain events draw the line between the core action and everything that hangs off it. The order module owns \"an order was placed\". Other modules — inventory, notifications, loyalty — subscribe without the order module importing any of them.",
          ar: "في نظام حقيقي، الـ domain events ترسم الخط بين الفعل الجوهري وكل ما يتفرّع عنه. وحدة الـ order تملك «تم إنشاء order». وحدات أخرى — inventory، notifications، loyalty — تشترك دون أن تستورد وحدة الـ order أياً منها." },
        { t: "p",
          en: "When a reaction belongs to another team's service, promote the domain event to an integration event: publish it to a broker after the transaction commits, and let the other service consume it. In-process events stay inside your app; integration events cross the boundary.",
          ar: "عندما يخصّ التفاعل خدمة فريق آخر، ارفع الـ domain event إلى integration event: انشره على broker بعد اعتماد الـ transaction، ودع الخدمة الأخرى تستهلكه. الـ events الـ in-process تبقى داخل تطبيقك؛ والـ integration events تعبر الحدود." },
        { t: "ul",
          en: ["Keep the event payload small and stable — ids and a few values, not the whole object.", "Dispatch in-process events after commit; publish integration events via an outbox.", "Give each event a clear owner: the module where the fact originates.", "Write down every event and its handlers so the fan-out is discoverable."],
          ar: ["أبقِ حمولة الـ event صغيرة وثابتة — معرّفات وبضع قيم، لا الكائن كله.", "أطلق الـ events الـ in-process بعد الاعتماد؛ وانشر الـ integration events عبر outbox.", "امنح كل event مالكاً واضحاً: الوحدة التي تنشأ فيها الحقيقة.", "دوّن كل event و handlers الخاصة به ليكون التوزّع قابلاً للاكتشاف."] },
        { t: "callout", kind: "tip",
          en: "A useful test: if the reaction must happen for the action to be correct, keep it in the main action. If the reaction is a bonus (stats, email, cache warmup), an event fits well.",
          ar: "اختبار مفيد: إذا كان التفاعل يجب أن يحدث لكي يكون الفعل صحيحاً، أبقِه في الفعل الرئيسي. أما إذا كان التفاعل إضافة (إحصاءات، email، تسخين cache)، فالـ event مناسب." }
      ]
    },
    {
      key: "perf",
      blocks: [
        { t: "kv", rows: [
          { k: { en: "Latency", ar: "Latency" }, v: { en: "In-process handlers run before the response returns, so each one adds directly to the request's own time.", ar: "الـ handlers الـ in-process تعمل قبل عودة الاستجابة، فكل واحد يضيف مباشرة إلى زمن الـ request نفسه." } },
          { k: { en: "CPU", ar: "CPU" }, v: { en: "Fan-out multiplies work: one event to ten handlers is ten times the processing per action.", ar: "التوزّع يضاعف العمل: event واحد لعشرة handlers يعني عشرة أضعاف المعالجة لكل فعل." } },
          { k: { en: "Database", ar: "Database" }, v: { en: "Each handler that queries or writes adds round-trips inside the same request; watch for a hidden N+1.", ar: "كل handler يستعلم أو يكتب يضيف round-trips داخل نفس الـ request؛ انتبه لـ N+1 مخفي." } },
          { k: { en: "Network", ar: "Network" }, v: { en: "Integration events cross to a broker — one extra hop, and a place the request can now fail.", ar: "الـ integration events تعبر إلى broker — قفزة إضافية، ومكان يمكن أن يفشل فيه الـ request الآن." } },
          { k: { en: "Scalability", ar: "Scalability" }, v: { en: "Out-of-process handlers scale on their own, so a slow email consumer does not slow order placement.", ar: "الـ handlers الـ out-of-process تتوسّع بمفردها، فمستهلك email بطيء لا يبطئ إنشاء الـ order." } }
        ]}
      ]
    },
    {
      key: "debug",
      blocks: [
        { t: "ul",
          en: ["Log every published event with its type and a correlation id — confirm the event fired at all.", "Log entry and exit of each handler — find which handler threw or hung.", "Broker dashboard (RabbitMQ management UI, Azure Service Bus explorer) — check queue depth and dead-letter count for stuck integration events.", "OpenTelemetry trace across publish and handlers — see the real time each handler took.", "A unit test with a fake handler that records calls — confirm the dispatcher actually reaches handlers."],
          ar: ["سجّل كل event منشور بنوعه وبـ correlation id — أكّد أن الـ event أُطلق أصلاً.", "سجّل دخول وخروج كل handler — اعرف أي handler رمى استثناء أو علِق.", "لوحة الـ broker (RabbitMQ management UI، Azure Service Bus explorer) — افحص عمق الطابور وعدد الـ dead-letter للـ integration events العالقة.", "OpenTelemetry trace عبر الـ publish والـ handlers — شاهد الزمن الحقيقي لكل handler.", "اختبار وحدة بـ handler وهمي يسجّل الاستدعاءات — أكّد أن الـ dispatcher يصل فعلاً إلى الـ handlers."] },
        { t: "callout", kind: "tip",
          en: "Attach the same correlation id to the request and to every event it raises. Then one search shows the whole chain: the request, each handler, and where it stopped.",
          ar: "أرفق نفس الـ correlation id بالـ request وبكل event يُطلقه. عندئذ يُظهر بحث واحد السلسلة كاملة: الـ request، كل handler، وأين توقّف." }
      ]
    },
    {
      key: "realworld",
      blocks: [
        { t: "p",
          en: "Events show up wherever one action needs to fan out to several independent reactions that different teams own.",
          ar: "الـ events تظهر حيثما يحتاج فعل واحد إلى التوزّع على عدة تفاعلات مستقلة تملكها فرق مختلفة." },
        { t: "ul",
          en: ["E-commerce: OrderPlaced drives inventory, confirmation email, and loyalty points, each decoupled from the checkout.", "Chat platforms: MessageSent fans out to push notifications, unread counts, and search indexing.", "Payment systems: PaymentCaptured raises integration events to accounting and to fulfillment services.", "Audit and compliance: every domain event doubles as an entry in an immutable audit trail."],
          ar: ["التجارة الإلكترونية: OrderPlaced يقود الـ inventory وemail التأكيد ونقاط الولاء، كلٌّ مفصول عن الـ checkout.", "منصّات الدردشة: MessageSent يتوزّع على الإشعارات وعدّادات غير المقروء وفهرسة البحث.", "أنظمة الدفع: PaymentCaptured يطلق integration events إلى المحاسبة وإلى خدمات التنفيذ.", "التدقيق والامتثال: كل domain event يصلح أيضاً كسجل في سجل تدقيق غير قابل للتغيير."] }
      ]
    },
    {
      key: "exercises",
      blocks: [
        { t: "ex", diff: "easy",
          en: "Define an OrderPlaced record with OrderId, CustomerId, and Total. Add a Raise/Events/ClearEvents list to an Order class. Prove it by raising the event in a test and asserting it appears in Events.",
          ar: "عرّف record باسم OrderPlaced يحمل OrderId وCustomerId وTotal. أضف قائمة Raise/Events/ClearEvents إلى class باسم Order. أثبت ذلك بإطلاق الـ event في اختبار والتأكيد على ظهوره في Events." },
        { t: "ex", diff: "medium",
          en: "Write a dispatcher that maps an event type to a list of handlers and calls each. Register two handlers for OrderPlaced (email, loyalty). Prove both run when one event is dispatched.",
          ar: "اكتب dispatcher يربط نوع الـ event بقائمة handlers ويستدعي كلاً منها. سجّل handlerين لـ OrderPlaced (email، loyalty). أثبت أن كليهما يعمل عند إطلاق event واحد." },
        { t: "ex", diff: "hard",
          en: "Override SaveChangesAsync to dispatch events only after the commit succeeds. Prove it by forcing the save to throw and asserting no handler ran.",
          ar: "أعد تعريف SaveChangesAsync لإطلاق الـ events فقط بعد نجاح الاعتماد. أثبت ذلك بإجبار الحفظ على رمي استثناء والتأكيد على عدم عمل أي handler." },
        { t: "ex", diff: "senior",
          en: "Turn the loyalty reaction into an integration event: publish it to a local broker (or an in-memory stand-in) after commit, and consume it in a separate handler. Show that a slow consumer no longer delays order placement.",
          ar: "حوّل تفاعل الـ loyalty إلى integration event: انشره على broker محلي (أو بديل in-memory) بعد الاعتماد، واستهلكه في handler منفصل. أظهِر أن مستهلكاً بطيئاً لم يعد يؤخّر إنشاء الـ order." }
      ]
    },
    {
      key: "refs",
      blocks: [
        { t: "ref", label: { en: "Domain events: design and implementation (.NET)", ar: "Domain events: التصميم والتنفيذ (.NET)" },
          url: "https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-events-design-implementation",
          meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref", label: { en: "Integration events between microservices (.NET)", ar: "Integration events بين الـ microservices (.NET)" },
          url: "https://learn.microsoft.com/en-us/dotnet/architecture/microservices/multi-container-microservice-net-applications/integration-event-based-microservice-communications",
          meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref", label: { en: "Martin Fowler — Domain Event", ar: "Martin Fowler — Domain Event" },
          url: "https://martinfowler.com/eaaDev/DomainEvent.html",
          meta: { en: "Article", ar: "مقال" } },
        { t: "ref", label: { en: "MediatR wiki (notifications and handlers)", ar: "MediatR wiki (الإشعارات والـ handlers)" },
          url: "https://github.com/jbogard/MediatR/wiki",
          meta: { en: "Docs", ar: "توثيق" } }
      ]
    }
  ],
  quiz: [
    {
      q: { en: "What does a domain event represent?", ar: "ماذا يمثّل الـ domain event؟" },
      options: [
        { en: "A command telling the system to do something", ar: "أمر يطلب من النظام فعل شيء" },
        { en: "A fact that something already happened, named in the past tense", ar: "حقيقة بأن شيئاً حدث بالفعل، بصيغة الماضي" },
        { en: "A database transaction", ar: "معاملة قاعدة بيانات" },
        { en: "A REST endpoint", ar: "REST endpoint" }
      ],
      correct: 1,
      why: { en: "A domain event records that something happened. It is past tense because it is a fact, not a request to do something.", ar: "الـ domain event يسجّل أن شيئاً حدث. وهو بصيغة الماضي لأنه حقيقة، لا طلب لفعل شيء." }
    },
    {
      q: { en: "When should in-process events be dispatched relative to SaveChanges?", ar: "متى تُطلق الـ events الـ in-process بالنسبة لـ SaveChanges؟" },
      options: [
        { en: "Before the save, to save time", ar: "قبل الحفظ، لتوفير الوقت" },
        { en: "After the save commits successfully", ar: "بعد نجاح اعتماد الحفظ" },
        { en: "In a background thread with no ordering", ar: "في thread خلفي بلا ترتيب" },
        { en: "It does not matter", ar: "لا يهم" }
      ],
      correct: 1,
      why: { en: "Dispatching after commit means side effects only run for changes that actually persisted, avoiding emails for orders that failed to save.", ar: "الإطلاق بعد الاعتماد يعني أن الـ side effects تعمل فقط للتغييرات التي حُفظت فعلاً، فتتجنّب emails لـ orders فشل حفظها." }
    },
    {
      q: { en: "What mainly distinguishes an integration event from a domain event?", ar: "ما الذي يميّز الـ integration event عن الـ domain event أساساً؟" },
      options: [
        { en: "It is written in a different language", ar: "يُكتب بلغة مختلفة" },
        { en: "It is published to other services, usually over a broker", ar: "يُنشر إلى خدمات أخرى، عادة عبر broker" },
        { en: "It cannot carry any data", ar: "لا يستطيع حمل أي بيانات" },
        { en: "It runs before the transaction", ar: "يعمل قبل الـ transaction" }
      ],
      correct: 1,
      why: { en: "A domain event stays in-process; an integration event crosses the service boundary to tell other systems, typically through a message broker.", ar: "الـ domain event يبقى داخل الـ process؛ والـ integration event يعبر حدود الخدمة لإبلاغ أنظمة أخرى، عادة عبر message broker." }
    },
    {
      q: { en: "Why should an event carry ids and values instead of the live entity?", ar: "لماذا يجب أن يحمل الـ event معرّفات وقيماً بدل الـ entity الحيّة؟" },
      options: [
        { en: "To make the event larger", ar: "لجعل الـ event أكبر" },
        { en: "So handlers cannot mutate it and stay decoupled from the full model", ar: "حتى لا تستطيع الـ handlers تعديله وتبقى مفصولة عن النموذج كاملاً" },
        { en: "Because entities cannot be serialized", ar: "لأن الـ entities لا يمكن تسلسلها" },
        { en: "To force lazy loading", ar: "لفرض lazy loading" }
      ],
      correct: 1,
      why: { en: "A small, read-only payload keeps the event a stable record of what happened and stops handlers from changing shared state after the fact.", ar: "حمولة صغيرة للقراءة فقط تبقي الـ event سجلاً ثابتاً لما حدث وتمنع الـ handlers من تغيير حالة مشتركة لاحقاً." }
    },
    {
      q: { en: "An in-process handler needs to call a separate billing service. What is the better design?", ar: "handler داخل الـ process يحتاج لاستدعاء خدمة billing منفصلة. ما التصميم الأفضل؟" },
      options: [
        { en: "Make the HTTP call directly inside the handler", ar: "أجرِ الـ HTTP call مباشرة داخل الـ handler" },
        { en: "Publish an integration event and let billing consume it on its own time", ar: "انشر integration event ودع الـ billing يستهلكه في وقته" },
        { en: "Skip the billing call entirely", ar: "تجاوز استدعاء الـ billing كلياً" },
        { en: "Run the order twice", ar: "شغّل الـ order مرتين" }
      ],
      correct: 1,
      why: { en: "A direct call recouples your latency and uptime to billing's. Publishing an integration event (ideally via an outbox) keeps the two services independent.", ar: "الاستدعاء المباشر يعيد ربط زمن استجابتك وتوافرك بالـ billing. نشر integration event (يفضّل عبر outbox) يبقي الخدمتين مستقلتين." }
    }
  ]
};
```

NEXT: structured-logs
