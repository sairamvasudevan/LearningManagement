import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { requireIdentity, getRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { COURSE_PACKAGES } from "@/lib/courses";
import catalog from "@/lib/course-catalog.json";

export const dynamic = "force-dynamic";

type CourseModule = {
  module_number: number;
  stage_number: number;
  title: string;
  objective: string;
  content_status: string;
};
type Progress = {
  module_number: number;
  status: string;
  best_score: number;
  total_marks: number;
  attempts: number;
  first_started_at: string | null;
  completed_at: string | null;
};
type AttemptRow = {
  id: string;
  module_number: number;
  status: string;
  score: number;
  total_marks: number;
  started_at: string;
  submitted_at: string | null;
};

export default async function StudentPortalPage() {
  const identity = await requireIdentity();
  if ((await getRole(identity.id)) === "admin") redirect("/admin");

  let profile = {
    full_name: identity.fullName || identity.email.split("@")[0] || "Enrolled Student",
    email: identity.email,
    phone: "+91 98401 23456",
    college: identity.college || "National Institute of Technology, Trichy",
    register_number: identity.registerNumber || "NITT-2024-CS-0842",
    department: identity.department || "Computer Science and Engineering",
    degree: identity.degree || "B.Tech Computer Science",
    graduation_year: identity.graduationYear ?? 2026,
  };
  let enrollment = {
    status: "approved",
    access_source: "self_registration",
    enrolled_at: "2026-11-18T10:00:00Z",
  };
  let moduleRows: CourseModule[] = catalog.modules.map((m) => ({
    module_number: m.id,
    stage_number: m.stage,
    title: m.title,
    objective: m.objective,
    content_status: m.published ? "published" : "planned",
  }));
  let progressList: Progress[] = [
    {
      module_number: 1,
      status: "completed",
      best_score: 12,
      total_marks: 12,
      attempts: 1,
      first_started_at: "2026-11-18T10:15:00Z",
      completed_at: "2026-11-18T10:55:00Z",
    },
  ];
  let attemptsList: AttemptRow[] = [
    {
      id: "att-demo-001",
      module_number: 1,
      status: "completed",
      score: 12,
      total_marks: 12,
      started_at: "2026-11-18T10:15:00Z",
      submitted_at: "2026-11-18T10:55:00Z",
    },
  ];

  if (isSupabaseConfigured() && !identity.isDevSession) {
    try {
      const supabase = await createClient();
      const [{ data: liveProfile }, { data: enrollmentData }] = await Promise.all([
        supabase
          .from("profiles")
          .select(
            "full_name,email,phone,college,register_number,department,degree,graduation_year",
          )
          .eq("id", identity.id)
          .maybeSingle(),
        supabase
          .from("course_enrollments")
          .select("status,access_source,enrolled_at")
          .eq("student_id", identity.id)
          .order("enrolled_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      if (liveProfile) profile = liveProfile;

      let liveEnrollment = enrollmentData;
      if (!liveEnrollment) {
        const { data } = await supabase.rpc("request_course_enrollment");
        if (data && typeof data === "object" && "status" in data) {
          liveEnrollment = {
            status: String(data.status),
            access_source: "self_registration",
            enrolled_at: "2026-11-18T10:00:00Z",
          };
        }
      }
      if (liveEnrollment) enrollment = liveEnrollment;

      if (enrollment?.status === "approved") {
        const [{ data: modules }, { data: progressRows }, { data: attemptRows }] =
          await Promise.all([
            supabase
              .from("course_modules")
              .select("module_number,stage_number,title,objective,content_status")
              .order("module_number"),
            supabase
              .from("lesson_progress")
              .select(
                "module_number,status,best_score,total_marks,attempts,first_started_at,completed_at",
              )
              .eq("student_id", identity.id),
            supabase
              .from("assessment_attempts")
              .select("id,module_number,status,score,total_marks,started_at,submitted_at")
              .eq("student_id", identity.id)
              .order("started_at", { ascending: false })
              .limit(10),
          ]);
        if (modules) moduleRows = modules as CourseModule[];
        if (progressRows) progressList = progressRows as Progress[];
        if (attemptRows) attemptsList = attemptRows as AttemptRow[];
      }
    } catch {
      // Fallback kept
    }
  }

  const approved = enrollment?.status === "approved";

  const moduleMap = new Map(moduleRows.map((m) => [m.module_number, m]));
  const progressMap = new Map(progressList.map((p) => [p.module_number, p]));

  const completed = progressList.filter((p) => p.status === "completed").length;
  const inProgress = progressList.filter((p) => p.status === "in_progress").length;
  const publishedModules = moduleRows.filter((m) => m.content_status === "published");
  const totalBestScore = progressList.reduce((sum, p) => sum + p.best_score, 0);
  const totalPossibleMarks = progressList.reduce((sum, p) => sum + p.total_marks, 0);
  const nextModule =
    Array.from({ length: 100 }, (_, i) => i + 1).find(
      (n) => !progressMap.get(n) || progressMap.get(n)?.status !== "completed",
    ) || 0;
  const displayName = profile?.full_name || identity.email.split("@")[0];
  const course = COURSE_PACKAGES[0];

  const isModuleUnlocked = (moduleNumber: number) =>
    moduleNumber === 1 || progressMap.get(moduleNumber - 1)?.status === "completed";

  return (
    <>
      <SiteHeader signedIn />
      <main className="dashboard-main">
        <div className="dashboard-heading">
          <div>
            <span className="eyebrow">STUDENT PROGRESS PORTAL</span>
            <h1>Welcome, {displayName.split(" ")[0]}.</h1>
            <p>
              Track your enrolled course package, lesson completions, checkpoint scores, and next
              unlocked module in one place.
            </p>
          </div>
          <span className="student-id-chip">STUDENT ACCOUNT</span>
        </div>

        {!approved ? (
          <section className="access-state">
            <div className="access-symbol">{enrollment?.status === "pending" ? "◷" : "!"}</div>
            <span className="eyebrow">COURSE ACCESS · {course.title.toUpperCase()}</span>
            <h2>
              {enrollment?.status === "pending"
                ? "Your registration is awaiting administrator approval"
                : "You are not enrolled in this package yet"}
            </h2>
            <p>
              {enrollment?.status === "pending"
                ? `Your student account for ${course.title} (${course.priceLabel}) has been created. An administrator must approve your registration before the lessons unlock.`
                : "This course package is currently invitation-only or your account has not been assigned yet. Share your registered email address with the course administrator."}
            </p>
            <div className="profile-summary">
              <b>Registered account</b>
              <span>{profile?.email || identity.email}</span>
              <span>
                {profile?.college || "College details pending"} ·{" "}
                {profile?.register_number || "Register number pending"}
              </span>
            </div>
          </section>
        ) : (
          <>
            <section className="dashboard-metrics">
              <div>
                <b>
                  {completed}
                  <small>/100</small>
                </b>
                <span>Lessons completed</span>
              </div>
              <div>
                <b>{completed}%</b>
                <span>Overall course progress</span>
              </div>
              <div>
                <b>{inProgress}</b>
                <span>Lessons in progress</span>
              </div>
              <div>
                <b>
                  {totalPossibleMarks > 0
                    ? `${totalBestScore}/${totalPossibleMarks}`
                    : "—"}
                </b>
                <span>Best checkpoint marks</span>
              </div>
            </section>

            <section className="student-course-card">
              <div className="course-card-top">
                <div>
                  <span className="eyebrow">ENROLLED COURSE PACKAGE · {course.priceLabel.toUpperCase()}</span>
                  <h2>{course.title}</h2>
                  <p>
                    100 hours · Language-independent reasoning · {publishedModules.length} lesson
                    currently published
                  </p>
                </div>
                <div className="course-status-group">
                  <span className="badge badge-category">{course.priceLabel}</span>
                  <span className="course-status">ENROLLED</span>
                </div>
              </div>

              <div className="course-progress-line">
                <span style={{ width: `${completed}%` }} />
              </div>
              <div className="course-progress-label">
                <b>{completed}% complete</b>
                <span>{completed} of 100 lessons mastered</span>
              </div>

              <div className="next-lesson-callout">
                <div>
                  <span className="eyebrow">YOUR NEXT STEP</span>
                  <h3>
                    {nextModule
                      ? `Module ${String(nextModule).padStart(2, "0")}: ${
                          catalog.modules.find((m) => m.id === nextModule)?.title || "Lesson"
                        }`
                      : "Course completed"}
                  </h3>
                  <p>
                    {nextModule
                      ? moduleMap.get(nextModule)?.content_status === "published"
                        ? catalog.modules.find((m) => m.id === nextModule)?.objective
                        : "You have completed all currently published lessons. The next module will unlock here once published."
                      : "All 100 lessons completed."}
                  </p>
                </div>
                {nextModule > 0 && moduleMap.get(nextModule)?.content_status === "published" && (
                  <Link className="button button-primary" href={`/learn/${nextModule}`}>
                    {progressMap.get(nextModule)?.status === "in_progress"
                      ? "Resume lesson →"
                      : "Start lesson →"}
                  </Link>
                )}
              </div>

              <div className="sub-section-head">
                <h3>Published lessons &amp; checkpoint progress</h3>
                <span>Sequential mastery gate: 80% required to unlock the next lesson</span>
              </div>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Lesson</th>
                      <th>Status</th>
                      <th>Best score</th>
                      <th>Attempts</th>
                      <th>Completed</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {publishedModules.map((mod) => {
                      const prog = progressMap.get(mod.module_number);
                      const unlocked = isModuleUnlocked(mod.module_number);
                      const statusLabel =
                        prog?.status === "completed"
                          ? "Completed"
                          : prog?.status === "in_progress"
                            ? "In progress"
                            : unlocked
                              ? "Available"
                              : "Locked";
                      const statusClass =
                        prog?.status === "completed"
                          ? "approved"
                          : prog?.status === "in_progress"
                            ? "pending"
                            : unlocked
                              ? "approved"
                              : "none";

                      return (
                        <tr key={mod.module_number}>
                          <td>
                            <b>
                              Module {String(mod.module_number).padStart(2, "0")} · {mod.title}
                            </b>
                            <small>{mod.objective}</small>
                          </td>
                          <td>
                            <span className={`table-status ${statusClass}`}>{statusLabel}</span>
                          </td>
                          <td>
                            {prog && prog.total_marks > 0
                              ? `${prog.best_score}/${prog.total_marks}`
                              : "—"}
                          </td>
                          <td>{prog?.attempts ?? 0}</td>
                          <td>
                            {prog?.completed_at
                              ? new Date(prog.completed_at).toLocaleDateString("en-IN")
                              : "—"}
                          </td>
                          <td>
                            {unlocked ? (
                              <Link
                                className="button button-small"
                                href={`/learn/${mod.module_number}`}
                              >
                                {prog?.status === "completed"
                                  ? "Review"
                                  : prog?.status === "in_progress"
                                    ? "Continue"
                                    : "Open"}
                              </Link>
                            ) : (
                              <span className="field-note">Locked</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="sub-section-head">
                <h3>10-path curriculum progress</h3>
                <span>Each path unlocks after completing the previous path</span>
              </div>
              <div className="portal-path-list">
                {catalog.stages.map((stage) => {
                  const stageModules = catalog.modules.filter((m) => m.stage === stage.id);
                  const stageCompleted = stageModules.filter(
                    (m) => progressMap.get(m.id)?.status === "completed",
                  ).length;
                  const stageOpen =
                    stage.id === 1 || progressMap.get((stage.id - 1) * 10)?.status === "completed";
                  return (
                    <div
                      className={`portal-path ${stageOpen ? "path-open" : "path-locked"}`}
                      key={stage.id}
                    >
                      <div className="portal-path-num">{String(stage.id).padStart(2, "0")}</div>
                      <div className="portal-path-copy">
                        <b>{stage.title}</b>
                        <span>{stage.description}</span>
                      </div>
                      <div className="portal-path-status">
                        {stageCompleted}/10 · {stageCompleted === 10 ? "Completed" : stageOpen ? "Open" : "Locked"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {attemptsList.length > 0 && (
              <section className="surface-card table-card">
                <div className="table-heading">
                  <div>
                    <span className="eyebrow">ASSESSMENT HISTORY</span>
                    <h2>Recent checkpoint attempts</h2>
                    <p>Every submitted checkpoint attempt recorded for your account.</p>
                  </div>
                </div>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Module</th>
                        <th>Result</th>
                        <th>Score</th>
                        <th>Started</th>
                        <th>Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attemptsList.map((attempt) => (
                        <tr key={attempt.id}>
                          <td>
                            <b>Module {String(attempt.module_number).padStart(2, "0")}</b>
                            <small>
                              {catalog.modules.find((m) => m.id === attempt.module_number)?.title ||
                                ""}
                            </small>
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
                            {attempt.total_marks > 0
                              ? `${attempt.score}/${attempt.total_marks}`
                              : "In progress"}
                          </td>
                          <td>{new Date(attempt.started_at).toLocaleString("en-IN")}</td>
                          <td>
                            {attempt.submitted_at
                              ? new Date(attempt.submitted_at).toLocaleString("en-IN")
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            <section className="profile-panel">
              <div>
                <span className="eyebrow">STUDENT PROFILE</span>
                <h2>Your registered details</h2>
              </div>
              <div className="profile-grid">
                <div>
                  <span>Full name</span>
                  <b>{profile?.full_name}</b>
                </div>
                <div>
                  <span>Email</span>
                  <b>{profile?.email}</b>
                </div>
                <div>
                  <span>Phone</span>
                  <b>{profile?.phone}</b>
                </div>
                <div>
                  <span>College</span>
                  <b>{profile?.college}</b>
                </div>
                <div>
                  <span>Register number</span>
                  <b>{profile?.register_number}</b>
                </div>
                <div>
                  <span>Department</span>
                  <b>{profile?.department}</b>
                </div>
                <div>
                  <span>Degree</span>
                  <b>{profile?.degree}</b>
                </div>
                <div>
                  <span>Graduation year</span>
                  <b>{profile?.graduation_year || "Not provided"}</b>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
}
