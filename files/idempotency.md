```js
const idempotencyLesson = {
  id: "idempotency",
  moduleId: "distributed",
  title: { en: "Idempotency keys", ar: "مفاتيح الـ idempotency" },
  summary: {
    en: "How a client can safely retry a request that creates something, without creating it twice.",
    ar: "كيف يعيد الـ client محاولة request ينشئ شيئاً، من غير أن ينشئه مرتين."
  },
  mins: 14,
  sections: [
    {
      key: "why",
      blocks: [
        {
          t: "p",
          en: "An idempotency key is a unique string the client attaches to a request so the server can recognise a repeat of that exact request and answer it without doing the work a second time. It exists because a client that never hears back from the server cannot tell whether the work happened or not, and retrying is the only thing it can do.",
          ar: "الـ idempotency key هو نص فريد يرسله الـ client مع الـ request حتى يستطيع الـ server أن يتعرّف على تكرار نفس الـ request ويرد عليه من دون تنفيذ العمل مرة ثانية. سبب وجوده أن الـ client الذي لا يصله رد لا يعرف هل تم العمل أم لا، وإعادة المحاولة هي الشيء الوحيد الذي يملكه."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "Idempotent", ar: "Idempotent" },
              v: {
                en: "Doing the operation once and doing it five times leave the system in the same state. Deleting order 8842 is idempotent; adding 250 to a balance is not.",
                ar: "تنفيذ العملية مرة واحدة وتنفيذها خمس مرات يتركان النظام في نفس الحالة. حذف order رقم 8842 هو idempotent؛ إضافة 250 إلى رصيد ليست كذلك."
              }
            },
            {
              k: { en: "Idempotency key", ar: "Idempotency key" },
              v: {
                en: "A random string, usually a UUID (a 128-bit random identifier such as 7f3c1a9e-...), that the client generates once per business action and sends in the Idempotency-Key header.",
                ar: "نص عشوائي، غالباً UUID (معرّف عشوائي بطول 128 bit مثل 7f3c1a9e-...)، ينشئه الـ client مرة واحدة لكل عملية أعمال ويرسله في الـ header باسم Idempotency-Key."
              }
            },
            {
              k: { en: "At-least-once delivery", ar: "At-least-once delivery" },
              v: {
                en: "The guarantee you actually get on a network: a message arrives one or more times. Never exactly once, because the sender must retry when it hears nothing.",
                ar: "الضمان الحقيقي على الشبكة: الرسالة تصل مرة أو أكثر. لا توجد مرة واحدة بالضبط، لأن المرسل مضطر لإعادة المحاولة عندما لا يصله رد."
              }
            },
            {
              k: { en: "Dedup store", ar: "Dedup store" },
              v: {
                en: "The table or cache where the server remembers 'I have already seen this key, and here is the response I gave'. Short for deduplication store.",
                ar: "الجدول أو الـ cache الذي يتذكر فيه الـ server أنه رأى هذا المفتاح من قبل، مع الرد الذي أعطاه. اختصار لـ deduplication store."
              }
            },
            {
              k: { en: "Request fingerprint", ar: "Request fingerprint" },
              v: {
                en: "A hash of the request body, stored next to the key, so the server can tell a genuine retry apart from a different request that reused the same key by mistake.",
                ar: "hash لجسم الـ request يُخزَّن بجانب المفتاح، حتى يفرّق الـ server بين إعادة محاولة حقيقية و request مختلف أعاد استخدام نفس المفتاح بالخطأ."
              }
            },
            {
              k: { en: "Effectively-once", ar: "Effectively-once" },
              v: {
                en: "At-least-once delivery plus server-side deduplication. The message may arrive many times, but its effect happens once. This is what people mean when they say 'exactly-once'.",
                ar: "at-least-once delivery مع إزالة التكرار في الـ server. الرسالة قد تصل مرات كثيرة، لكن أثرها يحدث مرة واحدة. هذا ما يقصده الناس عندما يقولون exactly-once."
              }
            }
          ]
        },
        {
          t: "p",
          en: "Here is the situation that forces this. A mobile app calls POST /payments to charge 250 SAR for order 8842. The server charges the card, then the response is lost — the phone switched from Wi-Fi to mobile data mid-request. The app waited 30 seconds, saw nothing, and retried. The card is now charged twice. Nobody wrote a bug; the network simply dropped one reply.",
          ar: "هذا هو الموقف الذي يفرض الفكرة. تطبيق موبايل يستدعي POST /payments لخصم 250 ريال لطلب رقم 8842. الـ server يخصم من البطاقة، ثم يضيع الرد — الجوال انتقل من Wi-Fi إلى بيانات الجوال في منتصف الـ request. التطبيق انتظر 30 ثانية، لم يصله شيء، فأعاد المحاولة. البطاقة الآن مخصومة مرتين. لا أحد كتب bug؛ الشبكة فقط أسقطت رداً واحداً."
        },
        {
          t: "p",
          en: "Think of ordering coffee and paying with cash. If you hand over the money and the cashier turns away before giving you a receipt, you do not know if the order was entered. You could pay again and risk two coffees. What fixes it is a ticket number: you say 'ticket 41' and the cashier checks the board — already made, here it is, no second charge. The idempotency key is that ticket number, and the dedup store is the board the cashier checks.",
          ar: "تخيّل أنك تطلب قهوة وتدفع نقداً. أعطيت النقود ثم انصرف الكاشير قبل أن يعطيك إيصالاً، فأنت لا تعرف هل سُجّل الطلب. قد تدفع مرة أخرى وتحصل على قهوتين. الحل هو رقم تذكرة: تقول «تذكرة 41» فينظر الكاشير في اللوحة — الطلب جاهز، تفضل، بلا خصم ثانٍ. الـ idempotency key هو رقم التذكرة، والـ dedup store هو اللوحة التي ينظر فيها الكاشير."
        },
        {
          t: "callout",
          kind: "note",
          en: "Some methods are idempotent by their own definition: GET, PUT and DELETE are supposed to be repeatable without extra effect. POST is not, and POST is where money and orders get created. That is why idempotency keys are mostly a POST problem.",
          ar: "بعض الـ methods تكون idempotent بحكم تعريفها: GET و PUT و DELETE يفترض أن تتكرر بلا أثر إضافي. أما POST فليست كذلك، وهي المكان الذي تُنشأ فيه المدفوعات والطلبات. لهذا فمشكلة الـ idempotency keys غالباً مشكلة POST."
        }
      ]
    },
    {
      key: "problem",
      blocks: [
        {
          t: "p",
          en: "The concrete failure is a double charge, and it is more common than it feels. On a payments API doing 40,000 charges a day, roughly 0.4% of requests timed out at the client — meaning about 160 requests a day got no answer even though most of them had already succeeded on the server. The app retried every one of them. That produced around 150 duplicate charges a day, each one a refund, a support ticket and a card-network dispute fee.",
          ar: "الفشل الملموس هو خصم مزدوج، وهو أكثر شيوعاً مما يبدو. في payments API ينفّذ 40,000 عملية خصم يومياً، حوالي 0.4% من الـ requests انتهت مهلتها عند الـ client — أي حوالي 160 request يومياً لم يصلها رد رغم أن أغلبها نجح فعلاً في الـ server. التطبيق أعاد المحاولة في كلها. النتيجة حوالي 150 خصماً مكرراً يومياً، كل واحد منها استرداد مبلغ وتذكرة دعم ورسوم نزاع من شبكة البطاقات."
        },
        {
          t: "p",
          en: "The naive fix is to check first: 'does a payment already exist for order 8842?' then insert if not. Under a retry this fails, because the two requests can run at the same moment. Both read the table, both see nothing, both insert. The check and the insert are two separate steps, and anything can happen between them. This gap is called a race condition — two operations racing, and the result depends on which one gets there first.",
          ar: "الحل الساذج هو الفحص أولاً: «هل يوجد payment لطلب 8842؟» ثم الإدراج إن لم يوجد. هذا يفشل مع إعادة المحاولة، لأن الـ requestين قد ينفذان في نفس اللحظة. كلاهما يقرأ الجدول، كلاهما لا يجد شيئاً، كلاهما يُدرج. الفحص والإدراج خطوتان منفصلتان، وأي شيء قد يحدث بينهما. هذه الفجوة تُسمى race condition — عمليتان تتسابقان، والنتيجة تعتمد على من يصل أولاً."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "Before: retry with no key", ar: "قبل: إعادة محاولة بلا مفتاح" },
              v: {
                en: "Two charges of 250 SAR on the same card, two rows in payments, two entries on the customer's statement. The customer notices before you do.",
                ar: "خصمان بقيمة 250 ريال على نفس البطاقة، صفّان في جدول payments، بندان في كشف حساب العميل. العميل يلاحظ قبلك."
              }
            },
            {
              k: { en: "After: retry with a key", ar: "بعد: إعادة محاولة مع مفتاح" },
              v: {
                en: "One charge. The second request finds the key, returns the stored 201 response with the same payment id, and the app shows the same success screen it would have shown the first time.",
                ar: "خصم واحد. الـ request الثاني يجد المفتاح، ويعيد رد 201 المخزَّن بنفس معرّف الـ payment، ويعرض التطبيق نفس شاشة النجاح التي كان سيعرضها في المرة الأولى."
              }
            },
            {
              k: { en: "Cost of the fix", ar: "تكلفة الحل" },
              v: {
                en: "One extra row written per request and one extra index lookup — about 1-2 ms added to a request that already takes 300 ms talking to the card network. Under 1% slower.",
                ar: "صف إضافي واحد يُكتب لكل request وبحث إضافي واحد في الـ index — حوالي 1-2 ms تُضاف إلى request يستغرق أصلاً 300 ms في التخاطب مع شبكة البطاقات. أقل من 1% أبطأ."
              }
            }
          ]
        },
        {
          t: "p",
          en: "One more thing the naive check misses: the key must be created by the client, not the server. If the server generates it, the retry is a brand new request with a brand new key and the server has no way to link the two. The client is the only party that knows 'this is the same button press as before'.",
          ar: "شيء آخر يغفله الفحص الساذج: المفتاح يجب أن ينشئه الـ client لا الـ server. إذا أنشأه الـ server، فإعادة المحاولة تصبح request جديداً بمفتاح جديد ولا يستطيع الـ server ربط الاثنين. الـ client هو الطرف الوحيد الذي يعرف أن هذه نفس الضغطة السابقة على الزر."
        }
      ]
    },
    {
      key: "internals",
      blocks: [
        {
          t: "p",
          en: "The trick that makes this correct is to insert the key first and let the database refuse the duplicate. A unique constraint is a rule on a column that makes the database reject a second row with the same value. Instead of asking 'has this key been used?' and then acting, you try to claim the key with an INSERT. Exactly one of the racing requests wins the insert; every other one gets a duplicate-key error and knows it is the retry.",
          ar: "الحيلة التي تجعل هذا صحيحاً هي إدراج المفتاح أولاً وترك الـ database يرفض التكرار. الـ unique constraint هو قيد على عمود يجعل الـ database يرفض صفاً ثانياً بنفس القيمة. بدل أن تسأل «هل استُخدم هذا المفتاح؟» ثم تتصرف، تحاول حجز المفتاح عبر INSERT. واحد فقط من الـ requests المتسابقة ينجح في الإدراج؛ وكل ما عداه يحصل على خطأ تكرار مفتاح ويعرف أنه إعادة محاولة."
        },
        {
          t: "p",
          en: "Think of a hotel front desk with one physical key per room. Two people ask for room 12. The clerk does not consult a list and then decide; the clerk reaches for the key. One hand comes back with it, the other comes back empty. The empty hand is the duplicate-key error, and it is reliable because there was only ever one key. The unique constraint is that single physical key, and the database is the front desk that hands it out.",
          ar: "تخيّل استقبال فندق فيه مفتاح واحد فقط لكل غرفة. شخصان يطلبان غرفة 12. الموظف لا يراجع قائمة ثم يقرّر؛ الموظف يمد يده إلى المفتاح. يد تعود به ويد تعود فارغة. اليد الفارغة هي خطأ تكرار المفتاح، وهي موثوقة لأن المفتاح كان واحداً من الأساس. الـ unique constraint هو ذلك المفتاح الوحيد، والـ database هو موظف الاستقبال الذي يسلّمه."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "idempotency_keys table", ar: "جدول idempotency_keys" },
              v: {
                en: "Columns: key (unique), user_id, endpoint, request_hash, status, response_code, response_body, created_at. One row per business action.",
                ar: "الأعمدة: key (فريد)، user_id، endpoint، request_hash، status، response_code، response_body، created_at. صف واحد لكل عملية أعمال."
              }
            },
            {
              k: { en: "status column", ar: "عمود status" },
              v: {
                en: "Either 'in_progress' (someone is working on it right now) or 'completed' (the response is stored and can be replayed).",
                ar: "إمّا in_progress (شخص ما ينفّذها الآن) أو completed (الرد مخزَّن ويمكن إعادة إرساله)."
              }
            },
            {
              k: { en: "request_hash", ar: "request_hash" },
              v: {
                en: "SHA-256 of the request body. SHA-256 is a function that turns any text into a fixed 64-character string; the same text always gives the same string.",
                ar: "SHA-256 لجسم الـ request. و SHA-256 دالة تحوّل أي نص إلى نص ثابت الطول من 64 حرفاً؛ نفس النص يعطي دائماً نفس الناتج."
              }
            },
            {
              k: { en: "Scope", ar: "النطاق" },
              v: {
                en: "The key is unique per user and per endpoint, not globally. Two different customers may pick the same UUID and neither should block the other.",
                ar: "المفتاح فريد لكل user ولكل endpoint، لا على مستوى النظام كله. عميلان مختلفان قد يختاران نفس الـ UUID ولا يجوز أن يحجب أحدهما الآخر."
              }
            },
            {
              k: { en: "TTL", ar: "TTL" },
              v: {
                en: "Time to live — how long a key is remembered before cleanup deletes it. 24 hours is a common choice, comfortably longer than any client will keep retrying.",
                ar: "Time to live — كم يبقى المفتاح محفوظاً قبل أن تحذفه عملية التنظيف. 24 ساعة اختيار شائع، وهو أطول بمريح من أي مدة سيستمر فيها الـ client بإعادة المحاولة."
              }
            }
          ]
        },
        {
          t: "p",
          en: "Now trace one request end to end. The app sends POST /payments with header Idempotency-Key: 7f3c1a9e and body {orderId: 8842, amount: 250}. Step one: the server hashes the body. Step two: it opens a database transaction — a group of statements that either all take effect or none do — and inserts a row with that key, that hash and status 'in_progress'. Step three: if the insert succeeds, this request owns the work; it charges the card, writes the payments row, updates the key row to 'completed' with the 201 response body, and commits everything together. Step four: it returns 201.",
          ar: "الآن تتبّع request واحداً من أوله إلى آخره. التطبيق يرسل POST /payments مع header فيه Idempotency-Key: 7f3c1a9e وجسم {orderId: 8842, amount: 250}. الخطوة الأولى: الـ server يحسب hash للجسم. الخطوة الثانية: يفتح transaction في الـ database — مجموعة عبارات إمّا أن تُنفَّذ كلها أو لا يُنفَّذ منها شيء — ويُدرج صفاً بذلك المفتاح وذلك الـ hash وبحالة in_progress. الخطوة الثالثة: إذا نجح الإدراج فهذا الـ request يملك العمل؛ فيخصم من البطاقة، ويكتب صف payments، ويحدّث صف المفتاح إلى completed مع جسم رد 201، ويعمل commit للكل معاً. الخطوة الرابعة: يعيد 201."
        },
        {
          t: "p",
          en: "Now the retry arrives. The insert fails with a duplicate-key error, so the server reads the existing row. If status is 'completed', it replays the stored response — same status code, same body, same payment id — and does no work. If status is still 'in_progress', the first request has not finished yet, so the server returns 409 Conflict with a Retry-After header telling the client to wait a moment. If the hash does not match the stored one, the client reused a key for different content, which is a client bug, so the server returns 422 Unprocessable Entity.",
          ar: "الآن تصل إعادة المحاولة. الإدراج يفشل بخطأ تكرار المفتاح، فيقرأ الـ server الصف الموجود. إذا كانت الحالة completed، يعيد إرسال الرد المخزَّن — نفس status code ونفس الجسم ونفس معرّف الـ payment — ولا ينفّذ أي عمل. وإذا كانت الحالة ما زالت in_progress، فالـ request الأول لم ينته بعد، فيعيد الـ server 409 Conflict مع header اسمه Retry-After يخبر الـ client أن ينتظر قليلاً. وإذا لم يطابق الـ hash المخزَّن، فالـ client أعاد استخدام مفتاح لمحتوى مختلف، وهذا خطأ في الـ client، فيعيد الـ server 422 Unprocessable Entity."
        },
        {
          t: "code",
          lang: "csharp",
          label: { en: "Claim the key, then do the work", ar: "احجز المفتاح ثم نفّذ العمل" },
          code: "public async Task<IResult> Charge(ChargeRequest body, string idemKey, CancellationToken ct)\n{\n    var hash = Convert.ToHexString(SHA256.HashData(JsonSerializer.SerializeToUtf8Bytes(body)));\n\n    await using var tx = await _db.Database.BeginTransactionAsync(ct);\n\n    // 1. Try to claim the key. The unique index decides the winner.\n    var record = new IdempotencyRecord\n    {\n        Key = idemKey, UserId = _user.Id, Endpoint = \"POST /payments\",\n        RequestHash = hash, Status = \"in_progress\", CreatedAt = DateTime.UtcNow\n    };\n    _db.IdempotencyRecords.Add(record);\n\n    try\n    {\n        await _db.SaveChangesAsync(ct);          // throws if the key already exists\n    }\n    catch (DbUpdateException e) when (IsUniqueViolation(e))\n    {\n        _db.ChangeTracker.Clear();\n        var existing = await _db.IdempotencyRecords.AsNoTracking()\n            .SingleAsync(r => r.Key == idemKey && r.UserId == _user.Id, ct);\n\n        if (existing.RequestHash != hash)\n            return Results.UnprocessableEntity(\"Idempotency-Key reused with a different body.\");\n\n        if (existing.Status == \"in_progress\")\n            return Results.StatusCode(409);      // caller should retry shortly\n\n        return Results.Content(existing.ResponseBody!, \"application/json\",\n                               statusCode: existing.ResponseCode);\n    }\n\n    // 2. We own the work. Charge, then store the response in the SAME transaction.\n    var payment = await _cards.ChargeAsync(body.OrderId, body.Amount, idemKey, ct);\n    _db.Payments.Add(payment);\n\n    record.Status = \"completed\";\n    record.ResponseCode = 201;\n    record.ResponseBody = JsonSerializer.Serialize(new { paymentId = payment.Id });\n\n    await _db.SaveChangesAsync(ct);\n    await tx.CommitAsync(ct);\n    return Results.Created($\"/payments/{payment.Id}\", new { paymentId = payment.Id });\n}"
        },
        {
          t: "p",
          en: "One detail carries most of the correctness: the payment row and the 'completed' key row are written in the same transaction. If they were separate writes, the process could die between them, leaving a charge with no record of the key — and the next retry would charge again. Committing them together means the system is never in a state where the work happened but the key does not say so.",
          ar: "تفصيلة واحدة تحمل معظم الصحة: صف الـ payment وصف المفتاح بحالة completed يُكتبان في نفس الـ transaction. لو كانا كتابتين منفصلتين، لأمكن أن يموت الـ process بينهما، فيبقى خصم بلا سجل للمفتاح — وإعادة المحاولة التالية تخصم مرة أخرى. الـ commit المشترك يعني أن النظام لا يمر أبداً بحالة يكون فيها العمل قد تم والمفتاح لا يقول ذلك."
        },
        {
          t: "callout",
          kind: "warn",
          en: "The card network call is outside your database, so the transaction cannot roll it back. That is why you also pass the same key to the card provider — every serious payment API accepts one — so the duplicate is stopped on their side too if your commit fails after the charge.",
          ar: "استدعاء شبكة البطاقات خارج الـ database، فلا يستطيع الـ transaction التراجع عنه. لهذا تمرّر نفس المفتاح أيضاً إلى مزوّد البطاقات — كل payment API جاد يقبل واحداً — حتى يُمنع التكرار عندهم أيضاً إذا فشل الـ commit عندك بعد الخصم."
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
              "Clients can retry a create request safely, which is the only way to survive a lost response.",
              "The duplicate is caught by a database rule, not by code that can race.",
              "The retry gets the original answer, so the user sees one consistent result.",
              "Support can look up one key and see exactly what the client sent and what was returned."
            ],
            ar: [
              "يستطيع الـ client إعادة محاولة request إنشاء بأمان، وهي الطريقة الوحيدة للنجاة من رد ضائع.",
              "التكرار يُمسك بقاعدة في الـ database، لا بكود قابل للتسابق.",
              "إعادة المحاولة تحصل على الرد الأصلي، فيرى المستخدم نتيجة واحدة متسقة.",
              "يستطيع الدعم البحث بمفتاح واحد ورؤية ما أرسله الـ client وما أُعيد له بالضبط."
            ]
          },
          cons: {
            en: [
              "Every protected request writes an extra row and its stored response body.",
              "The client must generate and persist the key, so mobile and web callers need changes too.",
              "You must decide what a retry sees while the first call is still running.",
              "Stored response bodies can hold personal data, so they fall under your data-retention rules."
            ],
            ar: [
              "كل request محمي يكتب صفاً إضافياً مع جسم الرد المخزَّن.",
              "على الـ client أن ينشئ المفتاح ويحفظه، فتحتاج تطبيقات الموبايل والويب إلى تعديل أيضاً.",
              "عليك أن تقرّر ماذا يرى الـ retry بينما الاستدعاء الأول ما زال يعمل.",
              "أجسام الردود المخزَّنة قد تحوي بيانات شخصية، فتخضع لقواعد الاحتفاظ بالبيانات عندك."
            ]
          },
          limits: {
            en: [
              "It only protects one endpoint; a duplicate created through a different route is not caught.",
              "It cannot undo a side effect that already left your system, such as a sent email.",
              "Keys expire, so a retry after the TTL window will be treated as a new request.",
              "It does not stop a user tapping Pay twice with two different keys — that needs a UI guard."
            ],
            ar: [
              "يحمي endpoint واحداً فقط؛ التكرار الناتج عن مسار مختلف لا يُمسك.",
              "لا يستطيع التراجع عن أثر جانبي غادر نظامك فعلاً، مثل بريد أُرسل.",
              "المفاتيح تنتهي صلاحيتها، فإعادة المحاولة بعد مدة الـ TTL تُعامل كـ request جديد.",
              "لا يمنع مستخدماً يضغط Pay مرتين بمفتاحين مختلفين — هذا يحتاج حماية في الواجهة."
            ]
          },
          alts: {
            en: [
              "Natural keys: make (orderId, userId) unique so a second payment for the same order is impossible.",
              "Client-supplied resource id with PUT /payments/{id}, which is idempotent by HTTP definition.",
              "A two-step flow: POST to reserve an id, then PUT to complete the action against it.",
              "Detect and reconcile later — cheaper to build, but the customer sees the duplicate first."
            ],
            ar: [
              "مفاتيح طبيعية: اجعل (orderId, userId) فريداً فيصبح payment ثانٍ لنفس الطلب مستحيلاً.",
              "معرّف مورد يرسله الـ client عبر PUT /payments/{id}، وهي idempotent بتعريف HTTP.",
              "تدفّق من خطوتين: POST لحجز معرّف، ثم PUT لإتمام العملية عليه.",
              "الاكتشاف والتسوية لاحقاً — أرخص في البناء، لكن العميل يرى التكرار أولاً."
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
          title: { en: "The server generates the key", ar: "الـ server هو من ينشئ المفتاح" },
          body: {
            en: "A team added Guid.NewGuid() at the top of the handler and stored it as the idempotency key. Every retry produced a new Guid, so no two requests ever matched and the table just grew. They shipped it, saw zero duplicate-key errors in the logs, and concluded it worked. Two weeks later the duplicate charges were still happening at the same rate. The key must come from the caller and stay the same across retries of one user action.",
            ar: "فريق أضاف Guid.NewGuid() في بداية الـ handler وخزّنه كـ idempotency key. كل إعادة محاولة أنتجت Guid جديداً، فلم يتطابق request مع آخر أبداً وتضخّم الجدول فقط. أطلقوا التعديل، ولم يروا أي خطأ تكرار مفتاح في الـ logs، فاستنتجوا أنه يعمل. بعد أسبوعين كانت الخصومات المكررة ما زالت بنفس المعدل. المفتاح يجب أن يأتي من المستدعي ويبقى ثابتاً عبر إعادات محاولة نفس عملية المستخدم."
          },
          fix: "// client side, once per Pay button press\nvar key = _pendingKey ??= Guid.NewGuid().ToString();\nrequest.Headers.Add(\"Idempotency-Key\", key);   // reused by every retry"
        },
        {
          t: "mistake",
          title: { en: "Check-then-insert instead of insert-then-catch", ar: "فحص ثم إدراج بدل إدراج ثم التقاط" },
          body: {
            en: "The handler did 'if (!await _db.Keys.AnyAsync(...)) { do the work; save the key; }'. It passed every test, because tests send requests one at a time. In production a client retried after 200 ms while the first call was still waiting on the card network. Both AnyAsync calls returned false, both charged. There was no unique index on the key column, so the database happily stored both rows.",
            ar: "الـ handler كان يفعل: if (!await _db.Keys.AnyAsync(...)) { نفّذ العمل؛ احفظ المفتاح؛ }. نجح في كل الاختبارات، لأن الاختبارات ترسل request واحداً في كل مرة. في الإنتاج أعاد client المحاولة بعد 200 ms بينما الاستدعاء الأول ما زال ينتظر شبكة البطاقات. كلا استدعاءي AnyAsync أعادا false، وكلاهما خصم. لم يكن هناك unique index على عمود المفتاح، فخزّن الـ database الصفّين بلا اعتراض."
          },
          fix: "CREATE UNIQUE INDEX UX_idem_key_user\n  ON idempotency_keys(user_id, endpoint, [key]);\n-- then INSERT first and handle error 2601/2627 as \"this is a retry\""
        },
        {
          t: "mistake",
          title: { en: "Key row committed separately from the work", ar: "صف المفتاح يُحفظ منفصلاً عن العمل" },
          body: {
            en: "The code saved the key row, called SaveChangesAsync, then charged the card and called SaveChangesAsync again. A deployment restarted the pod between the two saves. The key row existed with status 'in_progress' but the charge had already gone through, and no code path ever moved it to 'completed'. Every retry got 409 forever, and the customer's money was taken with no order created. Write the effect and the completed key in one transaction.",
            ar: "الكود حفظ صف المفتاح، واستدعى SaveChangesAsync، ثم خصم من البطاقة واستدعى SaveChangesAsync مرة أخرى. عملية نشر أعادت تشغيل الـ pod بين الحفظين. بقي صف المفتاح بحالة in_progress بينما كان الخصم قد تم فعلاً، ولم يوجد أي مسار كود ينقله إلى completed. كل إعادة محاولة كانت تحصل على 409 إلى الأبد، وأُخذ مال العميل بلا إنشاء طلب. اكتب الأثر وصف المفتاح المكتمل في transaction واحد."
          }
        },
        {
          t: "mistake",
          title: { en: "Ignoring the request body on a repeat key", ar: "تجاهل جسم الـ request عند تكرار المفتاح" },
          body: {
            en: "A partner integration cached one key in a config file and sent it with every charge. The server saw the key, replayed the first stored response, and returned 201 with the original payment id — for 4,000 different charges. The partner's dashboard showed everything as successful; nothing after the first one had actually been charged. Storing a hash of the body and returning 422 on a mismatch would have surfaced the bug on request number two.",
            ar: "تكامل مع شريك خزّن مفتاحاً واحداً في ملف إعدادات وأرسله مع كل عملية خصم. الـ server رأى المفتاح، وأعاد الرد الأول المخزَّن، وأرجع 201 بمعرّف الـ payment الأصلي — لـ 4,000 عملية خصم مختلفة. لوحة الشريك أظهرت كل شيء ناجحاً؛ ولم يُخصم شيء بعد الأولى. تخزين hash للجسم وإرجاع 422 عند عدم التطابق كان سيكشف الخلل من الـ request الثاني."
          },
          fix: "if (existing.RequestHash != hash)\n    return Results.UnprocessableEntity(\n        \"Idempotency-Key was already used with a different request body.\");"
        }
      ]
    },
    {
      key: "interview",
      blocks: [
        {
          t: "qa",
          level: "junior",
          q: { en: "What does idempotent mean?", ar: "ماذا تعني كلمة idempotent؟" },
          a: {
            en: "It means running the operation more than once leaves the system in the same state as running it once. DELETE /orders/8842 is idempotent — the order is gone after the first call and still gone after the fourth. POST /payments is not, because each call creates another charge. The word says nothing about the response code; the second DELETE can return 404 and still be idempotent, because the state is the same.",
            ar: "تعني أن تنفيذ العملية أكثر من مرة يترك النظام في نفس الحالة التي يتركها تنفيذها مرة واحدة. DELETE /orders/8842 هي idempotent — الطلب محذوف بعد الاستدعاء الأول وما زال محذوفاً بعد الرابع. أما POST /payments فليست كذلك، لأن كل استدعاء ينشئ خصماً آخر. الكلمة لا تقول شيئاً عن status code؛ الـ DELETE الثاني قد يعيد 404 ويبقى idempotent، لأن الحالة نفسها."
          }
        },
        {
          t: "qa",
          level: "mid",
          q: { en: "Why can't the server just check whether the request already exists?", ar: "لماذا لا يكتفي الـ server بفحص هل الـ request موجود مسبقاً؟" },
          a: {
            en: "Because the check and the write are two separate steps, and two copies of the same request can be inside that gap at the same time. Both look, both find nothing, both insert. I'd flip it around: insert the key first with a unique constraint on it and let the database decide the winner. The loser gets a duplicate-key error, which is my reliable signal that this is a retry. The database is doing the locking for me instead of me trying to invent it in application code.",
            ar: "لأن الفحص والكتابة خطوتان منفصلتان، ويمكن أن تكون نسختان من نفس الـ request داخل تلك الفجوة في اللحظة نفسها. كلتاهما تنظر، ولا تجد شيئاً، وتُدرج. أنا أقلبها: أُدرج المفتاح أولاً مع unique constraint عليه وأترك الـ database يحدّد الفائز. الخاسر يحصل على خطأ تكرار مفتاح، وهذه إشارتي الموثوقة أن هذه إعادة محاولة. الـ database يقوم بالقفل بدلاً مني بدل أن أخترعه في كود التطبيق."
          }
        },
        {
          t: "qa",
          level: "mid",
          q: { en: "What should a retry get back while the first request is still running?", ar: "ماذا يجب أن تحصل عليه إعادة المحاولة بينما الـ request الأول ما زال يعمل؟" },
          a: {
            en: "409 Conflict with a Retry-After header, usually one or two seconds. I don't want to block the second request waiting for the first, because that ties up a connection and can pile up under load. I also don't want to return an error that looks permanent, because the client would give up on something that is about to succeed. 409 plus Retry-After says clearly: same work is in flight, ask again shortly.",
            ar: "409 Conflict مع header اسمه Retry-After، عادة ثانية أو ثانيتين. لا أريد أن أحجب الـ request الثاني في انتظار الأول، لأن ذلك يشغل اتصالاً وقد يتراكم تحت الحمل. ولا أريد أن أعيد خطأ يبدو نهائياً، لأن الـ client سيستسلم أمام شيء على وشك النجاح. الرد 409 مع Retry-After يقول بوضوح: نفس العمل قيد التنفيذ، اسأل مرة أخرى بعد قليل."
          }
        },
        {
          t: "qa",
          level: "senior",
          q: { en: "Is exactly-once delivery possible?", ar: "هل التوصيل exactly-once ممكن؟" },
          a: {
            en: "Not on a network, no. The sender can never distinguish 'the message was lost' from 'the reply was lost', so it must retry, so the message can arrive more than once. What you can build is effectively-once: at-least-once delivery plus a receiver that deduplicates. The key is what lets the receiver deduplicate. So when someone asks for exactly-once, what they actually need is a stable identifier on the message and a store of ids the receiver has already handled.",
            ar: "على الشبكة، لا. المرسل لا يستطيع أبداً أن يفرّق بين «ضاعت الرسالة» و«ضاع الرد»، فهو مضطر لإعادة المحاولة، فتصل الرسالة أكثر من مرة. ما يمكن بناؤه هو effectively-once: at-least-once delivery مع مستقبِل يزيل التكرار. والمفتاح هو ما يتيح للمستقبِل إزالة التكرار. فحين يطلب أحدهم exactly-once، ما يحتاجه فعلاً هو معرّف ثابت على الرسالة ومخزن للمعرّفات التي عالجها المستقبِل."
          }
        },
        {
          t: "qa",
          level: "senior",
          q: { en: "Where do you store the keys, and for how long?", ar: "أين تخزّن المفاتيح، ولأي مدة؟" },
          a: {
            en: "In the same database as the data I'm protecting, because I need the key row and the effect in one transaction. Redis is tempting because it is fast and has expiry built in, but a Redis write and a SQL commit cannot be made atomic, so a crash between them reopens the double-charge window. For retention I use 24 hours, which is far longer than any client keeps retrying, and I delete expired rows in a nightly job. If I need a permanent record of what a client sent, that belongs in an audit table, not in the dedup store.",
            ar: "في نفس الـ database الذي فيه البيانات التي أحميها، لأنني أحتاج صف المفتاح والأثر في transaction واحد. الـ Redis مغرٍ لأنه سريع وفيه انتهاء صلاحية جاهز، لكن كتابة في Redis و commit في SQL لا يمكن جعلهما atomic، فأي انهيار بينهما يعيد فتح نافذة الخصم المزدوج. أما مدة الاحتفاظ فأستخدم 24 ساعة، وهي أطول بكثير من أي مدة يستمر فيها client بإعادة المحاولة، وأحذف الصفوف المنتهية في مهمة ليلية. وإذا احتجت سجلاً دائماً لما أرسله الـ client فمكانه جدول audit لا الـ dedup store."
          }
        },
        {
          t: "qa",
          level: "staff",
          q: { en: "How do you get idempotency adopted across many teams instead of one endpoint at a time?", ar: "كيف تجعل الـ idempotency تُعتمد عبر فرق كثيرة بدل endpoint واحد كل مرة؟" },
          a: {
            en: "I'd stop treating it as a feature each team writes. First, put the behaviour in a shared middleware or filter in the internal service template, so a team turns it on with an attribute rather than writing the table and the race handling themselves. Second, define one house rule in the API guidelines: any POST that creates a resource or moves money must accept Idempotency-Key, and the API review checklist asks for it. Third, add a platform metric for duplicate business actions per endpoint, so a missing implementation shows up on a dashboard instead of in a customer complaint. Fourth, ship the matching client helper in the internal SDK, because a server that supports keys and a client that never sends one buys nothing.",
            ar: "سأتوقف عن معاملتها كميزة يكتبها كل فريق. أولاً، أضع السلوك في middleware أو filter مشترك داخل قالب الخدمة الداخلي، فيفعّله الفريق بـ attribute بدل أن يكتب الجدول ومعالجة التسابق بنفسه. ثانياً، أحدّد قاعدة واحدة في إرشادات الـ API: أي POST ينشئ مورداً أو يحرّك مالاً يجب أن يقبل Idempotency-Key، وقائمة مراجعة الـ API تسأل عنها. ثالثاً، أضيف مقياساً على مستوى المنصة لعدد عمليات الأعمال المكررة لكل endpoint، فيظهر التطبيق الناقص على لوحة قياس بدل أن يظهر في شكوى عميل. رابعاً، أطلق المساعد المقابل في الـ SDK الداخلي للـ client، لأن server يدعم المفاتيح مع client لا يرسل أياً منها لا يفيد بشيء."
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
          title: { en: "The key is stored, but the effect is not in the same transaction", ar: "المفتاح يُخزَّن، لكن الأثر ليس في نفس الـ transaction" },
          bad: "await _keys.MarkCompletedAsync(idemKey, ct);   // commit #1\nvar payment = await _cards.ChargeAsync(body.OrderId, body.Amount, ct);\n_db.Payments.Add(payment);\nawait _db.SaveChangesAsync(ct);                // commit #2",
          good: "await using var tx = await _db.Database.BeginTransactionAsync(ct);\nvar payment = await _cards.ChargeAsync(body.OrderId, body.Amount, idemKey, ct);\n_db.Payments.Add(payment);\nrecord.Status = \"completed\";\nrecord.ResponseCode = 201;\nrecord.ResponseBody = JsonSerializer.Serialize(new { paymentId = payment.Id });\nawait _db.SaveChangesAsync(ct);\nawait tx.CommitAsync(ct);",
          why: {
            en: "With two commits there is a window between them where the key says 'done' but no payment exists, or a payment exists with no completed key. A restart or a failed second commit lands you in that window. One transaction removes it: either both rows are visible or neither is. Passing idemKey to the card provider covers the one part that lives outside your database.",
            ar: "مع commitين توجد نافذة بينهما يقول فيها المفتاح «تم» بلا وجود payment، أو يوجد payment بلا مفتاح مكتمل. إعادة تشغيل أو فشل الـ commit الثاني يوقعك في تلك النافذة. الـ transaction الواحد يزيلها: إمّا أن يظهر الصفّان أو لا يظهر أي منهما. وتمرير idemKey إلى مزوّد البطاقات يغطي الجزء الوحيد الذي يعيش خارج الـ database عندك."
          }
        },
        {
          t: "review",
          severity: "medium",
          title: { en: "Key uniqueness is global instead of per user", ar: "تفرّد المفتاح عام بدل أن يكون لكل user" },
          bad: "CREATE UNIQUE INDEX UX_idem ON idempotency_keys([key]);\n// lookup:\nvar existing = await _db.IdempotencyRecords\n    .SingleOrDefaultAsync(r => r.Key == idemKey, ct);",
          good: "CREATE UNIQUE INDEX UX_idem ON idempotency_keys(user_id, endpoint, [key]);\n// lookup:\nvar existing = await _db.IdempotencyRecords\n    .SingleOrDefaultAsync(r => r.Key == idemKey\n                            && r.UserId == _user.Id\n                            && r.Endpoint == endpoint, ct);",
          why: {
            en: "A global unique key means one caller can claim a string that another caller then cannot use, and a caller that sends a guessable key such as 'order-1' will collide with every other tenant using the same pattern. Worse, without the user check the lookup could replay one customer's stored response body to a different customer. Scoping by user and endpoint keeps the guarantee local and removes the leak.",
            ar: "التفرّد العام يعني أن مستدعياً واحداً قد يحجز نصاً لا يستطيع مستدعٍ آخر استخدامه بعده، ومستدعٍ يرسل مفتاحاً يسهل تخمينه مثل order-1 سيتصادم مع كل مستأجر آخر يستخدم نفس النمط. والأسوأ أن البحث بلا فحص الـ user قد يعيد جسم رد عميل إلى عميل آخر. تحديد النطاق بالـ user والـ endpoint يبقي الضمان محلياً ويزيل التسريب."
          }
        }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        {
          t: "p",
          en: "In a real system the key travels further than one endpoint. A checkout flow might be: mobile app to the API gateway, gateway to the orders service, orders service publishes a message, and a payments worker consumes it. Every hop can retry, so the same key should be carried through all of them — as a header on the HTTP calls and as a message property on the queue message. Then each service can deduplicate using the same identity for the same business action.",
          ar: "في نظام حقيقي يسافر المفتاح أبعد من endpoint واحد. تدفّق الشراء قد يكون: تطبيق موبايل إلى API gateway، ثم gateway إلى خدمة الطلبات، وخدمة الطلبات تنشر رسالة، ثم يستهلكها worker المدفوعات. كل قفزة قابلة لإعادة المحاولة، فيجب حمل نفس المفتاح خلالها كلها — كـ header على استدعاءات HTTP وكخاصية على رسالة الطابور. عندها تستطيع كل خدمة إزالة التكرار بنفس الهوية لنفس عملية الأعمال."
        },
        {
          t: "ul",
          en: [
            "Message consumers: queues deliver at-least-once, so a consumer must skip a message id it has already processed. Same table, different producer.",
            "Webhooks you receive: providers resend a webhook until you return 200, so store the provider's event id and ignore repeats.",
            "Background jobs: a job runner that crashes mid-run will re-run the job, so the job body needs a key just as much as an endpoint does.",
            "Public APIs: document the header name, the scope, the TTL, and what 409 and 422 mean, because clients have to build retry logic against your rules."
          ],
          ar: [
            "مستهلكو الرسائل: الطوابير تسلّم at-least-once، فعلى المستهلك أن يتجاهل معرّف رسالة عالجه مسبقاً. نفس الجدول، ومنتج مختلف.",
            "الـ webhooks التي تستقبلها: المزوّدون يعيدون إرسال الـ webhook حتى تعيد 200، فخزّن معرّف الحدث عندهم وتجاهل التكرار.",
            "المهام الخلفية: مشغّل مهام ينهار في منتصف التنفيذ سيعيد تشغيل المهمة، فجسم المهمة يحتاج مفتاحاً تماماً كما يحتاجه endpoint.",
            "الـ APIs العامة: وثّق اسم الـ header والنطاق ومدة الـ TTL ومعنى 409 و 422، لأن العملاء سيبنون منطق إعادة المحاولة على قواعدك."
          ]
        },
        {
          t: "callout",
          kind: "tip",
          en: "If the resource has a natural unique identity — one payment per order, one signup per email — put a unique constraint on that instead. It is simpler, needs no extra table, and protects you even against duplicates that arrive through a completely different code path.",
          ar: "إذا كان للمورد هوية فريدة طبيعية — payment واحد لكل order، أو تسجيل واحد لكل بريد — فضع unique constraint عليها بدلاً من ذلك. إنها أبسط، ولا تحتاج جدولاً إضافياً، وتحميك حتى من تكرار يصل عبر مسار كود مختلف تماماً."
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
              k: { en: "Latency", ar: "زمن الاستجابة" },
              v: {
                en: "One extra insert plus one index lookup on the retry path: about 1-2 ms. Against a 300 ms card call that is noise. Do not store the response body if it is megabytes — store a pointer to it instead.",
                ar: "إدراج إضافي واحد مع بحث واحد في الـ index على مسار إعادة المحاولة: حوالي 1-2 ms. أمام استدعاء بطاقة يستغرق 300 ms هذا ضجيج. ولا تخزّن جسم الرد إذا كان بحجم megabytes — خزّن مؤشراً إليه بدلاً منه."
              }
            },
            {
              k: { en: "Database", ar: "قاعدة البيانات" },
              v: {
                en: "The table grows by one row per protected request. At 40,000 charges a day with a 24-hour TTL it stays around 40,000 rows — small. Without cleanup it becomes 15 million rows a year and the index stops fitting in memory.",
                ar: "الجدول ينمو بصف واحد لكل request محمي. عند 40,000 عملية يومياً مع TTL مدته 24 ساعة يبقى حوالي 40,000 صف — حجم صغير. وبلا تنظيف يصبح 15 مليون صف سنوياً ويتوقف الـ index عن الاستيعاب في الذاكرة."
              }
            },
            {
              k: { en: "Memory", ar: "الذاكرة" },
              v: {
                en: "Response bodies dominate the row size. A 2 KB JSON body times 40,000 rows is about 80 MB of table data — fine. Storing full HTML or file contents here is not.",
                ar: "أجسام الردود هي ما يحدّد حجم الصف. جسم JSON بحجم 2 KB مضروباً في 40,000 صف يعطي حوالي 80 MB من بيانات الجدول — مقبول. أما تخزين HTML كامل أو محتوى ملفات هنا فغير مقبول."
              }
            },
            {
              k: { en: "Scalability", ar: "قابلية التوسّع" },
              v: {
                en: "The unique index is the serialisation point: two requests with the same key are ordered by the database, everything else runs in parallel. Because keys are random, the writes spread across the index rather than piling on one page.",
                ar: "الـ unique index هو نقطة التسلسل: requestان بنفس المفتاح يرتّبهما الـ database، وكل ما عداهما يعمل بالتوازي. ولأن المفاتيح عشوائية، تتوزّع الكتابات على الـ index بدل أن تتكدّس على صفحة واحدة."
              }
            },
            {
              k: { en: "Network", ar: "الشبكة" },
              v: {
                en: "Replaying a stored response costs one round trip and saves the whole downstream call. A retry that would have taken 300 ms and charged a card returns in about 5 ms and charges nothing.",
                ar: "إعادة إرسال رد مخزَّن تكلّف رحلة ذهاب وإياب واحدة وتوفّر الاستدعاء الخارجي بالكامل. إعادة محاولة كانت ستستغرق 300 ms وتخصم من بطاقة تعود في حوالي 5 ms ولا تخصم شيئاً."
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
            "SELECT [key], COUNT(*) FROM payments GROUP BY idempotency_key HAVING COUNT(*) > 1 — any row returned is a duplicate that got through, and tells you the protection is not working.",
            "Log the key, the outcome (created / replayed / conflict / hash-mismatch) and the user id on every request; then count outcomes per hour to see how often retries actually happen.",
            "SELECT COUNT(*) FROM idempotency_keys WHERE status = 'in_progress' AND created_at < DATEADD(minute,-5,GETUTCDATE()) — rows stuck here mean a process died mid-work and clients are getting 409 forever.",
            "In SQL Server, watch for error numbers 2601 and 2627 in your logs — those are the duplicate-key errors. Seeing them is normal and healthy; seeing zero of them means no client is retrying, which usually means no client is sending the header.",
            "Reproduce it on purpose: fire the same request twice in parallel with `curl ... & curl ... & wait` and confirm you get exactly one 201 and one 409 or replayed 201."
          ],
          ar: [
            "SELECT [key], COUNT(*) FROM payments GROUP BY idempotency_key HAVING COUNT(*) > 1 — أي صف يعود هو تكرار نفذ فعلاً، ويخبرك أن الحماية لا تعمل.",
            "سجّل المفتاح والنتيجة (created / replayed / conflict / hash-mismatch) ومعرّف الـ user في كل request؛ ثم اعدّ النتائج لكل ساعة لترى كم مرة تحدث إعادة المحاولة فعلاً.",
            "SELECT COUNT(*) FROM idempotency_keys WHERE status = 'in_progress' AND created_at < DATEADD(minute,-5,GETUTCDATE()) — الصفوف العالقة هنا تعني أن process مات في منتصف العمل والعملاء يحصلون على 409 بلا نهاية.",
            "في SQL Server راقب رقمي الخطأ 2601 و 2627 في الـ logs — هذان خطآ تكرار المفتاح. ظهورهما طبيعي وصحي؛ وعدم ظهورهما إطلاقاً يعني أن لا client يعيد المحاولة، وغالباً يعني أن لا client يرسل الـ header.",
            "أعد إنتاج المشكلة عمداً: أطلق نفس الـ request مرتين بالتوازي بـ `curl ... & curl ... & wait` وتأكد أنك تحصل على 201 واحد فقط مع 409 أو 201 مُعاد."
          ]
        },
        {
          t: "callout",
          kind: "tip",
          en: "Put the outcome of the idempotency check into a metric with a label for created / replayed / conflict / mismatch. A sudden rise in 'replayed' usually means a downstream dependency got slow and clients started timing out — the metric warns you about the slowdown before the latency alert does.",
          ar: "ضع نتيجة فحص الـ idempotency في مقياس مع تسمية لكل من created / replayed / conflict / mismatch. الارتفاع المفاجئ في replayed يعني غالباً أن اعتمادية خارجية أصبحت بطيئة وبدأت مهل العملاء تنتهي — فينبّهك المقياس إلى التباطؤ قبل تنبيه زمن الاستجابة."
        }
      ]
    },
    {
      key: "realworld",
      blocks: [
        {
          t: "p",
          en: "Anywhere a request costs real money or creates something a human will notice, the industry standard is a client-supplied key on the header. Payment providers document it as Idempotency-Key and keep it for 24 hours; ride-hailing and food-delivery apps use it so a tap on an unreliable mobile connection never books two rides. The pattern shows up under different names — dedup id, message id, request id — but the mechanism is the same: a stable identifier plus a store of what has already been handled.",
          ar: "في أي مكان يكلّف فيه الـ request مالاً حقيقياً أو ينشئ شيئاً سيلاحظه إنسان، المعيار في الصناعة هو مفتاح يرسله الـ client في الـ header. مزوّدو الدفع يوثّقونه باسم Idempotency-Key ويحتفظون به 24 ساعة؛ وتطبيقات نقل الركاب وتوصيل الطعام تستخدمه حتى لا تحجز ضغطة واحدة على اتصال ضعيف رحلتين. النمط يظهر بأسماء مختلفة — dedup id أو message id أو request id — لكن الآلية واحدة: معرّف ثابت مع مخزن لما تمت معالجته."
        },
        {
          t: "ul",
          en: [
            "Payment platforms: one key per checkout attempt, so a customer on a weak connection is charged once no matter how many times the app retries.",
            "Ticketing and booking systems: the key stops the same seat being reserved twice when the confirmation page fails to load.",
            "Messaging and notification services: a dedup id prevents the same alert being sent five times when the sending worker restarts.",
            "Banking and transfer rails: transfers carry an end-to-end reference, and the receiving bank rejects a repeat of the same reference outright."
          ],
          ar: [
            "منصات الدفع: مفتاح واحد لكل محاولة شراء، فيُخصم من العميل ذي الاتصال الضعيف مرة واحدة مهما أعاد التطبيق المحاولة.",
            "أنظمة التذاكر والحجز: المفتاح يمنع حجز نفس المقعد مرتين عندما تفشل صفحة التأكيد في التحميل.",
            "خدمات الرسائل والإشعارات: معرّف إزالة التكرار يمنع إرسال نفس التنبيه خمس مرات عند إعادة تشغيل الـ worker المرسِل.",
            "أنظمة التحويلات البنكية: التحويلات تحمل مرجعاً من طرف إلى طرف، والبنك المستقبِل يرفض تكرار نفس المرجع مباشرة."
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
          en: "Add an idempotency_keys table with a unique index on (user_id, endpoint, key), and make POST /payments reject a request that arrives without an Idempotency-Key header with 400. You are done when a request with no header gets 400 and a request with one gets 201.",
          ar: "أضف جدول idempotency_keys مع unique index على (user_id, endpoint, key)، واجعل POST /payments يرفض بـ 400 أي request يصل بلا header اسمه Idempotency-Key. تنتهي عندما يحصل request بلا header على 400 و request معه على 201."
        },
        {
          t: "ex",
          diff: "medium",
          en: "Implement insert-first with duplicate-key handling: the second call with the same key must return the stored response body and the same payment id, and must not call the card service again. Prove it with a test that asserts the fake card service was called exactly once.",
          ar: "نفّذ أسلوب الإدراج أولاً مع معالجة خطأ تكرار المفتاح: الاستدعاء الثاني بنفس المفتاح يجب أن يعيد جسم الرد المخزَّن ونفس معرّف الـ payment، وألا يستدعي خدمة البطاقات مرة أخرى. أثبت ذلك باختبار يتحقق أن خدمة البطاقات الوهمية استُدعيت مرة واحدة بالضبط."
        },
        {
          t: "ex",
          diff: "hard",
          en: "Fire 50 concurrent requests with the same key using Parallel.ForEachAsync against a real database. Exactly one must return 201 and the rest must return 409 or a replayed 201; the payments table must hold exactly one row. Then add the request-hash check and confirm a different body with the same key gets 422.",
          ar: "أطلق 50 request متزامناً بنفس المفتاح باستخدام Parallel.ForEachAsync على database حقيقي. يجب أن يعيد واحد فقط 201 وأن يعيد الباقي 409 أو 201 مُعاداً؛ وجدول payments يجب أن يحوي صفاً واحداً بالضبط. ثم أضف فحص hash الجسم وتأكد أن جسماً مختلفاً بنفس المفتاح يحصل على 422."
        },
        {
          t: "ex",
          diff: "senior",
          en: "Turn the whole thing into reusable middleware driven by an [Idempotent(ttlHours: 24)] attribute, so a handler needs no idempotency code of its own. It must buffer and replay the response, handle the in-progress case, and expose a metric labelled created / replayed / conflict / mismatch. You are done when you can protect a second, unrelated endpoint by adding one attribute and nothing else.",
          ar: "حوّل الأمر كله إلى middleware قابل لإعادة الاستخدام يقوده attribute بصيغة [Idempotent(ttlHours: 24)]، بحيث لا يحتاج الـ handler إلى أي كود idempotency خاص به. يجب أن يخزّن الرد ويعيد إرساله، ويعالج حالة العمل الجاري، ويُخرج مقياساً بتسميات created / replayed / conflict / mismatch. تنتهي عندما تستطيع حماية endpoint ثانٍ غير مرتبط بإضافة attribute واحد فقط لا غير."
        }
      ]
    },
    {
      key: "refs",
      blocks: [
        {
          t: "ref",
          label: { en: "Stripe API — idempotent requests", ar: "Stripe API — الـ requests الـ idempotent" },
          url: "https://docs.stripe.com/api/idempotent_requests",
          meta: { en: "Docs", ar: "توثيق" }
        },
        {
          t: "ref",
          label: { en: "RFC 9110 — HTTP semantics, idempotent methods", ar: "RFC 9110 — دلالات HTTP والـ methods الـ idempotent" },
          url: "https://www.rfc-editor.org/rfc/rfc9110.html#name-idempotent-methods",
          meta: { en: "Spec", ar: "مواصفة" }
        },
        {
          t: "ref",
          label: { en: "AWS Builders' Library — timeouts, retries and backoff with jitter", ar: "AWS Builders' Library — المهل وإعادة المحاولة والتراجع مع jitter" },
          url: "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/",
          meta: { en: "Article", ar: "مقال" }
        },
        {
          t: "ref",
          label: { en: "Microsoft — duplicate detection in Azure Service Bus", ar: "Microsoft — اكتشاف التكرار في Azure Service Bus" },
          url: "https://learn.microsoft.com/en-us/azure/service-bus-messaging/duplicate-detection",
          meta: { en: "Docs", ar: "توثيق" }
        }
      ]
    }
  ],
  quiz: [
    {
      q: {
        en: "Who should generate the idempotency key?",
        ar: "من الذي يجب أن ينشئ الـ idempotency key؟"
      },
      options: [
        { en: "The server, at the start of the handler", ar: "الـ server، في بداية الـ handler" },
        { en: "The client, once per business action, reused on every retry", ar: "الـ client، مرة واحدة لكل عملية أعمال، ويُعاد استخدامه في كل إعادة محاولة" },
        { en: "The load balancer, from the connection id", ar: "الـ load balancer، من معرّف الاتصال" },
        { en: "The database, as an auto-increment column", ar: "الـ database، كعمود ترقيم تلقائي" }
      ],
      correct: 1,
      why: {
        en: "Only the client knows that a retry is the same user action as the earlier attempt. A server-generated key is different on every call, so nothing ever matches.",
        ar: "الـ client وحده يعرف أن إعادة المحاولة هي نفس عملية المستخدم السابقة. المفتاح الذي ينشئه الـ server يختلف في كل استدعاء، فلا يتطابق شيء أبداً."
      }
    },
    {
      q: {
        en: "Why is 'check if the key exists, then insert' unsafe?",
        ar: "لماذا يُعدّ أسلوب «افحص وجود المفتاح ثم أدرج» غير آمن؟"
      },
      options: [
        { en: "It is too slow for high traffic", ar: "إنه بطيء جداً للحمل العالي" },
        { en: "It cannot store the response body", ar: "لا يستطيع تخزين جسم الرد" },
        { en: "Two concurrent copies can both see nothing and both insert", ar: "نسختان متزامنتان قد تريان لا شيء وتُدرجان معاً" },
        { en: "It requires a distributed lock service", ar: "يحتاج خدمة قفل موزّعة" }
      ],
      correct: 2,
      why: {
        en: "The check and the insert are separate steps. Two requests can both run the check before either runs the insert, so both proceed. Inserting first and catching the duplicate-key error removes the gap.",
        ar: "الفحص والإدراج خطوتان منفصلتان. قد ينفّذ requestان الفحص قبل أن ينفّذ أي منهما الإدراج، فيمضي كلاهما. الإدراج أولاً والتقاط خطأ تكرار المفتاح يزيل الفجوة."
      }
    },
    {
      q: {
        en: "A retry arrives while the first request is still charging the card. What is the best response?",
        ar: "تصل إعادة محاولة بينما الـ request الأول ما زال يخصم من البطاقة. ما أفضل رد؟"
      },
      options: [
        { en: "500, so the client stops", ar: "500، ليتوقف الـ client" },
        { en: "201 with an empty body", ar: "201 بجسم فارغ" },
        { en: "Block the request until the first one finishes", ar: "احجب الـ request حتى ينتهي الأول" },
        { en: "409 Conflict with a Retry-After header", ar: "409 Conflict مع header اسمه Retry-After" }
      ],
      correct: 3,
      why: {
        en: "409 with Retry-After tells the client the same work is in flight and to ask again shortly. Blocking ties up a connection under load, and 201 with an empty body lies about a result that does not exist yet.",
        ar: "الرد 409 مع Retry-After يخبر الـ client أن نفس العمل قيد التنفيذ وأن يسأل بعد قليل. والحجب يشغل اتصالاً تحت الحمل، و 201 بجسم فارغ يكذب بشأن نتيجة لم توجد بعد."
      }
    },
    {
      q: {
        en: "Why store a hash of the request body next to the key?",
        ar: "لماذا نخزّن hash لجسم الـ request بجانب المفتاح؟"
      },
      options: [
        { en: "To compress the stored response", ar: "لضغط الرد المخزَّن" },
        { en: "To catch a client that reused one key for different requests", ar: "لكشف client أعاد استخدام مفتاح واحد لـ requests مختلفة" },
        { en: "To make the unique index smaller", ar: "لتصغير حجم الـ unique index" },
        { en: "To let the key expire faster", ar: "لجعل المفتاح ينتهي أسرع" }
      ],
      correct: 1,
      why: {
        en: "Without the hash, a client that sends one fixed key for every charge gets the first stored response replayed forever and believes all its later charges succeeded. Comparing hashes lets the server return 422 and expose the bug immediately.",
        ar: "بدون الـ hash، الـ client الذي يرسل مفتاحاً ثابتاً لكل عملية خصم يحصل على الرد الأول المخزَّن إلى الأبد ويظن أن كل عملياته اللاحقة نجحت. مقارنة الـ hash تتيح للـ server إرجاع 422 وكشف الخلل فوراً."
      }
    },
    {
      q: {
        en: "What does 'exactly-once' realistically mean in a distributed system?",
        ar: "ماذا تعني exactly-once واقعياً في نظام موزّع؟"
      },
      options: [
        { en: "The network guarantees a message is delivered once", ar: "الشبكة تضمن تسليم الرسالة مرة واحدة" },
        { en: "At-least-once delivery plus deduplication at the receiver", ar: "at-least-once delivery مع إزالة التكرار عند المستقبِل" },
        { en: "At-most-once delivery with no retries", ar: "at-most-once delivery بلا إعادة محاولة" },
        { en: "A two-phase commit across every service", ar: "two-phase commit عبر كل الخدمات" }
      ],
      correct: 1,
      why: {
        en: "The sender cannot tell a lost message from a lost reply, so it must retry and the message can arrive more than once. Deduplicating at the receiver makes the effect happen once — effectively-once, which is what people mean by exactly-once.",
        ar: "المرسل لا يستطيع التفريق بين رسالة ضاعت ورد ضاع، فهو مضطر لإعادة المحاولة وقد تصل الرسالة أكثر من مرة. إزالة التكرار عند المستقبِل تجعل الأثر يحدث مرة واحدة — effectively-once، وهو ما يقصده الناس بـ exactly-once."
      }
    }
  ]
};
```

NEXT: timeouts
