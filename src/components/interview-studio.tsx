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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Banner Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/portal"
            className="text-xs text-slate-400 hover:text-slate-200 transition flex items-center gap-1.5"
          >
            <span>&larr;</span> Back to Portal
          </Link>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-2">
            <span className="text-lg">🤖</span>
            <span className="font-bold text-sm sm:text-base tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
              AI Mock Interview Arena
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-700/50">
              Chess ELO Tiers
            </span>
            {signedIn && (
              <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                Student Verified
              </span>
            )}
          </div>
        </div>

        {/* Right Header Status: Passes & Audio */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setAudioMuted((prev) => !prev);
              if (!audioMuted && typeof window !== "undefined") {
                window.speechSynthesis?.cancel();
                setIsBotSpeaking(false);
              }
            }}
            className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition flex items-center gap-1.5 ${
              audioMuted
                ? "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
                : "bg-teal-950/80 border-teal-700/60 text-teal-300"
            }`}
            title={audioMuted ? "Audio Muted. Click to Unmute" : "Voice Active. Click to Mute"}
          >
            <span>{audioMuted ? "🔇 Muted" : "🔊 Voice ON"}</span>
          </button>

          {/* Interview Passes Badge */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 rounded-lg px-3 py-1">
            <span className="text-xs text-slate-300">
              Passes:{" "}
              <strong className={totalSlotsAvailable > 0 ? "text-emerald-400" : "text-rose-400"}>
                {totalSlotsAvailable}
              </strong>
            </span>
            <button
              onClick={() => setShowTopUpModal(true)}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold underline underline-offset-2 ml-1"
            >
              + Recharge
            </button>
          </div>

          {activeSession && activeSession.status === "active" && (
            <button
              onClick={() => handleSubmitTurn(true)}
              disabled={isSubmittingTurn}
              className="px-3 py-1 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition shadow-sm"
            >
              End & Score
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col p-3 sm:p-6 max-w-7xl w-full mx-auto">
        {/* Error message alert */}
        {sessionError && (
          <div className="mb-4 p-3.5 rounded-lg bg-rose-950/70 border border-rose-800/60 text-rose-200 text-xs sm:text-sm flex items-center justify-between">
            <span>{sessionError}</span>
            <button
              onClick={() => setSessionError("")}
              className="text-rose-400 hover:text-rose-200 text-xs ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* VIEW 1: LOBBY (When no active interview session is selected) */}
        {!activeSession && (
          <div className="space-y-8 animate-fadeIn">
            {/* Hero Card */}
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="max-w-3xl space-y-3 relative z-10">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Interactive Voice-Enabled AI Mock Interviewer
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Grill Your DSA Skills Against Chess-ELO Bots
                </h1>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  From supportive ELO 800 Interns to relentless ELO 2400 FAANG Bar Raisers: practice real technical
                  dialogue, defend your time/space invariants, and receive an authoritative 5-dimension hiring scorecard.
                </p>
                <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400">✓</span> Free Daily Passes
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400">✓</span> Real-Time Browser Speech TTS & Mic
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400">✓</span> Invariant & Edge Case Grilling
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400">✓</span> FAANG Scorecard & ELO Rating
                  </div>
                </div>
              </div>
            </div>

            {/* Step 1: Select Your Interviewer Bot (Chess ELO Scale) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>1. Choose Interviewer Difficulty (Chess ELO)</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Select a bot personality. Higher ELO bots will ruthlessly probe suboptimal complexities and counterexamples.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {bots.map((bot) => {
                  const isSelected = selectedBotId === bot.id;
                  return (
                    <button
                      key={bot.id}
                      onClick={() => setSelectedBotId(bot.id)}
                      className={`text-left p-4 rounded-xl border transition flex flex-col justify-between ${
                        isSelected
                          ? "bg-slate-900 border-emerald-500/80 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40"
                          : "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-wide ${
                              bot.elo >= 2400
                                ? "bg-rose-950 text-rose-300 border border-rose-800"
                                : bot.elo >= 2000
                                ? "bg-purple-950 text-purple-300 border border-purple-800"
                                : bot.elo >= 1600
                                ? "bg-amber-950 text-amber-300 border border-amber-800"
                                : bot.elo >= 1200
                                ? "bg-blue-950 text-blue-300 border border-blue-800"
                                : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                            }`}
                          >
                            ELO {bot.elo}
                          </span>
                          <span className="text-xs font-semibold text-slate-400">{bot.tier}</span>
                        </div>
                        <h3 className="font-bold text-base text-white">{bot.name}</h3>
                        <p className="text-xs text-emerald-400 font-medium mb-1.5">{bot.companyStyle}</p>
                        <p className="text-xs text-slate-400 leading-snug">{bot.tagline}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Voice: {bot.personality}</span>
                        <span className={isSelected ? "text-emerald-400 font-bold" : "text-slate-500"}>
                          {isSelected ? "● Selected" : "Select"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Technical Problem */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white">2. Select Problem Topic</h2>
                <p className="text-xs text-slate-400">
                  Pick a target problem for your live interview grilling session.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {questions.map((q) => {
                  const isSelected = selectedQuestionId === q.id;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setSelectedQuestionId(q.id)}
                      className={`text-left p-4 rounded-xl border transition ${
                        isSelected
                          ? "bg-slate-900 border-teal-500/80 shadow-lg shadow-teal-500/10 ring-1 ring-teal-500/40"
                          : "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                          {q.topic}
                        </span>
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                            q.difficulty === "Easy"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-800/50"
                              : q.difficulty === "Medium"
                              ? "bg-amber-950 text-amber-400 border border-amber-800/50"
                              : "bg-rose-950 text-rose-400 border border-rose-800/50"
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-white mb-1">{q.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-3">{q.prompt}</p>
                      <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
                        <span>Target: {q.expectedOptimalTime}</span>
                        <span className={isSelected ? "text-teal-400 font-bold" : "text-slate-500"}>
                          {isSelected ? "● Selected" : "Select"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Start Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/70 p-5 rounded-2xl border border-slate-800">
              <div className="text-sm">
                <span className="text-slate-400">Ready to interview with </span>
                <strong className="text-white">{activeBot.name}</strong>
                <span className="text-slate-400"> (ELO {activeBot.elo}) on </span>
                <strong className="text-teal-400">{activeQuestion.title}</strong>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleStartSession}
                  disabled={isStartingSession || totalSlotsAvailable <= 0}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm transition shadow-lg ${
                    totalSlotsAvailable > 0
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed"
                  }`}
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
              <div className="space-y-3 pt-4">
                <h3 className="text-base font-bold text-white">Your Past Mock Interviews</h3>
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
                      <tr>
                        <th className="p-3">Date</th>
                        <th className="p-3">Interviewer</th>
                        <th className="p-3">Problem</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Score</th>
                        <th className="p-3">Recommendation</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 bg-slate-950">
                      {sessions.map((s) => {
                        const bot = bots.find((b) => b.id === s.botId) || bots[0];
                        const q = questions.find((item) => item.id === s.questionId) || questions[0];
                        return (
                          <tr key={s.id} className="hover:bg-slate-900/40">
                            <td className="p-3 text-slate-400">{s.createdAt.slice(0, 10)}</td>
                            <td className="p-3 font-semibold text-white">
                              {bot.name} <span className="text-slate-400 text-[11px]">(ELO {s.botElo})</span>
                            </td>
                            <td className="p-3 text-slate-300">{q.title}</td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                  s.status === "concluded"
                                    ? "bg-slate-800 text-slate-300"
                                    : "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                }`}
                              >
                                {s.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="p-3 font-bold text-emerald-400">
                              {s.feedback ? `${s.feedback.overallScore}/100` : "—"}
                            </td>
                            <td className="p-3">
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
                            <td className="p-3 text-right">
                              {s.feedback ? (
                                <button
                                  onClick={() => setInspectedFeedback(s.feedback)}
                                  className="text-xs text-sky-400 hover:text-sky-300 font-semibold"
                                >
                                  View Scorecard
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setActiveSession(s);
                                    setCodeDraft(s.code || "");
                                    setSelectedLanguage(s.language || "python");
                                  }}
                                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
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

        {/* VIEW 2: ACTIVE INTERVIEW STUDIO (Split Screen) */}
        {activeSession && (
          <div className="flex-1 flex flex-col space-y-4 animate-fadeIn">
            {/* Top Cockpit Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
              {/* Bot Info */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm bg-gradient-to-tr ${activeBot.avatarColor} text-white shadow-md relative`}
                >
                  {activeBot.name[0]}
                  {isBotSpeaking && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm sm:text-base">{activeBot.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      ELO {activeBot.elo}
                    </span>
                    <span className="text-xs text-emerald-400 hidden sm:inline">{activeBot.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{activeBot.tagline}</p>
                </div>
              </div>

              {/* Stage Tracker */}
              <div className="hidden lg:flex items-center gap-1 text-[11px]">
                {STAGES_ORDER.map((stg, idx) => {
                  const isActive = activeSession.stage === stg;
                  const isPast =
                    STAGES_ORDER.indexOf(activeSession.stage) > idx || activeSession.stage === "CONCLUDED";
                  return (
                    <div key={stg} className="flex items-center">
                      <span
                        className={`px-2 py-0.5 rounded font-semibold ${
                          isActive
                            ? "bg-emerald-500 text-slate-950 font-bold shadow"
                            : isPast
                            ? "bg-slate-800 text-slate-300"
                            : "bg-slate-950/60 text-slate-600"
                        }`}
                      >
                        {stg}
                      </span>
                      {idx < STAGES_ORDER.length - 1 && <span className="text-slate-700 mx-1">&rarr;</span>}
                    </div>
                  );
                })}
              </div>

              {/* Cockpit Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (activeSession.feedback) {
                      setInspectedFeedback(activeSession.feedback);
                    } else {
                      handleSubmitTurn(true);
                    }
                  }}
                  disabled={isSubmittingTurn}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
                >
                  {activeSession.status === "concluded" ? "View Scorecard" : "Conclude & Score"}
                </button>
                <button
                  onClick={() => setActiveSession(null)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Exit Lobby
                </button>
              </div>
            </div>

            {/* Split Screen Container */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* LEFT PANE: Conversational Chat & Voice (7 columns) */}
              <div className="lg:col-span-7 flex flex-col bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden h-[620px]">
                {/* Audio Waveform Banner when Bot Speaks */}
                {isBotSpeaking && (
                  <div className="bg-emerald-950/60 border-b border-emerald-800/40 px-4 py-2 flex items-center justify-between text-xs text-emerald-300 animate-pulse">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🎙️</span>
                      <span>{activeBot.name} is speaking...</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-3 bg-emerald-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-5 bg-emerald-400 rounded-full animate-bounce delay-100"></span>
                      <span className="w-1.5 h-2 bg-emerald-400 rounded-full animate-bounce delay-200"></span>
                    </div>
                  </div>
                )}

                {/* Messages Transcript Scroll Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {activeSession.messages.map((msg) => {
                    const isBot = msg.sender === "bot";
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 text-xs sm:text-sm ${
                          isBot ? "justify-start" : "justify-end"
                        }`}
                      >
                        {isBot && (
                          <div
                            className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs bg-gradient-to-tr ${activeBot.avatarColor} text-white mt-0.5`}
                          >
                            {activeBot.name[0]}
                          </div>
                        )}

                        <div
                          className={`max-w-[85%] rounded-2xl p-3.5 space-y-1.5 ${
                            isBot
                              ? "bg-slate-800/90 text-slate-100 rounded-tl-none border border-slate-700/60"
                              : "bg-emerald-600/90 text-slate-950 rounded-tr-none font-medium shadow-md"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 text-[10px] opacity-75">
                            <span className="font-semibold">
                              {isBot ? `${activeBot.name} (${msg.stage})` : "You (Candidate)"}
                            </span>
                            <span>{msg.timestamp ? msg.timestamp.slice(11, 16) : ""}</span>
                          </div>

                          <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>

                          {/* Code Snippet attachment if candidate submitted code */}
                          {msg.codeSnippet && (
                            <div className="mt-2 p-2 rounded bg-slate-950/90 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-36 border border-slate-800">
                              <pre>{msg.codeSnippet}</pre>
                            </div>
                          )}

                          {isBot && msg.audioScript && (
                            <button
                              onClick={() =>
                                speakText(msg.audioScript || msg.text, activeBot.speechPitch, activeBot.speechRate)
                              }
                              className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 pt-1 opacity-90"
                            >
                              <span>🔊 Replay Voice</span>
                            </button>
                          )}
                        </div>

                        {!isBot && (
                          <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs bg-slate-700 text-slate-200 mt-0.5">
                            U
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Bottom Input & Voice Cockpit */}
                <div className="p-3 bg-slate-900 border-t border-slate-800 space-y-2">
                  {micStatusText && (
                    <div className="text-[11px] text-teal-400 flex items-center gap-1.5 px-2">
                      <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
                      <span>{micStatusText}</span>
                    </div>
                  )}

                  <div className="flex gap-2 items-center">
                    {/* Microphone Toggle Button */}
                    <button
                      type="button"
                      onClick={isRecordingMic ? stopMicRecording : startMicRecording}
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                        isRecordingMic
                          ? "bg-rose-600 text-white animate-pulse"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                      }`}
                      title={isRecordingMic ? "Click to stop mic recording" : "Click to speak aloud with mic"}
                    >
                      <span>{isRecordingMic ? "⏹️ Stop Mic" : "🎙️ Speak"}</span>
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
                      placeholder="Type your clarification, algorithm approach, or complexity..."
                      disabled={isSubmittingTurn || activeSession.status === "concluded"}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition resize-none"
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
                      className="px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 disabled:bg-slate-800 disabled:text-slate-600 transition shadow-sm h-full"
                    >
                      {isSubmittingTurn ? "Evaluating..." : "Send"}
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT PANE: Problem Description & Code Editor (5 columns) */}
              <div className="lg:col-span-5 flex flex-col bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden h-[620px]">
                {/* Right Tabs Header */}
                <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-900">
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <span>{activeQuestion.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-teal-950 text-teal-300 border border-teal-800">
                        {activeQuestion.difficulty}
                      </span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none"
                    >
                      <option value="python">Python 3</option>
                      <option value="javascript">JavaScript</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                    </select>
                  </div>
                </div>

                {/* Problem Specs Accordion */}
                <div className="p-3.5 border-b border-slate-800/80 bg-slate-950/40 text-xs space-y-2 max-h-48 overflow-y-auto">
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{activeQuestion.prompt}</p>
                  <div className="pt-1 space-y-1">
                    <span className="font-semibold text-slate-400 text-[11px]">Constraints:</span>
                    <ul className="list-disc list-inside text-slate-400 space-y-0.5">
                      {activeQuestion.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Code Scratchpad */}
                <div className="flex-1 flex flex-col p-3 bg-slate-950 font-mono text-xs">
                  <div className="flex items-center justify-between pb-1.5 text-[11px] text-slate-400">
                    <span>Solution Editor ({selectedLanguage})</span>
                    <span>Target: {activeQuestion.expectedOptimalTime}</span>
                  </div>

                  <textarea
                    value={codeDraft}
                    onChange={(e) => setCodeDraft(e.target.value)}
                    placeholder="// Write your code here and submit to interviewer..."
                    className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-100 font-mono text-xs leading-relaxed focus:outline-none focus:border-teal-500 resize-none"
                  />

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => {
                        const starter =
                          activeQuestion.starterCode[
                            selectedLanguage as keyof typeof activeQuestion.starterCode
                          ] || activeQuestion.starterCode.python;
                        setCodeDraft(starter);
                      }}
                      className="text-[11px] text-slate-400 hover:text-slate-200"
                    >
                      Reset Starter Code
                    </button>

                    <button
                      onClick={() => handleSubmitTurn(false)}
                      disabled={isSubmittingTurn || activeSession.status === "concluded"}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 transition"
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
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
              {/* Close Button */}
              <button
                onClick={() => setInspectedFeedback(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 text-sm font-bold p-2"
              >
                ✕ Close
              </button>

              {/* Scorecard Header */}
              <div className="text-center space-y-2 border-b border-slate-800 pb-5">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Official Technical Assessment Scorecard
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Mock Interview Evaluation
                </h2>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-extrabold border ${getRecommendationBadge(
                      inspectedFeedback.recommendation,
                    )}`}
                  >
                    Hiring Verdict: {inspectedFeedback.recommendation}
                  </span>
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                    Candidate Rating: ELO {inspectedFeedback.candidateElo}
                  </span>
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700">
                    Composite Score: {inspectedFeedback.overallScore} / 100
                  </span>
                </div>
              </div>

              {/* Rubric Breakdown (5 Dimensions) */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-300">FAANG 5-Dimension Competency Matrix</h3>
                <div className="space-y-3">
                  {[
                    { title: "Problem Solving & Algorithmic Strategy", item: inspectedFeedback.rubric.problemSolving },
                    { title: "Algorithm & Code Correctness", item: inspectedFeedback.rubric.algorithmCorrectness },
                    { title: "Time & Space Complexity Analysis", item: inspectedFeedback.rubric.complexityAnalysis },
                    { title: "Edge Case Handling & Grilling Defense", item: inspectedFeedback.rubric.grillingDefense },
                    { title: "Technical Communication & Articulation", item: inspectedFeedback.rubric.communicationClarity },
                  ].map((dim, idx) => (
                    <div key={idx} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200">{dim.title}</span>
                        <span className="font-bold text-emerald-400">
                          {dim.item.score} / {dim.item.max}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all"
                          style={{ width: `${(dim.item.score / dim.item.max) * 100}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">{dim.item.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-emerald-950/30 border border-emerald-800/40 p-4 rounded-xl space-y-2">
                  <h4 className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <span>✓</span> Observed Strengths
                  </h4>
                  <ul className="space-y-1.5 text-slate-300">
                    {inspectedFeedback.strengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-950/30 border border-amber-800/40 p-4 rounded-xl space-y-2">
                  <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
                    <span>⚡</span> Priority Action Items
                  </h4>
                  <ul className="space-y-1.5 text-slate-300">
                    {inspectedFeedback.improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setInspectedFeedback(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                >
                  Close Scorecard
                </button>
                <button
                  onClick={() => {
                    setInspectedFeedback(null);
                    setActiveSession(null);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition"
                >
                  New Interview Loop
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: TOP-UP & CREDITS MODAL */}
        {showTopUpModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
              <button
                onClick={() => setShowTopUpModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Interview Passes & Credits</h3>
                <p className="text-xs text-slate-400">
                  Every student receives 3 complimentary passes each day. You can also simulate topping up additional mock interview passes.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Free Daily Passes:</span>
                  <span className="font-bold text-emerald-400">{credits.freeSlots} / 3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Purchased Passes:</span>
                  <span className="font-bold text-sky-400">{credits.purchasedSlots}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-1.5">
                  <span className="text-slate-200 font-semibold">Total Available:</span>
                  <span className="font-bold text-white text-sm">{totalSlotsAvailable}</span>
                </div>
              </div>

              {topUpMessage && (
                <div className="p-3 rounded-lg bg-teal-950/80 border border-teal-800/80 text-teal-300 text-xs">
                  {topUpMessage}
                </div>
              )}

              <div className="space-y-2.5 pt-1">
                <button
                  onClick={handleClaimDailySlot}
                  disabled={topUpLoading}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 transition"
                >
                  {topUpLoading ? "Refreshing..." : "Claim Daily Free Pass Refill (3 Slots)"}
                </button>

                <button
                  onClick={() => handleTopUpPasses(5)}
                  disabled={topUpLoading}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 transition shadow-md"
                >
                  {topUpLoading ? "Processing..." : "Add 5 Mock Interview Passes (Simulation)"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
