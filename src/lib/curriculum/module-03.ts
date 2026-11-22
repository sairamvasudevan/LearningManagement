import type { ModuleCurriculum } from "./types";

export const module03: ModuleCurriculum = {
  moduleNumber: 3,
  stageNumber: 1,
  stageTitle: "STAGE 01 · READ & DEFINE THE PROBLEM",
  title: "Extract Constraints and Limits",
  objective: "Uncover explicit and implicit bounds—size limits, value ranges, uniqueness rules, ordering guarantees, and resource restrictions—that dictate what solutions are mathematically viable.",
  readTime: "23 min deep read",
  coreFocus: "Boundary Envelope · Explicit vs Implicit Bounds · Extreme Limits · Resource Budgets",
  sections: [
    {
      kicker: "SECTION 01 · THE SOLUTION ENVELOPE",
      title: "Constraints Define the Problem Space",
      content: [
        "In naive problem solving, people treat constraints as annoying footnotes at the bottom of a problem statement.",
        "In master-level engineering, constraints are the single most important element of the problem: they define the boundary envelope of reality.",
        "A task like 'Find the closest pair of points' is completely trivial if N = 10. If N = 10^7 and coordinates are floating-point numbers on a sphere, it requires completely different mathematical reasoning. If coordinates are integers in [0, 100], it collapses into a discrete pigeonhole problem.",
        "Without knowing the exact constraints, it is mathematically impossible to evaluate whether a solution is valid, optimal, or catastrophically flawed."
      ],
      callout: {
        type: "rule",
        title: "The Law of Constraint Supremacy",
        text: "The constraints dictate the algorithm, not the other way around. Never choose an approach until you have established the upper and lower bounds of all input parameters."
      }
    },
    {
      kicker: "SECTION 02 · THE 5 CONSTRAINT DIMENSIONS",
      title: "The Universal Five-Axis Constraint Taxonomy",
      content: [
        "Every constraint falls into one of 5 universal dimensions:",
        "1. Cardinality (Size) Bounds: What is the minimum and maximum number of elements? Can N = 0 (empty)? Can N = 1 (singleton)? What is N_max (10^3? 10^9?)?",
        "2. Value Range Bounds: What is the domain of individual elements? Can values be negative? Can they be zero? Are they bounded within [1, 100] or can they exceed 64-bit integer limits?",
        "3. Uniqueness & Multiplicity: Are elements strictly unique (distinct set), or can duplicate values exist? What does a duplicate mean in this domain?",
        "4. Structural & Ordering Invariants: Are inputs guaranteed to be sorted? Non-decreasing? Random? Are cycles possible in graph-like data?",
        "5. Resource & Operational Budgets: What are the strict operational limits? Is there a memory cap? A latency threshold? A maximum number of state comparisons permitted?"
      ],
      callout: {
        type: "warning",
        title: "The Deadly Danger of Implicit Assumptions",
        text: "The most dangerous bugs in engineering history (including the Ariane 5 rocket explosion and the Therac-25 accidents) were caused by implicit assumptions: assuming a number would never be negative, or assuming an integer would never exceed 32,767."
      }
    },
    {
      kicker: "SECTION 03 · EXPLICIT VS. IMPLICIT CONSTRAINTS",
      title: "Hunting for Hidden Real-World Restrictions",
      content: [
        "Constraints arrive in two forms:",
        "• Explicit Constraints: Directly printed in the problem statement (e.g., '1 ≤ N ≤ 100,000' or 'All strings contain only lowercase English letters').",
        "• Implicit (Hidden) Constraints: Omitted by the author because they assume 'everyone knows this' based on domain knowledge. For example, if a problem mentions 'human age in years,' the implicit constraint is [0, 125]. If it mentions 'bank account transfer amounts,' the implicit constraint is positive numbers > $0.00.",
        "Master problem solvers interrogate every noun to surface implicit constraints before designing logic."
      ]
    },
    {
      kicker: "SECTION 04 · THE CONSTRAINT MATRIX",
      title: "The Structured Constraint Extraction Sheet",
      content: [
        "Before reasoning about a solution, fill out the 5-point Constraint Matrix:",
        "| Parameter | Min Value | Max Value | Can Be Null/Empty? | Duplicates Allowed? | Ordering Guaranteed? |",
        "Documenting these six columns converts vague intuition into an ironclad mathematical boundary box."
      ],
      callout: {
        type: "tip",
        title: "The Boundary Stress Test",
        text: "Always ask: 'What happens at N = 0, N = 1, and N = N_max?' If your mental model cannot gracefully handle these three extreme poles, your model has a boundary hole."
      }
    }
  ],
  caseStudies: [
    {
      tag: "CASE STUDY A · ELEVATOR BANK DISPATCH",
      title: "High-Rise Elevator Group Control",
      problem: "A 60-story skyscraper has 6 elevator cars. Each car has a mechanical weight limit of 1,200 kg and a passenger capacity of 14 people. A morning peak algorithm must assign incoming passengers waiting in the lobby to elevator cars. What are the inviolable hard constraints vs soft objectives?",
      flawedApproach: "Treating passenger wait time as the only metric and squeezing 18 people into Car 2 because it was ready to depart.",
      correctInvariant: "Hard Inviolable Constraints: Passenger count per car ≤ 14 AND Total estimated mass ≤ 1,200 kg. Soft Optimization Objective: Minimize average passenger wait time subject to the hard physical safety bounds.",
      codeOrContract: "Hard Constraints:\n∀ car c: Count(Passengers(c)) ≤ 14\n∀ car c: Sum(Weight(p) for p ∈ Passengers(c)) ≤ 1200 kg\nObjective: Min(Avg_Wait_Time) subject to Hard Constraints"
    },
    {
      tag: "CASE STUDY B · SATELLITE TELEMETRY DOWNLINK",
      title: "Low Earth Orbit (LEO) Ground Station Pass",
      problem: "An Earth-observation satellite passes over a polar ground station for exactly 8 minutes (480 seconds). The radio link bandwidth is strictly capped at 25 megabytes per second. The satellite's onboard flash memory contains 18 gigabytes of uncompressed sensor data across 3 priority tiers (Critical, Scientific, Routine). What is the boundary constraint envelope?",
      flawedApproach: "Attempting to downlink all 18 GB of data, or transmitting files in simple FIFO order until the satellite goes over the horizon.",
      correctInvariant: "Max Downlink Capacity = 480 s × 25 MB/s = 12,000 MB (12 GB). Total storage (18 GB) strictly exceeds link capacity. Constraint requires selecting a subset of files whose sum ≤ 12 GB that maximizes priority value (a knapsack/greedy priority allocation envelope).",
      codeOrContract: "Capacity Cap: 12,000 MB\nSelection: Subset S of Files such that:\nSum(Size(f) for f ∈ S) ≤ 12,000 MB\nMaximizing Sum(Priority(f) for f ∈ S)"
    },
    {
      tag: "CASE STUDY C · IOT BATTERY-POWERED SENSOR",
      title: "Agricultural Soil Moisture Beacon",
      problem: "A solar-powered moisture probe in an olive grove has a micro-battery that permits at most 24 wireless radio transmissions per day before brownout. The farmer wants to be notified immediately if soil moisture drops below 15%. What is the temporal constraint?",
      flawedApproach: "Transmitting a status ping every 5 minutes (288 pings/day), draining the battery by noon and leaving the field unmonitored during the hottest afternoon hours.",
      correctInvariant: "Hard Daily Transmission Budget: Total pings ≤ 24. Rule: Suppress transmissions when moisture is stable; reserve transmissions for crossing the 15% threshold or periodic 1-hour heartbeats. Strict conservation constraint.",
      codeOrContract: "Energy Constraint: Count(Transmissions over 24h) ≤ 24\nInvariant: Immediate alert upon (Moisture < 15% ∧ Prior_Moisture ≥ 15%)"
    }
  ],
  checklist: [
    "Have I identified the explicit upper and lower bounds for all inputs (N_min, N_max)?",
    "Have I checked whether zero, negative numbers, or empty collections are valid inputs?",
    "Are duplicate items possible, and how does the specification treat them?",
    "Are inputs guaranteed to be in sorted or monotonic order, or can they arrive scrambled?",
    "Have I distinguished hard physical safety/capacity constraints from soft optimization preferences?"
  ],
  practiceTask: {
    id: "task-03-bullet-train-booking",
    title: "Hands-on Practice: The High-Speed Bullet Train Booking Constraints",
    scenario: "A high-speed rail corridor operates trains with 8 passenger coaches. Each coach has 72 seats arranged in rows of 4 (A, B aisle C, D). A family booking request arrives for K passengers. The booking platform must assign seats under strict operational rules: (1) All K passengers in a single reservation must be seated in the exact same coach. (2) If K ≤ 4, all passengers must be seated in the same row. (3) No passenger may be assigned an already reserved seat. (4) Total passengers in any coach can never exceed 72.",
    prompt: "Without writing code, construct the complete Constraint Specification Sheet: (1) List all Hard Physical/Safety Constraints. (2) List all Structural/Contiguity Constraints. (3) Formulate the boundary failure condition (when must the reservation be rejected immediately?).",
    starterTemplate: "1. HARD PHYSICAL & CAPACITY CONSTRAINTS:\n[List absolute capacity limits]\n\n2. STRUCTURAL & CONTIGUITY CONSTRAINTS:\n[List seating placement and arrangement rules]\n\n3. EXPLICIT PARAMETER BOUNDS:\n• Group Size K:\n• Coach Capacity:\n\n4. FAST REJECTION INVARIANTS:\n[Conditions under which the request is rejected with zero seat allocation]",
    modelSolution: "1. HARD PHYSICAL & CAPACITY CONSTRAINTS:\n• Single Coach Maximum: Current_Occupants(coach) + K ≤ 72 for any target coach.\n• Absolute Train Capacity: Total Train Occupants + K ≤ 576 (8 × 72).\n• Seat Collision Free: AssignedSeats ∩ AlreadyReservedSeats = ∅.\n\n2. STRUCTURAL & CONTIGUITY CONSTRAINTS:\n• Coach Monolithic Invariant: All K seats must share identical `coach_number`.\n• Row Contiguity Rule (if K ≤ 4): All K seats must share identical `row_number` within the selected coach.\n\n3. EXPLICIT PARAMETER BOUNDS:\n• K ∈ [1, 72] (Requests with K > 72 are physically impossible to seat in a single coach).\n• Coach ID ∈ [1, 8].\n• Row Number ∈ [1, 18]. Seat Letter ∈ {A, B, C, D}.\n\n4. FAST REJECTION INVARIANTS:\nReject reservation immediately if:\n• K ≤ 0 OR K > 72.\n• No single coach c ∈ [1, 8] has at least K unreserved seats.\n• (If K ≤ 4): No single row in any coach has at least K available seats.",
    rubric: [
      "Identified maximum coach capacity limit (72) and total train cap (576)",
      "Formalized the coach monolithic constraint (all K in same coach)",
      "Formalized row-level contiguity for K <= 4",
      "Defined explicit parameter range for K",
      "Specified fast-fail rejection conditions without attempting partial split reservations"
    ]
  },
  questions: [
    {
      question_id: "m3q01",
      sort_order: 1,
      title: "Cardinality Lower-Bound Trap",
      prompt: "A function is designed to find the second-highest number in an array. The developer tests it on arrays with 5, 10, and 100 elements, and it works flawlessly. In production, the system crashes on day 1. What missing constraint verification caused this catastrophe?",
      options: [
        "The developer forgot to check whether the computer's CPU was 64-bit.",
        "The developer failed to consider what happens when the array contains fewer than 2 elements (e.g., N = 0 or N = 1), where a 'second-highest' does not exist.",
        "The developer should have formatted the numbers as Roman numerals.",
        "The developer did not sort the numbers in reverse alphabetical order."
      ],
      hints: [
        "Can you have a second-highest element in a list containing only [42]?",
        "What happens when N is 0 or 1?",
        "Lower cardinality bounds are the #1 source of null pointer and out-of-bounds exceptions."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "A 'second-highest' element is mathematically undefined for sets of size N < 2. A rigorous constraint specification must establish N ≥ 2 as a precondition or define an explicit fallback return value (such as null/error).",
      option_explanations: [
        "Incorrect: CPU bit architecture has nothing to do with the mathematical boundary failure.",
        "Correct: Identifies the lower-bound cardinality failure when N < 2.",
        "Incorrect: Roman numeral formatting is absurd narrative noise.",
        "Incorrect: Sorting alphabetically makes no sense for numerical ranking."
      ]
    },
    {
      question_id: "m3q02",
      sort_order: 2,
      title: "Distinguishing Hard vs. Soft Constraints",
      prompt: "An algorithm schedules airline pilots to commercial flights. Which of the following is a Hard Physical/Legal Constraint rather than a Soft Preference?",
      options: [
        "Captain Miller prefers not to fly on Thursday mornings so he can play golf.",
        "Federal aviation regulations strictly mandate that a commercial pilot cannot exceed 8 flight hours in a rolling 24-hour window.",
        "First Officer Davis likes flights heading toward Miami because her sister lives there.",
        "The airline prefers to serve hot meals on flights lasting longer than 3 hours."
      ],
      hints: [
        "A Hard Constraint can NEVER be violated under any circumstances without illegality or physical impossibility.",
        "A Soft Preference is a nice-to-have optimization objective.",
        "Federal aviation safety limits are legal hard constraints."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "Federal aviation regulations regarding maximum flight hours are non-negotiable hard legal constraints. Violating them causes regulatory grounding and safety violations. Pilot personal schedules and meal preferences are soft preferences.",
      option_explanations: [
        "Incorrect: Personal golf schedule is a soft employee preference.",
        "Correct: Federal statutory flight hour limits are strict, non-negotiable hard constraints.",
        "Incorrect: Personal destination preference is a soft preference.",
        "Incorrect: Meal service policy is a commercial amenity, not a hard constraint."
      ]
    },
    {
      question_id: "m3q03",
      sort_order: 3,
      title: "Value Range and Numerical Overflow",
      prompt: "A system calculates the product of an array of 50 positive integers, where each integer is between 1 and 1,000,000. Why is this problem computationally intractable if constrained to standard 64-bit integer registers?",
      options: [
        "Because 50 is an even number, which causes floating-point roundoff errors.",
        "Because the maximum possible product is (10^6)^50 = 10^300, which vastly exceeds the maximum value a 64-bit unsigned integer can store (~1.8 × 10^19).",
        "Because computers cannot multiply numbers larger than 100 without a graphics card.",
        "Because positive integers cannot be multiplied in parallel."
      ],
      hints: [
        "What is the maximum value a 64-bit integer can hold? (Around 1.8 × 10^19).",
        "What is (1,000,000)^50?",
        "Value range constraints reveal when standard numerical types will overflow."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "Multiplying fifty numbers up to 10^6 yields numbers up to 10^300. Standard 64-bit integers cap out at ~1.8 × 10^19. Value range analysis immediately proves that arbitrary-precision arithmetic or logarithmic transformation is mandatory.",
      option_explanations: [
        "Incorrect: Parity of 50 has nothing to do with register overflow.",
        "Correct: Mathematical bounds analysis proves that 10^300 exponentially exceeds 64-bit register capacity (1.8 × 10^19).",
        "Incorrect: CPUs multiply numbers easily; the issue is register bit-width.",
        "Incorrect: Multiplication commutativity has nothing to do with overflow magnitude."
      ]
    },
    {
      question_id: "m3q04",
      sort_order: 4,
      title: "Uniqueness and Multiplicity Traps",
      prompt: "A problem states: 'Given a list of integer prices, find the two prices that sum to exactly $100.' The input array is `[50, 20, 80]`. Can `50` be paired with itself to make 100?",
      options: [
        "Yes, because 50 + 50 = 100.",
        "No, unless the number 50 appears at two distinct indices in the array, an element cannot be reused with itself.",
        "Yes, but only if the array is sorted in ascending order first.",
        "No, because prices can only be odd numbers."
      ],
      hints: [
        "Is there one 50 or two 50s in the collection?",
        "A single coin in your pocket cannot be spent twice in the same purchase.",
        "Distinct index constraint is a fundamental multiplicity rule."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "Unless explicitly permitted, 'two prices from a list' means two distinct elements at distinct indices (i ≠ j). With only one 50 at index 0, pairing it with itself is an invalid multiplicity violation.",
      option_explanations: [
        "Incorrect: Confuses the abstract arithmetic fact 50 + 50 = 100 with the physical presence of two distinct items in the list.",
        "Correct: An element cannot be paired with itself unless two distinct entries exist at different indices (i ≠ j).",
        "Incorrect: Sorting the array does not duplicate a single element.",
        "Incorrect: Prices can obviously be even or odd."
      ]
    },
    {
      question_id: "m3q05",
      sort_order: 5,
      title: "Monotonicity and Ordering Guarantees",
      prompt: "When searching for an item in a list of N elements, why is knowing whether the list is guaranteed to be sorted (monotonic) a game-changing constraint?",
      options: [
        "Because sorted lists take up half as much memory as unsorted lists.",
        "Because monotonicity allows eliminating half of the remaining search space at every step (binary search in O(log N)), whereas unsorted data requires inspecting every single element in the worst case (O(N)).",
        "Because unsorted lists can only be searched on full moons.",
        "Because sorted lists cannot contain prime numbers."
      ],
      hints: [
        "Think of a phone book vs a pile of scattered papers.",
        "Can you eliminate search space if elements have no order?",
        "Order invariant transforms the theoretical lower bound of search."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "Monotonicity (sorted order) provides a directional invariant: if Target > Middle, the target cannot exist in the lower half. This allows logarithmic elimination. Without this ordering constraint, any unseen element could be the target.",
      option_explanations: [
        "Incorrect: Sorted lists occupy the exact same memory as unsorted lists.",
        "Correct: Monotonicity provides the directional guarantee that enables logarithmic search space elimination.",
        "Incorrect: Pure superstition and narrative absurdity.",
        "Incorrect: Sorted lists can contain any numbers, including primes."
      ]
    },
    {
      question_id: "m3q06",
      sort_order: 6,
      title: "The Resource Budget Constraint",
      prompt: "A drone flight controller has a CPU that executes 1,000,000 instructions per second and must make an obstacle-avoidance calculation every 10 milliseconds (100 times per second). What is the hard instruction budget for each obstacle calculation cycle?",
      options: [
        "1,000,000 instructions.",
        "10,000 instructions.",
        "100 instructions.",
        "Unlimited instructions, because drones fly in three dimensions."
      ],
      hints: [
        "1 second = 1,000 milliseconds.",
        "In 10 ms (which is 1/100th of a second), how many instructions can a 1 MHz CPU execute?",
        "1,000,000 / 100 = ?"
      ],
      marks: 2,
      correct_index: 1,
      explanation: "At 1,000,000 instructions/sec, in a 10 ms window (0.01 sec), the CPU can execute at most 1,000,000 × 0.01 = 10,000 instructions. Any obstacle avoidance logic requiring more than 10,000 steps will cause the drone to miss its deadline and crash.",
      option_explanations: [
        "Incorrect: 1,000,000 is the budget for a whole second, not a 10 ms cycle.",
        "Correct: 1,000,000 instructions/sec × 0.01 seconds = 10,000 instructions per decision window.",
        "Incorrect: 100 is an arithmetic miscalculation by two orders of magnitude.",
        "Incorrect: Physical dimensions of flight do not remove microprocessor clock-cycle limits."
      ]
    }
  ]
};
