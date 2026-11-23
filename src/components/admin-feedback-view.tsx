"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { ModuleFeedbackMetrics, DbModuleFeedbackWithUser } from "@/lib/db";
import { MODULES_CURRICULUM } from "@/lib/curriculum";

export function AdminFeedbackView({
  initialMetrics,
  initialFeedback,
}: {
  initialMetrics: ModuleFeedbackMetrics;
  initialFeedback: DbModuleFeedbackWithUser[];
}) {
  const [selectedModule, setSelectedModule] = useState<number | "all">("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filtered list
  const filteredFeedback = useMemo(() => {
    return initialFeedback.filter((item) => {
      if (selectedModule !== "all" && item.module_number !== selectedModule) {
        return false;
      }
      if (difficultyFilter !== "all" && item.difficulty_level !== difficultyFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.user_name.toLowerCase().includes(q);
        const matchesCollege = item.user_college.toLowerCase().includes(q);
        const matchesText = item.feedback_text.toLowerCase().includes(q);
        const matchesModule = `module ${item.module_number}`.includes(q);
        if (!matchesName && !matchesCollege && !matchesText && !matchesModule) {
          return false;
        }
      }
      return true;
    });
  }, [initialFeedback, selectedModule, difficultyFilter, searchQuery]);

  // Calculate difficulty percentages
  const diffTotal = initialMetrics.difficultyBreakdown.total || 1;
  const optimalPct = Math.round((initialMetrics.difficultyBreakdown.justRight / diffTotal) * 100);
  const hardPct = Math.round((initialMetrics.difficultyBreakdown.tooHard / diffTotal) * 100);
  const easyPct = Math.round((initialMetrics.difficultyBreakdown.tooEasy / diffTotal) * 100);

  return (
    <div className="admin-feedback-shell">
      {/* Metrics Grid */}
      <section className="dashboard-metrics admin-metrics" style={{ marginTop: 20 }}>
        <div>
          <b>{initialMetrics.totalCount}</b>
          <span>Total Student Reviews</span>
        </div>
        <div>
          <b>{initialMetrics.avgHelpfulness} / 5.0</b>
          <span>Avg Content Helpfulness</span>
        </div>
        <div>
          <b>{initialMetrics.avgEaseOfUse} / 5.0</b>
          <span>Avg User-Friendliness</span>
        </div>
        <div>
          <b>{optimalPct}% Optimal</b>
          <span>{hardPct}% Hard · {easyPct}% Easy</span>
        </div>
      </section>

      {/* High-Priority Platform Upgrades (Telemetry-Driven Intelligence) */}
      <section className="surface-card" style={{ marginTop: 24, padding: 24 }}>
        <div className="section-heading" style={{ marginBottom: 16 }}>
          <div>
            <span className="eyebrow">AUTOMATED CURRICULUM INTELLIGENCE</span>
            <h2 style={{ fontSize: 20, margin: "4px 0" }}>
              Continuous Platform Upgrades &amp; Content Health
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>
              Algorithmic detection of difficulty spikes, low-clarity lessons, and high-frequency student requests across all 100 modules.
            </p>
          </div>
          <span className="badge badge-live">
            ⚡ {initialMetrics.flaggedModules.length} Modules Flagged for Revision
          </span>
        </div>

        {initialMetrics.flaggedModules.length === 0 ? (
          <div className="feedback-all-clear">
            <span className="clear-icon">✓</span>
            <div>
              <b>All 100 Modules Meeting Quality Standards</b>
              <p>Average helpfulness is above 4.0/5.0 and difficulty calibration is balanced across all evaluated modules.</p>
            </div>
          </div>
        ) : (
          <div className="flagged-modules-grid">
            {initialMetrics.flaggedModules.map((flag) => {
              const modInfo = MODULES_CURRICULUM[flag.moduleNumber];
              return (
                <div key={flag.moduleNumber} className="flagged-module-card">
                  <div className="flagged-card-top">
                    <div className="flagged-title-group">
                      <span className="flagged-chip">Module {String(flag.moduleNumber).padStart(2, "0")}</span>
                      <b>{modInfo?.title || `Module ${flag.moduleNumber}`}</b>
                    </div>
                    <span className="flagged-reason-badge">⚠️ Action Needed</span>
                  </div>

                  <div className="flagged-metrics-line">
                    <span>⭐ Helpfulness: <b>{flag.avgHelpfulness} / 5.0</b></span>
                    <span>⚡ Ease of Use: <b>{flag.avgEaseOfUse} / 5.0</b></span>
                    <span>📊 Difficulty Skew: <b style={{ color: flag.topDifficulty === "Too Hard" ? "#ff453a" : "#ff9f0a" }}>{flag.topDifficulty}</b></span>
                  </div>

                  <div className="flagged-diagnosis">
                    <b>Diagnosis:</b> {flag.reason}
                  </div>

                  {flag.sampleFeedback.length > 0 && (
                    <div className="flagged-sample-quotes">
                      <b>Recent Student Suggestions:</b>
                      <ul>
                        {flag.sampleFeedback.map((quote, idx) => (
                          <li key={idx}>&ldquo;{quote}&rdquo;</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flagged-card-footer">
                    <Link
                      href={`/learn/${flag.moduleNumber}`}
                      target="_blank"
                      className="button button-outline button-small"
                    >
                      Inspect Module {flag.moduleNumber} Lesson →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Feedback Explorer & Table */}
      <section className="surface-card" style={{ marginTop: 24, padding: 24 }}>
        <div className="section-heading" style={{ marginBottom: 16 }}>
          <div>
            <span className="eyebrow">STUDENT VOICES &amp; LOGGED REVIEWS</span>
            <h2 style={{ fontSize: 20, margin: "4px 0" }}>All Feedback Submissions</h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>
              Filter by module, search by student name or college, and read verbatim learner suggestions.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span className="badge badge-counter">{filteredFeedback.length} shown</span>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="feedback-filter-bar">
          <div className="filter-item">
            <label htmlFor="filter-module">Filter by Module:</label>
            <select
              id="filter-module"
              className="feedback-select"
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value === "all" ? "all" : Number(e.target.value))}
            >
              <option value="all">All Modules (1–100)</option>
              {Array.from({ length: 100 }, (_, i) => i + 1).map((mNum) => {
                const curriculum = MODULES_CURRICULUM[mNum];
                const sum = initialMetrics.moduleSummaries[mNum];
                const count = sum ? sum.count : 0;
                return (
                  <option key={mNum} value={mNum}>
                    Module {String(mNum).padStart(2, "0")}: {curriculum?.title ? curriculum.title.slice(0, 32) : `Module ${mNum}`} {count > 0 ? `(${count} reviews)` : ""}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="filter-diff">Difficulty Filter:</label>
            <select
              id="filter-diff"
              className="feedback-select"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="all">All Difficulties</option>
              <option value="just_right">Optimal / Just Right</option>
              <option value="too_hard">Too Hard</option>
              <option value="too_easy">Too Easy</option>
            </select>
          </div>

          <div className="filter-item" style={{ flex: 1 }}>
            <label htmlFor="filter-search">Search Keyword or Student:</label>
            <input
              id="filter-search"
              type="search"
              className="feedback-search-input"
              placeholder="Search by student name, college, or text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Feedback Submissions Table */}
        <div className="table-scroll" style={{ marginTop: 18 }}>
          {filteredFeedback.length === 0 ? (
            <div className="table-empty-notice" style={{ padding: 40, textAlign: "center" }}>
              <p>No feedback entries match your active filter criteria.</p>
              <button
                type="button"
                className="button button-outline button-small"
                onClick={() => {
                  setSelectedModule("all");
                  setDifficultyFilter("all");
                  setSearchQuery("");
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <table className="feedback-data-table">
              <thead>
                <tr>
                  <th style={{ width: 180 }}>Student</th>
                  <th style={{ width: 140 }}>Module</th>
                  <th style={{ width: 120 }}>Helpfulness</th>
                  <th style={{ width: 120 }}>Difficulty</th>
                  <th style={{ width: 110 }}>Ease of Use</th>
                  <th>Student Suggestions / Upgrade Notes</th>
                  <th style={{ width: 130 }}>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedback.map((item) => {
                  const mod = MODULES_CURRICULUM[item.module_number];
                  const diffColor =
                    item.difficulty_level === "just_right"
                      ? "badge-green"
                      : item.difficulty_level === "too_hard"
                      ? "badge-red"
                      : "badge-amber";
                  const diffLabel =
                    item.difficulty_level === "just_right"
                      ? "🎯 Optimal"
                      : item.difficulty_level === "too_hard"
                      ? "🧗 Too Hard"
                      : "⚡ Too Easy";

                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="table-student-name">
                          <b>{item.user_name || "Anonymous Learner"}</b>
                          <small>{item.user_college || item.user_email}</small>
                        </div>
                      </td>
                      <td>
                        <div className="table-mod-info">
                          <Link href={`/learn/${item.module_number}`} className="inline-link">
                            <b>Module {String(item.module_number).padStart(2, "0")}</b>
                          </Link>
                          <small>{mod?.title ? mod.title.slice(0, 24) : `Stage 0${item.stage_id}`}</small>
                        </div>
                      </td>
                      <td>
                        <div className="table-stars-cell">
                          <span className="star-display">{"★".repeat(item.helpfulness_rating)}</span>
                          <span className="star-num">{item.helpfulness_rating}/5</span>
                        </div>
                      </td>
                      <td>
                        <span className={`table-diff-badge ${diffColor}`}>
                          {diffLabel}
                        </span>
                      </td>
                      <td>
                        <span className="table-ease-score">
                          {item.ease_of_use_rating} / 5
                        </span>
                      </td>
                      <td>
                        <div className="table-feedback-text">
                          {item.feedback_text ? (
                            <span>&ldquo;{item.feedback_text}&rdquo;</span>
                          ) : (
                            <span style={{ color: "var(--text-tertiary)", fontStyle: "italic" }}>
                              No qualitative notes provided.
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="table-timestamp">
                          {new Date(item.updated_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
