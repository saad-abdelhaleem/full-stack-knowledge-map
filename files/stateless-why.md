```js
const statelessWhyLesson = {
  id: "stateless-why",
  moduleId: "foundations",
  title: { en: "Why stateless scales", ar: "لماذا يتوسّع الـ stateless" },
  summary: { en: "A stateless server keeps nothing about you between requests, which is what lets you add or remove servers without breaking anyone.", ar: "الـ server الـ stateless لا يحتفظ بأي شيء عنك بين request وآخر، وهذا ما يسمح بإضافة أو إزالة servers دون أن ينكسر أي مستخدم." },
  mins: 12,
  sections: [
    {
      key: "why",
      blocks: [
        { t: "p",
          en: "A server is stateless when it forgets you the moment it finishes answering. Everything it needed to answer came with the request, or came from a shared store like a database. Nothing important is left sitting in that one server's memory. This matters because it means any server can answer any request, so you can run ten copies of your app and it behaves like one.",
          ar: "الـ server يكون stateless عندما ينسى المستخدم لحظة انتهائه من الرد. كل ما احتاجه للرد جاء مع الـ request نفسه، أو جاء من مخزن مشترك مثل database. لا شيء مهم يبقى في ذاكرة ذلك الـ server وحده. وهذا مهم لأنه يعني أن أي server يستطيع الرد على أي request، فتشغّل عشر نسخ من التطبيق وتتصرف كأنها نسخة واحدة." },
        { t: "kv", rows: [
          { k: { en: "State", ar: "State" },
            v: { en: "Any data the server remembers about a user between two requests — a cart, a login, a wizard step.", ar: "أي بيانات يتذكرها الـ server عن المستخدم بين request وآخر — سلة شراء، تسجيل دخول، خطوة في wizard." } },
          { k: { en: "Stateless", ar: "Stateless" },
            v: { en: "The server stores none of that in its own memory. It reads what it needs per request and forgets after.", ar: "الـ server لا يخزّن أياً من ذلك في ذاكرته. يقرأ ما يحتاجه لكل request ثم ينسى." } },
          { k: { en: "Instance", ar: "Instance" },
            v: { en: "One running copy of your application — one process, usually on one machine or in one container.", ar: "نسخة واحدة تعمل من تطبيقك — process واحد، عادةً على جهاز واحد أو داخل container واحد." } },
          { k: { en: "Load balancer", ar: "Load balancer" },
            v: { en: "A component in front of your instances that picks which one receives each incoming request.", ar: "مكوّن يقف أمام الـ instances ويختار أيها يستقبل كل request قادم." } },
          { k: { en: "Horizontal scaling", ar: "Horizontal scaling" },
            v: { en: "Handling more traffic by adding more instances, instead of making one machine bigger.", ar: "استيعاب حمل أكبر بإضافة instances أكثر، بدل تكبير جهاز واحد." } },
          { k: { en: "Sticky session", ar: "Sticky session" },
            v: { en: "A load balancer rule that keeps sending the same user back to the same instance.", ar: "قاعدة في الـ load balancer تُبقي المستخدم نفسه يذهب دائماً إلى نفس الـ instance." } }
        ]},
        { t: "p",
          en: "The rule came from a practical accident. Early web apps stored the shopping cart in a dictionary in memory, keyed by a session id. That works perfectly while there is one server. The day traffic grows and you start a second copy, half of each user's requests land on a machine that never saw their cart. The app was correct; it just quietly depended on there being exactly one of it.",
          ar: "القاعدة جاءت من حادث عملي. تطبيقات الويب الأولى كانت تخزّن سلة الشراء في dictionary في الذاكرة، مفهرسة بـ session id. هذا يعمل تماماً ما دام هناك server واحد. وفي اليوم الذي يزيد فيه الحمل وتشغّل نسخة ثانية، يذهب نصف requests كل مستخدم إلى جهاز لم يرَ سلته أبداً. التطبيق كان صحيحاً، لكنه كان يعتمد بصمت على وجود نسخة واحدة منه فقط." },
        { t: "p",
          en: "Think of a coffee shop. A stateful barista remembers your usual order, so you must always come back to that same person — if they are on break, you are stuck waiting. A stateless shop writes your order on the cup: any barista can take the cup and finish it. The cup is the request carrying everything needed. Adding a second barista helps immediately, because no knowledge is trapped in one person's head.",
          ar: "تخيّل مقهى. الـ barista الـ stateful يحفظ طلبك المعتاد، فيجب أن تعود دائماً إلى نفس الشخص — وإن كان في استراحة تبقى تنتظر. أما المقهى الـ stateless فيكتب طلبك على الكوب: أي barista يستطيع أخذ الكوب وإكماله. الكوب هنا هو الـ request الذي يحمل كل ما يلزم. وإضافة barista ثانٍ تنفع فوراً، لأن لا معرفة محبوسة في رأس شخص واحد." },
        { t: "callout", kind: "note",
          en: "Stateless does not mean your system has no state. The state moves out of the instance and into a place all instances share — a database, Redis, or the request itself. Someone still stores it; it is just no longer one server's private memory.",
          ar: "Stateless لا يعني أن نظامك بلا state. الـ state ينتقل من داخل الـ instance إلى مكان مشترك بين كل الـ instances — database أو Redis أو الـ request نفسه. أحدهم ما زال يخزّنه، لكنه لم يعد ذاكرة خاصة بـ server واحد." }
      ]
    },
    {
      key: "problem",
      blocks: [
        { t: "p",
          en: "Here is the concrete case used through this lesson. A shop API has two endpoints: POST /cart/items adds a product, GET /cart returns the cart. The first version keeps carts in a static dictionary inside the process. With one instance, every test passes and production is fine for a year.",
          ar: "هذه هي الحالة الملموسة المستخدمة في الدرس كله. API لمتجر فيه endpoint اثنان: POST /cart/items يضيف منتجاً، و GET /cart يعيد السلة. النسخة الأولى تحتفظ بالسلات في static dictionary داخل الـ process. مع instance واحد تنجح كل الاختبارات ويعمل الإنتاج سنة كاملة." },
        { t: "code", lang: "csharp",
          label: { en: "The version that only works when there is exactly one instance", ar: "النسخة التي تعمل فقط عندما يوجد instance واحد" },
          code: "// carts live in this process's memory only\nstatic readonly ConcurrentDictionary<string, Cart> Carts = new();\n\napp.MapPost(\"/cart/items\", (string sessionId, Item item) =>\n{\n    var cart = Carts.GetOrAdd(sessionId, _ => new Cart());\n    cart.Items.Add(item);\n    return Results.Ok(cart);\n});\n\napp.MapGet(\"/cart\", (string sessionId) =>\n    Carts.TryGetValue(sessionId, out var cart)\n        ? Results.Ok(cart)\n        : Results.Ok(new Cart()));   // silently returns an empty cart" },
        { t: "p",
          en: "Black Friday arrives and one instance becomes three behind a load balancer that spreads requests evenly. Now each request has about a one in three chance of reaching the instance holding that cart. Support tickets say \"my cart keeps emptying\". Nothing throws, nothing logs an error: GET /cart on the wrong instance returns an empty cart with status 200, which looks like a successful answer.",
          ar: "يأتي موسم الذروة فيصبح الـ instance الواحد ثلاثة خلف load balancer يوزّع الـ requests بالتساوي. الآن لكل request احتمال واحد من ثلاثة تقريباً أن يصل إلى الـ instance الذي يحمل تلك السلة. تصل شكاوى «سلتي تفرغ باستمرار». لا استثناء يُرمى ولا خطأ يُسجّل: فـ GET /cart على الـ instance الخطأ يعيد سلة فارغة بحالة 200، وهو ما يبدو كرد ناجح." },
        { t: "kv", rows: [
          { k: { en: "One instance", ar: "instance واحد" },
            v: { en: "Cart found on 100% of reads. Peak capacity is whatever that single machine can do — about 800 requests per second here.", ar: "السلة تُوجد في 100% من القراءات. والسعة القصوى هي ما يقدر عليه ذلك الجهاز وحده — حوالي 800 request في الثانية هنا." } },
          { k: { en: "Three instances, in-memory carts", ar: "ثلاثة instances، سلات في الذاكرة" },
            v: { en: "Cart found on roughly 33% of reads — two out of three reads look empty to the user. Capacity tripled, correctness broke.", ar: "السلة تُوجد في حوالي 33% من القراءات — قراءتان من كل ثلاث تبدوان فارغتين للمستخدم. السعة تضاعفت ثلاث مرات لكن الصحة انكسرت." } },
          { k: { en: "Three instances, carts in Redis", ar: "ثلاثة instances، السلات في Redis" },
            v: { en: "Cart found on 100% of reads, and capacity is about 2,400 requests per second. One extra network hop of roughly 1 ms per read.", ar: "السلة تُوجد في 100% من القراءات، والسعة حوالي 2,400 request في الثانية. مقابل قفزة شبكة إضافية بحدود 1 ms لكل قراءة." } }
        ]},
        { t: "p",
          en: "The fix is one line of thinking: move the cart out of the process into a store that all three instances can read. Redis here is an in-memory key/value database that runs as its own service, so every instance talks to the same copy of the data.",
          ar: "الحل فكرة واحدة: انقل السلة من داخل الـ process إلى مخزن تستطيع الـ instances الثلاثة قراءته. و Redis هنا هو key/value database يعمل في الذاكرة كخدمة مستقلة، فتتحدث كل الـ instances إلى نفس نسخة البيانات." }
      ]
    },
    {
      key: "internals",
      blocks: [
        { t: "p",
          en: "Follow one request end to end. The browser sends POST /cart/items to a single public address. That address belongs to the load balancer, not to any instance. The load balancer picks a healthy instance — commonly by round robin, meaning it hands out requests in turn: first to A, then B, then C, then A again — and forwards the request there. The instance answers, the load balancer returns that answer, and the connection is done. The next request from the same browser starts the choice over from scratch.",
          ar: "تابع request واحداً من أوله إلى آخره. المتصفح يرسل POST /cart/items إلى عنوان عام واحد. هذا العنوان يخص الـ load balancer وليس أي instance. يختار الـ load balancer instance سليماً — غالباً بطريقة round robin، أي يوزّع الـ requests بالتناوب: الأول لـ A ثم B ثم C ثم A مجدداً — ويمرّر الـ request إليه. يردّ الـ instance، ويعيد الـ load balancer الرد، وتنتهي العملية. والـ request التالي من نفس المتصفح يبدأ الاختيار من الصفر." },
        { t: "kv", rows: [
          { k: { en: "Load balancer", ar: "Load balancer" },
            v: { en: "Picks an instance per request and checks each instance is alive before sending traffic to it.", ar: "يختار instance لكل request، ويتأكد أن الـ instance حيّ قبل إرسال حركة إليه." } },
          { k: { en: "Health check", ar: "Health check" },
            v: { en: "A small endpoint like GET /health the balancer calls every few seconds; a failing answer removes the instance from rotation.", ar: "endpoint صغير مثل GET /health ينادى كل بضع ثوانٍ؛ والرد الفاشل يخرج الـ instance من التوزيع." } },
          { k: { en: "Shared store", ar: "المخزن المشترك" },
            v: { en: "The database or cache every instance reads and writes, so they all see the same data.", ar: "الـ database أو الـ cache الذي تقرأ منه وتكتب فيه كل الـ instances، فترى كلها نفس البيانات." } },
          { k: { en: "Session token", ar: "Session token" },
            v: { en: "A value in a cookie or header that identifies the user, so any instance can look their data up.", ar: "قيمة في cookie أو header تعرّف المستخدم، فيستطيع أي instance البحث عن بياناته." } }
        ]},
        { t: "p",
          en: "The key point is what the instance owns. In the stateless version it owns nothing that outlives the response: it reads the session token from the cookie, fetches the cart from Redis by that key, changes it, writes it back, and returns. If that instance is killed mid-second, the next request goes to another one and the user notices nothing, because the only durable copy of the cart was never inside the instance.",
          ar: "النقطة الأساسية هي: ما الذي يملكه الـ instance؟ في النسخة الـ stateless لا يملك شيئاً يعيش بعد الرد: يقرأ الـ session token من الـ cookie، يجلب السلة من Redis بذلك المفتاح، يعدّلها، يكتبها مرة أخرى، ثم يردّ. وإن قُتل هذا الـ instance في تلك اللحظة، يذهب الـ request التالي إلى غيره ولا يلاحظ المستخدم شيئاً، لأن النسخة الوحيدة الدائمة من السلة لم تكن داخل الـ instance أصلاً." },
        { t: "code", lang: "csharp",
          label: { en: "The same endpoints, with the cart in a shared store", ar: "نفس الـ endpoints، مع وضع السلة في مخزن مشترك" },
          code: "// IDistributedCache is backed by Redis here, shared by all instances\napp.MapPost(\"/cart/items\", async (HttpContext ctx, IDistributedCache store, Item item) =>\n{\n    var key = $\"cart:{ctx.Request.Cookies[\"sid\"]}\";\n\n    var json = await store.GetStringAsync(key);\n    var cart = json is null ? new Cart() : JsonSerializer.Deserialize<Cart>(json)!;\n\n    cart.Items.Add(item);\n\n    await store.SetStringAsync(key, JsonSerializer.Serialize(cart),\n        new DistributedCacheEntryOptions { SlidingExpiration = TimeSpan.FromHours(2) });\n\n    return Results.Ok(cart);\n});" },
        { t: "p",
          en: "This is the same idea as the coffee cup, one level down. The cookie is the writing on the cup: it identifies the order but holds no contents. Redis is the shelf behind the counter where cups wait. Any barista can read the name on the cup and find the right one on the shelf. What made the first version fragile was keeping the shelf inside one barista's apron.",
          ar: "هذه نفس فكرة كوب القهوة، بمستوى أعمق. الـ cookie هي الكتابة على الكوب: تعرّف الطلب ولا تحمل محتواه. و Redis هو الرف خلف الطاولة حيث تنتظر الأكواب. أي barista يقرأ الاسم على الكوب ويجد الكوب الصحيح على الرف. وما جعل النسخة الأولى هشّة هو وضع الرف داخل جيب barista واحد." },
        { t: "p",
          en: "Sticky sessions are the shortcut people reach for instead. The load balancer hashes something about the client — usually its IP address or a cookie it sets — and always routes that client to the same instance, so the in-memory dictionary keeps working. It removes the symptom without removing the coupling: state still lives in one instance, and now traffic distribution depends on it.",
          ar: "الـ sticky sessions هي الاختصار الذي يلجأ إليه الناس بدلاً من ذلك. الـ load balancer يحسب hash لشيء يخص العميل — عادةً عنوان IP أو cookie يضعها هو — ويوجّه ذلك العميل دائماً إلى نفس الـ instance، فيستمر عمل الـ dictionary في الذاكرة. لكنه يزيل العرَض دون أن يزيل الارتباط: الـ state ما زال في instance واحد، وصار توزيع الحمل معتمداً عليه." }
      ]
    },
    {
      key: "tradeoffs",
      blocks: [
        { t: "tradeoff",
          pros: { en: [
            "Any instance answers any request, so adding capacity is just starting more copies.",
            "Losing an instance loses no user data, because no user data lived there.",
            "Deploys can restart instances one at a time without logging anyone out.",
            "Local testing matches production: one instance behaves like ten."
          ], ar: [
            "أي instance يردّ على أي request، فزيادة السعة مجرد تشغيل نسخ أكثر.",
            "فقدان instance لا يفقد بيانات مستخدمين، لأن لا بيانات مستخدمين كانت هناك.",
            "النشر يستطيع إعادة تشغيل الـ instances واحداً تلو الآخر دون إخراج أحد من جلسته.",
            "الاختبار المحلي يشبه الإنتاج: instance واحد يتصرف مثل عشرة."
          ]},
          cons: { en: [
            "Every read now crosses the network to the store, adding roughly 1 ms each time.",
            "The shared store becomes a dependency that can be slow or unavailable.",
            "State must be serializable, so you cannot keep live objects like an open connection.",
            "More moving parts to run, monitor and pay for."
          ], ar: [
            "كل قراءة تعبر الشبكة إلى المخزن، فتضيف حوالي 1 ms في كل مرة.",
            "المخزن المشترك يصبح تبعية قد تبطؤ أو تتعطّل.",
            "الـ state يجب أن يكون قابلاً للـ serialization، فلا يمكن الاحتفاظ بكائنات حيّة مثل اتصال مفتوح.",
            "أجزاء متحركة أكثر يجب تشغيلها ومراقبتها ودفع كلفتها."
          ]},
          limits: { en: [
            "Statelessness is about your app instances; the store behind them is still stateful.",
            "Long-lived connections like WebSocket are pinned to one instance by nature.",
            "Very large per-user state makes fetching it on every request expensive.",
            "It does not remove the need for locking when two requests edit the same record."
          ], ar: [
            "الـ statelessness يخص instances تطبيقك؛ أما المخزن خلفها فما زال stateful.",
            "الاتصالات طويلة العمر مثل WebSocket مرتبطة بـ instance واحد بطبيعتها.",
            "الـ state الضخم لكل مستخدم يجعل جلبه في كل request مكلفاً.",
            "لا يلغي الحاجة إلى locking عندما يعدّل request اثنان نفس السجل."
          ]},
          alts: { en: [
            "Sticky sessions: keep memory state, accept uneven load and data loss on restart.",
            "Client-held state such as a signed JWT: no store lookup, but hard to revoke early.",
            "Server-side session store in Redis or SQL: one lookup, easy to revoke.",
            "Stateful services with their own replication, used only where truly needed."
          ], ar: [
            "Sticky sessions: أبقِ الـ state في الذاكرة، واقبل حملاً غير متوازن وفقدان بيانات عند إعادة التشغيل.",
            "State عند العميل مثل JWT موقّع: بلا بحث في مخزن، لكن إلغاؤه مبكراً صعب.",
            "Session store على الخادم في Redis أو SQL: بحث واحد، وإلغاء سهل.",
            "خدمات stateful لها replication خاص بها، تُستخدم فقط حيث تلزم فعلاً."
          ]}
        }
      ]
    },
    {
      key: "mistakes",
      blocks: [
        { t: "mistake",
          title: { en: "A static field used as a cache", ar: "حقل static مستخدم كـ cache" },
          body: { en: "A team added a static Dictionary to hold exchange rates \"just for a few minutes\". Each instance refreshed on its own schedule, so three instances held three different rates. An order priced on instance A was charged on instance B at a different rate, and finance found a 0.4% gap in the daily totals. Anything static holding changing data is per-instance state wearing a cache costume.", ar: "فريق أضاف Dictionary من نوع static ليحمل أسعار الصرف «لبضع دقائق فقط». كل instance كان يحدّثها بجدوله الخاص، فحمل ثلاثة instances ثلاثة أسعار مختلفة. طلب سُعّر على instance A وحُصّل على instance B بسعر آخر، فوجدت المالية فرقاً 0.4% في إجماليات اليوم. أي static يحمل بيانات متغيّرة هو state خاص بالـ instance متنكّراً في ثوب cache." },
          fix: "// per-instance and unsynchronised\nstatic Dictionary<string, decimal> Rates = new();\n\n// shared: every instance sees the same value and the same expiry\nawait cache.SetStringAsync(\"rates:usd\", value,\n    new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5) });" },
        { t: "mistake",
          title: { en: "Sticky sessions treated as the fix", ar: "اعتبار الـ sticky sessions هي الحل" },
          body: { en: "Instead of moving carts out of memory, the team enabled sticky sessions. It worked until a deploy. Restarting instance A dropped every cart pinned to A, and those users had to start over. Worse, one instance ended up with 60% of traffic because a large corporate customer sat behind a single IP address, so the load balancer kept sending all of them to the same place.", ar: "بدل نقل السلات خارج الذاكرة، فعّل الفريق sticky sessions. عمل الأمر حتى جاء نشر جديد. إعادة تشغيل الـ instance A أسقطت كل سلة مرتبطة به، فاضطر أولئك المستخدمون للبدء من جديد. والأسوأ أن instance واحداً استقبل 60% من الحركة، لأن عميلاً مؤسسياً كبيراً كان خلف عنوان IP واحد، فظل الـ load balancer يرسلهم كلهم إلى نفس المكان." } },
        { t: "mistake",
          title: { en: "Background work stored in the instance", ar: "عمل خلفي مخزّن داخل الـ instance" },
          body: { en: "An export endpoint returned a job id immediately and kept progress in a static dictionary while a background task ran. Polling GET /jobs/{id} hit a different instance and returned 404, so the UI reported the export as failed while it was actually still running. Any work that outlives the response needs its progress in shared storage, not in the process that started it.", ar: "endpoint للتصدير كان يعيد job id فوراً ويحتفظ بالتقدّم في static dictionary بينما تعمل مهمة في الخلفية. استعلام GET /jobs/{id} كان يصل إلى instance مختلف فيعيد 404، فتُظهر الواجهة أن التصدير فشل بينما هو ما زال يعمل فعلاً. أي عمل يعيش بعد الرد يحتاج تقدّمه في تخزين مشترك، لا في الـ process الذي بدأه." } },
        { t: "mistake",
          title: { en: "In-memory data protection keys", ar: "مفاتيح data protection في الذاكرة" },
          body: { en: "ASP.NET Core encrypts auth cookies with keys it generates at startup. Left at the default in a container, each instance generated its own set. A cookie issued by instance A could not be decrypted by instance B, so users were logged out at random — roughly two thirds of the time with three instances. The keys must be persisted somewhere all instances read.", ar: "ASP.NET Core يشفّر cookies المصادقة بمفاتيح يولّدها عند الإقلاع. وبالإعداد الافتراضي داخل container، ولّد كل instance مجموعته الخاصة. فالـ cookie الصادرة من instance A لا يستطيع instance B فك تشفيرها، فخرج المستخدمون من جلساتهم عشوائياً — بحوالي ثلثي المرات مع ثلاثة instances. يجب حفظ المفاتيح في مكان تقرأه كل الـ instances." },
          fix: "builder.Services.AddDataProtection()\n    .PersistKeysToStackExchangeRedis(redis, \"DataProtection-Keys\")\n    .SetApplicationName(\"shop-api\");   // same name on every instance" }
      ]
    },
    {
      key: "interview",
      blocks: [
        { t: "qa", level: "junior",
          q: { en: "What does it mean for an HTTP server to be stateless?", ar: "ماذا يعني أن يكون الـ HTTP server بلا حالة (stateless)؟" },
          a: { en: "It means the server does not remember anything about you between requests. Every request has to bring what the server needs — usually a cookie or a token that identifies you — and the server looks up the rest from a database. Once it sends the response, it forgets. The practical benefit is that any server can answer any request, so you can run several copies.", ar: "يعني أن الـ server لا يتذكّر شيئاً عنك بين request وآخر. كل request يجب أن يحمل ما يحتاجه الـ server — عادةً cookie أو token يعرّفك — ثم يجلب الـ server الباقي من database. وبمجرد إرسال الرد ينسى. والفائدة العملية أن أي server يستطيع الرد على أي request، فتشغّل عدة نسخ." } },
        { t: "qa", level: "mid",
          q: { en: "You add a second instance and users start losing their session. What happened?", ar: "تضيف instance ثانياً فيبدأ المستخدمون بفقدان جلساتهم. ما الذي حدث؟" },
          a: { en: "Something was being kept in one process's memory. Usually it is a session dictionary, a static cache, or the data protection keys that encrypt the auth cookie. When the load balancer sends a request to the other instance, that instance has never seen the data, so it behaves as if the user is new. I would find what is stored in memory and move it to Redis or the database, and pin the data protection keys to a shared location.", ar: "شيء ما كان محفوظاً في ذاكرة process واحد. غالباً يكون session dictionary أو static cache أو مفاتيح data protection التي تشفّر cookie المصادقة. وعندما يرسل الـ load balancer الـ request إلى الـ instance الآخر، لا يكون قد رأى البيانات، فيتصرف كأن المستخدم جديد. سأبحث عمّا يُخزَّن في الذاكرة وأنقله إلى Redis أو الـ database، وأثبّت مفاتيح data protection في مكان مشترك." } },
        { t: "qa", level: "mid",
          q: { en: "Are sticky sessions ever an acceptable answer?", ar: "هل تكون الـ sticky sessions إجابة مقبولة أحياناً؟" },
          a: { en: "Yes, as a temporary bridge or for connections that are inherently pinned, like a WebSocket that stays open. But they cost you: a restart drops whatever was in that instance, load spreads unevenly when many users share an IP, and you can no longer take an instance out of rotation cleanly. If it is user data you care about, moving it to a shared store is the real fix, and it is usually a few hours of work.", ar: "نعم، كجسر مؤقت، أو للاتصالات المرتبطة بطبيعتها بـ instance واحد مثل WebSocket يبقى مفتوحاً. لكن لها ثمن: إعادة التشغيل تُسقط ما في ذلك الـ instance، والحمل يتوزّع بشكل غير متوازن حين يتشارك مستخدمون كثيرون عنوان IP واحداً، ولن تستطيع إخراج instance من التوزيع بنظافة. وإن كانت بيانات المستخدم هي ما يهمك، فالنقل إلى مخزن مشترك هو الحل الحقيقي، وغالباً يستغرق ساعات قليلة." } },
        { t: "qa", level: "senior",
          q: { en: "If the state just moves to Redis, have you actually removed the bottleneck?", ar: "إن كان الـ state ينتقل فقط إلى Redis، فهل أزلت العنق فعلاً؟" },
          a: { en: "I moved it, and that is still a real win, because the app tier is now the part I can scale freely and restart safely. But I have created a dependency I must treat seriously: give it a timeout so a slow Redis does not stall every request, run it with replicas so one node failing is not an outage, and decide what happens on failure. For a cart I would fail the request; for a rate cache I would fall back to a stale value.", ar: "نقلته، وهذا مكسب حقيقي، لأن طبقة التطبيق صارت هي الجزء الذي أستطيع توسيعه بحرية وإعادة تشغيله بأمان. لكنني أنشأت تبعية يجب التعامل معها بجدية: أضع لها timeout حتى لا يعلّق Redis البطيء كل request، وأشغّلها مع replicas حتى لا يكون سقوط عقدة انقطاعاً كاملاً، وأقرر ما يحدث عند الفشل. للسلة سأُفشل الـ request؛ ولـ cache الأسعار سأرجع إلى قيمة قديمة." } },
        { t: "qa", level: "senior",
          q: { en: "How do you decide between a JWT and a server-side session store?", ar: "كيف تختار بين JWT و session store على الخادم؟" },
          a: { en: "It comes down to revocation and size. A JWT is a signed token the client carries, so any instance can verify it with no lookup at all — fast, but you cannot cancel it before it expires without keeping a deny list, which puts you back at a lookup. A server-side session is one Redis read per request, but logging someone out is a delete. I use short-lived JWTs for service-to-service calls and a session store for human logins, where instant logout matters.", ar: "الأمر يعود إلى الإلغاء والحجم. الـ JWT هو token موقّع يحمله العميل، فيستطيع أي instance التحقق منه دون أي بحث — سريع، لكن لا يمكنك إلغاؤه قبل انتهائه إلا بقائمة منع، وهذا يعيدك إلى البحث. أما الـ session على الخادم فقراءة واحدة من Redis لكل request، لكن إخراج المستخدم مجرد حذف. أستخدم JWTs قصيرة العمر للنداءات بين الخدمات، و session store لتسجيل دخول البشر حيث يهم الخروج الفوري." } },
        { t: "qa", level: "staff",
          q: { en: "How do you stop per-instance state from creeping back in across many teams?", ar: "كيف تمنع عودة الـ state الخاص بالـ instance تدريجياً عبر فرق كثيرة؟" },
          a: { en: "Make the single-instance assumption impossible to hold. Run at least two instances in every environment including staging, so anything memory-bound breaks before release rather than on Black Friday. Add a startup check that fails if data protection keys are not persisted. Put a lint rule or review checklist item on static mutable fields. And restart one instance during load tests as a standing part of the suite — if a rolling restart is painless, the state is genuinely outside the app.", ar: "اجعل افتراض «instance واحد» مستحيلاً. شغّل instance اثنين على الأقل في كل بيئة بما فيها staging، فينكسر أي شيء معتمد على الذاكرة قبل الإصدار بدل أن ينكسر في موسم الذروة. أضف فحصاً عند الإقلاع يفشل إن لم تكن مفاتيح data protection محفوظة. ضع قاعدة lint أو بنداً في قائمة المراجعة على الحقول static القابلة للتغيير. وأعد تشغيل instance واحد أثناء اختبارات الحمل كجزء ثابت من المجموعة — فإن مرّ الـ rolling restart بلا ألم، فالـ state خارج التطبيق فعلاً." } }
      ]
    },
    {
      key: "codereview",
      blocks: [
        { t: "review", severity: "high",
          title: { en: "Rate limiting counted in process memory", ar: "تحديد المعدّل يُحسب في ذاكرة الـ process" },
          bad: "static readonly ConcurrentDictionary<string, int> Hits = new();\n\nif (Hits.AddOrUpdate(ip, 1, (_, n) => n + 1) > 100)\n    return Results.StatusCode(429);",
          good: "// one shared counter, incremented atomically, expiring after a minute\nvar key = $\"rate:{ip}:{DateTime.UtcNow:yyyyMMddHHmm}\";\nvar count = await redis.StringIncrementAsync(key);\nif (count == 1) await redis.KeyExpireAsync(key, TimeSpan.FromMinutes(1));\nif (count > 100) return Results.StatusCode(429);",
          why: { en: "With three instances each counting separately, a client gets 100 requests per instance, so the real limit is 300 — three times what was intended, and it changes every time you scale. The shared counter makes the limit mean one thing regardless of instance count. Status 429 means \"too many requests\".", ar: "مع ثلاثة instances يعدّ كل منها على حدة، يحصل العميل على 100 request لكل instance، فيصبح الحد الحقيقي 300 — ثلاثة أضعاف المقصود، ويتغيّر كلما وسّعت. العدّاد المشترك يجعل الحد يعني شيئاً واحداً مهما كان عدد الـ instances. والحالة 429 تعني «طلبات أكثر من اللازم»." } },
        { t: "review", severity: "medium",
          title: { en: "A timer that must run once, running on every instance", ar: "مؤقّت يجب أن يعمل مرة واحدة، يعمل على كل instance" },
          bad: "public class NightlyEmails : BackgroundService\n{\n    protected override async Task ExecuteAsync(CancellationToken ct)\n    {\n        while (!ct.IsCancellationRequested)\n        {\n            await SendDigestsAsync(ct);          // every instance does this\n            await Task.Delay(TimeSpan.FromHours(24), ct);\n        }\n    }\n}",
          good: "// only the instance that wins the lock sends; the others skip this round\nawait using var handle = await locks.TryAcquireAsync(\"nightly-digest\", TimeSpan.FromMinutes(30), ct);\nif (handle is not null)\n    await SendDigestsAsync(ct);",
          why: { en: "A background service starts inside every instance, so three instances send the digest three times and customers get duplicate mail. A distributed lock — a key in Redis that only one instance can hold at a time — makes exactly one of them do the work. The alternative is moving the job out of the API into a scheduler that runs it once.", ar: "الـ background service يبدأ داخل كل instance، فترسل ثلاثة instances النشرة ثلاث مرات ويصل العملاء بريد مكرر. والـ distributed lock — مفتاح في Redis لا يملكه إلا instance واحد في اللحظة — يجعل واحداً فقط يقوم بالعمل. والبديل نقل المهمة خارج الـ API إلى scheduler يشغّلها مرة واحدة." } }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        { t: "p",
          en: "In a normal deployment the app tier is the layer you want stateless, because it is the layer that changes size and gets replaced most often. Autoscaling adds instances when CPU rises and removes them when it falls; a deploy replaces every instance within minutes; a machine failure removes one without warning. All three are safe only if losing an instance loses nothing.",
          ar: "في أي نشر عادي، طبقة التطبيق هي الطبقة التي تريدها stateless، لأنها الطبقة التي يتغيّر حجمها وتُستبدل أكثر من غيرها. الـ autoscaling يضيف instances عند ارتفاع الـ CPU ويزيلها عند انخفاضه؛ والنشر يستبدل كل instance خلال دقائق؛ وعطل جهاز يزيل واحداً دون إنذار. والحالات الثلاث آمنة فقط إذا كان فقدان instance لا يفقد شيئاً." },
        { t: "ul",
          en: [
            "Kubernetes and similar platforms kill and restart containers freely; a stateful instance turns a routine restart into a user-visible incident.",
            "Blue/green and rolling deploys assume the new instances can serve traffic the old ones were serving, which only holds if state is shared.",
            "Autoscaling only helps if a brand-new instance is immediately as useful as an old one — no warm-up memory to rebuild.",
            "A second region is possible only when instances hold no unique data; otherwise you cannot fail over without losing sessions."
          ],
          ar: [
            "Kubernetes وما يشبهه يقتل الـ containers ويعيد تشغيلها بحرية؛ والـ instance الـ stateful يحوّل إعادة تشغيل روتينية إلى حادث يراه المستخدم.",
            "نشر blue/green والـ rolling deploys يفترضان أن الـ instances الجديدة تستطيع خدمة ما كانت تخدمه القديمة، وهذا يصحّ فقط إن كان الـ state مشتركاً.",
            "الـ autoscaling ينفع فقط إذا كان الـ instance الجديد مفيداً فوراً مثل القديم — بلا ذاكرة إحماء يعيد بناءها.",
            "المنطقة الثانية ممكنة فقط عندما لا تحمل الـ instances بيانات فريدة؛ وإلا لن تستطيع التحويل إليها دون فقدان الجلسات."
          ]},
        { t: "callout", kind: "tip",
          en: "A useful design question in review: \"if I kill one instance right now, what is lost?\" If the honest answer is anything other than the in-flight requests, the app is not stateless yet.",
          ar: "سؤال تصميم مفيد في المراجعة: «لو قتلت instance واحداً الآن، ماذا نفقد؟» إن كان الجواب الصادق أي شيء غير الـ requests الجارية، فالتطبيق ليس stateless بعد." }
      ]
    },
    {
      key: "perf",
      blocks: [
        { t: "kv", rows: [
          { k: { en: "Latency", ar: "Latency" },
            v: { en: "Each shared-store read adds roughly 0.5-2 ms inside one data centre. Two lookups per request is fine; twenty is a design problem.", ar: "كل قراءة من المخزن المشترك تضيف حوالي 0.5-2 ms داخل مركز بيانات واحد. قراءتان لكل request مقبول؛ وعشرون مشكلة تصميم." } },
          { k: { en: "Scalability", ar: "Scalability" },
            v: { en: "With no per-instance state, throughput grows almost linearly with instance count until the shared store or the database becomes the limit.", ar: "بلا state خاص بالـ instance، تنمو الإنتاجية خطياً تقريباً مع عدد الـ instances حتى يصبح المخزن المشترك أو الـ database هو الحد." } },
          { k: { en: "Memory", ar: "Memory" },
            v: { en: "Instances stay small and predictable, so you can pack more per machine. Memory no longer grows with the number of active users.", ar: "الـ instances تبقى صغيرة ومتوقعة، فتضع عدداً أكبر منها على كل جهاز. والذاكرة لم تعد تنمو مع عدد المستخدمين النشطين." } },
          { k: { en: "Network", ar: "Network" },
            v: { en: "Traffic that used to be a memory read is now a network call. Keep session payloads small — a few kilobytes, not megabytes.", ar: "ما كان قراءة من الذاكرة صار نداء عبر الشبكة. أبقِ حجم بيانات الجلسة صغيراً — بضعة كيلوبايت لا ميغابايت." } },
          { k: { en: "CPU", ar: "CPU" },
            v: { en: "Serializing and deserializing session data on every request costs CPU. Compact JSON or a binary format helps when payloads grow.", ar: "الـ serialization و deserialization لبيانات الجلسة في كل request يكلّف CPU. و JSON مضغوط أو صيغة binary يساعدان عندما تكبر البيانات." } }
        ]}
      ]
    },
    {
      key: "debug",
      blocks: [
        { t: "ul",
          en: [
            "Add the instance name to every log line and to a response header — if the same user's failing requests all show a different instance, you have found the pattern.",
            "Send the same request 10 times in a loop with curl and compare bodies; an answer that changes between identical calls means per-instance state.",
            "Run two instances locally with docker compose up --scale api=2 and repeat the failing flow — most of these bugs cannot reproduce on one instance.",
            "Search the codebase for static fields holding mutable data: grep -rn \"static.*Dictionary\\|static.*List\" src/ and check each hit.",
            "Watch the load balancer's per-instance request counts; a lopsided split usually means sticky sessions are on and hashing badly."
          ],
          ar: [
            "أضف اسم الـ instance إلى كل سطر log وإلى header في الرد — فإن أظهرت requests المستخدم الفاشلة instance مختلفاً في كل مرة، فقد وجدت النمط.",
            "أرسل نفس الـ request عشر مرات في حلقة بـ curl وقارن الأجساد؛ فرد يتغيّر بين نداءات متطابقة يعني state خاصاً بالـ instance.",
            "شغّل instance اثنين محلياً بـ docker compose up --scale api=2 وكرّر المسار الفاشل — أغلب هذه العلل لا تظهر مع instance واحد.",
            "ابحث في الكود عن حقول static تحمل بيانات متغيّرة: grep -rn \"static.*Dictionary\\|static.*List\" src/ وافحص كل نتيجة.",
            "راقب عدد الـ requests لكل instance في الـ load balancer؛ التوزيع غير المتوازن يعني عادةً أن sticky sessions مفعّلة وتوزّع بشكل سيئ."
          ]},
        { t: "callout", kind: "tip",
          en: "Return the instance name in a response header during investigation. Then a support screenshot of the browser network tab tells you which instance answered, without needing the user to reproduce anything.",
          ar: "أعِد اسم الـ instance في header بالرد أثناء التحقيق. عندها تخبرك لقطة شاشة من تبويب الشبكة في المتصفح أي instance ردّ، دون أن يحتاج المستخدم لإعادة إنتاج المشكلة." }
      ]
    },
    {
      key: "realworld",
      blocks: [
        { t: "p",
          en: "Almost every system that survives a traffic spike is stateless at the layer that receives requests. The pattern shows up wherever load is uneven and hardware is disposable: the request-handling tier holds nothing, and anything that must be remembered is pushed one layer down into a store built to be shared.",
          ar: "كل نظام تقريباً ينجو من موجة حمل يكون stateless في الطبقة التي تستقبل الـ requests. والنمط يظهر حيثما كان الحمل متفاوتاً والأجهزة قابلة للاستبدال: طبقة معالجة الـ requests لا تحمل شيئاً، وكل ما يجب تذكّره يُدفع طبقة إلى الأسفل، إلى مخزن مصمّم ليكون مشتركاً." },
        { t: "ul",
          en: [
            "E-commerce during sales events: instance count can go from 4 to 40 in minutes, so carts and sessions live in Redis, never in a process.",
            "Public APIs with rate limits: the counters must be shared, otherwise the published limit is silently multiplied by the instance count.",
            "Chat and collaboration platforms: the WebSocket connection is pinned to one instance, but the message history and presence data are shared, so a dropped connection reconnects anywhere.",
            "Payment gateways: a request may be retried against a different instance after a timeout, so idempotency keys are stored centrally rather than in memory."
          ],
          ar: [
            "التجارة الإلكترونية في مواسم التخفيضات: عدد الـ instances قد ينتقل من 4 إلى 40 خلال دقائق، فتعيش السلات والجلسات في Redis لا في process.",
            "الـ APIs العامة ذات حدود المعدّل: العدّادات يجب أن تكون مشتركة، وإلا ضُرب الحد المعلن بعدد الـ instances بصمت.",
            "منصات المحادثة والتعاون: اتصال الـ WebSocket مرتبط بـ instance واحد، لكن سجل الرسائل وبيانات التواجد مشتركة، فيعيد الاتصال المقطوع الارتباط في أي مكان.",
            "بوابات الدفع: قد يُعاد إرسال الـ request إلى instance مختلف بعد timeout، فتُخزَّن مفاتيح الـ idempotency مركزياً لا في الذاكرة."
          ]}
      ]
    },
    {
      key: "exercises",
      blocks: [
        { t: "ex", diff: "easy",
          en: "Take the in-memory cart API from this lesson, run two instances behind any load balancer, and script 30 alternating add/read calls. Record how many reads return an empty cart. You are done when the measured miss rate is close to the 50% you predicted before running it.",
          ar: "خذ API السلة في الذاكرة من هذا الدرس، شغّل instance اثنين خلف أي load balancer، واكتب سكربت يرسل 30 نداء إضافة وقراءة بالتناوب. سجّل كم قراءة تعيد سلة فارغة. تنتهي عندما تقترب نسبة الفشل المقاسة من الـ 50% التي توقعتها قبل التشغيل." },
        { t: "ex", diff: "medium",
          en: "Move the cart to Redis using IDistributedCache and repeat the same script. You are done when the miss rate is zero and you can state the added latency per read from your own measurement, not from this lesson.",
          ar: "انقل السلة إلى Redis باستخدام IDistributedCache وأعد تشغيل نفس السكربت. تنتهي عندما تصبح نسبة الفشل صفراً وتستطيع ذكر الـ latency المضاف لكل قراءة من قياسك أنت، لا من هذا الدرس." },
        { t: "ex", diff: "hard",
          en: "Add cookie authentication to the two-instance setup and log in. Restart one instance and keep browsing. You are done when you have made the random logouts happen, explained them by the data protection keys, and fixed it by persisting the keys to a shared location.",
          ar: "أضف مصادقة بـ cookie إلى إعداد الـ instance اثنين وسجّل الدخول. أعد تشغيل instance واحداً وواصل التصفّح. تنتهي عندما تكون قد أحدثت الخروج العشوائي من الجلسة، وفسّرته بمفاتيح data protection، وأصلحته بحفظ المفاتيح في مكان مشترك." },
        { t: "ex", diff: "senior",
          en: "Write a one-page audit of an existing service in your codebase: list every place state outlives a response (static fields, background jobs, in-memory caches, local files), rate each as safe or unsafe under a rolling restart, and propose the smallest change for each unsafe one. You are done when a colleague can act on the list without asking you what a row means.",
          ar: "اكتب تدقيقاً من صفحة واحدة لخدمة قائمة في كودك: اذكر كل موضع يعيش فيه state بعد الرد (حقول static، مهام خلفية، caches في الذاكرة، ملفات محلية)، وقيّم كلاً منها آمناً أو غير آمن عند rolling restart، واقترح أصغر تغيير لكل غير آمن. تنتهي عندما يستطيع زميل التصرّف بناءً على القائمة دون أن يسألك عن معنى أي سطر." }
      ]
    },
    {
      key: "refs",
      blocks: [
        { t: "ref", label: { en: "Session and state management in ASP.NET Core", ar: "إدارة الـ session والـ state في ASP.NET Core" },
          url: "https://learn.microsoft.com/en-us/aspnet/core/fundamentals/app-state",
          meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref", label: { en: "Distributed caching in ASP.NET Core", ar: "الـ distributed caching في ASP.NET Core" },
          url: "https://learn.microsoft.com/en-us/aspnet/core/performance/caching/distributed",
          meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref", label: { en: "Configure data protection key storage", ar: "إعداد تخزين مفاتيح data protection" },
          url: "https://learn.microsoft.com/en-us/aspnet/core/security/data-protection/configuration/overview",
          meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref", label: { en: "The Twelve-Factor App: processes are stateless", ar: "The Twelve-Factor App: الـ processes بلا حالة" },
          url: "https://12factor.net/processes",
          meta: { en: "Article", ar: "مقال" } }
      ]
    }
  ],
  quiz: [
    {
      q: { en: "What is the defining property of a stateless server?", ar: "ما الخاصية التي تعرّف الـ server الـ stateless؟" },
      options: [
        { en: "It stores no data anywhere at all.", ar: "لا يخزّن أي بيانات في أي مكان إطلاقاً." },
        { en: "It keeps nothing about a user in its own memory between requests.", ar: "لا يحتفظ بأي شيء عن المستخدم في ذاكرته بين request وآخر." },
        { en: "It uses only GET requests.", ar: "يستخدم requests من نوع GET فقط." },
        { en: "It runs on exactly one machine.", ar: "يعمل على جهاز واحد بالضبط." }
      ],
      correct: 1,
      why: { en: "State still exists — in a database, Redis, or the token the client sends. What makes the server stateless is that none of it lives in that one process between requests, so any instance can answer.", ar: "الـ state ما زال موجوداً — في database أو Redis أو الـ token الذي يرسله العميل. وما يجعل الـ server stateless هو ألّا يعيش أي منه في ذلك الـ process بين الـ requests، فيستطيع أي instance الرد." }
    },
    {
      q: { en: "With three instances and carts in a static in-memory dictionary, roughly what share of cart reads find the cart?", ar: "مع ثلاثة instances وسلات في static dictionary في الذاكرة، ما النسبة التقريبية لقراءات السلة التي تجدها؟" },
      options: [
        { en: "About 100% — the load balancer sorts it out.", ar: "حوالي 100% — الـ load balancer يتكفّل بالأمر." },
        { en: "About 67%.", ar: "حوالي 67%." },
        { en: "About 33%.", ar: "حوالي 33%." },
        { en: "0% — nothing works at all.", ar: "0% — لا شيء يعمل إطلاقاً." }
      ],
      correct: 2,
      why: { en: "With even round-robin routing, one instance in three holds that cart, so about a third of reads find it. The other two thirds return an empty cart with status 200, which is why the bug looks like data loss rather than an error.", ar: "مع توزيع round-robin متساوٍ، instance واحد من ثلاثة يحمل تلك السلة، فحوالي ثلث القراءات تجدها. والثلثان الآخران يعيدان سلة فارغة بحالة 200، ولهذا تبدو العلّة كفقدان بيانات لا كخطأ." }
    },
    {
      q: { en: "Why are sticky sessions a weak long-term fix?", ar: "لماذا تُعدّ الـ sticky sessions حلاً ضعيفاً على المدى الطويل؟" },
      options: [
        { en: "They are slower than reading from Redis.", ar: "أبطأ من القراءة من Redis." },
        { en: "State still lives in one instance, so a restart loses it and load spreads unevenly.", ar: "الـ state ما زال في instance واحد، فإعادة التشغيل تفقده والحمل يتوزّع بشكل غير متوازن." },
        { en: "They require a JWT to work.", ar: "تحتاج JWT حتى تعمل." },
        { en: "They only work with a single instance.", ar: "تعمل فقط مع instance واحد." }
      ],
      correct: 1,
      why: { en: "Stickiness hides the symptom without removing the coupling. Restarting or losing an instance still destroys whatever it held, and hashing by IP sends everyone behind one corporate network to the same instance.", ar: "الـ stickiness تخفي العرَض دون إزالة الارتباط. فإعادة تشغيل instance أو فقدانه ما زال يدمّر ما كان يحمله، والـ hashing بعنوان IP يرسل كل من خلف شبكة مؤسسية واحدة إلى نفس الـ instance." }
    },
    {
      q: { en: "Users are randomly logged out after scaling to three instances. What is the most likely cause?", ar: "يخرج المستخدمون من جلساتهم عشوائياً بعد التوسّع إلى ثلاثة instances. ما السبب الأرجح؟" },
      options: [
        { en: "Data protection keys are generated per instance, so cookies from one cannot be decrypted by another.", ar: "مفاتيح data protection تُولَّد لكل instance، فلا يستطيع instance فك تشفير cookie صادرة من آخر." },
        { en: "The database connection pool is too small.", ar: "حجم connection pool للـ database صغير جداً." },
        { en: "HTTPS certificates expired.", ar: "شهادات HTTPS انتهت صلاحيتها." },
        { en: "The cookie is missing the Secure flag.", ar: "الـ cookie تنقصها راية Secure." }
      ],
      correct: 0,
      why: { en: "ASP.NET Core encrypts the auth cookie with keys created at startup. Without persisting them to a shared location and setting the same application name, each instance has its own set and rejects the others' cookies.", ar: "ASP.NET Core يشفّر cookie المصادقة بمفاتيح تُنشأ عند الإقلاع. وبدون حفظها في مكان مشترك وضبط نفس application name، يملك كل instance مجموعته الخاصة ويرفض cookies البقية." }
    },
    {
      q: { en: "Which cost do you accept when you move session state from memory to a shared store?", ar: "ما التكلفة التي تقبلها عند نقل الـ session state من الذاكرة إلى مخزن مشترك؟" },
      options: [
        { en: "Requests can no longer be load balanced.", ar: "لم يعد بالإمكان توزيع الـ requests عبر load balancer." },
        { en: "The application can only run one instance.", ar: "يستطيع التطبيق تشغيل instance واحد فقط." },
        { en: "A network call of roughly 0.5-2 ms per lookup, plus a dependency that can fail.", ar: "نداء شبكة بحدود 0.5-2 ms لكل بحث، إضافة إلى تبعية قد تفشل." },
        { en: "Sessions can no longer expire.", ar: "لم يعد بالإمكان انتهاء صلاحية الجلسات." }
      ],
      correct: 2,
      why: { en: "The trade is real: what was a memory read becomes a network call inside the data centre, and the store becomes something you must give a timeout, replicate, and plan a fallback for. In exchange the app tier scales and restarts freely.", ar: "المقايضة حقيقية: ما كان قراءة من الذاكرة يصبح نداء شبكة داخل مركز البيانات، ويصبح المخزن شيئاً يجب أن تضع له timeout و replication وخطة بديلة. وفي المقابل تتوسّع طبقة التطبيق وتُعاد تشغيلها بحرية." }
    }
  ]
};
```

NEXT: session-state
