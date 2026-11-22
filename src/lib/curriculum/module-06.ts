import type { ModuleCurriculum } from "./types";

export const module06: ModuleCurriculum = {
  moduleNumber: 6,
  stageNumber: 1,
  stageTitle: "STAGE 01 · READ & DEFINE THE PROBLEM",
  title: "Discover Edge Cases Before Solving",
  objective: "Systematically map the perimeter of a problem space—nullity, singletons, extremes, sign flips, duplicate saturation, and fencepost disconnects—before designing solution logic.",
  readTime: "24 min deep read",
  coreFocus: "Boundary Value Analysis · The 7 Boundary Archetypes · Fencepost Disconnects · Zero/Null Handling",
  sections: [
    {
      kicker: "SECTION 01 · THE PERIMETER OF REALITY",
      title: "Why 95% of Software Bugs Live on the Boundaries",
      content: [
        "In mathematics and computer science, logic almost never fails in the middle of a domain. If a formula works for 14, it will almost certainly work for 15, 16, and 17.",
        "Disasters happen exclusively at the boundaries of the domain: when a collection has 0 elements, when a denominator is 0, when an integer flips from 2,147,483,647 to -2,147,483,648, or when two events occur at the exact same microsecond.",
        "Novices write logic for the average case and then frantically patch edge cases as they fail. Master problem solvers discover and catalogue all edge cases upfront: they build the fence around the perimeter before laying a single brick inside."
      ],
      callout: {
        type: "rule",
        title: "The Law of the Boundary Perimeter",
        text: "If your solution does not explicitly account for the minimum bound, the maximum bound, and the empty state, your solution is incomplete by definition."
      }
    },
    {
      kicker: "SECTION 02 · THE 7 BOUNDARY ARCHETYPES",
      title: "The Universal Edge Case Taxonomy",
      content: [
        "Before solving any problem, systematically interrogate your inputs across the 7 Boundary Archetypes:",
        "1. The Void (Zero / Empty / Null): What happens if the array is empty `[]`? What if the string is empty `\"\"`? What if a value is 0?",
        "2. The Singleton (Minimal Non-Empty): What happens if there is exactly 1 element `[42]`? Can it be compared to a neighbor?",
        "3. The Maximum Extreme ($N_{max}$): What happens at the upper limit of the input size (e.g., 100,000 items)? Does memory or time explode?",
        "4. Polarity Inversion (Sign Flips): What happens if numbers are negative? All negative? Mixed positive and negative? Negative zero?",
        "5. Saturation & Uniformity (All-Identical): What happens if every element in the dataset is identical `[5, 5, 5, 5]`?",
        "6. Monotonic Extremes (Pre-Sorted vs Reverse): What happens if the data is already perfectly sorted, or sorted in exact reverse order?",
        "7. The Fencepost (Off-by-One Disconnect): Are you counting intervals (spaces between posts) or the fenceposts themselves? N posts create N - 1 intervals!"
      ],
      callout: {
        type: "warning",
        title: "The Classic Fencepost Error",
        text: "If you build a 100-meter straight fence with posts spaced 10 meters apart, you need 11 posts, NOT 10! Confusing points with intervals is the single most common off-by-one bug in engineering."
      }
    },
    {
      kicker: "SECTION 03 · THE BOUNDARY STRESS PROTOCOL",
      title: "Walking the Perimeter Step-by-Step",
      content: [
        "To execute the Boundary Stress Protocol:",
        "Step 1: Write down the stated range for every variable (e.g., $0 ≤ K ≤ 10^9$).",
        "Step 2: Circle the absolute lowest value ($K = 0$) and lowest + 1 ($K = 1$).",
        "Step 3: Circle the absolute highest value ($K = 10^9$) and highest - 1.",
        "Step 4: Test your mental logic on these circled values before anything else.",
        "If your mental model handles the extremes, the interior points will take care of themselves."
      ]
    },
    {
      kicker: "SECTION 04 · THE EDGE CASE RANKING MATRIX",
      title: "Prioritizing Boundary Vulnerabilities",
      content: [
        "Not all edge cases are equally dangerous. Rank them into two categories:",
        "• Fatal Edge Cases: Inputs that cause division by zero, null reference dereferencing, infinite loops, or integer overflow. These must have fast-fail guards.",
        "• Semantic Edge Cases: Inputs where the result is mathematically valid but counter-intuitive (e.g., 'Is an empty string a palindrome? Yes, trivially.'). These must have explicit specification rules."
      ],
      callout: {
        type: "tip",
        title: "The Vacuous Truth Principle",
        text: "In formal logic, a statement about 'all elements in set S' is automatically True if set S is empty! (e.g., 'All unicorns in this room are pink' is True because there are zero unicorns). Be conscious of vacuous truths."
      }
    }
  ],
  caseStudies: [
    {
      tag: "CASE STUDY A · AUTONOMOUS VEHICLE MERGE",
      title: "The Self-Driving Lane Merge Deadlock",
      problem: "Two autonomous vehicles approach a highway lane merge from adjacent lanes. The collision avoidance logic states: 'The vehicle with the higher speed proceeds first; if speeds are equal, the vehicle on the right proceeds.' At 60 mph, both cars arrive at the exact same longitudinal coordinate with identical speeds on a symmetrical split.",
      flawedApproach: "Relying on sensor speed measurements without defining an absolute, non-physical tie-breaker, causing both cars to yield simultaneously (deadlock) or accelerate simultaneously (collision).",
      correctInvariant: "Boundary Edge Case: Speed_1 == Speed_2 AND Distance_1 == Distance_2.\nResolution: Introduce a deterministic digital tie-breaker that cannot be identical (e.g., Vehicle MAC Address or numerical Vehicle VIN).",
      codeOrContract: "Edge Case: Speed_A == Speed_B ∧ Dist_A == Dist_B\nResolution: Priority = (Speed DESC, Dist ASC, VIN ASC)"
    },
    {
      tag: "CASE STUDY B · FINANCIAL MARKET CIRCUIT BREAKER",
      title: "The Zero-Volume Flash Freeze",
      problem: "A stock exchange regulatory engine halts trading if a stock drops more than 10% compared to its opening price: `DropPct = (OpenPrice - CurrentPrice) / OpenPrice`. On an illiquid penny stock, a reverse stock split occurs and the opening price is recorded as $0.00.",
      flawedApproach: "Executing the formula directly, causing a fatal Division by Zero hardware exception that crashes the exchange matching engine.",
      correctInvariant: "Boundary Edge Case: `OpenPrice <= 0.00`.\nResolution: Guard condition: If OpenPrice ≤ 0, bypass percentage drop calculation and trigger manual compliance review.",
      codeOrContract: "Edge Case: OpenPrice == 0.00\nFatal Trap: Division by Zero\nInvariant Guard: If OpenPrice ≤ 0 -> Return INVALID_REFERENCE_PRICE"
    },
    {
      tag: "CASE STUDY C · CELL TOWER HANDOVER",
      title: "The Border Ping-Pong Telecommunication Glitch",
      problem: "A mobile phone moves along a highway between two cellular towers (Tower Alpha and Tower Beta). The phone switches connection to whichever tower has the stronger signal: `If Signal(Beta) > Signal(Alpha) -> Connect(Beta)`.",
      flawedApproach: "When the phone is at the exact midpoint, micro-fluctuations in atmospheric signal cause the phone to switch between Alpha and Beta 50 times per second, dropping the call.",
      correctInvariant: "Boundary Edge Case: `Signal(Beta) ≈ Signal(Alpha)`.\nResolution: Hysteresis Boundary Invariant: Only switch towers if `Signal(Beta) > Signal(Alpha) + Threshold_Margin` for at least 3 consecutive seconds.",
      codeOrContract: "Edge Case: Rapid oscillation at equality boundary\nResolution: Hysteresis margin (Delta > epsilon for duration tau)"
    }
  ],
  checklist: [
    "What happens when the input collection is completely empty (N = 0)?",
    "What happens when the input contains exactly one item (N = 1)?",
    "Can values be zero, negative, or equal to the maximum possible integer?",
    "What happens when every single item in the input is identical?",
    "Am I confusing the number of points with the number of intervals (Fencepost Error)?"
  ],
  practiceTask: {
    id: "task-06-smart-hvac-boundaries",
    title: "Hands-on Practice: The Smart Building HVAC Boundary Stress Test",
    scenario: "An environmental control unit in a smart hospital regulates heating and air conditioning. The unit receives: current room temperature $T$ (degrees Celsius), target temperature $T_{target}$, room occupancy count $O$ (non-negative integer), and sensor battery level $B$ (percentage 0 to 100). The heater turns on if $T < T_{target} - 1.0$ and $O > 0$. The AC turns on if $T > T_{target} + 1.0$ and $O > 0$. If $O == 0$, energy-saving mode applies wider thresholds ($T_{target} \pm 4.0$).",
    prompt: "Without writing code, construct a comprehensive Boundary Edge-Case Analysis: (1) Identify at least 5 critical boundary edge cases that could cause freezing, heat exhaustion, equipment burnout, or software failure. (2) For each edge case, formulate the exact safe deterministic behavior.",
    starterTemplate: "1. BOUNDARY SCENARIO 1 (Sensor Void/Fault):\n• Condition:\n• Expected Safe Invariant:\n\n2. BOUNDARY SCENARIO 2 (Extreme Environmental Value):\n• Condition:\n• Expected Safe Invariant:\n\n3. BOUNDARY SCENARIO 3 (Occupancy Boundary):\n• Condition:\n• Expected Safe Invariant:\n\n4. BOUNDARY SCENARIO 4 (Deadband Hysteresis Boundary):\n• Condition:\n• Expected Safe Invariant:\n\n5. BOUNDARY SCENARIO 5 (Battery Exhaustion):\n• Condition:\n• Expected Safe Invariant:",
    modelSolution: "1. BOUNDARY SCENARIO 1 (Sensor Disconnect / Null):\n• Condition: Temperature reading $T$ is Null, NaN, or disconnected.\n• Expected Safe Invariant: Never assume $T = 0°C$ (which would blast the heater). Trigger immediate fail-safe lock: maintain neutral ventilation, log hardware alert, and alert maintenance.\n\n2. BOUNDARY SCENARIO 2 (Extreme Sensor Values):\n• Condition: $T < -20°C$ or $T > 60°C$ (indicates sensor fire or catastrophic freeze).\n• Expected Safe Invariant: If $T > 60°C$, trigger emergency fire protocol (shut off ventilation fans to prevent smoke spread). Do not treat as normal AC demand.\n\n3. BOUNDARY SCENARIO 3 (Occupancy Zero-to-One Transition Boundary):\n• Condition: $O$ transitions from 0 to 1 while $T$ is in the intermediate energy-saver band ($T_{target} + 2.0°C$).\n• Expected Safe Invariant: Immediately shift to tight comfort band ($T_{target} \pm 1.0°C$). Because $T > T_{target} + 1.0$, immediately engage cooling without delay.\n\n4. BOUNDARY SCENARIO 4 (Equivalence Deadband Oscillation):\n• Condition: Temperature hovers at exactly $T_{target} - 1.0001°C$ and $T_{target} - 0.9999°C$.\n• Expected Safe Invariant: Implement 5-minute compressor anti-cycling lock to prevent relay destruction from rapid on/off toggling.\n\n5. BOUNDARY SCENARIO 5 (Battery Level $B = 0\%$):\n• Condition: Sensor battery hits 0%.\n• Expected Safe Invariant: Revert to mechanical default safety comfort setting (e.g. 21°C fixed baseline), never shut off life-critical hospital climate control.",
    rubric: [
      "Identified null/disconnected sensor failure mode",
      "Addressed extreme temperature outliers (fire/catastrophic freeze)",
      "Addressed occupancy transition boundaries",
      "Addressed rapid cycling / hysteresis boundary protection",
      "Addressed battery depletion fail-safe invariant"
    ]
  },
  questions: [
    {
      question_id: "m6q01",
      sort_order: 1,
      title: "The Classic Fencepost Off-by-One",
      prompt: "A project manager states: 'We need to place mile-marker signs along a 10-mile highway stretch, placing a sign at mile 0 and every 1 mile thereafter up to mile 10.' How many signs are required?",
      options: [
        "10 signs, because 10 / 1 = 10.",
        "11 signs, because a sequence from 0 to 10 inclusive contains (10 - 0) + 1 = 11 points.",
        "9 signs, because you don't count the ends.",
        "12 signs, because highways have two directions."
      ],
      hints: [
        "Count them out on your fingers: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10.",
        "How many numbers are in that sequence?",
        "Inclusive ranges [Start, End] have cardinality: (End - Start) + 1."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "This is the classic Fencepost Error. An interval of 10 units divided into 1-unit spans has 10 segments, but 11 boundary points: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10. For any inclusive discrete range [A, B], the count of elements is (B - A) + 1.",
      option_explanations: [
        "Incorrect: Commits the classic fencepost mistake of counting intervals instead of posts.",
        "Correct: (10 - 0) + 1 = 11 signs. Accurately accounts for both endpoints.",
        "Incorrect: Omits endpoints entirely.",
        "Incorrect: Inventing highway directionality is narrative distraction."
      ]
    },
    {
      question_id: "m6q02",
      sort_order: 2,
      title: "The Division by Zero Pole",
      prompt: "A rating formula computes: `Score = TotalUpvotes / (TotalUpvotes + TotalDownvotes)`. For a newly posted article with zero votes, what does a naive implementation evaluate to?",
      options: [
        "Score = 0.50 (neutral).",
        "A fatal Division by Zero exception (0 / 0), crashing the thread.",
        "Score = 1.0 (perfect).",
        "Score = 0.0."
      ],
      hints: [
        "When an article has 0 upvotes and 0 downvotes, what is TotalUpvotes + TotalDownvotes?",
        "0 / 0 is undefined in mathematics.",
        "Zero denominator check is a mandatory boundary guard."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "When an article has 0 upvotes and 0 downvotes, the denominator (0 + 0) equals 0. Evaluating 0 / 0 triggers a fatal divide-by-zero error or produces `NaN`. A boundary guard must intercept zero total votes and return a default (e.g. 0.0 or neutral).",
      option_explanations: [
        "Incorrect: 0.50 is what a sensible engineer might define as a default, but naive evaluation crashes with 0/0.",
        "Correct: Identifies the fatal mathematical singularity at 0 / 0.",
        "Incorrect: 0 / 0 cannot evaluate to 1.0.",
        "Incorrect: 0 / 0 is mathematically undefined, not 0.0."
      ]
    },
    {
      question_id: "m6q03",
      sort_order: 3,
      title: "Empty Collection Vacuous Truth",
      prompt: "A contract asks: 'Return True if all numbers in list L are even.' What is the mathematically correct return value when L is an empty list `[]`?",
      options: [
        "False, because there are no numbers in the list.",
        "True, because by the principle of Vacuous Truth, there does not exist any counterexample in L that is odd.",
        "Null / Error, because empty lists cannot be evaluated.",
        "50%, because it's a probability."
      ],
      hints: [
        "To prove 'all elements are even' is False, you must find at least one odd element in L.",
        "Can you find an odd element in an empty list?",
        "If no counterexample exists, the universal quantifier $\\forall x \\in \\emptyset$ is vacuously True."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "In formal logic, a universal quantification $\\forall x \\in S: P(x)$ is vacuously True when S is the empty set $\\emptyset$, because there exists no element in S that falsifies $P(x)$. Unless the specification adds a non-empty precondition, the answer is True.",
      option_explanations: [
        "Incorrect: Intuitively tempting to novices, but mathematically wrong under universal quantification.",
        "Correct: Formulates the foundational mathematical law of Vacuous Truth over empty domains.",
        "Incorrect: Universal quantification is well-defined over empty sets.",
        "Incorrect: Deterministic boolean logic has no concept of 50% probability."
      ]
    },
    {
      question_id: "m6q04",
      sort_order: 4,
      title: "Integer Sign Overflow Boundary",
      prompt: "In a 32-bit signed two's complement integer system, the valid range is `[-2,147,483,648 to 2,147,483,647]`. What happens if you attempt to calculate the absolute value `abs(x)` when `x = -2,147,483,648`?",
      options: [
        "It returns 2,147,483,648 with zero issues.",
        "It overflows back to -2,147,483,648 because positive 2,147,483,648 cannot be represented in a 32-bit signed integer register!",
        "It rounds down to zero.",
        "It converts into a string."
      ],
      hints: [
        "Notice the asymmetry: negative side has -2,147,483,648, but positive side only goes up to 2,147,483,647.",
        "What is +2,147,483,648 in binary?",
        "Two's complement asymmetry is a legendary hardware edge case."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "In two's complement arithmetic, the range is asymmetric: the negative magnitude is 1 greater than the positive magnitude. $+2,147,483,648$ does not fit in a 32-bit signed integer. Attempting `abs(-2,147,483,648)` produces an overflow that wraps straight back to the negative number itself!",
      option_explanations: [
        "Incorrect: $+2,147,483,648$ cannot fit in a 32-bit signed integer.",
        "Correct: Highlights the legendary two's complement asymmetry edge case that has caused real-world security vulnerabilities.",
        "Incorrect: Arithmetic registers do not round down to zero on overflow.",
        "Incorrect: Hardware integer registers cannot change their type to strings."
      ]
    },
    {
      question_id: "m6q05",
      sort_order: 5,
      title: "Duplicate Value Saturation",
      prompt: "A function is asked to 'Partition an array of numbers so all numbers smaller than the pivot are on the left, and all numbers larger are on the right.' The developer chooses the first element as the pivot and tests on `[5, 5, 5, 5, 5]`. What boundary vulnerability is exposed?",
      options: [
        "The computer will catch fire.",
        "If the comparison uses strict `<` and `>`, equal elements are unhandled, leading to infinite loops, index out-of-bounds, or wildly lopsided O(N^2) partitioning.",
        "The array will sort itself in reverse order.",
        "The numbers will multiply together."
      ],
      hints: [
        "Is 5 smaller than 5? No.",
        "Is 5 larger than 5? No.",
        "Where do the equal elements go?",
        "Equality handling in partitioning is critical."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "Duplicate saturation exposes whether comparison operators gracefully handle equality. In naive quicksort or binary search implementations, failing to account for elements equal to the pivot causes pointers to never advance or creates degenerate recursive branches.",
      option_explanations: [
        "Incorrect: Hyperbolic nonsense.",
        "Correct: Identifies the failure of strict inequality when handling duplicate value saturation.",
        "Incorrect: It does not reverse; it deadlocks or degenerates.",
        "Incorrect: Partitioning reorders; it does not multiply."
      ]
    },
    {
      question_id: "m6q06",
      sort_order: 6,
      title: "Synthesizing a Boundary Test Matrix",
      prompt: "You are designing the test matrix for a function `calculate_discount(cart_total: Float, coupon_code: String)`. Which set of edge cases comprehensively covers the boundary perimeter?",
      options: [
        "`cart_total = 100`, `coupon_code = 'SAVE10'` (standard case only).",
        "Boundary 1: `cart_total = 0.00` (empty cart). Boundary 2: `cart_total < 0.00` (negative invalid). Boundary 3: `coupon_code = ''` (empty code). Boundary 4: `coupon_code = null`. Boundary 5: `cart_total = 10,000,000.00` (extreme order).",
        "`cart_total = 1`, `cart_total = 2`, `cart_total = 3`.",
        "`coupon_code = 'A'`, `coupon_code = 'B'`, `coupon_code = 'C'`."
      ],
      hints: [
        "Look for the suite that tests zero, negative, empty string, null, and large values.",
        "Testing $1, $2, $3 only tests interior positive points.",
        "Option B tests every dimensional boundary pole."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "Option B provides complete boundary coverage: tests zero total, negative total (domain violation), empty string code, null code, and massive scale. Any implementation passing these boundaries is structurally robust.",
      option_explanations: [
        "Incorrect: Only tests a single happy-path case; zero boundary coverage.",
        "Correct: Comprehensively covers the perimeter across zero, negative, empty string, null, and extreme values.",
        "Incorrect: Only tests trivial small positive integers.",
        "Incorrect: Only tests single-letter strings."
      ]
    }
  ]
};
