```js
const httpCachingLesson = {
  id: "http-caching",
  moduleId: "foundations",
  title: { en: "Caching headers", ar: "ترويسات الـ caching" },
  summary: {
    en: "Expiration versus validation, who is allowed to store what, and why one wrong header turns a CDN into a data-leak machine.",
    ar: "الانتهاء مقابل التحقق، ومن يُسمح له بتخزين ماذا، ولماذا يحوّل header واحد خاطئ الـ CDN إلى ماكينة تسريب بيانات."
  },
  mins: 16,
  sections: [
    { key: "why", blocks: [
      { t: "p", en: "The fastest request is the one that never leaves the client, and the second fastest is the one that dies at an edge node 15 ms away. HTTP caching is the only mechanism in the protocol that lets you buy that speed without writing a line of application code — and it is the only one where infrastructure you do not own (browsers, corporate proxies, CDN nodes on four continents) acts on your instructions for hours or days after you sent them.", ar: "أسرع request هو الذي لا يغادر الـ client أصلاً، وثانيه سرعةً هو الذي يموت عند node على الحافة تبعد 15 ملّي ثانية. الـ HTTP caching هو الآلية الوحيدة في البروتوكول التي تشتري بها تلك السرعة دون كتابة سطر واحد في التطبيق — وهو الوحيد الذي تتصرف فيه بنية تحتية لا تملكها (متصفحات، proxies مؤسسية، nodes للـ CDN في أربع قارات) بناءً على تعليماتك لساعات أو أيام بعد إرسالها." },
      { t: "p", en: "That last point is what makes caching a different kind of engineering problem. A bug in your controller is fixed by a deploy. A bug in a Cache-Control header is not: you told a million browsers to keep a response for a year, and there is no mechanism in HTTP to reach into them and take it back. Caching is the one area of a backend where a mistake is genuinely irreversible, which is why the discipline is to be conservative on the way out and aggressive only where you control the URL.", ar: "وهذه النقطة الأخيرة هي ما يجعل الـ caching نوعاً مختلفاً من مشاكل الهندسة. الخطأ في الـ controller يُصلحه نشر جديد. أما الخطأ في Cache-Control header فلا: أنت أخبرت مليون متصفح أن يحتفظ باستجابة لمدة عام، ولا توجد آلية في الـ HTTP تصل إليها وتسحبها. الـ caching هو المجال الوحيد في الـ backend الذي يكون فيه الخطأ غير قابل للتراجع فعلاً، ولهذا فالانضباط هو التحفّظ عند الخروج والعدوانية فقط حيث تتحكم أنت في الـ URL." },
      { t: "p", en: "There is also a cost story. A read-heavy API serving 50,000 requests per minute at 20 ms of origin work each is burning roughly 17 CPU-seconds per second of wall clock — a permanently busy 17-core fleet. Push a 90% hit rate to the edge and the same traffic needs under two cores. Nothing you can do inside the handler comes close to that ratio; the win comes from not running the handler at all.", ar: "وهناك أيضاً قصة التكلفة. API قراءة كثيفة يخدم 50 ألف request في الدقيقة بعمل origin مقداره 20 ملّي ثانية لكل منها يحرق ~17 ثانية CPU لكل ثانية زمن حقيقي — أي أسطول من 17 نواة مشغولة دائماً. ادفع بنسبة إصابة 90% إلى الحافة، فتحتاج نفس الحركة أقل من نواتين. لا شيء تفعله داخل الـ handler يقترب من هذه النسبة؛ فالمكسب يأتي من عدم تشغيل الـ handler إطلاقاً." },
      { t: "callout", kind: "warn", en: "Cache-Control is a contract with machines you will never see. Before you widen it, ask: if this exact response were served to a different user for the next hour, what would happen? If the answer is bad, the header is wrong regardless of how much latency it saves.", ar: "الـ Cache-Control عقد مع أجهزة لن تراها أبداً. قبل أن توسّعه اسأل: لو خُدمت هذه الاستجابة بعينها لمستخدم آخر خلال الساعة القادمة، ماذا سيحدث؟ إن كانت الإجابة سيئة، فالـ header خاطئ مهما وفّر من زمن استجابة." }
    ]},

    { key: "problem", blocks: [
      { t: "p", en: "Consider a product catalogue endpoint: 40 ms of database work, a 30 KB JSON response, 50,000 requests per minute, and data that changes maybe twice a day. Without caching, every single one of those requests reaches the origin and re-serialises identical bytes. With a 60-second Cache-Control: public, max-age=60 at the CDN, the origin sees at most one request per edge PoP per minute — from 50,000 down to a few dozen.", ar: "خذ endpoint لكتالوج منتجات: 40 ملّي ثانية عمل قاعدة بيانات، واستجابة JSON بحجم 30 كيلوبايت، و50 ألف request في الدقيقة، وبيانات تتغيّر ربما مرتين يومياً. بدون caching يصل كل واحد من تلك الـ requests إلى الـ origin ويعيد تسلسل نفس الـ bytes حرفياً. ومع Cache-Control: public, max-age=60 على الـ CDN، يرى الـ origin request واحداً على الأكثر لكل نقطة حضور في الدقيقة — من 50 ألفاً إلى بضع عشرات." },
      { t: "p", en: "Now take the case where the data must be fresh: a user's own dashboard. You cannot serve a stale copy, but you can still avoid the payload. With an ETag, the client sends If-None-Match and the server answers 304 Not Modified with no body. You still pay the round trip and the freshness check, but a 30 KB transfer becomes ~150 bytes of headers. On a mobile connection that is the difference between 400 ms and 90 ms.", ar: "الآن خذ الحالة التي يجب أن تكون فيها البيانات طازجة: لوحة المستخدم الخاصة. لا تستطيع خدمة نسخة قديمة، لكن تستطيع تجنّب حمل الـ payload. مع ETag يرسل الـ client الـ If-None-Match ويرد السيرفر بـ 304 Not Modified بلا body. تظل تدفع رحلة الذهاب والعودة وفحص الحداثة، لكن نقل 30 كيلوبايت يصبح ~150 بايت من الـ headers. وعلى اتصال محمول هذا هو الفرق بين 400 و90 ملّي ثانية." },
      { t: "kv", rows: [
        { k: { en: "No caching headers", ar: "بلا headers للـ caching" }, v: { en: "50,000 origin req/min · 40 ms each · 1.5 GB/min egress · ~17 cores permanently busy", ar: "50 ألف request/دقيقة على الـ origin · 40 ملّي لكل منها · 1.5 غيغابايت/دقيقة صادر · ~17 نواة مشغولة دائماً" } },
        { k: { en: "max-age=60 at the CDN", ar: "max-age=60 على الـ CDN" }, v: { en: "~30 origin req/min (one per PoP) · edge latency 10–20 ms · ~99.9% offload", ar: "~30 request/دقيقة على الـ origin (واحد لكل نقطة حضور) · زمن الحافة 10–20 ملّي · ~99.9% تخفيف" } },
        { k: { en: "ETag revalidation only (no max-age)", ar: "تحقق بالـ ETag فقط (بلا max-age)" }, v: { en: "Full round trip every time, but 30 KB → ~150 B on a 304; origin still computes the ETag", ar: "رحلة كاملة في كل مرة، لكن 30 كيلوبايت ← ~150 بايت عند 304؛ ومع ذلك يحسب الـ origin الـ ETag" } },
        { k: { en: "max-age=31536000 on a hashed asset URL", ar: "max-age=31536000 على URL بأصل مُهشَّر" }, v: { en: "Zero requests after the first; a new deploy changes the filename, so invalidation is free", ar: "صفر requests بعد الأول؛ والنشر الجديد يغيّر اسم الملف، فيصبح الإبطال مجانياً" } },
        { k: { en: "Cache-Control: public on a per-user response", ar: "Cache-Control: public على استجابة خاصة بمستخدم" }, v: { en: "One user's data served to everyone behind that cache — a breach, not a bug", ar: "بيانات مستخدم واحد تُخدَم للجميع خلف ذلك الـ cache — اختراق لا خلل" } }
      ]}
    ]},

    { key: "internals", blocks: [
      { t: "p", en: "HTTP defines two distinct caching mechanisms, and most confusion comes from mixing them. Expiration caching means the cache serves a stored response without contacting the origin at all, because it is still fresh: freshness is computed from Cache-Control: max-age, or failing that from an Expires date, or failing that from a heuristic based on Last-Modified. Validation caching means the cache does contact the origin, but sends a conditional request; if nothing changed, the origin answers 304 with no body and the cache reuses what it already has.", ar: "الـ HTTP يعرّف آليتين مختلفتين للـ caching، ومعظم الالتباس يأتي من خلطهما. الـ expiration caching يعني أن الـ cache يخدم استجابة مخزّنة دون الاتصال بالـ origin إطلاقاً لأنها ما زالت طازجة: وتُحسب الحداثة من Cache-Control: max-age، وإلا من تاريخ Expires، وإلا من تقدير تجريبي مبني على Last-Modified. أما الـ validation caching فيعني أن الـ cache يتصل بالـ origin فعلاً لكنه يرسل request مشروطاً؛ فإن لم يتغيّر شيء ردّ الـ origin بـ 304 بلا body وأعاد الـ cache استخدام ما لديه." },
      { t: "kv", rows: [
        { k: { en: "max-age=N", ar: "max-age=N" }, v: { en: "Freshness lifetime in seconds, counted from the response's Date, not from when the client received it", ar: "عمر الحداثة بالثواني، يُحسب من قيمة Date في الاستجابة لا من لحظة استلام الـ client لها" } },
        { k: { en: "s-maxage=N", ar: "s-maxage=N" }, v: { en: "Overrides max-age for shared caches only — the lever for 'cache 5 minutes at the CDN, 0 in the browser'", ar: "يتجاوز max-age للـ caches المشتركة فقط — وهو المفتاح لسياسة «خزّن 5 دقائق على الـ CDN وصفر في المتصفح»" } },
        { k: { en: "public / private", ar: "public / private" }, v: { en: "private forbids shared caches from storing it at all; it does not mean encrypted or authorized", ar: "الـ private يمنع الـ caches المشتركة من التخزين إطلاقاً؛ ولا يعني مشفّراً ولا مُصرّحاً به" } },
        { k: { en: "no-cache", ar: "no-cache" }, v: { en: "Store it, but revalidate before every reuse. It does not mean 'do not cache' — that is no-store", ar: "خزّنه لكن تحقّق قبل كل إعادة استخدام. لا يعني «لا تخزّن» — تلك هي no-store" } },
        { k: { en: "no-store", ar: "no-store" }, v: { en: "Never write it to any storage, memory or disk. The only correct choice for sensitive responses", ar: "لا تكتبه في أي تخزين، ذاكرة أو قرص. الخيار الصحيح الوحيد للاستجابات الحساسة" } },
        { k: { en: "must-revalidate", ar: "must-revalidate" }, v: { en: "Once stale, the cache may not serve it even if the origin is unreachable — it must return 504 instead", ar: "بعد أن تصبح قديمة لا يجوز للـ cache خدمتها حتى لو تعذّر الوصول إلى الـ origin — بل يجب أن يرجع 504" } },
        { k: { en: "immutable", ar: "immutable" }, v: { en: "Tells the browser not to revalidate even on a manual refresh; only ever correct on content-hashed URLs", ar: "يخبر المتصفح ألا يتحقق حتى عند التحديث اليدوي؛ ولا يصح إلا على URLs مُهشَّرة المحتوى" } },
        { k: { en: "stale-while-revalidate=N", ar: "stale-while-revalidate=N" }, v: { en: "Serve the stale copy immediately and refresh in the background for N seconds past expiry", ar: "اخدم النسخة القديمة فوراً وحدّثها في الخلفية لمدة N ثانية بعد انتهاء الصلاحية" } }
      ]},
      { t: "p", en: "A cache key is not just the URL. By default it is the method plus the effective URI, and the Vary header extends it: Vary: Accept-Encoding tells the cache to store gzip and brotli variants separately. Vary is where subtle bugs live, because every value you add multiplies the number of stored variants and cuts your hit rate. Vary: User-Agent on a CDN is close to a cache-disabling instruction — there are millions of distinct user-agent strings, so almost every request becomes a miss.", ar: "مفتاح الـ cache ليس الـ URL وحده. افتراضياً هو الـ method مع الـ URI الفعّال، والـ Vary header يوسّعه: فـ Vary: Accept-Encoding يخبر الـ cache أن يخزّن نسختي gzip و brotli منفصلتين. والـ Vary هو موطن الأخطاء الدقيقة، لأن كل قيمة تضيفها تضاعف عدد النسخ المخزّنة وتقلّص نسبة الإصابة. واستخدام Vary: User-Agent على CDN يقارب تعليمة تعطيل الـ caching — فهناك ملايين السلاسل المختلفة، فتصبح كل الـ requests تقريباً misses." },
      { t: "code", lang: "csharp", label: { en: "Expiration and validation, side by side", ar: "الانتهاء والتحقق جنباً إلى جنب" }, code: "// 1. Public catalogue: pure expiration caching, offloaded to the CDN.\napp.MapGet(\"/catalogue\", async (ICatalogue svc, HttpResponse res, CancellationToken ct) =>\n{\n    res.GetTypedHeaders().CacheControl = new CacheControlHeaderValue\n    {\n        Public          = true,\n        MaxAge          = TimeSpan.FromSeconds(30),   // browsers\n        SharedMaxAge    = TimeSpan.FromMinutes(5)     // s-maxage: CDN\n    };\n    res.Headers.Vary = \"Accept-Encoding\";\n    return Results.Ok(await svc.GetAsync(ct));\n});\n\n// 2. Per-user resource: validation caching only, never shared.\napp.MapGet(\"/me/orders/{id:guid}\", async (Guid id, IOrders svc, HttpContext ctx, CancellationToken ct) =>\n{\n    var order = await svc.GetAsync(id, ctx.User.GetId(), ct);\n    if (order is null) return Results.NotFound();\n\n    var etag = new EntityTagHeaderValue($\"\\\"{order.RowVersionHex}\\\"\");\n    var headers = ctx.Response.GetTypedHeaders();\n    headers.CacheControl = new CacheControlHeaderValue { Private = true, NoCache = true };\n    headers.ETag = etag;\n\n    var inm = ctx.Request.GetTypedHeaders().IfNoneMatch;\n    if (inm.Any(t => t.Compare(etag, useStrongComparison: false)))\n        return Results.StatusCode(StatusCodes.Status304NotModified);\n\n    return Results.Ok(order);\n});\n\n// 3. Sensitive: never stored anywhere.\napp.MapGet(\"/me/statements/{id:guid}\", async (...) =>\n{\n    ctx.Response.Headers.CacheControl = \"no-store\";\n    ctx.Response.Headers.Pragma = \"no-cache\";   // for ancient HTTP/1.0 intermediaries\n    return Results.File(bytes, \"application/pdf\");\n});" },
      { t: "p", en: "ETags come in two flavours and the distinction is not cosmetic. A strong ETag (\"abc\") asserts the bytes are identical; a weak ETag (W/\"abc\") asserts only that the representation is semantically equivalent. Range requests — the mechanism behind video seeking and resumable downloads — require a strong validator, because stitching together byte ranges from two semantically-equal-but-different responses produces a corrupt file. If you compute your ETag from a database row version rather than from the serialized bytes, it is weak, and you should label it W/ rather than pretend otherwise.", ar: "الـ ETags نوعان والتمييز بينهما ليس تجميلياً. الـ strong ETag بصيغة \"abc\" يؤكد تطابق الـ bytes؛ والـ weak ETag بصيغة W/\"abc\" يؤكد التكافؤ الدلالي فقط. وطلبات الـ Range — الآلية خلف التنقّل في الفيديو والتنزيل القابل للاستئناف — تتطلب validator قوياً، لأن تركيب نطاقات bytes من استجابتين متكافئتين دلالياً لكنهما مختلفتان ينتج ملفاً تالفاً. وإن حسبت الـ ETag من رقم إصدار صف في قاعدة البيانات لا من الـ bytes المسلسلة، فهو weak، والأولى أن تعنونه بـ W/ لا أن تدّعي غير ذلك." },
      { t: "p", en: "Last-Modified is the older, weaker validator, paired with If-Modified-Since. Its resolution is one second, so two edits within the same second are indistinguishable and a client can cache a version that is already wrong. It also depends on clock agreement between machines. When both are present, a cache must prefer the ETag. Last-Modified still earns its place as a fallback and because it feeds the heuristic freshness rule: with no explicit max-age, many caches will guess a lifetime of about 10% of the resource's age since last modification — which is how responses you never intended to be cached end up cached for hours.", ar: "الـ Last-Modified هو الـ validator الأقدم والأضعف، ويقترن بـ If-Modified-Since. دقته ثانية واحدة، فتعديلان في نفس الثانية لا يمكن تمييزهما، ويستطيع client تخزين نسخة خاطئة بالفعل. كما أنه يعتمد على توافق الساعات بين الأجهزة. وحين يوجد الاثنان يجب أن يفضّل الـ cache الـ ETag. ويبقى للـ Last-Modified مكانه كبديل احتياطي ولأنه يغذّي قاعدة الحداثة التقديرية: فبلا max-age صريح تخمّن caches كثيرة عمراً يساوي ~10% من عمر المورد منذ آخر تعديل — وهكذا تنتهي استجابات لم تقصد تخزينها مخزّنةً لساعات." },
      { t: "p", en: "In ASP.NET Core, ResponseCaching middleware implements an in-process shared cache and deliberately refuses to store any response to a request carrying an Authorization header, and any response with Set-Cookie. That is correct and conservative, and it is also why teams report that \"response caching does nothing\" — their app is authenticated end to end. OutputCache, introduced in .NET 7, is a different thing: it caches on the server side by a policy you define, ignores the client's Cache-Control, and supports tag-based eviction, which makes it the right tool for authenticated APIs where HTTP caching cannot help.", ar: "في ASP.NET Core، ينفّذ الـ ResponseCaching middleware شكلاً من الـ cache المشترك داخل العملية، ويرفض عمداً تخزين أي استجابة لـ request يحمل Authorization header، وأي استجابة تحمل Set-Cookie. وهذا سلوك صحيح ومتحفّظ، وهو أيضاً سبب قول فرق كثيرة إن «الـ response caching لا يفعل شيئاً» — فتطبيقهم مُصادَق من طرف لطرف. أما الـ OutputCache المضاف في .NET 7 فشيء مختلف: يخزّن على جانب السيرفر وفق سياسة تحددها أنت، ويتجاهل Cache-Control القادم من الـ client، ويدعم الإخلاء بالـ tags، ما يجعله الأداة الصحيحة للـ APIs المصادَقة التي لا ينفع فيها الـ HTTP caching." },
      { t: "callout", kind: "note", en: "Nothing in HTTP lets you delete a response from a cache you do not control. Purge APIs are a CDN vendor feature, not a protocol feature, and they never reach the browser. The only universal invalidation mechanism is changing the URL.", ar: "لا شيء في الـ HTTP يتيح لك حذف استجابة من cache لا تتحكم فيه. واجهات الـ purge ميزة من مزوّد الـ CDN لا ميزة في البروتوكول، وهي لا تصل إلى المتصفح أبداً. آلية الإبطال الوحيدة الشاملة هي تغيير الـ URL." }
    ]},

    { key: "tradeoffs", blocks: [
      { t: "tradeoff",
        pros: {
          en: [
            "Cuts origin load by an order of magnitude with no application code change",
            "Moves latency from a cross-region round trip to a 10–20 ms edge hit",
            "Reduces egress bandwidth cost, often the largest line item on a read-heavy service",
            "Absorbs traffic spikes at the edge, so the origin never sees the peak",
            "304 revalidation keeps correctness while still removing the payload"
          ],
          ar: [
            "يخفض حمل الـ origin بمرتبة كاملة دون تغيير كود التطبيق",
            "ينقل زمن الاستجابة من رحلة عابرة للمناطق إلى إصابة على الحافة بـ 10–20 ملّي ثانية",
            "يقلّل تكلفة النطاق الصادر، وهي غالباً أكبر بند في خدمة قراءة كثيفة",
            "يمتص ذُرى الحركة عند الحافة، فلا يرى الـ origin القمة أبداً",
            "التحقق بـ 304 يحافظ على الصحة مع إزالة الـ payload"
          ]
        },
        cons: {
          en: [
            "Stale data is served by design; you are trading correctness for speed on purpose",
            "A wrong header cannot be recalled from browsers — the mistake outlives the deploy",
            "Cache keys and Vary make behaviour hard to reason about and harder to test",
            "Debugging becomes multi-layered: browser, CDN, reverse proxy, app cache all disagree",
            "Every cache layer is another place where a privacy bug can serve user A's data to user B"
          ],
          ar: [
            "البيانات القديمة تُخدَم بالتصميم؛ فأنت تقايض الصحة بالسرعة عن قصد",
            "الـ header الخاطئ لا يمكن سحبه من المتصفحات — والخطأ يعيش بعد النشر",
            "مفاتيح الـ cache والـ Vary تجعل السلوك صعب التحليل وأصعب في الاختبار",
            "التشخيص يصبح متعدد الطبقات: المتصفح والـ CDN والـ reverse proxy وcache التطبيق كلها تختلف",
            "كل طبقة cache مكان إضافي يمكن أن يخدم فيه خلل خصوصية بيانات المستخدم أ للمستخدم ب"
          ]
        },
        limits: {
          en: [
            "Only GET and HEAD are cacheable in practice; write paths get nothing",
            "Authenticated and personalised responses cannot use shared caches at all",
            "Last-Modified has one-second resolution and depends on clock agreement",
            "There is no protocol-level purge; invalidation is a vendor API plus a URL strategy",
            "High-cardinality Vary values silently reduce the hit rate to near zero"
          ],
          ar: [
            "عملياً لا يُخزَّن إلا GET و HEAD؛ ومسارات الكتابة لا تنال شيئاً",
            "الاستجابات المصادَقة والمخصّصة لا تستطيع استخدام الـ caches المشتركة إطلاقاً",
            "الـ Last-Modified دقته ثانية واحدة ويعتمد على توافق الساعات",
            "لا يوجد purge على مستوى البروتوكول؛ فالإبطال واجهة من المزوّد مع استراتيجية للـ URLs",
            "قيم الـ Vary عالية التنوّع تخفض نسبة الإصابة إلى ما يقارب الصفر بصمت"
          ]
        },
        alts: {
          en: [
            "OutputCache in ASP.NET Core — server-side, policy-driven, supports tag eviction for authenticated APIs",
            "A distributed cache (Redis) inside the app when the unit of caching is a domain object, not a response",
            "Content-hashed URLs plus max-age=1y+immutable for static assets — invalidation becomes free",
            "stale-while-revalidate when availability matters more than a few seconds of freshness",
            "ETag-only revalidation when you cannot serve stale but want to save bandwidth"
          ],
          ar: [
            "الـ OutputCache في ASP.NET Core — على جانب السيرفر، مبني على سياسة، ويدعم الإخلاء بالـ tags للـ APIs المصادَقة",
            "cache موزّع (Redis) داخل التطبيق حين تكون وحدة التخزين كائن مجال لا استجابة",
            "URLs مُهشَّرة المحتوى مع max-age=1y+immutable للأصول الثابتة — فيصبح الإبطال مجانياً",
            "الـ stale-while-revalidate حين تكون الإتاحة أهم من بضع ثوانٍ من الحداثة",
            "التحقق بالـ ETag فقط حين لا تستطيع خدمة نسخة قديمة لكنك تريد توفير النطاق"
          ]
        }
      }
    ]},

    { key: "mistakes", blocks: [
      { t: "mistake",
        title: { en: "Cache-Control: public on a personalised response", ar: "Cache-Control: public على استجابة مخصّصة" },
        body: { en: "A team adds public, max-age=300 to GET /api/me to cut dashboard latency. It works perfectly in dev, where there is one user. In production, behind a CDN, the first user to hit an edge node populates it and the next 300 seconds of visitors to that PoP receive that person's name, email and order history. This is not a performance bug; it is a data breach with an incident report, and rolling back the deploy does not clear the edge caches.", ar: "فريق يضيف public, max-age=300 إلى GET /api/me لتقليل زمن لوحة التحكم. يعمل تماماً في بيئة التطوير حيث يوجد مستخدم واحد. وفي الـ production خلف CDN، أول مستخدم يصيب node على الحافة يملؤها، فيستقبل زوار تلك النقطة خلال 300 ثانية التالية اسم ذلك الشخص وبريده وسجل طلباته. هذا ليس خلل أداء؛ بل تسريب بيانات بتقرير حادثة، والتراجع عن النشر لا يفرّغ caches الحافة." },
        fix: "// anything user-specific\nres.Headers.CacheControl = \"private, no-cache\";\n// anything sensitive (statements, tokens, PII documents)\nres.Headers.CacheControl = \"no-store\";" },
      { t: "mistake",
        title: { en: "Confusing no-cache with no-store", ar: "الخلط بين no-cache و no-store" },
        body: { en: "A developer sets no-cache on a bank statement PDF believing it means 'do not store this'. It means the opposite: store it, but revalidate before reuse. The file is written to the browser's disk cache and to any intermediary that stores it, and it remains readable on a shared machine long after logout. The audit finds the file in %LocalAppData% two months later.", ar: "مطوّر يضبط no-cache على ملف PDF لكشف حساب بنكي ظناً أنها تعني «لا تخزّن هذا». وهي تعني العكس: خزّنه لكن تحقّق قبل إعادة الاستخدام. فيُكتب الملف إلى cache القرص في المتصفح وإلى أي وسيط يخزّنه، ويبقى قابلاً للقراءة على جهاز مشترك بعد تسجيل الخروج بوقت طويل. ويجد التدقيق الملف في %LocalAppData% بعد شهرين." },
        fix: "res.Headers.CacheControl = \"no-store\";   // never written to any storage" },
      { t: "mistake",
        title: { en: "Forgetting Vary on a content-negotiated or language-aware endpoint", ar: "نسيان الـ Vary على endpoint يتفاوض على المحتوى أو يراعي اللغة" },
        body: { en: "An endpoint returns Arabic or English based on Accept-Language and is cached with public, max-age=600 but no Vary. The first Arabic-speaking visitor populates the edge, and every English speaker hitting that PoP for the next ten minutes gets Arabic. The same class of bug appears with Accept-Encoding, where a client that cannot decompress brotli receives brotli bytes and renders garbage.", ar: "endpoint يرجع العربية أو الإنجليزية بناءً على Accept-Language ويُخزَّن بـ public, max-age=600 بلا Vary. أول زائر عربي يملأ الحافة، فيحصل كل ناطق بالإنجليزية يصيب تلك النقطة خلال العشر دقائق التالية على العربية. ونفس فئة الخلل تظهر مع Accept-Encoding، حيث يستقبل client لا يفك ضغط brotli بايتات brotli فيعرض محتوى تالفاً." },
        fix: "res.Headers.Vary = \"Accept-Encoding, Accept-Language\";\n// better still: put the language in the URL (/ar/catalogue) and keep the key simple" },
      { t: "mistake",
        title: { en: "Computing a strong ETag by hashing the whole response", ar: "حساب ETag قوي بحساب hash للاستجابة كاملة" },
        body: { en: "An ETag filter buffers the entire response into a MemoryStream and SHA-256s it. On a 4 MB export endpoint under load this allocates a 4 MB buffer per request straight onto the Large Object Heap, drives Gen2 collections, and adds ~12 ms of hashing — all so that a 304 can save bandwidth the origin has already fully spent computing. The cheap answer is a version column the database already maintains.", ar: "filter للـ ETag يخزّن الاستجابة كاملة في MemoryStream ويحسب لها SHA-256. على endpoint تصدير بحجم 4 ميغابايت تحت الحمل، يخصّص هذا buffer بحجم 4 ميغابايت لكل request مباشرة على الـ Large Object Heap، ويدفع لجمع Gen2، ويضيف ~12 ملّي ثانية للـ hashing — وكل ذلك ليوفّر الـ 304 نطاقاً كان الـ origin قد أنفقه بالكامل في الحساب أصلاً. والإجابة الرخيصة عمود إصدار تحفظه قاعدة البيانات بالفعل." },
        fix: "// SQL Server rowversion / EF Core concurrency token\nvar etag = $\"W/\\\"{Convert.ToHexString(entity.RowVersion)}\\\"\";" },
      { t: "mistake",
        title: { en: "max-age=31536000 on a URL that is not content-hashed", ar: "max-age=31536000 على URL غير مُهشَّر المحتوى" },
        body: { en: "Someone applies the one-year static-asset policy to /js/app.js. The next release ships a breaking API change, but returning visitors keep the old bundle for up to a year and there is no way to reach them. The team ends up adding a cache-busting query string, which only helps new page loads, and then shipping a service worker purely to undo a header. Long max-age is only safe when the URL itself changes with the content.", ar: "أحدهم يطبّق سياسة السنة الخاصة بالأصول الثابتة على /js/app.js. الإصدار التالي يشحن تغييراً كاسراً في الـ API، لكن الزوّار العائدين يحتفظون بالحزمة القديمة حتى عام كامل ولا سبيل للوصول إليهم. وينتهي الفريق بإضافة query string لكسر الـ cache وهي لا تنفع إلا مع تحميلات الصفحات الجديدة، ثم بشحن service worker لمجرد التراجع عن header. الـ max-age الطويل آمن فقط حين يتغيّر الـ URL نفسه بتغيّر المحتوى." },
        fix: "/js/app.4f9c2a1b.js   →   Cache-Control: public, max-age=31536000, immutable" },
      { t: "mistake",
        title: { en: "Caching an error response", ar: "تخزين استجابة خطأ" },
        body: { en: "A middleware sets public, max-age=600 on every GET before the handler runs. A transient database timeout produces a 500, and the CDN happily stores it — because several error codes are heuristically cacheable. The database recovers in 20 seconds, but the endpoint keeps serving a 500 to an entire region for ten minutes, and the metrics show the origin as healthy the whole time.", ar: "middleware يضبط public, max-age=600 على كل GET قبل تشغيل الـ handler. ثم يُنتج timeout عابر في قاعدة البيانات استجابة 500، فيخزّنها الـ CDN بسعادة — لأن عدة أكواد أخطاء قابلة للتخزين تقديرياً. تتعافى قاعدة البيانات خلال 20 ثانية، لكن الـ endpoint يظل يخدم 500 لمنطقة كاملة عشر دقائق، والمقاييس تُظهر الـ origin سليماً طوال الوقت." },
        fix: "app.Use(async (ctx, next) =>\n{\n    ctx.Response.OnStarting(() =>\n    {\n        if (ctx.Response.StatusCode >= 400)\n            ctx.Response.Headers.CacheControl = \"no-store\";\n        return Task.CompletedTask;\n    });\n    await next();\n});" }
    ]},

    { key: "interview", blocks: [
      { t: "qa", level: "junior",
        q: { en: "What is the difference between no-cache and no-store?", ar: "ما الفرق بين no-cache و no-store؟" },
        a: { en: "no-cache allows the response to be stored but requires revalidation with the origin before every reuse — you still get 304s and saved bandwidth. no-store forbids writing it to any storage at all. The names are historically unfortunate: no-cache is the caching-with-validation option, and no-store is the one you want for anything sensitive.", ar: "الـ no-cache تسمح بتخزين الاستجابة لكنها توجب التحقق مع الـ origin قبل كل إعادة استخدام — فتظل تحصل على 304 وعلى توفير في النطاق. أما no-store فتمنع كتابتها في أي تخزين إطلاقاً. والتسمية سيئة تاريخياً: فـ no-cache هي خيار الـ caching مع التحقق، وno-store هي ما تريده لأي شيء حساس." } },
      { t: "qa", level: "junior",
        q: { en: "What does an ETag do?", ar: "ماذا يفعل الـ ETag؟" },
        a: { en: "It is an opaque version identifier for a representation. The client stores it and sends it back as If-None-Match; if it still matches, the server returns 304 with no body and the client reuses what it has. The value has no meaning to the client — it must not parse it — it is only ever compared for equality.", ar: "هو معرّف إصدار مبهم لتمثيل معيّن. يخزّنه الـ client ويعيده في If-None-Match؛ فإن ظل مطابقاً أرجع السيرفر 304 بلا body وأعاد الـ client استخدام ما لديه. والقيمة بلا معنى بالنسبة للـ client — ويجب ألا يحللها — فهي تُقارن للتساوي فقط." } },
      { t: "qa", level: "mid",
        q: { en: "Explain expiration caching versus validation caching, and when you would pick each.", ar: "اشرح الفرق بين expiration caching و validation caching، ومتى تختار كلاً منهما." },
        a: { en: "Expiration means the cache serves without contacting the origin at all — driven by max-age or s-maxage. You get zero latency and zero origin load, and you accept staleness up to the TTL. Validation means the cache always asks, but conditionally; the origin answers 304 when nothing changed. You still pay the round trip and the origin still computes the validator, but you save the payload. Pick expiration for content that is the same for everyone and tolerates being seconds or minutes old. Pick validation when you cannot serve stale data — per-user resources — but the payload is large enough that saving it matters.", ar: "الـ expiration يعني أن الـ cache يخدم دون أي اتصال بالـ origin — مدفوعاً بـ max-age أو s-maxage. تحصل على زمن استجابة صفر وحمل origin صفر، وتقبل قِدَماً يصل إلى الـ TTL. أما الـ validation فيعني أن الـ cache يسأل دائماً لكن بشكل مشروط؛ فيرد الـ origin بـ 304 حين لا يتغير شيء. تظل تدفع رحلة الذهاب والعودة ويظل الـ origin يحسب الـ validator، لكنك توفّر الـ payload. اختر الـ expiration لمحتوى واحد للجميع ويحتمل أن يكون قديماً بثوانٍ أو دقائق. واختر الـ validation حين لا تستطيع خدمة بيانات قديمة — الموارد الخاصة بكل مستخدم — لكن الـ payload كبير بما يجعل توفيره مهماً." } },
      { t: "qa", level: "mid",
        q: { en: "Why is Vary dangerous, and how would you keep a high hit rate?", ar: "لماذا الـ Vary خطر، وكيف تحافظ على نسبة إصابة عالية؟" },
        a: { en: "Vary multiplies the cache key. Each varied header creates a separate stored variant, so hit rate falls roughly in proportion to the cardinality of that header's values. Accept-Encoding is fine — three or four values. Accept-Language is borderline. User-Agent is catastrophic, since there are effectively unbounded distinct values, and Cookie is worse because every session is unique. The practical rules: vary only on what genuinely changes the bytes, push high-cardinality dimensions into the URL instead (/ar/catalogue rather than Vary: Accept-Language), and normalise at the edge — collapse Accept-Language down to a supported language before it reaches the cache key.", ar: "الـ Vary يضاعف مفتاح الـ cache. كل header مُتغيَّر عليه ينشئ نسخة مخزّنة منفصلة، فتهبط نسبة الإصابة بما يتناسب تقريباً مع تنوّع قيم ذلك الـ header. الـ Accept-Encoding مقبول — ثلاث أو أربع قيم. والـ Accept-Language على الحد. أما User-Agent فكارثي لأن قيمه غير محدودة عملياً، والـ Cookie أسوأ لأن كل جلسة فريدة. والقواعد العملية: تغيّر فقط على ما يغيّر الـ bytes فعلاً، وادفع الأبعاد عالية التنوّع إلى الـ URL بدلاً من ذلك (/ar/catalogue بدل Vary: Accept-Language)، ووحّد القيم عند الحافة — اختزل Accept-Language إلى لغة مدعومة قبل أن تصل إلى مفتاح الـ cache." } },
      { t: "qa", level: "mid",
        q: { en: "How do you invalidate a response you already told browsers to cache for a year?", ar: "كيف تُبطل استجابة أخبرت المتصفحات بالفعل أن تخزّنها لمدة عام؟" },
        a: { en: "You do not. There is no protocol mechanism to reach a browser cache. A CDN purge API clears the edge, but every client that already stored the response keeps it until expiry. That asymmetry is exactly why long max-age is only ever applied to content-hashed URLs: changing the content changes the filename, so the old URL is simply never requested again. If you have already shipped a long max-age on a stable URL, the only real recovery is to change the URL everywhere it is referenced and accept that old clients are stuck until they expire.", ar: "لا تفعل. لا توجد آلية في البروتوكول تصل إلى cache المتصفح. واجهة الـ purge في الـ CDN تنظّف الحافة، لكن كل client خزّن الاستجابة سيحتفظ بها حتى انتهاء صلاحيتها. وهذا اللاتماثل هو بالضبط سبب قصر الـ max-age الطويل على URLs مُهشَّرة المحتوى: فتغيير المحتوى يغيّر اسم الملف، ولا يُطلب الـ URL القديم مرة أخرى أبداً. وإن كنت قد شحنت max-age طويلاً على URL ثابت، فالتعافي الحقيقي الوحيد هو تغيير الـ URL في كل موضع يُشار إليه فيه، وقبول أن العملاء القدامى عالقون حتى تنتهي المدة." } },
      { t: "qa", level: "senior",
        q: { en: "Design a caching strategy for an API that mixes public catalogue data, authenticated user data, and rarely-changing reference data.", ar: "صمّم استراتيجية caching لـ API يخلط بيانات كتالوج عامة وبيانات مستخدم مصادَقة وبيانات مرجعية نادرة التغيّر." },
        a: { en: "Three tiers with different mechanisms. Reference data — countries, currencies, tax tables — gets a versioned URL (/v3/reference/countries) with public, max-age=86400 at the CDN, because it changes on a release cadence and the version in the path handles invalidation. Catalogue data gets public, max-age=30, s-maxage=300, stale-while-revalidate=60, so browsers stay reasonably fresh, the CDN absorbs the load, and an origin blip is invisible. User data gets private, no-cache with a weak ETag from the row version: no shared cache stores it, but repeat loads cost 150 bytes instead of 30 KB. Anything with financial or personal documents gets no-store. Then the one piece people forget: a middleware that forces no-store on any response with a status of 400 or above, so a transient failure is never cached for the TTL of the success path. If the authenticated tier still needs offload, that is OutputCache with per-user tags on the server side, not HTTP caching.", ar: "ثلاث طبقات بآليات مختلفة. البيانات المرجعية — الدول والعملات وجداول الضرائب — تأخذ URL مُصدَّراً (/v3/reference/countries) مع public, max-age=86400 على الـ CDN، لأنها تتغير بإيقاع الإصدارات والإصدار في المسار يتكفل بالإبطال. وبيانات الكتالوج تأخذ public, max-age=30, s-maxage=300, stale-while-revalidate=60، فتبقى المتصفحات طازجة بشكل معقول، ويمتص الـ CDN الحمل، ويصبح تعثّر الـ origin غير مرئي. وبيانات المستخدم تأخذ private, no-cache مع weak ETag من رقم إصدار الصف: فلا يخزّنها أي cache مشترك، لكن التحميلات المتكررة تكلّف 150 بايت بدل 30 كيلوبايت. وأي مستندات مالية أو شخصية تأخذ no-store. ثم القطعة التي ينساها الناس: middleware يفرض no-store على أي استجابة بحالة 400 فأعلى، حتى لا يُخزَّن فشل عابر بمدة صلاحية مسار النجاح. وإن ظلت الطبقة المصادَقة تحتاج تخفيفاً، فذلك OutputCache بـ tags لكل مستخدم على جانب السيرفر، لا HTTP caching." } },
      { t: "qa", level: "senior",
        q: { en: "Your CDN hit rate is 12% on an endpoint you configured for caching. How do you find out why?", ar: "نسبة الإصابة على الـ CDN هي 12% على endpoint ضبطته للـ caching. كيف تكتشف السبب؟" },
        a: { en: "Work down the chain from the response itself. First, check what the origin actually emits — not what the code intends: a Set-Cookie header added by session middleware, or an Authorization header on the request, makes most shared caches refuse to store regardless of Cache-Control. Second, look at the cache key: an unnecessary Vary, or query-string parameters the CDN includes by default, will fragment one logical resource into thousands of variants — tracking parameters like utm_source are the classic cause. Third, check the freshness lifetime: if only max-age is set and the CDN honours it, a 30-second TTL on traffic spread over many PoPs may simply not have enough requests per PoP per TTL window to ever hit. Fourth, look at the CDN's own cache status header per response and group misses by reason. In my experience the answer is a Set-Cookie or a query parameter about 80% of the time.", ar: "اعمل نزولاً في السلسلة بدءاً من الاستجابة نفسها. أولاً افحص ما يصدره الـ origin فعلاً لا ما ينويه الكود: فـ Set-Cookie أضافه middleware للجلسات، أو Authorization header على الـ request، يجعل معظم الـ caches المشتركة ترفض التخزين مهما كان Cache-Control. ثانياً انظر إلى مفتاح الـ cache: فـ Vary غير ضروري، أو معاملات query يضمّنها الـ CDN افتراضياً، تفتّت مورداً منطقياً واحداً إلى آلاف النسخ — ومعاملات التتبّع مثل utm_source هي السبب الكلاسيكي. ثالثاً افحص عمر الحداثة: فإن ضُبط max-age وحده واحترمه الـ CDN، فقد لا تكفي حركة موزّعة على نقاط حضور كثيرة بـ TTL مدته 30 ثانية لتحقيق أي إصابة أصلاً. رابعاً اقرأ header حالة الـ cache الخاص بالـ CDN لكل استجابة وجمّع الإخفاقات حسب السبب. وفي خبرتي تكون الإجابة Set-Cookie أو معامل query في نحو 80% من الحالات." } },
      { t: "qa", level: "staff",
        q: { en: "After a caching incident leaked one user's data at the edge, how do you make sure it cannot happen again across twenty services?", ar: "بعد حادثة caching سرّبت بيانات مستخدم على الحافة، كيف تضمن ألا تتكرر عبر عشرين خدمة؟" },
        a: { en: "Treat cacheability as a security control, not a performance setting, and make the safe state the default. Concretely: a shared middleware that emits Cache-Control: no-store on every response unless an endpoint explicitly opts in with an attribute — so silence can never mean public. A hard invariant in that middleware that refuses to emit public on any response produced for an authenticated principal, and fails the request in non-production rather than quietly downgrading, so the mistake is caught in CI. At the edge, a rule that strips or overrides Cache-Control for any response carrying Set-Cookie or an Authorization-bearing request, giving you defence in depth against a service that gets it wrong. Then a synthetic canary that fetches a personalised endpoint as two different users through the CDN and alerts if the second response contains the first user's identifier — that is the test that would actually have caught this incident. And finally, a documented purge runbook with a rehearsed drill, because the response time to the next incident matters more than the belief it will not happen.", ar: "عامل قابلية الـ caching كضابط أمني لا كإعداد أداء، واجعل الحالة الآمنة هي الافتراضية. عملياً: middleware مشترك يُصدر Cache-Control: no-store على كل استجابة ما لم يشترك endpoint صراحة عبر attribute — فلا يعني الصمت أبداً public. وثابت صارم في ذلك الـ middleware يرفض إصدار public على أي استجابة أُنتجت لهوية مصادَقة، ويُفشل الـ request في غير الـ production بدل الخفض الصامت، ليُلتقط الخطأ في الـ CI. وعلى الحافة قاعدة تحذف أو تتجاوز Cache-Control لأي استجابة تحمل Set-Cookie أو request يحمل Authorization، فتحصل على دفاع متعدد الطبقات ضد خدمة تخطئ. ثم canary اصطناعي يجلب endpoint مخصّصاً بهويتي مستخدمين مختلفين عبر الـ CDN ويُنذر إن احتوت الاستجابة الثانية معرّف المستخدم الأول — وهذا هو الاختبار الذي كان سيلتقط هذه الحادثة فعلاً. وأخيراً دليل تشغيل موثّق للـ purge مع تدريب مُجرَّب، لأن زمن الاستجابة للحادثة القادمة أهم من الاعتقاد بأنها لن تقع." } }
    ]},

    { key: "codereview", blocks: [
      { t: "review", severity: "high",
        title: { en: "Blanket caching applied before the handler runs", ar: "caching شامل يُطبَّق قبل تشغيل الـ handler" },
        bad: "app.Use(async (ctx, next) =>\n{\n    if (HttpMethods.IsGet(ctx.Request.Method))\n        ctx.Response.Headers.CacheControl = \"public, max-age=600\";\n    await next();\n});",
        good: "app.Use(async (ctx, next) =>\n{\n    ctx.Response.OnStarting(() =>\n    {\n        var h = ctx.Response.Headers;\n        if (h.ContainsKey(HeaderNames.CacheControl))       // endpoint opted in explicitly\n            return Task.CompletedTask;\n\n        var unsafeToShare =\n            ctx.Response.StatusCode >= 400 ||\n            ctx.User?.Identity?.IsAuthenticated == true ||\n            h.ContainsKey(HeaderNames.SetCookie);\n\n        h.CacheControl = unsafeToShare ? \"no-store\" : \"private, no-cache\";\n        return Task.CompletedTask;\n    });\n    await next();\n});",
        why: { en: "The bad version marks every GET as publicly shareable before it knows the status code, the identity, or whether a cookie will be set — so a 500 gets cached for ten minutes across a region, and an authenticated /me response is stored at the edge and served to strangers. The good version defaults to the safe state, decides at OnStarting when the response is actually known, and lets an endpoint opt in to public caching deliberately rather than inheriting it.", ar: "النسخة السيئة تصنّف كل GET كقابل للمشاركة العامة قبل أن تعرف الـ status code ولا الهوية ولا هل ستُضبط cookie — فتُخزَّن استجابة 500 عشر دقائق عبر منطقة كاملة، وتُخزَّن استجابة /me المصادَقة على الحافة وتُخدَم لغرباء. النسخة الجيدة تبدأ من الحالة الآمنة، وتقرر عند OnStarting حين تصبح الاستجابة معروفة فعلاً، وتترك للـ endpoint أن يشترك في الـ caching العام عن قصد بدل أن يرثه." }
      },
      { t: "review", severity: "medium",
        title: { en: "An ETag that costs more than it saves", ar: "ETag يكلّف أكثر مما يوفّر" },
        bad: "var json = JsonSerializer.Serialize(await _repo.GetExportAsync(id));\nvar etag = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(json)));\nResponse.Headers.ETag = $\"\\\"{etag}\\\"\";\nif (Request.Headers.IfNoneMatch == Response.Headers.ETag)\n    return StatusCode(304);\nreturn Content(json, \"application/json\");",
        good: "var version = await _repo.GetVersionAsync(id, ct);        // cheap indexed lookup\nvar etag = new EntityTagHeaderValue($\"W/\\\"{version}\\\"\", isWeak: true);\n\nif (Request.GetTypedHeaders().IfNoneMatch\n        .Any(t => t.Compare(etag, useStrongComparison: false)))\n    return StatusCode(StatusCodes.Status304NotModified);\n\nResponse.GetTypedHeaders().ETag = etag;\nreturn Ok(await _repo.GetExportAsync(id, ct));",
        why: { en: "The bad version does all the expensive work — query, serialize, allocate the full string, hash it — before discovering it could have returned 304, so the only thing saved is bandwidth. On a multi-megabyte export that string lands on the Large Object Heap on every request. It also compares the header by raw string equality, which breaks on a W/ prefix, on multiple values, and on the * wildcard. The good version derives the validator from a version the database already tracks, checks the precondition before loading the payload, and uses the typed comparison that implements the spec's weak-comparison rules.", ar: "النسخة السيئة تؤدي كل العمل المكلف — الاستعلام والتسلسل وتخصيص النص كاملاً وحساب الـ hash — قبل أن تكتشف أنها كانت تستطيع إرجاع 304، فلا يُوفَّر سوى النطاق. وعلى تصدير بحجم عدة ميغابايتات يهبط ذلك النص على الـ Large Object Heap في كل request. كما أنها تقارن الـ header بتساوي نصي خام، وهو ما ينكسر مع بادئة W/ ومع تعدد القيم ومع رمز * الشامل. أما النسخة الجيدة فتشتق الـ validator من إصدار تتبعه قاعدة البيانات أصلاً، وتفحص الشرط قبل تحميل الـ payload، وتستخدم المقارنة المُنمَّطة التي تطبّق قواعد المقارنة الضعيفة في المواصفة." }
      }
    ]},

    { key: "sysdesign", blocks: [
      { t: "p", en: "Caching is the cheapest capacity you will ever buy, and it is also the layer that decides the shape of everything in front of your origin. A read path designed to be cacheable — stable URLs, no cookies, no per-user variation, a small Vary set — lets you put a CDN in front and treat origin capacity as a function of write traffic plus cache misses rather than total traffic. A read path that is not cacheable forces every request through the whole stack, and no amount of horizontal scaling changes the unit economics.", ar: "الـ caching أرخص سعة ستشتريها على الإطلاق، وهو أيضاً الطبقة التي تحدد شكل كل ما يقع أمام الـ origin. مسار قراءة مصمَّم ليكون قابلاً للتخزين — URLs ثابتة، بلا cookies، بلا اختلاف لكل مستخدم، ومجموعة Vary صغيرة — يتيح لك وضع CDN في الأمام والتعامل مع سعة الـ origin كدالة في حركة الكتابة زائد إخفاقات الـ cache لا في الحركة الكلية. أما مسار القراءة غير القابل للتخزين فيدفع كل request عبر الطبقات كاملة، ولا يغيّر أي قدر من التوسّع الأفقي اقتصاديات الوحدة." },
      { t: "p", en: "The design decision that matters most is where invalidation lives, because it determines your consistency model. URL versioning makes invalidation free but pushes the burden onto whoever generates links. TTL-based expiry is simple and bounded but means you are permanently serving data up to the TTL old — which is a product decision, not a technical one, and should be written down. Explicit purge gives you precision but couples deploys to a vendor API and needs a retry path for when the purge fails.", ar: "قرار التصميم الأهم هو أين يعيش الإبطال، لأنه يحدد نموذج الاتساق لديك. تعيين الإصدار في الـ URL يجعل الإبطال مجانياً لكنه ينقل العبء إلى من يولّد الروابط. والانتهاء بالـ TTL بسيط ومحدود لكنه يعني أنك تخدم دائماً بيانات أقدم بمقدار الـ TTL — وهو قرار منتج لا قرار تقني، ويجب توثيقه. أما الـ purge الصريح فيعطيك دقة لكنه يربط النشر بواجهة مزوّد ويحتاج مسار إعادة محاولة حين يفشل." },
      { t: "ul",
        en: [
          "Static assets: content-hashed filenames plus max-age=31536000, immutable — the only place a one-year TTL is safe",
          "Public read APIs: short browser max-age, longer s-maxage at the CDN, plus stale-while-revalidate to survive origin blips",
          "Authenticated APIs: private, no-cache with ETags for bandwidth; use server-side OutputCache with tags when you need real offload",
          "Reference data: version the path (/v3/reference/...) so a deploy invalidates by changing the URL, not by purging",
          "Edge normalisation: strip tracking query parameters and collapse Accept-Language before the cache key is computed"
        ],
        ar: [
          "الأصول الثابتة: أسماء ملفات مُهشَّرة بالمحتوى مع max-age=31536000, immutable — وهو الموضع الوحيد الآمن لمدة سنة",
          "APIs القراءة العامة: max-age قصير للمتصفح، وs-maxage أطول على الـ CDN، مع stale-while-revalidate لتجاوز تعثّرات الـ origin",
          "APIs المصادَقة: private, no-cache مع ETags لتوفير النطاق؛ واستخدم OutputCache بـ tags على السيرفر حين تحتاج تخفيفاً حقيقياً",
          "البيانات المرجعية: ضع الإصدار في المسار (/v3/reference/...) ليُبطِل النشر بتغيير الـ URL لا بالـ purge",
          "التوحيد على الحافة: احذف معاملات التتبّع في الـ query واختزل Accept-Language قبل حساب مفتاح الـ cache"
        ]
      },
      { t: "callout", kind: "tip", en: "Write the acceptable staleness of each endpoint into the API contract, in seconds, next to the endpoint itself. \"Prices may be up to 5 minutes old\" is a product decision that a caching header silently encodes — make it explicit before someone discovers it during an incident.", ar: "اكتب حدّ القِدَم المقبول لكل endpoint في عقد الـ API، بالثواني، بجوار الـ endpoint نفسه. عبارة «قد تكون الأسعار أقدم بخمس دقائق» قرار منتج يرمّزه header الـ caching بصمت — فاجعله صريحاً قبل أن يكتشفه أحدهم أثناء حادثة." }
    ]},

    { key: "perf", blocks: [
      { t: "kv", rows: [
        { k: { en: "Latency", ar: "زمن الاستجابة" }, v: { en: "Edge hit 10–20 ms versus 80–250 ms to a cross-region origin; a browser hit is ~0 ms with no network at all", ar: "إصابة على الحافة 10–20 ملّي مقابل 80–250 ملّي إلى origin عابر للمناطق؛ وإصابة المتصفح ~0 ملّي بلا شبكة إطلاقاً" } },
        { k: { en: "Network", ar: "الشبكة" }, v: { en: "A 304 replaces a 30 KB body with ~150 bytes of headers — a 200:1 reduction on the wire while the round trip stays", ar: "استجابة 304 تستبدل body بحجم 30 كيلوبايت بـ ~150 بايت من الـ headers — تقليل 200:1 على السلك مع بقاء رحلة الذهاب والعودة" } },
        { k: { en: "CPU", ar: "المعالج" }, v: { en: "A cache hit skips serialization entirely; hashing a response for a strong ETag costs ~3 ms/MB and is pure added cost on a miss", ar: "إصابة الـ cache تتخطى التسلسل كلياً؛ وحساب hash لاستجابة من أجل ETag قوي يكلّف ~3 ملّي/ميغابايت وهو تكلفة مضافة صافية عند الإخفاق" } },
        { k: { en: "Database", ar: "قاعدة البيانات" }, v: { en: "A 90% edge hit rate turns 50k queries/min into 5k; the remaining load is dominated by misses clustering at TTL expiry", ar: "نسبة إصابة 90% على الحافة تحوّل 50 ألف استعلام/دقيقة إلى 5 آلاف؛ والحمل المتبقي تهيمن عليه إخفاقات تتكتل عند انتهاء الـ TTL" } },
        { k: { en: "Memory", ar: "الذاكرة" }, v: { en: "Buffering a response to compute an ETag allocates the full body per request — above 85 KB it lands on the Large Object Heap and drives Gen2", ar: "تخزين الاستجابة لحساب ETag يخصّص الجسم كاملاً لكل request — وفوق 85 كيلوبايت يهبط على الـ Large Object Heap ويدفع لجمع Gen2" } },
        { k: { en: "Scalability", ar: "قابلية التوسّع" }, v: { en: "Every Vary dimension divides the hit rate; a cacheable read path makes origin capacity a function of writes plus misses, not of total traffic", ar: "كل بُعد في الـ Vary يقسّم نسبة الإصابة؛ ومسار القراءة القابل للتخزين يجعل سعة الـ origin دالة في الكتابات زائد الإخفاقات لا في الحركة الكلية" } }
      ]}
    ]},

    { key: "debug", blocks: [
      { t: "ul",
        en: [
          "curl -sI https://api.example.com/catalogue | grep -iE 'cache-control|etag|vary|age|set-cookie' — read what the origin actually emits, not what the code intends",
          "The Age response header tells you how many seconds the shared cache has held the response; Age: 0 on every request means you are never hitting",
          "curl -H 'If-None-Match: \"abc\"' -i URL to confirm the 304 path works and returns no body",
          "Compare the same URL with and without ?utm_source=x — if the second is always a miss, the CDN includes query strings in the cache key",
          "Chrome DevTools → Network → Size column: 'disk cache' or 'memory cache' means expiration, '304' means validation, a byte count means neither",
          "Fetch the origin directly, bypassing the CDN, and diff the header sets — a Set-Cookie added by session middleware is the most common silent cache disabler"
        ],
        ar: [
          "curl -sI https://api.example.com/catalogue | grep -iE 'cache-control|etag|vary|age|set-cookie' — اقرأ ما يصدره الـ origin فعلاً لا ما ينويه الكود",
          "الـ Age header يخبرك كم ثانية احتفظ الـ cache المشترك بالاستجابة؛ وAge: 0 في كل request يعني أنك لا تصيب أبداً",
          "curl -H 'If-None-Match: \"abc\"' -i URL للتأكد أن مسار الـ 304 يعمل ولا يرجع body",
          "قارن نفس الـ URL مع ?utm_source=x وبدونه — فإن كان الثاني إخفاقاً دائماً، فالـ CDN يضمّن الـ query في مفتاح الـ cache",
          "أدوات Chrome ← Network ← عمود Size: قيمة 'disk cache' أو 'memory cache' تعني expiration، و'304' تعني validation، وعدد بايتات يعني لا هذا ولا ذاك",
          "اجلب من الـ origin مباشرة متجاوزاً الـ CDN وقارن مجموعتَي الـ headers — فـ Set-Cookie يضيفه middleware الجلسات هو أشهر معطّل صامت للـ caching"
        ]
      },
      { t: "callout", kind: "tip", en: "When a stale response is reported, first establish which layer served it: check Age and the CDN's cache-status header, then retry with a cache-busting query parameter. If the busted URL is correct, the bug is in the cache configuration; if it is also wrong, the origin is producing stale data and caching is innocent.", ar: "حين يُبلَّغ عن استجابة قديمة، حدد أولاً أي طبقة خدمتها: افحص الـ Age وheader حالة الـ cache لدى الـ CDN، ثم أعد المحاولة بمعامل query يكسر الـ cache. فإن كان الـ URL المكسور صحيحاً فالخلل في إعداد الـ caching؛ وإن كان خاطئاً أيضاً فالـ origin ينتج بيانات قديمة والـ caching بريء." }
    ]},

    { key: "realworld", blocks: [
      { t: "p", en: "Caching strategy tends to be the single largest architectural difference between systems that serve reads cheaply and systems that do not. The industries below are not caching because they read a blog post about it; they are caching because their traffic shape makes the origin economically impossible otherwise.", ar: "استراتيجية الـ caching غالباً هي أكبر فارق معماري منفرد بين أنظمة تخدم القراءات بثمن رخيص وأخرى لا تفعل. والصناعات أدناه لا تستخدم الـ caching لأنها قرأت مقالاً عنه؛ بل لأن شكل حركتها يجعل الـ origin مستحيلاً اقتصادياً بدونه." },
      { t: "ul",
        en: [
          "News and content platforms: an article is identical for millions of readers, so a short TTL plus stale-while-revalidate absorbs a traffic spike that would otherwise take the origin down",
          "E-commerce catalogues: product pages cached at the edge while price and stock are fetched separately, because the two have completely different staleness budgets",
          "Media streaming: segment files are immutable by construction and cached for a year, which is the only reason a CDN can serve them at that scale",
          "Public data and mapping APIs: tiles and reference datasets are versioned in the URL so a new release is a new path and invalidation never happens"
        ],
        ar: [
          "منصات الأخبار والمحتوى: المقال واحد لملايين القرّاء، فـ TTL قصير مع stale-while-revalidate يمتص ذروة حركة كانت ستُسقط الـ origin",
          "كتالوجات التجارة الإلكترونية: صفحات المنتجات مخزّنة على الحافة بينما يُجلب السعر والمخزون منفصلين، لأن لكل منهما ميزانية قِدَم مختلفة تماماً",
          "بث الوسائط: ملفات المقاطع ثابتة بحكم البناء وتُخزَّن لعام، وهو السبب الوحيد الذي يمكّن الـ CDN من خدمتها بذلك الحجم",
          "APIs البيانات العامة والخرائط: البلاطات ومجموعات البيانات المرجعية مُصدَّرة في الـ URL، فالإصدار الجديد مسار جديد ولا يحدث إبطال أبداً"
        ]
      }
    ]},

    { key: "exercises", blocks: [
      { t: "ex", diff: "easy", en: "Take three endpoints from a service you work on and write down, for each, the exact Cache-Control value you would set and one sentence justifying it. Then curl each one and compare what you intended with what the origin actually emits today.", ar: "خذ ثلاثة endpoints من خدمة تعمل عليها واكتب لكل منها قيمة Cache-Control التي ستضبطها بالضبط مع جملة واحدة تبرّرها. ثم نفّذ curl على كل منها وقارن ما قصدته بما يصدره الـ origin فعلاً اليوم." },
      { t: "ex", diff: "medium", en: "Add weak ETag support to a GET endpoint using a database version column rather than hashing the body. Write an integration test that asserts the second request with If-None-Match returns 304, has an empty body, and never touches the repository method that loads the payload.", ar: "أضف دعم weak ETag إلى endpoint من نوع GET باستخدام عمود إصدار في قاعدة البيانات بدل حساب hash للجسم. واكتب اختبار تكامل يتحقق أن الـ request الثاني بـ If-None-Match يرجع 304 بجسم فارغ ولا يلمس أبداً دالة المستودع التي تحمّل الـ payload." },
      { t: "ex", diff: "hard", en: "Build a caching middleware that defaults every response to no-store and requires an explicit opt-in attribute for anything shareable, refuses to emit public when the principal is authenticated or Set-Cookie is present, and throws in Development instead of silently downgrading. Cover all four rules with tests.", ar: "ابنِ middleware للـ caching يجعل كل استجابة no-store افتراضياً ويطلب attribute صريحاً لأي شيء قابل للمشاركة، ويرفض إصدار public حين تكون الهوية مصادَقة أو يوجد Set-Cookie، ويرمي استثناءً في بيئة التطوير بدل الخفض الصامت. وغطِّ القواعد الأربع كلها باختبارات." },
      { t: "ex", diff: "senior", en: "Audit one production service end to end: list every GET endpoint with its current Cache-Control, its measured CDN hit rate, and its acceptable staleness in seconds as agreed with the product owner. Identify the two endpoints where a change buys the most origin offload, ship them, and report the before/after hit rate and origin CPU.", ar: "دقّق خدمة production واحدة من طرف لطرف: اسرد كل endpoint من نوع GET مع قيمة Cache-Control الحالية، ونسبة الإصابة المقيسة على الـ CDN، وحدّ القِدَم المقبول بالثواني كما اتُّفق عليه مع مالك المنتج. وحدّد الـ endpointين اللذين يشتري التغيير فيهما أكبر تخفيف عن الـ origin، وأطلقهما، وأبلغ عن نسبة الإصابة واستهلاك الـ CPU قبل وبعد." }
    ]},

    { key: "refs", blocks: [
      { t: "ref", label: { en: "RFC 9111 — HTTP Caching", ar: "RFC 9111 — الـ HTTP Caching" }, url: "https://www.rfc-editor.org/rfc/rfc9111.html", meta: { en: "Spec", ar: "مواصفة" } },
      { t: "ref", label: { en: "RFC 9110 §13 — Conditional requests", ar: "RFC 9110 §13 — الـ requests المشروطة" }, url: "https://www.rfc-editor.org/rfc/rfc9110.html#name-conditional-requests", meta: { en: "Spec", ar: "مواصفة" } },
      { t: "ref", label: { en: "RFC 5861 — stale-while-revalidate and stale-if-error", ar: "RFC 5861 — stale-while-revalidate و stale-if-error" }, url: "https://www.rfc-editor.org/rfc/rfc5861.html", meta: { en: "Spec", ar: "مواصفة" } },
      { t: "ref", label: { en: "Response caching in ASP.NET Core", ar: "الـ response caching في ASP.NET Core" }, url: "https://learn.microsoft.com/aspnet/core/performance/caching/response", meta: { en: "Docs", ar: "توثيق" } },
      { t: "ref", label: { en: "Output caching middleware in ASP.NET Core", ar: "الـ output caching middleware في ASP.NET Core" }, url: "https://learn.microsoft.com/aspnet/core/performance/caching/output", meta: { en: "Docs", ar: "توثيق" } },
      { t: "ref", label: { en: "MDN — HTTP caching guide", ar: "MDN — دليل الـ HTTP caching" }, url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching", meta: { en: "Reference", ar: "مرجع" } }
    ]}
  ],

  quiz: [
    {
      q: { en: "Which header value guarantees a response is never written to disk or memory by any cache?", ar: "أي قيمة header تضمن ألا تُكتب الاستجابة أبداً على قرص أو ذاكرة في أي cache؟" },
      options: [
        { en: "Cache-Control: no-cache", ar: "Cache-Control: no-cache" },
        { en: "Cache-Control: private", ar: "Cache-Control: private" },
        { en: "Cache-Control: no-store", ar: "Cache-Control: no-store" },
        { en: "Cache-Control: max-age=0", ar: "Cache-Control: max-age=0" }
      ],
      correct: 2,
      why: { en: "no-store is the only directive that forbids storage. no-cache permits storage and only requires revalidation before reuse; private permits storage in the browser but not in shared caches; max-age=0 makes the response immediately stale but still storable and revalidatable.", ar: "الـ no-store هي التوجيه الوحيد الذي يمنع التخزين. أما no-cache فتسمح بالتخزين وتوجب التحقق قبل إعادة الاستخدام فقط؛ وprivate تسمح بالتخزين في المتصفح لا في الـ caches المشتركة؛ وmax-age=0 تجعل الاستجابة قديمة فوراً لكنها تظل قابلة للتخزين والتحقق." }
    },
    {
      q: { en: "An endpoint returns Arabic or English based on Accept-Language and is served with public, max-age=600 and no Vary. What happens behind a CDN?", ar: "endpoint يرجع العربية أو الإنجليزية بناءً على Accept-Language ويُخدَم بـ public, max-age=600 بلا Vary. ماذا يحدث خلف CDN؟" },
      options: [
        { en: "The CDN detects the language automatically and stores both variants", ar: "الـ CDN يكتشف اللغة تلقائياً ويخزّن النسختين" },
        { en: "Whichever language populated the edge first is served to everyone for 10 minutes", ar: "اللغة التي ملأت الحافة أولاً تُخدَم للجميع لمدة 10 دقائق" },
        { en: "The CDN refuses to cache responses that depend on request headers", ar: "الـ CDN يرفض تخزين استجابات تعتمد على headers الـ request" },
        { en: "Nothing — Accept-Language is part of the default cache key", ar: "لا شيء — الـ Accept-Language جزء من مفتاح الـ cache الافتراضي" }
      ],
      correct: 1,
      why: { en: "The default cache key is the method plus the URI. Without Vary the cache has no idea the response depended on a request header, so the first stored variant is served to every subsequent visitor for the full TTL. Either add Vary: Accept-Language, or better, put the language in the URL so the key is unambiguous.", ar: "مفتاح الـ cache الافتراضي هو الـ method مع الـ URI. وبلا Vary لا يعرف الـ cache أن الاستجابة اعتمدت على header في الـ request، فتُخدَم أول نسخة مخزّنة لكل زائر لاحق طوال مدة الـ TTL. فإما أن تضيف Vary: Accept-Language، أو الأفضل أن تضع اللغة في الـ URL ليصبح المفتاح قاطعاً." }
    },
    {
      q: { en: "You shipped Cache-Control: public, max-age=31536000 on /js/app.js by mistake. What is the effective fix?", ar: "شحنت بالخطأ Cache-Control: public, max-age=31536000 على /js/app.js. ما الإصلاح الفعّال؟" },
      options: [
        { en: "Purge the CDN — that clears every client copy", ar: "نفّذ purge على الـ CDN — فذلك ينظّف كل نسخة لدى العملاء" },
        { en: "Redeploy with max-age=0; browsers pick up the new header on the next request", ar: "أعد النشر بـ max-age=0؛ فالمتصفحات ستلتقط الـ header الجديد في الـ request التالي" },
        { en: "Change the URL — a CDN purge cannot reach browser caches, which hold the old copy until it expires", ar: "غيّر الـ URL — فالـ purge على الـ CDN لا يصل إلى caches المتصفحات التي تحتفظ بالنسخة القديمة حتى انتهاء صلاحيتها" },
        { en: "Send Clear-Site-Data on the next API call to reset all clients", ar: "أرسل Clear-Site-Data في الاستدعاء التالي لإعادة ضبط كل العملاء" }
      ],
      correct: 2,
      why: { en: "A fresh response is served without any request being sent, so the browser never sees the new header — redeploying changes nothing for clients that already stored it, and a CDN purge only clears the edge. Changing the URL is the only universal invalidation mechanism, which is exactly why long TTLs belong on content-hashed filenames.", ar: "الاستجابة الطازجة تُخدَم دون إرسال أي request، فلا يرى المتصفح الـ header الجديد أصلاً — وإعادة النشر لا تغيّر شيئاً لدى العملاء الذين خزّنوها، والـ purge على الـ CDN ينظّف الحافة فقط. تغيير الـ URL هو آلية الإبطال الشاملة الوحيدة، ولهذا بالضبط تنتمي المدد الطويلة إلى أسماء ملفات مُهشَّرة بالمحتوى." }
    },
    {
      q: { en: "Your endpoint sets public, max-age=300 but the CDN hit rate is near zero. Which cause is most likely?", ar: "الـ endpoint لديك يضبط public, max-age=300 لكن نسبة الإصابة على الـ CDN تقارب الصفر. أي سبب هو الأرجح؟" },
      options: [
        { en: "The response is missing an ETag, so the CDN cannot store it", ar: "الاستجابة بلا ETag، فلا يستطيع الـ CDN تخزينها" },
        { en: "Session middleware attaches Set-Cookie to every response, which makes shared caches refuse to store it", ar: "middleware الجلسات يرفق Set-Cookie بكل استجابة، فترفض الـ caches المشتركة التخزين" },
        { en: "max-age=300 is too short for any CDN to bother caching", ar: "مدة 300 ثانية أقصر من أن يهتم أي CDN بتخزينها" },
        { en: "HTTP/2 disables shared caching by design", ar: "الـ HTTP/2 يعطّل الـ caching المشترك بالتصميم" }
      ],
      correct: 1,
      why: { en: "A response carrying Set-Cookie is per-client by definition, so shared caches decline to store it regardless of Cache-Control — and session middleware often adds it to every response without anyone noticing. ETags are unrelated to storability; they only enable revalidation. The other two options are simply false.", ar: "الاستجابة التي تحمل Set-Cookie خاصة بكل عميل بالتعريف، فترفض الـ caches المشتركة تخزينها مهما كان Cache-Control — وmiddleware الجلسات يضيفها غالباً إلى كل استجابة دون أن ينتبه أحد. والـ ETags لا علاقة لها بقابلية التخزين؛ فهي تتيح التحقق فقط. أما الخياران الآخران فخاطئان ببساطة." }
    },
    {
      q: { en: "Which statement about weak and strong ETags is correct?", ar: "أي عبارة عن الـ ETags الضعيفة والقوية صحيحة؟" },
      options: [
        { en: "Weak ETags cannot be used with If-None-Match at all", ar: "الـ weak ETags لا تُستخدم مع If-None-Match إطلاقاً" },
        { en: "A strong ETag asserts byte-for-byte identity and is required for Range requests; a weak one asserts only semantic equivalence", ar: "الـ strong ETag يؤكد التطابق بايتاً ببايت ويلزم لطلبات الـ Range؛ والضعيف يؤكد التكافؤ الدلالي فقط" },
        { en: "Weak ETags are computed on the server, strong ones on the client", ar: "الـ weak ETags تُحسب على السيرفر والقوية على الـ client" },
        { en: "A strong ETag must be a SHA-256 hash of the response body", ar: "الـ strong ETag يجب أن يكون SHA-256 لجسم الاستجابة" }
      ],
      correct: 1,
      why: { en: "Weak comparison is exactly what If-None-Match uses, so option 1 is wrong. The real distinction is that a strong validator guarantees identical bytes, which is what makes byte-range stitching safe; a weak validator only promises the representation is equivalent enough to reuse. How you compute the value is unconstrained — a row version is a perfectly good weak validator.", ar: "المقارنة الضعيفة هي بالضبط ما يستخدمه If-None-Match، فالخيار الأول خاطئ. والتمييز الحقيقي أن الـ validator القوي يضمن تطابق الـ bytes، وهو ما يجعل تركيب نطاقات الـ bytes آمناً؛ أما الضعيف فيَعِد فقط بأن التمثيل مكافئ بما يكفي لإعادة الاستخدام. وطريقة حساب القيمة غير مقيّدة — فرقم إصدار الصف validator ضعيف ممتاز." }
    }
  ]
};
```

NEXT: rest-constraints
