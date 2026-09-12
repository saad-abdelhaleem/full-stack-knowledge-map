```js
const statusRetryLesson = {
  id: "status-retry",
  moduleId: "foundations",
  title: { en: "What clients retry on", ar: "ما يعيد العملاء المحاولة عليه" },
  summary: {
    en: "Which status codes are safe to send again, why 500 and 504 are the dangerous ones, and how Retry-After turns guessing into a rule.",
    ar: "أي status codes آمن إرسالها مرة أخرى، ولماذا 500 و504 هما الخطران، وكيف يحوّل Retry-After التخمين إلى قاعدة."
  },
  mins: 9,
  sections: [
    {
      key: "why",
      blocks: [
        { t: "p",
          en: "A retry means sending the exact same request again after the first attempt failed. The status code in the failed response is your main clue about whether that is safe. Some codes mean the server did no work at all, so sending the request again costs nothing. Other codes mean the server may have finished the work and only the reply got lost. Repeating that request can charge a customer twice.",
          ar: "الـ retry يعني إرسال نفس الـ request مرة أخرى بعد فشل المحاولة الأولى. والـ status code في الاستجابة الفاشلة هو دليلك الأساسي على ما إذا كان ذلك آمناً. بعض الأكواد تعني أن السيرفر لم ينفّذ أي عمل، فإعادة الإرسال لا تكلّف شيئاً. وأكواد أخرى تعني أن السيرفر ربما أنهى العمل وضاع الرد فقط. وإعادة إرسال هذا الـ request قد تخصم من العميل مرتين." },

        { t: "kv", rows: [
          { k: { en: "Status code", ar: "Status code" },
            v: { en: "The three-digit number at the start of every HTTP response. 200 means it worked, 404 means not found, 503 means the server is unavailable.", ar: "الرقم المكوّن من ثلاث خانات في بداية كل HTTP response. 200 يعني نجح، و404 يعني غير موجود، و503 يعني السيرفر غير متاح." } },
          { k: { en: "Retry", ar: "Retry" },
            v: { en: "Sending the same request a second time, from the client, after the first attempt failed.", ar: "إرسال نفس الـ request مرة ثانية من العميل بعد فشل المحاولة الأولى." } },
          { k: { en: "Transient failure", ar: "Transient failure" },
            v: { en: "A failure caused by a temporary condition — a restart, a full queue, a brief network drop — that usually clears by itself within seconds.", ar: "فشل سببه حالة مؤقتة — إعادة تشغيل، أو queue ممتلئ، أو انقطاع شبكة قصير — وعادةً ينتهي وحده خلال ثوانٍ." } },
          { k: { en: "Idempotent request", ar: "Idempotent request" },
            v: { en: "A request you can send many times where the end state is the same as sending it once. GET and DELETE are idempotent. A POST that creates a payment is not.", ar: "request يمكن إرساله مرات كثيرة وتكون الحالة النهائية كأنك أرسلته مرة واحدة. الـ GET والـ DELETE هما idempotent. أما POST الذي ينشئ payment فليس كذلك." } },
          { k: { en: "Side effect", ar: "Side effect" },
            v: { en: "Any lasting change the server makes while handling a request: a row written, money moved, an email sent.", ar: "أي تغيير دائم يحدثه السيرفر أثناء معالجة الـ request: صف مكتوب، أو أموال تحرّكت، أو إيميل أُرسل." } },
          { k: { en: "Retry-After", ar: "Retry-After" },
            v: { en: "A response header where the server says how long the client should wait before trying again, either as a number of seconds or as a date.", ar: "response header يقول فيه السيرفر كم ينبغي أن ينتظر العميل قبل المحاولة مجدداً، إما بعدد ثوانٍ وإما بتاريخ." } }
        ]},

        { t: "p",
          en: "Retries exist because most network failures are short. A pod restarts, a connection pool fills up, a switch drops a packet. Wait two seconds and the same call succeeds. Without retries, every one of those blips becomes a failed order. With careless retries, every one of those blips becomes a duplicate order. Choosing which codes to retry is the whole difference.",
          ar: "الـ retries موجودة لأن معظم أعطال الشبكة قصيرة. pod يُعاد تشغيله، أو connection pool يمتلئ، أو switch يُسقط packet. انتظر ثانيتين وينجح نفس النداء. وبدون retries يتحول كل عطل قصير إلى order فاشل. ومع retries عشوائية يتحول كل عطل قصير إلى order مكرّر. واختيار الأكواد التي تعيد المحاولة عليها هو الفرق كله." },

        { t: "p",
          en: "Think of two everyday situations. In the first, you go to post a letter and the post office is shut. Nothing left your hand, so you come back tomorrow and post it. No harm. In the second, you hand your card to a cashier, the terminal freezes, and no receipt prints. You do not know whether the money moved. Tapping the card again may charge you twice. Status codes are how the server tells you which situation you are in — and for two of them it cannot tell you at all.",
          ar: "تخيّل موقفين يوميين. في الأول تذهب لإرسال رسالة فتجد مكتب البريد مغلقاً. لم تخرج الرسالة من يدك، فتعود غداً وترسلها ولا ضرر. وفي الثاني تعطي بطاقتك للكاشير، فيتجمّد الجهاز ولا يُطبع أي إيصال. أنت لا تعرف هل تحرّكت الأموال أم لا. وتمرير البطاقة ثانيةً قد يخصم منك مرتين. الـ status codes هي الطريقة التي يخبرك بها السيرفر في أي موقف أنت — وفي كودين منها لا يستطيع إخبارك إطلاقاً." },

        { t: "callout", kind: "note",
          en: "503 Service Unavailable is the shut post office: the request never ran. 500 and 504 are the frozen card terminal: the server either crashed part-way through the work, or finished it and the answer never came back. Nothing in the response tells you which of the two happened.",
          ar: "الـ 503 Service Unavailable هو مكتب البريد المغلق: الـ request لم يُنفَّذ أصلاً. أما 500 و504 فهما جهاز البطاقة المتجمّد: السيرفر إما انهار في منتصف العمل وإما أنهاه ولم يصل الرد. ولا شيء في الاستجابة يخبرك أيّ الاثنين حدث." }
      ]
    },
    {
      key: "problem",
      blocks: [
        { t: "p",
          en: "Here is the case used through the whole lesson. An Orders service calls a Payments service with POST /payments, sending orderId, amount and currency. The handler writes a payments row and moves real money. The Orders service uses HttpClient with one retry policy applied to every call: three attempts, two seconds apart, on any response that is not a success.",
          ar: "هذه هي الحالة المستخدمة في الدرس كله. خدمة Orders تنادي خدمة Payments عبر POST /payments وترسل orderId وamount وcurrency. والـ handler يكتب صفاً في جدول payments ويحرّك أموالاً حقيقية. وخدمة Orders تستخدم HttpClient مع retry policy واحدة مطبّقة على كل نداء: ثلاث محاولات بينها ثانيتان، على أي استجابة ليست ناجحة." },

        { t: "p",
          en: "During a 90-second deploy of the Payments service, the gateway kept accepting connections while the pods restarted. About 42,000 payment requests were in flight. Roughly 4,300 of them came back as 504 Gateway Timeout — meaning the gateway stopped waiting for an answer, not that the work failed. The Orders service retried all 4,300, twice each. About 1,900 customers were charged twice, because the first attempt had actually completed on the server and only the response was lost. The word timeout described the gateway's patience, not the server's work.",
          ar: "أثناء deploy استغرق 90 ثانية لخدمة Payments، ظل الـ gateway يقبل الاتصالات بينما كانت الـ pods يُعاد تشغيلها. كان نحو 42,000 payment request قيد التنفيذ. ورجع منها نحو 4,300 بكود 504 Gateway Timeout — أي أن الـ gateway توقّف عن الانتظار، لا أن العمل فشل. وأعادت خدمة Orders المحاولة على الـ 4,300 كلها مرتين لكل واحد. وخُصم من نحو 1,900 عميل مرتين، لأن المحاولة الأولى كانت قد اكتملت فعلاً على السيرفر وضاع الرد وحده. كلمة timeout هنا تصف صبر الـ gateway لا عمل السيرفر." },

        { t: "kv", rows: [
          { k: { en: "400 Bad Request", ar: "400 Bad Request" },
            v: { en: "The request itself is malformed. The same bytes give the same answer forever. Never retry.", ar: "الـ request نفسه غير صالح. ونفس البايتات تعطي نفس الرد دائماً. لا تعِد المحاولة أبداً." } },
          { k: { en: "401 / 403", ar: "401 / 403" },
            v: { en: "Not authenticated, or not allowed. Retry only after refreshing the token, and only once — repeated attempts can lock the account.", ar: "غير مُصادَق عليه أو غير مسموح. أعد المحاولة فقط بعد تجديد الـ token، ومرة واحدة — فالمحاولات المتكررة قد تُقفل الحساب." } },
          { k: { en: "404 / 409 / 422", ar: "404 / 409 / 422" },
            v: { en: "The server understood you and said no. Nothing changes on a second attempt. Never retry.", ar: "السيرفر فهمك وقال لا. ولا شيء يتغير في المحاولة الثانية. لا تعِد المحاولة أبداً." } },
          { k: { en: "408 Request Timeout", ar: "408 Request Timeout" },
            v: { en: "The server gave up waiting for the client to finish sending the request. The body usually never arrived complete, so a retry is normally safe.", ar: "السيرفر تعب من انتظار العميل ليكمل إرسال الـ request. وعادةً لم يصل الـ body كاملاً، فإعادة المحاولة آمنة غالباً." } },
          { k: { en: "429 Too Many Requests", ar: "429 Too Many Requests" },
            v: { en: "You are being rate limited — the server is capping how many calls you may send. Retrying is expected, but only after the delay in Retry-After.", ar: "أنت تحت rate limiting — السيرفر يحدّد عدد النداءات المسموح بها. وإعادة المحاولة متوقَّعة، لكن بعد المدة المذكورة في Retry-After فقط." } },
          { k: { en: "500 Internal Server Error", ar: "500 Internal Server Error" },
            v: { en: "The handler threw an exception. It may have thrown before the side effect or after it. Retry only if repeating is harmless.", ar: "الـ handler رمى exception. وقد يكون رماه قبل الـ side effect أو بعده. أعد المحاولة فقط إذا كان التكرار غير ضار." } },
          { k: { en: "502 / 503", ar: "502 / 503" },
            v: { en: "A proxy found no healthy server, or the server declared itself unavailable. In both cases your request never reached the handler. Safe to retry.", ar: "لم يجد الـ proxy سيرفراً سليماً، أو أعلن السيرفر أنه غير متاح. وفي الحالتين لم يصل الـ request إلى الـ handler. آمن لإعادة المحاولة." } },
          { k: { en: "504 Gateway Timeout", ar: "504 Gateway Timeout" },
            v: { en: "A proxy stopped waiting for the server. The server may still be working and may finish. Same rule as 500.", ar: "الـ proxy توقّف عن انتظار السيرفر. وقد يكون السيرفر ما زال يعمل وقد ينهي العمل. نفس قاعدة 500." } },
          { k: { en: "No response at all", ar: "لا استجابة إطلاقاً" },
            v: { en: "Connection reset, DNS failure, TLS failure. If it broke before your bytes went out, retrying is safe. Once bytes are on the wire you cannot tell. Treat it like 500.", ar: "connection reset أو فشل DNS أو فشل TLS. إن حدث قبل خروج بايتاتك فإعادة المحاولة آمنة. وبعد خروجها لا يمكنك التمييز. عامله مثل 500." } }
        ]},

        { t: "p",
          en: "One pattern runs through the whole table. The safe codes are the ones where the server can prove it did nothing. The dangerous codes are the ones where the server itself does not know how far it got.",
          ar: "هناك نمط واحد يسري في الجدول كله. الأكواد الآمنة هي التي يستطيع السيرفر فيها إثبات أنه لم يفعل شيئاً. والأكواد الخطرة هي التي لا يعرف السيرفر نفسه فيها إلى أي مدى وصل." }
      ]
    },
    {
      key: "internals",
      blocks: [
        { t: "p",
          en: "The only question a retry decision answers is this: did the side effect already happen? HTTP answers it clearly for most codes and not at all for 500 and 504. So a correct retry rule is built from two inputs, not one: the status code, and whether repeating this particular request is harmless.",
          ar: "السؤال الوحيد الذي يجيب عنه قرار الـ retry هو: هل حدث الـ side effect بالفعل؟ والـ HTTP يجيب بوضوح عن معظم الأكواد، ولا يجيب إطلاقاً عن 500 و504. لذلك تُبنى قاعدة الـ retry الصحيحة من مدخلين لا مدخل واحد: الـ status code، وهل تكرار هذا الـ request تحديداً غير ضار." },

        { t: "p",
          en: "Trace one POST /payments through the hops. The client opens a socket and writes the request bytes. A load balancer picks a pod. The gateway forwards the request. Kestrel — the web server inside ASP.NET Core — parses it and runs the middleware. The handler validates the body, calls the card processor, and commits a database transaction. Then the response travels back the same way. A failure can land at any hop, and where it lands is exactly what decides whether the side effect happened.",
          ar: "تتبّع POST /payments واحداً عبر المحطات. العميل يفتح socket ويكتب بايتات الـ request. ثم يختار الـ load balancer أحد الـ pods. ويمرّر الـ gateway الـ request. ثم يحلّله Kestrel — وهو الـ web server داخل ASP.NET Core — ويشغّل الـ middleware. ويتحقق الـ handler من الـ body، وينادي الـ card processor، ويعمل commit لـ transaction في قاعدة البيانات. ثم يعود الرد بنفس الطريق. والفشل قد يقع في أي محطة، وموضع وقوعه هو بالضبط ما يحدّد هل حدث الـ side effect." },

        { t: "p",
          en: "Failures at the first hops are provably harmless. A 503 comes from the load balancer before any pod was chosen. A 502 means the gateway could not reach a pod. Neither ever reached the handler, so the payments row was never written. Failures at the last hops are the problem. A 504 is emitted by the gateway when its own patience runs out, while the handler keeps running behind it and may commit the transaction one second later. A 500 is emitted after the handler threw — but the throw may have happened after the money moved and before the row was written.",
          ar: "الأعطال في المحطات الأولى غير ضارة بشكل مثبت. فالـ 503 يأتي من الـ load balancer قبل اختيار أي pod. والـ 502 يعني أن الـ gateway لم يستطع الوصول إلى pod. وكلاهما لم يصل إلى الـ handler، فلم يُكتب صف الـ payments أبداً. والمشكلة في المحطات الأخيرة. فالـ 504 يصدره الـ gateway عندما ينفد صبره هو، بينما يظل الـ handler يعمل خلفه وقد يعمل commit بعد ثانية واحدة. والـ 500 يصدر بعد أن رمى الـ handler exception — لكن الرمي قد يكون حدث بعد تحرّك الأموال وقبل كتابة الصف." },

        { t: "p",
          en: "Use a courier as the anchor. Address does not exist is a 404, and sending the parcel again changes nothing. We could not reach the depot is a 503, and your parcel never moved, so send it again. We lost contact with the driver after pickup is a 504 — the parcel may already be delivered. Sending a second parcel is only sensible if the recipient can recognise it as a duplicate. The idempotency key is the label that lets them recognise it.",
          ar: "استخدم شركة شحن كمثال ثابت. العنوان غير موجود هو 404، وإعادة إرسال الطرد لا تغيّر شيئاً. ولم نستطع الوصول إلى المستودع هو 503، والطرد لم يتحرك أصلاً، فأعد إرساله. وفقدنا الاتصال بالسائق بعد الاستلام هو 504 — وقد يكون الطرد سُلّم بالفعل. وإرسال طرد ثانٍ يكون منطقياً فقط إذا كان المستلم قادراً على معرفة أنه مكرّر. والـ idempotency key هو الملصق الذي يجعله يعرف ذلك." },

        { t: "kv", rows: [
          { k: { en: "HTTP method", ar: "HTTP method" },
            v: { en: "Says whether repeating is harmless by definition. GET, HEAD, PUT and DELETE are idempotent by the spec. POST is not.", ar: "يحدّد هل التكرار غير ضار بحكم التعريف. فـ GET وHEAD وPUT وDELETE هي idempotent حسب المواصفة. أما POST فلا." } },
          { k: { en: "Status code", ar: "Status code" },
            v: { en: "The server's own claim about how far it got before failing.", ar: "إقرار السيرفر نفسه عن المدى الذي وصل إليه قبل الفشل." } },
          { k: { en: "Retry-After", ar: "Retry-After" },
            v: { en: "The server's instruction about when to come back. It answers when, never whether.", ar: "تعليمة السيرفر عن موعد العودة. تجيب عن متى، ولا تجيب أبداً عن هل." } },
          { k: { en: "Idempotency key", ar: "Idempotency key" },
            v: { en: "A unique id the client generates and sends with the request. The server stores it, and on a repeat returns the first result instead of doing the work twice.", ar: "معرّف فريد ينشئه العميل ويرسله مع الـ request. يخزّنه السيرفر، وعند التكرار يعيد نتيجة المرة الأولى بدل تنفيذ العمل مرتين." } },
          { k: { en: "Retry budget", ar: "Retry budget" },
            v: { en: "A cap on how many retries the client may spend across all requests, so one broken dependency cannot multiply your traffic.", ar: "سقف لعدد الـ retries التي يستهلكها العميل عبر كل الـ requests، حتى لا تضاعف تبعية معطلة واحدة حجم مرورك." } }
        ]},

        { t: "code", lang: "csharp",
          label: { en: "The decision, written out", ar: "القرار مكتوباً" },
          code: "static bool ShouldRetry(HttpRequestMessage req, HttpResponseMessage res)\n{\n    // Repeating is harmless either by method, or because we sent a key.\n    bool repeatIsSafe =\n        req.Method == HttpMethod.Get ||\n        req.Method == HttpMethod.Head ||\n        req.Method == HttpMethod.Put ||\n        req.Method == HttpMethod.Delete ||\n        req.Headers.Contains(\"Idempotency-Key\");\n\n    int code = (int)res.StatusCode;\n\n    // Never reached the handler: safe for any method.\n    if (code == 429 || code == 502 || code == 503) return true;\n\n    // May have reached the handler: safe only if repeating is harmless.\n    if (code == 408 || code == 500 || code == 504) return repeatIsSafe;\n\n    // Every other 4xx is a permanent answer. Every 2xx is a success.\n    return false;\n}" },

        { t: "p",
          en: "The wait between attempts matters as much as the decision. If the server sent Retry-After, honour it — it is the only number that knows when the server will be ready. If it did not, back off exponentially: 200 ms, then 400, then 800. Add jitter, which is a small random amount added to each wait so a thousand clients do not all retry in the same millisecond. Clamp the result, because an unbounded Retry-After of 86400 would park a worker for a day.",
          ar: "مدة الانتظار بين المحاولات لا تقل أهمية عن القرار نفسه. إن أرسل السيرفر Retry-After فاحترمه — فهو الرقم الوحيد الذي يعرف متى سيكون السيرفر جاهزاً. وإن لم يرسله فاستخدم exponential backoff: 200 ms ثم 400 ثم 800. وأضف jitter، وهو مقدار عشوائي صغير يُضاف لكل انتظار حتى لا يعيد ألف عميل المحاولة في نفس الميلي ثانية. وقيّد الناتج بحدّ أعلى، لأن Retry-After غير محدود بقيمة 86400 سيوقف عاملاً ليوم كامل." },

        { t: "code", lang: "csharp",
          label: { en: "How long to wait", ar: "كم تنتظر" },
          code: "static TimeSpan Delay(HttpResponseMessage res, int attempt)\n{\n    var ra = res.Headers.RetryAfter;   // parses BOTH legal forms\n    if (ra?.Delta is TimeSpan seconds) return Clamp(seconds);\n    if (ra?.Date is DateTimeOffset when) return Clamp(when - DateTimeOffset.UtcNow);\n\n    var backoff = TimeSpan.FromMilliseconds(200 * Math.Pow(2, attempt));\n    var jitter  = TimeSpan.FromMilliseconds(Random.Shared.Next(0, 250));\n    return Clamp(backoff + jitter);\n}\n\nstatic TimeSpan Clamp(TimeSpan t) =>\n    t < TimeSpan.Zero            ? TimeSpan.Zero :\n    t > TimeSpan.FromSeconds(30) ? TimeSpan.FromSeconds(30) : t;" },

        { t: "p",
          en: "One detail about .NET. A plain HttpClient retries nothing on its own. The retries come from a handler you add, usually the standard resilience handler in Microsoft.Extensions.Http.Resilience, which retries 5xx, 408 and 429 out of the box. That default is safe for a read-only client and unsafe for a client that posts payments, because the handler sees every request the client sends. This is why retry policies belong on a named client scoped to one dependency, not on a shared default.",
          ar: "تفصيلة عن .NET. الـ HttpClient العادي لا يعيد المحاولة من تلقاء نفسه. والـ retries تأتي من handler تضيفه أنت، وغالباً هو الـ standard resilience handler في Microsoft.Extensions.Http.Resilience، وهو يعيد المحاولة على 5xx و408 و429 افتراضياً. هذا الافتراضي آمن لعميل يقرأ فقط، وغير آمن لعميل يرسل payments، لأن الـ handler يرى كل request يرسله العميل. ولهذا تنتمي سياسات الـ retry إلى named client مخصّص لتبعية واحدة، لا إلى default مشترك." }
      ]
    },
    {
      key: "tradeoffs",
      blocks: [
        { t: "tradeoff",
          pros: {
            en: [
              "Turns short outages into invisible delays instead of failed orders.",
              "Costs nothing when the dependency is healthy — the policy only fires on failure.",
              "Absorbs deploys and pod restarts, which are the most common source of 502 and 503.",
              "Retry-After lets the server steer your load instead of you guessing."
            ],
            ar: [
              "يحوّل الانقطاعات القصيرة إلى تأخير غير مرئي بدل orders فاشلة.",
              "لا يكلّف شيئاً عندما تكون التبعية سليمة — فالسياسة لا تعمل إلا عند الفشل.",
              "يمتص الـ deploys وإعادة تشغيل الـ pods، وهي أكثر مصادر 502 و503 شيوعاً.",
              "الـ Retry-After يجعل السيرفر يوجّه حِملك بدل أن تخمّن أنت."
            ]
          },
          cons: {
            en: [
              "On a non-idempotent POST, a retry after 500 or 504 can duplicate a real side effect.",
              "Retries multiply load exactly when the dependency is already struggling.",
              "Each attempt holds a connection and a thread's worth of work for longer.",
              "Retries at several layers multiply: 3 layers of 3 attempts is 27 requests."
            ],
            ar: [
              "على POST غير idempotent، قد يكرّر الـ retry بعد 500 أو 504 أثر side effect حقيقياً.",
              "الـ retries تضاعف الحمل تحديداً وقت أن تكون التبعية متعبة أصلاً.",
              "كل محاولة تحجز connection وتشغل عملاً بقدر thread لمدة أطول.",
              "الـ retries في عدة طبقات تتضاعف: ثلاث طبقات بثلاث محاولات تعني 27 request."
            ]
          },
          limits: {
            en: [
              "A retry cannot fix a 4xx — the answer is permanent.",
              "The status code alone never tells you whether the side effect happened.",
              "Retrying only helps for failures shorter than your total retry window.",
              "Without an idempotency key, a safe retry on POST is not possible."
            ],
            ar: [
              "الـ retry لا يصلح 4xx — فالجواب دائم.",
              "الـ status code وحده لا يخبرك أبداً هل حدث الـ side effect.",
              "الـ retry يفيد فقط في أعطال أقصر من نافذة إعادة المحاولة كلها.",
              "بدون idempotency key لا يمكن عمل retry آمن على POST."
            ]
          },
          alts: {
            en: [
              "Idempotency keys, so a repeat is provably harmless.",
              "A circuit breaker that stops calling a dependency that is clearly down.",
              "A queue plus a background worker, so the retry happens off the request path.",
              "Failing fast and letting the user press the button again, when the action is cheap."
            ],
            ar: [
              "الـ idempotency keys ليصبح التكرار غير ضار بشكل مثبت.",
              "circuit breaker يوقف النداء على تبعية واضح أنها معطّلة.",
              "queue مع background worker، فتحدث إعادة المحاولة خارج مسار الـ request.",
              "الفشل السريع وترك المستخدم يضغط الزر مرة أخرى، عندما يكون الإجراء رخيصاً."
            ]
          }
        }
      ]
    },
    {
      key: "mistakes",
      blocks: [
        { t: "mistake",
          title: { en: "Retrying POST on 500 with no idempotency key", ar: "إعادة المحاولة على POST عند 500 بلا idempotency key" },
          body: {
            en: "Someone wrapped the payments client in a policy that retried any 5xx. During one incident the payments handler threw after the card was charged and before the row was committed. The client saw 500 and sent the same body again. The card was charged a second time. The fix is not to remove the retry, but to send a key the server can recognise so the second call returns the first result.",
            ar: "أحدهم غلّف عميل الـ payments بسياسة تعيد المحاولة على أي 5xx. وفي حادثة، رمى handler الـ payments exception بعد خصم البطاقة وقبل عمل commit للصف. فرأى العميل 500 وأرسل نفس الـ body ثانيةً. فخُصمت البطاقة مرة ثانية. والحل ليس حذف الـ retry، بل إرسال key يعرفه السيرفر فيعيد النداء الثاني نتيجة الأول."
          },
          fix: "req.Headers.Add(\"Idempotency-Key\", order.Id.ToString());\n// server: if key seen before, return the stored response, do no work" },

        { t: "mistake",
          title: { en: "Retrying 4xx codes", ar: "إعادة المحاولة على أكواد 4xx" },
          body: {
            en: "A shared HttpClient wrapper retried on !response.IsSuccessStatusCode. A client sent a malformed date and got 400. The wrapper sent the identical bytes three times and returned the same 400, three seconds later. Multiply that across a bad mobile release and a healthy validation endpoint takes three times its normal traffic while producing nothing. A 4xx is the server saying the request is wrong; the request does not change while it sits in memory.",
            ar: "غلاف HttpClient مشترك كان يعيد المحاولة عند !response.IsSuccessStatusCode. وأرسل عميل تاريخاً غير صالح فحصل على 400. فأرسل الغلاف نفس البايتات ثلاث مرات وأعاد نفس الـ 400 بعد ثلاث ثوانٍ. واضرب ذلك في إصدار موبايل سيئ، فيستقبل endpoint سليم ثلاثة أضعاف حمله دون أي فائدة. فالـ 4xx هو قول السيرفر إن الـ request خاطئ، والـ request لا يتغير وهو ساكن في الذاكرة."
          } },

        { t: "mistake",
          title: { en: "Ignoring Retry-After on 429", ar: "تجاهل Retry-After عند 429" },
          body: {
            en: "A sync job hit a partner API, got 429 with Retry-After: 60, and retried after its own fixed one second. It did that on every worker. The partner counted the extra calls against the same quota, so the window never reset and the job stayed rate limited for twenty minutes instead of one. Retry-After is the only value in the exchange that knows when the limit resets.",
            ar: "وظيفة مزامنة نادت partner API فحصلت على 429 مع Retry-After: 60، لكنها أعادت المحاولة بعد ثانية واحدة ثابتة خاصة بها. وفعلت ذلك على كل worker. فاحتسب الـ partner النداءات الزائدة على نفس الـ quota، فلم تُصفَّر النافذة وبقيت الوظيفة تحت rate limiting عشرين دقيقة بدل دقيقة. فالـ Retry-After هو القيمة الوحيدة في التبادل التي تعرف متى يُصفَّر الحدّ."
          } },

        { t: "mistake",
          title: { en: "Retrying at every layer", ar: "إعادة المحاولة في كل طبقة" },
          body: {
            en: "The mobile app retried three times, the API gateway retried three times, and the Orders service retried three times. One slow Payments pod received 27 copies of one user action. The extra load kept the pod slow, which produced more timeouts, which produced more retries. Pick exactly one layer to retry at — usually the one closest to the failing dependency — and make the others fail fast.",
            ar: "تطبيق الموبايل يعيد المحاولة ثلاث مرات، والـ API gateway ثلاثاً، وخدمة Orders ثلاثاً. فاستقبل pod بطيء واحد في Payments سبعاً وعشرين نسخة من إجراء مستخدم واحد. والحمل الزائد أبقى الـ pod بطيئاً، فأنتج timeouts أكثر، فأنتج retries أكثر. اختر طبقة واحدة بالضبط لإعادة المحاولة — غالباً الأقرب للتبعية الفاشلة — واجعل البقية تفشل بسرعة."
          } }
      ]
    },
    {
      key: "interview",
      blocks: [
        { t: "qa", level: "junior",
          q: { en: "Which status codes are safe to retry?", ar: "أي status codes آمن إعادة المحاولة عليها؟" },
          a: { en: "429, 502 and 503 are the easy ones — the request never reached the application code, so sending it again costs nothing. 408, 500 and 504 depend on the request: safe for a GET or a PUT, unsafe for a POST that creates something, because the server may already have done the work. Everything in the 4xx range other than 408 and 429 is a permanent no, so retrying just wastes time.", ar: "الـ 429 و502 و503 هي السهلة — فالـ request لم يصل إلى كود التطبيق، وإعادة إرساله لا تكلّف شيئاً. أما 408 و500 و504 فتعتمد على الـ request: آمنة لـ GET أو PUT، وغير آمنة لـ POST ينشئ شيئاً، لأن السيرفر قد يكون نفّذ العمل فعلاً. وكل ما في نطاق 4xx عدا 408 و429 هو رفض دائم، فإعادة المحاولة عليه إهدار للوقت." } },

        { t: "qa", level: "mid",
          q: { en: "Why is 500 more dangerous than 503?", ar: "لماذا 500 أخطر من 503؟" },
          a: { en: "503 is emitted before your handler runs — the server is saying it is not accepting work right now. So nothing changed and a retry is free. 500 is emitted after your handler ran and threw. The exception could have been thrown before the money moved or after it. The response gives you no way to tell, so you have to assume the side effect might already exist.", ar: "الـ 503 يصدر قبل تشغيل الـ handler — فالسيرفر يقول إنه لا يقبل عملاً الآن. فلم يتغير شيء وإعادة المحاولة مجانية. أما 500 فيصدر بعد أن عمل الـ handler ورمى exception. وقد يكون الـ exception رُمي قبل تحرّك الأموال أو بعده. والاستجابة لا تعطيك أي وسيلة للتمييز، فعليك افتراض أن الـ side effect قد يكون موجوداً بالفعل." } },

        { t: "qa", level: "mid",
          q: { en: "What does Retry-After actually contain?", ar: "ماذا يحتوي Retry-After فعلياً؟" },
          a: { en: "Either a number of seconds, like 120, or an HTTP date, like Wed, 21 Oct 2026 07:28:00 GMT. Both forms are legal on any response, and gateways emit the date form regularly. In .NET, HttpResponseHeaders.RetryAfter parses both — Delta for the seconds form and Date for the date form. Code that only parses integers throws on half the real traffic. I also clamp the value, because a server can legally ask me to wait a day.", ar: "إما عدد ثوانٍ مثل 120، وإما HTTP date مثل Wed, 21 Oct 2026 07:28:00 GMT. والشكلان قانونيان على أي استجابة، والـ gateways تصدر شكل التاريخ بانتظام. وفي .NET يحلّل HttpResponseHeaders.RetryAfter الشكلين — Delta لشكل الثواني وDate لشكل التاريخ. والكود الذي يحلّل الأعداد الصحيحة فقط يرمي exception على نصف المرور الحقيقي. وأنا أقيّد القيمة أيضاً، لأن السيرفر يستطيع قانونياً أن يطلب مني الانتظار يوماً." } },

        { t: "qa", level: "senior",
          q: { en: "How do you make a POST safely retryable?", ar: "كيف تجعل POST قابلاً لإعادة المحاولة بأمان؟" },
          a: { en: "The client generates a unique id per business action — not per attempt — and sends it as an Idempotency-Key header. The server stores that key together with the response, in the same database transaction as the side effect. If a request arrives with a key it has seen, it returns the stored response and does no work. Now a retry after a 504 is provably harmless, because the second call cannot reach the charging code.", ar: "العميل ينشئ معرّفاً فريداً لكل إجراء تجاري — لا لكل محاولة — ويرسله في header اسمه Idempotency-Key. والسيرفر يخزّن هذا المفتاح مع الاستجابة في نفس الـ transaction الذي يحوي الـ side effect. وإذا وصل request بمفتاح سبق أن رآه، يعيد الاستجابة المخزّنة ولا ينفّذ عملاً. عندها تصبح إعادة المحاولة بعد 504 غير ضارة بشكل مثبت، لأن النداء الثاني لا يصل إلى كود الخصم." } },

        { t: "qa", level: "senior",
          q: { en: "Retries can make an outage worse. How do you stop that?", ar: "الـ retries قد تزيد العطل سوءاً. كيف تمنع ذلك؟" },
          a: { en: "Three things. First, jitter, so clients spread out instead of arriving as one wave every two seconds. Second, a retry budget — a rule that retries may not exceed something like ten percent of total requests, so a dependency that is failing for everyone does not get four times its normal load. Third, a circuit breaker that stops calling entirely once the failure rate crosses a threshold, and lets a single probe through to check recovery.", ar: "ثلاثة أشياء. أولاً jitter، فيتوزّع العملاء بدل أن يصلوا كموجة واحدة كل ثانيتين. ثانياً retry budget — قاعدة تمنع تجاوز الـ retries نحو عشرة بالمئة من إجمالي الـ requests، فلا تتلقى تبعية فاشلة للجميع أربعة أضعاف حملها الطبيعي. ثالثاً circuit breaker يوقف النداء تماماً بمجرد تجاوز نسبة الفشل حدّاً معيناً، ثم يسمح بنداء واحد للفحص ليتأكد من التعافي." } },

        { t: "qa", level: "staff",
          q: { en: "How do you stop retry bugs from recurring across a whole organisation?", ar: "كيف تمنع تكرار أخطاء الـ retry عبر مؤسسة كاملة؟" },
          a: { en: "Make the safe path the default path. Ship one internal HttpClient setup where retry is off for POST unless an idempotency key is present, and enabled for the rest. Then make services declare which endpoints are idempotent in their API description, so the rule is data rather than tribal knowledge. Add a dashboard that shows retry rate per client and per dependency, and treat a spike as an incident signal. Finally, put duplicate side effects on the incident review checklist, so the next outage asks the question automatically instead of discovering it from a customer complaint.", ar: "اجعل المسار الآمن هو المسار الافتراضي. أصدر إعداداً داخلياً واحداً لـ HttpClient يكون فيه الـ retry مغلقاً على POST ما لم يوجد idempotency key، ومفتوحاً لغير ذلك. ثم اجعل الخدمات تعلن أي endpoints هي idempotent في وصف الـ API، فتصبح القاعدة بيانات لا معرفة شفوية. وأضف dashboard يعرض نسبة الـ retry لكل عميل ولكل تبعية، وتعامل مع أي ارتفاع مفاجئ كإشارة حادثة. وأخيراً ضع الـ side effects المكرّرة في قائمة مراجعة الحوادث، فيسأل العطل التالي السؤال تلقائياً بدل اكتشافه من شكوى عميل." } }
      ]
    },
    {
      key: "codereview",
      blocks: [
        { t: "review", severity: "high",
          title: { en: "One retry policy applied to every request the client sends", ar: "سياسة retry واحدة مطبّقة على كل request يرسله العميل" },
          bad: "services.AddHttpClient<PaymentsClient>()\n    .AddStandardResilienceHandler(); // retries 5xx, 408, 429 on EVERY request\n\nawait _http.PostAsJsonAsync(\"/payments\", body);   // charges money\nawait _http.GetAsync($\"/payments/{id}\");          // reads only",
          good: "services.AddHttpClient<PaymentsClient>()\n    .AddStandardResilienceHandler(o =>\n        o.Retry.ShouldHandle = args => ValueTask.FromResult(\n            ShouldRetry(args.Outcome.Result)));\n\nvar req = new HttpRequestMessage(HttpMethod.Post, \"/payments\")\n{\n    Content = JsonContent.Create(body)\n};\nreq.Headers.Add(\"Idempotency-Key\", order.Id.ToString());\nawait _http.SendAsync(req);",
          why: { en: "The handler cannot see the difference between reading a payment and creating one. The default policy retries both, so a 504 on the POST charges the card again. The fix keeps the retry for reads and makes the write provably safe by sending a key the server deduplicates on.", ar: "الـ handler لا يرى الفرق بين قراءة payment وإنشائه. والسياسة الافتراضية تعيد المحاولة على الاثنين، فيؤدي 504 على الـ POST إلى خصم البطاقة مجدداً. والإصلاح يبقي الـ retry للقراءات ويجعل الكتابة آمنة بشكل مثبت بإرسال key يستخدمه السيرفر لمنع التكرار." } },

        { t: "review", severity: "medium",
          title: { en: "Retry-After parsed as an integer only", ar: "تحليل Retry-After كعدد صحيح فقط" },
          bad: "var raw = res.Headers.GetValues(\"Retry-After\").First();\nvar wait = TimeSpan.FromSeconds(int.Parse(raw)); // throws on a date\nawait Task.Delay(wait);                          // and never clamped",
          good: "var ra = res.Headers.RetryAfter;\nvar wait =\n    ra?.Delta ??\n    (ra?.Date is { } d ? d - DateTimeOffset.UtcNow : TimeSpan.FromSeconds(1));\n\nif (wait < TimeSpan.Zero) wait = TimeSpan.Zero;\nif (wait > TimeSpan.FromSeconds(30)) wait = TimeSpan.FromSeconds(30);\nawait Task.Delay(wait);",
          why: { en: "Retry-After may legally be a date, and CDNs send that form often. int.Parse throws on it, and if the exception is swallowed the code falls back to its shortest default delay — so the server's strictest instruction produces the client's most aggressive behaviour. The clamp matters in the other direction: an unbounded value would block a worker for hours.", ar: "الـ Retry-After قد يكون تاريخاً بشكل قانوني، والـ CDNs ترسل هذا الشكل كثيراً. وint.Parse يرمي exception عليه، وإن ابتُلع الـ exception يرتد الكود إلى أقصر تأخير افتراضي — فتنتج أشد تعليمات السيرفر أعنف سلوك من العميل. والتقييد بحدّ أعلى مهم في الاتجاه الآخر: فقيمة غير محدودة ستوقف worker لساعات." } }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        { t: "p",
          en: "In a real system the retry rule lives in three places, and they must agree. The client library decides which codes to repeat. The server decides which codes to emit — and it must not return 500 for a business rejection, because that turns a permanent no into something clients will hammer. The gateway decides how long to wait before it gives up and emits 504, and that number must be larger than the server's own internal timeout, or the gateway will report failures for work that is still finishing.",
          ar: "في نظام حقيقي تعيش قاعدة الـ retry في ثلاثة أماكن، ويجب أن تتفق. فمكتبة العميل تقرّر أي أكواد تعيد المحاولة عليها. والسيرفر يقرّر أي أكواد يصدرها — ويجب ألا يعيد 500 لرفض تجاري، لأن ذلك يحوّل رفضاً دائماً إلى شيء سيطرقه العملاء بلا توقف. والـ gateway يقرّر كم ينتظر قبل أن يستسلم ويصدر 504، ويجب أن يكون هذا الرقم أكبر من الـ timeout الداخلي للسيرفر، وإلا أبلغ الـ gateway عن فشل لعمل ما زال يكتمل." },

        { t: "ul",
          en: [
            "Checkout calling a payment provider: idempotency key per order, retry only 429/502/503 plus 500 and 504 when the key is present.",
            "A read API behind a CDN: retry freely on 5xx, because a GET has no side effect and the CDN may serve a stale copy anyway.",
            "A webhook receiver: the sender retries on any non-2xx, so your handler must be idempotent — return 200 for a duplicate event id.",
            "A batch importer against a rate-limited partner: honour Retry-After exactly, and run one worker instead of ten when 429s appear.",
            "Any internal service-to-service call: one retrying layer only, chosen as the caller nearest the failing dependency."
          ],
          ar: [
            "checkout ينادي مزوّد دفع: idempotency key لكل order، وإعادة المحاولة على 429/502/503 فقط، إضافة إلى 500 و504 عند وجود المفتاح.",
            "API للقراءة خلف CDN: أعد المحاولة بحرية على 5xx، لأن الـ GET بلا side effect وقد يقدّم الـ CDN نسخة قديمة أصلاً.",
            "مستقبِل webhook: المرسل يعيد المحاولة على أي استجابة غير 2xx، فيجب أن يكون handler عندك idempotent — أعد 200 لأي حدث بمعرّف مكرّر.",
            "مستورد دفعات ضد partner محدود المعدل: احترم Retry-After بدقة، وشغّل worker واحداً بدل عشرة عند ظهور 429.",
            "أي نداء داخلي بين الخدمات: طبقة واحدة فقط تعيد المحاولة، وتُختار الأقرب للتبعية الفاشلة."
          ] },

        { t: "callout", kind: "warn",
          en: "Check the two timeouts before you tune anything else. If the gateway waits 5 seconds and the service waits 30, every slow request becomes a 504 while the handler keeps running and committing. That single mismatch produces more duplicate writes than any client bug.",
          ar: "افحص الـ timeout الاثنين قبل ضبط أي شيء آخر. فإن انتظر الـ gateway خمس ثوانٍ وانتظرت الخدمة ثلاثين، تحوّل كل request بطيء إلى 504 بينما يظل الـ handler يعمل ويعمل commit. وهذا التعارض وحده ينتج كتابات مكررة أكثر من أي خطأ في العميل." }
      ]
    },
    {
      key: "perf",
      blocks: [
        { t: "kv", rows: [
          { k: { en: "Latency", ar: "Latency" },
            v: { en: "Retries add to the time the caller waits. Three attempts with 2-second gaps turn a 200 ms call into a 4.2-second call before it finally fails.", ar: "الـ retries تُضاف إلى زمن انتظار المنادي. فثلاث محاولات بفواصل ثانيتين تحوّل نداء 200 ms إلى نداء 4.2 ثانية قبل أن يفشل أخيراً." } },
          { k: { en: "Network", ar: "Network" },
            v: { en: "A retried request re-sends the whole body. A 3-attempt policy on a 2 MB upload moves 6 MB, and it moves it while the network is already unhealthy.", ar: "الـ request المُعاد يرسل الـ body كاملاً من جديد. فسياسة بثلاث محاولات على رفع 2 MB تنقل 6 MB، وتنقلها والشبكة متعبة أصلاً." } },
          { k: { en: "Scalability", ar: "Scalability" },
            v: { en: "Retries amplify load exactly during an incident. A dependency failing at 50 percent with 3 attempts receives about double its normal request rate.", ar: "الـ retries تضخّم الحمل تحديداً أثناء الحادثة. فتبعية تفشل بنسبة 50 بالمئة مع ثلاث محاولات تستقبل نحو ضعف معدل requests الطبيعي." } },
          { k: { en: "Memory", ar: "Memory" },
            v: { en: "Every in-flight retry keeps its request buffers, cancellation token and response task alive. A stuck dependency with slow retries grows the number of pending calls until the pool is exhausted.", ar: "كل retry قيد التنفيذ يبقي buffers الـ request والـ cancellation token وtask الاستجابة حية. وتبعية عالقة مع retries بطيئة تزيد عدد النداءات المعلّقة حتى ينفد الـ pool." } },
          { k: { en: "Database", ar: "Database" },
            v: { en: "A duplicate write from a retry doubles rows and can break totals. With an idempotency key it becomes one extra indexed lookup, which is far cheaper than reconciliation.", ar: "الكتابة المكررة الناتجة عن retry تضاعف الصفوف وقد تفسد الإجماليات. ومع idempotency key تتحول إلى بحث واحد إضافي على index، وهو أرخص بكثير من التسوية اليدوية." } }
        ]}
      ]
    },
    {
      key: "debug",
      blocks: [
        { t: "ul",
          en: [
            "Log the status code, the method and the attempt number on every retry — you are looking for POST plus 500 or 504, which is the duplicate-write signature.",
            "Compare request count at the caller with request count at the callee. A gap means retries; a gap that grows during incidents means amplification.",
            "Group your payments table by orderId and amount within a short time window — more than one row per order is a confirmed duplicate.",
            "Read the raw Retry-After header value in a proxy or capture tool, not the parsed one, to see whether the server sent seconds or a date.",
            "Compare the gateway timeout setting with the service timeout setting — if the gateway is smaller, your 504 rate is self-inflicted."
          ],
          ar: [
            "سجّل الـ status code والـ method ورقم المحاولة عند كل retry — فأنت تبحث عن POST مع 500 أو 504، وهي بصمة الكتابة المكررة.",
            "قارن عدد الـ requests عند المنادي بعددها عند المُنادى. الفرق يعني retries، والفرق الذي ينمو أثناء الحوادث يعني تضخيماً.",
            "اعمل group لجدول الـ payments حسب orderId وamount ضمن نافذة زمنية قصيرة — وجود أكثر من صف لكل order هو تكرار مؤكد.",
            "اقرأ قيمة Retry-After الخام في proxy أو أداة التقاط، لا القيمة المحلَّلة، لترى هل أرسل السيرفر ثوانيَ أم تاريخاً.",
            "قارن إعداد timeout في الـ gateway بإعداد timeout في الخدمة — فإن كان الـ gateway أصغر فنسبة 504 عندك من صنعك."
          ] },

        { t: "callout", kind: "tip",
          en: "Add a counter that records retries by status code and by method, and put POST retries on their own line. In a healthy system that line stays near zero. The moment it moves, you know a write path is being repeated, and you know it before a customer tells you.",
          ar: "أضف counter يسجّل الـ retries حسب الـ status code وحسب الـ method، وضع retries الـ POST في سطر مستقل. وفي نظام سليم يبقى هذا السطر قريباً من الصفر. وبمجرد تحركه تعرف أن مسار كتابة يتكرر، وتعرف ذلك قبل أن يخبرك عميل." }
      ]
    },
    {
      key: "realworld",
      blocks: [
        { t: "p",
          en: "Anywhere a request causes money to move, a message to be sent, or stock to be reserved, the retry rule is a product decision and not just a client setting. Teams that get this right usually do the same two things: they decide the rule once in a shared client, and they make write endpoints accept an idempotency key so the rule can be generous without being dangerous.",
          ar: "في أي مكان يتسبب فيه الـ request بتحريك أموال أو إرسال رسالة أو حجز مخزون، تكون قاعدة الـ retry قراراً في المنتج لا مجرد إعداد في العميل. والفرق التي تنجح في ذلك تفعل عادةً شيئين: تقرّر القاعدة مرة واحدة في عميل مشترك، وتجعل endpoints الكتابة تقبل idempotency key حتى تكون القاعدة سخية دون أن تكون خطرة." },

        { t: "ul",
          en: [
            "Payment platforms: every charge endpoint takes an idempotency key, and the key is stored with the response for at least 24 hours.",
            "E-commerce checkout: reserving stock is retried only with a reservation id, because a duplicate reservation blocks inventory nobody bought.",
            "Messaging and notification systems: senders retry aggressively, so receivers deduplicate on a message id and return 200 for repeats.",
            "Partner and open-banking integrations: strict rate limits mean Retry-After is the contract, and ignoring it gets a client suspended rather than throttled."
          ],
          ar: [
            "منصات الدفع: كل endpoint للخصم يقبل idempotency key، ويُخزَّن المفتاح مع الاستجابة 24 ساعة على الأقل.",
            "checkout التجارة الإلكترونية: حجز المخزون يُعاد فقط مع reservation id، لأن الحجز المكرر يعطّل مخزوناً لم يشتره أحد.",
            "أنظمة الرسائل والإشعارات: المرسلون يعيدون المحاولة بقوة، فيمنع المستقبلون التكرار عبر message id ويعيدون 200 للمكرر.",
            "تكاملات الـ partners والـ open banking: الحدود الصارمة تجعل Retry-After عقداً، وتجاهله يؤدي إلى إيقاف العميل لا مجرد إبطائه."
          ] }
      ]
    },
    {
      key: "exercises",
      blocks: [
        { t: "ex", diff: "easy",
          en: "Write the ShouldRetry function from this lesson and unit test it. It is correct when GET plus 500 returns true, POST plus 500 returns false, POST plus 503 returns true, and POST plus 400 returns false.",
          ar: "اكتب دالة ShouldRetry من هذا الدرس واختبرها بـ unit tests. تكون صحيحة عندما يعيد GET مع 500 قيمة true، وPOST مع 500 قيمة false، وPOST مع 503 قيمة true، وPOST مع 400 قيمة false." },

        { t: "ex", diff: "medium",
          en: "Build a test endpoint that returns 429 with Retry-After set once to 3 and once to a date three seconds in the future. Write a client that honours both forms. It is correct when both cases wait about three seconds and neither throws a parse error.",
          ar: "ابنِ endpoint اختباري يعيد 429 مع Retry-After بقيمة 3 مرة وبتاريخ بعد ثلاث ثوانٍ مرة. واكتب عميلاً يحترم الشكلين. يكون صحيحاً عندما تنتظر الحالتان نحو ثلاث ثوانٍ ولا يرمي أي منهما خطأ تحليل." },

        { t: "ex", diff: "hard",
          en: "Add idempotency keys to a POST endpoint: store the key and the response body in the same transaction as the insert. Then fire the same request three times concurrently. It is correct when the table has exactly one row and all three responses are byte-identical.",
          ar: "أضف idempotency keys إلى endpoint من نوع POST: خزّن المفتاح وجسم الاستجابة في نفس الـ transaction الذي يحوي الـ insert. ثم أطلق نفس الـ request ثلاث مرات بالتوازي. يكون صحيحاً عندما يحوي الجدول صفاً واحداً بالضبط وتكون الاستجابات الثلاث متطابقة بايتاً ببايت." },

        { t: "ex", diff: "senior",
          en: "Simulate a dependency failing 50 percent of the time under 200 requests per second, with three attempts and no jitter. Record the request rate at the dependency. Then add jitter and a retry budget of ten percent and record it again. It is correct when you can state, with numbers, how much load each control removed.",
          ar: "حاكِ تبعية تفشل بنسبة 50 بالمئة تحت 200 request في الثانية، مع ثلاث محاولات وبلا jitter. وسجّل معدل الـ requests عند التبعية. ثم أضف jitter وretry budget بعشرة بالمئة وسجّله مجدداً. يكون صحيحاً عندما تستطيع أن تذكر بالأرقام كم حملاً أزاله كل ضابط." }
      ]
    },
    {
      key: "refs",
      blocks: [
        { t: "ref", label: { en: "RFC 9110 — HTTP Semantics: status codes, idempotency, Retry-After", ar: "RFC 9110 — دلالات HTTP: status codes والـ idempotency وRetry-After" }, url: "https://www.rfc-editor.org/rfc/rfc9110.html", meta: { en: "Spec", ar: "مواصفة" } },
        { t: "ref", label: { en: "Building resilient HTTP apps in .NET", ar: "بناء تطبيقات HTTP مرنة في .NET" }, url: "https://learn.microsoft.com/en-us/dotnet/core/resilience/http-resilience", meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref", label: { en: "Retry pattern — Azure Architecture Center", ar: "نمط Retry — Azure Architecture Center" }, url: "https://learn.microsoft.com/en-us/azure/architecture/patterns/retry", meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref", label: { en: "Timeouts, retries and backoff with jitter — AWS Builders Library", ar: "المُهل وإعادة المحاولة والتراجع مع jitter — AWS Builders Library" }, url: "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/", meta: { en: "Article", ar: "مقالة" } }
      ]
    }
  ],
  quiz: [
    {
      q: { en: "A POST that creates a payment comes back with 503 Service Unavailable. Is retrying safe?", ar: "POST ينشئ payment يرجع بكود 503 Service Unavailable. هل إعادة المحاولة آمنة؟" },
      options: [
        { en: "No — any 5xx may mean the work already happened.", ar: "لا — أي 5xx قد يعني أن العمل حدث بالفعل." },
        { en: "Yes — 503 is sent before the handler runs, so nothing changed.", ar: "نعم — الـ 503 يُرسل قبل تشغيل الـ handler، فلم يتغير شيء." },
        { en: "Only if the response includes Retry-After.", ar: "فقط إذا كانت الاستجابة تحوي Retry-After." },
        { en: "Only for GET requests, never for POST.", ar: "فقط لطلبات GET، وأبداً لـ POST." }
      ],
      correct: 1,
      why: { en: "503 means the server is refusing work right now — the load balancer or the server itself answered before your handler ran. No payments row was written, so sending the request again cannot duplicate anything. Retry-After makes the wait smarter but is not what makes the retry safe.", ar: "الـ 503 يعني أن السيرفر يرفض العمل الآن — فقد ردّ الـ load balancer أو السيرفر نفسه قبل تشغيل الـ handler. ولم يُكتب أي صف payments، فإعادة الإرسال لا يمكن أن تكرّر شيئاً. والـ Retry-After يجعل الانتظار أذكى لكنه ليس سبب أمان إعادة المحاولة." }
    },
    {
      q: { en: "Why is 504 Gateway Timeout dangerous to retry on a POST?", ar: "لماذا تكون إعادة المحاولة عند 504 Gateway Timeout خطرة على POST؟" },
      options: [
        { en: "Because the gateway blocks the second attempt.", ar: "لأن الـ gateway يحجب المحاولة الثانية." },
        { en: "Because 504 always means the server rejected the request.", ar: "لأن 504 يعني دائماً أن السيرفر رفض الـ request." },
        { en: "Because the gateway gave up waiting while the server may still finish the work.", ar: "لأن الـ gateway استسلم عن الانتظار بينما قد ينهي السيرفر العمل فعلاً." },
        { en: "Because 504 responses have no body to inspect.", ar: "لأن استجابات 504 بلا body يمكن فحصه." }
      ],
      correct: 2,
      why: { en: "504 describes the proxy's patience, not the outcome of the work. The handler behind it can still commit its transaction a second later. So the first attempt may succeed after you already sent the second one, and both charge the card.", ar: "الـ 504 يصف صبر الـ proxy لا نتيجة العمل. والـ handler خلفه قد يعمل commit لـ transaction بعد ثانية. فقد تنجح المحاولة الأولى بعد أن أرسلت الثانية، فتخصم البطاقة مرتين." }
    },
    {
      q: { en: "Which value can Retry-After legally contain?", ar: "أي قيمة يمكن أن يحملها Retry-After بشكل قانوني؟" },
      options: [
        { en: "Only a number of seconds.", ar: "عدد ثوانٍ فقط." },
        { en: "Either a number of seconds or an HTTP date.", ar: "إما عدد ثوانٍ وإما HTTP date." },
        { en: "Only a Unix timestamp in milliseconds.", ar: "طابع زمني Unix بالميلي ثانية فقط." },
        { en: "A percentage of the server's remaining capacity.", ar: "نسبة مئوية من السعة المتبقية للسيرفر." }
      ],
      correct: 1,
      why: { en: "Both forms are legal on any response, and gateways emit the date form regularly. Code that only calls int.Parse throws on the date form. In .NET, HttpResponseHeaders.RetryAfter exposes Delta for the seconds form and Date for the date form.", ar: "الشكلان قانونيان على أي استجابة، والـ gateways تصدر شكل التاريخ بانتظام. والكود الذي ينادي int.Parse فقط يرمي exception على شكل التاريخ. وفي .NET يوفّر HttpResponseHeaders.RetryAfter خاصية Delta لشكل الثواني وDate لشكل التاريخ." }
    },
    {
      q: { en: "What makes a POST safe to retry after a 500?", ar: "ما الذي يجعل POST آمناً لإعادة المحاولة بعد 500؟" },
      options: [
        { en: "Waiting longer between attempts.", ar: "الانتظار مدة أطول بين المحاولات." },
        { en: "Limiting the policy to two attempts instead of three.", ar: "تحديد السياسة بمحاولتين بدل ثلاث." },
        { en: "An idempotency key the server stores and deduplicates on.", ar: "idempotency key يخزّنه السيرفر ويمنع به التكرار." },
        { en: "Sending the retry over a brand new connection.", ar: "إرسال إعادة المحاولة عبر connection جديد تماماً." }
      ],
      correct: 2,
      why: { en: "Only the server can make the repeat harmless. It stores the client-generated key alongside the response, in the same transaction as the side effect, and returns the stored response when the key comes back. Longer waits and fewer attempts reduce how often you duplicate, not whether you can.", ar: "السيرفر وحده يستطيع جعل التكرار غير ضار. فهو يخزّن المفتاح الذي أنشأه العميل مع الاستجابة، في نفس الـ transaction الذي يحوي الـ side effect، ويعيد الاستجابة المخزّنة عند عودة المفتاح. أما الانتظار الأطول والمحاولات الأقل فتقلّل تكرار المشكلة لا إمكانها." }
    },
    {
      q: { en: "A mobile app, a gateway and a service each retry three times. What is the effect on a failing dependency?", ar: "تطبيق موبايل وgateway وخدمة، كلٌّ يعيد المحاولة ثلاث مرات. ما الأثر على تبعية فاشلة؟" },
      options: [
        { en: "Up to 27 requests reach it for one user action.", ar: "يصلها حتى 27 request لإجراء مستخدم واحد." },
        { en: "Nine requests, because the layers share a budget.", ar: "تسعة requests، لأن الطبقات تتشارك budget واحداً." },
        { en: "Three requests — only the innermost layer actually retries.", ar: "ثلاثة requests — فالطبقة الداخلية وحدها تعيد المحاولة فعلاً." },
        { en: "No change, since retries only fire on 4xx.", ar: "لا تغيير، لأن الـ retries تعمل على 4xx فقط." }
      ],
      correct: 0,
      why: { en: "Retries multiply rather than add: three layers of three attempts is three times three times three. The extra load keeps the dependency slow, which produces more timeouts and more retries. Pick one layer to retry at, normally the caller nearest the failing dependency, and make the others fail fast.", ar: "الـ retries تتضاعف ولا تُجمع: ثلاث طبقات بثلاث محاولات تعني ثلاثة في ثلاثة في ثلاثة. والحمل الزائد يبقي التبعية بطيئة، فينتج timeouts أكثر وretries أكثر. اختر طبقة واحدة لإعادة المحاولة، وهي عادةً المنادي الأقرب للتبعية الفاشلة، واجعل البقية تفشل بسرعة." }
    }
  ]
};
```

NEXT: stateless-why
