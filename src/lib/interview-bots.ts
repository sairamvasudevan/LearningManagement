import { InterviewBot, InterviewQuestion } from "./interview-types";

export const INTERVIEW_BOTS: InterviewBot[] = [
  {
    id: "bot-elo-800",
    name: "Sam",
    elo: 800,
    tier: "Intern",
    title: "Intern Peer Reviewer",
    avatarColor: "from-emerald-500 to-teal-600",
    tagline: "Friendly, forgiving, and happy to give hints when you are stuck.",
    companyStyle: "Campus Peer / Early Startup",
    personality: "supportive",
    speechPitch: 1.15,
    speechRate: 0.95,
    defaultLanguage: "python",
    introGreeting:
      "Hello! Good evening! I'm Sam. Welcome to your technical interview session! Don't stress out at all — we're just here to talk through some code together. Feel free to say hi or ask any clarifying questions before you write a single line!",
  },
  {
    id: "bot-elo-1200",
    name: "Maya",
    elo: 1200,
    tier: "Junior SDE",
    title: "Junior Software Engineer",
    avatarColor: "from-blue-500 to-indigo-600",
    tagline: "Balanced and methodical. Checks fundamental logic, edge cases, and cleanliness.",
    companyStyle: "Mid-Market Tech Company",
    personality: "standard",
    speechPitch: 1.05,
    speechRate: 1.0,
    defaultLanguage: "python",
    introGreeting:
      "Hello! Good evening! I'm Maya from the engineering team. Welcome to your technical interview. In this session, I'll be looking at how clearly you communicate your approach, validate constraints, and structure clean, readable code. Let's start with a quick greeting and jump into the problem.",
  },
  {
    id: "bot-elo-1600",
    name: "Vikram",
    elo: 1600,
    tier: "SDE-2",
    title: "Mid-Level Product Engineer",
    avatarColor: "from-amber-500 to-orange-600",
    tagline: "Rigorous and performance-minded. Rejects naive brute-force and pushes for optimal Big-O.",
    companyStyle: "High-Growth Unicorn",
    personality: "rigorous",
    speechPitch: 0.95,
    speechRate: 1.05,
    defaultLanguage: "python",
    introGreeting:
      "Hello, good evening candidate. I'm Vikram. We build high-throughput microservices here, so I care deeply about asymptotic efficiency. Brute force won't cut it — I want to hear your time and space complexity upfront before you implement. Ready?",
  },
  {
    id: "bot-elo-2000",
    name: "Priya",
    elo: 2000,
    tier: "Staff Engineer",
    title: "Staff Infrastructure Architect",
    avatarColor: "from-purple-500 to-fuchsia-600",
    tagline: "Probes invariants, memory locality, concurrency, and trade-offs under scale.",
    companyStyle: "Cloud Infrastructure / Distributed Systems",
    personality: "demanding",
    speechPitch: 1.0,
    speechRate: 1.05,
    defaultLanguage: "python",
    introGreeting:
      "Greetings and good evening. I am Priya, Staff Architect. Beyond just passing sample test cases, I want to understand how your solution behaves under extreme scale, what invariants guarantee correctness, and your trade-offs between memory overhead and CPU cycles.",
  },
  {
    id: "bot-elo-2400",
    name: "Magnus",
    elo: 2400,
    tier: "FAANG Bar Raiser",
    title: "Principal Engineer & Bar Raiser",
    avatarColor: "from-rose-600 to-red-800",
    tagline: "Cold, uncompromising, and relentless. Grills on pathological worst-case inputs and edge cases.",
    companyStyle: "Tier-1 Big Tech Bar Raiser",
    personality: "ruthless",
    speechPitch: 0.85,
    speechRate: 1.1,
    defaultLanguage: "python",
    introGreeting:
      "Good evening. I am Magnus. As the Bar Raiser for this loop, my role is to stress-test your problem-solving under adversarial conditions. Hand-waving and vague assumptions will not pass. State your invariants clearly, defend your complexity, and prepare to be grilled.",
  },
];

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: "q-two-sum",
    title: "Two Sum Target Pair",
    difficulty: "Easy",
    targetElo: 800,
    topic: "Arrays & Hash Table",
    prompt:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
    examples: [
      {
        input: "nums = [2, 7, 11, 15], target = 9",
        output: "[0, 1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3, 2, 4], target = 6",
        output: "[1, 2]",
      },
      {
        input: "nums = [3, 3], target = 6",
        output: "[0, 1]",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    clarificationAnswers: {
      sorted: "No, the array is NOT necessarily sorted. Do not assume any ordering.",
      duplicates: "Yes, numbers can appear multiple times in nums, like [3, 3] with target 6.",
      negative: "Yes, elements and the target can definitely be negative numbers.",
      empty: "The constraint specifies nums has at least 2 elements.",
      memory: "Optimal space complexity is acceptable if it reduces time complexity to linear.",
    },
    expectedOptimalTime: "O(N)",
    expectedOptimalSpace: "O(N)",
    starterCode: {
      python: `def twoSum(nums: list[int], target: int) -> list[int]:\n    # Implement your solution\n    pass`,
      javascript: `function twoSum(nums, target) {\n  // Implement your solution\n}`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Implement your solution\n        return new int[0];\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Implement your solution\n        return {};\n    }\n};`,
    },
    grillProbes: [
      {
        triggerKeywords: ["nested", "two loops", "o(n^2)", "brute force", "n squared"],
        probeQuestion:
          "Wait, you mentioned a double loop. If nums has 100,000 elements, an O(N^2) solution will require 10 billion operations and trigger a Time Limit Exceeded error. Can you optimize this to linear time using auxiliary memory?",
        probeAudioScript:
          "Wait, double loops on 100,000 elements will trigger a timeout. Can you optimize this to linear time using extra memory?",
        focusArea: "time_complexity",
        expectedDefense: "Use a hash map / dictionary to store seen complements in O(1) average lookup time.",
      },
      {
        triggerKeywords: ["sort", "two pointer", "binary search"],
        probeQuestion:
          "If you sort the array to use two pointers, what happens to the original indices required in the output? Also what is your overall time complexity including sorting?",
        probeAudioScript:
          "Sorting takes O of N log N and loses original indices unless you store pairs. Why not O of N with a hash map?",
        focusArea: "time_complexity",
        expectedDefense: "Sorting requires storing index pairs and runs in O(N log N), which is slower than a hash table.",
      },
      {
        triggerKeywords: ["hash", "map", "dict", "lookup", "seen"],
        probeQuestion:
          "Good. When inserting into your hash map, how do you handle duplicate values in the array, for instance nums = [3, 3] with target = 6? Do you check for complement before or after inserting?",
        probeAudioScript:
          "How do you handle duplicate values like three and three? Do you check for complement before or after inserting into your map?",
        focusArea: "edge_cases",
        expectedDefense: "Check complement before inserting the current index to avoid matching an element with itself.",
      },
      {
        triggerKeywords: ["collision", "hash collision", "memory", "space"],
        probeQuestion:
          "What is the worst-case time complexity of hash table lookups under adversarial hash collisions, and how does your language handle it?",
        probeAudioScript:
          "What is the worst-case time under adversarial hash collisions, and how does your runtime prevent degradation?",
        focusArea: "scale_limit",
        expectedDefense: "Worst-case is O(N) under severe collisions, but modern runtimes use balanced trees (e.g. Red-Black in Java 8) or SIPHash/cuckoo hashing.",
      },
    ],
  },
  {
    id: "q-valid-parentheses",
    title: "Valid Parentheses String",
    difficulty: "Easy",
    targetElo: 1200,
    topic: "Stack & String Parsing",
    prompt:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    examples: [
      { input: 's = "()"', output: "true" },
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" },
      { input: 's = "([])"', output: "true" },
    ],
    constraints: [
      "1 <= s.length <= 10^5",
      "s consists of parentheses only '()[]{}'.",
    ],
    clarificationAnswers: {
      empty: "Constraint guarantees length >= 1.",
      whitespace: "There are no spaces or other characters, strictly '()[]{}'.",
      order: "Yes, inner brackets must close before outer brackets, e.g. ([)] is invalid.",
    },
    expectedOptimalTime: "O(N)",
    expectedOptimalSpace: "O(N)",
    starterCode: {
      python: `def isValid(s: str) -> bool:\n    # Implement your solution\n    pass`,
      javascript: `function isValid(s) {\n  // Implement your solution\n}`,
      java: `class Solution {\n    public boolean isValid(String s) {\n        // Implement your solution\n        return false;\n    }\n}`,
      cpp: `#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        // Implement your solution\n        return false;\n    }\n};`,
    },
    grillProbes: [
      {
        triggerKeywords: ["replace", "string replace", "while in"],
        probeQuestion:
          "Are you using string replacement in a loop like s.replace('()', '')? That creates new strings in each pass leading to O(N^2) time complexity. Can you do this in a single pass?",
        probeAudioScript:
          "Repeated string replace runs in quadratic time. How do you do this in O of N time using a LIFO stack?",
        focusArea: "time_complexity",
        expectedDefense: "Use a LIFO Stack to achieve strict O(N) time and single-pass processing.",
      },
      {
        triggerKeywords: ["stack", "pop", "push", "peek"],
        probeQuestion:
          "What if the string begins with a closing bracket like ']' or has only open brackets like '(((('? What exact guard checks prevent an empty stack pop exception?",
        probeAudioScript:
          "What happens if the string begins with a closing bracket or is all open brackets? How do you prevent an empty stack exception?",
        focusArea: "edge_cases",
        expectedDefense: "Verify stack is non-empty before popping on closing bracket, and check stack is completely empty at the end.",
      },
      {
        triggerKeywords: ["memory", "odd length", "optimization"],
        probeQuestion:
          "If the string length is odd, can it ever be valid? What quick O(1) early exit can you add before allocating the stack?",
        probeAudioScript:
          "If the length of string s is odd, can it ever be valid? What quick O(1) exit check should you add first?",
        focusArea: "invariants",
        expectedDefense: "If length is odd, return false immediately without allocating stack memory.",
      },
    ],
  },
  {
    id: "q-longest-substring",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    targetElo: 1600,
    topic: "Sliding Window & Two Pointers",
    prompt:
      "Given a string s, find the length of the longest substring without repeating characters.\n\nA substring is a contiguous non-empty sequence of characters within a string.",
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: 's = "bbbbb"',
        output: "1",
        explanation: 'The answer is "b", with the length of 1.',
      },
      {
        input: 's = "pwwkew"',
        output: "3",
        explanation: 'The answer is "wke", with the length of 3. Note "pwke" is a subsequence, not a substring.',
      },
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces.",
    ],
    clarificationAnswers: {
      empty: "If s is empty string '', the longest substring has length 0.",
      characters: "Contains full ASCII characters including spaces and symbols, not just lowercase a-z.",
      contiguous: "Must be contiguous substring, not subsequence.",
    },
    expectedOptimalTime: "O(N)",
    expectedOptimalSpace: "O(min(N, M)) where M is character set size",
    starterCode: {
      python: `def lengthOfLongestSubstring(s: str) -> int:\n    # Implement your solution\n    pass`,
      javascript: `function lengthOfLongestSubstring(s) {\n  // Implement your solution\n}`,
      java: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Implement your solution\n        return 0;\n    }\n}`,
      cpp: `#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // Implement your solution\n        return 0;\n    }\n};`,
    },
    grillProbes: [
      {
        triggerKeywords: ["sliding window", "left", "right", "two pointers"],
        probeQuestion:
          "In your sliding window, when a duplicate character is encountered at index right, do you increment left pointer by 1 in a while loop, or do you jump left directly using a last-seen index map? What is the asymptotic difference?",
        probeAudioScript:
          "When you hit a duplicate, do you inch the left pointer step by step, or jump directly using a character index map?",
        focusArea: "time_complexity",
        expectedDefense: "By storing each character's last seen index in a map, left pointer can jump directly to max(left, lastSeen[char] + 1), ensuring at most N total pointer moves.",
      },
      {
        triggerKeywords: ["jump", "max(left", "last seen"],
        probeQuestion:
          "Why is the max(left, lastSeen[char] + 1) check strictly required? What subtle bug occurs if you just do left = lastSeen[char] + 1 without the max guard?",
        probeAudioScript:
          "Why is the max check required when jumping the left pointer? What happens if an older duplicate is behind the current left pointer?",
        focusArea: "invariants",
        expectedDefense: "Without max, the left pointer can jump backward if the duplicate character was seen before the current window boundary, producing wrong answers.",
      },
      {
        triggerKeywords: ["space", "hash table", "array", "ascii"],
        probeQuestion:
          "Since s consists of ASCII characters, can you avoid dynamic hash table overhead entirely? What data structure gives O(1) auxiliary space without hashing overhead?",
        probeAudioScript:
          "Can you avoid hash table allocation overhead entirely for ASCII characters using a fixed primitive array?",
        focusArea: "scale_limit",
        expectedDefense: "Use a fixed size integer array of 128 (or 256) elements, giving O(1) auxiliary space and zero heap allocation.",
      },
    ],
  },
  {
    id: "q-lru-cache",
    title: "LRU (Least Recently Used) Cache",
    difficulty: "Medium",
    targetElo: 2000,
    topic: "Doubly Linked List & Hash Map",
    prompt:
      "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the LRUCache class:\n- LRUCache(int capacity) Initialize the LRU cache with positive size capacity.\n- int get(int key) Return the value of the key if the key exists, otherwise return -1.\n- void put(int key, int value) Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.\n\nThe functions get and put must each run in O(1) average time complexity.",
    examples: [
      {
        input:
          '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
        output: "[null, null, null, 1, null, -1, null, -1, 3, 4]",
        explanation:
          "lru.put(1,1); lru.put(2,2); lru.get(1); // returns 1\nlru.put(3,3); // evicts key 2\nlru.get(2); // returns -1 (not found)",
      },
    ],
    constraints: [
      "1 <= capacity <= 3000",
      "0 <= key <= 10^4",
      "0 <= value <= 10^5",
      "At most 2 * 10^5 calls will be made to get and put.",
    ],
    clarificationAnswers: {
      concurrency: "For this round, assume single-threaded correctness first, but be prepared to explain thread safety.",
      eviction: "Evict strictly the least recently accessed item. Both get() and put() update recency.",
      complexity: "Both get and put MUST be strictly O(1) time.",
    },
    expectedOptimalTime: "O(1) for both get and put",
    expectedOptimalSpace: "O(capacity)",
    starterCode: {
      python: `class LRUCache:\n    def __init__(self, capacity: int):\n        # Initialize data structures\n        pass\n\n    def get(self, key: int) -> int:\n        # O(1) lookup & recency update\n        return -1\n\n    def put(self, key: int, value: int) -> None:\n        # O(1) insert/update & eviction\n        pass`,
      javascript: `class LRUCache {\n  constructor(capacity) {\n    // Initialize data structures\n  }\n  get(key) {\n    // O(1)\n    return -1;\n  }\n  put(key, value) {\n    // O(1)\n  }\n}`,
      java: `class LRUCache {\n    public LRUCache(int capacity) {\n    }\n    public int get(int key) {\n        return -1;\n    }\n    public void put(int key, int value) {\n    }\n}`,
      cpp: `class LRUCache {\npublic:\n    LRUCache(int capacity) {\n    }\n    int get(int key) {\n        return -1;\n    }\n    void put(int key, int value) {\n    }\n};`,
    },
    grillProbes: [
      {
        triggerKeywords: ["ordereddict", "linkedhashmap"],
        probeQuestion:
          "You mentioned using language built-ins like OrderedDict or LinkedHashMap. In a Staff interview, I need to verify your foundational systems knowledge: how would you implement this from scratch without built-in ordered containers?",
        probeAudioScript:
          "In a Staff interview, built-ins like OrderedDict won't prove your systems knowledge. How do you implement this from scratch using primitive pointers?",
        focusArea: "invariants",
        expectedDefense: "Combine a Hash Map mapping key -> Node with a custom Doubly Linked List with dummy head and tail sentinel nodes.",
      },
      {
        triggerKeywords: ["singly", "single linked list"],
        probeQuestion:
          "Why is a Doubly Linked List strictly required instead of a Singly Linked List? Can you remove an arbitrary node in O(1) in a Singly Linked List given only its pointer?",
        probeAudioScript:
          "Why is a Doubly Linked List required? Can you remove an arbitrary middle node in O of 1 in a Singly Linked List without predecessor?",
        focusArea: "time_complexity",
        expectedDefense: "In a Doubly Linked List, every node has a prev pointer so it can detach itself in O(1) without iterating from head to find predecessor.",
      },
      {
        triggerKeywords: ["sentinel", "dummy", "head", "tail", "null pointer"],
        probeQuestion:
          "How do sentinel (dummy) head and tail nodes eliminate null pointer boundary bugs when adding or removing elements at the edges of the list?",
        probeAudioScript:
          "How do dummy head and tail sentinel nodes eliminate edge-case null checks during insertions and evictions?",
        focusArea: "edge_cases",
        expectedDefense: "Sentinel head and tail nodes guarantee the list is never empty, removing null checks for head.prev and tail.next.",
      },
      {
        triggerKeywords: ["concurrency", "thread safe", "lock", "rwlock", "read write"],
        probeQuestion:
          "In high-concurrency production (e.g. 50,000 requests/sec), how do you prevent get() from blocking other readers given that get() mutates the list order to update recency?",
        probeAudioScript:
          "In high concurrency, get mutates node recency, so a simple Read-Write lock still requires write locks on reads. How do you solve this contention?",
        focusArea: "scale_limit",
        expectedDefense: "Use batched asynchronous write queues for recency updates (like Caffeine cache) or striped ring buffers so reads do not lock each other.",
      },
    ],
  },
  {
    id: "q-course-schedule",
    title: "Course Schedule Cycle Detection",
    difficulty: "Hard",
    targetElo: 2400,
    topic: "Graphs & Topological Sort",
    prompt:
      "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [a_i, b_i] indicates that you must take course b_i first if you want to take course a_i.\n\nReturn true if you can finish all courses. Otherwise, return false.\n\nMust handle disconnected components, self-loops, and verify topological invariants.",
    examples: [
      {
        input: "numCourses = 2, prerequisites = [[1, 0]]",
        output: "true",
        explanation: "There are a total of 2 courses. To take course 1 you should take course 0. So it is possible.",
      },
      {
        input: "numCourses = 2, prerequisites = [[1, 0], [0, 1]]",
        output: "false",
        explanation: "Course 1 depends on 0 and course 0 depends on 1. Cyclic dependency detected.",
      },
    ],
    constraints: [
      "1 <= numCourses <= 2000",
      "0 <= prerequisites.length <= 5000",
      "prerequisites[i].length == 2",
      "0 <= a_i, b_i < numCourses",
      "All pairs [a_i, b_i] are distinct.",
    ],
    clarificationAnswers: {
      graph: "This is a Directed Graph problem. We need to check whether the directed graph contains a cycle.",
      disconnected: "Yes, the graph can have multiple disconnected components.",
      self_loop: "A self dependency [0, 0] is a cycle and cannot be completed.",
    },
    expectedOptimalTime: "O(V + E) where V = numCourses, E = prerequisites.length",
    expectedOptimalSpace: "O(V + E) for adjacency list and recursion stack / in-degrees",
    starterCode: {
      python: `def canFinish(numCourses: int, prerequisites: list[list[int]]) -> bool:\n    # Implement topological sort or cycle detection\n    pass`,
      javascript: `function canFinish(numCourses, prerequisites) {\n  // Implement topological sort or cycle detection\n}`,
      java: `class Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        // Implement topological sort or cycle detection\n        return false;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n        // Implement topological sort or cycle detection\n        return false;\n    }\n};`,
    },
    grillProbes: [
      {
        triggerKeywords: ["kahn", "bfs", "indegree", "in-degree", "queue"],
        probeQuestion:
          "In Kahn's BFS algorithm, how do you mathematically prove that all courses can be finished if and only if the count of visited nodes equals numCourses?",
        probeAudioScript:
          "In Kahn's algorithm, prove mathematically why the count of popped nodes from the queue must equal numCourses in a directed acyclic graph.",
        focusArea: "invariants",
        expectedDefense: "Every DAG has at least one source (in-degree 0). Removing sources leaves a sub-DAG. In a cycle, every node has in-degree >= 1, so none can ever enter the queue.",
      },
      {
        triggerKeywords: ["dfs", "recursion", "visited", "cycle"],
        probeQuestion:
          "If using DFS, a boolean visited array is insufficient because visiting an already processed node in another branch is not necessarily a cycle! What 3-color state system is strictly required?",
        probeAudioScript:
          "A single boolean visited array fails on diamond DAGs. What three-color state system is required to distinguish cross edges from back edges?",
        focusArea: "invariants",
        expectedDefense: "Use 3 states: 0 = unvisited (white), 1 = visiting / in current recursion stack (gray), 2 = fully visited (black). A cycle exists iff DFS encounters a gray node (back edge).",
      },
      {
        triggerKeywords: ["stack overflow", "recursion limit", "deep graph"],
        probeQuestion:
          "If the graph is a linear chain of 20,000 nodes, Python's recursion limit of 1,000 will throw RecursionError on DFS. How do you guarantee robustness against deep skew?",
        probeAudioScript:
          "Deep linear chains crash DFS with RecursionError. How do you eliminate recursion stack overflow risks?",
        focusArea: "scale_limit",
        expectedDefense: "Prefer Kahn's iterative BFS with an explicit queue, or use iterative DFS with explicit heap-allocated stack.",
      },
    ],
  },
];

export function getBotById(botId: string): InterviewBot {
  const bot = INTERVIEW_BOTS.find((b) => b.id === botId);
  return bot || INTERVIEW_BOTS[0];
}

export function getQuestionById(questionId: string): InterviewQuestion {
  const q = INTERVIEW_QUESTIONS.find((item) => item.id === questionId);
  return q || INTERVIEW_QUESTIONS[0];
}
