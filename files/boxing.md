```js
const boxingLesson = {
  id: "boxing",
  moduleId: "runtime",
  title: { en: "Boxing and its cost", ar: "الـ boxing وتكلفته" },
  summary: {
    en: "What the runtime does when a value type has to become an object, where it happens without you asking, and when the cost is real.",
    ar: "ما الذي يفعله الـ runtime عندما يضطر value type لأن يصبح object، وأين يحدث ذلك دون أن تطلبه، ومتى تكون التكلفة حقيقية."
  },
  mins: 12,
  sections: [
    {
      key: "why",
      blocks: [
        { t: "p",
          en: "Boxing is what happens when a value type has to be treated as an object. The runtime allocates a small block on the heap, copies the value into it, and hands you a reference to that block. It exists because C# has two kinds of types but one shared base type called object, and value types do not naturally fit that shape.",
          ar: "الـ boxing هو ما يحدث عندما يُطلب من value type أن يُعامَل كـ object. الـ runtime يحجز كتلة صغيرة على الـ heap، وينسخ القيمة داخلها، ويعطيك reference لتلك الكتلة. وهو موجود لأن C# فيها نوعان من الأنواع لكن base type واحد مشترك اسمه object، والـ value types لا تناسب هذا الشكل بطبيعتها."
        },
        { t: "kv", rows: [
          { k: { en: "Value type", ar: "Value type" },
            v: { en: "A type whose variable holds the data itself: int, double, bool, DateTime, any struct, any enum. Assigning it copies the data.", ar: "نوع يحمل متغيّره البيانات نفسها: int و double و bool و DateTime وأي struct وأي enum. الإسناد ينسخ البيانات." } },
          { k: { en: "Reference type", ar: "Reference type" },
            v: { en: "A type whose variable holds an address pointing to data on the heap: any class, string, array. Assigning it copies the address only.", ar: "نوع يحمل متغيّره عنواناً يشير إلى بيانات على الـ heap: أي class و string و array. الإسناد ينسخ العنوان فقط." } },
          { k: { en: "Heap", ar: "Heap" },
            v: { en: "The memory area the runtime allocates objects in. It is cleaned up automatically by the garbage collector (GC), not when a method returns.", ar: "منطقة الذاكرة التي يحجز فيها الـ runtime الـ objects. يُنظّفها الـ garbage collector (GC) تلقائياً، وليس عند خروج الدالة." } },
          { k: { en: "Boxing", ar: "Boxing" },
            v: { en: "Copying a value type into a new heap object so it can be used where an object or an interface is expected.", ar: "نسخ value type داخل object جديد على الـ heap ليمكن استخدامه حيث يُتوقّع object أو interface." } },
          { k: { en: "Unboxing", ar: "Unboxing" },
            v: { en: "Reading the value back out of that heap object into a value-type variable. It checks the type first and throws InvalidCastException if it is wrong.", ar: "قراءة القيمة مرة أخرى من ذلك الـ object على الـ heap داخل متغيّر value type. يتحقق من النوع أولاً ويرمي InvalidCastException إن كان خاطئاً." } },
          { k: { en: "Allocation", ar: "Allocation" },
            v: { en: "Reserving a piece of the heap for a new object. Cheap on its own; the cost arrives later when the GC has to collect it.", ar: "حجز جزء من الـ heap لـ object جديد. رخيص بحد ذاته؛ التكلفة تأتي لاحقاً عندما يضطر الـ GC لجمعه." } }
        ]},
        { t: "p",
          en: "Think of an int as a coin in your hand. You can pass it to someone by simply handing over an identical coin. An object is different: it is a coin sitting in a labelled envelope in a warehouse, and what you pass around is the label. Boxing is the moment someone insists on receiving a label, so the runtime puts your coin in a fresh envelope, writes a label, and gives you the label. The coin in your hand is untouched. That last part matters: the box holds a copy, not your original.",
          ar: "تخيّل أن الـ int عملة معدنية في يدك. يمكنك تمريرها لشخص آخر بإعطائه عملة مطابقة. الـ object مختلف: عملة موضوعة داخل ظرف مُعنوَن في مستودع، وما تمرّره هو العنوان. الـ boxing هو اللحظة التي يصرّ فيها أحدهم على استلام عنوان، فيضع الـ runtime عملتك في ظرف جديد، ويكتب عنواناً، ويعطيك العنوان. العملة التي في يدك لم تتغيّر. هذه النقطة الأخيرة مهمة: الـ box يحمل نسخة، لا الأصل."
        },
        { t: "p",
          en: "This design comes from the first version of .NET, before generics existed. Collections like ArrayList stored object, so putting an int in a list meant boxing it, and reading it back meant unboxing. Generics arrived in .NET 2.0 and removed most of that pain: List<int> stores raw ints with no boxes. But the boxing machinery is still in the runtime, and modern code still triggers it — usually by accident, through an interface, a logging call, or a struct that forgot to implement one method.",
          ar: "هذا التصميم يعود لأول إصدار من .NET، قبل وجود الـ generics. الـ collections مثل ArrayList كانت تخزّن object، فوضع int في قائمة كان يعني boxing له، وقراءته تعني unboxing. وصلت الـ generics في .NET 2.0 وأزالت معظم هذا الألم: List<int> تخزّن ints خام بلا صناديق. لكن آلية الـ boxing ما زالت في الـ runtime، والكود الحديث ما زال يُشغّلها — غالباً بالخطأ، عبر interface أو استدعاء logging أو struct نسي أن ينفّذ دالة واحدة."
        },
        { t: "callout", kind: "note",
          en: "Boxing is not a bug and not always bad. One box in a request that runs ten times a minute costs nothing measurable. The lesson is about spotting the cases where it happens tens of thousands of times a second, because those are the ones that show up in a latency graph.",
          ar: "الـ boxing ليس خطأً وليس سيئاً دائماً. box واحد في request يعمل عشر مرات في الدقيقة لا يكلّف شيئاً قابلاً للقياس. هذا الدرس عن اكتشاف الحالات التي يحدث فيها عشرات الآلاف من المرات في الثانية، لأنها هي التي تظهر في رسم الـ latency."
        }
      ]
    },
    {
      key: "problem",
      blocks: [
        { t: "p",
          en: "Here is the running example for this lesson. An order intake endpoint, POST /orders, receives an order with about 200 line items. An old helper class parses the quantities into an ArrayList — a list that stores everything as object — and then loops over it to compute a total. The service handles 500 requests per second, so that loop runs 100,000 times a second, and every single iteration creates one box.",
          ar: "هذا هو المثال الذي سنتابعه طوال الدرس. endpoint لاستقبال الطلبات، POST /orders، يستقبل طلباً فيه نحو 200 line item. class مساعد قديم يحوّل الكميات إلى ArrayList — قائمة تخزّن كل شيء كـ object — ثم يدور عليها لحساب المجموع. الخدمة تخدم 500 request في الثانية، أي أن الحلقة تعمل 100,000 مرة في الثانية، وكل تكرار يُنشئ box واحداً."
        },
        { t: "code", lang: "csharp", label: { en: "The version that allocates", ar: "النسخة التي تحجز ذاكرة" },
          code: "// Legacy helper still used by POST /orders\nArrayList quantities = ParseQuantities(request);  // stores each int as object\n\nint total = 0;\nforeach (object q in quantities)   // each element is already a box\n{\n    total += (int)q;               // unboxing: read the int back out\n}\n"
        },
        { t: "kv", rows: [
          { k: { en: "Boxes per request", ar: "عدد الـ boxes لكل request" },
            v: { en: "200 — one per line item. At 500 requests per second that is 100,000 boxes every second.", ar: "200 — واحد لكل line item. عند 500 request في الثانية يصبح ذلك 100,000 box كل ثانية." } },
          { k: { en: "Size of one box", ar: "حجم الـ box الواحد" },
            v: { en: "24 bytes on 64-bit .NET for a boxed int, even though the int itself is 4 bytes. The rest is object bookkeeping.", ar: "24 بايت على .NET بـ 64-bit لـ int مُغلَّف، رغم أن الـ int نفسه 4 بايت. الباقي هو بيانات إدارية للـ object." } },
          { k: { en: "Garbage produced", ar: "القمامة المُنتَجة" },
            v: { en: "About 2.4 MB per second of short-lived objects from this one loop — memory the GC must find and reclaim.", ar: "نحو 2.4 ميغابايت في الثانية من objects قصيرة العمر من هذه الحلقة وحدها — ذاكرة على الـ GC أن يجدها ويستعيدها." } },
          { k: { en: "Measured effect", ar: "الأثر المقاس" },
            v: { en: "Gen0 collections went from 6 to 14 per second, and p99 latency from 12 ms to 21 ms — meaning the slowest 1 request in 100 got 9 ms slower.", ar: "ارتفعت دورات Gen0 من 6 إلى 14 في الثانية، وارتفع p99 من 12 إلى 21 ميلي ثانية — أي أن أبطأ request من كل 100 صار أبطأ بـ 9 ميلي ثانية." } }
        ]},
        { t: "p",
          en: "Gen0 is the youngest part of the heap, where new small objects land, and a Gen0 collection is the quick sweep the GC runs over it. Each sweep is short, but it briefly pauses the threads doing work. Doing more of them is what turned a memory issue into a latency issue. Swapping ArrayList for List<int> removed all 100,000 boxes per second: the same loop, the same arithmetic, zero allocations.",
          ar: "الـ Gen0 هو الجزء الأحدث من الـ heap، حيث تهبط الـ objects الصغيرة الجديدة، ودورة Gen0 هي المسح السريع الذي يجريه الـ GC عليه. كل مسح قصير، لكنه يوقف للحظة الـ threads التي تعمل. زيادة عددها هي ما حوّل مشكلة ذاكرة إلى مشكلة latency. استبدال ArrayList بـ List<int> أزال الـ 100,000 box في الثانية: نفس الحلقة، ونفس الحساب، وصفر allocations."
        }
      ]
    },
    {
      key: "internals",
      blocks: [
        { t: "p",
          en: "A box is a normal heap object that happens to contain a value. On 64-bit .NET it has three parts: an 8-byte object header used by the runtime for locking and hashing, an 8-byte pointer to the method table (the runtime's description of the type, which is how it knows this box holds an int), and then the value itself. An int needs 4 bytes but the total is rounded up to 24. So a 4-byte number costs 24 bytes and one trip through the allocator.",
          ar: "الـ box هو object عادي على الـ heap يحتوي قيمة. على .NET بـ 64-bit يتكوّن من ثلاثة أجزاء: object header بحجم 8 بايت يستخدمه الـ runtime للقفل وحساب الـ hash، ومؤشّر بحجم 8 بايت إلى الـ method table (وصف الـ runtime للنوع، وبه يعرف أن هذا الـ box يحمل int)، ثم القيمة نفسها. الـ int يحتاج 4 بايت لكن المجموع يُقرَّب إلى 24. أي أن رقماً من 4 بايت يكلّف 24 بايت ومروراً واحداً على الـ allocator."
        },
        { t: "p",
          en: "Back to the envelope: the header and the method table pointer are the printed label and the return address on the envelope. They are what makes it addressable, and they cost more than the coin inside. That is why boxing a small value type is proportionally so expensive — you pay 20 bytes of packaging for 4 bytes of content.",
          ar: "بالعودة إلى الظرف: الـ header ومؤشّر الـ method table هما العنوان المطبوع وعنوان المُرسِل على الظرف. هما ما يجعله قابلاً للعنونة، وهما يكلّفان أكثر من العملة في الداخل. لهذا السبب يكون boxing لـ value type صغير مكلفاً نسبياً — تدفع 20 بايت تغليفاً مقابل 4 بايت محتوى."
        },
        { t: "p",
          en: "The compiler makes this explicit in IL, the low-level instruction set that C# compiles to before the JIT turns it into machine code. Two instructions matter: box, which allocates and copies in, and unbox.any, which checks the type and copies out. If you ever want to know whether a line boxes, look for these two words.",
          ar: "المترجم يجعل هذا صريحاً في الـ IL، وهي مجموعة التعليمات منخفضة المستوى التي تُترجَم إليها C# قبل أن يحوّلها الـ JIT إلى machine code. تعليمتان تهمّان: box التي تحجز وتنسخ إلى الداخل، و unbox.any التي تتحقق من النوع وتنسخ إلى الخارج. إن أردت يوماً معرفة هل سطر ما يعمل boxing، ابحث عن هاتين الكلمتين."
        },
        { t: "code", lang: "csharp", label: { en: "C# and the IL it produces", ar: "كود C# والـ IL الناتج عنه" },
          code: "int n = 42;\nobject o = n;        // box\nint back = (int)o;   // unbox\n\n/*  IL produced:\n\n    ldc.i4.s   42                 // push the literal 42\n    stloc.0                       // n = 42            (stack, no heap)\n    ldloc.0\n    box        [System.Runtime]System.Int32   // allocate 24 bytes, copy 42 in\n    stloc.1                       // o = reference to the box\n    ldloc.1\n    unbox.any  [System.Runtime]System.Int32   // type-check, copy 42 out\n    stloc.2                       // back = 42\n*/\n"
        },
        { t: "kv", rows: [
          { k: { en: "box", ar: "box" },
            v: { en: "IL instruction: allocate a heap object of the right type and copy the value into it. Always an allocation.", ar: "تعليمة IL: احجز object على الـ heap من النوع الصحيح وانسخ القيمة داخله. دائماً allocation." } },
          { k: { en: "unbox.any", ar: "unbox.any" },
            v: { en: "IL instruction: verify the box really holds this type, then copy the value out. Throws InvalidCastException if not.", ar: "تعليمة IL: تحقّق أن الـ box يحمل فعلاً هذا النوع، ثم انسخ القيمة للخارج. ترمي InvalidCastException إن لم يكن كذلك." } },
          { k: { en: "Method table", ar: "Method table" },
            v: { en: "The runtime's per-type record of layout and methods. Every heap object points at one; that pointer is half the box's overhead.", ar: "سجل الـ runtime لكل نوع، يصف بنيته ودوالّه. كل object على الـ heap يشير إليه؛ وهذا المؤشّر نصف التكلفة الزائدة للـ box." } },
          { k: { en: "constrained callvirt", ar: "constrained callvirt" },
            v: { en: "A call form the JIT uses for generic code over structs. When the struct implements the method itself, it calls directly with no box.", ar: "شكل استدعاء يستخدمه الـ JIT للكود الـ generic فوق الـ structs. حين ينفّذ الـ struct الدالة بنفسه، يُستدعى مباشرة بلا box." } },
          { k: { en: "Gen0", ar: "Gen0" },
            v: { en: "The nursery of the heap where new small objects go. Boxes almost always die here, which is the cheapest place to die.", ar: "حضانة الـ heap حيث تذهب الـ objects الصغيرة الجديدة. الـ boxes تموت هنا غالباً، وهو أرخص مكان للموت." } }
        ]},
        { t: "p",
          en: "Now trace one iteration of the order loop. The JIT reads the element out of the ArrayList as an object reference. That reference already points at a box created earlier by ParseQuantities. The cast (int)q emits unbox.any: the runtime compares the box's method table pointer against Int32's, and if they match it copies the 4 bytes onto the evaluation stack. Then the add runs on plain registers. So the arithmetic is free; the wrapping and unwrapping around it is the whole cost.",
          ar: "الآن تتبّع تكراراً واحداً من حلقة الطلبات. الـ JIT يقرأ العنصر من الـ ArrayList كـ object reference. هذا الـ reference يشير أصلاً إلى box أنشأته ParseQuantities سابقاً. التحويل (int)q يُصدر unbox.any: يقارن الـ runtime مؤشّر الـ method table للـ box بمؤشّر Int32، وإن تطابقا نسخ الـ 4 بايت إلى stack التقييم. ثم تجري عملية الجمع على registers عادية. إذن الحساب مجاني؛ والتغليف وفكّه حوله هما كامل التكلفة."
        },
        { t: "p",
          en: "The places boxing appears without you writing a cast are worth memorising. Assigning a struct to an interface variable boxes it. Calling a method a struct did not override — such as GetHashCode or Equals on a struct that defines neither — boxes it, because the inherited implementation lives on object. Passing a value type to a parameter typed object or params object[] boxes it. Storing an int in Dictionary<string, object> boxes it. Using a struct as a dictionary key when it does not implement IEquatable<T> boxes it on every single lookup, because the fallback comparer calls object.Equals.",
          ar: "المواضع التي يظهر فيها الـ boxing دون أن تكتب cast تستحق الحفظ. إسناد struct إلى متغيّر من نوع interface يعمل boxing. استدعاء دالة لم يُعِد الـ struct تعريفها — مثل GetHashCode أو Equals على struct لا يعرّف أياً منهما — يعمل boxing، لأن التنفيذ الموروث موجود على object. تمرير value type إلى parameter من نوع object أو params object[] يعمل boxing. تخزين int في Dictionary<string, object> يعمل boxing. واستخدام struct كمفتاح dictionary دون تنفيذ IEquatable<T> يعمل boxing في كل عملية بحث، لأن المقارن الاحتياطي يستدعي object.Equals."
        },
        { t: "callout", kind: "warn",
          en: "The box holds a copy. If you box a mutable struct, then change the original, the box still has the old value — and vice versa. This is one of the quietest bug sources in C#, and it is the main reason mutable structs are discouraged.",
          ar: "الـ box يحمل نسخة. إذا عملت boxing لـ struct قابل للتعديل ثم غيّرت الأصل، يبقى الـ box محتفظاً بالقيمة القديمة — والعكس صحيح. هذا من أهدأ مصادر الأخطاء في C#، وهو السبب الرئيسي لعدم تشجيع الـ structs القابلة للتعديل."
        }
      ]
    },
    {
      key: "tradeoffs",
      blocks: [
        { t: "tradeoff",
          pros: {
            en: [
              "One object model: every type, including int, can be stored and printed through object.",
              "Interfaces work on structs, so you can write one algorithm over both structs and classes.",
              "Reflection, serialisation and old APIs keep working without a separate value-type path.",
              "The box is short-lived, so the GC usually reclaims it in the cheapest generation."
            ],
            ar: [
              "نموذج object واحد: كل نوع، بما فيه int، يمكن تخزينه وطباعته عبر object.",
              "الـ interfaces تعمل على الـ structs، فتكتب خوارزمية واحدة تخدم الـ structs والـ classes معاً.",
              "الـ reflection والـ serialisation والـ APIs القديمة تظل تعمل بلا مسار منفصل للـ value types.",
              "الـ box قصير العمر، فيستعيده الـ GC عادة في أرخص جيل."
            ]
          },
          cons: {
            en: [
              "24 bytes and one allocation for a 4-byte int — mostly packaging.",
              "High allocation rates mean more GC pauses, which show up as tail latency, not average latency.",
              "Values scatter across the heap instead of sitting together, so the CPU cache helps less.",
              "The copy semantics surprise people: mutating the original does not change the box."
            ],
            ar: [
              "24 بايت و allocation واحد مقابل int من 4 بايت — معظمه تغليف.",
              "معدّلات الـ allocation العالية تعني توقّفات GC أكثر، تظهر في الـ tail latency لا في المتوسط.",
              "القيم تتناثر على الـ heap بدل أن تتجاور، فتقلّ فائدة الـ CPU cache.",
              "دلالات النسخ تفاجئ الناس: تعديل الأصل لا يغيّر الـ box."
            ]
          },
          limits: {
            en: [
              "Only worth optimising in hot paths — loops, parsers, serialisers, per-message handlers.",
              "ref struct types such as Span<T> cannot be boxed at all; the compiler refuses.",
              "Removing boxing by adding generics can grow compiled code size and build time.",
              "Profilers report bytes allocated, not boxes, so you must map allocations back to call sites."
            ],
            ar: [
              "يستحق التحسين فقط في المسارات الساخنة — الحلقات والـ parsers والـ serialisers ومعالجات الرسائل.",
              "أنواع ref struct مثل Span<T> لا يمكن عمل boxing لها إطلاقاً؛ المترجم يرفض.",
              "إزالة الـ boxing بإضافة generics قد تزيد حجم الكود المُترجَم ووقت البناء.",
              "الـ profilers تُبلّغ عن البايتات المحجوزة لا عن عدد الـ boxes، فعليك ربط الـ allocations بمواضع الاستدعاء."
            ]
          },
          alts: {
            en: [
              "Generic collections: List<int> and Dictionary<int, T> store values inline, no boxes.",
              "Implement IEquatable<T> and IComparable<T> on structs so comparers stay generic.",
              "Span<T> and ReadOnlySpan<T> for slicing buffers without allocating at all.",
              "Source-generated logging (LoggerMessage) instead of params object[] logging calls."
            ],
            ar: [
              "الـ collections الـ generic: List<int> و Dictionary<int, T> تخزّن القيم مباشرة بلا صناديق.",
              "نفّذ IEquatable<T> و IComparable<T> على الـ structs ليبقى المقارن generic.",
              "استخدم Span<T> و ReadOnlySpan<T> لتقطيع الـ buffers دون أي allocation.",
              "logging مولّد بالمصدر (LoggerMessage) بدل استدعاءات logging بـ params object[]."
            ]
          }
        }
      ]
    },
    {
      key: "mistakes",
      blocks: [
        { t: "mistake",
          title: { en: "A collection of object in a hot loop", ar: "collection من object داخل حلقة ساخنة" },
          body: {
            en: "This is the order endpoint above. ParseQuantities returned an ArrayList because it was written in 2009 and nobody revisited it. Each of the 200 quantities was boxed on the way in and unboxed on the way out, 100,000 times a second in total. Nothing looked wrong in code review — the loop is three lines. It only showed up as a rising Gen0 collection count. Dictionary<string, object> used as a generic bag of values has exactly the same problem.",
            ar: "هذا هو endpoint الطلبات أعلاه. الدالة ParseQuantities كانت تُرجع ArrayList لأنها كُتبت في 2009 ولم يراجعها أحد. كل واحدة من الـ 200 كمية كانت تُغلَّف عند الدخول وتُفكّ عند الخروج، 100,000 مرة في الثانية إجمالاً. لم يبدُ شيء خاطئ في مراجعة الكود — الحلقة ثلاثة أسطر. ظهر الأمر فقط كارتفاع في عدد دورات Gen0. واستخدام Dictionary<string, object> كحقيبة قيم عامة له المشكلة نفسها."
          },
          fix: "// before: ArrayList ParseQuantities(...)\n// after:\nList<int> ParseQuantities(...)\n\nint total = 0;\nforeach (int q in quantities)   // no box, no unbox\n    total += q;"
        },
        { t: "mistake",
          title: { en: "A struct key without IEquatable<T>", ar: "struct كمفتاح بدون IEquatable<T>" },
          body: {
            en: "A team used a struct OrderKey { int TenantId; long OrderId; } as the key of a Dictionary. They never implemented IEquatable<OrderKey>, so the runtime fell back to the default comparer, which calls object.Equals — and that boxes the key on every lookup, plus compares the fields by reflection. A cache doing 40,000 lookups per second allocated about 1 MB per second and ran roughly ten times slower than it needed to. Implementing IEquatable<OrderKey> and overriding GetHashCode removed both problems.",
            ar: "فريق استخدم struct OrderKey { int TenantId; long OrderId; } كمفتاح لـ Dictionary. لم ينفّذوا IEquatable<OrderKey> أبداً، فرجع الـ runtime إلى المقارن الافتراضي الذي يستدعي object.Equals — وهو يعمل boxing للمفتاح في كل بحث، ويقارن الحقول عبر reflection. cache يجري 40,000 عملية بحث في الثانية كان يحجز نحو 1 ميغابايت في الثانية ويعمل أبطأ بنحو عشر مرات مما يلزم. تنفيذ IEquatable<OrderKey> وإعادة تعريف GetHashCode أزال المشكلتين."
          },
          fix: "readonly struct OrderKey : IEquatable<OrderKey>\n{\n    public int TenantId { get; init; }\n    public long OrderId { get; init; }\n\n    public bool Equals(OrderKey other) =>\n        TenantId == other.TenantId && OrderId == other.OrderId;\n\n    public override bool Equals(object? o) => o is OrderKey k && Equals(k);\n    public override int GetHashCode() => HashCode.Combine(TenantId, OrderId);\n}"
        },
        { t: "mistake",
          title: { en: "Logging that allocates even when the level is off", ar: "logging يحجز ذاكرة حتى وإن كان المستوى مُطفأً" },
          body: {
            en: "A developer added a debug log inside the per-line-item loop. Debug logging is disabled in production, so they assumed it was free. It is not: the call takes params object[], so before the logger is even asked whether Debug is enabled, the runtime allocates an array and boxes the int and the decimal into it. That is three allocations per line item, 150,000 per second, all thrown away immediately. The fix is the LoggerMessage source generator, which produces a strongly typed method with no array and no boxes.",
            ar: "مطوّر أضاف debug log داخل حلقة الـ line items. الـ debug logging مُطفأ في الإنتاج، فافترض أنه مجاني. وهو ليس كذلك: الاستدعاء يأخذ params object[]، فقبل أن يُسأل الـ logger أصلاً هل الـ Debug مفعّل، يحجز الـ runtime array ويعمل boxing للـ int والـ decimal داخله. أي ثلاثة allocations لكل line item، 150,000 في الثانية، تُرمى كلها فوراً. الحل هو مولّد المصدر LoggerMessage الذي يُنتج دالة ذات أنواع محدّدة بلا array وبلا boxes."
          },
          fix: "// bad: allocates an object[] and boxes both arguments, always\nlogger.LogDebug(\"Line {ItemId} total {Total}\", itemId, total);\n\n// good: source-generated, no array, no boxing, checks the level first\n[LoggerMessage(Level = LogLevel.Debug, Message = \"Line {ItemId} total {Total}\")]\npartial void LogLine(int itemId, decimal total);"
        },
        { t: "mistake",
          title: { en: "Assuming an interface call on a struct is free", ar: "افتراض أن استدعاء interface على struct مجاني" },
          body: {
            en: "A pricing rule was modelled as a struct implementing IPricingRule, and the engine stored the rules in a List<IPricingRule>. The author chose a struct on purpose, to avoid allocations. But the moment a struct is assigned to an interface-typed variable or added to a list of that interface, it is boxed — so the list held 5,000 boxes, and the supposed optimisation allocated more than a class would have. If you need a list of an interface, use a class. If you need zero allocation, keep the struct concrete or pass it through a generic constrained with where T : IPricingRule.",
            ar: "قاعدة تسعير مُصمَّمة كـ struct ينفّذ IPricingRule، والمحرّك يخزّن القواعد في List<IPricingRule>. اختار الكاتب struct عمداً لتجنّب الـ allocations. لكن في اللحظة التي يُسنَد فيها struct إلى متغيّر من نوع interface أو يُضاف إلى قائمة من ذلك الـ interface، يحدث boxing — فصارت القائمة تحمل 5,000 box، والتحسين المزعوم حجز ذاكرة أكثر مما كان سيفعله class. إن كنت تحتاج قائمة من interface فاستخدم class. وإن كنت تحتاج صفر allocation فأبقِ الـ struct بنوعه الصريح أو مرّره عبر generic مقيّد بـ where T : IPricingRule."
          },
          fix: "// boxes every rule:\nList<IPricingRule> rules = new() { new FlatDiscount(), new TieredDiscount() };\n\n// no boxing: the JIT specialises the generic method per struct type\nstatic decimal Apply<TRule>(TRule rule, decimal price)\n    where TRule : IPricingRule => rule.Apply(price);"
        }
      ]
    },
    {
      key: "interview",
      blocks: [
        { t: "qa", level: "junior",
          q: { en: "What is boxing?", ar: "ما هو الـ boxing؟" },
          a: {
            en: "Boxing is when a value type — an int, a bool, any struct — gets wrapped in an object on the heap so it can be used where the code expects an object. The runtime allocates the wrapper and copies the value into it. Unboxing is the reverse: it checks the type and copies the value back out. The important part is that it is a copy, and that it costs a heap allocation.",
            ar: "الـ boxing هو أن يُغلَّف value type — int أو bool أو أي struct — داخل object على الـ heap ليُستخدم حيث يتوقّع الكود object. الـ runtime يحجز الغلاف وينسخ القيمة داخله. والـ unboxing هو العكس: يتحقق من النوع وينسخ القيمة للخارج. المهم أنها نسخة، وأنها تكلّف allocation على الـ heap."
          }
        },
        { t: "qa", level: "mid",
          q: { en: "Give me three places boxing happens without an explicit cast.", ar: "أعطني ثلاثة مواضع يحدث فيها boxing بلا cast صريح." },
          a: {
            en: "First, assigning a struct to an interface variable — IComparable c = someStruct boxes. Second, passing a value type into anything typed object, including params object[], which is what most old logging and string.Format overloads take. Third, calling a method the struct did not override, like GetHashCode when the struct defines none, because the inherited version lives on object. A fourth I always mention: using a struct as a dictionary key without IEquatable<T>, which boxes on every lookup.",
            ar: "أولاً، إسناد struct إلى متغيّر interface — IComparable c = someStruct يعمل boxing. ثانياً، تمرير value type إلى أي شيء نوعه object، بما في ذلك params object[]، وهو ما تأخذه معظم استدعاءات الـ logging القديمة و string.Format. ثالثاً، استدعاء دالة لم يُعِد الـ struct تعريفها، مثل GetHashCode عندما لا يعرّفه الـ struct، لأن النسخة الموروثة موجودة على object. ورابع أذكره دائماً: استخدام struct كمفتاح dictionary بلا IEquatable<T>، فيحدث boxing في كل بحث."
          }
        },
        { t: "qa", level: "mid",
          q: { en: "How much does one box actually cost?", ar: "كم يكلّف الـ box الواحد فعلياً؟" },
          a: {
            en: "For an int on 64-bit .NET it is 24 bytes: 8 for the object header, 8 for the method table pointer, and the value padded into the rest. The allocation itself is just a pointer bump, so it is fast. The real cost is downstream — more garbage means more Gen0 collections, and each collection briefly pauses your threads. So one box is nothing. A hundred thousand boxes a second turns into tail latency.",
            ar: "بالنسبة لـ int على .NET بـ 64-bit فهو 24 بايت: 8 للـ object header و8 لمؤشّر الـ method table والقيمة مع الحشو في الباقي. الـ allocation نفسه مجرد تحريك مؤشّر، فهو سريع. التكلفة الحقيقية لاحقة — قمامة أكثر تعني دورات Gen0 أكثر، وكل دورة توقف الـ threads للحظة. إذن box واحد لا شيء. ومئة ألف box في الثانية تتحوّل إلى tail latency."
          }
        },
        { t: "qa", level: "senior",
          q: { en: "Why did generics make such a difference here?", ar: "لماذا أحدثت الـ generics فرقاً كبيراً هنا؟" },
          a: {
            en: "Because the JIT compiles a separate, specialised version of generic code for each value type you use it with. List<int> genuinely stores a block of ints, not a block of references to boxes. Before generics, every collection stored object, so using them with numbers meant boxing by definition. The same specialisation is why a generic method with a struct constraint can call an interface method on that struct without boxing — the JIT knows the exact type and emits a direct call.",
            ar: "لأن الـ JIT يترجم نسخة منفصلة ومتخصّصة من الكود الـ generic لكل value type تستخدمه معه. القائمة List<int> تخزّن فعلاً كتلة من الـ ints، لا كتلة من الـ references إلى صناديق. قبل الـ generics كانت كل collection تخزّن object، فاستخدامها مع أرقام كان يعني boxing بحكم التعريف. والتخصّص نفسه هو سبب أن دالة generic بقيد struct تستطيع استدعاء دالة interface على ذلك الـ struct بلا boxing — الـ JIT يعرف النوع تماماً فيُصدر استدعاءً مباشراً."
          }
        },
        { t: "qa", level: "senior",
          q: { en: "A profiler shows 2 MB per second of Int32 allocations. Walk me through what you do.", ar: "أظهر الـ profiler حجز 2 ميغابايت في الثانية من Int32. اشرح لي ما ستفعله." },
          a: {
            en: "Int32 appearing as an allocated type is proof of boxing, because an unboxed int is never a heap object. So I take an allocation trace with dotnet-trace or a memory profiler and group by allocation call stack — that gives me the exact method boxing them. Then I look for the usual shapes there: a non-generic collection, an object parameter, a struct key, or a logging call. I confirm with a BenchmarkDotNet run using MemoryDiagnoser, which reports allocated bytes per operation, so I can prove the fix took it to zero rather than guessing.",
            ar: "ظهور Int32 كنوع محجوز دليل على boxing، لأن int غير مُغلَّف لا يكون أبداً object على الـ heap. لذلك آخذ allocation trace بـ dotnet-trace أو memory profiler وأُجمّع حسب call stack الـ allocation — فيعطيني الدالة التي تعمل boxing بالضبط. ثم أبحث هناك عن الأشكال المعتادة: collection غير generic، أو parameter من نوع object، أو struct كمفتاح، أو استدعاء logging. وأؤكّد بتشغيل BenchmarkDotNet مع MemoryDiagnoser الذي يُبلّغ بالبايتات المحجوزة لكل عملية، فأثبت أن الإصلاح أوصلها إلى صفر بدل التخمين."
          }
        },
        { t: "qa", level: "staff",
          q: { en: "How do you stop this class of problem returning across a large codebase?", ar: "كيف تمنع عودة هذا النوع من المشاكل عبر codebase كبير؟" },
          a: {
            en: "I would not rely on people remembering. Three structural moves. First, make it visible: turn on the analyzers that flag boxing and unnecessary allocations, start them as warnings on new code only so the team is not drowned in a legacy backlog. Second, make it measured: put allocation-rate and Gen0-rate on the service dashboard next to latency, so a regression is noticed by a graph rather than by a customer. Third, make it scoped: agree in writing which paths are hot — request handlers, message consumers, serialisers — and only enforce the strict rules there. Applying allocation discipline to a nightly report job costs reviewer attention and buys nothing.",
            ar: "لن أعتمد على تذكّر الناس. ثلاث خطوات هيكلية. أولاً، اجعلها مرئية: فعّل الـ analyzers التي تُشير إلى الـ boxing والـ allocations غير الضرورية، وابدأها كتحذيرات على الكود الجديد فقط حتى لا يغرق الفريق في تراكم قديم. ثانياً، اجعلها مقاسة: ضع معدّل الـ allocation ومعدّل Gen0 على لوحة الخدمة بجانب الـ latency، ليُكتشف التراجع برسم بياني لا بشكوى عميل. ثالثاً، اجعلها محدودة النطاق: اتفقوا كتابةً على المسارات الساخنة — معالجات الـ requests ومستهلكو الرسائل والـ serialisers — وطبّقوا القواعد الصارمة هناك فقط. تطبيق انضباط الـ allocation على وظيفة تقارير ليلية يستهلك انتباه المراجعين ولا يشتري شيئاً."
          }
        }
      ]
    },
    {
      key: "codereview",
      blocks: [
        { t: "review", severity: "high",
          title: { en: "Struct used as a dictionary key with no IEquatable<T>", ar: "struct مستخدم كمفتاح dictionary بلا IEquatable<T>" },
          bad: "public struct OrderKey\n{\n    public int TenantId;\n    public long OrderId;\n}\n\nvar cache = new Dictionary<OrderKey, Order>();\nif (cache.TryGetValue(key, out var order)) { ... }   // boxes on every call",
          good: "public readonly struct OrderKey : IEquatable<OrderKey>\n{\n    public int TenantId { get; init; }\n    public long OrderId { get; init; }\n\n    public bool Equals(OrderKey other) =>\n        TenantId == other.TenantId && OrderId == other.OrderId;\n\n    public override bool Equals(object? o) => o is OrderKey k && Equals(k);\n    public override int GetHashCode() => HashCode.Combine(TenantId, OrderId);\n}",
          why: {
            en: "Without IEquatable<T>, the dictionary uses the default comparer, which calls object.Equals. That boxes the key on every lookup and compares fields through reflection. Adding the interface and overriding GetHashCode makes the comparer generic, so lookups become plain field comparisons with zero allocation. Marking the struct readonly also stops the compiler making defensive copies.",
            ar: "بدون IEquatable<T> يستخدم الـ dictionary المقارن الافتراضي الذي يستدعي object.Equals. وهذا يعمل boxing للمفتاح في كل بحث ويقارن الحقول عبر reflection. إضافة الـ interface وإعادة تعريف GetHashCode يجعلان المقارن generic، فتصبح عمليات البحث مقارنات حقول عادية بصفر allocation. وتعليم الـ struct بـ readonly يمنع أيضاً المترجم من عمل نسخ دفاعية."
          }
        },
        { t: "review", severity: "medium",
          title: { en: "String building with object parameters in a loop", ar: "بناء نص بـ parameters من نوع object داخل حلقة" },
          bad: "var sb = new StringBuilder();\nforeach (var item in order.Lines)\n{\n    // string.Format takes params object[]: array + two boxes per line\n    sb.AppendLine(string.Format(\"{0} x {1}\", item.Sku, item.Quantity));\n}",
          good: "var sb = new StringBuilder();\nforeach (var item in order.Lines)\n{\n    // AppendFormatted<T> is generic: Quantity stays an int, no box\n    sb.Append(item.Sku).Append(\" x \").Append(item.Quantity).AppendLine();\n}",
          why: {
            en: "string.Format takes params object[], so each call allocates an array and boxes every value-type argument — here the quantity. StringBuilder.Append has generic and primitive overloads that write the number directly into its buffer. On a 200-line order this removes 600 allocations per request. Interpolated strings in .NET 6 and later are also fine, because the compiler routes them through a generic handler instead of an object array.",
            ar: "الدالة string.Format تأخذ params object[]، فكل استدعاء يحجز array ويعمل boxing لكل argument من نوع value type — هنا الكمية. أما StringBuilder.Append فلها overloads generic وأخرى للأنواع الأولية تكتب الرقم مباشرة في الـ buffer. على طلب من 200 سطر يزيل هذا 600 allocation لكل request. والـ interpolated strings في .NET 6 وما بعده جيدة أيضاً، لأن المترجم يمرّرها عبر handler generic بدل array من object."
          }
        }
      ]
    },
    {
      key: "sysdesign",
      blocks: [
        { t: "p",
          en: "Boxing becomes a design concern, not a micro-optimisation, when a component touches every item of every request. A message consumer that reads 10,000 events per second, a serialiser that walks every field of every payload, a metrics library that records a value on every call — in these, one box per item is one box per event, and the allocation rate is set by your traffic rather than by your code size.",
          ar: "يصبح الـ boxing قراراً تصميمياً لا تحسيناً دقيقاً عندما يلمس مكوّن كل عنصر من كل request. مستهلك رسائل يقرأ 10,000 حدث في الثانية، أو serialiser يمرّ على كل حقل من كل payload، أو مكتبة metrics تسجّل قيمة عند كل استدعاء — في هذه، box واحد لكل عنصر يعني box واحداً لكل حدث، ويصبح معدّل الـ allocation محكوماً بحجم المرور لا بحجم الكود."
        },
        { t: "ul",
          en: [
            "Pipeline stages: if every stage passes items as object, one item crossing five stages can be boxed five times. Type the pipeline generically once.",
            "Serialisers and mappers: reflection-based mapping boxes every value-type property it reads. Source generators produce typed code and remove it.",
            "Metrics and tracing: recording tag values typed as object boxes each one. Prefer APIs with generic overloads and keep tag counts low.",
            "Caches keyed by structs: high lookup rates make the missing IEquatable<T> the single largest allocation source in the service.",
            "Batch jobs and reports: run rarely, so boxing there is not worth a code change; spend the review effort on request paths instead."
          ],
          ar: [
            "مراحل الـ pipeline: إن مرّرت كل مرحلة العناصر كـ object، فقد يُغلَّف عنصر واحد يعبر خمس مراحل خمس مرات. اجعل الـ pipeline generic مرة واحدة.",
            "الـ serialisers والـ mappers: التحويل المعتمد على reflection يعمل boxing لكل خاصية value type يقرأها. مولّدات المصدر تُنتج كوداً مُحدَّد الأنواع وتزيله.",
            "الـ metrics والـ tracing: تسجيل قيم tags من نوع object يعمل boxing لكل واحدة. فضّل APIs بـ overloads generic وأبقِ عدد الـ tags منخفضاً.",
            "الـ caches المفهرسة بـ structs: معدّلات البحث العالية تجعل غياب IEquatable<T> أكبر مصدر allocation في الخدمة.",
            "المهام الدفعية والتقارير: تعمل نادراً، فالـ boxing فيها لا يستحق تغيير كود؛ اصرف جهد المراجعة على مسارات الـ requests."
          ]
        },
        { t: "callout", kind: "tip",
          en: "Decide where the boundary is before the argument starts. Write down which assemblies are hot-path and hold them to allocation rules; everywhere else, readability wins. That turns a recurring style debate into a one-time decision.",
          ar: "حدّد أين الحدّ قبل أن يبدأ الجدال. اكتب أي الـ assemblies تعتبر مسارات ساخنة وألزمها بقواعد الـ allocation؛ وفي ما عداها تفوز قابلية القراءة. هذا يحوّل جدالاً أسلوبياً متكرراً إلى قرار يُتَّخذ مرة واحدة."
        }
      ]
    },
    {
      key: "perf",
      blocks: [
        { t: "kv", rows: [
          { k: { en: "Memory", ar: "Memory" },
            v: { en: "24 bytes per boxed int on 64-bit, versus 4 bytes inline. In our order loop that is 2.4 MB per second of pure garbage.", ar: "24 بايت لكل int مُغلَّف على 64-bit، مقابل 4 بايت مباشرة. في حلقة الطلبات لدينا يعني ذلك 2.4 ميغابايت في الثانية من القمامة الصافية." } },
          { k: { en: "CPU", ar: "CPU" },
            v: { en: "Each box costs an allocation and a type check on unboxing, and the scattered layout means more cache misses when you loop over the values.", ar: "كل box يكلّف allocation وفحص نوع عند الـ unboxing، والتوزيع المتناثر يعني cache misses أكثر عند الدوران على القيم." } },
          { k: { en: "Latency", ar: "Latency" },
            v: { en: "Shows up in the tail, not the average: p99 moved from 12 ms to 21 ms while p50 barely changed, because only requests unlucky enough to hit a GC pause slowed down.", ar: "يظهر في الذيل لا في المتوسط: انتقل p99 من 12 إلى 21 ميلي ثانية بينما p50 لم يتغيّر تقريباً، لأن الـ requests التي صادفت توقّف GC فقط هي التي تباطأت." } },
          { k: { en: "Scalability", ar: "Scalability" },
            v: { en: "Allocation rate rises linearly with traffic, so the service degrades faster than expected under load and needs more headroom per instance.", ar: "معدّل الـ allocation يرتفع خطياً مع حجم المرور، فتتدهور الخدمة أسرع من المتوقع تحت الحمل وتحتاج هامشاً أكبر لكل instance." } }
        ]}
      ]
    },
    {
      key: "debug",
      blocks: [
        { t: "ul",
          en: [
            "dotnet-counters monitor --process-id <pid> System.Runtime — watch 'Allocation Rate' and 'Gen 0 GC Count'; a high rate with a low heap size means lots of small short-lived objects, which is what boxes look like.",
            "dotnet-trace collect --providers Microsoft-DotNETCore-SampleProfiler,Microsoft-Windows-DotNETRuntime:0x1:5 — captures allocation events; open in PerfView or Visual Studio and group by type, then look for System.Int32 or your struct name in the list.",
            "BenchmarkDotNet with [MemoryDiagnoser] — its report has an 'Allocated' column per benchmark; a boxing fix should take it to 0 B, which is the proof the change worked.",
            "sharplab.io — paste the C# method and switch the output to IL; search the output for 'box'. Fastest way to settle an argument about whether a specific line allocates.",
            "Roslyn analyzers such as CA1854, CA1859 and the Heap Allocation Analyzer package — they underline the boxing site in the editor before the code is ever run."
          ],
          ar: [
            "dotnet-counters monitor --process-id <pid> System.Runtime — راقب 'Allocation Rate' و'Gen 0 GC Count'؛ معدّل عالٍ مع حجم heap منخفض يعني كثيراً من الـ objects الصغيرة قصيرة العمر، وهذا شكل الـ boxes.",
            "dotnet-trace collect --providers Microsoft-DotNETCore-SampleProfiler,Microsoft-Windows-DotNETRuntime:0x1:5 — يلتقط أحداث الـ allocation؛ افتحه في PerfView أو Visual Studio وجمّع حسب النوع، ثم ابحث عن System.Int32 أو اسم الـ struct لديك في القائمة.",
            "BenchmarkDotNet مع [MemoryDiagnoser] — تقريره فيه عمود 'Allocated' لكل benchmark؛ إصلاح الـ boxing يجب أن يوصله إلى 0 B، وهذا هو الدليل على نجاح التغيير.",
            "sharplab.io — الصق دالة C# وبدّل المخرجات إلى IL؛ ابحث في الناتج عن كلمة 'box'. أسرع طريقة لحسم نقاش حول هل سطر معيّن يحجز ذاكرة.",
            "محلّلات Roslyn مثل CA1854 و CA1859 وحزمة Heap Allocation Analyzer — تضع خطاً تحت موضع الـ boxing في المحرّر قبل تشغيل الكود أصلاً."
          ]
        },
        { t: "callout", kind: "tip",
          en: "If a profiler lists System.Int32, System.Boolean or a struct of yours among allocated types, that is boxing by definition — those types are never heap objects otherwise. It is the fastest single signal you can look for.",
          ar: "إن أدرج الـ profiler النوع System.Int32 أو System.Boolean أو struct من عندك ضمن الأنواع المحجوزة، فهذا boxing بحكم التعريف — هذه الأنواع لا تكون objects على الـ heap بغير ذلك. إنها أسرع إشارة مفردة يمكنك البحث عنها."
        }
      ]
    },
    {
      key: "realworld",
      blocks: [
        { t: "p",
          en: "Boxing matters in systems where the same small operation repeats enormously often, and it is irrelevant almost everywhere else. The pattern to recognise is a per-item cost inside a per-request loop: multiply the two and see whether the answer is thousands per second or dozens per day. Only the first case deserves engineering time.",
          ar: "يهمّ الـ boxing في الأنظمة التي تتكرر فيها العملية الصغيرة نفسها بكثافة هائلة، ولا يهمّ في معظم ما عداها. النمط الذي تتعرّف عليه هو تكلفة لكل عنصر داخل حلقة لكل request: اضرب الاثنين وانظر هل الناتج آلاف في الثانية أم عشرات في اليوم. الحالة الأولى وحدها تستحق وقت هندسة."
        },
        { t: "ul",
          en: [
            "High-throughput messaging: consumers that deserialise and route tens of thousands of events per second, where one box per field becomes megabytes of garbage per second.",
            "Market data and telemetry ingestion: numeric-heavy payloads flowing continuously, so any object-typed hop in the pipeline multiplies allocations by the message rate.",
            "Game and simulation backends: fixed frame budgets mean a GC pause is visible to users, so struct-heavy code with accidental interface boxing is a known source of stutter.",
            "Large-scale caching layers: millions of lookups per minute make a struct key missing IEquatable<T> the single largest allocation site in an otherwise clean service."
          ],
          ar: [
            "أنظمة الرسائل عالية الإنتاجية: مستهلكون يفكّون تشفير عشرات آلاف الأحداث في الثانية ويوجّهونها، حيث يصبح box واحد لكل حقل ميغابايتات من القمامة في الثانية.",
            "استقبال بيانات الأسواق والـ telemetry: payloads مليئة بالأرقام تتدفق باستمرار، فأي قفزة بنوع object في الـ pipeline تضاعف الـ allocations بمعدّل الرسائل.",
            "خوادم الألعاب والمحاكاة: ميزانيات الإطار الثابتة تجعل توقّف الـ GC مرئياً للمستخدمين، فالكود المليء بالـ structs مع boxing غير مقصود عبر interfaces مصدر معروف للتقطّع.",
            "طبقات الـ caching الكبيرة: ملايين عمليات البحث في الدقيقة تجعل struct كمفتاح بلا IEquatable<T> أكبر موضع allocation في خدمة نظيفة بغير ذلك."
          ]
        }
      ]
    },
    {
      key: "exercises",
      blocks: [
        { t: "ex", diff: "easy",
          en: "Write a method that sums 1,000 ints from an ArrayList, and a second that sums the same numbers from a List<int>. Run both under BenchmarkDotNet with [MemoryDiagnoser]. You are done when the report shows roughly 24 KB allocated for the first and 0 B for the second, and you can explain where the 24 KB came from.",
          ar: "اكتب دالة تجمع 1,000 int من ArrayList، وثانية تجمع الأرقام نفسها من List<int>. شغّل الاثنتين تحت BenchmarkDotNet مع [MemoryDiagnoser]. تنتهي عندما يُظهر التقرير نحو 24 كيلوبايت محجوزة للأولى و0 B للثانية، وتستطيع شرح مصدر الـ 24 كيلوبايت."
        },
        { t: "ex", diff: "medium",
          en: "Define a struct Point { int X; int Y; } with no interfaces and put 100,000 of them in a HashSet<Point>. Measure allocations. Then add IEquatable<Point> and override GetHashCode, and measure again. You are done when allocations drop to zero and you can say in one sentence which method the runtime was calling before.",
          ar: "عرّف struct Point { int X; int Y; } بلا أي interfaces وضع 100,000 منه في HashSet<Point>. قِس الـ allocations. ثم أضف IEquatable<Point> وأعد تعريف GetHashCode، وقِس مجدداً. تنتهي عندما تهبط الـ allocations إلى صفر وتستطيع أن تقول في جملة واحدة أي دالة كان الـ runtime يستدعيها قبل ذلك."
        },
        { t: "ex", diff: "hard",
          en: "Take the order endpoint from this lesson, or any loop of your own, and find every boxing site in it using only IL: compile it, open the method in a decompiler or paste it into sharplab.io, and list each 'box' instruction with the C# line that caused it. You are done when your list matches what a memory profiler reports for the same run.",
          ar: "خذ endpoint الطلبات من هذا الدرس، أو أي حلقة من عندك، وابحث عن كل موضع boxing فيها باستخدام الـ IL فقط: ترجمها، وافتح الدالة في decompiler أو الصقها في sharplab.io، واسرد كل تعليمة 'box' مع سطر C# الذي سبّبها. تنتهي عندما تطابق قائمتك ما يُبلّغ عنه memory profiler للتشغيل نفسه."
        },
        { t: "ex", diff: "senior",
          en: "Design a small pricing pipeline where rules are structs. Build two versions: one storing List<IPricingRule>, one using a generic method constrained with where TRule : IPricingRule. Benchmark both and write a short note recommending one, stating the allocation numbers, the readability cost, and the traffic level below which the difference does not matter. You are done when the note would let a teammate disagree with you on evidence rather than taste.",
          ar: "صمّم pipeline تسعير صغيراً تكون فيه القواعد structs. ابنِ نسختين: واحدة تخزّن List<IPricingRule>، وأخرى تستخدم دالة generic مقيّدة بـ where TRule : IPricingRule. قِس الأداء لكليهما واكتب ملاحظة قصيرة توصي بواحدة، مع ذكر أرقام الـ allocation وتكلفة قابلية القراءة ومستوى المرور الذي لا يهمّ الفرق تحته. تنتهي عندما تسمح ملاحظتك لزميل بالاختلاف معك بناءً على دليل لا على ذوق."
        }
      ]
    },
    {
      key: "refs",
      blocks: [
        { t: "ref",
          label: { en: "Boxing and unboxing — C# guide", ar: "Boxing و unboxing — دليل C#" },
          url: "https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/types/boxing-and-unboxing",
          meta: { en: "Docs", ar: "توثيق" }
        },
        { t: "ref",
          label: { en: "Garbage collection fundamentals — why allocation rate matters", ar: "أساسيات الـ garbage collection — لماذا يهمّ معدّل الـ allocation" },
          url: "https://learn.microsoft.com/en-us/dotnet/standard/garbage-collection/fundamentals",
          meta: { en: "Docs", ar: "توثيق" }
        },
        { t: "ref",
          label: { en: "BenchmarkDotNet MemoryDiagnoser — measuring allocations per operation", ar: "BenchmarkDotNet MemoryDiagnoser — قياس الـ allocations لكل عملية" },
          url: "https://benchmarkdotnet.org/articles/configs/diagnosers.html",
          meta: { en: "Docs", ar: "توثيق" }
        },
        { t: "ref",
          label: { en: "Pro .NET Memory Management — Konrad Kokosa", ar: "Pro .NET Memory Management — Konrad Kokosa" },
          url: "https://prodotnetmemory.com/",
          meta: { en: "Book", ar: "كتاب" }
        }
      ]
    }
  ],
  quiz: [
    {
      q: { en: "How large is a boxed int on 64-bit .NET, and why?", ar: "ما حجم int مُغلَّف على .NET بـ 64-bit، ولماذا؟" },
      options: [
        { en: "4 bytes — the box stores only the value", ar: "4 بايت — الـ box يخزّن القيمة فقط" },
        { en: "24 bytes — 8-byte object header, 8-byte method table pointer, plus the padded value", ar: "24 بايت — object header بـ 8 بايت، ومؤشّر method table بـ 8 بايت، إضافة إلى القيمة مع الحشو" },
        { en: "8 bytes — a pointer is all that is stored", ar: "8 بايت — المخزَّن هو مؤشّر فقط" },
        { en: "It varies at runtime depending on the value", ar: "يتغيّر أثناء التشغيل حسب القيمة" }
      ],
      correct: 1,
      why: {
        en: "Every heap object carries a header and a method table pointer. For an int those 16 bytes of bookkeeping dwarf the 4 bytes of data, and the total is rounded up to 24.",
        ar: "كل object على الـ heap يحمل header ومؤشّر method table. بالنسبة لـ int فإن هذين الـ 16 بايت من البيانات الإدارية يتجاوزان بكثير الـ 4 بايت من البيانات، والمجموع يُقرَّب إلى 24."
      }
    },
    {
      q: { en: "Which of these does NOT cause boxing?", ar: "أي مما يلي لا يسبّب boxing؟" },
      options: [
        { en: "Assigning a struct to a variable of an interface type it implements", ar: "إسناد struct إلى متغيّر من نوع interface ينفّذه" },
        { en: "Adding an int to a Dictionary<string, object>", ar: "إضافة int إلى Dictionary<string, object>" },
        { en: "Adding an int to a List<int>", ar: "إضافة int إلى List<int>" },
        { en: "Passing an int to a method whose parameter is params object[]", ar: "تمرير int إلى دالة معاملها params object[]" }
      ],
      correct: 2,
      why: {
        en: "The JIT compiles a specialised version of List<int> that stores raw ints inline. The other three all force the value into an object-shaped slot, which is exactly what boxing is.",
        ar: "الـ JIT يترجم نسخة متخصّصة من List<int> تخزّن ints خام مباشرة. أما الخيارات الثلاثة الأخرى فتجبر القيمة على الدخول في مكان شكله object، وهذا بالضبط هو الـ boxing."
      }
    },
    {
      q: { en: "Why does a struct dictionary key without IEquatable<T> allocate on every lookup?", ar: "لماذا يحجز struct كمفتاح dictionary بلا IEquatable<T> ذاكرة في كل بحث؟" },
      options: [
        { en: "The dictionary rehashes the whole table on each lookup", ar: "الـ dictionary يعيد حساب hash الجدول كله في كل بحث" },
        { en: "The default comparer falls back to object.Equals, which takes an object parameter and so boxes the key", ar: "المقارن الافتراضي يرجع إلى object.Equals الذي يأخذ parameter من نوع object فيعمل boxing للمفتاح" },
        { en: "Structs cannot be dictionary keys, so the runtime copies them to classes", ar: "الـ structs لا يمكن أن تكون مفاتيح dictionary، فينسخها الـ runtime إلى classes" },
        { en: "GetHashCode always allocates a string internally", ar: "الدالة GetHashCode تحجز string داخلياً دائماً" }
      ],
      correct: 1,
      why: {
        en: "With no IEquatable<T>, EqualityComparer<T>.Default cannot use a typed comparison, so it calls the inherited object.Equals. That parameter is typed object, so the key is boxed — and the comparison itself falls back to reflection over the fields.",
        ar: "بدون IEquatable<T> لا يستطيع EqualityComparer<T>.Default استخدام مقارنة محدّدة النوع، فيستدعي object.Equals الموروثة. ومعامل تلك الدالة نوعه object، فيحدث boxing للمفتاح — والمقارنة نفسها ترجع إلى reflection على الحقول."
      }
    },
    {
      q: { en: "A logging call inside a hot loop uses a disabled log level. What still costs you?", ar: "استدعاء logging داخل حلقة ساخنة يستخدم مستوى مُعطَّلاً. ما الذي يظل يكلّفك؟" },
      options: [
        { en: "Nothing — a disabled level short-circuits before anything is evaluated", ar: "لا شيء — المستوى المعطَّل يقطع المسار قبل تقييم أي شيء" },
        { en: "The arguments are evaluated and boxed into an object[] before the logger is consulted", ar: "تُقيَّم الـ arguments ويحدث لها boxing داخل object[] قبل سؤال الـ logger" },
        { en: "The message string is written to disk and then deleted", ar: "تُكتب رسالة النص على القرص ثم تُحذف" },
        { en: "The logger opens a network connection to check the level", ar: "الـ logger يفتح اتصال شبكة للتحقق من المستوى" }
      ],
      correct: 1,
      why: {
        en: "Argument evaluation happens at the call site, before the method body runs. A params object[] signature means an array allocation plus one box per value-type argument, whether or not the level is enabled. Source-generated logging avoids both.",
        ar: "تقييم الـ arguments يحدث في موضع الاستدعاء، قبل تنفيذ جسم الدالة. وتوقيع params object[] يعني allocation لـ array إضافة إلى box لكل argument من نوع value type، سواء كان المستوى مفعّلاً أم لا. الـ logging المولّد بالمصدر يتجنّب الاثنين."
      }
    },
    {
      q: { en: "You box a mutable struct, then change the original variable. What does the box contain?", ar: "عملت boxing لـ struct قابل للتعديل ثم غيّرت المتغيّر الأصلي. ماذا يحتوي الـ box؟" },
      options: [
        { en: "The new value — the box points at the original variable", ar: "القيمة الجديدة — الـ box يشير إلى المتغيّر الأصلي" },
        { en: "The old value — boxing copies, so the box and the original are independent", ar: "القيمة القديمة — الـ boxing ينسخ، فالـ box والأصل مستقلان" },
        { en: "Null, because the original was reassigned", ar: "null، لأن الأصل أُعيد إسناده" },
        { en: "Whichever was written last, since both share the same memory", ar: "أيّهما كُتب أخيراً، لأنهما يتشاركان الذاكرة نفسها" }
      ],
      correct: 1,
      why: {
        en: "Boxing copies the value into a new heap object. The box and the variable are two separate pieces of memory from that point on. This mismatch is a classic source of silent bugs and a strong argument for making structs readonly.",
        ar: "الـ boxing ينسخ القيمة إلى object جديد على الـ heap. ومن تلك اللحظة يصبح الـ box والمتغيّر قطعتي ذاكرة منفصلتين. هذا التباين مصدر كلاسيكي لأخطاء صامتة، وحجة قوية لجعل الـ structs من نوع readonly."
      }
    }
  ]
};
```

NEXT: gc-disposal
