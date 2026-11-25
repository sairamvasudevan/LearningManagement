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
import { PLATFORM_NAME } from "@/lib/courses";
import { getCurrentIdentity } from "@/lib/auth";

export const dynamic = "force-dynamic";

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

export default async function HomePage() {
  const hasSupabase = isSupabaseConfigured();
  const identity = await getCurrentIdentity();

  return (
    <>
      <SiteHeader signedIn={Boolean(identity)} admin={identity?.role === "admin"} />

      {/* 1. APPLE-STYLE HERO SECTION */}
      <section className="apple-hero-section">
        <div className="ed-container" style={{ position: "relative", zIndex: 2 }}>
          <div style={{ textAlign: "center", maxWidth: "860px", margin: "0 auto" }}>
            {/* Status Badge */}
            <div className="apple-kicker">
              <span className="apple-kicker-dot" />
              <span>100-Hour Flagship Curriculum · Full Scholarship (₹0)</span>
            </div>

            {/* Headline */}
            <h1 className="apple-headline">
              <span>Architect Real Engineering Intuition.</span>
              <span className="apple-headline-sub">From Algorithmic Invariants to Full-Stack Systems.</span>
            </h1>

            {/* Subtitle */}
            <p className="apple-subtitle">
              A precision technical training ground engineered for university students and placement candidates.
              Master 100 hours of language-independent problem solving, execute live code across 150+ challenges,
              and build production systems with real-time test case verification.
            </p>

            {/* Action Row */}
            <div className="apple-action-row">
              <a href="#training-modules" className="apple-btn-primary">
                <span>Explore Training Modules</span>
                <span style={{ fontSize: "12px" }}>↓</span>
              </a>
              <Link href="/ide" className="apple-btn-secondary">
                <span>Open Cloud IDE</span>
                <span style={{ fontSize: "12px" }}>↗</span>
              </Link>
            </div>

            {/* Telemetry Strip */}
            <div className="apple-telemetry-strip">
              <div className="apple-telemetry-item">
                <span className="apple-telemetry-num">100 Modules</span>
                <span className="apple-telemetry-label">Curriculum Scope</span>
                <span className="apple-telemetry-sub">10 progressive stages</span>
              </div>
              <div className="apple-telemetry-item">
                <span className="apple-telemetry-num">150+ Challenges</span>
                <span className="apple-telemetry-label">Coding Practice</span>
                <span className="apple-telemetry-sub">C++, Java, Python, C</span>
              </div>
              <div className="apple-telemetry-item">
                <span className="apple-telemetry-num">80% Passing Score</span>
                <span className="apple-telemetry-label">Mastery Requirement</span>
                <span className="apple-telemetry-sub">Cognitive progression</span>
              </div>
              <div className="apple-telemetry-item">
                <span className="apple-telemetry-num" style={{ color: "#34c759" }}>₹0 Free</span>
                <span className="apple-telemetry-label">Full Scholarship</span>
                <span className="apple-telemetry-sub">Zero tuition barrier</span>
              </div>
            </div>
          </div>

          {/* Interactive Code Editor Preview - Strictly Left Aligned */}
          <div style={{ marginTop: "44px", maxWidth: "980px", marginLeft: "auto", marginRight: "auto", textAlign: "left" }}>
            <HeroTryChallenge />
          </div>
        </div>
      </section>

      {/* 2. CORE TRAINING MODULES SYSTEM HUB */}
      <section id="training-modules" className="training-modules-section">
        <div className="ed-container">
          <div className="system-section-head">
            <span className="system-eyebrow">Engineering Matrix</span>
            <h2 className="system-section-title">Core Training Modules</h2>
            <p className="system-section-desc">
              Five unified training surfaces engineered to transition students from raw algorithmic reasoning
              to interview problem solving, full-stack engineering, and LSRW communication mastery.
            </p>
          </div>

          <div className="training-modules-grid">
            {/* Module 01: Flagship 100-Hour Lab */}
            <article className="training-module-card featured-card">
              <div className="training-card-header">
                <div className="training-card-icon-box" style={{ background: "rgba(0, 113, 227, 0.15)", color: "#2997ff" }}>
                  📐
                </div>
                <span className="training-card-pill pill-indigo">MODULE 01 · FLAGSHIP FOUNDATION</span>
              </div>

              <h3 className="training-card-title">100-Hour Problem Solving Lab</h3>
              <div className="training-card-subtitle">Language-Independent Algorithmic Modeling &amp; Invariant Proofs</div>
              <p className="training-card-desc">
                Construct rigorous mental models from scratch. Learn requirement extraction, state invariants,
                asymptotic bounds, worked real-world case studies, and verified algorithmic proofs.
              </p>

              <div className="training-card-specs-row">
                <div className="spec-chip">
                  <b>100 Modules</b>
                  <span>10 Sequential Stages</span>
                </div>
                <div className="spec-chip">
                  <b>80% Passing Score</b>
                  <span>Required to Advance</span>
                </div>
                <div className="spec-chip">
                  <b>Evaluation</b>
                  <span>Instant Verification</span>
                </div>
                <div className="spec-chip">
                  <b style={{ color: "#34c759" }}>100% Free (₹0)</b>
                  <span>Active Scholarship</span>
                </div>
              </div>

              <div className="training-card-action-row">
                <Link href="/courses/problem-solving-lab" className="apple-btn-primary" style={{ padding: "9px 20px", fontSize: "13px" }}>
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
                <div className="training-card-icon-box" style={{ background: "rgba(6, 182, 212, 0.15)", color: "#22d3ee" }}>
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
                  <b>150+ Challenges</b>
                  <span>Easy · Medium · Hard</span>
                </div>
                <div className="spec-chip">
                  <b>4 Runtimes</b>
                  <span>C++, Java 21, Python, C</span>
                </div>
                <div className="spec-chip">
                  <b>Instant Execution</b>
                  <span>Sub-millisecond test suites</span>
                </div>
                <div className="spec-chip">
                  <b style={{ color: "#22d3ee" }}>Live Verification</b>
                  <span>Diff inspection engine</span>
                </div>
              </div>

              <div className="training-card-action-row">
                <Link href="/dsa" className="apple-btn-secondary" style={{ padding: "9px 20px", fontSize: "13px" }}>
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
                <div className="training-card-icon-box" style={{ background: "rgba(52, 199, 89, 0.15)", color: "#34c759" }}>
                  🌐
                </div>
                <span className="training-card-pill pill-green">MODULE 03 · PRODUCTION ENGINEERING</span>
              </div>

              <h3 className="training-card-title">Full-Stack Web Dev &amp; MERN Studio</h3>
              <div className="training-card-subtitle">Interactive Frontend &amp; Backend Engineering Sandbox</div>
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
                  <b>Interactive Coding</b>
                  <span>Hands-on browser challenges</span>
                </div>
                <div className="spec-chip">
                  <b style={{ color: "#34c759" }}>Full-Stack</b>
                  <span>Frontend to Backend</span>
                </div>
              </div>

              <div className="training-card-action-row">
                <Link href="/web-dev" className="apple-btn-secondary" style={{ padding: "9px 20px", fontSize: "13px" }}>
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
                <div className="training-card-icon-box" style={{ background: "rgba(255, 159, 10, 0.15)", color: "#ff9f0a" }}>
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
                  <b style={{ color: "#ff9f0a" }}>Real-time I/O</b>
                  <span>Instant stdout &amp; stderr</span>
                </div>
              </div>

              <div className="training-card-action-row">
                <Link href="/ide" className="apple-btn-secondary" style={{ padding: "9px 20px", fontSize: "13px" }}>
                  <span>Launch Cloud IDE</span>
                  <span>→</span>
                </Link>
                <Link href="/ide" className="card-secondary-link">
                  Open Blank Scratchpad ↗
                </Link>
              </div>
            </article>

            {/* Module 05: Corporate Communication & LSRW Studio */}
            <article className="training-module-card comm-span-full" style={{ borderColor: "rgba(192, 132, 252, 0.35)" }}>
              <div className="training-card-header">
                <div className="training-card-icon-box" style={{ background: "rgba(168, 85, 247, 0.16)", color: "#c084fc" }}>
                  🎙️
                </div>
                <span className="training-card-pill" style={{ background: "rgba(168, 85, 247, 0.16)", color: "#d8b4fe" }}>
                  MODULE 05 · PLACEMENT COMMUNICATION (LSRW)
                </span>
              </div>

              <h3 className="training-card-title">Corporate Communication &amp; LSRW Assessment Lab</h3>
              <div className="training-card-subtitle">
                Listening · Speaking · Reading · Writing (Versant VEPT &amp; Mercer Mettl SpeechX / SVAR Aligned)
              </div>
              <p className="training-card-desc">
                Practice campus placement communication rounds used by Accenture, Cognizant, TCS, and Amazon. Train
                audio-repeat sentences, syntactic sentence builds, read-aloud prosody, blind passage reconstruction, and
                corporate email writing with instant Versant-scale (20–80) &amp; CEFR verification.
              </p>

              <div className="training-card-specs-row">
                <div className="spec-chip">
                  <b>4 LSRW Modules</b>
                  <span>Research-backed playbooks</span>
                </div>
                <div className="spec-chip">
                  <b>12 Live Drills</b>
                  <span>Mic / Typed + Audio Prompts</span>
                </div>
                <div className="spec-chip">
                  <b>10-Part Mock Exam</b>
                  <span>Timed Versant / SVAR Simulator</span>
                </div>
                <div className="spec-chip">
                  <b style={{ color: "#c084fc" }}>20–80 CEFR Score</b>
                  <span>Heuristic v1 · AI Slot Ready</span>
                </div>
              </div>

              <div className="training-card-action-row">
                <Link href="/communication/studio?tab=practice" className="apple-btn-primary" style={{ padding: "9px 20px", fontSize: "13px", background: "#9333ea" }}>
                  <span>Open LSRW Studio</span>
                  <span>→</span>
                </Link>
                <Link href="/communication" className="card-secondary-link">
                  Explore LSRW Syllabus &amp; Mock Test ↗
                </Link>
              </div>
            </article>

            {/* Module 06: Code by Ear - Audio DSA Story Serial */}
            <article className="training-module-card comm-span-full" style={{ borderColor: "rgba(249, 115, 22, 0.4)" }}>
              <div className="training-card-header">
                <div className="training-card-icon-box" style={{ background: "rgba(249, 115, 22, 0.16)", color: "#fdba74" }}>
                  🎧
                </div>
                <span className="training-card-pill" style={{ background: "rgba(249, 115, 22, 0.16)", color: "#fdba74" }}>
                  MODULE 06 · AUDIO STORY DSA SERIAL (28 EPISODES)
                </span>
              </div>

              <h3 className="training-card-title">Code by Ear: Learn Programming &amp; DSA via 2-Minute Audio Stories</h3>
              <div className="training-card-subtitle">
                19–21 College Humor · Timed Punchlines · Side-by-Side Tech Comparisons · Interactive Quizzes
              </div>
              <p className="training-card-desc">
                Learn every foundational concept from Episode 01 (&ldquo;The Illegal Hostel-Kettle Payasam Disaster&rdquo;
                — Compile-Time vs. Runtime Error) straight through Big-O, Prefix Sums, Stacks, Hash Maps, Trees, Heaps,
                Graphs, 1D/2D DP &amp; Bitmasks in one continuous, humorous campus audio story series.
              </p>

              <div className="training-card-specs-row">
                <div className="spec-chip">
                  <b>28 Episodes · 7 Seasons</b>
                  <span>Complete Programming + DSA syllabus</span>
                </div>
                <div className="spec-chip">
                  <b>~2 Min / Story</b>
                  <span>Campus comedy &amp; punchline beats</span>
                </div>
                <div className="spec-chip">
                  <b>Story vs Code Tables</b>
                  <span>Analogy mapped to exact invariants</span>
                </div>
                <div className="spec-chip">
                  <b style={{ color: "#fdba74" }}>Interactive Check</b>
                  <span>Audio Q&amp;A + teach-back recall</span>
                </div>
              </div>

              <div className="training-card-action-row">
                <Link href="/audio-dsa" className="apple-btn-primary" style={{ padding: "9px 20px", fontSize: "13px", background: "#ea580c" }}>
                  <span>Listen to Audio Story Series</span>
                  <span>→</span>
                </Link>
                <Link href="/courses/audio-dsa-stories" className="card-secondary-link">
                  View Full 28-Episode Syllabus ↗
                </Link>
              </div>
            </article>

            {/* Module 07: AI Technical Mock Interview Arena */}
            <article className="training-module-card comm-span-full" style={{ borderColor: "rgba(16, 185, 129, 0.4)" }}>
              <div className="training-card-header">
                <div className="training-card-icon-box" style={{ background: "rgba(16, 185, 129, 0.16)", color: "#34d399" }}>
                  🤖
                </div>
                <span className="training-card-pill" style={{ background: "rgba(16, 185, 129, 0.16)", color: "#34d399" }}>
                  MODULE 07 · AI MOCK INTERVIEW ARENA (CHESS ELO TIERS)
                </span>
              </div>

              <h3 className="training-card-title">Live AI Interview Bot: Real-Time Voice Grilling &amp; FAANG Scorecards</h3>
              <div className="training-card-subtitle">
                Chess ELO Tiers (800 to 2400) · Web Speech Synthesis &amp; Microphone · Invariant Defense · 5-Dimension Matrix
              </div>
              <p className="training-card-desc">
                Engage in full-loop technical interviews against five distinct bots: from gentle ELO 800 Intern Sam to ruthless ELO 2400 FAANG Bar Raiser Magnus. Speak naturally using live speech recognition, code in the scratchpad, and defend your algorithms under adversarial edge-case grilling.
              </p>

              <div className="training-card-specs-row">
                <div className="spec-chip">
                  <b>5 ELO Difficulty Bots</b>
                  <span>Intern (800) to Bar Raiser (2400)</span>
                </div>
                <div className="spec-chip">
                  <b>Full Audio Dialogue</b>
                  <span>Browser TTS &amp; live mic input</span>
                </div>
                <div className="spec-chip">
                  <b>Free Daily Passes</b>
                  <span>3 complimentary daily slots</span>
                </div>
                <div className="spec-chip">
                  <b style={{ color: "#34d399" }}>Official Scorecard</b>
                  <span>5-dim rubric + candidate ELO rating</span>
                </div>
              </div>

              <div className="training-card-action-row">
                <Link href="/interview" className="apple-btn-primary" style={{ padding: "9px 20px", fontSize: "13px", background: "#10b981", color: "#022c22", fontWeight: 700 }}>
                  <span>Enter AI Mock Interview Arena</span>
                  <span>→</span>
                </Link>
                <Link href="/interview" className="card-secondary-link">
                  View ELO Bots &amp; Question Bank ↗
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 3. PLACEMENT RECOGNITION BENCHMARKS */}
      <section style={{ padding: "44px 0", borderTop: "1px solid rgba(255, 255, 255, 0.08)", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", background: "#08080a" }}>
        <div className="ed-container" style={{ textAlign: "center" }}>
          <span style={{ font: "700 11px -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", color: "#86868b", letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginBottom: "16px" }}>
            ENGINEERED TO MATCH TIER-1 INDUSTRY STANDARDS
          </span>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            {HIRING_BENCHMARKS.map((company) => (
              <div
                key={company.name}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#161617",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "980px",
                  padding: "7px 16px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#f5f5f7",
                }}
              >
                <span>{company.icon}</span>
                <span>{company.name}</span>
                <span style={{ fontSize: "10px", color: "#2997ff", background: "rgba(0, 113, 227, 0.15)", padding: "1px 7px", borderRadius: "980px", fontWeight: 700 }}>
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
            margin: "64px 0 24px",
            background: "#161617",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            borderRadius: "20px",
            padding: "48px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "24px",
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.6)",
          }}
        >
          <div style={{ maxWidth: "680px" }}>
            <span style={{ font: "700 11px -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", color: "#34c759", letterSpacing: "0.1em", textTransform: "uppercase", display: "inline-block", marginBottom: "10px" }}>
              ● 100% SCHOLARSHIP ENROLLMENT ACTIVE
            </span>
            <h2 style={{ font: "700 32px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif", color: "#f5f5f7", margin: "0 0 10px", letterSpacing: "-0.03em" }}>
              Start Building Real Engineering Intuition Today.
            </h2>
            <p style={{ fontSize: "15px", color: "#86868b", lineHeight: 1.6, margin: 0 }}>
              Join students learning to think through algorithms systematically.
              Register in 60 seconds with zero credit card required.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link
              href="/register?course=problem-solving-lab"
              className="apple-btn-primary"
            >
              Enroll Free (₹0) →
            </Link>
            <Link
              href="/login"
              className="apple-btn-secondary"
            >
              Sign In to Portal
            </Link>
          </div>
        </section>
      </main>

      {/* 10. APPLE-STYLE MINIMALIST MULTI-COLUMN FOOTER */}
      <footer style={{ background: "#0a0a0c", borderTop: "1px solid rgba(255, 255, 255, 0.08)", padding: "48px 0 28px" }}>
        <div className="ed-container">
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: "32px", paddingBottom: "32px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#1c1c1e", border: "1px solid rgba(255, 255, 255, 0.12)", display: "grid", placeItems: "center", color: "#2997ff", fontSize: "15px" }}>
                  ⚡
                </div>
                <div>
                  <b style={{ font: "700 15px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif", color: "#f5f5f7", letterSpacing: "-0.02em" }}>{PLATFORM_NAME}</b>
                  <small style={{ display: "block", font: "600 9px -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", color: "#86868b" }}>ENGINEERING ACADEMY</small>
                </div>
              </div>
              <p style={{ fontSize: "12.5px", lineHeight: 1.65, color: "#86868b", margin: "0 0 16px", maxWidth: "320px" }}>
                A precision technical learning management platform designed for structured, mastery-based
                engineering curricula and college placement transparency.
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ font: "600 10px -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", background: "rgba(0, 113, 227, 0.12)", color: "#2997ff", padding: "3px 9px", borderRadius: "980px" }}>
                  100% Free Flagship
                </span>
                <span style={{ font: "600 10px -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif", background: "rgba(52, 199, 89, 0.12)", color: "#34c759", padding: "3px 9px", borderRadius: "980px" }}>
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
