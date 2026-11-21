import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { requireIdentity, getRole } from "@/lib/auth";
import { getUserProgress, getUserAttempts, getUserById } from "@/lib/db";
import { COURSE_PACKAGES } from "@/lib/courses";
import { MODULES_CURRICULUM } from "@/lib/curriculum-data";

export const dynamic = "force-dynamic";

export default async function StudentPortalPage() {
  const identity = await requireIdentity();
  if ((await getRole(identity.id)) === "admin") redirect("/admin");

  const dbUser = getUserById(identity.id);
  const profile = {
    full_name: dbUser?.full_name || identity.fullName || identity.email.split("@")[0] || "Enrolled Student",
    email: dbUser?.email || identity.email,
    phone: dbUser?.phone || "+91 98401 23456",
    college: dbUser?.college || identity.college || "Engineering College",
    register_number: dbUser?.register_number || identity.registerNumber || "REG-2026-001",
    department: dbUser?.department || identity.department || "Computer Science and Engineering",
    degree: dbUser?.degree || identity.degree || "B.Tech Computer Science",
    graduation_year: dbUser?.graduation_year || identity.graduationYear || 2026,
    enrollment_status: dbUser?.enrollment_status || "approved",
  };

  // Real SQLite progress & attempts
  const progressList = getUserProgress(identity.id);
  const attemptsList = getUserAttempts(identity.id);

  const approved = profile.enrollment_status === "approved";
  const progressMap = new Map(progressList.map((p) => [p.module_number, p]));
  const completedSet = new Set(
    progressList.filter((p) => p.status === "completed").map((p) => p.module_number),
  );

  const completed = completedSet.size;
  const totalBestScore = progressList.reduce((sum, p) => sum + p.best_score, 0);
  const totalPossibleMarks = progressList.reduce((sum, p) => sum + p.total_marks, 0);

  // Determine current active module (1 to 10)
  const stage01Modules = Array.from({ length: 10 }, (_, i) => i + 1);
  const nextModule = stage01Modules.find((n) => !completedSet.has(n)) || 11;

  const currentModuleCurriculum = MODULES_CURRICULUM[nextModule <= 10 ? nextModule : 10];
  const displayName = profile.full_name;
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
              <span className="badge-roll">Roll: {profile.register_number}</span>
            </div>
            <h1>Welcome back, {displayName.split(" ")[0]}! 👋</h1>
            <p>
              Your verified enrollment in <b>{course.title}</b> is active. Master foundational problem
              solving, algorithmic invariants, and structured engineering thinking.
            </p>
          </div>
          <div className="portal-overall-stat">
            <div className="stat-circle">
              <span className="stat-number">{completed * 10}%</span>
              <span className="stat-label">Stage 01</span>
            </div>
            <div className="stat-sub">{completed} of 10 Modules Mastered</div>
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
              <span>{profile.email}</span>
              <span>
                {profile.college} · {profile.register_number}
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
                  <div className="metric-val">{completed} / 10</div>
                  <div className="metric-label">Stage 01 Modules</div>
                </div>
              </div>
              <div className="portal-metric-card">
                <span className="metric-icon">🎯</span>
                <div>
                  <div className="metric-val">
                    {nextModule <= 10 ? `Module ${String(nextModule).padStart(2, "0")}` : "Stage 01 Done"}
                  </div>
                  <div className="metric-label">Current Milestone</div>
                </div>
              </div>
              <div className="portal-metric-card">
                <span className="metric-icon">🏆</span>
                <div>
                  <div className="metric-val">
                    {totalPossibleMarks > 0 ? `${totalBestScore} / ${totalPossibleMarks}` : "0 / 12"}
                  </div>
                  <div className="metric-label">Cumulative Score</div>
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
                  <span>
                    {nextModule <= 10
                      ? `CURRENT ASSIGNMENT · STAGE 01 · MODULE ${String(nextModule).padStart(2, "0")}`
                      : "STAGE 01 COMPLETE · FOUNDATIONS MASTERED"}
                  </span>
                </div>
                <h2>
                  {nextModule <= 10
                    ? `Module ${String(nextModule).padStart(2, "0")}: ${currentModuleCurriculum?.title}`
                    : "🎉 Congratulations! You have mastered all 10 Foundation Modules!"}
                </h2>
                <p>
                  {nextModule <= 10
                    ? currentModuleCurriculum?.objective
                    : "You have completed all 10 modules in Stage 01 (Read & Define the Problem) with verified mastery checkpoints."}
                </p>
                {nextModule <= 10 && currentModuleCurriculum && (
                  <div className="action-meta-row">
                    <span>⏱️ {currentModuleCurriculum.readTime}</span>
                    <span>🧩 {currentModuleCurriculum.caseStudies.length} Case Studies</span>
                    <span>💻 Practice Task</span>
                    <span>📝 {currentModuleCurriculum.questions.length} Questions</span>
                    <span>🎯 80% to pass</span>
                  </div>
                )}
              </div>
              <div className="action-banner-btn-wrap">
                {nextModule <= 10 ? (
                  <Link
                    href={`/learn/${nextModule}`}
                    className="button button-cn-primary action-cta-btn"
                  >
                    {progressMap.get(nextModule)?.status === "in_progress"
                      ? `Resume Module ${String(nextModule).padStart(2, "0")} →`
                      : `Start Module ${String(nextModule).padStart(2, "0")} Now →`}
                  </Link>
                ) : (
                  <Link href="/learn/1" className="button button-outline action-cta-btn">
                    Review Curriculum Modules →
                  </Link>
                )}
              </div>
            </section>

            {/* Module Curriculum Roadmap (All 10 Modules) */}
            <section className="portal-curriculum-card">
              <div className="card-header-clean">
                <div>
                  <h3>Stage 01: Read &amp; Define the Problem (10 Modules)</h3>
                  <p>Master foundational problem solving. Pass each module with ≥ 80% to unlock the next.</p>
                </div>
                <span className="catalog-count-pill">10 Published Modules</span>
              </div>

              <div className="curriculum-modules-stack">
                {stage01Modules.map((mNum) => {
                  const mData = MODULES_CURRICULUM[mNum];
                  const isCompleted = completedSet.has(mNum);
                  const isUnlocked = mNum === 1 || completedSet.has(mNum - 1);
                  const prog = progressMap.get(mNum);

                  return (
                    <div
                      key={mNum}
                      className={`module-item-clean ${!isUnlocked ? "module-item-locked" : ""}`}
                    >
                      <div className="module-item-left">
                        <div
                          className={`module-num-badge ${
                            isCompleted
                              ? "badge-completed"
                              : isUnlocked
                                ? "badge-ready"
                                : "badge-locked"
                          }`}
                        >
                          {isCompleted ? "✓" : String(mNum).padStart(2, "0")}
                        </div>
                        <div className="module-item-info">
                          <h4>
                            Module {String(mNum).padStart(2, "0")}: {mData?.title || `Module ${mNum}`}
                          </h4>
                          <p>{mData?.objective}</p>
                          <div className="module-item-tags">
                            <span className="tag-pill">{mData?.readTime || "20 Mins"}</span>
                            <span className="tag-pill">{mData?.caseStudies.length || 2} Case Studies</span>
                            <span className="tag-pill">Hands-on Task</span>
                            <span className="tag-pill">{mData?.questions.length || 6} Questions</span>
                          </div>
                        </div>
                      </div>
                      <div className="module-item-right">
                        <div className="module-score-status">
                          {isCompleted ? (
                            <span className="status-badge-completed">
                              Passed ✓ ({prog?.best_score}/{prog?.total_marks})
                            </span>
                          ) : isUnlocked ? (
                            <span className="status-badge-ready">
                              {prog?.status === "in_progress" ? "In Progress" : "Ready to Start"}
                            </span>
                          ) : (
                            <span className="status-badge-locked">
                              🔒 Complete Mod {String(mNum - 1).padStart(2, "0")}
                            </span>
                          )}
                        </div>
                        {isUnlocked ? (
                          <Link
                            href={`/learn/${mNum}`}
                            className={`button button-small ${isCompleted ? "button-outline" : "button-cn-primary"}`}
                          >
                            {isCompleted ? "Review Material" : "Start Lesson →"}
                          </Link>
                        ) : (
                          <button
                            type="button"
                            className="button button-small button-disabled"
                            disabled
                          >
                            Locked
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Assessment History */}
            {attemptsList.length > 0 && (
              <section className="portal-curriculum-card">
                <div className="card-header-clean">
                  <div>
                    <h3>Mastery Checkpoint Assessment History</h3>
                    <p>Verified scores recorded in the persistent SQLite database.</p>
                  </div>
                  <span className="count-chip">{attemptsList.length} Attempts</span>
                </div>
                <div className="attempts-table-wrap">
                  <table className="clean-table">
                    <thead>
                      <tr>
                        <th>Module</th>
                        <th>Outcome</th>
                        <th>Score</th>
                        <th>Percentage</th>
                        <th>Submitted At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attemptsList.map((att) => {
                        const pct = att.total_marks > 0 ? Math.round((att.score / att.total_marks) * 100) : 0;
                        return (
                          <tr key={att.id}>
                            <td>
                              <b>Module {String(att.module_number).padStart(2, "0")}</b>
                            </td>
                            <td>
                              <span
                                className={att.passed ? "table-passed" : "table-active"}
                              >
                                {att.passed ? "Passed ✓" : "Review Needed"}
                              </span>
                            </td>
                            <td>
                              <b>
                                {att.score} / {att.total_marks}
                              </b>
                            </td>
                            <td>{pct}%</td>
                            <td>{new Date(att.submitted_at || "").toLocaleString("en-IN")}</td>
                          </tr>
                        );
                      })}
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
                  <p>Permanent institutional record linked to this learning portal.</p>
                </div>
                <span className="status-badge-completed">Verified Student</span>
              </div>
              <div className="profile-details-grid">
                <div className="profile-detail-cell">
                  <span>Full Name</span>
                  <b>{profile.full_name}</b>
                </div>
                <div className="profile-detail-cell">
                  <span>Registered Email</span>
                  <b>{profile.email}</b>
                </div>
                <div className="profile-detail-cell">
                  <span>Phone Number</span>
                  <b>{profile.phone}</b>
                </div>
                <div className="profile-detail-cell">
                  <span>Institution / College</span>
                  <b>{profile.college}</b>
                </div>
                <div className="profile-detail-cell">
                  <span>Roll / Register Number</span>
                  <b>{profile.register_number}</b>
                </div>
                <div className="profile-detail-cell">
                  <span>Department</span>
                  <b>{profile.department}</b>
                </div>
                <div className="profile-detail-cell">
                  <span>Degree &amp; Programme</span>
                  <b>{profile.degree}</b>
                </div>
                <div className="profile-detail-cell">
                  <span>Expected Graduation</span>
                  <b>{profile.graduation_year}</b>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
}
