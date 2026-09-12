```js
const tradeoffWritingLesson = {
  id: "tradeoff-writing",
  moduleId: "skills",
  title: { en: "Arguing trade-offs", ar: "مناقشة المقايضات" },
  summary: {
    en: "How to make a technical argument that holds up when smart people disagree — by naming the trade-off, giving the other side its strongest form, and separating the decision from your ego.",
    ar: "كيف تبني حجة تقنية تصمد عندما يختلف أشخاص أذكياء — بتسمية المقايضة، وعرض الرأي المقابل بأقوى صورة له، وفصل القرار عن غرورك."
  },
  mins: 12,
  sections: [
    {
      key: "why",
      blocks: [
        { t: "p",
          en: "Arguing a trade-off means showing why one option is better here, while openly admitting what you give up to get it. A trade-off is a choice where every option costs you something; there is no free win. The skill is not winning the room — it is producing a decision the team still trusts in three months.",
          ar: "مناقشة المقايضة تعني أن توضّح لماذا خيار معيّن أفضل هنا، مع الاعتراف الصريح بما تخسره مقابل ذلك. المقايضة (trade-off) هي اختيار يكلّفك فيه كل خيار شيئاً ما؛ لا يوجد ربح مجاني. المهارة ليست في كسب النقاش — بل في إنتاج قرار يثق به الفريق بعد ثلاثة أشهر." },
        { t: "kv", rows: [
          { k: { en: "Trade-off", ar: "Trade-off" }, v: { en: "A choice where each option gives you something and costs you something else — no option is free.", ar: "اختيار يمنحك فيه كل خيار شيئاً ويكلّفك شيئاً آخر — لا خيار بلا ثمن." } },
          { k: { en: "Steelman", ar: "Steelman" }, v: { en: "Stating the opposing view in its strongest, fairest form before you argue against it.", ar: "عرض الرأي المخالف بأقوى وأعدل صورة له قبل أن تعارضه." } },
          { k: { en: "Straw man", ar: "Straw man" }, v: { en: "The opposite mistake: attacking a weak, distorted version of the other side.", ar: "الخطأ المعاكس: مهاجمة نسخة ضعيفة ومشوّهة من الرأي الآخر." } },
          { k: { en: "Disagree and commit", ar: "Disagree and commit" }, v: { en: "You lost the argument, but you back the decision fully instead of quietly resisting it.", ar: "خسرت النقاش، لكنك تدعم القرار بالكامل بدل مقاومته بصمت." } },
          { k: { en: "ADR", ar: "ADR" }, v: { en: "Architecture Decision Record — a short written note of what was decided and why, kept in the repo.", ar: "Architecture Decision Record — ملاحظة مكتوبة قصيرة بما تقرّر ولماذا، تُحفظ داخل الـ repo." } },
          { k: { en: "Reversibility", ar: "Reversibility" }, v: { en: "How hard it is to undo a decision later — cheap to undo means less need to argue perfectly.", ar: "مدى صعوبة التراجع عن القرار لاحقاً — سهولة التراجع تعني حاجة أقل لحجّة مثالية." } }
        ]},
        { t: "p",
          en: "Here is the running example for this lesson. Your team caches a product catalog. Today it uses in-process MemoryCache — a cache that lives inside each server's own memory. You want to move to Redis, a separate cache server that all your servers share. Two engineers disagree. The argument will either produce a clear decision or drag on for weeks.",
          ar: "إليك المثال الجاري في هذا الدرس. فريقك يخزّن كتالوج منتجات في الـ cache. اليوم يستخدم MemoryCache داخل العملية — cache يعيش داخل ذاكرة كل server على حدة. تريد الانتقال إلى Redis، وهو cache server منفصل تشترك فيه كل الـ servers. مهندسان يختلفان. النقاش إمّا أن يُنتج قراراً واضحاً أو يمتدّ أسابيع." },
        { t: "p",
          en: "Think of it like two people choosing a route on a road trip. If one just says 'my way is faster' and the other says 'no, mine is', they argue forever. If instead they say 'yours is 10 minutes faster but has no gas stations', the choice becomes obvious and neither feels bulldozed. Naming the cost is what ends the fight.",
          ar: "تخيّلها مثل شخصين يختاران طريقاً في رحلة. لو قال أحدهما «طريقي أسرع» وقال الآخر «لا، طريقي أسرع»، يتجادلان بلا نهاية. أمّا لو قالا «طريقك أسرع بعشر دقائق لكن لا محطات وقود فيه»، يصبح الاختيار واضحاً ولا يشعر أحد بأنه سُحق. تسمية الثمن هي ما يُنهي الخلاف." },
        { t: "callout", kind: "note",
          en: "A trade-off argument is not about being right. It is about making the costs of each option visible so the group can choose with open eyes.",
          ar: "حجة المقايضة ليست عن أن تكون محقّاً. إنها عن جعل تكاليف كل خيار مرئية كي تختار المجموعة بعينين مفتوحتين." }
      ]
    },
    {
      key: "problem",
      blocks: [
        { t: "p",
          en: "Watch the bad version first. In the Redis-vs-MemoryCache meeting, one engineer says 'Redis is the industry standard, we should just use it'. The other says 'that is over-engineering'. Neither names a cost. The room splits by seniority, not by reason. A decision is made, then quietly reversed two sprints later when someone else re-opens it.",
          ar: "شاهد النسخة السيئة أولاً. في اجتماع Redis مقابل MemoryCache، يقول مهندس «Redis هو المعيار في الصناعة، فلنستخدمه». يقول الآخر «هذه هندسة زائدة». لا أحد يسمّي تكلفة. تنقسم الغرفة حسب الأقدمية لا حسب المنطق. يُتّخذ قرار، ثم يُعكس بهدوء بعد sprintين حين يعيد شخص آخر فتحه." },
        { t: "p",
          en: "That churn has a real price. Say the topic gets re-argued three times over six weeks, thirty minutes each, with five people in the room. That is roughly 7.5 person-hours of meetings — meaning almost a full working day of one engineer, spent producing no decision. Worse, the code sits in a half-migrated state the whole time.",
          ar: "هذا التذبذب له ثمن حقيقي. لنقل إن الموضوع أُعيد نقاشه ثلاث مرات خلال ستة أسابيع، نصف ساعة كل مرة، بخمسة أشخاص في الغرفة. هذا نحو 7.5 ساعة-شخص من الاجتماعات — أي ما يقارب يوم عمل كامل لمهندس واحد، أُنفق دون قرار. والأسوأ أن الكود يبقى في حالة migration نصفية طوال الوقت." },
        { t: "p",
          en: "Now the good version. One engineer writes a half-page note: the decision, the two options, three trade-off rows with numbers, and a recommendation. The meeting drops to ten minutes because everyone reads the same facts. The decision is recorded, so nobody re-litigates it without new information. Same brains, same disagreement — but the written trade-off turned six weeks into one afternoon.",
          ar: "الآن النسخة الجيدة. يكتب مهندس ملاحظة بنصف صفحة: القرار، الخياران، ثلاثة صفوف مقايضة بأرقام، وتوصية. ينزل الاجتماع إلى عشر دقائق لأن الجميع يقرأ الحقائق نفسها. يُوثَّق القرار، فلا يعيد أحد فتحه دون معلومة جديدة. العقول نفسها، الخلاف نفسه — لكن المقايضة المكتوبة حوّلت ستة أسابيع إلى بعد ظهر واحد." }
      ]
    },
    {
      key: "internals",
      blocks: [
        { t: "p",
          en: "A durable trade-off argument is built in a fixed order. Do the steps out of order and the argument feels like advocacy — a lawyer defending a side — instead of analysis. Here is the order, traced on the Redis example.",
          ar: "الحجة الرصينة للمقايضة تُبنى بترتيب ثابت. لو نفّذت الخطوات بترتيب خاطئ، بدت الحجة مثل مرافعة — محامٍ يدافع عن جهة — بدل التحليل. إليك الترتيب، مطبّقاً على مثال Redis." },
        { t: "kv", rows: [
          { k: { en: "1. Frame the decision", ar: "1. صياغة القرار" }, v: { en: "One sentence: what are we choosing between, and by when.", ar: "جملة واحدة: بين ماذا نختار، وحتى متى." } },
          { k: { en: "2. List the options", ar: "2. سرد الخيارات" }, v: { en: "Usually 2-3. Include 'do nothing' — keeping MemoryCache is a real option.", ar: "عادة 2-3. أدرِج «لا تفعل شيئاً» — إبقاء MemoryCache خيار حقيقي." } },
          { k: { en: "3. Pick the axes", ar: "3. اختيار المحاور" }, v: { en: "The 3-4 things that actually matter here: latency, correctness, cost, ops effort.", ar: "الأشياء الـ 3-4 التي تهمّ فعلاً هنا: latency، صحّة البيانات، التكلفة، جهد التشغيل." } },
          { k: { en: "4. Fill the grid", ar: "4. تعبئة الجدول" }, v: { en: "Score each option on each axis, with a number or a fact — not an adjective.", ar: "قيّم كل خيار على كل محور، برقم أو حقيقة — لا بصفة." } },
          { k: { en: "5. Steelman the loser", ar: "5. تقوية الخيار الخاسر" }, v: { en: "State the best case for the option you will not pick, honestly.", ar: "اعرض أفضل حجّة للخيار الذي لن تختاره، بأمانة." } },
          { k: { en: "6. Recommend + reversibility", ar: "6. التوصية + قابلية التراجع" }, v: { en: "Say which and why, and how expensive it is to undo if you are wrong.", ar: "قل أيّها ولماذا، وكم يكلّف التراجع إن أخطأت." } }
        ]},
        { t: "p",
          en: "The heart of it is step 4 and step 5. Step 4 forces you to replace opinions with facts. 'Redis is faster' becomes 'MemoryCache read is about 50 nanoseconds; a Redis read is about 0.5 milliseconds over the network — 10,000 times slower per read, but shared across all servers'. Now the reader sees the exact shape of the trade, not your conclusion.",
          ar: "قلب الأمر في الخطوة 4 والخطوة 5. الخطوة 4 تجبرك على استبدال الآراء بالحقائق. «Redis أسرع» تصبح «قراءة MemoryCache نحو 50 نانوثانية؛ قراءة Redis نحو 0.5 ميلي ثانية عبر الشبكة — أبطأ بعشرة آلاف مرة لكل قراءة، لكنها مشتركة بين كل الـ servers». الآن يرى القارئ شكل المقايضة بدقّة، لا استنتاجك." },
        { t: "code", lang: "markdown", label: { en: "The half-page trade-off note", ar: "ملاحظة المقايضة بنصف صفحة" },
          code: "## Decision: shared cache for the product catalog\n## Deadline: before the Black Friday freeze\n\nOptions:\n  A. Keep in-process MemoryCache (do nothing)\n  B. Move to Redis (shared cache server)\n\n| Axis            | A: MemoryCache        | B: Redis                 |\n|-----------------|-----------------------|--------------------------|\n| Read latency    | ~50 ns                | ~0.5 ms (network hop)    |\n| Consistency     | each server differs   | one shared value         |\n| Extra infra     | none                  | 1 Redis cluster to run   |\n| Failure blast   | 1 server's cache      | shared: Redis down = all |\n\nSteelman for A: catalog changes rarely; stale-per-server is\n  acceptable and we add zero infrastructure to operate.\n\nRecommend: B. The consistency win matters because prices must\n  match across servers. Reversible in ~1 day (feature flag)." },
        { t: "p",
          en: "Step 5 is what makes people trust you. When you write the strongest case for the option you are rejecting, two things happen. The people who preferred that option feel heard, so they stop fighting. And you prove you actually understood it — you are choosing, not just preferring. An argument that never says one good thing about the other side reads as biased, and smart readers discount it.",
          ar: "الخطوة 5 هي ما يجعل الناس يثقون بك. حين تكتب أقوى حجّة للخيار الذي ترفضه، يحدث أمران. من فضّلوا ذلك الخيار يشعرون بأنهم سُمعوا، فيتوقّفون عن المقاومة. وتثبت أنك فهمته فعلاً — أنت تختار لا تفضّل فقط. الحجة التي لا تقول شيئاً جيداً عن الطرف الآخر تُقرأ كمنحازة، والقرّاء الأذكياء يخصمون من قيمتها." },
        { t: "callout", kind: "tip",
          en: "A quick test: can you state the other side's position so well that someone holding it would say 'yes, exactly'? If not, you are not ready to argue against it.",
          ar: "اختبار سريع: هل تستطيع عرض موقف الطرف الآخر جيداً لدرجة أن صاحبه يقول «نعم، بالضبط»؟ إن لم تستطع، فأنت لست جاهزاً لمعارضته." }
      ]
    },
    {
      key: "tradeoffs",
      blocks: [
        { t: "tradeoff",
          pros: { en: [
            "A written trade-off outlives the meeting; new joiners read it instead of re-asking.",
            "Numbers replace status: the junior with data can beat the senior with an opinion.",
            "Naming what you give up builds trust — you look honest, not like a salesperson.",
            "It scopes the disagreement to the axis that actually matters."
          ], ar: [
            "المقايضة المكتوبة تبقى بعد الاجتماع؛ الملتحقون الجدد يقرؤونها بدل إعادة السؤال.",
            "الأرقام تحلّ محلّ المنصب: المبتدئ ومعه بيانات يتفوّق على الأقدم ومعه رأي.",
            "تسمية ما تتنازل عنه تبني الثقة — تبدو صادقاً لا بائعاً.",
            "تحصر الخلاف في المحور الذي يهمّ فعلاً."
          ]},
          cons: { en: [
            "Writing it takes 30-60 minutes up front, before any code.",
            "For a tiny, easily reversed choice, the note can cost more than the decision.",
            "A polished document can pressure people into agreeing too fast."
          ], ar: [
            "كتابتها تأخذ 30-60 دقيقة مقدماً، قبل أي كود.",
            "لاختيار صغير سهل التراجع، قد تكلّف الملاحظة أكثر من القرار نفسه.",
            "المستند المصقول قد يضغط الناس للموافقة بسرعة زائدة."
          ]},
          limits: { en: [
            "It does not remove disagreement; it makes disagreement productive.",
            "Bad numbers give false confidence — garbage in, confident garbage out.",
            "It cannot fix a decision that is really about politics, not facts."
          ], ar: [
            "لا تُزيل الخلاف؛ بل تجعله منتجاً.",
            "الأرقام السيئة تعطي ثقة زائفة — قمامة تدخل، قمامة واثقة تخرج.",
            "لا تُصلح قراراً هو في الحقيقة سياسة لا حقائق."
          ]},
          alts: { en: [
            "For reversible calls: just try one, measure, keep or revert — no doc.",
            "A 5-minute whiteboard grid when the group is already together.",
            "A spike (a throwaway prototype) when the numbers are unknown."
          ], ar: [
            "للقرارات القابلة للتراجع: جرّب واحداً، قِس، أبقِه أو تراجع — دون مستند.",
            "جدول على السبورة في 5 دقائق حين تكون المجموعة مجتمعة أصلاً.",
            "spike (نموذج أوّلي يُرمى) حين تكون الأرقام مجهولة."
          ]}
        }
      ]
    },
    {
      key: "mistakes",
      blocks: [
        { t: "mistake",
          title: { en: "Straw-manning the other option", ar: "تشويه الخيار الآخر (straw man)" },
          body: { en: "The engineer wrote 'MemoryCache means stale data everywhere and constant bugs'. That is the weakest possible version of it. The real MemoryCache case — rare catalog changes, zero infra — was never addressed, so supporters of A felt cheated and kept re-opening the debate. Attacking a distorted version wins the sentence and loses the room.", ar: "كتب المهندس «MemoryCache يعني بيانات قديمة في كل مكان وأخطاء دائمة». هذه أضعف صورة ممكنة له. الحجة الحقيقية لـ MemoryCache — تغيّر نادر للكتالوج، صفر infra — لم تُعالَج، فشعر أنصار A بالغبن وظلّوا يعيدون فتح النقاش. مهاجمة نسخة مشوّهة تكسب الجملة وتخسر الغرفة." } },
        { t: "mistake",
          title: { en: "Arguing from authority instead of cost", ar: "الحجّة بالسلطة بدل التكلفة" },
          body: { en: "'Netflix uses Redis' and 'it is best practice' are not arguments — they hide the trade-off instead of showing it. Netflix has different scale and a team to run Redis; you may not. Best practice for whom, at what size? Replace the appeal to authority with the actual cost line: what does Redis buy you here, and what does it cost you here.", ar: "«Netflix تستخدم Redis» و«هذه best practice» ليست حججاً — تُخفي المقايضة بدل إظهارها. لدى Netflix حجم مختلف وفريق لتشغيل Redis؛ قد لا يكون لديك. best practice لمن، وبأي حجم؟ استبدل الاحتكام للسلطة بسطر التكلفة الفعلي: ماذا يمنحك Redis هنا، وماذا يكلّفك هنا." } },
        { t: "mistake",
          title: { en: "Hiding an absolute inside a comparative", ar: "إخفاء مطلق داخل مقارنة" },
          body: { en: "'Redis is faster' sounds like a comparison but hides an absolute claim. Faster at what? A single local read is 10,000x slower over Redis. Redis wins on shared consistency and total throughput, not per-read latency. Saying 'faster' with no axis lets each person fill in their own meaning, and they end up agreeing to different things.", ar: "«Redis أسرع» تبدو مقارنة لكنها تُخفي ادّعاءً مطلقاً. أسرع في ماذا؟ القراءة المحلية الواحدة أبطأ 10,000 مرة عبر Redis. يتفوّق Redis في الاتساق المشترك والـ throughput الكلي، لا في latency القراءة الواحدة. قول «أسرع» دون محور يجعل كلّ شخص يملأ معناه الخاص، فيتّفقون على أشياء مختلفة." } },
        { t: "mistake",
          title: { en: "Ignoring reversibility", ar: "تجاهل قابلية التراجع" },
          body: { en: "The team argued the Redis decision for weeks as if it were permanent. It was not — a feature flag could switch back in a day. Cheap-to-undo decisions deserve a quick try, not a long debate; expensive-to-undo ones deserve the full write-up. Spending equal effort on both wastes time on the reversible ones and rushes the permanent ones.", ar: "ناقش الفريق قرار Redis أسابيع كأنه دائم. لم يكن كذلك — feature flag يعيده في يوم. القرارات الرخيصة التراجع تستحق تجربة سريعة لا نقاشاً طويلاً؛ والباهظة التراجع تستحق التوثيق الكامل. بذل الجهد نفسه على الاثنين يُهدر الوقت على القابل للتراجع ويستعجل الدائم." } }
      ]
    },
    {
      key: "interview",
      blocks: [
        { t: "qa", level: "junior",
          q: { en: "What does it mean to 'steelman' an argument?", ar: "ماذا يعني أن تُقوّي (steelman) حجة؟" },
          a: { en: "It means describing the other side's position in its strongest, fairest form before you argue against it — the opposite of a straw man, where you attack a weak version. I do it because if I can state their view so well they would nod, I actually understand what I am rejecting, and they trust that my choice is fair.", ar: "يعني وصف موقف الطرف الآخر بأقوى وأعدل صورة قبل معارضته — عكس الـ straw man حيث تهاجم نسخة ضعيفة. أفعله لأنني إن استطعت عرض رأيهم جيداً لدرجة أنهم يومئون، فأنا أفهم فعلاً ما أرفضه، ويثقون بأن اختياري عادل." } },
        { t: "qa", level: "mid",
          q: { en: "A teammate says an option is 'better'. How do you push the discussion forward?", ar: "زميل يقول إن خياراً «أفضل». كيف تدفع النقاش للأمام؟" },
          a: { en: "I ask 'better on which axis?' Better on latency, on cost, on how easy it is to operate? Then I ask for a number or a concrete fact for that axis. 'Better' alone lets everyone imagine a different meaning. Once we name the axis and put a number on it, the disagreement usually shrinks to one real question we can actually settle.", ar: "أسأل «أفضل على أي محور؟» على latency، أم التكلفة، أم سهولة التشغيل؟ ثم أطلب رقماً أو حقيقة ملموسة لذلك المحور. «أفضل» وحدها تجعل كلاً يتخيّل معنى مختلفاً. وحين نسمّي المحور ونضع عليه رقماً، يتقلّص الخلاف عادة إلى سؤال حقيقي واحد يمكننا حسمه." } },
        { t: "qa", level: "mid",
          q: { en: "When is writing a trade-off doc a waste of time?", ar: "متى تكون كتابة مستند مقايضة مضيعة للوقت؟" },
          a: { en: "When the decision is cheap to reverse. If I can switch back with a feature flag in an hour, I should just pick one, measure it in production, and change it if I was wrong. The written note earns its cost only when undoing the decision is expensive or slow — a database engine, a public API shape, a data model. Match the ceremony to the reversibility.", ar: "حين يكون القرار رخيص التراجع. إن استطعت العودة بـ feature flag في ساعة، فالأفضل أن أختار واحداً، أقيسه في الإنتاج، وأغيّره إن أخطأت. الملاحظة المكتوبة تستحق ثمنها فقط حين يكون التراجع باهظاً أو بطيئاً — محرّك قاعدة بيانات، شكل API عام، نموذج بيانات. لائم بين الرسميّة وقابلية التراجع." } },
        { t: "qa", level: "senior",
          q: { en: "You lost a technical argument you still think you were right about. What now?", ar: "خسرت نقاشاً تقنياً ما زلت تظنّ أنك كنت محقّاً فيه. ماذا الآن؟" },
          a: { en: "I disagree and commit. I state my concern once, in writing, so it is on record, then I fully back the chosen path — no quiet sabotage, no 'I told you so' later. A team that reverses every decision the moment one person keeps pushing never ships. If I turn out right, the written note lets us revisit with data, calmly, instead of re-fighting the same meeting.", ar: "أختلف وألتزم (disagree and commit). أذكر قلقي مرة، مكتوباً، ليكون موثّقاً، ثم أدعم المسار المختار بالكامل — دون تخريب صامت ولا «قلت لكم» لاحقاً. الفريق الذي يعكس كل قرار لحظة يضغط شخص واحد لا يُسلّم أبداً. وإن تبيّن أنني محقّ، تتيح الملاحظة المكتوبة مراجعة بالبيانات، بهدوء، بدل إعادة النقاش نفسه." } },
        { t: "qa", level: "senior",
          q: { en: "How do you argue a trade-off when the key numbers are unknown?", ar: "كيف تناقش مقايضة حين تكون الأرقام الأساسية مجهولة؟" },
          a: { en: "I do not guess with confidence — I name the unknown as the unknown, then propose the cheapest way to learn it. Usually that is a spike: a small throwaway prototype that measures the one number the decision hinges on. Arguing endlessly over an unmeasured number is theatre. Two hours of measurement beats two weeks of opinion, and it turns a belief fight into a fact.", ar: "لا أخمّن بثقة — أسمّي المجهول كمجهول، ثم أقترح أرخص طريقة لمعرفته. عادة يكون spike: نموذج أوّلي صغير يُرمى، يقيس الرقم الوحيد الذي يتوقّف عليه القرار. النقاش اللانهائي حول رقم غير مقيس مسرحية. ساعتان من القياس تتفوّقان على أسبوعين من الرأي، وتحوّلان معركة اعتقاد إلى حقيقة." } },
        { t: "qa", level: "staff",
          q: { en: "Your org keeps re-litigating the same decisions. How do you fix that structurally?", ar: "مؤسستك تعيد نقاش القرارات نفسها باستمرار. كيف تُصلح ذلك بنيوياً؟" },
          a: { en: "The root cause is usually that decisions are not written down, so there is nothing to point back to. I would introduce lightweight ADRs — a short record of what was decided and why, kept in the repo — and make 'link the ADR' part of the norm. Then a rule: you may re-open a decision only with new information, not a repeated opinion. That keeps the door open for real change while stopping the churn from people who just missed the meeting.", ar: "السبب الجذري عادة أن القرارات غير مكتوبة، فلا شيء نعود إليه. سأُدخل ADRs خفيفة — سجل قصير بما تقرّر ولماذا، يُحفظ في الـ repo — وأجعل «أرفق الـ ADR» عُرفاً. ثم قاعدة: يُعاد فتح القرار بمعلومة جديدة فقط، لا برأي مكرّر. هذا يُبقي الباب مفتوحاً للتغيير الحقيقي ويوقف التذبذب ممّن فاتهم الاجتماع." } }
      ]
    },
    {
      key: "codereview",
      blocks: [
        { t: "review", severity: "high",
          title: { en: "A PR description that asserts instead of trading off", ar: "وصف PR يجزم بدل أن يقايض" },
          bad: "## Why\nSwitched the catalog cache to Redis because it's the\nright way to do caching and MemoryCache doesn't scale.",
          good: "## Why\nMoved catalog cache to Redis.\nTrade-off: per-read latency goes ~50 ns -> ~0.5 ms, but all\nservers now see one consistent price (was: per-server drift).\nRejected 'keep MemoryCache': fine for rare changes, but our\nprices must match across servers. Reversible via flag in ~1 day.",
          why: { en: "The bad version gives a reviewer nothing to check — 'the right way' and 'doesn't scale' are opinions with no axis. The good version names the exact cost paid (latency), the benefit bought (consistency), why the alternative lost, and how reversible it is. Now the reviewer can agree or challenge one concrete claim instead of arguing about taste.", ar: "النسخة السيئة لا تعطي المراجع ما يفحصه — «الطريقة الصحيحة» و«لا يتوسّع» آراء بلا محور. النسخة الجيدة تسمّي التكلفة المدفوعة بدقّة (latency)، والفائدة المكتسبة (الاتساق)، ولماذا خسر البديل، ومدى قابلية التراجع. الآن يستطيع المراجع الموافقة أو الاعتراض على ادّعاء ملموس واحد بدل الجدال حول الذوق." } },
        { t: "review", severity: "medium",
          title: { en: "A design doc with no rejected options", ar: "مستند تصميم بلا خيارات مرفوضة" },
          bad: "## Proposal\nWe will use Redis for the shared cache.\n(no alternatives section)",
          good: "## Proposal\nUse Redis for the shared cache.\n## Options considered\n- MemoryCache (do nothing): rejected — per-server drift breaks\n  price consistency.\n- Redis: chosen — shared, consistent, ~0.5 ms reads.\n- Database only: rejected — read load too high at ~5k rps.",
          why: { en: "A design doc with only the chosen option hides whether the author even looked at alternatives. A reader cannot tell a considered decision from a default one. Listing the rejected options, each with a one-line reason, proves the space was explored and lets a reviewer spot a missing option — 'did you consider a read replica?' — early, when changing course is still cheap.", ar: "مستند تصميم بالخيار المختار فقط يُخفي إن كان الكاتب قد نظر أصلاً في البدائل. لا يستطيع القارئ تمييز قرار مدروس من قرار افتراضي. سرد الخيارات المرفوضة، كلّ بسطر سبب، يُثبت أن الفضاء استُكشف ويتيح للمراجع رصد خيار مفقود — «هل فكّرت في read replica؟» — مبكراً، حين يكون تغيير المسار ما زال رخيصاً." } }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        { t: "p",
          en: "Trade-off arguing is the core skill in any design review, RFC, or architecture meeting — the moments where a team commits to something expensive to change. The output that survives is never 'we chose X'. It is 'we chose X over Y and Z because of these costs, and here is what would make us revisit'. That written reasoning is what a future engineer reads instead of re-running the whole debate.",
          ar: "مناقشة المقايضات هي المهارة الأساس في أي design review أو RFC أو اجتماع معمارية — اللحظات التي يلتزم فيها الفريق بشيء باهظ التغيير. المخرج الذي يصمد ليس أبداً «اخترنا X». بل «اخترنا X على Y و Z بسبب هذه التكاليف، وهذا ما يجعلنا نعيد النظر». هذا المنطق المكتوب هو ما يقرؤه مهندس مستقبلي بدل إعادة النقاش كاملاً." },
        { t: "ul",
          en: [
            "Design reviews: the reviewer's job is to test whether the trade-off is honest, not to approve taste.",
            "RFC processes: a proposal without an 'alternatives considered' section is usually sent back.",
            "Post-incident reviews: 'why did we pick this?' is answered by the recorded trade-off, not memory.",
            "Vendor and build-vs-buy calls: the axes are cost, lock-in, and time-to-ship, and each must carry a number."
          ],
          ar: [
            "design reviews: مهمة المراجع اختبار صدق المقايضة، لا الموافقة على الذوق.",
            "عمليات RFC: مقترح بلا قسم «البدائل المدروسة» يُعاد عادة.",
            "مراجعات ما بعد الحوادث: «لماذا اخترنا هذا؟» تجيب عنه المقايضة الموثّقة لا الذاكرة.",
            "قرارات المورّد وbuild-vs-buy: المحاور هي التكلفة والـ lock-in ووقت التسليم، وكلٌّ يحمل رقماً."
          ]
        },
        { t: "callout", kind: "note",
          en: "The best design reviewers do not ask 'is this right?' They ask 'what did you give up, and what would change your mind?' If the author cannot answer the second, the trade-off was never really made.",
          ar: "أفضل مراجعي التصميم لا يسألون «هل هذا صحيح؟» بل «ماذا تنازلت عنه، وما الذي يُغيّر رأيك؟» إن لم يستطع الكاتب الإجابة عن الثاني، فالمقايضة لم تُتّخذ فعلاً." }
      ]
    },
    {
      key: "perf",
      blocks: [
        { t: "kv", rows: [
          { k: { en: "Latency", ar: "Latency" }, v: { en: "The axis people argue most; quantify per-operation, e.g. MemoryCache ~50 ns vs Redis ~0.5 ms per read.", ar: "المحور الأكثر نقاشاً؛ كمّمه لكل عملية، مثلاً MemoryCache ~50 ns مقابل Redis ~0.5 ms لكل قراءة." } },
          { k: { en: "Network", ar: "Network" }, v: { en: "Redis adds a network hop per read; at 5,000 reads/sec that is 5,000 extra round-trips per second to weigh.", ar: "Redis يضيف قفزة شبكة لكل قراءة؛ عند 5,000 قراءة/ثانية هذه 5,000 round-trip إضافية في الثانية تُوزَن." } },
          { k: { en: "Memory", ar: "Memory" }, v: { en: "MemoryCache duplicates the catalog in every server's RAM; Redis holds one copy — compare total vs per-node cost.", ar: "MemoryCache يكرّر الكتالوج في RAM كل server؛ Redis يحمل نسخة واحدة — قارن التكلفة الكلية مقابل تكلفة العقدة." } },
          { k: { en: "Scalability", ar: "Scalability" }, v: { en: "Redis scales the cache independently of app servers; MemoryCache grows only when you add servers.", ar: "Redis يوسّع الـ cache مستقلاً عن app servers؛ MemoryCache ينمو فقط بإضافة servers." } },
          { k: { en: "Latency (tail)", ar: "Latency (الذيل)" }, v: { en: "Redis adds a shared failure point: if it slows, every server slows together — state the p99, not just the average.", ar: "Redis يضيف نقطة فشل مشتركة: إن تباطأ، تتباطأ كل الـ servers معاً — اذكر p99 لا المتوسط فقط." } }
        ]}
      ]
    },
    {
      key: "debug",
      blocks: [
        { t: "ul",
          en: [
            "Write the opposing position first: if you cannot state it fairly in three sentences, you do not understand the decision yet.",
            "Replace every adjective with a number: scan your draft for 'fast', 'better', 'clean' — each is a hidden, unmeasured claim.",
            "Ask 'compared to what?': a benefit with no named alternative is not a trade-off, just a wish.",
            "Ask 'what would change my mind?': if nothing could, you are defending a belief, not analysing a choice.",
            "Check reversibility before length: cheap-to-undo means try it; expensive-to-undo means write the full note."
          ],
          ar: [
            "اكتب الموقف المعارض أولاً: إن لم تستطع عرضه بإنصاف في ثلاث جمل، فأنت لم تفهم القرار بعد.",
            "استبدل كل صفة برقم: افحص مسودتك بحثاً عن «سريع» و«أفضل» و«نظيف» — كلّ منها ادّعاء خفي غير مقيس.",
            "اسأل «مقارنة بماذا؟»: فائدة بلا بديل مسمّى ليست مقايضة، بل أمنية.",
            "اسأل «ما الذي يُغيّر رأيي؟»: إن لم يكن شيء ليفعل، فأنت تدافع عن اعتقاد لا تحلّل اختياراً.",
            "افحص قابلية التراجع قبل الطول: رخيص التراجع يعني جرّبه؛ باهظ التراجع يعني اكتب الملاحظة كاملة."
          ]
        },
        { t: "callout", kind: "tip",
          en: "If a debate is stuck, stop arguing conclusions and write the trade-off grid together on a shared screen. People agree on facts far faster than on recommendations, and the grid usually shows the answer once the numbers are side by side.",
          ar: "إن علق نقاش، توقّف عن مجادلة الاستنتاجات واكتبوا جدول المقايضة معاً على شاشة مشتركة. يتّفق الناس على الحقائق أسرع بكثير من الاتفاق على التوصيات، والجدول يُظهر الجواب عادة حين تصطف الأرقام جنباً إلى جنب." }
      ]
    },
    {
      key: "realworld",
      blocks: [
        { t: "p",
          en: "Any industry where a decision is expensive to reverse leans hard on written trade-offs. The pattern is the same everywhere: name the options, score the axes that matter, record the choice and its reason so the team is not re-arguing it a year later when the original people have moved on.",
          ar: "أي صناعة يكون فيها القرار باهظ التراجع تعتمد بشدّة على المقايضات المكتوبة. النمط واحد في كل مكان: سمِّ الخيارات، قيّم المحاور المهمّة، وثّق الاختيار وسببه كي لا يعيد الفريق نقاشه بعد سنة حين يكون أصحابه الأصليون قد رحلوا." },
        { t: "ul",
          en: [
            "Platform teams: choosing a database or message broker, where migration later costs months.",
            "Payment systems: build-vs-buy on fraud tooling, weighing cost against lock-in and compliance.",
            "Regulated industries: every architecture choice needs a written, defensible reason for auditors.",
            "Open-source projects: RFCs with an 'alternatives considered' section are required before a big change merges."
          ],
          ar: [
            "فرق المنصّات: اختيار قاعدة بيانات أو message broker، حيث تكلّف الـ migration لاحقاً شهوراً.",
            "أنظمة الدفع: build-vs-buy على أدوات الاحتيال، بموازنة التكلفة مع lock-in والامتثال.",
            "الصناعات المنظَّمة: كل خيار معماري يحتاج سبباً مكتوباً قابلاً للدفاع أمام المدقّقين.",
            "مشاريع المصدر المفتوح: RFCs بقسم «البدائل المدروسة» مطلوبة قبل دمج أي تغيير كبير."
          ]
        }
      ]
    },
    {
      key: "exercises",
      blocks: [
        { t: "ex", diff: "easy",
          en: "Take a recent decision you made ('I used a Dictionary here') and write one sentence naming what you gave up by choosing it. If you cannot name a cost, you did not make a trade-off — you made a default. You are done when the sentence names a real alternative and a real cost.",
          ar: "خُذ قراراً اتخذته مؤخراً («استخدمت Dictionary هنا») واكتب جملة واحدة تسمّي ما تنازلت عنه باختياره. إن لم تستطع تسمية تكلفة، فأنت لم تتّخذ مقايضة — بل خياراً افتراضياً. تنتهي حين تسمّي الجملة بديلاً حقيقياً وتكلفة حقيقية." },
        { t: "ex", diff: "medium",
          en: "Pick a technical opinion you hold strongly (e.g. 'always use async'). Write the strongest steelman for the opposite view in three sentences, with no 'but'. You are done when someone who holds that opposite view would read it and say 'yes, that is my reason'.",
          ar: "اختر رأياً تقنياً تتمسّك به بقوة (مثلاً «استخدم async دائماً»). اكتب أقوى steelman للرأي المعاكس في ثلاث جمل، دون «لكن». تنتهي حين يقرؤه صاحب الرأي المعاكس ويقول «نعم، هذا سببي»." },
        { t: "ex", diff: "hard",
          en: "Take a real choice your team faces and write the half-page trade-off note from this lesson: decision, options including 'do nothing', a grid with at least three axes and a number on each, a steelman of the option you reject, a recommendation, and its reversibility. You are done when a teammate can decide from the note without a meeting.",
          ar: "خُذ اختياراً حقيقياً يواجهه فريقك واكتب ملاحظة المقايضة بنصف صفحة من هذا الدرس: القرار، الخيارات ومنها «لا تفعل شيئاً»، جدول بثلاثة محاور على الأقل ورقم على كلّ، steelman للخيار الذي ترفضه، توصية، وقابلية تراجعها. تنتهي حين يستطيع زميل أن يقرّر من الملاحظة دون اجتماع." },
        { t: "ex", diff: "senior",
          en: "Introduce lightweight ADRs to your team: add a one-page template to the repo, write the first record for a decision already made, and propose the rule 'a decision re-opens only with new information'. You are done when the next architecture debate ends with a linked ADR instead of a verbal agreement nobody can find later.",
          ar: "أدخِل ADRs خفيفة لفريقك: أضِف قالباً بصفحة واحدة إلى الـ repo، اكتب أول سجل لقرار مُتّخَذ أصلاً، واقترح قاعدة «يُعاد فتح القرار بمعلومة جديدة فقط». تنتهي حين ينتهي النقاش المعماري التالي بـ ADR مرتبط بدل اتفاق شفهي لا يجده أحد لاحقاً." }
      ]
    },
    {
      key: "refs",
      blocks: [
        { t: "ref", label: { en: "Paul Graham — How to Disagree", ar: "Paul Graham — How to Disagree" }, url: "https://paulgraham.com/disagree.html", meta: { en: "Essay", ar: "مقالة" } },
        { t: "ref", label: { en: "Michael Nygard — Documenting Architecture Decisions (ADRs)", ar: "Michael Nygard — توثيق قرارات المعمارية (ADRs)" }, url: "https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions", meta: { en: "Article", ar: "مقالة" } },
        { t: "ref", label: { en: "Design Docs at Google", ar: "Design Docs at Google" }, url: "https://www.industrialempathy.com/posts/design-docs-at-google/", meta: { en: "Article", ar: "مقالة" } },
        { t: "ref", label: { en: "Disagree and commit", ar: "Disagree and commit" }, url: "https://en.wikipedia.org/wiki/Disagree_and_commit", meta: { en: "Reference", ar: "مرجع" } }
      ]
    }
  ],
  quiz: [
    {
      q: { en: "What is 'steelmanning' an argument?", ar: "ما هو steelmanning للحجة؟" },
      options: [
        { en: "Stating the opposing view in its strongest, fairest form", ar: "عرض الرأي المخالف بأقوى وأعدل صورة له" },
        { en: "Repeating your own point more forcefully", ar: "تكرار وجهة نظرك بقوة أكبر" },
        { en: "Attacking a weakened version of the other side", ar: "مهاجمة نسخة مُضعَفة من الطرف الآخر" },
        { en: "Refusing to commit until you are proven right", ar: "رفض الالتزام حتى يُثبَت أنك محق" }
      ],
      correct: 0,
      why: { en: "Steelmanning is the opposite of a straw man: you present the other side at its strongest before arguing against it, which builds trust and proves you understood it.", ar: "الـ steelman عكس الـ straw man: تعرض الطرف الآخر بأقوى صورة قبل معارضته، ما يبني الثقة ويُثبت أنك فهمته." }
    },
    {
      q: { en: "Why is 'Redis is faster' a weak line in a trade-off argument?", ar: "لماذا «Redis أسرع» سطر ضعيف في حجة مقايضة؟" },
      options: [
        { en: "Redis is never faster than MemoryCache", ar: "Redis ليس أسرع من MemoryCache أبداً" },
        { en: "It hides an absolute claim with no axis — faster at what?", ar: "يُخفي ادّعاءً مطلقاً بلا محور — أسرع في ماذا؟" },
        { en: "Speed never matters for caching decisions", ar: "السرعة لا تهمّ أبداً في قرارات الـ caching" },
        { en: "It is too long to fit in a design doc", ar: "أطول من أن يتّسع في مستند تصميم" }
      ],
      correct: 1,
      why: { en: "'Faster' with no axis lets each reader fill in their own meaning. In fact a single Redis read is far slower per read; it wins on shared consistency and total throughput. Name the axis.", ar: "«أسرع» بلا محور يجعل كل قارئ يملأ معناه. فعلياً قراءة Redis الواحدة أبطأ بكثير؛ يتفوّق في الاتساق المشترك والـ throughput الكلي. سمِّ المحور." }
    },
    {
      q: { en: "You lost a technical argument but still think you were right. What is 'disagree and commit'?", ar: "خسرت نقاشاً تقنياً لكنك ما زلت تظنّ أنك محق. ما هو disagree and commit؟" },
      options: [
        { en: "Quietly implement your own way anyway", ar: "نفّذ طريقتك بهدوء على أي حال" },
        { en: "Keep re-opening the debate until you win", ar: "أعِد فتح النقاش حتى تفوز" },
        { en: "State your concern once, then fully back the chosen path", ar: "اذكر قلقك مرة، ثم ادعم المسار المختار بالكامل" },
        { en: "Escalate to a manager to overrule the team", ar: "صعّد للمدير كي يتجاوز قرار الفريق" }
      ],
      correct: 2,
      why: { en: "Disagree and commit means you record your concern, then support the decision fully with no quiet sabotage. A team that reverses every call under pressure never ships.", ar: "disagree and commit تعني أن توثّق قلقك، ثم تدعم القرار بالكامل دون تخريب صامت. الفريق الذي يعكس كل قرار تحت الضغط لا يُسلّم أبداً." }
    },
    {
      q: { en: "When is writing a full trade-off doc usually not worth it?", ar: "متى لا يستحق كتابة مستند مقايضة كامل غالباً؟" },
      options: [
        { en: "When the decision is cheap and fast to reverse", ar: "حين يكون القرار رخيصاً وسريع التراجع" },
        { en: "When more than two people disagree", ar: "حين يختلف أكثر من شخصين" },
        { en: "When the topic involves a database", ar: "حين يتعلّق الموضوع بقاعدة بيانات" },
        { en: "When you already know which option you prefer", ar: "حين تعرف أصلاً الخيار الذي تفضّله" }
      ],
      correct: 0,
      why: { en: "Match the ceremony to reversibility. If a feature flag can switch it back in an hour, just try one and measure. The written note earns its cost only when undoing is expensive or slow.", ar: "لائم الرسميّة مع قابلية التراجع. إن أعاده feature flag في ساعة، فجرّب واحداً وقِس. الملاحظة المكتوبة تستحق ثمنها فقط حين يكون التراجع باهظاً أو بطيئاً." }
    },
    {
      q: { en: "What structural fix best stops a team from re-litigating the same decisions?", ar: "ما الإصلاح البنيوي الأفضل لإيقاف إعادة الفريق نقاش القرارات نفسها؟" },
      options: [
        { en: "Let the most senior engineer decide every time", ar: "دع الأقدم يقرّر في كل مرة" },
        { en: "Ban all disagreement in meetings", ar: "امنع كل خلاف في الاجتماعات" },
        { en: "Record decisions as ADRs and re-open only with new information", ar: "وثّق القرارات كـ ADRs وأعِد فتحها بمعلومة جديدة فقط" },
        { en: "Make every decision permanent and non-reversible", ar: "اجعل كل قرار دائماً وغير قابل للتراجع" }
      ],
      correct: 2,
      why: { en: "The usual root cause is that decisions are never written down. Lightweight ADRs give something to point back to, and the 'new information only' rule keeps real change possible while stopping repeated-opinion churn.", ar: "السبب الجذري المعتاد أن القرارات لا تُكتب. ADRs خفيفة تعطي ما نعود إليه، وقاعدة «معلومة جديدة فقط» تُبقي التغيير الحقيقي ممكناً وتوقف تذبذب الرأي المكرّر." }
    }
  ]
};
```

NEXT: DONE
