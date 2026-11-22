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
  `);

  // Pre-seed default Admin if not exists
  const existingAdmin = db.prepare("SELECT id FROM users WHERE email = ?").get("admin@learninghub.edu");
  if (!existingAdmin) {
    db.prepare(`
      INSERT INTO users (id, email, role, full_name, phone, college, register_number, department, degree, graduation_year, enrollment_status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      new Date().toISOString(),
    );
  }

  // Pre-seed default Demo Student if not exists
  const existingStudent = db.prepare("SELECT id FROM users WHERE email = ?").get("student@learninghub.edu");
  if (!existingStudent) {
    db.prepare(`
      INSERT INTO users (id, email, role, full_name, phone, college, register_number, department, degree, graduation_year, enrollment_status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      new Date().toISOString(),
    );
  }

  dbInstance = db;
  return db;
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
}): DbUser {
  const db = getDatabase();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const email = data.email.toLowerCase().trim();
  const role = data.role || (email.includes("admin") ? "admin" : "student");

  db.prepare(`
    INSERT INTO users (id, email, role, full_name, phone, college, register_number, department, degree, graduation_year, enrollment_status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', ?)
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
    now,
  );

  return getUserById(id)!;
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

export function getDatabaseHealth() {
  const db = getDatabase();
  const integrity = db.prepare("PRAGMA integrity_check;").get() as { integrity_check?: string } | undefined;
  const userCount = (db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number }).count;
  const sessionCount = (db.prepare("SELECT COUNT(*) as count FROM sessions").get() as { count: number }).count;
  const progressCount = (db.prepare("SELECT COUNT(*) as count FROM module_progress").get() as { count: number }).count;
  const attemptCount = (db.prepare("SELECT COUNT(*) as count FROM assessment_attempts").get() as { count: number }).count;
  const submissionCount = (db.prepare("SELECT COUNT(*) as count FROM practice_submissions").get() as { count: number }).count;

  return {
    status: integrity?.integrity_check === "ok" ? "healthy" : "degraded",
    integrityCheck: integrity?.integrity_check || "unknown",
    counts: {
      users: userCount,
      activeSessions: sessionCount,
      moduleProgressRecords: progressCount,
      assessmentAttempts: attemptCount,
      practiceSubmissions: submissionCount,
    },
  };
}
