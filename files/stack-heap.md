```js
const stackHeapLesson = {
  id: "stack-heap",
  moduleId: "runtime",
  title: { en: "Stack, heap and what lives where", ar: "الـ stack والـ heap وما يعيش في كل منهما" },
  summary: { en: "Where the runtime actually puts your locals and your objects, why that decides what an allocation costs, and when a value type quietly ends up on the heap anyway.", ar: "أين يضع الـ runtime فعلياً الـ locals والـ objects، ولماذا يحدّد ذلك تكلفة التخصيص، ومتى ينتهي الـ value type على الـ heap بهدوء رغم كل شيء." },
  mins: 15,
  sections: [
    {
      key: "why",
      blocks: [
        { t: "p",
          en: "Your program keeps data in two different places. The stack is a small scratch area that belongs to one method call and disappears the instant that call returns. The heap is a large shared area where objects stay alive until the garbage collector proves nobody can reach them anymore. Knowing which place a piece of data lands in tells you what it costs to create and who is responsible for cleaning it up.",
          ar: "برنامجك يحفظ البيانات في مكانين مختلفين. الـ stack مساحة صغيرة تخص استدعاء method واحد وتختفي لحظة انتهاء ذلك الاستدعاء. والـ heap مساحة كبيرة مشتركة تبقى فيها الـ objects حية حتى يثبت الـ garbage collector أن لا أحد يستطيع الوصول إليها. معرفة أين تهبط قطعة البيانات تخبرك بتكلفة إنشائها ومن المسؤول عن تنظيفها." },

        { t: "kv", rows: [
          { k: { en: "Stack", ar: "Stack" },
            v: { en: "A block of memory owned by one thread, about 1 MB by default. Each method call takes a slice off the top and gives it back on return.", ar: "كتلة ذاكرة يملكها thread واحد، حجمها نحو 1 MB افتراضياً. كل استدعاء method يأخذ شريحة من أعلاها ويعيدها عند الرجوع." } },
          { k: { en: "Stack frame", ar: "Stack frame" },
            v: { en: "The slice belonging to a single call: its parameters, its local variables, and the address to jump back to when it finishes.", ar: "الشريحة الخاصة باستدعاء واحد: parameters الخاصة به، والمتغيرات المحلية، والعنوان الذي يعود إليه عند الانتهاء." } },
          { k: { en: "Heap", ar: "Heap" },
            v: { en: "One shared memory area per process where objects are created. Nothing frees them by hand; the GC does it later.", ar: "مساحة ذاكرة واحدة مشتركة لكل process تُنشأ فيها الـ objects. لا أحد يحرّرها يدوياً؛ الـ GC يفعل ذلك لاحقاً." } },
          { k: { en: "GC (garbage collector)", ar: "GC (garbage collector)" },
            v: { en: "The part of the runtime that stops your threads for a moment, finds objects nobody can reach, and reclaims their memory.", ar: "جزء من الـ runtime يوقف الـ threads لحظة، ويجد الـ objects التي لا يصلها أحد، ويستعيد ذاكرتها." } },
          { k: { en: "Value type", ar: "Value type" },
            v: { en: "struct, int, decimal, DateTime, enum. The variable holds the actual bytes. Assigning it copies those bytes.", ar: "struct و int و decimal و DateTime و enum. المتغير يحمل البايتات نفسها. وإسناده ينسخ تلك البايتات." } },
          { k: { en: "Reference type", ar: "Reference type" },
            v: { en: "class, string, array, delegate. The variable holds a small address (8 bytes on 64-bit) pointing at bytes on the heap.", ar: "class و string و array و delegate. المتغير يحمل عنواناً صغيراً (8 بايت على 64-bit) يشير إلى بايتات على الـ heap." } },
          { k: { en: "Allocation", ar: "Allocation" },
            v: { en: "Reserving space for a new object on the heap. Cheap on its own, but every allocation adds future work for the GC.", ar: "حجز مساحة لـ object جديد على الـ heap. رخيص بحد ذاته، لكن كل allocation يضيف عملاً مستقبلياً على الـ GC." } }
        ]},

        { t: "p",
          en: "Think of the stack as the desk you work at. You put down the papers you need for the task in front of you, and when the task ends you sweep the whole desk clear in one motion — you do not sort the papers, you just clear the surface. The heap is the warehouse behind you. Anything you want to keep after the task ends goes to the warehouse, and someone has to walk the aisles later to find shelves nobody uses anymore. Sweeping the desk costs nothing. Walking the warehouse costs time, and that walk is the GC pause.",
          ar: "تخيّل الـ stack كمكتبك. تضع عليه الأوراق التي تحتاجها للمهمة أمامك، وعندما تنتهي المهمة تمسح سطح المكتب كله بحركة واحدة — لا ترتّب الأوراق، تنظّف السطح فقط. والـ heap هو المستودع خلفك. أي شيء تريد الاحتفاظ به بعد انتهاء المهمة يذهب إلى المستودع، ولا بد أن يمشي أحدهم بين الممرات لاحقاً ليجد الرفوف التي لم يعد أحد يستخدمها. مسح المكتب لا يكلّف شيئاً. أما المشي في المستودع فيكلّف وقتاً، وذلك المشي هو الـ GC pause." },

        { t: "p",
          en: "One example runs through this whole lesson. An endpoint GET /orders/{id}/total loads the lines of an order and adds them up. The order has 2,000 lines. Every version of this method does the same arithmetic and returns the same number — but the versions differ enormously in how much heap memory they touch, and that difference is what the rest of the lesson is about.",
          ar: "مثال واحد يمتد عبر هذا الدرس كله. endpoint اسمه GET /orders/{id}/total يحمّل سطور الطلب ويجمعها. الطلب فيه 2,000 سطر. كل نسخة من هذا الـ method تجري الحساب نفسه وتعيد الرقم نفسه — لكن النسخ تختلف اختلافاً كبيراً في مقدار ذاكرة الـ heap التي تلمسها، وهذا الفرق هو موضوع بقية الدرس." },

        { t: "callout", kind: "note",
          en: "The rule you have probably heard — 'value types go on the stack, reference types go on the heap' — is wrong often enough to be dangerous. What is actually true: a local variable of a value type usually sits in the stack frame, but the same struct as a field of a class lives inside that class's heap object, and a struct captured by a lambda or held by an async method moves to the heap too. Storage location follows the variable, not the type.",
          ar: "القاعدة التي سمعتها غالباً — «الـ value types على الـ stack والـ reference types على الـ heap» — خاطئة بما يكفي لتكون خطرة. الصحيح فعلياً: المتغير المحلي من نوع value يجلس عادة في الـ stack frame، لكن نفس الـ struct كـ field داخل class يعيش داخل object ذلك الـ class على الـ heap، والـ struct الذي يلتقطه lambda أو يحتفظ به async method ينتقل إلى الـ heap أيضاً. مكان التخزين يتبع المتغير لا النوع." }
      ]
    },

    {
      key: "problem",
      blocks: [
        { t: "p",
          en: "Here is the version of /orders/{id}/total that a team shipped first. It filtered the lines with a LINQ query, projected each line into a small class, and collected the results into a list before summing. For a 2,000-line order it created 2,000 projection objects, one list that grew and copied itself twelve times as it filled, an enumerator object, and one closure object holding the minimum-quantity filter. Measured with a memory profiler, one request allocated about 1.2 MB.",
          ar: "هذه هي النسخة الأولى من /orders/{id}/total التي أطلقها فريق. كانت تصفّي السطور بـ LINQ query، وتحوّل كل سطر إلى class صغير، وتجمع النتائج في list قبل الجمع. ولطلب فيه 2,000 سطر أنشأت 2,000 object إسقاط، وlist واحدة كبرت ونسخت نفسها اثنتي عشرة مرة وهي تمتلئ، وobject enumerator، وobject closure واحد يحمل فلتر الحد الأدنى للكمية. وبالقياس بـ memory profiler خصّص الطلب الواحد نحو 1.2 MB." },

        { t: "p",
          en: "The rewritten version does the same work with a plain foreach over the line array, a decimal accumulator, and no lambda. It allocates about 400 bytes per request — essentially just the array that came back from the database layer. Same output, same code length, roughly 3,000 times less garbage created per request.",
          ar: "النسخة المعاد كتابتها تنجز العمل نفسه بـ foreach عادي على مصفوفة السطور، ومتغير decimal للتجميع، وبلا lambda. تخصّص نحو 400 بايت لكل طلب — أي المصفوفة العائدة من طبقة قاعدة البيانات فقط تقريباً. نفس المخرجات، ونفس طول الكود، وحوالي 3,000 ضعف أقل من النفايات المُنتَجة لكل طلب." },

        { t: "kv", rows: [
          { k: { en: "Allocated per request", ar: "المخصَّص لكل request" },
            v: { en: "1.2 MB before, 400 bytes after. This is the total heap memory the request creates, whether or not it keeps it.", ar: "1.2 MB قبل، و400 بايت بعد. وهذا مجموع ذاكرة الـ heap التي ينشئها الطلب، سواء احتفظ بها أم لا." } },
          { k: { en: "Allocation rate at 300 req/s", ar: "معدل التخصيص عند 300 req/s" },
            v: { en: "360 MB every second before, 120 KB every second after. The GC has to keep up with whatever this number is.", ar: "360 MB كل ثانية قبل، و120 KB كل ثانية بعد. وعلى الـ GC أن يلاحق هذا الرقم مهما كان." } },
          { k: { en: "Gen0 collections per second", ar: "عمليات جمع Gen0 في الثانية" },
            v: { en: "About 45 before, under 1 after. A gen0 collection is the cheap, frequent GC pass over the newest objects — but each one still briefly pauses your threads.", ar: "نحو 45 قبل، وأقل من 1 بعد. جمع gen0 هو مرور الـ GC الرخيص المتكرر على أحدث الـ objects — لكن كل مرور يوقف الـ threads لحظة." } },
          { k: { en: "p99 latency", ar: "p99 latency" },
            v: { en: "8.1 ms before, 4.9 ms after. p99 means the slowest 1 request in every 100; the extra 3 ms was mostly threads waiting for GC pauses.", ar: "8.1 ms قبل، و4.9 ms بعد. وp99 تعني أبطأ طلب من كل مئة؛ والـ 3 ms الزائدة كانت في معظمها threads تنتظر GC pauses." } },
          { k: { en: "Working set", ar: "Working set" },
            v: { en: "1.9 GB before, 700 MB after. Working set is the physical RAM the process is actually holding — the number a container memory limit is compared against.", ar: "1.9 GB قبل، و700 MB بعد. الـ working set هو الـ RAM الفعلية التي يحتجزها الـ process — وهو الرقم الذي يُقارَن بحد ذاكرة الـ container." } }
        ]},

        { t: "p",
          en: "Notice what did not change: CPU time spent on the actual arithmetic. Adding 2,000 decimals is the same work in both versions. The entire difference came from where the intermediate data was stored. That is the practical reason to care about stack versus heap — not memory purity, but the pause time and the container limit that heap traffic drives.",
          ar: "لاحظ ما لم يتغيّر: وقت الـ CPU في الحساب نفسه. فجمع 2,000 قيمة decimal هو العمل ذاته في النسختين. الفرق كله جاء من مكان تخزين البيانات الوسيطة. وهذا هو السبب العملي للاهتمام بالـ stack مقابل الـ heap — ليس نقاء الذاكرة، بل زمن التوقف وحد الـ container اللذان تقودهما حركة الـ heap." }
      ]
    },

    {
      key: "internals",
      blocks: [
        { t: "p",
          en: "Walk through one call to the method and watch memory move. When the request handler calls Total(orderId), the CPU subtracts a number from a register called the stack pointer — a register is a tiny piece of storage inside the CPU itself, and the stack pointer holds the address of the current top of the stack. Subtracting from it reserves space in one instruction. That reserved space is the stack frame: room for the orderId parameter, the sum accumulator, the loop index, and the return address. No search happens, no bookkeeping is written. This is why people say stack allocation is free.",
          ar: "تابع استدعاءً واحداً للـ method وراقب حركة الذاكرة. عندما يستدعي معالج الطلب Total(orderId)، يطرح الـ CPU رقماً من register اسمه stack pointer — والـ register قطعة تخزين صغيرة داخل الـ CPU نفسه، والـ stack pointer يحمل عنوان قمة الـ stack الحالية. وطرح رقم منه يحجز المساحة بتعليمة واحدة. تلك المساحة المحجوزة هي الـ stack frame: مكان لـ parameter اسمه orderId، ومتغير التجميع sum، وعدّاد الحلقة، وعنوان العودة. لا بحث يحدث ولا سجلات تُكتب. ولهذا يقال إن تخصيص الـ stack مجاني." },

        { t: "code", lang: "csharp",
          label: { en: "One call, annotated with where each thing actually lives", ar: "استدعاء واحد، موضّح عليه مكان كل شيء فعلياً" },
          code: "public decimal Total(int orderId)\n{\n    // orderId  -> stack frame (4 bytes, a copy of the caller's value)\n    // lines    -> stack frame holds an 8-byte ADDRESS;\n    //             the OrderLine[] array itself is on the heap\n    OrderLine[] lines = _repo.GetLines(orderId);\n\n    // sum      -> stack frame (16 bytes; decimal is a struct)\n    decimal sum = 0m;\n\n    for (int i = 0; i < lines.Length; i++)   // i -> stack frame, often a CPU register\n    {\n        // line   -> a COPY of the struct, in the stack frame,\n        //           copied out of the array that lives on the heap\n        OrderLine line = lines[i];\n        sum += line.Quantity * line.UnitPrice;\n    }\n\n    return sum;   // sum's bytes are copied to the caller;\n}                 // the stack pointer moves back and the frame is gone" },

        { t: "p",
          en: "Now the heap side. _repo.GetLines returns an array, and creating that array is a heap allocation. The runtime keeps a pointer to the first free byte in the youngest part of the heap. Allocating means reading that pointer, adding the object's size to it, and writing two hidden fields at the start of the object: a method table pointer (which tells the runtime what type this is, so a virtual call or a cast can be resolved) and an object header (a few bytes the runtime uses for things like lock state and hash code). Two words of overhead per object, plus the data. This is called bump allocation, and it is only a handful of instructions.",
          ar: "الآن جانب الـ heap. الاستدعاء _repo.GetLines يعيد مصفوفة، وإنشاء تلك المصفوفة هو heap allocation. يحتفظ الـ runtime بمؤشّر إلى أول بايت حر في أحدث جزء من الـ heap. والتخصيص يعني قراءة ذلك المؤشّر، وإضافة حجم الـ object إليه، وكتابة حقلين مخفيين في بداية الـ object: method table pointer (يخبر الـ runtime ما هو هذا النوع، ليُحلّ استدعاء virtual أو cast) وobject header (بضعة بايتات يستخدمها الـ runtime لأشياء مثل حالة القفل والـ hash code). كلمتان من الزيادة لكل object، إضافة إلى البيانات. ويسمّى هذا bump allocation، وهو بضع تعليمات فقط." },

        { t: "p",
          en: "So if allocating is that cheap, where does the cost go? To the cleanup. Think of the heap's young area like a roll of tickets: tearing off the next ticket is instant, but when the roll runs out someone has to stop the queue and fit a new one. When the young area fills, the runtime pauses your threads, walks from a set of known starting points (static fields, live stack frames, CPU registers) to find every object still reachable, moves the survivors together to remove gaps, and resets the free pointer. That pause is proportional to how many objects survived, and the frequency of the pause is proportional to how fast you allocate. Both versions of Total allocate cheaply per object; the first one just does it 2,000 times more often.",
          ar: "إذا كان التخصيص بهذا الرخص، فأين تذهب التكلفة؟ إلى التنظيف. تخيّل المنطقة الصغيرة من الـ heap كلفة تذاكر: قطع التذكرة التالية فوري، لكن حين تنتهي اللفة على أحدهم أن يوقف الطابور ويركّب لفة جديدة. فحين تمتلئ المنطقة الصغيرة، يوقف الـ runtime الـ threads، ويمشي من نقاط بداية معروفة (الـ static fields، والـ stack frames الحية، وregisters الـ CPU) ليجد كل object ما زال قابلاً للوصول، ثم ينقل الناجين معاً لإزالة الفجوات ويعيد ضبط مؤشّر الفراغ. ذلك التوقف يتناسب مع عدد الناجين، وتواتره يتناسب مع سرعة تخصيصك. النسختان من Total تخصّصان برخص لكل object؛ الأولى فقط تفعل ذلك 2,000 مرة أكثر." },

        { t: "kv", rows: [
          { k: { en: "Stack pointer", ar: "Stack pointer" },
            v: { en: "A CPU register holding the top of the current thread's stack. Calls subtract from it, returns add back to it.", ar: "register في الـ CPU يحمل قمة stack الـ thread الحالي. الاستدعاءات تطرح منه والعودات تضيف إليه." } },
          { k: { en: "Method table pointer", ar: "Method table pointer" },
            v: { en: "The first hidden field of every heap object. Points at the type's runtime description, so casts and virtual calls know what they are dealing with.", ar: "أول حقل مخفي في كل heap object. يشير إلى وصف النوع في الـ runtime، فتعرف الـ casts والاستدعاءات الـ virtual مع ماذا تتعامل." } },
          { k: { en: "Gen0 / Gen1 / Gen2", ar: "Gen0 / Gen1 / Gen2" },
            v: { en: "Three age buckets on the heap. New objects start in gen0; objects that survive a collection are promoted upward. Collecting gen0 is fast; collecting gen2 walks everything.", ar: "ثلاث فئات عمرية على الـ heap. الـ objects الجديدة تبدأ في gen0، ومن ينجو من عملية جمع يُرقّى للأعلى. جمع gen0 سريع، وجمع gen2 يمشي على كل شيء." } },
          { k: { en: "LOH (Large Object Heap)", ar: "LOH (Large Object Heap)" },
            v: { en: "A separate area for objects of 85,000 bytes or more. It is collected only with gen2 and is not compacted by default, so it fragments.", ar: "منطقة منفصلة للـ objects بحجم 85,000 بايت فأكثر. تُجمَع فقط مع gen2 ولا تُضغَط افتراضياً، فتتشظّى." } },
          { k: { en: "Display class", ar: "Display class" },
            v: { en: "A hidden class the C# compiler generates to hold the local variables a lambda captures. It is a heap object, created every time you reach that lambda.", ar: "class مخفي يولّده مترجم C# ليحمل المتغيرات المحلية التي يلتقطها الـ lambda. وهو heap object يُنشأ في كل مرة تصل فيها إلى ذلك الـ lambda." } }
        ]},

        { t: "p",
          en: "The last row explains the closure allocation in the slow version. When a lambda uses a local variable from the enclosing method, that variable can no longer die with the stack frame — the lambda may run later. So the compiler rewrites the method: it creates a hidden class with a field per captured variable, and every read or write of that local becomes a read or write of the field. Your local silently became a heap object. The code below is roughly what the compiler produced for the slow version of Total.",
          ar: "السطر الأخير يشرح تخصيص الـ closure في النسخة البطيئة. فعندما يستخدم lambda متغيراً محلياً من الـ method المحيط، لم يعد ممكناً أن يموت ذلك المتغير مع الـ stack frame — لأن الـ lambda قد يعمل لاحقاً. لذلك يعيد المترجم كتابة الـ method: ينشئ class مخفياً بحقل لكل متغير ملتقَط، ويصير كل قراءة أو كتابة لذلك المتغير قراءة أو كتابة للحقل. متغيرك المحلي صار heap object بهدوء. والكود التالي تقريباً ما أنتجه المترجم للنسخة البطيئة من Total." },

        { t: "code", lang: "csharp",
          label: { en: "What the compiler does to a captured local", ar: "ما يفعله المترجم بمتغير محلي ملتقَط" },
          code: "// What you wrote:\ndecimal Total(OrderLine[] lines, int minQty)\n{\n    return lines.Where(l => l.Quantity >= minQty)   // minQty is captured\n                .Sum(l => l.Quantity * l.UnitPrice);\n}\n\n// Roughly what the compiler emits:\nsealed class Closure { public int minQty; }          // a HEAP object\n\ndecimal Total(OrderLine[] lines, int minQty)\n{\n    var c = new Closure();       // allocation #1\n    c.minQty = minQty;           // the local now lives on the heap\n    var pred = new Func<OrderLine, bool>(c.Check);  // allocation #2 (delegate)\n    // Where(...) allocates an iterator object       // allocation #3\n    // Sum(...)   allocates a second delegate        // allocation #4\n    ...\n}" },

        { t: "p",
          en: "Two more cases move data off the stack, and both surprise people. First, async methods: as soon as a method has an await in it, the compiler turns its locals into fields of a generated state machine object, because the method must be able to pause and resume after its stack frame is gone. Second, boxing: assigning a struct to a variable of type object or an interface copies the struct into a fresh heap object. Neither is visible in your source code, which is exactly why they show up in profiles rather than in reviews.",
          ar: "حالتان أخريان تنقلان البيانات خارج الـ stack، وكلتاهما تفاجئان الناس. الأولى الـ async methods: فبمجرد أن يحتوي method على await، يحوّل المترجم متغيراته المحلية إلى حقول في object state machine مولَّد، لأن الـ method يجب أن يستطيع التوقف والاستئناف بعد اختفاء الـ stack frame الخاص به. والثانية الـ boxing: فإسناد struct إلى متغير من نوع object أو interface ينسخ الـ struct إلى heap object جديد. ولا شيء من هذا ظاهر في الكود المصدري، ولهذا بالضبط يظهران في الـ profiles لا في المراجعات." }
      ]
    },

    {
      key: "tradeoffs",
      blocks: [
        { t: "tradeoff",
          pros: {
            en: [
              "Stack allocation is one instruction: move the stack pointer.",
              "Stack data is freed automatically on return, with zero GC involvement.",
              "A stack frame is contiguous and hot in CPU cache, so reads are fast.",
              "Lifetime is obvious from the code — the frame ends where the method ends."
            ],
            ar: [
              "تخصيص الـ stack تعليمة واحدة: تحريك الـ stack pointer.",
              "بيانات الـ stack تُحرَّر تلقائياً عند العودة، بلا أي تدخل من الـ GC.",
              "الـ stack frame متجاور وساخن في cache الـ CPU، فالقراءة منه سريعة.",
              "العمر واضح من الكود — الـ frame ينتهي حيث ينتهي الـ method."
            ]
          },
          cons: {
            en: [
              "The stack is about 1 MB per thread; overflowing it kills the process outright.",
              "Passing a large struct by value copies every byte at every call.",
              "Nothing on the stack can outlive the call that created it.",
              "You cannot force the JIT to keep something on the stack; it decides."
            ],
            ar: [
              "الـ stack نحو 1 MB لكل thread؛ وتجاوزه يقتل الـ process فوراً.",
              "تمرير struct كبير بالقيمة ينسخ كل بايت عند كل استدعاء.",
              "لا شيء على الـ stack يمكن أن يعيش بعد الاستدعاء الذي أنشأه.",
              "لا تستطيع إجبار الـ JIT على إبقاء شيء على الـ stack؛ هو من يقرّر."
            ]
          },
          limits: {
            en: [
              "Async methods and iterators move their locals to the heap regardless of type.",
              "A struct field inside a class always lives in that class's heap object.",
              "Objects of 85,000 bytes or more skip gen0 and go straight to the LOH.",
              "Reducing allocations helps latency and memory, never raw arithmetic speed."
            ],
            ar: [
              "الـ async methods والـ iterators تنقل متغيراتها المحلية إلى الـ heap مهما كان النوع.",
              "أي struct كـ field داخل class يعيش دائماً داخل heap object ذلك الـ class.",
              "الـ objects بحجم 85,000 بايت فأكثر تتخطى gen0 وتذهب مباشرة إلى الـ LOH.",
              "تقليل الـ allocations يفيد الـ latency والذاكرة، ولا يسرّع الحساب نفسه أبداً."
            ]
          },
          alts: {
            en: [
              "ArrayPool<T>.Shared: rent and return large buffers instead of allocating them.",
              "Span<T> over stackalloc: a short, fixed-size buffer with no heap involvement.",
              "Pass big structs with 'in' to avoid the copy while keeping value semantics.",
              "Leave it alone: if the profiler does not show GC pressure, this is not your bottleneck."
            ],
            ar: [
              "ArrayPool<T>.Shared: استأجر الـ buffers الكبيرة وأعدها بدل تخصيصها.",
              "Span<T> فوق stackalloc: buffer قصير ثابت الحجم بلا أي تدخل للـ heap.",
              "مرّر الـ structs الكبيرة بـ in لتتجنب النسخ مع الحفاظ على دلالات القيمة.",
              "اتركه كما هو: إن لم يُظهر الـ profiler ضغطاً على الـ GC فهذه ليست عنق الزجاجة عندك."
            ]
          }
        }
      ]
    },

    {
      key: "mistakes",
      blocks: [
        { t: "mistake",
          title: { en: "A large struct passed by value in a hot loop", ar: "struct كبير يُمرَّر بالقيمة داخل حلقة ساخنة" },
          body: { en: "Someone made OrderLine a struct 'to avoid allocations'. It has eight fields and is 96 bytes. It is then passed to a validation method inside a loop that runs 2,000 times per request, 300 times a second. That is 96 bytes copied 600,000 times a second — 57 MB/s of pure memcpy that does no work. The fix is not to make it a class; it is to pass it with 'in', which passes a read-only reference instead of a copy. Measure first: for a 16-byte struct the copy is cheaper than the indirection, so this only pays off on big structs.", ar: "جعل أحدهم OrderLine بنية struct «لتفادي الـ allocations». فيها ثمانية حقول وحجمها 96 بايت. ثم تُمرَّر إلى method تحقّق داخل حلقة تعمل 2,000 مرة لكل request، و300 مرة في الثانية. أي 96 بايت تُنسخ 600,000 مرة في الثانية — 57 MB/s من الـ memcpy الخالص الذي لا ينجز شيئاً. والحل ليس تحويله إلى class، بل تمريره بـ in فيُمرَّر مرجع للقراءة فقط بدل نسخة. وقِس أولاً: فلـ struct بحجم 16 بايت تكون النسخة أرخص من الـ indirection، فهذا لا يفيد إلا مع الـ structs الكبيرة." },
          fix: "// before: copies 96 bytes on every call\nbool IsValid(OrderLine line) => line.Quantity > 0;\n\n// after: passes a read-only reference, no copy\nbool IsValid(in OrderLine line) => line.Quantity > 0;" },

        { t: "mistake",
          title: { en: "A lambda inside a loop, allocating a closure per iteration", ar: "lambda داخل حلقة تخصّص closure في كل دورة" },
          body: { en: "A batch job looped over 50,000 orders and, inside the loop, called a helper that took a Func<OrderLine, bool> built from the current order's threshold. Because the lambda captured a variable declared inside the loop, the compiler created a fresh hidden closure object and a fresh delegate object on every iteration — 100,000 objects for one job run. Moving the captured value out of the lambda, or hoisting the lambda out of the loop when it does not depend on the iteration, removes all of them. The tell in a profiler is a type name containing '<>c__DisplayClass' at the top of the allocation list.", ar: "مهمة دفعية دارت على 50,000 طلب، وداخل الحلقة استدعت helper يأخذ Func<OrderLine, bool> مبنياً من عتبة الطلب الحالي. ولأن الـ lambda التقط متغيراً معرَّفاً داخل الحلقة، أنشأ المترجم closure object مخفياً جديداً وdelegate object جديداً في كل دورة — 100,000 object لتشغيلة واحدة. وإخراج القيمة الملتقَطة من الـ lambda، أو رفع الـ lambda خارج الحلقة إن لم يعتمد على الدورة، يزيلها كلها. والدليل في الـ profiler اسم نوع يحتوي '<>c__DisplayClass' في أعلى قائمة الـ allocations." },
          fix: "// before: new closure + new delegate every iteration\nforeach (var o in orders) {\n    int min = o.MinQty;\n    Process(l => l.Quantity >= min);\n}\n\n// after: no capture, so the delegate is cached once by the compiler\nforeach (var o in orders)\n    Process(o.MinQty, static (l, min) => l.Quantity >= min);" },

        { t: "mistake",
          title: { en: "Believing a struct field of a class sits on the stack", ar: "الاعتقاد أن struct كـ field في class يجلس على الـ stack" },
          body: { en: "A team converted several small classes to structs and expected heap traffic to drop. It did not move at all, because those structs were stored as fields of long-lived cache entry classes. A struct inside a class is part of that class's heap object — it has no independent existence and no stack frame of its own. The conversion only changes copy semantics, which introduced a separate bug: code that mutated the entry through a local copy silently stopped having any effect.", ar: "حوّل فريق عدة classes صغيرة إلى structs متوقعاً انخفاض حركة الـ heap. لم تتحرّك إطلاقاً، لأن تلك الـ structs كانت مخزَّنة كحقول في classes مدخلات cache طويلة العمر. فالـ struct داخل class جزء من heap object ذلك الـ class — لا وجود مستقل له ولا stack frame خاص به. والتحويل غيّر دلالات النسخ فقط، وهو ما أدخل خللاً منفصلاً: كود كان يعدّل المدخلة عبر نسخة محلية توقّف بهدوء عن إحداث أي أثر." },
          fix: "class CacheEntry { public OrderLine Line; }   // Line's bytes are INSIDE the heap object\n\nvar copy = entry.Line;   // a copy, on the stack\ncopy.Quantity = 5;       // mutates the copy only — entry is unchanged\nentry.Line.Quantity = 5; // mutates the real field on the heap" },

        { t: "mistake",
          title: { en: "stackalloc with a size that comes from the request", ar: "stackalloc بحجم قادم من الطلب" },
          body: { en: "An endpoint decoded a hex string from the query and used stackalloc byte[input.Length / 2] for the output buffer. stackalloc carves the buffer out of the current stack frame, and the stack is about 1 MB. A request with a 4 MB hex string overflowed the stack. StackOverflowException cannot be caught in .NET — the process is terminated immediately, taking every in-flight request on that instance with it. The rule: only stackalloc a small constant, and only after checking the caller-supplied length against it.", ar: "endpoint فكّ نص hex من الـ query واستخدم stackalloc byte[input.Length / 2] كـ buffer للمخرجات. الـ stackalloc يقتطع الـ buffer من الـ stack frame الحالي، والـ stack نحو 1 MB. فطلب بنص hex حجمه 4 MB تجاوز الـ stack. وStackOverflowException لا يمكن التقاطها في .NET — يُنهى الـ process فوراً ومعه كل طلب جارٍ على تلك النسخة. القاعدة: لا تستخدم stackalloc إلا بثابت صغير، وبعد فحص الطول القادم من المستدعي مقابله." },
          fix: "const int MaxStack = 256;\n\n// the conditional is target-typed to Span<byte>; both branches are valid there\nSpan<byte> buffer = len <= MaxStack ? stackalloc byte[MaxStack] : new byte[len];\nbuffer = buffer.Slice(0, len);   // trim to the length actually needed" }
      ]
    },

    {
      key: "interview",
      blocks: [
        { t: "qa", level: "junior",
          q: { en: "What is the difference between the stack and the heap?", ar: "ما الفرق بين الـ stack والـ heap؟" },
          a: { en: "The stack is per-thread scratch memory. Every method call takes a slice for its parameters and locals, and that slice is released the moment the method returns — it costs one instruction and the runtime never has to think about it again. The heap is one shared area where objects are created, and objects there stay alive until the garbage collector notices nobody can reach them. So the stack is fast and automatic but short-lived and small, about a megabyte. The heap can hold anything for as long as you need, but you pay for it later in GC pauses.", ar: "الـ stack ذاكرة مؤقتة لكل thread. كل استدعاء method يأخذ شريحة لـ parameters ومتغيراته المحلية، وتُحرَّر تلك الشريحة لحظة عودة الـ method — تكلفتها تعليمة واحدة ولا يعود الـ runtime يفكر بها. والـ heap مساحة واحدة مشتركة تُنشأ فيها الـ objects، وتبقى حية حتى يلاحظ الـ garbage collector أن لا أحد يصلها. فالـ stack سريع وتلقائي لكنه قصير العمر وصغير، نحو ميغابايت. والـ heap يحمل أي شيء لأي مدة، لكنك تدفع الثمن لاحقاً في GC pauses." } },

        { t: "qa", level: "mid",
          q: { en: "Is it true that value types always live on the stack?", ar: "هل صحيح أن الـ value types تعيش دائماً على الـ stack؟" },
          a: { en: "No, and it is a useful thing to get right. A local variable of a value type usually sits in the stack frame, but that is about the variable, not the type. The same struct as a field of a class lives inside that class's heap object. A struct captured by a lambda gets moved into a hidden closure object on the heap. A local in an async method becomes a field of a state machine object on the heap. And boxing — assigning a struct to object or to an interface — copies it into a fresh heap object. The honest version of the rule is: storage follows the variable, and the JIT decides.", ar: "لا، وضبط هذه النقطة مفيد. المتغير المحلي من نوع value يجلس عادة في الـ stack frame، لكن هذا يخص المتغير لا النوع. فنفس الـ struct كـ field في class يعيش داخل heap object ذلك الـ class. والـ struct الذي يلتقطه lambda يُنقل إلى closure object مخفي على الـ heap. والمتغير المحلي في async method يصير field في object state machine على الـ heap. والـ boxing — إسناد struct إلى object أو interface — ينسخه إلى heap object جديد. والصيغة الصادقة للقاعدة: التخزين يتبع المتغير، والـ JIT هو من يقرّر." } },

        { t: "qa", level: "mid",
          q: { en: "What happens to local variables in an async method?", ar: "ماذا يحدث للمتغيرات المحلية في async method؟" },
          a: { en: "They stop being stack variables. An async method has to be able to pause at an await and resume much later, possibly on a different thread, and by then its original stack frame is long gone. So the compiler rewrites the method into a state machine: every local that is still needed after an await becomes a field of a generated object, and that object goes on the heap the first time the method actually suspends. Practically: an async method that always completes without suspending stays cheap, but one that awaits real I/O allocates at least the state machine and the Task. That is why hot paths sometimes use ValueTask, and why 'this local is a struct so it is free' is not a safe assumption in async code.", ar: "تتوقف عن كونها متغيرات stack. فالـ async method يجب أن يستطيع التوقف عند await والاستئناف لاحقاً بوقت طويل، وربما على thread آخر، ويكون الـ stack frame الأصلي قد اختفى. لذلك يعيد المترجم كتابة الـ method كـ state machine: كل متغير محلي ما زال مطلوباً بعد await يصير field في object مولَّد، ويذهب ذلك الـ object إلى الـ heap أول مرة يتوقف فيها الـ method فعلاً. عملياً: الـ async method الذي ينتهي دائماً بلا توقف يبقى رخيصاً، أما الذي ينتظر I/O حقيقياً فيخصّص على الأقل الـ state machine والـ Task. ولهذا تستخدم المسارات الساخنة أحياناً ValueTask، ولهذا لا يصح افتراض «هذا المتغير struct إذاً هو مجاني» في كود async." } },

        { t: "qa", level: "senior",
          q: { en: "How do you decide whether an allocation is actually a problem?", ar: "كيف تقرّر أن allocation معيّن مشكلة فعلاً؟" },
          a: { en: "I look at the rate, not the size. One 1 MB allocation on startup is irrelevant; 400 bytes on a path that runs 50,000 times a second is 20 MB a second and will drive gen0 collections. So I start from the symptom: is p99 latency spiky, is the working set climbing, is the container getting OOM-killed. Then I check GC counters — allocation rate, gen0 and gen2 collection counts, and time in GC as a percentage. If time in GC is under about two percent I stop and look elsewhere, because removing allocations will not buy anything. If it is high, I take an allocation profile and fix the top two entries, which in my experience are almost always closures, LINQ chains in a loop, or string concatenation.", ar: "أنظر إلى المعدل لا إلى الحجم. فتخصيص 1 MB مرة عند الإقلاع لا يهم؛ بينما 400 بايت على مسار يعمل 50,000 مرة في الثانية تعني 20 MB في الثانية وستقود عمليات جمع gen0. لذلك أبدأ من العَرَض: هل الـ p99 latency متذبذب، هل الـ working set يتسلّق، هل الـ container يُقتل لنفاد الذاكرة. ثم أفحص عدّادات الـ GC — معدل التخصيص، وعدد عمليات جمع gen0 وgen2، ونسبة الوقت داخل الـ GC. فإن كان الوقت داخل الـ GC أقل من نحو 2% توقفت وبحثت في مكان آخر، لأن إزالة الـ allocations لن تشتري شيئاً. وإن كان مرتفعاً أخذت allocation profile وأصلحت أعلى بندين، وهما في خبرتي دائماً تقريباً closures، أو سلاسل LINQ داخل حلقة، أو دمج strings." } },

        { t: "qa", level: "senior",
          q: { en: "When would you reach for stackalloc or Span<T>?", ar: "متى تلجأ إلى stackalloc أو Span<T>؟" },
          a: { en: "When I need a short-lived buffer of a small, bounded size on a path that runs constantly — parsing a header, formatting a number, hashing a token. stackalloc carves the buffer straight out of the current stack frame, so there is no allocation and nothing for the GC to collect, and Span<T> is the safe wrapper that lets me pass it around without pointers. The two rules I hold to: the size must be a small constant, never something derived from user input, because overflowing the stack terminates the process and cannot be caught; and a Span over stack memory must never escape the method, which the compiler enforces. Above a couple of hundred bytes I switch to ArrayPool instead.", ar: "حين أحتاج buffer قصير العمر بحجم صغير ومحدود على مسار يعمل باستمرار — تحليل header، أو تنسيق رقم، أو hashing لـ token. الـ stackalloc يقتطع الـ buffer مباشرة من الـ stack frame الحالي، فلا allocation ولا شيء يجمعه الـ GC، وSpan<T> هو الغلاف الآمن الذي يتيح تمريره بلا pointers. وألتزم بقاعدتين: الحجم يجب أن يكون ثابتاً صغيراً لا شيئاً مشتقاً من مدخلات المستخدم، لأن تجاوز الـ stack ينهي الـ process ولا يمكن التقاطه؛ والـ Span فوق ذاكرة stack يجب ألا يخرج من الـ method، وهو ما يفرضه المترجم. وفوق بضع مئات من البايتات أنتقل إلى ArrayPool بدلاً منه." } },

        { t: "qa", level: "staff",
          q: { en: "Your service keeps regressing on memory, release after release. What do you change structurally?", ar: "خدمتك تتراجع في الذاكرة إصداراً بعد إصدار. ما الذي تغيّره بنيوياً؟" },
          a: { en: "Reviews will not catch this, because allocations are invisible in a diff — a LINQ chain looks identical whether it runs once or a million times. So I make the number visible and enforced. First, one BenchmarkDotNet suite over the three hottest endpoints, run in CI, with the allocated-bytes column asserted against a committed baseline; a pull request that increases it fails and the author has to either justify it or fix it. Second, allocation rate and time-in-GC go on the service dashboard next to latency, so a slow drift is noticed in a week instead of a quarter. Third, a short written rule about where micro-optimisation is allowed — the hot request path — and where it is banned, which is everywhere else, because unreadable code in a config loader buys nothing. The goal is that the trend is owned by the dashboard and CI, not by whoever happens to remember.", ar: "المراجعات لن تلتقط هذا، لأن الـ allocations غير مرئية في الـ diff — سلسلة LINQ تبدو نفسها سواء عملت مرة أو مليون مرة. لذلك أجعل الرقم مرئياً ومفروضاً. أولاً: مجموعة BenchmarkDotNet واحدة على أسخن ثلاثة endpoints، تعمل في الـ CI، مع تثبيت عمود allocated bytes مقابل خط أساس مُودَع؛ وأي pull request يرفعه يفشل ويضطر صاحبه إلى تبريره أو إصلاحه. ثانياً: معدل التخصيص ونسبة الوقت في الـ GC يوضعان على لوحة الخدمة بجانب الـ latency، فيُلاحَظ الانحراف البطيء خلال أسبوع بدل ربع سنة. ثالثاً: قاعدة مكتوبة قصيرة عن المكان المسموح فيه بالتحسين الدقيق — مسار الطلب الساخن — والمكان الممنوع، وهو كل ما عداه، لأن كوداً غير مقروء في محمّل الإعدادات لا يشتري شيئاً. والهدف أن يملك الاتجاهَ الداشبوردُ والـ CI، لا من يصادف أن يتذكر." } }
      ]
    },

    {
      key: "codereview",
      blocks: [
        { t: "review", severity: "high",
          title: { en: "stackalloc sized from caller input", ar: "stackalloc بحجم من مدخلات المستدعي" },
          bad: "public static byte[] FromHex(string hex)\n{\n    // hex comes from the query string; length is attacker-controlled\n    Span<byte> buf = stackalloc byte[hex.Length / 2];\n    for (int i = 0; i < buf.Length; i++)\n        buf[i] = Convert.ToByte(hex.Substring(i * 2, 2), 16);\n    return buf.ToArray();\n}",
          good: "public static byte[] FromHex(string hex)\n{\n    int len = hex.Length / 2;\n    if (len > MaxHexBytes) throw new ArgumentException(\"hex too long\");\n\n    byte[]? rented = len > 256 ? ArrayPool<byte>.Shared.Rent(len) : null;\n    Span<byte> buf = rented is null ? stackalloc byte[256] : rented;\n    buf = buf.Slice(0, len);\n    try\n    {\n        for (int i = 0; i < len; i++)\n            buf[i] = Convert.ToByte(hex.Substring(i * 2, 2), 16);\n        return buf.ToArray();\n    }\n    finally { if (rented is not null) ArrayPool<byte>.Shared.Return(rented); }\n}",
          why: { en: "The buffer is carved out of a roughly 1 MB stack, and its size is whatever the caller sent. A 4 MB hex string overflows the stack, and StackOverflowException cannot be caught in .NET — the whole process dies immediately, killing every other request being served by that instance. This is a denial-of-service bug reachable from a query string, not a performance nit. The fixed version bounds the length, uses a fixed small stackalloc for the common case, and rents from the pool for anything larger.", ar: "الـ buffer يُقتطع من stack حجمه نحو 1 MB، وحجمه هو ما أرسله المستدعي. فنص hex بحجم 4 MB يتجاوز الـ stack، وStackOverflowException لا يمكن التقاطها في .NET — يموت الـ process كله فوراً ويقتل معه كل طلب آخر تخدمه تلك النسخة. هذا خلل حجب خدمة يمكن الوصول إليه من query string، لا ملاحظة أداء صغيرة. والنسخة المصحّحة تحدّ الطول، وتستخدم stackalloc صغيراً ثابتاً للحالة الشائعة، وتستأجر من الـ pool لأي شيء أكبر." } },

        { t: "review", severity: "medium",
          title: { en: "A LINQ chain rebuilt on every request", ar: "سلسلة LINQ تُعاد بناؤها في كل request" },
          bad: "public decimal Total(OrderLine[] lines, int minQty)\n{\n    return lines.Where(l => l.Quantity >= minQty)\n                .Select(l => l.Quantity * l.UnitPrice)\n                .Sum();\n}",
          good: "public decimal Total(OrderLine[] lines, int minQty)\n{\n    decimal sum = 0m;\n    for (int i = 0; i < lines.Length; i++)\n    {\n        ref readonly OrderLine l = ref lines[i];\n        if (l.Quantity >= minQty) sum += l.Quantity * l.UnitPrice;\n    }\n    return sum;\n}",
          why: { en: "The LINQ version allocates a closure object holding minQty, two delegate objects, and one iterator object per Where/Select stage — five heap objects for every call, before touching a single line. On a path serving 300 requests a second that is 1,500 short-lived objects a second doing no useful work, and it is the kind of cost that never shows up in a diff. The loop version allocates nothing and reads the same way. Note this argument applies to a measured hot path only: in a request that runs once, LINQ is clearer and the allocations are irrelevant.", ar: "نسخة LINQ تخصّص closure object يحمل minQty، وdelegate objects اثنين، وiterator object لكل مرحلة Where/Select — خمسة heap objects لكل استدعاء قبل لمس أي سطر. وعلى مسار يخدم 300 طلب في الثانية يعني ذلك 1,500 object قصير العمر في الثانية بلا عمل مفيد، وهي تكلفة لا تظهر أبداً في الـ diff. أما نسخة الحلقة فلا تخصّص شيئاً وتُقرأ بالسهولة نفسها. ولاحظ أن هذه الحجة تخص مساراً ساخناً مقيساً فقط: ففي طلب يعمل مرة واحدة تكون LINQ أوضح والـ allocations غير مهمة." } }
      ]
    },

    {
      key: "sysdesign",
      blocks: [
        { t: "p",
          en: "At system level this stops being a micro-optimisation and becomes a capacity question. Heap traffic decides how much RAM a container needs, how often threads pause, and therefore how many instances you must run to hold a latency target. A service allocating 360 MB a second cannot share a 512 MB container limit with anything; the same service allocating 120 KB a second fits comfortably and stops being the reason the autoscaler adds pods.",
          ar: "على مستوى النظام يتوقف هذا عن كونه تحسيناً دقيقاً ويصير سؤال سعة. فحركة الـ heap تحدّد كم RAM يحتاج الـ container، وكم مرة تتوقف الـ threads، وبالتالي كم نسخة يجب أن تشغّل لتحافظ على هدف الـ latency. فخدمة تخصّص 360 MB في الثانية لا تستطيع مشاركة حد container بحجم 512 MB مع أي شيء؛ ونفس الخدمة وهي تخصّص 120 KB في الثانية تتّسع بارتياح وتتوقف عن كونها سبب إضافة الـ autoscaler لـ pods." },

        { t: "ul",
          en: [
            "Container memory limit: set it above the peak working set, not the average, or the GC gets squeezed into constant gen2 collections right before the OOM kill.",
            "Server GC vs workstation GC: server GC uses one heap and one background thread per core and is the default for ASP.NET Core. In a container limited to one CPU it can behave worse than workstation GC — check which mode you are actually running.",
            "Thread count: each thread reserves about 1 MB of stack address space. A design that spawns a thread per connection burns address space before it burns CPU; async I/O exists partly to avoid this.",
            "Streaming vs buffering: reading a 50 MB upload into a byte array puts it on the Large Object Heap, which is only collected with a full gen2 pass. Streaming it in pooled 64 KB chunks keeps the heap flat.",
            "Batch jobs and request paths need different rules: a nightly job can allocate freely, a request path serving thousands per second cannot."
          ],
          ar: [
            "حد ذاكرة الـ container: اضبطه فوق ذروة الـ working set لا فوق المتوسط، وإلا انضغط الـ GC في عمليات جمع gen2 مستمرة قبيل القتل لنفاد الذاكرة مباشرة.",
            "Server GC مقابل workstation GC: الـ server GC يستخدم heap واحداً وthread خلفياً لكل core وهو الافتراضي في ASP.NET Core. وفي container محدود بـ CPU واحد قد يتصرف أسوأ من workstation GC — تحقّق أي وضع تشغّل فعلاً.",
            "عدد الـ threads: كل thread يحجز نحو 1 MB من مساحة عناوين الـ stack. فتصميم يفتح thread لكل اتصال يستنفد مساحة العناوين قبل أن يستنفد الـ CPU؛ والـ async I/O موجود جزئياً لتفادي هذا.",
            "Streaming مقابل buffering: قراءة رفع بحجم 50 MB إلى byte array تضعه على الـ Large Object Heap الذي لا يُجمَع إلا مع مرور gen2 كامل. أما تمريره streaming بقطع 64 KB من pool فيبقي الـ heap مستوياً.",
            "المهام الدفعية ومسارات الطلبات تحتاج قواعد مختلفة: مهمة ليلية تستطيع التخصيص بحرية، ومسار طلب يخدم آلافاً في الثانية لا يستطيع."
          ]},

        { t: "callout", kind: "warn",
          en: "Do not start a design by minimising allocations. Start by making the code correct and readable, then measure. Teams that optimise allocations before profiling reliably end up with unreadable code and the bottleneck still sitting in a database query.",
          ar: "لا تبدأ التصميم بتقليل الـ allocations. ابدأ بجعل الكود صحيحاً ومقروءاً ثم قِس. فالفِرَق التي تحسّن الـ allocations قبل الـ profiling تنتهي دائماً بكود غير مقروء وعنق الزجاجة ما زال في استعلام قاعدة بيانات." }
      ]
    },

    {
      key: "perf",
      blocks: [
        { t: "kv", rows: [
          { k: { en: "Memory", ar: "Memory" },
            v: { en: "Stack data costs nothing beyond the ~1 MB already reserved per thread. Every heap object costs its fields plus about 16 bytes of header on 64-bit, and stays until a collection reclaims it.", ar: "بيانات الـ stack لا تكلّف شيئاً فوق الـ 1 MB المحجوزة أصلاً لكل thread. وكل heap object يكلّف حقوله زائد نحو 16 بايت header على 64-bit، ويبقى حتى تستعيده عملية جمع." } },
          { k: { en: "CPU", ar: "CPU" },
            v: { en: "Allocation itself is a pointer bump, a few nanoseconds. The CPU cost is in the collections your allocation rate causes, and in copying large structs by value.", ar: "التخصيص نفسه دفعة مؤشّر، بضع نانو ثانية. وتكلفة الـ CPU في عمليات الجمع التي يسبّبها معدل تخصيصك، وفي نسخ الـ structs الكبيرة بالقيمة." } },
          { k: { en: "Latency", ar: "Latency" },
            v: { en: "A gen0 pause is well under a millisecond; a gen2 pause can be tens of milliseconds. Averages hide both — the damage lands entirely on p99, the slowest 1 request in 100.", ar: "توقّف gen0 أقل بكثير من مللي ثانية؛ وتوقّف gen2 قد يبلغ عشرات المللي ثانية. والمتوسطات تخفي الاثنين — فالضرر كله يقع على p99، أبطأ طلب من كل مئة." } },
          { k: { en: "Scalability", ar: "Scalability" },
            v: { en: "Allocation rate scales linearly with traffic, so a path that is fine at 10 req/s can dominate GC time at 1,000 req/s without any code change.", ar: "معدل التخصيص يتناسب خطياً مع حركة المرور، فمسار سليم عند 10 req/s قد يهيمن على وقت الـ GC عند 1,000 req/s بلا أي تغيير في الكود." } },
          { k: { en: "Cache locality", ar: "Cache locality" },
            v: { en: "Stack frames and arrays of structs sit in contiguous memory, so the CPU prefetches them. An array of class references scatters the actual objects across the heap, costing a cache miss per element.", ar: "الـ stack frames ومصفوفات الـ structs تجلس في ذاكرة متجاورة، فيجلبها الـ CPU مسبقاً. أما مصفوفة مراجع class فتنثر الـ objects الفعلية عبر الـ heap، بتكلفة cache miss لكل عنصر." } }
        ]}
      ]
    },

    {
      key: "debug",
      blocks: [
        { t: "ul",
          en: [
            "dotnet-counters monitor --process-id <pid> System.Runtime — watch 'Allocation Rate' (bytes per second), 'GC Heap Size', and the gen0/gen1/gen2 collection counts. A rising allocation rate with a flat heap size means lots of short-lived garbage.",
            "dotnet-trace collect --providers Microsoft-DotNETCore-SampleProfiler --process-id <pid> — captures a trace you open in PerfView or Visual Studio; the allocation view ranks types by bytes allocated, and '<>c__DisplayClass' near the top means closures.",
            "BenchmarkDotNet with [MemoryDiagnoser] — its output adds an 'Allocated' column per benchmark, which is the honest way to compare two implementations of the same method.",
            "dotnet-dump collect then dotnet-dump analyze, and inside it run 'dumpheap -stat' — this lists every type on the heap with instance counts, which finds objects that are surviving rather than just being created.",
            "Visual Studio's .NET Object Allocation Tracking profiler — for a local reproduction it shows the exact call stack that allocated each type, which is usually enough to find the offending line in one pass."
          ],
          ar: [
            "dotnet-counters monitor --process-id <pid> System.Runtime — راقب 'Allocation Rate' (بايت في الثانية) و'GC Heap Size' وعدّادات جمع gen0/gen1/gen2. فارتفاع معدل التخصيص مع ثبات حجم الـ heap يعني نفايات كثيرة قصيرة العمر.",
            "dotnet-trace collect --providers Microsoft-DotNETCore-SampleProfiler --process-id <pid> — يلتقط trace تفتحه في PerfView أو Visual Studio؛ وعرض الـ allocations يرتّب الأنواع حسب البايتات المخصَّصة، ووجود '<>c__DisplayClass' قرب القمة يعني closures.",
            "BenchmarkDotNet مع [MemoryDiagnoser] — مخرجاته تضيف عمود 'Allocated' لكل benchmark، وهي الطريقة الصادقة لمقارنة تنفيذين لنفس الـ method.",
            "dotnet-dump collect ثم dotnet-dump analyze، ونفّذ داخلها 'dumpheap -stat' — تسرد كل نوع على الـ heap مع عدد النسخ، فتجد الـ objects الناجية لا التي تُنشأ فقط.",
            "profiler الـ .NET Object Allocation Tracking في Visual Studio — لإعادة إنتاج محلية يعرض call stack الدقيق الذي خصّص كل نوع، وهو عادة كافٍ لإيجاد السطر المسيء من مرور واحد."
          ]},

        { t: "callout", kind: "tip",
          en: "Before optimising anything, read the 'time in GC' percentage from dotnet-counters. Under roughly two percent, your problem is not allocation and no amount of struct tuning will help — go look at the database or an outbound call instead. Above ten percent, the allocation profile will almost certainly point at two or three fixable lines.",
          ar: "قبل تحسين أي شيء، اقرأ نسبة 'time in GC' من dotnet-counters. فتحت نحو 2% مشكلتك ليست في الـ allocation ولن ينفع أي ضبط للـ structs — اذهب وانظر إلى قاعدة البيانات أو استدعاء خارجي. وفوق 10% سيشير allocation profile شبه أكيد إلى سطرين أو ثلاثة قابلة للإصلاح." }
      ]
    },

    {
      key: "realworld",
      blocks: [
        { t: "p",
          en: "Where this matters is any system whose cost model is dominated by a small number of code paths executed constantly. In those systems a few hundred bytes per operation is the difference between fitting on the current hardware and adding a tier of machines. Everywhere else — admin screens, nightly reports, deployment tooling — the readable version of the code is the right version, and this whole topic is only worth knowing so you can recognise when it does not apply.",
          ar: "هذا يهم في أي نظام يهيمن على نموذج تكلفته عدد صغير من مسارات الكود التي تُنفَّذ باستمرار. ففي تلك الأنظمة تكون بضع مئات من البايتات لكل عملية هي الفرق بين الاتساع على العتاد الحالي وإضافة طبقة من الأجهزة. أما في كل ما عدا ذلك — شاشات الإدارة، والتقارير الليلية، وأدوات النشر — فالنسخة المقروءة من الكود هي النسخة الصحيحة، ولا يستحق هذا الموضوع كله المعرفة إلا لتعرف متى لا ينطبق." },

        { t: "ul",
          en: [
            "High-throughput HTTP frameworks: the parsing layer of a web server handles millions of small buffers a second, so headers are parsed with Span<T> over pooled memory and never turned into strings until someone asks for one.",
            "Real-time messaging platforms: a chat backend holds hundreds of thousands of open connections, so per-connection state is kept small and buffers are rented from a pool rather than allocated, because per-connection garbage multiplies by the connection count.",
            "Market data and trading systems: a gen2 pause of 40 ms is unacceptable, so these systems preallocate everything at startup, use structs and arrays for messages, and aim to allocate nothing at all during the trading day.",
            "Game and simulation servers: fixed tick loops run 30 to 60 times a second forever, so any allocation inside the loop becomes a periodic stutter that players feel as lag."
          ],
          ar: [
            "أُطر HTTP عالية الإنتاجية: طبقة التحليل في web server تتعامل مع ملايين الـ buffers الصغيرة في الثانية، فتُحلَّل الـ headers بـ Span<T> فوق ذاكرة من pool ولا تتحوّل إلى strings حتى يطلبها أحد.",
            "منصات الرسائل اللحظية: خادم دردشة يحتفظ بمئات آلاف الاتصالات المفتوحة، فتبقى حالة كل اتصال صغيرة وتُستأجَر الـ buffers من pool بدل تخصيصها، لأن نفايات كل اتصال تُضرَب في عدد الاتصالات.",
            "أنظمة بيانات السوق والتداول: توقّف gen2 بمقدار 40 ms غير مقبول، فتخصّص هذه الأنظمة كل شيء عند الإقلاع، وتستخدم structs ومصفوفات للرسائل، وتستهدف ألا تخصّص شيئاً إطلاقاً خلال يوم التداول.",
            "خوادم الألعاب والمحاكاة: حلقات الـ tick الثابتة تعمل 30 إلى 60 مرة في الثانية بلا توقف، فأي allocation داخل الحلقة يصير تلعثماً دورياً يشعر به اللاعبون كتأخير."
          ]}
      ]
    },

    {
      key: "exercises",
      blocks: [
        { t: "ex", diff: "easy",
          en: "Write a small console program with a class Point and a struct Point, each with two int fields. Create an array of 1,000,000 of each and print GC.GetTotalAllocatedBytes() before and after. You have it right when the struct array costs about 8 MB in one allocation and the class array costs roughly five times more spread over a million objects — then explain in one sentence where the extra bytes went.",
          ar: "اكتب برنامج console صغيراً فيه class اسمه Point وstruct اسمه Point، كل منهما بحقلين int. أنشئ مصفوفة من 1,000,000 من كل نوع واطبع GC.GetTotalAllocatedBytes() قبل وبعد. تكون قد أصبتها حين تكلّف مصفوفة الـ struct نحو 8 MB في تخصيص واحد، وتكلّف مصفوفة الـ class نحو خمسة أضعاف موزّعة على مليون object — ثم اشرح بجملة واحدة أين ذهبت البايتات الزائدة." },

        { t: "ex", diff: "medium",
          en: "Take the LINQ version of Total from this lesson and benchmark it against the for-loop version with BenchmarkDotNet and [MemoryDiagnoser], over an array of 2,000 lines. You have it right when the Allocated column shows a few hundred bytes for the LINQ version and 0 B for the loop version, and you can name each object the LINQ version allocated.",
          ar: "خذ نسخة LINQ من Total في هذا الدرس وقارنها بنسخة الحلقة for باستخدام BenchmarkDotNet مع [MemoryDiagnoser]، على مصفوفة من 2,000 سطر. تكون قد أصبتها حين يُظهر عمود Allocated بضع مئات من البايتات لنسخة LINQ و0 B لنسخة الحلقة، وتستطيع تسمية كل object خصّصته نسخة LINQ." },

        { t: "ex", diff: "hard",
          en: "Write a method that formats a decimal into a fixed-format string using stackalloc and Span<char> with no intermediate string allocations, and a naive version using string concatenation. Benchmark both. You have it right when the Span version allocates only the final string, the naive version allocates several, and your implementation rejects any requested width above a small constant instead of passing it to stackalloc.",
          ar: "اكتب method يحوّل قيمة decimal إلى string بتنسيق ثابت باستخدام stackalloc وSpan<char> بلا أي تخصيص strings وسيطة، ونسخة ساذجة بدمج الـ strings. قارن الاثنتين. تكون قد أصبتها حين تخصّص نسخة الـ Span الـ string النهائي فقط، وتخصّص الساذجة عدة strings، ويرفض تنفيذك أي عرض مطلوب فوق ثابت صغير بدل تمريره إلى stackalloc." },

        { t: "ex", diff: "senior",
          en: "Take a real endpoint in your service, run dotnet-counters against it under a load test, and record allocation rate, gen0 count per second and time in GC. Then remove the top allocation source from the profile and re-run. You have it right when you can write three sentences saying what the numbers were, what you changed, and — honestly — whether p99 latency actually moved, including the case where it did not.",
          ar: "خذ endpoint حقيقياً في خدمتك، شغّل dotnet-counters عليه تحت اختبار حِمل، وسجّل معدل التخصيص وعدد gen0 في الثانية ونسبة الوقت في الـ GC. ثم أزل أعلى مصدر تخصيص من الـ profile وأعد التشغيل. تكون قد أصبتها حين تستطيع كتابة ثلاث جمل تقول ما كانت الأرقام، وما الذي غيّرته، وبصدق هل تحرّك p99 latency فعلاً، بما في ذلك حالة أنه لم يتحرك." }
      ]
    },

    {
      key: "refs",
      blocks: [
        { t: "ref",
          label: { en: "Value types (C# language reference)", ar: "Value types (مرجع لغة C#)" },
          url: "https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/value-types",
          meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref",
          label: { en: "Fundamentals of garbage collection", ar: "أساسيات الـ garbage collection" },
          url: "https://learn.microsoft.com/en-us/dotnet/standard/garbage-collection/fundamentals",
          meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref",
          label: { en: "stackalloc expression", ar: "تعبير stackalloc" },
          url: "https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/stackalloc",
          meta: { en: "Docs", ar: "توثيق" } },
        { t: "ref",
          label: { en: "Eric Lippert — The stack is an implementation detail", ar: "Eric Lippert — الـ stack تفصيل تنفيذي" },
          url: "https://learn.microsoft.com/en-us/archive/blogs/ericlippert/the-stack-is-an-implementation-detail-part-one",
          meta: { en: "Article", ar: "مقال" } }
      ]
    }
  ],
  quiz: [
    {
      q: { en: "A struct is declared as a field of a class. Where do its bytes live?", ar: "struct معرَّف كـ field في class. أين تعيش بايتاته؟" },
      options: [
        { en: "On the stack, because it is a value type", ar: "على الـ stack، لأنه value type" },
        { en: "Inside the class's object on the heap", ar: "داخل object الـ class على الـ heap" },
        { en: "On the Large Object Heap", ar: "على الـ Large Object Heap" },
        { en: "In a separate stack frame of its own", ar: "في stack frame منفصل خاص به" }
      ],
      correct: 1,
      why: { en: "A struct has no independent existence when it is a field. Its bytes are stored inline inside the containing object, so if that object is on the heap, so are the struct's bytes. Storage location follows the variable that holds the value, not the type of the value — which is why 'value types live on the stack' is a misleading rule.", ar: "الـ struct لا وجود مستقلاً له حين يكون field. فبايتاته تُخزَّن داخل الـ object الحاوي مباشرة، فإن كان ذلك الـ object على الـ heap فبايتات الـ struct كذلك. مكان التخزين يتبع المتغير الذي يحمل القيمة لا نوع القيمة — ولهذا فقاعدة «الـ value types تعيش على الـ stack» مضلّلة." }
    },
    {
      q: { en: "What actually costs the most in the allocate-then-collect cycle?", ar: "ما الأغلى فعلياً في دورة التخصيص ثم الجمع؟" },
      options: [
        { en: "The allocation, because the runtime searches for free space", ar: "التخصيص، لأن الـ runtime يبحث عن مساحة حرة" },
        { en: "Writing the object header", ar: "كتابة الـ object header" },
        { en: "The collection, whose cost tracks how many objects survive", ar: "الجمع، وتكلفته تتبع عدد الـ objects الناجية" },
        { en: "Zeroing the memory of the new object", ar: "تصفير ذاكرة الـ object الجديد" }
      ],
      correct: 2,
      why: { en: "Allocation on the .NET heap is a bump of a pointer plus two hidden fields — a handful of instructions, so it is not the expensive part. The cost lands later: when the young area fills, the GC pauses your threads, traces from roots to find live objects, and moves the survivors together. That pause is proportional to how much survived, and how often it happens is proportional to your allocation rate. That is why the fix for GC pressure is allocating less often, not allocating faster.", ar: "التخصيص على heap الـ .NET دفعة مؤشّر زائد حقلين مخفيين — بضع تعليمات، فليس هو الجزء الغالي. التكلفة تأتي لاحقاً: فحين تمتلئ المنطقة الصغيرة يوقف الـ GC الـ threads، ويتتبّع من الجذور ليجد الـ objects الحية، وينقل الناجين معاً. ذلك التوقف يتناسب مع حجم ما نجا، وتواتره يتناسب مع معدل تخصيصك. ولهذا فعلاج ضغط الـ GC هو التخصيص أقل تكراراً لا التخصيص أسرع." }
    },
    {
      q: { en: "An async method has a local List<int> that is used after an await. Where does that local end up?", ar: "async method فيه متغير محلي List<int> يُستخدم بعد await. أين ينتهي ذلك المتغير؟" },
      options: [
        { en: "It stays in the stack frame, which is preserved across the await", ar: "يبقى في الـ stack frame، وهو محفوظ عبر الـ await" },
        { en: "It becomes a field of a compiler-generated state machine object on the heap", ar: "يصير field في object state machine مولَّد من المترجم على الـ heap" },
        { en: "It is copied to thread-local storage", ar: "يُنسخ إلى thread-local storage" },
        { en: "It is discarded and re-created after the await", ar: "يُهمَل ويُعاد إنشاؤه بعد الـ await" }
      ],
      correct: 1,
      why: { en: "An async method must be able to suspend at an await and resume later, possibly on a different thread, by which point its original stack frame no longer exists. So the compiler rewrites the method as a state machine and turns every local still needed after an await into a field of a generated object, which moves to the heap the first time the method actually suspends. This is why 'my locals are on the stack so they are free' is not a safe assumption inside async code.", ar: "الـ async method يجب أن يستطيع التوقف عند await والاستئناف لاحقاً، وربما على thread آخر، ويكون الـ stack frame الأصلي قد زال. لذلك يعيد المترجم كتابته كـ state machine ويحوّل كل متغير محلي ما زال مطلوباً بعد await إلى field في object مولَّد ينتقل إلى الـ heap أول مرة يتوقف فيها الـ method فعلاً. ولهذا لا يصح افتراض «متغيراتي على الـ stack إذاً هي مجانية» داخل كود async." }
    },
    {
      q: { en: "Why is stackalloc byte[userSuppliedLength] a serious bug rather than a style issue?", ar: "لماذا تُعد stackalloc byte[userSuppliedLength] خللاً خطيراً لا مسألة أسلوب؟" },
      options: [
        { en: "It allocates on the LOH, which fragments over time", ar: "تخصّص على الـ LOH الذي يتشظّى مع الوقت" },
        { en: "It boxes the buffer, adding GC pressure", ar: "تعمل boxing للـ buffer فتزيد ضغط الـ GC" },
        { en: "A large length overflows the ~1 MB stack, and StackOverflowException kills the process uncatchably", ar: "طول كبير يتجاوز الـ stack بحجم ~1 MB، وStackOverflowException تقتل الـ process بلا إمكانية التقاطها" },
        { en: "The buffer leaks because stackalloc memory is never reclaimed", ar: "يتسرّب الـ buffer لأن ذاكرة stackalloc لا تُستعاد أبداً" }
      ],
      correct: 2,
      why: { en: "stackalloc carves the buffer out of the current stack frame, and a thread's stack is about 1 MB. If the length comes from a request, an attacker chooses it, and one oversized request exhausts the stack. .NET treats stack overflow as unrecoverable: the process is terminated immediately and no catch block runs, so every other request being served by that instance dies too. That makes it a remotely triggerable denial of service. Always bound the length against a small constant and fall back to ArrayPool for anything bigger.", ar: "الـ stackalloc يقتطع الـ buffer من الـ stack frame الحالي، وstack الـ thread نحو 1 MB. فإن جاء الطول من الطلب اختاره المهاجم، وطلب واحد ضخم يستنفد الـ stack. و.NET يعامل تجاوز الـ stack كأمر غير قابل للتعافي: يُنهى الـ process فوراً ولا يعمل أي catch، فتموت معه كل الطلبات الأخرى على تلك النسخة. وهذا يجعله حجب خدمة يمكن تفعيله عن بُعد. حُدّ الطول دائماً بثابت صغير وارجع إلى ArrayPool لأي شيء أكبر." }
    },
    {
      q: { en: "dotnet-counters shows time in GC at 1.5% while p99 latency is 900 ms. What is the right next move?", ar: "يُظهر dotnet-counters وقتاً في الـ GC بنسبة 1.5% بينما p99 latency عند 900 ms. ما الخطوة الصحيحة التالية؟" },
      options: [
        { en: "Convert the hot path's classes to structs", ar: "حوّل classes المسار الساخن إلى structs" },
        { en: "Look elsewhere — GC is not the bottleneck at that percentage", ar: "ابحث في مكان آخر — الـ GC ليس عنق الزجاجة عند تلك النسبة" },
        { en: "Switch from server GC to workstation GC", ar: "بدّل من server GC إلى workstation GC" },
        { en: "Add more memory to the container", ar: "أضف ذاكرة أكبر للـ container" }
      ],
      correct: 1,
      why: { en: "Time in GC is the share of wall-clock time the process spends collecting. At 1.5% the absolute best case from eliminating every allocation in the service is about 13 ms off a 900 ms p99 — nothing. The remaining 98.5% is being spent somewhere else, almost always a slow database query, a missing index, or an outbound call without a timeout. Rewriting classes as structs here costs readability and buys nothing measurable, which is the classic way allocation tuning wastes a sprint.", ar: "الوقت في الـ GC هو حصة زمن الساعة التي يقضيها الـ process في الجمع. وعند 1.5% تكون أفضل حالة ممكنة من إزالة كل allocation في الخدمة نحو 13 ms من p99 مقداره 900 ms — أي لا شيء. والـ 98.5% الباقية تُنفَق في مكان آخر، غالباً استعلام قاعدة بيانات بطيء، أو index مفقود، أو استدعاء خارجي بلا timeout. وتحويل الـ classes إلى structs هنا يكلّف قابلية القراءة ولا يشتري شيئاً قابلاً للقياس، وهذه الطريقة الكلاسيكية التي يهدر بها ضبط الـ allocations sprint كاملاً." }
    }
  ]
};
```

NEXT: value-reference
