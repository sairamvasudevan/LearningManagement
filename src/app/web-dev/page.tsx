import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { WEB_DEV_LESSONS } from "@/lib/web-dev-data";
import { getCurrentIdentity } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function WebDevCoursePage() {
  const identity = await getCurrentIdentity();

  const totalLessons = WEB_DEV_LESSONS.length;
  const phases = [
    {
      number: 1,
      title: "Phase 1: HTML5 Foundations & Semantics",
      description: "Semantic landmark architecture, accessible form controls, and validation.",
      color: "#e34c26",
    },
    {
      number: 2,
      title: "Phase 2: Modern CSS3 & Responsive Layouts",
      description: "Flexbox alignment, flex-wrap grids, fluid responsive design, and CSS variables.",
      color: "#38bdf8",
    },
    {
      number: 3,
      title: "Phase 3: JavaScript ES6+, DOM Manipulation & Async",
      description: "DOM selection, event delegation, state mutation, Promises, and the Fetch API.",
      color: "#facc15",
    },
    {
      number: 4,
      title: "Phase 4: Frontend & Full MERN Architecture",
      description: "React component lifecycles, Express REST APIs, and MongoDB document schemas.",
      color: "#10b981",
    },
  ];

  return (
    <>
      <SiteHeader signedIn={!!identity} />
      <main className="portal-container" style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 20px" }}>
        {/* Course Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, #091224 0%, #172554 50%, #0f172a 100%)",
            borderRadius: "16px",
            padding: "36px 32px",
            color: "#ffffff",
            marginBottom: "36px",
            position: "relative",
            overflow: "hidden",
            border: "1px solid #1e3a8a",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div style={{ maxWidth: "820px" }}>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
              <span
                style={{
                  background: "#ff6a00",
                  color: "#ffffff",
                  fontSize: "11px",
                  fontWeight: 800,
                  padding: "4px 10px",
                  borderRadius: "99px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                ⚡ Live HTML · CSS · JS Editor &amp; Sandbox
              </span>
              <span
                style={{
                  background: "rgba(56, 189, 248, 0.2)",
                  color: "#7dd3fc",
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "99px",
                }}
              >
                MERN Stack Pathway
              </span>
              <span
                style={{
                  background: "rgba(16, 185, 129, 0.2)",
                  color: "#34d399",
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "99px",
                }}
              >
                Automated DOM Grading Suite
              </span>
            </div>

            <h1 style={{ fontSize: "34px", fontWeight: 900, margin: "0 0 14px", letterSpacing: "-0.02em" }}>
              Full-Stack Web Development &amp; MERN Lab
            </h1>
            <p style={{ fontSize: "16px", color: "#cbd5e1", lineHeight: 1.6, margin: "0 0 24px" }}>
              Step-by-step guidance from semantic HTML, CSS layout systems, and modern JavaScript to
              component-driven React and full-stack MERN (MongoDB, Express, React, Node.js). Practice in our
              embedded live editor, view instant sandbox execution, and verify requirements with automated tests.
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link
                href={`/web-dev/${WEB_DEV_LESSONS[0].id}`}
                className="button button-cn-primary"
                style={{ padding: "12px 24px", fontSize: "14px", fontWeight: 700 }}
              >
                Start Lesson #1: {WEB_DEV_LESSONS[0].title} →
              </Link>
              <Link
                href="/dsa"
                className="button button-outline"
                style={{ color: "#ffffff", borderColor: "#475569", padding: "12px 24px" }}
              >
                DSA CodeStudio Arena
              </Link>
              <Link
                href="/portal"
                className="button button-outline"
                style={{ color: "#ffffff", borderColor: "#475569", padding: "12px 24px" }}
              >
                Problem Solving Lab
              </Link>
            </div>
          </div>
        </div>

        {/* Phase Tracks Overview */}
        <div style={{ marginBottom: "36px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 16px", color: "#f8fafc" }}>
            The Full MERN Learning Roadmap
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "16px",
            }}
          >
            {phases.map((phase) => {
              const phaseLessons = WEB_DEV_LESSONS.filter((l) => l.phaseNumber === phase.number);
              return (
                <div
                  key={phase.number}
                  style={{
                    background: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: "12px",
                    padding: "20px",
                    borderTop: `4px solid ${phase.color}`,
                  }}
                >
                  <div style={{ fontSize: "12px", fontWeight: 800, color: phase.color, marginBottom: "6px" }}>
                    TRACK {phase.number}
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 8px", color: "#f1f5f9" }}>
                    {phase.title}
                  </h3>
                  <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.5, margin: "0 0 14px" }}>
                    {phase.description}
                  </p>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    {phaseLessons.length} Practice Labs · In-Browser Coding
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lessons List Grid */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 800, margin: 0, color: "#f8fafc" }}>
              Interactive Practice Exercises ({totalLessons})
            </h2>
            <span style={{ fontSize: "13px", color: "#94a3b8" }}>
              All lessons feature working starter code, live preview sandbox, and automated tests
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {WEB_DEV_LESSONS.map((lesson) => (
              <div
                key={lesson.id}
                style={{
                  background: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: "12px",
                  padding: "20px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "16px",
                  transition: "border-color 0.2s ease",
                }}
              >
                <div style={{ maxWidth: "800px" }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "4px",
                        background:
                          lesson.difficulty === "Beginner"
                            ? "#065f46"
                            : lesson.difficulty === "Intermediate"
                            ? "#854d0e"
                            : "#991b1b",
                        color: "#f8fafc",
                      }}
                    >
                      {lesson.difficulty}
                    </span>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                      Phase {lesson.phaseNumber}: {lesson.phase}
                    </span>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>
                      · ⏱ ~{lesson.estimatedMinutes} mins · {lesson.requirements.length} checks
                    </span>
                  </div>

                  <h3 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 6px", color: "#f8fafc" }}>
                    Lesson #{lesson.number}: {lesson.title}
                  </h3>

                  <p style={{ margin: 0, fontSize: "14px", color: "#94a3b8", lineHeight: 1.5 }}>
                    {lesson.objective}
                  </p>
                </div>

                <div>
                  <Link
                    href={`/web-dev/${lesson.id}`}
                    className="button button-cn-primary"
                    style={{ padding: "10px 20px", fontSize: "13px", fontWeight: 700, whiteSpace: "nowrap" }}
                  >
                    Open Live Sandbox →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
