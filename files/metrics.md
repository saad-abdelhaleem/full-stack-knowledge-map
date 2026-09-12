```js
const metricsLesson = {
  id: "metrics",
  moduleId: "observability",
  title: { en: "Metrics that matter", ar: "المقاييس المهمة" },
  summary: {
    en: "Pick a small set of numbers that tell you if the system is healthy, using counters, gauges and histograms — without blowing up the number of series you store.",
    ar: "اختر مجموعة صغيرة من الأرقام تخبرك إن كان النظام سليماً، باستخدام counter و gauge و histogram — بدون تفجير عدد الـ series التي تخزّنها."
  },
  mins: 14,
  sections: [
    {
      key: "why",
      blocks: [
        { t: "p",
          en: "A metric is a single number measured over time that tells you how a running system is doing — like requests per second, or how full a queue is. Metrics answer 'is it healthy right now, and is it getting worse?' fast and cheaply, so you can alert on them.",
          ar: "الـ metric هو رقم واحد يُقاس عبر الزمن ويخبرك بحالة النظام أثناء عمله — مثل عدد الـ requests في الثانية، أو مدى امتلاء الـ queue. الـ metrics تجيب على سؤال 'هل النظام سليم الآن، وهل يزداد سوءاً؟' بسرعة وبتكلفة قليلة، فيمكنك بناء التنبيهات عليها." },
        { t: "kv", rows: [
          { k: { en: "metric", ar: "metric" }, v: { en: "A number measured repeatedly over time about a running system.", ar: "رقم يُقاس بشكل متكرر عبر الزمن عن نظام يعمل." } },
          { k: { en: "counter", ar: "counter" }, v: { en: "A number that only goes up (and resets to 0 on restart). Example: total requests served.", ar: "رقم يزيد فقط (ويعود إلى 0 عند إعادة التشغيل). مثال: إجمالي الـ requests المُخدَّمة." } },
          { k: { en: "gauge", ar: "gauge" }, v: { en: "A number that goes up and down — a snapshot of 'right now'. Example: items currently in a queue.", ar: "رقم يرتفع وينخفض — لقطة عن 'الآن'. مثال: عدد العناصر الموجودة حالياً في الـ queue." } },
          { k: { en: "histogram", ar: "histogram" }, v: { en: "A set of buckets that count how many measurements fell into each range. Used for latency.", ar: "مجموعة buckets تعدّ كم قياساً وقع في كل نطاق. تُستخدم لقياس زمن الاستجابة (latency)." } },
          { k: { en: "label / tag", ar: "label / tag" }, v: { en: "A key=value attached to a metric that splits it into separate lines, e.g. route=/checkout.", ar: "زوج key=value يُرفق بالـ metric فيقسّمه إلى خطوط منفصلة، مثل route=/checkout." } },
          { k: { en: "time series", ar: "time series" }, v: { en: "One metric plus one exact set of label values, tracked over time. Each unique combination is its own series.", ar: "metric واحد مع مجموعة قيم labels محددة، متتبَّعة عبر الزمن. كل تركيبة فريدة تُعدّ series مستقلة." } },
          { k: { en: "cardinality", ar: "cardinality" }, v: { en: "The number of distinct time series a metric produces. High cardinality is the main cost driver.", ar: "عدد الـ time series المتميزة التي ينتجها الـ metric. الـ cardinality العالية هي المحرّك الأساسي للتكلفة." } }
        ]},
        { t: "p",
          en: "Think of a car dashboard. The speedometer is a gauge — it rises and falls with speed. The odometer is a counter — it only climbs. You do not read the engine's full manual while driving; you glance at a few dials. Metrics are those dials for a backend.",
          ar: "تخيّل لوحة عدادات سيارة. عداد السرعة هو gauge — يرتفع وينخفض مع السرعة. عداد المسافة هو counter — يتصاعد فقط. أنت لا تقرأ دليل المحرّك كاملاً أثناء القيادة؛ بل تنظر إلى بضعة عدادات. الـ metrics هي تلك العدادات لنظام الـ backend." },
        { t: "p",
          en: "Logs record individual events in detail; metrics summarize many events into one number. The two answer different questions: a metric tells you the error rate jumped; a log tells you which request failed and why. You need metrics first because they are cheap to keep for a long time and quick to alert on.",
          ar: "الـ logs تسجّل الأحداث الفردية بالتفصيل؛ والـ metrics تلخّص أحداثاً كثيرة في رقم واحد. الاثنان يجيبان على أسئلة مختلفة: الـ metric يخبرك أن نسبة الأخطاء قفزت؛ والـ log يخبرك أي request فشل ولماذا. تحتاج الـ metrics أولاً لأنها رخيصة الحفظ لمدة طويلة وسريعة للتنبيه." },
        { t: "callout", kind: "tip",
          en: "Rule of thumb: alert on metrics, then jump to traces and logs to find the cause. Metrics tell you something is wrong; they rarely tell you exactly why.",
          ar: "قاعدة عملية: نبّه على الـ metrics، ثم انتقل إلى الـ traces والـ logs لإيجاد السبب. الـ metrics تخبرك أن هناك خطأً؛ لكنها نادراً ما تخبرك بالسبب الدقيق." }
      ]
    },
    {
      key: "problem",
      blocks: [
        { t: "p",
          en: "Without metrics you learn about outages from customers, not from your own screen. Take a payments service with one endpoint, POST /checkout. Before metrics, the only signal was support tickets — meaning a human had to complain before anyone knew checkout was failing.",
          ar: "بدون metrics تعرف بالأعطال من العملاء لا من شاشتك. خذ خدمة مدفوعات فيها endpoint واحد، POST /checkout. قبل الـ metrics كانت الإشارة الوحيدة هي تذاكر الدعم — أي أن إنساناً كان يجب أن يشتكي قبل أن يعرف أحد أن الـ checkout يفشل." },
        { t: "p",
          en: "The opposite failure is just as common: teams add hundreds of numbers and still cannot answer 'is checkout okay?'. More metrics is not more insight. A useful starting set is tiny — for a request-driven service, just three numbers per endpoint.",
          ar: "الفشل المعاكس شائع بنفس القدر: فرق تضيف مئات الأرقام ومع ذلك لا تستطيع الإجابة عن 'هل الـ checkout بخير؟'. عدد أكبر من الـ metrics لا يعني فهماً أكبر. المجموعة المفيدة للبداية صغيرة جداً — لخدمة تعتمد على الـ requests، ثلاثة أرقام فقط لكل endpoint." },
        { t: "kv", rows: [
          { k: { en: "Rate", ar: "Rate" }, v: { en: "How many checkout requests per second. A sudden drop to zero means traffic is not reaching you.", ar: "كم request للـ checkout في الثانية. الانخفاض المفاجئ إلى صفر يعني أن الـ traffic لا يصل إليك." } },
          { k: { en: "Errors", ar: "Errors" }, v: { en: "What fraction of those requests failed. Going from 0.1% to 5% is your first alarm.", ar: "ما نسبة تلك الـ requests التي فشلت. الانتقال من 0.1% إلى 5% هو أول جرس إنذار." } },
          { k: { en: "Duration", ar: "Duration" }, v: { en: "How long checkout takes, as a distribution. p99 rising from 200 ms to 3 s means the slowest 1 in 100 users now waits 3 seconds.", ar: "كم يستغرق الـ checkout، كتوزيع. ارتفاع p99 من 200 ms إلى 3 s يعني أن أبطأ مستخدم من كل 100 صار ينتظر 3 ثوانٍ." } }
        ]},
        { t: "callout", kind: "note",
          en: "Those three — Rate, Errors, Duration — are the RED method. RED is a checklist for request-driven services: instrument every endpoint with exactly these three and you can spot most user-facing problems.",
          ar: "هذه الثلاثة — Rate و Errors و Duration — هي طريقة RED. RED هي قائمة تحقق للخدمات المعتمدة على الـ requests: جهّز كل endpoint بهذه الثلاثة تحديداً وستكتشف معظم المشاكل التي يراها المستخدم." }
      ]
    },
    {
      key: "internals",
      blocks: [
        { t: "p",
          en: "Each metric plus one exact combination of label values is stored as a separate time series — a running list of (timestamp, value) points. A counter's series is one number held in memory; adding to it is an atomic increment, so it is cheap even under heavy concurrency.",
          ar: "كل metric مع تركيبة محددة من قيم الـ labels يُخزَّن كـ time series منفصلة — قائمة متنامية من نقاط (timestamp, value). series الـ counter هي رقم واحد محفوظ في الذاكرة؛ الإضافة إليه هي atomic increment، لذا فهو رخيص حتى تحت تزامن عالٍ." },
        { t: "p",
          en: "A histogram is not one number. It is a fixed set of buckets defined by upper bounds, for example 5 ms, 25 ms, 100 ms, 500 ms, 2500 ms. Each bucket is itself a counter. When you record 80 ms, every bucket whose bound is 80 ms or higher increments. Later a tool estimates p99 by finding which bucket the 99th percentile falls in. You never store individual measurements — just the bucket counts.",
          ar: "الـ histogram ليس رقماً واحداً. بل مجموعة ثابتة من الـ buckets محددة بحدود عليا، مثلاً 5 ms و 25 ms و 100 ms و 500 ms و 2500 ms. كل bucket هو بحدّ ذاته counter. عندما تسجّل 80 ms، يزيد كل bucket حدّه 80 ms أو أعلى. لاحقاً تقدّر أداة قيمة p99 بإيجاد الـ bucket الذي تقع فيه. أنت لا تخزّن القياسات الفردية — فقط أعداد الـ buckets." },
        { t: "p",
          en: "Think of histogram buckets like pigeonholes for mail sorted by size: you do not keep every letter, you just tally how many fell in each slot. That is why a histogram uses a fixed, tiny amount of memory no matter how many requests you record.",
          ar: "تخيّل buckets الـ histogram مثل صناديق بريد مرتّبة حسب الحجم: أنت لا تحتفظ بكل رسالة، بل تحصي كم رسالة وقعت في كل صندوق. لهذا يستخدم الـ histogram قدراً ثابتاً وصغيراً من الذاكرة مهما بلغ عدد الـ requests التي تسجّلها." },
        { t: "code", lang: "csharp",
          label: { en: "Defining instruments once with the .NET Meter API", ar: "تعريف الـ instruments مرة واحدة عبر .NET Meter API" },
          code: "using System.Diagnostics.Metrics;\n\n// A Meter is the factory for all instruments in one component.\nstatic readonly Meter Meter = new(\"Payments.Checkout\", \"1.0\");\n\n// Counter: only ever goes up. Counts every checkout attempt.\nstatic readonly Counter<long> Requests =\n    Meter.CreateCounter<long>(\"checkout.requests\");\n\n// Histogram: records how long each checkout took, in buckets.\nstatic readonly Histogram<double> Duration =\n    Meter.CreateHistogram<double>(\"checkout.duration\", unit: \"ms\");\n\n// Observable gauge: read on demand. How deep is the work queue now?\nstatic readonly ObservableGauge<int> QueueDepth =\n    Meter.CreateObservableGauge(\"checkout.queue.depth\", () => _queue.Count);" },
        { t: "code", lang: "csharp",
          label: { en: "Recording RED on one request, tagged by low-cardinality labels", ar: "تسجيل RED على request واحد، موسوماً بـ labels منخفضة الـ cardinality" },
          code: "var sw = Stopwatch.StartNew();\nvar outcome = \"ok\";\ntry\n{\n    await ProcessCheckoutAsync(order);\n}\ncatch\n{\n    outcome = \"error\";\n    throw;\n}\nfinally\n{\n    sw.Stop();\n    // route and outcome each have only a handful of values -> safe.\n    var tags = new TagList { { \"route\", \"/checkout\" }, { \"outcome\", outcome } };\n    Requests.Add(1, tags);\n    Duration.Record(sw.Elapsed.TotalMilliseconds, tags);\n}" },
        { t: "p",
          en: "A collector such as Prometheus scrapes — meaning it pulls — the app's /metrics endpoint on a schedule, often every 15 seconds, and stores each series it finds. Cardinality is the number of distinct series. It multiplies: a metric with 5 routes and 4 outcomes is 5 × 4 = 20 series. Add a label with a million values and you get a million series, each costing memory. That is how one careless label knocks over a monitoring server.",
          ar: "أداة تجميع مثل Prometheus تقوم بعملية scrape — أي تسحب — الـ endpoint المسمّى /metrics من التطبيق حسب جدول، غالباً كل 15 ثانية، وتخزّن كل series تجدها. الـ cardinality هي عدد الـ series المتميزة. وهي تتضاعف: metric فيه 5 routes و 4 outcomes يساوي 5 × 4 = 20 series. أضف label بمليون قيمة فتحصل على مليون series، كل منها يكلّف ذاكرة. هكذا يُسقط label واحد غير مدروس خادم المراقبة." },
        { t: "kv", rows: [
          { k: { en: "instrument", ar: "instrument" }, v: { en: "The object you record into: a counter, gauge, or histogram.", ar: "الكائن الذي تسجّل فيه: counter أو gauge أو histogram." } },
          { k: { en: "scrape", ar: "scrape" }, v: { en: "The collector pulling metric values from an app's /metrics endpoint on a timer.", ar: "قيام أداة التجميع بسحب قيم الـ metrics من الـ endpoint /metrics في التطبيق بشكل دوري." } },
          { k: { en: "bucket bounds", ar: "bucket bounds" }, v: { en: "The fixed upper limits that define a histogram's buckets; chosen to bracket your expected latencies.", ar: "الحدود العليا الثابتة التي تعرّف buckets الـ histogram؛ تُختار لتحيط بأزمنة الاستجابة المتوقعة." } }
        ]}
      ]
    },
    {
      key: "tradeoffs",
      blocks: [
        { t: "tradeoff",
          pros: {
            en: ["Cheap to store and query: one number per series, kept for months.", "Fast to alert on — you can page on a rising error rate in seconds.", "Great for trends and dashboards across the whole fleet.", "Low overhead in the app: an atomic add per request."],
            ar: ["رخيصة التخزين والاستعلام: رقم واحد لكل series، تُحفظ لأشهر.", "سريعة للتنبيه — يمكنك إطلاق تنبيه على ارتفاع نسبة الأخطاء خلال ثوانٍ.", "ممتازة للاتجاهات ولوحات المعلومات عبر الأسطول كله.", "عبء منخفض داخل التطبيق: atomic add لكل request."]
          },
          cons: {
            en: ["They tell you what changed, rarely why — you still need traces and logs.", "You lose per-request detail; you cannot ask 'which user hit this?'.", "Histogram accuracy is limited by your chosen bucket bounds.", "Easy to blow up cost with one high-cardinality label."],
            ar: ["تخبرك بما تغيّر، ونادراً لماذا — لا تزال تحتاج traces و logs.", "تفقد تفاصيل كل request؛ لا تستطيع سؤال 'أي مستخدم سبّب هذا؟'.", "دقة الـ histogram محدودة بحدود الـ buckets التي اخترتها.", "من السهل تفجير التكلفة بـ label واحد عالي الـ cardinality."]
          },
          limits: {
            en: ["Percentiles from buckets are estimates, not exact values.", "A restart resets counters to zero; queries must use rate to cope.", "Scrape interval sets your time resolution — 15 s means you miss shorter spikes."],
            ar: ["النسب المئوية من الـ buckets تقديرات لا قيم دقيقة.", "إعادة التشغيل تصفّر الـ counters؛ يجب أن تستخدم الاستعلامات rate للتعامل مع ذلك.", "فترة الـ scrape تحدد دقتك الزمنية — 15 ثانية تعني تفويت النبضات الأقصر."]
          },
          alts: {
            en: ["Logs for per-event detail and forensic questions.", "Distributed tracing to see where time went across services.", "Profilers for CPU and allocation hotspots inside one process."],
            ar: ["الـ logs لتفاصيل كل حدث والأسئلة التحقيقية.", "التتبّع الموزّع (tracing) لرؤية أين ذهب الوقت عبر الخدمات.", "الـ profilers لنقاط الـ CPU والتخصيص الساخنة داخل عملية واحدة."]
          }
        }
      ]
    },
    {
      key: "mistakes",
      blocks: [
        { t: "mistake",
          title: { en: "Putting a user id (or full URL) in a label", ar: "وضع user id (أو URL كامل) في label" },
          body: { en: "A team tagged checkout.requests with user_id to 'break it down per customer'. With two million users that is two million series. Prometheus memory climbed until it was killed by the OS, and all monitoring went dark during an actual incident.", ar: "فريق وسم checkout.requests بـ user_id ليقسّمه 'لكل عميل'. مع مليوني مستخدم يعني ذلك مليوني series. ارتفعت ذاكرة Prometheus حتى قتلها نظام التشغيل، وانطفأت كل المراقبة أثناء حادثة حقيقية." },
          fix: "// Keep labels to a small, bounded set of values.\nRequests.Add(1, new(\"route\", \"/checkout\"), new(\"outcome\", outcome));\n// user-level detail belongs in logs or traces, not a metric label." },
        { t: "mistake",
          title: { en: "Alerting on averages instead of percentiles", ar: "التنبيه على المتوسطات بدل النسب المئوية" },
          body: { en: "A dashboard showed average latency at 120 ms and everyone relaxed. Meanwhile p99 was 6 s — meaning 1 in 100 users waited six seconds. The average hid the slow tail because most requests were fast. Alerts fired only after churn rose.", ar: "لوحة معلومات أظهرت متوسط زمن الاستجابة عند 120 ms فاطمأن الجميع. بينما كان p99 يساوي 6 s — أي أن 1 من كل 100 مستخدم انتظر ست ثوانٍ. المتوسط أخفى الذيل البطيء لأن معظم الـ requests كانت سريعة. لم تنطلق التنبيهات إلا بعد ارتفاع فقدان العملاء." } },
        { t: "mistake",
          title: { en: "Using a counter for something that goes down", ar: "استخدام counter لشيء ينخفض" },
          body: { en: "Someone modeled 'active connections' as a counter and only ever added to it. The number rose forever and never reflected reality. Active connections go up and down, so it must be a gauge. A counter that decreases also breaks rate() queries, which assume monotonic growth.", ar: "أحدهم نمذج 'الاتصالات النشطة' كـ counter وأضاف إليه فقط. الرقم ارتفع إلى الأبد ولم يعكس الواقع. الاتصالات النشطة ترتفع وتنخفض، لذا يجب أن تكون gauge. الـ counter الذي ينخفض يكسر أيضاً استعلامات rate() التي تفترض نمواً أحادي الاتجاه." },
          fix: "static readonly UpDownCounter<int> ActiveConns =\n    Meter.CreateUpDownCounter<int>(\"checkout.active_connections\");\n// or an ObservableGauge that reads the current count." },
        { t: "mistake",
          title: { en: "One metric per code path (metric sprawl)", ar: "metric لكل مسار كود (تضخّم الـ metrics)" },
          body: { en: "Instead of one checkout.requests with an outcome label, a service defined checkout_ok, checkout_declined, checkout_timeout as separate names. Queries had to be rewritten for every new outcome, and no dashboard could sum them cleanly. Use one metric name and a label for the variant.", ar: "بدل checkout.requests واحد مع label للـ outcome، عرّفت الخدمة checkout_ok و checkout_declined و checkout_timeout كأسماء منفصلة. تطلّب كل outcome جديد إعادة كتابة الاستعلامات، ولم تستطع أي لوحة جمعها بنظافة. استخدم اسم metric واحداً و label للنوع." } }
      ]
    },
    {
      key: "interview",
      blocks: [
        { t: "qa", level: "junior",
          q: { en: "What is the difference between a counter and a gauge?", ar: "ما الفرق بين counter و gauge؟" },
          a: { en: "A counter only goes up — like total requests served — and resets to zero when the process restarts. A gauge goes up and down and shows a current value, like the number of items in a queue right now. If the thing can decrease, it is a gauge, not a counter.", ar: "الـ counter يزيد فقط — مثل إجمالي الـ requests المُخدَّمة — ويعود إلى صفر عند إعادة تشغيل العملية. الـ gauge يرتفع وينخفض ويظهر قيمة حالية، مثل عدد العناصر في الـ queue الآن. إن كان الشيء يمكن أن ينخفض، فهو gauge لا counter." } },
        { t: "qa", level: "mid",
          q: { en: "What are the RED and USE methods, and when do you use each?", ar: "ما طريقتا RED و USE، ومتى تستخدم كلاً منهما؟" },
          a: { en: "RED is Rate, Errors, Duration — the three numbers I put on every request-driven endpoint to see if users are being served well. USE is Utilization, Saturation, Errors — I use it for resources like CPU, disk, and connection pools to see if a resource is the bottleneck. RED watches the service from the caller's side; USE watches the machine underneath.", ar: "RED هي Rate و Errors و Duration — الأرقام الثلاثة التي أضعها على كل endpoint معتمد على الـ requests لأرى إن كان المستخدمون يُخدَّمون جيداً. USE هي Utilization و Saturation و Errors — أستخدمها للموارد مثل الـ CPU والقرص و connection pools لأرى إن كان المورد هو عنق الزجاجة. RED تراقب الخدمة من جهة المتصل؛ USE تراقب الآلة تحتها." } },
        { t: "qa", level: "mid",
          q: { en: "Why not just log every request and compute metrics from the logs?", ar: "لماذا لا نسجّل كل request ونحسب الـ metrics من الـ logs؟" },
          a: { en: "You can, but it is far more expensive. Logs store every event; metrics store one number per series. To keep a year of latency data as logs is huge; as a histogram it is a handful of buckets. Metrics are also pre-aggregated, so alerting is instant instead of scanning logs. I use logs for detail, metrics for cheap, fast, long-lived signals.", ar: "يمكنك، لكن تكلفته أعلى بكثير. الـ logs تخزّن كل حدث؛ الـ metrics تخزّن رقماً واحداً لكل series. حفظ سنة من بيانات الـ latency كـ logs ضخم؛ وكـ histogram هو بضعة buckets. الـ metrics أيضاً مُجمّعة مسبقاً، فالتنبيه فوري بدل مسح الـ logs. أستخدم الـ logs للتفصيل، والـ metrics لإشارات رخيصة وسريعة وطويلة العمر." } },
        { t: "qa", level: "senior",
          q: { en: "What is cardinality and why does it decide the cost of your metrics?", ar: "ما الـ cardinality ولماذا تحدد تكلفة الـ metrics لديك؟" },
          a: { en: "Cardinality is the number of distinct time series a metric produces, which equals the product of how many values each label can take. Every series costs memory and disk in the collector. Low-value labels like route are fine; unbounded ones like user id or request id multiply into millions of series and can crash the monitoring backend. So I treat every label as a cost and only add labels with a small, fixed set of values.", ar: "الـ cardinality هي عدد الـ time series المتميزة التي ينتجها الـ metric، وتساوي حاصل ضرب عدد القيم التي يأخذها كل label. كل series يكلّف ذاكرة وقرصاً في أداة التجميع. الـ labels محدودة القيم مثل route جيدة؛ أما غير المحدودة مثل user id أو request id فتتضاعف إلى ملايين الـ series وقد تُسقط خادم المراقبة. لذا أعامل كل label كتكلفة وأضيف فقط الـ labels ذات المجموعة الصغيرة الثابتة من القيم." } },
        { t: "qa", level: "senior",
          q: { en: "How does a histogram give you p99, and what is the catch?", ar: "كيف يعطيك الـ histogram قيمة p99، وما المأخذ؟" },
          a: { en: "A histogram counts how many measurements fall below each bucket bound. To get p99 you find the bucket where the 99th percentile lands and interpolate within it. The catch is accuracy: the answer is only as precise as your bucket boundaries. If your buckets jump from 500 ms to 2500 ms and real p99 is 900 ms, the estimate is rough. So I pick bounds that bracket the latencies I care about.", ar: "الـ histogram يعدّ كم قياساً يقع تحت كل bucket bound. للحصول على p99 تجد الـ bucket الذي تقع فيه النسبة 99 وتُجري interpolation داخله. المأخذ هو الدقة: الإجابة بدقة حدود الـ buckets فقط. إن قفزت الـ buckets من 500 ms إلى 2500 ms والـ p99 الحقيقي 900 ms، فالتقدير خشن. لذا أختار حدوداً تحيط بأزمنة الاستجابة التي تهمّني." } },
        { t: "qa", level: "staff",
          q: { en: "A team has 4,000 metrics and still gets paged by customers first. How do you fix this organizationally?", ar: "فريق لديه 4000 metric ومع ذلك يعرف بالأعطال من العملاء أولاً. كيف تصلح هذا تنظيمياً؟" },
          a: { en: "The problem is not too few metrics, it is no shared standard. I would define a small required set every service must expose — RED per endpoint, USE per resource — and tie alerts to service level objectives, not to raw numbers. Then I would delete or archive metrics nobody queries, and add a review step so new metrics justify their cardinality. The goal is a few trustworthy signals owned by the team, not thousands nobody reads.", ar: "المشكلة ليست قلة الـ metrics، بل غياب معيار مشترك. سأحدد مجموعة صغيرة إلزامية على كل خدمة كشفها — RED لكل endpoint، و USE لكل مورد — وأربط التنبيهات بأهداف مستوى الخدمة (SLOs) لا بالأرقام الخام. ثم أحذف أو أؤرشف الـ metrics التي لا يستعلم عنها أحد، وأضيف خطوة مراجعة تجعل كل metric جديد يبرّر cardinality الخاص به. الهدف بضع إشارات موثوقة يملكها الفريق، لا آلاف لا يقرأها أحد." } }
      ]
    },
    {
      key: "codereview",
      blocks: [
        { t: "review", severity: "high",
          title: { en: "Unbounded label value creates runaway cardinality", ar: "قيمة label غير محدودة تُنشئ cardinality جامحة" },
          bad: "// route path includes the order id, so every order is a new series\nRequests.Add(1, new(\"path\", $\"/checkout/{order.Id}\"));",
          good: "// use the route template, not the concrete path\nRequests.Add(1, new(\"route\", \"/checkout/{id}\"), new(\"outcome\", outcome));",
          why: { en: "The order id is unique per request, so `path` produces one series per order — millions of series that overwhelm the collector. Using the route template keeps the label to a handful of values. The id, if needed, goes in a log or trace where per-request detail belongs.", ar: "معرّف الطلب فريد لكل request، فينتج `path` series لكل طلب — ملايين الـ series تُثقل أداة التجميع. استخدام قالب الـ route يبقي الـ label ببضع قيم. المعرّف، إن لزم، يذهب في log أو trace حيث تنتمي تفاصيل كل request." } },
        { t: "review", severity: "medium",
          title: { en: "Counting errors without recording total requests", ar: "عدّ الأخطاء دون تسجيل إجمالي الـ requests" },
          bad: "// only errors are counted\nif (failed) Errors.Add(1, new(\"route\", \"/checkout\"));",
          good: "// count every request with an outcome label; derive error RATE later\nRequests.Add(1, new(\"route\", \"/checkout\"),\n                new(\"outcome\", failed ? \"error\" : \"ok\"));",
          why: { en: "A raw error count is meaningless without the denominator. 50 errors is fine at a million requests and a disaster at 200. Recording every request with an outcome label lets you compute error rate = errors / total, which is what you actually alert on.", ar: "عدد الأخطاء الخام بلا معنى دون المقام. 50 خطأً مقبول مع مليون request وكارثة مع 200. تسجيل كل request مع label للـ outcome يتيح حساب نسبة الأخطاء = الأخطاء / الإجمالي، وهو ما تنبّه عليه فعلاً." } }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        { t: "p",
          en: "In a typical setup, each service exposes a /metrics endpoint. A collector like Prometheus scrapes every service every 15 seconds and stores the series. A dashboard tool like Grafana queries the collector to draw graphs, and an alerting rule fires when a query crosses a threshold — for example, error rate above 2% for five minutes.",
          ar: "في إعداد نموذجي، تكشف كل خدمة endpoint اسمه /metrics. تقوم أداة تجميع مثل Prometheus بعمل scrape لكل خدمة كل 15 ثانية وتخزّن الـ series. أداة لوحات مثل Grafana تستعلم من أداة التجميع لرسم الرسوم البيانية، وتنطلق قاعدة تنبيه عندما يتجاوز استعلام عتبة — مثلاً نسبة أخطاء فوق 2% لمدة خمس دقائق." },
        { t: "ul",
          en: [
            "Expose RED per endpoint and USE per shared resource (thread pool, DB connection pool, message queue).",
            "Tie alerts to SLOs (e.g. 99% of checkouts under 500 ms), not to raw numbers a human has to interpret.",
            "Keep label sets identical across services so one dashboard works fleet-wide.",
            "Set a retention policy: high-resolution data for days, downsampled data for months."
          ],
          ar: [
            "اكشف RED لكل endpoint و USE لكل مورد مشترك (thread pool، DB connection pool، message queue).",
            "اربط التنبيهات بـ SLOs (مثلاً 99% من الـ checkouts تحت 500 ms)، لا بأرقام خام على إنسان تفسيرها.",
            "أبقِ مجموعات الـ labels متطابقة عبر الخدمات لتعمل لوحة واحدة على الأسطول كله.",
            "حدّد سياسة احتفاظ: بيانات عالية الدقة لأيام، وبيانات مخفّضة الدقة لأشهر."
          ]
        },
        { t: "callout", kind: "warn",
          en: "Cardinality is a shared, cluster-wide budget. One service adding a bad label can degrade the collector for every team. Treat new high-cardinality labels as a change that needs review.",
          ar: "الـ cardinality ميزانية مشتركة على مستوى الـ cluster. خدمة واحدة تضيف label سيئاً قد تُضعف أداة التجميع لكل الفرق. عامل الـ labels الجديدة عالية الـ cardinality كتغيير يحتاج مراجعة." }
      ]
    },
    {
      key: "perf",
      blocks: [
        { t: "kv", rows: [
          { k: { en: "Memory", ar: "Memory" }, v: { en: "Cost is per time series, both in the app and the collector. Roughly 1-3 KB per series in Prometheus — a million series is gigabytes.", ar: "التكلفة لكل time series، في التطبيق وفي أداة التجميع. تقريباً 1-3 KB لكل series في Prometheus — مليون series يعني gigabytes." } },
          { k: { en: "CPU", ar: "CPU" }, v: { en: "Recording a metric is cheap — an atomic add. Cost shows up at query time when the collector scans many series.", ar: "تسجيل metric رخيص — atomic add. تظهر التكلفة وقت الاستعلام حين تمسح أداة التجميع الكثير من الـ series." } },
          { k: { en: "Network", ar: "Network" }, v: { en: "Each scrape transfers the full text of all current series. More series means bigger scrapes every 15 s.", ar: "كل scrape ينقل النص الكامل لكل الـ series الحالية. عدد أكبر من الـ series يعني scrapes أكبر كل 15 ثانية." } },
          { k: { en: "Scalability", ar: "Scalability" }, v: { en: "Adding app instances adds series linearly; adding high-cardinality labels multiplies them. The second is what breaks clusters.", ar: "إضافة instances للتطبيق تزيد الـ series خطياً؛ إضافة labels عالية الـ cardinality تضاعفها. الثانية هي ما يكسر الـ clusters." } },
          { k: { en: "Latency", ar: "Latency" }, v: { en: "Instrumentation adds microseconds per request. It is negligible unless you record inside a tight inner loop.", ar: "التجهيز يضيف ميكروثوانٍ لكل request. مهمل إلا إن سجّلت داخل حلقة داخلية ضيّقة." } }
        ]}
      ]
    },
    {
      key: "debug",
      blocks: [
        { t: "ul",
          en: [
            "curl http://service/metrics — read the raw text; confirm the metric names, labels and current values are what you expect.",
            "PromQL rate(checkout_requests_total[5m]) — the per-second rate over 5 minutes; a flat zero means no traffic or broken instrumentation.",
            "PromQL count by (__name__)({__name__=~\".+\"}) — count series per metric to find which one has exploded in cardinality.",
            "dotnet-counters monitor --process-id <pid> — watch live .NET counters when you have no full stack wired up yet.",
            "Grafana Explore — plot a suspect metric interactively before writing a dashboard panel or alert."
          ],
          ar: [
            "curl http://service/metrics — اقرأ النص الخام؛ تأكد أن أسماء الـ metrics والـ labels والقيم الحالية كما تتوقع.",
            "PromQL rate(checkout_requests_total[5m]) — المعدل في الثانية عبر 5 دقائق؛ صفر ثابت يعني لا traffic أو تجهيزاً معطلاً.",
            "PromQL count by (__name__)({__name__=~\".+\"}) — عدّ الـ series لكل metric لإيجاد أيها انفجر في الـ cardinality.",
            "dotnet-counters monitor --process-id <pid> — راقب .NET counters حية حين لا يكون لديك stack كامل بعد.",
            "Grafana Explore — ارسم metric مشتبهاً به تفاعلياً قبل كتابة لوحة أو تنبيه."
          ]
        },
        { t: "callout", kind: "tip",
          en: "When a metric looks wrong, curl the /metrics endpoint first. Nine times out of ten the bug is a mislabeled or double-registered instrument you can see plainly in the raw text.",
          ar: "حين يبدو metric خاطئاً، اعمل curl للـ endpoint /metrics أولاً. في تسع مرات من عشر يكون العطل instrument موسوماً خطأً أو مسجّلاً مرتين، وتراه بوضوح في النص الخام." }
      ]
    },
    {
      key: "realworld",
      blocks: [
        { t: "p",
          en: "Metrics are the first line of defense in any system where downtime costs money or trust. The pattern is always the same: a tiny set of golden signals per service, alerts tied to objectives, and detail pushed down to logs and traces.",
          ar: "الـ metrics هي خط الدفاع الأول في أي نظام يكلّف فيه التعطّل مالاً أو ثقة. النمط دائماً نفسه: مجموعة صغيرة من الإشارات الذهبية لكل خدمة، وتنبيهات مربوطة بالأهداف، والتفاصيل مدفوعة إلى الـ logs والـ traces." },
        { t: "ul",
          en: [
            "Payment systems: error rate and p99 on the charge endpoint page on-call within a minute of a provider slowdown.",
            "Chat platforms: message-delivery rate and queue depth reveal a backed-up worker before users notice missing messages.",
            "E-commerce: checkout RED metrics catch a broken deploy before the sales graph dips.",
            "Streaming services: buffering rate as a gauge shows a CDN region degrading in real time."
          ],
          ar: [
            "أنظمة المدفوعات: نسبة الأخطاء و p99 على endpoint الخصم تُطلق تنبيه المناوب خلال دقيقة من تباطؤ المزوّد.",
            "منصات المحادثة: معدل تسليم الرسائل وعمق الـ queue يكشفان worker متراكماً قبل أن يلاحظ المستخدمون فقدان رسائل.",
            "التجارة الإلكترونية: metrics الـ RED للـ checkout تلتقط نشراً معطوباً قبل انخفاض رسم المبيعات.",
            "خدمات البث: معدل الـ buffering كـ gauge يُظهر تدهور منطقة CDN في الوقت الحقيقي."
          ]
        }
      ]
    },
    {
      key: "exercises",
      blocks: [
        { t: "ex", diff: "easy",
          en: "Add RED to one ASP.NET Core endpoint using the Meter API: a counter for requests with an outcome label and a histogram for duration. Prove it works by curling /metrics and finding your two metric names with real values.",
          ar: "أضف RED إلى endpoint واحد في ASP.NET Core باستخدام Meter API: counter للـ requests مع label للـ outcome و histogram للمدة. أثبت نجاحه بعمل curl للـ /metrics وإيجاد اسمَي الـ metrics بقيم حقيقية." },
        { t: "ex", diff: "medium",
          en: "Write a PromQL query that returns the error rate (errors divided by total requests) over the last 5 minutes for your endpoint. Verify it rises when you force some requests to fail.",
          ar: "اكتب استعلام PromQL يُرجع نسبة الأخطاء (الأخطاء مقسومة على إجمالي الـ requests) خلال آخر 5 دقائق لـ endpoint لديك. تحقق من ارتفاعها حين تُجبر بعض الـ requests على الفشل." },
        { t: "ex", diff: "hard",
          en: "Deliberately add a high-cardinality label (a random guid per request), run load, and watch the series count grow with count by (__name__). Then remove the label and confirm the count drops back. Write down the before/after series counts.",
          ar: "أضف عمداً label عالي الـ cardinality (guid عشوائي لكل request)، شغّل حِملاً، وراقب نمو عدد الـ series عبر count by (__name__). ثم أزل الـ label وتأكد من عودة العدد. دوّن عدد الـ series قبل وبعد." },
        { t: "ex", diff: "senior",
          en: "Design a metrics standard for a five-service system: the required RED and USE metrics, the exact label set every service must use, an SLO with its alert rule, and a written cardinality budget per service. Justify each label as necessary and bounded.",
          ar: "صمّم معياراً للـ metrics لنظام من خمس خدمات: metrics الـ RED و USE المطلوبة، مجموعة الـ labels الدقيقة التي تلتزم بها كل خدمة، SLO مع قاعدة تنبيهه، وميزانية cardinality مكتوبة لكل خدمة. برّر كل label كضروري ومحدود." }
      ]
    },
    {
      key: "refs",
      blocks: [
        { t: "ref",
          label: { en: ".NET metrics with System.Diagnostics.Metrics", ar: "metrics في .NET عبر System.Diagnostics.Metrics" },
          url: "https://learn.microsoft.com/en-us/dotnet/core/diagnostics/metrics",
          meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref",
          label: { en: "Prometheus: metric types and best practices", ar: "Prometheus: أنواع الـ metrics وأفضل الممارسات" },
          url: "https://prometheus.io/docs/concepts/metric_types/",
          meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref",
          label: { en: "The RED method (Tom Wilkie / Grafana)", ar: "طريقة RED (Tom Wilkie / Grafana)" },
          url: "https://grafana.com/blog/2018/08/02/the-red-method-how-to-instrument-your-services/",
          meta: { en: "Article", ar: "مقال" } },
        { t: "ref",
          label: { en: "Brendan Gregg: the USE method", ar: "Brendan Gregg: طريقة USE" },
          url: "https://www.brendangregg.com/usemethod.html",
          meta: { en: "Article", ar: "مقال" } }
      ]
    }
  ],
  quiz: [
    {
      q: { en: "Which instrument should model 'number of active database connections right now'?", ar: "أي instrument يجب أن ينمذج 'عدد اتصالات قاعدة البيانات النشطة الآن'؟" },
      options: [
        { en: "A counter, because it tracks a total", ar: "counter، لأنه يتتبّع إجمالياً" },
        { en: "A gauge, because the value goes up and down", ar: "gauge، لأن القيمة ترتفع وتنخفض" },
        { en: "A histogram, because it is a distribution", ar: "histogram، لأنها توزيع" },
        { en: "A log line per connection", ar: "سطر log لكل اتصال" }
      ],
      correct: 1,
      why: { en: "Active connections rise and fall, so it is a gauge. A counter only ever increases; a histogram is for distributions like latency.", ar: "الاتصالات النشطة ترتفع وتنخفض، فهي gauge. الـ counter يزيد فقط؛ والـ histogram للتوزيعات مثل الـ latency." }
    },
    {
      q: { en: "What does RED stand for?", ar: "ماذا تعني RED؟" },
      options: [
        { en: "Requests, Endpoints, Duration", ar: "Requests و Endpoints و Duration" },
        { en: "Rate, Errors, Duration", ar: "Rate و Errors و Duration" },
        { en: "Reliability, Efficiency, Durability", ar: "Reliability و Efficiency و Durability" },
        { en: "Read, Edit, Delete", ar: "Read و Edit و Delete" }
      ],
      correct: 1,
      why: { en: "RED is Rate, Errors, Duration — the three signals to put on every request-driven endpoint.", ar: "RED هي Rate و Errors و Duration — الإشارات الثلاث التي تُوضع على كل endpoint معتمد على الـ requests." }
    },
    {
      q: { en: "Why is adding user_id as a metric label dangerous?", ar: "لماذا يكون إضافة user_id كـ label للـ metric خطيراً؟" },
      options: [
        { en: "It slows down each request by seconds", ar: "يبطّئ كل request بثوانٍ" },
        { en: "It creates one time series per user, exploding cardinality and collector memory", ar: "ينشئ time series لكل مستخدم، فيفجّر الـ cardinality وذاكرة أداة التجميع" },
        { en: "User ids cannot be stored as strings", ar: "لا يمكن تخزين user ids كنصوص" },
        { en: "It makes the metric a gauge instead of a counter", ar: "يجعل الـ metric gauge بدل counter" }
      ],
      correct: 1,
      why: { en: "Cardinality is the number of distinct series, and it multiplies by each label's value count. An unbounded label like user id produces millions of series and can crash the collector.", ar: "الـ cardinality هي عدد الـ series المتميزة، وتتضاعف بعدد قيم كل label. label غير محدود مثل user id ينتج ملايين الـ series وقد يُسقط أداة التجميع." }
    },
    {
      q: { en: "How does a histogram estimate p99 latency?", ar: "كيف يقدّر الـ histogram قيمة p99 للـ latency؟" },
      options: [
        { en: "It stores every measurement and sorts them", ar: "يخزّن كل قياس ويرتّبها" },
        { en: "It averages all recorded values", ar: "يحسب متوسط كل القيم المسجّلة" },
        { en: "It counts values per bucket and finds which bucket the 99th percentile falls in", ar: "يعدّ القيم لكل bucket ويجد الـ bucket الذي تقع فيه النسبة 99" },
        { en: "It returns the largest value ever seen", ar: "يُرجع أكبر قيمة شوهدت" }
      ],
      correct: 2,
      why: { en: "A histogram keeps only bucket counts, not raw values. p99 is estimated by locating the bucket containing the 99th percentile, so accuracy depends on the bucket bounds.", ar: "الـ histogram يحتفظ بأعداد الـ buckets فقط، لا بالقيم الخام. تُقدَّر p99 بإيجاد الـ bucket الذي يحوي النسبة 99، فالدقة تعتمد على حدود الـ buckets." }
    },
    {
      q: { en: "Why alert on error rate rather than a raw error count?", ar: "لماذا التنبيه على نسبة الأخطاء بدل عدد الأخطاء الخام؟" },
      options: [
        { en: "Rates are cheaper to store than counts", ar: "النسب أرخص تخزيناً من الأعداد" },
        { en: "A count has no denominator: 50 errors means nothing without the total request volume", ar: "العدد بلا مقام: 50 خطأً بلا معنى دون إجمالي حجم الـ requests" },
        { en: "Counters cannot be alerted on at all", ar: "لا يمكن التنبيه على الـ counters إطلاقاً" },
        { en: "Error rate ignores slow requests", ar: "نسبة الأخطاء تتجاهل الـ requests البطيئة" }
      ],
      correct: 1,
      why: { en: "50 errors is fine among a million requests and a disaster among 200. Dividing errors by total requests gives a rate that means the same thing at any traffic level.", ar: "50 خطأً مقبول ضمن مليون request وكارثة ضمن 200. قسمة الأخطاء على إجمالي الـ requests تعطي نسبة تعني الشيء نفسه عند أي مستوى traffic." }
    }
  ]
};
```

NEXT: tracing
