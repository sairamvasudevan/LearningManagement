"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import type { ModuleCurriculum } from "@/lib/curriculum-data";
import type { WebDevLesson } from "@/lib/web-dev-data";

export interface AudioChunk {
  title?: string;
  text: string;
}

/**
 * Converts a 100-Hour Flagship module curriculum into clean spoken audio chunks.
 */
export function moduleCurriculumToAudioChunks(curriculum: ModuleCurriculum): AudioChunk[] {
  const chunks: AudioChunk[] = [];

  // 1. Introduction
  chunks.push({
    title: `Module ${curriculum.moduleNumber}: Overview`,
    text: `Module ${curriculum.moduleNumber}: ${curriculum.title}. Stage: ${curriculum.stageTitle}. Learning Objective: ${curriculum.objective}. Estimated study time is ${curriculum.readTime}.`,
  });

  // 2. Sections
  for (const s of curriculum.sections) {
    let body = s.content.join(" ");
    if (s.callout) {
      const calloutPrefix =
        s.callout.type === "warning"
          ? "Caution and edge case:"
          : s.callout.type === "tip"
          ? "Pro tip:"
          : "Key engineering rule:";
      body += ` ${calloutPrefix} ${s.callout.title}. ${s.callout.text}`;
    }
    chunks.push({
      title: s.title,
      text: `${s.kicker}. ${s.title}. ${body}`,
    });
  }

  // 3. Worked Case Studies
  for (const cs of curriculum.caseStudies) {
    let csText = `Worked Case Study: ${cs.title}. Domain: ${cs.tag}. Problem Specification: ${cs.problem}. Common Flawed Approach: ${cs.flawedApproach}. The Correct Invariant: ${cs.correctInvariant}.`;
    if (cs.codeOrContract) {
      csText += ` Invariant contract: ${cs.codeOrContract}`;
    }
    chunks.push({
      title: `Case Study: ${cs.title}`,
      text: csText,
    });
  }

  // 4. Checklist & Mental Model Invariants
  if (curriculum.checklist && curriculum.checklist.length > 0) {
    chunks.push({
      title: "Mental Model Invariants Checklist",
      text: `Key Invariants to Remember before checkpoint: ${curriculum.checklist.join(". ")}.`,
    });
  }

  // 5. Practice task
  if (curriculum.practiceTask) {
    chunks.push({
      title: "Hands-on Practice Task",
      text: `Hands-on Practice Task: ${curriculum.practiceTask.title}. Prompt: ${curriculum.practiceTask.prompt}. Enter your solution in the interactive code studio below.`,
    });
  }

  return chunks;
}

/**
 * Audio reader widget for course syllabus and detail pages.
 */
export function CourseDetailAudioReader({
  title,
  category,
  description,
  highlights,
  skills,
  totalHours,
  totalPaths,
}: {
  title: string;
  category: string;
  description: string;
  highlights: string[];
  skills: string[];
  totalHours: number;
  totalPaths: number;
}) {
  const chunks: AudioChunk[] = [
    {
      title: "Course Overview",
      text: `${title}. Category: ${category}. ${description}`,
    },
    {
      title: "Core Curriculum Highlights",
      text: `Course highlights: ${highlights.join(". ")}. Total curriculum covers ${totalHours} hours across ${totalPaths} structured phases with an 80% mastery checkpoint threshold.`,
    },
    {
      title: "Skills and Competencies",
      text: `Key competencies and skills covered: ${skills.join(", ")}.`,
    },
  ];

  return (
    <AudioReader
      title={title}
      subtitle={`${category} · ${totalHours} Hours · Syllabus audio overview`}
      chunks={chunks}
      badgeLabel="Syllabus Audio"
    />
  );
}

/**
 * Converts a Web Development lesson into clean spoken audio chunks.
 */
