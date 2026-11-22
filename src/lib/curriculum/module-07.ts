import type { ModuleCurriculum } from "./types";

export const module07: ModuleCurriculum = {
  moduleNumber: 7,
  stageNumber: 1,
  stageTitle: "STAGE 01 · READ & DEFINE THE PROBLEM",
  title: "Write Observable Acceptance Criteria",
  objective: "Transform fuzzy, subjective business wishes into deterministic, testable acceptance criteria that can verify correctness without knowing how the solution is implemented.",
  readTime: "23 min deep read",
  coreFocus: "Observable Acceptance Criteria · The Testable Oracle · Implementation Independence · Invariant Properties",
  sections: [
    {
      kicker: "SECTION 01 · THE SUBJECTIVITY CRISIS",
      title: "Why Vague Requirements Destroy Engineering Projects",
      content: [
        "In amateur software development, requirements are filled with subjective hand-waving: 'The system should be fast,' 'The recommendations should be relevant,' 'The checkout should handle invalid cards gracefully.'",
        "These statements are uncomputable. What is 'fast'? 2 milliseconds or 2 seconds? What is 'gracefully'? Displaying an error message or crashing silently?",
        "If two senior engineers can read a requirement and disagree on whether a test passed or failed, the requirement is broken.",
        "Master problem solvers formulate Observable Acceptance Criteria: conditions that can be evaluated by an automated black-box judge (an Oracle) with 100% binary determinism (PASS or FAIL)."
      ],
      callout: {
        type: "rule",
        title: "The Law of the Observable Oracle",
        text: "An acceptance criterion is only valid if a third party can verify it purely by inspecting the input and the output, without looking at the internal source code."
      }
    },
    {
      kicker: "SECTION 02 · THE GIVEN-WHEN-THEN FRAMEWORK",
      title: "The Structural Anatomy of a Testable Criterion",
      content: [
        "Every observable criterion must be formulated in a 3-part causal structure:",
        "1. GIVEN (Pre-condition): The exact starting state of the universe and the input values.",
        "2. WHEN (Trigger): The execution of the transformation function or problem solver.",
        "3. THEN (Observable Invariant): The exact, measurable post-condition that MUST hold true.",
        "Example of bad criterion: 'Ensure users don't get charged twice.'",
        "Example of observable criterion: 'GIVEN a customer checkout with Idempotency-Key K, WHEN the charge request is submitted twice within 60 seconds, THEN exactly one transaction ID is generated, the customer balance is debited exactly once, and both requests receive HTTP 200 with identical receipt payloads.'"
      ],
      callout: {
        type: "warning",
        title: "The Implementation Bias Trap",
        text: "Never mention internal data structures or algorithms in your acceptance criteria! Saying 'The system must sort using Quicksort and store items in a HashMap' is a fatal category error. Criteria dictate WHAT the result must be, NEVER HOW you compute it."
      }
    },
    {
      kicker: "SECTION 03 · PROPERTY-BASED INVARIANTS",
      title: "Universal Mathematical Properties as Criteria",
      content: [
        "Beyond testing single example inputs, master problem solvers define Property-Based Invariants that must hold true for ALL valid inputs:",
        "• Conservation of Mass / Money: Total currency in the system before transfers == Total currency after transfers.",
        "• Idempotency: Applying the operation twice yields the exact same state as applying it once: $f(f(x)) == f(x)$.",
        "• Round-Trip Invertibility: Encoding followed by decoding restores the exact original data: $decode(encode(x)) == x$.",
        "• Ordering Monotonicity: If $x_1 ≤ x_2$, then $f(x_1) ≤ f(x_2)$."
      ]
    },
    {
      kicker: "SECTION 04 · THE CRITERIA AUDIT",
      title: "The Falsifiability Test for Criteria",
      content: [
        "Before finalizing acceptance criteria, apply the Falsifiability Test:",
        "Can I construct a concrete, observable test case that unequivocally PROVES this criterion failed?",
        "If you cannot imagine what a failure looks like in concrete data, your criterion is still subjective mush."
      ],
      callout: {
        type: "tip",
        title: "The Black-Box Inspector",
        text: "Imagine your code is locked in a sealed metal container with only an input slot and an output chute. Your criteria can only measure what goes into the slot and what comes out of the chute."
      }
    }
  ],
  caseStudies: [
    {
      tag: "CASE STUDY A · RIDE-SHARING SURGE PRICING",
      title: "The Dynamic Fare Surge Multiplier",
      problem: "A ride-hailing company drafts this requirement: 'When demand is high in a neighborhood, surge pricing should kick in fairly to incentivize more drivers.'",
      flawedApproach: "Accepting this requirement as written and allowing a developer to invent arbitrary surge multipliers based on their personal feelings.",
      correctInvariant: "Observable Acceptance Criteria:\n1. GIVEN Demand $D$ (ride requests in last 5 min) and Supply $S$ (available drivers in 2 km radius), WHEN $D / S > 1.5$, THEN SurgeMultiplier = $\\min(3.0, 1.0 + 0.5 \\times \\lfloor (D/S - 1.5) / 0.5 \\rfloor)$.\n2. GIVEN any ratio $D / S$, THEN SurgeMultiplier is guaranteed to be in $[1.0, 3.0]$.\n3. GIVEN $D / S ≤ 1.5$, THEN SurgeMultiplier == 1.0.",
      codeOrContract: "Observable Oracle:\nInput: (D, S)\nCheck 1: 1.0 ≤ Multiplier ≤ 3.0\nCheck 2: If D/S ≤ 1.5 -> Multiplier == 1.0\nCheck 3: Multiplier is monotonically non-decreasing with respect to D/S"
    },
    {
      tag: "CASE STUDY B · DRONE DELIVERY PARCEL DROP",
      title: "Autonomous Package Release Mechanism",
      problem: "An aerial delivery drone brief states: 'The drone must drop the parcel safely in the customer's backyard.'",
      flawedApproach: "Testing on a sunny day with zero wind, seeing the box land on grass, and declaring victory.",
      correctInvariant: "Observable Acceptance Criteria:\n1. GIVEN GPS target coordinate $(X, Y)$, THEN parcel touchdown point must be within radial distance $R ≤ 1.5$ meters of $(X, Y)$.\n2. GIVEN wind gusts $\\le 35$ km/h, THEN vertical descent velocity at impact must be $v \\le 1.2$ m/s (impact g-force $< 2.5g$).\n3. GIVEN an obstacle (e.g. human, dog, patio table) detected in drop zone, THEN parcel release must NOT trigger (abort release and hover at 10m).",
      codeOrContract: "Observable Oracle:\nMeasure: Distance(Touchdown, Target) ≤ 1.5m\nMeasure: ImpactVelocity ≤ 1.2 m/s\nMeasure: If Obstacle == True -> ReleaseCount == 0"
    },
    {
      tag: "CASE STUDY C · BANKING IDEMPOTENT PAYMENTS",
      title: "Payment Gateway Network Timeout Recovery",
      problem: "A banking requirement says: 'Prevent customers from being double-charged when their wifi drops during payment.'",
      flawedApproach: "Adding a popup warning on the webpage saying 'Please do not click submit twice.'",
      correctInvariant: "Observable Acceptance Criteria:\n1. GIVEN a payment request with unique `Idempotency-Key: UUID_X`, WHEN N requests ($1 ≤ N ≤ 100$) arrive bearing `UUID_X` within 24 hours, THEN the core ledger balance is debited exactly ONCE.\n2. All N responses return identical HTTP status codes and transaction reference tokens.\n3. GIVEN a subsequent request with `UUID_X` but a DIFFERENT payment amount, THEN return HTTP 422 Unprocessable Entity (idempotency conflict).",
      codeOrContract: "Property: Idempotency Under Retries\n∀ n ≥ 1: State(Request_n(K)) == State(Request_1(K))\nDebitCount(K) == 1"
    }
  ],
  checklist: [
    "Are all criteria written in objective, measurable, numerical terms?",
    "Does any criterion accidentally dictate internal algorithms or data structures instead of observable output?",
    "Is every criterion formatted with clear GIVEN (pre-condition), WHEN (action), and THEN (guarantee)?",
    "Have I defined the conservation, idempotency, or monotonicity invariants that must hold for all inputs?",
    "Could an automated script evaluate PASS or FAIL for every single criterion with zero human interpretation?"
  ],
  practiceTask: {
    id: "task-07-smart-grid-battery",
    title: "Hands-on Practice: The Solar Battery Inverter Acceptance Criteria",
    scenario: "A renewable home energy company builds an automated smart inverter for residential solar panels and battery storage. The system monitors: current Solar Generation $G$ (kW), current Home Power Consumption $C$ (kW), Battery State of Charge $SOC$ (percentage 0 to 100%), and Grid Electricity Price $P$ (cents per kWh). Management wants a spec for: 'When solar is plentiful, charge the battery. When power is expensive, sell battery power to the grid, but never leave the homeowner without emergency backup.'",
    prompt: "Rewrite this vague management wish into 4 formal, observable, implementation-independent Acceptance Criteria. Each criterion must use the GIVEN-WHEN-THEN structure with exact mathematical thresholds and measurable guarantees.",
    starterTemplate: "1. CRITERION 1 (Surplus Solar Battery Charging):\n• GIVEN:\n• WHEN:\n• THEN:\n\n2. CRITERION 2 (Emergency Backup Reserve Floor):\n• GIVEN:\n• WHEN:\n• THEN:\n\n3. CRITERION 3 (High-Price Grid Arbitrage):\n• GIVEN:\n• WHEN:\n• THEN:\n\n4. CRITERION 4 (Zero Grid Backfeed During High Deficit):\n• GIVEN:\n• WHEN:\n• THEN:",
    modelSolution: "1. CRITERION 1 (Surplus Solar Battery Charging):\n• GIVEN Solar Generation $G > C$ (Consumption) AND Battery $SOC < 95\\%$,\n• WHEN power routing is calculated,\n• THEN the net surplus power $(G - C)$ must be directed to charging the battery until $SOC$ reaches $95\\%$ or charging power hits the inverter limit (5.0 kW), with 0 kW drawn from the external grid.\n\n2. CRITERION 2 (Emergency Backup Reserve Hard Floor):\n• GIVEN Battery $SOC ≤ 20\\%$,\n• WHEN any power demand (home consumption or grid export) occurs,\n• THEN battery discharge rate must be exactly 0 kW (battery locked as emergency reserve), and all home consumption deficit $(C - G)$ must be supplied exclusively by the external grid.\n\n3. CRITERION 3 (High-Price Grid Arbitrage):\n• GIVEN Grid Price $P > 35$ cents/kWh AND Battery $SOC > 40\\%$ AND Solar $G ≥ C$,\n• WHEN grid export calculation occurs,\n• THEN the battery must discharge at rate $\\min(5.0\\text{ kW}, \\text{DischargeLimit})$ to the grid, provided $SOC$ remains strictly above the $20\\%$ safety floor.\n\n4. CRITERION 4 (Physical Energy Conservation Invariant):\n• GIVEN any instantaneous state of the system,\n• WHEN power balance is measured,\n• THEN $P_{\\text{solar}} + P_{\\text{battery\\_discharge}} + P_{\\text{grid\\_import}} = P_{\\text{consumption}} + P_{\\text{battery\\_charge}} + P_{\\text{grid\\_export}} + P_{\\text{inverter\\_loss}}$ with maximum measurement discrepancy $< 0.05$ kW.",
    rubric: [
      "Avoided subjective language ('plentiful', 'expensive', 'safe')",
      "Used explicit numerical thresholds (e.g. SOC <= 20%, P > 35 cents, SOC < 95%)",
      "Formulated strict GIVEN-WHEN-THEN structures",
      "Included a universal physical conservation invariant (energy balance equation)",
      "Maintained zero implementation bias (no mention of code, classes, or database rows)"
    ]
  },
  questions: [
    {
      question_id: "m7q01",
      sort_order: 1,
      title: "Detecting Subjective Non-Criteria",
      prompt: "Which of the following statements represents a genuinely observable, testable acceptance criterion?",
      options: [
        "The web interface should feel slick, modern, and snappy to millennial users.",
        "Under a synthetic benchmark load of 500 concurrent requests per second, the 99th percentile (p99) server response latency must be ≤ 120 milliseconds.",
        "The code must be written with passion and follow best practices.",
        "The database should store things in a very organized way."
      ],
      hints: [
        "Which statement can be evaluated by a script with a stopwatch?",
        "Can a computer measure 'passion' or 'snappy'?",
        "Look for the exact numerical metric (500 req/s, p99 ≤ 120 ms)."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "Option B provides an objective, measurable, unambiguous criterion: exact load (500 req/s), exact statistical percentile (p99), and exact numerical upper bound (≤ 120 ms). A performance monitoring tool can output a definitive PASS or FAIL with zero human opinion.",
      option_explanations: [
        "Incorrect: 'Slick, modern, and snappy' are subjective aesthetic opinions that cannot be measured deterministically.",
        "Correct: Completely objective, measurable, and falsifiable with exact numerical thresholds.",
        "Incorrect: 'Written with passion' is an unmeasurable emotional sentiment.",
        "Incorrect: 'Very organized' is a vague subjective hand-wave."
      ]
    },
    {
      question_id: "m7q02",
      sort_order: 2,
      title: "Implementation Bias in Criteria",
      prompt: "A product requirement says: 'The sorting feature must use an in-place Quicksort with randomized pivot selection and store temporary values in a fixed-size C-style array.' Why is this a flawed acceptance criterion?",
      options: [
        "Because Quicksort was invented in 1959 and is too old to use.",
        "Because it dictates internal implementation details rather than observable output behavior, preventing engineers from using better algorithms (like Timsort or Radix sort) that achieve the same observable sorted result.",
        "Because arrays cannot store numbers larger than 10.",
        "Because sorting should only be done on Saturdays."
      ],
      hints: [
        "Should acceptance criteria care HOW a function sorts, or WHETHER the output is correctly sorted?",
        "Dictating private internal machinery destroys architectural flexibility.",
        "Acceptance criteria specify observable behavior, not internal code mechanisms."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "This is the classic Implementation Bias trap. The business needs a sorted list meeting $A[i] ≤ A[i+1]$. Dictating that it must use Quicksort with randomized pivots over-constrains the solution and prevents using more optimal algorithms for specific input distributions.",
      option_explanations: [
        "Incorrect: The age of an algorithm has nothing to do with criterion validity.",
        "Correct: Acceptance criteria must define observable external behavior, never private internal implementation choices.",
        "Incorrect: Arrays can store arbitrarily large numbers depending on element type.",
        "Incorrect: Arbitrary narrative nonsense."
      ]
    },
    {
      question_id: "m7q03",
      sort_order: 3,
      title: "The Idempotency Invariant",
      prompt: "A bank account transfer API has the acceptance criterion: 'The transfer endpoint must be idempotent.' What does this mean in observable terms?",
      options: [
        "Transfers can only be executed during daytime banking hours.",
        "If a client submits the exact same transfer request 5 times due to network timeouts, the recipient receives the funds exactly once, and the sender is debited exactly once.",
        "The transfer must be processed using blockchain cryptocurrency technology.",
        "Every transfer must be accompanied by an email receipt in PDF format."
      ],
      hints: [
        "In mathematics, $f(f(x)) = f(x)$.",
        "If you press the button 5 times because the internet was slow, how many times should your money move?",
        "Idempotency guarantees that duplicate execution does not duplicate side effects."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "Idempotency means that performing an operation multiple times produces the exact same state as performing it once. In banking, retrying an identical transfer request must not execute multiple debits.",
      option_explanations: [
        "Incorrect: Operating hours are scheduling constraints, not idempotency.",
        "Correct: Accurately defines the observable operational behavior of an idempotent system under retry conditions.",
        "Incorrect: Idempotency is a mathematical property independent of blockchain or ledger technology.",
        "Incorrect: Sending PDF emails is an auxiliary notification side effect."
      ]
    },
    {
      question_id: "m7q04",
      sort_order: 4,
      title: "Formulating Given-When-Then",
      prompt: "Which of the following correctly formats an acceptance criterion for an e-commerce coupon code?",
      options: [
        "Make sure coupons work properly and people are happy with their discounts.",
        "GIVEN a shopping cart with subtotal $80.00 AND a coupon code 'SUMMER20' (20% off for orders ≥ $50.00), WHEN the coupon is applied, THEN the cart discount amount must equal $16.00 and final payable total must equal $64.00.",
        "Coupons should be stored in a MongoDB collection with BSON indexing.",
        "Users who use coupons should be tagged as bargain hunters in our marketing CRM."
      ],
      hints: [
        "Look for the exact GIVEN-WHEN-THEN structure with concrete numbers.",
        "$80 × 20% = $16 discount. $80 - $16 = $64.",
        "Option B provides a complete, deterministic, testable oracle."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "Option B is a pristine Given-When-Then specification: explicitly defines input state (cart $80, coupon terms), execution action (coupon applied), and exact mathematical observable outputs (discount $16, total $64).",
      option_explanations: [
        "Incorrect: Vague, subjective emotional aspiration.",
        "Correct: Flawless Given-When-Then structure with concrete, unambiguous arithmetic verifications.",
        "Incorrect: Implementation bias specifying database storage engines.",
        "Incorrect: CRM tagging is an auxiliary marketing workflow, not the core discount criterion."
      ]
    },
    {
      question_id: "m7q05",
      sort_order: 5,
      title: "The Conservation Property Criterion",
      prompt: "In a multiplayer online card trading system, players trade virtual cards with one another. What universal property-based criterion must hold true after every single trade transaction?",
      options: [
        "All players must have the exact same number of cards after the trade.",
        "The total multiset sum of all cards in existence across all player inventories must remain strictly identical before and after the trade (zero cards created from nothing, zero cards destroyed).",
        "The player who initiated the trade must always receive a rarer card.",
        "Trades can only happen between players who live in the same country."
      ],
      hints: [
        "Conservation of mass/items: cards cannot magically appear or disappear during a transfer.",
        "Total cards in the universe before == Total cards in the universe after.",
        "This is the fundamental Conservation Invariant."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "The Conservation Law states that closed system transfers can neither create nor destroy assets. In a card trading system, the total inventory across all players must be invariant before and after any trade.",
      option_explanations: [
        "Incorrect: Trades can be unequal (e.g. 2 common cards for 1 rare card).",
        "Correct: Formulates the fundamental Conservation Property Invariant that prevents item duplication or deletion exploits.",
        "Incorrect: Trade rarity is negotiated by players, not an invariant rule.",
        "Incorrect: Geographic restrictions are arbitrary business rules, not a structural conservation invariant."
      ]
    },
    {
      question_id: "m7q06",
      sort_order: 6,
      title: "Synthesizing an Observable Acceptance Suite",
      prompt: "You are tasked with defining acceptance criteria for a password validation engine that requires: 'Passwords must be at least 8 characters long and contain at least one digit.' Which pair of criteria creates a complete pass/fail oracle?",
      options: [
        "Criterion 1: The password should look strong. Criterion 2: The user should remember it easily.",
        "Criterion 1 (Valid Case): GIVEN input 'secret42' (length 8, contains digit '4'), WHEN validated, THEN return `Valid: True, Error: None`. Criterion 2 (Rejection Case): GIVEN input 'secret' (length 6, zero digits), WHEN validated, THEN return `Valid: False, Error: ['LENGTH_BELOW_8', 'MISSING_DIGIT']`.",
        "Criterion 1: Passwords must be hashed with SHA-256. Criterion 2: Salting must use 16 bytes.",
        "Criterion 1: The password field must have a blue border. Criterion 2: The font must be Comic Sans."
      ],
      hints: [
        "Look for the suite that tests both valid acceptance and explicit invalid rejection reasons.",
        "Option B tests length and digit presence, and specifies explicit error codes.",
        "Avoid presentation styling (blue borders, Comic Sans) or internal hashing details."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "Option B establishes a complete observable oracle: tests a positive valid candidate that satisfies both rules, and a negative candidate that triggers both specific error conditions with deterministic return codes.",
      option_explanations: [
        "Incorrect: Subjective human feelings ('looks strong', 'remember easily').",
        "Correct: Fully specified positive and negative verification criteria with explicit boolean and error code contracts.",
        "Incorrect: Hashing specifications belong to encryption storage layers, not input validation acceptance criteria.",
        "Incorrect: UI styling attributes have zero connection to validation logic."
      ]
    }
  ]
};
