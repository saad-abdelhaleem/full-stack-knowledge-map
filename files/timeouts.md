```js
const timeoutsLesson = {
  id: "timeouts",
  moduleId: "distributed",
  title: { en: "Timeouts and circuit breakers", ar: "المُهل والـ circuit breakers" },
  summary: {
    en: "A timeout is the promise that a call will end. A circuit breaker is the promise that you will stop making a call that keeps failing.",
    ar: "الـ timeout هو الوعد بأن الطلب سينتهي. الـ circuit breaker هو الوعد بأنك ستتوقّف عن طلب يفشل باستمرار."
  },
  mins: 16,
  sections: [
    { key: "why", blocks: [
      { t: "p",
        en: "A timeout is a rule that says: if this call has not answered within N milliseconds, give up and treat it as failed. A circuit breaker is a rule one level above that: if the same call has failed many times in a row, stop even trying for a while. Together they stop one slow dependency from freezing your whole service.",
        ar: "الـ timeout هو قاعدة تقول: إذا لم يرد هذا الطلب خلال N ميلي ثانية، توقّف واعتبره فاشلاً. والـ circuit breaker قاعدة أعلى منه: إذا فشل نفس الطلب عدة مرات متتالية، توقّف عن محاولته أصلاً لفترة. الاثنان معاً يمنعان dependency واحدة بطيئة من تجميد الخدمة كلها."
      },
      { t: "kv", rows: [
        { k: { en: "Dependency", ar: "Dependency" },
          v: { en: "Any other thing your code must call to finish its work: another HTTP service, a database, a cache, a queue.", ar: "أي شيء آخر يجب أن يستدعيه الكود ليكمل عمله: خدمة HTTP أخرى، أو database، أو cache، أو queue." } },
        { k: { en: "Timeout", ar: "Timeout" },
          v: { en: "A maximum wait. When it expires the caller stops waiting and raises an error. The remote side may still be working.", ar: "أقصى مدة انتظار. عند انتهائها يتوقّف المستدعي عن الانتظار ويرمي خطأ. الطرف البعيد قد يكون ما زال يعمل." } },
        { k: { en: "Circuit breaker", ar: "Circuit breaker" },
          v: { en: "A small counter in front of a call. After enough failures it fails new calls instantly instead of sending them.", ar: "عدّاد صغير أمام الاستدعاء. بعد عدد كافٍ من حالات الفشل يُفشل الطلبات الجديدة فوراً بدل إرسالها." } },
        { k: { en: "Fail fast", ar: "Fail fast" },
          v: { en: "Returning an error in microseconds instead of holding the caller for seconds. Fast errors are cheap; slow errors are expensive.", ar: "إرجاع خطأ خلال ميكروثانية بدل حجز المستدعي لثوانٍ. الأخطاء السريعة رخيصة، والبطيئة مكلفة." } },
        { k: { en: "Timeout budget", ar: "Timeout budget" },
          v: { en: "The total time a request is allowed to take, split among the calls it makes, so the parts add up to less than the whole.", ar: "الوقت الكلي المسموح لطلب واحد، مقسّم على الاستدعاءات التي يقوم بها، بحيث يكون مجموع الأجزاء أقل من الكل." } },
        { k: { en: "Bulkhead", ar: "Bulkhead" },
          v: { en: "A cap on how many calls to one dependency may be in flight at once, so it cannot consume every thread or connection.", ar: "حد أقصى لعدد الاستدعاءات المتزامنة نحو dependency واحدة، حتى لا تستهلك كل الـ threads أو الـ connections." } }
      ]},
      { t: "p",
        en: "Here is the running example for the whole lesson. An orders API serves GET /orders/{id}. To build the response it calls an internal Pricing service over HTTP. Normally Pricing answers in 40 ms. One afternoon Pricing hits a bad database plan and starts answering in 30 seconds instead. The orders API has no timeout on that call, so every request that arrives simply waits. Within two minutes the orders API stops answering anything at all — including endpoints that never touch Pricing.",
        ar: "هذا هو المثال الجاري في الدرس كله. لدينا orders API يخدم GET /orders/{id}. لبناء الرد يستدعي خدمة داخلية اسمها Pricing عبر HTTP. في الوضع الطبيعي يرد Pricing خلال 40 ms. في أحد الأيام يقع Pricing على plan سيئ في الـ database ويصبح يرد بعد 30 ثانية. لا يوجد timeout على ذلك الاستدعاء في orders API، فكل طلب يصل ينتظر فقط. خلال دقيقتين يتوقّف orders API عن الرد على أي شيء — حتى الـ endpoints التي لا تلمس Pricing إطلاقاً."
      },
      { t: "p",
        en: "Think of a call centre with twenty agents. Each agent who calls a supplier and stays on hold is an agent who cannot answer a new customer. If nobody hangs up after two minutes, all twenty agents end up on hold and the queue of customers grows without limit. The timeout is the rule \"hang up after two minutes\". The circuit breaker is the supervisor saying \"the supplier is down, stop calling them for the next half hour and tell customers now\". Your threads and HTTP connections are the agents; the customers are incoming requests.",
        ar: "تخيّل مركز اتصال فيه عشرون موظفاً. كل موظف يتصل بمورّد ويبقى في الانتظار هو موظف لا يستطيع الرد على زبون جديد. إذا لم يغلق أحد الخط بعد دقيقتين، ينتهي الأمر بالعشرين كلهم في الانتظار ويكبر طابور الزبائن بلا حدود. الـ timeout هو قاعدة «أغلق الخط بعد دقيقتين». والـ circuit breaker هو المشرف الذي يقول «المورّد معطّل، توقّفوا عن الاتصال به نصف ساعة وأخبروا الزبائن الآن». الـ threads والـ HTTP connections عندك هم الموظفون، والطلبات الواردة هي الزبائن."
      },
      { t: "callout", kind: "note",
        en: "A timeout does not cancel the work on the other side. When your client gives up on Pricing, Pricing usually keeps computing and may still write to its database. That is why timeouts and idempotency belong together.",
        ar: "الـ timeout لا يلغي العمل عند الطرف الآخر. عندما يتوقّف عميلك عن انتظار Pricing، يستمر Pricing غالباً في الحساب وقد يكتب في الـ database. لهذا السبب يجب أن يسير الـ timeout مع الـ idempotency."
      }
    ]},
    { key: "problem", blocks: [
      { t: "p",
        en: "The damage from a slow dependency is not linear — it multiplies. There is a simple rule for how many calls are in flight at the same time: arrival rate multiplied by how long each call takes. The orders API receives 200 requests per second. While Pricing answers in 40 ms (0.04 s), that is 200 × 0.04 = 8 calls in flight at any moment. When Pricing slows to 30 s, the same traffic gives 200 × 30 = 6000 calls in flight. Nothing about your traffic changed. Only the wait did, and in-flight work grew 750 times.",
        ar: "الضرر الناتج عن dependency بطيئة ليس خطياً — بل يتضاعف. هناك قاعدة بسيطة لعدد الاستدعاءات الجارية في نفس اللحظة: معدّل الوصول مضروباً في مدة كل استدعاء. يستقبل orders API عدد 200 طلب في الثانية. عندما يرد Pricing خلال 40 ms أي 0.04 ثانية، يكون العدد 200 × 0.04 = 8 استدعاءات جارية في أي لحظة. وعندما يبطؤ Pricing إلى 30 ثانية يصبح 200 × 30 = 6000 استدعاء جارٍ. لم يتغيّر شيء في الترافيك، تغيّر الانتظار فقط، فنما العمل الجاري 750 ضعفاً."
      },
      { t: "kv", rows: [
        { k: { en: "Sockets", ar: "Sockets" },
          v: { en: "6000 open TCP connections to one host. A socket is one open network channel; each one uses a port and kernel buffers, and ports run out.", ar: "6000 اتصال TCP مفتوح نحو host واحد. الـ socket قناة شبكية مفتوحة، وكل واحدة تستهلك port وbuffers في الـ kernel، والـ ports تنفد." } },
        { k: { en: "Memory", ar: "الذاكرة" },
          v: { en: "Each pending request keeps its buffers and objects alive. 6000 × roughly 40 KB is about 240 MB that the garbage collector cannot reclaim.", ar: "كل طلب معلّق يبقي buffers وobjects حية. 6000 × نحو 40 KB يساوي تقريباً 240 MB لا يستطيع الـ garbage collector تحريرها." } },
        { k: { en: "Threads (only if you block)", ar: "Threads (فقط إذا حجبت)" },
          v: { en: "With await, waiting costs no thread. With .Result or .Wait(), each wait pins one thread and the thread pool is exhausted in seconds.", ar: "مع await لا يكلّف الانتظار أي thread. أما مع ‎.Result أو ‎.Wait()‎ فكل انتظار يحجز thread وينفد الـ thread pool خلال ثوانٍ." } },
        { k: { en: "Health checks", ar: "Health checks" },
          v: { en: "The load balancer's health probe also queues behind the backlog, times out, and the instance is pulled out — traffic shifts to the next instance and kills it too.", ar: "فحص الصحة من الـ load balancer ينتظر أيضاً خلف التراكم، فينتهي وقته وتُسحب النسخة من الخدمة — فينتقل الترافيك للنسخة التالية ويقتلها هي أيضاً." } }
      ]},
      { t: "p",
        en: "The last row is the part people miss. The failure spreads. Endpoints that never call Pricing get slow too, because they share the same process, the same memory and the same request queue. This is called cascading failure: one dependency becomes unhealthy, and everything that depends on the caller becomes unhealthy in turn. Adding a 500 ms timeout to the Pricing call changes 6000 in-flight calls to 200 × 0.5 = 100, and turns a total outage into a partial one where /orders/{id} returns a degraded response and everything else keeps working.",
        ar: "السطر الأخير هو ما يغفل عنه الناس. الفشل ينتشر. حتى الـ endpoints التي لا تستدعي Pricing تصبح بطيئة، لأنها تشترك في نفس الـ process ونفس الذاكرة ونفس طابور الطلبات. يُسمّى هذا cascading failure: تصبح dependency واحدة غير سليمة، فيصبح كل ما يعتمد على المستدعي غير سليم بدوره. إضافة timeout قدره 500 ms على استدعاء Pricing تحوّل 6000 استدعاء جارٍ إلى 200 × 0.5 = 100، وتحوّل انقطاعاً كاملاً إلى انقطاع جزئي يرجع فيه ‎/orders/{id}‎ رداً منقوصاً بينما يستمر الباقي في العمل."
      }
    ]},
    { key: "internals", blocks: [
      { t: "p",
        en: "A timeout in .NET is a timer plus a cancellation signal. You create a CancellationTokenSource — an object that owns a flag other code can watch — and tell it to trip after a set delay. You pass its CancellationToken into the call. When the timer fires, the token is marked cancelled, the socket read is aborted, and the awaiting code receives an OperationCanceledException. Nothing polls; the runtime schedules one timer callback per source.",
        ar: "الـ timeout في .NET هو مؤقّت مع إشارة إلغاء. تنشئ CancellationTokenSource — كائن يملك علماً يستطيع كود آخر مراقبته — وتطلب منه أن يُفعّل بعد مدة محدّدة. ثم تمرّر الـ CancellationToken الخاص به إلى الاستدعاء. عندما ينطلق المؤقّت يُعلَّم الـ token كملغى، ويُقطع القراءة من الـ socket، ويستقبل الكود المنتظر استثناء OperationCanceledException. لا يوجد أي polling، بل يجدول الـ runtime callback واحداً للمؤقّت لكل source."
      },
      { t: "p",
        en: "There is a default you should know: HttpClient.Timeout is 100 seconds unless you change it. That covers the whole call including reading the response body, and it is far too long for a service-to-service call. If your code never sets a timeout, this 100 seconds is the timeout you actually have.",
        ar: "هناك قيمة افتراضية يجب أن تعرفها: قيمة HttpClient.Timeout هي 100 ثانية إن لم تغيّرها. وهي تغطي الاستدعاء كله بما فيه قراءة جسم الرد، وهي مدة طويلة جداً لاستدعاء بين خدمتين. إذا لم يضبط كودك أي timeout فهذه المئة ثانية هي الـ timeout الفعلي لديك."
      },
      { t: "code", lang: "csharp",
        label: { en: "A per-call timeout that also respects the caller giving up", ar: "timeout لكل استدعاء يحترم أيضاً انسحاب المستدعي" },
        code: "// HttpContext.RequestAborted is cancelled when the browser or caller\n// disconnects. We want EITHER of the two signals to stop the call.\npublic async Task<PriceDto?> GetPriceAsync(int orderId, CancellationToken callerToken)\n{\n    using var timeoutCts = new CancellationTokenSource(TimeSpan.FromMilliseconds(500));\n    using var linked = CancellationTokenSource.CreateLinkedTokenSource(\n        callerToken, timeoutCts.Token);\n\n    try\n    {\n        var response = await _http.GetAsync($\"/prices/{orderId}\", linked.Token);\n        response.EnsureSuccessStatusCode();\n        return await response.Content.ReadFromJsonAsync<PriceDto>(linked.Token);\n    }\n    catch (OperationCanceledException) when (timeoutCts.IsCancellationRequested)\n    {\n        // Our own 500 ms budget expired. This is a dependency failure.\n        _logger.LogWarning(\"Pricing timed out after 500ms for order {OrderId}\", orderId);\n        return null;   // caller decides what a missing price means\n    }\n    // If callerToken fired instead, the exception bubbles: the client is gone,\n    // so there is nobody left to answer and no point logging an error.\n}"
      },
      { t: "p",
        en: "Notice the exception filter — the `when (...)` clause. Both a timeout and a disconnected client arrive as the same exception type, so you must ask which token tripped. Treating a client disconnect as a dependency failure is how teams end up with error dashboards full of noise every time a user closes a tab.",
        ar: "لاحظ الـ exception filter، أي جملة ‎when (...)‎. الـ timeout وانقطاع العميل يصلان كنفس نوع الاستثناء، لذا يجب أن تسأل أي token هو الذي انطلق. اعتبار انقطاع العميل فشلاً في dependency هو ما يجعل لوحات الأخطاء عند بعض الفرق مليئة بالضجيج كلما أغلق مستخدم تبويبه."
      },
      { t: "p",
        en: "Now the circuit breaker. The name comes from the fuse box in a house: when a circuit draws too much current, the breaker snaps open and cuts power to that line so the wiring does not burn. It stays open until someone resets it. The software version is the same idea — the \"current\" is the failure rate, and cutting power means refusing to send calls. It is a small state machine sitting in front of one dependency, with three states.",
        ar: "ننتقل الآن إلى الـ circuit breaker. الاسم مأخوذ من لوحة الكهرباء في المنزل: عندما يسحب خط تياراً زائداً يقفز القاطع ويفصل الكهرباء عن ذلك الخط حتى لا تحترق الأسلاك، ويبقى مفصولاً حتى يعيده أحد. النسخة البرمجية هي نفس الفكرة — «التيار» هنا هو معدّل الفشل، وفصل الكهرباء يعني رفض إرسال الاستدعاءات. إنه state machine صغير يجلس أمام dependency واحدة، وله ثلاث حالات."
      },
      { t: "kv", rows: [
        { k: { en: "Closed (normal)", ar: "Closed (طبيعي)" },
          v: { en: "Calls pass through. The breaker counts outcomes over a rolling window — the last N seconds of traffic.", ar: "الاستدعاءات تمر. يعدّ الـ breaker النتائج على نافذة متحرّكة، أي آخر N ثانية من الترافيك." } },
        { k: { en: "Open (tripped)", ar: "Open (مفصول)" },
          v: { en: "Every call fails instantly with BrokenCircuitException, without touching the network. Costs microseconds instead of 500 ms.", ar: "كل استدعاء يفشل فوراً بـ BrokenCircuitException دون لمس الشبكة. يكلّف ميكروثوانٍ بدل 500 ms." } },
        { k: { en: "Half-open (testing)", ar: "Half-open (اختبار)" },
          v: { en: "After the break duration, one trial call is allowed through. Success closes the breaker; failure opens it again for another break duration.", ar: "بعد انتهاء مدة الفصل يُسمح باستدعاء تجريبي واحد. نجاحه يعيد الـ breaker إلى Closed، وفشله يفتحه من جديد لمدة فصل أخرى." } },
        { k: { en: "Failure ratio", ar: "Failure ratio" },
          v: { en: "The trip condition. For example 50% failures within a 30-second window. Ratios beat plain counts because they scale with traffic.", ar: "شرط الفصل. مثلاً 50% فشل خلال نافذة 30 ثانية. النسب أفضل من العدّ المجرّد لأنها تتناسب مع حجم الترافيك." } },
        { k: { en: "Minimum throughput", ar: "Minimum throughput" },
          v: { en: "The smallest number of calls in the window before the ratio counts. Stops 2 failures out of 2 calls at 3 a.m. from tripping the breaker.", ar: "أقل عدد استدعاءات في النافذة قبل أن تُحتسب النسبة. يمنع فشل استدعاءين من أصل استدعاءين في الثالثة فجراً من فصل الـ breaker." } }
      ]},
      { t: "p",
        en: "Trace one incident through the machine. At 14:00 Pricing slows down. Calls start hitting the 500 ms timeout, so the breaker records failures. At 14:00:12 the window holds 40 calls and 26 of them failed. That is a ratio of 65%, above the 50% threshold, on a sample larger than the minimum of 10 calls. The breaker opens. For the next 15 seconds every GetPriceAsync returns in about 20 microseconds with BrokenCircuitException, so in-flight calls drop to near zero and the orders API is responsive again with prices missing. At 14:00:27 the breaker goes half-open and lets one call through. Pricing is still sick, that call times out, and the breaker opens for another 15 seconds. At 14:04 Pricing recovers, the trial call succeeds, the breaker closes, and traffic resumes.",
        ar: "لنتتبّع حادثة واحدة عبر هذه الآلة. في الساعة 14:00 يبطؤ Pricing. تبدأ الاستدعاءات في بلوغ الـ timeout عند 500 ms، فيسجّل الـ breaker حالات فشل. عند 14:00:12 تحتوي النافذة على 40 استدعاءً، فشل منها 26. هذه نسبة 65%، أي فوق عتبة الـ 50%، وعلى عيّنة أكبر من الحد الأدنى وهو 10 استدعاءات. فيفتح الـ breaker. خلال الـ 15 ثانية التالية يرجع كل GetPriceAsync خلال نحو 20 ميكروثانية بـ BrokenCircuitException، فتهبط الاستدعاءات الجارية إلى ما يقارب الصفر ويعود orders API سريع الاستجابة مع غياب الأسعار. عند 14:00:27 ينتقل الـ breaker إلى half-open ويسمح باستدعاء واحد. Pricing ما زال معطّلاً فينتهي وقت ذلك الاستدعاء، ويفتح الـ breaker 15 ثانية أخرى. عند 14:04 يتعافى Pricing، وينجح الاستدعاء التجريبي، ويغلق الـ breaker، ويعود الترافيك."
      },
      { t: "code", lang: "csharp",
        label: { en: "Wiring timeout + retry + breaker with Polly v8 on a typed HttpClient", ar: "ربط timeout و retry و breaker باستخدام Polly v8 على typed HttpClient" },
        code: "// Polly is the standard .NET resilience library; a \"pipeline\" is an\n// ordered list of strategies wrapped around the call.\nbuilder.Services.AddHttpClient<PricingClient>(c =>\n{\n    c.BaseAddress = new Uri(\"https://pricing.internal\");\n    c.Timeout = TimeSpan.FromSeconds(2);      // hard outer stop\n})\n.AddResilienceHandler(\"pricing\", pipeline =>\n{\n    // 1. Innermost: the per-ATTEMPT timeout. Each try gets 500 ms.\n    pipeline.AddTimeout(TimeSpan.FromMilliseconds(500));\n\n    // 2. Retry sits OUTSIDE the timeout, so it retries a timed-out attempt.\n    pipeline.AddRetry(new HttpRetryStrategyOptions\n    {\n        MaxRetryAttempts = 2,\n        Delay            = TimeSpan.FromMilliseconds(100),\n        BackoffType      = DelayBackoffType.Exponential,\n        UseJitter        = true               // spread retries apart\n    });\n\n    // 3. Outermost: the breaker sees the final outcome of retries.\n    pipeline.AddCircuitBreaker(new HttpCircuitBreakerStrategyOptions\n    {\n        FailureRatio       = 0.5,             // 50% of the window failed\n        SamplingDuration   = TimeSpan.FromSeconds(30),\n        MinimumThroughput  = 10,              // ignore tiny samples\n        BreakDuration      = TimeSpan.FromSeconds(15)\n    });\n});"
      },
      { t: "p",
        en: "Order matters and is easy to get backwards. The timeout must be inside the retry, so each attempt is bounded separately; if it were outside, one 500 ms budget would have to cover all three attempts. The breaker must be outside the retry, so it judges \"did this call ultimately succeed\" rather than counting each individual attempt and tripping three times faster than you intended. Also note the two timeouts: HttpClient.Timeout at 2 s is the safety net for the whole operation, and the 500 ms strategy is the per-attempt budget. Three attempts of 500 ms plus backoff waits fit under 2 s.",
        ar: "الترتيب مهم ومن السهل عكسه. يجب أن يكون الـ timeout داخل الـ retry حتى تكون كل محاولة محدودة بذاتها؛ ولو كان خارجه لغطّت ميزانية 500 ms واحدة المحاولات الثلاث كلها. ويجب أن يكون الـ breaker خارج الـ retry ليحكم على «هل نجح هذا الاستدعاء في النهاية» بدل عدّ كل محاولة على حدة وفصل الدائرة أسرع ثلاث مرات مما تريد. لاحظ أيضاً وجود timeout اثنين: قيمة HttpClient.Timeout عند ثانيتين هي شبكة أمان للعملية كلها، والـ 500 ms هي ميزانية المحاولة الواحدة. ثلاث محاولات بـ 500 ms مع فترات التراجع تبقى تحت الثانيتين."
      }
    ]},
    { key: "tradeoffs", blocks: [
      { t: "tradeoff",
        pros: {
          en: [
            "A slow dependency can no longer freeze the whole service — its damage is capped at the timeout value.",
            "An open breaker returns errors in microseconds, so the caller stays healthy and can serve a fallback.",
            "It removes load from a struggling dependency, giving it room to recover instead of drowning it.",
            "Failures become visible and countable, instead of showing up as a mysterious latency graph."
          ],
          ar: [
            "لم تعد dependency بطيئة قادرة على تجميد الخدمة كلها — ضررها محدود بقيمة الـ timeout.",
            "الـ breaker المفتوح يرجع أخطاء خلال ميكروثوانٍ، فيبقى المستدعي سليماً ويستطيع تقديم بديل.",
            "يزيح الحمل عن dependency متعثّرة فيعطيها مجالاً للتعافي بدل إغراقها.",
            "يصبح الفشل مرئياً وقابلاً للعدّ بدل أن يظهر كرسم latency غامض."
          ]
        },
        cons: {
          en: [
            "A timeout that is too tight turns healthy slow requests into errors — you fail work that would have succeeded.",
            "The remote side keeps working after you give up, so a timed-out write may still commit.",
            "An open breaker fails requests that would have worked, because it judges the dependency by a sample.",
            "More moving parts to configure, and wrong numbers are worse than no breaker at all."
          ],
          ar: [
            "الـ timeout الضيّق جداً يحوّل طلبات سليمة لكن بطيئة إلى أخطاء — تُفشل عملاً كان سينجح.",
            "الطرف البعيد يواصل العمل بعد انسحابك، فقد تُثبَّت كتابة انتهى وقتها عندك.",
            "الـ breaker المفتوح يُفشل طلبات كانت ستنجح، لأنه يحكم على الـ dependency من خلال عيّنة.",
            "أجزاء متحرّكة أكثر تحتاج ضبطاً، والأرقام الخاطئة أسوأ من غياب الـ breaker أصلاً."
          ]
        },
        limits: {
          en: [
            "The breaker state lives in one process, so ten instances trip independently and at different moments.",
            "It protects the caller, not the dependency — it only reduces load as a side effect.",
            "It cannot distinguish \"this dependency is down\" from \"this one query is slow\" unless you break it per endpoint.",
            "It does nothing for a dependency that returns wrong answers quickly."
          ],
          ar: [
            "حالة الـ breaker تعيش داخل process واحد، فعشر نسخ تفصل الدائرة كل واحدة بمفردها وفي لحظة مختلفة.",
            "يحمي المستدعي لا الـ dependency — تخفيف الحمل مجرد أثر جانبي.",
            "لا يفرّق بين «هذه الـ dependency معطّلة» و«هذا الاستعلام تحديداً بطيء» إلا إذا فصلت breaker لكل endpoint.",
            "لا يفيد شيئاً مع dependency ترجع إجابات خاطئة بسرعة."
          ]
        },
        alts: {
          en: [
            "Bulkhead / concurrency limit: cap in-flight calls to one dependency instead of judging failure rates.",
            "Load shedding: reject new incoming requests when your own queue is too deep.",
            "Hedged requests: if the first call is slower than usual, send a second copy and take whichever answers first — costs extra traffic.",
            "Cached or stale fallback data, which turns the failure into a correctness trade rather than an error."
          ],
          ar: [
            "Bulkhead أو حد للتزامن: تحديد عدد الاستدعاءات الجارية نحو dependency بدل الحكم على نسب الفشل.",
            "Load shedding: رفض الطلبات الواردة الجديدة عندما يصبح طابورك عميقاً جداً.",
            "Hedged requests: إذا كان الاستدعاء الأول أبطأ من المعتاد أرسل نسخة ثانية وخذ أسرع رد — بتكلفة ترافيك إضافي.",
            "بيانات بديلة من الـ cache أو قديمة، فيتحوّل الفشل إلى مقايضة في الدقة بدل خطأ."
          ]
        }
      }
    ]},
    { key: "mistakes", blocks: [
      { t: "mistake",
        title: { en: "Every layer has the same timeout, so the outer one never fires", ar: "كل طبقة لها نفس الـ timeout، فالخارجي لا ينطلق أبداً" },
        body: {
          en: "A team set 30 seconds everywhere: the browser, the gateway, the orders API, and the Pricing call. When Pricing hung, the browser gave up at the same instant as the server. The user saw a blank error page and the server logged nothing useful, because it was still waiting when the connection closed. Timeouts must shrink as you go deeper: 10 s at the gateway, 3 s in the orders API, 500 ms for the Pricing call. Then the layer closest to the problem is the one that reports it, and the outer layers still have time to build a proper error response.",
          ar: "ضبطت إحدى الفرق 30 ثانية في كل مكان: المتصفح، الـ gateway، و orders API، واستدعاء Pricing. عندما تعلّق Pricing استسلم المتصفح في نفس اللحظة التي استسلم فيها الخادم. رأى المستخدم صفحة خطأ فارغة ولم يسجّل الخادم شيئاً مفيداً لأنه كان ما زال ينتظر عند إغلاق الاتصال. يجب أن تصغر المُهل كلما نزلت أعمق: 10 ثوانٍ عند الـ gateway، و3 ثوانٍ في orders API، و500 ms لاستدعاء Pricing. عندها تكون الطبقة الأقرب للمشكلة هي التي تبلّغ عنها، ويبقى للطبقات الخارجية وقت لبناء رد خطأ مناسب."
        }
      },
      { t: "mistake",
        title: { en: "The CancellationToken is accepted and then not passed on", ar: "استقبال الـ CancellationToken ثم عدم تمريره" },
        body: {
          en: "The method signature took a CancellationToken, which made code review pass, but the token was never handed to the HTTP call or the database query inside. Cancellation only works if the token reaches the thing that is actually waiting. The timeout fired, the flag flipped, and absolutely nothing happened — the call kept running to completion. Passing the token is the whole mechanism; a token that stops at the top of a method is decoration.",
          ar: "أخذت الدالة CancellationToken في توقيعها فمرّت مراجعة الكود، لكن الـ token لم يُسلَّم إطلاقاً إلى استدعاء الـ HTTP ولا إلى استعلام الـ database بداخلها. الإلغاء لا يعمل إلا إذا وصل الـ token إلى الشيء الذي ينتظر فعلاً. انطلق الـ timeout وانقلب العلم ولم يحدث أي شيء — استمر الاستدعاء حتى نهايته. تمرير الـ token هو الآلية كلها، والـ token الذي يتوقّف عند رأس الدالة مجرد زينة."
        },
        fix: "// bad: token ignored\nvar r = await _http.GetAsync(url);\n\n// good: token reaches the awaiting operation\nvar r = await _http.GetAsync(url, ct);\nvar rows = await _db.Orders.ToListAsync(ct);"
      },
      { t: "mistake",
        title: { en: "Retrying a non-idempotent write after a timeout", ar: "إعادة محاولة كتابة غير idempotent بعد timeout" },
        body: {
          en: "POST /payments timed out at 2 seconds, so the retry policy sent it twice more. The payment service had actually received and processed all three; only the responses were slow. The customer was charged three times. A timeout tells you nothing about whether the other side did the work — it only tells you that you stopped waiting. Retrying a write is safe only when the request carries an idempotency key, meaning a unique client-generated id the server uses to recognise and ignore a duplicate.",
          ar: "انتهى وقت POST /payments عند ثانيتين، فأرسلته سياسة الـ retry مرتين إضافيتين. وقد استقبلت خدمة الدفع الطلبات الثلاثة ونفّذتها كلها، والبطيء كان الردود فقط. فتم خصم المبلغ من العميل ثلاث مرات. الـ timeout لا يخبرك بشيء عمّا إذا نفّذ الطرف الآخر العمل — يخبرك فقط أنك توقّفت عن الانتظار. إعادة محاولة الكتابة آمنة فقط عندما يحمل الطلب idempotency key، أي معرّفاً فريداً ينشئه العميل ويستخدمه الخادم للتعرّف على النسخة المكرّرة وتجاهلها."
        }
      },
      { t: "mistake",
        title: { en: "One breaker shared by every call to a host", ar: "breaker واحد مشترك لكل الاستدعاءات نحو host واحد" },
        body: {
          en: "A typed client — one HttpClient registered at startup and injected into a class — called both GET /prices, which is a fast cache read, and POST /reprice, which is a heavy recalculation. The reprice endpoint started failing under load. Its failures tripped the shared breaker, and price reads — perfectly healthy and used by every page — began failing too. The breaker should sit per dependency-and-operation, not per hostname. A cheap fix is a separate typed client, and therefore a separate pipeline, per group of endpoints with similar cost and criticality.",
          ar: "استُخدم typed client — أي HttpClient واحد يُسجَّل عند الإقلاع ويُحقن في class — لاستدعاء GET /prices، وهو قراءة سريعة من الـ cache، و POST /reprice، وهو إعادة حساب ثقيلة. بدأ endpoint إعادة الحساب يفشل تحت الحمل. فصلَت حالاتُ فشله الـ breaker المشترك، فبدأت قراءات الأسعار — وهي سليمة تماماً وتستخدمها كل صفحة — تفشل هي أيضاً. يجب أن يكون الـ breaker لكل dependency وعملية، لا لكل hostname. الحل الرخيص هو typed client منفصل، وبالتالي pipeline منفصل، لكل مجموعة endpoints متقاربة في التكلفة والأهمية."
        }
      }
    ]},
    { key: "interview", blocks: [
      { t: "qa", level: "junior",
        q: { en: "What is a timeout, and what happens on the server when one fires?", ar: "ما هو الـ timeout، وماذا يحدث على الخادم عندما ينطلق؟" },
        a: {
          en: "A timeout is a maximum wait I set on a call. If the answer has not arrived by then, my code stops waiting and gets an exception, usually OperationCanceledException in .NET. The important part is what does not happen: the server on the other side does not find out. It keeps processing my request and may still write to its database. So a timeout means \"I gave up\", not \"it did not happen\". That is why I treat a timed-out write as unknown rather than failed.",
          ar: "الـ timeout هو أقصى مدة انتظار أضعها على استدعاء. إن لم يصل الرد خلالها يتوقّف كودي عن الانتظار ويحصل على استثناء، وهو غالباً OperationCanceledException في .NET. المهم هو ما لا يحدث: الخادم في الطرف الآخر لا يعلم بذلك. يواصل معالجة طلبي وقد يكتب في الـ database. إذن الـ timeout يعني «أنا انسحبت» لا «لم يحدث شيء». لذلك أعتبر الكتابة التي انتهى وقتها حالة مجهولة لا فاشلة."
        }
      },
      { t: "qa", level: "mid",
        q: { en: "Walk me through the three circuit breaker states.", ar: "اشرح لي حالات الـ circuit breaker الثلاث." },
        a: {
          en: "Closed is normal — calls go through and the breaker just counts how many succeeded and failed in a rolling window, say the last 30 seconds. If the failure share crosses a threshold, for example half the calls, it moves to open. Open means every call fails immediately without touching the network, which is what saves the caller. After a break duration, say 15 seconds, it moves to half-open and lets a single trial call through. If that call succeeds it closes; if it fails it opens again. Half-open exists so recovery is tested with one request instead of the full flood coming back at once.",
          ar: "الحالة Closed هي الطبيعية — الاستدعاءات تمر ويكتفي الـ breaker بعدّ الناجح والفاشل ضمن نافذة متحرّكة، لنقل آخر 30 ثانية. إذا تجاوزت نسبة الفشل عتبة معيّنة، مثلاً نصف الاستدعاءات، ينتقل إلى Open. و Open تعني أن كل استدعاء يفشل فوراً دون لمس الشبكة، وهذا ما ينقذ المستدعي. بعد مدة الفصل، لنقل 15 ثانية، ينتقل إلى Half-open ويسمح باستدعاء تجريبي واحد. إن نجح يعود إلى Closed، وإن فشل يفتح من جديد. وُجدت Half-open حتى يُختبر التعافي بطلب واحد بدل عودة الفيضان كله دفعة واحدة."
        }
      },
      { t: "qa", level: "mid",
        q: { en: "How do you choose the actual timeout number?", ar: "كيف تختار قيمة الـ timeout فعلياً؟" },
        a: {
          en: "I start from the dependency's measured latency, not from a round number. I look at its p99 — the value that 99 out of 100 calls come in under — and set the timeout a bit above it, commonly around p99 plus a margin. If Pricing's p99 is 300 ms I use 500 ms. Below p99 I would be killing calls that were about to succeed. Far above it I am just waiting on calls that are already lost. Then I check it fits the parent budget: if my endpoint promises a 3-second response and makes three sequential calls, those three timeouts plus my own work must add up to less than 3 seconds.",
          ar: "أبدأ من الـ latency المقاس للـ dependency لا من رقم مستدير. أنظر إلى p99 عندها — وهي القيمة التي ينتهي تحتها 99 استدعاء من كل 100 — وأضع الـ timeout فوقها بقليل، عادة p99 زائد هامش. إذا كان p99 عند Pricing هو 300 ms أستخدم 500 ms. لو نزلت تحت p99 لكنت أقتل استدعاءات كانت على وشك النجاح. ولو ارتفعت كثيراً فوقها لكنت أنتظر استدعاءات ضائعة أصلاً. ثم أتأكد أنها تناسب الميزانية الأعلى: إذا وعد endpoint عندي برد خلال 3 ثوانٍ ويقوم بثلاثة استدعاءات متتابعة، فمجموع هذه المُهل مع عملي أنا يجب أن يقل عن 3 ثوانٍ."
        }
      },
      { t: "qa", level: "senior",
        q: { en: "Why is a circuit breaker not enough on its own? What do you add?", ar: "لماذا لا يكفي الـ circuit breaker وحده؟ وماذا تضيف؟" },
        a: {
          en: "A breaker only reacts after enough failures, so during the window before it trips you still pile up in-flight calls. It also does nothing for a dependency that is slow but succeeding — no failures, no trip, and your latency is still ruined. So I pair it with two things. A bulkhead, which is a hard cap on concurrent calls to that dependency: past the cap, calls are rejected instantly, and that bound holds from the first millisecond rather than after a sampling window. And a fallback, so the caller has something to return — a cached price, a partial response with the price field omitted, or a clear 503 with Retry-After. Without a fallback, a breaker just converts slow failures into fast failures, which is better but still an outage.",
          ar: "الـ breaker لا يتفاعل إلا بعد عدد كافٍ من حالات الفشل، لذا تبقى الاستدعاءات الجارية تتراكم خلال النافذة السابقة لفصله. كما أنه لا يفيد مع dependency بطيئة لكنها ناجحة — لا فشل، فلا فصل، ويبقى الـ latency عندك مدمّراً. لذلك أضمّ إليه شيئين. الأول bulkhead، وهو حد صارم لعدد الاستدعاءات المتزامنة نحو تلك الـ dependency: بعد الحد تُرفض الاستدعاءات فوراً، وهذا القيد يعمل من الميلي ثانية الأولى لا بعد نافذة قياس. والثاني fallback ليكون لدى المستدعي ما يرجعه — سعر من الـ cache، أو رد جزئي بدون حقل السعر، أو 503 واضح مع Retry-After. بدون fallback يحوّل الـ breaker الفشل البطيء إلى فشل سريع فقط، وهذا أفضل لكنه يبقى انقطاعاً."
        }
      },
      { t: "qa", level: "senior",
        q: { en: "Your service has ten instances. Each has its own breaker. Is that a problem?", ar: "خدمتك تعمل بعشر نسخ، ولكل واحدة breaker خاص بها. هل هذه مشكلة؟" },
        a: {
          en: "Mostly it is a feature. Each instance decides from what it actually observed, so an instance in a bad network zone can trip while the others keep serving, and you never have one global switch that turns off a dependency for everyone at once. The cost is that recovery is ragged: after a break duration, ten instances each send a trial call and they arrive at different moments, which is fine, but if they happened to trip together they also half-open together and can hit the recovering service with ten simultaneous probes. That is small at ten instances and real at a thousand. The fixes are jitter on the break duration — adding a small random offset so the instances do not wake up together — and allowing only one trial call at a time. I would only reach for shared breaker state in a coordination store if I had measured a genuine problem, because it adds a network hop and a shared point of failure to the very path meant to protect me.",
          ar: "في الغالب هذه ميزة لا مشكلة. كل نسخة تقرّر بناءً على ما لاحظته فعلاً، فتستطيع نسخة في منطقة شبكة سيئة أن تفصل بينما تواصل البقية الخدمة، ولا يوجد مفتاح عام واحد يطفئ dependency للجميع دفعة واحدة. التكلفة أن التعافي غير منتظم: بعد مدة الفصل ترسل كل نسخة استدعاءً تجريبياً وتصل في لحظات مختلفة وهذا جيد، لكن إن كانت فصلت معاً فستنتقل إلى half-open معاً وقد تضرب الخدمة المتعافية بعشر محاولات متزامنة. هذا بسيط عند عشر نسخ وحقيقي عند ألف. والعلاج هو jitter على مدة الفصل — أي إضافة إزاحة عشوائية صغيرة حتى لا تستيقظ النسخ معاً — والسماح باستدعاء تجريبي واحد في كل مرة. ولن ألجأ إلى حالة breaker مشتركة في مخزن تنسيق إلا إذا قِست مشكلة فعلية، لأن ذلك يضيف قفزة شبكة ونقطة فشل مشتركة على نفس المسار الذي يفترض أن يحميني."
        }
      },
      { t: "qa", level: "staff",
        q: { en: "Timeouts keep being forgotten across dozens of services. How do you fix that structurally?", ar: "المُهل تُنسى باستمرار عبر عشرات الخدمات. كيف تعالج ذلك بنيوياً؟" },
        a: {
          en: "I stop treating it as a discipline problem, because reminding people in review does not scale past a few teams. First, make the safe path the default one: ship an internal package that registers HTTP clients with timeout, retry and breaker already configured, so an unprotected client requires extra work rather than less. Second, make the absence detectable — a startup check that fails the build or the boot if any registered HttpClient still has the 100-second default, plus a dashboard of calls with no deadline. Third, publish the budget as a contract: every service declares the latency it promises, and reviewers check that a new dependency's timeout fits inside the caller's declared budget. Fourth, prove it works — a scheduled fault-injection run that makes one dependency slow in a test environment and asserts the caller degrades instead of falling over. Documentation alone changes nothing; defaults, checks and drills do.",
          ar: "أتوقّف عن معاملتها كمشكلة انضباط، لأن التذكير في المراجعات لا يتوسّع أبعد من بضعة فرق. أولاً أجعل المسار الآمن هو الافتراضي: أطرح حزمة داخلية تسجّل الـ HTTP clients ومعها timeout و retry و breaker مضبوطة مسبقاً، بحيث يحتاج العميل غير المحمي إلى عمل إضافي لا أقل. ثانياً أجعل الغياب قابلاً للكشف — فحص عند الإقلاع يُفشل البناء أو التشغيل إذا بقي أي HttpClient مسجّل على القيمة الافتراضية 100 ثانية، مع لوحة لعرض الاستدعاءات بلا مهلة. ثالثاً أنشر الميزانية كعقد: كل خدمة تعلن الـ latency الذي تعد به، ويتحقق المراجعون أن مهلة الـ dependency الجديدة تدخل ضمن ميزانية المستدعي المعلنة. رابعاً أثبت أن الأمر يعمل — تشغيل مجدول لحقن الأعطال يجعل dependency واحدة بطيئة في بيئة اختبار ويتأكد أن المستدعي يتدهور بلطف بدل أن ينهار. التوثيق وحده لا يغيّر شيئاً، بل الافتراضات والفحوص والتمارين."
        }
      }
    ]},
    { key: "codereview", blocks: [
      { t: "review", severity: "high",
        title: { en: "New HttpClient per call, no timeout, and a blocking wait", ar: "HttpClient جديد لكل استدعاء، بلا timeout، مع انتظار حاجب" },
        bad: "public PriceDto GetPrice(int id)\n{\n    // 1. new client per call: sockets are not reused and linger\n    //    in TIME_WAIT, so under load the machine runs out of ports\n    using var http = new HttpClient();\n\n    // 2. no timeout set, so the default is 100 seconds\n    // 3. .Result blocks the calling thread for all of it\n    var json = http.GetStringAsync($\"https://pricing.internal/prices/{id}\").Result;\n\n    return JsonSerializer.Deserialize<PriceDto>(json)!;\n}",
        good: "// registered once at startup with a real timeout and a pipeline\npublic sealed class PricingClient(HttpClient http)\n{\n    public async Task<PriceDto?> GetPriceAsync(int id, CancellationToken ct)\n    {\n        using var response = await http.GetAsync($\"/prices/{id}\", ct);\n        if (!response.IsSuccessStatusCode) return null;\n        return await response.Content.ReadFromJsonAsync<PriceDto>(ct);\n    }\n}",
        why: {
          en: "Three separate faults compound here. First, creating an HttpClient per call leaves each closed TCP connection in a waiting state for about two minutes. A busy endpoint therefore runs the machine out of source ports. Second, no timeout means the 100-second default applies. Third, `.Result` blocks a thread pool thread for the entire wait. At 200 requests per second against a hung dependency, the thread pool drains in seconds and the process stops answering everything, including its health check. The fixed version uses an injected client configured once at startup, awaits instead of blocking, and passes the caller's cancellation token down to the call.",
          ar: "ثلاثة أخطاء منفصلة تتراكم هنا. أولاً، إنشاء HttpClient لكل استدعاء يترك كل اتصال TCP مغلق في حالة انتظار لدقيقتين تقريباً. لذلك يستنفد endpoint مزدحم كل الـ ports المصدرية على الجهاز. ثانياً، غياب الـ timeout يعني تطبيق القيمة الافتراضية 100 ثانية. ثالثاً، ‎.Result‎ يحجب thread من الـ thread pool طوال مدة الانتظار. وعند 200 طلب في الثانية نحو dependency متعلّقة يُستنزف الـ thread pool خلال ثوانٍ ويتوقّف الـ process عن الرد على كل شيء بما فيه فحص الصحة. النسخة المصحّحة تستخدم client محقوناً ومضبوطاً مرة واحدة عند الإقلاع، وتستخدم await بدل الحجب، وتمرّر cancellation token الخاص بالمستدعي إلى الاستدعاء."
        }
      },
      { t: "review", severity: "medium",
        title: { en: "Catching the breaker's exception and hiding it as a 200", ar: "التقاط استثناء الـ breaker وإخفاؤه كرد 200" },
        bad: "try\n{\n    order.Price = await _pricing.GetPriceAsync(id, ct);\n}\ncatch (Exception)\n{\n    order.Price = 0m;   // silently pretend the price is zero\n}\nreturn Ok(order);",
        good: "try\n{\n    order.Price = await _pricing.GetPriceAsync(id, ct);\n}\ncatch (Exception ex) when (ex is BrokenCircuitException or TimeoutRejectedException)\n{\n    _pricingUnavailable.Add(1);          // metric: someone must see this\n    _logger.LogWarning(ex, \"Pricing unavailable for order {OrderId}\", id);\n    order.Price = null;                  // explicitly absent, not zero\n    order.PriceStatus = \"unavailable\";   // the client can act on this\n}\nreturn Ok(order);",
        why: {
          en: "Degrading gracefully is right; degrading silently is not. Two things are wrong in the bad version. Catching bare Exception also swallows programming errors like a null reference or a bad deserialisation, which then look like a pricing outage forever. And returning 0 is a lie the client cannot detect — a price of zero is a valid number, so a UI will display \"Free\" and a downstream job may bill zero. The fixed version catches only the two resilience exceptions, records a metric so the outage is visible on a dashboard, and returns an explicitly absent price with a status field, so the caller can show \"price unavailable\" instead of a wrong number.",
          ar: "التدهور اللطيف صحيح، أما التدهور الصامت فلا. هناك خطآن في النسخة السيئة. التقاط Exception المجرّد يبتلع أيضاً أخطاء برمجية مثل null reference أو فشل في الـ deserialisation، فتبدو للأبد وكأنها انقطاع في Pricing. وإرجاع 0 كذبة لا يستطيع العميل كشفها — فالسعر صفر رقم صالح، وستعرض الواجهة «مجاني» وقد تفوتر مهمة لاحقة بصفر. النسخة المصحّحة تلتقط استثناءي المرونة فقط، وتسجّل metric ليصبح الانقطاع مرئياً على لوحة، وترجع سعراً غائباً بشكل صريح مع حقل حالة، فيستطيع المستدعي عرض «السعر غير متاح» بدل رقم خاطئ."
        }
      }
    ]},
    { key: "sysdesign", blocks: [
      { t: "p",
        en: "In a system design interview, timeouts are how you show you understand partial failure. The move is to draw the call chain and put a number on every arrow, from the outside in. Browser waits 10 s for the gateway. The gateway waits 8 s for the orders API. The orders API promises 3 s and inside that spends at most 500 ms on Pricing, 300 ms on the inventory cache and 1 s on its own database. The numbers shrink as you go deeper, and the sum of the inner ones stays under the outer one. That gap is deliberate: it is the time left to build and send an error response after something inside fails.",
        ar: "في مقابلة تصميم الأنظمة، المُهل هي الطريقة التي تُظهر بها أنك تفهم الفشل الجزئي. الحركة الصحيحة هي رسم سلسلة الاستدعاءات ووضع رقم على كل سهم من الخارج إلى الداخل. المتصفح ينتظر الـ gateway عشر ثوانٍ. والـ gateway ينتظر orders API ثماني ثوانٍ. و orders API يعد بثلاث ثوانٍ ينفق منها 500 ms كحد أقصى على Pricing، و300 ms على inventory cache، وثانية واحدة على قاعدة بياناته. الأرقام تصغر كلما نزلت أعمق، ويبقى مجموع الداخلية أقل من الخارجية. هذه الفجوة مقصودة: هي الوقت المتبقي لبناء رد خطأ وإرساله بعد فشل شيء في الداخل."
      },
      { t: "ul",
        en: [
          "Deadline propagation: pass the remaining time down with the request, so a call that arrives with 200 ms left does not start a 500 ms attempt. gRPC does this natively; over HTTP you send a header and honour it.",
          "Classify dependencies as critical or optional before choosing numbers. Optional ones — recommendations, badges, related items — get short timeouts and a fallback. Critical ones — auth, payment — get a longer timeout and a real error.",
          "Put a breaker on every network hop that can fail independently, and a separate one per operation class, so a heavy write endpoint failing does not block cheap reads on the same host.",
          "Decide what an open breaker returns before you build it: cached data, a partial response with fields omitted, or 503 with a Retry-After header telling the client when to come back.",
          "Cap concurrency per dependency as well as time. A bulkhead of, say, 50 in-flight calls bounds the damage from the very first request, before any breaker has enough samples to trip."
        ],
        ar: [
          "Deadline propagation: مرّر الوقت المتبقي مع الطلب إلى الأسفل، حتى لا يبدأ استدعاء وصل ومعه 200 ms محاولةً مدتها 500 ms. يفعل gRPC ذلك أصلاً، وفي HTTP ترسل header وتحترمه.",
          "صنّف الـ dependencies إلى حرجة واختيارية قبل اختيار الأرقام. الاختيارية — التوصيات والشارات والعناصر المرتبطة — تأخذ مُهلاً قصيرة وبديلاً. والحرجة — auth والدفع — تأخذ مهلة أطول وخطأً حقيقياً.",
          "ضع breaker على كل قفزة شبكة يمكن أن تفشل بشكل مستقل، وواحداً منفصلاً لكل صنف من العمليات، حتى لا يعطّل فشلُ endpoint كتابة ثقيلة قراءاتٍ رخيصة على نفس الـ host.",
          "قرّر ماذا يرجع الـ breaker المفتوح قبل أن تبنيه: بيانات من الـ cache، أو رد جزئي بحقول محذوفة، أو 503 مع header اسمه Retry-After يخبر العميل متى يعود.",
          "حدّد التزامن لكل dependency إلى جانب الوقت. bulkhead بحد 50 استدعاءً جارياً مثلاً يحدّ الضرر من الطلب الأول، قبل أن تتوفّر للـ breaker عيّنات كافية للفصل."
        ]
      },
      { t: "callout", kind: "warn",
        en: "Timeouts and retries multiply. A 2 s timeout with 3 attempts at each of 3 chained services is a worst case of 2 × 3 × 3 = 18 seconds, and a single user request can turn into 27 calls on the dependency at the bottom. Always compute the worst case, not the happy path.",
        ar: "المُهل والـ retries تتضاعف. timeout مدته ثانيتان مع ثلاث محاولات عند كل خدمة من ثلاث خدمات متسلسلة يعطي أسوأ حالة 2 × 3 × 3 = 18 ثانية، وقد يتحوّل طلب مستخدم واحد إلى 27 استدعاءً على الـ dependency في الأسفل. احسب دائماً أسوأ حالة لا المسار السعيد."
      }
    ]},
    { key: "perf", blocks: [
      { t: "kv", rows: [
        { k: { en: "Latency", ar: "Latency" },
          v: { en: "A timeout caps your p99 — the time the slowest 1 in 100 requests take. Without one, your p99 is the dependency's worst case, whatever that turns out to be.", ar: "الـ timeout يحدّ سقف p99 عندك، أي زمن أبطأ طلب من كل 100. وبدونه يصبح p99 عندك هو أسوأ حالة عند الـ dependency مهما كانت." } },
        { k: { en: "Memory", ar: "الذاكرة" },
          v: { en: "In-flight calls equal arrival rate times wait. Cutting the wait from 30 s to 0.5 s cut our example from 6000 pending requests to 100, and their buffers with them.", ar: "الاستدعاءات الجارية تساوي معدّل الوصول مضروباً في مدة الانتظار. خفض الانتظار من 30 ثانية إلى 0.5 ثانية خفض مثالنا من 6000 طلب معلّق إلى 100، ومعها buffers كل واحد." } },
        { k: { en: "Network", ar: "الشبكة" },
          v: { en: "Each pending call holds a socket. Sockets and source ports are finite per machine, roughly 28000 usable by default on Linux, and running out breaks every outbound call.", ar: "كل استدعاء معلّق يحجز socket. والـ sockets والـ ports المصدرية محدودة لكل جهاز، نحو 28000 قابلة للاستخدام افتراضياً على Linux، ونفادها يعطّل كل استدعاء صادر." } },
        { k: { en: "CPU", ar: "المعالج" },
          v: { en: "The breaker itself is nearly free: a counter and a state check, well under a microsecond. An open breaker is the cheapest possible outcome — it does no work at all.", ar: "الـ breaker نفسه شبه مجاني: عدّاد وفحص حالة، أقل بكثير من ميكروثانية. والـ breaker المفتوح هو أرخص نتيجة ممكنة لأنه لا ينفّذ أي عمل." } },
        { k: { en: "Scalability", ar: "قابلية التوسّع" },
          v: { en: "Without timeouts, adding instances just gives a slow dependency more victims. With them, each instance stays healthy and horizontal scaling actually helps.", ar: "بدون مُهل، إضافة نسخ تعطي الـ dependency البطيئة ضحايا أكثر فقط. ومعها تبقى كل نسخة سليمة ويصبح التوسّع الأفقي مفيداً فعلاً." } }
      ]}
    ]},
    { key: "debug", blocks: [
      { t: "ul",
        en: [
          "Metrics on the breaker: Polly emits a counter on every state change, in the OpenTelemetry format that most monitoring tools read. Chart the open/closed transitions per dependency — a breaker flapping open and closed every minute means your threshold is too tight or the dependency is half-broken.",
          "A distributed trace of one slow request: look for a span that ends exactly at your timeout value. A span stopping at precisely 500 ms is a timeout, not slow work, and its parent tells you which call to blame.",
          "dotnet-counters monitor --counters System.Net.Http on the running process: `current-requests` is the number of HTTP calls in flight right now. If it climbs and never falls, calls are going out and not coming back.",
          "dotnet-dump collect then `dumpasync` in dotnet-dump analyze: lists the pending async operations. Hundreds all stopped at the same await line points straight at the unbounded call.",
          "ss -tan state established | wc -l on Linux (netstat -an on Windows): counts open TCP connections. A count in the thousands to one host confirms connection buildup rather than a CPU problem."
        ],
        ar: [
          "مقاييس الـ breaker: يصدر Polly عدّاداً عند كل تغيّر حالة، بصيغة OpenTelemetry التي تقرأها معظم أدوات المراقبة. ارسم انتقالات open/closed لكل dependency — الـ breaker الذي يفتح ويغلق كل دقيقة يعني أن عتبتك ضيّقة جداً أو أن الـ dependency نصف معطّلة.",
          "trace موزّع لطلب بطيء واحد: ابحث عن span ينتهي عند قيمة الـ timeout بالضبط. الـ span الذي يتوقّف عند 500 ms تماماً هو timeout لا عمل بطيء، والـ parent الخاص به يخبرك أي استدعاء تلوم.",
          "الأمر dotnet-counters monitor --counters System.Net.Http على الـ process العامل: القيمة ‎current-requests‎ هي عدد استدعاءات HTTP الجارية الآن. إن ارتفعت ولم تهبط فالاستدعاءات تخرج ولا تعود.",
          "الأمر dotnet-dump collect ثم ‎dumpasync‎ داخل dotnet-dump analyze: يعرض العمليات الـ async المعلّقة. مئات منها متوقفة عند نفس سطر الـ await تشير مباشرة إلى الاستدعاء غير المحدود.",
          "الأمر ss -tan state established | wc -l على Linux (أو netstat -an على Windows): يعدّ اتصالات TCP المفتوحة. عدد بالآلاف نحو host واحد يؤكد تراكم الاتصالات لا مشكلة في المعالج."
        ]
      },
      { t: "callout", kind: "tip",
        en: "Log the timeout value alongside the failure: \"Pricing timed out after 500ms\". A log line saying only \"request failed\" cannot tell you whether the dependency was slow or your budget was too tight — and those two have opposite fixes.",
        ar: "سجّل قيمة الـ timeout مع الفشل هكذا: «Pricing timed out after 500ms». سطر سجل يقول «request failed» فقط لا يستطيع أن يخبرك هل كانت الـ dependency بطيئة أم كانت ميزانيتك ضيّقة — وللحالتين علاجان متعاكسان."
      }
    ]},
    { key: "realworld", blocks: [
      { t: "p",
        en: "Any system where one user action fans out to several backend calls lives or dies on this. The pattern is always the same: identify which calls are optional, give them a short timeout and a fallback, and keep the page or the transaction alive without them. The teams that get this right are the ones whose product visibly degrades — a missing recommendation strip, a stale count — instead of showing an error page, during an incident their users never hear about.",
        ar: "أي نظام يتفرّع فيه فعل مستخدم واحد إلى عدة استدعاءات خلفية يعيش أو يموت بهذا. النمط واحد دائماً: حدّد أي الاستدعاءات اختيارية، وأعطها timeout قصيراً وبديلاً، وأبقِ الصفحة أو المعاملة حية بدونها. الفرق التي تتقن هذا هي التي يتدهور منتجها بشكل مرئي — شريط توصيات غائب أو عدّاد قديم — بدل عرض صفحة خطأ، أثناء حادثة لا يسمع بها مستخدموها أصلاً."
      },
      { t: "ul",
        en: [
          "E-commerce checkout: the payment call gets a long timeout and no automatic retry without an idempotency key, while the recommendations panel gets 100 ms and silently disappears when it is slow.",
          "Streaming and media apps: the play button never waits on the personalisation service. If it does not answer in 200 ms the app shows a generic row and starts playback anyway.",
          "Banking and payment rails: the network call to the card scheme has a strict timeout, and a timed-out authorisation is written as \"unknown\" and reconciled later, never assumed failed.",
          "Chat platforms: presence and typing indicators time out in tens of milliseconds and fall back to \"last seen\" data, because message delivery must never wait on a decorative feature."
        ],
        ar: [
          "الدفع في التجارة الإلكترونية: استدعاء الدفع يأخذ timeout طويلاً وبلا إعادة محاولة تلقائية دون idempotency key، بينما تأخذ لوحة التوصيات 100 ms وتختفي بهدوء إن تأخّرت.",
          "تطبيقات البث والوسائط: زر التشغيل لا ينتظر خدمة التخصيص أبداً. إن لم ترد خلال 200 ms يعرض التطبيق صفاً عاماً ويبدأ التشغيل على أي حال.",
          "الأنظمة المصرفية وقنوات الدفع: الاستدعاء الشبكي نحو شبكة البطاقات له timeout صارم، والتفويض الذي انتهى وقته يُسجَّل «مجهولاً» ويُسوّى لاحقاً، ولا يُفترض فاشلاً أبداً.",
          "منصّات المحادثة: مؤشّرات التواجد والكتابة لها مُهل بعشرات الميلي ثانية وترجع إلى بيانات «آخر ظهور»، لأن تسليم الرسائل يجب ألا ينتظر ميزة تجميلية أبداً."
        ]
      }
    ]},
    { key: "exercises", blocks: [
      { t: "ex", diff: "easy",
        en: "Build a small API with one endpoint that calls a fake dependency you control, and make that dependency sleep 10 seconds. Call your endpoint with no timeout configured and time it — it should take about 10 seconds. Now set HttpClient.Timeout to 1 second and call again. You have got it right when the second call fails in about 1 second and the exception you catch is a TaskCanceledException, which is a kind of OperationCanceledException.",
        ar: "ابنِ API صغيراً فيه endpoint واحد يستدعي dependency وهمية تتحكم بها، واجعل تلك الـ dependency تنام 10 ثوانٍ. استدعِ الـ endpoint بلا timeout وقِس الزمن — يجب أن يستغرق نحو 10 ثوانٍ. ثم اضبط HttpClient.Timeout على ثانية واحدة واستدعِ مرة أخرى. تكون قد نجحت عندما يفشل الاستدعاء الثاني خلال ثانية تقريباً ويكون الاستثناء الذي تلتقطه TaskCanceledException، وهو نوع من OperationCanceledException."
      },
      { t: "ex", diff: "medium",
        en: "Add a Polly circuit breaker to that client with a 50% failure ratio, a 10-second sampling window, a minimum of 5 calls and a 5-second break. Send 20 requests while the fake dependency is failing, then make it healthy again. You have got it right when your logs show the breaker opening after roughly the fifth failure, requests failing in under a millisecond while it is open, one trial request going out after 5 seconds, and the breaker closing.",
        ar: "أضف circuit breaker من Polly إلى ذلك الـ client بنسبة فشل 50%، ونافذة قياس 10 ثوانٍ، وحد أدنى 5 استدعاءات، ومدة فصل 5 ثوانٍ. أرسل 20 طلباً بينما الـ dependency الوهمية تفشل، ثم أعدها سليمة. تكون قد نجحت عندما تُظهر سجلاتك فتح الـ breaker بعد الفشل الخامس تقريباً، وفشل الطلبات خلال أقل من ميلي ثانية أثناء فتحه، وخروج طلب تجريبي واحد بعد 5 ثوانٍ، ثم إغلاق الـ breaker."
      },
      { t: "ex", diff: "hard",
        en: "Implement deadline propagation across two of your own services. Service A sends a header carrying the milliseconds it has left; service B reads it, subtracts its own expected work, and uses the remainder as the timeout for its call to service C. You have got it right when a request that arrives at B with 50 ms left fails immediately with a deadline-exceeded error instead of starting a 500 ms attempt it can never finish in time.",
        ar: "نفّذ deadline propagation بين خدمتين من عندك. الخدمة A ترسل header يحمل عدد الميلي ثواني المتبقية لها؛ والخدمة B تقرأه وتطرح منه عملها المتوقّع وتستخدم الباقي كـ timeout لاستدعائها الخدمة C. تكون قد نجحت عندما يفشل فوراً طلبٌ يصل إلى B ومعه 50 ms متبقية بخطأ تجاوز المهلة، بدل أن يبدأ محاولة مدتها 500 ms لا يمكن أن ينهيها في الوقت."
      },
      { t: "ex", diff: "senior",
        en: "Take one real service you own and produce a one-page timeout budget: every outbound call, its measured p99, its current timeout, and whether the sum fits inside what the service promises its callers. Then run a fault-injection test that makes the single most critical dependency slow. You have got it right when you can name at least one call whose timeout was wrong, show the fix, and demonstrate that the service now degrades to a partial response instead of failing its health check.",
        ar: "خذ خدمة حقيقية تملكها وأنتج صفحة واحدة لميزانية المُهل: كل استدعاء صادر، و p99 المقاس له، والـ timeout الحالي، وهل يدخل المجموع ضمن ما تعد به الخدمة مستدعيها. ثم شغّل اختبار حقن أعطال يجعل أهم dependency لديك بطيئة. تكون قد نجحت عندما تستطيع تسمية استدعاء واحد على الأقل كانت مهلته خاطئة، وتعرض التصحيح، وتُظهر أن الخدمة تتدهور الآن إلى رد جزئي بدل أن تُفشل فحص صحتها."
      }
    ]},
    { key: "refs", blocks: [
      { t: "ref",
        label: { en: "Polly resilience strategies: timeout, retry, circuit breaker", ar: "استراتيجيات المرونة في Polly: timeout و retry و circuit breaker" },
        url: "https://www.pollydocs.org/strategies/circuit-breaker.html",
        meta: { en: "Docs", ar: "توثيق" }
      },
      { t: "ref",
        label: { en: "Microsoft: building resilient HTTP apps with the standard resilience handler", ar: "Microsoft: بناء تطبيقات HTTP مرنة باستخدام standard resilience handler" },
        url: "https://learn.microsoft.com/en-us/dotnet/core/resilience/http-resilience",
        meta: { en: "Docs", ar: "توثيق" }
      },
      { t: "ref",
        label: { en: "Amazon Builders' Library: timeouts, retries and backoff with jitter", ar: "مكتبة Amazon Builders: المُهل وإعادة المحاولة والتراجع مع jitter" },
        url: "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/",
        meta: { en: "Article", ar: "مقال" }
      },
      { t: "ref",
        label: { en: "Martin Fowler: the Circuit Breaker pattern", ar: "Martin Fowler: نمط Circuit Breaker" },
        url: "https://martinfowler.com/bliki/CircuitBreaker.html",
        meta: { en: "Article", ar: "مقال" }
      }
    ]}
  ],
  quiz: [
    {
      q: {
        en: "Your call to a dependency times out after 2 seconds. What do you know about the state of the work on the other side?",
        ar: "انتهى وقت استدعائك لـ dependency بعد ثانيتين. ماذا تعرف عن حالة العمل في الطرف الآخر؟"
      },
      options: [
        { en: "It was rolled back, because the connection closed", ar: "تم التراجع عنه لأن الاتصال أُغلق" },
        { en: "Nothing — it may have completed, failed, or still be running", ar: "لا شيء — قد يكون اكتمل أو فشل أو ما زال يعمل" },
        { en: "It definitely failed, since no response arrived", ar: "فشل بالتأكيد لأنه لم يصل أي رد" },
        { en: "It was cancelled, because the token was marked cancelled", ar: "أُلغي لأن الـ token عُلِّم كملغى" }
      ],
      correct: 1,
      why: {
        en: "A timeout is a decision made entirely on the client side: you stopped waiting. The server usually never learns about it and keeps working, possibly committing its transaction. That is exactly why a timed-out write must be retried only with an idempotency key, or reconciled afterwards.",
        ar: "الـ timeout قرار يُتخذ بالكامل في جهة العميل: أنت توقّفت عن الانتظار. والخادم غالباً لا يعلم بذلك ويواصل عمله وقد يثبّت معاملته. ولهذا بالضبط لا يجوز إعادة محاولة كتابة انتهى وقتها إلا مع idempotency key، أو تسويتها لاحقاً."
      }
    },
    {
      q: {
        en: "In a Polly pipeline, where should the timeout strategy sit relative to the retry strategy?",
        ar: "في pipeline من Polly، أين يجب أن يقع الـ timeout بالنسبة للـ retry؟"
      },
      options: [
        { en: "Outside retry, so one budget covers all attempts together", ar: "خارج الـ retry، فتغطي ميزانية واحدة كل المحاولات معاً" },
        { en: "It makes no difference; the order is only cosmetic", ar: "لا فرق، فالترتيب شكلي فقط" },
        { en: "Inside retry, so each attempt gets its own bounded wait", ar: "داخل الـ retry، فتأخذ كل محاولة انتظارها المحدود الخاص" },
        { en: "Inside the circuit breaker but outside everything else", ar: "داخل الـ circuit breaker وخارج كل ما عداه" }
      ],
      correct: 2,
      why: {
        en: "The timeout goes innermost so it bounds each individual attempt. If it were outside the retry, a single 500 ms budget would have to cover attempt one, the backoff wait, attempt two and so on — the later attempts would be cancelled before they had a chance to run.",
        ar: "يوضع الـ timeout في الداخل ليحدّ كل محاولة على حدة. ولو كان خارج الـ retry لغطّت ميزانية 500 ms واحدة المحاولة الأولى وفترة التراجع والمحاولة الثانية وهكذا — فتُلغى المحاولات المتأخرة قبل أن تحصل على فرصة للعمل."
      }
    },
    {
      q: {
        en: "Why does a circuit breaker have a half-open state instead of just closing when the break duration ends?",
        ar: "لماذا للـ circuit breaker حالة half-open بدل أن يُغلق مباشرة عند انتهاء مدة الفصل؟"
      },
      options: [
        { en: "To let a single trial call test recovery before full traffic returns", ar: "ليسمح باستدعاء تجريبي واحد يختبر التعافي قبل عودة الترافيك كاملاً" },
        { en: "To give the caller time to warm its connection pool", ar: "ليمنح المستدعي وقتاً لتسخين connection pool عنده" },
        { en: "To flush the failure counters accumulated in the window", ar: "لتفريغ عدّادات الفشل المتراكمة في النافذة" },
        { en: "To let other instances of the service agree on the state", ar: "ليتفق باقي نسخ الخدمة على الحالة" }
      ],
      correct: 0,
      why: {
        en: "Closing immediately would send the full traffic back at a service that may still be struggling and knock it over again — the same reason you do not restart a struggling database and immediately point all traffic at it. Half-open probes with one request and only closes if that request succeeds.",
        ar: "الإغلاق الفوري يعيد الترافيك كاملاً إلى خدمة قد تكون ما زالت متعثّرة فيسقطها من جديد — لنفس السبب الذي يمنعك من إعادة تشغيل database متعثّرة وتوجيه كل الترافيك إليها فوراً. حالة half-open تجسّ النبض بطلب واحد ولا تغلق إلا إذا نجح ذلك الطلب."
      }
    },
    {
      q: {
        en: "An endpoint receives 100 requests per second and each one waits 4 seconds on a slow dependency. Roughly how many calls are in flight at any moment?",
        ar: "endpoint يستقبل 100 طلب في الثانية وينتظر كل طلب 4 ثوانٍ على dependency بطيئة. كم عدد الاستدعاءات الجارية تقريباً في أي لحظة؟"
      },
      options: [
        { en: "25", ar: "25" },
        { en: "100", ar: "100" },
        { en: "400", ar: "400" },
        { en: "4", ar: "4" }
      ],
      correct: 2,
      why: {
        en: "In-flight work equals arrival rate multiplied by how long each unit of work takes: 100 per second × 4 seconds = 400 concurrent calls. This is why latency and capacity are the same problem — every extra second of waiting adds another 100 pending requests holding sockets and memory.",
        ar: "العمل الجاري يساوي معدّل الوصول مضروباً في مدة كل وحدة عمل: 100 في الثانية × 4 ثوانٍ = 400 استدعاء متزامن. لهذا فإن الـ latency والسعة مشكلة واحدة — كل ثانية انتظار إضافية تضيف 100 طلب معلّق يحجز sockets وذاكرة."
      }
    },
    {
      q: {
        en: "A dependency answers every call successfully but has become five times slower. What does a circuit breaker do?",
        ar: "dependency ترد على كل الاستدعاءات بنجاح لكنها أصبحت أبطأ بخمس مرات. ماذا يفعل الـ circuit breaker؟"
      },
      options: [
        { en: "It opens, because the latency threshold was crossed", ar: "يفتح لأن عتبة الـ latency تم تجاوزها" },
        { en: "It goes half-open and samples the slow calls", ar: "ينتقل إلى half-open ويأخذ عيّنة من الاستدعاءات البطيئة" },
        { en: "Nothing, unless the extra latency pushes calls past their timeout", ar: "لا شيء، إلا إذا دفع البطء الزائد الاستدعاءات لتجاوز مهلتها" },
        { en: "It rejects calls once concurrency passes its limit", ar: "يرفض الاستدعاءات عندما يتجاوز التزامن حدّه" }
      ],
      correct: 2,
      why: {
        en: "A breaker counts outcomes, not durations. Successful-but-slow calls are successes, so it stays closed. The timeout is what converts \"too slow\" into a failure the breaker can count — which is why the two are configured together, and why a concurrency limit (bulkhead) is the tool for capping in-flight work directly.",
        ar: "الـ breaker يعدّ النتائج لا المدد. فالاستدعاءات الناجحة وإن كانت بطيئة تُحسب نجاحاً، ويبقى مغلقاً. والـ timeout هو ما يحوّل «بطيء جداً» إلى فشل يستطيع الـ breaker عدّه — ولهذا يُضبطان معاً، ولهذا يكون حد التزامن أي الـ bulkhead هو الأداة المناسبة لتحديد العمل الجاري مباشرة."
      }
    }
  ]
};
```

NEXT: cap
