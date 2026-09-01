```js
const retriesLesson = {
  id: "retries",
  moduleId: "distributed",
  title: { en: "Retries, backoff and jitter", ar: "إعادة المحاولة والتراجع والـ jitter" },
  summary: {
    en: "How to retry a failed network call so it helps your users instead of finishing off an already struggling service.",
    ar: "كيف تعيد محاولة call فاشل عبر الشبكة بحيث يساعد المستخدمين بدل أن يجهز على service متعب أصلاً."
  },
  mins: 15,
  sections: [
    { key: "why", blocks: [
      { t: "p",
        en: "A retry means: the call failed, so send it again. Over a network, many failures are temporary — a dropped packet, a server restarting, a brief overload. Sending the same request a second time often works. Retrying is the cheapest way to turn a temporary failure into a success the user never sees.",
        ar: "الـ retry تعني: الـ call فشل، فأرسله مرة أخرى. عبر الشبكة، كثير من حالات الفشل مؤقتة — packet ضاعت، أو server يعيد التشغيل، أو ضغط قصير. إرسال نفس الـ request مرة ثانية ينجح غالباً. إعادة المحاولة هي أرخص طريقة لتحويل فشل مؤقت إلى نجاح لا يراه المستخدم أبداً." },

      { t: "kv", rows: [
        { k: { en: "Transient failure", ar: "Transient failure" },
          v: { en: "A failure that goes away on its own within seconds — a timeout, a 503, a reset connection. The opposite is a permanent failure like 400 Bad Request, which will fail identically forever.", ar: "فشل يزول من تلقاء نفسه خلال ثوانٍ — timeout أو 503 أو connection مقطوع. عكسه الفشل الدائم مثل 400 Bad Request الذي سيفشل بنفس الشكل دائماً." } },
        { k: { en: "Backoff", ar: "Backoff" },
          v: { en: "Waiting before you retry, and waiting longer before each further retry. It gives the other side time to recover.", ar: "الانتظار قبل إعادة المحاولة، ثم انتظار أطول قبل كل محاولة تالية. يعطي الطرف الآخر وقتاً ليتعافى." } },
        { k: { en: "Exponential backoff", ar: "Exponential backoff" },
          v: { en: "A backoff where the wait doubles each attempt: 1s, 2s, 4s, 8s. The formula is base × 2^attempt.", ar: "backoff يتضاعف فيه الانتظار كل محاولة: 1s ثم 2s ثم 4s ثم 8s. المعادلة هي base × 2^attempt." } },
        { k: { en: "Jitter", ar: "Jitter" },
          v: { en: "A random amount added to or subtracted from the wait, so that many clients do not all retry at the same instant.", ar: "مقدار عشوائي يُضاف إلى الانتظار أو يُطرح منه، حتى لا يعيد كل الـ clients المحاولة في نفس اللحظة." } },
        { k: { en: "Thundering herd", ar: "Thundering herd" },
          v: { en: "Thousands of clients all hitting a service at the same moment. Usually happens when they all failed together and all retry on the same schedule.", ar: "آلاف الـ clients تضرب service في نفس اللحظة. يحدث عادة عندما تفشل كلها معاً وتعيد المحاولة على نفس الجدول." } },
        { k: { en: "Idempotent", ar: "Idempotent" },
          v: { en: "An operation you can run twice and the end result is the same as running it once. Deleting order 42 is idempotent; charging a card is not.", ar: "عملية يمكنك تنفيذها مرتين وتكون النتيجة النهائية كأنك نفذتها مرة واحدة. حذف الـ order رقم 42 idempotent؛ خصم مبلغ من بطاقة ليس كذلك." } }
      ]},

      { t: "p",
        en: "The running example for this whole lesson is a checkout endpoint. Your API receives POST /checkout, and to complete it, it calls a payment provider at POST /v1/charges over the internet. That provider is a separate company, on separate hardware, reached over a network you do not control. Roughly 1 call in 500 fails for reasons that have nothing to do with your request being wrong. Without retries, 1 customer in 500 sees \"payment failed\" and leaves.",
        ar: "المثال الجاري في هذا الدرس كله هو checkout endpoint. الـ API عندك يستقبل POST /checkout، ولإتمامه ينادي payment provider على POST /v1/charges عبر الإنترنت. هذا الـ provider شركة أخرى، على hardware آخر، تصل إليه عبر شبكة لا تتحكم بها. تقريباً call واحد من كل 500 يفشل لأسباب لا علاقة لها بكون الـ request خاطئاً. بدون retries، زبون من كل 500 يرى «فشل الدفع» ويغادر." },

      { t: "p",
        en: "The everyday analogy: you call a friend and the line drops mid-sentence. You call again — that is a retry. If the line drops again you wait a bit before trying a third time, because calling instantly five times in a row does not help. And if a whole stadium loses signal at once, everyone redialling at the exact same second keeps the cell tower down. That last part is the thundering herd, and jitter is everyone waiting a slightly different amount of time.",
        ar: "التشبيه اليومي: تتصل بصديق فينقطع الخط في منتصف الجملة. تتصل مرة أخرى — هذا retry. إذا انقطع الخط ثانية تنتظر قليلاً قبل المحاولة الثالثة، لأن الاتصال خمس مرات متتالية فوراً لا يفيد. وإذا فقد ملعب كامل الإشارة دفعة واحدة، فإعادة الجميع الاتصال في نفس الثانية بالضبط تُبقي برج الاتصال ساقطاً. هذا الجزء الأخير هو الـ thundering herd، والـ jitter هو أن ينتظر كل واحد مدة مختلفة قليلاً." },

      { t: "callout", kind: "warn",
        en: "A retry is a second copy of your request. If the first copy actually reached the server and only the response was lost, you have now asked it to do the work twice. This is why retries and idempotency always show up together.",
        ar: "الـ retry هي نسخة ثانية من الـ request. إذا كانت النسخة الأولى وصلت فعلاً إلى الـ server وضاع الـ response فقط، فأنت الآن طلبت منه تنفيذ العمل مرتين. لهذا يظهر الـ retries والـ idempotency معاً دائماً." }
    ]},

    { key: "problem", blocks: [
      { t: "p",
        en: "Start with no retries at all. Your checkout endpoint calls the payment provider once. The provider is healthy 99.8% of the time, so 0.2% of checkouts fail — 2 in every 1000. At 50,000 checkouts a day that is 100 angry customers a day, most of whom would have succeeded if you had simply asked again half a second later.",
        ar: "ابدأ بلا retries إطلاقاً. الـ checkout endpoint ينادي الـ payment provider مرة واحدة. الـ provider سليم 99.8% من الوقت، إذن 0.2% من عمليات الـ checkout تفشل — 2 من كل 1000. عند 50,000 checkout يومياً هذا يعني 100 زبون غاضب يومياً، معظمهم كان سينجح لو سألت مرة أخرى بعد نصف ثانية." },

      { t: "p",
        en: "Now add the naive fix that everyone writes first: retry three times immediately, no waiting. On a normal day this works and the failure rate drops to almost zero. Then the provider has a real incident and starts failing every request. Your service, which was sending 200 requests per second, now sends 800 — the original request plus three retries, all within a few milliseconds. You have quadrupled the load on a service that is already on fire. The provider takes longer to recover because of you, and your own threads are all blocked waiting on it, so your unrelated endpoints start timing out too.",
        ar: "الآن أضف الحل الساذج الذي يكتبه الجميع أولاً: أعد المحاولة ثلاث مرات فوراً بلا انتظار. في يوم عادي ينجح هذا وتنزل نسبة الفشل إلى شبه الصفر. ثم يقع عند الـ provider عطل حقيقي ويبدأ بإفشال كل request. الـ service عندك الذي كان يرسل 200 request في الثانية صار يرسل 800 — الـ request الأصلي وثلاث retries، كلها خلال ميلي ثوانٍ قليلة. لقد ضاعفت الحمل أربع مرات على service مشتعل أصلاً. الـ provider يتأخر في التعافي بسببك، وكل الـ threads عندك محجوزة في انتظاره، فتبدأ endpoints أخرى لا علاقة لها بالموضوع في الـ timeout أيضاً." },

      { t: "kv", rows: [
        { k: { en: "No retry", ar: "بلا retry" },
          v: { en: "0.2% of checkouts fail on a good day. On a bad day you fail exactly as much as the provider does — no better, no worse.", ar: "0.2% من عمليات الـ checkout تفشل في يوم جيد. في يوم سيئ تفشل بنفس قدر فشل الـ provider تماماً — لا أفضل ولا أسوأ." } },
        { k: { en: "Immediate retry ×3", ar: "retry فوري ×3" },
          v: { en: "Good day: ~0.000008% fail — effectively zero. Bad day: you send 4× the traffic and make the outage longer.", ar: "يوم جيد: يفشل ~0.000008% — صفر عملياً. يوم سيئ: ترسل 4 أضعاف الـ traffic وتُطيل العطل." } },
        { k: { en: "Exponential backoff + jitter ×3", ar: "Exponential backoff + jitter ×3" },
          v: { en: "Good day: same near-zero failure rate. Bad day: retries are spread over ~7 seconds and across clients, so the extra load is a trickle, not a spike.", ar: "يوم جيد: نفس نسبة الفشل القريبة من الصفر. يوم سيئ: الـ retries موزعة على ~7 ثوانٍ وعلى الـ clients، فالحمل الإضافي تسريب بطيء لا ذروة." } },
        { k: { en: "Cost of the good version", ar: "تكلفة النسخة الجيدة" },
          v: { en: "A checkout that fails twice now takes ~3 s longer than one that succeeds first try. You are trading worst-case latency for a much higher success rate.", ar: "الـ checkout الذي يفشل مرتين صار يستغرق ~3 ثوانٍ أطول من الذي ينجح من أول محاولة. أنت تقايض latency الحالة الأسوأ مقابل نسبة نجاح أعلى بكثير." } }
      ]},

      { t: "p",
        en: "So the real problem is not \"should I retry\". It is: retry only the failures that can succeed on a second try, wait between attempts so the other side can breathe, randomise the waits so your clients do not all arrive together, and put a hard ceiling on how much retry traffic you are willing to generate.",
        ar: "إذن المشكلة الحقيقية ليست «هل أعيد المحاولة». هي: أعد المحاولة فقط على حالات الفشل التي يمكن أن تنجح في محاولة ثانية، وانتظر بين المحاولات ليتنفس الطرف الآخر، وعشوِ الانتظارات حتى لا يصل كل الـ clients معاً، وضع سقفاً صارماً لكمية traffic الـ retry التي تقبل توليدها." }
    ]},

    { key: "internals", blocks: [
      { t: "p",
        en: "A retry policy is a small loop wrapped around your call. Every time through the loop it answers three questions in this order: did the call fail in a way worth retrying, am I still allowed another attempt, and how long should I sleep first. Everything else — Polly, Microsoft.Extensions.Http.Resilience, the AWS SDK's built-in retryer — is that same loop with better defaults.",
        ar: "الـ retry policy هي loop صغيرة تلتف حول الـ call عندك. في كل دورة تجيب على ثلاثة أسئلة بهذا الترتيب: هل فشل الـ call بطريقة تستحق إعادة المحاولة، وهل ما زال مسموحاً لي بمحاولة أخرى، وكم يجب أن أنام أولاً. كل ما عدا ذلك — Polly أو Microsoft.Extensions.Http.Resilience أو الـ retryer المدمج في AWS SDK — هو نفس هذه الـ loop بإعدادات افتراضية أفضل." },

      { t: "kv", rows: [
        { k: { en: "Classifier", ar: "Classifier" },
          v: { en: "The rule that decides retryable vs not. Usually: retry on network errors, request timeouts, HTTP 408, 429, 502, 503, 504. Do not retry 400, 401, 403, 404, 422 — those mean your request itself is wrong.", ar: "القاعدة التي تقرر ما إذا كان الفشل قابلاً لإعادة المحاولة. عادة: أعد المحاولة على أخطاء الشبكة والـ request timeouts و HTTP 408 و429 و502 و503 و504. لا تعد المحاولة على 400 و401 و403 و404 و422 — هذه تعني أن الـ request نفسه خاطئ." } },
        { k: { en: "Attempt budget", ar: "Attempt budget" },
          v: { en: "The maximum number of extra tries, typically 2-3. \"3 retries\" means 4 total calls including the first one.", ar: "أقصى عدد محاولات إضافية، عادة 2-3. «3 retries» تعني 4 calls إجمالاً بما فيها الأولى." } },
        { k: { en: "Per-attempt timeout", ar: "Per-attempt timeout" },
          v: { en: "How long one single call may hang before you give up on it and count it as a failure.", ar: "كم يجوز لـ call واحد أن يتعلق قبل أن تتخلى عنه وتعتبره فشلاً." } },
        { k: { en: "Overall deadline", ar: "Overall deadline" },
          v: { en: "The total time the whole operation — first call plus every retry plus every sleep — is allowed to take. When it expires you stop, even if attempts remain.", ar: "الوقت الكلي المسموح للعملية كلها — الـ call الأول وكل retry وكل نوم بينها. عند انتهائه تتوقف، حتى لو بقيت محاولات." } },
        { k: { en: "Delay generator", ar: "Delay generator" },
          v: { en: "The function that turns \"this is attempt number 3\" into \"sleep 4.2 seconds\". This is where backoff and jitter live.", ar: "الدالة التي تحوّل «هذه المحاولة رقم 3» إلى «نم 4.2 ثانية». هنا يعيش الـ backoff والـ jitter." } },
        { k: { en: "Retry-After", ar: "Retry-After" },
          v: { en: "A response header the server may send with 429 or 503, saying how many seconds to wait. If it is present, obey it instead of your own formula.", ar: "ترويسة response قد يرسلها الـ server مع 429 أو 503، تقول كم ثانية تنتظر. إذا كانت موجودة فاتبعها بدل معادلتك أنت." } }
      ]},

      { t: "p",
        en: "Trace one real checkout. The customer submits, and at t=0 your code calls POST /v1/charges with a 2-second per-attempt timeout and a 10-second overall deadline. The provider is overloaded and the socket produces nothing for 2 seconds, so the timeout fires and the call is cancelled — attempt 1 failed. The classifier sees a cancellation caused by timeout, which is retryable. The delay generator computes a base wait of 1 s and multiplies it by a random number between 0 and 1, giving 0.62 s. At t=2.62 attempt 2 goes out and comes back in 300 ms with HTTP 503 — retryable again. Base wait doubles to 2 s, random factor gives 1.4 s. At t=4.32 attempt 3 goes out and returns 200 OK. The customer waited 4.6 seconds and saw a successful checkout; nobody paged anybody.",
        ar: "تتبّع عملية checkout حقيقية واحدة. الزبون يضغط الشراء، وعند t=0 ينادي الكود عندك POST /v1/charges بـ per-attempt timeout قدره ثانيتان و overall deadline قدره 10 ثوانٍ. الـ provider محمّل زيادة والـ socket لا ينتج شيئاً لثانيتين، فينطلق الـ timeout ويُلغى الـ call — فشلت المحاولة 1. الـ classifier يرى إلغاءً سببه timeout، وهو قابل لإعادة المحاولة. الـ delay generator يحسب انتظاراً أساسياً قدره 1s ويضربه في رقم عشوائي بين 0 و1، فينتج 0.62s. عند t=2.62 تخرج المحاولة 2 وتعود بعد 300ms بـ HTTP 503 — قابلة لإعادة المحاولة أيضاً. الانتظار الأساسي يتضاعف إلى 2s، والعامل العشوائي يعطي 1.4s. عند t=4.32 تخرج المحاولة 3 وتعود بـ 200 OK. الزبون انتظر 4.6 ثانية ورأى checkout ناجحاً؛ ولم يستدعِ أحد أحداً." },

      { t: "p",
        en: "The random factor in that trace is called full jitter: sleep a random amount between zero and the exponential value, rather than exactly the exponential value. Here is why it matters. Picture 1000 people whose flights were all cancelled by the same storm, all told to call the airline back in 10 minutes. If they obey exactly, the phone system dies again in 10 minutes. If each is told \"call back sometime in the next 10 minutes\", the calls spread out and the system survives. Full jitter is that second instruction, applied to servers.",
        ar: "العامل العشوائي في هذا التتبّع اسمه full jitter: نَم مدة عشوائية بين الصفر والقيمة الأسية، بدل القيمة الأسية بالضبط. وإليك سبب أهميته. تخيل 1000 شخص أُلغيت رحلاتهم بسبب نفس العاصفة، وقيل لهم جميعاً عاودوا الاتصال بالشركة بعد 10 دقائق. إذا التزموا بالضبط، يسقط نظام الهاتف مرة أخرى بعد 10 دقائق. أما إذا قيل لكل واحد «عاود الاتصال في أي وقت خلال العشر دقائق القادمة»، فتتوزع المكالمات وينجو النظام. الـ full jitter هو التعليمة الثانية، مطبقة على الـ servers." },

      { t: "code", lang: "csharp",
        label: { en: "The loop, written out so nothing is hidden", ar: "الـ loop مكتوبة بالكامل حتى لا يختفي شيء" },
        code: "// This is what a retry library does for you. Written by hand once, so you\n// can see every decision it makes.\nasync Task<HttpResponseMessage> ChargeAsync(ChargeRequest req, CancellationToken ct)\n{\n    const int maxRetries = 3;          // 4 calls total, worst case\n    var baseDelay = TimeSpan.FromSeconds(1);\n\n    // Overall deadline: the whole operation, retries and sleeps included.\n    using var overall = CancellationTokenSource.CreateLinkedTokenSource(ct);\n    overall.CancelAfter(TimeSpan.FromSeconds(10));\n\n    for (var attempt = 0; ; attempt++)\n    {\n        // Per-attempt timeout: this one call may hang for 2s, no more.\n        using var perAttempt = CancellationTokenSource\n            .CreateLinkedTokenSource(overall.Token);\n        perAttempt.CancelAfter(TimeSpan.FromSeconds(2));\n\n        HttpResponseMessage? res = null;\n        try\n        {\n            res = await _http.PostAsJsonAsync(\"/v1/charges\", req, perAttempt.Token);\n            if (!IsRetryable(res.StatusCode)) return res;   // success, or a permanent error\n        }\n        catch (HttpRequestException) { /* connection refused / reset - retryable */ }\n        catch (OperationCanceledException) when (!ct.IsCancellationRequested\n                                              && !overall.IsCancellationRequested)\n        { /* per-attempt timeout - retryable */ }\n\n        // Out of attempts, or the caller/deadline gave up: surface the last result.\n        if (attempt >= maxRetries || overall.IsCancellationRequested)\n            return res ?? throw new TimeoutException(\"charge failed after retries\");\n\n        var delay = ComputeDelay(attempt, baseDelay, res);\n        await Task.Delay(delay, overall.Token);\n        res?.Dispose();\n    }\n}\n\nstatic bool IsRetryable(HttpStatusCode c) =>\n    c == HttpStatusCode.RequestTimeout          // 408\n    || (int)c == 429                            // too many requests\n    || c == HttpStatusCode.BadGateway            // 502\n    || c == HttpStatusCode.ServiceUnavailable    // 503\n    || c == HttpStatusCode.GatewayTimeout;       // 504\n\nstatic TimeSpan ComputeDelay(int attempt, TimeSpan base_, HttpResponseMessage? res)\n{\n    // The server told us how long to wait - always prefer that.\n    var after = res?.Headers.RetryAfter?.Delta;\n    if (after is not null) return after.Value;\n\n    // Full jitter: random between 0 and base * 2^attempt, capped at 20s.\n    var ceiling = Math.Min(base_.TotalMilliseconds * Math.Pow(2, attempt), 20_000);\n    return TimeSpan.FromMilliseconds(Random.Shared.NextDouble() * ceiling);\n}" },

      { t: "p",
        en: "Two details in that code are easy to miss and both cause outages. First, the per-attempt timeout is a linked token, so cancelling the overall deadline also cancels the in-flight call — without the link, a hung call would ignore your 10-second deadline entirely. Second, the catch for OperationCanceledException checks who did the cancelling. If the user closed the browser or the overall deadline expired, that is not a transient failure and retrying is wrong; only a per-attempt timeout is retryable.",
        ar: "تفصيلتان في هذا الكود يسهل تفويتهما وكلتاهما تسبب أعطالاً. الأولى: الـ per-attempt timeout هو linked token، فإلغاء الـ overall deadline يلغي أيضاً الـ call الجاري — بدون هذا الربط، سيتجاهل call معلّق مهلتك ذات العشر ثوانٍ تماماً. الثانية: الـ catch الخاص بـ OperationCanceledException يتحقق ممن قام بالإلغاء. إذا أغلق المستخدم المتصفح أو انتهى الـ overall deadline فهذا ليس فشلاً مؤقتاً وإعادة المحاولة خطأ؛ فقط الـ per-attempt timeout قابل لإعادة المحاولة." },

      { t: "code", lang: "csharp",
        label: { en: "The same policy using the built-in resilience package", ar: "نفس الـ policy باستخدام حزمة الـ resilience المدمجة" },
        code: "// dotnet add package Microsoft.Extensions.Http.Resilience\nbuilder.Services.AddHttpClient<PaymentClient>(c =>\n{\n    c.BaseAddress = new Uri(\"https://api.payments.example\");\n})\n.AddResilienceHandler(\"payments\", b =>\n{\n    b.AddTimeout(TimeSpan.FromSeconds(10));            // overall deadline (outermost)\n\n    b.AddRetry(new HttpRetryStrategyOptions\n    {\n        MaxRetryAttempts = 3,\n        BackoffType      = DelayBackoffType.Exponential,\n        UseJitter        = true,                       // spreads clients apart\n        Delay            = TimeSpan.FromSeconds(1),\n        ShouldRetryAfterHeader = true                  // obey Retry-After when sent\n    });\n\n    b.AddTimeout(TimeSpan.FromSeconds(2));             // per-attempt (innermost)\n});\n\n// Order matters: the outer timeout wraps all retries, the inner one wraps a\n// single attempt. Swap them and every retry gets the full 10 seconds." }
    ]},
    { key: "tradeoffs", blocks: [
      { t: "tradeoff",
        pros: {
          en: [
            "Turns most short-lived network failures into successes the user never notices.",
            "Cheap: a few lines of configuration, no new infrastructure to run.",
            "Backoff plus jitter lets a struggling service recover instead of being hammered.",
            "Retry-After lets the server itself set the pace when it knows best."
          ],
          ar: [
            "تحوّل معظم أعطال الشبكة قصيرة العمر إلى نجاحات لا يلاحظها المستخدم.",
            "رخيصة: أسطر إعدادات قليلة، بلا infrastructure جديدة تشغّلها.",
            "الـ backoff مع الـ jitter يسمح لـ service متعب أن يتعافى بدل أن يُضرب بلا توقف.",
            "الـ Retry-After يجعل الـ server نفسه يحدد الإيقاع عندما يكون هو الأدرى."
          ]
        },
        cons: {
          en: [
            "Worst-case latency grows: 3 retries with backoff can add 7+ seconds to one request.",
            "Duplicate work if the first attempt actually succeeded and only the response was lost.",
            "Retry traffic multiplies exactly when the system is least able to take it.",
            "Each waiting attempt holds a connection and a request slot in your own service."
          ],
          ar: [
            "أسوأ latency يكبر: 3 retries مع backoff قد تضيف 7 ثوانٍ أو أكثر لـ request واحد.",
            "عمل مكرر إذا كانت المحاولة الأولى نجحت فعلاً وضاع الـ response فقط.",
            "traffic الـ retry يتضاعف بالضبط حين يكون النظام أقل قدرة على تحمّله.",
            "كل محاولة منتظرة تحجز connection و request slot داخل الـ service عندك."
          ]
        },
        limits: {
          en: [
            "Retries cannot fix a permanent error — a 400 will be a 400 forever.",
            "Retrying a non-idempotent write can double-charge a customer.",
            "They do not help when the dependency is down for minutes; that needs a circuit breaker.",
            "Retries inside retries at several layers multiply: 3 × 3 × 3 is 27 calls."
          ],
          ar: [
            "الـ retries لا تصلح خطأ دائماً — الـ 400 سيبقى 400 إلى الأبد.",
            "إعادة محاولة write غير idempotent قد تخصم من الزبون مرتين.",
            "لا تفيد عندما يكون الـ dependency ساقطاً لدقائق؛ هذا يحتاج circuit breaker.",
            "الـ retries المتداخلة عبر عدة طبقات تتضاعف: 3 × 3 × 3 تساوي 27 call."
          ]
        },
        alts: {
          en: [
            "Circuit breaker: stop calling a dependency entirely once it is clearly down.",
            "Queue the work and process it later, instead of retrying while the user waits.",
            "Hedged request: after a delay, send a second call and take whichever answers first.",
            "Fail fast and show a clear message, when a slow success is worse than a quick error."
          ],
          ar: [
            "Circuit breaker: توقف عن مناداة الـ dependency كلياً بمجرد أن يتضح أنه ساقط.",
            "ضع العمل في queue وعالجه لاحقاً، بدل إعادة المحاولة والمستخدم ينتظر.",
            "Hedged request: بعد تأخير، أرسل call ثانياً وخذ أول من يجيب.",
            "الفشل السريع مع رسالة واضحة، حين يكون النجاح البطيء أسوأ من خطأ سريع."
          ]
        }
      }
    ]},

    { key: "mistakes", blocks: [
      { t: "mistake",
        title: { en: "Retrying an error the server will never accept", ar: "إعادة المحاولة على خطأ لن يقبله الـ server أبداً" },
        body: {
          en: "A team wrapped every outgoing call in a policy that retried on any exception. A validation bug started sending an empty currency field, so the provider returned 422 Unprocessable Entity — meaning \"I understood the request and it is invalid\". The policy retried it four times. Traffic to the provider quadrupled, the checkout latency went from 300 ms to 8 seconds because every failure now took four attempts, and the actual bug stayed invisible for a day because the logs were drowning in retry noise. Retry only on transport failures and the 408/429/502/503/504 family.",
          ar: "فريق لفّ كل call صادر بـ policy تعيد المحاولة على أي exception. ظهر bug في الـ validation فصار يرسل حقل currency فارغاً، فأعاد الـ provider 422 Unprocessable Entity — أي «فهمت الـ request وهو غير صالح». الـ policy أعادت المحاولة أربع مرات. تضاعف الـ traffic نحو الـ provider أربع مرات، وارتفع latency الـ checkout من 300ms إلى 8 ثوانٍ لأن كل فشل صار يستغرق أربع محاولات، وبقي الـ bug الحقيقي غير مرئي ليوم كامل لأن الـ logs غرقت في ضجيج الـ retries. أعد المحاولة فقط على أعطال النقل وعائلة 408/429/502/503/504."
        },
        fix: "// Bad: retries a 422 forever\n.Handle<Exception>().RetryAsync(4)\n\n// Good: only transient categories\n.Handle<HttpRequestException>()\n.Or<TimeoutRejectedException>()\n.OrResult<HttpResponseMessage>(r => (int)r.StatusCode is 408 or 429 or 502 or 503 or 504)\n.WaitAndRetryAsync(3, a => Jittered(a));" },

      { t: "mistake",
        title: { en: "Retries stacked at every layer", ar: "retries متراكمة في كل طبقة" },
        body: {
          en: "The mobile app retried 3 times. The API gateway retried 3 times. The service's HttpClient retried 3 times. Each layer looked reasonable on its own, but they multiply: one user tap became up to 3 × 3 × 3 = 27 calls to the payment provider. During a 40-second provider hiccup the provider saw 20× its normal traffic from one customer and rate-limited the whole account. Pick exactly one layer — usually the one closest to the dependency — to own retries, and make every other layer pass the failure straight through.",
          ar: "تطبيق الموبايل يعيد المحاولة 3 مرات. الـ API gateway يعيد 3 مرات. الـ HttpClient داخل الـ service يعيد 3 مرات. كل طبقة تبدو معقولة وحدها، لكنها تتضاعف: ضغطة واحدة من المستخدم صارت حتى 3 × 3 × 3 = 27 call إلى الـ payment provider. خلال تعثر قدره 40 ثانية عند الـ provider، رأى الـ provider 20 ضعف الـ traffic الطبيعي من عميل واحد فطبّق rate limit على الحساب كله. اختر طبقة واحدة بالضبط — عادة الأقرب إلى الـ dependency — لتملك الـ retries، واجعل كل طبقة أخرى تمرر الفشل كما هو."
        } },

      { t: "mistake",
        title: { en: "Exponential backoff with no jitter", ar: "Exponential backoff بلا jitter" },
        body: {
          en: "A service had 600 instances, all calling the same inventory API with backoff of 1s, 2s, 4s. The inventory API restarted, so all 600 failed within the same second. All 600 retried at t+1, again at t+3, again at t+7 — three synchronised spikes of 600 requests each landing on a service that was still starting up. It fell over on each spike and never finished starting. Adding jitter spread those same 600 retries over a full second each time and the restart completed on the first try.",
          ar: "service فيه 600 instance، كلها تنادي نفس الـ inventory API بـ backoff قدره 1s ثم 2s ثم 4s. أعاد الـ inventory API التشغيل، ففشلت الـ 600 كلها خلال نفس الثانية. أعادت الـ 600 كلها المحاولة عند t+1، ثم عند t+3، ثم عند t+7 — ثلاث ذروات متزامنة من 600 request تسقط على service ما زال يقلع. سقط عند كل ذروة ولم يكمل الإقلاع أبداً. إضافة الـ jitter وزّعت نفس الـ 600 retry على ثانية كاملة في كل مرة، فاكتمل إعادة التشغيل من أول محاولة."
        },
        fix: "// No jitter: every client wakes at the same millisecond\nvar delay = TimeSpan.FromSeconds(Math.Pow(2, attempt));\n\n// Full jitter: same average, spread across the window\nvar ceiling = Math.Pow(2, attempt) * 1000;\nvar delay = TimeSpan.FromMilliseconds(Random.Shared.NextDouble() * ceiling);" },

      { t: "mistake",
        title: { en: "Retrying a charge with no idempotency key", ar: "إعادة محاولة خصم بلا idempotency key" },
        body: {
          en: "The first POST /v1/charges reached the provider and the card was charged, but the response was lost on the way back and the client hit its 2-second timeout. The retry sent an identical body, the provider saw a brand-new charge request, and the customer was charged twice. The fix is one header: generate a unique key per logical checkout, send the same key on every attempt, and the provider returns the original result instead of charging again. Never retry a write that has no way to recognise a duplicate.",
          ar: "أول POST /v1/charges وصل إلى الـ provider وتم خصم البطاقة، لكن الـ response ضاع في طريق العودة وبلغ الـ client مهلته البالغة ثانيتين. أرسلت الـ retry نفس الـ body تماماً، فرأى الـ provider طلب خصم جديداً كلياً، وخُصم من الزبون مرتين. الحل ترويسة واحدة: ولّد key فريداً لكل عملية checkout منطقية، وأرسل نفس الـ key في كل محاولة، فيعيد الـ provider النتيجة الأصلية بدل الخصم مرة أخرى. لا تعد أبداً محاولة write لا يملك طريقة للتعرف على النسخة المكررة."
        },
        fix: "// Key generated ONCE per checkout, reused by every attempt.\nvar key = checkout.Id.ToString(\"N\");\nreq.Headers.TryAddWithoutValidation(\"Idempotency-Key\", key);\n\n// Wrong: a new key per attempt makes each retry a brand-new charge.\n// req.Headers.Add(\"Idempotency-Key\", Guid.NewGuid().ToString());" }
    ]},
    { key: "interview", blocks: [
      { t: "qa", level: "junior",
        q: { en: "What is exponential backoff, and why not just retry immediately?", ar: "ما هو الـ exponential backoff، ولماذا لا نعيد المحاولة فوراً فقط؟" },
        a: {
          en: "Exponential backoff means you wait longer before each retry — one second, then two, then four. Retrying immediately usually fails again, because whatever caused the failure has had no time to clear. Worse, if the other service is overloaded, instant retries add load at the exact moment it needs less. Backing off gives it room to recover, and by the time you try again the problem is often gone.",
          ar: "الـ exponential backoff يعني أن تنتظر أطول قبل كل retry — ثانية، ثم ثانيتان، ثم أربع. إعادة المحاولة فوراً تفشل عادة مرة أخرى، لأن سبب الفشل لم يأخذ وقتاً ليزول. والأسوأ أنه إذا كان الـ service الآخر محمّلاً زيادة، فالـ retries الفورية تضيف حملاً في اللحظة التي يحتاج فيها حملاً أقل. الـ backoff يعطيه مساحة للتعافي، وغالباً تكون المشكلة قد زالت حين تحاول مجدداً."
        } },

      { t: "qa", level: "mid",
        q: { en: "Which failures do you retry, and which do you never retry?", ar: "أي حالات فشل تعيد المحاولة عليها، وأيها لا تعيدها أبداً؟" },
        a: {
          en: "I retry things that could plausibly succeed on a second try: connection refused or reset, a per-attempt timeout, and the status codes 408, 429, 502, 503 and 504 — those all mean the server is busy, restarting, or unreachable, not that my request is wrong. I never retry 400, 401, 403, 404 or 422, because the request itself is the problem and sending it again will produce the identical answer. The one extra rule is that for a non-idempotent write like a payment, I only retry if I am sending an idempotency key, otherwise a lost response turns into a double charge.",
          ar: "أعيد المحاولة على ما يمكن منطقياً أن ينجح في محاولة ثانية: connection مرفوض أو مقطوع، أو per-attempt timeout، والأكواد 408 و429 و502 و503 و504 — كلها تعني أن الـ server مشغول أو يعيد التشغيل أو غير قابل للوصول، لا أن الـ request عندي خاطئ. ولا أعيد أبداً على 400 أو 401 أو 403 أو 404 أو 422، لأن الـ request نفسه هو المشكلة وإرساله ثانية سينتج نفس الجواب. القاعدة الإضافية الوحيدة أنه في write غير idempotent مثل الدفع، لا أعيد المحاولة إلا إذا كنت أرسل idempotency key، وإلا تحوّل response ضائع إلى خصم مزدوج."
        } },

      { t: "qa", level: "mid",
        q: { en: "What exactly does jitter fix?", ar: "ما الذي يصلحه الـ jitter بالضبط؟" },
        a: {
          en: "It fixes synchronisation between clients. If a dependency goes down, every caller fails at roughly the same moment, and if they all use the same backoff formula they all retry at the same moment too. That produces sharp spikes — five hundred requests in one millisecond, then nothing for two seconds. The dependency gets knocked over by each spike, so it never recovers. Jitter adds randomness to each wait, so the same total number of retries arrives spread evenly instead of in bursts. The version I use is full jitter: sleep a random amount between zero and the exponential value.",
          ar: "يصلح التزامن بين الـ clients. إذا سقط dependency، يفشل كل المنادين في نفس اللحظة تقريباً، وإذا استخدموا كلهم نفس معادلة الـ backoff فسيعيدون المحاولة في نفس اللحظة أيضاً. هذا ينتج ذروات حادة — خمسمئة request في ميلي ثانية واحدة، ثم لا شيء لثانيتين. الـ dependency يسقط مع كل ذروة فلا يتعافى أبداً. الـ jitter يضيف عشوائية لكل انتظار، فيصل نفس العدد الكلي من الـ retries موزعاً بالتساوي بدل الدفعات. النسخة التي أستخدمها هي full jitter: نَم مدة عشوائية بين الصفر والقيمة الأسية."
        } },

      { t: "qa", level: "senior",
        q: { en: "How do retries and timeouts interact across a chain of services?", ar: "كيف تتفاعل الـ retries والـ timeouts عبر سلسلة من الـ services؟" },
        a: {
          en: "They have to share one budget, decided at the edge. Say the user-facing request has 10 seconds. If service A calls B and B calls C, and each layer sets its own generous timeout and its own three retries, the total work can exceed 10 seconds many times over — and every one of those calls is doing work for a user who already gave up. So I pass a deadline down the chain, each layer gives its downstream call less time than it has left, and only the layer closest to the flaky dependency retries. The rest propagate the failure. If a caller has 800 ms left, there is no point starting a retry that needs 2 seconds.",
          ar: "يجب أن تتشارك ميزانية واحدة تُقرر عند الحافة. لنقل إن الـ request الذي يواجه المستخدم لديه 10 ثوانٍ. إذا نادى service A الـ B ونادى B الـ C، وكل طبقة تضع timeout سخياً خاصاً بها وثلاث retries خاصة بها، فقد يتجاوز العمل الكلي الـ 10 ثوانٍ أضعافاً — وكل هذه الـ calls تعمل من أجل مستخدم استسلم أصلاً. لذلك أمرر deadline إلى أسفل السلسلة، وكل طبقة تعطي الـ call التالي وقتاً أقل مما تبقى لها، وتعيد المحاولة فقط الطبقة الأقرب إلى الـ dependency المتذبذب. الباقي ينشر الفشل. إذا بقي للمنادي 800ms فلا معنى لبدء retry يحتاج ثانيتين."
        } },

      { t: "qa", level: "senior",
        q: { en: "When are retries the wrong tool, and what do you use instead?", ar: "متى تكون الـ retries الأداة الخاطئة، وماذا تستخدم بدلاً منها؟" },
        a: {
          en: "Retries assume the failure is short — seconds, not minutes. When a dependency is properly down, retrying just burns your own threads and connections waiting on something that will not answer, and that is how one broken dependency takes down an otherwise healthy service. There I want a circuit breaker: after a certain failure rate, stop calling for a while and fail immediately, then let one probe request through to check if it recovered. Retries are also wrong when the work does not need to happen right now — if it can be queued and processed later, queue it, because a queue retries for free without a user waiting. And if the dependency is rate-limiting me with 429, the answer is to slow down or ask for more quota, not to retry harder.",
          ar: "الـ retries تفترض أن الفشل قصير — ثوانٍ لا دقائق. عندما يكون الـ dependency ساقطاً فعلاً، إعادة المحاولة تحرق threads و connections عندك في انتظار شيء لن يجيب، وهكذا يُسقط dependency واحد معطّل service سليماً. هنا أريد circuit breaker: بعد نسبة فشل معينة، توقف عن المناداة لفترة وافشل فوراً، ثم اسمح لـ request واحد اختباري بالمرور لترى إن تعافى. الـ retries خاطئة أيضاً حين لا يلزم تنفيذ العمل الآن — إذا أمكن وضعه في queue ومعالجته لاحقاً فضعه، لأن الـ queue تعيد المحاولة مجاناً بلا مستخدم ينتظر. وإذا كان الـ dependency يطبق rate limit ويرد 429، فالجواب أن تبطئ أو تطلب quota أكبر، لا أن تعيد المحاولة بقوة أكبر."
        } },

      { t: "qa", level: "staff",
        q: { en: "How do you stop retry policies from drifting apart across twenty teams?", ar: "كيف تمنع تباعد سياسات الـ retry عبر عشرين فريقاً؟" },
        a: {
          en: "I would not rely on every team reading a wiki page. I would ship the policy as a shared library or a service template — one named HttpClient configuration with sane defaults for classification, backoff, jitter, deadlines and metrics, so the easy path is also the correct one. Then I would make the multiplication problem visible: agree that retries belong to the layer nearest the dependency, and have the gateway pass a header saying it has already retried so nobody stacks a second policy on top. I would also add a retry budget — cap retries at something like ten percent of successful traffic per dependency and emit a metric when it is hit, because that turns an invisible amplification into an alert. Finally I would exercise it: a regular game-day where we make a dependency fail on purpose in staging and check that latency and retry counts behave the way the design says they should.",
          ar: "لن أعتمد على قراءة كل فريق لصفحة wiki. سأشحن الـ policy كمكتبة مشتركة أو service template — إعداد HttpClient واحد مسمّى بقيم افتراضية معقولة للتصنيف والـ backoff والـ jitter والـ deadlines والـ metrics، بحيث يكون الطريق السهل هو الصحيح أيضاً. ثم أجعل مشكلة التضاعف مرئية: نتفق أن الـ retries تخص الطبقة الأقرب إلى الـ dependency، ونجعل الـ gateway يمرر ترويسة تقول إنه أعاد المحاولة أصلاً حتى لا يضيف أحد policy ثانية فوقها. وسأضيف أيضاً retry budget — سقف للـ retries عند نحو عشرة بالمئة من الـ traffic الناجح لكل dependency، مع إصدار metric عند بلوغه، لأن هذا يحوّل تضخماً غير مرئي إلى تنبيه. وأخيراً سأختبره عملياً: game-day دوري نُفشل فيه dependency عمداً في بيئة staging ونتحقق أن الـ latency وأعداد الـ retries تتصرف كما يقول التصميم."
        } }
    ]},

    { key: "codereview", blocks: [
      { t: "review", severity: "high",
        title: { en: "Retry loop with no delay, no classification, no deadline", ar: "retry loop بلا تأخير ولا تصنيف ولا deadline" },
        bad: "for (var i = 0; i < 5; i++)\n{\n    try\n    {\n        return await _http.PostAsJsonAsync(\"/v1/charges\", req);\n    }\n    catch\n    {\n        // try again\n    }\n}\nthrow new Exception(\"charge failed\");",
        good: "// One policy object, applied by the HttpClient pipeline.\nbuilder.Services.AddHttpClient<PaymentClient>()\n    .AddResilienceHandler(\"payments\", b =>\n    {\n        b.AddTimeout(TimeSpan.FromSeconds(10));   // whole operation\n        b.AddRetry(new HttpRetryStrategyOptions\n        {\n            MaxRetryAttempts = 3,\n            BackoffType      = DelayBackoffType.Exponential,\n            UseJitter        = true,\n            Delay            = TimeSpan.FromSeconds(1),\n            ShouldRetryAfterHeader = true\n        });\n        b.AddTimeout(TimeSpan.FromSeconds(2));    // single attempt\n    });",
        why: {
          en: "The bad version retries five times with no wait, so a failing dependency instantly gets six times the traffic. It catches everything, so a 400 caused by our own bug is retried too, and a cancellation from the user is swallowed. There is no overall deadline, so a slow dependency can hold the request open indefinitely. The empty catch also loses the original error, leaving \"charge failed\" as the only clue in the logs.",
          ar: "النسخة السيئة تعيد المحاولة خمس مرات بلا انتظار، فيحصل dependency فاشل فوراً على ستة أضعاف الـ traffic. وهي تلتقط كل شيء، فيُعاد حتى 400 سببه bug عندنا، ويُبتلع إلغاء صادر من المستخدم. ولا يوجد overall deadline، فيستطيع dependency بطيء إبقاء الـ request مفتوحاً بلا نهاية. كما أن الـ catch الفارغ يفقد الخطأ الأصلي، فلا يبقى في الـ logs سوى «charge failed» كدليل وحيد."
        } },

      { t: "review", severity: "medium",
        title: { en: "A fresh idempotency key inside the retry loop", ar: "idempotency key جديد داخل الـ retry loop" },
        bad: "// Called once per attempt by the retry policy\nasync Task<HttpResponseMessage> SendAsync()\n{\n    var msg = new HttpRequestMessage(HttpMethod.Post, \"/v1/charges\")\n    {\n        Content = JsonContent.Create(req)\n    };\n    msg.Headers.Add(\"Idempotency-Key\", Guid.NewGuid().ToString());\n    return await _http.SendAsync(msg);\n}",
        good: "// Key belongs to the checkout, not the attempt.\nasync Task<HttpResponseMessage> SendAsync(string idempotencyKey)\n{\n    var msg = new HttpRequestMessage(HttpMethod.Post, \"/v1/charges\")\n    {\n        Content = JsonContent.Create(req)\n    };\n    msg.Headers.Add(\"Idempotency-Key\", idempotencyKey);   // same on every attempt\n    return await _http.SendAsync(msg);\n}\n\n// caller\nvar key = checkout.Id.ToString(\"N\");\nvar res = await _policy.ExecuteAsync(_ => SendAsync(key), CancellationToken.None);",
        why: {
          en: "An idempotency key is how the provider recognises \"this is the same logical operation you already asked me about\". Generating a new Guid on each attempt defeats that completely — every retry looks like a brand-new charge. The bug is silent while the network is healthy and only appears the first time a response is lost, which is exactly the case retries exist for.",
          ar: "الـ idempotency key هو ما يجعل الـ provider يتعرف على أن «هذه نفس العملية المنطقية التي سألتني عنها سابقاً». توليد Guid جديد في كل محاولة يبطل ذلك تماماً — كل retry تبدو خصماً جديداً كلياً. الـ bug صامت ما دامت الشبكة سليمة ولا يظهر إلا أول مرة يضيع فيها response، وهي بالضبط الحالة التي وُجدت الـ retries من أجلها."
        } }
    ]},
    { key: "sysdesign", blocks: [
      { t: "p",
        en: "In a design interview, retries are how you answer \"what happens when this arrow on the whiteboard fails?\". Every arrow between two boxes is a network call, and every network call fails sometimes. The expected answer names three things per arrow: how long one attempt may take, how many retries it gets, and whether the operation is safe to repeat. Draw the checkout flow — browser to API, API to payment provider, API to database, API to an order-events queue — and the four arrows get four different answers.",
        ar: "في design interview، الـ retries هي جوابك على سؤال «ماذا يحدث حين يفشل هذا السهم على اللوح؟». كل سهم بين صندوقين هو network call، وكل network call يفشل أحياناً. الجواب المتوقع يسمّي ثلاثة أشياء لكل سهم: كم يجوز أن تستغرق محاولة واحدة، وكم retry تحصل عليها، وهل تكرار العملية آمن. ارسم مسار الـ checkout — من المتصفح إلى الـ API، ومن الـ API إلى الـ payment provider، ومن الـ API إلى الـ database، ومن الـ API إلى queue أحداث الطلبات — وستحصل الأسهم الأربعة على أربعة أجوبة مختلفة." },

      { t: "ul",
        en: [
          "Browser to API: the user is waiting, so at most one retry and only on a network error — a second POST /checkout with the same cart id, deduplicated on the server.",
          "API to payment provider: 3 retries, exponential backoff with full jitter, 2 s per attempt, 10 s overall, and an idempotency key so a repeat cannot double-charge.",
          "API to database: 2 fast retries with short delays for deadlock and connection-reset errors, which SQL Server resolves in milliseconds. EF Core's EnableRetryOnFailure does this for you.",
          "API to the order-events queue: publish once with a few retries; if it still fails, write the event to an outbox table in the same transaction and let a background worker retry for hours."
        ],
        ar: [
          "من المتصفح إلى الـ API: المستخدم ينتظر، فـ retry واحدة كحد أقصى وعلى خطأ شبكة فقط — POST /checkout ثانٍ بنفس cart id، مع إزالة التكرار على الـ server.",
          "من الـ API إلى الـ payment provider: 3 retries، exponential backoff مع full jitter، ثانيتان لكل محاولة، 10 ثوانٍ إجمالاً، مع idempotency key حتى لا يسبب التكرار خصماً مزدوجاً.",
          "من الـ API إلى الـ database: retryان سريعان بتأخير قصير لأخطاء الـ deadlock و connection reset، وهي أخطاء يحلها SQL Server خلال ميلي ثوانٍ. الخيار EnableRetryOnFailure في EF Core يفعل ذلك عنك.",
          "من الـ API إلى queue أحداث الطلبات: انشر مرة واحدة مع retries قليلة؛ وإن استمر الفشل، اكتب الحدث في جدول outbox داخل نفس الـ transaction ودع background worker يعيد المحاولة لساعات."
        ] },

      { t: "callout", kind: "note",
        en: "A useful line in an interview: \"retries handle seconds of failure, queues handle minutes, and circuit breakers protect us in between\". It shows you know retries are one tool in a set, not the answer to every failure.",
        ar: "جملة مفيدة في المقابلة: «الـ retries تعالج ثوانٍ من الفشل، والـ queues تعالج دقائق، والـ circuit breakers تحمينا بينهما». تُظهر أنك تعرف أن الـ retries أداة ضمن مجموعة، لا الجواب لكل فشل." }
    ]},

    { key: "perf", blocks: [
      { t: "kv", rows: [
        { k: { en: "Latency", ar: "Latency" },
          v: { en: "Retries only affect the slow tail. p50 (the typical request) is unchanged, but p99 — the slowest 1 request in 100 — absorbs the full backoff. With 1s/2s/4s that is up to 7 s of sleeping plus the attempts themselves.", ar: "الـ retries تؤثر على الذيل البطيء فقط. الـ p50 (الـ request النموذجي) لا يتغير، لكن الـ p99 — أبطأ request من كل 100 — يمتص الـ backoff كاملاً. مع 1s/2s/4s يصل ذلك إلى 7 ثوانٍ من النوم زائد المحاولات نفسها." } },
        { k: { en: "Network", ar: "Network" },
          v: { en: "In the worst case you send 4× the requests. Under a full dependency outage that is 4× the outbound traffic for zero successful work, which is why a retry budget matters.", ar: "في الحالة الأسوأ ترسل 4 أضعاف الـ requests. وأثناء عطل كامل في الـ dependency يعني ذلك 4 أضعاف الـ traffic الصادر مقابل صفر عمل ناجح، ولهذا تهم الـ retry budget." } },
        { k: { en: "Memory", ar: "Memory" },
          v: { en: "Each waiting request keeps its buffers, its request object and any read body alive. 5000 requests sleeping for 4 seconds each is 5000 live object graphs the garbage collector must keep scanning.", ar: "كل request منتظر يبقي buffers الخاصة به وكائن الـ request وأي body مقروء حياً. 5000 request نائم 4 ثوانٍ لكل واحد يعني 5000 object graph حياً يجب على الـ garbage collector الاستمرار في فحصها." } },
        { k: { en: "Scalability", ar: "Scalability" },
          v: { en: "Retries consume connections from the HttpClient pool. If the pool holds 100 connections per host and every request is retrying, new requests queue behind them and unrelated endpoints slow down too.", ar: "الـ retries تستهلك connections من pool الـ HttpClient. إذا كان الـ pool يحمل 100 connection لكل host وكل request يعيد المحاولة، فالـ requests الجديدة تصطف خلفها وتبطؤ endpoints أخرى لا علاقة لها بالأمر." } },
        { k: { en: "CPU", ar: "CPU" },
          v: { en: "Near zero if you await Task.Delay, which releases the thread. A Thread.Sleep instead blocks a thread pool thread for the whole wait and can starve the pool under load.", ar: "قريب من الصفر إذا استخدمت await Task.Delay، لأنها تحرر الـ thread. أما Thread.Sleep فتحجز thread من الـ thread pool طوال الانتظار وقد تجوّع الـ pool تحت الحمل." } }
      ]}
    ]},

    { key: "debug", blocks: [
      { t: "ul",
        en: [
          "A retry counter metric, tagged by dependency and status code. Watch the ratio of retries to successful calls: above roughly 10% means a dependency is degraded, not merely flaky.",
          "Distributed tracing (OpenTelemetry). One trace of a slow checkout shows each attempt as its own span, so you can see three 2-second gaps and know instantly it was retries, not one slow call.",
          "Client-side logs at Warning on each retry, including attempt number, delay, and the status or exception that triggered it. Without the reason logged you cannot tell a 503 storm from a timeout storm.",
          "dotnet-counters monitor System.Net.Http on the running process. Look at requests-queued and current-requests: a rising queue with flat completions means retries are eating the connection pool.",
          "The dependency's own rate-limit dashboard or 429 count. If your retries are being rejected as rate-limited, backing off harder is the fix, not more attempts."
        ],
        ar: [
          "metric يعدّ الـ retries، موسوماً بالـ dependency وكود الحالة. راقب نسبة الـ retries إلى الـ calls الناجحة: فوق 10% تقريباً تعني dependency متدهوراً لا مجرد متذبذب.",
          "التتبع الموزع (OpenTelemetry). trace واحد لعملية checkout بطيئة يُظهر كل محاولة كـ span مستقل، فترى ثلاث فجوات مدة كل منها ثانيتان وتعرف فوراً أنها retries لا call بطيء واحد.",
          "logs على مستوى Warning عند كل retry في جهة الـ client، تتضمن رقم المحاولة ومدة التأخير والحالة أو الـ exception التي سببتها. بدون تسجيل السبب لا تستطيع تمييز عاصفة 503 من عاصفة timeout.",
          "الأمر dotnet-counters monitor System.Net.Http على العملية العاملة. انظر إلى requests-queued و current-requests: queue يرتفع مع completions ثابتة يعني أن الـ retries تلتهم الـ connection pool.",
          "لوحة الـ rate limit عند الـ dependency نفسه أو عدد الـ 429. إذا كانت retries عندك تُرفض بسبب الـ rate limit، فالحل هو backoff أقوى لا محاولات أكثر."
        ] },

      { t: "callout", kind: "tip",
        en: "Log the total number of attempts on the final result, not just on failures. A dashboard showing that 3% of checkouts needed a second attempt tells you a dependency is degrading days before it starts failing outright.",
        ar: "سجّل العدد الكلي للمحاولات على النتيجة النهائية، لا على حالات الفشل فقط. لوحة تُظهر أن 3% من عمليات الـ checkout احتاجت محاولة ثانية تخبرك أن dependency يتدهور قبل أيام من بدء فشله الكامل." }
    ]},

    { key: "realworld", blocks: [
      { t: "p",
        en: "Anywhere a system talks to something it does not control, retries are already in the code — usually added after an incident. The pattern is the same across industries: the value of a retry depends entirely on whether repeating the operation is safe, and the shape of the backoff depends on how many clients might fail at once.",
        ar: "في أي مكان يتحدث فيه نظام إلى شيء لا يتحكم به، تكون الـ retries موجودة في الكود أصلاً — تُضاف عادة بعد حادثة. النمط نفسه عبر القطاعات: قيمة الـ retry تعتمد كلياً على ما إذا كان تكرار العملية آمناً، وشكل الـ backoff يعتمد على عدد الـ clients التي قد تفشل معاً." },

      { t: "ul",
        en: [
          "Payment systems: retries always paired with idempotency keys, because a duplicate charge is a customer-visible, money-losing bug and a lost response is common.",
          "Mobile apps on cellular networks: aggressive backoff with heavy jitter, because a tunnel or a dropped tower makes thousands of devices fail and reconnect at once.",
          "Data pipelines and batch jobs: many retries over long windows, sometimes hours, because nobody is waiting and a delayed record is far better than a lost one.",
          "Internal service-to-service calls behind a mesh — a layer that routes traffic between services — usually get one retry with a tight budget, because latency is small and the risk of amplifying an internal outage across dozens of services is high."
        ],
        ar: [
          "أنظمة الدفع: الـ retries مقترنة دائماً بـ idempotency keys، لأن الخصم المكرر bug يراه الزبون ويكلّف مالاً، وضياع الـ response شائع.",
          "تطبيقات الموبايل على شبكات الجوال: backoff قوي مع jitter كثيف، لأن نفقاً أو برجاً ساقطاً يجعل آلاف الأجهزة تفشل وتعيد الاتصال دفعة واحدة.",
          "خطوط معالجة البيانات والمهام الدفعية: retries كثيرة على نوافذ طويلة، أحياناً ساعات، لأن لا أحد ينتظر وسجل متأخر أفضل بكثير من سجل ضائع.",
          "الـ calls الداخلية بين الـ services خلف mesh — طبقة توجّه الـ traffic بين الـ services — تحصل عادة على retry واحدة بميزانية ضيقة، لأن الـ latency صغير وخطر تضخيم عطل داخلي عبر عشرات الـ services مرتفع."
        ] }
    ]},

    { key: "exercises", blocks: [
      { t: "ex", diff: "easy",
        en: "Write a small console app that calls a local endpoint returning 503 three times then 200. Add a retry policy with exponential backoff and no jitter, and log the timestamp of each attempt. You are done when the printed gaps are close to 1 s, 2 s and 4 s and the fourth attempt succeeds.",
        ar: "اكتب console app صغيراً ينادي endpoint محلياً يرد 503 ثلاث مرات ثم 200. أضف retry policy بـ exponential backoff بلا jitter، وسجّل الوقت عند كل محاولة. تنتهي حين تكون الفجوات المطبوعة قريبة من 1s و2s و4s وتنجح المحاولة الرابعة." },

      { t: "ex", diff: "medium",
        en: "Add full jitter to that policy, then run 200 clients against the same endpoint at once and record the arrival time of every retry in a histogram with 100 ms buckets. You are done when the no-jitter run shows three tall spikes and the jitter run shows a flat spread over the same window.",
        ar: "أضف full jitter إلى تلك الـ policy، ثم شغّل 200 client على نفس الـ endpoint دفعة واحدة وسجّل وقت وصول كل retry في histogram بخانات 100ms. تنتهي حين تُظهر التجربة بلا jitter ثلاث ذروات عالية وتُظهر تجربة الـ jitter انتشاراً مستوياً على نفس النافذة." },

      { t: "ex", diff: "hard",
        en: "Build a fake payment endpoint that records the charge, then sleeps 3 seconds before responding, so every client times out at 2 seconds. Call it through a retry policy and confirm the charge is recorded three times. Then add an Idempotency-Key header plus server-side deduplication and confirm exactly one charge is recorded and all three attempts return the same charge id.",
        ar: "ابنِ payment endpoint وهمياً يسجل الخصم ثم ينام 3 ثوانٍ قبل الرد، بحيث ينتهي وقت كل client عند ثانيتين. نادِه عبر retry policy وتأكد أن الخصم سُجل ثلاث مرات. ثم أضف ترويسة Idempotency-Key مع إزالة تكرار على الـ server وتأكد أن خصماً واحداً فقط سُجل وأن المحاولات الثلاث كلها تعيد نفس charge id." },

      { t: "ex", diff: "senior",
        en: "Implement a retry budget: a shared counter per dependency that allows retries only while they are under 10% of successful calls in the last minute, and returns the failure immediately once the budget is exhausted. Prove it with a load test where the dependency fails 100% of the time. You are done when outbound request volume during the outage stays within 1.1× the normal rate instead of 4×, and a metric fires when the budget is hit.",
        ar: "نفّذ retry budget: عدّاداً مشتركاً لكل dependency يسمح بالـ retries فقط ما دامت تحت 10% من الـ calls الناجحة في الدقيقة الأخيرة، ويعيد الفشل فوراً عند نفاد الميزانية. أثبت ذلك بـ load test يفشل فيه الـ dependency 100% من الوقت. تنتهي حين يبقى حجم الـ requests الصادرة أثناء العطل ضمن 1.1 ضعف المعدل الطبيعي بدل 4 أضعاف، ويصدر metric عند بلوغ الميزانية." }
    ]},

    { key: "refs", blocks: [
      { t: "ref",
        label: { en: "AWS Architecture Blog — Exponential Backoff and Jitter", ar: "AWS Architecture Blog — Exponential Backoff and Jitter" },
        url: "https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/",
        meta: { en: "Article", ar: "مقال" } },
      { t: "ref",
        label: { en: "Polly — resilience strategies and retry", ar: "Polly — استراتيجيات المرونة والـ retry" },
        url: "https://www.pollydocs.org/strategies/retry.html",
        meta: { en: "Docs", ar: "توثيق" } },
      { t: "ref",
        label: { en: "Microsoft Learn — Building resilient HTTP apps", ar: "Microsoft Learn — بناء تطبيقات HTTP مرنة" },
        url: "https://learn.microsoft.com/en-us/dotnet/core/resilience/http-resilience",
        meta: { en: "Docs", ar: "توثيق" } },
      { t: "ref",
        label: { en: "Amazon Builders' Library — Timeouts, retries and backoff with jitter", ar: "Amazon Builders' Library — المهل وإعادة المحاولة والـ backoff مع jitter" },
        url: "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/",
        meta: { en: "Article", ar: "مقال" } }
    ]}
  ],
  quiz: [
    {
      q: { en: "Which response should a client NOT retry?", ar: "أي response لا يجب على الـ client إعادة المحاولة عليه؟" },
      options: [
        { en: "503 Service Unavailable", ar: "503 Service Unavailable" },
        { en: "422 Unprocessable Entity", ar: "422 Unprocessable Entity" },
        { en: "504 Gateway Timeout", ar: "504 Gateway Timeout" },
        { en: "429 Too Many Requests", ar: "429 Too Many Requests" }
      ],
      correct: 1,
      why: {
        en: "422 means the server understood the request and the request itself is invalid. Sending the identical body again produces the identical answer. The other three all say the server is busy, overloaded or unreachable, which can change within seconds.",
        ar: "الـ 422 تعني أن الـ server فهم الـ request وأن الـ request نفسه غير صالح. إرسال نفس الـ body مرة أخرى ينتج نفس الجواب. الثلاثة الأخرى كلها تقول إن الـ server مشغول أو محمّل زيادة أو غير قابل للوصول، وهذا قد يتغير خلال ثوانٍ."
      }
    },
    {
      q: { en: "What problem does jitter solve that exponential backoff alone does not?", ar: "ما المشكلة التي يحلها الـ jitter ولا يحلها الـ exponential backoff وحده؟" },
      options: [
        { en: "It shortens the average wait between attempts", ar: "يقصّر متوسط الانتظار بين المحاولات" },
        { en: "It stops many clients from retrying at the same instant", ar: "يمنع عدداً كبيراً من الـ clients من إعادة المحاولة في نفس اللحظة" },
        { en: "It makes non-idempotent operations safe to repeat", ar: "يجعل العمليات غير الـ idempotent آمنة للتكرار" },
        { en: "It guarantees the retry eventually succeeds", ar: "يضمن أن الـ retry ستنجح في النهاية" }
      ],
      correct: 1,
      why: {
        en: "With a fixed formula, clients that failed together retry together, producing synchronised spikes that keep knocking the dependency down. Jitter randomises each wait so the same retries arrive spread out. It does not change safety or guarantee success.",
        ar: "بمعادلة ثابتة، الـ clients التي فشلت معاً تعيد المحاولة معاً، فتنتج ذروات متزامنة تستمر في إسقاط الـ dependency. الـ jitter يعشّي كل انتظار فتصل نفس الـ retries موزعة. وهو لا يغير الأمان ولا يضمن النجاح."
      }
    },
    {
      q: { en: "Your policy has a 2-second per-attempt timeout, 3 retries and a 10-second overall deadline. The dependency hangs forever on every call. What happens?", ar: "الـ policy عندك فيها per-attempt timeout قدره ثانيتان و3 retries و overall deadline قدره 10 ثوانٍ. الـ dependency يتعلق للأبد في كل call. ماذا يحدث؟" },
      options: [
        { en: "The caller waits about 8 seconds of attempts plus the backoff sleeps, and is cut off at 10 seconds", ar: "المنادي ينتظر نحو 8 ثوانٍ من المحاولات زائد فترات نوم الـ backoff، ويُقطع عند 10 ثوانٍ" },
        { en: "The caller waits forever, because the per-attempt timeout only applies to the first call", ar: "المنادي ينتظر للأبد، لأن الـ per-attempt timeout ينطبق على الـ call الأول فقط" },
        { en: "The caller returns immediately with a 504", ar: "المنادي يعود فوراً بـ 504" },
        { en: "The overall deadline is ignored because retries reset it", ar: "الـ overall deadline يُتجاهل لأن الـ retries تعيد ضبطه" }
      ],
      correct: 0,
      why: {
        en: "Each attempt is cut off at 2 seconds, and the backoff sleeps run between them. The overall deadline is the hard ceiling: once 10 seconds have passed the operation stops even if attempts remain, which is exactly why you set it.",
        ar: "كل محاولة تُقطع عند ثانيتين، وفترات نوم الـ backoff تجري بينها. الـ overall deadline هو السقف الصارم: بمجرد مرور 10 ثوانٍ تتوقف العملية حتى لو بقيت محاولات، وهذا بالضبط سبب ضبطه."
      }
    },
    {
      q: { en: "A checkout is charged twice. The client sent one request, timed out at 2 s, and retried. What most likely went wrong?", ar: "عملية checkout خُصمت مرتين. الـ client أرسل request واحداً، انتهت مهلته عند ثانيتين، فأعاد المحاولة. ما الخطأ الأرجح؟" },
      options: [
        { en: "The backoff was too short", ar: "الـ backoff كان قصيراً جداً" },
        { en: "The provider returned 503 on the first call", ar: "الـ provider أعاد 503 في الـ call الأول" },
        { en: "The first request succeeded but its response was lost, and there was no idempotency key", ar: "الـ request الأول نجح لكن الـ response ضاع، ولم يكن هناك idempotency key" },
        { en: "The retry count was set to 3 instead of 1", ar: "عدد الـ retries ضُبط على 3 بدل 1" }
      ],
      correct: 2,
      why: {
        en: "A timeout tells you nothing about whether the server did the work — only that you did not hear back. Without a key that lets the provider recognise the retry as the same logical charge, it treats the second request as a new one.",
        ar: "الـ timeout لا يخبرك شيئاً عمّا إذا كان الـ server نفّذ العمل — فقط أنك لم تسمع رداً. وبدون key يسمح للـ provider بالتعرف على الـ retry كخصم منطقي واحد، يعامل الـ request الثاني كطلب جديد."
      }
    },
    {
      q: { en: "Three layers each retry 3 times on the same call chain. What is the worst-case number of calls reaching the dependency for one user action?", ar: "ثلاث طبقات كل منها تعيد المحاولة 3 مرات على نفس سلسلة الـ calls. ما أسوأ عدد calls يصل إلى الـ dependency من فعل مستخدم واحد؟" },
      options: [
        { en: "9", ar: "9" },
        { en: "27", ar: "27" },
        { en: "64", ar: "64" },
        { en: "12", ar: "12" }
      ],
      correct: 2,
      why: {
        en: "\"3 retries\" means 4 attempts including the first, and the layers multiply: 4 × 4 × 4 = 64. This multiplication is why retries should be owned by exactly one layer, normally the one closest to the dependency.",
        ar: "«3 retries» تعني 4 محاولات بما فيها الأولى، والطبقات تتضاعف: 4 × 4 × 4 = 64. هذا التضاعف هو سبب وجوب امتلاك طبقة واحدة بالضبط للـ retries، عادة الأقرب إلى الـ dependency."
      }
    }
  ]
};
```

NEXT: idempotency
