import type { AudioDsaEpisode } from "@/lib/audio-dsa-types";

export const AUDIO_DSA_SEASON_A: AudioDsaEpisode[] = [
  {
    id: "ep-01-compile-vs-runtime",
    episodeNumber: 1,
    chapterNumber: 1,
    chapterTitle: "Season 1 · Programming Foundations",
    title: "The Chilli Powder Payasam Disaster",
    conceptTopic: "Compile-Time Error vs Runtime Error",
    durationLabel: "2:05",
    estimatedSeconds: 125,
    teaser:
      "Aarav tries to impress visiting relatives with grandma's sweet semiya payasam—until Babloo mixes red chilli powder into the cardamom jar.",
    castTag: "Aarav · Babloo · Auntie-G · Mentor Priya",
    segments: [
      {
        speaker: "narrator",
        label: "Scene 1 · The Festival Kitchen",
        text: "Welcome to Episode 1 of Code by Ear! Meet Aarav, a second-year engineering student who decided to cook his all-time favourite dessert: creamy sweet semiya payasam, for twelve hungry relatives arriving in thirty minutes.",
      },
      {
        speaker: "character",
        label: "Aarav & Babloo",
        text: "On the kitchen counter sits the master ingredients checklist: roasted vermicelli, full-cream milk, sugar, ghee, roasted cashews, raisins, and green cardamom. Meanwhile, Aarav's roommate Babloo was making fiery hostel maggi earlier and parked an unlabeled jar of Kashmiri red chilli powder right beside the sugar bowl. Notice there are two totally different ways Aarav's afternoon can explode.",
      },
      {
        speaker: "narrator",
        label: "Scene 2 · Two Ways to Ruin Dessert",
        text: "Possibility A: Before even lighting the gas stove, Aarav checks every bowl against the written recipe table. He spots red chilli powder sitting under the sweet spice label and yells, 'Whoa! Chilli powder has no place inside sweet payasam!' Zero gas wasted, zero milk boiled—caught right at the prep table. Possibility B: Aarav skips checking the ingredients table, lights the stove, bubbles milk for twenty-five proud minutes, garnishes with cashews, and serves Auntie-G the first steaming spoonful. Three seconds later, steam shoots out of Auntie-G's ears because the dessert is blazing hot!",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Tech Breakdown",
        text: "That kitchen tragedy is the exact difference between a Compile-Time Error and a Runtime Error! Inspecting the ingredients table before turning on the stove is Compilation: your compiler (like C++, Java, or TypeScript) scans syntax, types, and misspelled variables before generating an executable program. If you put a String where an Integer belongs—like chilli powder in a sweet recipe—the compiler blocks the build immediately. By contrast, Runtime Errors only explode while the finished dish is actually being tasted by live users: dividing by zero, accessing a null pointer, or running out of memory after execution starts!",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Checking the ingredients table before lighting the stove",
        technicalConcept: "Compile-Time Check (Syntax & Type Analysis)",
        whyItMatches: "Catches mismatched types or missing semicolons before the program even runs.",
      },
      {
        storyElement: "Spotting chilli powder beside cardamom pre-cooking",
        technicalConcept: "Compile-Time Error (Build Failed)",
        whyItMatches: "Zero CPU time wasted running invalid code; you fix the recipe right away.",
      },
      {
        storyElement: "Cooking for 25 minutes cleanly without warnings",
        technicalConcept: "Valid Syntax / Program Successfully Compiles",
        whyItMatches: "Every step followed grammar rules, even though a hidden data bomb lurks inside.",
      },
      {
        storyElement: "Auntie-G taking the first bite and coughing fire",
        technicalConcept: "Runtime Error (Exception / Crash on Live Input)",
        whyItMatches: "Only discovered after running the program on real inputs (e.g. null dereference or / 0).",
      },
    ],
    technicalExplanation:
      "Compile-time errors are caught statically by the compiler before execution (syntax errors, type mismatches, undeclared identifiers). Runtime errors pass compilation cleanly and crash only when the CPU actually hits an illegal operation during execution (divide by zero, array out-of-bounds, null pointer).",
    miniSnippet: {
      language: "cpp",
      code: `// Compile-time error (caught at ingredients check):
int sugarSpoons = "chilli"; // ❌ type mismatch before running

// Runtime error (compiles cleanly, explodes while serving):
int perGuest = totalCashews / guestsCount; // 💥 crashes if guestsCount == 0`,
      complexity: "Caught Static (Build Time) vs Dynamic (Execution Time)",
    },
    quiz: {
      prompt:
        "During payasam prep, Aarav reads his counter checklist before turning on the burner and catches salt labeled as icing sugar. His code builds fine in C++, passes syntax, and later divides by a user input of 0. Which pair describes BOTH events in order?",
      scenarioHint: "Remember: stove OFF checklist = compiler, stove ON & tasting = runtime.",
      options: [
        "1st is Runtime Error, 2nd is Compile-Time Error",
        "1st is Compile-Time Error, 2nd is Runtime Error",
        "Both are Runtime Errors because kitchen prep is physical",
        "Both are Compile-Time Errors because math rules exist beforehand",
      ],
      correctIndex: 1,
      correctFeedback:
        "Spot on! Inspecting the ingredients table before cooking catches mistakes statically at Compile Time. Division by zero only explodes when live input reaches the CPU at Runtime!",
      wrongFeedback:
        "Check when the stove is lit! Pre-cooking inspection on the counter is Compile Time (safety gate before running), whereas serving the dish to live inputs is Runtime.",
    },
    recallKeywords: ["compile", "before", "runtime", "running", "type", "syntax", "input"],
    bonusRecallPrompt:
      "In one sentence, how would you explain compile-time vs runtime error using Aarav's payasam to a fresher?",
  },
  {
    id: "ep-02-variables-references",
    episodeNumber: 2,
    chapterNumber: 1,
    chapterTitle: "Season 1 · Programming Foundations",
    title: "The Hostel Tiffin Box & Master Locker",
    conceptTopic: "Variables, Memory Addresses & Value vs. Reference",
    durationLabel: "2:00",
    estimatedSeconds: 120,
    teaser:
      "After the payasam incident, Babloo edits Aarav's shared Google Doc timetable instead of making a photocopy—chaos ensues.",
    castTag: "Aarav · Babloo · Mentor Priya",
    segments: [
      {
        speaker: "narrator",
        label: "Scene 1 · Labeled Lunchboxes",
        text: "Still nursing scorched tastebuds from Episode 1, Aarav tries organizing his hostel shelf using tiffin boxes with masking-tape name tags. Each steel dabba holds one type of snack, and the sticker on its lid has a variable name like 'almonds' or 'score'.",
      },
      {
        speaker: "character",
        label: "Aarav & Babloo",
        text: "Now here comes Babloo asking for Aarav's exam cheat sheet. On Day 1, Aarav prints a xerox photocopy and hands it to Babloo. Babloo doodles mustache cartoons all over his copy, but Aarav's original notebook on his desk stays spotless! Next week, Aarav sends Babloo a live editable Google Doc link instead—the exact room address of the original file. Babloo types 'SYLLABUS CANCELLED, PLAY FIFA' directly into the doc, and suddenly Aarav watches his own screen change before his eyes!",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Tech Breakdown",
        text: "Every variable is literally a labeled RAM box holding a value! When you pass primitive data like an integer by Value, the function gets its own fresh photocopy dabba—scribble inside it all day, and the caller's variable never changes. When you pass an object or array by Reference (or pass a C++ pointer!), you hand over the live address of the original locker in RAM. Mutating inside the function alters the caller's real object! Knowing when you're holding a copy versus a live alias saves half your Linked List and Tree bugs.",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Masking-tape label on a steel tiffin box",
        technicalConcept: "Variable Name Bound to RAM Slot",
        whyItMatches: "Human-friendly name pointing to stored bytes in memory.",
      },
      {
        storyElement: "Giving Babloo a Xerox photocopy to doodle on",
        technicalConcept: "Pass-by-Value (Isolated Copy)",
        whyItMatches: "Changes inside the helper function never mutate the caller's original.",
      },
      {
        storyElement: "Sharing live editable Google Doc link (address)",
        technicalConcept: "Pass-by-Reference / Pointer Alias",
        whyItMatches: "Both parties point to the same underlying memory object.",
      },
    ],
    technicalExplanation:
      "Pass-by-value clones the value into a separate stack frame variable, keeping originals safe. Pass-by-reference (or passing object/pointer addresses in Java, Python, and C++ `&` / `*`) passes a direct handle to the same heap or caller memory, enabling in-place mutation.",
    miniSnippet: {
      language: "cpp",
      code: `void paintXerox(int x) { x = 999; }       // Caller stays unchanged
void editGoogleDoc(int& x) { x = 999; } // Mutates caller's variable directly!`,
      complexity: "O(1) reference vs O(size) deep clone",
    },
    quiz: {
      prompt:
        "You pass a large array of 100,000 student marks into a grading helper by Reference so it doesn't copy 400KB of RAM, and the helper accidentally runs `marks[0] = 0`. What happens to the caller's array?",
      scenarioHint: "Did you hand over a Xerox photocopy or the live Google Doc link?",
      options: [
        "Nothing changes in caller's array because functions are isolated",
        "marks[0] in the caller's original array becomes 0 immediately",
        "The compiler catches a Compile-Time Error before executing",
        "Only local odd indices change",
      ],
      correctIndex: 1,
      correctFeedback:
        "Exactly right! Passing by Reference hands over the original Google Doc address—fast O(1) memory, but any write inside the function modifies the original array!",
      wrongFeedback:
        "Think about Babloo editing the shared Google Doc link—by Reference shares one underlying object, so mutating `marks[0]` inside updates the caller too.",
    },
    recallKeywords: ["copy", "address", "original", "mutate", "reference", "value"],
    bonusRecallPrompt:
      "When would passing by reference (`const &` or reference) actually save huge memory in DSA?",
  },
  {
    id: "ep-03-loops-and-invariants",
    episodeNumber: 3,
    chapterNumber: 1,
    chapterTitle: "Season 1 · Programming Foundations",
    title: "Waiter Raju's Endless Sambar Refill Loop",
    conceptTopic: "Conditionals, For/While Loops & Termination Conditions",
    durationLabel: "2:00",
    estimatedSeconds: 120,
    teaser:
      "Babloo challenges a wedding hall waiter to refill his plate 'until I say stop'—then falls asleep face-down before speaking.",
    castTag: "Babloo · Waiter Raju · Mentor Priya",
    segments: [
      {
        speaker: "narrator",
        label: "Scene 1 · The All-You-Can-Eat Banana Leaf",
        text: "Continuing our saga: after messing up Aarav's Google Doc, Babloo sneaks into a grand campus farewell banquet. A super-obedient robot waiter named Raju carries a five-liter brass bucket of hot sambar.",
      },
      {
        speaker: "character",
        label: "Babloo & Waiter Raju",
        text: "Waiter Raju operates on a strict rule: 'While guest has NOT raised hand, pour one ladle of sambar.' Unfortunately, halfway through ladle number three, Babloo drops into a food coma! Nobody raises a hand. Raju dutifully pours ladle four... ladle five... ladle forty-two... Soon sambar rises past Babloo's ankles, swamps the banquet carpet, and triggers the fire alarm because no variable inside the room is ever moving toward the exit condition!",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Tech Breakdown",
        text: "Welcome to Loops and Infinite-Loop Time Limit Exceeded! Every `for` or `while` loop needs three sacred parts: initialization, a check condition, and progress toward termination. If you forget `i++` or wait on a condition your loop never changes—just like sleeping Babloo never raising his hand—your program floods RAM until the online judge kills it with TLE! And watch out for Off-by-One bugs (`< n` vs `<= n`): ladling one extra scoop right onto the tablecloth!",
      },
    ],
    comparisonRows: [
      {
        storyElement: "'Pour while hand is not raised'",
        technicalConcept: "while (!stopped) Condition",
        whyItMatches: "Loop keeps repeating as long as the boolean condition remains true.",
      },
      {
        storyElement: "Babloo sleeping so hand never goes up",
        technicalConcept: "Missing State Update -> Infinite Loop (TLE)",
        whyItMatches: "If the loop body never progresses toward terminating, the CPU spins forever.",
      },
      {
        storyElement: "Counting guests 0..n-1 vs hitting empty chair n",
        technicalConcept: "Off-by-One Boundary Bug (< n vs <= n)",
        whyItMatches: "Stepping one iteration past valid indices reads garbage or crashes.",
      },
    ],
    technicalExplanation:
      "Loops automate repetition across collections in `for` (known range) and `while` (condition-driven) styles. Every correct loop enforces an invariant that moves monotonically toward termination on every step so it never triggers Time Limit Exceeded.",
    miniSnippet: {
      language: "python",
      code: `left, right = 0, len(arr) - 1
while left <= right:  # Waiter checks boundary cleanly
    left += 1         # MUST progress toward termination every step!`,
      complexity: "O(iterations) — Infinite if progress step missing",
    },
    quiz: {
      prompt:
        "A student writes `while (left < right)` for Binary Search and accidentally writes `left = mid;` when `mid = (left + right) / 2` and only `[3, 7]` remain (`left = 0, right = 1`). Why does the loop run forever like Waiter Raju?",
      scenarioHint: "Calculate `mid = Math.floor((0 + 1) / 2)`! Does `left` actually move?",
      options: [
        "Because C++/Java cannot compare two integers inside a while loop",
        "Because `mid` evaluates to 0, so `left = 0` keeps `left < right` permanently stuck!",
        "Because arrays of size 2 throw a Compile-Time Error",
        "Because `right` doubles on every turn",
      ],
      correctIndex: 1,
      correctFeedback:
        "Bingo! When `left=0, right=1`, `mid=0`. Assigning `left = mid` changes zero state—Waiter Raju pours forever until TLE!",
      wrongFeedback:
        "Plug in the numbers! `(0 + 1) / 2` rounds down to `0`, so `left = mid` keeps `left` pinned at `0` forever.",
    },
    recallKeywords: ["mid", "progress", "infinite", "unchanged", "base", "condition"],
    bonusRecallPrompt:
      "What rule guarantees a `while` loop will never flood the dining hall with sambar?",
  },
  {
    id: "ep-04-recursion-call-stack",
    episodeNumber: 4,
    chapterNumber: 1,
    chapterTitle: "Season 1 · Programming Foundations",
    title: "Russian Matryoshka Biryani Pots",
    conceptTopic: "Functions, Recursion, Call Stack & Base Cases",
    durationLabel: "2:05",
    estimatedSeconds: 125,
    teaser:
      "Aarav tries delegating peeling onions using nested Russian dolls—until he forgets to tell the tiniest doll when to stop.",
    castTag: "Aarav · Babloo · Mentor Priya",
    segments: [
      {
        speaker: "narrator",
        label: "Scene 1 · Infinite Kitchen Delegation",
        text: "Episode 4 picks up right after clean-up from Waiter Raju's sambar flood! To prepare weekend biryani fast, Aarav discovers magical nested cooking pots: open Pot 5, and inside sits smaller Pot 4, holding Pot 3, all the way down.",
      },
      {
        speaker: "character",
        label: "Aarav & Pot 5",
        text: "Aarav tells Pot 5: 'Chop 5 onions—wait, just peel 1 onion and pass the remaining N minus 1 to the pot inside you!' So Pot 5 pauses holding one sliced onion, wakes Pot 4, which wakes Pot 3, piling paused pots vertically onto the wooden kitchen rack! If Pot 0 asks 'wait, zero onions left, I'm done!' and hands back a finished bowl, each paused pot finishes up neatly one by one. But what if Babloo removes the 'Stop at Zero' sticky note? Pot 0 calls Pot minus-one, calling Pot minus-two... until 100,000 tiny pots stack past the ceiling and the wooden rack snaps with a thunderous crash!",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Tech Breakdown",
        text: "That wooden rack holding paused pots is the CPU Call Stack! Recursion simply means a function solving piece 1 and calling itself on a strictly smaller subproblem. Every recursive function stands on two legs: (1) a crystal-clear Base Case where delegation stops cleanly without another call, and (2) Shrinking Progress toward that base case. Skip the base case—or pass `n` instead of `n - 1`—and your call stack overflows memory (`StackOverflowError` / Segfault)!",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Piling paused nested pots vertically on the shelf",
        technicalConcept: "Function Call Stack Frames",
        whyItMatches: "Outer calls wait in RAM until inner recursive calls return their result.",
      },
      {
        storyElement: "Pot 0 refusing to open further when 0 onions remain",
        technicalConcept: "Base Case Termination",
        whyItMatches: "Prevents endless calls and begins unwinding results back up the stack.",
      },
      {
        storyElement: "Rack collapsing under Pot -1, -2, ..., -50000",
        technicalConcept: "Stack Overflow Error",
        whyItMatches: "Call stack RAM limit exceeded because recursion never hit a base case.",
      },
    ],
    technicalExplanation:
      "Recursion decomposes a problem into smaller self-similar subproblems. Each active call pushes a stack frame holding local variables and return address onto the call stack (`O(depth)` space) until a Base Case triggers clean unwinding.",
    miniSnippet: {
      language: "cpp",
      code: `int factorial(int n) {
  if (n <= 1) return 1;        // 🛑 Base Case: stops the Matryoshka pots!
  return n * factorial(n - 1); // 🔄 Strictly smaller subproblem
}`,
      complexity: "O(n) time · O(n) call-stack space",
    },
    quiz: {
      prompt:
        "A student calls `countDown(5)` where `countDown(n)` prints `n` and immediately calls `countDown(n - 1)`—but accidentally deletes `if (n == 0) return;`. What explodes?",
      scenarioHint: "What happened to the wooden pot rack when Babloo removed the Stop-at-Zero note?",
      options: [
        "Compile-Time Error because `return` is mandatory",
        "It prints 5 to 1 politely and stops automatically at 0",
        "Stack Overflow crash as frames stack down through -1, -2, -3... until stack memory runs out",
        "It swaps to Iterative sorting automatically",
      ],
      correctIndex: 2,
      correctFeedback:
        "Yes! Without a base case, `countDown(0)` calls `countDown(-1)` and so on until the call stack rack collapses with a Stack Overflow!",
      wrongFeedback:
        "Computers don't guess when to stop at zero—missing the `if (n <= 0) return;` base case fills call stack frames infinitely until Stack Overflow.",
    },
    recallKeywords: ["base case", "stack overflow", "smaller", "unwind"],
    bonusRecallPrompt:
      "What two ingredients must EVERY non-crashing recursive function have?",
  },
  {
    id: "ep-05-big-o-complexity",
    episodeNumber: 5,
    chapterNumber: 2,
    chapterTitle: "Season 2 · Complexity & Linear Structures",
    title: "The 10,000-Page Hostel Register Race",
    conceptTopic: "Asymptotic Time Complexity & Big-O Notation",
    durationLabel: "2:00",
    estimatedSeconds: 120,
    teaser:
      "The hostel warden asks Aarav, Babloo, and Priya how fast they can handle 10 versus 1,000,000 students signing in.",
    castTag: "Warden · Aarav · Babloo · Mentor Priya",
    segments: [
      {
        speaker: "narrator",
        label: "Scene 1 · Hostel Inspection Day",
        text: "Season 2 begins! After the stack-overflow onion mess, the strict hostel Warden lines up Aarav and Babloo beside a gigantic 10,000-page attendance register and screams: 'Find Roll Number 4096 in ten seconds—GO!'",
      },
      {
        speaker: "character",
        label: "Three Competing Strategies",
        text: "Watch three algorithms in action. Babloo flips Page 1, Page 2, Page 3... straight from the start—if the roll number is on page 9,999, his thumb melts! That's linear `O(n)`: double the students, double the sweat. Next, a clumsy fresher decides every student entering the hall must shake hands with EVERY other student already inside! For 10 kids that's 45 handshakes—cute! For 10,000 kids that's 50 MILLION handshakes—quadratic `O(n²)` gridlock until graduation! Finally, Priya checks the Room Key Badge (`O(1)` instant teleport) OR opens straight to page 5,000 and splits the register in half every blink (`O(log n)`: even for 1 BILLION people, only 30 page flips!).",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Tech Breakdown",
        text: "Big-O isn't measured in wall-clock seconds on a MacBook—it measures HOW FAST work grows as input size `n` explodes! An `n²` nested loop passes sample cases when `n = 5` and freezes on hidden testcases when `n = 100,000` (`10 billion` ops)! Rule of thumb in interviews: CPUs execute roughly `10^8` simple operations per second, so `n <= 10^5` demands `O(n)` or `O(n log n)`!",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Checking desk key tag directly",
        technicalConcept: "O(1) Constant Time",
        whyItMatches: "1 step whether there are 10 students or 10 million.",
      },
      {
        storyElement: "Halving the sorted register each flip",
        technicalConcept: "O(log n) Logarithmic Time",
        whyItMatches: "Doubling input size only adds 1 extra step!",
      },
      {
        storyElement: "Scanning pages 1, 2, 3... one by one",
        technicalConcept: "O(n) Linear Time",
        whyItMatches: "Effort grows proportionally with number of items.",
      },
      {
        storyElement: "Everyone shaking hands with everyone else",
        technicalConcept: "O(n²) Quadratic Time",
        whyItMatches: "Nested loop over all pairs; explodes past n = 10,000.",
      },
    ],
    technicalExplanation:
      "Big-O describes worst-case growth rate of operations as `n -> infinity`, dropping small constants (`3n + 7 -> O(n)`). Avoiding nested `O(n²)` loops with hashing, sorting, or sliding windows turns Time Limit Exceeded into instant `ACCEPTED`.",
    miniSnippet: {
      language: "text",
      code: `n = 100,000 inputs:
O(1)       -> ~1 op       (Instant)
O(log n)   -> ~17 ops     (Instant)
O(n log n) -> ~1.7M ops   (Passes ~20ms)
O(n²)      -> 10 Billion  (🔥 Time Limit Exceeded!)`,
      complexity: "Growth Curve dictates scalability",
    },
    quiz: {
      prompt:
        "Your brute-force Two Sum solution compares every pair `(i, j)` in nested loops (`O(n²)`). It passes Sample Tests where `n = 4`, then crashes with Time Limit Exceeded when submitted on hidden `n = 100,000`. Why?",
      scenarioHint: "Count how many 'handshakes' happen when `n = 100,000`!",
      options: [
        "Hidden testcases use a different programming language",
        "~5 billion pair comparisons exceed ~10⁸ ops/sec budget, whereas a Hash Map solves it in 100,000 O(n) steps",
        "O(n²) throws a syntax error for arrays over size 1000",
        "The judge penalizes `for` loops alphabetically",
      ],
      correctIndex: 1,
      correctFeedback:
        "Nailed it! At `n = 10^5`, nested pairs explode to ~5×10⁹ checks (way over 1 second), whereas a Hash Map does 1 pass (`O(n)`)!",
      wrongFeedback:
        "Think about the fresher handshake nightmare! `n = 4` only has 6 pairs, while `n = 100,000` requires roughly 5 BILLION pair checks.",
    },
    recallKeywords: ["growth", "operations", "nested", "billion", "n log n", "linear"],
    bonusRecallPrompt:
      "Why do 10⁶-scale interview questions usually fail `O(n²)` algorithms?",
  },
  {
    id: "ep-06-arrays-vs-linked-lists",
    episodeNumber: 6,
    chapterNumber: 2,
    chapterTitle: "Season 2 · Complexity & Linear Structures",
    title: "Cinema Hall Seat Row vs. Treasure Hunt Chits",
    conceptTopic: "Arrays vs. Linked Lists (Contiguous RAM vs. Pointer Chaining)",
    durationLabel: "2:05",
    estimatedSeconds: 125,
    teaser:
      "Aarav books 6 adjacent multiplex seats while Babloo organizes a college treasure hunt across random campus benches.",
    castTag: "Aarav · Babloo · Usher · Mentor Priya",
    segments: [
      {
        speaker: "narrator",
        label: "Scene 1 · Multiplex Row G vs. Park Treasure Hunt",
        text: "To celebrate surviving Hostel Inspection, Aarav books Seats `G-10` through `G-15` in a cinema hall, while Babloo sets up a surprise birthday treasure hunt around campus.",
      },
      {
        speaker: "character",
        label: "Two Very Different Layouts",
        text: "Watch what happens when Grandma arrives late to the movie! Since Cinema Row G seats sit glued side-by-side (`[10, 11, 12, 13, 14, 15]`), you can jump directly to `G-13` in ONE glance (`O(1)` random access)! BUT if Babloo suddenly brings a surprise buddy demanding to squeeze right into seat 11, EVERYONE from 11 to 15 has to stand up and shuffle down one chair (`O(n)` shifting)! Meanwhile, across campus, Babloo hides clues as folded paper chits: Bench #4 holds a cookie and a sticky note saying 'Next clue is under Bus Stop #19!' Want to squeeze a surprise stop in between? You don't move ANY bench—just rewrite Bench #4's sticky note in `O(1)`! The catch? To find clue #5, you CANNOT jump directly—you MUST sprint from Bench 1 -> 2 -> 3 -> 4 -> 5 sequentially!",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Tech Breakdown",
        text: "Cinema seats are **Arrays**: contiguous bytes in RAM allowing `O(1)` instant `arr[i]` indexing and super CPU-cache speed, at the cost of `O(n)` shifting on middle inserts! Treasure chits are **Linked Lists**: each node stores `data + next pointer` anywhere in heap memory—making `O(1)` splicing/insertion effortless once at a node, while losing `O(1)` index jumping!",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Jumping straight to seat `G-13` in row G",
        technicalConcept: "Array Random Access `arr[i]` — `O(1)`",
        whyItMatches: "Address = base + i × sizeof(element) computed instantly.",
      },
      {
        storyElement: "Squeezing friend into Seat 11, shuffling everyone",
        technicalConcept: "Array Middle Insert/Delete — `O(n)`",
        whyItMatches: "All trailing elements shift by 1 slot to stay contiguous.",
      },
      {
        storyElement: "Chit under Bench #4 pointing to Bus Stop #19",
        technicalConcept: "Linked List Node (`val` + `next` pointer)",
        whyItMatches: "Nodes live anywhere in RAM and chain via pointers.",
      },
      {
        storyElement: "Re-aiming two sticky notes to splice a new clue",
        technicalConcept: "Linked List Insert (at known node) — `O(1)`",
        whyItMatches: "Zero shifting! Only 2 pointer reassignments needed.",
      },
    ],
    technicalExplanation:
      "Choose an Array (dynamic `vector` / Python `list`) when you need fast random indexing `arr[i]` and cache locality. Choose a Linked List (or Doubly Linked List as in LRU Cache) when frequent `O(1)` insertions/deletions at known pointers matter more than indexing.",
    miniSnippet: {
      language: "cpp",
      code: `// Array jump: instant math
int x = rowG[3];              // O(1) instant!

// Linked List splice at node p:
newNode->next = p->next;      // Repoint two sticky notes: O(1)!
p->next = newNode;`,
      complexity: "Array: O(1) index, O(n) middle insert · List: O(n) index, O(1) pointer splice",
    },
    quiz: {
      prompt:
        "You're building a Music Playlist where users constantly click 'Move Song 47 right next to Song 2' using node pointers, and almost never ask 'Jump to exact index 3,419'. Which tradeoff explains why a Linked List shines for splicing while failing random indexing?",
      scenarioHint: "Would you rather shift 1,000 moviegoers or re-write two sticky notes?",
      options: [
        "Linked Lists store elements contiguously so CPU multiplies index × 4",
        "Linked Lists only rewrite `next`/`prev` pointers (`O(1)`) instead of shifting elements, but require `O(n)` traversal to reach index `k`",
        "Arrays cannot hold objects or strings in modern languages",
        "Linked Lists use zero extra bytes for pointers",
      ],
      correctIndex: 1,
      correctFeedback:
        "Crystal clear! Pointer splicing avoids shifting the entire movie row, though reaching the k-th node requires walking link by link (`O(n)`).",
      wrongFeedback:
        "Compare Cinema seats vs Treasure Hunt chits: Linked Lists avoid shifting via `O(1)` pointer updates, but must walk sequentially (`O(n)`) to reach position k.",
    },
    recallKeywords: ["contiguous", "pointer", "shift", "random access", "index", "splice"],
    bonusRecallPrompt:
      "Why is `arr[500]` `O(1)` while `linkedList[500]` takes `O(500)` steps?",
  },
  {
    id: "ep-07-stacks-lifo",
    episodeNumber: 7,
    chapterNumber: 2,
    chapterTitle: "Season 2 · Complexity & Linear Structures",
    title: "Sunday Evening Masala Dosa Plate Stack",
    conceptTopic: "Stacks (LIFO), Undo Buffers & Valid Parentheses",
    durationLabel: "2:00",
    estimatedSeconds: 120,
    teaser:
      "Babloo tries pulling the bottom plate out of a towering cafeteria stack—plus how VS Code Undo and matching brackets work.",
    castTag: "Aarav · Babloo · Auntie-Cook · Mentor Priya",
    segments: [
      {
        speaker: "narrator",
        label: "Scene 1 · The Porcelain Tower of Doom",
        text: "Welcome to Episode 7! Inside the hostel mess, hot steel thali plates come out of the washer and get piled one on top of another: Plate 1 on the bottom, then Plate 2, Plate 3, all the way up to Plate 20 teetering on top.",
      },
      {
        speaker: "character",
        label: "Babloo's Bad Idea",
        text: "Aarav sensibly grabs Plate 20 off the very top—Last In, First Out! Babloo narrows his eyes: 'I want the super-clean bottom plate!' He yanks Plate 1 straight out from beneath nineteen plates—CRASH!! Ceramic shrapnel everywhere! Wait—that exact rule ('newest on top leaves first!') is how your code editor validates brackets `( [ { } ] )` AND runs `Ctrl+Z` Undo! Opening `(` pushes a plate on top; `[` stacks above it; when `]` arrives, it MUST match the topmost plate `[`! If `)` pops out instead when `[` is sitting on top—SYNTAX CRASH!",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Tech Breakdown",
        text: "A **Stack** enforces **LIFO (Last In, First Out)** with `push`, `pop`, and `top/peek` all running in blistering `O(1)` time! From browser Back history and `Ctrl+Z` Undo to Monotonic Stacks ('next warmer temperature / histogram area') and DFS recursion, whenever the most recent unfinished item must be handled first, reach for a Stack!",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Placing hot plate #20 onto the pile",
        technicalConcept: "stack.push(x) — O(1)",
        whyItMatches: "Adds item exclusively to the top.",
      },
      {
        storyElement: "Picking the topmost plate #20 off first",
        technicalConcept: "stack.pop() / stack.peek() — O(1) LIFO",
        whyItMatches: "Most recently added item is always removed/inspected first.",
      },
      {
        storyElement: "Checking newest open bracket before closing",
        technicalConcept: "Valid Parentheses Stack Matching",
        whyItMatches: "Innermost opening delimiter `(` `[` `{` sits on top to be closed first.",
      },
    ],
    technicalExplanation:
      "A Stack is a LIFO linear ADT supporting `O(1)` push, pop, and top. Beyond bracket validation and Undo stacks, **Monotonic Stacks** maintain strictly increasing/decreasing elements to solve 'Next Greater Element' in linear `O(n)` time.",
    miniSnippet: {
      language: "python",
      code: `stack = []
for ch in "({[]})":
    if ch in "({[": stack.append(ch)        # Push onto top
    elif not stack or stack.pop() != match[ch]: return False`,
      complexity: "O(1) per push/pop · O(n) total pass",
    },
    quiz: {
      prompt:
        "You push dishes onto a Stack in exact order `A`, `B`, `C`, pop ONE dish, push `D`, then pop TWO more dishes. Which TWO dishes come out in that second pop sequence?",
      scenarioHint: "Trace the vertical pile step-by-step: Push A -> B -> C -> Pop! -> Push D -> Pop 2!",
      options: [
        "First A, then B (FIFO)",
        "First C (already popped earlier!), no wait—First D, then B",
        "First B, then D",
        "First A, then D",
      ],
      correctIndex: 1,
      correctFeedback:
        "Super sharp! `[A, B, C]` -> pop gives `C` leaving `[A, B]` -> push `D` gives `[A, B, D]` -> two pops give `D` then `B`!",
      wrongFeedback:
        "Trace slowly: after pushing A, B, C, popping once removes `C` (top). Pushing `D` puts `D` above `B`. Now pop twice from the top!",
    },
    recallKeywords: ["lifo", "top", "last in", "first out", "push", "pop"],
    bonusRecallPrompt:
      "Name 2 real software features powered directly by a Stack!",
  },
  {
    id: "ep-08-queues-fifo",
    episodeNumber: 8,
    chapterNumber: 2,
    chapterTitle: "Season 2 · Complexity & Linear Structures",
    title: "Evening Chai Counter & The VIP Cut-In",
    conceptTopic: "Queues (FIFO), Deques & Task Buffers",
    durationLabel: "2:00",
    estimatedSeconds: 120,
    teaser:
      "Why you can't treat a samosa line like a Stack—and how our platform's 50,000-submit burst queue works like a tea stall.",
    castTag: "Chai Uncle · Aarav · Babloo · Mentor Priya",
    segments: [
      {
        speaker: "narrator",
        label: "Scene 1 · Rainy Evening Chai Queue",
        text: "After plate-smashing duty, Aarav and Babloo stand outside Uncle's bustling rain-soaked chai stall. Thirty shivering students queue up cleanly single-file: Aarav arrived first, stood behind nobody; Babloo arrived twentieth.",
      },
      {
        speaker: "character",
        label: "FIFO Chaos vs Fairness",
        text: "Imagine if Chai Uncle suddenly yelled 'LIFO STACK MODE!'—meaning the kid who literally just ran up last gets tea FIRST while Aarav, standing first in the rain for forty minutes, starves until closing time! Riot guaranteed! Instead, Uncle runs strict **First In, First Out (FIFO)**: new students join at the **Back (enqueue)**, hot kulhad chai is handed to whoever stands at the **Front (dequeue)**! Wait—and remember earlier when our LMS handled 50,000 students hitting IDE Submit at once? Same queue! HTTP drops your ticket cleanly into the Back (`202 Queued`), while worker cooks serve the Front steadily without crashing the kettle!",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Tech Breakdown",
        text: "A **Queue** implements fair **FIFO (First In, First Out)** using a circular buffer or linked queue so BOTH `enqueue` and `dequeue` run in `O(1)`! Pro Python warning: `list.pop(0)` shifts every customer forward like Cinema Row G (`O(n)`!), so ALWAYS use `collections.deque().popleft()` for true `O(1)`! And when BOTH ends allow fast add/remove—say sliding windows—that's a **Deque (Double-Ended Queue)**!",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Joining the back of Chai Uncle's line",
        technicalConcept: "queue.enqueue(item) — O(1)",
        whyItMatches: "Arrivals enter at the tail pointer without moving the line.",
      },
      {
        storyElement: "Person at the front receiving chai first",
        technicalConcept: "queue.dequeue() — O(1) FIFO",
        whyItMatches: "Oldest waiting request leaves first, preventing starvation.",
      },
      {
        storyElement: "IDE burst queue buffering 50k submits for 8 workers",
        technicalConcept: "Producer-Consumer Job Queue (BFS / Rate Smoothing)",
        whyItMatches: "Spikes queue calmly instead of crashing worker CPUs.",
      },
    ],
    technicalExplanation:
      "Queues provide `O(1)` FIFO buffering for Breadth-First Search (BFS), level-order tree walks, printer/CPU task scheduling, and absorbing traffic spikes cleanly before worker pools execute them.",
    miniSnippet: {
      language: "python",
      code: `from collections import deque
q = deque(["Aarav", "Priya"])
q.append("Babloo")      # Join back: O(1)
served = q.popleft()    # Serve "Aarav" from front: O(1)! (NOT list.pop(0)!)`,
      complexity: "O(1) enqueue & O(1) dequeue with deque / circular ring buffer",
    },
    quiz: {
      prompt:
        "Why is Python's `q.pop(0)` on a plain list dangerous inside a BFS loop over `n = 100,000` nodes compared to `deque.popleft()`?",
      scenarioHint: "If the front customer leaves and everyone takes 1 step forward in memory each time...",
      options: [
        "list.pop(0) removes the LAST element instead of the first",
        "list.pop(0) shifts all remaining elements left (`O(n)` per pop -> `O(n²)` total), whereas `deque.popleft()` is `O(1)`",
        "deque only works for numbers, not graphs or strings",
        "There is zero difference in performance",
      ],
      correctIndex: 1,
      correctFeedback:
        "10/10 engineering instinct! `list.pop(0)` turns `O(V + E)` BFS into slow `O(V²)` TLE; `deque.popleft()` stays strictly `O(1)`!",
      wrongFeedback:
        "Remember Cinema Row G! Removing index 0 of a contiguous array forces every remaining customer behind them to shift 1 seat left (`O(n)`).",
    },
    recallKeywords: ["fifo", "first in", "shift", "popleft", "deque", "o(1)"],
    bonusRecallPrompt:
      "How does an asynchronous Queue protect a backend compiler server during a massive burst?",
  },
  {
    id: "ep-09-hash-maps",
    episodeNumber: 9,
    chapterNumber: 3,
    chapterTitle: "Season 3 · Fast Lookup & Core Patterns",
    title: "The Bike Key Locker Hook & Collision Drama",
    conceptTopic: "Hash Maps, Hash Functions & Collisions (`O(1)` Avg Lookup)",
    durationLabel: "2:05",
    estimatedSeconds: 125,
    teaser:
      "Why rummaging through a bucket of 1,000 keys takes forever—and how turning any name into a hook number creates O(1) teleportation.",
    castTag: "Watchman · Aarav · Babloo · Mentor Priya",
    segments: [
      {
        speaker: "narrator",
        label: "Scene 1 · One Giant Bucket of 1,000 Hostel Keys",
        text: "Season 3! Tired of waiting in queues, Babloo gets put in charge of the hostel's giant lost-and-found box containing 1,000 jumbled bike keys in ONE deep plastic bucket. Every time someone yells 'Key for Babloo please!', he dumps 500 keys onto the floor searching linearly!",
      },
      {
        speaker: "character",
        label: "Priya's Wooden Key Board",
        text: "Priya sighs and nails up a numbered wooden hook board from `0` to `999`. She invents a secret math spell—a **Hash Function**—say summing the letters of your name mod `1000`! Now `'Aarav'` hashes cleanly to Hook `#217`. Next morning, Aarav doesn't search 1,000 keys—he calculates `#217` in his head and grabs his key in ONE blink! Twist! What if a new guy named `'Varun'` ALSO hashes to Hook `#217`?! That's a **Hash Collision**! Easy fix: hang a tiny two-hook metal chain (`Chaining`) on `#217` holding BOTH keys tagged with their exact names!",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Tech Breakdown",
        text: "A **Hash Map / Set** (`unordered_map`, `HashMap`, Python `dict`) converts ANY key into an array bucket index in **average `O(1)` time**! That's why our platform turns `O(n²)` Two Sum into `O(n)` using a map (`seen[target - x]`), and why our SHA-256 execution cache looks up identical code submissions in under `1ms`! Just remember: Hash Maps aren't sorted—and on astronomical worst-case collisions, average `O(1)` degrades unless well-hashed.",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Turning `'Aarav'` into exact hook #217 via math formula",
        technicalConcept: "Hash Function (`hash(key) % tableSize`)",
        whyItMatches: "Maps arbitrary keys directly to a numeric bucket slot.",
      },
      {
        storyElement: "Walking straight to Hook #217 without checking 0..216",
        technicalConcept: "O(1) Average Lookup / Insert",
        whyItMatches: "Zero linear scan required to test membership or fetch value.",
      },
      {
        storyElement: "'Aarav' & 'Varun' both landing on Hook #217",
        technicalConcept: "Hash Collision (Resolved by Chaining / Probing)",
        whyItMatches: "Distinct keys share a bucket; short chain distinguishes exact keys.",
      },
    ],
    technicalExplanation:
      "Hash Tables combine an array with a deterministic hash function to deliver `O(1)` expected lookups, inserts, and frequency counts. Resizing when load factor rises keeps collision chains tiny (`O(1)` amortized).",
    miniSnippet: {
      language: "cpp",
      code: `unordered_map<long long, int> hookBoard;
// Check if partner exists in O(1) average instead of inner loop:
if (hookBoard.count(target - x)) return { hookBoard[target - x], i };
hookBoard[x] = i;`,
      complexity: "O(1) average lookup/insert · O(n) worst-case adversarial collision",
    },
    quiz: {
      prompt:
        "You have 1,000,000 unsorted usernames and need to check 50,000 times whether a username already exists (`contains`). Which data structure gives fast ~O(1) checks without sorting everything first?",
      scenarioHint: "Would you dig in a plastic bucket, walk a Linked List, or hang a numbered hook board?",
      options: [
        "Linked List (walk pointers per query)",
        "Hash Set (`unordered_set` / `HashSet` / Python `set`)",
        "Unsorted Array (`for` loop per query)",
        "Stack (LIFO pop all names)",
      ],
      correctIndex: 1,
      correctFeedback:
        "Spot on! A Hash Set maps each username straight to its bucket hook in `O(1)` average time—50,000 lookups run almost instantaneously!",
      wrongFeedback:
        "Scanning an array or walking a Linked List 50,000 times over 1,000,000 items yields 50 billion checks (`O(n×q)`). A Hash Set computes the bucket hook in `O(1)`!",
    },
    recallKeywords: ["hash", "bucket", "collision", "o(1)", "chaining", "lookup"],
    bonusRecallPrompt:
      "If two keys accidentally compute the exact same bucket number, what is that called and how do Hash Maps survive it?",
  },
  {
    id: "ep-10-two-pointers",
    episodeNumber: 10,
    chapterNumber: 3,
    chapterTitle: "Season 3 · Fast Lookup & Core Patterns",
    title: "Pinching a Footlong Subway Sandwich from Both Ends",
    conceptTopic: "Two Pointers Pattern (Converging & Same-Direction Pointers)",
    durationLabel: "2:00",
    estimatedSeconds: 120,
    teaser:
      "Aarav checks palindromes from both crust ends inward instead of rewriting the whole bread upside-down.",
    castTag: "Aarav · Babloo · Mentor Priya",
    segments: [
      {
        speaker: "narrator",
        label: "Scene 1 · Symmetric Street Snacks",
        text: "Episode 10! On a Friday food-court run, Babloo insists his weird word-shaped party banner `'RACECAR'` reads identical forward and backward. His plan? Copy the entire banner backwards onto a brand-new sheet (`O(n)` extra paper) and compare.",
      },
      {
        speaker: "character",
        label: "Two Fingers Pinching Inward",
        text: "Aarav laughs, grabs left index finger (`L = 0` on `'R'`) and right index finger (`R = 6` on `'R'`), and marches BOTH fingers inward one step per beat: R matches R, A matches A, C matches C, meet at E—DONE in `O(1)` extra paper! Wait—even cooler on **sorted** price menus! Imagine snacks sorted `[₹10, ₹20, ₹45, ₹60, ₹90]` and your budget is exact `₹80`. Put Left on cheapest `₹10`, Right on most expensive `₹90`. `10 + 90 = 100`, TOO EXPENSIVE! Do you move Left? No—moving Left only makes it MORE expensive! Move Right inward to `60`! Now `10 + 60 = 70`, TOO CHEAP! Move Left right to `20`! `20 + 60 = 80`—JACKPOT without a single Hash Map byte!",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Tech Breakdown",
        text: "**Two Pointers** eliminates inner brute-force loops using sorted order or symmetry, finishing in `O(n)` time and `O(1)` extra space! Whether converging `(left++, right--)` on Two Sum II / Container With Most Water, OR running Fast & Slow pointers (tortoise & hare) to detect Linked List cycles cleanly—never loop twice when two fingers moving purposefully do it in one pass!",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Checking `'R'` at left end and `'R'` at right end simultaneously",
        technicalConcept: "Symmetric Two Pointers (Palindrome Check)",
        whyItMatches: "Verifies mirror equality without allocating a reversed copy (`O(1)` space).",
      },
      {
        storyElement: "Sum ₹10 + ₹90 > ₹80 -> nudge Right price downward",
        technicalConcept: "Sorted Array Two-Pointer Elimination",
        whyItMatches: "Eliminates an entire impossible row/column in 1 step cleanly.",
      },
      {
        storyElement: "Fast runner catching slow walker on a circular track",
        technicalConcept: "Fast & Slow Pointers (Floyd's Cycle Detection)",
        whyItMatches: "Detects cycles or finds Linked List midpoint in O(n), O(1) space.",
      },
    ],
    technicalExplanation:
      "Two Pointers avoids nested `O(n²)` pair checks or `O(n)` extra space by maintaining two indices whose movement guarantees a monotonic invariant (`left` up increases sum; `right` down decreases sum; fast `2x` catches slow `1x`).",
    miniSnippet: {
      language: "cpp",
      code: `int L = 0, R = nums.size() - 1;
while (L < R) {
  int sum = nums[L] + nums[R];
  if (sum == target) return {L, R};
  if (sum < target) L++; else R--; // Sorted logic guides which finger moves!
}`,
      complexity: "O(n) time · O(1) extra space",
    },
    quiz: {
      prompt:
        "In sorted prices `[5, 12, 20, 35, 50]` with `target = 40`, pointers start at `L = 0 (5)` and `R = 4 (50)`. Since `5 + 50 = 55 > 40`, why can we safely do `R--` and NEVER look back at `50` again?",
      scenarioHint: "Compare `50` paired with even the smallest element (`5` -> already too big!).",
      options: [
        "Because 50 is an even number",
        "Because `5` is already the minimum element—`50` plus anything else ≥ `5` would only be even bigger than `55 > 40`",
        "Because `L` must never be zero in sorted arrays",
        "Because moving `R--` resets `L` back to middle",
      ],
      correctIndex: 1,
      correctFeedback:
        "Boom! Since `nums` is sorted, pairing `50` with ANY element to the right of `L` yields `>= 55 > 40`, proving `50` can safely be discarded in `O(1)`!",
      wrongFeedback:
        "Notice `5` is the smallest option on the board—if `5 + 50` is ALREADY over budget (`55 > 40`), pairing `50` with `12`, `20`, or `35` will only be worse!",
    },
    recallKeywords: ["sorted", "left", "right", "monotonic", "smallest", "o(1)"],
    bonusRecallPrompt:
      "What space complexity advantage does Sorted Two Pointers have over a Hash Map for Two Sum II?",
  },
  {
    id: "ep-11-sliding-window",
    episodeNumber: 11,
    chapterNumber: 3,
    chapterTitle: "Season 3 · Fast Lookup & Core Patterns",
    title: "Counting Moving Metro Coaches Through a Window",
    conceptTopic: "Sliding Window (`Fixed` & `Dynamic` `O(n)` Subarray Scans)",
    durationLabel: "2:00",
    estimatedSeconds: 120,
    teaser:
      "Why Babloo stops recounting every passenger from scratch whenever a 3-coach metro train slides forward by one coach.",
    castTag: "Aarav · Babloo · Metro Guard · Mentor Priya",
    segments: [
      {
        speaker: "narrator",
        label: "Scene 1 · Platform Footbridge Math",
        text: "Episode 11 rides the Delhi Metro right outside campus! Aarav and Babloo stand on the footbridge looking through a cardboard viewfinder wide enough to frame **3 adjacent metro coaches** at once. Each coach displays how many noisy freshmen sit inside: `[10, 40, 20, 50, 15, 30]`.",
      },
      {
        speaker: "character",
        label: "Re-counting vs. Sliding",
        text: "Challenge: find the loudest 3-coach window! First frame sees `[10, 40, 20]` -> sum is `70`. When the train nudges forward 1 coach to reveal `[40, 20, 50]`, Babloo grabs his notepad and painfully re-adds `40 + 20 + 50` from zero! If a window held `k = 50,000` coaches, Babloo would re-add 50,000 numbers on every click! Aarav taps his shoulder: 'Wait! `40` and `20` are STILL sitting right inside the window! Just **subtract** Coach `10` rolling out the left edge (`70 - 10 = 60`), and **add** Coach `50` rolling in on the right (`60 + 50 = 110`)!' Two quick ops, NOT fifty thousand!",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Tech Breakdown",
        text: "That cardboard frame is **Sliding Window**! Whether **Fixed-Size** (`max sum subarray of length k`) or **Variable-Size** (`longest substring without repeating characters`—expand `right` until a duplicate creeps in, then shrink `left` until clean!), every single element enters the window once and exits at most once: turning `O(n × k)` brute force into strict linear **`O(n)` time**!",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Re-adding all `k` coaches inside the frame from scratch",
        technicalConcept: "Naive Brute-Force Nested Window (`O(n × k)`)",
        whyItMatches: "Recomputes `k - 1` overlapping items repeatedly.",
      },
      {
        storyElement: "Subtract leaving coach + add entering coach in 2 ops",
        technicalConcept: "Fixed Sliding Window Update (`O(n)`)",
        whyItMatches: "Maintains running state incrementally across transitions.",
      },
      {
        storyElement: "Widening frame until duplicate hits, then shrinking left",
        technicalConcept: "Dynamic Sliding Window + Map (`O(n)`)",
        whyItMatches: "`left` & `right` move rightward only—2n total steps max!",
      },
    ],
    technicalExplanation:
      "Sliding Window maintains a running invariant (sum, frequency map, max count) over a contiguous `[left..right]` range. Each index enters once via `right++` and leaves at most once via `left++`, guaranteeing `O(n)` linear runtime.",
    miniSnippet: {
      language: "python",
      code: `window_sum = sum(arr[:k])
best = window_sum
for r in range(k, len(arr)):
    window_sum += arr[r] - arr[r - k]  # Add right incoming, drop left outgoing!
    best = max(best, window_sum)`,
      complexity: "O(n) time · O(1) extra space (fixed window)",
    },
    quiz: {
      prompt:
        "During variable Sliding Window for 'Longest Substring Without Repeating Characters' on `'abcbef'`, `right` hits the second `'b'` (index 3) while `'a','b','c'` are in the window. What must the left edge do?",
      scenarioHint: "Does sliding window jump randomly or tighten `left` until the duplicate condition clears?",
      options: [
        "Reset everything and jump straight to the end of the string",
        "Shrink `left` rightward past the old `'b'` (`left = 2`, leaving `'cb'`) so all characters in the window are unique again",
        "Sort the string alphabetically first",
        "Keep both `'b'`s in the window and mark invalid later",
      ],
      correctIndex: 1,
      correctFeedback:
        "Clean! Advancing `left` just past the earlier `'b'` restores the window's uniqueness invariant (`'cb'`) in amortized `O(1)` without restarting from index 0!",
      wrongFeedback:
        "Dynamic Sliding Window shrinks `left` just enough to eject the offending duplicate `'b'`, keeping the valid `'c'` already inside the window.",
    },
    recallKeywords: ["subtract", "add", "overlap", "shrink", "once", "o(n)"],
    bonusRecallPrompt:
      "Why does a nested `while (left shrinks)` inside `for (right expands)` still run in `O(n)` time, not `O(n²)`?",
  },
  {
    id: "ep-12-binary-search",
    episodeNumber: 12,
    chapterNumber: 3,
    chapterTitle: "Season 3 · Fast Lookup & Core Patterns",
    title: "Guessing Grandma's Lost TV Volume by Halving",
    conceptTopic: "Binary Search & Searching on Sorted / Monotonic Answer Spaces",
    durationLabel: "2:00",
    estimatedSeconds: 120,
    teaser:
      "Grandma refuses to read the 1-to-100 volume bar—can Aarav lock her exact favorite loudness in at most 7 tries?",
    castTag: "Grandma · Aarav · Babloo · Mentor Priya",
    segments: [
      {
        speaker: "narrator",
        label: "Scene 1 · Sunday Cricket Match Volume Crisis",
        text: "Season 3 finale! It's Sunday afternoon and Grandma shouts from the kitchen: 'Turn the TV up! Somewhere between 1 and 100 is my perfect commentary volume!' Unfortunately the on-screen volume number faded off!",
      },
      {
        speaker: "character",
        label: "Babloo's 1-by-1 Clicking vs Aarav's Chop",
        text: "Babloo grabs the remote and clicks 1, 2, 3, 4, 5... asking 'Good yet Grandma? Good yet?' after EVERY single number—taking up to 100 clicks! Aarav snatches the remote and clicks straight to the dead-middle **Volume 50**! Grandma yells 'TOO LOUD!' Boom—in ONE single question, Aarav deletes Volumes 50 through 100 FOREVER! Next guess hits dead-middle of 1..49: **Volume 25** -> 'TOO QUIET!' Goodbye 1 through 25! Halving from 100 -> 50 -> 25 -> 12 -> 6 -> 3 -> 1 guarantees Aarav finds ANY secret volume between 1 and 100 in **at most 7 clicks**, or between 1 and 4 BILLION in only **32 clicks**!",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Tech Breakdown",
        text: "**Binary Search** achieves **`O(log n)`** by slicing half of a sorted (or monotonic!) search space at every midpoint `mid = L + (R - L) / 2`! Wait—writing `L + (R - L) / 2` avoids 32-bit integer overflow vs `(L + R) / 2`! Even better, in interviews like 'Koko Eating Bananas' or 'Minimum Capacity to Ship Packages', the answer space itself is monotonic (works at speed X -> works at X+1), letting you Binary Search the *answer* even without a sorted array!",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Clicking 1, 2, 3, 4... asking Grandma each time",
        technicalConcept: "Linear Search — O(n)",
        whyItMatches: "Checks sequentially; billion items take a billion checks.",
      },
      {
        storyElement: "Guessing midpoint 50; 'Too Loud' deletes 50..100 instantly",
        technicalConcept: "Binary Search — O(log₂ n)",
        whyItMatches: "Each comparison cuts remaining candidates in half.",
      },
      {
        storyElement: "'Works cleanly at speed S -> works at faster speeds too'",
        technicalConcept: "Binary Search on Answer (Monotonic Predicate)",
        whyItMatches: "Applies log-time search to optimization problems directly!",
      },
    ],
    technicalExplanation:
      "Binary Search requires a monotonic property (sorted elements or a False...True transition boundary) so inspecting `mid = left + (right - left) // 2` eliminates half the search space each iteration (`O(log n)`).",
    miniSnippet: {
      language: "cpp",
      code: `int l = 0, r = n - 1;
while (l <= r) {
  int mid = l + (r - l) / 2; // Safe against integer overflow!
  if (arr[mid] == target) return mid;
  if (arr[mid] < target) l = mid + 1; else r = mid - 1;
}`,
      complexity: "O(log n) time · O(1) space",
    },
    quiz: {
      prompt:
        "You have a sorted array containing **1,048,576 (`2²⁰`)** integers. Approximately how many midpoint checks does Binary Search need in the worst case before finding (or proving absence of) a target?",
      scenarioHint: "Every single check divides `2²⁰` by `2`!",
      options: [
        "524,288 checks (half of the array)",
        "Around 20–21 checks (log₂ of 2²⁰ = 20)",
        "1,024 checks (square root of n)",
        "1,048,576 checks",
      ],
      correctIndex: 1,
      correctFeedback:
        "Power of logarithms! `log₂(1,048,576) = 20` halves—roughly 20 checks instead of a million!",
      wrongFeedback:
        "Remember: each comparison shrinks `2²⁰` to `2¹⁹`, then `2¹⁸`... counting down the exponent takes just ~20 comparisons!",
    },
    recallKeywords: ["half", "log", "sorted", "monotonic", "midpoint", "overflow"],
    bonusRecallPrompt:
      "Why do senior engineers write `mid = l + (r - l) / 2` instead of `(l + r) / 2`?",
  },
];
