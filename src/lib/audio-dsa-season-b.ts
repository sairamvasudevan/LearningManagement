import type { AudioDsaEpisode } from "@/lib/audio-dsa-types";

export const AUDIO_DSA_SEASON_B: AudioDsaEpisode[] = [
  {
    id: "ep-13-sorting-divide-conquer",
    episodeNumber: 13,
    chapterNumber: 4,
    chapterTitle: "Season 4 · Sorting & Hierarchical Trees",
    title: "Splitting the 1,000 Exam Papers vs. Swap-Until-Dizzy",
    conceptTopic: "Quadratic Sorts vs. Divide-and-Conquer (`Merge Sort` / `Quick Sort`, `O(n log n)`)",
    durationLabel: "2:05",
    estimatedSeconds: 125,
    teaser:
      "Babloo sorts 1,000 messy exam sheets by swapping pairs next to him while Aarav hacks the desk with divide-and-conquer.",
    castTag: "Prof. Sharma · Aarav · Babloo · Mentor Priya",
    segments: [
      {
        speaker: "narrator",
        label: "Scene 1 · The Unsorted Answer-Sheet Mountain",
        text: "Welcome to Season 4! Fresh off guessing Grandma's TV volume, Aarav and Babloo volunteer to sort 1,000 shuffled DSA answer sheets by Roll Number before Prof. Sharma returns from lunch.",
      },
      {
        speaker: "character",
        label: "Bubble Chaos vs. Merge Teamwork",
        text: "Babloo uses **Bubble Sort**: stand at sheet 1, swap taller roll numbers rightward with their neighbor again and again until the biggest sheet floats to the back—around 500,000 sweaty swaps (`O(n²)`!)! Aarav laughs and recruits 7 dorm buddies for **Merge Sort (Divide & Conquer)**: tear the 1,000-sheet pile cleanly in half (500 + 500), pass halves down until everyone holds just 1 tiny sheet (already sorted!), then **zipper-merge** two sorted piles back together just by peeking at the top sheet of each stack (`O(n log n)`)! Only ~10,000 super-clean comparisons instead of half a million!",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Tech Breakdown",
        text: "Comparison sorting has a famous theoretical lower bound: **`O(n log n)`**! **Merge Sort** guarantees `O(n log n)` even in worst-case inputs and stays *stable* (preserving equal items' order), using `O(n)` merge space. **Quick Sort** picks a pivot partitioning smaller left / larger right in-place (`O(1)` heap extra space, blazing cache speed), averaging `O(n log n)`—while **Counting / Radix Sort** beats `O(n log n)` down to `O(n)` ONLY when sorting small bounded integer keys!",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Swapping neighboring papers 500,000 times (`Bubble`)",
        technicalConcept: "O(n²) Sorting (Bubble / Insertion / Selection)",
        whyItMatches: "Easy to write, great only for tiny (`n <= 30`) or nearly sorted arrays.",
      },
      {
        storyElement: "Splitting 1000->500->250... then zipper-merging sorted tops",
        technicalConcept: "Merge Sort (`O(n log n)` Guaranteed, Stable)",
        whyItMatches: "Logarithmic tree height (`log n`) × linear merge per level (`O(n)`).",
      },
      {
        storyElement: "Choosing Roll 500 as wall: smaller left, larger right",
        technicalConcept: "Quick Sort Partitioning (`O(n log n)` Avg, In-Place)",
        whyItMatches: "No auxiliary merge array needed; super cache-friendly.",
      },
    ],
    technicalExplanation:
      "Divide-and-conquer cuts sorting work across `log₂(n)` recursion levels each doing `O(n)` merge/partition steps (`O(n log n)` total). Know when to rely on `std::sort` / Timsort (`O(n log n)`), and when custom comparators or Counting Sort unlock `O(n)`.",
    miniSnippet: {
      language: "cpp",
      code: `// Sorting unlocks Two Pointers & Binary Search!
sort(nums.begin(), nums.end()); // Introsort: guaranteed O(n log n) time!`,
      complexity: "O(n log n) comparison sorts · O(n + k) Counting Sort",
    },
    quiz: {
      prompt:
        "Why does Merge Sort achieve `O(n log n)` across ANY adversarial shuffled array, whereas naive Quick Sort (always picking the first element as pivot) can slow to `O(n²)` on an ALREADY-sorted array?",
      scenarioHint: "What happens if your 'wall pivot' happens to be the smallest item every single split?",
      options: [
        "Merge Sort skips elements divisible by 2",
        "Merge Sort ALWAYS splits strictly in half (`log₂ n` depth), whereas a bad Quick Sort pivot peels off 1 element vs `n - 1` elements for `n` levels",
        "Quick Sort uses more stack memory than Bubble Sort",
        "Already-sorted arrays cannot be merged cleanly",
      ],
      correctIndex: 1,
      correctFeedback:
        "Sharp! Merge Sort forces exact 50/50 cuts every time (`log₂ n` levels). Naive Quick Sort on sorted data makes lopsided `0` vs `n-1` splits—mitigated by randomized pivots!",
      wrongFeedback:
        "Imagine picking the lowest card every time for Quick Sort's pivot: your left pile is empty (`0`) and your right pile still holds `n-1` cards (`n` levels deep = `O(n²)`!).",
    },
    recallKeywords: ["divide", "conquer", "merge", "pivot", "log n", "stable"],
    bonusRecallPrompt:
      "When would you intentionally pick Merge Sort instead of in-place Quick Sort?",
  },
  {
    id: "ep-14-trees-bst-traversals",
    episodeNumber: 14,
    chapterNumber: 4,
    chapterTitle: "Season 4 · Sorting & Hierarchical Trees",
    title: "The Joint Family WhatsApp Tree & Feast Order",
    conceptTopic: "Binary Trees, Binary Search Trees (`BST`) & Pre/In/Post/Level Traversals",
    durationLabel: "2:05",
    estimatedSeconds: 125,
    teaser:
      "Grandpa announces dinner across four generations while strictly seating younger cousins left and elder uncles right.",
    castTag: "Grandpa · Aarav · Babloo · Mentor Priya",
    segments: [
      {
        speaker: "narrator",
        label: "Scene 1 · Family Reunion Seating Chart",
        text: "After grading exam sheets cleanly, Aarav attends his giant joint-family anniversary feast. Notice the seating isn't a flat Cinema Row—it's a **Tree** branching down from **Root Grandpa**! Every person seats at most TWO kids directly below: Left Child and Right Child!",
      },
      {
        speaker: "character",
        label: "Sorted Ages + Three Ways to Hug",
        text: "Grandpa enforces a **Binary Search Tree (BST)** rule by birth year: everyone YOUNGER sits down the LEFT branch, everyone OLDER sits down the RIGHT branch! Want Auntie aged 48? Start at Grandpa (60) -> younger, turn LEFT -> hit Uncle (42) -> older, turn RIGHT -> BOOM, exact person in 3 hops (`O(log n)` on balanced trees)! Wait—when dinner rings, there are two totally different greeting walks: **Level-Order (BFS)** greets all uncles on Floor 1 before ANY cousin on Floor 2! Meanwhile, **In-Order DFS** walks `(Visit Left Younger -> Greet Self -> Visit Right Older)`—magically shaking hands in **EXACT SORTED AGE ORDER** from youngest toddler up to Grandpa!",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Tech Breakdown",
        text: "Master two core instincts on **Binary Trees**: (1) Every BST maintains `left < node < right`, making **In-Order Traversal** yield sorted data cleanly in `O(n)`—and beware skewed chains (`1 -> 2 -> 3`) shrinking trees back into Linked Lists (`O(n)` height), fixed by balanced AVL/Red-Black trees! (2) Almost every recursive tree problem ('max depth', 'diameter', 'LCA', 'invert tree') asks cleanly: 'What do I need from Left subtree + Right subtree to answer Self?'",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Younger family left, older family right under every elder",
        technicalConcept: "BST Invariant (`left.val < root.val < right.val`)",
        whyItMatches: "Prunes half the family tree at every decision step (`O(h)` search).",
      },
      {
        storyElement: "Greeting Left kid -> Self -> Right kid on BST",
        technicalConcept: "In-Order Traversal (Sorted Output!)",
        whyItMatches: "Produces elements monotonically from smallest to largest.",
      },
      {
        storyElement: "Calling Floor 1 cousins, then Floor 2 grandkids",
        technicalConcept: "BFS Level-Order Traversal (Using Queue)",
        whyItMatches: "Processes nodes strictly depth-by-depth.",
      },
    ],
    technicalExplanation:
      "Trees model acyclic hierarchies (`N` nodes, `N-1` edges). Balanced BSTs support `O(log n)` search/insert/delete, while DFS (`Preorder`, `Inorder`, `Postorder`) uses recursion/Stack and BFS uses a Queue.",
    miniSnippet: {
      language: "cpp",
      code: `int maxDepth(TreeNode* root) {
  if (!root) return 0; // Empty branch has height 0
  return 1 + max(maxDepth(root->left), maxDepth(root->right));
}`,
      complexity: "O(n) traversal visits every node once · O(h) recursion stack",
    },
    quiz: {
      prompt:
        "Someone accidentally deletes half the arrows of a Binary Search Tree—wait no, suppose we want to print ALL values of a valid Binary Search Tree in **strict ascending sorted order**. Which traversal prints them sorted?",
      scenarioHint: "Remember: younger cousins sit LEFT, self is MIDDLE, older elders sit RIGHT!",
      options: [
        "Pre-Order (`Root -> Left -> Right`)",
        "In-Order (`Left -> Root -> Right`)",
        "Post-Order (`Left -> Right -> Root`)",
        "Level-Order BFS (`Queue floor-by-floor`)",
      ],
      correctIndex: 1,
      correctFeedback:
        "Exactly! Visiting `Left (smaller) -> Root (self) -> Right (larger)` recursively visits every BST node in exact sorted order!",
      wrongFeedback:
        "Trace a tiny BST with Root=5, Left=2, Right=8: to print `2, 5, 8`, you must visit `Left -> Root -> Right` (`In-Order`)!",
    },
    recallKeywords: ["inorder", "bst", "left", "right", "balanced", "height"],
    bonusRecallPrompt:
      "What happens to BST search speed if you insert `[1, 2, 3, 4, 5, 6]` in sorted order without self-balancing?",
  },
  {
    id: "ep-15-heaps-priority-queues",
    episodeNumber: 15,
    chapterNumber: 4,
    chapterTitle: "Season 4 · Sorting & Hierarchical Trees",
    title: "Hospital Emergency Ward vs. Paper-Cut Guy",
    conceptTopic: "Heaps & Priority Queues (`O(log n)` Insert/Extract, Top-K Elements)",
    durationLabel: "2:00",
    estimatedSeconds: 120,
    teaser:
      "A regular FIFO queue would let a stubbed-toe patient block an ambulance—enter the Min-Heap triage desk!",
    castTag: "Dr. Meera · Babloo (Paper Cut) · Aarav · Mentor Priya",
    segments: [
      {
        speaker: "narrator",
        label: "Scene 1 · Clinic Triage Drama",
        text: "Episode 15! Babloo cuts his pinky folding paper-craft handouts and sprints to the campus clinic claiming Level-999 emergency—Priority `10` (low urgency!). Behind him sits a guy who twisted an ankle falling off a skateboard—Priority `1` (urgent!!).",
      },
      {
        speaker: "character",
        label: "Why Sort Everything Every Minute?",
        text: "If Nurse Meera ran a standard **FIFO Chai Queue**, Babloo gets a SpongeBob bandage while poor skateboard guy waits behind twenty mild sneezes! Wait—could Nurse Meera keep an Array sorted 100% of the time (`O(n)` shift or `O(n log n)` re-sort every walk-in)? Too slow when ambulances arrive every minute! Instead, she runs a **Min-Heap Priority Queue**! Think of it like a loose partial championship pyramid: ONLY the **single hottest priority patient** MUST bubble to the top Chair `#0`! New ambulance patient walks in -> bubbles up only the pyramid height (`log n` ~10 swaps even among 1,000 patients!). Doctor finishes top patient -> next urgent one rises to Chair `#0` in `O(log n)`!",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Tech Breakdown",
        text: "A **Binary Heap** (`priority_queue`, Python `heapq`) packs a complete binary tree cleanly inside a flat Array (`parent = (i-1)/2`, `children = 2i+1, 2i+2`), giving **`O(1)` peek at extreme Min/Max**, **`O(log n)` push & pop**, and solving ALL **Top-K / K-th Largest / Merge K Sorted Lists / Median Stream / Dijkstra** problems cleanly without sorting all elements continuously!",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Highest-urgency patient always sitting in Chair #0",
        technicalConcept: "Heap `peek() / top()` — `O(1)`",
        whyItMatches: "Root element always holds strict minimum (or maximum) priority.",
      },
      {
        storyElement: "New trauma case bubbling up only 3 levels instead of sorting 1,000 people",
        technicalConcept: "Heap `push()` / `pop()` — `O(log n)`",
        whyItMatches: "Only swaps along a single root-to-leaf path (`height = log n`).",
      },
      {
        storyElement: "Keeping just a 10-person VIP shortlist among 1,000,000 scores",
        technicalConcept: "Size-K Min-Heap for Top-K (`O(n log K)`)",
        whyItMatches: "Avoids holding/sorting all `n` items in `O(n log n)`!",
      },
    ],
    technicalExplanation:
      "Heaps satisfy partial heap-order (`parent <= child` in a Min-Heap) rather than full sorted order. Whenever you repeatedly ask for the 'current smallest/largest/best' dynamically or track Top-K items in a stream, use a Heap.",
    miniSnippet: {
      language: "python",
      code: `import heapq
min_heap = []
heapq.heappush(min_heap, (1, "Ankle Sprain"))   # O(log n)
heapq.heappush(min_heap, (10, "Babloo Papercut"))
urgent = heapq.heappop(min_heap)                # Pops (1, "Ankle Sprain") first!`,
      complexity: "O(1) peek · O(log n) push/pop · O(n log K) Top-K",
    },
    quiz: {
      prompt:
        "You stream **10,000,000 real-time scores** and ONLY want the **Top 5 highest scores** without storing or sorting all 10 million scores. Which Heap pattern solves this cleanly in ~`O(N log 5)` time and `O(5)` space?",
      scenarioHint: "Keep a VIP club of size 5! Whenever someone beats the WEAKEST VIP member inside...",
      options: [
        "Use a LIFO Stack of size 10,000,000",
        "Keep a Min-Heap of size 5: push each score and pop the minimum whenever size exceeds 5!",
        "Re-sort the full array from scratch on every incoming score",
        "Use a Max-Heap of size 5 and pop the maximum whenever size exceeds 5",
      ],
      correctIndex: 1,
      correctFeedback:
        "Genius trick! A **Min-Heap** of size K places the gatekeeper (weakest of the top K) right at the root—if a newcomer beats that root, kick out the minimum (`pop`) and keep the top 5!",
      wrongFeedback:
        "Watch the sign carefully! If you popped the *maximum* from a Max-Heap, you'd throw away the #1 champion! A Min-Heap kicks out small losers so only Top K champs stay.",
    },
    recallKeywords: ["heap", "priority queue", "log n", "top-k", "min-heap", "bubble"],
    bonusRecallPrompt:
      "Why are Heaps stored inside a plain flat Array instead of pointer-linked Tree nodes?",
  },
  {
    id: "ep-16-tries-prefix-trees",
    episodeNumber: 16,
    chapterNumber: 4,
    chapterTitle: "Season 4 · Sorting & Hierarchical Trees",
    title: "Autocomplete Uncle Finishing Every Word Mid-Syllable",
    conceptTopic: "Tries (Prefix Trees) for Fast Dictionary & Autocomplete Lookups",
    durationLabel: "2:00",
    estimatedSeconds: 120,
    teaser:
      "Aarav discovers why typing 'g-a-l' in search predicts 'Galgotias' before checking 100,000 random dictionary words.",
    castTag: "Babloo · Autocomplete Uncle · Aarav · Mentor Priya",
    segments: [
      {
        speaker: "narrator",
        label: "Scene 1 · The Uncanny Hostel Mind-Reader",
        text: "Episode 16! Have you noticed on our campus header `⌘K` search bar that typing just `\"co\"` immediately suggests `\"Coding\"`, `\"Compiler\"`, `\"Communication\"`? Babloo assumes there's a tiny mind-reader inside his keyboard!",
      },
      {
        speaker: "character",
        label: "Shared Prefix Corridors",
        text: "Priya explains it with **Autocomplete Uncle's Letter Hallways**: Imagine storing 100,000 campus words (`cat`, `car`, `card`, `code`, `cookie`) WITHOUT repeating `'c -> a'` or `'c -> o'` 50,000 times! Instead, start at Hallway Root: take Door `'c'`, then Door `'a'`, and suddenly you reach a room holding ONLY `'cat'`, `'car'`, `'card'`! Want ALL words starting with `\"car\"`? Don't scan 100,000 unrelated words starting with `'z'` or `'b'`! Walk just **3 doors** (`c -> a -> r` — `O(length of word)`) regardless of whether your dictionary holds 10 words or 10 MILLION words!",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Tech Breakdown",
        text: "A **Trie (Prefix Tree)** stores strings character-by-character as tree edges, marking word endings with `isEndOfWord = true`. Hash Maps check exact whole strings in `O(L)`, ONLY **Tries** solve **`startsWith(prefix)`**, wildcard matches (`c.t`), IP routing prefixes, and autocomplete suggestions cleanly in **`O(prefixLength)`**, sharing memory across common prefixes cleanly!",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Doors `'c' -> 'a' -> 'r'` sharing one common `'ca'` corridor",
        technicalConcept: "Shared Prefix Nodes (Space Saving)",
        whyItMatches: "Thousands of words sharing `'inter...'` store those letters once.",
      },
      {
        storyElement: "Putting a green `'VALID WORD'` welcome mat on `'car'` vs `'ca'`",
        technicalConcept: "node.isEndOfWord Boolean Flag",
        whyItMatches: "Distinguishes true words from mere intermediate prefixes.",
      },
      {
        storyElement: "Stepping through just 3 doors for `'car*'` in a million-word dict",
        technicalConcept: "Prefix Search (`O(L)` independent of word count N)",
        whyItMatches: "Work depends purely on typed word length `L`, not dictionary size `N`.",
      },
    ],
    technicalExplanation:
      "Each Trie node typically holds `children[26]` (or a small map) + `isEnd` flag. Insertion, exact lookup, and `startsWith(prefix)` all run in `O(L)` where `L` is key length.",
    miniSnippet: {
      language: "python",
      code: `curr = root
for ch in prefix:
    if ch not in curr.children: return False
    curr = curr.children[ch]   # Walk 1 door per char: O(len(prefix))!
return True`,
      complexity: "O(L) insert/search/startsWith · L = string length",
    },
    quiz: {
      prompt:
        "You store `'car'`, `'card'`, `'carpet'`, and `'cat'` inside a **Trie**, and now call `search('ca')` (exact full-word check, NOT `startsWith`). Why must `search('ca')` return `false`?",
      scenarioHint: "Did anyone place a 'VALID WORD' welcome mat inside room `'a'`, or did they keep walking to `'r'` and `'t'`?",
      options: [
        "Because `'ca'` is missing its children links",
        "Because although the path `'c -> a'` exists as a prefix, `node['a'].isEndOfWord` is `false`!",
        "Because Tries automatically reject words shorter than 3 characters",
        "Because `'cat'` overwrote `'ca'`",
      ],
      correctIndex: 1,
      correctFeedback:
        "Boom! Path existence alone proves `'ca'` is a *prefix* (`startsWith`), while `isEndOfWord === true` confirms an actual stored word!",
      wrongFeedback:
        "Think of walking through corridor `c -> a`: the doors exist because of `cat`/`car`, so only checking `isEndOfWord` distinguishes prefix vs whole word.",
    },
    recallKeywords: ["prefix", "isend", "trie", "autocomplete", "length", "children"],
    bonusRecallPrompt:
      "When can a Trie beat a Hash Map even though both say `'O(word length)'` lookup?",
  },
  {
    id: "ep-17-graphs-representation",
    episodeNumber: 17,
    chapterNumber: 5,
    chapterTitle: "Season 5 · Graphs & Optimization",
    title: "The Hostel Charger-Borrowing Gossip Network",
    conceptTopic: "Graphs (`Vertices`, `Edges`, `Adjacency List` vs `Matrix`, Cycles)",
    durationLabel: "2:00",
    estimatedSeconds: 120,
    teaser:
      "Nobody knows where Aarav's USB-C fast charger vanished—until Priya draws edges connecting every roommate swap.",
    castTag: "Aarav · Babloo · Floor-3 · Mentor Priya",
    segments: [
      {
        speaker: "narrator",
        label: "Scene 1 · Case of the Missing Type-C Charger",
        text: "Welcome to Season 5! Aarav's beloved 65-watt laptop charger disappears! Babloo blames Vikram, Vikram blames Rohan, Rohan blames nobody... How do you model messy real-world relationships that loop back instead of flowing neatly top-down like a Family Tree?",
      },
      {
        speaker: "character",
        label: "Vertices, Arrows & Sparse Neighborhood Lists",
        text: "Welcome to **Graphs**! Every student is a **Node (Vertex `V`)**, and every 'Aarav lent charger to Babloo' link is an **Edge `E`**! Notice: 'Friendship' goes BOTH ways (**Undirected**), whereas 'Babloo owes Aarav ₹200' points ONE way (**Directed** arrow!), and sometimes Babloo accidentally lends back to Aarav creating a sneaky **Cycle**! Now how should Priya store this network across 10,000 campus students? Option 1 (**Adjacency Matrix**): print a colossal `10,000 × 10,000` grid (`100 MILLION` cells mostly filled with zeros since each student only knows ~15 buddies!). Option 2 (**Adjacency List**): give EACH student a compact notebook page listing ONLY their actual ~15 friends (`O(V + E)` memory)!",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Tech Breakdown",
        text: "Almost every social network, road map, dependency DAG, or state transition is a **Graph `G = (V, E)`**! Real-world graphs are almost always **sparse**, making **Adjacency Lists** (`vector<vector<int>>` / `dict[node] = [...]`) the gold standard for `O(V + E)` traversal—and NEVER forget a **`visited` set**, or cycles will spin you forever like Waiter Raju's sambar loop!",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Student rooms `1..V` & charger loan arrows `u -> v`",
        technicalConcept: "Vertices `V` & Directed/Undirected Edges `E`",
        whyItMatches: "Models arbitrary symmetric or one-way links plus loops.",
      },
      {
        storyElement: "Giant `10,000 × 10,000` empty grid mostly zeroes",
        technicalConcept: "Adjacency Matrix (`O(V²)` space, `O(1)` edge check)",
        whyItMatches: "Wastes massive RAM on sparse networks; good only when dense (`E ≈ V²`).",
      },
      {
        storyElement: "Each room keeping a slim notepad of actual friends",
        technicalConcept: "Adjacency List (`O(V + E)` space & iteration)",
        whyItMatches: "Visits only true neighbors; scales effortlessly to millions of nodes.",
      },
    ],
    technicalExplanation:
      "Trees are connected acyclic graphs (`E = V - 1`). General Graphs allow multiple paths and cycles, requiring `Adjacency Lists` (`O(V + E)` memory) plus explicit `visited` tracking during traversals.",
    miniSnippet: {
      language: "python",
      code: `graph = defaultdict(list) # Adjacency List: O(V + E) space
for u, v in roads:
    graph[u].append(v)
    graph[v].append(u)      # Undirected edge adds reverse link too`,
      complexity: "Adjacency List: O(V + E) · Matrix: O(V²)",
    },
    quiz: {
      prompt:
        "You have **50,000 cities (`V`)** connected by only **80,000 highways (`E`)**. Why would an Adjacency Matrix `bool adj[50000][50000]` blow Memory Limit Exceeded while an Adjacency List uses tiny RAM?",
      scenarioHint: "Multiply `50,000 × 50,000` vs summing `50,000 + 80,000`!",
      options: [
        "Matrices cannot represent highway numbers",
        "A Matrix allocates `2.5 BILLION` cells (~2.5 GB mostly zeros), whereas an Adjacency List stores only ~210k entries (`O(V + E)`)",
        "Adjacency Lists ignore undirected edges automatically",
        "Matrices require sorting cities alphabetically first",
      ],
      correctIndex: 1,
      correctFeedback:
        "Exact math! Sparse road networks (`E ~ V`) explode `V²` memory in matrices; Adjacency Lists store ONLY actual connections cleanly!",
      wrongFeedback:
        "Multiply `50,000 × 50,000 = 2,500,000,000` empty boxes! Adjacency Lists store just actual highways (`80,000 × 2`).",
    },
    recallKeywords: ["adjacency", "sparse", "visited", "cycle", "v + e", "directed"],
    bonusRecallPrompt:
      "Why is a `visited` set mandatory when traversing a Graph whereas simple root-to-leaf Tree traversals often skip it?",
  },
  {
    id: "ep-18-bfs-vs-dfs",
    episodeNumber: 18,
    chapterNumber: 5,
    chapterTitle: "Season 5 · Graphs & Optimization",
    title: "Lost in Chandni Chowk Without Google Maps",
    conceptTopic: "BFS (Queue · Shortest Hop Path) vs. DFS (Stack/Recursion · Deep Dive)",
    durationLabel: "2:05",
    estimatedSeconds: 125,
    teaser:
      "Babloo sprints head-first down one confusing Old Delhi alley until blocked by a sleeping bull; Aarav sends ripples outward.",
    castTag: "Aarav · Babloo · Old Delhi Alleys · Mentor Priya",
    segments: [
      {
        speaker: "narrator",
        label: "Scene 1 · Finding the Legendary Jalebi Shop",
        text: "Episode 18 drops Aarav and Babloo into the twisting maze of Old Delhi's Chandni Chowk lanes to grab hot jalebis before train departure—with dead phone batteries!",
      },
      {
        speaker: "character",
        label: "Headlong Plunge (DFS) vs. Water Ripples (BFS)",
        text: "Babloo uses **Depth-First Search (DFS)**: pick ONE random lane, sprint relentlessly deeper and deeper—turn left, turn right, vault three crates—until slamming straight into a stubborn bull blocking a dead end! Now backtrack (`Stack pop`) one lane back and try the next turn! Great for exploring EVERY connected corner or checking 'does ANY path exist?'—terrible if a hidden 2-step shortcut existed right behind him! Aarav drops a **Breadth-First Search (BFS)** pebble wave: check ALL lanes **1 turn away** first (`Queue!`), then ALL lanes **2 turns away**, expanding outward like circular pond ripples! The VERY FIRST time the ripple splashes onto the Jalebi Shop, it's MATHEMATICALLY GUARANTEED to be the **fewest-turns shortest path**!",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Tech Breakdown",
        text: "Remember the golden split: **BFS (uses Queue)** radiates layer-by-layer (`distance = 1, 2, 3...`), guaranteeing **shortest unweighted path** ('Word Ladder', 'Rotting Oranges', 'Shortest Path in Binary Matrix'). **DFS (uses Stack / Recursion)** plunges deeply (`distance` unknown!), ideal for **counting islands, detecting cycles, backtracking mazes, and connected components**—both run in crisp **`O(V + E)` time**!",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Circular ripples checking Distance 1 alleys before Distance 2",
        technicalConcept: "BFS + FIFO Queue (`O(V + E)`)",
        whyItMatches: "First encounter guarantees minimum number of unweighted hops!",
      },
      {
        storyElement: "Plunging blindly down one alley until dead-end, then backtracking",
        technicalConcept: "DFS + Call Stack (`O(V + E)`)",
        whyItMatches: "Exhaustively explores components, cycles, and topological structures cleanly.",
      },
      {
        storyElement: "Dropping chalk marks on every corner already visited",
        technicalConcept: "`visited.add(node)` AT ENQUEUE / ENTRY",
        whyItMatches: "Stops infinite alley loops and prevents queuing duplicates.",
      },
    ],
    technicalExplanation:
      "Both BFS and DFS visit every reachable vertex and edge once (`O(V + E)`). Mark nodes `visited` **at the moment you push onto the BFS queue** (not after popping!) to avoid pushing the same cell dozens of times on grids.",
    miniSnippet: {
      language: "python",
      code: `q = deque([(start, 0)]); visited = {start}
while q:
    node, steps = q.popleft()           # BFS guarantees min unweighted hops!
    if node == target: return steps
    for nxt in graph[node]:
        if nxt not in visited: visited.add(nxt); q.append((nxt, steps + 1))`,
      complexity: "O(V + E) time · O(V) queue/visited space",
    },
    quiz: {
      prompt:
        "You're solving 'Minimum Moves for a Knight to Reach Target on a Chessboard' where every Knight jump costs `1 move`. Which traversal guarantees the FIRST time you hit `target` is the minimum moves?",
      scenarioHint: "Each edge has equal weight 1! Pond ripples vs bull-alley sprinting!",
      options: [
        "DFS recursive search",
        "BFS with a FIFO Queue expanding moves level 1, level 2, level 3...",
        "Quick Sort all board squares by X-coordinate",
        "Binary Search on the Knight's X position",
      ],
      correctIndex: 1,
      correctFeedback:
        "Spot on! Unweighted shortest steps = BFS pond ripples via Queue, reaching `target` at exact minimum move count first!",
      wrongFeedback:
        "DFS could wander through 40 useless squares before touching `target`, needing costly exhaustive search. Unweighted min-moves screams BFS!",
    },
    recallKeywords: ["bfs", "dfs", "queue", "shortest", "ripple", "visited"],
    bonusRecallPrompt:
      "Why must BFS on a 2D grid mark `visited[nr][nc] = true` right when pushing to the queue instead of after `popleft()`?",
  },
  {
    id: "ep-19-dijkstra-weighted",
    episodeNumber: 19,
    chapterNumber: 5,
    chapterTitle: "Season 5 · Graphs & Optimization",
    title: "Swiggy Rider Dodging Traffic Jams (`Dijkstra`)",
    conceptTopic: "Weighted Shortest Paths (`Dijkstra + Min-Heap` vs. Negative Edges)",
    durationLabel: "2:00",
    estimatedSeconds: 120,
    teaser:
      "Why the 2-turn road past Railway Gate Jam #5 takes 45 minutes while a 4-turn expressway takes only 9 minutes.",
    castTag: "Rider Kunal · Aarav · Babloo · Mentor Priya",
    segments: [
      {
        speaker: "narrator",
        label: "Scene 1 · Cold Biryani Alert!",
        text: "Episode 19! Hungry after Chandni Chowk, Aarav orders paneer biryani. Why doesn't the delivery app simply use BFS ('fewest turns')? Look at the roads: Highway A has only **1 hop** directly across town... stuck behind a **45-minute** railway crossing! Route B takes **4 quick flyover turns** totaling just **9 minutes**!",
      },
      {
        speaker: "character",
        label: "Always Settling the Closest Unfinished Intersection",
        text: "Every edge now carries a **Weight (minutes)**! Enter **Edsger Dijkstra's Greedy Wave**: swap BFS's plain FIFO Queue for a **Min-Heap Priority Queue `(totalMinutesSoFar, intersection)`**! On every step, pop the single intersection with the **lowest total minutes** reached so far! Wait—because ALL road travel times are **zero or positive (`>= 0`)**, no weird future detour can secretly turn an expensive route cheaper later! What if someone slips in a magical **Negative Edge** ('-30 minute time-machine tunnel')?! Boom—Dijkstra settles the wrong winner permanently too early, so you switch to **Bellman-Ford** (`V-1` relaxation passes)!",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Tech Breakdown",
        text: "**Dijkstra (`O((V + E) log V)`)** replaces FIFO with a **Min-Heap**, relaxing edges cleanly (`if d + w < dist[v]: update & push`) for non-negative graphs (`Network Delay`, `Cheapest Flights`, `Google Maps`). Whenever edges turn **negative**, swap to **Bellman-Ford (`O(V × E)`)**—which also catches infinite free-cash negative weight cycles!",
      },
    ],
    comparisonRows: [
      {
        storyElement: "1-hop jammed railway gate (45m) vs 4-hop clear flyover (9m)",
        technicalConcept: "Weighted Graph (`cost != hop count`)",
        whyItMatches: "BFS fails whenever road weights differ.",
      },
      {
        storyElement: "Expanding intersection with lowest total minutes from Min-Heap",
        technicalConcept: "Dijkstra Relaxation (`O((V + E) log V)`)",
        whyItMatches: "First pop of any vertex with `>= 0` weights locks its optimal cost.",
      },
      {
        storyElement: "A sci-fi shortcut awarding '-50 minutes' cashback",
        technicalConcept: "Negative Edge -> Breaks Dijkstra -> Bellman-Ford",
        whyItMatches: "Greedy lock fails when future negative edges shrink later paths.",
      },
    ],
    technicalExplanation:
      "Dijkstra greedily extracts the minimum-distance frontier vertex from a Min-Heap and skips stale heap entries (`if d > dist[u]: continue`). It requires `edge weight >= 0`; negative weights require Bellman-Ford.",
    miniSnippet: {
      language: "python",
      code: `while min_heap:
    d, u = heapq.heappop(min_heap)
    if d > dist[u]: continue               # Skip stale outdated heap copy!
    for v, w in graph[u]:
        if d + w < dist[v]:
            dist[v] = d + w; heapq.heappush(min_heap, (dist[v], v))`,
      complexity: "O((V + E) log V) time · Fails on negative edge weights",
    },
    quiz: {
      prompt:
        "Why does standard **Dijkstra** lock the wrong shortest path if an alley contains a **negative weight edge (`w = -15`)**?",
      scenarioHint: "If Node B sits at cost `10` and Node A sits at `12`, could a `-15` shortcut from A sneak past `10` later?",
      options: [
        "Priority queues crash when given negative numbers in hardware",
        "Dijkstra assumes a settled vertex can NEVER be improved via longer paths later—false when a `-15` edge lowers cost later!",
        "Dijkstra only computes maximum cost, never minimum",
        "Negative edges create a Compile-Time Error",
      ],
      correctIndex: 1,
      correctFeedback:
        "Exactly right! Non-negativity guarantees path costs only grow (`d + w >= d`). Negative weights break that guarantee—calling for Bellman-Ford!",
      wrongFeedback:
        "Trace it: Node B settles at `10`, while A at `12` waits behind it—then A takes a `-15` tunnel directly to B for `-3` AFTER B was already locked!",
    },
    recallKeywords: ["dijkstra", "min-heap", "weighted", "negative", "bellman", "relax"],
    bonusRecallPrompt:
      "What single `if` check makes Python/C++ lazy-deletion Dijkstra fast without implementing decrease-key?",
  },
  {
    id: "ep-20-toposort-union-find",
    episodeNumber: 20,
    chapterNumber: 5,
    chapterTitle: "Season 5 · Graphs & Optimization",
    title: "Exam Morning Rush: Socks Before Shoes (`DAG` & Friend Circles)",
    conceptTopic: "Topological Sort (`Kahn's Indegree`) & Disjoint Set (`Union-Find`)",
    durationLabel: "2:05",
    estimatedSeconds: 125,
    teaser:
      "Babloo tries tying Nike sneakers BEFORE pulling on his socks—plus how the admin spots cheat-ring friend cliques in O(1).",
    castTag: "Babloo · Aarav · Exam Invigilator · Mentor Priya",
    segments: [
      {
        speaker: "narrator",
        label: "Scene 1 · 8:55 AM Dressing Bug + Hackathon Teams",
        text: "Season 5 finale! Oversleeping before his 9 AM Data Structures exam, Babloo sprints out wearing shoes *first* and tries sliding thick cotton socks *over* his sneakers! Meanwhile in the exam hall, Prof. Sharma tracks which club groups secretly merged networks (`'Are Babloo and Rohit already in the same team?'`).",
      },
      {
        speaker: "character",
        label: "Prerequisite Arrows + Team Captains",
        text: "Part A—**Topological Sort (`DAG`)**: Getting dressed obeys directed arrows (`Socks -> Shoes`, `Courses 1..100 -> DSA Arena`)! Notice what items have **Zero prerequisites (`indegree == 0`)** right now? Grab `Socks`! Removing `Socks` unlocks `Shoes` (`indegree` drops from 1 to 0)! Keep queueing `indegree == 0` items (**Kahn's Algorithm**) cleanly—and if leftovers remain stuck waiting on each other (`Wear A before B AND B before A`), boom: **Cycle Detected, Impossible Schedule**! Part B—**Disjoint Set / Union-Find**: Every student wears a headband naming their **Team Captain (`parent[x]`)**! When two groups shake hands (`union`), point one captain directly to the other using **Path Compression** (`everyone remembers Ultimate Boss directly`) -> `connected(A, B)` answers YES/NO in practically **`O(1)` amortized**!",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Tech Breakdown",
        text: "Two ultra-clean graph superpowers: **Topological Sort** solves task ordering, course prerequisites (`Course Schedule I/II`), and build pipelines in `O(V + E)` using indegrees! And **Union-Find** (with **Union by Rank + Path Compression**) merges dynamic friend groups, spots cycles in undirected graphs, and powers **Kruskal's Minimum Spanning Tree** at `O(α(n))`—basically constant time!",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Clothing items with 0 pending dependencies (`Socks` before `Shoes`)",
        technicalConcept: "Kahn's Topological Sort (`indegree == 0` Queue)",
        whyItMatches: "Orders any Directed Acyclic Graph (DAG) respecting prerequisites.",
      },
      {
        storyElement: "'Must tie shoes to open socks' deadlock loop",
        technicalConcept: "Cycle Detection (`processed < V`)",
        whyItMatches: "If some nodes never reach `indegree == 0`, a cycle exists!",
      },
      {
        storyElement: "Two hostel squads pointing straight to Ultimate Captain",
        technicalConcept: "Disjoint Set Union (`find` Path Compression)",
        whyItMatches: "Flattens chains so connectivity checks take near-`O(1)` time.",
      },
    ],
    technicalExplanation:
      "Topological Sort orders vertices of a Directed Acyclic Graph (`DAG`) linearly so every `u -> v` edge sees `u` before `v`. Disjoint Set Union (`DSU`) tracks dynamic equivalence classes with near-constant amortized merge/find.",
    miniSnippet: {
      language: "cpp",
      code: `int findBoss(int x, vector<int>& p) {
  return p[x] == x ? x : p[x] = findBoss(p[x], p); // Path compression -> ~O(1)!
}`,
      complexity: "Topo Sort: O(V + E) · Union-Find: O(α(n)) ≈ O(1) amortized",
    },
    quiz: {
      prompt:
        "You run Kahn's Topological Sort (`Queue of indegree == 0 courses`) on 6 university courses, and the loop finishes after placing ONLY **4 courses** in your output schedule before the Queue turns empty. What does that prove?",
      scenarioHint: "Why would 2 remaining courses NEVER drop down to `indegree == 0`?",
      options: [
        "All 6 courses have zero prerequisites",
        "There is a circular **prerequisite cycle** trapped among the unplaced courses!",
        "The queue overflowed memory",
        "Topological Sort only works on odd numbers of nodes",
      ],
      correctIndex: 1,
      correctFeedback:
        "Spot on! Any course locked in a mutual cycle (`A -> B -> A`) keeps `indegree >= 1` forever—so `ordered.length < numCourses` cleanly catches cyclic deadlocks!",
      wrongFeedback:
        "In Kahn's algorithm, nodes inside a cycle continuously wait on each other, so their indegrees never hit 0 and they're never queued!",
    },
    recallKeywords: ["indegree", "dag", "cycle", "prerequisite", "union", "path compression"],
    bonusRecallPrompt:
      "Notice in our own LMS: you must pass the 100-Hour Flagship before unlocking full DSA/Web Dev tracks—which graph algorithm validates zero circular locks across course prerequisites?",
  },
  {
    id: "ep-21-greedy-algorithms",
    episodeNumber: 21,
    chapterNumber: 6,
    chapterTitle: "Season 6 · Algorithms Mastery & Finale",
    title: "Packing Stomach Capacity at Chatori Gali (`Greedy` Traps)",
    conceptTopic: "Greedy Algorithms (When Local Best Works vs. Coin/Knapsack Traps)",
    durationLabel: "2:00",
    estimatedSeconds: 120,
    teaser:
      "Babloo grabs the largest Giant Kachori every time—until an awkward coin denomination proves Greedy isn't always optimal.",
    castTag: "Babloo · Aarav · Chaat Vendor · Mentor Priya",
    segments: [
      {
        speaker: "narrator",
        label: "Scene 1 · Post-Exam Street Food & Exact Change",
        text: "Final Season 6! Celebrating finishing exams cleanly, Aarav and Babloo visit Chatori Gali food street. Watch when a **Greedy** gut instinct—always grabbing the locally biggest bite right NOW without planning ahead—wins vs. fails catastrophically!",
      },
      {
        speaker: "character",
        label: "Meeting Schedule Win vs. Weird Coin Disaster",
        text: "Win #1 (**Activity Selection**): Ten awesome cultural fests clash tonight! Which festival do you pick FIRST greedily to attend the MOST fests? Not shortest, not earliest start—always grab the fest that **ENDS EARLIEST** (`finishTime`), freeing your evening fast for maximum leftovers! Guaranteed optimal! NOW watch Trap #2 (**Coins `{1, 3, 4}` for `₹6`**): Imagine magic coins `[₹4, ₹3, ₹1]` and you need exact `₹6` change using fewest coins! Babloo yells 'GREEDY! Grab biggest `₹4` first!' Leaving `₹2`, forcing `₹1 + ₹1` = **3 coins (`4+1+1`)**! Aarav shakes his head: **`₹3 + ₹3 = 2 COINS`** beats Greedy cleanly!",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Tech Breakdown",
        text: "**Greedy Algorithms** commit permanently to the locally best step at each decision without reconsidering (`O(n log n)` via sorting or heap!). They shine in **Jump Game, Fractional Knapsack, Activity/Meeting Intervals, and Huffman Coding**—and **FAIL** on `0/1 Knapsack` or arbitrary `Coin Change` where current greed locks out a better combined combo, forcing us into Episode 22's secret weapon: **Dynamic Programming**!",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Always picking the festival ending earliest (`endTime`)",
        technicalConcept: "Greedy Interval Scheduling (Optimal)",
        whyItMatches: "Leaves maximum untouched timeline for remaining activities.",
      },
      {
        storyElement: "Coins `[4, 3, 1]` paying `6`: picking `4+1+1` (3) misses `3+3` (2)",
        technicalConcept: "Greedy Counterexample -> Needs DP",
        whyItMatches: "Greedy choice lacked optimal greedy-choice property here.",
      },
      {
        storyElement: "Sorting items once + one forward loop",
        technicalConcept: "O(n log n) or O(n) Speed Advantage",
        whyItMatches: "No state table or branching exploration needed when valid.",
      },
    ],
    technicalExplanation:
      "A problem fits Greedy only when an Exchange Argument proves the locally optimal choice always belongs to some globally optimal solution. Always test one sneaky small counterexample before trusting Greedy!",
    miniSnippet: {
      language: "python",
      code: `# Greedy Non-Overlapping Intervals (sort by END time, never start time!):
intervals.sort(key=lambda x: x[1])
count, prev_end = 0, float("-inf")
for s, e in intervals:
    if s >= prev_end: count += 1; prev_end = e`,
      complexity: "O(n log n) sort + O(n) scan",
    },
    quiz: {
      prompt:
        "You must make **₹30** using the **FEWEST coins** from currency denominations `[₹25, ₹20, ₹10, ₹5, ₹1]`. What does a naive Greedy ('pick biggest <= remaining') output, and what is the true optimal coin count?",
      scenarioHint: "Compare grabbing `₹25` first vs pairing two middle coins!",
      options: [
        "Greedy picks `25+5` (2 coins) — and optimal IS 2 coins! Wait check `20+10` too—both give 2! What about ₹40 with `[25, 20, 1]`?",
        "Wait—on ₹30 above: `25+5` is 2 coins AND `20+10` is 2 coins (tie). On `[25, 20, 1]` for ₹40: Greedy picks `25 + 15×1 = 16 coins`, while DP gets `20 + 20 = 2 coins`!",
        "Greedy always fails on every integer",
        "Greedy checks every subset in `2^n` time",
      ],
      correctIndex: 1,
      correctFeedback:
        "Haha, sharp catch checking the numbers instead of blindly guessing! `[25, 20, 1]` making `40` exposes why arbitrary Coin Change requires DP (`20+20 = 2`, vs Greedy's `16` coins)!",
      wrongFeedback:
        "Always check an explicit counterexample! When `₹25` blocks picking `₹20 + ₹20` (`40`), Greedy pays `25 + 15 ones = 16 coins`.",
    },
    recallKeywords: ["greedy", "interval", "finish", "counterexample", "coin", "optimal"],
    bonusRecallPrompt:
      "When picking maximum non-overlapping meetings in one conference room, why must you sort by **END time** rather than duration or start time?",
  },
  {
    id: "ep-22-dynamic-programming",
    episodeNumber: 22,
    chapterNumber: 6,
    chapterTitle: "Season 6 · Algorithms Mastery & Finale",
    title: "Babloo's Fridge Sticky Notes (`Dynamic Programming`)",
    conceptTopic: "Dynamic Programming (`Memoization` Top-Down vs. `Tabulation` Bottom-Up)",
    durationLabel: "2:05",
    estimatedSeconds: 125,
    teaser:
      "Why Babloo refuses to solve the same math sheet twenty times—slapping cached sticky notes straight onto his hostel fridge.",
    castTag: "Babloo · Aarav · Fridge Sticky Notes · Mentor Priya",
    segments: [
      {
        speaker: "narrator",
        label: "Scene 1 · Deja Vu Homework Nightmare",
        text: "Episode 22—the crowd-favorite boss topic made shockingly simple! Yesterday, Priya asked Aarav: 'What's 1+1+1+1+1+1+1?' Aarav counts: 'Seven.' Then Priya writes `+ 1` at the end and asks: 'Now?' Babloo starts re-counting from ONE all over again! Aarav points at his previous answer and snaps: 'Eight! Because I **remembered** Seven!!'",
      },
      {
        speaker: "character",
        label: "Exponential Tree vs. Sticky-Note Memo",
        text: "Think about naive recursive `fib(50)` or `CoinChange(40)` from Episode 21: `fib(50)` asks `fib(49) + fib(48)`—and BOTH compute `fib(47)`, `fib(46)` MILLIONS of redundant times (`2^50` = **over a quadrillion calls**, freezing till the universe ends)! Now hand Babloo a stack of yellow **Fridge Sticky Notes (`dp[]`)**! Rule #1 (**Top-Down Memoization**): BEFORE recomputing ANY subproblem `dp[n]`, peek at the fridge! Solved already? Return that sticky note in **`O(1)`**! Solve each distinct state ONCE—turning **`O(2^n)` down to blistering `O(n)`**! Rule #2 (**Bottom-Up Tabulation**): Fill tiny Base Case sticky notes (`dp[0]=0, dp[1]=1`) and build cleanly left-to-right inside an array loop—no recursion stack needed!",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Tech Breakdown",
        text: "**Dynamic Programming** isn't wizardry—it's literally **Recursion + Fridge Sticky-Note Caching** whenever two signs appear: **(1) Overlapping Subproblems** (same `(i, remaining)` state repeats) and **(2) Optimal Substructure** (best answer built from best smaller answers). Think 4 lines: **State (`dp[i]` meaning)** -> **Transition (recurrence)** -> **Base Cases** -> **Order / Space Compression**!",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Re-counting `1+1+1+1+1+1+1` from zero when `+1` is appended",
        technicalConcept: "Naive Recursion Recomputing Overlapping Subproblems (`O(2^n)`)",
        whyItMatches: "Solves identical inputs exponentially many times.",
      },
      {
        storyElement: "Writing `fib(10) = 55` once on a sticky note and checking before work",
        technicalConcept: "Top-Down Memoization (`dp[state]`, `O(states)`)",
        whyItMatches: "Turns exponential recursion trees into polynomial lookup!",
      },
      {
        storyElement: "Filling answers sequentially from `dp[0]` -> `dp[1]` -> `dp[N]`",
        technicalConcept: "Bottom-Up Tabulation (`O(n)` loop, space-reducible to `O(1)`)",
        whyItMatches: "Zero call-stack overhead and clean cache-friendly loops.",
      },
    ],
    technicalExplanation:
      "DP converts exponential branching over repeated subproblems into polynomial `O(#states × transitionCost)` time using either Top-Down Memoization (`cache[state]`) or Bottom-Up Tabulation (`dp[0..n]`).",
    miniSnippet: {
      language: "cpp",
      code: `// Climbing Stairs / Fibonacci Tabulation (O(n) time, O(1) space):
int prev2 = 1, prev1 = 1; // Only last 2 sticky notes needed!
for (int i = 2; i <= n; i++) {
  int cur = prev1 + prev2; prev2 = prev1; prev1 = cur;
}`,
      complexity: "Drops O(2^n) -> O(n) time · often O(1) space",
    },
    quiz: {
      prompt:
        "You have `coinChange(amount, coins)` with recursion (`O(k^amount)`). Adding a single `memo[amount]` cache makes each amount `1..amount` compute at most **once**. What happens to runtime for `amount = 10,000` and `12` coin types?",
      scenarioHint: "Count `(distinct states) × (loop per state)` instead of exponential branches!",
      options: [
        "Still `O(12^10000)` because recursion calls `coins` 12 times",
        "Drops cleanly to `O(amount × len(coins))` (~120,000 fast ops instead of astronomical failure)!",
        "Turns into `O(log amount)` Binary Search automatically",
        "Fails whenever any coin value repeats",
      ],
      correctIndex: 1,
      correctFeedback:
        "Boom! `10,000` unique fridge sticky notes × `12` transitions = ~`120,000` ops (< 5 milliseconds) instead of melting the universe!",
      wrongFeedback:
        "Because every `memo[x]` runs its 12-coin loop ONLY ONCE on cache miss and hits O(1) thereafter, total ops equal `distinct states × per-state work`!",
    },
    recallKeywords: ["memoization", "tabulation", "sticky note", "overlapping", "state", "subproblem"],
    bonusRecallPrompt:
      "What 2 properties tell you an algorithmic problem wants Dynamic Programming?",
  },
  {
    id: "ep-23-backtracking",
    episodeNumber: 23,
    chapterNumber: 6,
    chapterTitle: "Season 6 · Algorithms Mastery & Finale",
    title: "Wedding Seating Drama & Sudoku (`Backtracking`)",
    conceptTopic: "Backtracking Search (`Choose -> Explore -> Undo`) & Pruning",
    durationLabel: "2:00",
    estimatedSeconds: 120,
    teaser:
      "Aarav tries seating 8 fighting cousins at a table where rivals cannot share rows, diagonals, or side-by-side chairs.",
    castTag: "Auntie-Planner · Aarav · Babloo · Mentor Priya",
    segments: [
      {
        speaker: "narrator",
        label: "Scene 1 · The Unsolvable Cousin Seating Chart",
        text: "Episode 23! Before our Season Finale, Auntie hands Aarav the hardest puzzle of all: seat **N Rival Cousins** (`N-Queens` / `Sudoku` / `Permutations`) across an `N × N` banquet table so NO two bitter rivals glare down the same row, column, or diagonal!",
      },
      {
        speaker: "character",
        label: "Place Chair, Test Chaos, UNDO Cleanly",
        text: "How do you solve puzzles with NO neat formula and NO Greedy shortcut? **Systematic Backtracking**—literally a three-step waltz: **(1) CHOOSE**: Seat Cousin #1 in safe Chair C. **(2) EXPLORE**: Call recursion to seat Cousins #2..N safely in remaining spots! Notice early pruning! The millisecond Row 3 threatens Auntie-Rival on Row 1's diagonal, **PRUNE** immediately (`break`—don't waste years seating 5 more rows on an already ruined conflict)! **(3) UNDO (`pop / unmark`)**: Wait—even when all explorations down Chair C finish or hit a wall, **stand Cousin #1 back up cleanly** before trying Chair D, leaving zero leftover stains!",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Tech Breakdown",
        text: "**Backtracking** systematically walks the implicit decision tree over **DFS** to generate ALL valid **Subsets, Permutations, Combinations, Word Search paths, Sudoku grids, and N-Queens layouts**. Missing the **Undo (`path.pop_back()` / `used[i] = false`)** step corrupts every sibling branch—making `(1) Choose -> (2) Recurse -> (3) Undo` the universal 3-line template!",
      },
    ],
    comparisonRows: [
      {
        storyElement: "Putting Cousin #3 in Chair B & marking Column/Diagonal busy",
        technicalConcept: "Choose (`path.push(x); used[x] = true`)",
        whyItMatches: "Commits temporarily to one decision branch.",
      },
      {
        storyElement: "Stopping instantly if Row 3 clashes with Row 1 diagonally",
        technicalConcept: "Constraint Pruning (Early Bound Check)",
        whyItMatches: "Skips entire invalid subtrees instead of checking full invalid tables.",
      },
      {
        storyElement: "Lifting Cousin #3 up & erasing busy mark before trying Chair C",
        technicalConcept: "Undo State (`path.pop(); used[x] = false`)",
        whyItMatches: "Restores shared state cleanly for the next sibling choice!",
      },
    ],
    technicalExplanation:
      "Backtracking explores valid combinations via Depth-First Search over decision choices (`O(b^d)` worst-case reduced sharply by constraint pruning). Mutating one shared `path` array with paired push/pop keeps space at `O(depth)`.",
    miniSnippet: {
      language: "cpp",
      code: `void backtrack(int start, vector<int>& path, vector<int>& nums) {
  ans.push_back(path);
  for (int i = start; i < nums.size(); i++) {
    path.push_back(nums[i]);     // 1. Choose
    backtrack(i + 1, path, nums);// 2. Explore
    path.pop_back();             // 3. UNDO cleanly before next option!
  }
}`,
      complexity: "Exponential worst-case (e.g. O(n · 2^n) subsets, O(n!) perms) + O(n) path",
    },
    quiz: {
      prompt:
        "During Permutations backtracking, a student pushes `nums[i]` onto `path`, sets `used[i] = true`, recurses, pops `path`—but **FORGETS** `used[i] = false` afterwards. What breaks?",
      scenarioHint: "What happens if Cousin #3 never erases the 'Seat Occupied' sticker when switching tables?",
      options: [
        "Only empty arrays are generated, or subsequent sibling permutations permanently think `nums[i]` is still occupied and miss valid permutations!",
        "The code runs twice as fast in O(1)",
        "C++ throws a Compile-Time Error immediately",
        "It automatically switches from Backtracking to BFS",
      ],
      correctIndex: 0,
      correctFeedback:
        "Exactly! State cleanup (`Undo`) must mirror EVERY `Choose` mutation, or sibling branches inherit polluted `used` flags and drop valid solutions!",
      wrongFeedback:
        "Think about lifting the cousin back up: if you leave `used[i] = true`, future sibling loops think item `i` is still locked forever!",
    },
    recallKeywords: ["choose", "explore", "undo", "prune", "dfs", "backtrack"],
    bonusRecallPrompt:
      "How does Backtracking differ from naive brute force that checks full configurations only at the leaves?",
  },
  {
    id: "ep-24-bit-manipulation-finale",
    episodeNumber: 24,
    chapterNumber: 6,
    chapterTitle: "Season 6 · Algorithms Mastery & Finale",
    title: "Hostel Hallway Switches & The Lone Unpaired Sock (`Bitwise Finale`)",
    conceptTopic: "Bit Manipulation (`AND`, `OR`, `XOR`, Shifts, Bitmasks) & Season Wrap-Up",
    durationLabel: "2:10",
    estimatedSeconds: 130,
    teaser:
      "Aarav fits 8 dorm switches into ONE tiny number—and uses magic XOR symmetry to spot the single stolen sock in `O(1)` space!",
    castTag: "Aarav · Babloo · Grandma · Mentor Priya (Full Cast!)",
    segments: [
      {
        speaker: "narrator",
        label: "Scene 1 · Midnight Switchboard Magic",
        text: "Welcome to our Grand Season Finale—Episode 24!! Look back how far Aarav and Babloo came from burning chilli-powder payasam all the way through Big-O, Trees, Graphs, and Dynamic Programming! Tonight, the hostel warden cuts power except for an 8-switch hallway breaker panel—just `1` or `0` ON/OFF toggles packed inside **ONE 8-bit integer (`0..255`)** called a **Bitmask**!",
      },
      {
        speaker: "character",
        label: "The Lone Unpaired Sock (`XOR` Superpower)",
        text: "Watch 3 CPU superpowers running directly on copper logic gates in ONE CPU clock cycle (`~0.3 nanoseconds`)! First, toggle or check Switch `#3` cleanly via bit shifts `(1 << 3)`! Want lightning-fast multiplication/division by 2? Left-shift `(x << 1)` doubles `x`, right-shift `(x >> 1)` halves `x`! Second—check **is `n` a Power of Two** (like `1, 2, 4, 8, 16`)? In binary, powers of two hold JUST ONE `1`-bit (`1000`), and `n - 1` flips to (`0111`) -> `(n & (n - 1)) == 0` in ONE op! Third—Babloo dumps 99 paired socks + **ONE lone unpaired sock** on the bed! No sorting, no Hash Map RAM! Run **`XOR` (`^`) across ALL socks**: every identical pair `sock ^ sock` **cancels straight to ZERO**, leaving ONLY the **lone unpaired sock (`x ^ 0 = x`)** standing in `O(n)` time and `O(1)` RAM!",
      },
      {
        speaker: "mentor",
        label: "Mentor Priya · Graduation Wrap-Up",
        text: "Congratulations—you've completed all 24 Episodes of **Code by Ear**! From Episode 1's chilli-powder payasam (`Compile vs Runtime`) right down to Bitmasks and `XOR` symmetry, you now hold a living mental cinema for every core programming & DSA invariant. Now jump into the live **DSA CodeStudio Arena**, write clean C++, Java, or Python, and ace every placement round ahead!",
      },
    ],
    comparisonRows: [
      {
        storyElement: "8 hallway ON/OFF toggle switches stored in one number",
        technicalConcept: "Bitmask (`1 << k` tests/sets bit `k` in 1 CPU cycle)",
        whyItMatches: "Packs boolean state arrays into a single integer for subsets/DP.",
      },
      {
        storyElement: "Identical sock pairs canceling to zero (`s ^ s == 0`)",
        technicalConcept: "XOR (`^`) Commutative Self-Inverse Property",
        whyItMatches: "Finds the unique missing/single number in `O(n)` time, `O(1)` space!",
      },
      {
        storyElement: "Checking single 1-bit (`1000 & 0111 == 0`)",
        technicalConcept: "Power-of-Two / Clear Lowest Set Bit (`n & (n - 1)`)",
        whyItMatches: "Removes lowest `1` bit in 1 operation (`Brian Kernighan` trick).",
      },
    ],
    technicalExplanation:
      "Bitwise ops (`&`, `|`, `^`, `~`, `<<`, `>>`) manipulate raw binary bits directly in hardware cycles. Core idioms: `(x & 1)` parity check, `(n > 0 && (n & (n-1)) == 0)` power-of-2 check, `a ^ a = 0` for Single Number, and `mask | (1 << i)` for compact Bitmask DP.",
    miniSnippet: {
      language: "cpp",
      code: `int loneSock = 0;
for (int sock : pile) loneSock ^= sock; // Every matching pair cancels to 0!
// Bonus: check power of 2 in 1 CPU instruction -> (n > 0 && (n & (n - 1)) == 0)`,
      complexity: "Single Number: O(n) time · O(1) space · 1 cycle/bit op",
    },
    quiz: {
      prompt:
        "Babloo spills socks `[4, 1, 2, 1, 2]` across the hostel floor (`1` & `2` appear twice; `4` appears once). If `ans` starts at `0` and runs `ans ^= sock` over every number, what exact value ends in `ans`, and how much extra Hash Map RAM was used?",
      scenarioHint: "Remember: order doesn't matter with XOR (`^`)—identical buddies evaporate cleanly into `0`!",
      options: [
        "ans = 10, uses O(n) Hash Map RAM",
        "ans = 4 (`1^1=0`, `2^2=0`, `0^4=4`), using strictly `O(1)` extra space!",
        "ans = 0 because `4` cancels itself out too",
        "XOR only works when matching pairs sit right next to each other",
      ],
      correctIndex: 1,
      correctFeedback:
        "Season Finale Grand Slam! Because XOR is commutative & associative (`a^b = b^a`, `x^x = 0`), order doesn't matter at all—`4` survives cleanly in strict `O(1)` memory!",
      wrongFeedback:
        "Evaluate step-by-step: `0 ^ 4 ^ 1 ^ 2 ^ 1 ^ 2` regroups to `(1 ^ 1) ^ (2 ^ 2) ^ 4 = 0 ^ 0 ^ 4 = 4`—no extra RAM needed!",
    },
    recallKeywords: ["xor", "bitmask", "pair", "cancel", "shift", "o(1)"],
    bonusRecallPrompt:
      "Look back across the entire 24-episode series: which story analogy clicked the clearest for you—and how will you use `(n & (n - 1))`?",
  },
];
