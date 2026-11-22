import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import {
  CourseCatalogSection,
  CurriculumExplorer,
  PedagogySection,
  ComparisonSection,
  RolePreviewTabs,
  TestimonialSection,
  FaqAccordion,
  HeroTryChallenge,
} from "@/components/home-interactive";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { PLATFORM_NAME, PLATFORM_SUBTITLE } from "@/lib/courses";

const RESEARCH_SIGNALS = [
  {
    stat: "43%",
    label: "Algorithmic reasoning in Tier-1 technical rounds",
    source: "CoderPad State of Tech Hiring 2026",
  },
  {
    stat: "100%",
    label: "Flagship scholarship access for students",
    source: "Zero tuition barrier for college learners",
  },
  {
    stat: "80%",
    label: "Mastery checkpoint passing requirement",
    source: "Cognitive Load & Mastery Learning Model",
  },
  {
    stat: "10",
    label: "Sequential paths from foundations to capstones",
    source: "100 structured one-hour modules",
  },
];

const HIRING_COMPANIES = [
  { name: "Google", tag: "FAANG", icon: "🌐" },
  { name: "Microsoft", tag: "Tier 1", icon: "💻" },
  { name: "Amazon", tag: "FAANG", icon: "📦" },
  { name: "Meta", tag: "FAANG", icon: "♾️" },
  { name: "Uber", tag: "Product", icon: "🚗" },
  { name: "Atlassian", tag: "Global", icon: "🔷" },
  { name: "Swiggy", tag: "High Scale", icon: "🚀" },
  { name: "Zomato", tag: "High Scale", icon: "⚡" },
  { name: "Goldman Sachs", tag: "FinTech", icon: "🏛️" },
];

const CAMPUS_BENCHMARKS = [
  "NIT Trichy",
  "BITS Pilani",
  "IIT Bombay",
  "PSG Tech",
  "Anna University",
  "DTU Delhi",
  "IIIT Hyderabad",
  "RVCE Bengaluru",
];

