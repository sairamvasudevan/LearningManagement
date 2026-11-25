import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export type DbUser = {
  id: string;
  email: string;
  role: "student" | "admin";
  full_name: string;
  phone: string;
  college: string;
  register_number: string;
  department: string;
  degree: string;
  graduation_year: number | null;
  enrollment_status: "approved" | "pending";
  password_hash?: string;
  password_salt?: string;
  created_at: string;
};

export type DbModuleProgress = {
  user_id: string;
  module_number: number;
  status: "not_started" | "in_progress" | "completed";
  best_score: number;
  total_marks: number;
  attempts: number;
  first_started_at: string | null;
  completed_at: string | null;
};

export type DbAssessmentAttempt = {
  id: string;
  user_id: string;
  module_number: number;
  score: number;
  total_marks: number;
  passed: boolean;
  answers_json: string;
  started_at: string;
  submitted_at: string;
};

export type DbPracticeSubmission = {
  id: string;
  user_id: string;
  module_number: number;
  task_id: string;
  task_prompt: string;
  submission: string;
  status: string;
  submitted_at: string;
};

export type DbDsaSubmission = {
  id: string;
  user_id: string;
  problem_id: string;
  language: string;
  code: string;
  status: "ACCEPTED" | "WRONG_ANSWER" | "COMPILE_ERROR" | "TIME_LIMIT_EXCEEDED" | "RUNTIME_ERROR";
  test_cases_passed: number;
  total_test_cases: number;
  execution_time_ms: number;
  created_at: string;
};

export type DbModuleFeedback = {
  id: string;
  user_id: string;
  module_number: number;
  stage_id: number;
  helpfulness_rating: number; // 1-5
  difficulty_level: "too_easy" | "just_right" | "too_hard";
  ease_of_use_rating: number; // 1-5
  feedback_text: string;
  created_at: string;
  updated_at: string;
};

export type DbModuleFeedbackWithUser = DbModuleFeedback & {
  user_name: string;
  user_email: string;
  user_college: string;
  user_register_number: string;
};

export type StudentProjectItem = {
  id: string;
  title: string;
  techStack: string[];
  summary: string;
  impactMetric?: string;
  repoUrl?: string;
  liveUrl?: string;
};

export type StudentExperienceItem = {
  id: string;
  company: string;
  role: string;
  duration: string;
  highlights: string;
};

export type DbStudentCareerProfile = {
  user_id: string;
  admission_no: string;
  enrollment_no: string;
  school: string;
  branch: string;
  semester: number;
  section: string;
  batch_year: number;
  cgpa: number;
  tenth_pct: number;
  twelfth_pct: number;
  active_backlogs: number;
  placement_eligible: boolean;
  headline: string;
  career_summary: string;
  skills: string[];
  certifications: string[];
  achievements: string[];
  projects: StudentProjectItem[];
  experiences: StudentExperienceItem[];
  codolio_handle: string;
  codolio_url: string;
  codolio_total_solved: number;
  leetcode_handle: string;
  leetcode_solved: number;
  leetcode_rating: number;
  codechef_handle: string;
  codechef_rating: number;
  codeforces_handle: string;
  codeforces_rating: number;
  gfg_handle: string;
  gfg_solved: number;
  hackerrank_handle: string;
  github_handle: string;
  github_repos: number;
  linkedin_url: string;
  portfolio_url: string;
  resume_url: string;
  updated_at: string;
};

export type StudentCareerSnapshot = {
  user: DbUser;
  career: DbStudentCareerProfile;
  platformStats: {
    modulesCompleted: number;
    dsaSolvedCount: number;
    bestVersantScore: number | null;
    latestCefr: string | null;
  };
};

export type DbPlacementDrive = {
  id: string;
  company_name: string;
  role_title: string;
  ctc_package: string;
  jd_text: string;
  min_cgpa: number;
  max_backlogs: number;
  allowed_branches: string[];
  required_skills: string[];
  min_coding_solved: number;
  min_lsrw_score: number;
  shortlisted_user_ids: string[];
  created_by: string;
  created_at: string;
};

export function sanitizeExternalUrl(raw: unknown): string {
  const s = String(raw || "").trim();
  if (!s) return "";
  try {
    const parsed = new URL(s);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return parsed.toString();
    }
  } catch {}
  return "";
}

let dbInstance: DatabaseSync | null = null;

