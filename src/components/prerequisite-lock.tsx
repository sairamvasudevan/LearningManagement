import Link from "next/link";
import { CourseAccessStatus } from "@/lib/course-prerequisites";

export function PrerequisiteLockBanner({
  access,
  courseTitle,
  firstPartLabel = "Chapter 01",
  previewUrl,
}: {
  access: CourseAccessStatus;
  courseTitle: string;
  firstPartLabel?: string;
  previewUrl: string;
}) {
  if (!access.isLocked) return null;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)",
        border: "1px solid #4338ca",
        borderRadius: "12px",
        padding: "20px 24px",
        marginBottom: "28px",
        color: "#ffffff",
        boxShadow: "0 8px 24px rgba(67, 56, 202, 0.15)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ flex: "1 1 500px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span
              style={{
                background: "#f59e0b",
                color: "#000",
                fontSize: "11px",
                fontWeight: 900,
                padding: "3px 8px",
                borderRadius: "99px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              🔒 Prerequisite Enforced
            </span>
            <span style={{ fontSize: "12px", color: "#c7d2fe", fontWeight: 700 }}>
              100-Hour Problem Solving Foundation Required
            </span>
          </div>

          <h3 style={{ fontSize: "18px", fontWeight: 800, margin: "0 0 6px", color: "#ffffff" }}>
            {courseTitle} is Locked to Full Study
          </h3>
          <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.6, margin: "0 0 12px" }}>
            To ensure rigorous technical preparation, students must complete and master the <b>100-Hour Problem Solving Lab</b> before advancing to this track. You can open and study <b>{firstPartLabel} (Free Preview)</b>, while subsequent modules unlock automatically upon completing the foundation.
          </p>

          {/* Progress bar */}
          <div style={{ maxWidth: "420px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 700, color: "#cbd5e1", marginBottom: "4px" }}>
              <span>Problem Solving Lab Progress:</span>
              <span style={{ color: "#38bdf8" }}>{access.completedModulesCount} / {access.totalRequiredModules} Modules ({access.percentageCompleted}%)</span>
            </div>
            <div style={{ height: "6px", background: "rgba(255, 255, 255, 0.15)", borderRadius: "99px", overflow: "hidden" }}>
              <div
                style={{
                  width: `${Math.max(4, access.percentageCompleted)}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #ff6a00, #38bdf8)",
                  borderRadius: "99px",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0 }}>
          <Link
            href="/portal"
            className="button button-cn-primary"
            style={{ fontSize: "13px", padding: "10px 18px", fontWeight: 700, whiteSpace: "nowrap" }}
          >
            👉 Complete 100-Hour Lab →
          </Link>
          <Link
            href={previewUrl}
            className="button button-quiet"
            style={{ fontSize: "12px", color: "#c7d2fe", borderColor: "#4338ca", whiteSpace: "nowrap" }}
          >
            👁️ Open {firstPartLabel} Preview
          </Link>
        </div>
      </div>
    </div>
  );
}

export function PrerequisiteLockScreen({
  access,
  courseTitle,
  lessonTitle,
  firstPartLabel = "Chapter 01",
  previewUrl,
  syllabusUrl,
}: {
  access: CourseAccessStatus;
  courseTitle: string;
  lessonTitle: string;
  firstPartLabel?: string;
  previewUrl: string;
  syllabusUrl: string;
}) {
  return (
    <main
      style={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        background: "radial-gradient(ellipse at top, #1e1b4b 0%, #090d16 100%)",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          maxWidth: "640px",
          width: "100%",
          background: "#0f172a",
          border: "1px solid #334155",
          borderRadius: "16px",
          padding: "36px 32px",
          textAlign: "center",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.4)",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            background: "rgba(245, 158, 11, 0.15)",
            border: "1px solid #f59e0b",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            margin: "0 auto 20px",
          }}
        >
          🔒
        </div>

        <span
          style={{
            background: "#f59e0b",
            color: "#000",
            fontSize: "11px",
            fontWeight: 900,
            padding: "4px 12px",
            borderRadius: "99px",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            display: "inline-block",
            marginBottom: "12px",
          }}
        >
          Module Locked · Prerequisite Required
        </span>

        <h1 style={{ fontSize: "24px", fontWeight: 800, margin: "0 0 8px", color: "#ffffff" }}>
          {lessonTitle}
        </h1>
        <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 20px" }}>
          Part of: <strong style={{ color: "#94a3b8" }}>{courseTitle}</strong>
        </p>

        <div
          style={{
            background: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "left",
            marginBottom: "24px",
          }}
        >
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#e2e8f0", marginBottom: "6px" }}>
            Foundation Course Prerequisite
          </div>
          <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.6, margin: "0 0 16px" }}>
            Under institutional curriculum rules, advanced coding labs unlock only after mastering the 100-Hour Flagship <b>Problem Solving Lab</b>. You can review the course syllabus or study the <b>{firstPartLabel} preview</b>.
          </p>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>
            <span style={{ color: "#cbd5e1" }}>Your Problem Solving Lab Progress:</span>
            <span style={{ color: "#38bdf8" }}>{access.completedModulesCount} of {access.totalRequiredModules} Modules Mastered ({access.percentageCompleted}%)</span>
          </div>

          <div style={{ height: "8px", background: "#0f172a", borderRadius: "99px", overflow: "hidden" }}>
            <div
              style={{
                width: `${Math.max(4, access.percentageCompleted)}%`,
                height: "100%",
                background: "linear-gradient(90deg, #ff6a00, #38bdf8)",
                borderRadius: "99px",
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link
            href="/portal"
            className="button button-cn-primary button-full"
            style={{ fontSize: "14px", padding: "12px 24px", fontWeight: 700 }}
          >
            👉 Continue Problem Solving Lab (100h) →
          </Link>
          <div style={{ display: "flex", gap: "10px" }}>
            <Link
              href={previewUrl}
              className="button button-quiet"
              style={{ flex: 1, fontSize: "13px", color: "#c7d2fe" }}
            >
              👁️ Open {firstPartLabel} Preview
            </Link>
            <Link
              href={syllabusUrl}
              className="button button-quiet"
              style={{ flex: 1, fontSize: "13px", color: "#94a3b8" }}
            >
              📋 Course Syllabus
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
