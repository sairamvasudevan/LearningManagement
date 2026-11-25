"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  LSRW_CURRICULUM_MODULES,
  COMMUNICATION_PRACTICE_BANK,
  CORPORATE_MOCK_ASSESSMENT,
  type CommunicationExercise,
  type LsrwSkill,
} from "@/lib/communication-data";
import type {
  MockAssessmentEvaluationResult,
  PracticeEvaluationResult,
  PracticeSubmissionInput,
} from "@/lib/communication-evaluator";

interface SpeechRecognitionAlternativeLike {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: SpeechRecognitionResultLike;
  };
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechWindow extends Window {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
}

interface CommunicationStudioProps {
  initialTab?: "curriculum" | "practice" | "assessment";
  initialSkill?: "all" | LsrwSkill;
  completedIds?: string[];
  recentBestScore?: number | null;
  signedIn?: boolean;
}

const SKILL_BADGE_MAP: Record<LsrwSkill, { label: string; color: string; bg: string; icon: string }> = {
  listening: { label: "Listening (L)", color: "#38bdf8", bg: "rgba(56, 189, 248, 0.14)", icon: "🎧" },
  speaking: { label: "Speaking (S)", color: "#c084fc", bg: "rgba(192, 132, 252, 0.14)", icon: "🎙️" },
  reading: { label: "Reading (R)", color: "#34d399", bg: "rgba(52, 211, 153, 0.14)", icon: "📖" },
  writing: { label: "Writing (W)", color: "#fbbf24", bg: "rgba(251, 191, 36, 0.14)", icon: "✍️" },
};

