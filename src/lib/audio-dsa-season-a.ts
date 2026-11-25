import type { AudioDsaEpisode } from "@/lib/audio-dsa-types";

export const AUDIO_DSA_SEASON_A: AudioDsaEpisode[] = [
  {
    id: "ep-01-compile-vs-runtime",
    episodeNumber: 1,
    chapterNumber: 1,
    chapterTitle: "Season 1 · Programming Foundations",
    title: "The Illegal Hostel-Kettle Payasam Disaster",
    conceptTopic: "Compile-Time Error vs Runtime Error",
    durationLabel: "2:05",
    estimatedSeconds: 125,
    teaser:
      "Aarav tries cooking sweet semiya payasam in a secret dorm kettle to impress his senior crush—until Babloo parks red chilli powder next to the cardamom.",
    castTag: "Aarav · Babloo · Senior Neha · Mentor Priya",
    mappedProblems: ["Static Type Checking", "Division-by-Zero / Null Pointer Guards", "Syntax vs Exceptions"],
    segments: [
      {
        speaker: "narrator",
        label: "Hook · Midnight Dorm Masterchef",
        text: "Welcome to Episode 1 of Code by Ear! Picture third-floor Block B at 11:30 PM. Second-year CS guy Aarav has one risky mission: cook grandma-level sweet semiya payasam inside a totally illegal hostel electric kettle before Senior Neha drops by for notes.",
        sfx: "start",
      },
      {
        speaker: "character",
        label: "Setup · The Kitchen Prep Table",
        text: "On the study desk sits his strict ingredients table: roasted vermicelli, full-cream milk, ghee, sugar, cashews, and crushed cardamom. Two feet away, his chaotic roommate Babloo was cooking nuclear two-AM hostel Maggi and casually left an identical unlabeled jar of extra-hot Kashmiri red chilli powder right beside the sugar!",
      },
      {
        speaker: "narrator",
        label: "Twist · Two Very Different Explosions",
        text: "Notice Aarav has two completely different ways to humiliate himself tonight. Scenario A: Before even plugging in the kettle, Aarav reads his desk ingredients table, spots bright-red chilli sitting under the 'sweet garnish' slot, and yells, 'Bro! Who puts spicy chilli powder inside payasam?' Zero electricity wasted. Zero milk ruined. Fixed in two seconds!",
        sfx: "scratch",
      },
      {
        speaker: "punchline",
        label: "The Punchline · Serving Senior Neha",
        text: "Scenario B: Aarav skips the desk inspection, plugs in the kettle, boils milk for twenty heroic minutes, sprinkles dry fruit on top, hands Neha a romantic steel tumbler... she takes ONE confident spoonful—pause for dramatic regret—her soul briefly leaves her body, smoke practically exits her ears, and Babloo shouts, 'Relax Didi, it's limited-edition Andhra Fusion Payasam!'",
        pauseBeforeMs: 380,
        sfx: "rimshot",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Full Technical Breakdown",
        text: "That dorm disaster nails Compile-Time versus Runtime Errors! Checking the ingredients table BEFORE hitting the power switch is Compile Time: C++, Java, or TypeScript validates grammar, syntax, semicolons, and strict data types before generating machine code. Putting chilli string into a sweet integer fails the build immediately. By contrast, Runtime Errors look completely legal on paper and only detonate AFTER live execution starts—like dividing by user input zero, dereferencing a null pointer, or stepping outside array index `n` when real traffic hits your server!",
        pauseBeforeMs: 300,
        sfx: "ding",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Checking desk ingredients table with kettle UNPLUGGED",
        technicalConcept: "Compile-Time Verification (Static Check)",
        whyItMatches: "Compiler inspects syntax, types, and declarations before running 1 line.",
      },
      {
        storyElement: "Catching chilli powder in the sweet spice slot pre-boil",
        technicalConcept: "Compile-Time Error (Syntax / Type Mismatch)",
        whyItMatches: "Zero CPU time wasted executing broken code; caught right in your IDE.",
      },
      {
        storyElement: "Kettle boils cleanly and looks sweet until Neha takes a sip",
        technicalConcept: "Clean Compilation, Fatal Runtime Crash",
        whyItMatches: "Code satisfies compiler grammar, then hits an illegal runtime state.",
      },
      {
        storyElement: "Coughing fire on live sip / empty bowl division",
        technicalConcept: "Runtime Error (`ZeroDivision`, `NullPointer`, `Out-of-Bounds`)",
        whyItMatches: "Explodes dynamically only on specific live inputs during execution.",
      },
    ],
    technicalExplanation:
      "Compile-time errors catch static violations (missing semicolons, wrong types, misspelled symbols) before a binary runs. Runtime errors pass compilation and crash during execution when operations violate CPU/memory constraints (dividing by zero, stack overflow, invalid pointer access).",
    miniSnippet: {
      language: "cpp",
      code: `// Compile-Time Error (caught at ingredients check):
int sugarSpoons = "chilli"; // ❌ Type mismatch caught before running!

// Runtime Error (compiles fine, explodes when live input hits):
int mlPerCup = totalMilk / guestsCount; // 💥 Crashes if guestsCount == 0!`,
      complexity: "Static Build Gate vs. Dynamic Live Exception",
    },
    quiz: {
      prompt:
        "During Hackathon prep, your TypeScript build catches a misspelled property name before launching, while later a Python endpoint crashes ONLY when a student enters `0` coupons (`100 / coupons`). Which statement is exact?",
      scenarioHint: "Kettle OFF check = compile time; Kettle ON & tasting = runtime.",
      options: [
        "1st is a Runtime Error; 2nd is a Compile-Time Error",
        "1st is a Compile-Time Error (caught before run); 2nd is a Runtime Error (crashes on live input 0)",
        "Both are Compile-Time Errors because zero is always invalid",
        "Python skips runtime checks completely",
      ],
      correctIndex: 1,
      correctFeedback:
        "Spot on! Static tooling caught the typo before execution (Compile Time), whereas dividing by live user input zero detonated mid-flight (Runtime Error)!",
      wrongFeedback:
        "Check when the mistake explodes: caught at static build time = Compile Time; triggered only when live input executes = Runtime!",
    },
    recallKeywords: ["compile", "before", "runtime", "executing", "type", "syntax", "crash"],
    bonusRecallPrompt:
      "How does Aarav's payasam explain why statically typed languages catch bugs earlier than dynamic scripts?",
  },
  {
    id: "ep-02-variables-references",
    episodeNumber: 2,
    chapterNumber: 1,
    chapterTitle: "Season 1 · Programming Foundations",
    title: "The 3 AM Group Assignment Google Doc Betrayal",
    conceptTopic: "Variables, RAM Pointers & Pass-by-Value vs. Reference",
    durationLabel: "2:00",
    estimatedSeconds: 120,
    teaser:
      "Never give your chaotic roommate Edit Access instead of Export PDF—an unforgettable lesson on Heap references vs Value copies.",
    castTag: "Aarav · Babloo · Prof. Verma · Mentor Priya",
    mappedProblems: ["Swap Without Temp / Mutating Slices", "In-Place Array Ops", "Deep vs Shallow Copy"],
    segments: [
      {
        speaker: "narrator",
        label: "Hook · 8:55 AM Submission Panic",
        text: "Episode 2 picks up the next morning! After recovering from chilli-payasam embarrassment, Aarav pulls an all-nighter writing their crisp 14-page DBMS Mini-Project Report. Every variable sitting inside his laptop RAM is like a labeled dorm locker holding data at a specific locker number.",
      },
      {
        speaker: "character",
        label: "Setup · PDF Copy vs. Live Edit Link",
        text: "Now Babloo wakes up at 8:40 AM yelling, 'Bro send report ASAP, gotta change font to Comic Sans!' On Lab 1, Aarav exported a **Download PDF Copy** and WhatsApped it. Babloo slapped neon green highlights and meme stickers all over his local PDF—and Aarav's clean master draft stayed untouched! Unfortunately on Lab 2, half-asleep Aarav accidentally sent the **Live Editable Google Doc URL** (`Anyone with link can EDIT`)!",
        sfx: "scratch",
      },
      {
        speaker: "punchline",
        label: "Punchline · Live Classroom Reveal",
        text: "At 9:00 AM sharp, Aarav hits Present in front of eighty classmates and grumpy Professor Verma... Slide 1 doesn't say 'Normalization & B-Trees.' Thanks to Babloo's live pointer access, a 72-point glowing banner screams: 'PROFESSOR PLS PASS US, WE BROUGHT SAMOSAS.' Notice why! Aarav handed over the **live memory address**, NOT a separate photocopy!",
        pauseBeforeMs: 380,
        sfx: "rimshot",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Full Technical Breakdown",
        text: "That heart attack is **Pass-by-Value vs. Pass-by-Reference**! Pass-by-Value passes an isolated photocopy into the caller's stack frame: safe from accidental edits, but cloning a million-element array eats massive `O(n)` time and RAM. Pass-by-Reference (C++ `&`, Java/Python object/list references) passes an `O(1)` 8-byte memory address straight to the original Google Doc! In DSA, whenever you pass huge graphs or recursion `visited` sets, ALWAYS pass by reference (`const &` when read-only, `&` when modifying in-place) unless you intentionally want isolated backtracking copies!",
        pauseBeforeMs: 300,
        sfx: "ding",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Sending a downloaded PDF copy on WhatsApp",
        technicalConcept: "Pass-by-Value (Deep Clone / Stack Copy)",
        whyItMatches: "Mutating the copy leaves caller's master data untouched, at `O(size)` cost.",
      },
      {
        storyElement: "Sending live Google Doc Edit URL (actual doc address)",
        technicalConcept: "Pass-by-Reference / Pointer Alias (`vector<int>&`)",
        whyItMatches: "Instant `O(1)` handoff; any edit alters the single shared source of truth!",
      },
      {
        storyElement: "View-Only Google Doc link (read fast, zero vandalism)",
        technicalConcept: "`const T&` (Constant Reference)",
        whyItMatches: "Best of both worlds: `O(1)` zero-copy speed AND compile-time edit protection!",
      },
    ],
    technicalExplanation:
      "Every variable resides at a memory address. Passing large containers (`vector`, `string`, `grid`) by value inside recursion copies millions of bytes per frame, causing Memory/Time Limit Exceeded. Passing via reference `&` (or `const &`) avoids cloning while signaling mutability explicitly.",
    miniSnippet: {
      language: "cpp",
      code: `void cloneDfs(vector<int> grid) {}        // ❌ Copies whole array every recursive call (O(n)!)
void fastRead(const vector<int>& grid) {} // ✅ O(1) ref handoff + read-only safety
void mutateInPlace(vector<int>& arr) { arr[0] = 42; } // ✅ Direct Google Doc edit`,
      complexity: "Pass-by-Ref: O(1) handoff vs Pass-by-Value: O(N) copy",
    },
    quiz: {
      prompt:
        "During a LeetCode recursion (`dfs(i, vector<vector<int>> grid)`), a student forgets the `&` reference symbol on a `1000 × 1000` grid and hits immediate TLE + MLE despite `O(V + E)` logic. Why?",
      scenarioHint: "Did every single recursive call email a fresh 1-million-cell PDF photocopy instead of sharing the URL?",
      options: [
        "Because C++ forbids passing 2D vectors into functions",
        "Passing `grid` by value clones all `1,000,000` integers on EVERY recursive stack frame!",
        "References make arrays slower inside CPU registers",
        "Because `grid` gets automatically sorted on every call",
      ],
      correctIndex: 1,
      correctFeedback:
        "Boom! Cloning a million cells per recursion frame explodes runtime and stack RAM cleanly avoided with `vector<vector<int>>& grid`!",
      wrongFeedback:
        "Think about duplicating Babloo's 14-page document 1,000 times inside nested calls—without `&`, C++ copies the entire grid on every call!",
    },
    recallKeywords: ["value", "copy", "reference", "const", "address", "mutate"],
    bonusRecallPrompt:
      "Why is `const vector<int>&` the golden signature default for read-only helpers in C++?",
  },
  {
    id: "ep-03-loops-and-invariants",
    episodeNumber: 3,
    chapterNumber: 1,
    chapterTitle: "Season 1 · Programming Foundations",
    title: "2 AM Reels Doomscroll & Waiter Raju's Gravy Loop",
    conceptTopic: "For/While Loops, Off-By-One Bugs & Infinite Loop TLE",
    durationLabel: "2:00",
    estimatedSeconds: 120,
    teaser:
      "Aarav opens Instagram 'for just 10 minutes before OS exam'—meanwhile Waiter Raju fills Babloo's thali until the mess floods.",
    castTag: "Aarav · Babloo · Waiter Raju · Mentor Priya",
    mappedProblems: ["Two-Pointer Termination", "Binary Search Infinite Loop Trap", "Off-By-One Grid Bounds"],
    segments: [
      {
        speaker: "narrator",
        label: "Hook · 'One More Reel Before Sleep'",
        text: "Welcome to Episode 3! Why do programmers fear infinite loops? Because you live one every Tuesday night at 1:45 AM: `while (stillBored) scrollNextReel()`—and suddenly sunlight hits your curtains at 7:30 AM!",
      },
      {
        speaker: "character",
        label: "Setup · Hostel Canteen's Literal Robot",
        text: "On Sunday night, Babloo tests that exact bug in real life at Gupta Chacha's mess stall. Waiter Raju runs a strict `while` loop rule: 'While customer has NOT shouted STOP, pour one heavy ladle of hot dal fry.' Babloo grins: 'Free refill glitch! Watch me eat half a cauldron!' Everything works through scoop four... until Babloo accidentally chokes on a cardamom pod and loses his voice completely!",
        sfx: "scratch",
      },
      {
        speaker: "punchline",
        label: "Punchline · Swimming Inside Dal Fry",
        text: "Aarav yells from table three, but Raju ONLY listens to Babloo's exit flag! Scoop ten... scoop eighty... dal cascades over the tray, floats Babloo's Converse sneakers past the water cooler, and Waiter Raju whispers politely between ladles: `'Error 504: Still waiting on boolean condition STOP.'` Nobody in the loop actually changed the variable checking exit!",
        pauseBeforeMs: 360,
        sfx: "rimshot",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Full Technical Breakdown",
        text: "Every safe loop obeys a strict **Loop Variant**: a quantity guaranteed to march closer to termination on EVERY single pass! In DSA, two classic bugs destroy loops. Number 1: **Stuck `while` condition**—like writing `l = mid` in Binary Search when `mid` rounds down to `l`, freezing forever (`TLE`). Number 2: **Off-by-one boundaries**—writing `i <= arr.length` instead of `i < arr.length`, stepping straight off Chair N minus 1 into crash territory (`ArrayIndexOutOfBounds` / garbage memory)!",
        pauseBeforeMs: 300,
        sfx: "ding",
      },
    ],
    comparisonRows: [
      {
        storyElement: "`while (!customerSaysStop) pourDal()`",
        technicalConcept: "Condition-Driven `while` Loop",
        whyItMatches: "Continues indefinitely until the controlling state flips.",
      },
      {
        storyElement: "Choking mute so the exit flag never flips to true",
        technicalConcept: "Infinite Loop -> Time Limit Exceeded (TLE)",
        whyItMatches: "If loop body stops advancing state toward termination, CPU hangs.",
      },
      {
        storyElement: "Handing tray #100 when trays are numbered `0..99`",
        technicalConcept: "Off-by-One (`<= n` vs `< n`) Boundary Bug",
        whyItMatches: "0-based indexing ends at `n - 1`; reaching `n` crashes!",
      },
    ],
    technicalExplanation:
      "A `for` loop shines for fixed known bounds (`0` to `n - 1`), while `while` shines for sliding windows, BFS queues, and convergence pointers. Proving why `right - left` strictly shrinks each step guarantees zero infinite-loop TLEs.",
    miniSnippet: {
      language: "cpp",
      code: `// Safe loop invariant check: interval [l, r] strictly shrinks every turn!
int l = 0, r = n - 1;          // 0-indexed: NEVER <= n!
while (l < r) {
  int mid = l + (r - l) / 2;   // Rounds toward l!
  if (ok(mid)) r = mid; else l = mid + 1; // +1 ensures guaranteed movement!
}`,
      complexity: "Guaranteed O(iterations) when variant strictly decreases",
    },
    quiz: {
      prompt:
        "During an online contest, a student scans an array of `5` elements (`indices 0..4`) using `for (int i = 0; i <= nums.size(); i++)`. Why does Java throw `IndexOutOfBoundsException` or C++ trigger undefined behavior?",
      scenarioHint: "Count carefully: `[0, 1, 2, 3, 4]` has length `5`. What happens on turn `i = 5`?",
      options: [
        "Because `0` is an illegal starting array index",
        "Using `<=` instead of `<` attempts to read index `nums[5]`, one slot past the final valid index `4` (`Off-by-One`)",
        "`nums.size()` returns elements squared",
        "Only Python allows `<=` inside loops",
      ],
      correctIndex: 1,
      correctFeedback:
        "Crisp catch! Five slots live at `0, 1, 2, 3, 4`—`i <= n` knocks on non-existent room `5`, classic Off-by-One crash!",
      wrongFeedback:
        "With 0-based indexing on length `5`, valid boxes end at `4` (`n - 1`). So `<= 5` tries peeking at missing box `5`!",
    },
    recallKeywords: ["infinite", "tle", "off-by-one", "shrinks", "invariant", "condition"],
    bonusRecallPrompt:
      "In upper-bound/lower-bound Binary Search (`while (l < r)`), why do we check whether `(l + r) / 2` or `(l + r + 1) / 2` pairs with `l = mid`?",
  },
  {
    id: "ep-04-recursion-call-stack",
    episodeNumber: 4,
    chapterNumber: 1,
    chapterTitle: "Season 1 · Programming Foundations",
    title: "The 8 AM Proxy Attendance Chain (`Call Stack`)",
    conceptTopic: "Functions, Recursion, Call Stack Memory & Base Cases",
    durationLabel: "2:05",
    estimatedSeconds: 125,
    teaser:
      "Aarav delegates marking his 8 AM proxy down 50 sleeping bench-mates—until nobody sits in Row 1 to actually say 'Present Sir!'",
    castTag: "Aarav · Babloo · Row-1 Sleeper · Mentor Priya",
    mappedProblems: ["Factorial / Tree DFS", "Subsets & Backtracking Frames", "Call Stack Overflow Fix"],
    segments: [
      {
        speaker: "narrator",
        label: "Hook · 7:59 AM Proxy Mission",
        text: "Episode 4! It's pouring rain before the 8 AM Software Engineering lecture, so Aarav texts Back-Row Seat 50: 'Wait, pass this proxy forward—tap the bench ahead of you until someone hits Row 1 and yells Present when Prof calls Aarav!'",
      },
      {
        speaker: "character",
        label: "Setup · Paused Students Waiting for Row 1",
        text: "Watch what builds up vertically across the classroom! Student 50 pauses homework, taps Student 49 (`Waiting for 49's reply!`). Student 49 taps 48, 48 taps 47, stacking 49 paused listeners waiting mid-air! If Seat 1 yells `'Present!'` (**Base Case!**), relief cascades backward cleanly: 1 tells 2 `'Done!'`, 2 tells 3 `'Done!'`, up to 50 (**Unwinding!**).",
        sfx: "scratch",
      },
      {
        speaker: "punchline",
        label: "Punchline · Missing Row 1",
        text: "Twist: nobody told Seat 1 to STOP passing forward! So Seat 1 pokes the empty podium air: `'Yo Desk 0, mark Aarav present!'` Desk 0 yells back `'Desk -1?!'`—soon 100,000 imaginary ghosts stack straight through the floor until the professor yells **`STACK OVERFLOW`** and locks the classroom door!",
        pauseBeforeMs: 380,
        sfx: "rimshot",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Full Technical Breakdown",
        text: "Every single time a function calls itself (**Recursion**), the CPU pushes a **Stack Frame** (storing arguments, local variables, and return address) onto the finite **Call Stack** (~1–8 MB RAM)! Two sacred rules prevent crashes: (1) Always hit an explicit **Base Case** before going below zero (`if (node == null)` or `if (n <= 1)`), and (2) EVERY recursive call must shrink closer toward that Base Case! Bonus senior insight: recursion isn't zero-space magic—its call stack costs **`O(max recursion depth)` space**, which is why iterative tail loops sometimes rescue ultra-deep chains of `10^6` nodes!",
        pauseBeforeMs: 300,
        sfx: "ding",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Student 50 waiting mid-breath for 49 -> 48 -> ... -> 1",
        technicalConcept: "Paused Call Stack Frames (`O(depth)` RAM)",
        whyItMatches: "Outer function waits paused on stack until inner child call returns.",
      },
      {
        storyElement: "Seat 1 yelling 'Present!' cleanly instead of asking Desk 0",
        technicalConcept: "Base Case Condition (`if (n == 1) return;`)",
        whyItMatches: "Stops downward recursion and starts clean unwinding.",
      },
      {
        storyElement: "Asking Desk 0 -> -1 -> -50000 until classroom memory dies",
        technicalConcept: "StackOverflowError / Segmentation Fault",
        whyItMatches: "Call stack capacity exhausted due to missing/unreachable base case.",
      },
    ],
    technicalExplanation:
      "Recursion decomposes problem `P(n)` into `self(smaller_n)` + combine step. Because each live frame sits on the CPU call stack (`O(depth)` space), skewed graphs/lists of depth `10^5` can overflow the stack and need explicit iterative stacks.",
    miniSnippet: {
      language: "cpp",
      code: `int sumRange(int n) {
  if (n <= 0) return 0;      // 🛑 Seat 1 Base Case: stop delegating!
  return n + sumRange(n - 1); // 🔄 Strictly smaller (n - 1) toward 0!
}`,
      complexity: "O(n) time · O(n) Call Stack depth space!",
    },
    quiz: {
      prompt:
        "You run `dfs(head)` recursively down an extreme Linked List containing **500,000 (`5×10⁵`) nodes** in sequence (`1 -> 2 -> ... -> 500000`). Even though your base case `if (!node) return;` IS present, the judge still crashes with **Segmentation Fault / StackOverflowError**. Why?",
      scenarioHint: "How many paused students simultaneously hold their breath when the chain is 500,000 benches deep?",
      options: [
        "Recursion cannot read values greater than 100",
        "500,000 simultaneous active Call Stack frames exceed OS thread stack limit (~1–8 MB); convert to an iterative `while (curr)` loop (`O(1)` stack)!",
        "The base case never triggered after node 10",
        "500,000 nodes triggers a Compile-Time Error",
      ],
      correctIndex: 1,
      correctFeedback:
        "Senior SDE answer! Recursion isn't free memory—half a million nested stack frames burst OS stack RAM (`~8 MB`), whereas a simple `while (curr)` loop uses `O(1)` space!",
      wrongFeedback:
        "Even with a valid Base Case, storing 500,000 paused function frames in the Call Stack blows past thread stack limits.",
    },
    recallKeywords: ["base case", "call stack", "frame", "depth", "overflow", "iterative"],
    bonusRecallPrompt:
      "How much EXTRA space does naive recursive `reverseList(head)` take vs an iterative 3-pointer `while` loop?",
  },
  {
    id: "ep-05-big-o-complexity",
    episodeNumber: 5,
    chapterNumber: 2,
    chapterTitle: "Season 2 · Complexity, Memory & Linear DS",
    title: "Stalking Freshers on Campus Insta vs. Admit-Card QR",
    conceptTopic: "Asymptotic Time & Space Complexity (`Big-O` Hierarchy)",
    durationLabel: "2:05",
    estimatedSeconds: 125,
    teaser:
      "Why brute force passes Sample Case `n = 5` at 4 AM and gets murdered by `Time Limit Exceeded` on `n = 100,000`.",
    castTag: "Aarav · Babloo · Fest Security · Mentor Priya",
    mappedProblems: ["Two Sum (`O(n²)` vs `O(n)`)", "Constraint-Reading Guide (`10^8 ops` rule)"],
    segments: [
      {
        speaker: "narrator",
        label: "Hook · Passing Sample Tests, Failing Submit",
        text: "Welcome to Season 2! Ever felt personally betrayed when your code passes all 3 green Sample Tests... you hit Submit smugly... and get slapped with RED `TIME LIMIT EXCEEDED`?! Welcome to **Big-O Scaling**!",
      },
      {
        speaker: "character",
        label: "Setup · Freshers Orientation Icebreaker",
        text: "Picture four algorithms walking into the Annual Tech Fest auditorium! Approach 1 (`O(1)`): Flash VIP QR badge at the gate—scans in 1 blink whether 10 people attend or 100,000! Approach 2 (`O(log n)`): Look up a sorted Roll Number across 1,000,000 pages by splitting halves—20 blinks flat! Approach 3 (`O(n)`): Checking student ID cards down the entry queue one-by-one. Now watch Approach 4 (`O(n²)`): Some genius MC announces, 'Every fresher MUST high-five EVERY other fresher here before pizza opens!'",
        sfx: "scratch",
      },
      {
        speaker: "punchline",
        label: "Punchline · 50 Million Sweaty High-Fives",
        text: "At `n = 5` VIP friends, that's 10 adorable high-fives—done in two seconds! On Orientation Day with `n = 10,000` students pouring in? That's **FIFTY MILLION high-fives**!! Freshers miss classes, graduate gray-haired, and someone's grandkids are still slapping palms when pizza expires in 2029!",
        pauseBeforeMs: 380,
        sfx: "rimshot",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Full Technical Breakdown",
        text: "ALWAYS read problem constraints BEFORE coding! A typical judge executes roughly **`10⁸` (`100 million`) ops per second**. So if constraints say `n <= 10⁵`, ANY `O(n²)` nested pair loop attempts `10¹⁰` operations and GUARANTEES `TLE`—demanding **`O(n log n)` or `O(n)`** via sorting or hashing! If `n <= 20`, exponential `O(2ⁿ)` backtracking flies cleanly! Let constraints pick your Big-O weapon before writing line one!",
        pauseBeforeMs: 300,
        sfx: "ding",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Scanning your gate QR badge once",
        technicalConcept: "`O(1)` Constant Time",
        whyItMatches: "Runtime completely independent of crowd size `n`.",
      },
      {
        storyElement: "Halving a sorted roll register",
        technicalConcept: "`O(log n)` Logarithmic Time",
        whyItMatches: "Even `n = 1,000,000` finishes in ~20 steps.",
      },
      {
        storyElement: "Security checking IDs one student at a time",
        technicalConcept: "`O(n)` Linear Time",
        whyItMatches: "Scales 1:1 with `n`; easily handles `n = 10⁷`.",
      },
      {
        storyElement: "Everyone high-fiving everyone in the hall",
        technicalConcept: "`O(n²)` Quadratic Time",
        whyItMatches: "Safe up to `n ≈ 5,000`; explodes to `10¹⁰` ops at `n = 10⁵`.",
      },
    ],
    technicalExplanation:
      "Big-O ignores constant multipliers (`5n + 40 -> O(n)`) and classifies upper-bound growth as `n -> infinity`: `O(1) < O(log n) < O(√n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)`. Reading input size `N` reveals the exact slowest Big-O allowed inside 1 second.",
    miniSnippet: {
      language: "text",
      code: `Interview Constraint Cheat Sheet (~10^8 ops/sec budget):
n <= 20      -> Backtracking / Bitmask DP  O(2^n) / O(n!)
n <= 2,000   -> Nested Loop / 2D DP        O(n^2)
n <= 100,000 -> Sorting / Heap / Greedy    O(n log n) or O(n)
n >= 10^9    -> Binary Search / Math Formula O(log n) or O(1)`,
      complexity: "Always reverse-engineer algorithm class from max constraint N!",
    },
    quiz: {
      prompt:
        "You read a Placement Coding Test question whose constraints state **`1 <= nums.length <= 2 × 10⁵` (`200,000`)**. Which worst-case time complexity below will **PASS cleanly under 1 second** vs fail `TLE`?",
      scenarioHint: "Multiply `200,000²` (`4 × 10¹⁰` ops) vs `200,000 × log₂(200,000)` (~`3.5 × 10⁶` ops)!",
      options: [
        "`O(n²)` nested loops pass easily under 1s",
        "`O(n log n)` (~3.5M ops) or `O(n)` (~200k ops) passes effortlessly; `O(n²)` (~40 Billion ops) fails TLE!",
        "Only `O(2ⁿ)` works for arrays over `10⁵`",
        "Time complexity doesn't affect runtime on fast CPUs",
      ],
      correctIndex: 1,
      correctFeedback:
        "Locked in! Checking `n <= 2×10⁵` upfront saves 20 minutes of wasted coding—you skip `O(n²)` immediately and reach for `O(n)` or `O(n log n)`!",
      wrongFeedback:
        "Remember the `10⁸` rule! Squaring `2 × 10⁵` yields `40,000,000,000` operations (~400 seconds!), guaranteed `TLE`.",
    },
    recallKeywords: ["10^8", "constraints", "quadratic", "n log n", "tle", "growth"],
    bonusRecallPrompt:
      "If problem constraints say `1 <= n <= 18`, why is that a huge neon sign pointing toward Bitmask DP or Backtracking?",
  },
  {
    id: "ep-06-arrays-vs-linked-lists",
    episodeNumber: 6,
    chapterNumber: 2,
    chapterTitle: "Season 2 · Complexity, Memory & Linear DS",
    title: "VIP Concert Row Seats vs. Midnight Afterparty Text Clues",
    conceptTopic: "Arrays (Contiguous RAM) vs. Linked Lists (Nodes & Pointers)",
    durationLabel: "2:00",
    estimatedSeconds: 120,
    teaser:
      "Why squeezing one extra buddy into front-row college concert seats triggers a 50-person domino shuffle—unlike chaining pointer clues.",
    castTag: "Aarav · Babloo · Concert Guard · Mentor Priya",
    mappedProblems: ["Reverse Linked List", "Merge Two Sorted Lists", "LRU Cache (`Map + Doubly Linked List`)"],
    segments: [
      {
        speaker: "narrator",
        label: "Hook · Two Ways to Store 6 Friends",
        text: "Episode 6! Aarav scores six consecutive front-row passes (`Seats R-10 to R-15`) for the college fest EDM night, while Babloo plans a secret post-concert hostel afterparty scavenger trail.",
      },
      {
        speaker: "character",
        label: "Setup · Locked Seats vs. Scattered Clues",
        text: "Watch Concert Row `R`! Every chair bolts right next to its neighbor in **contiguous RAM**. Want to pass glow-sticks directly to friend #4? Instant `O(1)` math (`Seat 10 + 3 = 13`)—zero searching! BUT suddenly Babloo's cousin shows up demanding to sit strictly between Seat 10 and Seat 11! Every seated person from 11 onward groans, stands up, and shuffles right one chair (`O(n)` shift!). Meanwhile across hostel rooftops, Babloo leaves scattered `Linked List` texts: `'Under Tea Cooler #4 holds snacks + text pointing to Terrace Bench #19!'` Want to splice in `'Cafeteria Table #8'` between Cooler #4 and Bench #19? Move ZERO furniture—just rewrite ONE text pointer (`O(1)`!).",
        sfx: "scratch",
      },
      {
        speaker: "punchline",
        label: "Punchline · Try Reaching Node #7 Directly",
        text: "Here's Babloo's karma catch: latecomer Vikram asks, 'Bro just skip clues 1 through 6 and tell me location #7!' Babloo shrugs: 'Bro I forgot my own trail! You literally MUST run across six cold rooftops sequentially just to read sticky note #7!' Zero `O(1)` index teleporting!",
        pauseBeforeMs: 360,
        sfx: "rimshot",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Full Technical Breakdown",
        text: "**Arrays** (`vector` / `list`) live contiguously—delivering `O(1)` indexing `arr[i]` and roaring L1 CPU cache speed, at `O(n)` cost to insert/delete in the middle. **Linked Lists** chain `Node { val, next }` objects via pointers—delivering `O(1)` insertion/deletion (or `LRU Cache` eviction when paired with a Hash Map!) given a node pointer, while paying `O(n)` sequential walking to index `k` plus extra pointer bytes per node!",
        pauseBeforeMs: 300,
        sfx: "ding",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Jumping straight to concert seat `R-13`",
        technicalConcept: "Array Indexing `arr[i]` (`O(1)`, Cache-Hot)",
        whyItMatches: "Offset `base + i × size` hits contiguous RAM directly.",
      },
      {
        storyElement: "Every seat shuffling sideways for 1 surprise guest",
        technicalConcept: "Array Middle Insert/Delete (`O(n)` Shift)",
        whyItMatches: "Contiguous layout forces shifting elements right or left.",
      },
      {
        storyElement: "Editing 2 text-message links to add a new rooftop stop",
        technicalConcept: "Linked List Node Splice (`O(1)` at known pointer)",
        whyItMatches: "Reassign `new->next` and `prev->next` without moving data.",
      },
      {
        storyElement: "Running clues 1 -> 2 -> ... -> 7 to find stop #7",
        technicalConcept: "No Random Access (`O(n)` Seek)",
        whyItMatches: "Only sequential pointer hops locate the `k`-th node.",
      },
    ],
    technicalExplanation:
      "Arrays/Dynamic Vectors dominate 90% of CPU-bound tasks due to CPU cache prefetching and `O(1)` indexing. Linked Lists excel specifically for pointer manipulation, `O(1)` head/tail or middle splicing (`LRU Cache` doubly-linked list + Hash Map, `Merge K Lists`, `Reverse List`).",
    miniSnippet: {
      language: "cpp",
      code: `// Reversing a Linked List in O(1) space (flipping 3 pointers per hop):
ListNode *prev = nullptr, *curr = head;
while (curr) {
  ListNode* nxt = curr->next; curr->next = prev; prev = curr; curr = nxt;
}`,
      complexity: "Array index O(1) vs List pointer splice O(1)",
    },
    quiz: {
      prompt:
        "How does **LRU Cache** (Least Recently Used Cache) achieve BOTH **`O(1)` key lookup** AND **`O(1)` moving any used item to the front / evicting the oldest**?",
      scenarioHint: "Pair two Episode data structures: one for `O(1)` Hook Lookup, one for `O(1)` Node Unlink + Splice!",
      options: [
        "Binary Search inside an unsorted Linked List",
        "Combine a **Hash Map** (`key -> node*` for `O(1)` find) with a **Doubly Linked List** (`O(1)` unlink & move-to-head!)",
        "Sort the entire cache on every `get()` call",
        "Use a plain Stack and pop everything to find the key",
      ],
      correctIndex: 1,
      correctFeedback:
        "Classic System Design / FAANG win! Hash Map teleports straight to the `Node*` in `O(1)`, and Doubly Linked List unlinks/re-attaches pointers at head/tail in `O(1)`!",
      wrongFeedback:
        "A single structure alone fails one half: Hash Map has no order; Linked List has no `O(1)` lookup—fusing BOTH solves LRU cleanly!",
    },
    recallKeywords: ["contiguous", "pointer", "shift", "cache", "lru", "splice"],
    bonusRecallPrompt:
      "Why do we store an extra `dummy` (`sentinel`) head node before `head` in almost every clean Linked List solution?",
  },
  {
    id: "ep-07-prefix-sums",
    episodeNumber: 7,
    chapterNumber: 2,
    chapterTitle: "Season 2 · Complexity, Memory & Linear DS",
    title: "The Goa Trip Splitwise Receipt Trick (`Prefix Sums`)",
    conceptTopic: "Prefix Sums, `O(1)` Range Sum Queries & `Subarray Sum Equals K`",
    durationLabel: "2:00",
    estimatedSeconds: 120,
    teaser:
      "Tired of re-adding forty messy Goa food bills from scratch, Aarav computes a running total ledger that answers any day-range spend in O(1).",
    castTag: "Aarav · Babloo · Cab Driver · Mentor Priya",
    mappedProblems: ["Range Sum Query", "Subarray Sum Equals K (`prefix + HashMap`)", "Product Except Self"],
    segments: [
      {
        speaker: "narrator",
        label: "Hook · Post-Goa Accountant Stress",
        text: "Episode 7 hits every engineering friend group's nightmare: returning broke from a 6-day Goa trip with 10,000 tiny beach-shack receipts `[₹120, ₹80, ₹500, ₹40, ₹300...]`! Babloo texts every five minutes: 'Bro, how much total did we blow strictly from Receipt 12 through Receipt 489?!'",
      },
      {
        speaker: "character",
        label: "Setup · Brute Re-Adding vs. Running Ledger",
        text: "Every time Babloo asks another range `[L..R]`, clueless Aarav grabs a calculator and re-adds hundreds of receipts one by one (`O(n)` per query—times 50,000 queries = five billion button mashing presses!). Then Priya walks past with a single pen: `'Make ONE cumulative column on the side: total spent from Day 1 UP TO receipt i (`pref[i]`)!'`",
        sfx: "scratch",
      },
      {
        speaker: "punchline",
        label: "Punchline · Subtraction Magic",
        text: "Watch Babloo's jaw hit his cold coffee! 'Total from Receipt 4 through Receipt 9?!' Simple: Total up to Receipt 9 (`pref[9]`), MINUS everything paid BEFORE Receipt 4 (`pref[3]`)! ONE single subtraction (`pref[R] - pref[L-1]`) answers a 10,000-receipt question in **`O(1)` flat**! Wait—don't even get Babloo started on checking if ANY consecutive hangout spent **exact `₹500`**: just ask if `(currentTotal - 500)` appeared in our **Prefix Hash Map** earlier!",
        pauseBeforeMs: 360,
        sfx: "rimshot",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Full Technical Breakdown",
        text: "**Prefix Sum** (`pref[i + 1] = pref[i] + nums[i]`) preprocesses an array in `O(n)` ONCE so EVERY contiguous subarray sum `[L..R]` computes in **`O(1)`**! Even bigger interview secret: combine **Prefix Sum + Hash Map** whenever an array holds **negative numbers** (breaking Sliding Window!) and a prompt asks **'Count subarrays summing to K'**: store `freq[prefixSum]`, and on every step add `freq[currSum - K]`! Initialize `freq[0] = 1` before index 0 or subarrays starting at index 0 vanish!",
        pauseBeforeMs: 300,
        sfx: "ding",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Cumulative Goa bill ledger from Receipt 0 up to Receipt `i`",
        technicalConcept: "`prefix[i + 1] = prefix[i] + nums[i]` (`O(n)` build)",
        whyItMatches: "Pre-aggregates cumulative totals in 1 clean pass.",
      },
      {
        storyElement: "Total(Day L..R) = Cumulative(R) minus Cumulative(L - 1)",
        technicalConcept: "Range Query in `O(1)` Flat",
        whyItMatches: "Cancels out prefix `0..L-1`, leaving exact slice `L..R`!",
      },
      {
        storyElement: "Spotting a ₹500 binge by checking `currTotal - 500` in past history",
        technicalConcept: "Subarray Sum Equals K (`Prefix + HashMap`, `O(n)`)",
        whyItMatches: "Works even with negative refunds (`-₹200`) where Sliding Window breaks!",
      },
    ],
    technicalExplanation:
      "Prefix Sums eliminate redundant loop summations across fixed intervals (`O(1)` per query). Pair with a Hash Map (`count[0] = 1`) whenever negative values prevent monotonic two-pointer shrinking.",
    miniSnippet: {
      language: "python",
      code: `# Count subarrays with exact sum k (works even with negative numbers!):
count = defaultdict(int, {0: 1})   # CRITICAL: empty prefix sum 0 occurred once!
pref = ans = 0
for x in nums:
    pref += x
    ans += count[pref - k]         # Any prior split leaving exact k between us?
    count[pref] += 1`,
      complexity: "O(n) total time · O(n) space",
    },
    quiz: {
      prompt:
        "Why does standard Sliding Window **FAIL** on `Subarray Sum Equals K` when `nums = [3, -2, 4, -1]` (containing negative numbers), forcing **Prefix Sum + Hash Map** instead?",
      scenarioHint: "In Sliding Window, expanding `right` should only grow sum and shrinking `left` should shrink it—what do negative numbers do?",
      options: [
        "Arrays with negative numbers cannot be indexed from 0",
        "Negative values break monotonicity—expanding `right` might DECREASE sum and shrinking `left` might INCREASE sum, missing valid subarrays!",
        "Hash Maps cannot store negative integers as keys",
        "Prefix sums remove all negative signs automatically",
      ],
      correctIndex: 1,
      correctFeedback:
        "100% precision! Whenever negative numbers exist, `currSum` stops moving monotonically—making Prefix Sum + Hash Map (`pref - k`) essential!",
      wrongFeedback:
        "Sliding Window relies on 'more items = bigger sum' to shrink confidently. A `-10` refund breaks that monotonicity!",
    },
    recallKeywords: ["prefix", "range", "negative", "hashmap", "count[0]", "o(1)"],
    bonusRecallPrompt:
      "Why do we initialize `{0: 1}` inside our Prefix Sum frequency map before reading index `0`?",
  },
  {
    id: "ep-08-stacks-lifo",
    episodeNumber: 8,
    chapterNumber: 2,
    chapterTitle: "Season 2 · Complexity, Memory & Linear DS",
    title: "3:59 AM Undo Stack & Tall Guy Blocking Stage View",
    conceptTopic: "Stacks (`LIFO`), Valid Parentheses & Monotonic Stacks",
    durationLabel: "2:05",
    estimatedSeconds: 125,
    teaser:
      "Babloo hits Ctrl+Z after deleting his project at 3:59 AM—and spots why taller students blocking front rows teach Monotonic Stacks.",
    castTag: "Aarav · Babloo · Fest Crowd · Mentor Priya",
    mappedProblems: ["Valid Parentheses", "Min Stack (`O(1)` min)", "Daily Temperatures / Next Greater Element"],
    segments: [
      {
        speaker: "narrator",
        label: "Hook · Panic at 11:58 PM Portal Deadline",
        text: "Episode 8 covers the unsung hero behind every student's survival: the **Stack**! Think of 11:58 PM before Moodle closes—Aarav drags dirty laundry on top of Saturday's pile, stacks 42 VS Code edits, and hits `Ctrl+Z` three times after accidentally deleting `main()`!",
      },
      {
        speaker: "character",
        label: "Setup · LIFO Brackets & Concert Tall Guys",
        text: "Remember the golden law: **Last In, First Out (`LIFO`)**! Most recent edit on TOP pops out FIRST! Same exact engine validates nested code brackets `([{}])`: open brackets push vertically; every closing `]` MUST match whatever sits right on top (`[`) or syntax explodes! Now level up! Imagine standing in a line at the campus rock show looking RIGHT toward the stage. Height `[165, 160, 178, 172, 185]`. Every shorter kid waits nervously behind a stack until someone TALLER (`178`) walks in!",
        sfx: "scratch",
      },
      {
        speaker: "punchline",
        label: "Punchline · Sweeping Short Kings Off the Bench",
        text: "Boom!! The second `178` arrives, everybody shorter waiting behind him (`160` and `165`) yells `'THAT'S MY NEXT TALLER PERSON!'`, logs `'2 seats away!'` and **POPS straight off the Monotonic Stack**! Nobody gets scanned twice (`1 push + 1 pop max`), crushing a classic `O(n²)` interview torture problem in blinding **`O(n)`**!",
        pauseBeforeMs: 360,
        sfx: "rimshot",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Full Technical Breakdown",
        text: "A plain **Stack** gives `O(1)` `push`, `pop`, and `top` for DFS, expression evaluators, `Min Stack` (push `(val, minSoFar)` pairs!), and brackets. Whenever an interview asks **'For every element, find the Next Greater / Next Smaller / Next Warmer Day / Largest Rectangle in Histogram'**, keep a **Monotonic Stack** of waiting indices whose answer hasn't arrived yet—every item enters and leaves at most once for guaranteed **`O(n)` time**!",
        pauseBeforeMs: 300,
        sfx: "ding",
      },
    ],
    comparisonRows: [
      {
        storyElement: "VS Code `Ctrl+Z` undoing newest edit first",
        technicalConcept: "LIFO Stack (`push` / `pop` in `O(1)`)",
        whyItMatches: "Newest pushed state resolves before older underlying states.",
      },
      {
        storyElement: "Checking `]` against newest unclosed `(` or `[` on top",
        technicalConcept: "Valid Parentheses Stack Matching",
        whyItMatches: "Innermost delimiter must close before outer delimiters.",
      },
      {
        storyElement: "Short kids popping off once a taller student walks in",
        technicalConcept: "Monotonic Stack (`Daily Temperatures` / `Histogram`, `O(n)`)",
        whyItMatches: "Each element gets popped once by its very first greater/smaller blocker.",
      },
    ],
    technicalExplanation:
      "Stacks resolve LIFO dependencies in `O(1)` per op. Monotonic Decreasing Stacks (storing indices) pop whenever a larger newcomer beats `nums[stack.top()]`, resolving `Next Greater Element` and `Daily Temperatures` cleanly in linear `O(n)` time.",
    miniSnippet: {
      language: "python",
      code: `# Daily Temperatures / Next Greater in strict O(n) via Monotonic Stack:
st, ans = [], [0] * len(temps)
for i, t in enumerate(temps):
    while st and temps[st[-1]] < t:   # Taller/warmer newcomer arrived!
        prev_i = st.pop(); ans[prev_i] = i - prev_i
    st.append(i)`,
      complexity: "O(n) time (each index pushed/popped at most once!) · O(n) space",
    },
    quiz: {
      prompt:
        "You use a **Monotonic Stack** on `[73, 74, 75, 71, 69, 72, 76, 73]` to find `'Wait days until warmer temperature'`. Why does the `while (stack not empty && top < today)` inner loop NOT turn total time into `O(n²)`?",
      scenarioHint: "Count how many total times ANY single temperature can EVER get popped from the stack!",
      options: [
        "Because `while` loops inside `for` loops always run only 1 step",
        "Each element is pushed **once** and popped **at most once** across the ENTIRE algorithm (`<= 2n` stack ops = **`O(n)`** amortized!)",
        "The stack resets to empty at index `n / 2`",
        "Python automatically converts `while` into Binary Search",
      ],
      correctIndex: 1,
      correctFeedback:
        "Interview gold! Amortized analysis proves total inner pops across ALL iterations combined can NEVER exceed `n`—strict `O(n)`!",
      wrongFeedback:
        "Don't panic seeing `while` inside `for`! Ask: once an element is popped, can it ever be re-pushed? NO—so max total pops = `n` (`O(n)`)!",
    },
    recallKeywords: ["lifo", "monotonic", "amortized", "once", "greater", "o(n)"],
    bonusRecallPrompt:
      "How does `Min Stack` return `getMin()` in `O(1)` even after `pop()` removes the minimum?",
  },
  {
    id: "ep-09-queues-fifo",
    episodeNumber: 9,
    chapterNumber: 2,
    chapterTitle: "Season 2 · Complexity, Memory & Linear DS",
    title: "2 AM Night-Canteen Maggi Counter (`FIFO` & `Deque`)",
    conceptTopic: "Queues (`FIFO`), Circular Ring Buffers & Sliding Window Deques",
    durationLabel: "2:00",
    estimatedSeconds: 120,
    teaser:
      "Babloo tries running Maggi orders LIFO like a stack—sparking an immediate 2 AM hostel riot—plus how our 50k burst queue survives.",
    castTag: "Chacha · Aarav · Babloo · Mentor Priya",
    mappedProblems: ["Implement Queue using Stacks", "Sliding Window Maximum (`Monotonic Deque`)", "Recent Calls / Rotting Oranges"],
    segments: [
      {
        speaker: "narrator",
        label: "Hook · Starving Midnight Crowd",
        text: "Episode 9 hits 1:55 AM during end-sem crunch outside Night Canteen! Twenty desperate coders queue for Cheese Masala Maggi: Aarav ordered Token #1 forty minutes ago; fresh arrival Babloo stands at Token #20.",
      },
      {
        speaker: "character",
        label: "Setup · Fair FIFO vs. Riot LIFO",
        text: "Imagine Chacha flipped to **LIFO Stack order**: handing piping hot Maggi to Babloo who literally arrived 4 seconds ago while Token #1 Aarav fades away till sunrise! Instant chair-throwing riot! Instead, real queues enforce strict **First In, First Out (`FIFO`)**: newcomers join the **Rear (`enqueue`)**, hot plates exit from the **Front (`dequeue`)**! Remember how our platform's compiler queue just handled **50,000 bursts**? Exact same pattern—API pushes tickets onto the Rear (`202 Queued`), workers cook off the Front steadily!",
        sfx: "scratch",
      },
      {
        speaker: "punchline",
        label: "Punchline · Never Shuffle 100k Students Left!",
        text: "Now catch the silent killer bug! If you use Python `list.pop(0)` instead of `deque.popleft()`, every time Token #1 grabs Maggi and walks off, Tokens 2 through 100,000 physically hop ONE bench left (`O(n)` per pop -> `O(n²)`!), exhausting Chacha before Token #400!",
        pauseBeforeMs: 360,
        sfx: "rimshot",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Full Technical Breakdown",
        text: "Real **Queues** use a linked list or **Circular Ring Buffer (`(head + 1) % cap`)** so both `enqueue` and `dequeue` execute in pure **`O(1)`**! And upgrade to a **Double-Ended Queue (`Deque`)** when BOTH front and rear need `O(1)` pop—the exact engine solving **Sliding Window Maximum** (`keep deque decreasing; drop expired front indices AND drop smaller rear candidates`) in blazing **`O(n)`** instead of `O(n log k)`!",
        pauseBeforeMs: 300,
        sfx: "ding",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Serving Token #1 first before latecomer Token #20",
        technicalConcept: "Queue FIFO (`enqueue` tail, `dequeue` head in `O(1)`)",
        whyItMatches: "Zero starvation; underpins BFS level waves & task schedulers.",
      },
      {
        storyElement: "Python `list.pop(0)` shifting everyone left on every order",
        technicalConcept: "Naive Array Front Removal (`O(n)` -> `O(n²)` bug!)",
        whyItMatches: "Use `collections.deque().popleft()` or circular head pointer instead!",
      },
      {
        storyElement: "Checking both ends (`pop_front` expired + `pop_back` weaker)",
        technicalConcept: "Monotonic Deque (`Sliding Window Max` in `O(n)`)",
        whyItMatches: "Maintains running window champion cleanly in linear time.",
      },
    ],
    technicalExplanation:
      "Queues model fair FIFO processing in BFS, producer-consumer pools, and network buffers. A Circular Buffer or `deque` guarantees `O(1)` front removal, and a Monotonic Deque gives `O(n)` Sliding Window Max/Min.",
    miniSnippet: {
      language: "python",
      code: `from collections import deque
# Queue: ALWAYS use deque.popleft() for O(1), NEVER list.pop(0)!
q = deque(["Token1", "Token2"]); q.append("Token3"); first = q.popleft()`,
      complexity: "O(1) enqueue & dequeue · Sliding Window Max Deque: O(n)",
    },
    quiz: {
      prompt:
        "How does a fixed-capacity **Circular Queue** (`Ring Buffer` array of size `K` storing real-time telemetry) advance its `tail` pointer past index `K - 1` without allocating more memory?",
      scenarioHint: "Once you walk off seat `K - 1` in a circle, wrap right back around to seat `0`!",
      options: [
        "Double array capacity on every push forever",
        "Wrap around seamlessly using modulo arithmetic: **`tail = (tail + 1) % K`** while size `< K`!",
        "Shift every single element left manually with a for-loop",
        "Store items backwards starting at index `-1`",
      ],
      correctIndex: 1,
      correctFeedback:
        "Clockwork precision! `(tail + 1) % K` wraps effortlessly back to index 0, giving `O(1)` FIFO over static RAM with zero shifting!",
      wrongFeedback:
        "Think of a 12-hour analog clock wrapping past 12 back to 1—modulo `% K` wraps array index `K - 1` seamlessly back to `0`!",
    },
    recallKeywords: ["fifo", "deque", "popleft", "circular", "modulo", "monotonic"],
    bonusRecallPrompt:
      "Can you simulate a FIFO Queue using **two LIFO Stacks**, and what is the amortized time per `pop`?",
  },
  {
    id: "ep-10-hash-maps",
    episodeNumber: 10,
    chapterNumber: 3,
    chapterTitle: "Season 3 · Hashing, Windows & Binary Search",
    title: "The Hostel Bike-Key Rack & Twin Room Collision",
    conceptTopic: "Hash Maps, Hash Sets, Frequency Counting & Collision Resolution",
    durationLabel: "2:05",
    estimatedSeconds: 125,
    teaser:
      "Watchman Chacha replaces his messy plastic key bucket with a math formula board—until two names land on the exact same hook!",
    castTag: "Watchman · Aarav · Babloo · Varun · Mentor Priya",
    mappedProblems: ["Two Sum (`O(n)`)", "Group Anagrams", "Longest Consecutive Sequence (`O(n)` HashSet)"],
    segments: [
      {
        speaker: "narrator",
        label: "Hook · The Giant Mixed-Up Key Bucket",
        text: "Welcome to Season 3! Parking 1,000 bikes outside the hostel, Watchman Chacha throws ALL 1,000 keychains into ONE plastic laundry basket! Every morning at 8:50 AM, late engineers panic searching through 600 jangling keys linearly (`O(n)`)—missing first period!",
      },
      {
        speaker: "character",
        label: "Setup · The Hash Formula Pegboard",
        text: "Priya upgrades the shed in 10 minutes! She nails 1,000 numbered wall hooks (`0..999`) and invents a deterministic **Hash Function**: add ASCII digits of your Roll ID `% 1000`! Now `'Aarav'` deterministically maps to **Hook `#217`**. Next morning, Aarav doesn't check hooks 0 through 216—he computes `217` and grabs his bike key in **1 blink (`O(1)`)**! Wait—crisis strikes when fresher `'Varun'` ALSO hashes to **`Hook #217`** (**Hash Collision**!). Babloo screams `'OVERWRITE AARAV'S KEY?!'`",
        sfx: "scratch",
      },
      {
        speaker: "punchline",
        label: "Punchline · Double-Hook Metal Ring to the Rescue",
        text: "Nope! Chacha slips TWO labeled metal rings onto Hook #217 (**Chaining**)! You walk straight to Hook #217 in `O(1)`, glance at just TWO keys instead of 1,000, grab yours, and race off cleanly!",
        pauseBeforeMs: 360,
        sfx: "rimshot",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Full Technical Breakdown",
        text: "**Hash Maps / Sets** (`unordered_map`, `HashMap`, `dict`) deliver **`O(1)` average insert/lookup/frequency counts**—powering `Two Sum`, `Group Anagrams`, `Contains Duplicate`, AND `Longest Consecutive Sequence` (`only start counting a streak at num if num - 1 is NOT in HashSet -> O(n)!`)! Senior warning: strings/arrays aren't sorted inside a Hash Map, AND remember our platform's **SHA-256 execution cache** uses that exact `O(1)` content-hash lookup to answer repeated submissions in `3ms`!",
        pauseBeforeMs: 300,
        sfx: "ding",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Turning `'Aarav'` deterministically into Hook `#217`",
        technicalConcept: "Hash Function (`hash(key) % buckets`)",
        whyItMatches: "Translates arbitrary strings/tuples directly to an array bucket index.",
      },
      {
        storyElement: "Walking directly to #217 ignoring 999 hooks",
        technicalConcept: "`O(1)` Average Lookup / Frequency Update",
        whyItMatches: "Beats `O(n)` linear search or `O(n log n)` sorting for membership.",
      },
      {
        storyElement: "'Aarav' and 'Varun' both hashing onto #217",
        technicalConcept: "Hash Collision (Chaining or Open Addressing)",
        whyItMatches: "Short bucket chain holds colliding entries cleanly by exact key equality.",
      },
    ],
    technicalExplanation:
      "Hashing achieves expected `O(1)` lookup by keeping load factor (`N / capacity`) bounded (~0.75) before resizing/rehashing. Pair Hash Maps with complement tricks (`target - x`), canonical anagram signatures, or streak heads (`num - 1 not in set`).",
    miniSnippet: {
      language: "python",
      code: `# Longest Consecutive Sequence in O(n) (NOT O(n log n) sorting!):
s = set(nums); best = 0
for x in s:
    if x - 1 not in s:                 # Only start at the beginning of a streak!
        cur = x
        while cur in s: cur += 1       # Each element walked at most once!
        best = max(best, cur - x)`,
      complexity: "O(n) average time · O(n) space",
    },
    quiz: {
      prompt:
        "In **Longest Consecutive Sequence** (`[100, 4, 200, 1, 3, 2]`), why does starting the `while (curr + 1 in set)` walk ONLY when **`num - 1` is NOT in the HashSet** turn runtime from `O(n²)` down to **`O(n)`**?",
      scenarioHint: "On `[1, 2, 3, 4]`, why skip starting a walk at `2`, `3`, and `4`?",
      options: [
        "Because `num - 1` sorts the HashSet automatically",
        "It ensures ONLY true sequence starters (`1`, `100`, `200`) trigger a walk, so every element in the set gets visited at most twice (`O(n)`!)",
        "It deletes consecutive numbers from memory",
        "Because numbers greater than `100` cannot connect",
      ],
      correctIndex: 1,
      correctFeedback:
        "Cleanest HashSet trick in interviews! Skipping `2, 3, 4` (since `num - 1` exists) guarantees you only walk each streak ONCE—`O(n)` without sorting!",
      wrongFeedback:
        "Without `if (num - 1 not in set)`, starting a walk from `4`, `3`, `2`, AND `1` repeats work quadratically (`O(n²)`). Starting strictly at chain heads visits each node once!",
    },
    recallKeywords: ["hash", "collision", "chaining", "o(1)", "load factor", "streak"],
    bonusRecallPrompt:
      "When should you prefer a sorted `TreeMap` / sorted array (`O(log n)`) over an `unordered_map` (`O(1)`)?",
  },
  {
    id: "ep-11-two-pointers",
    episodeNumber: 11,
    chapterNumber: 3,
    chapterTitle: "Season 3 · Hashing, Windows & Binary Search",
    title: "Sorted Midnight Pizza Deal & The Loop-Track Catch",
    conceptTopic: "Two Pointers (`Converging` & `Fast/Slow Tortoise-Hare`)",
    durationLabel: "2:05",
    estimatedSeconds: 125,
    teaser:
      "Aarav pairs pizza slices from opposite price ends in `O(1)` space—then Babloo catches a hostel-track cheater via 2x speed!",
    castTag: "Aarav · Babloo · Track Coach · Mentor Priya",
    mappedProblems: ["Two Sum II (Sorted)", "3Sum", "Container With Most Water", "Linked List Cycle (Floyd)"],
    segments: [
      {
        speaker: "narrator",
        label: "Hook · No Extra HashMap Budget Allowed",
        text: "Episode 11 upgrades linear scans with **Two Pointers**—two indices moving purposefully in ONE pass for `O(n)` time and **`O(1)` extra RAM**!",
      },
      {
        speaker: "character",
        label: "Setup · Converging Menu Fingers & Running Track",
        text: "Scene A: Domino's lists sides sorted by price: `[₹49, ₹79, ₹119, ₹149, ₹219]`, and Aarav's wallet coupon demands TWO sides totaling exact **`₹198`**, zero extra scratch paper! Left finger points cheapest `₹49`, Right finger points priciest `₹219`. Sum is `₹268`—OVER budget! Wait: if Aarav shifts Left upward, price climbs WORSE! Shift **Right inward** to `₹149` -> `49 + 149 = 198` BOOM, exact hit in 2 steps! Scene B (**Fast & Slow Pointers**): Suppose suspicious Babloo claims our campus jogging loop has a sneaky circular shortcut! How prove a cycle WITHOUT tracking chalk across 10,000 tiles?",
        sfx: "scratch",
      },
      {
        speaker: "punchline",
        label: "Punchline · Overlapping on Lap 2",
        text: "Easy! Aarav walks 1 step/sec (**Slow `1x`**); track sprinter Priya jogs **2 steps/sec (`Fast 2x`)**! If it's a straight road ending in a cafe, Priya finishes first—zero loop! If there IS a circular track? Priya mathematically laps Slow Aarav and smacks his shoulder from behind (`slow == fast`) in **`O(1)` space**!",
        pauseBeforeMs: 360,
        sfx: "rimshot",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Full Technical Breakdown",
        text: "Master THREE Two-Pointer families! (1) **Opposite Ends** (`L++, R--`): `Palindrome`, sorted `Two Sum II`, `3Sum` (fix 1 element + converge L/R in `O(n²)`), and `Container With Most Water` (ALWAYS advance the **shorter wall**, since moving the taller wall can ONLY lose width without beating height!). (2) **Read/Write Same-Direction**: `Remove Duplicates In-Place`, `Move Zeroes`. (3) **Fast & Slow (`2x` vs `1x`)**: detect cycles (`Linked List Cycle`), find list midpoint cleanly, AND solve **`Find Duplicate Number`** (`[1..n]`) in `O(1)` space!",
        pauseBeforeMs: 300,
        sfx: "ding",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Pinching sorted Domino's menu from left & right ends",
        technicalConcept: "Converging Two Pointers (`O(n)` time, `O(1)` space)",
        whyItMatches: "Sorted order lets 1 comparison eliminate an impossible extreme.",
      },
      {
        storyElement: "Moving the shorter glass side outward/inward in Container",
        technicalConcept: "Greedy Wall Pruning (`Container With Most Water`)",
        whyItMatches: "Area is bottlenecked strictly by shorter height × shrinking width.",
      },
      {
        storyElement: "Fast 2x runner catching Slow 1x walker on cyclic road",
        technicalConcept: "Floyd's Cycle Detection (`O(n)` time, `O(1)` space)",
        whyItMatches: "Fast gains 1 node/step inside any cycle, guaranteeing collision!",
      },
    ],
    technicalExplanation:
      "Two Pointers drops inner `O(n)` loops or `O(n)` Hash Sets down to `O(n)` time / `O(1)` space by exploiting monotonicity (`sorted`) or relative speed (`2x` vs `1x` pointers). Remember **Move Shorter Side** in Container With Most Water and **Reset `slow = head`** (moving both `1x`!) after collision to find exact cycle entry node!",
    miniSnippet: {
      language: "cpp",
      code: `// Container With Most Water: always advance the shorter bottleneck wall!
while (l < r) {
  best = max(best, (r - l) * min(h[l], h[r]));
  if (h[l] < h[r]) l++; else r--;
}`,
      complexity: "O(n) time · O(1) space",
    },
    quiz: {
      prompt:
        "In **Container With Most Water**, vertical lines sit at `L` (`height = 4`) and `R` (`height = 9`). Why is advancing **`L++` (the shorter line)** mathematically safe while advancing `R--` could miss the global max?",
      scenarioHint: "Area = `width × min(4, 9)`. Moving `R` shrinks `width` AND the ceiling can NEVER rise above `4` while `L = 4` stays pinned!",
      options: [
        "Because odd heights are always invalid",
        "Since `min(4, 9) = 4` bottlenecks the current pair, moving `R--` shrinks width with max possible height still capped at `4`, so `L = 4` has peaked!",
        "Because `R` must remain greater than `L` numerically",
        "It uses Binary Search inside the loop",
      ],
      correctIndex: 1,
      correctFeedback:
        "Textbook proof! Line `L=4` just saw its widest possible partner (`R=9 >= 4`); any narrower window anchored at `L=4` is strictly smaller, so discard `L` safely!",
      wrongFeedback:
        "Notice current height is capped by shorter wall `4`—moving `R` inward lowers width AND still can't beat height `4`, so `L` can never do better!",
    },
    recallKeywords: ["sorted", "shorter", "floyd", "cycle", "o(1) space", "converge"],
    bonusRecallPrompt:
      "After Floyd's `fast` meets `slow` inside a Linked List cycle, what exact two-line trick locates the FIRST node where the cycle starts?",
  },
  {
    id: "ep-12-sliding-window",
    episodeNumber: 12,
    chapterNumber: 3,
    chapterTitle: "Season 3 · Hashing, Windows & Binary Search",
    title: "3-Hour Hackathon RedBull Tracker (`Sliding Window`)",
    conceptTopic: "Fixed & Dynamic Sliding Window (`O(n)` Subarray/Substring)",
    durationLabel: "2:00",
    estimatedSeconds: 120,
    teaser:
      "Why Aarav refuses to recalculate three entire hours of RedBull caffeine spikes from zero every 60 minutes.",
    castTag: "Aarav · Babloo · RedBull Team · Mentor Priya",
    mappedProblems: ["Max Sum Subarray of Size K", "Longest Substring Without Repeating Characters", "Minimum Window Substring"],
    segments: [
      {
        speaker: "narrator",
        label: "Hook · Counting Coaches Without Deja Vu",
        text: "Episode 12 hits hour 18 of a 36-hour campus Hackathon! Mentor Priya asks Babloo to track the team's loudest 3-hour bug-squashing streak across hourly commit counts `[4, 12, 9, 21, 5, 18]` through a **3-slot cardboard viewfinder**.",
      },
      {
        speaker: "character",
        label: "Setup · Dropping Left, Adding Right",
        text: "Hours `1..3` inside the frame show `[4, 12, 9]` = `25` commits. Next hour, the train shifts 1 slot right to `[12, 9, 21]`. Babloo reaches for his TI-84 calculator to re-add `12 + 9 + 21`—imagining `k = 50,000` hours?! Total waste! Aarav yells: 'Bro, `12 + 9` NEVER LEFT THE FRAME! Just **subtract** outgoing Hour `4` on the left (`25 - 4 = 21`) and **add** entering Hour `21` on the right (`21 + 21 = 42`)!' Two arithmetic ops, ZERO re-counting!",
        sfx: "scratch",
      },
      {
        speaker: "punchline",
        label: "Punchline · Elastic Frame When Babloo Repeats Jokes",
        text: "Now make the cardboard **Elastic (Dynamic Window)** for `Longest Substring Without Repeating Characters` (`'abcbb'`): expand `right` hoarding fresh unique memes until someone drops a **duplicate `'b'`**! Instead of resetting to zero, just pinch `left` forward past the OLD `'b'`—spitting out stale memes cleanly until your window becomes 100% fresh again!",
        pauseBeforeMs: 360,
        sfx: "rimshot",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Full Technical Breakdown",
        text: "**Sliding Window** governs ALL contiguous subarray/substring optimization prompts with **non-negative/monotonic constraints** (`Max Consecutive Ones III`, `Fruit Into Baskets`, `Minimum Window Substring`). Remember the universal 4-step template: (1) Expand `right`, adding `s[right]` into window state/map; (2) While condition is violated (or satisfied for min-window!), update answer and **shrink `left++`** removing `s[left]`; (3) Never move either pointer backward (`<= 2n` ops = **`O(n)`**)! Just skip it if negative integers break shrink monotonicity (go Episode 7's Prefix Sum + Hash Map instead!).",
        pauseBeforeMs: 300,
        sfx: "ding",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Re-adding middle `[12, 9]` overlap repeatedly",
        technicalConcept: "Naive Nested Loop (`O(n × k)` TLE)",
        whyItMatches: "Repeats identical work `k - 1` times per shift.",
      },
      {
        storyElement: "`sum += enterRight - leaveLeft` over fixed window",
        technicalConcept: "Fixed Sliding Window (`O(n)`)",
        whyItMatches: "Constant `O(1)` state update on each frame shift.",
      },
      {
        storyElement: "Shrinking `left` right past duplicate `'b'` cleanly",
        technicalConcept: "Dynamic Window + Frequency Map (`O(n)`)",
        whyItMatches: "Both `left` and `right` move strictly forward once per char.",
      },
    ],
    technicalExplanation:
      "Dynamic Sliding Windows trade `O(n²)` all-substrings checks for `O(n)` linear tracking using two forward-only pointers plus a frequency map or `have/need` counter (`Minimum Window Substring`).",
    miniSnippet: {
      language: "python",
      code: `# Dynamic Sliding Window: Longest Substring Without Repeating Characters
last_seen = {}; l = best = 0
for r, ch in enumerate(s):
    if ch in last_seen and last_seen[ch] >= l: # Duplicate sits INSIDE current window!
        l = last_seen[ch] + 1                  # Jump left cleanly past old duplicate!
    last_seen[ch] = r
    best = max(best, r - l + 1)`,
      complexity: "O(n) time · O(min(n, charset)) space",
    },
    quiz: {
      prompt:
        "In that clean `last_seen` Sliding Window snippet for `'abba'`, why do we explicitly check `and last_seen[ch] >= l` before jumping `l = last_seen[ch] + 1`?",
      scenarioHint: "Trace `r = 3 ('a')` when `l` ALREADY jumped forward to `2` at index `2 ('b')`!",
      options: [
        "Because lowercase letters have negative ASCII codes",
        "To prevent `l` from accidentally jumping **BACKWARDS** to `0 + 1 = 1` using an ancient `'a'` that already exited the window!",
        "Because Python dictionaries overwrite keys randomly",
        "To sort characters inside `[l..r]` alphabetically",
      ],
      correctIndex: 1,
      correctFeedback:
        "Sharp! On `'abba'`, at second `'b'`, `l` jumped to `2`. When second `'a'` hits at index 3, `last_seen['a'] == 0 < l (2)` is stale history—MUST NOT pull `l` backwards!",
      wrongFeedback:
        "Trace `'abba'`: `'a'(0)` -> `'b'(1)` -> `'b'(2, moves l=2)` -> `'a'(3)`: `last_seen['a']` was `0`, behind `l=2`! Jumping `l = 0 + 1` would wrongly move `l` backwards!",
    },
    recallKeywords: ["sliding", "left", "right", "monotonic", "never backwards", "o(n)"],
    bonusRecallPrompt:
      "What single `have == need` counter optimization turns **Minimum Window Substring** from `O(26 × n)` down to `O(n)`?",
  },
  {
    id: "ep-13-binary-search",
    episodeNumber: 13,
    chapterNumber: 3,
    chapterTitle: "Season 3 · Hashing, Windows & Binary Search",
    title: "Hotspot Password Guess & Koko Eating Mess Parathas",
    conceptTopic: "Binary Search (`O(log n)`) & Binary Search on Answer Space",
    durationLabel: "2:05",
    estimatedSeconds: 125,
    teaser:
      "Locking in exact Spotify party loudness in 7 tries + discovering the hidden FAANG superpower: Binary Searching an *unsorted problem's answer*!",
    castTag: "Aarav · Babloo · Warden · Mentor Priya",
    mappedProblems: ["Binary Search / Search in Rotated Sorted Array", "Koko Eating Bananas", "Capacity to Ship Packages"],
    segments: [
      {
        speaker: "narrator",
        label: "Hook · Season 3 Boss Finale",
        text: "Episode 13 wraps Season 3! Imagine guessing a hidden integer between `1` and `1,000` (say Hostel Router's speed limit before auto-disconnecting). Click `1, 2, 3, 4...` like Babloo? Average 500 wasted disconnects!",
      },
      {
        speaker: "character",
        label: "Setup · Always Chopping the Middle",
        text: "Aarav chops dead-center (`500`): `'Too high!'` BAM—numbers `500..1000` deleted in ONE swing! Next midpoint `250`: `'Worked cleanly!'` Numbers `1..249` deleted! Even out of **FOUR BILLION choices**, halving finds the exact boundary in just **32 guesses (`O(log n)`)**! Wait—here's the plot twist every college sophomore misses in interviews...",
        sfx: "scratch",
      },
      {
        speaker: "punchline",
        label: "Punchline · Koko & Babloo Eating Stacks of Parathas",
        text: "Babloo bets Aarav: `'There are UNSORTED plates of 3, 11, 7, 6 parathas and class starts in 8 hours—find the MINIMUM eating speed K per hour to finish all plates on time!'` Notice the plates aren't sorted! Who cares?! The **SPEED `K`** is monotonic (`speed 1..11` turns `False, False, False, True, True, True`)! Chop the answer speed in half instead—and boom, FAANG `'Binary Search on Answer'` unlocked!",
        pauseBeforeMs: 380,
        sfx: "rimshot",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Full Technical Breakdown",
        text: "Whenever a sorted array shifts (`Rotated Sorted Array`, check which half `[l..mid]` vs `[mid..r]` is cleanly sorted first!), OR whenever an optimization prompt whispers **'Minimize the Maximum' / 'Minimum speed K to finish within H hours'**, inspect monotonicity (`if speed K works -> K+1 works too`) and apply **Binary Search on `[minAns..maxAns]`** in `O(n log(maxRange))`! Always compute `mid = l + (r - l) // 2` to avoid 32-bit overflow!",
        pauseBeforeMs: 300,
        sfx: "ding",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Cutting range `1..1000` at midpoint `500` -> discarding wrong half",
        technicalConcept: "Standard Binary Search (`O(log n)`)",
        whyItMatches: "Divides remaining search candidates by 2 every check.",
      },
      {
        storyElement: "'If Babloo finishes on time at speed 4, speed 5+ also works!'",
        technicalConcept: "Binary Search on Answer (`False..False -> True..True`)",
        whyItMatches: "Solves `Koko Bananas`, `Aggressive Cows`, `Split Array Largest Sum`!",
      },
      {
        storyElement: "`l + (r - l) / 2` safety trick",
        technicalConcept: "32-bit Signed Integer Overflow Prevention",
        whyItMatches: "Prevents `2×10⁹ + 2×10⁹` wrapping into a negative index in C++/Java.",
      },
    ],
    technicalExplanation:
      "Binary Search generalizes from finding targets in sorted arrays to finding the exact False-to-True phase boundary (`Lower Bound`) across any monotonic feasibility checker `canFinish(mid)` in `O(checkCost × log(answerRange))`.",
    miniSnippet: {
      language: "cpp",
      code: `// Binary Search on Answer (e.g. Koko Eating Bananas / Min Capacity):
int l = 1, r = maxPile, ans = r;
while (l <= r) {
  int mid = l + (r - l) / 2;
  if (canFinishInTime(piles, H, mid)) { ans = mid; r = mid - 1; } // Try slower!
  else l = mid + 1;
}`,
      complexity: "O(N log(maxPile)) time · O(1) space",
    },
    quiz: {
      prompt:
        "In **Search in Rotated Sorted Array** (`[4, 5, 6, 7, 0, 1, 2]`), you don't know where rotation occurred yet. On picking `mid`, how do you decide which side to discard in `O(1)`?",
      scenarioHint: "One half around `mid` is ALWAYS cleanly sorted (`nums[l] <= nums[mid]` OR `nums[mid] <= nums[r]`)!",
      options: [
        "Sort the whole array first (`O(n log n)`)",
        "Check whether the left half (`nums[l] <= nums[mid]`) is cleanly sorted: if `target` lies inside `[nums[l]..nums[mid]]`, go left; else go right (and mirror if right half is sorted)!",
        "Fall back to linear scan `for` loop inside the if-statement",
        "Discard the bigger half randomly",
      ],
      correctIndex: 1,
      correctFeedback:
        "Pro move! Because a single rotation leaves AT LEAST one half (`[l..mid]` or `[mid..r]`) completely ordered, checking if `target` sits inside that ordered range still preserves strict `O(log n)`!",
      wrongFeedback:
        "Sorting wastes `O(n log n)`! Checking `if (nums[l] <= nums[mid])` reliably identifies one pristine sorted half you can trust to prune cleanly in `O(log n)`.",
    },
    recallKeywords: ["monotonic", "answer space", "lower bound", "rotated", "overflow", "log n"],
    bonusRecallPrompt:
      "In `Minimize the Maximum Subarray Sum` (`Split Array Largest Sum`), what are exact `[low, high]` bounds of the Binary Search?",
  },
];
