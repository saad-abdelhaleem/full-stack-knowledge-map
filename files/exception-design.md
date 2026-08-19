```js
const exceptionDesignLesson = {
  id: "exception-design",
  moduleId: "runtime",
  title: { en: "Designing failure boundaries", ar: "تصميم حدود الفشل" },
  summary: {
    en: "Decide in advance which layer catches which failure, so every error either gets handled by code that can actually fix it or turns into one clean HTTP response.",
    ar: "قرّر مسبقاً أي طبقة تلتقط أي فشل، بحيث كل خطأ إمّا يعالجه كود يقدر فعلاً على إصلاحه أو يتحوّل إلى HTTP response واحد نظيف."
  },
  mins: 15,
  sections: [
    {
      key: "why",
      blocks: [
        {
          t: "p",
          en: "A failure boundary is a place in your code where you decide to stop an exception from travelling further up. Designing failure boundaries means picking those places on purpose instead of scattering try/catch wherever a bug once appeared.",
          ar: "حد الفشل (failure boundary) هو مكان في الكود تقرّر فيه إيقاف الـ exception عن الصعود لأعلى. تصميم حدود الفشل يعني اختيار هذه الأماكن عن قصد، بدل نثر try/catch في كل مكان ظهر فيه bug يوماً ما."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "Exception", ar: "Exception" },
              v: {
                en: "An object describing a failure. Throwing it stops the current method immediately and hands control to the nearest matching catch.",
                ar: "كائن يصف فشلاً. رميه يوقف الـ method الحالية فوراً ويسلّم التحكم لأقرب catch مطابق."
              }
            },
            {
              k: { en: "Bubble up", ar: "Bubble up" },
              v: {
                en: "What an exception does when nobody catches it: it keeps rising through the callers until something does.",
                ar: "ما يفعله الـ exception عندما لا يلتقطه أحد: يستمر بالصعود عبر الـ callers حتى يلتقطه شيء ما."
              }
            },
            {
              k: { en: "Middleware", ar: "Middleware" },
              v: {
                en: "In ASP.NET Core, a small component wrapped around every request. Code before `await next()` runs on the way in, code after runs on the way out.",
                ar: "في ASP.NET Core، مكوّن صغير يلتف حول كل request. الكود قبل ‎await next()‎ يعمل عند الدخول، والكود بعده يعمل عند الخروج."
              }
            },
            {
              k: { en: "Domain exception", ar: "Domain exception" },
              v: {
                en: "An exception you define yourself for a business rule that was broken, such as `InsufficientFundsException`.",
                ar: "exception تعرّفه أنت لقاعدة عمل تم كسرها، مثل ‎InsufficientFundsException‎."
              }
            },
            {
              k: { en: "ProblemDetails", ar: "ProblemDetails" },
              v: {
                en: "A standard JSON error shape (from RFC 7807, a spec for HTTP error bodies) with fields like `type`, `title`, `status`, `detail`.",
                ar: "شكل JSON قياسي للأخطاء (من RFC 7807، وهي مواصفة لأجسام أخطاء HTTP) بحقول مثل type و title و status و detail."
              }
            },
            {
              k: { en: "Swallowing", ar: "Swallowing" },
              v: {
                en: "Catching an exception and doing nothing useful with it, so the failure disappears without a trace.",
                ar: "التقاط exception دون فعل شيء مفيد به، فيختفي الفشل دون أي أثر."
              }
            }
          ]
        },
        {
          t: "p",
          en: "Think of a building's fire doors. You do not put a fire door in every room — you put them at a few chosen places where they contain the damage without blocking normal movement. A try/catch in every method is the opposite: hundreds of half-closed doors, none of which actually stop anything, and smoke leaking everywhere.",
          ar: "فكّر بأبواب الحريق في مبنى. لا تضع باب حريق في كل غرفة، بل في أماكن قليلة مختارة تحتوي الضرر دون إعاقة الحركة العادية. وضع try/catch في كل method هو العكس: مئات الأبواب نصف المغلقة، لا يوقف أي منها شيئاً فعلياً، والدخان يتسرّب في كل مكان."
        },
        {
          t: "p",
          en: "Our running example for this lesson is one endpoint: `POST /orders`, which reserves stock in the database, then charges a payment provider over HTTP, then saves the order. It can fail in three different ways — the caller sent a bad quantity, the payment provider timed out, or the database connection died — and each of those deserves a different answer. The whole lesson is about deciding who answers each one.",
          ar: "المثال الجاري في هذا الدرس هو endpoint واحد: ‎POST /orders‎، يحجز المخزون في الـ database، ثم يخصم المبلغ من payment provider عبر HTTP، ثم يحفظ الطلب. يمكن أن يفشل بثلاث طرق مختلفة: العميل أرسل كمية غير صالحة، أو انتهت مهلة الـ payment provider، أو انقطع اتصال الـ database. وكل حالة تستحق جواباً مختلفاً. الدرس كله عن تحديد من يجيب على كل واحدة."
        },
        {
          t: "callout",
          kind: "tip",
          en: "The single rule that decides everything: catch an exception only if this exact spot can do something useful about it. Anything else belongs one boundary higher.",
          ar: "القاعدة الوحيدة التي تحسم كل شيء: لا تلتقط exception إلا إذا كان هذا المكان بالتحديد يستطيع فعل شيء مفيد حياله. غير ذلك ينتمي إلى حد أعلى."
        }
      ]
    },
    {
      key: "problem",
      blocks: [
        {
          t: "p",
          en: "Without a designed boundary, error handling grows by accident. Someone gets a null reference in production, wraps that one method in try/catch, logs the message and returns null. Six months later `POST /orders` has eleven try/catch blocks written by seven people, and a failed payment returns HTTP 200 with an empty body.",
          ar: "بدون حد مصمّم، تنمو معالجة الأخطاء بالصدفة. أحدهم يحصل على null reference في الإنتاج، فيلفّ تلك الـ method بـ try/catch، يسجّل الرسالة ويرجّع null. بعد ستة أشهر يصبح في ‎POST /orders‎ إحدى عشرة كتلة try/catch كتبها سبعة أشخاص، ويرجع الدفع الفاشل HTTP 200 بجسم فارغ."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "Before — scattered catches", ar: "قبل — التقاطات متناثرة" },
              v: {
                en: "Payment provider times out. Repository catches it, logs \"payment issue\", returns null. Controller sees null, returns 200 with `{}`. The client shows \"order placed\". Support finds it three days later from customer complaints.",
                ar: "تنتهي مهلة الـ payment provider. الـ repository يلتقطها، يسجّل \"payment issue\"، ويرجّع null. الـ controller يرى null فيرجّع 200 مع ‎{}‎. العميل يعرض \"تم الطلب\". الدعم يكتشفها بعد ثلاثة أيام من شكاوى الزبائن."
              }
            },
            {
              k: { en: "After — one boundary", ar: "بعد — حد واحد" },
              v: {
                en: "Nothing catches it in the middle. One middleware at the top maps the timeout to HTTP 504 with a ProblemDetails body and logs the full stack trace with the request id. The client retries. The alert fires within a minute.",
                ar: "لا شيء يلتقطها في المنتصف. middleware واحد في الأعلى يحوّل الـ timeout إلى HTTP 504 مع جسم ProblemDetails ويسجّل الـ stack trace كاملاً مع الـ request id. العميل يعيد المحاولة، وينطلق التنبيه خلال دقيقة."
              }
            },
            {
              k: { en: "The measurable difference", ar: "الفرق القابل للقياس" },
              v: {
                en: "One team measured error-to-alert time before and after: 71 hours down to under 2 minutes. Not because logging got better, but because the failure stopped being hidden behind a 200.",
                ar: "قاس أحد الفرق الزمن من الخطأ إلى التنبيه قبل وبعد: من 71 ساعة إلى أقل من دقيقتين. ليس لأن الـ logging تحسّن، بل لأن الفشل توقّف عن الاختباء خلف 200."
              }
            }
          ]
        },
        {
          t: "p",
          en: "The cost of the scattered version is not extra code. It is that a failure at 09:00 becomes visible at 09:00 in one design and at some unknown later moment in the other. Everything else in this lesson follows from wanting failures to be loud and shaped consistently.",
          ar: "تكلفة النسخة المتناثرة ليست كوداً إضافياً. بل أن الفشل الحاصل في الساعة 09:00 يصبح مرئياً في 09:00 في تصميم واحد، وفي لحظة لاحقة مجهولة في الآخر. كل ما تبقّى في هذا الدرس ينبع من الرغبة في أن يكون الفشل صاخباً وبشكل موحّد."
        }
      ]
    },
    {
      key: "internals",
      blocks: [
        {
          t: "p",
          en: "Follow one request through the pipeline. An HTTP request arrives at Kestrel (the web server built into ASP.NET Core). Kestrel hands it to the middleware pipeline, which is a chain of components each calling the next one. The last link is your endpoint. Everything that happens inside your endpoint is running inside every middleware's `await next()` call.",
          ar: "تابع request واحداً عبر الـ pipeline. يصل الـ HTTP request إلى Kestrel (الـ web server المدمج في ASP.NET Core). يسلّمه Kestrel إلى الـ middleware pipeline، وهي سلسلة مكوّنات كل واحد ينادي التالي. آخر حلقة هي الـ endpoint عندك. كل ما يحدث داخل الـ endpoint يعمل داخل نداء ‎await next()‎ لكل middleware."
        },
        {
          t: "p",
          en: "That nesting is the mechanism. When your service throws, the exception unwinds the stack: each method exits without returning a value, in reverse order of the calls. It passes through every `await next()` on the way up. A try/catch around the first `await next()` therefore sees every exception from every endpoint. That is what makes a single top-level boundary possible at all.",
          ar: "هذا التداخل هو الآلية. عندما يرمي الـ service، يقوم الـ exception بفكّ الـ stack: كل method تخرج دون إرجاع قيمة، بترتيب عكسي للنداءات. ويمرّ عبر كل ‎await next()‎ أثناء الصعود. لذلك فإن try/catch حول أول ‎await next()‎ يرى كل exception من كل endpoint. وهذا ما يجعل وجود حد واحد في القمة ممكناً أصلاً."
        },
        {
          t: "p",
          en: "The analogy: a mail sorting office. Local post boxes (your methods) do not decide what to do with an undeliverable letter — they just pass it up. One sorting office at the top reads the reason it failed and stamps the right response on it. If every post box tried to make that decision, you would get eleven different stamps for the same problem.",
          ar: "التشبيه: مكتب فرز بريد. صناديق البريد المحلية (methods عندك) لا تقرّر ماذا تفعل برسالة غير قابلة للتسليم، بل تمرّرها للأعلى. مكتب فرز واحد في القمة يقرأ سبب الفشل ويختم الرد المناسب عليها. لو حاول كل صندوق اتخاذ ذلك القرار، لحصلت على أحد عشر ختماً مختلفاً لنفس المشكلة."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "Throw site", ar: "موقع الرمي" },
              v: {
                en: "Where the failure is detected. It knows the facts (which order, which amount) but not what the caller wants to do.",
                ar: "حيث يُكتشف الفشل. يعرف الوقائع (أي طلب، أي مبلغ) لكنه لا يعرف ماذا يريد الـ caller أن يفعل."
              }
            },
            {
              k: { en: "Retry boundary", ar: "حد إعادة المحاولة" },
              v: {
                en: "Wraps one outbound call. Catches only transient network failures and retries them. Everything else passes through untouched.",
                ar: "يلتف حول نداء خارجي واحد. يلتقط فقط أعطال الشبكة العابرة ويعيد المحاولة. وكل ما عداها يمرّ دون مساس."
              }
            },
            {
              k: { en: "Unit-of-work boundary", ar: "حد وحدة العمل" },
              v: {
                en: "Wraps one business operation. Rolls back the transaction on any failure, then rethrows. It cleans up; it does not decide the response.",
                ar: "يلتف حول عملية عمل واحدة. يتراجع عن الـ transaction عند أي فشل ثم يعيد الرمي. مهمته التنظيف لا تحديد الرد."
              }
            },
            {
              k: { en: "Top boundary (middleware)", ar: "الحد الأعلى (middleware)" },
              v: {
                en: "The only place that turns an exception into an HTTP status code and a response body, and the only place that logs it.",
                ar: "المكان الوحيد الذي يحوّل الـ exception إلى HTTP status code وجسم رد، والمكان الوحيد الذي يسجّله."
              }
            }
          ]
        },
        {
          t: "code",
          lang: "csharp",
          label: {
            en: "The three failures of POST /orders, each thrown where it is detected",
            ar: "أعطال ‎POST /orders‎ الثلاثة، كل منها يُرمى حيث يُكتشف"
          },
          code: "// A base type for \"the caller broke a business rule\".\n// Everything derived from it becomes a 4xx at the boundary.\npublic abstract class DomainException(string message) : Exception(message);\n\npublic sealed class InvalidQuantityException(int qty)\n    : DomainException($\"Quantity must be 1..100, got {qty}.\")\n{\n    public int Quantity { get; } = qty;   // data the boundary can put in the response\n}\n\npublic sealed class OutOfStockException(Guid sku, int available)\n    : DomainException($\"SKU {sku} has only {available} left.\");\n\npublic async Task<Order> PlaceOrderAsync(OrderRequest req, CancellationToken ct)\n{\n    // 1. Caller's fault -> throw. No catch here: this method cannot fix bad input.\n    if (req.Quantity is < 1 or > 100)\n        throw new InvalidQuantityException(req.Quantity);\n\n    var reserved = await _stock.ReserveAsync(req.Sku, req.Quantity, ct);\n    if (!reserved.Ok)\n        throw new OutOfStockException(req.Sku, reserved.Available);\n\n    // 2. Someone else's fault, and possibly temporary -> the only catch in this method.\n    //    We catch it because we can genuinely do something: undo the reservation.\n    try\n    {\n        await _payments.ChargeAsync(req.CardToken, reserved.Total, ct);\n    }\n    catch (Exception ex) when (ex is HttpRequestException or TaskCanceledException)\n    {\n        await _stock.ReleaseAsync(reserved.Id, CancellationToken.None);\n        throw;   // 'throw;' keeps the original stack trace. 'throw ex;' would erase it.\n    }\n\n    // 3. Infrastructure failure (DbUpdateException etc.) -> not caught at all.\n    //    Nothing here can fix a dead connection, so it bubbles to the boundary.\n    return await _orders.SaveAsync(reserved, ct);\n}"
        },
        {
          t: "p",
          en: "Now the boundary itself. `IExceptionHandler` is an ASP.NET Core 8 interface with one method; the framework calls it when an unhandled exception reaches the top. It returns `true` if it produced the response and `false` to let the next handler try. It is the modern replacement for writing your own catch-all middleware, and it runs in the same place in the pipeline.",
          ar: "الآن الحد نفسه. ‎IExceptionHandler‎ هو interface في ASP.NET Core 8 بميثود واحدة؛ يناديها الـ framework عندما يصل exception غير معالَج إلى القمة. ترجّع ‎true‎ إذا أنتجت الرد و‎false‎ لترك المعالج التالي يحاول. وهو البديل الحديث لكتابة catch-all middleware بنفسك، ويعمل في نفس الموضع من الـ pipeline."
        },
        {
          t: "code",
          lang: "csharp",
          label: { en: "One boundary: exception type in, HTTP response out", ar: "حد واحد: نوع exception يدخل، HTTP response يخرج" },
          code: "public sealed class ProblemDetailsHandler(\n    IProblemDetailsService problems,\n    ILogger<ProblemDetailsHandler> log) : IExceptionHandler\n{\n    public async ValueTask<bool> TryHandleAsync(\n        HttpContext ctx, Exception ex, CancellationToken ct)\n    {\n        // Map exception type -> status code. This table is the whole policy.\n        var (status, title) = ex switch\n        {\n            InvalidQuantityException => (400, \"Invalid request\"),\n            OutOfStockException      => (409, \"Conflict\"),\n            DomainException          => (422, \"Rule violated\"),\n            TaskCanceledException    => (504, \"Upstream timeout\"),\n            _                        => (500, \"Unexpected error\")\n        };\n\n        // 5xx is our bug -> Error. 4xx is the caller's -> Warning, so alerts stay meaningful.\n        log.Log(status >= 500 ? LogLevel.Error : LogLevel.Warning, ex,\n            \"{Status} on {Path} trace={TraceId}\",\n            status, ctx.Request.Path, Activity.Current?.Id);\n\n        ctx.Response.StatusCode = status;\n        return await problems.TryWriteAsync(new ProblemDetailsContext\n        {\n            HttpContext = ctx,\n            ProblemDetails = new ProblemDetails\n            {\n                Title  = title,\n                Status = status,\n                // Never leak ex.Message on 5xx: it can contain connection strings.\n                Detail = status < 500 ? ex.Message : \"An unexpected error occurred.\",\n                Extensions = { [\"traceId\"] = Activity.Current?.Id }\n            }\n        });\n    }\n}\n\n// Registration. AddProblemDetails gives you the default RFC 7807 writer.\nbuilder.Services.AddProblemDetails();\nbuilder.Services.AddExceptionHandler<ProblemDetailsHandler>();\napp.UseExceptionHandler();   // must be first, so it wraps everything after it"
        },
        {
          t: "callout",
          kind: "note",
          en: "`UseExceptionHandler()` has to be registered before the middleware it protects. It only sees exceptions thrown inside its own `await next()`, so anything registered above it is outside the boundary.",
          ar: "يجب تسجيل ‎UseExceptionHandler()‎ قبل الـ middleware التي يحميها. فهو يرى فقط الـ exceptions المرميّة داخل ‎await next()‎ الخاص به، وأي شيء مسجّل فوقه يقع خارج الحد."
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
              "One place decides the HTTP status for a failure, so clients get consistent shapes.",
              "Business code stays readable: the happy path is not buried in try/catch.",
              "Every unhandled failure is logged exactly once, with the trace id attached.",
              "Adding a new error type is one line in the mapping table."
            ],
            ar: [
              "مكان واحد يقرّر الـ HTTP status للفشل، فيحصل العملاء على أشكال موحّدة.",
              "كود العمل يبقى قابلاً للقراءة: المسار السعيد غير مدفون في try/catch.",
              "كل فشل غير معالَج يُسجَّل مرة واحدة بالضبط، مع الـ trace id.",
              "إضافة نوع خطأ جديد تعني سطراً واحداً في جدول التحويل."
            ]
          },
          cons: {
            en: [
              "The mapping table centralises knowledge: a new exception type nobody maps silently becomes a 500.",
              "Using exceptions for expected outcomes (validation) costs microseconds per throw, which matters in hot loops.",
              "Stack traces from deep call chains are long and need a log tool to read comfortably.",
              "Developers must resist adding local catches, which needs review discipline."
            ],
            ar: [
              "جدول التحويل يمركز المعرفة: نوع exception جديد لم يُضَف للجدول يصبح 500 بصمت.",
              "استخدام الـ exceptions لنتائج متوقّعة (validation) يكلّف ميكروثواني لكل رمية، وهذا مهم في الحلقات الساخنة.",
              "الـ stack traces من سلاسل نداء عميقة تكون طويلة وتحتاج أداة logs لقراءتها بارتياح.",
              "على المطورين مقاومة إضافة catches محلية، وهذا يحتاج انضباطاً في المراجعة."
            ]
          },
          limits: {
            en: [
              "It cannot catch failures in code registered above it in the pipeline.",
              "A `StackOverflowException` or `OutOfMemoryException` kills the process; no boundary sees it.",
              "It does not help background workers, which run outside the request pipeline.",
              "It cannot undo side effects that already happened before the throw."
            ],
            ar: [
              "لا يستطيع التقاط أعطال كود مسجَّل فوقه في الـ pipeline.",
              "‎StackOverflowException‎ أو ‎OutOfMemoryException‎ تقتل العملية؛ ولا يراها أي حد.",
              "لا يساعد الـ background workers لأنها تعمل خارج request pipeline.",
              "لا يستطيع التراجع عن آثار جانبية حدثت قبل الرمي."
            ]
          },
          alts: {
            en: [
              "Result<T> types: return failures as values instead of throwing — explicit, but noisier code.",
              "FluentValidation as a filter: reject bad input before the endpoint runs, so no exception is needed.",
              "Per-endpoint filters when one endpoint genuinely needs a different error contract.",
              "Polly for retry policies, keeping transient-failure logic out of both business code and the boundary."
            ],
            ar: [
              "أنواع ‎Result<T>‎: أرجِع الأعطال كقيم بدل رميها — صريح لكن الكود أكثر ضجيجاً.",
              "FluentValidation كـ filter: ارفض المدخل السيئ قبل تشغيل الـ endpoint، فلا حاجة لأي exception.",
              "Filters لكل endpoint عندما يحتاج endpoint واحد فعلاً عقد أخطاء مختلفاً.",
              "Polly لسياسات إعادة المحاولة، لإبقاء منطق الأعطال العابرة خارج كود العمل وخارج الحد."
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
          title: { en: "Catch, log, return null", ar: "التقط، سجّل، أرجِع null" },
          body: {
            en: "A developer wrapped the payment call in `catch (Exception ex) { _log.LogError(ex, \"failed\"); return null; }`. The controller checked `if (order == null) return Ok(new {})`. For four days, every timed-out payment returned HTTP 200 and an empty body, so the mobile app showed a success screen. The exception was logged, but at Error level in a service that logged 40k errors a day, so nobody read it.",
            ar: "لفّ مطوّر نداء الدفع بـ ‎catch (Exception ex) { _log.LogError(ex, \"failed\"); return null; }‎. والـ controller فحص ‎if (order == null) return Ok(new {})‎. لأربعة أيام، كل دفعة انتهت مهلتها أرجعت HTTP 200 وجسماً فارغاً، فعرض تطبيق الموبايل شاشة نجاح. الـ exception كان مسجّلاً، لكن بمستوى Error في خدمة تسجّل 40 ألف خطأ يومياً، فلم يقرأه أحد."
          },
          fix: "// Do not turn a failure into a normal-looking value.\n// If this method cannot fix it, let it reach the boundary.\nawait _payments.ChargeAsync(token, total, ct);"
        },
        {
          t: "mistake",
          title: { en: "throw ex; instead of throw;", ar: "‎throw ex;‎ بدل ‎throw;‎" },
          body: {
            en: "A catch block ended with `throw ex;`. That resets the exception's stack trace to the current line, so the log said the failure happened in `OrderService.cs:88` — the catch block itself. The real cause, a null dereference eight frames deeper in a mapper, was gone. The team spent a day reading the wrong file. Writing `throw;` alone rethrows the same object with its original trace intact.",
            ar: "انتهت كتلة catch بـ ‎throw ex;‎. هذا يعيد ضبط الـ stack trace للـ exception إلى السطر الحالي، فقال الـ log إن الفشل حدث في ‎OrderService.cs:88‎ — أي كتلة الـ catch نفسها. أما السبب الحقيقي، وهو null dereference على بعد ثمانية frames داخل mapper، فقد اختفى. أضاع الفريق يوماً في قراءة الملف الخطأ. كتابة ‎throw;‎ وحدها تعيد رمي نفس الكائن مع أثره الأصلي سليماً."
          },
          fix: "catch (SqlException ex) when (ex.Number == 1205)  // deadlock victim\n{\n    _metrics.Increment(\"db.deadlock\");\n    throw;   // NOT: throw ex;\n}"
        },
        {
          t: "mistake",
          title: { en: "Wrapping everything in a custom exception", ar: "تغليف كل شيء في exception مخصّص" },
          body: {
            en: "Every layer wrapped what it caught: `throw new OrderServiceException(\"failed\", ex)`. Production logs showed a chain five wrappers deep — `OrderServiceException` -> `RepositoryException` -> `DataAccessException` -> `SqlException`. The only useful line was at the bottom, and the alerting rule matched on the outermost type, so a connection timeout and a primary-key violation produced identical alerts.",
            ar: "كل طبقة كانت تغلّف ما تلتقطه: ‎throw new OrderServiceException(\"failed\", ex)‎. أظهرت logs الإنتاج سلسلة بعمق خمسة أغلفة: ‎OrderServiceException‎ ← ‎RepositoryException‎ ← ‎DataAccessException‎ ← ‎SqlException‎. السطر المفيد الوحيد كان في الأسفل، وقاعدة التنبيه كانت تطابق النوع الخارجي، فأنتج انتهاء مهلة اتصال وانتهاك primary key تنبيهين متطابقين."
          }
        },
        {
          t: "mistake",
          title: { en: "Catching Exception at the wrong level", ar: "التقاط ‎Exception‎ في المستوى الخطأ" },
          body: {
            en: "A background job wrapped its whole loop in `try { foreach (...) Process(item); } catch (Exception) { }` so that one bad item would not stop the job. It worked as intended for a week. Then a config change made every item fail. The job ran to completion in 200 ms, reported success, and processed nothing, for eleven days. The catch belonged inside the loop, around one item, with a log line and a failure counter.",
            ar: "لفّ background job حلقته كاملة بـ ‎try { foreach (...) Process(item); } catch (Exception) { }‎ حتى لا يوقف عنصر سيئ واحد المهمة. عمل كما هو مقصود لأسبوع. ثم جعل تغيير في الإعدادات كل عنصر يفشل. اكتملت المهمة في 200 ميلي ثانية، وأبلغت عن نجاح، ولم تعالج شيئاً، لمدة أحد عشر يوماً. كان مكان الـ catch داخل الحلقة، حول عنصر واحد، مع سطر log وعدّاد أعطال."
          },
          fix: "foreach (var item in batch)\n{\n    try { await Process(item, ct); }\n    catch (Exception ex)\n    {\n        _log.LogError(ex, \"Item {Id} failed\", item.Id);\n        failures++;   // and fail the whole job if failures > threshold\n    }\n}"
        }
      ]
    },
    {
      key: "interview",
      blocks: [
        {
          t: "qa",
          level: "junior",
          q: { en: "When should you catch an exception?", ar: "متى يجب أن تلتقط exception؟" },
          a: {
            en: "Only when this exact place can do something useful with it. Two examples: retrying a network call that might work on the second attempt, or releasing a stock reservation before letting the error continue. If all you would do is log it and rethrow, do not catch it — one handler at the top of the request pipeline already logs everything, and catching again means the same failure appears twice in the logs.",
            ar: "فقط عندما يستطيع هذا المكان بالذات فعل شيء مفيد بها. مثالان: إعادة محاولة نداء شبكة قد ينجح في المحاولة الثانية، أو تحرير حجز مخزون قبل ترك الخطأ يكمل. إذا كان كل ما ستفعله هو تسجيلها وإعادة رميها، فلا تلتقطها — هناك معالج واحد في قمة الـ pipeline يسجّل كل شيء، والالتقاط مجدداً يعني ظهور نفس الفشل مرتين في الـ logs."
          }
        },
        {
          t: "qa",
          level: "mid",
          q: { en: "What is the difference between `throw;` and `throw ex;`?", ar: "ما الفرق بين ‎throw;‎ و ‎throw ex;‎؟" },
          a: {
            en: "`throw;` rethrows the same exception object and keeps the stack trace it already collected, so the log still points at the line where things actually broke. `throw ex;` rethrows it but resets the stack trace to the current line, so you lose every frame below the catch. In practice that turns a five-minute fix into a day of guessing. There is one legitimate use of `throw ex;`: when `ex` is an exception you just constructed yourself.",
            ar: "‎throw;‎ تعيد رمي نفس كائن الـ exception وتحتفظ بالـ stack trace الذي جمعه، فيبقى الـ log يشير إلى السطر الذي انكسر فعلاً. ‎throw ex;‎ تعيد رميه لكن تعيد ضبط الـ stack trace إلى السطر الحالي، فتفقد كل frame تحت الـ catch. عملياً هذا يحوّل إصلاحاً مدته خمس دقائق إلى يوم من التخمين. هناك استخدام مشروع واحد لـ ‎throw ex;‎: عندما يكون ‎ex‎ كائناً أنشأته أنت للتو."
          }
        },
        {
          t: "qa",
          level: "mid",
          q: {
            en: "How do you decide which HTTP status code an exception maps to?",
            ar: "كيف تقرّر إلى أي HTTP status code يتحوّل الـ exception؟"
          },
          a: {
            en: "By asking one question: whose fault is it and can the caller fix it? If the caller sent something wrong and could fix and resend it, that is 4xx — 400 for malformed input, 409 when the current state conflicts, 422 when the shape is fine but a business rule says no. If our side failed, that is 5xx — 500 for a bug, 503 when a dependency is down, 504 when it timed out. The mapping lives in one table so the whole API answers the same way, and unmapped types default to 500 because an unknown failure is our problem, not the caller's.",
            ar: "بسؤال واحد: خطأ من هو، وهل يستطيع الـ caller إصلاحه؟ إذا أرسل الـ caller شيئاً خاطئاً ويستطيع تصحيحه وإعادة الإرسال، فهذا 4xx — 400 لمدخل مشوّه، 409 عندما تتعارض الحالة الحالية، 422 عندما يكون الشكل سليماً لكن قاعدة عمل ترفض. أما إذا فشل طرفنا فهذا 5xx — 500 لـ bug، 503 عندما تكون تبعية متوقفة، 504 عند انتهاء المهلة. التحويل يعيش في جدول واحد ليجيب الـ API كله بنفس الطريقة، والأنواع غير المحوّلة تصبح 500 لأن الفشل المجهول مشكلتنا لا مشكلة الـ caller."
          }
        },
        {
          t: "qa",
          level: "senior",
          q: {
            en: "Exceptions or Result types for expected failures?",
            ar: "Exceptions أم أنواع Result للأعطال المتوقّعة؟"
          },
          a: {
            en: "It depends on how often the failure happens and who needs to see it. A throw costs single-digit microseconds because the runtime walks the stack building the trace — irrelevant once per request, expensive in a loop validating ten thousand rows. So for high-frequency, expected outcomes I return a Result, which is a value carrying either success or a failure reason. For genuinely exceptional things — the database is gone, an invariant is broken — I throw, because the compiler cannot force anyone to check a Result and a silently ignored failure is worse than a slow one. Mixed is fine: validation returns Results, infrastructure throws.",
            ar: "يعتمد على تكرار الفشل ومن يحتاج رؤيته. الرمية تكلّف ميكروثواني بخانة واحدة لأن الـ runtime يمشي على الـ stack لبناء الأثر — لا يهم مرة واحدة لكل request، لكنه مكلف في حلقة تتحقّق من عشرة آلاف صف. لذلك للنتائج المتوقّعة عالية التكرار أرجّع Result، وهو قيمة تحمل إمّا نجاحاً أو سبب فشل. أما للأشياء الاستثنائية فعلاً — الـ database اختفت، أو انكسر invariant — فأرمي، لأن الـ compiler لا يستطيع إجبار أحد على فحص Result، والفشل المتجاهَل بصمت أسوأ من الفشل البطيء. الخلط مقبول: الـ validation يرجّع Results والبنية التحتية ترمي."
          }
        },
        {
          t: "qa",
          level: "senior",
          q: {
            en: "How do you stop the exception boundary from leaking sensitive information?",
            ar: "كيف تمنع حد الـ exception من تسريب معلومات حساسة؟"
          },
          a: {
            en: "Two different bodies for two different audiences. For any 5xx the client gets a fixed string plus a trace id — never `ex.Message`, because messages routinely contain connection strings, file paths, and internal host names. The full exception with the same trace id goes to the log, which only engineers can read. For 4xx the message is safe to return because we wrote it ourselves for the caller. I verify this with a test that throws a `SqlException` at an endpoint and asserts the response body does not contain the server name.",
            ar: "جسمان مختلفان لجمهورين مختلفين. لأي 5xx يحصل العميل على نص ثابت مع trace id — وليس ‎ex.Message‎ أبداً، لأن الرسائل تحتوي عادةً على connection strings ومسارات ملفات وأسماء hosts داخلية. الـ exception الكامل بنفس الـ trace id يذهب إلى الـ log الذي يقرأه المهندسون فقط. أما 4xx فرسالتها آمنة للإرجاع لأننا كتبناها نحن للـ caller. وأتحقّق من ذلك باختبار يرمي ‎SqlException‎ في endpoint ويؤكّد أن جسم الرد لا يحتوي اسم الخادم."
          }
        },
        {
          t: "qa",
          level: "staff",
          q: {
            en: "Your services each invented their own error format. How do you fix that across twenty teams?",
            ar: "كل خدمة عندك اخترعت صيغة أخطاء خاصة بها. كيف تصلح ذلك عبر عشرين فريقاً؟"
          },
          a: {
            en: "Not by writing a document asking people to comply. I would ship a shared NuGet package containing the handler, the base exception types and the status mapping, so adopting the standard is one line in Program.cs and cheaper than keeping the custom code. Then I would add a contract test in the shared CI template that calls each service's known-bad endpoint and asserts a ProblemDetails body — that makes drift visible without a human policing it. Migration is incremental: new endpoints use it immediately, old ones move when they are next touched, and I publish a dashboard of adoption per service so progress is a fact rather than an argument.",
            ar: "ليس بكتابة مستند يطلب من الناس الالتزام. سأصدر NuGet package مشتركاً يحتوي المعالج وأنواع الـ exception الأساسية وجدول التحويل، بحيث يصبح تبنّي المعيار سطراً واحداً في ‎Program.cs‎ وأرخص من الاحتفاظ بالكود المخصّص. ثم أضيف contract test في قالب الـ CI المشترك ينادي endpoint معروف الفشل في كل خدمة ويؤكّد وجود جسم ProblemDetails — فيصبح الانحراف مرئياً دون أن يراقبه إنسان. والترحيل تدريجي: الـ endpoints الجديدة تستخدمه فوراً، والقديمة تنتقل عند أول تعديل عليها، وأنشر لوحة تبنٍّ لكل خدمة ليصبح التقدّم حقيقة لا جدالاً."
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
          title: { en: "Catch-all that hides the failure", ar: "catch شامل يخفي الفشل" },
          bad: "public async Task<IActionResult> Post(OrderRequest req)\n{\n    try\n    {\n        var order = await _service.PlaceOrderAsync(req, HttpContext.RequestAborted);\n        return Ok(order);\n    }\n    catch (Exception ex)\n    {\n        _log.LogError(ex, \"order failed\");\n        return Ok(new { success = false });   // 200 for a failure\n    }\n}",
          good: "public async Task<IActionResult> Post(OrderRequest req)\n{\n    // No try/catch. The boundary handler maps and logs every failure.\n    var order = await _service.PlaceOrderAsync(req, HttpContext.RequestAborted);\n    return Ok(order);\n}",
          why: {
            en: "The bad version returns HTTP 200 for a failed order, so no client retry, no error metric and no alert ever fires — monitoring counts it as a success. It also catches `OperationCanceledException`, meaning a user closing the browser is logged as an error. Removing the catch lets the boundary produce the right status and log it once.",
            ar: "النسخة السيئة ترجّع HTTP 200 لطلب فاشل، فلا إعادة محاولة من العميل ولا مقياس خطأ ولا تنبيه — والمراقبة تعدّها نجاحاً. كما أنها تلتقط ‎OperationCanceledException‎، أي أن إغلاق المستخدم للمتصفح يُسجَّل كخطأ. إزالة الـ catch تدع الحد ينتج الحالة الصحيحة ويسجّلها مرة واحدة."
          }
        },
        {
          t: "review",
          severity: "medium",
          title: { en: "Filtering by message text", ar: "الترشيح حسب نص الرسالة" },
          bad: "catch (Exception ex)\n{\n    if (ex.Message.Contains(\"timeout\"))\n        return await RetryAsync();\n    throw;\n}",
          good: "// An exception filter: 'when' decides BEFORE the stack unwinds,\n// so non-matching exceptions are never caught at all.\ncatch (SqlException ex) when (ex.Number is -2 or 1205)\n{\n    return await RetryAsync();   // -2 = timeout, 1205 = deadlock victim\n}",
          why: {
            en: "Message text is not an API: it changes between driver versions and is localised on non-English servers, so this check silently stops matching after an upgrade. Error numbers are stable and documented. The `when` filter is also better mechanically — it evaluates before the stack unwinds, so if it returns false the stack trace stays intact for whoever catches next.",
            ar: "نص الرسالة ليس API: يتغيّر بين إصدارات الـ driver ويُترجَم على الخوادم غير الإنجليزية، فيتوقّف هذا الفحص عن المطابقة بصمت بعد أي ترقية. أما أرقام الأخطاء فثابتة وموثّقة. كما أن filter الـ ‎when‎ أفضل ميكانيكياً — فهو يُقيَّم قبل فكّ الـ stack، وإذا أرجع false يبقى الـ stack trace سليماً لمن يلتقطه لاحقاً."
          }
        }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        {
          t: "p",
          en: "In a system of several services, failure boundaries are what stop one service's problem from becoming everyone's problem. If the payments service returns 500 with an HTML error page when its database is slow, the orders service cannot tell \"retry me later\" apart from \"your request was wrong\", so it either retries something that will never succeed or gives up on something that would have worked.",
          ar: "في نظام من عدة خدمات، حدود الفشل هي ما يمنع مشكلة خدمة واحدة من أن تصبح مشكلة الجميع. إذا أرجعت خدمة المدفوعات 500 مع صفحة خطأ HTML عندما تبطئ قاعدة بياناتها، فلن تستطيع خدمة الطلبات التمييز بين \"أعد المحاولة لاحقاً\" و\"طلبك خاطئ\"، فتعيد محاولة شيء لن ينجح أبداً أو تستسلم لشيء كان سينجح."
        },
        {
          t: "ul",
          en: [
            "Every service exposes the same ProblemDetails shape, so callers parse one format instead of one per dependency.",
            "The trace id in the response body is the same id in the logs, so a support ticket with that id finds the exact request in seconds.",
            "4xx and 5xx are counted as separate metrics: a spike in 4xx means a client deployed something broken, a spike in 5xx means we did.",
            "Background workers get their own boundary — one try/catch per message, with the failed message sent to a dead-letter queue instead of retried forever."
          ],
          ar: [
            "كل خدمة تعرض نفس شكل ProblemDetails، فيحلّل العملاء صيغة واحدة بدل صيغة لكل تبعية.",
            "الـ trace id في جسم الرد هو نفسه في الـ logs، فتجد تذكرة الدعم الحاملة له الـ request المحدّد خلال ثوانٍ.",
            "يُحسب 4xx و5xx كمقياسين منفصلين: ارتفاع 4xx يعني أن عميلاً نشر شيئاً معطوباً، وارتفاع 5xx يعني أننا نحن من فعل.",
            "الـ background workers لها حدّها الخاص — try/catch واحد لكل رسالة، مع إرسال الرسالة الفاشلة إلى dead-letter queue بدل إعادة المحاولة للأبد."
          ]
        },
        {
          t: "callout",
          kind: "warn",
          en: "Decide explicitly what a health check does when a dependency is down. Returning 500 from `/health` because Redis is unreachable will make the load balancer remove every instance at once, turning a degraded cache into a total outage.",
          ar: "قرّر صراحةً ماذا يفعل الـ health check عندما تكون تبعية متوقفة. إرجاع 500 من ‎/health‎ لأن Redis غير متاح سيجعل الـ load balancer يزيل كل النسخ دفعة واحدة، فيحوّل cache متدهوراً إلى انقطاع كامل."
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
              k: { en: "CPU", ar: "CPU" },
              v: {
                en: "A throw costs roughly 5-20 microseconds because the runtime walks the stack to build the trace. Once per request that is invisible; 10,000 times in a validation loop is 50-200 ms of pure overhead.",
                ar: "الرمية تكلّف تقريباً 5-20 ميكروثانية لأن الـ runtime يمشي على الـ stack لبناء الأثر. مرة واحدة لكل request غير مرئية؛ لكن 10,000 مرة في حلقة validation تعني 50-200 ميلي ثانية من الحمل الصافي."
              }
            },
            {
              k: { en: "Memory", ar: "Memory" },
              v: {
                en: "Each exception allocates an object plus the formatted stack trace string, often 1-4 KB. A tight loop throwing exceptions creates short-lived garbage and drives up gen-0 collections.",
                ar: "كل exception يخصّص كائناً مع نص الـ stack trace المنسّق، غالباً 1-4 كيلوبايت. الحلقة الضيّقة التي ترمي exceptions تنتج قمامة قصيرة العمر وترفع عدد عمليات جمع gen-0."
              }
            },
            {
              k: { en: "Latency", ar: "Latency" },
              v: {
                en: "The boundary itself adds well under a millisecond. The real latency risk is a retry loop inside a boundary: three retries with a 30-second timeout each turns one failure into a 90-second response.",
                ar: "الحد نفسه يضيف أقل بكثير من ميلي ثانية. خطر الـ latency الحقيقي هو حلقة إعادة محاولة داخل حد: ثلاث محاولات بمهلة 30 ثانية لكل منها تحوّل فشلاً واحداً إلى رد بعد 90 ثانية."
              }
            },
            {
              k: { en: "Scalability", ar: "Scalability" },
              v: {
                en: "Failing fast frees threads. A request stuck for 30 seconds in a retry holds its resources; at 500 requests per second that is 15,000 in-flight requests waiting on nothing.",
                ar: "الفشل السريع يحرّر الـ threads. الـ request العالق 30 ثانية في إعادة محاولة يحتجز موارده؛ وعند 500 request في الثانية يعني ذلك 15,000 request جارٍ ينتظر لا شيء."
              }
            },
            {
              k: { en: "Network", ar: "Network" },
              v: {
                en: "5xx responses that trigger client retries multiply traffic. Returning 429 or 503 with a `Retry-After` header tells the caller when to come back instead of letting it hammer you.",
                ar: "ردود 5xx التي تحفّز إعادة محاولة العميل تضاعف الترافيك. إرجاع 429 أو 503 مع ترويسة ‎Retry-After‎ يخبر الـ caller متى يعود بدل تركه يطرق الباب بلا توقف."
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
            "First-chance exception logging in the debugger (Debug > Windows > Exception Settings, tick Common Language Runtime Exceptions): stops at the original throw, before any catch hides it.",
            "`dotnet-counters monitor --counters System.Runtime --process-id <pid>`: watch `exception-count`. A steady non-zero rate means something is throwing and being swallowed on the happy path.",
            "`dotnet-dump collect -p <pid>` then `dotnet-dump analyze`, command `pe -nested`: prints the exception on a thread including inner exceptions, which is how you unpack a five-layer wrapper chain.",
            "Search logs by trace id (`traceId` in the ProblemDetails body): gives you every log line for that one request across services, which is faster than guessing timestamps.",
            "`grep -rn 'catch (Exception' --include=*.cs src/`: lists every catch-all in the codebase. Each one is a candidate for a failure hidden behind a 200."
          ],
          ar: [
            "تسجيل first-chance exceptions في الـ debugger (‎Debug > Windows > Exception Settings‎ مع تفعيل ‎Common Language Runtime Exceptions‎): يتوقّف عند الرمية الأصلية قبل أن يخفيها أي catch.",
            "‎dotnet-counters monitor --counters System.Runtime --process-id <pid>‎: راقب ‎exception-count‎. المعدّل الثابت غير الصفري يعني أن شيئاً يرمي ويُبتلع في المسار السعيد.",
            "‎dotnet-dump collect -p <pid>‎ ثم ‎dotnet-dump analyze‎ والأمر ‎pe -nested‎: يطبع الـ exception على thread مع الـ inner exceptions، وهكذا تفكّ سلسلة أغلفة من خمس طبقات.",
            "ابحث في الـ logs بالـ trace id (‎traceId‎ في جسم ProblemDetails): يعطيك كل سطر log لذلك الـ request عبر الخدمات، وهو أسرع من تخمين الطوابع الزمنية.",
            "‎grep -rn 'catch (Exception' --include=*.cs src/‎: يسرد كل catch شامل في الكود. كل واحد منها مرشّح لفشل مخفي خلف 200."
          ]
        },
        {
          t: "callout",
          kind: "tip",
          en: "If a bug report says \"it just didn't work, no error\", search for catch blocks first. A failure with no log line almost always means someone caught it and returned a default value.",
          ar: "إذا قال تقرير الـ bug \"لم يعمل ببساطة، بلا خطأ\"، ابحث عن كتل الـ catch أولاً. الفشل بلا سطر log يعني غالباً أن أحدهم التقطه وأرجع قيمة افتراضية."
        }
      ]
    },
    {
      key: "realworld",
      blocks: [
        {
          t: "p",
          en: "The shape of the boundary follows what the caller can do about the failure. A system whose callers are machines needs machine-readable errors with stable codes; a system whose callers are humans in a browser needs a message someone can act on. Both need the failure to be visible to the team within minutes, which is why the boundary is also where logging and metrics live.",
          ar: "شكل الحد يتبع ما يستطيع الـ caller فعله حيال الفشل. النظام الذي عملاؤه آلات يحتاج أخطاء مقروءة آلياً بأكواد ثابتة؛ والنظام الذي عملاؤه بشر في متصفح يحتاج رسالة يستطيع أحدهم التصرّف بناءً عليها. وكلاهما يحتاج أن يكون الفشل مرئياً للفريق خلال دقائق، ولهذا يعيش الـ logging والـ metrics في الحد نفسه."
        },
        {
          t: "ul",
          en: [
            "Payment platforms: the boundary must separate \"declined by the bank\" (a business outcome, 200 or 402 with a reason code) from \"we could not reach the bank\" (503), because only the second is safe to retry.",
            "Public API products: a stable error code per failure type is part of the published contract, since customer code branches on it — changing a code is a breaking change like renaming a field.",
            "Chat and messaging platforms: send failures are per-message, so the boundary is around one message, letting the rest of the batch deliver instead of failing the whole send.",
            "Data ingestion pipelines: bad records go to a dead-letter store with the original payload and the reason, so one malformed row never stops a million-row load."
          ],
          ar: [
            "منصّات الدفع: على الحد أن يفصل \"رفض البنك\" (نتيجة عمل، 200 أو 402 مع reason code) عن \"لم نستطع الوصول للبنك\" (503)، لأن الثانية فقط آمنة لإعادة المحاولة.",
            "منتجات الـ public API: كود خطأ ثابت لكل نوع فشل جزء من العقد المنشور، لأن كود العميل يتفرّع عليه — وتغيير الكود تغيير كاسر كإعادة تسمية حقل.",
            "منصّات الدردشة والرسائل: أعطال الإرسال لكل رسالة على حدة، فيكون الحد حول رسالة واحدة، ليصل باقي الدفعة بدل فشل الإرسال كله.",
            "خطوط ابتلاع البيانات: السجلات السيئة تذهب إلى dead-letter store مع الحمولة الأصلية والسبب، فلا يوقف صف مشوّه واحد تحميل مليون صف."
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
          en: "Add an `IExceptionHandler` to a minimal API that maps a custom `NotFoundException` to 404 and everything else to 500, both as ProblemDetails. You are done when `curl` on a missing id returns 404 with `application/problem+json` and a `traceId` field.",
          ar: "أضِف ‎IExceptionHandler‎ إلى minimal API يحوّل ‎NotFoundException‎ مخصّصاً إلى 404 وكل ما عداه إلى 500، وكلاهما بصيغة ProblemDetails. تنتهي عندما يرجع ‎curl‎ على id غير موجود الرمز 404 مع ‎application/problem+json‎ وحقل ‎traceId‎."
        },
        {
          t: "ex",
          diff: "medium",
          en: "Take an existing controller with at least three try/catch blocks and remove all of them, moving the behaviour into the boundary. You are done when the tests still pass and every previously caught case produces a distinct status code, verified by an integration test per case.",
          ar: "خذ controller موجوداً فيه ثلاث كتل try/catch على الأقل واحذفها كلها، وانقل السلوك إلى الحد. تنتهي عندما تنجح الاختبارات ويُنتج كل حالة كانت ملتقَطة سابقاً status code مميّزاً، بتحقّق عبر integration test لكل حالة."
        },
        {
          t: "ex",
          diff: "hard",
          en: "Write a test that throws a `SqlException` from a fake repository and asserts two things at once: the response body contains no server name, connection string or stack trace, and the log entry for that request contains the full exception. You are done when deliberately putting `ex.Message` into the 500 body makes the test fail.",
          ar: "اكتب اختباراً يرمي ‎SqlException‎ من repository وهمي ويؤكّد أمرين معاً: أن جسم الرد لا يحتوي اسم خادم ولا connection string ولا stack trace، وأن سطر الـ log لذلك الـ request يحتوي الـ exception كاملاً. تنتهي عندما يؤدي وضع ‎ex.Message‎ عمداً في جسم 500 إلى فشل الاختبار."
        },
        {
          t: "ex",
          diff: "senior",
          en: "Design the failure policy for a worker that reads from a queue: decide what is retried in place, what goes to a dead-letter queue, and what stops the worker entirely. Write it as a one-page table of exception type to action, then implement it and prove with a test that a poison message is dead-lettered after exactly three attempts without blocking the ones behind it.",
          ar: "صمّم سياسة الفشل لـ worker يقرأ من queue: حدّد ما يُعاد في المكان، وما يذهب إلى dead-letter queue، وما يوقف الـ worker كلياً. اكتبها كجدول من صفحة واحدة يربط نوع الـ exception بالإجراء، ثم نفّذها وأثبت باختبار أن الرسالة السامة تذهب إلى dead-letter بعد ثلاث محاولات بالضبط دون حجب ما خلفها."
        }
      ]
    },
    {
      key: "refs",
      blocks: [
        {
          t: "ref",
          label: { en: "Handle errors in ASP.NET Core", ar: "معالجة الأخطاء في ASP.NET Core" },
          url: "https://learn.microsoft.com/en-us/aspnet/core/fundamentals/error-handling",
          meta: { en: "Docs", ar: "توثيق" }
        },
        {
          t: "ref",
          label: { en: "Best practices for exceptions (.NET)", ar: "أفضل الممارسات للـ exceptions في .NET" },
          url: "https://learn.microsoft.com/en-us/dotnet/standard/exceptions/best-practices-for-exceptions",
          meta: { en: "Docs", ar: "توثيق" }
        },
        {
          t: "ref",
          label: { en: "RFC 7807 — Problem Details for HTTP APIs", ar: "RFC 7807 — تفاصيل المشكلة لواجهات HTTP" },
          url: "https://www.rfc-editor.org/rfc/rfc7807",
          meta: { en: "Spec", ar: "مواصفة" }
        },
        {
          t: "ref",
          label: { en: "Design guidelines: exception throwing", ar: "إرشادات التصميم: رمي الـ exceptions" },
          url: "https://learn.microsoft.com/en-us/dotnet/standard/design-guidelines/exception-throwing",
          meta: { en: "Guide", ar: "دليل" }
        }
      ]
    }
  ],
  quiz: [
    {
      q: {
        en: "You catch an exception, log it, and immediately rethrow it. What is wrong with that?",
        ar: "تلتقط exception وتسجّله ثم تعيد رميه فوراً. ما الخطأ في ذلك؟"
      },
      options: [
        { en: "Nothing — logging early is always better", ar: "لا شيء — التسجيل المبكر أفضل دائماً" },
        {
          en: "The same failure is logged twice, once here and once at the boundary, so alert counts are wrong",
          ar: "يُسجَّل نفس الفشل مرتين، هنا وعند الحد، فتصبح أعداد التنبيهات خاطئة"
        },
        { en: "Rethrowing always loses the stack trace", ar: "إعادة الرمي تفقد الـ stack trace دائماً" },
        { en: "The exception becomes unrecoverable", ar: "يصبح الـ exception غير قابل للتعافي" }
      ],
      correct: 1,
      why: {
        en: "Catching just to log adds noise: the boundary already logs every unhandled exception, so you get duplicate entries and inflated error counts. `throw;` does keep the stack trace — it is `throw ex;` that resets it.",
        ar: "الالتقاط لمجرد التسجيل يضيف ضجيجاً: الحد يسجّل أصلاً كل exception غير معالَج، فتحصل على مدخلات مكرّرة وأعداد أخطاء منتفخة. و‎throw;‎ تحافظ على الـ stack trace — ‎throw ex;‎ هي التي تعيد ضبطه."
      }
    },
    {
      q: {
        en: "A request is valid JSON with correct types, but the account has no funds. Which status fits best?",
        ar: "request بصيغة JSON صحيحة وأنواع صحيحة، لكن الحساب بلا رصيد. أي status هو الأنسب؟"
      },
      options: [
        { en: "400 Bad Request", ar: "400 Bad Request" },
        { en: "422 Unprocessable Entity", ar: "422 Unprocessable Entity" },
        { en: "500 Internal Server Error", ar: "500 Internal Server Error" },
        { en: "404 Not Found", ar: "404 Not Found" }
      ],
      correct: 1,
      why: {
        en: "422 means the request was well formed and understood, but a business rule prevents processing it. 400 is for input the server could not parse or that failed type/format checks; 500 would blame our server for the caller's situation.",
        ar: "422 تعني أن الـ request مبني بشكل صحيح ومفهوم، لكن قاعدة عمل تمنع معالجته. أما 400 فللمدخل الذي لم يستطع الخادم تحليله أو الذي فشل في فحوص النوع والصيغة؛ و500 تُلقي اللوم على خادمنا في وضع يخصّ الـ caller."
      }
    },
    {
      q: {
        en: "Why is `catch (SqlException ex) when (ex.Number == 1205)` better than catching and checking inside the block?",
        ar: "لماذا ‎catch (SqlException ex) when (ex.Number == 1205)‎ أفضل من الالتقاط والفحص داخل الكتلة؟"
      },
      options: [
        { en: "It is faster to compile", ar: "أسرع في الـ compile" },
        {
          en: "The filter runs before the stack unwinds, so non-matching exceptions keep their original state for the next handler",
          ar: "الـ filter يعمل قبل فكّ الـ stack، فتحتفظ الـ exceptions غير المطابقة بحالتها الأصلية للمعالج التالي"
        },
        { en: "It catches more exception types", ar: "يلتقط أنواع exceptions أكثر" },
        { en: "It automatically retries the operation", ar: "يعيد محاولة العملية تلقائياً" }
      ],
      correct: 1,
      why: {
        en: "An exception filter is evaluated in a first pass, before the runtime unwinds the stack. If it returns false the catch never runs and the exception continues with its original stack intact — unlike catching and rethrowing, which disturbs it.",
        ar: "يُقيَّم الـ exception filter في مرور أول، قبل أن يفكّ الـ runtime الـ stack. وإذا أرجع false فلن تعمل كتلة الـ catch ويكمل الـ exception بـ stack أصلي سليم — بخلاف الالتقاط وإعادة الرمي الذي يشوّشه."
      }
    },
    {
      q: {
        en: "What should the body of a 500 response contain?",
        ar: "ماذا يجب أن يحتوي جسم رد 500؟"
      },
      options: [
        { en: "The full exception message and stack trace, to help the client debug", ar: "رسالة الـ exception كاملة والـ stack trace لمساعدة العميل على التشخيص" },
        { en: "Nothing at all", ar: "لا شيء إطلاقاً" },
        {
          en: "A generic message plus a trace id that maps to the full exception in the logs",
          ar: "رسالة عامة مع trace id يقابل الـ exception الكامل في الـ logs"
        },
        { en: "The name of the developer who owns the service", ar: "اسم المطوّر المسؤول عن الخدمة" }
      ],
      correct: 2,
      why: {
        en: "Exception messages routinely leak connection strings, file paths and internal host names, so they must not reach clients. A trace id gives support everything they need to find the full detail in the logs, which only engineers can read.",
        ar: "رسائل الـ exceptions تسرّب عادةً connection strings ومسارات ملفات وأسماء hosts داخلية، فلا يجوز وصولها للعملاء. والـ trace id يعطي الدعم كل ما يلزم لإيجاد التفاصيل الكاملة في الـ logs التي يقرأها المهندسون فقط."
      }
    },
    {
      q: {
        en: "A background job wraps its entire item loop in one `try { ... } catch (Exception) { }`. What is the main risk?",
        ar: "background job يلفّ حلقة عناصره كاملة بـ ‎try { ... } catch (Exception) { }‎ واحد. ما الخطر الرئيسي؟"
      },
      options: [
        { en: "It uses slightly more memory", ar: "يستهلك ذاكرة أكثر قليلاً" },
        {
          en: "One failure ends the whole loop silently, so the job reports success while processing almost nothing",
          ar: "فشل واحد ينهي الحلقة كلها بصمت، فتبلّغ المهمة عن نجاح بينما لم تعالج شيئاً تقريباً"
        },
        { en: "The catch block cannot compile without a filter", ar: "لا يمكن compile كتلة الـ catch بدون filter" },
        { en: "Exceptions inside loops are always fatal", ar: "الـ exceptions داخل الحلقات قاتلة دائماً" }
      ],
      correct: 1,
      why: {
        en: "The catch sits outside the loop, so the first failure exits the loop and is then swallowed. Every remaining item is skipped and the job still looks successful. Putting the try/catch around one item, with a log line and a failure counter, keeps the rest running and makes the failures visible.",
        ar: "الـ catch يقع خارج الحلقة، فأول فشل يخرج من الحلقة ثم يُبتلع. تُتخطّى كل العناصر المتبقية وتبدو المهمة ناجحة رغم ذلك. وضع try/catch حول عنصر واحد، مع سطر log وعدّاد أعطال، يبقي الباقي يعمل ويجعل الأعطال مرئية."
      }
    }
  ]
};
```

NEXT: di-why
