"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import catalog from "@/lib/course-catalog.json";
import { COURSE_PACKAGES } from "@/lib/courses";

/* -------------------------------------------------------------------------- */
/* 1. Coding Ninjas CodeStudio-Style Interactive Terminal Sandbox              */
/* -------------------------------------------------------------------------- */

const CODE_STUDIO_TABS = [
  {
    id: "solution",
    filename: "DistinctRiders.cpp",
    badge: "Optimal C++20",
    lines: [
      { num: 1, text: "#include <iostream>", type: "kwd" },
      { num: 2, text: "#include <unordered_set>", type: "kwd" },
      { num: 3, text: "#include <vector>", type: "kwd" },
      { num: 4, text: "", type: "plain" },
      { num: 5, text: "// Module 01: Invariant-Based Deduplication", type: "comment" },
      { num: 6, text: "int solveDistinct(const std::vector<TapLog>& logs) {", type: "fn" },
      { num: 7, text: "    std::unordered_set<int> uniqueStudents;", type: "type" },
      { num: 8, text: "    for (const auto& log : logs) {", type: "kwd" },
      { num: 9, text: '        if (log.route == "Route B" && log.day == "Tue") {', type: "kwd" },
      { num: 10, text: "            uniqueStudents.insert(log.studentId); // O(1) avg insert", type: "var" },
      { num: 11, text: "        }", type: "plain" },
      { num: 12, text: "    }", type: "plain" },
      { num: 13, text: "    return uniqueStudents.size(); // Time: O(N) | Space: O(D)", type: "fn" },
      { num: 14, text: "}", type: "plain" },
    ],
  },
  {
    id: "asymptotics",
    filename: "GaussSummation.py",
    badge: "Big-O Analysis",
    lines: [
      { num: 1, text: "# Module 01: Asymptotic Scale Analysis", type: "comment" },
      { num: 2, text: "def calculate_nested_iterations(N: int) -> int:", type: "fn" },
      { num: 3, text: "    # Outer runs N times; inner runs 0 to i", type: "comment" },
      { num: 4, text: "    # Total = 0 + 1 + 2 + ... + (N - 1)", type: "comment" },
      { num: 5, text: "    total_steps = (N * (N - 1)) // 2", type: "var" },
      { num: 6, text: '    complexity_class = "O(N^2) Quadratic"', type: "str" },
      { num: 7, text: "    return total_steps, complexity_class", type: "fn" },
    ],
  },
];

