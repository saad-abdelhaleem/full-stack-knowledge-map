```js
const stampedeLesson = {
  id: "stampede",
  moduleId: "performance",
  title: { en: "Stampedes and stale-while-revalidate", ar: "الـ stampede و stale-while-revalidate" },
  summary: {
    en: "When a hot cache key expires, thousands of requests miss it at the same instant and all rebuild the same value at once — this is how to stop that from crushing your backend.",
    ar: "عندما تنتهي صلاحية cache key مطلوب، آلاف الـ requests تفشل في إيجاده في نفس اللحظة وتعيد بناء نفس القيمة معاً — هنا نتعلّم كيف نمنع ذلك من إسقاط الـ backend."
  },
  mins: 14,
  sections: [
    {
      key: "why",
      blocks: [
        { t: "p",
          en: "A cache stampede happens when one popular cached value expires and, in the same moment, many requests all miss the cache and all rebuild that value at once. They usually rebuild it by hitting the same database. So the backend you added the cache to protect gets hit hardest at the worst possible time.",
          ar: "الـ cache stampede يحدث عندما تنتهي صلاحية قيمة واحدة مطلوبة في الـ cache، وفي نفس اللحظة عدد كبير من الـ requests لا يجدها كلها معاً وتعيد بناءها كلها دفعة واحدة. عادة تعيد بناءها بالضغط على نفس الـ database. فالـ backend الذي أضفت الـ cache لحمايته يُضرب بأقصى قوة في أسوأ وقت." },
        { t: "kv", rows: [
          { k: { en: "Cache stampede", ar: "Cache stampede" }, v: { en: "Many requests recompute the same expired value at the same time, overloading the source behind the cache.", ar: "عدد كبير من الـ requests يعيد حساب نفس القيمة المنتهية في نفس الوقت، فيحمّل المصدر خلف الـ cache فوق طاقته." } },
          { k: { en: "Thundering herd", ar: "Thundering herd" }, v: { en: "The general name for many clients waking up and hitting one resource at the same instant.", ar: "الاسم العام لعدد كبير من الـ clients يستيقظ ويضرب مورداً واحداً في نفس اللحظة." } },
          { k: { en: "TTL (time to live)", ar: "TTL (time to live)" }, v: { en: "How long a cached value stays valid before the cache treats it as expired.", ar: "كم يبقى العنصر في الـ cache صالحاً قبل أن يعتبره الـ cache منتهياً." } },
          { k: { en: "Cache-aside", ar: "Cache-aside" }, v: { en: "The app checks the cache; on a miss it loads from the source and stores the result before returning it.", ar: "التطبيق يفحص الـ cache؛ عند عدم وجود القيمة يحمّلها من المصدر ويخزّنها قبل إرجاعها." } },
          { k: { en: "Single-flight", ar: "Single-flight" }, v: { en: "Only one request does the rebuild; every other request for the same key waits for that one result.", ar: "request واحد فقط يقوم بإعادة البناء؛ وكل request آخر لنفس الـ key ينتظر تلك النتيجة." } },
          { k: { en: "Stale-while-revalidate", ar: "Stale-while-revalidate" }, v: { en: "Serve the old (stale) value right now, and refresh it in the background for the next caller.", ar: "أعطِ القيمة القديمة (stale) الآن، وحدّثها في الخلفية من أجل الطالب التالي." } }
        ]},
        { t: "p",
          en: "Think of a highway toll gate. Normally cars pass one at a time and nobody waits. But if the gate closes for a second and then opens, every car that arrived in that second surges through together. The cache TTL is that closed second: when it ends, all the traffic that was quietly being served from cache slams into the database at once.",
          ar: "تخيّل بوابة رسوم على طريق سريع. عادة تمرّ السيارات واحدة تلو الأخرى ولا ينتظر أحد. لكن لو أُغلقت البوابة لثانية ثم فُتحت، كل سيارة وصلت في تلك الثانية تندفع معاً. الـ TTL هو تلك الثانية المغلقة: عندما تنتهي، كل الحركة التي كانت تُخدَم بهدوء من الـ cache تصطدم بالـ database دفعة واحدة." },
        { t: "p",
          en: "Our running example through this lesson: an endpoint GET /products/{id} that returns a product page. Rendering it costs one heavy database query plus some formatting, about 200 ms. We cache the result in Redis (an in-memory key/value store used as a shared cache) with a 60-second TTL. At 5,000 requests per second for a hot product, the cache serves almost everything — until the key expires.",
          ar: "المثال الجاري في هذا الدرس: endpoint اسمه GET /products/{id} يعيد صفحة منتج. بناؤه يكلّف query ثقيلاً على الـ database مع بعض التنسيق، حوالي 200 ms. نخزّن النتيجة في Redis (مخزن key/value في الذاكرة يُستخدم كـ cache مشترك) بـ TTL مدته 60 ثانية. عند 5000 request في الثانية لمنتج مطلوب، الـ cache يخدم كل شيء تقريباً — إلى أن تنتهي صلاحية الـ key." },
        { t: "callout", kind: "note",
          en: "A stampede is not a bug in your cache. The cache is working exactly as told. The problem is that expiry is a single instant shared by every request, so every request misses together.",
          ar: "الـ stampede ليس خطأً في الـ cache. الـ cache يعمل تماماً كما أُمر. المشكلة أن انتهاء الصلاحية لحظة واحدة يشترك فيها كل الـ requests، فيفشل الجميع في الإيجاد معاً." }
      ]
    },
    {
      key: "problem",
      blocks: [
        { t: "p",
          en: "Before: while the key is warm, all 5,000 requests per second read from Redis. Each read takes under 1 ms and never touches the database. The database sees roughly zero product-page queries. Everything is calm.",
          ar: "قبل الحدث: طالما الـ key دافئ، كل الـ 5000 request في الثانية تقرأ من Redis. كل قراءة تأخذ أقل من 1 ms ولا تلمس الـ database. الـ database يرى تقريباً صفر query لصفحة المنتج. كل شيء هادئ." },
        { t: "p",
          en: "After expiry: the key is gone. The next request misses, starts the 200 ms rebuild, and stores the result. But 200 ms at 5,000 requests per second is 1,000 requests that all arrive before the first rebuild finishes and stores its value. All 1,000 miss too. All 1,000 run the same heavy query. The database jumps from near-zero to 1,000 identical concurrent queries in 200 ms.",
          ar: "بعد انتهاء الصلاحية: الـ key اختفى. أول request يفشل في الإيجاد، يبدأ إعادة البناء التي تستغرق 200 ms، ثم يخزّن النتيجة. لكن 200 ms عند 5000 request في الثانية يعني 1000 request تصل كلها قبل أن ينتهي أول إعادة بناء ويخزّن قيمته. الـ 1000 تفشل كلها أيضاً. الـ 1000 تشغّل نفس الـ query الثقيل. الـ database يقفز من قرب الصفر إلى 1000 query متطابقة ومتزامنة خلال 200 ms." },
        { t: "kv", rows: [
          { k: { en: "DB queries/sec, key warm", ar: "queries/sec والـ key دافئ" }, v: { en: "~0 — every read is served by Redis.", ar: "~0 — كل قراءة يخدمها Redis." } },
          { k: { en: "DB queries in the miss window", ar: "queries في نافذة الـ miss" }, v: { en: "~1,000 identical queries in 200 ms, all rebuilding the same page.", ar: "~1000 query متطابق في 200 ms، كلها تعيد بناء نفس الصفحة." } },
          { k: { en: "Effect on the database", ar: "الأثر على الـ database" }, v: { en: "CPU spikes to 100%, each query slows down, so each rebuild takes longer, so even more requests pile in.", ar: "الـ CPU يقفز إلى 100%، كل query يبطؤ، فتطول كل إعادة بناء، فتتراكم requests أكثر." } },
          { k: { en: "Effect on users", ar: "الأثر على المستخدمين" }, v: { en: "p99 latency (the slowest 1 in 100 requests) jumps from 2 ms to several seconds every 60 seconds.", ar: "زمن p99 (أبطأ request من كل 100) يقفز من 2 ms إلى عدة ثوانٍ كل 60 ثانية." } }
        ]},
        { t: "callout", kind: "warn",
          en: "The stampede repeats on a schedule. Every time the TTL ends, the spike returns. A latency graph shows a clean sawtooth: flat, then a spike, then flat, then a spike — one tooth per TTL.",
          ar: "الـ stampede يتكرّر على جدول. في كل مرة ينتهي الـ TTL يعود الارتفاع. رسم زمن الاستجابة يظهر شكل منشار واضح: مسطّح ثم قفزة ثم مسطّح ثم قفزة — سنّ واحدة لكل TTL." }
      ]
    },
    {
      key: "internals",
      blocks: [
        { t: "p",
          en: "Trace one expiry step by step. The plain cache-aside code has a gap: between checking the cache and writing the new value, there is no coordination, so every request that lands in that gap does the full rebuild independently.",
          ar: "لنتتبّع انتهاء صلاحية واحد خطوة بخطوة. كود cache-aside البسيط فيه فجوة: بين فحص الـ cache وكتابة القيمة الجديدة لا يوجد تنسيق، فكل request يقع في تلك الفجوة يقوم بإعادة البناء كاملة بشكل مستقل." },
        { t: "code", lang: "csharp", label: { en: "Plain cache-aside — vulnerable to stampede", ar: "cache-aside بسيط — معرّض للـ stampede" }, code:
`public async Task<Product> GetProductAsync(int id)
{
    var key = "product:" + id;

    var cached = await _cache.GetStringAsync(key);
    if (cached is not null)                 // hit: return fast
        return Deserialize(cached);

    // miss: nothing stops 1,000 requests reaching here at once
    var product = await _db.LoadProductAsync(id);   // the heavy 200 ms query
    await _cache.SetStringAsync(key, Serialize(product),
        new() { AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(60) });
    return product;
}`
        },
        { t: "p",
          en: "The first fix is single-flight: let only one request rebuild the value, and make the others wait for it instead of starting their own rebuild. In one process you do this with a lock keyed by the cache key. The winner runs the query; the rest block, then read the value the winner just stored.",
          ar: "الحل الأول هو single-flight: اسمح لـ request واحد فقط بإعادة بناء القيمة، واجعل البقية تنتظره بدل أن تبدأ إعادة بناء خاصة بها. داخل process واحد تفعل ذلك بقفل مفتاحه هو الـ cache key. الفائز يشغّل الـ query؛ والبقية تتوقف ثم تقرأ القيمة التي خزّنها الفائز للتو." },
        { t: "code", lang: "csharp", label: { en: "Single-flight with a per-key lock", ar: "single-flight بقفل لكل key" }, code:
`// SemaphoreSlim(1,1): a lock that lets exactly one caller in at a time.
private static readonly ConcurrentDictionary<string, SemaphoreSlim> _locks = new();

