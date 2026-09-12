```js
const httpAnatomyLesson = {
  id: "http-anatomy",
  moduleId: "foundations",
  title: { en: "Anatomy of a request", ar: "تشريح الـ request" },
  summary: {
    en: "What an HTTP request and response are made of, byte by byte, and what ASP.NET Core does with those bytes before your handler runs.",
    ar: "مما يتكوّن الـ HTTP request والـ response، بايت ببايت، وماذا يفعل ASP.NET Core بهذه البايتات قبل أن يعمل الـ handler الخاص بك."
  },
  mins: 14,
  sections: [
    { key: "why", blocks: [
      { t: "p",
        en: "An HTTP request is a block of text your client sends to a server, and the response is the text that comes back. That is the whole protocol. Knowing the exact parts of that text is what lets you explain a 400 you did not expect, or why a header you set was ignored.",
        ar: "الـ HTTP request هو كتلة نصية يرسلها الـ client إلى الـ server، والـ response هو النص الذي يعود. هذا هو البروتوكول كله. معرفة الأجزاء الدقيقة لهذا النص هي ما يجعلك تفسّر خطأ 400 لم تتوقعه، أو تفهم لماذا تم تجاهل header وضعته." },
      { t: "kv", rows: [
        { k: { en: "TCP connection", ar: "TCP connection" },
          v: { en: "A two-way pipe of bytes between two machines. All the HTTP text travels inside it, in order.", ar: "أنبوب bytes ثنائي الاتجاه بين جهازين. كل نص الـ HTTP يمرّ داخله، بالترتيب." } },
        { k: { en: "Request line", ar: "Request line" },
          v: { en: "The first line of a request: method, path, protocol version. Example: GET /api/orders/1042 HTTP/1.1", ar: "أول سطر في الـ request: الـ method ثم الـ path ثم نسخة البروتوكول. مثال: GET /api/orders/1042 HTTP/1.1" } },
        { k: { en: "Header", ar: "Header" },
          v: { en: "One line shaped Name: value that carries information about the message — who sent it, what format the body is in, how long the body is.", ar: "سطر واحد بشكل Name: value يحمل معلومات عن الرسالة — من أرسلها، وما صيغة الـ body، وكم طوله." } },
        { k: { en: "Body", ar: "Body" },
          v: { en: "The optional bytes that come after the headers. A POST usually carries JSON here. A GET usually carries nothing.", ar: "الـ bytes الاختيارية التي تأتي بعد الـ headers. الـ POST عادةً يحمل JSON هنا، والـ GET عادةً لا يحمل شيئاً." } },
        { k: { en: "Status line", ar: "Status line" },
          v: { en: "The first line of a response: version, a three-digit code, a short text reason. Example: HTTP/1.1 200 OK", ar: "أول سطر في الـ response: النسخة، ثم كود من ثلاثة أرقام، ثم نص قصير. مثال: HTTP/1.1 200 OK" } },
        { k: { en: "Middleware", ar: "Middleware" },
          v: { en: "A piece of code in ASP.NET Core that sees every request in a fixed order, may change it, and decides whether to pass it to the next piece.", ar: "قطعة كود في ASP.NET Core ترى كل request بترتيب ثابت، ويمكنها تعديله، وتقرر هل تمرّره للقطعة التالية أم لا." } }
      ]},
      { t: "p",
        en: "Think of a paper form in an envelope. The address written on the envelope is the request line: where it goes and what you want done there. The sticky notes on the front are the headers: what language you read, what format the form inside is in, who you are. The form inside the envelope is the body. The server opens the envelope, reads the notes, then reads the form.",
        ar: "تخيّل استمارة ورقية داخل ظرف. العنوان المكتوب على الظرف هو الـ request line: إلى أين يذهب وماذا تريد أن يحدث هناك. الملاحظات الملصقة على الوجه هي الـ headers: بأي لغة تقرأ، وما صيغة الاستمارة بالداخل، ومن أنت. الاستمارة داخل الظرف هي الـ body. الـ server يفتح الظرف، ويقرأ الملاحظات، ثم يقرأ الاستمارة." },
      { t: "p",
        en: "HTTP was designed this way because two programs that have never met need one agreed format. A phone app written in Swift and a server written in C# share nothing except this text layout. Every rule in HTTP exists so the receiver can work out, from the bytes alone, where the headers stop, where the body starts, and where the body ends.",
        ar: "صُمّم الـ HTTP بهذا الشكل لأن برنامجين لم يتعارفا أبداً يحتاجان صيغة واحدة متفق عليها. تطبيق هاتف مكتوب بـ Swift و server مكتوب بـ C# لا يشتركان في شيء إلا هذا الترتيب النصي. كل قاعدة في الـ HTTP موجودة لكي يستطيع المستقبِل أن يعرف، من الـ bytes وحدها، أين تنتهي الـ headers، وأين يبدأ الـ body، وأين ينتهي." },
      { t: "callout", kind: "note",
        en: "HTTP/1.1 is plain text you can read with your eyes. HTTP/2 and HTTP/3 send exactly the same information as compressed binary frames. The parts do not change — still a method, a path, headers, a body. Only the encoding on the wire changes, so everything in this lesson still applies.",
        ar: "الـ HTTP/1.1 نص عادي تستطيع قراءته بعينك. أما HTTP/2 و HTTP/3 فيرسلان نفس المعلومات تماماً على شكل binary frames مضغوطة. الأجزاء لا تتغيّر — ما زال هناك method و path و headers و body. الذي يتغيّر هو طريقة الترميز على الشبكة فقط، لذلك كل ما في هذا الدرس يبقى صحيحاً." }
    ]},

    { key: "problem", blocks: [
      { t: "p",
        en: "Here is the running example for this lesson. A mobile app calls GET /api/orders/1042 on an ASP.NET Core service. Locally it returns 200 with the order. In production the same call returns 404. Nothing in the C# code differs between the two.",
        ar: "هذا هو المثال الذي سنتابعه في الدرس كله. تطبيق موبايل ينادي GET /api/orders/1042 على خدمة ASP.NET Core. محلياً يرجع 200 مع بيانات الـ order. في الإنتاج نفس النداء يرجع 404. ولا يوجد أي اختلاف في كود C# بين الحالتين." },
      { t: "p",
        en: "The team spent two days on it — three engineers, so about forty-eight working hours. They re-read the routing code, added logs inside the controller, and redeployed nine times. The controller logs never printed, which they read as a routing bug. The fix took five minutes once someone logged the raw request line that the server actually received.",
        ar: "قضى الفريق يومين على المشكلة — ثلاثة مهندسين، أي حوالي ثمانٍ وأربعين ساعة عمل. أعادوا قراءة كود الـ routing، وأضافوا logs داخل الـ controller، وأعادوا النشر تسع مرات. الـ logs داخل الـ controller لم تُطبع أبداً، ففسّروا ذلك على أنه خطأ في الـ routing. الإصلاح استغرق خمس دقائق بعدما سجّل أحدهم الـ request line الخام الذي وصل الـ server فعلاً." },
      { t: "kv", rows: [
        { k: { en: "What the app sent", ar: "ما أرسله التطبيق" },
          v: { en: "GET /api/orders/1042 HTTP/1.1 — the path the mobile client wrote.", ar: "GET /api/orders/1042 HTTP/1.1 — الـ path الذي كتبه الـ client." } },
        { k: { en: "What nginx forwarded", ar: "ما مرّره nginx" },
          v: { en: "GET /orders/1042 HTTP/1.1 — the reverse proxy in front of the service was configured to strip the /api prefix. A reverse proxy is a server that receives requests and passes them on to another server.", ar: "GET /orders/1042 HTTP/1.1 — الـ reverse proxy الموجود أمام الخدمة كان مضبوطاً ليحذف البادئة /api. والـ reverse proxy هو server يستقبل الـ requests ويمرّرها إلى server آخر." } },
        { k: { en: "What the app routed", ar: "ما طابقه الـ routing" },
          v: { en: "Nothing. The endpoint is registered as /api/orders/{id}, so /orders/1042 matched no route and ASP.NET Core answered 404 before any controller ran.", ar: "لا شيء. الـ endpoint مسجّل كـ /api/orders/{id}، لذلك /orders/1042 لم يطابق أي route وأجاب ASP.NET Core بـ 404 قبل أن يعمل أي controller." } },
        { k: { en: "Why logs were silent", ar: "لماذا كانت الـ logs صامتة" },
          v: { en: "The controller was never reached, so logs written inside it could not print. Logging one level lower — at the request line — showed the answer immediately.", ar: "لم يتم الوصول إلى الـ controller أصلاً، فالـ logs المكتوبة بداخله لا يمكن أن تُطبع. التسجيل على مستوى أدنى — عند الـ request line — أظهر الجواب فوراً." } }
      ]},
      { t: "p",
        en: "The lesson is not about nginx. It is that a request is a concrete object with named parts, and each hop on the way can rewrite those parts. If you cannot say what the method, path, and headers looked like at the moment your code received them, you are guessing.",
        ar: "الدرس ليس عن nginx. الدرس هو أن الـ request كائن ملموس له أجزاء معروفة بالاسم، وكل محطة في الطريق تستطيع تعديل هذه الأجزاء. إن لم تستطع أن تقول كيف كان شكل الـ method والـ path والـ headers لحظة وصولها إلى كودك، فأنت تخمّن." }
    ]},

    { key: "internals", blocks: [
      { t: "p",
        en: "Follow one call to GET /api/orders/1042 from the socket up to your handler. A socket is the operating system object that represents one open network connection. Before any HTTP text exists, the client resolves the hostname to an IP address using DNS, opens a TCP connection to that address on port 443, and completes a TLS handshake so the bytes are encrypted. Only then does it write the request text into the connection.",
        ar: "تابع نداءً واحداً لـ GET /api/orders/1042 من الـ socket حتى الـ handler. الـ socket هو كائن نظام التشغيل الذي يمثّل اتصالاً شبكياً مفتوحاً واحداً. قبل وجود أي نص HTTP، يحوّل الـ client اسم النطاق إلى IP address عبر الـ DNS، ثم يفتح TCP connection إلى هذا العنوان على المنفذ 443، ثم ينهي TLS handshake حتى تكون الـ bytes مشفّرة. بعد ذلك فقط يكتب نص الـ request داخل الاتصال." },
      { t: "code", lang: "http", label: { en: "The exact bytes on the wire (\\r\\n shown as line breaks)", ar: "الـ bytes الفعلية على الشبكة (\\r\\n معروضة كأسطر)" },
        code: "GET /api/orders/1042 HTTP/1.1\nHost: api.shop.example\nAccept: application/json\nAuthorization: Bearer eyJhbGciOi...\nUser-Agent: ShopApp/3.2 (iOS 17)\n\nHTTP/1.1 200 OK\nContent-Type: application/json; charset=utf-8\nContent-Length: 84\nDate: Mon, 06 Apr 2026 09:14:02 GMT\n\n{\"id\":1042,\"status\":\"Shipped\",\"total\":149.50,\"placedAt\":\"2026-04-01T10:22:00Z\"}" },
      { t: "p",
        en: "Every line ends with the two characters carriage-return and line-feed, written \\r\\n. The header section ends with one empty line, which is \\r\\n\\r\\n. That empty line is the only marker that says headers are finished. After it, the server counts exactly Content-Length bytes to read the body, or, if the header Transfer-Encoding: chunked is present instead, reads a series of size-prefixed chunks until a zero-size chunk arrives. A GET like ours has no body, so there is nothing after the blank line.",
        ar: "كل سطر ينتهي بالحرفين carriage-return و line-feed، ويُكتبان \\r\\n. وقسم الـ headers ينتهي بسطر فارغ واحد، أي \\r\\n\\r\\n. هذا السطر الفارغ هو العلامة الوحيدة التي تقول إن الـ headers انتهت. بعده يقرأ الـ server عدد bytes مساوياً تماماً لقيمة Content-Length، أو — إذا وُجد بدلاً منه الـ header المسمّى Transfer-Encoding: chunked — يقرأ سلسلة قطع كل واحدة مسبوقة بحجمها حتى تصل قطعة حجمها صفر. الـ GET في مثالنا بلا body، فلا يوجد شيء بعد السطر الفارغ." },
      { t: "p",
        en: "Kestrel — the web server built into ASP.NET Core — is the code that reads those bytes. It parses the request line, then each header, and stops at the blank line. It does not read the body yet; it leaves the body as an unread stream so that a large upload does not have to sit in memory. It then fills an HttpContext object, which is simply a C# object holding the parsed request, a writable response, and per-request state.",
        ar: "الـ Kestrel — وهو الـ web server المدمج في ASP.NET Core — هو الكود الذي يقرأ هذه الـ bytes. يحلّل الـ request line ثم كل header، ويتوقف عند السطر الفارغ. ولا يقرأ الـ body بعد؛ بل يتركه stream غير مقروء حتى لا يضطر ملف كبير للبقاء في الذاكرة. ثم يملأ كائن HttpContext، وهو ببساطة كائن C# يحمل الـ request بعد تحليله، و response قابلاً للكتابة، وحالة خاصة بهذا الـ request." },
      { t: "p",
        en: "Now the analogy for this part: a mail sorting office. The envelope is opened at the door (Kestrel parses the bytes), then handed down a row of desks. Each desk may stamp it, redirect it, or refuse it and send it straight back. Only if it survives every desk does it reach the person who actually answers it. Those desks are the middleware pipeline, and the person at the end is your endpoint handler.",
        ar: "والآن التشبيه لهذا الجزء: مكتب فرز بريد. الظرف يُفتح عند الباب (Kestrel يحلّل الـ bytes)، ثم يُمرَّر على صفّ من المكاتب. كل مكتب قد يختمه أو يحوّله أو يرفضه ويعيده فوراً. وإن نجا من كل المكاتب فقط يصل إلى الشخص الذي يجيب عليه فعلاً. هذه المكاتب هي الـ middleware pipeline، والشخص في النهاية هو الـ endpoint handler." },
      { t: "kv", rows: [
        { k: { en: "Socket read", ar: "قراءة الـ socket" },
          v: { en: "Raw bytes arrive from the network card into a buffer.", ar: "تصل bytes خام من كرت الشبكة إلى buffer." } },
        { k: { en: "Kestrel parser", ar: "محلّل Kestrel" },
          v: { en: "Turns bytes into a method, a path, a query string, and a header collection. Rejects malformed text with 400 without calling your code.", ar: "يحوّل الـ bytes إلى method و path و query string ومجموعة headers. ويرفض النص المشوّه بـ 400 دون استدعاء كودك." } },
        { k: { en: "HttpContext", ar: "HttpContext" },
          v: { en: "The C# object every middleware and handler receives. Holds Request, Response, User, and Items.", ar: "كائن C# الذي يستقبله كل middleware و handler. يحمل Request و Response و User و Items." } },
        { k: { en: "Middleware pipeline", ar: "Middleware pipeline" },
          v: { en: "An ordered chain built in Program.cs. Runs top to bottom on the way in, bottom to top on the way out.", ar: "سلسلة مرتّبة تُبنى في Program.cs. تعمل من الأعلى للأسفل عند الدخول، ومن الأسفل للأعلى عند الخروج." } },
        { k: { en: "Routing", ar: "Routing" },
          v: { en: "Matches the path against registered endpoint patterns. No match means 404, decided before your controller exists.", ar: "يطابق الـ path مع أنماط الـ endpoints المسجّلة. عدم المطابقة يعني 404، ويُقرَّر قبل أن يوجد الـ controller أصلاً." } },
        { k: { en: "Response writer", ar: "كاتب الـ response" },
          v: { en: "Sends the status line and headers on the first body write, then streams the body bytes.", ar: "يرسل الـ status line والـ headers عند أول كتابة للـ body، ثم يبثّ bytes الـ body." } }
      ]},
      { t: "p",
        en: "The last step matters more than people expect. Your status code and headers are held in memory, editable, until the first byte of the body is written. At that moment Kestrel sends them and marks the response as started. After that, setting a header or a status code throws, because those bytes are already gone down the wire and cannot be recalled.",
        ar: "الخطوة الأخيرة أهم مما يتوقّع الناس. الـ status code والـ headers تبقى في الذاكرة وقابلة للتعديل حتى تُكتب أول بايت من الـ body. في تلك اللحظة يرسلها Kestrel ويعلّم الـ response بأنه بدأ. بعد ذلك، ضبط header أو status code يرمي exception، لأن تلك الـ bytes خرجت على الشبكة ولا يمكن استرجاعها." },
      { t: "code", lang: "csharp", label: { en: "Where each part lands in C#", ar: "أين يقع كل جزء في C#" },
        code: "app.Use(async (ctx, next) =>\n{\n    // request line\n    var method = ctx.Request.Method;          // \"GET\"\n    var path   = ctx.Request.Path;            // \"/api/orders/1042\"\n    var query  = ctx.Request.QueryString;     // \"\" here\n\n    // headers\n    var accept = ctx.Request.Headers.Accept;  // \"application/json\"\n\n    await next();  // hand it to the next desk\n\n    // on the way out the response is already decided\n    var code = ctx.Response.StatusCode;       // 200 or 404\n});" }
    ]},

    { key: "tradeoffs", blocks: [
      { t: "tradeoff",
        pros: {
          en: [
            "Plain text means you can read a request with your eyes and reproduce it with curl.",
            "Headers are open-ended, so proxies and caches can add information without breaking anyone.",
            "Every language and device already speaks it, so no shared library is required.",
            "Clear separation of metadata (headers) from payload (body) makes routing decisions cheap."
          ],
          ar: [
            "كونه نصاً عادياً يعني أنك تقرأ الـ request بعينك وتعيد إنتاجه بـ curl.",
            "الـ headers مفتوحة، فيستطيع الـ proxies والـ caches إضافة معلومات دون كسر أحد.",
            "كل لغة وكل جهاز يتحدثه بالفعل، فلا حاجة لمكتبة مشتركة.",
            "الفصل الواضح بين البيانات الوصفية (headers) والحمولة (body) يجعل قرارات الـ routing رخيصة."
          ]
        },
        cons: {
          en: [
            "Headers repeat in full on every request, so a chatty client wastes bandwidth on the same cookie a thousand times.",
            "Parsing text costs more CPU than reading a fixed binary layout.",
            "In HTTP/1.1 one connection handles one request at a time, so a slow response blocks the ones behind it.",
            "Anything not in a header or the body has nowhere to live, which pushes teams into inventing custom headers."
          ],
          ar: [
            "الـ headers تتكرر كاملة في كل request، فالـ client كثير النداءات يهدر bandwidth على نفس الـ cookie ألف مرة.",
            "تحليل النص يكلّف CPU أكثر من قراءة تنسيق binary ثابت.",
            "في HTTP/1.1 الاتصال الواحد يخدم request واحداً في كل مرة، فالـ response البطيء يعطّل ما خلفه.",
            "أي شيء ليس في header أو body لا مكان له، وهذا يدفع الفرق لاختراع headers خاصة."
          ]
        },
        limits: {
          en: [
            "Servers cap total header size, commonly 8 KB, and reject bigger requests with 431.",
            "URLs have practical length limits around 2 KB in proxies, so data belongs in the body.",
            "Header names are case-insensitive but values are raw bytes, so non-ASCII values need encoding.",
            "Once the body starts, status and headers are frozen for that response."
          ],
          ar: [
            "الـ servers تضع حداً لحجم الـ headers، غالباً 8 KB، وترفض ما هو أكبر بـ 431.",
            "الـ URLs لها حد عملي حول 2 KB في الـ proxies، فالبيانات مكانها الـ body.",
            "أسماء الـ headers لا تفرّق بين الحروف الكبيرة والصغيرة، لكن القيم bytes خام، فالقيم غير الـ ASCII تحتاج ترميزاً.",
            "بمجرد أن يبدأ الـ body تتجمّد الـ status والـ headers لذلك الـ response."
          ]
        },
        alts: {
          en: [
            "HTTP/2: same parts, binary frames, many requests share one connection.",
            "HTTP/3 over QUIC: same again, but a lost packet does not stall the other streams.",
            "gRPC: a fixed schema over HTTP/2, smaller and faster, but not readable by hand.",
            "WebSocket: one upgraded connection kept open for two-way messages instead of request and response."
          ],
          ar: [
            "HTTP/2: نفس الأجزاء، لكن binary frames، وعدة requests تتشارك اتصالاً واحداً.",
            "HTTP/3 فوق QUIC: نفس الشيء، لكن ضياع packet لا يعطّل بقية الـ streams.",
            "gRPC: schema ثابت فوق HTTP/2، أصغر وأسرع، لكن غير قابل للقراءة يدوياً.",
            "WebSocket: اتصال واحد يُرقّى ويبقى مفتوحاً لرسائل ثنائية الاتجاه بدل request و response."
          ]
        }
      }
    ]},

    { key: "mistakes", blocks: [
      { t: "mistake",
        title: { en: "Setting a header after the body has started", ar: "ضبط header بعد بدء الـ body" },
        body: {
          en: "A developer added an exception-handling middleware that writes a JSON error and sets Response.StatusCode = 500. It worked in tests. In production, when a controller failed halfway through streaming a large order list, the middleware threw InvalidOperationException with the text that headers are read-only once the response has started. The client got a truncated 200 body and no error at all. Always check HasStarted before touching the response.",
          ar: "أضاف مطوّر middleware لمعالجة الأخطاء يكتب JSON للخطأ ويضبط Response.StatusCode = 500. عمل في الاختبارات. في الإنتاج، حين فشل controller في منتصف بثّ قائمة orders كبيرة، رمى الـ middleware استثناء InvalidOperationException نصه أن الـ headers للقراءة فقط بعد بدء الـ response. وصل الـ client body مبتوراً بكود 200 وبلا أي خطأ. تحقق دائماً من HasStarted قبل لمس الـ response."
        },
        fix: "if (!ctx.Response.HasStarted)\n{\n    ctx.Response.Clear();\n    ctx.Response.StatusCode = 500;\n    await ctx.Response.WriteAsJsonAsync(problem);\n}\nelse\n{\n    logger.LogError(ex, \"Failed after response started; connection aborted\");\n    ctx.Abort();\n}" },
      { t: "mistake",
        title: { en: "Reading the request body twice", ar: "قراءة الـ request body مرتين" },
        body: {
          en: "An audit middleware read Request.Body to log the incoming JSON of POST /api/orders. Every request after that produced a 400 saying the body was empty. Request.Body is a forward-only stream: it can be read once, and the reader consumed it, so model binding found zero bytes. EnableBuffering makes the stream re-readable by keeping a copy.",
          ar: "قرأ middleware للتدقيق الـ Request.Body ليسجّل الـ JSON الوارد إلى POST /api/orders. بعدها صار كل request يعطي 400 يقول إن الـ body فارغ. الـ Request.Body هو stream للأمام فقط: يُقرأ مرة واحدة، وقد استهلكه القارئ، فوجد الـ model binding صفر bytes. الدالة EnableBuffering تجعل الـ stream قابلاً لإعادة القراءة عبر الاحتفاظ بنسخة."
        },
        fix: "ctx.Request.EnableBuffering();\nusing var reader = new StreamReader(ctx.Request.Body, leaveOpen: true);\nvar raw = await reader.ReadToEndAsync();\nctx.Request.Body.Position = 0;   // rewind for model binding\nawait next();" },
      { t: "mistake",
        title: { en: "Trusting Host and X-Forwarded-For blindly", ar: "الثقة العمياء بـ Host و X-Forwarded-For" },
        body: {
          en: "A rate limiter keyed on Request.Headers[\"X-Forwarded-For\"] — a header a proxy adds to say which client it received the request from. Behind a load balancer that did not overwrite it, a caller sent the header themselves and rotated a fake value per request, so every request looked like a new client and the limit never triggered. Only headers written by infrastructure you control are trustworthy; ASP.NET Core's ForwardedHeaders middleware exists to apply them safely and only from known proxy addresses.",
          ar: "استخدم rate limiter مفتاحاً من Request.Headers[\"X-Forwarded-For\"] — وهو header يضيفه الـ proxy ليقول من أي client استلم الـ request. خلف load balancer لا يعيد كتابته، أرسل أحد المنادين الـ header بنفسه وغيّر قيمته المزيّفة في كل مرة، فبدا كل request عميلاً جديداً ولم يُفعّل الحد أبداً. الـ headers الموثوقة هي فقط ما تكتبه بنية تحتية تتحكم بها، و ForwardedHeaders middleware في ASP.NET Core موجود ليطبّقها بأمان ومن عناوين proxy معروفة فقط."
        },
        fix: "builder.Services.Configure<ForwardedHeadersOptions>(o =>\n{\n    o.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;\n    o.KnownProxies.Add(IPAddress.Parse(\"10.0.4.7\"));\n});\napp.UseForwardedHeaders();   // must run before anything that reads the IP" },
      { t: "mistake",
        title: { en: "Putting large data in the URL", ar: "وضع بيانات كبيرة في الـ URL" },
        body: {
          en: "A reporting screen sent selected order ids as a query string: /api/orders/export?ids=1042&ids=1043 and so on. With 400 selected orders the URL passed 9 KB, and nginx returned 414 URI Too Long before the request ever reached the service. The team saw an error with no application log line anywhere, because the application never received the request. Large or variable-length input belongs in a POST body.",
          ar: "أرسلت شاشة تقارير معرّفات الـ orders المختارة في الـ query string: ‎/api/orders/export?ids=1042&ids=1043‎ وهكذا. مع 400 order تجاوز الـ URL تسعة كيلوبايت، فأرجع nginx الخطأ 414 URI Too Long قبل أن يصل الـ request إلى الخدمة أصلاً. رأى الفريق خطأً بلا أي سطر log في التطبيق، لأن التطبيق لم يستلم الـ request إطلاقاً. المدخلات الكبيرة أو المتغيّرة الطول مكانها body في POST."
        },
        fix: "// POST /api/orders/export\n// Content-Type: application/json\n// { \"ids\": [1042, 1043, 1044] }\napp.MapPost(\"/api/orders/export\", async (ExportRequest req, IExporter e)\n    => Results.File(await e.BuildAsync(req.Ids), \"text/csv\", \"orders.csv\"));" }
    ]},

    { key: "interview", blocks: [
      { t: "qa", level: "junior",
        q: { en: "What are the parts of an HTTP request?", ar: "ما أجزاء الـ HTTP request؟" },
        a: {
          en: "Three parts. First the request line, which is the method, the path and the version — GET /api/orders/1042 HTTP/1.1. Then zero or more header lines, each Name: value, carrying things like Host, Accept and Authorization. Then a blank line, and after it an optional body. A GET normally has no body; a POST usually carries JSON. The response has the same shape, except the first line is a status line: version, a three-digit code, and a short reason like 200 OK.",
          ar: "ثلاثة أجزاء. أولاً الـ request line، وهو الـ method والـ path والنسخة — GET /api/orders/1042 HTTP/1.1. ثم صفر أو أكثر من أسطر الـ headers، كل واحد Name: value، ويحمل أشياء مثل Host و Accept و Authorization. ثم سطر فارغ، وبعده body اختياري. الـ GET عادةً بلا body، والـ POST غالباً يحمل JSON. والـ response له نفس الشكل، إلا أن السطر الأول هو status line: النسخة وكود من ثلاثة أرقام ونص قصير مثل 200 OK."
        } },
      { t: "qa", level: "mid",
        q: { en: "How does the server know where the body ends?", ar: "كيف يعرف الـ server أين ينتهي الـ body؟" },
        a: {
          en: "Two ways, and exactly one of them is used per message. Normally the sender includes Content-Length, a header giving the body size in bytes, and the server reads that many bytes and stops. If the sender does not know the size ahead of time — it is streaming a generated report, say — it sends Transfer-Encoding: chunked instead, and writes the body as a series of pieces where each piece is prefixed with its own size in hex. A piece of size zero means the body is finished. If neither header is present, there is no body.",
          ar: "طريقتان، وتُستخدم واحدة فقط في كل رسالة. عادةً يضع المرسل الـ header المسمّى Content-Length ويعطي حجم الـ body بالـ bytes، فيقرأ الـ server هذا العدد ثم يتوقف. وإن كان المرسل لا يعرف الحجم مسبقاً — كأن يبثّ تقريراً يُولَّد أثناء الإرسال — يرسل بدلاً منه Transfer-Encoding: chunked، ويكتب الـ body كسلسلة قطع كل قطعة مسبوقة بحجمها بالنظام الست عشري. والقطعة بحجم صفر تعني أن الـ body انتهى. وإن لم يوجد أي من الـ header الاثنين فلا يوجد body."
        } },
      { t: "qa", level: "mid",
        q: { en: "When do you put something in a header versus the query string versus the body?", ar: "متى تضع الشيء في header مقابل query string مقابل body؟" },
        a: {
          en: "Headers carry information about the message, not the thing you are asking for: who you are, what format you accept, what your correlation id is. The query string identifies or filters the resource: page number, a search term, a sort order — it is part of the URL, so it is cached, logged and bookmarked. The body carries the payload you are sending: the order you want created. Practical rule: if it changes which resource you get, it goes in the URL; if it describes how the message should be handled, it goes in a header; if it is the data itself, it goes in the body. Never put secrets in the query string, because URLs end up in access logs.",
          ar: "الـ headers تحمل معلومات عن الرسالة نفسها لا عن الشيء المطلوب: من أنت، وما الصيغ التي تقبلها، وما الـ correlation id. والـ query string يحدّد المورد أو يرشّحه: رقم الصفحة، كلمة بحث، ترتيب — وهو جزء من الـ URL، لذلك يُخزَّن في الـ cache ويُسجَّل في الـ logs ويُحفظ كرابط. والـ body يحمل البيانات التي ترسلها: الـ order الذي تريد إنشاءه. القاعدة العملية: إن كان يغيّر أي مورد تحصل عليه فمكانه الـ URL، وإن كان يصف كيفية معالجة الرسالة فمكانه header، وإن كان البيانات نفسها فمكانه الـ body. ولا تضع أسراراً في الـ query string أبداً، لأن الـ URLs تنتهي في access logs."
        } },
      { t: "qa", level: "senior",
        q: { en: "Why can't you change the status code after you have written to the body?", ar: "لماذا لا تستطيع تغيير الـ status code بعد الكتابة في الـ body؟" },
        a: {
          en: "Because HTTP is ordered bytes on a connection. The status line and headers physically come first, so the server has to send them before it can send any body byte. ASP.NET Core buffers them until the first write, then flushes and flips Response.HasStarted to true. Anything you set after that would have to travel back in time. The practical consequence is for streaming endpoints: once you have started writing a large JSON array and then hit an error on row 40,000, you cannot turn the 200 into a 500. Your only honest options are to abort the connection so the client sees a broken transfer, or to design the response so failure is representable inside the body.",
          ar: "لأن الـ HTTP هو bytes مرتّبة على اتصال. الـ status line والـ headers تأتي أولاً فيزيائياً، فيجب على الـ server إرسالها قبل أن يرسل أي بايت من الـ body. و ASP.NET Core يحتفظ بها في الذاكرة حتى أول كتابة، ثم يرسلها ويجعل Response.HasStarted تساوي true. وأي شيء تضبطه بعد ذلك يحتاج للعودة بالزمن. الأثر العملي يظهر في الـ endpoints التي تبثّ: إذا بدأت كتابة مصفوفة JSON كبيرة ثم واجهت خطأ عند السطر أربعين ألفاً، لا تستطيع تحويل الـ 200 إلى 500. خياراك الصادقان هما إنهاء الاتصال فيرى الـ client نقلاً مقطوعاً، أو تصميم الـ response بحيث يكون الفشل قابلاً للتمثيل داخل الـ body."
        } },
      { t: "qa", level: "senior",
        q: { en: "A request works from curl but fails from the browser. Where do you look?", ar: "الـ request ينجح من curl ويفشل من المتصفح. أين تبحث؟" },
        a: {
          en: "The browser sends a different request, so compare them side by side rather than guessing. Three usual causes. First, CORS: for anything other than a simple GET the browser first sends an OPTIONS request, called a preflight, asking whether the origin is allowed; if the server does not answer it correctly the real request is never sent, and the failure appears in the browser console but nowhere in your server logs. Second, cookies: the browser attaches them automatically and curl does not, so an expired session cookie can produce a 401 only in the browser. Third, headers the browser adds on its own, like Origin, Referer and Sec-Fetch-Site, which a strict gateway rule may reject. Open the network tab, copy the failing request as curl, and diff it against your working one.",
          ar: "المتصفح يرسل request مختلفاً، فقارن الاثنين جنباً إلى جنب بدل التخمين. الأسباب الشائعة ثلاثة. الأول الـ CORS: لأي شيء غير GET بسيط يرسل المتصفح أولاً request بالـ method المسمّى OPTIONS، يُسمّى preflight، ليسأل هل الـ origin مسموح؛ وإن لم يجب الـ server عليه بشكل صحيح لا يُرسل الـ request الحقيقي أبداً، ويظهر الفشل في console المتصفح ولا يظهر في logs الـ server إطلاقاً. الثاني الـ cookies: المتصفح يرفقها تلقائياً و curl لا يفعل، فقد يعطي session cookie منتهٍ خطأ 401 في المتصفح فقط. الثالث headers يضيفها المتصفح من نفسه مثل Origin و Referer و Sec-Fetch-Site، وقد ترفضها قاعدة صارمة في الـ gateway. افتح تبويب الشبكة، وانسخ الـ request الفاشل بصيغة curl، وقارنه بالناجح."
        } },
      { t: "qa", level: "staff",
        q: { en: "Ten services log requests differently and incidents take hours to correlate. What do you change?", ar: "عشر خدمات تسجّل الـ requests بطرق مختلفة والحوادث تستغرق ساعات للربط. ماذا تغيّر؟" },
        a: {
          en: "This is an organisational problem, so a code fix in one service does not solve it. I would agree one request-log contract across the org — method, matched route template rather than the raw path, status, duration in milliseconds, and a correlation id — and ship it as a single internal NuGet package that every service adds in one line, so the default is correct without anyone thinking about it. I would standardise on the W3C traceparent header for the correlation id, because proxies and client libraries already propagate it. Then I would make it enforceable rather than aspirational: a startup check that fails the build if the middleware is missing, a dashboard listing services that have not adopted it, and a single owner for the package. The measure of success is a specific number — median time to find every hop of one failing request — and I would publish it before and after.",
          ar: "هذه مشكلة تنظيمية، فإصلاح الكود في خدمة واحدة لا يحلّها. سأتفق على عقد واحد لتسجيل الـ requests عبر المؤسسة — الـ method، وقالب الـ route المطابق بدل الـ path الخام، والـ status، والمدة بالمللي ثانية، و correlation id — وأشحنه كحزمة NuGet داخلية واحدة تضيفها كل خدمة بسطر واحد، ليكون الوضع الافتراضي صحيحاً دون أن يفكر أحد. وسأوحّد الـ correlation id على الـ header المعياري traceparent من W3C، لأن الـ proxies ومكتبات الـ clients تمرّره أصلاً. ثم أجعله قابلاً للإلزام لا مجرد أمنية: فحص عند الإقلاع يُفشل البناء إن غاب الـ middleware، ولوحة تعرض الخدمات التي لم تعتمده، ومالك واحد للحزمة. ومقياس النجاح رقم محدد — الوقت الوسيط للعثور على كل محطة لـ request فاشل واحد — وسأنشره قبل وبعد."
        } }
    ]},

    { key: "codereview", blocks: [
      { t: "review", severity: "high",
        title: { en: "Middleware consumes the body and breaks every handler behind it", ar: "middleware يستهلك الـ body ويكسر كل handler خلفه" },
        bad: "app.Use(async (ctx, next) =>\n{\n    using var reader = new StreamReader(ctx.Request.Body);\n    var body = await reader.ReadToEndAsync();\n    logger.LogInformation(\"Body: {Body}\", body);\n    await next();          // body stream is now at the end\n});",
        good: "app.Use(async (ctx, next) =>\n{\n    ctx.Request.EnableBuffering();\n    using var reader = new StreamReader(ctx.Request.Body, leaveOpen: true);\n    var body = await reader.ReadToEndAsync();\n    ctx.Request.Body.Position = 0;\n    logger.LogInformation(\"Body: {Body}\", Redact(body));\n    await next();\n});",
        why: {
          en: "Request.Body is a forward-only stream, meaning it can be read from start to end exactly once. The bad version reads it fully, so model binding downstream sees an empty body and every POST returns 400 with a message about a missing or invalid payload. EnableBuffering keeps a copy so the stream can be rewound, and leaveOpen stops the StreamReader from closing it. The good version also redacts, because request bodies routinely contain passwords and card numbers that must not reach a log store.",
          ar: "الـ Request.Body هو stream للأمام فقط، أي يمكن قراءته من البداية إلى النهاية مرة واحدة بالضبط. النسخة السيئة تقرأه كاملاً، فيرى الـ model binding بعدها body فارغاً ويرجع كل POST بخطأ 400 يتحدث عن حمولة ناقصة أو غير صالحة. الدالة EnableBuffering تحتفظ بنسخة فيمكن إرجاع الـ stream للبداية، و leaveOpen تمنع الـ StreamReader من إغلاقه. والنسخة الجيدة تحجب البيانات الحساسة أيضاً، لأن الـ request bodies تحوي عادةً كلمات مرور وأرقام بطاقات يجب ألا تصل إلى مخزن الـ logs."
        } },
      { t: "review", severity: "medium",
        title: { en: "Building a URL by string concatenation", ar: "بناء URL بدمج النصوص" },
        bad: "var url = $\"{baseUrl}/api/orders?status={status}&customer={name}\";\nvar res = await http.GetAsync(url);",
        good: "var url = QueryHelpers.AddQueryString($\"{baseUrl}/api/orders\", new Dictionary<string, string?>\n{\n    [\"status\"]   = status,\n    [\"customer\"] = name\n});\nvar res = await http.GetAsync(url);",
        why: {
          en: "A query string is not free text: characters like &, =, ? and space have structural meaning and must be percent-encoded, meaning replaced by a % and two hex digits. A customer named \"Smith & Sons\" turns the value into a second parameter, so the server sees customer=Smith and an unknown parameter called Sons. That is a silent wrong result, not an error. QueryHelpers.AddQueryString encodes each value correctly, and skips keys whose value is null instead of sending the literal text null.",
          ar: "الـ query string ليس نصاً حراً: رموز مثل & و = و ؟ والمسافة لها معنى بنيوي ويجب ترميزها بصيغة percent-encoding، أي استبدالها بعلامة % ورقمين ست عشريين. عميل اسمه \"Smith & Sons\" يحوّل القيمة إلى parameter ثانٍ، فيرى الـ server أن customer=Smith وأن هناك parameter مجهولاً اسمه Sons. وهذه نتيجة خاطئة صامتة لا خطأ ظاهر. والدالة QueryHelpers.AddQueryString ترمّز كل قيمة بشكل صحيح، وتتجاهل المفاتيح ذات القيمة null بدل إرسال كلمة null نصاً."
        } }
    ]},

    { key: "sysdesign", blocks: [
      { t: "p",
        en: "In a real system your service is rarely the first thing to touch a request. A typical path is client, then CDN, then load balancer, then API gateway, then your service. Each hop parses the same request text, may rewrite the path, add or drop headers, and enforce its own size and time limits. Every one of them can return a response your application never sees, which is why an error with no application log line almost always means a hop in front of you answered.",
        ar: "في نظام حقيقي نادراً ما تكون خدمتك أول من يلمس الـ request. المسار المعتاد هو client ثم CDN ثم load balancer ثم API gateway ثم خدمتك. وكل محطة تحلّل نفس نص الـ request، وقد تعيد كتابة الـ path، وتضيف أو تحذف headers، وتفرض حدودها الخاصة للحجم والوقت. وكل واحدة منها تستطيع إرجاع response لا تراه خدمتك أبداً، ولهذا فإن خطأً بلا أي سطر log في التطبيق يعني غالباً أن محطة أمامك هي التي أجابت." },
      { t: "ul",
        en: [
          "Decide once, org-wide, whether the /api prefix is stripped by the proxy or kept, and write it in the deployment template — this is exactly the bug in this lesson's example.",
          "Set the maximum request body size deliberately at every hop; the smallest limit in the chain is the real limit, and a mismatch produces a 413 that your service cannot explain.",
          "Generate a correlation id at the outermost hop and pass it down in the standard traceparent header, so all hops log the same id for one request.",
          "Keep header budgets in mind: large auth tokens plus cookies can exceed the common 8 KB header limit and cause a 431 only for logged-in users.",
          "Make timeouts shrink as you go inward, so an inner service never keeps working on a request the gateway has already given up on."
        ],
        ar: [
          "قرّر مرة واحدة على مستوى المؤسسة هل يحذف الـ proxy البادئة /api أم يبقيها، واكتب ذلك في قالب النشر — فهذا بالضبط هو الخلل في مثال هذا الدرس.",
          "اضبط الحد الأقصى لحجم الـ request body بشكل مقصود في كل محطة؛ فأصغر حد في السلسلة هو الحد الفعلي، وعدم التوافق يُنتج خطأ 413 لا تستطيع خدمتك تفسيره.",
          "ولّد correlation id عند المحطة الأبعد ومرّره للداخل في الـ header المعياري traceparent، فتسجّل كل المحطات نفس المعرّف للـ request الواحد.",
          "انتبه لميزانية الـ headers: الـ auth tokens الكبيرة مع الـ cookies قد تتجاوز حد 8 KB الشائع فتسبّب خطأ 431 للمستخدمين المسجّلين فقط.",
          "اجعل المُهل تتناقص كلما اتجهت للداخل، فلا تستمر خدمة داخلية في العمل على request تخلّى عنه الـ gateway بالفعل."
        ] },
      { t: "callout", kind: "tip",
        en: "Add one middleware at the very top of the pipeline that logs method, path, status and duration for every request, and put it in a shared package. It costs microseconds and it is the single log line that answers most production questions about whether a request even arrived.",
        ar: "أضف middleware واحداً في أعلى الـ pipeline يسجّل الـ method والـ path والـ status والمدة لكل request، وضعه في حزمة مشتركة. تكلفته ميكروثوانٍ، وهو سطر الـ log الوحيد الذي يجيب على معظم أسئلة الإنتاج حول ما إذا كان الـ request قد وصل أصلاً."
      }
    ]},

    { key: "perf", blocks: [
      { t: "kv", rows: [
        { k: { en: "Network", ar: "Network" },
          v: { en: "Headers are re-sent in full on every HTTP/1.1 request. A 4 KB cookie on 200 requests per page load costs 800 KB of pure overhead. HTTP/2 header compression removes most of it.", ar: "الـ headers تُعاد كاملة في كل request على HTTP/1.1. فـ cookie بحجم 4 KB مع 200 request لكل صفحة يكلّف 800 KB من الحمل الزائد وحده. وضغط الـ headers في HTTP/2 يزيل معظمه." } },
        { k: { en: "Latency", ar: "Latency" },
          v: { en: "A new HTTPS connection costs a DNS lookup plus a TCP handshake plus a TLS handshake — often 100-300 ms before a single byte of your request is sent. Reusing connections through a pooled HttpClient removes that cost from every call after the first.", ar: "الاتصال HTTPS الجديد يكلّف بحثاً في الـ DNS ثم TCP handshake ثم TLS handshake — غالباً بين 100 و300 مللي ثانية قبل إرسال بايت واحد من الـ request. وإعادة استخدام الاتصالات عبر HttpClient مُجمَّع تزيل هذه التكلفة من كل نداء بعد الأول." } },
        { k: { en: "Memory", ar: "Memory" },
          v: { en: "Reading a body with ReadToEndAsync allocates the whole payload as one string. A 10 MB upload on 50 concurrent requests is 500 MB of managed memory and repeated large-object-heap allocations. Stream or deserialise directly instead.", ar: "قراءة الـ body بـ ReadToEndAsync تحجز الحمولة كلها كنص واحد. رفع بحجم 10 MB على 50 request متزامناً يعني 500 MB من الذاكرة المُدارة وتخصيصات متكررة على large-object-heap. استخدم البثّ أو فكّ الترميز مباشرةً بدلاً من ذلك." } },
        { k: { en: "CPU", ar: "CPU" },
          v: { en: "Parsing the request line and headers is cheap — microseconds — but it happens on every request, so header-heavy traffic still shows up in profiles. Kestrel avoids most of it by not converting header bytes to strings until you ask for them.", ar: "تحليل الـ request line والـ headers رخيص — ميكروثوانٍ — لكنه يحدث في كل request، فالمرور المثقل بالـ headers يظهر في الـ profiles رغم ذلك. و Kestrel يتجنّب معظمه بعدم تحويل bytes الـ headers إلى نصوص حتى تطلبها." } },
        { k: { en: "Scalability", ar: "Scalability" },
          v: { en: "Each open connection holds a socket and buffers. Servers hit connection limits long before CPU limits, so keep-alive tuning and connection reuse decide how many clients one instance serves.", ar: "كل اتصال مفتوح يحجز socket و buffers. والـ servers تصطدم بحدود الاتصالات قبل حدود الـ CPU بكثير، لذلك ضبط الـ keep-alive وإعادة استخدام الاتصالات هما ما يحدّد كم client تخدمه النسخة الواحدة." } }
      ]}
    ]},

    { key: "debug", blocks: [
      { t: "ul",
        en: [
          "curl -v https://api.shop.example/api/orders/1042 — prints every request line and header it sends with >, and every response line with <. Compare the path here with what your service logs.",
          "Kestrel debug logging: set Microsoft.AspNetCore.Server.Kestrel to Debug in appsettings, then look for the parsed request line and the reason a connection was closed.",
          "Routing debug logging: set Microsoft.AspNetCore.Routing to Debug and look for the matched endpoint name, or its absence, which proves a 404 came from routing and not your handler.",
          "mitmproxy or Fiddler between client and server — shows the request as it actually left the client, which is how you catch a header the SDK added or dropped.",
          "tcpdump -A -s0 port 80 on the server for plain HTTP — shows the raw bytes when you suspect a proxy rewrote something and no application-level tool agrees."
        ],
        ar: [
          "curl -v https://api.shop.example/api/orders/1042 — يطبع كل سطر و header يرسله بعلامة >، وكل سطر response بعلامة <. قارن الـ path هنا بما تسجّله خدمتك.",
          "تفعيل logs الـ Kestrel: اضبط Microsoft.AspNetCore.Server.Kestrel على Debug في appsettings، ثم ابحث عن الـ request line بعد تحليله وعن سبب إغلاق الاتصال.",
          "تفعيل logs الـ routing: اضبط Microsoft.AspNetCore.Routing على Debug وابحث عن اسم الـ endpoint المطابق، أو عن غيابه، وهو ما يثبت أن الـ 404 جاء من الـ routing لا من الـ handler.",
          "استخدام mitmproxy أو Fiddler بين الـ client والـ server — يُظهر الـ request كما خرج فعلاً من الـ client، وهكذا تكتشف header أضافته أو حذفته الـ SDK.",
          "الأمر tcpdump -A -s0 port 80 على الـ server لحركة HTTP غير المشفّرة — يُظهر الـ bytes الخام حين تشك أن proxy أعاد كتابة شيء ولا تتفق أدوات مستوى التطبيق معك."
        ] },
      { t: "callout", kind: "tip",
        en: "In the browser network tab, right-click a failing request and choose Copy as cURL. You now have the exact request the browser sent, headers and cookies included. Run it in a terminal: if it fails there too the problem is server-side, and if it succeeds the problem is something the browser adds, usually CORS or a cookie.",
        ar: "في تبويب الشبكة بالمتصفح، اضغط بالزر الأيمن على الـ request الفاشل واختر Copy as cURL. الآن لديك الـ request الذي أرسله المتصفح بالضبط، بما فيه الـ headers والـ cookies. شغّله في الطرفية: إن فشل هناك أيضاً فالمشكلة في جهة الـ server، وإن نجح فالمشكلة في شيء يضيفه المتصفح، غالباً CORS أو cookie."
      }
    ]},

    { key: "realworld", blocks: [
      { t: "p",
        en: "Knowing the shape of a request stops being academic the moment a request crosses a boundary you do not own. Anywhere a third party generates the bytes, you cannot assume they look like what your own client sends, and the parts you must read carefully are the method, the exact path, the content type and the raw body.",
        ar: "معرفة شكل الـ request تتوقّف عن كونها موضوعاً نظرياً في اللحظة التي يعبر فيها الـ request حدوداً لا تملكها. وحيثما ولّد طرف ثالث الـ bytes، لا يمكنك افتراض أنها تشبه ما يرسله client خاص بك، والأجزاء التي يجب قراءتها بدقة هي الـ method والـ path بالضبط ونوع المحتوى والـ body الخام." },
      { t: "ul",
        en: [
          "Payment providers: webhook callbacks are signed over the exact raw body bytes, so any middleware that reads, reformats or re-serialises the body breaks signature verification and every payment notification is rejected.",
          "Public API platforms: clients written in dozens of languages send subtly different requests, so servers must accept both Content-Type: application/json and application/json; charset=utf-8 rather than string-comparing the header.",
          "File upload services: they read the Content-Length header up front to reject an oversized upload immediately, instead of buffering gigabytes only to fail at the end.",
          "Mobile backends on poor networks: connection setup dominates, so these teams tune keep-alive and connection reuse far more aggressively than server-side handler time."
        ],
        ar: [
          "مزوّدو الدفع: نداءات الـ webhook موقّعة على bytes الـ body الخام بالضبط، فأي middleware يقرأ الـ body أو يعيد تنسيقه أو يعيد ترميزه يكسر التحقق من التوقيع فتُرفض كل إشعارات الدفع.",
          "منصات الـ API العامة: عملاؤها مكتوبون بعشرات اللغات ويرسلون requests مختلفة اختلافات دقيقة، لذلك يجب أن يقبل الـ server كلاً من Content-Type: application/json و application/json; charset=utf-8 بدل مقارنة الـ header كنص.",
          "خدمات رفع الملفات: تقرأ الـ header المسمّى Content-Length مسبقاً لترفض الرفع الكبير فوراً، بدل تخزين جيجابايتات ثم الفشل في النهاية.",
          "الخدمات الخلفية للموبايل على شبكات ضعيفة: زمن تأسيس الاتصال هو المهيمن، لذلك تضبط هذه الفرق الـ keep-alive وإعادة استخدام الاتصالات بجدّية أكبر بكثير من ضبط زمن الـ handler."
        ] }
    ]},

    { key: "exercises", blocks: [
      { t: "ex", diff: "easy",
        en: "Run curl -v against any endpoint of your own service and copy the output into a file. Label every line as request line, request header, blank line, status line, response header or body. You are done when you can point at the exact character sequence that separates headers from body.",
        ar: "شغّل curl -v على أي endpoint في خدمتك وانسخ المخرجات إلى ملف. ثم صنّف كل سطر: request line أو request header أو سطر فارغ أو status line أو response header أو body. تكون قد أنجزت حين تستطيع الإشارة إلى تسلسل الحروف الذي يفصل الـ headers عن الـ body بالضبط." },
      { t: "ex", diff: "medium",
        en: "Write a middleware that logs method, path, status code and elapsed milliseconds for every request, and register it as the very first middleware. Prove it works by hitting a URL that does not exist: the log line must appear with status 404 even though no controller ran.",
        ar: "اكتب middleware يسجّل الـ method والـ path والـ status code وعدد المللي ثوانٍ لكل request، وسجّله كأول middleware على الإطلاق. أثبت أنه يعمل بمناداة URL غير موجود: يجب أن يظهر سطر الـ log بحالة 404 رغم أنه لم يعمل أي controller." },
      { t: "ex", diff: "hard",
        en: "Write a middleware that reads and logs the raw request body without breaking model binding. Prove it with a POST endpoint that binds a model: the endpoint must still receive the full object after your middleware has already read the body once. Then add redaction so a field named password never reaches the log.",
        ar: "اكتب middleware يقرأ ويسجّل الـ request body الخام دون كسر الـ model binding. أثبت ذلك عبر endpoint من نوع POST يربط نموذجاً: يجب أن يستقبل الـ endpoint الكائن كاملاً بعد أن قرأ الـ middleware الـ body مرة. ثم أضف حجباً بحيث لا يصل حقل اسمه password إلى الـ log أبداً." },
      { t: "ex", diff: "senior",
        en: "Open a raw TCP connection to your service with netcat and type an HTTP/1.1 request by hand, including Host and a correct Content-Length for a small JSON body. Then repeat it with a Content-Length one byte too large and describe exactly what the server does and why. Write up what that tells you about how the server finds the end of a body.",
        ar: "افتح TCP connection خاماً إلى خدمتك باستخدام netcat واكتب request بصيغة HTTP/1.1 يدوياً، مع Host و Content-Length صحيح لـ body صغير بصيغة JSON. ثم كرّر التجربة بقيمة Content-Length أكبر ببايت واحد وصف بالضبط ما يفعله الـ server ولماذا. واكتب ما يخبرك به ذلك عن طريقة عثور الـ server على نهاية الـ body." }
    ]},

    { key: "refs", blocks: [
      { t: "ref", label: { en: "RFC 9110 — HTTP Semantics", ar: "RFC 9110 — دلالات الـ HTTP" }, url: "https://www.rfc-editor.org/rfc/rfc9110.html", meta: { en: "Spec", ar: "مواصفة" } },
      { t: "ref", label: { en: "RFC 9112 — HTTP/1.1 message syntax", ar: "RFC 9112 — بنية رسالة HTTP/1.1" }, url: "https://www.rfc-editor.org/rfc/rfc9112.html", meta: { en: "Spec", ar: "مواصفة" } },
      { t: "ref", label: { en: "MDN — HTTP messages", ar: "MDN — رسائل الـ HTTP" }, url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages", meta: { en: "Docs", ar: "توثيق" } },
      { t: "ref", label: { en: "ASP.NET Core middleware", ar: "Middleware في ASP.NET Core" }, url: "https://learn.microsoft.com/en-us/aspnet/core/fundamentals/middleware/", meta: { en: "Docs", ar: "توثيق" } }
    ]}
  ],
  quiz: [
    {
      q: { en: "What exactly marks the end of the header section in an HTTP message?", ar: "ما الذي يحدّد بالضبط نهاية قسم الـ headers في رسالة HTTP؟" },
      options: [
        { en: "The Content-Length header", ar: "الـ header المسمّى Content-Length" },
        { en: "An empty line, that is \\r\\n\\r\\n", ar: "سطر فارغ، أي \\r\\n\\r\\n" },
        { en: "A header named End-Of-Headers", ar: "header اسمه End-Of-Headers" },
        { en: "The first opening brace of the JSON body", ar: "أول قوس فتح في الـ JSON body" }
      ],
      correct: 1,
      why: { en: "Headers end at one blank line. Content-Length only says how many body bytes follow that blank line; it does not mark where headers stop.", ar: "الـ headers تنتهي عند سطر فارغ واحد. أما Content-Length فيقول فقط كم بايت من الـ body تأتي بعد ذلك السطر، ولا يحدّد أين تتوقف الـ headers." }
    },
    {
      q: { en: "Your middleware reads Request.Body, then the controller reports an empty payload. Why?", ar: "الـ middleware يقرأ Request.Body، ثم يبلّغ الـ controller أن الحمولة فارغة. لماذا؟" },
      options: [
        { en: "The controller runs before middleware, so it read nothing yet", ar: "الـ controller يعمل قبل الـ middleware، فلم يقرأ شيئاً بعد" },
        { en: "Request.Body is forward-only and was already consumed", ar: "الـ Request.Body للأمام فقط وقد استُهلك بالفعل" },
        { en: "Reading the body clears the Content-Length header", ar: "قراءة الـ body تمسح الـ header المسمّى Content-Length" },
        { en: "Model binding ignores bodies larger than 1 KB", ar: "الـ model binding يتجاهل الـ bodies الأكبر من 1 KB" }
      ],
      correct: 1,
      why: { en: "The body is a stream that can be read from start to end once. After the middleware reads it the position is at the end, so binding sees zero bytes. EnableBuffering plus resetting Position fixes it.", ar: "الـ body هو stream يُقرأ من البداية للنهاية مرة واحدة. وبعد قراءة الـ middleware له يكون المؤشر عند النهاية، فيرى الـ binding صفر bytes. والحل هو EnableBuffering مع إعادة ضبط Position." }
    },
    {
      q: { en: "Why does setting Response.StatusCode fail after you have written part of the body?", ar: "لماذا يفشل ضبط Response.StatusCode بعد كتابة جزء من الـ body؟" },
      options: [
        { en: "Because the status line and headers were already sent on the wire", ar: "لأن الـ status line والـ headers أُرسلت بالفعل على الشبكة" },
        { en: "Because ASP.NET Core allows only one status code per application", ar: "لأن ASP.NET Core يسمح بـ status code واحد لكل تطبيق" },
        { en: "Because the garbage collector has already reclaimed the response", ar: "لأن الـ garbage collector استرجع الـ response بالفعل" },
        { en: "Because status codes are immutable value types", ar: "لأن الـ status codes أنواع قيمة غير قابلة للتغيير" }
      ],
      correct: 0,
      why: { en: "HTTP sends the status line and headers before any body byte. Once the first body write flushes them, Response.HasStarted is true and they cannot be changed.", ar: "الـ HTTP يرسل الـ status line والـ headers قبل أي بايت من الـ body. وبمجرد أن ترسلها أول كتابة للـ body تصبح Response.HasStarted تساوي true ولا يمكن تغييرها." }
    },
    {
      q: { en: "A request returns 404 and no controller log line appears anywhere. What is the most likely cause?", ar: "الـ request يرجع 404 ولا يظهر أي سطر log من الـ controller في أي مكان. ما السبب الأرجح؟" },
      options: [
        { en: "The controller threw an exception that was swallowed", ar: "الـ controller رمى استثناءً تم ابتلاعه" },
        { en: "The database returned no rows for that id", ar: "قاعدة البيانات لم ترجع أي صفوف لذلك الـ id" },
        { en: "The path never matched a route, so routing answered before any controller ran", ar: "الـ path لم يطابق أي route، فأجاب الـ routing قبل أن يعمل أي controller" },
        { en: "The logging provider was misconfigured for that class only", ar: "مزوّد الـ logging مضبوط بشكل خاطئ لهذا الـ class فقط" }
      ],
      correct: 2,
      why: { en: "Routing decides the endpoint before the controller is created. A path that matches nothing produces a 404 with no application code executed, which is exactly why the logs are silent — as in this lesson's stripped /api prefix.", ar: "الـ routing يقرّر الـ endpoint قبل إنشاء الـ controller. والـ path الذي لا يطابق شيئاً يُنتج 404 دون تنفيذ أي كود تطبيق، وهذا بالضبط سبب صمت الـ logs — كما في مثال هذا الدرس حيث حُذفت البادئة /api." }
    },
    {
      q: { en: "Which statement about HTTP/2 is correct?", ar: "أي عبارة عن HTTP/2 صحيحة؟" },
      options: [
        { en: "It removes headers entirely and sends only the body", ar: "يزيل الـ headers تماماً ويرسل الـ body فقط" },
        { en: "It keeps the same parts — method, path, headers, body — but encodes them as compressed binary frames", ar: "يحتفظ بنفس الأجزاء — method و path و headers و body — لكنه يرمّزها كـ binary frames مضغوطة" },
        { en: "It replaces status codes with error strings", ar: "يستبدل الـ status codes بنصوص أخطاء" },
        { en: "It requires a new connection for every request", ar: "يتطلب اتصالاً جديداً لكل request" }
      ],
      correct: 1,
      why: { en: "HTTP/2 changes only the encoding on the wire. The semantics are identical, which is why everything you know about methods, headers and bodies still applies, and why many requests can share one connection.", ar: "الـ HTTP/2 يغيّر الترميز على الشبكة فقط. أما الدلالات فمطابقة، ولهذا يبقى كل ما تعرفه عن الـ methods والـ headers والـ bodies صحيحاً، ولهذا تستطيع عدة requests أن تتشارك اتصالاً واحداً." }
    }
  ]
};
```

NEXT: http-methods
