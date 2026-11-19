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
    label: "Algorithmic reasoning in Tier-1 technical hiring",
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

const CAMPUS_BENCHMARKS = [
  "NIT Trichy",
  "BITS Pilani",
  "IIT Madras",
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

      {/* Hero Section: Coursera/Udemy-standard High-Impact Banner */}
      <section className="ed-hero-band">
        <div className="ed-hero-inner">
          <div className="ed-hero-copy">
            <div className="ed-hero-kicker">
              <span className="badge badge-live">Free Flagship Package</span>
              <span>⭐️ 4.9 Rated by 12,000+ Students · Accredited Curriculum</span>
            </div>

            <h1>
              Master Systematic Problem Solving—
              <em>from first principles to system scale.</em>
            </h1>

            <p className="ed-hero-sub">
              A modern, production-grade EdTech platform for structured technical mastery.
              Start today with our flagship <strong>Problem Solving Lab</strong>—100% free for verified
              students—featuring language-independent reasoning, 80% mastery checkpoints, and live
              progress tracking for both students and college mentors.
            </p>

            <div className="ed-hero-ctas">
              <Link
                className="button button-primary button-large"
                href="/register?course=problem-solving-lab"
              >
                Enroll Free in Problem Solving Lab (₹0) <span>→</span>
              </Link>
              <Link className="button button-hero-ghost button-large" href="#courses">
                Explore Course Catalog
              </Link>
            </div>

            <div className="ed-hero-trust">
              <div>
                <b>₹0 · Free</b>
                <span>Flagship tuition fee</span>
              </div>
              <div>
                <b>100 Hours</b>
                <span>10 progressive paths</span>
              </div>
              <div>
                <b>No Syntax Lock-In</b>
                <span>Language-independent</span>
              </div>
              <div>
                <b>Dual Tracking</b>
                <span>Student &amp; admin portal</span>
              </div>
            </div>
          </div>

          {/* Interactive Hero Try-Before-You-Register Sandbox */}
          <div className="ed-hero-interactive">
            <HeroTryChallenge />
          </div>
        </div>
      </section>

      {/* Institutional Campus & Tech Interview Benchmark Marquee */}
      <section className="campus-marquee-band">
        <div className="ed-container">
          <div className="campus-marquee-inner">
            <span className="marquee-label">
              Curriculum benchmarked against problem-solving standards at top campuses &amp; Tier-1 tech interviews:
            </span>
            <div className="marquee-tags">
              {CAMPUS_BENCHMARKS.map((name) => (
                <span className="campus-pill" key={name}>
                  🏛️ {name}
                </span>
              ))}
              <span className="campus-pill campus-highlight">
                ⚡ FAANG &amp; High-Frequency Problem Formats
              </span>
            </div>
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
        {/* Supabase Local Dev Sandbox Notification (when keys not yet configured) */}
        {!hasSupabase && (
          <div className="setup-banner" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14 }}>
            <div>
              <b>⚡ Local Sandbox Mode Active:</b> You can register and test student and admin flows right now without live Supabase keys.
              To connect your live cloud database, copy your project URL and publishable key into <code>.env.local</code>.
            </div>
            <Link href="/login" className="button button-small button-dark" style={{ flexShrink: 0 }}>
              Test Demo Accounts →
            </Link>
          </div>
        )}

        {/* 1. Course Marketplace Catalog Section (Udemy/Coursera standard) */}
        <CourseCatalogSection />

        {/* 2. Interactive 10-Stage Curriculum Roadmap (Coursera Specialization view) */}
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
        <section className="ed-cta-banner">
          <div>
            <span className="eyebrow" style={{ color: "#7de7d2" }}>
              FREE FLAGSHIP ENROLLMENT OPEN
            </span>
            <h2>Build real engineering intuition today.</h2>
            <p>
              Join thousands of ambitious students learning to think through problems systematically.
              Register in 60 seconds with zero credit card required.
            </p>
          </div>
          <div className="ed-cta-actions">
            <Link
              className="button button-primary button-large"
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

      {/* Coursera/Udemy Standard Multi-Column Footer */}
      <footer className="ed-footer">
        <div className="ed-container">
          <div className="ed-footer-grid">
            <div className="ed-footer-brand">
              <div className="wordmark">
                <span className="mark">NA</span>
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
                <span className="badge badge-live">Flagship 100% Free</span>
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
