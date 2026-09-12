```js
const codeReviewLesson = {
  id: "code-review",
  moduleId: "skills",
  title: { en: "Reviewing code well", ar: "مراجعة الكود بشكل جيد" },
  summary: {
    en: "What to actually look for in a pull request, how to give feedback that gets acted on, and when to block a change versus just leave a comment.",
    ar: "ما الذي تبحث عنه فعلياً في الـ pull request، وكيف تعطي feedback يُنفَّذ فعلاً، ومتى توقف التغيير (block) بدل ترك مجرد comment."
  },
  mins: 14,
  sections: [
    {
      key: "why",
      blocks: [
        { t: "p",
          en: "A code review is one engineer reading another engineer's change before it ships, to catch problems and share knowledge. It is not a gate to prove you are smarter than the author.",
          ar: "الـ code review هو أن يقرأ مهندس تغيير مهندس آخر قبل أن يُشحَن، ليكتشف المشاكل ويشارك المعرفة. ليس بوابة تثبت فيها أنك أذكى من كاتب الكود." },
        { t: "kv", rows: [
          { k: { en: "Pull request (PR)", ar: "Pull request (PR)" },
            v: { en: "A proposed change to the codebase, waiting to be reviewed and merged.", ar: "تغيير مقترَح على الكود، ينتظر أن تتم مراجعته ودمجه." } },
          { k: { en: "Diff", ar: "Diff" },
            v: { en: "The exact lines this PR adds, removes, or edits — the reviewer reads the diff, not the whole repo.", ar: "الأسطر التي يضيفها أو يحذفها أو يعدّلها هذا الـ PR — المراجع يقرأ الـ diff لا كامل المشروع." } },
          { k: { en: "Approve / block", ar: "Approve / block" },
            v: { en: "Approve lets the PR merge; block (request changes) stops it until fixed.", ar: "الـ approve يسمح بالدمج؛ والـ block (request changes) يوقفه حتى يُصلَح." } },
          { k: { en: "Nit", ar: "Nit" },
            v: { en: "A small, optional suggestion the author can take or ignore — spelling, naming, style.", ar: "اقتراح صغير اختياري يمكن للكاتب أخذه أو تجاهله — إملاء، تسمية، style." } },
          { k: { en: "LGTM", ar: "LGTM" },
            v: { en: "\"Looks good to me\" — a shorthand approval.", ar: "«Looks good to me» — اختصار للموافقة." } }
        ]},
        { t: "p",
          en: "Every change carries risk: a bug, a security hole, a design that will be painful to extend later. A review is a second pair of eyes catching what the author, who has been staring at this for hours, can no longer see.",
          ar: "كل تغيير يحمل مخاطرة: bug، أو ثغرة أمنية، أو تصميم سيصعب توسيعه لاحقاً. المراجعة هي عين ثانية تلتقط ما لم يعد كاتب الكود، الذي يحدّق فيه منذ ساعات، قادراً على رؤيته." },
        { t: "p",
          en: "Think of it like a colleague proofreading your email before you send it to a client. They are not attacking your writing — they catch the typo you stopped seeing an hour ago. A good review has the same spirit.",
          ar: "تخيّلها كزميل يراجع بريدك قبل إرساله لعميل. هو لا يهاجم كتابتك — بل يلتقط الخطأ الذي لم تعد تراه منذ ساعة. المراجعة الجيدة بنفس الروح." },
        { t: "callout", kind: "note",
          en: "Our running example through this lesson: a PR that adds a \"POST /checkout/apply-discount\" endpoint, letting a customer apply a discount code to their cart.",
          ar: "المثال الجاري في الدرس كله: PR يضيف endpoint باسم «POST /checkout/apply-discount»، يسمح للعميل بتطبيق discount code على سلته." }
      ]
    },
    {
      key: "problem",
      blocks: [
        { t: "p",
          en: "Without review, the only person who ever reads the code is the one who wrote it. Bugs that a fresh reader would spot in seconds reach production, and only one person understands each part of the system.",
          ar: "بدون مراجعة، الشخص الوحيد الذي يقرأ الكود هو من كتبه. أخطاء يلتقطها قارئ جديد في ثوانٍ تصل إلى production، ويبقى شخص واحد فقط يفهم كل جزء من النظام." },
        { t: "p",
          en: "But a bad review is also a real cost. On the discount PR, a reviewer left 34 comments, most of them personal style preferences. The author spent two days reworking cosmetics while a real bug — the discount applied twice on retry — sat unnoticed. The review was busy but not useful.",
          ar: "لكن المراجعة السيئة تكلفة حقيقية أيضاً. في PR الـ discount، ترك المراجع 34 comment، معظمها تفضيلات style شخصية. قضى الكاتب يومين في تعديلات شكلية بينما بقي bug حقيقي — الخصم يُطبَّق مرتين عند الـ retry — دون أن يلاحظه أحد. المراجعة كانت مشغولة لكن غير مفيدة." },
        { t: "kv", rows: [
          { k: { en: "No review", ar: "بدون مراجعة" },
            v: { en: "Fast to merge, but bugs and knowledge silos ship straight to production.", ar: "دمج سريع، لكن الأخطاء وعزل المعرفة تصل مباشرة إلى production." } },
          { k: { en: "Nitpicky review", ar: "مراجعة نكِدة" },
            v: { en: "Slow, demoralizing, and misses the one bug that mattered.", ar: "بطيئة ومحبِطة، وتفوّت الـ bug الوحيد المهم." } },
          { k: { en: "Focused review", ar: "مراجعة مركّزة" },
            v: { en: "Catches the real risks, teaches both people, and merges within a day.", ar: "تلتقط المخاطر الحقيقية، تعلّم الطرفين، وتُدمَج خلال يوم." } }
        ]}
      ]
    },
    {
      key: "internals",
      blocks: [
        { t: "p",
          en: "A good review reads the change in a fixed order of importance, from most to least serious. You spend your attention on what can hurt, and treat everything below it as optional.",
          ar: "المراجعة الجيدة تقرأ التغيير بترتيب أهمية ثابت، من الأخطر إلى الأقل خطورة. تصرف انتباهك على ما يمكن أن يؤذي، وتعامل كل ما دونه كاختياري." },
        { t: "p",
          en: "Layer one is correctness and safety: does it do what it claims, and can it be abused? On the discount PR, the first question is whether applying the same code twice doubles the discount. That is a money bug, so it comes first.",
          ar: "الطبقة الأولى هي الصحة والأمان: هل يفعل ما يدّعيه، وهل يمكن إساءة استخدامه؟ في PR الـ discount، أول سؤال هو هل تطبيق نفس الكود مرتين يضاعف الخصم. هذا bug يمسّ المال، لذا يأتي أولاً." },
        { t: "p",
          en: "Layer two is design: will this shape be easy to change next month? Layer three is readability: can the next person understand it? Only at the bottom comes style — naming and formatting — which a linter should handle so a human never argues about it.",
          ar: "الطبقة الثانية هي التصميم: هل سيسهل تغيير هذا الشكل الشهر القادم؟ الطبقة الثالثة هي القابلية للقراءة: هل يفهمه الشخص التالي؟ وفي الأسفل فقط يأتي الـ style — التسمية والتنسيق — الذي يجب أن يتولّاه الـ linter كي لا يتجادل حوله بشر." },
        { t: "kv", rows: [
          { k: { en: "1. Correctness", ar: "1. الصحة" },
            v: { en: "Bugs, edge cases, security, data loss. Block on these.", ar: "أخطاء، حالات حدّية، أمان، فقدان بيانات. أوقف الدمج عليها." } },
          { k: { en: "2. Design", ar: "2. التصميم" },
            v: { en: "Boundaries, coupling, whether it fits the system. Discuss, block if serious.", ar: "الحدود، الاقتران، هل يناسب النظام. ناقش، وأوقف إن كان خطيراً." } },
          { k: { en: "3. Readability", ar: "3. القابلية للقراءة" },
            v: { en: "Clear names, obvious flow, comments where needed. Usually comment, rarely block.", ar: "أسماء واضحة، تدفّق مفهوم، comments عند الحاجة. غالباً comment، نادراً block." } },
          { k: { en: "4. Style", ar: "4. الـ Style" },
            v: { en: "Formatting, import order. Automate it; never block a human on it.", ar: "التنسيق، ترتيب الـ imports. أتمِته؛ لا توقف بشراً عليه أبداً." } }
        ]},
        { t: "p",
          en: "Tag each comment with its layer so the author knows what is required versus optional. A common convention prefixes comments with a label. \"nit:\" means take it or leave it; \"blocking:\" means this must change before merge.",
          ar: "علّم كل comment بطبقته كي يعرف الكاتب المطلوب من الاختياري. من الأعراف الشائعة أن تبدأ الـ comment بوسم. «nit:» تعني خذها أو اتركها؛ «blocking:» تعني يجب تغيير هذا قبل الدمج." },
        { t: "code", lang: "text",
          label: { en: "Labeled review comments on the discount PR", ar: "comments مراجعة موسومة على PR الـ discount" },
          code: "blocking: applying the same code twice stacks the discount.\n          Add a check that the code isn't already on the cart.\n\nquestion: what happens if the cart is empty here? 500 or 400?\n\nnit: `disc` could be `discount` — reads clearer, up to you.\n\npraise: nice touch returning the remaining balance in the response." }
      ]
    },
    {
      key: "tradeoffs",
      blocks: [
        { t: "tradeoff",
          pros: { en: [
            "Catches bugs before customers do, when fixing is cheap.",
            "Spreads knowledge so no part has a single owner.",
            "Raises the shared bar for what \"done\" means.",
            "New engineers learn the codebase fast by reading and being reviewed."
          ], ar: [
            "يلتقط الأخطاء قبل العملاء، حين يكون الإصلاح رخيصاً.",
            "ينشر المعرفة فلا يبقى لأي جزء مالك وحيد.",
            "يرفع المعيار المشترك لمعنى «done».",
            "المهندسون الجدد يتعلمون الكود بسرعة عبر القراءة والمراجعة."
          ]},
          cons: { en: [
            "Adds latency: a PR can wait hours or days for a reviewer.",
            "Can turn into style bikeshedding that teaches nothing.",
            "Tone can demoralize if feedback feels like an attack."
          ], ar: [
            "يضيف تأخيراً: قد ينتظر الـ PR ساعات أو أياماً لمراجع.",
            "قد يتحوّل إلى جدال style لا يعلّم شيئاً (bikeshedding).",
            "النبرة قد تُحبِط إن بدا الـ feedback هجوماً."
          ]},
          limits: { en: [
            "A reviewer can only catch what the diff shows, not hidden runtime behavior.",
            "Does not replace tests — it complements them.",
            "Huge PRs get rubber-stamped because no one can hold them in their head."
          ], ar: [
            "المراجع يلتقط فقط ما يظهره الـ diff، لا السلوك المخفي في وقت التشغيل.",
            "لا يحلّ محل الـ tests — بل يكمّلها.",
            "الـ PR الضخمة تُوافَق شكلياً لأن لا أحد يستوعبها ذهنياً."
          ]},
          alts: { en: [
            "Pair programming — review happens live while writing.",
            "Automated checks (linters, tests, static analysis) for the mechanical parts.",
            "Post-merge review for very high-trust, low-risk changes."
          ], ar: [
            "Pair programming — المراجعة تحدث مباشرة أثناء الكتابة.",
            "فحوصات آلية (linters، tests، static analysis) للأجزاء الميكانيكية.",
            "مراجعة بعد الدمج للتغييرات عالية الثقة قليلة المخاطر."
          ]}
        }
      ]
    },
    {
      key: "mistakes",
      blocks: [
        { t: "mistake",
          title: { en: "Reviewing style instead of substance", ar: "مراجعة الـ style بدل الجوهر" },
          body: { en: "The reviewer left 30 comments on naming and spacing on the discount PR and approved it. The double-apply money bug shipped. Automate style with a linter so your eyes are free for real risks.", ar: "ترك المراجع 30 comment على التسمية والمسافات في PR الـ discount ووافق عليه. وصل bug المال (الخصم المزدوج) إلى production. أتمِت الـ style بـ linter كي تتفرّغ عيناك للمخاطر الحقيقية." } },
        { t: "mistake",
          title: { en: "Rewriting the code in your head", ar: "إعادة كتابة الكود في رأسك" },
          body: { en: "The reviewer demanded the author rewrite a working solution to match how they personally would have done it. If the code is correct and clear, \"I would have done it differently\" is not a reason to block.", ar: "طلب المراجع من الكاتب إعادة كتابة حلّ يعمل ليطابق طريقته الشخصية. إن كان الكود صحيحاً وواضحاً، فإن «كنت سأفعلها بشكل مختلف» ليس سبباً للـ block." } },
        { t: "mistake",
          title: { en: "Vague feedback the author can't act on", ar: "feedback غامض لا يستطيع الكاتب التصرّف بناءً عليه" },
          body: { en: "A comment said \"this feels off.\" The author had no idea what to change. Say what is wrong, why it matters, and ideally show the fix — a comment the author cannot act on is noise.", ar: "قال أحد الـ comments «هذا يبدو خاطئاً». لم يعرف الكاتب ماذا يغيّر. قل ما الخطأ، ولماذا يهم، ويُفضّل أن تُظهر الإصلاح — comment لا يمكن التصرّف بناءً عليه ضوضاء." } },
        { t: "mistake",
          title: { en: "Sitting on the PR for days", ar: "ترك الـ PR أياماً" },
          body: { en: "The reviewer let the discount PR wait four days. The author moved on, lost context, and had to relearn it to address comments. Review small PRs within a day; a slow review costs more than it looks.", ar: "ترك المراجع PR الـ discount ينتظر أربعة أيام. انتقل الكاتب لعمل آخر، فقد السياق، واضطر لإعادة تعلّمه ليعالج الـ comments. راجع الـ PRs الصغيرة خلال يوم؛ المراجعة البطيئة أغلى مما تبدو." } }
      ]
    },
    {
      key: "interview",
      blocks: [
        { t: "qa", level: "junior",
          q: { en: "What is the point of a code review?", ar: "ما الغرض من الـ code review؟" },
          a: { en: "Two things. Catch problems — bugs, security holes, bad design — before they reach production where they cost far more. And spread knowledge, so more than one person understands each part of the system. It is a safety net and a teaching tool, not a test of the author.", ar: "شيئان. التقاط المشاكل — أخطاء، ثغرات أمان، تصميم سيّئ — قبل وصولها إلى production حيث تكلّف أكثر بكثير. ونشر المعرفة، فيفهم أكثر من شخص كل جزء من النظام. هي شبكة أمان وأداة تعليم، لا اختبار للكاتب." } },
        { t: "qa", level: "mid",
          q: { en: "When do you block a PR versus just leave a comment?", ar: "متى توقف الـ PR (block) مقابل ترك مجرد comment؟" },
          a: { en: "I block on correctness and security — a real bug, a data-loss risk, an exploit. Those must not merge. For design concerns I discuss and block only if it will be expensive to undo later. For readability and style I comment or mark it a nit, and I let the author decide. The rule: block on what can hurt, comment on what is preference.", ar: "أوقف على الصحة والأمان — bug حقيقي، خطر فقدان بيانات، ثغرة. هذه يجب ألا تُدمَج. لمخاوف التصميم أناقش وأوقف فقط إن كان التراجع لاحقاً مكلفاً. للقراءة والـ style أترك comment أو أسمّيه nit وأترك القرار للكاتب. القاعدة: أوقف على ما يؤذي، وعلّق على ما هو تفضيل." } },
        { t: "qa", level: "mid",
          q: { en: "How do you review a very large PR?", ar: "كيف تراجع PR ضخماً جداً؟" },
          a: { en: "Honestly, I try not to. A 2000-line PR gets rubber-stamped because no one can hold it in their head. I ask the author to split it — one PR for the refactor, one for the new feature. If it truly cannot be split, I review it in focused passes: correctness first across the whole thing, then design, and I say clearly which parts I read carefully and which I did not.", ar: "بصراحة أحاول ألا أفعل. الـ PR بحجم 2000 سطر يُوافَق شكلياً لأن لا أحد يستوعبه ذهنياً. أطلب من الكاتب تقسيمه — PR للـ refactor وآخر للميزة الجديدة. إن تعذّر التقسيم فعلاً، أراجعه في تمريرات مركّزة: الصحة أولاً عبر الكل، ثم التصميم، وأوضّح أي أجزاء قرأتها بعناية وأيها لا." } },
        { t: "qa", level: "senior",
          q: { en: "A junior keeps writing correct but hard-to-read code. How do you handle it in reviews?", ar: "مبتدئ يكتب كوداً صحيحاً لكن صعب القراءة باستمرار. كيف تتعامل معه في المراجعات؟" },
          a: { en: "I don't fix it silently or block every PR, both teach nothing. I pick the one or two clearest examples, explain why the next reader will struggle, and show a concrete rewrite. I frame it as a pattern, not a personal flaw. And I do it consistently so they internalize the standard instead of guessing at my mood.", ar: "لا أصلحه بصمت ولا أوقف كل PR، فكلاهما لا يعلّم شيئاً. أختار مثالاً أو مثالين أوضح، أشرح لماذا سيتعثّر القارئ التالي، وأعرض إعادة كتابة ملموسة. أطرحها كنمط لا كعيب شخصي. وأفعلها بثبات كي يستوعب المعيار بدل تخمين مزاجي." } },
        { t: "qa", level: "senior",
          q: { en: "You disagree with the author and neither of you will move. What now?", ar: "تختلف مع الكاتب ولا أحد سيتنازل. ماذا تفعل؟" },
          a: { en: "First I separate blocking from preference. If it is just preference, I disagree and commit — I let it merge and note my view, because blocking on taste wastes everyone's time. If I genuinely think it is a correctness or design risk, we get a third opinion instead of a comment-thread war. The goal is the right decision, not winning.", ar: "أولاً أفصل الـ blocking عن التفضيل. إن كان تفضيلاً فقط، أختلف وألتزم (disagree and commit) — أدع الدمج يمرّ وأسجّل رأيي، لأن الـ block على الذوق يضيّع وقت الجميع. إن كنت أرى فعلاً خطر صحة أو تصميم، نأخذ رأياً ثالثاً بدل حرب في الـ comments. الهدف القرار الصحيح لا الانتصار." } },
        { t: "qa", level: "staff",
          q: { en: "Reviews across the org are slow and full of nitpicks. How do you fix it structurally?", ar: "المراجعات في المؤسسة بطيئة ومليئة بالـ nitpicks. كيف تصلحها هيكلياً؟" },
          a: { en: "I attack it at the process level, not by nagging people. Automate every mechanical thing — formatting, linting, import order — in CI so no human ever comments on it. Set a norm for small PRs and a review-time expectation, say within a day. Publish a short review guide that ranks correctness over style, and label comments as blocking versus nit so authors know what is required. Culture follows the defaults you make easy.", ar: "أعالجها على مستوى العملية لا بتذكير الناس. أتمِت كل شيء ميكانيكي — تنسيق، linting، ترتيب imports — في الـ CI كي لا يعلّق عليه بشر. أضع عرفاً للـ PRs الصغيرة وتوقّعاً لزمن المراجعة، مثلاً خلال يوم. أنشر دليل مراجعة قصيراً يرتّب الصحة فوق الـ style، ويسِم الـ comments كـ blocking أو nit كي يعرف الكتّاب المطلوب. الثقافة تتبع الإعدادات الافتراضية التي تجعلها سهلة." } }
      ]
    },
    {
      key: "codereview",
      blocks: [
        { t: "review", severity: "high",
          title: { en: "Approving without checking the money path", ar: "الموافقة دون فحص مسار المال" },
          bad: "// Reviewer comment:\n// LGTM, ship it 👍\n\n// The code, unreviewed:\ncart.Discount += code.Amount;   // runs every time apply is called",
          good: "// Reviewer comment:\n// blocking: this adds the discount every call. Applying the\n// same code twice doubles it. Guard against re-apply:\n\nif (cart.AppliedCodes.Contains(code.Id)) return AlreadyApplied();\ncart.AppliedCodes.Add(code.Id);\ncart.Discount += code.Amount;",
          why: { en: "The reviewer approved a change that touches money without tracing what happens on a repeat call. Anything affecting money, auth, or data deletion must be read line by line — a fast LGTM there is negligence, not trust.", ar: "وافق المراجع على تغيير يمسّ المال دون تتبّع ما يحدث عند نداء متكرر. أي شيء يمسّ المال أو الـ auth أو حذف البيانات يجب قراءته سطراً بسطر — الـ LGTM السريع هناك إهمال لا ثقة." } },
        { t: "review", severity: "low",
          title: { en: "Blocking a merge over a naming preference", ar: "إيقاف الدمج بسبب تفضيل تسمية" },
          bad: "// Reviewer marks \"Request changes\" (blocks merge):\n// This should be `applyDiscountCode`, not `applyCode`.\n// Rename before I approve.",
          good: "// Reviewer leaves a plain comment, still approves:\n// nit: `applyCode` reads a bit generic — `applyDiscountCode`\n// is clearer. Your call, not blocking.",
          why: { en: "Naming is a preference, not a defect. Blocking the merge on it forces another full review round for zero risk reduction and signals that the reviewer's taste outranks shipping. Mark it a nit and approve.", ar: "التسمية تفضيل لا عيب. الـ block عليها يفرض جولة مراجعة كاملة أخرى دون تقليل مخاطر، ويوحي بأن ذوق المراجع أهم من الشحن. سمِّها nit ووافق." } }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        { t: "p",
          en: "In a real team, review is one stage in the path from commit to production, and it should be the human stage — the parts a machine can judge are handled before a person ever looks. CI runs the tests, the linter, and static analysis on every PR, so the reviewer only spends attention on judgment: is this correct, does the design fit, will the next person understand it.",
          ar: "في فريق حقيقي، المراجعة مرحلة واحدة في الطريق من الـ commit إلى production، ويجب أن تكون المرحلة البشرية — الأجزاء التي تحكمها آلة تُعالَج قبل أن ينظر أي شخص. الـ CI يشغّل الـ tests والـ linter والـ static analysis على كل PR، فيصرف المراجع انتباهه على الحكم فقط: هل هو صحيح، هل يناسب التصميم، هل سيفهمه الشخص التالي." },
        { t: "ul",
          en: [
            "Required checks: PR cannot merge until CI is green — tests, lint, build all pass automatically.",
            "Ownership routing: a CODEOWNERS file auto-requests the right reviewer for each area of the code.",
            "Branch protection: at least one approval required, and the branch must be up to date before merge.",
            "Size limits: warn or split PRs above a line count, since huge PRs get reviewed poorly."
          ],
          ar: [
            "فحوصات إلزامية: لا يُدمَج الـ PR حتى يكون الـ CI أخضر — tests، lint، build كلها تمرّ آلياً.",
            "توجيه الملكية: ملف CODEOWNERS يطلب تلقائياً المراجع المناسب لكل منطقة من الكود.",
            "حماية الفرع: موافقة واحدة على الأقل، ويجب أن يكون الفرع محدّثاً قبل الدمج.",
            "حدود الحجم: تحذير أو تقسيم للـ PRs فوق عدد أسطر معيّن، لأن الضخمة تُراجَع بشكل سيّئ."
          ]
        },
        { t: "callout", kind: "tip",
          en: "The single highest-leverage move: make small PRs the default. A 200-line PR gets a real review; a 2000-line PR gets an LGTM. Everything else follows from size.",
          ar: "أعلى تحرّك من حيث الأثر: اجعل الـ PRs الصغيرة هي الافتراضي. PR بـ 200 سطر يحصل على مراجعة حقيقية؛ وبـ 2000 سطر يحصل على LGTM. كل شيء آخر يتبع الحجم." }
      ]
    },
    {
      key: "perf",
      blocks: [
        { t: "kv", rows: [
          { k: { en: "Review latency", ar: "زمن المراجعة" },
            v: { en: "Time from \"review requested\" to first response. Target under a day; longer kills the author's momentum.", ar: "الزمن من «طلب المراجعة» إلى أول ردّ. الهدف أقل من يوم؛ الأطول يقتل زخم الكاتب." } },
          { k: { en: "PR size", ar: "حجم الـ PR" },
            v: { en: "Lines changed. Review quality drops sharply above ~400 lines — reviewers stop finding real defects.", ar: "الأسطر المتغيّرة. جودة المراجعة تنخفض بحدّة فوق ~400 سطر — يتوقف المراجعون عن إيجاد عيوب حقيقية." } },
          { k: { en: "Rounds to merge", ar: "جولات حتى الدمج" },
            v: { en: "Back-and-forth cycles. Many rounds usually means vague feedback or scope creep, not thoroughness.", ar: "دورات الأخذ والردّ. كثرتها غالباً تعني feedback غامضاً أو تمدّد نطاق، لا دقّة." } },
          { k: { en: "Defect escape rate", ar: "معدّل تسرّب العيوب" },
            v: { en: "Bugs that passed review and reached production. The real measure of whether reviews work.", ar: "الأخطاء التي مرّت من المراجعة ووصلت production. المقياس الحقيقي لفاعلية المراجعات." } },
          { k: { en: "Reviewer load", ar: "حِمل المراجع" },
            v: { en: "Open PRs per reviewer. If it piles on two seniors, latency spikes; spread it with CODEOWNERS.", ar: "الـ PRs المفتوحة لكل مراجع. إن تراكمت على senior اثنين، يقفز التأخير؛ وزّعها بـ CODEOWNERS." } }
        ]}
      ]
    },
    {
      key: "debug",
      blocks: [
        { t: "ul",
          en: [
            "PR metrics dashboard (GitHub Insights, LinearB): look at median time-to-first-review — a rising line means reviews are becoming a bottleneck.",
            "Comment-to-line ratio on merged PRs: very high with no blocking comments points to nitpick culture.",
            "CODEOWNERS review-request logs: check whether load concentrates on one or two people.",
            "Post-incident review of the PR that caused an outage: read what the reviewer approved and why the defect slipped.",
            "PR size histogram: a fat tail of huge PRs explains most rubber-stamping."
          ],
          ar: [
            "لوحة مقاييس الـ PRs (GitHub Insights، LinearB): انظر لوسيط زمن أول مراجعة — ارتفاعه يعني أن المراجعة صارت عنق زجاجة.",
            "نسبة الـ comments إلى الأسطر في الـ PRs المدموجة: نسبة عالية جداً دون comments حاسمة تشير لثقافة nitpick.",
            "سجلّات طلبات مراجعة CODEOWNERS: افحص هل يتركّز الحِمل على شخص أو شخصين.",
            "مراجعة ما بعد الحادث للـ PR الذي سبّب انقطاعاً: اقرأ ما وافق عليه المراجع ولماذا تسرّب العيب.",
            "توزيع أحجام الـ PRs: ذيل سمين من الـ PRs الضخمة يفسّر معظم الموافقة الشكلية."
          ]
        },
        { t: "callout", kind: "tip",
          en: "When reviews feel slow, measure time-to-first-review before blaming people. Often the fix is structural — smaller PRs, better reviewer routing — not \"try harder.\"",
          ar: "حين تبدو المراجعات بطيئة، قِس زمن أول مراجعة قبل لوم الأشخاص. غالباً الحلّ هيكلي — PRs أصغر، توجيه أفضل للمراجعين — لا «اجتهد أكثر»." }
      ]
    },
    {
      key: "realworld",
      blocks: [
        { t: "p",
          en: "The weight a review carries scales with how much a mistake costs in that domain. The same PR gets a light touch in one setting and a line-by-line audit in another, and mature teams tune their process to match.",
          ar: "الثقل الذي تحمله المراجعة يتناسب مع كلفة الخطأ في ذلك المجال. نفس الـ PR يحصل على لمسة خفيفة في مكان وتدقيق سطراً بسطر في آخر، والفرق الناضجة تضبط عمليتها بما يناسب." },
        { t: "ul",
          en: [
            "Payment systems: money-touching code gets two reviewers and a mandatory security pass, because a rounding or double-apply bug is direct financial loss.",
            "Open-source projects: reviews are also gatekeeping for strangers' code, so they lean heavily on automated checks and clear contribution guides.",
            "Fast-moving startups: lightweight review on low-risk paths to keep shipping, but strict review on the few dangerous areas.",
            "Regulated industries (health, finance): reviews are an audit record — who approved what and when — not just a quality step."
          ],
          ar: [
            "أنظمة الدفع: الكود الذي يمسّ المال يحصل على مراجعَين وتمريرة أمان إلزامية، لأن خطأ تقريب أو خصم مزدوج خسارة مالية مباشرة.",
            "مشاريع الـ open-source: المراجعة أيضاً بوابة لكود غرباء، لذا تعتمد بقوة على فحوصات آلية وأدلّة مساهمة واضحة.",
            "الشركات الناشئة السريعة: مراجعة خفيفة على المسارات قليلة المخاطر لإبقاء الشحن، لكن مراجعة صارمة على المناطق الخطيرة القليلة.",
            "الصناعات المنظّمة (صحة، مال): المراجعة سجلّ تدقيق — من وافق على ماذا ومتى — لا مجرد خطوة جودة."
          ]
        }
      ]
    },
    {
      key: "exercises",
      blocks: [
        { t: "ex", diff: "easy",
          en: "Take a recent merged PR of your own and re-read only the diff. Write down the single most important thing a reviewer should have checked. Success: you can name it in one sentence about correctness, not style.",
          ar: "خذ PR حديثاً لك تمّ دمجه وأعد قراءة الـ diff فقط. اكتب أهمّ شيء واحد كان على المراجع فحصه. النجاح: تسمّيه في جملة واحدة عن الصحة لا الـ style." },
        { t: "ex", diff: "medium",
          en: "Review a teammate's open PR using labeled comments: prefix each with blocking, question, nit, or praise. Success: every comment is actionable and the author knows exactly what must change before merge.",
          ar: "راجع PR مفتوحاً لزميل باستخدام comments موسومة: ابدأ كلاً بـ blocking أو question أو nit أو praise. النجاح: كل comment قابل للتنفيذ ويعرف الكاتب بالضبط ما يجب تغييره قبل الدمج." },
        { t: "ex", diff: "hard",
          en: "Take one 800-line PR and propose how to split it into three smaller PRs that can each be reviewed on its own. Success: each split PR is independently mergeable and under ~300 lines.",
          ar: "خذ PR بحجم 800 سطر واقترح كيف تقسمه إلى ثلاثة PRs أصغر يُراجَع كلّ منها وحده. النجاح: كل PR مقسوم قابل للدمج مستقلاً وأقل من ~300 سطر." },
        { t: "ex", diff: "senior",
          en: "Write a one-page review guide for your team: what to block on, what to comment on, the expected review time, and which checks CI automates. Success: two reviewers reading it would block on the same class of issues.",
          ar: "اكتب دليل مراجعة من صفحة واحدة لفريقك: على ماذا توقف الدمج، على ماذا تعلّق، الزمن المتوقع للمراجعة، وأي فحوصات يؤتمتها الـ CI. النجاح: مراجعان يقرآنه يوقفان الدمج على نفس صنف المشاكل." }
      ]
    },
    {
      key: "refs",
      blocks: [
        { t: "ref",
          label: { en: "Google Engineering Practices — Code Review", ar: "Google Engineering Practices — Code Review" },
          url: "https://google.github.io/eng-practices/review/",
          meta: { en: "Guide", ar: "دليل" } },
        { t: "ref",
          label: { en: "Conventional Comments — labeling review feedback", ar: "Conventional Comments — وسم feedback المراجعة" },
          url: "https://conventionalcomments.org/",
          meta: { en: "Convention", ar: "عُرف" } },
        { t: "ref",
          label: { en: "How to Do Code Reviews Like a Human — Michael Lynch", ar: "How to Do Code Reviews Like a Human — Michael Lynch" },
          url: "https://mtlynch.io/human-code-reviews-1/",
          meta: { en: "Article", ar: "مقال" } },
        { t: "ref",
          label: { en: "SmartBear — Best Practices for Peer Code Review", ar: "SmartBear — أفضل ممارسات مراجعة الأقران" },
          url: "https://smartbear.com/learn/code-review/best-practices-for-peer-code-review/",
          meta: { en: "Article", ar: "مقال" } }
      ]
    }
  ],
  quiz: [
    {
      q: { en: "Which issue should you block a PR on?", ar: "على أي مشكلة يجب أن توقف الـ PR (block)؟" },
      options: [
        { en: "A variable named `disc` instead of `discount`.", ar: "متغيّر اسمه `disc` بدل `discount`." },
        { en: "Applying the same discount code twice doubles the discount.", ar: "تطبيق نفس الـ discount code مرتين يضاعف الخصم." },
        { en: "An extra blank line between two methods.", ar: "سطر فارغ زائد بين دالتين." },
        { en: "The author used a `for` loop where you prefer LINQ.", ar: "استخدم الكاتب `for` حيث تفضّل أنت LINQ." }
      ],
      correct: 1,
      why: { en: "Correctness and money bugs must not merge — that is a blocking issue. The other three are style or preference: comment or mark them nits, but don't block.", ar: "أخطاء الصحة والمال يجب ألا تُدمَج — هذه مشكلة blocking. الثلاثة الأخرى style أو تفضيل: علّق أو سمّها nits، لكن لا توقف الدمج." }
    },
    {
      q: { en: "What should a good review look at first?", ar: "ما الذي تنظر إليه المراجعة الجيدة أولاً؟" },
      options: [
        { en: "Formatting and naming.", ar: "التنسيق والتسمية." },
        { en: "Whether the imports are sorted.", ar: "هل الـ imports مرتّبة." },
        { en: "Correctness and security — does it work and can it be abused?", ar: "الصحة والأمان — هل يعمل وهل يمكن إساءة استخدامه؟" },
        { en: "Whether the commit message is capitalized.", ar: "هل رسالة الـ commit تبدأ بحرف كبير." }
      ],
      correct: 2,
      why: { en: "Attention goes to the most serious layer first: correctness and security. Style is last and should be automated so a human never spends the first look on it.", ar: "ينصبّ الانتباه على الطبقة الأخطر أولاً: الصحة والأمان. الـ style أخيراً ويجب أتمتته كي لا يصرف بشرٌ أول نظرة عليه." }
    },
    {
      q: { en: "Why are very large PRs a problem for review?", ar: "لماذا الـ PRs الضخمة مشكلة للمراجعة؟" },
      options: [
        { en: "They always contain more bugs than small ones.", ar: "تحتوي دائماً أخطاءً أكثر من الصغيرة." },
        { en: "They get rubber-stamped because no one can hold them in their head.", ar: "تُوافَق شكلياً لأن لا أحد يستوعبها ذهنياً." },
        { en: "Git cannot diff them correctly.", ar: "الـ git لا يستطيع عمل diff صحيح لها." },
        { en: "They cannot pass CI.", ar: "لا تستطيع اجتياز الـ CI." }
      ],
      correct: 1,
      why: { en: "Review quality drops sharply with size — past a few hundred lines reviewers stop finding real defects and just approve. Splitting into small PRs is the fix.", ar: "جودة المراجعة تنخفض بحدّة مع الحجم — بعد بضع مئات من الأسطر يتوقف المراجعون عن إيجاد عيوب حقيقية ويوافقون فقط. التقسيم إلى PRs صغيرة هو الحلّ." }
    },
    {
      q: { en: "You and the author disagree, and it's a matter of taste, not correctness. Best move?", ar: "تختلف مع الكاتب، والمسألة ذوق لا صحة. أفضل تصرّف؟" },
      options: [
        { en: "Block the merge until they do it your way.", ar: "أوقف الدمج حتى يفعلها بطريقتك." },
        { en: "Disagree and commit — note your view and let it merge.", ar: "اختلف والتزم — سجّل رأيك ودع الدمج يمرّ." },
        { en: "Rewrite the code yourself and push it.", ar: "أعد كتابة الكود بنفسك وادفعه." },
        { en: "Escalate to the manager immediately.", ar: "صعّد للمدير فوراً." }
      ],
      correct: 1,
      why: { en: "On preference, disagree and commit: record your opinion but don't block, because blocking on taste wastes time and hurts trust. Save escalation for real correctness or design risks.", ar: "على التفضيل، اختلف والتزم: سجّل رأيك دون block، لأن الـ block على الذوق يضيّع الوقت ويضرّ الثقة. اترك التصعيد لمخاطر الصحة أو التصميم الحقيقية." }
    },
    {
      q: { en: "Reviews across the team are slow and nitpicky. Best structural fix?", ar: "المراجعات في الفريق بطيئة ونكِدة. أفضل حلّ هيكلي؟" },
      options: [
        { en: "Ask everyone to just try harder and be nicer.", ar: "اطلب من الجميع الاجتهاد أكثر واللطف فقط." },
        { en: "Remove code review entirely to move faster.", ar: "ألغِ الـ code review تماماً للتحرّك أسرع." },
        { en: "Automate style in CI, set a review-time norm, and label blocking vs nit.", ar: "أتمِت الـ style في الـ CI، ضع عرفاً لزمن المراجعة، وسِم blocking مقابل nit." },
        { en: "Assign all reviews to the two most senior engineers.", ar: "أسنِد كل المراجعات لأكثر مهندسَين أقدمية." }
      ],
      correct: 2,
      why: { en: "Fix the process, not the mood. Automating style frees human attention, a review-time norm cuts latency, and labeling makes required-vs-optional explicit. Concentrating reviews on two seniors just creates a new bottleneck.", ar: "أصلِح العملية لا المزاج. أتمتة الـ style تحرّر انتباه البشر، وعُرف زمن المراجعة يقلّل التأخير، والوسم يوضّح المطلوب من الاختياري. تركيز المراجعات على senior اثنين يخلق عنق زجاجة جديداً." }
    }
  ]
};
```

NEXT: design-doc
