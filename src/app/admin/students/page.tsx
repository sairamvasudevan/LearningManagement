import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  AdminStudentsTable,
  type AdminStudentSummary,
} from "@/components/admin-students-table";
import catalog from "@/lib/course-catalog.json";
import { getAllStudentsWithProgress } from "@/lib/db";

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

export default async function AdminStudentsPage() {
  const identity = await requireAdmin();

  // Load real students from SQLite backend
  const sqliteStudents = getAllStudentsWithProgress();
  let summaries: AdminStudentSummary[] = sqliteStudents;
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
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: "#065f46",
              background: "#d1fae5",
              padding: "6px 10px",
              borderRadius: 99,
            }}
          >
            ⚡ Persistent SQLite Engine
          </span>
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
