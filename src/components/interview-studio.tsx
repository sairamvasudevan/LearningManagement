"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  HiringRecommendation,
  InterviewBot,
  InterviewFeedback,
  InterviewQuestion,
  InterviewSession,
  InterviewStage,
  UserInterviewCredits,
} from "@/lib/interview-types";
import { INTERVIEW_BOTS, INTERVIEW_QUESTIONS } from "@/lib/interview-bots";

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

interface InterviewStudioProps {
  initialBots?: InterviewBot[];
  initialQuestions?: InterviewQuestion[];
  initialCredits?: UserInterviewCredits | null;
  initialSessions?: InterviewSession[];
  signedIn?: boolean;
}

const STAGES_ORDER: InterviewStage[] = [
  "INTRO",
  "CLARIFICATION",
  "APPROACH",
  "CODING",
  "GRILL",
  "CONCLUDED",
];

export function InterviewStudio({
  initialBots = INTERVIEW_BOTS,
  initialQuestions = INTERVIEW_QUESTIONS,
  initialCredits = null,
  initialSessions = [],
  signedIn = false,
}: InterviewStudioProps) {
  // State
  const [bots] = useState<InterviewBot[]>(initialBots);
  const [questions] = useState<InterviewQuestion[]>(initialQuestions);
  const [selectedBotId, setSelectedBotId] = useState<string>(bots[1]?.id || bots[0]?.id);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(questions[0]?.id);

  const [credits, setCredits] = useState<UserInterviewCredits>(
    initialCredits || {
      userId: "",
      freeSlots: 3,
      purchasedSlots: 0,
      totalInterviews: 0,
      lastRefillDate: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString(),
    },
  );
  const [sessions, setSessions] = useState<InterviewSession[]>(initialSessions);
  const [activeSession, setActiveSession] = useState<InterviewSession | null>(null);

  // Interaction State
  const [candidateInput, setCandidateInput] = useState<string>("");
  const [codeDraft, setCodeDraft] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("python");
  const [isSubmittingTurn, setIsSubmittingTurn] = useState<boolean>(false);
  const [isStartingSession, setIsStartingSession] = useState<boolean>(false);
  const [sessionError, setSessionError] = useState<string>("");

  // Voice State
  const [isBotSpeaking, setIsBotSpeaking] = useState<boolean>(false);
  const [audioMuted, setAudioMuted] = useState<boolean>(false);
  const [isRecordingMic, setIsRecordingMic] = useState<boolean>(false);
  const [micStatusText, setMicStatusText] = useState<string>("");

  // Top Up Modal
  const [showTopUpModal, setShowTopUpModal] = useState<boolean>(false);
  const [topUpLoading, setTopUpLoading] = useState<boolean>(false);
  const [topUpMessage, setTopUpMessage] = useState<string>("");

  // Active Scorecard View
  const [inspectedFeedback, setInspectedFeedback] = useState<InterviewFeedback | null>(null);

  // Refs
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeBot = useMemo(() => {
    return bots.find((b) => b.id === (activeSession?.botId || selectedBotId)) || bots[0];
  }, [bots, activeSession, selectedBotId]);

  const activeQuestion = useMemo(() => {
    return (
      questions.find((q) => q.id === (activeSession?.questionId || selectedQuestionId)) ||
      questions[0]
    );
  }, [questions, activeSession, selectedQuestionId]);

  // Auto-scroll messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages, isSubmittingTurn]);

  // Web Speech Text-to-Speech Helper
  const speakText = useCallback(
    (textToSpeak: string, botPitch = 1.0, botRate = 1.0) => {
      if (typeof window === "undefined" || audioMuted) return;
      if (!("speechSynthesis" in window)) return;

      try {
        window.speechSynthesis.cancel();
        const cleanSpeech = textToSpeak
          .replace(/[#*`_~]/g, "")
          .replace(/\[\d+,\s*\d+\]/g, "indices array")
          .replace(/O\((.*?)\)/g, "O of $1")
          .slice(0, 600);

        const utterance = new SpeechSynthesisUtterance(cleanSpeech);
        utterance.pitch = Math.max(0.7, Math.min(1.4, botPitch));
        utterance.rate = Math.max(0.8, Math.min(1.3, botRate));
        utterance.lang = "en-US";

        utterance.onstart = () => setIsBotSpeaking(true);
        utterance.onend = () => setIsBotSpeaking(false);
        utterance.onerror = () => setIsBotSpeaking(false);

        window.speechSynthesis.speak(utterance);
      } catch {
        setIsBotSpeaking(false);
      }
    },
    [audioMuted],
  );

  // Web Speech Microphone Recognition
  const startMicRecording = useCallback(() => {
    if (typeof window === "undefined") return;
    const speechWin = window as SpeechWindow;
    const SpeechRec = speechWin.SpeechRecognition || speechWin.webkitSpeechRecognition;

    if (!SpeechRec) {
      setMicStatusText("Microphone speech recognition not supported in this browser. Please type below.");
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onresult = (e: SpeechRecognitionEventLike) => {
        let transcript = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          transcript += e.results[i][0].transcript;
        }
        setCandidateInput((prev) => {
          const base = prev.trim();
          return base ? `${base} ${transcript}` : transcript;
        });
      };

      rec.onerror = () => {
        setIsRecordingMic(false);
        setMicStatusText("Mic input paused or permission denied.");
      };

      rec.onend = () => {
        setIsRecordingMic(false);
        setMicStatusText("Speech captured. You can edit or click send.");
      };

      recognitionRef.current = rec;
      rec.start();
      setIsRecordingMic(true);
      setMicStatusText("Listening... Speak your reasoning aloud.");
    } catch {
      setIsRecordingMic(false);
      setMicStatusText("Could not access microphone.");
    }
  }, []);

  const stopMicRecording = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsRecordingMic(false);
  }, []);

  // Start new mock interview session
  async function handleStartSession() {
    setIsStartingSession(true);
    setSessionError("");

    try {
      const res = await fetch("/api/interview/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          botId: selectedBotId,
          questionId: selectedQuestionId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 402) {
          setShowTopUpModal(true);
        }
        throw new Error(data.error || "Failed to start interview session.");
      }

      setActiveSession(data.session);
      setCodeDraft(data.session.code || "");
      setSelectedLanguage(data.session.language || "python");
      setCredits(data.credits);
      setSessions((prev) => [data.session, ...prev]);

      // Speak initial bot message
      const firstMsg = data.session.messages[0];
      if (firstMsg && !audioMuted) {
        speakText(firstMsg.audioScript || firstMsg.text, activeBot.speechPitch, activeBot.speechRate);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to start session.";
      setSessionError(msg);
    } finally {
      setIsStartingSession(false);
    }
  }

  // Submit turn (answer or code or wrap-up)
  async function handleSubmitTurn(concludeNow = false) {
    if (!activeSession || isSubmittingTurn) return;
    if (!concludeNow && !candidateInput.trim() && codeDraft === activeSession.code) return;

    setIsSubmittingTurn(true);
    setSessionError("");

    // Stop mic if recording
    stopMicRecording();

    try {
      const res = await fetch("/api/interview/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: activeSession.id,
          candidateText: candidateInput,
          code: codeDraft,
          language: selectedLanguage,
          concludeNow,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to evaluate candidate response.");
      }

      setActiveSession(data.session);
      setCandidateInput("");

      if (data.botMessage && !audioMuted) {
        speakText(data.botMessage.audioScript || data.botMessage.text, activeBot.speechPitch, activeBot.speechRate);
      }

      // Update sessions list
      setSessions((prev) =>
        prev.map((s) => (s.id === data.session.id ? data.session : s)),
      );

      if (data.concluded && data.session.feedback) {
        setInspectedFeedback(data.session.feedback);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit response.";
      setSessionError(msg);
    } finally {
      setIsSubmittingTurn(false);
    }
  }

  // Claim Daily Free Slot
  async function handleClaimDailySlot() {
    setTopUpLoading(true);
    setTopUpMessage("");
    try {
      const res = await fetch("/api/interview/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "claim_daily" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to claim free slot.");
      setCredits(data.credits);
      setTopUpMessage(data.message || "Daily slots updated!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not claim daily slot.";
      setTopUpMessage(msg);
    } finally {
      setTopUpLoading(false);
    }
  }

  // Top Up Passes
  async function handleTopUpPasses(count = 5) {
    setTopUpLoading(true);
    setTopUpMessage("");
    try {
      const res = await fetch("/api/interview/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "top_up", count }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to top up passes.");
      setCredits(data.credits);
      setTopUpMessage(data.message || `Added ${count} passes!`);
      setTimeout(() => setShowTopUpModal(false), 1400);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not top up passes.";
      setTopUpMessage(msg);
    } finally {
      setTopUpLoading(false);
    }
  }

  // Helper for recommendation badge color
  function getRecommendationBadge(rec: HiringRecommendation) {
    switch (rec) {
      case "Strong Hire":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
      case "Hire":
        return "bg-teal-500/20 text-teal-300 border-teal-500/40";
      case "Lean Hire":
        return "bg-sky-500/20 text-sky-300 border-sky-500/40";
      case "Lean No Hire":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "No Hire":
        return "bg-rose-500/20 text-rose-400 border-rose-500/40";
      default:
        return "bg-slate-700 text-slate-300 border-slate-600";
    }
  }

  // Total available slots
  const totalSlotsAvailable = credits.freeSlots + credits.purchasedSlots;

  return (
    <div className="interview-page-shell">
      {/* Cockpit Subnav Bar */}
      <div className="interview-cockpit-bar">
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <Link
            href="/portal"
            style={{
              color: "var(--text-secondary)",
              fontSize: "12px",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: 600,
            }}
          >
            <span>&larr;</span> Back to Portal
          </Link>
          <span style={{ color: "var(--border-normal)" }}>|</span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "18px" }}>🤖</span>
            <span
              style={{
                fontWeight: 900,
                fontSize: "15px",
                color: "#ffffff",
                letterSpacing: "-0.01em",
              }}
            >
              AI Mock Interview Arena
            </span>
            <span
              style={{
                background: "rgba(52, 199, 89, 0.14)",
                color: "#34c759",
                border: "1px solid rgba(52, 199, 89, 0.35)",
                fontSize: "11px",
                fontWeight: 800,
                padding: "2px 8px",
                borderRadius: "6px",
                letterSpacing: "0.02em",
              }}
            >
              NIR 800–2400 · Nexus Interview Rating (ELO)
            </span>
            {signedIn && (
              <span
                style={{
                  background: "rgba(255, 255, 255, 0.06)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border-normal)",
                  fontSize: "10px",
                  fontWeight: 600,
                  padding: "2px 7px",
                  borderRadius: "6px",
                }}
              >
                Student Verified
              </span>
            )}
          </div>
        </div>

        {/* Right Header Status: Passes & Audio */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => {
              setAudioMuted((prev) => !prev);
              if (!audioMuted && typeof window !== "undefined") {
                window.speechSynthesis?.cancel();
                setIsBotSpeaking(false);
              }
            }}
            style={{
              padding: "5px 11px",
              fontSize: "12px",
              borderRadius: "8px",
              border: `1px solid ${audioMuted ? "var(--border-normal)" : "rgba(41, 151, 255, 0.4)"}`,
              background: audioMuted ? "rgba(255, 255, 255, 0.05)" : "rgba(41, 151, 255, 0.14)",
              color: audioMuted ? "var(--text-secondary)" : "#2997ff",
              fontWeight: 700,
              cursor: "pointer",
            }}
            title={audioMuted ? "Audio Muted. Click to Unmute" : "Voice Active. Click to Mute"}
          >
            <span>{audioMuted ? "🔇 Voice Muted" : "🔊 Voice ON"}</span>
          </button>

          {/* Interview Passes Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid var(--border-normal)",
              borderRadius: "8px",
              padding: "5px 12px",
              fontSize: "12px",
            }}
          >
            <span style={{ color: "var(--text-secondary)" }}>
              Passes:{" "}
              <strong style={{ color: totalSlotsAvailable > 0 ? "#34c759" : "#ff453a" }}>
                {totalSlotsAvailable}
              </strong>
            </span>
            <button
              type="button"
              onClick={() => setShowTopUpModal(true)}
              style={{
                background: "none",
                border: "none",
                color: "#2997ff",
                fontWeight: 700,
                fontSize: "12px",
                cursor: "pointer",
                padding: 0,
                textDecoration: "underline",
              }}
            >
              + Recharge
            </button>
          </div>

          {activeSession && activeSession.status === "active" && (
            <button
              type="button"
              onClick={() => handleSubmitTurn(true)}
              disabled={isSubmittingTurn}
              style={{
                padding: "6px 14px",
                fontSize: "12px",
                fontWeight: 700,
                borderRadius: "8px",
                background: "#ff453a",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
              }}
            >
              End & Score
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace */}
      <div className="interview-container">
        {/* Error message alert */}
        {sessionError && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px 16px",
              borderRadius: "12px",
              background: "rgba(255, 69, 58, 0.12)",
              border: "1px solid rgba(255, 69, 58, 0.35)",
              color: "#ff453a",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>{sessionError}</span>
            <button
              type="button"
              onClick={() => setSessionError("")}
              style={{
                background: "none",
                border: "none",
                color: "#ff453a",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "12px",
              }}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* VIEW 1: LOBBY (When no active interview session is selected) */}
        {!activeSession && (
          <div className="space-y-8 animate-fadeIn">
            {/* Hero Card */}
            <div className="interview-hero-banner">
              <span className="interview-hero-badge">
                🤖 AI MOCK INTERVIEW ARENA · NIR BENCHMARK
              </span>
              <h1 className="interview-hero-title">
                Master Technical Coding Interviews Against NIR Difficulty Bots
              </h1>
              <p className="interview-hero-desc">
                From supportive NIR 800 (ELO 800) Interns to relentless NIR 2400 (ELO 2400) FAANG Bar Raisers: practice real technical
                dialogue, defend your time and space invariants, and receive an authoritative 5-dimension hiring scorecard.
                <strong> Nexus Interview Rating (NIR)</strong> is our structured 800–2400 candidate difficulty rating system calibrated like chess ELO.
              </p>

              {/* Simulation Mode notice */}
              <div
                style={{
                  marginTop: "16px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: "rgba(255, 159, 10, 0.12)",
                  border: "1px solid rgba(255, 159, 10, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "12px",
                  color: "#ff9f0a",
                  lineHeight: 1.5,
                }}
              >
                <span style={{ fontSize: "16px" }}>ℹ️</span>
                <span>
                  <strong>Preview Notice:</strong> We do not currently have a live external AI LLM model connected on this deployment.
                  You can test the initial conversation greeting, constraint validation, and code evaluator. To continue an extended multi-turn deep live conversation with AI models, please add interview credits to your account!
                </span>
              </div>

              {/* Feature Pills */}
              <div className="interview-feature-grid">
                <div className="interview-feature-pill">
                  <span style={{ color: "#34c759", fontWeight: 800 }}>✓</span>
                  <span>5 NIR Rating Tiers (800 to 2400 · ELO)</span>
                </div>
                <div className="interview-feature-pill">
                  <span style={{ color: "#34c759", fontWeight: 800 }}>✓</span>
                  <span>Real-Time Speech TTS & Mic</span>
                </div>
                <div className="interview-feature-pill">
                  <span style={{ color: "#34c759", fontWeight: 800 }}>✓</span>
                  <span>Invariant & Edge Case Grilling</span>
                </div>
                <div className="interview-feature-pill">
                  <span style={{ color: "#34c759", fontWeight: 800 }}>✓</span>
                  <span>FAANG 5-Dimension Scorecard</span>
                </div>
                <div className="interview-feature-pill">
                  <span style={{ color: "#34c759", fontWeight: 800 }}>✓</span>
                  <span>3 Daily Free Practice Passes</span>
                </div>
              </div>
            </div>

            {/* Step 1: Select Your Interviewer Bot (NIR Rating Scale) */}
            <div>
              <div className="interview-section-header">
                <h2 className="interview-section-title">
                  <span>1. Choose Interviewer Difficulty (NIR · Nexus Interview Rating)</span>
                </h2>
                <p className="interview-section-subtitle">
                  <strong>Nexus Interview Rating (NIR)</strong> difficulty tiers (calibrated like ELO). Higher NIR bots ruthlessly probe suboptimal complexities, edge cases, and invariant proofs.
                </p>
              </div>

              <div className="interview-grid-5">
                {bots.map((bot) => {
                  const isSelected = selectedBotId === bot.id;
                  const getAvatarGradient = (bId: string) => {
                    switch (bId) {
                      case "bot-elo-800":
                        return "linear-gradient(135deg, #10b981, #0d9488)";
                      case "bot-elo-1200":
                        return "linear-gradient(135deg, #3b82f6, #4f46e5)";
                      case "bot-elo-1600":
                        return "linear-gradient(135deg, #f59e0b, #ea580c)";
                      case "bot-elo-2000":
                        return "linear-gradient(135deg, #8b5cf6, #c026d3)";
                      default:
                        return "linear-gradient(135deg, #e11d48, #9f1239)";
                    }
                  };

                  return (
                    <button
                      key={bot.id}
                      type="button"
                      onClick={() => setSelectedBotId(bot.id)}
                      className={`interview-card ${isSelected ? "selected" : ""}`}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                          <span
                            className="interview-nir-badge"
                            style={{
                              background:
                                bot.elo >= 2400
                                  ? "rgba(255, 69, 58, 0.16)"
                                  : bot.elo >= 2000
                                  ? "rgba(191, 90, 242, 0.16)"
                                  : bot.elo >= 1600
                                  ? "rgba(255, 159, 10, 0.16)"
                                  : bot.elo >= 1200
                                  ? "rgba(41, 151, 255, 0.16)"
                                  : "rgba(52, 199, 89, 0.16)",
                              color:
                                bot.elo >= 2400
                                  ? "#ff453a"
                                  : bot.elo >= 2000
                                  ? "#bf5af2"
                                  : bot.elo >= 1600
                                  ? "#ff9f0a"
                                  : bot.elo >= 1200
                                  ? "#2997ff"
                                  : "#34c759",
                              border: `1px solid ${
                                bot.elo >= 2400
                                  ? "rgba(255, 69, 58, 0.35)"
                                  : bot.elo >= 2000
                                  ? "rgba(191, 90, 242, 0.35)"
                                  : bot.elo >= 1600
                                  ? "rgba(255, 159, 10, 0.35)"
                                  : bot.elo >= 1200
                                  ? "rgba(41, 151, 255, 0.35)"
                                  : "rgba(52, 199, 89, 0.35)"
                              }`,
                            }}
                          >
                            {`NIR ${bot.elo} (ELO ${bot.elo})`}
                          </span>
                          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)" }}>
                            {bot.tier}
                          </span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                          <div
                            className="interview-bot-orb"
                            style={{ background: getAvatarGradient(bot.id) }}
                          >
                            {bot.name[0]}
                          </div>
                          <div>
                            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#ffffff" }}>
                              {bot.name}
                            </h3>
                            <div style={{ fontSize: "11px", color: "#34c759", fontWeight: 600 }}>
                              {bot.companyStyle}
                            </div>
                          </div>
                        </div>

                        <p style={{ margin: "8px 0 0", fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                          {bot.tagline}
                        </p>
                      </div>

                      <div
                        style={{
                          marginTop: "16px",
                          paddingTop: "10px",
                          borderTop: "1px solid var(--border-subtle)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          fontSize: "11px",
                          color: "var(--text-tertiary)",
                        }}
                      >
                        <span>Style: {bot.personality}</span>
                        <span
                          style={{
                            fontWeight: 700,
                            color: isSelected ? "#34c759" : "var(--text-tertiary)",
                          }}
                        >
                          {isSelected ? "● Selected" : "Select"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Technical Problem */}
            <div style={{ marginTop: "32px" }}>
              <div className="interview-section-header">
                <h2 className="interview-section-title">2. Select Problem Topic</h2>
                <p className="interview-section-subtitle">
                  Pick a target algorithm problem for your live technical interview grilling session.
                </p>
              </div>

              <div className="interview-grid-3">
                {questions.map((q) => {
                  const isSelected = selectedQuestionId === q.id;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setSelectedQuestionId(q.id)}
                      className={`interview-card interview-card-teal ${isSelected ? "selected" : ""}`}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ fontSize: "11px", fontWeight: 800, color: "#2997ff", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                          {q.topic}
                        </span>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "6px",
                            background:
                              q.difficulty === "Easy"
                                ? "rgba(52, 199, 89, 0.16)"
                                : q.difficulty === "Medium"
                                ? "rgba(255, 159, 10, 0.16)"
                                : "rgba(255, 69, 58, 0.16)",
                            color:
                              q.difficulty === "Easy"
                                ? "#34c759"
                                : q.difficulty === "Medium"
                                ? "#ff9f0a"
                                : "#ff453a",
                            border: `1px solid ${
                              q.difficulty === "Easy"
                                ? "rgba(52, 199, 89, 0.35)"
                                : q.difficulty === "Medium"
                                ? "rgba(255, 159, 10, 0.35)"
                                : "rgba(255, 69, 58, 0.35)"
                            }`,
                          }}
                        >
                          {q.difficulty}
                        </span>
                      </div>
                      <h3 style={{ margin: "0 0 6px", fontSize: "15px", fontWeight: 800, color: "#ffffff" }}>
                        {q.title}
                      </h3>
                      <p
                        style={{
                          margin: "0 0 14px",
                          fontSize: "12px",
                          color: "var(--text-secondary)",
                          lineHeight: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {q.prompt}
                      </p>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "var(--text-tertiary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          borderTop: "1px solid var(--border-subtle)",
                          paddingTop: "10px",
                        }}
                      >
                        <span>Target: {q.expectedOptimalTime}</span>
                        <span style={{ fontWeight: 700, color: isSelected ? "#2997ff" : "var(--text-tertiary)" }}>
                          {isSelected ? "● Selected" : "Select"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Start Button Bar */}
            <div className="interview-cta-bar">
              <div style={{ fontSize: "14px" }}>
                <span style={{ color: "var(--text-secondary)" }}>Ready to interview with </span>
                <strong style={{ color: "#ffffff" }}>{activeBot.name}</strong>
                <span style={{ color: "var(--text-secondary)" }}> (NIR {activeBot.elo} · ELO {activeBot.elo}) on </span>
                <strong style={{ color: "#2997ff" }}>{activeQuestion.title}</strong>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button
                  type="button"
                  onClick={handleStartSession}
                  disabled={isStartingSession || totalSlotsAvailable <= 0}
                  style={{
                    padding: "10px 22px",
                    borderRadius: "12px",
                    fontWeight: 800,
                    fontSize: "13.5px",
                    transition: "all 0.2s",
                    cursor: totalSlotsAvailable > 0 && !isStartingSession ? "pointer" : "not-allowed",
                    border: "none",
                    background:
                      totalSlotsAvailable > 0
                        ? "linear-gradient(135deg, #34c759, #10b981)"
                        : "var(--bg-pill)",
                    color: totalSlotsAvailable > 0 ? "#000000" : "var(--text-tertiary)",
                    boxShadow: totalSlotsAvailable > 0 ? "0 8px 20px rgba(52, 199, 89, 0.3)" : "none",
                  }}
                >
                  {isStartingSession
                    ? "Initializing Interview..."
                    : totalSlotsAvailable > 0
                    ? "Start Mock Interview (1 Pass)"
                    : "No Passes Left (Recharge)"}
                </button>
              </div>
            </div>

            {/* Past Interview History */}
            {sessions.length > 0 && (
              <div style={{ marginTop: "36px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#ffffff", marginBottom: "12px" }}>
                  Your Past Mock Interviews
                </h3>
                <div style={{ overflowX: "auto", borderRadius: "14px", border: "1px solid var(--border-normal)" }}>
                  <table style={{ width: "100%", textAlign: "left", fontSize: "12px", borderCollapse: "collapse" }}>
                    <thead style={{ background: "rgba(255, 255, 255, 0.03)", borderBottom: "1px solid var(--border-normal)", color: "var(--text-secondary)" }}>
                      <tr>
                        <th style={{ padding: "12px 16px" }}>Date</th>
                        <th style={{ padding: "12px 16px" }}>Interviewer</th>
                        <th style={{ padding: "12px 16px" }}>Problem</th>
                        <th style={{ padding: "12px 16px" }}>Status</th>
                        <th style={{ padding: "12px 16px" }}>Score</th>
                        <th style={{ padding: "12px 16px" }}>Recommendation</th>
                        <th style={{ padding: "12px 16px", textAlign: "right" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody style={{ background: "var(--bg-card)" }}>
                      {sessions.map((s) => {
                        const bot = bots.find((b) => b.id === s.botId) || bots[0];
                        const q = questions.find((item) => item.id === s.questionId) || questions[0];
                        return (
                          <tr key={s.id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                            <td style={{ padding: "12px 16px", color: "var(--text-secondary)" }}>{s.createdAt.slice(0, 10)}</td>
                            <td style={{ padding: "12px 16px", fontWeight: 700, color: "#ffffff" }}>
                              {bot.name} <span style={{ color: "var(--text-tertiary)", fontSize: "11px" }}>(NIR {s.botElo} · ELO {s.botElo})</span>
                            </td>
                            <td style={{ padding: "12px 16px", color: "var(--text-primary)" }}>{q.title}</td>
                            <td style={{ padding: "12px 16px" }}>
                              <span
                                style={{
                                  padding: "2px 8px",
                                  borderRadius: "6px",
                                  fontSize: "10px",
                                  fontWeight: 700,
                                  background: s.status === "concluded" ? "rgba(255, 255, 255, 0.06)" : "rgba(52, 199, 89, 0.16)",
                                  color: s.status === "concluded" ? "var(--text-secondary)" : "#34c759",
                                  border: `1px solid ${s.status === "concluded" ? "var(--border-subtle)" : "rgba(52, 199, 89, 0.35)"}`,
                                }}
                              >
                                {s.status.toUpperCase()}
                              </span>
                            </td>
                            <td style={{ padding: "12px 16px", fontWeight: 800, color: "#34c759" }}>
                              {s.feedback ? `${s.feedback.overallScore}/100` : "—"}
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              {s.feedback ? (
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getRecommendationBadge(
                                    s.feedback.recommendation,
                                  )}`}
                                >
                                  {s.feedback.recommendation}
                                </span>
                              ) : (
                                "In Progress"
                              )}
                            </td>
                            <td style={{ padding: "12px 16px", textAlign: "right" }}>
                              {s.feedback ? (
                                <button
                                  type="button"
                                  onClick={() => setInspectedFeedback(s.feedback)}
                                  style={{ background: "none", border: "none", color: "#2997ff", fontWeight: 700, cursor: "pointer", fontSize: "12px" }}
                                >
                                  View Scorecard
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveSession(s);
                                    setCodeDraft(s.code || "");
                                    setSelectedLanguage(s.language || "python");
                                  }}
                                  style={{ background: "none", border: "none", color: "#34c759", fontWeight: 700, cursor: "pointer", fontSize: "12px" }}
                                >
                                  Resume
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: ACTIVE INTERVIEW STUDIO (Split Screen Cockpit) */}
        {activeSession && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }} className="animate-fadeIn">
            {/* Top Cockpit Header */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-normal)",
                borderRadius: "16px",
                padding: "14px 18px",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              {/* Bot Info */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  className="interview-bot-orb"
                  style={{
                    background:
                      activeBot.id === "bot-elo-800"
                        ? "linear-gradient(135deg, #10b981, #0d9488)"
                        : activeBot.id === "bot-elo-1200"
                        ? "linear-gradient(135deg, #3b82f6, #4f46e5)"
                        : activeBot.id === "bot-elo-1600"
                        ? "linear-gradient(135deg, #f59e0b, #ea580c)"
                        : activeBot.id === "bot-elo-2000"
                        ? "linear-gradient(135deg, #8b5cf6, #c026d3)"
                        : "linear-gradient(135deg, #e11d48, #9f1239)",
                    position: "relative",
                  }}
                >
                  {activeBot.name[0]}
                  {isBotSpeaking && (
                    <span
                      style={{
                        position: "absolute",
                        top: -2,
                        right: -2,
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background: "#34c759",
                        boxShadow: "0 0 10px #34c759",
                      }}
                    />
                  )}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontWeight: 800, color: "#ffffff", fontSize: "15px" }}>{activeBot.name}</span>
                    <span
                      className="interview-nir-badge"
                      style={{ background: "rgba(255, 255, 255, 0.08)", color: "#f5f5f7", border: "1px solid var(--border-normal)" }}
                    >
                      NIR {activeBot.elo} (ELO {activeBot.elo})
                    </span>
                    <span style={{ fontSize: "12px", color: "#34c759", fontWeight: 600 }}>{activeBot.title}</span>
                  </div>
                  <p style={{ margin: "2px 0 0", fontSize: "11px", color: "var(--text-secondary)" }}>{activeBot.tagline}</p>
                </div>
              </div>

              {/* Stage Tracker */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", flexWrap: "wrap" }}>
                {STAGES_ORDER.map((stg, idx) => {
                  const isActive = activeSession.stage === stg;
                  const isPast =
                    STAGES_ORDER.indexOf(activeSession.stage) > idx || activeSession.stage === "CONCLUDED";
                  return (
                    <div key={stg} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span
                        style={{
                          padding: "3px 9px",
                          borderRadius: "6px",
                          fontWeight: 700,
                          background: isActive
                            ? "#34c759"
                            : isPast
                            ? "rgba(255, 255, 255, 0.08)"
                            : "rgba(255, 255, 255, 0.02)",
                          color: isActive ? "#000000" : isPast ? "var(--text-primary)" : "var(--text-tertiary)",
                          border: `1px solid ${isActive ? "#34c759" : "var(--border-subtle)"}`,
                        }}
                      >
                        {stg}
                      </span>
                      {idx < STAGES_ORDER.length - 1 && <span style={{ color: "var(--border-normal)" }}>&rarr;</span>}
                    </div>
                  );
                })}
              </div>

              {/* Cockpit Actions */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => {
                    if (activeSession.feedback) {
                      setInspectedFeedback(activeSession.feedback);
                    } else {
                      handleSubmitTurn(true);
                    }
                  }}
                  disabled={isSubmittingTurn}
                  style={{
                    padding: "7px 14px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 700,
                    background: "#34c759",
                    color: "#000000",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {activeSession.status === "concluded" ? "View Scorecard" : "Conclude & Score"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSession(null)}
                  style={{
                    padding: "7px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                    background: "rgba(255, 255, 255, 0.06)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border-normal)",
                    cursor: "pointer",
                  }}
                >
                  Exit Lobby
                </button>
              </div>
            </div>

            {/* Split Screen Container */}
            <div className="interview-split-screen">
              {/* LEFT PANE: Conversational Chat & Voice (7 columns) */}
              <div className="interview-pane">
                {/* Notice banner about model paused & adding credits */}
                <div
                  style={{
                    padding: "10px 16px",
                    background: "rgba(255, 159, 10, 0.1)",
                    borderBottom: "1px solid rgba(255, 159, 10, 0.25)",
                    fontSize: "11.5px",
                    color: "#ff9f0a",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>ℹ️</span>
                  <span>
                    <strong>Model Status:</strong> External AI model is not connected on this preview deployment. Test your initial greeting or problem constraints. To chat continuously, add credits via <strong>+ Recharge</strong>!
                  </span>
                </div>

                {/* Audio Waveform Banner when Bot Speaks */}
                {isBotSpeaking && (
                  <div
                    style={{
                      background: "rgba(52, 199, 89, 0.12)",
                      borderBottom: "1px solid rgba(52, 199, 89, 0.3)",
                      padding: "8px 16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: "12px",
                      color: "#34c759",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "16px" }}>🎙️</span>
                      <span style={{ fontWeight: 700 }}>{activeBot.name} is speaking...</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ width: "6px", height: "12px", background: "#34c759", borderRadius: "99px" }} />
                      <span style={{ width: "6px", height: "18px", background: "#34c759", borderRadius: "99px" }} />
                      <span style={{ width: "6px", height: "10px", background: "#34c759", borderRadius: "99px" }} />
                    </div>
                  </div>
                )}

                {/* Messages Transcript Scroll Area */}
                <div className="interview-chat-scroll">
                  {activeSession.messages.map((msg) => {
                    const isBot = msg.sender === "bot";
                    return (
                      <div
                        key={msg.id}
                        className={`interview-msg ${isBot ? "bot" : "user"}`}
                      >
                        {isBot && (
                          <div
                            className="interview-bot-orb"
                            style={{
                              width: "34px",
                              height: "34px",
                              fontSize: "13px",
                              background:
                                activeBot.id === "bot-elo-800"
                                  ? "linear-gradient(135deg, #10b981, #0d9488)"
                                  : activeBot.id === "bot-elo-1200"
                                  ? "linear-gradient(135deg, #3b82f6, #4f46e5)"
                                  : activeBot.id === "bot-elo-1600"
                                  ? "linear-gradient(135deg, #f59e0b, #ea580c)"
                                  : activeBot.id === "bot-elo-2000"
                                  ? "linear-gradient(135deg, #8b5cf6, #c026d3)"
                                  : "linear-gradient(135deg, #e11d48, #9f1239)",
                            }}
                          >
                            {activeBot.name[0]}
                          </div>
                        )}

                        <div className={isBot ? "interview-bubble-bot" : "interview-bubble-user"}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "8px",
                              fontSize: "10.5px",
                              opacity: 0.8,
                              marginBottom: "4px",
                            }}
                          >
                            <span style={{ fontWeight: 700 }}>
                              {isBot ? `${activeBot.name} (${msg.stage})` : "You (Candidate)"}
                            </span>
                            <span>{msg.timestamp ? msg.timestamp.slice(11, 16) : ""}</span>
                          </div>

                          <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{msg.text}</div>

                          {/* Code Snippet attachment if candidate submitted code */}
                          {msg.codeSnippet && (
                            <div
                              style={{
                                marginTop: "8px",
                                padding: "8px 12px",
                                borderRadius: "8px",
                                background: "#000000",
                                color: "#34c759",
                                fontFamily: "monospace",
                                fontSize: "11px",
                                overflowX: "auto",
                                maxHeight: "140px",
                                border: "1px solid var(--border-normal)",
                              }}
                            >
                              <pre style={{ margin: 0 }}>{msg.codeSnippet}</pre>
                            </div>
                          )}

                          {isBot && msg.audioScript && (
                            <button
                              type="button"
                              onClick={() =>
                                speakText(msg.audioScript || msg.text, activeBot.speechPitch, activeBot.speechRate)
                              }
                              style={{
                                background: "none",
                                border: "none",
                                color: "#34c759",
                                fontSize: "11px",
                                fontWeight: 700,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                paddingTop: "6px",
                                paddingLeft: 0,
                              }}
                            >
                              <span>🔊 Replay Voice</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Bottom Input & Voice Cockpit */}
                <div className="interview-bottom-input-bar">
                  {micStatusText && (
                    <div style={{ fontSize: "11px", color: "#2997ff", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>🎙️ {micStatusText}</span>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "8px", alignItems: "center", width: "100%" }}>
                    {/* Microphone Toggle Button */}
                    <button
                      type="button"
                      onClick={isRecordingMic ? stopMicRecording : startMicRecording}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "10px",
                        fontSize: "12px",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        border: "1px solid var(--border-normal)",
                        background: isRecordingMic ? "#ff453a" : "rgba(255, 255, 255, 0.06)",
                        color: "#ffffff",
                        cursor: "pointer",
                      }}
                      title={isRecordingMic ? "Click to stop mic recording" : "Click to speak aloud with mic"}
                    >
                      <span>{isRecordingMic ? "⏹️ Stop" : "🎙️ Speak"}</span>
                    </button>

                    {/* Text Input Field */}
                    <textarea
                      rows={2}
                      value={candidateInput}
                      onChange={(e) => setCandidateInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmitTurn(false);
                        }
                      }}
                      placeholder="Say hello, good evening, ask clarifying questions, or explain your approach..."
                      disabled={isSubmittingTurn || activeSession.status === "concluded"}
                      style={{
                        flex: 1,
                        background: "#000000",
                        border: "1px solid var(--border-normal)",
                        borderRadius: "10px",
                        padding: "10px 12px",
                        fontSize: "13px",
                        color: "var(--text-primary)",
                        outline: "none",
                        resize: "none",
                        fontFamily: "var(--font-sans)",
                      }}
                    />

                    {/* Send Button */}
                    <button
                      type="button"
                      onClick={() => handleSubmitTurn(false)}
                      disabled={
                        isSubmittingTurn ||
                        (!candidateInput.trim() && codeDraft === activeSession.code) ||
                        activeSession.status === "concluded"
                      }
                      style={{
                        padding: "10px 18px",
                        borderRadius: "10px",
                        fontWeight: 800,
                        fontSize: "12.5px",
                        background: "#34c759",
                        color: "#000000",
                        border: "none",
                        cursor: "pointer",
                        height: "100%",
                      }}
                    >
                      {isSubmittingTurn ? "Evaluating..." : "Send"}
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT PANE: Problem Description & Code Editor (5 columns) */}
              <div className="interview-pane">
                {/* Right Tabs Header */}
                <div
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid var(--border-normal)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "rgba(255, 255, 255, 0.02)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <h3 style={{ margin: 0, fontWeight: 800, fontSize: "14px", color: "#ffffff" }}>
                      {activeQuestion.title}
                    </h3>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "2px 7px",
                        borderRadius: "4px",
                        background: "rgba(41, 151, 255, 0.16)",
                        color: "#2997ff",
                        border: "1px solid rgba(41, 151, 255, 0.35)",
                      }}
                    >
                      {activeQuestion.difficulty}
                    </span>
                  </div>

                  <div>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      style={{
                        background: "#000000",
                        border: "1px solid var(--border-normal)",
                        color: "var(--text-primary)",
                        borderRadius: "6px",
                        padding: "4px 8px",
                        fontSize: "12px",
                        outline: "none",
                      }}
                    >
                      <option value="python">Python 3</option>
                      <option value="javascript">JavaScript</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                    </select>
                  </div>
                </div>

                {/* Problem Specs Accordion */}
                <div
                  style={{
                    padding: "14px 16px",
                    borderBottom: "1px solid var(--border-subtle)",
                    fontSize: "12px",
                    maxHeight: "180px",
                    overflowY: "auto",
                    background: "rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <p style={{ margin: "0 0 10px", color: "var(--text-secondary)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                    {activeQuestion.prompt}
                  </p>
                  <div style={{ marginTop: "6px" }}>
                    <strong style={{ color: "var(--text-primary)", fontSize: "11px" }}>Constraints:</strong>
                    <ul style={{ margin: "4px 0 0", paddingLeft: "18px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                      {activeQuestion.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Code Scratchpad */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "14px", background: "#05070c", fontFamily: "monospace", fontSize: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "8px", fontSize: "11px", color: "var(--text-tertiary)" }}>
                    <span>Solution Editor ({selectedLanguage})</span>
                    <span>Target: {activeQuestion.expectedOptimalTime}</span>
                  </div>

                  <textarea
                    value={codeDraft}
                    onChange={(e) => setCodeDraft(e.target.value)}
                    placeholder="// Write your code solution here and submit to interviewer..."
                    style={{
                      flex: 1,
                      width: "100%",
                      background: "rgba(22, 22, 23, 0.8)",
                      border: "1px solid var(--border-normal)",
                      borderRadius: "10px",
                      padding: "12px",
                      color: "var(--text-primary)",
                      fontFamily: "monospace",
                      fontSize: "12px",
                      lineHeight: 1.6,
                      outline: "none",
                      resize: "none",
                    }}
                  />

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "10px" }}>
                    <button
                      type="button"
                      onClick={() => {
                        const starter =
                          activeQuestion.starterCode[
                            selectedLanguage as keyof typeof activeQuestion.starterCode
                          ] || activeQuestion.starterCode.python;
                        setCodeDraft(starter);
                      }}
                      style={{ background: "none", border: "none", color: "var(--text-secondary)", fontSize: "11px", cursor: "pointer" }}
                    >
                      Reset Starter Code
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSubmitTurn(false)}
                      disabled={isSubmittingTurn || activeSession.status === "concluded"}
                      style={{
                        padding: "8px 18px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 800,
                        background: "#2997ff",
                        color: "#ffffff",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Submit Code to {activeBot.name}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: DETAILED SCORECARD MODAL / OVERLAY */}
        {inspectedFeedback && (
          <div className="interview-modal-backdrop animate-fadeIn">
            <div className="interview-modal-content">
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setInspectedFeedback(null)}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "none",
                  border: "none",
                  color: "var(--text-secondary)",
                  fontSize: "16px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                ✕ Close
              </button>

              {/* Scorecard Header */}
              <div style={{ textAlign: "center", borderBottom: "1px solid var(--border-normal)", paddingBottom: "18px", marginBottom: "20px" }}>
                <span className="interview-hero-badge" style={{ marginBottom: "8px" }}>
                  OFFICIAL TECHNICAL ASSESSMENT SCORECARD
                </span>
                <h2 style={{ fontSize: "24px", fontWeight: 900, color: "#ffffff", margin: "0 0 10px" }}>
                  Mock Interview Evaluation
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-extrabold border ${getRecommendationBadge(
                      inspectedFeedback.recommendation,
                    )}`}
                  >
                    Hiring Verdict: {inspectedFeedback.recommendation}
                  </span>
                  <span style={{ padding: "4px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: 700, background: "rgba(255, 255, 255, 0.06)", color: "#34c759", border: "1px solid var(--border-normal)" }}>
                    Candidate NIR: {inspectedFeedback.candidateElo} (ELO {inspectedFeedback.candidateElo})
                  </span>
                  <span style={{ padding: "4px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: 700, background: "rgba(255, 255, 255, 0.06)", color: "var(--text-primary)", border: "1px solid var(--border-normal)" }}>
                    Composite Score: {inspectedFeedback.overallScore} / 100
                  </span>
                </div>
              </div>

              {/* Rubric Breakdown (5 Dimensions) */}
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#ffffff", margin: "0 0 12px" }}>
                  FAANG 5-Dimension Competency Matrix
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    { title: "Problem Solving & Algorithmic Strategy", item: inspectedFeedback.rubric.problemSolving },
                    { title: "Algorithm & Code Correctness", item: inspectedFeedback.rubric.algorithmCorrectness },
                    { title: "Time & Space Complexity Analysis", item: inspectedFeedback.rubric.complexityAnalysis },
                    { title: "Edge Case Handling & Grilling Defense", item: inspectedFeedback.rubric.grillingDefense },
                    { title: "Technical Communication & Articulation", item: inspectedFeedback.rubric.communicationClarity },
                  ].map((dim, idx) => (
                    <div key={idx} style={{ background: "rgba(0, 0, 0, 0.4)", padding: "12px 14px", borderRadius: "12px", border: "1px solid var(--border-subtle)" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" }}>
                        <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>{dim.title}</span>
                        <span style={{ fontWeight: 800, color: "#34c759" }}>
                          {dim.item.score} / {dim.item.max}
                        </span>
                      </div>
                      <div style={{ width: "100%", background: "var(--bg-pill)", height: "6px", borderRadius: "99px", overflow: "hidden", marginBottom: "6px" }}>
                        <div
                          style={{
                            background: "linear-gradient(90deg, #34c759, #2997ff)",
                            height: "100%",
                            width: `${(dim.item.score / dim.item.max) * 100}%`,
                          }}
                        />
                      </div>
                      <p style={{ margin: 0, fontSize: "11px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                        {dim.item.feedback}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px", fontSize: "12px", marginBottom: "20px" }}>
                <div style={{ background: "rgba(52, 199, 89, 0.08)", border: "1px solid rgba(52, 199, 89, 0.25)", padding: "14px", borderRadius: "12px" }}>
                  <h4 style={{ margin: "0 0 8px", fontWeight: 800, color: "#34c759" }}>✓ Observed Strengths</h4>
                  <ul style={{ margin: 0, paddingLeft: "16px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    {inspectedFeedback.strengths.map((str, i) => (
                      <li key={i}>{str}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ background: "rgba(255, 159, 10, 0.08)", border: "1px solid rgba(255, 159, 10, 0.25)", padding: "14px", borderRadius: "12px" }}>
                  <h4 style={{ margin: "0 0 8px", fontWeight: 800, color: "#ff9f0a" }}>⚡ Priority Action Items</h4>
                  <ul style={{ margin: 0, paddingLeft: "16px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    {inspectedFeedback.improvements.map((imp, i) => (
                      <li key={i}>{imp}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid var(--border-normal)", paddingTop: "14px" }}>
                <button
                  type="button"
                  onClick={() => setInspectedFeedback(null)}
                  style={{ padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, background: "rgba(255, 255, 255, 0.06)", color: "var(--text-primary)", border: "1px solid var(--border-normal)", cursor: "pointer" }}
                >
                  Close Scorecard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInspectedFeedback(null);
                    setActiveSession(null);
                  }}
                  style={{ padding: "8px 18px", borderRadius: "8px", fontSize: "12px", fontWeight: 800, background: "#34c759", color: "#000000", border: "none", cursor: "pointer" }}
                >
                  New Interview Loop
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: TOP-UP & CREDITS MODAL */}
        {showTopUpModal && (
          <div className="interview-modal-backdrop">
            <div className="interview-modal-content" style={{ maxWidth: "460px" }}>
              <button
                type="button"
                onClick={() => setShowTopUpModal(false)}
                style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", color: "var(--text-secondary)", fontSize: "16px", fontWeight: 700, cursor: "pointer" }}
              >
                ✕
              </button>

              <div style={{ marginBottom: "16px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#ffffff", margin: "0 0 4px" }}>
                  Interview Passes &amp; Credits
                </h3>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0 }}>
                  Every student receives 3 free passes each day. You can also simulate topping up additional mock interview passes to practice unlimited sessions.
                </p>
              </div>

              <div style={{ background: "rgba(0, 0, 0, 0.4)", padding: "14px", borderRadius: "12px", border: "1px solid var(--border-normal)", fontSize: "12px", marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Free Daily Passes:</span>
                  <span style={{ fontWeight: 800, color: "#34c759" }}>{credits.freeSlots} / 3</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Purchased Passes:</span>
                  <span style={{ fontWeight: 800, color: "#2997ff" }}>{credits.purchasedSlots}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border-subtle)", paddingTop: "8px" }}>
                  <span style={{ color: "#ffffff", fontWeight: 700 }}>Total Available:</span>
                  <span style={{ fontWeight: 900, color: "#ffffff", fontSize: "14px" }}>{totalSlotsAvailable}</span>
                </div>
              </div>

              {topUpMessage && (
                <div style={{ padding: "10px 12px", borderRadius: "8px", background: "rgba(52, 199, 89, 0.12)", border: "1px solid rgba(52, 199, 89, 0.3)", color: "#34c759", fontSize: "12px", marginBottom: "14px" }}>
                  {topUpMessage}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button
                  type="button"
                  onClick={handleClaimDailySlot}
                  disabled={topUpLoading}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "10px",
                    fontSize: "12px",
                    fontWeight: 700,
                    background: "rgba(255, 255, 255, 0.06)",
                    color: "#34c759",
                    border: "1px solid var(--border-normal)",
                    cursor: "pointer",
                  }}
                >
                  {topUpLoading ? "Refreshing..." : "Claim Daily Free Pass Refill (3 Slots)"}
                </button>

                <button
                  type="button"
                  onClick={() => handleTopUpPasses(5)}
                  disabled={topUpLoading}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "10px",
                    fontSize: "12px",
                    fontWeight: 800,
                    background: "linear-gradient(135deg, #34c759, #2997ff)",
                    color: "#000000",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {topUpLoading ? "Processing..." : "Add 5 Mock Interview Passes (Simulation)"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
