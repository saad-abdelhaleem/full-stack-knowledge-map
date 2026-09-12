```js
const tracingLesson = {
  id: "tracing",
  moduleId: "observability",
  title: { en: "Distributed tracing", ar: "التتبّع الموزّع" },
  summary: {
    en: "Follow one request across every service it touches, so you can see exactly where the time went and which hop actually failed.",
    ar: "تتبّع طلباً واحداً عبر كل service يمرّ بها، لترى بالضبط أين ذهب الوقت وأي hop هو الذي فشل فعلاً."
  },
  mins: 17,
  sections: [
    {
      key: "why",
      blocks: [
        { t: "p", en: "Distributed tracing records the full path of one request as it moves through many services, and shows how long each step took. It answers the question logs and metrics cannot: for this one slow request, which service was the problem?", ar: "التتبّع الموزّع يسجّل المسار الكامل لطلب واحد وهو يتنقّل عبر عدّة services، ويُظهر كم استغرقت كل خطوة. يجيب على السؤال الذي لا تجيب عنه الـ logs ولا الـ metrics: هذا الطلب البطيء تحديداً، أي service كانت هي المشكلة؟" },
        { t: "kv", rows: [
          { k: { en: "Trace", ar: "Trace" }, v: { en: "The whole journey of one request across all services, as a single connected record.", ar: "الرحلة الكاملة لطلب واحد عبر كل الـ services، كسجلّ واحد مترابط." } },
          { k: { en: "Span", ar: "Span" }, v: { en: "One step inside that journey — one operation, with a start time and a duration. A trace is a tree of spans.", ar: "خطوة واحدة داخل تلك الرحلة — عملية واحدة، لها وقت بداية ومدّة. الـ trace شجرة من الـ spans." } },
          { k: { en: "Trace context", ar: "Trace context" }, v: { en: "A small set of IDs passed from service to service so their spans join the same trace.", ar: "مجموعة صغيرة من المعرّفات تُمرّر من service إلى أخرى حتى تنضمّ spans كلٌّ منها إلى نفس الـ trace." } },
          { k: { en: "traceparent", ar: "traceparent" }, v: { en: "The standard HTTP header (W3C spec) that carries the trace ID and parent span ID between services.", ar: "الـ header القياسي (مواصفة W3C) الذي يحمل الـ trace ID ومعرّف الـ parent span بين الـ services." } },
          { k: { en: "Instrumentation", ar: "Instrumentation" }, v: { en: "The code that starts and stops spans and reads/writes the context. Often added automatically by a library.", ar: "الكود الذي يبدأ الـ spans ويوقفها ويقرأ/يكتب الـ context. غالباً تضيفه مكتبة تلقائياً." } },
          { k: { en: "OpenTelemetry", ar: "OpenTelemetry" }, v: { en: "The vendor-neutral standard and SDK for producing traces, metrics and logs. OTel for short.", ar: "المعيار والـ SDK المحايد تجاه المزوّدين لإنتاج الـ traces والـ metrics والـ logs. اختصاراً OTel." } }
        ]},
        { t: "p", en: "Think of an order shipped through several warehouses. Each warehouse stamps the package with the time it arrived and left, and keeps the same tracking number. At the end you can see the package sat three hours in warehouse two. A trace is that tracking number, and each span is one warehouse's stamp.", ar: "تخيّل طرداً يُشحن عبر عدّة مستودعات. كل مستودع يختم على الطرد وقت وصوله ومغادرته، ويحتفظ بنفس رقم التتبّع. في النهاية ترى أن الطرد بقي ثلاث ساعات في المستودع الثاني. الـ trace هو رقم التتبّع ذاك، وكل span هو ختم مستودع واحد." },
        { t: "p", en: "The reason this exists: in a system of many services, a single slow request leaves a little log line in each service, but nothing connects them. You know something was slow; you cannot see the shape. Tracing threads one ID through the whole path so the pieces line up as one story.", ar: "سبب وجود هذا: في نظام من عدّة services، الطلب البطيء الواحد يترك سطر log صغيراً في كل service، لكن لا شيء يربط بينها. تعرف أن شيئاً كان بطيئاً؛ لكنك لا ترى الشكل. التتبّع يمرّر معرّفاً واحداً عبر المسار كله فتصطفّ القطع كقصّة واحدة." },
        { t: "callout", kind: "note", en: "Metrics tell you 'p99 latency rose'. Traces tell you 'and it rose because the inventory call, not the database, got slow'. You usually need both.", ar: "الـ metrics تقول لك «ارتفع p99 latency». الـ traces تقول لك «وارتفع بسبب نداء الـ inventory، لا الـ database». عادةً تحتاج الاثنين معاً." }
      ]
    },
    {
      key: "problem",
      blocks: [
        { t: "p", en: "Take a real endpoint: GET /orders/123. The gateway calls the orders service, which runs one database query, then calls the payment service and the inventory service. Five processes touch this one request. Users report the page is slow, but only sometimes.", ar: "خذ endpoint حقيقياً: GET /orders/123. الـ gateway ينادي الـ orders service، الذي ينفّذ استعلام database واحداً، ثم ينادي الـ payment service والـ inventory service. خمس عمليات تلمس هذا الطلب الواحد. المستخدمون يبلّغون أن الصفحة بطيئة، لكن أحياناً فقط." },
        { t: "p", en: "Without tracing you open five log files and try to match timestamps by eye. But each service handles thousands of requests, so which log line belongs to this user's slow request? You cannot tell. The average latency dashboard says 200 ms, which is fine, so the slow tail stays invisible.", ar: "بدون تتبّع تفتح خمسة ملفات log وتحاول مطابقة الـ timestamps بعينك. لكن كل service يعالج آلاف الطلبات، فأي سطر log يخصّ طلب هذا المستخدم البطيء؟ لا تستطيع أن تعرف. لوحة متوسّط الـ latency تقول 200 ms، وهذا جيّد، فيبقى الذيل البطيء غير مرئي." },
        { t: "kv", rows: [
          { k: { en: "Before tracing", ar: "قبل التتبّع" }, v: { en: "'A request was slow somewhere.' Hours of grepping logs and guessing which service to blame.", ar: "«طلب ما كان بطيئاً في مكان ما.» ساعات من البحث في الـ logs والتخمين عن أي service نلوم." } },
          { k: { en: "After tracing", ar: "بعد التتبّع" }, v: { en: "One trace shows: gateway 5 ms, orders 10 ms, DB 12 ms, payment 30 ms, inventory 1,900 ms. The inventory call is the whole problem.", ar: "trace واحد يُظهر: gateway 5 ms، orders 10 ms، DB 12 ms، payment 30 ms، inventory 1,900 ms. نداء الـ inventory هو المشكلة كلها." } },
          { k: { en: "Time saved", ar: "الوقت الموفّر" }, v: { en: "From a multi-hour investigation to a 30-second read of one trace waterfall.", ar: "من تحقيق يمتدّ ساعات إلى قراءة 30 ثانية لشلّال trace واحد." } }
        ]}
      ]
    },
    {
      key: "internals",
      blocks: [
        { t: "p", en: "A trace is built from IDs and time. When a request first arrives, if it carries no trace context, the entry service generates a new trace ID — a random 16-byte number that will stay the same for every span in this request. It then opens the root span, records the start time, and does its work.", ar: "الـ trace يُبنى من معرّفات ووقت. عندما يصل الطلب أول مرّة، إن لم يكن يحمل trace context، يولّد service الدخول trace ID جديداً — رقماً عشوائياً من 16 بايت يبقى ثابتاً لكل span في هذا الطلب. ثم يفتح الـ root span، ويسجّل وقت البداية، ويؤدّي عمله." },
        { t: "p", en: "Each span also gets its own span ID (8 random bytes) and remembers its parent span's ID. That parent link is what turns a flat list of spans into a tree: the DB span's parent is the orders span, whose parent is the gateway span. When a service calls another over HTTP, it writes the current trace ID and span ID into the traceparent header. The next service reads that header, so its new span points back to the caller's span.", ar: "كل span يحصل أيضاً على span ID خاص به (8 بايت عشوائية) ويتذكّر معرّف الـ parent span الخاص به. رابط الـ parent هذا هو ما يحوّل قائمة مسطّحة من الـ spans إلى شجرة: parent الـ DB span هو الـ orders span، الذي parentه هو الـ gateway span. عندما ينادي service آخر عبر HTTP، يكتب الـ trace ID والـ span ID الحاليين في header الـ traceparent. الـ service التالي يقرأ ذلك الـ header، فيشير spanه الجديد إلى span المُنادي." },
        { t: "code", lang: "text", label: { en: "The traceparent header, field by field", ar: "header الـ traceparent، حقلاً حقلاً" }, code: "traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01\n            \\/  \\____________ trace id ____________/  \\__ span id __/  \\/\n          version         same for whole request       the parent      flags\n                                                        (caller's span) (01 = sampled)" },
        { t: "p", en: "The flags byte carries the sampled decision: 01 means 'keep this trace', 00 means 'drop it'. The decision is made once at the start and copied along the whole path, so either every service records this trace or none does. That is why sampling must be decided at the edge, not per service.", ar: "بايت الـ flags يحمل قرار الـ sampled: 01 يعني «احتفظ بهذا الـ trace»، 00 يعني «أسقطه». يُتَّخذ القرار مرّة واحدة في البداية ويُنسخ على طول المسار، فإمّا أن تسجّل كل service هذا الـ trace أو لا تسجّله أيّ منها. لهذا يجب أن يُتّخذ قرار الـ sampling عند الحافّة، لا في كل service." },
        { t: "kv", rows: [
          { k: { en: "SDK", ar: "SDK" }, v: { en: "In your process, starts/stops spans and reads/writes the header. In .NET, an ActivitySource creates spans (called Activity).", ar: "داخل عمليتك، يبدأ/يوقف الـ spans ويقرأ/يكتب الـ header. في .NET، الـ ActivitySource ينشئ spans (تُسمّى Activity)." } },
          { k: { en: "Exporter", ar: "Exporter" }, v: { en: "Sends finished spans out of the process, usually to a collector, in batches.", ar: "يرسل الـ spans المنتهية خارج العملية، عادةً إلى collector، على دفعات." } },
          { k: { en: "Collector", ar: "Collector" }, v: { en: "A separate service that receives spans from everywhere and forwards them to a backend (Jaeger, Tempo, a vendor).", ar: "service منفصلة تستقبل الـ spans من كل مكان وتمرّرها إلى backend (Jaeger، Tempo، أو مزوّد)." } },
          { k: { en: "Backend / UI", ar: "Backend / UI" }, v: { en: "Stores traces and draws the waterfall you actually look at.", ar: "يخزّن الـ traces ويرسم الشلّال الذي تنظر إليه فعلاً." } }
        ]},
        { t: "p", en: "The everyday analogy again: the SDK is each warehouse's clock and stamp, traceparent is the shared tracking number printed on the label, and the collector is the central office that gathers every stamp and reassembles the package's journey on one screen.", ar: "نعود للتشبيه اليومي: الـ SDK هو ساعة كل مستودع وختمه، الـ traceparent هو رقم التتبّع المشترك المطبوع على الملصق، والـ collector هو المكتب المركزي الذي يجمع كل ختم ويعيد تجميع رحلة الطرد على شاشة واحدة." },
        { t: "code", lang: "csharp", label: { en: "Wiring OpenTelemetry in ASP.NET Core, then a manual span", ar: "توصيل OpenTelemetry في ASP.NET Core، ثم span يدوي" }, code: "// Auto-instruments incoming requests + outgoing HttpClient calls,\n// so traceparent is read and written for you.\nbuilder.Services.AddOpenTelemetry()\n    .WithTracing(t => t\n        .AddAspNetCoreInstrumentation()\n        .AddHttpClientInstrumentation()\n        .AddSource(\"Orders\")            // your own spans\n        .AddOtlpExporter());            // ship to the collector\n\n// A manual span around work the library does not see:\nprivate static readonly ActivitySource Source = new(\"Orders\");\n\nusing var span = Source.StartActivity(\"reserve-inventory\");\nspan?.SetTag(\"order.id\", orderId);\nawait _inventory.ReserveAsync(orderId);   // if this throws, the span records the error" }
      ]
    },
    {
      key: "tradeoffs",
      blocks: [
        { t: "tradeoff",
          pros: { en: [
            "Turns a multi-service mystery into one readable waterfall.",
            "Shows the causal tree, not just totals — you see which call waited on which.",
            "Auto-instrumentation covers HTTP, DB and queues with almost no code.",
            "The same trace ID can be attached to logs, tying the three signals together."
          ], ar: [
            "يحوّل لغزاً موزّعاً على services إلى شلّال واحد قابل للقراءة.",
            "يُظهر شجرة السببية، لا المجاميع فقط — ترى أي نداء انتظر أيّها.",
            "الـ auto-instrumentation يغطّي HTTP والـ DB والـ queues بلا كود تقريباً.",
            "يمكن إرفاق نفس الـ trace ID بالـ logs فتربط الإشارات الثلاث."
          ]},
          cons: { en: [
            "Every span is data to move and store; full tracing at scale is expensive.",
            "A broken context handoff silently splits one trace into two.",
            "Custom spans and tags are ongoing work to keep useful.",
            "Sensitive values can leak into tags if you are not careful."
          ], ar: [
            "كل span بيانات تُنقل وتُخزَّن؛ التتبّع الكامل على نطاق واسع مكلف.",
            "تسليم context معطوب يقسم trace واحداً إلى اثنين بصمت.",
            "الـ spans والـ tags المخصّصة عمل مستمر لإبقائها مفيدة.",
            "قد تتسرّب قيم حسّاسة إلى الـ tags إن لم تنتبه."
          ]},
          limits: { en: [
            "A trace shows where time went, not always why — you still read code.",
            "Sampling means the exact slow request you want may not be kept.",
            "Only shows what is instrumented; a black-box call is one opaque span."
          ], ar: [
            "الـ trace يُظهر أين ذهب الوقت، لا دائماً لماذا — تبقى تقرأ الكود.",
            "الـ sampling يعني أن الطلب البطيء الذي تريده قد لا يكون محفوظاً.",
            "يُظهر فقط ما جرى instrument له؛ نداء صندوق أسود span واحد غامض."
          ]},
          alts: { en: [
            "Structured logs with a correlation ID — cheaper, but you rebuild the timeline by hand.",
            "Metrics — great for trends and alerts, blind to a single request's path.",
            "Profilers — deep inside one process, but stop at the process boundary."
          ], ar: [
            "logs منظّمة مع correlation ID — أرخص، لكنك تعيد بناء الخط الزمني يدوياً.",
            "Metrics — ممتازة للاتجاهات والتنبيهات، عمياء عن مسار الطلب الواحد.",
            "Profilers — عميقة داخل عملية واحدة، لكنها تقف عند حدّ العملية."
          ]}
        }
      ]
    },
    {
      key: "mistakes",
      blocks: [
        { t: "mistake", title: { en: "Using a raw HttpClient that drops the header", ar: "استخدام HttpClient خام يُسقط الـ header" }, body: { en: "A team called a downstream service with a manually built HttpMessageHandler that did not propagate traceparent. Every downstream span started a brand-new trace, so traces stopped at the service boundary and looked artificially fast. The fix is to use the HttpClient from IHttpClientFactory, which the OTel instrumentation hooks into.", ar: "فريق نادى service خلفية عبر HttpMessageHandler مبني يدوياً لم يمرّر traceparent. كل span خلفي بدأ trace جديداً تماماً، فتوقّفت الـ traces عند حدّ الـ service وبدت سريعة زيفاً. الحلّ استخدام HttpClient من IHttpClientFactory الذي يتشابك معه instrumentation الـ OTel." }, fix: "// bad: new HttpClient(new SocketsHttpHandler())  -> no propagation\nservices.AddHttpClient(\"inventory\");   // instrumented; header flows" },
        { t: "mistake", title: { en: "Sampling at 1% then wondering where the slow trace went", ar: "sampling بنسبة 1% ثم التساؤل أين ذهب الـ trace البطيء" }, body: { en: "With head-based sampling keeping 1 in 100 traces, the specific 8-second request a user complained about was almost never among the kept traces. They searched for a trace ID that had been dropped at the edge. Tail-based sampling (decide after the trace finishes, keep all errors and slow ones) or a higher rate for errors solves this.", ar: "مع head-based sampling يحتفظ بـ 1 من كل 100 trace، الطلب المحدّد ذو الـ 8 ثوانٍ الذي اشتكى منه مستخدم لم يكن غالباً بين الـ traces المحفوظة. بحثوا عن trace ID أُسقط عند الحافّة. الـ tail-based sampling (يقرّر بعد انتهاء الـ trace، ويحتفظ بكل الأخطاء والبطيء) أو معدّل أعلى للأخطاء يحلّ هذا." } },
        { t: "mistake", title: { en: "Context lost across a background queue", ar: "ضياع الـ context عبر queue خلفية" }, body: { en: "A request published a message to a queue and returned. The consumer processed it later but started its own trace, so the work triggered by the request looked disconnected. Trace context is not carried by queues automatically — you must copy traceparent into the message headers on publish and restore it on consume.", ar: "طلب نشر رسالة إلى queue وعاد. الـ consumer عالجها لاحقاً لكنه بدأ trace خاصاً به، فبدا العمل الذي أطلقه الطلب منفصلاً. الـ trace context لا تحمله الـ queues تلقائياً — يجب نسخ traceparent إلى headers الرسالة عند النشر واستعادته عند الاستهلاك." }, fix: "// publish: props.Headers[\"traceparent\"] = Activity.Current?.Id;\n// consume: var ctx = Propagators.DefaultTextMapPropagator.Extract(...);" },
        { t: "mistake", title: { en: "Putting high-cardinality or secret data in tags", ar: "وضع بيانات عالية التنوّع أو سرّية في الـ tags" }, body: { en: "Someone added the full request body and a session token as span tags. The token leaked into the tracing backend where anyone with access could read it, and the unique bodies made storage explode and search slow. Tags should be low-cardinality and non-secret: order.id is fine, the auth header is not.", ar: "شخص أضاف جسم الطلب الكامل وsession token كـ span tags. تسرّب الـ token إلى backend التتبّع حيث يقرأه أي شخص لديه صلاحية، والأجسام الفريدة فجّرت التخزين وأبطأت البحث. الـ tags يجب أن تكون منخفضة التنوّع وغير سرّية: order.id مقبول، header الـ auth لا." } }
      ]
    },
    {
      key: "interview",
      blocks: [
        { t: "qa", level: "junior", q: { en: "What is the difference between a trace and a span?", ar: "ما الفرق بين الـ trace والـ span؟" }, a: { en: "A span is one operation with a start and a duration — like the database query, or one outgoing HTTP call. A trace is the whole request: all its spans linked together into a tree by parent IDs. One trace, many spans.", ar: "الـ span عملية واحدة لها بداية ومدّة — مثل استعلام الـ database، أو نداء HTTP صادر واحد. الـ trace هو الطلب كله: كل spansه مربوطة معاً في شجرة عبر معرّفات الـ parent. trace واحد، spans كثيرة." } },
        { t: "qa", level: "mid", q: { en: "How does one service's span end up in the same trace as another's?", ar: "كيف ينتهي span خدمة إلى نفس trace خدمة أخرى؟" }, a: { en: "The caller puts the trace ID and its current span ID into the traceparent HTTP header. The callee reads that header, reuses the same trace ID, and sets its new span's parent to the caller's span. So the tree stays connected across the network. Break that header and you get two separate traces.", ar: "المُنادي يضع الـ trace ID وspan IDه الحالي في header الـ traceparent. المُنادَى يقرأ الـ header، يعيد استخدام نفس الـ trace ID، ويجعل parent spanه الجديد هو span المُنادي. فتبقى الشجرة متّصلة عبر الشبكة. اكسر ذلك الـ header وستحصل على traceين منفصلين." } },
        { t: "qa", level: "mid", q: { en: "Metrics already show latency. Why also trace?", ar: "الـ metrics تُظهر الـ latency أصلاً. لماذا نتتبّع أيضاً؟" }, a: { en: "Metrics tell you the p99 for a whole endpoint went up, but not which downstream call caused it. A trace of one slow request shows the exact hop that was slow, in order. Metrics find the fire, tracing points at the room it started in.", ar: "الـ metrics تخبرك أن p99 لكامل الـ endpoint ارتفع، لكن ليس أي نداء خلفي سبّبه. trace لطلب بطيء واحد يُظهر الـ hop البطيء بالضبط، بالترتيب. الـ metrics تجد الحريق، والتتبّع يشير إلى الغرفة التي بدأ فيها." } },
        { t: "qa", level: "senior", q: { en: "How would you keep tracing affordable at high traffic?", ar: "كيف تُبقي التتبّع مقبول التكلفة عند حركة عالية؟" }, a: { en: "Sample. Head-based keeps a fixed fraction cheaply but may miss the rare slow request. Tail-based buffers a trace until it finishes, then keeps all errors and slow ones and a small share of the rest — more useful, more infrastructure. I'd start head-based, add tail-based for errors and high latency once volume hurts.", ar: "استخدم sampling. الـ head-based يحتفظ بنسبة ثابتة بثمن زهيد لكنه قد يفوّت الطلب البطيء النادر. الـ tail-based يخزّن الـ trace مؤقتاً حتى ينتهي، ثم يحتفظ بكل الأخطاء والبطيء وحصّة صغيرة من الباقي — أنفع، وبنية تحتية أكثر. أبدأ head-based، وأضيف tail-based للأخطاء والـ latency العالي حين تؤلم الأحجام." } },
        { t: "qa", level: "senior", q: { en: "A trace shows a 400 ms gap between two spans with nothing in it. What does that mean?", ar: "trace يُظهر فجوة 400 ms بين spanين لا شيء بينها. ماذا يعني ذلك؟" }, a: { en: "Time was spent in code that is not instrumented, or the thread was waiting. Common causes: serialization, a lock, thread-pool starvation, or GC. I'd add a manual span around the suspicious block, or check runtime metrics for that window. The gap is real time; it just has no span yet.", ar: "قُضي الوقت في كود غير مُجرى له instrument، أو كان الـ thread ينتظر. أسباب شائعة: serialization، قفل، thread-pool starvation، أو GC. أضيف span يدوياً حول الكتلة المشبوهة، أو أفحص metrics الـ runtime لتلك النافذة. الفجوة وقت حقيقي؛ لكن لا span لها بعد." } },
        { t: "qa", level: "staff", q: { en: "How do you make tracing consistently useful across many teams?", ar: "كيف تجعل التتبّع مفيداً باستمرار عبر فرق كثيرة؟" }, a: { en: "Standardize the plumbing so it is not each team's decision. Ship a shared library or base image that turns on OTel, enforces W3C context propagation, and sets a common naming and tag convention. Run one central collector with a sampling policy. Then teams get connected traces for free, and a request crossing team boundaries still forms one trace instead of breaking at every handoff.", ar: "وحّد السباكة كي لا تكون قرار كل فريق. اشحن مكتبة مشتركة أو base image تُشغّل OTel، تفرض W3C context propagation، وتضبط تسمية و tags موحّدة. شغّل collector مركزياً واحداً بسياسة sampling. عندها تحصل الفرق على traces متّصلة مجاناً، ويبقى الطلب العابر لحدود الفرق trace واحداً بدل أن ينكسر عند كل تسليم." } }
      ]
    },
    {
      key: "codereview",
      blocks: [
        { t: "review", severity: "high",
          title: { en: "Manually creating HttpClient breaks propagation", ar: "إنشاء HttpClient يدوياً يكسر الـ propagation" },
          bad: "public class InventoryClient {\n    private readonly HttpClient _http = new HttpClient();\n    public Task ReserveAsync(int id) =>\n        _http.PostAsync($\"http://inventory/reserve/{id}\", null);\n}",
          good: "public class InventoryClient {\n    private readonly HttpClient _http;\n    public InventoryClient(HttpClient http) => _http = http;   // from IHttpClientFactory\n    public Task ReserveAsync(int id) =>\n        _http.PostAsync($\"reserve/{id}\", null);\n}\n// Program.cs: services.AddHttpClient<InventoryClient>(c =>\n//     c.BaseAddress = new Uri(\"http://inventory/\"));",
          why: { en: "A new HttpClient() is not wired into the OpenTelemetry instrumentation, so it never writes the traceparent header. The inventory service then starts a fresh trace, and the caller's trace ends at the boundary. Injecting a client from IHttpClientFactory restores propagation and reuses connections.", ar: "الـ new HttpClient() غير موصول بـ instrumentation الـ OpenTelemetry، فلا يكتب أبداً header الـ traceparent. عندها يبدأ الـ inventory service trace جديداً، وينتهي trace المُنادي عند الحدّ. حقن client من IHttpClientFactory يستعيد الـ propagation ويعيد استخدام الاتصالات." }
        },
        { t: "review", severity: "medium",
          title: { en: "Span name includes the ID, exploding cardinality", ar: "اسم الـ span يتضمّن الـ ID فينفجر الـ cardinality" },
          bad: "using var span = Source.StartActivity($\"GET /orders/{orderId}\");",
          good: "using var span = Source.StartActivity(\"GET /orders/{id}\");\nspan?.SetTag(\"order.id\", orderId);",
          why: { en: "Putting the concrete id in the span name creates a distinct operation name per request, so the backend cannot group or aggregate them and its index bloats. The name should be the route template; the specific value belongs in a tag, which backends handle as attached data, not as an operation identity.", ar: "وضع الـ id الفعلي في اسم الـ span يُنشئ اسم عملية مختلفاً لكل طلب، فلا يستطيع الـ backend تجميعها ويتضخّم فهرسه. الاسم يجب أن يكون قالب المسار؛ والقيمة المحدّدة مكانها tag، الذي يعامله الـ backend كبيانات مرفقة لا كهويّة عملية." }
        }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        { t: "p", en: "Tracing sits at every boundary where a request crosses a process: the gateway, each service-to-service HTTP or gRPC call, database drivers, and message queues. The collector runs as a separate process (often one per host or a small cluster) so that shipping spans never blocks the request path — the app hands spans to the exporter in batches and moves on.", ar: "التتبّع يقع عند كل حدّ يعبر فيه الطلب عملية: الـ gateway، كل نداء HTTP أو gRPC من service إلى أخرى، drivers الـ database، والـ message queues. الـ collector يعمل كعملية منفصلة (غالباً واحد لكل host أو عنقود صغير) كي لا يعيق شحن الـ spans مسار الطلب أبداً — التطبيق يسلّم الـ spans إلى الـ exporter على دفعات ويمضي." },
        { t: "ul", en: [
          "Decide the sampling policy at the edge gateway so the whole trace agrees.",
          "Propagate W3C traceparent everywhere; also carry it through queues by hand.",
          "Attach the trace ID to every log line so a log jumps you to its trace.",
          "Keep the collector independent of app deploys so tracing survives a bad release."
        ], ar: [
          "قرّر سياسة الـ sampling عند gateway الحافّة كي يتّفق الـ trace كله.",
          "مرّر W3C traceparent في كل مكان؛ واحمله عبر الـ queues يدوياً أيضاً.",
          "أرفق الـ trace ID بكل سطر log كي ينقلك log إلى traceه.",
          "أبقِ الـ collector مستقلاً عن نشر التطبيق كي ينجو التتبّع من إصدار سيّئ."
        ]},
        { t: "callout", kind: "tip", en: "Log the trace ID at the entry point. When an on-call engineer has only an error log line, that ID is the fastest jump straight to the failing trace.", ar: "سجّل الـ trace ID عند نقطة الدخول. حين لا يملك مهندس المناوبة إلا سطر log خطأ، ذلك الـ ID أسرع قفزة مباشرة إلى الـ trace الفاشل." }
      ]
    },
    {
      key: "perf",
      blocks: [
        { t: "kv", rows: [
          { k: { en: "Network", ar: "Network" }, v: { en: "Spans are shipped out of process; batching and compression keep this small, but full sampling at high RPS is real bandwidth.", ar: "الـ spans تُشحن خارج العملية؛ الـ batching والضغط يُبقيانها صغيرة، لكن الـ sampling الكامل عند RPS عالٍ عرض حزمة حقيقي." } },
          { k: { en: "CPU", ar: "CPU" }, v: { en: "Starting a span and setting tags is cheap (a few microseconds), but thousands per request add up — do not span trivial loops.", ar: "بدء span وضبط الـ tags رخيص (بضع ميكروثوانٍ)، لكن آلافاً لكل طلب تتراكم — لا تضع span لحلقات تافهة." } },
          { k: { en: "Memory", ar: "Memory" }, v: { en: "Unexported spans buffer in memory; a slow or down collector makes the buffer grow, so bound the queue and drop on overflow.", ar: "الـ spans غير المُصدَّرة تتجمّع في الذاكرة؛ collector بطيء أو معطّل يُنمّي المخزن، فحدّد سعة الـ queue وأسقط عند الفيض." } },
          { k: { en: "Storage", ar: "Storage" }, v: { en: "Trace backends store every kept span; cost scales with volume × retention, which is why sampling and short retention matter.", ar: "backends الـ trace تخزّن كل span محفوظ؛ التكلفة تتناسب مع الحجم × مدّة الاحتفاظ، لهذا يهمّ الـ sampling والاحتفاظ القصير." } },
          { k: { en: "Latency", ar: "Latency" }, v: { en: "Done right, tracing adds well under 1 ms per request; done wrong (synchronous export) it can add the collector's round-trip to every call.", ar: "بشكل صحيح، يضيف التتبّع أقل بكثير من 1 ms لكل طلب؛ بشكل خاطئ (export متزامن) قد يضيف رحلة الـ collector لكل نداء." } }
        ]}
      ]
    },
    {
      key: "debug",
      blocks: [
        { t: "ul", en: [
          "Trace UI waterfall (Jaeger/Tempo/vendor) — read top-down; the widest bar that is not just waiting on a child is your bottleneck.",
          "curl -v to a service and inspect the response — check a traceparent header is present and its flags byte to confirm propagation and sampling.",
          "The collector's own logs/metrics — look for dropped or refused spans, which means you are over budget or the pipeline is down.",
          "Search logs by trace ID — pull every log line for one request across all services when the trace alone is not enough.",
          "dotnet-trace or the Activity diagnostic events — confirm spans are actually being created in-process before blaming the exporter."
        ], ar: [
          "شلّال واجهة الـ trace (Jaeger/Tempo/مزوّد) — اقرأ من الأعلى للأسفل؛ أعرض شريط لا ينتظر فقط على ابنه هو عنق الزجاجة.",
          "curl -v إلى service وافحص الاستجابة — تحقّق من وجود header الـ traceparent وبايت flagsه لتأكيد الـ propagation والـ sampling.",
          "logs/metrics الـ collector نفسه — ابحث عن spans مُسقطة أو مرفوضة، ما يعني تجاوز الميزانية أو تعطّل خطّ الأنابيب.",
          "ابحث في الـ logs بالـ trace ID — اسحب كل سطر log لطلب واحد عبر كل الـ services حين لا يكفي الـ trace وحده.",
          "dotnet-trace أو أحداث تشخيص الـ Activity — أكّد أن الـ spans تُنشأ فعلاً داخل العملية قبل لوم الـ exporter."
        ]},
        { t: "callout", kind: "tip", en: "When a trace looks too short and ends abruptly at a service boundary, suspect a dropped traceparent first — a broken handoff, not a fast service, is the usual cause.", ar: "حين يبدو trace قصيراً جداً وينتهي فجأة عند حدّ service، اشتبه بـ traceparent مُسقط أولاً — تسليم مكسور، لا service سريعة، هو السبب المعتاد." }
      ]
    },
    {
      key: "realworld",
      blocks: [
        { t: "p", en: "Distributed tracing earns its keep anywhere one user action fans out across many services and a slow tail hurts. The payoff is turning 'it's slow sometimes' into a named hop you can fix.", ar: "التتبّع الموزّع يثبت جدواه حيثما تتفرّع حركة مستخدم واحدة عبر services كثيرة ويؤذي ذيل بطيء. المكسب تحويل «إنها بطيئة أحياناً» إلى hop مُسمّى تستطيع إصلاحه." },
        { t: "ul", en: [
          "E-commerce checkout — one order touches cart, pricing, payment and inventory; tracing shows which one stalls under load.",
          "Streaming and media — a play request crosses auth, entitlement and CDN services; a trace finds the slow gate.",
          "Banking and payments — a transfer spans several internal systems; a trace is the audit-friendly record of where time and failures happened.",
          "SaaS platforms with plugins — a tenant's request runs through shared and per-tenant services; tracing isolates which tenant or plugin is slow."
        ], ar: [
          "التجارة الإلكترونية — طلب واحد يلمس cart وpricing وpayment وinventory؛ التتبّع يُظهر أيّها يتعثّر تحت الحمل.",
          "البثّ والوسائط — طلب تشغيل يعبر auth وentitlement وCDN؛ trace يجد البوّابة البطيئة.",
          "البنوك والمدفوعات — تحويل يمتدّ عبر عدّة أنظمة داخلية؛ الـ trace سجلّ صديق للتدقيق لأين ذهب الوقت والأعطال.",
          "منصّات SaaS بالـ plugins — طلب مستأجر يمرّ عبر services مشتركة وأخرى لكل مستأجر؛ التتبّع يعزل أي مستأجر أو plugin بطيء."
        ]}
      ]
    },
    {
      key: "exercises",
      blocks: [
        { t: "ex", diff: "easy", en: "Add OpenTelemetry tracing to a single ASP.NET Core service with AddAspNetCoreInstrumentation and a console exporter. Make one request and confirm you see a root span with the request's method and route in the console output.", ar: "أضف تتبّع OpenTelemetry إلى ASP.NET Core service واحدة عبر AddAspNetCoreInstrumentation وexporter للـ console. أرسل طلباً واحداً وأكّد أنك ترى root span فيه method الطلب ومساره في مخرجات الـ console." },
        { t: "ex", diff: "medium", en: "Wire two services where A calls B over HttpClient. Verify from B's spans that they share A's trace ID. Then deliberately replace the injected client with new HttpClient() and confirm the trace splits into two — proving where propagation lives.", ar: "وصّل serviceين حيث A ينادي B عبر HttpClient. تحقّق من spans الـ B أنها تشارك trace ID الخاص بـ A. ثم استبدل عمداً الـ client المحقون بـ new HttpClient() وأكّد أن الـ trace ينقسم إلى اثنين — لتُثبت أين يعيش الـ propagation." },
        { t: "ex", diff: "hard", en: "Propagate trace context across a message queue: on publish, copy traceparent into the message headers; on consume, extract it and start the consumer span as a child. Show one trace that spans the producer, the queue wait, and the consumer.", ar: "مرّر الـ trace context عبر message queue: عند النشر، انسخ traceparent إلى headers الرسالة؛ عند الاستهلاك، استخرجه وابدأ span الـ consumer كابن. أظهر trace واحداً يمتدّ عبر المنتج، وانتظار الـ queue، والمستهلك." },
        { t: "ex", diff: "senior", en: "Design a sampling strategy for a service at 10,000 requests/second on a fixed tracing budget. Specify head vs tail sampling, the target keep rate, how errors and slow requests are always kept, and how you would validate the specific slow requests you care about actually survive.", ar: "صمّم استراتيجية sampling لـ service عند 10,000 طلب/ثانية بميزانية تتبّع ثابتة. حدّد head مقابل tail sampling، معدّل الاحتفاظ المستهدف، كيف تُحفظ الأخطاء والطلبات البطيئة دائماً، وكيف تتحقّق أن الطلبات البطيئة التي تهمّك تنجو فعلاً." }
      ]
    },
    {
      key: "refs",
      blocks: [
        { t: "ref", label: { en: "W3C Trace Context specification", ar: "مواصفة W3C Trace Context" }, url: "https://www.w3.org/TR/trace-context/", meta: { en: "Spec", ar: "مواصفة" } },
        { t: "ref", label: { en: "OpenTelemetry .NET documentation", ar: "توثيق OpenTelemetry .NET" }, url: "https://opentelemetry.io/docs/languages/net/", meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref", label: { en: ".NET distributed tracing concepts", ar: "مفاهيم التتبّع الموزّع في .NET" }, url: "https://learn.microsoft.com/en-us/dotnet/core/diagnostics/distributed-tracing", meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref", label: { en: "OpenTelemetry sampling guide", ar: "دليل الـ sampling في OpenTelemetry" }, url: "https://opentelemetry.io/docs/concepts/sampling/", meta: { en: "Docs", ar: "توثيق" } }
      ]
    }
  ],
  quiz: [
    {
      q: { en: "What connects the spans from different services into one trace?", ar: "ما الذي يربط spans خدمات مختلفة في trace واحد؟" },
      options: [
        { en: "They share the same server timestamp", ar: "تشارك نفس timestamp الخادم" },
        { en: "A shared trace ID propagated in the traceparent header", ar: "trace ID مشترك يُمرَّر في header الـ traceparent" },
        { en: "They are stored in the same database table", ar: "تُخزَّن في نفس جدول الـ database" },
        { en: "The load balancer merges them by client IP", ar: "الـ load balancer يدمجها حسب IP العميل" }
      ],
      correct: 1,
      why: { en: "The caller writes the trace ID and its span ID into traceparent; the callee reuses that trace ID and links its span to the caller's, keeping the tree connected across processes.", ar: "المُنادي يكتب الـ trace ID وspan IDه في traceparent؛ المُنادَى يعيد استخدام ذلك الـ trace ID ويربط spanه بالمُنادي، فتبقى الشجرة متّصلة عبر العمليات." }
    },
    {
      q: { en: "A trace ends abruptly at a service boundary and downstream work is missing. Most likely cause?", ar: "trace ينتهي فجأة عند حدّ service والعمل الخلفي مفقود. السبب الأرجح؟" },
      options: [
        { en: "The downstream service was extremely fast", ar: "الـ service الخلفية كانت سريعة جداً" },
        { en: "The trace ID was too long to store", ar: "الـ trace ID كان أطول من أن يُخزَّن" },
        { en: "The traceparent header was not propagated on the outgoing call", ar: "header الـ traceparent لم يُمرَّر في النداء الصادر" },
        { en: "The clock on the downstream host was wrong", ar: "ساعة الـ host الخلفي كانت خاطئة" }
      ],
      correct: 2,
      why: { en: "A broken handoff — usually a raw HttpClient or a queue that did not carry traceparent — makes the downstream service start a new trace, so the original trace simply stops at the boundary.", ar: "تسليم مكسور — عادةً HttpClient خام أو queue لم تحمل traceparent — يجعل الـ service الخلفية تبدأ trace جديداً، فيتوقّف الـ trace الأصلي عند الحدّ ببساطة." }
    },
    {
      q: { en: "Why should the sampling decision be made once at the edge, not independently per service?", ar: "لماذا يجب اتخاذ قرار الـ sampling مرّة عند الحافّة، لا في كل service مستقلّة؟" },
      options: [
        { en: "So every service either keeps or drops the whole trace consistently", ar: "كي تحتفظ كل service بالـ trace كله أو تُسقطه باتّساق" },
        { en: "Because only the edge has enough CPU to decide", ar: "لأن الحافّة وحدها تملك CPU كافياً للقرار" },
        { en: "To make the trace ID shorter", ar: "لجعل الـ trace ID أقصر" },
        { en: "Because services cannot read headers", ar: "لأن الـ services لا تستطيع قراءة الـ headers" }
      ],
      correct: 0,
      why: { en: "The sampled flag is set once and copied along the path. If services decided separately you would get half-recorded traces — some spans kept, some dropped — which are useless for following a request.", ar: "علم الـ sampled يُضبط مرّة ويُنسخ على المسار. لو قرّرت الـ services منفصلة لحصلت على traces نصف مسجّلة — بعض spans محفوظة وبعضها مُسقط — وهي عديمة الفائدة لتتبّع طلب." }
    },
    {
      q: { en: "You put the concrete order id inside the span name. What goes wrong?", ar: "وضعت الـ order id الفعلي داخل اسم الـ span. ما الذي يحدث خطأً؟" },
      options: [
        { en: "Nothing; it is the recommended practice", ar: "لا شيء؛ إنها الممارسة المُوصى بها" },
        { en: "Every request gets a unique operation name, so the backend cannot aggregate and its index bloats", ar: "كل طلب يحصل على اسم عملية فريد، فلا يستطيع الـ backend التجميع ويتضخّم فهرسه" },
        { en: "The trace ID changes on every request", ar: "الـ trace ID يتغيّر مع كل طلب" },
        { en: "The span will not export", ar: "الـ span لن يُصدَّر" }
      ],
      correct: 1,
      why: { en: "High-cardinality names create one distinct operation per request, so backends cannot group them and storage grows. Use the route template as the name and put the id in a tag.", ar: "الأسماء عالية التنوّع تُنشئ عملية مختلفة لكل طلب، فلا تستطيع الـ backends تجميعها وينمو التخزين. استخدم قالب المسار اسماً وضع الـ id في tag." }
    },
    {
      q: { en: "A trace shows a 400 ms gap between two spans with no span inside it. What does that most likely mean?", ar: "trace يُظهر فجوة 400 ms بين spanين بلا span بينها. ما أرجح معناها؟" },
      options: [
        { en: "The trace is corrupted and should be ignored", ar: "الـ trace تالف ويجب تجاهله" },
        { en: "Time was spent in uninstrumented code or waiting — e.g. a lock, GC, or serialization", ar: "قُضي الوقت في كود غير مُجرى له instrument أو في انتظار — مثل قفل أو GC أو serialization" },
        { en: "The two spans belong to different traces", ar: "الـ spanان يخصّان traceين مختلفين" },
        { en: "The exporter added artificial delay", ar: "الـ exporter أضاف تأخيراً مصطنعاً" }
      ],
      correct: 1,
      why: { en: "The gap is real elapsed time that no span covers — typically uninstrumented work or waiting. Add a manual span around the suspect block or check runtime metrics for that window to explain it.", ar: "الفجوة وقت حقيقي منقضٍ لا يغطّيه span — عادةً عمل غير مُجرى له instrument أو انتظار. أضف span يدوياً حول الكتلة المشبوهة أو افحص metrics الـ runtime لتلك النافذة لتفسيرها." }
    }
  ]
};
```

NEXT: code-review
