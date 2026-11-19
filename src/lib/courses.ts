export type CourseCatalogItem = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  priceAmount: number;
  priceLabel: string;
  originalPrice?: string;
  isFree: boolean;
  totalHours: number;
  totalPaths: number;
  totalModules: number;
  publishedModules: number;
  status: "available" | "coming_soon";
  rating: number;
  reviewCount: number;
  enrolledCount: number;
  instructor: string;
  instructorTitle: string;
  badge?: string;
  level: string;
  skills: string[];
  highlights: string[];
};

export const PLATFORM_NAME = "NEXUS ACADEMY";
export const PLATFORM_SUBTITLE = "Advanced Engineering LMS";

export const COURSE_PACKAGES: CourseCatalogItem[] = [
  {
    slug: "problem-solving-lab",
    title: "Problem Solving Lab: 100-Hour Systematic Mastery",
    tagline: "Think clearly, model accurately, and solve unfamiliar problems before writing code.",
    description:
      "A 100-hour, language-independent learning package built around 10 progressive paths. Learn to extract requirements, model data, construct logic, choose algorithms, reason about complexity, debug systematically, and review AI-assisted work.",
    category: "Core Algorithmic Reasoning",
    priceAmount: 0,
    priceLabel: "Free",
    originalPrice: "₹14,999",
    isFree: true,
    totalHours: 100,
    totalPaths: 10,
    totalModules: 100,
    publishedModules: 1,
    status: "available",
    rating: 4.9,
    reviewCount: 1480,
    enrolledCount: 8920,
    instructor: "Sairam Vasudevan & Senior Staff Engineers",
    instructorTitle: "Principal Systems Architect & Competitive Programmers",
    badge: "FLAGSHIP · BESTSELLER",
    level: "All Levels · Foundational to Advanced",
    skills: [
      "Algorithmic Thinking",
      "Asymptotic Complexity",
      "Pointer Invariants",
      "State Space Modelling",
      "Debugging & Edge Cases",
      "AI Code Evaluation",
    ],
    highlights: [
      "100 one-hour structured lessons across 10 sequential paths",
      "Language-independent — builds mental models, not syntactic memory",
      "80% mastery-gated checkpoints with interactive hints & step-by-step explanations",
      "Dual-portal tracking: real-time dashboard for students and college administrators",
      "Aligned with Tier-1 engineering hiring benchmarks (Google, Meta, Microsoft standards)",
    ],
  },
  {
    slug: "system-design-distributed-systems",
    title: "Distributed Systems & Scalable Architecture",
    tagline: "Design resilient, high-throughput microservices and distributed storage systems.",
    description:
      "Deep dive into consensus protocols, distributed caching, partition strategies, event sourcing, and high-availability patterns. Master tradeoffs between consistency, latency, and operational cost.",
    category: "System Design",
    priceAmount: 0,
    priceLabel: "Upcoming Track",
    originalPrice: "₹19,999",
    isFree: true,
    totalHours: 60,
    totalPaths: 6,
    totalModules: 12,
    publishedModules: 0,
    status: "coming_soon",
    rating: 4.9,
    reviewCount: 420,
    enrolledCount: 3100,
    instructor: "Distributed Infrastructure Platform Leads",
    instructorTitle: "Staff Cloud Architect",
    badge: "ROADMAP · Q2 2026",
    level: "Intermediate to Advanced",
    skills: [
      "Raft Consensus",
      "Distributed Caching",
      "Event-Driven Architecture",
      "Sharding & Partitioning",
      "Failure Modes & Circuit Breakers",
    ],
    highlights: [
      "Hands-on architectural modeling of real-world scale (100k+ RPS)",
      "Interactive failure simulations & disaster recovery drills",
      "Deep dive into CAP theorem invariants & PACELC models",
    ],
  },
  {
    slug: "genai-llm-systems-engineering",
    title: "Generative AI & LLM Systems: Production Engineering",
    tagline: "Build production-grade agentic workflows, RAG pipelines, and fine-tuning systems.",
    description:
      "Move beyond toy prompts to industrial LLM engineering. Learn hybrid vector retrieval, reranking, agentic tool orchestration, structured schema generation, and hallucination reduction.",
    category: "Artificial Intelligence",
    priceAmount: 0,
    priceLabel: "Upcoming Track",
    originalPrice: "₹18,499",
    isFree: true,
    totalHours: 45,
    totalPaths: 5,
    totalModules: 8,
    publishedModules: 0,
    status: "coming_soon",
    rating: 4.8,
    reviewCount: 380,
    enrolledCount: 2650,
    instructor: "AI Research & Systems Engineers",
    instructorTitle: "Principal Applied AI Engineer",
    badge: "ROADMAP · Q3 2026",
    level: "Intermediate",
    skills: [
      "Hybrid Vector Search",
      "Agentic Tool Orchestration",
      "Evaluation & Evals",
      "Latency & KV-Cache Optimization",
      "Model Alignment & Guardrails",
    ],
    highlights: [
      "Production-ready RAG architectures with rerankers & metadata filtering",
      "Autonomous agent loops with memory, tool calling, and validation gates",
      "Deterministic eval pipelines for latency, cost, and factual accuracy",
    ],
  },
  {
    slug: "full-stack-systems-engineering",
    title: "High-Performance Full Stack Web Systems",
    tagline: "Build zero-latency web applications with modern SSR, Edge computing, and typed APIs.",
    description:
      "A comprehensive curriculum on modern web architecture: Next.js App Router, edge workers, relational indexing, transaction isolation, web performance vitals, and enterprise security.",
    category: "Full Stack Engineering",
    priceAmount: 0,
    priceLabel: "Upcoming Track",
    originalPrice: "₹15,999",
    isFree: true,
    totalHours: 50,
    totalPaths: 5,
    totalModules: 10,
    publishedModules: 0,
    status: "coming_soon",
    rating: 4.9,
    reviewCount: 510,
    enrolledCount: 4200,
    instructor: "Senior Frontend & Platform Engineers",
    instructorTitle: "Staff Software Engineer",
    badge: "ROADMAP · Q3 2026",
    level: "Beginner to Intermediate",
    skills: [
      "Server-Side Streaming",
      "PostgreSQL Query Profiling",
      "Web Security & OAuth2",
      "Core Web Vitals Optimization",
      "State Machines in UI",
    ],
    highlights: [
      "Architect real-world applications with sub-100ms response targets",
      "Secure cookie proxies, CSRF protection, and Row Level Security",
      "Database schema migrations & index benchmarking",
    ],
  },
  {
    slug: "competitive-programming-olympiad",
    title: "Competitive Programming & Algorithmic Combinatorics",
    tagline: "Master advanced data structures, graph flows, and dynamic programming on trees.",
    description:
      "Engineered for ICPC contestants and competitive programmers aiming for Grandmaster/Candidate Master rank. Focus on tree centroid decomposition, heavy-light decomposition, segment trees, and network flows.",
    category: "Competitive Programming",
    priceAmount: 0,
    priceLabel: "Upcoming Track",
    originalPrice: "₹22,999",
    isFree: true,
    totalHours: 80,
    totalPaths: 8,
    totalModules: 16,
    publishedModules: 0,
    status: "coming_soon",
    rating: 4.9,
    reviewCount: 290,
    enrolledCount: 1850,
    instructor: "ICPC World Finalists & Grandmasters",
    instructorTitle: "ICPC Coach & Competitive Coder",
    badge: "ROADMAP · Q4 2026",
    level: "Advanced",
    skills: [
      "Heavy-Light Decomposition",
      "Max-Flow Min-Cut",
      "Dynamic Programming on Trees",
      "Persistent Data Structures",
      "Combinatorial Game Theory",
    ],
    highlights: [
      "Rigorous mathematical proofs for competitive invariant bounds",
      "Comprehensive library of reusable, bug-free C++ templates",
      "Past ICPC regional & world finals problem walkthroughs",
    ],
  },
];

export const UPCOMING_PACKAGES = COURSE_PACKAGES.filter((c) => c.status === "coming_soon").map(
  (c) => ({
    title: c.title,
    category: c.category,
    summary: c.description,
  }),
);

export function getCoursePackageBySlug(slug: string): CourseCatalogItem | undefined {
  return COURSE_PACKAGES.find((course) => course.slug === slug);
}