export function getDatabase(): DatabaseSync {
  if (dbInstance) return dbInstance;

  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, "lms.db");
  const db = new DatabaseSync(dbPath);

  // WAL mode for fast concurrency
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");

  // Schema initialization
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL DEFAULT 'student',
      full_name TEXT NOT NULL,
      phone TEXT DEFAULT '',
      college TEXT DEFAULT '',
      register_number TEXT DEFAULT '',
      department TEXT DEFAULT '',
      degree TEXT DEFAULT '',
      graduation_year INTEGER DEFAULT 2026,
      enrollment_status TEXT NOT NULL DEFAULT 'approved',
      password_hash TEXT DEFAULT '',
      password_salt TEXT DEFAULT '',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS module_progress (
      user_id TEXT NOT NULL,
      module_number INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'not_started',
      best_score INTEGER NOT NULL DEFAULT 0,
      total_marks INTEGER NOT NULL DEFAULT 12,
      attempts INTEGER NOT NULL DEFAULT 0,
      first_started_at TEXT,
      completed_at TEXT,
      PRIMARY KEY (user_id, module_number),
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS assessment_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      module_number INTEGER NOT NULL,
      score INTEGER NOT NULL,
      total_marks INTEGER NOT NULL,
      passed INTEGER NOT NULL DEFAULT 0,
      answers_json TEXT DEFAULT '{}',
      started_at TEXT NOT NULL,
      submitted_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS practice_submissions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      module_number INTEGER NOT NULL,
      task_id TEXT NOT NULL,
      task_prompt TEXT DEFAULT '',
      submission TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'passed',
      submitted_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS dsa_submissions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      problem_id TEXT NOT NULL,
      language TEXT NOT NULL,
      code TEXT NOT NULL,
      status TEXT NOT NULL,
      test_cases_passed INTEGER NOT NULL,
      total_test_cases INTEGER NOT NULL,
      execution_time_ms INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_dsa_sub_user ON dsa_submissions(user_id, problem_id);

    CREATE TABLE IF NOT EXISTS module_feedback (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      module_number INTEGER NOT NULL,
      stage_id INTEGER NOT NULL DEFAULT 1,
      helpfulness_rating INTEGER NOT NULL,
      difficulty_level TEXT NOT NULL,
      ease_of_use_rating INTEGER NOT NULL,
      feedback_text TEXT DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(user_id, module_number),
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_mod_feedback_module ON module_feedback(module_number);
    CREATE INDEX IF NOT EXISTS idx_mod_feedback_user ON module_feedback(user_id);

    CREATE TABLE IF NOT EXISTS course_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      registration_mode TEXT NOT NULL DEFAULT 'open',
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS course_invites (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS communication_submissions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      mode TEXT NOT NULL,
      skill TEXT NOT NULL,
      exercise_id TEXT NOT NULL,
      overall_score INTEGER NOT NULL,
      percent_score INTEGER NOT NULL,
      cefr_level TEXT NOT NULL,
      sentence_mastery INTEGER NOT NULL,
      vocabulary_score INTEGER NOT NULL,
      fluency_score INTEGER NOT NULL,
      delivery_score INTEGER NOT NULL,
      passed INTEGER NOT NULL DEFAULT 0,
      response_summary TEXT DEFAULT '',
      feedback_json TEXT DEFAULT '{}',
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_comm_sub_user ON communication_submissions(user_id, created_at);

    CREATE TABLE IF NOT EXISTS student_career_profiles (
      user_id TEXT PRIMARY KEY,
      admission_no TEXT DEFAULT '',
      enrollment_no TEXT DEFAULT '',
      school TEXT DEFAULT 'School of Computing Science & Engineering',
      branch TEXT DEFAULT 'B.Tech CSE',
      semester INTEGER DEFAULT 6,
      section TEXT DEFAULT 'A',
      batch_year INTEGER DEFAULT 2026,
      cgpa REAL DEFAULT 0,
      tenth_pct REAL DEFAULT 0,
      twelfth_pct REAL DEFAULT 0,
      active_backlogs INTEGER DEFAULT 0,
      placement_eligible INTEGER DEFAULT 1,
      headline TEXT DEFAULT '',
      career_summary TEXT DEFAULT '',
      skills_json TEXT DEFAULT '[]',
      certifications_json TEXT DEFAULT '[]',
      achievements_json TEXT DEFAULT '[]',
      projects_json TEXT DEFAULT '[]',
      experiences_json TEXT DEFAULT '[]',
      codolio_handle TEXT DEFAULT '',
      codolio_url TEXT DEFAULT '',
      codolio_total_solved INTEGER DEFAULT 0,
      leetcode_handle TEXT DEFAULT '',
      leetcode_solved INTEGER DEFAULT 0,
      leetcode_rating INTEGER DEFAULT 0,
      codechef_handle TEXT DEFAULT '',
      codechef_rating INTEGER DEFAULT 0,
      codeforces_handle TEXT DEFAULT '',
      codeforces_rating INTEGER DEFAULT 0,
      gfg_handle TEXT DEFAULT '',
      gfg_solved INTEGER DEFAULT 0,
      hackerrank_handle TEXT DEFAULT '',
      github_handle TEXT DEFAULT '',
      github_repos INTEGER DEFAULT 0,
      linkedin_url TEXT DEFAULT '',
      portfolio_url TEXT DEFAULT '',
      resume_url TEXT DEFAULT '',
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS placement_drives (
      id TEXT PRIMARY KEY,
      company_name TEXT NOT NULL,
      role_title TEXT NOT NULL,
      ctc_package TEXT DEFAULT '',
      jd_text TEXT NOT NULL,
      min_cgpa REAL DEFAULT 0,
      max_backlogs INTEGER DEFAULT 0,
      allowed_branches_json TEXT DEFAULT '[]',
      required_skills_json TEXT DEFAULT '[]',
      min_coding_solved INTEGER DEFAULT 0,
      min_lsrw_score INTEGER DEFAULT 0,
      shortlisted_user_ids_json TEXT DEFAULT '[]',
      created_by TEXT DEFAULT '',
      created_at TEXT NOT NULL
    );
  `);

  // Seed default course_settings row if missing
  try {
    const settingsRow = db.prepare("SELECT registration_mode FROM course_settings WHERE id = 1").get() as { registration_mode: string } | undefined;
    if (!settingsRow) {
      db.prepare("INSERT INTO course_settings (id, registration_mode, updated_at) VALUES (1, 'open', ?)").run(
        new Date().toISOString(),
      );
    }
  } catch {}

  // Schema migration for password_hash and password_salt
  try {
    const cols = db.prepare("PRAGMA table_info(users)").all() as { name: string }[];
    const colNames = cols.map((c) => c.name);
    if (!colNames.includes("password_hash")) {
      db.exec("ALTER TABLE users ADD COLUMN password_hash TEXT DEFAULT '';");
    }
    if (!colNames.includes("password_salt")) {
      db.exec("ALTER TABLE users ADD COLUMN password_salt TEXT DEFAULT '';");
    }
  } catch {}

  // Pre-seed default Admin if not exists or update password
  const adminSalt = "admin_salt_nexus_2026";
  const adminHash = crypto.pbkdf2Sync("AdminPassword123!", adminSalt, 100000, 64, "sha512").toString("hex");

  const existingAdmin = db.prepare("SELECT id, password_hash FROM users WHERE email = ?").get("admin@learninghub.edu") as { id: string; password_hash?: string } | undefined;
  if (!existingAdmin) {
    db.prepare(`
      INSERT INTO users (id, email, role, full_name, phone, college, register_number, department, degree, graduation_year, enrollment_status, password_hash, password_salt, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      "00000000-0000-4000-a000-000000000099",
      "admin@learninghub.edu",
      "admin",
      "Prof. Sairam Vasudevan",
      "+91 98401 00099",
      "Learning Management System Admin",
      "ADMIN-FACULTY-01",
      "Academic & Placement Affairs",
      "Head of Technical Learning",
      2020,
      "approved",
      adminHash,
      adminSalt,
      new Date().toISOString(),
    );
  } else if (!existingAdmin.password_hash || !existingAdmin.password_hash.trim()) {
    db.prepare("UPDATE users SET password_hash = ?, password_salt = ? WHERE email = ?").run(adminHash, adminSalt, "admin@learninghub.edu");
  }

  // Pre-seed default Demo Student if not exists or update password
  const studentSalt = "student_salt_nexus_2026";
  const studentHash = crypto.pbkdf2Sync("StudentPassword123!", studentSalt, 100000, 64, "sha512").toString("hex");

  const existingStudent = db.prepare("SELECT id, password_hash FROM users WHERE email = ?").get("student@learninghub.edu") as { id: string; password_hash?: string } | undefined;
  if (!existingStudent) {
    db.prepare(`
      INSERT INTO users (id, email, role, full_name, phone, college, register_number, department, degree, graduation_year, enrollment_status, password_hash, password_salt, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      "00000000-0000-4000-a000-000000000001",
      "student@learninghub.edu",
      "student",
      "Aditya Sharma",
      "+91 98401 11223",
      "National Institute of Technology, Trichy",
      "NITT-2024-CS-0842",
      "Computer Science and Engineering",
      "B.Tech Computer Science",
      2026,
      "approved",
      studentHash,
      studentSalt,
      new Date().toISOString(),
    );
  } else if (!existingStudent.password_hash || !existingStudent.password_hash.trim()) {
    db.prepare("UPDATE users SET password_hash = ?, password_salt = ? WHERE email = ?").run(studentHash, studentSalt, "student@learninghub.edu");
  }

  // Pre-seed sample module feedback if empty
  try {
    const feedbackCountRow = db.prepare("SELECT COUNT(*) as count FROM module_feedback").get() as { count: number };
    if (feedbackCountRow && feedbackCountRow.count === 0) {
      const demoUserId = "00000000-0000-4000-a000-000000000001";
      const now = new Date().toISOString();
      const insertFeedback = db.prepare(`
        INSERT INTO module_feedback (id, user_id, module_number, stage_id, helpfulness_rating, difficulty_level, ease_of_use_rating, feedback_text, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insertFeedback.run(
        "fb-demo-01",
        demoUserId,
        1,
        1,
        5,
        "just_right",
        5,
        "The step-by-step loop invariant formulation and the invariant checklist were brilliant. The interactive hints in the checkpoint helped me think through edge cases without spoiling the solution.",
        now,
        now,
      );
      insertFeedback.run(
        "fb-demo-02",
        demoUserId,
        2,
        1,
        4,
        "just_right",
        5,
        "Great coverage of monotonic properties and prefix sums. Would love 1 additional diagram showing the 2D prefix sum inclusion-exclusion region.",
        now,
        now,
      );
      insertFeedback.run(
        "fb-demo-03",
        demoUserId,
        3,
        1,
        5,
        "too_hard",
        4,
        "Sliding window dynamic contractions are conceptually tough. The examples are deep; maybe add a beginner stepping-stone question before the shrink condition.",
        now,
        now,
      );
    }
  } catch {}

  dbInstance = db;

  // Seed Galgotias University campus career profiles if empty so T&P JD Matcher & Student Resume hub are populated out-of-box
  try {
    const careerCountRow = db
      .prepare("SELECT COUNT(*) as count FROM student_career_profiles")
      .get() as { count: number };
    if (careerCountRow && careerCountRow.count === 0) {
      const now = new Date().toISOString();
      const upsertStmt = db.prepare(`
        INSERT OR IGNORE INTO student_career_profiles (
          user_id, admission_no, enrollment_no, school, branch, semester, section, batch_year,
          cgpa, tenth_pct, twelfth_pct, active_backlogs, placement_eligible,
          headline, career_summary, skills_json, certifications_json, achievements_json,
          projects_json, experiences_json,
          codolio_handle, codolio_url, codolio_total_solved,
          leetcode_handle, leetcode_solved, leetcode_rating,
          codechef_handle, codechef_rating, codeforces_handle, codeforces_rating,
          gfg_handle, gfg_solved, hackerrank_handle, github_handle, github_repos,
          linkedin_url, portfolio_url, resume_url, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      // Attach rich Galgotias profile to default student (00000000-...-0001)
      upsertStmt.run(
        "00000000-0000-4000-a000-000000000001",
        "24SCSE1010842",
        "GU-2022-88421",
        "School of Computing Science & Engineering",
        "B.Tech CSE",
        7,
        "A3",
        2026,
        8.64,
        92.4,
        89.8,
        0,
        1,
        "Full-Stack Engineer & Competitive Programmer · React, Node.js, C++",
        "Final-year Galgotias University B.Tech CSE scholar specializing in scalable Next.js/Node.js backend systems, relational modeling, and dynamic programming.",
        JSON.stringify(["C++", "Java", "Python", "TypeScript", "React", "Next.js", "Node.js", "SQL", "PostgreSQL", "Docker", "Data Structures", "Algorithms", "System Design"]),
        JSON.stringify(["AWS Certified Cloud Practitioner", "NPTEL Design & Analysis of Algorithms (Elite Gold)"]),
        JSON.stringify(["Smart India Hackathon 2025 Finalist", "Top 4% Institute Codolio Rank"]),
        JSON.stringify([
          {
            id: "proj-aditya-1",
            title: "CampusGrid Distributed Quiz & Code Runner",
            techStack: ["Next.js", "TypeScript", "SQLite", "Docker", "Node.js"],
            summary: "Built a sandboxed multi-language execution engine supporting C++, Java, and Python with real-time queue isolation.",
            impactMetric: "Served 1,200+ lab evaluations at <180ms median latency",
            repoUrl: "https://github.com/adityasharma-gu/campusgrid",
          },
          {
            id: "proj-aditya-2",
            title: "PulsePay Ledger Reconciler",
            techStack: ["Java", "Spring Boot", "PostgreSQL", "REST API"],
            summary: "Implemented idempotent ledger postings and webhook retry queues.",
            impactMetric: "99.98% reconciliation consistency across 50k mock txns",
            repoUrl: "https://github.com/adityasharma-gu/pulsepay",
          },
        ]),
        JSON.stringify([
          {
            id: "exp-aditya-1",
            company: "FinEdge Systems",
            role: "Software Engineering Intern",
            duration: "May 2025 – Jul 2025",
            highlights: "Reduced API P95 response time by 42% using PostgreSQL composite indexes and Redis read-through caching.",
          },
        ]),
        "aditya_gu",
        "https://codolio.com/profile/aditya_gu",
        512,
        "aditya_lc",
        380,
        1845,
        "aditya_cc",
        1710,
        "aditya_cf",
        1430,
        "aditya_gfg",
        215,
        "aditya_hr",
        "adityasharma-gu",
        28,
        "https://linkedin.com/in/adityasharma-gu",
        "",
        "",
        now,
      );

      // Seed 5 diverse Galgotias University campus student records for realistic T&P JD filtering
      const cohortSeeds = [
        {
          id: "00000000-0000-4000-a000-000000000101",
          email: "ananya.verma@galgotiasuniversity.edu.in",
          name: "Ananya Verma",
          phone: "+91 98112 44001",
          adm: "23SCSE1040112",
          enroll: "GU-2022-40112",
          branch: "B.Tech CSE (AI & ML)",
          cgpa: 9.18,
          tenth: 95.0,
          twelfth: 93.2,
          backlogs: 0,
          headline: "Applied ML & Python Backend Engineer · PyTorch, FastAPI, AWS",
          summary: "Top-decile Galgotias AI & ML undergrad focused on LLM evaluation pipelines, RAG retrieval, and production Python microservices.",
          skills: ["Python", "PyTorch", "TensorFlow", "FastAPI", "SQL", "PostgreSQL", "Docker", "AWS", "Data Structures", "REST API", "Git"],
          certs: ["DeepLearning.AI Specialization", "AWS Academy Machine Learning Foundations"],
          achievements: ["Dean's Merit Scholarship 2024 & 2025", "1st Runner-Up Galgotias AI Hackathon"],
          projects: [
            {
              id: "proj-ananya-1",
              title: "ClinicalDoc Hybrid RAG Copilot",
              techStack: ["Python", "FastAPI", "PyTorch", "PostgreSQL", "Docker"],
              summary: "Constructed hybrid BM25 + dense vector retrieval with hallucination grounding metrics.",
              impactMetric: "Improved citation precision by 31% on internal clinical QA bench",
              repoUrl: "https://github.com/ananyaverma-gu/clinical-rag",
            },
          ],
          experiences: [
            {
              id: "exp-ananya-1",
              company: "CortexData Labs",
              role: "ML Engineering Intern",
              duration: "Jun 2025 – Aug 2025",
              highlights: "Automated batch inference pipeline in Python & AWS Lambda handling 20k documents/day.",
            },
          ],
          codolioHandle: "ananya_ml_gu",
          codolioTotal: 420,
          lcSolved: 310,
          lcRating: 1765,
          ccRating: 1620,
          cfRating: 1310,
          gfgSolved: 170,
          ghHandle: "ananyaverma-gu",
          ghRepos: 22,
          versant: 72,
          cefr: "C1",
        },
        {
          id: "00000000-0000-4000-a000-000000000102",
          email: "rohan.mehta@galgotiasuniversity.edu.in",
          name: "Rohan Mehta",
          phone: "+91 98112 44002",
          adm: "23SCSE1010298",
          enroll: "GU-2022-10298",
          branch: "B.Tech CSE",
          cgpa: 7.92,
          tenth: 86.4,
          twelfth: 84.0,
          backlogs: 0,
          headline: "MERN Full-Stack & Cloud Native Developer · React, Node, MongoDB, Kubernetes",
          summary: "Full-stack builder shipping responsive TypeScript React interfaces and horizontally scaled Node/Express services.",
          skills: ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Express", "MongoDB", "SQL", "Tailwind", "Docker", "Kubernetes", "Git"],
          certs: ["Meta Front-End Developer Certificate", "MongoDB Associate Developer"],
          achievements: ["Built Galgotias Technical Fest Registration Portal (8,000+ users)"],
          projects: [
            {
              id: "proj-rohan-1",
              title: "Galgotias Campus Event & Ticketing Hub",
              techStack: ["React", "Node.js", "Express", "MongoDB", "Docker"],
              summary: "Implemented QR pass issuance, role-based coordinator check-in, and real-time seat telemetry.",
              impactMetric: "Processed 8,200 student registrations during Unifest",
              repoUrl: "https://github.com/rohanmehta-gu/unifest-hub",
            },
            {
              id: "proj-rohan-2",
              title: "CollabBoard CRDT Whiteboard",
              techStack: ["TypeScript", "React", "WebSockets", "Node.js"],
              summary: "Real-time multi-user canvas with conflict-free state synchronization.",
              impactMetric: "<40ms sync broadcast latency",
            },
          ],
          experiences: [],
          codolioHandle: "rohan_dev_gu",
          codolioTotal: 295,
          lcSolved: 210,
          lcRating: 1580,
          ccRating: 1510,
          cfRating: 1180,
          gfgSolved: 135,
          ghHandle: "rohanmehta-gu",
          ghRepos: 34,
          versant: 66,
          cefr: "B2+",
        },
        {
          id: "00000000-0000-4000-a000-000000000103",
          email: "priya.nair@galgotiasuniversity.edu.in",
          name: "Priya Nair",
          phone: "+91 98112 44003",
          adm: "23SCSE1010514",
          enroll: "GU-2022-10514",
          branch: "B.Tech IT",
          cgpa: 8.45,
          tenth: 91.2,
          twelfth: 90.5,
          backlogs: 0,
          headline: "Enterprise Java & Cloud Microservices Engineer · Spring Boot, SQL, AWS",
          summary: "Strong foundation in Core Java, DBMS, Operating Systems, RESTful Spring Boot services, and clear stakeholder communication.",
          skills: ["Java", "Spring Boot", "SQL", "MySQL", "PostgreSQL", "REST API", "DBMS", "Operating Systems", "Data Structures", "Algorithms", "AWS"],
          certs: ["Oracle Certified Associate Java SE 17", "TCS Ion Career Edge Distinction"],
          achievements: ["Versant C1 Scorer in Campus LSRW Drive", "Led 5-member NSS Tech Literacy Drive"],
          projects: [
            {
              id: "proj-priya-1",
              title: "FinTrust Loan Underwriting Engine",
              techStack: ["Java", "Spring Boot", "MySQL", "REST API"],
              summary: "Role-secured REST microservices calculating DTI risk ratios and automated EMI amortizations.",
              impactMetric: "98% JUnit service coverage",
              repoUrl: "https://github.com/priyanair-gu/fintrust",
            },
          ],
          experiences: [
            {
              id: "exp-priya-1",
              company: "Apex Enterprise IT",
              role: "Backend Java Intern",
              duration: "Jan 2025 – Mar 2025",
              highlights: "Migrated 12 legacy JDBC stored procedures to Spring Data JPA + optimized join plans.",
            },
          ],
          codolioHandle: "priya_java_gu",
          codolioTotal: 360,
          lcSolved: 265,
          lcRating: 1690,
          ccRating: 1640,
          cfRating: 1240,
          gfgSolved: 240,
          ghHandle: "priyanair-gu",
          ghRepos: 16,
          versant: 75,
          cefr: "C1",
        },
        {
          id: "00000000-0000-4000-a000-000000000104",
          email: "kabir.singh@galgotiasuniversity.edu.in",
          name: "Kabir Singh",
          phone: "+91 98112 44004",
          adm: "23SCSE1020771",
          enroll: "GU-2022-20771",
          branch: "B.Tech CSE",
          cgpa: 7.41,
          tenth: 81.0,
          twelfth: 79.5,
          backlogs: 0,
          headline: "Competitive Programmer (Candidate Master Track) · C++, Algorithms, Low Latency",
          summary: "Algorithmic problem solver focused on Graph Theory, Segment Trees, DP optimizations, and C++ systems code.",
          skills: ["C++", "C", "Data Structures", "Algorithms", "Dynamic Programming", "System Design", "Operating Systems", "Git"],
          certs: ["ICPC Asia West Kanpur-Mathura Regionalist"],
          achievements: ["Codeforces Expert (1685)", "Solved 850+ problems unified across Codolio"],
          projects: [
            {
              id: "proj-kabir-1",
              title: "OrderMatch C++ Lock-Free Simulator",
              techStack: ["C++", "Data Structures", "Algorithms"],
              summary: "Order book matcher benchmarked with custom pool allocators.",
              impactMetric: "1.4M order matches/sec single-thread",
              repoUrl: "https://github.com/kabirsingh-gu/ordermatch-cpp",
            },
          ],
          experiences: [],
          codolioHandle: "kabir_cp_gu",
          codolioTotal: 855,
          lcSolved: 640,
          lcRating: 2045,
          ccRating: 1960,
          cfRating: 1685,
          gfgSolved: 190,
          ghHandle: "kabirsingh-gu",
          ghRepos: 14,
          versant: 58,
          cefr: "B2",
        },
        {
          id: "00000000-0000-4000-a000-000000000105",
          email: "sneha.patel@galgotiasuniversity.edu.in",
          name: "Sneha Patel",
          phone: "+91 98112 44005",
          adm: "23SCSE1050603",
          enroll: "GU-2022-50603",
          branch: "B.Tech CSE (Data Science)",
          cgpa: 6.85,
          tenth: 78.0,
          twelfth: 76.2,
          backlogs: 1,
          headline: "Data Analyst & BI Developer · SQL, Python, PowerBI, Pandas",
          summary: "Focused on SQL cohort analytics, ETL cleanup scripts, and interactive business reporting.",
          skills: ["Python", "SQL", "PostgreSQL", "MySQL", "Machine Learning", "Git"],
          certs: ["Google Data Analytics Professional Certificate"],
          achievements: ["Organized Galgotias DataViz Sprint"],
          projects: [
            {
              id: "proj-sneha-1",
              title: "Retail Churn Cohort Analyzer",
              techStack: ["Python", "SQL", "PostgreSQL"],
              summary: "Retention cohort funnel queries and logistic churn risk model.",
              impactMetric: "Identified top 3 churn predictors on 40k synthetic rows",
            },
          ],
          experiences: [],
          codolioHandle: "sneha_data_gu",
          codolioTotal: 140,
          lcSolved: 95,
          lcRating: 1410,
          ccRating: 1380,
          cfRating: 950,
          gfgSolved: 75,
          ghHandle: "snehapatel-gu",
          ghRepos: 9,
          versant: 62,
          cefr: "B2+",
        },
      ];

      const insertUserStmt = db.prepare(`
        INSERT OR IGNORE INTO users (
          id, email, role, full_name, phone, college, register_number, department, degree,
          graduation_year, enrollment_status, password_hash, password_salt, created_at
        ) VALUES (?, ?, 'student', ?, ?, 'Galgotias University', ?, ?, ?, 2026, 'approved', ?, ?, ?)
      `);
      const insertCommStmt = db.prepare(`
        INSERT OR IGNORE INTO communication_submissions (
          id, user_id, mode, skill, exercise_id, overall_score, percent_score, cefr_level,
          sentence_mastery, vocabulary_score, fluency_score, delivery_score, passed, response_summary, feedback_json, created_at
        ) VALUES (?, ?, 'assessment', 'full_mock', 'corporate-lsrw-mock-v1', ?, ?, ?, ?, ?, ?, ?, 1, 'Seeded campus LSRW benchmark', '{}', ?)
      `);

      for (const s of cohortSeeds) {
        insertUserStmt.run(
          s.id,
          s.email,
          s.name,
          s.phone,
          s.adm,
          s.branch,
          s.branch,
          studentHash,
          studentSalt,
          now,
        );
        upsertStmt.run(
          s.id,
          s.adm,
          s.enroll,
          "School of Computing Science & Engineering",
          s.branch,
          7,
          "A1",
          2026,
          s.cgpa,
          s.tenth,
          s.twelfth,
          s.backlogs,
          s.backlogs === 0 ? 1 : 0,
          s.headline,
          s.summary,
          JSON.stringify(s.skills),
          JSON.stringify(s.certs),
          JSON.stringify(s.achievements),
          JSON.stringify(s.projects),
          JSON.stringify(s.experiences),
          s.codolioHandle,
          `https://codolio.com/profile/${s.codolioHandle}`,
          s.codolioTotal,
          `${s.codolioHandle}_lc`,
          s.lcSolved,
          s.lcRating,
          `${s.codolioHandle}_cc`,
          s.ccRating,
          `${s.codolioHandle}_cf`,
          s.cfRating,
          `${s.codolioHandle}_gfg`,
          s.gfgSolved,
          `${s.codolioHandle}_hr`,
          s.ghHandle,
          s.ghRepos,
          `https://linkedin.com/in/${s.ghHandle}`,
          "",
          "",
          now,
        );
        insertCommStmt.run(
          `comm-seed-${s.id.slice(-3)}`,
          s.id,
          s.versant,
          Math.round(((s.versant - 20) / 60) * 100),
          s.cefr,
          s.versant,
          s.versant - 1,
          s.versant - 2,
          s.versant + 1,
          now,
        );
      }
    }
  } catch {}

  return db;
}

/* -------------------------------------------------------------
   CRYPTOGRAPHIC PASSWORD APIS
------------------------------------------------------------- */
export function hashPassword(password: string, existingSalt?: string): { hash: string; salt: string } {
  const salt = existingSalt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  if (!password || !hash || !salt) return false;
  try {
    const computed = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(hash));
  } catch {
    return false;
  }
}

/* -------------------------------------------------------------
   USER & SESSION APIS
------------------------------------------------------------- */
export function createUser(data: {
  email: string;
  role?: "student" | "admin";
  enrollment_status?: "approved" | "pending";
  full_name: string;
  phone?: string;
  college?: string;
  register_number?: string;
  department?: string;
  degree?: string;
  graduation_year?: number | null;
  password?: string;
}): DbUser {
  const db = getDatabase();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const email = data.email.toLowerCase().trim();
  const role: "student" | "admin" = data.role === "admin" ? "admin" : "student";
  const enrollmentStatus = data.enrollment_status === "pending" ? "pending" : "approved";

  let pHash = "";
  let pSalt = "";
  if (data.password) {
    const { hash, salt } = hashPassword(data.password);
    pHash = hash;
    pSalt = salt;
  }

  db.prepare(`
    INSERT INTO users (id, email, role, full_name, phone, college, register_number, department, degree, graduation_year, enrollment_status, password_hash, password_salt, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    email,
    role,
    data.full_name.trim(),
    (data.phone || "").trim(),
    (data.college || "").trim(),
    (data.register_number || "").trim(),
    (data.department || "").trim(),
    (data.degree || "").trim(),
    data.graduation_year ?? 2026,
    enrollmentStatus,
    pHash,
    pSalt,
    now,
  );

  return getUserById(id)!;
}

export function validateUserCredentials(email: string, password: string): { user: DbUser | null; error?: string } {
  const cleanEmail = email.toLowerCase().trim();
  const user = getUserByEmail(cleanEmail);

  if (!user) {
    return { user: null, error: "No account found with this email. Please register first." };
  }

  if (!user.password_hash || !user.password_salt) {
    return { user: null, error: "Account password is not set or has expired. Please contact administration." };
  }

  const isValid = verifyPassword(password, user.password_hash, user.password_salt);
  if (!isValid) {
    return { user: null, error: "Incorrect password. Please verify your credentials." };
  }

  return { user, error: undefined };
}

export function getUserById(id: string): DbUser | null {
  const db = getDatabase();
  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as unknown;
  return (row as DbUser) || null;
}

export function getUserByEmail(email: string): DbUser | null {
  const db = getDatabase();
  const row = db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase().trim()) as unknown;
  return (row as DbUser) || null;
}

export function createSession(userId: string): string {
  const db = getDatabase();
  const token = crypto.randomBytes(32).toString("hex");
  const now = new Date();
  const nowIso = now.toISOString();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

  // Garbage-collect expired sessions
  db.prepare("DELETE FROM sessions WHERE expires_at < ?").run(nowIso);

  db.prepare(`
    INSERT INTO sessions (token, user_id, created_at, expires_at)
    VALUES (?, ?, ?, ?)
  `).run(token, userId, nowIso, expiresAt);

  return token;
}

export function getUserBySessionToken(token: string): DbUser | null {
  const db = getDatabase();
  const session = db.prepare(`
    SELECT user_id, expires_at FROM sessions WHERE token = ?
  `).get(token) as { user_id: string; expires_at: string } | undefined;

  if (!session) return null;

  if (new Date(session.expires_at) < new Date()) {
    deleteSession(token);
    return null;
  }

  return getUserById(session.user_id);
}

export function deleteSession(token: string) {
  const db = getDatabase();
  db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

/* -------------------------------------------------------------
   PROGRESS & ASSESSMENT APIS
------------------------------------------------------------- */
export function getUserProgress(userId: string): DbModuleProgress[] {
  const db = getDatabase();
  const rows = db.prepare(`
    SELECT * FROM module_progress WHERE user_id = ? ORDER BY module_number ASC
  `).all(userId) as unknown;
  return (rows as DbModuleProgress[]) || [];
}

export function recordAssessmentAttempt(data: {
  userId: string;
  moduleNumber: number;
  score: number;
  totalMarks: number;
  passed: boolean;
  answersJson?: string;
}): { attemptId: string; passed: boolean } {
  const db = getDatabase();
  const attemptId = `att-${crypto.randomUUID()}`;
  const now = new Date().toISOString();

  // 1. Insert attempt row
  db.prepare(`
    INSERT INTO assessment_attempts (id, user_id, module_number, score, total_marks, passed, answers_json, started_at, submitted_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    attemptId,
    data.userId,
    data.moduleNumber,
    data.score,
    data.totalMarks,
    data.passed ? 1 : 0,
    data.answersJson || "{}",
    now,
    now,
  );

  // 2. Upsert module_progress
  const existing = db.prepare(`
    SELECT * FROM module_progress WHERE user_id = ? AND module_number = ?
  `).get(data.userId, data.moduleNumber) as DbModuleProgress | undefined;

  if (existing) {
    const isCompleted = existing.status === "completed" || data.passed;
    db.prepare(`
      UPDATE module_progress
      SET status = ?,
          best_score = MAX(best_score, ?),
          total_marks = ?,
          attempts = attempts + 1,
          completed_at = CASE WHEN ? = 1 AND completed_at IS NULL THEN ? ELSE completed_at END
      WHERE user_id = ? AND module_number = ?
    `).run(
      isCompleted ? "completed" : "in_progress",
      data.score,
      data.totalMarks,
      data.passed ? 1 : 0,
      now,
      data.userId,
      data.moduleNumber,
    );
  } else {
    db.prepare(`
      INSERT INTO module_progress (user_id, module_number, status, best_score, total_marks, attempts, first_started_at, completed_at)
      VALUES (?, ?, ?, ?, ?, 1, ?, ?)
    `).run(
      data.userId,
      data.moduleNumber,
      data.passed ? "completed" : "in_progress",
      data.score,
      data.totalMarks,
      now,
      data.passed ? now : null,
    );
  }

  return { attemptId, passed: data.passed };
}

export function getUserAttempts(userId: string): DbAssessmentAttempt[] {
  const db = getDatabase();
  const rows = db.prepare(`
    SELECT * FROM assessment_attempts WHERE user_id = ? ORDER BY submitted_at DESC LIMIT 25
  `).all(userId) as unknown;
  return (rows as DbAssessmentAttempt[]) || [];
}

export function savePracticeTask(data: {
  userId: string;
  moduleNumber: number;
  taskId: string;
  taskPrompt: string;
  submission: string;
}): { id: string } {
  const db = getDatabase();
  const id = `task-${crypto.randomUUID()}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO practice_submissions (id, user_id, module_number, task_id, task_prompt, submission, status, submitted_at)
    VALUES (?, ?, ?, ?, ?, ?, 'passed', ?)
  `).run(id, data.userId, data.moduleNumber, data.taskId, data.taskPrompt, data.submission, now);

  return { id };
}

export function getPracticeSubmissions(userId: string, moduleNumber?: number): DbPracticeSubmission[] {
  const db = getDatabase();
  if (moduleNumber !== undefined) {
    const rows = db.prepare(`
      SELECT * FROM practice_submissions WHERE user_id = ? AND module_number = ? ORDER BY submitted_at DESC
    `).all(userId, moduleNumber) as unknown;
    return (rows as DbPracticeSubmission[]) || [];
  }
  const rows = db.prepare(`
    SELECT * FROM practice_submissions WHERE user_id = ? ORDER BY submitted_at DESC
  `).all(userId) as unknown;
  return (rows as DbPracticeSubmission[]) || [];
}

/* -------------------------------------------------------------
   ADMIN REPORTING APIS
------------------------------------------------------------- */
export type AdminStudentSummary = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  registerNumber: string;
  department: string;
  degree: string;
  graduationYear: number | null;
  enrollmentStatus: string;
  completedCount: number;
  inProgressCount: number;
  totalAttempts: number;
  bestScoreSum: number;
  totalMarksSum: number;
  nextModuleLabel: string;
  lastActivityAt: string;
};