public async Task<Product> GetProductAsync(int id)
{
    var key = "product:" + id;

    var cached = await _cache.GetStringAsync(key);
    if (cached is not null) return Deserialize(cached);

    var gate = _locks.GetOrAdd(key, _ => new SemaphoreSlim(1, 1));
    await gate.WaitAsync();
    try
    {
        // second check: the winner may have filled the cache while we waited
        cached = await _cache.GetStringAsync(key);
        if (cached is not null) return Deserialize(cached);

        var product = await _db.LoadProductAsync(id);   // runs once, not 1,000 times
        await _cache.SetStringAsync(key, Serialize(product),
            new() { AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(60) });
        return product;
    }
    finally { gate.Release(); }
}`
        },
        { t: "p",
          en: "The double check matters. After a request waits and gets into the lock, it checks the cache again. The winner already stored the value, so the waiters find a hit and skip the query entirely. Now the database sees one query per expiry, not a thousand.",
          ar: "الفحص المزدوج مهم. بعد أن ينتظر الـ request ويدخل القفل، يفحص الـ cache مرة أخرى. الفائز خزّن القيمة أصلاً، فيجد المنتظرون القيمة موجودة ويتخطّون الـ query تماماً. الآن الـ database يرى query واحداً لكل انتهاء صلاحية بدل ألف." },
        { t: "p",
          en: "A per-process lock only coordinates requests inside one server. With ten servers behind a load balancer you still get up to ten rebuilds per expiry — much better than a thousand, but not one. The second idea, stale-while-revalidate, fixes this from a different angle: never let the value fully disappear.",
          ar: "القفل لكل process ينسّق فقط الـ requests داخل server واحد. مع عشرة servers خلف load balancer تحصل على ما يصل إلى عشر عمليات إعادة بناء لكل انتهاء صلاحية — أفضل بكثير من ألف، لكنها ليست واحدة. الفكرة الثانية، stale-while-revalidate، تحلّها من زاوية أخرى: لا تدع القيمة تختفي تماماً أبداً." },
        { t: "p",
          en: "Stale-while-revalidate stores two timestamps with the value: a soft expiry and a hard expiry. Before the soft expiry, serve the value normally. Between soft and hard expiry, still serve the old value immediately, but kick off one background refresh so the next reader gets a fresh one. After the hard expiry the value is truly gone. The key never vanishes under live traffic, so no wave of requests ever finds an empty slot.",
          ar: "الـ stale-while-revalidate يخزّن وقتين مع القيمة: انتهاء ليّن (soft) وانتهاء صارم (hard). قبل الانتهاء الليّن، اخدم القيمة عادياً. بين الانتهاء الليّن والصارم، اخدم القيمة القديمة فوراً أيضاً، لكن ابدأ تحديثاً واحداً في الخلفية ليحصل القارئ التالي على قيمة جديدة. بعد الانتهاء الصارم تختفي القيمة فعلاً. الـ key لا يختفي تحت الحركة الحيّة، فلا تجد أي موجة requests خانة فارغة." },
        { t: "kv", rows: [
          { k: { en: "value", ar: "value" }, v: { en: "The cached data itself, e.g. the serialized product.", ar: "البيانات المخزّنة نفسها، مثل المنتج المسلسَل." } },
          { k: { en: "soft expiry", ar: "soft expiry" }, v: { en: "After this time the value is stale: still returned, but a background refresh should start.", ar: "بعد هذا الوقت القيمة stale: تُرجَع مع ذلك، لكن يجب أن يبدأ تحديث في الخلفية." } },
          { k: { en: "hard expiry", ar: "hard expiry" }, v: { en: "After this time the value is dropped for real and a fresh load is required.", ar: "بعد هذا الوقت تُحذف القيمة فعلاً ويلزم تحميل جديد." } },
          { k: { en: "refresh flag", ar: "refresh flag" }, v: { en: "A short lock so only one caller triggers the background refresh, not all of them.", ar: "قفل قصير حتى يشغّل التحديث في الخلفية طالب واحد فقط، لا الجميع." } }
        ]}
      ]
    },
    {
      key: "tradeoffs",
      blocks: [
        { t: "tradeoff",
          pros: { en: [
            "Single-flight collapses many rebuilds into one, protecting the database.",
            "Stale-while-revalidate keeps latency flat because readers never wait for a rebuild.",
            "Both need no schema change — they wrap the existing cache-aside code.",
            "The database load becomes predictable instead of a periodic spike."
          ], ar: [
            "single-flight يدمج عمليات إعادة بناء كثيرة في واحدة، فيحمي الـ database.",
            "stale-while-revalidate يبقي زمن الاستجابة مسطّحاً لأن القرّاء لا ينتظرون إعادة البناء.",
            "كلاهما لا يحتاج تغيير schema — يلتفّان حول كود cache-aside الموجود.",
            "حمل الـ database يصبح متوقّعاً بدل قفزة دورية."
          ]},
          cons: { en: [
            "Single-flight makes waiters block, so one slow rebuild delays everyone waiting on that key.",
            "Stale-while-revalidate serves data that is briefly out of date on purpose.",
            "A per-process lock does not coordinate across servers; you need a distributed lock for that.",
            "More moving parts: two timestamps, a background task, and a refresh flag to get right."
          ], ar: [
            "single-flight يجعل المنتظرين يتوقّفون، فإعادة بناء بطيئة واحدة تؤخّر كل من ينتظر ذلك الـ key.",
            "stale-while-revalidate يقدّم بيانات قديمة قليلاً عن قصد لفترة قصيرة.",
            "القفل لكل process لا ينسّق بين الـ servers؛ تحتاج distributed lock لذلك.",
            "أجزاء متحرّكة أكثر: وقتان، مهمة خلفية، وrefresh flag يجب ضبطها."
          ]},
          limits: { en: [
            "Neither helps if every key is unique per user — there is no shared value to coalesce.",
            "Stale data is unacceptable for some values (a bank balance, a stock count at checkout).",
            "A background refresh still uses a worker thread and a DB connection.",
            "If the source itself is down, there is nothing fresh to revalidate to."
          ], ar: [
            "لا ينفع أيّهما إذا كان كل key فريداً لكل مستخدم — لا توجد قيمة مشتركة لدمجها.",
            "البيانات الـ stale غير مقبولة لبعض القيم (رصيد بنكي، عدد مخزون عند الدفع).",
            "التحديث في الخلفية يستهلك مع ذلك worker thread وconnection للـ database.",
            "إذا كان المصدر نفسه معطّلاً، لا يوجد شيء جديد للتحديث إليه."
          ]},
          alts: { en: [
            "Probabilistic early expiry: each reader randomly refreshes a little before the TTL, spreading rebuilds out.",
            "A distributed lock in Redis (SET NX) so only one server rebuilds a key.",
            "Pre-warming: a scheduled job rebuilds hot keys before they expire.",
            "Longer TTL plus explicit invalidation when the underlying data changes."
          ], ar: [
            "انتهاء مبكر احتمالي: كل قارئ يحدّث عشوائياً قبل الـ TTL بقليل، فيوزّع عمليات إعادة البناء.",
            "distributed lock في Redis (SET NX) حتى يعيد server واحد فقط بناء الـ key.",
            "التسخين المسبق: مهمة مجدولة تعيد بناء الـ keys المطلوبة قبل انتهائها.",
            "TTL أطول مع إبطال صريح عند تغيّر البيانات الأساسية."
          ]}
        }
      ]
    },
    {
      key: "mistakes",
      blocks: [
        { t: "mistake",
          title: { en: "Giving every hot key the same fixed TTL", ar: "إعطاء كل key مطلوب نفس الـ TTL الثابت" },
          body: { en: "A team cached 50 popular products, all with a flat 60-second TTL, and warmed them all at deploy time. Sixty seconds later all 50 keys expired in the same second and stampeded together. The fix is to add a small random spread to each TTL so they do not line up.", ar: "فريق خزّن 50 منتجاً مطلوباً، كلها بـ TTL ثابت 60 ثانية، وسخّنها كلها وقت الـ deploy. بعد ستين ثانية انتهت الـ 50 key في نفس الثانية وعملت stampede معاً. الحل إضافة تشتيت عشوائي صغير لكل TTL حتى لا تتزامن." },
          fix:
`var ttl = TimeSpan.FromSeconds(60 + Random.Shared.Next(0, 15)); // 60-74s spread` },
        { t: "mistake",
          title: { en: "Locking on the wrong scope", ar: "القفل على نطاق خاطئ" },
          body: { en: "Someone wrapped the rebuild in a single global lock instead of a per-key lock. That stopped the stampede but serialized every product: a rebuild for product A blocked a rebuild for unrelated product B. Throughput collapsed. The lock must be keyed by the cache key so unrelated keys rebuild in parallel.", ar: "أحدهم وضع إعادة البناء داخل قفل عام واحد بدل قفل لكل key. ذلك أوقف الـ stampede لكنه سلسل كل منتج: إعادة بناء المنتج A أوقفت إعادة بناء المنتج B غير المرتبط. انهار الـ throughput. يجب أن يكون مفتاح القفل هو الـ cache key حتى تُعاد الـ keys غير المرتبطة بالتوازي." } },
        { t: "mistake",
          title: { en: "Forgetting the double check inside the lock", ar: "نسيان الفحص المزدوج داخل القفل" },
          body: { en: "A single-flight version acquired the lock but never re-read the cache after waiting. Every waiter fell through and ran the query anyway, one after another, so the database still saw a query per request — just spread out over time instead of at once. Always re-check the cache after taking the lock.", ar: "نسخة single-flight أخذت القفل لكنها لم تُعِد قراءة الـ cache بعد الانتظار. كل منتظر تجاوز وشغّل الـ query على أي حال، واحداً تلو الآخر، فرأى الـ database query لكل request — لكن موزّعاً عبر الزمن بدل دفعة واحدة. أعد فحص الـ cache دائماً بعد أخذ القفل." },
          fix:
`await gate.WaitAsync();
try {
    cached = await _cache.GetStringAsync(key); // re-check!
    if (cached is not null) return Deserialize(cached);
    // ... only now rebuild
}` },
        { t: "mistake",
          title: { en: "Caching failures with the same TTL as success", ar: "تخزين الأخطاء بنفس TTL النجاح" },
          body: { en: "When the database timed out, the code cached the empty result for the full 60 seconds. Users saw a broken page for a minute even after the database recovered. And when many requests all hit the timeout, they all cached the failure — a negative stampede. Cache failures for only a second or two, or not at all.", ar: "عندما انتهت مهلة الـ database، خزّن الكود النتيجة الفارغة كامل الـ 60 ثانية. رأى المستخدمون صفحة مكسورة لدقيقة حتى بعد تعافي الـ database. وعندما ضربت مهلة الانتظار requests كثيرة، خزّنت كلها الفشل — stampede سلبي. خزّن الأخطاء لثانية أو ثانيتين فقط، أو لا تخزّنها أبداً." } }
      ]
    },
    {
      key: "interview",
      blocks: [
        { t: "qa", level: "junior",
          q: { en: "What is a cache stampede?", ar: "ما هو الـ cache stampede؟" },
          a: { en: "It is when a popular cached value expires and a lot of requests all miss the cache at the same moment, so they all rebuild the same value at once and overload the database behind the cache. The cache is meant to protect the database, but at the instant of expiry it does the opposite.", ar: "هو أن تنتهي صلاحية قيمة مطلوبة في الـ cache فتفشل requests كثيرة في إيجادها في نفس اللحظة، فتعيد كلها بناء نفس القيمة دفعة واحدة وتحمّل الـ database خلف الـ cache فوق طاقته. الـ cache يفترض أن يحمي الـ database، لكنه لحظة الانتهاء يفعل العكس." } },
        { t: "qa", level: "mid",
          q: { en: "How does single-flight stop a stampede?", ar: "كيف يوقف single-flight الـ stampede؟" },
          a: { en: "You put a lock keyed by the cache key. When the value is missing, the first request takes the lock and rebuilds it; every other request for that key waits on the same lock. After the winner stores the value, the waiters re-check the cache, find a hit, and skip the query. So the database sees one rebuild per expiry instead of one per request.", ar: "تضع قفلاً مفتاحه هو الـ cache key. عند غياب القيمة، أول request يأخذ القفل ويعيد بناءها؛ وكل request آخر لذلك الـ key ينتظر على نفس القفل. بعد أن يخزّن الفائز القيمة، يعيد المنتظرون فحص الـ cache، فيجدونها ويتخطّون الـ query. فيرى الـ database إعادة بناء واحدة لكل انتهاء بدل واحدة لكل request." } },
        { t: "qa", level: "mid",
          q: { en: "What does stale-while-revalidate trade away?", ar: "ماذا يضحّي به stale-while-revalidate؟" },
          a: { en: "Freshness, for a short window. It serves the old value immediately and refreshes in the background, so readers never wait, but for a moment they see slightly out-of-date data. That is fine for a product page or a feed, but not for something that must be exact at read time, like an account balance during checkout.", ar: "الحداثة، لنافذة قصيرة. يقدّم القيمة القديمة فوراً ويحدّث في الخلفية، فلا ينتظر القرّاء، لكنهم للحظة يرون بيانات قديمة قليلاً. هذا مقبول لصفحة منتج أو feed، لكنه غير مقبول لشيء يجب أن يكون دقيقاً وقت القراءة، مثل رصيد حساب أثناء الدفع." } },
        { t: "qa", level: "senior",
          q: { en: "A per-process lock leaves you with one rebuild per server. How do you get to one rebuild total?", ar: "القفل لكل process يترك لك إعادة بناء واحدة لكل server. كيف تصل إلى إعادة بناء واحدة إجمالاً؟" },
          a: { en: "Use a distributed lock in a shared store. In Redis you do SET lock:key value NX PX 5000 — NX means set only if it does not already exist, so exactly one server across the fleet wins. The winner rebuilds and fills the cache; the others poll the cache briefly or fall back to the stale value. You keep the lock TTL short so a crashed winner cannot block rebuilds forever.", ar: "استخدم distributed lock في مخزن مشترك. في Redis تنفّذ SET lock:key value NX PX 5000 — الـ NX تعني اضبط فقط إن لم يكن موجوداً، فيفوز server واحد فقط عبر الأسطول. الفائز يعيد البناء ويملأ الـ cache؛ والبقية تفحص الـ cache لفترة قصيرة أو ترجع إلى القيمة الـ stale. تُبقي TTL القفل قصيراً حتى لا يمنع فائز تعطّل عمليات إعادة البناء للأبد." } },
        { t: "qa", level: "senior",
          q: { en: "What is probabilistic early expiry and why use it?", ar: "ما هو الانتهاء المبكر الاحتمالي ولماذا نستخدمه؟" },
          a: { en: "Instead of everyone treating the key as valid until the exact TTL, each reader has a small random chance of refreshing it a bit early — the chance grows as the value nears expiry. This spreads rebuilds across time so no single instant carries all of them. It needs no lock and no background task, which makes it cheap, but it does cause a few early refreshes.", ar: "بدل أن يعامل الجميع الـ key كصالح حتى الـ TTL بالضبط، لكل قارئ احتمال عشوائي صغير لتحديثه مبكراً قليلاً — والاحتمال يكبر كلما اقتربت القيمة من الانتهاء. هذا يوزّع عمليات إعادة البناء عبر الزمن فلا تحمل لحظة واحدة كلها. لا يحتاج قفلاً ولا مهمة خلفية، فهو رخيص، لكنه يسبّب بضع عمليات تحديث مبكرة." } },
        { t: "qa", level: "staff",
          q: { en: "Stampedes keep recurring across teams. What organizational fix would you push?", ar: "الـ stampede يتكرّر عبر الفرق. أي حل تنظيمي تدفع باتجاهه؟" },
          a: { en: "Make the safe pattern the default, not something each team reinvents. Ship a shared caching library that does single-flight and stale-while-revalidate with jittered TTLs out of the box, so a plain GetOrCreate call is already stampede-safe. Pair it with a dashboard that alerts on the sawtooth latency signature. The goal is that no one has to remember to handle stampedes; the platform handles it for them.", ar: "اجعل النمط الآمن هو الافتراضي، لا شيئاً يعيد كل فريق اختراعه. أطلق مكتبة caching مشتركة تنفّذ single-flight وstale-while-revalidate مع TTL مشتّت جاهزاً، فيكون نداء GetOrCreate بسيط آمناً من الـ stampede أصلاً. اقرنها بلوحة تنبّه على توقيع زمن الاستجابة المنشاري. الهدف أن لا يحتاج أحد لتذكّر معالجة الـ stampede؛ المنصة تعالجه نيابة عنه." } }
      ]
    },
    {
      key: "codereview",
      blocks: [
        { t: "review", severity: "high",
          title: { en: "Rebuild with no coordination on a hot key", ar: "إعادة بناء بلا تنسيق على key مطلوب" },
          bad:
`var cached = await _cache.GetStringAsync(key);
if (cached is not null) return Deserialize(cached);
var product = await _db.LoadProductAsync(id); // every misser runs this
await _cache.SetStringAsync(key, Serialize(product), opts);
return product;`,
          good:
`var cached = await _cache.GetStringAsync(key);
if (cached is not null) return Deserialize(cached);
var gate = _locks.GetOrAdd(key, _ => new SemaphoreSlim(1, 1));
await gate.WaitAsync();
try {
    cached = await _cache.GetStringAsync(key);       // re-check under lock
    if (cached is not null) return Deserialize(cached);
    var product = await _db.LoadProductAsync(id);    // now runs once
    await _cache.SetStringAsync(key, Serialize(product), opts);
    return product;
} finally { gate.Release(); }`,
          why: { en: "The bad version lets every request that misses in the rebuild window run the heavy query. On a hot key that is hundreds of identical queries per expiry. The good version serializes rebuilds per key with a double check, so only one query runs.", ar: "النسخة السيئة تدع كل request يفشل في نافذة إعادة البناء يشغّل الـ query الثقيل. على key مطلوب هذا مئات الـ queries المتطابقة لكل انتهاء. النسخة الجيدة تسلسل إعادة البناء لكل key مع فحص مزدوج، فيعمل query واحد فقط." } },
        { t: "review", severity: "medium",
          title: { en: "Fixed TTL with no jitter", ar: "TTL ثابت بلا jitter" },
          bad:
`AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(60)`,
          good:
`AbsoluteExpirationRelativeToNow =
    TimeSpan.FromSeconds(60 + Random.Shared.Next(0, 15))`,
          why: { en: "A fixed TTL makes many keys created together expire together, so their stampedes stack on the same second. A small random spread (here up to 15 extra seconds) desynchronizes expiries so the load smooths out.", ar: "الـ TTL الثابت يجعل keys كثيرة أُنشئت معاً تنتهي معاً، فتتراكم عمليات الـ stampede على نفس الثانية. تشتيت عشوائي صغير (هنا حتى 15 ثانية إضافية) يفكّ تزامن الانتهاء فيتنعّم الحمل." } }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        { t: "p",
          en: "Stampede protection belongs at every layer that caches a shared value with a TTL, not just your app's Redis layer. A CDN in front of your API, a read-through cache in a data service, and an in-process memory cache all have the same expiry-instant problem and all need the same defenses.",
          ar: "الحماية من الـ stampede تخصّ كل طبقة تخزّن قيمة مشتركة بـ TTL، لا طبقة Redis في تطبيقك فقط. الـ CDN أمام الـ API، والـ read-through cache في خدمة بيانات، والـ memory cache داخل الـ process، كلها تعاني نفس مشكلة لحظة الانتهاء وكلها تحتاج نفس الدفاعات." },
        { t: "ul",
          en: [
            "CDN edge: many CDNs support stale-while-revalidate directly in Cache-Control, so the edge serves stale content while it revalidates one copy from your origin.",
            "Distributed cache (Redis): use a distributed lock (SET NX) or stale-while-revalidate stored with soft/hard expiries so the fleet rebuilds a key once.",
            "In-process cache: .NET's HybridCache and libraries like FusionCache do single-flight and jitter for you; prefer them over hand-rolled dictionaries of locks.",
            "Pre-warming: for a known-hot key (a homepage, a launch product), a scheduled job refreshes it before expiry so live traffic never sees a miss."
          ],
          ar: [
            "حافة الـ CDN: كثير من الـ CDNs يدعم stale-while-revalidate مباشرة في Cache-Control، فتخدم الحافة محتوى stale بينما تعيد التحقق من نسخة واحدة من الأصل.",
            "الـ distributed cache (Redis): استخدم distributed lock (SET NX) أو stale-while-revalidate مخزّناً بانتهاء soft/hard حتى يعيد الأسطول بناء الـ key مرة واحدة.",
            "الـ in-process cache: الـ HybridCache في .NET ومكتبات مثل FusionCache تنفّذ single-flight وjitter نيابة عنك؛ فضّلها على قواميس أقفال يدوية.",
            "التسخين المسبق: لـ key معروف الطلب (صفحة رئيسية، منتج إطلاق)، مهمة مجدولة تحدّثه قبل الانتهاء فلا ترى الحركة الحيّة miss أبداً."
          ]
        },
        { t: "callout", kind: "tip",
          en: "Reach for a battle-tested library (HybridCache, FusionCache) before writing your own lock dictionary. Getting the lock lifetime, cleanup, and double check right by hand is easy to get subtly wrong.",
          ar: "استخدم مكتبة مجرّبة (HybridCache، FusionCache) قبل كتابة قاموس أقفال خاص بك. ضبط عمر القفل وتنظيفه والفحص المزدوج يدوياً سهل أن يُخطأ فيه بشكل خفي." }
      ]
    },
    {
      key: "perf",
      blocks: [
        { t: "kv", rows: [
          { k: { en: "Database", ar: "Database" }, v: { en: "The whole point: cut concurrent identical queries per expiry from ~1,000 down to 1. This is the biggest win.", ar: "الهدف كله: خفض الـ queries المتطابقة المتزامنة لكل انتهاء من ~1000 إلى 1. هذا أكبر مكسب." } },
          { k: { en: "Latency", ar: "Latency" }, v: { en: "Stale-while-revalidate keeps p99 flat because readers never block on a rebuild; single-flight makes waiters block briefly.", ar: "stale-while-revalidate يبقي p99 مسطّحاً لأن القرّاء لا يتوقّفون على إعادة البناء؛ single-flight يجعل المنتظرين يتوقّفون قليلاً." } },
          { k: { en: "CPU", ar: "CPU" }, v: { en: "Fewer rebuilds means less serialization and query work; the periodic CPU spike on the DB flattens out.", ar: "إعادة بناء أقل تعني تسلسلاً وعمل query أقل؛ قفزة الـ CPU الدورية على الـ database تنبسط." } },
          { k: { en: "Memory", ar: "Memory" }, v: { en: "Per-key SemaphoreSlim objects add up; remove idle locks or use a library that pools them.", ar: "كائنات SemaphoreSlim لكل key تتراكم؛ احذف الأقفال الخاملة أو استخدم مكتبة تجمّعها." } },
          { k: { en: "Scalability", ar: "Scalability" }, v: { en: "A per-process lock scales rebuilds with server count; a distributed lock keeps it at one regardless of fleet size.", ar: "القفل لكل process يجعل إعادة البناء تتناسب مع عدد الـ servers؛ الـ distributed lock يبقيها واحدة مهما كبر الأسطول." } }
        ]}
      ]
    },
    {
      key: "debug",
      blocks: [
        { t: "ul",
          en: [
            "Latency dashboard (p99 over time): look for a sawtooth — a spike at a fixed interval that matches your TTL is a stampede fingerprint.",
            "Database monitor (active queries): watch for bursts of many identical queries starting within milliseconds of each other.",
            "Redis MONITOR or slowlog: confirm the key is actually missing (GET returns nil) right before each query burst.",
            "Cache hit-ratio metric: a periodic dip to near zero on one key, lined up with the latency spikes, points straight at expiry.",
            "Application logs with the cache key: count how many rebuild-start log lines fire per expiry window; more than one means the coordination is not working."
          ],
          ar: [
            "لوحة الـ latency (p99 عبر الزمن): ابحث عن شكل منشار — قفزة على فترة ثابتة تطابق الـ TTL هي بصمة stampede.",
            "مراقب الـ database (الـ queries النشطة): راقب دفعات من queries متطابقة كثيرة تبدأ خلال ميلي ثوانٍ من بعضها.",
            "Redis MONITOR أو slowlog: أكّد أن الـ key مفقود فعلاً (GET يعيد nil) قبيل كل دفعة queries.",
            "مقياس نسبة إصابة الـ cache: هبوط دوري إلى قرب الصفر على key واحد، متزامن مع قفزات الـ latency، يشير مباشرة إلى الانتهاء.",
            "سجلّات التطبيق مع الـ cache key: عُدّ كم سطر بدء إعادة بناء يُطبع في نافذة الانتهاء الواحدة؛ أكثر من واحد يعني أن التنسيق لا يعمل."
          ]
        },
        { t: "callout", kind: "tip",
          en: "Reproduce it before you fix it. Point a load generator at one hot key at steady load, then watch the DB active-query count as the TTL rolls over. The burst should appear on cue — and disappear once single-flight is in place.",
          ar: "أعد إنتاجه قبل إصلاحه. وجّه مولّد حمل نحو key مطلوب واحد بحمل ثابت، ثم راقب عدد الـ queries النشطة في الـ database عند تجاوز الـ TTL. يجب أن تظهر الدفعة في موعدها — وتختفي بمجرّد وجود single-flight." }
      ]
    },
    {
      key: "realworld",
      blocks: [
        { t: "p",
          en: "Any system with a small number of very popular items on top of a large catalog is exposed. The traffic concentrates on a few keys, so when one of those keys expires the miss is enormous. The pattern shows up wherever reads vastly outnumber writes and one value is shared by many users.",
          ar: "أي نظام فيه عدد صغير من العناصر شديدة الطلب فوق كتالوج كبير معرّض للخطر. الحركة تتركّز على عدد قليل من الـ keys، فعندما ينتهي أحدها يكون الـ miss ضخماً. النمط يظهر حيثما تفوق القراءات الكتابات بكثير وتُشارَك قيمة واحدة بين مستخدمين كثيرين." },
        { t: "ul",
          en: [
            "News and media sites: a breaking-story page cached for a minute; the moment it expires, a live audience of thousands all reload it.",
            "E-commerce during a sale: a single discounted product gets most of the traffic, so its cache key is the one that stampedes.",
            "Social feeds: a trending post's rendered view is one shared key hit by a huge concurrent audience.",
            "Config and feature-flag services: one settings blob read by every request; if it expires without coordination, every service instance reloads it at once."
          ],
          ar: [
            "مواقع الأخبار والإعلام: صفحة خبر عاجل مخزّنة لدقيقة؛ لحظة انتهائها، جمهور حيّ بالآلاف يعيد تحميلها كله.",
            "التجارة الإلكترونية أثناء تخفيض: منتج مخفّض واحد يأخذ معظم الحركة، فيكون cache key الخاص به هو من يعمل stampede.",
            "الـ feeds الاجتماعية: العرض المبني لمنشور رائج هو key مشترك واحد يضربه جمهور متزامن ضخم.",
            "خدمات الإعدادات وflag الميزات: كتلة إعدادات واحدة تقرؤها كل request؛ إن انتهت بلا تنسيق، أعادت كل نسخة خدمة تحميلها معاً."
          ]
        }
      ]
    },
    {
      key: "exercises",
      blocks: [
        { t: "ex", diff: "easy",
          en: "Take the plain cache-aside GetProductAsync and add jitter: change the fixed 60-second TTL to 60 plus a random 0-15 seconds. Cache 20 keys at startup and log each key's expiry time; prove no two share the same second.",
          ar: "خذ GetProductAsync البسيط وأضف jitter: غيّر الـ TTL الثابت 60 ثانية إلى 60 زائد 0-15 ثانية عشوائية. خزّن 20 key عند البدء وسجّل وقت انتهاء كل key؛ أثبت أن لا اثنين يشتركان في نفس الثانية." },
        { t: "ex", diff: "medium",
          en: "Add single-flight with a per-key SemaphoreSlim and a double check. Write a test that fires 500 concurrent GetProductAsync calls for one id against a fake DB that counts calls; assert the DB was called exactly once.",
          ar: "أضف single-flight بـ SemaphoreSlim لكل key وفحص مزدوج. اكتب اختباراً يطلق 500 نداء GetProductAsync متزامن لـ id واحد على DB وهمي يعدّ الاستدعاءات؛ تأكّد أن الـ DB استُدعي مرة واحدة بالضبط." },
        { t: "ex", diff: "hard",
          en: "Implement stale-while-revalidate: store the value with a soft and a hard expiry. Serve stale values immediately, trigger exactly one background refresh, and prove with a test that reads between soft and hard expiry never block and never trigger more than one refresh.",
          ar: "طبّق stale-while-revalidate: خزّن القيمة بانتهاء soft وhard. اخدم القيم الـ stale فوراً، وشغّل تحديثاً واحداً بالضبط في الخلفية، وأثبت باختبار أن القراءات بين الانتهاء الـ soft والـ hard لا تتوقّف أبداً ولا تشغّل أكثر من تحديث واحد." },
        { t: "ex", diff: "senior",
          en: "Replace the per-process lock with a distributed lock in Redis using SET NX PX. Run two instances of the app behind a load balancer, drive load at one hot key, and show the DB sees exactly one rebuild per expiry across both instances even when one instance is killed mid-rebuild.",
          ar: "استبدل القفل لكل process بـ distributed lock في Redis باستخدام SET NX PX. شغّل نسختين من التطبيق خلف load balancer، وجّه حملاً على key مطلوب واحد، وأظهر أن الـ DB يرى إعادة بناء واحدة بالضبط لكل انتهاء عبر النسختين حتى عند قتل نسخة أثناء إعادة البناء." }
      ]
    },
    {
      key: "refs",
      blocks: [
        { t: "ref", label: { en: "HybridCache in ASP.NET Core (built-in stampede protection)", ar: "HybridCache في ASP.NET Core (حماية مدمجة من الـ stampede)" }, url: "https://learn.microsoft.com/en-us/aspnet/core/performance/caching/hybrid", meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref", label: { en: "FusionCache — cache stampede prevention and fail-safe", ar: "FusionCache — منع الـ stampede وfail-safe" }, url: "https://github.com/ZiggyCreatures/FusionCache", meta: { en: "Library", ar: "مكتبة" } },
        { t: "ref", label: { en: "RFC 5861 — stale-while-revalidate Cache-Control extension", ar: "RFC 5861 — امتداد stale-while-revalidate في Cache-Control" }, url: "https://www.rfc-editor.org/rfc/rfc5861", meta: { en: "Spec", ar: "مواصفة" } },
        { t: "ref", label: { en: "Redis distributed locks (SET NX and Redlock)", ar: "الأقفال الموزّعة في Redis (SET NX وRedlock)" }, url: "https://redis.io/docs/latest/develop/use/patterns/distributed-locks/", meta: { en: "Docs", ar: "توثيق" } }
      ]
    }
  ],
  quiz: [
    {
      q: { en: "What triggers a cache stampede?", ar: "ما الذي يطلق الـ cache stampede؟" },
      options: [
        { en: "A hot key expires and many requests miss and rebuild it at the same moment.", ar: "key مطلوب ينتهي فتفشل requests كثيرة في إيجاده وتعيد بناءه في نفس اللحظة." },
        { en: "The cache server runs out of memory and evicts everything.", ar: "خادم الـ cache تنفد ذاكرته فيطرد كل شيء." },
        { en: "A client sends malformed requests in a loop.", ar: "عميل يرسل requests مشوّهة في حلقة." },
        { en: "The TTL is set too long so data goes stale.", ar: "الـ TTL طويل جداً فتصبح البيانات stale." }
      ],
      correct: 0,
      why: { en: "The defining cause is simultaneous misses on one shared key at the instant its TTL ends, so many requests rebuild the same value at once.", ar: "السبب المميّز هو فشل متزامن في إيجاد key مشترك لحظة انتهاء الـ TTL، فتعيد requests كثيرة بناء نفس القيمة معاً." }
    },
    {
      q: { en: "In single-flight, why must a waiter re-check the cache after taking the lock?", ar: "في single-flight، لماذا يجب أن يعيد المنتظر فحص الـ cache بعد أخذ القفل؟" },
      options: [
        { en: "To refresh the lock's timeout.", ar: "لتجديد مهلة القفل." },
        { en: "Because the winner already stored the value, so the waiter can return it and skip the query.", ar: "لأن الفائز خزّن القيمة أصلاً، فيمكن للمنتظر إرجاعها وتخطّي الـ query." },
        { en: "To make sure the lock was fair.", ar: "للتأكد أن القفل كان عادلاً." },
        { en: "Because the cache key may have changed.", ar: "لأن الـ cache key قد يكون تغيّر." }
      ],
      correct: 1,
      why: { en: "Without the re-check, each waiter falls through and runs the query anyway; the re-check lets waiters find the value the winner just stored.", ar: "بدون إعادة الفحص، كل منتظر يتجاوز ويشغّل الـ query على أي حال؛ إعادة الفحص تجعل المنتظرين يجدون القيمة التي خزّنها الفائز للتو." }
    },
    {
      q: { en: "What does stale-while-revalidate give up in exchange for flat latency?", ar: "ماذا يتنازل عنه stale-while-revalidate مقابل زمن استجابة مسطّح؟" },
      options: [
        { en: "Memory, because it stores two copies.", ar: "الذاكرة، لأنه يخزّن نسختين." },
        { en: "Nothing; it is strictly better.", ar: "لا شيء؛ إنه أفضل بإطلاق." },
        { en: "Strict freshness — it serves a slightly out-of-date value while it refreshes.", ar: "الحداثة الصارمة — يقدّم قيمة قديمة قليلاً بينما يحدّث." },
        { en: "Consistency of the lock across servers.", ar: "اتساق القفل عبر الـ servers." }
      ],
      correct: 2,
      why: { en: "It returns the stale value immediately and refreshes in the background, so readers never wait but may briefly see old data.", ar: "يعيد القيمة الـ stale فوراً ويحدّث في الخلفية، فلا ينتظر القرّاء لكنهم قد يرون بيانات قديمة للحظة." }
    },
    {
      q: { en: "Why add random jitter to a TTL?", ar: "لماذا نضيف jitter عشوائياً إلى الـ TTL؟" },
      options: [
        { en: "To make the cache use less memory.", ar: "لجعل الـ cache يستهلك ذاكرة أقل." },
        { en: "So keys created together do not all expire in the same second and stampede together.", ar: "حتى لا تنتهي الـ keys المنشأة معاً في نفس الثانية وتعمل stampede معاً." },
        { en: "To make debugging easier.", ar: "لتسهيل التنقيح." },
        { en: "To encrypt the cache key.", ar: "لتشفير الـ cache key." }
      ],
      correct: 1,
      why: { en: "A fixed TTL synchronizes expiries; a small random spread desynchronizes them so rebuild load is smeared across time.", ar: "الـ TTL الثابت يزامن الانتهاء؛ التشتيت العشوائي الصغير يفكّ التزامن فيُوزَّع حمل إعادة البناء عبر الزمن." }
    },
    {
      q: { en: "A per-process lock leaves how many rebuilds per expiry across ten servers?", ar: "القفل لكل process يترك كم إعادة بناء لكل انتهاء عبر عشرة servers؟" },
      options: [
        { en: "Exactly one, always.", ar: "واحدة بالضبط، دائماً." },
        { en: "Up to ten — one per server — because the lock only coordinates within a process.", ar: "حتى عشر — واحدة لكل server — لأن القفل ينسّق داخل الـ process فقط." },
        { en: "Zero, because the lock blocks all rebuilds.", ar: "صفر، لأن القفل يمنع كل عمليات إعادة البناء." },
        { en: "One thousand, the same as no lock.", ar: "ألف، مثل عدم وجود قفل." }
      ],
      correct: 1,
      why: { en: "Each process has its own lock, so up to one rebuild per server happens; a distributed lock is needed to reach exactly one across the fleet.", ar: "كل process له قفله الخاص، فتحدث حتى إعادة بناء واحدة لكل server؛ يلزم distributed lock للوصول إلى واحدة بالضبط عبر الأسطول." }
    }
  ]
};
```

NEXT: clean-arch
