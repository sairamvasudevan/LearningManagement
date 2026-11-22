import type { ModuleCurriculum } from "./types";

export const module01: ModuleCurriculum = {
  moduleNumber: 1,
  stageNumber: 1,
  stageTitle: "STAGE 01 · READ & DEFINE THE PROBLEM",
  title: "Separate the Story from the Task",
  objective: "Extract the unambiguous mathematical invariant from real-world narrative camouflage before touching code or choosing data structures.",
  readTime: "22 min deep read",
  coreFocus: "Story vs Task · Entity vs Event · Signal vs Noise · Observable Output Contract",
  sections: [
    {
      kicker: "SECTION 01 · THE PROBLEM-SOLVER'S TRAP",
      title: "Why 80% of Problem Solvers Fail Before Writing Code",
      content: [
        "In software architecture, systems engineering, and technical problem solving, challenges never arrive as clean mathematical formulations like 'Find the cardinality of the intersection of two disjoint sets.'",
        "Instead, problems arrive wrapped in dense business narratives: midnight flash sale promotions, airport baggage scanner logs, hospital triage vitals streams, or ride-hailing surge dispatch rules.",
        "The human brain is naturally wired for storytelling. When a problem mentions 'VIP customers waiting in the rain,' 'express parcel delivery vans,' or 'overheating IoT temperature sensors,' novices immediately start conceptualizing objects for 'Vans,' 'Rain,' or 'Sensors.' This is the storyteller's trap: modeling the emotional narrative rather than isolating the computational invariant."
      ],
      callout: {
        type: "warning",
        title: "The Junior Fallacy: Narrative Mimicry",
        text: "Modeling the story creates bloated, over-engineered mental models. High-velocity problem solvers mentally delete all adjectives, company names, and emotional drama to reveal the underlying set-theoretic or state-transition contract."
      }
    },
    {
      kicker: "SECTION 02 · CORE PEDAGOGICAL FRAMEWORK",
      title: "The Invariant Extraction Protocol (Signal vs. Noise)",
      content: [
        "To master problem solving without getting lost in language or syntax, master the 3 Foundational Distinctions:",
        "1. Entity vs. Event: An Event is a single transient timestamped occurrence (e.g., RFID card tap, GPS ping, button click). An Entity is the persistent real-world identity being tracked (e.g., the commuter, the delivery vehicle, the user account). Multiple events can belong to one entity. Counting event logs is NOT counting entities!",
        "2. State vs. Delta: An Event log represents deltas (e.g., +$5, -$12, status changed to 'in-transit'). The problem often asks for the final state or whether a cumulative invariant was breached. Confusing a stream of deltas with cumulative state causes catastrophic off-by-one and double-counting errors.",
        "3. Guaranteed Preconditions vs. Casual Assumptions: Separate what the specification explicitly guarantees from what you naturally assume. If a problem states 'a list of timestamps,' never assume they are sorted chronologically, non-empty, or unique unless explicitly guaranteed."
      ],
      callout: {
        type: "rule",
        title: "The First Law of Problem Definition",
        text: "A task is only defined when you can state the observable output in exactly one sentence of the form: 'Given [Input X], return [Output Y] such that [Mathematical Invariant Z] holds true.'"
      }
    },
    {
      kicker: "SECTION 03 · THE MATHEMATICAL ABSTRACTION FILTER",
      title: "Translating Narrative into Pure Mathematical Sets",
      content: [
        "Every computable problem can be reduced to a mapping between mathematical spaces. When reading a 3-paragraph scenario, practice applying the Mathematical Abstraction Filter:",
        "• Noise Filter: Delete all proper nouns, brand names, backstories, and business justifications.",
        "• Entity Anchor: Identify the primary key of the universe (What identifies a unique subject?).",
        "• Predicate Sieve: What condition must be met for an entity to be included or transformed?",
        "• Reduction Operator: What is the final operation? (Count distinct, find maximum, detect existence, partition into equivalence classes, or find an optimal sequence?)."
      ],
      callout: {
        type: "tip",
        title: "The Zero-Code Stress Test",
        text: "If you cannot explain your solution using only pencil and paper on 3 hand-drawn test cases to a non-technical person, you do not understand the problem yet. Code cannot fix an ambiguous mental model."
      }
    },
    {
      kicker: "SECTION 04 · DISTRACTOR ARCHETYPES",
      title: "The 4 Classic Distractors in Problem Statements",
      content: [
        "Authors of complex technical challenges deliberately introduce noise. Learn to immediately recognize the 4 distractor archetypes:",
        "1. Chronological Camouflage: Describing events in the order they happened in the story, even when chronological order is irrelevant to the invariant (e.g., 'First Alice arrived, then Bob, then Alice bought coffee...').",
        "2. Redundant Attributes: Providing extraneous fields (e.g., customer zip code, device browser version, warehouse bay color) that have zero impact on the predicate.",
        "3. Procedural Suggestions: Hinting at how an existing manual process works ('The manager checks the binder then files a yellow paper'), which tempts novices to replicate a slow human process computationally.",
        "4. Scope Creep Baits: Mentioning downstream possibilities ('In the future we may want to send sms alerts') that are not part of the required output contract."
      ]
    }
  ],
  caseStudies: [
    {
      tag: "CASE STUDY A · E-COMMERCE MIDNIGHT FLASH SALE",
      title: "The Midnight Order Log Aggregator",
      problem: "A high-volume retail app records customer checkouts during a promotional midnight flash sale. Each log entry contains customer ID, checkout timestamp, order ID, product SKU, and discount token. Multiple orders can be placed by the same customer, and orders can contain multiple SKUs. The Director of Marketing asks: 'How many different shoppers made at least one qualifying purchase of more than $50 on June 12?'",
      flawedApproach: "Counting total checkout rows in the table where total > $50 (confuses log rows with unique humans), or grouping by order ID (one shopper placed 4 separate $60 orders, which would count that shopper 4 times).",
      correctInvariant: "Filter events where Date(timestamp) == 2026-06-12 AND OrderTotal > 50. Group by customer_id. Count the cardinality of the unique customer set.",
      codeOrContract: "Input: Stream of CheckoutEvents\nPredicate: Date == 2026-06-12 ∧ Total > $50\nInvariant: Cardinality(Distinct({event.customer_id}))"
    },
    {
      tag: "CASE STUDY B · TRANSIT SENSOR DEBOUNCING",
      title: "The Metro Turnstile Optical Sensor Glitch",
      problem: "A subway system uses infrared sensors on turnstiles. When a commuter passes through, mechanical vibrations occasionally cause the optical beam to break 2 to 3 times within 180 milliseconds for a single commuter. Each event logs sensor ID, turnstile ID, commuter smartcard ID, and timestamp. The station chief asks: 'How many distinct passengers entered Station 4 between 08:00 and 09:00?'",
      flawedApproach: "Counting the raw count of optical beam break events or applying an arbitrary time-window debouncing filter without looking at the smartcard identifier.",
      correctInvariant: "The physical vibration anomaly is completely bypassed by recognizing that commuter smartcard ID is the true entity. The task is strictly: Count distinct smartcard IDs recorded at Station 4 within [08:00, 09:00].",
      codeOrContract: "Noise: Beam bounce duration (<180ms)\nSignal: Distinct commuter_card_id within interval [08:00, 09:00]"
    },
    {
      tag: "CASE STUDY C · HOSPITAL PATIENT TRIAGE",
      title: "The Critical Patient Monitoring Stream",
      problem: "An ICU telemetry unit logs cardiac heart-rate telemetry pings every 5 seconds for 120 patients. A medical director asks: 'Identify all patients who experienced an sustained tachycardia episode (heart rate > 120 bpm for at least 3 consecutive pings) during the night shift.'",
      flawedApproach: "Returning any patient who had heart rate > 120 bpm at any single moment, or returning a count of total high-bpm pings across all rooms.",
      correctInvariant: "Partition event stream by patient_id. For each patient, detect whether there exists a contiguous sequence of 3 timestamps where heart_rate > 120. Return the set of unique patient IDs matching this predicate.",
      codeOrContract: "Target: Set of Patient_IDs where ∃ consecutive trio [p_i, p_{i+1}, p_{i+2}] with bpm > 120"
    }
  ],
  checklist: [
    "Have I identified the single primary entity whose cardinality or state is being evaluated?",
    "Have I separated log events (deltas) from cumulative entity identity?",
    "Have I mentally deleted all company names, emotional descriptions, and procedural suggestions?",
    "Can I write the input-to-output contract in a single mathematical sentence?",
    "Are there any unrequested tasks (like sending notifications or sorting) that I am accidentally assuming?"
  ],
  practiceTask: {
    id: "task-01-airport-baggage",
    title: "Hands-on Practice: The Airport Carousel Reconciliation",
    scenario: "An international airport terminal handles 45 flights simultaneously. When luggage is unloaded from aircraft holds, baggage tags are scanned at 3 checkpoints: (1) Ramp Unload, (2) Conveyor Infeed, and (3) Passenger Carousel Egress. Due to conveyor jams, some bags are scanned twice at checkpoint 2. Furthermore, airport staff occasionally scan test calibration bags with prefix 'TEST-'. The Ramp Supervisor sends an urgent radio message: 'We need to know how many actual passenger luggage items from Flight QA-402 arrived at Carousel 7 today but have not yet been scanned at the Carousel Egress.'",
    prompt: "Without writing code, formulate the exact problem specification: (1) Identify the primary Entity vs. Event noise. (2) List all narrative noise elements to discard. (3) Formulate the exact mathematical invariant condition for a bag to be included in the final answer.",
    starterTemplate: "1. PRIMARY ENTITY IDENTIFIER:\n[Specify what uniquely identifies a real item]\n\n2. DISCARDED NOISE & DISTRACTORS:\n[List events, duplicate scans, or test records to eliminate]\n\n3. FILTER PREDICATE:\n[Explicit conditions an item must satisfy]\n\n4. MATHEMATICAL INVARIANT FORMULATION:\n[Final count/set formula in one unambiguous sentence]",
    modelSolution: "1. PRIMARY ENTITY IDENTIFIER:\nUnique `bag_tag_id` (excluding test bags prefixed with 'TEST-') belonging to `flight_id == 'QA-402' AND destination_carousel == 7`.\n\n2. DISCARDED NOISE & DISTRACTORS:\n• Duplicate scans at Checkpoint 2 (Conveyor Infeed) caused by conveyor belt vibration/jams.\n• Calibration items where `bag_tag_id` starts with 'TEST-'.\n• Baggage items belonging to the other 44 flights or other carousels.\n\n3. FILTER PREDICATE:\n• Bag belongs to Flight QA-402.\n• Target Carousel is 7.\n• Scanned at Checkpoint 1 (Ramp Unload) OR Checkpoint 2 (Conveyor Infeed) with Date == Today.\n• NOT scanned at Checkpoint 3 (Passenger Carousel Egress).\n\n4. MATHEMATICAL INVARIANT FORMULATION:\nOutput = Count( Distinct( { bag_tag_id | bag ∈ Bags(QA-402, Today, Carousel 7) ∧ bag_tag_id NOT LIKE 'TEST-%' ∧ (Infeed_Scanned(bag) ∨ Ramp_Scanned(bag)) ∧ ¬Egress_Scanned(bag) } ) )",
    rubric: [
      "Explicitly distinguished distinct bag_tag_id from duplicate scan events",
      "Filtered out test calibration items ('TEST-')",
      "Scoped strictly to flight QA-402, Carousel 7, and date Today",
      "Formulated the set difference: (Bags that entered the system) MINUS (Bags scanned at exit)",
      "Did not introduce unrequested procedural steps or code classes"
    ]
  },
  questions: [
    {
      question_id: "m1q01",
      sort_order: 1,
      title: "Entity vs. Event Discrimination",
      prompt: "An autonomous warehouse system records RFID pings as robotic pickers place parcels onto pallets. A single parcel can trigger 4 RFID reader pings as it moves along the sorter. The manager asks: 'How many parcels were sorted between 10:00 and 11:00?' Which calculation represents the correct invariant?",
      options: [
        "Count the total number of RFID scan events recorded between 10:00 and 11:00.",
        "Count the total number of robotic pickers that were active between 10:00 and 11:00.",
        "Count the cardinality of the set of unique parcel IDs that have at least one scan between 10:00 and 11:00.",
        "Divide the total RFID scan events by 4 to estimate the parcel volume."
      ],
      hints: [
        "Distinguish between the physical object being measured and the electronic sensors recording it.",
        "Can a parcel have 3 pings instead of 4 due to sensor latency? Avoid dividing by an estimated constant.",
        "The manager asked for 'how many parcels', which refers to unique physical items."
      ],
      marks: 2,
      correct_index: 2,
      explanation: "Parcels are the unique physical entities; RFID pings are sensor events. Counting the cardinality of distinct parcel IDs with timestamps in the window gives the exact invariant, independent of sensor ping anomalies.",
      option_explanations: [
        "Incorrect: Confuses sensor events with physical items. Because a parcel can trigger multiple pings, this drastically over-counts.",
        "Incorrect: Counts the robotic pickers instead of the parcels they handled.",
        "Correct: Accurately identifies the unique entity (parcel ID) and aggregates distinct items within the time predicate.",
        "Incorrect: Dividing by 4 relies on an unsafe assumption that every parcel triggered exactly 4 pings with zero sensor misses or double-reads."
      ]
    },
    {
      question_id: "m1q02",
      sort_order: 2,
      title: "Detecting Narrative Distractors",
      prompt: "A problem description details: 'A prestigious boutique cafe in downtown Seattle has 12 tables made of reclaimed oak. Baristas wear green aprons and enter orders on antique bronze tablets. If an order contains oat milk, the tablet beeps twice. Given a log of beverage orders with timestamps, customer names, beverage types, and milk selections, return whether oat milk was ordered more frequently than almond milk.' Which detail is relevant to the computational task?",
      options: [
        "The number of reclaimed oak tables (12) in the cafe.",
        "The beverage type and the milk selection associated with each order entry.",
        "The fact that baristas wear green aprons and their bronze tablets beep twice.",
        "The geographic location of the cafe in downtown Seattle."
      ],
      hints: [
        "Look strictly at what must be calculated: frequency comparison between oat milk and almond milk.",
        "Ask: If the cafe moved to Boston and had 20 tables, would the result of the calculation change?",
        "Only fields required to evaluate the milk counts matter."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "Only the milk selection attribute (and beverage order record) is needed to compute the count of oat milk versus almond milk. The table material, location, apron color, and tablet beeps are narrative camouflage.",
      option_explanations: [
        "Incorrect: Table count and furniture material have zero impact on beverage milk tallies.",
        "Correct: The milk selection is the exact attribute needed to count and compare oat vs almond milk orders.",
        "Incorrect: Physical barista attire and auditory tablet beeps are purely atmospheric narrative distractions.",
        "Incorrect: The physical city location is completely orthogonal to the mathematical invariant."
      ]
    },
    {
      question_id: "m1q03",
      sort_order: 3,
      title: "Recognizing Unrequested Scope Creep",
      prompt: "A technical prompt asks: 'Given a list of student exam scores, determine whether anyone scored 100.' Which approach demonstrates unrequested scope creep?",
      options: [
        "Iterate through the list and immediately return True upon finding the first score equal to 100, otherwise return False.",
        "Sort the entire list of scores in descending order, write an audit log to a file, calculate the class average, and check if the top element is 100.",
        "Check whether 100 is an element of the set of scores.",
        "Scan the scores and return a boolean flag indicating whether the maximum score is 100."
      ],
      hints: [
        "Scope creep involves doing work, sorting, or writing files that the prompt never asked for.",
        "The prompt asks for a simple boolean: did anyone score 100?",
        "Sorting an array or computing class averages when only an existential check was requested wastes computational resources and adds unnecessary failure points."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "Sorting the list, logging to disk, and computing the class average are unrequested operations. The task is an existential search: does the value 100 exist in the collection? Any extra workflow is scope creep.",
      option_explanations: [
        "Incorrect: This is an optimal early-exit existential check with zero scope creep.",
        "Correct: Sorting, audit logging, and calculating class averages are completely unrequested by the prompt.",
        "Incorrect: Set membership is a direct mathematical representation of the requested existence check.",
        "Incorrect: Checking if max == 100 is a valid (though slightly eager) way to determine if a score of 100 exists without unrequested side effects."
      ]
    },
    {
      question_id: "m1q04",
      sort_order: 4,
      title: "State vs. Delta Misclassification",
      prompt: "A bank account transaction ledger records deposits (+amounts) and withdrawals (-amounts). An auditor asks: 'What was the minimum account balance during the month of May?' A novice developer writes: 'Find the minimum transaction amount in the ledger.' Why is the novice developer's invariant completely wrong?",
      options: [
        "Because bank transactions are subject to federal holidays and interest charges.",
        "Because transaction amounts are deltas (changes in balance); the balance is the cumulative running prefix sum of all deltas over time.",
        "Because withdrawals must be stored as positive numbers with a separate debit enum.",
        "Because the minimum balance is always equal to the final balance at the end of the month."
      ],
      hints: [
        "If you deposit $1000 and withdraw $5, your balance is $995. What is the delta? What is the balance?",
        "Can an account with only large deposits have a minimum balance lower than any single deposit?",
        "Running balance depends on the cumulative sum of all preceding events."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "A transaction is a delta (an event altering state). Account balance is an accumulated state: Balance_t = Initial + Sum_{i=1}^t Delta_i. Finding the minimum delta only finds the single largest withdrawal, not the lowest balance point.",
      option_explanations: [
        "Incorrect: Federal holidays and bank policies are narrative background; they do not explain the mathematical error.",
        "Correct: The novice confused individual delta events with the cumulative prefix sum state of the account balance.",
        "Incorrect: Storage representation does not fix the fundamental mathematical error of confusing deltas with state.",
        "Incorrect: The balance could drop to $10 in mid-May and recover to $5000 by May 31; the minimum balance is not the final balance."
      ]
    },
    {
      question_id: "m1q05",
      sort_order: 5,
      title: "Observable Output Contract Formulation",
      prompt: "A logistics system monitors delivery vans. The prompt reads: 'Given the GPS coordinates of 50 delivery vans over an 8-hour shift, identify which vans traveled more than 150 kilometers.' What is the exact return type required by the observable output contract?",
      options: [
        "A float representing the total fleet fuel consumption.",
        "A collection of unique van identifiers whose individual cumulative path length exceeds 150 km.",
        "A 3D animated map showing the travel trajectories of all 50 vans.",
        "A sorted table containing the driver names, vehicle insurance dates, and GPS coordinates."
      ],
      hints: [
        "The prompt asks: 'identify which vans...'",
        "The answer must identify the entities that satisfied the distance predicate.",
        "Do not invent visualization dashboards or driver payroll tables not requested by the prompt."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "The prompt specifies: 'identify which vans traveled more than 150 km'. The observable contract is a collection/set of van identifiers matching the distance threshold predicate.",
      option_explanations: [
        "Incorrect: Total fuel consumption is completely unrequested and mathematically unrelated.",
        "Correct: Directly targets the requested entity set (van identifiers) meeting the cumulative distance predicate.",
        "Incorrect: An animated map is an elaborate presentation layer that was never requested.",
        "Incorrect: Introduces unrequested attributes (driver names, insurance dates) and unnecessary sorting."
      ]
    },
    {
      question_id: "m1q06",
      sort_order: 6,
      title: "Synthesizing the One-Sentence Invariant",
      prompt: "Consider this narrative: 'An online streaming service allows friends to host watch parties. Each watch party has a host and invited guests. During a party, participants can send emoji reactions. The platform logs every reaction with user ID, party ID, timestamp, and emoji code. Management wants to know: Did any watch party have more than 100 unique emoji reaction senders?' What is the cleanest one-sentence invariant?",
      options: [
        "Count all emoji reaction logs and check if the total log file exceeds 100 rows.",
        "Determine whether there exists any party ID where the cardinality of the distinct set of sender user IDs is greater than 100.",
        "Sort all watch parties by host name and send congratulations emails to popular hosts.",
        "Find the most popular emoji sent across all parties and check if it was used 100 times."
      ],
      hints: [
        "What is the grouping unit? (watch party)",
        "What is being counted within each group? (unique emoji reaction senders)",
        "What is the final answer type? (Boolean: Did *any* watch party have > 100?)"
      ],
      marks: 2,
      correct_index: 1,
      explanation: "The invariant requires grouping reaction events by party ID, calculating the cardinality of distinct user IDs per party, and checking if any group cardinality exceeds 100.",
      option_explanations: [
        "Incorrect: Counting total logs confuses multiple emojis sent by 1 person with 100 unique humans.",
        "Correct: Perfectly captures the group entity (party ID), distinct human entity set (sender user IDs), and the existential threshold (> 100).",
        "Incorrect: Scope creep involving sorting by host and sending emails.",
        "Incorrect: Confuses the frequency of an emoji symbol with the count of distinct human participants."
      ]
    }
  ]
};