export default function HomePage() {
  const hasSupabase = isSupabaseConfigured();

  return (
    <>
      <SiteHeader />

      {/* Hero Section: Coding Ninjas / CodeStudio Style Lively High-Impact Hero */}
      <section
        className="ed-hero-band"
        style={{
          background:
            "radial-gradient(circle at 82% 18%, rgba(255, 106, 0, 0.16) 0%, transparent 48%), radial-gradient(circle at 12% 82%, rgba(14, 165, 233, 0.12) 0%, transparent 48%), linear-gradient(135deg, #070e17 0%, #0d1a29 50%, #08111a 100%)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="ed-hero-inner" style={{ position: "relative", zIndex: 2 }}>
          <div className="ed-hero-copy">
            <div
              className="ed-hero-kicker"
              style={{
                background: "rgba(255, 106, 0, 0.14)",
                borderColor: "rgba(255, 106, 0, 0.35)",
              }}
            >
              <span className="cn-pulse-dot" />
              <span className="badge-flame" style={{ padding: "2px 8px", borderRadius: 99 }}>
                🔥 #1 PROBLEM SOLVING PROGRAM FOR ENGINEERS
              </span>
              <span style={{ color: "#ffd299", fontSize: 11, fontWeight: 700 }}>
                100% Free Scholarship Active
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(34px, 4.4vw, 54px)", lineHeight: 1.08 }}>
              Master Algorithmic Problem Solving—
              <span
                style={{
                  display: "block",
                  background: "linear-gradient(135deg, #ff6a00 0%, #ffb300 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginTop: 6,
                }}
              >
                From Day 1 to Top Tech Placements.
              </span>
            </h1>

            <p className="ed-hero-sub">
              Ditch passive tutorial bingeing. Learn language-independent algorithmic modeling,
              prove your reasoning on live <strong>CodeStudio test cases</strong>, and advance through
              an 80% mastery-gated 100-hour curriculum with transparent progress tracking for you and your college placement mentors.
            </p>

            <div className="ed-hero-ctas">
              <Link
                className="button button-cn-primary button-large"
                href="/register?course=problem-solving-lab"
              >
                Enroll Free in Problem Solving Lab (₹0) <span>→</span>
              </Link>
              <Link className="button button-hero-ghost button-large" href="/ide" style={{ color: "#34d399", borderColor: "#059669" }}>
                💻 Open Online IDE ↗
              </Link>
              <Link className="button button-hero-ghost button-large" href="#courses">
                Explore All Tracks ⚡
              </Link>
            </div>

            <div className="ed-hero-trust" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
              <div>
                <b style={{ color: "#ff8a00", fontSize: 16 }}>₹0 · Free</b>
                <span>Full scholarship access</span>
              </div>
              <div>
                <b>100 Hours</b>
                <span>10 progressive paths</span>
              </div>
              <div>
                <b>Zero Syntax Lock-in</b>
                <span>Language-independent</span>
              </div>
              <div>
                <b>Dual Portal</b>
                <span>Student &amp; faculty tracking</span>
              </div>
            </div>
          </div>

          {/* CodeStudio Interactive Terminal Preview */}
          <div className="ed-hero-interactive cn-floating-badge">
            <HeroTryChallenge />
          </div>
        </div>
      </section>

      {/* Coding Ninjas Style Company Placement & College Marquee */}
      <section className="cn-hiring-section">
        <div className="ed-container">
          <div className="cn-hiring-head">
            <span>🔥 OUR LEARNERS CRACK PROBLEM SOLVING ROUNDS AT TOP TECH COMPANIES</span>
          </div>
          <div className="cn-hiring-companies">
            {HIRING_COMPANIES.map((company) => (
              <div className="cn-company-pill" key={company.name}>
                <span>{company.icon}</span>
                <span>{company.name}</span>
                <span
                  style={{
                    fontSize: 9,
                    color: "#ff9100",
                    background: "rgba(255, 145, 0, 0.15)",
                    padding: "2px 6px",
                    borderRadius: 99,
                  }}
                >
                  {company.tag}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 10,
              alignItems: "center",
              marginTop: 18,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: 11, color: "#7a90a6", fontWeight: 700, letterSpacing: "0.08em" }}>
              CAMPUS BENCHMARKS:
            </span>
            {CAMPUS_BENCHMARKS.map((name) => (
              <span
                key={name}
                style={{
                  fontSize: 11,
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 99,
                  padding: "3px 10px",
                  color: "#a4b7cc",
                  fontWeight: 600,
                }}
              >
                🏛️ {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Research Signals Stats Bar */}
      <section className="ed-signal-band">
        <div className="ed-container">
          <div className="ed-signal-grid">
            {RESEARCH_SIGNALS.map((signal) => (
              <div className="ed-signal-item" key={signal.stat}>
                <strong>{signal.stat}</strong>
                <b>{signal.label}</b>
                <span>{signal.source}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="ed-container ed-main-stack">
        {/* Supabase Local Dev Sandbox Notification */}
        {!hasSupabase && (
          <div
            className="setup-banner"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 14,
              background: "#fff9ec",
              borderColor: "#fed888",
            }}
          >
            <div>
              <b style={{ color: "#a56608" }}>⚡ Local Dev Sandbox Active:</b> You can test both
              student and admin experiences immediately on localhost without remote keys. To link
              live Supabase Cloud, add your URL &amp; key to <code>.env.local</code>.
            </div>
            <Link href="/login" className="button button-cn-primary button-small" style={{ flexShrink: 0 }}>
              Test Demo Accounts →
            </Link>
          </div>
        )}

        {/* 1. Course Marketplace Catalog Section */}
        <CourseCatalogSection />

        {/* 2. Interactive 10-Stage Curriculum Roadmap */}
        <CurriculumExplorer />

        {/* 3. The Science of Learning (Pedagogy Foundation) */}
        <PedagogySection />

        {/* 4. Direct Comparison Matrix */}
        <ComparisonSection />

        {/* 5. Dual-Sided Platform Experience (Student vs Admin Portal) */}
        <RolePreviewTabs />

        {/* 6. Verified Student Reviews & Testimonials */}
        <TestimonialSection />

        {/* 7. Objection-Handling FAQ Accordion */}
        <FaqAccordion />

        {/* 8. Conversion Call-to-Action Banner */}
        <section
          className="ed-cta-banner"
          style={{
            background:
              "linear-gradient(135deg, #101c2b 0%, #1c2e42 50%, #241a12 100%)",
            border: "1px solid rgba(255, 106, 0, 0.25)",
            boxShadow: "0 22px 54px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div>
            <span className="badge-flame" style={{ padding: "3px 9px", borderRadius: 99, marginBottom: 10, display: "inline-block" }}>
              🔥 100% SCHOLARSHIP ENROLLMENT OPEN
            </span>
            <h2 style={{ color: "#fff" }}>Build real engineering intuition today.</h2>
            <p style={{ color: "#c9dae8" }}>
              Join thousands of ambitious students learning to think through algorithms systematically.
              Register in 60 seconds with zero credit card required.
            </p>
          </div>
          <div className="ed-cta-actions">
            <Link
              className="button button-cn-primary button-large"
              href="/register?course=problem-solving-lab"
            >
              Enroll Free in Problem Solving Lab (₹0) →
            </Link>
            <Link className="button button-hero-ghost button-large" href="/login">
              Sign In to Portal
            </Link>
          </div>
        </section>
      </main>

      {/* Multi-Column Footer */}
      <footer className="ed-footer">
        <div className="ed-container">
          <div className="ed-footer-grid">
            <div className="ed-footer-brand">
              <div className="wordmark">
                <span className="mark" style={{ background: "linear-gradient(135deg, #ff5722, #ff9800)", color: "#fff" }}>
                  ⚡
                </span>
                <span>
                  <b>{PLATFORM_NAME}</b>
                  <small>{PLATFORM_SUBTITLE}</small>
                </span>
              </div>
              <p>
                A high-performance technical learning platform designed for structured, mastery-gated
                engineering curricula.
              </p>
              <div className="footer-badges">
                <span className="badge-flame">🔥 Flagship 100% Free</span>
                <span className="badge badge-category">PostgreSQL &amp; Supabase RLS</span>
              </div>
            </div>

            <div>
              <h4>Programs &amp; Tracks</h4>
              <ul>
                <li>
                  <Link href="/courses/problem-solving-lab">Problem Solving Lab (Flagship)</Link>
                </li>
                <li>
                  <Link href="/#courses">Distributed Systems &amp; Scale</Link>
                </li>
                <li>
                  <Link href="/#courses">Generative AI Systems</Link>
                </li>
                <li>
                  <Link href="/#courses">Full Stack Web Architecture</Link>
                </li>
                <li>
                  <Link href="/#courses">Competitive Programming</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4>Learning Experience</h4>
              <ul>
                <li>
                  <Link href="/#curriculum">10-Path Roadmap</Link>
                </li>
                <li>
                  <Link href="/#pedagogy">The Science of Mastery</Link>
                </li>
                <li>
                  <Link href="/#platform">Student Workspace</Link>
                </li>
                <li>
                  <Link href="/#platform">Administrator Portal</Link>
                </li>
                <li>
                  <Link href="/#faq">Frequently Asked Questions</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4>Access &amp; Security</h4>
              <ul>
                <li>
                  <Link href="/login">Student Sign In</Link>
                </li>
                <li>
                  <Link href="/register?course=problem-solving-lab">Register Free (₹0)</Link>
                </li>
                <li>
                  <Link href="/admin">Administrator Gateway</Link>
                </li>
                <li>
                  <Link href="/privacy">Student Privacy &amp; Data Notice</Link>
                </li>
                <li>
                  <span style={{ fontSize: 11, color: "#8b9aa8" }}>
                    Status: {hasSupabase ? "🟢 Supabase Connected" : "🟡 Local Dev Sandbox"}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="ed-footer-bottom">
            <span>© {new Date().getFullYear()} {PLATFORM_NAME}. ALL RIGHTS RESERVED.</span>
            <span>
              Constructed with Next.js 16 App Router · Supabase SSR &amp; Row Level Security · PostgreSQL
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
