import type { ModuleCurriculum } from "./types";

export const module05: ModuleCurriculum = {
  moduleNumber: 5,
  stageNumber: 1,
  stageTitle: "STAGE 01 · READ & DEFINE THE PROBLEM",
  title: "Use Examples and Counterexamples",
  objective: "Master the art of Socratic stress-testing: create representative concrete examples to verify understanding, and engineer minimal counterexamples that ruthlessly expose flawed heuristics.",
  readTime: "24 min deep read",
  coreFocus: "Popperian Falsification · Minimal Counterexamples · The Triad Test Suite · Greedy Disproofs",
  sections: [
    {
      kicker: "SECTION 01 · THE CONFIRMATION BIAS TRAP",
      title: "Why Happy-Path Examples Lie to You",
      content: [
        "When an engineer conceives a hypothesis for how to solve a problem, human psychology triggers a powerful cognitive defect: Confirmation Bias.",
        "The engineer immediately constructs 3 or 4 examples that work with their mental model. They watch their mental model succeed on these tests, feel a rush of dopamine, and declare the problem 'solved.'",
        "In production or in competitive evaluation, their solution scores 20% and fails on hidden test cases.",
        "Master problem solvers adopt Popperian Falsification (named after philosopher of science Karl Popper): You do not test a hypothesis to prove it is right; you test it to actively try and destroy it. A hypothesis is only robust if it survives deliberate attempts to break it."
      ],
      callout: {
        type: "rule",
        title: "The Law of the Counterexample",
        text: "It takes 10,000 confirming examples to make a hypothesis plausible, but exactly ONE valid counterexample to destroy it completely. Hunt for the one counterexample first."
      }
    },
    {
      kicker: "SECTION 02 · THE TRIAD TEST SUITE",
      title: "The 3 Classes of Examples Every Problem Needs",
      content: [
        "Before reasoning about code or algorithms, construct the Triad Test Suite by hand on paper:",
        "1. The Canonical Baseline: A standard, realistic test case with 5–8 elements that establishes basic mechanics and expected outputs.",
        "2. The Trivial Degenerates: The absolute mathematical poles of the domain: N = 0 (empty), N = 1 (single element), all elements identical, all elements negative, zero.",
        "3. The Pathological Adversaries: Data constructed specifically to trick naive heuristics: reverse-sorted arrays, extreme outliers, tie collisions, non-canonical divisibility gaps, and alternating zig-zags."
      ],
      callout: {
        type: "warning",
        title: "The Trap of Giant Test Cases",
        text: "Never construct a 50-element example by hand. Large examples overwhelm human working memory and cause arithmetic mistakes. If a counterexample exists, it can almost always be demonstrated on a tiny set of 3 to 6 elements."
      }
    },
    {
      kicker: "SECTION 03 · THE ANATOMY OF GREEDY DISPROOFS",
      title: "How to Expose Flawed Heuristics",
      content: [
        "The most common intuitive trap in problem solving is the Naive Greedy Heuristic ('Always pick the largest value,' 'Always pick the cheapest item,' 'Always pick the nearest destination').",
        "Greedy heuristics feel intuitively right because they optimize the immediate local step. However, local optimization frequently blinds the system to global optimality.",
        "To disprove a greedy hypothesis, master the Sandwich Technique: Construct an example where choosing the locally best item early forces the system into an expensive, sub-optimal trap later."
      ]
    },
    {
      kicker: "SECTION 04 · MANUAL EXECUTION TRACING",
      title: "Pencil-and-Paper State Tracing",
      content: [
        "Before touching a keyboard, execute your logic by hand using a State Evolution Table:",
        "Step | Current Element | Candidate State | Decision Made | Cumulative Output",
        "Tracing through 4 rows of a table by hand reveals off-by-one errors, missing variable resets, and false termination conditions in 60 seconds."
      ],
      callout: {
        type: "tip",
        title: "The Socratic Adversary Persona",
        text: "When evaluating your own ideas, split your mind into two personas: The Architect (who designs the logic) and The Saboteur (whose sole goal is to find an input that makes the Architect look foolish)."
      }
    }
  ],
  caseStudies: [
    {
      tag: "CASE STUDY A · THE GREEDY COIN CHANGE FALLACY",
      title: "The Non-Canonical Coin Denomination Trap",
      problem: "A cashier needs to make change for amount C using the minimum number of coins. A developer proposes: 'Always pick the largest denomination that is ≤ the remaining amount.' For standard US currency (25¢, 10¢, 5¢, 1¢), this works. Does this greedy rule work for arbitrary currencies?",
      flawedApproach: "Testing on 30¢ with US coins (25¢ + 5¢ = 2 coins) and concluding the greedy rule is a universal law of nature.",
      correctInvariant: "Counterexample: Denominations = {1¢, 3¢, 4¢}. Target = 6¢.\n• Greedy choice: 4¢, remaining 2¢ -> 1¢ + 1¢. Total: 3 coins (4 + 1 + 1).\n• Optimal choice: 3¢ + 3¢ = 6¢. Total: 2 coins!\nThe greedy heuristic fails because taking the locally largest coin (4¢) blocks the globally optimal combination of twin 3¢ coins.",
      codeOrContract: "Hypothesis: Greedy(Largest ≤ Remaining) is optimal\nCounterexample: Coins = [4, 3, 1], Target = 6\nGreedy = [4, 1, 1] (3 coins) vs Optimal = [3, 3] (2 coins)\nConclusion: FALSIFIED"
    },
    {
      tag: "CASE STUDY B · INTERVAL SCHEDULING HEURISTIC",
      title: "Conference Room Meeting Allocator",
      problem: "Given a list of meetings with start and end times, schedule the maximum number of non-overlapping meetings. A student suggests: 'Always pick the meeting with the shortest duration first.'",
      flawedApproach: "Testing on non-overlapping meetings and assuming shortest duration leaves the most room for other meetings.",
      correctInvariant: "Counterexample:\nMeeting A: [09:00 - 10:30] (Duration 90m)\nMeeting B (Shortest): [10:15 - 10:45] (Duration 30m)\nMeeting C: [10:30 - 12:00] (Duration 90m)\n• Greedy Shortest picks B (30m). But B overlaps with BOTH A and C! Total meetings = 1.\n• Optimal picks A and C. Total meetings = 2!\nThe shortest meeting was a 'poison pill' bridging two viable meetings.",
      codeOrContract: "Hypothesis: Pick Shortest Duration first\nCounterexample: A:[09:00-10:30], B:[10:15-10:45], C:[10:30-12:00]\nGreedy Result: {B} (1 meeting)\nOptimal Result: {A, C} (2 meetings)\nConclusion: FALSIFIED"
    },
    {
      tag: "CASE STUDY C · THE MAJORITY VOTE ILLUSION",
      title: "Plurality vs Absolute Majority",
      problem: "A data pipeline analyzes user feedback scores (1 to 5 stars). A product manager claims: 'If a star rating is the most frequent rating in the database, it represents the majority opinion of our users.'",
      flawedApproach: "Testing on a survey where 5-stars has 80% of votes, confirming the claim.",
      correctInvariant: "Counterexample: 100 total reviews.\n• 5-stars: 35 reviews\n• 4-stars: 25 reviews\n• 3-stars: 20 reviews\n• 2-stars: 10 reviews\n• 1-star: 10 reviews\n5-stars is the most frequent rating (plurality with 35%), but 65% of users did NOT give 5 stars! Plurality (mode) is NOT majority (> 50%).",
      codeOrContract: "Plurality: Max(Count(Category))\nMajority: Count(Category) > Total / 2\nTruth: Plurality does NOT imply Majority"
    }
  ],
  checklist: [
    "Have I tested my logic on an empty or minimal input (N = 0, N = 1)?",
    "Did I test an input where all elements are identical (e.g., [7, 7, 7, 7])?",
    "Did I test an input sorted in reverse order?",
    "If using a greedy rule ('pick largest/smallest'), have I constructed a test case where the first greedy choice blocks a better combination later?",
    "Have I manually traced state transitions on paper using a 4-row execution table?"
  ],
  practiceTask: {
    id: "task-05-knapsack-packing-disproof",
    title: "Hands-on Practice: Disproving the Greedy Warehouse Box Packer",
    scenario: "A shipping warehouse packs items into standardized containers with a maximum weight capacity of 10 kilograms. A logistics analyst proposes the 'Heaviest-First Greedy Rule' to minimize the number of containers used: 'Sort all unpacked items by weight descending. Take the heaviest unpacked item and put it in the current container. If it doesn't fit, seal the container and open a new one.'",
    prompt: "Construct a minimal, undeniable concrete counterexample that proves the Heaviest-First Greedy Rule does NOT always minimize the number of containers. Your counterexample must: (1) Use at most 5 items. (2) Show the exact containers produced by the Greedy rule. (3) Show an optimal container packing that uses fewer containers.",
    starterTemplate: "1. COUNTEREXAMPLE ITEM WEIGHTS (Max Container Capacity = 10 kg):\nItems: [List weights]\n\n2. GREEDY PACKING EXECUTION:\n• Container 1:\n• Container 2:\n• Total Greedy Containers:\n\n3. OPTIMAL PACKING EXECUTION:\n• Container 1:\n• Container 2:\n• Total Optimal Containers:\n\n4. MATHEMATICAL EXPLANATION OF WHY GREEDY FAILED:\n[Explain the structural trap]",
    modelSolution: "1. COUNTEREXAMPLE ITEM WEIGHTS (Max Container Capacity = 10 kg):\nItems = [6 kg, 5 kg, 5 kg, 4 kg] (Total: 4 items, sum = 20 kg)\n\n2. GREEDY PACKING EXECUTION (Heaviest-First):\n• Sort items descending: [6, 5, 5, 4]\n• Container 1: Pack 6 kg. (Remaining space: 4 kg). Next item is 5 kg (doesn't fit in 4 kg). Close Container 1.\n• Container 2: Pack 5 kg. (Remaining space: 5 kg). Next item is 5 kg (fits exactly!). (Remaining space: 0 kg). Close Container 2.\n• Container 3: Pack remaining 4 kg.\n• Total Greedy Containers = 3 containers!\n\n3. OPTIMAL PACKING EXECUTION:\n• Container 1: Pack [6 kg, 4 kg] = 10 kg (Exact fit!).\n• Container 2: Pack [5 kg, 5 kg] = 10 kg (Exact fit!).\n• Total Optimal Containers = 2 containers!\n\n4. MATHEMATICAL EXPLANATION OF WHY GREEDY FAILED:\nBy greedily committing the 6 kg item to Container 1 and immediately evaluating the next heaviest item (5 kg), greedy rejected the 5 kg item and abandoned Container 1 with 4 kg of wasted dead space. It failed to pair the 6 kg item with its perfect modular complement (4 kg), which cascaded into needing an unnecessary 3rd container.",
    rubric: [
      "Used a small, verifiable set of items (<= 5 items)",
      "Strictly respected the 10 kg container weight limit",
      "Correctly simulated the step-by-step execution of the Heaviest-First greedy rule",
      "Demonstrated an optimal packing that uses strictly fewer containers (e.g. 2 vs 3)",
      "Articulated the mathematical cause (greedy fragmentation / complementary pairing failure)"
    ]
  },
  questions: [
    {
      question_id: "m5q01",
      sort_order: 1,
      title: "Popperian Falsification in Engineering",
      prompt: "Why do master engineers actively search for counterexamples rather than creating examples that succeed?",
      options: [
        "Because confirming examples prove that software will never crash under any circumstances.",
        "Because confirming examples only show that a hypothesis works under specific favorable conditions, whereas a single counterexample reveals the exact boundary where the logic fails.",
        "Because counterexamples can be sold on the stock market for a profit.",
        "Because searching for counterexamples makes code run 10x faster automatically."
      ],
      hints: [
        "What happens when you only test what you expect to work?",
        "Karl Popper's principle: science advances by falsification.",
        "Finding flaws before production prevents outages."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "Confirming examples suffer from confirmation bias—they only test cases the engineer already thought of. Searching for counterexamples actively tests the perimeter of the problem to find unhandled edge conditions before deployment.",
      option_explanations: [
        "Incorrect: Confirming examples do not prove absence of defects (Dijkstra's dictum).",
        "Correct: Accurately articulates the principle of falsification: counterexamples locate the failure boundary.",
        "Incorrect: Absurd commercial claim.",
        "Incorrect: Counterexamples improve logical correctness, not runtime execution speed."
      ]
    },
    {
      question_id: "m5q02",
      sort_order: 2,
      title: "Disproving the 'Early Start' Meeting Heuristic",
      prompt: "A developer suggests: 'To maximize the number of meetings in a room, always pick the meeting that starts earliest.' Which counterexample disproves this rule?",
      options: [
        "Meeting A: [08:00 - 09:00], Meeting B: [09:00 - 10:00].",
        "Meeting A: [08:00 - 18:00] (All day). Meeting B: [09:00 - 10:00], Meeting C: [10:00 - 11:00].",
        "Meeting A: [12:00 - 13:00], Meeting B: [14:00 - 15:00].",
        "Meeting A: [10:00 - 11:00], Meeting B: [10:00 - 11:00]."
      ],
      hints: [
        "Can a meeting start super early but last all day?",
        "If you pick the earliest meeting, does it block many short meetings?",
        "Look at Meeting A running from 08:00 to 18:00."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "In Option B, Meeting A starts earliest (08:00), so the greedy rule picks it. But A runs until 18:00, blocking all other meetings and yielding a total of 1 meeting. Rejecting A allows scheduling both B and C (total of 2 meetings). The rule is disproven.",
      option_explanations: [
        "Incorrect: In this case, picking A (08:00) still allows picking B (09:00), so it does not disprove the rule.",
        "Correct: An all-day meeting starting at 08:00 blocks multiple shorter meetings, proving earliest-start is sub-optimal.",
        "Incorrect: Both meetings can be scheduled without conflict.",
        "Incorrect: Two identical meetings; does not demonstrate the blocking duration anomaly."
      ]
    },
    {
      question_id: "m5q03",
      sort_order: 3,
      title: "The Identity and Minimal Degenerate Test",
      prompt: "You are testing a function that calculates the greatest common divisor (GCD) of a list of positive integers. Which test case represents the most critical minimal degenerate check?",
      options: [
        "A list of 500 random prime numbers.",
        "A single-element list `[7]` or a list containing `[1, 100]`.",
        "A list of all even numbers from 2 to 200.",
        "A list of numbers formatted as text strings."
      ],
      hints: [
        "What is the identity element of multiplication and division? (1).",
        "What happens when the list has only 1 element?",
        "Trivial cases test the base invariant."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "Testing a singleton list `[7]` (GCD should be 7) and a list with 1 `[1, 100]` (GCD must collapse to 1) tests the identity boundaries of the mathematical domain. If degenerate cases fail, complex cases are irrelevant.",
      option_explanations: [
        "Incorrect: 500 primes is an unnecessarily large test case that overwhelms manual verification.",
        "Correct: The singleton `[7]` and identity element `[1, 100]` test the foundational lower-bound invariants.",
        "Incorrect: Even numbers represent an easy happy-path with GCD = 2.",
        "Incorrect: String formatting violates the input type specification."
      ]
    },
    {
      question_id: "m5q04",
      sort_order: 4,
      title: "Constructing the Sandwich Trap",
      prompt: "When attempting to disprove a greedy algorithm that always chooses the locally cheapest connection between network routers, what structure should you create?",
      options: [
        "A network where every router has the exact same connection cost.",
        "A network where taking a slightly cheaper initial link ($1) forces the path through an astronomically expensive bottleneck ($1000) later, while a slightly higher initial link ($3) leads to zero-cost links thereafter.",
        "A network with no connections at all.",
        "A circular network with 100 identical routers."
      ],
      hints: [
        "The Sandwich Trap lures the greedy choice with a cheap initial bait.",
        "$1 now -> $1000 later vs $3 now -> $0 later.",
        "Local optimum leading to catastrophic global penalty."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "This is the classic 'Sandwich Trap' counterexample structure: entice the greedy rule with an immediate tiny cost ($1), which forces it into a massive subsequent cost ($1000). The global path of ($3 + $0 = $3) proves the greedy choice was a trap.",
      option_explanations: [
        "Incorrect: Identical costs cannot expose cost differentiation failures.",
        "Correct: Beautifully articulates the Sandwich Trap structure that mathematically disproves naive greedy shortest-path heuristics without global sight.",
        "Incorrect: A disconnected graph tests null reachability, not greedy optimization.",
        "Incorrect: Symmetrical graphs fail to expose asymmetric local-vs-global trade-offs."
      ]
    },
    {
      question_id: "m5q05",
      sort_order: 5,
      title: "The All-Identical Elements Adversary",
      prompt: "A quicksort partitioning logic works on every test array of random numbers, but crashes with a Stack Overflow error on production servers. What pathological test case did the developer forget to run?",
      options: [
        "An array containing Roman numerals.",
        "An array where every single element is identical (e.g., `[5, 5, 5, 5, 5, 5]`), which degrades naive partitioning into O(N^2) recursive depth.",
        "An array containing numbers written in French.",
        "An array stored on a USB flash drive."
      ],
      hints: [
        "What happens to pivot partitioning when all numbers are equal?",
        "Do elements get split evenly 50/50, or does one side get N-1 elements?",
        "Duplicate value saturation is a legendary pathological edge case."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "An array of all-identical elements is a classic adversarial input. If partitioning does not handle duplicate values symmetrically (e.g. Dutch National Flag three-way partitioning), the recursion degrades from O(N log N) to O(N^2) depth, blowing the call stack.",
      option_explanations: [
        "Incorrect: Irrelevant string representation.",
        "Correct: An array of identical values breaks unbalanced two-way partition schemes, triggering maximum recursive stack depth.",
        "Incorrect: Language localization has nothing to do with algorithmic partitioning.",
        "Incorrect: Physical storage media does not alter recursive depth."
      ]
    },
    {
      question_id: "m5q06",
      sort_order: 6,
      title: "Synthesizing a Rigorous Example Set",
      prompt: "You are handed a specification: 'Given a list of customer account balances, return whether the balances are strictly increasing.' Which set of 4 test cases provides the most comprehensive mathematical verification?",
      options: [
        "`[1, 2, 3]`, `[2, 3, 4]`, `[3, 4, 5]`, `[4, 5, 6]`.",
        "Case 1 (Standard True): `[10, 20, 30]`. Case 2 (Strict Equality Trap - False): `[10, 20, 20, 30]`. Case 3 (Reverse Drop - False): `[30, 20, 10]`. Case 4 (Degenerate Singleton - True): `[15]`.",
        "`[100]`, `[200]`, `[300]`, `[400]`.",
        "`[-1]`, `[-2]`, `[-3]`, `[-4]`."
      ],
      hints: [
        "Look for the distinction between 'strictly increasing' (a < b) and 'non-decreasing' (a <= b).",
        "Does `[10, 20, 20, 30]` return True or False for 'strictly increasing'?",
        "A good test set includes standard positive, equality trap, inversion, and minimal singleton."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "Option B provides complete orthogonal coverage: Case 1 confirms baseline behavior; Case 2 tests the critical 'strictly increasing' vs 'non-decreasing' boundary (duplicate values must evaluate to False); Case 3 tests decreasing inversion; Case 4 verifies the singleton boundary condition.",
      option_explanations: [
        "Incorrect: All 4 test cases are structurally identical happy paths that test the exact same condition.",
        "Correct: Flawless Triad suite covering baseline, duplicate equality trap, reverse inversion, and singleton boundary.",
        "Incorrect: Four singletons that provide zero coverage of multi-element ordering.",
        "Incorrect: All 4 are strictly decreasing; provides zero positive verification coverage."
      ]
    }
  ]
};
