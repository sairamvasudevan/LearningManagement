"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import catalog from "@/lib/course-catalog.json";
import { COURSE_PACKAGES } from "@/lib/courses";

/* -------------------------------------------------------------------------- */
/* 1. Udemy/Coursera-Style Interactive Hero Preview Challenge                */
/* -------------------------------------------------------------------------- */

const SAMPLE_CHALLENGES = [
  {
    id: "nested-loops",
    kicker: "MODULE 01 PREVIEW · ASYMPTOTIC THINKING",
    title: "Predict the exact scale behavior of nested loops",
    prompt:
      "A junior engineer writes a search routine where an outer loop runs N times, and for each step, an inner loop runs from 0 up to i (where i is the current outer iteration index). Which time complexity class does this algorithm belong to?",
    options: [
      "O(N) — linear time because the inner loop terminates early.",
      "O(N log N) — logarithmic factor due to the increasing bound.",
      "O(N²) — quadratic time because total iterations equal N(N - 1)/2.",
      "O(2ᴺ) — exponential time because work doubles every step.",
    ],
    correctIndex: 2,
    hints: [
      "Write down the sum of iterations: 0 + 1 + 2 + 3 + ... + (N - 1).",
      "Recall Gauss's summation formula for the sum of the first N integers.",
      "N(N - 1)/2 expands to (N² - N)/2, where the dominant term is N².",
    ],
    explanation:
      "The total number of inner loop executions is 0 + 1 + 2 + ... + (N - 1) = N(N - 1)/2 = 0.5N² - 0.5N. In Big-O asymptotic analysis, we drop constant coefficients (0.5) and lower-order terms (-0.5N), yielding strict O(N²) quadratic time complexity.",
  },
  {
    id: "story-vs-task",
    kicker: "MODULE 01 PREVIEW · PROBLEM FORMULATION",
    title: "Separate the real task from the business narrative",
    prompt:
      "A campus shuttle app logs every card tap when riders board. Some riders tap twice when the reader beeps slowly. The transport office asks: “How many different students rode Route B on Tuesday?” What should your solution count?",
    options: [
      "Every card tap recorded on Route B on Tuesday.",
      "Distinct student IDs with at least one Route B tap on Tuesday.",
      "Students who tapped their card more than once on Tuesday.",
      "Total seats available across all Tuesday trips on Route B.",
    ],
    correctIndex: 1,
    hints: [
      "Distinguish an event (a card tap) from the real-world entity asked for (a student).",
      "Double taps belong to the same student ID—they should not increase the count of distinct students.",
    ],
    explanation:
      "The request asks for different students, not tap events. Counting distinct student IDs recorded on Route B on Tuesday ensures a rider who tapped twice is counted once—without corrupting the raw audit logs.",
  },
];

