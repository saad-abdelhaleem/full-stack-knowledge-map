```js
const apiErrorsLesson = {
  id: "api-errors",
  moduleId: "foundations",
  title: { en: "Error contracts", ar: "عقود الأخطاء" },
  summary: {
    en: "Give every failure the same shape, so a caller can read one field and know exactly what to do next.",
    ar: "اجعل كل فشل يخرج بنفس الشكل، حتى يقرأ الـ caller حقلاً واحداً ويعرف ماذا يفعل بالضبط."
  },
  mins: 11,
  sections: [
    {
      key: "why",
      blocks: [
        {
          t: "p",
          en: "An error contract is the fixed shape of the response your API sends when a request fails. It exists so the calling program can decide what to do in code — retry, highlight a form field, or stop and show a message — without reading the English sentence inside the body.",
          ar: "عقد الخطأ هو الشكل الثابت للـ response الذي ترسله الـ API عند فشل الطلب. وجوده يسمح للبرنامج المُتصِل أن يقرر في الكود ماذا يفعل — إعادة المحاولة، أو تمييز حقل في الـ form، أو التوقف وعرض رسالة — دون أن يقرأ الجملة الإنجليزية داخل الـ body."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "Error contract", ar: "Error contract" },
              v: {
                en: "The agreed set of fields a failure response always contains, no matter what broke.",
                ar: "مجموعة الحقول المتفق عليها التي يحتويها رد الفشل دائماً، مهما كان سبب العطل."
              }
            },
            {
              k: { en: "Problem Details (RFC 9457)", ar: "Problem Details (RFC 9457)" },
              v: {
                en: "A short published internet standard — an RFC is a numbered spec document — that defines a small JSON error body with the fields type, title, status, detail and instance. RFC 9457 replaced the older RFC 7807; the fields are the same.",
                ar: "معيار إنترنت منشور قصير — الـ RFC هو مستند مواصفة مرقّم — يعرّف body صغيراً بصيغة JSON للأخطاء، بحقول type و title و status و detail و instance. الـ RFC 9457 حلّ محل الـ RFC 7807 الأقدم، والحقول نفسها."
              }
            },
            {
              k: { en: "Machine-readable code", ar: "Machine-readable code" },
              v: {
                en: "A short fixed string such as insufficient_stock that the client compares in an if statement. It is never translated and never reworded.",
                ar: "نص قصير ثابت مثل insufficient_stock يقارنه الـ client داخل جملة if. لا يُترجم ولا تُعاد صياغته أبداً."
              }
            },
            {
              k: { en: "Validation error", ar: "Validation error" },
              v: {
                en: "The request was well-formed but a value is wrong — for example quantity is 0. It maps to one or more specific input fields.",
                ar: "الطلب مبنيّ بشكل صحيح لكن إحدى القيم خاطئة — مثلاً quantity تساوي 0. يرتبط بحقل إدخال محدد أو أكثر."
              }
            },
            {
              k: { en: "Trace id", ar: "Trace id" },
              v: {
                en: "A unique string that identifies one request across every service it touched, so a support ticket maps to exact log lines.",
                ar: "نص فريد يعرّف طلباً واحداً عبر كل الـ services التي مرّ بها، حتى ترتبط تذكرة الدعم بسطور log محددة."
              }
            },
            {
              k: { en: "application/problem+json", ar: "application/problem+json" },
              v: {
                en: "The Content-Type header value that tells the client this JSON body is an error described by the Problem Details standard.",
                ar: "قيمة ترويسة Content-Type التي تخبر الـ client أن هذا الـ JSON body خطأ موصوف بمعيار Problem Details."
              }
            }
          ]
        },
        {
          t: "p",
          en: "Use one running example for the whole lesson: a POST /orders endpoint that takes a sku (the product code), a quantity, and a payment method id. It can fail in four different ways. The sku does not exist. The quantity is 0. The warehouse has 3 units but the customer asked for 10. The card was declined. Those are four very different situations, and the caller must react differently to each one.",
          ar: "سنستخدم مثالاً واحداً طوال الدرس: endpoint اسمه POST /orders يأخذ sku (كود المنتج) و quantity و معرّف وسيلة الدفع. يمكن أن يفشل بأربع طرق مختلفة. الـ sku غير موجود. الـ quantity تساوي 0. المخزن فيه 3 قطع والعميل طلب 10. البطاقة رُفضت. هذه أربع حالات مختلفة تماماً، وعلى الـ caller أن يتصرف مع كل واحدة بشكل مختلف."
        },
        {
          t: "p",
          en: "Think of a pharmacy rejecting a prescription. If the pharmacist hands back a slip with a printed reason box — wrong dosage, drug out of stock, insurance refused — the front desk knows immediately which of the three procedures to run. If instead they hand back a handwritten note, someone has to read it and guess. An error contract is the printed reason box: a small fixed set of codes plus room for a human sentence. The code drives the decision; the sentence only helps a person who is already reading.",
          ar: "تخيّل صيدلية ترفض وصفة طبية. لو أعاد الصيدلي ورقة فيها خانة سبب مطبوعة — جرعة خاطئة، الدواء غير متوفر، التأمين رفض — يعرف الموظف فوراً أي إجراء من الثلاثة يطبّق. أما لو أعاد ملاحظة مكتوبة بخط اليد، فسيضطر أحدهم لقراءتها والتخمين. عقد الخطأ هو خانة السبب المطبوعة: مجموعة صغيرة ثابتة من الأكواد، مع مساحة لجملة موجهة للإنسان. الكود هو ما يقود القرار، والجملة تساعد فقط الشخص الذي يقرأ."
        },
        {
          t: "callout",
          kind: "note",
          en: "You do not have to use Problem Details. You do have to use one shape everywhere. Problem Details is worth choosing because it is already standard, ASP.NET Core produces it for you, and client libraries already know how to parse it.",
          ar: "لست مضطراً لاستخدام Problem Details. لكنك مضطر لاستخدام شكل واحد في كل مكان. واختيار Problem Details مفيد لأنه معيار جاهز، ولأن ASP.NET Core ينتجه لك، ولأن مكتبات الـ clients تعرف كيف تقرأه."
        }
      ]
    },
    {
      key: "problem",
      blocks: [
        {
          t: "p",
          en: "Without a contract, each endpoint invents its own error shape. In one real API the four POST /orders failures came back as four different bodies: a plain string, an object with a message field, an object with an errors array, and an HTML page from the web server when an unhandled exception escaped. The mobile app had to write four parsers for one endpoint.",
          ar: "بدون عقد، كل endpoint يخترع شكل خطئه الخاص. في API حقيقي رجعت حالات الفشل الأربع في POST /orders بأربعة bodies مختلفة: نص عادي، وكائن فيه حقل message، وكائن فيه مصفوفة errors، وصفحة HTML من الـ web server عندما هرب exception غير مُعالَج. اضطر تطبيق الموبايل لكتابة أربعة parsers لـ endpoint واحد."
        },
        {
          t: "p",
          en: "So the mobile team did the only thing left: they matched on English text, with code like if (body.message.Contains(\"stock\")). Six weeks later someone improved the wording from 'not enough stock' to 'insufficient inventory'. The server tests still passed, because the server behaviour did not change. The app stopped showing the 'choose a smaller quantity' screen and showed a generic failure instead. Checkout completion on mobile dropped by about 4 percent — meaning roughly 4 out of every 100 customers who reached checkout no longer finished it — and it took nine days to trace the cause.",
          ar: "فعل فريق الموبايل الشيء الوحيد المتبقّي: طابَقوا على النص الإنجليزي، بكود مثل if (body.message.Contains(\"stock\")). بعد ستة أسابيع حسّن أحدهم الصياغة من 'not enough stock' إلى 'insufficient inventory'. اختبارات الـ server ظلّت ناجحة لأن سلوك الـ server لم يتغيّر. لكن التطبيق توقّف عن عرض شاشة 'اختر كمية أقل' وعرض فشلاً عاماً بدلاً منها. انخفض إتمام الشراء على الموبايل بنحو 4 بالمئة — أي أن حوالي 4 من كل 100 عميل وصلوا لصفحة الدفع لم يعودوا يكملون — واستغرق تتبّع السبب تسعة أيام."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "Before: what the client sees", ar: "قبل: ما يراه الـ client" },
              v: {
                en: "A status code plus free text. To act on it the client must guess from wording, so any copy edit is a silent breaking change.",
                ar: "status code ونص حر. ليتصرف الـ client عليه عليه أن يخمّن من الصياغة، فيصبح أي تعديل لغوي كسراً صامتاً للتوافق."
              }
            },
            {
              k: { en: "After: what the client sees", ar: "بعد: ما يراه الـ client" },
              v: {
                en: "A status code, a stable code string, an optional per-field list, and a trace id. Wording can change freely because nothing branches on it.",
                ar: "status code، ونص code ثابت، وقائمة اختيارية لكل حقل، و trace id. يمكن تغيير الصياغة بحرية لأن لا شيء يتفرّع بناءً عليها."
              }
            },
            {
              k: { en: "Support cost", ar: "تكلفة الدعم" },
              v: {
                en: "Before, a ticket said 'it failed' and someone searched logs by timestamp. After, the user reads a trace id off the screen and one log query finds the exact request.",
                ar: "قبلاً كانت التذكرة تقول 'فشل' فيبحث أحدهم في الـ logs بالوقت. بعدها يقرأ المستخدم trace id من الشاشة، فيجد استعلام logs واحد الطلب المحدد."
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
          en: "In ASP.NET Core the error body is produced by one small object called ProblemDetails, and by a factory that fills it in. Nothing magical happens: something decides a request failed, builds a ProblemDetails, sets the status code, and writes JSON with the content type application/problem+json. Your job is to make sure every failure path goes through that one place.",
          ar: "في ASP.NET Core يُنتَج body الخطأ من كائن صغير اسمه ProblemDetails، ومن factory تملؤه. لا شيء سحري: جهة ما تقرر أن الطلب فشل، فتبني ProblemDetails، وتضبط الـ status code، وتكتب JSON بنوع محتوى application/problem+json. مهمتك أن تجعل كل مسارات الفشل تمرّ عبر هذا المكان الواحد."
        },
        {
          t: "kv",
          rows: [
            {
              k: { en: "ProblemDetails", ar: "ProblemDetails" },
              v: {
                en: "The built-in class holding type, title, status, detail, instance, plus an Extensions dictionary for your own fields.",
                ar: "الكلاس المدمج الذي يحمل type و title و status و detail و instance، بالإضافة إلى قاموس Extensions لحقولك الخاصة."
              }
            },
            {
              k: { en: "ValidationProblemDetails", ar: "ValidationProblemDetails" },
              v: {
                en: "A subclass that adds errors: a dictionary from field name to the list of messages about that field.",
                ar: "كلاس مشتق يضيف errors: قاموس من اسم الحقل إلى قائمة الرسائل الخاصة بذلك الحقل."
              }
            },
            {
              k: { en: "[ApiController]", ar: "[ApiController]" },
              v: {
                en: "An attribute on a controller. One thing it does: if model binding or data annotations fail, it returns 400 with ValidationProblemDetails automatically, before your method runs.",
                ar: "attribute يوضع على الـ controller. من مهامه: إذا فشل model binding أو data annotations، يعيد 400 مع ValidationProblemDetails تلقائياً قبل تنفيذ دالتك."
              }
            },
            {
              k: { en: "IExceptionHandler", ar: "IExceptionHandler" },
              v: {
                en: "An interface you implement to turn an unhandled exception into a response. Registered handlers run in order until one says it handled the exception.",
                ar: "واجهة تنفّذها لتحويل exception غير مُعالَج إلى response. تعمل الـ handlers المسجّلة بالترتيب حتى يقول أحدها إنه عالج الـ exception."
              }
            },
            {
              k: { en: "AddProblemDetails()", ar: "AddProblemDetails()" },
              v: {
                en: "One registration line that makes the framework write a Problem Details body for any bare status-code result, including 404 and 500.",
                ar: "سطر تسجيل واحد يجعل الـ framework يكتب body بصيغة Problem Details لأي نتيجة status code مجرّدة، بما فيها 404 و 500."
              }
            }
          ]
        },
        {
          t: "p",
          en: "Trace one POST /orders request with quantity 0, step by step. The request arrives and the JSON body is bound to your CreateOrderRequest object. The [Required] and [Range(1, 100)] attributes on quantity fail. Because the controller has [ApiController], the pipeline stops there: it builds a ValidationProblemDetails whose errors dictionary contains the key quantity mapped to one message, sets status 400, and writes it. Your action method is never entered. Now trace the third failure — stock is 3, the customer asked for 10. No attribute can catch that, because it depends on database state, so your own code detects it and returns a ProblemDetails you built, with status 409 and an extension field code set to insufficient_stock.",
          ar: "لنتتبّع طلب POST /orders مع quantity تساوي 0 خطوة بخطوة. يصل الطلب ويُربَط الـ JSON body بكائن CreateOrderRequest. تفشل الـ attributes التالية على quantity: ‏[Required] و [Range(1, 100)]. ولأن الـ controller يحمل [ApiController]، تتوقف الـ pipeline هناك: تبني ValidationProblemDetails يحتوي قاموس errors فيه المفتاح quantity مقابل رسالة واحدة، وتضبط الحالة 400، وتكتبه. دالتك لا تُنفَّذ أصلاً. الآن تتبّع الفشل الثالث — المخزون 3 والعميل طلب 10. لا يستطيع أي attribute التقاط ذلك لأنه يعتمد على حالة قاعدة البيانات، فيكتشفه كودك ويعيد ProblemDetails بنيته أنت، بحالة 409 وحقل إضافي اسمه code قيمته insufficient_stock."
        },
        {
          t: "p",
          en: "The fourth failure is the interesting one. The payment provider call throws a PaymentDeclinedException from deep inside a service class. Nobody catches it there, so it travels up the call stack until the exception handler middleware catches it. That handler is the single place that turns exceptions into responses: it looks at the exception type, picks a status code and a code string, hides the stack trace, and adds the trace id. Think of it as the returns desk at a shop — every unhappy customer, whatever went wrong upstairs, ends up at one counter that issues one standard slip.",
          ar: "الفشل الرابع هو الأكثر إفادة. استدعاء مزوّد الدفع يرمي PaymentDeclinedException من عمق كلاس service. لا أحد يلتقطه هناك، فيصعد عبر الـ call stack حتى يلتقطه exception handler middleware. ذلك الـ handler هو المكان الوحيد الذي يحوّل الـ exceptions إلى responses: ينظر إلى نوع الـ exception، ويختار status code ونص code، ويخفي الـ stack trace، ويضيف الـ trace id. اعتبره مكتب المرتجعات في متجر — كل عميل غير راضٍ، مهما كان ما حدث في الأعلى، ينتهي عند شبّاك واحد يصدر ورقة واحدة موحّدة."
        },
        {
          t: "code",
          lang: "csharp",
          label: { en: "One place that turns any exception into one shape", ar: "مكان واحد يحوّل أي exception إلى شكل واحد" },
          code: "// Program.cs\nbuilder.Services.AddProblemDetails();          // bare 404/500 also get a JSON body\nbuilder.Services.AddExceptionHandler<AppExceptionHandler>();\n\nvar app = builder.Build();\napp.UseExceptionHandler();                       // must come before endpoints\n\n// AppExceptionHandler.cs\npublic sealed class AppExceptionHandler(IProblemDetailsService svc) : IExceptionHandler\n{\n    public async ValueTask<bool> TryHandleAsync(\n        HttpContext ctx, Exception ex, CancellationToken ct)\n    {\n        var (status, code) = ex switch\n        {\n            InsufficientStockException => (StatusCodes.Status409Conflict, \"insufficient_stock\"),\n            PaymentDeclinedException   => (StatusCodes.Status402PaymentRequired, \"payment_declined\"),\n            OrderNotFoundException     => (StatusCodes.Status404NotFound, \"order_not_found\"),\n            _                          => (StatusCodes.Status500InternalServerError, \"internal_error\")\n        };\n\n        ctx.Response.StatusCode = status;\n\n        var problem = new ProblemDetails\n        {\n            Type   = $\"https://api.shop.com/errors/{code}\",\n            Title  = \"Order could not be created\",\n            Status = status,\n            // safe for a 4xx we authored; never ex.ToString() on a 500\n            Detail = status < 500 ? ex.Message : \"An unexpected error occurred.\"\n        };\n        problem.Extensions[\"code\"]    = code;\n        problem.Extensions[\"traceId\"] = Activity.Current?.Id ?? ctx.TraceIdentifier;\n\n        return await svc.TryWriteAsync(new()\n        {\n            HttpContext = ctx, ProblemDetails = problem, Exception = ex\n        });\n    }\n}"
        },
        {
          t: "code",
          lang: "json",
          label: { en: "What the client actually receives (409)", ar: "ما يستلمه الـ client فعلياً (409)" },
          code: "HTTP/1.1 409 Conflict\nContent-Type: application/problem+json\n\n{\n  \"type\": \"https://api.shop.com/errors/insufficient_stock\",\n  \"title\": \"Order could not be created\",\n  \"status\": 409,\n  \"detail\": \"Only 3 units of SKU-4417 are available.\",\n  \"instance\": \"/orders\",\n  \"code\": \"insufficient_stock\",\n  \"traceId\": \"00-8f3c1a9e2b7d4c51-9a1f2e3d4c5b6a70-01\",\n  \"available\": 3\n}"
        },
        {
          t: "p",
          en: "Two fields do the work. code is what the client branches on, and available: 3 is what lets the app offer 'buy 3 instead' without a second round trip. type is a URL used only as a unique identifier for this error kind; it is good practice to make it a page a developer can actually open, but the client never fetches it.",
          ar: "حقلان يقومان بالعمل. الحقل code هو ما يتفرّع عليه الـ client، والحقل available: 3 هو ما يتيح للتطبيق أن يعرض 'اشترِ 3 بدلاً منها' دون طلب إضافي. أما type فهو URL يُستخدم فقط كمعرّف فريد لنوع الخطأ؛ من الجيد أن يكون صفحة يستطيع المطوّر فتحها، لكن الـ client لا يطلبها أبداً."
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
              "One parser on the client instead of one per endpoint.",
              "Copy and translations can change without breaking any caller.",
              "A trace id in every failure turns vague tickets into one log query.",
              "The framework already produces the shape, so there is little code to write."
            ],
            ar: [
              "parser واحد على الـ client بدل واحد لكل endpoint.",
              "يمكن تغيير النصوص والترجمات دون كسر أي caller.",
              "وجود trace id في كل فشل يحوّل التذاكر الغامضة إلى استعلام logs واحد.",
              "الـ framework ينتج الشكل أصلاً، فالكود المطلوب قليل."
            ]
          },
          cons: {
            en: [
              "The list of code values becomes public API: renaming one breaks clients.",
              "Extra fields such as available must be documented or nobody uses them.",
              "Teams argue about status codes instead of shipping.",
              "A shared handler can hide a real bug by making every failure look tidy."
            ],
            ar: [
              "تصبح قائمة قيم code جزءاً من الـ API العامة: إعادة تسمية واحدة تكسر الـ clients.",
              "الحقول الإضافية مثل available يجب توثيقها وإلا لن يستخدمها أحد.",
              "الفرق تتجادل حول الـ status codes بدل أن تُطلق.",
              "الـ handler المشترك قد يخفي bug حقيقياً لأنه يجعل كل فشل يبدو مرتباً."
            ]
          },
          limits: {
            en: [
              "It does not tell you which status code is right — that is a separate decision.",
              "It does not help if callers ignore code and keep reading detail.",
              "Streaming and file responses may fail after headers are sent, where no body can be replaced.",
              "Third-party services you call will not use your shape; you must translate theirs."
            ],
            ar: [
              "لا يخبرك أي status code هو الصحيح — ذلك قرار منفصل.",
              "لا يفيد إذا تجاهل الـ callers حقل code وظلّوا يقرؤون detail.",
              "الـ streaming وردود الملفات قد تفشل بعد إرسال الترويسات، حيث لا يمكن استبدال الـ body.",
              "الخدمات الخارجية التي تستدعيها لن تستخدم شكلك، فعليك ترجمة شكلها."
            ]
          },
          alts: {
            en: [
              "Your own house format, documented once and used everywhere — acceptable if truly consistent.",
              "GraphQL, which returns 200 with an errors array by design.",
              "gRPC status codes plus rich error details messages.",
              "JSON:API error objects, if you already follow that specification."
            ],
            ar: [
              "صيغة داخلية خاصة بك، موثّقة مرة وتُستخدم في كل مكان — مقبولة إن كانت متسقة فعلاً.",
              "GraphQL الذي يعيد 200 مع مصفوفة errors بحكم تصميمه.",
              "أكواد حالة gRPC مع رسائل error details الغنية.",
              "كائنات الأخطاء في JSON:API إن كنت تتبع تلك المواصفة أصلاً."
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
          title: { en: "Returning 200 with success: false", ar: "إعادة 200 مع success: false" },
          body: {
            en: "An orders API always answered 200 and put the outcome in the body. Everything looked fine until the load balancer was configured to alert on 5xx rates: real failures never showed up, because there were none. A month later a bug made every order fail; the dashboard stayed green for six hours. The status code is the one part of the response that infrastructure — proxies, monitors, retry libraries — actually reads. Do not hide the outcome from it.",
            ar: "كانت API الطلبات تعيد 200 دائماً وتضع النتيجة في الـ body. بدا كل شيء سليماً حتى ضُبط الـ load balancer لينبّه على نسب 5xx: لم تظهر أي حالات فشل حقيقية لأنه لم يكن هناك أي منها. بعد شهر تسبّب bug في فشل كل الطلبات، وبقيت لوحة المراقبة خضراء ست ساعات. الـ status code هو الجزء الوحيد من الـ response الذي تقرؤه البنية التحتية فعلاً — الـ proxies والمراقبة ومكتبات إعادة المحاولة. لا تُخفِ النتيجة عنها."
          },
          fix: "// bad\nreturn Ok(new { success = false, message = \"Out of stock\" });\n\n// good\nreturn Problem(statusCode: 409, detail: \"Only 3 units available.\",\n               extensions: new Dictionary<string, object?> { [\"code\"] = \"insufficient_stock\" });"
        },
        {
          t: "mistake",
          title: { en: "Putting the exception into detail", ar: "وضع الـ exception داخل detail" },
          body: {
            en: "A handler wrote Detail = ex.ToString() so support could see what happened. That string contains the full stack trace, which lists internal class names, file paths and sometimes connection strings from an inner exception. A security review found the database server name in a 500 body served to the public internet. Return the generic sentence to the caller and log the full exception on the server, joined to the response by the trace id.",
            ar: "كتب أحد الـ handlers ‏Detail = ex.ToString() ليرى الدعم ما حدث. ذلك النص يحتوي الـ stack trace كاملاً، وفيه أسماء كلاسات داخلية ومسارات ملفات وأحياناً connection strings من inner exception. اكتشفت مراجعة أمنية اسم خادم قاعدة البيانات داخل body لـ 500 يُقدَّم للإنترنت العام. أعِد الجملة العامة للـ caller وسجّل الـ exception الكامل على الـ server، مربوطاً بالـ response عبر الـ trace id."
          },
          fix: "logger.LogError(ex, \"Order create failed. traceId={TraceId}\", traceId);\nproblem.Detail = \"An unexpected error occurred.\";\nproblem.Extensions[\"traceId\"] = traceId;"
        },
        {
          t: "mistake",
          title: { en: "A human sentence with no stable code", ar: "جملة للإنسان بلا code ثابت" },
          body: {
            en: "This is the failure from the start of the lesson. The body had only detail, so the client wrote if (detail.Contains(\"stock\")). Reworded copy silently broke the app while every server test still passed. Any value a caller branches on must be a fixed identifier you promise not to change. Anything a human reads must be free to change at any time. Never let one field be both.",
            ar: "هذا هو الفشل الذي بدأ به الدرس. احتوى الـ body على detail فقط، فكتب الـ client ‏if (detail.Contains(\"stock\")). أدّى تعديل الصياغة إلى كسر التطبيق بصمت بينما ظلّت كل اختبارات الـ server ناجحة. أي قيمة يتفرّع عليها الـ caller يجب أن تكون معرّفاً ثابتاً تتعهّد بعدم تغييره. وأي شيء يقرؤه الإنسان يجب أن يكون حراً في التغيير متى شئت. لا تجعل حقلاً واحداً يقوم بالدورين."
          }
        },
        {
          t: "mistake",
          title: { en: "Flattening validation errors into one string", ar: "دمج أخطاء التحقق في نص واحد" },
          body: {
            en: "A team joined all validation messages together: 'quantity must be at least 1; email is invalid'. The web form could not highlight the two bad inputs, so it showed one red banner at the top and the user had to hunt. Keep validation errors as a map from field name to messages, exactly as ValidationProblemDetails does, so the UI can attach each message to its own input.",
            ar: "دمج فريق كل رسائل التحقق معاً: 'quantity must be at least 1; email is invalid'. لم يستطع الـ form تمييز الحقلين الخاطئين، فعرض شريطاً أحمر واحداً في الأعلى واضطر المستخدم للبحث. احتفظ بأخطاء التحقق كخريطة من اسم الحقل إلى الرسائل، تماماً كما يفعل ValidationProblemDetails، حتى تستطيع الواجهة ربط كل رسالة بحقلها."
          },
          fix: "{\n  \"status\": 400,\n  \"errors\": {\n    \"quantity\": [\"Must be at least 1.\"],\n    \"email\": [\"Not a valid email address.\"]\n  }\n}"
        }
      ]
    },
    {
      key: "interview",
      blocks: [
        {
          t: "qa",
          level: "junior",
          q: {
            en: "What is Problem Details and why would you use it?",
            ar: "ما هو Problem Details ولماذا تستخدمه؟"
          },
          a: {
            en: "It is a small standard JSON shape for API errors, defined in RFC 9457 — an RFC is just a published spec. The body has type, title, status, detail and instance, and you can add your own fields. I use it because it gives every endpoint the same error shape, ASP.NET Core builds it for me, and the client only needs one parser instead of one per endpoint.",
            ar: "هو شكل JSON قياسي صغير لأخطاء الـ API، معرّف في RFC 9457 — والـ RFC مجرد مواصفة منشورة. يحتوي الـ body على type و title و status و detail و instance، ويمكنك إضافة حقولك. أستخدمه لأنه يعطي كل endpoint نفس شكل الخطأ، ولأن ASP.NET Core يبنيه لي، ولأن الـ client يحتاج parser واحداً بدل واحد لكل endpoint."
          }
        },
        {
          t: "qa",
          level: "mid",
          q: {
            en: "Your error body already has a message. Why add a code field too?",
            ar: "الـ body لديك فيه message أصلاً. لماذا تضيف حقل code أيضاً؟"
          },
          a: {
            en: "Because they have different owners and different rules. The message is for a person and changes whenever someone improves the copy or adds a translation. The code is for a program and must never change. If the client branches on the message, then editing text is a breaking change that no test catches — I have seen a copy edit cut mobile checkout by about four percent. Splitting the two fields lets the wording move freely.",
            ar: "لأن لهما مالكَين مختلفين وقواعد مختلفة. الـ message موجّه لشخص ويتغيّر كلما حسّن أحدهم الصياغة أو أضاف ترجمة. أما الـ code فموجّه لبرنامج ويجب ألّا يتغيّر أبداً. إذا تفرّع الـ client على الـ message، يصبح تعديل النص كسراً للتوافق لا يلتقطه أي اختبار — رأيت تعديلاً لغوياً يخفض إتمام الشراء على الموبايل بنحو أربعة بالمئة. فصل الحقلين يجعل الصياغة حرة في التغيير."
          }
        },
        {
          t: "qa",
          level: "mid",
          q: {
            en: "What do you put in the body of a 500, and what do you leave out?",
            ar: "ماذا تضع في body لـ 500، وماذا تستبعد؟"
          },
          a: {
            en: "In: status 500, a generic title and detail such as 'An unexpected error occurred', and a trace id. Out: the exception message, the stack trace, class or file names, and SQL. The reason is that a 500 means we do not know what happened, so anything specific we print is internal information the caller cannot act on anyway. The trace id is the bridge — the user reads it to support and one log search finds the full exception on our side.",
            ar: "أضع: الحالة 500، وعنواناً ووصفاً عامّين مثل 'حدث خطأ غير متوقع'، و trace id. وأستبعد: رسالة الـ exception، والـ stack trace، وأسماء الكلاسات أو الملفات، والـ SQL. السبب أن 500 تعني أننا لا نعرف ما حدث، فأي تفصيل نطبعه هو معلومة داخلية لا يستطيع الـ caller التصرف بناءً عليها. الـ trace id هو الجسر — يقرؤه المستخدم للدعم فيجد بحث logs واحد الـ exception الكامل عندنا."
          }
        },
        {
          t: "qa",
          level: "senior",
          q: {
            en: "How do you evolve an error contract without breaking existing clients?",
            ar: "كيف تطوّر عقد الأخطاء دون كسر الـ clients الحاليين؟"
          },
          a: {
            en: "I treat the set of code values like a public enum. Adding a new code is safe only if clients were written with a default branch, so I state that rule in the docs on day one. Adding a new extension field is always safe, because unknown JSON fields are ignored. Renaming or removing a code is breaking, so I keep the old code and add the new one alongside for a deprecation window, watch how many responses still carry the old one, and remove it when that number reaches zero.",
            ar: "أتعامل مع مجموعة قيم code كأنها enum عامة. إضافة code جديد آمنة فقط إذا كُتب الـ clients بفرع افتراضي، لذا أذكر هذه القاعدة في التوثيق من اليوم الأول. إضافة حقل extension جديد آمنة دائماً لأن حقول JSON غير المعروفة تُتجاهَل. أما إعادة التسمية أو الحذف فكسر، لذلك أُبقي الـ code القديم وأضيف الجديد بجانبه خلال فترة إهمال، وأراقب كم response ما زال يحمل القديم، وأحذفه عندما يصل ذلك العدد إلى صفر."
          }
        },
        {
          t: "qa",
          level: "senior",
          q: {
            en: "A downstream payment provider returns its own error format. What reaches your caller?",
            ar: "مزوّد دفع خارجي يعيد صيغة أخطاء خاصة به. ماذا يصل إلى الـ caller لديك؟"
          },
          a: {
            en: "Never their body. I translate at the boundary: the adapter that calls the provider maps their codes onto mine, so card_declined_51 becomes payment_declined and anything unrecognised becomes a generic upstream failure. Two reasons. Their codes are not my contract and can change without notice. And their body may contain data I am not allowed to pass on. I do keep their raw response in the log line with my trace id, so support can still see it.",
            ar: "لا يصل body الخاص بهم أبداً. أترجم عند الحدّ: الـ adapter الذي يستدعي المزوّد يحوّل أكوادهم إلى أكوادي، فيصبح card_declined_51 هو payment_declined، وأي شيء غير معروف يصبح فشلاً عاماً من الأعلى. لسببين: أكوادهم ليست عقدي وقد تتغيّر دون إشعار، و body الخاص بهم قد يحتوي بيانات لا يحق لي تمريرها. لكنني أحتفظ بردّهم الخام في سطر الـ log مع الـ trace id الخاص بي ليراه الدعم."
          }
        },
        {
          t: "qa",
          level: "staff",
          q: {
            en: "Eight teams, eight error shapes. How do you fix that across the organisation?",
            ar: "ثمانية فرق وثمانية أشكال أخطاء. كيف تحل ذلك على مستوى المؤسسة؟"
          },
          a: {
            en: "Not by sending a document. I ship a small shared package that contains the exception handler, the ProblemDetails builder and the trace id wiring, so following the standard is one line of setup and less work than not following it. Then I add a contract test in the shared pipeline that calls each service's known failure paths and asserts the shape, so drift is caught at build time. Then I publish the code registry as a real page teams add to by pull request. Finally I pick the two highest-traffic services and migrate them myself, because the rest copy whatever the busiest service does.",
            ar: "ليس بإرسال مستند. أُطلق package مشتركاً صغيراً يحوي exception handler وباني ProblemDetails وربط الـ trace id، فيصبح اتباع المعيار سطر إعداد واحداً وجهداً أقل من عدم اتباعه. ثم أضيف contract test في الـ pipeline المشترك يستدعي مسارات الفشل المعروفة لكل service ويتحقق من الشكل، فيُلتقط الانحراف وقت البناء. ثم أنشر سجلّ أكواد الأخطاء كصفحة حقيقية تضيف إليها الفرق عبر pull request. وأخيراً أختار أكثر خدمتين حركةً وأنقلهما بنفسي، لأن البقية تقلّد ما تفعله الخدمة الأكثر استخداماً."
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
          title: { en: "Catch-all that swallows the failure and the status", ar: "catch شامل يبتلع الفشل والحالة" },
          bad: "try\n{\n    return Ok(await _orders.CreateAsync(req, ct));\n}\ncatch (Exception ex)\n{\n    _logger.LogError(ex.Message);\n    return Ok(new { success = false, error = ex.Message });\n}",
          good: "// no try/catch here at all — one handler owns this\n// Program.cs: AddProblemDetails(); AddExceptionHandler<AppExceptionHandler>(); UseExceptionHandler();\nreturn Ok(await _orders.CreateAsync(req, ct));",
          why: {
            en: "Three problems in six lines. The response is 200, so monitoring and retry libraries treat a failure as a success. ex.Message may carry internal details straight to the caller. And LogError(ex.Message) drops the exception object, so the stack trace never reaches the logs — the one place it belongs. Deleting the block and letting the shared handler run fixes all three.",
            ar: "ثلاث مشاكل في ستة أسطر. الرد 200، فتعامل أدوات المراقبة ومكتبات إعادة المحاولة الفشلَ على أنه نجاح. و ex.Message قد يحمل تفاصيل داخلية مباشرة إلى الـ caller. و LogError(ex.Message) يُسقط كائن الـ exception، فلا يصل الـ stack trace إلى الـ logs — وهو المكان الوحيد الذي ينتمي إليه. حذف الكتلة وترك الـ handler المشترك يعمل يصلح الثلاثة."
          }
        },
        {
          t: "review",
          severity: "medium",
          title: { en: "A hand-rolled error object per endpoint", ar: "كائن خطأ يدوي لكل endpoint" },
          bad: "if (stock < req.Quantity)\n    return BadRequest(new { error = \"not enough stock\", have = stock });",
          good: "if (stock < req.Quantity)\n    return Problem(\n        statusCode: StatusCodes.Status409Conflict,\n        title: \"Order could not be created\",\n        detail: $\"Only {stock} units of {req.Sku} are available.\",\n        extensions: new Dictionary<string, object?>\n        {\n            [\"code\"] = \"insufficient_stock\",\n            [\"available\"] = stock\n        });",
          why: {
            en: "The bad version invents a fourth error shape — field named error, no code, no trace id — and uses 400, which says the request was malformed. It was not: it was valid and lost a race against other buyers, which is what 409 Conflict means. Problem() emits the same shape as every other failure in the service, and available lets the app offer a smaller quantity without another call.",
            ar: "النسخة السيئة تخترع شكل خطأ رابعاً — حقل اسمه error، بلا code وبلا trace id — وتستخدم 400 التي تعني أن الطلب مُشوَّه. وهو لم يكن كذلك: كان صحيحاً لكنه خسر سباقاً أمام مشترين آخرين، وهذا بالضبط معنى 409 Conflict. الدالة Problem() تُخرج نفس شكل بقية حالات الفشل في الخدمة، والحقل available يتيح للتطبيق اقتراح كمية أقل دون استدعاء آخر."
          }
        }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        {
          t: "p",
          en: "In a system with several services behind one gateway, the error contract is the only thing a caller sees of your internal structure. The order service calls inventory, pricing and payments. Each of those can fail. If each failure leaks upward in its own format, the mobile app effectively depends on your service topology, and splitting a service becomes a client-visible change.",
          ar: "في نظام فيه عدة services خلف gateway واحد، عقد الأخطاء هو الشيء الوحيد الذي يراه الـ caller من بنيتك الداخلية. خدمة الطلبات تستدعي المخزون والتسعير والمدفوعات، وكل واحدة قد تفشل. إذا تسرّب كل فشل إلى الأعلى بصيغته الخاصة، يصبح تطبيق الموبايل معتمداً فعلياً على توزيع خدماتك، ويتحوّل تقسيم خدمة إلى تغيير يراه الـ client."
        },
        {
          t: "ul",
          en: [
            "Translate at every boundary: the adapter that calls another service maps its errors onto your codes before returning.",
            "Put the trace id into the response and into every log line, so one identifier links the failure the user saw to the service that caused it.",
            "Keep a single registry of code values, owned like a database schema — additions by pull request, removals only after a deprecation window.",
            "Decide the gateway's behaviour for a timeout to a backend service once: usually 504 with an upstream_timeout code, never a 200 or a bare 500.",
            "For a public API, publish the code list and the extension fields as documentation; partners cannot handle errors they cannot look up."
          ],
          ar: [
            "ترجم عند كل حدّ: الـ adapter الذي يستدعي خدمة أخرى يحوّل أخطاءها إلى أكوادك قبل الإرجاع.",
            "ضع الـ trace id في الـ response وفي كل سطر log، فيربط معرّف واحد بين الفشل الذي رآه المستخدم والخدمة التي سبّبته.",
            "احتفظ بسجل واحد لقيم code، مملوك كما يُملك schema قاعدة بيانات — الإضافة عبر pull request والحذف بعد فترة إهمال فقط.",
            "قرّر مرة واحدة سلوك الـ gateway عند انتهاء مهلة خدمة خلفية: عادةً 504 مع code اسمه upstream_timeout، لا 200 ولا 500 مجرّدة.",
            "في API عامة، انشر قائمة الأكواد والحقول الإضافية كتوثيق؛ الشركاء لا يستطيعون معالجة أخطاء لا يجدون شرحها."
          ]
        },
        {
          t: "callout",
          kind: "tip",
          en: "Write the error contract into the OpenAPI description of every endpoint, not just the success response. OpenAPI is the machine-readable description of your API; client code generators read it, so documented errors turn into typed client code for free.",
          ar: "اكتب عقد الأخطاء داخل وصف OpenAPI لكل endpoint، لا في رد النجاح فقط. الـ OpenAPI هو الوصف القابل للقراءة آلياً لـ API لديك، ومولّدات كود الـ clients تقرؤه، فتتحوّل الأخطاء الموثّقة إلى كود client مكتوب الأنواع بلا جهد."
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
                en: "Building and serialising a ProblemDetails costs a few microseconds — nothing. Throwing the exception that caused it costs far more, so on a hot validation path prefer returning a result over throwing.",
                ar: "بناء ProblemDetails وتحويله إلى JSON يكلّف بضعة microseconds — لا شيء. أما رمي الـ exception الذي سبّبه فيكلّف أكثر بكثير، لذا في مسار تحقق كثيف التنفيذ فضّل إعادة نتيجة على الرمي."
              }
            },
            {
              k: { en: "Network", ar: "Network" },
              v: {
                en: "Error bodies are small, but a validation body listing 200 rows of a bulk import can reach hundreds of kilobytes. Cap the number of reported field errors, for example the first 50.",
                ar: "أجسام الأخطاء صغيرة، لكن body تحقق يسرد 200 صف من استيراد جماعي قد يصل إلى مئات الكيلوبايت. حُدّ عدد أخطاء الحقول المُبلَّغ عنها، مثلاً أول 50."
              }
            },
            {
              k: { en: "Latency", ar: "Latency" },
              v: {
                en: "A clear code lets the client stop immediately instead of retrying. Returning 500 for something the client can never fix turns one failed call into three, tripling the time the user waits.",
                ar: "الـ code الواضح يجعل الـ client يتوقف فوراً بدل إعادة المحاولة. إعادة 500 لشيء لا يستطيع الـ client إصلاحه أبداً تحوّل استدعاءً فاشلاً واحداً إلى ثلاثة، فتتضاعف مدة انتظار المستخدم ثلاث مرات."
              }
            },
            {
              k: { en: "Scalability", ar: "Scalability" },
              v: {
                en: "Codes that say 'do not retry' — such as payment_declined — protect a struggling service. Ambiguous 500s invite every client to retry at once, which is how a small outage becomes a large one.",
                ar: "الأكواد التي تقول 'لا تُعِد المحاولة' — مثل payment_declined — تحمي خدمة مُجهدة. أما أكواد 500 الغامضة فتدعو كل الـ clients لإعادة المحاولة في وقت واحد، وهكذا يتحوّل عطل صغير إلى عطل كبير."
              }
            },
            {
              k: { en: "Memory", ar: "Memory" },
              v: {
                en: "Nothing meaningful for the response itself. Watch instead for handlers that keep the full exception object in a cache or an in-memory list to 'report later'; those hold whole object graphs alive.",
                ar: "لا شيء يُذكر بخصوص الـ response نفسه. راقب بدلاً من ذلك الـ handlers التي تحتفظ بكائن الـ exception الكامل في cache أو قائمة بالذاكرة كي 'تبلّغ لاحقاً'؛ فهي تُبقي رسوم كائنات كاملة حيّة."
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
            "curl -i https://api/orders -d '{...}' — the -i flag prints headers; check the status line and that Content-Type is application/problem+json, not text/html.",
            "Search your logs for the traceId from the response body; you should land on exactly one request and its full exception, with no guessing by timestamp.",
            "A metric counting responses grouped by the code field — a sudden spike in one code names the broken dependency before anyone opens a dashboard.",
            "In the browser network tab, open the failing call and read the response body; an HTML error page there means the exception escaped your handler entirely.",
            "A test that calls each known failure path and asserts status, code and the presence of traceId — run it in CI so a new endpoint cannot invent its own shape."
          ],
          ar: [
            "curl -i https://api/orders -d '{...}' — الخيار -i يطبع الترويسات؛ تحقّق من سطر الحالة وأن Content-Type هو application/problem+json لا text/html.",
            "ابحث في الـ logs عن الـ traceId الموجود في body الرد؛ يجب أن تصل إلى طلب واحد بالضبط مع exception كامل، دون تخمين بالوقت.",
            "مقياس يعدّ الردود مجمّعة حسب حقل code — ارتفاع مفاجئ في code واحد يسمّي التبعية المعطلة قبل أن يفتح أحد لوحة مراقبة.",
            "في تبويب الشبكة بالمتصفح، افتح الاستدعاء الفاشل واقرأ body الرد؛ ظهور صفحة HTML هناك يعني أن الـ exception هرب من الـ handler تماماً.",
            "اختبار يستدعي كل مسار فشل معروف ويتحقق من status و code ووجود traceId — شغّله في الـ CI حتى لا يخترع endpoint جديد شكله الخاص."
          ]
        },
        {
          t: "callout",
          kind: "tip",
          en: "If a 500 appears as an HTML page rather than JSON, the exception happened outside your handler. The two usual causes are middleware registered before UseExceptionHandler, and a failure that occurs after the response headers were already sent — at that point the status is fixed and no body can replace it.",
          ar: "إذا ظهر الخطأ 500 كصفحة HTML بدل JSON، فالـ exception حدث خارج الـ handler لديك. السببان المعتادان: middleware مسجّل قبل UseExceptionHandler، وفشل يقع بعد إرسال ترويسات الرد — عندها تكون الحالة قد ثُبّتت ولا يمكن استبدال الـ body."
        }
      ]
    },
    {
      key: "realworld",
      blocks: [
        {
          t: "p",
          en: "The value of an error contract scales with the number of things that must react to a failure automatically. A single web app with one screen can survive on free text. As soon as retries, queues, partner integrations or money are involved, a failure has to be classified in code, and that is exactly what a stable code field gives you.",
          ar: "قيمة عقد الأخطاء تكبر بعدد الأشياء التي يجب أن تستجيب للفشل تلقائياً. تطبيق ويب واحد بشاشة واحدة قد يعيش على نص حر. لكن بمجرد دخول إعادة المحاولة والطوابير وتكاملات الشركاء والمال، يصبح لزاماً تصنيف الفشل في الكود، وهذا بالضبط ما يمنحه حقل code الثابت."
        },
        {
          t: "ul",
          en: [
            "Payment platforms: a declined card must never be retried, while a gateway timeout must be — and only a code can tell the two apart, since both look like 'the payment did not go through'.",
            "E-commerce checkout: an out-of-stock conflict drives a specific screen offering the available quantity, so the extension field carrying that number is part of the feature, not decoration.",
            "Partner and public APIs: integrators write their handling once against your documented code list; every undocumented shape becomes a support ticket you pay for.",
            "Background job and queue workers: the consumer decides between retry, dead-letter and drop purely from the classification, because no human is watching at the moment of failure."
          ],
          ar: [
            "منصات الدفع: البطاقة المرفوضة يجب ألّا يُعاد المحاولة عليها، بينما انتهاء مهلة الـ gateway يجب إعادة المحاولة عليه — ولا يفرّق بينهما إلا الـ code، لأن الاثنين يبدوان كـ 'الدفعة لم تنجح'.",
            "الشراء الإلكتروني: تعارض نفاد المخزون يقود شاشة محددة تعرض الكمية المتاحة، فالحقل الإضافي الذي يحمل ذلك الرقم جزء من الميزة لا زينة.",
            "APIs الشركاء والعامة: يكتب المتكاملون معالجتهم مرة واحدة اعتماداً على قائمة أكوادك الموثّقة؛ وكل شكل غير موثّق يتحول إلى تذكرة دعم تدفع ثمنها.",
            "عمّال المهام الخلفية والطوابير: يقرر المستهلك بين إعادة المحاولة والـ dead-letter والإسقاط من التصنيف وحده، لأن لا أحد يراقب لحظة الفشل."
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
          en: "Add AddProblemDetails() to a minimal ASP.NET Core API and request a route that does not exist. Prove you got it right when the 404 comes back with Content-Type application/problem+json and a JSON body, instead of an empty response.",
          ar: "أضف AddProblemDetails() إلى ASP.NET Core API بسيط ثم اطلب مساراً غير موجود. يثبت نجاحك أن الرد 404 يعود بـ Content-Type يساوي application/problem+json ومع body بصيغة JSON، بدل رد فارغ."
        },
        {
          t: "ex",
          diff: "medium",
          en: "Implement POST /orders with all four failures from this lesson: unknown sku, quantity 0, stock lower than requested, payment declined. Prove you got it right when all four responses share the same field names, each carries a different code, and the status codes are 404, 400, 409 and 402.",
          ar: "نفّذ POST /orders بحالات الفشل الأربع في هذا الدرس: sku غير معروف، و quantity تساوي 0، ومخزون أقل من المطلوب، ودفع مرفوض. يثبت نجاحك أن الردود الأربعة تتشارك أسماء الحقول نفسها، وأن لكل واحد code مختلفاً، وأن الحالات هي 404 و 400 و 409 و 402."
        },
        {
          t: "ex",
          diff: "hard",
          en: "Write an IExceptionHandler that maps exception types to status and code, hides details for 5xx, and adds a traceId. Prove you got it right when a deliberately thrown NullReferenceException returns a 500 whose body contains no type or method name, while the server log contains the full stack trace under the same traceId.",
          ar: "اكتب IExceptionHandler يحوّل أنواع الـ exceptions إلى status و code، ويخفي التفاصيل في أخطاء 5xx، ويضيف traceId. يثبت نجاحك أن NullReferenceException مرميّاً عمداً يعيد 500 لا يحتوي body الخاص به أي اسم نوع أو دالة، بينما يحتوي log الخادم الـ stack trace كاملاً تحت نفس الـ traceId."
        },
        {
          t: "ex",
          diff: "senior",
          en: "Write an integration test that walks every endpoint's documented failure paths and asserts the shape: correct status, a code from the allowed list, a present traceId, and no stack trace text. Then add a new endpoint that returns a hand-rolled error object. Prove you got it right when the test fails on that endpoint without anyone editing the test.",
          ar: "اكتب integration test يمرّ على مسارات الفشل الموثّقة لكل endpoint ويتحقق من الشكل: الحالة الصحيحة، و code من القائمة المسموحة، ووجود traceId، وخلوّ النص من stack trace. ثم أضف endpoint جديداً يعيد كائن خطأ يدوياً. يثبت نجاحك أن الاختبار يفشل عند ذلك الـ endpoint دون أن يعدّل أحد الاختبار."
        }
      ]
    },
    {
      key: "refs",
      blocks: [
        {
          t: "ref",
          label: { en: "RFC 9457 — Problem Details for HTTP APIs", ar: "RFC 9457 — Problem Details for HTTP APIs" },
          url: "https://www.rfc-editor.org/rfc/rfc9457.html",
          meta: { en: "Specification", ar: "مواصفة" }
        },
        {
          t: "ref",
          label: { en: "Handle errors in ASP.NET Core web APIs", ar: "معالجة الأخطاء في ASP.NET Core web APIs" },
          url: "https://learn.microsoft.com/en-us/aspnet/core/web-api/handle-errors",
          meta: { en: "Docs", ar: "توثيق" }
        },
        {
          t: "ref",
          label: { en: "Handle errors in ASP.NET Core (middleware and IExceptionHandler)", ar: "معالجة الأخطاء في ASP.NET Core (الـ middleware و IExceptionHandler)" },
          url: "https://learn.microsoft.com/en-us/aspnet/core/fundamentals/error-handling",
          meta: { en: "Docs", ar: "توثيق" }
        },
        {
          t: "ref",
          label: { en: "Zalando RESTful API Guidelines — error handling", ar: "إرشادات Zalando لـ RESTful API — معالجة الأخطاء" },
          url: "https://opensource.zalando.com/restful-api-guidelines/",
          meta: { en: "Guidelines", ar: "إرشادات" }
        }
      ]
    }
  ],
  quiz: [
    {
      q: {
        en: "Why should a client branch on a code field instead of the human message?",
        ar: "لماذا يتفرّع الـ client على حقل code بدل الرسالة الموجهة للإنسان؟"
      },
      options: [
        { en: "The message field is optional in RFC 9457", ar: "حقل الرسالة اختياري في RFC 9457" },
        { en: "Wording changes for copy edits and translations, silently breaking the client", ar: "الصياغة تتغيّر بتعديلات النصوص والترجمات، فتكسر الـ client بصمت" },
        { en: "String comparison is too slow at high traffic", ar: "مقارنة النصوص بطيئة جداً عند الحركة العالية" },
        { en: "The message is not sent over HTTPS", ar: "الرسالة لا تُرسَل عبر HTTPS" }
      ],
      correct: 1,
      why: {
        en: "The message exists for people and must be free to change. The code is a promise to programs. If one field does both jobs, a copy edit becomes a breaking change that no server test catches.",
        ar: "الرسالة موجودة للبشر ويجب أن تكون حرة في التغيير. أما الـ code فهو وعد للبرامج. وإذا قام حقل واحد بالدورين، يصبح تعديل لغوي كسراً للتوافق لا يلتقطه أي اختبار على الـ server."
      }
    },
    {
      q: {
        en: "What belongs in the body of a 500 response?",
        ar: "ما الذي ينتمي إلى body لرد 500؟"
      },
      options: [
        { en: "The exception message and stack trace, so support can debug", ar: "رسالة الـ exception والـ stack trace ليتمكن الدعم من التشخيص" },
        { en: "Nothing at all; a 500 should have an empty body", ar: "لا شيء إطلاقاً؛ يجب أن يكون body الـ 500 فارغاً" },
        { en: "A generic message plus a trace id that maps to the full server log", ar: "رسالة عامة مع trace id يقود إلى سطر الـ log الكامل على الخادم" },
        { en: "The SQL statement that failed, so the caller can fix its input", ar: "جملة الـ SQL التي فشلت ليصلح الـ caller مدخلاته" }
      ],
      correct: 2,
      why: {
        en: "A 500 means the server does not know what went wrong, so specifics only leak internal information the caller cannot act on. The trace id links the user's failure to the full exception stored safely in the logs.",
        ar: "الحالة 500 تعني أن الخادم لا يعرف ما الخطأ، فأي تفاصيل تسرّب معلومات داخلية لا يستطيع الـ caller التصرف بناءً عليها. والـ trace id يربط فشل المستخدم بالـ exception الكامل المحفوظ بأمان في الـ logs."
      }
    },
    {
      q: {
        en: "The warehouse has 3 units and the customer ordered 10. Which status best fits?",
        ar: "المخزن فيه 3 قطع والعميل طلب 10. أي status هو الأنسب؟"
      },
      options: [
        { en: "400 Bad Request", ar: "400 Bad Request" },
        { en: "409 Conflict", ar: "409 Conflict" },
        { en: "500 Internal Server Error", ar: "500 Internal Server Error" },
        { en: "200 OK with success: false", ar: "200 OK مع success: false" }
      ],
      correct: 1,
      why: {
        en: "The request itself was valid, so 400 is wrong. Nothing broke on the server, so 500 is wrong. The request clashed with the current state of the system — which is exactly what 409 Conflict describes — and the same request could succeed later once stock is restocked.",
        ar: "الطلب نفسه كان صحيحاً، فـ 400 خاطئة. ولم يتعطل شيء على الخادم، فـ 500 خاطئة. الطلب تعارض مع الحالة الحالية للنظام — وهذا بالضبط ما تصفه 409 Conflict — ونفس الطلب قد ينجح لاحقاً بعد إعادة تعبئة المخزون."
      }
    },
    {
      q: {
        en: "Which change to an existing error contract is safe for clients that already ignore unknown fields?",
        ar: "أي تغيير على عقد أخطاء قائم يُعد آمناً لـ clients تتجاهل الحقول غير المعروفة؟"
      },
      options: [
        { en: "Renaming code values to be more descriptive", ar: "إعادة تسمية قيم code لتكون أوضح" },
        { en: "Adding a new extension field such as available", ar: "إضافة حقل extension جديد مثل available" },
        { en: "Changing a 409 to a 400 for the same failure", ar: "تغيير 409 إلى 400 لنفس حالة الفشل" },
        { en: "Removing the traceId field to shrink the body", ar: "حذف حقل traceId لتصغير الـ body" }
      ],
      correct: 1,
      why: {
        en: "Adding a field is additive: parsers that ignore unknown JSON keys keep working, and clients adopt it when ready. Renaming a code, changing a status, or removing a field all change something an existing client may depend on.",
        ar: "إضافة حقل عملية إضافية بحتة: الـ parsers التي تتجاهل مفاتيح JSON غير المعروفة تستمر في العمل، ويتبنّاه الـ clients عند الجاهزية. أما إعادة تسمية code أو تغيير status أو حذف حقل فكلها تغيّر شيئاً قد يعتمد عليه client قائم."
      }
    },
    {
      q: {
        en: "A 500 comes back as an HTML page instead of JSON. What is the most likely cause?",
        ar: "يعود الخطأ 500 كصفحة HTML بدل JSON. ما السبب الأرجح؟"
      },
      options: [
        { en: "AddProblemDetails() was called twice", ar: "استُدعيت AddProblemDetails() مرتين" },
        { en: "The client did not send an Accept header", ar: "لم يرسل الـ client ترويسة Accept" },
        { en: "The exception happened outside the exception handler, for example in earlier middleware or after headers were sent", ar: "حدث الـ exception خارج exception handler، مثلاً في middleware أسبق أو بعد إرسال الترويسات" },
        { en: "ProblemDetails cannot serialise exceptions", ar: "لا يستطيع ProblemDetails تحويل الـ exceptions إلى JSON" }
      ],
      correct: 2,
      why: {
        en: "Your handler can only shape failures that reach it. Middleware registered before UseExceptionHandler runs outside its protection, and once response headers have been sent the status is fixed and no body can be substituted — so the host writes its default page.",
        ar: "الـ handler لديك يستطيع تشكيل حالات الفشل التي تصل إليه فقط. الـ middleware المسجّل قبل UseExceptionHandler يعمل خارج حمايته، وبمجرد إرسال ترويسات الرد تُثبَّت الحالة ولا يمكن استبدال الـ body — فيكتب المضيف صفحته الافتراضية."
      }
    }
  ]
};
```

NEXT: status-choose