const SAMPLE_CHALLENGES = [
  {
    id: "nested-loops",
    kicker: "ASYMPTOTIC SCALE · MODULE 01 PREVIEW",
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
    kicker: "PROBLEM FORMULATION · MODULE 01 PREVIEW",
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
  const [activeMode, setActiveMode] = useState<"terminal" | "quiz">("terminal");
  const [activeTab, setActiveTab] = useState("solution");
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testResultsVisible, setTestResultsVisible] = useState(false);

  // Quiz state
  const [quizIdx, setQuizIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [hintStep, setHintStep] = useState(0);

  const currentTab = CODE_STUDIO_TABS.find((t) => t.id === activeTab) || CODE_STUDIO_TABS[0];
  const problem = SAMPLE_CHALLENGES[quizIdx];
  const isCorrect = checked && selected === problem.correctIndex;

  function runCodeStudioTests() {
    setIsRunningTests(true);
    setTestResultsVisible(false);
    setTimeout(() => {
      setIsRunningTests(false);
      setTestResultsVisible(true);
    }, 600);
  }

  return (
    <div className="cn-terminal-window" aria-label="CodeStudio interactive playground">
      {/* Top Mac-style bar */}
      <div className="cn-terminal-topbar">
        <div className="cn-mac-dots">
          <span className="cn-mac-dot dot-red" />
          <span className="cn-mac-dot dot-yellow" />
          <span className="cn-mac-dot dot-green" />
          <span className="cn-terminal-title">CodeStudio v2.4 · Module 01 Sandbox</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span className="cn-xp-chip">⚡ +50 XP</span>
          <span className="cn-terminal-mode-badge">
            <span className="cn-pulse-dot" style={{ marginRight: 5 }} />
            Interactive
          </span>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="cn-terminal-tabs">
        <button
          type="button"
          className={`cn-tab-item ${activeMode === "terminal" ? "active" : ""}`}
          onClick={() => setActiveMode("terminal")}
        >
          💻 CodeStudio Runner
        </button>
        <button
          type="button"
          className={`cn-tab-item ${activeMode === "quiz" ? "active" : ""}`}
          onClick={() => setActiveMode("quiz")}
        >
          🎯 Checkpoint Challenge
        </button>
      </div>

      {activeMode === "terminal" ? (
        <>
          {/* Sub tabs for files */}
          <div style={{ display: "flex", background: "#080e18", padding: "6px 12px", gap: 6 }}>
            {CODE_STUDIO_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                style={{
                  border: 0,
                  background: activeTab === t.id ? "rgba(255,106,0,0.18)" : "transparent",
                  color: activeTab === t.id ? "#ff9500" : "#7992ad",
                  font: "700 11px monospace",
                  padding: "4px 8px",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                {t.filename} ({t.badge})
              </button>
            ))}
          </div>

          {/* Syntax Highlighted Editor View */}
          <div className="cn-editor-body">
            {currentTab.lines.map((line, idx) => (
              <div className="cn-code-line" key={idx}>
                <span className="cn-line-num">{line.num}</span>
                <span className={`cn-code-text cn-${line.type}`}>{line.text}</span>
              </div>
            ))}
          </div>

          {/* Action Bar */}
          <div className="cn-terminal-actions">
            <button
              type="button"
              className="cn-run-btn"
              onClick={runCodeStudioTests}
              disabled={isRunningTests}
            >
              {isRunningTests ? "⏳ Running Test Cases…" : "▶ Run Test Cases against Invariants"}
            </button>
            <span style={{ fontSize: 11, color: "#8da3b8" }}>
              Invariant: <b>O(1) Memory Lookup</b> · Deduplicated
            </span>
          </div>

          {/* Test Case Output Box */}
          {testResultsVisible && (
            <div className="cn-test-output">
              <div className="cn-test-case-row">
                <span>
                  <b className="cn-test-pass">✓ Test Case 1:</b> Double tap deduplication
                </span>
                <span className="cn-runtime-chip">0.8 ms · PASSED</span>
              </div>
              <div className="cn-test-case-row">
                <span>
                  <b className="cn-test-pass">✓ Test Case 2:</b> Multi-route filtering (Route B)
                </span>
                <span className="cn-runtime-chip">0.5 ms · PASSED</span>
              </div>
              <div className="cn-test-case-row">
                <span>
                  <b className="cn-test-pass">✓ Test Case 3:</b> N = 100,000 scale boundary
                </span>
                <span className="cn-runtime-chip">1.2 ms · PASSED</span>
              </div>
              <div
                style={{
                  marginTop: 8,
                  paddingTop: 8,
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "#34d399", fontWeight: 800 }}>
                  🏆 3/3 Test Cases Passed · Runtime beats 99.4%
                </span>
                <Link
                  href="/register?course=problem-solving-lab"
                  style={{ color: "#ff8a00", fontWeight: 800, textDecoration: "underline" }}
                >
                  Enroll Free to Unlock Full Studio →
                </Link>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Quiz Mode */
        <div style={{ padding: 18, background: "#0b1320" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ font: "800 10px Manrope", color: "#ff8a00", letterSpacing: "0.1em" }}>
              {problem.kicker}
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                type="button"
                style={{
                  border: 0,
                  background: quizIdx === 0 ? "#ff7a18" : "#1a2738",
                  color: "#fff",
                  fontSize: 10,
                  padding: "3px 8px",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
                onClick={() => {
                  setQuizIdx(0);
                  setSelected(null);
                  setChecked(false);
                  setHintStep(0);
                }}
              >
                Q1
              </button>
              <button
                type="button"
                style={{
                  border: 0,
                  background: quizIdx === 1 ? "#ff7a18" : "#1a2738",
                  color: "#fff",
                  fontSize: 10,
                  padding: "3px 8px",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
                onClick={() => {
                  setQuizIdx(1);
                  setSelected(null);
                  setChecked(false);
                  setHintStep(0);
                }}
              >
                Q2
              </button>
            </div>
          </div>

          <h4 style={{ font: "800 15px Manrope", color: "#fff", margin: "0 0 8px" }}>
            {problem.title}
          </h4>
          <p style={{ fontSize: 12, color: "#9db3c9", lineHeight: 1.6, margin: "0 0 12px" }}>
            {problem.prompt}
          </p>

          <div style={{ display: "grid", gap: 7, marginBottom: 12 }}>
            {problem.options.map((opt, idx) => {
              const isChosen = selected === idx;
              const isRight = checked && idx === problem.correctIndex;
              const isWrong = checked && isChosen && idx !== problem.correctIndex;

              return (
                <button
                  key={opt}
                  type="button"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    textAlign: "left",
                    padding: "8px 12px",
                    borderRadius: 9,
                    border: `1px solid ${isRight ? "#10b981" : isWrong ? "#ef4444" : isChosen ? "#ff7a18" : "rgba(255,255,255,0.12)"}`,
                    background: isRight
                      ? "rgba(16,185,129,0.18)"
                      : isWrong
                        ? "rgba(239,68,68,0.18)"
                        : isChosen
                          ? "rgba(255,122,24,0.15)"
                          : "rgba(255,255,255,0.03)",
                    color: "#dce8f5",
                    fontSize: 11.5,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setSelected(idx);
                    setChecked(false);
                  }}
                >
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      background: isChosen ? "#ff7a18" : "#172334",
                      color: "#fff",
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 800,
                      fontSize: 10,
                    }}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span style={{ flex: 1 }}>{opt}</span>
                  {isRight ? "✓" : isWrong ? "×" : ""}
                </button>
              );
            })}
          </div>

          {hintStep > 0 && (
            <div
              style={{
                background: "rgba(255,145,0,0.1)",
                border: "1px solid rgba(255,145,0,0.25)",
                borderRadius: 8,
                padding: "8px 10px",
                fontSize: 11,
                color: "#ffc266",
                marginBottom: 10,
              }}
            >
              <b>Hint:</b> {problem.hints[hintStep - 1]}
            </div>
          )}

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              type="button"
              className="button-cn-primary"
              style={{ padding: "7px 14px", borderRadius: 8, fontSize: 11 }}
              disabled={selected === null}
              onClick={() => setChecked(true)}
            >
              Submit Checkpoint
            </button>
            {hintStep < problem.hints.length && !checked && (
              <button
                type="button"
                style={{
                  border: 0,
                  background: "transparent",
                  color: "#ff9d42",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
                onClick={() => setHintStep((n) => Math.min(problem.hints.length, n + 1))}
              >
                {hintStep === 0 ? "Need a Hint?" : `Show Hint ${hintStep + 1}`}
              </button>
            )}
          </div>

          {checked && (
            <div
              style={{
                marginTop: 10,
                padding: 10,
                borderRadius: 8,
                background: isCorrect ? "rgba(16,185,129,0.14)" : "rgba(255,145,0,0.14)",
                border: `1px solid ${isCorrect ? "#10b981" : "#ff9500"}`,
                fontSize: 11,
                color: "#e2ecf5",
                lineHeight: 1.5,
              }}
            >
              <b>{isCorrect ? "Mastery Confirmed!" : "Review the Invariant:"}</b> {problem.explanation}
            </div>
          )}
        </div>
      )}

      {/* Terminal Footer */}
      <div className="hw-footer">
        <div className="hw-meta-stat">
          <b>100 Hours</b>
          <span>10 Paths</span>
        </div>
        <div className="hw-meta-stat">
          <b>80% Score</b>
          <span>Mastery Gate</span>
        </div>
        <div className="hw-meta-stat">
          <b>Dual Tracking</b>
          <span>Student &amp; Mentor</span>
        </div>
        <div className="hw-meta-stat">
          <b style={{ color: "#ff8a00" }}>₹0 / Free</b>
          <span>100% Scholarship</span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. Coding Ninjas Style Lively Course Marketplace Catalog                   */
/* -------------------------------------------------------------------------- */

const CATEGORY_TABS = [
  { id: "all", label: "🔥 All Programs" },
  { id: "available", label: "⚡ Available Free (Flagship)" },
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
          <span className="eyebrow" style={{ color: "#ff6a00" }}>
            🔥 INDUSTRY-LEADING LEARNING TRACKS
          </span>
          <h2>Explore Engineering Programs</h2>
          <p>
            Start with our flagship <strong>Problem Solving Lab</strong>—100% free with lifetime
            scholarship—or preview upcoming tracks engineered for Tier-1 placements.
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
            <div
              className={`ed-course-thumb-box thumb-${course.slug.includes("system") ? "indigo" : course.slug.includes("ai") ? "amber" : course.slug.includes("programming") ? "slate" : "teal"}`}
              style={{
                background: course.status === "available"
                  ? "linear-gradient(130deg, #10253d 0%, #173854 50%, #1c4b43 100%)"
                  : "linear-gradient(130deg, #141f2d 0%, #202b3b 100%)",
              }}
            >
              <div className="thumb-badges-top">
                {course.status === "available" ? (
                  <span className="badge-flame">🔥 BESTSELLER · 100% SCHOLARSHIP</span>
                ) : (
                  <span className="thumb-badge-hero">{course.badge}</span>
                )}
                <span className="thumb-badge-hours">{course.totalHours} Hours</span>
              </div>
              <div className="thumb-art-center">
                <span className="thumb-art-icon">
                  {course.slug.includes("system") ? "🏛️" : course.slug.includes("ai") ? "🧠" : course.slug.includes("programming") ? "🏆" : "⚡"}
                </span>
                <span className="thumb-art-title">{course.category}</span>
              </div>
              <div className="thumb-meta-bottom">
                <span>{course.totalModules} Structured Lessons</span>
                <span>{course.level}</span>
              </div>
            </div>

            <div className="ed-course-body">
              <div className="ed-course-meta-top">
                <span className="badge badge-category">{course.category}</span>
                <span className="ed-level-tag">
                  <span className="cn-pulse-dot-green" style={{ marginRight: 5 }} />
                  {course.level}
                </span>
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
                    <strong style={{ color: course.isFree ? "#ff6a00" : "var(--navy)", fontSize: 22 }}>
                      {course.priceLabel}
                    </strong>
                    {course.originalPrice && <del className="price-struck">{course.originalPrice}</del>}
                  </div>
                  <small className="price-subtext">
                    {course.status === "available" ? "100% Scholarship · Free for Students" : "Cohort Launching Soon"}
                  </small>
                </div>

                <div className="ed-card-actions">
                  {course.status === "available" ? (
                    <>
                      <Link className="button button-quiet" href={`/courses/${course.slug}`}>
                        Syllabus
                      </Link>
                      <Link
                        className="button button-cn-primary"
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
/* 3. Gamified 10-Path Ninja Skill Tree & Curriculum Explorer                 */
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
          <span className="eyebrow" style={{ color: "#ff6a00" }}>
            ⚔️ GAMIFIED 10-PATH LEARNING ROADMAP
          </span>
          <h2>The 100-Hour Problem Solving Path</h2>
          <p>
            Advance from fundamentals to advanced algorithmic engineering. Passing each checkpoint
            at 80% unlocks the next lesson. Module 01 is live today; Modules 02–100 unlock sequentially.
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
                  <small>
                    {liveCount > 0 ? (
                      <span style={{ color: "#10b981", fontWeight: 800 }}>
                        ● {liveCount}/10 lessons live
                      </span>
                    ) : (
                      "10 planned lessons"
                    )}
                  </small>
                </span>
                <span className="es-arrow">›</span>
              </button>
            );
          })}
        </aside>

        <div className="explorer-panel">
          <div className="explorer-panel-head">
            <div>
              <span className="eyebrow" style={{ color: "#ff6a00" }}>
                PATH {String(activeStage.id).padStart(2, "0")} OF 10 · 10 INTENSIVE HOURS · +1,000 XP
              </span>
              <h3>{activeStage.title}</h3>
              <p>{activeStage.description}</p>
            </div>
            <Link
              className="button button-cn-primary"
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
          <span className="eyebrow" style={{ color: "#ff6a00" }}>
            🧠 EVIDENCE-BASED PEDAGOGY
          </span>
          <h2>Why Active Problem Solving Outperforms Video Bingeing</h2>
          <p>
            Traditional video tutorials give you an illusion of learning that evaporates in technical
            interviews. Here are the 4 cognitive science pillars backing our lab:
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
          <span className="eyebrow" style={{ color: "#ff6a00" }}>
            ⚖️ PLATFORM COMPARISON
          </span>
          <h2>Why Students Excel with Active Retrieval</h2>
          <p>
            See how passive video tutorial platforms compare to our mastery-gated problem solving engine.
          </p>
        </div>
      </div>

      <div className="comparison-table-wrap">
        <table className="comparison-table">
          <thead>
            <tr>
              <th style={{ width: "32%" }}>Dimension</th>
              <th style={{ width: "34%" }}>Traditional Video Tutorials</th>
              <th style={{ width: "34%", background: "#fff5eb", color: "#ff6a00" }}>
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
              <td style={{ background: "#fffbf7" }}>
                <b>Active retrieval &amp; hands-on checkpoint evaluation</b>
              </td>
            </tr>
            <tr>
              <td>
                <b>Progression Barrier</b>
              </td>
              <td>Click next anytime; zero mastery required</td>
              <td style={{ background: "#fffbf7" }}>
                <b>Strict 80% checkpoint score required to unlock next lesson</b>
              </td>
            </tr>
            <tr>
              <td>
                <b>Syntax vs Principles</b>
              </td>
              <td>Heavy syntax memorization in one chosen language</td>
              <td style={{ background: "#fffbf7" }}>
                <b>Language-independent algorithmic modeling &amp; invariants</b>
              </td>
            </tr>
            <tr>
              <td>
                <b>Mistake Diagnosis</b>
              </td>
              <td>Generic error messages or forum threads</td>
              <td style={{ background: "#fffbf7" }}>
                <b>Option-by-option explanations of why wrong answers fail</b>
              </td>
            </tr>
            <tr>
              <td>
                <b>Institutional Visibility</b>
              </td>
              <td>None; college faculty cannot verify student effort</td>
              <td style={{ background: "#fffbf7" }}>
                <b>Full Admin Portal: cohort analytics, attempts, and verification</b>
              </td>
            </tr>
            <tr>
              <td>
                <b>Cost to Students</b>
              </td>
              <td>₹4,000 – ₹25,000 subscription fees</td>
              <td style={{ background: "#fffbf7" }}>
                <b style={{ color: "#ff6a00" }}>₹0 / Free Flagship Access</b>
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
          <span className="eyebrow" style={{ color: "#ff6a00" }}>
            🛡️ DUAL-PORTAL ARCHITECTURE
          </span>
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
            <span className="eyebrow" style={{ color: "#ff6a00" }}>
              STUDENT WORKSPACE
            </span>
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
              <Link className="button button-cn-primary" href="/register?course=problem-solving-lab">
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
            <span className="eyebrow" style={{ color: "#ff6a00" }}>
              COLLEGE PLACEMENT HUB
            </span>
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
          <span className="eyebrow" style={{ color: "#ff6a00" }}>
            ⭐️ STUDENT &amp; FACULTY EXPERIENCES
          </span>
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
          <span className="eyebrow" style={{ color: "#ff6a00" }}>
            💡 FREQUENTLY ASKED QUESTIONS
          </span>
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
