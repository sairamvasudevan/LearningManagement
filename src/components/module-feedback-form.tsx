"use client";

import { useState, useEffect } from "react";

type DifficultyLevel = "too_easy" | "just_right" | "too_hard";

const HELPFULNESS_LABELS: Record<number, string> = {
  1: "Needs substantial revision",
  2: "Somewhat helpful",
  3: "Good conceptual foundation",
  4: "Very clear & actionable",
  5: "Exceptional / Masterclass quality",
};

const EASE_LABELS: Record<number, string> = {
  1: "Frustrating / Difficult to use",
  2: "Clunky / Needs polishing",
  3: "Acceptable",
  4: "Smooth & responsive",
  5: "Delightful & intuitive",
};

export function ModuleFeedbackForm({
  moduleNumber,
  defaultExpanded = true,
  currentUser,
  onFeedbackSaved,
}: {
  moduleNumber: number;
  defaultExpanded?: boolean;
  currentUser?: {
    id: string;
    name: string;
    email: string;
    role: string;
    college?: string;
  };
  onFeedbackSaved?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(defaultExpanded);
  const [helpfulness, setHelpfulness] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("just_right");
  const [easeOfUse, setEaseOfUse] = useState<number>(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [hoveredHelpfulness, setHoveredHelpfulness] = useState<number | null>(null);
  const [hoveredEase, setHoveredEase] = useState<number | null>(null);
  const [reviewer, setReviewer] = useState(currentUser || null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(Boolean(currentUser));

  // Fetch student's existing feedback for this module if already submitted
  useEffect(() => {
    let cancelled = false;
    async function loadExisting() {
      try {
        const res = await fetch(`/api/feedback?moduleNumber=${moduleNumber}`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) {
            if (data.authenticated === false) {
              setIsAuthenticated(false);
            } else if (data.authenticated === true) {
              setIsAuthenticated(true);
              if (data.user) setReviewer(data.user);
            }
            if (data.feedback) {
              setHelpfulness(data.feedback.helpfulness_rating || 5);
              setDifficulty(data.feedback.difficulty_level || "just_right");
              setEaseOfUse(data.feedback.ease_of_use_rating || 5);
              setFeedbackText(data.feedback.feedback_text || "");
              setSubmitted(true);
            }
          }
        }
      } catch {
        // non-fatal
      }
    }
    loadExisting();
    return () => {
      cancelled = true;
    };
  }, [moduleNumber]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleNumber,
          helpfulnessRating: helpfulness,
          difficultyLevel: difficulty,
          easeOfUseRating: easeOfUse,
          feedbackText: feedbackText.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit feedback");
      }

      setSubmitted(true);
      if (onFeedbackSaved) onFeedbackSaved();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Network error submitting feedback.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="module-feedback-card" aria-label="Module feedback and evaluation">
      {/* Header Bar */}
      <div className="feedback-card-header">
        <div className="feedback-header-left">
          <div className="feedback-badge-row">
            <span className="feedback-eyebrow">CONTINUOUS PLATFORM UPGRADE</span>
            <span className="feedback-tag">Module {String(moduleNumber).padStart(2, "0")} Telemetry</span>
          </div>
          <h3 className="feedback-title">Rate Content Quality &amp; User-Friendliness</h3>
          <p className="feedback-desc">
            Your feedback directly drives curriculum updates, difficulty calibration, and platform improvements.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="feedback-toggle-btn"
          aria-expanded={isOpen}
        >
          {isOpen ? "Collapse Feedback ▲" : "Provide Feedback ▼"}
        </button>
      </div>

      {isOpen && (
        <div className="feedback-card-content">
          {!isAuthenticated ? (
            <div
              style={{
                background: "rgba(0, 113, 227, 0.08)",
                border: "1px solid rgba(0, 113, 227, 0.3)",
                borderRadius: "12px",
                padding: "16px 20px",
                marginBottom: "18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <div style={{ fontWeight: 800, color: "var(--apple-blue-accent)", fontSize: "13px", marginBottom: "4px" }}>
                  🔒 Verified Student Review Required
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  Please sign in to submit your rating, difficulty telemetry, and upgrade suggestions for Module {String(moduleNumber).padStart(2, "0")}.
                </div>
              </div>
              <a
                href={`/login?redirect=/learn/${moduleNumber}`}
                className="button button-small button-cn-primary"
                style={{ textDecoration: "none", fontSize: "11px", padding: "6px 14px", whiteSpace: "nowrap" }}
              >
                Sign in to Review →
              </a>
            </div>
          ) : reviewer ? (
            <div
              style={{
                background: "rgba(52, 199, 89, 0.08)",
                border: "1px solid rgba(52, 199, 89, 0.25)",
                borderRadius: "10px",
                padding: "10px 16px",
                marginBottom: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "8px",
                fontSize: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ color: "var(--apple-green)", fontWeight: 700 }}>✓ Verified Reviewer:</span>
                <b style={{ color: "var(--text-primary)" }}>{reviewer.name}</b>
                {reviewer.college && <span style={{ color: "var(--text-secondary)" }}>· {reviewer.college}</span>}
              </div>
              <span className="admin-chip" style={{ fontSize: "9px", padding: "2px 7px" }}>
                {reviewer.role.toUpperCase()}
              </span>
            </div>
          ) : null}

          {submitted ? (
            <div className="feedback-success-banner">
              <div className="success-icon">✓</div>
              <div className="success-text">
                <b>Thank you{reviewer?.name ? `, ${reviewer.name}` : ""}! Your review is officially recorded.</b>
                <p>
                  Your ratings ({helpfulness}/5 Helpfulness · {difficulty.replace("_", " ")} · {easeOfUse}/5 Ease of Use)
                  have been permanently saved in the academic telemetry database to calibrate future curriculum updates.
                </p>
              </div>
              <button
                type="button"
                className="button button-outline button-small"
                onClick={() => setSubmitted(false)}
              >
                Edit Your Feedback ✏️
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="feedback-form">
              {/* Question 1: Content Quality & Helpfulness */}
              <div className="feedback-field-group">
                <div className="field-label-row">
                  <label className="feedback-label">
                    <span className="label-num">1</span> How helpful was the module content &amp; invariant explanations?
                  </label>
                  <span className="active-rating-preview">
                    {HELPFULNESS_LABELS[hoveredHelpfulness ?? helpfulness]}
                  </span>
                </div>
                <div className="star-rating-row" role="radiogroup" aria-label="Content Helpfulness">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const activeVal = hoveredHelpfulness ?? helpfulness;
                    const isFilled = star <= activeVal;
                    return (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${isFilled ? "star-filled" : ""}`}
                        onMouseEnter={() => setHoveredHelpfulness(star)}
                        onMouseLeave={() => setHoveredHelpfulness(null)}
                        onClick={() => setHelpfulness(star)}
                        aria-label={`${star} Star - ${HELPFULNESS_LABELS[star]}`}
                      >
                        ★
                      </button>
                    );
                  })}
                  <span className="star-numeric-tag">{helpfulness} / 5</span>
                </div>
              </div>

              {/* Question 2: Difficulty Level & Pacing */}
              <div className="feedback-field-group">
                <label className="feedback-label">
                  <span className="label-num">2</span> How was the difficulty &amp; mental workload of this module?
                </label>
                <div className="difficulty-pills-grid">
                  <button
                    type="button"
                    className={`difficulty-pill-btn pill-easy ${difficulty === "too_easy" ? "pill-selected" : ""}`}
                    onClick={() => setDifficulty("too_easy")}
                  >
                    <span className="pill-emoji">⚡</span>
                    <span className="pill-title">Too Easy</span>
                    <small className="pill-sub">Could use more rigorous edge cases</small>
                  </button>

                  <button
                    type="button"
                    className={`difficulty-pill-btn pill-optimal ${difficulty === "just_right" ? "pill-selected" : ""}`}
                    onClick={() => setDifficulty("just_right")}
                  >
                    <span className="pill-emoji">🎯</span>
                    <span className="pill-title">Optimal / Just Right</span>
                    <small className="pill-sub">Well-calibrated &amp; challenging</small>
                  </button>

                  <button
                    type="button"
                    className={`difficulty-pill-btn pill-hard ${difficulty === "too_hard" ? "pill-selected" : ""}`}
                    onClick={() => setDifficulty("too_hard")}
                  >
                    <span className="pill-emoji">🧗</span>
                    <span className="pill-title">Too Hard</span>
                    <small className="pill-sub">Needs stepping stones or simpler intro</small>
                  </button>
                </div>
              </div>

              {/* Question 3: Platform & Tool Ease of Use / Friendliness */}
              <div className="feedback-field-group">
                <div className="field-label-row">
                  <label className="feedback-label">
                    <span className="label-num">3</span> How user-friendly was the platform &amp; interactive checkpoint?
                  </label>
                  <span className="active-rating-preview">
                    {EASE_LABELS[hoveredEase ?? easeOfUse]}
                  </span>
                </div>
                <div className="ease-chips-row">
                  {[1, 2, 3, 4, 5].map((level) => {
                    const isSelected = easeOfUse === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        className={`ease-chip-btn ${isSelected ? "ease-selected" : ""}`}
                        onMouseEnter={() => setHoveredEase(level)}
                        onMouseLeave={() => setHoveredEase(null)}
                        onClick={() => setEaseOfUse(level)}
                      >
                        <span className="chip-score">{level}</span>
                        <span className="chip-label">
                          {level === 1 ? "Glitchy" : level === 3 ? "Acceptable" : level === 5 ? "Delightful" : `Lvl ${level}`}
                        </span>
                      </button>
                    );
                  })}
                  <span className="star-numeric-tag">{easeOfUse} / 5</span>
                </div>
              </div>

              {/* Question 4: Qualitative Suggestions for Upgrades */}
              <div className="feedback-field-group">
                <label className="feedback-label" htmlFor={`feedback-notes-${moduleNumber}`}>
                  <span className="label-num">4</span> Suggestions for upgrading this module
                  <small style={{ fontWeight: 400, color: "var(--text-tertiary)", marginLeft: 6 }}>
                    (Optional: specific diagrams, edge cases, audio pacing, or UI improvements)
                  </small>
                </label>
                <textarea
                  id={`feedback-notes-${moduleNumber}`}
                  rows={3}
                  className="feedback-textarea"
                  placeholder="e.g. Add 1 more visual diagram for the monotonic stack invariant; provide a practice hint for negative numbers; loved the audio narrator..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                />
              </div>

              {errorMsg && (
                <div className="feedback-error-banner" role="alert">
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* Submit Action */}
              <div className="feedback-actions-row">
                <button
                  type="submit"
                  disabled={isSubmitting || !isAuthenticated}
                  className="button button-cn-primary"
                >
                  {!isAuthenticated
                    ? "Sign In to Submit Feedback"
                    : isSubmitting
                    ? "Submitting Telemetry..."
                    : "Submit Module Feedback →"}
                </button>
                <span className="feedback-privacy-note">
                  🔒 Saved permanently in academic database to calibrate next release.
                </span>
              </div>
            </form>
          )}
        </div>
      )}
    </section>
  );
}
