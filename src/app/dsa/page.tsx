import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { DSA_PROBLEMS } from "@/lib/dsa-problems";
import { getCurrentIdentity } from "@/lib/auth";
import { getUserSolvedDsaProblemIds } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DsaCoursePage() {
  const identity = await getCurrentIdentity();
  const userId = identity?.id || "";
  const solvedIds = userId ? Array.from(getUserSolvedDsaProblemIds(userId)) : [];
  const solvedSet = new Set(solvedIds);

  const totalProblems = DSA_PROBLEMS.length;
  const easyCount = DSA_PROBLEMS.filter((p) => p.difficulty === "Easy").length;
  const mediumCount = DSA_PROBLEMS.filter((p) => p.difficulty === "Medium").length;
  const hardCount = DSA_PROBLEMS.filter((p) => p.difficulty === "Hard").length;

  return (
    <>
      <SiteHeader signedIn={!!identity} />
      <main className="portal-container" style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 20px" }}>
        {/* Course Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            borderRadius: "16px",
            padding: "36px 32px",
            color: "#ffffff",
            marginBottom: "32px",
            position: "relative",
            overflow: "hidden",
            border: "1px solid #334155",
          }}
        >
          <div style={{ maxWidth: "780px" }}>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
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
                ⚡ Live Multi-Language Compiler
              </span>
              <span
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  color: "#e2e8f0",
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "99px",
                }}
              >
                C · C++17 · Java 17 · Python 3
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
                100% Free Arena
              </span>
            </div>
            <h1 style={{ fontSize: "32px", fontWeight: 900, margin: "0 0 12px", letterSpacing: "-0.02em" }}>
              DSA CodeStudio: Algorithmic Coding Arena
            </h1>
            <p style={{ fontSize: "16px", color: "#94a3b8", lineHeight: 1.6, margin: "0 0 24px" }}>
              Practice core data structures and algorithmic patterns directly in your browser. Write code in
              <b> C, C++, Java, or Python</b>, execute against test cases on a dedicated native sandbox, and
              verify algorithmic correctness.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link
                href={`/dsa/${DSA_PROBLEMS[0].id}`}
                className="button button-cn-primary"
                style={{ padding: "12px 24px", fontSize: "14px", fontWeight: 700 }}
              >
                Start Coding: {DSA_PROBLEMS[0].title} →
              </Link>
              <Link
                href="/portal"
                className="button button-outline"
                style={{ color: "#ffffff", borderColor: "#475569", padding: "12px 24px" }}
              >
                Return to Problem Solving Lab
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-normal)",
              borderRadius: "14px",
              padding: "20px",
            }}
          >
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>Total Problems</div>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-primary)", marginTop: "4px" }}>
              {totalProblems}
            </div>
          </div>
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-normal)",
              borderRadius: "14px",
              padding: "20px",
            }}
          >
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>Solved by You</div>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--apple-green)", marginTop: "4px" }}>
              {solvedSet.size} / {totalProblems}
            </div>
          </div>
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-normal)",
              borderRadius: "14px",
              padding: "20px",
            }}
          >
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>Difficulty Breakdown</div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginTop: "8px" }}>
              <span style={{ color: "var(--apple-green)" }}>{easyCount} Easy</span> ·{" "}
              <span style={{ color: "var(--apple-amber)" }}>{mediumCount} Medium</span> ·{" "}
              <span style={{ color: "var(--apple-red)" }}>{hardCount} Hard</span>
            </div>
          </div>
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-normal)",
              borderRadius: "14px",
              padding: "20px",
            }}
          >
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>Supported Runtimes</div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--apple-blue-accent)", marginTop: "8px" }}>
              Clang (C/C++) · JDK 17 · Python 3
            </div>
          </div>
        </div>

        {/* Problems Table */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-normal)",
            borderRadius: "14px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid var(--border-normal)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ fontSize: "18px", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
              Curated Interview DSA Problem Bank
            </h2>
            <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 600 }}>
              {totalProblems} Practice Challenges Available
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="clean-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th style={{ width: "60px", textAlign: "center" }}>Status</th>
                  <th>Problem Title</th>
                  <th>Topic</th>
                  <th>Difficulty</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {DSA_PROBLEMS.map((prob, idx) => {
                  const isSolved = solvedSet.has(prob.id);

                  return (
                    <tr key={prob.id}>
                      <td style={{ textAlign: "center" }}>
                        {isSolved ? (
                          <span style={{ color: "#10b981", fontWeight: 800, fontSize: "16px" }}>✓</span>
                        ) : (
                          <span style={{ color: "var(--apple-blue-accent)", fontSize: "14px" }}>○</span>
                        )}
                      </td>
                      <td>
                        <Link
                          href={`/dsa/${prob.id}`}
                          style={{ fontWeight: 700, color: "var(--text-primary)", textDecoration: "none" }}
                        >
                          {idx + 1}. {prob.title}
                        </Link>
                      </td>
                      <td>
                        <span className="tag-pill" style={{ background: "#f1f5f9", color: "#475569" }}>
                          {prob.topic}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`dsa-diff-pill ${
                            prob.difficulty === "Easy"
                              ? "diff-easy"
                              : prob.difficulty === "Medium"
                                ? "diff-medium"
                                : "diff-hard"
                          }`}
                        >
                          {prob.difficulty}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <Link
                          href={`/dsa/${prob.id}`}
                          className={`button button-small ${
                            isSolved
                              ? "button-outline"
                              : "button-cn-primary"
                          }`}
                          style={{
                            fontSize: "11px",
                            padding: "6px 12px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {isSolved ? "Solve Again" : "Solve Challenge →"}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
