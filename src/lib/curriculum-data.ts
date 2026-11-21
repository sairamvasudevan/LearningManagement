export type ReadingSection = {
  kicker: string;
  title: string;
  content: string[];
  callout?: {
    type: "warning" | "tip" | "rule";
    title: string;
    text: string;
  };
};

export type CaseStudy = {
  tag: string;
  title: string;
  problem: string;
  flawedApproach: string;
  correctInvariant: string;
  codeOrContract?: string;
};

export type PracticeTask = {
  id: string;
  title: string;
  scenario: string;
  prompt: string;
  starterTemplate: string;
  modelSolution: string;
  rubric: string[];
};

export type ModuleQuestion = {
  question_id: string;
  sort_order: number;
  title: string;
  prompt: string;
  options: string[];
  hints: string[];
  marks: number;
  correct_index: number;
  explanation: string;
  option_explanations: string[];
};

export type ModuleCurriculum = {
  moduleNumber: number;
  stageNumber: number;
  stageTitle: string;
  title: string;
  objective: string;
  readTime: string;
  coreFocus: string;
  sections: ReadingSection[];
  caseStudies: CaseStudy[];
  checklist: string[];
  practiceTask: PracticeTask;
  questions: ModuleQuestion[];
};

export const MODULES_CURRICULUM: Record<number, ModuleCurriculum> = {
  1: {
    moduleNumber: 1,
    stageNumber: 1,
    stageTitle: "STAGE 01 · READ & DEFINE THE PROBLEM",
    title: "Separate the Story from the Task",
    objective: "Identify the exact outcome requested without confusing background details with the task or its possible implementation.",
    readTime: "20 min read",
    coreFocus: "Story vs Task · Entity vs Event · Input/Output Boundaries",
    sections: [
      {
        kicker: "SECTION 01 · THE PROBLEM-SOLVER'S TRAP",
        title: "Why 80% of Engineers Fail Before Writing Code",
        content: [
          "In real-world systems engineering and technical interviews, problems are never delivered as clean formulas like 'Find the cardinality of the union of two sets.'",
          "Instead, they arrive disguised as business narratives: retail checkout receipts, passenger transit logs, distributed sensor telemetry, or warehouse dispatch streams.",
          "Junior engineers often model the narrative—creating unnecessary helper classes for 'Visitors', 'Cameras', or 'Shops'—instead of isolating the underlying mathematical entity and invariant.",
        ],
        callout: {
          type: "warning",
          title: "The Junior Developer Trap",
          text: "Never write code or choose data structures based on the story words. Isolate the mathematical entity and the invariant transformation first.",
        },
      },
      {
        kicker: "SECTION 02 · CORE PEDAGOGY",
        title: "The 3 Invariant Extraction Principles",
        content: [
          "1. Entity vs. Event: An Event is a single log row (e.g. a sensor pulse or scan). An Entity is the real-world actor being counted (e.g. distinct human visitor). One entity can trigger multiple events; counting rows is NOT counting entities.",
          "2. Preconditions vs. Assumptions: Separate what the specification guarantees from what you are tempted to assume. Never assume sorted order, unique IDs, or positive integers unless explicitly promised.",
          "3. Observable Output Contract: Define the exact return value (scalar integer, set of strings, boolean) without prematurely picking the data structure used to compute it.",
        ],
      },
    ],
    caseStudies: [
      {
        tag: "CASE STUDY A · E-COMMERCE SALE",
        title: "The Midnight Flash Sale Order Aggregator",
        problem: "An e-commerce store stores orders with customer ID, order ID, timestamp, and product SKU list. During flash sales, a customer may place multiple orders. The VP asks: 'How many different customers made at least one purchase on June 12?'",
        flawedApproach: "Counting product line items or counting total order IDs. Both overstate customer count because one customer placed 3 orders with 5 items each.",
        correctInvariant: "Count of Distinct Customer IDs where Date(timestamp) == '2026-06-12'.",
        codeOrContract: "Result = len({order.customer_id for order in orders if order.date == '2026-06-12'})",
      },
      {
        tag: "CASE STUDY B · HARDWARE SENSOR DEBOUNCE",
        title: "Metro Turnstile Multi-Pulse Anomaly",
        problem: "An optical gate sensor triggers 2 or 3 times in rapid succession (< 200ms) when a single passenger steps through due to vibration. Management wants to know: 'How many distinct passengers entered between 08:00 and 09:00?'",
        flawedApproach: "Counting sensor pulses directly. This over-counts foot traffic by 150%!",
        correctInvariant: "Filter scans by timestamp window, group by commuter card ID, and count distinct IDs.",
      },
    ],
    checklist: [
      "What is the single physical entity being counted or transformed?",
      "Are multiple event log rows possible for a single entity?",
      "What represents unrequested scope creep (e.g. sorting, notifications)?",
      "Can you state the task in exactly one unambiguous sentence?",
    ],
    practiceTask: {
      id: "task-01",
      title: "Practice Challenge: De-Noise a Messy Client Requirement",
      scenario: "A food delivery startup's customer support lead sends this ticket: 'Our delivery drivers are claiming they completed 10 deliveries yesterday, but our GPS tracker table shows 450 location ping events for each driver, and some orders had multiple pickups from two restaurants. We need to pay drivers who completed at least 5 orders on Sunday, but our finance spreadsheet only has raw GPS pings and restaurant handoff receipts.'",
      prompt: "Extract the exact input contract, the underlying entity to be counted, and write a 1-sentence unambiguous task specification.",
      starterTemplate: "// 1. Entity to count:\n// 2. Event distractors to ignore:\n// 3. One-sentence task contract:\n",
      modelSolution: "1. Entity to count: Distinct completed Order IDs per Driver ID on Sunday.\n2. Distractors to ignore: GPS location pings (450 pings/driver) and restaurant pickup receipts.\n3. Task Contract: 'For each driver, count distinct order IDs with status == 'COMPLETED' and date == 'Sunday', returning the list of driver IDs where count >= 5.'",
      rubric: [
        "Correctly identifies completed orders (not GPS pings or pickups) as the entity.",
        "Explicitly states the Sunday filter precondition.",
        "Delivers an unambiguous threshold rule (count >= 5).",
      ],
    },
    questions: [
      {
        question_id: "m1q01",
        sort_order: 1,
        title: "Identify the requested entity",
        prompt: "An online bookstore stores order records with customer ID, order ID, order date and product ID. One customer may place several orders on the same day, and one order may contain several products. The manager asks: ‘How many different customers placed at least one order on 12 June?’ Which statement captures the requested task?",
        options: [
          "Count all product lines recorded on 12 June.",
          "Count the distinct order IDs recorded on 12 June.",
          "Count the distinct customer IDs linked to orders on 12 June.",
          "Count the distinct product IDs sold on 12 June.",
        ],
        hints: [
          "Ask what real-world entity the manager wants counted: lines, orders, products, or people?",
          "One customer can appear in several order records, so counting records is not counting customers.",
          "The requested result is one count of distinct customer identities among orders on 12 June.",
        ],
        marks: 2,
        correct_index: 2,
        explanation: "The manager asked for 'different customers'. Multiple order records and multiple product lines can belong to a single customer.",
        option_explanations: [
          "Incorrect: Counts line items, not human customers.",
          "Incorrect: One customer can place multiple orders on the same day.",
          "Correct: Directly counts the distinct customer entity on the target date.",
          "Incorrect: Counts products sold, which does not measure how many customers visited.",
        ],
      },
      {
        question_id: "m1q02",
        sort_order: 2,
        title: "Separate context from the task",
        prompt: "A parking authority operates four locations and uses camera-based entry logs. For Lot A, it wants to know how many different vehicles entered between 08:00 and 10:00. Which sentence states the actual task rather than background information or an implementation idea?",
        options: [
          "The authority operates four parking locations.",
          "Use a dictionary to store vehicle registration numbers.",
          "Count distinct vehicle registration numbers recorded at Lot A between 08:00 and 10:00.",
          "Improve the accuracy of the entry cameras.",
        ],
        hints: [
          "The actual task should describe the requested result, not the operating environment.",
          "A dictionary is an implementation mechanism; it does not define the business requirement.",
          "Look for the sentence specifying the count, the vehicle identity, and the location/time bounds.",
        ],
        marks: 2,
        correct_index: 2,
        explanation: "Stating the count of distinct vehicle registration numbers at Lot A within the time window captures the exact task.",
        option_explanations: [
          "Incorrect: Background operational context.",
          "Incorrect: Implementation detail (data structure choice).",
          "Correct: Formulates the unambiguous outcome contract.",
          "Incorrect: Engineering maintenance recommendation.",
        ],
      },
      {
        question_id: "m1q03",
        sort_order: 3,
        title: "Recognise scope creep",
        prompt: "A student portal stores login events. The stated request is: ‘Report the number of distinct accounts that logged in at least once on Monday.’ Which proposed deliverable adds work that the request does not ask for?",
        options: [
          "Use Monday as the reporting period.",
          "Count an account only once even if it logged in several times.",
          "Return a single numeric count of the qualifying accounts.",
          "Send a reactivation message to every account that did not log in on Monday.",
        ],
        hints: [
          "Separate what is necessary to produce the report from follow-up marketing campaigns.",
          "The request is only about accounts that logged in, not taking actions on inactive accounts.",
          "Look for the option that invents a messaging notification workflow.",
        ],
        marks: 2,
        correct_index: 3,
        explanation: "Sending reactivation messages creates an unrequested external side effect and workflow that wasn't asked for.",
        option_explanations: [
          "Incorrect: Essential time bound.",
          "Incorrect: Essential de-duplication invariant.",
          "Incorrect: The requested scalar return value.",
          "Correct: This is classic unrequested scope creep.",
        ],
      },
      {
        question_id: "m1q04",
        sort_order: 4,
        title: "Distinguish an entity from its events",
        prompt: "A museum gate log contains successful entry scans. A visitor may appear in more than one scan record because the gate was slow to respond. The museum asks for the number of different visitors who entered on a given date. What should the requested count represent?",
        options: [
          "The number of scan events recorded that day.",
          "The number of distinct visitor identities represented in the day’s entry scan records.",
          "The number of times each gate sensor activated.",
          "The number of passes printed for the museum.",
        ],
        hints: [
          "A scan is an event. A visitor is the real-world human being.",
          "Multiple scan events can happen for one visitor due to hardware lag.",
          "The count must represent distinct visitor identities on that date.",
        ],
        marks: 2,
        correct_index: 1,
        explanation: "Counting scan events overstates visitors due to sensor retries. You must count distinct visitor identities.",
        option_explanations: [
          "Incorrect: Over-counts due to sensor debounce issues.",
          "Correct: Directly measures distinct human visitor identities.",
          "Incorrect: Hardware telemetry metric.",
          "Incorrect: Printed inventory metric, not actual gate admissions.",
        ],
      },
      {
        question_id: "m1q05",
        sort_order: 5,
        title: "Identify an ambiguity that needs clarification",
        prompt: "A procurement team asks for a report showing the number of ‘active suppliers’ this quarter. Its records contain supplier IDs, purchase orders, deliveries and invoices, but the request does not define the word ‘active’. What is the best next step before writing the task statement?",
        options: [
          "Assume any supplier with an invoice is active.",
          "Count every supplier ID appearing anywhere in the records.",
          "Ask which business condition qualifies a supplier as active (e.g. order placed, delivery completed, or invoice settled).",
          "Choose the fastest data structure and use that as the definition.",
        ],
        hints: [
          "The reporting period is stated, but the definition of 'active' is completely undefined.",
          "Different business definitions produce wildly different counts.",
          "Clarify the qualifying business predicate before writing code.",
        ],
        marks: 2,
        correct_index: 2,
        explanation: "Undefined terms like 'active' or 'top' are ambiguities that must be clarified with stakeholders before modelling.",
        option_explanations: [
          "Incorrect: Dangerous unverified assumption.",
          "Incorrect: Includes churned or historical suppliers.",
          "Correct: The professional response is to clarify the qualification predicate.",
          "Incorrect: Premature optimization without clear requirements.",
        ],
      },
      {
        question_id: "m1q06",
        sort_order: 6,
        title: "Transfer the skill to a new domain",
        prompt: "A learning platform asks: ‘How many learners completed a course in November?’ Its event log records when a learner opened a lesson, played a video, started a quiz and submitted a quiz. The platform has not defined what ‘completed a course’ means. What should the problem solver do first?",
        options: [
          "Treat opening the final lesson as course completion.",
          "Treat every quiz submission as course completion.",
          "Clarify the completion rule, such as whether all required units must be finished or an assessment must be passed.",
          "Count every event in November and divide by the number of courses.",
        ],
        hints: [
          "Opening a lesson or watching a video is an engagement event, not completion.",
          "Ask for the exact completion criteria (e.g. passing score threshold).",
          "Clarify the business rule before computing metrics.",
        ],
        marks: 2,
        correct_index: 2,
        explanation: "Course completion cannot be guessed. Does it require 100% video watch, passing all quizzes with 80%, or just opening the last module? Clarify first.",
        option_explanations: [
          "Incorrect: Passive viewing does not guarantee completion.",
          "Incorrect: Quizzes can be failed or submitted partially.",
          "Correct: Clarify the formal completion predicate.",
          "Incorrect: Pointless mathematical heuristic.",
        ],
      },
    ],
  },

  2: {
    moduleNumber: 2,
    stageNumber: 1,
    stageTitle: "STAGE 01 · READ & DEFINE THE PROBLEM",
    title: "Express a Task as Input, Rule and Output",
    objective: "Describe a problem as the information received, the transformation required and the result expected.",
    readTime: "22 min read",
    coreFocus: "Input Contract · Deterministic Rule · Output Specification",
    sections: [
      {
        kicker: "SECTION 01 · THE INPUT-RULE-OUTPUT TRIAD",
        title: "The Architecture of Computable Tasks",
        content: [
          "Every computer program in existence, from a binary search to a flight control system, is a mapping: $f(Input) \\to Output$ via a deterministic Rule.",
          "When you read a vague product requirement, your first engineering duty is to write down the three components explicitly:",
          "1. Input: Exact data types, collections, structures, and domains.",
          "2. Rule: The mathematical, logical, or filtering transformation that maps inputs to outputs.",
          "3. Output: The precise structure returned (value, array, boolean, or error state).",
        ],
      },
      {
        kicker: "SECTION 02 · STATE MUTATION & PURITY",
        title: "Pure Functions vs. Side Effects",
        content: [
          "A robust contract makes side effects visible. Does the rule mutate the input array in-place, or return a new sorted copy?",
          "Does it raise an exception on invalid inputs, or return a sentinel value (e.g., null, -1, empty list)?",
          "Ambiguity in input contracts causes 60% of production runtime bugs.",
        ],
      },
    ],
    caseStudies: [
      {
        tag: "CASE STUDY · HOTEL RESERVATION CONFLICT",
        title: "The Room Allocation Overlap Rule",
        problem: "Given a list of reservations with check-in and check-out dates, determine if a newly requested booking can be accepted for Room 101.",
        flawedApproach: "Checking only if new_checkin == existing_checkin.",
        correctInvariant: "Overlap Rule: (new_start < existing_end) AND (new_end > existing_start).",
        codeOrContract: "Input: List[(start: Date, end: Date)], candidate: (start, end) -> Output: Boolean (is_valid)",
      },
    ],
    checklist: [
      "Are all input fields typed with valid ranges?",
      "Is the output format single-valued or a collection?",
      "What happens when the input collection is empty?",
      "Is the transformation deterministic (same input always produces same output)?",
    ],
    practiceTask: {
      id: "task-02",
      title: "Practice Challenge: Formulate an Input-Rule-Output Contract",
      scenario: "An airline baggage claim kiosk needs to notify passengers when their luggage is on the carousel. The input stream contains luggage scan events: (bag_id, passenger_id, flight_no, scan_location, timestamp). Passengers only care about bags that have reached 'CAROUSEL_B4'.",
      prompt: "Write down the formal Input contract, the Transformation Rule, and the exact Output specification.",
      starterTemplate: "// Input:\n// Rule:\n// Output:\n",
      modelSolution: "Input: stream of BagScan(bag_id: string, passenger_id: string, flight_no: string, scan_location: string, timestamp: ISO_Date)\nRule: Filter scans where scan_location == 'CAROUSEL_B4' and flight_no == target_flight, unique by bag_id.\nOutput: Set[passenger_id] representing passengers whose bags have arrived.",
      rubric: [
        "Defines explicit input fields with types.",
        "Clear filtering and de-duplication rule.",
        "Specific output collection type.",
      ],
    },
    questions: [
      {
        question_id: "m2q01",
        sort_order: 1,
        title: "Identify the complete input contract",
        prompt: "A function calculates the total price of items in a shopping cart with a promotional coupon. Which input contract is complete?",
        options: [
          "A list of items.",
          "Items and coupon code.",
          "List of items (price, quantity), optional coupon percentage discount (0-100), and sales tax rate.",
          "The user's credit card number and email address.",
        ],
        hints: [
          "Think about what numerical values are necessary to calculate the final price.",
          "Quantity and tax rate directly impact total calculation.",
          "Personal data like email and credit card are not inputs to a price calculation function.",
        ],
        marks: 2,
        correct_index: 2,
        explanation: "A complete contract specifies each required parameter and its numeric bounds.",
        option_explanations: [
          "Incomplete: Missing prices, quantities, and coupon values.",
          "Vague: Does not specify the data structure or discount terms.",
          "Correct: Contains all necessary parameters with bounded types.",
          "Irrelevant: Payment tokens are needed for checkout processing, not total calculation.",
        ],
      },
      {
        question_id: "m2q02",
        sort_order: 2,
        title: "Distinguish rule from output",
        prompt: "In a grading system: 'Students scoring 80 or above receive an A; otherwise they receive a B.' What does 'Receive an A or B' represent?",
        options: [
          "The Input.",
          "The Transformation Rule.",
          "The Output.",
          "The Side Effect.",
        ],
        hints: [
          "The condition (score >= 80) is the rule.",
          "The letter grade produced is the final result.",
        ],
        marks: 2,
        correct_index: 2,
        explanation: "The letter grade 'A' or 'B' is the returned result (the Output). The condition is the Rule.",
        option_explanations: [
          "Incorrect: The score is the input.",
          "Incorrect: The comparison logic is the rule.",
          "Correct: The letter grade is the observable output.",
          "Incorrect: No external system state was modified.",
        ],
      },
      {
        question_id: "m2q03",
        sort_order: 3,
        title: "Recognise incomplete transformation rules",
        prompt: "A bank defines transaction fees: 'Charge $1 for transfers under $100. Charge $5 for transfers over $100.' What is missing from the rule?",
        options: [
          "The bank's license number.",
          "The behavior when the transfer is exactly $100.",
          "The currency conversion rate to Euros.",
          "The sender's account creation date.",
        ],
        hints: [
          "Look at the boundary condition at the exact threshold value.",
          "Under $100 (< 100) and over $100 (> 100) leaves 100 unhandled.",
        ],
        marks: 2,
        correct_index: 1,
        explanation: "Boundary ownership gap: The rule specifies < 100 and > 100, leaving exactly $100 undefined.",
        option_explanations: [
          "Irrelevant context.",
          "Correct: Classic off-by-one boundary gap where exact value is unhandled.",
          "Irrelevant.",
          "Irrelevant.",
        ],
      },
      {
        question_id: "m2q04",
        sort_order: 4,
        title: "Evaluate deterministic behavior",
        prompt: "Which function contract is non-deterministic (cannot guarantee the same output for identical inputs)?",
        options: [
          "Calculate factorial of integer n.",
          "Sort an array of unique integers in ascending order.",
          "Return the current server time formatted as YYYY-MM-DD.",
          "Find the maximum value in a list of numbers.",
        ],
        hints: [
          "A pure function depends only on its inputs.",
          "Server time changes on every clock tick.",
        ],
        marks: 2,
        correct_index: 2,
        explanation: "Accessing the system clock introduces non-deterministic external state.",
        option_explanations: [
          "Deterministic: factorial(5) is always 120.",
          "Deterministic: sorted array is always identical.",
          "Correct: Depends on external wall-clock time, not function arguments.",
          "Deterministic: max([1, 5, 2]) is always 5.",
        ],
      },
      {
        question_id: "m2q05",
        sort_order: 5,
        title: "Contract error handling",
        prompt: "A function divide(a, b) receives b = 0. According to a clean Input-Rule-Output contract, what should the contract specify?",
        options: [
          "Silently return 0.",
          "Crash the computer operating system.",
          "Explicitly specify an error response (e.g. throw DivisionByZeroException or return None).",
          "Randomly pick a number.",
        ],
        hints: [
          "A solid contract handles edge cases explicitly.",
          "Returning 0 masks errors and corrupts downstream calculations.",
        ],
        marks: 2,
        correct_index: 2,
        explanation: "A robust contract documents how invalid inputs are signalled.",
        option_explanations: [
          "Incorrect: Masking invalid inputs leads to silent bugs.",
          "Incorrect: Catastrophic failure.",
          "Correct: Clear, observable error specification.",
          "Incorrect: Nonsensical.",
        ],
      },
    ],
  },

  3: {
    moduleNumber: 3,
    stageNumber: 1,
    stageTitle: "STAGE 01 · READ & DEFINE THE PROBLEM",
    title: "Extract Constraints and Limits",
    objective: "Find size, range, uniqueness, ordering and resource restrictions that change which solutions are valid.",
    readTime: "24 min read",
    coreFocus: "Bounds · Big-O Feasibility · Value Ranges · Memory Ceilings",
    sections: [
      {
        kicker: "SECTION 01 · WHY CONSTRAINTS DICTATE SOLUTIONS",
        title: "The Secret Key to Algorithmic Selection",
        content: [
          "In algorithmic engineering, constraints aren't footnotes—they are the blueprint that tells you which algorithm to choose before writing a single line of code.",
          "If $N \\le 20$, an exponential $O(2^N)$ backtracking search is viable.",
          "If $N \\le 10^5$, you need an $O(N \\log N)$ sorting or $O(N)$ linear scan.",
          "If $N \\le 10^9$, you need an $O(\\log N)$ binary search or mathematical closed-form formula.",
        ],
      },
      {
        kicker: "SECTION 02 · TYPES OF CONSTRAINTS",
        title: "The 4 Critical Dimensions of Limits",
        content: [
          "1. Collection Size: How many elements? Can the list be empty ($N = 0$)?",
          "2. Value Ranges: Can numbers be negative? Can they exceed 32-bit integer limits ($2^{31}-1$)?",
          "3. Uniqueness: Are duplicates allowed, or are all keys guaranteed distinct?",
          "4. Resource Limits: Time limit (typically 1.0s = $10^8$ operations) and Memory limit (256MB).",
        ],
      },
    ],
    caseStudies: [
      {
        tag: "CASE STUDY · INTEGER OVERFLOW IN SUMMATION",
        title: "The $10^9$ Running Total Disaster",
        problem: "Calculate the sum of an array containing $10^5$ elements, where each element can be up to $10^9$.",
        flawedApproach: "Using a standard 32-bit signed integer. Max 32-bit int is $\\approx 2 \\times 10^9$. Maximum possible sum is $10^{14}$, which causes silent integer overflow and wrap-around into negative numbers!",
        correctInvariant: "Constraint analysis: $10^5 \\times 10^9 = 10^{14}$. Must use 64-bit integer (long long in C++, bigint in JS/TS).",
      },
    ],
    checklist: [
      "What is the maximum value of N?",
      "Can values be negative, zero, or floating point?",
      "Can the result overflow standard 32-bit arithmetic?",
      "Are duplicate values allowed?",
    ],
    practiceTask: {
      id: "task-03",
      title: "Practice Challenge: Perform Constraint Analysis",
      scenario: "You are given an array of size N = 200,000. You need to find if any two numbers sum up to a target K. Time limit is 1.0 second.",
      prompt: "State why an O(N^2) nested loop will fail, and explain which Big-O time complexity is required based on N = 200,000.",
      starterTemplate: "// 1. Why O(N^2) fails:\n// 2. Maximum operations in 1.0s:\n// 3. Required time complexity:\n",
      modelSolution: "1. O(N^2) fails because (2 * 10^5)^2 = 4 * 10^10 operations.\n2. In 1.0 second, modern CPUs execute roughly 10^8 operations. 4 * 10^10 would take ~400 seconds (Time Limit Exceeded).\n3. Required complexity: O(N log N) using sorting + two pointers, or O(N) using a Hash Set (~2 * 10^5 operations, taking < 10ms).",
      rubric: [
        "Calculates operations for O(N^2).",
        "States CPU execution budget (~10^8 ops/sec).",
        "Recommends O(N) or O(N log N) solution.",
      ],
    },
    questions: [
      {
        question_id: "m3q01",
        sort_order: 1,
        title: "Analyze operation budgets",
        prompt: "An input array has size N = 100,000. The time limit is 1.0 second. Which time complexity will result in a Time Limit Exceeded (TLE) error?",
        options: [
          "O(N)",
          "O(N log N)",
          "O(N^2)",
          "O(log N)",
        ],
        hints: [
          "A 1-second limit allows roughly 10^8 basic operations.",
          "Calculate N^2 when N = 10^5.",
          "(10^5)^2 = 10^10 operations, which is 100x too slow.",
        ],
        marks: 2,
        correct_index: 2,
        explanation: "When N = 10^5, N^2 requires 10,000,000,000 operations, which takes ~100 seconds and causes TLE.",
        option_explanations: [
          "Safe: 10^5 operations takes < 2ms.",
          "Safe: ~1.7 * 10^6 operations takes < 20ms.",
          "Correct: 10^10 operations exceeds the 10^8 budget by 100x.",
          "Safe: ~17 operations takes microseconds.",
        ],
      },
      {
        question_id: "m3q02",
        sort_order: 2,
        title: "Recognize integer overflow risks",
        prompt: "An algorithm multiplies two integers where each can be up to 10^6. Can the result fit in a standard 32-bit signed integer (max ~ 2 * 10^9)?",
        options: [
          "Yes, because 10^6 * 10^6 = 10^12, which fits in 32-bit.",
          "No, because 10^6 * 10^6 = 10^12, which exceeds 2 * 10^9 and requires 64-bit.",
          "Yes, all multiplication automatically converts to infinite precision.",
          "No, numbers over 1,000 cannot be multiplied.",
        ],
        hints: [
          "Calculate 10^6 * 10^6.",
          "Compare 10^12 against 2 * 10^9.",
        ],
        marks: 2,
        correct_index: 1,
        explanation: "10^6 * 10^6 = 10^12, which far exceeds the 2,147,483,647 limit of 32-bit integers.",
        option_explanations: [
          "Math error: 10^12 is 500 times larger than 2 * 10^9.",
          "Correct: Requires 64-bit integer storage.",
          "Incorrect in compiled languages like C, C++, Java.",
          "Absurd claim.",
        ],
      },
      {
        question_id: "m3q03",
        sort_order: 3,
        title: "Detect empty collection constraints",
        prompt: "A function returns the minimum element in an array. The constraints state: 0 <= N <= 10,000. What edge case must your code guard against?",
        options: [
          "N being a negative number.",
          "N = 0 (empty array where minimum is undefined).",
          "N being greater than 1 million.",
          "The array containing strings.",
        ],
        hints: [
          "Look at the lower bound: 0 <= N.",
          "What happens if you ask for min([])?",
        ],
        marks: 2,
        correct_index: 1,
        explanation: "Because N can be 0, attempting array[0] without checking array length will cause an IndexOutOfBounds error.",
        option_explanations: [
          "Impossible given N >= 0.",
          "Correct: Array of length 0 has no minimum element.",
          "Impossible given N <= 10,000.",
          "Types are constrained to numbers.",
        ],
      },
      {
        question_id: "m3q04",
        sort_order: 4,
        title: "Memory limits and space complexity",
        prompt: "A problem allows 256MB of memory. An engineer creates a 2D matrix of size 100,000 x 100,000 of 4-byte integers. What happens?",
        options: [
          "The matrix uses ~40 Kilobytes and runs fine.",
          "The matrix uses ~40 Gigabytes and causes Out of Memory crash.",
          "The matrix automatically compresses to 1MB.",
          "The program runs 10x faster.",
        ],
        hints: [
          "100,000 * 100,000 = 10^10 cells.",
          "10^10 * 4 bytes = 40,000,000,000 bytes = 40 GB.",
        ],
        marks: 2,
        correct_index: 1,
        explanation: "A 10^5 x 10^5 matrix requires 40GB of RAM, immediately triggering Out of Memory (OOM) on a 256MB budget.",
        option_explanations: [
          "Calculation error.",
          "Correct: 40 GB exceeds 256 MB by over 150 times.",
          "Standard arrays do not magically compress.",
          "Absurd.",
        ],
      },
    ],
  },

  4: {
    moduleNumber: 4,
    stageNumber: 1,
    stageTitle: "STAGE 01 · READ & DEFINE THE PROBLEM",
    title: "Separate Facts, Assumptions and Unknowns",
    objective: "Distinguish what the problem guarantees from what a solver is tempted to assume, and identify what must be clarified.",
    readTime: "20 min read",
    coreFocus: "Explicit Guarantees · Unsafe Assumptions · Clarification Strategy",
    sections: [
      {
        kicker: "SECTION 01 · THE HAZARD OF SILENT ASSUMPTIONS",
        title: "How Assumptions Destroy Correctness",
        content: [
          "In technical interviews and production specs, the most dangerous bugs come from what the engineer *assumed* was true without verifying.",
          "Common silent assumptions:",
          "• Assuming list is sorted (because the example looked sorted).",
          "• Assuming positive numbers (because all examples were positive).",
          "• Assuming keys are unique.",
          "• Assuming strings contain only ASCII letters (and failing on spaces, emojis, or Unicode).",
        ],
      },
    ],
    caseStudies: [
      {
        tag: "CASE STUDY · PALINDROME WITH PUNCTUATION",
        title: "The Silent Assumption of Alphanumeric Input",
        problem: "Check if a string is a palindrome. The example is 'racecar'.",
        flawedApproach: "Assuming all characters are lowercase letters and reversing the string. When tested against 'A man, a plan, a canal: Panama!', the code fails because it didn't clarify case-insensitivity and punctuation filtering.",
        correctInvariant: "Clarify whether punctuation and capitalization should be ignored before implementing.",
      },
    ],
    checklist: [
      "Is this fact stated explicitly in the prompt?",
      "Did I deduce this only from looking at the sample test case?",
      "What if input numbers are negative?",
      "What if strings contain punctuation or whitespace?",
    ],
    practiceTask: {
      id: "task-04",
      title: "Practice Challenge: Fact vs. Assumption Audit",
      scenario: "Requirement: 'Given a list of employee salaries, find the median salary. Sample: [40000, 50000, 60000] -> 50000.'",
      prompt: "Identify 3 assumptions that would cause code to fail on edge cases.",
      starterTemplate: "// Assumption 1:\n// Assumption 2:\n// Assumption 3:\n",
      modelSolution: "1. Assuming the list is already sorted (sample is sorted, but input might be unsorted).\n2. Assuming list length is always odd (if even, median is average of middle two).\n3. Assuming no duplicate salaries or negative values.",
      rubric: [
        "Identifies unsorted input risk.",
        "Identifies even-length list definition ambiguity.",
        "Identifies duplicate handling.",
      ],
    },
    questions: [
      {
        question_id: "m4q01",
        sort_order: 1,
        title: "Detect unsafe sample-based assumptions",
        prompt: "The sample test case for an array problem is: [2, 4, 6, 8]. Which assumption is UNSAFE to make?",
        options: [
          "The array contains integers.",
          "The array will always contain only even numbers.",
          "The array length is at least 4 in this example.",
          "The elements are indexed from 0.",
        ],
        hints: [
          "Sample cases show ONE valid example, not the universal constraint.",
          "Just because the sample has even numbers does not mean all inputs are even.",
        ],
        marks: 2,
        correct_index: 1,
        explanation: "Generalizing from sample data without prompt confirmation is a major source of bugs.",
        option_explanations: [
          "Safe assumption if typed as int array.",
          "Correct: Assuming all inputs are even is completely ungrounded.",
          "Factual for the sample.",
          "Standard convention.",
        ],
      },
      {
        question_id: "m4q02",
        sort_order: 2,
        title: "Identify facts vs assumptions",
        prompt: "A problem states: 'You are given a non-empty array of integers.' Which of the following is an explicit FACT?",
        options: [
          "The array is sorted.",
          "The array contains no negative numbers.",
          "The array contains at least 1 element.",
          "All elements are unique.",
        ],
        hints: [
          "Look at the word 'non-empty'.",
          "What does non-empty guarantee?",
        ],
        marks: 2,
        correct_index: 2,
        explanation: "'Non-empty' explicitly guarantees length >= 1. Sortedness and uniqueness are assumptions.",
        option_explanations: [
          "Unstated assumption.",
          "Unstated assumption.",
          "Correct: Explicit guarantee.",
          "Unstated assumption.",
        ],
      },
    ],
  },

  5: {
    moduleNumber: 5,
    stageNumber: 1,
    stageTitle: "STAGE 01 · READ & DEFINE THE PROBLEM",
    title: "Use Examples and Counterexamples",
    objective: "Create examples that confirm the interpretation and counterexamples that expose an incomplete or incorrect reading.",
    readTime: "22 min read",
    coreFocus: "Trace Examples · Counterexample Construction · Hypothesis Falsification",
    sections: [
      {
        kicker: "SECTION 01 · FALSIFICATION IN ALGORITHMS",
        title: "How to Disprove a False Intuition in 30 Seconds",
        content: [
          "When solving an unfamiliar problem, your brain naturally proposes a greedy heuristic: 'What if we always pick the largest item first?'",
          "Top engineers don't start coding immediately. They actively construct a **counterexample**—a small, precise test case designed to break their own proposed idea.",
          "If a proposed greedy strategy fails on an array of 3 elements, you saved 45 minutes of debugging futile code.",
        ],
      },
    ],
    caseStudies: [
      {
        tag: "CASE STUDY · COIN CHANGE GREEDY FAILURE",
        title: "When Greedy Choice Fails",
        problem: "Make change for 6 cents using coins [1, 3, 4] with the minimum number of coins.",
        flawedApproach: "Greedy heuristic: Always pick the largest coin (4). Remaining is 2, requiring two 1-cent coins. Total coins: 3 (4 + 1 + 1).",
        correctInvariant: "Counterexample exposes the flaw: Optimal solution is two 3-cent coins (3 + 3 = 6), total 2 coins! Greedy choice is invalid; dynamic programming is required.",
      },
    ],
    checklist: [
      "Did I test a minimal non-trivial example?",
      "Can I construct a small case where my first idea produces the wrong answer?",
      "What happens when all elements are identical?",
    ],
    practiceTask: {
      id: "task-05",
      title: "Practice Challenge: Construct a Greedy Counterexample",
      scenario: "A junior programmer proposes: 'To find the longest increasing subsequence in an array, we can just start with the smallest element and greedily add any larger number next.'",
      prompt: "Construct a 4-element array that disproves this greedy strategy.",
      starterTemplate: "// Counterexample array:\n// What greedy produces:\n// What the true answer is:\n",
      modelSolution: "Array: [10, 1, 2, 3]\nGreedy starting at smallest: picks 1, then 2, 3 -> length 3 (correct).\nCounterexample: [2, 100, 3, 4, 5]\nIf you start at smallest (2), then greedily jump to largest next (100), you get [2, 100] (len 2). The true LIS is [2, 3, 4, 5] (len 4).",
      rubric: [
        "Provides concrete small array.",
        "Shows greedy outcome.",
        "Demonstrates optimal outcome beating greedy.",
      ],
    },
    questions: [
      {
        question_id: "m5q01",
        sort_order: 1,
        title: "Purpose of a counterexample",
        prompt: "Why should an engineer deliberately try to construct a counterexample to their own algorithm idea?",
        options: [
          "To prove that computer science is impossible.",
          "To quickly expose flaws and incorrect assumptions before wasting time writing wrong code.",
          "To make the code run slower.",
          "To confuse the code reviewer.",
        ],
        hints: [
          "Finding a bug in thought takes 30 seconds. Finding it in 50 lines of code takes 30 minutes.",
        ],
        marks: 2,
        correct_index: 1,
        explanation: "Counterexamples allow rapid hypothesis testing and prevent coding dead ends.",
        option_explanations: [
          "Nonsense.",
          "Correct: Fast falsification saves massive engineering time.",
          "Incorrect.",
          "Incorrect.",
        ],
      },
      {
        question_id: "m5q02",
        sort_order: 2,
        title: "Counterexample to greedy coin change",
        prompt: "For coin denominations [1, 6, 10], which target amount serves as a counterexample proving greedy choice (picking largest coin first) is sub-optimal?",
        options: [
          "Amount = 10 (Greedy picks 10, total 1 coin)",
          "Amount = 12 (Greedy picks 10 + 1 + 1 = 3 coins; optimal is 6 + 6 = 2 coins)",
          "Amount = 6 (Greedy picks 6, total 1 coin)",
          "Amount = 1 (Greedy picks 1, total 1 coin)",
        ],
        hints: [
          "Test 12: Largest coin is 10. Leaves 2.",
          "Compare 10+1+1 (3 coins) with 6+6 (2 coins).",
        ],
        marks: 2,
        correct_index: 1,
        explanation: "For target 12, greedy picks 10+1+1 (3 coins). Optimal is two 6-cent coins (2 coins).",
        option_explanations: [
          "Greedy succeeds here.",
          "Correct: 12 cleanly disproves greedy.",
          "Greedy succeeds here.",
          "Greedy succeeds here.",
        ],
      },
    ],
  },

  6: {
    moduleNumber: 6,
    stageNumber: 1,
    stageTitle: "STAGE 01 · READ & DEFINE THE PROBLEM",
    title: "Discover Edge Cases Before Solving",
    objective: "Identify empty, minimal, maximal, repeated, missing and unusual inputs relevant to a task.",
    readTime: "22 min read",
    coreFocus: "Boundary Analysis · Extreme Values · Nullability · Symmetry Breakers",
    sections: [
      {
        kicker: "SECTION 01 · SYSTEMATIC EDGE TESTING",
        title: "The 6 Universal Boundary Vectors",
        content: [
          "Professional software fails at the boundaries. If an algorithm works for normal arrays of size 5, it usually crashes on:",
          "1. N = 0 (Empty input).",
          "2. N = 1 (Single element where loops or pairs don't execute).",
          "3. All elements identical: [5, 5, 5, 5] (infinite loops in quicksort or tie-breakers).",
          "4. Negative numbers and zero: [-5, 0, 10].",
          "5. Already sorted or reverse sorted: [1, 2, 3] vs [3, 2, 1].",
          "6. Maximum allowable values causing overflow.",
        ],
      },
    ],
    caseStudies: [
      {
        tag: "CASE STUDY · BINARY SEARCH MIDPOINT OVERFLOW",
        title: "The 20-Year-Old Java Binary Search Bug",
        problem: "Calculate midpoint: `mid = (low + high) / 2`.",
        flawedApproach: "When `low` and `high` are around 1.5 * 10^9, their sum is 3.0 * 10^9, exceeding 2^31-1 and overflowing to a negative number!",
        correctInvariant: "Use `mid = low + (high - low) / 2` to prevent overflow entirely.",
      },
    ],
    checklist: [
      "Have I tested N = 0 and N = 1?",
      "Have I tested all identical elements?",
      "Have I tested alternating values?",
      "Can pointers cross or walk off the array boundary?",
    ],
    practiceTask: {
      id: "task-06",
      title: "Practice Challenge: Generate an Edge Case Matrix",
      scenario: "You are implementing a string compression function: 'aabcccccaaa' -> 'a2b1c5a3'. If compressed string is not smaller than original, return original.",
      prompt: "List 4 distinct edge cases that must be tested before releasing.",
      starterTemplate: "// Edge Case 1:\n// Edge Case 2:\n// Edge Case 3:\n// Edge Case 4:\n",
      modelSolution: "1. Empty string \"\" -> return \"\"\n2. Single character \"a\" -> \"a1\" (length 2 > 1) -> return \"a\"\n3. String with no duplicates \"abcdef\" -> length increases -> return \"abcdef\"\n4. String with all same character \"aaaa\" -> return \"a4\"",
      rubric: [
        "Empty string handled.",
        "Single character handled.",
        "String where compression expands length handled.",
        "Uniform character string handled.",
      ],
    },
    questions: [
      {
        question_id: "m6q01",
        sort_order: 1,
        title: "Prevent mid overflow in binary search",
        prompt: "Why is mid = low + (high - low) / 2 preferred over mid = (low + high) / 2 in systems programming?",
        options: [
          "It uses less memory.",
          "It prevents signed 32-bit integer overflow when low + high exceeds 2,147,483,647.",
          "It is mathematically incorrect but faster.",
          "It converts the numbers to floats.",
        ],
        hints: [
          "What happens if low and high are both 1.5 billion?",
          "1.5B + 1.5B = 3.0B, which exceeds 2^31 - 1.",
        ],
        marks: 2,
        correct_index: 1,
        explanation: "low + (high - low) / 2 evaluates identical mathematics without allowing the addition to exceed the integer limit.",
        option_explanations: [
          "Incorrect.",
          "Correct: Classic fix discovered in Java's standard library after 20 years.",
          "Incorrect: It is mathematically identical.",
          "Incorrect.",
        ],
      },
      {
        question_id: "m6q02",
        sort_order: 2,
        title: "Edge case for two pointers",
        prompt: "A two-pointer algorithm starts at left = 0 and right = N - 1. If N = 1, what are the initial pointer positions?",
        options: [
          "left = 0, right = 0",
          "left = 0, right = 1",
          "left = -1, right = 0",
          "The program crashes immediately.",
        ],
        hints: [
          "Calculate right = N - 1 when N = 1.",
          "1 - 1 = 0.",
        ],
        marks: 2,
        correct_index: 0,
        explanation: "When N = 1, left = 0 and right = 1 - 1 = 0. Both pointers point to the same single element.",
        option_explanations: [
          "Correct: Both point to index 0.",
          "Off by one.",
          "Invalid index.",
          "Incorrect.",
        ],
      },
    ],
  },

  7: {
    moduleNumber: 7,
    stageNumber: 1,
    stageTitle: "STAGE 01 · READ & DEFINE THE PROBLEM",
    title: "Write Observable Acceptance Criteria",
    objective: "Convert a vague request into conditions that a proposed result must satisfy to be considered correct.",
    readTime: "20 min read",
    coreFocus: "Testability · Black-Box Verification · Deterministic Pass/Fail",
    sections: [
      {
        kicker: "SECTION 01 · OBSERVABILITY",
        title: "Making Correctness Measurable",
        content: [
          "A problem specification is useless if two senior engineers can disagree on whether the output is correct.",
          "Observable acceptance criteria define correctness purely in terms of testable output properties:",
          "• Property 1: The output array must contain all elements of input array without duplicates.",
          "• Property 2: Elements must be strictly ordered such that result[i] <= result[i+1].",
          "• Property 3: If no valid element exists, the function must return -1.",
        ],
      },
    ],
    caseStudies: [
      {
        tag: "CASE STUDY · LEADERBOARD RANKING",
        title: "Tie-Breaking Acceptance Criteria",
        problem: "Rank players by score. Players Alice and Bob both have score 500.",
        flawedApproach: "Acceptance criteria simply says: 'Return players in score order.' (Leaves tie order undefined).",
        correctInvariant: "Observable Criteria: 'Sort by score descending. For identical scores, sort alphabetically by username ascending.'",
      },
    ],
    checklist: [
      "Can a test suite verify this without inspecting internal variables?",
      "Are tie-breaking rules explicitly stated?",
      "Is the empty input result testable?",
    ],
    practiceTask: {
      id: "task-07",
      title: "Practice Challenge: Write 3 Acceptance Criteria",
      scenario: "A payment service reconciles bank transfers. It receives transactions from Source A and Source B and must output unmatched transfers.",
      prompt: "Write 3 observable acceptance criteria for the output.",
      starterTemplate: "// Criteria 1:\n// Criteria 2:\n// Criteria 3:\n",
      modelSolution: "1. An output record must exist for any transaction ID present in Source A but absent in Source B.\n2. An output record must exist for any transaction ID where amount in Source A != amount in Source B.\n3. Output list must be sorted by transaction timestamp in ascending order, or return empty list if all match.",
      rubric: [
        "Covers missing IDs.",
        "Covers mismatched amounts.",
        "Defines output sorting or empty state.",
      ],
    },
    questions: [
      {
        question_id: "m7q01",
        sort_order: 1,
        title: "Characteristics of good acceptance criteria",
        prompt: "Which criterion is observable and testable?",
        options: [
          "The code should be written neatly.",
          "The output list must be sorted in descending order, with ties broken by original input index.",
          "The algorithm should feel fast.",
          "The author must understand recursion.",
        ],
        hints: [
          "Look for objective, verifiable properties.",
        ],
        marks: 2,
        correct_index: 1,
        explanation: "Sorting order and tie-breaking are deterministic, measurable output properties.",
        option_explanations: [
          "Subjective.",
          "Correct: Observable black-box criterion.",
          "Subjective.",
          "Unmeasurable internal mental state.",
        ],
      },
    ],
  },

  8: {
    moduleNumber: 8,
    stageNumber: 1,
    stageTitle: "STAGE 01 · READ & DEFINE THE PROBLEM",
    title: "Decompose a Task into Subproblems",
    objective: "Break a multi-part request into smaller outcomes that can be solved and checked independently.",
    readTime: "22 min read",
    coreFocus: "Decomposition · Subgoals · Single Responsibility",
    sections: [
      {
        kicker: "SECTION 01 · DECOMPOSITION",
        title: "Taming Overwhelming Complexity",
        content: [
          "When faced with a 3-page problem description, beginners get stuck trying to solve everything in one gigantic nested loop.",
          "Senior engineers decompose the goal into independent subproblems:",
          "Step 1: Sanitize and parse input into structured records.",
          "Step 2: Filter records by validity predicate.",
          "Step 3: Aggregate metric into frequency map.",
          "Step 4: Select top-k elements using heap or partial sort.",
        ],
      },
    ],
    caseStudies: [
      {
        tag: "CASE STUDY · LOG PARSER",
        title: "HTTP 500 Error Spike Detection",
        problem: "Given raw server log strings, alert if HTTP 500 error rate exceeds 5% in any 5-minute sliding window.",
        flawedApproach: "Writing a single regex while tracking rolling windows and averages in one tangled loop.",
        correctInvariant: "Decompose into 3 clean stages: (1) Parse line to (timestamp, status), (2) Bucket errors by minute, (3) Sliding window sum over 5-minute buckets.",
      },
    ],
    checklist: [
      "Can this subproblem be tested with its own unit test?",
      "Does this step depend on the internal state of another step?",
    ],
    practiceTask: {
      id: "task-08",
      title: "Practice Challenge: Decompose a Feature",
      scenario: "Build a word frequency cloud for a document: ignore punctuation, ignore common stop words ('the', 'and', 'is'), convert to lowercase, and return the top 5 most frequent words.",
      prompt: "Decompose this into 4 sequential subproblems.",
      starterTemplate: "// Subproblem 1:\n// Subproblem 2:\n// Subproblem 3:\n// Subproblem 4:\n",
      modelSolution: "1. Tokenize document by splitting on whitespace and stripping punctuation.\n2. Normalize tokens to lowercase.\n3. Filter out tokens present in StopWords set.\n4. Count frequencies in Map and extract top 5 keys by frequency.",
      rubric: [
        "Tokenization/stripping separated.",
        "Normalization separated.",
        "Filtering separated.",
        "Counting/ranking separated.",
      ],
    },
    questions: [
      {
        question_id: "m8q01",
        sort_order: 1,
        title: "Benefit of subproblem decomposition",
        prompt: "Why is decomposing a complex task into independent subproblems beneficial?",
        options: [
          "It allows each subproblem to be reasoned about, implemented, and unit-tested in isolation.",
          "It makes the program take more CPU cycles.",
          "It prevents other developers from reading your code.",
          "It guarantees 100% test coverage automatically.",
        ],
        hints: [
          "Isolation makes reasoning and debugging simple.",
        ],
        marks: 2,
        correct_index: 0,
        explanation: "Isolated subproblems reduce cognitive load and simplify testing.",
        option_explanations: [
          "Correct: Core tenet of modular engineering.",
          "Incorrect.",
          "Incorrect.",
          "Incorrect.",
        ],
      },
    ],
  },

  9: {
    moduleNumber: 9,
    stageNumber: 1,
    stageTitle: "STAGE 01 · READ & DEFINE THE PROBLEM",
    title: "Map Dependencies Between Subproblems",
    objective: "Determine which outputs are needed before other steps can begin and identify independent work.",
    readTime: "22 min read",
    coreFocus: "DAG Intuition · Execution Order · Dependency Bottlenecks",
    sections: [
      {
        kicker: "SECTION 01 · DEPENDENCY GRAPHS",
        title: "Ordering Computations Reliably",
        content: [
          "Subproblems have dependencies: Step B cannot start until Step A produces its output.",
          "Visualizing subproblems as a Directed Acyclic Graph (DAG) prevents sequence errors.",
          "Steps that don't depend on each other can be executed in parallel or in any order.",
        ],
      },
    ],
    caseStudies: [
      {
        tag: "CASE STUDY · COURSE PREREQUISITES",
        title: "Topological Build Order",
        problem: "To compile module C, you need modules A and B. Modules A and B only depend on Base.",
        flawedApproach: "Compiling C first, crashing with missing symbols.",
        correctInvariant: "Execution order must follow topological sort of dependencies: Base -> (A, B in parallel) -> C.",
      },
    ],
    checklist: [
      "Which step produces the input for this next step?",
      "Can these two steps execute concurrently?",
      "Is there a circular dependency deadlock?",
    ],
    practiceTask: {
      id: "task-09",
      title: "Practice Challenge: Map Subproblem Dependencies",
      scenario: "To generate a student's semester report card: Step A: Fetch exam grades. Step B: Fetch attendance records. Step C: Calculate GPA from grades. Step D: Determine academic probation status (needs both GPA and attendance). Step E: Render PDF.",
      prompt: "Draw the dependency ordering from start to finish.",
      starterTemplate: "// Level 1 (Independent):\n// Level 2 (Depends on Level 1):\n// Level 3 (Depends on Level 2):\n// Final Step:\n",
      modelSolution: "Level 1 (Independent): Fetch grades (A) and Fetch attendance (B).\nLevel 2: Calculate GPA (C, depends on A).\nLevel 3: Determine probation (D, depends on C and B).\nFinal: Render PDF (E, depends on D).",
      rubric: [
        "A and B identified as independent initial steps.",
        "C depending on A.",
        "D depending on both C and B.",
        "E as final consumer.",
      ],
    },
    questions: [
      {
        question_id: "m9q01",
        sort_order: 1,
        title: "Identify independent steps",
        prompt: "If Step 1 fetches user profile data and Step 2 fetches account balance from another API, what is their dependency relationship?",
        options: [
          "Step 2 must run before Step 1.",
          "They are independent and can execute concurrently.",
          "They form a circular deadlock.",
          "Step 1 cannot finish until Step 2 is deleted.",
        ],
        hints: [
          "Neither step requires data from the other.",
        ],
        marks: 2,
        correct_index: 1,
        explanation: "Independent network fetches can run concurrently via Promise.all / parallel threads.",
        option_explanations: [
          "No dependency exists.",
          "Correct: Independent steps can be executed concurrently.",
          "No circularity.",
          "Nonsense.",
        ],
      },
    ],
  },

  10: {
    moduleNumber: 10,
    stageNumber: 1,
    stageTitle: "STAGE 01 · READ & DEFINE THE PROBLEM",
    title: "Turn an Unclear Request into a Precise Brief",
    objective: "Resolve a realistic, imperfect problem statement into a bounded task with inputs, outputs, constraints and acceptance criteria.",
    readTime: "25 min read",
    coreFocus: "Capstone Synthesis · Requirement Clarification · Formal Problem Brief",
    sections: [
      {
        kicker: "SECTION 01 · CAPSTONE SYNTHESIS",
        title: "From Ambiguous Chat Message to Production Spec",
        content: [
          "This is the culmination of Stage 01. In the real world, product managers write requests like: 'Hey, let's make a search feature that shows the best matching products super fast.'",
          "Your job as an engineer is to synthesize all 9 previous modules into a single, bulletproof Problem Brief:",
          "1. De-noise the story and state the exact task invariant.",
          "2. Define the explicit Input and Output schemas.",
          "3. Specify all numerical constraints (N, latency, memory).",
          "4. Document all resolved ambiguities and verified assumptions.",
          "5. Define observable Acceptance Criteria.",
        ],
      },
    ],
    caseStudies: [
      {
        tag: "CASE STUDY · THE VAGUE CLIENT BRIEF",
        title: "The 'Smart Ride Dispatch' Brief",
        problem: "Client says: 'Match riders with nearby drivers quickly and fairly.'",
        flawedApproach: "Starting to code GPS distance formulas without defining 'nearby' (radius in km?), 'fairly' (FIFO or shortest ETA?), or 'quickly' (< 500ms?).",
        correctInvariant: "The Synthesized Brief specifies: Input: Rider(lat, lon), Drivers: List[(id, lat, lon, rating)]. Radius: <= 5km. Rule: Top driver by lowest ETA, tie-break by highest rating. Output: driver_id or null if none within 5km. Latency constraint: < 200ms.",
      },
    ],
    checklist: [
      "Is the task statement one clean sentence?",
      "Are all numerical bounds documented?",
      "Are all edge cases (empty, ties, errors) accounted for?",
      "Can another engineer build this specification without talking to me?",
    ],
    practiceTask: {
      id: "task-10",
      title: "Stage 01 Capstone: Author a Complete Engineering Brief",
      scenario: "CEO message: 'We need an analytics endpoint that tells us our top customers every week so marketing can send them discount gift cards.'",
      prompt: "Synthesize this into a complete, professional Problem Brief including Task Invariant, Input Contract, Output Contract, Constraints, and Acceptance Criteria.",
      starterTemplate: "## Problem Brief: Weekly Top Customers\n\n### 1. Task Invariant:\n### 2. Input Contract:\n### 3. Output Contract:\n### 4. Constraints & Edge Cases:\n### 5. Acceptance Criteria:\n",
      modelSolution: "## Problem Brief: Weekly Top Customers\n\n### 1. Task Invariant:\nIdentify distinct customers ranked by total settled spend over the preceding 7 calendar days.\n\n### 2. Input Contract:\nList[Transaction(customer_id: UUID, amount: Decimal, status: String, timestamp: ISO_Date)], TargetWeek: DateRange, TopK: Integer (default 10).\n\n### 3. Output Contract:\nList[CustomerSummary(customer_id: UUID, total_spend: Decimal, rank: Integer)] ordered by total_spend DESC.\n\n### 4. Constraints & Edge Cases:\n- Only include transactions with status == 'SETTLED'.\n- Handle ties by earliest account creation date.\n- If fewer than TopK customers exist, return all qualifying customers without padding.\n- If no transactions occurred, return empty list [].\n\n### 5. Acceptance Criteria:\n1. Output length <= TopK.\n2. Spend calculation excludes refunded/pending orders.\n3. Latency < 100ms for up to 1,000,000 weekly transactions.",
      rubric: [
        "Defines 'top' as total settled spend.",
        "Includes TopK parameter and tie-breaking rule.",
        "Handles edge cases (fewer than K, empty week, status filtering).",
        "Sets observable acceptance criteria.",
      ],
    },
    questions: [
      {
        question_id: "m10q01",
        sort_order: 1,
        title: "The mark of a production-ready brief",
        prompt: "What is the defining characteristic of a complete engineering problem brief?",
        options: [
          "It contains at least 50 pages of text.",
          "Another engineer can implement and verify the solution without having to guess or ask clarifying questions.",
          "It uses obscure academic notation.",
          "It includes the entire source code already written.",
        ],
        hints: [
          "A good brief is clear, self-contained, and removes ambiguity.",
        ],
        marks: 2,
        correct_index: 1,
        explanation: "A problem brief is complete when it provides an unambiguous specification that can be implemented and verified independently.",
        option_explanations: [
          "Length does not equal clarity.",
          "Correct: Self-contained, unambiguous specification.",
          "Obscurity harms collaboration.",
          "A brief specifies requirements, not the finished code.",
        ],
      },
    ],
  },
};
