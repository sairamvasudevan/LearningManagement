import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { getCurrentIdentity } from "@/lib/auth";
import {
  LSRW_CURRICULUM_MODULES,
  COMMUNICATION_PRACTICE_BANK,
  CORPORATE_MOCK_ASSESSMENT,
} from "@/lib/communication-data";
import {
  getUserCommunicationSubmissions,
  getUserCompletedCommunicationExerciseIds,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CommunicationOverviewPage() {
  const identity = await getCurrentIdentity();
  const submissions = identity ? getUserCommunicationSubmissions(identity.id) : [];
  const completedIds = identity ? getUserCompletedCommunicationExerciseIds(identity.id) : new Set<string>();
  const mockSubmissions = submissions.filter((s) => s.mode === "assessment");
  const bestVersant = mockSubmissions.length
    ? Math.max(...mockSubmissions.map((s) => s.overall_score))
    : null;
  const latestCefr = mockSubmissions[0]?.cefr_level || null;

  return (
    <>
      <SiteHeader signedIn={Boolean(identity)} admin={identity?.role === "admin"} />
      <main className="portal-container" style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 20px 64px" }}>
        {/* Hero Banner */}
        <section
          style={{
            background: "linear-gradient(135deg, #1a1033 0%, #0f172a 55%, #161617 100%)",
            borderRadius: "18px",
            padding: "36px 32px",
            border: "1px solid rgba(192, 132, 252, 0.3)",
            marginBottom: "28px",
          }}
        >
          <div style={{ maxWidth: "820px" }}>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
              <span
                style={{
                  background: "rgba(192, 132, 252, 0.16)",
                  color: "#d8b4fe",
                  border: "1px solid rgba(192, 132, 252, 0.35)",
                  fontSize: "11px",
                  fontWeight: 800,
                  padding: "3px 10px",
                  borderRadius: "99px",
                  textTransform: "uppercase",
                }}
              >
                🎙️ LSRW CORPORATE COMMUNICATION PLATFORM
              </span>
              <span
                style={{
                  background: "rgba(52, 211, 153, 0.14)",
                  color: "#34d399",
                  border: "1px solid rgba(52, 211, 153, 0.35)",
                  fontSize: "11px",
                  fontWeight: 800,
                  padding: "3px 10px",
                  borderRadius: "99px",
                }}
              >
                FREE TRACK · VERSANT &amp; METTL SVAR RUBRIC
              </span>
            </div>

            <h1 style={{ fontSize: "34px", fontWeight: 900, margin: "0 0 12px", color: "#f8fafc", letterSpacing: "-0.02em" }}>
              Master Listening, Speaking, Reading &amp; Writing for Top Tech Placements
            </h1>
            <p style={{ fontSize: "15.5px", color: "#cbd5e1", lineHeight: 1.65, margin: "0 0 22px" }}>
              Engineered after real corporate communication screening rounds used by <b>Accenture</b>,{" "}
              <b>Cognizant</b>, <b>TCS Digital/NQT</b>, <b>Amazon</b>, and <b>Deloitte</b> (Pearson Versant VEPT &amp;
              Mercer Mettl SpeechX / SVAR). Practice all 4 LSRW pillars and take timed 10-part mock assessments with
              instant heuristic verification (ready for plug-in AI ASR/LLM grading).
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/communication/studio?tab=practice" className="button button-cn-primary">
                🎯 Enter Practice Studio →
              </Link>
              <Link href="/communication/studio?tab=assessment" className="button button-quiet" style={{ borderColor: "#a855f7", color: "#e9d5ff" }}>
                🏆 Take 10-Part Mock Test
              </Link>
              <Link href="/communication/studio?tab=curriculum" className="button button-quiet">
                📚 Read 4 LSRW Modules
              </Link>
            </div>
          </div>
        </section>

        {/* Student Live Telemetry Bar */}
        {identity && (
          <div className="portal-metrics-grid" style={{ marginBottom: "28px" }}>
            <div className="portal-metric-card">
              <span className="metric-icon">🏆</span>
              <div>
                <div className="metric-val">{bestVersant !== null ? `${bestVersant} / 80` : "Not Taken"}</div>
                <div className="metric-label">Best Versant Scale Score</div>
              </div>
            </div>
            <div className="portal-metric-card">
              <span className="metric-icon">📊</span>
              <div>
                <div className="metric-val">{latestCefr || "Pending"}</div>
                <div className="metric-label">Latest CEFR Band</div>
              </div>
            </div>
            <div className="portal-metric-card">
              <span className="metric-icon">✅</span>
              <div>
                <div className="metric-val">
                  {completedIds.size} / {COMMUNICATION_PRACTICE_BANK.length}
                </div>
                <div className="metric-label">Practice Drills Mastered</div>
              </div>
            </div>
            <div className="portal-metric-card">
              <span className="metric-icon">📝</span>
              <div>
                <div className="metric-val">{submissions.length}</div>
                <div className="metric-label">Saved Evaluations</div>
              </div>
            </div>
          </div>
        )}

        {/* 4 LSRW Pillars Cards */}
        <section style={{ marginBottom: "32px" }}>
          <div style={{ marginBottom: "16px" }}>
            <span className="eyebrow">STRUCTURED LSRW CURRICULUM (4 MODULES + 12 DRILLS)</span>
            <h2 style={{ margin: "6px 0 4px", fontSize: "24px", color: "#f5f5f7" }}>
              What Top Companies Test &amp; How You Train
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "16px" }}>
            {LSRW_CURRICULUM_MODULES.map((mod) => (
              <div key={mod.id} className="surface-card" style={{ padding: "22px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "14px" }}>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 800, color: "#c084fc" }}>{mod.badge}</span>
                  <h3 style={{ margin: "6px 0 8px", fontSize: "17px", color: "#f5f5f7" }}>{mod.title}</h3>
                  <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#94a3b8", lineHeight: 1.55 }}>{mod.subtitle}</p>
                  <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12.5px", color: "#cbd5e1", lineHeight: 1.6 }}>
                    {mod.whatTestsMeasure.slice(0, 2).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <Link href={`/communication/studio?tab=practice&skill=${mod.skill}`} className="button button-cn-primary button-small">
                    Practice {mod.skill.toUpperCase()} →
                  </Link>
                  <Link href="/communication/studio?tab=curriculum" className="button button-quiet button-small">
                    Study Strategy
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Corporate Rubric Matrix */}
        <section className="surface-card" style={{ padding: "26px" }}>
          <span className="eyebrow" style={{ color: "#34d399" }}>EVALUATION ARCHITECTURE (VERSANT 20–80 &amp; CEFR)</span>
          <h2 style={{ margin: "6px 0 10px", fontSize: "22px", color: "#f5f5f7" }}>
            How {CORPORATE_MOCK_ASSESSMENT.title} Grades You
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "13.5px", lineHeight: 1.6, marginBottom: "18px" }}>
            Every drill and mock test computes deterministic rubric telemetry across the 4 official corporate scoring dimensions (Heuristic Engine v1 today; drop-in compatible with Whisper/Gemini AI verification later):
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
            {[
              { name: "Sentence Mastery (30%)", desc: "Clause syntax, scrambled builds, tense/plural consistency, and error-free grammar." },
              { name: "Vocabulary (25%)", desc: "Workplace lexical diversity, cloze prepositions, and key domain concepts." },
              { name: "Fluency & Coherence (25%)", desc: "Response pacing (WPM), transition structure (STAR/PREP), and zero filler words." },
              { name: "Delivery & Clarity (20%)", desc: "Token accuracy (WER), spelling/punctuation hygiene, and speech confidence." },
            ].map((dim) => (
              <div key={dim.name} style={{ background: "#111113", border: "1px solid var(--border-subtle)", borderRadius: "12px", padding: "14px" }}>
                <div style={{ fontWeight: 700, fontSize: "14px", color: "#f5f5f7", marginBottom: "4px" }}>{dim.name}</div>
                <p style={{ margin: 0, fontSize: "12.5px", color: "#94a3b8", lineHeight: 1.5 }}>{dim.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
