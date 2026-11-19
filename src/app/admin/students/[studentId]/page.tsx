import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ApproveEnrollmentButton } from "@/components/auth-forms";
import catalog from "@/lib/course-catalog.json";

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

  let profile = {
    id: studentId,
    full_name: "Aditya Sharma",
    email: "aditya.sharma@nitt.edu",
    phone: "+91 98401 11223",
    college: "National Institute of Technology, Trichy",
    register_number: "NITT-2024-CS-0842",
    department: "Computer Science and Engineering",
    degree: "B.Tech Computer Science",
    graduation_year: 2026,
    created_at: "2026-11-18T09:30:00Z",
  };
  let enrollment = {
    status: "approved",
    access_source: "self_registration",
    enrolled_at: "2026-11-18T10:00:00Z",
    approved_at: "2026-11-18T10:05:00Z",
  };
  let progressList: ProgressRow[] = [
    {
      module_number: 1,
      status: "completed",
      best_score: 12,
      total_marks: 12,
      attempts: 1,
      first_started_at: "2026-11-18T10:15:00Z",
      completed_at: "2026-11-18T10:55:00Z",
      updated_at: "2026-11-18T10:55:00Z",
    },
  ];
  let attemptsList: AttemptRow[] = [
    {
      id: "att-001",
      module_number: 1,
      status: "completed",
      score: 12,
      total_marks: 12,
      pass_percent: 80,
      started_at: "2026-11-18T10:15:00Z",
      submitted_at: "2026-11-18T10:55:00Z",
    },
  ];
  let activitiesList: ActivityRow[] = [
    {
      id: "act-001",
      module_number: 1,
      activity_id: "m01-act-01",
      response:
        "The real task is to count distinct active riders on Route B on Tuesday, ignoring duplicate tap events within the same trip window.",
      updated_at: "2026-11-18T10:35:00Z",
    },
  ];

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
        if (liveProgressRows) progressList = liveProgressRows as ProgressRow[];
        if (liveAttemptRows) attemptsList = liveAttemptRows as AttemptRow[];
        if (liveActivityRows) activitiesList = liveActivityRows as ActivityRow[];
      }
    } catch {
      // Dev mock retained
    }
  }

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
            {status === "none" ? "Not enrolled" : status}
          </span>
          {status === "pending" && <ApproveEnrollmentButton studentId={profile.id} />}
        </div>
      </div>

      <section className="dashboard-metrics admin-metrics">
        <div>
          <b>
            {completedCount}
            <small>/100</small>
          </b>
          <span>Lessons completed ({completedCount}%)</span>
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
          <span>Best checkpoint marks</span>
        </div>
      </section>

      <section className="student-course-card">
        <div className="course-card-top">
          <div>
            <span className="eyebrow">PACKAGE PROGRESS</span>
            <h2>Problem Solving Lab (Free Package)</h2>
            <p>
              Enrollment source: {enrollment?.access_source || "Not enrolled yet"}
              {enrollment?.approved_at
                ? ` · Approved ${new Date(enrollment.approved_at).toLocaleDateString("en-IN")}`
                : ""}
            </p>
          </div>
          <span className="course-status">{completedCount}% COMPLETE</span>
        </div>
        <div className="course-progress-line">
          <span style={{ width: `${completedCount}%` }} />
        </div>
        <div className="course-progress-label">
          <b>{completedCount} of 100 lessons completed</b>
          <span>{activitiesList.length} written activity responses saved</span>
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
            <h2>Saved written activity responses</h2>
            <p>Guided and independent practice responses saved by this student.</p>
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Module / Activity</th>
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
                  <td style={{ whiteSpace: "pre-wrap", maxWidth: 620 }}>{act.response}</td>
                  <td>{new Date(act.updated_at).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {activitiesList.length === 0 && (
            <div className="empty-state">No written activity responses saved yet.</div>
          )}
        </div>
      </section>
    </>
  );
}

