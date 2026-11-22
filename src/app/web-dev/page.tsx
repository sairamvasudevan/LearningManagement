import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { WEB_DEV_LESSONS, WebDevTrack } from "@/lib/web-dev-data";
import { getCurrentIdentity } from "@/lib/auth";
import { checkCourseAccess } from "@/lib/course-prerequisites";
import { PrerequisiteLockBanner } from "@/components/prerequisite-lock";

export const dynamic = "force-dynamic";

export default async function WebDevCoursePage() {
  const identity = await getCurrentIdentity();
  const access = checkCourseAccess(identity?.id, "web-dev-mern-lab");

  const tracks: { name: WebDevTrack; label: string; count: number; color: string; desc: string }[] = [
    {
      name: "HTML",
      label: "HTML5 Foundations",
      count: WEB_DEV_LESSONS.filter((l) => l.track === "HTML").length,
      color: "#e34c26",
      desc: "Document skeleton, headings, links, images, tables, lists, landmarks, forms, and native validation.",
    },
    {
      name: "CSS",
      label: "Modern CSS3 & Layouts",
      count: WEB_DEV_LESSONS.filter((l) => l.track === "CSS").length,
      color: "#38bdf8",
      desc: "Box model, selectors, modern flexbox alignment, card grids, CSS grid, and responsive media queries.",
    },
    {
      name: "JavaScript",
      label: "JavaScript ES6+ & DOM",
      count: WEB_DEV_LESSONS.filter((l) => l.track === "JavaScript").length,
      color: "#facc15",
      desc: "Variables, functions, DOM selection, interactive state, Promises, and the async/await Fetch API.",
    },
    {
      name: "React",
      label: "React Component UI",
      count: WEB_DEV_LESSONS.filter((l) => l.track === "React").length,
      color: "#61dafb",
      desc: "Declarative component architecture, props passing, and dynamic useState hook reactivity.",
    },
    {
      name: "MERN Stack",
      label: "Full MERN Stack Pipeline",
      count: WEB_DEV_LESSONS.filter((l) => l.track === "MERN Stack").length,
      color: "#10b981",
      desc: "Node.js & Express REST APIs, MongoDB Mongoose document collections, and full stack integration.",
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
          <div style={{ maxWidth: "840px" }}>
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
                ⚡ W3Schools + GUVI Architecture
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
                Try-It-Yourself Sandbox &amp; Interactive Lab
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
                26 Structured Chapters · 100% Free
              </span>
            </div>

            <h1 style={{ fontSize: "34px", fontWeight: 900, margin: "0 0 14px", letterSpacing: "-0.02em" }}>
              Full-Stack Web Development &amp; MERN Lab
            </h1>
            <p style={{ fontSize: "16px", color: "#cbd5e1", lineHeight: 1.6, margin: "0 0 24px" }}>
              Engineered following the world-class learning patterns of <b>W3Schools</b> and <b>GUVI</b>: step-by-step
              conceptual tutorials, instant <b>"Try it Yourself"</b> live sandbox experiments, chapter self-tests, and
              hands-on <b>coding challenges</b> with automated DOM test suites.
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link
                href={`/web-dev/${WEB_DEV_LESSONS[0].id}`}
                className="button button-cn-primary"
                style={{ padding: "12px 24px", fontSize: "14px", fontWeight: 700 }}
              >
                Start Chapter #1: {WEB_DEV_LESSONS[0].title} →
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

        {/* Prerequisite Lock Banner */}
        <PrerequisiteLockBanner
          access={access}
          courseTitle="Full-Stack Web Development & MERN Lab"
          firstPartLabel="Chapter 01 (HTML5 Skeleton)"
          previewUrl="/web-dev/html-intro"
        />

        {/* Track Roadmap Overview Cards */}
        <div style={{ marginBottom: "36px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 16px", color: "#f8fafc" }}>
            Curriculum Tracks &amp; Specializations
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: "16px",
            }}
          >
            {tracks.map((t) => (
              <div
                key={t.name}
                style={{
                  background: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: "12px",
                  padding: "20px",
                  borderTop: `4px solid ${t.color}`,
                }}
              >
                <div style={{ fontSize: "12px", fontWeight: 800, color: t.color, marginBottom: "6px" }}>
                  {t.count} CHAPTERS
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 8px", color: "#f1f5f9" }}>
                  {t.label}
                </h3>
                <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.5, margin: "0 0 14px" }}>
                  {t.desc}
                </p>
                <Link
                  href={`#track-${t.name.toLowerCase().replace(" ", "-")}`}
                  style={{ fontSize: "12px", color: t.color, fontWeight: 700, textDecoration: "none" }}
                >
                  View Chapters ↓
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Grouped Chapters by Track */}
        <div>
          {tracks.map((t) => {
            const trackLessons = WEB_DEV_LESSONS.filter((l) => l.track === t.name);
            return (
              <div
                key={t.name}
                id={`track-${t.name.toLowerCase().replace(" ", "-")}`}
                style={{ marginBottom: "40px" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                    borderBottom: "1px solid #1e293b",
                    paddingBottom: "10px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span
                      style={{
                        background: t.color,
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        display: "inline-block",
                      }}
                    />
                    <h3 style={{ fontSize: "20px", fontWeight: 800, margin: 0, color: "#f8fafc" }}>
                      {t.label} ({trackLessons.length} Chapters)
                    </h3>
                  </div>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                    Try-It Sandbox · Mini-Quiz · Coding Challenge
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {trackLessons.map((lesson) => {
                    const isPreview = lesson.id === "html-intro";
                    const isLocked = access.isLocked && !isPreview;

                    return (
                      <div
                        key={lesson.id}
                        style={{
                          background: isLocked ? "#0b1120" : "#0f172a",
                          border: isLocked ? "1px dashed #334155" : isPreview ? "1px solid #38bdf8" : "1px solid #1e293b",
                          borderRadius: "10px",
                          padding: "16px 20px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "14px",
                          opacity: isLocked ? 0.78 : 1,
                        }}
                      >
                        <div style={{ maxWidth: "800px" }}>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                            {isPreview && (
                              <span
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 800,
                                  padding: "2px 8px",
                                  borderRadius: "4px",
                                  background: "#0284c7",
                                  color: "#ffffff",
                                }}
                              >
                                👁️ Open Free Preview
                              </span>
                            )}
                            {isLocked && (
                              <span
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 800,
                                  padding: "2px 8px",
                                  borderRadius: "4px",
                                  background: "#475569",
                                  color: "#cbd5e1",
                                }}
                              >
                                🔒 Prerequisite Locked
                              </span>
                            )}
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
                              Chapter #{lesson.number} · ⏱ ~{lesson.estimatedMinutes} mins · {lesson.requirements.length} Test Cases
                            </span>
                          </div>

                          <h4 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 4px", color: isLocked ? "#cbd5e1" : "#f8fafc" }}>
                            {isLocked && <span style={{ marginRight: 6 }}>🔒</span>}
                            {lesson.title}
                          </h4>

                          <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8", lineHeight: 1.5 }}>
                            {lesson.objective}
                          </p>
                        </div>

                        <div>
                          <Link
                            href={`/web-dev/${lesson.id}`}
                            className={isLocked ? "button button-dark" : "button button-cn-primary"}
                            style={{
                              padding: "8px 18px",
                              fontSize: "12px",
                              fontWeight: 700,
                              whiteSpace: "nowrap",
                              borderColor: isLocked ? "#475569" : undefined,
                              color: isLocked ? "#94a3b8" : undefined,
                            }}
                          >
                            {isPreview ? "Start Preview Sandbox ❯" : isLocked ? "🔒 Locked (Preview Only)" : "Open Sandbox & Challenge →"}
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
