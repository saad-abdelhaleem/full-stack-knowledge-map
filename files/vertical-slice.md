```js
const verticalSliceLesson = {
  id: "vertical-slice",
  moduleId: "architecture",
  title: { en: "Vertical slices", ar: "الشرائح العمودية" },
  summary: {
    en: "Organize code by feature instead of by technical layer, so everything one use case needs lives in one folder.",
    ar: "نظّم الكود حسب الـ feature بدل الطبقات التقنية، بحيث يعيش كل ما يحتاجه الـ use case الواحد في folder واحد."
  },
  mins: 14,
  sections: [
    {
      key: "why",
      blocks: [
        { t: "p",
          en: "Vertical slice architecture organizes your code by feature, not by technical layer. Everything one use case needs — the input model, the validation, the database call, the response — lives together in one folder. The problem it solves is simple: in a layered project, changing one feature means editing files scattered across many folders.",
          ar: "الـ vertical slice architecture ينظّم الكود حسب الـ feature، لا حسب الطبقة التقنية. كل ما يحتاجه الـ use case الواحد — الـ input model والـ validation ونداء الـ database والـ response — يعيش معاً في folder واحد. المشكلة التي يحلّها بسيطة: في المشروع المقسّم بالطبقات، تعديل feature واحدة يعني تحرير ملفات مبعثرة في folders كثيرة." },
        { t: "kv", rows: [
          { k: { en: "Layered architecture", ar: "Layered architecture" },
            v: { en: "Code split into horizontal layers (controllers, services, repositories); each layer is a folder holding a piece of every feature.", ar: "كود مقسّم إلى طبقات أفقية (controllers، services، repositories)؛ كل طبقة folder يحمل جزءاً من كل feature." } },
          { k: { en: "Vertical slice", ar: "Vertical slice" },
            v: { en: "All the code for one feature grouped together, top to bottom, in one place.", ar: "كل كود feature واحدة مجموع معاً، من الأعلى للأسفل، في مكان واحد." } },
          { k: { en: "Feature folder", ar: "Feature folder" },
            v: { en: "A folder named after a use case (like CreateOrder) holding everything that feature needs.", ar: "folder مسمّى باسم use case (مثل CreateOrder) يحمل كل ما تحتاجه تلك الـ feature." } },
          { k: { en: "Coupling", ar: "Coupling" },
            v: { en: "How much one piece of code depends on another; high coupling means a change here forces a change there.", ar: "مقدار اعتماد كود على آخر؛ الـ coupling العالي يعني أن تغييراً هنا يفرض تغييراً هناك." } },
          { k: { en: "Cohesion", ar: "Cohesion" },
            v: { en: "How closely the things in one place belong together; high cohesion means one folder does one job.", ar: "مدى انتماء الأشياء في مكان واحد لبعضها؛ الـ cohesion العالي يعني أن الـ folder الواحد يؤدي مهمة واحدة." } },
          { k: { en: "Cross-cutting concern", ar: "Cross-cutting concern" },
            v: { en: "A need shared by many features, like logging, authentication, or validation rules.", ar: "حاجة مشتركة بين features كثيرة، مثل logging أو authentication أو قواعد الـ validation." } }
        ]},
        { t: "p",
          en: "Think of a supermarket warehouse. Layered architecture sorts it by material: all metal on one aisle, all plastic on another. To assemble one product you walk every aisle. A vertical slice is a recipe kit box: everything for one dish sits in a single box, so you grab the box and you are done.",
          ar: "تخيّل مستودع سوبرماركت. الـ layered architecture يرتّبه حسب المادة: كل المعدن في ممر، كل البلاستيك في ممر آخر. لتجميع منتج واحد تمشي كل الممرات. الـ vertical slice صندوق وصفة جاهز: كل ما يلزم لطبق واحد في صندوق واحد، تأخذ الصندوق وتنتهي." },
        { t: "p",
          en: "A feature folder is that kit box. When the 'create order' rule changes, you open one folder and every part is there: the input, the checks, the save, and the reply. You never hunt across the tree.",
          ar: "الـ feature folder هو ذلك الصندوق. حين تتغيّر قاعدة «إنشاء الطلب»، تفتح folder واحداً وكل جزء موجود: الـ input، الفحوصات، الحفظ، والرد. لا تبحث أبداً عبر الشجرة." },
        { t: "callout", kind: "note",
          en: "This is an organization pattern, not a runtime one. It changes where code lives, not how fast it runs. The payoff is the speed of changing and reading code, not CPU cycles.",
          ar: "هذا نمط تنظيم، لا نمط runtime. يغيّر مكان الكود، لا سرعة تشغيله. الفائدة هي سرعة تعديل الكود وقراءته، لا دورات الـ CPU." }
      ]
    },
    {
      key: "problem",
      blocks: [
        { t: "p",
          en: "Take one real feature: an endpoint POST /orders that creates an order. In a layered project the code for this single feature is spread across seven files in five folders: OrderController, IOrderService, OrderService, IOrderRepository, OrderRepository, CreateOrderRequest, and OrderDto. Each lives with unrelated siblings from other features.",
          ar: "خذ feature حقيقية: endpoint اسمه POST /orders ينشئ طلباً. في مشروع مقسّم بالطبقات ينتشر كود هذه الـ feature الواحدة عبر سبعة ملفات في خمسة folders: OrderController، IOrderService، OrderService، IOrderRepository، OrderRepository، CreateOrderRequest، وOrderDto. كل ملف يعيش مع أشقاء لا علاقة لهم من features أخرى." },
        { t: "p",
          en: "Now add one field, 'couponCode', to that order. You edit the request model, the DTO, the service, the repository, and the controller — five files in five folders for one small change. The pull request diff touches the whole tree, reviewers cannot see the feature as a unit, and two people editing different features in the same OrderService file hit merge conflicts.",
          ar: "الآن أضف حقلاً واحداً اسمه couponCode لذلك الطلب. تحرّر الـ request model والـ DTO والـ service والـ repository والـ controller — خمسة ملفات في خمسة folders لتغيير صغير واحد. الـ pull request diff يمسّ الشجرة كلها، والمراجعون لا يرون الـ feature كوحدة، وشخصان يحرّران features مختلفة في نفس ملف OrderService يصطدمان بـ merge conflicts." },
        { t: "kv", rows: [
          { k: { en: "Layered: add one field", ar: "بالطبقات: إضافة حقل واحد" },
            v: { en: "5 files edited across 5 folders — meaning the change is spread wide and easy to do partially.", ar: "تحرير 5 ملفات عبر 5 folders — أي أن التغيير منتشر واسعاً ويسهل إنجازه ناقصاً." } },
          { k: { en: "Vertical: add one field", ar: "عمودياً: إضافة حقل واحد" },
            v: { en: "1-2 files edited in 1 folder — the whole change fits on one screen.", ar: "تحرير 1-2 ملف في folder واحد — التغيير كله يتّسع في شاشة واحدة." } },
          { k: { en: "The real cost", ar: "التكلفة الحقيقية" },
            v: { en: "Not typing time. It is the risk of missing a file and the time a reviewer needs to trust the change.", ar: "ليست وقت الكتابة. بل خطر نسيان ملف والوقت الذي يحتاجه المراجع ليثق بالتغيير." } }
        ]}
      ]
    },
    {
      key: "internals",
      blocks: [
        { t: "p",
          en: "A vertical slice is not a framework feature. It is a folder convention plus a rule: one folder per use case, and a slice may use shared building blocks but never reaches into another slice. Let us trace the create-order request through a slice, step by step.",
          ar: "الـ vertical slice ليس ميزة framework. هو اصطلاح folders زائد قاعدة: folder واحد لكل use case، ويجوز للشريحة أن تستخدم لبنات مشتركة لكنها لا تمدّ يدها أبداً داخل شريحة أخرى. لنتتبّع طلب إنشاء الطلب عبر شريحة، خطوة خطوة." },
        { t: "kv", rows: [
          { k: { en: "Request", ar: "Request" },
            v: { en: "A small class holding the input for this one feature (the fields of the order).", ar: "class صغير يحمل input هذه الـ feature وحدها (حقول الطلب)." } },
          { k: { en: "Handler", ar: "Handler" },
            v: { en: "The method that runs the feature: validate, do the work, return a result.", ar: "الـ method التي تشغّل الـ feature: validate، ثم العمل، ثم إرجاع نتيجة." } },
          { k: { en: "Endpoint", ar: "Endpoint" },
            v: { en: "The thin route mapping the URL to the handler.", ar: "المسار الرفيع الذي يربط الـ URL بالـ handler." } },
          { k: { en: "Shared kernel", ar: "Shared kernel" },
            v: { en: "Genuinely common code (the DbContext, a money type, auth) that every slice may use.", ar: "كود مشترك فعلاً (الـ DbContext، نوع money، الـ auth) يجوز لكل شريحة استخدامه." } }
        ]},
        { t: "p",
          en: "The request arrives, ASP.NET Core matches the route, and the endpoint calls the handler. The handler validates the input, saves through the shared DbContext (the Entity Framework Core object that talks to the database), and returns a result. Every one of these types lives in the Features/CreateOrder folder. Nothing here is shared with the cancel-order slice except the DbContext.",
          ar: "يصل الـ request، فتطابق ASP.NET Core المسار، فيستدعي الـ endpoint الـ handler. يتحقّق الـ handler من الـ input، ثم يحفظ عبر الـ DbContext المشترك (كائن Entity Framework Core الذي يخاطب الـ database)، ثم يرجّع نتيجة. كل هذه الأنواع تعيش في folder اسمه Features/CreateOrder. لا شيء هنا مشترك مع شريحة إلغاء الطلب سوى الـ DbContext." },
        { t: "code", lang: "csharp",
          label: { en: "One slice, one file: Features/CreateOrder.cs", ar: "شريحة واحدة، ملف واحد: Features/CreateOrder.cs" },
          code: "// everything this feature needs, in one place\npublic record CreateOrderRequest(string CustomerId, string CouponCode);\npublic record CreateOrderResult(Guid OrderId);\n\npublic static class CreateOrder\n{\n    public static void Map(WebApplication app) =>\n        app.MapPost(\"/orders\", Handle);\n\n    public static async Task<IResult> Handle(\n        CreateOrderRequest req, AppDbContext db)\n    {\n        if (string.IsNullOrWhiteSpace(req.CustomerId))\n            return Results.BadRequest(\"CustomerId required\");\n\n        var order = new Order(req.CustomerId, req.CouponCode);\n        db.Orders.Add(order);\n        await db.SaveChangesAsync();\n\n        return Results.Ok(new CreateOrderResult(order.Id));\n    }\n}" },
        { t: "p",
          en: "Notice what is missing: no IOrderService interface with one implementation, no repository wrapping the DbContext. Those layers existed to be reused across features, but a slice serves one feature, so the indirection buys nothing here. Shared code is promoted into the shared kernel only when two slices truly need the same thing.",
          ar: "لاحظ الغائب: لا interface اسمه IOrderService بتطبيق وحيد، ولا repository يلفّ الـ DbContext. تلك الطبقات وُجدت لإعادة الاستخدام عبر الـ features، لكن الشريحة تخدم feature واحدة، فالـ indirection لا يفيد هنا بشيء. لا يُرقّى الكود إلى الـ shared kernel إلا حين تحتاج شريحتان الشيء نفسه فعلاً." },
        { t: "callout", kind: "tip",
          en: "The rule that keeps slices clean: shared code flows down into the shared kernel, never sideways between slices. If slice A calls into slice B, you have rebuilt the tangle you were escaping.",
          ar: "القاعدة التي تبقي الشرائح نظيفة: الكود المشترك ينزل إلى الـ shared kernel، ولا يمرّ جانبياً بين الشرائح. إن نادت الشريحة A الشريحة B فقد أعدت بناء التشابك الذي كنت تهرب منه." }
      ]
    },
    {
      key: "tradeoffs",
      blocks: [
        { t: "tradeoff",
          pros: {
            en: [
              "A change to one feature stays in one folder, so it is fast to make and easy to review.",
              "High cohesion: each folder does one job, so new engineers find things by feature name.",
              "Low coupling between features: two people rarely edit the same file.",
              "Easy to delete a feature — remove the folder, not surgery across layers."
            ],
            ar: [
              "تغيير feature واحدة يبقى في folder واحد، فيسرع تنفيذه ويسهل مراجعته.",
              "cohesion عالٍ: كل folder يؤدي مهمة واحدة، فيجد المهندس الجديد الأشياء باسم الـ feature.",
              "coupling منخفض بين الـ features: نادراً ما يحرّر شخصان الملف نفسه.",
              "حذف feature سهل — تُزيل الـ folder، لا جراحة عبر الطبقات."
            ]
          },
          cons: {
            en: [
              "Genuinely shared logic can get duplicated if the team is undisciplined.",
              "No enforced layering, so a sloppy slice can mix concerns badly.",
              "Less familiar than layers, so a team must agree on the convention first.",
              "Cross-feature reporting queries have no natural home."
            ],
            ar: [
              "المنطق المشترك فعلاً قد يتكرّر إن كان الفريق غير منضبط.",
              "لا layering مفروض، فقد تخلط الشريحة المهملة الـ concerns خلطاً سيئاً.",
              "أقل ألفة من الطبقات، فعلى الفريق الاتفاق على الاصطلاح أولاً.",
              "استعلامات التقارير العابرة للـ features لا موطن طبيعياً لها."
            ]
          },
          limits: {
            en: [
              "It organizes code; it does not fix a bad domain model.",
              "Very small apps see little benefit — the pain it removes is not there yet.",
              "It does not replace the need for shared cross-cutting concerns."
            ],
            ar: [
              "ينظّم الكود؛ لا يصلح domain model سيئاً.",
              "التطبيقات الصغيرة جداً لا تنتفع كثيراً — الألم الذي يزيله غير موجود بعد.",
              "لا يغني عن الحاجة إلى cross-cutting concerns مشتركة."
            ]
          },
          alts: {
            en: [
              "Classic layered architecture when the team knows it and features are thin.",
              "Clean architecture when you need a strict, testable domain core.",
              "Modular monolith: vertical slices grouped into modules with clear boundaries."
            ],
            ar: [
              "الـ layered architecture الكلاسيكي حين يعرفه الفريق والـ features رفيعة.",
              "الـ clean architecture حين تحتاج domain core صارماً وقابلاً للاختبار.",
              "الـ modular monolith: شرائح عمودية مجمّعة في modules بحدود واضحة."
            ]
          }
        }
      ]
    },
    {
      key: "mistakes",
      blocks: [
        { t: "mistake",
          title: { en: "Copy-pasting shared logic into every slice", ar: "نسخ المنطق المشترك في كل شريحة" },
          body: {
            en: "A team copied the same tax calculation into six order slices. A tax rule changed, someone fixed it in five slices and missed the sixth. That slice quietly charged the wrong amount for a week. Duplication is fine for code that only looks similar; it is a trap for code that must stay identical.",
            ar: "نسخ فريق حساب الضريبة نفسه في ست شرائح order. تغيّرت قاعدة ضريبية، فأصلحها أحدهم في خمس شرائح ونسي السادسة. تلك الشريحة حسبت المبلغ خطأً بصمت أسبوعاً. التكرار مقبول لكود يتشابه شكلاً فقط؛ لكنه فخّ لكود يجب أن يبقى متطابقاً." },
          fix: "// move it once into the shared kernel\npublic static Money TaxFor(Order o) => /* single source of truth */;" },
        { t: "mistake",
          title: { en: "One slice calling into another", ar: "شريحة تنادي أخرى" },
          body: {
            en: "The CreateOrder handler called the CancelOrder handler directly to 'reuse' its logic. Now the two features are coupled: a change to cancellation broke order creation, and neither folder is self-contained anymore. Slices must not depend on each other; extract the truly shared part downward instead.",
            ar: "نادى handler الخاص بـ CreateOrder مباشرةً handler الخاص بـ CancelOrder لـ«إعادة استخدام» منطقه. صارت الـ feature-تان مقترنتين: تغيير في الإلغاء كسر إنشاء الطلب، ولم يعد أيّ folder مكتفياً بذاته. يجب ألا تعتمد الشرائح على بعضها؛ استخرج الجزء المشترك فعلاً إلى الأسفل بدلاً من ذلك." } },
        { t: "mistake",
          title: { en: "Dumping everything into one giant handler", ar: "حشر كل شيء في handler عملاق واحد" },
          body: {
            en: "A slice grew to a 400-line handler mixing validation, three database calls, an email send, and a payment call. It was in one folder, but it had no seams, so it could not be unit-tested and no one dared change it. A slice being one folder does not mean it must be one method.",
            ar: "كبرت شريحة إلى handler من 400 سطر يخلط الـ validation وثلاثة نداءات database وإرسال email ونداء payment. كان في folder واحد، لكن بلا مفاصل، فتعذّر اختباره بالـ unit tests ولم يجرؤ أحد على تغييره. كون الشريحة folder واحداً لا يعني أنها method واحدة." } },
        { t: "mistake",
          title: { en: "Forcing MediatR ceremony on every slice", ar: "فرض طقوس MediatR على كل شريحة" },
          body: {
            en: "A team believed vertical slices require MediatR, a library that routes a request object to a handler. They wrapped every trivial endpoint in a command, a handler, and a pipeline behavior. The ceremony cost more than the layering it replaced. Vertical slices are about folder shape, not any one library.",
            ar: "ظنّ فريق أن الشرائح العمودية تتطلّب MediatR، وهي مكتبة توجّه كائن request إلى handler. فلفّوا كل endpoint تافه في command وhandler وpipeline behavior. كلّفت الطقوس أكثر من الطبقات التي استبدلتها. الشرائح العمودية تخصّ شكل الـ folders، لا مكتبة بعينها." } }
      ]
    },
    {
      key: "interview",
      blocks: [
        { t: "qa", level: "junior",
          q: { en: "What is vertical slice architecture in one sentence?", ar: "ما الـ vertical slice architecture في جملة واحدة؟" },
          a: {
            en: "It organizes code by feature instead of by technical layer, so everything one use case needs — input, validation, data access, response — sits in one folder instead of being spread across controller, service, and repository folders.",
            ar: "ينظّم الكود حسب الـ feature بدل الطبقة التقنية، بحيث يجلس كل ما يحتاجه الـ use case الواحد — input وvalidation ووصول للبيانات وresponse — في folder واحد بدل انتشاره عبر folders الـ controller والـ service والـ repository." } },
        { t: "qa", level: "mid",
          q: { en: "How is this different from layered architecture in day-to-day work?", ar: "كيف يختلف هذا عن الـ layered architecture في العمل اليومي؟" },
          a: {
            en: "In layered code, adding a field touches a file in each layer, so one change is spread across many folders. In slices, the same change stays in one folder. The layered cut optimizes for reusing a layer; the slice cut optimizes for changing a feature, which is what we actually do most.",
            ar: "في الكود المقسّم بالطبقات، إضافة حقل تمسّ ملفاً في كل طبقة، فينتشر التغيير الواحد عبر folders كثيرة. في الشرائح يبقى التغيير نفسه في folder واحد. القطع الطبقي يحسّن لإعادة استخدام طبقة؛ والقطع الشريحي يحسّن لتغيير feature، وهو ما نفعله فعلاً في الغالب." } },
        { t: "qa", level: "mid",
          q: { en: "Do you still share code, and how?", ar: "هل ما زلت تشارك الكود، وكيف؟" },
          a: {
            en: "Yes. Truly shared things — the DbContext, a Money type, auth — go into a shared kernel that any slice may use. The rule is direction: shared code flows down into the kernel, never sideways from slice to slice. If two slices need the same logic, I promote it down, I do not let one call the other.",
            ar: "نعم. الأشياء المشتركة فعلاً — الـ DbContext ونوع Money والـ auth — تذهب إلى shared kernel يجوز لأي شريحة استخدامه. القاعدة اتجاه: الكود المشترك ينزل إلى الـ kernel، ولا يمرّ جانبياً من شريحة لشريحة. إن احتاجت شريحتان المنطق نفسه أرقّيه للأسفل، ولا أدع إحداهما تنادي الأخرى." } },
        { t: "qa", level: "senior",
          q: { en: "When would you NOT use vertical slices?", ar: "متى لا تستخدم الشرائح العمودية؟" },
          a: {
            en: "When the domain logic is rich and must be protected and tested in isolation, I lean toward clean architecture with a strict domain core. And for a tiny CRUD app the slice payoff is small — there is little scattering to fix. Vertical slices shine in feature-heavy apps where teams change features independently.",
            ar: "حين يكون منطق الـ domain غنياً ويجب حمايته واختباره بمعزل، أميل إلى clean architecture بـ domain core صارم. ولتطبيق CRUD صغير جداً تكون فائدة الشرائح ضئيلة — لا انتشار يُذكر لإصلاحه. الشرائح العمودية تتألّق في التطبيقات كثيرة الـ features حيث تغيّر الفرق الـ features باستقلال." } },
        { t: "qa", level: "senior",
          q: { en: "How do you stop slices from drifting into a mess over time?", ar: "كيف تمنع انحراف الشرائح إلى فوضى مع الوقت؟" },
          a: {
            en: "Two guards. First, an architecture test that fails the build if one slice references another slice's namespace. Second, a review habit: shared logic must live in the kernel, and any slice-to-slice call is a red flag. Without those, discipline erodes and you slowly rebuild coupling.",
            ar: "حارسان. أولاً، architecture test يُفشل الـ build إن أشارت شريحة إلى namespace شريحة أخرى. ثانياً، عادة مراجعة: المنطق المشترك يجب أن يعيش في الـ kernel، وأي نداء بين الشرائح علامة خطر. بدونهما ينهار الانضباط وتعيد بناء الـ coupling ببطء." } },
        { t: "qa", level: "staff",
          q: { en: "How do you roll vertical slices out across several teams?", ar: "كيف تنشر الشرائح العمودية عبر عدة فرق؟" },
          a: {
            en: "I do not mandate a rewrite. I agree one folder convention and a shared kernel boundary, add an architecture test to CI so the rule enforces itself, and let new features be born as slices while old layered code stays until it is touched. The organizational win is that each team owns its slices, so ownership maps to folders and PRs stop overlapping.",
            ar: "لا أفرض إعادة كتابة. أتفق على اصطلاح folder واحد وحدّ shared kernel، وأضيف architecture test إلى الـ CI ليفرض القاعدة نفسه، وأدع الـ features الجديدة تولد شرائح بينما يبقى الكود الطبقي القديم حتى يُلمس. المكسب التنظيمي أن كل فريق يملك شرائحه، فتنطبق الملكية على الـ folders وتتوقّف الـ PRs عن التداخل." } }
      ]
    },
    {
      key: "codereview",
      blocks: [
        { t: "review", severity: "high",
          title: { en: "A slice reaching into another slice", ar: "شريحة تمدّ يدها داخل أخرى" },
          bad: "// Features/CreateOrder.cs\nvar handler = new CancelOrder.Handler(db);\nawait handler.Handle(new CancelOrderRequest(id));",
          good: "// shared kernel: OrderOperations.cs\npublic static Task ReleaseHold(AppDbContext db, Guid id) { /* ... */ }\n\n// both slices call the shared operation, not each other\nawait OrderOperations.ReleaseHold(db, id);",
          why: {
            en: "One slice constructing and calling another couples the two features: a change to cancellation now breaks order creation, and neither folder is self-contained. Move the shared step down into the kernel and have both slices call it.",
            ar: "بناء شريحة لأخرى ونداؤها يقرن الـ feature-تين: تغيير في الإلغاء يكسر الآن إنشاء الطلب، ولا folder مكتفٍ بذاته. انقل الخطوة المشتركة إلى الـ kernel ودع كلتا الشريحتين تناديها." } },
        { t: "review", severity: "medium",
          title: { en: "A pointless one-implementation interface inside a slice", ar: "interface بلا معنى بتطبيق وحيد داخل شريحة" },
          bad: "// Features/CreateOrder/\npublic interface ICreateOrderService { Task<Guid> Run(CreateOrderRequest r); }\npublic class CreateOrderService : ICreateOrderService { /* only impl */ }",
          good: "// Features/CreateOrder.cs — no interface, the handler is the unit\npublic static async Task<IResult> Handle(CreateOrderRequest req, AppDbContext db)\n{ /* ... */ }",
          why: {
            en: "An interface earns its cost when it has more than one implementation or hides a boundary you swap in tests. Here it has exactly one implementation used in one slice, so it is indirection with no payoff. Delete it and let the handler be the seam.",
            ar: "الـ interface يستحق تكلفته حين يملك أكثر من تطبيق أو يخفي حدّاً تبدّله في الاختبارات. هنا له تطبيق واحد يُستخدم في شريحة واحدة، فهو indirection بلا فائدة. احذفه ودع الـ handler يكون المفصل." } }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        { t: "p",
          en: "Vertical slices are the natural inner structure of a modular monolith — one deployable app split into modules, each module a set of slices with a clear boundary. When a module later needs to become its own service, the seam is already there: the module talked to the rest of the app through a small shared surface, not through tangled layers, so it can be lifted out.",
          ar: "الشرائح العمودية هي البنية الداخلية الطبيعية للـ modular monolith — تطبيق واحد قابل للنشر مقسّم إلى modules، كل module مجموعة شرائح بحدّ واضح. حين يحتاج module لاحقاً أن يصير service مستقلاً، يكون المفصل جاهزاً: خاطب الـ module بقية التطبيق عبر سطح مشترك صغير، لا عبر طبقات متشابكة، فيمكن اقتلاعه." },
        { t: "ul",
          en: [
            "Feature-heavy line-of-business apps where teams add endpoints independently every sprint.",
            "A modular monolith you may later split: slice boundaries become service boundaries.",
            "Code owned by feature team: folder ownership maps cleanly to team ownership in CODEOWNERS.",
            "Apps where deleting features is common — a slice removes as one folder."
          ],
          ar: [
            "تطبيقات الأعمال كثيرة الـ features حيث تضيف الفرق endpoints باستقلال كل sprint.",
            "modular monolith قد تقسّمه لاحقاً: حدود الشرائح تصير حدود services.",
            "كود تملكه فرق الـ features: ملكية الـ folder تنطبق بنظافة على ملكية الفريق في CODEOWNERS.",
            "تطبيقات يكثر فيها حذف الـ features — تُزال الشريحة كـ folder واحد."
          ] }
      ]
    },
    {
      key: "perf",
      blocks: [
        { t: "kv", rows: [
          { k: { en: "Latency", ar: "Latency" },
            v: { en: "No runtime effect. Slices are a compile-time organization; the request path is the same length as layered code.", ar: "لا أثر runtime. الشرائح تنظيم وقت الترجمة؛ مسار الـ request بطول مسار الكود الطبقي نفسه." } },
          { k: { en: "CPU", ar: "CPU" },
            v: { en: "Neutral to slightly better — dropping needless interface/repository indirection removes a few virtual calls.", ar: "محايد إلى أفضل قليلاً — إسقاط indirection غير الضروري من interface/repository يزيل بضع virtual calls." } },
          { k: { en: "Database", ar: "Database" },
            v: { en: "Positive: each slice owns its own query, so you can tune the one hot query without touching a shared repository used by twenty features.", ar: "إيجابي: كل شريحة تملك استعلامها، فتضبط الاستعلام الساخن الواحد دون لمس repository مشترك تستخدمه عشرون feature." } },
          { k: { en: "Scalability (team)", ar: "Scalability (الفريق)" },
            v: { en: "Positive: parallel work with fewer merge conflicts, so more engineers ship features at once.", ar: "إيجابي: عمل متوازٍ بـ merge conflicts أقل، فيشحن مهندسون أكثر features في وقت واحد." } },
          { k: { en: "Memory", ar: "Memory" },
            v: { en: "No meaningful difference; the same objects are allocated regardless of folder layout.", ar: "لا فرق يُذكر؛ تُخصَّص الكائنات نفسها بصرف النظر عن ترتيب الـ folders." } }
        ]}
      ]
    },
    {
      key: "debug",
      blocks: [
        { t: "ul",
          en: [
            "IDE 'find usages' on a slice type: confirm no other slice references it — any hit outside the folder is a leak.",
            "grep for a slice's namespace across the repo: results should stay inside that one folder.",
            "NetArchTest or ArchUnitNET in a unit test: fails the build if slice A depends on slice B.",
            "git log --stat on a feature folder: shows whether changes really stay contained in the slice.",
            "Solution-wide search for the DbContext type: confirms shared code sits in the kernel, not copied per slice."
          ],
          ar: [
            "«find usages» في الـ IDE على نوع من شريحة: تأكّد ألا شريحة أخرى تشير إليه — أي إصابة خارج الـ folder تسرّب.",
            "grep لـ namespace الشريحة عبر الـ repo: يجب أن تبقى النتائج داخل ذلك الـ folder وحده.",
            "NetArchTest أو ArchUnitNET في unit test: يُفشل الـ build إن اعتمدت الشريحة A على B.",
            "git log --stat على feature folder: يُظهر إن كانت التغييرات تبقى محتواة في الشريحة فعلاً.",
            "بحث على مستوى الـ solution عن نوع الـ DbContext: يؤكّد أن الكود المشترك في الـ kernel، لا منسوخاً لكل شريحة."
          ] },
        { t: "callout", kind: "tip",
          en: "The best debugging aid is an architecture test that runs in CI. It turns 'please do not call another slice' from a code-review reminder into a build failure, so the rule holds without anyone policing it.",
          ar: "أفضل أداة debugging هي architecture test يعمل في الـ CI. يحوّل «رجاءً لا تنادِ شريحة أخرى» من تذكير في المراجعة إلى فشل build، فتصمد القاعدة دون أن يراقبها أحد." }
      ]
    },
    {
      key: "realworld",
      blocks: [
        { t: "p",
          en: "Vertical slices fit anywhere the unit of change is a feature and teams work in parallel. The pattern earns its keep when many small features are added, changed, and retired independently, and it pays back most when combined with an architecture test so the slice boundaries do not quietly erode.",
          ar: "الشرائح العمودية تناسب كل موضع تكون فيه وحدة التغيير feature وتعمل فيه الفرق بالتوازي. يستحق النمط وجوده حين تُضاف features صغيرة كثيرة وتُغيَّر وتُتقاعد باستقلال، ويردّ أكثر ما يردّ حين يُدمج مع architecture test كي لا تتآكل حدود الشرائح بصمت." },
        { t: "ul",
          en: [
            "Internal admin and back-office tools: dozens of small screens, each a self-contained slice.",
            "Line-of-business SaaS: billing, onboarding, reporting features owned by different squads.",
            "Public APIs with many endpoints where each endpoint is one clear use case.",
            "E-commerce backends where checkout, cart, and catalog change on different schedules."
          ],
          ar: [
            "أدوات الإدارة الداخلية والـ back-office: عشرات الشاشات الصغيرة، كل منها شريحة مكتفية بذاتها.",
            "SaaS للأعمال: features الفوترة والـ onboarding والتقارير تملكها squads مختلفة.",
            "الـ public APIs كثيرة الـ endpoints حيث كل endpoint use case واحد واضح.",
            "خلفيات التجارة الإلكترونية حيث يتغيّر الـ checkout والـ cart والـ catalog بجداول مختلفة."
          ] }
      ]
    },
    {
      key: "exercises",
      blocks: [
        { t: "ex", diff: "easy",
          en: "Take a layered CRUD controller with a service and a repository for one entity. Fold it into a single feature folder with a request, a handler, and an endpoint. Success: the whole feature reads top to bottom in one file and still passes its existing tests.",
          ar: "خذ controller من نوع CRUD مقسّم بالطبقات مع service وrepository لكيان واحد. اطوِه في feature folder واحد بـ request وhandler وendpoint. النجاح: تُقرأ الـ feature كلها من الأعلى للأسفل في ملف واحد وتظل تجتاز اختباراتها الحالية." },
        { t: "ex", diff: "medium",
          en: "Add a second slice that shares one piece of logic with the first. Put the shared logic in a shared kernel and have both slices call it. Success: neither slice references the other's namespace, proven by a grep that stays inside each folder.",
          ar: "أضف شريحة ثانية تشارك الأولى قطعة منطق واحدة. ضع المنطق المشترك في shared kernel ودع كلتا الشريحتين تناديه. النجاح: لا شريحة تشير إلى namespace الأخرى، يثبته grep يبقى داخل كل folder." },
        { t: "ex", diff: "hard",
          en: "Add an architecture test (NetArchTest) that fails if any slice type depends on another slice's namespace. Then deliberately add a cross-slice call and confirm the build turns red. Success: the test catches the violation before code review.",
          ar: "أضف architecture test (NetArchTest) يفشل إن اعتمد نوع في شريحة على namespace شريحة أخرى. ثم أضف عمداً نداءً بين الشرائح وتأكّد أن الـ build يحمرّ. النجاح: يمسك الاختبار المخالفة قبل مراجعة الكود." },
        { t: "ex", diff: "senior",
          en: "Group your slices into two modules with a clear shared boundary, as if preparing one module to become its own service. Document the small surface the modules use to talk. Success: you can list every call that crosses the module boundary on one page.",
          ar: "جمّع شرائحك في module-ين بحدّ مشترك واضح، كأنك تجهّز module ليصير service مستقلاً. وثّق السطح الصغير الذي تتخاطب به الـ modules. النجاح: تستطيع سرد كل نداء يعبر حدّ الـ module في صفحة واحدة." }
      ]
    },
    {
      key: "refs",
      blocks: [
        { t: "ref",
          label: { en: "Jimmy Bogard — Vertical Slice Architecture", ar: "Jimmy Bogard — Vertical Slice Architecture" },
          url: "https://www.jimmybogard.com/vertical-slice-architecture/",
          meta: { en: "Article", ar: "مقال" } },
        { t: "ref",
          label: { en: "Microsoft — Common web application architectures", ar: "Microsoft — بنى تطبيقات الويب الشائعة" },
          url: "https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures",
          meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref",
          label: { en: "ASP.NET Core Minimal APIs overview", ar: "نظرة عامة على ASP.NET Core Minimal APIs" },
          url: "https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis/overview",
          meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref",
          label: { en: "NetArchTest — enforce architecture rules in tests", ar: "NetArchTest — فرض قواعد البنية في الاختبارات" },
          url: "https://github.com/BenMorris/NetArchTest",
          meta: { en: "Library", ar: "مكتبة" } }
      ]
    }
  ],
  quiz: [
    {
      q: { en: "What is the main organizing principle of vertical slice architecture?", ar: "ما المبدأ التنظيمي الرئيسي للـ vertical slice architecture؟" },
      options: [
        { en: "Group code by technical layer (controllers, services, repositories).", ar: "تجميع الكود حسب الطبقة التقنية (controllers، services، repositories)." },
        { en: "Group all code for one feature together in one place.", ar: "تجميع كل كود feature واحدة معاً في مكان واحد." },
        { en: "Split every class behind an interface.", ar: "فصل كل class خلف interface." },
        { en: "Put all database code in one shared repository.", ar: "وضع كل كود الـ database في repository مشترك واحد." }
      ],
      correct: 1,
      why: { en: "A slice keeps everything one feature needs — input, validation, data access, response — together, cutting the code by feature rather than by layer.", ar: "الشريحة تبقي كل ما تحتاجه feature واحدة — input وvalidation ووصول للبيانات وresponse — معاً، فتقطع الكود حسب الـ feature لا الطبقة." }
    },
    {
      q: { en: "In a layered project, why is adding one field to a feature costly?", ar: "في مشروع مقسّم بالطبقات، لماذا تكلّف إضافة حقل واحد لـ feature؟" },
      options: [
        { en: "It requires a database migration every time.", ar: "تتطلّب database migration في كل مرة." },
        { en: "The change is spread across a file in each layer, so it is easy to miss one.", ar: "ينتشر التغيير عبر ملف في كل طبقة، فيسهل نسيان أحدها." },
        { en: "Layered code cannot be unit-tested.", ar: "الكود الطبقي لا يمكن اختباره بالـ unit tests." },
        { en: "It forces you to use MediatR.", ar: "يفرض عليك استخدام MediatR." }
      ],
      correct: 1,
      why: { en: "One logical change touches the request model, DTO, service, repository, and controller — five files in five folders, which is easy to do partially and hard to review.", ar: "تغيير منطقي واحد يمسّ الـ request model والـ DTO والـ service والـ repository والـ controller — خمسة ملفات في خمسة folders، يسهل إنجازها ناقصة ويصعب مراجعتها." }
    },
    {
      q: { en: "What is the rule for sharing code between slices?", ar: "ما قاعدة مشاركة الكود بين الشرائح؟" },
      options: [
        { en: "Slices may call each other freely to reuse logic.", ar: "يجوز للشرائح أن تنادي بعضها بحرية لإعادة استخدام المنطق." },
        { en: "Never share anything; duplicate all code.", ar: "لا تشارك شيئاً أبداً؛ كرّر كل الكود." },
        { en: "Shared code flows down into a shared kernel; slices never depend on each other.", ar: "الكود المشترك ينزل إلى shared kernel؛ ولا تعتمد الشرائح على بعضها." },
        { en: "Shared code goes into whichever slice needs it most.", ar: "الكود المشترك يذهب إلى الشريحة الأكثر حاجة إليه." }
      ],
      correct: 2,
      why: { en: "Truly shared code is promoted down into the shared kernel that any slice may use; a slice calling another slice rebuilds the coupling the pattern removes.", ar: "الكود المشترك فعلاً يُرقّى للأسفل إلى shared kernel يجوز لأي شريحة استخدامه؛ ونداء شريحة لأخرى يعيد بناء الـ coupling الذي يزيله النمط." }
    },
    {
      q: { en: "How do vertical slices affect request latency at runtime?", ar: "كيف تؤثّر الشرائح العمودية في latency الـ request أثناء التشغيل؟" },
      options: [
        { en: "They make requests significantly faster.", ar: "تجعل الـ requests أسرع بكثير." },
        { en: "They have essentially no runtime effect; it is a compile-time organization.", ar: "لا أثر runtime لها فعلياً؛ فهي تنظيم وقت الترجمة." },
        { en: "They add latency because of extra folders.", ar: "تضيف latency بسبب الـ folders الإضافية." },
        { en: "They double memory usage.", ar: "تضاعف استهلاك الـ memory." }
      ],
      correct: 1,
      why: { en: "Slices only change where code lives, not the request path; latency and memory are essentially unchanged, though dropping needless indirection can shave a few virtual calls.", ar: "الشرائح تغيّر مكان الكود فقط، لا مسار الـ request؛ فالـ latency والـ memory بلا تغيير يُذكر، وإن كان إسقاط الـ indirection غير الضروري قد يوفّر بضع virtual calls." }
    },
    {
      q: { en: "What is the most reliable way to stop slices from depending on each other over time?", ar: "ما أوثق طريقة لمنع اعتماد الشرائح على بعضها مع الوقت؟" },
      options: [
        { en: "Trust engineers to remember the rule in code review.", ar: "الثقة بأن يتذكّر المهندسون القاعدة في مراجعة الكود." },
        { en: "Add an architecture test in CI that fails the build on a cross-slice dependency.", ar: "إضافة architecture test في الـ CI يُفشل الـ build عند اعتماد بين الشرائح." },
        { en: "Put every slice behind an interface.", ar: "وضع كل شريحة خلف interface." },
        { en: "Merge all slices into one folder.", ar: "دمج كل الشرائح في folder واحد." }
      ],
      correct: 1,
      why: { en: "An automated architecture test turns the rule into a build failure, so the boundary holds without relying on anyone remembering it during review.", ar: "الـ architecture test الآلي يحوّل القاعدة إلى فشل build، فيصمد الحدّ دون الاعتماد على تذكّر أحد له أثناء المراجعة." }
    }
  ]
};
```

NEXT: cqrs