export function getAllStudentsWithProgress(): AdminStudentSummary[] {
  const db = getDatabase();
  const students = db.prepare(`
    SELECT * FROM users WHERE role = 'student' ORDER BY created_at DESC
  `).all() as unknown as DbUser[];

  return students.map((s) => {
    const progressList = getUserProgress(s.id);
    const completedCount = progressList.filter((p) => p.status === "completed").length;
    const inProgressCount = progressList.filter((p) => p.status === "in_progress").length;
    const totalAttempts = progressList.reduce((sum, p) => sum + p.attempts, 0);
    const bestScoreSum = progressList.reduce((sum, p) => sum + p.best_score, 0);
    const totalMarksSum = progressList.reduce((sum, p) => sum + p.total_marks, 0);

    const nextModuleNum = completedCount + 1;
    const nextModuleLabel = nextModuleNum <= 100
      ? `Module ${String(nextModuleNum).padStart(2, "0")}`
      : "Course Completed";

    const lastProg = progressList
      .filter((p) => p.completed_at || p.first_started_at)
      .sort((a, b) => (b.completed_at || b.first_started_at || "").localeCompare(a.completed_at || a.first_started_at || ""))[0];

    const lastActivityAt = lastProg?.completed_at || lastProg?.first_started_at || s.created_at;

    return {
      id: s.id,
      fullName: s.full_name,
      email: s.email,
      phone: s.phone || "—",
      college: s.college || "Engineering College",
      registerNumber: s.register_number || "REG-001",
      department: s.department || "Computer Science",
      degree: s.degree || "B.Tech",
      graduationYear: s.graduation_year,
      enrollmentStatus: s.enrollment_status,
      completedCount,
      inProgressCount,
      totalAttempts,
      bestScoreSum,
      totalMarksSum,
      nextModuleLabel,
      lastActivityAt,
    };
  });
}

