```js
const structuredLogsLesson = {
  id: "structured-logs",
  moduleId: "observability",
  title: { en: "Structured logging", ar: "التسجيل المنظّم" },
  summary: {
    en: "Treat logs as data, not sentences: write each event as named fields so you can search, filter, and follow one request across your whole system.",
    ar: "تعامل مع الـ logs كبيانات، لا كجُمل: اكتب كل حدث على شكل fields لها أسماء حتى تستطيع البحث والفلترة وتتبّع request واحد عبر النظام كله."
  },
  mins: 13,
  sections: [
    {
      key: "why",
      blocks: [
        { t: "p",
          en: "Structured logging means writing each log event as a set of named fields (like orderId=4821, userId=97) instead of one plain sentence. The problem it solves: plain-text logs are easy to write but almost impossible to search once you have millions of them. Structured logs are data you can query.",
          ar: "التسجيل المنظّم يعني كتابة كل log event كمجموعة fields لها أسماء (مثل orderId=4821 و userId=97) بدل جملة نصية واحدة. المشكلة التي يحلّها: الـ logs النصية سهلة الكتابة لكن يصعب البحث فيها عندما تصبح بالملايين. الـ logs المنظّمة بيانات يمكن الاستعلام عنها." },
        { t: "kv", rows: [
          { k: { en: "Log event", ar: "Log event" }, v: { en: "One line the app writes when something happens — a request arrived, an order saved, an error thrown.", ar: "سطر واحد يكتبه التطبيق عند وقوع شيء — وصول request، حفظ order، رمي error." } },
          { k: { en: "Field (property)", ar: "Field (property)" }, v: { en: "A named value attached to an event, like orderId=4821. This is what you search on.", ar: "قيمة لها اسم مرتبطة بالحدث، مثل orderId=4821. هذا ما تبحث به." } },
          { k: { en: "Message template", ar: "Message template" }, v: { en: "A log message with named holes, like \"Order {OrderId} saved\". The holes become fields automatically.", ar: "رسالة log فيها فراغات بأسماء، مثل \"Order {OrderId} saved\". الفراغات تتحوّل إلى fields تلقائياً." } },
          { k: { en: "Correlation ID", ar: "Correlation ID" }, v: { en: "One id shared by every log line of a single request, so you can pull them all together.", ar: "id واحد تشترك فيه كل أسطر log الخاصة بـ request واحد، حتى تجمعها كلها معاً." } },
          { k: { en: "Log level", ar: "Log level" }, v: { en: "How important an event is: Trace, Debug, Information, Warning, Error, Critical.", ar: "مدى أهمية الحدث: Trace و Debug و Information و Warning و Error و Critical." } },
          { k: { en: "Sink", ar: "Sink" }, v: { en: "Where logs are sent: a file, the console, or a search system like Elasticsearch or Seq.", ar: "المكان الذي تُرسَل إليه الـ logs: ملف أو console أو نظام بحث مثل Elasticsearch أو Seq." } }
        ]},
        { t: "p",
          en: "Think of receipts. Plain-text logs are receipts tossed in a shoebox: to find one you read every slip. Structured logs are the same receipts entered in a spreadsheet with columns — you filter the amount column and get the row in one second. Same information, but now it is searchable.",
          ar: "تخيّل الفواتير. الـ logs النصية مثل فواتير مرمية في صندوق: لتجد واحدة تقرأ كل ورقة. الـ logs المنظّمة نفس الفواتير مُدخلة في spreadsheet بأعمدة — تفلتر عمود المبلغ فتحصل على الصف في ثانية. نفس المعلومة، لكنها الآن قابلة للبحث." },
        { t: "p",
          en: "Our running example through this lesson: a POST /orders endpoint. One customer reports that some of their orders vanish. You need every log line for order 4821 across three services — that is the job structured logging makes possible.",
          ar: "المثال الجاري في هذا الدرس: endpoint اسمه POST /orders. أحد العملاء يبلّغ أن بعض طلباته تختفي. تحتاج كل أسطر log الخاصة بالطلب 4821 عبر ثلاث خدمات — وهذا ما يجعله التسجيل المنظّم ممكناً." },
        { t: "callout", kind: "note",
          en: "Structured logging is not a library you buy. It is a habit: attach values as fields, never glue them into a sentence with string concatenation.",
          ar: "التسجيل المنظّم ليس library تشتريها. إنه عادة: أرفق القيم كـ fields، ولا تلصقها داخل جملة باستخدام string concatenation." }
      ]
    },
    {
      key: "problem",
      blocks: [
        { t: "p",
          en: "Before structured logging, the order team wrote lines like: logger.LogInformation(\"Order \" + id + \" saved for user \" + userId). To investigate order 4821 they downloaded 2 GB of text and ran grep. It took about 40 minutes — meaning nearly a full hour of one engineer's time before they even started thinking about the bug.",
          ar: "قبل التسجيل المنظّم كان فريق الـ orders يكتب أسطراً مثل: logger.LogInformation(\"Order \" + id + \" saved for user \" + userId). للتحقيق في الطلب 4821 كانوا ينزّلون 2 GB من النص ويشغّلون grep. استغرق ذلك نحو 40 دقيقة — أي قرابة ساعة كاملة من وقت مهندس قبل أن يبدأ حتى بالتفكير في المشكلة." },
        { t: "p",
          en: "After the switch, each line carries fields: OrderId, UserId, DurationMs. Now the query is OrderId = 4821, and the log system returns every matching line in about 2 seconds — meaning the search is now instant compared to reading files by hand. The same fields also let them chart how many orders failed per minute, which plain text could never do.",
          ar: "بعد التحويل، كل سطر يحمل fields: OrderId و UserId و DurationMs. الآن الاستعلام هو OrderId = 4821، ونظام الـ logs يعيد كل الأسطر المطابقة في نحو ثانيتين — أي أن البحث صار فورياً مقارنة بقراءة الملفات يدوياً. ونفس الـ fields تتيح لهم رسم عدد الطلبات الفاشلة في الدقيقة، وهو ما لم يكن النص العادي ليسمح به أبداً." },
        { t: "kv", rows: [
          { k: { en: "Plain text: find one order", ar: "نص عادي: إيجاد طلب واحد" }, v: { en: "~40 min of manual grepping across files.", ar: "نحو 40 دقيقة من grep يدوي عبر الملفات." } },
          { k: { en: "Structured: find one order", ar: "منظّم: إيجاد طلب واحد" }, v: { en: "~2 s query on OrderId = 4821.", ar: "استعلام في نحو ثانيتين على OrderId = 4821." } },
          { k: { en: "Plain text: count failures", ar: "نص عادي: عدّ حالات الفشل" }, v: { en: "Impossible without writing a parser.", ar: "مستحيل دون كتابة parser." } },
          { k: { en: "Structured: count failures", ar: "منظّم: عدّ حالات الفشل" }, v: { en: "A filter plus a group-by; instant chart.", ar: "فلتر مع group-by؛ رسم فوري." } }
        ]}
      ]
    },
    {
      key: "internals",
      blocks: [
        { t: "p",
          en: "A structured logger turns one call into a small record of fields. The center is the message template: a string with named holes in curly braces. You pass values in order, and the logger matches each value to a hole by position, keeping both the readable message and the named fields.",
          ar: "الـ logger المنظّم يحوّل الاستدعاء الواحد إلى سجل صغير من fields. المركز هو الـ message template: نص فيه فراغات بأسماء بين أقواس معقوفة. تمرّر القيم بالترتيب، فيطابق الـ logger كل قيمة مع فراغ حسب موقعها، محتفظاً بالرسالة المقروءة وبالـ fields ذات الأسماء معاً." },
        { t: "code", lang: "csharp",
          label: { en: "One call produces a message and fields", ar: "استدعاء واحد ينتج رسالة و fields" },
          code: "// The holes {OrderId} and {DurationMs} are NOT string formatting.\n// They become named fields on the event.\nlogger.LogInformation(\n    \"Order {OrderId} saved in {DurationMs} ms\",\n    order.Id, sw.ElapsedMilliseconds);\n\n// Rendered message: \"Order 4821 saved in 37 ms\"\n// Captured fields:   { OrderId = 4821, DurationMs = 37 }" },
        { t: "p",
          en: "The message template is like a paper form with labeled blanks. The label (OrderId) stays fixed; only the value in the blank changes each time. Because the label never changes, the log system can group every \"Order saved\" event together even though the numbers differ. That grouping is what lets you count and chart.",
          ar: "الـ message template مثل نموذج ورقي بفراغات معنونة. العنوان (OrderId) يبقى ثابتاً؛ وتتغيّر القيمة في الفراغ كل مرة فقط. ولأن العنوان لا يتغيّر، يستطيع نظام الـ logs تجميع كل أحداث \"Order saved\" معاً رغم اختلاف الأرقام. هذا التجميع هو ما يتيح العدّ والرسم." },
        { t: "kv", rows: [
          { k: { en: "Logger", ar: "Logger" }, v: { en: "The object you call; ILogger<T> in ASP.NET Core.", ar: "الكائن الذي تستدعيه؛ ILogger<T> في ASP.NET Core." } },
          { k: { en: "Template + values", ar: "Template + قيم" }, v: { en: "Matched by position into named properties.", ar: "تُطابَق حسب الموقع إلى properties لها أسماء." } },
          { k: { en: "Scope", ar: "Scope" }, v: { en: "Fields added to every log inside a block, like the correlation id for a whole request.", ar: "fields تُضاف إلى كل log داخل block، مثل correlation id لكامل الـ request." } },
          { k: { en: "Enricher", ar: "Enricher" }, v: { en: "Adds fields to every event automatically: machine name, thread id, environment.", ar: "يضيف fields إلى كل حدث تلقائياً: اسم الجهاز، thread id، البيئة." } },
          { k: { en: "Sink", ar: "Sink" }, v: { en: "The output target; usually writes the event as JSON.", ar: "هدف الإخراج؛ يكتب الحدث عادةً كـ JSON." } }
        ]},
        { t: "p",
          en: "Trace one request. Middleware opens a scope holding CorrelationId = abc-123. Every log line written during that request inherits that field. Enrichers add MachineName and ThreadId. The event goes to the sink, which serializes it to JSON and ships it to the search system. Later you query CorrelationId = abc-123 and see the request's whole story in order.",
          ar: "تتبّع request واحداً. الـ middleware يفتح scope يحمل CorrelationId = abc-123. كل سطر log يُكتب أثناء ذلك الـ request يرث هذا الـ field. الـ enrichers تضيف MachineName و ThreadId. يذهب الحدث إلى الـ sink الذي يحوّله إلى JSON ويرسله إلى نظام البحث. لاحقاً تستعلم CorrelationId = abc-123 فترى قصة الـ request كاملة بالترتيب." },
        { t: "code", lang: "csharp",
          label: { en: "A scope adds one field to every line inside it", ar: "الـ scope يضيف field واحداً لكل سطر داخله" },
          code: "using (logger.BeginScope(new Dictionary<string, object>\n{\n    [\"CorrelationId\"] = correlationId\n}))\n{\n    logger.LogInformation(\"Validating order {OrderId}\", order.Id);\n    logger.LogInformation(\"Charging card for {OrderId}\", order.Id);\n    // Both lines carry CorrelationId automatically.\n}" }
      ]
    },
    {
      key: "tradeoffs",
      blocks: [
        { t: "tradeoff",
          pros: { en: [
            "Logs become queryable data, not text you must read line by line.",
            "One correlation id follows a request across services.",
            "You can count, group, and chart events without a custom parser.",
            "Fields stay consistent, so dashboards and alerts are reliable."
          ], ar: [
            "الـ logs تصبح بيانات قابلة للاستعلام، لا نصاً تقرؤه سطراً سطراً.",
            "correlation id واحد يتبع الـ request عبر الخدمات.",
            "يمكنك العدّ والتجميع والرسم دون parser مخصص.",
            "الـ fields تبقى متسقة، فتصبح لوحات القياس والتنبيهات موثوقة."
          ] },
          cons: { en: [
            "Slightly more verbose than a plain string.",
            "JSON output is larger, so storage and network cost rise.",
            "Needs a search backend to be worth it.",
            "Team must agree on field names or the data fragments."
          ], ar: [
            "أطول قليلاً من النص العادي.",
            "إخراج JSON أكبر، فترتفع تكلفة التخزين والشبكة.",
            "يحتاج backend للبحث ليصبح مجدياً.",
            "يجب أن يتفق الفريق على أسماء الـ fields وإلا تفتّتت البيانات."
          ] },
          limits: { en: [
            "It does not fix noisy or missing logs; it only makes existing logs searchable.",
            "High-cardinality fields (like a raw user email) can blow up index cost.",
            "Templates help only if you use holes, not string concatenation."
          ], ar: [
            "لا يصلح الـ logs المزعجة أو الناقصة؛ يجعل الموجود قابلاً للبحث فقط.",
            "الـ fields عالية الـ cardinality (مثل email خام) قد تضخّم تكلفة الـ index.",
            "الـ templates تفيد فقط إن استخدمت الفراغات، لا string concatenation."
          ] },
          alts: { en: [
            "Plain text logs for a tiny app with one server.",
            "Metrics for counts and rates you already know you need.",
            "Distributed tracing for latency across many services."
          ], ar: [
            "logs نصية لتطبيق صغير بخادم واحد.",
            "Metrics للأعداد والمعدلات التي تعرف مسبقاً أنك تحتاجها.",
            "distributed tracing لقياس الـ latency عبر خدمات كثيرة."
          ] }
        }
      ]
    },
    {
      key: "mistakes",
      blocks: [
        { t: "mistake",
          title: { en: "Gluing values into the message", ar: "لصق القيم داخل الرسالة" },
          body: { en: "Someone wrote LogInformation(\"Order \" + id + \" failed\"). The value is now part of the text, so there is no OrderId field to search. Every order produces a different message string, so grouping is impossible.",
            ar: "كتب أحدهم LogInformation(\"Order \" + id + \" failed\"). صارت القيمة جزءاً من النص، فلا يوجد OrderId field للبحث. كل طلب ينتج نص رسالة مختلفاً، فيصبح التجميع مستحيلاً." },
          fix: "logger.LogInformation(\"Order {OrderId} failed\", id);" },
        { t: "mistake",
          title: { en: "Logging a whole object as a string", ar: "تسجيل كائن كامل كنص" },
          body: { en: "logger.LogInformation(\"User: \" + user.ToString()) dumps everything into one blob and can leak a password or token. Log only the fields you need, by name, and keep secrets out.",
            ar: "logger.LogInformation(\"User: \" + user.ToString()) يرمي كل شيء في كتلة واحدة وقد يسرّب password أو token. سجّل فقط الـ fields التي تحتاجها بالاسم، وأبقِ الأسرار خارجها." },
          fix: "logger.LogInformation(\"User {UserId} logged in\", user.Id);" },
        { t: "mistake",
          title: { en: "No correlation id", ar: "لا يوجد correlation id" },
          body: { en: "Each service logs its own lines with no shared id. When an order crosses three services you cannot join the lines, so you see three unrelated stories instead of one request. Add a correlation id in middleware and pass it downstream in a header.",
            ar: "كل خدمة تسجّل أسطرها دون id مشترك. عندما يعبر الطلب ثلاث خدمات لا تستطيع ربط الأسطر، فترى ثلاث قصص منفصلة بدل request واحد. أضف correlation id في الـ middleware ومرّره للخدمات التالية في header." } },
        { t: "mistake",
          title: { en: "Everything logged at Information", ar: "كل شيء يُسجَّل عند Information" },
          body: { en: "A loop logs \"processing item\" at Information for every row. In production this floods the sink, hides real events, and raises the bill. Use Debug for routine detail and Information only for events worth keeping.",
            ar: "حلقة تسجّل \"processing item\" عند Information لكل صف. في الإنتاج يغرق هذا الـ sink، ويخفي الأحداث الحقيقية، ويرفع الفاتورة. استخدم Debug للتفاصيل الروتينية و Information فقط للأحداث التي تستحق الحفظ." } }
      ]
    },
    {
      key: "interview",
      blocks: [
        { t: "qa", level: "junior",
          q: { en: "What is structured logging?", ar: "ما هو التسجيل المنظّم؟" },
          a: { en: "It is writing each log as named fields instead of a sentence. So instead of \"Order 4821 saved\" as plain text, I log a message template with an OrderId field. That way I can later search for OrderId = 4821 instead of reading files.",
            ar: "هو كتابة كل log كـ fields لها أسماء بدل جملة. فبدل \"Order 4821 saved\" كنص، أسجّل message template فيه OrderId field. هكذا أستطيع لاحقاً البحث عن OrderId = 4821 بدل قراءة الملفات." } },
        { t: "qa", level: "mid",
          q: { en: "Why not just use string interpolation in the log message?", ar: "لماذا لا نستخدم string interpolation في رسالة الـ log؟" },
          a: { en: "Because $\"Order {id} saved\" bakes the value into the text before the logger sees it, so there is no field to query. With a template the logger keeps OrderId as a separate field, and the message text stays the same for every order, which lets me group and count them.",
            ar: "لأن $\"Order {id} saved\" يدمج القيمة في النص قبل أن يراها الـ logger، فلا يبقى field للاستعلام. مع الـ template يحتفظ الـ logger بـ OrderId كـ field منفصل، ويبقى نص الرسالة ثابتاً لكل طلب، مما يتيح تجميعها وعدّها." } },
        { t: "qa", level: "mid",
          q: { en: "How do you follow one request across several services?", ar: "كيف تتبّع request واحداً عبر عدة خدمات؟" },
          a: { en: "I generate a correlation id at the edge, put it in a log scope so every line in that service carries it, and pass it downstream in a header. Each service adds it to its own logs. Then I query that one id and see the whole path in order.",
            ar: "أولّد correlation id عند الحافة، أضعه في log scope حتى يحمله كل سطر في تلك الخدمة، وأمرّره للخدمات التالية في header. كل خدمة تضيفه إلى logs الخاصة بها. ثم أستعلم عن هذا الـ id فأرى المسار كله بالترتيب." } },
        { t: "qa", level: "senior",
          q: { en: "How do you decide log levels in practice?", ar: "كيف تقرّر log levels عملياً؟" },
          a: { en: "I use Information for events I would want to see in normal operation — a request handled, an order saved. Warning for recoverable problems, Error for a failed operation, Critical when the service cannot continue. Debug and Trace stay off in production and I turn them on per component when investigating.",
            ar: "أستخدم Information للأحداث التي أريد رؤيتها في التشغيل الطبيعي — معالجة request، حفظ order. و Warning للمشاكل القابلة للتعافي، و Error لعملية فشلت، و Critical حين لا تستطيع الخدمة الاستمرار. أما Debug و Trace فأبقيهما مطفأين في الإنتاج وأشغّلهما لكل component عند التحقيق." } },
        { t: "qa", level: "senior",
          q: { en: "What is field cardinality and why does it matter for logs?", ar: "ما هو field cardinality ولماذا يهم للـ logs؟" },
          a: { en: "Cardinality is how many distinct values a field can have. A field like OrderId has very high cardinality — almost every value is unique. That is fine to store as a log field, but you should never turn it into a metric label, because each unique value creates a new time series and can crash the metrics backend. Logs tolerate high cardinality; metrics do not.",
            ar: "الـ cardinality هو عدد القيم المتمايزة التي يمكن أن يحملها الـ field. field مثل OrderId له cardinality عالٍ جداً — كل قيمة تقريباً فريدة. لا بأس بتخزينه كـ log field، لكن لا تحوّله أبداً إلى metric label، لأن كل قيمة فريدة تنشئ time series جديدة وقد تُسقط الـ metrics backend. الـ logs تتحمّل cardinality عالياً؛ والـ metrics لا." } },
        { t: "qa", level: "staff",
          q: { en: "How do you get a whole organization to log consistently?", ar: "كيف تجعل مؤسسة كاملة تسجّل بشكل متسق؟" },
          a: { en: "I publish a small logging standard: agreed field names (CorrelationId, UserId, TenantId), required fields per event type, and rules about secrets. I ship it as a shared package with the middleware and enrichers built in, so the right thing is the default. Then I add a lint or code-review check so drift is caught early rather than discovered during an incident.",
            ar: "أنشر معياراً صغيراً للتسجيل: أسماء fields متفق عليها (CorrelationId و UserId و TenantId)، وحقول مطلوبة لكل نوع حدث، وقواعد بخصوص الأسرار. أشحنه كـ package مشترك فيه الـ middleware والـ enrichers جاهزة، فيصبح الصواب هو الافتراضي. ثم أضيف فحص lint أو code review حتى يُلتقط الانحراف مبكراً بدل اكتشافه أثناء حادثة." } }
      ]
    },
    {
      key: "codereview",
      blocks: [
        { t: "review", severity: "high",
          title: { en: "Secret concatenated into a log line", ar: "سر ملصوق داخل سطر log" },
          bad: "logger.LogInformation(\"Auth ok for \" + email + \" token \" + token);",
          good: "logger.LogInformation(\"Auth ok for {UserId}\", user.Id);",
          why: { en: "The bad line writes an email and a token into log storage, where anyone with log access can read them — a data leak. It also has no searchable field. Log a stable id, never the secret, and never build the message by concatenation.",
            ar: "السطر السيئ يكتب email و token في مخزن الـ logs، حيث يستطيع أي شخص لديه صلاحية قراءتهما — تسريب بيانات. كما أنه بلا field قابل للبحث. سجّل id ثابتاً، لا السر أبداً، ولا تبنِ الرسالة بالـ concatenation." } },
        { t: "review", severity: "medium",
          title: { en: "Losing the exception object", ar: "فقدان كائن الـ exception" },
          bad: "catch (Exception ex) {\n    logger.LogError(\"Save failed: \" + ex.Message);\n}",
          good: "catch (Exception ex) {\n    logger.LogError(ex, \"Save failed for {OrderId}\", order.Id);\n}",
          why: { en: "Passing only ex.Message throws away the stack trace, so you cannot see where the error came from. Pass the exception object as the first argument; the logger captures the full stack trace as structured data and adds your OrderId field.",
            ar: "تمرير ex.Message وحده يرمي الـ stack trace، فلا ترى من أين جاء الخطأ. مرّر كائن الـ exception كأول وسيط؛ يلتقط الـ logger الـ stack trace كاملاً كبيانات منظّمة ويضيف OrderId field." } }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        { t: "p",
          en: "In a real system, structured logging is one leg of observability, next to metrics and traces. The usual shape: apps write JSON events to standard output, a collector (like Fluent Bit or the OpenTelemetry Collector) picks them up, and they land in a search store such as Elasticsearch, Loki, or Seq where engineers query them.",
          ar: "في نظام حقيقي، التسجيل المنظّم أحد أرجل الـ observability، إلى جانب الـ metrics والـ traces. الشكل المعتاد: التطبيقات تكتب أحداث JSON إلى standard output، ويلتقطها collector (مثل Fluent Bit أو OpenTelemetry Collector)، وتصل إلى مخزن بحث مثل Elasticsearch أو Loki أو Seq حيث يستعلمها المهندسون." },
        { t: "ul",
          en: [
            "Write logs to stdout as JSON; let the platform handle shipping, so the app stays stateless.",
            "Set the correlation id in edge middleware and propagate it in a header to every downstream call.",
            "Sample or drop Debug/Trace in production to control cost, but never sample Error and Critical.",
            "Keep field names in a shared package so every service uses CorrelationId, not corrId or cid."
          ],
          ar: [
            "اكتب الـ logs إلى stdout كـ JSON؛ ودع المنصّة تتولّى الشحن، لتبقى الخدمة stateless.",
            "اضبط correlation id في edge middleware ومرّره في header إلى كل استدعاء لاحق.",
            "طبّق sampling أو أسقِط Debug/Trace في الإنتاج للتحكم بالتكلفة، لكن لا تُطبّق sampling على Error و Critical أبداً.",
            "أبقِ أسماء الـ fields في package مشترك حتى تستخدم كل خدمة CorrelationId، لا corrId أو cid."
          ]},
        { t: "callout", kind: "tip",
          en: "Correlate logs, metrics, and traces by sharing one id. If your log's CorrelationId matches your trace id, you can jump from a slow trace straight to its log lines.",
          ar: "اربط الـ logs والـ metrics والـ traces بمشاركة id واحد. إذا طابق CorrelationId في الـ log الـ trace id، تستطيع القفز من trace بطيء مباشرة إلى أسطر log الخاصة به." }
      ]
    },
    {
      key: "perf",
      blocks: [
        { t: "kv", rows: [
          { k: { en: "CPU", ar: "CPU" }, v: { en: "Serializing to JSON costs more than writing a string. Skip work with guards for hot Debug logs.", ar: "التحويل إلى JSON يكلّف أكثر من كتابة نص. تجنّب العمل بحواجز للـ Debug logs الساخنة." } },
          { k: { en: "Memory", ar: "الذاكرة" }, v: { en: "Building field dictionaries allocates. High-throughput paths should use source-generated logging to cut allocations.", ar: "بناء قواميس الـ fields يخصّص ذاكرة. المسارات عالية الإنتاجية ينبغي أن تستخدم source-generated logging لتقليل التخصيص." } },
          { k: { en: "Network", ar: "الشبكة" }, v: { en: "JSON is bigger than plain text, so shipping logs uses more bandwidth to the collector.", ar: "الـ JSON أكبر من النص العادي، فشحن الـ logs يستهلك bandwidth أكبر نحو الـ collector." } },
          { k: { en: "Storage", ar: "التخزين" }, v: { en: "Indexed fields cost disk. High-cardinality fields like OrderId inflate the index the most.", ar: "الـ fields المفهرسة تكلّف قرصاً. الـ fields عالية الـ cardinality مثل OrderId تضخّم الـ index أكثر." } },
          { k: { en: "Latency", ar: "الـ latency" }, v: { en: "Logging should be non-blocking; a slow or full sink must never stall the request thread.", ar: "التسجيل يجب أن يكون non-blocking؛ الـ sink البطيء أو الممتلئ يجب ألّا يوقف thread الـ request أبداً." } }
        ]}
      ]
    },
    {
      key: "debug",
      blocks: [
        { t: "ul",
          en: [
            "Query the log store by CorrelationId — look for a missing step or an Error line to see where a request broke.",
            "Filter by level = Error over the last hour — look for a spike that lines up with a deploy.",
            "Group by a field like StatusCode — look for one value suddenly dominating.",
            "Check the exception field's stack trace — look for the exact file and line that threw.",
            "Watch the collector's own metrics — look for dropped events, which mean logs are silently lost."
          ],
          ar: [
            "استعلم مخزن الـ logs بـ CorrelationId — ابحث عن خطوة ناقصة أو سطر Error لترى أين انكسر الـ request.",
            "فلتر بـ level = Error خلال الساعة الأخيرة — ابحث عن قفزة تتزامن مع deploy.",
            "جمّع حسب field مثل StatusCode — ابحث عن قيمة واحدة تهيمن فجأة.",
            "افحص الـ stack trace في field الـ exception — ابحث عن الملف والسطر الذي رمى بالضبط.",
            "راقب metrics الـ collector نفسه — ابحث عن أحداث مسقطة، فهي تعني ضياع logs بصمت."
          ]},
        { t: "callout", kind: "tip",
          en: "When a log line is missing, check the level filter first. The most common cause of \"the log isn't there\" is that the event was written at Debug while production only keeps Information and above.",
          ar: "عندما يغيب سطر log، افحص فلتر الـ level أولاً. أشيع سبب لـ \"الـ log غير موجود\" هو أن الحدث كُتب عند Debug بينما الإنتاج يحفظ Information فما فوق فقط." }
      ]
    },
    {
      key: "realworld",
      blocks: [
        { t: "p",
          en: "Any system where a single user action touches several services relies on structured logs to reconstruct what happened. The correlation id is the thread that stitches the lines back into one story during an incident.",
          ar: "أي نظام يلمس فيه إجراء مستخدم واحد عدة خدمات يعتمد على الـ logs المنظّمة لإعادة بناء ما حدث. الـ correlation id هو الخيط الذي يعيد ربط الأسطر في قصة واحدة أثناء أي حادثة." },
        { t: "ul",
          en: [
            "Payment systems: trace one charge through fraud checks, the gateway, and the ledger by its correlation id.",
            "E-commerce: follow an order from cart to warehouse across order, inventory, and shipping services.",
            "Chat platforms: find why one message failed to deliver among millions by filtering on message id.",
            "Multi-tenant SaaS: filter by TenantId to isolate one customer's errors without noise from others."
          ],
          ar: [
            "أنظمة الدفع: تتبّع عملية دفع واحدة عبر فحوص الاحتيال والـ gateway والـ ledger بواسطة correlation id.",
            "التجارة الإلكترونية: تابع طلباً من السلة إلى المستودع عبر خدمات الـ order والـ inventory والشحن.",
            "منصّات المحادثة: اعرف لماذا فشل تسليم رسالة واحدة بين الملايين بالفلترة على message id.",
            "الـ SaaS متعدد المستأجرين: افلتر بـ TenantId لعزل أخطاء عميل واحد دون ضجيج من الآخرين."
          ]}
      ]
    },
    {
      key: "exercises",
      blocks: [
        { t: "ex", diff: "easy",
          en: "Take a method that logs with string concatenation and rewrite it to use a message template with named holes. You are done when the rendered message is unchanged but the event now carries at least two named fields.",
          ar: "خذ method يسجّل بـ string concatenation وأعد كتابته ليستخدم message template بفراغات ذات أسماء. تكون قد أنجزت عندما تبقى الرسالة المعروضة كما هي بينما يحمل الحدث الآن field واحد على الأقل باثنين." },
        { t: "ex", diff: "medium",
          en: "Add middleware that generates a correlation id per request and opens a log scope with it. Prove it works by logging two lines in a controller and confirming both carry the same CorrelationId field.",
          ar: "أضف middleware يولّد correlation id لكل request ويفتح log scope به. أثبت أنه يعمل بتسجيل سطرين في controller والتأكد أن كليهما يحمل نفس CorrelationId field." },
        { t: "ex", diff: "hard",
          en: "Configure a JSON sink (Serilog or the built-in JSON console formatter) and ship logs to a local Seq or Elasticsearch instance. Prove it by querying OrderId = 4821 and getting only the matching lines back.",
          ar: "اضبط JSON sink (Serilog أو الـ JSON console formatter المدمج) واشحن الـ logs إلى نسخة محلية من Seq أو Elasticsearch. أثبت ذلك بالاستعلام عن OrderId = 4821 وإعادة الأسطر المطابقة فقط." },
        { t: "ex", diff: "senior",
          en: "Write a one-page logging standard for a team: required fields, level policy, secret rules, and a shared package plan. You are done when a new service can adopt it by installing one package and calling one setup method.",
          ar: "اكتب معياراً للتسجيل من صفحة واحدة لفريق: الحقول المطلوبة، سياسة الـ levels، قواعد الأسرار، وخطة package مشترك. تكون قد أنجزت عندما تستطيع خدمة جديدة تبنّيه بتثبيت package واحد واستدعاء setup method واحد." }
      ]
    },
    {
      key: "refs",
      blocks: [
        { t: "ref", label: { en: "Logging in .NET Core and ASP.NET Core", ar: "التسجيل في .NET Core و ASP.NET Core" },
          url: "https://learn.microsoft.com/en-us/aspnet/core/fundamentals/logging/",
          meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref", label: { en: "Serilog: structured data and message templates", ar: "Serilog: البيانات المنظّمة و message templates" },
          url: "https://github.com/serilog/serilog/wiki/Structured-Data",
          meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref", label: { en: "Message Templates specification", ar: "مواصفة Message Templates" },
          url: "https://messagetemplates.org/",
          meta: { en: "Spec", ar: "مواصفة" } },
        { t: "ref", label: { en: "The Twelve-Factor App: Logs", ar: "The Twelve-Factor App: الـ Logs" },
          url: "https://12factor.net/logs",
          meta: { en: "Article", ar: "مقال" } }
      ]
    }
  ],
  quiz: [
    {
      q: { en: "What makes a log \"structured\"?", ar: "ما الذي يجعل الـ log \"منظّماً\"؟" },
      options: [
        { en: "It is written to a file instead of the console.", ar: "يُكتب إلى ملف بدل الـ console." },
        { en: "Each event carries named fields you can query.", ar: "كل حدث يحمل fields ذات أسماء يمكن الاستعلام عنها." },
        { en: "It is colored by log level in the terminal.", ar: "يُلوَّن حسب log level في الطرفية." },
        { en: "It is compressed before storage.", ar: "يُضغَط قبل التخزين." }
      ],
      correct: 1,
      why: { en: "Structure means named fields (like OrderId=4821) attached to the event, which is what makes logs searchable and groupable.",
        ar: "التنظيم يعني fields ذات أسماء (مثل OrderId=4821) مرتبطة بالحدث، وهو ما يجعل الـ logs قابلة للبحث والتجميع." }
    },
    {
      q: { en: "Why prefer a message template over string interpolation?", ar: "لماذا نفضّل message template على string interpolation؟" },
      options: [
        { en: "Templates render faster in all cases.", ar: "الـ templates تُعرَض أسرع في كل الحالات." },
        { en: "Interpolation is not valid C#.", ar: "الـ interpolation ليس C# صالحاً." },
        { en: "Templates keep the value as a separate searchable field.", ar: "الـ templates تبقي القيمة field منفصلاً قابلاً للبحث." },
        { en: "Templates avoid using any memory.", ar: "الـ templates تتجنّب استخدام أي ذاكرة." }
      ],
      correct: 2,
      why: { en: "Interpolation bakes the value into the text before logging, destroying the field. A template keeps OrderId as data and keeps the message text stable across events.",
        ar: "الـ interpolation يدمج القيمة في النص قبل التسجيل فيفقد الـ field. الـ template يبقي OrderId كبيانات ويُبقي نص الرسالة ثابتاً عبر الأحداث." }
    },
    {
      q: { en: "What is a correlation id used for?", ar: "ما استخدام الـ correlation id؟" },
      options: [
        { en: "To encrypt the log contents.", ar: "لتشفير محتوى الـ log." },
        { en: "To set the log level automatically.", ar: "لضبط log level تلقائياً." },
        { en: "To join all log lines of one request across services.", ar: "لربط كل أسطر log الخاصة بـ request واحد عبر الخدمات." },
        { en: "To rotate log files daily.", ar: "لتدوير ملفات log يومياً." }
      ],
      correct: 2,
      why: { en: "One shared id per request lets you query it and see every line the request produced, even across multiple services, in order.",
        ar: "id واحد مشترك لكل request يتيح الاستعلام عنه ورؤية كل سطر أنتجه الـ request، حتى عبر عدة خدمات، بالترتيب." }
    },
    {
      q: { en: "Which field is risky to use as a metric label?", ar: "أي field يكون خطراً استخدامه كـ metric label؟" },
      options: [
        { en: "Log level (Information, Error).", ar: "log level (Information، Error)." },
        { en: "HTTP status code.", ar: "HTTP status code." },
        { en: "A unique OrderId.", ar: "OrderId فريد." },
        { en: "Environment name (prod, staging).", ar: "اسم البيئة (prod، staging)." }
      ],
      correct: 2,
      why: { en: "OrderId has very high cardinality: almost every value is unique. As a metric label it creates one time series per value and can crash the metrics backend. It is fine as a log field.",
        ar: "OrderId له cardinality عالٍ جداً: كل قيمة تقريباً فريدة. كـ metric label ينشئ time series لكل قيمة وقد يُسقط الـ metrics backend. لا بأس به كـ log field." }
    },
    {
      q: { en: "You log an error but pass only ex.Message. What is lost?", ar: "تسجّل خطأ لكنك تمرّر ex.Message فقط. ما الذي يُفقد؟" },
      options: [
        { en: "The correlation id.", ar: "الـ correlation id." },
        { en: "The stack trace showing where it was thrown.", ar: "الـ stack trace الذي يظهر أين رُمي الخطأ." },
        { en: "The log level.", ar: "الـ log level." },
        { en: "The timestamp.", ar: "الـ timestamp." }
      ],
      correct: 1,
      why: { en: "Passing the exception object as the first argument lets the logger capture the full stack trace as structured data. Passing only Message throws that away, so you cannot see where the error originated.",
        ar: "تمرير كائن الـ exception كأول وسيط يتيح للـ logger التقاط الـ stack trace كاملاً كبيانات منظّمة. تمرير Message وحده يرميه، فلا ترى من أين نشأ الخطأ." }
    }
  ]
};
```

NEXT: metrics
