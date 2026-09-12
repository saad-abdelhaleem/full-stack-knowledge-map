```js
const designDocLesson = {
  id: "design-doc",
  moduleId: "skills",
  title: { en: "Writing a design doc", ar: "كتابة مستند تصميم" },
  summary: {
    en: "A design doc explains a technical decision before you build it, so people can catch problems while they are still cheap to fix.",
    ar: "مستند التصميم يشرح قرار تقني قبل بنائه، حتى يكتشف الناس المشاكل وهي ما زالت رخيصة الإصلاح."
  },
  mins: 16,
  sections: [
    {
      key: "why",
      blocks: [
        {
          t: "p",
          en: "A design doc is a short written plan you share before you build something. It says what you are going to build, why, what other options you looked at, and what could go wrong. People read it and comment, so mistakes get caught early.",
          ar: "مستند التصميم خطة مكتوبة قصيرة تشاركها قبل أن تبني شيئاً. يقول ماذا ستبني، ولماذا، وما البدائل التي نظرت فيها، وما الذي قد يفشل. يقرأه الناس ويعلّقون، فتُكتشف الأخطاء مبكراً."
        },
        {
          t: "kv",
          rows: [
            { k: { en: "Design doc", ar: "Design doc" }, v: { en: "A written proposal for a technical change, reviewed before any code is written.", ar: "اقتراح مكتوب لتغيير تقني، تتم مراجعته قبل كتابة أي كود." } },
            { k: { en: "Context", ar: "Context" }, v: { en: "The background and the problem: why this work is happening now.", ar: "الخلفية والمشكلة: لماذا يحدث هذا العمل الآن." } },
            { k: { en: "Options / alternatives", ar: "Options / alternatives" }, v: { en: "The different ways you could solve the problem, not just the one you chose.", ar: "الطرق المختلفة لحل المشكلة، وليس فقط الطريقة التي اخترتها." } },
            { k: { en: "Trade-off", ar: "Trade-off" }, v: { en: "What you give up to get something else; every option has costs and benefits.", ar: "ما تتنازل عنه مقابل الحصول على شيء آخر؛ لكل خيار تكاليف وفوائد." } },
            { k: { en: "Decision", ar: "Decision" }, v: { en: "The option you picked and the reason, stated clearly so it can be revisited later.", ar: "الخيار الذي اخترته وسببه، مذكوراً بوضوح ليمكن مراجعته لاحقاً." } },
            { k: { en: "Reviewer", ar: "Reviewer" }, v: { en: "A colleague who reads the doc and gives feedback before you build.", ar: "زميل يقرأ المستند ويعطي ملاحظات قبل أن تبني." } }
          ]
        },
        {
          t: "p",
          en: "Here is the running example for this lesson: your team needs to add a feature that emails users a receipt after every payment. It sounds small. But you have to decide how to send the email, what happens if sending fails, and how to avoid sending the same receipt twice. A design doc forces those questions into the open before you write code.",
          ar: "هذا المثال الجاري في هذا الدرس: فريقك يحتاج إضافة ميزة ترسل للمستخدمين إيصالاً بالبريد بعد كل عملية دفع. تبدو بسيطة. لكن عليك أن تقرر كيف ترسل البريد، وماذا يحدث إذا فشل الإرسال، وكيف تتجنب إرسال نفس الإيصال مرتين. مستند التصميم يطرح هذه الأسئلة علناً قبل أن تكتب الكود."
        },
        {
          t: "p",
          en: "Think of it like a builder's plan for a house. The builder does not start pouring concrete and then decide where the bathroom goes. Moving a wall on paper costs a pencil eraser; moving it after it is built costs a demolition crew. A design doc is the paper stage for software.",
          ar: "فكّر فيه كخطة البنّاء للمنزل. البنّاء لا يبدأ بصب الخرسانة ثم يقرر أين سيكون الحمام. نقل جدار على الورق يكلّف ممحاة؛ ونقله بعد بنائه يكلّف طاقم هدم. مستند التصميم هو مرحلة الورق للبرمجيات."
        },
        {
          t: "callout",
          kind: "tip",
          en: "A design doc is not documentation of finished work. It is a decision-making tool used before the work. If you write it after building, you get the paperwork cost without the main benefit: catching problems early.",
          ar: "مستند التصميم ليس توثيقاً لعمل منتهٍ. هو أداة لاتخاذ القرار تُستخدم قبل العمل. إذا كتبته بعد البناء، تدفع تكلفة الأوراق دون الفائدة الأساسية: اكتشاف المشاكل مبكراً."
        }
      ]
    },
    {
      key: "problem",
      blocks: [
        {
          t: "p",
          en: "Without a design doc, decisions get made inside one person's head and only become visible in the code review, when changing them is expensive. The receipt feature is a good example of how that goes wrong.",
          ar: "بدون مستند تصميم، تُتخذ القرارات داخل رأس شخص واحد ولا تظهر إلا في مراجعة الكود، حين يصبح تغييرها مكلفاً. ميزة الإيصال مثال جيد على كيف يسوء ذلك."
        },
        {
          t: "kv",
          rows: [
            { k: { en: "No doc: engineer starts coding", ar: "بلا مستند: المهندس يبدأ الكود" }, v: { en: "Sends the email inside the payment request. Ships it. Nobody weighed alternatives.", ar: "يرسل البريد داخل طلب الدفع. يطلقه. لا أحد وازن البدائل." } },
            { k: { en: "Week 2 in production", ar: "الأسبوع الثاني في الإنتاج" }, v: { en: "The email provider is slow. Payment requests now take 4 seconds — meaning users wait 4 seconds after paying.", ar: "مزوّد البريد بطيء. طلبات الدفع تأخذ الآن 4 ثوانٍ — أي أن المستخدمين ينتظرون 4 ثوانٍ بعد الدفع." } },
            { k: { en: "Week 3", ar: "الأسبوع الثالث" }, v: { en: "Provider has an outage. Payments start failing because the email step throws. Money movement is now coupled to email.", ar: "المزوّد يتعطل. المدفوعات تبدأ بالفشل لأن خطوة البريد ترمي استثناء. حركة المال صارت مرتبطة بالبريد." } },
            { k: { en: "The rewrite", ar: "إعادة الكتابة" }, v: { en: "Two engineers spend a week moving email to a background job. This is the fix a design doc would have chosen on day one.", ar: "مهندسان يقضيان أسبوعاً لنقل البريد إلى مهمة خلفية. هذا هو الحل الذي كان مستند التصميم سيختاره في اليوم الأول." } }
          ]
        },
        {
          t: "p",
          en: "The doc does not prevent every bug. It prevents the class of bug where a decision nobody discussed turns out to be wrong. One hour of reading and comments in week zero replaces one week of rework in week three.",
          ar: "المستند لا يمنع كل خطأ. يمنع نوع الخطأ الذي يكون فيه قرار لم يناقشه أحد خاطئاً. ساعة من القراءة والتعليقات في الأسبوع صفر تحل محل أسبوع من إعادة العمل في الأسبوع الثالث."
        }
      ]
    },
    {
      key: "internals",
      blocks: [
        {
          t: "p",
          en: "A good design doc has a fixed skeleton. You fill in the same sections every time, so readers know where to look and you do not forget a part. Here is the skeleton, in order.",
          ar: "المستند الجيد له هيكل ثابت. تملأ نفس الأقسام في كل مرة، فيعرف القرّاء أين ينظرون ولا تنسى جزءاً. هذا الهيكل، بالترتيب."
        },
        {
          t: "kv",
          rows: [
            { k: { en: "Title + one-line summary", ar: "العنوان + ملخص بسطر" }, v: { en: "What this is, in one sentence a busy person can read in five seconds.", ar: "ما هذا، في جملة واحدة يقرأها شخص مشغول في خمس ثوانٍ." } },
            { k: { en: "Context / problem", ar: "السياق / المشكلة" }, v: { en: "What is broken or missing, and why it matters now. No solution yet.", ar: "ما المعطّل أو الناقص، ولماذا يهم الآن. لا حل بعد." } },
            { k: { en: "Goals / non-goals", ar: "الأهداف / غير الأهداف" }, v: { en: "What success looks like, and what you are deliberately NOT solving.", ar: "كيف يبدو النجاح، وما الذي لا تحله عمداً." } },
            { k: { en: "Options considered", ar: "الخيارات المدروسة" }, v: { en: "Two or three real approaches, each with its trade-offs.", ar: "طريقتان أو ثلاث حقيقية، لكل منها مقايضاتها." } },
            { k: { en: "Decision", ar: "القرار" }, v: { en: "Which option you chose and the reason, tied back to the goals.", ar: "أي خيار اخترت وسببه، مربوطاً بالأهداف." } },
            { k: { en: "Risks / open questions", ar: "المخاطر / الأسئلة المفتوحة" }, v: { en: "What could still go wrong, and what you have not figured out yet.", ar: "ما الذي قد يفشل، وما لم تحسمه بعد." } }
          ]
        },
        {
          t: "p",
          en: "The most valuable section is 'options considered'. A doc with one option is not a design — it is an announcement. Writing down the alternatives is what lets a reviewer say 'you missed a simpler way'. For the receipt feature, three real options exist.",
          ar: "أهم قسم هو «الخيارات المدروسة». مستند بخيار واحد ليس تصميماً — بل إعلان. كتابة البدائل هي ما يسمح للمراجع أن يقول «فاتتك طريقة أبسط». لميزة الإيصال توجد ثلاثة خيارات حقيقية."
        },
        {
          t: "code",
          lang: "markdown",
          label: { en: "The options section, written out", ar: "قسم الخيارات، مكتوباً" },
          code: "## Options considered\n\n### Option A: send email inside the payment request (synchronous)\n- Pros: simplest code; user sees receipt confirmation immediately.\n- Cons: payment latency now depends on the email provider; an email\n  outage can fail payments. Coupling money to email is dangerous.\n\n### Option B: write a row to an 'outbox' table in the same DB transaction,\n### a background worker reads it and sends the email\n- Pros: payment never waits for or fails because of email; retried safely.\n- Cons: needs a worker process; receipt arrives seconds later, not instantly.\n\n### Option C: publish an event to a message queue after payment\n- Pros: fully decoupled; other features can react to the same event.\n- Cons: most infrastructure to build/run; overkill if email is the only consumer.\n\n## Decision\nOption B. It removes the dangerous coupling (goal 1) with far less\ninfrastructure than C. We revisit C if a second consumer appears."
        },
        {
          t: "p",
          en: "Notice the shape: each option is a real approach, each has pros and cons, and the decision points back to a goal ('remove the dangerous coupling'). A reviewer can now argue with the reasoning, not guess at it. That is the whole mechanism — you make your thinking visible so others can improve it.",
          ar: "لاحظ الشكل: كل خيار طريقة حقيقية، لكل منه إيجابيات وسلبيات، والقرار يشير إلى هدف («إزالة الارتباط الخطير»). يستطيع المراجع الآن أن يجادل المنطق، لا أن يخمّنه. هذا هو الآلية كلها — تجعل تفكيرك مرئياً ليحسّنه الآخرون."
        },
        {
          t: "callout",
          kind: "note",
          en: "Match the doc size to the decision. A one-way, expensive-to-reverse choice (a database engine, a public API shape) deserves several pages. A reversible choice deserves half a page or a chat message. Do not write a ten-page doc for a decision you can undo in an afternoon.",
          ar: "لائم حجم المستند مع حجم القرار. القرار أحادي الاتجاه ومكلف العكس (محرك قاعدة بيانات، شكل API عام) يستحق عدة صفحات. القرار القابل للعكس يستحق نصف صفحة أو رسالة دردشة. لا تكتب مستنداً من عشر صفحات لقرار يمكنك التراجع عنه في بعد ظهر."
        }
      ]
    },
    {
      key: "tradeoffs",
      blocks: [
        {
          t: "tradeoff",
          pros: {
            en: [
              "Catches design mistakes while they cost a comment, not a rewrite.",
              "Spreads context: reviewers learn the system, not just the author.",
              "Leaves a record of WHY a choice was made, useful months later.",
              "Forces the author to actually think through alternatives."
            ],
            ar: [
              "يكتشف أخطاء التصميم وهي تكلّف تعليقاً لا إعادة كتابة.",
              "ينشر السياق: المراجعون يتعلمون النظام، لا المؤلف فقط.",
              "يترك سجلاً لسبب اتخاذ القرار، مفيد بعد أشهر.",
              "يجبر المؤلف على التفكير فعلاً في البدائل."
            ]
          },
          cons: {
            en: [
              "Takes time to write and to review; a bottleneck if overused.",
              "Can become theater — written to be approved, not to find truth.",
              "Tempting to over-document trivial, reversible decisions."
            ],
            ar: [
              "يأخذ وقتاً في الكتابة والمراجعة؛ عنق زجاجة إذا أُفرط فيه.",
              "قد يصير مسرحية — يُكتب ليُعتمد، لا ليجد الحقيقة.",
              "يغري بتوثيق مفرط لقرارات تافهة قابلة للعكس."
            ]
          },
          limits: {
            en: [
              "A doc reviews the plan, not the code; bugs still need code review.",
              "Only as good as the reviewers who actually read it.",
              "Cannot capture problems that only appear under real load."
            ],
            ar: [
              "المستند يراجع الخطة لا الكود؛ الأخطاء ما زالت تحتاج مراجعة كود.",
              "جودته بقدر المراجعين الذين يقرؤونه فعلاً.",
              "لا يلتقط مشاكل لا تظهر إلا تحت حمل حقيقي."
            ]
          },
          alts: {
            en: [
              "Lightweight ADR (Architecture Decision Record): one page per decision.",
              "A quick spike: build a throwaway prototype to answer the question.",
              "A whiteboard talk for small, reversible choices."
            ],
            ar: [
              "ADR خفيف (Architecture Decision Record): صفحة لكل قرار.",
              "spike سريع: ابنِ نموذجاً مؤقتاً للإجابة عن السؤال.",
              "نقاش على السبورة للقرارات الصغيرة القابلة للعكس."
            ]
          }
        }
      ]
    },
    {
      key: "mistakes",
      blocks: [
        {
          t: "mistake",
          title: { en: "Presenting one option as if it were the only one", ar: "تقديم خيار واحد وكأنه الوحيد" },
          body: {
            en: "An engineer wrote a doc titled 'Add Redis cache'. It described only the Redis plan in detail, with no alternatives. The review had nothing to push against, so it was rubber-stamped. Two months later they found an in-memory cache would have been enough and far cheaper. The doc skipped the comparison that would have caught it.",
            ar: "مهندس كتب مستنداً بعنوان «إضافة Redis cache». وصف خطة Redis فقط بالتفصيل، دون بدائل. لم يجد المراجعون ما يدفعون ضده، فاعتُمد بلا نقاش. بعد شهرين اكتشفوا أن cache داخل الذاكرة كان سيكفي وأرخص كثيراً. المستند تخطى المقارنة التي كانت ستكتشف ذلك."
          }
        },
        {
          t: "mistake",
          title: { en: "Skipping non-goals, so scope explodes", ar: "تخطي غير الأهداف، فيتضخم النطاق" },
          body: {
            en: "The receipt doc did not list non-goals. In review, one person asked 'should this also support PDF invoices?' and another 'what about SMS receipts?'. The scope tripled in the comments. Had the doc said 'Non-goal: PDF and SMS are out of scope for v1', those threads would have closed in one line.",
            ar: "مستند الإيصال لم يذكر غير الأهداف. في المراجعة سأل شخص «هل يجب أن يدعم فواتير PDF أيضاً؟» وآخر «وماذا عن إيصالات SMS؟». تضاعف النطاق ثلاث مرات في التعليقات. لو قال المستند «غير هدف: PDF و SMS خارج نطاق الإصدار الأول»، لأُغلقت تلك النقاشات بسطر واحد."
          }
        },
        {
          t: "mistake",
          title: { en: "Writing the doc after the code is already built", ar: "كتابة المستند بعد بناء الكود" },
          body: {
            en: "A team required design docs, so an engineer built the feature first, then wrote the doc to match. Reviewers spotted a real flaw, but the code was done, so the feedback was ignored. The doc became a formality. A design doc only works when it can still change the plan.",
            ar: "فريق اشترط مستندات تصميم، فبنى مهندس الميزة أولاً ثم كتب المستند ليطابقها. رصد المراجعون خللاً حقيقياً، لكن الكود كان جاهزاً، فتُجوهلت الملاحظات. صار المستند إجراءً شكلياً. مستند التصميم ينفع فقط حين يمكنه بعدُ تغيير الخطة."
          }
        },
        {
          t: "mistake",
          title: { en: "Burying the decision in walls of prose", ar: "دفن القرار وسط جدران من النثر" },
          body: {
            en: "A doc explained the problem beautifully across four pages but never clearly said what would be built. Reviewers each read a different plan into it. The build went three ways at once. Put the decision in a short, bold section a reader can find in five seconds.",
            ar: "مستند شرح المشكلة ببراعة عبر أربع صفحات لكنه لم يقل بوضوح ماذا سيُبنى. قرأ كل مراجع خطة مختلفة فيه. سار البناء في ثلاثة اتجاهات معاً. ضع القرار في قسم قصير بارز يجده القارئ في خمس ثوانٍ."
          }
        }
      ]
    },
    {
      key: "interview",
      blocks: [
        {
          t: "qa",
          level: "junior",
          q: { en: "What is a design doc and why write one?", ar: "ما هو مستند التصميم ولماذا تكتبه؟" },
          a: {
            en: "It is a short written plan for a technical change that you share before building. You describe the problem, the options you looked at, and which one you chose. The point is to let people catch problems while they are cheap to fix — in a comment instead of a rewrite.",
            ar: "خطة مكتوبة قصيرة لتغيير تقني تشاركها قبل البناء. تصف المشكلة والخيارات التي نظرت فيها وأيها اخترت. الهدف أن يكتشف الناس المشاكل وهي رخيصة الإصلاح — في تعليق بدل إعادة كتابة."
          }
        },
        {
          t: "qa",
          level: "mid",
          q: { en: "Which section do reviewers usually get the most value from, and why?", ar: "أي قسم يستفيد منه المراجعون أكثر عادةً، ولماذا؟" },
          a: {
            en: "The options-considered section. If I only present my chosen approach, the reviewer can only nod. When I list two or three real alternatives with their trade-offs, they can say 'option B is simpler and you missed it'. That comparison is where the real design feedback happens.",
            ar: "قسم الخيارات المدروسة. إن قدّمت طريقتي المختارة فقط، فكل ما يستطيعه المراجع هو الموافقة. حين أذكر بديلين أو ثلاثة حقيقية بمقايضاتها، يستطيع أن يقول «الخيار B أبسط وقد فاتك». تلك المقارنة هي حيث تحدث ملاحظات التصميم الحقيقية."
          }
        },
        {
          t: "qa",
          level: "mid",
          q: { en: "How do you decide how long a design doc should be?", ar: "كيف تقرر طول مستند التصميم؟" },
          a: {
            en: "By how hard the decision is to reverse. A choice I can undo in an afternoon gets a paragraph or a chat message. A one-way choice like a database engine or a public API shape gets several pages, because getting it wrong is expensive. I size the doc to the cost of being wrong.",
            ar: "بمدى صعوبة عكس القرار. قرار أتراجع عنه في بعد ظهر يأخذ فقرة أو رسالة دردشة. قرار أحادي الاتجاه كمحرك قاعدة بيانات أو شكل API عام يأخذ عدة صفحات، لأن الخطأ فيه مكلف. أحدد حجم المستند بتكلفة الخطأ."
          }
        },
        {
          t: "qa",
          level: "senior",
          q: { en: "A reviewer disagrees with your decision. How do you handle it in the doc?", ar: "مراجع يخالف قرارك. كيف تتعامل مع ذلك في المستند؟" },
          a: {
            en: "First I make sure I understood their point by restating it in the doc — often the disagreement is really a missing goal or constraint. If they are right, I change the decision; the doc exists to be changed. If we still disagree after understanding each other, I record both positions and why I chose mine, so we can disagree and commit and revisit it later with data.",
            ar: "أولاً أتأكد أنني فهمت وجهة نظرهم بإعادة صياغتها في المستند — غالباً الخلاف في الحقيقة هدف أو قيد ناقص. إن كانوا محقين، أغيّر القرار؛ المستند موجود ليُغيَّر. وإن بقي الخلاف بعد أن فهم كلٌّ الآخر، أسجّل الموقفين وسبب اختياري، لنتفق على المضي رغم الخلاف ونعيد النظر لاحقاً ببيانات."
          }
        },
        {
          t: "qa",
          level: "senior",
          q: { en: "How do you keep a design doc from becoming a rubber-stamp formality?", ar: "كيف تمنع مستند التصميم من أن يصير إجراءً شكلياً يُختم بلا نقاش؟" },
          a: {
            en: "Write it before the code, not after — once code exists, feedback gets ignored. Share it early while the plan can still move. Ask specific reviewers specific questions instead of broadcasting to a channel. And always include real alternatives, because a one-option doc gives reviewers nothing to engage with.",
            ar: "اكتبه قبل الكود لا بعده — بمجرد وجود كود تُتجاهل الملاحظات. شاركه مبكراً بينما تستطيع الخطة أن تتحرك. اسأل مراجعين محددين أسئلة محددة بدل النشر لقناة عامة. واذكر دائماً بدائل حقيقية، لأن مستند الخيار الواحد لا يعطي المراجعين ما يتفاعلون معه."
          }
        },
        {
          t: "qa",
          level: "staff",
          q: { en: "How would you introduce a design-doc culture to a team that has none?", ar: "كيف تُدخل ثقافة مستندات التصميم لفريق لا يملكها؟" },
          a: {
            en: "Start small and make it cheap: a one-page template and a rule that only hard-to-reverse decisions need one. Model it yourself first so people see the value, not the paperwork. Keep docs in one findable place and link them from the code. Never let it become a gate that blocks shipping — the goal is better decisions, not more process. If reviews are slow, that is a signal to shrink the template, not to abandon it.",
            ar: "ابدأ صغيراً واجعله رخيصاً: قالب من صفحة وقاعدة أن القرارات صعبة العكس فقط تحتاج مستنداً. طبّقه بنفسك أولاً ليرى الناس القيمة لا الأوراق. احفظ المستندات في مكان واحد يسهل إيجاده واربطها من الكود. لا تدعه يصير بوابة تعطّل الإطلاق — الهدف قرارات أفضل لا عملية أكثر. إن كانت المراجعات بطيئة، فتلك إشارة لتصغير القالب لا لهجره."
          }
        }
      ]
    },
    {
      key: "codereview",
      blocks: [
        {
          t: "review",
          severity: "high",
          title: { en: "The decision is not stated; the doc only describes the problem", ar: "القرار غير مذكور؛ المستند يصف المشكلة فقط" },
          bad: "## Receipt emails\nUsers want a receipt after paying. Today they get nothing.\nEmail providers can be slow or down. We should be careful about\ncoupling. There are a few ways to do this. Latency matters.\n\n(end of doc)",
          good: "## Receipt emails\n### Problem\nUsers get no receipt; sending email inline risks coupling payments to email.\n### Options\nA inline (simple, risky), B outbox+worker (decoupled), C queue (overkill now).\n### Decision\n**Option B: write to an outbox table in the payment transaction; a worker\nsends the email.** Payments never wait on or fail because of email.",
          why: {
            en: "The bad version never says what will be built, so every reader imagines a different plan and the review cannot converge. A design doc must end with a clear, findable decision tied to the problem. Without it, the doc is a description, not a design.",
            ar: "النسخة السيئة لا تقول أبداً ماذا سيُبنى، فيتخيّل كل قارئ خطة مختلفة ولا تتقارب المراجعة. مستند التصميم يجب أن ينتهي بقرار واضح يسهل إيجاده ومربوط بالمشكلة. بدونه، المستند وصف لا تصميم."
          }
        },
        {
          t: "review",
          severity: "medium",
          title: { en: "Goals are vague, so success cannot be judged", ar: "الأهداف غامضة، فلا يمكن الحكم على النجاح" },
          bad: "### Goals\n- Make receipts work well\n- Good performance\n- Reliable",
          good: "### Goals\n- Send a receipt within 30 seconds of a successful payment.\n- A receipt outage must never fail or slow a payment.\n### Non-goals\n- PDF invoices and SMS receipts (out of scope for v1).",
          why: {
            en: "'Work well' and 'reliable' cannot be argued with or measured, so reviewers cannot tell if the design meets them. Concrete, testable goals — plus non-goals that bound the scope — let a reviewer check the decision against them and stop scope creep in the comments.",
            ar: "«يعمل جيداً» و«موثوق» لا يمكن مجادلتها أو قياسها، فلا يستطيع المراجعون معرفة إن كان التصميم يحققها. الأهداف الملموسة القابلة للقياس — مع غير الأهداف التي تحدّ النطاق — تتيح للمراجع فحص القرار مقابلها ووقف تضخم النطاق في التعليقات."
          }
        }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        {
          t: "p",
          en: "Design docs matter most at system boundaries — the places where a decision is hard to reverse because other teams or external clients depend on it. Getting these wrong is what a doc is for.",
          ar: "مستندات التصميم تهم أكثر عند حدود النظام — الأماكن التي يصعب فيها عكس القرار لأن فرقاً أخرى أو عملاء خارجيين يعتمدون عليه. الأخطاء هنا هي ما وُجد المستند لأجله."
        },
        {
          t: "ul",
          en: [
            "The shape of a public API: once clients depend on a field, removing it breaks them, so the choice deserves a doc.",
            "A database schema or engine choice: migrating a large table later is slow and risky.",
            "How services talk (synchronous call vs message queue): this shapes the whole failure behavior of the system.",
            "Data ownership: which service owns which data, because splitting it later means a painful migration."
          ],
          ar: [
            "شكل API عام: بمجرد اعتماد العملاء على حقل، حذفه يكسرهم، فالقرار يستحق مستنداً.",
            "اختيار schema أو محرك قاعدة بيانات: ترحيل جدول كبير لاحقاً بطيء وخطير.",
            "كيف تتحدث الخدمات (نداء متزامن مقابل message queue): هذا يشكّل سلوك الفشل للنظام كله.",
            "ملكية البيانات: أي خدمة تملك أي بيانات، لأن فصلها لاحقاً يعني ترحيلاً مؤلماً."
          ]
        },
        {
          t: "callout",
          kind: "tip",
          en: "A useful test: if undoing the decision would need a data migration, a client update, or another team's work, write a doc. If you can undo it with one pull request, a chat message is enough.",
          ar: "اختبار مفيد: إن كان التراجع عن القرار يحتاج ترحيل بيانات أو تحديث عميل أو عمل فريق آخر، فاكتب مستنداً. إن كنت تتراجع عنه بـ pull request واحد، فرسالة دردشة تكفي."
        }
      ]
    },
    {
      key: "perf",
      blocks: [
        {
          t: "kv",
          rows: [
            { k: { en: "Team throughput", ar: "إنتاجية الفريق" }, v: { en: "A good doc speeds delivery by preventing rework; a heavy process slows it. Net effect depends on sizing docs to the decision.", ar: "المستند الجيد يسرّع التسليم بمنع إعادة العمل؛ العملية الثقيلة تبطئه. الأثر الصافي يعتمد على ملاءمة حجم المستند للقرار." } },
            { k: { en: "Review latency", ar: "زمن المراجعة" }, v: { en: "Time from sharing the doc to a decision. Long latency blocks work; fix by asking named reviewers, not broadcasting.", ar: "الزمن من مشاركة المستند إلى القرار. الزمن الطويل يعطّل العمل؛ عالجه بسؤال مراجعين بأسمائهم لا بالنشر العام." } },
            { k: { en: "Rework avoided", ar: "إعادة العمل المتجنّبة" }, v: { en: "The main payoff: a design flaw caught in review costs a comment instead of days of rebuilding.", ar: "العائد الأساسي: خلل تصميم يُكتشف في المراجعة يكلّف تعليقاً بدل أيام من إعادة البناء." } },
            { k: { en: "Onboarding cost", ar: "تكلفة الانضمام" }, v: { en: "Stored docs let new engineers learn WHY the system is shaped this way, without asking the original author.", ar: "المستندات المحفوظة تتيح للمهندسين الجدد معرفة لماذا صُمم النظام هكذا، دون سؤال المؤلف الأصلي." } }
          ]
        }
      ]
    },
    {
      key: "debug",
      blocks: [
        {
          t: "ul",
          en: [
            "Reread your own doc as a stranger: if you cannot find the decision in five seconds, add a clear decision section.",
            "Check the comment threads: many unresolved threads on one topic usually mean a missing non-goal — add one to close them.",
            "Look for options: if the doc has only one approach, you have an announcement, not a design; add real alternatives.",
            "Track review latency: if a doc sits for days, ping specific reviewers with a specific question instead of waiting.",
            "Compare doc to code after shipping: large gaps mean the decision changed silently — update the doc so the record stays true."
          ],
          ar: [
            "أعد قراءة مستندك كغريب: إن لم تجد القرار في خمس ثوانٍ، أضف قسم قرار واضح.",
            "افحص خيوط التعليقات: كثرة الخيوط غير المحسومة حول موضوع واحد تعني غالباً غير هدف ناقص — أضفه لإغلاقها.",
            "ابحث عن الخيارات: إن كان للمستند طريقة واحدة، فلديك إعلان لا تصميم؛ أضف بدائل حقيقية.",
            "تابع زمن المراجعة: إن بقي المستند أياماً، نبّه مراجعين محددين بسؤال محدد بدل الانتظار.",
            "قارن المستند بالكود بعد الإطلاق: الفجوات الكبيرة تعني أن القرار تغيّر بصمت — حدّث المستند ليبقى السجل صحيحاً."
          ]
        },
        {
          t: "callout",
          kind: "tip",
          en: "The fastest way to find a weak doc is to ask one reviewer to summarize your decision back to you in one sentence. If their sentence does not match your intent, the doc is unclear — fix it before wider review.",
          ar: "أسرع طريقة لاكتشاف مستند ضعيف أن تطلب من مراجع واحد أن يلخّص قرارك لك في جملة. إن لم تطابق جملته قصدك، فالمستند غير واضح — أصلحه قبل مراجعة أوسع."
        }
      ]
    },
    {
      key: "realworld",
      blocks: [
        {
          t: "p",
          en: "Design docs are standard practice on teams that make expensive, hard-to-reverse decisions and want the reasoning to outlive the author. The pattern shows up across industries with different names.",
          ar: "مستندات التصميم ممارسة معتادة في الفرق التي تتخذ قرارات مكلفة صعبة العكس وتريد للمنطق أن يعيش بعد المؤلف. النمط يظهر عبر الصناعات بأسماء مختلفة."
        },
        {
          t: "ul",
          en: [
            "Large product companies: a written design review before building any cross-team feature, so dependencies are agreed up front.",
            "Payment and banking systems: docs are mandatory because a wrong data or consistency decision can lose money or break audits.",
            "Open-source projects: 'RFC' or 'proposal' docs let a distributed community debate a change before code is merged.",
            "Infrastructure teams: ADRs (one-page Architecture Decision Records) capture each irreversible platform choice for future maintainers."
          ],
          ar: [
            "شركات المنتجات الكبيرة: مراجعة تصميم مكتوبة قبل بناء أي ميزة متعددة الفرق، لتُتفق على الاعتماديات مسبقاً.",
            "أنظمة الدفع والبنوك: المستندات إلزامية لأن قرار بيانات أو اتساق خاطئ قد يخسر مالاً أو يكسر التدقيق.",
            "المشاريع مفتوحة المصدر: مستندات «RFC» أو «proposal» تتيح لمجتمع موزّع مناقشة تغيير قبل دمج الكود.",
            "فرق البنية التحتية: ADRs (سجلات قرار معمارية من صفحة) تلتقط كل خيار منصّة صعب العكس للمشرفين المستقبليين."
          ]
        }
      ]
    },
    {
      key: "exercises",
      blocks: [
        {
          t: "ex",
          diff: "easy",
          en: "Take a small change you made recently and write a one-paragraph doc for it: problem, the option you chose, and one alternative you rejected. Success: a teammate can read it in a minute and understand why you chose what you did.",
          ar: "خذ تغييراً صغيراً أجريته مؤخراً واكتب له مستنداً من فقرة: المشكلة، الخيار الذي اخترت، وبديل واحد رفضته. النجاح: يقرؤه زميل في دقيقة ويفهم لماذا اخترت ما اخترت."
        },
        {
          t: "ex",
          diff: "medium",
          en: "Write a full design doc for the receipt-email feature using the skeleton in this lesson: context, goals, non-goals, three options, decision, risks. Success: every section is filled and the decision points back to a stated goal.",
          ar: "اكتب مستند تصميم كاملاً لميزة إيصال البريد باستخدام الهيكل في هذا الدرس: السياق، الأهداف، غير الأهداف، ثلاثة خيارات، القرار، المخاطر. النجاح: كل قسم مملوء والقرار يشير إلى هدف مذكور."
        },
        {
          t: "ex",
          diff: "hard",
          en: "Find a decision your team made without a doc that later caused rework. Write the doc that should have existed, including the option that would have avoided the rework. Success: the doc makes clear the better choice was visible at the time.",
          ar: "جد قراراً اتخذه فريقك بلا مستند وسبّب لاحقاً إعادة عمل. اكتب المستند الذي كان يجب أن يوجد، متضمناً الخيار الذي كان سيتجنب إعادة العمل. النجاح: يوضح المستند أن الخيار الأفضل كان مرئياً وقتها."
        },
        {
          t: "ex",
          diff: "senior",
          en: "Draft a one-page design-doc template and a short rule for when your team must write one (tie it to reversibility). Circulate it and collect feedback. Success: two colleagues agree the rule is clear and would not slow down small, reversible changes.",
          ar: "صُغ قالب مستند تصميم من صفحة وقاعدة قصيرة لمتى يجب على فريقك كتابة واحد (اربطها بقابلية العكس). عمّمه واجمع الملاحظات. النجاح: يتفق زميلان أن القاعدة واضحة ولن تبطئ التغييرات الصغيرة القابلة للعكس."
        }
      ]
    },
    {
      key: "refs",
      blocks: [
        {
          t: "ref",
          label: { en: "Design Docs at Google", ar: "Design Docs at Google" },
          url: "https://www.industrialempathy.com/posts/design-docs-at-google/",
          meta: { en: "Article", ar: "مقال" }
        },
        {
          t: "ref",
          label: { en: "Architecture Decision Records (adr.github.io)", ar: "Architecture Decision Records (adr.github.io)" },
          url: "https://adr.github.io/",
          meta: { en: "Docs", ar: "توثيق" }
        },
        {
          t: "ref",
          label: { en: "Michael Nygard — Documenting Architecture Decisions", ar: "Michael Nygard — Documenting Architecture Decisions" },
          url: "https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions",
          meta: { en: "Article", ar: "مقال" }
        },
        {
          t: "ref",
          label: { en: "The Rust RFC process", ar: "The Rust RFC process" },
          url: "https://github.com/rust-lang/rfcs",
          meta: { en: "Example", ar: "مثال" }
        }
      ]
    }
  ],
  quiz: [
    {
      q: { en: "What is the main purpose of a design doc?", ar: "ما الغرض الأساسي من مستند التصميم؟" },
      options: [
        { en: "To document a feature after it is finished", ar: "توثيق ميزة بعد الانتهاء منها" },
        { en: "To catch design problems before building, while they are cheap to fix", ar: "اكتشاف مشاكل التصميم قبل البناء، وهي رخيصة الإصلاح" },
        { en: "To replace code review", ar: "استبدال مراجعة الكود" },
        { en: "To satisfy a process requirement", ar: "تلبية متطلب إجرائي" }
      ],
      correct: 1,
      why: {
        en: "The value is catching mistakes early, when a fix costs a comment instead of a rewrite. It is a pre-build decision tool, not after-the-fact documentation.",
        ar: "القيمة في اكتشاف الأخطاء مبكراً، حين يكلّف الإصلاح تعليقاً بدل إعادة كتابة. هو أداة قرار قبل البناء، لا توثيقاً بعد الحدث."
      }
    },
    {
      q: { en: "Why is the 'options considered' section so important?", ar: "لماذا قسم «الخيارات المدروسة» بهذه الأهمية؟" },
      options: [
        { en: "It makes the doc longer", ar: "يجعل المستند أطول" },
        { en: "It gives reviewers alternatives to compare, so they can spot a better path", ar: "يعطي المراجعين بدائل للمقارنة، فيكتشفون مساراً أفضل" },
        { en: "It is required by most templates", ar: "معظم القوالب تشترطه" },
        { en: "It documents rejected code", ar: "يوثّق الكود المرفوض" }
      ],
      correct: 1,
      why: {
        en: "A doc with one option gives a reviewer nothing to push against. Listing real alternatives with trade-offs is what lets them say 'you missed a simpler way'.",
        ar: "مستند بخيار واحد لا يعطي المراجع ما يدفع ضده. ذكر بدائل حقيقية بمقايضاتها هو ما يتيح له قول «فاتتك طريقة أبسط»."
      }
    },
    {
      q: { en: "How should you decide how detailed a design doc needs to be?", ar: "كيف تقرر مدى تفصيل مستند التصميم؟" },
      options: [
        { en: "By how much time you have", ar: "بمقدار الوقت المتاح لك" },
        { en: "By how hard the decision is to reverse", ar: "بمدى صعوبة عكس القرار" },
        { en: "Every doc should be the same length", ar: "كل مستند يجب أن يكون بنفس الطول" },
        { en: "By how senior the author is", ar: "بمدى أقدمية المؤلف" }
      ],
      correct: 1,
      why: {
        en: "Size the doc to the cost of being wrong. A reversible choice needs a paragraph; a one-way choice like a public API or database engine needs several pages.",
        ar: "لائم حجم المستند مع تكلفة الخطأ. القرار القابل للعكس يحتاج فقرة؛ القرار أحادي الاتجاه كـ API عام أو محرك قاعدة بيانات يحتاج عدة صفحات."
      }
    },
    {
      q: { en: "Why does writing the doc AFTER building the feature defeat its purpose?", ar: "لماذا تُفشل كتابة المستند بعد بناء الميزة غرضه؟" },
      options: [
        { en: "The doc becomes too short", ar: "يصير المستند قصيراً جداً" },
        { en: "Once the code exists, feedback gets ignored, so the doc cannot change the plan", ar: "بمجرد وجود الكود تُتجاهل الملاحظات، فلا يستطيع المستند تغيير الخطة" },
        { en: "It takes more time", ar: "يأخذ وقتاً أطول" },
        { en: "Reviewers refuse to read it", ar: "يرفض المراجعون قراءته" }
      ],
      correct: 1,
      why: {
        en: "The whole benefit is catching problems while the plan can still move. After the code is built, valid feedback is ignored and the doc becomes an empty formality.",
        ar: "الفائدة كلها في اكتشاف المشاكل بينما تستطيع الخطة أن تتحرك. بعد بناء الكود، تُتجاهل الملاحظات الصحيحة ويصير المستند إجراءً شكلياً فارغاً."
      }
    },
    {
      q: { en: "A reviewer disagrees with your decision after you both understand each other. What is the healthy move?", ar: "مراجع يخالف قرارك بعد أن فهم كلٌّ منكما الآخر. ما التصرف السليم؟" },
      options: [
        { en: "Delete their comment and ship your version", ar: "احذف تعليقه وأطلق نسختك" },
        { en: "Record both positions and why you chose yours, then disagree and commit", ar: "سجّل الموقفين وسبب اختيارك، ثم اتفقوا على المضي رغم الخلاف" },
        { en: "Always change to whatever the reviewer wants", ar: "غيّر دائماً إلى ما يريده المراجع" },
        { en: "Cancel the project", ar: "ألغِ المشروع" }
      ],
      correct: 1,
      why: {
        en: "If a genuine disagreement remains after mutual understanding, recording both views and the reason for the choice lets the team move forward and revisit later with data. That is disagree-and-commit.",
        ar: "إن بقي خلاف حقيقي بعد الفهم المتبادل، فتسجيل الرأيين وسبب الاختيار يتيح للفريق المضي وإعادة النظر لاحقاً ببيانات. هذا هو الاتفاق على المضي رغم الخلاف."
      }
    }
  ]
};
```

NEXT: tradeoff-writing
