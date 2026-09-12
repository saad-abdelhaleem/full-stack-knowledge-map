```js
const cacheLayersLesson = {
  id: "cache-layers",
  moduleId: "performance",
  title: { en: "Cache layers and invalidation", ar: "طبقات الـ cache والإبطال" },
  summary: {
    en: "Where to keep a copy of expensive data so you compute it once, and how to stop that copy from going stale.",
    ar: "أين تحتفظ بنسخة من البيانات الغالية لتحسبها مرة واحدة، وكيف تمنع تلك النسخة من أن تصبح قديمة."
  },
  mins: 18,
  sections: [
    {
      key: "why",
      blocks: [
        { t: "p",
          en: "A cache is a fast copy of data you already computed, kept close so you don't compute it again. If reading a product from the database takes 200 ms, and you keep the result in memory, the next reader gets it in under 1 ms.",
          ar: "الـ cache نسخة سريعة من بيانات حسبتها مسبقاً، تُحفظ قريبة منك حتى لا تحسبها من جديد. لو قراءة منتج من الـ database تأخذ 200 ms، واحتفظت بالنتيجة في الذاكرة، يحصل القارئ التالي عليها في أقل من 1 ms." },
        { t: "kv", rows: [
          { k: { en: "cache", ar: "cache" }, v: { en: "A store that holds a copy of computed data for fast reuse.", ar: "مخزن يحتفظ بنسخة من بيانات محسوبة لإعادة استخدامها بسرعة." } },
          { k: { en: "cache hit", ar: "cache hit" }, v: { en: "The data you asked for was in the cache, so no recompute.", ar: "البيانات التي طلبتها كانت في الـ cache، فلا إعادة حساب." } },
          { k: { en: "cache miss", ar: "cache miss" }, v: { en: "The data was not in the cache, so you fall back to the source.", ar: "البيانات لم تكن في الـ cache، فترجع إلى المصدر الأصلي." } },
          { k: { en: "TTL", ar: "TTL" }, v: { en: "Time To Live — how long an entry stays valid before it expires.", ar: "Time To Live — المدة التي يبقى فيها العنصر صالحاً قبل أن ينتهي." } },
          { k: { en: "eviction", ar: "eviction" }, v: { en: "The cache dropping an entry to make room when it is full.", ar: "إسقاط الـ cache لعنصر ليفرغ مكاناً عندما يمتلئ." } },
          { k: { en: "invalidation", ar: "invalidation" }, v: { en: "Removing or refreshing a cached copy because the real data changed.", ar: "إزالة أو تحديث النسخة المخزّنة لأن البيانات الحقيقية تغيّرت." } }
        ]},
        { t: "p",
          en: "Databases are the slow, shared, expensive resource. Every request that hits them adds load. A cache exists because the same data gets read far more often than it changes — a product page is read thousands of times a minute but its price changes once a week.",
          ar: "الـ database هو المورد البطيء المشترك الغالي. كل request يصله يزيد الحمل. الـ cache موجود لأن نفس البيانات تُقرأ أكثر بكثير مما تتغيّر — صفحة منتج تُقرأ آلاف المرات في الدقيقة لكن سعرها يتغيّر مرة في الأسبوع." },
        { t: "p",
          en: "Think of a library. Instead of walking to the deep archive for every question, the librarian keeps the most-asked books on the front desk. That desk is the cache: small, fast, close. The archive is the database: complete, slow, far.",
          ar: "تخيّل مكتبة. بدل الذهاب إلى الأرشيف العميق لكل سؤال، يحتفظ أمين المكتبة بالكتب الأكثر طلباً على المكتب الأمامي. ذلك المكتب هو الـ cache: صغير، سريع، قريب. الأرشيف هو الـ database: كامل، بطيء، بعيد." },
        { t: "callout", kind: "note",
          en: "The hard part of caching is not putting data in. It is knowing when to take it out so readers never see a stale copy.",
          ar: "الجزء الصعب في الـ caching ليس وضع البيانات فيه، بل معرفة متى تُخرجها حتى لا يرى القرّاء نسخة قديمة." }
      ]
    },
    {
      key: "problem",
      blocks: [
        { t: "p",
          en: "Take one endpoint: GET /products/{id}. It joins three tables and takes 200 ms per call. Under 500 requests per second, the database CPU sits at 90% and p99 latency is 400 ms — meaning the slowest 1 in 100 requests takes 400 ms.",
          ar: "خذ endpoint واحد: GET /products/{id}. يعمل join على ثلاثة جداول ويأخذ 200 ms لكل نداء. تحت 500 request في الثانية، يبقى CPU الخاص بالـ database عند 90% ويكون p99 latency 400 ms — أي أن أبطأ 1 من كل 100 request يأخذ 400 ms." },
        { t: "p",
          en: "Now cache each product for 60 seconds. Most reads hit the cache and return in 2 ms. The database only sees the first read of each product per minute. Database CPU drops to 20%, p99 falls to 8 ms, and the same servers handle five times the traffic.",
          ar: "الآن خزّن كل منتج لمدة 60 ثانية. معظم القراءات تصيب الـ cache وترجع في 2 ms. الـ database يرى فقط أول قراءة لكل منتج في الدقيقة. ينزل CPU الخاص بالـ database إلى 20%، وينزل p99 إلى 8 ms، وتخدم نفس الخوادم خمسة أضعاف الحمل." },
        { t: "kv", rows: [
          { k: { en: "hit ratio", ar: "hit ratio" }, v: { en: "Share of reads served from cache. 95% means 19 of every 20 reads skip the database.", ar: "نسبة القراءات المخدومة من الـ cache. 95% تعني أن 19 من كل 20 قراءة تتخطى الـ database." } },
          { k: { en: "what earns a cache", ar: "ما يستحق الـ cache" }, v: { en: "Read far more than written, and a slightly old copy is acceptable for a short window.", ar: "يُقرأ أكثر بكثير مما يُكتب، ونسخة قديمة قليلاً مقبولة لفترة قصيرة." } }
        ]}
      ]
    },
    {
      key: "internals",
      blocks: [
        { t: "p",
          en: "There are two places to keep the cache, and they behave very differently. An in-process cache lives inside your application's own memory. A distributed cache is a separate server, usually Redis, that all your app instances share over the network.",
          ar: "هناك مكانان للاحتفاظ بالـ cache، ويتصرّفان بشكل مختلف جداً. الـ in-process cache يعيش داخل ذاكرة تطبيقك نفسه. الـ distributed cache خادم منفصل، عادة Redis، تتشاركه كل نسخ تطبيقك عبر الشبكة." },
        { t: "kv", rows: [
          { k: { en: "in-process cache", ar: "in-process cache" }, v: { en: "A dictionary in your app's RAM. Read in nanoseconds. In .NET this is IMemoryCache.", ar: "قاموس في ذاكرة تطبيقك. يُقرأ في نانوثوانٍ. في .NET هو IMemoryCache." } },
          { k: { en: "distributed cache", ar: "distributed cache" }, v: { en: "A shared server (Redis) reached over the network. Slower than local, but all instances see the same data.", ar: "خادم مشترك (Redis) يُوصل عبر الشبكة. أبطأ من المحلي، لكن كل النسخ ترى نفس البيانات." } },
          { k: { en: "Redis", ar: "Redis" }, v: { en: "An in-memory key/value store commonly used as a distributed cache.", ar: "مخزن key/value في الذاكرة يُستخدم غالباً كـ distributed cache." } }
        ]},
        { t: "p",
          en: "The most common read pattern is cache-aside: the application checks the cache first, and only touches the database on a miss. Back to the librarian — she checks the front desk first, and only walks to the archive if the book is not there, then puts a copy on the desk on her way back.",
          ar: "أكثر نمط قراءة شيوعاً هو cache-aside: يفحص التطبيق الـ cache أولاً، ولا يلمس الـ database إلا عند miss. عودة إلى أمين المكتبة — يفحص المكتب الأمامي أولاً، ولا يذهب إلى الأرشيف إلا إذا لم يكن الكتاب هناك، ثم يضع نسخة على المكتب في طريق عودته." },
        { t: "code", lang: "csharp", label: { en: "Cache-aside read", ar: "قراءة cache-aside" },
          code: "public async Task<Product> GetProductAsync(int id)\n{\n    var key = $\"product:{id}\";\n\n    // 1. Try the cache first.\n    if (_cache.TryGetValue(key, out Product cached))\n        return cached; // cache hit\n\n    // 2. Miss: read the real source.\n    var product = await _db.Products.FindAsync(id);\n\n    // 3. Store a copy with a TTL, then return it.\n    _cache.Set(key, product, TimeSpan.FromSeconds(60));\n    return product;\n}" },
        { t: "p",
          en: "The other main pattern is write-through: every write goes to the database and updates the cache in the same step, so the cache is never behind. It costs more on writes but keeps reads always fresh. Cache-aside is simpler and far more common.",
          ar: "النمط الرئيسي الآخر هو write-through: كل كتابة تذهب إلى الـ database وتحدّث الـ cache في نفس الخطوة، فلا يتأخّر الـ cache أبداً. يكلّف أكثر على الكتابة لكن يبقي القراءات طازجة دائماً. الـ cache-aside أبسط وأكثر شيوعاً بكثير." },
        { t: "p",
          en: "A cached entry leaves the cache in one of three ways. It expires when its TTL runs out. It is evicted when the cache is full and needs room. Or it is invalidated on purpose when the underlying data changes and you delete the key so the next read recomputes.",
          ar: "العنصر المخزّن يغادر الـ cache بإحدى ثلاث طرق. ينتهي عند انتهاء TTL. أو يُطرد (eviction) عندما يمتلئ الـ cache ويحتاج مكاناً. أو يُبطل عمداً عندما تتغيّر البيانات الأصلية فتحذف المفتاح لتعيد القراءة التالية الحساب." }
      ]
    },
    {
      key: "tradeoffs",
      blocks: [
        { t: "tradeoff",
          pros: {
            en: ["Cuts read latency from hundreds of milliseconds to single digits.", "Shields the database from repeated identical reads.", "Lets the same hardware serve far more traffic.", "Simple to add for read-heavy, rarely-changing data."],
            ar: ["يقلّص زمن القراءة من مئات الـ milliseconds إلى آحاد.", "يحمي الـ database من قراءات متطابقة متكرّرة.", "يسمح لنفس العتاد بخدمة حمل أكبر بكثير.", "بسيط الإضافة للبيانات كثيرة القراءة نادرة التغيّر."]
          },
          cons: {
            en: ["Stale reads: the cache can serve an old copy after data changes.", "Adds a second source of truth to keep consistent.", "In-process caches differ between instances.", "A cache outage can flood the database at once."],
            ar: ["قراءات قديمة: قد يخدم الـ cache نسخة قديمة بعد تغيّر البيانات.", "يضيف مصدر حقيقة ثانياً يجب إبقاؤه متّسقاً.", "الـ in-process caches تختلف بين النسخ.", "تعطّل الـ cache قد يغرق الـ database دفعة واحدة."]
          },
          limits: {
            en: ["No help for write-heavy data that changes every read.", "TTL is a guess: too long is stale, too short is useless.", "Distributed cache adds a network hop and a dependency.", "Memory is finite, so eviction is unavoidable."],
            ar: ["لا يفيد البيانات كثيرة الكتابة التي تتغيّر كل قراءة.", "الـ TTL تخمين: طويلة تعني قِدَماً، قصيرة تعني بلا فائدة.", "الـ distributed cache يضيف قفزة شبكة وتبعية.", "الذاكرة محدودة، فالـ eviction لا مفرّ منه."]
          },
          alts: {
            en: ["A read replica for scaling reads without staleness risk.", "A materialized view precomputed in the database.", "A CDN for cacheable HTTP responses at the edge.", "Query and index tuning to make the source read fast enough."],
            ar: ["read replica لتوسيع القراءات دون خطر القِدَم.", "materialized view محسوبة مسبقاً في الـ database.", "CDN لاستجابات HTTP القابلة للتخزين عند الحافة.", "ضبط الاستعلامات والفهارس ليصبح المصدر سريعاً كفاية."]
          }
        }
      ]
    },
    {
      key: "mistakes",
      blocks: [
        { t: "mistake",
          title: { en: "Caching with no TTL and no invalidation", ar: "تخزين بلا TTL وبلا invalidation" },
          body: { en: "A team cached user profiles forever to be fast. A user changed their email; the app kept showing the old one for days. With no expiry and no removal on update, the cache became a permanent lie.", ar: "خزّن فريق ملفات المستخدمين للأبد طلباً للسرعة. غيّر مستخدم بريده؛ ظل التطبيق يعرض القديم أياماً. بلا انتهاء وبلا إزالة عند التحديث، صار الـ cache كذبة دائمة." },
          fix: "// On any profile write, remove the cached copy.\nawait _db.SaveChangesAsync();\n_cache.Remove($\"user:{userId}\");" },
        { t: "mistake",
          title: { en: "Caching the empty result of a miss forever", ar: "تخزين النتيجة الفارغة للـ miss للأبد" },
          body: { en: "A lookup returned null for a not-yet-created record, and null was cached with a long TTL. When the record was created minutes later, callers kept getting null until the TTL passed. Cache negatives, but with a short TTL.", ar: "أرجع بحث null لسجل لم يُنشأ بعد، وخُزّن الـ null بـ TTL طويلة. عندما أُنشئ السجل بعد دقائق، ظل المنادون يحصلون على null حتى انتهت الـ TTL. خزّن النتائج السالبة لكن بـ TTL قصيرة." } },
        { t: "mistake",
          title: { en: "Assuming an in-process cache is shared", ar: "افتراض أن الـ in-process cache مشترك" },
          body: { en: "With three app instances behind a load balancer, each had its own IMemoryCache. An admin cleared the cache, but only on the instance that served their request. The other two kept serving stale data. In-process caches are per-instance.", ar: "مع ثلاث نسخ تطبيق خلف load balancer، كان لكلٍّ IMemoryCache خاص. مسح مسؤول الـ cache، لكن فقط على النسخة التي خدمت request-ه. أبقت النسختان الأخريان البيانات القديمة. الـ in-process caches خاص بكل نسخة." } },
        { t: "mistake",
          title: { en: "Storing huge objects and blowing the memory budget", ar: "تخزين كائنات ضخمة وتفجير ميزانية الذاكرة" },
          body: { en: "Full 2 MB product objects with images went into IMemoryCache. Under load the process memory grew until the garbage collector ran constantly and latency got worse than with no cache. Cache small, cheap keys — not whole payloads.", ar: "دخلت كائنات منتجات كاملة بحجم 2 MB مع صور إلى IMemoryCache. تحت الحمل نمت ذاكرة العملية حتى صار garbage collector يعمل باستمرار وساءت الـ latency أكثر من غياب الـ cache. خزّن مفاتيح صغيرة رخيصة لا حمولات كاملة." } }
      ]
    },
    {
      key: "interview",
      blocks: [
        { t: "qa", level: "junior",
          q: { en: "What is a cache and why use one?", ar: "ما هو الـ cache ولماذا نستخدمه؟" },
          a: { en: "It's a fast copy of data you already computed, kept close so you don't redo the work. You use it when the same data is read far more often than it changes, like a product page — so most reads skip the slow database.", ar: "هو نسخة سريعة من بيانات حسبتها مسبقاً، محفوظة قريبة حتى لا تعيد العمل. تستخدمه عندما تُقرأ نفس البيانات أكثر بكثير مما تتغيّر، مثل صفحة منتج — فتتخطى معظم القراءات الـ database البطيء." } },
        { t: "qa", level: "mid",
          q: { en: "Explain the cache-aside pattern.", ar: "اشرح نمط cache-aside." },
          a: { en: "The app checks the cache first. On a hit it returns the cached value. On a miss it reads the database, stores the result in the cache with a TTL, and returns it. The cache is filled lazily, only for data that's actually requested.", ar: "يفحص التطبيق الـ cache أولاً. عند hit يرجع القيمة المخزّنة. عند miss يقرأ الـ database، يخزّن النتيجة في الـ cache بـ TTL، ثم يرجعها. يُملأ الـ cache بتكاسل، فقط للبيانات المطلوبة فعلاً." } },
        { t: "qa", level: "mid",
          q: { en: "When would you pick a distributed cache over an in-process one?", ar: "متى تختار distributed cache بدل in-process؟" },
          a: { en: "When you run multiple instances and they must agree on the cached data, or when you need cached entries to survive a restart. In-process is faster but each instance has its own copy, so invalidation and consistency get hard across a fleet.", ar: "عندما تشغّل نسخاً متعدّدة ويجب أن تتّفق على البيانات المخزّنة، أو عندما تحتاج بقاء العناصر بعد إعادة التشغيل. الـ in-process أسرع لكن لكل نسخة نسختها، فيصعب الـ invalidation والاتساق عبر أسطول." } },
        { t: "qa", level: "senior",
          q: { en: "How do you keep a cache from serving stale data?", ar: "كيف تمنع الـ cache من خدمة بيانات قديمة؟" },
          a: { en: "Two levers. A TTL bounds how stale data can get without you doing anything. Explicit invalidation removes the key the moment the source changes, usually on the write path. You combine them: invalidate on write for correctness, plus a TTL as a safety net for anything you miss.", ar: "أداتان. الـ TTL يحدّ كم يمكن أن تصبح البيانات قديمة دون أي تدخّل. والـ invalidation الصريح يحذف المفتاح لحظة تغيّر المصدر، عادة في مسار الكتابة. تدمجهما: أبطل عند الكتابة للصحة، مع TTL كشبكة أمان لما يفوتك." } },
        { t: "qa", level: "senior",
          q: { en: "What happens when a hot cache key expires under heavy load?", ar: "ماذا يحدث عندما ينتهي مفتاح cache ساخن تحت حمل ثقيل؟" },
          a: { en: "Every concurrent reader misses at once and all rush to recompute the same value, hammering the database — a cache stampede. You guard against it by letting only one caller recompute while others wait or serve slightly stale data. That's the topic of the next lesson.", ar: "يخفق كل القرّاء المتزامنين معاً ويندفعون جميعاً لإعادة حساب نفس القيمة، فيضربون الـ database — cache stampede. تحمي بأن تسمح لمنادٍ واحد بإعادة الحساب بينما ينتظر الباقون أو يُخدمون ببيانات قديمة قليلاً. هذا موضوع الدرس التالي." } },
        { t: "qa", level: "staff",
          q: { en: "A team keeps shipping stale-data bugs from caching. What do you change structurally?", ar: "فريق يشحن باستمرار أخطاء بيانات قديمة من الـ caching. ما الذي تغيّره هيكلياً؟" },
          a: { en: "Stop scattering cache reads and writes across the codebase. Put each cached entity behind one component that owns its key, its TTL, and its invalidation, so a write can't forget to clear the cache. Add cache hit ratio and staleness metrics so the behavior is visible, and make caching a reviewed decision per entity, not a reflex.", ar: "أوقف تشتّت قراءات وكتابات الـ cache عبر الكود. ضع كل كيان مخزّن خلف مكوّن واحد يملك مفتاحه وTTL-ه وinvalidation-ه، فلا تنسى الكتابة مسح الـ cache. أضف مقاييس hit ratio وقِدَم البيانات ليصبح السلوك مرئياً، واجعل الـ caching قراراً مُراجَعاً لكل كيان لا ردّ فعل." } }
      ]
    },
    {
      key: "codereview",
      blocks: [
        { t: "review", severity: "high",
          title: { en: "Write updates the database but never clears the cache", ar: "الكتابة تحدّث الـ database لكن لا تمسح الـ cache أبداً" },
          bad: "public async Task UpdatePriceAsync(int id, decimal price)\n{\n    var p = await _db.Products.FindAsync(id);\n    p.Price = price;\n    await _db.SaveChangesAsync();\n    // cache still holds the OLD price\n}",
          good: "public async Task UpdatePriceAsync(int id, decimal price)\n{\n    var p = await _db.Products.FindAsync(id);\n    p.Price = price;\n    await _db.SaveChangesAsync();\n    _cache.Remove($\"product:{id}\"); // next read recomputes\n}",
          why: { en: "The read path caches the product, but the write path never invalidates it. Readers keep seeing the old price until the TTL passes. Every write to cached data must remove or refresh its key.", ar: "مسار القراءة يخزّن المنتج، لكن مسار الكتابة لا يبطله أبداً. يبقى القرّاء يرون السعر القديم حتى تنتهي الـ TTL. كل كتابة على بيانات مخزّنة يجب أن تزيل مفتاحها أو تحدّثه." } },
        { t: "review", severity: "medium",
          title: { en: "No TTL, so entries live until the process restarts", ar: "لا TTL، فتعيش العناصر حتى إعادة تشغيل العملية" },
          bad: "_cache.Set($\"product:{id}\", product);\n// no expiry: grows forever, never self-heals",
          good: "_cache.Set($\"product:{id}\", product,\n    new MemoryCacheEntryOptions {\n        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5),\n        Size = 1\n    });",
          why: { en: "Without a TTL the cache only grows, and any missed invalidation stays wrong forever. A bounded TTL caps both memory and how stale a forgotten key can get. Setting Size lets you enforce a total memory limit.", ar: "بلا TTL ينمو الـ cache فقط، وأي invalidation فائت يبقى خاطئاً للأبد. الـ TTL المحدودة تحدّ الذاكرة وكم يمكن لمفتاح منسيّ أن يصبح قديماً. تحديد Size يتيح فرض حدّ ذاكرة إجمالي." } }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        { t: "p",
          en: "In a real system caching is layered from the client inward, and each layer catches reads the layer below never sees. A read that hits an outer layer never reaches the database at all.",
          ar: "في نظام حقيقي يكون الـ caching مطبّقاً بطبقات من العميل للداخل، وكل طبقة تلتقط قراءات لا تراها الطبقة الأسفل. القراءة التي تصيب طبقة خارجية لا تصل الـ database إطلاقاً." },
        { t: "ul",
          en: [
            "Browser and CDN cache: HTTP responses cached at the edge, controlled by Cache-Control headers.",
            "In-process cache: per-instance IMemoryCache for the hottest, smallest data, read in nanoseconds.",
            "Distributed cache: a shared Redis all instances read, so they agree and survive restarts.",
            "Database: the source of truth, reached only on a miss through every layer above."
          ],
          ar: [
            "cache المتصفّح والـ CDN: استجابات HTTP مخزّنة عند الحافة، يتحكّم بها Cache-Control headers.",
            "in-process cache: IMemoryCache لكل نسخة للبيانات الأسخن والأصغر، تُقرأ في نانوثوانٍ.",
            "distributed cache: Redis مشترك تقرأه كل النسخ، فتتّفق وتبقى بعد إعادة التشغيل.",
            "database: مصدر الحقيقة، لا يُوصل إلا عند miss يعبر كل الطبقات فوقه."
          ]
        },
        { t: "callout", kind: "tip",
          en: "Each layer adds a copy that can go stale. More layers means more speed but more places to invalidate. Add a layer only when the one below is proven to be the bottleneck.",
          ar: "كل طبقة تضيف نسخة قد تصبح قديمة. طبقات أكثر تعني سرعة أكبر لكن أماكن إبطال أكثر. أضف طبقة فقط عندما يثبت أن الطبقة الأسفل هي عنق الزجاجة." }
      ]
    },
    {
      key: "perf",
      blocks: [
        { t: "kv", rows: [
          { k: { en: "Latency", ar: "Latency" }, v: { en: "In-process hit is under 1 microsecond; Redis hit is ~1 ms; a database miss is tens to hundreds of ms.", ar: "إصابة in-process أقل من 1 microsecond؛ إصابة Redis نحو 1 ms؛ miss الـ database عشرات إلى مئات الـ ms." } },
          { k: { en: "Memory", ar: "Memory" }, v: { en: "Every cached entry costs RAM. Cache small keys, cap total size, and let eviction reclaim room.", ar: "كل عنصر مخزّن يكلّف RAM. خزّن مفاتيح صغيرة، حُدّ الحجم الكلي، ودع eviction يستعيد المكان." } },
          { k: { en: "Database", ar: "Database" }, v: { en: "Load falls in proportion to hit ratio. A 95% hit ratio means the database sees 1 in 20 reads.", ar: "يقل الحمل بنسبة hit ratio. hit ratio بنسبة 95% تعني أن الـ database يرى 1 من كل 20 قراءة." } },
          { k: { en: "Network", ar: "Network" }, v: { en: "A distributed cache adds a round trip per read; a serialization cost per entry. In-process has neither.", ar: "الـ distributed cache يضيف رحلة ذهاب وإياب لكل قراءة، وتكلفة serialization لكل عنصر. الـ in-process بلا الاثنين." } },
          { k: { en: "Scalability", ar: "Scalability" }, v: { en: "Caching lets read traffic grow without growing the database, the hardest tier to scale.", ar: "الـ caching يتيح نمو حمل القراءة دون تنمية الـ database، أصعب طبقة في التوسّع." } }
        ]}
      ]
    },
    {
      key: "debug",
      blocks: [
        { t: "ul",
          en: [
            "Log or emit a hit/miss counter per key prefix: a low hit ratio means the cache is not earning its cost.",
            "Redis INFO stats / keyspace_hits vs keyspace_misses: shows the real hit ratio on the shared cache.",
            "Redis TTL <key>: confirms an entry actually has the expiry you think it does.",
            "Application memory graphs: a cache with no size limit shows as steadily climbing RAM.",
            "Add a request timestamp to cached values and compare to source: reveals how stale served data actually is."
          ],
          ar: [
            "سجّل أو أصدر عدّاد hit/miss لكل بادئة مفتاح: hit ratio منخفض يعني أن الـ cache لا يستحق تكلفته.",
            "إحصاءات Redis INFO / keyspace_hits مقابل keyspace_misses: تُظهر hit ratio الحقيقي على الـ cache المشترك.",
            "Redis TTL <key>: يؤكّد أن للعنصر فعلاً الانتهاء الذي تظنّه.",
            "رسوم ذاكرة التطبيق: cache بلا حدّ حجم يظهر كـ RAM يصعد باطّراد.",
            "أضف طابع وقت للقيم المخزّنة وقارن بالمصدر: يكشف كم البيانات المخدومة قديمة فعلاً."
          ]
        },
        { t: "callout", kind: "tip",
          en: "When data looks wrong, check whether every instance is stale or just some. All stale points at a shared cache or a bad TTL; only some stale points at per-instance in-process caches disagreeing.",
          ar: "عندما تبدو البيانات خاطئة، افحص هل كل النسخ قديمة أم بعضها. الكل قديم يشير إلى cache مشترك أو TTL سيئة؛ بعضها فقط يشير إلى in-process caches لكل نسخة تختلف." }
      ]
    },
    {
      key: "realworld",
      blocks: [
        { t: "p",
          en: "Caching is heaviest exactly where reads dominate writes and a short delay is acceptable. The pattern shows up wherever the same data is served to many users faster than it changes.",
          ar: "يكون الـ caching أثقل بالضبط حيث تغلب القراءات الكتابات ويكون تأخير قصير مقبولاً. يظهر النمط حيثما تُخدم نفس البيانات لكثير من المستخدمين أسرع مما تتغيّر." },
        { t: "ul",
          en: [
            "E-commerce catalogs: product and price pages read constantly, changed occasionally, cached with a short TTL.",
            "Social and content feeds: rendered timelines cached per user so a scroll doesn't rebuild the feed each time.",
            "Authorization systems: permission and role lookups cached to avoid a database hit on every single request.",
            "Configuration and feature flags: settings read on nearly every request but changed rarely, cached in-process."
          ],
          ar: [
            "كتالوجات التجارة الإلكترونية: صفحات المنتج والسعر تُقرأ باستمرار، تتغيّر أحياناً، تُخزّن بـ TTL قصيرة.",
            "خلاصات المحتوى والتواصل: timelines مُصيّرة تُخزّن لكل مستخدم فلا يعيد الـ scroll بناء الخلاصة كل مرة.",
            "أنظمة الصلاحيات: عمليات بحث الصلاحيات والأدوار تُخزّن لتجنّب ضرب الـ database في كل request.",
            "الإعدادات وأعلام الميزات: قيم تُقرأ في كل request تقريباً لكن تتغيّر نادراً، تُخزّن in-process."
          ]
        }
      ]
    },
    {
      key: "exercises",
      blocks: [
        { t: "ex", diff: "easy",
          en: "Add cache-aside to a GET /products/{id} endpoint with IMemoryCache and a 60-second TTL. Prove it works by logging hit or miss on each call and showing the second read is a hit.",
          ar: "أضف cache-aside إلى endpoint بصيغة GET /products/{id} باستخدام IMemoryCache وTTL مدتها 60 ثانية. أثبت أنه يعمل بتسجيل hit أو miss في كل نداء وإظهار أن القراءة الثانية hit." },
        { t: "ex", diff: "medium",
          en: "Extend the write path so updating a product removes its cache key. Prove correctness by updating the price and showing the very next read returns the new value, not the old one.",
          ar: "وسّع مسار الكتابة بحيث يزيل تحديث منتج مفتاح الـ cache الخاص به. أثبت الصحة بتحديث السعر وإظهار أن القراءة التالية مباشرة ترجع القيمة الجديدة لا القديمة." },
        { t: "ex", diff: "hard",
          en: "Move the cache to Redis via IDistributedCache and run two app instances. Prove that invalidating a key on one instance is seen by the other, which an in-process cache would fail.",
          ar: "انقل الـ cache إلى Redis عبر IDistributedCache وشغّل نسختي تطبيق. أثبت أن إبطال مفتاح على نسخة تراه الأخرى، وهو ما يفشل فيه in-process cache." },
        { t: "ex", diff: "senior",
          en: "Wrap one cached entity in a single component owning its key, TTL, and invalidation, and expose a hit ratio metric. Prove it by making a write elsewhere impossible to forget the invalidation, and reading the ratio under load.",
          ar: "لُفّ كياناً مخزّناً واحداً في مكوّن وحيد يملك مفتاحه وTTL-ه وinvalidation-ه، واعرض مقياس hit ratio. أثبت ذلك بجعل نسيان الـ invalidation في كتابة أخرى مستحيلاً، وقراءة النسبة تحت الحمل." }
      ]
    },
    {
      key: "refs",
      blocks: [
        { t: "ref", label: { en: "Cache in-memory in ASP.NET Core (IMemoryCache)", ar: "التخزين في الذاكرة في ASP.NET Core (IMemoryCache)" }, url: "https://learn.microsoft.com/en-us/aspnet/core/performance/caching/memory", meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref", label: { en: "Distributed caching in ASP.NET Core (IDistributedCache)", ar: "التخزين الموزّع في ASP.NET Core (IDistributedCache)" }, url: "https://learn.microsoft.com/en-us/aspnet/core/performance/caching/distributed", meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref", label: { en: "Cache-Aside pattern (Azure Architecture Center)", ar: "نمط Cache-Aside (Azure Architecture Center)" }, url: "https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside", meta: { en: "Pattern", ar: "نمط" } },
        { t: "ref", label: { en: "Redis key eviction and maxmemory policies", ar: "طرد المفاتيح وسياسات maxmemory في Redis" }, url: "https://redis.io/docs/latest/develop/reference/eviction/", meta: { en: "Docs", ar: "توثيق" } }
      ]
    }
  ],
  quiz: [
    {
      q: { en: "In the cache-aside pattern, when is the database read?", ar: "في نمط cache-aside، متى تُقرأ الـ database؟" },
      options: [
        { en: "On every request, before the cache", ar: "في كل request، قبل الـ cache" },
        { en: "Only on a cache miss", ar: "فقط عند cache miss" },
        { en: "Only on writes", ar: "فقط عند الكتابة" },
        { en: "Never, once the cache is warm", ar: "أبداً، بمجرد أن يسخن الـ cache" }
      ],
      correct: 1,
      why: { en: "Cache-aside checks the cache first and only falls back to the database when the entry is missing, then stores the result for next time.", ar: "يفحص cache-aside الـ cache أولاً ولا يرجع إلى الـ database إلا عند غياب العنصر، ثم يخزّن النتيجة للمرة القادمة." }
    },
    {
      q: { en: "Why can an in-process cache serve stale data after an admin clears it?", ar: "لماذا قد يخدم in-process cache بيانات قديمة بعد أن يمسحه مسؤول؟" },
      options: [
        { en: "Because clearing a cache is asynchronous", ar: "لأن مسح الـ cache غير متزامن" },
        { en: "Because the TTL overrides manual clears", ar: "لأن الـ TTL تتجاوز المسح اليدوي" },
        { en: "Because each instance has its own copy and only one got cleared", ar: "لأن لكل نسخة نسختها الخاصة ومُسحت واحدة فقط" },
        { en: "Because in-process caches ignore invalidation", ar: "لأن الـ in-process caches تتجاهل الـ invalidation" }
      ],
      correct: 2,
      why: { en: "An in-process cache lives inside one instance's memory. With several instances behind a load balancer, a clear only affects the instance that handled the request.", ar: "الـ in-process cache يعيش في ذاكرة نسخة واحدة. مع عدة نسخ خلف load balancer، يؤثّر المسح فقط على النسخة التي عالجت الـ request." }
    },
    {
      q: { en: "What is the main reason to combine a TTL with explicit invalidation?", ar: "ما السبب الرئيسي لدمج TTL مع invalidation صريح؟" },
      options: [
        { en: "TTL makes reads faster than invalidation", ar: "الـ TTL تجعل القراءات أسرع من الـ invalidation" },
        { en: "Invalidation keeps data correct; TTL is a safety net for anything you miss", ar: "الـ invalidation يبقي البيانات صحيحة؛ والـ TTL شبكة أمان لما يفوتك" },
        { en: "They are the same mechanism with different names", ar: "هما آلية واحدة باسمين مختلفين" },
        { en: "TTL is required for a cache hit to work", ar: "الـ TTL شرط لعمل الـ cache hit" }
      ],
      correct: 1,
      why: { en: "Invalidation on write gives correctness the moment data changes, while a TTL bounds how stale a forgotten or missed key can ever get.", ar: "الـ invalidation عند الكتابة يعطي الصحة لحظة تغيّر البيانات، بينما الـ TTL تحدّ كم يمكن لمفتاح منسيّ أو فائت أن يصبح قديماً." }
    },
    {
      q: { en: "Which workload benefits least from caching?", ar: "أي حمل يستفيد أقل من الـ caching؟" },
      options: [
        { en: "Data read thousands of times per change", ar: "بيانات تُقرأ آلاف المرات لكل تغيير" },
        { en: "A product catalog updated once a week", ar: "كتالوج منتجات يُحدّث مرة في الأسبوع" },
        { en: "Data that changes on almost every read", ar: "بيانات تتغيّر في كل قراءة تقريباً" },
        { en: "Permission lookups repeated on every request", ar: "عمليات بحث صلاحيات تتكرّر في كل request" }
      ],
      correct: 2,
      why: { en: "Caching pays off when reads greatly outnumber writes. If data changes on nearly every read, the cached copy is stale immediately and adds cost with no hit benefit.", ar: "يجدي الـ caching عندما تفوق القراءات الكتابات بكثير. إذا تغيّرت البيانات في كل قراءة تقريباً، فالنسخة المخزّنة قديمة فوراً وتضيف تكلفة بلا فائدة hit." }
    },
    {
      q: { en: "What is the trade-off of a distributed cache versus an in-process one?", ar: "ما مقايضة الـ distributed cache مقابل الـ in-process؟" },
      options: [
        { en: "It is faster per read but not shared", ar: "أسرع لكل قراءة لكنه غير مشترك" },
        { en: "It is shared across instances but adds a network hop per read", ar: "مشترك عبر النسخ لكنه يضيف قفزة شبكة لكل قراءة" },
        { en: "It never needs invalidation", ar: "لا يحتاج invalidation أبداً" },
        { en: "It removes the need for a database", ar: "يلغي الحاجة إلى database" }
      ],
      correct: 1,
      why: { en: "A distributed cache like Redis is shared so all instances agree and survive restarts, but reaching it costs a network round trip and serialization, unlike a local in-process read.", ar: "الـ distributed cache مثل Redis مشترك فتتّفق كل النسخ وتبقى بعد إعادة التشغيل، لكن الوصول إليه يكلّف رحلة شبكة وserialization، بخلاف القراءة المحلية in-process." }
    }
  ]
};
```

NEXT: stampede
