```js
const restConstraintsLesson = {
  id: "rest-constraints",
  moduleId: "foundations",
  title: { en: "The six constraints", ar: "القيود الستة" },
  summary: {
    en: "The six rules that make an HTTP API cacheable, scalable and safe to change — and what actually breaks when you drop each one.",
    ar: "القواعد الست التي تجعل الـ HTTP API قابلاً للـ caching وللتوسّع وللتغيير بأمان — وما الذي ينكسر فعلياً عند إسقاط كل واحدة منها."
  },
  mins: 13,
  sections: [
    {
      key: "why",
      blocks: [
        {
          t: "p",
          en: "REST is a list of six design rules for building an API on top of HTTP. Follow them and you get three concrete things almost for free: responses that caches can store, servers you can add or remove at will, and clients that keep working when you change the code behind the API.",
          ar: "الـ REST هو قائمة من ست قواعد تصميم لبناء API فوق الـ HTTP. لو التزمت بها تحصل على ثلاثة أشياء ملموسة تقريباً بالمجان: responses يستطيع الـ cache تخزينها، وservers تضيفها أو تحذفها وقتما شئت، وclients تستمر في العمل عندما تغيّر الكود خلف الـ API."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "REST", ar: "REST" },
              v: {
                en: "Representational State Transfer. A set of six design rules described by Roy Fielding in his year-2000 PhD thesis, written to explain why the web scaled.",
                ar: "Representational State Transfer. مجموعة من ست قواعد تصميم وصفها Roy Fielding في رسالة الدكتوراه سنة 2000، كتبها ليشرح سبب قدرة الويب على التوسّع."
              }
            },
            {
              k: { en: "Constraint", ar: "Constraint" },
              v: {
                en: "A rule you accept on purpose. You give up some freedom, and in exchange the system gains a property you want, like cacheability.",
                ar: "قاعدة تقبلها عن قصد. تتنازل عن بعض الحرية، وفي المقابل يكتسب النظام خاصية تريدها، مثل القابلية للـ caching."
              }
            },
            {
              k: { en: "Resource", ar: "Resource" },
              v: {
                en: "A thing your API talks about, named by a URL. Order 1042 is a resource; its URL is /orders/1042.",
                ar: "شيء يتحدث عنه الـ API، له اسم على شكل URL. الطلب رقم 1042 هو resource، وعنوانه /orders/1042."
              }
            },
            {
              k: { en: "Representation", ar: "Representation" },
              v: {
                en: "One rendering of that resource, sent over the wire — usually a JSON document. The order lives in a database row; the JSON you return is a representation of it.",
                ar: "شكل واحد من أشكال ذلك الـ resource يُرسل عبر الشبكة — عادة مستند JSON. الطلب موجود في صف داخل الـ database، والـ JSON الذي ترجعه هو representation له."
              }
            },
            {
              k: { en: "Uniform interface", ar: "Uniform interface" },
              v: {
                en: "Every resource is reached the same way: a URL, one of a small fixed set of methods (GET, POST, PUT, DELETE...), and standard headers.",
                ar: "كل resource يُوصل إليه بنفس الطريقة: URL، وواحدة من مجموعة صغيرة ثابتة من الـ methods (GET, POST, PUT, DELETE...)، وheaders قياسية."
              }
            },
            {
              k: { en: "Intermediary", ar: "Intermediary" },
              v: {
                en: "Any box sitting between client and server that forwards the request: a CDN, a reverse proxy, an API gateway, a load balancer.",
                ar: "أي صندوق يقف بين الـ client والـ server ويمرّر الطلب: CDN أو reverse proxy أو API gateway أو load balancer."
              }
            }
          ]
        },
        {
          t: "p",
          en: "The rules exist because of a problem the early web had. Different teams wrote browsers, proxies and servers, none of them talking to each other, and the whole thing still had to work. That only worked because everyone agreed on one message format and one small vocabulary of verbs. Fielding wrote the six constraints down after the fact, as a description of what the web was already doing right.",
          ar: "هذه القواعد وُجدت بسبب مشكلة واجهت الويب في بدايته. فرق مختلفة كتبت browsers وproxies وservers، ولا أحد منهم يتحدث مع الآخر، ومع ذلك كان لا بد أن يعمل كل شيء معاً. نجح ذلك فقط لأن الجميع اتفقوا على شكل رسالة واحد وقائمة صغيرة من الأفعال. كتب Fielding القيود الست لاحقاً كوصف لما كان الويب يفعله بالفعل بشكل صحيح."
        },
        {
          t: "p",
          en: "Think of the postal system. You can mail a package to any address in the world without knowing anything about the building at the other end. That works because the envelope is standard: an address on the front, a stamp in the corner, a marking that says fragile or not. Sorting offices along the way read only the envelope and route the package without opening it. In REST the URL is the address, the HTTP method is the marking, and the headers are the stamps — and every proxy along the route can act on the request without knowing anything about your business logic.",
          ar: "تخيّل نظام البريد. تستطيع إرسال طرد إلى أي عنوان في العالم دون أن تعرف شيئاً عن المبنى في الطرف الآخر. ينجح هذا لأن الظرف موحّد: عنوان في المقدمة، وطابع في الزاوية، وعلامة تقول قابل للكسر أو لا. مكاتب الفرز على الطريق تقرأ الظرف فقط وتوجّه الطرد دون فتحه. في الـ REST الـ URL هو العنوان، والـ HTTP method هو العلامة، والـ headers هي الطوابع — وكل proxy على الطريق يستطيع التصرف بناءً عليها دون أن يعرف شيئاً عن منطق العمل عندك."
        },
        {
          t: "callout",
          kind: "note",
          en: "Five of the six constraints are required. The sixth, code-on-demand, is explicitly optional in Fielding's own text. An API that skips it is still REST.",
          ar: "خمسة من القيود الست إلزامية. السادس، code-on-demand، اختياري صراحةً في نص Fielding نفسه. الـ API الذي يتجاهله يبقى REST."
        }
      ]
    },
    {
      key: "problem",
      blocks: [
        {
          t: "p",
          en: "Here is the running example for this whole lesson: an order API. The first version was written RPC-style, meaning each operation got its own URL with a verb in it, like a remote function call. Reading an order was POST /api/getOrderById with a body of { \"id\": 1042 }. It worked and the tests passed.",
          ar: "هذا هو المثال الذي سنستخدمه في الدرس كله: API للطلبات. النسخة الأولى كُتبت بأسلوب RPC، أي أن كل عملية أخذت URL خاصاً بها يحتوي على فعل، تماماً كاستدعاء دالة عن بُعد. قراءة طلب كانت POST /api/getOrderById مع body فيه { \"id\": 1042 }. عمل الأمر ونجحت الاختبارات."
        },
        {
          t: "p",
          en: "Then traffic grew. The order page was opened about 4,000 times a minute, and every single one of those hits reached the application servers and ran a database query — because a POST is never cached by anything, and the CDN in front could not tell one POST body from another. The team rewrote reads as GET /orders/1042 with an ETag header, which is a short string that identifies the exact version of a response.",
          ar: "ثم زاد الـ traffic. صفحة الطلب كانت تُفتح نحو 4000 مرة في الدقيقة، وكل واحدة منها كانت تصل إلى الـ application servers وتشغّل query على الـ database — لأن الـ POST لا يخزّنه أي cache أبداً، والـ CDN في المقدمة لا يستطيع التفريق بين body وآخر. أعاد الفريق كتابة عمليات القراءة على شكل GET /orders/1042 مع header اسمه ETag، وهو نص قصير يحدّد النسخة الدقيقة من الـ response."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "Requests reaching the app servers", ar: "الطلبات التي تصل إلى الـ app servers" },
              v: {
                en: "4,000/min before, 880/min after — the CDN answered the rest from its own copy, so those never touched your code at all.",
                ar: "4000 في الدقيقة قبلاً، 880 بعدها — الـ CDN أجاب على الباقي من نسخته الخاصة، فتلك الطلبات لم تلمس الكود عندك إطلاقاً."
              }
            },
            {
              k: { en: "Database queries per minute", ar: "عدد الـ queries في الدقيقة" },
              v: {
                en: "4,000 down to 880. Same data, same freshness rules — the difference is purely that a GET can be cached and a POST cannot.",
                ar: "من 4000 إلى 880. نفس البيانات ونفس قواعد التحديث — الفرق فقط أن الـ GET يمكن تخزينه في الـ cache والـ POST لا."
              }
            },
            {
              k: { en: "p95 latency", ar: "p95 للـ latency" },
              v: {
                en: "310 ms to 40 ms. p95 means the slowest 5 requests out of every 100; the fast majority barely changed, the slow tail collapsed.",
                ar: "من 310 ms إلى 40 ms. الـ p95 يعني أبطأ 5 طلبات من كل 100؛ الأغلبية السريعة لم تتغير كثيراً، لكن الذيل البطيء انهار."
              }
            },
            {
              k: { en: "Code changed", ar: "الكود الذي تغيّر" },
              v: {
                en: "One controller method and two lines of header code. No new infrastructure was bought — the CDN was already there, it just had nothing it was allowed to cache.",
                ar: "method واحدة في الـ controller وسطران لضبط الـ headers. لم يُشترَ أي infrastructure جديد — الـ CDN كان موجوداً أصلاً، لكن لم يكن لديه ما يُسمح له بتخزينه."
              }
            }
          ]
        },
        {
          t: "p",
          en: "That is the whole argument for the constraints. Nobody wrote faster code. They stopped hiding the meaning of the request from the machines that could have helped.",
          ar: "هذه هي كل الحجة لصالح القيود. لم يكتب أحد كوداً أسرع. كل ما حدث أنهم توقفوا عن إخفاء معنى الطلب عن الأجهزة التي كان بإمكانها المساعدة."
        }
      ]
    },
    {
      key: "internals",
      blocks: [
        {
          t: "p",
          en: "Let us trace one real request — GET /orders/1042 — from a browser to your ASP.NET Core app, and name each constraint at the exact moment it does something. The path has four hops: browser, CDN, load balancer, one of three app servers.",
          ar: "لنتتبّع طلباً حقيقياً واحداً — GET /orders/1042 — من الـ browser إلى تطبيق ASP.NET Core، ونسمّي كل constraint في اللحظة التي يفعل فيها شيئاً. المسار فيه أربع محطات: browser، ثم CDN، ثم load balancer، ثم واحد من ثلاثة app servers."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "1. Client–server", ar: "1. Client–server" },
              v: {
                en: "The browser owns the screen and the user; the server owns the data. Neither knows the other's internals. You can rewrite the UI in a different framework without touching the API.",
                ar: "الـ browser يملك الشاشة والمستخدم؛ والـ server يملك البيانات. لا أحد منهما يعرف داخل الآخر. تستطيع إعادة كتابة الواجهة بإطار مختلف دون لمس الـ API."
              }
            },
            {
              k: { en: "2. Stateless", ar: "2. Stateless" },
              v: {
                en: "The request carries everything needed to answer it — the URL, an Authorization header, an Accept header. The server keeps no memory of this client between requests.",
                ar: "الطلب يحمل كل ما يلزم للإجابة عليه — الـ URL وheader الـ Authorization وheader الـ Accept. الـ server لا يحتفظ بأي ذاكرة عن هذا الـ client بين طلب وآخر."
              }
            },
            {
              k: { en: "3. Cacheable", ar: "3. Cacheable" },
              v: {
                en: "The response says out loud whether it can be stored and for how long, using the Cache-Control header. Storing a response is only legal because the response gave permission.",
                ar: "الـ response يعلن بوضوح إن كان يمكن تخزينه وإلى متى، عبر header اسمه Cache-Control. تخزين الـ response مسموح فقط لأن الـ response نفسه أعطى الإذن."
              }
            },
            {
              k: { en: "4. Uniform interface", ar: "4. Uniform interface" },
              v: {
                en: "GET means read and change nothing. Every box on the path knows that without reading your code, which is why any of them may retry or cache it.",
                ar: "الـ GET يعني اقرأ ولا تغيّر شيئاً. كل صندوق على المسار يعرف ذلك دون قراءة الكود عندك، ولهذا يجوز لأي منهم إعادة المحاولة أو التخزين."
              }
            },
            {
              k: { en: "5. Layered system", ar: "5. Layered system" },
              v: {
                en: "The browser talks to the CDN believing it is the server. Your app talks to the load balancer believing it is the client. Layers can be inserted or removed silently.",
                ar: "الـ browser يتحدث إلى الـ CDN وهو يظنه الـ server. وتطبيقك يتحدث إلى الـ load balancer وهو يظنه الـ client. يمكن إدخال طبقات أو إزالتها بصمت."
              }
            },
            {
              k: { en: "6. Code-on-demand (optional)", ar: "6. Code-on-demand (اختياري)" },
              v: {
                en: "The server may send runnable code the client executes — in practice, the JavaScript a browser downloads. APIs almost never use this, and that is fine.",
                ar: "يجوز للـ server أن يرسل كوداً قابلاً للتنفيذ يشغّله الـ client — عملياً، الـ JavaScript الذي ينزّله الـ browser. الـ APIs لا تستخدم هذا تقريباً أبداً، وهذا مقبول."
              }
            }
          ]
        },
        {
          t: "p",
          en: "Step by step. The browser sends the request. The CDN receives it, sees the method is GET and the URL is /orders/1042, and looks in its store for a saved copy of exactly that URL. There is one, saved 20 seconds ago, and its stored Cache-Control said max-age=60, meaning it stays usable for 60 seconds. So the CDN answers immediately. Your servers never learn the request happened.",
          ar: "خطوة بخطوة. الـ browser يرسل الطلب. الـ CDN يستقبله، ويرى أن الـ method هي GET وأن الـ URL هو /orders/1042، فيبحث في مخزنه عن نسخة محفوظة لهذا الـ URL بالضبط. توجد نسخة محفوظة قبل 20 ثانية، وكان الـ Cache-Control المخزّن معها يقول max-age=60، أي أنها صالحة للاستخدام 60 ثانية. فيجيب الـ CDN فوراً. وservers لديك لا تعلم أصلاً أن الطلب حدث."
        },
        {
          t: "p",
          en: "Sixty-one seconds later the copy is stale, so the CDN forwards the request to the load balancer. The load balancer picks app server number 2 — it may pick a different one every time, and it is allowed to, precisely because the server holds no per-client memory. That is the stateless constraint paying off: adding a fourth server needs no coordination, and killing one mid-deploy costs nothing but the requests in flight.",
          ar: "بعد 61 ثانية تصبح النسخة قديمة، فيمرّر الـ CDN الطلب إلى الـ load balancer. يختار الـ load balancer الـ app server رقم 2 — وقد يختار غيره في كل مرة، ويجوز له ذلك تحديداً لأن الـ server لا يحتفظ بأي ذاكرة خاصة بالـ client. هذه هي فائدة قيد الـ stateless: إضافة server رابع لا تحتاج أي تنسيق، وإسقاط واحد أثناء الـ deploy لا يكلّف سوى الطلبات الجارية."
        },
        {
          t: "code",
          lang: "csharp",
          label: { en: "One resource, uniform interface, explicit cache rules", ar: "resource واحد، وuniform interface، وقواعد cache صريحة" },
          code: "[ApiController]\n[Route(\"orders\")]\npublic sealed class OrdersController : ControllerBase\n{\n    private readonly IOrderQueries _queries;\n    public OrdersController(IOrderQueries queries) => _queries = queries;\n\n    // The URL names the resource. The method says what we do to it.\n    [HttpGet(\"{id:long}\")]\n    public async Task<IActionResult> Get(long id, CancellationToken ct)\n    {\n        var order = await _queries.FindAsync(id, ct);\n        if (order is null) return NotFound();\n\n        // ETag = a short string identifying this exact version of the body.\n        var etag = $\"\\\"{order.RowVersion}\\\"\";\n\n        // If the client already has this version, send 304 with no body at all.\n        if (Request.Headers.IfNoneMatch == etag)\n            return StatusCode(StatusCodes.Status304NotModified);\n\n        Response.Headers.ETag = etag;\n        // Any cache may store this for 60 seconds; it is per-user, so \"private\".\n        Response.Headers.CacheControl = \"private, max-age=60\";\n        return Ok(order);\n    }\n}"
        },
        {
          t: "p",
          en: "Two mechanisms in that code are worth naming. An ETag is a version label for the body; the client sends it back in an If-None-Match header, and if it still matches, the server replies 304 Not Modified with an empty body, which saves the bandwidth but not the database read. Cache-Control is the permission slip: private means only the end user's own browser may store it, public would let the shared CDN store it too, and no-store forbids everyone.",
          ar: "هناك آليتان في هذا الكود تستحقان التسمية. الـ ETag هو ملصق نسخة للـ body؛ يرسله الـ client مرة أخرى في header اسمه If-None-Match، وإن كان ما يزال مطابقاً يرد الـ server بـ 304 Not Modified مع body فارغ، وهذا يوفّر الـ bandwidth لكنه لا يوفّر قراءة الـ database. أما الـ Cache-Control فهو تصريح الإذن: private تعني أن browser المستخدم وحده يخزّنها، وpublic تسمح للـ CDN المشترك بتخزينها أيضاً، وno-store تمنع الجميع."
        },
        {
          t: "p",
          en: "Now the analogy for the layered part. It is a hotel switchboard. You dial reception and ask for room 402; you never learn whether reception put you through directly, routed you to a second building, or took a message. You only ever spoke to one number. Each layer here works the same way: it may answer, forward, or transform, and the caller cannot tell which — which is exactly what makes it safe to add a rate limiter or a cache tomorrow without telling any client.",
          ar: "والآن التشبيه الخاص بالطبقات. تخيّل سنترال فندق. تتصل بالاستقبال وتطلب الغرفة 402؛ لن تعرف أبداً هل وصلك الاستقبال مباشرة، أم حوّلك إلى مبنى ثانٍ، أم سجّل رسالة. أنت تحدثت مع رقم واحد فقط. كل طبقة هنا تعمل بنفس المنطق: قد تجيب أو تمرّر أو تعدّل، ولا يستطيع المتصل التمييز — وهذا بالضبط ما يجعل إضافة rate limiter أو cache غداً آمنة دون إخبار أي client."
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
              "Caches, proxies and CDNs can help you without knowing your code.",
              "Any server can answer any request, so scaling out is just adding machines.",
              "Clients written years apart still work against the same URLs and methods.",
              "Failures are easier to reason about: a GET can always be retried."
            ],
            ar: [
              "الـ caches والـ proxies والـ CDNs تستطيع مساعدتك دون معرفة الكود عندك.",
              "أي server يستطيع الإجابة على أي طلب، فالتوسّع الأفقي مجرد إضافة أجهزة.",
              "clients كُتبت بفارق سنوات تظل تعمل مع نفس الـ URLs والـ methods.",
              "الأعطال أسهل في التحليل: الـ GET يمكن دائماً إعادة محاولته."
            ]
          },
          cons: {
            en: [
              "Every request must resend its context, so requests are bigger.",
              "Some operations do not map cleanly to a noun and a verb.",
              "Fetching one screen may take several round trips instead of one call.",
              "Cache correctness becomes your problem: wrong headers serve stale data."
            ],
            ar: [
              "كل طلب يجب أن يعيد إرسال سياقه، فتصبح الطلبات أكبر حجماً.",
              "بعض العمليات لا تُترجم بسهولة إلى اسم وفعل.",
              "جلب شاشة واحدة قد يحتاج عدة رحلات بدل استدعاء واحد.",
              "صحة الـ cache تصبح مسؤوليتك: headers خاطئة تقدّم بيانات قديمة."
            ]
          },
          limits: {
            en: [
              "REST says nothing about how your database or domain model is built.",
              "It does not give you push: the server cannot start a message.",
              "It does not define your error body format; that is a separate decision.",
              "It says nothing about who is allowed to do what."
            ],
            ar: [
              "الـ REST لا يقول شيئاً عن كيفية بناء الـ database أو الـ domain model.",
              "لا يعطيك push: الـ server لا يستطيع بدء رسالة.",
              "لا يحدّد شكل body الأخطاء؛ هذا قرار منفصل.",
              "لا يقول شيئاً عمّن يُسمح له بفعل ماذا."
            ]
          },
          alts: {
            en: [
              "gRPC — binary and fast between your own services, but not cacheable by HTTP proxies.",
              "GraphQL — one flexible query for the whole screen, at the cost of URL-level caching.",
              "Message queues — for work that should happen later, not answered now.",
              "WebSockets or SSE — when the server needs to push updates to the client."
            ],
            ar: [
              "gRPC — ثنائي وسريع بين خدماتك الداخلية، لكن لا تستطيع الـ HTTP proxies تخزينه.",
              "GraphQL — query مرن واحد للشاشة كلها، مقابل خسارة الـ caching على مستوى الـ URL.",
              "Message queues — للعمل الذي يجب أن يحدث لاحقاً لا أن يُجاب عليه الآن.",
              "WebSockets أو SSE — عندما يحتاج الـ server إلى دفع تحديثات إلى الـ client."
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
          title: { en: "Verbs in the URL, everything over POST", ar: "أفعال داخل الـ URL، وكل شيء عبر POST" },
          body: {
            en: "A team shipped POST /api/orders/getById, POST /api/orders/getList and POST /api/orders/cancel. Reads and writes now look identical to every machine on the path, so nothing can be cached and no proxy can safely retry anything. Their CDN bill stayed the same while traffic tripled, because the CDN was forwarding 100% of requests. The fix is one noun and the right method: GET /orders/1042 to read, POST /orders/1042/cancellation to cancel.",
            ar: "أطلق فريق endpoints بالشكل POST /api/orders/getById وPOST /api/orders/getList وPOST /api/orders/cancel. أصبحت القراءات والكتابات متطابقة تماماً بنظر كل جهاز على المسار، فلا شيء يمكن تخزينه ولا يستطيع أي proxy إعادة محاولة أي شيء بأمان. بقيت فاتورة الـ CDN كما هي بينما تضاعف الـ traffic ثلاث مرات، لأن الـ CDN كان يمرّر 100% من الطلبات. الحل اسم واحد مع الـ method الصحيحة: GET /orders/1042 للقراءة، وPOST /orders/1042/cancellation للإلغاء."
          },
          fix: "// before\nPOST /api/orders/getById   { \"id\": 1042 }\n// after\nGET  /orders/1042"
        },
        {
          t: "mistake",
          title: { en: "Keeping the cart in server memory", ar: "الاحتفاظ بالسلة في ذاكرة الـ server" },
          body: {
            en: "A checkout API stored the shopping cart in a static dictionary in process memory, keyed by user id. It worked on one machine. On three machines behind a load balancer, roughly two out of three requests landed on a server that had never seen that cart, so items vanished. The team patched it with sticky sessions — pinning each user to one server — and then every deploy dropped every in-progress cart. Move the cart into Redis or into the request itself.",
            ar: "خزّن API للدفع سلة التسوق في dictionary ثابت داخل ذاكرة العملية، مفتاحه هو user id. عمل الأمر على جهاز واحد. وعلى ثلاثة أجهزة خلف load balancer، كان نحو طلبين من كل ثلاثة يصلان إلى server لم يرَ تلك السلة أبداً، فتختفي العناصر. رقّع الفريق المشكلة بـ sticky sessions — تثبيت كل مستخدم على server واحد — وعندها صار كل deploy يسقط كل سلة قيد الاستخدام. انقل السلة إلى Redis أو إلى الطلب نفسه."
          }
        },
        {
          t: "mistake",
          title: { en: "Errors returned as 200 OK", ar: "إرجاع الأخطاء بحالة 200 OK" },
          body: {
            en: "An endpoint returned HTTP 200 with a body of { \"success\": false, \"error\": \"NOT_FOUND\" }. Every intermediary read the 200 and cached a not-found answer for the full max-age. Users kept seeing an order that did not exist even after it was created, until the cache expired. The status line is part of the uniform interface — machines act on it. Return 404 and no cache will store it as a success.",
            ar: "أرجع endpoint حالة HTTP 200 مع body فيه { \"success\": false, \"error\": \"NOT_FOUND\" }. كل intermediary قرأ الـ 200 وخزّن إجابة \"غير موجود\" طوال مدة الـ max-age. استمر المستخدمون في رؤية طلب غير موجود حتى بعد إنشائه، إلى أن انتهت صلاحية الـ cache. سطر الحالة جزء من الـ uniform interface — الأجهزة تتصرف بناءً عليه. أرجع 404 ولن يخزّنه أي cache على أنه نجاح."
          },
          fix: "// before\nreturn Ok(new { success = false, error = \"NOT_FOUND\" });\n// after\nreturn NotFound();"
        },
        {
          t: "mistake",
          title: { en: "GET that changes data", ar: "GET يغيّر البيانات" },
          body: {
            en: "Someone wrote GET /orders/1042/markAsPaid because it was easy to call from a browser address bar. A link checker crawled the admin panel and marked 300 orders as paid overnight. GET promises to change nothing, and the whole path — browsers, prefetchers, crawlers, retrying proxies — takes that promise literally. Anything that changes state must be POST, PUT, PATCH or DELETE.",
            ar: "كتب أحدهم GET /orders/1042/markAsPaid لأنه كان سهل الاستدعاء من شريط عنوان الـ browser. زحف link checker على لوحة الإدارة فوضع 300 طلب كمدفوعة في ليلة واحدة. الـ GET يَعِد بألا يغيّر شيئاً، والمسار كله — browsers وprefetchers وcrawlers وproxies تعيد المحاولة — يأخذ هذا الوعد حرفياً. أي شيء يغيّر الحالة يجب أن يكون POST أو PUT أو PATCH أو DELETE."
          }
        }
      ]
    },
    {
      key: "interview",
      blocks: [
        {
          t: "qa",
          level: "junior",
          q: { en: "Name the six REST constraints.", ar: "اذكر قيود الـ REST الستة." },
          a: {
            en: "Client–server, stateless, cacheable, uniform interface, layered system, and code-on-demand — and that last one is optional. The short version of why they matter: the first two let you add servers freely, the next two let machines in the middle help you, and the fifth lets you insert those machines without anyone noticing.",
            ar: "Client–server، وstateless، وcacheable، وuniform interface، وlayered system، وcode-on-demand — والأخير اختياري. والسبب المختصر لأهميتها: القيدان الأولان يتيحان إضافة servers بحرية، والتاليان يتيحان للأجهزة في المنتصف مساعدتك، والخامس يتيح إدخال تلك الأجهزة دون أن يلاحظ أحد."
          }
        },
        {
          t: "qa",
          level: "mid",
          q: { en: "Is an API with a login session cookie still stateless?", ar: "هل يبقى الـ API الذي يستخدم session cookie للدخول stateless؟" },
          a: {
            en: "It depends on what the cookie holds. If the cookie carries a signed token that fully describes the user, then yes — the request is self-contained and any server can handle it. If the cookie is just an id pointing at data held in one server's memory, then no, because only that one server can answer. Moving that data to a shared store like Redis makes it stateless again from the server's point of view.",
            ar: "يعتمد على ما يحمله الـ cookie. لو كان يحمل token موقّعاً يصف المستخدم بالكامل، فنعم — الطلب مكتفٍ بذاته وأي server يستطيع معالجته. أما لو كان الـ cookie مجرد id يشير إلى بيانات موجودة في ذاكرة server واحد، فلا، لأن ذلك الـ server وحده يستطيع الإجابة. نقل تلك البيانات إلى مخزن مشترك مثل Redis يعيد النظام إلى الـ stateless من وجهة نظر الـ server."
          }
        },
        {
          t: "qa",
          level: "mid",
          q: { en: "Why does the uniform interface constraint matter in practice?", ar: "لماذا يهمّ قيد الـ uniform interface عملياً؟" },
          a: {
            en: "Because it lets things you did not write make correct decisions about your traffic. A CDN caches your GETs, a proxy retries an idempotent request after a network blip, a gateway rate-limits writes but not reads — all without one line of your business logic. The moment you tunnel everything through POST, every one of those boxes goes blind and you have to build those features yourself.",
            ar: "لأنه يتيح لأشياء لم تكتبها أن تتخذ قرارات صحيحة بشأن الـ traffic عندك. الـ CDN يخزّن الـ GETs، والـ proxy يعيد محاولة طلب idempotent بعد انقطاع شبكة، والـ gateway يحدّ من معدّل الكتابات دون القراءات — كل ذلك دون سطر واحد من منطق العمل عندك. وفي اللحظة التي تمرّر فيها كل شيء عبر POST، تعمى كل تلك الصناديق وتضطر لبناء هذه الميزات بنفسك."
          }
        },
        {
          t: "qa",
          level: "senior",
          q: { en: "When would you deliberately not build a REST API?", ar: "متى تقرر عن قصد ألا تبني REST API؟" },
          a: {
            en: "For chatty internal service-to-service calls I would reach for gRPC: it is binary, it is faster, and there is no CDN in that path anyway so I lose nothing by giving up HTTP caching. For a mobile screen that needs seven related objects at once, GraphQL saves round trips. And for work that should happen later rather than being answered now — sending an invoice email — a message queue is the right shape. REST earns its keep at the public edge, where you do not control the clients.",
            ar: "للاستدعاءات الداخلية الكثيرة بين الخدمات أختار gRPC: ثنائي وأسرع، ولا يوجد CDN في ذلك المسار أصلاً فلا أخسر شيئاً بالتخلي عن HTTP caching. ولشاشة موبايل تحتاج سبعة كائنات مترابطة دفعة واحدة، يوفّر GraphQL رحلات ذهاب وإياب. وللعمل الذي يجب أن يحدث لاحقاً بدل الإجابة عليه الآن — إرسال بريد فاتورة — فالـ message queue هو الشكل الصحيح. الـ REST يثبت جدواه عند الحافة العامة، حيث لا تتحكم في الـ clients."
          }
        },
        {
          t: "qa",
          level: "senior",
          q: { en: "How do you model an action that is not a noun, like 'cancel this order'?", ar: "كيف تنمذج عملية ليست اسماً، مثل «ألغِ هذا الطلب»؟" },
          a: {
            en: "I turn the action into a thing that has its own life. A cancellation is a real object in the business — it has a time, a reason, a person who did it. So I POST /orders/1042/cancellations. That gives me a URL I can also GET later to see what happened, and it keeps the write on a method that is not cached and not retried blindly. The alternative, PATCH /orders/1042 with a status field, is acceptable but says less about intent and is harder to audit.",
            ar: "أحوّل العملية إلى شيء له وجود مستقل. الإلغاء كائن حقيقي في العمل — له وقت وسبب وشخص قام به. لذلك أستخدم POST /orders/1042/cancellations. هذا يعطيني URL أستطيع لاحقاً عمل GET عليه لأرى ما حدث، ويبقي الكتابة على method لا تُخزَّن في cache ولا يُعاد تنفيذها عمياً. البديل، PATCH /orders/1042 مع حقل status، مقبول لكنه يقول أقل عن النية وأصعب في التدقيق."
          }
        },
        {
          t: "qa",
          level: "staff",
          q: { en: "Your org has 40 services and no two agree on URL or error shape. How do you fix that?", ar: "لدى مؤسستك 40 خدمة ولا تتفق اثنتان على شكل الـ URL أو شكل الخطأ. كيف تعالج ذلك؟" },
          a: {
            en: "Not with a style document nobody reads. I would write the rules down once — resource naming, status code meanings, the error body shape, pagination — and then make them the default in a shared project template, so a new service is compliant on the day it is created. Next, a check in CI that validates each service's OpenAPI file against those rules, failing the build on a violation. Existing services get migrated when they are next touched, never in a big-bang project. The written standard is only there to explain the automated check; the check is what actually changes behaviour.",
            ar: "ليس عبر مستند أسلوب لا يقرأه أحد. سأكتب القواعد مرة واحدة — تسمية الـ resources، ومعاني الـ status codes، وشكل body الخطأ، والـ pagination — ثم أجعلها الوضع الافتراضي في template مشترك للمشاريع، ليكون أي service جديد ملتزماً منذ يوم إنشائه. بعدها فحص في الـ CI يتحقق من ملف OpenAPI لكل service مقابل تلك القواعد ويُفشل الـ build عند المخالفة. والخدمات القائمة تُهاجر عند أول تعديل عليها، لا في مشروع كبير دفعة واحدة. المعيار المكتوب موجود فقط لشرح الفحص الآلي؛ والفحص هو ما يغيّر السلوك فعلاً."
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
          title: { en: "A read modelled as a POST", ar: "قراءة مصمّمة على شكل POST" },
          bad: "[HttpPost(\"search\")]\npublic async Task<IActionResult> Search([FromBody] SearchRequest req)\n{\n    var results = await _queries.SearchAsync(req.Term, req.Page);\n    return Ok(results);\n}",
          good: "[HttpGet]\npublic async Task<IActionResult> Search(\n    [FromQuery] string term,\n    [FromQuery] int page = 1,\n    CancellationToken ct = default)\n{\n    var results = await _queries.SearchAsync(term, page, ct);\n    Response.Headers.CacheControl = \"public, max-age=30\";\n    return Ok(results);\n}",
          why: {
            en: "The POST version is a read pretending to be a write. No cache will store it, no proxy will retry it after a dropped connection, and the query is invisible in access logs because it hides in the body. As a GET the same search becomes a URL you can cache, share, bookmark and grep for in logs. The only real reason to POST a search is a filter object too large for a URL, which is roughly 2,000 characters.",
            ar: "نسخة الـ POST قراءة تتظاهر بأنها كتابة. لن يخزّنها أي cache، ولن يعيد أي proxy محاولتها بعد انقطاع اتصال، والـ query غير مرئي في access logs لأنه مختبئ في الـ body. وكـ GET يصبح نفس البحث URL يمكن تخزينه ومشاركته وحفظه والبحث عنه في الـ logs. السبب الحقيقي الوحيد لاستخدام POST في البحث هو كائن فلترة أكبر من أن يتسع في URL، أي نحو 2000 حرف."
          }
        },
        {
          t: "review",
          severity: "medium",
          title: { en: "A public GET with no cache instructions", ar: "GET عام دون تعليمات cache" },
          bad: "[HttpGet(\"/catalog/categories\")]\npublic async Task<IActionResult> Categories()\n    => Ok(await _queries.CategoriesAsync());",
          good: "[HttpGet(\"/catalog/categories\")]\npublic async Task<IActionResult> Categories(CancellationToken ct)\n{\n    // Same for every user, changes maybe twice a month.\n    Response.Headers.CacheControl = \"public, max-age=300\";\n    return Ok(await _queries.CategoriesAsync(ct));\n}",
          why: {
            en: "When a response says nothing about caching, each intermediary applies its own default, and those defaults disagree — some store it for a while, some not at all, and you cannot predict which. A category list is the same for everyone and changes rarely, so five minutes of shared caching removes almost all of that traffic from your database. Say it explicitly and the behaviour becomes something you chose rather than something you inherited.",
            ar: "عندما لا يقول الـ response شيئاً عن الـ caching، يطبّق كل intermediary الوضع الافتراضي الخاص به، وهذه الأوضاع مختلفة — بعضها يخزّن لفترة وبعضها لا يخزّن إطلاقاً، ولا يمكنك التنبؤ بأيها. قائمة التصنيفات واحدة للجميع وتتغير نادراً، فخمس دقائق من الـ caching المشترك تزيل تقريباً كل هذا الـ traffic عن الـ database. صرّح بذلك ويصبح السلوك شيئاً اخترته لا شيئاً ورثته."
          }
        }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        {
          t: "p",
          en: "In a normal production system the constraints show up as the layers you can draw on a whiteboard. A request to the order API crosses a CDN, then an API gateway that checks the token and applies rate limits, then a load balancer, then one of N identical app instances, then a read replica of the database. Each layer was added at a different time, and none of them required a client change — that is the layered-system constraint being useful rather than theoretical.",
          ar: "في نظام إنتاج عادي تظهر القيود على شكل الطبقات التي ترسمها على السبورة. طلب إلى API الطلبات يعبر CDN، ثم API gateway يتحقق من الـ token ويطبّق حدود المعدّل، ثم load balancer، ثم واحدة من N نسخ متطابقة من التطبيق، ثم read replica من الـ database. كل طبقة أُضيفت في وقت مختلف، ولم تتطلب أي منها تغييراً في الـ client — وهذه هي فائدة قيد الـ layered system عملياً لا نظرياً."
        },
        {
          t: "ul",
          en: [
            "Autoscaling: instances are created and destroyed on demand, which only works because no instance holds anything unique.",
            "Blue-green deploys: send traffic to a new set of servers, keep the old ones warm, roll back by flipping a switch — safe only if servers are interchangeable.",
            "Edge caching: putting GET /catalog/categories on a CDN turns a database read into a lookup in a machine near the user.",
            "Read replicas: GET requests can be routed to a replica because GET promises not to write, so the router can make that decision by method alone."
          ],
          ar: [
            "الـ autoscaling: تُنشأ النسخ وتُدمَّر حسب الطلب، وهذا يعمل فقط لأن لا نسخة تحتفظ بشيء فريد.",
            "الـ blue-green deploys: توجّه الـ traffic إلى مجموعة servers جديدة وتبقي القديمة جاهزة وتتراجع بقلب مفتاح — آمن فقط إذا كانت الـ servers قابلة للتبادل.",
            "الـ edge caching: وضع GET /catalog/categories على CDN يحوّل قراءة من الـ database إلى بحث في جهاز قريب من المستخدم.",
            "الـ read replicas: يمكن توجيه طلبات الـ GET إلى replica لأن الـ GET يَعِد بألا يكتب، فيتخذ الموجّه القرار بناءً على الـ method وحدها."
          ]
        },
        {
          t: "callout",
          kind: "warn",
          en: "Layers only stay invisible if every layer forwards the headers that matter. A gateway that strips Cache-Control or ETag silently turns your cacheable API into an uncacheable one, and nothing in your code will show it.",
          ar: "تبقى الطبقات غير مرئية فقط إذا مرّرت كل طبقة الـ headers المهمة. أي gateway يحذف Cache-Control أو ETag يحوّل بصمت الـ API القابل للـ caching إلى غير قابل له، ولن يظهر ذلك في أي مكان من الكود عندك."
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
              v: {
                en: "Statelessness makes every request carry its own context — a token adds roughly 0.5-2 KB per request. Real, but small next to what caching removes.",
                ar: "الـ statelessness تجعل كل طلب يحمل سياقه — الـ token يضيف نحو 0.5 إلى 2 كيلوبايت لكل طلب. حقيقي، لكنه صغير مقارنة بما يزيله الـ caching."
              }
            },
            {
              k: { en: "Latency", ar: "Latency" },
              v: {
                en: "A CDN hit answers from a machine near the user, typically 20-50 ms instead of 200-400 ms for a full round trip to your origin.",
                ar: "إصابة الـ CDN تُجاب من جهاز قريب من المستخدم، عادة 20-50 ms بدل 200-400 ms لرحلة كاملة إلى الأصل."
              }
            },
            {
              k: { en: "Database", ar: "Database" },
              v: {
                en: "Cacheable GETs are the cheapest load reduction available: in the example above, 78% of reads stopped reaching the database with no code rewrite.",
                ar: "الـ GETs القابلة للـ caching أرخص وسيلة لتقليل الحمل: في المثال أعلاه توقفت 78% من القراءات عن الوصول إلى الـ database دون إعادة كتابة الكود."
              }
            },
            {
              k: { en: "Scalability", ar: "Scalability" },
              v: {
                en: "Interchangeable servers mean capacity is a linear knob — double the instances, roughly double the throughput, with no coordination between them.",
                ar: "الـ servers القابلة للتبادل تجعل السعة مقبضاً خطياً — ضاعف عدد النسخ يتضاعف تقريباً الـ throughput، دون أي تنسيق بينها."
              }
            },
            {
              k: { en: "CPU", ar: "CPU" },
              v: {
                en: "Cost moves to per-request work: parsing and validating a token on every call instead of reading a session from memory once.",
                ar: "تنتقل التكلفة إلى عمل لكل طلب: تحليل الـ token والتحقق منه في كل استدعاء بدل قراءة session من الذاكرة مرة واحدة."
              }
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
            "curl -i https://api.example.com/orders/1042 — the -i flag prints response headers; look for Cache-Control and ETag actually being present.",
            "curl -H 'If-None-Match: \"v7\"' -i <url> — you should get 304 Not Modified with an empty body; a 200 means your ETag check is not running.",
            "Browser DevTools, Network tab, Size column — it says 'disk cache' or 'memory cache' when the response never left the machine.",
            "CDN analytics, cache hit ratio — under 50% on a read-heavy endpoint usually means a missing or too-short max-age, or a Vary header splitting the cache.",
            "Load-balancer access logs, grouped by upstream server — if one server gets far more requests than the others, something is pinning sessions."
          ],
          ar: [
            "curl -i https://api.example.com/orders/1042 — الخيار -i يطبع headers الـ response؛ ابحث عن وجود Cache-Control وETag فعلياً.",
            "curl -H 'If-None-Match: \"v7\"' -i <url> — يجب أن تحصل على 304 Not Modified مع body فارغ؛ ورود 200 يعني أن فحص الـ ETag لا يعمل.",
            "أدوات المطور في الـ browser، تبويب Network، عمود Size — يكتب 'disk cache' أو 'memory cache' عندما لا يغادر الـ response الجهاز.",
            "تحليلات الـ CDN، نسبة cache hit — أقل من 50% على endpoint كثير القراءة تعني عادة max-age مفقوداً أو قصيراً جداً، أو header اسمه Vary يقسّم الـ cache.",
            "سجلات وصول الـ load balancer مجمّعة حسب الـ upstream server — إذا استقبل server واحد طلبات أكثر بكثير من غيره، فهناك شيء يثبّت الجلسات."
          ]
        },
        {
          t: "callout",
          kind: "tip",
          en: "The fastest statelessness test: run two instances locally, send the same authenticated request to each, and compare responses. If one succeeds and the other fails or returns different data, something is being held in one process's memory.",
          ar: "أسرع اختبار للـ statelessness: شغّل نسختين محلياً، وأرسل نفس الطلب الموثّق إلى كل منهما، وقارن الردود. إذا نجحت واحدة وفشلت الأخرى أو أعادت بيانات مختلفة، فهناك شيء محفوظ في ذاكرة عملية واحدة."
        }
      ]
    },
    {
      key: "realworld",
      blocks: [
        {
          t: "p",
          en: "The constraints pay off differently depending on who your clients are. When you control every client — an internal service mesh — you can break the rules cheaply, because you can redeploy both sides together. When you do not control them, the rules are what keeps an app installed on a phone two years ago from breaking today.",
          ar: "تختلف فائدة القيود حسب هوية الـ clients عندك. عندما تتحكم في كل client — مثل service mesh داخلي — يمكنك كسر القواعد بتكلفة قليلة، لأنك تستطيع إعادة نشر الطرفين معاً. أما عندما لا تتحكم فيهم، فالقواعد هي ما يمنع تطبيقاً مثبتاً على هاتف منذ سنتين من التعطل اليوم."
        },
        {
          t: "ul",
          en: [
            "Public platform APIs: thousands of unknown integrators, so stable URLs and standard status codes are the product, not a detail.",
            "Content and media sites: almost all traffic is cacheable GETs, and correct cache headers are the difference between one origin server and forty.",
            "Payment systems: writes must never be retried blindly, so the safe/unsafe method split is a correctness rule, not a style preference.",
            "Internal microservice meshes: no CDN in the path and both sides deployed together, so many teams pick gRPC here and keep REST for the public edge."
          ],
          ar: [
            "الـ APIs العامة للمنصات: آلاف المتكاملين المجهولين، فالـ URLs الثابتة وstatus codes القياسية هي المنتج نفسه لا تفصيلاً فيه.",
            "مواقع المحتوى والوسائط: شبه كل الـ traffic عبارة عن GETs قابلة للـ caching، وheaders الـ cache الصحيحة هي الفرق بين origin server واحد وأربعين.",
            "أنظمة الدفع: يجب ألا تُعاد الكتابات عمياً، فالتفريق بين الـ methods الآمنة وغير الآمنة قاعدة صحة لا تفضيل أسلوب.",
            "شبكات الـ microservices الداخلية: لا CDN في المسار والطرفان يُنشران معاً، لذلك تختار فرق كثيرة gRPC هنا وتُبقي الـ REST للحافة العامة."
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
          en: "Take three RPC-style endpoints from any codebase you have — names like getUser, updateUserEmail, deleteCart — and rewrite each as a resource URL plus a method. You are done when every URL contains only nouns and the method alone tells you whether it writes.",
          ar: "خذ ثلاثة endpoints بأسلوب RPC من أي كود لديك — بأسماء مثل getUser وupdateUserEmail وdeleteCart — وأعد كتابة كل واحد على شكل resource URL مع method. تنتهي عندما يحتوي كل URL على أسماء فقط، وتكون الـ method وحدها كافية لمعرفة إن كان يكتب."
        },
        {
          t: "ex",
          diff: "medium",
          en: "Add ETag and Cache-Control to one GET endpoint. Prove it works by calling it twice with curl -i, copying the ETag from the first response into an If-None-Match header on the second, and getting back 304 with an empty body.",
          ar: "أضف ETag وCache-Control إلى endpoint واحد من نوع GET. أثبت أنه يعمل باستدعائه مرتين عبر curl -i، بنسخ الـ ETag من الرد الأول إلى header اسمه If-None-Match في الثاني، والحصول على 304 مع body فارغ."
        },
        {
          t: "ex",
          diff: "hard",
          en: "Run two instances of your API on different ports behind a tiny round-robin proxy. Log in once, then send ten authenticated requests through the proxy. You pass when all ten succeed and return identical data, whichever instance handled them.",
          ar: "شغّل نسختين من الـ API على منفذين مختلفين خلف proxy صغير يوزّع بالتناوب. سجّل الدخول مرة واحدة، ثم أرسل عشرة طلبات موثّقة عبر الـ proxy. تنجح عندما تنجح الطلبات العشرة كلها وتعيد بيانات متطابقة، أياً كانت النسخة التي عالجتها."
        },
        {
          t: "ex",
          diff: "senior",
          en: "Write a one-page standard for your team covering resource naming, which status codes you use and what each means, the error body shape, and pagination. Then add a CI step that reads each service's OpenAPI file and fails the build on a violation. It is finished when a deliberately non-compliant pull request goes red without a human commenting on it.",
          ar: "اكتب معياراً من صفحة واحدة لفريقك يغطي تسمية الـ resources، وأي status codes تستخدمون وماذا يعني كل منها، وشكل body الخطأ، والـ pagination. ثم أضف خطوة في الـ CI تقرأ ملف OpenAPI لكل service وتُفشل الـ build عند المخالفة. ينتهي العمل عندما يتحوّل pull request مخالف عمداً إلى أحمر دون أن يعلّق عليه إنسان."
        }
      ]
    },
    {
      key: "refs",
      blocks: [
        {
          t: "ref",
          label: { en: "Fielding — Architectural Styles, chapter 5 (the original REST chapter)", ar: "Fielding — Architectural Styles، الفصل الخامس (فصل الـ REST الأصلي)" },
          url: "https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm",
          meta: { en: "Paper", ar: "بحث" }
        },
        {
          t: "ref",
          label: { en: "RFC 9110 — HTTP Semantics: methods, status codes, headers", ar: "RFC 9110 — دلالات الـ HTTP: الـ methods وstatus codes وheaders" },
          url: "https://www.rfc-editor.org/rfc/rfc9110.html",
          meta: { en: "Spec", ar: "مواصفة" }
        },
        {
          t: "ref",
          label: { en: "MDN — HTTP caching", ar: "MDN — الـ HTTP caching" },
          url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching",
          meta: { en: "Docs", ar: "توثيق" }
        },
        {
          t: "ref",
          label: { en: "Microsoft — Web API design best practices", ar: "Microsoft — أفضل ممارسات تصميم Web API" },
          url: "https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design",
          meta: { en: "Guide", ar: "دليل" }
        }
      ]
    }
  ],
  quiz: [
    {
      q: {
        en: "Which REST constraint is explicitly optional?",
        ar: "أي قيد من قيود الـ REST اختياري صراحةً؟"
      },
      options: [
        { en: "Cacheable", ar: "Cacheable" },
        { en: "Layered system", ar: "Layered system" },
        { en: "Code-on-demand", ar: "Code-on-demand" },
        { en: "Stateless", ar: "Stateless" }
      ],
      correct: 2,
      why: {
        en: "Fielding marks code-on-demand — the server sending runnable code to the client — as optional. The other five are required for an API to be called REST.",
        ar: "يصنّف Fielding الـ code-on-demand — إرسال الـ server كوداً قابلاً للتنفيذ إلى الـ client — كقيد اختياري. أما الخمسة الأخرى فإلزامية حتى يُسمّى الـ API بـ REST."
      }
    },
    {
      q: {
        en: "An API stores the shopping cart in a static dictionary in process memory. What breaks first when you add a second server?",
        ar: "API يخزّن سلة التسوق في dictionary ثابت داخل ذاكرة العملية. ما الذي ينكسر أولاً عند إضافة server ثانٍ؟"
      },
      options: [
        { en: "Requests routed to the other server see an empty cart", ar: "الطلبات الموجّهة إلى الـ server الآخر ترى سلة فارغة" },
        { en: "The database runs out of connections", ar: "تنفد اتصالات الـ database" },
        { en: "ETag validation stops working", ar: "يتوقف التحقق من الـ ETag عن العمل" },
        { en: "TLS handshakes start failing", ar: "تبدأ عمليات TLS handshake بالفشل" }
      ],
      correct: 0,
      why: {
        en: "The cart lives in one process's memory, so only that process can see it. Any request the load balancer sends elsewhere finds nothing — this is exactly the failure the stateless constraint prevents.",
        ar: "السلة موجودة في ذاكرة عملية واحدة، فتلك العملية وحدها تراها. أي طلب يرسله الـ load balancer إلى مكان آخر لا يجد شيئاً — وهذا بالضبط الفشل الذي يمنعه قيد الـ stateless."
      }
    },
    {
      q: {
        en: "Why can a CDN cache GET /orders/1042 but not POST /api/getOrderById?",
        ar: "لماذا يستطيع الـ CDN تخزين GET /orders/1042 ولا يستطيع تخزين POST /api/getOrderById؟"
      },
      options: [
        { en: "POST bodies are encrypted and GET URLs are not", ar: "أجسام الـ POST مشفّرة وعناوين الـ GET ليست كذلك" },
        { en: "GET is defined as a read with a cacheable URL as its key; POST is defined as a write", ar: "الـ GET معرّف كقراءة مفتاحها URL قابل للتخزين؛ والـ POST معرّف ككتابة" },
        { en: "POST requests are always larger than the CDN size limit", ar: "طلبات الـ POST دائماً أكبر من حد الحجم في الـ CDN" },
        { en: "CDNs only understand HTTP/2, and POST requires HTTP/1.1", ar: "الـ CDNs تفهم HTTP/2 فقط، والـ POST يتطلب HTTP/1.1" }
      ],
      correct: 1,
      why: {
        en: "The uniform interface gives GET a fixed meaning — read, change nothing, identified fully by its URL — so a cache can key on that URL. POST is defined as a write with meaning hidden in the body, so caching it would be unsafe.",
        ar: "يعطي الـ uniform interface للـ GET معنى ثابتاً — اقرأ ولا تغيّر شيئاً، ومعرَّف بالكامل بواسطة الـ URL — فيستطيع الـ cache استخدام ذلك الـ URL كمفتاح. أما الـ POST فمعرّف ككتابة معناها مخبّأ في الـ body، فتخزينه غير آمن."
      }
    },
    {
      q: {
        en: "An endpoint returns 200 OK with { \"success\": false, \"error\": \"NOT_FOUND\" }. What is the practical harm?",
        ar: "endpoint يرجع 200 OK مع { \"success\": false, \"error\": \"NOT_FOUND\" }. ما الضرر العملي؟"
      },
      options: [
        { en: "The JSON body is larger than a 404 response", ar: "جسم الـ JSON أكبر من رد 404" },
        { en: "Caches and clients treat the failure as a successful answer and may store or reuse it", ar: "الـ caches والـ clients تعامل الفشل كإجابة ناجحة وقد تخزّنها أو تعيد استخدامها" },
        { en: "The server cannot log the error", ar: "لا يستطيع الـ server تسجيل الخطأ" },
        { en: "It forces the connection to close", ar: "يجبر الاتصال على الإغلاق" }
      ],
      correct: 1,
      why: {
        en: "Machines on the path act on the status line, not your JSON. A 200 tells them the request succeeded, so a not-found answer can be cached and served for the whole max-age window.",
        ar: "الأجهزة على المسار تتصرف بناءً على سطر الحالة لا على الـ JSON عندك. الـ 200 يخبرها أن الطلب نجح، فيمكن تخزين إجابة «غير موجود» وتقديمها طوال مدة الـ max-age."
      }
    },
    {
      q: {
        en: "Which choice best models 'cancel order 1042' in a REST API?",
        ar: "أي خيار ينمذج «ألغِ الطلب 1042» بشكل أفضل في REST API؟"
      },
      options: [
        { en: "GET /orders/1042/cancel", ar: "GET /orders/1042/cancel" },
        { en: "POST /api/cancelOrder with { \"id\": 1042 }", ar: "POST /api/cancelOrder مع { \"id\": 1042 }" },
        { en: "POST /orders/1042/cancellations", ar: "POST /orders/1042/cancellations" },
        { en: "DELETE /orders/1042", ar: "DELETE /orders/1042" }
      ],
      correct: 2,
      why: {
        en: "The cancellation becomes a resource with its own URL and history, created with a method that writes. GET must never change data, the RPC-style URL hides its meaning from every intermediary, and DELETE would say the order no longer exists rather than that it was cancelled.",
        ar: "يصبح الإلغاء resource له URL وتاريخ خاص به، ويُنشأ عبر method تكتب. الـ GET يجب ألا يغيّر البيانات أبداً، والـ URL بأسلوب RPC يخفي معناه عن كل intermediary، والـ DELETE سيقول إن الطلب لم يعد موجوداً بدل أنه أُلغي."
      }
    }
  ]
};
```

NEXT: api-versioning
