import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { requireIdentity, getRole } from "@/lib/auth";
import { getUserProgress, getUserAttempts, getUserById } from "@/lib/db";
import { COURSE_PACKAGES } from "@/lib/courses";
import { MODULES_CURRICULUM } from "@/lib/curriculum-data";
import catalog from "@/lib/course-catalog.json";
import { PortalStageExplorer } from "@/components/portal-stage-explorer";
import { checkCourseAccess } from "@/lib/course-prerequisites";

export const dynamic = "force-dynamic";

export default async function StudentPortalPage() {
  const identity = await requireIdentity();
  if ((await getRole(identity.id)) === "admin") redirect("/admin");

  const dsaAccess = checkCourseAccess(identity.id, "dsa-mastery-lab");
  const webDevAccess = checkCourseAccess(identity.id, "web-dev-mern-lab");

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

  // Determine current active module across all 100 modules
  const allModules = catalog.modules;
  const nextModule = allModules.find((m) => !completedSet.has(m.id))?.id || 101;
  const currentStageNumber = Math.min(10, Math.max(1, Math.ceil(nextModule / 10)));
  const currentModuleCurriculum = MODULES_CURRICULUM[nextModule <= 100 ? nextModule : 100];
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
              <span>{profile.email}</span>
              <span>
                {profile.college} · {profile.register_number}
              </span>
            </div>
            <div style={{ marginTop: "16px" }}>
              <a href="/auth/signout" className="button button-quiet button-small" style={{ textDecoration: "none" }}>
                🚪 Sign out
              </a>
            </div>
          </section>
        ) : (
          <>
            {/* Advanced Tracks Header */}
            <div style={{ margin: "20px 0 12px", display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  ADVANCED PRACTICAL TRACKS
                </span>
                <h3 style={{ margin: "2px 0 0", fontSize: "20px", color: "#0f172a", fontWeight: 800 }}>
                  Specialization Laboratories &amp; Coding Arenas
                </h3>
              </div>
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>
                Unlocked after mastering 100-Hour Problem Solving Foundation ({completed}/100 Completed)
              </span>
            </div>

            {/* DSA CodeStudio Flagship Banner */}
            <div
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                borderRadius: "14px",
                padding: "20px 24px",
                color: "#ffffff",
                marginBottom: "14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
                border: dsaAccess.isLocked ? "1px dashed #475569" : "1px solid #334155",
                opacity: dsaAccess.isLocked ? 0.92 : 1,
              }}
            >
              <div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                  {dsaAccess.isLocked ? (
                    <span
                      style={{
                        background: "#f59e0b",
                        color: "#000",
                        fontSize: "10px",
                        fontWeight: 900,
                        padding: "2px 8px",
                        borderRadius: "99px",
                        textTransform: "uppercase",
                      }}
                    >
                      🔒 PREREQUISITE REQUIRED · {completed}/100 MODULES
                    </span>
                  ) : (
                    <span
                      style={{
                        background: "#10b981",
                        color: "#fff",
                        fontSize: "10px",
                        fontWeight: 800,
                        padding: "2px 8px",
                        borderRadius: "99px",
                        textTransform: "uppercase",
                      }}
                    >
                      ✅ UNLOCKED
                    </span>
                  )}
                  <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>
                    Multi-Language Compiler (C · C++17 · Java 17 · Python 3)
                  </span>
                </div>
                <h3 style={{ margin: "0 0 4px", fontSize: "18px", color: "#f8fafc" }}>
                  DSA CodeStudio: Algorithmic Coding Arena
                </h3>
                <p style={{ margin: 0, fontSize: "13px", color: "#cbd5e1", maxWidth: "620px" }}>
                  {dsaAccess.isLocked
                    ? "Problem 01 (Two Sum) is open for preview. Complete all 100 modules of Problem Solving Lab to unlock the full competitive problem bank and compiler test runner."
                    : "Practice data structures & algorithmic patterns in C, C++, Java, and Python. Test code against hidden test suites on our dedicated execution engine."}
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {dsaAccess.isLocked ? (
                  <>
                    <Link
                      href="/dsa/two-sum"
                      className="button button-cn-primary"
                      style={{ padding: "8px 16px", fontSize: "12px", fontWeight: 700 }}
                    >
                      👁️ Preview Problem 01 ❯
                    </Link>
                    <Link
                      href="/dsa"
                      className="button button-quiet"
                      style={{ padding: "8px 16px", fontSize: "12px", color: "#c7d2fe", borderColor: "#475569" }}
                    >
                      📋 View Problems
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/dsa"
                    className="button button-cn-primary"
                    style={{ padding: "10px 20px", fontSize: "13px", fontWeight: 700 }}
                  >
                    Open DSA Arena →
                  </Link>
                )}
              </div>
            </div>

            {/* Web Dev & Full MERN Sandbox Banner */}
            <div
              style={{
                background: "linear-gradient(135deg, #091224 0%, #172554 100%)",
                borderRadius: "14px",
                padding: "20px 24px",
                color: "#ffffff",
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
                border: webDevAccess.isLocked ? "1px dashed #1e3a8a" : "1px solid #1e3a8a",
                opacity: webDevAccess.isLocked ? 0.92 : 1,
              }}
            >
              <div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                  {webDevAccess.isLocked ? (
                    <span
                      style={{
                        background: "#f59e0b",
                        color: "#000",
                        fontSize: "10px",
                        fontWeight: 900,
                        padding: "2px 8px",
                        borderRadius: "99px",
                        textTransform: "uppercase",
                      }}
                    >
                      🔒 PREREQUISITE REQUIRED · {completed}/100 MODULES
                    </span>
                  ) : (
                    <span
                      style={{
                        background: "#10b981",
                        color: "#fff",
                        fontSize: "10px",
                        fontWeight: 800,
                        padding: "2px 8px",
                        borderRadius: "99px",
                        textTransform: "uppercase",
                      }}
                    >
                      ✅ UNLOCKED
                    </span>
                  )}
                  <span style={{ fontSize: "12px", color: "#93c5fd", fontWeight: 600 }}>
                    HTML5 · CSS3 Flexbox/Grid · Modern JavaScript · Full MERN
                  </span>
                </div>
                <h3 style={{ margin: "0 0 4px", fontSize: "18px", color: "#f8fafc" }}>
                  Full-Stack Web Development &amp; MERN Lab
                </h3>
                <p style={{ margin: 0, fontSize: "13px", color: "#cbd5e1", maxWidth: "620px" }}>
                  {webDevAccess.isLocked
                    ? "Chapter 01 (HTML5 Skeleton) is open for preview. Complete all 100 modules of Problem Solving Lab to unlock the full 26-chapter curriculum and WebKata challenges."
                    : "Code with our interactive live editor (HTML/CSS/JS), view real-time sandboxed DOM preview, inspect console logs, and pass automated requirement test suites."}
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {webDevAccess.isLocked ? (
                  <>
                    <Link
                      href="/web-dev/html-intro"
                      className="button button-cn-primary"
                      style={{ padding: "8px 16px", fontSize: "12px", fontWeight: 700, background: "#0284c7", borderColor: "#0284c7" }}
                    >
                      👁️ Preview Chapter 01 ❯
                    </Link>
                    <Link
                      href="/web-dev"
                      className="button button-quiet"
                      style={{ padding: "8px 16px", fontSize: "12px", color: "#93c5fd", borderColor: "#1e3a8a" }}
                    >
                      📋 View Chapters
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/web-dev"
                    className="button button-cn-primary"
                    style={{ padding: "10px 20px", fontSize: "13px", fontWeight: 700, background: "#0284c7", borderColor: "#0284c7" }}
                  >
                    Open Web Dev Lab →
                  </Link>
                )}
              </div>
            </div>

            {/* Standalone Online IDE & Compiler Scratchpad Banner */}
            <div
              style={{
                background: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
                borderRadius: "14px",
                padding: "20px 24px",
                color: "#ffffff",
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
                border: "1px solid #059669",
              }}
            >
              <div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                  <span
                    style={{
                      background: "#34d399",
                      color: "#064e3b",
                      fontSize: "10px",
                      fontWeight: 800,
                      padding: "2px 8px",
                      borderRadius: "99px",
                      textTransform: "uppercase",
                    }}
                  >
                    OPEN SCRATCHPAD
                  </span>
                  <span style={{ fontSize: "12px", color: "#a7f3d0", fontWeight: 600 }}>
                    Execute Arbitrary Code · C · C++17 · Java 17 · Python 3 · Web Canvas
                  </span>
                </div>
                <h3 style={{ margin: "0 0 4px", fontSize: "18px", color: "#f8fafc" }}>
                  Standalone Online IDE &amp; Execution Sandbox
                </h3>
                <p style={{ margin: 0, fontSize: "13px", color: "#d1fae5", maxWidth: "620px" }}>
                  Run, test, and debug any arbitrary code with custom STDIN input outside of problem exercises.
                  Free-form coding with compiler telemetry, execution runtimes, and file export.
                </p>
              </div>
              <div>
                <Link
                  href="/ide"
                  className="button button-cn-primary"
                  style={{ padding: "10px 20px", fontSize: "13px", fontWeight: 700, background: "#10b981", borderColor: "#10b981", color: "#064e3b" }}
                >
                  Launch Online IDE ↗
                </Link>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="portal-metrics-grid">
              <div className="portal-metric-card">
                <span className="metric-icon">📚</span>
                <div>
                  <div className="metric-val">{completed} / 100</div>
                  <div className="metric-label">Mastered Modules</div>
                </div>
              </div>
              <div className="portal-metric-card">
                <span className="metric-icon">🎯</span>
                <div>
                  <div className="metric-val">
                    {nextModule <= 100 ? `Module ${String(nextModule).padStart(2, "0")}` : "All Completed"}
                  </div>
                  <div className="metric-label">Stage {String(currentStageNumber).padStart(2, "0")} Milestone</div>
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
                    {nextModule <= 100
                      ? `CURRENT ASSIGNMENT · STAGE ${String(currentStageNumber).padStart(2, "0")} · MODULE ${String(nextModule).padStart(2, "0")}`
                      : "ALL 100 MODULES COMPLETE · FLAGSHIP MASTER"}
                  </span>
                </div>
                <h2>
                  {nextModule <= 100
                    ? `Module ${String(nextModule).padStart(2, "0")}: ${currentModuleCurriculum?.title}`
                    : "🎉 Congratulations! You have mastered all 100 modules in the Problem Solving Lab!"}
                </h2>
                <p>
                  {nextModule <= 100
                    ? currentModuleCurriculum?.objective
                    : "You have completed all 100 modules across all 10 stages with verified mastery checkpoints."}
                </p>
                {nextModule <= 100 && currentModuleCurriculum && (
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
                {nextModule <= 100 ? (
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

            {/* Interactive 10-Stage 100-Module Curriculum Explorer */}
            <PortalStageExplorer
              stages={catalog.stages}
              modules={catalog.modules as any}
              progressMap={JSON.parse(JSON.stringify(Object.fromEntries(progressMap)))}
              completedSet={Array.from(completedSet)}
              nextModule={nextModule}
            />

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
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span className="status-badge-completed">Verified Student</span>
                  <a
                    href="/auth/signout"
                    className="button button-quiet button-small"
                    style={{
                      textDecoration: "none",
                      color: "#ef4444",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    🚪 Sign out
                  </a>
                </div>
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
