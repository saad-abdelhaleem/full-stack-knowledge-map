```js
const httpAnatomyLesson = {
  id: "http-anatomy",
  moduleId: "foundations",
  title: { en: "Anatomy of a request", ar: "تشريح الـ request" },
  summary: {
    en: "What actually travels over the socket, how a server turns those bytes into an HttpContext, and where the framing rules bite you.",
    ar: "ما الذي يسافر فعلياً عبر الـ socket، وكيف يحوّل السيرفر تلك الـ bytes إلى HttpContext، وأين تعضّك قواعد الـ framing."
  },
  mins: 14,
  sections: [
    { key: "why", blocks: [
      { t: "p", en: "HTTP is a text-framed protocol invented so that two programs that know nothing about each other can agree on where one message ends and the next begins. Everything else — methods, status codes, caching, content negotiation — is built on top of that one primitive: framing. If you do not know how the server decides that the body finished, you cannot reason about streaming, about proxies, about request smuggling, or about why your upload hangs at 30 seconds.", ar: "الـ HTTP بروتوكول مؤطَّر نصياً، اخترع ليتفق برنامجان لا يعرف أحدهما الآخر على أين تنتهي رسالة وأين تبدأ التالية. كل ما عداه — الـ methods والـ status codes والـ caching والـ content negotiation — مبني فوق تلك البدائية الواحدة: الـ framing. إن لم تعرف كيف يقرر السيرفر أن الـ body قد انتهى، فلن تستطيع التفكير في الـ streaming ولا الـ proxies ولا الـ request smuggling ولا سبب تعليق رفع الملف عند الثانية الثلاثين." },
      { t: "p", en: "The second reason to care is that almost every production incident that looks like \"the framework is broken\" is actually a layer below the framework: a header the proxy rewrote, a body that was already consumed, a connection the load balancer closed at 60 seconds while your origin was still writing at 75. The controller action is the last 5% of the request's life; the other 95% happens in the socket, the TLS layer, the reverse proxy, and the server's parser.", ar: "السبب الثاني للاهتمام أن معظم حوادث الـ production التي تبدو وكأن «الـ framework معطّل» تحدث فعلياً في طبقة تحت الـ framework: header أعاد الـ proxy كتابته، أو body استُهلك مرة واحدة بالفعل، أو connection أغلقه الـ load balancer عند الثانية 60 بينما السيرفر ما زال يكتب حتى 75. الـ controller action هو آخر 5% من عمر الـ request؛ الـ 95% الباقية تحدث في الـ socket وطبقة الـ TLS والـ reverse proxy وparser السيرفر." },
      { t: "p", en: "A senior engineer should be able to type a raw request into a socket by hand and predict, byte for byte, what comes back. That skill is what turns a vague \"it returns 400 sometimes\" into \"the client is sending a header line longer than 8 KB and Kestrel rejects it before any of our code runs\".", ar: "المهندس الـ senior يجب أن يستطيع كتابة request خام يدوياً داخل socket ويتوقع، بايت ببايت، ما سيعود. هذه المهارة هي ما يحوّل «أحياناً يرجع 400» الغامضة إلى «الـ client يرسل header line أطول من 8 KB وKestrel يرفضه قبل أن يعمل أي سطر من كودنا»." },
      { t: "callout", kind: "note", en: "HTTP/1.1, HTTP/2 and HTTP/3 share the same semantics (RFC 9110) but have completely different framing. \"The request\" you debug in the browser is a semantic view; the bytes on the wire differ radically between versions.", ar: "الـ HTTP/1.1 و HTTP/2 و HTTP/3 تتشارك نفس الـ semantics (RFC 9110) لكن الـ framing مختلف تماماً. «الـ request» الذي تراه في المتصفح هو عرض دلالي؛ أما الـ bytes على السلك فتختلف جذرياً بين الإصدارات." }
    ]},

    { key: "problem", blocks: [
      { t: "p", en: "Before persistent connections, every request paid for a full TCP handshake plus a TLS handshake. On a 40 ms RTT link that is 1 RTT for TCP and 2 RTT for TLS 1.2 — about 120 ms of pure setup before a single application byte moves. For an API call whose server-side work is 8 ms, 94% of the latency is connection setup.", ar: "قبل الـ persistent connections، كل request كان يدفع ثمن TCP handshake كامل بالإضافة إلى TLS handshake. على وصلة بـ RTT = 40 ملّي ثانية، هذا يعني 1 RTT للـ TCP و2 RTT للـ TLS 1.2 — أي ~120 ملّي ثانية إعداد خالص قبل أن يتحرك بايت واحد من التطبيق. لـ API call عمله على السيرفر 8 ملّي ثانية، فإن 94% من زمن الاستجابة إعداد اتصال." },
      { t: "p", en: "Keep-alive fixed the handshake cost but exposed a new one: header bloat. A typical authenticated browser request carries 700–900 bytes of headers (cookies, user-agent, accept-*, auth token). At 10,000 requests/second that is roughly 8 MB/s of inbound headers per node, repeated identically on every request, plus the CPU to parse them. HTTP/2's HPACK table compresses a repeated header set down to tens of bytes after the first request on a connection.", ar: "الـ keep-alive حلّ تكلفة الـ handshake لكنه كشف تكلفة أخرى: تضخّم الـ headers. الـ request المعتاد لمتصفح مُصادَق يحمل 700–900 بايت من الـ headers (cookies، user-agent، accept-*، auth token). عند 10,000 request/ثانية يعني ذلك ~8 ميغابايت/ثانية من الـ headers الواردة لكل node، مكررة حرفياً في كل request، إضافة إلى الـ CPU اللازم لتحليلها. جدول HPACK في HTTP/2 يضغط مجموعة headers مكررة إلى عشرات البايتات فقط بعد أول request على الاتصال." },
      { t: "kv", rows: [
        { k: { en: "New connection per request (TLS 1.2, 40 ms RTT)", ar: "اتصال جديد لكل request (TLS 1.2، RTT=40 مللي)" }, v: { en: "~120 ms setup + 8 ms work ≈ 128 ms end to end", ar: "~120 مللي إعداد + 8 مللي عمل ≈ 128 مللي من الطرف للطرف" } },
        { k: { en: "Keep-alive, HTTP/1.1", ar: "keep-alive، HTTP/1.1" }, v: { en: "~0 ms setup + 8 ms work ≈ 48 ms with one round trip; ~800 B headers per request", ar: "~0 مللي إعداد + 8 مللي عمل ≈ 48 مللي مع round trip واحد؛ ~800 بايت headers لكل request" } },
        { k: { en: "HTTP/2 on the same connection", ar: "HTTP/2 على نفس الاتصال" }, v: { en: "Headers ~40–80 B after HPACK; many requests multiplexed without head-of-line blocking at the HTTP layer", ar: "الـ headers ~40–80 بايت بعد HPACK؛ requests كثيرة متعددة الإرسال دون head-of-line blocking على طبقة الـ HTTP" } },
        { k: { en: "Kestrel parse cost", ar: "تكلفة التحليل في Kestrel" }, v: { en: "Request line + 15 headers parsed from pooled buffers with zero string allocation until a header is read", ar: "سطر الـ request + 15 header يُحلَّلون من buffers مجمّعة بدون تخصيص string حتى تُقرأ قيمة header فعلياً" } }
      ]}
    ]},

    { key: "internals", blocks: [
      { t: "p", en: "An HTTP/1.1 message is: a start line, zero or more header field lines, a CRLF that terminates the header block, and an optional body. Every line ends with CRLF (0x0D 0x0A). The parser is a state machine over a byte stream; it does not know anything about your routes until the header block is complete.", ar: "رسالة HTTP/1.1 تتكوّن من: سطر بداية، ثم صفر أو أكثر من أسطر الـ header fields، ثم CRLF ينهي كتلة الـ headers، ثم body اختياري. كل سطر ينتهي بـ CRLF (0x0D 0x0A). الـ parser عبارة عن state machine فوق تدفق bytes؛ ولا يعرف شيئاً عن الـ routes حتى تكتمل كتلة الـ headers." },
      { t: "code", lang: "http", label: { en: "The literal bytes of a request", ar: "الـ bytes الحرفية للـ request" }, code: "POST /api/orders?expand=items HTTP/1.1\\r\\n\nHost: api.example.com\\r\\n\nContent-Type: application/json\\r\\n\nContent-Length: 27\\r\\n\nAuthorization: Bearer eyJhbGciOi...\\r\\n\nAccept: application/json\\r\\n\n\\r\\n\n{\"sku\":\"A-100\",\"qty\":2}" },
      { t: "p", en: "The server knows where the body ends by exactly one of three rules, checked in this order: (1) a Transfer-Encoding: chunked header, in which case the body is a sequence of hex-length-prefixed chunks terminated by a zero-length chunk; (2) a Content-Length header giving an exact byte count; (3) neither, which for a request means there is no body at all. A request that sends both Content-Length and Transfer-Encoding is malformed — disagreement between a proxy and an origin about which one wins is the entire basis of request smuggling attacks, which is why RFC 9112 requires rejecting such messages.", ar: "السيرفر يعرف أين ينتهي الـ body بواحدة من ثلاث قواعد فقط، تُفحص بهذا الترتيب: (1) وجود Transfer-Encoding: chunked، فيكون الـ body سلسلة chunks مسبوقة بطول hexadecimal وتنتهي بـ chunk طوله صفر؛ (2) وجود Content-Length يعطي عدد bytes دقيق؛ (3) لا هذا ولا ذاك، وفي الـ request يعني عدم وجود body إطلاقاً. الـ request الذي يرسل Content-Length و Transfer-Encoding معاً مشوّه — واختلاف الـ proxy عن الـ origin حول أيهما يفوز هو أساس هجمات request smuggling، ولهذا يوجب RFC 9112 رفض مثل هذه الرسائل." },
      { t: "code", lang: "http", label: { en: "A chunked body on the wire", ar: "body مقسّم إلى chunks على السلك" }, code: "POST /api/upload HTTP/1.1\\r\\n\nHost: api.example.com\\r\\n\nTransfer-Encoding: chunked\\r\\n\n\\r\\n\n1a\\r\\n\n<26 bytes of payload>\\r\\n\n9\\r\\n\n<9 bytes of payload>\\r\\n\n0\\r\\n\n\\r\\n" },
      { t: "p", en: "In ASP.NET Core, Kestrel accepts the socket, then reads into a System.IO.Pipelines PipeReader backed by pooled memory. The parser scans the pooled buffer for CRLF using vectorized search, slices the request line into method / target / version without allocating, and stores header name-value pairs as slices. Well-known header names hit a precomputed lookup so that \"Content-Length\" never becomes a string. Only when your code reads `Request.Headers[\"X\"]` does a string materialize. This is why Kestrel can parse hundreds of thousands of requests per second per core.", ar: "في ASP.NET Core يقبل Kestrel الـ socket، ثم يقرأ إلى PipeReader من System.IO.Pipelines مدعوم بذاكرة مجمّعة (pooled). الـ parser يمسح الـ buffer بحثاً عن CRLF باستخدام بحث vectorized، ويقطع سطر الـ request إلى method / target / version دون تخصيص، ويخزّن أزواج الـ headers كشرائح (slices). أسماء الـ headers المعروفة تصطدم بجدول بحث مُسبق الحساب بحيث لا تتحوّل \"Content-Length\" إلى string أبداً. فقط عندما يقرأ كودك `Request.Headers[\"X\"]` يتجسّد الـ string. لهذا يستطيع Kestrel تحليل مئات الآلاف من الـ requests في الثانية لكل core." },
      { t: "p", en: "Once the header block is parsed, Kestrel builds an HttpContext (pooled and reset between requests, not newly allocated) and hands it to the middleware pipeline. The body is deliberately *not* read: `HttpRequest.Body` is a forward-only, non-seekable stream that streams bytes off the socket on demand. That is why reading it twice fails, and why `EnableBuffering()` exists — it wraps the stream in one that spills to memory (30 KB by default) and then to a temp file on disk.", ar: "بعد تحليل كتلة الـ headers يبني Kestrel كائن HttpContext (مجمّع ويُعاد ضبطه بين الـ requests، لا يُخصَّص من جديد) ويسلّمه إلى الـ middleware pipeline. أما الـ body فلا يُقرأ عمداً: `HttpRequest.Body` هو stream أحادي الاتجاه غير قابل للـ seek يسحب الـ bytes من الـ socket عند الطلب. لهذا تفشل قراءته مرتين، ولهذا وُجد `EnableBuffering()` — فهو يغلّف الـ stream بآخر يخزّن في الذاكرة (30 كيلوبايت افتراضياً) ثم في ملف مؤقت على القرص." },
      { t: "kv", rows: [
        { k: { en: "MaxRequestLineSize", ar: "MaxRequestLineSize" }, v: { en: "8 KB default — a very long query string is rejected with 414 before routing", ar: "8 كيلوبايت افتراضياً — الـ query string الطويل جداً يُرفض بـ 414 قبل الـ routing" } },
        { k: { en: "MaxRequestHeadersTotalSize", ar: "MaxRequestHeadersTotalSize" }, v: { en: "32 KB default — oversized cookies produce 431, and your code never runs", ar: "32 كيلوبايت افتراضياً — الـ cookies الضخمة تنتج 431 ولا يعمل كودك أبداً" } },
        { k: { en: "MaxRequestBodySize", ar: "MaxRequestBodySize" }, v: { en: "~30 MB default; enforced lazily as the body is read, so the 413 can surface mid-handler", ar: "~30 ميغابايت افتراضياً؛ يُطبَّق أثناء قراءة الـ body، لذا قد يظهر الـ 413 في منتصف الـ handler" } },
        { k: { en: "RequestHeadersTimeout", ar: "RequestHeadersTimeout" }, v: { en: "30 s to finish sending headers — the built-in defence against Slowloris", ar: "30 ثانية لإنهاء إرسال الـ headers — الدفاع المدمج ضد Slowloris" } },
        { k: { en: "KeepAliveTimeout", ar: "KeepAliveTimeout" }, v: { en: "~130 s idle before Kestrel closes an otherwise healthy connection", ar: "~130 ثانية خمول قبل أن يغلق Kestrel اتصالاً سليماً" } },
        { k: { en: "MinRequestBodyDataRate", ar: "MinRequestBodyDataRate" }, v: { en: "240 bytes/s with a 5 s grace period — slow uploaders are dropped, which looks like a random client disconnect", ar: "240 بايت/ثانية مع مهلة سماح 5 ثوانٍ — الرافعون البطيئون يُقطعون، وهو ما يبدو كانقطاع عشوائي من الـ client" } }
      ]},
      { t: "p", en: "HTTP/2 keeps these semantics but replaces the text framing with binary frames on a single connection: HEADERS frames carrying an HPACK-compressed header block, then DATA frames, each tagged with a stream id. Header names are lowercase by design, the request line is split into pseudo-headers (:method, :path, :scheme, :authority), and Transfer-Encoding does not exist because DATA frames are already self-delimiting.", ar: "الـ HTTP/2 يحافظ على نفس الـ semantics لكنه يستبدل الـ framing النصي بـ frames ثنائية على اتصال واحد: frames من نوع HEADERS تحمل كتلة headers مضغوطة بـ HPACK، ثم frames من نوع DATA، كل منها موسوم بـ stream id. أسماء الـ headers صغيرة الحروف بالتصميم، وسطر الـ request يُقسَّم إلى pseudo-headers (:method, :path, :scheme, :authority)، ولا وجود لـ Transfer-Encoding لأن frames الـ DATA محدّدة الطول بذاتها." }
    ]},

    { key: "tradeoffs", blocks: [
      { t: "tradeoff",
        pros: {
          en: [
            "Text framing is trivially debuggable — curl, telnet and a log file are enough",
            "Self-describing messages let intermediaries cache, route and inspect without app knowledge",
            "Stateless framing means any node can serve any request",
            "Chunked encoding allows streaming a response of unknown length"
          ],
          ar: [
            "الـ framing النصي سهل التشخيص — curl و telnet وملف log تكفي",
            "الرسائل ذاتية الوصف تتيح للوسطاء الـ caching والتوجيه والفحص دون معرفة بالتطبيق",
            "الـ framing عديم الحالة يعني أن أي node يخدم أي request",
            "الـ chunked encoding يسمح ببث response مجهول الطول"
          ]
        },
        cons: {
          en: [
            "Headers are repeated verbatim on every HTTP/1.1 request — pure overhead at high rps",
            "Parsing text is far more CPU-expensive than a binary length-prefixed protocol",
            "Ambiguous framing rules created a whole attack class (request smuggling)",
            "One connection = one in-flight request in HTTP/1.1; pipelining never worked in practice"
          ],
          ar: [
            "الـ headers تتكرر حرفياً في كل request على HTTP/1.1 — عبء خالص عند معدلات عالية",
            "تحليل النص أغلى على الـ CPU بكثير من بروتوكول ثنائي مسبوق بالطول",
            "غموض قواعد الـ framing أنشأ فئة هجمات كاملة (request smuggling)",
            "اتصال واحد = request واحد قيد التنفيذ في HTTP/1.1؛ والـ pipelining لم ينجح عملياً"
          ]
        },
        limits: {
          en: [
            "The request body can be read exactly once unless you explicitly buffer it",
            "Header size limits are enforced before any of your middleware runs",
            "Trailers exist in the spec but are poorly supported outside gRPC",
            "You cannot change status code or headers after the first response byte is flushed"
          ],
          ar: [
            "الـ request body يُقرأ مرة واحدة فقط ما لم تُفعّل الـ buffering صراحة",
            "حدود حجم الـ headers تُطبَّق قبل تشغيل أي middleware لديك",
            "الـ trailers موجودة في المواصفة لكن دعمها ضعيف خارج gRPC",
            "لا يمكنك تغيير الـ status code أو الـ headers بعد إرسال أول بايت من الـ response"
          ]
        },
        alts: {
          en: [
            "HTTP/2 — binary frames, HPACK, multiplexed streams over one TCP connection",
            "HTTP/3 over QUIC — removes TCP-level head-of-line blocking",
            "gRPC — HTTP/2 plus protobuf, for internal service-to-service calls",
            "WebSockets / SSE — when the interaction is a long-lived stream, not a request/response"
          ],
          ar: [
            "HTTP/2 — frames ثنائية وHPACK وstreams متعددة على اتصال TCP واحد",
            "HTTP/3 فوق QUIC — يزيل الـ head-of-line blocking على مستوى TCP",
            "gRPC — HTTP/2 مع protobuf، للاستدعاءات الداخلية بين الخدمات",
            "WebSockets / SSE — حين يكون التفاعل تدفقاً طويل العمر لا request/response"
          ]
        }
      }
    ]},

    { key: "mistakes", blocks: [
      { t: "mistake",
        title: { en: "Reading the request body twice", ar: "قراءة الـ request body مرتين" },
        body: { en: "An audit middleware reads Request.Body to log the payload, then the model binder finds an empty stream and every property binds to null. In test the payload is 200 bytes and someone had left a StreamReader with leaveOpen, so it 'worked'; in production a 4 KB payload silently deserializes to an empty object and orders are created with quantity 0.", ar: "middleware للتدقيق يقرأ Request.Body لتسجيل الـ payload، ثم يجد الـ model binder الـ stream فارغاً فتُربط كل الخصائص إلى null. في بيئة الاختبار كان الـ payload 200 بايت وترك أحدهم StreamReader بـ leaveOpen فبدا أنه «يعمل»؛ وفي الـ production يتحوّل payload بحجم 4 كيلوبايت بصمت إلى كائن فارغ فتُنشأ طلبات بكمية 0." },
        fix: "app.Use(async (ctx, next) =>\n{\n    ctx.Request.EnableBuffering();\n    using var reader = new StreamReader(ctx.Request.Body, leaveOpen: true);\n    var body = await reader.ReadToEndAsync();\n    ctx.Request.Body.Position = 0;\n    await next();\n});" },
      { t: "mistake",
        title: { en: "Building absolute URLs from the Host header", ar: "بناء URLs مطلقة من الـ Host header" },
        body: { en: "Password-reset links are generated as $\"https://{Request.Host}/reset?token=...\". An attacker sends Host: evil.test, receives the mail on behalf of a victim, and the link ships the reset token to their own server. Host is attacker-controlled input; it is only trustworthy if the reverse proxy overwrites it and you configure allowed hosts.", ar: "روابط إعادة تعيين كلمة المرور تُبنى بـ $\"https://{Request.Host}/reset?token=...\". يرسل مهاجم Host: evil.test فيصل البريد نيابة عن ضحية، ويحمل الرابط الـ reset token إلى سيرفره هو. الـ Host مدخل يتحكم فيه المهاجم؛ ولا يُوثق به إلا إذا كتبه الـ reverse proxy فوقه وضبطت أنت قائمة الـ allowed hosts." },
        fix: "// appsettings.json\n\"AllowedHosts\": \"api.example.com;www.example.com\"\n// and build links from a configured PublicBaseUrl option, not Request.Host" },
      { t: "mistake",
        title: { en: "Trusting X-Forwarded-For without ForwardedHeaders", ar: "الثقة في X-Forwarded-For دون ForwardedHeaders" },
        body: { en: "Rate limiting keys on the raw X-Forwarded-For header. A client sends its own value and gets an unlimited quota per fabricated IP; meanwhile audit logs record whatever the attacker typed. Without UseForwardedHeaders (and a KnownProxies list) RemoteIpAddress is the proxy's IP and the header is unvalidated user input.", ar: "الـ rate limiting يعتمد على قيمة X-Forwarded-For الخام. يرسل الـ client قيمته بنفسه فيحصل على حصة غير محدودة لكل IP مزيّف؛ وفي الوقت نفسه تسجّل سجلات التدقيق ما كتبه المهاجم. بدون UseForwardedHeaders (وقائمة KnownProxies) يكون RemoteIpAddress هو IP الـ proxy ويظل الـ header مدخلاً غير موثوق." },
        fix: "builder.Services.Configure<ForwardedHeadersOptions>(o =>\n{\n    o.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;\n    o.KnownProxies.Add(IPAddress.Parse(\"10.0.0.7\"));\n});\napp.UseForwardedHeaders();" },
      { t: "mistake",
        title: { en: "Assuming Content-Length is always present", ar: "افتراض وجود Content-Length دائماً" },
        body: { en: "An upload endpoint pre-allocates a byte[] of Request.ContentLength.Value. A client streaming with Transfer-Encoding: chunked sends no Content-Length, ContentLength is null, and the endpoint throws InvalidOperationException — a 500 for a perfectly legal request. The mirror image is worse: allocating a 200 MB array because the client claimed 200 MB." , ar: "endpoint للرفع يخصّص مسبقاً byte[] بحجم Request.ContentLength.Value. الـ client الذي يبث بـ Transfer-Encoding: chunked لا يرسل Content-Length، فتكون ContentLength تساوي null ويُرمى InvalidOperationException — أي 500 لـ request قانوني تماماً. والحالة المعاكسة أسوأ: تخصيص مصفوفة 200 ميغابايت لأن الـ client ادّعى 200 ميغابايت." },
        fix: "await using var fs = File.Create(path);\nawait Request.Body.CopyToAsync(fs, ct); // stream it; never trust the declared length" },
      { t: "mistake",
        title: { en: "Writing headers after the response has started", ar: "كتابة headers بعد بدء إرسال الـ response" },
        body: { en: "An exception filter tries to set StatusCode = 500 after the action already wrote 8 KB of JSON. Kestrel flushed the status line the moment the first buffer filled, so the assignment throws and the client receives a 200 with a truncated, invalid JSON body — the worst possible failure, because clients parse it as success.", ar: "exception filter يحاول ضبط StatusCode = 500 بعد أن كتب الـ action بالفعل 8 كيلوبايت من الـ JSON. Kestrel أرسل سطر الحالة لحظة امتلاء أول buffer، فيُرمى استثناء عند الإسناد ويستقبل الـ client استجابة 200 بجسم JSON مبتور غير صالح — وهو أسوأ فشل ممكن لأن العملاء يفسّرونه نجاحاً." },
        fix: "if (!context.Response.HasStarted)\n    context.Response.StatusCode = StatusCodes.Status500InternalServerError;" },
      { t: "mistake",
        title: { en: "Ignoring RequestAborted", ar: "تجاهل RequestAborted" },
        body: { en: "A search endpoint runs a 6-second query. The user hits refresh three times; the first two connections are already closed but the server keeps all three queries running because no CancellationToken was passed down. Under a refresh storm the database sees 3× the load it should, and the extra work is guaranteed to be thrown away.", ar: "endpoint بحث ينفّذ استعلاماً مدته 6 ثوانٍ. يضغط المستخدم تحديث ثلاث مرات؛ الاتصالان الأولان أُغلقا بالفعل لكن السيرفر يُبقي الاستعلامات الثلاثة تعمل لأن الـ CancellationToken لم يُمرَّر للأسفل. تحت عاصفة تحديث ترى قاعدة البيانات ثلاثة أضعاف الحمل الواجب، والعمل الزائد مصيره الإهمال حتماً." },
        fix: "public async Task<IResult> Search(string q, CancellationToken ct)\n    => Results.Ok(await _repo.SearchAsync(q, ct));" }
    ]},

    { key: "interview", blocks: [
      { t: "qa", level: "junior",
        q: { en: "What are the parts of an HTTP request message?", ar: "ما مكوّنات رسالة الـ HTTP request؟" },
        a: { en: "A request line (method, request target, HTTP version), a block of header field lines, an empty CRLF line marking the end of headers, and an optional body. In HTTP/2 the same information is carried as pseudo-headers plus HEADERS and DATA frames rather than text lines.", ar: "سطر request (method وrequest target وإصدار HTTP)، ثم كتلة من أسطر الـ header fields، ثم سطر CRLF فارغ يعلّم نهاية الـ headers، ثم body اختياري. في HTTP/2 تُنقل نفس المعلومات كـ pseudo-headers مع frames من نوع HEADERS و DATA بدلاً من أسطر نصية." } },
      { t: "qa", level: "junior",
        q: { en: "Why is the Host header mandatory in HTTP/1.1?", ar: "لماذا الـ Host header إلزامي في HTTP/1.1؟" },
        a: { en: "Because one IP address serves many sites. The request target is usually just a path, so the server needs Host to pick the virtual host, the certificate binding and the routing table. Without it the server cannot know which of fifty applications you meant, and must answer 400.", ar: "لأن عنوان IP واحداً يخدم مواقع كثيرة. الـ request target غالباً مجرد path، فيحتاج السيرفر الـ Host ليختار الـ virtual host وربط الشهادة وجدول التوجيه. بدونه لا يعرف السيرفر أياً من خمسين تطبيقاً تقصد، فيجب أن يرد بـ 400." } },
      { t: "qa", level: "mid",
        q: { en: "How does the server know the request body has ended?", ar: "كيف يعرف السيرفر أن الـ request body قد انتهى؟" },
        a: { en: "Exactly one of: Transfer-Encoding: chunked, where a zero-length chunk terminates the body; a Content-Length header giving a byte count; or neither, meaning no body. Sending both is malformed and must be rejected, because a proxy and an origin that disagree about precedence is precisely how request smuggling works.", ar: "بواحدة فقط من: Transfer-Encoding: chunked حيث يُنهي chunk بطول صفر الـ body؛ أو Content-Length يعطي عدد bytes؛ أو لا شيء منهما، ما يعني عدم وجود body. إرسال الاثنين معاً مشوّه ويجب رفضه، لأن اختلاف الـ proxy والـ origin حول الأولوية هو بالضبط آلية عمل request smuggling." } },
      { t: "qa", level: "mid",
        q: { en: "Your endpoint returns 400 for some clients but the breakpoint in your controller never hits. Where do you look?", ar: "الـ endpoint يرجع 400 لبعض العملاء لكن نقطة التوقف في الـ controller لا تُصاب أبداً. أين تبحث؟" },
        a: { en: "Below the framework. The server rejected the message during parsing: a request line over 8 KB (414), headers over 32 KB total, usually a bloated cookie (431), an invalid header character, or a malformed chunked body. Reproduce with curl -v against the origin directly to see whether the proxy or Kestrel produced the response, then check Kestrel's limits and the proxy's own header size caps.", ar: "تحت الـ framework. السيرفر رفض الرسالة أثناء التحليل: سطر request يتجاوز 8 كيلوبايت (414)، أو headers مجموعها فوق 32 كيلوبايت وغالباً cookie متضخم (431)، أو محرف غير صالح في header، أو body chunked مشوّه. أعد الإنتاج بـ curl -v ضد الـ origin مباشرة لتعرف هل الـ proxy أم Kestrel هو من ردّ، ثم راجع حدود Kestrel وحدود حجم الـ headers في الـ proxy." } },
      { t: "qa", level: "mid",
        q: { en: "Why can you not read Request.Body twice, and what does EnableBuffering change?", ar: "لماذا لا تستطيع قراءة Request.Body مرتين، وما الذي يغيّره EnableBuffering؟" },
        a: { en: "Body is a forward-only, non-seekable stream reading directly off the socket; consumed bytes are gone. EnableBuffering wraps it in a stream that retains what it reads — in memory up to a threshold (30 KB by default), then spilling to a temp file — and makes it seekable, so you can reset Position to 0. The cost is real: on a 10 MB upload you now pay disk I/O and a temp file for every request, so buffer selectively, not globally.", ar: "الـ Body هو stream أحادي الاتجاه غير قابل للـ seek يقرأ مباشرة من الـ socket؛ والـ bytes المستهلكة تختفي. الـ EnableBuffering يغلّفه بـ stream يحتفظ بما يقرؤه — في الذاكرة حتى عتبة معينة (30 كيلوبايت افتراضياً) ثم ينسكب إلى ملف مؤقت — ويجعله قابلاً للـ seek فتستطيع إعادة Position إلى 0. والتكلفة حقيقية: مع رفع 10 ميغابايت تدفع الآن disk I/O وملفاً مؤقتاً لكل request، لذا فعّل الـ buffering انتقائياً لا عالمياً." } },
      { t: "qa", level: "senior",
        q: { en: "What actually changes when you move an internal API from HTTP/1.1 to HTTP/2?", ar: "ما الذي يتغيّر فعلياً عند نقل API داخلي من HTTP/1.1 إلى HTTP/2؟" },
        a: { en: "Semantics stay identical; framing and connection economics change. You get multiplexed streams on one TCP connection, HPACK header compression, mandatory lowercase header names, pseudo-headers instead of a request line, and no Transfer-Encoding. What you also get is fewer connections — which is a problem if you sit behind an L4 load balancer, because all traffic from one client now pins to one backend and connection-count-based balancing stops working. And TCP-level head-of-line blocking still exists: one lost packet stalls every stream on that connection, which is exactly what HTTP/3 over QUIC fixes.", ar: "الـ semantics تبقى كما هي؛ ما يتغيّر هو الـ framing واقتصاديات الاتصال. تحصل على streams متعددة على اتصال TCP واحد، وضغط headers بـ HPACK، وأسماء headers صغيرة الحروف إلزامياً، وpseudo-headers بدل سطر الـ request، وبلا Transfer-Encoding. وتحصل أيضاً على عدد اتصالات أقل — وهذه مشكلة إن كنت خلف load balancer من الطبقة الرابعة، لأن كل حركة الـ client تلتصق الآن بـ backend واحد ويتوقف التوزيع المبني على عدد الاتصالات عن العمل. كما أن head-of-line blocking على مستوى TCP ما زال قائماً: فقدان packet واحد يوقف كل الـ streams على ذلك الاتصال، وهو تحديداً ما يعالجه HTTP/3 فوق QUIC." } },
      { t: "qa", level: "senior",
        q: { en: "Requests to one endpoint intermittently fail with a client-side 'connection reset'. Server logs show nothing. Explain a plausible mechanism.", ar: "requests إلى endpoint واحد تفشل متقطعاً بـ «connection reset» عند الـ client، وسجلات السيرفر لا تظهر شيئاً. اشرح آلية محتملة." },
        a: { en: "Idle-timeout race on a pooled keep-alive connection. The client picks a connection from its pool at the same instant the server (or an intermediate NAT/idle-timeout, often 60–350 s) decides it is idle and closes it. The client's request lands on a half-closed socket and gets a reset before any server-side request object exists — hence no log line. Fixes: keep the client's connection lifetime shorter than the server's KeepAliveTimeout (PooledConnectionIdleTimeout on SocketsHttpHandler), and make idempotent requests retry once on a transport-level failure.", ar: "سباق مهلة الخمول على اتصال keep-alive من الـ pool. يختار الـ client اتصالاً من الـ pool في نفس اللحظة التي يقرر فيها السيرفر (أو NAT وسيط بمهلة خمول 60–350 ثانية غالباً) أنه خامل فيغلقه. فيهبط الـ request على socket نصف مغلق ويحصل على reset قبل وجود أي كائن request على السيرفر — ولذلك لا يوجد سطر log. الحل: اجعل عمر الاتصال عند الـ client أقصر من KeepAliveTimeout في السيرفر (PooledConnectionIdleTimeout في SocketsHttpHandler)، واجعل الـ requests الـ idempotent تعيد المحاولة مرة واحدة عند فشل على مستوى النقل." } },
      { t: "qa", level: "staff",
        q: { en: "Three teams each hand-roll header handling — correlation IDs, forwarded headers, size limits — and each gets it subtly wrong. How do you fix this structurally?", ar: "ثلاثة فرق يكتب كل منها معالجة الـ headers يدوياً — correlation IDs، forwarded headers، حدود الحجم — وكل منها يخطئ بشكل دقيق. كيف تعالج ذلك هيكلياً؟" },
        a: { en: "Move the concern out of application code entirely. Terminate the HTTP edge in one place — a gateway or an ingress layer that overwrites Host and X-Forwarded-*, strips client-supplied correlation headers and mints its own, and enforces body and header limits — so no service can be lied to. Then ship a single internal package that wires the standard middleware in a fixed order and fails startup if a service configures forwarded headers itself. Complement it with a conformance test suite every service runs in CI (oversized cookie, chunked body, double Content-Length, spoofed X-Forwarded-For) so the contract is verified, not documented. The measure of success is that a new service gets this right with zero HTTP knowledge, and the number of places that can get it wrong is one.", ar: "أخرِج الاهتمام من كود التطبيق كلياً. أنهِ حافة الـ HTTP في مكان واحد — gateway أو طبقة ingress تكتب فوق الـ Host و X-Forwarded-* وتحذف correlation headers القادمة من العميل وتصكّ واحداً خاصاً بها وتفرض حدود الـ body والـ headers — بحيث لا يمكن الكذب على أي خدمة. ثم أصدر حزمة داخلية واحدة تركّب الـ middleware القياسي بترتيب ثابت وتُفشل الإقلاع إذا ضبطت خدمة الـ forwarded headers بنفسها. وأكمل ذلك بمجموعة اختبارات مطابقة تشغّلها كل خدمة في الـ CI (cookie ضخم، body مقسّم، Content-Length مكرر، X-Forwarded-For مزيّف) ليصبح العقد مُتحقَّقاً منه لا موثّقاً فقط. مقياس النجاح أن تحصل خدمة جديدة على السلوك الصحيح بصفر معرفة بالـ HTTP، وأن يصبح عدد الأماكن التي يمكن أن تخطئ فيها واحداً." } }
    ]},

    { key: "codereview", blocks: [
      { t: "review", severity: "high",
        title: { en: "Consuming the body in middleware", ar: "استهلاك الـ body داخل middleware" },
        bad: "app.Use(async (ctx, next) =>\n{\n    var body = await new StreamReader(ctx.Request.Body).ReadToEndAsync();\n    _logger.LogInformation(\"Payload: {Body}\", body);\n    await next();\n});",
        good: "app.Use(async (ctx, next) =>\n{\n    if (ctx.Request.ContentLength is > 0 and < 32_768)\n    {\n        ctx.Request.EnableBuffering();\n        using var reader = new StreamReader(ctx.Request.Body, leaveOpen: true);\n        _logger.LogDebug(\"Payload: {Body}\", await reader.ReadToEndAsync());\n        ctx.Request.Body.Position = 0;\n    }\n    await next();\n});",
        why: { en: "The bad version disposes the request stream and leaves nothing for the model binder, so every downstream DTO binds to null while returning 200. It also logs unbounded payloads — a 50 MB upload becomes a 50 MB log line and likely an LOH allocation. The good version buffers only small bodies, rewinds the stream, keeps it open, and logs at Debug so production log volume does not explode.", ar: "النسخة السيئة تتخلّص من stream الـ request ولا تترك شيئاً للـ model binder، فتُربط كل الـ DTOs في الأسفل إلى null بينما تُرجع 200. كما تسجّل payloads بلا حدّ — رفع 50 ميغابايت يتحوّل إلى سطر log بحجم 50 ميغابايت وعلى الأرجح تخصيص على الـ LOH. النسخة الجيدة تخزّن الأجسام الصغيرة فقط، وتعيد لفّ الـ stream، وتبقيه مفتوحاً، وتسجّل على مستوى Debug حتى لا ينفجر حجم الـ logs في الـ production." },
      },
      { t: "review", severity: "medium",
        title: { en: "Hand-parsing a header instead of using the typed accessor", ar: "تحليل header يدوياً بدل استخدام الـ accessor المُنمَّط" },
        bad: "var auth = ctx.Request.Headers[\"Authorization\"].ToString();\nvar token = auth.Split(\" \")[1];\nvar lang = ctx.Request.Headers[\"Accept-Language\"].ToString().Split(\",\")[0];",
        good: "if (!AuthenticationHeaderValue.TryParse(ctx.Request.Headers.Authorization, out var auth)\n    || !string.Equals(auth.Scheme, \"Bearer\", StringComparison.OrdinalIgnoreCase)\n    || string.IsNullOrEmpty(auth.Parameter))\n{\n    return Results.Unauthorized();\n}\n\nvar lang = ctx.Request.GetTypedHeaders()\n                      .AcceptLanguage\n                      .OrderByDescending(x => x.Quality ?? 1)\n                      .FirstOrDefault()?.Value.Value;",
        why: { en: "A missing Authorization header makes Split(\" \")[1] throw IndexOutOfRangeException — a 500 where the correct answer is 401, and an unauthenticated caller can trigger it at will. The Accept-Language line ignores q-values entirely, so a client sending 'en;q=0.2, ar;q=0.9' is served English. Typed header accessors handle absence, duplicates, casing and quality ordering, and they read from the parsed slices rather than allocating new strings on every request.", ar: "غياب الـ Authorization header يجعل Split(\" \")[1] يرمي IndexOutOfRangeException — أي 500 حيث الإجابة الصحيحة 401، ويستطيع متصل غير مُصادَق إطلاقه متى شاء. وسطر الـ Accept-Language يتجاهل قيم الـ q تماماً، فالـ client الذي يرسل 'en;q=0.2, ar;q=0.9' يُخدم بالإنجليزية. الـ accessors المُنمَّطة تعالج الغياب والتكرار وحالة الأحرف وترتيب الجودة، وتقرأ من الشرائح المحلَّلة بدل تخصيص strings جديدة في كل request." }
      }
    ]},

    { key: "sysdesign", blocks: [
      { t: "p", en: "Request anatomy is what makes intermediaries possible. A CDN, an L7 load balancer, an API gateway and a WAF all work by reading the first few hundred bytes of a request — method, path, Host, a handful of headers — and making a routing or caching decision without understanding the application at all. Every design where you say 'the gateway will handle that' rests on the request being self-describing at the front.", ar: "تشريح الـ request هو ما يجعل الوسطاء ممكنين. الـ CDN والـ load balancer من الطبقة السابعة والـ API gateway والـ WAF جميعها تعمل بقراءة أول بضع مئات من bytes الـ request — الـ method والـ path والـ Host وحفنة headers — واتخاذ قرار توجيه أو caching دون أي فهم للتطبيق. كل تصميم تقول فيه «الـ gateway سيتولى ذلك» يستند إلى كون الـ request ذاتي الوصف من مقدمته." },
      { t: "p", en: "It also determines where a boundary can exist. You can only put a cache in front of an endpoint if the cache key is derivable from the request line plus a declared Vary set. You can only stream a large export if the framing supports unknown length. And you can only fail over mid-flight if the request is idempotent and small enough to replay — all properties of the message, not of your code.", ar: "كما أنه يحدد أين يمكن أن يوجد حدّ. لا تستطيع وضع cache أمام endpoint إلا إذا كان مفتاح الـ cache مشتقاً من سطر الـ request مع مجموعة Vary معلنة. ولا تستطيع بثّ تصدير ضخم إلا إذا دعم الـ framing طولاً مجهولاً. ولا تستطيع التحويل إلى نسخة أخرى أثناء الطيران إلا إذا كان الـ request مثالياً (idempotent) وصغيراً بما يكفي لإعادة إرساله — وكلها خصائص للرسالة لا لكودك." },
      { t: "ul",
        en: [
          "Edge routing: path and Host prefixes decide which service cluster a request reaches, before authentication",
          "Trust boundary: the gateway rewrites Host and X-Forwarded-*, so downstream services can treat them as trusted",
          "Timeout budget: each hop must set a timeout shorter than its caller's, or the client gives up while three tiers keep working",
          "Body size policy: enforce the maximum at the edge, so a 2 GB upload never reaches an application thread",
          "Streaming endpoints: exports and log tails need chunked or HTTP/2 DATA framing, plus a proxy configured not to buffer the whole response"
        ],
        ar: [
          "التوجيه عند الحافة: بادئات الـ path والـ Host تقرر أي مجموعة خدمات يصلها الـ request، قبل المصادقة",
          "حدّ الثقة: الـ gateway يعيد كتابة الـ Host و X-Forwarded-*، فتستطيع الخدمات في الأسفل اعتبارها موثوقة",
          "ميزانية المهل: كل قفزة يجب أن تضبط مهلة أقصر من مهلة مستدعيها، وإلا استسلم الـ client بينما تواصل ثلاث طبقات العمل",
          "سياسة حجم الـ body: افرض الحد الأقصى عند الحافة، فلا يصل رفع بحجم 2 غيغابايت إلى thread في التطبيق أبداً",
          "نقاط الـ streaming: التصدير ومتابعة الـ logs تحتاج chunked أو DATA framing في HTTP/2، مع proxy مضبوط ألا يخزّن الاستجابة كاملة"
        ]
      },
      { t: "callout", kind: "warn", en: "Any header a client can send, a client will send. Treat every inbound header as untrusted input unless a proxy you control overwrites it — and make that overwrite explicit in the proxy config, not an assumption in a wiki page.", ar: "أي header يستطيع الـ client إرساله سيرسله فعلاً. عامل كل header وارد كمدخل غير موثوق ما لم يكتب فوقه proxy تتحكم فيه — واجعل تلك الكتابة صريحة في إعدادات الـ proxy لا افتراضاً في صفحة wiki." }
    ]},

    { key: "perf", blocks: [
      { t: "kv", rows: [
        { k: { en: "Memory", ar: "الذاكرة" }, v: { en: "Kestrel parses from pooled buffers with no string allocation until a header is read; EnableBuffering reverses that by copying up to 30 KB per request to memory and beyond that to a temp file", ar: "Kestrel يحلّل من buffers مجمّعة دون تخصيص string حتى تُقرأ قيمة header؛ والـ EnableBuffering يعكس ذلك بنسخ حتى 30 كيلوبايت لكل request إلى الذاكرة وما زاد إلى ملف مؤقت" } },
        { k: { en: "CPU", ar: "المعالج" }, v: { en: "Text parsing is the dominant per-request cost at high rps; header count matters more than header size, since each field is a separate scan and lookup", ar: "تحليل النص هو التكلفة الغالبة لكل request عند المعدلات العالية؛ وعدد الـ headers أهم من حجمها لأن كل حقل مسح وبحث مستقل" } },
        { k: { en: "Network", ar: "الشبكة" }, v: { en: "~800 B of headers repeated on every HTTP/1.1 request ≈ 8 MB/s inbound at 10k rps; HPACK cuts this to tens of bytes after the first request on a connection", ar: "~800 بايت headers مكررة في كل request على HTTP/1.1 ≈ 8 ميغابايت/ثانية واردة عند 10 آلاف request/ثانية؛ وHPACK يخفضها إلى عشرات البايتات بعد أول request على الاتصال" } },
        { k: { en: "Latency", ar: "زمن الاستجابة" }, v: { en: "Connection setup dominates short requests: ~1 RTT TCP + 1–2 RTT TLS. Reusing a pooled connection removes 80–120 ms on a 40 ms RTT link", ar: "إعداد الاتصال يهيمن على الـ requests القصيرة: ~1 RTT للـ TCP + 1–2 RTT للـ TLS. إعادة استخدام اتصال من الـ pool تحذف 80–120 ملّي ثانية على وصلة RTT=40" } },
        { k: { en: "Scalability", ar: "قابلية التوسّع" }, v: { en: "Concurrency is bounded by connections and sockets, not CPU; HTTP/2 multiplexing raises the ceiling per connection but concentrates a client's load on one backend", ar: "التزامن محكوم بعدد الاتصالات والـ sockets لا بالـ CPU؛ وتعدد الإرسال في HTTP/2 يرفع السقف لكل اتصال لكنه يركّز حمل الـ client على backend واحد" } },
        { k: { en: "Disk", ar: "القرص" }, v: { en: "Multipart uploads and buffered bodies above the memory threshold hit the temp directory — a silent per-request disk write that shows up as latency variance, not CPU", ar: "رفع الملفات multipart والأجسام المخزّنة فوق عتبة الذاكرة تصل إلى مجلد الملفات المؤقتة — كتابة قرص صامتة لكل request تظهر كتذبذب في زمن الاستجابة لا كحمل CPU" } }
      ]}
    ]},

    { key: "debug", blocks: [
      { t: "ul",
        en: [
          "curl -v --http1.1 https://api.example.com/orders — shows the exact request line, headers sent, and the raw response status line",
          "curl --trace-ascii - to dump every byte in both directions, including chunk headers, when you suspect a framing problem",
          "printf 'GET / HTTP/1.1\\r\\nHost: x\\r\\n\\r\\n' | nc host 80 — hand-craft a raw request to prove whether the origin or a proxy produced a 400",
          "dotnet-trace collect --providers Microsoft-AspNetCore-Server-Kestrel to see connection start/stop and request start/stop events with timings",
          "Browser DevTools → Network → Timing, to separate DNS, TLS, 'waiting (TTFB)' and 'content download' rather than blaming the server for all of it",
          "Wireshark or tcpdump -A -s0 'port 80' when TLS is terminated upstream and you need to see what the proxy actually forwarded"
        ],
        ar: [
          "curl -v --http1.1 https://api.example.com/orders — يعرض سطر الـ request بدقة والـ headers المرسلة وسطر حالة الاستجابة الخام",
          "curl --trace-ascii - لطباعة كل بايت في الاتجاهين، بما فيها ترويسات الـ chunks، عند الشك في مشكلة framing",
          "printf 'GET / HTTP/1.1\\r\\nHost: x\\r\\n\\r\\n' | nc host 80 — اصنع request خاماً يدوياً لتثبت هل الـ origin أم الـ proxy هو من أنتج الـ 400",
          "dotnet-trace collect --providers Microsoft-AspNetCore-Server-Kestrel لرؤية أحداث بدء/إنهاء الاتصال وبدء/إنهاء الـ request مع أزمنتها",
          "أدوات المتصفح ← Network ← Timing، للفصل بين DNS و TLS و«الانتظار (TTFB)» و«تنزيل المحتوى» بدل تحميل السيرفر المسؤولية كاملة",
          "Wireshark أو tcpdump -A -s0 'port 80' حين يُنهى الـ TLS في الأعلى وتحتاج رؤية ما مرّره الـ proxy فعلاً"
        ]
      },
      { t: "callout", kind: "tip", en: "When a request fails only in production, reproduce it against the origin directly, bypassing the proxy. If the origin answers correctly, the bug is a header the proxy added, dropped or rewrote — compare the two header sets side by side before touching application code.", ar: "حين يفشل request في الـ production فقط، أعد إنتاجه ضد الـ origin مباشرة متجاوزاً الـ proxy. إن ردّ الـ origin بشكل صحيح، فالعطل header أضافه الـ proxy أو حذفه أو أعاد كتابته — قارن مجموعتَي الـ headers جنباً إلى جنب قبل لمس كود التطبيق." }
    ]},

    { key: "realworld", blocks: [
      { t: "p", en: "Wherever a request crosses an organizational boundary, someone is making a decision from the first few hundred bytes of it. Edge platforms route on Host and path; payment providers require an idempotency header on the request line's sibling fields; streaming APIs depend on chunked framing to send a response whose length nobody knows yet. These are not exotic cases — they are the ordinary shape of production traffic.", ar: "أينما عبر request حدّاً تنظيمياً، يتخذ أحدهم قراراً من أول بضع مئات من bytes منه. منصات الحافة توجّه اعتماداً على الـ Host والـ path؛ ومزودو الدفع يشترطون header للـ idempotency؛ وAPIs البث تعتمد على الـ chunked framing لإرسال استجابة لا يعرف أحد طولها بعد. هذه ليست حالات نادرة — بل هي الشكل المعتاد لحركة الـ production." },
      { t: "ul",
        en: [
          "Payment platforms: an Idempotency-Key header on the request is the only thing standing between a retry and a double charge",
          "Media and content delivery: CDNs serve from cache using only the method, path and Vary headers, never touching the origin",
          "Chat and collaboration tools: long-lived connections upgraded from an ordinary HTTP request via Upgrade / :protocol negotiation",
          "Data and reporting platforms: multi-gigabyte exports streamed with chunked framing because the row count is unknown when the response starts"
        ],
        ar: [
          "منصات الدفع: header الـ Idempotency-Key على الـ request هو الشيء الوحيد الفاصل بين إعادة محاولة وخصم مزدوج",
          "توصيل الوسائط والمحتوى: شبكات الـ CDN تخدم من الـ cache معتمدة على الـ method والـ path وheaders الـ Vary فقط، دون لمس الـ origin",
          "أدوات المحادثة والتعاون: اتصالات طويلة العمر تُرقّى من request عادي عبر التفاوض بـ Upgrade / :protocol",
          "منصات البيانات والتقارير: تصديرات بحجم غيغابايتات تُبثّ بـ chunked framing لأن عدد الصفوف مجهول لحظة بدء الاستجابة"
        ]
      }
    ]},

    { key: "exercises", blocks: [
      { t: "ex", diff: "easy", en: "Using nc or telnet, hand-type a raw GET request (request line, Host header, blank line) against a local ASP.NET Core app and read the raw response. Then repeat it omitting the Host header and record exactly what the server returns.", ar: "باستخدام nc أو telnet، اكتب يدوياً request خاماً من نوع GET (سطر الـ request، وHost header، وسطر فارغ) ضد تطبيق ASP.NET Core محلي واقرأ الاستجابة الخام. ثم كرّر المحاولة بحذف الـ Host header وسجّل بدقة ما يرجعه السيرفر." },
      { t: "ex", diff: "medium", en: "Write a middleware that logs method, path, request byte count and elapsed milliseconds without breaking model binding. Prove it with an integration test that POSTs a 5 KB JSON body and asserts the bound DTO is fully populated.", ar: "اكتب middleware يسجّل الـ method والـ path وعدد bytes الـ request والزمن المنقضي بالمللي ثانية دون كسر الـ model binding. أثبت ذلك باختبار تكامل يرسل POST بجسم JSON حجمه 5 كيلوبايت ويتحقق أن الـ DTO المربوط مكتمل تماماً." },
      { t: "ex", diff: "hard", en: "Build an endpoint that accepts an upload streamed with Transfer-Encoding: chunked (no Content-Length), writes it to disk without buffering the whole body in memory, honours RequestAborted, and returns 413 when the stream exceeds 10 MB. Verify with curl -T - and confirm memory stays flat for a 500 MB upload.", ar: "ابنِ endpoint يقبل رفعاً مبثوثاً بـ Transfer-Encoding: chunked (بلا Content-Length)، ويكتبه إلى القرص دون تخزين الـ body كاملاً في الذاكرة، ويحترم RequestAborted، ويرجع 413 عند تجاوز الـ stream حدّ 10 ميغابايت. تحقق بـ curl -T - وأكّد أن استهلاك الذاكرة يبقى ثابتاً مع رفع 500 ميغابايت." },
      { t: "ex", diff: "senior", en: "Write a one-page HTTP edge contract for your services: which headers the gateway overwrites, which inbound headers are stripped, the maximum body and header sizes, the timeout budget per hop, and the correlation-ID policy. Then write three failing conformance tests (oversized cookie, double Content-Length, spoofed X-Forwarded-For) and make one existing service pass them.", ar: "اكتب صفحة واحدة تمثّل عقد حافة الـ HTTP لخدماتك: أي headers يكتب الـ gateway فوقها، وأي headers واردة تُحذف، والحد الأقصى لحجم الـ body والـ headers، وميزانية المهل لكل قفزة، وسياسة الـ correlation ID. ثم اكتب ثلاثة اختبارات مطابقة فاشلة (cookie ضخم، Content-Length مكرر، X-Forwarded-For مزيّف) واجعل خدمة قائمة واحدة تجتازها." }
    ]},

    { key: "refs", blocks: [
      { t: "ref", label: { en: "RFC 9110 — HTTP Semantics", ar: "RFC 9110 — دلالات الـ HTTP" }, url: "https://www.rfc-editor.org/rfc/rfc9110.html", meta: { en: "Spec", ar: "مواصفة" } },
      { t: "ref", label: { en: "RFC 9112 — HTTP/1.1 message framing", ar: "RFC 9112 — تأطير رسائل HTTP/1.1" }, url: "https://www.rfc-editor.org/rfc/rfc9112.html", meta: { en: "Spec", ar: "مواصفة" } },
      { t: "ref", label: { en: "RFC 9113 — HTTP/2", ar: "RFC 9113 — HTTP/2" }, url: "https://www.rfc-editor.org/rfc/rfc9113.html", meta: { en: "Spec", ar: "مواصفة" } },
      { t: "ref", label: { en: "Kestrel configuration options and limits", ar: "خيارات وحدود إعداد Kestrel" }, url: "https://learn.microsoft.com/aspnet/core/fundamentals/servers/kestrel/options", meta: { en: "Docs", ar: "توثيق" } },
      { t: "ref", label: { en: "ASP.NET Core middleware pipeline", ar: "خط الـ middleware في ASP.NET Core" }, url: "https://learn.microsoft.com/aspnet/core/fundamentals/middleware/", meta: { en: "Docs", ar: "توثيق" } },
      { t: "ref", label: { en: "System.IO.Pipelines — high-performance I/O", ar: "System.IO.Pipelines — إدخال/إخراج عالي الأداء" }, url: "https://learn.microsoft.com/dotnet/standard/io/pipelines", meta: { en: "Docs", ar: "توثيق" } }
    ]}
  ],

  quiz: [
    {
      q: { en: "A request arrives with both Content-Length: 40 and Transfer-Encoding: chunked. What should a conforming server do?", ar: "يصل request يحمل Content-Length: 40 و Transfer-Encoding: chunked معاً. ما الذي يجب أن يفعله سيرفر مطابق للمواصفة؟" },
      options: [
        { en: "Use Content-Length and ignore Transfer-Encoding", ar: "يستخدم Content-Length ويتجاهل Transfer-Encoding" },
        { en: "Reject the message as malformed", ar: "يرفض الرسالة باعتبارها مشوّهة" },
        { en: "Read whichever produces the larger body", ar: "يقرأ أيهما ينتج body أكبر" },
        { en: "Buffer the body and let the application decide", ar: "يخزّن الـ body ويترك القرار للتطبيق" }
      ],
      correct: 1,
      why: { en: "The combination is ambiguous, and a proxy and origin that resolve it differently is exactly the request smuggling primitive. RFC 9112 requires rejecting such messages rather than picking a winner.", ar: "الجمع بينهما غامض، واختلاف الـ proxy عن الـ origin في حلّه هو بالضبط أساس هجوم request smuggling. يوجب RFC 9112 رفض هذه الرسائل بدلاً من ترجيح أحدهما." }
    },
    {
      q: { en: "A logging middleware reads Request.Body, then the controller receives a DTO with all properties null. Why?", ar: "middleware للتسجيل يقرأ Request.Body، ثم يستقبل الـ controller كائن DTO بكل خصائصه null. لماذا؟" },
      options: [
        { en: "The JSON serializer needs an explicit content type", ar: "الـ JSON serializer يحتاج content type صريحاً" },
        { en: "Middleware runs after model binding, so ordering is wrong", ar: "الـ middleware يعمل بعد الـ model binding، فالترتيب خاطئ" },
        { en: "Request.Body is forward-only and was already consumed", ar: "الـ Request.Body أحادي الاتجاه واستُهلك بالفعل" },
        { en: "The DTO is missing a parameterless constructor", ar: "الـ DTO ينقصه constructor بلا معاملات" }
      ],
      correct: 2,
      why: { en: "The body streams off the socket once. Once the middleware read it to the end, the model binder sees an empty stream. EnableBuffering plus resetting Position to 0 is the fix.", ar: "الـ body يُبثّ من الـ socket مرة واحدة. بعد أن قرأه الـ middleware حتى النهاية يجد الـ model binder stream فارغاً. الحل هو EnableBuffering مع إعادة Position إلى 0." }
    },
    {
      q: { en: "Clients get 431 responses and your controller breakpoint never hits. What is the most likely cause?", ar: "العملاء يتلقّون استجابات 431 ونقطة التوقف في الـ controller لا تُصاب أبداً. ما السبب الأرجح؟" },
      options: [
        { en: "Authentication middleware short-circuits the pipeline", ar: "middleware المصادقة يقطع المسار مبكراً" },
        { en: "The total header block exceeds the server's limit, so parsing fails before your code runs", ar: "مجموع كتلة الـ headers يتجاوز حد السيرفر، فيفشل التحليل قبل تشغيل كودك" },
        { en: "The route template does not match the request path", ar: "قالب الـ route لا يطابق مسار الـ request" },
        { en: "The request body is larger than MaxRequestBodySize", ar: "حجم الـ request body أكبر من MaxRequestBodySize" }
      ],
      correct: 1,
      why: { en: "431 is emitted by the server's parser when the header block (32 KB by default in Kestrel) is exceeded — usually an oversized cookie. The rejection happens before an HttpContext reaches the pipeline, so no application code executes and no route is evaluated.", ar: "الـ 431 يصدر من parser السيرفر عند تجاوز كتلة الـ headers (32 كيلوبايت افتراضياً في Kestrel) — وغالباً بسبب cookie متضخم. يحدث الرفض قبل وصول HttpContext إلى الـ pipeline، فلا يعمل أي كود تطبيقي ولا يُقيَّم أي route." }
    },
    {
      q: { en: "Why is generating a password-reset link from Request.Host a security bug?", ar: "لماذا يُعدّ توليد رابط إعادة تعيين كلمة المرور من Request.Host ثغرة أمنية؟" },
      options: [
        { en: "Request.Host omits the port, breaking non-standard deployments", ar: "الـ Request.Host يحذف رقم المنفذ فيكسر النشر غير القياسي" },
        { en: "Host is client-controlled input, so an attacker can point the link at their own domain", ar: "الـ Host مدخل يتحكم فيه الـ client، فيستطيع مهاجم توجيه الرابط إلى نطاقه" },
        { en: "Request.Host is null under HTTP/2 because there is no Host header", ar: "الـ Request.Host يساوي null على HTTP/2 لعدم وجود Host header" },
        { en: "It forces an extra DNS lookup per request", ar: "يفرض استعلام DNS إضافياً لكل request" }
      ],
      correct: 1,
      why: { en: "Host is sent by the caller and is only trustworthy when a proxy you control overwrites it and allowed-hosts filtering is configured. Otherwise the reset token is delivered to an attacker-chosen origin. (HTTP/2 carries the same value as the :authority pseudo-header, so option 3 is wrong too.)", ar: "الـ Host يرسله المتصل ولا يُوثق به إلا إذا كتب فوقه proxy تتحكم فيه وضُبط تصفية الـ allowed hosts. وإلا يُسلَّم الـ reset token إلى نطاق يختاره المهاجم. (وفي HTTP/2 تُنقل نفس القيمة في pseudo-header اسمه :authority، فالخيار الثالث خاطئ أيضاً.)" }
    },
    {
      q: { en: "After moving an internal API from HTTP/1.1 to HTTP/2, one backend node receives far more traffic than the others. What is the most likely explanation?", ar: "بعد نقل API داخلي من HTTP/1.1 إلى HTTP/2، بدأ node واحد يستقبل حركة أكثر بكثير من غيره. ما التفسير الأرجح؟" },
      options: [
        { en: "HPACK compression makes some requests cheaper to route", ar: "ضغط HPACK يجعل توجيه بعض الـ requests أرخص" },
        { en: "HTTP/2 multiplexes many requests onto one connection, so connection-based L4 balancing pins a client to one node", ar: "الـ HTTP/2 يعدّد الـ requests على اتصال واحد، فيثبّت التوزيع على الطبقة الرابعة القائم على الاتصالات كل client على node واحد" },
        { en: "HTTP/2 requires sticky sessions by specification", ar: "الـ HTTP/2 يوجب sticky sessions بحسب المواصفة" },
        { en: "Pseudo-headers bypass the load balancer's routing table", ar: "الـ pseudo-headers تتجاوز جدول توجيه الـ load balancer" }
      ],
      correct: 1,
      why: { en: "An L4 balancer distributes connections, not requests. Under HTTP/1.1 a busy client opened many connections and spread naturally; under HTTP/2 it opens one long-lived connection carrying all its streams, so every request lands on the same backend. The fix is an L7 balancer that distributes per stream, or bounding connection lifetime so clients periodically rebalance.", ar: "الـ load balancer من الطبقة الرابعة يوزّع الاتصالات لا الـ requests. تحت HTTP/1.1 كان الـ client المزدحم يفتح اتصالات كثيرة فيتوزّع طبيعياً؛ أما تحت HTTP/2 فيفتح اتصالاً واحداً طويل العمر يحمل كل streams، فتهبط كل الـ requests على نفس الـ backend. الحل هو موازن من الطبقة السابعة يوزّع لكل stream، أو تحديد عمر الاتصال ليعيد العملاء التوازن دورياً." }
    }
  ]
};
```
