```js
const restConstraintsLesson = {
  id: "rest-constraints",
  moduleId: "foundations",
  title: { en: "The six constraints", ar: "القيود الستة" },
  summary: {
    en: "What Fielding actually constrained, what each constraint buys you, and the specific thing that breaks the moment you violate one.",
    ar: "ما الذي قيّده Fielding فعلاً، وما الذي يشتريه لك كل قيد، وما الذي ينكسر تحديداً لحظة أن تخالف واحداً منها."
  },
  mins: 13,
  sections: [
    { key: "why", blocks: [
      { t: "p", en: "REST is not a set of URL naming rules and it is not a synonym for JSON over HTTP. It is an architectural style described in Roy Fielding's 2000 dissertation, defined by a set of constraints deliberately imposed on a distributed system. The word constraint is the important one: each of the six removes a freedom from the designer, and in exchange grants a property to the system — visibility, scalability, independent evolvability, or fault tolerance.", ar: "الـ REST ليس مجموعة قواعد لتسمية الـ URLs وليس مرادفاً لإرسال JSON فوق HTTP. إنه نمط معماري وصفه Roy Fielding في أطروحته عام 2000، ويُعرَّف بمجموعة قيود مفروضة عمداً على نظام موزّع. وكلمة «قيد» هي المهمة هنا: فكل واحد من الستة يسلب المصمّم حرية ما، ويمنح النظام في المقابل خاصية — الوضوح أو قابلية التوسّع أو التطوّر المستقل أو تحمّل الأعطال." },
      { t: "p", en: "The reason this matters practically is that the constraints are why the web scaled to billions of clients without a coordinating authority. Caches, proxies, load balancers and CDNs are all generic infrastructure that works on any application it has never seen before, and that only works because every participant obeys the same small set of rules. When your API violates one, you do not get a compile error — you quietly lose the infrastructure that depended on the rule.", ar: "وسبب أهمية هذا عملياً أن هذه القيود هي ما مكّن الويب من التوسّع إلى مليارات العملاء دون سلطة منسّقة. فالـ caches والـ proxies وموازنات الأحمال والـ CDNs كلها بنية تحتية عامة تعمل مع أي تطبيق لم ترَه من قبل، ولا ينجح ذلك إلا لأن كل مشارك يطيع نفس المجموعة الصغيرة من القواعد. وحين يخالف API لديك واحداً منها فلن تحصل على خطأ ترجمة — بل تفقد بهدوء البنية التحتية التي كانت تعتمد على تلك القاعدة." },
      { t: "p", en: "The other reason to know them precisely is that \"is this RESTful?\" is a useless question in a design review, while \"which constraint does this violate and what do we lose?\" is a productive one. Violating a constraint is sometimes the right call — GraphQL gives up uniform interface and cacheability on purpose, and gets query flexibility in return. What is not defensible is violating one without knowing you did.", ar: "والسبب الآخر لمعرفتها بدقة أن سؤال «هل هذا RESTful؟» عديم الفائدة في مراجعة تصميم، بينما سؤال «أي قيد يخالفه هذا وماذا نخسر؟» سؤال منتج. فمخالفة قيد قد تكون القرار الصحيح أحياناً — فالـ GraphQL يتنازل عن الواجهة الموحدة وقابلية الـ caching عن قصد ويحصل على مرونة الاستعلام في المقابل. وما لا يمكن الدفاع عنه هو مخالفة قيد دون أن تدري أنك خالفته." },
      { t: "callout", kind: "note", en: "Five constraints are required; code-on-demand is explicitly optional. A system that satisfies all five plus HATEOAS is what Fielding called REST — and by that standard almost nothing in the industry called a REST API actually is one.", ar: "خمسة قيود إلزامية، والـ code-on-demand اختياري صراحةً. والنظام الذي يحقق الخمسة مع HATEOAS هو ما سماه Fielding بالـ REST — وبهذا المعيار فإن معظم ما تسميه الصناعة REST API ليس كذلك فعلاً." }
    ]},

    { key: "problem", blocks: [
      { t: "p", en: "Before the constraints were articulated, distributed object systems — CORBA, DCOM, early SOAP — tried to make a remote call look like a local one. Each service exposed its own bespoke interface, so no intermediary could do anything useful with a message it had not been compiled against. A proxy could not cache a response because it had no idea whether the operation was a read. A load balancer could not move a session because state lived in the server. Scaling meant scaling the specific server that held your data.", ar: "قبل صياغة هذه القيود، حاولت أنظمة الكائنات الموزّعة — CORBA و DCOM و SOAP المبكر — أن تجعل الاستدعاء البعيد يبدو كالمحلي. فكانت كل خدمة تعرض واجهة خاصة بها، ولم يستطع أي وسيط فعل شيء مفيد برسالة لم يُترجَم مقابلها. لم يستطع الـ proxy تخزين استجابة لأنه لا يعرف هل العملية قراءة. ولم يستطع موازن الأحمال نقل جلسة لأن الحالة تعيش في السيرفر. وكان التوسّع يعني توسيع السيرفر المحدد الذي يحمل بياناتك." },
      { t: "p", en: "The constraints invert that. A generic cache can serve a GET it has never seen before because the method's semantics are universal. A load balancer can send request N+1 to a different node because no per-client state lives on any node. A CDN can sit between client and origin without either knowing, because a layered system forbids a component from seeing beyond its immediate neighbour. Every one of those capabilities exists only because a freedom was given up.", ar: "والقيود تعكس ذلك. فالـ cache العام يستطيع خدمة GET لم يره من قبل لأن دلالات الـ method عالمية. وموازن الأحمال يستطيع إرسال الـ request رقم N+1 إلى node مختلف لأن لا حالة خاصة بالعميل تعيش على أي node. والـ CDN يستطيع الجلوس بين الـ client والـ origin دون أن يعرف أحدهما، لأن النظام الطبقي يمنع مكوّناً من الرؤية أبعد من جاره المباشر. وكل واحدة من تلك القدرات موجودة فقط لأن حرية ما قد سُلِّمت." },
      { t: "kv", rows: [
        { k: { en: "Stateless violated (sticky sessions)", ar: "مخالفة الـ statelessness (جلسات لاصقة)" }, v: { en: "A node restart logs out every user pinned to it; autoscaling down drops live sessions; deploys become disruptive rather than routine", ar: "إعادة تشغيل node تُخرج كل مستخدم مثبّت عليه؛ والتقليص التلقائي يُسقط جلسات حية؛ ويصبح النشر معطّلاً بدل أن يكون روتينياً" } },
        { k: { en: "Cacheable violated (mutating GET)", ar: "مخالفة الـ cacheability (GET يغيّر الحالة)" }, v: { en: "You must set no-store on the whole path prefix, losing the 90%+ offload a CDN would have given you", ar: "تضطر لضبط no-store على بادئة المسار كلها، فتخسر تخفيفاً يفوق 90% كان الـ CDN سيمنحك إياه" } },
        { k: { en: "Uniform interface violated (POST /api?action=getUser)", ar: "مخالفة الواجهة الموحدة (POST /api?action=getUser)" }, v: { en: "No intermediary can cache, retry or route intelligently; every client needs bespoke knowledge of your verb vocabulary", ar: "لا يستطيع أي وسيط الـ caching أو إعادة المحاولة أو التوجيه الذكي؛ ويحتاج كل client معرفة خاصة بمفردات أفعالك" } },
        { k: { en: "Layered system violated (client depends on origin IP)", ar: "مخالفة النظام الطبقي (client يعتمد على IP الـ origin)" }, v: { en: "You cannot insert a CDN, a gateway or a canary layer without a coordinated client change", ar: "لا تستطيع إدخال CDN أو gateway أو طبقة canary دون تغيير منسّق لدى العملاء" } },
        { k: { en: "Client-server violated (shared database between UI and service)", ar: "مخالفة الفصل بين الـ client والسيرفر (قاعدة بيانات مشتركة بين الواجهة والخدمة)" }, v: { en: "The two can no longer be deployed or evolved independently; a schema change breaks both at once", ar: "لم يعد بالإمكان نشرهما أو تطويرهما بشكل مستقل؛ وتغيير الـ schema يكسر الاثنين معاً" } }
      ]}
    ]},

    { key: "internals", blocks: [
      { t: "p", en: "The six constraints are layered: each is added to the previous ones, and the derived properties accumulate. It is worth reading them as a sequence of design decisions rather than a checklist.", ar: "القيود الستة متراكبة: كل واحد يُضاف إلى ما قبله، وتتراكم الخصائص المشتقة. ويستحق الأمر قراءتها كسلسلة قرارات تصميم لا كقائمة تحقق." },
      { t: "kv", rows: [
        { k: { en: "1. Client–server", ar: "1. الفصل بين الـ client والسيرفر" }, v: { en: "Separate user-interface concerns from data storage. Buys independent evolution and deployment of the two sides.", ar: "افصل اهتمامات واجهة المستخدم عن تخزين البيانات. يشتري تطوّراً ونشراً مستقلين للطرفين." } },
        { k: { en: "2. Stateless", ar: "2. انعدام الحالة" }, v: { en: "Every request carries everything needed to understand it; no session context stored on the server between requests. Buys scalability, reliability and visibility.", ar: "كل request يحمل كل ما يلزم لفهمه؛ ولا سياق جلسة يُخزَّن على السيرفر بين الـ requests. يشتري قابلية التوسّع والموثوقية والوضوح." } },
        { k: { en: "3. Cacheable", ar: "3. قابلية الـ caching" }, v: { en: "Responses must declare themselves cacheable or not. Buys reduced latency and origin load — at the cost of possible staleness.", ar: "يجب أن تعلن الاستجابات كونها قابلة للتخزين أم لا. يشتري زمن استجابة أقل وحملاً أخف على الـ origin — بثمن قِدَم محتمل." } },
        { k: { en: "4. Uniform interface", ar: "4. الواجهة الموحدة" }, v: { en: "The central constraint, with four sub-constraints. Buys generic intermediaries and decoupled clients; costs efficiency versus a bespoke protocol.", ar: "القيد المركزي، وله أربعة قيود فرعية. يشتري وسطاء عامّين وعملاء غير مترابطين؛ ويكلّف كفاءة مقارنةً ببروتوكول مفصّل." } },
        { k: { en: "5. Layered system", ar: "5. النظام الطبقي" }, v: { en: "A component can only see its immediate layer. Buys the freedom to insert gateways, caches and load balancers invisibly; costs added latency per hop.", ar: "المكوّن لا يرى إلا طبقته المباشرة. يشتري حرية إدخال gateways وcaches وموازنات بشكل غير مرئي؛ ويكلّف زمناً إضافياً لكل قفزة." } },
        { k: { en: "6. Code-on-demand (optional)", ar: "6. الكود عند الطلب (اختياري)" }, v: { en: "The server may ship executable code (JavaScript) to extend the client. Buys client flexibility; reduces visibility — the only optional constraint.", ar: "يجوز للسيرفر إرسال كود قابل للتنفيذ (JavaScript) لتوسيع الـ client. يشتري مرونة للعميل؛ ويقلّل الوضوح — وهو القيد الاختياري الوحيد." } }
      ]},
      { t: "p", en: "The uniform interface is where most of the substance lives, and it has four sub-constraints that people rarely name individually. Identification of resources: every thing worth talking about has a URI, and the URI names the resource, not the representation. Manipulation through representations: the client holds a representation (JSON, XML, HTML) with enough metadata to modify or delete the resource — you send a document that describes desired state, not a procedure call. Self-descriptive messages: each message carries everything an intermediary needs — method, media type, cache directives — so nothing needs out-of-band knowledge. And hypermedia as the engine of application state (HATEOAS): the client discovers what it can do next from links in the response rather than from a hardcoded URL template.", ar: "الواجهة الموحدة هي موطن معظم الجوهر، ولها أربعة قيود فرعية نادراً ما يسمّيها الناس فرادى. تعريف الموارد: كل شيء يستحق الحديث عنه له URI، والـ URI يسمّي المورد لا التمثيل. والتعديل عبر التمثيلات: يحمل الـ client تمثيلاً (JSON أو XML أو HTML) بما يكفي من الـ metadata لتعديل المورد أو حذفه — فأنت ترسل مستنداً يصف الحالة المرغوبة لا استدعاء إجراء. والرسائل ذاتية الوصف: كل رسالة تحمل كل ما يحتاجه الوسيط — الـ method والـ media type وتوجيهات الـ caching — فلا يحتاج شيء معرفة خارج القناة. وأخيراً الـ hypermedia كمحرّك لحالة التطبيق (HATEOAS): يكتشف الـ client ما يستطيع فعله تالياً من روابط في الاستجابة لا من قالب URL مكتوب في الكود." },
      { t: "code", lang: "json", label: { en: "The same resource, with and without hypermedia", ar: "نفس المورد، مع الـ hypermedia وبدونه" }, code: "// Typical: the client hardcodes which transitions are legal\n{\n  \"id\": \"ord_8812\",\n  \"status\": \"pending_payment\",\n  \"total\": 249.90\n}\n\n// Hypermedia: the server tells the client what is currently possible\n{\n  \"id\": \"ord_8812\",\n  \"status\": \"pending_payment\",\n  \"total\": 249.90,\n  \"_links\": {\n    \"self\":   { \"href\": \"/orders/ord_8812\" },\n    \"pay\":    { \"href\": \"/orders/ord_8812/payment\", \"method\": \"POST\" },\n    \"cancel\": { \"href\": \"/orders/ord_8812\",         \"method\": \"DELETE\" }\n  }\n}\n// Once paid, the server simply stops emitting \"cancel\" — the client\n// does not need a new release to learn that cancellation is no longer legal." },
      { t: "p", en: "Richardson's maturity model is the usual way teams locate themselves: level 0 is a single endpoint tunnelling everything over POST; level 1 introduces resources but still one verb; level 2 uses HTTP methods and status codes correctly — where the overwhelming majority of production APIs sit; level 3 adds hypermedia controls. Fielding himself has been explicit that only level 3 is REST, and equally explicit that this is not a moral judgement — it is a statement about which properties you actually get.", ar: "نموذج نضج Richardson هو الطريقة المعتادة لتحديد موقع الفريق: المستوى صفر هو endpoint واحد يمرّر كل شيء عبر POST؛ والمستوى الأول يُدخل الموارد لكن بفعل واحد؛ والمستوى الثاني يستخدم الـ HTTP methods والـ status codes بشكل صحيح — وهنا تقع الغالبية الساحقة من APIs الـ production؛ والمستوى الثالث يضيف ضوابط الـ hypermedia. وقد صرّح Fielding نفسه بأن المستوى الثالث وحده هو REST، وصرّح بالمثل أن هذا ليس حكماً أخلاقياً — بل تقرير لأي خصائص تحصل عليها فعلاً." },
      { t: "p", en: "Statelessness is the constraint most often misunderstood, because \"stateless\" does not mean the application has no state. The server holds resource state — orders, users, balances — and that is the whole point of having a server. What it must not hold is application state: where a particular client is in a multi-step interaction. That belongs in the request, or in a resource with a URI the client can address. A shopping cart on the server is fine when it is /carts/{id}, a resource anyone can fetch; it violates the constraint when it is an in-memory dictionary keyed by a session id that only node 3 has.", ar: "انعدام الحالة هو القيد الأكثر سوء فهم، لأن كلمة stateless لا تعني أن التطبيق بلا حالة. فالسيرفر يحمل حالة الموارد — الطلبات والمستخدمين والأرصدة — وهذا هو الغرض من وجود سيرفر أصلاً. أما ما يجب ألا يحمله فهو حالة التطبيق: أين وصل client معيّن في تفاعل متعدد الخطوات. تلك تنتمي إلى الـ request، أو إلى مورد له URI يستطيع الـ client مخاطبته. فسلة تسوّق على السيرفر مقبولة حين تكون /carts/{id} أي مورداً يستطيع أي أحد جلبه؛ وتخالف القيد حين تكون قاموساً في الذاكرة مفتاحه معرّف جلسة لا يملكه إلا الـ node رقم 3." },
      { t: "callout", kind: "tip", en: "A quick test for the layered-system constraint: could you put a CDN, a gateway or a second identical instance in front of this service tomorrow without telling any client? If not, something is leaking through the layers — usually an absolute URL, an IP address, or in-memory state.", ar: "اختبار سريع لقيد النظام الطبقي: هل تستطيع وضع CDN أو gateway أو نسخة ثانية مطابقة أمام هذه الخدمة غداً دون إخبار أي client؟ إن لم تستطع، فشيء ما يتسرّب عبر الطبقات — وغالباً URL مطلق أو عنوان IP أو حالة في الذاكرة." }
    ]},

    { key: "tradeoffs", blocks: [
      { t: "tradeoff",
        pros: {
          en: [
            "Generic infrastructure — caches, proxies, gateways — works without knowing your domain",
            "Horizontal scaling is trivial when no request depends on which node served the last one",
            "Client and server evolve on independent release schedules",
            "Self-descriptive messages make traffic debuggable and observable by tools you did not write",
            "Layering lets you insert CDNs, canaries and gateways without a client change"
          ],
          ar: [
            "البنية التحتية العامة — caches وproxies وgateways — تعمل دون معرفة بمجالك",
            "التوسّع الأفقي بسيط حين لا يعتمد أي request على أي node خدم السابق",
            "الـ client والسيرفر يتطوّران بجداول إصدار مستقلة",
            "الرسائل ذاتية الوصف تجعل الحركة قابلة للتشخيص والرصد بأدوات لم تكتبها أنت",
            "الطبقية تتيح إدخال CDNs وcanaries وgateways دون تغيير لدى العملاء"
          ]
        },
        cons: {
          en: [
            "Statelessness means re-sending context on every request — auth tokens, filters, pagination cursors",
            "Resource-shaped endpoints cause over-fetching and under-fetching for rich UI screens",
            "Chatty clients: one screen may need four round trips where one RPC call would do",
            "HATEOAS costs payload size and client complexity that most teams never recoup",
            "Not every operation maps cleanly to a resource — 'send reminder', 'recalculate', 'approve'"
          ],
          ar: [
            "انعدام الحالة يعني إعادة إرسال السياق في كل request — رموز المصادقة والفلاتر ومؤشرات التقسيم",
            "الـ endpoints المصمّمة كموارد تسبّب جلباً زائداً أو ناقصاً لشاشات واجهة غنية",
            "عملاء كثيرو الأحاديث: شاشة واحدة قد تحتاج أربع رحلات حيث يكفي استدعاء RPC واحد",
            "الـ HATEOAS يكلّف حجم payload وتعقيد عميل لا تستردّه معظم الفرق أبداً",
            "ليست كل عملية تنعكس بنظافة إلى مورد — «أرسل تذكيراً»، «أعد الحساب»، «اعتمد»"
          ]
        },
        limits: {
          en: [
            "The constraints say nothing about pagination, filtering, partial updates or bulk operations",
            "Only GET and HEAD get real caching benefit; write-heavy systems gain little",
            "Statelessness does not remove state — it relocates it to a token, a database or a cache",
            "Real-time and streaming interactions fall outside the request/response model entirely",
            "HATEOAS only pays off when clients are written to follow links, which almost none are"
          ],
          ar: [
            "القيود لا تقول شيئاً عن التقسيم إلى صفحات ولا الفلترة ولا التحديث الجزئي ولا العمليات المجمّعة",
            "الـ GET و HEAD وحدهما ينالان فائدة caching حقيقية؛ والأنظمة كثيفة الكتابة تكسب القليل",
            "انعدام الحالة لا يزيل الحالة — بل ينقلها إلى token أو قاعدة بيانات أو cache",
            "التفاعلات اللحظية والبثّية تقع خارج نموذج الـ request/response كلياً",
            "الـ HATEOAS لا يُثمر إلا حين يُكتب العملاء ليتبعوا الروابط، وهو ما لا يفعله أحد تقريباً"
          ]
        },
        alts: {
          en: [
            "GraphQL — gives up uniform interface and HTTP caching for precise client-shaped queries",
            "gRPC — a bespoke binary contract; fast and strongly typed, but opaque to generic intermediaries",
            "RPC over HTTP (POST /rpc/CalculateTax) — honest for genuinely procedural operations",
            "Event-driven / message queues — when the interaction is not request/response at all",
            "Backend-for-frontend — a resource API underneath, a screen-shaped aggregation layer on top"
          ],
          ar: [
            "GraphQL — يتنازل عن الواجهة الموحدة وعن الـ HTTP caching مقابل استعلامات مفصّلة على شكل العميل",
            "gRPC — عقد ثنائي مفصّل؛ سريع وقوي التنميط، لكنه معتم أمام الوسطاء العامّين",
            "RPC فوق HTTP (POST /rpc/CalculateTax) — صادق للعمليات الإجرائية فعلاً",
            "المعمارية المدفوعة بالأحداث وطوابير الرسائل — حين لا يكون التفاعل request/response أصلاً",
            "Backend-for-frontend — API موارد في الأسفل وطبقة تجميع على شكل الشاشات في الأعلى"
          ]
        }
      }
    ]},

    { key: "mistakes", blocks: [
      { t: "mistake",
        title: { en: "In-memory session state behind a load balancer", ar: "حالة جلسة في الذاكرة خلف موازن أحمال" },
        body: { en: "A checkout wizard keeps the partially-built order in an in-memory dictionary keyed by session id. It works with one instance. In production behind three nodes, sticky sessions are enabled to make it work — and now a rolling deploy drops every in-progress checkout, autoscaling cannot scale down without losing carts, and one hot node cannot shed load because its clients are pinned to it. The stateless constraint was violated to save a database write of a few hundred bytes.", ar: "معالج دفع يحتفظ بالطلب نصف المكتمل في قاموس داخل الذاكرة مفتاحه معرّف الجلسة. يعمل مع نسخة واحدة. وفي الـ production خلف ثلاثة nodes تُفعَّل الجلسات اللاصقة ليعمل — والآن يُسقط النشر التدريجي كل عملية دفع جارية، ولا يستطيع التقليص التلقائي العمل دون فقدان السلال، ولا يستطيع node مزدحم تفريغ حمله لأن عملاءه مثبّتون عليه. خولف قيد انعدام الحالة لتوفير كتابة بضع مئات من البايتات في قاعدة بيانات." },
        fix: "// make the in-progress state a real resource with a URI\nPOST /carts                 -> 201 Location: /carts/{id}\nPATCH /carts/{id}/items     -> any node can serve it" },
      { t: "mistake",
        title: { en: "Verbs in the URI instead of in the method", ar: "أفعال في الـ URI بدل الـ method" },
        body: { en: "An API exposes POST /api/getOrders, POST /api/updateOrder and POST /api/deleteOrder. Everything works, but nothing generic does: the CDN cannot cache the read because it is a POST, the gateway's retry policy cannot distinguish the safe call from the destructive one, and the access log shows a single URL for every operation so you cannot tell reads from writes in your own metrics.", ar: "API يعرض POST /api/getOrders و POST /api/updateOrder و POST /api/deleteOrder. كل شيء يعمل، لكن لا شيء عام يعمل: فالـ CDN لا يستطيع تخزين القراءة لأنها POST، وسياسة إعادة المحاولة في الـ gateway لا تميّز الاستدعاء الآمن من المدمّر، وسجل الوصول يُظهر URL واحداً لكل عملية فلا تستطيع تمييز القراءات من الكتابات في مقاييسك أنت." },
        fix: "GET    /orders?status=open\nPATCH  /orders/{id}\nDELETE /orders/{id}" },
      { t: "mistake",
        title: { en: "Hardcoded absolute URLs breaking the layered system", ar: "URLs مطلقة في الكود تكسر النظام الطبقي" },
        body: { en: "Responses embed links built from a hardcoded https://api-prod-eu-1.internal base. When the team puts a CDN in front and moves to a regional gateway, every embedded link still points at the old origin — bypassing the cache, bypassing the WAF, and exposing an internal hostname to the public. The layered constraint exists precisely so that inserting a layer requires no client change; a hardcoded host destroys that.", ar: "الاستجابات تضمّن روابط مبنية على أساس ثابت https://api-prod-eu-1.internal في الكود. وحين يضع الفريق CDN في الأمام وينتقل إلى gateway إقليمي، تظل كل الروابط المضمّنة تشير إلى الـ origin القديم — متجاوزة الـ cache والـ WAF، وكاشفة اسم مضيف داخلي للعامة. وقيد الطبقية موجود تحديداً ليكون إدخال طبقة بلا تغيير لدى العملاء؛ والمضيف الثابت يدمّر ذلك." },
        fix: "// build links from a configured public base URL, one place, per environment\nvar link = $\"{_options.PublicBaseUrl}/orders/{order.Id}\";" },
      { t: "mistake",
        title: { en: "A single /api endpoint dispatching on a body field", ar: "endpoint واحد /api يوزّع بناءً على حقل في الـ body" },
        body: { en: "All traffic goes to POST /api with { \"action\": \"...\" } in the body. This is Richardson level 0 and it removes every property the constraints buy: no caching, no meaningful status codes, no per-operation rate limiting at the gateway, no per-endpoint latency metrics, and no way for a proxy to know a request is safe. Six months in, the team is writing a custom dashboard to recover information that a URL path would have given them for free.", ar: "كل الحركة تذهب إلى POST /api مع { \"action\": \"...\" } في الـ body. هذا هو المستوى صفر عند Richardson ويزيل كل خاصية تشتريها القيود: لا caching، ولا status codes ذات معنى، ولا تحديد معدل لكل عملية عند الـ gateway، ولا مقاييس زمن استجابة لكل endpoint، ولا سبيل لأي proxy ليعرف أن request آمن. وبعد ستة أشهر يكتب الفريق لوحة مخصصة لاستعادة معلومات كان مسار الـ URL سيمنحها له مجاناً." } },
      { t: "mistake",
        title: { en: "Treating statelessness as 'no state anywhere'", ar: "فهم انعدام الحالة على أنه «لا حالة في أي مكان»" },
        body: { en: "A team reads the constraint literally and stuffs the entire user profile, permission set and feature flags into a JWT so the server 'holds no state'. The token reaches 6 KB, is sent on every request, blows past the proxy's header limit on some clients, and — worse — cannot be revoked, so a fired employee keeps access until expiry. Statelessness is about not storing per-client application state between requests; it was never an argument for putting a database row in a header.", ar: "فريق يقرأ القيد حرفياً فيحشو ملف المستخدم كاملاً ومجموعة صلاحياته وأعلام الميزات داخل JWT كي «لا يحمل السيرفر حالة». يصل الـ token إلى 6 كيلوبايت، ويُرسل في كل request، ويتجاوز حدّ الـ headers في الـ proxy لدى بعض العملاء، والأسوأ أنه لا يمكن إبطاله، فيحتفظ موظف مفصول بصلاحيته حتى انتهاء المدة. انعدام الحالة يخص عدم تخزين حالة تطبيق خاصة بالعميل بين الـ requests؛ ولم يكن يوماً حجة لوضع صف من قاعدة بيانات في header." },
        fix: "// keep the token small: identity + a few claims + a version stamp\n{ \"sub\": \"u_991\", \"ver\": 7, \"exp\": 1770000000 }\n// resolve permissions server-side from a cache keyed by (sub, ver)" },
      { t: "mistake",
        title: { en: "Adding HATEOAS links nobody follows", ar: "إضافة روابط HATEOAS لا يتبعها أحد" },
        body: { en: "A team adds a _links block to every response to be 'properly RESTful'. Payloads grow by 30%, the serializer gains a layer of link-building code, and every client team continues building URLs from string templates because their code generator ignores links entirely. The constraint delivers its benefit only when clients are written to be link-driven — adding the links without changing the clients is pure cost.", ar: "فريق يضيف كتلة _links إلى كل استجابة ليكون «RESTful بشكل صحيح». تكبر الـ payloads بنسبة 30%، ويكتسب الـ serializer طبقة كود لبناء الروابط، ويستمر كل فريق عميل في بناء الـ URLs من قوالب نصية لأن مولّد الكود لديه يتجاهل الروابط كلياً. هذا القيد لا يعطي فائدته إلا حين يُكتب العملاء ليكونوا مدفوعين بالروابط — وإضافة الروابط دون تغيير العملاء تكلفة خالصة." } }
    ]},

    { key: "interview", blocks: [
      { t: "qa", level: "junior",
        q: { en: "Name the six REST constraints.", ar: "اذكر قيود الـ REST الستة." },
        a: { en: "Client–server, stateless, cacheable, uniform interface, layered system, and code-on-demand — the last one being explicitly optional. The uniform interface is the central one and itself has four parts: resource identification, manipulation through representations, self-descriptive messages, and hypermedia as the engine of application state.", ar: "الفصل بين الـ client والسيرفر، وانعدام الحالة، وقابلية الـ caching، والواجهة الموحدة، والنظام الطبقي، والكود عند الطلب — وهذا الأخير اختياري صراحةً. والواجهة الموحدة هي المركزية ولها أربعة أجزاء: تعريف الموارد، والتعديل عبر التمثيلات، والرسائل ذاتية الوصف، والـ hypermedia كمحرّك لحالة التطبيق." } },
      { t: "qa", level: "junior",
        q: { en: "Does stateless mean the server stores no data?", ar: "هل انعدام الحالة يعني أن السيرفر لا يخزّن بيانات؟" },
        a: { en: "No. The server stores resource state — that is its job. What it must not store is application state: the client's position in a multi-step interaction, held between requests and tied to a specific node. If the context lives in the request or in an addressable resource, the constraint is satisfied no matter how much data is in the database.", ar: "لا. السيرفر يخزّن حالة الموارد — وهذه وظيفته. أما ما يجب ألا يخزّنه فهو حالة التطبيق: موقع الـ client في تفاعل متعدد الخطوات، محفوظاً بين الـ requests ومرتبطاً بـ node بعينه. فإن كان السياق يعيش في الـ request أو في مورد قابل للعنونة، فالقيد محقَّق مهما بلغت البيانات في قاعدة البيانات." } },
      { t: "qa", level: "mid",
        q: { en: "What does the layered system constraint actually buy you, concretely?", ar: "ما الذي يشتريه قيد النظام الطبقي فعلياً وبشكل ملموس؟" },
        a: { en: "The ability to insert or remove infrastructure without coordinating with clients. A CDN, an API gateway, a WAF, a canary router, a regional failover layer — all of them work because a client talks to whatever answers on the hostname and cannot tell how many hops are behind it. The cost is latency per hop and harder end-to-end debugging, which is why trace context propagation matters so much in a layered system.", ar: "القدرة على إدخال بنية تحتية أو إزالتها دون تنسيق مع العملاء. الـ CDN والـ API gateway والـ WAF وموجّه الـ canary وطبقة التحويل الإقليمي — كلها تعمل لأن الـ client يخاطب ما يردّ على اسم المضيف ولا يستطيع معرفة كم قفزة خلفه. والتكلفة زمن استجابة لكل قفزة وتشخيص أصعب من طرف لطرف، ولهذا يهم نشر سياق التتبّع كثيراً في نظام طبقي." } },
      { t: "qa", level: "mid",
        q: { en: "Is an API that returns JSON over HTTP with proper verbs RESTful?", ar: "هل يُعدّ API يرجع JSON فوق HTTP بأفعال صحيحة RESTful؟" },
        a: { en: "By Fielding's definition, no — it is Richardson level 2, missing hypermedia. But that is the wrong frame for a design review. The useful question is which properties you have and which you gave up: with proper methods, status codes and cache headers you get generic caching, safe retries and observable traffic, which is most of the practical value. What you give up without hypermedia is the ability to change your URL structure or state machine without a coordinated client release.", ar: "بتعريف Fielding لا — فهو المستوى الثاني عند Richardson وينقصه الـ hypermedia. لكن هذا إطار خاطئ لمراجعة تصميم. والسؤال المفيد هو أي خصائص لديك وأيها تنازلت عنها: فبالـ methods والـ status codes وheaders الـ caching الصحيحة تحصل على caching عام وإعادة محاولة آمنة وحركة قابلة للرصد، وهذه معظم القيمة العملية. وما تتنازل عنه بلا hypermedia هو القدرة على تغيير بنية الـ URLs أو آلة الحالة دون إصدار منسّق لدى العملاء." } },
      { t: "qa", level: "mid",
        q: { en: "How do you model an operation that is not a resource, like 'send a password reset email'?", ar: "كيف تنمذج عملية ليست مورداً، مثل «أرسل بريد إعادة تعيين كلمة المرور»؟" },
        a: { en: "Two defensible options. Model the action as a resource that gets created: POST /password-reset-requests returning 201 with a Location — now the request itself is a thing with a URI, a status and a history, which is often genuinely useful. Or accept it is a command and expose POST /users/{id}/password-reset, documented as an action endpoint. What I would avoid is contorting it into a PUT on some invented resource just to look RESTful; the constraint that matters is that the method is honest about safety and idempotency, not that every URL is a noun.", ar: "خياران يمكن الدفاع عنهما. نمذج الإجراء كمورد يُنشأ: POST /password-reset-requests يرجع 201 مع Location — فيصبح الطلب نفسه شيئاً له URI وحالة وسجل، وهو مفيد فعلاً في أحيان كثيرة. أو اقبل أنه أمر واعرضه كـ POST /users/{id}/password-reset موثّقاً كـ endpoint إجراء. وما سأتجنبه هو لَيّه إلى PUT على مورد مخترع لمجرد أن يبدو RESTful؛ فالقيد المهم أن تكون الـ method صادقة بشأن الأمان والـ idempotency، لا أن يكون كل URL اسماً." } },
      { t: "qa", level: "senior",
        q: { en: "When would you deliberately violate a REST constraint, and how would you justify it?", ar: "متى تخالف قيداً من قيود الـ REST عن قصد، وكيف تبرّر ذلك؟" },
        a: { en: "Whenever the property the constraint buys is worth less than what it costs in that specific context, and I can name both sides. Concrete examples: for an internal service-to-service path with strict latency budgets, I would use gRPC — giving up the uniform interface and generic cacheability, gaining a compact binary contract and streaming, and accepting that intermediaries become opaque. For a mobile client that would otherwise make six calls per screen, I would add a backend-for-frontend aggregation endpoint that is frankly RPC-shaped, keeping the resource API underneath for everything else. For a report that takes 90 seconds, I would break the synchronous request/response model entirely and return 202 with a status resource. The justification is always the same shape: here is the property I am losing, here is who depended on it, and here is what replaces it.", ar: "كلما كانت الخاصية التي يشتريها القيد أقل قيمة مما يكلّفه في ذلك السياق تحديداً، وأستطيع تسمية الطرفين. أمثلة ملموسة: لمسار داخلي بين الخدمات بميزانيات زمن صارمة سأستخدم gRPC — متنازلاً عن الواجهة الموحدة وقابلية الـ caching العامة، وكاسباً عقداً ثنائياً مضغوطاً وبثّاً، وقابلاً بأن يصبح الوسطاء معتمين. ولعميل موبايل كان سيجري ستة استدعاءات لكل شاشة سأضيف endpoint تجميع من نوع backend-for-frontend بشكل RPC صراحةً، مع إبقاء API الموارد في الأسفل لكل ما عداه. ولتقرير يستغرق 90 ثانية سأكسر نموذج الـ request/response المتزامن كلياً وأرجع 202 مع مورد لمتابعة الحالة. والتبرير دائماً بنفس الشكل: هذه الخاصية التي أخسرها، وهؤلاء من كانوا يعتمدون عليها، وهذا ما يحل محلها." } },
      { t: "qa", level: "senior",
        q: { en: "Why did HATEOAS never take hold in practice, and does that make it wrong?", ar: "لماذا لم يترسّخ الـ HATEOAS عملياً، وهل يجعله ذلك خاطئاً؟" },
        a: { en: "It did not fail technically; it failed economically. HATEOAS pays off when clients are numerous, independently written and not upgradeable on your schedule — which describes the browser and the human operating it, and describes almost nothing else. In a typical company the API has three clients, all written by colleagues, all deployable within a sprint, and all using a generated SDK built from an OpenAPI document. In that world, link-driven navigation adds payload and client complexity to solve a coordination problem that a shared schema and a chat message already solve. It is not wrong; its preconditions are usually absent. Where they are present — public APIs with thousands of third-party integrators, or long-lived clients like embedded devices you cannot update — the calculation flips, and something like link relations or a well-defined state machine in the response earns its keep.", ar: "لم يفشل تقنياً بل اقتصادياً. الـ HATEOAS يُثمر حين يكون العملاء كثيرين ومكتوبين بشكل مستقل وغير قابلين للترقية على جدولك — وهذا يصف المتصفح والإنسان الذي يشغّله، ولا يصف شيئاً آخر تقريباً. وفي شركة نموذجية يكون للـ API ثلاثة عملاء كتبهم زملاء، وكلهم قابل للنشر خلال sprint، وكلهم يستخدم SDK مولَّداً من مستند OpenAPI. وفي ذلك العالم يضيف التنقّل بالروابط حجماً وتعقيداً لحل مشكلة تنسيق يحلها بالفعل schema مشترك ورسالة في المحادثة. وهو ليس خاطئاً؛ لكن شروطه المسبقة غائبة عادةً. وحيث تتوفر — APIs عامة بآلاف المتكاملين، أو عملاء طويلو العمر كأجهزة مدمجة لا تستطيع تحديثها — تنقلب الحسبة، ويستحق شيء مثل علاقات الروابط أو آلة حالة معرّفة في الاستجابة تكلفته." } },
      { t: "qa", level: "staff",
        q: { en: "Twelve teams each interpret 'RESTful' differently and API reviews have become philosophical arguments. What do you do?", ar: "اثنا عشر فريقاً يفسّر كل منهم كلمة «RESTful» بشكل مختلف وتحوّلت مراجعات الـ APIs إلى جدل فلسفي. ماذا تفعل؟" },
        a: { en: "Take the word out of the vocabulary and replace it with properties. I would write an API guideline that never uses 'RESTful' as a criterion and instead states requirements that can be checked: reads use GET and are safe; writes declare their idempotency; error bodies follow one problem-details shape; responses carry explicit cache directives; no absolute internal hostnames in payloads; no per-node state. Then I would make it mechanical — an OpenAPI linter in CI enforcing the checkable subset, and a short design-review template whose first question is 'which constraint does this trade away and what do we lose?' rather than 'is this REST?'. I would also publish two reference services that embody the guideline, because teams copy code far more reliably than they read documents. The goal is not doctrinal purity across twelve teams; it is that a client written against one service works the same way against another, and that disagreements are about trade-offs with named costs rather than about definitions.", ar: "أخرج الكلمة من المفردات وأستبدلها بخصائص. سأكتب دليل APIs لا يستخدم «RESTful» كمعيار إطلاقاً، بل يذكر متطلبات قابلة للفحص: القراءات تستخدم GET وتكون آمنة؛ والكتابات تعلن الـ idempotency لديها؛ وأجسام الأخطاء تتبع شكل problem details واحداً؛ والاستجابات تحمل توجيهات caching صريحة؛ ولا أسماء مضيفين داخلية مطلقة في الـ payloads؛ ولا حالة خاصة بأي node. ثم سأجعله آلياً — linter لـ OpenAPI في الـ CI يفرض الجزء القابل للفحص، وقالب مراجعة تصميم قصير سؤاله الأول «أي قيد يقايضه هذا وماذا نخسر؟» بدل «هل هذا REST؟». وسأنشر أيضاً خدمتين مرجعيتين تجسّدان الدليل، لأن الفرق تنسخ الكود بموثوقية أعلى بكثير مما تقرأ المستندات. والهدف ليس النقاء العقائدي عبر اثني عشر فريقاً؛ بل أن يعمل client كُتب مقابل خدمة بنفس الطريقة مقابل أخرى، وأن يكون الخلاف حول مقايضات بتكاليف مسمّاة لا حول تعريفات." } }
    ]},

    { key: "codereview", blocks: [
      { t: "review", severity: "high",
        title: { en: "Per-node in-memory state on a scaled service", ar: "حالة في الذاكرة لكل node في خدمة موسّعة" },
        bad: "public class WizardController : ControllerBase\n{\n    private static readonly ConcurrentDictionary<string, DraftOrder> _drafts = new();\n\n    [HttpPost(\"wizard/{step:int}\")]\n    public IActionResult Step(int step, StepDto dto)\n    {\n        var draft = _drafts.GetOrAdd(HttpContext.Session.Id, _ => new DraftOrder());\n        draft.Apply(step, dto);\n        return Ok();\n    }\n}",
        good: "[HttpPatch(\"drafts/{id:guid}\")]\npublic async Task<IActionResult> Patch(Guid id, StepDto dto, CancellationToken ct)\n{\n    var draft = await _drafts.GetAsync(id, User.GetId(), ct);\n    if (draft is null) return NotFound();\n\n    draft.Apply(dto);\n    await _drafts.SaveAsync(draft, ct);      // shared store: any node can serve the next call\n    return Ok(draft);\n}",
        why: { en: "The static dictionary makes correctness depend on which node received the request, so the service only works with sticky sessions — and then a rolling deploy discards every in-progress wizard, scale-in drops user work, and a hot node cannot shed load. It is also an unbounded memory leak, since nothing evicts abandoned drafts. Promoting the draft to an addressable resource in a shared store restores statelessness and gives you a URI the client can resume from on any device.", ar: "القاموس الساكن يجعل الصحة تعتمد على أي node استقبل الـ request، فلا تعمل الخدمة إلا بجلسات لاصقة — ثم يهدر النشر التدريجي كل معالج جارٍ، ويُسقط التقليص عمل المستخدمين، ولا يستطيع node مزدحم تفريغ حمله. وهو أيضاً تسريب ذاكرة بلا حد، إذ لا شيء يُخلي المسودات المهجورة. وترقية المسودة إلى مورد قابل للعنونة في مخزن مشترك تعيد انعدام الحالة وتمنحك URI يستطيع الـ client استئنافه من أي جهاز." }
      },
      { t: "review", severity: "medium",
        title: { en: "Internal hostnames leaking into response payloads", ar: "تسرّب أسماء مضيفين داخلية إلى أجسام الاستجابات" },
        bad: "return Ok(new OrderDto\n{\n    Id       = order.Id,\n    Invoice  = $\"http://orders-svc.prod-eu-1.internal:8080/invoices/{order.InvoiceId}\",\n    Customer = $\"http://users-svc.prod-eu-1.internal:8080/users/{order.CustomerId}\"\n});",
        good: "// Options bound per environment; one place builds public links.\nreturn Ok(new OrderDto\n{\n    Id       = order.Id,\n    Invoice  = _links.To($\"/invoices/{order.InvoiceId}\"),\n    Customer = _links.To($\"/users/{order.CustomerId}\")\n});\n\npublic sealed class LinkBuilder(IOptions<ApiOptions> o)\n{\n    public string To(string path) => $\"{o.Value.PublicBaseUrl.TrimEnd('/')}{path}\";\n}",
        why: { en: "Embedding the internal origin breaks the layered-system constraint: a client following these links bypasses the CDN, the gateway and the WAF, and any attempt to insert a new layer requires every client to change at once. It also discloses internal topology — hostnames, regions and ports — to anyone who can read a response, which is free reconnaissance. Building links from a single configured public base keeps the layers substitutable and keeps the internal names internal.", ar: "تضمين الـ origin الداخلي يكسر قيد النظام الطبقي: فالـ client الذي يتبع هذه الروابط يتجاوز الـ CDN والـ gateway والـ WAF، وأي محاولة لإدخال طبقة جديدة تتطلب تغيير كل العملاء دفعة واحدة. كما يكشف البنية الداخلية — أسماء المضيفين والمناطق والمنافذ — لكل من يستطيع قراءة استجابة، وهو استطلاع مجاني. وبناء الروابط من أساس عام مضبوط في مكان واحد يبقي الطبقات قابلة للاستبدال ويبقي الأسماء الداخلية داخلية." }
      }
    ]},

    { key: "sysdesign", blocks: [
      { t: "p", en: "In a system design discussion, the constraints are most useful as a diagnostic rather than a target. When someone proposes sticky sessions, the constraint tells you exactly what you are giving up: seamless deploys, autoscaling and load shedding. When someone proposes tunnelling everything through POST, it tells you that you have just made your CDN, your gateway retry policy and your per-endpoint metrics useless. The value is that the cost is predictable in advance instead of discovered in an incident.", ar: "في نقاش تصميم الأنظمة، تكون القيود أنفع كأداة تشخيص لا كهدف. فحين يقترح أحدهم جلسات لاصقة، يخبرك القيد بالضبط بما تتنازل عنه: النشر السلس والتوسّع التلقائي وتفريغ الحمل. وحين يقترح أحدهم تمرير كل شيء عبر POST، يخبرك أنك جعلت الـ CDN وسياسة إعادة المحاولة في الـ gateway ومقاييسك لكل endpoint بلا فائدة. والقيمة أن التكلفة تصبح متوقعة مسبقاً بدل اكتشافها أثناء حادثة." },
      { t: "p", en: "The pattern that scales in most organisations is a resource-shaped API underneath and screen-shaped aggregation on top. The lower layer keeps the constraints and therefore keeps the infrastructure benefits; the upper layer is allowed to be pragmatic — batching, aggregating, occasionally RPC-shaped — because it is owned by the same team as the client and has no third-party consumers. Mixing the two concerns in a single API is what produces endpoints that are neither cacheable nor convenient.", ar: "والنمط الذي يتوسّع في معظم المؤسسات هو API على شكل موارد في الأسفل وتجميع على شكل الشاشات في الأعلى. فالطبقة السفلى تحافظ على القيود وبالتالي على فوائد البنية التحتية؛ والطبقة العليا يُسمح لها بالبراغماتية — تجميع ودفعات وأحياناً شكل RPC — لأن مالكها هو نفسه فريق الـ client وليس لها مستهلكون خارجيون. وخلط الاهتمامين في API واحد هو ما ينتج endpoints ليست قابلة للتخزين ولا مريحة." },
      { t: "ul",
        en: [
          "Statelessness is the precondition for autoscaling, rolling deploys and load shedding — decide it before you decide instance counts",
          "Cacheability determines whether origin capacity scales with total traffic or only with writes and misses",
          "Uniform interface is what lets a gateway apply retry, rate-limit and auth policy without knowing the domain",
          "Layering is what lets you add a CDN, a canary router or a regional failover without a client release",
          "Where you break a constraint, write down which property you gave up and what replaces it — that note is the design doc"
        ],
        ar: [
          "انعدام الحالة شرط مسبق للتوسّع التلقائي والنشر التدريجي وتفريغ الحمل — احسمه قبل أن تحسم عدد النسخ",
          "قابلية الـ caching تحدد هل تتوسّع سعة الـ origin مع الحركة الكلية أم مع الكتابات والإخفاقات فقط",
          "الواجهة الموحدة هي ما يتيح للـ gateway تطبيق سياسات إعادة المحاولة وتحديد المعدل والمصادقة دون معرفة المجال",
          "الطبقية هي ما يتيح إضافة CDN أو موجّه canary أو تحويل إقليمي دون إصدار لدى العملاء",
          "حيثما كسرت قيداً، دوّن أي خاصية تنازلت عنها وما الذي يحل محلها — تلك الملاحظة هي مستند التصميم"
        ]
      },
      { t: "callout", kind: "tip", en: "A single question surfaces most violations in a design review: \"if the next request from this client lands on a different instance, does anything break?\" If yes, you are not stateless, and everything downstream of that — scaling, deploys, failover — is now harder than it needs to be.", ar: "سؤال واحد يكشف معظم المخالفات في مراجعة التصميم: «إن هبط الـ request التالي من هذا الـ client على نسخة مختلفة، هل ينكسر شيء؟» إن كانت الإجابة نعم فأنت لست stateless، وكل ما بعد ذلك — التوسّع والنشر والتحويل عند الفشل — أصبح أصعب مما يلزم." }
    ]},

    { key: "perf", blocks: [
      { t: "kv", rows: [
        { k: { en: "Scalability", ar: "قابلية التوسّع" }, v: { en: "Statelessness makes capacity linear in instance count; sticky sessions cap effective utilisation because a hot node cannot shed its pinned clients", ar: "انعدام الحالة يجعل السعة خطية مع عدد النسخ؛ والجلسات اللاصقة تحدّ الاستغلال الفعلي لأن node مزدحم لا يستطيع تفريغ عملائه المثبّتين" } },
        { k: { en: "Network", ar: "الشبكة" }, v: { en: "Statelessness re-sends context on every request — a 1 KB token on 10k req/s is 10 MB/s of pure repetition; hypermedia links add 20–40% to payload size", ar: "انعدام الحالة يعيد إرسال السياق في كل request — token بحجم كيلوبايت عند 10 آلاف request/ثانية يعني 10 ميغابايت/ثانية تكراراً خالصاً؛ وروابط الـ hypermedia تضيف 20–40% إلى حجم الـ payload" } },
        { k: { en: "Latency", ar: "زمن الاستجابة" }, v: { en: "Each layer adds a hop of 1–5 ms internally, more across regions; resource-shaped APIs can turn one screen into 3–6 sequential round trips", ar: "كل طبقة تضيف قفزة بـ 1–5 ملّي ثانية داخلياً وأكثر عبر المناطق؛ وAPIs الموارد قد تحوّل شاشة واحدة إلى 3–6 رحلات متتابعة" } },
        { k: { en: "CPU", ar: "المعالج" }, v: { en: "Re-validating a token and re-resolving permissions on every request is the recurring cost of statelessness — cache the resolution, not the decision", ar: "إعادة التحقق من الـ token وإعادة استنتاج الصلاحيات في كل request هي التكلفة المتكررة لانعدام الحالة — خزّن نتيجة الاستنتاج لا القرار" } },
        { k: { en: "Database", ar: "قاعدة البيانات" }, v: { en: "Cacheable reads at the edge remove the majority of query load; a mutating GET forces no-store and puts all of it back", ar: "القراءات القابلة للتخزين على الحافة تزيل معظم حمل الاستعلامات؛ وGET يغيّر الحالة يفرض no-store ويعيده كاملاً" } },
        { k: { en: "Memory", ar: "الذاكرة" }, v: { en: "Per-node session dictionaries grow unbounded without eviction and are lost on restart — the classic hidden cost of violating statelessness", ar: "قواميس الجلسات لكل node تنمو بلا حدّ دون إخلاء وتضيع عند إعادة التشغيل — وهي التكلفة الخفية الكلاسيكية لمخالفة انعدام الحالة" } }
      ]}
    ]},

    { key: "debug", blocks: [
      { t: "ul",
        en: [
          "Send the same sequence of requests twice while forcing different backends (curl --resolve, or scale to two instances) — if behaviour differs, you have per-node state",
          "Restart one instance mid-flow and see what breaks; anything that logs a user out or loses a draft is a statelessness violation",
          "grep the codebase for 'static readonly ConcurrentDictionary' and 'HttpContext.Session' to find application state hiding in memory",
          "grep response payloads for 'internal', ':8080' or a region name to find absolute internal URLs breaking the layering",
          "Check access logs for POST requests whose path contains get, list, fetch or search — a fast signal of verbs migrated into URIs",
          "Diff the header set produced by the origin against what the client receives, to confirm no layer is stripping cache directives or trace context"
        ],
        ar: [
          "أرسل نفس تسلسل الـ requests مرتين مع إجبار backends مختلفة (curl --resolve أو التوسّع إلى نسختين) — فإن اختلف السلوك فلديك حالة خاصة بكل node",
          "أعد تشغيل نسخة واحدة في منتصف التدفق وانظر ما ينكسر؛ فأي شيء يُخرج مستخدماً أو يفقد مسودة هو مخالفة لانعدام الحالة",
          "ابحث في الكود عن 'static readonly ConcurrentDictionary' و'HttpContext.Session' لتجد حالة تطبيق مختبئة في الذاكرة",
          "ابحث في أجسام الاستجابات عن 'internal' أو ':8080' أو اسم منطقة لتجد URLs داخلية مطلقة تكسر الطبقية",
          "افحص سجلات الوصول عن requests من نوع POST تحتوي مساراتها على get أو list أو fetch أو search — إشارة سريعة لأفعال هاجرت إلى الـ URIs",
          "قارن مجموعة الـ headers التي ينتجها الـ origin بما يستقبله الـ client، للتأكد أن لا طبقة تحذف توجيهات الـ caching أو سياق التتبّع"
        ]
      },
      { t: "callout", kind: "tip", en: "The fastest way to find statefulness is to run two instances locally behind a round-robin proxy and use the app normally for five minutes. Anything that depends on a node will fail within a few clicks, and it will fail in a way that is obvious rather than intermittent.", ar: "أسرع طريقة لاكتشاف الاعتماد على الحالة هي تشغيل نسختين محلياً خلف proxy يوزّع بالتناوب واستخدام التطبيق بشكل عادي خمس دقائق. فأي شيء يعتمد على node سيفشل خلال بضع نقرات، وسيفشل بطريقة واضحة لا متقطعة." }
    ]},

    { key: "realworld", blocks: [
      { t: "p", en: "The constraints show up most visibly in the gap between what an organisation says its APIs are and what its infrastructure can actually do with them. Teams that hold the line on statelessness and cacheable reads get elastic capacity and boring deploys almost for free; teams that do not end up building bespoke replacements for infrastructure that would otherwise have come for nothing.", ar: "تظهر القيود بأوضح صورها في الفجوة بين ما تقوله مؤسسة عن APIs لديها وما تستطيع بنيتها التحتية فعله بها. فالفرق التي تتمسك بانعدام الحالة وبقراءات قابلة للتخزين تحصل على سعة مرنة ونشر مملّ شبه مجاناً؛ والفرق التي لا تفعل تنتهي ببناء بدائل مفصّلة لبنية تحتية كانت ستأتيها بلا مقابل." },
      { t: "ul",
        en: [
          "Public developer platforms: the uniform interface is the product — thousands of integrators must be able to guess correctly from documentation alone",
          "Content and media delivery: cacheable, stateless reads are what make edge delivery economically possible at all",
          "Payment and banking integrations: self-descriptive messages and honest method semantics are what let a partner's retry logic be safe",
          "Long-lived embedded and IoT clients: the one setting where hypermedia genuinely pays, because you cannot ship a client update to reflect a changed workflow"
        ],
        ar: [
          "منصات المطوّرين العامة: الواجهة الموحدة هي المنتج — فآلاف المتكاملين يجب أن يستطيعوا التخمين الصحيح من التوثيق وحده",
          "توصيل المحتوى والوسائط: القراءات عديمة الحالة والقابلة للتخزين هي ما يجعل التوصيل من الحافة ممكناً اقتصادياً أصلاً",
          "تكاملات الدفع والبنوك: الرسائل ذاتية الوصف ودلالات الـ methods الصادقة هي ما يجعل منطق إعادة المحاولة لدى الشريك آمناً",
          "العملاء المدمجون وأجهزة إنترنت الأشياء طويلة العمر: الموضع الوحيد الذي يُثمر فيه الـ hypermedia فعلاً، لأنك لا تستطيع شحن تحديث للعميل ليعكس تدفقاً تغيّر"
        ]
      }
    ]},

    { key: "exercises", blocks: [
      { t: "ex", diff: "easy", en: "Take a service you work on and score it against Richardson's maturity model, with one line of evidence per level. Then list the three constraints it violates and, for each, name the specific capability you are losing.", ar: "خذ خدمة تعمل عليها وقيّمها وفق نموذج نضج Richardson مع سطر دليل واحد لكل مستوى. ثم اسرد القيود الثلاثة التي تخالفها، وسمِّ لكل منها القدرة المحددة التي تخسرها." },
      { t: "ex", diff: "medium", en: "Find one piece of per-node state in a codebase (a static dictionary, an in-memory session, a local file) and refactor it into an addressable resource backed by shared storage. Prove it with a test that runs the flow across two instances behind a round-robin proxy.", ar: "اعثر على قطعة حالة خاصة بـ node في قاعدة كود (قاموس ساكن، جلسة في الذاكرة، ملف محلي) وأعد هيكلتها إلى مورد قابل للعنونة مدعوم بتخزين مشترك. وأثبت ذلك باختبار يشغّل التدفق عبر نسختين خلف proxy يوزّع بالتناوب." },
      { t: "ex", diff: "hard", en: "Add hypermedia controls to one resource so that the legal transitions are computed server-side from the entity's state, then write a client that performs a full workflow using only the links — no hardcoded URL templates. Report honestly what it cost and what it bought.", ar: "أضف ضوابط hypermedia إلى مورد واحد بحيث تُحسب الانتقالات المشروعة على السيرفر من حالة الكيان، ثم اكتب client ينفّذ تدفقاً كاملاً بالروابط وحدها — بلا قوالب URL مكتوبة في الكود. وأبلغ بصدق عما كلّفه وما اشتراه." },
      { t: "ex", diff: "senior", en: "Write your organisation's API guideline without using the word 'RESTful' anywhere. State every rule as a checkable property with the capability it protects, mark which are enforced by the linter versus by review, and get one team to adopt it on a real service.", ar: "اكتب دليل الـ APIs لمؤسستك دون استخدام كلمة «RESTful» في أي موضع. اذكر كل قاعدة كخاصية قابلة للفحص مع القدرة التي تحميها، وحدّد أيها يفرضه الـ linter وأيها يفرضه المراجع، واجعل فريقاً واحداً يتبنّاه على خدمة حقيقية." }
    ]},

    { key: "refs", blocks: [
      { t: "ref", label: { en: "Fielding — Architectural Styles, Chapter 5 (REST)", ar: "Fielding — الأنماط المعمارية، الفصل الخامس (REST)" }, url: "https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm", meta: { en: "Dissertation", ar: "أطروحة" } },
      { t: "ref", label: { en: "Fielding — REST APIs must be hypertext-driven", ar: "Fielding — يجب أن تكون APIs الـ REST مدفوعة بالنص التشعبي" }, url: "https://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven", meta: { en: "Article", ar: "مقال" } },
      { t: "ref", label: { en: "Martin Fowler — Richardson Maturity Model", ar: "Martin Fowler — نموذج نضج Richardson" }, url: "https://martinfowler.com/articles/richardsonMaturityModel.html", meta: { en: "Article", ar: "مقال" } },
      { t: "ref", label: { en: "RFC 9110 — HTTP Semantics", ar: "RFC 9110 — دلالات الـ HTTP" }, url: "https://www.rfc-editor.org/rfc/rfc9110.html", meta: { en: "Spec", ar: "مواصفة" } },
      { t: "ref", label: { en: "RFC 8288 — Web Linking", ar: "RFC 8288 — الربط على الويب" }, url: "https://www.rfc-editor.org/rfc/rfc8288.html", meta: { en: "Spec", ar: "مواصفة" } },
      { t: "ref", label: { en: "Microsoft — Web API design best practices", ar: "Microsoft — أفضل ممارسات تصميم Web API" }, url: "https://learn.microsoft.com/azure/architecture/best-practices/api-design", meta: { en: "Docs", ar: "توثيق" } }
    ]}
  ],

  quiz: [
    {
      q: { en: "Which REST constraint is explicitly optional?", ar: "أي قيد من قيود الـ REST اختياري صراحةً؟" },
      options: [
        { en: "Layered system", ar: "النظام الطبقي" },
        { en: "Cacheable", ar: "قابلية الـ caching" },
        { en: "Code-on-demand", ar: "الكود عند الطلب" },
        { en: "Uniform interface", ar: "الواجهة الموحدة" }
      ],
      correct: 2,
      why: { en: "Fielding marks code-on-demand — the server shipping executable code such as JavaScript to extend the client — as the only optional constraint, because it improves client extensibility at the cost of visibility. The other five are required for a system to be considered RESTful.", ar: "يصنّف Fielding الـ code-on-demand — إرسال السيرفر كوداً قابلاً للتنفيذ مثل JavaScript لتوسيع الـ client — بوصفه القيد الاختياري الوحيد، لأنه يحسّن قابلية توسيع العميل على حساب الوضوح. والخمسة الأخرى إلزامية ليُعدّ النظام RESTful." }
    },
    {
      q: { en: "A service keeps a checkout draft in a static ConcurrentDictionary keyed by session id. Which constraint is violated and what is the concrete consequence?", ar: "خدمة تحتفظ بمسودة دفع في ConcurrentDictionary ساكن مفتاحه معرّف الجلسة. أي قيد يُخالَف وما النتيجة الملموسة؟" },
      options: [
        { en: "Cacheable — the draft cannot be cached at the edge", ar: "قابلية الـ caching — لا يمكن تخزين المسودة على الحافة" },
        { en: "Stateless — a rolling deploy or scale-in destroys in-progress work and forces sticky sessions", ar: "انعدام الحالة — النشر التدريجي أو التقليص يدمّر العمل الجاري ويفرض جلسات لاصقة" },
        { en: "Client–server — the UI and the server are now coupled", ar: "الفصل بين الـ client والسيرفر — أصبحت الواجهة والسيرفر مترابطين" },
        { en: "Uniform interface — the endpoint no longer has a resource URI", ar: "الواجهة الموحدة — لم يعد للـ endpoint مورد بـ URI" }
      ],
      correct: 1,
      why: { en: "Application state is being held on a specific node between requests, which is exactly what statelessness forbids. The practical fallout is that correctness now depends on request routing: you need sticky sessions, deploys become disruptive, autoscaling cannot scale in, and a hot node cannot shed load.", ar: "حالة التطبيق محفوظة على node بعينه بين الـ requests، وهذا بالضبط ما يمنعه انعدام الحالة. والأثر العملي أن الصحة صارت تعتمد على توجيه الـ requests: تحتاج جلسات لاصقة، ويصبح النشر معطّلاً، ولا يستطيع التوسّع التلقائي التقليص، ولا يستطيع node مزدحم تفريغ حمله." }
    },
    {
      q: { en: "Which of these best describes what the uniform interface constraint buys a system?", ar: "أي مما يلي يصف أفضل وصف ما يشتريه قيد الواجهة الموحدة للنظام؟" },
      options: [
        { en: "Smaller payloads, because representations are standardised", ar: "أجسام أصغر، لأن التمثيلات موحّدة" },
        { en: "Faster serialization, because the format is fixed", ar: "تسلسل أسرع، لأن الصيغة ثابتة" },
        { en: "Generic intermediaries can cache, retry and route without domain knowledge", ar: "وسطاء عامّون يستطيعون الـ caching وإعادة المحاولة والتوجيه دون معرفة بالمجال" },
        { en: "Type safety between client and server", ar: "أمان الأنواع بين الـ client والسيرفر" }
      ],
      correct: 2,
      why: { en: "The uniform interface deliberately trades efficiency for generality: because every participant uses the same methods, status codes and self-descriptive messages, a cache or gateway can act correctly on traffic for an application it has never seen. Fielding is explicit that it degrades efficiency relative to a bespoke protocol — options 1 and 2 have it backwards.", ar: "الواجهة الموحدة تقايض الكفاءة بالعمومية عن قصد: فلأن كل مشارك يستخدم نفس الـ methods والـ status codes والرسائل ذاتية الوصف، يستطيع cache أو gateway التصرف بشكل صحيح مع حركة تطبيق لم يره من قبل. ويصرّح Fielding بأن ذلك يقلّل الكفاءة مقارنةً ببروتوكول مفصّل — فالخياران الأول والثاني معكوسان." }
    },
    {
      q: { en: "An API returns JSON, uses GET/POST/PUT/DELETE correctly and sets proper status codes, but has no links in its responses. What is it?", ar: "API يرجع JSON ويستخدم GET/POST/PUT/DELETE بشكل صحيح ويضبط status codes سليمة، لكن بلا روابط في استجاباته. ما تصنيفه؟" },
      options: [
        { en: "Fully RESTful — hypermedia is optional", ar: "RESTful بالكامل — فالـ hypermedia اختياري" },
        { en: "Richardson level 2; it lacks the hypermedia sub-constraint of the uniform interface", ar: "المستوى الثاني عند Richardson؛ ينقصه القيد الفرعي للـ hypermedia ضمن الواجهة الموحدة" },
        { en: "Richardson level 0, because it uses JSON rather than XML", ar: "المستوى صفر عند Richardson، لأنه يستخدم JSON بدل XML" },
        { en: "Not an HTTP API at all", ar: "ليس API يعمل على HTTP أصلاً" }
      ],
      correct: 1,
      why: { en: "This describes the overwhelming majority of production APIs: level 2, with resources, correct verbs and status codes, but no hypermedia controls. Hypermedia is not the optional constraint — code-on-demand is — so by Fielding's definition this is not REST, though it still captures most of the practical benefit.", ar: "هذا يصف الغالبية الساحقة من APIs الـ production: المستوى الثاني، بموارد وأفعال وstatus codes صحيحة، لكن بلا ضوابط hypermedia. والـ hypermedia ليس القيد الاختياري — فالـ code-on-demand هو الاختياري — فبتعريف Fielding هذا ليس REST، وإن كان يلتقط معظم الفائدة العملية." }
    },
    {
      q: { en: "Responses embed links like http://orders-svc.prod-eu-1.internal:8080/invoices/9. Which constraint does this break, and why does it matter?", ar: "الاستجابات تضمّن روابط مثل http://orders-svc.prod-eu-1.internal:8080/invoices/9. أي قيد يكسره ذلك ولماذا يهم؟" },
      options: [
        { en: "Cacheable — internal URLs cannot carry cache headers", ar: "قابلية الـ caching — الـ URLs الداخلية لا تحمل headers للـ caching" },
        { en: "Stateless — the hostname is a form of session state", ar: "انعدام الحالة — اسم المضيف شكل من حالة الجلسة" },
        { en: "Layered system — clients bypass the CDN and gateway, and no layer can be inserted without changing every client", ar: "النظام الطبقي — العملاء يتجاوزون الـ CDN والـ gateway، ولا يمكن إدخال طبقة دون تغيير كل عميل" },
        { en: "Client–server — the client now stores server data", ar: "الفصل بين الـ client والسيرفر — أصبح الـ client يخزّن بيانات السيرفر" }
      ],
      correct: 2,
      why: { en: "The layered system constraint says a component should not see beyond its immediate layer. Hardcoding the origin means a client following the link skips the CDN, gateway and WAF, and any future layer requires a coordinated client change. It also leaks internal topology — hostnames, regions and ports — to anyone reading a response.", ar: "قيد النظام الطبقي يقول إن المكوّن لا يجب أن يرى أبعد من طبقته المباشرة. وتثبيت الـ origin يعني أن الـ client الذي يتبع الرابط يتخطى الـ CDN والـ gateway والـ WAF، وأن أي طبقة مستقبلية تتطلب تغييراً منسّقاً لدى العملاء. كما يسرّب البنية الداخلية — أسماء المضيفين والمناطق والمنافذ — لكل من يقرأ استجابة." }
    }
  ]
};
```

NEXT: api-versioning
