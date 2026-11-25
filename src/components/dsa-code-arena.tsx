"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { DsaProblem } from "@/lib/dsa-problems";
import { SupportedLanguage } from "@/lib/compiler";
import { getDsaMockComment, type DsaMockFeedback } from "@/lib/dsa-mocking";
import {
  executeWithQueuePolling,
  type QueueProgressState,
} from "@/lib/execution-client";

interface DsaTestCaseResult {
  id?: string;
  passed: boolean;
  input: string;
  expected: string;
  actual?: string;
  error?: string;
  timeMs?: number;
}

interface DsaExecutionResult {
  status?: string;
  stdout?: string;
  stderr?: string;
  compileOutput?: string;
  executionTimeMs?: number;
  results?: DsaTestCaseResult[];
}

interface DsaSubmissionResult {
  status: string;
  testCasesPassed?: number;
  totalTestCases?: number;
  executionTimeMs?: number;
  compileOutput?: string;
  results?: DsaTestCaseResult[];
  mockComment?: DsaMockFeedback;
}

interface DsaCodeArenaProps {
  initialProblem: DsaProblem;
  allProblems: DsaProblem[];
  solvedProblemIds?: string[];
}

export function DsaCodeArena({
  initialProblem,
  allProblems,
  solvedProblemIds = [],
}: DsaCodeArenaProps) {
  const [problem, setProblem] = useState<DsaProblem>(initialProblem);
  const [language, setLanguage] = useState<SupportedLanguage>("cpp");
  const [codePerLang, setCodePerLang] = useState<Record<string, Record<SupportedLanguage, string>>>({});
  const [code, setCode] = useState<string>(initialProblem.starterTemplates["cpp"] || "");
  const [activeLeftTab, setActiveLeftTab] = useState<"description" | "submissions">("description");

  // Console state
  const [activeConsoleTab, setActiveConsoleTab] = useState<"samples" | "custom" | "output">("samples");
  const [selectedSampleIndex, setSelectedSampleIndex] = useState<number>(0);
  const [customStdin, setCustomStdin] = useState<string>(initialProblem.sampleTestCases[0]?.input || "");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [queueProgress, setQueueProgress] = useState<QueueProgressState | null>(null);

  // Results state
  const [executionResult, setExecutionResult] = useState<DsaExecutionResult | null>(null);
  const [submissionResult, setSubmissionResult] = useState<DsaSubmissionResult | null>(null);
  const [solvedSet, setSolvedSet] = useState<Set<string>>(new Set(solvedProblemIds));

  const codePerLangRef = useRef(codePerLang);
  const lastInputModeRef = useRef<"samples" | "custom">("samples");

  useEffect(() => {
    codePerLangRef.current = codePerLang;
  }, [codePerLang]);

  // Initialize code for current problem & language
  useEffect(() => {
    let cancelled = false;
    const saved = codePerLangRef.current[problem.id]?.[language];
    const template = problem.starterTemplates[language] || "";
    const defaultInput = problem.sampleTestCases[0]?.input || "";

    queueMicrotask(() => {
      if (cancelled) return;
      if (saved !== undefined) {
        setCode(saved);
      } else {
        setCode(template);
        setCodePerLang((prev) => ({
          ...prev,
          [problem.id]: {
            ...(prev[problem.id] || {}),
            [language]: template,
          },
        }));
      }
      setCustomStdin(defaultInput);
      setExecutionResult(null);
      setSubmissionResult(null);
    });

    return () => {
      cancelled = true;
    };
  }, [problem.id, language, problem.starterTemplates, problem.sampleTestCases]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setCodePerLang((prev) => ({
      ...prev,
      [problem.id]: {
        ...(prev[problem.id] || {}),
        [language]: newCode,
      },
    }));
  };

  const handleResetCode = () => {
    if (confirm("Reset code to the original starter template?")) {
      const template = problem.starterTemplates[language] || "";
      setCode(template);
      setCodePerLang((prev) => ({
        ...prev,
        [problem.id]: {
          ...(prev[problem.id] || {}),
          [language]: template,
        },
      }));
    }
  };

  // Run against sample or custom input
  const handleRunCode = async () => {
    const modeToRun =
      activeConsoleTab === "samples" || activeConsoleTab === "custom"
        ? activeConsoleTab
        : lastInputModeRef.current;

    if (activeConsoleTab === "samples" || activeConsoleTab === "custom") {
      lastInputModeRef.current = activeConsoleTab;
    }

    setIsRunning(true);
    setQueueProgress(null);
    setActiveConsoleTab("output");
    setExecutionResult(null);
    setSubmissionResult(null);

    try {
      const testCases =
        modeToRun === "samples"
          ? [
              {
                id: `Sample ${selectedSampleIndex + 1}`,
                input: problem.sampleTestCases[selectedSampleIndex]?.input || "",
                expectedOutput: problem.sampleTestCases[selectedSampleIndex]?.expectedOutput || "",
              },
            ]
          : undefined;

      const { ok, status, data } = await executeWithQueuePolling<DsaExecutionResult>(
        "/api/compiler",
        {
          language,
          code,
          stdin: modeToRun === "custom" ? customStdin : undefined,
          testCases,
        },
        setQueueProgress,
      );

      if (!ok) {
        setExecutionResult({
          status: status === 429 || status === 503 ? "QUEUE_THROTTLED" : "RUNTIME_ERROR",
          stderr: data.error || "Failed to execute code",
        });
      } else {
        setExecutionResult(data);
      }
    } catch (err: unknown) {
      setExecutionResult({
        status: "RUNTIME_ERROR",
        stderr: err instanceof Error ? err.message : "Failed to execute code",
      });
    } finally {
      setIsRunning(false);
      setQueueProgress(null);
    }
  };

  // Submit against all test cases
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setQueueProgress(null);
    setActiveConsoleTab("output");
    setExecutionResult(null);
    setSubmissionResult(null);

    try {
      const { ok, status, data } = await executeWithQueuePolling<DsaSubmissionResult>(
        "/api/dsa/submit",
        {
          problemId: problem.id,
          language,
          code,
        },
        setQueueProgress,
      );

      if (!ok) {
        setSubmissionResult({
          status: status === 429 ? "RATE_LIMITED" : "RUNTIME_ERROR",
          compileOutput: data.error || "Submission failed",
        });
      } else {
        setSubmissionResult(data);
        if (data.status === "ACCEPTED") {
          setSolvedSet((prev) => new Set([...prev, problem.id]));
        }
      }
    } catch (err: unknown) {
      setSubmissionResult({
        status: "RUNTIME_ERROR",
        compileOutput: err instanceof Error ? err.message : "Submission failed",
      });
    } finally {
      setIsSubmitting(false);
      setQueueProgress(null);
    }
  };

  // Handle Tab key in editor
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;
      const newVal = val.substring(0, start) + "    " + val.substring(end);
      handleCodeChange(newVal);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleRunCode();
    }
  };

  const lineCount = (code.match(/\n/g) || []).length + 1;

  return (
    <div className="dsa-arena-layout">
      {/* Top Bar Navigation */}
      <header className="dsa-topbar">
        <div className="dsa-topbar-left">
          <Link href="/dsa" className="dsa-back-link">
            ← Problem Bank
          </Link>
          <div className="dsa-problem-switcher">
            <label htmlFor="problem-select" className="sr-only">Switch Problem</label>
            <select
              id="problem-select"
              value={problem.id}
              onChange={(e) => {
                const found = allProblems.find((p) => p.id === e.target.value);
                if (found) {
                  setProblem(found);
                  setSelectedSampleIndex(0);
                  lastInputModeRef.current = "samples";
                  setActiveConsoleTab("samples");
                  if (typeof window !== "undefined") {
                    window.history.replaceState(null, "", `/dsa/${found.id}`);
                  }
                }
              }}
              className="dsa-select"
            >
              {allProblems.map((p, idx) => (
                <option key={p.id} value={p.id}>
                  {idx + 1}. {p.title} ({p.difficulty}) {solvedSet.has(p.id) ? "✓" : ""}
                </option>
              ))}
            </select>
          </div>
          <span
            className={`dsa-diff-pill ${
              problem.difficulty === "Easy"
                ? "diff-easy"
                : problem.difficulty === "Medium"
                  ? "diff-medium"
                  : "diff-hard"
            }`}
          >
            {problem.difficulty}
          </span>
          <span className="dsa-topic-tag">{problem.topic}</span>
        </div>

        <div className="dsa-topbar-right">
          <button
            type="button"
            className="dsa-btn-run"
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
          >
            {isRunning ? "Running..." : "▶ Run Code"}
          </button>
          <button
            type="button"
            className="dsa-btn-submit"
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting}
          >
            {isSubmitting ? "Evaluating..." : "✓ Submit Solution"}
          </button>
        </div>
      </header>

      {/* Main Split Body */}
      <div className="dsa-main-split">
        {/* Left Pane: Description & Submissions */}
        <section className="dsa-left-pane">
          <div className="dsa-tabs-header">
            <button
              type="button"
              className={`dsa-tab-btn ${activeLeftTab === "description" ? "active" : ""}`}
              onClick={() => setActiveLeftTab("description")}
            >
              📄 Description
            </button>
            <button
              type="button"
              className={`dsa-tab-btn ${activeLeftTab === "submissions" ? "active" : ""}`}
              onClick={() => setActiveLeftTab("submissions")}
            >
              📊 Submissions {solvedSet.has(problem.id) ? "(Solved ✓)" : ""}
            </button>
          </div>

          <div className="dsa-left-content">
            {activeLeftTab === "description" ? (
              <div className="dsa-prose">
                <h2>{problem.title}</h2>
                <div style={{ whiteSpace: "pre-line", lineHeight: 1.6, margin: "14px 0" }}>
                  {problem.description}
                </div>

                <h3>Input Format</h3>
                <pre className="dsa-code-block">{problem.inputFormat}</pre>

                <h3>Output Format</h3>
                <pre className="dsa-code-block">{problem.outputFormat}</pre>

                <h3>Constraints</h3>
                <ul className="dsa-constraints-list">
                  {problem.constraints.map((c, i) => (
                    <li key={i}>
                      <code>{c}</code>
                    </li>
                  ))}
                </ul>

                <h3>Sample Test Cases</h3>
                {problem.sampleTestCases.map((tc, idx) => (
                  <div key={idx} className="dsa-sample-box">
                    <div className="dsa-sample-title">Example {idx + 1}</div>
                    <div className="dsa-io-row">
                      <div>
                        <b>Input:</b>
                        <pre>{tc.input}</pre>
                      </div>
                      <div>
                        <b>Expected Output:</b>
                        <pre>{tc.expectedOutput}</pre>
                      </div>
                    </div>
                    {tc.explanation && (
                      <div className="dsa-explanation">
                        <b>Explanation:</b> {tc.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="dsa-submissions-pane">
                <h3>Submission History</h3>
                {solvedSet.has(problem.id) ? (
                  <div className="dsa-accepted-banner">
                    🎉 <b>Problem Solved!</b> You have successfully submitted an accepted solution.
                  </div>
                ) : (
                  <p style={{ color: "#64748b" }}>
                    No accepted submission yet. Write your code and click <b>Submit Solution</b> to
                    test all hidden cases!
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Right Pane: Code Editor & Console */}
        <section className="dsa-right-pane">
          {/* Editor Header */}
          <div className="dsa-editor-header">
            <div className="dsa-lang-picker">
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>Language:</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="dsa-select dsa-lang-select"
              >
                <option value="cpp">C++ (C++17 / Clang)</option>
                <option value="c">C (C11 / Clang)</option>
                <option value="java">Java (JDK 17)</option>
                <option value="python">Python (3.x)</option>
              </select>
            </div>
            <div className="dsa-editor-actions">
              <span className="dsa-shortcut-hint">Shortcuts: Tab indent · ⌘/Ctrl+Enter run</span>
              <button
                type="button"
                className="dsa-btn-subtle"
                onClick={handleResetCode}
                title="Reset to starter template"
              >
                ↺ Reset Template
              </button>
            </div>
          </div>

          {/* Code Editor Body */}
          <div className="dsa-editor-wrap">
            <div className="dsa-line-gutter" aria-hidden="true">
              {Array.from({ length: Math.max(lineCount, 15) }, (_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoCapitalize="none"
              autoComplete="off"
              className="dsa-code-textarea"
              placeholder="// Write your solution here..."
            />
          </div>

          {/* Console / Results Drawer */}
          <div className="dsa-console-drawer">
            <div className="dsa-console-tabs">
              <button
                type="button"
                className={`dsa-console-tab-btn ${activeConsoleTab === "samples" ? "active" : ""}`}
                onClick={() => {
                  lastInputModeRef.current = "samples";
                  setActiveConsoleTab("samples");
                }}
              >
                Sample Testcases
              </button>
              <button
                type="button"
                className={`dsa-console-tab-btn ${activeConsoleTab === "custom" ? "active" : ""}`}
                onClick={() => {
                  lastInputModeRef.current = "custom";
                  setActiveConsoleTab("custom");
                }}
              >
                Custom STDIN
              </button>
              <button
                type="button"
                className={`dsa-console-tab-btn ${activeConsoleTab === "output" ? "active" : ""}`}
                onClick={() => setActiveConsoleTab("output")}
              >
                Execution Result{" "}
                {(executionResult || submissionResult) && (
                  <span className="dsa-pulse-indicator">●</span>
                )}
              </button>
            </div>

            <div className="dsa-console-body">
              {activeConsoleTab === "samples" && (
                <div className="dsa-sample-selector">
                  <div className="dsa-sample-nav-pills">
                    {problem.sampleTestCases.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`dsa-sample-pill ${selectedSampleIndex === i ? "active" : ""}`}
                        onClick={() => setSelectedSampleIndex(i)}
                      >
                        Case {i + 1}
                      </button>
                    ))}
                  </div>
                  <div className="dsa-sample-details">
                    <b>Input:</b>
                    <pre>{problem.sampleTestCases[selectedSampleIndex]?.input}</pre>
                    <b>Expected:</b>
                    <pre>{problem.sampleTestCases[selectedSampleIndex]?.expectedOutput}</pre>
                  </div>
                </div>
              )}

              {activeConsoleTab === "custom" && (
                <div className="dsa-custom-stdin-wrap">
                  <label htmlFor="custom-stdin-input" style={{ fontSize: "12px", color: "#64748b", display: "block", marginBottom: "4px" }}>
                    Standard Input (stdin passed to program):
                  </label>
                  <textarea
                    id="custom-stdin-input"
                    value={customStdin}
                    onChange={(e) => setCustomStdin(e.target.value)}
                    className="dsa-stdin-textarea"
                    placeholder="Enter test inputs here..."
                  />
                </div>
              )}

              {activeConsoleTab === "output" && (
                <div className="dsa-output-wrap">
                  {isRunning || isSubmitting ? (
                    <div className="dsa-loading-state">
                      <div className="dsa-spinner"></div>
                      <span>
                        {queueProgress?.status === "QUEUED"
                          ? `Queued at position #${queueProgress.queuePosition}${
                              queueProgress.queueDepth ? ` (${queueProgress.queueDepth} in pool)` : ""
                            }...`
                          : queueProgress?.status === "RUNNING"
                          ? "Worker compiling and grading test cases..."
                          : isSubmitting
                          ? "Compiling and evaluating against all test suites..."
                          : "Compiling and executing code on sandbox engine..."}
                      </span>
                    </div>
                  ) : submissionResult ? (
                    /* Submission Evaluation Result */
                    (() => {
                      const submissionMock = submissionResult.mockComment || getDsaMockComment({
                        problemId: problem.id,
                        status: submissionResult.status,
                        code,
                        language,
                        testCasesPassed: submissionResult.testCasesPassed,
                        totalTestCases: submissionResult.totalTestCases,
                        results: submissionResult.results,
                        compileOutput: submissionResult.compileOutput,
                      });

                      return (
                        <div className="dsa-submission-report">
                          <div
                            className={`dsa-status-banner ${
                              submissionResult.status === "ACCEPTED"
                                ? "banner-accepted"
                                : "banner-failed"
                            }`}
                          >
                            <span className="banner-icon">
                              {submissionResult.status === "ACCEPTED" ? "✓" : "✗"}
                            </span>
                            <div>
                              <div className="banner-status-title">{submissionResult.status}</div>
                              <div className="banner-stats">
                                Passed {submissionResult.testCasesPassed} of{" "}
                                {submissionResult.totalTestCases} Test Cases · Total Time:{" "}
                                {submissionResult.executionTimeMs}ms
                              </div>
                            </div>
                          </div>

                          {submissionMock && (
                            <div className="dsa-mock-card">
                              <div className="dsa-mock-header">
                                <span className="dsa-mock-badge">{submissionMock.badge}</span>
                                <h4 className="dsa-mock-headline">{submissionMock.headline}</h4>
                              </div>
                              <div className="dsa-mock-quote">
                                <span className="dsa-mock-quote-mark">&ldquo;</span>
                                {submissionMock.mock}
                                <span className="dsa-mock-quote-mark">&rdquo;</span>
                              </div>
                              <div className="dsa-mock-details">
                                <div className="dsa-mock-mistake">
                                  <b>🤦 The Silly Mistake:</b> {submissionMock.sillyMistake}
                                </div>
                                <div className="dsa-mock-hint">
                                  <b>💡 Senior SDE Fix:</b> {submissionMock.hint}
                                </div>
                              </div>
                            </div>
                          )}

                          {submissionResult.compileOutput && (
                            <div className="dsa-error-box">
                              <b>Compiler Output:</b>
                              <pre>{submissionResult.compileOutput}</pre>
                            </div>
                          )}

                          {submissionResult.results && submissionResult.results.length > 0 && (
                            <div className="dsa-tc-results-list">
                              {submissionResult.results.map((r: DsaTestCaseResult, idx: number) => (
                                <div
                                  key={idx}
                                  className={`dsa-tc-item ${r.passed ? "tc-passed" : "tc-failed"}`}
                                >
                                  <div className="dsa-tc-header">
                                    <span>
                                      Testcase {idx + 1}: {r.passed ? "Passed ✓" : "Failed ✗"}
                                    </span>
                                    <span>{r.timeMs}ms</span>
                                  </div>
                                  {!r.passed && (
                                    <div className="dsa-diff-grid">
                                      <div>
                                        <small>Input:</small>
                                        <pre>{r.input}</pre>
                                      </div>
                                      <div>
                                        <small>Expected Output:</small>
                                        <pre>{r.expected}</pre>
                                      </div>
                                      <div>
                                        <small>Your Output:</small>
                                        <pre>{r.actual || r.error || "(Empty)"}</pre>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })()
                  ) : executionResult ? (
                    /* Interactive Run Result */
                    (() => {
                      const runMock = getDsaMockComment({
                        problemId: problem.id,
                        status:
                          executionResult.status ||
                          (executionResult.stderr
                            ? "RUNTIME_ERROR"
                            : executionResult.results?.some((r: DsaTestCaseResult) => !r.passed)
                            ? "FAILED"
                            : "SUCCESS"),
                        code,
                        language,
                        results: executionResult.results,
                        compileOutput: executionResult.compileOutput,
                        stderr: executionResult.stderr,
                      });

                      return (
                        <div className="dsa-run-report">
                          <div
                            className={`dsa-status-banner ${
                              executionResult.status === "SUCCESS" || executionResult.status === "ACCEPTED"
                                ? "banner-accepted"
                                : "banner-failed"
                            }`}
                          >
                            <div>
                              <div className="banner-status-title">
                                {executionResult.status || "COMPLETED"}
                              </div>
                              <div className="banner-stats">
                                Execution Time: {executionResult.executionTimeMs || 0}ms
                              </div>
                            </div>
                          </div>

                          {runMock && (
                            <div className="dsa-mock-card">
                              <div className="dsa-mock-header">
                                <span className="dsa-mock-badge">{runMock.badge}</span>
                                <h4 className="dsa-mock-headline">{runMock.headline}</h4>
                              </div>
                              <div className="dsa-mock-quote">
                                <span className="dsa-mock-quote-mark">&ldquo;</span>
                                {runMock.mock}
                                <span className="dsa-mock-quote-mark">&rdquo;</span>
                              </div>
                              <div className="dsa-mock-details">
                                <div className="dsa-mock-mistake">
                                  <b>🤦 The Silly Mistake:</b> {runMock.sillyMistake}
                                </div>
                                <div className="dsa-mock-hint">
                                  <b>💡 Senior SDE Fix:</b> {runMock.hint}
                                </div>
                              </div>
                            </div>
                          )}

                          {executionResult.compileOutput && (
                            <div className="dsa-error-box">
                              <b>Compiler Diagnostics:</b>
                              <pre>{executionResult.compileOutput}</pre>
                            </div>
                          )}

                          {executionResult.stderr && (
                            <div className="dsa-error-box">
                              <b>Runtime Errors / stderr:</b>
                              <pre>{executionResult.stderr}</pre>
                            </div>
                          )}

                          {!executionResult.results && (
                            <div className="dsa-stdout-box">
                              <b>Standard Output:</b>
                              <pre>{executionResult.stdout || "(No output produced)"}</pre>
                            </div>
                          )}

                          {executionResult.results && (
                            <div className="dsa-tc-results-list">
                              {executionResult.results.map((r: DsaTestCaseResult, idx: number) => (
                                <div
                                  key={idx}
                                  className={`dsa-tc-item ${r.passed ? "tc-passed" : "tc-failed"}`}
                                >
                                  <div className="dsa-tc-header">
                                    <span>{r.id}: {r.passed ? "Passed ✓" : "Failed ✗"}</span>
                                    <span>{r.timeMs}ms</span>
                                  </div>
                                  <div className="dsa-diff-grid">
                                    <div>
                                      <small>Input:</small>
                                      <pre>{r.input}</pre>
                                    </div>
                                    <div>
                                      <small>Expected:</small>
                                      <pre>{r.expected}</pre>
                                    </div>
                                    <div>
                                      <small>Your Output:</small>
                                      <pre>{r.actual || "(Empty)"}</pre>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })()
                  ) : (
                    <div className="dsa-placeholder-output">
                      Click <b>Run Code</b> to execute on the sample input, or <b>Submit Solution</b> to
                      evaluate against all hidden test cases.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
