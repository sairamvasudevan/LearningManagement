import type { AudioDsaEpisode } from "@/lib/audio-dsa-types";

export const AUDIO_DSA_SEASON_B: AudioDsaEpisode[] = [
  {
    id: "ep-14-sorting-divide-conquer",
    episodeNumber: 14,
    chapterNumber: 4,
    chapterTitle: "Season 4 · Sorting, Intervals & Greedy",
    title: "College Fest Merch T-Shirt Box (`Merge`, `Quick` & `3-Way Sort`)",
    conceptTopic: "Merge Sort, Quick Sort, Dutch National Flag (`O(n)` 3-Way) & Stability",
    durationLabel: "2:05",
    estimatedSeconds: 125,
    teaser:
      "Babloo sorts 1,000 unordered Fest T-shirts by swapping neighbors 500,000 times—until Aarav deploys Divide-and-Conquer + 3-Way Sort.",
    castTag: "Fest Coordinator · Aarav · Babloo · Mentor Priya",
    mappedProblems: ["Sort Colors (Dutch Flag 0/1/2)", "Sort an Array (`Merge Sort`)", "Kth Largest (`Quickselect`)"],
    segments: [
      {
        speaker: "narrator",
        label: "Hook · Sorting 1,000 Messy Merch Drops",
        text: "Welcome to Season 4! Twenty minutes before Freshers Concert doors open, 1,000 unsorted merch T-shirts dump across the gym floor! Babloo volunteers to sort Roll Numbers using Bubble Sort—swapping two shirts side-by-side over and over (`O(n²)`, five hundred thousand sweaty swaps!).",
      },
      {
        speaker: "character",
        label: "Setup · Split-and-Zipper vs. Pivot Walls",
        text: "Aarav grabs 7 dorm buddies for **Merge Sort**: split 1,000 -> 500 -> 250... down until everyone holds **1 sorted shirt**, then **zipper-merge** two sorted piles back up simply comparing top shirts (`O(n log n)` guaranteed, zero `O(n²)` collapse, AND **stable** preserving tie order!). Wait—what about sorting ONLY `[Small=0, Medium=1, Large=2]` boxes in place WITHOUT even `O(n log n)`?",
        sfx: "scratch",
      },
      {
        speaker: "punchline",
        label: "Punchline · Dutch Flag 3-Pointer Wingmen",
        text: "BAM—use **Dutch National Flag (`3 pointers: low, mid, high`)**: toss Small (`0`) left to `low++`, leave Medium (`1`) chilling in the center (`mid++`), fling Large (`2`) straight right to `high--` (`DON'T increment mid yet—inspect whatever swapped in!`)—sorting all 1,000 tees in **`O(n)` single pass, `O(1)` space**, before Babloo even puts down two shirts!",
        pauseBeforeMs: 380,
        sfx: "rimshot",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Full Technical Breakdown",
        text: "Master the full sorting playbook: **Merge Sort** guarantees `O(n log n)` worst-case and solves **Count Inversions / Reverse Pairs**; **Quick Sort** partitions around a randomized pivot in `O(1)` heap space (`Quickselect` finds `K`-th element in average `O(n)`!); **Dutch National Flag** sorts 3-category arrays (`Sort Colors`) in `O(n)`; and **Counting/Bucket Sort** crushes bounded integers (`Top K Frequent`) in pure linear **`O(n)`**!",
        pauseBeforeMs: 300,
        sfx: "ding",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Splitting boxes `1000->500->...->1` then zipper-merging tops",
        technicalConcept: "Merge Sort (`O(n log n)` Worst-Case, Stable)",
        whyItMatches: "Logarithmic depth × linear merge prevents adversarial `O(n²)` slowdown.",
      },
      {
        storyElement: "Picking random pivot wall: smaller left, bigger right",
        technicalConcept: "Randomized Quick Sort / Quickselect",
        whyItMatches: "In-place cache speed; Quickselect finds K-th largest in `O(n)` avg!",
      },
      {
        storyElement: "Flinging `0` Left, keeping `1` Middle, throwing `2` Right",
        technicalConcept: "Dutch National Flag (`O(n)`, `O(1)` space)",
        whyItMatches: "Beats `O(n log n)` completely when distinct keys <= 3.",
      },
    ],
    technicalExplanation:
      "Comparison sorts hit an `Omega(n log n)` mathematical lower bound. Use Merge Sort when stability or guaranteed worst-case matters (or Linked List sorting!), Dutch Flag for 3-way partitions, and Quickselect for `O(n)` average top-K selection.",
    miniSnippet: {
      language: "cpp",
      code: `// Dutch National Flag (Sort 0, 1, 2 in 1 pass, O(1) space):
int low = 0, mid = 0, high = n - 1;
while (mid <= high) {
  if (a[mid] == 0) swap(a[low++], a[mid++]);
  else if (a[mid] == 1) mid++;
  else swap(a[mid], a[high--]); // Re-inspect swapped item at mid!
}`,
      complexity: "Dutch Flag: O(n) · Merge/Quick: O(n log n)",
    },
    quiz: {
      prompt:
        "In **Dutch National Flag**, when `a[mid] == 2` and we `swap(a[mid], a[high--])`, why must we **NOT increment `mid++`** immediately?",
      scenarioHint: "Compare swapping with `a[low]` (which you ALREADY walked past!) vs `a[high]` (unexamined blind spot!).",
      options: [
        "`mid` only moves backwards in C++",
        "The value arriving from `a[high]` hasn't been inspected yet—it might be another `0` or `2` needing proper placement!",
        "`2` belongs in the middle of the array",
        "Incrementing `mid` skips odd indices",
      ],
      correctIndex: 1,
      correctFeedback:
        "Sharp bug catch! `low..mid` is guaranteed all `1`s already, so `a[low]` was known. `a[high]` was UNSEEN—so keep `mid` put to inspect it next!",
      wrongFeedback:
        "Remember what sits at `a[high]` before the swap: an unexamined element! It could be `0`—skipping `mid++` avoids leaving a `0` stranded in the middle!",
    },
    recallKeywords: ["merge sort", "pivot", "dutch flag", "stable", "o(n log n)", "quickselect"],
    bonusRecallPrompt:
      "Why does sorting a Linked List overwhelmingly prefer Merge Sort over Quick Sort in system libraries?",
  },
  {
    id: "ep-15-greedy-algorithms",
    episodeNumber: 15,
    chapterNumber: 4,
    chapterTitle: "Season 4 · Sorting, Intervals & Greedy",
    title: "Chatori Night Market & The Greedy Coin Scam",
    conceptTopic: "Greedy Choice Property (`Scheduling` Wins vs. `DP` Coin Traps)",
    durationLabel: "2:00",
    estimatedSeconds: 120,
    teaser:
      "Babloo greedily packs back-to-back fest events by shortest duration—and gets roasted when custom tokens pay ₹6 with 3 coins instead of 2.",
    castTag: "Aarav · Babloo · Stall Vendor · Mentor Priya",
    mappedProblems: ["Non-Overlapping Intervals", "Jump Game I/II", "Assign Cookies / Lemonade Change"],
    segments: [
      {
        speaker: "narrator",
        label: "Hook · Taking Maximum Free Stalls Tonight",
        text: "Episode 15 explores **Greedy**: always taking the best-looking choice RIGHT NOW without backtracking or building DP tables. When does gut greed win cleanly—and when does it faceplant?",
      },
      {
        speaker: "character",
        label: "Setup · Greedy Win (`Jump Game`) vs. Greedy Failure",
        text: "Win #1 (**Fest Shows Scheduling**): Five music gigs clash tonight—how fit the MOST shows cleanly? Not 'earliest start', not 'shortest concert' (a tiny 15-min band dead-center could wreck two longer sets!). Pick the show that **ENDS EARLIEST**, freeing your schedule quickest for leftovers (`100% Optimal Greedy!`). NOW watch Babloo's Fail #2: Chatori Arcade uses weird custom tokens **`[₹4, ₹3, ₹1]`**, and prize costs exact **`₹6`** in FEWEST tokens!",
        sfx: "scratch",
      },
      {
        speaker: "punchline",
        label: "Punchline · Getting Outsmarted by `[4, 3, 1]`",
        text: "Babloo beats his chest: `'GREEDY KING! Grab ₹4 token FIRST!'` Leaving `₹2`—forcing `₹1 + ₹1` = **3 clinking tokens (`4+1+1`)**! Aarav calmly slides **`₹3 + ₹3` (`2 tokens`!)** across the counter and walks off with free churros!",
        pauseBeforeMs: 360,
        sfx: "rimshot",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Full Technical Breakdown",
        text: "Never assume Greedy works just because it feels clever—test a tiny counterexample like `[4, 3, 1]` making `6`! Greedy succeeds ONLY when a current best choice never paints you out of future options (**Exchange Argument**: `Activity Selection`, `Jump Game furthest reach`, `Gas Station net >= 0`, `Huffman Coding`). Whenever denominations/weights interact weirdly across choices (`0/1 Knapsack`, weird `Coin Change`), **Dynamic Programming** takes over!",
        pauseBeforeMs: 300,
        sfx: "ding",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Always picking gig that finishes earliest (`endTime`)",
        technicalConcept: "Greedy Activity / Non-Overlapping Intervals (`O(n log n)`)",
        whyItMatches: "Maximizes untouched clock left for subsequent picks.",
      },
      {
        storyElement: "Tracking `farthest = max(farthest, i + nums[i])` across stepping stones",
        technicalConcept: "Greedy Reachability (`Jump Game`, `O(n)`, `O(1)` space)",
        whyItMatches: "You never need the exact jump sequence just to check reachability!",
      },
      {
        storyElement: "Coins `[4, 3, 1]` making `6`: `4+1+1` (3) loses to `3+3` (2)",
        technicalConcept: "Greedy Fails -> Switch to DP (`Coin Change`)",
        whyItMatches: "Local largest choice blocks a better global combination.",
      },
    ],
    technicalExplanation:
      "Greedy algorithms run fast (`O(n)` or `O(n log n)` after sorting) by making one irrevocable choice per step. Prove correctness mentally by verifying why swapping ANY other choice with your Greedy pick stays at least as good.",
    miniSnippet: {
      language: "cpp",
      code: `// Jump Game (Greedy reachability in O(n), NOT O(n^2) DP!):
int farthest = 0;
for (int i = 0; i < n; i++) {
  if (i > farthest) return false;       // Unreachable gap!
  farthest = max(farthest, i + nums[i]);
}`,
      complexity: "O(n) time · O(1) space",
    },
    quiz: {
      prompt:
        "You must attend the **maximum number of non-overlapping club meetings** on a single day given `[start, end]` intervals. By which field MUST you sort first for Greedy to guarantee optimality?",
      scenarioHint: "What if a 10-hour marathon meeting starts early at `8:00 AM` (`[8, 18]`), overlapping five quick meetings `[9,10], [10,11]...`?",
      options: [
        "Sort ascending by `start` time",
        "Sort ascending by `end` time (pick the meeting that **finishes earliest**!)",
        "Sort descending by meeting duration",
        "Sort alphabetically by club name",
      ],
      correctIndex: 1,
      correctFeedback:
        "Dead-on! Sorting by `end` time avoids getting hijacked by an early 10-hour marathon—freeing your calendar as soon as humanly possible!",
      wrongFeedback:
        "Sorting by `start` time fails if `[8, 18]` spans the whole day and kills five `[9,10]..[13,14]` slots! Finishing earliest maximizes remaining room.",
    },
    recallKeywords: ["greedy", "end time", "counterexample", "farthest", "intervals", "optimal"],
    bonusRecallPrompt:
      "In `Gas Station`, if `totalGas >= totalCost`, why does resetting `start = i + 1` whenever tank dips below 0 find the unique valid starting pump in 1 pass?",
  },
  {
    id: "ep-16-merge-intervals",
    episodeNumber: 16,
    chapterNumber: 4,
    chapterTitle: "Season 4 · Sorting, Intervals & Greedy",
    title: "Sneaking Out Between CCTV Guard Shifts (`Intervals`)",
    conceptTopic: "Merging Intervals, Insert Interval & Sweep-Line Meeting Rooms",
    durationLabel: "2:00",
    estimatedSeconds: 120,
    teaser:
      "Five hostel guards submit messy overlapping patrol windows—Aarav merges them cleanly to spot exact late-night dosa gaps!",
    castTag: "Aarav · Babloo · Watchmen · Mentor Priya",
    mappedProblems: ["Merge Intervals", "Insert Interval", "Meeting Rooms II (Min Heaps / Sweep Line)"],
    segments: [
      {
        speaker: "narrator",
        label: "Hook · Messy Overlapping Time Ranges",
        text: "Episode 16 closes Season 4 with the #1 practical calendar interview pattern: **Intervals `[start, end]`**! Three sleepy hostel guards report patrol blocks out of order: `[8..10 PM]`, `[1..3 AM]`, `[9..11 PM]`!",
      },
      {
        speaker: "character",
        label: "Setup · Sorting Start Times Unlocks Everything",
        text: "How turn chaotic overlapping ranges into clean merged blocks? Step 1: ALWAYS sort intervals by **`start` time** (`[8..10]`, `[9..11]`, `[1..3]`). Step 2: Watch adjacent clocks! Since `9 <= 10`, Guard 2 overlaps Guard 1—so extend the tail end (`end = max(10, 11) -> [8..11]`)! Then `[1..3 AM]` sits cleanly after `11 PM`—zero overlap, new block! Wait—what if Dean asks `'How many SIMULTANEOUS study rooms do we need if `[9..12]`, `[10..11]`, `[10:30..12]` overlap?!'`",
        sfx: "scratch",
      },
      {
        speaker: "punchline",
        label: "Punchline · Counting Door Clicks (`+1 In`, `-1 Out`)",
        text: "Treat every meeting start as **'+1 person entering room'** and every end as **'-1 leaving room'** along a sorted timeline (**Sweep Line**)! Walk the clock watching your peak occupancy counter hit `3` -> boom, exact minimum rooms needed (`3`) in `O(n log n)` while Babloo is still drawing overlapping bars in MS Paint!",
        pauseBeforeMs: 360,
        sfx: "rimshot",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Full Technical Breakdown",
        text: "Notice the clean duality between Episodes 15 & 16! **Non-overlapping Greedy Removal** sorts by **`end` time**; **Merge Intervals & Sweep Line (`Meeting Rooms II`)** sorts by **`start` time** (or `(+1/-1)` events sorted ascending, breaking ties with `-1 exit` BEFORE `+1 enter` at the exact same timestamp if `[1, 2]` and `[2, 3]` can share one room)! Once sorted, check overlap cleanly via `nextStart <= currentEnd`!",
        pauseBeforeMs: 300,
        sfx: "ding",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Lining patrol guards chronologically `[8..10]`, `[9..11]`",
        technicalConcept: "Sort by Start Time (`O(n log n)`)",
        whyItMatches: "Ensures any overlapping partners appear immediately adjacent.",
      },
      {
        storyElement: "`[9..11]` merging into `[8..10]` -> `[8..11]` (`max` end!)",
        technicalConcept: "`res.back()[1] = max(res.back()[1], cur[1])`",
        whyItMatches: "Avoids shrinking when one wide interval completely swallows a short one like `[1..10]` & `[2..4]`!",
      },
      {
        storyElement: "Counting `+1 enter` & `-1 exit` across sorted clock ticks",
        technicalConcept: "Sweep-Line / Min-Heap (`Meeting Rooms II`)",
        whyItMatches: "Tracks peak simultaneous overlaps cleanly.",
      },
    ],
    technicalExplanation:
      "Sorting intervals brings overlapping segments adjacent (`prev.end >= cur.start`), turning `Merge Intervals` into a single `O(n)` fold (`cur.end = max(prev.end, cur.end)`). Sweep-line events or a Min-Heap of end times compute max concurrent overlap (`Meeting Rooms II`).",
    miniSnippet: {
      language: "python",
      code: `intervals.sort(key=lambda x: x[0])
merged = [intervals[0]]
for s, e in intervals[1:]:
    if s <= merged[-1][1]: merged[-1][1] = max(merged[-1][1], e) # Check max()!
    else: merged.append([s, e])`,
      complexity: "O(n log n) sort + O(n) scan",
    },
    quiz: {
      prompt:
        "During **Merge Intervals** on sorted `[[1, 10], [2, 5]]`, a student writes `merged.back()[1] = cur[1]` (`5`) instead of `max(merged.back()[1], cur[1])`. What breaks?",
      scenarioHint: "Notice `[1, 10]` completely swallows `[2, 5]` inside it!",
      options: [
        "Nothing breaks because arrays stay sorted",
        "It shrinks `[1, 10]` down to `[1, 5]` and accidentally deletes `[5..10]` coverage!",
        "It throws a Division by Zero runtime error",
        "It forces `O(n²)` sorting",
      ],
      correctIndex: 1,
      correctFeedback:
        "Classic edge case spotted! Whenever an outer interval contains a shorter inner one, `max()` preserves the `10` end boundary!",
      wrongFeedback:
        "Trace `[[1, 10], [2, 5]]`: overwriting `10` directly with `cur[1] (5)` clips away half of the longer `[1, 10]` span!",
    },
    recallKeywords: ["sort start", "overlap", "max end", "sweep line", "rooms", "merge"],
    bonusRecallPrompt:
      "When `[1, 5]` and `[5, 8]` meet cleanly at timestamp `5`, how does `(timestamp, delta)` tie-breaking guarantee Sweep Line handles touching endpoints accurately?",
  },
  {
    id: "ep-17-binary-trees-traversals",
    episodeNumber: 17,
    chapterNumber: 5,
    chapterTitle: "Season 5 · Trees, Heaps & Tries",
    title: "The Placement Referral Chain & Team Huddle (`Binary Trees`)",
    conceptTopic: "Binary Trees (`Pre/In/Post` DFS vs. `Level-Order BFS`) & Tree Recursion",
    durationLabel: "2:05",
    estimatedSeconds: 125,
    teaser:
      "An alumni mentor network branches downward cleanly two mentees per senior—how collecting branch metrics recursively solves almost every Tree problem.",
    castTag: "Alumni Lead · Aarav · Babloo · Mentor Priya",
    mappedProblems: ["Maximum Depth / Diameter of Binary Tree", "Invert Binary Tree", "Level Order Traversal"],
    segments: [
      {
        speaker: "narrator",
        label: "Hook · From Flat Arrays to Branching Trees",
        text: "Welcome to Season 5! Our college placement club runs a neat **Binary Tree** mentorship hierarchy: Alumni Lead sits at the **Root**, mentoring at most **Two Juniors** (`left` and `right`), who mentor two sophomores each down to freshman **Leaves** (zero children!).",
      },
      {
        speaker: "character",
        label: "Setup · 2 Distinct Ways to Tour the Club",
        text: "Need a birthday celebration photo? Two tour styles! Style 1 (**Level-Order BFS** using a **Queue**!): Invite Level 0 Root -> then ALL Level 1 leads together -> then ALL Level 2 sophomores—layer-by-layer (`Queue pops current floor size`)! Style 2 (**Depth-First Recursion**): dive all the way down Left branch first using Pre/In/Post timing (`Root-First` copies structures; `Children-First Postorder` collects bottom-up salaries/heights before computing parent!).",
        sfx: "scratch",
      },
      {
        speaker: "punchline",
        label: "Punchline · Returning Two Heights Up One Call",
        text: "Watch **Diameter of Binary Tree** confuse 90% of sophomores: `'Longest path between ANY two nodes!'` Naive coder runs `depth()` inside every node (`O(n²)`!). Mentor Priya stops Babloo cleanly: `'When DFS walks UP from Left and Right mentees, return height = 1 + max(L, R), AND quietly update global best_diameter = max(best, L + R) at every node—ONE single O(n) pass!'`",
        pauseBeforeMs: 380,
        sfx: "rimshot",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Full Technical Breakdown",
        text: "Every recursive **Binary Tree** problem boils down to ONE crisp question: **What information does Parent need from `left` and `right` subtrees to compute its own return value?** Pre-order (`Root -> L -> R`) serializes/clones trees; In-order (`L -> Root -> R`) sorts BSTs; Post-order (`L -> R -> Root`) frees memory and aggregates heights, balanced checks, and diameters in **`O(n)` single pass** (`O(h)` stack space)!",
        pauseBeforeMs: 300,
        sfx: "ding",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Queueing Floor 0 -> Floor 1 -> Floor 2 photo waves",
        technicalConcept: "Level-Order BFS (`for _ in range(len(q))` Queue)",
        whyItMatches: "Captures exact floor-by-floor arrays (`Right Side View`, `Zigzag`).",
      },
      {
        storyElement: "Waiting on Left & Right heights before answering Parent",
        technicalConcept: "Post-Order Bottom-Up DFS (`O(n)`)",
        whyItMatches: "Computes Height, Balanced Tree, Max Path Sum & Diameter in 1 pass!",
      },
      {
        storyElement: "Senior with zero mentees (`left == null && right == null`)",
        technicalConcept: "Leaf Node / Null Base Case (`if (!root) return 0`)",
        whyItMatches: "Guarantees recursion stops cleanly without crashing.",
      },
    ],
    technicalExplanation:
      "Trees are connected, acyclic graphs (`V` nodes, `V-1` edges) with a unique path between any pair. Single-pass Post-order DFS avoids quadratic `O(n²)` re-traversals by computing subtree heights while simultaneously updating global answers (`diameter`, `maxPathSum`).",
    miniSnippet: {
      language: "python",
      code: `def diameter(node): # Computes height + updates global diameter in ONE O(n) pass!
    if not node: return 0
    L, R = diameter(node.left), diameter(node.right)
    self.best = max(self.best, L + R)   # Path passing through this node
    return 1 + max(L, R)                # Height handed up to parent`,
      complexity: "O(n) time · O(h) recursion space (`log n` balanced, `n` skewed)",
    },
    quiz: {
      prompt:
        "In **Binary Tree Right Side View** (only seeing the rightmost person standing on every floor), how can standard **Level-Order BFS** grab those exact rightmost nodes cleanly?",
      scenarioHint: "Each floor loop iterates `for (int i = 0; i < levelSize; i++)` left-to-right across the Queue!",
      options: [
        "Walk only `root->right->right...` blindly ignoring left deeper branches!",
        "Run Level-Order BFS processing `levelSize = q.size()` items per floor, capturing the **last node (`i == levelSize - 1`)** of each level!",
        "Sort all tree values descending first",
        "Run Post-order traversal without level tracking",
      ],
      correctIndex: 1,
      correctFeedback:
        "Smooth! Blindly following `->right` fails whenever the Left subtree stretches deeper than the Right! Processing floor-by-floor (`i == levelSize - 1`) sees across gaps accurately!",
      wrongFeedback:
        "Careful! If the right branch stops at depth 2 while the left branch drops to depth 5, chasing only `->right` misses floors 3–5 completely!",
    },
    recallKeywords: ["bfs", "post-order", "diameter", "subtree", "height", "o(n)"],
    bonusRecallPrompt:
      "Why do we save `int sz = q.size()` BEFORE starting the inner `for` loop in Level-Order BFS?",
  },
  {
    id: "ep-18-bst-lca",
    episodeNumber: 18,
    chapterNumber: 5,
    chapterTitle: "Season 5 · Trees, Heaps & Tries",
    title: "Automated Library Roll-Number Shelf (`BST` & `LCA`)",
    conceptTopic: "Binary Search Trees (`BST`), Validation Invariants & Lowest Common Ancestor",
    durationLabel: "2:00",
    estimatedSeconds: 120,
    teaser:
      "Why checking ONLY immediate left & right children accidentally breaks BST validation—plus finding the Lowest Common Boss between two buddies.",
    castTag: "Librarian · Aarav · Babloo · Mentor Priya",
    mappedProblems: ["Validate BST (`min..max` bounds)", "Lowest Common Ancestor in BST / Tree", "Kth Smallest in BST"],
    segments: [
      {
        speaker: "narrator",
        label: "Hook · Sorted Tree Speed Meets Secret Bug",
        text: "Episode 18 steps into the campus smart library! Librarian organizes every shelf by a **Binary Search Tree (`BST`)**: every shelf LEFT of Pivot `50` holds Roll Numbers **strictly `< 50`**, every shelf RIGHT holds **strictly `> 50`**. Searching 1,000,000 books takes just `20` left/right turns (`O(log n)` balanced)!",
      },
      {
        speaker: "character",
        label: "Setup · The Sneaky BST Validation Trap",
        text: "Pop quiz! Babloo inspects Shelf `50`, sees Left `30 < 50`, looks under `30`'s right child `99 > 30`, and yells: `'VALID BST!! Because 30 < 50 and 99 > 30!'` Hold up—wait a second!! Where is `99` sitting?! On Root `50`'s **LEFT** wing!! How the heck did Roll `99` infiltrate the `< 50` wing?!",
        sfx: "scratch",
      },
      {
        speaker: "punchline",
        label: "Punchline · Pass Down Allowed Ranges + Find LCA Split",
        text: "Boom! Checking ONLY parent vs child misses rogue `99` sneaking deeper inside Left Wing! Every descendant MUST respect an inherited **`(minBound, maxBound)` corridor** passed down from Root (`30`'s right child MUST stay strictly `< 50`!)! Wait—and finding the **Lowest Common Senior (`LCA`)** between Roll `22` and Roll `48` inside a BST? Walk down from Root together until their paths **fork in opposite directions** (`one < root` and `one > root`)—THAT exact fork node is LCA in `O(h)`!",
        pauseBeforeMs: 380,
        sfx: "rimshot",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Full Technical Breakdown",
        text: "Two rock-solid BST rules! Rule 1: **In-Order traversal (`Left -> Node -> Right`)** on ANY valid BST produces **strictly ascending sorted values** (solving `Validate BST` and `Kth Smallest` cleanly!). Rule 2: Always guard against a **Skewed BST**—inserting sorted `[1, 2, 3, 4, 5]` degrades a BST straight into an `O(n)` right-leaning Linked List unless balanced (`AVL / Red-Black`, like Java `TreeMap` / C++ `std::map`)!",
        pauseBeforeMs: 300,
        sfx: "ding",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Every descendant inside Root `50`'s Left wing staying `< 50`",
        technicalConcept: "BST Bound Propagation `(low, high)`",
        whyItMatches: "Immediate `left < node < right` alone fails deep violations!",
      },
      {
        storyElement: "Walking `Left -> Self -> Right` reading shelves in Roll order",
        technicalConcept: "In-Order Traversal Yields Sorted Array (`O(n)`)",
        whyItMatches: "Left subtree < root < right subtree orders nodes naturally.",
      },
      {
        storyElement: "Exact node where Roll 22 goes Left while Roll 48 goes Right",
        technicalConcept: "BST Lowest Common Ancestor (`O(h)` time, `O(1)` iterative)",
        whyItMatches: "First split node strictly between `p` and `q` is lowest ancestor!",
      },
    ],
    technicalExplanation:
      "Validate BST either via In-Order previous-value strict comparison (`prev < curr`) OR passing `(minVal, maxVal)` bounds downward. In a balanced BST, search, insert, delete, and LCA run in `O(log n)`.",
    miniSnippet: {
      language: "cpp",
      code: `bool isValidBST(TreeNode* root, long low = LONG_MIN, long high = LONG_MAX) {
  if (!root) return true;
  if (root->val <= low || root->val >= high) return false;
  return isValidBST(root->left, low, root->val)
      && isValidBST(root->right, root->val, high);
}`,
      complexity: "O(n) validation · O(log n) avg BST search (`O(n)` if skewed)",
    },
    quiz: {
      prompt:
        "If you insert sorted elements **`1, 2, 3, 4, 5, ..., 100,000`** sequentially into a plain unbalanced BST, what happens to search speed (`contains(99999)`)?",
      scenarioHint: "Every new value is larger than the last—which child branch does EVERY single insert take?",
      options: [
        "Stays `O(log n)` automatically",
        "Degenerates into a **right-skewed chain** (`O(n)` height = slow Linked List `O(n)` search!)",
        "Throws a Hash Collision exception",
        "Turns into a Max-Heap automatically",
      ],
      correctIndex: 1,
      correctFeedback:
        "Spot on! Ascending inserts hang strictly off every `->right` pointer, flattening tree height into `100,000` (`O(n)`) unless self-balanced (`AVL`/`Red-Black`)!",
      wrongFeedback:
        "Every number exceeds the root and hops exclusively right—building a straight 100,000-node staircase instead of a balanced bushy tree!",
    },
    recallKeywords: ["bst", "bounds", "inorder", "skewed", "lca", "balanced"],
    bonusRecallPrompt:
      "Without BST ordering (in an arbitrary **General Binary Tree**), how does recursive Post-order locate `LCA(p, q)` in `O(n)`?",
  },
  {
    id: "ep-19-heaps-priority-queues",
    episodeNumber: 19,
    chapterNumber: 5,
    chapterTitle: "Season 5 · Trees, Heaps & Tries",
    title: "VIP Club Bouncer & Hackathon Swag Leaderboard (`Heaps`)",
    conceptTopic: "Min/Max Heaps (`Priority Queue`), Top-K Pattern & Two-Heap Median",
    durationLabel: "2:05",
    estimatedSeconds: 125,
    teaser:
      "A regular queue makes a fracturing skater wait behind sneezing freshmen—and how Two Heaps track a live Median score in O(log n).",
    castTag: "Bouncer · Nurse · Babloo · Mentor Priya",
    mappedProblems: ["Kth Largest Element", "Top K Frequent Elements", "Merge K Sorted Lists", "Find Median from Stream"],
    segments: [
      {
        speaker: "narrator",
        label: "Hook · Dynamic Best Item on Every Arrival",
        text: "Episode 19! Suppose live coding scores stream continuously into our Hackathon leaderboard (`100k submissions`). Your dashboard constantly demands: `'Show the TOP 5 Champs right now!'` Sorting all 100k on every upload (`O(N² log N)`) kills your server!",
      },
      {
        speaker: "character",
        label: "Setup · Hospital Triage Pyramid & VIP Rope",
        text: "Compare Campus Clinic Triage! Kid #1 (`Babloo, minor paper-cut, Priority 10`) stands behind Kid #2 (`Skateboard wipeout, Priority 1`). Normal FIFO Chai Queue serves Babloo first while the sprain passes out! A **Min-Heap Priority Queue** maintains a loose partial tournament pyramid inside a flat array: ONLY Chair `#0` guarantees holding the #1 urgent case (`O(1)` peek!). When an ambulance arrives (`log n` bubble up!), or doctor calls next (`log n` bubble down!), zero full sorting happens!",
        sfx: "scratch",
      },
      {
        speaker: "punchline",
        label: "Punchline · Bouncer Kicking Out the Weakest VIP for Top-K",
        text: "Now catch this iconic trick! To keep ONLY the **Top 5 Highest Hackathon Scores** across **10 million** uploads, don't use a Max-Heap—keep a **5-seat MIN-Heap VIP table**! Whenever a 6th newcomer scores higher than the weakest guy guarding Chair `#0`... BOOM, bouncer kicks Chair `#0` out of the club (`pop()`), keeping strictly Top 5 in `O(N log 5)`!",
        pauseBeforeMs: 380,
        sfx: "rimshot",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Full Technical Breakdown",
        text: "Think **Heap (`O(log n)` push/pop, `O(1)` top)** whenever you need: (1) **`Top-K` / `Kth Largest`**: keep size-`K` Min-Heap; (2) **`Merge K Sorted Lists`**: hold `K` list heads in Min-Heap (`O(N log K)`); (3) **Scheduling / Dijkstra**; and (4) **`Median of Data Stream`**: balance TWO heaps kissing in the middle—Left half in a **Max-Heap**, Right half in a **Min-Heap**, balancing sizes within `±1` for `O(1)` instant median!",
        pauseBeforeMs: 300,
        sfx: "ding",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Top urgent patient ALWAYS at Chair `#0`",
        technicalConcept: "Heap `top() / peek()` — `O(1)`",
        whyItMatches: "Root guarantees global extreme priority without sorting everything.",
      },
      {
        storyElement: "Bubbling newcomer up a 1,000-slot pyramid in ~10 swaps",
        technicalConcept: "Heap `push()` / `pop()` — `O(log n)`",
        whyItMatches: "Complete binary tree in a flat array (`i -> (i-1)/2`) gives logarithmic height.",
      },
      {
        storyElement: "5-seat Min-Heap club evicting its weakest VIP (`pop`) on stronger scores",
        technicalConcept: "Top-K Pattern (`O(N log K)` time, `O(K)` RAM)",
        whyItMatches: "Beats `O(N log N)` sorting when `K << N`!",
      },
    ],
    technicalExplanation:
      "A Binary Heap is a complete binary tree packed inside an array (`parent = (i-1)//2`, `left = 2i+1`, `right = 2i+2`), supporting `heapify` build in surprising `O(n)` time and priority updates in `O(log n)`.",
    miniSnippet: {
      language: "python",
      code: `import heapq
top_k = [] # Maintain Top-K largest using size-K MIN-Heap!
for score in stream:
    heapq.heappush(top_k, score)
    if len(top_k) > k: heapq.heappop(top_k) # Evict smallest weakling!`,
      complexity: "O(N log K) time · O(K) RAM",
    },
    quiz: {
      prompt:
        "In **Find Median from Data Stream** using **Two Heaps** (`leftMaxHeap` holding smaller half, `rightMinHeap` holding larger half), how do you read the exact Median in **`O(1)` time** once sizes differ by at most `1`?",
      scenarioHint: "Picture the smaller half facing UP with its max at top, and larger half facing DOWN with its min at top!",
      options: [
        "Pop all elements from both heaps into a sorted list",
        "If counts are equal (`len(left) == len(right)`), average `(leftMaxHeap.top() + rightMinHeap.top()) / 2.0`; otherwise take top of the heap holding 1 extra element!",
        "Check only the bottom leaf of `rightMinHeap`",
        "Re-run Quickselect from scratch",
      ],
      correctIndex: 1,
      correctFeedback:
        "Crystal! Having max-of-left kiss min-of-right right at the seam exposes exact middle 1 or 2 boundary values in `O(1)`!",
      wrongFeedback:
        "Both heaps meet right at the middle of the sorted stream: equal sizes -> average both `.top()` values; odd size -> take `.top()` of the larger-count heap!",
    },
    recallKeywords: ["heap", "priority queue", "min-heap", "top-k", "two heaps", "median"],
    bonusRecallPrompt:
      "Wait—remember Python's `heapq` ONLY builds Min-Heaps! What 1-line trick simulates a Max-Heap in Python cleanly?",
  },
  {
    id: "ep-20-tries-prefix-trees",
    episodeNumber: 20,
    chapterNumber: 5,
    chapterTitle: "Season 5 · Trees, Heaps & Tries",
    title: "WhatsApp Sticker Search & Autocomplete Uncle (`Trie`)",
    conceptTopic: "Tries (Prefix Trees), `startsWith` & Word Search II Pruning",
    durationLabel: "2:00",
    estimatedSeconds: 120,
    teaser:
      "How typing 3 keys into Campus `⌘K` search instantly matches words across 1,000,000 titles without checking the rest of the alphabet.",
    castTag: "Babloo · Portal Search · Aarav · Mentor Priya",
    mappedProblems: ["Implement Trie (Prefix Tree)", "Design Add & Search Words (`c.t` wildcard)", "Word Search II"],
    segments: [
      {
        speaker: "narrator",
        label: "Hook · Why Hash Maps Can't Autocomplete Prefixes",
        text: "Episode 20 wraps Season 5! Type `'galg'` into our `⌘K` search bar and BOOM—`'Galgotias Career'`, `'Galgotias Placement'` appear instantly! Wait: Hash Maps rock at exact whole words—so why don't Hash Maps solve **`startsWith('galg')`** over 1,000,000 dictionary entries?",
      },
      {
        speaker: "character",
        label: "Setup · Shared Character Hallways",
        text: "Because `'galg'` and `'galgotias'` hash to **completely unrelated random locker hooks**! Checking a million keys linearly just to test prefixes kills latency! Enter the **Trie (`Prefix Tree`)**: build letter doors off a Root corridor! Type `'c' -> 'a' -> 'r'` once, then branch `'d'` (`'card'`) and `'p -> e -> t'` (`'carpet'`) off that SAME `'car'` corridor! Drop an **`isEndOfWord = true` sticker** at `'car'` so you know `'car'` is a full word even though `'ca'` is merely an unfinished hallway!",
        sfx: "scratch",
      },
      {
        speaker: "punchline",
        label: "Punchline · Walking 3 Doors Instead of 1 Million Words",
        text: "Even if our college portal adds **50 MILLION glossary words**, searching `'galg*'` walks just **4 letter doors (`O(L)` prefix length)** while ignoring `'apple'` through `'zebra'` completely! Plus on Grid **`Word Search II`**, pruning whenever a letter isn't in `curr.children` aborts dead maze paths before wasting 1 millisecond!",
        pauseBeforeMs: 360,
        sfx: "rimshot",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Full Technical Breakdown",
        text: "A **Trie Node** holds `children[26]` (or `Map<char, Node>`) + `isEnd` flag. Insertion, exact `search()`, and prefix `startsWith()` all execute in pure **`O(L)`** where `L` is word length—independent of total words `N`! Use `DFS backtracking` over children ONLY when encountering `.` wildcards (`Add & Search Words`) or scanning a Boggle/Word Search grid!",
        pauseBeforeMs: 300,
        sfx: "ding",
      },
    ],
    comparisonRows: [
      {
        storyElement: "One shared `'c -> a -> r'` corridor for `car`, `card`, `carpet`",
        technicalConcept: "Prefix-Sharing Tree (`O(alphabet × nodes)`)",
        whyItMatches: "Compresses common prefixes cleanly across huge dictionaries.",
      },
      {
        storyElement: "Green `'COMPLETE WORD'` mat on `car`, none on `ca`",
        technicalConcept: "`node.isEnd` Flag",
        whyItMatches: "Distinguishes whole stored words (`search`) from valid prefixes (`startsWith`).",
      },
      {
        storyElement: "Abandoning a Boggle path the instant `'z'` has no Trie door",
        technicalConcept: "Trie-Guided DFS Pruning (`Word Search II`)",
        whyItMatches: "Avoids launching separate `O(M×N)` grid searches for every single word!",
      },
    ],
    technicalExplanation:
      "Tries optimize prefix queries, wildcard matching, longest common prefix, and XOR maximum pairs (Binary Trie storing 32 bits!). Keep `children` compact and exit immediately on missing edge pointers.",
    miniSnippet: {
      language: "python",
      code: `class TrieNode:
    def __init__(self): self.children = {}; self.is_end = False

def startsWith(root, prefix):
    cur = root
    for ch in prefix:
        if ch not in cur.children: return False
        cur = cur.children[ch]       # Pure O(len(prefix)) walk!
    return True`,
      complexity: "O(L) per operation (L = word length)",
    },
    quiz: {
      prompt:
        "Wait—if `Array` search takes `O(N · L)`, why do engineers build a **Trie** instead of just dumping every possible prefix `'g', 'ga', 'gal', 'galg'...` into a HashSet?",
      scenarioHint: "What happens to RAM if you duplicate every prefix string for 1,000,000 20-character URLs—plus can a HashSet support `'find all words under this prefix'`?",
      options: [
        "HashSets cannot store words longer than 5 chars",
        "Prefix-HashSet explodes `O(L² · N)` memory and still cannot enumerate matching words under a branch (`DFS from prefix node`), whereas a Trie shares nodes & supports alphabetical prefix autocomplete!",
        "Tries magically compress integers into O(1)",
        "Because Tries automatically eliminate all vowels",
      ],
      correctIndex: 1,
      correctFeedback:
        "Boom! Sharing prefix corridors saves enormous string duplication AND landing on `prefixNode` lets you walk/suggest all completions cleanly!",
      wrongFeedback:
        "Storing all `L` substrings per word multiplies memory by `L` AND loses the ability to traverse alphabetically down from a prefix node!",
    },
    recallKeywords: ["prefix", "isend", "trie", "autocomplete", "prune", "o(l)"],
    bonusRecallPrompt:
      "Surprise crossover: how does storing integers bit-by-bit inside a **2-branch Binary Trie (`0` / `1`)** solve `Maximum XOR of Two Numbers` in `O(32 · N)`?",
  },
  {
    id: "ep-21-graphs-representation",
    episodeNumber: 21,
    chapterNumber: 6,
    chapterTitle: "Season 6 · Graphs, Shortest Paths & DSU",
    title: "Tracing the Leaked Mid-Sem Paper Network (`Graphs`)",
    conceptTopic: "Graphs (`Vertices`, `Edges`, `Adjacency List` vs `Matrix`, Connected Components)",
    durationLabel: "2:00",
    estimatedSeconds: 120,
    teaser:
      "Tracing who forwarded exam screenshots across 5,000 campus accounts without crashing RAM on a giant 25-million-cell spreadsheet.",
    castTag: "Exam Squad · Aarav · Babloo · Mentor Priya",
    mappedProblems: ["Number of Islands (Grid Graph)", "Clone Graph", "Number of Connected Components"],
    segments: [
      {
        speaker: "narrator",
        label: "Hook · When Relationships Loop Back",
        text: "Welcome to Season 6—**Graphs**! Not everything flows politely top-down like a Family Tree. Who forwarded the leaked OS quiz screenshot? Aarav might text Babloo, Babloo posts in Hostel-3 group, someone forwards it RIGHT BACK to Aarav creating a **Cycle**!",
      },
      {
        speaker: "character",
        label: "Setup · Undirected Friendship vs. Directed Forward + Matrix Trap",
        text: "Every account is a **Vertex `V`**, every message a **Directed Edge (`u -> v`)** (unlike **Undirected** `'hostel roommates'` going both ways). Now store links across `20,000` college students! Make an **Adjacency Matrix** (`20,000 × 20,000` Excel sheet)? That's **400 MILLION boxes mostly empty zeros** (`MLE` crash!) since each person averages ~20 chats! Instead, hand each node a slim **Adjacency List** notebook listing ONLY true neighbors (`O(V + E)` RAM)!",
        sfx: "scratch",
      },
      {
        speaker: "punchline",
        label: "Punchline · Never Forget Your `visited` Chalk Mark!",
        text: "Now trace the leak! Babloo launches graph search WITHOUT a **`visited` set** on cyclic `'Aarav <-> Babloo <-> Vikram <-> Aarav'`—poor dude runs in infinite gossip circles chanting `'CHECK AARAV CHECK BABLOO CHECK AARAV'` until the exam ends (`Infinite Loop TLE`)!",
        pauseBeforeMs: 360,
        sfx: "rimshot",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Full Technical Breakdown",
        text: "Three Graph habits separate pros from panicking candidates: (1) Always check **Sparse -> Adjacency List (`O(V + E)`)**, or **2D Grids (`Number of Islands`)** using `dirs = [(1,0),(-1,0),(0,1),(0,-1)]` implicitly without allocating an Adjacency List at all! (2) Guard EVERY walk with a **`visited`** array/set to handle cycles cleanly; (3) To count **Connected Components (`Friend Groups` / `Islands`)**, loop `0..V-1`: whenever `node` isn't `visited`, increment `components++` and flood-fill its entire neighborhood cleanly!",
        pauseBeforeMs: 300,
        sfx: "ding",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Message forward `u -> v` vs mutual roommate `u <-> v`",
        technicalConcept: "Directed vs. Undirected Graph Edges",
        whyItMatches: "Directed adds `adj[u].push(v)`; undirected pushes both ways.",
      },
      {
        storyElement: "400M empty spreadsheet boxes vs slim per-user contact lists",
        technicalConcept: "Adjacency Matrix (`O(V²)`) vs Adjacency List (`O(V + E)`)",
        whyItMatches: "Adjacency Lists crush sparse real-world graphs cleanly in RAM.",
      },
      {
        storyElement: "Flood-filling unvisited chat cliques one by one",
        technicalConcept: "Connected Components Count via `visited[]` (`O(V + E)`)",
        whyItMatches: "Each unvisited vertex discovered launches 1 new component flood.",
      },
    ],
    technicalExplanation:
      "Represent sparse graphs with Adjacency Lists (`vector<vector<int>>` / `defaultdict(list)`). For `R × C` grid problems (`Islands`, `Max Area`, `Pacific Atlantic`), neighbors are implicit 4-directional offsets (`O(R × C)` time) saving adjacency overhead.",
    miniSnippet: {
      language: "python",
      code: `# Count Islands / Connected Clusters cleanly on a 2D Grid Graph:
def sink(r, c):
    if not (0 <= r < R and 0 <= c < C) or grid[r][c] != '1': return
    grid[r][c] = '0' # Mark visited IN-PLACE!
    for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)): sink(r + dr, c + dc)`,
      complexity: "O(V + E) graph traversal · Grid: O(R × C)",
    },
    quiz: {
      prompt:
        "In **Number of Islands** on an `M × N` grid (`1 = land, 0 = water`), why is changing `grid[r][c] = '0'` (or marking `visited[r][c] = true`) **BEFORE** launching the 4 recursive neighbor calls mandatory?",
      scenarioHint: "Right goes `[r, c+1]`, which immediately looks LEFT at `[r, c]`!",
      options: [
        "Because `'0'` converts characters to integers",
        "Without marking visited immediately on entry, `[r, c]` calls `[r, c+1]` which immediately bounces back left into `[r, c]`, causing an infinite cycle (`StackOverflow`!)",
        "To sort all islands by area ascending",
        "It reduces time from O(M·N) to O(1)",
      ],
      correctIndex: 1,
      correctFeedback:
        "Boom! Bidirectional adjacency means neighbors immediately point back at you—marking `visited` immediately upon arrival snaps the infinite bounce!",
      wrongFeedback:
        "Look at `(0,0) -> right (0,1) -> left (0,0)`: if `(0,0)` isn't already sunk/marked visited on arrival, neighbor `(0,1)` calls right back onto `(0,0)` forever!",
    },
    recallKeywords: ["adjacency list", "visited", "cycle", "component", "islands", "o(v + e)"],
    bonusRecallPrompt:
      "How do you detect a Cycle in a **Directed** Graph vs an **Undirected** Graph using DFS (`visiting` in-path vs `visited`)?",
  },
  {
    id: "ep-22-bfs-vs-dfs",
    episodeNumber: 22,
    chapterNumber: 6,
    chapterTitle: "Season 6 · Graphs, Shortest Paths & DSU",
    title: "Sneaking Across Campus Shortcuts (`BFS` Ripples vs. `DFS` Tunnel)",
    conceptTopic: "BFS (Shortest Unweighted Path & Multi-Source BFS) vs. DFS",
    durationLabel: "2:05",
    estimatedSeconds: 125,
    teaser:
      "Babloo sprints blindly down 1 hostel corridor straight into the Warden's dog—while Aarav triggers simultaneous Multi-Source BFS from every gate!",
    castTag: "Aarav · Babloo · Warden's Beagle · Mentor Priya",
    mappedProblems: ["Shortest Path in Binary Matrix", "Rotting Oranges (Multi-Source BFS)", "Word Ladder", "Clone Graph"],
    segments: [
      {
        speaker: "narrator",
        label: "Hook · Fewest Door Hops Before Gate Curfew",
        text: "Episode 22 answers the #1 student dilemma: `'Bro should I write BFS or DFS here?!'` Midnight curfew rings in 90 seconds, and Aarav + Babloo sit trapped across locked campus wing corridors trying to reach Main Gate (`1 hop = 1 corridor`).",
      },
      {
        speaker: "character",
        label: "Setup · Headlong Sprinting vs. Pond Ripples",
        text: "Babloo uses **Depth-First Search (DFS)**: pick ONE hallway and sprint dead-ahead till hitting a locked broom closet—backtrack, charge another tunnel... straight into the Warden's barking beagle! Even if he survives, reaching Gate via DFS might wander 19 hallways when a 2-door shortcut existed right next door! Meanwhile Aarav launches **Breadth-First Search (`BFS Queue`)**: check EVERY door **1 hop** away first, then ALL doors **2 hops** away—just like circular pond ripples! Boom: the VERY FIRST ripple kissing Main Gate **guarantees Minimum Possible Hops (`O(V + E)`)**!",
        sfx: "scratch",
      },
      {
        speaker: "punchline",
        label: "Punchline · Multi-Source BFS (`Rotting Oranges` Infection!)",
        text: "WAIT—upgrade! Imagine FOUR leaky mess fridges simultaneously turning bananas brown across the hostel (**`Rotting Oranges` / `01 Matrix` / `Walls & Gates`**)! Push ALL FOUR starting sources onto ONE shared BFS Queue at `minute = 0` (`Multi-Source BFS`!)—watching all ripples expand cleanly together in **ONE pass**, instead of restarting slow BFS from every fresh orange separately!",
        pauseBeforeMs: 380,
        sfx: "rimshot",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Full Technical Breakdown",
        text: "Never hesitate between BFS and DFS again: (1) **Minimum hops / unweighted shortest distance / 'how many minutes to spread'** -> **BFS (`Queue`)**, and ALWAYS mark `visited` **at push time** (`q.append`) before popping or duplicates swamp memory! (2) **All paths, topological cycles, Sudoku/Backtracking, connected island shape** -> **DFS (`Recursion / Stack`)**! When multiple fires spread in parallel, dump ALL fires into the Queue upfront for **Multi-Source BFS (`O(R × C)`)**!",
        pauseBeforeMs: 300,
        sfx: "ding",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Concentric water ripples checking Distance 1 -> 2 -> 3 doors",
        technicalConcept: "Standard BFS (`Queue`, Minimum Unweighted Path)",
        whyItMatches: "First arrival strictly guarantees fewest hops.",
      },
      {
        storyElement: "Dropping ALL rotten oranges into Queue together at `t = 0`",
        technicalConcept: "Multi-Source BFS (`Rotting Oranges`, `01 Matrix`, `O(V + E)`)",
        whyItMatches: "Simulates parallel wave fronts cleanly in 1 simultaneous sweep!",
      },
      {
        storyElement: "Plunging all the way down 1 wing till dead-end then unwinding",
        technicalConcept: "DFS (`Stack / Recursion`)",
        whyItMatches: "Lower memory on narrow paths, great for exhaustive reachability/cycles.",
      },
    ],
    technicalExplanation:
      "BFS explores nodes in strict non-decreasing distance order (`dist 0, 1, 2...`). Mark cells `visited` immediately upon enqueueing (`q.push`) rather than upon dequeueing to guarantee every cell enters the Queue at most once.",
    miniSnippet: {
      language: "python",
      code: `# Multi-Source BFS (e.g., Rotting Oranges): enqueue ALL starting sources at once!
q = deque((r, c) for r in range(R) for c in range(C) if grid[r][c] == 2)
minutes = 0
while q and fresh > 0:
    for _ in range(len(q)): # Process 1 simultaneous minute wave!
        r, c = q.popleft()  # Spread to fresh neighbors -> fresh -= 1`,
      complexity: "O(R × C) time · O(R × C) Queue space",
    },
    quiz: {
      prompt:
        "In **Word Ladder** (`'hit' -> 'hot' -> 'dot' -> 'dog' -> 'cog'`, changing 1 letter at a time), why do we use **BFS** instead of **DFS** to find the **shortest transformation length**?",
      scenarioHint: "Each 1-letter word hop has equal step weight `1`!",
      options: [
        "DFS cannot process 3-letter English strings",
        "Because every valid 1-letter edit costs 1 unweighted hop, **BFS** expands distance `1, 2, 3...` and guarantees the VERY FIRST path hitting `'cog'` is minimum length!",
        "BFS automatically sorts words alphabetically inside the Queue",
        "DFS crashes whenever dictionaries exceed 100 words",
      ],
      correctIndex: 1,
      correctFeedback:
        "Crisp clarity! Shortest unweighted steps across implicit state graphs = classic BFS ripple territory!",
      wrongFeedback:
        "DFS might wander down a 50-word detour (`hit -> hat -> cat -> ... -> cog`) before noticing the 4-step bridge. BFS level ripples always find shortest hop distance first!",
    },
    recallKeywords: ["bfs", "multi-source", "unweighted", "shortest", "enqueue", "dfs"],
    bonusRecallPrompt:
      "Look closely at BFS memory usage: why must `visited` be marked BEFORE pushing onto the Queue rather than AFTER popping from the Queue?",
  },
  {
    id: "ep-23-dijkstra-weighted",
    episodeNumber: 23,
    chapterNumber: 6,
    chapterTitle: "Season 6 · Graphs, Shortest Paths & DSU",
    title: "Placement-Morning Uber Cab Surge (`Dijkstra` vs. Negative Tolls)",
    conceptTopic: "Dijkstra's Shortest Weighted Path (`Min-Heap`) vs. Bellman-Ford",
    durationLabel: "2:00",
    estimatedSeconds: 120,
    teaser:
      "A 1-turn shortcut road past a 45-minute jam loses to a 4-flyover expressway—until negative cashback coupons break Dijkstra completely.",
    castTag: "Cab Driver · Aarav · Babloo · Mentor Priya",
    mappedProblems: ["Network Delay Time", "Cheapest Flights Within K Stops", "Path With Minimum Effort"],
    segments: [
      {
        speaker: "narrator",
        label: "Hook · When Road Times Aren't Equal (`Weights`!)",
        text: "Episode 23! Placement Day 8:30 AM—Aarav jumps into an Uber. Why can't Google Maps just use Episode 22's BFS ('fewest turns')? Look at the map: Straight Road A is only **1 hop**... trapped inside a **45-minute** water-logged railway gate! Route B hops **4 sleek toll flyovers** totaling just **9 minutes**!",
      },
      {
        speaker: "character",
        label: "Setup · Greedy Min-Heap Settling Non-Negative Roads",
        text: "Now every edge carries a positive cost **Weight `w >= 0`**. Swap BFS's plain FIFO Queue for **Dijkstra's Min-Heap Priority Queue `(minutesSoFar, node)`**! At every step, pop whichever unfinished intersection currently holds the **LOWEST total travel minutes**! Because EVERY future road adds **`>= 0` positive minutes**, NO longer path sitting behind an expensive node can EVER magically backtrack cheaper later!",
        sfx: "scratch",
      },
      {
        speaker: "punchline",
        label: "Punchline · Babloo's '-₹50 Cashback' Trap Breaks Dijkstra!",
        text: "WAIT—plot twist! Babloo discovers an underground **Negative Weight Shortcut**: toll booth #3 pays YOU **`-25 minutes`** time-travel! Now Junction B settles cleanly at `10 mins` while Junction A stalls behind at `12 mins`... then A sneaks through the `-25` portal straight into B for **`-13 mins` AFTER B was already locked done!** Dijkstra gets completely bamboozled!",
        pauseBeforeMs: 380,
        sfx: "rimshot",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Full Technical Breakdown",
        text: "Master Weighted Shortest Paths in 3 picks: (1) **All edge weights `>= 0`** -> **Dijkstra (`O((V + E) log V)`)**, adding the lazy-skip guard `if (d > dist[u]) continue;` so duplicate stale heap tuples don't slow you down! (2) **Edge weights ONLY `0` or `1`** -> **0-1 BFS** with a `Deque` (`push_front` on 0, `push_back` on 1) drops `log V` to pure **`O(V + E)`**! (3) **Negative edges OR max-K-stops constraints (`Cheapest Flights Within K Stops`)** -> **Bellman-Ford (`V - 1` or `K + 1` edge relaxations using a copy array)**!",
        pauseBeforeMs: 300,
        sfx: "ding",
      },
    ],
    comparisonRows: [
      {
        storyElement: "1 slow 45-min jam edge losing to 4 quick 2-min flyovers",
        technicalConcept: "Weighted Graph (`BFS fails, use Dijkstra / Bellman`)",
        whyItMatches: "Total weight != number of edges.",
      },
      {
        storyElement: "Popping lowest total minutes from Priority Queue (`>= 0` weights)",
        technicalConcept: "Dijkstra + Min-Heap (`O((V + E) log V)`)",
        whyItMatches: "Non-negative weights keep path sums strictly non-decreasing.",
      },
      {
        storyElement: "Negative `-25` edge sneaky detour beating already-locked node",
        technicalConcept: "Bellman-Ford (`O(V · E)`, Handles Negatives & K Stops)",
        whyItMatches: "Relaxes edges iteratively without premature greedy locking.",
      },
    ],
    technicalExplanation:
      "Dijkstra replaces BFS's Queue with a Min-Heap prioritizing minimum cumulative path weight (`dist[u]`). With lazy deletion (`if d > dist[u]: continue`), it achieves `O((V + E) log V)`. Use Bellman-Ford (or modified BFS with stop counts) when negative weights or edge-count limits `<= K` apply.",
    miniSnippet: {
      language: "cpp",
      code: `// Dijkstra core loop with lazy stale-entry skip:
while (!pq.empty()) {
  auto [d, u] = pq.top(); pq.pop();
  if (d > dist[u]) continue;              // Drop outdated worse path!
  for (auto [v, w] : adj[u])
    if (d + w < dist[v]) pq.push({dist[v] = d + w, v});
}`,
      complexity: "Dijkstra: O((V + E) log V) · 0-1 BFS: O(V + E)",
    },
    quiz: {
      prompt:
        "You solve **Network Delay Time** (sending signal across weighted network edges `w >= 0`). Why do we place `if (d > dist[u]) continue;` right after popping `(d, u)` from our Priority Queue?",
      scenarioHint: "C++ `priority_queue` / Python `heapq` doesn't support updating an existing entry in-place (`decrease-key`), so better paths push NEW tuples alongside old ones...",
      options: [
        "It fixes negative edge weights cleanly",
        "Because improving `dist[u]` earlier pushed a newer smaller `(newD, u)` tuple; skipping old larger copies `(oldD, u)` avoids redundant neighbor relaxation (`TLE` prevention)!",
        "It reverses edge direction cleanly",
        "Without it, Dijkstra turns into DFS",
      ],
      correctIndex: 1,
      correctFeedback:
        "Crisp systems detail! Skipping stale heap entries protects `O(E log V)` efficiency on dense updates!",
      wrongFeedback:
        "When you push a tighter distance without deleting old heap copies, popping an outdated larger tuple (`d > dist[u]`) can immediately be discarded via `continue`!",
    },
    recallKeywords: ["dijkstra", "min-heap", "negative", "bellman", "stale", "0-1 bfs"],
    bonusRecallPrompt:
      "Why does **`Cheapest Flights Within K Stops`** use Bellman-Ford's `tempDist = dist.clone()` copy inside each stop iteration instead of mutating `dist` directly?",
  },
  {
    id: "ep-24-toposort-union-find",
    episodeNumber: 24,
    chapterNumber: 6,
    chapterTitle: "Season 6 · Graphs, Shortest Paths & DSU",
    title: "Wear Socks Before Shoes (`DAG` Topo Sort) & Rival Squads (`DSU`)",
    conceptTopic: "Topological Sort (`Kahn's Indegree`) & Union-Find (`Disjoint Set`)",
    durationLabel: "2:05",
    estimatedSeconds: 125,
    teaser:
      "Waking up late for a 9 AM viva, Babloo ties sneakers over bare feet—plus merging hackathon friend groups dynamically in ~O(1)!",
    castTag: "Babloo · Aarav · Dean · Mentor Priya",
    mappedProblems: ["Course Schedule I & II", "Alien Dictionary", "Number of Provinces / Redundant Connection (`DSU`)"],
    segments: [
      {
        speaker: "narrator",
        label: "Hook · Season 6 Graph Finale (`DAGs & DSU`)",
        text: "Episode 24 wraps Graphs with TWO crazy high-leverage weapons: ordering strict **Dependency Chains** AND merging **Dynamic Friend Groups**!",
      },
      {
        speaker: "character",
        label: "Setup · Prerequisite Deadlocks + Team Captain Badges",
        text: "Weapon 1 — **Topological Sort (`Kahn's Algorithm`)**: Waking at 8:53 AM for his viva, Babloo puts sneakers on BEFORE socks! Invalid ordering! Every real workflow (`Socks -> Shoes`, `Intro Python -> Systems Lab`, `Compiler Build Dependencies`) forms a **Directed Acyclic Graph (`DAG`)**. Count each task's remaining prerequisite arrows (**`indegree`**): push ALL ready `indegree == 0` items (`Socks`!) onto a Queue -> finish `Socks` -> decrement `Shoes` indegree (`1 -> 0`) -> queue `Shoes`! If items STILL stay stuck after Queue empties (`Must take DSA to unlock Math AND Math to unlock DSA`) -> **CYCLE PROVED**!",
        sfx: "scratch",
      },
      {
        speaker: "punchline",
        label: "Punchline · Instant 'Same Team?' Check via Boss Badges",
        text: "Weapon 2 — **Disjoint Set (`Union-Find`)**: During Hackathon team mergers, 5,000 students ask every second `'Wait—is Priya in my squad?!'` Everyone stamps their Boss Captain (`parent[x]`) on their forehead. When squads merge (`Union by Size/Rank`), smaller boss points under bigger boss—and during `find(x)` **Path Compression** lets everyone remember Ultimate Boss DIRECTLY (`p[x] = find(p[x])`), answering connectivity in practical **`O(1)` (`α(n) <= 4`)**!",
        pauseBeforeMs: 380,
        sfx: "rimshot",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Full Technical Breakdown",
        text: "Know when to pull each trigger: (1) **Directed task ordering / 'can finish all courses with prerequisites?' / build dependency order** -> **Kahn's BFS Topo Sort (`O(V + E)`)** (`if processedCount < V -> Cycle exists!`); (2) **Undirected dynamic connections / cycle check on streaming edges (`Redundant Connection`) / Minimum Spanning Tree (`Kruskal`)** -> **Union-Find DSU** with BOTH **Path Compression + Union by Size/Rank** (`if find(u) == find(v) -> adding edge (u, v) creates a Cycle!`)!",
        pauseBeforeMs: 300,
        sfx: "ding",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Zero-blocker items (`indegree == 0`) entering Queue cleanly",
        technicalConcept: "Kahn's Topological Sort (`O(V + E)`)",
        whyItMatches: "Guarantees every prerequisite executes before dependent tasks.",
      },
      {
        storyElement: "Circular `'DSA waits on Math waits on DSA'` leaving stuck nodes",
        technicalConcept: "Directed Cycle Detection (`output.size() < V`)",
        whyItMatches: "Cyclic nodes never drop to `indegree == 0`.",
      },
      {
        storyElement: "Pointing directly to Ultimate Squad Captain + checking `find(u) == find(v)`",
        technicalConcept: "Disjoint Set Union (`Path Compression + Size` -> `O(α(n))`)",
        whyItMatches: "Merges clusters and spots undirected cycles in nearly constant time!",
      },
    ],
    technicalExplanation:
      "Kahn's BFS processes `indegree == 0` nodes linearly, solving scheduling (`Course Schedule`, `Alien Dictionary`). Union-Find (`DSU`) tracks disjoint components dynamically, rejecting any undirected edge `(u, v)` where `find(u) == find(v)` (`Redundant Connection` / `Kruskal MST`).",
    miniSnippet: {
      language: "cpp",
      code: `// Disjoint Set Union (Path Compression):
int find(int x, vector<int>& p) { return p[x] == x ? x : p[x] = find(p[x], p); }
bool unite(int u, int v, vector<int>& p) {
  int ru = find(u, p), rv = find(v, p);
  if (ru == rv) return false; // Already connected -> Cycle detected!
  p[ru] = rv; return true;
}`,
      complexity: "Kahn Topo Sort: O(V + E) · DSU Find/Union: O(α(n)) ≈ O(1)",
    },
    quiz: {
      prompt:
        "During **`Redundant Connection`**, edges arrive one-by-one forming a single cycle (`[1,2], [1,3], [2,3]`) in an undirected graph. When `[2, 3]` arrives, why does **Union-Find** catch the cycle instantaneously?",
      scenarioHint: "Check what `find(2)` and `find(3)` return AFTER `[1,2]` and `[1,3]` already merged cleanly!",
      options: [
        "Because `2 + 3 = 5` is odd",
        "`find(2)` and `find(3)` ALREADY return the exact same root captain (`1`), proving `2` and `3` were already connected—so connecting `(2, 3)` closes a cycle!",
        "Union-Find sorts edges descending first",
        "It re-runs Dijkstra across the whole graph",
      ],
      correctIndex: 1,
      correctFeedback:
        "Pure clarity! If `u` and `v` ALREADY share the same root before linking `(u, v)`, an alternate bridge already existed -> instant cycle!",
      wrongFeedback:
        "`[1,2]` merged `2` with `1`; `[1,3]` merged `3` with `1`. So when `[2,3]` enters, both `find(2)` and `find(3)` point to Captain `1`—cycle closed!",
    },
    recallKeywords: ["topological", "indegree", "dag", "cycle", "union-find", "path compression"],
    bonusRecallPrompt:
      "Wait—remember how our LMS locks `DSA Mastery` behind `Problem Solving Lab` prerequisites? Which algorithm verifies zero impossible circular course-unlock rules?",
  },
  {
    id: "ep-25-backtracking",
    episodeNumber: 25,
    chapterNumber: 7,
    chapterTitle: "Season 7 · Backtracking, DP & Bitwise Finale",
    title: "Farewell Party Exes Seating Chart (`Backtracking`)",
    conceptTopic: "Backtracking Decision Trees (`Choose -> Explore -> Undo`) & Pruning",
    durationLabel: "2:00",
    estimatedSeconds: 120,
    teaser:
      "Seat 8 clashing college exes around one banquet room with zero awkward diagonal eye-contact—the Choose-Explore-Undo waltz!",
    castTag: "Club President · Aarav · Babloo · Mentor Priya",
    mappedProblems: ["Subsets / Combinations", "Permutations", "Combination Sum", "N-Queens / Word Search"],
    segments: [
      {
        speaker: "narrator",
        label: "Hook · Solving Pure Constraint Puzzles Without Formulas",
        text: "Welcome to our Championship Season 7! Aarav gets promoted to Farewell Organiser and faces an existential crisis: seat **N Clashing Campus Exes (`N-Queens` / `Sudoku`)** across an `N × N` party hall so NO rival pair shares a row, column, or diagonal glare!",
      },
      {
        speaker: "character",
        label: "Setup · The 3-Step Waltz + Early Conflict Pruning",
        text: "No Greedy rule works cleanly here—you systematically test legal combinations using **Backtracking (`Choose -> Explore -> Undo`)**! Step 1 (**Choose**): Put Rohan in Column `C`, flip `busyCol[C] = true`. Step 2 (**Explore**): Recurse downward to Row 2! Wait—smart **Pruning**: the instant Row 2 detects Rival #1 sitting on Row 1's diagonal, **ABORT IMMEDIATELY (`continue`)**—skipping 10,000 doomed arrangements below that broken branch!",
        sfx: "scratch",
      },
      {
        speaker: "punchline",
        label: "Punchline · Forgetting to Wipe the 'Seat Taken' Sticker!",
        text: "Step 3 (**Undo**): After returning from exploring Column `C`, you MUST **stand Rohan back up (`path.pop()`) AND erase `busyCol[C] = false`**! Babloo once skipped the `Undo` cleanup line in a coding contest—and every subsequent seat thought Column `C` was haunted by Rohan's ghost for the rest of time (`Missing 80% of valid answers!`)!",
        pauseBeforeMs: 360,
        sfx: "rimshot",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Full Technical Breakdown",
        text: "Use this exact template for ALL combinatorial enumeration (`Subsets`, `Permutations`, `Palindrome Partitioning`, `Combination Sum`, `N-Queens`): **(1) Base hit -> push deep copy `[...path]`** (NEVER push bare mutable reference `ans.push(path)`, or Episode 2's Google Doc curse overwrites every entry to empty `[]` at the end!); **(2) Prune invalid/duplicate moves cleanly (`if i > start && nums[i] == nums[i-1]: continue`)**; **(3) `Choose -> Recurse -> Undo`!** Check constraints too: Backtracking shines when **`N <= 18`**!",
        pauseBeforeMs: 300,
        sfx: "ding",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Seating person at Chair `C` & sticking 'Busy' tape",
        technicalConcept: "Choose (`path.push(x); used[x] = true`)",
        whyItMatches: "Temporarily commits decision to explore its subtree.",
      },
      {
        storyElement: "Stopping immediately when Diagonal clash occurs at Row 2",
        technicalConcept: "Pruning Invalid Branches Early",
        whyItMatches: "Shrinks real search tree enormously vs brute force at leaves.",
      },
      {
        storyElement: "Peeling 'Busy' tape off Chair `C` (`used[x] = false` + `pop`)",
        technicalConcept: "Undo State + Push Snapshot Copy (`list(path)`)",
        whyItMatches: "Restores clean board for sibling branches cleanly.",
      },
    ],
    technicalExplanation:
      "Backtracking walks an implicit tree via DFS while mutating one shared `path` buffer (`O(N)` memory) and restoring state on unwind. Snapshot `[...path]` / `list(path)` upon recording valid leaves, and sort + skip adjacent duplicates when deduplicating combinations.",
    miniSnippet: {
      language: "python",
      code: `# Subsets II (Handles duplicates safely via sort + skip-same-level check!):
nums.sort()
def bt(start, path):
    ans.append(list(path))             # CRITICAL: Save COPY, not live reference!
    for i in range(start, len(nums)):
        if i > start and nums[i] == nums[i - 1]: continue # Prune duplicate branch!
        path.append(nums[i]); bt(i + 1, path); path.pop() # Choose -> Explore -> Undo!`,
      complexity: "O(N · 2^N) Subsets · O(N · N!) Permutations",
    },
    quiz: {
      prompt:
        "In Python/JS Backtracking, a student writes `ans.append(path)` (or `ans.push(path)`) inside the base case instead of copying `list(path)` / `[...path]`, and returns `ans`. Every entry inside `ans` comes out as empty **`[[], [], [], []]`**! Why?",
      scenarioHint: "Remember Episode 2 (Google Doc Link vs PDF Copy)!! What does `path.pop()` erase at the end of recursion?",
      options: [
        "Python arrays forbid nested empty lists",
        "`ans` stored references to the SAME single mutable `path` list—so later `path.pop()` Undo calls wiped every saved entry down to `[]`!",
        "The base case never actually fired",
        "Sorting cleared out `path` automatically",
      ],
      correctIndex: 1,
      correctFeedback:
        "Callback to Episode 2 mastered!! Passing `path` directly stores aliases to ONE single mutating Google Doc; always clone `list(path)` / `[...path]` at base cases!",
      wrongFeedback:
        "Because `path` is reused across all branches, every slot inside `ans` pointed to that ONE list—which ends completely popped back to `[]` at the finish!",
    },
    recallKeywords: ["choose", "explore", "undo", "prune", "copy", "backtrack"],
    bonusRecallPrompt:
      "Why does **`if (i > start && nums[i] == nums[i - 1]) continue;`** remove duplicate subsets while STILL allowing `[2, 2]` along vertical depth?",
  },
  {
    id: "ep-26-dp-1d",
    episodeNumber: 26,
    chapterNumber: 7,
    chapterTitle: "Season 7 · Backtracking, DP & Bitwise Finale",
    title: "Babloo's Fridge Sticky Notes & Hostel Sweet Loot (`1D DP`)",
    conceptTopic: "Dynamic Programming (`Memoization`, `Tabulation`, `Kadane` & `House Robber`)",
    durationLabel: "2:05",
    estimatedSeconds: 125,
    teaser:
      "Stop re-solving identical recursion branches billions of times—stick solved answers on the fridge once and drop O(2^N) to O(N)!",
    castTag: "Babloo · Aarav · Hostel Fridge · Mentor Priya",
    mappedProblems: ["Climbing Stairs / Coin Change", "House Robber (`pick` vs `skip`)", "Maximum Subarray (`Kadane`)"],
    segments: [
      {
        speaker: "narrator",
        label: "Hook · Turning Terrifying 'DP' Into Common Sense",
        text: "Episode 26 cracks the #1 placement boss topic wide open: **Dynamic Programming (`DP`)**! Why does naive recursive `fib(50)` or `CoinChange` freeze computers for centuries? Because `fib(50)` splits into `49 + 48`, recomputing `fib(45)` over **100 times** and `fib(10)` **millions of times** (`O(2^n)`)!",
      },
      {
        speaker: "character",
        label: "Setup · The Yellow Fridge Sticky Notes + Mess Ladoo Raid",
        text: "Now hand Babloo yellow **Fridge Sticky Notes (`memo[]`)**! Rule 1 (**Top-Down Memoization**): Compute `solve(i)`? Write it onto Sticky Note `#i` ONCE! Next time ANY branch screams `'Hey solve(10)!'`, don't compute—yank Note `#10` off the fridge in **`O(1)`**! Watch it crush **House Robber (`Hostel Mess Sweet Loot`)**: dorm lockers hold cash/sweets `[2, 7, 9, 3, 1]`, and adjacent alarm wires forbid picking two neighboring lockers! At locker `i`, ONLY TWO choices exist: **STEAL** (`nums[i] + best(i-2)`) OR **SKIP** (`best(i-1)`), pick the `max()`—and cache ONLY the last 2 sticky notes (`prev2, prev1`) for **`O(n)` time, `O(1)` space**!",
        sfx: "scratch",
      },
      {
        speaker: "punchline",
        label: "Punchline · Kadane's Zero-Drama Ex Rule (`Max Subarray`)",
        text: "Same rule powers **Kadane's Maximum Subarray**: walking a streak of profits/losses, if your running backpack balance drops **negative (`< 0`)**, DUMP the dead-weight past bag to zero and restart fresh right here (`cur = max(x, cur + x)`)! Never drag toxic negative baggage from previous mistakes forward!",
        pauseBeforeMs: 360,
        sfx: "rimshot",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Full Technical Breakdown",
        text: "Remember: **DP = Smart Brute Force Recursion + Sticky-Note Caching** whenever you spot **Overlapping Subproblems** + **Optimal Substructure**! Always follow 4 crisp steps: (1) Define State cleanly (`dp[i]` = max loot considering `0..i`); (2) Write Recurrence (`max(dp[i-1], nums[i] + dp[i-2])`); (3) Set Base Cases (`dp[0], dp[1]`); (4) Optimize Space (`only look back 1 or 2 sticky notes? Drop array to O(1) vars!`). That turns `16-ms` TLE bombs into `1-ms` `ACCEPTED`!",
        pauseBeforeMs: 300,
        sfx: "ding",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Solving `solve(10)` 10,000 times from zero",
        technicalConcept: "Naive Overlapping Recursion (`O(2^N)` TLE)",
        whyItMatches: "Blindly repeats solved states exponentially.",
      },
      {
        storyElement: "Checking Fridge Sticky Note `#i` before computing",
        technicalConcept: "Top-Down Memoization (`O(states)`)",
        whyItMatches: "Every unique parameter state evaluates strictly ONCE.",
      },
      {
        storyElement: "`max(skip: dp[i-1], pick: nums[i] + dp[i-2])` with 2 variables",
        technicalConcept: "Bottom-Up Tabulation (`O(n)` time, `O(1)` space)",
        whyItMatches: "Eliminates recursion overhead and compresses RAM cleanly.",
      },
    ],
    technicalExplanation:
      "1D DP solves sequential decision problems (`Climbing Stairs`, `House Robber`, `Coin Change`, `Word Break`, `Longest Increasing Subsequence`) cleanly in polynomial time by caching intermediate optimal sub-results.",
    miniSnippet: {
      language: "cpp",
      code: `// House Robber / Max Non-Adjacent Sum (O(n) time, O(1) space!):
int prev2 = 0, prev1 = 0; // Only last 2 fridge notes needed!
for (int loot : houses) {
  int pickOrSkip = max(prev1, loot + prev2);
  prev2 = prev1; prev1 = pickOrSkip;
}`,
      complexity: "O(n) time · O(1) extra space",
    },
    quiz: {
      prompt:
        "In **Longest Increasing Subsequence (`LIS`)** on `[10, 9, 2, 5, 3, 7, 101, 18]`, why can `O(n²)` DP (`dp[i] = max(dp[j] + 1)` over earlier `j < i`) handle `n <= 2,500`, while huge `n = 100,000` upgrades to Patience Sorting (`DP + Binary Search`)?",
      scenarioHint: "Check Episode 5's `10^8 ops/sec` math (`2500²` vs `100,000²`)!",
      options: [
        "Because `dp[i]` only works on even-length arrays",
        "`2,500² ≈ 6.25M` ops fits easily inside `1s`, whereas `100,000² = 10¹⁰` TLEs—needing `tails[] + Binary Search` for **`O(n log n)`**!",
        "Binary Search solves LIS without comparing numbers",
        "DP cannot process numbers > 100",
      ],
      correctIndex: 1,
      correctFeedback:
        "Master-level thinking! Checking `n <= 2,500` lets simple `O(n²)` DP pass effortlessly, while `n <= 10^5` prompts Binary-Search `O(n log n)` Patience `tails[]`!",
      wrongFeedback:
        "`2,500²` (~6M) stays way below `10⁸` ops/sec; `100,000²` (`10¹⁰`) exceeds it by 100x, demanding `tails` array + `lower_bound` Binary Search (`O(n log n)`).",
    },
    recallKeywords: ["memoization", "tabulation", "sticky note", "overlapping", "house robber", "kadane"],
    bonusRecallPrompt:
      "In `Coin Change`, what is the difference between looping `for coin: for amt` (Combinations count) vs `for amt: for coin` (Permutations / Min Coins)?",
  },
  {
    id: "ep-27-dp-2d-knapsack-lcs",
    episodeNumber: 27,
    chapterNumber: 7,
    chapterTitle: "Season 7 · Backtracking, DP & Bitwise Finale",
    title: "Hostel Snack Suitcase (`0/1 Knapsack`) & Copied Essay Detector (`LCS`)",
    conceptTopic: "2D Dynamic Programming (`0/1 Knapsack`, `Grid Paths`, `Longest Common Subsequence`)",
    durationLabel: "2:05",
    estimatedSeconds: 125,
    teaser:
      "Maximizing midnight exam-week snacks in a strict 5-kg backpack—and spotting two students copying half an essay via 2D grids!",
    castTag: "Aarav · Babloo · Turnitin Bot · Mentor Priya",
    mappedProblems: ["0/1 Knapsack / Partition Equal Subset Sum", "Unique Paths", "Longest Common Subsequence / Edit Distance"],
    segments: [
      {
        speaker: "narrator",
        label: "Hook · When TWO Variables Define Your State",
        text: "Episode 27 levels up to **2D Dynamic Programming**—not scarier than 1D, just sticky notes indexed by **TWO numbers** `(row, col)` or `(itemIndex, remainingWeight)`!",
      },
      {
        speaker: "character",
        label: "Setup · Midnight Snack Tote Bag (`Knapsack`) + Plagiarism Grid (`LCS`)",
        text: "Scenario 1 (**`0/1 Knapsack`**): Returning from home with a strict **`Capacity = 5 kg`** bag (`weights & joy scores` for jars of Mom's laddoos, chips, pickle). At Jar `i` with `w` kg left: Either **TAKE** it (`value[i] + dp[i-1][w - weight[i]]` if it fits!) OR **LEAVE** it (`dp[i-1][w]`)! Why not Greedy highest value-per-kg? Same Episode 15 trap: 1 bulky `4kg` brick might lock out two awesome `2.5kg` jars! Check ALL `(item, weight)` pairs cleanly in `O(N × W)`!",
        sfx: "scratch",
      },
      {
        speaker: "punchline",
        label: "Punchline · Catching Babloo Copying Aarav's Report (`LCS`)",
        text: "Scenario 2 (**`Longest Common Subsequence` / `Edit Distance`**): Babloo copies Aarav's essay swapping a few words in between! Compare pointers `(i, j)` across string `A` & `B`: if `A[i] == B[j]`, score **`1 + dp[i-1][j-1]`** diagonal win! If they DON'T match? Try skipping left OR skipping right: **`max(dp[i-1][j], dp[i][j-1])`**! Zero exponential guesswork!",
        pauseBeforeMs: 380,
        sfx: "rimshot",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Full Technical Breakdown",
        text: "Almost EVERY 2D DP classic belongs to 3 clean grids: (1) **Grid Walking** (`Unique Paths`, `Min Path Sum`: combine `top + left`); (2) **Subsequence Matching on 2 Strings** (`LCS`, `Edit Distance` — match diagonal `+1`, mismatch min/max neighbor); (3) **`0/1 Knapsack` & `Partition Equal Subset Sum`** (`iterate weight BACKWARDS from W down to w` to compress the entire 2D table cleanly into ONE **1D array** without reusing an item twice!).",
        pauseBeforeMs: 300,
        sfx: "ding",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Jar `i` in a `5kg` tote bag: `Take (val + left_over)` vs `Leave`",
        technicalConcept: "`0/1 Knapsack`: `max(dp[i-1][w], v + dp[i-1][w - wt])`",
        whyItMatches: "Captures subset tradeoffs Greedy value/weight ratios miss.",
      },
      {
        storyElement: "Looping `w` RIGHT-TO-LEFT (`W -> wt`) in 1D compressed array",
        technicalConcept: "Prevents Re-picking Same Item (`0/1` vs `Unbounded`)",
        whyItMatches: "Reads pure previous-row values cleanly before overwriting!",
      },
      {
        storyElement: "Matching essay chars (`1 + diag`) vs skipping (`max(top, left)`)",
        technicalConcept: "Longest Common Subsequence (`O(M × N)`)",
        whyItMatches: "Direct ancestor behind Git `diff`, DNA alignment, and `Edit Distance`!",
      },
    ],
    technicalExplanation:
      "2D DP indexes subproblems by `(i, j)` across prefixes of two sequences (`LCS`, `Edit Distance`), grid coordinates (`Unique Paths`), or `(item_idx, capacity)` (`Knapsack` / `Subset Sum`). Rolling row compression turns `O(M × N)` space into `O(N)`!",
    miniSnippet: {
      language: "python",
      code: `# 0/1 Knapsack / Partition Subset Sum (1D Space-Optimized!):
dp = [False] * (target + 1); dp[0] = True
for num in nums:
    for s in range(target, num - 1, -1): # BACKWARDS loop avoids reusing 'num' twice!
        dp[s] = dp[s] or dp[s - num]`,
      complexity: "O(N × Target) time · O(Target) space!",
    },
    quiz: {
      prompt:
        "In that space-optimized 1D **`Partition Equal Subset Sum`** (`0/1 Knapsack`) snippet, why MUST the inner loop iterate **BACKWARDS (`for s = target down to num`)** instead of forwards (`num up to target`)?",
      scenarioHint: "Trace `nums = [3]` with `target = 6` if you looped forward from `3` to `6`!",
      options: [
        "Python `range` is faster counting downwards",
        "Iterating forward lets `dp[6]` read `dp[3]` updated by that SAME `num=3`, illegally **reusing the exact same single item multiple times** (`Unbounded Knapsack`!)",
        "Forward loops ignore odd weights",
        "Backward loops convert DP into Quick Sort",
      ],
      correctIndex: 1,
      correctFeedback:
        "10/10 mastery!! Forward reuse turns `0/1` (`at most once`) into `Unbounded` (`infinite copies`); backward order reads strictly unmutated prior-item states!",
      wrongFeedback:
        "Trace `num = 3`: going forward sets `dp[3] = True`, then immediately checks `dp[6] |= dp[3]` reusing that SINGLE `3` a second time!!",
    },
    recallKeywords: ["knapsack", "lcs", "backward", "0/1", "diagonal", "2d dp"],
    bonusRecallPrompt:
      "Wait—if `Coin Change` DOES allow infinite coins of each type (`Unbounded Knapsack`), which direction should the inner loop run?!",
  },
  {
    id: "ep-28-bit-manipulation-finale",
    episodeNumber: 28,
    chapterNumber: 7,
    chapterTitle: "Season 7 · Backtracking, DP & Bitwise Finale",
    title: "Hostel Switchboard & The Lone Missing AirPod (`Bitwise Finale`)",
    conceptTopic: "Bit Manipulation (`AND`, `OR`, `XOR`, Shifts, Bitmasks) & Season Graduation!",
    durationLabel: "2:10",
    estimatedSeconds: 130,
    teaser:
      "Control 8 dorm corridor switches inside 1 tiny integer—and spot Babloo's lone unpaired AirPod using hardware XOR symmetry in O(1) RAM!",
    castTag: "Aarav · Babloo · Warden · Mentor Priya (Full Cast Finale!)",
    mappedProblems: ["Single Number (`XOR`)", "Counting Bits / Power of Two (`n & (n - 1)`)", "Bitmask Subsets / Missing Number"],
    segments: [
      {
        speaker: "narrator",
        label: "Hook · Down to Raw Copper Logic Gates (`Episode 28 Finale`)",
        text: "Welcome to our Grand Series Finale—Episode 28!! From Episode 1's chilli-powder payasam crisis all the way through Big-O, Stacks, Hash Maps, Trees, Dijkstra, Topo Sort, and Dynamic Programming—look how far you've come! Tonight, the hostel warden kills AC power, leaving an 8-switch hallway breaker board: `1` for ON, `0` for OFF packed inside **ONE 8-bit integer (`Bitmask`)**!",
      },
      {
        speaker: "character",
        label: "Setup · Shifts, Power-of-2 & Packing 8 Switches in 1 Integer",
        text: "Watch 3 CPU tricks running in **0.3 nanoseconds (`1 cycle`)** directly on silicon! First: set or test Switch `#3` cleanly via bit shifts `(mask | (1 << 3))`! Even better: left-shifting `(x << 1)` doubles `x`, right-shifting `(x >> 1)` halves `x` cleanly! Second: check `'Is N an exact Power of 2 (1, 2, 4, 8...)?'` In binary, powers of two hold **strictly ONE `1`-bit** (`1000`), and `n - 1` flips to (`0111`) -> **`(n & (n - 1)) == 0`** drops the lowest set `1`-bit in ONE instruction!",
        sfx: "scratch",
      },
      {
        speaker: "punchline",
        label: "Punchline · Finding Babloo's Lone Missing AirPod in `O(1)` RAM!",
        text: "Third trick—Grand Finale Flex!! Babloo spills 99 paired Apple AirPods + **ONE lone unpaired Left AirPod** across the floor (`[7, 3, 9, 3, 7]`)! Zero sorting! Zero Hash Map memory! Simply XOR (`^`) every ID together: every identical pair **`x ^ x` literally vaporizes to ZERO**, leaving ONLY **`0 ^ loneAirPod = 9`** standing in **`O(n)` time and strict `O(1)` space**!",
        pauseBeforeMs: 380,
        sfx: "rimshot",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Graduation Wrap-Up",
        text: "BOOM—28 for 28!! You've officially mastered every cornerstone concept of Programming and Data Structures & Algorithms purely through living stories! Whenever a LeetCode problem or college interviewer tries intimidating you with jargon, pause for two seconds, recall Aarav's payasam, Goa Splitwise, Night Canteen, Chandni Chowk ripples, Fridge sticky notes, or lone XOR AirPods—and code cleanly into **`/dsa` CodeStudio Arena**! Congratulations, engineer!",
        pauseBeforeMs: 300,
        sfx: "ding",
      },
    ],
    comparisonRows: [
      {
        storyElement: "8 hallway ON/OFF toggle switches stored in one byte (`0..255`)",
        technicalConcept: "Bitmask (`1 << k`, `(mask >> k) & 1`, Bitmask DP)",
        whyItMatches: "Packs boolean subsets into 1 fast CPU integer.",
      },
      {
        storyElement: "Twin AirPod pairs cancelling cleanly (`x ^ x == 0`)",
        technicalConcept: "`XOR` (`^`) Commutative Self-Inverse (`Single Number`)",
        whyItMatches: "Solves `Single Number` & `Missing Number` in `O(n)` time, `O(1)` space!",
      },
      {
        storyElement: "Dropping rightmost `1`-bit cleanly (`1000 & 0111 == 0`)",
        technicalConcept: "Brian Kernighan's `n & (n - 1)` Trick",
        whyItMatches: "Tests Power-of-2 (`n > 0`) and counts set `1` bits in `O(#ones)`!",
      },
    ],
    technicalExplanation:
      "Bitwise operators (`&`, `|`, `^`, `~`, `<<`, `>>`) work across all 32/64 bits in parallel per CPU clock. Key identities: `(x & 1)` checks odd parity; `x ^ x == 0`; `(n & (n - 1))` clears the lowest set `1` bit; and `(mask | (1 << i))` unlocks Bitmask DP for small `N <= 20`.",
    miniSnippet: {
      language: "cpp",
      code: `int singleAirPod = 0;
for (int id : pile) singleAirPod ^= id; // All paired AirPods cancel straight to 0!
bool isPow2 = (n > 0) && ((n & (n - 1)) == 0);`,
      complexity: "O(n) time · O(1) space · Hardware-gate speed",
    },
    quiz: {
      prompt:
        "During **Missing Number** on array `nums = [3, 0, 1]` (containing 3 numbers out of `0, 1, 2, 3`), a student initializes `ans = nums.length (3)` and loops `ans ^= i ^ nums[i]`. What value lands in `ans` cleanly in `O(1)` space?",
      scenarioHint: "Watch pairs across `(indices 0..3)` XOR `(values [3, 0, 1])`: `0^0`, `1^1`, `3^3` cancel out!",
      options: [
        "ans = 0 always",
        "`ans = 2` (`0^0=0`, `1^1=0`, `3^3=0`, leaving missing `2` standing alone!)",
        "ans = 6 (sum of elements)",
        "XOR only finds duplicates, never missing numbers",
      ],
      correctIndex: 1,
      correctFeedback:
        "Series Finale Champion!! Pairing `0..n` indices with `nums[0..n-1]` makes every present integer appear twice (`^ = 0`), leaving ONLY the missing `2` behind—zero overflow, `O(1)` space!",
      wrongFeedback:
        "Cancel matching buddies between expected range `{0, 1, 2, 3}` and present `[3, 0, 1]`: `0`, `1`, and `3` each appear twice (`^ = 0`), leaving strictly `2`!",
    },
    recallKeywords: ["xor", "bitmask", "pair", "power of two", "n & (n - 1)", "o(1)"],
    bonusRecallPrompt:
      "Grand Season Wrap: across all 28 episodes, which real-life college story locked in the toughest DSA concept for you?",
  },
];
