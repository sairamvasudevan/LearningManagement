"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type Question = {
  question_id: string;
  sort_order: number;
  title: string;
  prompt: string;
  options: string[];
  hints: string[];
  marks: number;
};

type Review = {
  is_correct: boolean;
  selected_index: number;
  correct_index: number;
  marks_awarded: number;
  max_marks: number;
  explanation: string;
  option_explanations: string[];
  already_submitted?: boolean;
};

type SavedResponse = {
  question_id: string;
  selected_index: number;
  is_correct: boolean;
  marks_awarded: number;
};

export function ModulePlayer({
  moduleNumber,
  title,
  objective,
  questions,
}: {
  moduleNumber: number;
  title: string;
  objective: string;
  questions: Question[];
}) {
  const [mode, setMode] = useState<"content" | "assessment" | "result">("content");
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [reviews, setReviews] = useState<Record<string, Review>>({});
  const [hintOpen, setHintOpen] = useState<Record<string, number[]>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [activeChecklist, setActiveChecklist] = useState<Record<number, boolean>>({});
  const [result, setResult] = useState<{
    score: number;
    total_marks: number;
    pass_percent: number;
    passed: boolean;
  } | null>(null);

  const hasSupabase = isSupabaseConfigured();
  const supabase = useMemo(() => (hasSupabase ? createClient() : null), [hasSupabase]);

  const question = questions[index];
  const currentReview = question ? reviews[question.question_id] : undefined;
  const score = Object.values(reviews).reduce((n, r) => n + r.marks_awarded, 0);
  const total = questions.reduce((n, q) => n + q.marks, 0);

  const beginAssessment = useCallback(async () => {
    if (!questions.length) {
      setError("The assessment questions have not been published yet.");
      return;
    }
    setBusy(true);
    setError("");

    if (!supabase) {
      setAttemptId("demo-attempt-001");
      setMode("assessment");
      setBusy(false);
      return;
    }

    try {
      const { data, error: rpcError } = await supabase.rpc("start_module_assessment", {
        p_module_number: moduleNumber,
      });
      if (rpcError) throw rpcError;
      const id = String(data);
      setAttemptId(id);
      const { data: saved, error: savedError } = await supabase
        .from("assessment_responses")
        .select("question_id,selected_index,is_correct,marks_awarded")
        .eq("attempt_id", id);
      if (savedError) throw savedError;
      const restored: Record<string, Review> = {};
      const choices: Record<string, number> = {};
      for (const row of (saved || []) as SavedResponse[]) {
        choices[row.question_id] = row.selected_index;
        const { data: review, error: reviewError } = await supabase.rpc(
          "submit_assessment_answer",
          {
            p_attempt_id: id,
            p_question_id: row.question_id,
            p_selected_index: row.selected_index,
          },
        );
        if (reviewError) throw reviewError;
        restored[row.question_id] = review as Review;
      }
      setSelected(choices);
      setReviews(restored);
      const firstUnanswered = questions.findIndex((q) => choices[q.question_id] === undefined);
      setIndex(firstUnanswered < 0 ? questions.length - 1 : firstUnanswered);
      setMode("assessment");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not begin the assessment.");
    } finally {
      setBusy(false);
    }
  }, [moduleNumber, questions, supabase]);

  async function submitCurrentAnswer() {
    if (!question || selected[question.question_id] === undefined || !attemptId || currentReview)
      return;
    setBusy(true);
    setError("");

    if (!supabase) {
      const chosenIdx = selected[question.question_id];
      const correctAnswers: Record<string, number> = {
        m1q01: 2,
        m1q02: 2,
        m1q03: 3,
        m1q04: 1,
        m1q05: 2,
        m1q06: 2,
      };
      const targetCorrect = correctAnswers[question.question_id] ?? 0;
      const isCorrect = chosenIdx === targetCorrect;
      const review: Review = {
        is_correct: isCorrect,
        selected_index: chosenIdx,
        correct_index: targetCorrect,
        marks_awarded: isCorrect ? question.marks : 0,
        max_marks: question.marks,
        explanation: isCorrect
          ? "Spot on! You accurately separated the underlying invariant from narrative distractors."
          : `The correct answer is Option ${String.fromCharCode(65 + targetCorrect)}. Notice the distinction between event rows and distinct underlying entity identities.`,
        option_explanations: question.options.map((_, i) =>
          i === targetCorrect
            ? "Correct: Directly targets the requested invariant without scope creep or entity confusion."
            : "Incorrect: Either confuses individual events with distinct entity identities or adds unrequested scope.",
        ),
      };
      setReviews((current) => ({ ...current, [question.question_id]: review }));
      setBusy(false);
      return;
    }

    try {
      const { data, error: rpcError } = await supabase.rpc("submit_assessment_answer", {
        p_attempt_id: attemptId,
        p_question_id: question.question_id,
        p_selected_index: selected[question.question_id],
      });
      if (rpcError) throw rpcError;
      const review = data as Review;
      setReviews((current) => ({ ...current, [question.question_id]: review }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "The answer could not be submitted.");
    } finally {
      setBusy(false);
    }
  }

  async function finishAssessment() {
    if (!attemptId || Object.keys(reviews).length !== questions.length) return;
    setBusy(true);
    setError("");

    if (!supabase) {
      const finalScore = Object.values(reviews).reduce((sum, r) => sum + r.marks_awarded, 0);
      const passThreshold = 80;
      const passed = (finalScore / total) * 100 >= passThreshold;
      setResult({
        score: finalScore,
        total_marks: total,
        pass_percent: passThreshold,
        passed,
      });

      // Persist progress to cookie session for instant portal sync
      void fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_progress",
          moduleNumber,
          score: finalScore,
          totalMarks: total,
          passed,
        }),
      });

      setMode("result");
      setBusy(false);
      return;
    }

    try {
      const { data, error: rpcError } = await supabase.rpc("finalize_module_assessment", {
        p_attempt_id: attemptId,
      });
      if (rpcError) throw rpcError;
      setResult(
        data as { score: number; total_marks: number; pass_percent: number; passed: boolean },
      );
      setMode("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not finalize the assessment.");
    } finally {
      setBusy(false);
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
     MODE 1: NATIVE RICH READING CONTENT
     (No empty video player, authoritative engineering pedagogy)
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
              <span className="badge-flame">Path 01</span>
              <span className="badge-category">Module 01 of 100</span>
            </div>
          </div>
          <button
            type="button"
            className="button button-cn-primary"
            onClick={() => void beginAssessment()}
            disabled={busy}
          >
            {busy ? "Loading Checkpoint…" : "🎯 Jump to Mastery Checkpoint (6 Qs) →"}
          </button>
        </header>

        {/* Hero Article Header */}
        <div className="reader-hero">
          <span className="reader-eyebrow">STAGE 01 · READ &amp; DEFINE THE PROBLEM</span>
          <h1>Separate the Story from the Task</h1>
          <p className="reader-lead">
            {objective ||
              "Extract the unambiguous mathematical invariant from real-world narrative camouflage before touching code or choosing data structures."}
          </p>
          <div className="reader-meta-pills">
            <span>⏱️ 20 min deep read</span>
            <span>🧩 3 Real-World Case Studies</span>
            <span>💡 4 Core Invariant Principles</span>
            <span>🎓 6 Mastery Checkpoint Questions</span>
          </div>
        </div>

        {/* Main Article Body */}
        <article className="reader-article">
          {/* Section 1 */}
          <section className="reader-section">
            <div className="section-kicker">SECTION 01 · THE PROBLEM-SOLVER&apos;S TRAP</div>
            <h2>Why 80% of Engineers Fail Before Writing Code</h2>
            <p>
              In software engineering interviews and real-world system architecture, problems rarely arrive as
              clean mathematical definitions like <i>&quot;Find the cardinality of the union of sets.&quot;</i>
            </p>
            <p>
              Instead, they are delivered as dense stories wrapped in business narratives: e-commerce inventory
              rules, ride-hailing peak pricing dispatch logs, museum visitor turnstile events, or warehouse supply chain
              orders.
            </p>
            <div className="callout-box warning-callout">
              <b>⚠️ The Junior Developer Mistake</b>
              <p>
                Junior engineers begin writing classes for &quot;Visitor&quot;, &quot;Camera&quot;, or &quot;Turnstile&quot;,
                accidentally modelling the story rather than determining the mathematical invariant requested.
              </p>
            </div>
            <p>
              To solve complex technical challenges with high velocity, you must develop an instinct to strip away
              the narrative distractors and formulate a <b>formal Input-Rule-Output contract</b>.
            </p>
          </section>

          {/* Section 2 */}
          <section className="reader-section">
            <div className="section-kicker">SECTION 02 · CORE PEDAGOGY</div>
            <h2>The 3 Invariant Extraction Principles</h2>

            <div className="principles-grid">
              <div className="principle-card">
                <div className="principle-num">01</div>
                <h3>Entity vs. Event</h3>
                <p>
                  <b>An Event</b> is a single log row (e.g. RFID badge scan, clickstream ping).
                  <br />
                  <b>An Entity</b> is the unique real-world actor being measured (e.g. the distinct human visitor).
                </p>
                <div className="principle-rule">
                  Rule: Multiple events can belong to one entity. Counting records is NOT counting entities!
                </div>
              </div>

              <div className="principle-card">
                <div className="principle-num">02</div>
                <h3>Preconditions vs. Assumptions</h3>
                <p>
                  Separate what the problem statement <i>explicitly guarantees</i> from what you are tempted to
                  assume.
                </p>
                <div className="principle-rule">
                  Rule: Never assume inputs are sorted, unique, or non-empty unless guaranteed by the specification.
                </div>
              </div>

              <div className="principle-card">
                <div className="principle-num">03</div>
                <h3>Observable Output Contract</h3>
                <p>
                  Define the exact return type required (e.g., scalar integer count, boolean flag, sorted list of
                  identifiers) without prematurely specifying the algorithm or data structure.
                </p>
                <div className="principle-rule">
                  Rule: Focus on WHAT must be returned, not the specific hash map or loop used to compute it.
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Worked Examples */}
          <section className="reader-section">
            <div className="section-kicker">SECTION 03 · WORKED CASE STUDIES</div>
            <h2>De-Noising Real-World Technical Specifications</h2>

            <div className="case-study-card">
              <div className="case-study-header">
                <span className="case-tag">CASE STUDY A · E-COMMERCE MIDNIGHT FLASH SALE</span>
                <h4>The Order Log Aggregator</h4>
              </div>
              <div className="case-problem-text">
                &ldquo;An online retail platform logs checkout orders. Each entry contains customer ID, order ID,
                timestamp, and product SKU list. During the midnight sale, a single customer may place multiple orders,
                and each order can contain multiple items. The VP of Growth asks: <b>&lsquo;How many different customers made
                at least one purchase on June 12?&rsquo;</b>&rdquo;
              </div>

              <div className="comparison-columns">
                <div className="comparison-bad">
                  <b>❌ Common Flawed Interpretations:</b>
                  <ul>
                    <li>Counting total product line items sold on June 12 (confuses SKU lines with customers).</li>
                    <li>Counting distinct order IDs placed on June 12 (one customer may place 4 orders!).</li>
                    <li>Sending follow-up emails to customers who didn&apos;t purchase (scope creep).</li>
                  </ul>
                </div>
                <div className="comparison-good">
                  <b>✅ The Algorithmic Invariant:</b>
                  <div className="code-snippet-box">
                    <code>
                      Result = Count( Unique( Customer_IDs where Date(timestamp) == &quot;2026-06-12&quot; ) )
                    </code>
                  </div>
                  <p>
                    <b>Entity:</b> Customer Identity · <b>Predicate:</b> Date == June 12 · <b>Aggregation:</b> Distinct Count.
                  </p>
                </div>
              </div>
            </div>

            <div className="case-study-card">
              <div className="case-study-header">
                <span className="case-tag">CASE STUDY B · HARDWARE SENSOR DEBOUNCING</span>
                <h4>The Metro Gate Debounce Anomaly</h4>
              </div>
              <div className="case-problem-text">
                &ldquo;A rapid transit station uses optical sensor turnstiles. When a commuter passes through, the gate
                sensor occasionally fires 2 or 3 times in rapid succession (&lt; 200ms) due to mechanical vibrations.
                The operations manager asks: <b>&lsquo;How many distinct passengers entered between 08:00 and 09:00?&rsquo;</b>&rdquo;
              </div>
              <div className="comparison-columns">
                <div className="comparison-bad">
                  <b>❌ Flawed Approach:</b>
                  <p>Counting the total sensor beam pulses. This over-counts commuters by 150–200%!</p>
                </div>
                <div className="comparison-good">
                  <b>✅ Algorithmic Invariant:</b>
                  <p>
                    Filter scan events by time window, group by <code>commuter_card_id</code>, and count distinct identities.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Interactive Senior Engineer Checklist */}
          <section className="reader-section">
            <div className="section-kicker">SECTION 04 · SELF-ASSESSMENT CHECKLIST</div>
            <h2>Senior Engineer&apos;s 4-Question Invariant Checklist</h2>
            <p>Before writing code in an interview or project, verify these four questions:</p>

            <div className="checklist-container">
              {[
                {
                  id: 1,
                  title: "What is the single physical entity being counted or transformed?",
                  desc: "Is it the order, the product, the customer, or the sensor scan event?",
                },
                {
                  id: 2,
                  title: "What are the explicit bounds and guarantees?",
                  desc: "Are inputs guaranteed to be non-empty? Can duplicate IDs exist?",
                },
                {
                  id: 3,
                  title: "What represents unrequested scope creep?",
                  desc: "Are you adding sorting, logging, or messaging workflows not requested by the user?",
                },
                {
                  id: 4,
                  title: "Can you state the task in exactly one unambiguous sentence?",
                  desc: "e.g. 'Return the number of unique customer IDs with orders on June 12.'",
                },
              ].map((item) => (
                <label
                  key={item.id}
                  className={`checklist-item ${activeChecklist[item.id] ? "checked" : ""}`}
                  onClick={() =>
                    setActiveChecklist((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                  }
                >
                  <input
                    type="checkbox"
                    checked={Boolean(activeChecklist[item.id])}
                    onChange={() => {}}
                  />
                  <div>
                    <b>{item.title}</b>
                    <small>{item.desc}</small>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Section 5: Transition to Checkpoint */}
          <div className="checkpoint-cta-box">
            <div className="cta-box-content">
              <span className="badge-flame">VERIFY YOUR MASTERY</span>
              <h2>Ready for the Module 01 Mastery Checkpoint?</h2>
              <p>
                Test your invariant identification skills against 6 realistic engineering scenarios.
                80% score required to earn the Module 01 mastery badge.
              </p>
              <div className="checkpoint-metrics-row">
                <span>📝 6 Questions</span>
                <span>⭐ 12 Total Marks</span>
                <span>💡 Clickable Socratic Hints</span>
                <span>🎯 Instant Grading &amp; Review</span>
              </div>
            </div>
            <button
              type="button"
              className="button button-cn-primary button-large"
              onClick={() => void beginAssessment()}
              disabled={busy}
            >
              {busy ? "Loading Checkpoint…" : "🚀 Start Mastery Checkpoint →"}
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
          <Link className="button button-cn-primary" href="/portal">
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
            Review Lesson Material
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
            PATH 01 · MODULE {String(moduleNumber).padStart(2, "0")} MASTERY CHECKPOINT
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
                className={`option-button ${chosen ? "selected" : ""} ${correct ? "option-correct" : ""} ${wrong ? "option-wrong" : ""}`}
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
            className={`answer-explanation ${currentReview.is_correct ? "answer-good" : "answer-review"}`}
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
              onClick={() => void submitCurrentAnswer()}
            >
              {busy ? "Evaluating…" : `Submit Answer · ${question.marks} Marks`}
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