export function CommunicationStudio({
  initialTab = "practice",
  initialSkill = "all",
  completedIds = [],
  recentBestScore = null,
  signedIn = false,
}: CommunicationStudioProps) {
  const [activeTab, setActiveTab] = useState<"curriculum" | "practice" | "assessment">(initialTab);
  const [skillFilter, setSkillFilter] = useState<"all" | LsrwSkill>(initialSkill);
  const [passedIds, setPassedIds] = useState<Set<string>>(new Set(completedIds));

  // Curriculum tab state
  const [selectedModId, setSelectedModId] = useState<string>(LSRW_CURRICULUM_MODULES[0].id);

  // Practice Arena state
  const filteredExercises = useMemo(() => {
    if (skillFilter === "all") return COMMUNICATION_PRACTICE_BANK;
    return COMMUNICATION_PRACTICE_BANK.filter((ex) => ex.skill === skillFilter);
  }, [skillFilter]);

  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(
    filteredExercises[0]?.id || COMMUNICATION_PRACTICE_BANK[0].id,
  );
  const activeExercise: CommunicationExercise =
    COMMUNICATION_PRACTICE_BANK.find((ex) => ex.id === selectedExerciseId) ||
    filteredExercises[0] ||
    COMMUNICATION_PRACTICE_BANK[0];

  const [responseText, setResponseText] = useState<string>("");
  const [selectedMcq, setSelectedMcq] = useState<number | null>(null);
  const [inputMethod, setInputMethod] = useState<"mic" | "typed">("typed");
  const [speechConfidence, setSpeechConfidence] = useState<number | undefined>(undefined);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isSpeakingAudio, setIsSpeakingAudio] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(0.95);
  const [audioPlays, setAudioPlays] = useState<number>(0);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [micNote, setMicNote] = useState<string>("");
  const [isPassageHidden, setIsPassageHidden] = useState<boolean>(false);
  const [studyRemaining, setStudyRemaining] = useState<number>(0);
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [practiceError, setPracticeError] = useState<string>("");
  const [practiceResult, setPracticeResult] = useState<PracticeEvaluationResult | null>(null);
  const [persistedBanner, setPersistedBanner] = useState<boolean>(false);

  // Mock Assessment state
  const mockItems = useMemo(
    () => CORPORATE_MOCK_ASSESSMENT.sections.flatMap((s) => s.items),
    [],
  );
  const [mockStarted, setMockStarted] = useState<boolean>(false);
  const [mockRemainingSec, setMockRemainingSec] = useState<number>(
    CORPORATE_MOCK_ASSESSMENT.durationMinutes * 60,
  );
  const [mockAnswers, setMockAnswers] = useState<Record<string, { text: string; mcq?: number; method?: "mic" | "typed" }>>({});
  const [mockHiddenPassages, setMockHiddenPassages] = useState<Record<string, boolean>>({});
  const [mockSubmitting, setMockSubmitting] = useState<boolean>(false);
  const [mockResult, setMockResult] = useState<MockAssessmentEvaluationResult | null>(null);
  const [mockError, setMockError] = useState<string>("");
  const [bestScore, setBestScore] = useState<number | null>(recentBestScore);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const stopAllAudioAndMic = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeakingAudio(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsRecording(false);
  }, []);

  const selectExercise = useCallback(
    (ex: CommunicationExercise) => {
      stopAllAudioAndMic();
      setSelectedExerciseId(ex.id);
      setResponseText("");
      setSelectedMcq(null);
      setInputMethod("typed");
      setSpeechConfidence(undefined);
      setElapsedSeconds(0);
      setAudioPlays(0);
      setShowTranscript(false);
      setMicNote("");
      setPracticeResult(null);
      setPracticeError("");
      setPersistedBanner(false);
      setIsPassageHidden(false);
      setStudyRemaining(ex.studySeconds || 0);
    },
    [stopAllAudioAndMic],
  );

  // Elapsed timer during active practice drill
  useEffect(() => {
    if (activeTab !== "practice" || practiceResult) return;
    const timer = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
      setStudyRemaining((rem) => {
        if (rem <= 1) {
          if (activeExercise.type === "write_reconstruction" && rem === 1) {
            setIsPassageHidden(true);
          }
          return 0;
        }
        return rem - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeTab, activeExercise.id, activeExercise.type, practiceResult]);

  // Global countdown during active Mock Test
  useEffect(() => {
    if (activeTab !== "assessment" || !mockStarted || mockResult) return;
    const timer = setInterval(() => {
      setMockRemainingSec((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [activeTab, mockStarted, mockResult]);

  useEffect(() => {
    return () => {
      stopAllAudioAndMic();
    };
  }, [stopAllAudioAndMic]);

  const playAudioPrompt = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setShowTranscript(true);
      setMicNote("Audio synthesis unavailable in this browser; prompt transcript displayed below.");
      return;
    }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = speechRate;
    utt.pitch = 1.0;
    utt.onstart = () => setIsSpeakingAudio(true);
    utt.onend = () => setIsSpeakingAudio(false);
    utt.onerror = () => setIsSpeakingAudio(false);
    setAudioPlays((n) => n + 1);
    window.speechSynthesis.speak(utt);
  };

  const toggleMicCapture = (onTranscript: (text: string, conf?: number) => void) => {
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }
    if (typeof window === "undefined") return;
    const win = window as unknown as SpeechWindow;
    const Ctor = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!Ctor) {
      setMicNote("Live browser SpeechRecognition is unavailable here — type or speak into OS dictation cleanly in the response box.");
      return;
    }
    try {
      const rec = new Ctor();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";
      let accumulated = "";
      rec.onresult = (event) => {
        let interim = "";
        let lastConf: number | undefined;
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const r = event.results[i];
          const alt = r[0];
          if (alt?.transcript) {
            if (r.isFinal) {
              accumulated += (accumulated ? " " : "") + alt.transcript.trim();
              if (typeof alt.confidence === "number" && alt.confidence > 0) {
                lastConf = alt.confidence;
              }
            } else {
              interim += alt.transcript;
            }
          }
        }
        onTranscript([accumulated, interim].filter(Boolean).join(" ").trim(), lastConf);
      };
      rec.onerror = () => {
        setIsRecording(false);
        setMicNote("Microphone or offline speech engine blocked; continue using the typed/dictation workspace.");
      };
      rec.onend = () => setIsRecording(false);
      recognitionRef.current = rec;
      rec.start();
      setIsRecording(true);
      setMicNote("Listening via Microphone... click Stop Mic when done.");
    } catch {
      setMicNote("Could not start microphone capture; use typed/dictation response below.");
    }
  };

  const handlePracticeSubmit = async () => {
    setEvaluating(true);
    setPracticeError("");
    try {
      const res = await fetch("/api/communication/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "practice",
          exerciseId: activeExercise.id,
          responseText,
          selectedOptionIndex: selectedMcq ?? undefined,
          elapsedSeconds: Math.max(3, elapsedSeconds),
          inputMethod,
          speechConfidence,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Evaluation failed");
      const evalRes = data.result as PracticeEvaluationResult;
      setPracticeResult(evalRes);
      setPersistedBanner(Boolean(data.persisted));
      setShowTranscript(true);
      if (evalRes.passed) {
        setPassedIds((prev) => new Set([...prev, activeExercise.id]));
        setBestScore((prev) => (prev === null ? evalRes.versantScore : Math.max(prev, evalRes.versantScore)));
      }
    } catch (err) {
      setPracticeError(err instanceof Error ? err.message : "Could not verify response");
    } finally {
      setEvaluating(false);
    }
  };

  const handleMockSubmit = async () => {
    stopAllAudioAndMic();
    setMockSubmitting(true);
    setMockError("");
    try {
      const payloadAnswers: PracticeSubmissionInput[] = mockItems.map((item) => {
        const entry = mockAnswers[item.id];
        return {
          exerciseId: item.id,
          responseText: entry?.text || "",
          selectedOptionIndex: typeof entry?.mcq === "number" ? entry.mcq : undefined,
          elapsedSeconds: 30,
          inputMethod: entry?.method || "typed",
        };
      });

      const res = await fetch("/api/communication/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "assessment",
          answers: payloadAnswers,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Assessment evaluation failed");
      const result = data.result as MockAssessmentEvaluationResult;
      setMockResult(result);
      setBestScore((prev) =>
        prev === null ? result.overallVersantScore : Math.max(prev, result.overallVersantScore),
      );
    } catch (err) {
      setMockError(err instanceof Error ? err.message : "Failed to grade assessment");
    } finally {
      setMockSubmitting(false);
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const activeModule =
    LSRW_CURRICULUM_MODULES.find((m) => m.id === selectedModId) || LSRW_CURRICULUM_MODULES[0];

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px 20px 64px" }}>
      {/* Top Studio Header Bar */}
      <div className="portal-welcome-card" style={{ marginBottom: "20px", padding: "24px 28px" }}>
        <div className="portal-welcome-main">
          <div className="portal-badges">
            <span className="badge-flame" style={{ background: "rgba(168, 85, 247, 0.18)", color: "#c084fc", border: "1px solid rgba(192, 132, 252, 0.35)" }}>
              🎙️ LSRW COMMUNICATION STUDIO
            </span>
            <span className="badge-free">Versant &amp; Mercer Mettl SpeechX Aligned</span>
            <span className="badge-roll" title="Deterministic rule-based verifier v1 ready for future Whisper/LLM plug-in">
              Heuristic Verifier v1 · AI Slot Ready
            </span>
          </div>
          <h1 style={{ fontSize: "26px", margin: "8px 0 6px" }}>
            Corporate Communication &amp; LSRW Practice Lab
          </h1>
          <p style={{ margin: 0, maxWidth: "700px" }}>
            Train Listening, Speaking, Reading, and Writing modules tailored to Accenture, Cognizant, TCS, and Amazon
            communication assessments with instant Versant-scale (20–80) &amp; CEFR verification.
          </p>
        </div>
        <div className="portal-overall-stat" style={{ minWidth: "180px" }}>
          <div className="stat-circle" style={{ borderColor: "#c084fc" }}>
            <span className="stat-number" style={{ fontSize: "22px" }}>
              {bestScore !== null ? `${bestScore}/80` : `${passedIds.size}/12`}
            </span>
            <span className="stat-label">{bestScore !== null ? "Peak Versant" : "Drills Passed"}</span>
          </div>
          <div className="stat-sub">
            {passedIds.size} of {COMMUNICATION_PRACTICE_BANK.length} Practice Drills Mastered
          </div>
        </div>
      </div>

      {/* Primary Studio Mode Switcher */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            type="button"
            className={`ed-filter-pill ${activeTab === "curriculum" ? "active" : ""}`}
            onClick={() => {
              stopAllAudioAndMic();
              setActiveTab("curriculum");
            }}
          >
            📚 1. Learn LSRW Framework (4 Modules)
          </button>
          <button
            type="button"
            className={`ed-filter-pill ${activeTab === "practice" ? "active" : ""}`}
            onClick={() => {
              stopAllAudioAndMic();
              setActiveTab("practice");
            }}
          >
            🎯 2. LSRW Practice Studio ({passedIds.size}/12 Passed)
          </button>
          <button
            type="button"
            className={`ed-filter-pill ${activeTab === "assessment" ? "active" : ""}`}
            onClick={() => {
              stopAllAudioAndMic();
              setActiveTab("assessment");
            }}
          >
            🏆 3. Corporate LSRW Mock Test (10 Parts)
          </button>
        </div>

        <Link href="/communication" className="button button-quiet" style={{ fontSize: "12.5px" }}>
          ← Overview &amp; Rubrics
        </Link>
      </div>

      {/* =================================================================
          TAB 1: LEARN LSRW CURRICULUM MODULES
      ================================================================== */}
      {activeTab === "curriculum" && (
        <div className="comm-studio-split">
          <div className="surface-card" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ fontSize: "11px", fontWeight: 800, color: "#86868b", textTransform: "uppercase", letterSpacing: "0.08em", padding: "0 4px" }}>
              4 Pillars of Communication
            </div>
            {LSRW_CURRICULUM_MODULES.map((mod) => {
              const meta = SKILL_BADGE_MAP[mod.skill];
              const isSelected = mod.id === activeModule.id;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => setSelectedModId(mod.id)}
                  style={{
                    textAlign: "left",
                    padding: "12px 14px",
                    borderRadius: "12px",
                    border: isSelected ? `1.5px solid ${meta.color}` : "1px solid var(--border-subtle)",
                    background: isSelected ? meta.bg : "#1c1c1e",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: "11px", fontWeight: 800, color: meta.color, marginBottom: "4px" }}>
                    {meta.icon} {meta.label}
                  </div>
                  <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#f5f5f7", lineHeight: 1.35 }}>
                    {mod.title.split(":")[1]?.trim() || mod.title}
                  </div>
                  <div style={{ fontSize: "11.5px", color: "#86868b", marginTop: "4px" }}>
                    ⏱️ {mod.estimatedMinutes} mins read
                  </div>
                </button>
              );
            })}
          </div>

          <article className="surface-card" style={{ padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
              <div>
                <span className="eyebrow" style={{ color: SKILL_BADGE_MAP[activeModule.skill].color }}>
                  {activeModule.badge}
                </span>
                <h2 style={{ margin: "6px 0 6px", fontSize: "24px", color: "#f5f5f7" }}>
                  {activeModule.title}
                </h2>
                <p style={{ margin: 0, color: "#a1a1aa", fontSize: "14px", lineHeight: 1.55 }}>
                  {activeModule.subtitle}
                </p>
              </div>
              <button
                type="button"
                className="button button-quiet"
                onClick={() =>
                  playAudioPrompt(
                    `${activeModule.title}. ${activeModule.subtitle}. Key strategies: ${activeModule.coreStrategies
                      .map((s) => `${s.heading}: ${s.detail}`)
                      .join(" ")}`,
                  )
                }
              >
                {isSpeakingAudio ? "🔊 Narrating..." : "🔊 Read Module Aloud"}
              </button>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
              {activeModule.companyBenchmarks.map((b) => (
                <span key={b} className="tag-pill" style={{ background: "#242426", color: "#e5e5ea" }}>
                  🏢 {b}
                </span>
              ))}
            </div>

            <h3 style={{ fontSize: "15px", color: "#f5f5f7", marginBottom: "10px" }}>
              What Corporate Evaluators Grade
            </h3>
            <ul style={{ margin: "0 0 22px", paddingLeft: "20px", color: "#cbd5e1", fontSize: "14px", lineHeight: 1.65 }}>
              {activeModule.whatTestsMeasure.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>

            <h3 style={{ fontSize: "15px", color: "#f5f5f7", marginBottom: "12px" }}>
              Proven Execution Strategies
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
              {activeModule.coreStrategies.map((st, idx) => (
                <div key={idx} style={{ background: "#111113", border: "1px solid var(--border-subtle)", borderRadius: "12px", padding: "16px" }}>
                  <div style={{ fontWeight: 700, fontSize: "14.5px", color: "#f5f5f7", marginBottom: "6px" }}>
                    {idx + 1}. {st.heading}
                  </div>
                  <p style={{ margin: 0, fontSize: "13.5px", color: "#cbd5e1", lineHeight: 1.6 }}>
                    {st.detail}
                  </p>
                  {st.exampleBad && st.exampleGood && (
                    <div className="comparison-columns" style={{ marginTop: "12px" }}>
                      <div className="comparison-bad">
                        <b>✗ Common Pitfall:</b>
                        <p>{st.exampleBad}</p>
                      </div>
                      <div className="comparison-good">
                        <b>✓ Placement Standard:</b>
                        <p>{st.exampleGood}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px", marginBottom: "24px" }}>
              <div className="callout-box warning-callout">
                <b>⚠️ High-Frequency Traps</b>
                <ul style={{ margin: "6px 0 0", paddingLeft: "18px" }}>
                  {activeModule.commonTraps.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <div className="callout-box tip-callout">
                <b>✅ Self-Check Rubric</b>
                <ul style={{ margin: "6px 0 0", paddingLeft: "18px" }}>
                  {activeModule.idealRubricChecklist.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                type="button"
                className="button button-cn-primary"
                onClick={() => {
                  setSkillFilter(activeModule.skill);
                  const firstMatch = COMMUNICATION_PRACTICE_BANK.find(
                    (e) => e.skill === activeModule.skill,
                  );
                  if (firstMatch) selectExercise(firstMatch);
                  setActiveTab("practice");
                }}
              >
                Practice {SKILL_BADGE_MAP[activeModule.skill].label} Drills →
              </button>
              <button
                type="button"
                className="button button-quiet"
                onClick={() => setActiveTab("assessment")}
              >
                Take Full Timed Mock Test →
              </button>
            </div>
          </article>
        </div>
      )}

      {/* =================================================================
          TAB 2: LSRW INTERACTIVE PRACTICE STUDIO
      ================================================================== */}
      {activeTab === "practice" && (
        <div>
          {/* Skill Filter Bar */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
            {(["all", "listening", "speaking", "reading", "writing"] as const).map((sk) => {
              const count =
                sk === "all"
                  ? COMMUNICATION_PRACTICE_BANK.length
                  : COMMUNICATION_PRACTICE_BANK.filter((e) => e.skill === sk).length;
              return (
                <button
                  key={sk}
                  type="button"
                  className={`dsa-sample-pill ${skillFilter === sk ? "active" : ""}`}
                  onClick={() => {
                    setSkillFilter(sk);
                    const nextList =
                      sk === "all"
                        ? COMMUNICATION_PRACTICE_BANK
                        : COMMUNICATION_PRACTICE_BANK.filter((e) => e.skill === sk);
                    if (nextList[0] && !nextList.some((e) => e.id === selectedExerciseId)) {
                      selectExercise(nextList[0]);
                    }
                  }}
                >
                  {sk === "all" ? `All LSRW (${count})` : `${SKILL_BADGE_MAP[sk].icon} ${SKILL_BADGE_MAP[sk].label} (${count})`}
                </button>
              );
            })}
          </div>

          <div className="comm-studio-split">
            {/* Sidebar Exercise Picker */}
            <div className="surface-card" style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {filteredExercises.map((ex) => {
                const badge = SKILL_BADGE_MAP[ex.skill];
                const isSelected = ex.id === activeExercise.id;
                const isDone = passedIds.has(ex.id);
                return (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => selectExercise(ex)}
                    style={{
                      textAlign: "left",
                      padding: "11px 12px",
                      borderRadius: "10px",
                      border: isSelected ? `1.5px solid ${badge.color}` : "1px solid var(--border-subtle)",
                      background: isSelected ? badge.bg : "#1c1c1e",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "10.5px", fontWeight: 800, color: badge.color }}>
                        {badge.icon} {ex.companyTag}
                      </span>
                      {isDone && (
                        <span style={{ fontSize: "10px", fontWeight: 800, color: "#34d399" }}>✓ PASSED</span>
                      )}
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#f5f5f7" }}>
                      {ex.title}
                    </div>
                    <div style={{ fontSize: "11px", color: "#86868b", marginTop: "3px" }}>
                      {ex.difficulty} · ⏱️ {ex.timeLimitSeconds}s target
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Practice Workbench */}
            <div className="surface-card" style={{ padding: "26px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap", marginBottom: "14px" }}>
                <div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                    <span
                      style={{
                        background: SKILL_BADGE_MAP[activeExercise.skill].bg,
                        color: SKILL_BADGE_MAP[activeExercise.skill].color,
                        fontSize: "11px",
                        fontWeight: 800,
                        padding: "3px 10px",
                        borderRadius: "99px",
                      }}
                    >
                      {SKILL_BADGE_MAP[activeExercise.skill].icon} {SKILL_BADGE_MAP[activeExercise.skill].label}
                    </span>
                    <span className="tag-pill">{activeExercise.companyTag}</span>
                    <span className="tag-pill">{activeExercise.difficulty}</span>
                  </div>
                  <h2 style={{ margin: 0, fontSize: "22px", color: "#f5f5f7" }}>{activeExercise.title}</h2>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "16px", fontWeight: 800, color: elapsedSeconds > activeExercise.timeLimitSeconds ? "#f59e0b" : "#34d399" }}>
                    ⏱️ {formatTimer(elapsedSeconds)} / {formatTimer(activeExercise.timeLimitSeconds)}
                  </div>
                  <small style={{ color: "#86868b", fontSize: "11px" }}>Elapsed / Benchmark</small>
                </div>
              </div>

              <div className="callout-box rule-callout" style={{ marginBottom: "18px" }}>
                <b>Instructions</b>
                {activeExercise.instruction}
              </div>

              {/* Listening Audio Player */}
              {activeExercise.audioText && (
                <div style={{ background: "#111113", border: "1px solid var(--border-normal)", borderRadius: "12px", padding: "16px", marginBottom: "18px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "14px", color: "#f5f5f7" }}>
                        🔊 Audio Prompt Player (Offline OS Speech Engine)
                      </div>
                      <small style={{ color: "#86868b" }}>
                        Plays spoken prompt cleanly ({audioPlays} play{audioPlays === 1 ? "" : "s"}). Try repeating or answering before revealing text.
                      </small>
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                      <select
                        value={speechRate}
                        onChange={(e) => setSpeechRate(Number(e.target.value))}
                        className="dsa-select"
                        aria-label="Playback speed"
                      >
                        <option value={0.85}>0.85x Slow</option>
                        <option value={0.95}>0.95x Standard</option>
                        <option value={1.1}>1.1x Brisk</option>
                      </select>
                      <button
                        type="button"
                        className="button button-cn-primary"
                        onClick={() => playAudioPrompt(activeExercise.audioText || "")}
                      >
                        {isSpeakingAudio ? "🔊 Speaking..." : "▶ Play Prompt Audio"}
                      </button>
                      <button
                        type="button"
                        className="button button-quiet"
                        onClick={() => setShowTranscript((v) => !v)}
                      >
                        {showTranscript ? "Hide Script" : "Reveal Script"}
                      </button>
                    </div>
                  </div>
                  {showTranscript && (
                    <div style={{ marginTop: "12px", padding: "10px 12px", background: "#1c1c1e", borderRadius: "8px", fontSize: "13.5px", color: "#e5e5ea" }}>
                      <b>Audio Script:</b> &ldquo;{activeExercise.audioText}&rdquo;
                    </div>
                  )}
                </div>
              )}

              {/* Reading / Read-Aloud / Typing / Passage Reconstruction Display */}
              {activeExercise.passageText && (
                <div style={{ background: "#111113", border: "1px solid var(--border-normal)", borderRadius: "12px", padding: "18px", marginBottom: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 800, color: "#34d399", textTransform: "uppercase" }}>
                      {activeExercise.type === "write_reconstruction"
                        ? isPassageHidden
                          ? "🔒 Passage Hidden — Write Key Facts From Memory"
                          : `⏱️ Memorize Passage (${studyRemaining}s left before auto-hide)`
                        : "📄 Reference Passage / Prompt Text"}
                    </span>
                    {activeExercise.type === "write_reconstruction" && !isPassageHidden && (
                      <button
                        type="button"
                        className="button button-quiet button-small"
                        onClick={() => {
                          setIsPassageHidden(true);
                          setStudyRemaining(0);
                        }}
                      >
                        Hide Passage &amp; Start Writing
                      </button>
                    )}
                    {activeExercise.type === "write_reconstruction" && isPassageHidden && (
                      <button
                        type="button"
                        className="button button-quiet button-small"
                        onClick={() => setIsPassageHidden(false)}
                      >
                        Peek Passage
                      </button>
                    )}
                  </div>
                  <p
                    onCopy={(e) => {
                      if (activeExercise.type === "write_reconstruction" || activeExercise.type === "write_typing") {
                        e.preventDefault();
                      }
                    }}
                    style={{
                      margin: 0,
                      fontSize: "15px",
                      lineHeight: 1.7,
                      color: "#f5f5f7",
                      userSelect:
                        activeExercise.type === "write_reconstruction" || activeExercise.type === "write_typing"
                          ? "none"
                          : "auto",
                      filter:
                        activeExercise.type === "write_reconstruction" && isPassageHidden
                          ? "blur(8px)"
                          : "none",
                      transition: "filter 0.25s ease",
                    }}
                  >
                    {activeExercise.passageText}
                  </p>
                </div>
              )}

              {/* Jumbled Chunks Builder */}
              {activeExercise.jumbledChunks && (
                <div style={{ background: "#111113", border: "1px solid var(--border-normal)", borderRadius: "12px", padding: "16px", marginBottom: "18px" }}>
                  <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#c084fc", marginBottom: "10px" }}>
                    🧩 Scrambled Segments (click chips in natural order or speak/type complete sentence):
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {activeExercise.jumbledChunks.map((chunk) => (
                      <button
                        key={chunk}
                        type="button"
                        className="dsa-sample-pill"
                        onClick={() =>
                          setResponseText((prev) => (prev ? `${prev.trim()} ${chunk}` : chunk))
                        }
                      >
                        + {chunk}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Question Prompt */}
              {activeExercise.promptQuestion && (
                <div style={{ background: "#161617", border: "1px solid var(--border-normal)", borderRadius: "12px", padding: "16px", marginBottom: "18px", fontSize: "15px", color: "#f5f5f7", lineHeight: 1.6 }}>
                  <b style={{ color: "#60a5fa", display: "block", fontSize: "11px", marginBottom: "4px" }}>PROMPT</b>
                  {activeExercise.promptQuestion}
                </div>
              )}

              {/* Input Area: MCQ vs Voice / Text Box */}
              {activeExercise.mcqOptions ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                  {activeExercise.mcqOptions.map((opt, idx) => (
                    <label
                      key={idx}
                      className={`checklist-item ${selectedMcq === idx ? "checked" : ""}`}
                    >
                      <input
                        type="radio"
                        name={`mcq-${activeExercise.id}`}
                        checked={selectedMcq === idx}
                        onChange={() => setSelectedMcq(idx)}
                      />
                      <div>
                        <b>
                          {String.fromCharCode(65 + idx)}. {opt}
                        </b>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div style={{ marginBottom: "18px" }}>
                  {(activeExercise.skill === "listening" || activeExercise.skill === "speaking" || activeExercise.type === "speak_read_aloud") && (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
                      <button
                        type="button"
                        className={`button ${isRecording ? "button-cn-primary" : "button-quiet"}`}
                        style={isRecording ? { background: "#dc2626", borderColor: "#dc2626" } : {}}
                        onClick={() => {
                          setInputMethod("mic");
                          toggleMicCapture((txt, conf) => {
                            setResponseText(txt);
                            if (typeof conf === "number") setSpeechConfidence(conf);
                          });
                        }}
                      >
                        {isRecording ? "⏹ Stop Microphone Recording" : "🎤 Capture Live Speech (Mic)"}
                      </button>
                      <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                        {micNote || "Speak using Live Mic or enter your response directly below for offline rubric verification."}
                      </span>
                    </div>
                  )}

                  <textarea
                    rows={activeExercise.type === "write_email" ? 8 : 4}
                    value={responseText}
                    onChange={(e) => {
                      setResponseText(e.target.value);
                      if (!isRecording) setInputMethod("typed");
                    }}
                    onPaste={(e) => {
                      if (
                        activeExercise.type === "write_reconstruction" ||
                        activeExercise.type === "write_typing"
                      ) {
                        e.preventDefault();
                        setPracticeError("Copy-paste is disabled for typing accuracy & passage reconstruction drills.");
                      }
                    }}
                    placeholder={
                      activeExercise.type === "write_email"
                        ? "Dear ...\n\nWrite your professional email here...\n\nBest regards,\nYour Name"
                        : "Enter or capture your response here..."
                    }
                    style={{
                      width: "100%",
                      background: "#0b0d11",
                      color: "#f5f5f7",
                      border: "1px solid var(--border-normal)",
                      borderRadius: "10px",
                      padding: "14px",
                      fontSize: "14px",
                      lineHeight: 1.6,
                      fontFamily: activeExercise.type === "write_typing" ? "var(--font-mono)" : "inherit",
                    }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#86868b", marginTop: "6px" }}>
                    <span>
                      Words: <b>{responseText.trim() ? responseText.trim().split(/\s+/).length : 0}</b>
                      {activeExercise.minWords ? ` (Target ${activeExercise.minWords}+ words)` : ""}
                    </span>
                    <span>Verification Mode: {inputMethod === "mic" ? "Voice ASR + Rubric" : "Text + Rubric"}</span>
                  </div>
                </div>
              )}

              {practiceError && (
                <div className="dsa-status-banner banner-failed" style={{ marginBottom: "14px" }}>
                  <span>⚠️ {practiceError}</span>
                </div>
              )}

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                <button
                  type="button"
                  className="button button-cn-primary"
                  disabled={evaluating}
                  onClick={handlePracticeSubmit}
                >
                  {evaluating ? "Verifying Response..." : "Verify & Grade Response ✓"}
                </button>
                <button
                  type="button"
                  className="button button-quiet"
                  onClick={() => selectExercise(activeExercise)}
                >
                  ↺ Reset Drill
                </button>
              </div>

              {/* Instant Verification Scorecard */}
              {practiceResult && (
                <div style={{ marginTop: "24px", borderTop: "1px solid var(--border-subtle)", paddingTop: "20px" }}>
                  <div className={`dsa-status-banner ${practiceResult.passed ? "banner-accepted" : "banner-failed"}`}>
                    <span className="banner-icon">{practiceResult.passed ? "✓" : "!"}</span>
                    <div>
                      <div className="banner-status-title">{practiceResult.summaryFeedback}</div>
                      <div className="banner-stats">
                        Versant Scale: <b>{practiceResult.versantScore}/80</b> · Accuracy: <b>{practiceResult.percentScore}%</b> · CEFR:{" "}
                        <b>{practiceResult.cefrLevel}</b>
                        {persistedBanner ? " · Saved to Profile" : !signedIn ? " · Sign in to save progress permanently" : ""}
                      </div>
                    </div>
                  </div>

                  {/* 4 Subscore Telemetry Grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px", marginBottom: "16px" }}>
                    {[
                      { name: "Sentence Mastery", val: practiceResult.dimensions.sentenceMastery },
                      { name: "Vocabulary", val: practiceResult.dimensions.vocabulary },
                      { name: "Fluency", val: practiceResult.dimensions.fluency },
                      { name: "Delivery / Clarity", val: practiceResult.dimensions.delivery },
                    ].map((dim) => (
                      <div key={dim.name} style={{ background: "#111113", border: "1px solid var(--border-subtle)", borderRadius: "10px", padding: "12px" }}>
                        <div style={{ fontSize: "11px", color: "#86868b", marginBottom: "4px" }}>{dim.name}</div>
                        <div style={{ fontSize: "18px", fontWeight: 800, color: "#f5f5f7", marginBottom: "6px" }}>
                          {dim.val} <small style={{ fontSize: "11px", color: "#86868b" }}>/ 80</small>
                        </div>
                        <div className="mini-progress-bar">
                          <span style={{ width: `${Math.round(((dim.val - 20) / 60) * 100)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px", marginBottom: "14px" }}>
                    <div className="callout-box">
                      <b>Diagnostic Signals</b>
                      <div>Word Count: {practiceResult.metrics.wordCount} · Est. Speed: {practiceResult.metrics.estimatedWpm} WPM</div>
                      <div>Token Accuracy: {practiceResult.metrics.accuracyPct}%</div>
                      <div>
                        Fillers Detected:{" "}
                        {practiceResult.metrics.fillerWordsFound.length > 0
                          ? practiceResult.metrics.fillerWordsFound.join(", ")
                          : "None (Clean ✓)"}
                      </div>
                      {practiceResult.metrics.missingKeywords.length > 0 && (
                        <div style={{ color: "#fbbf24", marginTop: "4px" }}>
                          Missing Key Concepts: {practiceResult.metrics.missingKeywords.join(", ")}
                        </div>
                      )}
                    </div>
                    <div className="callout-box tip-callout">
                      <b>Verifier Feedback &amp; Next Tweaks</b>
                      <ul style={{ margin: "6px 0 0", paddingLeft: "18px" }}>
                        {practiceResult.actionableTips.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div style={{ background: "#111113", border: "1px solid var(--border-subtle)", borderRadius: "10px", padding: "14px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 800, color: "#60a5fa", marginBottom: "4px" }}>
                      Model Placement Response &amp; Explanation
                    </div>
                    <p style={{ margin: "0 0 8px", fontSize: "13.5px", color: "#f5f5f7", whiteSpace: "pre-line" }}>
                      {practiceResult.sampleResponse}
                    </p>
                    <small style={{ color: "#94a3b8" }}>{practiceResult.explanation}</small>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================
          TAB 3: TIMED CORPORATE MOCK ASSESSMENT (VERSANT / SVAR)
      ================================================================== */}
      {activeTab === "assessment" && (
        <div className="surface-card" style={{ padding: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
            <div>
              <span className="eyebrow" style={{ color: "#fbbf24" }}>SIMULATED PLACEMENT ASSESSMENT</span>
              <h2 style={{ margin: "6px 0", fontSize: "24px", color: "#f5f5f7" }}>
                {CORPORATE_MOCK_ASSESSMENT.title}
              </h2>
              <p style={{ margin: 0, fontSize: "13.5px", color: "#94a3b8" }}>
                {CORPORATE_MOCK_ASSESSMENT.benchmarkLabel} · 4 Sections · {mockItems.length} Tasks ·{" "}
                {CORPORATE_MOCK_ASSESSMENT.durationMinutes} Minutes
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {mockStarted && !mockResult && (
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "18px", fontWeight: 800, color: mockRemainingSec < 120 ? "#f87171" : "#34d399", padding: "8px 14px", background: "#111", borderRadius: "10px", border: "1px solid var(--border-normal)" }}>
                  ⏱️ {formatTimer(mockRemainingSec)}
                </div>
              )}
              {!mockStarted ? (
                <button
                  type="button"
                  className="button button-cn-primary"
                  onClick={() => {
                    setMockStarted(true);
                    setMockResult(null);
                    setMockRemainingSec(CORPORATE_MOCK_ASSESSMENT.durationMinutes * 60);
                  }}
                >
                  🚀 Start 10-Part Mock Exam
                </button>
              ) : (
                <button
                  type="button"
                  className="button button-quiet"
                  onClick={() => {
                    stopAllAudioAndMic();
                    setMockStarted(true);
                    setMockResult(null);
                    setMockAnswers({});
                    setMockHiddenPassages({});
                    setMockRemainingSec(CORPORATE_MOCK_ASSESSMENT.durationMinutes * 60);
                  }}
                >
                  ↺ Restart Mock
                </button>
              )}
            </div>
          </div>

          {!mockStarted && !mockResult ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "14px" }}>
              {CORPORATE_MOCK_ASSESSMENT.sections.map((sec) => (
                <div key={sec.id} style={{ background: "#111113", border: "1px solid var(--border-subtle)", borderRadius: "12px", padding: "18px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 800, color: SKILL_BADGE_MAP[sec.skill].color, marginBottom: "6px" }}>
                    {SKILL_BADGE_MAP[sec.skill].icon} {sec.title}
                  </div>
                  <p style={{ margin: "0 0 8px", fontSize: "13px", color: "#cbd5e1", lineHeight: 1.5 }}>
                    {sec.benchmarkNote}
                  </p>
                  <span className="tag-pill">{sec.items.length} Graded Tasks</span>
                </div>
              ))}
            </div>
          ) : mockResult ? (
            <div>
              <div className="result-screen" style={{ padding: "16px 0 28px" }}>
                <span className="eyebrow">OFFICIAL PLACEMENT COMMUNICATION REPORT</span>
                <div className={`result-orb ${mockResult.overallVersantScore >= 54 ? "success" : "failure"}`}>
                  {mockResult.overallVersantScore}
                  <small> / 80</small>
                </div>
                <h2 style={{ fontSize: "24px", margin: "0 0 8px" }}>
                  CEFR Level: {mockResult.cefrLevel} · {mockResult.readinessVerdict}
                </h2>
                <p style={{ color: "#94a3b8", margin: 0 }}>
                  Composite Percent: {mockResult.overallPercent}% · Verifier Engine: Heuristic v1 (AI ASR/LLM Ready)
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "12px", marginBottom: "20px" }}>
                {[
                  { label: "Sentence Mastery", score: mockResult.dimensions.sentenceMastery },
                  { label: "Vocabulary", score: mockResult.dimensions.vocabulary },
                  { label: "Fluency & Coherence", score: mockResult.dimensions.fluency },
                  { label: "Delivery & Mechanics", score: mockResult.dimensions.delivery },
                ].map((d) => (
                  <div key={d.label} style={{ background: "#111113", border: "1px solid var(--border-normal)", borderRadius: "12px", padding: "14px" }}>
                    <div style={{ fontSize: "12px", color: "#86868b" }}>{d.label}</div>
                    <div style={{ fontSize: "22px", fontWeight: 800, color: "#f5f5f7", margin: "4px 0 8px" }}>
                      {d.score}/80
                    </div>
                    <div className="mini-progress-bar">
                      <span style={{ width: `${Math.round(((d.score - 20) / 60) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px", marginBottom: "22px" }}>
                <div className="callout-box tip-callout">
                  <b>✓ Verified Strengths</b>
                  <ul style={{ margin: "6px 0 0", paddingLeft: "18px" }}>
                    {mockResult.strengths.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="callout-box warning-callout">
                  <b>🎯 Priority Action Plan</b>
                  <ul style={{ margin: "6px 0 0", paddingLeft: "18px" }}>
                    {mockResult.priorityImprovements.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <h3 style={{ fontSize: "16px", color: "#f5f5f7", marginBottom: "12px" }}>
                Item-by-Item Verification Breakdown
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {mockResult.itemResults.map((ir, idx) => (
                  <div
                    key={ir.exerciseId}
                    className={`dsa-tc-item ${ir.passed ? "tc-passed" : "tc-failed"}`}
                  >
                    <div className="dsa-tc-header">
                      <span>
                        Task {idx + 1} ({ir.skill.toUpperCase()}): {ir.passed ? "Passed ✓" : "Needs Work !"}
                      </span>
                      <span>
                        {ir.versantScore}/80 ({ir.percentScore}%)
                      </span>
                    </div>
                    <div style={{ fontSize: "12.5px", color: "#cbd5e1", marginBottom: "4px" }}>
                      {ir.actionableTips[0] || ir.summaryFeedback}
                    </div>
                    <div style={{ fontSize: "11.5px", color: "#94a3b8" }}>
                      <b>Model Answer:</b> {ir.sampleResponse}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {CORPORATE_MOCK_ASSESSMENT.sections.map((sec) => (
                <section key={sec.id} style={{ background: "#111113", border: "1px solid var(--border-subtle)", borderRadius: "14px", padding: "20px" }}>
                  <div style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: "10px", marginBottom: "16px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 800, color: SKILL_BADGE_MAP[sec.skill].color }}>
                      {SKILL_BADGE_MAP[sec.skill].icon} {sec.title}
                    </span>
                    <div style={{ fontSize: "12.5px", color: "#86868b", marginTop: "2px" }}>
                      {sec.benchmarkNote}
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {sec.items.map((item, idx) => {
                      const val = mockAnswers[item.id] || { text: "" };
                      const isReconHidden = Boolean(mockHiddenPassages[item.id]);
                      return (
                        <div key={item.id} style={{ background: "#161617", border: "1px solid var(--border-normal)", borderRadius: "12px", padding: "16px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
                            <strong style={{ fontSize: "14.5px", color: "#f5f5f7" }}>
                              {idx + 1}. {item.title}
                            </strong>
                            <span className="tag-pill">{item.companyTag}</span>
                          </div>
                          <p style={{ margin: "0 0 10px", fontSize: "13px", color: "#94a3b8" }}>
                            {item.instruction}
                          </p>

                          {item.audioText && (
                            <div style={{ marginBottom: "10px", display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                              <button
                                type="button"
                                className="button button-quiet button-small"
                                onClick={() => playAudioPrompt(item.audioText || "")}
                              >
                                ▶ Play Spoken Audio
                              </button>
                              <span style={{ fontSize: "12px", color: "#86868b" }}>
                                Listen carefully and type/speak your exact response below.
                              </span>
                            </div>
                          )}

                          {item.passageText && (
                            <div style={{ marginBottom: "10px", padding: "12px", background: "#0b0d11", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}>
                              {item.type === "write_reconstruction" && (
                                <div style={{ marginBottom: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <small style={{ color: "#fbbf24" }}>
                                    Read mentally, then click &ldquo;Hide Passage&rdquo; before writing.
                                  </small>
                                  <button
                                    type="button"
                                    className="button button-quiet button-small"
                                    onClick={() =>
                                      setMockHiddenPassages((p) => ({ ...p, [item.id]: !p[item.id] }))
                                    }
                                  >
                                    {isReconHidden ? "Peek Passage" : "Hide Passage"}
                                  </button>
                                </div>
                              )}
                              <div
                                style={{
                                  fontSize: "14px",
                                  color: "#f5f5f7",
                                  lineHeight: 1.6,
                                  userSelect: "none",
                                  filter: isReconHidden ? "blur(7px)" : "none",
                                }}
                              >
                                {item.passageText}
                              </div>
                            </div>
                          )}

                          {item.jumbledChunks && (
                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                              {item.jumbledChunks.map((ch) => (
                                <button
                                  key={ch}
                                  type="button"
                                  className="dsa-sample-pill"
                                  onClick={() =>
                                    setMockAnswers((prev) => ({
                                      ...prev,
                                      [item.id]: {
                                        ...val,
                                        text: val.text ? `${val.text.trim()} ${ch}` : ch,
                                      },
                                    }))
                                  }
                                >
                                  + {ch}
                                </button>
                              ))}
                            </div>
                          )}

                          {item.promptQuestion && (
                            <div style={{ marginBottom: "10px", fontSize: "14px", color: "#e5e5ea", fontWeight: 500 }}>
                              {item.promptQuestion}
                            </div>
                          )}

                          {item.mcqOptions ? (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "8px" }}>
                              {item.mcqOptions.map((opt, optIdx) => (
                                <label
                                  key={optIdx}
                                  className={`checklist-item ${val.mcq === optIdx ? "checked" : ""}`}
                                >
                                  <input
                                    type="radio"
                                    name={`mock-mcq-${item.id}`}
                                    checked={val.mcq === optIdx}
                                    onChange={() =>
                                      setMockAnswers((prev) => ({
                                        ...prev,
                                        [item.id]: { ...val, mcq: optIdx },
                                      }))
                                    }
                                  />
                                  <span>{opt}</span>
                                </label>
                              ))}
                            </div>
                          ) : (
                            <textarea
                              rows={item.type === "write_email" ? 5 : 2}
                              value={val.text}
                              onChange={(e) =>
                                setMockAnswers((prev) => ({
                                  ...prev,
                                  [item.id]: { ...val, text: e.target.value, method: "typed" },
                                }))
                              }
                              onPaste={(e) => {
                                if (
                                  item.type === "write_typing" ||
                                  item.type === "write_reconstruction"
                                ) {
                                  e.preventDefault();
                                }
                              }}
                              placeholder="Enter response..."
                              style={{
                                width: "100%",
                                background: "#0b0d11",
                                color: "#f5f5f7",
                                border: "1px solid var(--border-normal)",
                                borderRadius: "8px",
                                padding: "10px 12px",
                                fontSize: "13.5px",
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}

              {mockError && (
                <div className="dsa-status-banner banner-failed">
                  <span>⚠️ {mockError}</span>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button
                  type="button"
                  className="button button-cn-primary"
                  style={{ padding: "12px 26px", fontSize: "14px" }}
                  disabled={mockSubmitting}
                  onClick={handleMockSubmit}
                >
                  {mockSubmitting ? "Grading All 4 LSRW Skills..." : "Submit Complete Corporate Mock Assessment →"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
