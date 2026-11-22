"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { WebDevLesson } from "@/lib/web-dev-data";

interface WebDevPlaygroundProps {
  lesson: WebDevLesson;
  allLessons: WebDevLesson[];
}

interface ConsoleMessage {
  id: string;
  level: "log" | "info" | "warn" | "error";
  text: string;
  timestamp: string;
}

interface TestResult {
  id: string;
  description: string;
  passed: boolean;
  error?: string;
}

export function WebDevPlayground({ lesson, allLessons }: WebDevPlaygroundProps) {
  // Active editor tab: "html" | "css" | "js"
  const [activeEditorTab, setActiveEditorTab] = useState<"html" | "css" | "js">("html");

  // Code state
  const [htmlCode, setHtmlCode] = useState<string>(lesson.starterHtml);
  const [cssCode, setCssCode] = useState<string>(lesson.starterCss);
  const [jsCode, setJsCode] = useState<string>(lesson.starterJs);

  // Right pane tab: "preview" | "console" | "tests"
  const [activeRightTab, setActiveRightTab] = useState<"preview" | "console" | "tests">("preview");

  // Left pane tab: "guide" | "exercise" | "solution"
  const [activeLeftTab, setActiveLeftTab] = useState<"guide" | "exercise" | "solution">("exercise");

  // Auto-run toggle
  const [autoRun, setAutoRun] = useState<boolean>(true);

  // Console messages
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);

  // Test validation results
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [allPassed, setAllPassed] = useState<boolean>(false);
  const [hasRunTests, setHasRunTests] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  // Completed lessons stored locally
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());

  // Iframe ref
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const editorTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Load saved code & completion state from localStorage on lesson change
  useEffect(() => {
    try {
      const savedCompleted = localStorage.getItem("nexus_webdev_completed");
      if (savedCompleted) {
        setCompletedLessonIds(new Set(JSON.parse(savedCompleted)));
      }

      const savedHtml = localStorage.getItem(`nexus_webdev_${lesson.id}_html`);
      const savedCss = localStorage.getItem(`nexus_webdev_${lesson.id}_css`);
      const savedJs = localStorage.getItem(`nexus_webdev_${lesson.id}_js`);

      setHtmlCode(savedHtml !== null ? savedHtml : lesson.starterHtml);
      setCssCode(savedCss !== null ? savedCss : lesson.starterCss);
      setJsCode(savedJs !== null ? savedJs : lesson.starterJs);

      setConsoleMessages([]);
      setTestResults([]);
      setHasRunTests(false);
      setAllPassed(false);
      setActiveEditorTab("html");
      setActiveRightTab("preview");
    } catch {
      // Fallback
      setHtmlCode(lesson.starterHtml);
      setCssCode(lesson.starterCss);
      setJsCode(lesson.starterJs);
    }
  }, [lesson.id, lesson.starterHtml, lesson.starterCss, lesson.starterJs]);

  // Persist code changes to localStorage
  const updateHtml = (val: string) => {
    setHtmlCode(val);
    try {
      localStorage.setItem(`nexus_webdev_${lesson.id}_html`, val);
    } catch {}
  };
  const updateCss = (val: string) => {
    setCssCode(val);
    try {
      localStorage.setItem(`nexus_webdev_${lesson.id}_css`, val);
    } catch {}
  };
  const updateJs = (val: string) => {
    setJsCode(val);
    try {
      localStorage.setItem(`nexus_webdev_${lesson.id}_js`, val);
    } catch {}
  };

  // Compile iframe document
  const compileSrcDoc = useCallback(() => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    /* Default preview resets */
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 16px;
      color: #1e293b;
      background: #ffffff;
      line-height: 1.5;
    }
    ${cssCode}
  </style>
  <script>
    (function() {
      function send(type, args) {
        try {
          const text = args.map(a => {
            if (typeof a === 'object') {
              try { return JSON.stringify(a, null, 2); } catch(e) { return String(a); }
            }
            return String(a);
          }).join(' ');
          window.parent.postMessage({
            type: 'WEBDEV_CONSOLE',
            level: type,
            text: text,
            timestamp: new Date().toLocaleTimeString()
          }, '*');
        } catch(err) {}
      }
      const origLog = console.log;
      const origWarn = console.warn;
      const origError = console.error;
      const origInfo = console.info;

      console.log = function(...args) { send('log', args); origLog.apply(console, args); };
      console.warn = function(...args) { send('warn', args); origWarn.apply(console, args); };
      console.error = function(...args) { send('error', args); origError.apply(console, args); };
      console.info = function(...args) { send('info', args); origInfo.apply(console, args); };

      window.onerror = function(msg, url, line) {
        send('error', [msg + (line ? ' (line ' + line + ')' : '')]);
      };
    })();
  </script>
