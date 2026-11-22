import type { ModuleCurriculum } from "./types";

export const module09: ModuleCurriculum = {
  moduleNumber: 9,
  stageNumber: 1,
  stageTitle: "STAGE 01 · READ & DEFINE THE PROBLEM",
  title: "Map Dependencies Between Subproblems",
  objective: "Construct the Directed Acyclic Graph (DAG) of a multi-step task, establishing strict topological execution order, identifying independent parallel branches, and resolving circular deadlocks.",
  readTime: "24 min deep read",
  coreFocus: "Dataflow Architecture · Directed Acyclic Graphs (DAG) · Topological Ordering · Critical Path Analysis",
  sections: [
    {
      kicker: "SECTION 01 · THE FLOW OF INFORMATION",
      title: "Why Ordering is About Data, Not Storytelling",
      content: [
        "In naive problem solving, people sequence steps based on how a story was narrated to them: 'First the user enters the store, then they look at shoes, then they try on a pair...'",
        "In rigorous engineering, execution order is governed strictly by Data Dependency: Step B cannot execute until all information inputs required by Step B have been produced and verified by prior steps.",
        "If Step 2 does not consume any output from Step 1, Step 2 is completely independent of Step 1 and can execute before, after, or at the exact same millisecond in parallel.",
        "Master problem solvers visualize a solution not as a linear checklist, but as a Directed Acyclic Graph (DAG) of flowing data."
      ],
      callout: {
        type: "rule",
        title: "The Law of the Dependency Edge",
        text: "A directed dependency edge exists from Subproblem A to Subproblem B if and only if Subproblem B requires an output from Subproblem A as an input parameter."
      }
    },
    {
      kicker: "SECTION 02 · THE DAG MENTAL MODEL",
      title: "Directed Acyclic Graphs (DAGs) in Problem Solving",
      content: [
        "A DAG consists of two components:",
        "• Vertices (Nodes): Each atomic subproblem with its own contract.",
        "• Directed Edges ($A \\rightarrow B$): An arrow indicating that B depends on A.",
        "• The 'Acyclic' Guarantee: There can NEVER be a closed loop ($A \\rightarrow B \\rightarrow C \\rightarrow A$). A closed loop represents a Circular Dependency Deadlock, where no step can start because each is waiting for the other.",
        "Mapping your problem as a DAG immediately reveals two superpowers: (1) The Topological Execution Order (valid linear sequences), and (2) Independent Parallel Tracks (steps that can run concurrently)."
      ],
      callout: {
        type: "warning",
        title: "The Circular Dependency Trap",
        text: "If Step A needs Step B's output, and Step B needs Step A's output, you have a circular deadlock. The only resolution is to break one step into two smaller sub-steps (e.g., A1 -> B -> A2)."
      }
    },
    {
      kicker: "SECTION 03 · TOPOLOGICAL ORDERING WITHOUT CODE",
      title: "How to Order Dependencies by Hand",
      content: [
        "To find a valid execution sequence on paper using Kahn's Algorithm conceptually:",
        "Step 1: Calculate the In-Degree for every node (how many incoming dependency arrows point to it).",
        "Step 2: Find all nodes with In-Degree = 0 (these steps need zero prior data; they can start immediately).",
        "Step 3: 'Execute' an In-Degree 0 node and remove its outgoing arrows from the graph.",
        "Step 4: Repeat until all nodes are executed. If nodes remain but none have In-Degree = 0, you have exposed a fatal circular deadlock!"
      ]
    },
    {
      kicker: "SECTION 04 · THE CRITICAL PATH",
      title: "Identifying the Longest Dependency Chain",
      content: [
        "In any multi-step system, the total time required to solve the problem is determined by the Critical Path: the longest sequential chain of dependent steps from start to finish.",
        "Optimizing a step that is NOT on the critical path yields zero total time savings. Master engineers find the critical path first and optimize only the bottleneck."
      ],
      callout: {
        type: "tip",
        title: "The Concurrency Test",
        text: "Whenever you have two subproblems A and B, ask: 'If I had two separate computers, could Computer 2 solve B without talking to Computer 1?' If yes, they are independent parallel tracks."
      }
    }
  ],
  caseStudies: [
    {
      tag: "CASE STUDY A · AUTONOMOUS EMERGENCY BRAKING",
      title: "Vehicle Active Collision Avoidance Pipeline",
      problem: "An autonomous car's collision avoidance system must: (1) Fire brake hydraulic actuators, (2) Fuse camera and radar sensor streams, (3) Estimate obstacle trajectory, (4) Calculate time-to-collision (TTC), (5) Verify speed speedometer telemetry. What is the dependency graph?",
      flawedApproach: "Attempting to fire brake actuators immediately upon detecting a camera pixel change without fusing radar data or calculating trajectory, causing false-positive phantom braking on highways.",
      correctInvariant: "Dataflow DAG:\n• Layer 0 (Independent Inputs): CameraStream, RadarStream, SpeedometerTelemetry (In-Degree = 0).\n• Layer 1 (Sensor Fusion): Fuse(Camera, Radar) -> ObstacleCoordinates (Depends on Camera, Radar).\n• Layer 2 (Kinematics): TrajectoryEstimator(ObstacleCoordinates, Speedometer) -> RelativeVelocity.\n• Layer 3 (Safety Prediction): TimeToCollision(ObstacleCoordinates, RelativeVelocity) -> TTC_Seconds.\n• Layer 4 (Actuation): If TTC < Threshold -> FireBrakes. Strict topological causal chain.",
      codeOrContract: "DAG Graph:\n[Camera] + [Radar] -> [SensorFusion]\n[SensorFusion] + [Speedometer] -> [TrajectoryEstimator]\n[TrajectoryEstimator] -> [TimeToCollision]\n[TimeToCollision] -> [BrakeActuator]"
    },
    {
      tag: "CASE STUDY B · E-COMMERCE ORDER FULFILLMENT",
      title: "Warehouse Robotic Dispatch Pipeline",
      problem: "An e-commerce order arrives. Tasks: (A) Print shipping label, (B) Deduct inventory, (C) Authorize credit card, (D) Dispatch automated robotic picker, (E) Email customer receipt. What is the valid dependency sequence?",
      flawedApproach: "Dispatching the robotic picker before charging the credit card, leading to stolen merchandise when the credit card is declined.",
      correctInvariant: "Topological Dataflow:\n1. Step C (Credit Card Auth): Must happen FIRST. (If payment fails, abort all subsequent steps).\n2. Step B (Deduct Inventory): Depends on Step C.\n3. Step D (Dispatch Robotic Picker) AND Step E (Email Receipt): Both depend on Step C and B, but D and E are PARALLEL and independent of each other!\n4. Step A (Print Shipping Label): Depends on Step D (box packed) and customer address.",
      codeOrContract: "Topological Order:\n[CreditCardAuth] -> [DeductInventory] -> { [DispatchPicker], [EmailReceipt] }\n[DispatchPicker] -> [PrintShippingLabel]"
    },
    {
      tag: "CASE STUDY C · CIRCULAR DEADLOCK RESOLUTION",
      title: "The Circular Dependency Trap in School Registration",
      problem: "A university registration policy states: 'To assign a student a dorm room, we must know their tuition payment status. To calculate tuition payment, we must know the cost of their dorm room.'",
      flawedApproach: "Leaving the policy as written, causing registration software to freeze in an infinite dependency deadlock.",
      correctInvariant: "Deconstruct the cycle by separating Tuition into BaseTuition and HousingFee:\n1. Step 1: Calculate BaseTuition (Independent, In-Degree = 0).\n2. Step 2: Assign Dorm Room based on student preference -> HousingFee.\n3. Step 3: TotalTuition = BaseTuition + HousingFee.\n4. Step 4: Finalize Payment. The cycle is eliminated by atomic decomposition of the tuition concept.",
      codeOrContract: "Deadlock: Room -> Tuition -> Room\nResolution: Split Tuition into (BaseTuition) and (TotalTuition)\nBaseTuition -> AssignRoom -> HousingFee -> TotalTuition"
    }
  ],
  checklist: [
    "Have I drawn the Directed Acyclic Graph (DAG) of the problem on paper?",
    "Does every directed edge represent a real data parameter required by the receiving node?",
    "Are there any circular cycles ($A \\rightarrow B \\rightarrow A$) in the dependency graph?",
    "Have I identified all nodes with In-Degree = 0 that can start immediately?",
    "Have I identified parallel tracks that can execute concurrently without waiting for each other?"
  ],
  practiceTask: {
    id: "task-09-smart-home-dag",
    title: "Hands-on Practice: The Smart Home Morning Automation Dependency DAG",
    scenario: "An automated smart home system executes a morning routine involving 7 tasks: (Task A) Check outdoor weather forecast; (Task B) Brew coffee; (Task C) Preheat bathroom floor; (Task D) Read user's calendar schedule for today; (Task E) Calculate departure commute time based on traffic; (Task F) Set bedroom wake-up alarm sound; (Task G) Select appropriate clothing recommendation. Dependencies: Calendar schedule (D) is needed to know when to set the alarm (F) and when to calculate commute (E). Weather (A) and Schedule (D) are both needed to select clothing (G). Coffee (B) and Bathroom floor (C) must trigger 15 minutes before Alarm (F). Traffic commute (E) requires Weather (A) and Calendar (D).",
    prompt: "Without writing code, construct the complete Dependency Architecture: (1) Draw the node dependency mapping (list each task and its direct prerequisites). (2) Identify which tasks have In-Degree = 0 and can run concurrently at the start. (3) State a valid topological execution sequence. (4) Identify the Critical Path of the routine.",
    starterTemplate: "1. DIRECT PREREQUISITES MAPPING:\n• Task A (Weather):\n• Task B (Coffee):\n• Task C (Bathroom Heat):\n• Task D (Calendar):\n• Task E (Commute):\n• Task F (Alarm):\n• Task G (Clothing):\n\n2. INDEPENDENT PARALLEL STARTERS (In-Degree = 0):\n\n3. VALID TOPOLOGICAL SEQUENCE:\n\n4. CRITICAL PATH ANALYSIS:\n[State the longest sequential chain of dependencies]",
    modelSolution: "1. DIRECT PREREQUISITES MAPPING:\n• Task A (Weather): Prerequisites = ∅ (None, In-Degree = 0).\n• Task D (Calendar): Prerequisites = ∅ (None, In-Degree = 0).\n• Task F (Alarm): Prerequisites = {Task D (Calendar)} (Needs work start time).\n• Task B (Coffee): Prerequisites = {Task F (Alarm)} (Must know alarm time to brew 15m prior).\n• Task C (Bathroom Heat): Prerequisites = {Task F (Alarm)} (Must know alarm time to heat 15m prior).\n• Task E (Commute Time): Prerequisites = {Task A (Weather), Task D (Calendar)} (Needs destination from D and road weather from A).\n• Task G (Clothing Selection): Prerequisites = {Task A (Weather), Task D (Calendar)} (Needs outdoor temp from A and dress code/meetings from D).\n\n2. INDEPENDENT PARALLEL STARTERS (In-Degree = 0):\n• Task A (Weather Forecast Query) and Task D (Calendar Schedule Query) have In-Degree = 0. They execute concurrently in parallel at $T = 0$.\n\n3. VALID TOPOLOGICAL EXECUTION SEQUENCE:\n1. Execute {Task A, Task D} in parallel.\n2. Execute Task F (Alarm) and Task E (Commute) and Task G (Clothing) in parallel (all their inputs from A and D are ready!).\n3. Execute {Task B (Coffee), Task C (Bathroom Floor)} in parallel once Task F alarm target is known.\n\n4. CRITICAL PATH ANALYSIS:\nCritical Path = Task D (Calendar) -> Task F (Alarm Time Calculation) -> Task B / C (Coffee / Bathroom Preheat). Total sequential hops = 3. Notice that Task G (Clothing) and Task E (Commute) run completely in parallel with the alarm calculation and do not delay the critical path.",
    rubric: [
      "Correctly identified Tasks A and D as the zero-dependency starter nodes (In-Degree = 0)",
      "Correctly mapped prerequisites for all 7 tasks without circular deadlocks",
      "Identified parallel execution groups (e.g. B and C running concurrently)",
      "Formulated a valid topological sort sequence",
      "Identified the Critical Path (D -> F -> B/C)"
    ]
  },
  questions: [
    {
      question_id: "m9q01",
      sort_order: 1,
      title: "Data Dependency vs Temporal Order",
      prompt: "Two tasks in a video game engine are: Task 1: Render the 3D grass textures. Task 2: Calculate the physics collision between two enemy swords. In the game story, the swords clash on the grass. What is the data dependency relationship between Task 1 and Task 2?",
      options: [
        "Task 1 strictly depends on Task 2 because grass cannot exist without swords.",
        "Task 2 strictly depends on Task 1 because swords must look green.",
        "Task 1 and Task 2 have ZERO mutual data dependencies: they consume completely different inputs and can execute in parallel on separate CPU/GPU threads.",
        "Task 1 and Task 2 must execute in alphabetical order."
      ],
      hints: [
        "Does calculating sword physics require the color pixels of the grass?",
        "Does drawing grass textures require the velocity vectors of the swords?",
        "Zero shared inputs/outputs = Independent parallel tasks."
      ],
      marks: 2,
      correct_index: 2,
      explanation: "Physics collision consumes spatial coordinate vectors and bounding boxes. Grass rendering consumes 3D mesh shaders and textures. Because neither task requires the output of the other, they are completely independent and have zero data dependency edges between them.",
      option_explanations: [
        "Incorrect: Narrative grass setting has zero data connection to sword collision kinematics.",
        "Incorrect: Sword physics does not depend on graphical grass rendering.",
        "Correct: Identifies the absence of data dependency, proving the tasks are orthogonal and parallelizable.",
        "Incorrect: Alphabetical ordering is an arbitrary human filing convention, not a data dependency."
      ]
    },
    {
      question_id: "m9q02",
      sort_order: 2,
      title: "The Definition of a Directed Acyclic Graph (DAG)",
      prompt: "Why must a system dependency graph be Acyclic (containing zero closed loops)?",
      options: [
        "Because cycles look visually ugly on whiteboards.",
        "Because if a cycle exists (e.g., $A \\rightarrow B \\rightarrow C \\rightarrow A$), every node in the cycle depends on the completion of the cycle itself, creating a permanent circular deadlock where no step can ever start.",
        "Because computers only have straight wires.",
        "Because acyclic graphs use less electricity."
      ],
      hints: [
        "If you need A to do B, and B to do C, and C to do A... which one can you do first?",
        "None of them! Each is waiting for the previous step.",
        "This is the definition of a circular deadlock."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "A cycle creates an insolvable causal paradox: Step A cannot start until Step C finishes, Step C cannot start until Step B finishes, and Step B cannot start until Step A finishes. In-degree for all nodes in the cycle is $\\ge 1$, causing an absolute deadlock.",
      option_explanations: [
        "Incorrect: Whiteboard aesthetics do not govern computational computability.",
        "Correct: Formulates the fundamental mathematical reason: cycles create infinite mutual-wait deadlocks.",
        "Incorrect: Microprocessor wiring geometry is completely irrelevant.",
        "Incorrect: Acyclic graphs govern logical causality, not electrical power conservation."
      ]
    },
    {
      question_id: "m9q03",
      sort_order: 3,
      title: "Topological Sort In-Degree Rule",
      prompt: "In a dependency graph, Node X has an In-Degree of 0. What does this guarantee about Node X?",
      options: [
        "Node X can NEVER be executed under any circumstances.",
        "Node X requires zero prerequisites or prior outputs; it is an entry point that can begin execution immediately at time T = 0.",
        "Node X is an exit node that produces no outputs.",
        "Node X is part of a circular deadlock."
      ],
      hints: [
        "In-Degree is the number of incoming arrows.",
        "Zero incoming arrows means zero prerequisites.",
        "Nodes with In-Degree 0 can start immediately."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "In-Degree represents the number of incoming dependencies. An In-Degree of 0 means the subproblem requires no prerequisites from any other component in the graph; it can fire immediately as a root starter node.",
      option_explanations: [
        "Incorrect: In-Degree 0 nodes are the first to execute, not blocked.",
        "Correct: Formulates the foundational property of root nodes in topological ordering.",
        "Incorrect: Out-Degree 0 represents exit nodes (sinks), not In-Degree 0.",
        "Incorrect: Nodes in a cycle always have In-Degree $\\ge 1$."
      ]
    },
    {
      question_id: "m9q04",
      sort_order: 4,
      title: "The Critical Path Concept",
      prompt: "A project has two parallel branches: Branch 1 takes 30 minutes to complete. Branch 2 takes 5 minutes to complete. Both branches must finish before the final 10-minute Assembly step can run. What is the total duration of the project, and which branch lies on the Critical Path?",
      options: [
        "Total duration = 15 minutes; Branch 2 is critical.",
        "Total duration = 40 minutes (30m + 10m); Branch 1 is on the Critical Path.",
        "Total duration = 45 minutes; both branches are critical.",
        "Total duration = 5 minutes; Assembly can be skipped."
      ],
      hints: [
        "Can Assembly start at minute 5? No, because Branch 1 is still running!",
        "Assembly must wait until minute 30 for Branch 1 to finish.",
        "30 minutes + 10 minutes = 40 minutes."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "Branch 1 and Branch 2 run concurrently. The Assembly step must wait for the slowest branch (Branch 1, taking 30 min). Total time is $\\max(30, 5) + 10 = 40$ minutes. Branch 1 is the Critical Path because reducing its time directly reduces the overall project duration.",
      option_explanations: [
        "Incorrect: Assembly cannot start at 5 minutes because Branch 1 is still processing.",
        "Correct: Accurately calculates total duration (40m) and identifies the longest bottleneck (Branch 1) as the Critical Path.",
        "Incorrect: Adding both parallel branches (30 + 5) treats them as sequential rather than concurrent.",
        "Incorrect: Skipping the required final step violates the contract."
      ]
    },
    {
      question_id: "m9q05",
      sort_order: 5,
      title: "Breaking a Circular Deadlock",
      prompt: "In a medical billing system: 'Patient insurance claim cannot be submitted without an ICD-10 diagnosis code. The doctor cannot assign an ICD-10 diagnosis code until the insurance company approves the claim.' How must an engineer resolve this circular deadlock?",
      options: [
        "Wait 10 years until the patient recovers.",
        "Deconstruct the 'claim approval' into two atomic stages: (1) Pre-Authorization Verification of coverage (based on preliminary symptoms), which allows the doctor to diagnose, followed by (2) Final Claim Submission for payment.",
        "Have the computer guess a random disease code.",
        "Cancel the patient's insurance policy."
      ],
      hints: [
        "Circular dependencies are broken by splitting a monolithic concept into two phased states.",
        "Preliminary authorization vs Final claim submission.",
        "Split the loop into a linear chain."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "Circular deadlocks in real-world systems are resolved by decomposing an overloaded concept into phased sub-states: separating 'Pre-Authorization Verification' from 'Final Claim Settlement' breaks the loop into a clean linear sequence.",
      option_explanations: [
        "Incorrect: Passive stalling does not resolve an architectural deadlock.",
        "Correct: Demonstrates master-level problem deconstruction: splitting an overloaded entity into two phased sub-states eliminates the cycle.",
        "Incorrect: Guessing diagnoses is dangerous medical malpractice.",
        "Incorrect: Punitive and irrelevant administrative action."
      ]
    },
    {
      question_id: "m9q06",
      sort_order: 6,
      title: "Synthesizing a Topological Pipeline",
      prompt: "You are given 4 tasks with the following dependency rules: Task C depends on Task A. Task D depends on Task B and Task C. Task B depends on Task A. Which of the following is a valid topological execution sequence?",
      options: [
        "D -> C -> B -> A.",
        "A -> B -> C -> D (or A -> C -> B -> D).",
        "C -> D -> A -> B.",
        "B -> D -> A -> C."
      ],
      hints: [
        "What task has zero dependencies? (Task A). So A must go first!",
        "Once A finishes, which tasks can run? (B and C both depend only on A).",
        "Task D depends on both B and C, so D must go last."
      ],
      marks: 2,
      correct_index: 1,
      explanation: "Task A has In-Degree 0 (must run first). Once A finishes, B and C have all their inputs ready and can execute in either order. Finally, Task D can run once both B and C have finished. Thus, A -> B -> C -> D is a valid topological sort.",
      option_explanations: [
        "Incorrect: D depends on everything and cannot execute first.",
        "Correct: Flawlessly satisfies all dependency constraints: A first, then B and C, and D last.",
        "Incorrect: C cannot execute before A.",
        "Incorrect: B cannot execute before A."
      ]
    }
  ]
};
