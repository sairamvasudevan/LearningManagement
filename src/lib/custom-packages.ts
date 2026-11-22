/**
 * Custom Syllabus & Practice Question Package Framework
 *
 * Designed to seamlessly ingest user-defined syllabi, structured topics,
 * custom practice questions, and problem sets.
 */

export interface CustomQuestion {
  id: string;
  number: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  subtopic?: string;
  type: "coding" | "mcq" | "conceptual" | "debugging";
  questionStatement: string;
  constraints?: string[];
  sampleInputsOutputs?: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  mcqOptions?: {
    key: string;
    text: string;
    isCorrect?: boolean;
  }[];
  solutionApproach?: string;
  tags?: string[];
}

export interface SyllabusTopic {
  id: string;
  title: string;
  description: string;
  learningOutcomes: string[];
  estimatedHours: number;
  questionIds: string[];
}

export interface CustomSyllabusPackage {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: string;
  author: string;
  version: string;
  syllabus: SyllabusTopic[];
  questions: CustomQuestion[];
  createdDate: string;
  lastUpdated: string;
}

// In-memory / extendable registry of custom syllabus packages
export const CUSTOM_PACKAGES_REGISTRY: Map<string, CustomSyllabusPackage> = new Map();

/**
 * Register a user-provided syllabus and question package
 */
export function registerCustomPackage(pkg: CustomSyllabusPackage): void {
  CUSTOM_PACKAGES_REGISTRY.set(pkg.slug, pkg);
}

/**
 * Fetch a custom package by its URL slug
 */
export function getCustomPackage(slug: string): CustomSyllabusPackage | undefined {
  return CUSTOM_PACKAGES_REGISTRY.get(slug);
}

/**
 * Return all registered custom packages
 */
export function getAllCustomPackages(): CustomSyllabusPackage[] {
  return Array.from(CUSTOM_PACKAGES_REGISTRY.values());
}

// Template package ready for user's syllabus & question ingestion
export const INITIAL_USER_CUSTOM_PACKAGE: CustomSyllabusPackage = {
  id: "custom-student-syllabus-v1",
  slug: "custom-practice-package",
  title: "Custom Practice Package: User Syllabus",
  subtitle: "Tailored student curriculum and dedicated practice question bank",
  description:
    "Custom practice package configured for specific college or university syllabuses. Contains tailored questions, conceptual checkpoints, and targeted exercises provided by the instructor.",
  category: "Custom Curriculum",
  level: "All Levels",
  author: "Course Instructor",
  version: "1.0.0",
  createdDate: new Date().toISOString().split("T")[0],
  lastUpdated: new Date().toISOString().split("T")[0],
  syllabus: [
    {
      id: "unit-1",
      title: "Unit 1: Foundations & Core Concepts",
      description: "Fundamental principles and baseline concepts as defined in the syllabus.",
      learningOutcomes: ["Master foundational paradigms", "Solve baseline practice questions"],
      estimatedHours: 10,
      questionIds: ["q-unit1-01", "q-unit1-02"],
    },
    {
      id: "unit-2",
      title: "Unit 2: Intermediate Data Handling & Algorithms",
      description: "Structured problem solving, data representations, and algorithmic reasoning.",
      learningOutcomes: ["Implement standard algorithmic techniques", "Analyze time & space bounds"],
      estimatedHours: 15,
      questionIds: ["q-unit2-01"],
    },
  ],
  questions: [
    {
      id: "q-unit1-01",
      number: 1,
      title: "Foundations Checkpoint: Variable Lifecycle & Memory Layout",
      difficulty: "Easy",
      topic: "Core Concepts",
      subtopic: "Memory & State",
      type: "conceptual",
      questionStatement:
        "Explain the lifecycle of stack-allocated vs heap-allocated data structures and how modern runtimes clean up deallocated references.",
      solutionApproach:
        "Stack variables follow LIFO scope lifetimes and are automatically unwound; heap variables persist until garbage collected or explicitly freed.",
      tags: ["memory", "foundations", "runtime"],
    },
    {
      id: "q-unit1-02",
      number: 2,
      title: "Array Invariants & Prefix Sum Boundary Conditions",
      difficulty: "Medium",
      topic: "Algorithms",
      subtopic: "Arrays",
      type: "coding",
      questionStatement:
        "Given an integer array nums, calculate prefix sums such that range queries query(L, R) execute in O(1) time without off-by-one errors.",
      constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
      sampleInputsOutputs: [
        {
          input: "nums = [1, 2, 3, 4, 5], queries = [[1, 3], [0, 4]]",
          output: "[9, 15]",
          explanation: "Subarray [2, 3, 4] sums to 9; full array sums to 15.",
        },
      ],
      tags: ["arrays", "prefix-sum", "O(1) query"],
    },
  ],
};

// Register default template
registerCustomPackage(INITIAL_USER_CUSTOM_PACKAGE);
