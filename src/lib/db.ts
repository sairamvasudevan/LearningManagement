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
  `);

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
  const role = data.role || (email.includes("admin") ? "admin" : "student");

  let pHash = "";
  let pSalt = "";
  if (data.password) {
    const { hash, salt } = hashPassword(data.password);
    pHash = hash;
    pSalt = salt;
  }

  db.prepare(`
    INSERT INTO users (id, email, role, full_name, phone, college, register_number, department, degree, graduation_year, enrollment_status, password_hash, password_salt, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', ?, ?, ?)
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
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

  db.prepare(`
    INSERT INTO sessions (token, user_id, created_at, expires_at)
    VALUES (?, ?, ?, ?)
  `).run(token, userId, now.toISOString(), expiresAt);

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
  db.prepare("UPDATE users SET enrollment_status = 'approved' WHERE id = ?").run(studentId);
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