export function getAdminMetrics() {
  const db = getDatabase();
  const userCount = (db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'student'").get() as { count: number }).count;
  const approvedCount = (db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'student' AND enrollment_status = 'approved'").get() as { count: number }).count;
  const activeLearners = (db.prepare("SELECT COUNT(DISTINCT user_id) as count FROM module_progress").get() as { count: number }).count;
  const totalCompleted = (db.prepare("SELECT COUNT(*) as count FROM module_progress WHERE status = 'completed'").get() as { count: number }).count;
  const attemptsCount = (db.prepare("SELECT COUNT(*) as count FROM assessment_attempts").get() as { count: number }).count;

  return {
    totalStudents: userCount,
    approvedStudents: approvedCount,
    activeLearners,
    totalModulesMastered: totalCompleted,
    totalAssessmentAttempts: attemptsCount,
  };
}

export function approveStudentEnrollment(studentId: string) {
  const db = getDatabase();
  db.prepare("UPDATE users SET enrollment_status = 'approved' WHERE id = ? AND role = 'student'").run(studentId);
}

export function getRegistrationMode(): "open" | "approval" | "invite_only" {
  const db = getDatabase();
  const row = db.prepare("SELECT registration_mode FROM course_settings WHERE id = 1").get() as { registration_mode: string } | undefined;
  if (row?.registration_mode === "approval" || row?.registration_mode === "invite_only") {
    return row.registration_mode;
  }
  return "open";
}

export function setRegistrationMode(mode: "open" | "approval" | "invite_only") {
  const db = getDatabase();
  db.prepare(`
    INSERT INTO course_settings (id, registration_mode, updated_at)
    VALUES (1, ?, ?)
    ON CONFLICT(id) DO UPDATE SET registration_mode = excluded.registration_mode, updated_at = excluded.updated_at
  `).run(mode, new Date().toISOString());
}

export function getAllCourseInvites(): Array<{ id: string; email: string; status: string; created_at: string }> {
  const db = getDatabase();
  const rows = db.prepare("SELECT id, email, status, created_at FROM course_invites ORDER BY created_at DESC LIMIT 100").all() as unknown as Array<{
    id: string;
    email: string;
    status: string;
    created_at: string;
  }>;
  return rows.map((r) => ({ ...r }));
}

export function isEmailInvited(email: string): boolean {
  const db = getDatabase();
  const row = db.prepare("SELECT id FROM course_invites WHERE email = ?").get(email.toLowerCase().trim()) as { id: string } | undefined;
  return Boolean(row);
}

export function markInviteAccepted(email: string) {
  const db = getDatabase();
  db.prepare("UPDATE course_invites SET status = 'accepted' WHERE email = ?").run(email.toLowerCase().trim());
}

export function assignStudentOrCreateInvite(email: string): { result: "assigned" | "invited"; message: string } {
  const db = getDatabase();
  const cleanEmail = email.toLowerCase().trim();
  const existing = getUserByEmail(cleanEmail);
  if (existing) {
    db.prepare("UPDATE users SET enrollment_status = 'approved' WHERE id = ?").run(existing.id);
    db.prepare(`
      INSERT INTO course_invites (id, email, status, created_at)
      VALUES (?, ?, 'accepted', ?)
      ON CONFLICT(email) DO UPDATE SET status = 'accepted'
    `).run(`inv-${crypto.randomUUID()}`, cleanEmail, new Date().toISOString());
    return { result: "assigned", message: `Course access immediately approved for existing student ${cleanEmail}.` };
  }

  db.prepare(`
    INSERT INTO course_invites (id, email, status, created_at)
    VALUES (?, ?, 'pending', ?)
    ON CONFLICT(email) DO NOTHING
  `).run(`inv-${crypto.randomUUID()}`, cleanEmail, new Date().toISOString());

  return { result: "invited", message: `Invitation created for ${cleanEmail}. They can now register with immediate access.` };
}

export function recordDsaSubmission(sub: Omit<DbDsaSubmission, "id" | "created_at">): DbDsaSubmission {
  const db = getDatabase();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO dsa_submissions (id, user_id, problem_id, language, code, status, test_cases_passed, total_test_cases, execution_time_ms, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    sub.user_id,
    sub.problem_id,
    sub.language,
    sub.code,
    sub.status,
    sub.test_cases_passed,
    sub.total_test_cases,
    sub.execution_time_ms,
    now,
  );
  return { id, created_at: now, ...sub };
}

export function getUserDsaSubmissions(userId: string, problemId?: string): DbDsaSubmission[] {
  const db = getDatabase();
  if (problemId) {
    return db
      .prepare(
        "SELECT * FROM dsa_submissions WHERE user_id = ? AND problem_id = ? ORDER BY created_at DESC LIMIT 20",
      )
      .all(userId, problemId) as unknown as DbDsaSubmission[];
  }
  return db
    .prepare("SELECT * FROM dsa_submissions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50")
    .all(userId) as unknown as DbDsaSubmission[];
}

export function getUserSolvedDsaProblemIds(userId: string): Set<string> {
  const db = getDatabase();
  const rows = db
    .prepare("SELECT DISTINCT problem_id FROM dsa_submissions WHERE user_id = ? AND status = 'ACCEPTED'")
    .all(userId) as unknown as { problem_id: string }[];
  return new Set(rows.map((r) => r.problem_id));
}

export function getDatabaseHealth() {
  const db = getDatabase();
  const integrity = db.prepare("PRAGMA integrity_check;").get() as { integrity_check?: string } | undefined;
  const userCount = (db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number }).count;
  const sessionCount = (db.prepare("SELECT COUNT(*) as count FROM sessions").get() as { count: number }).count;
  const progressCount = (db.prepare("SELECT COUNT(*) as count FROM module_progress").get() as { count: number }).count;
  const attemptCount = (db.prepare("SELECT COUNT(*) as count FROM assessment_attempts").get() as { count: number }).count;
  const submissionCount = (db.prepare("SELECT COUNT(*) as count FROM practice_submissions").get() as { count: number }).count;
  const dsaCount = (db.prepare("SELECT COUNT(*) as count FROM dsa_submissions").get() as { count: number }).count;
  const feedbackCount = (db.prepare("SELECT COUNT(*) as count FROM module_feedback").get() as { count: number }).count;

  return {
    status: integrity?.integrity_check === "ok" ? "healthy" : "degraded",
    integrityCheck: integrity?.integrity_check || "unknown",
    counts: {
      users: userCount,
      activeSessions: sessionCount,
      moduleProgressRecords: progressCount,
      assessmentAttempts: attemptCount,
      practiceSubmissions: submissionCount,
      dsaSubmissions: dsaCount,
      moduleFeedback: feedbackCount,
    },
  };
}

/* -------------------------------------------------------------
   MODULE FEEDBACK & PLATFORM UPGRADE ANALYTICS APIS
------------------------------------------------------------- */

export function upsertModuleFeedback(data: {
  userId: string;
  moduleNumber: number;
  stageId?: number;
  helpfulnessRating: number;
  difficultyLevel: "too_easy" | "just_right" | "too_hard";
  easeOfUseRating: number;
  feedbackText: string;
}): DbModuleFeedback {
  const db = getDatabase();
  const now = new Date().toISOString();
  const id = `fb-${data.moduleNumber}-${crypto.randomBytes(6).toString("hex")}`;
  const stageId = data.stageId || Math.ceil(data.moduleNumber / 10);

  // Clamping ratings 1-5
  const helpfulness = Math.max(1, Math.min(5, Math.round(data.helpfulnessRating)));
  const easeOfUse = Math.max(1, Math.min(5, Math.round(data.easeOfUseRating)));
  const difficulty = ["too_easy", "just_right", "too_hard"].includes(data.difficultyLevel)
    ? data.difficultyLevel
    : "just_right";
  const text = (data.feedbackText || "").trim();

  db.prepare(`
    INSERT INTO module_feedback (
      id, user_id, module_number, stage_id, helpfulness_rating, difficulty_level, ease_of_use_rating, feedback_text, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id, module_number) DO UPDATE SET
      stage_id = excluded.stage_id,
      helpfulness_rating = excluded.helpfulness_rating,
      difficulty_level = excluded.difficulty_level,
      ease_of_use_rating = excluded.ease_of_use_rating,
      feedback_text = excluded.feedback_text,
      updated_at = excluded.updated_at
  `).run(
    id,
    data.userId,
    data.moduleNumber,
    stageId,
    helpfulness,
    difficulty,
    easeOfUse,
    text,
    now,
    now,
  );

  const saved = db.prepare(`
    SELECT * FROM module_feedback WHERE user_id = ? AND module_number = ?
  `).get(data.userId, data.moduleNumber) as unknown as DbModuleFeedback;

  return saved;
}

export function getModuleFeedbackForUser(userId: string, moduleNumber: number): DbModuleFeedback | null {
  const db = getDatabase();
  const row = db.prepare(`
    SELECT * FROM module_feedback WHERE user_id = ? AND module_number = ?
  `).get(userId, moduleNumber) as unknown as DbModuleFeedback | undefined;
  return row || null;
}

export function getAllModuleFeedback(options?: {
  moduleNumber?: number;
  limit?: number;
  offset?: number;
}): DbModuleFeedbackWithUser[] {
  const db = getDatabase();
  const limit = options?.limit ?? 100;
  const offset = options?.offset ?? 0;

  if (options?.moduleNumber !== undefined && options.moduleNumber > 0) {
    const rows = db.prepare(`
      SELECT f.*, u.full_name as user_name, u.email as user_email, u.college as user_college, u.register_number as user_register_number
      FROM module_feedback f
      JOIN users u ON f.user_id = u.id
      WHERE f.module_number = ?
      ORDER BY f.updated_at DESC
      LIMIT ? OFFSET ?
    `).all(options.moduleNumber, limit, offset) as unknown as DbModuleFeedbackWithUser[];
    return rows.map((r) => ({ ...r }));
  }

  const rows = db.prepare(`
    SELECT f.*, u.full_name as user_name, u.email as user_email, u.college as user_college, u.register_number as user_register_number
    FROM module_feedback f
    JOIN users u ON f.user_id = u.id
    ORDER BY f.updated_at DESC
    LIMIT ? OFFSET ?
  `).all(limit, offset) as unknown as DbModuleFeedbackWithUser[];
  return rows.map((r) => ({ ...r }));
}

export type ModuleFeedbackMetrics = {
  totalCount: number;
  distinctModulesCount: number;
  avgHelpfulness: number;
  avgEaseOfUse: number;
  difficultyBreakdown: {
    tooEasy: number;
    justRight: number;
    tooHard: number;
    total: number;
  };
  moduleSummaries: Record<
    number,
    {
      count: number;
      avgHelpfulness: number;
      avgEaseOfUse: number;
      difficulty: { tooEasy: number; justRight: number; tooHard: number };
    }
  >;
  flaggedModules: Array<{
    moduleNumber: number;
    count: number;
    avgHelpfulness: number;
    avgEaseOfUse: number;
    topDifficulty: string;
    sampleFeedback: string[];
    reason: string;
  }>;
};

export function getModuleFeedbackMetrics(): ModuleFeedbackMetrics {
  const db = getDatabase();

  const totalRow = db.prepare(`
    SELECT 
      COUNT(*) as count,
      COUNT(DISTINCT module_number) as distinct_modules,
      AVG(helpfulness_rating) as avg_helpfulness,
      AVG(ease_of_use_rating) as avg_ease_of_use
    FROM module_feedback
  `).get() as { count: number; distinct_modules: number; avg_helpfulness: number | null; avg_ease_of_use: number | null };

  const diffRows = db.prepare(`
    SELECT difficulty_level, COUNT(*) as count
    FROM module_feedback
    GROUP BY difficulty_level
  `).all() as { difficulty_level: string; count: number }[];

  let tooEasy = 0;
  let justRight = 0;
  let tooHard = 0;
  for (const r of diffRows) {
    if (r.difficulty_level === "too_easy") tooEasy = r.count;
    else if (r.difficulty_level === "too_hard") tooHard = r.count;
    else justRight = r.count;
  }

  // Per-module aggregations
  const perModuleRows = db.prepare(`
    SELECT 
      module_number,
      COUNT(*) as count,
      AVG(helpfulness_rating) as avg_helpfulness,
      AVG(ease_of_use_rating) as avg_ease_of_use
    FROM module_feedback
    GROUP BY module_number
    ORDER BY module_number ASC
  `).all() as { module_number: number; count: number; avg_helpfulness: number; avg_ease_of_use: number }[];

  const moduleSummaries: ModuleFeedbackMetrics["moduleSummaries"] = {};
  for (const row of perModuleRows) {
    const mDiff = db.prepare(`
      SELECT difficulty_level, COUNT(*) as count
      FROM module_feedback
      WHERE module_number = ?
      GROUP BY difficulty_level
    `).all(row.module_number) as { difficulty_level: string; count: number }[];

    let mEasy = 0;
    let mRight = 0;
    let mHard = 0;
    for (const d of mDiff) {
      if (d.difficulty_level === "too_easy") mEasy = d.count;
      else if (d.difficulty_level === "too_hard") mHard = d.count;
      else mRight = d.count;
    }

    moduleSummaries[row.module_number] = {
      count: row.count,
      avgHelpfulness: Number((row.avg_helpfulness || 0).toFixed(1)),
      avgEaseOfUse: Number((row.avg_ease_of_use || 0).toFixed(1)),
      difficulty: { tooEasy: mEasy, justRight: mRight, tooHard: mHard },
    };
  }

  // Flagged modules for platform upgrades:
  // e.g. avgHelpfulness < 4.0 OR tooHard >= 30% OR tooEasy >= 30%
  const flaggedModules: ModuleFeedbackMetrics["flaggedModules"] = [];
  for (const [modStr, sum] of Object.entries(moduleSummaries)) {
    const modNum = Number(modStr);
    const reasons: string[] = [];

    if (sum.avgHelpfulness < 4.0) {
      reasons.push(`Helpfulness rating (${sum.avgHelpfulness}/5.0) is below target threshold 4.0`);
    }
    const hardPct = sum.count > 0 ? (sum.difficulty.tooHard / sum.count) * 100 : 0;
    if (hardPct >= 30) {
      reasons.push(`${Math.round(hardPct)}% of learners reported content is Too Hard / steep learning curve`);
    }
    const easyPct = sum.count > 0 ? (sum.difficulty.tooEasy / sum.count) * 100 : 0;
    if (easyPct >= 30) {
      reasons.push(`${Math.round(easyPct)}% of learners reported content is Too Easy / needs more rigor`);
    }

    if (reasons.length > 0) {
      const sampleTexts = db.prepare(`
        SELECT feedback_text FROM module_feedback 
        WHERE module_number = ? AND feedback_text != ''
        ORDER BY updated_at DESC LIMIT 3
      `).all(modNum) as { feedback_text: string }[];

      flaggedModules.push({
        moduleNumber: modNum,
        count: sum.count,
        avgHelpfulness: sum.avgHelpfulness,
        avgEaseOfUse: sum.avgEaseOfUse,
        topDifficulty: hardPct >= easyPct && hardPct > 0 ? "Too Hard" : easyPct > 0 ? "Too Easy" : "Optimal",
        sampleFeedback: sampleTexts.map((t) => t.feedback_text),
        reason: reasons.join("; "),
      });
    }
  }

  return {
    totalCount: totalRow?.count || 0,
    distinctModulesCount: totalRow?.distinct_modules || 0,
    avgHelpfulness: Number((totalRow?.avg_helpfulness || 0).toFixed(1)),
    avgEaseOfUse: Number((totalRow?.avg_ease_of_use || 0).toFixed(1)),
    difficultyBreakdown: {
      tooEasy,
      justRight,
      tooHard,
      total: totalRow?.count || 0,
    },
    moduleSummaries,
    flaggedModules,
  };
}

/* -------------------------------------------------------------
   COMMUNICATION LSRW PRACTICE & ASSESSMENT PERSISTENCE
------------------------------------------------------------- */

export type DbCommunicationSubmission = {
  id: string;
  user_id: string;
  mode: "practice" | "assessment";
  skill: string;
  exercise_id: string;
  overall_score: number;
  percent_score: number;
  cefr_level: string;
  sentence_mastery: number;
  vocabulary_score: number;
  fluency_score: number;
  delivery_score: number;
  passed: number;
  response_summary: string;
  feedback_json: string;
  created_at: string;
};

export function recordCommunicationSubmission(data: {
  userId: string;
  mode: "practice" | "assessment";
  skill: string;
  exerciseId: string;
  overallScore: number;
  percentScore: number;
  cefrLevel: string;
  sentenceMastery: number;
  vocabularyScore: number;
  fluencyScore: number;
  deliveryScore: number;
  passed: boolean;
  responseSummary?: string;
  feedbackJson?: string;
}): DbCommunicationSubmission {
  const db = getDatabase();
  const id = `comm-${crypto.randomBytes(6).toString("hex")}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO communication_submissions (
      id, user_id, mode, skill, exercise_id, overall_score, percent_score, cefr_level,
      sentence_mastery, vocabulary_score, fluency_score, delivery_score, passed,
      response_summary, feedback_json, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.userId,
    data.mode,
    data.skill,
    data.exerciseId,
    data.overallScore,
    data.percentScore,
    data.cefrLevel,
    data.sentenceMastery,
    data.vocabularyScore,
    data.fluencyScore,
    data.deliveryScore,
    data.passed ? 1 : 0,
    (data.responseSummary || "").slice(0, 500),
    data.feedbackJson || "{}",
    now,
  );

  return db
    .prepare("SELECT * FROM communication_submissions WHERE id = ?")
    .get(id) as unknown as DbCommunicationSubmission;
}

export function getUserCommunicationSubmissions(userId: string): DbCommunicationSubmission[] {
  const db = getDatabase();
  return db
    .prepare(
      "SELECT * FROM communication_submissions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
    )
    .all(userId) as unknown as DbCommunicationSubmission[];
}

export function getUserCompletedCommunicationExerciseIds(userId: string): Set<string> {
  const db = getDatabase();
  const rows = db
    .prepare(
      "SELECT DISTINCT exercise_id FROM communication_submissions WHERE user_id = ? AND passed = 1",
    )
    .all(userId) as unknown as { exercise_id: string }[];
  return new Set(rows.map((r) => r.exercise_id));
}

/* -------------------------------------------------------------
   GALGOTIAS UNIVERSITY CAREER PROFILES, CODING HANDLES & T&P CELL
------------------------------------------------------------- */

function parseJsonArray<T>(raw: unknown, fallback: T[]): T[] {
  if (typeof raw !== "string" || !raw.trim()) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

export function buildEmptyCareerProfile(user: DbUser): DbStudentCareerProfile {
  return {
    user_id: user.id,
    admission_no: user.register_number || "",
    enrollment_no: "",
    school: "School of Computing Science & Engineering",
    branch: user.department || user.degree || "B.Tech CSE",
    semester: 6,
    section: "A",
    batch_year: user.graduation_year || 2026,
    cgpa: 0,
    tenth_pct: 0,
    twelfth_pct: 0,
    active_backlogs: 0,
    placement_eligible: true,
    headline: "",
    career_summary: "",
    skills: [],
    certifications: [],
    achievements: [],
    projects: [],
    experiences: [],
    codolio_handle: "",
    codolio_url: "",
    codolio_total_solved: 0,
    leetcode_handle: "",
    leetcode_solved: 0,
    leetcode_rating: 0,
    codechef_handle: "",
    codechef_rating: 0,
    codeforces_handle: "",
    codeforces_rating: 0,
    gfg_handle: "",
    gfg_solved: 0,
    hackerrank_handle: "",
    github_handle: "",
    github_repos: 0,
    linkedin_url: "",
    portfolio_url: "",
    resume_url: "",
    updated_at: user.created_at,
  };
}

function hydrateCareerRow(row: Record<string, unknown>, user: DbUser): DbStudentCareerProfile {
  const empty = buildEmptyCareerProfile(user);
  return {
    user_id: user.id,
    admission_no: String(row.admission_no || empty.admission_no),
    enrollment_no: String(row.enrollment_no || ""),
    school: String(row.school || empty.school),
    branch: String(row.branch || empty.branch),
    semester: Number(row.semester || 6),
    section: String(row.section || "A"),
    batch_year: Number(row.batch_year || empty.batch_year),
    cgpa: Number(row.cgpa || 0),
    tenth_pct: Number(row.tenth_pct || 0),
    twelfth_pct: Number(row.twelfth_pct || 0),
    active_backlogs: Number(row.active_backlogs || 0),
    placement_eligible: Boolean(Number(row.placement_eligible ?? 1)),
    headline: String(row.headline || ""),
    career_summary: String(row.career_summary || ""),
    skills: parseJsonArray<string>(row.skills_json, []),
    certifications: parseJsonArray<string>(row.certifications_json, []),
    achievements: parseJsonArray<string>(row.achievements_json, []),
    projects: parseJsonArray<StudentProjectItem>(row.projects_json, []),
    experiences: parseJsonArray<StudentExperienceItem>(row.experiences_json, []),
    codolio_handle: String(row.codolio_handle || ""),
    codolio_url: String(row.codolio_url || ""),
    codolio_total_solved: Number(row.codolio_total_solved || 0),
    leetcode_handle: String(row.leetcode_handle || ""),
    leetcode_solved: Number(row.leetcode_solved || 0),
    leetcode_rating: Number(row.leetcode_rating || 0),
    codechef_handle: String(row.codechef_handle || ""),
    codechef_rating: Number(row.codechef_rating || 0),
    codeforces_handle: String(row.codeforces_handle || ""),
    codeforces_rating: Number(row.codeforces_rating || 0),
    gfg_handle: String(row.gfg_handle || ""),
    gfg_solved: Number(row.gfg_solved || 0),
    hackerrank_handle: String(row.hackerrank_handle || ""),
    github_handle: String(row.github_handle || ""),
    github_repos: Number(row.github_repos || 0),
    linkedin_url: String(row.linkedin_url || ""),
    portfolio_url: String(row.portfolio_url || ""),
    resume_url: String(row.resume_url || ""),
    updated_at: String(row.updated_at || empty.updated_at),
  };
}

export function getStudentCareerProfile(userId: string): DbStudentCareerProfile | null {
  const db = getDatabase();
  const user = getUserById(userId);
  if (!user) return null;

  const row = db
    .prepare("SELECT * FROM student_career_profiles WHERE user_id = ?")
    .get(userId) as unknown as Record<string, unknown> | undefined;

  return row ? hydrateCareerRow(row, user) : buildEmptyCareerProfile(user);
}

export function upsertStudentCareerProfile(
  userId: string,
  payload: Partial<Omit<DbStudentCareerProfile, "user_id" | "updated_at">>,
): DbStudentCareerProfile | null {
  const db = getDatabase();
  const user = getUserById(userId);
  if (!user) return null;

  const prev = getStudentCareerProfile(userId) || buildEmptyCareerProfile(user);
  const now = new Date().toISOString();

  const clampNum = (val: unknown, fallback: number, min: number, max: number) => {
    const n = Number(val);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(min, Math.min(max, n));
  };

  const cleanList = (arr: unknown, maxLen: number): string[] =>
    Array.isArray(arr)
      ? Array.from(new Set(arr.map((x) => String(x || "").trim()).filter(Boolean))).slice(0, maxLen)
      : [];

  const cleanProjects: StudentProjectItem[] = Array.isArray(payload.projects)
    ? payload.projects
        .slice(0, 12)
        .map((p, idx) => ({
          id: String(p?.id || `proj-${idx + 1}`).slice(0, 48),
          title: String(p?.title || "").trim().slice(0, 120),
          techStack: cleanList(p?.techStack, 12),
          summary: String(p?.summary || "").trim().slice(0, 600),
          impactMetric: String(p?.impactMetric || "").trim().slice(0, 160),
          repoUrl: sanitizeExternalUrl(p?.repoUrl),
          liveUrl: sanitizeExternalUrl(p?.liveUrl),
        }))
        .filter((p) => p.title.length > 0)
    : prev.projects;

  const cleanExperiences: StudentExperienceItem[] = Array.isArray(payload.experiences)
    ? payload.experiences
        .slice(0, 10)
        .map((ex, idx) => ({
          id: String(ex?.id || `exp-${idx + 1}`).slice(0, 48),
          company: String(ex?.company || "").trim().slice(0, 120),
          role: String(ex?.role || "").trim().slice(0, 120),
          duration: String(ex?.duration || "").trim().slice(0, 80),
          highlights: String(ex?.highlights || "").trim().slice(0, 600),
        }))
        .filter((ex) => ex.company.length > 0 && ex.role.length > 0)
    : prev.experiences;

  const next: DbStudentCareerProfile = {
    user_id: userId,
    admission_no: String(payload.admission_no ?? prev.admission_no).trim().slice(0, 40),
    enrollment_no: String(payload.enrollment_no ?? prev.enrollment_no).trim().slice(0, 40),
    school: String(payload.school ?? prev.school).trim().slice(0, 120),
    branch: String(payload.branch ?? prev.branch).trim().slice(0, 100),
    semester: Math.round(clampNum(payload.semester, prev.semester, 1, 10)),
    section: String(payload.section ?? prev.section).trim().slice(0, 20),
    batch_year: Math.round(clampNum(payload.batch_year, prev.batch_year, 2020, 2032)),
    cgpa: Number(clampNum(payload.cgpa, prev.cgpa, 0, 10).toFixed(2)),
    tenth_pct: Number(clampNum(payload.tenth_pct, prev.tenth_pct, 0, 100).toFixed(2)),
    twelfth_pct: Number(clampNum(payload.twelfth_pct, prev.twelfth_pct, 0, 100).toFixed(2)),
    active_backlogs: Math.round(clampNum(payload.active_backlogs, prev.active_backlogs, 0, 25)),
    placement_eligible:
      typeof payload.placement_eligible === "boolean"
        ? payload.placement_eligible
        : prev.placement_eligible,
    headline: String(payload.headline ?? prev.headline).trim().slice(0, 180),
    career_summary: String(payload.career_summary ?? prev.career_summary).trim().slice(0, 1000),
    skills: payload.skills !== undefined ? cleanList(payload.skills, 40) : prev.skills,
    certifications:
      payload.certifications !== undefined
        ? cleanList(payload.certifications, 25)
        : prev.certifications,
    achievements:
      payload.achievements !== undefined
        ? cleanList(payload.achievements, 25)
        : prev.achievements,
    projects: cleanProjects,
    experiences: cleanExperiences,
    codolio_handle: String(payload.codolio_handle ?? prev.codolio_handle).trim().slice(0, 80),
    codolio_url:
      payload.codolio_url !== undefined ? sanitizeExternalUrl(payload.codolio_url) : prev.codolio_url,
    codolio_total_solved: Math.round(
      clampNum(payload.codolio_total_solved, prev.codolio_total_solved, 0, 10000),
    ),
    leetcode_handle: String(payload.leetcode_handle ?? prev.leetcode_handle).trim().slice(0, 80),
    leetcode_solved: Math.round(clampNum(payload.leetcode_solved, prev.leetcode_solved, 0, 5000)),
    leetcode_rating: Math.round(clampNum(payload.leetcode_rating, prev.leetcode_rating, 0, 4500)),
    codechef_handle: String(payload.codechef_handle ?? prev.codechef_handle).trim().slice(0, 80),
    codechef_rating: Math.round(clampNum(payload.codechef_rating, prev.codechef_rating, 0, 4500)),
    codeforces_handle: String(payload.codeforces_handle ?? prev.codeforces_handle)
      .trim()
      .slice(0, 80),
    codeforces_rating: Math.round(
      clampNum(payload.codeforces_rating, prev.codeforces_rating, 0, 4500),
    ),
    gfg_handle: String(payload.gfg_handle ?? prev.gfg_handle).trim().slice(0, 80),
    gfg_solved: Math.round(clampNum(payload.gfg_solved, prev.gfg_solved, 0, 5000)),
    hackerrank_handle: String(payload.hackerrank_handle ?? prev.hackerrank_handle)
      .trim()
      .slice(0, 80),
    github_handle: String(payload.github_handle ?? prev.github_handle).trim().slice(0, 80),
    github_repos: Math.round(clampNum(payload.github_repos, prev.github_repos, 0, 1000)),
    linkedin_url:
      payload.linkedin_url !== undefined ? sanitizeExternalUrl(payload.linkedin_url) : prev.linkedin_url,
    portfolio_url:
      payload.portfolio_url !== undefined
        ? sanitizeExternalUrl(payload.portfolio_url)
        : prev.portfolio_url,
    resume_url:
      payload.resume_url !== undefined ? sanitizeExternalUrl(payload.resume_url) : prev.resume_url,
    updated_at: now,
  };

  db.prepare(`
    INSERT INTO student_career_profiles (
      user_id, admission_no, enrollment_no, school, branch, semester, section, batch_year,
      cgpa, tenth_pct, twelfth_pct, active_backlogs, placement_eligible,
      headline, career_summary, skills_json, certifications_json, achievements_json,
      projects_json, experiences_json,
      codolio_handle, codolio_url, codolio_total_solved,
      leetcode_handle, leetcode_solved, leetcode_rating,
      codechef_handle, codechef_rating, codeforces_handle, codeforces_rating,
      gfg_handle, gfg_solved, hackerrank_handle, github_handle, github_repos,
      linkedin_url, portfolio_url, resume_url, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      admission_no = excluded.admission_no,
      enrollment_no = excluded.enrollment_no,
      school = excluded.school,
      branch = excluded.branch,
      semester = excluded.semester,
      section = excluded.section,
      batch_year = excluded.batch_year,
      cgpa = excluded.cgpa,
      tenth_pct = excluded.tenth_pct,
      twelfth_pct = excluded.twelfth_pct,
      active_backlogs = excluded.active_backlogs,
      placement_eligible = excluded.placement_eligible,
      headline = excluded.headline,
      career_summary = excluded.career_summary,
      skills_json = excluded.skills_json,
      certifications_json = excluded.certifications_json,
      achievements_json = excluded.achievements_json,
      projects_json = excluded.projects_json,
      experiences_json = excluded.experiences_json,
      codolio_handle = excluded.codolio_handle,
      codolio_url = excluded.codolio_url,
      codolio_total_solved = excluded.codolio_total_solved,
      leetcode_handle = excluded.leetcode_handle,
      leetcode_solved = excluded.leetcode_solved,
      leetcode_rating = excluded.leetcode_rating,
      codechef_handle = excluded.codechef_handle,
      codechef_rating = excluded.codechef_rating,
      codeforces_handle = excluded.codeforces_handle,
      codeforces_rating = excluded.codeforces_rating,
      gfg_handle = excluded.gfg_handle,
      gfg_solved = excluded.gfg_solved,
      hackerrank_handle = excluded.hackerrank_handle,
      github_handle = excluded.github_handle,
      github_repos = excluded.github_repos,
      linkedin_url = excluded.linkedin_url,
      portfolio_url = excluded.portfolio_url,
      resume_url = excluded.resume_url,
      updated_at = excluded.updated_at
  `).run(
    next.user_id,
    next.admission_no,
    next.enrollment_no,
    next.school,
    next.branch,
    next.semester,
    next.section,
    next.batch_year,
    next.cgpa,
    next.tenth_pct,
    next.twelfth_pct,
    next.active_backlogs,
    next.placement_eligible ? 1 : 0,
    next.headline,
    next.career_summary,
    JSON.stringify(next.skills),
    JSON.stringify(next.certifications),
    JSON.stringify(next.achievements),
    JSON.stringify(next.projects),
    JSON.stringify(next.experiences),
    next.codolio_handle,
    next.codolio_url,
    next.codolio_total_solved,
    next.leetcode_handle,
    next.leetcode_solved,
    next.leetcode_rating,
    next.codechef_handle,
    next.codechef_rating,
    next.codeforces_handle,
    next.codeforces_rating,
    next.gfg_handle,
    next.gfg_solved,
    next.hackerrank_handle,
    next.github_handle,
    next.github_repos,
    next.linkedin_url,
    next.portfolio_url,
    next.resume_url,
    next.updated_at,
  );

  // Sync branch & reg number onto base user row cleanly
  db.prepare(
    "UPDATE users SET register_number = ?, department = ?, degree = ?, graduation_year = ? WHERE id = ?",
  ).run(
    next.admission_no || user.register_number,
    next.branch,
    next.branch,
    next.batch_year,
    userId,
  );

  return next;
}

export function getAllStudentsCareerSnapshots(): StudentCareerSnapshot[] {
  const db = getDatabase();
  const students = db
    .prepare("SELECT * FROM users WHERE role = 'student' ORDER BY created_at DESC")
    .all() as unknown as DbUser[];
  const careerRows = db
    .prepare("SELECT * FROM student_career_profiles")
    .all() as unknown as Array<Record<string, unknown>>;
  const progressRows = db
    .prepare("SELECT user_id, COUNT(*) as cnt FROM module_progress WHERE status = 'completed' GROUP BY user_id")
    .all() as unknown as Array<{ user_id: string; cnt: number }>;
  const dsaRows = db
    .prepare("SELECT user_id, COUNT(DISTINCT problem_id) as cnt FROM dsa_submissions WHERE status = 'ACCEPTED' GROUP BY user_id")
    .all() as unknown as Array<{ user_id: string; cnt: number }>;
  const commRows = db
    .prepare(
      "SELECT user_id, MAX(overall_score) as best_score, cefr_level FROM communication_submissions GROUP BY user_id",
    )
    .all() as unknown as Array<{ user_id: string; best_score: number; cefr_level: string }>;

  const careerMap = new Map(careerRows.map((r) => [String(r.user_id), r]));
  const modMap = new Map(progressRows.map((r) => [r.user_id, Number(r.cnt || 0)]));
  const dsaMap = new Map(dsaRows.map((r) => [r.user_id, Number(r.cnt || 0)]));
  const commMap = new Map(commRows.map((r) => [r.user_id, r]));

  return students.map((stu) => {
    const rawCareer = careerMap.get(stu.id);
    const comm = commMap.get(stu.id);
    return {
      user: { ...stu },
      career: rawCareer ? hydrateCareerRow(rawCareer, stu) : buildEmptyCareerProfile(stu),
      platformStats: {
        modulesCompleted: modMap.get(stu.id) || 0,
        dsaSolvedCount: dsaMap.get(stu.id) || 0,
        bestVersantScore: comm ? Number(comm.best_score) : null,
        latestCefr: comm ? comm.cefr_level : null,
      },
    };
  });
}

export function createPlacementDrive(data: {
  companyName: string;
  roleTitle: string;
  ctcPackage: string;
  jdText: string;
  minCgpa: number;
  maxBacklogs: number;
  allowedBranches: string[];
  requiredSkills: string[];
  minCodingSolved: number;
  minLsrwScore: number;
  shortlistedUserIds: string[];
  createdBy: string;
}): DbPlacementDrive {
  const db = getDatabase();
  const id = `drive-${crypto.randomBytes(6).toString("hex")}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO placement_drives (
      id, company_name, role_title, ctc_package, jd_text, min_cgpa, max_backlogs,
      allowed_branches_json, required_skills_json, min_coding_solved, min_lsrw_score,
      shortlisted_user_ids_json, created_by, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.companyName.trim().slice(0, 120),
    data.roleTitle.trim().slice(0, 120),
    data.ctcPackage.trim().slice(0, 60),
    data.jdText.trim().slice(0, 8000),
    Number(data.minCgpa || 0),
    Math.round(Number(data.maxBacklogs || 0)),
    JSON.stringify(data.allowedBranches),
    JSON.stringify(data.requiredSkills),
    Math.round(Number(data.minCodingSolved || 0)),
    Math.round(Number(data.minLsrwScore || 0)),
    JSON.stringify(data.shortlistedUserIds),
    data.createdBy,
    now,
  );

  return {
    id,
    company_name: data.companyName.trim().slice(0, 120),
    role_title: data.roleTitle.trim().slice(0, 120),
    ctc_package: data.ctcPackage.trim().slice(0, 60),
    jd_text: data.jdText.trim().slice(0, 8000),
    min_cgpa: Number(data.minCgpa || 0),
    max_backlogs: Math.round(Number(data.maxBacklogs || 0)),
    allowed_branches: data.allowedBranches,
    required_skills: data.requiredSkills,
    min_coding_solved: Math.round(Number(data.minCodingSolved || 0)),
    min_lsrw_score: Math.round(Number(data.minLsrwScore || 0)),
    shortlisted_user_ids: data.shortlistedUserIds,
    created_by: data.createdBy,
    created_at: now,
  };
}

export function getAllPlacementDrives(): DbPlacementDrive[] {
  const db = getDatabase();
  const rows = db
    .prepare("SELECT * FROM placement_drives ORDER BY created_at DESC LIMIT 50")
    .all() as unknown as Array<Record<string, unknown>>;

  return rows.map((r) => ({
    id: String(r.id),
    company_name: String(r.company_name),
    role_title: String(r.role_title),
    ctc_package: String(r.ctc_package || ""),
    jd_text: String(r.jd_text),
    min_cgpa: Number(r.min_cgpa || 0),
    max_backlogs: Number(r.max_backlogs || 0),
    allowed_branches: parseJsonArray<string>(r.allowed_branches_json, []),
    required_skills: parseJsonArray<string>(r.required_skills_json, []),
    min_coding_solved: Number(r.min_coding_solved || 0),
    min_lsrw_score: Number(r.min_lsrw_score || 0),
    shortlisted_user_ids: parseJsonArray<string>(r.shortlisted_user_ids_json, []),
    created_by: String(r.created_by || ""),
    created_at: String(r.created_at),
  }));
}
