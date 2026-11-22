import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import {
  CurriculumExplorer,
  PedagogySection,
  ComparisonSection,
  RolePreviewTabs,
  FaqAccordion,
  HeroTryChallenge,
} from "@/components/home-interactive";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { PLATFORM_NAME, PLATFORM_SUBTITLE } from "@/lib/courses";

const HIRING_BENCHMARKS = [
  { name: "Google", tag: "FAANG", icon: "🌐" },
  { name: "Microsoft", tag: "Tier 1", icon: "💻" },
  { name: "Amazon", tag: "FAANG", icon: "📦" },
  { name: "Meta", tag: "FAANG", icon: "♾️" },
  { name: "Uber", tag: "Product", icon: "🚗" },
  { name: "Atlassian", tag: "Global", icon: "🔷" },
  { name: "Swiggy", tag: "High Scale", icon: "🚀" },
  { name: "Goldman Sachs", tag: "FinTech", icon: "🏛️" },
];

export default function HomePage() {
  const hasSupabase = isSupabaseConfigured();

  return (
    <>
      <SiteHeader />

      {/* 1. FUTURISTIC HERO SECTION */}
      <section className="futuristic-hero">
        <div className="hero-glow-orb-1" />
        <div className="hero-glow-orb-2" />

        <div className="ed-container" style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          {/* Status Badge */}
          <div className="futuristic-kicker">
            <span className="kicker-dot" />
            <span>NEXUS ENGINE v2.6 · AUTONOMOUS TECHNICAL TRAINING SYSTEM · ₹0 SCHOLARSHIP</span>
          </div>

          {/* Headline */}
          <h1 className="hero-headline">
            <span className="hero-headline-gradient">Architect Real Engineering Intuition.</span>
            <span className="hero-headline-accent">From Algorithmic Invariants to Full-Stack Systems.</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            A precision-engineered technical training ground for university students and placement candidates.
            Master 100 hours of language-independent problem solving, execute live code across 150+ algorithms,
            and build production full-stack systems with real-time test case verification.
          </p>

          {/* Action Row */}
          <div className="hero-action-row">
            <a href="#training-modules" className="btn-cyber-primary">
              <span>🚀 Launch Training Modules</span>
              <span>↓</span>
            </a>
            <Link href="/ide" className="btn-cyber-secondary">
              <span>💻 Open Online Cloud IDE</span>
              <span>↗</span>
            </Link>
            <Link href="/courses/problem-solving-lab" className="btn-cyber-secondary" style={{ color: "#38bdf8" }}>
              <span>🎧 Listen with Audio Narrator</span>
            </Link>
          </div>

          {/* System Telemetry Metrics */}
          <div className="hero-telemetry-strip">
            <div className="telemetry-item">
              <span className="telemetry-num">100 Modules</span>
              <span className="telemetry-label">Curriculum Scope</span>
              <span className="telemetry-sub">10 progressive stages</span>
            </div>
            <div className="telemetry-item">
              <span className="telemetry-num">150+ Katas</span>
              <span className="telemetry-label">DSA Code Bank</span>
              <span className="telemetry-sub">C++, Java, Python, C</span>
            </div>
            <div className="telemetry-item">
              <span className="telemetry-num">80% Gate</span>
              <span className="telemetry-label">Mastery Verification</span>
              <span className="telemetry-sub">Cognitive progression</span>
            </div>
            <div className="telemetry-item">
              <span className="telemetry-num" style={{ color: "#22d3ee" }}>₹0 Free</span>
              <span className="telemetry-label">Full Scholarship</span>
              <span className="telemetry-sub">Zero tuition barrier</span>
            </div>
          </div>

          {/* Interactive Futuristic Sandbox Preview */}
          <div style={{ marginTop: "48px", maxWidth: "1080px", marginLeft: "auto", marginRight: "auto" }}>
            <HeroTryChallenge />
          </div>
        </div>
      </section>

      {/* 2. CORE TRAINING MODULES SYSTEM HUB (THE HEART OF THE PLATFORM) */}
      <section id="training-modules" className="training-modules-section">
        <div className="ed-container">
          <div className="system-section-head">
            <span className="system-eyebrow">Precision Engineering Matrix</span>
            <h2 className="system-section-title">Core Training Modules</h2>
            <p className="system-section-desc">
              Four unified training surfaces engineered to transition students from raw algorithmic reasoning
              to interview problem solving and production full-stack deployment.
            </p>
          </div>

          <div className="training-modules-grid">
            {/* Module 01: Flagship 100-Hour Lab */}
            <article className="training-module-card featured-card">
              <div className="training-card-header">
                <div className="training-card-icon-box" style={{ background: "rgba(99, 102, 241, 0.2)", color: "#818cf8" }}>
                  📐
                </div>
                <span className="training-card-pill pill-indigo">MODULE 01 · FLAGSHIP FOUNDATION</span>
              </div>

              <h3 className="training-card-title">100-Hour Problem Solving Lab</h3>
              <div className="training-card-subtitle">Language-Independent Algorithmic Modeling &amp; Invariant Proofs</div>
              <p className="training-card-desc">
                Construct rigorous mental models from scratch. Learn requirement extraction, state invariants,
                asymptotic bounds, worked real-world case studies, and automated audio readout.
              </p>

              <div className="training-card-specs-row">
                <div className="spec-chip">
                  <b>100 Modules</b>
                  <span>10 Sequential Stages</span>
                </div>
                <div className="spec-chip">
                  <b>80% Mastery Gate</b>
                  <span>No Skipping Ahead</span>
                </div>
                <div className="spec-chip">
                  <b>Text-to-Speech</b>
                  <span>Voice Audio Narrator</span>
                </div>
                <div className="spec-chip">
                  <b style={{ color: "#34d399" }}>100% Free (₹0)</b>
                  <span>Active Scholarship</span>
                </div>
              </div>

              <div className="training-card-action-row">
                <Link href="/courses/problem-solving-lab" className="training-card-btn btn-launch-indigo">
                  <span>Enter 100h Lab</span>
                  <span>→</span>
                </Link>
                <Link href="/courses/problem-solving-lab" className="card-secondary-link">
                  View Complete Syllabus ↗
                </Link>
              </div>
            </article>

            {/* Module 02: DSA Arena */}
            <article className="training-module-card">
              <div className="training-card-header">
                <div className="training-card-icon-box" style={{ background: "rgba(6, 182, 212, 0.2)", color: "#22d3ee" }}>
                  ⚔️
                </div>
                <span className="training-card-pill pill-cyan">MODULE 02 · INTERVIEW ARENA</span>
              </div>

              <h3 className="training-card-title">Placement DSA Arena</h3>
              <div className="training-card-subtitle">Curated Algorithmic Problem Bank with Live Execution Engine</div>
              <p className="training-card-desc">
                Solve battle-tested coding interview questions. Compile and test in C++, Java, Python 3, or C
                with automated test case suites, diff inspection, and memory/runtime benchmarks.
              </p>

              <div className="training-card-specs-row">
                <div className="spec-chip">
                  <b>150+ Questions</b>
                  <span>Easy · Medium · Hard</span>
                </div>
                <div className="spec-chip">
                  <b>4 Runtimes</b>
                  <span>C++, Java 21, Python, C</span>
                </div>
                <div className="spec-chip">
                  <b>Instant Submissions</b>
                  <span>Sub-millisecond test suites</span>
                </div>
                <div className="spec-chip">
                  <b style={{ color: "#22d3ee" }}>Live Verification</b>
                  <span>Diff inspection engine</span>
                </div>
              </div>

              <div className="training-card-action-row">
                <Link href="/dsa" className="training-card-btn btn-launch-cyan">
                  <span>Enter DSA Arena</span>
                  <span>→</span>
                </Link>
                <Link href="/dsa/two-sum" className="card-secondary-link">
                  Solve Two Sum ↗
                </Link>
              </div>
            </article>

            {/* Module 03: Full-Stack Web Dev Studio */}
            <article className="training-module-card">
              <div className="training-card-header">
                <div className="training-card-icon-box" style={{ background: "rgba(16, 185, 129, 0.2)", color: "#34d399" }}>
                  🌐
                </div>
                <span className="training-card-pill pill-green">MODULE 03 · PRODUCTION ENGINEERING</span>
              </div>

              <h3 className="training-card-title">Full-Stack Web Dev &amp; MERN Studio</h3>
              <div className="training-card-subtitle">W3Schools &amp; GUVI WebKata Style Interactive Sandbox</div>
              <p className="training-card-desc">
                Master modern semantic HTML5, Flexbox/Grid CSS, asynchronous JavaScript DOM scripting,
                and MERN full-stack architecture with live preview and automated assertions.
              </p>

              <div className="training-card-specs-row">
                <div className="spec-chip">
                  <b>30+ Chapters</b>
                  <span>HTML · CSS · JS · MERN</span>
                </div>
                <div className="spec-chip">
                  <b>Live DOM Sandbox</b>
                  <span>Isolated iframe preview</span>
                </div>
                <div className="spec-chip">
                  <b>Try-It Exercises</b>
                  <span>Hands-on WebKata katas</span>
                </div>
                <div className="spec-chip">
                  <b style={{ color: "#34d399" }}>Audio Narrator</b>
                  <span>Tutorial speech playback</span>
                </div>
              </div>

              <div className="training-card-action-row">
                <Link href="/web-dev" className="training-card-btn btn-launch-green">
                  <span>Enter Web Dev Lab</span>
                  <span>→</span>
                </Link>
                <Link href="/web-dev/html-intro" className="card-secondary-link">
                  Start HTML5 Chapter ↗
                </Link>
              </div>
            </article>

            {/* Module 04: Online Multi-Language Cloud IDE */}
            <article className="training-module-card">
              <div className="training-card-header">
                <div className="training-card-icon-box" style={{ background: "rgba(245, 158, 11, 0.2)", color: "#fbbf24" }}>
                  💻
                </div>
                <span className="training-card-pill pill-amber">MODULE 04 · DEVELOPER UTILITY</span>
              </div>

              <h3 className="training-card-title">Standalone Online Cloud IDE</h3>
              <div className="training-card-subtitle">High-Performance Compiler Scratchpad with Custom STDIN</div>
              <p className="training-card-desc">
                Quickly prototype logic, debug edge cases, or test standard input algorithms without local environment
                setup. Includes Scanner simulation, execution timings, and instant diagnostics.
              </p>

              <div className="training-card-specs-row">
                <div className="spec-chip">
                  <b>Multi-Language</b>
                  <span>C, C++, Java, Python, Web</span>
                </div>
                <div className="spec-chip">
                  <b>Custom STDIN</b>
                  <span>Interactive input streams</span>
                </div>
                <div className="spec-chip">
                  <b>Zero Setup</b>
                  <span>Browser-based runtimes</span>
                </div>
                <div className="spec-chip">
                  <b style={{ color: "#fbbf24" }}>Real-time I/O</b>
                  <span>Instant stdout &amp; stderr</span>
                </div>
              </div>

              <div className="training-card-action-row">
                <Link href="/ide" className="training-card-btn btn-launch-amber">
                  <span>Launch Cloud IDE</span>
                  <span>→</span>
                </Link>
                <Link href="/ide" className="card-secondary-link">
                  Open Blank Scratchpad ↗
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 3. PLACEMENT RECOGNITION BENCHMARKS */}
      <section style={{ padding: "40px 0 60px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <div className="ed-container" style={{ textAlign: "center" }}>
          <span style={{ font: "800 11px var(--font-mono)", color: "#818cf8", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "18px" }}>
            ENGINEERED TO MATCH TIER-1 PLACEMENT STANDARDS
          </span>
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            {HIRING_BENCHMARKS.map((company) => (
              <div
                key={company.name}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "99px",
                  padding: "6px 14px",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#cbd5e1",
                }}
              >
                <span>{company.icon}</span>
                <span>{company.name}</span>
                <span style={{ fontSize: "9px", color: "#22d3ee", background: "rgba(6, 182, 212, 0.15)", padding: "1px 6px", borderRadius: "99px" }}>
                  {company.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 10-STAGE SYSTEMATIC MASTERY ROADMAP */}
      <main className="ed-container ed-main-stack">
        <CurriculumExplorer />

        {/* 5. THE SCIENCE OF MASTERY LEARNING */}
        <PedagogySection />

        {/* 6. DIRECT COMPARISON MATRIX */}
        <ComparisonSection />

        {/* 7. DUAL-PORTAL SYSTEM (STUDENT VS ADMIN FACULTY) */}
        <RolePreviewTabs />

        {/* 8. FREQUENTLY ASKED QUESTIONS */}
        <FaqAccordion />

        {/* 9. FINAL CONVERSION BANNER */}
        <section
          style={{
            margin: "60px 0 20px",
            background: "linear-gradient(135deg, rgba(30, 27, 75, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)",
            border: "1px solid rgba(99, 102, 241, 0.4)",
            borderRadius: "24px",
            padding: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "24px",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6), 0 0 35px rgba(99, 102, 241, 0.15)",
          }}
        >
          <div style={{ maxWidth: "680px" }}>
            <span style={{ font: "800 10px var(--font-mono)", color: "#22d3ee", letterSpacing: "0.1em", textTransform: "uppercase", display: "inline-block", marginBottom: "8px" }}>
              ● 100% SCHOLARSHIP ENROLLMENT ACTIVE
            </span>
            <h2 style={{ font: "800 28px var(--font-display)", color: "#ffffff", margin: "0 0 8px", letterSpacing: "-0.03em" }}>
              Start Building Real Engineering Intuition Today.
            </h2>
            <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>
              Join thousands of students learning to think through algorithms systematically.
              Register in 60 seconds with zero credit card required.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link
              href="/register?course=problem-solving-lab"
              className="btn-cyber-primary"
              style={{ padding: "12px 24px" }}
            >
              Enroll Free (₹0) →
            </Link>
            <Link
              href="/login"
              className="btn-cyber-secondary"
              style={{ padding: "12px 20px" }}
            >
              Sign In to Portal
            </Link>
          </div>
        </section>
      </main>

      {/* 10. FUTURISTIC MULTI-COLUMN FOOTER */}
      <footer style={{ background: "#050914", borderTop: "1px solid rgba(255, 255, 255, 0.08)", padding: "48px 0 28px" }}>
        <div className="ed-container">
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: "32px", paddingBottom: "32px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #4f46e5, #06b6d4)", display: "grid", placeItems: "center", color: "#fff", fontSize: "15px" }}>
                  ⚡
                </div>
                <div>
                  <b style={{ font: "800 15px var(--font-display)", color: "#ffffff", letterSpacing: "-0.02em" }}>{PLATFORM_NAME}</b>
                  <small style={{ display: "block", font: "700 8.5px var(--font-mono)", color: "#22d3ee" }}>SYSTEM v2.6</small>
                </div>
              </div>
              <p style={{ fontSize: "12.5px", lineHeight: 1.65, color: "#94a3b8", margin: "0 0 16px", maxWidth: "320px" }}>
                A precision technical learning management platform designed for structured, mastery-gated
                engineering curricula and college placement transparency.
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ font: "700 9px var(--font-mono)", background: "rgba(99, 102, 241, 0.2)", color: "#818cf8", padding: "3px 8px", borderRadius: "99px" }}>
                  100% Free Flagship
                </span>
                <span style={{ font: "700 9px var(--font-mono)", background: "rgba(16, 185, 129, 0.2)", color: "#34d399", padding: "3px 8px", borderRadius: "99px" }}>
                  Zero Dependency TTS
                </span>
              </div>
            </div>

            <div>
              <h4 style={{ font: "800 11px var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase", color: "#e2e8f0", margin: "0 0 14px" }}>
                Training Modules
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "9px", fontSize: "12.5px", color: "#94a3b8" }}>
                <li><Link href="/courses/problem-solving-lab" style={{ color: "inherit", textDecoration: "none" }}>100-Hour Problem Solving Lab</Link></li>
                <li><Link href="/dsa" style={{ color: "inherit", textDecoration: "none" }}>Placement DSA Arena</Link></li>
                <li><Link href="/web-dev" style={{ color: "inherit", textDecoration: "none" }}>Web Dev &amp; MERN Studio</Link></li>
                <li><Link href="/ide" style={{ color: "inherit", textDecoration: "none" }}>Online Cloud IDE</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ font: "800 11px var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase", color: "#e2e8f0", margin: "0 0 14px" }}>
                Architecture
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "9px", fontSize: "12.5px", color: "#94a3b8" }}>
                <li><Link href="/#curriculum" style={{ color: "inherit", textDecoration: "none" }}>10-Stage Systematic Roadmap</Link></li>
                <li><Link href="/#pedagogy" style={{ color: "inherit", textDecoration: "none" }}>Mastery Learning Science</Link></li>
                <li><Link href="/#platform" style={{ color: "inherit", textDecoration: "none" }}>Student Workspace</Link></li>
                <li><Link href="/#platform" style={{ color: "inherit", textDecoration: "none" }}>Faculty Placement Portal</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ font: "800 11px var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase", color: "#e2e8f0", margin: "0 0 14px" }}>
                Access &amp; Security
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "9px", fontSize: "12.5px", color: "#94a3b8" }}>
                <li><Link href="/login" style={{ color: "inherit", textDecoration: "none" }}>Student Sign In</Link></li>
                <li><Link href="/register?course=problem-solving-lab" style={{ color: "inherit", textDecoration: "none" }}>Free Registration (₹0)</Link></li>
                <li><Link href="/admin" style={{ color: "inherit", textDecoration: "none" }}>Administrator Gateway</Link></li>
                <li><Link href="/privacy" style={{ color: "inherit", textDecoration: "none" }}>Data &amp; Privacy Policy</Link></li>
                <li>
                  <span style={{ fontSize: "11px", color: "#64748b" }}>
                    Engine: {hasSupabase ? "🟢 Supabase Cloud" : "⚡ Real SQLite Engine"}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "20px", fontSize: "11px", color: "#64748b", flexWrap: "wrap", gap: "10px" }}>
            <span>© {new Date().getFullYear()} {PLATFORM_NAME}. ALL RIGHTS RESERVED.</span>
            <span>Constructed with Next.js 16 App Router · Turbopack · SQLite &amp; Supabase RLS</span>
          </div>
        </div>
      </footer>
    </>
  );
}
