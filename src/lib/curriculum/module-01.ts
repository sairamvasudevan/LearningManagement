import type { ModuleCurriculum } from "./types";

export const module01: ModuleCurriculum = {
  moduleNumber: 1,
  stageNumber: 1,
  stageTitle: "STAGE 01 · READ & DEFINE THE PROBLEM",
  title: "Separate the Story from the Task",
  objective: "Extract the unambiguous mathematical invariant from real-world narrative camouflage before touching code or choosing data structures.",
  readTime: "25 min deep read",
  coreFocus: "Story vs Task · Entity vs Event · State vs Delta · Signal vs Noise · Observable Output Contract · Invariant Proof",
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
      title: "Entity vs. Event Discrimination in Sensor Telemetry",
      prompt: "An autonomous warehouse fulfillment system records RFID pings as robotic pickers transport tote bins along a conveyor loop. A single tote bin triggers between 3 to 5 multi-directional antenna pings as it moves past packaging station 12. Each log entry contains antenna_id, timestamp, tote_rfid_tag, conveyor_speed_mps, and signal_strength_rssi. The floor director asks: 'How many tote bins were routed to packaging station 12 between 08:00 and 09:00?' Which calculation extracts the exact mathematical invariant?",
      options: [
        "Count the total number of RFID antenna scan events recorded for station 12 between 08:00 and 09:00.",
        "Count the cardinality of the distinct set of tote_rfid_tag values recorded in scans for station 12 with timestamps in [08:00, 09:00].",
        "Divide the total RFID scan events for station 12 by 4 (the average antenna count per tote) and round to the nearest whole integer.",
        "Count the number of active human packers logged into station 12 and multiply by theoretical conveyor throughput."
      ],
      hints: [
        "Distinguish between the persistent physical object being measured and the electronic sensors recording it.",
        "Can a tote trigger 3 pings instead of 4 due to sensor latency? Never divide by an empirical estimated constant.",
        "The director asked for 'how many tote bins', which refers to unique physical items, not sensor packets."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "Tote bins are the unique physical entities; RFID pings are sensor events. Because each tote can trigger a variable number of pings (3 to 5), counting the cardinality of distinct tote_rfid_tag values in the time window yields the exact mathematical invariant, completely immune to sensor ping anomalies or conveyor speed variations.",
      option_explanations: [
        "Incorrect: Commits the classic Junior Fallacy of confusing sensor events with physical entities. Because one tote produces 3 to 5 pings, this drastically over-counts by 300% to 500%.",
        "Correct: Accurately isolates the unique entity identifier (tote_rfid_tag) and aggregates distinct items satisfying the spatial and temporal predicates.",
        "Incorrect: Dividing by 4 relies on an unsafe empirical assumption that every tote triggered exactly 4 pings with zero antenna misses or reflections.",
        "Incorrect: Commits the Distractor Fallacy by introducing staffing records and theoretical throughput instead of evaluating the actual observed arrivals."
      ]
    },
    {
      question_id: "m1q02",
      sort_order: 2,
      title: "Deconstructing Narrative Camouflage & Acoustic Distractors",
      prompt: "A quantitative trading firm's specification reads: 'In our Manhattan high-frequency trading desk, proprietary servers housed in liquid-submersion tanks execute equity orders. When an order executes with total dollar value > $1,000,000, an amber halogen lamp flashes on the server rack, and cooling fans ramp up from 1200 RPM to 3500 RPM. Given an audit stream of executed orders containing trade_id, ticker_symbol, share_quantity, execution_price_usd, trader_id, rack_fan_rpm, and liquid_coolant_temp_celsius, compute whether Apple stock (AAPL) had a higher cumulative dollar trading volume than Microsoft stock (MSFT) during the market session.' Which detail is mathematically relevant to the computational task?",
      options: [
        "The cooling fan duty cycle (1200 RPM to 3500 RPM) and liquid coolant temperature readings.",
        "The count of amber halogen lamp flashes triggered on the physical server rack.",
        "The product of share_quantity and execution_price_usd for execution records where ticker_symbol is AAPL or MSFT.",
        "The trader_id and the geographic location of the server rack in Manhattan."
      ],
      hints: [
        "Look strictly at what must be computed: cumulative dollar volume comparison between AAPL and MSFT.",
        "Ask: If the server was air-cooled in London and had no amber lamp, would the mathematical dollar volume of AAPL change?",
        "Dollar volume is purely price multiplied by quantity summed per ticker."
      ],
      marks: 2,
      correct_index: 2,
      explanation: "Cumulative dollar volume for any ticker is mathematically defined as Sum(share_quantity * execution_price_usd). Only ticker_symbol, share_quantity, and execution_price_usd are necessary. Fan speeds, coolant temperatures, amber lamps, and server geography are atmospheric narrative camouflage.",
      option_explanations: [
        "Incorrect: Fan RPM and coolant temperature are physical environmental side effects that have zero mathematical bearing on market dollar volume.",
        "Incorrect: Amber halogen flashes are theatrical narrative distractions representing an alert threshold, not the underlying transaction volume.",
        "Correct: Accurately isolates the essential attributes required to evaluate the invariant: DollarVolume(symbol) = Sum(share_quantity * execution_price_usd).",
        "Incorrect: Trader identity and server geography are redundant metadata attributes unrelated to the requested ticker comparison."
      ]
    },
    {
      question_id: "m1q03",
      sort_order: 3,
      title: "Cumulative State vs. Instantaneous Delta Ledger",
      prompt: "A neobank transaction ledger records deposits (+amounts) and merchant debits (-amounts) as signed numerical deltas. A customer support auditor asks: 'Did user U-9042 ever enter an overdraft state (account balance < $0.00) at any point during March?' A junior engineer writes: 'Find the minimum transaction amount for U-9042 in March and check if it is less than $0.00.' Why is the junior engineer's invariant completely flawed?",
      options: [
        "Because bank transactions are subject to federal holidays and interest fee calculations that must be simulated first.",
        "Because individual transaction amounts are deltas (changes in balance); account balance is an accumulated state: Balance_t = InitialBalance + Sum_{i=1}^t Delta_i. A user with $10,000 spending $50 has a negative delta (-$50) without overdrafting, while a user with $5 spending $10 overdrafts (-$5).",
        "Because withdrawals must be formatted as positive numbers with a separate debit enum flag in relational databases.",
        "Because the minimum balance of an account is guaranteed to always occur at the final transaction of the month."
      ],
      hints: [
        "If you start with $10,000 and spend $50, your transaction is -$50. Are you in overdraft?",
        "If you start with $10 and spend $15, your transaction is -$15. What is your balance?",
        "Running balance depends on the cumulative prefix sum of all preceding events, not the single largest transaction."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "A transaction record is a delta (an event altering state). Account balance is an accumulated state represented by the prefix sum of deltas over time: S_t = S_0 + Sum_{i=1}^t Delta_i. Finding the minimum delta only locates the single largest withdrawal, which tells you nothing about whether the cumulative balance ever dipped below zero.",
      option_explanations: [
        "Incorrect: Federal holidays and bank policies are narrative background; they do not explain the fundamental mathematical error.",
        "Correct: Precisely pinpoints the mathematical distinction between an instantaneous delta (Delta_i) and the prefix sum state (Balance_t).",
        "Incorrect: Schema formatting and enum flags are implementation details that do not resolve the core mathematical flaw.",
        "Incorrect: Accounts fluctuate constantly; a balance could drop to -$20 mid-month and recover to +$5,000 before month-end."
      ]
    },
    {
      question_id: "m1q04",
      sort_order: 4,
      title: "Detecting Unrequested Scope Creep & Eager Side Effects",
      prompt: "A cloud security audit prompt states: 'Given an unsorted sequence of 10,000,000 firewall drop events from the perimeter gateway, determine whether any event originated from the known compromised CIDR subnet 198.51.100.0/24.' Which approach represents unrequested scope creep that introduces unnecessary latency and failure modes?",
      options: [
        "Streaming each event IP through a bitwise subnet mask check and immediately returning true upon encountering the first match, otherwise returning false.",
        "Parsing the entire 10,000,000 event stream into an in-memory hash set, generating a formatted PDF audit report, resolving reverse DNS for all IPs, sorting the IPs by geographic country code, and paging the on-call engineer.",
        "Evaluating an early-exit loop: for event in events: if in_subnet(event.ip): return True; return False.",
        "Using a short-circuiting iterator search that halts evaluation as soon as the existential predicate evaluates to true."
      ],
      hints: [
        "The prompt asks a pure boolean question: Did *any* event originate from the subnet?",
        "Scope creep means performing work, formatting files, or invoking external side effects that were never requested.",
        "Sorting millions of records, reverse DNS lookups, and generating PDFs waste massive compute and add third-party failure points."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "The task is a pure existential query: Exists(e in Events such that e.ip in Subnet). The optimal solution short-circuits on the first positive match in O(1) space. Parsing all events into memory, performing reverse DNS lookups, sorting geographically, generating PDFs, and sending alerts are unrequested operations that turn an O(1) space streaming task into a slow, crash-prone O(N) memory batch process.",
      option_explanations: [
        "Incorrect: This is an optimal early-terminating streaming algorithm with zero scope creep.",
        "Correct: Accurately identifies massive unrequested scope creep (in-memory caching, PDF generation, reverse DNS, sorting, alerting) that violates the minimal contract.",
        "Incorrect: This is a textbook early-exit loop directly satisfying the boolean requirement.",
        "Incorrect: Short-circuiting iterator evaluation is computationally minimal and adheres strictly to the contract."
      ]
    },
    {
      question_id: "m1q05",
      sort_order: 5,
      title: "Multi-Entity Debouncing & Physical Sensor Noise",
      prompt: "An urban rapid-transit system uses infrared optical beams on turnstiles. When a commuter passes through, coats, bags, or physical vibration can cause the optical beam to break 2 to 3 times within 150 milliseconds. Each log entry contains gate_id, beam_event_id, commuter_card_id, timestamp_ms, and gate_direction ('IN' | 'OUT'). The Director of Transit asks: 'How many distinct commuters entered Station 4 through Gate G-02 between 08:00:00.000 and 09:00:00.000?' A junior developer proposes applying a 200ms time-window debouncing filter on the raw optical beam events without inspecting commuter_card_id. Why will this approach fail in high-density rush hour?",
      options: [
        "Because optical beams have variable wavelengths that require infrared spectrum calibration in winter months.",
        "Because during rush hour, two distinct commuters walking closely tail-to-nose can pass the gate within 180ms; a purely time-based debouncer will merge two real commuters into one, whereas distinct commuter_card_id values unambiguously identify individual passengers regardless of sensor bounce.",
        "Because transit turnstiles automatically lock their mechanical barriers whenever an optical beam breaks twice within 150ms.",
        "Because millisecond timestamps in distributed systems suffer from microsecond clock skew across gateway microcontrollers."
      ],
      hints: [
        "What is the true entity representing a human passenger?",
        "If commuter A taps their card at 08:15:00.100 and commuter B taps immediately behind them at 08:15:00.220, what happens if you drop events within 200ms without checking who tapped?",
        "Physical debouncing conflates separate entities when physical arrivals occur within the debouncing window."
      ],
      marks: 3,
      correct_index: 1,
      explanation: "Optical beam breaks are physical sensor events prone to mechanical chatter. When two distinct passengers enter in close succession during rush hour, their physical arrivals can easily fall within an arbitrary 200ms debouncing window, causing the system to undercount real commuters. The robust mathematical invariant completely ignores optical chatter and calculates: Cardinality(Distinct({commuter_card_id | gate == 'G-02' ∧ direction == 'IN' ∧ timestamp in Window})).",
      option_explanations: [
        "Incorrect: Optical wavelength calibration is hardware trivia with no bearing on the algorithmic aggregation logic.",
        "Correct: Pinpoints the fatal flaw of time-only debouncing in multi-entity environments: rapid successive arrivals of distinct entities get falsely collapsed.",
        "Incorrect: Mechanical barrier locking is unstated narrative speculation not supported by the problem statement.",
        "Incorrect: Microsecond clock drift between controllers does not explain why separate human arrivals get collapsed by a 200ms filter."
      ]
    },
    {
      question_id: "m1q06",
      sort_order: 6,
      title: "Temporal Sliding Window Invariants vs. Cumulative Counts",
      prompt: "An ICU cardiac telemetry monitor streams patient heart-rate readings every 10 seconds. The clinical alert specification states: 'Trigger a critical alert for any patient who sustains a heart rate >= 130 bpm continuously for at least 3 consecutive telemetry readings during a 1-hour shift window.'\nPatient P-101 has the sequence: [135, 132, 110, 138, 140, 142].\nPatient P-102 has the sequence: [131, 133, 129, 134, 136, 128].\nWhich patient(s) must trigger the critical alert, and what is the underlying algorithmic invariant?",
      options: [
        "Both P-101 and P-102, because both patients recorded at least 3 total readings >= 130 bpm across their session.",
        "Only P-101, because P-101 has a contiguous run of 3 consecutive readings [138, 140, 142] >= 130 bpm, whereas P-102's high readings were interrupted before ever reaching 3 consecutive occurrences.",
        "Neither patient, because neither patient maintained an average heart rate above 140 bpm across the 6 readings.",
        "Only P-102, because P-102's readings exhibit lower statistical variance around the 130 bpm baseline."
      ],
      hints: [
        "Read the specification wording with mathematical precision: 'continuously for at least 3 consecutive telemetry readings'.",
        "Does having 4 isolated spikes separated by normal readings satisfy '3 consecutive readings'?",
        "Inspect the exact sequence of P-101 vs P-102."
      ],
      marks: 3,
      correct_index: 1,
      explanation: "The invariant requires finding a contiguous subsegment of length >= 3 where every element satisfies heart_rate >= 130. For P-101, elements at index 3, 4, 5 are [138, 140, 142] >= 130 (consecutive streak = 3). For P-102, the streaks are [131, 133] (length 2, broken by 129) and [134, 136] (length 2, broken by 128); P-102 never achieves 3 consecutive readings.",
      option_explanations: [
        "Incorrect: Confuses cumulative frequency (Count >= 3 anywhere) with the temporal invariant of contiguous consecutive runs.",
        "Correct: Rigorously verifies the consecutive sequence predicate: P-101 achieves a streak of 3 at [138, 140, 142], while P-102 never exceeds a streak of 2.",
        "Incorrect: Invents an unrequested mean average threshold (140 bpm) not present in the specification.",
        "Incorrect: Invents statistical variance criteria unmentioned in the clinical protocol."
      ]
    },
    {
      question_id: "m1q07",
      sort_order: 7,
      title: "Observable Output Contract Formulation & Type Safety",
      prompt: "A microservice gateway processes distributed HTTP requests across 80 Kubernetes pods. Each log record contains: trace_id (UUID), service_name (string), http_status (int), latency_ms (int), and timestamp_utc (ISO string). The VP of Infrastructure requests: 'Identify which services experienced an error rate (HTTP 5xx responses) strictly greater than 5% among all services that handled at least 1,000 total requests today.' What is the exact formal mathematical invariant and return type of the observable output contract?",
      options: [
        "A list of all trace_id UUIDs whose http_status falls between 500 and 599.",
        "A set of unique service_name strings satisfying: { s | TotalRequests(s) >= 1000 ∧ (Count({ r ∈ Requests(s) | 500 <= r.status <= 599 }) / TotalRequests(s)) > 0.05 }.",
        "A single floating-point number representing the fleet-wide cluster error rate averaged across all pods.",
        "An interactive graphical dashboard mapping pod CPU utilization against 5xx error responses."
      ],
      hints: [
        "What entity is being requested? ('Identify which services...')",
        "What are the two filtering conditions? (Minimum 1000 requests handled AND > 5% 5xx rate).",
        "The output must be a collection of service identifiers, not individual request UUIDs or a single cluster-wide scalar."
      ],
      marks: 3,
      correct_index: 1,
      explanation: "The contract specifies: (1) Target Entity: service_name; (2) Volume Prerequisite: TotalRequests(s) >= 1000; (3) Error Ratio Sieve: ErrorCount(s) / TotalRequests(s) > 0.05; (4) Return Type: Set of service_name strings. Returning individual trace IDs, global cluster floats, or visual graphs violates the contract.",
      option_explanations: [
        "Incorrect: Returns individual request trace IDs instead of the qualifying service entities.",
        "Correct: Perfectly formalizes the multi-tier predicate (volume threshold >= 1000 and 5xx ratio > 0.05) and specifies the exact return type (set of service names).",
        "Incorrect: Returns a single global float scalar, losing all service-level identity.",
        "Incorrect: Presentation dashboard creep that fails to provide the programmatic output contract."
      ]
    },
    {
      question_id: "m1q08",
      sort_order: 8,
      title: "Guaranteed Preconditions vs. Casual Developer Assumptions",
      prompt: "A financial settlement engine receives batch settlement records from 30 regional partner banks: records = [{partner_id: 'BNK-1', amount_cents: 50000, tx_time: '14:02:11.104'}, ...]. The requirement states: 'Calculate the net daily settlement total per banking partner.' Which of the following is an UNSAFE casual assumption that will cause subtle bugs if not explicitly guaranteed by the specification?",
      options: [
        "Assuming that integer addition of currency amounts in cents is associative and commutative.",
        "Assuming that the settlement records in the input list are guaranteed to arrive strictly presorted in chronological order of tx_time.",
        "Assuming that each record has a partner_id attribute that can be used as a dictionary or hash map key.",
        "Assuming that partner_id values can be compared for string equality."
      ],
      hints: [
        "In distributed systems and asynchronous queues, do records always arrive in the exact order they occurred?",
        "If you write code that relies on sequential chronological ordering without an explicit sort step or spec guarantee, what happens when network packets arrive out of order?",
        "Never assume an input collection is sorted unless the problem specification explicitly states: 'Given a sorted list...'."
      ],
      marks: 3,
      correct_index: 1,
      explanation: "In real software engineering and algorithmic problems, inputs are unordered collections unless explicitly guaranteed to be sorted. Assuming that events arrive presorted by timestamp is one of the most common causes of production bugs in batch processors and streaming pipelines. If chronological order is required for an invariant (such as running balances), the engineer must either verify the precondition or explicitly sort the data.",
      option_explanations: [
        "Incorrect: Associativity and commutativity of integer addition are universal mathematical truths, not unsafe assumptions.",
        "Correct: Pinpoints the dangerous junior assumption of implicit sorting; without an explicit guarantee, assuming chronological ordering leads to silent correctness failures.",
        "Incorrect: The provided record schema explicitly defines partner_id as an attribute suitable for grouping.",
        "Incorrect: String equality comparison is a standard language primitive guaranteed for string identifiers."
      ]
    },
    {
      question_id: "m1q09",
      sort_order: 9,
      title: "Multi-Checkpoint State Machines & Set Difference Invariants",
      prompt: "An autonomous drone delivery hub dispatches urgent medical packages across 3 flight corridors. A package goes through 3 discrete lifecycle checkpoints:\n• Checkpoint A: Gantry_Pick (drone takes parcel from warehouse gantry)\n• Checkpoint B: Waypoint_Relay (drone pings an in-flight radio beacon)\n• Checkpoint C: Delivery_Drop (parcel confirmed released at customer pad)\nDue to telemetry retries, a drone can transmit multiple Waypoint_Relay pings for the same package. The logistics controller asks: 'How many distinct packages were picked up from the gantry today, have confirmed at least one in-flight waypoint relay ping, but have NOT yet been dropped at the customer pad?' What is the exact set-theoretic formulation?",
      options: [
        "Count(Waypoint_Relay events) - Count(Delivery_Drop events).",
        "| { p ∈ Packages(Today) | ScannedAt(p, A) ∧ ScannedAt(p, B) ∧ ¬ScannedAt(p, C) } | where p is identified by unique package_id.",
        "Count all packages whose latest recorded telemetry status string equals 'Waypoint_Relay'.",
        "Sum the total payload weight of all drones currently reporting battery levels above 40%."
      ],
      hints: [
        "Packages are the unique entities, identified by package_id.",
        "Can a package have 3 Waypoint_Relay pings? Subtracting raw event counts (Option 1) will fail completely.",
        "We want packages that satisfy A AND B AND NOT C."
      ],
      marks: 4,
      correct_index: 1,
      explanation: "The invariant operates on the set of unique package entities, not raw event tallies. The mathematical condition is the intersection of packages scanned at A, packages scanned at B, minus packages scanned at C: |(Packages_A ∩ Packages_B) \\ Packages_C|. Subtracting raw event counts fails because duplicate waypoint pings inflate the count.",
      option_explanations: [
        "Incorrect: Subtracts raw event counts. Because one package can generate 4 Waypoint_Relay pings and 1 drop event, subtracting counts produces meaningless numbers like 4 - 1 = 3 for 1 delivered parcel.",
        "Correct: Rigorously expresses the set-theoretic invariant on unique package identifiers: Scanned(A) ∧ Scanned(B) ∧ ¬Scanned(C).",
        "Incorrect: Relies on an unstated mutable 'latest status' field which breaks under out-of-order network arrival of delayed telemetry packets.",
        "Incorrect: Distractor calculation involving drone payload weight and battery levels completely orthogonal to package delivery status."
      ]
    },
    {
      question_id: "m1q10",
      sort_order: 10,
      title: "Boundary Traps & Zero-Division Invariants in Dynamic Ratios",
      prompt: "A ride-hailing dispatch platform calculates real-time surge pricing across city hexagonal geohash zones. The product requirement reads:\n'For each geohash zone H during a 5-minute window, evaluate the demand ratio: R = RideRequests / ActiveDrivers. If R > 2.0, output SURGE_ACTIVE; otherwise output STANDARD. If zero ride requests were made in zone H during the window, output STANDARD.'\nA developer writes the core evaluation line:\nstatus = 'SURGE_ACTIVE' if len(requests) / len(drivers) > 2.0 else 'STANDARD'\nUnder which realistic production boundary case will this code suffer an unhandled fatal runtime crash?",
      options: [
        "When requests has 1,000,000 items and drivers has 100 items due to 64-bit integer overflow.",
        "When a geohash zone has 0 active drivers (len(drivers) == 0), causing a ZeroDivisionError crash, because the developer casually assumed that available drivers is always strictly positive in every zone at all times.",
        "When all ride requests originate from corporate enterprise accounts rather than retail riders.",
        "When the timestamp format of the requests uses UTC epoch seconds instead of ISO-8601 strings."
      ],
      hints: [
        "Look at the denominator of the division: len(drivers).",
        "Can a remote suburban zone or late-night industrial zone have zero available drivers?",
        "What happens in almost every programming language when you divide a number by zero?"
      ],
      marks: 4,
      correct_index: 1,
      explanation: "The developer committed the Cardinal Boundary Assumption Fallacy by assuming len(drivers) > 0. In real-world ride-hailing, rural, suburban, or late-night zones frequently have 0 active drivers. Evaluating len(requests) / len(drivers) with len(drivers) == 0 triggers an immediate ZeroDivisionError exception, crashing the service. The robust invariant must explicitly guard: if len(drivers) == 0: return SURGE_ACTIVE if len(requests) > 0 else STANDARD.",
      option_explanations: [
        "Incorrect: 1,000,000 / 100 is 10,000.0, which is trivial for IEEE 754 floating point and nowhere near numeric overflow.",
        "Correct: Identifies the fatal ZeroDivisionError caused by failing to verify the boundary condition of an empty denominator in inactive zones.",
        "Incorrect: Rider account tiers are narrative distractions that have zero computational effect on division.",
        "Incorrect: Timestamp formats do not affect length calculations of collections."
      ]
    },
    {
      question_id: "m1q11",
      sort_order: 11,
      title: "Decomposition of Complex Multi-Attribute Clinical Specs",
      prompt: "Read this multi-hospital oncology clinical trial specification:\n'Across 12 participating cancer research centers (Johns Hopkins, Sloan Kettering, Mayo Clinic, etc.), clinical nurses log chemotherapy administrations. Each electronic record captures: log_id (UUID), hospital_name (string), patient_mrn (string), drug_code (string), infusion_dosage_mg (float), nurse_license_id (string), infusion_line_color (string), and administration_timestamp (ISO-8601). Research protocols mandate: Any patient who received a cumulative dosage of drug 'CTX-9' exceeding 750mg within any rolling 14-day window must be flagged for toxicity monitoring. Hospital staff note that Johns Hopkins uses blue infusion lines while Mayo uses purple lines, and nursing shifts rotate every 12 hours.'\nWhat is the MINIMAL attribute projection required to evaluate this clinical safety invariant?",
      options: [
        "{log_id, hospital_name, nurse_license_id, infusion_line_color}",
        "{patient_mrn, drug_code, infusion_dosage_mg, administration_timestamp}",
        "{hospital_name, patient_mrn, nurse_license_id, drug_code}",
        "{log_id, administration_timestamp, nurse_license_id, infusion_line_color}"
      ],
      hints: [
        "What identifies the patient? (patient_mrn)",
        "What identifies the drug being filtered? (drug_code)",
        "What numeric amount is being accumulated over what temporal constraint? (infusion_dosage_mg and administration_timestamp)",
        "Do nurse licenses, hospital names, or infusion line colors alter the patient's chemical dosage?"
      ],
      marks: 4,
      correct_index: 1,
      explanation: "The mathematical invariant is: For each patient_mrn and drug_code == 'CTX-9', does there exist a 14-day window [T, T + 14d] such that Sum(infusion_dosage_mg) > 750? The minimal projection is strictly: {patient_mrn, drug_code, infusion_dosage_mg, administration_timestamp}. Hospital names, nurse licenses, shift rotations, and tubing colors are narrative noise with zero impact on pharmacological dosage.",
      option_explanations: [
        "Incorrect: Retains nurse licenses, hospital names, and line colors (noise) while omitting the essential dosage and timestamp attributes.",
        "Correct: Pinpoints the exact minimal set of attributes needed to group by patient, filter by drug, window by timestamp, and sum by dosage.",
        "Incorrect: Retains hospital name and nurse license while completely discarding dosage and administration timestamp.",
        "Incorrect: Retains log_id and line color while omitting patient identity and dosage."
      ]
    },
    {
      question_id: "m1q12",
      sort_order: 12,
      title: "Formal Invariant Synthesis & Universal Quantification Proof",
      prompt: "A distributed consensus engine replicates key-value data across 3 geographically separated zones: {US-East, US-West, EU-Central}. When a critical configuration key K is updated to version V, an invalidation message is broadcast asynchronously. Because WAN links experience variable latency, messages arrive at unpredictable intervals.\nThe formal requirement specifies: 'Key K is deemed Globally Coherent at timestamp T if and only if every single availability zone has acknowledged receipt of version V (or higher) strictly prior to timestamp T.'\nWhich formal mathematical predicate expresses this invariant with complete rigor?",
      options: [
        "Sum_{z ∈ Zones} AcknowledgedVersion(z, K) >= V * 3",
        "∀ z ∈ {US-East, US-West, EU-Central}, ∃ ack ∈ Acks(z, K) such that (ack.version >= V ∧ ack.timestamp < T)",
        "∃ z ∈ {US-East, US-West, EU-Central} such that ∃ ack ∈ Acks(z, K) with (ack.version == V ∧ ack.timestamp < T)",
        "Average(Latency(US-East), Latency(US-West), Latency(EU-Central)) < 45ms"
      ],
      hints: [
        "The specification requires that 'every single availability zone' has acknowledged: does that mean universal quantification (∀) or existential quantification (∃)?",
        "If US-East acknowledges version 10 while US-West and EU-Central acknowledge version 0, what does a sum (Option 1) or an average do?",
        "Every zone z must individually possess a valid acknowledgment prior to time T."
      ],
      marks: 4,
      correct_index: 1,
      explanation: "Global coherence across all replicas requires universal quantification (∀ z in Zones). For each zone z, there must exist (∃ ack in Acks(z, K)) an acknowledgment satisfying two conjunctions: the version guarantee (ack.version >= V) AND the temporal guarantee (ack.timestamp < T). Summing versions (Option 1) allows one zone with a high version to mask two dead zones. Existential quantification (Option 3) only checks if one zone is coherent. Network latency averages (Option 4) provide zero state guarantees.",
      option_explanations: [
        "Incorrect: Uses an arithmetic sum. If US-East reports version 30 while US-West and EU-Central are dead at version 0, the sum is 30 >= 30, falsely claiming global coherence when two zones are completely out of date.",
        "Correct: Flawlessly applies universal quantification (∀ z) with existential acknowledgement verification (∃ ack) satisfying both the monotonic version bound and the temporal cut.",
        "Incorrect: Uses existential quantification (∃ z), which claims coherence as soon as ANY SINGLE zone acknowledges, leaving the remaining zones stale.",
        "Incorrect: Evaluates physical network latency averages, which is an operational metric that provides no mathematical guarantee of replica consistency."
      ]
    }
  ]
};
