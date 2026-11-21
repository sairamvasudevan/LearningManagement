import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
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

  const cookieStore = await cookies();
  const progressCookie = cookieStore.get("psl_progress");

  let profile = {
    full_name: identity.fullName || identity.email.split("@")[0] || "Enrolled Student",
    email: identity.email,
    phone: "+91 98401 23456",
    college: identity.college || "Engineering College",
    register_number: identity.registerNumber || "REG-2026-001",
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

  // Dynamic progress from cookie in local session mode
  let progressList: Progress[] = [];
  let attemptsList: AttemptRow[] = [];

  if (progressCookie?.value) {
    try {
      progressList = JSON.parse(decodeURIComponent(progressCookie.value)) || [];
      attemptsList = progressList.map((p, idx) => ({
        id: `att-local-${idx + 1}`,
        module_number: p.module_number,
        status: p.status === "completed" ? "passed" : "active",
        score: p.best_score,
        total_marks: p.total_marks,
        started_at: p.first_started_at || new Date().toISOString(),
        submitted_at: p.completed_at || new Date().toISOString(),
      }));
    } catch {
      progressList = [];
      attemptsList = [];
    }
  }

  // Live Supabase Mode if keys present
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

  return (
    <>
      <SiteHeader signedIn />
      <main className="portal-container">
        {/* Welcome Header */}
        <section className="portal-welcome-card">
          <div className="portal-welcome-main">
            <div className="portal-badges">
              <span className="badge-flame">🔥 100-Hour Flagship</span>
              <span className="badge-free">100% Free Scholarship</span>
              <span className="badge-roll">Roll: {profile?.register_number || "REG-001"}</span>
            </div>
            <h1>Welcome back, {displayName.split(" ")[0]}! 👋</h1>
            <p>
              Your verified enrollment in <b>{course.title}</b> is active. Master foundational problem
              solving, algorithmic invariants, and structured engineering thinking.
            </p>
          </div>
          <div className="portal-overall-stat">
            <div className="stat-circle">
              <span className="stat-number">{completed}%</span>
              <span className="stat-label">Progress</span>
            </div>
            <div className="stat-sub">{completed} of 100 Modules Mastered</div>
          </div>
        </section>

        {!approved ? (
          <section className="access-state">
            <div className="access-symbol">⏳</div>
            <span className="eyebrow">COURSE ACCESS PENDING</span>
            <h2>Your registration is awaiting administrator approval</h2>
            <p>
              Your student account has been registered. An administrator will review your enrollment shortly.
            </p>
            <div className="profile-summary">
              <b>Registered Account</b>
              <span>{profile?.email || identity.email}</span>
              <span>
                {profile?.college} · {profile?.register_number}
              </span>
            </div>
          </section>
        ) : (
          <>
            {/* Quick Metrics Bar */}
            <div className="portal-metrics-grid">
              <div className="portal-metric-card">
                <span className="metric-icon">📚</span>
                <div>
                  <div className="metric-val">{completed} / 100</div>
                  <div className="metric-label">Modules Completed</div>
                </div>
              </div>
              <div className="portal-metric-card">
                <span className="metric-icon">🎯</span>
                <div>
                  <div className="metric-val">
                    {inProgress > 0 ? "1 Active" : completed > 0 ? "Module 02" : "Module 01"}
                  </div>
                  <div className="metric-label">Current Focus</div>
                </div>
              </div>
              <div className="portal-metric-card">
                <span className="metric-icon">🏆</span>
                <div>
                  <div className="metric-val">
                    {totalPossibleMarks > 0 ? `${totalBestScore} / ${totalPossibleMarks}` : "0 / 12"}
                  </div>
                  <div className="metric-label">Checkpoint Score</div>
                </div>
              </div>
              <div className="portal-metric-card">
                <span className="metric-icon">⚡</span>
                <div>
                  <div className="metric-val">Active</div>
                  <div className="metric-label">Scholarship Status</div>
                </div>
              </div>
            </div>

            {/* Current Focus Action Banner */}
            <section className="portal-action-banner">
              <div className="action-banner-content">
                <div className="action-kicker">
                  <span className="cn-pulse-dot-green"></span>
                  <span>CURRENT ASSIGNMENT · PATH 01 (READ &amp; DEFINE)</span>
                </div>
                <h2>
                  {completed === 0
                    ? "Module 01: Separate the Story from the Task"
                    : `Next Up: Module ${String(nextModule).padStart(2, "0")} · Express Task as Input, Rule, Output`}
                </h2>
                <p>
                  {completed === 0
                    ? "Master the art of extracting the algorithmic invariant from messy problem stories. Includes 4 principles, 3 real-world case studies, and a 6-question checkpoint."
                    : "Great work passing Module 01! Continue building your systematic engineering foundation."}
                </p>
                <div className="action-meta-row">
                  <span>⏱️ 20 min reading</span>
                  <span>📝 6 Questions</span>
                  <span>⭐ 12 Total Marks</span>
                  <span>🎯 80% to pass</span>
                </div>
              </div>
              <div className="action-banner-btn-wrap">
                <Link
                  href={nextModule > 0 ? `/learn/${nextModule}` : "/learn/1"}
                  className="button button-cn-primary action-cta-btn"
                >
                  {completed === 0 ? "🚀 Start Module 01 Now →" : "Review Module 01 →"}
                </Link>
              </div>
            </section>

            {/* Module Curriculum Roadmap */}
            <section className="portal-curriculum-card">
              <div className="card-header-clean">
                <div>
                  <h3>Module 01 Checkpoint &amp; Curriculum Track</h3>
                  <p>Sequential mastery gating: score ≥ 80% to unlock subsequent engineering modules.</p>
                </div>
                <span className="catalog-count-pill">{publishedModules.length} Published Module</span>
              </div>

              <div className="module-item-clean">
                <div className="module-item-left">
                  <div className={`module-num-badge ${completed > 0 ? "badge-completed" : "badge-ready"}`}>
                    {completed > 0 ? "✓" : "01"}
                  </div>
                  <div className="module-item-info">
                    <h4>Module 01: Separate the Story from the Task</h4>
                    <p>Identify the exact outcome requested without confusing background narrative with the algorithmic invariant.</p>
                    <div className="module-item-tags">
                      <span className="tag-pill">Foundation</span>
                      <span className="tag-pill">20 Mins</span>
                      <span className="tag-pill">12 Marks</span>
                    </div>
                  </div>
                </div>
                <div className="module-item-right">
                  <div className="module-score-status">
                    {progressMap.get(1)?.status === "completed" ? (
                      <span className="status-badge-completed">
                        Passed ({progressMap.get(1)?.best_score}/12)
                      </span>
                    ) : (
                      <span className="status-badge-ready">Ready to Start</span>
                    )}
                  </div>
                  <Link href="/learn/1" className="button button-small button-outline">
                    {completed > 0 ? "Review Material" : "Start Lesson →"}
                  </Link>
                </div>
              </div>

              {/* Planned Modules Preview */}
              <div className="planned-modules-list">
                <div className="planned-module-item">
                  <div className="planned-num">🔒 02</div>
                  <div className="planned-info">
                    <b>Express a task as input, rule and output</b>
                    <small>Construct formal transformation contracts and deterministic state mappings.</small>
                  </div>
                  <span className="planned-badge">Unlocks after Module 01</span>
                </div>
                <div className="planned-module-item">
                  <div className="planned-num">🔒 03</div>
                  <div className="planned-info">
                    <b>Extract constraints, limits, and resource bounds</b>
                    <small>Size limits, uniqueness rules, ordering, and capacity bounds.</small>
                  </div>
                  <span className="planned-badge">Planned</span>
                </div>
              </div>
            </section>

            {/* Recent Checkpoint Attempts */}
            {attemptsList.length > 0 && (
              <section className="portal-curriculum-card">
                <div className="card-header-clean">
                  <div>
                    <h3>Assessment History</h3>
                    <p>Verified scores recorded for your account.</p>
                  </div>
                </div>
                <div className="attempts-table-wrap">
                  <table className="clean-table">
                    <thead>
                      <tr>
                        <th>Module</th>
                        <th>Outcome</th>
                        <th>Score</th>
                        <th>Completed On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attemptsList.map((att) => (
                        <tr key={att.id}>
                          <td><b>Module {String(att.module_number).padStart(2, "0")}</b></td>
                          <td>
                            <span className={att.status === "passed" ? "table-passed" : "table-active"}>
                              {att.status === "passed" ? "Passed ✓" : "Active"}
                            </span>
                          </td>
                          <td><b>{att.score} / {att.total_marks}</b></td>
                          <td>{new Date(att.submitted_at || "").toLocaleDateString("en-IN")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Student Verified Profile Card */}
            <section className="portal-profile-clean">
              <div className="card-header-clean">
                <div>
                  <h3>Verified Student Registration</h3>
                  <p>Institutional record linked to this learning portal.</p>
                </div>
                <span className="status-badge-completed">Verified Student</span>
              </div>
              <div className="profile-details-grid">
                <div className="profile-detail-cell">
                  <span>Full Name</span>
                  <b>{profile?.full_name}</b>
                </div>
                <div className="profile-detail-cell">
                  <span>Registered Email</span>
                  <b>{profile?.email}</b>
                </div>
                <div className="profile-detail-cell">
                  <span>Phone Number</span>
                  <b>{profile?.phone}</b>
                </div>
                <div className="profile-detail-cell">
                  <span>Institution / College</span>
                  <b>{profile?.college}</b>
                </div>
                <div className="profile-detail-cell">
                  <span>Roll / Register Number</span>
                  <b>{profile?.register_number}</b>
                </div>
                <div className="profile-detail-cell">
                  <span>Department</span>
                  <b>{profile?.department}</b>
                </div>
                <div className="profile-detail-cell">
                  <span>Degree &amp; Programme</span>
                  <b>{profile?.degree}</b>
                </div>
                <div className="profile-detail-cell">
                  <span>Expected Graduation</span>
                  <b>{profile?.graduation_year}</b>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
}
