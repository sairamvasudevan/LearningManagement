"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import type { ModuleCurriculum } from "@/lib/curriculum-data";

type Review = {
  is_correct: boolean;
  selected_index: number;
  correct_index: number;
  marks_awarded: number;
  max_marks: number;
  explanation: string;
  option_explanations: string[];
};

export function ModulePlayer({
  curriculum,
}: {
  curriculum: ModuleCurriculum;
}) {
  const {
    moduleNumber,
    stageTitle,
    title,
    objective,
    readTime,
    sections,
    caseStudies,
    checklist,
    practiceTask,
    questions,
  } = curriculum;

  const [mode, setMode] = useState<"content" | "assessment" | "result">("content");
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [reviews, setReviews] = useState<Record<string, Review>>({});
  const [hintOpen, setHintOpen] = useState<Record<string, number[]>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [activeChecklist, setActiveChecklist] = useState<Record<number, boolean>>({});

  // Hands-on practice task state
  const [taskInput, setTaskInput] = useState(practiceTask.starterTemplate);
  const [taskSubmitting, setTaskSubmitting] = useState(false);
  const [taskSubmitted, setTaskSubmitted] = useState(false);
  const [taskSavedMsg, setTaskSavedMsg] = useState("");

  const [result, setResult] = useState<{
    score: number;
    total_marks: number;
    pass_percent: number;
    passed: boolean;
  } | null>(null);

  const question = questions[index];
  const currentReview = question ? reviews[question.question_id] : undefined;
  const score = Object.values(reviews).reduce((n, r) => n + r.marks_awarded, 0);
  const total = questions.reduce((n, q) => n + q.marks, 0);

  const beginAssessment = useCallback(() => {
    if (!questions.length) {
      setError("The assessment questions have not been published yet.");
      return;
    }
    setAttemptId(`att-mod-${moduleNumber}-${Date.now()}`);
    setMode("assessment");
    setIndex(0);
    setError("");
  }, [moduleNumber, questions]);

  function submitCurrentAnswer() {
    if (!question || selected[question.question_id] === undefined || !attemptId || currentReview)
      return;

    const chosenIdx = selected[question.question_id];
    const targetCorrect = question.correct_index;
    const isCorrect = chosenIdx === targetCorrect;

    const review: Review = {
      is_correct: isCorrect,
      selected_index: chosenIdx,
      correct_index: targetCorrect,
      marks_awarded: isCorrect ? question.marks : 0,
      max_marks: question.marks,
      explanation: question.explanation,
      option_explanations: question.option_explanations,
    };

    setReviews((current) => ({ ...current, [question.question_id]: review }));
  }

  async function finishAssessment() {
    if (!attemptId || Object.keys(reviews).length !== questions.length) return;
    setBusy(true);
    setError("");

    const finalScore = Object.values(reviews).reduce((sum, r) => sum + r.marks_awarded, 0);
    const passThreshold = 80;
    const passed = (finalScore / total) * 100 >= passThreshold;

    setResult({
      score: finalScore,
      total_marks: total,
      pass_percent: passThreshold,
      passed,
    });

    try {
      // Persist progress to SQLite database via /api/auth/session
      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_progress",
          moduleNumber,
          score: finalScore,
          totalMarks: total,
          passed,
          answers: selected,
        }),
      });
    } catch {
      // non-fatal network error
    } finally {
      setMode("result");
      setBusy(false);
    }
  }

  async function submitPractice() {
    if (!taskInput.trim()) return;
    setTaskSubmitting(true);
    setTaskSavedMsg("");
    try {
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit_practice_task",
          moduleNumber,
          taskId: practiceTask.id,
          taskPrompt: practiceTask.prompt,
          submission: taskInput.trim(),
        }),
      });
      if (res.ok) {
        setTaskSubmitted(true);
        setTaskSavedMsg("✓ Solution successfully recorded in your academic profile.");
      } else {
        setTaskSavedMsg("Could not record solution. Please try again.");
      }
    } catch {
      setTaskSavedMsg("Submission network error.");
    } finally {
      setTaskSubmitting(false);
    }
  }

  function toggleHint(hintIndex: number) {
    if (!question) return;
    setHintOpen((current) => {
      const old = current[question.question_id] || [];
      return {
        ...current,
        [question.question_id]: old.includes(hintIndex)
          ? old.filter((x) => x !== hintIndex)
          : [...old, hintIndex],
      };
    });
  }

  /* -------------------------------------------------------------
     MODE 1: NATIVE RICH READING CONTENT & HANDS-ON WORKSPACE
  ------------------------------------------------------------- */
  if (mode === "content") {
    return (
      <div className="module-reader-shell">
        {/* Top Reader Navigation Bar */}
        <header className="reader-top-bar">
          <div className="reader-top-left">
            <Link href="/portal" className="reader-back-btn">
              ← Return to Dashboard
            </Link>
            <div className="reader-badge-wrap">
              <span className="badge-flame">Stage 01</span>
              <span className="badge-category">Module {String(moduleNumber).padStart(2, "0")} of 100</span>
            </div>
          </div>
          <button
            type="button"
            className="button button-cn-primary"
            onClick={beginAssessment}
            disabled={busy}
          >
            🎯 Jump to Checkpoint ({questions.length} Qs) →
          </button>
        </header>

        {/* Hero Article Header */}
        <div className="reader-hero">
          <span className="reader-eyebrow">{stageTitle}</span>
          <h1>{title}</h1>
          <p className="reader-lead">{objective}</p>
          <div className="reader-meta-pills">
            <span>⏱️ {readTime}</span>
            <span>🧩 {caseStudies.length} Real-World Case Studies</span>
            <span>💻 Hands-on Practice Task</span>
            <span>🎓 {questions.length} Mastery Checkpoint Questions</span>
          </div>
        </div>

        {/* Main Article Body */}
        <article className="reader-article">
          {/* Dynamic Curriculum Sections */}
          {sections.map((section, sIdx) => (
            <section key={sIdx} className="reader-section">
              <div className="section-kicker">{section.kicker}</div>
              <h2>{section.title}</h2>
              {section.content.map((para, pIdx) => (
                <p key={pIdx} style={{ whiteSpace: "pre-line" }}>{para}</p>
              ))}

              {section.callout && (
                <div
                  className={`callout-box ${
                    section.callout.type === "warning"
                      ? "warning-callout"
                      : section.callout.type === "tip"
                        ? "tip-callout"
                        : "rule-callout"
                  }`}
                >
                  <b>
                    {section.callout.type === "warning"
                      ? "⚠️"
                      : section.callout.type === "tip"
                        ? "💡"
                        : "📌"}{" "}
                    {section.callout.title}
                  </b>
                  <p>{section.callout.text}</p>
                </div>
              )}
            </section>
          ))}

          {/* Worked Case Studies */}
          {caseStudies.length > 0 && (
            <section className="reader-section">
              <div className="section-kicker">SECTION 03 · WORKED CASE STUDIES</div>
              <h2>De-Noising Real-World Technical Specifications</h2>

              {caseStudies.map((cs, cIdx) => (
                <div key={cIdx} className="case-study-card">
                  <div className="case-study-header">
                    <span className="case-tag">{cs.tag}</span>
                    <h4>{cs.title}</h4>
                  </div>
                  <div className="case-problem-text">&ldquo;{cs.problem}&rdquo;</div>

                  <div className="comparison-columns">
                    <div className="comparison-bad">
                      <b>❌ Common Flawed Approach:</b>
                      <p>{cs.flawedApproach}</p>
                    </div>
                    <div className="comparison-good">
                      <b>✅ The Algorithmic Invariant:</b>
                      <p>{cs.correctInvariant}</p>
                      {cs.codeOrContract && (
                        <div className="code-snippet-box">
                          <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
                            <code>{cs.codeOrContract}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Interactive Senior Engineer Checklist */}
          {checklist.length > 0 && (
            <section className="reader-section">
              <div className="section-kicker">SECTION 04 · SENIOR ENGINEER VERIFICATION CHECKLIST</div>
              <h2>Self-Review Checklist Before Writing Code</h2>
              <p>Before jumping into data structures or loops, check off these foundational verifications:</p>

              <div className="checklist-container">
                {checklist.map((item, chIdx) => (
                  <label
                    key={chIdx}
                    className={`checklist-item ${activeChecklist[chIdx] ? "checked" : ""}`}
                    onClick={() =>
                      setActiveChecklist((prev) => ({ ...prev, [chIdx]: !prev[chIdx] }))
                    }
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(activeChecklist[chIdx])}
                      onChange={() => {}}
                    />
                    <div>
                      <b>{item}</b>
                      <small>Verification principle {chIdx + 1}</small>
                    </div>
                  </label>
                ))}
              </div>
            </section>
          )}

          {/* SECTION 05: HANDS-ON PRACTICE TASK */}
          <section className="reader-section practice-task-section">
            <div className="section-kicker">SECTION 05 · HANDS-ON PRACTICE TASK</div>
            <h2>{practiceTask.title}</h2>

            <div className="practice-scenario-box">
              <div className="practice-badge">Engineering Scenario Specification</div>
              <p>{practiceTask.scenario}</p>
              <div className="practice-prompt">
                <b>Your Task:</b> {practiceTask.prompt}
              </div>
            </div>

            <div className="practice-workspace">
              <div className="workspace-header">
                <span>💻 Student Solution Workspace</span>
                <span className="char-count">{taskInput.length} characters</span>
              </div>
              <textarea
                className="practice-textarea"
                rows={9}
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="Write your contract, invariant formulation, or edge case analysis here..."
              />
              <div className="workspace-footer">
                <button
                  type="button"
                  className="button button-cn-primary"
                  onClick={() => void submitPractice()}
                  disabled={taskSubmitting || !taskInput.trim()}
                >
                  {taskSubmitting
                    ? "Recording..."
                    : taskSubmitted
                      ? "✓ Update Solution & Re-Check"
                      : "Submit Solution & Reveal Model Benchmark →"}
                </button>
                {taskSavedMsg && <span className="task-success-pill">{taskSavedMsg}</span>}
              </div>
            </div>

            {taskSubmitted && (
              <div className="model-solution-reveal">
                <div className="solution-header">
                  <span className="badge-flame">SENIOR ARCHITECT BENCHMARK</span>
                  <h3>Official Model Solution &amp; Evaluation Rubric</h3>
                </div>
                <div className="model-code-box">
                  <pre>
                    <code>{practiceTask.modelSolution}</code>
                  </pre>
                </div>
                <div className="rubric-checklist">
                  <b>Self-Grading Rubric:</b>
                  <ul>
                    {practiceTask.rubric.map((r, rIdx) => (
                      <li key={rIdx}>✓ {r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </section>

          {/* Section 6: Transition to Mastery Checkpoint */}
          <div className="checkpoint-cta-box">
            <div className="cta-box-content">
              <span className="badge-flame">VERIFY YOUR MASTERY</span>
              <h2>Ready for the Module {String(moduleNumber).padStart(2, "0")} Mastery Checkpoint?</h2>
              <p>
                Test your invariant identification and formulation skills against {questions.length} realistic
                engineering scenarios. 80% score required to earn the mastery badge.
              </p>
              <div className="checkpoint-metrics-row">
                <span>📝 {questions.length} Questions</span>
                <span>⭐ {total} Total Marks</span>
                <span>💡 Clickable Socratic Hints</span>
                <span>🎯 Instant Senior Explanations</span>
              </div>
            </div>
            <button
              type="button"
              className="button button-cn-primary button-large"
              onClick={beginAssessment}
              disabled={busy}
            >
              🚀 Start Mastery Checkpoint →
            </button>
          </div>
        </article>
      </div>
    );
  }

  /* -------------------------------------------------------------
     MODE 2: MASTERY CHECKPOINT RESULT
  ------------------------------------------------------------- */
  if (mode === "result" && result) {
    const nextMod = moduleNumber + 1;
    return (
      <div className="result-screen">
        <span className="eyebrow">MODULE {String(moduleNumber).padStart(2, "0")} · RESULT</span>
        <div className={`result-orb ${result.passed ? "success" : "failure"}`}>
          {result.score}
          <small> / {result.total_marks}</small>
        </div>
        <h1>{result.passed ? "🎉 Mastery Checkpoint Passed!" : "Checkpoint Needs Review"}</h1>
        <p>
          You scored <b>{result.score} out of {result.total_marks} marks</b> (
          {Math.round((result.score / result.total_marks) * 100)}%). Passing score threshold is{" "}
          {result.pass_percent}%.
        </p>
        <div className="result-actions">
          {result.passed && nextMod <= 10 && (
            <Link className="button button-cn-primary" href={`/learn/${nextMod}`}>
              Proceed to Module {String(nextMod).padStart(2, "0")} →
            </Link>
          )}
          <Link className="button button-outline" href="/portal">
            ← Return to Student Dashboard
          </Link>
          <button
            type="button"
            className="button button-quiet"
            onClick={() => {
              setMode("content");
              setResult(null);
              setReviews({});
              setSelected({});
              setAttemptId(null);
            }}
          >
            Review Lesson Material &amp; Retry
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     MODE 3: MASTERY CHECKPOINT QUESTIONS
     (With interactive clickable hints and instant evaluation)
  ------------------------------------------------------------- */
  if (!question) {
    return (
      <div className="surface-card" style={{ maxWidth: 600, margin: "60px auto", padding: 30 }}>
        <p>No assessment questions are published for this lesson yet.</p>
        <Link href="/portal" className="button button-primary">
          Return to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="assessment-shell">
      {/* Top Bar */}
      <div className="assessment-top">
        <div>
          <span className="eyebrow">
            STAGE 01 · MODULE {String(moduleNumber).padStart(2, "0")} CHECKPOINT
          </span>
          <b>{title}</b>
        </div>
        <div className="assessment-score">
          Current Score:{" "}
          <strong>
            {score}/{total} Marks
          </strong>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="assessment-progress">
        <span style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
      </div>

      <div className="assessment-meta">
        <span>
          Question {index + 1} of {questions.length} · {question.title}
        </span>
        <span className="mark-chip">{question.marks} marks</span>
      </div>

      {/* Question Card */}
      <section className="question-card">
        <div className="question-label">Read the scenario · reason before selecting</div>
        <h1>{question.prompt}</h1>

        {/* Options List */}
        <div className="option-list">
          {question.options.map((option, i) => {
            const chosen = selected[question.question_id] === i;
            const correct = currentReview?.correct_index === i;
            const wrong = currentReview?.selected_index === i && !currentReview.is_correct;
            return (
              <button
                key={i}
                type="button"
                className={`option-button ${chosen ? "selected" : ""} ${
                  correct ? "option-correct" : ""
                } ${wrong ? "option-wrong" : ""}`}
                disabled={Boolean(currentReview)}
                onClick={() =>
                  setSelected((current) => ({ ...current, [question.question_id]: i }))
                }
              >
                <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                <span>{option}</span>
                <span className="option-indicator">
                  {correct ? "✓" : wrong ? "×" : chosen ? "●" : ""}
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive Clickable Hints */}
        <div className="interactive-hints-wrap">
          <div className="hints-header">
            <span className="hints-icon">💡</span>
            <b>Socratic Guidance &amp; Hints</b>
            <small>Click any hint to reveal guidance. Hints do not penalize your score.</small>
          </div>
          <div className="hint-cards-grid">
            {question.hints.map((hint, i) => {
              const open = (hintOpen[question.question_id] || []).includes(i);
              return (
                <div key={i} className={`hint-card-item ${open ? "hint-card-open" : ""}`}>
                  <button
                    type="button"
                    onClick={() => toggleHint(i)}
                    className="hint-card-btn"
                    aria-expanded={open}
                  >
                    <span className="hint-bulb">💡</span>
                    <span className="hint-title">Hint {i + 1}</span>
                    <span className="hint-action">{open ? "Hide Hint ▲" : "Reveal Guidance ▼"}</span>
                  </button>
                  {open && (
                    <div className="hint-card-body">
                      <p>{hint}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Instant Review & Explanation */}
        {currentReview && (
          <div
            className={`answer-explanation ${
              currentReview.is_correct ? "answer-good" : "answer-review"
            }`}
          >
            <div className="answer-heading">
              <b>{currentReview.is_correct ? "✓ Correct Answer" : "⚠️ Review Expected Invariant"}</b>
              <span>
                {currentReview.marks_awarded} / {currentReview.max_marks} marks awarded
              </span>
            </div>
            <p>
              <b>Explanation:</b> {currentReview.explanation}
            </p>
            <details style={{ marginTop: 8 }}>
              <summary style={{ cursor: "pointer", fontWeight: 700, color: "var(--teal)" }}>
                View analysis of all options
              </summary>
              <ul style={{ paddingLeft: 20, margin: "8px 0 0" }}>
                {currentReview.option_explanations.map((text, i) => (
                  <li key={i} style={{ margin: "5px 0", fontSize: 13 }}>
                    <b>Option {String.fromCharCode(65 + i)}:</b> {text}
                  </li>
                ))}
              </ul>
            </details>
          </div>
        )}

        {/* Submit or Navigation Row */}
        <div className="submit-answer-row">
          {!currentReview ? (
            <button
              type="button"
              className="button button-cn-primary"
              disabled={selected[question.question_id] === undefined || busy}
              onClick={submitCurrentAnswer}
            >
              Submit Answer · {question.marks} Marks
            </button>
          ) : (
            <div className="quiz-nav-group">
              <button
                type="button"
                className="button button-outline button-small"
                disabled={index === 0}
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
              >
                ← Previous
              </button>
              {index < questions.length - 1 ? (
                <button
                  type="button"
                  className="button button-cn-primary button-small"
                  onClick={() => setIndex((i) => i + 1)}
                >
                  Next Question →
                </button>
              ) : (
                <button
                  type="button"
                  className="button button-cn-primary button-small"
                  onClick={() => void finishAssessment()}
                  disabled={busy}
                >
                  {busy ? "Finalizing…" : "View Checkpoint Score & Results →"}
                </button>
              )}
            </div>
          )}
          {error && <span className="field-error-text">{error}</span>}
        </div>
      </section>
    </div>
  );
}
