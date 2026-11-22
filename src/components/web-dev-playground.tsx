"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { WebDevLesson, WebDevTrack } from "@/lib/web-dev-data";
import { AudioReader, webDevLessonToAudioChunks } from "@/components/audio-reader";

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
  // Sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [selectedTrack, setSelectedTrack] = useState<WebDevTrack | "All">("All");

  // Active editor tab: "html" | "css" | "js"
  const [activeEditorTab, setActiveEditorTab] = useState<"html" | "css" | "js">("html");

  // Code state
  const [htmlCode, setHtmlCode] = useState<string>(lesson.starterHtml);
  const [cssCode, setCssCode] = useState<string>(lesson.starterCss);
  const [jsCode, setJsCode] = useState<string>(lesson.starterJs);

  // Right pane tab: "preview" | "console" | "tests"
  const [activeRightTab, setActiveRightTab] = useState<"preview" | "console" | "tests">("preview");

  // Left pane tab: "tutorial" (W3Schools) | "exercise" (GUVI WebKata) | "solution"
  const [activeLeftTab, setActiveLeftTab] = useState<"tutorial" | "exercise" | "solution">("tutorial");

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

  // Spoken audio chunks for tutorial readout
  const audioChunks = useMemo(() => webDevLessonToAudioChunks(lesson), [lesson]);

  // W3Schools style Quiz state
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizIsCorrect, setQuizIsCorrect] = useState<boolean>(false);

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
      setSelectedQuizOption(null);
      setQuizSubmitted(false);
      setQuizIsCorrect(false);
    } catch {
      setHtmlCode(lesson.starterHtml);
      setCssCode(lesson.starterCss);
      setJsCode(lesson.starterJs);
    }
  }, [lesson.id, lesson.starterHtml, lesson.starterCss, lesson.starterJs]);

  // Persist code changes
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

  // Console listener
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

  // Auto-run trigger
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

  // Automated solution test runner (GUVI WebKata style)
  const handleTestSolution = () => {
    setIsValidating(true);
    setActiveRightTab("tests");

    if (iframeRef.current) {
      iframeRef.current.srcdoc = compileSrcDoc();
    }

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
          const testFn = new Function(
            "document",
            "window",
            `
            try {
              return (${req.testCode});
            } catch (e) {
              return false;
            }
          `,
          );
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

  // W3Schools style: Load "Try it Yourself" code directly into editor
  const handleLoadTryItExample = () => {
    setHtmlCode(lesson.tryItExample.html);
    setCssCode(lesson.tryItExample.css || "");
    setJsCode(lesson.tryItExample.js || "");
    updateHtml(lesson.tryItExample.html);
    updateCss(lesson.tryItExample.css || "");
    updateJs(lesson.tryItExample.js || "");
    setActiveRightTab("preview");
  };

  // W3Schools style Quiz submission
  const handleQuizSubmit = () => {
    if (selectedQuizOption === null || !lesson.quizExercise) return;
    const correct = selectedQuizOption === lesson.quizExercise.correctIndex;
    setQuizIsCorrect(correct);
    setQuizSubmitted(true);
  };

  // Tab key indents by 2 spaces
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

  // Navigation indices
  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;

  // Filter lessons for sidebar
  const filteredLessons =
    selectedTrack === "All" ? allLessons : allLessons.filter((l) => l.track === selectedTrack);

  const tracks: (WebDevTrack | "All")[] = ["All", "HTML", "CSS", "JavaScript", "React", "MERN Stack"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 64px)", background: "#0b0f17", color: "#f1f5f9" }}>
      {/* 1. TOP W3SCHOOLS-STYLE TRACK SELECTION & WORKSPACE HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 16px",
          background: "#090d16",
          borderBottom: "1px solid #1f2937",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Toggle Sidebar Button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle Curriculum Sidebar"
            style={{
              background: sidebarOpen ? "#1e293b" : "#0284c7",
              color: "#ffffff",
              border: "1px solid #334155",
              borderRadius: "6px",
              padding: "5px 10px",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            ☰ {sidebarOpen ? "Hide Index" : "Syllabus"}
          </button>

          {/* W3Schools style Track Pills */}
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {tracks.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTrack(t)}
                style={{
                  background: selectedTrack === t ? "#10b981" : "#131c2e",
                  color: selectedTrack === t ? "#0b0f17" : "#94a3b8",
                  border: "none",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Chapter Title & Navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {prevLesson ? (
            <Link
              href={`/web-dev/${prevLesson.id}`}
              style={{
                color: "#94a3b8",
                textDecoration: "none",
                background: "#1f2937",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              ❮ Prev
            </Link>
          ) : (
            <span style={{ color: "#475569", padding: "4px 8px", fontSize: "12px" }}>❮ Prev</span>
          )}

          <span style={{ fontSize: "13px", fontWeight: 700, color: "#f8fafc" }}>
            #{lesson.number}. {lesson.title}
          </span>

          {nextLesson ? (
            <Link
              href={`/web-dev/${nextLesson.id}`}
              style={{
                color: "#94a3b8",
                textDecoration: "none",
                background: "#1f2937",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              Next ❯
            </Link>
          ) : (
            <span style={{ color: "#475569", padding: "4px 8px", fontSize: "12px" }}>Next ❯</span>
          )}
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#94a3b8", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={autoRun}
              onChange={(e) => setAutoRun(e.target.checked)}
              style={{ cursor: "pointer", accentColor: "#ff6a00" }}
            />
            Auto Run
          </label>

          <button
            type="button"
            onClick={handleManualRun}
            title="Run Code in Sandbox"
            style={{
              background: "#1f2937",
              color: "#e2e8f0",
              border: "1px solid #374151",
              borderRadius: "6px",
              padding: "5px 12px",
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
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              padding: "5px 14px",
              fontSize: "12px",
              fontWeight: 700,
              cursor: isValidating ? "wait" : "pointer",
              boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {isValidating ? "Testing..." : "✓ Submit & Run Tests"}
          </button>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* W3SCHOOLS-STYLE LEFT SYLLABUS SIDEBAR */}
        {sidebarOpen && (
          <div
            style={{
              width: "250px",
              background: "#080c14",
              borderRight: "1px solid #1e293b",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
            }}
          >
            <div style={{ padding: "12px 14px", borderBottom: "1px solid #1e293b", background: "#0b101b" }}>
              <div style={{ fontSize: "11px", fontWeight: 800, color: "#10b981", textTransform: "uppercase" }}>
                Curriculum Table of Contents
              </div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                {completedLessonIds.size} of {allLessons.length} Mastered
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", padding: "6px 0" }}>
              {filteredLessons.map((l) => {
                const isActive = l.id === lesson.id;
                const isDone = completedLessonIds.has(l.id);
                return (
                  <Link
                    key={l.id}
                    href={`/web-dev/${l.id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 14px",
                      textDecoration: "none",
                      fontSize: "12px",
                      background: isActive ? "rgba(2, 132, 199, 0.15)" : "transparent",
                      color: isActive ? "#38bdf8" : "#cbd5e1",
                      borderLeft: isActive ? "3px solid #38bdf8" : "3px solid transparent",
                      fontWeight: isActive ? 700 : 500,
                    }}
                  >
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {l.number}. {l.title}
                    </span>
                    {isDone ? (
                      <span style={{ color: "#10b981", fontSize: "12px", fontWeight: 800 }}>✓</span>
                    ) : (
                      <span style={{ color: "#475569", fontSize: "10px" }}>○</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* GUIDANCE & INSTRUCTION PANEL (W3Schools Tutorial + GUVI WebKata + Solution) */}
        <div
          style={{
            width: "400px",
            minWidth: "340px",
            background: "#0f172a",
            borderRight: "1px solid #1e293b",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Sub-Tabs: Tutorial | WebKata Practice | Solution */}
          <div style={{ display: "flex", borderBottom: "1px solid #1e293b", background: "#090d16" }}>
            <button
              type="button"
              onClick={() => setActiveLeftTab("tutorial")}
              style={{
                flex: 1,
                padding: "10px 4px",
                background: activeLeftTab === "tutorial" ? "#0f172a" : "transparent",
                color: activeLeftTab === "tutorial" ? "#10b981" : "#94a3b8",
                border: "none",
                borderBottom: activeLeftTab === "tutorial" ? "2px solid #10b981" : "2px solid transparent",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              📖 Tutorial &amp; Try-It
            </button>
            <button
              type="button"
              onClick={() => setActiveLeftTab("exercise")}
              style={{
                flex: 1,
                padding: "10px 4px",
                background: activeLeftTab === "exercise" ? "#0f172a" : "transparent",
                color: activeLeftTab === "exercise" ? "#38bdf8" : "#94a3b8",
                border: "none",
                borderBottom: activeLeftTab === "exercise" ? "2px solid #38bdf8" : "2px solid transparent",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              🎯 Practice WebKata
            </button>
            <button
              type="button"
              onClick={() => setActiveLeftTab("solution")}
              style={{
                flex: 1,
                padding: "10px 4px",
                background: activeLeftTab === "solution" ? "#0f172a" : "transparent",
                color: activeLeftTab === "solution" ? "#f59e0b" : "#94a3b8",
                border: "none",
                borderBottom: activeLeftTab === "solution" ? "2px solid #f59e0b" : "2px solid transparent",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              💡 Solution
            </button>
          </div>

          {/* Panel Content Body */}
          <div style={{ flex: 1, overflowY: "auto", padding: "18px" }}>
            {/* TAB 1: W3SCHOOLS STYLE TUTORIAL & "TRY IT YOURSELF" */}
            {activeLeftTab === "tutorial" && (
              <div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "12px" }}>
                  <span
                    style={{
                      background: "#1e293b",
                      color: "#38bdf8",
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {lesson.track} Track
                  </span>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>⏱ ~{lesson.estimatedMinutes} mins</span>
                </div>

                <h3 style={{ fontSize: "18px", color: "#f8fafc", margin: "0 0 12px" }}>{lesson.title}</h3>

                {/* Read Aloud Audio Player */}
                <AudioReader
                  title={`Chapter ${lesson.number}: ${lesson.title}`}
                  subtitle={`${lesson.track} Track · Concept Tutorial & Code Explanation`}
                  chunks={audioChunks}
                  badgeLabel="Tutorial Audio"
                />

                <div
                  style={{
                    fontSize: "13px",
                    lineHeight: 1.7,
                    color: "#cbd5e1",
                    whiteSpace: "pre-line",
                    marginBottom: "20px",
                  }}
                >
                  {lesson.conceptGuide}
                </div>

                {/* SIGNATURE W3SCHOOLS "TRY IT YOURSELF" EXAMPLE BOX */}
                <div
                  style={{
                    background: "#090d16",
                    border: "1px solid #10b981",
                    borderRadius: "8px",
                    padding: "14px",
                    marginBottom: "20px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 800, color: "#10b981", textTransform: "uppercase" }}>
                      ⚡ {lesson.tryItExample.title}
                    </span>
                    <button
                      type="button"
                      onClick={handleLoadTryItExample}
                      style={{
                        background: "#10b981",
                        color: "#0b0f17",
                        border: "none",
                        padding: "4px 10px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      Try it Yourself ❯
                    </button>
                  </div>
                  <p style={{ margin: "0 0 10px", fontSize: "12px", color: "#94a3b8" }}>
                    {lesson.tryItExample.description} Click above to load and run this example immediately in your editor.
                  </p>
                  <pre
                    style={{
                      background: "#020617",
                      padding: "10px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      overflowX: "auto",
                      color: "#34d399",
                      border: "1px solid #1f293d",
                      margin: 0,
                    }}
                  >
                    {lesson.tryItExample.html}
                  </pre>
                </div>

                {/* W3SCHOOLS STYLE INTERACTIVE CHAPTER QUIZ */}
                {lesson.quizExercise && (
                  <div
                    style={{
                      background: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      padding: "14px",
                    }}
                  >
                    <div style={{ fontSize: "11px", fontWeight: 800, color: "#facc15", textTransform: "uppercase", marginBottom: "6px" }}>
                      🎯 Test Yourself With Exercises!
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#f8fafc", marginBottom: "12px" }}>
                      {lesson.quizExercise.question}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
                      {lesson.quizExercise.options.map((opt, idx) => (
                        <label
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 10px",
                            borderRadius: "6px",
                            background: selectedQuizOption === idx ? "rgba(56, 189, 248, 0.15)" : "#0f172a",
                            border: `1px solid ${selectedQuizOption === idx ? "#38bdf8" : "#334155"}`,
                            fontSize: "12px",
                            color: "#cbd5e1",
                            cursor: "pointer",
                          }}
                        >
                          <input
                            type="radio"
                            name="chapter-quiz"
                            checked={selectedQuizOption === idx}
                            onChange={() => setSelectedQuizOption(idx)}
                            style={{ accentColor: "#38bdf8" }}
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleQuizSubmit}
                      disabled={selectedQuizOption === null}
                      style={{
                        background: selectedQuizOption !== null ? "#38bdf8" : "#475569",
                        color: "#0f172a",
                        border: "none",
                        padding: "6px 14px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: selectedQuizOption !== null ? "pointer" : "not-allowed",
                      }}
                    >
                      Submit Answer
                    </button>

                    {quizSubmitted && (
                      <div
                        style={{
                          marginTop: "10px",
                          padding: "10px",
                          borderRadius: "6px",
                          background: quizIsCorrect ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                          border: `1px solid ${quizIsCorrect ? "#10b981" : "#ef4444"}`,
                          fontSize: "12px",
                          color: quizIsCorrect ? "#34d399" : "#f87171",
                        }}
                      >
                        <b>{quizIsCorrect ? "🎉 Correct!" : "❌ Not quite right."}</b> {lesson.quizExercise.explanation}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: GUVI WEBKATA STYLE PRACTICE CHALLENGE */}
            {activeLeftTab === "exercise" && (
              <div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "12px" }}>
                  <span
                    style={{
                      background:
                        lesson.difficulty === "Beginner"
                          ? "#065f46"
                          : lesson.difficulty === "Intermediate"
                          ? "#854d0e"
                          : "#991b1b",
                      color: "#f8fafc",
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {lesson.difficulty}
                  </span>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>GUVI WebKata Practice</span>
                  {completedLessonIds.has(lesson.id) && (
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#34d399", background: "rgba(16, 185, 129, 0.2)", padding: "2px 6px", borderRadius: "4px" }}>
                      ✓ Mastered
                    </span>
                  )}
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <h4 style={{ fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 6px" }}>
                    Problem Statement
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

                {/* Requirements / Test Cases Checklist */}
                <div style={{ marginBottom: "20px" }}>
                  <h4 style={{ fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px" }}>
                    Test Cases / Requirements ({lesson.requirements.length})
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {lesson.requirements.map((req, idx) => {
                      const res = testResults.find((r) => r.id === req.id);
                      return (
                        <div
                          key={req.id}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "8px",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            background: res ? (res.passed ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)") : "#131c2e",
                            border: `1px solid ${res ? (res.passed ? "#059669" : "#dc2626") : "#1f293d"}`,
                          }}
                        >
                          <span style={{ fontSize: "12px", color: res ? (res.passed ? "#10b981" : "#ef4444") : "#64748b", fontWeight: 800 }}>
                            {res ? (res.passed ? "✓" : "✗") : `TC ${idx + 1}`}
                          </span>
                          <span style={{ fontSize: "12px", color: res?.passed ? "#34d399" : "#cbd5e1", lineHeight: 1.5 }}>
                            {req.description}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Progressive Hints */}
                {lesson.hints && lesson.hints.length > 0 && (
                  <div style={{ background: "#090d16", border: "1px solid #1e293b", borderRadius: "8px", padding: "12px", marginBottom: "16px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 800, color: "#f59e0b", textTransform: "uppercase", marginBottom: "4px" }}>
                      💡 Hints &amp; Guidance
                    </div>
                    <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: "#94a3b8", lineHeight: 1.6 }}>
                      {lesson.hints.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Success Banner if All Passed */}
                {allPassed && (
                  <div
                    style={{
                      background: "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)",
                      border: "1px solid #10b981",
                      borderRadius: "8px",
                      padding: "16px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "24px", marginBottom: "4px" }}>🎉</div>
                    <div style={{ fontSize: "15px", fontWeight: 800, color: "#34d399", marginBottom: "4px" }}>
                      All Test Cases Passed!
                    </div>
                    <p style={{ fontSize: "12px", color: "#cbd5e1", margin: "0 0 12px" }}>
                      You have mastered this practice challenge.
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
                        Advance to Chapter #{nextLesson.number} →
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: REFERENCE SOLUTION */}
            {activeLeftTab === "solution" && (
              <div>
                <h4 style={{ fontSize: "14px", color: "#f8fafc", margin: "0 0 8px" }}>Reference Solution</h4>
                <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.5, margin: "0 0 14px" }}>
                  Review the working solution below. You can apply it directly to your editor to observe how it passes all validation requirements.
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
                  Apply Solution to Editor ↗
                </button>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#e34c26" }}>HTML Solution</span>
                    <pre style={{ background: "#020617", padding: "10px", borderRadius: "6px", fontSize: "11px", overflowX: "auto", color: "#94a3b8", border: "1px solid #1e293b", margin: 0 }}>
                      {lesson.solutionHtml}
                    </pre>
                  </div>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8" }}>CSS Solution</span>
                    <pre style={{ background: "#020617", padding: "10px", borderRadius: "6px", fontSize: "11px", overflowX: "auto", color: "#94a3b8", border: "1px solid #1e293b", margin: 0 }}>
                      {lesson.solutionCss}
                    </pre>
                  </div>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#facc15" }}>JavaScript Solution</span>
                    <pre style={{ background: "#020617", padding: "10px", borderRadius: "6px", fontSize: "11px", overflowX: "auto", color: "#94a3b8", border: "1px solid #1e293b", margin: 0 }}>
                      {lesson.solutionJs}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CODE EDITOR & RUNNER (GUVI WebKata + W3Schools Try-It Editor) */}
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
          {/* Editor File Tab Bar */}
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
                  padding: "8px 14px",
                  background: activeEditorTab === "html" ? "#090d16" : "transparent",
                  color: activeEditorTab === "html" ? "#e34c26" : "#64748b",
                  border: "none",
                  borderBottom: activeEditorTab === "html" ? "2px solid #e34c26" : "2px solid transparent",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                index.html
              </button>

              <button
                type="button"
                onClick={() => setActiveEditorTab("css")}
                style={{
                  padding: "8px 14px",
                  background: activeEditorTab === "css" ? "#090d16" : "transparent",
                  color: activeEditorTab === "css" ? "#38bdf8" : "#64748b",
                  border: "none",
                  borderBottom: activeEditorTab === "css" ? "2px solid #38bdf8" : "2px solid transparent",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                styles.css
              </button>

              <button
                type="button"
                onClick={() => setActiveEditorTab("js")}
                style={{
                  padding: "8px 14px",
                  background: activeEditorTab === "js" ? "#090d16" : "transparent",
                  color: activeEditorTab === "js" ? "#facc15" : "#64748b",
                  border: "none",
                  borderBottom: activeEditorTab === "js" ? "2px solid #facc15" : "2px solid transparent",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                script.js
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
                fontSize: "11px",
                cursor: "pointer",
              }}
            >
              ↺ Reset Code
            </button>
          </div>

          {/* Textarea Editor */}
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
                padding: "14px",
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

          {/* Editor Status Bar */}
          <div
            style={{
              padding: "4px 12px",
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
              {(activeEditorTab === "html" ? htmlCode : activeEditorTab === "css" ? cssCode : jsCode).split("\n").length}
            </span>
            <span>Tab: 2 spaces · Cmd+Enter to Run</span>
          </div>
        </div>

        {/* RIGHT PREVIEW & CONSOLE PANE */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#0d131f", minWidth: "340px" }}>
          {/* Navigation Bar */}
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
                  padding: "8px 14px",
                  background: activeRightTab === "preview" ? "#0d131f" : "transparent",
                  color: activeRightTab === "preview" ? "#10b981" : "#64748b",
                  border: "none",
                  borderBottom: activeRightTab === "preview" ? "2px solid #10b981" : "2px solid transparent",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                🖥 Live Output
              </button>

              <button
                type="button"
                onClick={() => setActiveRightTab("console")}
                style={{
                  padding: "8px 14px",
                  background: activeRightTab === "console" ? "#0d131f" : "transparent",
                  color: activeRightTab === "console" ? "#38bdf8" : "#64748b",
                  border: "none",
                  borderBottom: activeRightTab === "console" ? "2px solid #38bdf8" : "2px solid transparent",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                📟 Console {consoleMessages.length > 0 && `(${consoleMessages.length})`}
              </button>

              <button
                type="button"
                onClick={() => setActiveRightTab("tests")}
                style={{
                  padding: "8px 14px",
                  background: activeRightTab === "tests" ? "#0d131f" : "transparent",
                  color: activeRightTab === "tests" ? "#ff8a00" : "#64748b",
                  border: "none",
                  borderBottom: activeRightTab === "tests" ? "2px solid #ff8a00" : "2px solid transparent",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                🧪 Test Cases {hasRunTests && `(${testResults.filter((r) => r.passed).length}/${lesson.requirements.length})`}
              </button>
            </div>

            {activeRightTab === "console" && (
              <button
                type="button"
                onClick={() => setConsoleMessages([])}
                style={{ background: "transparent", border: "none", color: "#64748b", fontSize: "11px", cursor: "pointer" }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Right Pane Body */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {/* 1. Live Sandbox Iframe */}
            <div style={{ flex: 1, display: activeRightTab === "preview" ? "flex" : "none", background: "#ffffff" }}>
              <iframe
                ref={iframeRef}
                title="Live Sandbox Preview"
                sandbox="allow-scripts allow-modals"
                style={{ width: "100%", height: "100%", border: "none", background: "#ffffff" }}
              />
            </div>

            {/* 2. In-Browser Console */}
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
                    Console is empty. Run your code or execute <code>console.log(...)</code> to inspect outputs.
                  </div>
                ) : (
                  consoleMessages.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        padding: "4px 6px",
                        borderBottom: "1px solid #172033",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
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
                      <span style={{ color: "#475569", fontSize: "10px", minWidth: "55px" }}>{msg.timestamp}</span>
                      <span style={{ fontWeight: 700, minWidth: "35px", textTransform: "uppercase", fontSize: "10px" }}>
                        [{msg.level}]
                      </span>
                      <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{msg.text}</pre>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 3. Test Cases Breakdown */}
            {activeRightTab === "tests" && (
              <div style={{ flex: 1, background: "#080c14", padding: "16px", overflowY: "auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <div>
                    <h3 style={{ margin: "0 0 2px", fontSize: "15px", color: "#f8fafc" }}>
                      Automated Verification Suite
                    </h3>
                    <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>
                      Validates HTML structure, CSS properties, and JavaScript functionality.
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
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    {isValidating ? "Validating..." : "Run Test Cases ↺"}
                  </button>
                </div>

                {!hasRunTests ? (
                  <div style={{ textAlign: "center", padding: "30px 16px", color: "#64748b" }}>
                    <div style={{ fontSize: "28px", marginBottom: "6px" }}>🧪</div>
                    <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>
                      No tests executed yet
                    </div>
                    <p style={{ fontSize: "12px", maxWidth: "300px", margin: "0 auto" }}>
                      Click <b>"Submit &amp; Run Tests"</b> to check your code against all requirement conditions.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {testResults.map((res, idx) => (
                      <div
                        key={res.id}
                        style={{
                          padding: "10px 14px",
                          borderRadius: "6px",
                          background: res.passed ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)",
                          border: `1px solid ${res.passed ? "#059669" : "#b91c1c"}`,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "12px", fontWeight: 700, color: res.passed ? "#34d399" : "#f87171" }}>
                            {res.passed ? "✓ Test Case Passed" : "✗ Test Case Failed"} (#{idx + 1})
                          </span>
                          <span
                            style={{
                              fontSize: "10px",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              background: res.passed ? "#065f46" : "#7f1d1d",
                              color: "#f8fafc",
                              fontWeight: 700,
                            }}
                          >
                            {res.passed ? "PASS" : "FAIL"}
                          </span>
                        </div>
                        <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#cbd5e1", lineHeight: 1.5 }}>
                          {res.description}
                        </p>
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
