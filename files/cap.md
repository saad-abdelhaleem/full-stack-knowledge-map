```js
const capLesson = {
  id: "cap",
  moduleId: "distributed",
  title: { en: "CAP in practice", ar: "CAP عملياً" },
  summary: {
    en: "What CAP really forces you to choose, why the choice only appears during a network partition, and how PACELC describes the normal-day trade-off.",
    ar: "ما الذي يجبرك CAP على اختياره فعلاً، ولماذا يظهر الاختيار فقط أثناء الـ partition، وكيف يصف PACELC المقايضة في الأيام العادية."
  },
  mins: 17,
  sections: [
    {
      key: "why",
      blocks: [
        { t: "p",
          en: "CAP says that when two parts of a distributed system cannot talk to each other, you must give up either consistency or availability — you cannot keep both. A distributed system is one program running as several copies on different machines. When the network link between those copies breaks, each copy is stuck with only the data it can see.",
          ar: "يقول CAP إنه عندما لا يستطيع جزآن من نظام موزّع التواصل، يجب أن تتخلّى عن consistency أو availability — لا يمكنك الإبقاء على الاثنين. النظام الموزّع هو برنامج واحد يعمل كنسخ عدّة على أجهزة مختلفة. وعندما ينقطع الرابط الشبكي بين هذه النسخ، تعلق كل نسخة بالبيانات التي تراها فقط." },
        { t: "kv", rows: [
          { k: { en: "Consistency (C)", ar: "Consistency (C)" }, v: { en: "Every read returns the most recent write, or an error — never stale data.", ar: "كل read يعيد أحدث write، أو خطأ — لا بيانات قديمة أبداً." } },
          { k: { en: "Availability (A)", ar: "Availability (A)" }, v: { en: "Every request gets a non-error answer, even if the data might be stale.", ar: "كل request يحصل على إجابة غير خاطئة، حتى لو كانت البيانات قديمة." } },
          { k: { en: "Partition (P)", ar: "Partition (P)" }, v: { en: "The network drops messages between nodes, so they cannot reach each other.", ar: "الشبكة تُسقِط الرسائل بين الـ nodes فلا تصل إلى بعضها." } },
          { k: { en: "Node / replica", ar: "Node / replica" }, v: { en: "One machine holding a copy of the data.", ar: "جهاز واحد يحمل نسخة من البيانات." } },
          { k: { en: "CAP theorem", ar: "CAP theorem" }, v: { en: "During a partition you can be consistent or available, not both.", ar: "أثناء الـ partition يمكنك أن تكون consistent أو available، لا الاثنين." } },
          { k: { en: "PACELC", ar: "PACELC" }, v: { en: "An extension: with a Partition choose A or C; Else (normal) choose Latency or Consistency.", ar: "امتداد: مع Partition اختر A أو C؛ وإلّا (عادياً) اختر Latency أو Consistency." } }
        ]},
        { t: "p",
          en: "Picture two shop tills that normally phone each other after every sale so both know the stock count. One day the phone line dies. A customer at till B wants the last item. Till B cannot check with till A. It has two choices: refuse to sell until the line is back (stay consistent), or sell anyway and risk selling an item that till A already sold (stay available). That refusal-or-risk is exactly the CAP choice.",
          ar: "تخيّل صندوقَي دفع في متجر يتصلان هاتفياً بعد كل عملية بيع ليعرف كلاهما عدد المخزون. في يوم ما ينقطع الخط الهاتفي. زبون عند الصندوق B يريد آخر قطعة. لا يستطيع B التحقق من A. أمامه خياران: يرفض البيع حتى يعود الخط (يبقى consistent)، أو يبيع رغم ذلك ويخاطر ببيع قطعة باعها A بالفعل (يبقى available). هذا الرفض-أو-المخاطرة هو بالضبط اختيار CAP." },
        { t: "callout", kind: "note",
          en: "Partition tolerance is not a choice you make — packet loss and dead links happen in any real network. So the real decision is only ever between C and A during that partition.",
          ar: "Partition tolerance ليست خياراً تتخذه — فقدان الحزم والروابط الميتة يحدثان في أي شبكة حقيقية. لذا القرار الحقيقي دائماً بين C و A أثناء الـ partition فقط." }
      ]
    },
    {
      key: "problem",
      blocks: [
        { t: "p",
          en: "Take a key-value store that holds one user's account balance on two replicas, one in data center DC1 and one in DC2. The value is 100. A network partition cuts the link between DC1 and DC2, but clients can still reach each side.",
          ar: "لنأخذ key-value store يحمل رصيد حساب مستخدم واحد على replica في مركز بيانات DC1 وأخرى في DC2. القيمة 100. يقطع partition الرابط بين DC1 و DC2، لكن العملاء ما زالوا يصلون إلى كل جانب." },
        { t: "p",
          en: "A write of 150 arrives at DC1. A read arrives at DC2 at the same moment. DC2 cannot ask DC1 what the newest value is. A consistent (CP) system makes DC2 reject the read — the client waits or gets an error, but never sees the wrong 100. An available (AP) system lets DC2 answer 100 immediately — fast, but wrong for now.",
          ar: "يصل write بقيمة 150 إلى DC1. ويصل read إلى DC2 في اللحظة نفسها. لا يستطيع DC2 أن يسأل DC1 عن أحدث قيمة. النظام الـ consistent (CP) يجعل DC2 يرفض الـ read — ينتظر العميل أو يحصل على خطأ، لكنه لا يرى 100 الخاطئة أبداً. والنظام الـ available (AP) يدع DC2 يجيب بـ 100 فوراً — سريع، لكنه خاطئ الآن." },
        { t: "kv", rows: [
          { k: { en: "CP choice", ar: "خيار CP" }, v: { en: "Read on DC2 fails during the partition. 0 wrong answers, but some requests get nothing.", ar: "يفشل الـ read على DC2 أثناء الـ partition. صفر إجابات خاطئة، لكن بعض الطلبات لا تحصل على شيء." } },
          { k: { en: "AP choice", ar: "خيار AP" }, v: { en: "Read on DC2 returns 100 (stale) until the link heals. 100% answered, some answers wrong.", ar: "يعيد الـ read على DC2 القيمة 100 (قديمة) حتى يُشفى الرابط. 100% مُجابة، بعض الإجابات خاطئة." } }
        ]},
        { t: "p",
          en: "Neither is 'better' in the abstract. A bank balance usually wants CP — a wrong balance causes real loss. A 'likes' counter usually wants AP — a stale count for a few seconds harms no one, and downtime does.",
          ar: "لا واحد منهما 'أفضل' مجرّداً. رصيد بنكي عادةً يريد CP — رصيد خاطئ يسبب خسارة فعلية. وعدّاد 'likes' عادةً يريد AP — عدد قديم لبضع ثوانٍ لا يؤذي أحداً، بينما التوقّف يؤذي." }
      ]
    },
    {
      key: "internals",
      blocks: [
        { t: "p",
          en: "Under the hood, the system decides C-vs-A through how many replicas must confirm each read and write. This confirmation count is called a quorum — the minimum number of nodes that must agree before an operation is treated as done.",
          ar: "تحت الغطاء، يقرّر النظام C مقابل A عبر عدد الـ replicas التي يجب أن تؤكّد كل read و write. يُسمّى عدد التأكيد هذا quorum — الحد الأدنى من الـ nodes التي يجب أن تتفق قبل اعتبار العملية منجزة." },
        { t: "p",
          en: "With N replicas, a write waits for W of them to acknowledge, and a read asks R of them. If W + R > N, every read set overlaps every write set by at least one node, so a read always sees the newest write — that is strong consistency. The cost: if a partition leaves fewer than W nodes reachable, the write cannot reach quorum and must fail. That failure is the system choosing C over A.",
          ar: "مع N من الـ replicas، ينتظر الـ write تأكيد W منها، ويسأل الـ read عدد R منها. إذا كان W + R > N، فإن كل مجموعة read تتداخل مع كل مجموعة write بـ node واحد على الأقل، فيرى الـ read دائماً أحدث write — هذا strong consistency. الثمن: إذا ترك الـ partition عدداً أقل من W من الـ nodes قابلاً للوصول، لا يبلغ الـ write الـ quorum ويجب أن يفشل. هذا الفشل هو اختيار النظام لـ C على A." },
        { t: "code", lang: "text", label: { en: "Quorum with N=3", ar: "Quorum مع N=3" },
          code: "N = 3 replicas\nStrong (CP):  W = 2, R = 2   -> W + R = 4 > 3, reads see latest write\nFast   (AP):  W = 1, R = 1   -> W + R = 2 < 3, reads may be stale\n\nPartition isolates 1 of the 3 nodes:\n  CP config: the lone node cannot reach W=2, so it refuses writes\n  AP config: the lone node still accepts W=1 writes, reconciles later" },
        { t: "p",
          en: "PACELC finishes the picture. CAP only describes the rare partition. PACELC adds the common case: if there is a Partition, choose A or C; Else — when the network is healthy — you still choose between low Latency and Consistency, because waiting for more replicas to confirm always costs time. So a system is labelled like 'PC/EL': consistent under partition, low-latency otherwise.",
          ar: "يكمل PACELC الصورة. CAP يصف الـ partition النادر فقط. يضيف PACELC الحالة الشائعة: إن وُجد Partition اختر A أو C؛ وإلّا — حين تكون الشبكة سليمة — تختار أيضاً بين Latency منخفض و Consistency، لأن انتظار تأكيد replicas أكثر يكلّف وقتاً دائماً. لذا يُوصف النظام بمثل 'PC/EL': consistent تحت الـ partition، ومنخفض الـ latency خلاف ذلك." },
        { t: "kv", rows: [
          { k: { en: "Quorum (W, R, N)", ar: "Quorum (W, R, N)" }, v: { en: "How many replicas confirm writes/reads out of the total.", ar: "كم replica تؤكّد الـ writes/reads من الإجمالي." } },
          { k: { en: "Strong consistency", ar: "Strong consistency" }, v: { en: "A read always reflects the last completed write.", ar: "الـ read يعكس دائماً آخر write مكتمل." } },
          { k: { en: "Eventual consistency", ar: "Eventual consistency" }, v: { en: "Replicas converge after the partition heals; reads may lag briefly.", ar: "تتقارب الـ replicas بعد شفاء الـ partition؛ قد تتأخّر الـ reads قليلاً." } },
          { k: { en: "PACELC", ar: "PACELC" }, v: { en: "Names both the partition choice and the everyday latency choice.", ar: "يسمّي اختيار الـ partition واختيار الـ latency اليومي معاً." } }
        ]}
      ]
    },
    {
      key: "tradeoffs",
      blocks: [
        { t: "tradeoff",
          pros: { en: [
            "CP: no client ever reads wrong data, so business rules stay safe.",
            "CP: reasoning is simple — the data is always the single latest truth.",
            "AP: the system keeps answering during network trouble, so uptime stays high.",
            "AP: writes never block on distant replicas, so latency stays low."
          ], ar: [
            "CP: لا يقرأ أي عميل بيانات خاطئة، فتبقى قواعد العمل آمنة.",
            "CP: التفكير بسيط — البيانات دائماً هي الحقيقة الأحدث الوحيدة.",
            "AP: يبقى النظام يجيب أثناء مشاكل الشبكة، فيبقى الـ uptime عالياً.",
            "AP: لا تتوقّف الـ writes بانتظار replicas بعيدة، فيبقى الـ latency منخفضاً."
          ]},
          cons: { en: [
            "CP: some requests fail or hang during a partition — visible downtime.",
            "CP: cross-region writes are slower because they wait for a quorum.",
            "AP: reads can be stale, so clients must tolerate old values.",
            "AP: concurrent writes on both sides create conflicts you must merge later."
          ], ar: [
            "CP: تفشل أو تتعلّق بعض الطلبات أثناء الـ partition — توقّف مرئي.",
            "CP: الـ writes عبر المناطق أبطأ لأنها تنتظر quorum.",
            "AP: قد تكون الـ reads قديمة، فعلى العملاء تحمّل قيم قديمة.",
            "AP: writes متزامنة على الجانبين تُنشئ conflicts يجب دمجها لاحقاً."
          ]},
          limits: { en: [
            "The choice only appears during a partition; the rest of the time both look fine.",
            "'CP' and 'AP' are not absolute labels — they depend on the exact W/R config.",
            "Consistency here means linearizability, not the C in database ACID."
          ], ar: [
            "الاختيار يظهر فقط أثناء الـ partition؛ بقية الوقت يبدو الاثنان جيدين.",
            "'CP' و 'AP' ليست تسميات مطلقة — تعتمد على إعداد W/R الدقيق.",
            "Consistency هنا تعني linearizability، لا الـ C في ACID لقواعد البيانات."
          ]},
          alts: { en: [
            "Tunable consistency: pick W and R per operation, not per system.",
            "Causal consistency: weaker than strong but preserves cause-and-effect order.",
            "Single-leader with failover: strong reads from the leader, accept brief downtime."
          ], ar: [
            "Tunable consistency: اختر W و R لكل عملية، لا لكل النظام.",
            "Causal consistency: أضعف من strong لكنه يحفظ ترتيب السبب والنتيجة.",
            "Single-leader مع failover: reads قوية من الـ leader، مع قبول توقّف قصير."
          ]}
        }
      ]
    },
    {
      key: "mistakes",
      blocks: [
        { t: "mistake",
          title: { en: "Treating CAP as pick-two-of-three", ar: "معاملة CAP كاختيار اثنين من ثلاثة" },
          body: { en: "A team wrote 'we chose CA' in a design doc, meaning consistent and available but not partition-tolerant. On a real network partitions are unavoidable, so 'CA' means the system simply breaks when the link drops. There is no CA system on a real network — the honest choice is only C or A during the partition.", ar: "كتب فريق 'اخترنا CA' في مستند تصميم، أي consistent و available دون partition tolerance. على شبكة حقيقية الـ partitions لا مفر منها، فـ 'CA' يعني ببساطة أن النظام ينكسر عند انقطاع الرابط. لا يوجد نظام CA على شبكة حقيقية — الاختيار الصادق هو C أو A أثناء الـ partition فقط." } },
        { t: "mistake",
          title: { en: "Calling one database 'CP' forever", ar: "وصف قاعدة بيانات بأنها 'CP' للأبد" },
          body: { en: "Someone labeled their store 'CP' and assumed every read was strongly consistent. But they had set R=1 for speed. With W + R not greater than N, reads could return stale data even with no partition. The label describes a configuration, not a fixed property of the product.", ar: "وصف أحدهم مخزنه بأنه 'CP' وافترض أن كل read قوي الاتساق. لكنه ضبط R=1 من أجل السرعة. مع كون W + R ليس أكبر من N، قد تعيد الـ reads بيانات قديمة حتى دون partition. التسمية تصف إعداداً، لا خاصية ثابتة في المنتج." } },
        { t: "mistake",
          title: { en: "Ignoring the latency (E) half of PACELC", ar: "تجاهل نصف الـ latency (E) في PACELC" },
          body: { en: "A service used a strongly consistent multi-region write for every request, including a read-only feed. With no partition at all, each read still waited for two regions to confirm, adding 80 ms — meaning every user waited an extra 80 milliseconds for no safety benefit on a feed that could be slightly stale.", ar: "استخدمت خدمة write قوي الاتساق متعدّد المناطق لكل request، بما فيها feed للقراءة فقط. دون أي partition، ما زال كل read ينتظر تأكيد منطقتين، مضيفاً 80 ms — أي أن كل مستخدم انتظر 80 ميلي ثانية إضافية دون فائدة أمان على feed يحتمل أن يكون قديماً قليلاً." } },
        { t: "mistake",
          title: { en: "Assuming AP means no conflicts", ar: "افتراض أن AP يعني بلا conflicts" },
          body: { en: "An AP shopping cart accepted writes on both sides of a partition. When the link healed, the same cart had two different item lists and the system silently kept one, losing the other. AP does not remove conflicts — it defers them, and you must define how to merge, such as taking the union of cart items.", ar: "قبِلت عربة تسوّق AP كتابات على جانبي الـ partition. عند شفاء الرابط، كان للعربة نفسها قائمتا عناصر مختلفتان واحتفظ النظام بواحدة بصمت وفقد الأخرى. AP لا يزيل الـ conflicts — يؤجّلها، وعليك تعريف كيفية الدمج، مثل أخذ اتحاد عناصر العربة." } }
      ]
    },
    {
      key: "interview",
      blocks: [
        { t: "qa", level: "junior",
          q: { en: "What are the three letters in CAP?", ar: "ما الأحرف الثلاثة في CAP؟" },
          a: { en: "Consistency — every read sees the latest write. Availability — every request gets an answer. Partition tolerance — the system keeps working when the network drops messages between nodes. The theorem says during a partition you can only keep two, and since partitions are unavoidable, you really choose between C and A.", ar: "Consistency — كل read يرى أحدث write. Availability — كل request يحصل على إجابة. Partition tolerance — يستمر النظام حين تُسقِط الشبكة الرسائل بين الـ nodes. تقول النظرية إنه أثناء الـ partition يمكنك الإبقاء على اثنين فقط، وبما أن الـ partitions لا مفر منها، فأنت تختار فعلاً بين C و A." } },
        { t: "qa", level: "mid",
          q: { en: "Why can't you have CA on a real network?", ar: "لماذا لا يمكن الحصول على CA على شبكة حقيقية؟" },
          a: { en: "Because partitions will happen — cables fail, switches reboot, packets drop. 'CA' would mean you assume the network never splits. When it does split, a CA design has no defined behavior, so it just breaks. Partition tolerance is not optional; it is the baseline you build on, which leaves the choice between C and A.", ar: "لأن الـ partitions ستحدث — تفشل الكابلات، تُعاد تشغيل الـ switches، تُسقَط الحزم. 'CA' يعني أنك تفترض أن الشبكة لا تنقسم أبداً. حين تنقسم، لا يملك تصميم CA سلوكاً معرّفاً، فينكسر ببساطة. Partition tolerance ليست اختيارية؛ هي الأساس الذي تبني عليه، ما يترك الاختيار بين C و A." } },
        { t: "qa", level: "mid",
          q: { en: "How does a quorum implement the CAP choice?", ar: "كيف ينفّذ الـ quorum اختيار CAP؟" },
          a: { en: "You pick W, the writes needed to confirm, and R, the reads needed, out of N replicas. If W + R > N every read overlaps the latest write, giving strong consistency. During a partition, if a side can't reach W nodes, a consistent system refuses the write — choosing C over A. Lower W and R for availability and speed, at the price of possibly stale reads.", ar: "تختار W، الكتابات اللازمة للتأكيد، و R، القراءات اللازمة، من N من الـ replicas. إذا W + R > N فكل read يتداخل مع أحدث write، ما يعطي strong consistency. أثناء الـ partition، إذا لم يصل جانب إلى W من الـ nodes، يرفض النظام الـ consistent الـ write — مختاراً C على A. اخفض W و R للـ availability والسرعة، بثمن reads قد تكون قديمة." } },
        { t: "qa", level: "senior",
          q: { en: "What does PACELC add over CAP?", ar: "ماذا يضيف PACELC على CAP؟" },
          a: { en: "CAP only talks about the moment of a partition, which is rare. PACELC also describes normal operation: Else, with no partition, you still trade Latency against Consistency, because confirming more replicas takes time. Most systems spend nearly all their life in the 'E' case, so the latency-versus-consistency decision usually matters more day to day than the partition one.", ar: "CAP يتحدث فقط عن لحظة الـ partition، وهي نادرة. PACELC يصف أيضاً التشغيل العادي: Else، دون partition، ما زلت تقايض Latency مقابل Consistency، لأن تأكيد replicas أكثر يأخذ وقتاً. معظم الأنظمة تقضي جُلّ حياتها في حالة 'E'، فقرار الـ latency مقابل الـ consistency عادةً أهم يومياً من قرار الـ partition." } },
        { t: "qa", level: "senior",
          q: { en: "Give a concrete case where AP is the right call.", ar: "أعطِ حالة ملموسة يكون فيها AP الخيار الصحيح." },
          a: { en: "A shopping cart. If a region is partitioned, refusing to let a user add items loses sales, while showing a slightly stale cart costs nothing serious. So you stay available, accept writes on both sides, and merge on heal — for a cart, take the union of items so nothing a customer added is lost. The business cost of downtime beats the cost of a brief conflict.", ar: "عربة تسوّق. إذا انفصلت منطقة، فمنع المستخدم من إضافة عناصر يفقد مبيعات، بينما إظهار عربة قديمة قليلاً لا يكلّف شيئاً خطيراً. لذا تبقى available، تقبل الكتابات على الجانبين، وتدمج عند الشفاء — للعربة خذ اتحاد العناصر كي لا يُفقد ما أضافه الزبون. تكلفة التوقّف للعمل تفوق تكلفة conflict قصير." } },
        { t: "qa", level: "staff",
          q: { en: "How would you stop teams from mislabeling systems as 'CA' across an org?", ar: "كيف تمنع الفرق من وصف الأنظمة خطأً بأنها 'CA' عبر المؤسسة؟" },
          a: { en: "Make the design-doc template ask two separate questions: what happens during a partition, and what latency-versus-consistency choice you make when healthy — that is PACELC, and it forces the honest answer. Add a review gate where anyone claiming strong consistency must state the W, R and N. Run periodic partition drills so the claimed behavior is actually observed, not assumed.", ar: "اجعل قالب مستند التصميم يسأل سؤالين منفصلين: ماذا يحدث أثناء الـ partition، وأي اختيار latency مقابل consistency تتخذه في الحالة السليمة — هذا PACELC، وهو يفرض الإجابة الصادقة. أضِف بوابة مراجعة يُلزَم فيها كل من يدّعي strong consistency بذكر W و R و N. أجرِ تمارين partition دورية ليُلاحَظ السلوك المدّعى فعلاً لا يُفترض." } }
      ]
    },
    {
      key: "codereview",
      blocks: [
        { t: "review", severity: "high",
          title: { en: "Read path silently returns stale data on a balance", ar: "مسار القراءة يعيد بيانات قديمة بصمت على رصيد" },
          bad: "// balance read, single replica, no quorum\nvar balance = await replica.GetAsync(accountId);\nreturn balance; // may be stale during a partition",
          good: "// require a read quorum for money-critical data\nvar result = await store.GetAsync(accountId, new ReadOptions {\n    Consistency = ConsistencyLevel.Quorum // R + W > N\n});\nif (!result.Reached) throw new ConsistencyException();\nreturn result.Value;",
          why: { en: "A balance is a place where a stale read causes real financial loss, so it needs strong consistency (a read quorum). The bad version reads from one replica with no quorum, so during a partition it can return an old balance and let a user overdraw. Money-critical reads must be CP; accept the possible failure over a wrong number.", ar: "الرصيد موضع يسبب فيه read قديم خسارة مالية فعلية، فيحتاج strong consistency (read quorum). النسخة السيئة تقرأ من replica واحدة دون quorum، فأثناء الـ partition قد تعيد رصيداً قديماً وتسمح للمستخدم بالسحب على المكشوف. القراءات الحرجة للمال يجب أن تكون CP؛ اقبل الفشل المحتمل بدل رقم خاطئ." } },
        { t: "review", severity: "low",
          title: { en: "Strong consistency forced on a view counter", ar: "فرض strong consistency على عدّاد مشاهدات" },
          bad: "await store.IncrementAsync(\"views:\" + postId,\n    new WriteOptions { Consistency = ConsistencyLevel.All });",
          good: "await store.IncrementAsync(\"views:\" + postId,\n    new WriteOptions { Consistency = ConsistencyLevel.One });",
          why: { en: "A view counter has no correctness cost if it is off by a few for a moment, so paying for a full multi-replica confirmation on every increment just adds latency. Match the consistency level to how much a stale value actually hurts — here, almost none, so cheap AP writes are correct.", ar: "عدّاد المشاهدات لا يكلّف صحّةً إن أخطأ بقليل للحظة، فدفع ثمن تأكيد متعدّد الـ replicas على كل زيادة يضيف latency فقط. طابِق مستوى الـ consistency مع مقدار ضرر القيمة القديمة فعلاً — هنا يكاد يكون معدوماً، فكتابات AP الرخيصة صحيحة." } }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        { t: "p",
          en: "In a real design, you rarely pick one CAP stance for the whole system. You split data by how much a stale read hurts, and give each part its own consistency level. Money and inventory get CP; feeds, counters and caches get AP.",
          ar: "في تصميم حقيقي، نادراً ما تختار موقف CAP واحداً لكامل النظام. تقسم البيانات حسب مقدار ضرر الـ read القديم، وتعطي كل جزء مستوى consistency خاصاً به. المال والمخزون يأخذان CP؛ والـ feeds والعدّادات والـ caches تأخذ AP." },
        { t: "ul",
          en: [
            "Classify each data type by the cost of a stale read before choosing C or A.",
            "Use a single-leader store for the CP parts so one node holds the truth.",
            "Use a multi-leader or quorum store for AP parts, with a defined merge rule.",
            "Write down the PACELC label per store so on-call knows the expected behavior."
          ],
          ar: [
            "صنّف كل نوع بيانات حسب تكلفة الـ read القديم قبل اختيار C أو A.",
            "استخدم مخزن single-leader للأجزاء CP كي يحمل node واحد الحقيقة.",
            "استخدم مخزن multi-leader أو quorum للأجزاء AP، مع قاعدة merge معرّفة.",
            "اكتب تسمية PACELC لكل مخزن كي يعرف الـ on-call السلوك المتوقّع."
          ]},
        { t: "callout", kind: "tip",
          en: "When in doubt, ask: if this exact value is 5 seconds old, does anything bad happen? A 'no' points to AP; a 'yes' points to CP.",
          ar: "عند الشك اسأل: إن كانت هذه القيمة بالذات قديمة بـ 5 ثوانٍ، هل يحدث شيء سيئ؟ 'لا' تشير إلى AP؛ و'نعم' تشير إلى CP." }
      ]
    },
    {
      key: "perf",
      blocks: [
        { t: "kv", rows: [
          { k: { en: "Latency", ar: "Latency" }, v: { en: "Higher W and R mean each op waits for more replicas, so strong consistency costs milliseconds per request.", ar: "قيم W و R أعلى تعني انتظار كل عملية replicas أكثر، فـ strong consistency يكلّف ميلي ثوانٍ لكل request." } },
          { k: { en: "Network", ar: "Network" }, v: { en: "Cross-region quorums send messages over slow long-distance links; keep quorums in one region when you can.", ar: "quorums عبر المناطق ترسل رسائل عبر روابط بطيئة بعيدة المدى؛ أبقِ الـ quorums في منطقة واحدة متى أمكن." } },
          { k: { en: "Availability", ar: "Availability" }, v: { en: "CP systems drop some requests during a partition; measure this as error rate, not just latency.", ar: "أنظمة CP تُسقِط بعض الطلبات أثناء الـ partition؛ قِس هذا كنسبة أخطاء، لا latency فقط." } },
          { k: { en: "Scalability", ar: "Scalability" }, v: { en: "AP scales writes across regions freely; CP write throughput is capped by the leader or quorum round-trip.", ar: "AP يوسّع الـ writes عبر المناطق بحرية؛ إنتاجية كتابة CP محدودة بجولة الـ leader أو الـ quorum." } },
          { k: { en: "CPU", ar: "CPU" }, v: { en: "AP conflict resolution (merging divergent replicas) adds CPU work after a partition heals.", ar: "حل conflicts في AP (دمج replicas متباعدة) يضيف عمل CPU بعد شفاء الـ partition." } }
        ]}
      ]
    },
    {
      key: "debug",
      blocks: [
        { t: "ul",
          en: [
            "Cluster status command (e.g. `nodetool status` for Cassandra): shows which nodes see each other, so you can spot a partition.",
            "Replica lag metric: watch how far behind followers are — growing lag warns of a forming split.",
            "Client error rate by region: a spike on one side signals that side lost quorum.",
            "Consistency-level logs on each op: confirm reads and writes actually used the level you intended.",
            "A partition drill (block traffic between nodes on purpose): verify the system behaves as its CAP claim says."
          ],
          ar: [
            "أمر حالة الـ cluster (مثل `nodetool status` لـ Cassandra): يبيّن أي nodes ترى بعضها، فترصد الـ partition.",
            "مقياس تأخّر الـ replica: راقب كم يتأخّر الـ followers — تأخّر متزايد ينذر بانقسام يتكوّن.",
            "نسبة أخطاء العميل حسب المنطقة: قفزة على جانب تشير إلى فقدان ذلك الجانب للـ quorum.",
            "سجلات مستوى الـ consistency لكل عملية: أكّد أن الـ reads والـ writes استخدمت المستوى المقصود فعلاً.",
            "تمرين partition (احجب المرور بين الـ nodes عمداً): تحقّق أن النظام يتصرّف كما يدّعي CAP."
          ]},
        { t: "callout", kind: "tip",
          en: "The dangerous partition is the one that heals silently. Alert on 'replica rejoined after divergence' so a merge step actually runs instead of one side's writes vanishing.",
          ar: "الـ partition الخطير هو الذي يُشفى بصمت. نبّه على 'replica أعاد الانضمام بعد تباعد' كي تعمل خطوة الـ merge فعلاً بدل اختفاء كتابات أحد الجانبين." }
      ]
    },
    {
      key: "realworld",
      blocks: [
        { t: "p",
          en: "The CAP choice shows up any time data is copied across machines or regions, which is nearly every large system. The pattern is always the same: pick C where a stale value causes loss, pick A where downtime causes loss.",
          ar: "يظهر اختيار CAP كلما نُسخت البيانات عبر أجهزة أو مناطق، وهو ما يحدث في كل نظام كبير تقريباً. النمط دائماً نفسه: اختر C حيث تسبب القيمة القديمة خسارة، واختر A حيث يسبب التوقّف خسارة." },
        { t: "ul",
          en: [
            "Payment and banking systems: CP, because a wrong balance or double-spend is unacceptable.",
            "Social feeds and 'like' counts: AP, because a few seconds of stale numbers harms no one.",
            "Shopping carts: AP with a merge-on-heal rule, so a partition never blocks a purchase.",
            "Service discovery and config: often CP, because two nodes acting on different config causes chaos."
          ],
          ar: [
            "أنظمة الدفع والبنوك: CP، لأن رصيداً خاطئاً أو double-spend غير مقبول.",
            "الـ feeds الاجتماعية وعدّادات 'like': AP، لأن ثوانٍ من الأرقام القديمة لا تؤذي أحداً.",
            "عربات التسوّق: AP مع قاعدة merge-on-heal، كي لا يحجب partition عملية شراء أبداً.",
            "اكتشاف الخدمات والـ config: غالباً CP، لأن عمل node ين على config مختلف يسبب فوضى."
          ]}
      ]
    },
    {
      key: "exercises",
      blocks: [
        { t: "ex", diff: "easy",
          en: "For five features (bank transfer, chat message, view counter, seat booking, user avatar), label each CP or AP and write one sentence saying why. You got it right if each label matches the cost of a stale read.",
          ar: "لخمس ميزات (تحويل بنكي، رسالة chat، عدّاد مشاهدات، حجز مقعد، avatar مستخدم)، صنّف كلاً CP أو AP واكتب جملة تبرّر. تكون مصيباً إن طابقت كل تسمية تكلفة الـ read القديم." },
        { t: "ex", diff: "medium",
          en: "With N=3 replicas, list every (W, R) pair and mark which give strong consistency (W + R > 3). Then say which pair survives one node down while staying strongly consistent. Correct when your table matches the quorum rule.",
          ar: "مع N=3 من الـ replicas، اذكر كل زوج (W, R) وحدّد أيها يعطي strong consistency (W + R > 3). ثم قل أي زوج ينجو من سقوط node واحد مع بقائه قوي الاتساق. صحيح حين يطابق جدولك قاعدة الـ quorum." },
        { t: "ex", diff: "hard",
          en: "Build a two-node key-value demo. Add a switch that 'drops' messages between nodes to simulate a partition. Implement both a CP mode (reject on no quorum) and an AP mode (accept and reconcile). Prove each behaves correctly under the partition.",
          ar: "ابنِ عرض key-value بـ node ين. أضف مفتاحاً 'يُسقِط' الرسائل بين الـ nodes لمحاكاة partition. نفّذ وضع CP (رفض عند غياب quorum) ووضع AP (قبول وتصالح). أثبت أن كلاً يتصرّف صحيحاً تحت الـ partition." },
        { t: "ex", diff: "senior",
          en: "Take one service you own and write its PACELC label with evidence: the W/R config for the P choice, and a measured latency number for the E choice. Then propose one change that better matches the business cost of staleness. Done when the label is backed by numbers, not guesses.",
          ar: "خذ خدمة تملكها واكتب تسمية PACELC لها بأدلة: إعداد W/R لاختيار P، ورقم latency مقيس لاختيار E. ثم اقترح تغييراً واحداً يطابق أفضل تكلفة العمل للقِدَم. تنتهي حين تكون التسمية مدعومة بأرقام لا تخمين." }
      ]
    },
    {
      key: "refs",
      blocks: [
        { t: "ref", label: { en: "Gilbert & Lynch: proof of Brewer's conjecture", ar: "Gilbert & Lynch: برهان حدسية Brewer" }, url: "https://www.comp.nus.edu.sg/~gilbert/pubs/BrewersConjecture-SigAct.pdf", meta: { en: "Paper", ar: "ورقة بحثية" } },
        { t: "ref", label: { en: "Eric Brewer: CAP twelve years later", ar: "Eric Brewer: CAP بعد اثني عشر عاماً" }, url: "https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed/", meta: { en: "Article", ar: "مقال" } },
        { t: "ref", label: { en: "Daniel Abadi: consistency trade-offs and PACELC", ar: "Daniel Abadi: مقايضات الاتساق و PACELC" }, url: "https://www.cs.umd.edu/~abadi/papers/abadi-pacelc.pdf", meta: { en: "Paper", ar: "ورقة بحثية" } },
        { t: "ref", label: { en: "Martin Kleppmann: please stop calling databases CP or AP", ar: "Martin Kleppmann: أرجوكم توقّفوا عن وصف قواعد البيانات بـ CP أو AP" }, url: "https://martin.kleppmann.com/2015/05/11/please-stop-calling-databases-cp-or-ap.html", meta: { en: "Article", ar: "مقال" } }
      ]
    }
  ],
  quiz: [
    {
      q: { en: "During a network partition, CAP says you must give up which pair of options?", ar: "أثناء partition شبكي، يقول CAP إنه يجب التخلّي عن أي زوج من الخيارات؟" },
      options: [
        { en: "Consistency or Availability", ar: "Consistency أو Availability" },
        { en: "Consistency or Partition tolerance", ar: "Consistency أو Partition tolerance" },
        { en: "Availability or Partition tolerance", ar: "Availability أو Partition tolerance" },
        { en: "Latency or Throughput", ar: "Latency أو Throughput" }
      ],
      correct: 0,
      why: { en: "Partitions are unavoidable, so partition tolerance is a given. That leaves the real choice: stay consistent (reject/hang) or stay available (serve possibly stale data).", ar: "الـ partitions لا مفر منها، فـ partition tolerance مُسلّمة. يبقى الاختيار الحقيقي: البقاء consistent (رفض/تعليق) أو البقاء available (تقديم بيانات قد تكون قديمة)." }
    },
    {
      q: { en: "With N=3 replicas, which (W, R) gives strong consistency?", ar: "مع N=3 من الـ replicas، أي (W, R) يعطي strong consistency؟" },
      options: [
        { en: "W=1, R=1", ar: "W=1, R=1" },
        { en: "W=2, R=2", ar: "W=2, R=2" },
        { en: "W=1, R=2", ar: "W=1, R=2" },
        { en: "W=1, R=0", ar: "W=1, R=0" }
      ],
      correct: 1,
      why: { en: "Strong consistency needs W + R > N. With N=3, W=2 and R=2 give 4 > 3, so every read set overlaps the latest write set by at least one node.", ar: "strong consistency يحتاج W + R > N. مع N=3، فإن W=2 و R=2 يعطيان 4 > 3، فتتداخل كل مجموعة read مع أحدث مجموعة write بـ node واحد على الأقل." }
    },
    {
      q: { en: "Why is 'CA on a real network' not a meaningful choice?", ar: "لماذا 'CA على شبكة حقيقية' ليس خياراً ذا معنى؟" },
      options: [
        { en: "Because partitions are unavoidable, so the system has no defined behavior when one happens", ar: "لأن الـ partitions لا مفر منها، فلا سلوك معرّف للنظام حين يحدث أحدها" },
        { en: "Because consistency and availability cannot both be implemented", ar: "لأن الـ consistency والـ availability لا يمكن تنفيذهما معاً أبداً" },
        { en: "Because CA needs more than three replicas", ar: "لأن CA يحتاج أكثر من ثلاث replicas" },
        { en: "Because CA is only for single-machine databases", ar: "لأن CA لقواعد البيانات أحادية الجهاز فقط" }
      ],
      correct: 0,
      why: { en: "On a real network the link will drop at some point. A CA design assumes it never does, so when a partition hits it simply breaks. Partition tolerance is the baseline.", ar: "على شبكة حقيقية سينقطع الرابط في وقت ما. تصميم CA يفترض أنه لا ينقطع أبداً، فحين يقع partition ينكسر ببساطة. Partition tolerance هي الأساس." }
    },
    {
      q: { en: "What does the 'ELC' part of PACELC describe?", ar: "ماذا يصف جزء 'ELC' في PACELC؟" },
      options: [
        { en: "The choice between Latency and Consistency when there is no partition", ar: "الاختيار بين Latency و Consistency حين لا يوجد partition" },
        { en: "The choice between two error codes during a partition", ar: "الاختيار بين رمزَي خطأ أثناء الـ partition" },
        { en: "The number of replicas needed for a quorum", ar: "عدد الـ replicas اللازمة لـ quorum" },
        { en: "The maximum tolerable packet loss", ar: "أقصى فقدان حزم محتمل" }
      ],
      correct: 0,
      why: { en: "PACELC's 'Else' half covers the healthy network: even with no partition you trade Latency against Consistency, since confirming more replicas takes time.", ar: "نصف 'Else' في PACELC يغطّي الشبكة السليمة: حتى دون partition تقايض Latency مقابل Consistency، لأن تأكيد replicas أكثر يأخذ وقتاً." }
    },
    {
      q: { en: "For a 'likes' counter that can be stale for a few seconds, which stance fits best?", ar: "لعدّاد 'likes' يحتمل القِدَم لبضع ثوانٍ، أي موقف يناسب أكثر؟" },
      options: [
        { en: "AP — stay available since a slightly stale count harms no one", ar: "AP — ابقَ available لأن عدّاً قديماً قليلاً لا يؤذي أحداً" },
        { en: "CP — reject reads until every replica agrees", ar: "CP — ارفض الـ reads حتى تتفق كل replica" },
        { en: "CA — assume no partition ever happens", ar: "CA — افترض ألّا يحدث partition أبداً" },
        { en: "It must use W + R > N for correctness", ar: "يجب أن يستخدم W + R > N للصحّة" }
      ],
      correct: 0,
      why: { en: "A stale like count costs nothing, but downtime does, so availability wins. Cheap AP writes (low W and R) are the right fit here.", ar: "عدّاد likes قديم لا يكلّف شيئاً، لكن التوقّف يكلّف، فتفوز الـ availability. كتابات AP الرخيصة (W و R منخفضان) هي المناسبة هنا." }
    }
  ]
};
```

NEXT: outbox
