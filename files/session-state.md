```js
const sessionStateLesson = {
  id: "session-state",
  moduleId: "foundations",
  title: { en: "Where session state goes", ar: "إلى أين تذهب حالة الجلسة" },
  summary: { en: "HTTP forgets you between requests, so something has to remember who you are — the cookie, a signed token, or a shared store — and each choice costs something different.", ar: "الـ HTTP ينسى المستخدم بين request وآخر، لذلك يجب أن يتذكّره شيء ما — الـ cookie، أو token موقّع، أو مخزن مشترك — ولكل خيار تكلفة مختلفة." },
  mins: 14,
  sections: [

    { key: "why", blocks: [
      { t: "p",
        en: "Every HTTP request arrives with no memory of the one before it. If a user logged in a second ago, the next request does not know that unless the user carries proof with them. Session state is the small amount of data the server needs to remember about one user across several requests — who they are, what is in their cart, which step of a wizard they reached. This lesson is about the three places that data can live, and what each place costs you.",
        ar: "كل HTTP request يصل بلا ذاكرة عن الذي سبقه. فإذا سجّل المستخدم الدخول قبل ثانية، لا يعرف الـ request التالي ذلك إلا إذا حمل المستخدم معه إثباتاً. حالة الجلسة (session state) هي القدر الصغير من البيانات التي يحتاج الخادم أن يتذكّرها عن مستخدم واحد عبر عدة requests — من هو، وما في سلته، وأي خطوة بلغ في نموذج متعدد الخطوات. وهذا الدرس عن الأماكن الثلاثة التي يمكن أن تعيش فيها هذه البيانات، وما تكلّفه كل واحدة منها." },

      { t: "kv", rows: [
        { k: { en: "Session", ar: "Session" },
          v: { en: "One user's continuous visit to your app — from login until logout or timeout. It is a concept, not a technology.", ar: "زيارة مستخدم واحد المتصلة لتطبيقك — من تسجيل الدخول حتى الخروج أو انتهاء المهلة. وهي مفهوم لا تقنية." } },
        { k: { en: "Cookie", ar: "Cookie" },
          v: { en: "A small piece of text the server tells the browser to store, and the browser sends back on every later request to that site. Limited to about 4 KB.", ar: "نص صغير يطلب الخادم من المتصفح تخزينه، ويعيده المتصفح مع كل request لاحق لذلك الموقع. وحجمه محدود بنحو 4 كيلوبايت." } },
        { k: { en: "Session ID", ar: "Session ID" },
          v: { en: "A long random string that means nothing on its own. The server uses it as a key to look up the real data it stored somewhere else.", ar: "سلسلة عشوائية طويلة لا تعني شيئاً بذاتها. يستخدمها الخادم كمفتاح ليبحث عن البيانات الحقيقية التي خزّنها في مكان آخر." } },
        { k: { en: "JWT", ar: "JWT" },
          v: { en: "JSON Web Token: a small JSON document plus a signature. The data is inside the token itself, and the signature lets the server prove nobody edited it.", ar: "JSON Web Token: مستند JSON صغير مع توقيع. البيانات داخل الـ token نفسه، والتوقيع يتيح للخادم إثبات أن أحداً لم يعدّله." } },
        { k: { en: "Session store", ar: "Session store" },
          v: { en: "A shared database — usually Redis, an in-memory key/value store — that every app server can read, so any server can serve any user.", ar: "قاعدة بيانات مشتركة — غالباً Redis، وهو مخزن مفاتيح وقيم في الذاكرة — يستطيع كل خادم تطبيق قراءتها، فيخدم أي خادم أي مستخدم." } },
        { k: { en: "Sticky session", ar: "Sticky session" },
          v: { en: "A load balancer setting that keeps sending one user to the same server, so that server's memory keeps working as the store.", ar: "إعداد في الـ load balancer يبقي إرسال مستخدم واحد إلى الخادم نفسه، فتستمر ذاكرة ذلك الخادم في العمل كمخزن." } }
      ]},

      { t: "p",
        en: "Think of a cloakroom at a theatre. You can carry your coat with you all evening — that is the cookie holding the data. You can hand it over and keep a numbered ticket — that is a session ID pointing at a server-side store. Or you can carry a sealed, stamped envelope the staff can verify without opening any records — that is a JWT. The coat is heavy to carry, the ticket is useless if the cloakroom burns down, and the envelope cannot be cancelled once handed out. Those three weaknesses are exactly the three trade-offs in this lesson.",
        ar: "تخيّل غرفة معاطف في مسرح. يمكنك حمل معطفك معك طوال الأمسية — وهذا هو الـ cookie الذي يحمل البيانات. أو تسلّمه وتحتفظ بتذكرة مرقّمة — وهذه هي الـ session ID التي تشير إلى مخزن على الخادم. أو تحمل ظرفاً مختوماً يستطيع الموظفون التحقق منه دون فتح أي سجل — وهذا هو الـ JWT. المعطف ثقيل الحمل، والتذكرة بلا قيمة إذا احترقت الغرفة، والظرف لا يمكن إلغاؤه بعد تسليمه. وهذه النقاط الثلاث هي بعينها المقايضات الثلاث في هذا الدرس." },

      { t: "p",
        en: "The running example for the whole lesson is one online store API: a user signs in, adds items to a cart, then checks out. Three copies of the API run behind a load balancer — a component that spreads incoming requests across the three copies. Nothing in the story is unusual, and that is the point: session state only becomes hard the moment there is more than one server.",
        ar: "المثال المتّبع في الدرس كله هو API لمتجر إلكتروني واحد: مستخدم يسجّل الدخول، ثم يضيف منتجات إلى سلة، ثم يتمّ الشراء. وتعمل ثلاث نسخ من هذا الـ API خلف load balancer — وهو مكوّن يوزّع الطلبات الواردة على النسخ الثلاث. لا شيء غريب في القصة، وهذا هو المقصود: حالة الجلسة لا تصير مشكلة إلا لحظة وجود أكثر من خادم واحد." },

      { t: "callout", kind: "note",
        en: "Session state and authentication are related but not the same. Authentication answers \"who is this user\"; session state is any data you keep about them between requests, including who they are. In practice the same cookie usually carries both, which is why the two topics are always discussed together.",
        ar: "حالة الجلسة والمصادقة (authentication) مرتبطتان لكنهما ليستا الشيء نفسه. المصادقة تجيب عن «من هذا المستخدم»، أما حالة الجلسة فهي أي بيانات تحتفظ بها عنه بين الطلبات، ومنها هويته. وعملياً يحمل الـ cookie نفسه الاثنين عادةً، ولهذا يُناقش الموضوعان معاً دائماً." }
    ]},

    { key: "problem", blocks: [
      { t: "p",
        en: "The store API started as one server, and the cart lived in a dictionary in memory keyed by session ID. That worked perfectly, because every request from every user reached the same process. When traffic grew, two more copies were started behind the load balancer, and support tickets appeared within an hour: \"I added three items and my cart is empty\", \"it logs me out at random\".",
        ar: "بدأ الـ API لمتجرنا بخادم واحد، وكانت السلة تعيش في dictionary في الذاكرة مفتاحه الـ session ID. ونجح ذلك تماماً، لأن كل request من كل مستخدم يصل إلى العملية نفسها. ولمّا كبرت حركة الاستخدام، شُغّلت نسختان إضافيتان خلف الـ load balancer، فظهرت تذاكر الدعم خلال ساعة: «أضفت ثلاثة منتجات وسلّتي فارغة»، «يخرجني من الحساب عشوائياً»." },

      { t: "p",
        en: "The reason is arithmetic, not a bug. The login wrote the cart into server A's memory. The load balancer sends the next request to whichever server is free, so it has roughly a one-in-three chance of returning to A. Two out of every three requests — about 67% — land on B or C, which have never heard of that session ID, so they treat the user as a stranger. Logs showed 41,000 sessions created in one hour for 14,000 real visitors: each visitor was creating a fresh session almost every time the load balancer moved them.",
        ar: "والسبب حساب لا خلل. فتسجيل الدخول كتب السلة في ذاكرة الخادم A. والـ load balancer يرسل الـ request التالي إلى أي خادم متفرّغ، فاحتمال عودته إلى A نحو واحد من ثلاثة. أي أن اثنين من كل ثلاثة requests — قرابة 67% — يهبطان على B أو C، وهما لم يسمعا قط بذلك الـ session ID، فيعاملان المستخدم كغريب. وأظهرت الـ logs إنشاء 41,000 جلسة في ساعة واحدة لأربعة عشر ألف زائر حقيقي: أي أن كل زائر كان ينشئ جلسة جديدة كلّما نقله الـ load balancer تقريباً." },

      { t: "kv", rows: [
        { k: { en: "In-memory, 1 server", ar: "في الذاكرة، خادم واحد" },
          v: { en: "Read costs about 50 nanoseconds — effectively free. Works until the day you add a second server or restart the first one.", ar: "القراءة تكلّف نحو 50 نانوثانية — أي مجانية عملياً. وتعمل حتى اليوم الذي تضيف فيه خادماً ثانياً أو تعيد تشغيل الأول." } },
        { k: { en: "In-memory, 3 servers", ar: "في الذاكرة، ثلاثة خوادم" },
          v: { en: "About 67% of requests hit a server that does not have the session. The user sees random logouts and an emptying cart.", ar: "نحو 67% من الطلبات تصيب خادماً لا يملك الجلسة. فيرى المستخدم خروجاً عشوائياً وسلّة تفرغ." } },
        { k: { en: "Sticky sessions", ar: "Sticky sessions" },
          v: { en: "Logouts stop, but every deploy restarts the servers and drops every cart on them. Traffic also piles unevenly on whichever server holds the busy users.", ar: "يتوقف الخروج العشوائي، لكن كل نشر يعيد تشغيل الخوادم فيُسقط كل سلة عليها. كما تتكدّس الحركة بشكل غير متوازن على الخادم الذي يحمل المستخدمين النشطين." } },
        { k: { en: "Shared store (Redis)", ar: "مخزن مشترك (Redis)" },
          v: { en: "Random logouts go to zero and carts survive deploys. Each request pays one network round trip inside the data centre — measured at 0.8 ms here.", ar: "يصير الخروج العشوائي صفراً وتنجو السلال من عمليات النشر. ويدفع كل request رحلة شبكة واحدة داخل مركز البيانات — قيست هنا بـ0.8 مللي ثانية." } }
      ]},

      { t: "p",
        en: "Moving the cart to Redis fixed the tickets and added 0.8 milliseconds to the average request — meaning a typical request went from 42 ms to 43 ms, which no user can perceive. That is the shape of almost every session decision: you trade a tiny, predictable cost for the ability to run more than one server.",
        ar: "نقل السلة إلى Redis أنهى التذاكر وأضاف 0.8 مللي ثانية إلى متوسط الـ request — أي أن request نموذجياً صار 43 مللي ثانية بدل 42، وهو فرق لا يشعر به أي مستخدم. وهذا شكل كل قرار جلسة تقريباً: تدفع تكلفة صغيرة ومتوقعة مقابل القدرة على تشغيل أكثر من خادم واحد." }
    ]},

    { key: "internals", blocks: [
      { t: "p",
        en: "There are only three physical places session data can be, and every framework is a variation on them. Place one: inside the cookie, so the browser stores and carries the data. Place two: on the server in a shared store, with the cookie carrying only a random session ID that points at it. Place three: inside a signed token the browser carries, where the server trusts the content because it can verify the signature rather than look anything up. ASP.NET Core ships support for all three.",
        ar: "هناك ثلاثة أماكن فيزيائية فقط يمكن أن تكون فيها بيانات الجلسة، وكل إطار عمل هو تنويع عليها. المكان الأول: داخل الـ cookie، فيخزّن المتصفح البيانات ويحملها. المكان الثاني: على الخادم في مخزن مشترك، ولا يحمل الـ cookie إلا session ID عشوائياً يشير إليه. المكان الثالث: داخل token موقّع يحمله المتصفح، فيثق الخادم بمحتواه لأنه يستطيع التحقق من التوقيع بدل البحث عن أي شيء. و ASP.NET Core يدعم الثلاثة." },

      { t: "p",
        en: "Trace one \"add to cart\" request through the middle option, which is the most common. The browser sends a header line `Cookie: .AspNetCore.Session=CfDJ8N...`. The session middleware reads that value, decrypts it to recover the session ID, and uses the ID as a key into Redis. Redis returns a byte array; the middleware deserializes it and hands the handler a populated `HttpContext.Session`. The handler adds the item. On the way out the middleware writes the changed data back to Redis with a fresh expiry, and — only if this was a brand new session — adds a `Set-Cookie` header so the browser stores the ID. Nothing about this depends on which of the three servers ran it.",
        ar: "تتبّع request واحداً لإضافة منتج إلى السلة عبر الخيار الأوسط، وهو الأشيع. يرسل المتصفح سطر ترويسة `Cookie: .AspNetCore.Session=CfDJ8N...`. فتقرأ الـ session middleware تلك القيمة، وتفكّ تشفيرها لاستخراج الـ session ID، وتستخدم الـ ID مفتاحاً في Redis. فيعيد Redis مصفوفة بايتات، وتفكّ الـ middleware ترميزها وتسلّم المعالج `HttpContext.Session` مملوءة. فيضيف المعالج المنتج. وفي طريق الخروج تكتب الـ middleware البيانات المتغيّرة إلى Redis مع مهلة جديدة، وتضيف ترويسة `Set-Cookie` — فقط إن كانت الجلسة جديدة تماماً — ليخزّن المتصفح الـ ID. ولا شيء في ذلك يعتمد على أي الخوادم الثلاثة نفّذه." },

      { t: "kv", rows: [
        { k: { en: "`Set-Cookie` response header", ar: "ترويسة الاستجابة `Set-Cookie`" },
          v: { en: "How the server tells the browser to store a cookie. Sent once, when the session or login is created — not on every response.", ar: "الطريقة التي يخبر بها الخادم المتصفح أن يخزّن cookie. تُرسَل مرة واحدة عند إنشاء الجلسة أو تسجيل الدخول — لا مع كل استجابة." } },
        { k: { en: "`Cookie` request header", ar: "ترويسة الطلب `Cookie`" },
          v: { en: "The browser sending every matching cookie back, automatically, on every request to that domain — including images and scripts.", ar: "المتصفح يعيد كل cookie مطابق تلقائياً مع كل request لذلك الـ domain — بما في ذلك الصور والسكربتات." } },
        { k: { en: "Data Protection key ring", ar: "Data Protection key ring" },
          v: { en: "The set of encryption keys ASP.NET Core uses to protect cookies. If two servers hold different keys, each rejects the other's cookies.", ar: "مجموعة مفاتيح التشفير التي يستخدمها ASP.NET Core لحماية الـ cookies. وإذا حمل خادمان مفاتيح مختلفة، رفض كلٌّ منهما cookies الآخر." } },
        { k: { en: "Sliding expiration", ar: "Sliding expiration" },
          v: { en: "The session's countdown restarts on every request, so an active user is never kicked out and an idle one eventually is.", ar: "العدّ التنازلي للجلسة يبدأ من جديد مع كل request، فلا يُطرد المستخدم النشط أبداً ويُطرد الخامل في النهاية." } },
        { k: { en: "`HttpOnly` / `Secure` / `SameSite`", ar: "`HttpOnly` و`Secure` و`SameSite`" },
          v: { en: "Cookie flags: hide it from JavaScript, send it only over HTTPS, and do not send it on requests started by other sites.", ar: "أعلام الـ cookie: إخفاؤه عن JavaScript، وإرساله عبر HTTPS فقط، وعدم إرساله مع الطلبات التي تبدأها مواقع أخرى." } }
      ]},

      { t: "code", lang: "csharp",
        label: { en: "The shared-store setup that makes three servers behave like one", ar: "إعداد المخزن المشترك الذي يجعل ثلاثة خوادم تتصرّف كخادم واحد" },
        code: "var builder = WebApplication.CreateBuilder(args);\n\n// 1. One Redis connection, shared by session storage and the key ring.\nvar redis = ConnectionMultiplexer.Connect(builder.Configuration[\"Redis\"]!);\n\n// 2. Session data lives in Redis, so any server can read any session.\nbuilder.Services.AddStackExchangeRedisCache(o =>\n    o.ConnectionMultiplexerFactory = () => Task.FromResult<IConnectionMultiplexer>(redis));\n\n// 3. The encryption keys live in Redis too, and every replica must agree on\n//    the application name -- otherwise each one protects cookies differently\n//    and a cookie issued by server A is unreadable on server B.\nbuilder.Services.AddDataProtection()\n    .PersistKeysToStackExchangeRedis(redis, \"store-api-keys\")\n    .SetApplicationName(\"store-api\");\n\nbuilder.Services.AddSession(o =>\n{\n    o.IdleTimeout        = TimeSpan.FromMinutes(30); // sliding: resets each request\n    o.Cookie.Name        = \".store.session\";\n    o.Cookie.HttpOnly    = true;   // JavaScript cannot read it\n    o.Cookie.SecurePolicy = CookieSecurePolicy.Always;  // HTTPS only\n    o.Cookie.SameSite    = SameSiteMode.Lax;            // not sent cross-site\n    o.Cookie.IsEssential = true;   // exempt from consent-based cookie blocking\n});\n\nvar app = builder.Build();\napp.UseSession();          // must run before anything that reads Session\napp.MapPost(\"/cart/items\", (HttpContext ctx, CartItem item) =>\n{\n    var cart = ctx.Session.GetString(\"cart\");   // one Redis GET\n    // ... add the item ...\n    ctx.Session.SetString(\"cart\", updated);     // one Redis SET on the way out\n    return Results.Accepted();\n});" },

      { t: "p",
        en: "The third option, the JWT, removes the Redis lookup entirely. The server signs a token containing the user id and an expiry, and on later requests it verifies the signature with the same key and reads the claims straight out of the token. Verification is local maths — no database, no cache — which is why tokens scale so well across services. The cost appears the moment you want to end a session early: a signed token is valid until it expires, so \"log out everywhere\", \"this account was suspended\" and \"the user's role changed\" have no natural mechanism. The standard answer is short-lived tokens, typically 5 to 15 minutes, plus a longer-lived refresh token that is checked against the database when it is exchanged.",
        ar: "أما الخيار الثالث، وهو الـ JWT، فيلغي البحث في Redis تماماً. إذ يوقّع الخادم token يحوي معرّف المستخدم ووقت انتهاء، وفي الطلبات اللاحقة يتحقّق من التوقيع بالمفتاح نفسه ويقرأ الـ claims من داخل الـ token مباشرة. والتحقّق حساب محلي — بلا قاعدة بيانات وبلا cache — ولهذا تتوسّع الـ tokens جيداً عبر الخدمات. وتظهر التكلفة لحظة رغبتك في إنهاء جلسة مبكّراً: فالـ token الموقّع صالح حتى انتهاء مدته، ولذلك لا آلية طبيعية لـ«تسجيل الخروج من كل الأجهزة» ولا «هذا الحساب أُوقف» ولا «تغيّر دور المستخدم». والجواب المعتاد tokens قصيرة العمر، عادة من خمس إلى خمس عشرة دقيقة، مع refresh token أطول عمراً يُفحص مقابل قاعدة البيانات عند استبداله." }
    ]},

    { key: "tradeoffs", blocks: [
      { t: "tradeoff",
        pros: { en: [
          "Shared store: any server can serve any user, so you can add, remove or restart servers freely.",
          "Shared store: you can end a session instantly by deleting one key — real logout, real suspension.",
          "JWT: no lookup per request, so a service can validate a caller without depending on your database.",
          "Cookie-only data: nothing to run and nothing to operate — no extra moving part in production."
        ], ar: [
          "المخزن المشترك: أي خادم يخدم أي مستخدم، فتضيف الخوادم وتزيلها وتعيد تشغيلها بحرية.",
          "المخزن المشترك: تنهي جلسة فوراً بحذف مفتاح واحد — خروج حقيقي وإيقاف حقيقي.",
          "JWT: لا بحث مع كل request، فتستطيع خدمة التحقق من المتصل دون الاعتماد على قاعدة بياناتك.",
          "بيانات في الـ cookie فقط: لا شيء تشغّله ولا شيء تديره — لا مكوّن إضافي في الإنتاج."
        ]},
        cons: { en: [
          "Shared store: one more thing that can be down, so it needs a timeout and a decided fallback.",
          "JWT: you cannot revoke it before it expires, which makes long expiry times a security decision.",
          "Cookie-only data: every byte is uploaded on every request, and the browser cap is about 4 KB.",
          "Sticky sessions: a deploy or a crash loses every session on that server."
        ], ar: [
          "المخزن المشترك: شيء إضافي قد يتعطّل، فيحتاج إلى timeout وخطة بديلة محسومة.",
          "JWT: لا يمكن إبطاله قبل انتهاء مدته، مما يجعل المدد الطويلة قراراً أمنياً.",
          "بيانات في الـ cookie فقط: كل بايت يُرفع مع كل request، وسقف المتصفح نحو 4 كيلوبايت.",
          "Sticky sessions: أي نشر أو انهيار يفقد كل الجلسات على ذلك الخادم."
        ]},
        limits: { en: [
          "A cookie is per-domain and per-browser: it does not follow the user to a phone app or another device.",
          "Redis holding sessions in memory only will lose them all on a failover unless you enable persistence or replication.",
          "A JWT is signed, not hidden — anyone holding it can read the claims, so never put secrets in it.",
          "Session data should be small and rebuildable; anything you cannot afford to lose belongs in your real database."
        ], ar: [
          "الـ cookie مرتبط بـ domain وبمتصفح: فلا يتبع المستخدم إلى تطبيق هاتف أو جهاز آخر.",
          "Redis الذي يحفظ الجلسات في الذاكرة فقط يفقدها كلها عند failover ما لم تفعّل persistence أو replication.",
          "الـ JWT موقّع لا مخفيّ — فمن يحمله يقرأ الـ claims، ولذلك لا تضع فيه أسراراً أبداً.",
          "بيانات الجلسة يجب أن تكون صغيرة وقابلة لإعادة البناء؛ وما لا تحتمل فقدانه مكانه قاعدة بياناتك الحقيقية."
        ]},
        alts: { en: [
          "Opaque session ID in a cookie plus Redis — the safe default for a browser app that needs real logout.",
          "Short-lived JWT plus a refresh token — the default for mobile clients and service-to-service calls.",
          "Signed cookie holding a handful of claims and no store — fine for a small app with cheap logout needs.",
          "Persist the cart in your own database keyed by user id, and keep only identity in the session."
        ], ar: [
          "session ID مبهم في cookie مع Redis — الخيار الافتراضي الآمن لتطبيق متصفح يحتاج خروجاً حقيقياً.",
          "JWT قصير العمر مع refresh token — الخيار الافتراضي لعملاء الهاتف وللنداءات بين الخدمات.",
          "cookie موقّع يحمل بضع claims بلا مخزن — مناسب لتطبيق صغير لا تكلّفه متطلبات الخروج كثيراً.",
          "احفظ السلة في قاعدة بياناتك مفتاحها معرّف المستخدم، وأبقِ الهوية فقط في الجلسة."
        ]}
      }
    ]},

    { key: "mistakes", blocks: [
      { t: "mistake",
        title: { en: "Putting the whole cart in the cookie", ar: "وضع السلة كاملة في الـ cookie" },
        body: { en: "To avoid running Redis, the team serialized the cart — item names, images, prices — into the session cookie. It worked in testing with two items. A customer with 40 items produced a 3.2 KB cookie, and because the browser attaches cookies to every request for the domain, including the 60 or so images and scripts on the page, that page view uploaded about 190 KB of cookie. On a slow mobile uplink that added over a second before anything rendered. Worse, some users crossed the roughly 4 KB browser limit, the browser silently dropped the cookie, and those customers could never check out at all.", ar: "لتفادي تشغيل Redis، حوّل الفريق السلة — أسماء المنتجات والصور والأسعار — إلى نص داخل session cookie. ونجح ذلك في الاختبار بمنتجين. لكن زبوناً بأربعين منتجاً أنتج cookie بحجم 3.2 كيلوبايت، ولأن المتصفح يُرفق الـ cookies مع كل request لذلك الـ domain، بما فيها نحو ستين صورة وسكربتاً في الصفحة، رفعت تلك الزيارة قرابة 190 كيلوبايت من الـ cookies. وعلى وصلة هاتف بطيئة أضاف ذلك أكثر من ثانية قبل ظهور أي شيء. والأسوأ أن بعض المستخدمين تجاوزوا سقف المتصفح البالغ نحو أربعة كيلوبايت، فأسقط المتصفح الـ cookie بصمت، ولم يستطع أولئك الزبائن إتمام الشراء إطلاقاً." },
        fix: "// Keep the cookie tiny: an id, nothing else. The data goes in the store.\nctx.Session.SetString(\"cartId\", cartId);        // ~36 bytes in Redis\n// and the cart itself in your own database, keyed by cartId" },

      { t: "mistake",
        title: { en: "A 24-hour JWT used as the session", ar: "JWT مدته 24 ساعة يُستخدم كجلسة" },
        body: { en: "Login issued a token valid for 24 hours holding the user's id and roles, and nothing was stored server-side. When an employee was fired, their access was removed in the admin panel — and they kept using the API for the rest of the day, because their token was already signed and every server accepted it without asking the database anything. The same bug meant a user promoted to admin had to log out and back in before the change took effect, and \"log out from all devices\" was impossible to implement.", ar: "أصدر تسجيل الدخول token صالحاً أربعاً وعشرين ساعة يحمل معرّف المستخدم وأدواره، ولم يُخزَّن شيء على الخادم. ولمّا فُصل موظف، أُلغي وصوله من لوحة الإدارة — واستمر يستخدم الـ API بقية اليوم، لأن الـ token كان موقّعاً مسبقاً وقبله كل خادم دون سؤال قاعدة البيانات عن شيء. والخلل نفسه جعل مستخدماً رُقّي إلى admin مضطراً للخروج والدخول قبل أن يسري التغيير، وجعل «تسجيل الخروج من كل الأجهزة» مستحيل التنفيذ." },
        fix: "// Short access token + a refresh token that IS checked against the database.\nvar access  = CreateJwt(user, TimeSpan.FromMinutes(10));\nvar refresh = await _refreshTokens.IssueAsync(user.Id); // revocable row in the DB" },

      { t: "mistake",
        title: { en: "`AddDistributedMemoryCache` shipped to production", ar: "`AddDistributedMemoryCache` يُنشر إلى الإنتاج" },
        body: { en: "The name reads like a distributed cache, so it was left in `Program.cs`. It is not distributed at all: it is an in-process dictionary that merely implements the `IDistributedCache` interface, and it exists so you can develop without running Redis. With three replicas, each one kept its own private session table, which reproduced exactly the 67% random-logout problem the team thought they had solved. Nothing logged an error, because from each server's point of view the session simply did not exist.", ar: "الاسم يُقرأ كأنه cache موزّع، فتُرك في `Program.cs`. وهو ليس موزّعاً إطلاقاً: إنه dictionary داخل العملية ينفّذ واجهة `IDistributedCache` فحسب، ووُجد لتطوّر دون تشغيل Redis. ومع ثلاث نسخ، احتفظت كل نسخة بجدول جلسات خاص بها، فأعاد ذلك بالضبط مشكلة الخروج العشوائي بنسبة 67% التي ظنّ الفريق أنه حلّها. ولم يُسجَّل أي خطأ، لأن الجلسة ببساطة غير موجودة من وجهة نظر كل خادم." },
        fix: "// dev only\nif (builder.Environment.IsDevelopment()) builder.Services.AddDistributedMemoryCache();\nelse builder.Services.AddStackExchangeRedisCache(o => o.Configuration = redisConn);" },

      { t: "mistake",
        title: { en: "Every replica generating its own encryption keys", ar: "كل نسخة تولّد مفاتيح تشفير خاصة بها" },
        body: { en: "Session data was correctly in Redis, but users were still logged out at random. The cause was the Data Protection key ring — the keys ASP.NET Core uses to encrypt the cookie. In a container with no persistent disk, each replica generates its own keys at startup, so a cookie encrypted by server A cannot be decrypted by B or C. The only clue was a warning-level log line about failing to unprotect the ticket, buried under normal traffic. The same failure hits every deploy if keys are written to a container filesystem that disappears with the container.", ar: "كانت بيانات الجلسة في Redis كما ينبغي، ومع ذلك كان المستخدمون يخرجون عشوائياً. والسبب هو الـ Data Protection key ring — أي المفاتيح التي يشفّر بها ASP.NET Core الـ cookie. ففي حاوية بلا قرص دائم، تولّد كل نسخة مفاتيحها عند الإقلاع، فلا يستطيع B أو C فك تشفير cookie شفّره A. والدليل الوحيد سطر log بمستوى warning عن فشل فكّ حماية الـ ticket، مدفون تحت الحركة الطبيعية. ويضرب الفشل نفسه عند كل نشر إن كُتبت المفاتيح إلى نظام ملفات حاوية يختفي معها." },
        fix: "builder.Services.AddDataProtection()\n    .PersistKeysToStackExchangeRedis(redis, \"store-api-keys\")\n    .SetApplicationName(\"store-api\");   // all replicas must use the same name" }
    ]},

    { key: "interview", blocks: [
      { t: "qa", level: "junior",
        q: { en: "Why does a web server need session state at all?", ar: "لماذا يحتاج خادم الويب إلى حالة جلسة أصلاً؟" },
        a: { en: "Because HTTP does not remember anything between requests. Each request arrives on its own, and the server has no idea it is talking to the same person as a second ago. So if you want the user to stay logged in, or keep a cart, something has to carry that fact from one request to the next. That something is normally a cookie: the browser sends it automatically with every request, and it either holds the data or holds an id that points to the data.", ar: "لأن الـ HTTP لا يتذكّر شيئاً بين الطلبات. فكل request يصل بمفرده، ولا فكرة لدى الخادم أنه يكلّم الشخص نفسه الذي كلّمه قبل ثانية. فإن أردت بقاء المستخدم مسجَّلاً أو احتفاظه بسلة، فلا بد من شيء ينقل تلك الحقيقة من request إلى آخر. وهذا الشيء عادةً cookie: يرسله المتصفح تلقائياً مع كل request، وهو إما يحمل البيانات أو يحمل معرّفاً يشير إليها." } },

      { t: "qa", level: "mid",
        q: { en: "Cookie, JWT or a Redis session store — how do you pick?", ar: "cookie أم JWT أم مخزن جلسات في Redis — كيف تختار؟" },
        a: { en: "I start from two questions: how much data, and do I need to end a session on demand. If the data is a few hundred bytes and I never need instant logout, a signed cookie is the cheapest thing that works — no infrastructure. If I need real logout, suspension or role changes to take effect immediately, I want a server-side store, because deleting one key ends the session everywhere. I reach for JWTs when the consumer is a mobile app or another service, where a per-request lookup against my database would be the wrong coupling — and then I keep the token short-lived and pair it with a revocable refresh token.", ar: "أبدأ من سؤالين: كم حجم البيانات، وهل أحتاج إنهاء الجلسة عند الطلب. فإن كانت البيانات بضع مئات من البايتات ولا أحتاج خروجاً فورياً، فالـ cookie الموقّع أرخص ما يعمل — بلا بنية تحتية. وإن احتجت خروجاً حقيقياً أو إيقافاً أو تغيير أدوار يسري فوراً، فأريد مخزناً على الخادم، لأن حذف مفتاح واحد ينهي الجلسة في كل مكان. وألجأ إلى الـ JWT حين يكون المستهلك تطبيق هاتف أو خدمة أخرى، حيث يكون البحث في قاعدة بياناتي مع كل request ارتباطاً خاطئاً — وعندها أُبقي الـ token قصير العمر وأقرنه بـ refresh token قابل للإبطال." } },

      { t: "qa", level: "mid",
        q: { en: "What actually goes wrong with sticky sessions?", ar: "ما الذي يفسد فعلياً مع الـ sticky sessions؟" },
        a: { en: "They work until something moves. A deploy restarts each server in turn, and every session held in that server's memory disappears — so a rolling deploy logs out a third of your users at a time. A crash does the same without warning. They also unbalance traffic, because the load balancer can no longer send work to whoever is free; if a few heavy users are pinned to one box, that box is hot while the others idle. And they make autoscaling nearly useless, since a new server starts empty and can only take new sessions.", ar: "تعمل حتى يتحرّك شيء. فأي نشر يعيد تشغيل الخوادم بالتناوب، فتختفي كل جلسة في ذاكرة ذلك الخادم — أي أن النشر التدريجي يُخرج ثلث مستخدميك في كل مرة. والانهيار يفعل الشيء نفسه بلا إنذار. كما تُخلّ بتوازن الحركة، لأن الـ load balancer لم يعد يستطيع إرسال العمل إلى المتفرّغ؛ فإن ثُبّت بضعة مستخدمين ثقال على خادم واحد، سخن ذلك الخادم بينما يخمل غيره. وتجعل الـ autoscaling شبه عديم الفائدة، لأن الخادم الجديد يبدأ فارغاً ولا يستقبل إلا الجلسات الجديدة." } },

      { t: "qa", level: "senior",
        q: { en: "Your Redis session store goes down. What should the API do?", ar: "تعطّل مخزن الجلسات في Redis. ماذا يجب أن يفعل الـ API؟" },
        a: { en: "It has to be a decision made in advance, not an accident. First, every session call gets a tight timeout — around 100 ms — so a slow Redis cannot turn into requests piling up and threads exhausted. Then I decide per endpoint. Anonymous browsing and product pages should keep working with an empty session, degraded but alive. Checkout should fail loudly with a 503 and a Retry-After header, because pretending a cart is empty is worse than an honest error. What I refuse to do is fall back silently to in-memory sessions, because that reintroduces the random-logout behaviour under exactly the conditions where users are already unhappy.", ar: "يجب أن يكون قراراً متّخذاً مسبقاً لا حادثاً. أولاً، كل نداء جلسة يأخذ timeout ضيقاً — نحو مئة مللي ثانية — كي لا يتحوّل بطء Redis إلى تكدّس طلبات واستنفاد threads. ثم أقرّر لكل endpoint. فالتصفّح المجهول وصفحات المنتجات يجب أن تستمر بجلسة فارغة، متدهورة لكن حية. أما الشراء فيجب أن يفشل بوضوح بـ503 وترويسة Retry-After، لأن التظاهر بأن السلة فارغة أسوأ من خطأ صريح. والذي أرفضه هو التراجع الصامت إلى جلسات في الذاكرة، لأن ذلك يعيد سلوك الخروج العشوائي في الظرف الذي يكون فيه المستخدمون منزعجين أصلاً." } },

      { t: "qa", level: "senior",
        q: { en: "How do you implement \"log out from all devices\" with JWTs?", ar: "كيف تنفّذ «تسجيل الخروج من كل الأجهزة» مع الـ JWT؟" },
        a: { en: "You cannot do it with the access token alone, because a signed token is valid until it expires and nothing checks anything. So you accept that and make the window small: access tokens live 5 to 15 minutes, and everything long-lived is a refresh token stored as a row in the database. Logging out everywhere deletes those rows, so within one token lifetime every device is locked out on its next refresh. If the product needs it to be instant, you add a per-user value — a token version number or a last-logout timestamp — that the API checks on each request, but you should be honest that this puts a lookup back on the hot path and you have partly rebuilt a session store.", ar: "لا يمكنك ذلك بالـ access token وحده، لأن الـ token الموقّع صالح حتى انتهاء مدته ولا شيء يفحص شيئاً. فتقبل ذلك وتُصغّر النافذة: يعيش الـ access token من خمس إلى خمس عشرة دقيقة، وكل ما هو طويل العمر يصير refresh token مخزّناً كسجل في قاعدة البيانات. فالخروج من كل الأجهزة يحذف تلك السجلات، وخلال عمر token واحد يُقفل كل جهاز عند تجديده التالي. وإن احتاج المنتج أن يكون فورياً، تضيف قيمة لكل مستخدم — رقم نسخة token أو طابع زمني لآخر خروج — يفحصها الـ API مع كل request، لكن كن صريحاً بأن هذا يعيد بحثاً إلى المسار الساخن وأنك أعدت بناء جزء من مخزن الجلسات." } },

      { t: "qa", level: "staff",
        q: { en: "Teams across the company keep inventing their own session handling. How do you fix that structurally?", ar: "فرق في الشركة تخترع كل واحدة معالجتها الخاصة للجلسات. كيف تعالج ذلك بنيوياً؟" },
        a: { en: "I treat session handling as platform infrastructure, not per-team application code. One shared package or one gateway owns issuing, validating and revoking sessions, with the cookie flags, expiry policy and key management already decided inside it — so the safe path is also the shortest path. I pair that with two things: a written default that says what a new service should use and when it may deviate, and a check in the deployment pipeline that fails a service whose session cookie is missing HttpOnly or Secure, or whose data protection keys are not shared. Documentation alone loses to deadlines; a default that is easier than the alternative wins.", ar: "أتعامل مع معالجة الجلسات كبنية تحتية للمنصة لا ككود تطبيق لكل فريق. فحزمة مشتركة واحدة أو gateway واحد يملك إصدار الجلسات والتحقق منها وإبطالها، وقد حُسمت داخله أعلام الـ cookie وسياسة الانتهاء وإدارة المفاتيح — فيصير المسار الآمن هو الأقصر أيضاً. وأُتبع ذلك بأمرين: قاعدة افتراضية مكتوبة تقول ماذا تستخدم الخدمة الجديدة ومتى يجوز لها الخروج عنها، وفحص في خط النشر يُفشل أي خدمة ينقص cookie جلستها HttpOnly أو Secure أو لا تشارك مفاتيح data protection. فالتوثيق وحده يخسر أمام المواعيد النهائية؛ والافتراض الأسهل من بديله هو الذي ينتصر." } }
    ]},

    { key: "codereview", blocks: [
      { t: "review", severity: "high",
        title: { en: "Trusting a client-supplied user id instead of the session", ar: "الثقة بمعرّف مستخدم يرسله العميل بدل الجلسة" },
        bad: "// The endpoint takes the user id from the request body.\napp.MapPost(\"/orders\", async (OrderRequest req, IOrderService svc) =>\n{\n    // req.UserId came from the client. Anyone can change it.\n    var order = await svc.PlaceAsync(req.UserId, req.Items);\n    return Results.Created($\"/orders/{order.Id}\", order);\n});",
        good: "app.MapPost(\"/orders\", async (HttpContext ctx, OrderRequest req, IOrderService svc) =>\n{\n    // Identity comes only from the authenticated session/token.\n    var userId = ctx.User.FindFirstValue(ClaimTypes.NameIdentifier);\n    if (userId is null) return Results.Unauthorized();\n\n    var order = await svc.PlaceAsync(userId, req.Items);\n    return Results.Created($\"/orders/{order.Id}\", order);\n}).RequireAuthorization();",
        why: { en: "Anything in the request body is under the caller's control — they can type any id they like and place an order as another customer. The session or token is the only part of the request the server itself created and signed, so identity must be read from there and nowhere else. This class of bug is not theoretical: changing one number in a request body is the most common way real accounts get taken over.", ar: "كل ما في جسم الـ request تحت سيطرة المتصل — فيستطيع كتابة أي معرّف يشاء وإنشاء طلب باسم زبون آخر. والجلسة أو الـ token هي الجزء الوحيد من الـ request الذي أنشأه الخادم نفسه ووقّعه، ولذلك يجب قراءة الهوية منها لا من غيرها. وهذا الصنف من الأخطاء ليس نظرياً: فتغيير رقم واحد في جسم request هو أشيع طريقة تُسرق بها الحسابات الحقيقية." } },

      { t: "review", severity: "medium",
        title: { en: "A session cookie with no protective flags", ar: "session cookie بلا أعلام حماية" },
        bad: "builder.Services.AddSession(o =>\n{\n    o.IdleTimeout = TimeSpan.FromHours(12);\n    o.Cookie.Name = \"sid\";\n    // no HttpOnly, no Secure, no SameSite\n});",
        good: "builder.Services.AddSession(o =>\n{\n    o.IdleTimeout         = TimeSpan.FromMinutes(30); // idle, not absolute\n    o.Cookie.Name         = \".store.session\";\n    o.Cookie.HttpOnly     = true;                     // JS cannot read it\n    o.Cookie.SecurePolicy = CookieSecurePolicy.Always;// HTTPS only\n    o.Cookie.SameSite     = SameSiteMode.Lax;         // not sent cross-site\n    o.Cookie.IsEssential  = true;\n});",
        why: { en: "Without `HttpOnly`, any injected script on the page can read the cookie and copy the session. Without `Secure`, the cookie is sent over plain HTTP, where anyone on the same network can capture it. Without `SameSite`, the browser attaches it to requests started by other sites, which is how cross-site request forgery works. The 12-hour idle timeout compounds all three by giving a stolen cookie a long life. These four lines cost nothing and remove three whole categories of attack.", ar: "بدون `HttpOnly` يستطيع أي سكربت مُحقَن في الصفحة قراءة الـ cookie ونسخ الجلسة. وبدون `Secure` يُرسل الـ cookie عبر HTTP عادي، حيث يلتقطه أي أحد على الشبكة نفسها. وبدون `SameSite` يُرفقه المتصفح بالطلبات التي تبدأها مواقع أخرى، وهكذا يعمل هجوم cross-site request forgery. ومهلة الخمول البالغة اثنتي عشرة ساعة تضاعف الثلاثة بمنحها الـ cookie المسروق عمراً طويلاً. وهذه الأسطر الأربعة لا تكلّف شيئاً وتزيل ثلاث فئات كاملة من الهجمات." } }
    ]},

    { key: "sysdesign", blocks: [
      { t: "p",
        en: "In a system design interview, session state is usually the first thing that decides whether your app tier is stateless — meaning any server can handle any request. Once you say \"sessions live in Redis, servers hold nothing\", horizontal scaling, rolling deploys and autoscaling all become straightforward, and the conversation moves to how you run and size that store. If you leave sessions in process memory, every later part of the design has to work around it.",
        ar: "في مقابلة تصميم نظام، حالة الجلسة هي عادةً أول ما يحدّد إن كانت طبقة تطبيقك stateless — أي أن أي خادم يعالج أي request. فحين تقول «الجلسات في Redis والخوادم لا تحمل شيئاً»، يصير التوسّع الأفقي والنشر التدريجي والـ autoscaling أموراً مباشرة، وينتقل الحديث إلى كيفية تشغيل ذلك المخزن وتحجيمه. أما إن تركت الجلسات في ذاكرة العملية، فكل جزء لاحق من التصميم مضطر إلى الالتفاف حولها." },

      { t: "ul",
        en: [
          "Size the store from real numbers: 200,000 concurrent sessions at 2 KB each is about 400 MB, plus replication — small, but say it out loud rather than guessing.",
          "Give the store a timeout and a documented behaviour when it is unavailable, per endpoint: degrade for browsing, fail loudly for checkout.",
          "Share the encryption keys across replicas from day one, or cookies issued by one server will be rejected by the others after the next deploy.",
          "For mobile apps and service-to-service calls, prefer short-lived tokens over cookies — cookies are a browser mechanism and do not fit those clients.",
          "Decide expiry twice: an idle timeout that resets on activity, and an absolute maximum so a session cannot live forever."
        ],
        ar: [
          "حجّم المخزن من أرقام حقيقية: مئتا ألف جلسة متزامنة بكيلوبايتين لكل واحدة تعني نحو 400 ميغابايت، زائد الـ replication — رقم صغير، لكن قله صراحة بدل التخمين.",
          "امنح المخزن timeout وسلوكاً موثّقاً عند تعطّله، لكل endpoint: تدهور مقبول للتصفّح، وفشل صريح للشراء.",
          "شارك مفاتيح التشفير بين النسخ من اليوم الأول، وإلا رفضت الخوادم الأخرى cookies خادم بعد النشر التالي.",
          "لتطبيقات الهاتف وللنداءات بين الخدمات، فضّل tokens قصيرة العمر على الـ cookies — فالـ cookies آلية متصفح ولا تناسب أولئك العملاء.",
          "احسم الانتهاء مرتين: مهلة خمول تُعاد مع كل نشاط، وحد أقصى مطلق كي لا تعيش الجلسة إلى الأبد."
        ]},

      { t: "callout", kind: "tip",
        en: "A useful rule for what belongs in a session: if losing it would only annoy the user, a session is fine. If losing it would cost money or break a promise — an order, a payment, a signed agreement — it belongs in your real database, not in a store you treat as a cache.",
        ar: "قاعدة مفيدة لما يستحق أن يكون في جلسة: إن كان فقدانه يزعج المستخدم فقط، فالجلسة مناسبة. وإن كان فقدانه يكلّف مالاً أو يخلّ بوعد — طلب أو دفعة أو اتفاق موقّع — فمكانه قاعدة بياناتك الحقيقية لا مخزن تعامله كـ cache." }
    ]},

    { key: "perf", blocks: [
      { t: "kv", rows: [
        { k: { en: "Latency", ar: "Latency" },
          v: { en: "One Redis round trip inside a data centre is roughly 0.5–1 ms. Two calls per request (read and write) is normal; ten is a design mistake.", ar: "رحلة Redis واحدة داخل مركز بيانات نحو 0.5 إلى 1 مللي ثانية. ونداءان لكل request (قراءة وكتابة) أمر طبيعي؛ وعشرة خطأ تصميمي." } },
        { k: { en: "Network", ar: "Network" },
          v: { en: "Cookies are uploaded on every request to the domain. A 3 KB cookie across 60 asset requests is about 190 KB per page view, all on the slower upload direction.", ar: "الـ cookies تُرفع مع كل request للـ domain. فcookie بثلاثة كيلوبايتات عبر ستين طلب أصل يعني نحو 190 كيلوبايت لكل زيارة صفحة، كلها في اتجاه الرفع الأبطأ." } },
        { k: { en: "Memory", ar: "Memory" },
          v: { en: "Sessions in the store are cheap: 200,000 sessions at 2 KB is about 400 MB. Sessions in app memory are expensive because they block you from restarting servers.", ar: "الجلسات في المخزن رخيصة: مئتا ألف جلسة بكيلوبايتين تعني نحو 400 ميغابايت. أما الجلسات في ذاكرة التطبيق فمكلفة لأنها تمنعك من إعادة تشغيل الخوادم." } },
        { k: { en: "CPU", ar: "CPU" },
          v: { en: "Verifying a JWT signature is microseconds and needs no I/O, which is why token validation scales better than a store lookup under heavy read traffic.", ar: "التحقق من توقيع JWT يستغرق ميكروثواني ولا يحتاج I/O، ولهذا يتوسّع التحقق من الـ tokens أفضل من البحث في مخزن تحت حركة قراءة كثيفة." } },
        { k: { en: "Scalability", ar: "Scalability" },
          v: { en: "Stateless servers scale by adding instances. Sticky sessions cap you at whatever the busiest server can hold, and make autoscaling mostly ineffective.", ar: "الخوادم الـ stateless تتوسّع بإضافة نسخ. أما الـ sticky sessions فتحدّك بما يحتمله أكثر الخوادم انشغالاً، وتجعل الـ autoscaling عديم الأثر غالباً." } }
      ]}
    ]},

    { key: "debug", blocks: [
      { t: "ul",
        en: [
          "Browser DevTools → Application → Cookies: check the cookie's size, expiry and its HttpOnly, Secure and SameSite flags. A missing cookie here means the browser refused or dropped it.",
          "`curl -v https://api/cart -b \"sid=...\"`: the verbose output shows the exact Cookie sent and any Set-Cookie returned, which separates \"browser problem\" from \"server problem\".",
          "`redis-cli --scan --pattern \"*session*\" | head` then `TTL <key>`: confirms sessions are really being written, and that their remaining lifetime is what you configured.",
          "Search app logs for \"unprotect\" or \"key ring\": warning lines there mean the encryption keys are not shared, and that is why cookies fail on some servers and not others.",
          "Load-balancer access logs: correlate the failing request's session id with which backend served it. If failures follow a specific server, the problem is per-instance state, not the store."
        ],
        ar: [
          "أدوات المتصفح ← Application ← Cookies: افحص حجم الـ cookie ومدته وأعلام HttpOnly و Secure و SameSite. وغياب الـ cookie هنا يعني أن المتصفح رفضه أو أسقطه.",
          "`curl -v https://api/cart -b \"sid=...\"`: المخرجات المفصّلة تُظهر الـ Cookie المرسل بالضبط وأي Set-Cookie عائد، وهذا يفصل «مشكلة متصفح» عن «مشكلة خادم».",
          "`redis-cli --scan --pattern \"*session*\" | head` ثم `TTL <key>`: يؤكد أن الجلسات تُكتب فعلاً، وأن عمرها المتبقي هو ما ضبطته.",
          "ابحث في logs التطبيق عن \"unprotect\" أو \"key ring\": أسطر warning هناك تعني أن مفاتيح التشفير غير مشتركة، ولذلك تفشل الـ cookies على بعض الخوادم دون غيرها.",
          "logs الـ load balancer: اربط session id الطلب الفاشل بالخادم الخلفي الذي خدمه. فإن تبعت الإخفاقات خادماً بعينه، فالمشكلة حالة داخل النسخة لا المخزن."
        ]},

      { t: "callout", kind: "tip",
        en: "Reproduce a multi-server bug on one machine: run two copies of the API on different ports and send alternating requests to them with the same cookie. Anything that depends on per-instance state — unshared keys, in-memory sessions — fails immediately, without needing a deploy to production.",
        ar: "أعد إنتاج خطأ متعدد الخوادم على جهاز واحد: شغّل نسختين من الـ API على منفذين مختلفين وأرسل إليهما طلبات بالتناوب بالـ cookie نفسه. فكل ما يعتمد على حالة داخل النسخة — مفاتيح غير مشتركة أو جلسات في الذاكرة — يفشل فوراً، دون حاجة إلى نشر في الإنتاج." }
    ]},

    { key: "realworld", blocks: [
      { t: "p",
        en: "Almost every product that keeps a user \"signed in\" makes this decision, and the industry pattern is fairly consistent: browser-facing apps use a cookie carrying an opaque id with a server-side store, while anything non-browser uses short tokens. The differences between industries come from how badly they need to end a session on demand.",
        ar: "كل منتج تقريباً يُبقي مستخدماً «مسجّل الدخول» يتّخذ هذا القرار، والنمط السائد في الصناعة متّسق إلى حدٍّ بعيد: التطبيقات الموجّهة للمتصفح تستخدم cookie يحمل معرّفاً مبهماً مع مخزن على الخادم، أما غير المتصفح فيستخدم tokens قصيرة. والفروق بين المجالات تأتي من مدى حاجتها إلى إنهاء الجلسة عند الطلب." },

      { t: "ul",
        en: [
          "Online stores keep the cart in a shared store so it survives deploys, and often move it into the database once the user signs in so it follows them to another device.",
          "Banking and healthcare apps use short idle timeouts and server-side sessions specifically because they must be able to terminate a session the second fraud or a support call requires it.",
          "Mobile-first products issue short access tokens with a refresh token, because a mobile client has no cookie jar shared with a browser and often works offline for a while.",
          "Internal platforms behind a single sign-on gateway push session handling into the gateway, so individual services only ever see an already-validated identity."
        ],
        ar: [
          "المتاجر الإلكترونية تحفظ السلة في مخزن مشترك لتنجو من عمليات النشر، وتنقلها غالباً إلى قاعدة البيانات بعد تسجيل الدخول لتتبع المستخدم إلى جهاز آخر.",
          "تطبيقات البنوك والرعاية الصحية تستخدم مهل خمول قصيرة وجلسات على الخادم تحديداً لأنها يجب أن تستطيع إنهاء جلسة في اللحظة التي يستدعي فيها احتيالٌ أو مكالمة دعم ذلك.",
          "المنتجات التي تبدأ من الهاتف تُصدر access tokens قصيرة مع refresh token، لأن عميل الهاتف لا يملك cookie jar مشتركاً مع متصفح ويعمل بلا اتصال أحياناً.",
          "المنصات الداخلية خلف gateway للدخول الموحّد تدفع معالجة الجلسات إلى الـ gateway، فلا ترى الخدمات المفردة إلا هوية تم التحقق منها مسبقاً."
        ]}
    ]},

    { key: "exercises", blocks: [
      { t: "ex", diff: "easy",
        en: "Run one API with in-memory session on two ports and send five alternating requests with the same cookie, incrementing a counter in the session each time. You have got it right when the counter reaches 3 on one port and 2 on the other instead of 5 — that is the multi-server bug, reproduced locally.",
        ar: "شغّل API واحداً بجلسة في الذاكرة على منفذين وأرسل خمسة طلبات بالتناوب بالـ cookie نفسه، وزد عدّاداً في الجلسة كل مرة. تكون قد نجحت حين يصل العدّاد إلى 3 على منفذ و2 على الآخر بدل 5 — وهذا هو خطأ تعدّد الخوادم، مُعاد إنتاجه محلياً." },

      { t: "ex", diff: "medium",
        en: "Switch that app to `AddStackExchangeRedisCache` and share the Data Protection key ring between both instances. You have got it right when the same test now reaches 5, and `redis-cli --scan` shows exactly one session key with a TTL that resets on each request.",
        ar: "حوّل ذلك التطبيق إلى `AddStackExchangeRedisCache` وشارك الـ Data Protection key ring بين النسختين. تكون قد نجحت حين يصل الاختبار نفسه إلى 5، ويُظهر `redis-cli --scan` مفتاح جلسة واحداً بالضبط بـTTL يُعاد ضبطه مع كل request." },

      { t: "ex", diff: "hard",
        en: "Add a JWT login issuing a 10-minute access token plus a refresh token stored in a database table, and a `POST /logout-all` that deletes that user's refresh rows. You have got it right when an old access token still works for up to 10 minutes, and every refresh attempt after logout-all returns 401.",
        ar: "أضف تسجيل دخول بـJWT يُصدر access token لعشر دقائق مع refresh token مخزّن في جدول قاعدة بيانات، و`POST /logout-all` يحذف سجلات refresh لذلك المستخدم. تكون قد نجحت حين يظل access token قديم يعمل حتى عشر دقائق، وتُعيد كل محاولة refresh بعد logout-all رمز 401." },

      { t: "ex", diff: "senior",
        en: "Write a one-page decision record for your team choosing cookie-plus-store or tokens, including the store's failure behaviour per endpoint, the two expiry values, and how keys are shared. You have got it right when a colleague can implement a new service from the page alone, without asking you a single question.",
        ar: "اكتب سجل قرار من صفحة واحدة لفريقك يختار cookie مع مخزن أو tokens، ويشمل سلوك المخزن عند التعطّل لكل endpoint، وقيمتَي الانتهاء، وكيفية مشاركة المفاتيح. تكون قد نجحت حين يستطيع زميل بناء خدمة جديدة من الصفحة وحدها، دون أن يسألك سؤالاً واحداً." }
    ]},

    { key: "refs", blocks: [
      { t: "ref", label: { en: "Session and state management in ASP.NET Core", ar: "إدارة الجلسة والحالة في ASP.NET Core" },
        url: "https://learn.microsoft.com/en-us/aspnet/core/fundamentals/app-state",
        meta: { en: "Docs", ar: "توثيق" } },
      { t: "ref", label: { en: "Cookie authentication without ASP.NET Core Identity", ar: "المصادقة بالـ cookie دون ASP.NET Core Identity" },
        url: "https://learn.microsoft.com/en-us/aspnet/core/security/authentication/cookie",
        meta: { en: "Docs", ar: "توثيق" } },
      { t: "ref", label: { en: "RFC 6265 — HTTP State Management Mechanism (cookies)", ar: "RFC 6265 — آلية إدارة الحالة في HTTP (الـ cookies)" },
        url: "https://datatracker.ietf.org/doc/html/rfc6265",
        meta: { en: "Spec", ar: "مواصفة" } },
      { t: "ref", label: { en: "RFC 8725 — JSON Web Token Best Current Practices", ar: "RFC 8725 — أفضل الممارسات الحالية لـ JSON Web Token" },
        url: "https://datatracker.ietf.org/doc/html/rfc8725",
        meta: { en: "Spec", ar: "مواصفة" } }
    ]}
  ],

  quiz: [
    {
      q: { en: "Three API replicas keep session data in process memory. Roughly what fraction of requests will find the session missing?", ar: "ثلاث نسخ من API تحفظ بيانات الجلسة في ذاكرة العملية. ما النسبة التقريبية للطلبات التي لن تجد الجلسة؟" },
      options: [
        { en: "None — the load balancer always returns a user to the same server", ar: "لا شيء — الـ load balancer يعيد المستخدم دائماً إلى الخادم نفسه" },
        { en: "About one third", ar: "نحو الثلث" },
        { en: "About two thirds", ar: "نحو الثلثين" },
        { en: "All of them, because memory is cleared per request", ar: "كلها، لأن الذاكرة تُمسح مع كل request" }
      ],
      correct: 2,
      why: { en: "The session exists on only one of the three servers, so about one request in three finds it and two in three — roughly 67% — land on a server that has never seen it. This is why users report random logouts rather than a total outage.", ar: "الجلسة موجودة على واحد فقط من الخوادم الثلاثة، فيجدها نحو request من كل ثلاثة ويهبط اثنان من ثلاثة — قرابة 67% — على خادم لم يرها قط. ولهذا يبلّغ المستخدمون عن خروج عشوائي لا عن انقطاع كامل." }
    },
    {
      q: { en: "What is the main operational drawback of a long-lived JWT used as a session?", ar: "ما العيب التشغيلي الرئيسي لـ JWT طويل العمر يُستخدم كجلسة؟" },
      options: [
        { en: "It cannot carry the user's id", ar: "لا يستطيع حمل معرّف المستخدم" },
        { en: "It cannot be revoked before it expires", ar: "لا يمكن إبطاله قبل انتهاء مدته" },
        { en: "It requires a database lookup on every request", ar: "يتطلّب بحثاً في قاعدة البيانات مع كل request" },
        { en: "It only works on the server that issued it", ar: "يعمل فقط على الخادم الذي أصدره" }
      ],
      correct: 1,
      why: { en: "The server accepts the token because the signature is valid, not because it looked anything up. So a suspension, a role change or a logout has no way to take effect until the token expires — which is why access tokens are kept to minutes and paired with a revocable refresh token.", ar: "الخادم يقبل الـ token لأن التوقيع صحيح، لا لأنه بحث عن شيء. ولذلك لا سبيل لأن يسري إيقاف أو تغيير دور أو تسجيل خروج قبل انتهاء مدة الـ token — ولهذا تُبقى الـ access tokens بدقائق وتُقرن بـ refresh token قابل للإبطال." }
    },
    {
      q: { en: "Sessions are stored in Redis, yet users are still randomly logged out. What should you check first?", ar: "الجلسات مخزّنة في Redis ومع ذلك يخرج المستخدمون عشوائياً. ما أول ما تفحصه؟" },
      options: [
        { en: "Whether Redis has enough memory", ar: "هل لدى Redis ذاكرة كافية" },
        { en: "Whether the Data Protection keys are shared across replicas", ar: "هل مفاتيح Data Protection مشتركة بين النسخ" },
        { en: "Whether the load balancer has sticky sessions enabled", ar: "هل الـ sticky sessions مفعّلة في الـ load balancer" },
        { en: "Whether the session cookie has SameSite set", ar: "هل ضُبط SameSite على session cookie" }
      ],
      correct: 1,
      why: { en: "The cookie is encrypted with the Data Protection key ring. If each replica generated its own keys — the default in a container with no persistent storage — a cookie written by one server cannot be decrypted by another, and the user appears logged out even though the session row exists in Redis.", ar: "الـ cookie مشفّر بمفاتيح Data Protection. فإن ولّدت كل نسخة مفاتيحها — وهو الافتراضي في حاوية بلا تخزين دائم — تعذّر على خادم فكّ تشفير cookie كتبه خادم آخر، فيبدو المستخدم خارج الحساب رغم وجود سجل الجلسة في Redis." }
    },
    {
      q: { en: "Why is storing a large cart directly in the cookie a performance problem?", ar: "لماذا يُعدّ تخزين سلة كبيرة داخل الـ cookie مشكلة أداء؟" },
      options: [
        { en: "Cookies are stored on disk, so reading one is slow", ar: "الـ cookies تُخزَّن على القرص، فقراءتها بطيئة" },
        { en: "The browser uploads the cookie on every request to the domain, including assets", ar: "المتصفح يرفع الـ cookie مع كل request للـ domain، بما فيها الأصول" },
        { en: "The server must decrypt it with a database lookup", ar: "على الخادم فكّ تشفيره ببحث في قاعدة البيانات" },
        { en: "Cookies cannot hold JSON", ar: "الـ cookies لا تستطيع حمل JSON" }
      ],
      correct: 1,
      why: { en: "Cookies ride along on every matching request, including images and scripts. A 3 KB cookie across 60 asset requests is around 190 KB of upload per page view — on the slower direction of a mobile connection — and anything past roughly 4 KB is dropped by the browser entirely.", ar: "الـ cookies تُرفَق بكل request مطابق، بما فيه الصور والسكربتات. فcookie بثلاثة كيلوبايتات عبر ستين طلب أصل يعني نحو 190 كيلوبايت رفعاً لكل زيارة صفحة — في الاتجاه الأبطأ من اتصال الهاتف — وما تجاوز نحو أربعة كيلوبايتات يُسقطه المتصفح كلياً." }
    },
    {
      q: { en: "Which piece of data does NOT belong in a session store?", ar: "أي البيانات لا يصلح مكانها مخزن الجلسات؟" },
      options: [
        { en: "The id of the signed-in user", ar: "معرّف المستخدم المسجَّل" },
        { en: "The current step of a multi-page form", ar: "الخطوة الحالية في نموذج متعدد الصفحات" },
        { en: "A confirmed order and its payment reference", ar: "طلب مؤكَّد ومرجع الدفع الخاص به" },
        { en: "The user's chosen language for this visit", ar: "اللغة التي اختارها المستخدم لهذه الزيارة" }
      ],
      correct: 2,
      why: { en: "A session store is treated as a cache: entries expire, and a failover can lose them. Losing a form step or a language choice only annoys the user, but losing a confirmed order costs money and breaks a promise, so it belongs in the durable database.", ar: "مخزن الجلسات يُعامل كـcache: فالمدخلات تنتهي، وقد يفقدها failover. وفقدان خطوة نموذج أو اختيار لغة يزعج المستخدم فقط، أما فقدان طلب مؤكَّد فيكلّف مالاً ويخلّ بوعد، ولذلك مكانه قاعدة البيانات الدائمة." }
    }
  ]
};
```

NEXT: stack-heap