export function webDevLessonToAudioChunks(lesson: WebDevLesson): AudioChunk[] {
  const chunks: AudioChunk[] = [];

  chunks.push({
    title: `Chapter ${lesson.number}: ${lesson.title}`,
    text: `Chapter ${lesson.number}: ${lesson.title}. Track: ${lesson.track}. Difficulty level: ${lesson.difficulty}. Objective: ${lesson.objective}.`,
  });

  if (typeof lesson.conceptGuide === "string") {
    const rawSections = lesson.conceptGuide.split(/###\s+/).filter(Boolean);
    if (rawSections.length > 0) {
      for (const sec of rawSections) {
        const lines = sec.trim().split("\n");
        const heading = lines[0]?.trim() || "Concept Guide";
        const body = lines.slice(1).join(" ").trim();
        chunks.push({
          title: heading,
          text: `${heading}. ${body}`,
        });
      }
    } else {
      chunks.push({
        title: "Concept Tutorial",
        text: lesson.conceptGuide,
      });
    }
  }

  if (lesson.tryItExample) {
    chunks.push({
      title: `Try It Example: ${lesson.tryItExample.title}`,
      text: `Try it yourself example: ${lesson.tryItExample.title}. ${lesson.tryItExample.description}`,
    });
  }

  if (lesson.requirements && lesson.requirements.length > 0) {
    chunks.push({
      title: "Hands-on Challenge Requirements",
      text: `Hands-on practice challenge requirements: ${lesson.requirements
        .map((r, i) => `Requirement ${i + 1}: ${r.description}`)
        .join(". ")}.`,
    });
  }

  return chunks;
}

interface AudioReaderProps {
  title: string;
  subtitle?: string;
  chunks: AudioChunk[];
  badgeLabel?: string;
  className?: string;
  autoScroll?: boolean;
}

/**
 * Modern Text-to-Speech audio reader using standard Web Speech API.
 * Includes chunking, rate control, voice selection, audio scrubber,
 * animated visualizer, and keyboard shortcuts.
 */
export function AudioReader({
  title,
  subtitle,
  chunks,
  badgeLabel = "Audio Narrator",
  className = "",
  autoScroll = true,
}: AudioReaderProps) {
  const [supported, setSupported] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "playing" | "paused">("idle");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rate, setRate] = useState<number>(1.0);
  const [showVoiceMenu, setShowVoiceMenu] = useState(false);
  const [showRateMenu, setShowRateMenu] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isPlayingRef = useRef(false);
  const currentIndexRef = useRef(0);
  const rateRef = useRef(rate);
  const voiceURIRef = useRef(selectedVoiceURI);

  // Sync refs
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    rateRef.current = rate;
  }, [rate]);

  useEffect(() => {
    voiceURIRef.current = selectedVoiceURI;
  }, [selectedVoiceURI]);

  // Check browser support and load voices
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!("speechSynthesis" in window)) {
        setSupported(false);
        return;
      }
      setSupported(true);

      const updateVoices = () => {
        const available = window.speechSynthesis.getVoices();
        // Prioritize natural English voices
        const englishVoices = available.filter(
          (v) => v.lang.startsWith("en") || v.lang.startsWith("en-US") || v.lang.startsWith("en-GB")
        );
        const voiceList = englishVoices.length > 0 ? englishVoices : available;
        setVoices(voiceList);

        // Pick preferred default voice: Google or Apple or Microsoft natural
        if (!voiceURIRef.current && voiceList.length > 0) {
          const preferred =
            voiceList.find((v) => v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Daniel")) ||
            voiceList.find((v) => v.lang === "en-US") ||
            voiceList[0];
          setSelectedVoiceURI(preferred.voiceURI);
        }
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;

      return () => {
        window.speechSynthesis.onvoiceschanged = null;
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
        }
      };
    }
  }, []);

  // Clean narration text: format math/code symbols into speech-friendly words
  const cleanForSpeech = useCallback((text: string) => {
    return text
      .replace(/`([^`]+)`/g, "$1") // strip backticks
      .replace(/\bO\(1\)/g, "order of 1 constant time")
      .replace(/\bO\(n\)/gi, "order of n linear time")
      .replace(/\bO\(n log n\)/gi, "order of n log n time")
      .replace(/\bO\(n\^2\)/gi, "order of n squared time")
      .replace(/==/g, " equals ")
      .replace(/!=/g, " does not equal ")
      .replace(/<=/g, " less than or equal to ")
      .replace(/>=/g, " greater than or equal to ")
      .replace(/->/g, " points to ")
      .replace(/&&/g, " and ")
      .replace(/\|\|/g, " or ")
      .replace(/arr\[i\]/gi, "array at index i")
      .replace(/\[\s*\]/g, "empty array")
      .replace(/\*\*/g, "") // strip bold
      .replace(/[#_*]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }, []);

  // Speak a specific chunk
  const speakChunk = useCallback(
    (index: number) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      if (index < 0 || index >= chunks.length) {
        setStatus("idle");
        isPlayingRef.current = false;
        setCurrentIndex(0);
        return;
      }

      window.speechSynthesis.cancel();

      const chunk = chunks[index];
      const speechText = cleanForSpeech(chunk.text);
      if (!speechText) {
        // Skip empty chunk
        if (index + 1 < chunks.length) {
          speakChunk(index + 1);
        } else {
          setStatus("idle");
          isPlayingRef.current = false;
        }
        return;
      }

      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.rate = rateRef.current;
      utterance.pitch = 1.0;

      // Assign voice
      if (voiceURIRef.current) {
        const foundVoice = window.speechSynthesis.getVoices().find((v) => v.voiceURI === voiceURIRef.current);
        if (foundVoice) utterance.voice = foundVoice;
      }

      utterance.onstart = () => {
        setStatus("playing");
        isPlayingRef.current = true;
        setCurrentIndex(index);
      };

      utterance.onend = () => {
        if (!isPlayingRef.current) return;
        if (index + 1 < chunks.length) {
          speakChunk(index + 1);
        } else {
          setStatus("idle");
          isPlayingRef.current = false;
          setCurrentIndex(0);
        }
      };

      utterance.onerror = (e) => {
        // If canceled explicitly, ignore
        if (e.error === "canceled" || e.error === "interrupted") return;
        if (index + 1 < chunks.length) {
          speakChunk(index + 1);
        } else {
          setStatus("idle");
          isPlayingRef.current = false;
        }
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [chunks, cleanForSpeech]
  );

  // Play / Resume
  const handlePlay = useCallback(() => {
    if (!supported || chunks.length === 0) return;

    if (status === "paused") {
      window.speechSynthesis.resume();
      setStatus("playing");
      isPlayingRef.current = true;
    } else {
      speakChunk(currentIndex);
    }
  }, [supported, chunks, status, currentIndex, speakChunk]);

  // Pause
  const handlePause = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.pause();
    setStatus("paused");
    isPlayingRef.current = false;
  }, []);

  // Stop
  const handleStop = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setStatus("idle");
    isPlayingRef.current = false;
    setCurrentIndex(0);
  }, []);

  // Previous chunk
  const handlePrev = useCallback(() => {
    const nextIdx = Math.max(0, currentIndex - 1);
    setCurrentIndex(nextIdx);
    if (status === "playing") {
      speakChunk(nextIdx);
    }
  }, [currentIndex, status, speakChunk]);

  // Next chunk
  const handleNext = useCallback(() => {
    const nextIdx = Math.min(chunks.length - 1, currentIndex + 1);
    setCurrentIndex(nextIdx);
    if (status === "playing") {
      speakChunk(nextIdx);
    }
  }, [currentIndex, chunks.length, status, speakChunk]);

  // Change speed rate
  const handleRateChange = useCallback(
    (newRate: number) => {
      setRate(newRate);
      rateRef.current = newRate;
      setShowRateMenu(false);
      if (status === "playing") {
        speakChunk(currentIndexRef.current);
      }
    },
    [status, speakChunk]
  );

  // Change voice
  const handleVoiceChange = useCallback(
    (uri: string) => {
      setSelectedVoiceURI(uri);
      voiceURIRef.current = uri;
      setShowVoiceMenu(false);
      if (status === "playing") {
        speakChunk(currentIndexRef.current);
      }
    },
    [status, speakChunk]
  );

  // Keyboard controls: space for play/pause, esc to stop
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === "Space" && status !== "idle") {
        e.preventDefault();
        if (status === "playing") handlePause();
        else handlePlay();
      } else if (e.code === "Escape" && status !== "idle") {
        handleStop();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [status, handlePause, handlePlay, handleStop]);

  // Calculate total reading duration (~150 words per minute)
  const totalWords = chunks.reduce((acc, c) => acc + c.text.split(/\s+/).length, 0);
  const totalMinutes = Math.max(1, Math.ceil(totalWords / 150));
  const currentChunk = chunks[currentIndex] || chunks[0];
  const progressPercent = chunks.length > 0 ? Math.round(((currentIndex + 1) / chunks.length) * 100) : 0;

  if (!supported) {
    return (
      <div
        className={`audio-reader-card ${className}`}
        style={{
          background: "#0f172a",
          border: "1px dashed #334155",
          borderRadius: "12px",
          padding: "12px 18px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          margin: "16px 0 24px",
          color: "#94a3b8",
          fontSize: "13px",
        }}
      >
        <span>🎧</span>
        <span>Audio narration is not supported on this browser (SpeechSynthesis API unavailable).</span>
      </div>
    );
  }

  return (
    <>
      {/* Inline Launch Button / Pill Card */}
      <div
        className={`audio-reader-card ${className}`}
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
          border: "1px solid #3730a3",
          borderRadius: "12px",
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
          boxShadow: "0 4px 20px rgba(55, 48, 163, 0.18)",
          margin: "16px 0 24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: status === "playing" ? "#4f46e5" : "rgba(79, 70, 229, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              color: "#ffffff",
              flexShrink: 0,
              boxShadow: status === "playing" ? "0 0 16px rgba(99, 102, 241, 0.5)" : "none",
              transition: "all 0.3s ease",
            }}
          >
            {status === "playing" ? "🔊" : "🎧"}
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span
                style={{
                  background: "#4f46e5",
                  color: "#ffffff",
                  fontSize: "10px",
                  fontWeight: 800,
                  padding: "2px 8px",
                  borderRadius: "99px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {badgeLabel}
              </span>
              <span style={{ fontSize: "12px", color: "#a5b4fc", fontWeight: 600 }}>
                ⏱ ~{totalMinutes} min listen · {chunks.length} sections
              </span>
            </div>

            <div style={{ fontSize: "14px", fontWeight: 700, color: "#f8fafc" }}>
              {status === "playing"
                ? `Narrating: ${currentChunk?.title || `Section ${currentIndex + 1}`}`
                : "Listen to this lesson as audio"}
            </div>
            {subtitle && (
              <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
                {subtitle}
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {status === "idle" ? (
            <button
              type="button"
              onClick={handlePlay}
              className="button button-cn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 18px",
                fontSize: "13px",
                fontWeight: 700,
                background: "#4f46e5",
                borderColor: "#4f46e5",
                boxShadow: "0 2px 10px rgba(79, 70, 229, 0.3)",
              }}
            >
              <span>▶ Play Audio Lesson</span>
            </button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                type="button"
                onClick={status === "playing" ? handlePause : handlePlay}
                className="button button-cn-primary"
                style={{
                  padding: "8px 16px",
                  fontSize: "13px",
                  fontWeight: 700,
                  background: status === "playing" ? "#f59e0b" : "#10b981",
                  borderColor: status === "playing" ? "#f59e0b" : "#10b981",
                }}
              >
                {status === "playing" ? "⏸ Pause" : "▶ Resume"}
              </button>
              <button
                type="button"
                onClick={handleStop}
                className="button button-quiet"
                style={{ padding: "8px 14px", fontSize: "12px", color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.3)" }}
              >
                ⏹ Stop
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Docked Audio Player (Active when Playing or Paused) */}
      {status !== "idle" && (
        <div
          className="audio-dock-container"
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "calc(100% - 40px)",
            maxWidth: "820px",
            background: "rgba(15, 23, 42, 0.95)",
            backdropFilter: "blur(16px)",
            border: "1px solid #3730a3",
            borderRadius: "16px",
            padding: minimized ? "10px 18px" : "16px 22px",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6), 0 0 20px rgba(99, 102, 241, 0.25)",
            zIndex: 9999,
            color: "#ffffff",
            transition: "all 0.3s ease",
          }}
        >
          {/* Top Row: Title, Audio Visualizer, Minimize, Close */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: minimized ? 0 : "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", overflow: "hidden" }}>
              {/* Animated Audio Equalizer Visualizer */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "18px", width: "18px" }}>
                {[0.6, 1.0, 0.4, 0.8].map((h, i) => (
                  <span
                    key={i}
                    style={{
                      width: "3px",
                      height: status === "playing" ? `${h * 100}%` : "30%",
                      background: "#38bdf8",
                      borderRadius: "2px",
                      animation: status === "playing" ? `pulseBar ${0.5 + i * 0.15}s ease infinite alternate` : "none",
                    }}
                  />
                ))}
              </div>

              <div style={{ minWidth: 0, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                <div style={{ fontSize: "13px", fontWeight: 800, color: "#f8fafc", textOverflow: "ellipsis", overflow: "hidden" }}>
                  {currentChunk?.title || title}
                </div>
                {!minimized && (
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                    Section {currentIndex + 1} of {chunks.length} · {progressPercent}% listened
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <button
                type="button"
                onClick={() => setMinimized(!minimized)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  fontSize: "16px",
                  cursor: "pointer",
                  padding: "4px",
                }}
                title={minimized ? "Expand Audio Player" : "Minimize"}
              >
                {minimized ? "🔼" : "🔽"}
              </button>
              <button
                type="button"
                onClick={handleStop}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ef4444",
                  fontSize: "16px",
                  cursor: "pointer",
                  padding: "4px",
                }}
                title="Close Audio Reader"
              >
                ✕
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Progress Scrubber */}
              <div style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    height: "6px",
                    background: "#1e293b",
                    borderRadius: "99px",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const pct = clickX / rect.width;
                    const targetIdx = Math.min(chunks.length - 1, Math.max(0, Math.floor(pct * chunks.length)));
                    setCurrentIndex(targetIdx);
                    if (status === "playing") speakChunk(targetIdx);
                  }}
                  title="Click to seek sections"
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${progressPercent}%`,
                      background: "linear-gradient(90deg, #4f46e5, #38bdf8)",
                      borderRadius: "99px",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>

              {/* Current spoken snippet snippet preview */}
              <div
                style={{
                  fontSize: "12px",
                  color: "#cbd5e1",
                  background: "rgba(30, 41, 59, 0.6)",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  marginBottom: "12px",
                  maxHeight: "44px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontStyle: "italic",
                  lineHeight: 1.4,
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                &ldquo;{cleanForSpeech(currentChunk?.text || "").slice(0, 160)}...&rdquo;
              </div>

              {/* Main Controls Row: Previous, Play/Pause, Next, Speed, Voice */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                {/* Playback Transport Buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    style={{
                      background: "#1e293b",
                      border: "1px solid #334155",
                      color: currentIndex === 0 ? "#475569" : "#e2e8f0",
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                    }}
                    title="Previous Section (⏮)"
                  >
                    ⏮
                  </button>

                  <button
                    type="button"
                    onClick={status === "playing" ? handlePause : handlePlay}
                    style={{
                      background: status === "playing" ? "#f59e0b" : "#4f46e5",
                      border: "none",
                      color: "#ffffff",
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)",
                    }}
                    title={status === "playing" ? "Pause (Space)" : "Play (Space)"}
                  >
                    {status === "playing" ? "⏸" : "▶"}
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={currentIndex === chunks.length - 1}
                    style={{
                      background: "#1e293b",
                      border: "1px solid #334155",
                      color: currentIndex === chunks.length - 1 ? "#475569" : "#e2e8f0",
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      cursor: currentIndex === chunks.length - 1 ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                    }}
                    title="Next Section (⏭)"
                  >
                    ⏭
                  </button>
                </div>

                {/* Speed & Voice Controls */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", position: "relative" }}>
                  {/* Speed Selector */}
                  <div style={{ position: "relative" }}>
                    <button
                      type="button"
                      onClick={() => setShowRateMenu(!showRateMenu)}
                      style={{
                        background: "#1e293b",
                        border: "1px solid #334155",
                        color: "#38bdf8",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                      title="Playback Speed"
                    >
                      ⚡ {rate}x
                    </button>

                    {showRateMenu && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "42px",
                          right: "0",
                          background: "#0f172a",
                          border: "1px solid #334155",
                          borderRadius: "8px",
                          padding: "6px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                          boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                          zIndex: 10000,
                          minWidth: "90px",
                        }}
                      >
                        {[0.75, 1.0, 1.25, 1.5, 1.75, 2.0].map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => handleRateChange(r)}
                            style={{
                              background: rate === r ? "#4f46e5" : "transparent",
                              border: "none",
                              color: "#f8fafc",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              fontWeight: rate === r ? 800 : 500,
                              cursor: "pointer",
                              textAlign: "left",
                            }}
                          >
                            {r}x {r === 1.0 ? "(Normal)" : ""}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Voice Selector */}
                  {voices.length > 0 && (
                    <div style={{ position: "relative" }}>
                      <button
                        type="button"
                        onClick={() => setShowVoiceMenu(!showVoiceMenu)}
                        style={{
                          background: "#1e293b",
                          border: "1px solid #334155",
                          color: "#cbd5e1",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                          maxWidth: "160px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title="Select Audio Voice"
                      >
                        🗣️ {voices.find((v) => v.voiceURI === selectedVoiceURI)?.name.split(" ")[0] || "Voice"}
                      </button>

                      {showVoiceMenu && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "42px",
                            right: "0",
                            background: "#0f172a",
                            border: "1px solid #334155",
                            borderRadius: "8px",
                            padding: "6px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                            zIndex: 10000,
                            maxHeight: "220px",
                            overflowY: "auto",
                            minWidth: "220px",
                          }}
                        >
                          <div style={{ fontSize: "10px", fontWeight: 800, color: "#94a3b8", padding: "4px 8px", textTransform: "uppercase" }}>
                            Select Narrator Voice
                          </div>
                          {voices.slice(0, 10).map((v) => (
                            <button
                              key={v.voiceURI}
                              type="button"
                              onClick={() => handleVoiceChange(v.voiceURI)}
                              style={{
                                background: selectedVoiceURI === v.voiceURI ? "#4f46e5" : "transparent",
                                border: "none",
                                color: "#f8fafc",
                                padding: "6px 8px",
                                borderRadius: "4px",
                                fontSize: "11px",
                                fontWeight: selectedVoiceURI === v.voiceURI ? 700 : 500,
                                cursor: "pointer",
                                textAlign: "left",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {v.name} ({v.lang})
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Visualizer CSS Keyframe */}
      <style jsx global>{`
        @keyframes pulseBar {
          0% {
            height: 20%;
          }
          100% {
            height: 100%;
          }
        }
      `}</style>
    </>
  );
}
