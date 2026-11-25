import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ApproveEnrollmentButton } from "@/components/auth-forms";
import catalog from "@/lib/course-catalog.json";
import {
  getUserById,
  getUserProgress,
  getUserAttempts,
  getPracticeSubmissions,
  getStudentCareerProfile,
  getUserSolvedDsaProblemIds,
  getUserCommunicationSubmissions,
} from "@/lib/db";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ studentId: string }> };

type ProgressRow = {
  module_number: number;
  status: string;
  best_score: number;
  total_marks: number;
  attempts: number;
  first_started_at: string | null;
  completed_at: string | null;
  updated_at: string;
};
type AttemptRow = {
  id: string;
  module_number: number;
  status: string;
  score: number;
  total_marks: number;
  pass_percent: number;
  started_at: string;
  submitted_at: string | null;
};
type ActivityRow = {
  id: string;
  module_number: number;
  activity_id: string;
  response: string;
  updated_at: string;
};

export default async function AdminStudentDetailPage({ params }: PageProps) {
  await requireAdmin();
  const { studentId } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(studentId)) notFound();

  // Load from persistent SQLite
  const dbUser = getUserById(studentId);
  if (!dbUser && !isSupabaseConfigured()) notFound();

  let profile = {
    id: studentId,
    full_name: dbUser?.full_name || "Aditya Sharma",
    email: dbUser?.email || "student@learninghub.edu",
    phone: dbUser?.phone || "+91 98401 11223",
    college: dbUser?.college || "National Institute of Technology, Trichy",
    register_number: dbUser?.register_number || "NITT-2024-CS-0842",
    department: dbUser?.department || "Computer Science and Engineering",
    degree: dbUser?.degree || "B.Tech Computer Science",
    graduation_year: dbUser?.graduation_year || 2026,
    created_at: dbUser?.created_at || "2026-11-18T09:30:00Z",
  };

  let enrollment = {
    status: dbUser?.enrollment_status || "approved",
    access_source: "self_registration",
    enrolled_at: dbUser?.created_at || "2026-11-18T10:00:00Z",
    approved_at: dbUser?.created_at || "2026-11-18T10:05:00Z",
  };

  const sqliteProgress = getUserProgress(studentId);
  let progressList: ProgressRow[] = sqliteProgress.map((p) => ({
    module_number: p.module_number,
    status: p.status,
    best_score: p.best_score,
    total_marks: p.total_marks,
    attempts: p.attempts,
    first_started_at: p.first_started_at,
    completed_at: p.completed_at,
    updated_at: p.completed_at || p.first_started_at || new Date().toISOString(),
  }));

  const sqliteAttempts = getUserAttempts(studentId);
  let attemptsList: AttemptRow[] = sqliteAttempts.map((a) => ({
    id: a.id,
    module_number: a.module_number,
    status: a.passed ? "passed" : "failed",
    score: a.score,
    total_marks: a.total_marks,
    pass_percent: 80,
    started_at: a.started_at,
    submitted_at: a.submitted_at,
  }));

  const sqlitePractice = getPracticeSubmissions(studentId);
  let activitiesList: ActivityRow[] = sqlitePractice.map((pr) => ({
    id: pr.id,
    module_number: pr.module_number,
    activity_id: pr.task_id,
    response: pr.submission,
    updated_at: pr.submitted_at,
  }));

  // If live Supabase is configured and not dev session, query it as well
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const [
        { data: liveProfile },
        { data: liveEnrollment },
        { data: liveProgressRows },
        { data: liveAttemptRows },
        { data: liveActivityRows },
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select(
            "id,full_name,email,phone,college,register_number,department,degree,graduation_year,created_at",
          )
          .eq("id", studentId)
          .maybeSingle(),
        supabase
          .from("course_enrollments")
          .select("status,access_source,enrolled_at,approved_at")
          .eq("student_id", studentId)
          .order("enrolled_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from("lesson_progress")
          .select(
            "module_number,status,best_score,total_marks,attempts,first_started_at,completed_at,updated_at",
          )
          .eq("student_id", studentId)
          .order("module_number"),
        supabase
          .from("assessment_attempts")
          .select("id,module_number,status,score,total_marks,pass_percent,started_at,submitted_at")
          .eq("student_id", studentId)
          .order("started_at", { ascending: false })
          .limit(25),
        supabase
          .from("lesson_activity_responses")
          .select("id,module_number,activity_id,response,updated_at")
          .eq("student_id", studentId)
          .order("updated_at", { ascending: false }),
      ]);

      if (liveProfile) {
        profile = liveProfile;
        if (liveEnrollment) enrollment = liveEnrollment;
        if (liveProgressRows && liveProgressRows.length > 0)
          progressList = liveProgressRows as ProgressRow[];
        if (liveAttemptRows && liveAttemptRows.length > 0)
          attemptsList = liveAttemptRows as AttemptRow[];
        if (liveActivityRows && liveActivityRows.length > 0)
          activitiesList = liveActivityRows as ActivityRow[];
      }
    } catch {
      // Kept SQLite
    }
  }

  const career = getStudentCareerProfile(studentId);
  const dsaSolvedCount = getUserSolvedDsaProblemIds(studentId).size;
  const commSubs = getUserCommunicationSubmissions(studentId);
  const bestVersant = commSubs.length ? Math.max(...commSubs.map((c) => c.overall_score)) : null;

  const completedCount = progressList.filter((p) => p.status === "completed").length;
  const inProgressCount = progressList.filter((p) => p.status === "in_progress").length;
  const totalBestScore = progressList.reduce((sum, p) => sum + p.best_score, 0);
  const totalPossibleMarks = progressList.reduce((sum, p) => sum + p.total_marks, 0);
  const status = enrollment?.status || "none";

  return (
    <>
      <div className="breadcrumb-row">
        <Link href="/admin/students">← Back to all students</Link>
        <span>/</span>
        <span>{profile.full_name}</span>
      </div>

      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">STUDENT PROGRESS RECORD · PROBLEM SOLVING LAB</span>
          <h1>{profile.full_name}</h1>
          <p>
            {profile.email} · {profile.college} ({profile.register_number})
          </p>
        </div>
        <div className="course-status-group">
          <span className={`table-status ${status}`}>
            {(status as string) === "none" ? "Not enrolled" : status}
          </span>
          {status === "pending" && <ApproveEnrollmentButton studentId={profile.id} />}
        </div>
      </div>

      <section className="dashboard-metrics admin-metrics">
        <div>
          <b>
            {completedCount}
            <small>/10</small>
          </b>
          <span>Stage 01 Completed ({completedCount * 10}%)</span>
        </div>
        <div>
          <b>{inProgressCount}</b>
          <span>Lessons in progress</span>
        </div>
        <div>
          <b>{attemptsList.length}</b>
          <span>Checkpoint attempts</span>
        </div>
        <div>
          <b>{totalPossibleMarks > 0 ? `${totalBestScore}/${totalPossibleMarks}` : "—"}</b>
          <span>Cumulative marks</span>
        </div>
      </section>

      <section className="student-course-card">
        <div className="course-card-top">
          <div>
            <span className="eyebrow">PACKAGE PROGRESS</span>
            <h2>Problem Solving Lab (Free Package)</h2>
            <p>
              Enrollment status: <b>{enrollment.status}</b> · Source: {enrollment.access_source}
            </p>
          </div>
          <span className="course-status">{completedCount * 10}% OF STAGE 01</span>
        </div>
        <div className="course-progress-line">
          <span style={{ width: `${completedCount * 10}%` }} />
        </div>
        <div className="course-progress-label">
          <b>{completedCount} of 10 Stage 01 lessons completed</b>
          <span>{activitiesList.length} written practice submissions saved</span>
        </div>
      </section>

      <section className="profile-panel">
        <div>
          <span className="eyebrow">ACADEMIC &amp; CONTACT PROFILE</span>
          <h2>Student details</h2>
        </div>
        <div className="profile-grid">
          <div>
            <span>Full name</span>
            <b>{profile.full_name}</b>
          </div>
          <div>
            <span>Email</span>
            <b>{profile.email}</b>
          </div>
          <div>
            <span>Phone</span>
            <b>{profile.phone}</b>
          </div>
          <div>
            <span>College</span>
            <b>{profile.college}</b>
          </div>
          <div>
            <span>Register number</span>
            <b>{profile.register_number}</b>
          </div>
          <div>
            <span>Department</span>
            <b>{profile.department}</b>
          </div>
          <div>
            <span>Degree</span>
            <b>{profile.degree}</b>
          </div>
          <div>
            <span>Graduation year</span>
            <b>{profile.graduation_year || "Not provided"}</b>
          </div>
        </div>
      </section>

      {career && (
        <section className="surface-card" style={{ padding: "24px", marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginBottom: "14px" }}>
            <div>
              <span className="eyebrow" style={{ color: "#60a5fa" }}>GALGOTIAS T&amp;P CAREER &amp; CODING DOSSIER</span>
              <h2 style={{ margin: "4px 0" }}>
                {career.headline || `${career.branch} Candidate`}
              </h2>
            </div>
            <Link href="/admin/placements" className="button button-quiet button-small">
              Open JD Shortlist Engine →
            </Link>
          </div>

          <div className="profile-grid" style={{ marginBottom: "16px" }}>
            <div>
              <span>Admission / Enroll No.</span>
              <b>{career.admission_no || profile.register_number} · {career.enrollment_no || "—"}</b>
            </div>
            <div>
              <span>CGPA &amp; School Percentages</span>
              <b>{career.cgpa.toFixed(2)} CGPA (10th: {career.tenth_pct}% · 12th: {career.twelfth_pct}%)</b>
            </div>
            <div>
              <span>Active Backlogs / Status</span>
              <b>{career.active_backlogs} backlogs · {career.placement_eligible ? "Eligible" : "Opted Out"}</b>
            </div>
            <div>
              <span>Codolio Unified Profile</span>
              <b>{career.codolio_handle ? `@${career.codolio_handle} (${career.codolio_total_solved} solved)` : "Not linked"}</b>
            </div>
            <div>
              <span>LeetCode / Codeforces / CodeChef</span>
              <b>LC {career.leetcode_solved} ({career.leetcode_rating}) · CF {career.codeforces_rating} · CC {career.codechef_rating}</b>
            </div>
            <div>
              <span>GitHub / DSA Arena / LSRW Versant</span>
              <b>GH {career.github_repos} repos · DSA {dsaSolvedCount} · Versant {bestVersant ? `${bestVersant}/80` : "Pending"}</b>
            </div>
          </div>

          {career.skills.length > 0 && (
            <div style={{ marginBottom: "14px" }}>
              <small style={{ color: "#86868b", display: "block", marginBottom: "6px" }}>Verified Skills</small>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {career.skills.map((s) => (
                  <span key={s} className="tag-pill">{s}</span>
                ))}
              </div>
            </div>
          )}

          {career.projects.length > 0 && (
            <div>
              <small style={{ color: "#86868b", display: "block", marginBottom: "8px" }}>Engineering Projects ({career.projects.length})</small>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "10px" }}>
                {career.projects.map((p) => (
                  <div key={p.id} style={{ background: "#111113", border: "1px solid var(--border-subtle)", borderRadius: "10px", padding: "12px" }}>
                    <b style={{ color: "#f5f5f7" }}>{p.title}</b>
                    <div style={{ fontSize: "11.5px", color: "#60a5fa", margin: "3px 0" }}>{p.techStack.join(" · ")}</div>
                    <p style={{ margin: "0 0 4px", fontSize: "12.5px", color: "#cbd5e1" }}>{p.summary}</p>
                    {p.impactMetric && <small style={{ color: "#34d399" }}>{p.impactMetric}</small>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      <section className="surface-card table-card">
        <div className="table-heading">
          <div>
            <h2>Module-by-module progress</h2>
            <p>Recorded lesson starts, completions, best checkpoint scores, and attempts.</p>
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Module</th>
                <th>Status</th>
                <th>Best score</th>
                <th>Attempts</th>
                <th>First started</th>
                <th>Completed</th>
              </tr>
            </thead>
            <tbody>
              {progressList.map((row) => (
                <tr key={row.module_number}>
                  <td>
                    <b>
                      Module {String(row.module_number).padStart(2, "0")} ·{" "}
                      {catalog.modules.find((m) => m.id === row.module_number)?.title || ""}
                    </b>
                  </td>
                  <td>
                    <span
                      className={`table-status ${
                        row.status === "completed"
                          ? "approved"
                          : row.status === "in_progress"
                            ? "pending"
                            : "none"
                      }`}
                    >
                      {row.status.replace("_", " ")}
                    </span>
                  </td>
                  <td>{row.total_marks > 0 ? `${row.best_score}/${row.total_marks}` : "—"}</td>
                  <td>{row.attempts}</td>
                  <td>
                    {row.first_started_at
                      ? new Date(row.first_started_at).toLocaleString("en-IN")
                      : "—"}
                  </td>
                  <td>
                    {row.completed_at ? new Date(row.completed_at).toLocaleString("en-IN") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {progressList.length === 0 && (
            <div className="empty-state">This student has not started any lessons yet.</div>
          )}
        </div>
      </section>

      <section className="surface-card table-card">
        <div className="table-heading">
          <div>
            <h2>Assessment attempt log</h2>
            <p>Chronological record of every mastery checkpoint attempt.</p>
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Module</th>
                <th>Status</th>
                <th>Score</th>
                <th>Threshold</th>
                <th>Started</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {attemptsList.map((attempt) => (
                <tr key={attempt.id}>
                  <td>
                    <b>Module {String(attempt.module_number).padStart(2, "0")}</b>
                  </td>
                  <td>
                    <span
                      className={`table-status ${
                        attempt.status === "passed"
                          ? "approved"
                          : attempt.status === "failed"
                            ? "rejected"
                            : "pending"
                      }`}
                    >
                      {attempt.status}
                    </span>
                  </td>
                  <td>
                    {attempt.total_marks > 0 ? `${attempt.score}/${attempt.total_marks}` : "—"}
                  </td>
                  <td>{attempt.pass_percent}%</td>
                  <td>{new Date(attempt.started_at).toLocaleString("en-IN")}</td>
                  <td>
                    {attempt.submitted_at
                      ? new Date(attempt.submitted_at).toLocaleString("en-IN")
                      : "Active"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {attemptsList.length === 0 && (
            <div className="empty-state">No assessment attempts recorded yet.</div>
          )}
        </div>
      </section>

      <section className="surface-card table-card">
        <div className="table-heading">
          <div>
            <h2>Saved practice task submissions</h2>
            <p>Hands-on engineering problem solving submissions saved by this student.</p>
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Module / Task ID</th>
                <th>Student response</th>
                <th>Last saved</th>
              </tr>
            </thead>
            <tbody>
              {activitiesList.map((act) => (
                <tr key={act.id}>
                  <td>
                    <b>Module {String(act.module_number).padStart(2, "0")}</b>
                    <small>{act.activity_id}</small>
                  </td>
                  <td style={{ whiteSpace: "pre-wrap", maxWidth: 620, fontFamily: "monospace", fontSize: 12 }}>
                    {act.response}
                  </td>
                  <td>{new Date(act.updated_at).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {activitiesList.length === 0 && (
            <div className="empty-state">No written practice submissions recorded yet.</div>
          )}
        </div>
      </section>
    </>
  );
}
