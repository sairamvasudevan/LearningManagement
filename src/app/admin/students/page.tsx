import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  AdminStudentsTable,
  type AdminStudentSummary,
} from "@/components/admin-students-table";
import catalog from "@/lib/course-catalog.json";

export const dynamic = "force-dynamic";

type StudentProfile = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  college: string;
  register_number: string;
  department: string;
  degree: string;
  graduation_year: number | null;
  created_at: string;
};
type EnrollmentRow = { student_id: string; status: string; access_source: string };
type ProgressRow = {
  student_id: string;
  module_number: number;
  status: string;
  best_score: number;
  total_marks: number;
  attempts: number;
  updated_at: string;
};

const DEV_MOCK_STUDENTS: AdminStudentSummary[] = [
  {
    id: "00000000-0000-4000-a000-000000000001",
    fullName: "Aditya Sharma",
    email: "aditya.sharma@nitt.edu",
    phone: "+91 98401 11223",
    college: "National Institute of Technology, Trichy",
    registerNumber: "NITT-2024-CS-0842",
    department: "Computer Science and Engineering",
    degree: "B.Tech Computer Science",
    graduationYear: 2026,
    enrollmentStatus: "approved",
    completedCount: 1,
    inProgressCount: 0,
    totalAttempts: 1,
    bestScoreSum: 12,
    totalMarksSum: 12,
    nextModuleLabel: "Module 02 · Planned",
    lastActivityAt: "2026-11-18T10:55:00Z",
  },
  {
    id: "00000000-0000-4000-a000-000000000002",
    fullName: "Sneha Ramanathan",
    email: "sneha.raman@psgtech.ac.in",
    phone: "+91 98402 33445",
    college: "PSG College of Technology, Coimbatore",
    registerNumber: "22BCS108",
    department: "Computer Science and Engineering",
    degree: "B.E. Computer Science",
    graduationYear: 2026,
    enrollmentStatus: "approved",
    completedCount: 1,
    inProgressCount: 0,
    totalAttempts: 2,
    bestScoreSum: 12,
    totalMarksSum: 12,
    nextModuleLabel: "Module 02 · Planned",
    lastActivityAt: "2026-11-18T11:20:00Z",
  },
  {
    id: "00000000-0000-4000-a000-000000000003",
    fullName: "Vikram Patel",
    email: "vikram.patel@iitb.ac.in",
    phone: "+91 98403 55667",
    college: "Indian Institute of Technology, Bombay",
    registerNumber: "IITB-23-ME-0419",
    department: "Mechanical & Systems Engineering",
    degree: "B.Tech Mechanical",
    graduationYear: 2027,
    enrollmentStatus: "approved",
    completedCount: 0,
    inProgressCount: 1,
    totalAttempts: 1,
    bestScoreSum: 8,
    totalMarksSum: 12,
    nextModuleLabel: "Module 01 · Checkpoint Retry",
    lastActivityAt: "2026-11-18T12:05:00Z",
  },
  {
    id: "00000000-0000-4000-a000-000000000004",
    fullName: "Ananya Iyer",
    email: "ananya.iyer@pilani.bits-pilani.ac.in",
    phone: "+91 98404 77889",
    college: "BITS Pilani, Pilani Campus",
    registerNumber: "BITS-2023-CS-114",
    department: "Computer Science",
    degree: "B.E. Computer Science",
    graduationYear: 2027,
    enrollmentStatus: "approved",
    completedCount: 1,
    inProgressCount: 0,
    totalAttempts: 1,
    bestScoreSum: 12,
    totalMarksSum: 12,
    nextModuleLabel: "Module 02 · Planned",
    lastActivityAt: "2026-11-18T12:45:00Z",
  },
  {
    id: "00000000-0000-4000-a000-000000000005",
    fullName: "Rahul Verma",
    email: "rahul.verma@dtu.ac.in",
    phone: "+91 98405 99001",
    college: "Delhi Technological University",
    registerNumber: "DTU-22-IT-092",
    department: "Information Technology",
    degree: "B.Tech IT",
    graduationYear: 2026,
    enrollmentStatus: "pending",
    completedCount: 0,
    inProgressCount: 0,
    totalAttempts: 0,
    bestScoreSum: 0,
    totalMarksSum: 0,
    nextModuleLabel: "Awaiting Admin Approval",
    lastActivityAt: "2026-11-18T13:10:00Z",
  },
  {
    id: "00000000-0000-4000-a000-000000000006",
    fullName: "Priya Nair",
    email: "priya.nair@ceg.annauniv.edu",
    phone: "+91 98406 12345",
    college: "College of Engineering, Guindy (Anna University)",
    registerNumber: "CEG-23-CS-077",
    department: "Computer Science and Engineering",
    degree: "B.E. Computer Science",
    graduationYear: 2027,
    enrollmentStatus: "approved",
    completedCount: 1,
    inProgressCount: 0,
    totalAttempts: 1,
    bestScoreSum: 12,
    totalMarksSum: 12,
    nextModuleLabel: "Module 02 · Planned",
    lastActivityAt: "2026-11-18T13:30:00Z",
  },
  {
    id: "00000000-0000-4000-a000-000000000007",
    fullName: "Karthik Sundaram",
    email: "karthik.s@students.iiit.ac.in",
    phone: "+91 98407 67890",
    college: "International Institute of Information Technology, Hyderabad",
    registerNumber: "IIITH-24-CS-302",
    department: "Computer Science",
    degree: "B.Tech CSE",
    graduationYear: 2028,
    enrollmentStatus: "pending",
    completedCount: 0,
    inProgressCount: 0,
    totalAttempts: 0,
    bestScoreSum: 0,
    totalMarksSum: 0,
    nextModuleLabel: "Awaiting Admin Approval",
    lastActivityAt: "2026-11-18T14:00:00Z",
  },
  {
    id: "00000000-0000-4000-a000-000000000008",
    fullName: "Meera Joshi",
    email: "meera.joshi@rvce.edu.in",
    phone: "+91 98408 54321",
    college: "RV College of Engineering, Bengaluru",
    registerNumber: "RVCE-22-IS-145",
    department: "Information Science and Engineering",
    degree: "B.E. Information Science",
    graduationYear: 2026,
    enrollmentStatus: "approved",
    completedCount: 1,
    inProgressCount: 0,
    totalAttempts: 1,
    bestScoreSum: 12,
    totalMarksSum: 12,
    nextModuleLabel: "Module 02 · Planned",
    lastActivityAt: "2026-11-18T14:25:00Z",
  },
];

