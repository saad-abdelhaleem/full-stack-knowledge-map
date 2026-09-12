```js
const percentilesLesson = {
  id: "percentiles",
  moduleId: "performance",
  title: { en: "Percentiles, not averages", ar: "النسب المئوية لا المتوسطات" },
  summary: {
    en: "Why the average latency hides your slowest requests, and how p50/p95/p99 tell you what users actually feel.",
    ar: "لماذا يُخفي متوسط الـ latency أبطأ الـ requests لديك، وكيف تخبرك p50/p95/p99 بما يشعر به المستخدم فعلاً."
  },
  mins: 12,
  sections: [
    {
      key: "why",
      blocks: [
        { t: "p",
          en: "A percentile answers one question: what is the slowest value that a given share of requests stayed under? p99 latency of 3 seconds means 99% of requests finished in 3 seconds or less, and 1% were slower. It exists because the average latency, on its own, hides the requests that are hurting your users.",
          ar: "النسبة المئوية تجيب عن سؤال واحد: ما أبطأ قيمة بقي تحتها نصيب معيّن من الـ requests؟ p99 latency تساوي 3 ثوانٍ يعني أن 99% من الـ requests انتهت خلال 3 ثوانٍ أو أقل، و1% كانت أبطأ. توجد النسب المئوية لأن متوسط الـ latency وحده يُخفي الـ requests التي تؤذي مستخدميك." },
        { t: "kv", rows: [
          { k: { en: "latency", ar: "latency" }, v: { en: "how long one request took, from arrival to response.", ar: "المدة التي استغرقها request واحد، من وصوله حتى الرد." } },
          { k: { en: "average (mean)", ar: "المتوسط (mean)" }, v: { en: "sum of all values divided by their count; one number for the whole set.", ar: "مجموع كل القيم مقسوماً على عددها؛ رقم واحد للمجموعة كلها." } },
          { k: { en: "percentile", ar: "percentile" }, v: { en: "the value below which a given share of samples fall. p95 = 95% are at or under it.", ar: "القيمة التي يقع تحتها نصيب معيّن من العيّنات. p95 يعني أن 95% عندها أو أقل." } },
          { k: { en: "p50 / median", ar: "p50 / الوسيط" }, v: { en: "the middle value; half of requests are faster, half slower.", ar: "القيمة الوسطى؛ نصف الـ requests أسرع ونصفها أبطأ." } },
          { k: { en: "tail latency", ar: "tail latency" }, v: { en: "the slow end of the distribution — p95, p99 and beyond.", ar: "الطرف البطيء من التوزيع — p95 وp99 وما بعدهما." } },
          { k: { en: "SLO", ar: "SLO" }, v: { en: "Service Level Objective: a target you promise, e.g. 'p99 under 300ms'.", ar: "Service Level Objective: هدف تلتزم به، مثل «p99 أقل من 300ms»." } }
        ]},
        { t: "p",
          en: "Think of exam scores in a class of 100. If one student scores 100 and the rest score 40, the average is about 40.6 — it tells you almost nothing about the one who did well. Latency is the same: the average is pulled around by the crowd of fast requests and quietly buries the few slow ones. Percentiles line the requests up from fastest to slowest and let you point at a specific place in that line.",
          ar: "تخيّل درجات امتحان في صف من 100 طالب. إذا حصل طالب واحد على 100 والبقية على 40، فالمتوسط نحو 40.6 — ولا يخبرك تقريباً بشيء عن المتفوّق. الـ latency مثله: المتوسط تجرّه جموع الـ requests السريعة ويدفن بهدوء القليلة البطيئة. النسب المئوية تصفّ الـ requests من الأسرع إلى الأبطأ وتتيح لك الإشارة إلى مكان محدد في الصف." },
        { t: "callout", kind: "note",
          en: "One user's experience is one request, not the average of a million. If your p99 is bad, one in every hundred page loads is bad — and a user who loads ten pages will almost certainly hit it.",
          ar: "تجربة مستخدم واحد هي request واحد، لا متوسط مليون. إذا كان p99 سيئاً، فواحد من كل مئة تحميل للصفحة سيئ — والمستخدم الذي يفتح عشر صفحات سيصطدم به تقريباً بالتأكيد." }
      ]
    },
    {
      key: "problem",
      blocks: [
        { t: "p",
          en: "Take one minute of traffic on GET /orders: 1000 requests. 980 of them finished in 50ms. The other 20 took 3000ms (3 seconds) because they missed a cache and hit a slow database path. The average is (980×50 + 20×3000) ÷ 1000 = 109ms. That 109ms describes none of the requests — most were far faster, some far slower.",
          ar: "خذ دقيقة واحدة من الـ traffic على GET /orders: 1000 request. 980 منها انتهت خلال 50ms. أما الـ 20 الباقية فاستغرقت 3000ms (3 ثوانٍ) لأنها أخطأت الـ cache وسلكت مساراً بطيئاً في قاعدة البيانات. المتوسط هو (980×50 + 20×3000) ÷ 1000 = 109ms. هذا الـ 109ms لا يصف أي request — معظمها أسرع بكثير، وبعضها أبطأ بكثير." },
        { t: "kv", rows: [
          { k: { en: "average", ar: "المتوسط" }, v: { en: "109ms — looks healthy, so nobody investigates.", ar: "109ms — يبدو سليماً، فلا يحقّق أحد." } },
          { k: { en: "p50 (median)", ar: "p50 (الوسيط)" }, v: { en: "50ms — the typical request is genuinely fast.", ar: "50ms — الـ request النموذجي سريع فعلاً." } },
          { k: { en: "p95", ar: "p95" }, v: { en: "50ms — even the 95th percentile misses the problem here.", ar: "50ms — حتى النسبة 95 تُفوّت المشكلة هنا." } },
          { k: { en: "p99", ar: "p99" }, v: { en: "3000ms — now the 2% of slow requests are visible.", ar: "3000ms — الآن تظهر الـ 2% البطيئة." } }
        ]},
        { t: "p",
          en: "The average and the median both said everything was fine. Only p99 surfaced the 20 users per thousand who waited 3 seconds. If those are checkout requests, that is real lost revenue that the average would have kept hidden for months.",
          ar: "قال المتوسط والوسيط كلاهما إن كل شيء بخير. وحده p99 أظهر الـ 20 مستخدماً من كل ألف الذين انتظروا 3 ثوانٍ. لو كانت هذه requests دفع، فهذا فقدان حقيقي للإيرادات كان المتوسط سيُبقيه مخفياً لأشهر." }
      ]
    },
    {
      key: "internals",
      blocks: [
        { t: "p",
          en: "Computing a percentile from raw data is simple: sort every measured value from smallest to largest, then pick the one at the position you want. For p99 of 1000 samples, you go to position 0.99 × 1000 = 990 in the sorted list and read the value there. Everything at or before that position is 'under p99'.",
          ar: "حساب النسبة المئوية من البيانات الخام بسيط: رتّب كل قيمة مقيسة من الأصغر إلى الأكبر، ثم اختر التي عند الموضع الذي تريده. لـ p99 من 1000 عيّنة، تذهب إلى الموضع 0.99 × 1000 = 990 في القائمة المرتّبة وتقرأ القيمة هناك. كل ما عند ذلك الموضع أو قبله يُعدّ «تحت p99»." },
        { t: "code", lang: "csharp",
          label: { en: "Exact percentile from a sorted array", ar: "نسبة مئوية دقيقة من مصفوفة مرتّبة" },
          code: "double Percentile(double[] samples, double p)\n{\n    var sorted = samples.OrderBy(x => x).ToArray();\n    // rank: position in the sorted list for percentile p (0..100)\n    int rank = (int)Math.Ceiling(p / 100.0 * sorted.Length) - 1;\n    rank = Math.Clamp(rank, 0, sorted.Length - 1);\n    return sorted[rank];\n}\n\n// p50 -> 50ms, p99 -> 3000ms for the /orders sample above" },
        { t: "p",
          en: "This is exact but costly at scale. To keep every raw sample you would store one number per request forever, and sorting millions of them per minute is expensive. So production systems approximate. They keep a histogram: a set of pre-defined latency buckets (0–10ms, 10–50ms, 50–100ms, and so on) and just count how many requests land in each bucket. To find p99 you walk the buckets from the fast end, adding up counts, until you have passed 99% of requests; the bucket you land in is your answer.",
          ar: "هذا دقيق لكنه مكلف على النطاق الكبير. للاحتفاظ بكل عيّنة خام ستخزّن رقماً لكل request إلى الأبد، وترتيب الملايين منها في الدقيقة مكلف. لذا تلجأ أنظمة الإنتاج إلى التقريب. تحتفظ بـ histogram: مجموعة buckets محدّدة مسبقاً للـ latency (0–10ms، 10–50ms، 50–100ms، وهكذا) وتعدّ فقط كم request يقع في كل bucket. لإيجاد p99 تمشي عبر الـ buckets من الطرف السريع، وتجمع الأعداد، حتى تتجاوز 99% من الـ requests؛ الـ bucket الذي تقف عنده هو جوابك." },
        { t: "kv", rows: [
          { k: { en: "sample", ar: "sample" }, v: { en: "one measured latency value for one request.", ar: "قيمة latency واحدة مقيسة لـ request واحد." } },
          { k: { en: "histogram", ar: "histogram" }, v: { en: "buckets of value ranges, each holding a count — cheap to store, approximate to read.", ar: "buckets من نطاقات القيم، كلٌّ يحمل عدداً — رخيص التخزين، تقريبي القراءة." } },
          { k: { en: "bucket boundaries", ar: "حدود الـ bucket" }, v: { en: "the edges you choose; the percentile is only as precise as the bucket width.", ar: "الحواف التي تختارها؛ دقة النسبة المئوية بقدر عرض الـ bucket." } },
          { k: { en: "t-digest / HdrHistogram", ar: "t-digest / HdrHistogram" }, v: { en: "data structures that keep percentiles accurate at the tail using little memory.", ar: "بنى بيانات تُبقي النسب المئوية دقيقة عند الـ tail باستخدام ذاكرة قليلة." } }
        ]},
        { t: "p",
          en: "The everyday version: instead of writing down every person's exact height, you put up shelves labelled by height range and hand each person to the right shelf. Counting shelves from the short end until you have passed 99 of 100 people tells you roughly how tall the 99th-shortest is. You lose the exact number but you spend almost no memory, and at the tail — where you care — narrow shelves keep the answer accurate.",
          ar: "النسخة اليومية: بدل تسجيل طول كل شخص بدقة، تضع رفوفاً معنونة بنطاق الطول وتوجّه كل شخص إلى الرفّ الصحيح. عدّ الرفوف من الطرف القصير حتى تتجاوز 99 من 100 شخص يخبرك تقريباً بطول التاسع والتسعين. تفقد الرقم الدقيق لكنك تنفق ذاكرة تكاد لا تُذكر، وعند الـ tail — حيث يهمّك الأمر — تُبقي الرفوف الضيّقة الجواب دقيقاً." }
      ]
    },
    {
      key: "tradeoffs",
      blocks: [
        { t: "tradeoff",
          pros: {
            en: ["Describes real user experience — one request, not a blended number.", "Exposes tail latency that averages erase.", "Directly maps to SLOs and alerting thresholds.", "Robust to outliers: a single 30s request barely moves p99."],
            ar: ["يصف تجربة مستخدم حقيقية — request واحد لا رقماً ممزوجاً.", "يكشف tail latency الذي تمحوه المتوسطات.", "يرتبط مباشرة بالـ SLOs وعتبات التنبيه.", "متين أمام القيم الشاذّة: request واحد بـ 30s بالكاد يحرّك p99."]
          },
          cons: {
            en: ["Can't be averaged or summed across sources — must be recomputed from raw data or histograms.", "Needs enough samples to be meaningful.", "Approximation adds error, worst at the extreme tail.", "One number still hides the shape of the distribution."],
            ar: ["لا يمكن حسابه كمتوسط ولا جمعه عبر المصادر — يجب إعادة حسابه من البيانات الخام أو الـ histograms.", "يحتاج عيّنات كافية ليكون ذا معنى.", "التقريب يضيف خطأً، أسوأه عند الـ tail المتطرّف.", "رقم واحد يظلّ يُخفي شكل التوزيع."]
          },
          limits: {
            en: ["p99 of 100 samples is basically one data point.", "Bucket width caps precision.", "Says nothing about why the tail is slow."],
            ar: ["p99 من 100 عيّنة هو عملياً نقطة بيانات واحدة.", "عرض الـ bucket يحدّ الدقة.", "لا يقول شيئاً عن سبب بطء الـ tail."]
          },
          alts: {
            en: ["Median plus p99 together for a quick shape.", "Full histogram / heatmap when you need the whole picture.", "Max for hard real-time deadlines."],
            ar: ["الوسيط مع p99 معاً لصورة سريعة عن الشكل.", "histogram / heatmap كامل عند الحاجة للصورة كاملة.", "القيمة القصوى للمواعيد النهائية الصارمة في الزمن الحقيقي."]
          }
        }
      ]
    },
    {
      key: "mistakes",
      blocks: [
        { t: "mistake",
          title: { en: "Averaging percentiles across servers", ar: "حساب متوسط النسب المئوية عبر الخوادم" },
          body: {
            en: "A dashboard showed p99 per server, then averaged the three p99 values into a 'fleet p99'. That number is meaningless: the average of three p99s is not the p99 of the combined traffic. During an incident it read 400ms while the real combined p99 was 1.8s, so nobody escalated.",
            ar: "أظهرت لوحة p99 لكل خادم، ثم حسبت متوسط قيم p99 الثلاث كـ «p99 للأسطول». هذا الرقم بلا معنى: متوسط ثلاث p99 ليس p99 للـ traffic المجمّع. أثناء حادثة عرض 400ms بينما كان p99 المجمّع الحقيقي 1.8s، فلم يُصعّد أحد الأمر."
          },
          fix: "// wrong: avg(p99_a, p99_b, p99_c)\n// right: merge the per-server histograms, then read p99 once\nvar merged = histA.Merge(histB).Merge(histC);\nvar fleetP99 = merged.GetValueAtPercentile(99);" },
        { t: "mistake",
          title: { en: "Alerting on the average", ar: "التنبيه بناءً على المتوسط" },
          body: {
            en: "An alert fired only when average latency crossed 500ms. The average never crossed it, even as p99 climbed from 300ms to 4s over a week, because the flood of fast requests kept the mean down. Users complained before the alert ever fired.",
            ar: "كان التنبيه يُطلَق فقط عندما يتجاوز متوسط الـ latency الـ 500ms. لم يتجاوزه المتوسط قطّ، حتى بينما تسلّق p99 من 300ms إلى 4s خلال أسبوع، لأن فيضان الـ requests السريعة أبقى المتوسط منخفضاً. اشتكى المستخدمون قبل أن يُطلَق التنبيه أصلاً."
          } },
        { t: "mistake",
          title: { en: "Too few samples for the percentile you quote", ar: "عيّنات قليلة جداً للنسبة التي تذكرها" },
          body: {
            en: "A low-traffic endpoint got 80 requests an hour, and the team reported its p99. With 80 samples, p99 is decided by the single slowest request — pure noise that swung between 200ms and 9s hour to hour, triggering false alerts.",
            ar: "endpoint منخفض الـ traffic تلقّى 80 request في الساعة، وأبلغ الفريق عن p99 له. مع 80 عيّنة، تحدّد p99 request واحد هو الأبطأ — ضوضاء خالصة تأرجحت بين 200ms و9s من ساعة لأخرى، فأطلقت تنبيهات كاذبة."
          } },
        { t: "mistake",
          title: { en: "Stopping at p99 when p99.9 is the real story", ar: "التوقّف عند p99 بينما p99.9 هي القصّة الحقيقية" },
          body: {
            en: "A service met its p99 SLO of 200ms comfortably. But p99.9 was 12 seconds: 1 request in 1000 timed out. On an endpoint doing 10 million requests a day, that is 10,000 failures daily — invisible at p99, obvious to the users hitting them.",
            ar: "خدمة حقّقت SLO لـ p99 عند 200ms بأريحية. لكن p99.9 كانت 12 ثانية: request واحد من كل 1000 انتهت مهلته. على endpoint ينفّذ 10 ملايين request يومياً، هذا 10,000 فشل يومياً — غير مرئي عند p99، وواضح للمستخدمين الذين يصطدمون به."
          } }
      ]
    },
    {
      key: "interview",
      blocks: [
        { t: "qa", level: "junior",
          q: { en: "What does p99 latency mean?", ar: "ماذا تعني p99 latency؟" },
          a: {
            en: "It means 99% of requests finished at or below that value, and the slowest 1% were above it. So a p99 of 300ms says: nearly all requests were 300ms or faster, but one in a hundred was slower.",
            ar: "تعني أن 99% من الـ requests انتهت عند تلك القيمة أو أقل، وأن أبطأ 1% كانت فوقها. فـ p99 يساوي 300ms يقول: شبه كل الـ requests كانت 300ms أو أسرع، لكن واحداً من كل مئة كان أبطأ."
          } },
        { t: "qa", level: "mid",
          q: { en: "Why not just track the average?", ar: "لماذا لا نتتبّع المتوسط فقط؟" },
          a: {
            en: "Because the average blends everything into one number and a large crowd of fast requests hides a small number of very slow ones. If 98% take 50ms and 2% take 3s, the average is around 100ms and looks fine, but 2 in 100 users had a terrible experience. Percentiles let me see that tail.",
            ar: "لأن المتوسط يمزج كل شيء في رقم واحد، وجمعٌ كبير من الـ requests السريعة يُخفي عدداً صغيراً من البطيئة جداً. إذا أخذت 98% مقدار 50ms و2% مقدار 3s، فالمتوسط نحو 100ms ويبدو جيداً، لكن 2 من كل 100 مستخدم عاشوا تجربة سيّئة. النسب المئوية تجعلني أرى هذا الـ tail."
          } },
        { t: "qa", level: "mid",
          q: { en: "Can you average two servers' p99s to get the overall p99?", ar: "هل يمكن حساب متوسط p99 لخادمين للحصول على p99 الكلّي؟" },
          a: {
            en: "No. Percentiles don't add or average. If one server serves 10 requests and another serves a million, averaging their p99s ignores that. The correct way is to combine the raw samples, or merge the histograms, and compute the percentile once over the whole set.",
            ar: "لا. النسب المئوية لا تُجمع ولا يُحسب متوسطها. إذا خدم خادم 10 requests وآخر مليوناً، فحساب متوسط p99 لهما يتجاهل ذلك. الطريقة الصحيحة هي دمج العيّنات الخام، أو دمج الـ histograms، وحساب النسبة المئوية مرة واحدة على المجموعة كلها."
          } },
        { t: "qa", level: "senior",
          q: { en: "How do percentiles behave across a chain of service calls?", ar: "كيف تتصرّف النسب المئوية عبر سلسلة من استدعاءات الخدمات؟" },
          a: {
            en: "Tail latency compounds. If one request fans out to 10 backends and each has a p99 of 100ms, the chance that at least one of the 10 hits its slow tail is high, so the overall request's p99 is much worse than 100ms. This is why a page made of many calls feels slow even when each service looks fine on its own.",
            ar: "الـ tail latency يتراكم. إذا تفرّع request إلى 10 backends ولكلٍّ p99 يساوي 100ms، فاحتمال أن يصطدم واحد على الأقل من الـ 10 بذيله البطيء عالٍ، فيصير p99 للـ request الكلّي أسوأ بكثير من 100ms. لهذا تبدو الصفحة المكوّنة من استدعاءات كثيرة بطيئة رغم أن كل خدمة تبدو سليمة وحدها."
          } },
        { t: "qa", level: "senior",
          q: { en: "How many samples do you need before p99 is trustworthy?", ar: "كم عيّنة تحتاج قبل أن تثق بـ p99؟" },
          a: {
            en: "Enough that the tail isn't decided by one or two points. p99 means 1 in 100, so with 100 samples it's a single request — pure noise. I'd want thousands of samples in the window, or I'd aggregate over a longer time window, or drop to a lower percentile I can actually support with the traffic I have.",
            ar: "ما يكفي كي لا تُحدَّد النهاية بنقطة أو نقطتين. p99 يعني 1 من 100، فمع 100 عيّنة يكون request واحداً — ضوضاء خالصة. أريد آلاف العيّنات في النافذة، أو أجمع عبر نافذة زمنية أطول، أو أنزل إلى نسبة أدنى أستطيع دعمها فعلاً بالـ traffic المتاح."
          } },
        { t: "qa", level: "staff",
          q: { en: "A team keeps arguing about latency because everyone quotes a different number. How do you fix it organizationally?", ar: "فريق يتجادل دوماً حول الـ latency لأن كلاً يذكر رقماً مختلفاً. كيف تصلح ذلك تنظيمياً؟" },
          a: {
            en: "Agree on one definition and put it in writing: which percentile, measured where, over what window, and what the SLO is. Standardize on histograms so numbers can be merged correctly, and make dashboards and alerts read from that single source. The goal is that 'latency' means the same thing to on-call, product, and leadership, so debates are about the system, not about whose metric is right.",
            ar: "اتّفقوا على تعريف واحد واكتبوه: أي نسبة مئوية، تُقاس أين، عبر أي نافذة، وما الـ SLO. وحّدوا على الـ histograms كي تُدمج الأرقام بشكل صحيح، واجعلوا اللوحات والتنبيهات تقرأ من هذا المصدر الواحد. الهدف أن تعني كلمة «latency» الشيء نفسه للـ on-call وللمنتج وللإدارة، فتصير النقاشات حول النظام لا حول رقم مَن هو الصحيح."
          } }
      ]
    },
    {
      key: "codereview",
      blocks: [
        { t: "review", severity: "high",
          title: { en: "Reporting an average latency metric", ar: "الإبلاغ عن مقياس متوسط للـ latency" },
          bad: "// records only a running average\n_avgLatency = (_avgLatency * _count + elapsedMs) / (_count + 1);\n_count++;\nmetrics.Gauge(\"orders.latency.avg\", _avgLatency);",
          good: "// record every sample into a histogram; read percentiles at query time\n_histogram.Record(elapsedMs);\n// dashboard/alert then asks for p50, p95, p99 from the histogram",
          why: {
            en: "The average can never be turned back into a percentile — the information is gone the moment you collapse samples into a mean. Recording into a histogram keeps the shape, so any percentile can be read later and merged across instances.",
            ar: "المتوسط لا يمكن تحويله ثانيةً إلى نسبة مئوية — تختفي المعلومة لحظة ضغطك العيّنات في متوسط. التسجيل في histogram يحفظ الشكل، فتُقرأ أي نسبة مئوية لاحقاً وتُدمج عبر النسخ."
          } },
        { t: "review", severity: "medium",
          title: { en: "Percentile computed per request instead of over a window", ar: "نسبة مئوية تُحسب لكل request بدل نافذة زمنية" },
          bad: "// resets the sample set every request — p99 is meaningless\nvar samples = new List<double> { elapsedMs };\nvar p99 = Percentile(samples, 99); // always == elapsedMs",
          good: "// accumulate over a fixed window (e.g. 1 minute), then report\n_window.Add(elapsedMs);\n// a background flush reads p99 from the whole window and clears it",
          why: {
            en: "A percentile only means something over a set of samples. Computed on one request it just returns that request's own value. Percentiles must be taken over a time window with many samples in it.",
            ar: "النسبة المئوية لا تعني شيئاً إلا فوق مجموعة عيّنات. محسوبةً على request واحد تُعيد قيمة ذلك الـ request نفسه. يجب أخذ النسب المئوية عبر نافذة زمنية تحوي عيّنات كثيرة."
          } }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        { t: "p",
          en: "Percentiles are the language of Service Level Objectives (SLOs) — the latency targets a team promises. An SLO like 'p99 of GET /orders under 300ms, measured over 5-minute windows' is precise: it names the percentile, the endpoint, the threshold, and the window. Alerts and error budgets are then defined against that one statement.",
          ar: "النسب المئوية هي لغة الـ Service Level Objectives (SLOs) — أهداف الـ latency التي يلتزم بها الفريق. SLO مثل «p99 لـ GET /orders أقل من 300ms، مقيساً عبر نوافذ من 5 دقائق» دقيق: يسمّي النسبة والـ endpoint والعتبة والنافذة. ثم تُعرَّف التنبيهات وميزانيات الأخطاء مقابل هذه العبارة الواحدة." },
        { t: "ul",
          en: ["Instrument each service to record latency into a histogram, not an average.", "Aggregate histograms centrally (Prometheus, OpenTelemetry) so percentiles merge correctly.", "Set alerts on a percentile crossing the SLO, not on the mean.", "Track p99.9 as well as p99 on high-volume endpoints, where 0.1% is still many requests."],
          ar: ["زوّد كل خدمة بتسجيل الـ latency في histogram لا في متوسط.", "اجمع الـ histograms مركزياً (Prometheus، OpenTelemetry) كي تُدمج النسب المئوية بشكل صحيح.", "اضبط التنبيهات على تجاوز نسبة مئوية للـ SLO، لا على المتوسط.", "تتبّع p99.9 مع p99 على الـ endpoints عالية الحجم، حيث تظلّ 0.1% requests كثيرة."] }
      ]
    },
    {
      key: "perf",
      blocks: [
        { t: "kv", rows: [
          { k: { en: "Memory", ar: "الذاكرة" }, v: { en: "Histograms use fixed, tiny memory regardless of request count; storing raw samples grows without bound.", ar: "الـ histograms تستخدم ذاكرة ثابتة ضئيلة بغضّ النظر عن عدد الـ requests؛ تخزين العيّنات الخام ينمو بلا حدّ." } },
          { k: { en: "CPU", ar: "المعالج" }, v: { en: "Recording a sample into a histogram is O(1); sorting raw samples for an exact percentile is O(n log n).", ar: "تسجيل عيّنة في histogram هو O(1)؛ ترتيب العيّنات الخام لنسبة دقيقة هو O(n log n)." } },
          { k: { en: "Latency", ar: "الـ latency" }, v: { en: "Tail percentiles are what users feel; optimizing the mean can leave the tail untouched.", ar: "نسب الـ tail هي ما يشعر به المستخدمون؛ تحسين المتوسط قد يترك الـ tail كما هو." } },
          { k: { en: "Scalability", ar: "قابلية التوسّع" }, v: { en: "Tail latency compounds across fan-out; more downstream calls means a worse combined p99.", ar: "الـ tail latency يتراكم عبر التفرّع؛ استدعاءات downstream أكثر تعني p99 مجمّعاً أسوأ." } }
        ]}
      ]
    },
    {
      key: "debug",
      blocks: [
        { t: "ul",
          en: ["A latency histogram/heatmap (Grafana): look for a second band high up — that band is your tail.", "PromQL histogram_quantile(0.99, ...): read p99 straight from bucketed data instead of guessing.", "Compare p50 vs p99 on one chart: a wide gap means a few requests are far slower than typical.", "Group percentiles by route/status/host: find the one endpoint or node dragging the tail.", "Distributed traces filtered to slow requests: open an actual p99 request and see which span ate the time."],
          ar: ["histogram/heatmap للـ latency (Grafana): ابحث عن شريط ثانٍ في الأعلى — ذلك الشريط هو الـ tail.", "PromQL histogram_quantile(0.99, ...): اقرأ p99 مباشرة من البيانات المُبوّبة بدل التخمين.", "قارن p50 بـ p99 في مخطط واحد: الفجوة الواسعة تعني أن قليلاً من الـ requests أبطأ بكثير من المعتاد.", "جمّع النسب المئوية حسب route/status/host: اعثر على الـ endpoint أو العقدة التي تجرّ الـ tail.", "traces موزّعة مُرشّحة على الـ requests البطيئة: افتح request فعلياً عند p99 وشاهد أي span التهم الوقت."] },
        { t: "callout", kind: "tip",
          en: "When p50 is flat but p99 climbs, you are not slower overall — a specific subset of requests got slow. Segment by route, customer, or cache-hit vs miss to find that subset.",
          ar: "عندما يبقى p50 ثابتاً ويتسلّق p99، فأنت لست أبطأ إجمالاً — بل صارت مجموعة محدّدة من الـ requests بطيئة. قسّم حسب route أو العميل أو cache-hit مقابل miss لتجد تلك المجموعة." }
      ]
    },
    {
      key: "realworld",
      blocks: [
        { t: "p",
          en: "Any system where one slow request means one unhappy user lives and dies by tail latency, not the average. The pattern is always the same: most requests are fast, and the value of the service is decided by how bad the slow ones get.",
          ar: "أي نظام يعني فيه request بطيء واحدٌ مستخدماً غير راضٍ يحيا ويموت بالـ tail latency لا بالمتوسط. النمط دائماً هو نفسه: معظم الـ requests سريعة، وقيمة الخدمة تحدّدها مدى سوء البطيئة منها." },
        { t: "ul",
          en: ["E-commerce checkout: a 3s tail at the payment step directly loses sales, invisible in the average.", "Search and autocomplete: a slow p99 makes the feature feel broken even if p50 is instant.", "Ad and bidding platforms: requests past a hard deadline are simply dropped, so the tail is revenue.", "Multiplayer games and trading: the worst-case response, not the typical one, defines whether the system is usable."],
          ar: ["دفع التجارة الإلكترونية: tail بـ 3s عند خطوة الدفع يفقد مبيعات مباشرة، وهو غير مرئي في المتوسط.", "البحث والإكمال التلقائي: p99 بطيء يجعل الميزة تبدو معطّلة حتى لو كان p50 فورياً.", "منصّات الإعلانات والمزايدة: الـ requests بعد موعد نهائي صارم تُسقَط ببساطة، فالـ tail هو الإيراد.", "الألعاب متعدّدة اللاعبين والتداول: أسوأ استجابة، لا النموذجية، تحدّد صلاحية النظام للاستخدام."] }
      ]
    },
    {
      key: "exercises",
      blocks: [
        { t: "ex", diff: "easy",
          en: "Take this list of 10 latencies (ms): 20, 22, 25, 25, 30, 31, 33, 40, 55, 900. Compute the average and the p50 by hand, and write one sentence explaining why they differ.",
          ar: "خذ قائمة الـ 10 latencies (بالـ ms): 20، 22، 25، 25، 30، 31، 33، 40، 55، 900. احسب المتوسط وp50 يدوياً، واكتب جملة واحدة تشرح سبب اختلافهما." },
        { t: "ex", diff: "medium",
          en: "Instrument one endpoint to record latency into a histogram (e.g. System.Diagnostics.Metrics or Prometheus client). Load-test it so 5% of requests are artificially slowed, then confirm the average stays low while p99 jumps.",
          ar: "زوّد endpoint واحداً بتسجيل الـ latency في histogram (مثل System.Diagnostics.Metrics أو عميل Prometheus). اختبره بالحِمل بحيث تُبطَّأ 5% من الـ requests اصطناعياً، ثم تأكّد أن المتوسط يبقى منخفضاً بينما يقفز p99." },
        { t: "ex", diff: "hard",
          en: "Simulate a request that fans out to 5 downstream calls, each with a p99 of 100ms. Measure the p99 of the combined request and explain why it is well above 100ms.",
          ar: "حاكِ request يتفرّع إلى 5 استدعاءات downstream، لكلٍّ p99 يساوي 100ms. قِس p99 للـ request المجمّع واشرح لماذا هو أعلى بكثير من 100ms." },
        { t: "ex", diff: "senior",
          en: "Write a one-page SLO definition for a real endpoint: the exact percentile, measurement point, window, and target. Then design the alert and error budget that follow from it, and justify why you chose that percentile over another.",
          ar: "اكتب تعريف SLO من صفحة واحدة لـ endpoint حقيقي: النسبة المئوية الدقيقة، ونقطة القياس، والنافذة، والهدف. ثم صمّم التنبيه وميزانية الأخطاء المترتّبين عليه، وبرّر لماذا اخترت تلك النسبة دون غيرها." }
      ]
    },
    {
      key: "refs",
      blocks: [
        { t: "ref",
          label: { en: "Gil Tene — How NOT to Measure Latency", ar: "Gil Tene — كيف لا تقيس الـ latency" },
          url: "https://www.infoq.com/presentations/latency-response-time/",
          meta: { en: "Talk", ar: "محاضرة" } },
        { t: "ref",
          label: { en: "Google SRE Book — Service Level Objectives", ar: "كتاب Google SRE — أهداف مستوى الخدمة" },
          url: "https://sre.google/sre-book/service-level-objectives/",
          meta: { en: "Book", ar: "كتاب" } },
        { t: "ref",
          label: { en: "Prometheus — Histograms and summaries", ar: "Prometheus — الـ histograms والملخّصات" },
          url: "https://prometheus.io/docs/practices/histograms/",
          meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref",
          label: { en: "HdrHistogram — accurate latency recording", ar: "HdrHistogram — تسجيل دقيق للـ latency" },
          url: "https://github.com/HdrHistogram/HdrHistogram",
          meta: { en: "Library", ar: "مكتبة" } }
      ]
    }
  ],
  quiz: [
    {
      q: { en: "What does a p99 latency of 250ms tell you?", ar: "ماذا تخبرك p99 latency تساوي 250ms؟" },
      options: [
        { en: "The average request took 250ms.", ar: "الـ request المتوسط استغرق 250ms." },
        { en: "99% of requests finished in 250ms or less; the slowest 1% were slower.", ar: "99% من الـ requests انتهت خلال 250ms أو أقل؛ وأبطأ 1% كانت أبطأ." },
        { en: "The fastest request took 250ms.", ar: "أسرع request استغرق 250ms." },
        { en: "1% of requests finished in 250ms.", ar: "1% من الـ requests انتهت خلال 250ms." }
      ],
      correct: 1,
      why: {
        en: "p99 is the value 99% of requests stayed at or under; the remaining 1% is the slow tail above it.",
        ar: "p99 هي القيمة التي بقي 99% من الـ requests عندها أو تحتها؛ والـ 1% الباقية هي الـ tail البطيء فوقها."
      }
    },
    {
      q: { en: "Why can the average latency look healthy while users suffer?", ar: "لماذا قد يبدو متوسط الـ latency سليماً بينما يعاني المستخدمون؟" },
      options: [
        { en: "The average is always wrong.", ar: "المتوسط خاطئ دائماً." },
        { en: "A large crowd of fast requests pulls the mean down and hides a small number of very slow ones.", ar: "جمعٌ كبير من الـ requests السريعة يجرّ المتوسط للأسفل ويُخفي عدداً صغيراً من البطيئة جداً." },
        { en: "Averages only count failed requests.", ar: "المتوسطات تعدّ الـ requests الفاشلة فقط." },
        { en: "The average ignores the fastest requests.", ar: "المتوسط يتجاهل أسرع الـ requests." }
      ],
      correct: 1,
      why: {
        en: "The mean blends all requests together, so many fast ones can mask a few slow ones that users actually feel.",
        ar: "المتوسط يمزج كل الـ requests معاً، فيمكن لكثير من السريعة أن تُخفي قليلاً من البطيئة التي يشعر بها المستخدمون فعلاً."
      }
    },
    {
      q: { en: "You have p99 latency for three servers. How do you get the fleet-wide p99?", ar: "لديك p99 لثلاثة خوادم. كيف تحصل على p99 للأسطول كلّه؟" },
      options: [
        { en: "Average the three p99 values.", ar: "احسب متوسط قيم p99 الثلاث." },
        { en: "Take the maximum of the three.", ar: "خذ القيمة القصوى من الثلاث." },
        { en: "Merge the raw samples or histograms, then compute p99 once over the whole set.", ar: "ادمج العيّنات الخام أو الـ histograms، ثم احسب p99 مرة واحدة على المجموعة كلها." },
        { en: "Add the three p99 values together.", ar: "اجمع قيم p99 الثلاث معاً." }
      ],
      correct: 2,
      why: {
        en: "Percentiles cannot be averaged or summed. Only the combined data (or merged histograms) yields a correct fleet percentile.",
        ar: "النسب المئوية لا يُحسب متوسطها ولا تُجمع. وحدها البيانات المجمّعة (أو الـ histograms المدموجة) تعطي نسبة صحيحة للأسطول."
      }
    },
    {
      q: { en: "Why do production systems use histograms instead of storing every raw sample?", ar: "لماذا تستخدم أنظمة الإنتاج الـ histograms بدل تخزين كل عيّنة خام؟" },
      options: [
        { en: "Histograms give exact percentiles with no error.", ar: "الـ histograms تعطي نسباً دقيقة بلا خطأ." },
        { en: "They use fixed, small memory and let percentiles be merged across sources, at the cost of some approximation.", ar: "تستخدم ذاكرة ثابتة صغيرة وتتيح دمج النسب عبر المصادر، مقابل بعض التقريب." },
        { en: "Raw samples cannot be sorted.", ar: "العيّنات الخام لا يمكن ترتيبها." },
        { en: "Histograms record only the average.", ar: "الـ histograms تسجّل المتوسط فقط." }
      ],
      correct: 1,
      why: {
        en: "A histogram keeps bounded memory and merges correctly across instances; the trade-off is bucket-width approximation, worst at the extreme tail.",
        ar: "الـ histogram يُبقي الذاكرة محدودة ويُدمج بشكل صحيح عبر النسخ؛ والمقابل هو تقريب بعرض الـ bucket، أسوأه عند الـ tail المتطرّف."
      }
    },
    {
      q: { en: "A request fans out to 10 backends, each with p99 = 100ms. What is true of the combined request?", ar: "request يتفرّع إلى 10 backends، لكلٍّ p99 = 100ms. ما الصحيح عن الـ request المجمّع؟" },
      options: [
        { en: "Its p99 is also 100ms.", ar: "p99 له أيضاً 100ms." },
        { en: "Its p99 is 10ms.", ar: "p99 له 10ms." },
        { en: "Its p99 is much worse than 100ms, because one of the 10 is likely to hit its slow tail.", ar: "p99 له أسوأ بكثير من 100ms، لأن أحد الـ 10 من المرجّح أن يصطدم بذيله البطيء." },
        { en: "The percentiles cancel out to the average.", ar: "النسب المئوية تتلاشى إلى المتوسط." }
      ],
      correct: 2,
      why: {
        en: "Tail latency compounds across fan-out: the more parallel calls, the higher the chance at least one is slow, so the combined p99 rises well above any single call's p99.",
        ar: "الـ tail latency يتراكم عبر التفرّع: كلما زادت الاستدعاءات المتوازية، ارتفع احتمال أن يكون واحد على الأقل بطيئاً، فيرتفع p99 المجمّع فوق p99 أي استدعاء منفرد."
      }
    }
  ]
};
```

NEXT: cache-layers