export function HeroTryChallenge() {
  const [activeChallengeIdx, setActiveChallengeIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [hintStep, setHintStep] = useState(0);

  const problem = SAMPLE_CHALLENGES[activeChallengeIdx];
  const isCorrect = checked && selected === problem.correctIndex;

  function switchChallenge(idx: number) {
    setActiveChallengeIdx(idx);
    setSelected(null);
    setChecked(false);
    setHintStep(0);
  }

  return (
    <div className="hero-widget-card" aria-label="Interactive course preview">
      {/* Video / Interactive Header Tab */}
      <div className="hero-widget-header">
        <div className="hw-tabs">
          <button
            type="button"
            className={`hw-tab ${activeChallengeIdx === 0 ? "active" : ""}`}
            onClick={() => switchChallenge(0)}
          >
            <span>⚡ Challenge 1: Asymptotics</span>
          </button>
          <button
            type="button"
            className={`hw-tab ${activeChallengeIdx === 1 ? "active" : ""}`}
            onClick={() => switchChallenge(1)}
          >
            <span>🎯 Challenge 2: Problem Framing</span>
          </button>
        </div>
        <span className="badge badge-live">Interactive Sandbox</span>
      </div>

      <div className="hero-widget-body">
        <div className="hero-widget-kicker-row">
          <span className="hw-kicker">{problem.kicker}</span>
          <span className="hw-stars">★★★★★ 4.9 (1,480 ratings)</span>
        </div>

        <h3 className="hero-widget-title">{problem.title}</h3>
        <p className="hero-widget-prompt">{problem.prompt}</p>

        <div className="hero-widget-options" role="radiogroup" aria-label="Answer options">
          {problem.options.map((opt, idx) => {
            const isChosen = selected === idx;
            const isRightOption = checked && idx === problem.correctIndex;
            const isWrongChosen = checked && isChosen && idx !== problem.correctIndex;

            return (
              <button
                key={opt}
                type="button"
                role="radio"
                aria-checked={isChosen}
                className={[
                  "hw-option",
                  isChosen ? "is-selected" : "",
                  isRightOption ? "is-correct" : "",
                  isWrongChosen ? "is-wrong" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => {
                  setSelected(idx);
                  setChecked(false);
                }}
              >
                <span className="hw-letter">{String.fromCharCode(65 + idx)}</span>
                <span className="hw-text">{opt}</span>
                <span className="hw-mark">
                  {isRightOption ? "✓" : isWrongChosen ? "×" : isChosen ? "●" : ""}
                </span>
              </button>
            );
          })}
        </div>

        {hintStep > 0 && (
          <div className="hw-hints">
            {problem.hints.slice(0, hintStep).map((hint, idx) => (
              <p key={hint}>
                <b>Hint {idx + 1}:</b> {hint}
              </p>
            ))}
          </div>
        )}

        <div className="hw-actions">
          <button
            type="button"
            className="button button-primary"
            disabled={selected === null}
            onClick={() => setChecked(true)}
          >
            Check reasoning
          </button>

          {hintStep < problem.hints.length && !checked && (
            <button
              type="button"
              className="hw-hint-btn"
              onClick={() => setHintStep((n) => Math.min(problem.hints.length, n + 1))}
            >
              {hintStep === 0 ? "Need a hint?" : `Show hint ${hintStep + 1}`}
            </button>
          )}

          {checked && (
            <button
              type="button"
              className="hw-hint-btn"
              onClick={() => {
                setSelected(null);
                setChecked(false);
                setHintStep(0);
              }}
            >
              Reset challenge
            </button>
          )}
        </div>

        {checked && (
          <div className={`hw-feedback ${isCorrect ? "good" : "review"}`}>
            <div className="hw-feedback-head">
              <b>{isCorrect ? "Mastery confirmed! Flawless reasoning." : "Not quite — review the breakdown below."}</b>
              <span>{isCorrect ? "+2/2 Score" : "Review Checkpoint"}</span>
            </div>
            <p>{problem.explanation}</p>
            <Link className="hw-next-link" href="/register?course=problem-solving-lab">
              Enroll Free in Problem Solving Lab to continue (₹0) →
            </Link>
          </div>
        )}
      </div>

      <div className="hw-footer">
        <div className="hw-meta-stat">
          <b>100 Hours</b>
          <span>Structured Path</span>
        </div>
        <div className="hw-meta-stat">
          <b>80% Threshold</b>
          <span>Mastery Checkpoint</span>
        </div>
        <div className="hw-meta-stat">
          <b>Dual Tracking</b>
          <span>Student &amp; Admin</span>
        </div>
        <div className="hw-meta-stat">
          <b style={{ color: "var(--teal)" }}>₹0 / Free</b>
          <span>100% Scholarship</span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. Udemy-Style Marketplace Course Catalog with Filter & Search             */
/* -------------------------------------------------------------------------- */

const CATEGORY_TABS = [
  { id: "all", label: "All Programs" },
  { id: "available", label: "Available Now (Free)" },
  { id: "Core Algorithmic Reasoning", label: "Problem Solving" },
  { id: "System Design", label: "System Design" },
  { id: "Artificial Intelligence", label: "Generative AI" },
  { id: "Full Stack Engineering", label: "Full Stack" },
  { id: "Competitive Programming", label: "Competitive Coding" },
];

export function CourseCatalogSection() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const visibleCourses = useMemo(() => {
    const q = search.trim().toLowerCase();
    return COURSE_PACKAGES.filter((course) => {
      if (activeTab === "available" && course.status !== "available") return false;
      if (activeTab !== "all" && activeTab !== "available" && course.category !== activeTab) {
        return false;
      }
      if (!q) return true;
      return [course.title, course.category, course.description, ...course.skills]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [activeTab, search]);

  return (
    <section id="courses" className="ed-section">
      <div className="ed-section-head">
        <div>
          <span className="eyebrow">COURSE CATALOGUE &amp; SPECIALIZATIONS</span>
          <h2>Explore Engineering Programs</h2>
          <p>
            Start with our flagship <strong>Problem Solving Lab</strong> package—100% free for verified
            students—or preview upcoming advanced engineering tracks sharing the same platform.
          </p>
        </div>

        <div className="ed-catalog-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by topic, skill, or keyword (e.g. algorithms, system design)…"
            aria-label="Search course packages"
          />
        </div>
      </div>

      <div className="ed-filter-bar" role="tablist" aria-label="Filter course packages">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`ed-filter-pill ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="ed-course-grid">
        {visibleCourses.map((course) => (
          <article
            key={course.slug}
            className={`ed-course-card ${course.status === "available" ? "ed-card-featured" : "ed-card-upcoming"}`}
          >
            {/* Visual Thumbnail Card */}
            <div className={`ed-course-thumb-box thumb-${course.slug.includes("system") ? "indigo" : course.slug.includes("ai") ? "amber" : course.slug.includes("programming") ? "slate" : "teal"}`}>
              <div className="thumb-badges-top">
                {course.badge && <span className="thumb-badge-hero">{course.badge}</span>}
                <span className="thumb-badge-hours">{course.totalHours} Hours</span>
              </div>
              <div className="thumb-art-center">
                <span className="thumb-art-icon">
                  {course.slug.includes("system") ? "🏛️" : course.slug.includes("ai") ? "🧠" : course.slug.includes("programming") ? "🏆" : "⚡"}
                </span>
                <span className="thumb-art-title">{course.category}</span>
              </div>
              <div className="thumb-meta-bottom">
                <span>{course.totalModules} Structured Modules</span>
                <span>{course.level}</span>
              </div>
            </div>

            <div className="ed-course-body">
              <div className="ed-course-meta-top">
                <span className="badge badge-category">{course.category}</span>
                <span className="ed-level-tag">{course.level}</span>
              </div>

              <h3>{course.title}</h3>
              <p className="ed-course-desc">{course.description}</p>

              <div className="ed-instructor-row">
                <div className="instructor-avatar">
                  {course.instructor.split(" ")[0][0]}
                  {course.instructor.split(" ")[1] ? course.instructor.split(" ")[1][0] : ""}
                </div>
                <div>
                  <b>{course.instructor}</b>
                  <small>{course.instructorTitle}</small>
                </div>
              </div>

              <div className="ed-rating-row">
                <span className="rating-score">{course.rating.toFixed(1)}</span>
                <span className="rating-stars">★★★★★</span>
                <span className="rating-count">({course.reviewCount.toLocaleString()} ratings)</span>
                <span className="rating-students">• {course.enrolledCount.toLocaleString()} enrolled</span>
              </div>

              <div className="ed-skill-tags">
                {course.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>

              <div className="ed-course-footer">
                <div className="ed-price-block">
                  <div className="price-tag-row">
                    <strong className={course.isFree ? "price-free" : "price-standard"}>
                      {course.priceLabel}
                    </strong>
                    {course.originalPrice && <del className="price-struck">{course.originalPrice}</del>}
                  </div>
                  <small className="price-subtext">
                    {course.status === "available" ? "100% Scholarship · Student Access" : "Cohort Registration Upcoming"}
                  </small>
                </div>

                <div className="ed-card-actions">
                  {course.status === "available" ? (
                    <>
                      <Link className="button button-quiet" href={`/courses/${course.slug}`}>
                        Syllabus
                      </Link>
                      <Link
                        className="button button-primary"
                        href={`/register?course=${course.slug}`}
                      >
                        Enroll Free →
                      </Link>
                    </>
                  ) : (
                    <Link className="button button-hero-ghost" href={`/courses/${course.slug}`}>
                      Preview Track
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {visibleCourses.length === 0 && (
        <div className="empty-state">
          No courses match &ldquo;{search}&rdquo;. Clear the search input to explore available packages.
        </div>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. Coursera-Style 10-Path Interactive Curriculum Roadmap                   */
/* -------------------------------------------------------------------------- */

const HOUR_RHYTHM = [
  { mins: "12m", label: "First Principles Concept" },
  { mins: "10m", label: "Deconstructed Worked Example" },
  { mins: "13m", label: "Guided Code Analysis" },
  { mins: "18m", label: "Independent Real-World Cases" },
  { mins: "5m", label: "80% Mastery Checkpoint" },
  { mins: "2m", label: "Meta-Cognitive Review" },
];

export function CurriculumExplorer() {
  const [stageId, setStageId] = useState(1);

  const activeStage = catalog.stages.find((s) => s.id === stageId) || catalog.stages[0];
  const stageModules = catalog.modules.filter((m) => m.stage === activeStage.id);

  return (
    <section id="curriculum" className="ed-section">
      <div className="ed-section-head">
        <div>
          <span className="eyebrow">SYSTEMATIC 100-HOUR ROADMAP · PROBLEM SOLVING LAB</span>
          <h2>Explore All 10 Progressive Learning Paths</h2>
          <p>
            Designed like top engineering degree specializations. Students must master each checkpoint
            with at least 80% marks to unlock the next lesson. Module 01 is live today; Modules 02–100
            are authored and released sequentially.
          </p>
        </div>
        <Link className="button button-dark" href="/courses/problem-solving-lab">
          View Complete 100-Module Syllabus →
        </Link>
      </div>

      <div className="explorer-shell">
        <aside className="explorer-rail" aria-label="10 learning paths">
          {catalog.stages.map((stage) => {
            const isSelected = stage.id === activeStage.id;
            const liveCount = catalog.modules.filter(
              (m) => m.stage === stage.id && m.published,
            ).length;

            return (
              <button
                key={stage.id}
                type="button"
                className={`explorer-stage-btn ${isSelected ? "active" : ""}`}
                onClick={() => setStageId(stage.id)}
              >
                <span className="es-num">{String(stage.id).padStart(2, "0")}</span>
                <span className="es-copy">
                  <b>{stage.title}</b>
                  <small>{liveCount > 0 ? `${liveCount}/10 lessons live now` : "10 planned lessons"}</small>
                </span>
                <span className="es-arrow">›</span>
              </button>
            );
          })}
        </aside>

        <div className="explorer-panel">
          <div className="explorer-panel-head">
            <div>
              <span className="eyebrow">
                PATH {String(activeStage.id).padStart(2, "0")} OF 10 · 10 INTENSIVE HOURS
              </span>
              <h3>{activeStage.title}</h3>
              <p>{activeStage.description}</p>
            </div>
            <Link
              className="button button-primary"
              href="/register?course=problem-solving-lab"
            >
              Start Path 01 Free →
            </Link>
          </div>

          <div className="rhythm-strip" aria-label="One-hour lesson structure">
            {HOUR_RHYTHM.map((step) => (
              <div className="rhythm-chip" key={step.label}>
                <b>{step.mins}</b>
                <span>{step.label}</span>
              </div>
            ))}
          </div>

          <div className="explorer-modules">
            {stageModules.map((mod) => (
              <div
                key={mod.id}
                className={`em-row ${mod.published ? "em-live" : "em-planned"}`}
              >
                <span className="em-no">{String(mod.id).padStart(2, "0")}</span>
                <div className="em-copy">
                  <b>{mod.title}</b>
                  <small>{mod.objective}</small>
                </div>
                <div className="em-badges">
                  <span className="em-tier">{mod.tier}</span>
                  <span className={`syllabus-mod-state ${mod.published ? "live" : "planned"}`}>
                    {mod.published ? "Live Now" : "Planned"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. Cognitive Science & Pedagogy Section ("Why This Works")                */
/* -------------------------------------------------------------------------- */

export function PedagogySection() {
  return (
    <section id="pedagogy" className="ed-section">
      <div className="ed-section-head">
        <div>
          <span className="eyebrow">THE SCIENCE OF LEARNING</span>
          <h2>Engineered for Deep Retention, Not Surface Memory</h2>
          <p>
            Most coding tutorials encourage passive video watching that vanishes in real interviews.
            Our 100-hour system is constructed on 4 evidence-based cognitive science principles.
          </p>
        </div>
      </div>

      <div className="pedagogy-grid">
        <div className="pedagogy-card">
          <div className="pedagogy-icon">🧩</div>
          <h3>The Worked-Example Effect</h3>
          <p>
            Cognitive Load Theory proves beginners learn 3x faster when studying deconstructed worked
            solutions before writing code. We dissect exact modeling steps before testing you.
          </p>
          <div className="pedagogy-metric">300% faster concept acquisition</div>
        </div>

        <div className="pedagogy-card">
          <div className="pedagogy-icon">🛡️</div>
          <h3>80% Strict Mastery Gating</h3>
          <p>
            No skipping ahead. You cannot proceed to Module N+1 without scoring at least 80% on Module
            N&apos;s checkpoint. Compounding knowledge gaps are eliminated at the source.
          </p>
          <div className="pedagogy-metric">Zero compounding skill debt</div>
        </div>

        <div className="pedagogy-card">
          <div className="pedagogy-icon">🌐</div>
          <h3>Language-Agnostic First Principles</h3>
          <p>
            Learn invariant models, asymptotic curves, and state machines rather than language syntax.
            Your thinking immediately transfers to C++, Python, Java, Go, Rust, or JavaScript.
          </p>
          <div className="pedagogy-metric">100% language transferable</div>
        </div>

        <div className="pedagogy-card">
          <div className="pedagogy-icon">📊</div>
          <h3>Institutional-Grade Tracking</h3>
          <p>
            College faculty and placement coordinators inspect real-time cohort completion, average
            attempts, and individual milestone progress. Complete transparency for everyone.
          </p>
          <div className="pedagogy-metric">Full student &amp; admin transparency</div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. Direct Comparison: Video Bingeing vs Problem Solving Lab               */
/* -------------------------------------------------------------------------- */

export function ComparisonSection() {
  return (
    <section className="ed-section">
      <div className="ed-section-head">
        <div>
          <span className="eyebrow">DIRECT PLATFORM COMPARISON</span>
          <h2>Why Traditional Tutorials Fail You in Real Interviews</h2>
          <p>
            Here is how passive tutorial bingeing compares to our mastery-gated problem solving lab.
          </p>
        </div>
      </div>

      <div className="comparison-table-wrap">
        <table className="comparison-table">
          <thead>
            <tr>
              <th style={{ width: "32%" }}>Dimension</th>
              <th style={{ width: "34%" }}>Traditional Video Tutorials</th>
              <th style={{ width: "34%", background: "#f0faf7", color: "var(--teal)" }}>
                Problem Solving Lab (Flagship)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <b>Learning Mode</b>
              </td>
              <td>Passive video watching (illusion of competence)</td>
              <td style={{ background: "#fbfefe" }}>
                <b>Active retrieval &amp; hands-on checkpoint evaluation</b>
              </td>
            </tr>
            <tr>
              <td>
                <b>Progression Barrier</b>
              </td>
              <td>Click next anytime; zero mastery required</td>
              <td style={{ background: "#fbfefe" }}>
                <b>Strict 80% checkpoint score required to unlock next lesson</b>
              </td>
            </tr>
            <tr>
              <td>
                <b>Syntax vs Principles</b>
              </td>
              <td>Heavy syntax memorization in one chosen language</td>
              <td style={{ background: "#fbfefe" }}>
                <b>Language-independent algorithmic modeling &amp; invariants</b>
              </td>
            </tr>
            <tr>
              <td>
                <b>Mistake Diagnosis</b>
              </td>
              <td>Generic error messages or forum threads</td>
              <td style={{ background: "#fbfefe" }}>
                <b>Option-by-option explanations of why wrong answers fail</b>
              </td>
            </tr>
            <tr>
              <td>
                <b>Institutional Visibility</b>
              </td>
              <td>None; college faculty cannot verify student effort</td>
              <td style={{ background: "#fbfefe" }}>
                <b>Full Admin Portal: cohort analytics, attempts, and verification</b>
              </td>
            </tr>
            <tr>
              <td>
                <b>Cost to Students</b>
              </td>
              <td>₹4,000 – ₹25,000 subscription fees</td>
              <td style={{ background: "#fbfefe" }}>
                <b style={{ color: "var(--teal)" }}>₹0 / Free Flagship Access</b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 6. Dual-Sided Experience (Student Portal vs Admin Portal)                  */
/* -------------------------------------------------------------------------- */

export function RolePreviewTabs() {
  const [role, setRole] = useState<"student" | "admin">("student");

  return (
    <section id="platform" className="ed-section">
      <div className="ed-section-head">
        <div>
          <span className="eyebrow">DUAL-PORTAL ARCHITECTURE</span>
          <h2>Built for Both Ambitious Learners and College Mentors</h2>
          <p>
            Students always know their exact unlocked path. Placement coordinators and professors get
            a central cohort tracker with individual attempt drill-downs.
          </p>
        </div>

        <div className="role-toggle" role="tablist" aria-label="Preview platform role">
          <button
            type="button"
            role="tab"
            aria-selected={role === "student"}
            className={role === "student" ? "active" : ""}
            onClick={() => setRole("student")}
          >
            For Students
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={role === "admin"}
            className={role === "admin" ? "active" : ""}
            onClick={() => setRole("admin")}
          >
            For Faculty &amp; Admins
          </button>
        </div>
      </div>

      {role === "student" ? (
        <div className="role-showcase">
          <div className="role-benefits">
            <span className="eyebrow">STUDENT PORTAL EXPERIENCE</span>
            <h3>Track Your Growth Across 10 Progressive Paths</h3>
            <ul className="role-list">
              <li>
                <b>Mastery-gated unlocking:</b> Pass each checkpoint at 80% to open the next lesson
                automatically.
              </li>
              <li>
                <b>Multi-stage hints &amp; full solutions:</b> Open up to 3 progressive hints before
                submitting your reasoning.
              </li>
              <li>
                <b>Saved learning profile:</b> Your scores, attempt counts, and written case studies
                stay synced to your verified student account.
              </li>
            </ul>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link className="button button-primary" href="/register?course=problem-solving-lab">
                Create Free Student Account →
              </Link>
              <Link className="button" href="/login">
                Test Drive Demo Student
              </Link>
            </div>
          </div>

          <div className="mock-window" aria-label="Student portal preview">
            <div className="mock-bar">
              <span />
              <span />
              <span />
              <small>Live Student View · /portal</small>
            </div>
            <div className="mock-body">
              <div className="mock-top-row">
                <div>
                  <span className="eyebrow">ENROLLED PACKAGE · ₹0 FREE</span>
                  <h4>Problem Solving Lab</h4>
                </div>
                <span className="badge badge-live">Verified Learner</span>
              </div>
              <div className="mock-progress-box">
                <div className="mock-progress-labels">
                  <b>Module 01 Passed · 12/12 Marks (100%)</b>
                  <span>Path 01 · 1/10 Completed</span>
                </div>
                <div className="course-progress-line">
                  <span style={{ width: "20%" }} />
                </div>
              </div>
              <div className="mock-rows">
                <div className="mock-row">
                  <span>
                    <b>01 · Separate the story from the task</b>
                    <small>Mastery checkpoint passed · 12/12 marks</small>
                  </span>
                  <span className="table-status approved">Completed</span>
                </div>
                <div className="mock-row">
                  <span>
                    <b>02 · Express a task as input, rule and output</b>
                    <small>Unlocks automatically once published</small>
                  </span>
                  <span className="table-status pending">Next Lesson</span>
                </div>
                <div className="mock-row mock-row-locked">
                  <span>
                    <b>03 · Extract constraints and limits</b>
                    <small>Complete Module 02 to unlock</small>
                  </span>
                  <span className="table-status none">Locked</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="role-showcase">
          <div className="role-benefits">
            <span className="eyebrow">ADMINISTRATOR PORTAL EXPERIENCE</span>
            <h3>Complete Visibility Over Cohort Progress</h3>
            <ul className="role-list">
              <li>
                <b>Real-time cohort search:</b> Search students by register number, college, or email
                with instant status filters.
              </li>
              <li>
                <b>Enrollment mode governance:</b> Switch between <code>open</code>,{" "}
                <code>approval</code>, and <code>invite_only</code> registration modes.
              </li>
              <li>
                <b>Granular student drill-down:</b> Inspect each student&apos;s exact checkpoint attempts,
                timestamps, and written responses.
              </li>
            </ul>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link className="button button-dark" href="/login">
                Test Drive Demo Admin →
              </Link>
              <Link className="button" href="/courses/problem-solving-lab">
                Inspect Curriculum
              </Link>
            </div>
          </div>

          <div className="mock-window" aria-label="Admin portal preview">
            <div className="mock-bar">
              <span />
              <span />
              <span />
              <small>Live Administrator View · /admin/students</small>
            </div>
            <div className="mock-body">
              <div className="mock-top-row">
                <div>
                  <span className="eyebrow">COHORT TRACKER · 48 REGISTERED</span>
                  <h4>Registered Students</h4>
                </div>
                <span className="badge badge-category">Mode: Approval</span>
              </div>
              <div className="mock-rows">
                <div className="mock-row">
                  <span>
                    <b>Aditya Sharma · NIT Trichy</b>
                    <small>Module 01 completed · 12/12 marks · 1 attempt</small>
                  </span>
                  <span className="table-status approved">Approved</span>
                </div>
                <div className="mock-row">
                  <span>
                    <b>Sneha Ramanathan · PSG Tech</b>
                    <small>Module 01 completed · 12/12 marks · 2 attempts</small>
                  </span>
                  <span className="table-status approved">Approved</span>
                </div>
                <div className="mock-row">
                  <span>
                    <b>Rahul Verma · DTU Delhi</b>
                    <small>B.Tech IT · Profile pending admin approval</small>
                  </span>
                  <span className="table-status pending">Review →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 7. Verified Student Reviews & Testimonials                                 */
/* -------------------------------------------------------------------------- */

const TESTIMONIALS = [
  {
    name: "Aditya Sharma",
    role: "B.Tech CSE '26 · NIT Trichy",
    avatar: "AS",
    rating: 5,
    text: "The language-independent approach changed everything. I used to memorize Java syntax for LeetCode problems and choke during interviews. The worked-example breakdowns in Module 01 taught me how to extract the mathematical task before touching a keyboard.",
  },
  {
    name: "Sneha Ramanathan",
    role: "B.E. Computer Science '26 · PSG Tech",
    avatar: "SR",
    rating: 5,
    text: "Having the 80% mastery checkpoint gate makes sure you don't fool yourself into thinking you understood a concept when you really didn't. The option explanations are incredibly thorough.",
  },
  {
    name: "Dr. K. Sundaram",
    role: "Placement Faculty Coordinator · Anna University",
    avatar: "KS",
    rating: 5,
    text: "As an administrator, the cohort tracking table gives our department full visibility. We can see which students completed their diagnostic modules and verify their actual attempts and scores in real time.",
  },
];

export function TestimonialSection() {
  return (
    <section className="ed-section">
      <div className="ed-section-head">
        <div>
          <span className="eyebrow">STUDENT &amp; FACULTY TESTIMONIALS</span>
          <h2>Validated by Top Campus Engineers</h2>
          <p>Read what students and placement coordinators say about our structured learning engine.</p>
        </div>
      </div>

      <div className="testimonial-grid">
        {TESTIMONIALS.map((t, idx) => (
          <div className="testimonial-card" key={idx}>
            <div className="testimonial-stars">{"★".repeat(t.rating)}</div>
            <p className="testimonial-quote">&ldquo;{t.text}&rdquo;</p>
            <div className="testimonial-author">
              <div className="author-avatar">{t.avatar}</div>
              <div>
                <b>{t.name}</b>
                <small>{t.role}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 8. Objection-Handling FAQ Accordion                                        */
/* -------------------------------------------------------------------------- */

const FAQS = [
  {
    q: "Is the Problem Solving Lab course package genuinely 100% free?",
    a: "Yes. Problem Solving Lab is completely free (₹0) for students. There are no hidden fees, paywalls, or credit card requirements. Depending on your institution's registration configuration, your registration will either be approved immediately or reviewed by your campus coordinator.",
  },
  {
    q: "How much of the 100-hour curriculum is published right now?",
    a: "The full 100-module syllabus architecture and mastery-gated learning engine are deployed. Module 01 (Separate the story from the task) is published with its comprehensive lesson, interactive activities, and database-scored 6-question checkpoint. Modules 02–100 are sequentially authored and published.",
  },
  {
    q: "Do I need prior experience with a specific programming language?",
    a: "No. Problem Solving Lab is purposefully language-independent. The focus is on problem extraction, data representation, invariant reasoning, and asymptotic complexity—skills that transfer directly to Python, C++, Java, Go, Rust, or JavaScript.",
  },
  {
    q: "How do the 80% mastery checkpoint gates work?",
    a: "At the end of each module, you take an interactive checkpoint. You can open up to 3 progressive hints if you need guidance. Scoring 80% or higher automatically unlocks the next lesson in the sequence.",
  },
  {
    q: "How can college mentors and placement cells track students?",
    a: "Administrators have a dedicated hub (/admin) with live cohort analytics, a searchable student records table (/admin/students), registration mode controls, and individual student progress drill-downs.",
  },
  {
    q: "How is this platform connected to Supabase?",
    a: "The platform is engineered with modern Next.js 16 SSR + Supabase Auth. It stores student profiles, enrollment approvals, lesson progress, and checkpoint attempts securely in PostgreSQL with Row Level Security (RLS). A local dev mode is also provided for instant testing.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="ed-section">
      <div className="ed-section-head">
        <div>
          <span className="eyebrow">FREQUENTLY ASKED QUESTIONS</span>
          <h2>Everything You Need to Know</h2>
        </div>
      </div>

      <div className="faq-list">
        {FAQS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div className={`faq-item ${isOpen ? "open" : ""}`} key={item.q}>
              <button
                type="button"
                className="faq-trigger"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : idx)}
              >
                <span>{item.q}</span>
                <span className="faq-icon" aria-hidden="true">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {isOpen && <div className="faq-answer">{item.a}</div>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
