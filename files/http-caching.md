```js
const httpCachingLesson = {
  id: "http-caching",
  moduleId: "foundations",
  title: { en: "Caching headers", ar: "ترويسات الـ caching" },
  summary: {
    en: "How a few response headers let browsers, proxies and CDNs reuse your answer instead of asking your server for it again.",
    ar: "كيف تسمح بضع ترويسات في الـ response للمتصفحات والـ proxies والـ CDNs بإعادة استخدام جوابك بدل سؤال السيرفر مرة أخرى."
  },
  mins: 16,
  sections: [
    {
      key: "why",
      blocks: [
        {
          t: "p",
          en: "HTTP caching is a small set of response headers that tell whoever received your response two things: may you keep a copy, and for how long may you reuse it without asking again. It exists so the same bytes are not queried, built and sent a second time for a second reader who wants the same thing.",
          ar: "الـ HTTP caching هو مجموعة صغيرة من الترويسات في الـ response تخبر من استلمها بأمرين: هل يحق له الاحتفاظ بنسخة، وكم من الوقت يحق له إعادة استخدامها دون أن يسأل مرة أخرى. وُجد هذا لكي لا يُعاد بناء نفس البايتات وجلبها من قاعدة البيانات وإرسالها مرة ثانية لقارئ ثانٍ يريد نفس الشيء."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "Cache", ar: "Cache" },
              v: {
                en: "Any store that keeps a copy of a response so a later request can be answered without going back to your server. The browser has one, a CDN has one, a reverse proxy has one.",
                ar: "أي مخزن يحتفظ بنسخة من الـ response ليُجاب على طلب لاحق دون الرجوع إلى سيرفرك. المتصفح لديه واحد، والـ CDN لديه واحد، والـ reverse proxy لديه واحد."
              }
            },
            {
              k: { en: "Origin server", ar: "Origin server" },
              v: {
                en: "Your application — the single place that can produce the real, current answer. Everything in front of it only holds copies.",
                ar: "تطبيقك أنت — المكان الوحيد القادر على إنتاج الجواب الحقيقي الحالي. كل ما يقف أمامه لا يحمل إلا نسخاً."
              }
            },
            {
              k: { en: "CDN", ar: "CDN" },
              v: {
                en: "Content Delivery Network: rented machines placed in many cities that sit in front of your origin and answer from a nearby copy.",
                ar: "Content Delivery Network: أجهزة مستأجرة موزّعة في مدن كثيرة تقف أمام الـ origin وتجيب من نسخة قريبة من المستخدم."
              }
            },
            {
              k: { en: "Fresh / stale", ar: "Fresh / stale" },
              v: {
                en: "A copy is fresh while it is still inside the lifetime the server gave it, and stale after that. Stale does not mean deleted — it means the cache must check before reusing it.",
                ar: "النسخة تكون fresh ما دامت داخل العمر الذي منحه لها السيرفر، وتصبح stale بعده. و stale لا تعني محذوفة، بل تعني أن على الـ cache أن يتحقق قبل إعادة استخدامها."
              }
            },
            {
              k: { en: "Revalidation", ar: "Revalidation" },
              v: {
                en: "A cheap request that asks the server: is my copy still good? The answer is either 304 Not Modified (keep yours) or a full new response.",
                ar: "طلب رخيص يسأل السيرفر: هل نسختي ما زالت صالحة؟ والجواب إمّا 304 Not Modified (احتفظ بنسختك) أو response كامل جديد."
              }
            },
            {
              k: { en: "ETag", ar: "ETag" },
              v: {
                en: "Entity Tag: a short opaque string the server attaches to a response to name that exact version of the body, so a later request can ask about it by name.",
                ar: "Entity Tag: نص قصير غير مفهوم المعنى يضعه السيرفر على الـ response ليسمّي هذه النسخة بالذات من الـ body، فيستطيع طلب لاحق أن يسأل عنها بالاسم."
              }
            }
          ]
        },
        {
          t: "p",
          en: "Here is the running example for the whole lesson: a news API with one endpoint, GET /api/articles/1042. It returns about 40 KB of JSON — the article text, the author and the tag list — built from three database queries. It is called about 900,000 times a day. The article itself is edited two or three times in its first hour and then never again. So the server is rebuilding an identical answer 900,000 times.",
          ar: "هذا هو المثال الجاري في الدرس كله: API لموقع أخبار فيه endpoint واحد، GET /api/articles/1042. يُرجع نحو 40 KB من الـ JSON — نص المقال والكاتب وقائمة الـ tags — مبنيّة من ثلاثة استعلامات على قاعدة البيانات. يُستدعى نحو 900,000 مرة يومياً. والمقال نفسه يُعدَّل مرتين أو ثلاثاً في ساعته الأولى ثم لا يُعدَّل أبداً. أي أن السيرفر يعيد بناء جواب متطابق 900,000 مرة."
        },
        {
          t: "p",
          en: "Think of a receptionist who is asked for the staff phone list forty times a day. She can call HR and have them read it out every time, or she can keep a printed copy on the desk and call HR once a day to ask 'has anything changed?'. The printed copy is the cache. The daily question is revalidation. Caching headers are how your server tells the receptionist which of the two it wants, and how long the printed copy is trusted.",
          ar: "تخيّل موظفة استقبال يُطلب منها قائمة هواتف الموظفين أربعين مرة في اليوم. تستطيع أن تتصل بـ HR ليقرأوها لها في كل مرة، أو تحتفظ بنسخة مطبوعة على المكتب وتتصل بـ HR مرة واحدة يومياً لتسأل: هل تغيّر شيء؟ النسخة المطبوعة هي الـ cache، والسؤال اليومي هو الـ revalidation. وترويسات الـ caching هي الطريقة التي يخبر بها سيرفرك موظفة الاستقبال أيّ الأسلوبين يريد، وكم من الوقت يُوثق بالنسخة المطبوعة."
        },
        {
          t: "callout",
          kind: "note",
          en: "Caching is not one mechanism, it is two, and they live in the same headers. Expiration means reuse without asking. Validation means ask, but ask cheaply. Almost every good setup uses both together.",
          ar: "الـ caching ليس آلية واحدة بل آليتان، وتعيشان في نفس الترويسات. الـ expiration يعني إعادة الاستخدام دون سؤال. والـ validation يعني اسأل، لكن اسأل بتكلفة رخيصة. وأغلب الإعدادات الجيدة تستعمل الاثنتين معاً."
        }
      ]
    },
    {
      key: "problem",
      blocks: [
        {
          t: "p",
          en: "With no caching headers at all, every one of those 900,000 daily requests reaches the origin. Each one runs three database queries and serializes 40 KB of JSON. That is 2.7 million queries a day for content that changed twice. When an article is shared on a large social account, traffic on that one URL goes from about 10 requests per second to about 900 per second in under a minute, and the database connection pool — the fixed set of open connections the app reuses — runs out. Requests then queue waiting for a connection, and p95 latency (the time under which 95 of every 100 requests finish) goes from 180 ms to over 4 seconds.",
          ar: "بلا أي ترويسات caching، كل واحد من الـ 900,000 طلب اليومي يصل إلى الـ origin. كل طلب يشغّل ثلاثة استعلامات على قاعدة البيانات ويحوّل 40 KB إلى JSON. أي 2.7 مليون استعلام يومياً لمحتوى تغيّر مرتين. وعندما يُنشر المقال على حساب كبير، ترتفع حركة هذا الـ URL وحده من نحو 10 طلبات في الثانية إلى نحو 900 في أقل من دقيقة، فينفد الـ connection pool — وهو العدد الثابت من الاتصالات المفتوحة التي يعيد التطبيق استخدامها. عندها تصطف الطلبات بانتظار اتصال، ويقفز الـ p95 latency (الزمن الذي تنتهي تحته 95 طلباً من كل 100) من 180 ms إلى أكثر من 4 ثوانٍ."
        },
        {
          t: "p",
          en: "Adding one header, Cache-Control: public, max-age=60, changes the shape of the traffic. Each CDN location now answers from its own copy for a minute and only refreshes once per minute. With 20 CDN locations that is about 29,000 origin requests a day instead of 900,000 — a 97% drop. Under the same social-media spike the origin still sees roughly 20 requests per minute, because the extra 880 requests per second are absorbed by copies. Readers near a CDN location get their answer in about 25 ms instead of 180 ms, because the bytes travel a few hundred kilometres instead of crossing an ocean.",
          ar: "إضافة ترويسة واحدة، Cache-Control: public, max-age=60، تغيّر شكل الحركة. كل موقع CDN صار يجيب من نسخته لمدة دقيقة ولا يجدّدها إلا مرة كل دقيقة. ومع 20 موقع CDN يصبح العدد نحو 29,000 طلب يومياً على الـ origin بدل 900,000، أي انخفاض 97%. وتحت نفس موجة الانتشار يبقى الـ origin يرى نحو 20 طلباً في الدقيقة، لأن الـ 880 طلباً في الثانية الزائدة تمتصّها النسخ. والقارئ القريب من موقع CDN يحصل على جوابه في نحو 25 ms بدل 180 ms، لأن البايتات تقطع بضع مئات من الكيلومترات بدل عبور محيط."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "Origin requests per day", ar: "طلبات الـ origin يومياً" },
              v: { en: "900,000 → about 29,000 (97% fewer requests your servers must actually answer).", ar: "900,000 ← نحو 29,000 (انخفاض 97% في الطلبات التي على سيرفراتك أن تجيبها فعلياً)." }
            },
            {
              k: { en: "Database queries per day", ar: "استعلامات قاعدة البيانات يومياً" },
              v: { en: "2.7 million → about 87,000, for content that changes twice.", ar: "2.7 مليون ← نحو 87,000، لمحتوى يتغيّر مرتين." }
            },
            {
              k: { en: "p95 latency under a spike", ar: "p95 latency تحت الموجة" },
              v: { en: "Over 4 s → about 25 ms. The slowest 5 requests in 100 went from unusable to instant.", ar: "أكثر من 4 ثوانٍ ← نحو 25 ms. أبطأ 5 طلبات من كل 100 انتقلت من غير قابلة للاستعمال إلى فورية." }
            },
            {
              k: { en: "Cost of the change", ar: "تكلفة التغيير" },
              v: { en: "One header, and accepting that a reader may see an article up to 60 seconds out of date.", ar: "ترويسة واحدة، وقبول أن القارئ قد يرى مقالاً متأخراً حتى 60 ثانية." }
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
          en: "Follow one request through the two mechanisms in order. Expiration comes first: the server states a lifetime, and while that lifetime lasts no request leaves the cache at all. Validation comes second: once the lifetime is over, the cache does not throw the copy away — it sends a small conditional request asking whether the copy is still correct.",
          ar: "تابع طلباً واحداً عبر الآليتين بالترتيب. الـ expiration أولاً: السيرفر يعلن عمراً محدداً، وما دام هذا العمر سارياً لا يخرج أي طلب من الـ cache أصلاً. ثم الـ validation: عند انتهاء العمر لا يرمي الـ cache النسخة، بل يرسل طلباً شرطياً صغيراً يسأل هل ما زالت النسخة صحيحة."
        },
        {
          t: "kv",
          rows: [
            { k: { en: "Cache-Control: max-age=N", ar: "Cache-Control: max-age=N" }, v: { en: "Any cache may reuse this response without asking for N seconds.", ar: "يجوز لأي cache إعادة استخدام هذا الـ response دون سؤال لمدة N ثانية." } },
            { k: { en: "s-maxage=N", ar: "s-maxage=N" }, v: { en: "Same, but only for shared caches (CDN, proxy). It overrides max-age for them, so you can give the CDN 300 s and the browser 30 s.", ar: "نفس الشيء لكن للـ shared caches فقط (CDN، proxy). يتجاوز max-age عندها، فتستطيع منح الـ CDN 300 ثانية والمتصفح 30 ثانية." } },
            { k: { en: "public / private", ar: "public / private" }, v: { en: "public: shared caches may store it. private: only the end user's own browser may, because the body is specific to that person.", ar: "public: يجوز للـ shared caches تخزينه. private: لا يجوز إلا لمتصفح المستخدم نفسه، لأن الـ body خاص بهذا الشخص." } },
            { k: { en: "no-cache", ar: "no-cache" }, v: { en: "Store it, but never reuse it without revalidating first. It does NOT mean 'do not cache'.", ar: "خزّنه، لكن لا تعيد استخدامه أبداً دون revalidation أولاً. وهو لا يعني «لا تخزّن»." } },
            { k: { en: "no-store", ar: "no-store" }, v: { en: "Do not keep a copy anywhere, not even on disk. This is the real 'do not cache'.", ar: "لا تحتفظ بنسخة في أي مكان، ولا حتى على القرص. هذا هو «لا تخزّن» الحقيقي." } },
            { k: { en: "ETag / If-None-Match", ar: "ETag / If-None-Match" }, v: { en: "The version name the server gave, and the header the cache sends back to ask about that exact version.", ar: "اسم النسخة الذي منحه السيرفر، والترويسة التي يعيدها الـ cache ليسأل عن تلك النسخة بالذات." } },
            { k: { en: "Vary", ar: "Vary" }, v: { en: "Names the request headers that change the body, so the cache stores one entry per combination instead of mixing them up.", ar: "يسمّي ترويسات الطلب التي تغيّر الـ body، فيخزّن الـ cache مدخلاً لكل تركيبة بدل أن يخلط بينها." } },
            { k: { en: "Age", ar: "Age" }, v: { en: "Added by a cache: how many seconds this copy has already been sitting there. Useful when debugging.", ar: "يضيفها الـ cache: كم ثانية مضت وهذه النسخة عنده. مفيدة عند التشخيص." } }
          ]
        },
        {
          t: "p",
          en: "First request, cold cache. The CDN has nothing for this URL, so it forwards to the origin. The origin runs its three queries, builds the JSON, computes a short hash of the body, and returns that hash as the ETag. The CDN stores the whole response under a key built from the method and the URL, remembers the current time, and passes the response to the reader.",
          ar: "الطلب الأول، والـ cache فارغ. الـ CDN لا يملك شيئاً لهذا الـ URL فيمرّر الطلب إلى الـ origin. يشغّل الـ origin استعلاماته الثلاثة ويبني الـ JSON ويحسب hash قصيراً للـ body ويرجعه بوصفه ETag. يخزّن الـ CDN الـ response كاملاً تحت مفتاح مبني من الـ method والـ URL، ويسجّل الوقت الحالي، ويمرّر الـ response إلى القارئ."
        },
        {
          t: "code",
          lang: "http",
          label: { en: "First response from the origin", ar: "الـ response الأول من الـ origin" },
          code: "HTTP/1.1 200 OK\nContent-Type: application/json\nCache-Control: public, max-age=30, s-maxage=300\nETag: \"a3f9c1d2\"\nVary: Accept-Encoding\nContent-Length: 41022\n\n{ \"id\": 1042, \"title\": \"...\", \"body\": \"...\" }"
        },
        {
          t: "p",
          en: "Every request in the next 300 seconds is answered by the CDN from that stored copy. The origin sees nothing — no TCP connection, no database query, no log line. This is the expiration path, and it is the one that actually removes load. The browser gets max-age=30 instead, so a reader who reloads twice in ten seconds does not even reach the CDN.",
          ar: "كل طلب خلال الـ 300 ثانية التالية يجيبه الـ CDN من تلك النسخة المخزّنة. والـ origin لا يرى شيئاً: لا اتصال TCP ولا استعلام قاعدة بيانات ولا سطر log. هذا هو مسار الـ expiration، وهو المسار الذي يزيل الحمل فعلاً. أما المتصفح فيأخذ max-age=30، فالقارئ الذي يعيد التحميل مرتين خلال عشر ثوانٍ لا يصل حتى إلى الـ CDN."
        },
        {
          t: "p",
          en: "At second 301 the copy is stale. The CDN now sends a conditional request: the same GET plus If-None-Match carrying the ETag it holds. The origin still runs its queries and recomputes the hash, but if the hash matches it returns 304 Not Modified with no body at all — about 200 bytes instead of 40 KB. The CDN resets its timer and keeps serving the copy it already had. So validation saves bandwidth and client time, not origin work; only expiration saves origin work.",
          ar: "عند الثانية 301 تصبح النسخة stale. عندها يرسل الـ CDN طلباً شرطياً: نفس الـ GET مع If-None-Match يحمل الـ ETag الذي يملكه. ما زال الـ origin يشغّل استعلاماته ويعيد حساب الـ hash، لكن إن تطابق الـ hash يرجع 304 Not Modified بلا body إطلاقاً — نحو 200 بايت بدل 40 KB. فيصفّر الـ CDN عدّاده ويستمر في تقديم النسخة التي عنده. إذاً الـ validation يوفّر الـ bandwidth ووقت العميل، لا عمل الـ origin؛ والـ expiration وحده هو ما يوفّر عمل الـ origin."
        },
        {
          t: "code",
          lang: "http",
          label: { en: "Revalidation after the lifetime ends", ar: "الـ revalidation بعد انتهاء العمر" },
          code: "GET /api/articles/1042 HTTP/1.1\nIf-None-Match: \"a3f9c1d2\"\n\nHTTP/1.1 304 Not Modified\nCache-Control: public, max-age=30, s-maxage=300\nETag: \"a3f9c1d2\""
        },
        {
          t: "p",
          en: "The cache key is worth one more paragraph, because it is where most surprises come from. Think of a box of index cards where each card is labelled with the URL. Vary adds words to that label. Vary: Accept-Encoding means the compressed and uncompressed answers get separate cards. If your response body actually changes with a header you did not name in Vary — the language, the API version, the logged-in user — the cache files two different answers under one label and hands the wrong one to the wrong person.",
          ar: "مفتاح الـ cache يستحق فقرة إضافية، لأنه مصدر معظم المفاجآت. تخيّل صندوق بطاقات فهرسة، كل بطاقة مكتوب عليها الـ URL. الـ Vary يضيف كلمات إلى هذا العنوان. فـ Vary: Accept-Encoding يعني أن الجواب المضغوط وغير المضغوط يأخذان بطاقتين منفصلتين. أما إذا كان الـ body يتغيّر فعلاً بحسب ترويسة لم تسمّها في Vary — اللغة أو إصدار الـ API أو المستخدم المسجَّل — فسيحفظ الـ cache جوابين مختلفين تحت عنوان واحد ويسلّم الجواب الخطأ للشخص الخطأ."
        },
        {
          t: "code",
          lang: "csharp",
          label: { en: "Setting the headers in ASP.NET Core", ar: "ضبط الترويسات في ASP.NET Core" },
          code: "app.MapGet(\"/api/articles/{id:int}\", async (int id, IArticleStore store, HttpContext ctx) =>\n{\n    var article = await store.GetAsync(id);\n    if (article is null) return Results.NotFound();\n\n    // Version name for this exact body. RowVersion changes on every write.\n    var etag = $\"\\\"{Convert.ToBase64String(article.RowVersion)}\\\"\";\n\n    // Cheap path: the caller already has this version.\n    var known = ctx.Request.Headers.IfNoneMatch.ToString();\n    if (known == etag)\n        return Results.StatusCode(StatusCodes.Status304NotModified);\n\n    ctx.Response.Headers.ETag = etag;\n    ctx.Response.Headers.CacheControl = \"public, max-age=30, s-maxage=300\";\n    ctx.Response.Headers.Vary = \"Accept-Encoding\";\n    return Results.Ok(ArticleDto.From(article));\n});"
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
              "Removes most origin traffic for read-heavy endpoints, with one header and no new infrastructure.",
              "Cuts latency for distant users, because bytes come from a nearby copy.",
              "Absorbs traffic spikes that would otherwise exhaust the database connection pool.",
              "Validation with ETag turns a 40 KB answer into a 200-byte 304 when nothing changed."
            ],
            ar: [
              "يزيل معظم حركة الـ origin في الـ endpoints كثيرة القراءة، بترويسة واحدة وبلا بنية تحتية جديدة.",
              "يخفض الـ latency للمستخدمين البعيدين، لأن البايتات تأتي من نسخة قريبة.",
              "يمتصّ موجات الحركة التي كانت ستستنزف الـ connection pool.",
              "الـ validation عبر ETag يحوّل جواب 40 KB إلى 304 بحجم 200 بايت عندما لا يتغيّر شيء."
            ]
          },
          cons: {
            en: [
              "Readers can see data that is out of date by up to the lifetime you set.",
              "A wrong public directive on a personalised response leaks one user's data to another.",
              "You cannot un-send a cached copy: a browser holding max-age=3600 will not ask again for an hour.",
              "Every extra Vary header multiplies the number of stored copies and lowers the hit rate."
            ],
            ar: [
              "قد يرى القارئ بيانات قديمة بمقدار العمر الذي حدّدته.",
              "توجيه public خاطئ على response مخصّص يسرّب بيانات مستخدم إلى آخر.",
              "لا يمكنك سحب نسخة مخزّنة: متصفح يحمل max-age=3600 لن يسأل مجدداً لمدة ساعة.",
              "كل ترويسة Vary إضافية تضاعف عدد النسخ المخزّنة وتخفض نسبة الإصابة."
            ]
          },
          limits: {
            en: [
              "Only GET and HEAD responses are cached in practice; POST results are not.",
              "Responses that depend on a login are private by nature, so shared caches cannot help.",
              "A cache cannot know your business rules — it only knows the headers you sent.",
              "Purging a CDN is best-effort and takes seconds to minutes to reach every location."
            ],
            ar: [
              "عملياً لا يُخزَّن إلا responses الـ GET والـ HEAD؛ نتائج الـ POST لا تُخزَّن.",
              "الـ responses المعتمدة على تسجيل الدخول خاصة بطبيعتها، فلا تفيد فيها الـ shared caches.",
              "الـ cache لا يعرف قواعد عملك، لا يعرف إلا الترويسات التي أرسلتها.",
              "مسح الـ CDN جهد أفضل-ما-يمكن ويستغرق ثوانيَ إلى دقائق ليصل كل المواقع."
            ]
          },
          alts: {
            en: [
              "An in-process memory cache in the app: faster to invalidate, but every server instance holds its own copy.",
              "A shared Redis cache in front of the database: you control eviction exactly, but every request still reaches your servers.",
              "Precomputing the response and serving it as a static file from object storage.",
              "Cache-busting URLs: put a version or content hash in the path and cache it for a year."
            ],
            ar: [
              "cache داخل ذاكرة التطبيق: أسرع في الإبطال، لكن كل instance يحمل نسخته الخاصة.",
              "Redis مشترك أمام قاعدة البيانات: تتحكّم بالإخراج بدقة، لكن كل طلب ما زال يصل سيرفراتك.",
              "بناء الـ response مسبقاً وتقديمه كملف ثابت من object storage.",
              "Cache-busting URLs: ضع نسخة أو content hash في المسار وخزّنه لسنة."
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
          title: { en: "Using no-cache when you meant no-store", ar: "استعمال no-cache والمقصود no-store" },
          body: {
            en: "A team put Cache-Control: no-cache on the bank statement endpoint, believing it meant 'never store this'. It does not. no-cache tells the cache to store the response and revalidate before each reuse. The statement PDF was written to the shared proxy's disk and to the browser's disk cache, and stayed there after logout. no-store is the directive that means do not keep a copy.",
            ar: "وضع فريق Cache-Control: no-cache على endpoint كشف الحساب، ظنّاً أنها تعني «لا تخزّن هذا أبداً». وهي لا تعني ذلك. الـ no-cache تخبر الـ cache أن يخزّن الـ response وأن يتحقّق قبل كل إعادة استخدام. فكُتب ملف الكشف على قرص الـ proxy المشترك وعلى disk cache المتصفح، وبقي هناك بعد تسجيل الخروج. والتوجيه الذي يعني «لا تحتفظ بنسخة» هو no-store."
          },
          fix: "Cache-Control: no-store, private"
        },
        {
          t: "mistake",
          title: { en: "Caching a personalised response publicly", ar: "تخزين response مخصّص بشكل public" },
          body: {
            en: "GET /api/me returns the logged-in user's name and email. Someone added [ResponseCache(Duration = 300)] to reduce load; that attribute emits Cache-Control: public, max-age=300. The CDN keyed the entry on the URL only, so the first user's profile was served to the next 300 seconds of visitors. The bug is invisible in local testing, where there is one user and no CDN.",
            ar: "الـ endpoint المسمّى GET /api/me يرجع اسم وبريد المستخدم المسجَّل. أضاف أحدهم [ResponseCache(Duration = 300)] لتخفيف الحمل؛ وهذه الخاصية تُصدر Cache-Control: public, max-age=300. وبنى الـ CDN المفتاح من الـ URL فقط، فقُدِّم ملف أول مستخدم لكل زائر خلال 300 ثانية. والعلة لا تظهر في الاختبار المحلي، حيث يوجد مستخدم واحد ولا يوجد CDN."
          },
          fix: "Cache-Control: private, no-store\nVary: Authorization"
        },
        {
          t: "mistake",
          title: { en: "An ETag that never matches", ar: "ETag لا يتطابق أبداً" },
          body: {
            en: "The ETag was computed as a hash of the serialized DTO, and that DTO contained a generatedAt field set to DateTime.UtcNow. Every response therefore produced a different hash, so If-None-Match never matched and the 304 rate stayed at 0%. The team saw full 40 KB bodies on every revalidation and concluded that ETags 'do not work'. Compute the ETag from something that changes only when the data changes — a row version, an updated-at timestamp, or a hash of the stored entity.",
            ar: "كان الـ ETag يُحسب من hash للـ DTO بعد تحويله، وكان الـ DTO يحوي حقل generatedAt مضبوطاً على DateTime.UtcNow. فأنتج كل response قيمة hash مختلفة، ولم يتطابق If-None-Match أبداً، وبقيت نسبة الـ 304 صفراً. رأى الفريق body كاملاً بحجم 40 KB في كل revalidation فاستنتج أن الـ ETags «لا تعمل». احسب الـ ETag من شيء لا يتغيّر إلا بتغيّر البيانات: row version أو updated-at أو hash للكيان المخزَّن."
          },
          fix: "var etag = $\"\\\"{Convert.ToBase64String(article.RowVersion)}\\\"\";"
        },
        {
          t: "mistake",
          title: { en: "Forgetting Vary on a header that changes the body", ar: "نسيان Vary على ترويسة تغيّر الـ body" },
          body: {
            en: "The endpoint returned Arabic or English text depending on the Accept-Language header, but the response carried no Vary. The CDN stored one entry per URL. An Arabic reader arrived first, and for the next five minutes every English reader received Arabic. The same class of bug appears with Accept-Encoding: a gzip body handed to a client that never asked for gzip, which the client cannot read at all.",
            ar: "كان الـ endpoint يرجع نصاً عربياً أو إنجليزياً بحسب ترويسة Accept-Language، لكن الـ response لم يحمل Vary. فخزّن الـ CDN مدخلاً واحداً لكل URL. وصل قارئ عربي أولاً، فتلقّى كل قارئ إنجليزي نصاً عربياً طوال خمس دقائق. ونفس نوع العلة يظهر مع Accept-Encoding: body مضغوط بـ gzip يُسلَّم لعميل لم يطلب gzip، ولا يستطيع قراءته إطلاقاً."
          },
          fix: "Vary: Accept-Language, Accept-Encoding"
        }
      ]
    },
    {
      key: "interview",
      blocks: [
        {
          t: "qa",
          level: "junior",
          q: { en: "What is the difference between no-cache and no-store?", ar: "ما الفرق بين no-cache و no-store؟" },
          a: {
            en: "They sound the same but do opposite things. no-store means keep no copy anywhere — use it for anything sensitive, like a bank statement. no-cache means you may keep a copy, but you must check with the server before every reuse; you get the bandwidth saving of a 304 while never showing stale data. If someone writes no-cache to protect private data, that data is still sitting on disk somewhere.",
            ar: "الاسمان متشابهان والمعنيان متعاكسان. الـ no-store تعني لا تحتفظ بنسخة في أي مكان — استعملها لأي شيء حساس مثل كشف حساب بنكي. أما no-cache فتعني يجوز لك الاحتفاظ بنسخة لكن عليك مراجعة السيرفر قبل كل إعادة استخدام؛ فتوفّر bandwidth عبر الـ 304 دون أن تعرض بيانات قديمة. ومن يكتب no-cache لحماية بيانات خاصة تبقى بياناته مخزّنة على قرص ما."
          }
        },
        {
          t: "qa",
          level: "mid",
          q: { en: "ETag or Last-Modified — when would you use each?", ar: "ETag أم Last-Modified — متى تستعمل كلاً منهما؟" },
          a: {
            en: "Last-Modified is a timestamp, so its resolution is one second and it cannot express 'changed and changed back'. ETag is an opaque version name you control, so it can be a row version or a content hash and it is exact. I default to ETag for API responses because I usually have a row version already. Last-Modified is fine for files on disk, and sending both is harmless — the client will prefer the ETag.",
            ar: "الـ Last-Modified طابع زمني، فدقّته ثانية واحدة ولا يستطيع التعبير عن «تغيّر ثم عاد كما كان». أما الـ ETag فاسم نسخة تتحكّم به أنت، فيمكن أن يكون row version أو content hash وهو دقيق. أنا أختار ETag افتراضياً في responses الـ API لأن لديّ row version جاهزاً عادةً. والـ Last-Modified مناسب للملفات على القرص، وإرسال الاثنين لا ضرر فيه — سيفضّل العميل الـ ETag."
          }
        },
        {
          t: "qa",
          level: "mid",
          q: { en: "Why would you set max-age and s-maxage to different values?", ar: "لماذا تضبط max-age و s-maxage بقيمتين مختلفتين؟" },
          a: {
            en: "Because you can purge a CDN and you cannot purge a browser. I give the CDN a long lifetime, say 300 seconds, since it takes almost all the traffic and I can force it to drop the copy when an editor publishes a change. I give the browser a short one, say 30 seconds, because if I get the value wrong I have to wait it out on every user's machine. s-maxage applies only to shared caches, so this split needs just one extra directive.",
            ar: "لأنك تستطيع مسح الـ CDN ولا تستطيع مسح المتصفح. أمنح الـ CDN عمراً طويلاً، 300 ثانية مثلاً، لأنه يستقبل شبه كل الحركة ولأنني أستطيع إجباره على إسقاط النسخة عند نشر تعديل. وأمنح المتصفح عمراً قصيراً، 30 ثانية مثلاً، لأنني إن أخطأت في القيمة فسأنتظر انتهاءها على جهاز كل مستخدم. والـ s-maxage تسري على الـ shared caches فقط، فهذا الفصل يحتاج توجيهاً واحداً إضافياً."
          }
        },
        {
          t: "qa",
          level: "senior",
          q: { en: "An editor fixes a typo. How does the corrected article reach readers?", ar: "محرّر يصحّح خطأً مطبعياً. كيف يصل المقال المصحَّح إلى القرّاء؟" },
          a: {
            en: "Three ways, and I usually combine two. First, time: pick a lifetime the business can live with, so the fix appears within that window on its own. Second, purge: after a successful write, call the CDN's invalidation API for that URL — it is fast but best-effort, so I never rely on it alone. Third, change the URL: for anything that must be exact, put a content hash in the path so the new version is a different resource and the old copies simply stop being requested.",
            ar: "ثلاث طرق، وأنا عادةً أجمع اثنتين. أولاً الوقت: اختر عمراً يقبله العمل، فيظهر التصحيح خلال هذه المدة تلقائياً. ثانياً الـ purge: بعد نجاح الكتابة نادِ الـ invalidation API عند الـ CDN لهذا الـ URL — سريع لكنه أفضل-ما-يمكن، فلا أعتمد عليه وحده. ثالثاً تغيير الـ URL: لأي شيء يجب أن يكون دقيقاً، ضع content hash في المسار فتصبح النسخة الجديدة مورداً مختلفاً وتتوقف النسخ القديمة عن الطلب أصلاً."
          }
        },
        {
          t: "qa",
          level: "senior",
          q: { en: "What do stale-while-revalidate and stale-if-error give you?", ar: "ماذا يمنحك stale-while-revalidate و stale-if-error؟" },
          a: {
            en: "They separate 'this copy expired' from 'this reader must wait'. stale-while-revalidate=60 tells the cache: for 60 seconds after expiry, answer instantly from the old copy and refresh in the background. That removes the latency spike every reader would otherwise pay at the moment of expiry. stale-if-error=600 says: if the origin is down or returns a 5xx, keep serving the old copy for up to ten minutes rather than showing an error. Together they turn a hard expiry into a soft one.",
            ar: "هما يفصلان بين «انتهى عمر هذه النسخة» و«على هذا القارئ أن ينتظر». فـ stale-while-revalidate=60 تقول للـ cache: خلال 60 ثانية بعد انتهاء العمر، أجب فوراً من النسخة القديمة وجدّدها في الخلفية. وهذا يزيل قفزة الـ latency التي كان سيدفعها كل قارئ لحظة الانتهاء. و stale-if-error=600 تقول: إن سقط الـ origin أو أرجع 5xx، استمر بتقديم النسخة القديمة حتى عشر دقائق بدل عرض خطأ. ومعاً يحوّلان الانتهاء الحادّ إلى انتهاء ليّن."
          }
        },
        {
          t: "qa",
          level: "staff",
          q: { en: "Every team in your company writes its own cache headers. How do you fix that?", ar: "كل فريق في شركتك يكتب ترويسات caching خاصة به. كيف تعالج ذلك؟" },
          a: {
            en: "Stop treating it as a per-endpoint decision and make it a small set of named policies — public-long, public-short, private-user, never-store — implemented once in a shared middleware package and applied by attribute. Then make the wrong thing hard: a test that fails the build if any endpoint reachable with an Authorization header emits public, and a dashboard of CDN hit ratio per policy so a broken policy is visible rather than argued about. The goal is that a new endpoint picks a policy from a list of four, instead of a developer reasoning about max-age from scratch at 6 pm.",
            ar: "توقّف عن اعتباره قراراً لكل endpoint واجعله مجموعة صغيرة من السياسات المسمّاة — public-long و public-short و private-user و never-store — تُنفَّذ مرة واحدة في حزمة middleware مشتركة وتُطبَّق عبر attribute. ثم اجعل الخطأ صعباً: اختبار يُفشل الـ build إذا أصدر أي endpoint يمكن الوصول إليه بترويسة Authorization توجيه public، ولوحة تعرض نسبة إصابة الـ CDN لكل سياسة فتظهر السياسة المكسورة بدل أن يُتجادل فيها. الهدف أن يختار الـ endpoint الجديد سياسة من قائمة من أربع، بدل أن يفكّر مطوّر في max-age من الصفر الساعة السادسة مساءً."
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
          title: { en: "Response cache on an authenticated endpoint", ar: "response cache على endpoint يتطلّب مصادقة" },
          bad: "[Authorize]\n[HttpGet(\"/api/me\")]\n[ResponseCache(Duration = 300)]\npublic async Task<IActionResult> Me()\n    => Ok(await _users.GetAsync(User.GetId()));",
          good: "[Authorize]\n[HttpGet(\"/api/me\")]\n[ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]\npublic async Task<IActionResult> Me()\n    => Ok(await _users.GetAsync(User.GetId()));",
          why: {
            en: "ResponseCache(Duration = 300) emits Cache-Control: public, max-age=300. The CDN keys on the URL, so the first caller's profile is returned to everyone for five minutes. Any response whose body depends on who is asking must be no-store, or at minimum private. Reviewers should treat [Authorize] together with a public cache directive as an automatic block.",
            ar: "الـ ResponseCache(Duration = 300) يُصدر Cache-Control: public, max-age=300. والـ CDN يبني المفتاح من الـ URL، فيُرجَع ملف أول متصل للجميع طوال خمس دقائق. وأي response يعتمد body على هوية السائل يجب أن يكون no-store، أو private على الأقل. وعلى المراجع أن يعتبر اجتماع [Authorize] مع توجيه cache من نوع public سبباً مباشراً لرفض التغيير."
          }
        },
        {
          t: "review",
          severity: "medium",
          title: { en: "The ETag check runs after all the work", ar: "فحص الـ ETag يجري بعد إنجاز كل العمل" },
          bad: "var article = await _db.Articles\n    .Include(a => a.Author)\n    .Include(a => a.Tags)\n    .FirstOrDefaultAsync(a => a.Id == id);\n\nvar dto = ArticleDto.From(article);\nvar etag = Hash(JsonSerializer.Serialize(dto));\n\nif (Request.Headers.IfNoneMatch == etag)\n    return StatusCode(304);",
          good: "// One cheap query for the version only.\nvar version = await _db.Articles\n    .Where(a => a.Id == id)\n    .Select(a => a.RowVersion)\n    .FirstOrDefaultAsync();\n\nif (version is null) return NotFound();\n\nvar etag = $\"\\\"{Convert.ToBase64String(version)}\\\"\";\nif (Request.Headers.IfNoneMatch.ToString() == etag)\n    return StatusCode(304);\n\n// Only now pay for the full load.",
          why: {
            en: "The first version still runs three joined queries and serializes 40 KB before deciding to send nothing. It saves network but no server work, which is the expensive half. Reading only the row version first turns a revalidation into one indexed lookup on a single column. On this endpoint that moved revalidation cost from about 45 ms to about 2 ms.",
            ar: "النسخة الأولى ما زالت تشغّل ثلاثة استعلامات مترابطة وتحوّل 40 KB إلى JSON قبل أن تقرّر ألا ترسل شيئاً. فهي توفّر الشبكة ولا توفّر عمل السيرفر، وهو النصف الأغلى. وقراءة الـ row version وحده أولاً تحوّل الـ revalidation إلى بحث مفهرس على عمود واحد. وفي هذا الـ endpoint نزلت تكلفة الـ revalidation من نحو 45 ms إلى نحو 2 ms."
          }
        }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        {
          t: "p",
          en: "In a real system the caching headers are the contract between four layers that each hold a copy: the user's browser, the CDN, an internal reverse proxy, and any in-process cache in the application. You do not configure each one separately — you send headers and they all obey the same rules. That is the point of the design: one small string on the response controls behaviour in machines you do not own.",
          ar: "في نظام حقيقي تكون ترويسات الـ caching هي العقد بين أربع طبقات يحمل كلٌّ منها نسخة: متصفح المستخدم، والـ CDN، وreverse proxy داخلي، وأي cache داخل ذاكرة التطبيق. وأنت لا تضبط كلاً منها على حدة، بل ترسل ترويسات فتلتزم كلها بنفس القواعد. وهذا هو جوهر التصميم: نص صغير على الـ response يتحكّم بسلوك أجهزة لا تملكها."
        },
        {
          t: "ul",
          en: [
            "Public read endpoints — article, product, public profile: long s-maxage for the CDN, short max-age for the browser, plus a purge call after every write.",
            "Search and list endpoints: short lifetimes (5-30 s) are enough, because they mainly need to survive a spike, not a day.",
            "Authenticated endpoints: no-store, and a build-time check that no endpoint behind [Authorize] emits public.",
            "Versioned static assets — /app.9f3c1a.js: max-age=31536000, immutable, because the filename changes whenever the content does.",
            "Write endpoints (POST, PUT, DELETE): never cached, and each one is the natural place to trigger the purge for the URLs it affected."
          ],
          ar: [
            "endpoints القراءة العامة — مقال، منتج، ملف عام: s-maxage طويل للـ CDN وmax-age قصير للمتصفح، مع نداء purge بعد كل كتابة.",
            "endpoints البحث والقوائم: أعمار قصيرة (5-30 ثانية) تكفي، لأن الغرض تجاوز الموجة لا التخزين ليوم.",
            "endpoints المصادقة: no-store، مع فحص وقت البناء يمنع أي endpoint خلف [Authorize] من إصدار public.",
            "الأصول الثابتة المرقّمة — /app.9f3c1a.js: max-age=31536000 و immutable، لأن اسم الملف يتغيّر كلما تغيّر المحتوى.",
            "endpoints الكتابة (POST، PUT، DELETE): لا تُخزَّن أبداً، وكل منها هو المكان الطبيعي لتشغيل الـ purge للـ URLs التي تأثّرت."
          ]
        },
        {
          t: "callout",
          kind: "tip",
          en: "Decide the lifetime with the product owner, not in code review. The real question is 'how out of date may this be?', and that is a business answer. Once you have the number in seconds, the header writes itself.",
          ar: "حدّد العمر مع مالك المنتج لا في مراجعة الكود. فالسؤال الحقيقي هو «كم يجوز أن تكون هذه البيانات متأخرة؟»، وهذا جواب يخصّ العمل. وحين تحصل على الرقم بالثواني تكتب الترويسة نفسها بنفسها."
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
              k: { en: "Network", ar: "Network" },
              v: { en: "The biggest win. A 304 is about 200 bytes against a 40 KB body — 99.5% less data for a request that changed nothing.", ar: "المكسب الأكبر. الـ 304 نحو 200 بايت مقابل body بحجم 40 KB — أي بيانات أقل بنسبة 99.5% لطلب لم يتغيّر فيه شيء." }
            },
            {
              k: { en: "Latency", ar: "Latency" },
              v: { en: "A CDN hit answers in about 25 ms instead of 180 ms, because the distance is a city rather than a continent.", ar: "إصابة الـ CDN تجيب في نحو 25 ms بدل 180 ms، لأن المسافة مدينة لا قارّة." }
            },
            {
              k: { en: "Database", ar: "Database" },
              v: { en: "Query volume falls in proportion to the hit rate. A 97% hit rate means 3% of the queries; the connection pool stops being the limit.", ar: "حجم الاستعلامات ينخفض بنسبة الإصابة. نسبة إصابة 97% تعني 3% من الاستعلامات؛ ويتوقف الـ connection pool عن كونه الحدّ." }
            },
            {
              k: { en: "Scalability", ar: "Scalability" },
              v: { en: "Traffic growth on cached URLs no longer needs more origin servers, since the extra requests are absorbed outside your infrastructure.", ar: "نمو الحركة على الـ URLs المخزّنة لم يعد يحتاج سيرفرات origin إضافية، لأن الطلبات الزائدة تُمتصّ خارج بنيتك التحتية." }
            },
            {
              k: { en: "Memory", ar: "Memory" },
              v: { en: "Each named Vary header multiplies stored copies. Vary: Accept-Encoding, Accept-Language with 3 languages means 6 entries per URL and a lower hit rate for each.", ar: "كل ترويسة في Vary تضاعف النسخ المخزّنة. فـ Vary: Accept-Encoding, Accept-Language مع 3 لغات تعني 6 مدخلات لكل URL ونسبة إصابة أقل لكلٍّ منها." }
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
            "curl -sI https://api.example.com/api/articles/1042 — prints only the response headers. Read Cache-Control, ETag and Vary and confirm they are what you intended.",
            "curl -sI -H 'If-None-Match: \"a3f9c1d2\"' <url> — sends a conditional request. A 304 in the status line proves validation works; a 200 means your ETag is unstable.",
            "Look at the Age header on a CDN response: it tells you how many seconds old the served copy is. Age that always reads 0 means you are never getting a hit.",
            "Check the CDN's own hit header (X-Cache: HIT/MISS on many CDNs, cf-cache-status on Cloudflare). A constant MISS usually points to a Set-Cookie or a missing public directive.",
            "In browser DevTools, the Network tab's Size column shows '(disk cache)' or '(memory cache)' for a served-from-cache request and '304' for a revalidated one — this separates browser caching from CDN caching at a glance."
          ],
          ar: [
            "curl -sI https://api.example.com/api/articles/1042 — يطبع ترويسات الـ response فقط. اقرأ Cache-Control و ETag و Vary وتأكد أنها كما أردت.",
            "curl -sI -H 'If-None-Match: \"a3f9c1d2\"' <url> — يرسل طلباً شرطياً. ظهور 304 في سطر الحالة يثبت أن الـ validation يعمل؛ وظهور 200 يعني أن الـ ETag غير مستقر.",
            "انظر إلى ترويسة Age في response الـ CDN: تخبرك كم ثانية عمر النسخة المقدَّمة. و Age التي تقرأ 0 دائماً تعني أنك لا تحصل على إصابة أبداً.",
            "افحص ترويسة الإصابة الخاصة بالـ CDN (X-Cache: HIT/MISS في كثير منها، أو cf-cache-status في Cloudflare). و MISS الدائم يشير عادةً إلى Set-Cookie أو إلى غياب توجيه public.",
            "في DevTools المتصفح، عمود Size في تبويب Network يعرض '(disk cache)' أو '(memory cache)' للطلب المقدَّم من الـ cache و'304' للطلب المُتحقَّق منه — وهذا يفصل بين caching المتصفح وcaching الـ CDN بنظرة واحدة."
          ]
        },
        {
          t: "callout",
          kind: "tip",
          en: "If a response is never cached and you cannot see why, check for a Set-Cookie header. Most shared caches refuse to store a response that sets a cookie, and one stray cookie from a middleware is enough to drop your hit rate to zero without any error appearing anywhere.",
          ar: "إذا كان الـ response لا يُخزَّن أبداً ولا تعرف السبب، ابحث عن ترويسة Set-Cookie. فأغلب الـ shared caches ترفض تخزين response يضبط cookie، وcookie واحد شارد من middleware يكفي لإنزال نسبة الإصابة إلى الصفر دون ظهور أي خطأ في أي مكان."
        }
      ]
    },
    {
      key: "realworld",
      blocks: [
        {
          t: "p",
          en: "Caching headers matter most where a small number of URLs are read by a very large number of people, and where the data changes far less often than it is read. The ratio between reads and writes is the whole decision. If a resource is read a thousand times per change, caching is close to free money; if it changes on every read, headers cannot help and you need a different design.",
          ar: "تظهر أهمية ترويسات الـ caching حين يقرأ عددٌ كبير جداً من الناس عدداً صغيراً من الـ URLs، وحين تتغيّر البيانات أقل بكثير مما تُقرأ. والنسبة بين القراءات والكتابات هي القرار كله. فإذا قُرئ المورد ألف مرة لكل تغيير كان الـ caching ربحاً شبه مجاني؛ وإذا تغيّر عند كل قراءة فلن تنفع الترويسات وستحتاج تصميماً مختلفاً."
        },
        {
          t: "ul",
          en: [
            "News and publishing platforms: one article URL takes millions of reads and two edits. Long CDN lifetimes plus a purge on publish is the standard shape.",
            "E-commerce catalogues: product pages are cached publicly for minutes, while the cart and checkout are strictly no-store because they are personal.",
            "Public API providers: ETags let integrators poll every minute at almost no cost to either side, and the 304 rate becomes a quality metric.",
            "Mobile back ends: caching is what makes the app usable on a weak connection, because a 200-byte 304 succeeds where a 40 KB body times out."
          ],
          ar: [
            "منصات الأخبار والنشر: URL مقال واحد يستقبل ملايين القراءات وتعديلين. والشكل المعتاد هو أعمار طويلة في الـ CDN مع purge عند النشر.",
            "كتالوجات التجارة الإلكترونية: صفحات المنتجات تُخزَّن بشكل public لدقائق، بينما السلة والدفع no-store بصرامة لأنها شخصية.",
            "مزوّدو الـ APIs العامة: الـ ETags تتيح للمتكاملين الاستعلام كل دقيقة بتكلفة شبه معدومة على الطرفين، وتصبح نسبة الـ 304 مقياس جودة.",
            "الواجهات الخلفية لتطبيقات الموبايل: الـ caching هو ما يجعل التطبيق قابلاً للاستعمال على اتصال ضعيف، لأن 304 بحجم 200 بايت ينجح حيث ينتهي وقت body بحجم 40 KB."
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
          en: "Add Cache-Control: public, max-age=60 to a GET endpoint, then call it twice from a browser. You have succeeded when the second call shows '(disk cache)' in the DevTools Size column and produces no log line on the server.",
          ar: "أضف Cache-Control: public, max-age=60 إلى endpoint من نوع GET ثم نادِه مرتين من المتصفح. تنجح عندما يُظهر النداء الثاني '(disk cache)' في عمود Size داخل DevTools ولا ينتج أي سطر log على السيرفر."
        },
        {
          t: "ex",
          diff: "medium",
          en: "Add an ETag built from the entity's row version, and return 304 when If-None-Match matches. You have succeeded when curl -sI -H 'If-None-Match: <tag>' returns 304 with no body, and changing one field in the database makes the same call return 200 again.",
          ar: "أضف ETag مبنيّاً على row version للكيان، وأرجع 304 عند تطابق If-None-Match. تنجح عندما يُرجع curl -sI -H 'If-None-Match: <tag>' رمز 304 بلا body، وعندما يجعل تغيير حقل واحد في قاعدة البيانات نفس النداء يُرجع 200 مجدداً."
        },
        {
          t: "ex",
          diff: "hard",
          en: "Make an endpoint return Arabic or English based on Accept-Language, put a caching proxy in front of it, and reproduce the wrong-language bug. Then fix it with Vary: Accept-Language. You have succeeded when you can show the bug before the fix and two separate cache entries after it.",
          ar: "اجعل endpoint يرجع عربية أو إنجليزية بحسب Accept-Language، وضع caching proxy أمامه، وأعد إنتاج علة اللغة الخاطئة. ثم أصلحها بـ Vary: Accept-Language. تنجح عندما تستطيع إظهار العلة قبل الإصلاح ووجود مدخلين منفصلين في الـ cache بعده."
        },
        {
          t: "ex",
          diff: "senior",
          en: "Define four named cache policies for your service (public-long, public-short, private-user, never-store), implement them as one middleware or attribute, and write a test that fails if any endpoint requiring authentication emits a public directive. You have succeeded when the test catches a deliberately broken endpoint you add to the test project.",
          ar: "عرّف أربع سياسات caching مسمّاة لخدمتك (public-long و public-short و private-user و never-store)، ونفّذها في middleware أو attribute واحد، واكتب اختباراً يفشل إذا أصدر أي endpoint يتطلّب مصادقة توجيه public. تنجح عندما يمسك الاختبار endpoint مكسوراً عمداً تضيفه إلى مشروع الاختبار."
        }
      ]
    },
    {
      key: "refs",
      blocks: [
        {
          t: "ref",
          label: { en: "MDN — HTTP caching", ar: "MDN — HTTP caching" },
          url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching",
          meta: { en: "Docs", ar: "توثيق" }
        },
        {
          t: "ref",
          label: { en: "RFC 9111 — HTTP Caching (the specification itself)", ar: "RFC 9111 — HTTP Caching (المواصفة نفسها)" },
          url: "https://www.rfc-editor.org/rfc/rfc9111.html",
          meta: { en: "Spec", ar: "مواصفة" }
        },
        {
          t: "ref",
          label: { en: "Response caching in ASP.NET Core", ar: "Response caching في ASP.NET Core" },
          url: "https://learn.microsoft.com/en-us/aspnet/core/performance/caching/response",
          meta: { en: "Docs", ar: "توثيق" }
        },
        {
          t: "ref",
          label: { en: "web.dev — Prevent unnecessary network requests with the HTTP cache", ar: "web.dev — تجنّب الطلبات الشبكية غير الضرورية عبر HTTP cache" },
          url: "https://web.dev/articles/http-cache",
          meta: { en: "Article", ar: "مقال" }
        }
      ]
    }
  ],
  quiz: [
    {
      q: { en: "What does Cache-Control: no-cache tell a cache to do?", ar: "ماذا تخبر Cache-Control: no-cache الـ cache أن يفعل؟" },
      options: [
        { en: "Never store the response anywhere.", ar: "ألّا يخزّن الـ response في أي مكان." },
        { en: "Store it, but revalidate with the server before every reuse.", ar: "أن يخزّنه لكن يتحقّق من السيرفر قبل كل إعادة استخدام." },
        { en: "Store it for a default of 60 seconds.", ar: "أن يخزّنه لمدة افتراضية 60 ثانية." },
        { en: "Store it only in the browser, never in a CDN.", ar: "أن يخزّنه في المتصفح فقط لا في الـ CDN." }
      ],
      correct: 1,
      why: {
        en: "no-cache permits storage but forbids reuse without revalidation. The directive that forbids storage is no-store — confusing the two is how private data ends up on a shared proxy's disk.",
        ar: "الـ no-cache تسمح بالتخزين وتمنع إعادة الاستخدام دون revalidation. والتوجيه الذي يمنع التخزين هو no-store — والخلط بينهما هو ما يجعل بيانات خاصة تنتهي على قرص proxy مشترك."
      }
    },
    {
      q: { en: "Which mechanism actually removes work from your origin server?", ar: "أي آلية تزيل فعلياً العمل عن سيرفر الـ origin؟" },
      options: [
        { en: "Expiration with max-age, because no request reaches the origin at all.", ar: "الـ expiration عبر max-age، لأن أي طلب لا يصل الـ origin إطلاقاً." },
        { en: "Validation with ETag, because 304 responses have no body.", ar: "الـ validation عبر ETag، لأن responses الـ 304 بلا body." },
        { en: "The Vary header, because it splits the cache into smaller entries.", ar: "ترويسة Vary، لأنها تقسّم الـ cache إلى مدخلات أصغر." },
        { en: "The Age header, because it tells the CDN when to stop asking.", ar: "ترويسة Age، لأنها تخبر الـ CDN متى يتوقف عن السؤال." }
      ],
      correct: 0,
      why: {
        en: "While a response is fresh, the cache answers alone and the origin never hears about the request. Validation still sends a request to the origin, so it saves bandwidth and client time but not server work.",
        ar: "ما دام الـ response fresh فالـ cache يجيب وحده ولا يسمع الـ origin بالطلب أصلاً. أما الـ validation فما زال يرسل طلباً إلى الـ origin، فيوفّر الـ bandwidth ووقت العميل لا عمل السيرفر."
      }
    },
    {
      q: { en: "A response body changes with the Accept-Language header but has no Vary. What happens behind a shared cache?", ar: "body يتغيّر بحسب ترويسة Accept-Language لكن بلا Vary. ماذا يحدث خلف cache مشترك؟" },
      options: [
        { en: "The cache refuses to store the response.", ar: "يرفض الـ cache تخزين الـ response." },
        { en: "The cache automatically detects the language and splits the entries.", ar: "يكتشف الـ cache اللغة تلقائياً ويفصل المدخلات." },
        { en: "The cache stores one entry per URL and serves the wrong language to some users.", ar: "يخزّن الـ cache مدخلاً واحداً لكل URL ويقدّم اللغة الخاطئة لبعض المستخدمين." },
        { en: "The origin is asked again for every different language.", ar: "يُسأل الـ origin مجدداً عند كل لغة مختلفة." }
      ],
      correct: 2,
      why: {
        en: "The cache key is the URL plus whatever Vary names. With no Vary, both language variants share one key, so whichever variant arrives first is served to everyone until it expires.",
        ar: "مفتاح الـ cache هو الـ URL مضافاً إليه ما تسمّيه Vary. وبلا Vary تتشارك النسختان مفتاحاً واحداً، فتُقدَّم النسخة التي وصلت أولاً للجميع حتى ينتهي عمرها."
      }
    },
    {
      q: { en: "Why give the CDN s-maxage=300 while the browser gets max-age=30?", ar: "لماذا تمنح الـ CDN قيمة s-maxage=300 بينما يأخذ المتصفح max-age=30؟" },
      options: [
        { en: "Browsers ignore long lifetimes anyway.", ar: "المتصفحات تتجاهل الأعمار الطويلة على أي حال." },
        { en: "You can purge a CDN copy on demand, but you cannot reach a browser's copy.", ar: "تستطيع مسح نسخة الـ CDN عند الطلب، ولا تستطيع الوصول إلى نسخة المتصفح." },
        { en: "s-maxage is the only directive a CDN understands.", ar: "الـ s-maxage هو التوجيه الوحيد الذي يفهمه الـ CDN." },
        { en: "Browsers cannot store responses larger than a few kilobytes.", ar: "المتصفحات لا تستطيع تخزين responses أكبر من بضعة كيلوبايتات." }
      ],
      correct: 1,
      why: {
        en: "A mistake in the CDN lifetime is recoverable with an invalidation call; a mistake in the browser lifetime has to be waited out on every user's machine. So the layer you control gets the long value.",
        ar: "الخطأ في عمر الـ CDN يمكن تداركه بنداء invalidation؛ أما الخطأ في عمر المتصفح فيجب انتظار انتهائه على جهاز كل مستخدم. لذا تُمنح القيمة الطويلة للطبقة التي تتحكّم بها."
      }
    },
    {
      q: { en: "An endpoint returns 200 with a full body on every revalidation, never 304. What is the most likely cause?", ar: "endpoint يُرجع 200 مع body كامل في كل revalidation ولا يُرجع 304 أبداً. ما السبب الأرجح؟" },
      options: [
        { en: "The client is not sending If-None-Match at all.", ar: "العميل لا يرسل If-None-Match إطلاقاً." },
        { en: "max-age is set too high.", ar: "قيمة max-age مضبوطة عالية جداً." },
        { en: "The response is missing a Content-Length header.", ar: "الـ response تنقصه ترويسة Content-Length." },
        { en: "The ETag is computed from something that changes on every request, such as a timestamp in the payload.", ar: "الـ ETag يُحسب من شيء يتغيّر في كل طلب، مثل طابع زمني داخل الـ payload." }
      ],
      correct: 3,
      why: {
        en: "An ETag must name the version of the data, not the moment of the request. Hashing a payload that contains DateTime.UtcNow produces a new tag every time, so If-None-Match can never match and the 304 rate stays at zero.",
        ar: "على الـ ETag أن يسمّي نسخة البيانات لا لحظة الطلب. وحساب hash لـ payload يحوي DateTime.UtcNow ينتج tag جديداً في كل مرة، فلا يتطابق If-None-Match أبداً وتبقى نسبة الـ 304 صفراً."
      }
    }
  ]
};
```

NEXT: rest-constraints