export default async function AdminStudentsPage() {
  const identity = await requireAdmin();
  let summaries: AdminStudentSummary[] = DEV_MOCK_STUDENTS;
  let error: string | undefined = undefined;

  if (isSupabaseConfigured() && !identity.isDevSession) {
    try {
      const supabase = await createClient();
      const [{ data: profiles, error: profilesError }, { data: enrollments }, { data: progress }] =
        await Promise.all([
          supabase
            .from("profiles")
            .select(
              "id,full_name,email,phone,college,register_number,department,degree,graduation_year,created_at",
            )
            .order("created_at", { ascending: false }),
          supabase.from("course_enrollments").select("student_id,status,access_source"),
          supabase
            .from("lesson_progress")
            .select("student_id,module_number,status,best_score,total_marks,attempts,updated_at"),
        ]);

      if (profilesError) error = profilesError.message;
      const profileRows = (profiles || []) as StudentProfile[];
      const enrollmentRows = (enrollments || []) as EnrollmentRow[];
      const progressRowsTyped = (progress || []) as ProgressRow[];

      const enrollmentMap = new Map<string, string>(
        enrollmentRows.map((e) => [e.student_id, e.status]),
      );

      const progressByStudent = new Map<string, ProgressRow[]>();
      for (const row of progressRowsTyped) {
        const existing = progressByStudent.get(row.student_id) || [];
        existing.push(row);
        progressByStudent.set(row.student_id, existing);
      }

      if (profileRows.length > 0) {
        summaries = profileRows.map((p) => {
          const rows = progressByStudent.get(p.id) || [];
          const completedSet = new Set(
            rows.filter((r) => r.status === "completed").map((r) => r.module_number),
          );
          const inProgressCount = rows.filter((r) => r.status === "in_progress").length;
          const totalAttempts = rows.reduce((sum, r) => sum + r.attempts, 0);
          const bestScoreSum = rows.reduce((sum, r) => sum + r.best_score, 0);
          const totalMarksSum = rows.reduce((sum, r) => sum + r.total_marks, 0);
          const lastActivityAt =
            rows
              .map((r) => r.updated_at)
              .sort()
              .reverse()[0] || p.created_at;

          let nextModule = 1;
          while (completedSet.has(nextModule) && nextModule <= 100) nextModule++;
          const nextMeta = catalog.modules.find((m) => m.id === nextModule);
          const nextModuleLabel = nextMeta
            ? `Module ${String(nextModule).padStart(2, "0")} · ${nextMeta.published ? "Published" : "Planned"}`
            : "Course complete";

          return {
            id: p.id,
            fullName: p.full_name,
            email: p.email,
            phone: p.phone,
            college: p.college,
            registerNumber: p.register_number,
            department: p.department,
            degree: p.degree,
            graduationYear: p.graduation_year,
            enrollmentStatus: enrollmentMap.get(p.id) || "pending",
            completedCount: completedSet.size,
            inProgressCount,
            totalAttempts,
            bestScoreSum,
            totalMarksSum,
            nextModuleLabel,
            lastActivityAt,
          };
        });
      }
    } catch (e) {
      error = e instanceof Error ? e.message : "Could not load students from Supabase.";
    }
  }

  const approvedCount = summaries.filter((s) => s.enrollmentStatus === "approved").length;
  const pendingCount = summaries.filter((s) => s.enrollmentStatus === "pending").length;
  const totalCompletedLessons = summaries.reduce((sum, s) => sum + s.completedCount, 0);

  return (
    <>
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">ADMINISTRATION · PROBLEM SOLVING LAB</span>
          <h1>Student records &amp; learning progress</h1>
          <p>
            Track each student&apos;s registration details, college affiliation, completed lessons,
            and checkpoint attempts.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {!isSupabaseConfigured() && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: "#926315",
                background: "#fef3c7",
                padding: "6px 10px",
                borderRadius: 99,
              }}
            >
              ⚡ Local Dev Sandbox
            </span>
          )}
          <span className="count-chip">{summaries.length} Students</span>
        </div>
      </div>

      <section className="dashboard-metrics">
        <div>
          <b>{summaries.length}</b>
          <span>Total registered</span>
        </div>
        <div>
          <b>{approvedCount}</b>
          <span>Approved students</span>
        </div>
        <div>
          <b>{pendingCount}</b>
          <span>Pending approval</span>
        </div>
        <div>
          <b>{totalCompletedLessons}</b>
          <span>Total lessons passed</span>
        </div>
      </section>

      {error && <div className="form-alert">{error}</div>}

      <AdminStudentsTable students={summaries} />
    </>
  );
}
