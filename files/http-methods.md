```js
const httpMethodsLesson = {
  id: "http-methods",
  moduleId: "foundations",
  title: { en: "Methods, safety and idempotency", ar: "الـ methods والأمان والـ idempotency" },
  summary: {
    en: "What GET, POST, PUT, PATCH and DELETE actually promise, and why those promises decide what a client is allowed to retry.",
    ar: "ما الذي تعد به فعلاً الـ methods: GET و POST و PUT و PATCH و DELETE، ولماذا تحدد هذه الوعود ما يحق للـ client إعادة إرساله."
  },
  mins: 12,
  sections: [
    {
      key: "why",
      blocks: [
        {
          t: "p",
          en: "An HTTP method is the first word of every request — GET, POST, PUT, PATCH or DELETE. It tells the server what kind of operation you want. More importantly, it is a public promise about what happens if the same request arrives twice. That promise is the whole reason clients, proxies and load balancers can retry anything at all.",
          ar: "الـ HTTP method هي أول كلمة في كل request — GET أو POST أو PUT أو PATCH أو DELETE. تخبر الـ server بنوع العملية المطلوبة. والأهم أنها وعد معلن بما سيحدث لو وصل نفس الـ request مرتين. هذا الوعد هو السبب الوحيد الذي يسمح للـ clients والـ proxies والـ load balancers بإعادة المحاولة أصلاً."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "HTTP method", ar: "HTTP method" },
              v: { en: "The verb at the start of a request line, like GET or POST. It names the kind of operation, not the data.", ar: "الفعل في بداية سطر الـ request، مثل GET أو POST. يحدد نوع العملية، وليس البيانات." }
            },
            {
              k: { en: "Resource", ar: "Resource" },
              v: { en: "The thing the URL points at — one order, one user, a list of orders. The method says what to do with it.", ar: "الشيء الذي يشير إليه الـ URL — order واحد، user واحد، قائمة orders. والـ method تحدد ماذا نفعل به." }
            },
            {
              k: { en: "Side effect", ar: "Side effect" },
              v: { en: "Any change the request leaves behind on the server: a new row, a charged card, a sent email.", ar: "أي تغيير يتركه الـ request على الـ server: صف جديد، بطاقة تم خصمها، بريد تم إرساله." }
            },
            {
              k: { en: "Safe", ar: "Safe" },
              v: { en: "The method is read-only. Calling it changes nothing the caller can observe. GET and HEAD are safe.", ar: "الـ method للقراءة فقط. استدعاؤها لا يغيّر شيئاً يمكن للمستدعي ملاحظته. GET و HEAD آمنتان." }
            },
            {
              k: { en: "Idempotent", ar: "Idempotent" },
              v: { en: "Sending the request once or five times leaves the server in the same final state. GET, PUT and DELETE are idempotent.", ar: "إرسال الـ request مرة أو خمس مرات يترك الـ server في نفس الحالة النهائية. GET و PUT و DELETE هي idempotent." }
            },
            {
              k: { en: "Retry", ar: "Retry" },
              v: { en: "Sending the same request again after no answer arrived. Only sane when the method is idempotent.", ar: "إعادة إرسال نفس الـ request بعد عدم وصول رد. لا يكون منطقياً إلا إذا كانت الـ method idempotent." }
            }
          ]
        },
        {
          t: "p",
          en: "Think of a building elevator. Pressing the call button five times still brings one elevator to your floor — the button is idempotent. Now think of a vending machine: pressing Buy five times gives you five cans and charges you five times. Same finger, same button, completely different rule about repeating. HTTP methods exist so a client can tell which of the two it is talking to before it repeats anything.",
          ar: "تخيل زر المصعد في مبنى. الضغط عليه خمس مرات يُحضر مصعداً واحداً إلى طابقك — الزر idempotent. الآن تخيل آلة بيع: الضغط على زر الشراء خمس مرات يعطيك خمس علب ويخصم منك خمس مرات. نفس الإصبع ونفس الزر، لكن قاعدة التكرار مختلفة تماماً. الـ HTTP methods موجودة ليعرف الـ client مع أي النوعين يتعامل قبل أن يكرر أي شيء."
        },
        {
          t: "p",
          en: "This matters because networks lose answers, not just requests. A client sends POST /orders, the server creates the order, then the reply is lost on a bad mobile connection. The client saw nothing. It has to decide: send again, or give up? Without a rule attached to the method, every retry is a coin flip between a duplicate order and a lost one.",
          ar: "هذا مهم لأن الشبكات تفقد الردود، لا الـ requests فقط. يرسل الـ client طلب POST /orders، ينشئ الـ server الـ order، ثم يضيع الرد على اتصال موبايل سيئ. الـ client لم يرَ شيئاً. عليه أن يقرر: يعيد الإرسال أم يستسلم؟ بدون قاعدة مرتبطة بالـ method، كل إعادة محاولة هي رمي عملة بين order مكرر و order ضائع."
        },
        {
          t: "callout",
          kind: "note",
          en: "Safe and idempotent are promises you make, not features the framework gives you. ASP.NET Core will happily let you write a GET that deletes a row. Nothing stops you except the contract.",
          ar: "«آمن» و«idempotent» وعود تقطعها أنت، وليست ميزات يمنحها لك الـ framework. ASP.NET Core سيسمح لك بكل بساطة بكتابة GET يحذف صفاً. لا شيء يمنعك سوى العقد نفسه."
        }
      ]
    },
    {
      key: "problem",
      blocks: [
        {
          t: "p",
          en: "Here is the running example for this lesson: a food delivery API with one endpoint, POST /orders, called from a phone app. The app uses a 10 second timeout — if no reply arrives in 10 seconds it assumes failure and sends the request again. On a train or in a lift, roughly 0.4% of requests time out. That sounds tiny. At 12,000 orders a day it is about 48 requests a day that get sent twice.",
          ar: "هذا هو المثال الجاري في هذا الدرس: API لتوصيل الطعام فيه endpoint واحد هو POST /orders، يُستدعى من تطبيق موبايل. التطبيق يستخدم مهلة 10 ثوانٍ — إن لم يصل رد خلال 10 ثوانٍ يفترض الفشل ويعيد الإرسال. في القطار أو المصعد، حوالي 0.4% من الـ requests تتجاوز المهلة. يبدو الرقم صغيراً. لكن مع 12,000 order يومياً فهذا يعني حوالي 48 request يومياً تُرسل مرتين."
        },
        {
          t: "p",
          en: "Because POST is not idempotent, the server has no way to know the second request is a repeat. It creates a second order. Result: about 48 duplicate meals a day, 48 double charges, and 48 angry support tickets. Support has to refund each one by hand, which is roughly 4 hours of work every day.",
          ar: "ولأن POST ليست idempotent، لا يملك الـ server طريقة ليعرف أن الـ request الثاني تكرار. فينشئ order ثانياً. النتيجة: حوالي 48 وجبة مكررة يومياً، و48 عملية خصم مزدوجة، و48 تذكرة دعم غاضبة. الدعم يعيد المبلغ يدوياً في كل حالة، أي حوالي 4 ساعات عمل كل يوم."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "Before — POST /orders", ar: "قبل — POST /orders" },
              v: { en: "Server generates the order id. A repeat looks brand new. 48 duplicate orders a day.", ar: "الـ server هو من يولّد الـ order id. التكرار يبدو جديداً تماماً. 48 order مكرر يومياً." }
            },
            {
              k: { en: "After — PUT /orders/{clientId}", ar: "بعد — PUT /orders/{clientId}" },
              v: { en: "The phone generates a unique id before sending. A repeat targets the same row and overwrites it. 0 duplicates.", ar: "الموبايل يولّد id فريداً قبل الإرسال. التكرار يستهدف نفس الصف ويكتب فوقه. 0 تكرار." }
            },
            {
              k: { en: "What changed", ar: "ما الذي تغيّر" },
              v: { en: "Not the business logic — only who picks the identifier, and therefore which method is honest.", ar: "ليس منطق العمل — فقط من يختار الـ identifier، وبالتالي أي method تكون صادقة." }
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
          en: "Let us trace one request end to end. The phone opens a connection and writes a first line: `PUT /orders/9f2c-41a HTTP/1.1`. The method is just that first token — plain text, three to seven letters. ASP.NET Core's routing reads it and looks for an endpoint registered for both that path pattern and that method. If the path matches but the method does not, you get 405 Method Not Allowed, not 404 — the resource exists, the verb is wrong.",
          ar: "لنتتبع request واحداً من البداية للنهاية. يفتح الموبايل اتصالاً ويكتب السطر الأول: `PUT /orders/9f2c-41a HTTP/1.1`. الـ method هي هذا الجزء الأول فقط — نص عادي من ثلاثة إلى سبعة أحرف. الـ routing في ASP.NET Core يقرأه ويبحث عن endpoint مسجّل لنفس نمط المسار ونفس الـ method. إذا تطابق المسار ولم تتطابق الـ method، تحصل على 405 Method Not Allowed وليس 404 — الـ resource موجود لكن الفعل خاطئ."
        },
        {
          t: "p",
          en: "Between the phone and your code sit machines that read that first token and act on it. A CDN (a network of caching servers near the user) will store a GET response and serve it to the next caller without touching your server. It will never cache a POST. A reverse proxy configured to retry a failed upstream will resend a GET or a PUT, but is expected to refuse to resend a POST. None of these machines look at your code — they read the method and trust the promise.",
          ar: "بين الموبايل وكودك توجد أجهزة تقرأ هذا الجزء الأول وتتصرف بناءً عليه. الـ CDN (شبكة من servers للـ caching قريبة من المستخدم) يخزّن رد الـ GET ويقدّمه للمستدعي التالي دون أن يلمس server-ك. ولن يخزّن POST أبداً. والـ reverse proxy المُعد لإعادة المحاولة عند فشل الـ upstream سيعيد إرسال GET أو PUT، لكن يُتوقع منه أن يرفض إعادة إرسال POST. لا شيء من هذه الأجهزة ينظر إلى كودك — كلها تقرأ الـ method وتثق بالوعد."
        },
        {
          t: "p",
          en: "Idempotency is a statement about the final state on the server, not about the response body. Two DELETE calls on the same order can return 204 No Content then 404 Not Found — different replies, but the order is gone either way, so DELETE is still idempotent. This is the part people get wrong most often: identical responses are not required, an identical end state is.",
          ar: "الـ idempotency وصف للحالة النهائية على الـ server، وليس لجسم الرد. استدعاءان DELETE على نفس الـ order قد يُرجعان 204 No Content ثم 404 Not Found — ردان مختلفان، لكن الـ order اختفى في الحالتين، فتبقى DELETE idempotent. هذه أكثر نقطة يخطئ فيها الناس: تطابق الردود ليس مطلوباً، المطلوب تطابق الحالة النهائية."
        },
        {
          t: "p",
          en: "The analogy: idempotency is like writing a phone number on a whiteboard. Writing the same number again over the same spot leaves the board identical. Adding a line to a shopping list is different — every repeat makes the list longer. PUT writes over a named spot, so it is a whiteboard. POST appends to a list, so it is not.",
          ar: "التشبيه: الـ idempotency مثل كتابة رقم هاتف على سبورة. إعادة كتابة نفس الرقم في نفس المكان تترك السبورة كما هي. أما إضافة سطر لقائمة تسوّق فمختلفة — كل تكرار يجعل القائمة أطول. الـ PUT يكتب فوق مكان محدد بالاسم، فهو سبورة. والـ POST يضيف إلى قائمة، فهو ليس كذلك."
        },
        {
          t: "code",
          lang: "csharp",
          label: { en: "POST creates a new row every time; PUT writes over a named one", ar: "الـ POST ينشئ صفاً جديداً في كل مرة؛ والـ PUT يكتب فوق صف محدد بالاسم" },
          code: "// NOT idempotent: the id comes from the database, so a retry makes a second order.\napp.MapPost(\"/orders\", async (OrderDto dto, AppDb db) =>\n{\n    var order = new Order { Id = Guid.NewGuid(), Items = dto.Items };\n    db.Orders.Add(order);\n    await db.SaveChangesAsync();\n    return Results.Created($\"/orders/{order.Id}\", order);\n});\n\n// Idempotent: the client picked the id, so a retry lands on the same row.\napp.MapPut(\"/orders/{id:guid}\", async (Guid id, OrderDto dto, AppDb db) =>\n{\n    var existing = await db.Orders.FindAsync(id);\n    if (existing is null)\n    {\n        db.Orders.Add(new Order { Id = id, Items = dto.Items });\n        await db.SaveChangesAsync();\n        return Results.Created($\"/orders/{id}\", dto);   // first time\n    }\n\n    existing.Items = dto.Items;                          // full replacement\n    await db.SaveChangesAsync();\n    return Results.NoContent();                          // every retry after that\n});"
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "GET", ar: "GET" },
              v: { en: "Read one resource. Safe and idempotent. Cacheable. Never put a body on it — many proxies drop it.", ar: "قراءة resource. آمنة و idempotent. قابلة للـ caching. لا تضع body عليها — كثير من الـ proxies تتجاهله." }
            },
            {
              k: { en: "POST", ar: "POST" },
              v: { en: "Ask the server to process something and usually create a resource it names. Neither safe nor idempotent.", ar: "تطلب من الـ server معالجة شيء وغالباً إنشاء resource يسميه هو. ليست آمنة ولا idempotent." }
            },
            {
              k: { en: "PUT", ar: "PUT" },
              v: { en: "Replace the resource at this exact URL with the body you sent, whole. Idempotent, not safe.", ar: "استبدال الـ resource عند هذا الـ URL بالكامل بالـ body الذي أرسلته. idempotent وليست آمنة." }
            },
            {
              k: { en: "PATCH", ar: "PATCH" },
              v: { en: "Apply a partial change. Not idempotent by default — `{ \"increment\": 1 }` adds up on every retry.", ar: "تطبيق تعديل جزئي. ليست idempotent افتراضياً — الأمر `{ \"increment\": 1 }` يتراكم مع كل إعادة محاولة." }
            },
            {
              k: { en: "DELETE", ar: "DELETE" },
              v: { en: "Remove the resource. Idempotent: after the first success it is gone and stays gone.", ar: "حذف الـ resource. idempotent: بعد أول نجاح يختفي ويبقى مختفياً." }
            }
          ]
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
              "Client-generated ids make PUT honest, so retries are free and need no server-side dedup table",
              "Safe GETs let a CDN absorb read traffic without asking your server",
              "Correct methods give you 405 and cache behaviour for free from the framework and proxies",
              "Anyone reading the access log can tell reads from writes without opening the code"
            ],
            ar: [
              "توليد الـ id من الـ client يجعل PUT صادقة، فتصبح إعادة المحاولة مجانية دون جدول dedup على الـ server",
              "الـ GET الآمنة تسمح للـ CDN بامتصاص حركة القراءة دون سؤال server-ك",
              "الـ methods الصحيحة تمنحك سلوك 405 والـ caching مجاناً من الـ framework والـ proxies",
              "أي شخص يقرأ الـ access log يفرّق بين القراءة والكتابة دون فتح الكود"
            ]
          },
          cons: {
            en: [
              "PUT means full replacement, so a client that omits a field will blank it",
              "Client-generated ids are harder to make sequential or human-friendly",
              "PATCH is flexible but you must design its body format yourself",
              "Strict method rules feel like ceremony on a small internal API"
            ],
            ar: [
              "الـ PUT تعني استبدالاً كاملاً، فالـ client الذي يحذف حقلاً سيفرّغه",
              "الـ ids المولّدة من الـ client يصعب جعلها متسلسلة أو مقروءة للبشر",
              "الـ PATCH مرنة لكن عليك تصميم شكل جسمها بنفسك",
              "قواعد الـ methods الصارمة تبدو شكليات في API داخلي صغير"
            ]
          },
          limits: {
            en: [
              "Idempotency covers the server's own state, not emails or payments it triggers downstream",
              "Old proxies and some corporate firewalls still block PUT and DELETE entirely",
              "HTML forms only send GET and POST, so browser-only clients cannot use the rest",
              "A PUT is only idempotent if your handler truly replaces rather than appends"
            ],
            ar: [
              "الـ idempotency تغطي حالة الـ server نفسه، لا الرسائل أو المدفوعات التي يطلقها لاحقاً",
              "بعض الـ proxies القديمة وجدران الحماية في الشركات ما زالت تحجب PUT و DELETE تماماً",
              "نماذج HTML ترسل GET و POST فقط، فالـ clients داخل المتصفح لا تستطيع استخدام الباقي",
              "الـ PUT تكون idempotent فقط إذا كان الـ handler يستبدل فعلاً ولا يضيف"
            ]
          },
          alts: {
            en: [
              "Keep POST and add an Idempotency-Key header the server stores and dedups on",
              "POST for creation, PUT only for whole-object updates by a known id",
              "JSON Merge Patch (RFC 7386) for a simple, idempotent partial update format",
              "A queue plus a message id when the work is long-running and the reply is not immediate"
            ],
            ar: [
              "أبقِ POST وأضف ترويسة Idempotency-Key يخزّنها الـ server ويستخدمها لمنع التكرار",
              "POST للإنشاء، و PUT فقط لتحديث الكائن كاملاً عبر id معروف",
              "JSON Merge Patch (المعيار RFC 7386) كصيغة بسيطة و idempotent للتعديل الجزئي",
              "طابور (queue) مع message id عندما يكون العمل طويلاً والرد غير فوري"
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
          title: { en: "A GET that changes something", ar: "GET يغيّر شيئاً" },
          body: {
            en: "A team shipped `GET /orders/{id}/cancel` because it was easy to hit from a browser address bar. Then they added link previews to their internal chat tool. The preview bot fetched every URL pasted in a channel, and a support agent pasted a cancel link. Forty-one live orders were cancelled in one afternoon by a bot that was only trying to draw a thumbnail. GET must never have side effects — crawlers, prefetchers and preview bots all assume it is free to call.",
            ar: "أطلق فريق endpoint باسم `GET /orders/{id}/cancel` لأنه سهل الاستدعاء من شريط عنوان المتصفح. ثم أضافوا معاينة الروابط في أداة الدردشة الداخلية. بوت المعاينة كان يجلب كل URL يُلصق في قناة، وأحد موظفي الدعم لصق رابط إلغاء. أُلغي 41 order فعلياً في فترة بعد ظهر واحدة بسبب بوت كان يحاول رسم صورة مصغّرة فقط. الـ GET يجب ألا يكون لها side effects أبداً — الـ crawlers والـ prefetchers وبوتات المعاينة كلها تفترض أن استدعاءها مجاني."
          },
          fix: "// cancelling is a state change, so it needs a non-safe method\napp.MapPost(\"/orders/{id:guid}/cancellation\", CancelOrder);"
        },
        {
          t: "mistake",
          title: { en: "PUT used as a partial update", ar: "استخدام PUT كتعديل جزئي" },
          body: {
            en: "The web app sent `PUT /users/17` with every field it had on screen. The mobile app sent the same PUT but its edit screen had no phone number field, so it sent the object without one. The handler replaced the whole row, so every mobile save wiped the user's phone number to null. PUT means: this body is now the entire resource. If a client cannot send every field, it should not be using PUT.",
            ar: "تطبيق الويب كان يرسل `PUT /users/17` بكل الحقول الموجودة على الشاشة. تطبيق الموبايل يرسل نفس الـ PUT لكن شاشة التعديل فيه لا تحتوي حقل رقم الهاتف، فأرسل الكائن بدونه. الـ handler استبدل الصف كاملاً، فكل عملية حفظ من الموبايل كانت تمسح رقم هاتف المستخدم وتجعله null. الـ PUT تعني: هذا الـ body هو الـ resource بالكامل الآن. إذا كان الـ client لا يستطيع إرسال كل الحقول فلا يجب أن يستخدم PUT."
          },
          fix: "// send only the changed fields, with PATCH\nPATCH /users/17\nContent-Type: application/merge-patch+json\n\n{ \"displayName\": \"Sara\" }"
        },
        {
          t: "mistake",
          title: { en: "DELETE that throws on the second call", ar: "DELETE يرمي خطأ في الاستدعاء الثاني" },
          body: {
            en: "The handler loaded the entity and called `.First()`, which throws when nothing matches. A retry after a lost response therefore returned 500 Internal Server Error. The client's retry policy saw a 500, waited, and tried again — four times, all failing, ending in a red error toast for a delete that had already succeeded. A second DELETE should report that the resource is gone (204 or 404), never crash.",
            ar: "الـ handler كان يحمّل الكيان ويستدعي `.First()` التي ترمي استثناءً عند عدم وجود نتيجة. لذلك أعادت إعادة المحاولة بعد ضياع الرد الكود 500 Internal Server Error. سياسة إعادة المحاولة في الـ client رأت 500 فانتظرت وأعادت المحاولة — أربع مرات، كلها فشلت، وانتهت برسالة خطأ حمراء لعملية حذف كانت قد نجحت بالفعل. الـ DELETE الثاني يجب أن يخبر أن الـ resource اختفى (204 أو 404)، لا أن ينهار."
          },
          fix: "var order = await db.Orders.FindAsync(id);\nif (order is null) return Results.NoContent();   // already deleted\ndb.Orders.Remove(order);\nawait db.SaveChangesAsync();\nreturn Results.NoContent();"
        },
        {
          t: "mistake",
          title: { en: "POST for reads", ar: "استخدام POST للقراءة" },
          body: {
            en: "An internal API exposed `POST /api/getCustomer` with the id in the body, because someone found query strings ugly. Two things broke. The CDN could cache nothing, so a customer lookup that ran 40,000 times an hour hit the database every time instead of being served from cache. And when the service got slow, the retry layer refused to retry — it correctly treats POST as unsafe. A read modelled as POST loses caching and loses retries.",
            ar: "API داخلي عرّض `POST /api/getCustomer` مع الـ id في الـ body، لأن أحدهم رأى أن الـ query strings قبيحة. انكسر شيئان. الـ CDN لم يستطع تخزين أي شيء، فاستعلام العميل الذي يعمل 40,000 مرة في الساعة صار يضرب قاعدة البيانات في كل مرة بدل أن يُخدَم من الـ cache. وعندما بطؤت الخدمة رفضت طبقة إعادة المحاولة أن تعيد — فهي تعتبر POST غير آمنة، وهي محقة. القراءة المصمّمة كـ POST تخسر الـ caching وتخسر إعادة المحاولة."
          },
          fix: "GET /api/customers/4821"
        }
      ]
    },
    {
      key: "interview",
      blocks: [
        {
          t: "qa",
          level: "junior",
          q: { en: "What is the difference between safe and idempotent?", ar: "ما الفرق بين safe و idempotent؟" },
          a: {
            en: "Safe means the request only reads — it changes nothing, so calling it a hundred times is fine. Idempotent is weaker: it may change something, but repeating it does not change anything further. GET is both. DELETE is idempotent but not safe, because the first call really does remove data; the second one just finds nothing left to remove.",
            ar: "safe تعني أن الـ request للقراءة فقط — لا يغيّر شيئاً، فاستدعاؤه مئة مرة لا يضر. و idempotent أضعف: قد يغيّر شيئاً، لكن تكراره لا يغيّر شيئاً إضافياً. الـ GET الاثنان معاً. والـ DELETE تكون idempotent وليست safe، لأن الاستدعاء الأول يحذف بيانات فعلاً؛ والثاني لا يجد شيئاً ليحذفه."
          }
        },
        {
          t: "qa",
          level: "mid",
          q: { en: "Is PATCH idempotent?", ar: "هل PATCH تُعتبر idempotent؟" },
          a: {
            en: "Not by default — it depends entirely on the body you define. If the body is `{ \"status\": \"paid\" }`, applying it twice gives the same result, so that particular PATCH is idempotent. If the body is `{ \"balanceDelta\": -10 }`, running it twice takes twenty. The spec does not promise anything, so if you want retries to be safe you have to design the patch format to be a replacement of fields rather than an instruction to add or subtract.",
            ar: "ليست كذلك افتراضياً — الأمر يعتمد كلياً على شكل الـ body الذي تحدده. إذا كان الـ body هو `{ \"status\": \"paid\" }` فتطبيقه مرتين يعطي نفس النتيجة، وبالتالي هذه الـ PATCH تحديداً idempotent. أما إذا كان `{ \"balanceDelta\": -10 }` فتشغيله مرتين يخصم عشرين. المعيار لا يعد بشيء، فإذا أردت إعادة محاولة آمنة عليك تصميم صيغة الـ patch كاستبدال لحقول لا كتعليمات جمع أو طرح."
          }
        },
        {
          t: "qa",
          level: "mid",
          q: { en: "When would you choose PUT over POST for creating something?", ar: "متى تختار PUT بدل POST لإنشاء شيء؟" },
          a: {
            en: "When the client can produce the identifier itself, usually a GUID. Then the URL is known before the request is sent, so a retry lands on the exact same resource and simply overwrites it — no duplicates, no dedup table. I use POST when only the server can decide the id, for example when it is a database sequence or has to be short and human-readable.",
            ar: "عندما يستطيع الـ client توليد الـ identifier بنفسه، وغالباً يكون GUID. حينها يكون الـ URL معروفاً قبل إرسال الـ request، فتصل إعادة المحاولة إلى نفس الـ resource تماماً وتكتب فوقه — بلا تكرار وبلا جدول dedup. وأستخدم POST عندما يكون الـ server وحده من يحدد الـ id، مثلاً عندما يأتي من تسلسل في قاعدة البيانات أو يجب أن يكون قصيراً ومقروءاً للبشر."
          }
        },
        {
          t: "qa",
          level: "senior",
          q: { en: "Your POST endpoint charges a card. How do you make retries safe without switching to PUT?", ar: "الـ POST endpoint لديك يخصم من بطاقة. كيف تجعل إعادة المحاولة آمنة دون التحول إلى PUT؟" },
          a: {
            en: "I add an Idempotency-Key header. The client generates a random key per logical attempt and reuses the same key on every retry. On arrival the server inserts that key into a table with a unique constraint, inside the same transaction as the charge. If the insert fails because the key already exists, the request is a repeat, so I return the stored response instead of charging again. The key has a time to live — commonly 24 hours — after which the row is cleaned up.",
            ar: "أضيف ترويسة Idempotency-Key. يولّد الـ client مفتاحاً عشوائياً لكل محاولة منطقية ويعيد استخدام نفس المفتاح في كل إعادة إرسال. عند الوصول يُدخل الـ server هذا المفتاح في جدول عليه unique constraint، داخل نفس الـ transaction الخاصة بالخصم. إذا فشل الإدخال لأن المفتاح موجود، فالـ request تكرار، فأُرجع الرد المخزّن بدل الخصم مرة أخرى. وللمفتاح مدة صلاحية — 24 ساعة عادةً — يُحذف الصف بعدها."
          }
        },
        {
          t: "qa",
          level: "senior",
          q: { en: "A GET is idempotent. Does that mean a proxy can always retry it?", ar: "الـ GET هي idempotent. هل يعني ذلك أن الـ proxy يستطيع دائماً إعادة إرسالها؟" },
          a: {
            en: "It means retrying is correct as far as data goes, but it can still be a bad idea for load. If the origin is failing because it is overloaded, every proxy retrying every GET multiplies traffic exactly when the server is weakest. That is why retries need a budget and backoff on top of idempotency — idempotency tells you a retry is allowed, not that it is wise right now.",
            ar: "يعني أن إعادة الإرسال صحيحة من ناحية البيانات، لكنها قد تظل فكرة سيئة من ناحية الحمل. إذا كان الـ origin يفشل بسبب الحمل الزائد، فإعادة كل proxy لكل GET تضاعف الحركة في اللحظة التي يكون فيها الـ server في أضعف حالاته. لهذا تحتاج إعادة المحاولة إلى ميزانية وإلى backoff فوق الـ idempotency — الـ idempotency تخبرك أن إعادة المحاولة مسموحة، لا أنها حكيمة الآن."
          }
        },
        {
          t: "qa",
          level: "staff",
          q: { en: "Half your teams model actions as POST /doThing and half use proper methods. How do you fix that across the org?", ar: "نصف فرقكم تصمم العمليات كـ POST /doThing والنصف الآخر يستخدم methods صحيحة. كيف تعالج ذلك على مستوى المؤسسة؟" },
          a: {
            en: "I would not open 200 pull requests. I would write one short API convention page — three rules, with examples of both the wrong and the right shape — and get it agreed by the tech leads, not imposed. Then I would put the check where it is cheap: a linter over the OpenAPI files in CI that flags a GET with a verb in its path or a POST used for a pure read, warning-only at first. New endpoints have to pass; existing ones get an exemption list that shrinks as teams touch them. Culture plus a machine check beats a mandate, because the mandate is forgotten in three months and the CI job is not.",
            ar: "لن أفتح 200 pull request. سأكتب صفحة واحدة قصيرة لاتفاقية الـ API — ثلاث قواعد مع أمثلة على الشكل الخاطئ والصحيح — وأحصل على موافقة قادة الفرق التقنيين بدل الفرض. ثم أضع الفحص حيث يكون رخيصاً: linter يمر على ملفات OpenAPI داخل الـ CI ويشير إلى GET يحتوي فعلاً في مساره أو POST يُستخدم لقراءة صرفة، كتحذير فقط في البداية. الـ endpoints الجديدة يجب أن تنجح، والقديمة توضع في قائمة استثناءات تتقلص كلما لمستها الفرق. الثقافة مع فحص آلي أفضل من قرار إداري، لأن القرار يُنسى خلال ثلاثة أشهر أما وظيفة الـ CI فلا تُنسى."
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
          title: { en: "A state change hidden behind GET", ar: "تغيير للحالة مخفي خلف GET" },
          bad: "[HttpGet(\"/orders/{id}/approve\")]\npublic async Task<IActionResult> Approve(Guid id)\n{\n    await _orders.ApproveAsync(id);\n    return Ok();\n}",
          good: "[HttpPost(\"/orders/{id}/approvals\")]\npublic async Task<IActionResult> Approve(Guid id)\n{\n    await _orders.ApproveAsync(id);\n    return Accepted();\n}",
          why: {
            en: "The GET version will be called by anything that walks URLs: a browser prefetching a link on hover, a chat preview bot, a security scanner, a CDN warming its cache. Every one of those approves an order as a side effect of just looking. Switching to POST tells every intermediary this is a write and stops all of them from calling it on their own.",
            ar: "نسخة الـ GET سيستدعيها أي شيء يتنقل بين الـ URLs: متصفح يجلب الرابط مسبقاً عند مرور المؤشر، بوت معاينة في الدردشة، ماسح أمني، CDN يسخّن الـ cache. كل واحد من هؤلاء يعتمد order كأثر جانبي لمجرد النظر. التحول إلى POST يخبر كل وسيط أن هذه عملية كتابة ويمنعهم جميعاً من استدعائها من تلقاء أنفسهم."
          }
        },
        {
          t: "review",
          severity: "medium",
          title: { en: "PUT that appends instead of replacing", ar: "PUT يضيف بدل أن يستبدل" },
          bad: "[HttpPut(\"/orders/{id}/items\")]\npublic async Task<IActionResult> AddItems(Guid id, List<ItemDto> items)\n{\n    var order = await _db.Orders.FindAsync(id);\n    order.Items.AddRange(items);          // grows on every call\n    await _db.SaveChangesAsync();\n    return NoContent();\n}",
          good: "[HttpPut(\"/orders/{id}/items\")]\npublic async Task<IActionResult> ReplaceItems(Guid id, List<ItemDto> items)\n{\n    var order = await _db.Orders.FindAsync(id);\n    order.Items = items.Select(ToEntity).ToList();   // same result every call\n    await _db.SaveChangesAsync();\n    return NoContent();\n}",
          why: {
            en: "The method says PUT, so the client's HTTP library is allowed to resend it after a timeout. With AddRange, a resend doubles the basket — the customer pays for two of everything. The fix is not to change the method but to make the handler do what PUT promises: after the call, the collection equals the body, no matter how many times it ran.",
            ar: "الـ method مكتوبة PUT، فمكتبة الـ HTTP في الـ client مسموح لها بإعادة الإرسال بعد انتهاء المهلة. ومع AddRange تتضاعف السلة عند إعادة الإرسال — فيدفع العميل ثمن نسختين من كل شيء. الحل ليس تغيير الـ method بل جعل الـ handler يفعل ما تعد به PUT: بعد الاستدعاء تساوي المجموعة الـ body، مهما تكرر التنفيذ."
          }
        }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        {
          t: "p",
          en: "In a real system the method choice decides where traffic can be absorbed. Put a CDN in front of a product catalogue served by GET and 90% of read requests never reach your service — the CDN answers from its own copy. Model the same catalogue as POST /search and the CDN is a pass-through: every request costs you a database round trip. The same design question repeats one layer down, at the load balancer, which will only re-send an in-flight request to a second server if the method allows it.",
          ar: "في نظام حقيقي، اختيار الـ method يحدد أين يمكن امتصاص الحركة. ضع CDN أمام كتالوج منتجات يُخدَم عبر GET، فلن يصل 90% من requests القراءة إلى خدمتك أصلاً — الـ CDN يجيب من نسخته. صمّم نفس الكتالوج كـ POST /search فيصبح الـ CDN مجرد ممر: كل request يكلفك رحلة إلى قاعدة البيانات. ونفس السؤال يتكرر في الطبقة الأدنى عند الـ load balancer، الذي لن يعيد إرسال request قيد التنفيذ إلى server ثانٍ إلا إذا سمحت الـ method بذلك."
        },
        {
          t: "ul",
          en: [
            "Payment APIs expose POST /charges but require an Idempotency-Key header, so a retry after a network drop returns the original charge instead of a second one.",
            "Configuration services use PUT /config/{key} so a deploy pipeline can re-apply the whole config as many times as it likes and converge on one state.",
            "Message consumers treat each message id as an idempotency key, because a broker that guarantees at-least-once delivery will hand you the same message twice.",
            "Public read APIs keep every listing endpoint on GET specifically so a CDN and browser caches can serve most of the traffic."
          ],
          ar: [
            "APIs الدفع تعرض POST /charges لكنها تطلب ترويسة Idempotency-Key، فإعادة المحاولة بعد انقطاع الشبكة تُرجع عملية الخصم الأصلية لا واحدة ثانية.",
            "خدمات الإعدادات تستخدم PUT /config/{key} حتى يستطيع خط النشر إعادة تطبيق الإعدادات كاملة كما يشاء ويصل إلى حالة واحدة.",
            "مستهلكو الرسائل يعاملون كل message id كمفتاح idempotency، لأن الـ broker الذي يضمن التوصيل مرة على الأقل سيسلّمك نفس الرسالة مرتين.",
            "APIs القراءة العامة تُبقي كل endpoint للقوائم على GET تحديداً ليستطيع الـ CDN و caches المتصفح خدمة معظم الحركة."
          ]
        },
        {
          t: "callout",
          kind: "warn",
          en: "Idempotency stops at your database. If your handler also sends a confirmation email, a second call that correctly skips the insert can still send a second email unless the email step checks the same key.",
          ar: "الـ idempotency تتوقف عند قاعدة بياناتك. إذا كان الـ handler يرسل أيضاً بريد تأكيد، فالاستدعاء الثاني الذي يتخطى الإدخال بشكل صحيح قد يرسل بريداً ثانياً، إلا إذا فحصت خطوة البريد نفس المفتاح."
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
              v: { en: "A cacheable GET can be answered by a CDN in 15-30 ms instead of 200 ms from your origin — the user's request never crosses the ocean.", ar: "الـ GET القابلة للـ caching يجيب عنها الـ CDN في 15-30 ms بدل 200 ms من الـ origin — فلا يعبر request المستخدم المحيط أصلاً." }
            },
            {
              k: { en: "Database", ar: "Database" },
              v: { en: "Turning a hot read from POST into GET removed 40,000 queries an hour in the earlier example, because the CDN absorbed them.", ar: "تحويل قراءة كثيفة من POST إلى GET أزال 40,000 استعلام في الساعة في المثال السابق، لأن الـ CDN امتصها." }
            },
            {
              k: { en: "Latency", ar: "Latency" },
              v: { en: "Idempotent methods let a proxy retry a slow node immediately instead of waiting out its full timeout, which cuts the worst-case wait.", ar: "الـ methods الـ idempotent تسمح للـ proxy بإعادة المحاولة على node بطيء فوراً بدل انتظار المهلة كاملة، فيقل أسوأ زمن انتظار." }
            },
            {
              k: { en: "Scalability", ar: "Scalability" },
              v: { en: "Safe reads scale by adding read replicas and cache nodes; unsafe writes scale only by making the write path itself faster.", ar: "القراءات الآمنة تتوسّع بإضافة read replicas و cache nodes؛ أما الكتابات غير الآمنة فلا تتوسّع إلا بتسريع مسار الكتابة نفسه." }
            },
            {
              k: { en: "CPU", ar: "CPU" },
              v: { en: "A dedup lookup on an idempotency key is one indexed primary-key read — microseconds, and far cheaper than repeating the real work.", ar: "فحص التكرار على مفتاح idempotency هو قراءة واحدة بمفتاح أساسي مفهرس — ميكروثوانٍ، وأرخص بكثير من تكرار العمل الحقيقي." }
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
            "`curl -i -X OPTIONS https://api.example.com/orders/1` — read the Allow header in the response; it lists exactly which methods that route accepts.",
            "Search your access log for repeated writes: group by method, path and client id within a 60 second window. Two POSTs with identical bodies is a retry that created a duplicate.",
            "Browser DevTools, Network tab: the Method column tells you what the front end really sent, which is often not what the front-end code appears to send after a redirect.",
            "Check for 405 responses in your logs — they mean a client is calling the right URL with the wrong verb, usually after a refactor renamed a method attribute.",
            "In the database, run a group-by on created_at plus payload hash. Rows created seconds apart with the same hash are duplicate submissions, not real user behaviour."
          ],
          ar: [
            "`curl -i -X OPTIONS https://api.example.com/orders/1` — اقرأ ترويسة Allow في الرد؛ فهي تسرد بالضبط الـ methods التي يقبلها هذا الـ route.",
            "ابحث في الـ access log عن كتابات متكررة: جمّع حسب الـ method والمسار و client id ضمن نافذة 60 ثانية. وجود POST مرتين بنفس الـ body يعني إعادة محاولة أنشأت تكراراً.",
            "أدوات المطور في المتصفح، تبويب Network: عمود Method يخبرك بما أرسله الواجهة فعلاً، وهو غالباً ليس ما يبدو أن كود الواجهة يرسله بعد redirect.",
            "افحص ردود 405 في سجلاتك — تعني أن client يستدعي الـ URL الصحيح بفعل خاطئ، وغالباً بعد إعادة هيكلة غيّرت اسم الـ method attribute.",
            "في قاعدة البيانات، نفّذ group by على created_at مع hash للحمولة. الصفوف المنشأة بفارق ثوانٍ بنفس الـ hash هي إرسالات مكررة لا سلوك مستخدم حقيقي."
          ]
        },
        {
          t: "callout",
          kind: "tip",
          en: "A 301 or 302 redirect can quietly change POST into GET — many clients follow the redirect with GET and drop the body. If a write silently does nothing, check whether it was redirected (for example http to https) before it reached your handler.",
          ar: "الـ redirect بالكود 301 أو 302 قد يحوّل POST إلى GET بهدوء — كثير من الـ clients تتبع الـ redirect بـ GET وتُسقط الـ body. إذا كانت عملية كتابة لا تفعل شيئاً بصمت، تحقق مما إذا كانت قد أُعيد توجيهها (من http إلى https مثلاً) قبل أن تصل إلى الـ handler."
        }
      ]
    },
    {
      key: "realworld",
      blocks: [
        {
          t: "p",
          en: "The industries that care most about methods are the ones where a duplicate costs real money or real trust. In payments, a repeated charge is a chargeback and a support call. In ticketing, a repeated booking is a seat sold twice. In both, the fix is the same shape: make the client name the operation before sending it, then let the server recognise the name on a second arrival.",
          ar: "القطاعات الأكثر اهتماماً بالـ methods هي التي يكلف فيها التكرار مالاً حقيقياً أو ثقة حقيقية. في المدفوعات، الخصم المكرر يعني نزاعاً على العملية ومكالمة دعم. وفي حجز التذاكر، الحجز المكرر يعني مقعداً بيع مرتين. والحل في الحالتين له نفس الشكل: اجعل الـ client يسمّي العملية قبل إرسالها، ثم دع الـ server يتعرف على الاسم عند الوصول الثاني."
        },
        {
          t: "ul",
          en: [
            "Payment platforms: POST plus a required idempotency key, and a documented window (often 24 hours) during which a repeat returns the original result.",
            "Ticketing and booking systems: the seat hold is created with a client-generated id so a retry on a flaky connection reclaims the same hold instead of taking a second seat.",
            "Infrastructure and deployment tools: everything is modelled as PUT-style desired state, so re-running the same apply converges rather than stacking changes.",
            "Mobile-first consumer apps: offline queues replay every pending write when the phone reconnects, which only works if those writes are idempotent by design."
          ],
          ar: [
            "منصات الدفع: POST مع مفتاح idempotency إجباري، ونافذة موثّقة (غالباً 24 ساعة) يُرجع خلالها التكرار النتيجة الأصلية.",
            "أنظمة التذاكر والحجز: يُنشأ حجز المقعد بـ id مولّد من الـ client، فتستعيد إعادة المحاولة على اتصال ضعيف نفس الحجز بدل أخذ مقعد ثانٍ.",
            "أدوات البنية التحتية والنشر: كل شيء يُصمم كحالة مرغوبة على نمط PUT، فإعادة تشغيل نفس التطبيق تتقارب بدل أن تتراكم التغييرات.",
            "تطبيقات المستهلك التي تبدأ من الموبايل: طوابير العمل دون اتصال تعيد تشغيل كل عمليات الكتابة المعلّقة عند عودة الشبكة، وهذا لا ينجح إلا إذا كانت تلك العمليات idempotent بالتصميم."
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
          en: "Take the POST /orders endpoint from this lesson and add a second route, PUT /orders/{id}, that creates the order when the id is unused and replaces it when it exists. Prove it works by sending the same PUT three times with curl and checking the table has exactly one row.",
          ar: "خذ الـ endpoint المسمى POST /orders من هذا الدرس وأضف route ثانياً هو PUT /orders/{id}، ينشئ الـ order إذا كان الـ id غير مستخدم ويستبدله إذا كان موجوداً. أثبت أنه يعمل بإرسال نفس الـ PUT ثلاث مرات عبر curl والتأكد أن الجدول يحتوي صفاً واحداً بالضبط."
        },
        {
          t: "ex",
          diff: "medium",
          en: "Write an integration test that calls DELETE /orders/{id} twice. The first call must return 204 and the second must also return 204 or 404 — never a 500. Make the test fail first by using .First() in the handler, then fix it.",
          ar: "اكتب اختبار تكامل يستدعي DELETE /orders/{id} مرتين. يجب أن يُرجع الاستدعاء الأول 204 والثاني 204 أو 404 — ولا يُرجع 500 أبداً. اجعل الاختبار يفشل أولاً باستخدام ‎.First()‎ داخل الـ handler، ثم أصلحه."
        },
        {
          t: "ex",
          diff: "hard",
          en: "Add Idempotency-Key support to POST /orders. Store the key, the response status and the response body in a table with a unique index on the key, written inside the same transaction as the order. Then run 50 parallel requests carrying the same key and confirm exactly one order exists and all 50 responses are identical.",
          ar: "أضف دعم Idempotency-Key إلى POST /orders. خزّن المفتاح وحالة الرد وجسم الرد في جدول عليه unique index على المفتاح، ويُكتب داخل نفس الـ transaction الخاصة بالـ order. ثم شغّل 50 request متوازياً تحمل نفس المفتاح وتأكد أن هناك order واحداً بالضبط وأن الردود الخمسين متطابقة."
        },
        {
          t: "ex",
          diff: "senior",
          en: "Audit an existing service: list every endpoint with its method and say whether it keeps the safety and idempotency promise of that method. Write a one-page proposal for the three worst offenders, including what breaks today and the cost of changing each. Success is a colleague agreeing with your ranking without you explaining it verbally.",
          ar: "دقّق خدمة قائمة: اسرد كل endpoint مع الـ method الخاصة به وقل إن كان يحافظ على وعد الأمان والـ idempotency لتلك الـ method. اكتب مقترحاً من صفحة واحدة لأسوأ ثلاثة، يوضح ما ينكسر اليوم وتكلفة تغيير كل منها. النجاح أن يوافق زميل على ترتيبك دون أن تشرحه له شفهياً."
        }
      ]
    },
    {
      key: "refs",
      blocks: [
        {
          t: "ref",
          label: { en: "RFC 9110 — HTTP Semantics, method definitions", ar: "RFC 9110 — دلالات HTTP وتعريفات الـ methods" },
          url: "https://www.rfc-editor.org/rfc/rfc9110.html#name-methods",
          meta: { en: "Spec", ar: "معيار" }
        },
        {
          t: "ref",
          label: { en: "MDN — HTTP request methods", ar: "MDN — الـ HTTP request methods" },
          url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods",
          meta: { en: "Docs", ar: "توثيق" }
        },
        {
          t: "ref",
          label: { en: "RFC 7386 — JSON Merge Patch", ar: "RFC 7386 — JSON Merge Patch" },
          url: "https://www.rfc-editor.org/rfc/rfc7386.html",
          meta: { en: "Spec", ar: "معيار" }
        },
        {
          t: "ref",
          label: { en: "Stripe — idempotent requests", ar: "Stripe — الـ idempotent requests" },
          url: "https://docs.stripe.com/api/idempotent_requests",
          meta: { en: "Article", ar: "مقال" }
        }
      ]
    }
  ],
  quiz: [
    {
      q: {
        en: "Which pair of promises does DELETE make?",
        ar: "أي زوج من الوعود تقطعه DELETE؟"
      },
      options: [
        { en: "Safe and idempotent", ar: "safe و idempotent" },
        { en: "Idempotent but not safe", ar: "idempotent لكن ليست safe" },
        { en: "Safe but not idempotent", ar: "safe لكن ليست idempotent" },
        { en: "Neither safe nor idempotent", ar: "لا safe ولا idempotent" }
      ],
      correct: 1,
      why: {
        en: "DELETE changes data, so it is not safe. But after the first successful call the resource is gone, and further calls leave the server in the same state — that is idempotent.",
        ar: "الـ DELETE تغيّر البيانات فهي ليست safe. لكن بعد أول استدعاء ناجح يختفي الـ resource، والاستدعاءات التالية تترك الـ server في نفس الحالة — وهذا معنى idempotent."
      }
    },
    {
      q: {
        en: "Two DELETE calls return 204 then 404. Does that break idempotency?",
        ar: "استدعاءان DELETE يُرجعان 204 ثم 404. هل يكسر ذلك الـ idempotency؟"
      },
      options: [
        { en: "Yes — idempotent methods must return the same status", ar: "نعم — الـ methods الـ idempotent يجب أن تُرجع نفس الحالة" },
        { en: "Yes — 404 means the first call failed", ar: "نعم — الكود 404 يعني أن الاستدعاء الأول فشل" },
        { en: "No — idempotency is about the server's final state, not the response", ar: "لا — الـ idempotency تخص الحالة النهائية للـ server لا الرد" },
        { en: "No, but only if the client ignores the status code", ar: "لا، لكن فقط إذا تجاهل الـ client كود الحالة" }
      ],
      correct: 2,
      why: {
        en: "Idempotency constrains the state left behind on the server. The order is gone after both calls, so the promise holds even though the two responses differ.",
        ar: "الـ idempotency تقيّد الحالة المتروكة على الـ server. الـ order اختفى بعد الاستدعاءين، فيبقى الوعد صحيحاً رغم اختلاف الردين."
      }
    },
    {
      q: {
        en: "Why is `PATCH { \"balanceDelta\": -10 }` unsafe to retry?",
        ar: "لماذا تكون إعادة إرسال `PATCH { \"balanceDelta\": -10 }` غير آمنة؟"
      },
      options: [
        { en: "PATCH is never allowed to change money fields", ar: "الـ PATCH غير مسموح لها بتغيير حقول المال أبداً" },
        { en: "The body is an instruction that accumulates, so a repeat subtracts twenty", ar: "الـ body تعليمة تتراكم، فالتكرار يخصم عشرين" },
        { en: "PATCH bodies are not cacheable", ar: "أجسام الـ PATCH غير قابلة للـ caching" },
        { en: "PATCH always returns 405 on the second call", ar: "الـ PATCH تُرجع دائماً 405 في الاستدعاء الثاني" }
      ],
      correct: 1,
      why: {
        en: "PATCH is only as idempotent as the body format you design. A delta instruction adds up on each retry; a field replacement like `{ \"status\": \"paid\" }` does not.",
        ar: "الـ PATCH تكون idempotent بقدر ما تصممه من صيغة للـ body. تعليمة الفرق تتراكم مع كل إعادة محاولة، أما استبدال حقل مثل `{ \"status\": \"paid\" }` فلا."
      }
    },
    {
      q: {
        en: "You must keep POST for a card charge. What makes retries safe?",
        ar: "عليك الإبقاء على POST لعملية خصم من بطاقة. ما الذي يجعل إعادة المحاولة آمنة؟"
      },
      options: [
        { en: "Increasing the client timeout so retries never happen", ar: "زيادة مهلة الـ client حتى لا تحدث إعادة محاولة" },
        { en: "Returning 200 instead of 201 so caches store the response", ar: "إرجاع 200 بدل 201 لتخزّن الـ caches الرد" },
        { en: "A client-supplied Idempotency-Key stored with a unique constraint in the charge transaction", ar: "مفتاح Idempotency-Key من الـ client يُخزَّن بـ unique constraint داخل transaction الخصم" },
        { en: "Marking the endpoint as safe in the OpenAPI document", ar: "وسم الـ endpoint كـ safe في مستند OpenAPI" }
      ],
      correct: 2,
      why: {
        en: "The key gives the operation a name the client chose before sending. The unique constraint makes the second insert fail, so the server returns the stored response instead of charging again.",
        ar: "المفتاح يعطي العملية اسماً اختاره الـ client قبل الإرسال. والـ unique constraint يجعل الإدخال الثاني يفشل، فيُرجع الـ server الرد المخزّن بدل الخصم مرة أخرى."
      }
    },
    {
      q: {
        en: "What is the main cost of modelling a read as POST /api/getCustomer?",
        ar: "ما التكلفة الأساسية لتصميم عملية قراءة كـ POST /api/getCustomer؟"
      },
      options: [
        { en: "It uses more bandwidth per request", ar: "يستهلك نطاقاً أوسع لكل request" },
        { en: "Caches and retry layers both refuse to help, so every call hits the database", ar: "الـ caches وطبقات إعادة المحاولة ترفض المساعدة، فكل استدعاء يضرب قاعدة البيانات" },
        { en: "POST bodies cannot contain an id", ar: "أجسام الـ POST لا يمكن أن تحتوي id" },
        { en: "The framework will reject it with 405", ar: "الـ framework سيرفضه بالكود 405" }
      ],
      correct: 1,
      why: {
        en: "Intermediaries read the method to decide behaviour. POST is treated as unsafe, so a CDN will not cache the response and a retry layer will not resend it.",
        ar: "الوسطاء يقرؤون الـ method ليحددوا سلوكهم. والـ POST تُعامل كغير آمنة، فلا يخزّن الـ CDN الرد ولا تعيد طبقة إعادة المحاولة إرساله."
      }
    }
  ]
};
```

NEXT: http-caching