</head>
<body>
${htmlCode}
<script>
  try {
    ${jsCode}
  } catch (err) {
    console.error(err.message);
  }
</script>
</body>
</html>`;
  }, [htmlCode, cssCode, jsCode]);

  // Listen for iframe console messages
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === "WEBDEV_CONSOLE") {
        setConsoleMessages((prev) => [
          ...prev.slice(-99),
          {
            id: Math.random().toString(36).substring(2, 9),
            level: e.data.level,
            text: e.data.text,
            timestamp: e.data.timestamp,
          },
        ]);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Update iframe when code changes
  useEffect(() => {
    if (!autoRun) return;
    const timer = setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.srcdoc = compileSrcDoc();
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [compileSrcDoc, autoRun]);

  const handleManualRun = () => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = compileSrcDoc();
    }
  };

  // Automated solution test runner
  const handleTestSolution = () => {
    setIsValidating(true);
    setActiveRightTab("tests");

    // Ensure iframe is up-to-date
    if (iframeRef.current) {
      iframeRef.current.srcdoc = compileSrcDoc();
    }

    // Wait a brief moment for iframe to render
    setTimeout(() => {
      if (!iframeRef.current || !iframeRef.current.contentDocument) {
        setIsValidating(false);
        return;
      }

      const doc = iframeRef.current.contentDocument;
      const win = iframeRef.current.contentWindow;

      const results: TestResult[] = [];
      let passedCount = 0;

      for (const req of lesson.requirements) {
        try {
          // Execute test snippet in the context of the iframe document
          const testFn = new Function("document", "window", `
            try {
              return (${req.testCode});
            } catch (e) {
              return false;
            }
          `);
          const passed = Boolean(testFn(doc, win));
          if (passed) passedCount++;
          results.push({
            id: req.id,
            description: req.description,
            passed,
          });
        } catch (err: any) {
          results.push({
            id: req.id,
            description: req.description,
            passed: false,
            error: err.message,
          });
        }
      }

      const allOk = passedCount === lesson.requirements.length;
      setTestResults(results);
      setHasRunTests(true);
      setAllPassed(allOk);
      setIsValidating(false);

      if (allOk) {
        try {
          const updated = new Set(completedLessonIds);
          updated.add(lesson.id);
          setCompletedLessonIds(updated);
          localStorage.setItem("nexus_webdev_completed", JSON.stringify(Array.from(updated)));
        } catch {}
      }
    }, 450);
  };

  // Reset to starter template
  const handleResetStarter = () => {
    if (confirm("Reset code back to the original starter template for this exercise?")) {
      setHtmlCode(lesson.starterHtml);
      setCssCode(lesson.starterCss);
      setJsCode(lesson.starterJs);
      try {
        localStorage.removeItem(`nexus_webdev_${lesson.id}_html`);
        localStorage.removeItem(`nexus_webdev_${lesson.id}_css`);
        localStorage.removeItem(`nexus_webdev_${lesson.id}_js`);
      } catch {}
      setTestResults([]);
      setHasRunTests(false);
      setAllPassed(false);
    }
  };

  // Apply reference solution directly to editor
  const handleLoadSolution = () => {
    if (confirm("Replace your current editor code with the reference solution?")) {
      setHtmlCode(lesson.solutionHtml);
      setCssCode(lesson.solutionCss);
      setJsCode(lesson.solutionJs);
      updateHtml(lesson.solutionHtml);
      updateCss(lesson.solutionCss);
      updateJs(lesson.solutionJs);
      setActiveLeftTab("exercise");
    }
  };

  // Tab key indents by 2 spaces instead of leaving textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentVal = textarea.value;
      const newVal = currentVal.substring(0, start) + "  " + currentVal.substring(end);

      if (activeEditorTab === "html") updateHtml(newVal);
      else if (activeEditorTab === "css") updateCss(newVal);
      else updateJs(newVal);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleManualRun();
    }
  };

  // Find next lesson
  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 64px)", background: "#0b0f17", color: "#f1f5f9" }}>
      {/* Top Workspace Header Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 18px",
          background: "#111827",
          borderBottom: "1px solid #1f2937",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link
            href="/web-dev"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              color: "#94a3b8",
              textDecoration: "none",
              padding: "4px 8px",
              borderRadius: "6px",
              background: "#1f2937",
            }}
          >
            ← All Lessons
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 800,
                color: "#10b981",
                background: "rgba(16, 185, 129, 0.15)",
                padding: "2px 8px",
                borderRadius: "4px",
                textTransform: "uppercase",
              }}
            >
              Phase {lesson.phaseNumber}: {lesson.phase}
            </span>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#f8fafc" }}>
              #{lesson.number}. {lesson.title}
            </span>
          </div>
        </div>

        {/* Right action controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#94a3b8", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={autoRun}
              onChange={(e) => setAutoRun(e.target.checked)}
              style={{ cursor: "pointer", accentColor: "#ff6a00" }}
            />
            Auto Run Preview
          </label>

          <button
            type="button"
            onClick={handleManualRun}
            title="Compile & Run in Sandbox (Cmd+Enter)"
            style={{
              background: "#1f2937",
              color: "#e2e8f0",
              border: "1px solid #374151",
              borderRadius: "6px",
              padding: "6px 12px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ▶ Run
          </button>

          <button
            type="button"
            onClick={handleTestSolution}
            disabled={isValidating}
            style={{
              background: "linear-gradient(135deg, #ff5722 0%, #ff8a00 100%)",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              padding: "6px 16px",
              fontSize: "12px",
              fontWeight: 700,
              cursor: isValidating ? "wait" : "pointer",
              boxShadow: "0 2px 8px rgba(255, 87, 34, 0.3)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {isValidating ? "Validating..." : "✓ Check Solution"}
          </button>

          {nextLesson && (
            <Link
              href={`/web-dev/${nextLesson.id}`}
              style={{
                background: "#059669",
                color: "#ffffff",
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Next Lesson →
            </Link>
          )}
        </div>
      </div>

      {/* Main Split Layout: Left Guidance / Middle Code Editor / Right Preview & Console */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* LEFT PANEL: Concept Guide, Instructions, and Test Checklist */}
        <div
          style={{
            width: "380px",
            minWidth: "320px",
            background: "#0f172a",
            borderRight: "1px solid #1e293b",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Left panel tabs */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid #1e293b",
              background: "#090d16",
            }}
          >
            <button
              type="button"
              onClick={() => setActiveLeftTab("exercise")}
              style={{
                flex: 1,
                padding: "10px",
                background: activeLeftTab === "exercise" ? "#0f172a" : "transparent",
                color: activeLeftTab === "exercise" ? "#38bdf8" : "#94a3b8",
                border: "none",
                borderBottom: activeLeftTab === "exercise" ? "2px solid #38bdf8" : "2px solid transparent",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              📋 Exercise
            </button>
            <button
              type="button"
              onClick={() => setActiveLeftTab("guide")}
              style={{
                flex: 1,
                padding: "10px",
                background: activeLeftTab === "guide" ? "#0f172a" : "transparent",
                color: activeLeftTab === "guide" ? "#38bdf8" : "#94a3b8",
                border: "none",
                borderBottom: activeLeftTab === "guide" ? "2px solid #38bdf8" : "2px solid transparent",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              📖 Concept Guide
            </button>
            <button
              type="button"
              onClick={() => setActiveLeftTab("solution")}
              style={{
                flex: 1,
                padding: "10px",
                background: activeLeftTab === "solution" ? "#0f172a" : "transparent",
                color: activeLeftTab === "solution" ? "#38bdf8" : "#94a3b8",
                border: "none",
                borderBottom: activeLeftTab === "solution" ? "2px solid #38bdf8" : "2px solid transparent",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              💡 Solution
            </button>
          </div>

          {/* Left panel content body */}
          <div style={{ flex: 1, overflowY: "auto", padding: "18px" }}>
            {activeLeftTab === "exercise" && (
              <div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "12px" }}>
                  <span
                    style={{
                      background: lesson.difficulty === "Beginner" ? "#065f46" : lesson.difficulty === "Intermediate" ? "#854d0e" : "#991b1b",
                      color: "#f8fafc",
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {lesson.difficulty}
                  </span>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>⏱ ~{lesson.estimatedMinutes} mins</span>
                  {completedLessonIds.has(lesson.id) && (
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#34d399", background: "rgba(16, 185, 129, 0.2)", padding: "2px 6px", borderRadius: "4px" }}>
                      ✓ Completed
                    </span>
                  )}
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <h4 style={{ fontSize: "13px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 6px" }}>
                    Objective
                  </h4>
                  <p style={{ fontSize: "14px", color: "#e2e8f0", lineHeight: 1.6, margin: 0 }}>
                    {lesson.objective}
                  </p>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <h4 style={{ fontSize: "13px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 6px" }}>
                    Exercise Instructions
                  </h4>
                  <div
                    style={{
                      background: "#1e293b",
                      padding: "14px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      color: "#cbd5e1",
                      lineHeight: 1.6,
                      border: "1px solid #334155",
                    }}
                  >
                    {lesson.exerciseBrief}
                  </div>
                </div>

                {/* Requirements Checklist */}
                <div>
                  <h4 style={{ fontSize: "13px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 10px" }}>
                    Validation Requirements ({lesson.requirements.length})
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {lesson.requirements.map((req, idx) => {
                      const result = testResults.find((r) => r.id === req.id);
                      return (
                        <div
                          key={req.id}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "10px",
                            padding: "10px 12px",
                            borderRadius: "6px",
                            background: result ? (result.passed ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)") : "#131c2e",
                            border: `1px solid ${result ? (result.passed ? "#059669" : "#dc2626") : "#1f293d"}`,
                          }}
                        >
                          <span
                            style={{
                              fontSize: "14px",
                              lineHeight: 1,
                              color: result ? (result.passed ? "#10b981" : "#ef4444") : "#64748b",
                            }}
                          >
                            {result ? (result.passed ? "✓" : "✗") : `${idx + 1}.`}
                          </span>
                          <span style={{ fontSize: "12px", color: result?.passed ? "#34d399" : "#cbd5e1", lineHeight: 1.5 }}>
                            {req.description}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Success Banner if All Passed */}
                {allPassed && (
                  <div
                    style={{
                      marginTop: "20px",
                      background: "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)",
                      border: "1px solid #10b981",
                      borderRadius: "8px",
                      padding: "16px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "24px", marginBottom: "4px" }}>🎉</div>
                    <div style={{ fontSize: "15px", fontWeight: 800, color: "#34d399", marginBottom: "4px" }}>
                      All Requirements Passed!
                    </div>
                    <p style={{ fontSize: "12px", color: "#cbd5e1", margin: "0 0 12px" }}>
                      You have successfully completed this lesson exercise.
                    </p>
                    {nextLesson && (
                      <Link
                        href={`/web-dev/${nextLesson.id}`}
                        style={{
                          display: "inline-block",
                          background: "#10b981",
                          color: "#0f172a",
                          padding: "8px 16px",
                          borderRadius: "6px",
                          fontSize: "13px",
                          fontWeight: 700,
                          textDecoration: "none",
                        }}
                      >
                        Advance to Lesson #{nextLesson.number} →
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeLeftTab === "guide" && (
              <div>
                <h3 style={{ fontSize: "16px", color: "#f8fafc", margin: "0 0 12px" }}>
                  {lesson.title}
                </h3>
                <div
                  style={{
                    fontSize: "13px",
                    lineHeight: 1.7,
                    color: "#cbd5e1",
                    whiteSpace: "pre-line",
                  }}
                >
                  {lesson.conceptGuide}
                </div>
              </div>
            )}

            {activeLeftTab === "solution" && (
              <div>
                <h4 style={{ fontSize: "14px", color: "#f8fafc", margin: "0 0 8px" }}>
                  Reference Solution
                </h4>
                <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.5, margin: "0 0 16px" }}>
                  If you are stuck, review the reference implementation below. You can also load it directly into your editor.
                </p>

                <button
                  type="button"
                  onClick={handleLoadSolution}
                  style={{
                    width: "100%",
                    background: "#ff6a00",
                    color: "#ffffff",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    marginBottom: "16px",
                  }}
                >
                  Apply Reference Solution to Editor ↗
                </button>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#e34c26" }}>HTML Solution</span>
                    <pre
                      style={{
                        background: "#020617",
                        padding: "10px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        overflowX: "auto",
                        color: "#94a3b8",
                        border: "1px solid #1e293b",
                      }}
                    >
                      {lesson.solutionHtml}
                    </pre>
                  </div>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#264de4" }}>CSS Solution</span>
                    <pre
                      style={{
                        background: "#020617",
                        padding: "10px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        overflowX: "auto",
                        color: "#94a3b8",
                        border: "1px solid #1e293b",
                      }}
                    >
                      {lesson.solutionCss}
                    </pre>
                  </div>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#f7df1e" }}>JavaScript Solution</span>
                    <pre
                      style={{
                        background: "#020617",
                        padding: "10px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        overflowX: "auto",
                        color: "#94a3b8",
                        border: "1px solid #1e293b",
                      }}
                    >
                      {lesson.solutionJs}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MIDDLE PANEL: Multi-Tab Code Editor (HTML / CSS / JS) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid #1e293b",
            background: "#090d16",
            minWidth: "340px",
          }}
        >
          {/* Editor Tab Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#0c121e",
              borderBottom: "1px solid #1e293b",
              padding: "0 12px",
            }}
          >
            <div style={{ display: "flex", gap: "2px" }}>
              <button
                type="button"
                onClick={() => setActiveEditorTab("html")}
                style={{
                  padding: "10px 16px",
                  background: activeEditorTab === "html" ? "#090d16" : "transparent",
                  color: activeEditorTab === "html" ? "#e34c26" : "#64748b",
                  border: "none",
                  borderBottom: activeEditorTab === "html" ? "2px solid #e34c26" : "2px solid transparent",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>index.html</span>
                <span style={{ fontSize: "10px", opacity: 0.7 }}>HTML5</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveEditorTab("css")}
                style={{
                  padding: "10px 16px",
                  background: activeEditorTab === "css" ? "#090d16" : "transparent",
                  color: activeEditorTab === "css" ? "#38bdf8" : "#64748b",
                  border: "none",
                  borderBottom: activeEditorTab === "css" ? "2px solid #38bdf8" : "2px solid transparent",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>styles.css</span>
                <span style={{ fontSize: "10px", opacity: 0.7 }}>CSS3</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveEditorTab("js")}
                style={{
                  padding: "10px 16px",
                  background: activeEditorTab === "js" ? "#090d16" : "transparent",
                  color: activeEditorTab === "js" ? "#facc15" : "#64748b",
                  border: "none",
                  borderBottom: activeEditorTab === "js" ? "2px solid #facc15" : "2px solid transparent",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>script.js</span>
                <span style={{ fontSize: "10px", opacity: 0.7 }}>JS / ES6</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleResetStarter}
              title="Reset code back to starter state"
              style={{
                background: "transparent",
                color: "#64748b",
                border: "none",
                fontSize: "12px",
                cursor: "pointer",
                padding: "4px 8px",
              }}
            >
              ↺ Reset Starter
            </button>
          </div>

          {/* Editor Body Textarea */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            <textarea
              ref={editorTextareaRef}
              value={activeEditorTab === "html" ? htmlCode : activeEditorTab === "css" ? cssCode : jsCode}
              onChange={(e) => {
                if (activeEditorTab === "html") updateHtml(e.target.value);
                else if (activeEditorTab === "css") updateCss(e.target.value);
                else updateJs(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              placeholder={`Write your ${activeEditorTab.toUpperCase()} code here...`}
              style={{
                width: "100%",
                height: "100%",
                background: "#090d16",
                color: "#e2e8f0",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                fontSize: "13px",
                lineHeight: "1.6",
                padding: "16px",
                border: "none",
                outline: "none",
                resize: "none",
                whiteSpace: "pre",
                overflowWrap: "normal",
                overflowX: "auto",
                tabSize: 2,
              }}
            />
          </div>

          {/* Editor Bottom Status Bar */}
          <div
            style={{
              padding: "4px 14px",
              background: "#0c121e",
              borderTop: "1px solid #1e293b",
              display: "flex",
              justifyContent: "space-between",
              fontSize: "11px",
              color: "#64748b",
            }}
          >
            <span>
              Lines:{" "}
              {(activeEditorTab === "html" ? htmlCode : activeEditorTab === "css" ? cssCode : jsCode).split("\n").length} · Tab size: 2 spaces
            </span>
            <span>Shortcut: Press <b>Cmd+Enter</b> to Run</span>
          </div>
        </div>

        {/* RIGHT PANEL: Live Sandbox Preview / In-Browser Console / Tests Breakdown */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "#0d131f",
            minWidth: "340px",
          }}
        >
          {/* Right Pane Navigation Tabs */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#0a0e17",
              borderBottom: "1px solid #1e293b",
              padding: "0 12px",
            }}
          >
            <div style={{ display: "flex", gap: "2px" }}>
              <button
                type="button"
                onClick={() => setActiveRightTab("preview")}
                style={{
                  padding: "10px 16px",
                  background: activeRightTab === "preview" ? "#0d131f" : "transparent",
                  color: activeRightTab === "preview" ? "#10b981" : "#64748b",
                  border: "none",
                  borderBottom: activeRightTab === "preview" ? "2px solid #10b981" : "2px solid transparent",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>🖥 Live Sandbox Preview</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveRightTab("console")}
                style={{
                  padding: "10px 16px",
                  background: activeRightTab === "console" ? "#0d131f" : "transparent",
                  color: activeRightTab === "console" ? "#38bdf8" : "#64748b",
                  border: "none",
                  borderBottom: activeRightTab === "console" ? "2px solid #38bdf8" : "2px solid transparent",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>📟 Console</span>
                {consoleMessages.length > 0 && (
                  <span
                    style={{
                      background: "#1e293b",
                      color: "#94a3b8",
                      fontSize: "10px",
                      padding: "1px 6px",
                      borderRadius: "99px",
                    }}
                  >
                    {consoleMessages.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveRightTab("tests")}
                style={{
                  padding: "10px 16px",
                  background: activeRightTab === "tests" ? "#0d131f" : "transparent",
                  color: activeRightTab === "tests" ? "#ff8a00" : "#64748b",
                  border: "none",
                  borderBottom: activeRightTab === "tests" ? "2px solid #ff8a00" : "2px solid transparent",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>✓ Test Results</span>
                {hasRunTests && (
                  <span
                    style={{
                      background: allPassed ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
                      color: allPassed ? "#34d399" : "#f87171",
                      fontSize: "10px",
                      padding: "1px 6px",
                      borderRadius: "99px",
                      fontWeight: 700,
                    }}
                  >
                    {testResults.filter((r) => r.passed).length}/{lesson.requirements.length}
                  </span>
                )}
              </button>
            </div>

            {activeRightTab === "console" && (
              <button
                type="button"
                onClick={() => setConsoleMessages([])}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#64748b",
                  fontSize: "11px",
                  cursor: "pointer",
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Right Tab Content */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {/* 1. Live Sandbox Iframe */}
            <div style={{ flex: 1, display: activeRightTab === "preview" ? "flex" : "none", background: "#ffffff" }}>
              <iframe
                ref={iframeRef}
                title="Sandbox Preview"
                sandbox="allow-scripts allow-modals"
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  background: "#ffffff",
                }}
              />
            </div>

            {/* 2. In-Browser Developer Console */}
            {activeRightTab === "console" && (
              <div
                style={{
                  flex: 1,
                  background: "#080c14",
                  padding: "12px",
                  overflowY: "auto",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  fontSize: "12px",
                }}
              >
                {consoleMessages.length === 0 ? (
                  <div style={{ color: "#475569", padding: "16px", textAlign: "center" }}>
                    Console is empty. Run your code or execute <code>console.log(...)</code> to see output.
                  </div>
                ) : (
                  consoleMessages.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        padding: "6px 8px",
                        borderBottom: "1px solid #172033",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        color:
                          msg.level === "error"
                            ? "#ef4444"
                            : msg.level === "warn"
                            ? "#f59e0b"
                            : msg.level === "info"
                            ? "#38bdf8"
                            : "#e2e8f0",
                      }}
                    >
                      <span style={{ color: "#475569", fontSize: "10px", minWidth: "60px" }}>{msg.timestamp}</span>
                      <span style={{ fontWeight: 700, minWidth: "40px", textTransform: "uppercase", fontSize: "10px" }}>
                        [{msg.level}]
                      </span>
                      <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{msg.text}</pre>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 3. Test Results Detailed Breakdown */}
            {activeRightTab === "tests" && (
              <div style={{ flex: 1, background: "#080c14", padding: "20px", overflowY: "auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <div>
                    <h3 style={{ margin: "0 0 4px", fontSize: "16px", color: "#f8fafc" }}>
                      Automated Verification Suite
                    </h3>
                    <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
                      Evaluates your rendered DOM structure, CSS styles, and event reactions.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleTestSolution}
                    disabled={isValidating}
                    style={{
                      background: "#10b981",
                      color: "#0f172a",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {isValidating ? "Testing..." : "Re-test Suite ↺"}
                  </button>
                </div>

                {!hasRunTests ? (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#64748b" }}>
                    <div style={{ fontSize: "32px", marginBottom: "8px" }}>🧪</div>
                    <div style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "8px" }}>
                      No tests executed yet
                    </div>
                    <p style={{ fontSize: "12px", maxWidth: "340px", margin: "0 auto" }}>
                      Click <b>"Check Solution"</b> or <b>"Re-test Suite"</b> to validate your code against the required conditions.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {testResults.map((result, idx) => (
                      <div
                        key={result.id}
                        style={{
                          padding: "14px 16px",
                          borderRadius: "8px",
                          background: result.passed ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)",
                          border: `1px solid ${result.passed ? "#059669" : "#b91c1c"}`,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: result.passed ? "#34d399" : "#f87171" }}>
                            {result.passed ? "✓ Test Passed" : "✗ Requirement Failed"} (Check #{idx + 1})
                          </span>
                          <span
                            style={{
                              fontSize: "11px",
                              padding: "2px 8px",
                              borderRadius: "4px",
                              background: result.passed ? "#065f46" : "#7f1d1d",
                              color: "#f8fafc",
                            }}
                          >
                            {result.passed ? "PASS" : "FAIL"}
                          </span>
                        </div>
                        <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#cbd5e1", lineHeight: 1.5 }}>
                          {result.description}
                        </p>
                        {result.error && (
                          <div style={{ marginTop: "6px", fontSize: "11px", color: "#fca5a5" }}>
                            Error: {result.error}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
