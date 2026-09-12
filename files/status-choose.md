```js
const statusChooseLesson = {
  id: "status-choose",
  moduleId: "foundations",
  title: { en: "Choosing the right code", ar: "اختيار الكود الصحيح" },
  summary: {
    en: "A practical decision tree between 400, 401, 403, 404, 409 and 422 — and the misuses that leave clients guessing.",
    ar: "شجرة قرار عملية بين 400 و401 و403 و404 و409 و422، والأخطاء الشائعة التي تترك الـ client يخمّن."
  },
  mins: 10,
  sections: [
    {
      key: "why",
      blocks: [
        {
          t: "p",
          en: "Every HTTP response starts with a three-digit number called the status code. It is the one part of the response a client can branch on without reading any text. Choosing it well means the caller knows what to do next: fix the input, sign in, give up, or try again later.",
          ar: "كل HTTP response يبدأ برقم من ثلاث خانات اسمه status code. هو الجزء الوحيد الذي يستطيع الـ client أن يبني عليه قراراً دون قراءة أي نص. اختياره بشكل صحيح يعني أن المستدعي يعرف الخطوة التالية: يصلح المدخلات، أو يسجّل الدخول، أو يتوقف، أو يعيد المحاولة لاحقاً."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "Status code", ar: "Status code" },
              v: {
                en: "The three-digit number at the start of a response. 200 means it worked, 404 means not found, and so on.",
                ar: "الرقم ذو الثلاث خانات في بداية الـ response. 200 يعني نجح، و404 يعني غير موجود، وهكذا."
              }
            },
            {
              k: { en: "4xx family", ar: "عائلة 4xx" },
              v: {
                en: "The server refuses because of something in the request. Sending the identical request again gives the identical answer.",
                ar: "الـ server يرفض بسبب شيء في الـ request. إرسال نفس الـ request مرة أخرى يعطي نفس الجواب."
              }
            },
            {
              k: { en: "5xx family", ar: "عائلة 5xx" },
              v: {
                en: "The server failed at its own job. The request may have been perfectly valid, so retrying can work.",
                ar: "الـ server فشل في عمله هو. الـ request قد يكون صحيحاً تماماً، لذلك إعادة المحاولة قد تنجح."
              }
            },
            {
              k: { en: "Resource", ar: "Resource" },
              v: {
                en: "The thing a URL points at — one order, one user, one list of products.",
                ar: "الشيء الذي يشير إليه الـ URL — order واحد، أو user واحد، أو قائمة منتجات."
              }
            },
            {
              k: { en: "Validation", ar: "Validation" },
              v: {
                en: "Checking the values in a request against fixed rules: required, maximum length, allowed range, correct format.",
                ar: "فحص القيم في الـ request مقابل قواعد ثابتة: مطلوب، أقصى طول، مدى مسموح، صيغة صحيحة."
              }
            },
            {
              k: { en: "Business rule", ar: "Business rule" },
              v: {
                en: "A rule about the current state of the system, not about the shape of the request. Example: a shipped order cannot be cancelled.",
                ar: "قاعدة عن الحالة الحالية للنظام، لا عن شكل الـ request. مثال: order تم شحنه لا يمكن إلغاؤه."
              }
            }
          ]
        },
        {
          t: "p",
          en: "Think of a clerk at a government counter. If your handwriting is unreadable, they hand the form back untouched. If the form is readable but you left the date empty, they point at the empty box. If your file was closed last year, they tell you the case is already finished. Three different refusals, three different things you should do. Status codes are that same set of refusals, written as numbers.",
          ar: "تخيّل موظفاً خلف شبّاك في دائرة حكومية. إذا كانت كتابتك غير مقروءة، يعيد لك الورقة دون قراءتها. وإذا كانت مقروءة لكنك تركت خانة التاريخ فارغة، يشير إلى الخانة الفارغة. وإذا كان ملفك أُغلق العام الماضي، يقول لك إن المعاملة انتهت أصلاً. ثلاثة رفوض مختلفة، وثلاثة تصرّفات مختلفة مطلوبة منك. الـ status codes هي نفس مجموعة الرفوض، مكتوبة كأرقام."
        },
        {
          t: "p",
          en: "This lesson uses one running example: a shop API with the endpoint POST /api/orders/1234/cancel. Cancelling an order can fail in six different ways, and each way maps to a different code. By the end you will be able to place any failure on that map.",
          ar: "هذا الدرس يستخدم مثالاً واحداً متكرراً: shop API فيه endpoint اسمه POST /api/orders/1234/cancel. إلغاء الـ order يمكن أن يفشل بست طرق مختلفة، وكل طريقة تقابل كوداً مختلفاً. في النهاية ستستطيع وضع أي فشل على هذه الخريطة."
        },
        {
          t: "callout",
          kind: "note",
          en: "The status code is for machines. The response body is for humans and for detail. Never put the real reason only in the body — a client that must read English text to decide what to do is a client that will get it wrong.",
          ar: "الـ status code موجّه للآلة، وجسم الـ response موجّه للتفاصيل وللبشر. لا تضع السبب الحقيقي في الـ body فقط — الـ client الذي يضطر لقراءة نص إنجليزي ليقرر ماذا يفعل سيخطئ عاجلاً أم آجلاً."
        }
      ]
    },
    {
      key: "problem",
      blocks: [
        {
          t: "p",
          en: "A team shipped the cancel endpoint returning 400 for every failure. In one week it produced 12,000 failed calls. About 9,600 of them — four out of five — were 400 with no way to tell them apart. The mobile app had one screen for all of them: Something went wrong, try again.",
          ar: "فريق أطلق الـ cancel endpoint وهو يُرجع 400 لكل فشل. خلال أسبوع واحد أنتج 12,000 نداء فاشل. حوالي 9,600 منها — أربعة من كل خمسة — كانت 400 دون أي طريقة للتفريق بينها. تطبيق الموبايل كان يعرض شاشة واحدة لها جميعاً: حدث خطأ ما، حاول مرة أخرى."
        },
        {
          t: "p",
          en: "That single screen caused two real problems. Users whose session had expired kept tapping retry instead of signing in again, so the same failing call was sent an average of four times per user. And users trying to cancel an order that had already shipped were told to try again forever, because that call could never succeed.",
          ar: "هذه الشاشة الواحدة سبّبت مشكلتين حقيقيتين. المستخدمون الذين انتهت جلستهم استمروا بالضغط على إعادة المحاولة بدل تسجيل الدخول من جديد، فأُرسل نفس النداء الفاشل بمعدل أربع مرات لكل مستخدم. والمستخدمون الذين حاولوا إلغاء order تم شحنه أصلاً طُلب منهم إعادة المحاولة إلى الأبد، لأن ذلك النداء لا يمكن أن ينجح أبداً."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "Before: one code", ar: "قبل: كود واحد" },
              v: {
                en: "9,600 responses were 400. The client could not tell an expired session from a shipped order, so it retried both.",
                ar: "9,600 response كانت 400. الـ client لم يستطع التمييز بين جلسة منتهية وorder تم شحنه، فأعاد المحاولة في الحالتين."
              }
            },
            {
              k: { en: "After: split by cause", ar: "بعد: تقسيم حسب السبب" },
              v: {
                en: "5,100 became 401 (sign in again), 2,900 became 409 (state forbids it), 1,600 stayed 400 or became 422 (fix the input).",
                ar: "5,100 صارت 401 (سجّل الدخول من جديد)، و2,900 صارت 409 (الحالة تمنع ذلك)، و1,600 بقيت 400 أو صارت 422 (صحّح المدخلات)."
              }
            },
            {
              k: { en: "Measured effect", ar: "الأثر المقاس" },
              v: {
                en: "Repeat calls per failure dropped from about 4 to about 1.2, because the client stopped retrying calls that could never succeed.",
                ar: "عدد النداءات المكررة لكل فشل انخفض من حوالي 4 إلى حوالي 1.2، لأن الـ client توقّف عن إعادة نداءات لا يمكن أن تنجح."
              }
            }
          ]
        }
      ]
    },
    {
      key: "internals",
      blocks: [
        {
          t: "p",
          en: "A request passes through a fixed series of checks before your business code runs, and each check owns one status code. Nothing later can rescue a request that failed an earlier check, so the order of the checks decides which code the caller sees.",
          ar: "الـ request يمر عبر سلسلة ثابتة من الفحوص قبل أن يعمل كود المجال عندك، وكل فحص يملك كوداً واحداً. لا شيء لاحق ينقذ request فشل في فحص سابق، لذلك ترتيب الفحوص هو الذي يقرر أي كود يراه المستدعي."
        },
        {
          t: "p",
          en: "Think of the gates at an airport. The first gate checks your ticket is a ticket at all. The second checks your name is on the list. The third checks you are allowed in this lounge. The fourth checks the flight exists. Each gate turns you back for its own reason, and you never reach gate four if gate one stopped you. The HTTP pipeline works the same way.",
          ar: "تخيّل بوابات المطار. البوابة الأولى تتحقق أن ما تحمله تذكرة أصلاً. والثانية تتحقق أن اسمك في القائمة. والثالثة تتحقق أنك مسموح لك بهذه الصالة. والرابعة تتحقق أن الرحلة موجودة. كل بوابة تعيدك لسبب يخصّها، ولن تصل للبوابة الرابعة إذا أوقفتك الأولى. الـ HTTP pipeline يعمل بنفس الطريقة."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "1. Parsing and binding", ar: "1. التحليل والربط" },
              v: {
                en: "The body is not valid JSON, or a field has the wrong type. The framework answers 400 before your method runs at all.",
                ar: "الـ body ليس JSON صالحاً، أو حقل من نوع خاطئ. الـ framework يُرجع 400 قبل أن تعمل الدالة عندك أصلاً."
              }
            },
            {
              k: { en: "2. Authentication", ar: "2. Authentication" },
              v: {
                en: "No token, or an expired one. 401 means: I do not know who you are — prove it and come back.",
                ar: "لا يوجد token أو أنه منتهي. 401 تعني: لا أعرف من أنت — أثبت هويتك وعُد."
              }
            },
            {
              k: { en: "3. Authorization", ar: "3. Authorization" },
              v: {
                en: "I know who you are, and you are not allowed. 403 means: signing in again will not help.",
                ar: "أعرف من أنت، ولستَ مسموحاً لك. 403 تعني: تسجيل الدخول من جديد لن يفيد."
              }
            },
            {
              k: { en: "4. Resource lookup", ar: "4. البحث عن الـ resource" },
              v: {
                en: "Order 1234 does not exist, or was deleted. 404 means: this URL points at nothing.",
                ar: "الـ order رقم 1234 غير موجود أو حُذف. 404 تعني: هذا الـ URL لا يشير إلى شيء."
              }
            },
            {
              k: { en: "5. Semantic validation", ar: "5. التحقق الدلالي" },
              v: {
                en: "The JSON parsed fine but a value breaks a rule — an empty reason, a quantity of -3. 422 means: I understood you, the values are wrong.",
                ar: "الـ JSON تم تحليله بنجاح لكن قيمة تكسر قاعدة — reason فارغ، أو كمية -3. 422 تعني: فهمتك، لكن القيم خاطئة."
              }
            },
            {
              k: { en: "6. Business rule", ar: "6. قاعدة العمل" },
              v: {
                en: "Everything is valid but the order is already shipped. 409 means: the request is fine, the current state forbids it.",
                ar: "كل شيء صالح لكن الـ order تم شحنه. 409 تعني: الـ request سليم، لكن الحالة الحالية تمنعه."
              }
            }
          ]
        },
        {
          t: "p",
          en: "The line that trips people is between 400 and 422. Use 400 when the server could not even read the request — broken JSON, a string where a number belongs, a missing required header. Use 422 when the request was read successfully and the values themselves are unacceptable. A useful test: if you had to parse the body to discover the problem, it is 422.",
          ar: "الخط الذي يربك الناس هو بين 400 و422. استخدم 400 عندما لا يستطيع الـ server قراءة الـ request أصلاً — JSON مكسور، أو نص مكان رقم، أو header مطلوب مفقود. واستخدم 422 عندما تمت قراءة الـ request بنجاح والقيم نفسها غير مقبولة. اختبار مفيد: إذا اضطررت لتحليل الـ body لتكتشف المشكلة، فهي 422."
        },
        {
          t: "code",
          lang: "csharp",
          label: { en: "The six checks in one handler", ar: "الفحوص الستة في handler واحد" },
          code: "[Authorize] // stage 2: no or expired token -> 401, before this method runs\n[HttpPost(\"/api/orders/{id}/cancel\")]\npublic async Task<IActionResult> Cancel(int id, CancelRequest body)\n{\n    // stage 1 already happened: malformed JSON -> 400 from model binding\n\n    // stage 5: values are readable but wrong\n    if (string.IsNullOrWhiteSpace(body.Reason))\n        return UnprocessableEntity(new { field = \"reason\", error = \"required\" });\n\n    var order = await _db.Orders.FindAsync(id);\n\n    // stage 4: nothing at this URL\n    if (order is null)\n        return NotFound();\n\n    // stage 3: known caller, not their order\n    if (order.CustomerId != CurrentUserId)\n        return Forbid();\n\n    // stage 6: valid request, wrong state\n    if (order.Status == OrderStatus.Shipped)\n        return Conflict(new { error = \"order_already_shipped\" });\n\n    order.Cancel(body.Reason);\n    await _db.SaveChangesAsync();\n    return NoContent(); // 204: it worked, nothing to send back\n}"
        },
        {
          t: "p",
          en: "One deliberate choice above: the lookup runs before the ownership check, so a caller asking about someone else's order gets 403 rather than 404. That tells them the order exists. For a shop that is fine. For anything where the mere existence of a record is private — medical files, private repositories — return 404 instead, so a stranger cannot map out what exists by watching which code comes back.",
          ar: "هناك خيار مقصود في الأعلى: البحث يسبق فحص الملكية، فالمستدعي الذي يسأل عن order لشخص آخر يحصل على 403 لا 404. هذا يخبره أن الـ order موجود. في متجر هذا مقبول. أما فيما تكون مجرّد معرفة وجود السجل معلومة خاصة — ملفات طبية، مستودعات خاصة — فأرجع 404 بدلاً منها، حتى لا يستطيع غريب رسم خريطة الموجود بمراقبة الكود العائد."
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
              "Clients can decide what to do without reading any text",
              "Retry logic becomes automatic: retry 5xx and 429, never retry 4xx",
              "Dashboards split by code show you which failure is growing",
              "Support can read a log line and know the cause"
            ],
            ar: [
              "الـ clients تقرر ماذا تفعل دون قراءة أي نص",
              "منطق إعادة المحاولة يصير آلياً: أعد على 5xx و429، ولا تعد على 4xx",
              "لوحات المراقبة المقسّمة حسب الكود تُظهر أي فشل يتصاعد",
              "الدعم يقرأ سطر log ويعرف السبب"
            ]
          },
          cons: {
            en: [
              "More codes means more branches to write and test in every client",
              "Teams argue over 400 vs 422 and burn review time",
              "Precise codes can leak information, like whether a record exists",
              "Changing a code later is a breaking change for existing clients"
            ],
            ar: [
              "أكواد أكثر تعني فروعاً أكثر تُكتب وتُختبر في كل client",
              "الفرق تتجادل بين 400 و422 وتستهلك وقت المراجعة",
              "الأكواد الدقيقة قد تسرّب معلومات، مثل وجود سجل من عدمه",
              "تغيير كود لاحقاً هو breaking change للـ clients الحالية"
            ]
          },
          limits: {
            en: [
              "A code says what class of thing went wrong, never which field",
              "Some proxies and gateways rewrite unusual codes on the way out",
              "Browsers treat 401 specially and may pop a login box",
              "Codes cannot express partial success in a batch call"
            ],
            ar: [
              "الكود يقول أي صنف من الخطأ حدث، ولا يقول أي حقل",
              "بعض الـ proxies والـ gateways تعيد كتابة الأكواد غير المألوفة في طريق الخروج",
              "المتصفحات تعامل 401 معاملة خاصة وقد تُظهر نافذة تسجيل دخول",
              "الأكواد لا تعبّر عن نجاح جزئي في نداء دفعي"
            ]
          },
          alts: {
            en: [
              "One error body shape (problem details) carrying a machine-readable code string",
              "A small fixed set: 400, 401, 403, 404, 409, 500 only",
              "GraphQL style: always 200, errors described in the body",
              "Per-field validation errors listed inside a 422 body"
            ],
            ar: [
              "شكل موحّد لجسم الخطأ (problem details) يحمل code نصياً تقرأه الآلة",
              "مجموعة صغيرة ثابتة: 400 و401 و403 و404 و409 و500 فقط",
              "أسلوب GraphQL: دائماً 200، والأخطاء موصوفة في الـ body",
              "أخطاء التحقق لكل حقل مسرودة داخل جسم 422"
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
          title: { en: "Returning 200 with an error inside", ar: "إرجاع 200 مع خطأ في الداخل" },
          body: {
            en: "The cancel endpoint returned 200 with a body of success false, message order already shipped. Every monitoring dashboard showed a 100% success rate while a third of cancellations were failing. Nobody noticed for six weeks, because alerts were wired to the status code, not the body.",
            ar: "الـ cancel endpoint أرجع 200 مع body فيه success = false ورسالة تقول إن الـ order تم شحنه. كل لوحات المراقبة أظهرت نسبة نجاح 100% بينما ثلث عمليات الإلغاء كانت تفشل. لم ينتبه أحد لستة أسابيع، لأن التنبيهات مربوطة بالـ status code لا بالـ body."
          },
          fix: "// wrong\nreturn Ok(new { success = false, message = \"order already shipped\" });\n\n// right\nreturn Conflict(new { error = \"order_already_shipped\" });"
        },
        {
          t: "mistake",
          title: { en: "Using 401 when you mean 403", ar: "استخدام 401 بينما المقصود 403" },
          body: {
            en: "A support agent tried to cancel a customer's order and got 401. The mobile client saw 401, deleted the stored token and forced a logout. The agent was signed in correctly — she simply lacked the cancel permission. That is 403: the answer is the same no matter how many times you sign in.",
            ar: "موظف دعم حاول إلغاء order لعميل فحصل على 401. الـ client رأى 401 فحذف الـ token المخزّن وأجبر على تسجيل الخروج. الموظفة كانت مسجّلة دخول بشكل صحيح — كانت فقط لا تملك صلاحية الإلغاء. هذه 403: الجواب نفسه مهما أعدت تسجيل الدخول."
          }
        },
        {
          t: "mistake",
          title: { en: "404 for a failed business rule", ar: "404 لقاعدة عمل فشلت" },
          body: {
            en: "Cancelling an already-cancelled order returned 404, because the query filtered on status equals Active and found no row. The client showed the order does not exist, and a customer opened a ticket saying the app lost her order. The order existed; only its state blocked the action. That is 409.",
            ar: "إلغاء order مُلغى مسبقاً أرجع 404، لأن الاستعلام كان يفلتر على status = Active فلم يجد صفاً. الـ client عرض أن الـ order غير موجود، وفتحت عميلة تذكرة تقول إن التطبيق فقد الـ order الخاص بها. الـ order كان موجوداً؛ حالته فقط منعت العملية. هذه 409."
          },
          fix: "// wrong: filter hides the row, so you cannot tell missing from ineligible\nvar order = await _db.Orders\n    .FirstOrDefaultAsync(o => o.Id == id && o.Status == OrderStatus.Active);\nif (order is null) return NotFound();\n\n// right: load it, then judge its state\nvar order = await _db.Orders.FirstOrDefaultAsync(o => o.Id == id);\nif (order is null) return NotFound();\nif (order.Status != OrderStatus.Active) return Conflict();"
        },
        {
          t: "mistake",
          title: { en: "500 for a caller's bad input", ar: "500 لمدخلات سيئة من المستدعي" },
          body: {
            en: "An unhandled FormatException from parsing a date turned into a 500. The client library treated 500 as retryable and sent the same broken date four more times with backoff. Five copies of a request that could never succeed, plus a page for the on-call engineer. Bad input is 4xx; it must never be retried.",
            ar: "استثناء FormatException غير مُعالج من تحليل تاريخ تحوّل إلى 500. مكتبة الـ client اعتبرت 500 قابلة لإعادة المحاولة فأرسلت نفس التاريخ المكسور أربع مرات إضافية مع backoff. خمس نسخ من request لا يمكن أن ينجح، مع تنبيه لمهندس المناوبة. المدخلات السيئة هي 4xx، ويجب ألا يُعاد إرسالها أبداً."
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
          q: { en: "What is the difference between 4xx and 5xx?", ar: "ما الفرق بين 4xx و5xx؟" },
          a: {
            en: "4xx means the problem is in the request, so sending it again unchanged gives the same failure. 5xx means the server broke while doing its own work, so the exact same request might succeed on a second try. That split is what retry logic is built on.",
            ar: "4xx تعني أن المشكلة في الـ request، فإعادة إرساله دون تغيير تعطي نفس الفشل. و5xx تعني أن الـ server تعطّل أثناء عمله هو، فنفس الـ request قد ينجح في محاولة ثانية. هذا الفصل هو ما يُبنى عليه منطق إعادة المحاولة."
          }
        },
        {
          t: "qa",
          level: "mid",
          q: { en: "When do you return 400 and when 422?", ar: "متى تُرجع 400 ومتى 422؟" },
          a: {
            en: "400 when the server could not read the request at all — broken JSON, a string where a number was expected, a missing required header. 422 when it read the request fine but a value breaks a rule, like an empty cancel reason or a quantity of -3. My rule of thumb: if I had to parse the body to find the problem, it is 422.",
            ar: "400 عندما لا يستطيع الـ server قراءة الـ request أصلاً — JSON مكسور، أو نص مكان رقم، أو header مطلوب مفقود. و422 عندما قرأه بنجاح لكن قيمة تكسر قاعدة، مثل reason فارغ أو كمية -3. قاعدتي العملية: إذا اضطررت لتحليل الـ body لأجد المشكلة، فهي 422."
          }
        },
        {
          t: "qa",
          level: "mid",
          q: { en: "401 or 403 for a user who lacks a permission?", ar: "401 أم 403 لمستخدم لا يملك صلاحية؟" },
          a: {
            en: "403. 401 says I do not know who you are, so the client should send credentials and try again. 403 says I know exactly who you are and the answer is no, so retrying with the same identity is pointless. Mixing them up makes clients log people out for no reason.",
            ar: "403. الـ 401 تقول لا أعرف من أنت، فالـ client يجب أن يرسل بيانات اعتماد ويحاول مجدداً. والـ 403 تقول أعرفك تماماً والجواب لا، فإعادة المحاولة بنفس الهوية بلا فائدة. الخلط بينهما يجعل الـ clients تُخرج المستخدمين من حساباتهم بلا سبب."
          }
        },
        {
          t: "qa",
          level: "senior",
          q: { en: "Should a caller who is not allowed to see a record get 403 or 404?", ar: "هل يحصل مستدعٍ غير مسموح له برؤية سجل على 403 أم 404؟" },
          a: {
            en: "It depends on whether existence itself is secret. In a shop, 403 is fine and clearer. In a system where knowing a record exists is already a leak — a private repository, a patient file — return 404, because otherwise someone can walk through identifiers and learn which ones are real just from the code they get back. Decide this once and apply it to the whole API.",
            ar: "يعتمد على ما إذا كان الوجود نفسه سراً. في متجر، 403 مقبولة وأوضح. أما في نظام تكون فيه معرفة وجود السجل تسريباً بحد ذاته — مستودع خاص، ملف مريض — فأرجع 404، وإلا استطاع أحدهم المرور على المعرّفات ومعرفة الحقيقي منها من الكود العائد فقط. اتخذ هذا القرار مرة واحدة وطبّقه على الـ API كله."
          }
        },
        {
          t: "qa",
          level: "senior",
          q: { en: "What does 409 mean beyond the word conflict?", ar: "ماذا تعني 409 أبعد من كلمة تعارض؟" },
          a: {
            en: "409 means the request is well-formed and you are allowed to make it, but the current state of the resource makes it impossible right now. Cancelling a shipped order, or writing with an ETag that no longer matches because someone else edited the record first. The distinguishing feature is that the same request could have succeeded a minute earlier, or could succeed later if the state changes.",
            ar: "409 تعني أن الـ request سليم البنية ومسموح لك به، لكن الحالة الحالية للـ resource تجعله مستحيلاً الآن. مثل إلغاء order تم شحنه، أو كتابة بـ ETag لم يعد مطابقاً لأن شخصاً آخر عدّل السجل قبلك. الميزة الفارقة أن نفس الـ request كان يمكن أن ينجح قبل دقيقة، أو قد ينجح لاحقاً إذا تغيّرت الحالة."
          }
        },
        {
          t: "qa",
          level: "staff",
          q: { en: "Twelve teams pick codes differently. How do you fix that?", ar: "اثنا عشر فريقاً يختارون الأكواد بطرق مختلفة. كيف تعالج ذلك؟" },
          a: {
            en: "Not by writing a wiki page nobody reads. I would put the decision in shared code: one error-mapping library that turns a small set of domain failure types — NotFound, Forbidden, InvalidInput, StateConflict — into codes and a single body shape, and have every service use it. Then add a contract test in the shared pipeline that fails a build if an endpoint returns 200 with an error body or a 500 on a validation path. Make the correct choice the path of least effort, and the debate disappears.",
            ar: "ليس بكتابة صفحة wiki لا يقرأها أحد. سأضع القرار في كود مشترك: مكتبة واحدة لتحويل الأخطاء تأخذ مجموعة صغيرة من أنواع الفشل في المجال — NotFound وForbidden وInvalidInput وStateConflict — وتحوّلها إلى أكواد وشكل body موحّد، وتستخدمها كل الخدمات. ثم أضيف contract test في الـ pipeline المشترك يُفشل البناء إذا أرجع endpoint كود 200 مع جسم خطأ، أو 500 في مسار تحقق. اجعل الخيار الصحيح هو الأسهل، ويختفي الجدل."
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
          title: { en: "A catch-all that turns every failure into 500", ar: "catch شامل يحوّل كل فشل إلى 500" },
          bad: "try\n{\n    await _orders.CancelAsync(id, body.Reason);\n    return NoContent();\n}\ncatch (Exception ex)\n{\n    _log.LogError(ex, \"cancel failed\");\n    return StatusCode(500);\n}",
          good: "try\n{\n    await _orders.CancelAsync(id, body.Reason);\n    return NoContent();\n}\ncatch (OrderNotFoundException)\n{\n    return NotFound();\n}\ncatch (OrderStateException ex)\n{\n    return Conflict(new { error = ex.Code });\n}\n// anything else falls through to the global handler, which logs and returns 500",
          why: {
            en: "The bad version reports a caller mistake as a server failure. Clients retry 5xx, so a request that can never succeed gets sent again and again, and the on-call engineer is paged for a bug that does not exist. Catch the failures you can classify, and let genuine surprises reach the global handler that returns 500.",
            ar: "النسخة السيئة تبلّغ عن خطأ من المستدعي كأنه فشل في الـ server. الـ clients تعيد المحاولة على 5xx، فيُرسل request لا يمكن أن ينجح مراراً وتكراراً، ويُستدعى مهندس المناوبة لعطل غير موجود. التقط الأخطاء التي تستطيع تصنيفها، ودع المفاجآت الحقيقية تصل إلى المعالج العام الذي يُرجع 500."
          }
        },
        {
          t: "review",
          severity: "medium",
          title: { en: "Validation errors with no field names", ar: "أخطاء تحقق بلا أسماء حقول" },
          bad: "if (!ModelState.IsValid)\n    return BadRequest(\"Invalid request\");",
          good: "if (!ModelState.IsValid)\n    return UnprocessableEntity(new ValidationProblemDetails(ModelState));\n// body lists each field and what is wrong with it, so the UI\n// can highlight the exact input the user must fix",
          why: {
            en: "A form with nine fields and the message Invalid request forces the user to guess. ValidationProblemDetails is the built-in ASP.NET Core shape that lists each bad field with its reason, so the client can put the message under the right input box. The code also moves to 422, because the request parsed fine and only the values are wrong.",
            ar: "نموذج فيه تسعة حقول ورسالة تقول طلب غير صالح تجبر المستخدم على التخمين. الـ ValidationProblemDetails هو الشكل الجاهز في ASP.NET Core الذي يسرد كل حقل خاطئ وسببه، فيستطيع الـ client وضع الرسالة تحت الحقل الصحيح. والكود ينتقل أيضاً إلى 422، لأن الـ request تم تحليله بنجاح والقيم وحدها خاطئة."
          }
        }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        {
          t: "p",
          en: "In a system with several services behind a gateway, status codes are the only shared language between them. An order service calling a payment service decides whether to retry, fail the whole operation, or return a message to the user based purely on the code it gets back. If the payment service answers 500 for a declined card, the order service will retry a decline five times and slow every checkout behind it.",
          ar: "في نظام فيه عدة خدمات خلف gateway، الـ status codes هي اللغة المشتركة الوحيدة بينها. خدمة الـ orders التي تنادي خدمة الدفع تقرر هل تعيد المحاولة، أم تُفشل العملية كلها، أم تُرجع رسالة للمستخدم، بناءً على الكود العائد وحده. وإذا أجابت خدمة الدفع بـ 500 على بطاقة مرفوضة، ستعيد خدمة الـ orders محاولة الرفض خمس مرات وتبطئ كل عمليات الدفع خلفها."
        },
        {
          t: "ul",
          en: [
            "Gateways and load balancers add their own codes: 502 when the upstream service crashed, 503 when it is unreachable, 504 when it did not answer in time.",
            "429 means you are sending too fast. Pair it with a Retry-After header saying how many seconds to wait, so clients back off by instruction instead of by guess.",
            "Circuit breakers and retry policies are configured by code class, not by message, so an internal service returning the wrong class quietly breaks them.",
            "Keep the code-to-cause mapping identical across services; a caller should not need to learn which service it is talking to."
          ],
          ar: [
            "الـ gateways وموزّعات الحمل تضيف أكوادها: 502 عند انهيار الخدمة الخلفية، و503 عند تعذّر الوصول إليها، و504 عندما لا تجيب في الوقت المحدد.",
            "الكود 429 يعني أنك ترسل بسرعة زائدة. اقرنه بـ header اسمه Retry-After يقول كم ثانية يجب الانتظار، ليتراجع الـ client بتعليمات لا بتخمين.",
            "الـ circuit breakers وسياسات إعادة المحاولة تُضبط حسب صنف الكود لا حسب الرسالة، فخدمة داخلية تُرجع الصنف الخاطئ تكسرها بصمت.",
            "أبقِ ربط الكود بالسبب متطابقاً عبر كل الخدمات؛ المستدعي يجب ألا يحتاج لمعرفة أي خدمة يكلّم."
          ]
        },
        {
          t: "callout",
          kind: "warn",
          en: "Never map an upstream 4xx straight through to your caller. If the payment service says 400 because your service sent a malformed field, that is your bug, not your caller's — surface it as 500 to them and fix the field.",
          ar: "لا تمرّر كود 4xx من خدمة خلفية كما هو إلى المستدعي عندك. إذا قالت خدمة الدفع 400 لأن خدمتك أرسلت حقلاً مشوّهاً، فهذا خطؤك لا خطأ المستدعي — أظهره له كـ 500 وأصلح الحقل."
        }
      ]
    },
    {
      key: "perf",
      blocks: [
        {
          t: "kv",
          rows: [
            {
              k: { en: "Latency", ar: "Latency" },
              v: {
                en: "Reject early. A 422 decided from the request body costs microseconds; a 404 decided after a database lookup costs a full round trip, often 2-10 ms.",
                ar: "ارفض مبكراً. الـ 422 المقرّرة من جسم الـ request تكلّف ميكروثواني؛ أما 404 المقرّرة بعد استعلام قاعدة بيانات فتكلّف رحلة كاملة، غالباً 2-10 ميلي ثانية."
              }
            },
            {
              k: { en: "Network", ar: "Network" },
              v: {
                en: "A wrong 5xx multiplies traffic. A client retrying four times turns 1,000 failures into 5,000 requests for the same never-succeeding call.",
                ar: "كود 5xx خاطئ يضاعف الـ traffic. الـ client الذي يعيد المحاولة أربع مرات يحوّل 1,000 فشل إلى 5,000 request لنفس النداء الذي لن ينجح."
              }
            },
            {
              k: { en: "Database", ar: "Database" },
              v: {
                en: "Doing authorization before the lookup saves a query on every forbidden call, but costs you the ability to answer 404 accurately. Pick per endpoint.",
                ar: "تنفيذ الـ authorization قبل البحث يوفّر استعلاماً في كل نداء ممنوع، لكنه يكلّفك القدرة على إرجاع 404 بدقة. اختر لكل endpoint على حدة."
              }
            },
            {
              k: { en: "Scalability", ar: "Scalability" },
              v: {
                en: "429 with Retry-After is your pressure valve. Without it, overloaded services return 500 and the retries make the overload worse.",
                ar: "الكود 429 مع Retry-After هو صمّام الضغط. بدونه تُرجع الخدمات المحمّلة 500 فتزيد إعادات المحاولة الحمل سوءاً."
              }
            },
            {
              k: { en: "CPU", ar: "CPU" },
              v: {
                en: "Throwing an exception per rejected request is far more expensive than returning a result object. On a validation path taking thousands of requests per second, that shows up.",
                ar: "رمي exception لكل request مرفوض أغلى بكثير من إرجاع كائن نتيجة. في مسار تحقق يستقبل آلاف الـ requests في الثانية، يظهر هذا الفرق."
              }
            }
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
            "curl -i https://api.example.com/api/orders/1234/cancel -X POST -d '{}' — the -i flag prints the status line and headers; look at the first line to see the code the server really sent, before any client library reshaped it.",
            "Browser DevTools, Network tab — the Status column shows the code per call; sort by it to find which endpoint is producing 500s.",
            "Your access log with status and route on every line — group by both to spot an endpoint returning 200 for failures, which shows up as a suspiciously perfect success rate.",
            "A metrics counter tagged with the status class (2xx, 4xx, 5xx) per route — a rising 4xx line usually means a client deployed a change, a rising 5xx line means you did.",
            "An integration test per failure path asserting the exact code — this is the only check that stops a refactor from silently turning a 409 back into a 500."
          ],
          ar: [
            "curl -i https://api.example.com/api/orders/1234/cancel -X POST -d '{}' — الخيار -i يطبع سطر الحالة والـ headers؛ انظر إلى السطر الأول لترى الكود الذي أرسله الـ server فعلاً قبل أن تعيد أي مكتبة تشكيله.",
            "أدوات المطوّر في المتصفح، تبويب Network — عمود Status يعرض الكود لكل نداء؛ رتّب حسبه لتجد أي endpoint ينتج 500.",
            "سجل الوصول عندك مع status والمسار في كل سطر — جمّع حسبهما لاكتشاف endpoint يُرجع 200 للفشل، ويظهر ذلك كنسبة نجاح مثالية بشكل مريب.",
            "عدّاد metrics موسوم بصنف الكود (2xx و4xx و5xx) لكل مسار — ارتفاع خط 4xx يعني عادة أن client نشر تغييراً، وارتفاع خط 5xx يعني أنك أنت نشرت.",
            "اختبار تكامل لكل مسار فشل يتحقق من الكود بدقة — هذا هو الفحص الوحيد الذي يمنع إعادة هيكلة من تحويل 409 إلى 500 بصمت."
          ]
        },
        {
          t: "callout",
          kind: "tip",
          en: "When a code looks wrong, check the layers between you and the caller before you change the handler. A gateway, a proxy or a client SDK can rewrite the code on the way out — curl straight at the service and compare.",
          ar: "عندما يبدو الكود خاطئاً، افحص الطبقات بينك وبين المستدعي قبل أن تعدّل الـ handler. الـ gateway أو الـ proxy أو الـ SDK قد يعيد كتابة الكود في طريق الخروج — نفّذ curl مباشرة على الخدمة وقارن."
        }
      ]
    },
    {
      key: "realworld",
      blocks: [
        {
          t: "p",
          en: "Any system where a client must decide automatically what to do after a failure depends on these codes being right. The higher the cost of a wrong retry — money moved twice, a seat double-booked — the more the exact code matters.",
          ar: "أي نظام يجب فيه على الـ client أن يقرر آلياً ماذا يفعل بعد الفشل يعتمد على صحة هذه الأكواد. وكلما ارتفعت تكلفة إعادة المحاولة الخاطئة — مبلغ يُحوَّل مرتين، أو مقعد يُحجز مرتين — زادت أهمية دقة الكود."
        },
        {
          t: "ul",
          en: [
            "Payment systems: a declined card is 402 or 422, never 500, because a retried charge can take the money twice.",
            "Booking and ticketing: the seat taken between your search and your confirm is the textbook 409 — the request was valid when you built it, the state changed underneath.",
            "File and media upload services: a file larger than the limit is 413, a type the service cannot handle is 415, and neither should be retried.",
            "Multi-tenant SaaS platforms: asking for another tenant's record returns 404 rather than 403, so no customer can discover that another customer's data exists."
          ],
          ar: [
            "أنظمة الدفع: البطاقة المرفوضة هي 402 أو 422 ولا تكون 500 أبداً، لأن إعادة محاولة الخصم قد تأخذ المبلغ مرتين.",
            "الحجز والتذاكر: المقعد الذي حُجز بين بحثك وتأكيدك هو المثال الكلاسيكي لـ 409 — الـ request كان صالحاً عند بنائه، والحالة تغيّرت تحته.",
            "خدمات رفع الملفات والوسائط: ملف أكبر من الحد هو 413، ونوع لا تدعمه الخدمة هو 415، ولا يجوز إعادة المحاولة في الحالتين.",
            "منصات SaaS متعددة المستأجرين: طلب سجل لمستأجر آخر يُرجع 404 لا 403، حتى لا يكتشف عميل وجود بيانات عميل آخر."
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
          en: "Write the cancel endpoint from this lesson and produce all six failures by hand with curl -i: malformed JSON, no token, wrong user, missing order, empty reason, already shipped. You are done when the six calls print 400, 401, 403, 404, 422 and 409 in that order.",
          ar: "اكتب الـ cancel endpoint من هذا الدرس وأنتج الفشول الستة يدوياً بـ curl -i: JSON مشوّه، وبلا token، ومستخدم خاطئ، وorder غير موجود، وreason فارغ، وorder تم شحنه. تنتهي عندما تطبع النداءات الستة 400 و401 و403 و404 و422 و409 بهذا الترتيب."
        },
        {
          t: "ex",
          diff: "medium",
          en: "Replace the string error bodies with ValidationProblemDetails and ProblemDetails, so every failure returns the same JSON shape with a type, title, status and a machine-readable error code. You are done when a client can branch on one field for every error in the API.",
          ar: "استبدل أجسام الأخطاء النصية بـ ValidationProblemDetails وProblemDetails، بحيث يُرجع كل فشل نفس شكل الـ JSON مع type وtitle وstatus وerror code تقرأه الآلة. تنتهي عندما يستطيع الـ client أن يبني قراره على حقل واحد لكل خطأ في الـ API."
        },
        {
          t: "ex",
          diff: "hard",
          en: "Add optimistic concurrency: the client sends the ETag it read, and if the order changed since then the server answers 409. Prove it by running two cancel requests with the same stale ETag and showing that the first gets 204 and the second gets 409.",
          ar: "أضف optimistic concurrency: الـ client يرسل الـ ETag الذي قرأه، وإذا تغيّر الـ order منذ ذلك الحين يُجيب الـ server بـ 409. أثبت ذلك بتشغيل نداءي إلغاء بنفس الـ ETag القديم وإظهار أن الأول يحصل على 204 والثاني على 409."
        },
        {
          t: "ex",
          diff: "senior",
          en: "Write a shared exception-to-status mapper for four domain failure types (NotFound, Forbidden, InvalidInput, StateConflict) plus a test that fails the build if any endpoint returns 200 with an error body or 500 on a validation path. You are done when a deliberately wrong endpoint breaks the build.",
          ar: "اكتب mapper مشتركاً يحوّل أربعة أنواع فشل في المجال (NotFound وForbidden وInvalidInput وStateConflict) إلى status codes، مع اختبار يُفشل البناء إذا أرجع أي endpoint كود 200 مع جسم خطأ أو 500 في مسار تحقق. تنتهي عندما يكسر endpoint خاطئ عمداً عمليةَ البناء."
        }
      ]
    },
    {
      key: "refs",
      blocks: [
        {
          t: "ref",
          label: { en: "RFC 9110 — HTTP Semantics, status code definitions", ar: "RFC 9110 — دلالات HTTP وتعريفات الـ status codes" },
          url: "https://www.rfc-editor.org/rfc/rfc9110.html#name-status-codes",
          meta: { en: "Spec", ar: "مواصفة" }
        },
        {
          t: "ref",
          label: { en: "RFC 9457 — Problem Details for HTTP APIs", ar: "RFC 9457 — تفاصيل المشكلة لواجهات HTTP" },
          url: "https://www.rfc-editor.org/rfc/rfc9457.html",
          meta: { en: "Spec", ar: "مواصفة" }
        },
        {
          t: "ref",
          label: { en: "MDN — HTTP response status codes", ar: "MDN — أكواد حالة استجابة HTTP" },
          url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status",
          meta: { en: "Reference", ar: "مرجع" }
        },
        {
          t: "ref",
          label: { en: "Handle errors in ASP.NET Core web APIs", ar: "معالجة الأخطاء في ASP.NET Core web APIs" },
          url: "https://learn.microsoft.com/en-us/aspnet/core/web-api/handle-errors",
          meta: { en: "Docs", ar: "توثيق" }
        }
      ]
    }
  ],
  quiz: [
    {
      q: {
        en: "A request arrives with valid JSON, but the quantity field is -3. Which code fits best?",
        ar: "وصل request بـ JSON صالح، لكن حقل الكمية فيه -3. أي كود هو الأنسب؟"
      },
      options: [
        { en: "400 — the request was unreadable", ar: "400 — الـ request غير قابل للقراءة" },
        { en: "422 — it was read fine, the value breaks a rule", ar: "422 — قُرئ بنجاح، لكن القيمة تكسر قاعدة" },
        { en: "409 — the current state forbids it", ar: "409 — الحالة الحالية تمنعه" },
        { en: "500 — the server could not handle it", ar: "500 — الـ server لم يستطع معالجته" }
      ],
      correct: 1,
      why: {
        en: "The body parsed successfully, so the server understood the request; only the value is unacceptable. That is exactly what 422 means.",
        ar: "الـ body تم تحليله بنجاح، فالـ server فهم الـ request؛ القيمة وحدها غير مقبولة. وهذا بالضبط معنى 422."
      }
    },
    {
      q: {
        en: "A signed-in support agent lacks the cancel permission. What should the server return?",
        ar: "موظف دعم مسجّل الدخول لا يملك صلاحية الإلغاء. ماذا يجب أن يُرجع الـ server؟"
      },
      options: [
        { en: "401, so the client asks for credentials again", ar: "401، ليطلب الـ client بيانات الاعتماد مجدداً" },
        { en: "403, because identity is known and the answer is no", ar: "403، لأن الهوية معروفة والجواب لا" },
        { en: "404, to hide the endpoint", ar: "404، لإخفاء الـ endpoint" },
        { en: "200 with an error message in the body", ar: "200 مع رسالة خطأ في الـ body" }
      ],
      correct: 1,
      why: {
        en: "401 tells the client to authenticate again, which cannot help here — the agent is already authenticated. 403 says the identity is known and still not allowed.",
        ar: "الـ 401 تطلب من الـ client إعادة المصادقة، وهذا لا يفيد هنا لأن الموظف مصادَق أصلاً. والـ 403 تقول إن الهوية معروفة ومع ذلك غير مسموح."
      }
    },
    {
      q: {
        en: "Why is returning 500 for bad caller input actively harmful?",
        ar: "لماذا يُعد إرجاع 500 لمدخلات سيئة من المستدعي ضاراً فعلياً؟"
      },
      options: [
        { en: "It is slower to serialize", ar: "لأنه أبطأ في التسلسل" },
        { en: "Clients treat 5xx as retryable and resend a call that can never succeed", ar: "لأن الـ clients تعتبر 5xx قابلة لإعادة المحاولة فتعيد إرسال نداء لن ينجح أبداً" },
        { en: "Browsers block 500 responses", ar: "لأن المتصفحات تحجب استجابات 500" },
        { en: "500 cannot carry a response body", ar: "لأن 500 لا تستطيع حمل جسم استجابة" }
      ],
      correct: 1,
      why: {
        en: "The 4xx/5xx split is what retry logic reads. Labelling a client mistake as a server failure multiplies the traffic and pages an engineer for a non-existent outage.",
        ar: "الفصل بين 4xx و5xx هو ما يقرأه منطق إعادة المحاولة. ووسم خطأ المستدعي كفشل في الـ server يضاعف الـ traffic ويستدعي مهندساً لعطل غير موجود."
      }
    },
    {
      q: {
        en: "Cancelling an order that has already shipped should return which code?",
        ar: "إلغاء order تم شحنه مسبقاً يجب أن يُرجع أي كود؟"
      },
      options: [
        { en: "404, since no cancellable order was found", ar: "404، لأنه لم يُعثر على order قابل للإلغاء" },
        { en: "400, since the request is wrong", ar: "400، لأن الـ request خاطئ" },
        { en: "409, since the request is valid but the state forbids it", ar: "409، لأن الـ request صالح لكن الحالة تمنعه" },
        { en: "403, since the action is not permitted", ar: "403، لأن العملية غير مسموحة" }
      ],
      correct: 2,
      why: {
        en: "The order exists and the caller is allowed to ask; only the current state blocks the action. 404 would tell the user their order vanished, which is false and generates support tickets.",
        ar: "الـ order موجود والمستدعي مسموح له بالسؤال؛ الحالة الحالية وحدها تمنع العملية. و404 ستخبر المستخدم أن الـ order اختفى، وهذا غير صحيح ويولّد تذاكر دعم."
      }
    },
    {
      q: {
        en: "In a multi-tenant system, a caller requests another tenant's record. Which behaviour is safest?",
        ar: "في نظام متعدد المستأجرين، يطلب مستدعٍ سجلاً لمستأجر آخر. أي سلوك هو الأكثر أماناً؟"
      },
      options: [
        { en: "403, which is the most accurate description", ar: "403، لأنها الوصف الأدق" },
        { en: "404, so existence of the record is not revealed", ar: "404، حتى لا يُكشف وجود السجل" },
        { en: "401, to force a fresh login", ar: "401، لإجبار تسجيل دخول جديد" },
        { en: "200 with an empty body", ar: "200 مع body فارغ" }
      ],
      correct: 1,
      why: {
        en: "403 confirms the record exists. Someone walking through identifiers could map out which ones are real. When existence itself is private, 404 is the correct answer even though it is less precise.",
        ar: "الـ 403 تؤكد أن السجل موجود، فيستطيع من يمرّ على المعرّفات أن يرسم خريطة الحقيقي منها. وعندما يكون الوجود نفسه معلومة خاصة، تكون 404 هي الجواب الصحيح رغم أنها أقل دقة."
      }
    }
  ]
};
```

NEXT: status-retry
