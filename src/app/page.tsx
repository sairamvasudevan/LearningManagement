import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const highlights = [
  ["01", "Understand the task", "Separate the real requirement from background details, assumptions and distractions."],
  ["02", "Construct a solution", "Represent information, build logic and select an approach without depending on one language."],
  ["03", "Prove and improve", "Trace behaviour, test edge cases, reason about efficiency and review AI-assisted output."],
];

export default function HomePage() {
  return <><SiteHeader />
    <main className="public-main">
      <section className="public-hero">
        <div className="hero-copy"><span className="eyebrow">A 100-HOUR SELF-PACED PROGRAMME</span>
          <h1>Think clearly.<br/><em>Solve confidently.</em></h1>
          <p>Build the ability to understand unfamiliar problems, identify the right approach, verify a solution and explain your reasoning—before writing a single line of code.</p>
          <div className="hero-actions"><Link className="button button-primary button-large" href="/register">Register for the course <span>→</span></Link><Link className="button button-outline button-large" href="/login">Student sign in</Link></div>
          <div className="hero-proof"><span>100 focused lessons</span><i/> <span>Language-independent</span><i/> <span>Mastery-based progression</span></div>
        </div>
        <div className="hero-visual"><div className="visual-orbit orbit-one"/><div className="visual-orbit orbit-two"/><div className="visual-core"><span>PS</span><small>PROBLEM<br/>SOLVING</small></div><div className="visual-node node-top">01 <b>Understand</b></div><div className="visual-node node-right">02 <b>Model</b></div><div className="visual-node node-bottom">03 <b>Verify</b></div></div>
      </section>
      <section className="public-stats"><div><b>100</b><span>One-hour lessons</span></div><div><b>10</b><span>Progressive learning paths</span></div><div><b>01</b><span>Skill: independent problem solving</span></div></section>
      <section className="public-section"><div className="section-intro"><span className="eyebrow">THE LEARNING METHOD</span><h2>From reading a problem to defending a solution.</h2><p>Each learning path unlocks in sequence. Lessons move from guided reasoning to independent application and realistic interview-style scenarios.</p></div><div className="highlight-grid">{highlights.map(([n,title,desc])=><article className="highlight-card" key={n}><span>{n}</span><h3>{title}</h3><p>{desc}</p></article>)}</div></section>
      <section className="course-callout"><div><span className="eyebrow">THE COURSE</span><h2>Problem Solving Lab</h2><p>100 hours · Self-paced · One learner account · Progress saved centrally</p></div><Link className="button button-primary" href="/register">Get started <span>→</span></Link></section>
      {!isSupabaseConfigured()&&<div className="setup-banner"><b>Developer preview:</b> Authentication and database connection will become active after the Supabase environment variables and migration are configured. This is not a live student-registration portal yet.</div>}
    </main><footer className="public-footer"><span>PROBLEM SOLVING LAB</span><span>Learn the reasoning behind the solution.</span></footer>
  </>;
}
