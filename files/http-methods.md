```js
const httpMethodsLesson = {
  id: "http-methods",
  moduleId: "foundations",
  title: { en: "Methods, safety and idempotency", ar: "الـ methods والأمان والـ idempotency" },
  summary: {
    en: "What each method actually promises to caches, proxies and retry logic — and what breaks the moment you lie about it.",
    ar: "ما تعِد به كل method فعلياً للـ caches والـ proxies ومنطق إعادة المحاولة — وما ينكسر لحظة أن تكذب بشأنه."
  },
  mins: 12,
  sections: [
    { key: "why", blocks: [
      { t: "p", en: "A method is not a label on a controller action. It is a machine-readable promise made to every piece of infrastructure between the client and your database: browsers, CDNs, reverse proxies, service meshes, HTTP client libraries and retry policies all change behaviour based on that one word. When you write [HttpGet] you are telling a CDN it may cache the answer, telling a browser it may prefetch the URL, and telling a retry policy that firing the request three times is harmless.", ar: "الـ method ليست لافتة على controller action. إنها وعد مقروء آلياً تقطعه لكل قطعة بنية تحتية بين الـ client وقاعدة بياناتك: المتصفحات والـ CDNs والـ reverse proxies وشبكات الخدمات ومكتبات الـ HTTP clients وسياسات إعادة المحاولة، كلها تغيّر سلوكها بناءً على تلك الكلمة الواحدة. حين تكتب [HttpGet] فأنت تخبر الـ CDN أنه يجوز له تخزين الإجابة، وتخبر المتصفح أنه يجوز له جلب الـ URL مسبقاً، وتخبر سياسة إعادة المحاولة أن إطلاق الـ request ثلاث مرات غير مؤذٍ." },
      { t: "p", en: "The reason this matters more than it looks is that the network is unreliable in one specific, nasty way: a client that gets no response cannot tell whether the server never received the request or received it, executed it, and lost the response on the way back. Idempotency is the only thing that lets a client resolve that ambiguity on its own. Without it, every timeout becomes a human decision, and \"is it safe to retry?\" becomes a question nobody can answer at 3 a.m.", ar: "وسبب أهمية هذا أكثر مما يبدو أن الشبكة غير موثوقة بطريقة واحدة خبيثة تحديداً: الـ client الذي لا يتلقى استجابة لا يستطيع التمييز بين أن السيرفر لم يستلم الـ request أصلاً، وبين أنه استلمه ونفّذه ثم ضاعت الاستجابة في طريق العودة. الـ idempotency هي الشيء الوحيد الذي يمكّن الـ client من حسم هذا الغموض وحده. بدونها يتحوّل كل timeout إلى قرار بشري، ويصبح سؤال «هل إعادة المحاولة آمنة؟» سؤالاً لا يجيب عنه أحد في الثالثة فجراً." },
      { t: "p", en: "Historically the lesson was learned the hard way. Early web applications exposed actions like /admin/deleteUser?id=42 behind links. A crawler indexed the page, followed every link, and emptied the database — not because of a bug in the code, but because GET had been used for something that was not safe, and the crawler believed the promise the method made.", ar: "تاريخياً تُعلِّم هذا الدرس بالطريقة الصعبة. تطبيقات الويب الأولى كانت تعرض إجراءات مثل /admin/deleteUser?id=42 خلف روابط. زحف crawler على الصفحة وتتبّع كل رابط ففرّغ قاعدة البيانات — لا بسبب خطأ في الكود، بل لأن الـ GET استُخدم لشيء غير آمن، والـ crawler صدّق الوعد الذي قطعته الـ method." },
      { t: "callout", kind: "note", en: "Safety and idempotency are properties the server must guarantee, not properties the client can verify. Nothing stops you from writing a GET that deletes rows — the protocol simply assumes you did not, and the whole ecosystem acts on that assumption.", ar: "الأمان والـ idempotency خاصيتان يجب أن يضمنهما السيرفر، لا خاصيتان يستطيع الـ client التحقق منهما. لا شيء يمنعك من كتابة GET يحذف صفوفاً — البروتوكول ببساطة يفترض أنك لم تفعل، والمنظومة كلها تتصرف بناءً على ذلك الافتراض." }
    ]},

    { key: "problem", blocks: [
      { t: "p", en: "Take a payment endpoint exposed as POST /payments with the amount in the body. The client's HTTP timeout is 5 seconds; the server occasionally takes 6 seconds under load because a downstream provider is slow. The client times out, the retry policy fires once, and the charge is created twice. At 20,000 payments a day with a 0.3% timeout rate, that is roughly 60 duplicate charges per day — every one of them a support ticket, a refund and a chargeback risk.", ar: "خذ endpoint للدفع معروضاً كـ POST /payments والمبلغ في الـ body. مهلة الـ client 5 ثوانٍ؛ والسيرفر يستغرق أحياناً 6 ثوانٍ تحت الحمل لأن مزوّداً خارجياً بطيء. ينتهي وقت الـ client فتُطلق سياسة إعادة المحاولة مرة واحدة، فيُنشأ الخصم مرتين. عند 20 ألف عملية دفع يومياً بنسبة timeout قدرها 0.3%، فذلك ~60 خصماً مكرراً يومياً — كل واحد منها تذكرة دعم واسترداد ومخاطرة chargeback." },
      { t: "p", en: "Now express the same operation as PUT /payments/{clientGeneratedId}. The client picks the id before it sends anything. The first attempt creates the payment; the retry finds the id already present and returns the same resource. Duplicates drop to zero, and the client no longer needs a human to decide whether to retry — the method itself carries the guarantee.", ar: "الآن عبّر عن نفس العملية كـ PUT /payments/{clientGeneratedId}. الـ client يختار المعرّف قبل أن يرسل أي شيء. المحاولة الأولى تنشئ عملية الدفع؛ وإعادة المحاولة تجد المعرّف موجوداً فترجع نفس المورد. تهبط التكرارات إلى صفر، ولم يعد الـ client بحاجة إلى بشر ليقرر هل يعيد المحاولة — الـ method نفسها تحمل الضمان." },
      { t: "kv", rows: [
        { k: { en: "POST /payments + one retry on timeout", ar: "POST /payments مع إعادة محاولة واحدة عند الـ timeout" }, v: { en: "~60 duplicate charges/day at 20k req/day and a 0.3% timeout rate", ar: "~60 خصماً مكرراً يومياً عند 20 ألف request/يوم ونسبة timeout 0.3%" } },
        { k: { en: "PUT /payments/{clientId} + same retry", ar: "PUT /payments/{clientId} مع نفس إعادة المحاولة" }, v: { en: "0 duplicates; the retry is a no-op that returns the existing resource", ar: "صفر تكرار؛ إعادة المحاولة عملية بلا أثر تُرجع المورد الموجود" } },
        { k: { en: "GET used for a state change", ar: "استخدام GET لتغيير الحالة" }, v: { en: "Crawlers, browser prefetch, link previews and CDN warmers all fire it without a user ever clicking", ar: "الـ crawlers وجلب المتصفح المسبق ومعاينات الروابط ومسخّنات الـ CDN كلها تطلقه دون أن ينقر مستخدم أصلاً" } },
        { k: { en: "PATCH without a precondition", ar: "PATCH بدون precondition" }, v: { en: "Two concurrent edits: last writer wins silently, and the first user's change disappears with no error anywhere", ar: "تعديلان متزامنان: آخر كاتب يفوز بصمت، وتختفي تعديلات المستخدم الأول دون أي خطأ في أي مكان" } }
      ]}
    ]},

    { key: "internals", blocks: [
      { t: "p", en: "The specification defines three independent properties, and engineers routinely collapse them into one. Safe means the method is read-only in intent: it does not request a state change. Idempotent means that the effect on server state of N identical requests (N >= 1) is the same as the effect of exactly one. Cacheable means a response may be stored and reused. Safe implies idempotent; idempotent does not imply safe; and cacheability is a separate axis governed mostly by headers.", ar: "المواصفة تعرّف ثلاث خصائص مستقلة، والمهندسون يخلطونها في واحدة باستمرار. الـ safe تعني أن الـ method للقراءة فقط بحسب النية: لا تطلب تغيير حالة. والـ idempotent تعني أن أثر N من الـ requests المتطابقة (حيث N ≥ 1) على حالة السيرفر يساوي أثر request واحد بالضبط. والـ cacheable تعني أن الاستجابة يجوز تخزينها وإعادة استخدامها. الـ safe تستلزم الـ idempotent؛ والعكس غير صحيح؛ والـ cacheability محور منفصل تحكمه الـ headers غالباً." },
      { t: "kv", rows: [
        { k: { en: "GET", ar: "GET" }, v: { en: "Safe · idempotent · cacheable by default. No body semantics. The only method a CDN will cache without being told.", ar: "safe · idempotent · قابلة للـ caching افتراضياً. بلا دلالة body. الـ method الوحيدة التي يخزّنها الـ CDN دون أن تطلب منه." } },
        { k: { en: "HEAD", ar: "HEAD" }, v: { en: "Identical to GET but the response carries no body. Used for existence and metadata checks; must return the same headers GET would.", ar: "مطابقة لـ GET لكن الاستجابة بلا body. تُستخدم للتحقق من الوجود وقراءة الـ metadata؛ ويجب أن ترجع نفس headers الـ GET." } },
        { k: { en: "POST", ar: "POST" }, v: { en: "Neither safe nor idempotent. The general-purpose 'process this' method: creation, RPC-style actions, anything without a natural target URI.", ar: "ليست safe ولا idempotent. الـ method العامة بمعنى «عالج هذا»: الإنشاء، والإجراءات على نمط RPC، وكل ما ليس له URI هدف طبيعي." } },
        { k: { en: "PUT", ar: "PUT" }, v: { en: "Idempotent, not safe. Full replacement of the resource at a known URI — the client chooses the identifier.", ar: "idempotent وليست safe. استبدال كامل للمورد عند URI معروف — والـ client هو من يختار المعرّف." } },
        { k: { en: "PATCH", ar: "PATCH" }, v: { en: "Neither safe nor idempotent by definition. Whether a specific PATCH is idempotent depends entirely on the patch document you accept.", ar: "ليست safe ولا idempotent بالتعريف. وكون PATCH معيّن idempotent يعتمد كلياً على مستند التعديل الذي تقبله." } },
        { k: { en: "DELETE", ar: "DELETE" }, v: { en: "Idempotent, not safe. The second call finds nothing to delete — the state is still 'gone', which is what idempotent means.", ar: "idempotent وليست safe. الاستدعاء الثاني لا يجد شيئاً ليحذفه — والحالة تبقى «محذوف»، وهذا بالضبط معنى الـ idempotent." } },
        { k: { en: "OPTIONS", ar: "OPTIONS" }, v: { en: "Safe and idempotent. Carries the CORS preflight; the browser sends it automatically before non-simple cross-origin requests.", ar: "safe و idempotent. تحمل الـ CORS preflight؛ والمتصفح يرسلها تلقائياً قبل الـ requests العابرة للأصل غير البسيطة." } }
      ]},
      { t: "p", en: "Idempotency is about state, not about the response. DELETE /orders/7 twice legitimately returns 204 then 404: the responses differ, but the server state after both calls is identical. Conversely a counter increment is not idempotent even if it returns 200 every single time. When an interviewer asks whether an endpoint is idempotent, they are asking you to reason about the database row, not about the status code.", ar: "الـ idempotency تخص الحالة لا الاستجابة. استدعاء DELETE /orders/7 مرتين يُرجع 204 ثم 404 بشكل مشروع: الاستجابتان مختلفتان، لكن حالة السيرفر بعد الاستدعاءين متطابقة. وبالمقابل، زيادة عدّاد ليست idempotent حتى لو أرجعت 200 في كل مرة. حين يسألك محاور هل الـ endpoint فيه idempotency، فهو يطلب منك التفكير في صف قاعدة البيانات لا في الـ status code." },
      { t: "code", lang: "csharp", label: { en: "The same operation, three levels of retry safety", ar: "نفس العملية بثلاثة مستويات من أمان إعادة المحاولة" }, code: "// 1. Not idempotent: every retry creates a new row.\napp.MapPost(\"/payments\", async (PaymentDto dto, IPaymentService svc, CancellationToken ct)\n    => Results.Created($\"/payments/{await svc.ChargeAsync(dto, ct)}\", null));\n\n// 2. Idempotent by URI: the client owns the identifier.\napp.MapPut(\"/payments/{id:guid}\", async (Guid id, PaymentDto dto, IPaymentService svc, CancellationToken ct) =>\n{\n    var existing = await svc.FindAsync(id, ct);\n    if (existing is not null) return Results.Ok(existing);   // replay of a retry\n    var created = await svc.ChargeAsync(id, dto, ct);        // id is the natural dedup key\n    return Results.Created($\"/payments/{id}\", created);\n});\n\n// 3. POST kept, idempotency moved into a header (the pattern payment APIs use).\napp.MapPost(\"/payments\", async (\n    [FromHeader(Name = \"Idempotency-Key\")] string? key,\n    PaymentDto dto, IIdempotencyStore store, IPaymentService svc, CancellationToken ct) =>\n{\n    if (string.IsNullOrWhiteSpace(key))\n        return Results.Problem(\"Idempotency-Key header is required.\", statusCode: 400);\n\n    if (await store.TryGetAsync(key, ct) is { } cached)\n        return Results.Json(cached.Body, statusCode: cached.Status);\n\n    var result = await svc.ChargeAsync(dto, ct);\n    await store.SaveAsync(key, 201, result, TimeSpan.FromHours(24), ct);\n    return Results.Created($\"/payments/{result.Id}\", result);\n});" },
      { t: "p", en: "The reason PATCH is not idempotent by definition is the patch document. A JSON Merge Patch that sets status to \"shipped\" is idempotent — applying it five times leaves the same value. A JSON Patch operation like { \"op\": \"add\", \"path\": \"/tags/-\", \"value\": \"urgent\" } appends, so five applications produce five tags. Same method, same endpoint, opposite guarantees, decided entirely by the payload format you chose to support.", ar: "سبب كون الـ PATCH غير idempotent بالتعريف هو مستند التعديل نفسه. مستند JSON Merge Patch يضبط الـ status إلى \"shipped\" هو idempotent — تطبيقه خمس مرات يترك نفس القيمة. أما عملية JSON Patch مثل { \"op\": \"add\", \"path\": \"/tags/-\", \"value\": \"urgent\" } فتُلحِق، وخمس تطبيقات تنتج خمسة tags. نفس الـ method ونفس الـ endpoint وضمانات متعاكسة، والقرار كله في صيغة الـ payload التي اخترت دعمها." },
      { t: "p", en: "The framework leans on this too. ASP.NET Core's endpoint routing matches the path first and the method second, which is why an unmatched method yields 405 with an Allow header listing the methods that do match — not a 404. Kestrel answers HEAD by running the GET pipeline and discarding the body, so a HEAD request costs the same server work as a GET while transferring nothing. And HttpClient with SocketsHttpHandler will silently retry a request once when a pooled connection is closed before the request is sent — safe precisely because it only happens before any byte reaches the server.", ar: "الـ framework يستند إلى ذلك أيضاً. الـ endpoint routing في ASP.NET Core يطابق الـ path أولاً ثم الـ method ثانياً، ولهذا تُنتج الـ method غير المطابقة استجابة 405 مع Allow header يسرد الـ methods المطابقة — لا 404. وKestrel يعالج HEAD بتشغيل مسار الـ GET ثم إسقاط الـ body، فيكلّف الـ HEAD نفس عمل السيرفر الذي يكلّفه GET بينما لا ينقل شيئاً. وHttpClient مع SocketsHttpHandler يعيد المحاولة بصمت مرة واحدة حين يُغلق اتصال من الـ pool قبل إرسال الـ request — وهو آمن تحديداً لأنه لا يحدث إلا قبل وصول أي بايت إلى السيرفر." },
      { t: "callout", kind: "warn", en: "A 200 OK on a POST tells the client nothing about whether a retry is safe. If your API can be called by anything with a retry policy — and it can — the guarantee must be in the design (client-chosen URI or an idempotency key), never in a convention nobody enforces.", ar: "استجابة 200 OK على POST لا تخبر الـ client بشيء عن أمان إعادة المحاولة. إن كان API الخاص بك قابلاً للاستدعاء من أي شيء لديه سياسة إعادة محاولة — وهو كذلك — فيجب أن يكون الضمان في التصميم (URI يختاره الـ client أو idempotency key)، لا في عُرف لا يفرضه أحد." }
    ]},

    { key: "tradeoffs", blocks: [
      { t: "tradeoff",
        pros: {
          en: [
            "Correct method semantics let generic infrastructure retry, cache and prefetch without knowing your domain",
            "Idempotent writes turn a timeout from an incident into an automatic retry",
            "405 with an Allow header gives clients a precise, machine-readable contract error",
            "Safe methods can be load-tested, mirrored and replayed against production without side effects"
          ],
          ar: [
            "دلالات الـ methods الصحيحة تتيح للبنية التحتية العامة إعادة المحاولة والـ caching والجلب المسبق دون معرفة مجالك",
            "الكتابات الـ idempotent تحوّل الـ timeout من حادثة إلى إعادة محاولة تلقائية",
            "الـ 405 مع Allow header يعطي العملاء خطأ عقد دقيقاً مقروءاً آلياً",
            "الـ methods الآمنة يمكن اختبار حملها ونسخها وإعادة تشغيلها ضد الـ production بلا آثار جانبية"
          ]
        },
        cons: {
          en: [
            "PUT forces the client to generate identifiers, which many client teams resist",
            "Idempotency keys need a durable store, a TTL policy and a response cache — real operational cost",
            "Strict method purity pushes real-world actions (approve, cancel, retry) into awkward URI shapes",
            "PATCH semantics vary per media type, so 'we support PATCH' is not by itself a contract"
          ],
          ar: [
            "الـ PUT يجبر الـ client على توليد المعرّفات، وكثير من فرق العملاء يقاومون ذلك",
            "مفاتيح الـ idempotency تحتاج تخزيناً دائماً وسياسة TTL وcache للاستجابات — تكلفة تشغيلية حقيقية",
            "الالتزام الصارم بنقاء الـ methods يدفع إجراءات الواقع (اعتماد، إلغاء، إعادة محاولة) إلى أشكال URI متكلّفة",
            "دلالات الـ PATCH تختلف بحسب الـ media type، فقول «ندعم PATCH» ليس عقداً بذاته"
          ]
        },
        limits: {
          en: [
            "The protocol cannot enforce safety — a GET that writes still works, it just breaks everything downstream",
            "Idempotency covers duplicate delivery, not concurrent conflicting writes; that needs ETags",
            "Idempotency keys are only as good as their retention window; a retry after the TTL duplicates anyway",
            "GET has no reliable body semantics, so complex queries must become POST /search and lose cacheability"
          ],
          ar: [
            "البروتوكول لا يستطيع فرض الأمان — الـ GET الذي يكتب سيعمل، لكنه يكسر كل ما بعده",
            "الـ idempotency تعالج التسليم المكرر لا الكتابات المتزامنة المتعارضة؛ وتلك تحتاج ETags",
            "مفاتيح الـ idempotency تصلح بقدر نافذة الاحتفاظ بها؛ وإعادة محاولة بعد انتهاء الـ TTL تُكرّر رغم ذلك",
            "الـ GET بلا دلالة body موثوقة، فالاستعلامات المعقدة تصبح POST /search وتفقد قابلية الـ caching"
          ]
        },
        alts: {
          en: [
            "Idempotency-Key header on POST — keeps the URI shape, moves the guarantee into a header",
            "Conditional requests with If-Match / ETag — solves lost updates, which idempotency does not",
            "Command endpoints (POST /orders/{id}/cancel) when the action does not map to a resource state",
            "Message queues with at-least-once delivery plus consumer-side dedup, when the caller cannot wait"
          ],
          ar: [
            "Idempotency-Key header على الـ POST — يحافظ على شكل الـ URI وينقل الضمان إلى header",
            "الـ requests المشروطة بـ If-Match / ETag — تحل مشكلة الكتابات الضائعة التي لا تحلها الـ idempotency",
            "endpoints للأوامر (POST /orders/{id}/cancel) حين لا ينعكس الإجراء على حالة مورد",
            "طوابير رسائل بتسليم at-least-once مع إزالة تكرار عند المستهلك، حين لا يستطيع المتصل الانتظار"
          ]
        }
      }
    ]},

    { key: "mistakes", blocks: [
      { t: "mistake",
        title: { en: "GET that mutates state", ar: "GET يغيّر الحالة" },
        body: { en: "An admin panel exposes GET /users/42/deactivate as a plain link. A link-preview bot in the team chat fetches every URL pasted into a channel, and 30 accounts get deactivated the day someone shares a screenshot with the URL visible. Nothing in the code is wrong; the method lied about what the request does, and every safe-method consumer believed it.", ar: "لوحة إدارة تعرض GET /users/42/deactivate كرابط عادي. bot لمعاينة الروابط في محادثة الفريق يجلب كل URL يُلصق في قناة، فتُعطَّل 30 حساباً في اليوم الذي شارك فيه أحدهم لقطة شاشة يظهر فيها الـ URL. لا شيء خاطئ في الكود؛ الـ method كذبت بشأن ما يفعله الـ request، وكل مستهلك للـ methods الآمنة صدّقها." },
        fix: "app.MapPost(\"/users/{id:int}/deactivate\", DeactivateAsync)\n   .RequireAuthorization(\"admin\");" },
      { t: "mistake",
        title: { en: "Retrying POST as if it were idempotent", ar: "إعادة محاولة POST كأنها idempotent" },
        body: { en: "A Polly policy is registered globally with WaitAndRetryAsync(3) on the typed HttpClient. It was added for a read-heavy service and nobody revisited it when the same client started calling POST /invoices. A single downstream 504 on a slow month-end now produces four invoices for the same customer, and the duplicates are only found during reconciliation two weeks later.", ar: "سياسة Polly مسجّلة عالمياً بـ WaitAndRetryAsync(3) على الـ typed HttpClient. أُضيفت لخدمة قراءة كثيفة ولم يراجعها أحد حين بدأ نفس الـ client يستدعي POST /invoices. الآن ينتج عن 504 واحدة في نهاية شهر مزدحمة أربع فواتير لنفس العميل، ولا تُكتشف التكرارات إلا في التسوية بعد أسبوعين." },
        fix: "var retry = Policy<HttpResponseMessage>\n    .Handle<HttpRequestException>()\n    .OrResult(r => (int)r.StatusCode >= 500)\n    .WaitAndRetryAsync(3, a => TimeSpan.FromMilliseconds(200 * Math.Pow(2, a)));\n\n// only apply it where the request is provably replay-safe\nvar policy = Policy<HttpResponseMessage>.WrapAsync(retry)\n    .AsAsyncPolicy<HttpResponseMessage>();\n\nbuilder.Services.AddHttpClient<InvoiceClient>()\n    .AddPolicyHandler((sp, req) =>\n        req.Method == HttpMethod.Get || req.Headers.Contains(\"Idempotency-Key\")\n            ? retry\n            : Policy.NoOpAsync<HttpResponseMessage>());" },
      { t: "mistake",
        title: { en: "DELETE that returns 404 on the second call and breaks the caller", ar: "DELETE يرجع 404 في الاستدعاء الثاني فيكسر المستدعي" },
        body: { en: "A cleanup job deletes 500 records, times out on record 300, and reruns from the start. The first 299 DELETEs now return 404, the job treats any non-2xx as fatal, and it aborts every night at the same point — leaving 200 records permanently undeleted. The server was correct; the client's error handling did not understand that 404 on DELETE means the desired state was already reached.", ar: "مهمة تنظيف تحذف 500 سجل، ينتهي وقتها عند السجل 300، فتُعاد من البداية. الآن ترجع أول 299 عملية DELETE استجابة 404، والمهمة تعتبر أي استجابة خارج 2xx قاتلة، فتتوقف كل ليلة عند نفس النقطة — تاركة 200 سجل بلا حذف بشكل دائم. السيرفر كان صحيحاً؛ لكن معالجة الأخطاء عند الـ client لم تفهم أن 404 على DELETE تعني أن الحالة المطلوبة تحققت بالفعل." },
        fix: "var res = await http.DeleteAsync($\"/records/{id}\", ct);\nif (!res.IsSuccessStatusCode && res.StatusCode != HttpStatusCode.NotFound)\n    res.EnsureSuccessStatusCode();  // 404 == already deleted == success" },
      { t: "mistake",
        title: { en: "PUT used for a partial update", ar: "استخدام PUT لتحديث جزئي" },
        body: { en: "A mobile app built against v1 sends PUT /profiles/42 with the six fields it knows about. The backend later adds a marketingConsent field, the web client sets it, and the next mobile save silently resets it to null — because PUT means full replacement and the absent field is a deliberate erasure, not an omission. The bug surfaces months later as a compliance finding, not a crash.", ar: "تطبيق موبايل مبني على الإصدار الأول يرسل PUT /profiles/42 بالحقول الستة التي يعرفها. لاحقاً يضيف الـ backend حقل marketingConsent، فيضبطه عميل الويب، ثم يعيده أول حفظ من الموبايل إلى null بصمت — لأن الـ PUT يعني استبدالاً كاملاً، والحقل الغائب مسح متعمد لا إغفال. تظهر المشكلة بعد شهور كمخالفة امتثال لا كتعطّل." },
        fix: "PATCH /profiles/42\nContent-Type: application/merge-patch+json\n\n{ \"displayName\": \"Sara\" }   // untouched fields stay untouched" },
      { t: "mistake",
        title: { en: "Assuming idempotency prevents lost updates", ar: "افتراض أن الـ idempotency تمنع الكتابات الضائعة" },
        body: { en: "Two support agents open the same ticket and both save. Both PUTs are idempotent, both succeed with 200, and the second one silently overwrites the first agent's note. Idempotency guarantees that repeating one request is harmless; it says nothing about two different requests racing. The missing piece is a precondition, not a stronger method.", ar: "موظفا دعم يفتحان نفس التذكرة ويحفظان معاً. كلا الـ PUTs فيه idempotency، وكلاهما ينجح بـ 200، والثاني يطمس ملاحظة الموظف الأول بصمت. الـ idempotency تضمن أن تكرار request واحد غير مؤذٍ؛ ولا تقول شيئاً عن تسابق request مختلفين. الناقص هنا precondition لا method أقوى." },
        fix: "// server\nif (Request.Headers.IfMatch.Count == 0) return Results.StatusCode(428);\nif (Request.Headers.IfMatch.ToString() != currentEtag) return Results.StatusCode(412);" },
      { t: "mistake",
        title: { en: "Returning 404 instead of 405 for a wrong method", ar: "إرجاع 404 بدل 405 عند method خاطئة" },
        body: { en: "A custom catch-all handler answers 404 for anything that does not match a route, including POST to a GET-only path. A client team spends two days convinced the endpoint was never deployed, because 404 says 'this resource does not exist' while the truth was 'it exists, you used the wrong verb'. The default routing behaviour already returns 405 with an Allow header; the custom handler destroyed the information.", ar: "معالج شامل مخصص يرد بـ 404 لكل ما لا يطابق route، بما في ذلك POST إلى مسار مخصص للـ GET فقط. يقضي فريق عميل يومين مقتنعاً بأن الـ endpoint لم يُنشر أصلاً، لأن الـ 404 تقول «هذا المورد غير موجود» بينما الحقيقة «موجود لكنك استخدمت الفعل الخطأ». سلوك الـ routing الافتراضي يرجع 405 مع Allow header أصلاً؛ والمعالج المخصص أتلف تلك المعلومة." } }
    ]},

    { key: "interview", blocks: [
      { t: "qa", level: "junior",
        q: { en: "What is the difference between a safe method and an idempotent one?", ar: "ما الفرق بين method آمنة وأخرى idempotent؟" },
        a: { en: "Safe means the request is not intended to change server state at all — GET, HEAD, OPTIONS. Idempotent means repeating the identical request leaves the server in the same state as sending it once — GET, HEAD, PUT, DELETE. Every safe method is idempotent; the reverse is false, because DELETE clearly changes state yet repeating it changes nothing further.", ar: "الـ safe تعني أن الـ request لا يقصد تغيير حالة السيرفر إطلاقاً — GET و HEAD و OPTIONS. والـ idempotent تعني أن تكرار نفس الـ request يترك السيرفر في نفس الحالة التي يتركها إرساله مرة واحدة — GET و HEAD و PUT و DELETE. كل method آمنة هي idempotent؛ والعكس غير صحيح، لأن DELETE تغيّر الحالة بوضوح لكن تكرارها لا يغيّر شيئاً إضافياً." } },
      { t: "qa", level: "junior",
        q: { en: "When would you choose PUT over POST for creating a resource?", ar: "متى تختار PUT بدل POST لإنشاء مورد؟" },
        a: { en: "When the client can supply the identifier. PUT /orders/{guid} is idempotent because the URI names exactly one resource, so a retry after a timeout finds the resource already there instead of creating a second one. POST /orders is right when the server assigns the id, or when the operation is an action rather than a resource with a natural address.", ar: "حين يستطيع الـ client توفير المعرّف. الـ PUT /orders/{guid} فيه idempotency لأن الـ URI يسمّي مورداً واحداً بالضبط، فإعادة المحاولة بعد timeout تجد المورد موجوداً بدل إنشاء ثانٍ. أما POST /orders فهي الصحيحة حين يسند السيرفر المعرّف، أو حين تكون العملية إجراءً لا مورداً له عنوان طبيعي." } },
      { t: "qa", level: "mid",
        q: { en: "Is PATCH idempotent?", ar: "هل الـ PATCH فيها idempotency؟" },
        a: { en: "Not by definition, and the honest answer is 'it depends on the patch format'. A JSON Merge Patch that assigns absolute values is idempotent — applying { \"status\": \"shipped\" } ten times yields one shipped order. A JSON Patch with an add-to-array or a relative operation is not: ten applications append ten entries. If you want a guarantee, either restrict the patch media type to merge-patch or attach an If-Match precondition.", ar: "ليست كذلك بالتعريف، والإجابة الصادقة أنها «تعتمد على صيغة الـ patch». مستند JSON Merge Patch يُسند قيماً مطلقة فيه idempotency — تطبيق { \"status\": \"shipped\" } عشر مرات ينتج طلباً واحداً مشحوناً. أما JSON Patch بعملية إضافة إلى مصفوفة أو عملية نسبية فلا: عشر تطبيقات تُلحق عشرة عناصر. إن أردت ضماناً، فإما أن تقصر الـ media type على merge-patch أو أن تشترط If-Match." } },
      { t: "qa", level: "mid",
        q: { en: "A client times out on POST /payments. It has no response. What should it do, and what should you have built so it can decide?", ar: "انتهت مهلة client على POST /payments ولم يتلقّ استجابة. ماذا يفعل، وماذا كان يجب أن تبنيه ليستطيع أن يقرر؟" },
        a: { en: "With a bare POST it cannot decide — a blind retry risks a double charge, and giving up risks losing a payment the server already made. The correct answer is that the design should have removed the ambiguity in advance: either the client owns the id (PUT /payments/{id}), or it sends an Idempotency-Key the server stores with the response for at least 24 hours. Then the retry is unconditionally safe and the client needs no judgement at all. As a last resort a GET /payments?clientRef=... lookup lets it check before retrying, but that adds a race of its own.", ar: "مع POST مجرّد لا يستطيع أن يقرر — فإعادة المحاولة العمياء تخاطر بخصم مزدوج، والاستسلام يخاطر بضياع دفعة نفّذها السيرفر فعلاً. الإجابة الصحيحة أن التصميم كان يجب أن يزيل الغموض مسبقاً: إما أن يملك الـ client المعرّف (PUT /payments/{id})، أو أن يرسل Idempotency-Key يخزّنه السيرفر مع الاستجابة 24 ساعة على الأقل. عندها تصبح إعادة المحاولة آمنة بلا شروط ولا يحتاج الـ client أي اجتهاد. وكحل أخير، استعلام GET /payments?clientRef=... يتيح التحقق قبل إعادة المحاولة، لكنه يضيف سباقاً خاصاً به." } },
      { t: "qa", level: "mid",
        q: { en: "Why does an API return 405 rather than 404 when the method is wrong?", ar: "لماذا يرجع API استجابة 405 بدل 404 عند استخدام method خاطئة؟" },
        a: { en: "Because routing matches the path first and the method second. The resource does exist, so 404 would be a lie that sends the caller looking for a deployment problem. 405 must be accompanied by an Allow header listing the supported methods, which turns a debugging session into a single glance at the response headers.", ar: "لأن الـ routing يطابق الـ path أولاً والـ method ثانياً. المورد موجود فعلاً، فتكون 404 كذبة ترسل المستدعي للبحث عن مشكلة نشر. والـ 405 يجب أن تصحبها Allow header تسرد الـ methods المدعومة، وهو ما يحوّل جلسة تشخيص كاملة إلى نظرة واحدة على headers الاستجابة." } },
      { t: "qa", level: "senior",
        q: { en: "How would you implement idempotency keys correctly? Where do people get it wrong?", ar: "كيف تنفّذ مفاتيح الـ idempotency بشكل صحيح؟ وأين يخطئ الناس؟" },
        a: { en: "Store the key with a unique constraint, and insert it in the same transaction as the business write — if the key lives in Redis and the order lives in SQL, a crash between the two reintroduces the exact duplicate you were preventing. Store the response too (status and body), not just the key, so a replay returns the original answer rather than a 409. Scope the key per client and per endpoint so two tenants cannot collide. Hash the request body and reject a reused key with a different payload — that is a client bug you want surfaced as 422, not silently served the old response. Set a TTL longer than any client's retry window, typically 24 hours. The two classic failures are a non-atomic key write and treating a concurrent in-flight duplicate as a new request instead of returning 409 while the first one is still running.", ar: "خزّن المفتاح بقيد فريد، وأدرجه في نفس الـ transaction التي تكتب البيانات الفعلية — فإن كان المفتاح في Redis والطلب في SQL، فإن انهياراً بينهما يعيد بالضبط التكرار الذي كنت تمنعه. وخزّن الاستجابة أيضاً (الحالة والـ body) لا المفتاح فقط، حتى تُرجع إعادة الإرسال الإجابة الأصلية لا استجابة 409. واجعل نطاق المفتاح لكل client ولكل endpoint حتى لا يتصادم مستأجران. واحسب hash لجسم الـ request وارفض مفتاحاً مُعاداً بـ payload مختلف — فهذا خطأ في الـ client تريد إظهاره كـ 422 لا خدمته بالاستجابة القديمة بصمت. واضبط TTL أطول من أي نافذة إعادة محاولة لدى العملاء، 24 ساعة عادةً. والفشلان الكلاسيكيان هما كتابة المفتاح خارج الذرّية، ومعاملة تكرار متزامن ما زال قيد التنفيذ كـ request جديد بدل إرجاع 409 ما دام الأول يعمل." } },
      { t: "qa", level: "senior",
        q: { en: "Your search needs a 4 KB filter payload. GET with a body is unreliable, but POST /search is not cacheable. How do you decide?", ar: "بحثك يحتاج payload للفلاتر بحجم 4 كيلوبايت. الـ GET مع body غير موثوق، والـ POST /search غير قابل للـ caching. كيف تقرر؟" },
        a: { en: "Start by asking what you actually lose. If the query mix has a long tail and the CDN hit rate would be near zero anyway, POST /search costs nothing real and is the simplest honest choice — just document that it is safe despite the method, and make sure no retry policy treats it as a write. If cacheability matters, the standard trick is POST /searches to create a stored query that returns a short id, then GET /searches/{id}/results, which is cacheable, shareable and paginable. What I would not do is push 4 KB into a query string: you will hit the 8 KB request-line limit, log the whole filter set in every access log, and leak it into referrer headers.", ar: "ابدأ بسؤال ماذا تخسر فعلاً. إن كان توزيع الاستعلامات ذا ذيل طويل ومعدل إصابة الـ CDN سيكون قريباً من الصفر أصلاً، فإن POST /search لا يكلفك شيئاً حقيقياً وهو الخيار الأبسط والأصدق — فقط وثّق أنه آمن رغم الـ method، وتأكد أن لا سياسة إعادة محاولة تعامله ككتابة. وإن كانت قابلية الـ caching مهمة، فالحيلة القياسية هي POST /searches لإنشاء استعلام مخزّن يُرجع معرّفاً قصيراً، ثم GET /searches/{id}/results وهو قابل للـ caching والمشاركة والتقسيم إلى صفحات. أما ما لن أفعله فهو دفع 4 كيلوبايت في query string: ستصطدم بحدّ سطر الـ request البالغ 8 كيلوبايت، وستسجّل مجموعة الفلاتر كاملة في كل سجل وصول، وستتسرّب إلى headers الـ referrer." } },
      { t: "qa", level: "staff",
        q: { en: "Across eight teams, method semantics are inconsistent: GETs that mutate, retried POSTs, DELETEs returning 500 on a second call. How do you fix this beyond writing a style guide?", ar: "عبر ثمانية فرق، دلالات الـ methods غير متسقة: GETs تغيّر الحالة، وPOSTs يُعاد إطلاقها، وDELETEs ترجع 500 في الاستدعاء الثاني. كيف تعالج هذا بما يتجاوز كتابة دليل أسلوب؟" },
        a: { en: "A style guide changes nothing that is not checked. I would make the contract executable in three places. First, at design time: an OpenAPI linter in CI that fails a PR if a GET or DELETE operation declares a request body, if a POST that creates a resource has no Idempotency-Key parameter, or if a mutating operation sits behind a safe method. Second, at runtime: a shared middleware package that emits a metric whenever a GET handler opens a write transaction, so violations are observable in production rather than argued about in review. Third, at the client edge: retry policies live in one internal HttpClient package that only retries GET, HEAD, PUT, DELETE or requests carrying an idempotency key — so a team cannot accidentally retry a POST even if they want to. Then I would pick the two highest-blast-radius services, fix them as reference implementations, and let the linter hold the line. The goal is that the safe path is the default path and the unsafe one requires an explicit, reviewable exemption.", ar: "دليل الأسلوب لا يغيّر شيئاً لا يُفحص. سأجعل العقد قابلاً للتنفيذ في ثلاثة مواضع. أولاً وقت التصميم: linter لملف OpenAPI في الـ CI يُفشل الـ PR إن أعلنت عملية GET أو DELETE عن request body، أو إن كانت عملية POST تنشئ مورداً بلا معامل Idempotency-Key، أو إن جلست عملية تغيّر الحالة خلف method آمنة. ثانياً وقت التشغيل: حزمة middleware مشتركة تُصدر مقياساً كلما فتح معالج GET عملية كتابة، فتصبح المخالفات مرصودة في الـ production بدل مناقشتها في المراجعات. ثالثاً عند حافة الـ client: تعيش سياسات إعادة المحاولة في حزمة HttpClient داخلية واحدة لا تعيد المحاولة إلا على GET و HEAD و PUT و DELETE أو على requests تحمل idempotency key — فلا يستطيع فريق إعادة إطلاق POST بالخطأ حتى لو أراد. ثم أختار أعلى خدمتين من حيث نطاق الضرر وأصلحهما كتنفيذين مرجعيين وأترك الـ linter يحرس الخط. الهدف أن يكون المسار الآمن هو المسار الافتراضي، وأن يتطلب المسار غير الآمن استثناءً صريحاً قابلاً للمراجعة." } }
    ]},

    { key: "codereview", blocks: [
      { t: "review", severity: "high",
        title: { en: "A state-changing operation behind GET", ar: "عملية تغيّر الحالة خلف GET" },
        bad: "[HttpGet(\"orders/{id:int}/confirm\")]\npublic async Task<IActionResult> Confirm(int id)\n{\n    await _orders.ConfirmAsync(id);\n    return Ok();\n}",
        good: "[HttpPost(\"orders/{id:int}/confirm\")]\npublic async Task<IActionResult> Confirm(int id, CancellationToken ct)\n{\n    var result = await _orders.ConfirmAsync(id, ct);\n    return result switch\n    {\n        ConfirmResult.Confirmed    => Ok(),\n        ConfirmResult.AlreadyDone  => Ok(),          // idempotent replay\n        ConfirmResult.NotFound     => NotFound(),\n        _                          => Conflict()\n    };\n}",
        why: { en: "Anything that trusts the safe-method contract will fire this without a user: browser prefetch, link-preview bots, security scanners, CDN warmers, and a retry policy that assumes GET is replay-safe. The good version uses POST and also makes the repeat case explicit — a second confirm returns 200 rather than throwing, so a retry after a timeout does not surface as an error the caller has to interpret.", ar: "كل ما يثق بعقد الـ methods الآمنة سيطلق هذا دون مستخدم: جلب المتصفح المسبق، وbots معاينة الروابط، وماسحات الأمان، ومسخّنات الـ CDN، وسياسة إعادة محاولة تفترض أن GET آمن للتكرار. النسخة الجيدة تستخدم POST وتجعل حالة التكرار صريحة أيضاً — فالتأكيد الثاني يرجع 200 بدل رمي استثناء، وبذلك لا تظهر إعادة المحاولة بعد timeout كخطأ يضطر المستدعي لتفسيره." }
      },
      { t: "review", severity: "medium",
        title: { en: "PUT that silently erases unknown fields", ar: "PUT يمحو الحقول غير المعروفة بصمت" },
        bad: "[HttpPut(\"profiles/{id:int}\")]\npublic async Task<IActionResult> Update(int id, ProfileDto dto)\n{\n    var entity = await _db.Profiles.FindAsync(id);\n    _mapper.Map(dto, entity);          // every unset DTO property overwrites the entity\n    await _db.SaveChangesAsync();\n    return NoContent();\n}",
        good: "[HttpPatch(\"profiles/{id:int}\")]\n[Consumes(\"application/merge-patch+json\")]\npublic async Task<IActionResult> Patch(int id, [FromBody] JsonElement patch, CancellationToken ct)\n{\n    var entity = await _db.Profiles.FindAsync([id], ct);\n    if (entity is null) return NotFound();\n\n    if (Request.Headers.IfMatch.Count == 0) return StatusCode(428);\n    if (Request.Headers.IfMatch.ToString() != Etag(entity)) return StatusCode(412);\n\n    _patcher.ApplyMergePatch(patch, entity);   // only keys present in the document\n    await _db.SaveChangesAsync(ct);\n    return NoContent();\n}",
        why: { en: "PUT means full replacement, so an older client that does not know about a newly added field wipes it on every save — a data-loss bug that produces no exception and no log line, and is typically found weeks later during an audit. Merge-patch only touches keys that are present, and the If-Match precondition closes the separate lost-update race that idempotency alone does not cover.", ar: "الـ PUT يعني استبدالاً كاملاً، فالـ client الأقدم الذي لا يعرف حقلاً أُضيف حديثاً يمحوه في كل عملية حفظ — وهو خلل فقدان بيانات لا ينتج عنه استثناء ولا سطر log، ويُكتشف عادةً بعد أسابيع في تدقيق. أما merge-patch فلا يلمس إلا المفاتيح الموجودة في المستند، وشرط If-Match يغلق سباق الكتابات الضائعة المنفصل الذي لا تغطيه الـ idempotency وحدها." }
      }
    ]},

    { key: "sysdesign", blocks: [
      { t: "p", en: "Method semantics decide where you are allowed to put infrastructure. A CDN or reverse-proxy cache in front of a service only helps if the read path is genuinely a safe GET; the moment one GET mutates, you either disable caching for the whole path prefix or you ship a correctness bug. A service mesh that retries failed calls is only sound if the mesh can tell which calls are replay-safe, which in practice means it inspects the method and an idempotency header.", ar: "دلالات الـ methods تحدد أين يُسمح لك بوضع البنية التحتية. الـ CDN أو cache الـ reverse proxy أمام خدمة لا ينفع إلا إذا كان مسار القراءة GET آمناً فعلاً؛ ولحظة أن يغيّر GET واحد الحالة، فإما أن تعطّل الـ caching لبادئة المسار كلها أو أن تشحن خللاً في الصحة. وشبكة الخدمات التي تعيد محاولة الاستدعاءات الفاشلة لا تكون سليمة إلا إذا استطاعت تمييز الاستدعاءات الآمنة للتكرار، وهو عملياً فحص الـ method وheader الـ idempotency." },
      { t: "p", en: "It also determines where the deduplication boundary lives. In an asynchronous design, the queue gives you at-least-once delivery and the consumer must dedup; in a synchronous HTTP design, the retry lives in the client and the server must dedup. Either way somebody owns a key with a uniqueness constraint and a retention window — and if nobody owns it explicitly, the duplicates are still happening, you just are not counting them.", ar: "كما تحدد أين يقع حدّ إزالة التكرار. في التصميم غير المتزامن يمنحك الطابور تسليماً at-least-once ويجب على المستهلك إزالة التكرار؛ وفي التصميم المتزامن عبر HTTP تعيش إعادة المحاولة عند الـ client ويجب على السيرفر إزالة التكرار. وفي الحالتين يملك أحدهم مفتاحاً بقيد تفرّد ونافذة احتفاظ — وإن لم يملكه أحد صراحة، فالتكرارات تحدث على أي حال، لكنك لا تعدّها فقط." },
      { t: "ul",
        en: [
          "CDN and edge caching: only GET and HEAD are cached by default; a mutating GET poisons every downstream cache",
          "Service mesh and gateway retries: configure the retriable method set explicitly rather than accepting the default",
          "Idempotency store: needs the same durability as the business data, and a TTL longer than the longest client retry window",
          "Client SDKs: bake the id generation into the SDK so callers get PUT-style safety without thinking about it",
          "Load and chaos testing: safe methods can be replayed against production traffic mirrors; write paths need a synthetic tenant"
        ],
        ar: [
          "الـ CDN والـ caching على الحافة: لا يُخزَّن افتراضياً إلا GET و HEAD؛ وGET يغيّر الحالة يسمّم كل cache بعده",
          "إعادة المحاولة في شبكة الخدمات والـ gateway: اضبط مجموعة الـ methods القابلة لإعادة المحاولة صراحة بدل قبول الافتراضي",
          "مخزن الـ idempotency: يحتاج نفس متانة بيانات العمل، وTTL أطول من أطول نافذة إعادة محاولة لدى العملاء",
          "حزم الـ SDK للعملاء: ضع توليد المعرّف داخل الـ SDK ليحصل المستدعون على أمان نمط الـ PUT دون تفكير",
          "اختبارات الحمل والفوضى: الـ methods الآمنة يمكن إعادة تشغيلها على نسخة مرآة من حركة الـ production؛ أما مسارات الكتابة فتحتاج مستأجراً اصطناعياً"
        ]
      },
      { t: "callout", kind: "tip", en: "A useful design-review question: \"if this request is delivered twice, what does the database look like?\" If the answer needs a paragraph, the endpoint needs an idempotency mechanism before it ships.", ar: "سؤال مفيد في مراجعة التصميم: «إن سُلّم هذا الـ request مرتين، فكيف تبدو قاعدة البيانات؟» إن احتاجت الإجابة فقرة كاملة، فالـ endpoint يحتاج آلية idempotency قبل إطلاقه." }
    ]},

    { key: "perf", blocks: [
      { t: "kv", rows: [
        { k: { en: "Network", ar: "الشبكة" }, v: { en: "A correctly safe GET can be served from an edge cache in 5–20 ms instead of a 40–200 ms origin round trip; one mutating GET forces Cache-Control: no-store on the whole path prefix", ar: "الـ GET الآمن فعلاً يمكن خدمته من cache على الحافة في 5–20 ملّي ثانية بدل رحلة 40–200 ملّي ثانية إلى الـ origin؛ وGET واحد يغيّر الحالة يفرض Cache-Control: no-store على بادئة المسار كلها" } },
        { k: { en: "Database", ar: "قاعدة البيانات" }, v: { en: "Every idempotency check is an extra indexed lookup on the write path — roughly 0.3–1 ms on a warm unique index, and it must be inside the write transaction", ar: "كل فحص idempotency هو بحث مفهرس إضافي على مسار الكتابة — تقريباً 0.3–1 ملّي ثانية على فهرس فريد ساخن، ويجب أن يكون داخل transaction الكتابة" } },
        { k: { en: "Latency", ar: "زمن الاستجابة" }, v: { en: "Retry-safe endpoints let you set aggressive client timeouts (p99 + 20%) because a false timeout is cheap; unsafe ones force conservative timeouts that hide real failures for seconds", ar: "الـ endpoints الآمنة لإعادة المحاولة تتيح مهلاً عدوانية عند الـ client (p99 + 20%) لأن الـ timeout الكاذب رخيص؛ أما غير الآمنة فتفرض مهلاً متحفظة تخفي الأعطال الحقيقية لثوانٍ" } },
        { k: { en: "Scalability", ar: "قابلية التوسّع" }, v: { en: "Safe reads scale on replicas and caches without coordination; every non-idempotent write pins you to the primary and to a dedup store", ar: "القراءات الآمنة تتوسّع على النسخ والـ caches بلا تنسيق؛ وكل كتابة بلا idempotency تربطك بالنسخة الأساسية وبمخزن إزالة التكرار" } },
        { k: { en: "Memory", ar: "الذاكرة" }, v: { en: "Caching the response body per idempotency key for 24 h costs key count × body size — at 1M keys/day and 2 KB bodies that is ~2 GB of retention you must plan for", ar: "تخزين جسم الاستجابة لكل idempotency key لمدة 24 ساعة يكلّف عدد المفاتيح × حجم الجسم — عند مليون مفتاح يومياً وأجسام 2 كيلوبايت فذلك ~2 غيغابايت احتفاظ يجب التخطيط له" } },
        { k: { en: "CPU", ar: "المعالج" }, v: { en: "Hashing the request body to detect key reuse with a different payload adds a hash over the payload — negligible below ~100 KB, measurable on large uploads", ar: "حساب hash لجسم الـ request لكشف إعادة استخدام مفتاح بـ payload مختلف يضيف hash على الـ payload — مهمَل تحت ~100 كيلوبايت، وملموس على الرفعات الكبيرة" } }
      ]}
    ]},

    { key: "debug", blocks: [
      { t: "ul",
        en: [
          "curl -i -X OPTIONS https://api.example.com/orders/1 and read the Allow header to see which methods the route really supports",
          "curl -i -X HEAD ... to confirm HEAD returns the same headers as GET, including Content-Length and ETag",
          "Send the same request twice with the identical Idempotency-Key and diff the two responses byte for byte; they must match, including the status code",
          "Grep access logs for GET requests that correlate with write spikes: awk '$6 == \"GET\"' access.log | sort | uniq -c | sort -rn, then cross-check against slow-write timestamps",
          "Enable EF Core command logging at Information level on a GET-only path — any INSERT/UPDATE that appears is a safety violation",
          "In Polly, log OnRetry with the request method and URI so a duplicated write is traceable to the exact policy that caused it"
        ],
        ar: [
          "curl -i -X OPTIONS https://api.example.com/orders/1 واقرأ الـ Allow header لترى أي methods يدعمها الـ route فعلاً",
          "curl -i -X HEAD ... للتأكد أن HEAD ترجع نفس headers الـ GET، بما فيها Content-Length و ETag",
          "أرسل نفس الـ request مرتين بنفس الـ Idempotency-Key وقارن الاستجابتين بايت ببايت؛ يجب أن تتطابقا بما في ذلك الـ status code",
          "ابحث في سجلات الوصول عن requests من نوع GET تتزامن مع ذُرى الكتابة: awk '$6 == \"GET\"' access.log | sort | uniq -c | sort -rn، ثم قارن بأوقات الكتابات البطيئة",
          "فعّل تسجيل أوامر EF Core على مستوى Information لمسار GET فقط — أي INSERT أو UPDATE يظهر هو مخالفة أمان",
          "في Polly، سجّل OnRetry مع method الـ request والـ URI ليصبح تتبّع أي كتابة مكررة إلى السياسة المسبِّبة لها مباشراً"
        ]
      },
      { t: "callout", kind: "tip", en: "When you suspect duplicate writes, do not start from the database. Start from the client's retry configuration and the gateway's retry policy — duplicates are almost always generated by something replaying a request, not by a race inside your handler.", ar: "حين تشك في كتابات مكررة، لا تبدأ من قاعدة البيانات. ابدأ من إعدادات إعادة المحاولة عند الـ client وسياسة إعادة المحاولة في الـ gateway — فالتكرارات يولّدها غالباً شيء يعيد إرسال الـ request، لا سباق داخل الـ handler لديك." }
    ]},

    { key: "realworld", blocks: [
      { t: "p", en: "The industries that treat method semantics as a first-class design concern are the ones where a duplicate costs money or trust directly. Everywhere else, the same rules still apply, but the failures are quieter and surface as reconciliation work rather than as incidents.", ar: "الصناعات التي تعامل دلالات الـ methods كاهتمام تصميمي من الدرجة الأولى هي التي يكلّف فيها التكرار مالاً أو ثقة مباشرة. وفي غيرها تنطبق نفس القواعد، لكن الأعطال أهدأ وتظهر كعمل تسوية لا كحوادث." },
      { t: "ul",
        en: [
          "Payment and banking APIs: an idempotency key on every write is table stakes, with a documented retention window and a defined replay response",
          "Messaging and notification platforms: at-least-once delivery means the send endpoint must dedup, or users receive the same SMS twice and the sender pays twice",
          "E-commerce checkout: order creation is the canonical PUT-with-client-id case, because a double-submitted cart is a support call and a refund",
          "Content and media platforms: read paths are aggressively cached at the edge, which only works because the read methods are honestly safe"
        ],
        ar: [
          "APIs الدفع والبنوك: مفتاح idempotency على كل كتابة هو الحد الأدنى، مع نافذة احتفاظ موثّقة واستجابة إعادة إرسال محدّدة",
          "منصات الرسائل والإشعارات: التسليم at-least-once يعني أن endpoint الإرسال يجب أن يزيل التكرار، وإلا استقبل المستخدمون نفس الرسالة مرتين ودفع المرسل مرتين",
          "الدفع في التجارة الإلكترونية: إنشاء الطلب هو الحالة النموذجية للـ PUT بمعرّف من الـ client، لأن سلة تُرسل مرتين تعني مكالمة دعم واسترداداً",
          "منصات المحتوى والوسائط: مسارات القراءة مخزّنة بقوة على الحافة، وهو ما لا ينجح إلا لأن methods القراءة آمنة بصدق"
        ]
      }
    ]},

    { key: "exercises", blocks: [
      { t: "ex", diff: "easy", en: "Take an existing controller and list every action with its method, then mark each one safe / idempotent / neither based on what it actually does to the database — not on the attribute. Fix any mismatch you find between the two columns.", ar: "خذ controller قائماً واسرد كل action مع method الخاصة به، ثم صنّف كلاً منها safe / idempotent / لا هذا ولا ذاك بناءً على ما تفعله فعلاً بقاعدة البيانات — لا بناءً على الـ attribute. وأصلح أي تعارض تجده بين العمودين." },
      { t: "ex", diff: "medium", en: "Convert a POST /orders endpoint to PUT /orders/{guid} where the client generates the id. Write an integration test that sends the identical request three times and asserts exactly one row exists and all three responses have the same body.", ar: "حوّل endpoint من POST /orders إلى PUT /orders/{guid} بحيث يولّد الـ client المعرّف. واكتب اختبار تكامل يرسل نفس الـ request ثلاث مرات ويتحقق من وجود صف واحد بالضبط ومن تطابق أجسام الاستجابات الثلاث." },
      { t: "ex", diff: "hard", en: "Implement Idempotency-Key middleware: unique constraint on (clientId, key), stored status and body, request-body hash to reject key reuse with a different payload (422), 409 while a first request with the same key is still in flight, and a 24-hour TTL. Prove atomicity with a test that kills the process between the business write and the key write.", ar: "نفّذ middleware لـ Idempotency-Key: قيد تفرّد على (clientId, key)، وتخزين الحالة والـ body، وhash لجسم الـ request لرفض إعادة استخدام مفتاح بـ payload مختلف (422)، واستجابة 409 ما دام request أول بنفس المفتاح قيد التنفيذ، وTTL مدته 24 ساعة. وأثبت الذرّية باختبار يقتل العملية بين كتابة البيانات وكتابة المفتاح." },
      { t: "ex", diff: "senior", en: "Write the retry contract for your platform: which methods are retriable, which status codes are retriable, the backoff and jitter formula, the retry budget, and how idempotency keys are minted and scoped. Then implement it as a shared HttpClient package that physically cannot retry a non-idempotent POST, and get one team to adopt it.", ar: "اكتب عقد إعادة المحاولة لمنصتك: أي methods قابلة لإعادة المحاولة، وأي status codes كذلك، ومعادلة الـ backoff والـ jitter، وميزانية إعادة المحاولة، وكيف تُصكّ مفاتيح الـ idempotency وما نطاقها. ثم نفّذه كحزمة HttpClient مشتركة يستحيل فيها فيزيائياً إعادة محاولة POST بلا idempotency، واجعل فريقاً واحداً يتبنّاها." }
    ]},

    { key: "refs", blocks: [
      { t: "ref", label: { en: "RFC 9110 §9 — Methods, safe and idempotent", ar: "RFC 9110 §9 — الـ methods والأمان والـ idempotency" }, url: "https://www.rfc-editor.org/rfc/rfc9110.html#name-methods", meta: { en: "Spec", ar: "مواصفة" } },
      { t: "ref", label: { en: "RFC 7386 — JSON Merge Patch", ar: "RFC 7386 — JSON Merge Patch" }, url: "https://www.rfc-editor.org/rfc/rfc7386.html", meta: { en: "Spec", ar: "مواصفة" } },
      { t: "ref", label: { en: "RFC 6902 — JSON Patch", ar: "RFC 6902 — JSON Patch" }, url: "https://www.rfc-editor.org/rfc/rfc6902.html", meta: { en: "Spec", ar: "مواصفة" } },
      { t: "ref", label: { en: "Routing and HTTP method constraints in ASP.NET Core", ar: "الـ routing وقيود الـ HTTP methods في ASP.NET Core" }, url: "https://learn.microsoft.com/aspnet/core/fundamentals/routing", meta: { en: "Docs", ar: "توثيق" } },
      { t: "ref", label: { en: "Implement HTTP call retries with exponential backoff (Polly)", ar: "تنفيذ إعادة محاولة استدعاءات HTTP بتراجع أسّي (Polly)" }, url: "https://learn.microsoft.com/dotnet/architecture/microservices/implement-resilient-applications/implement-http-call-retries-exponential-backoff-polly", meta: { en: "Docs", ar: "توثيق" } },
      { t: "ref", label: { en: "MDN — HTTP request methods reference", ar: "MDN — مرجع الـ HTTP request methods" }, url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods", meta: { en: "Reference", ar: "مرجع" } }
    ]}
  ],

  quiz: [
    {
      q: { en: "Which statement about DELETE is correct?", ar: "أي عبارة عن DELETE صحيحة؟" },
      options: [
        { en: "It is safe because the resource no longer exists afterwards", ar: "آمنة لأن المورد لا يعود موجوداً بعدها" },
        { en: "It is idempotent: repeating it leaves the same server state, even though the status codes differ", ar: "فيها idempotency: تكرارها يترك نفس حالة السيرفر، وإن اختلفت الـ status codes" },
        { en: "It is idempotent only if it returns 204 every time", ar: "فيها idempotency فقط إن أرجعت 204 في كل مرة" },
        { en: "It is neither safe nor idempotent", ar: "ليست آمنة ولا فيها idempotency" }
      ],
      correct: 1,
      why: { en: "Idempotency is defined over server state, not over responses. 204 then 404 is a perfectly idempotent sequence: after both calls the resource is gone, which is exactly the same state as after one call. DELETE is not safe, because it does change state.", ar: "الـ idempotency معرّفة على حالة السيرفر لا على الاستجابات. تسلسل 204 ثم 404 idempotent تماماً: بعد الاستدعاءين يكون المورد محذوفاً، وهي نفس الحالة بعد استدعاء واحد بالضبط. والـ DELETE ليست آمنة لأنها تغيّر الحالة فعلاً." }
    },
    {
      q: { en: "A client sends PATCH twice with the body { \"op\": \"add\", \"path\": \"/tags/-\", \"value\": \"urgent\" }. What happens?", ar: "يرسل client استجابة PATCH مرتين بالجسم { \"op\": \"add\", \"path\": \"/tags/-\", \"value\": \"urgent\" }. ماذا يحدث؟" },
      options: [
        { en: "Nothing on the second call — PATCH is idempotent by specification", ar: "لا شيء في الاستدعاء الثاني — الـ PATCH فيها idempotency بحسب المواصفة" },
        { en: "The tag is appended twice, because this JSON Patch operation is relative", ar: "يُضاف الـ tag مرتين، لأن عملية JSON Patch هذه نسبية" },
        { en: "The server must reject the second request with 409", ar: "يجب على السيرفر رفض الـ request الثاني بـ 409" },
        { en: "The second call replaces the whole tags array", ar: "الاستدعاء الثاني يستبدل مصفوفة الـ tags كاملة" }
      ],
      correct: 1,
      why: { en: "The 'add to end of array' operation is relative to current state, so applying it N times appends N entries. PATCH is not idempotent by definition; whether a particular PATCH is depends on the patch document format — a merge-patch setting an absolute value would be.", ar: "عملية «الإضافة إلى نهاية المصفوفة» نسبية إلى الحالة الحالية، فتطبيقها N مرة يُلحق N عنصراً. الـ PATCH ليست idempotent بالتعريف؛ وكون patch معيّن كذلك يعتمد على صيغة مستند التعديل — فمستند merge-patch يضبط قيمة مطلقة سيكون idempotent." }
    },
    {
      q: { en: "Your gateway retries every 5xx response for all methods. Which endpoint is most at risk?", ar: "الـ gateway لديك يعيد محاولة كل استجابة 5xx لجميع الـ methods. أي endpoint هو الأكثر خطراً؟" },
      options: [
        { en: "GET /reports/monthly — an expensive query", ar: "GET /reports/monthly — استعلام مكلف" },
        { en: "PUT /profiles/{id} — a full replacement", ar: "PUT /profiles/{id} — استبدال كامل" },
        { en: "POST /payments — no idempotency key", ar: "POST /payments — بلا idempotency key" },
        { en: "DELETE /sessions/{id} — session logout", ar: "DELETE /sessions/{id} — إنهاء جلسة" }
      ],
      correct: 2,
      why: { en: "GET, PUT and DELETE are idempotent, so a replay costs extra work but not extra state. POST without an idempotency mechanism is the only one where a retry after a 504 can create a second charge — and a 504 specifically means the server may well have completed the work.", ar: "الـ GET و PUT و DELETE فيها idempotency، فإعادة الإرسال تكلّف عملاً إضافياً لا حالة إضافية. أما POST بلا آلية idempotency فهو الوحيد الذي قد تنشئ فيه إعادة المحاولة بعد 504 خصماً ثانياً — والـ 504 تحديداً تعني أن السيرفر ربما أتمّ العمل فعلاً." }
    },
    {
      q: { en: "Two users edit the same document and both send an idempotent PUT. The second save silently overwrites the first. What was missing?", ar: "مستخدمان يعدّلان نفس المستند ويرسل كلاهما PUT فيه idempotency. الحفظ الثاني يطمس الأول بصمت. ما الذي كان ناقصاً؟" },
      options: [
        { en: "An Idempotency-Key header on each request", ar: "Idempotency-Key header على كل request" },
        { en: "A conditional request using If-Match with the resource ETag", ar: "request مشروط باستخدام If-Match مع ETag المورد" },
        { en: "Switching from PUT to POST", ar: "التحويل من PUT إلى POST" },
        { en: "A longer retry timeout on the client", ar: "مهلة إعادة محاولة أطول عند الـ client" }
      ],
      correct: 1,
      why: { en: "Idempotency prevents one request being applied twice; it says nothing about two different requests racing. Lost updates are solved with optimistic concurrency: the client sends If-Match with the ETag it read, and the server answers 412 when the resource has changed underneath it.", ar: "الـ idempotency تمنع تطبيق request واحد مرتين؛ ولا تقول شيئاً عن تسابق request مختلفين. الكتابات الضائعة تُحل بالتزامن التفاؤلي: يرسل الـ client الـ If-Match بالـ ETag الذي قرأه، ويرد السيرفر بـ 412 إن تغيّر المورد تحته." }
    },
    {
      q: { en: "You send POST /orders to a path that only defines a GET route. What should a correct ASP.NET Core API return?", ar: "ترسل POST /orders إلى مسار لا يعرّف إلا route من نوع GET. بماذا يجب أن يرد API صحيح في ASP.NET Core؟" },
      options: [
        { en: "404 Not Found — no matching endpoint", ar: "404 Not Found — لا يوجد endpoint مطابق" },
        { en: "400 Bad Request — the request is malformed", ar: "400 Bad Request — الـ request مشوّه" },
        { en: "405 Method Not Allowed with an Allow header listing GET", ar: "405 Method Not Allowed مع Allow header يسرد GET" },
        { en: "501 Not Implemented — the method is unsupported", ar: "501 Not Implemented — الـ method غير مدعومة" }
      ],
      correct: 2,
      why: { en: "Routing matches the path first, so the resource does exist and 404 would mislead the caller into hunting for a deployment problem. The correct answer is 405, and the Allow header is required — it tells the client exactly which methods the path supports.", ar: "الـ routing يطابق الـ path أولاً، فالمورد موجود فعلاً و404 ستضلّل المستدعي ليبحث عن مشكلة نشر. الإجابة الصحيحة 405، والـ Allow header مطلوب — فهو يخبر الـ client بالضبط أي methods يدعمها المسار." }
    }
  ]
};
```

NEXT: http-caching
